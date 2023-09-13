import { z, parseParamsAs } from "@sidebase/nuxt-parse";
import { Resend } from "resend";

const DEFAULT_REDIRECT_URL = "https://openformstack.com/thank-you";

const paramSchema = z.object({
  formId: z.string(),
});

const resend = new Resend(useRuntimeConfig().RESEND_API_KEY);

export default defineEventHandler(async (event) => {
  handleCors(event, {
    allowHeaders: ["Content-Type", "Accept", "Origin", "Referer", "User-Agent"],
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

  // self email notification
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

  // respondent email notification
  if (form.respondentEmailNotification) {
    if (body.email && isEmail(body.email)) {
      await resend.emails.send({
        from: `${form.fromName} <${useRuntimeConfig().public.FROM_MAIL}>`,
        to: body.email,
        subject: form.subject ?? "Thank you for your submission",
        text:
          form.message ??
          "Thanks for reaching out! we'll get back to you as soon as possible.",
      });
    }
  }

  return sendRedirect(
    event,
    form.customRedirect
      ? form.customRedirectUrl ?? DEFAULT_REDIRECT_URL
      : DEFAULT_REDIRECT_URL
  );
});

function isEmail(email: string) {
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(email);
}
