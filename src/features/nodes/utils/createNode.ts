import { v4 as uuidv4 } from "uuid";
import type { FlowNode, NodeType } from "@/types";
import { getDefaultConfig, getNodeDefinition } from "@/features/nodes/utils/nodeRegistry";

export function createFlowNode(
  type: NodeType,
  position: { x: number; y: number }
): FlowNode {
  const definition = getNodeDefinition(type);

  return {
    id: uuidv4(),
    type,
    position,
    data: {
      label: definition.label,
      type,
      config: getDefaultConfig(type),
    },
  };
}
