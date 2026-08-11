"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/modal";

interface CreateWorkflowModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (name: string, description: string) => Promise<void>;
}

export function CreateWorkflowModal({
  open,
  onOpenChange,
  onCreate,
}: CreateWorkflowModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setName("");
      setDescription("");
      setError(null);
      setIsSubmitting(false);
    }
  }, [open]);

  const handleCreate = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Name is required");
      return;
    }
    if (trimmedName.length < 3) {
      setError("Workflow name must be at least 3 characters.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await onCreate(trimmedName, description.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create workflow");
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (isSubmitting) return;
    onOpenChange(nextOpen);
  };

  return (
    <Modal open={open} onOpenChange={handleOpenChange}>
      <ModalContent
        onInteractOutside={(e) => {
          if (isSubmitting) e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          if (isSubmitting) e.preventDefault();
        }}
      >
        {isSubmitting ? (
          <div className="flex flex-col items-center justify-center gap-4 py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <div className="text-center">
              <ModalTitle className="text-base">Creating workflow...</ModalTitle>
              <ModalDescription className="mt-1">
                Setting up your workspace. You will be redirected shortly.
              </ModalDescription>
            </div>
          </div>
        ) : (
          <>
            <ModalHeader>
              <ModalTitle>New Workflow</ModalTitle>
              <ModalDescription>
                Give your workflow a name and optional description to get started.
              </ModalDescription>
            </ModalHeader>

            <div className="space-y-4 py-2">
              {error && (
                <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="new-workflow-name">Name</Label>
                <Input
                  id="new-workflow-name"
                  placeholder="e.g. Daily report sync"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      void handleCreate();
                    }
                  }}
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-workflow-description">Description</Label>
                <Textarea
                  id="new-workflow-description"
                  placeholder="What does this workflow do?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            <ModalFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={name.trim().length < 3}>
                Create
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
