<template>
  <div class="px-0.5 py-2 dark:bg-neutral-900 bg-zinc-50 w-60">
    <TheProfileMenu class="mb-1" />
    <UVerticalNavigation :links="links" />
    <div>
      <div
        class="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 pl-2 mt-8"
      >
        WORKSPACES
      </div>
      <div v-for="workspace in workspaces" :key="workspace.id">
        <div
          class="group text-sm cursor-pointer pl-4 hover:bg-gray-100 hover:dark:bg-gray-800/80 rounded mb-0.5 flex items-center justify-between"
          :class="{
            'bg-gray-100 dark:bg-gray-800':
              workspace.id === useRoute().params.workspaceId,
          }"
          @click="useRouter().push(`/workspaces/${workspace.id}`)"
        >
          <div>
            {{ workspace.name }}
          </div>

          <UButton
            icon="i-heroicons-plus"
            color="gray"
            variant="ghost"
            size="xs"
            class="invisible group-hover:visible"
            @click.stop="createForm(workspace.id)"
          />
        </div>
        <div
          v-for="form in workspace.forms"
          :key="form.id"
          class="pl-8 text-sm py-1 cursor-pointer hover:bg-gray-100 hover:dark:bg-gray-800/80 rounded mb-0.5"
          :class="{
            'bg-gray-100 dark:bg-gray-800':
              form.id === useRoute().params.formId,
          }"
          @click="useRouter().push(`/forms/${form.id}`)"
        >
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
    <UModal v-model="showHeadlessForm">
      <HeadlessForm :workspace-id="workspaceId" @close="closeForm" />
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { Workspace, Form } from "@prisma/client";
import { WorkspaceWithForms } from "~/types";

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
async function closeWorkspace(workspace?: Workspace) {
  showWorkspace.value = false;

  if (workspace) {
    workspaces.value.push({ ...workspace, forms: [] });
    await useRouter().push(`/workspaces/${workspace.id}`);
  }
}

// form
const showHeadlessForm = ref(false);
const workspaceId = ref("");
function createForm(id: string) {
  workspaceId.value = id;
  showHeadlessForm.value = true;
}

async function closeForm(form?: Form) {
  showHeadlessForm.value = false;
  workspaceId.value = "";
  console.log(form);

  if (form) {
    const workspace = workspaces.value.find(
      (workspace) => workspace.id === form.workspaceId
    );
    if (workspace) {
      workspace.forms.push(form);
      await useRouter().push(`/forms/${form.id}`);
    }
  }
}
</script>

<style scoped></style>
