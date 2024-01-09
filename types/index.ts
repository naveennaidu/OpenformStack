import type { Form, Workspace } from "@prisma/client";

export type WorkspaceWithForms = Workspace & { forms: Form[] };

export interface Pagination {
  skip: number;
  take: number;
  total: number;
}
