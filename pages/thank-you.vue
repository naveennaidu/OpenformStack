<template>
  <div>
    <div class="flex flex-col items-center justify-center h-screen">
      <div class="flex flex-col items-center justify-center space-y-4">
        <UIcon
          name="i-heroicons-check-circle"
          class="text-green-500 text-6xl"
        />
        <h1 class="text-4xl font-bold">Thank you!</h1>
        <p class="text-lg">Your response has been recorded.</p>
      </div>
      <UButton
        class="mt-8"
        variant="ghost"
        color="gray"
        icon="i-heroicons-chevron-left"
        @click="$router.go(-1)"
      >
        Go back
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "open",
});
</script>

<style scoped></style>
