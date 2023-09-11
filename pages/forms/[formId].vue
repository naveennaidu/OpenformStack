<template>
  <div class="p-4">
    <h1 class="text-2xl font-medium">
      {{ form?.form.name }}
    </h1>

    <UTabs v-model="selectedTab" :items="tabs" class="mt-4">
      <template #item="{ item }">
        <div class="mt-8">
          <div v-if="item.key === 'submissions'">
            <FormSubmissions
              v-if="submissions"
              :submissions="submissions.submissions"
            />
          </div>
          <div v-if="item.key === 'setup'">
            <FormSetup
              :form-id="formId"
              :show-alert="submissions?.submissions.length === 0"
            />
          </div>
          <div v-if="item.key === 'settings'">
            <FormSettings v-if="form" :form="form.form" />
          </div>
        </div>
      </template>
    </UTabs>
  </div>
</template>

<script setup lang="ts">
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
const { data: form, error } = await useFetch(`/api/forms/${formId.value}`);

// submissions
const { data: submissions } = await useFetch(
  `/api/forms/${formId.value}/submissions`
);

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
    key: "settings",
    label: "Settings",
  },
];
</script>

<style scoped></style>
