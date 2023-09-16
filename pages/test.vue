<template>
  <form @submit.prevent="submitForm" class="h-screen mt-24">
    <input type="email" name="email" v-model="email" />
    <button type="submit">Join Waitlist</button>
  </form>
</template>

<script setup>
definePageMeta({
  layout: "open",
});
const email = ref("");

async function submitForm() {
  await fetch("http://localhost:3000/f/clmkkd6tm00009vqmq7jy5ru9", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: email.value }),
  });
}
</script>
