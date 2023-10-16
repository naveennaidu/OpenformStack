import { getServerSession } from "#auth";
import { z, parseParamsAs, parseQueryAs } from "@sidebase/nuxt-parse";
import { stringify } from "csv-stringify/sync";

const paramSchema = z.object({
  formId: z.string(),
});

const querySchema = z.object({
  isSpam: z
    .string()
    .optional()
    .default("false")
    .transform((v) => v === "true"),
});

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event);
  const { formId } = parseParamsAs(event, paramSchema);
  const { isSpam } = parseQueryAs(event, querySchema);
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
  const submissions = await prisma.submission.findMany({
    where: query.where,
    orderBy: {
      createdAt: "desc",
    },
    select: {
      createdAt: true,
      data: true,
    },
  });

  const formattedSubmissions = submissions.map((submission) => {
    return {
      createdAt: new Date(submission.createdAt).toISOString(),
      ...(submission.data as object),
    };
  });

  // Convert submissions to CSV
  const csv = stringify(formattedSubmissions, { header: true });
  setResponseHeader(event, "Content-Type", "text/csv");
  setResponseHeader(
    event,
    "Content-Disposition",
    "attachment; filename=submissions.csv"
  );
  await send(event, csv, "text/csv");
});
