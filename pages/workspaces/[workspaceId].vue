<template>
  <div class="p-4">
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-medium">
        {{ data?.workspace.name }}
      </h1>
      <UButton icon="i-heroicons-plus" @click="showHeadlessForm = true">
        Create Form
      </UButton>
    </div>
    <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
      <UCard
        v-for="form in data?.workspace.forms"
        :key="form.id"
        class="cursor-pointer"
        :ui="{ background: 'hover:bg-gray-50 hover:dark:bg-gray-800/60' }"
        @click="useRouter().push(`/forms/${form.id}`)"
      >
        <div class="text-lg font-medium">
          {{ form.name }}
        </div>
        <div class="dark:text-gray-400 text-gray-600">
          <div>Submissions: {{ form.submissions.length }}</div>
          <div class="text-sm">
            Last updated:
            {{ dayjs(form.updatedAt).format("MMM DD, YYYY HH:mm") }}
          </div>
        </div>
      </UCard>
    </div>
    <UModal v-model="showHeadlessForm">
      <HeadlessForm :workspace-id="workspaceId" @close="closeForm" />
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { Form, Workspace } from "@prisma/client";
import { WorkspaceWithForms } from "~/types";

definePageMeta({
  middleware: "auth",
});
const dayjs = useDayjs();
const workspaceId = computed(() => useRoute().params.workspaceId as string);

const workspace = ref<WorkspaceWithForms | undefined>(undefined);
const { data } = await useFetch(`/api/workspaces/${workspaceId.value}`);
workspace.value = data.value?.workspace as WorkspaceWithForms | undefined;

const showHeadlessForm = ref(false);
async function closeForm(form?: Form) {
  showHeadlessForm.value = false;

  if (form) {
    await useRouter().push(`/forms/${form.id}`);
  }
}
</script>

<style scoped></style>
