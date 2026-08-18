"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Pencil, Trash2, Workflow as WorkflowIcon, Clock } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { Modal, ModalContent, ModalFooter, ModalHeader, ModalTitle } from "@/components/modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ROUTES } from "@/constants";
import { formatDate } from "@/lib/utils";
import type { Workflow } from "@/types";

interface WorkflowCardProps {
  workflow: Workflow;
  onUpdateDetails: (
    id: string,
    details: { name: string; description: string }
  ) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function WorkflowCard({ workflow, onUpdateDetails, onDelete }: WorkflowCardProps) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [name, setName] = useState(workflow.name);
  const [description, setDescription] = useState(workflow.description ?? "");
  const [isLoading, setIsLoading] = useState(false);

  const handleEditOpen = () => {
    setName(workflow.name);
    setDescription(workflow.description ?? "");
    setEditOpen(true);
  };

  const handleSaveDetails = async () => {
    const trimmedName = name.trim();
    if (trimmedName.length < 3) return;

    setIsLoading(true);
    try {
      await onUpdateDetails(workflow.id, {
        name: trimmedName,
        description: description.trim() || " ",
      });
      setEditOpen(false);
      toast.success("Workflow details updated");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update workflow details"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await onDelete(workflow.id);
      setDeleteOpen(false);
      toast.success("Workflow deleted");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete workflow");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card className="group transition-shadow hover:shadow-md">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <div
            className="flex min-w-0 flex-1 cursor-pointer items-center gap-3"
            onClick={() => router.push(ROUTES.WORKFLOW_EDITOR(workflow.id))}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <WorkflowIcon className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <CardTitle className="truncate text-base">{workflow.name}</CardTitle>
              <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {formatDate(workflow.updatedAt)}
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleEditOpen}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          <div
            className="cursor-pointer text-sm text-muted-foreground"
            onClick={() => router.push(ROUTES.WORKFLOW_EDITOR(workflow.id))}
          >
            {workflow.description ? (
              <p className="line-clamp-2">{workflow.description}</p>
            ) : (
              <p>Open to edit canvas</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Modal open={editOpen} onOpenChange={setEditOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Edit workflow</ModalTitle>
          </ModalHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="workflow-name">Name</Label>
              <Input
                id="workflow-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    void handleSaveDetails();
                  }
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="workflow-description">Description</Label>
              <Textarea
                id="workflow-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What does this workflow do?"
                rows={3}
              />
            </div>
          </div>
          <ModalFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveDetails}
              disabled={isLoading || name.trim().length < 3}
            >
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <ConfirmationDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete workflow"
        description={`Are you sure you want to delete "${workflow.name}"? This action cannot be undone.`}
        confirmLabel={isLoading ? "Deleting..." : "Delete"}
        variant="destructive"
        onConfirm={handleDelete}
      />
    </>
  );
}
