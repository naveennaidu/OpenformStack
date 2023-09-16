import { getServerSession } from "#auth";
import { z, parseParamsAs, parseQueryAs } from "@sidebase/nuxt-parse";

const paramSchema = z.object({
  formId: z.string(),
});

const querySchema = z.object({
  skip: z.string().optional().default("0").transform(Number),
  take: z.string().optional().default("10").transform(Number),
  isSpam: z
    .string()
    .optional()
    .default("false")
    .transform((v) => v === "true"),
});

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event);
  const { formId } = parseParamsAs(event, paramSchema);
  const { skip, take, isSpam } = parseQueryAs(event, querySchema);
  if (!session) {
    throw createError({ statusMessage: "Unauthenticated", statusCode: 403 });
  }

  const { prisma } = event.context;

  const query = {
    where: {
      formId,
      isSpam,
      form: {
        workspace: {
          users: {
            some: {
              id: session.user.id,
            },
          },
        },
      },
    },
  };
  const [submissions, total, result] = await prisma.$transaction([
    prisma.submission.findMany({
      where: query.where,
      orderBy: {
        createdAt: "desc",
      },
      skip: skip,
      take: take,
    }),
    prisma.submission.count(query),
    prisma.$queryRaw`SELECT jsonb_object_keys(data) AS key FROM public."Submission" WHERE "formId"=${formId} GROUP BY key`,
  ]);

  const keys = ((result as any).map((r: any) => r.key) as string[]).filter(
    (key) => !key.startsWith("_")
  );

  return {
    submissions,
    keys,
    pagination: { skip, take, total },
  };
});
