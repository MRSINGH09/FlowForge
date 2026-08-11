"use client";

import { memo, useCallback, useMemo } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  Panel,
  type NodeTypes,
  type OnSelectionChangeParams,
  type Viewport,
  type Connection,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCanvasStore } from "@/store/canvasStore";
import { useHistoryStore } from "@/store/historyStore";
import { nodeRegistry } from "@/features/nodes/utils/nodeRegistryComponents";
import { isValidConnection } from "@/features/canvas/utils/connectionRules";
import type { FlowEdge } from "@/types";
import { Button } from "@/components/ui/button";
import { Redo2, Undo2 } from "lucide-react";

export const WorkflowCanvas = memo(function WorkflowCanvas() {
  const nodes = useCanvasStore((s) => s.nodes);
  const edges = useCanvasStore((s) => s.edges);
  const onNodesChange = useCanvasStore((s) => s.onNodesChange);
  const onEdgesChange = useCanvasStore((s) => s.onEdgesChange);
  const onConnect = useCanvasStore((s) => s.onConnect);
  const setSelectedNodeId = useCanvasStore((s) => s.setSelectedNodeId);
  const setViewport = useCanvasStore((s) => s.setViewport);
  const setNodes = useCanvasStore((s) => s.setNodes);
  const setEdges = useCanvasStore((s) => s.setEdges);
  const markDirty = useCanvasStore((s) => s.markDirty);

  const undo = useHistoryStore((s) => s.undo);
  const redo = useHistoryStore((s) => s.redo);
  const canUndo = useHistoryStore((s) => s.canUndo);
  const canRedo = useHistoryStore((s) => s.canRedo);

  const nodeTypes = useMemo(() => nodeRegistry as NodeTypes, []);

  const handleSelectionChange = useCallback(
    ({ nodes: selectedNodes }: OnSelectionChangeParams) => {
      setSelectedNodeId(selectedNodes[0]?.id ?? null);
    },
    [setSelectedNodeId]
  );

  const handleMoveEnd = useCallback(
    (_: unknown, viewport: Viewport) => {
      setViewport(viewport);
    },
    [setViewport]
  );

  const handleUndo = useCallback(() => {
    const state = undo();
    if (state) {
      setNodes(state.nodes);
      setEdges(state.edges);
      markDirty();
    }
  }, [undo, setNodes, setEdges, markDirty]);

  const handleRedo = useCallback(() => {
    const state = redo();
    if (state) {
      setNodes(state.nodes);
      setEdges(state.edges);
      markDirty();
    }
  }, [redo, setNodes, setEdges, markDirty]);

  const isConnectionValid = useCallback(
    (connection: Connection | FlowEdge) =>
      isValidConnection(connection, nodes, edges),
    [nodes, edges]
  );

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onSelectionChange={handleSelectionChange}
        onMoveEnd={handleMoveEnd}
        nodeTypes={nodeTypes}
        isValidConnection={isConnectionValid}
        fitView
        deleteKeyCode={["Delete"]}
        multiSelectionKeyCode={["Meta", "Shift"]}
        selectionKeyCode={["Shift"]}
        className="bg-background"
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
        <Controls showInteractive={false} />
        <MiniMap
          nodeStrokeWidth={3}
          pannable
          zoomable
          className="!bottom-4 !right-4"
        />
        <Panel position="top-left" className="flex gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-card"
            onClick={handleUndo}
            disabled={!canUndo()}
            aria-label="Undo"
          >
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-card"
            onClick={handleRedo}
            disabled={!canRedo()}
            aria-label="Redo"
          >
            <Redo2 className="h-4 w-4" />
          </Button>
        </Panel>
      </ReactFlow>
    </div>
  );
});
