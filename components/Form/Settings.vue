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
          Thank You Page
        </h2>
        <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
          Customize the thank you page for your form.
        </p>
      </div>

      <form
        class="bg-white dark:bg-black shadow-sm ring-1 ring-gray-900/5 dark:ring-gray-100/10 sm:rounded-xl md:col-span-2"
        @submit.prevent="updateRedirectForm"
      >
        <div class="px-4 py-6 sm:p-8">
          <div
            class="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6"
          >
            <div class="col-span-full">
              <URadio
                v-model="formData.customRedirect"
                :value="false"
                label="Default"
                help="Users will be redirected to default thank you page"
                class="mb-2"
              >
                <template #label>
                  <span>
                    Default (<span class="text-primary-400">
                      openformstack.com/thank-you
                    </span>
                    )
                  </span>
                </template>
              </URadio>
              <URadio
                v-model="formData.customRedirect"
                :value="true"
                label="Custom"
                help="Users will be redirected to your custom thank you page"
              />

              <UInput
                v-if="formData.customRedirect"
                v-model="formData.customRedirectUrl"
                placeholder="https://example.com/thank-you"
                class="mt-4 ml-6"
              />
            </div>
          </div>
        </div>
        <div
          class="flex items-center justify-end gap-x-6 border-t border-gray-900/10 dark:border-gray-100/10 px-4 py-4 sm:px-8"
        >
          <UButton type="submit" :loading="redirectLoading"> Save </UButton>
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
              <UFormGroup
                v-if="formData.selfEmailNotification"
                label="Emails"
                description="Add more emails to get notified. Separate each email by comma"
                class="mt-2 p-3 ring-1 ring-gray-200 rounded"
              >
                <UInput
                  v-model="formData.selfEmails"
                  placeholder="example1@test.com,example2@test.com"
                  class="mt-2"
                />
              </UFormGroup>
            </div>
            <div class="col-span-full">
              <div class="flex items-center justify-between">
                <UFormGroup
                  label="Respondent Email Notification"
                  description="Send a customized text email to respondents after form submission."
                >
                </UFormGroup>
                <UToggle v-model="formData.respondentEmailNotification" />
              </div>
              <div
                v-if="formData.respondentEmailNotification"
                class="mt-2 mx-6 space-y-2"
              >
                <UFormGroup label="From Name" required>
                  <UInput
                    v-model="formData.fromName"
                    placeholder="Company Name"
                    required
                  />
                </UFormGroup>
                <UFormGroup label="Subject" required>
                  <UInput
                    v-model="formData.subject"
                    placeholder="Email subject"
                    required
                  />
                </UFormGroup>
                <UFormGroup label="Message" required>
                  <UTextarea
                    v-model="formData.message"
                    placeholder="Email message"
                    required
                  />
                </UFormGroup>
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
import { useWorkspaceStore } from "~/store/workspace";

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
  selfEmails: "" as string,
  respondentEmailNotification: false,
  customRedirect: false,
  customRedirectUrl: undefined as string | undefined,
  fromName: "",
  subject: "",
  message: "",
});

onMounted(() => {
  formData.value.name = props.form.name;
  formData.value.closed = props.form.closed;
  formData.value.selfEmailNotification = props.form.selfEmailNotification;
  formData.value.selfEmails = props.form.selfEmails.join(",");
  formData.value.respondentEmailNotification =
    props.form.respondentEmailNotification;
  formData.value.customRedirect = props.form.customRedirect ?? false;
  formData.value.customRedirectUrl = props.form.customRedirectUrl;
  formData.value.fromName = props.form.fromName;
  formData.value.subject = props.form.subject;
  formData.value.message = props.form.message;
});

const workspaceStore = useWorkspaceStore();

const generalLoading = ref(false);
async function updateGeneralForm() {
  generalLoading.value = true;
  await workspaceStore.updateForm(props.form.id, {
    name: formData.value.name,
    closed: formData.value.closed,
  });
  generalLoading.value = false;
}

const redirectLoading = ref(false);
async function updateRedirectForm() {
  redirectLoading.value = true;
  await workspaceStore.updateForm(props.form.id, {
    customRedirect: formData.value.customRedirect,
    customRedirectUrl: formData.value.customRedirectUrl,
  });
  redirectLoading.value = false;
}

const notificationLoading = ref(false);
async function updateNotificationForm() {
  notificationLoading.value = true;
  await workspaceStore.updateForm(props.form.id, {
    selfEmailNotification: formData.value.selfEmailNotification,
    selfEmails: formData.value.selfEmails
      ? formData.value.selfEmails.split(",").map((email) => email.trim())
      : [],
    respondentEmailNotification: formData.value.respondentEmailNotification,
    fromName: formData.value.fromName,
    subject: formData.value.subject,
    message: formData.value.message,
  });
  notificationLoading.value = false;
}
</script>

<style scoped></style>
