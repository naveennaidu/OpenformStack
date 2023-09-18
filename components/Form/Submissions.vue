<template>
  <div>
    <div class="flex items-center justify-between pb-2">
      <UButton
        icon="i-heroicons-trash"
        color="red"
        size="xs"
        :loading="deleting"
        :class="selected.length > 0 ? 'visible' : 'invisible'"
        @click="deleteSelected"
      >
        Delete
      </UButton>
      <USelectMenu v-model="view" :options="['Inbox', 'Spam']"> </USelectMenu>
    </div>
    <div
      class="overflow-hidden shadow ring-1 ring-black dark:ring-gray-700 ring-opacity-5 sm:rounded-lg"
    >
      <UTable
        v-if="submissionObject && submissionObject.submissions.length > 0"
        v-model="selected"
        :columns="tableCols"
        :rows="tableRows"
        :loading="loading"
        @select="onSelect"
      />

      <div v-else class="flex flex-col items-center py-10">
        <div class="flex items-center justify-center h-32 my-8">
          <div class="text-gray-400 text-center">
            <UIcon name="i-heroicons-document-text" class="h-12 w-12" />
            <p class="mt-2 text-sm">You don't have any submissions yet.</p>
          </div>
        </div>
        <UButton @click="$router.replace({ query: { tab: 'Setup' } })">
          How to setup?
        </UButton>
      </div>
    </div>
    <div class="flex items-center justify-between space-x-2 mt-2">
      <div class="text-gray-400">
        Total: {{ submissionObject?.pagination.total ?? 0 }}
      </div>
      <UPagination
        v-model="page"
        :page-count="pageCount"
        :total="submissionObject?.pagination.total ?? 0"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Submission } from "@prisma/client";
import { Pagination } from "~/types";

const props = defineProps({
  formId: {
    type: String,
    required: true,
  },
});

const submissionObject = ref<{
  submissions: Submission[];
  keys: string[];
  pagination: Pagination;
}>();

const page = ref(1);
const pageCount = ref(10);

const loading = ref(false);
async function fetchSubmissions() {
  loading.value = true;
  const { data } = await useFetch(`/api/forms/${props.formId}/submissions`, {
    method: "GET",
    query: {
      skip: (page.value - 1) * pageCount.value,
      take: pageCount.value,
      isSpam: view.value === "Spam",
    },
  });
  loading.value = false;
  submissionObject.value = {
    submissions:
      data.value?.submissions.map((submission) => ({
        ...submission,
        createdAt: new Date(submission.createdAt),
      })) ?? [],
    keys: data.value?.keys ?? [],
    pagination: data.value?.pagination ?? {
      skip: 0,
      take: 10,
      total: 0,
    },
  };
}
onMounted(async () => {
  await nextTick();
  await fetchSubmissions();
});

watch(
  () => page.value,
  async () => {
    await fetchSubmissions();
  }
);

const dayjs = useDayjs();

const tableCols = computed(() => {
  const cols =
    submissionObject.value?.keys.map((column) => {
      return {
        key: column,
        label: column,
      };
    }) ?? [];

  return [
    {
      key: "createdAt",
      label: "Submitted at",
    },
    ...cols,
  ];
});

const tableRows = computed(() => {
  return submissionObject.value?.submissions.map((submission) => {
    let rowData: any = {};
    submissionObject.value?.keys.forEach((column) => {
      rowData[column] = (submission.data as any)[column] ?? "-";
    });
    return {
      ...rowData,
      createdAt: dayjs(submission.createdAt).format("DD-MM-YYYY HH:mm"),
      id: submission.id,
    };
  });
});

const selected = ref<any[]>([]);

function onSelect(row: any) {
  const index = selected.value.findIndex((item) => item.id === row.id);
  if (index === -1) {
    selected.value.push(row);
  } else {
    selected.value.splice(index, 1);
  }
}

const deleting = ref(false);
async function deleteSelected() {
  deleting.value = true;
  const { error } = await useFetch(`/api/forms/${props.formId}/submissions`, {
    method: "DELETE",
    body: JSON.stringify({
      ids: selected.value.map((item) => item.id),
    }),
  });
  deleting.value = false;
  if (error.value) {
    console.error(error.value);
    return;
  }
  deleteSubmissions(selected.value.map((item) => item.id));
  selected.value = [];
}

function deleteSubmissions(ids: string[]) {
  if (submissionObject.value) {
    submissionObject.value.submissions =
      submissionObject.value.submissions.filter(
        (submission) => !ids.includes(submission.id)
      );
  }
}

// View
const view = ref("Inbox");
watch(
  () => view.value,
  async (_) => {
    await fetchSubmissions();
  }
);
</script>

<style scoped></style>
