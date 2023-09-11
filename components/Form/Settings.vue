<template>
  <div class="space-y-10 divide-y divide-gray-900/10 dark:divide-gray-100/10">
    <div class="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
      <div class="px-4 sm:px-0">
        <h2
          class="text-base font-semibold leading-7 text-gray-900 dark:text-gray-100"
        >
          General
        </h2>
        <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
          Basic information about your form.
        </p>
      </div>

      <form
        class="bg-white dark:bg-black shadow-sm ring-1 ring-gray-900/5 dark:ring-gray-100/10 sm:rounded-xl md:col-span-2"
        @submit.prevent="updateGeneralForm"
      >
        <div class="px-4 py-6 sm:p-8">
          <div
            class="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6"
          >
            <div class="sm:col-span-4">
              <UFormGroup label="Form Name">
                <UInput v-model="formData.name" />
              </UFormGroup>
            </div>

            <div class="col-span-full">
              <div class="flex items-center justify-between">
                <UFormGroup
                  label="Close Form"
                  description="People won't be able to respond to this form anymore."
                >
                </UFormGroup>
                <UToggle v-model="formData.closed" />
              </div>
            </div>
          </div>
        </div>
        <div
          class="flex items-center justify-end gap-x-6 border-t border-gray-900/10 dark:border-gray-100/10 px-4 py-4 sm:px-8"
        >
          <UButton type="submit" :loading="generalLoading"> Save </UButton>
        </div>
      </form>
    </div>

    <div class="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
      <div class="px-4 sm:px-0">
        <h2
          class="text-base font-semibold leading-7 text-gray-900 dark:text-gray-100"
        >
          Email Notifications
        </h2>
        <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
          Manage your email notifications settings.
        </p>
      </div>

      <form
        class="bg-white dark:bg-black shadow-sm ring-1 ring-gray-900/5 dark:ring-gray-100/10 sm:rounded-xl md:col-span-2"
        @submit.prevent="updateNotificationForm"
      >
        <div class="px-4 py-6 sm:p-8">
          <div
            class="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6"
          >
            <div class="col-span-full">
              <div class="flex items-center justify-between">
                <UFormGroup
                  label="Self Email Notification"
                  description="Get an email for new form submissions."
                >
                </UFormGroup>
                <UToggle v-model="formData.selfEmailNotification" />
              </div>
            </div>
          </div>
        </div>
        <div
          class="flex items-center justify-end gap-x-6 border-t border-gray-900/10 dark:border-gray-100/10 px-4 py-4 sm:px-8"
        >
          <UButton type="submit" :loading="notificationLoading"> Save </UButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  form: {
    type: Object,
    required: true,
  },
});

const formData = ref({
  name: "",
  closed: false,
  selfEmailNotification: true,
});

onMounted(() => {
  formData.value.name = props.form.name;
  formData.value.closed = props.form.closed;
  formData.value.selfEmailNotification = props.form.selfEmailNotification;
});

const generalLoading = ref(false);
async function updateGeneralForm() {
  generalLoading.value = true;
  await useFetch(`/api/forms/${props.form.id}`, {
    method: "PUT",
    body: JSON.stringify(formData.value),
  });
  generalLoading.value = false;
}

const notificationLoading = ref(false);
async function updateNotificationForm() {
  notificationLoading.value = true;
  await useFetch(`/api/forms/${props.form.id}`, {
    method: "PUT",
    body: JSON.stringify({
      selfEmailNotification: formData.value.selfEmailNotification,
    }),
  });
  notificationLoading.value = false;
}
</script>

<style scoped></style>
