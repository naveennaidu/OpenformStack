import Stripe from "stripe";

export const stripe = new Stripe(useRuntimeConfig().STRIPE_SECRET_KEY, {
  apiVersion: "2023-08-16",
  appInfo: {
    name: "OpenformStack",
    version: "1.0.0",
  },
});
