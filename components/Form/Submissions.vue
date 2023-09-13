<template>
  <div
    class="overflow-hidden shadow ring-1 ring-black dark:ring-gray-700 ring-opacity-5 sm:rounded-lg"
  >
    <table
      v-if="submissions.length > 0"
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
            v-for="column in columns"
            :key="column"
            class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100"
          >
            {{ column }}
          </th>
        </tr>
      </thead>
      <tbody
        class="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-900"
      >
        <tr v-for="submission in submissions" :key="submission.id">
          <td
            class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-50"
          >
            {{ dayjs(submission.createdAt).format("DD-MM-YYYY HH:mm") }}
          </td>
          <td
            v-for="column in columns"
            :key="column"
            class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-50"
          >
            {{ submission.data[column] }}
          </td>
        </tr>
      </tbody>
    </table>
    <div
      v-else
      class="px-4 py-3 text-gray-500 dark:text-gray-400 text-sm text-center"
    >
      No submissions yet
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
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
});

const dayjs = useDayjs();
</script>

<style scoped></style>
