import { z, parseParamsAs } from "@sidebase/nuxt-parse";
import { Resend } from "resend";

const paramSchema = z.object({
  formId: z.string(),
});

const resend = new Resend(useRuntimeConfig().RESEND_API_KEY);

export default defineEventHandler(async (event) => {
  handleCors(event, {
    allowHeaders: [
      "Contenty-Type",
      "Accept",
      "Origin",
      "Referer",
      "User-Agent",
    ],
    methods: ["OPTIONS", "POST"],
    origin: "*",
    preflight: {
      statusCode: 204,
    },
  });
  if (event.node.req.method === "OPTIONS") {
    return null;
  }
  assertMethod(event, "POST");

  const body = await readBody(event);
  const { formId } = parseParamsAs(event, paramSchema);
  const { prisma } = event.context;

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
  if (!form) {
    setResponseStatus(event, 404);
    setResponseHeader(event, "Content-Type", "application/json");
    return {
      error: {
        code: "NOT_FOUND",
        message: "Form not found. Please check the url again",
      },
    };
  }
  if (form.closed) {
    setResponseStatus(event, 422);
    setResponseHeader(event, "Content-Type", "application/json");
    return {
      error: {
        code: "FORM_CLOSED",
        message: "Form is closed",
      },
    };
  }
  await prisma.submission.create({
    data: {
      formId,
      data: body,
    },
  });

  if (form.selfEmailNotification) {
    const userEmails = form.workspace.users
      .map((user) => user.email)
      .filter((email): email is string => Boolean(email));
    await resend.emails.send({
      from: `OpenformStack <${useRuntimeConfig().public.FROM_MAIL}>`,
      to: userEmails,
      subject: `New submission for ${form.name}`,
      html: `
      ${Object.entries(body)
        .map(([key, value]) => `<div><b>${key}</b>: ${value}</div>`)
        .join("")}
      `,
    });
  }

  return {
    success: true,
  };
});
