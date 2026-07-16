"use client";

import { memo } from "react";
import type { NodeProps } from "@xyflow/react";
import { BaseNode, NodeHandles } from "@/features/nodes/components/BaseNode";
import type { FlowNode, NotificationConfig } from "@/types";

export const NotificationNode = memo(function NotificationNode(
  props: NodeProps<FlowNode>
) {
  const config = props.data.config as NotificationConfig;
  return (
    <>
      <BaseNode
        {...props}
        icon="Bell"
        subtitle={`${config.channel}: ${config.title}`}
      />
      <NodeHandles />
    </>
  );
});
