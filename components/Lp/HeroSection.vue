<template>
  <div class="relative isolate pt-14">
    <div class="py-24 sm:py-32 lg:pb-40">
      <div class="sm:px-6 mx-auto max-w-7xl lg:px-8">
        <div class="max-w-3xl mx-auto text-center">
          <h1
            class="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl"
          >
            Form meets API
          </h1>
          <p
            class="mt-6 text-sm sm:text-lg leading-6 sm:leading-8 text-gray-700 dark:text-gray-300"
          >
            OpenformStack is an open source form backend that allows you to
            collect form submissions without writing any backend code.
          </p>
          <div class="flex items-center justify-center mt-10 gap-x-6">
            <UButton
              @click="continueWithGoogle"
              color="primary"
              variant="solid"
            >
              <IconGoogle class="w-5 h-5" />
              Continue with Google
            </UButton>
            <NuxtLink
              to="https://github.com/naveennaidu/OpenformStack"
              target="_blank"
              class="text-sm font-semibold leading-6 text-gray-900 dark:text-white flex items-center hover:bg-gray-300/20 hover:dark:bg-gray-800/60 px-4 py-1.5 rounded-md transition-colors duration-200 ease-in-out"
            >
              <githubIcon class="w-5 h-5" />
              <div class="ml-2">Github</div>
            </NuxtLink>
          </div>
        </div>
        <div class="relative sm:px-12 pt-8 sm:pt-16">
          <div class="max-w-2xl mx-auto md:mx-0 md:max-w-none">
            <div class="overflow-hidden bg-gray-900 sm:rounded-xl">
              <div class="flex bg-gray-800/40">
                <div
                  class="flex -mb-px text-sm font-medium leading-6 text-gray-400 cursor-pointer"
                >
                  <div
                    v-for="tab in ['html', 'react', 'vue']"
                    class="px-4 py-2"
                    :class="
                      selectedTab === tab
                        ? 'bg-white/5 border-r-white/10 text-white border-b border-r border-l border-l-white/10 border-b-white/20'
                        : 'border-gray-600/10'
                    "
                    @click="selectedTab = tab"
                  >
                    {{ tab }}
                  </div>
                </div>
              </div>
              <div class="relative px-6 pt-2 text-white pb-10 overflow-x-auto">
                <LpFormCode
                  :code="code"
                  :lang="selectedTab === 'react' ? 'js' : 'html'"
                />
                <UButton
                  size="2xs"
                  class="absolute"
                  :class="generateEndpointPosition"
                  @click="continueWithGoogle"
                >
                  Generate Endpoint
                </UButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const selectedTab = ref("html");

const { signIn } = useAuth();
async function continueWithGoogle() {
  await signIn("google");
}

const githubIcon = defineComponent({
  render: () =>
    h("svg", { fill: "currentColor", viewBox: "0 0 24 24" }, [
      h("path", {
        "fill-rule": "evenodd",
        d: "M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z",
        "clip-rule": "evenodd",
      }),
    ]),
});

const code = computed(() => {
  switch (selectedTab.value) {
    case "html":
      return `<form action="{endpoint}" method="POST">
  <input type="email" name="email">
  <button type="submit">Join Waitlist</button>
</form>
`;
    case "react":
      return `import React, { useState } from 'react';
import axios from 'axios';

function Form() {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('YOUR_API_ENDPOINT', { email });
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
    case "vue":
      return `<template>
  <form @submit.prevent="submitForm">
    <input type="email" name="email" v-model="email" />
    <button type="submit">Join Waitlist</button>
  <\/form>
<\/template>

<script setup>
const email = ref("");

async function submitForm() {
  await fetch("{endpoint}", {
    method: "POST",
    body: JSON.stringify({ email: email.value }),
  });
}
<\/script>`;
    default:
      return "";
  }
});

const generateEndpointPosition = computed(() => {
  switch (selectedTab.value) {
    case "html":
      return "top-[8px] left-[148px]";
    case "react":
      return "top-[440px] left-[212px]";
    case "vue":
      return "top-[272px] left-[160px]";
    default:
      return "top-[8px] left-[148px]";
  }
});
</script>

<style scoped></style>
