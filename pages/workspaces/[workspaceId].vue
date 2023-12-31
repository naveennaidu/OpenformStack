<template>
  <div class="p-4">
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-medium">
        {{ data?.workspace.name }}
      </h1>
      <UButton
        icon="i-heroicons-plus"
        @click="formModalWorkspaceId = workspaceId"
      >
        Create Form
      </UButton>
    </div>
    <div
      v-if="data && data.workspace.forms.length > 0"
      class="grid grid-cols-2 md:grid-cols-3 gap-2"
    >
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
    <div v-else>
      <div class="flex items-center justify-center h-32 mt-8">
        <div class="text-gray-400 text-center">
          <UIcon name="i-heroicons-document-text" class="h-12 w-12" />
          <p class="mt-2 text-sm">You don't have any forms yet.</p>
          <p class="mt-2 text-sm">
            <UButton
              icon="i-heroicons-plus"
              color="gray"
              variant="ghost"
              size="xs"
              @click="formModalWorkspaceId = workspaceId"
            >
              Create Form
            </UButton>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useWorkspaceStore } from "~/store/workspace";
import type { WorkspaceWithForms } from "~/types";

definePageMeta({
  middleware: "auth",
  title: "Workspace",
});
const dayjs = useDayjs();
const workspaceId = computed(() => useRoute().params.workspaceId as string);

const workspace = ref<WorkspaceWithForms | undefined>(undefined);
const { data } = await useFetch(`/api/workspaces/${workspaceId.value}`);
workspace.value = data.value?.workspace as WorkspaceWithForms | undefined;

const { formModalWorkspaceId } = storeToRefs(useWorkspaceStore());
</script>

<style scoped></style>
