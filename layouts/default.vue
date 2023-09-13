<template>
  <div class="flex h-full">
    <TheSideBar />
    <div class="w-full">
      <div class="p-4 h-screen overflow-auto">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  htmlAttrs: {
    lang: "en",
    class: "antialiased [font-feature-settings:'ss01'] h-full",
  },
  bodyAttrs: {
    class: "h-full",
  },
});
</script>

<style>
#__nuxt {
  height: 100%;
}
</style>
