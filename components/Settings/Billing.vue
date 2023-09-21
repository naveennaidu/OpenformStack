<template>
  <div class="bg-white py-3 sm:py-6">
    <div v-if="!isSubscribed" class="mx-auto max-w-7xl px-6 lg:px-8">
      <div class="mt-16 flex justify-center">
        <RadioGroup
          v-model="frequency"
          class="grid grid-cols-2 gap-x-1 rounded-full p-1 text-center text-xs font-semibold leading-5 ring-1 ring-inset ring-gray-200"
        >
          <RadioGroupLabel class="sr-only">Payment frequency</RadioGroupLabel>
          <RadioGroupOption
            as="template"
            v-for="option in frequencies"
            :key="option.value"
            :value="option"
            v-slot="{ checked }"
          >
            <div
              :class="[
                checked ? 'bg-primary-600 text-white' : 'text-gray-500',
                'cursor-pointer rounded-full px-2.5 py-1',
              ]"
            >
              <span>{{ option.label }}</span>
            </div>
          </RadioGroupOption>
        </RadioGroup>
      </div>
      <div
        class="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 lg:max-w-3xl lg:grid-cols-2"
      >
        <div
          v-for="tier in tiers"
          :key="tier.id"
          :class="[
            tier.mostPopular
              ? 'ring-2 ring-orange-600'
              : 'ring-1 ring-gray-200',
            'rounded-3xl p-8 xl:p-10 flex flex-col justify-between',
          ]"
        >
          <div>
            <div class="flex items-center justify-between gap-x-4">
              <h3
                :id="tier.id"
                :class="[
                  tier.mostPopular ? 'text-orange-600' : 'text-gray-900',
                  'text-lg font-semibold leading-8',
                ]"
              >
                {{ tier.name }}
              </h3>
              <p
                v-if="tier.mostPopular"
                class="rounded-full bg-orange-600/10 px-2.5 py-1 text-xs font-semibold leading-5 text-orange-600"
              >
                Most popular
              </p>
            </div>
            <p class="mt-4 text-sm leading-6 text-gray-600">
              {{ tier.description }}
            </p>
            <p v-if="tier.price" class="mt-6 flex items-baseline gap-x-1">
              <span class="text-4xl font-bold tracking-tight text-gray-900">
                {{ (tier.price as any)[frequency.value] }}
              </span>
              <span class="text-sm font-semibold leading-6 text-gray-600">
                {{ frequency.priceSuffix }}
              </span>
            </p>
            <ul
              role="list"
              class="mt-8 space-y-3 text-sm leading-6 text-gray-600 xl:mt-10"
            >
              <li
                v-for="feature in tier.features"
                :key="feature"
                class="flex gap-x-3"
              >
                <CheckIcon
                  class="h-6 w-5 flex-none text-orange-600"
                  aria-hidden="true"
                />
                {{ feature }}
              </li>
            </ul>
          </div>

          <UButton
            :aria-describedby="tier.id"
            :variant="tier.mostPopular ? 'solid' : 'outline'"
            size="lg"
            class="mt-8"
            block
            :loading="checkoutLoading"
            @click="goToCheckout((tier.priceId as any)[frequency.value])"
          >
            Upgrade to {{ tier.name }}
          </UButton>
        </div>
      </div>
    </div>
    <div v-else class="p-8 ring-1 ring-gray-200 rounded-md">
      <div class="text-2xl">Thank you for subscribing to OpenformStack!</div>
      <div class="text-gray-600">
        You can manage your billing information and subscription from Stripe
      </div>
      <div class="grid grid-cols-2 max-w-md my-4">
        <div>Current plan:</div>
        <div class="font-semibold">Pro</div>
        <div>Current Period:</div>
        <div v-if="activeSubscription" class="font-semibold">
          {{
            dayjs(activeSubscription.currentPeriodStart).format("MMM DD, YYYY")
          }}
          -
          {{
            dayjs(activeSubscription.currentPeriodEnd).format("MMM DD, YYYY")
          }}
        </div>
      </div>
      <UButton
        color="primary"
        variant="solid"
        size="sm"
        class="mt-2"
        @click="openPortal"
      >
        Manage subscription
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RadioGroup, RadioGroupLabel, RadioGroupOption } from "@headlessui/vue";
import { CheckIcon } from "@heroicons/vue/20/solid";

const dayjs = useDayjs();
const { data: user } = await useFetch("/api/me");

const isSubscribed = computed(() => {
  return (
    user.value &&
    user.value.user &&
    user.value.user.Subscription.length > 0 &&
    user.value.user.Subscription.some((sub: any) => sub.status === "active")
  );
});

const activeSubscription = computed(() => {
  return (
    user.value &&
    user.value.user &&
    user.value.user.Subscription.length > 0 &&
    user.value.user.Subscription.find((sub: any) => sub.status === "active")
  );
});

const frequencies = [
  { value: "monthly", label: "Monthly", priceSuffix: "/month" },
  { value: "annually", label: "Annually", priceSuffix: "/year" },
];

const tiers = [
  {
    name: "Free",
    id: "tier-free",
    price: { monthly: "$0", annually: "$0" },
    description: "Free forever",
    features: ["Unlimited forms", "100 submissions per month"],
    mostPopular: false,
  },
  {
    name: "Pro",
    id: "tier-pro",
    price: { monthly: "$19", annually: "$199" },
    priceId: {
      monthly: useRuntimeConfig().PRO_MONTHLY_PRICE_ID,
      annually: useRuntimeConfig().PRO_YEARLY_PRICE_ID,
    },
    description: "Best for pro use and agencies.",
    features: [
      "Unlimited forms",
      "Unlimited submissions per month",
      "Priority support",
    ],
    mostPopular: true,
  },
];

const frequency = ref(frequencies[0]);

const checkoutLoading = ref(false);
async function goToCheckout(priceId: string) {
  checkoutLoading.value = true;
  const { data } = await useFetch("/api/stripe/checkout", {
    method: "POST",
    body: JSON.stringify({
      priceId,
    }),
  });
  checkoutLoading.value = false;
  if (data.value && data.value.stripeSession.url) {
    window.open(data.value.stripeSession.url, "_blank");
  }
}

async function openPortal() {
  const { data } = await useFetch("/api/stripe/portal", {
    method: "POST",
  });
  if (data.value && data.value.url) {
    window.open(data.value.url, "_blank");
  }
}
</script>

<style scoped></style>
