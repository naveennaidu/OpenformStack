import { getServerSession } from "#auth";
import { z, parseBodyAs } from "@sidebase/nuxt-parse";

const bodySchema = z.object({
  name: z.string(),
});

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event);
  const { name } = await parseBodyAs(event, bodySchema);

  if (!session) {
    throw createError({ statusMessage: "Unauthenticated", statusCode: 403 });
  }

  const { prisma } = event.context;

  const workspace = await prisma.workspace.create({
    data: {
      name,
      users: {
        connect: {
          id: session.user.id,
        },
      },
    },
  });

  return { workspace };
});
