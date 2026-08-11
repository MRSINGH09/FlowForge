import axios from "axios";
import { api } from "@/services/api";
import { DEFAULT_VIEWPORT } from "@/constants";
import { getDefaultConfig, getNodeDefinition } from "@/features/nodes/utils/nodeRegistry";
import type { FlowEdge, FlowNode, NodeType, ViewportState, Workflow } from "@/types";

export interface CanvasJson {
  nodes: FlowNode[];
  edges: FlowEdge[];
  viewport: ViewportState;
}

interface BackendWorkflow {
  id: string | number;
  name: string;
  description?: string | null;
  canvas_json?: CanvasJson | string | null;
  created_at?: string;
  updated_at?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ListWorkflowsResponse {
  success: boolean;
  data: BackendWorkflow[];
  message?: string;
}

interface CreateWorkflowResponse {
  success: boolean;
  message?: string;
  data: BackendWorkflow;
}

interface GetCanvasResponse {
  success: boolean;
  data?: BackendWorkflow;
  message?: string;
}

interface UpdateCanvasResponse {
  success: boolean;
  message?: string;
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | {
          error?: string | { issues?: Array<{ message?: string }> };
          message?: string;
        }
      | undefined;

    if (typeof data?.error === "string") {
      return data.error;
    }

    const firstIssue =
      data?.error && typeof data.error === "object"
        ? data.error.issues?.[0]?.message
        : undefined;
    if (firstIssue) {
      return firstIssue;
    }

    if (typeof data?.message === "string") {
      return data.message;
    }

    return error.message || fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

function isNodeType(value: unknown): value is NodeType {
  return (
    typeof value === "string" &&
    [
      "manualTrigger",
      "webhookTrigger",
      "scheduleTrigger",
      "http",
      "delay",
      "notification",
      "ifCondition",
    ].includes(value)
  );
}

function normalizeFlowNode(raw: FlowNode): FlowNode {
  const typeCandidate = raw.data?.type ?? raw.type;
  const type: NodeType = isNodeType(typeCandidate) ? typeCandidate : "manualTrigger";
  const definition = getNodeDefinition(type);
  const defaults = getDefaultConfig(type);
  const existingConfig =
    raw.data?.config && typeof raw.data.config === "object" ? raw.data.config : {};

  return {
    ...raw,
    id: String(raw.id),
    type,
    position: {
      x: Number(raw.position?.x ?? 0),
      y: Number(raw.position?.y ?? 0),
    },
    data: {
      label: String(raw.data?.label ?? definition.label),
      type,
      config: { ...defaults, ...existingConfig },
    },
  };
}

function parseCanvasJson(raw: BackendWorkflow["canvas_json"]): CanvasJson {
  let parsed: unknown = raw;

  if (typeof raw === "string") {
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = null;
    }
  }

  const canvas = (parsed ?? {}) as Partial<CanvasJson>;

