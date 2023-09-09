<template>
  <div class="p-4">
    <h1 class="text-2xl font-medium">
      {{ data?.workspace.name }}
    </h1>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});
const workspaceId = computed(() => useRoute().params.workspaceId);
const { data } = await useFetch(`/api/workspaces/${workspaceId.value}`);
</script>

<style scoped></style>
