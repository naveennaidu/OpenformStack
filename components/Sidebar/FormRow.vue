<template>
  <div
    class="pl-8 text-sm py-1 cursor-pointer hover:bg-gray-100 hover:dark:bg-gray-800/80 rounded mb-0.5"
    :class="{
      'bg-gray-100 dark:bg-gray-800': active,
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
