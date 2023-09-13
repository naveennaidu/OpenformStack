import { inngest } from "@/inngest/client";
import { Resend } from "resend";

const resend = new Resend(useRuntimeConfig().RESEND_API_KEY);

export default inngest.createFunction(
  { name: "Email Notification" },
  { event: "app/email.self" },
  async ({ event }) => {
    const userEmails = event.data.emails;
    const formName = event.data.formName;
    const body = event.data.body;

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
    return { event };
  }
);
