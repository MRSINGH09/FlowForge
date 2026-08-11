"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Copy,
  MoreHorizontal,
  Pencil,
  Trash2,
  Workflow as WorkflowIcon,
  Clock,
} from "lucide-react";
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
import { ROUTES } from "@/constants";
import { formatDate } from "@/lib/utils";
import type { Workflow } from "@/types";

interface WorkflowCardProps {
  workflow: Workflow;
  onRename: (id: string, name: string) => Promise<void>;
  onDuplicate: (id: string) => Promise<Workflow>;
  onDelete: (id: string) => Promise<void>;
}

export function WorkflowCard({ workflow, onRename, onDuplicate, onDelete }: WorkflowCardProps) {
  const router = useRouter();
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [newName, setNewName] = useState(workflow.name);
  const [isLoading, setIsLoading] = useState(false);

  const handleRename = async () => {
    if (!newName.trim()) return;
    setIsLoading(true);
    try {
      await onRename(workflow.id, newName.trim());
      setRenameOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDuplicate = async () => {
    setIsLoading(true);
    try {
      const duplicated = await onDuplicate(workflow.id);
      router.push(ROUTES.WORKFLOW_EDITOR(duplicated.id));
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Failed to duplicate workflow");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await onDelete(workflow.id);
      setDeleteOpen(false);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Failed to delete workflow");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card className="group transition-shadow hover:shadow-md">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <div
            className="flex cursor-pointer items-center gap-3"
            onClick={() => router.push(ROUTES.WORKFLOW_EDITOR(workflow.id))}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <WorkflowIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">{workflow.name}</CardTitle>
              <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {formatDate(workflow.updatedAt)}
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => { setNewName(workflow.name); setRenameOpen(true); }}>
                <Pencil className="mr-2 h-4 w-4" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDuplicate} disabled={isLoading}>
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
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

      <Modal open={renameOpen} onOpenChange={setRenameOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Rename Workflow</ModalTitle>
          </ModalHeader>
          <div className="space-y-2 py-4">
            <Label htmlFor="workflow-name">Name</Label>
            <Input
              id="workflow-name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRename()}
            />
          </div>
          <ModalFooter>
            <Button variant="outline" onClick={() => setRenameOpen(false)}>Cancel</Button>
            <Button onClick={handleRename} disabled={isLoading || !newName.trim()}>Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <ConfirmationDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete workflow"
        description={`Are you sure you want to delete "${workflow.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </>
  );
}
