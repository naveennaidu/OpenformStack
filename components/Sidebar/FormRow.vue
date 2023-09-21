<template>
  <div
    class="pl-8 text-sm py-1 cursor-pointer font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 hover:dark:bg-gray-800/80 rounded mb-0.5"
    :class="{
      'text-gray-900  bg-gray-100 dark:bg-gray-800': active,
    }"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps({
  active: {
    type: Boolean,
    required: false,
    default: false,
  },
});
</script>

<style scoped></style>
