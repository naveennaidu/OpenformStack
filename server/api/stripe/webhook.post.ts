import { stripe } from "@/utils/stripe";
import Stripe from "stripe";

const relevantEvents = new Set([
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const sig = event.headers.get("stripe-signature");
  const webhookSecret = useRuntimeConfig().STRIPE_WEBHOOK_SECRET;
  let stripeEvent: Stripe.Event;

  try {
    if (!sig || !webhookSecret) return;
    stripeEvent = stripe.webhooks.constructEvent(
      body,
      sig,
      useRuntimeConfig().STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    throw createError({
      statusMessage: "Webhook Error",
      message: err.message,
      statusCode: 400,
    });
  }

  const { prisma } = event.context;

  console.log("stripeEvent", stripeEvent);

  if (relevantEvents.has(stripeEvent.type)) {
    try {
      switch (stripeEvent.type) {
        case "customer.subscription.created":
        case "customer.subscription.updated":
        case "customer.subscription.deleted":
          const subscription = stripeEvent.data.object as Stripe.Subscription;
          console.log("subscription", subscription);
          break;
        case "checkout.session.completed":
          const checkoutSession = stripeEvent.data
            .object as Stripe.Checkout.Session;
          if (checkoutSession.mode === "subscription") {
            console.log("checkoutSession", checkoutSession);
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
