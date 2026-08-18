"use client";

import { memo, useState } from "react";
import type { NodeProps } from "@xyflow/react";
import { Loader2, Play } from "lucide-react";
import { toast } from "sonner";
import { BaseNode, NodeHandles } from "@/features/nodes/components/BaseNode";
import { Button } from "@/components/ui/button";
import { useCanvasStore } from "@/store/canvasStore";
import { workflowApi } from "@/features/workflow/api/workflowApi";
import type { FlowNode, ManualTriggerConfig } from "@/types";

export const ManualTriggerNode = memo(function ManualTriggerNode(
  props: NodeProps<FlowNode>
) {
  const config = props.data.config as ManualTriggerConfig;
  const [isExecuting, setIsExecuting] = useState(false);

  const workflowId = useCanvasStore((s) => s.workflowId);
  const isDirty = useCanvasStore((s) => s.isDirty);
  const isActive = useCanvasStore((s) => s.isActive);
  const nodes = useCanvasStore((s) => s.nodes);
  const edges = useCanvasStore((s) => s.edges);
  const viewport = useCanvasStore((s) => s.viewport);
  const markClean = useCanvasStore((s) => s.markClean);

  const handleExecute = async (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!workflowId || isExecuting) return;

    setIsExecuting(true);
    try {
      if (isDirty) {
        await workflowApi.updateCanvas(workflowId, {
          nodes,
          edges,
          viewport,
          isActive,
        });
        markClean();
      }

      await workflowApi.execute(workflowId);
      toast.success("Workflow executed successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to execute workflow"
      );
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <>
      <BaseNode
        {...props}
        icon="Play"
        subtitle={config?.description || "Click Run to execute"}
      >
        <div className="border-t border-border px-3 py-2">
          <Button
            size="sm"
            className="nodrag nopan w-full"
            onClick={handleExecute}
            disabled={isExecuting || !workflowId}
          >
            {isExecuting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            {isExecuting ? "Running..." : "Run"}
          </Button>
        </div>
      </BaseNode>
      <NodeHandles hasInput={false} />
    </>
  );
});
