import { getServerSession } from "#auth";

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event);

  if (!session) {
    throw createError({ statusMessage: "Unauthenticated", statusCode: 403 });
  }

  const { prisma } = event.context;

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    include: {
      Subscription: true,
    },
  });

  return { user };
});
