"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import {
  Bell,
  Clock,
  GitBranch,
  Globe,
  Play,
  Timer,
  Webhook,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { FlowNode, NodeCategory } from "@/types";

const iconMap: Record<string, LucideIcon> = {
  Play,
  Webhook,
  Clock,
  Globe,
  Timer,
  Bell,
  GitBranch,
};

const categoryStyles: Record<NodeCategory, string> = {
  trigger: "border-emerald-500/50 bg-emerald-500/5",
  action: "border-blue-500/50 bg-blue-500/5",
  logic: "border-amber-500/50 bg-amber-500/5",
};

const categoryIconStyles: Record<NodeCategory, string> = {
  trigger: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  action: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  logic: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
};

interface BaseNodeProps extends NodeProps<FlowNode> {
  icon: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export const BaseNode = memo(function BaseNode({
  data,
  selected,
  icon,
  subtitle,
  children,
}: BaseNodeProps) {
  const Icon = iconMap[icon] ?? Play;

  const resolvedCategory: NodeCategory =
    data.type === "manualTrigger" ||
    data.type === "webhookTrigger" ||
    data.type === "scheduleTrigger"
      ? "trigger"
      : data.type === "ifCondition"
        ? "logic"
        : "action";

  return (
    <div
      className={cn(
        "min-w-[200px] rounded-lg border-2 bg-card shadow-md transition-shadow",
        categoryStyles[resolvedCategory],
        selected && "ring-2 ring-primary ring-offset-2 ring-offset-background"
      )}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-md",
            categoryIconStyles[resolvedCategory]
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{data.label}</p>
          {subtitle && (
            <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>
      {children}
    </div>
  );
});

interface NodeHandlesProps {
  hasInput?: boolean;
  hasOutput?: boolean;
  dualOutput?: boolean;
}

export function NodeHandles({
  hasInput = true,
  hasOutput = true,
  dualOutput = false,
}: NodeHandlesProps) {
  return (
    <>
      {hasInput && (
        <Handle
          type="target"
          position={Position.Left}
          className="!-left-1.5"
        />
      )}
      {hasOutput && !dualOutput && (
        <Handle
          type="source"
          position={Position.Right}
          className="!-right-1.5"
        />
      )}
      {dualOutput && (
        <>
          <Handle
            type="source"
            position={Position.Right}
            id="true"
            className="!-right-1.5 !top-[35%]"
          />
          <Handle
            type="source"
            position={Position.Right}
            id="false"
            className="!-right-1.5 !top-[65%]"
          />
        </>
      )}
    </>
  );
}
