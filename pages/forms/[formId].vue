<template>
  <div class="p-4">
    <h1 class="text-2xl font-medium">
      {{ data?.form.name }}
    </h1>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: "auth" });
const formId = computed(() => useRoute().params.formId);
const { data } = await useFetch(`/api/forms/${formId.value}`);
</script>

<style scoped></style>
