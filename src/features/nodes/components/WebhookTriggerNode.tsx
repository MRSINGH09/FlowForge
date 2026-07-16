"use client";

import { memo } from "react";
import type { NodeProps } from "@xyflow/react";
import { BaseNode, NodeHandles } from "@/features/nodes/components/BaseNode";
import type { FlowNode, WebhookTriggerConfig } from "@/types";

export const WebhookTriggerNode = memo(function WebhookTriggerNode(
  props: NodeProps<FlowNode>
) {
  const config = props.data.config as WebhookTriggerConfig;
  return (
    <>
      <BaseNode
        {...props}
        icon="Webhook"
        subtitle={`${config.method} ${config.path}`}
      />
      <NodeHandles hasInput={false} />
    </>
  );
});
