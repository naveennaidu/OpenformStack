import { z, parseParamsAs } from "@sidebase/nuxt-parse";

const paramSchema = z.object({
  formId: z.string(),
});

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

  return { success: true };
});
