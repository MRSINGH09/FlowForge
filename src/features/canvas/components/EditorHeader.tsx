"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ThemeToggle } from "@/components/theme-toggle";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { ROUTES } from "@/constants";
import { useCanvasStore } from "@/store/canvasStore";
import { useWorkflowStore } from "@/store/workflowStore";
import { workflowApi } from "@/features/workflow/api/workflowApi";

export function EditorHeader() {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const workflowId = useCanvasStore((s) => s.workflowId);
  const workflowName = useCanvasStore((s) => s.workflowName);
  const isDirty = useCanvasStore((s) => s.isDirty);
  const isSaving = useCanvasStore((s) => s.isSaving);
  const isActive = useCanvasStore((s) => s.isActive);
  const nodes = useCanvasStore((s) => s.nodes);
  const edges = useCanvasStore((s) => s.edges);
  const viewport = useCanvasStore((s) => s.viewport);
  const setWorkflowName = useCanvasStore((s) => s.setWorkflowName);
  const setIsActive = useCanvasStore((s) => s.setIsActive);
  const setIsSaving = useCanvasStore((s) => s.setIsSaving);
  const markClean = useCanvasStore((s) => s.markClean);
  const deleteWorkflow = useWorkflowStore((s) => s.deleteWorkflow);

  const handleSave = useCallback(async () => {
    if (!workflowId) return;

    setIsSaving(true);
    try {
      await workflowApi.updateCanvas(workflowId, {
        nodes,
        edges,
        viewport,
        isActive,
      });
      markClean();
      toast.success("Workflow saved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save canvas");
    } finally {
      setIsSaving(false);
    }
  }, [workflowId, nodes, edges, viewport, isActive, setIsSaving, markClean]);

  const handleDelete = async () => {
    if (!workflowId) return;

    setIsDeleting(true);
    try {
      await deleteWorkflow(workflowId);
      toast.success("Workflow deleted");
      router.replace(ROUTES.WORKFLOWS);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete workflow");
    } finally {
      setIsDeleting(false);
      setDeleteOpen(false);
    }
  };

  return (
    <>
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

        <div className="ml-auto flex items-center gap-3">
          <ThemeToggle />
          <div className="flex items-center gap-2 rounded-md border border-border px-3 py-1.5">
            <Label htmlFor="workflow-active" className="text-xs text-muted-foreground">
              {isActive ? "Active" : "Inactive"}
            </Label>
            <Switch
              id="workflow-active"
              checked={isActive}
              onCheckedChange={setIsActive}
              aria-label="Toggle workflow active"
            />
          </div>
          <Button
            variant="outline"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => setDeleteOpen(true)}
            disabled={!workflowId || isDeleting}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
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

      <ConfirmationDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete workflow"
        description={`Are you sure you want to delete "${workflowName}"? This action cannot be undone.`}
        confirmLabel={isDeleting ? "Deleting..." : "Delete"}
        variant="destructive"
        onConfirm={handleDelete}
      />
    </>
  );
}
