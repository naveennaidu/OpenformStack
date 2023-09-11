import { getServerSession } from "#auth";
import { z, parseBodyAs, parseParamsAs } from "@sidebase/nuxt-parse";

const bodySchema = z.object({
  name: z.string().optional(),
  closed: z.boolean().optional(),
  selfEmailNotification: z.boolean().optional(),
});

const paramSchema = z.object({
  formId: z.string(),
});

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event);
  const { name, closed, selfEmailNotification } = await parseBodyAs(
    event,
    bodySchema
  );
  const { formId } = parseParamsAs(event, paramSchema);

  if (!session) {
    throw createError({ statusMessage: "Unauthenticated", statusCode: 403 });
  }

  const { prisma } = event.context;

  const form = await prisma.form.update({
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
    data: {
      name,
      closed,
      selfEmailNotification,
    },
  });

  if (!form) {
    throw createError({ statusMessage: "Not Found", statusCode: 404 });
  }

  return { form };
});
