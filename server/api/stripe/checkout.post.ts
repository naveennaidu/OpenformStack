import { getServerSession } from "#auth";
import { z, parseBodyAs } from "@sidebase/nuxt-parse";
import { createOrRetrieveCustomer, stripe } from "@/utils/stripe";

const bodySchema = z.object({
  priceId: z.string(),
});

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event);
  const { priceId } = await parseBodyAs(event, bodySchema);

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
    const stripeSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      client_reference_id: user.id,
      customer: user.stripeCustomerId || undefined,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      allow_promotion_codes: true,
      success_url: `${useRuntimeConfig().public.BASE_URL}/settings/billing`,
      cancel_url: `${useRuntimeConfig().public.BASE_URL}/settings/billing`,
    });
    if (stripeSession.url) {
      return {
        stripeSession,
      };
    } else {
      throw createError({
        statusMessage: "Stripe checkout session error",
        message: "Stripe checkout session error",
        statusCode: 500,
      });
    }
  } catch (error: any) {
    console.log(error);

    throw createError({
      statusMessage: "Stripe checkout session error",
      message: error.message,
      statusCode: 500,
    });
  }
});
