"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Workflow as WorkflowIcon } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { SearchInput } from "@/components/search-input";
import { EmptyState } from "@/components/empty-state";
import { ErrorState } from "@/components/error-state";
import { PageLoading } from "@/components/loading-spinner";
import { Button } from "@/components/ui/button";
import { AppShell } from "@/features/layout/components/AppShell";
import { CreateWorkflowModal } from "@/features/workflow/components/CreateWorkflowModal";
import { WorkflowCard } from "@/features/workflow/components/WorkflowCard";
import { useWorkflowStore } from "@/store/workflowStore";
import { ROUTES } from "@/constants";

export function WorkflowDashboard() {
  const router = useRouter();
  const [createOpen, setCreateOpen] = useState(false);
  const workflows = useWorkflowStore((s) => s.workflows);
  const isLoading = useWorkflowStore((s) => s.isLoading);
  const error = useWorkflowStore((s) => s.error);
  const searchQuery = useWorkflowStore((s) => s.searchQuery);
  const setSearchQuery = useWorkflowStore((s) => s.setSearchQuery);
  const fetchWorkflows = useWorkflowStore((s) => s.fetchWorkflows);
  const createWorkflow = useWorkflowStore((s) => s.createWorkflow);
  const renameWorkflow = useWorkflowStore((s) => s.renameWorkflow);
  const duplicateWorkflow = useWorkflowStore((s) => s.duplicateWorkflow);
  const deleteWorkflow = useWorkflowStore((s) => s.deleteWorkflow);
  const clearError = useWorkflowStore((s) => s.clearError);

  const filteredWorkflows = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return workflows;

    return workflows.filter((workflow) => {
      const name = (workflow.name ?? "").toLowerCase();
      const description = (workflow.description ?? "").toLowerCase();
      return name.includes(query) || description.includes(query);
    });
  }, [workflows, searchQuery]);

  useEffect(() => {
    fetchWorkflows();
  }, [fetchWorkflows]);

  const handleCreate = async (name: string, description: string) => {
    const workflow = await createWorkflow(name, description);
    router.push(ROUTES.WORKFLOW_EDITOR(workflow.id));
  };

  return (
    <AppShell>
      <PageHeader
        title="Workflows"
        description="Create and manage your automation workflows"
        actions={
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Workflow
          </Button>
        }
        className="mb-6"
      />

      <SearchInput
        placeholder="Search workflows..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        containerClassName="mb-6 max-w-sm"
      />

      {isLoading ? (
        <PageLoading label="Loading workflows..." />
      ) : error ? (
        <ErrorState
          message={error}
          onRetry={() => {
            clearError();
            fetchWorkflows();
          }}
        />
      ) : filteredWorkflows.length === 0 ? (
        <EmptyState
          icon={WorkflowIcon}
          title={searchQuery ? "No workflows found" : "No workflows yet"}
          description={
            searchQuery
              ? "Try adjusting your search query"
              : "Create your first workflow to start automating tasks"
          }
          action={
            !searchQuery && (
              <Button onClick={() => setCreateOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Workflow
              </Button>
            )
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredWorkflows.map((workflow) => (
            <WorkflowCard
              key={workflow.id}
              workflow={workflow}
              onRename={renameWorkflow}
              onDuplicate={duplicateWorkflow}
              onDelete={deleteWorkflow}
            />
          ))}
        </div>
      )}

      <CreateWorkflowModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreate={handleCreate}
      />
    </AppShell>
  );
}
