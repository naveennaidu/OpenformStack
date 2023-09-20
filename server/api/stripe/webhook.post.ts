import { manageSubscriptionStatusChange, stripe } from "@/utils/stripe";
import Stripe from "stripe";

const relevantEvents = new Set([
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

export default defineEventHandler(async (event) => {
  const body = await readRawBody(event);

  const sig = event.headers.get("stripe-signature");
  console.log("sig", sig);

  const webhookSecret = useRuntimeConfig().STRIPE_WEBHOOK_SECRET;
  console.log("webhookSecret", webhookSecret);
  let stripeEvent: Stripe.Event;

  try {
    if (!sig || !webhookSecret || !body) return;
    stripeEvent = stripe.webhooks.constructEvent(
      body,
      sig,
      useRuntimeConfig().STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    console.log("err", err);

    throw createError({
      statusMessage: "Webhook Error",
      message: err.message,
      statusCode: 400,
    });
  }

  console.log("stripeEvent", stripeEvent);

  const { prisma } = event.context;

  console.log("stripeEvent", stripeEvent);

  if (relevantEvents.has(stripeEvent.type)) {
    try {
      switch (stripeEvent.type) {
        case "customer.subscription.created":
        case "customer.subscription.updated":
        case "customer.subscription.deleted":
          const subscription = stripeEvent.data.object as Stripe.Subscription;
          console.log("customer.subscription", subscription);
          await manageSubscriptionStatusChange(
            prisma,
            subscription.id,
            subscription.customer as string
          );
          break;
        case "checkout.session.completed":
          const checkoutSession = stripeEvent.data
            .object as Stripe.Checkout.Session;
          if (checkoutSession.mode === "subscription") {
            console.log("checkoutSession", checkoutSession);
            const user = await prisma.user.update({
              where: {
                id: checkoutSession.client_reference_id as string,
              },
              data: {
                stripeCustomerId: checkoutSession.customer as string,
              },
            });

            const subscriptionId = checkoutSession.subscription;
            await manageSubscriptionStatusChange(
              prisma,
              subscriptionId as string,
              user?.stripeCustomerId as string
            );
          }
          break;
        default:
          break;
      }
    } catch (error: any) {
      throw createError({
        statusMessage: "Webhook Error",
        message: error.message,
        statusCode: 400,
      });
    }
  }

  return {
    success: true,
  };
});
