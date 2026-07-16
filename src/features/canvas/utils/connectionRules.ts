import type { Connection, Edge } from "@xyflow/react";
import type { FlowEdge, FlowNode } from "@/types";
import { getNodeDefinition } from "@/features/nodes/utils/nodeRegistry";

function toConnection(connection: Connection | Edge): Connection {
  return {
    source: connection.source,
    target: connection.target,
    sourceHandle: connection.sourceHandle ?? null,
    targetHandle: connection.targetHandle ?? null,
  };
}

export function isValidConnection(
  connection: Connection | Edge,
  nodes: FlowNode[],
  edges: FlowEdge[]
): boolean {
  const { source, target, sourceHandle, targetHandle } = toConnection(connection);

  if (!source || !target) return false;
  if (source === target) return false;

  const sourceNode = nodes.find((n) => n.id === source);
  const targetNode = nodes.find((n) => n.id === target);

  if (!sourceNode || !targetNode) return false;

  const sourceDef = getNodeDefinition(sourceNode.data.type);
  const targetDef = getNodeDefinition(targetNode.data.type);

  if (!sourceDef.hasOutput || !targetDef.hasInput) return false;

  // Prevent duplicate connections between same handles
  const duplicate = edges.some(
    (e) =>
      e.source === source &&
      e.target === target &&
      e.sourceHandle === sourceHandle &&
      e.targetHandle === targetHandle
  );
  if (duplicate) return false;

  // Prevent cycles (simple DFS)
  if (wouldCreateCycle(source, target, edges)) return false;

  // If condition: true/false handles
  if (sourceNode.data.type === "ifCondition") {
    if (sourceHandle !== "true" && sourceHandle !== "false") return false;
  }

  return true;
}

function wouldCreateCycle(source: string, target: string, edges: FlowEdge[]): boolean {
  const adjacency = new Map<string, string[]>();

  for (const edge of edges) {
    const list = adjacency.get(edge.source) ?? [];
    list.push(edge.target);
    adjacency.set(edge.source, list);
  }

  const visited = new Set<string>();

  function dfs(nodeId: string): boolean {
    if (nodeId === source) return true;
    if (visited.has(nodeId)) return false;
    visited.add(nodeId);

    const neighbors = adjacency.get(nodeId) ?? [];
    return neighbors.some(dfs);
  }

  return dfs(target);
}
