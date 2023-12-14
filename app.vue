<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script lang="ts" setup>
useHead({
  script: [
    {
      src: "https://plausible-analytics-production-a95c.up.railway.app/js/script.js",
      defer: true,
      "data-domain": "openformstack.com",
    },
  ],
});
</script>
