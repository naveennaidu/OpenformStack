<template>
  <div>
    <div
      class="text-xs font-semibold text-gray-400 dark:text-gray-400 mb-1 pl-4 mt-8"
    >
      WORKSPACES
    </div>
    <div v-for="workspace in workspaceWithForms" :key="workspace.id">
      <SidebarWorkspaceRow
        :active="workspace.id === useRoute().params.workspaceId"
        @click="useRouter().push(`/workspaces/${workspace.id}`)"
        @create-form="createForm(workspace.id)"
      >
        {{ workspace.name }}
      </SidebarWorkspaceRow>
      <SidebarFormRow
        v-for="form in workspace.forms"
        :key="form.id"
        :active="form.id === useRoute().params.formId"
        @click="useRouter().push(`/forms/${form.id}`)"
      >
        {{ form.name }}
      </SidebarFormRow>
    </div>
    <UButton
      icon="i-heroicons-plus"
      color="gray"
      variant="ghost"
      size="xs"
      block
      class="mt-2"
      @click="showWorkspaceModal = true"
    >
      Create new workspace
    </UButton>

    <WorkspaceCreateForm />
    <CreateFormModal />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useWorkspaceStore } from "~/store/workspace";

const workspaceStore = useWorkspaceStore();
const { workspaceWithForms, formModalWorkspaceId, showWorkspaceModal } =
  storeToRefs(workspaceStore);

await workspaceStore.getWorkspaceWithForms();

function createForm(wId: string) {
  formModalWorkspaceId.value = wId;
}
</script>

<style scoped></style>
