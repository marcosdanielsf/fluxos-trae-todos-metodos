"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export interface OnboardingData {
  fullName: string;
  niche: string;
  yearsOfExperience: number;
  description: string;
  files?: File[];
  clientName: string;
  clientAge?: string;
  clientGender?: string;
  clientPain: string;
  clientDesire: string;
  offerName: string;
  offerPrice: string;
  offerDescription: string;
  guaranteeType?: string;
  funnelType: string;
}

export interface AgentResult {
  agentId: string;
  agentName: string;
  content: string;
  timestamp: string;
  tokensUsed: number;
  cost: number;
  approved?: boolean;
  feedback?: string;
  version?: number;
}

interface ProjectContextType {
  onboardingData: OnboardingData | null;
  setOnboardingData: (data: OnboardingData) => void;
  agentResults: AgentResult[];
  addAgentResult: (result: AgentResult) => void;
  updateAgentResult: (agentId: string, updates: Partial<AgentResult>) => void;
  approveAgent: (agentId: string) => void;
  requestRegeneration: (agentId: string, feedback: string) => void;
  isPhaseApproved: (phaseIndex: number) => boolean;
  getAgentsByPhase: (phaseIndex: number) => AgentResult[];
  currentProjectId: string | null;
  setCurrentProjectId: (id: string) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

// Mapeamento de agentId para phase index
const AGENT_PHASE_MAP: Record<string, number> = {
  // Fase 1
  "dna-extractor": 0,
  "reverse-engineer": 0,
  "configuration": 0,
  "expert-emulator": 0,
  // Fase 2
  "behavior-analyst": 1,
  "market-intelligence": 1,
  "market-analyst": 1,
  // Fase 3
  "copy-generator": 2,
  "creative-brief": 2,
  "stories-generator": 2,
  // Fase 4
  "funnel-architect": 3,
  "conversion-optimizer": 3,
  "automation-builder": 3,
};

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [onboardingData, setOnboardingDataState] = useState<OnboardingData | null>(null);
  const [agentResults, setAgentResults] = useState<AgentResult[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);

  const setOnboardingData = (data: OnboardingData) => {
    setOnboardingDataState(data);
    // Save to localStorage for persistence
    if (typeof window !== "undefined") {
      localStorage.setItem("assembly-line-onboarding", JSON.stringify(data));
    }
  };

  const addAgentResult = (result: AgentResult) => {
    setAgentResults((prev) => {
      // Remove existing result for same agent if exists
      const filtered = prev.filter((r) => r.agentId !== result.agentId);
      const updated = [...filtered, result];
      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("assembly-line-results", JSON.stringify(updated));
      }
      return updated;
    });
  };

  const updateAgentResult = (agentId: string, updates: Partial<AgentResult>) => {
    setAgentResults((prev) => {
      const updated = prev.map((r) =>
        r.agentId === agentId ? { ...r, ...updates } : r
      );
      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("assembly-line-results", JSON.stringify(updated));
      }
      return updated;
    });
  };

  const approveAgent = (agentId: string) => {
    updateAgentResult(agentId, { approved: true });
  };

  const requestRegeneration = (agentId: string, feedback: string) => {
    updateAgentResult(agentId, {
      approved: false,
      feedback,
    });
  };

  const getAgentsByPhase = (phaseIndex: number): AgentResult[] => {
    return agentResults.filter((result) => {
      const agentPhase = AGENT_PHASE_MAP[result.agentId];
      return agentPhase === phaseIndex;
    });
  };

  const isPhaseApproved = (phaseIndex: number): boolean => {
    const phaseAgents = getAgentsByPhase(phaseIndex);

    // Se não há agentes processados ainda, fase não está aprovada
    if (phaseAgents.length === 0) {
      return false;
    }

    // Conta quantos agentes existem nesta fase
    const expectedAgentCount = Object.values(AGENT_PHASE_MAP).filter(
      (phase) => phase === phaseIndex
    ).length;

    // Verifica se todos os agentes foram processados e aprovados
    if (phaseAgents.length < expectedAgentCount) {
      return false;
    }

    // Verifica se todos os agentes foram aprovados
    return phaseAgents.every((agent) => agent.approved === true);
  };

  // Load from localStorage on mount
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const savedOnboarding = localStorage.getItem("assembly-line-onboarding");
      const savedResults = localStorage.getItem("assembly-line-results");

      if (savedOnboarding) {
        setOnboardingDataState(JSON.parse(savedOnboarding));
      }

      if (savedResults) {
        setAgentResults(JSON.parse(savedResults));
      }
    }
  }, []);

  return (
    <ProjectContext.Provider
      value={{
        onboardingData,
        setOnboardingData,
        agentResults,
        addAgentResult,
        updateAgentResult,
        approveAgent,
        requestRegeneration,
        isPhaseApproved,
        getAgentsByPhase,
        currentProjectId,
        setCurrentProjectId,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
}
