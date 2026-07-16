export type { Workflow } from "@/types";

export interface WorkflowCardAction {
  id: string;
  label: string;
  onClick: () => void;
  destructive?: boolean;
}
