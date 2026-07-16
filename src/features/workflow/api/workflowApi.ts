import { v4 as uuidv4 } from "uuid";
import type { Workflow } from "@/types";
import { DEFAULT_VIEWPORT, STORAGE_KEYS } from "@/constants";
import { getItem, setItem } from "@/lib/storage";

function getWorkflows(): Workflow[] {
  return getItem<Workflow[]>(STORAGE_KEYS.WORKFLOWS) ?? [];
}

function saveWorkflows(workflows: Workflow[]): void {
  setItem(STORAGE_KEYS.WORKFLOWS, workflows);
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const workflowApi = {
  async getAll(): Promise<Workflow[]> {
    await delay(300);
    return getWorkflows().sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  },

  async getById(id: string): Promise<Workflow | null> {
    await delay(200);
    return getWorkflows().find((w) => w.id === id) ?? null;
  },

  async create(name = "Untitled Workflow"): Promise<Workflow> {
    await delay(300);
    const now = new Date().toISOString();
    const workflow: Workflow = {
      id: uuidv4(),
      name,
      nodes: [],
      edges: [],
      viewport: { ...DEFAULT_VIEWPORT },
      createdAt: now,
      updatedAt: now,
    };
    const workflows = getWorkflows();
    saveWorkflows([workflow, ...workflows]);
    return workflow;
  },

  async update(id: string, data: Partial<Workflow>): Promise<Workflow> {
    await delay(200);
    const workflows = getWorkflows();
    const index = workflows.findIndex((w) => w.id === id);

    if (index === -1) {
      throw new Error("Workflow not found");
    }

    const updated: Workflow = {
      ...workflows[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    workflows[index] = updated;
    saveWorkflows(workflows);
    return updated;
  },

  async duplicate(id: string): Promise<Workflow> {
    await delay(300);
    const workflows = getWorkflows();
    const original = workflows.find((w) => w.id === id);

    if (!original) {
      throw new Error("Workflow not found");
    }

    const now = new Date().toISOString();
    const duplicated: Workflow = {
      ...structuredClone(original),
      id: uuidv4(),
      name: `${original.name} (Copy)`,
      createdAt: now,
      updatedAt: now,
    };

    saveWorkflows([duplicated, ...workflows]);
    return duplicated;
  },

  async delete(id: string): Promise<void> {
    await delay(200);
    const workflows = getWorkflows().filter((w) => w.id !== id);
    saveWorkflows(workflows);
  },
};
