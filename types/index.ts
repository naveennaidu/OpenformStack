import { Form, Workspace } from "@prisma/client";

export type WorkspaceWithForms = Workspace & { forms: Form[] };
