"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Workflow as WorkflowIcon } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { SearchInput } from "@/components/search-input";
import { EmptyState } from "@/components/empty-state";
import { ErrorState } from "@/components/error-state";
import { PageLoading } from "@/components/loading-spinner";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "@/components/sidebar";
import { WorkflowCard } from "@/features/workflow/components/WorkflowCard";
import { selectFilteredWorkflows, useWorkflowStore } from "@/store/workflowStore";
import { selectUser, useAuthStore } from "@/store/authStore";
import { APP_NAME, ROUTES } from "@/constants";
import { LogOut } from "lucide-react";

export function WorkflowDashboard() {
  const router = useRouter();
  const user = useAuthStore(selectUser);
  const logout = useAuthStore((s) => s.logout);
  const workflows = useWorkflowStore(selectFilteredWorkflows);
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

  useEffect(() => {
    fetchWorkflows();
  }, [fetchWorkflows]);

  const handleCreate = async () => {
    const workflow = await createWorkflow();
    router.push(ROUTES.WORKFLOW_EDITOR(workflow.id));
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <WorkflowIcon className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold">{APP_NAME}</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <nav className="space-y-1">
            <Button variant="secondary" className="w-full justify-start">
              <WorkflowIcon className="mr-2 h-4 w-4" />
              Workflows
            </Button>
          </nav>
        </SidebarContent>
        <SidebarFooter>
          <div className="mb-3 truncate text-sm text-muted-foreground">
            {user?.name}
          </div>
          <Button variant="outline" className="w-full" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
        </SidebarFooter>
      </Sidebar>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center justify-end border-b border-border px-6">
          <ThemeToggle />
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <PageHeader
            title="Workflows"
            description="Create and manage your automation workflows"
            actions={
              <Button onClick={handleCreate}>
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
          ) : workflows.length === 0 ? (
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
                  <Button onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Workflow
                  </Button>
                )
              }
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {workflows.map((workflow) => (
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
        </main>
      </div>
    </div>
  );
}
