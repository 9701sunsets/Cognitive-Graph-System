"use client";
import { useCallback, useRef } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  addEdge,
  useEdgesState,
  useNodesState,
  Connection,
  Node,
  Edge,
  MarkerType,
  ReactFlowInstance,
  NodeChange,
  EdgeChange,
} from "reactflow";
import "reactflow/dist/style.css";

import CognitiveNode from "./CognitiveNode";
import CognitiveEdge from "./CognitiveEdge";
import { useGraphStore } from "@/lib/store";
import { GraphNode, GraphEdge } from "@/types";

const nodeTypes = { cognitive: CognitiveNode };
const edgeTypes = { cognitive: CognitiveEdge };

function toFlowNodes(nodes: GraphNode[]): Node[] {
  return nodes.map((n, i) => ({
    id: n.id,
    type: "cognitive",
    position: { x: n.x ?? (i % 4) * 220 + 60, y: n.y ?? Math.floor(i / 4) * 180 + 60 },
    data: { label: n.label, description: n.description, type: n.type },
  }));
}

function toFlowEdges(edges: GraphEdge[]): Edge[] {
  return edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    type: "cognitive",
    markerEnd: { type: MarkerType.ArrowClosed, color: "#243060", width: 16, height: 16 },
    data: { relation: e.relation },
  }));
}

export default function GraphCanvas() {
  const { nodes: storeNodes, edges: storeEdges, setNodes: setStoreNodes, setEdges: setStoreEdges, setSelectedNodeId } = useGraphStore();

  const [nodes, setNodes, onNodesChange] = useNodesState(toFlowNodes(storeNodes));
  const [edges, setEdges, onEdgesChange] = useEdgesState(toFlowEdges(storeEdges));
  const rfInstance = useRef<ReactFlowInstance | null>(null);

  // Sync store → flow nodes when store changes
  const prevStoreNodes = useRef(storeNodes);
  if (prevStoreNodes.current !== storeNodes) {
    prevStoreNodes.current = storeNodes;
    setNodes(toFlowNodes(storeNodes));
  }
  const prevStoreEdges = useRef(storeEdges);
  if (prevStoreEdges.current !== storeEdges) {
    prevStoreEdges.current = storeEdges;
    setEdges(toFlowEdges(storeEdges));
  }

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge: Edge = {
        ...params,
        id: `e-${Date.now()}`,
        type: "cognitive",
        markerEnd: { type: MarkerType.ArrowClosed, color: "#243060", width: 16, height: 16 },
        data: { relation: "相关" },
      } as Edge;
      setEdges((eds) => addEdge(newEdge, eds));
      setStoreEdges([
        ...storeEdges,
        { id: newEdge.id, source: params.source!, target: params.target!, relation: "相关" },
      ]);
    },
    [setEdges, setStoreEdges, storeEdges]
  );

  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      onNodesChange(changes);
      // Sync position updates back to store
      changes.forEach((change) => {
        if (change.type === "position" && change.position) {
          // position updated in flow, will sync on save
        }
        if (change.type === "remove") {
          useGraphStore.getState().removeNode(change.id);
        }
      });
    },
    [onNodesChange]
  );

  const handleEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      onEdgesChange(changes);
      changes.forEach((change) => {
        if (change.type === "remove") {
          useGraphStore.getState().removeEdge(change.id);
        }
      });
    },
    [onEdgesChange]
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      setSelectedNodeId(node.id);
    },
    [setSelectedNodeId]
  );

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, [setSelectedNodeId]);

  return (
    <div className="w-full h-full relative">
      {/* Grid background overlay */}
      <div className="absolute inset-0 grid-bg pointer-events-none z-0 opacity-60" />

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onInit={(instance) => (rfInstance.current = instance)}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        deleteKeyCode="Delete"
        multiSelectionKeyCode="Shift"
        style={{ background: "transparent" }}
        defaultEdgeOptions={{
          type: "cognitive",
          markerEnd: { type: MarkerType.ArrowClosed, color: "#243060", width: 16, height: 16 },
        }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={32}
          size={1}
          color="#1a234060"
        />
        <Controls
          style={{ bottom: 24, left: 24 }}
          showInteractive={false}
        />
        <MiniMap
          style={{ bottom: 24, right: 16 }}
          nodeStrokeWidth={3}
          zoomable
          pannable
        />
      </ReactFlow>

      {/* Empty state */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
          <div className="text-center opacity-30">
            <div className="text-6xl mb-4">🧠</div>
            <p className="text-sm font-mono text-slate-500">在左侧输入文本开始构建认知图谱</p>
          </div>
        </div>
      )}
    </div>
  );
}
