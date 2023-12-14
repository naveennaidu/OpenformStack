import { inngest } from "@/inngest/client";
import { Resend } from "resend";
import { isEmail } from "~/utils";

const resend = new Resend(useRuntimeConfig().RESEND_API_KEY);

export default inngest.createFunction(
  { id: "Self Email Notification" },
  { event: "app/email.selfNotification" },
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
      ...(body.email && isEmail(body.email) ? { reply_to: body.email } : {}),
    });
    return { event };
  }
);
