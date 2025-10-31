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
}

interface ProjectContextType {
  onboardingData: OnboardingData | null;
  setOnboardingData: (data: OnboardingData) => void;
  agentResults: AgentResult[];
  addAgentResult: (result: AgentResult) => void;
  currentProjectId: string | null;
  setCurrentProjectId: (id: string) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

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
      const updated = [...prev, result];
      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("assembly-line-results", JSON.stringify(updated));
      }
      return updated;
    });
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
