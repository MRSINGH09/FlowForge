import { create } from "zustand";
import type { FlowEdge, FlowNode, HistoryEntry } from "@/types";

const MAX_HISTORY = 50;

interface HistoryState {
  past: HistoryEntry[];
  future: HistoryEntry[];
  push: (entry: Omit<HistoryEntry, "timestamp">) => void;
  undo: () => { nodes: FlowNode[]; edges: FlowEdge[] } | null;
  redo: () => { nodes: FlowNode[]; edges: FlowEdge[] } | null;
  clear: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  past: [],
  future: [],

  push: (entry) => {
    set((state) => ({
      past: [...state.past.slice(-MAX_HISTORY + 1), { ...entry, timestamp: Date.now() }],
      future: [],
    }));
  },

  undo: () => {
    const { past } = get();
    if (past.length <= 1) return null;

    const current = past[past.length - 1];
    const previous = past[past.length - 2];

    set({
      past: past.slice(0, -1),
      future: [current, ...get().future],
    });

    return { nodes: previous.nodes, edges: previous.edges };
  },

  redo: () => {
    const { future } = get();
    if (future.length === 0) return null;

    const next = future[0];

    set((state) => ({
      past: [...state.past, next],
      future: state.future.slice(1),
    }));

    return { nodes: next.nodes, edges: next.edges };
  },

  clear: () => set({ past: [], future: [] }),
  canUndo: () => get().past.length > 1,
  canRedo: () => get().future.length > 0,
}));
