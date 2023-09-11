import { WorkspaceWithForms } from "~/types";

export const useWorkspaceStore = defineStore("workspace", {
  state: () => ({
    workspaceWithForms: [] as WorkspaceWithForms[],
    showWorkspaceModal: false,
    formModalWorkspaceId: "",
  }),
  actions: {
    async getWorkspaceWithForms() {
      const { data } = await useFetch("/api/workspaces");
      this.workspaceWithForms =
        data.value?.workspaces.map((workspace) => ({
          ...workspace,
          createdAt: new Date(workspace.createdAt),
          updatedAt: new Date(workspace.updatedAt),
          forms: workspace.forms.map((form) => ({
            ...form,
            createdAt: new Date(form.createdAt),
            updatedAt: new Date(form.updatedAt),
          })),
        })) ?? [];
    },

    async createWorkspace(name: string) {
      const { data } = await useFetch("/api/workspaces", {
        method: "POST",
        body: { name },
      });
      if (data.value) {
        this.workspaceWithForms.push({
          ...data.value.workspace,
          createdAt: new Date(data.value.workspace.createdAt),
          updatedAt: new Date(data.value.workspace.updatedAt),
          forms: [],
        });
        this.showWorkspaceModal = false;
        navigateTo(`/workspaces/${data.value.workspace.id}`);
      }
    },

    async createForm(name: string, workspaceId: string) {
      const { data } = await useFetch(`/api/forms`, {
        method: "POST",
        body: { name, workspaceId },
      });
      if (data.value) {
        const workspace = this.workspaceWithForms.find(
          (workspace) => workspace.id === data.value?.form.workspaceId
        );
        if (workspace) {
          workspace.forms.push({
            ...data.value.form,
            createdAt: new Date(data.value.form.createdAt),
            updatedAt: new Date(data.value.form.updatedAt),
          });
        }
        this.formModalWorkspaceId = "";
        navigateTo(`/forms/${data.value.form.id}`);
      }
    },

    async updateForm(id: string, body: any) {
      const { data } = await useFetch(`/api/forms/${id}`, {
        method: "PUT",
        body,
      });
      if (data.value) {
        const workspace = this.workspaceWithForms.find(
          (workspace) => workspace.id === data.value?.form.workspaceId
        );
        if (workspace) {
          const formIndex = workspace.forms.findIndex(
            (form) => form.id === data.value?.form.id
          );
          if (formIndex !== -1) {
            workspace.forms[formIndex] = {
              ...data.value.form,
              createdAt: new Date(data.value.form.createdAt),
              updatedAt: new Date(data.value.form.updatedAt),
            };
          }
        }
      }
    },
  },
});
