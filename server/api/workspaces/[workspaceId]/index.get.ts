import { getServerSession } from "#auth";
import { z, parseParamsAs } from "@sidebase/nuxt-parse";

const paramSchema = z.object({
  workspaceId: z.string(),
});

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event);
  const { workspaceId } = parseParamsAs(event, paramSchema);

  if (!session) {
    throw createError({ statusMessage: "Unauthenticated", statusCode: 403 });
  }

  const { prisma } = event.context;

  const workspace = await prisma.workspace.findUnique({
    where: {
      id: workspaceId,
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
  if (!workspace) {
    throw createError({ statusMessage: "Not Found", statusCode: 404 });
  }
  return { workspace };
});
