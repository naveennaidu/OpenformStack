import { getServerSession } from "#auth";
import { createOrRetrieveCustomer, stripe } from "@/utils/stripe";

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event);
  if (!session) {
    throw createError({ statusMessage: "Unauthenticated", statusCode: 401 });
  }

  const { prisma } = event.context;

  const user = await createOrRetrieveCustomer({
    prisma,
    userId: session.user.id,
  });

  if (!user) {
    throw createError({ statusMessage: "User not found", statusCode: 404 });
  }

  try {
    if (!user.stripeCustomerId) return;
    const { url } = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${useRuntimeConfig().public.BASE_URL}/settings/billing`,
    });
    return { url };
  } catch (error: any) {
    console.log(error);
    throw createError({
      statusMessage: "Stripe Portal error",
      message: error.message,
      statusCode: 500,
    });
  }
});
