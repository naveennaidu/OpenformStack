<template>
  <UButton
    icon="i-heroicons-arrow-down-tray"
    variant="ghost"
    color="gray"
    size="xs"
    :loading="loading"
    @click="downloadCsv"
  >
    Download CSV
  </UButton>
</template>

<script setup lang="ts">
const props = defineProps({
  formId: {
    type: String,
    required: true,
  },
});

const loading = ref(false);

async function downloadCsv() {
  loading.value = true;
  await useFetch(`/api/forms/${props.formId}/submissions/csv`, {
    onResponse({ response }) {
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(new Blob([response._data]));
      link.setAttribute("download", "submissions.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
  });
  loading.value = false;
}
</script>

<style scoped></style>
