<template>
  <div class="px-0.5 py-2 dark:bg-neutral-900 bg-zinc-50 w-60">
    <TheProfileMenu class="mb-1" />
    <UVerticalNavigation :links="links" />
    <div>
      <div
        class="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 pl-2 mt-4"
      >
        WORKSPACES
      </div>
      <div
        v-for="workspace in workspaces"
        :key="workspace.id"
        class="cursor-pointer hover:bg-gray-100 hover:dark:bg-gray-800/80"
      >
        <div class="text-sm py-1 ml-4">
          {{ workspace.name }}
        </div>
        <div v-for="form in workspace.forms" :key="form.id">
          {{ form.name }}
        </div>
      </div>
    </div>
    <UButton
      icon="i-heroicons-plus"
      color="gray"
      variant="ghost"
      size="xs"
      block
      class="mt-2"
      @click="showWorkspace = true"
    >
      Create new workspace
    </UButton>
    <UModal v-model="showWorkspace">
      <WorkspaceForm @close="closeWorkspace" />
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { Workspace, Form } from "@prisma/client";

const links = [
  {
    label: "Dashboard",
    icon: "i-heroicons-home",
    to: "/dashboard",
  },
  {
    label: "Settings",
    icon: "i-heroicons-cog",
    to: "/settings",
  },
];
type WorkspaceWithForms = Workspace & { forms: Form[] };
const workspaces = ref<WorkspaceWithForms[]>([]);
const { data } = await useFetch("/api/workspaces");
workspaces.value =
  data.value?.workspaces.map((workspace) => ({
    ...workspace,
    createdAt: new Date(workspace.createdAt),
    updatedAt: new Date(workspace.updatedAt),
    forms: workspace.forms.map((form) => ({
      ...form,
      createdAt: new Date(form.createdAt),
      updatedAt: new Date(form.updatedAt),
    })),
  })) ?? [];
// workspace form
const showWorkspace = ref(false);
function closeWorkspace(workspace?: Workspace) {
  showWorkspace.value = false;
  console.log(workspace);

  if (workspace) {
    workspaces.value.push({ ...workspace, forms: [] });
  }
}
</script>

<style scoped></style>
