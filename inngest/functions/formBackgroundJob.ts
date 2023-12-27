import { inngest } from "@/inngest/client";
import { Prisma, PrismaClient } from "@prisma/client";
import { NonRetriableError } from "inngest";
import { Resend } from "resend";
import { isEmail } from "~/utils";

export default inngest.createFunction(
  { id: "Form Background Job" },
  { event: "app/form.backgroundJob" },
  async ({ event, step }) => {
    const formId = event.data.formId;
    if (!formId) {
      throw new NonRetriableError("Form ID is required");
    }

    const submissionId = event.data.submissionId;
    if (!submissionId) {
      throw new NonRetriableError("Submission ID is required");
    }

    const prisma = new PrismaClient();

    const [form, submission] = await prisma.$transaction([
      prisma.form.findUnique({
        where: { id: formId },
        include: { workspace: { include: { users: true } } },
      }),
      prisma.submission.findUnique({
        where: { id: submissionId },
      }),
    ]);
    if (!form) {
      throw new NonRetriableError("Form not found");
    }

    if (!submission) {
      throw new NonRetriableError("Submission not found");
    }

    //Step 1: Check for spam
    const body = submission.data;
    if (!body) {
      throw new NonRetriableError("Submission data not found");
    }

    const isSpam = await step.run("checkSpam", async () => {
      const isSpam = Object.entries(body).some(
        ([key, value]) => key.startsWith("_") && value
      );
      const { spam } = await $fetch<{ spam: boolean }>(
        "https://byespam.co/api/v1/spamdetection",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${useRuntimeConfig().BYESPAM_API_KEY}`,
          },
          body: {
            content: JSON.stringify(body),
          },
        }
      );
      console.log("spam", spam);

      if (isSpam || spam) {
        await prisma.submission.update({
          where: { id: submissionId },
          data: { isSpam: true },
        });
      }
      return isSpam || spam;
    });

    if (isSpam) {
      return { event };
    }

    // self email notification
    const resend = new Resend(useRuntimeConfig().RESEND_API_KEY);

    const formName = form.name;
    const userEmails = form.workspace.users
      .map((user) => user.email)
      .filter((email): email is string => Boolean(email));
    if (form.selfEmailNotification) {
      await step.run("app/email.selfNotification", async () => {
        await resend.emails.send({
          from: `OpenformStack <${useRuntimeConfig().public.FROM_MAIL}>`,
          to: userEmails,
          subject: `New submission for ${formName}`,
          html: `
        ${Object.entries(body)
          .map(([key, value]) => `<div><b>${key}</b>: ${value}</div>`)
          .join("")}
        `,
        });
      });
    }
    // respondent email notification
    if (form.respondentEmailNotification) {
      await step.run("app/email.respondentNotification", async () => {
        if (typeof body === "object" && "email" in body) {
          const email = (body as Prisma.JsonObject)["email"] as string;
          if (email && isEmail(email)) {
            await resend.emails.send({
              from: `${form.fromName ?? "OpenformStack"} <${
                useRuntimeConfig().public.FROM_MAIL
              }>`,
              to: email,
              subject: form.subject ?? "Thank you for your submission",
              text:
                form.message ??
                "Thanks for reaching out! we'll get back to you as soon as possible.",
              reply_to: userEmails ?? [],
            });
          }
        }
      });
    }

    // webhook
    if (form.webhookEnabled) {
      await step.run("app/webhook", async () => {
        if (form.webhookUrl) {
          await $fetch(form.webhookUrl, {
            method: "POST",
            body: JSON.stringify({
              formName: form.name,
              submission,
            }),
          });
        }
      });
    }
    return { event };
  }
);
