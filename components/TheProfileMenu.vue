<template>
  <UDropdown
    :items="items"
    :ui="{
      width: 'w-60',
      item: { disabled: 'cursor-text select-text' },
    }"
  >
    <UButton color="gray" variant="ghost" class="flex items-center w-full">
      <UAvatar :src="user.image" :alt="user.name" size="xs" />
      <span class="ml-2 text-sm font-medium text-gray-900 dark:text-white">
        {{ user.name }}
      </span>
    </UButton>
    <template #account="{ item }">
      <div class="text-left">
        <p>{{ user.name }}</p>
        <p class="text-sm font-medium text-gray-900 dark:text-white">
          {{ item.label }}
        </p>
      </div>
    </template>
    <template #item="{ item }">
      <UIcon
        :name="item.icon"
        class="h-4 w-4 text-gray-400 dark:text-gray-500"
      />
      <span class="truncate">{{ item.label }}</span>
    </template>
  </UDropdown>
</template>

<script setup lang="ts">
const { data, signOut } = useAuth();
const user = computed(() => data.value?.user);

const items = computed(() => [
  [
    {
      label: user.value.email,
      slot: "account",
      disabled: true,
    },
  ],
  [
    {
      label: "Sign out",
      icon: "i-heroicons-arrow-left-on-rectangle",
      click: async () => {
        await signOut();
        await useRouter().push("/login");
      },
    },
  ],
]);
</script>

<style scoped></style>
