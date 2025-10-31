"use client";

import { useCallback } from "react";
import {
  ReactFlow,
  Node,
  Edge,
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { PhaseNode, AgentNode } from "./WorkflowNode";
import { WorkflowNodeData } from "./workflow-data";

const nodeTypes = {
  phaseNode: PhaseNode,
  agentNode: AgentNode,
};

interface WorkflowCanvasProps {
  initialNodes: Node<WorkflowNodeData>[];
  initialEdges: Edge[];
}

export function WorkflowCanvas({ initialNodes, initialEdges }: WorkflowCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className="w-full h-[600px] rounded-xl overflow-hidden border border-[rgb(var(--border))] bg-[rgb(var(--background-secondary))]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.1}
        maxZoom={1.5}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="rgba(var(--primary), 0.1)"
        />
        <Controls
          className="bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-lg shadow-lg"
          style={{
            button: {
              backgroundColor: "rgb(var(--card))",
              borderBottom: "1px solid rgb(var(--border))",
              color: "rgb(var(--foreground))",
            },
          }}
        />
        <MiniMap
          className="bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-lg shadow-lg"
          nodeColor={(node) => {
            const phaseColors = {
              1: "rgb(var(--phase1))",
              2: "rgb(var(--phase2))",
              3: "rgb(var(--phase3))",
              4: "rgb(var(--phase4))",
            };
            return phaseColors[node.data.phase as keyof typeof phaseColors] || "rgb(var(--primary))";
          }}
          maskColor="rgba(var(--background), 0.8)"
        />
      </ReactFlow>
    </div>
  );
}
