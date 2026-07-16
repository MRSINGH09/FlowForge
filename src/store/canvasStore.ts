import { create } from "zustand";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Connection,
  type EdgeChange,
  type NodeChange,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
} from "@xyflow/react";
import type { FlowEdge, FlowNode, ViewportState } from "@/types";
import { DEFAULT_VIEWPORT } from "@/constants";
import { isValidConnection } from "@/features/canvas/utils/connectionRules";
import { useHistoryStore } from "@/store/historyStore";

interface CanvasState {
  nodes: FlowNode[];
  edges: FlowEdge[];
  viewport: ViewportState;
  selectedNodeId: string | null;
  isDirty: boolean;
  workflowId: string | null;
  workflowName: string;
  isSaving: boolean;

  initCanvas: (workflowId: string, name: string, nodes: FlowNode[], edges: FlowEdge[], viewport: ViewportState) => void;
  resetCanvas: () => void;
  onNodesChange: OnNodesChange<FlowNode>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setNodes: (nodes: FlowNode[]) => void;
  setEdges: (edges: FlowEdge[]) => void;
  addNode: (node: FlowNode) => void;
  updateNodeConfig: (nodeId: string, config: FlowNode["data"]["config"]) => void;
  deleteSelectedNode: () => void;
  setSelectedNodeId: (id: string | null) => void;
  setViewport: (viewport: ViewportState) => void;
  setWorkflowName: (name: string) => void;
  setIsSaving: (saving: boolean) => void;
  markClean: () => void;
  markDirty: () => void;
}

const pushHistory = () => {
  const { nodes, edges } = useCanvasStore.getState();
  useHistoryStore.getState().push({ nodes, edges });
};

export const useCanvasStore = create<CanvasState>((set, get) => ({
  nodes: [],
  edges: [],
  viewport: { ...DEFAULT_VIEWPORT },
  selectedNodeId: null,
  isDirty: false,
  workflowId: null,
  workflowName: "Untitled Workflow",
  isSaving: false,

  initCanvas: (workflowId, name, nodes, edges, viewport) => {
    set({
      workflowId,
      workflowName: name,
      nodes,
      edges,
      viewport,
      selectedNodeId: null,
      isDirty: false,
    });
    useHistoryStore.getState().clear();
    useHistoryStore.getState().push({ nodes, edges });
  },

  resetCanvas: () =>
    set({
      nodes: [],
      edges: [],
      viewport: { ...DEFAULT_VIEWPORT },
      selectedNodeId: null,
      isDirty: false,
      workflowId: null,
      workflowName: "Untitled Workflow",
      isSaving: false,
    }),

  onNodesChange: (changes: NodeChange<FlowNode>[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
      isDirty: true,
    });
    const hasPositionChange = changes.some((c) => c.type === "position" && !c.dragging);
    const hasRemove = changes.some((c) => c.type === "remove");
    if (hasPositionChange || hasRemove) pushHistory();
  },

  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
      isDirty: true,
    });
    if (changes.some((c) => c.type === "remove")) pushHistory();
  },

  onConnect: (connection: Connection) => {
    const { nodes, edges } = get();
    if (!isValidConnection(connection, nodes, edges)) return;

    set({
      edges: addEdge(
        { ...connection, animated: true, style: { strokeWidth: 2 } },
        edges
      ),
      isDirty: true,
    });
    pushHistory();
  },

  setNodes: (nodes) => set({ nodes, isDirty: true }),
  setEdges: (edges) => set({ edges, isDirty: true }),

  addNode: (node) => {
    set((state) => ({ nodes: [...state.nodes, node], isDirty: true }));
    pushHistory();
  },

  updateNodeConfig: (nodeId, config) => {
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, config } }
          : node
      ),
      isDirty: true,
    }));
  },

  deleteSelectedNode: () => {
    const { selectedNodeId, nodes, edges } = get();
    if (!selectedNodeId) return;

    set({
      nodes: nodes.filter((n) => n.id !== selectedNodeId),
      edges: edges.filter(
        (e) => e.source !== selectedNodeId && e.target !== selectedNodeId
      ),
      selectedNodeId: null,
      isDirty: true,
    });
    pushHistory();
  },

  setSelectedNodeId: (id) => set({ selectedNodeId: id }),
  setViewport: (viewport) => set({ viewport, isDirty: true }),
  setWorkflowName: (name) => set({ workflowName: name, isDirty: true }),
  setIsSaving: (saving) => set({ isSaving: saving }),
  markClean: () => set({ isDirty: false }),
  markDirty: () => set({ isDirty: true }),
}));

export const selectSelectedNode = (state: CanvasState): FlowNode | null =>
  state.nodes.find((n) => n.id === state.selectedNodeId) ?? null;
