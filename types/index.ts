export interface Workspace {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  forms: Form[];
}

export interface Form {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  workspaceId: string;
}
