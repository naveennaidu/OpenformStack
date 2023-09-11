<template>
  <UModal
    :model-value="formModalWorkspaceId !== ''"
    @update:model-value="formModalWorkspaceId = ''"
  >
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold">Create Form</h2>
          <UButton
            icon="i-heroicons-x-mark"
            variant="ghost"
            color="gray"
            @click="formModalWorkspaceId = ''"
          />
        </div>
      </template>
      <form @submit.prevent="submit">
        <UFormGroup label="Name" name="name">
          <UInput v-model="formData.name" />
        </UFormGroup>
        <div class="flex justify-end">
          <UButton type="submit" :loading="loading" class="mt-4">
            Create
          </UButton>
        </div>
      </form>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { z } from "zod";
import { useWorkspaceStore } from "~/store/workspace";

const schema = z.object({
  name: z.string(),
});

const formData = ref({ name: "" });

const workspaceStore = useWorkspaceStore();
const { formModalWorkspaceId } = storeToRefs(workspaceStore);

const loading = ref(false);
const submit = async () => {
  loading.value = true;
  await workspaceStore.createForm(
    formData.value.name,
    formModalWorkspaceId.value
  );
  loading.value = false;
  formData.value.name = "";
};
</script>

<style scoped></style>
