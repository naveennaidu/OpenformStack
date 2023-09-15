<template>
  <div class="bg-white py-24 sm:py-32">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div class="mx-auto max-w-2xl sm:text-center">
        <h2 class="text-base font-semibold leading-7 text-primary-600">
          Everything you need
        </h2>
        <p
          class="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
        >
          No Backend server? No problem.
        </p>
        <p class="mt-6 text-lg leading-8 text-gray-600">
          Manage all your forms with OpenformStack. Get notified, Auto-respond
          to new submissions and keep spam out.
        </p>
      </div>
    </div>
    <div class="relative overflow-hidden pt-16">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <img
          src="/featureHero.png"
          alt="App screenshot"
          class="mb-[-12%] rounded-xl shadow-2xl ring-1 ring-gray-900/10"
          width="2432"
          height="1442"
        />
        <div class="relative" aria-hidden="true">
          <div
            class="absolute -inset-x-20 bottom-0 bg-gradient-to-t from-white pt-[7%]"
          />
        </div>
      </div>
    </div>
    <div class="mx-auto mt-16 max-w-7xl px-6 sm:mt-20 md:mt-24 lg:px-8">
      <dl
        class="mx-auto grid max-w-2xl grid-cols-1 gap-x-6 gap-y-10 text-base leading-7 text-gray-600 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16"
      >
        <div
          v-for="feature in features"
          :key="feature.name"
          class="relative pl-9"
        >
          <dt class="inline font-semibold text-gray-900">
            <component
              :is="feature.icon"
              class="absolute left-1 top-1 h-5 w-5 text-primary-600"
              aria-hidden="true"
            />
            {{ feature.name }}
          </dt>
          {{ " " }}
          <dd class="inline">{{ feature.description }}</dd>
        </div>
      </dl>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  CloudArrowUpIcon,
  FingerPrintIcon,
  BellAlertIcon,
  EnvelopeOpenIcon,
  CpuChipIcon,
  ArrowPathIcon,
} from "@heroicons/vue/20/solid";

const features = [
  {
    name: "Easy Setup.",
    description:
      "Whether you're a seasoned developer or just starting out, It's easy to setup with your existing stack.",
    icon: CloudArrowUpIcon,
  },
  {
    name: "Self Email Notifications.",
    description:
      "Stay in the loop with real-time notifications. keeping you informed whenever a form submission occurs.",
    icon: BellAlertIcon,
  },
  {
    name: "Auto Respond.",
    description:
      "Provide your users with automatic responses, ensuring they know their submission was received.",
    icon: EnvelopeOpenIcon,
  },
  {
    name: "Spam Filtering.",
    description:
      "Keep your forms clean and your data accurate. Our advanced spam filtering technology identifies and filters out unwanted submissions, ensuring that you only receive genuine responses.",
    icon: FingerPrintIcon,
  },
  {
    name: "Integrations.",
    description:
      "We offer integrations with popular tools and platforms, allowing you to streamline your workflow and connect with your favorite apps effortlessly.",
    icon: CpuChipIcon,
  },
  {
    name: "Custom Redirect.",
    description:
      "Guide your users to the next steps with ease. We offers a custom redirect feature, allowing you to redirect users to specific pages or URLs after a form submission.",
    icon: ArrowPathIcon,
  },
];
</script>

<style scoped></style>