  return {
    nodes: Array.isArray(canvas.nodes)
      ? canvas.nodes.map((node) => normalizeFlowNode(node as FlowNode))
      : [],
    edges: Array.isArray(canvas.edges) ? (canvas.edges as FlowEdge[]) : [],
    viewport: {
      x: canvas.viewport?.x ?? DEFAULT_VIEWPORT.x,
      y: canvas.viewport?.y ?? DEFAULT_VIEWPORT.y,
      zoom: canvas.viewport?.zoom ?? DEFAULT_VIEWPORT.zoom,
    },
  };
}

function toCanvasJson(
  nodes: FlowNode[],
  edges: FlowEdge[],
  viewport: ViewportState
): CanvasJson {
  return {
    nodes,
    edges,
    viewport: {
      x: viewport.x,
      y: viewport.y,
      zoom: viewport.zoom,
    },
  };
}

function getSchedulePayload(nodes: FlowNode[]): {
  isScheduled: boolean;
  cronExpression: string | null;
} {
  const scheduleNode = nodes.find(
    (node) =>
      node.type === "scheduleTrigger" || node.data?.type === "scheduleTrigger"
  );

  if (!scheduleNode) {
    return { isScheduled: false, cronExpression: null };
  }

  const config = scheduleNode.data?.config as { cron?: string } | undefined;
  const cronExpression = config?.cron?.trim() || null;

  return {
    isScheduled: true,
    cronExpression,
  };
}

function mapWorkflow(row: BackendWorkflow): Workflow {
  const createdAt = row.created_at ?? row.createdAt ?? new Date().toISOString();
  const updatedAt = row.updated_at ?? row.updatedAt ?? createdAt;
  const canvas = parseCanvasJson(row.canvas_json);

  return {
    id: String(row.id),
    name: String(row.name ?? "Untitled Workflow"),
    description: String(row.description ?? ""),
    nodes: canvas.nodes,
    edges: canvas.edges,
    viewport: canvas.viewport,
    createdAt: String(createdAt),
    updatedAt: String(updatedAt),
  };
}

export const workflowApi = {
  async getAll(): Promise<Workflow[]> {
    try {
      const { data } = await api.get<ListWorkflowsResponse>("/api/v1/workflow/");
      const rows = Array.isArray(data.data) ? data.data : [];
      return rows
        .map(mapWorkflow)
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
    } catch (error) {
      throw new Error(getErrorMessage(error, "Failed to load workflows"));
    }
  },

  async getCanvas(canvasId: string): Promise<Workflow> {
    try {
      const { data } = await api.get<GetCanvasResponse>("/api/v1/workflow/canvas", {
        params: { canvasId },
      });

      if (!data?.success || !data.data) {
        throw new Error(data?.message ?? "Canvas not found");
      }

      return mapWorkflow(data.data);
    } catch (error) {
      throw new Error(getErrorMessage(error, "Failed to load canvas"));
    }
  },

  async getById(id: string): Promise<Workflow | null> {
    try {
      return await this.getCanvas(id);
    } catch {
      return null;
    }
  },

  async create(name: string, description = ""): Promise<Workflow> {
    try {
      const { data } = await api.post<CreateWorkflowResponse>(
        "/api/v1/workflow/create",
        {
          name,
          description: description || undefined,
        }
      );

      if (!data?.data) {
        throw new Error(data?.message ?? "Failed to create workflow");
      }

      return mapWorkflow(data.data);
    } catch (error) {
      throw new Error(getErrorMessage(error, "Failed to create workflow"));
    }
  },

  async updateCanvas(
    canvasId: string,
    canvas: {
      nodes: FlowNode[];
      edges: FlowEdge[];
      viewport: ViewportState;
    }
  ): Promise<void> {
    try {
      const { isScheduled, cronExpression } = getSchedulePayload(canvas.nodes);

      const { data } = await api.patch<UpdateCanvasResponse>(
        "/api/v1/workflow/updateCanvas",
        {
          canvasId,
          canvasJson: toCanvasJson(canvas.nodes, canvas.edges, canvas.viewport),
          isScheduled,
          cronExpression,
        }
      );

      if (data && data.success === false) {
        throw new Error(data.message ?? "Failed to update canvas");
      }
    } catch (error) {
      throw new Error(getErrorMessage(error, "Failed to update canvas"));
    }
  },

  async execute(workflowId: string): Promise<unknown> {
    try {
      const { data } = await api.post<{
        success: boolean;
        message?: string;
        data?: unknown;
      }>(`/api/v1/workflow/${workflowId}/execute`);

      if (!data?.success) {
        throw new Error(data?.message ?? "Workflow execution failed");
      }

      return data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Failed to execute workflow"));
    }
  },

  async duplicate(id: string): Promise<Workflow> {
    void id;
    throw new Error("Duplicating workflows is not supported by the API yet");
  },

  async delete(id: string): Promise<void> {
    void id;
    throw new Error("Deleting workflows is not supported by the API yet");
  },
};
