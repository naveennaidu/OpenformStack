import { getServerSession } from "#auth";
import { z, parseBodyAs } from "@sidebase/nuxt-parse";

const bodySchema = z.object({
  name: z.string(),
  workspaceId: z.string(),
});

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event);
  const { name, workspaceId } = await parseBodyAs(event, bodySchema);

  if (!session) {
    throw createError({ statusMessage: "Unauthenticated", statusCode: 403 });
  }

  const { prisma } = event.context;

  // Check if user is a member of the workspace
  const workspace = await prisma.workspace.findUnique({
    where: {
      id: workspaceId,
      users: {
        some: {
          id: session.user.id,
        },
      },
    },
  });

  if (!workspace) {
    throw createError({
      statusMessage: "User is not a member of the workspace",
      statusCode: 422,
    });
  }

  const form = await prisma.form.create({
    data: {
      name,
      workspace: {
        connect: {
          id: workspaceId,
        },
      },
    },
  });

  return { form };
});
