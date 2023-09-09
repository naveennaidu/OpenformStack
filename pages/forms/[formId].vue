<template>
  <div class="p-4">
    <h1 class="text-2xl font-medium">
      {{ data?.form.name }}
    </h1>

    <div
      v-if="submissions && submissions.submissions.length === 0"
      class="max-w-5xl mt-4"
    >
      <UAlert
        icon="i-heroicons-bell"
        title="Waiting for submissions"
        variant="soft"
        color="primary"
        class="my-4"
      />
      <div class="flex items-end gap-x-2">
        <UFormGroup label="Form Endpoint" class="flex-grow">
          <UInput :value="`http://localhost:3000/f/${data?.form.id}`" disabled>
          </UInput>
        </UFormGroup>
        <UButton
          :icon="
            !copying
              ? 'i-heroicons-clipboard-document'
              : 'i-heroicons-clipboard-document-check'
          "
          @click="copy"
        >
          Copy
        </UButton>
      </div>
    </div>
    <UTabs v-else :items="tabs" class="mt-4">
      <template #item="{ item }">
        <div v-if="item.key === 'submissions'">
          <div
            class="mt-4 overflow-hidden shadow ring-1 ring-black dark:ring-gray-700 ring-opacity-5 sm:rounded-lg"
          >
            <table
              class="min-w-full divide-y divide-gray-300 dark:divide-gray-700"
            >
              <thead class="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100"
                  >
                    Submitted at
                  </th>
                  <th
                    v-for="(_, key) in submissions?.submissions[0].data"
                    :key="key"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100"
                  >
                    {{ key }}
                  </th>
                </tr>
              </thead>
              <tbody
                class="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-900"
              >
                <tr
                  v-for="submission in submissions?.submissions"
                  :key="submission.id"
                >
                  <td
                    class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-50"
                  >
                    {{ dayjs(submission.createdAt).format("DD-MM-YYYY HH:mm") }}
                  </td>
                  <td
                    v-for="(value, key) in submission.data"
                    :key="key"
                    class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-50"
                  >
                    {{ value }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div v-if="item.key === 'setup'">
          <div class="flex items-end gap-x-2 mt-4">
            <UFormGroup label="Form Endpoint" class="flex-grow">
              <UInput
                :value="`http://localhost:3000/f/${data?.form.id}`"
                disabled
              >
              </UInput>
            </UFormGroup>
            <UButton
              :icon="
                !copying
                  ? 'i-heroicons-clipboard-document'
                  : 'i-heroicons-clipboard-document-check'
              "
              @click="copy"
            >
              Copy
            </UButton>
          </div>
        </div>
        <div v-if="item.key === 'settings'">
          <div>Email notifications</div>
          <div>Self Email notification settings here</div>
        </div>
      </template>
    </UTabs>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: "auth" });

const dayjs = useDayjs();

const formId = computed(() => useRoute().params.formId);
const { data } = await useFetch(`/api/forms/${formId.value}`);

const copying = ref(false);
function copy() {
  copying.value = true;
  navigator.clipboard.writeText(
    `http://localhost:3000/f/${data.value?.form.id}`
  );
  setTimeout(() => {
    copying.value = false;
  }, 1000);
}

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
