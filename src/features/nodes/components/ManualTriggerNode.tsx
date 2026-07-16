"use client";

import { memo } from "react";
import type { NodeProps } from "@xyflow/react";
import { BaseNode, NodeHandles } from "@/features/nodes/components/BaseNode";
import type { FlowNode, ManualTriggerConfig } from "@/types";

export const ManualTriggerNode = memo(function ManualTriggerNode(
  props: NodeProps<FlowNode>
) {
  const config = props.data.config as ManualTriggerConfig;
  return (
    <>
      <BaseNode
        {...props}
        icon="Play"
        subtitle={config.description || "Click to run"}
      />
      <NodeHandles hasInput={false} />
    </>
  );
});
