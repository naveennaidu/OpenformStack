import { inngest } from "@/inngest/client";

export default inngest.createFunction(
  { id: "Webhook" },
  { event: "app/webhook" },
  async ({ event }) => {
    const webhookUrl = event.data.webhookUrl;
    const formName = event.data.formName;
    const submission = event.data.submission;

    await $fetch(webhookUrl, {
      method: "POST",
      body: JSON.stringify({
        formName,
        submission,
      }),
    });

    return { event };
  }
);
