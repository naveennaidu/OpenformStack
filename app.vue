<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script lang="ts" setup>
useHead({
  script: [
    {
      src: "https://plausible.io/js/script.js",
      defer: true,
      "data-domain": "openformstack.com",
    },
  ],
});
</script>
