"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PageLoading } from "@/components/loading-spinner";
import { ErrorState } from "@/components/error-state";
import { WorkflowCanvas } from "@/features/canvas/components/WorkflowCanvas";
import { NodeSidebar, useCanvasDrop } from "@/features/canvas/components/NodeSidebar";
import { EditorHeader } from "@/features/canvas/components/EditorHeader";
import { ConfigurationPanel } from "@/features/configuration/components/ConfigurationPanel";
import { useCanvasStore } from "@/store/canvasStore";
import { useWorkflowStore } from "@/store/workflowStore";
import { workflowApi } from "@/features/workflow/api/workflowApi";
import type { Workflow } from "@/types";

export function WorkflowEditor() {
  const params = useParams();
  const workflowId = params.workflowId as string;
  const initCanvas = useCanvasStore((s) => s.initCanvas);
  const resetCanvas = useCanvasStore((s) => s.resetCanvas);
  const fetchWorkflows = useWorkflowStore((s) => s.fetchWorkflows);
  const { onDrop, onDragOver } = useCanvasDrop();

  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setIsLoading(true);
      setError(null);

      try {
        await fetchWorkflows();
        const data = await workflowApi.getById(workflowId);

        if (!mounted) return;

        if (!data) {
          setError("Workflow not found");
          return;
        }

        setWorkflow(data);
        initCanvas(data.id, data.name, data.nodes, data.edges, data.viewport);
      } catch {
        if (mounted) {
          setError("Failed to load workflow");
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      mounted = false;
      resetCanvas();
    };
  }, [workflowId, initCanvas, resetCanvas, fetchWorkflows]);

  if (isLoading) {
    return <PageLoading label="Loading workflow..." />;
  }

  if (error || !workflow) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <ErrorState message={error ?? "Workflow not found"} />
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <EditorHeader />
      <div className="flex flex-1 overflow-hidden">
        <NodeSidebar />
        <div className="relative flex-1" onDrop={onDrop} onDragOver={onDragOver}>
          <WorkflowCanvas />
        </div>
        <ConfigurationPanel />
      </div>
    </div>
  );
}
