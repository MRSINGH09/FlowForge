"use client";

import { memo } from "react";
import type { NodeProps } from "@xyflow/react";
import { BaseNode, NodeHandles } from "@/features/nodes/components/BaseNode";
import type { FlowNode, ScheduleTriggerConfig } from "@/types";

export const ScheduleTriggerNode = memo(function ScheduleTriggerNode(
  props: NodeProps<FlowNode>
) {
  const config = props.data.config as ScheduleTriggerConfig;
  return (
    <>
      <BaseNode
        {...props}
        icon="Clock"
        subtitle={config.cron}
      />
      <NodeHandles hasInput={false} />
    </>
  );
});
