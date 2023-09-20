<template>
  <div class="bg-white py-3 sm:py-6">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
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
        class="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3"
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

          <button
            :aria-describedby="tier.id"
            :class="[
              tier.mostPopular
                ? 'bg-orange-600 text-white shadow-sm hover:bg-orange-500'
                : 'text-orange-600 ring-1 ring-inset ring-orange-200 hover:ring-orange-300',
              'mt-6 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600',
            ]"
            @click="goToCheckout((tier.priceId as any)[frequency.value])"
          >
            Upgrade to {{ tier.name }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RadioGroup, RadioGroupLabel, RadioGroupOption } from "@headlessui/vue";
import { CheckIcon } from "@heroicons/vue/20/solid";

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
    features: ["3 forms", "100 submissions per month"],
    mostPopular: false,
  },
  {
    name: "Standard",
    id: "tier-standard",
    price: { monthly: "$9", annually: "$90" },
    priceId: {
      monthly: "price_1NsIUrSGPjGwYh1BMGuyC61q",
      annually: "price_1NsIUrSGPjGwYh1BdNWa6k7a",
    },
    description: "Best for personal use and freelancers.",
    features: [
      "Unlimited forms",
      "1000 submissions per month",
      "Priority support",
    ],
    mostPopular: true,
  },
  {
    name: "Plus",
    id: "tier-plus",
    price: { monthly: "$29", annually: "$290" },
    priceId: {
      monthly: "price_1NsIWVSGPjGwYh1BmU48wGlC",
      annually: "price_1NsIWVSGPjGwYh1BGDLH1rKW",
    },
    description: "Best for businesses",
    features: [
      "Unlimited forms",
      "Unlimited submissions per month",
      "Priority support",
    ],
    mostPopular: false,
  },
];

const frequency = ref(frequencies[0]);

async function goToCheckout(priceId: string) {
  const { data } = await useFetch("/api/stripe/checkout", {
    method: "POST",
    body: JSON.stringify({
      priceId,
    }),
  });
  if (data.value && data.value.stripeSession.url) {
    window.open(data.value.stripeSession.url, "_blank");
  }
}
</script>

<style scoped></style>
