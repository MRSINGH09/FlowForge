import { create } from "zustand";
import type { Workflow } from "@/types";
import { workflowApi } from "@/features/workflow/api/workflowApi";

interface WorkflowState {
  workflows: Workflow[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  fetchWorkflows: () => Promise<void>;
  createWorkflow: (name?: string) => Promise<Workflow>;
  updateWorkflow: (id: string, data: Partial<Workflow>) => Promise<void>;
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

  createWorkflow: async (name) => {
    const workflow = await workflowApi.create(name);
    set((state) => ({ workflows: [workflow, ...state.workflows] }));
    return workflow;
  },

  updateWorkflow: async (id, data) => {
    const updated = await workflowApi.update(id, data);
    set((state) => ({
      workflows: state.workflows.map((w) => (w.id === id ? updated : w)),
    }));
  },

  renameWorkflow: async (id, name) => {
    await get().updateWorkflow(id, { name });
  },

  duplicateWorkflow: async (id) => {
    const duplicated = await workflowApi.duplicate(id);
    set((state) => ({ workflows: [duplicated, ...state.workflows] }));
    return duplicated;
  },

  deleteWorkflow: async (id) => {
    await workflowApi.delete(id);
    set((state) => ({
      workflows: state.workflows.filter((w) => w.id !== id),
    }));
  },

  getWorkflow: (id) => get().workflows.find((w) => w.id === id),

  setSearchQuery: (query) => set({ searchQuery: query }),
  clearError: () => set({ error: null }),
}));

export const selectFilteredWorkflows = (state: WorkflowState): Workflow[] => {
  const query = state.searchQuery.toLowerCase().trim();
  if (!query) return state.workflows;
  return state.workflows.filter((w) => w.name.toLowerCase().includes(query));
};
