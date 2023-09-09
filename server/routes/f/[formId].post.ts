import { z, parseParamsAs } from "@sidebase/nuxt-parse";
import { Resend } from "resend";

const paramSchema = z.object({
  formId: z.string(),
});

const resend = new Resend(useRuntimeConfig().RESEND_API_KEY);

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { formId } = parseParamsAs(event, paramSchema);
  const { prisma } = event.context;

  await prisma.submission.create({
    data: {
      formId,
      data: body,
    },
  });

  const form = await prisma.form.findUnique({
    where: {
      id: formId,
    },
    include: {
      workspace: {
        include: {
          users: true,
        },
      },
    },
  });
  if (form) {
    const userEmails = form.workspace.users
      .map((user) => user.email)
      .filter((email): email is string => Boolean(email));
    await resend.emails.send({
      from: `Headless Forms <${useRuntimeConfig().public.FROM_MAIL}>`,
      to: userEmails,
      subject: `New submission for ${form.name}`,
      html: `
      ${Object.entries(body)
        .map(([key, value]) => `<div><b>${key}</b>: ${value}</div>`)
        .join("")}
      `,
    });
  }

  return { success: true };
});
