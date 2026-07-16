"use client";

import { useCallback } from "react";
import { useReactFlow } from "@xyflow/react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { NODE_CATEGORIES } from "@/constants";
import { getNodesByCategory } from "@/features/nodes/utils/nodeRegistry";
import { createFlowNode } from "@/features/nodes/utils/createNode";
import { useCanvasStore } from "@/store/canvasStore";
import type { NodeDefinition, NodeType } from "@/types";

const iconMap: Record<string, LucideIcon> = {
  Play,
  Webhook,
  Clock,
  Globe,
  Timer,
  Bell,
  GitBranch,
};

const categoryLabels = {
  [NODE_CATEGORIES.TRIGGER]: "Triggers",
  [NODE_CATEGORIES.ACTION]: "Actions",
  [NODE_CATEGORIES.LOGIC]: "Logic",
} as const;

const categoryBadgeVariant = {
  [NODE_CATEGORIES.TRIGGER]: "trigger",
  [NODE_CATEGORIES.ACTION]: "action",
  [NODE_CATEGORIES.LOGIC]: "logic",
} as const;

function NodePaletteItem({ definition }: { definition: NodeDefinition }) {
  const Icon = iconMap[definition.icon] ?? Play;

  const onDragStart = useCallback(
    (event: React.DragEvent) => {
      event.dataTransfer.setData("application/reactflow", definition.type);
      event.dataTransfer.effectAllowed = "move";
    },
    [definition.type]
  );

  return (
    <div
      draggable
      onDragStart={onDragStart}
      className={cn(
        "flex cursor-grab items-center gap-3 rounded-lg border border-border bg-background p-3",
        "transition-colors hover:border-primary/50 hover:bg-accent/50 active:cursor-grabbing"
      )}
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium">{definition.label}</p>
        <p className="truncate text-xs text-muted-foreground">{definition.description}</p>
      </div>
    </div>
  );
}

export function NodeSidebar() {
  const categories = [
    NODE_CATEGORIES.TRIGGER,
    NODE_CATEGORIES.ACTION,
    NODE_CATEGORIES.LOGIC,
  ] as const;

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-border bg-card">
      <div className="border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold">Nodes</h2>
        <p className="text-xs text-muted-foreground">Drag nodes onto the canvas</p>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-6 p-4">
          {categories.map((category) => (
            <div key={category}>
              <div className="mb-3 flex items-center gap-2">
                <Badge variant={categoryBadgeVariant[category]} className="text-[10px]">
                  {categoryLabels[category]}
                </Badge>
              </div>
              <div className="space-y-2">
                {getNodesByCategory(category).map((def) => (
                  <NodePaletteItem key={def.type} definition={def} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </aside>
  );
}

export function useCanvasDrop() {
  const addNode = useCanvasStore((s) => s.addNode);
  const { screenToFlowPosition } = useReactFlow();

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData("application/reactflow") as NodeType;
      if (!type) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const node = createFlowNode(type, position);
      addNode(node);
    },
    [addNode, screenToFlowPosition]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  return { onDrop, onDragOver };
}
