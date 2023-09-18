<template>
  <div class="py-24">
    <div class="px-6 py-12 mx-auto max-w-7xl lg:px-8">
      <div
        class="max-w-2xl mx-auto space-y-16 divide-y divide-gray-800 lg:mx-0 lg:max-w-none"
      >
        <div class="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-3">
          <div>
            <h2
              class="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100"
            >
              Company
            </h2>
          </div>
          <div
            class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-2 lg:gap-8"
          >
            <div class="p-10 rounded-2xl bg-gray-200/50 dark:bg-gray-800/50">
              <h3
                class="text-base font-semibold leading-7 text-gray-900 dark:text-gray-100"
              >
                Zeitalabs
              </h3>
              <dl
                class="mt-3 space-y-1 text-sm leading-6 text-gray-600 dark:text-gray-400"
              >
                <div class="mt-1">
                  <dt class="sr-only">Address</dt>
                  <dd>Door No: 14-164/2, Laxmi Nagar,</dd>
                  <dd>
                    Near Minerva School, Chinamushidivada Village, Pendurthi
                    Mandal
                  </dd>
                  <dd>Visakhapatnam, Andhra Pradesh, India, 531173</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-1 pt-16 gap-x-8 gap-y-10 lg:grid-cols-3">
          <div>
            <h2
              class="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100"
            >
              Get in touch
            </h2>
          </div>
          <div
            class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-2 lg:gap-8"
          >
            <div class="p-10 rounded-2xl bg-gray-200/50 dark:bg-gray-800/50">
              <h3
                class="text-base font-semibold leading-7 text-gray-900 dark:text-gray-100"
              >
                Say Hello
              </h3>
              <dl
                class="mt-3 space-y-1 text-sm leading-6 text-gray-600 dark:text-gray-400"
              >
                <div>
                  <dt class="sr-only">Email</dt>
                  <dd>
                    <a
                      class="font-semibold text-primary-600"
                      href="mailto:naveen@zeitalabs.com"
                    >
                      naveen@zeitalabs.com
                    </a>
                  </dd>
                </div>
                <div class="mt-1">
                  <dt class="sr-only">Phone number</dt>
                  <dd>+91 88282-90468</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "open",
});
</script>

<style scoped></style>
