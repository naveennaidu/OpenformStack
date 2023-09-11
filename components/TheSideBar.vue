<template>
  <div class="px-0.5 py-2 dark:bg-neutral-900 bg-zinc-50 w-72">
    <TheProfileMenu class="mb-1" />
    <UVerticalNavigation :links="links" />
    <SidebarList />
  </div>
</template>

<script setup lang="ts">
const links = [
  {
    label: "Dashboard",
    icon: "i-heroicons-home",
    to: "/dashboard",
  },
  // {
  //   label: "Settings",
  //   icon: "i-heroicons-cog",
  //   to: "/settings",
  // },
];
</script>

<style scoped></style>
