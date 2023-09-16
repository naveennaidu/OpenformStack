<template>
  <div>
    <div class="flex items-end gap-x-2">
      <UFormGroup label="Form Endpoint" class="flex-grow">
        <UInput :value="url" disabled> </UInput>
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
    <div class="w-2/3 mt-4">
      <h3 class="text-xl font-semibold">Setup</h3>
      <UTabs v-model="selectedTab" :items="tabs" class="mt-4">
        <template #item="{ item }">
          <div v-if="item.key === 'html'">
            <div
              class="bg-gray-800 p-4 rounded text-white overflow-auto text-sm"
            >
              <LpFormCode :code="htmlCode" />
            </div>
          </div>
          <div v-if="item.key === 'react'">
            <div
              class="bg-gray-800 p-4 rounded text-white overflow-auto text-sm"
            >
              <LpFormCode :code="reactCode" lang="js" />
            </div>
          </div>
          <div v-if="item.key === 'vue'">
            <div
              class="bg-gray-800 p-4 rounded text-white overflow-auto text-sm"
            >
              <LpFormCode :code="vueCode" />
            </div>
          </div>
        </template>
      </UTabs>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  formId: {
    type: String,
    required: true,
  },
});

const url = computed(
  () => `${useRuntimeConfig().public.BASE_URL}/f/${props.formId}`
);

const copying = ref(false);
function copy() {
  copying.value = true;
  navigator.clipboard.writeText(url.value);
  setTimeout(() => {
    copying.value = false;
  }, 1000);
}

const tabs = [
  {
    key: "html",
    label: "HTML",
  },
  {
    key: "react",
    label: "React",
  },
  {
    key: "vue",
    label: "Vue",
  },
];
const selectedTab = ref(0);

const htmlCode = `<form action="${url.value}" method="POST">
  <input type="email" name="email">
  <button type="submit">Join Waitlist</button>
</form>
`;

const reactCode = `import React, { useState } from 'react';
import axios from 'axios';

function Form() {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('${url.value}', { email });
      console.log('API call successful:', response.data);
    } catch (error) {
      console.error('API call failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit">Join Waitlist</button>
    </form>
  );
}

export default Form;
    `;

const vueCode = `<template>
  <form @submit.prevent="submitForm">
    <input type="email" name="email" v-model="email" />
    <button type="submit">Join Waitlist</button>
  <\/form>
<\/template>

<script setup>
const email = ref("");

async function submitForm() {
  await fetch("${url.value}", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: email.value }),
  });
}
<\/script>`;
</script>

<style scoped></style>
