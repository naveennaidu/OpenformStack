import { z, parseParamsAs } from "@sidebase/nuxt-parse";
import { inngest } from "~/inngest/client";
import { isEmail } from "~/utils";
import { kv } from "@vercel/kv";
import { Ratelimit } from "@upstash/ratelimit";

const DEFAULT_REDIRECT_URL = "https://openformstack.com/thank-you";

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

  const ip = event.headers.get("x-forwarded-for");
  const ratelimit = new Ratelimit({
    redis: kv,
    // rate limit to 5 requests per 60 seconds
    limiter: Ratelimit.slidingWindow(5, "60s"),
  });

  const { success, limit, reset, remaining } = await ratelimit.limit(
    `ratelimit_${ip}`
  );

  if (!success) {
    return new Response("You have reached your request limit for the day.", {
      status: 429,
      headers: {
        "X-RateLimit-Limit": limit.toString(),
        "X-RateLimit-Remaining": remaining.toString(),
        "X-RateLimit-Reset": reset.toString(),
      },
    });
  }

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
  const headers = event.headers;
  const contentType = headers.get("content-type") || "";

  // Body Parsing
  let parsedBody: any;
  if (contentType.includes("application/json")) {
    parsedBody = typeof body === "object" ? body : JSON.parse(body);
  } else if (contentType.includes("application/x-www-form-urlencoded")) {
    parsedBody = Object.fromEntries(new URLSearchParams(body).entries());
  } else {
    setResponseStatus(event, 406);
    setResponseHeader(event, "Content-Type", "application/json");
    return {
      error: {
        code: "INVALID_CONTENT_TYPE",
        message:
          "Accepts only application/json or application/x-www-form-urlencoded",
      },
    };
  }

  // Check for spam
  const isSpam = Object.entries(parsedBody).some(
    ([key, value]) => key.startsWith("_") && value
  );

  const submission = await prisma.submission.create({
    data: {
      formId,
      data: body,
      isSpam,
    },
  });

  const userEmails = form.workspace.users
    .map((user) => user.email)
    .filter((email): email is string => Boolean(email));
  // self email notification
  if (form.selfEmailNotification && !isSpam) {
    await inngest.send({
      name: "app/email.selfNotification",
      data: {
        emails: userEmails,
        formName: form.name,
        body,
      },
    });
  }

  // respondent email notification
  if (form.respondentEmailNotification && !isSpam) {
    if (body.email && isEmail(body.email)) {
      await inngest.send({
        name: "app/email.respondentNotification",
        data: {
          fromName: form.fromName ?? "OpenformStack",
          to: body.email,
          subject: form.subject ?? "Thank you for your submission",
          message:
            form.message ??
            "Thanks for reaching out! we'll get back to you as soon as possible.",
          replyTo: userEmails ?? [],
        },
      });
    }
  }

  // webhook
  if (form.webhookEnabled && form.webhookUrl && !isSpam) {
    await inngest.send({
      name: "app/webhook",
      data: {
        webhookUrl: form.webhookUrl,
        formName: form.name,
        submission,
      },
    });
  }

  return sendRedirect(
    event,
    form.customRedirect
      ? form.customRedirectUrl ?? DEFAULT_REDIRECT_URL
      : DEFAULT_REDIRECT_URL
  );
});
