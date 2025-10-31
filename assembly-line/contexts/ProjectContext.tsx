"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { saveProject, saveAgentResult, updateAgentApproval } from "@/lib/services/projects";

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
  // Fase 1: Clonagem de Identidade
  "dna-extractor": 0,
  "reverse-engineer": 0,
  "clone-configurator": 0,
  "expert-emulator": 0,
  // Fase 2: Inteligência de Mercado
  "behavioral-psychologist": 1,
  "capivara-intelligence": 1,
  "market-analyzer": 1,
  // Fase 3: Criação de Conteúdo
  "copy-generator": 2,
  "creative-designer": 2,
  "story-writer": 2,
  // Fase 4: Estrutura de Funil
  "funnel-architect": 3,
  "conversion-optimizer": 3,
  "automation-builder": 3,
};

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [onboardingData, setOnboardingDataState] = useState<OnboardingData | null>(null);
  const [agentResults, setAgentResults] = useState<AgentResult[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);

  const setOnboardingData = async (data: OnboardingData) => {
    setOnboardingDataState(data);
    // Save to localStorage for persistence
    if (typeof window !== "undefined") {
      localStorage.setItem("assembly-line-onboarding", JSON.stringify(data));
    }

    // Create project in Supabase if not exists
    if (!currentProjectId) {
      try {
        const projectId = await saveProject({
          name: `${data.offerName} - ${data.niche}`,
          niche: data.niche,
          description: data.description,
          clientName: data.clientName,
          currentPhase: 1,
          status: "em-andamento",
          totalCost: 0,
        });
        setCurrentProjectId(projectId);
        if (typeof window !== "undefined") {
          localStorage.setItem("assembly-line-project-id", projectId);
        }
      } catch (error) {
        console.error("Erro ao criar projeto no Supabase:", error);
      }
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

    // Save to Supabase if project exists
    if (currentProjectId) {
      const phaseNumber = AGENT_PHASE_MAP[result.agentId] + 1; // Convert 0-indexed to 1-indexed
      saveAgentResult(currentProjectId, {
        agentId: result.agentId,
        agentName: result.agentName,
        phaseNumber,
        content: result.content,
        tokensUsed: result.tokensUsed,
        cost: result.cost,
        approved: result.approved || false,
      }).catch((error) => {
        console.error("Erro ao salvar agente no Supabase:", error);
      });
    }
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
    console.log("🔵 ProjectContext.approveAgent chamado:", agentId);
    console.log("🔵 agentResults antes:", agentResults);
    updateAgentResult(agentId, { approved: true });
    console.log("🔵 agentResults depois:", agentResults);

    // Update in Supabase
    if (currentProjectId) {
      console.log("🔵 Salvando no Supabase, projectId:", currentProjectId);
      updateAgentApproval(currentProjectId, agentId, true).catch((error) => {
        console.error("Erro ao atualizar aprovação no Supabase:", error);
      });
    } else {
      console.warn("⚠️ Sem projectId, não salvou no Supabase");
    }
  };

  const requestRegeneration = (agentId: string, feedback: string) => {
    updateAgentResult(agentId, {
      approved: false,
      feedback,
    });

    // Update in Supabase
    if (currentProjectId) {
      updateAgentApproval(currentProjectId, agentId, false, feedback).catch((error) => {
        console.error("Erro ao atualizar feedback no Supabase:", error);
      });
    }
  };

  const getAgentsByPhase = (phaseIndex: number): AgentResult[] => {
    return agentResults.filter((result) => {
      const agentPhase = AGENT_PHASE_MAP[result.agentId];
      return agentPhase === phaseIndex;
    });
  };

  const isPhaseApproved = (phaseIndex: number): boolean => {
    const phaseAgents = getAgentsByPhase(phaseIndex);

    console.log(`🔍 isPhaseApproved(${phaseIndex}):`, {
      phaseAgents,
      agentCount: phaseAgents.length,
    });

    // Se não há agentes processados ainda, fase não está aprovada
    if (phaseAgents.length === 0) {
      console.log(`❌ Fase ${phaseIndex}: Nenhum agente processado`);
      return false;
    }

    // Conta quantos agentes existem nesta fase
    const expectedAgentCount = Object.values(AGENT_PHASE_MAP).filter(
      (phase) => phase === phaseIndex
    ).length;

    console.log(`📊 Fase ${phaseIndex}: ${phaseAgents.length}/${expectedAgentCount} agentes processados`);

    // Verifica se todos os agentes foram processados e aprovados
    if (phaseAgents.length < expectedAgentCount) {
      console.log(`❌ Fase ${phaseIndex}: Nem todos os agentes foram processados`);
      return false;
    }

    // Verifica se todos os agentes foram aprovados
    const allApproved = phaseAgents.every((agent) => agent.approved === true);
    const approvedCount = phaseAgents.filter((agent) => agent.approved === true).length;

    console.log(`📊 Fase ${phaseIndex}: ${approvedCount}/${expectedAgentCount} aprovados`);
    console.log(`${allApproved ? "✅" : "❌"} Fase ${phaseIndex} ${allApproved ? "APROVADA" : "NÃO aprovada"}`);

    return allApproved;
  };

  // Load from localStorage on mount
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const savedOnboarding = localStorage.getItem("assembly-line-onboarding");
      const savedResults = localStorage.getItem("assembly-line-results");
      const savedProjectId = localStorage.getItem("assembly-line-project-id");

      if (savedOnboarding) {
        setOnboardingDataState(JSON.parse(savedOnboarding));
      }

      if (savedResults) {
        setAgentResults(JSON.parse(savedResults));
      }

      if (savedProjectId) {
        setCurrentProjectId(savedProjectId);
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
