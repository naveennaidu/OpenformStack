<template>
  <div>
    <div
      class="flex pb-2"
      :class="selected.length > 0 ? 'visible' : 'invisible'"
    >
      <UButton
        icon="i-heroicons-trash"
        color="red"
        size="xs"
        :loading="deleting"
        @click="deleteSelected"
      >
        Delete
      </UButton>
    </div>
    <div
      class="overflow-hidden shadow ring-1 ring-black dark:ring-gray-700 ring-opacity-5 sm:rounded-lg"
    >
      <UTable
        v-if="submissions.length > 0"
        v-model="selected"
        :columns="tableCols"
        :rows="tableRows"
        @select="onSelect"
      ></UTable>
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
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  submissions: {
    type: Array as PropType<any[]>,
    required: false,
    default: [],
  },
  columns: {
    type: Array as PropType<string[]>,
    required: false,
    default: [],
  },
  formId: {
    type: String,
    required: true,
  },
});

const emits = defineEmits({
  delete: (ids: string[]) => true,
});

const dayjs = useDayjs();

const tableCols = computed(() => {
  const cols = props.columns.map((column) => {
    return {
      key: column,
      label: column,
    };
  });

  return [
    {
      key: "createdAt",
      label: "Submitted at",
    },
    ...cols,
  ];
});

const tableRows = computed(() => {
  return props.submissions.map((submission) => {
    let rowData: any = {};
    props.columns.forEach((column) => {
      rowData[column] = submission.data[column] ?? "-";
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
  emits(
    "delete",
    selected.value.map((item) => item.id)
  );
  selected.value = [];
}
</script>

<style scoped></style>
