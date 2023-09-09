<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-semibold">Create Workspace</h2>
        <UButton
          icon="i-heroicons-x-mark"
          variant="ghost"
          color="gray"
          @click="emit('close')"
        />
      </div>
    </template>
    <form @submit.prevent="submit">
      <UFormGroup label="Name" name="name">
        <UInput v-model="formData.name" />
      </UFormGroup>
      <div class="flex justify-end">
        <UButton type="submit" :loading="loading" class="mt-4">Create</UButton>
      </div>
    </form>
  </UCard>
</template>

<script setup lang="ts">
import { z } from "zod";

const emit = defineEmits(["close"]);
const schema = z.object({
  name: z.string(),
});

const formData = ref({ name: "" });
const loading = ref(false);
const submit = async () => {
  loading.value = true;
  const { data } = await useFetch("/api/workspaces", {
    method: "POST",
    body: JSON.stringify(formData.value),
  });
  loading.value = false;
  if (data.value) {
    emit("close", data.value.workspace);
  }
};
</script>

<style scoped></style>
