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

  const form = await prisma.form.findUnique({
    where: {
      id: formId,
      workspace: {
        users: {
          some: {
            id: session.user.id,
          },
        },
      },
    },
  });
  if (!form) {
    throw createError({ statusMessage: "Not Found", statusCode: 404 });
  }
  return { form };
});
