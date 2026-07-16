"use client";

import { memo } from "react";
import type { NodeProps } from "@xyflow/react";
import { BaseNode, NodeHandles } from "@/features/nodes/components/BaseNode";
import type { FlowNode, IfConditionConfig } from "@/types";

export const IfConditionNode = memo(function IfConditionNode(
  props: NodeProps<FlowNode>
) {
  const config = props.data.config as IfConditionConfig;
  const subtitle = config.field
    ? `${config.field} ${config.operator} ${config.value}`
    : "Configure condition";

  return (
    <>
      <BaseNode {...props} icon="GitBranch" subtitle={subtitle}>
        <div className="flex justify-end gap-6 border-t border-border/50 px-4 py-2 text-[10px] text-muted-foreground">
          <span>true</span>
          <span>false</span>
        </div>
      </BaseNode>
      <NodeHandles dualOutput />
    </>
  );
});
