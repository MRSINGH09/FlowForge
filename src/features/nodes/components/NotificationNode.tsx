"use client";

import { memo } from "react";
import type { NodeProps } from "@xyflow/react";
import { BaseNode, NodeHandles } from "@/features/nodes/components/BaseNode";
import type { FlowNode, NotificationConfig } from "@/types";

export const NotificationNode = memo(function NotificationNode(
  props: NodeProps<FlowNode>
) {
  const config = props.data.config as NotificationConfig;
  const subtitle =
    config.channel === "email"
      ? `email: ${config.to || config.subject || "unset"}`
      : config.channel === "slack"
        ? `slack: ${config.slackChannel || config.title || "unset"}`
        : `webhook: ${config.method ?? "POST"}`;

  return (
    <>
      <BaseNode {...props} icon="Bell" subtitle={subtitle} />
      <NodeHandles />
    </>
  );
});
