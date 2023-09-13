import { inngest } from "@/inngest/client";
import { Resend } from "resend";

const resend = new Resend(useRuntimeConfig().RESEND_API_KEY);

export default inngest.createFunction(
  { name: "Respondent Email Notification" },
  { event: "app/email.respondentNotification" },
  async ({ event }) => {
    const fromName = event.data.fromName;
    const to = event.data.to;
    const subject = event.data.subject;
    const message = event.data.message;
    const reply_to = event.data.replyTo;

    await resend.emails.send({
      from: `${fromName} <${useRuntimeConfig().public.FROM_MAIL}>`,
      to,
      subject: subject,
      text: message,
      reply_to,
    });
    return { event };
  }
);
