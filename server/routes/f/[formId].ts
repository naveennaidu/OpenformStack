import { z, parseParamsAs } from "@sidebase/nuxt-parse";
import { inngest } from "~/inngest/client";

const paramSchema = z.object({
  formId: z.string(),
});

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

  if (form.selfEmailNotification) {
    const userEmails = form.workspace.users
      .map((user) => user.email)
      .filter((email): email is string => Boolean(email));
    await inngest.send({
      name: "app/email.self",
      data: {
        emails: userEmails,
        formName: form.name,
        body,
      },
    });
  }

  return {
    success: true,
  };
});
