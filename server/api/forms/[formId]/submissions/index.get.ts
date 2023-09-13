import { getServerSession } from "#auth";
import { z, parseParamsAs } from "@sidebase/nuxt-parse";

const paramSchema = z.object({
  formId: z.string(),
});

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event);
  const { formId } = parseParamsAs(event, paramSchema);

  if (!session) {
    throw createError({ statusMessage: "Unauthenticated", statusCode: 403 });
  }

  const { prisma } = event.context;

  const submissions = await prisma.submission.findMany({
    where: {
      formId,
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
    orderBy: {
      createdAt: "desc",
    },
  });

  const result: { key: string }[] =
    await prisma.$queryRaw`select jsonb_object_keys(data) as key from public."Submission" group by key`;

  const keys = result.map((r) => r.key);
  console.log(keys);

  return { submissions, keys };
});
