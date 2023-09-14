<template>
  <div>
    <h1 class="text-2xl font-medium">Integrations</h1>
    <p class="text-sm text-gray-200">
      Connect OpenformStack with your favourite integrations
    </p>
    <div class="mt-4 grid grid-cols-3">
      <UCard>
        <div class="flex items-center justify-between">
          <div class="text-lg font-medium">Webhooks</div>
          <UToggle v-model="webbookEnabled" />
        </div>
        <div>Trigger webhook on new submission</div>
        <form v-if="webbookEnabled" @submit.prevent="saveWebhook" class="mt-4">
          <UFormGroup label="Webhook URL" required>
            <UInput v-model="webhookUrl" required />
          </UFormGroup>
          <div v-if="showSave" class="flex justify-end">
            <UButton type="submit" class="mt-4" :loading="loading">
              Save
            </UButton>
          </div>
        </form>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWorkspaceStore } from "~/store/workspace";

const props = defineProps({
  formId: {
    type: String,
    required: true,
  },
  webbookEnabled: {
    type: Boolean,
    required: true,
  },
  webhookUrl: {
    type: String,
    required: false,
    default: "",
  },
});

const webbookEnabled = ref(false);
const webhookUrl = ref("");

onMounted(() => {
  webbookEnabled.value = props.webbookEnabled;
  webhookUrl.value = props.webhookUrl;
});

const showSave = computed(() => {
  return (
    webbookEnabled.value !== props.webbookEnabled ||
    webhookUrl.value !== props.webhookUrl
  );
});

const workspaceStore = useWorkspaceStore();
const loading = ref(false);
async function saveWebhook() {
  loading.value = true;
  await workspaceStore.updateForm(props.formId, {
    webhookEnabled: webbookEnabled.value,
    webhookUrl: webhookUrl.value,
  });
  loading.value = false;
}

watch(
  () => webbookEnabled.value,
  async (val) => {
    if (!val) {
      await workspaceStore.updateForm(props.formId, {
        webhookEnabled: false,
      });
    }
  }
);
</script>

<style scoped></style>
