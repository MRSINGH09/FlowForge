"use client";

import { memo } from "react";
import type { NodeProps } from "@xyflow/react";
import { BaseNode, NodeHandles } from "@/features/nodes/components/BaseNode";
import type { FlowNode, HttpConfig } from "@/types";

export const HttpNode = memo(function HttpNode(props: NodeProps<FlowNode>) {
  const config = props.data.config as HttpConfig;
  return (
    <>
      <BaseNode
        {...props}
        icon="Globe"
        subtitle={`${config.method} ${truncateUrl(config.url)}`}
      />
      <NodeHandles />
    </>
  );
});

function truncateUrl(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname;
  } catch {
    return url.slice(0, 24);
  }
}
