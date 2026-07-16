"use client";

import { memo } from "react";
import type { NodeProps } from "@xyflow/react";
import { BaseNode, NodeHandles } from "@/features/nodes/components/BaseNode";
import type { DelayConfig, FlowNode } from "@/types";

export const DelayNode = memo(function DelayNode(props: NodeProps<FlowNode>) {
  const config = props.data.config as DelayConfig;
  return (
    <>
      <BaseNode
        {...props}
        icon="Timer"
        subtitle={`Wait ${config.duration} ${config.unit}`}
      />
      <NodeHandles />
    </>
  );
});
