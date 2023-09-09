import { getServerSession } from "#auth";

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event);

  if (!session) {
    throw createError({ statusMessage: "Unauthenticated", statusCode: 403 });
  }

  const { prisma } = event.context;

  const workspaces = await prisma.workspace.findMany({
    where: {
      users: {
        some: {
          id: session.user.id,
        },
      },
    },
    include: {
      forms: true,
    },
  });

  return { workspaces };
});
