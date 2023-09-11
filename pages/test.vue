<template>
  <div class="flex flex-col">
    <form
      action="http://localhost:3000/f/clmegu1ar00049vy8kr3e5cfb"
      method="POST"
      class="flex flex-col gap-4"
    >
      <input
        type="email"
        name="email"
      /><!-- use this to reply visitors and prevent spam -->
      <input type="text" name="firstName" />
      <input type="text" name="lastName" />
      <input type="text" name="anotherInput" />
      <input type="hidden" name="_gotcha" /><!-- use this to prevent spam -->
      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "open",
});
</script>

<style scoped></style>
