import { Node, Edge } from "@xyflow/react";

export interface WorkflowNodeData {
  label: string;
  description?: string;
  phase: number;
  agentCount?: number;
  status?: "active" | "completed" | "pending";
  [key: string]: unknown;
}

// MACRO VIEW: High-level 4 phases
export const macroNodes: Node<WorkflowNodeData>[] = [
  {
    id: "phase-1",
    type: "phaseNode",
    position: { x: 100, y: 200 },
    data: {
      label: "Fase 1: Clonagem",
      description: "Extração do DNA de marca e identidade",
      phase: 1,
      agentCount: 4,
      status: "completed",
    },
  },
  {
    id: "phase-2",
    type: "phaseNode",
    position: { x: 400, y: 200 },
    data: {
      label: "Fase 2: Inteligência",
      description: "Análise de mercado e comportamento",
      phase: 2,
      agentCount: 3,
      status: "active",
    },
  },
  {
    id: "phase-3",
    type: "phaseNode",
    position: { x: 700, y: 200 },
    data: {
      label: "Fase 3: Criação",
      description: "Geração de conteúdo e design",
      phase: 3,
      agentCount: 3,
      status: "pending",
    },
  },
  {
    id: "phase-4",
    type: "phaseNode",
    position: { x: 1000, y: 200 },
    data: {
      label: "Fase 4: Funil",
      description: "Estrutura de conversão e automação",
      phase: 4,
      agentCount: 3,
      status: "pending",
    },
  },
];

export const macroEdges: Edge[] = [
  {
    id: "e1-2",
    source: "phase-1",
    target: "phase-2",
    animated: true,
    style: { stroke: "rgb(var(--primary))", strokeWidth: 2 },
  },
  {
    id: "e2-3",
    source: "phase-2",
    target: "phase-3",
    animated: false,
    style: { stroke: "rgb(var(--border))", strokeWidth: 2 },
  },
  {
    id: "e3-4",
    source: "phase-3",
    target: "phase-4",
    animated: false,
    style: { stroke: "rgb(var(--border))", strokeWidth: 2 },
  },
];

// DETAILED VIEW: All 13 agents across 4 phases
export const detailedNodes: Node<WorkflowNodeData>[] = [
  // FASE 1: Clonagem de Identidade (4 agentes)
  {
    id: "dna-extractor",
    type: "agentNode",
    position: { x: 50, y: 50 },
    data: { label: "DNA Extractor", phase: 1, status: "completed" },
  },
  {
    id: "reverse-engineer",
    type: "agentNode",
    position: { x: 50, y: 150 },
    data: { label: "Reverse Engineer", phase: 1, status: "completed" },
  },
  {
    id: "clone-configurator",
    type: "agentNode",
    position: { x: 50, y: 250 },
    data: { label: "Clone Configurator", phase: 1, status: "completed" },
  },
  {
    id: "expert-emulator",
    type: "agentNode",
    position: { x: 50, y: 350 },
    data: { label: "Expert Emulator", phase: 1, status: "completed" },
  },

  // FASE 2: Inteligência de Mercado (3 agentes)
  {
    id: "behavioral-psychologist",
    type: "agentNode",
    position: { x: 350, y: 100 },
    data: { label: "Behavioral Psychologist", phase: 2, status: "active" },
  },
  {
    id: "capivara-intelligence",
    type: "agentNode",
    position: { x: 350, y: 200 },
    data: { label: "Capivara Intelligence", phase: 2, status: "pending" },
  },
  {
    id: "market-analyzer",
    type: "agentNode",
    position: { x: 350, y: 300 },
    data: { label: "Market Analyzer", phase: 2, status: "pending" },
  },

  // FASE 3: Criação de Conteúdo (3 agentes)
  {
    id: "copy-generator",
    type: "agentNode",
    position: { x: 650, y: 100 },
    data: { label: "Copy Generator", phase: 3, status: "pending" },
  },
  {
    id: "creative-designer",
    type: "agentNode",
    position: { x: 650, y: 200 },
    data: { label: "Creative Designer", phase: 3, status: "pending" },
  },
  {
    id: "story-writer",
    type: "agentNode",
    position: { x: 650, y: 300 },
    data: { label: "Story Writer", phase: 3, status: "pending" },
  },

  // FASE 4: Estrutura de Funil (3 agentes)
  {
    id: "funnel-architect",
    type: "agentNode",
    position: { x: 950, y: 100 },
    data: { label: "Funnel Architect", phase: 4, status: "pending" },
  },
  {
    id: "conversion-optimizer",
    type: "agentNode",
    position: { x: 950, y: 200 },
    data: { label: "Conversion Optimizer", phase: 4, status: "pending" },
  },
  {
    id: "automation-builder",
    type: "agentNode",
    position: { x: 950, y: 300 },
    data: { label: "Automation Builder", phase: 4, status: "pending" },
  },
];

export const detailedEdges: Edge[] = [
  // Fase 1 internal connections
  { id: "e-dna-reverse", source: "dna-extractor", target: "reverse-engineer" },
  { id: "e-reverse-clone", source: "reverse-engineer", target: "clone-configurator" },
  { id: "e-clone-expert", source: "clone-configurator", target: "expert-emulator" },

  // Fase 1 to Fase 2
  { id: "e-expert-behavioral", source: "expert-emulator", target: "behavioral-psychologist", animated: true },
  { id: "e-expert-capivara", source: "expert-emulator", target: "capivara-intelligence" },
  { id: "e-expert-market", source: "expert-emulator", target: "market-analyzer" },

  // Fase 2 to Fase 3
  { id: "e-behavioral-copy", source: "behavioral-psychologist", target: "copy-generator" },
  { id: "e-capivara-creative", source: "capivara-intelligence", target: "creative-designer" },
  { id: "e-market-story", source: "market-analyzer", target: "story-writer" },

  // Fase 3 to Fase 4
  { id: "e-copy-funnel", source: "copy-generator", target: "funnel-architect" },
  { id: "e-creative-conversion", source: "creative-designer", target: "conversion-optimizer" },
  { id: "e-story-automation", source: "story-writer", target: "automation-builder" },
];
