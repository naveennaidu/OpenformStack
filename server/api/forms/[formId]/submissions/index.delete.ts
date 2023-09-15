import { getServerSession } from "#auth";
import { z, parseBodyAs } from "@sidebase/nuxt-parse";

const bodySchema = z.object({
  ids: z.array(z.string()),
});

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event);
  const { ids } = await parseBodyAs(event, bodySchema);

  if (!session) {
    throw createError({ statusMessage: "Unauthenticated", statusCode: 403 });
  }

  const { prisma } = event.context;

  const data = await prisma.submission.deleteMany({
    where: {
      id: {
        in: ids,
      },
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
  });
  return { data };
});
