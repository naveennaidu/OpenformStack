<template>
  <div class="p-4">
    <div
      v-for="workspace in workspaceWithForms"
      :key="workspace.id"
      class="mb-12"
    >
      <div
        class="pb-2 border-b dark:border-gray-100/10 flex items-center justify-between"
      >
        <h2 class="text-2xl">
          {{ workspace.name }}
        </h2>
        <UButton
          icon="i-heroicons-plus"
          color="gray"
          variant="ghost"
          size="xs"
          @click="formModalWorkspaceId = workspace.id"
        >
          Create Form
        </UButton>
      </div>

      <div
        v-if="workspace.forms.length > 0"
        class="grid grid-cols-2 md:grid-cols-3 gap-4 my-4"
      >
        <UCard
          v-for="form in workspace.forms"
          :key="form.id"
          class="cursor-pointer"
          :ui="{ background: 'hover:bg-gray-50 hover:dark:bg-gray-800/60' }"
          @click="useRouter().push(`/forms/${form.id}`)"
        >
          <div class="text-lg font-medium">
            {{ form.name }}
          </div>
          <div class="dark:text-gray-400 text-gray-600">
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
                @click="formModalWorkspaceId = workspace.id"
              >
                Create Form
              </UButton>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useWorkspaceStore } from "~/store/workspace";

definePageMeta({ middleware: "auth" });
const dayjs = useDayjs();

const workspaceStore = useWorkspaceStore();
const { workspaceWithForms, formModalWorkspaceId, showWorkspaceModal } =
  storeToRefs(workspaceStore);
</script>

<style scoped></style>
