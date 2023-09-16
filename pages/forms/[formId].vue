<template>
  <div class="p-4">
    <h1 class="text-2xl font-medium">
      {{ form?.name }}
    </h1>

    <UTabs v-model="selectedTab" :items="tabs" class="mt-4">
      <template #item="{ item }">
        <div>
          <div v-if="item.key === 'submissions'">
            <FormSubmissions :form-id="formId" />
          </div>
          <div v-if="item.key === 'setup'" class="mt-8">
            <FormSetup :form-id="formId" />
          </div>
          <div v-if="item.key === 'integrations'" class="mt-8">
            <FormIntegrations
              v-if="form"
              :form-id="formId"
              :webbook-enabled="form.webhookEnabled"
              :webhook-url="form.webhookUrl ?? undefined"
            />
          </div>
          <div v-if="item.key === 'settings'" class="mt-8">
            <FormSettings v-if="form" :form="form" />
          </div>
        </div>
      </template>
    </UTabs>
  </div>
</template>

<script setup lang="ts">
import { Submission } from "@prisma/client";
import { storeToRefs } from "pinia";
import { useWorkspaceStore } from "~/store/workspace";

definePageMeta({ middleware: "auth" });

const route = useRoute();
const router = useRouter();

const selectedTab = computed({
  get() {
    const index = tabs.findIndex((item) => item.label === route.query.tab);
    if (index === -1) {
      return 0;
    }
    return index;
  },
  set(value) {
    router.replace({
      query: { tab: tabs[value].label },
    });
  },
});

const formId = computed(() => useRoute().params.formId as string);
const { workspaceWithForms } = storeToRefs(useWorkspaceStore());

const form = computed(() => {
  for (const workspace of workspaceWithForms.value) {
    const foundForm = workspace.forms.find((form) => form.id === formId.value);
    if (foundForm) {
      return foundForm;
    }
  }
  return undefined;
});

const tabs = [
  {
    key: "submissions",
    label: "Submissions",
  },
  {
    key: "setup",
    label: "Setup",
  },
  {
    key: "integrations",
    label: "Integrations",
  },
  {
    key: "settings",
    label: "Settings",
  },
];
</script>

<style scoped></style>
