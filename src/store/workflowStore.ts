import { create } from "zustand";
import type { Workflow } from "@/types";
import { workflowApi } from "@/features/workflow/api/workflowApi";

interface WorkflowState {
  workflows: Workflow[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  fetchWorkflows: () => Promise<void>;
  createWorkflow: (name: string, description?: string) => Promise<Workflow>;
  renameWorkflow: (id: string, name: string) => Promise<void>;
  duplicateWorkflow: (id: string) => Promise<Workflow>;
  deleteWorkflow: (id: string) => Promise<void>;
  getWorkflow: (id: string) => Workflow | undefined;
  setSearchQuery: (query: string) => void;
  clearError: () => void;
}

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  workflows: [],
  isLoading: false,
  error: null,
  searchQuery: "",

  fetchWorkflows: async () => {
    set({ isLoading: true, error: null });
    try {
      const workflows = await workflowApi.getAll();
      set({ workflows, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to load workflows",
        isLoading: false,
      });
    }
  },

  createWorkflow: async (name, description = "") => {
    const workflow = await workflowApi.create(name, description);
    set((state) => ({ workflows: [workflow, ...state.workflows] }));
    return workflow;
  },

  renameWorkflow: async (id, name) => {
    // Name update API is not available yet — keep local list label only.
    set((state) => ({
      workflows: state.workflows.map((workflow) =>
        workflow.id === id
          ? { ...workflow, name, updatedAt: new Date().toISOString() }
          : workflow
      ),
    }));
  },

  duplicateWorkflow: async (id) => {
    return workflowApi.duplicate(id);
  },

  deleteWorkflow: async (id) => {
    await workflowApi.delete(id);
    set((state) => ({
      workflows: state.workflows.filter((workflow) => workflow.id !== id),
    }));
  },

  getWorkflow: (id) => get().workflows.find((workflow) => workflow.id === id),

  setSearchQuery: (query) => set({ searchQuery: query }),
  clearError: () => set({ error: null }),
}));

export const selectFilteredWorkflows = (state: WorkflowState): Workflow[] => {
  const query = state.searchQuery.toLowerCase().trim();
  if (!query) return state.workflows;

  return state.workflows.filter((workflow) => {
    const name = (workflow.name ?? "").toLowerCase();
    const description = (workflow.description ?? "").toLowerCase();
    return name.includes(query) || description.includes(query);
  });
};
