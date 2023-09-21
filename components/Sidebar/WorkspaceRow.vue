<template>
  <div
    class="group text-sm cursor-pointer font-medium text-gray-500 hover:text-gray-800 pl-4 hover:bg-gray-100 hover:dark:bg-gray-800/80 rounded mb-0.5 flex items-center justify-between"
    :class="{
      'bg-gray-100 text-gray-800 dark:bg-gray-900': active,
    }"
  >
    <div>
      <slot />
    </div>
    <UButton
      icon="i-heroicons-plus"
      color="gray"
      variant="ghost"
      size="xs"
      class="invisible group-hover:visible"
      @click.stop="emit('createForm')"
    />
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

const emit = defineEmits(["createForm", "close"]);
</script>

<style scoped></style>
