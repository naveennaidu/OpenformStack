<template>
  <UModal v-model="showWorkspaceModal">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold">Create Workspace</h2>
          <UButton
            icon="i-heroicons-x-mark"
            variant="ghost"
            color="gray"
            @click="showWorkspaceModal = false"
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

const workspaceStore = useWorkspaceStore();
const { showWorkspaceModal } = storeToRefs(workspaceStore);

const schema = z.object({
  name: z.string(),
});

const formData = ref({ name: "" });
const loading = ref(false);
const submit = async () => {
  loading.value = true;
  await workspaceStore.createWorkspace(formData.value.name);
  loading.value = false;
  formData.value.name = "";
};
</script>

<style scoped></style>
