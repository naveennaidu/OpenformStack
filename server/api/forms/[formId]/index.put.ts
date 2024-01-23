import { getServerSession } from "#auth";
import z from "zod";

const bodySchema = z.object({
  name: z.string().optional(),
  closed: z.boolean().optional(),
  selfEmailNotification: z.boolean().optional(),
  selfEmails: z.array(z.string()).optional(),
  respondentEmailNotification: z.boolean().optional(),
  fromName: z.string().nullable().optional(),
  subject: z.string().nullable().optional(),
  message: z.string().nullable().optional(),
  customRedirect: z.boolean().optional(),
  customRedirectUrl: z.string().optional(),
  webhookEnabled: z.boolean().optional(),
  webhookUrl: z.string().optional(),
});

const paramSchema = z.object({
  formId: z.string(),
});

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event);
  const body = await readValidatedBody(event, bodySchema.parse);
  const { formId } = await getValidatedRouterParams(event, paramSchema.parse);

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
    data: body,
  });

  if (!form) {
    throw createError({ statusMessage: "Not Found", statusCode: 404 });
  }

  return { form };
});
