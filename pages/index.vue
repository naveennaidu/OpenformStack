<template>
  <div class="mt-16 mx-auto max-w-xl text-center">
    <h1 class="text-5xl font-semibold">Headless Forms</h1>

    <UButton
      @click="continueWithGoogle"
      color="gray"
      variant="solid"
      class="mt-8"
      size="xl"
    >
      <IconGoogle class="w-5 h-5" />
      Continue with Google
    </UButton>

    <div class="absolute bottom-12 left-1/2 transform -translate-x-1/2">
      Built with
      <div class="flex items-center justify-center gap-x-1">
        <UButton to="https://nuxt.com" target="_blank" variant="link">
          Nuxt 3
        </UButton>
        <UButton to="https://ui.nuxt.com" target="_blank" variant="link">
          Nuxt UI
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "open",
});

const { status, signIn } = useAuth();
async function continueWithGoogle() {
  await signIn("google");
}

watchEffect(async () => {
  if (status.value === "authenticated") {
    await useRouter().push("/dashboard");
  }
});
</script>

<style scoped></style>
