<template>
  <header class="absolute inset-x-0 top-0 z-50">
    <nav
      class="flex items-center justify-between p-6 lg:px-8"
      aria-label="Global"
    >
      <div class="flex lg:flex-1">
        <NuxtLink to="/" class="-m-1.5 p-1.5 flex items-center space-x-2">
          <img
            class="h-10 w-auto rounded"
            src="/logo.png"
            alt="OpenformStack logo"
          />
          <span class="font-semibold text-2xl">OpenformStack</span>
        </NuxtLink>
      </div>
      <div class="flex lg:hidden">
        <button
          type="button"
          class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-400"
          @click="mobileMenuOpen = true"
        >
          <span class="sr-only">Open main menu</span>
          <UIcon name="i-heroicons-bars-3" class="w-6 h-6" aria-hidden="true" />
        </button>
      </div>
      <div class="hidden lg:flex lg:gap-x-12">
        <NuxtLink
          v-for="item in navigation"
          :key="item.name"
          :to="item.href"
          class="text-sm font-semibold leading-6 text-gray-800"
        >
          {{ item.name }}
        </NuxtLink>
      </div>
      <div class="hidden lg:flex lg:flex-1 lg:justify-end"></div>
    </nav>
    <USlideover v-model="mobileMenuOpen" class="lg:hidden">
      <div class="h-full px-6 py-6 overflow-y-auto sm:ring-1 sm:ring-white/10">
        <div class="flex items-center justify-between">
          <NuxtLink to="/" class="-m-1.5 p-1.5">
            <span>OpenformStack</span>
          </NuxtLink>
          <button
            type="button"
            class="-m-2.5 rounded-md p-2.5 text-gray-400"
            @click="mobileMenuOpen = false"
          >
            <span class="sr-only">Close menu</span>
            <UIcon
              class="w-6 h-6"
              aria-hidden="true"
              name="i-heroicons-x-mark"
            />
          </button>
        </div>
        <div class="flow-root mt-6">
          <div class="-my-6 divide-y divide-gray-500/25">
            <div class="py-6 space-y-2">
              <a
                v-for="item in navigation"
                :key="item.name"
                :href="item.href"
                class="block px-3 py-2 -mx-3 text-base font-semibold leading-7 text-white rounded-lg hover:bg-gray-800"
              >
                {{ item.name }}
              </a>
            </div>
            <div class="py-6"></div>
          </div>
        </div>
      </div>
    </USlideover>
  </header>
</template>

<script setup lang="ts">
const navigation: any[] = [
  {
    name: "Features",
    href: "/features",
  },
  {
    name: "Pricing",
    href: "/pricing",
  },
  {
    name: "Docs",
    href: "/docs",
  },
  {
    name: "Blog",
    href: "/blog",
  },
];

const mobileMenuOpen = ref(false);
</script>

<style scoped></style>
