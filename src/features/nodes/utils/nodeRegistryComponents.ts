import type { NodeProps } from "@xyflow/react";
import { ManualTriggerNode } from "@/features/nodes/components/ManualTriggerNode";
import { WebhookTriggerNode } from "@/features/nodes/components/WebhookTriggerNode";
import { ScheduleTriggerNode } from "@/features/nodes/components/ScheduleTriggerNode";
import { HttpNode } from "@/features/nodes/components/HttpNode";
import { DelayNode } from "@/features/nodes/components/DelayNode";
import { NotificationNode } from "@/features/nodes/components/NotificationNode";
import { IfConditionNode } from "@/features/nodes/components/IfConditionNode";
import type { FlowNode } from "@/types";

export const nodeRegistry = {
  manualTrigger: ManualTriggerNode,
  webhookTrigger: WebhookTriggerNode,
  scheduleTrigger: ScheduleTriggerNode,
  http: HttpNode,
  delay: DelayNode,
  notification: NotificationNode,
  ifCondition: IfConditionNode,
} as const;

export type RegisteredNodeType = keyof typeof nodeRegistry;

export type FlowNodeComponent = React.ComponentType<NodeProps<FlowNode>>;
