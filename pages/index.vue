<template>
  <div>
    <LpHeroSection />
    <!-- <LpFeatureSection /> -->
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "open",
});

const { status } = useAuth();

watchEffect(async () => {
  if (status.value === "authenticated") {
    await useRouter().push("/dashboard");
  }
});
</script>

<style scoped></style>
