<template>
  <div>
    <UAlert
      v-if="showAlert"
      icon="i-heroicons-bell"
      title="Waiting for submissions"
      variant="soft"
      color="primary"
      class="mb-4"
    />
    <div class="flex items-end gap-x-2">
      <UFormGroup label="Form Endpoint" class="flex-grow">
        <UInput :value="url" disabled> </UInput>
      </UFormGroup>
      <UButton
        :icon="
          !copying
            ? 'i-heroicons-clipboard-document'
            : 'i-heroicons-clipboard-document-check'
        "
        @click="copy"
      >
        Copy
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  formId: {
    type: String,
    required: true,
  },
  showAlert: {
    type: Boolean,
    default: false,
  },
});

const url = computed(
  () => `${useRuntimeConfig().public.BASE_URL}/f/${props.formId}`
);

const copying = ref(false);
function copy() {
  copying.value = true;
  navigator.clipboard.writeText(url.value);
  setTimeout(() => {
    copying.value = false;
  }, 1000);
}
</script>

<style scoped></style>
