import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";

export const stripe = new Stripe(useRuntimeConfig().STRIPE_SECRET_KEY, {
  apiVersion: "2023-08-16",
  appInfo: {
    name: "OpenformStack",
    version: "1.0.0",
  },
});

export const toDateTime = (secs: number) => {
  var t = new Date("1970-01-01T00:30:00Z"); // Unix epoch start.
  t.setSeconds(secs);
  return t;
};

export const createOrRetrieveCustomer = async ({
  prisma,
  userId,
}: {
  prisma: PrismaClient;
  userId: string;
}) => {
  console.log("Fetching user", userId);
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  console.log("User: ", user);

  if (!user || !user.stripeCustomerId) {
    const customerData: { metadata: { id: string }; email?: string } = {
      email: user?.email || undefined,
      metadata: {
        id: userId,
      },
    };

    const customer = await stripe.customers.create(customerData);

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        stripeCustomerId: customer.id,
      },
    });
    return { ...updatedUser };
  }
  return { ...user };
};

export const manageSubscriptionStatusChange = async (
  prisma: PrismaClient,
  subscriptionId: string,
  stripeCustomerId: string
) => {
  // Get customer's UUID from mapping table.
  const user = await prisma.user.findUnique({
    where: { stripeCustomerId },
  });

  console.log(
    `User [${user?.id}] is changing subscription [${subscriptionId}] wth customer [${stripeCustomerId}]`
  );

  if (!user) {
    throw new Error("User not found.");
  }

  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ["default_payment_method"],
  });

  // Upsert the latest status of the subscription object.
  const subscriptionData = {
    id: subscription.id,
    userId: user.id,
    status: subscription.status,
    priceId: subscription.items.data[0].price.id,
    quantity: subscription.items.data[0].quantity,
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    cancelAt: subscription.cancel_at
      ? toDateTime(subscription.cancel_at).toISOString()
      : null,
    canceledAt: subscription.canceled_at
      ? toDateTime(subscription.canceled_at).toISOString()
      : null,
    currentPeriodStart: toDateTime(
      subscription.current_period_start
    ).toISOString(),
    currentPeriodEnd: toDateTime(subscription.current_period_end).toISOString(),
    created: toDateTime(subscription.created).toISOString(),
    endedAt: subscription.ended_at
      ? toDateTime(subscription.ended_at).toISOString()
      : null,
    trialStart: subscription.trial_start
      ? toDateTime(subscription.trial_start).toISOString()
      : null,
    trialEnd: subscription.trial_end
      ? toDateTime(subscription.trial_end).toISOString()
      : null,
  };

  const result = await prisma.subscription.upsert({
    where: { id: subscriptionData.id },
    create: subscriptionData,
    update: subscriptionData,
  });

  console.log(
    `Inserted/updated subscription [${result.id}] for user [${result.userId}]`
  );
};
