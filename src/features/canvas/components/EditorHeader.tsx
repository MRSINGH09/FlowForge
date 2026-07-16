"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";
import { ROUTES } from "@/constants";
import { useCanvasStore } from "@/store/canvasStore";
import { useWorkflowStore } from "@/store/workflowStore";

export function EditorHeader() {
  const router = useRouter();
  const workflowId = useCanvasStore((s) => s.workflowId);
  const workflowName = useCanvasStore((s) => s.workflowName);
  const isDirty = useCanvasStore((s) => s.isDirty);
  const isSaving = useCanvasStore((s) => s.isSaving);
  const nodes = useCanvasStore((s) => s.nodes);
  const edges = useCanvasStore((s) => s.edges);
  const viewport = useCanvasStore((s) => s.viewport);
  const setWorkflowName = useCanvasStore((s) => s.setWorkflowName);
  const setIsSaving = useCanvasStore((s) => s.setIsSaving);
  const markClean = useCanvasStore((s) => s.markClean);
  const updateWorkflow = useWorkflowStore((s) => s.updateWorkflow);

  const handleSave = useCallback(async () => {
    if (!workflowId) return;

    setIsSaving(true);
    try {
      await updateWorkflow(workflowId, {
        name: workflowName,
        nodes,
        edges,
        viewport,
      });
      markClean();
    } finally {
      setIsSaving(false);
    }
  }, [
    workflowId,
    workflowName,
    nodes,
    edges,
    viewport,
    updateWorkflow,
    setIsSaving,
    markClean,
  ]);

  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-border bg-card px-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => router.push(ROUTES.WORKFLOWS)}
        aria-label="Back to workflows"
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>

      <Input
        value={workflowName}
        onChange={(e) => setWorkflowName(e.target.value)}
        className="max-w-xs border-none bg-transparent text-base font-semibold shadow-none focus-visible:ring-0"
      />

      {isDirty && (
        <span className="text-xs text-muted-foreground">Unsaved changes</span>
      )}

      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />
        <Button onClick={handleSave} disabled={isSaving || !isDirty}>
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save
        </Button>
      </div>
    </header>
  );
}
