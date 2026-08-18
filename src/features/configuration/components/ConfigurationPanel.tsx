"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { selectSelectedNode, useCanvasStore } from "@/store/canvasStore";
import { getNodeDefinition } from "@/features/nodes/utils/nodeRegistry";
import { ManualTriggerConfigForm } from "@/features/configuration/components/ManualTriggerConfigForm";
import { WebhookTriggerConfigForm } from "@/features/configuration/components/WebhookTriggerConfigForm";
import { ScheduleTriggerConfigForm } from "@/features/configuration/components/ScheduleTriggerConfigForm";
import { HttpConfigForm } from "@/features/configuration/components/HttpConfigForm";
import { DelayConfigForm } from "@/features/configuration/components/DelayConfigForm";
import { NotificationConfigForm } from "@/features/configuration/components/NotificationConfigForm";
import { IfConditionConfigForm } from "@/features/configuration/components/IfConditionConfigForm";
import type { FlowNode, NodeType } from "@/types";
import { cn } from "@/lib/utils";

type ConfigFormComponent = React.ComponentType<{ node: FlowNode }>;

const configForms: Record<NodeType, ConfigFormComponent> = {
  manualTrigger: ManualTriggerConfigForm,
  webhookTrigger: WebhookTriggerConfigForm,
  scheduleTrigger: ScheduleTriggerConfigForm,
  http: HttpConfigForm,
  delay: DelayConfigForm,
  notification: NotificationConfigForm,
  ifCondition: IfConditionConfigForm,
};

function PanelShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <aside
      className={cn(
        "flex w-80 shrink-0 flex-col border-l border-border bg-card",
        className
      )}
    >
      {children}
    </aside>
  );
}

export function ConfigurationPanel() {
  const selectedNode = useCanvasStore(selectSelectedNode);
  const setSelectedNodeId = useCanvasStore((s) => s.setSelectedNodeId);
  const deleteSelectedNode = useCanvasStore((s) => s.deleteSelectedNode);

  if (!selectedNode) {
    return (
      <PanelShell className="hidden lg:flex">
        <div className="flex flex-1 items-center justify-center p-6 text-center">
          <div>
            <p className="text-sm font-medium">No node selected</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Select a node on the canvas to configure it
            </p>
          </div>
        </div>
      </PanelShell>
    );
  }

  const definition = getNodeDefinition(selectedNode.data.type);
  const ConfigComponent = configForms[selectedNode.data.type];

  if (!definition || !ConfigComponent) {
    return (
      <PanelShell className="hidden lg:flex">
        <div className="flex flex-1 items-center justify-center p-6 text-center">
          <div>
            <p className="text-sm font-medium">Unsupported node</p>
            <p className="mt-1 text-xs text-muted-foreground">
              This node type cannot be configured
            </p>
          </div>
        </div>
      </PanelShell>
    );
  }

  const categoryVariant =
    definition.category === "trigger"
      ? "trigger"
      : definition.category === "logic"
        ? "logic"
        : "action";

  return (
    <PanelShell>
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <Badge variant={categoryVariant}>{definition.category}</Badge>
          <h3 className="truncate text-sm font-semibold">{selectedNode.data.label}</h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 shrink-0"
          onClick={() => setSelectedNodeId(null)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <ConfigComponent node={selectedNode} />
        <div className="mt-6 border-t border-border pt-4">
          <Button variant="destructive" size="sm" onClick={deleteSelectedNode}>
            Delete Node
          </Button>
        </div>
      </div>
    </PanelShell>
  );
}
