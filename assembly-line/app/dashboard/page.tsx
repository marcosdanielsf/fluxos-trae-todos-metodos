"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AgentResultModal } from "@/components/features/agent-result-modal";
import { motion } from "framer-motion";
import {
  Dna,
  Brain,
  Lightbulb,
  Megaphone,
  ChevronRight,
  Check,
  Loader2,
  Lock,
  MoreVertical,
  Pause,
  Settings as SettingsIcon,
} from "lucide-react";
import { useProject } from "@/contexts/ProjectContext";
import { processAgent } from "@/lib/services/agent-processor";
import { saveAgentResult, updateProject } from "@/lib/services/projects";
import { ProjectStats } from "@/components/sections/ProjectStats";
import { AgentResultCard } from "@/components/features/AgentResultCard";

type AgentStatus = "completed" | "processing" | "pending" | "locked";

interface Agent {
  id: string;
  name: string;
  status: AgentStatus;
  timestamp?: string;
  badge?: string;
  badgeVariant?: "success" | "warning" | "info";
  progress?: number;
  estimatedTime?: string;
  tokensUsed?: number;
  cost?: number;
}

interface Phase {
  id: number;
  title: string;
  icon: any;
  progress: number;
  status: "active" | "locked" | "completed";
  agents: Agent[];
}

export default function DashboardPage() {
  const { onboardingData, addAgentResult, isPhaseApproved, agentResults } = useProject();
  const [showAgentModal, setShowAgentModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [totalCost, setTotalCost] = useState(0);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);

  // Get current project ID from localStorage
  useEffect(() => {
    const projectId = localStorage.getItem("currentProjectId");
    if (projectId) {
      setCurrentProjectId(projectId);
      console.log("📊 Projeto atual:", projectId);
    }
  }, []);

  // Update project total cost in Supabase whenever it changes
  useEffect(() => {
    if (currentProjectId && totalCost > 0) {
      updateProject(currentProjectId, {
        totalCost,
        currentPhase: currentPhaseIndex + 1,
      }).catch(err => console.error("❌ Erro ao atualizar projeto:", err));
    }
  }, [totalCost, currentProjectId, currentPhaseIndex]);

  const initialPhases: Phase[] = [
    {
      id: 1,
      title: "Clonagem de Identidade",
      icon: Dna,
      progress: 0,
      status: "active",
      agents: [
        {
          id: "dna-extractor",
          name: "DNA Extractor",
          status: "pending",
        },
        {
          id: "reverse-engineer",
          name: "Reverse Engineer",
          status: "pending",
        },
        {
          id: "clone-configurator",
          name: "Clone Configurator",
          status: "pending",
        },
        {
          id: "expert-emulator",
          name: "Expert Emulator",
          status: "pending",
        },
      ],
    },
    {
      id: 2,
      title: "Inteligência de Mercado",
      icon: Brain,
      progress: 0,
      status: "locked",
      agents: [
        {
          id: "behavioral-psychologist",
          name: "Behavioral Psychologist",
          status: "locked",
        },
        {
          id: "capivara-intelligence",
          name: "Capivara Intelligence",
          status: "locked",
        },
        {
          id: "market-analyzer",
          name: "Market Analyzer",
          status: "locked",
        },
      ],
    },
    {
      id: 3,
      title: "Criação de Conteúdo",
      icon: Lightbulb,
      progress: 0,
      status: "locked",
      agents: [
        {
          id: "copy-generator",
          name: "Copy Generator",
          status: "locked",
        },
        {
          id: "creative-designer",
          name: "Creative Designer",
          status: "locked",
        },
        {
          id: "story-writer",
          name: "Story Writer",
          status: "locked",
        },
      ],
    },
    {
      id: 4,
      title: "Estrutura de Funil",
      icon: Megaphone,
      progress: 0,
      status: "locked",
      agents: [
        {
          id: "funnel-architect",
          name: "Funnel Architect",
          status: "locked",
        },
        {
          id: "conversion-optimizer",
          name: "Conversion Optimizer",
          status: "locked",
        },
        {
          id: "automation-builder",
          name: "Automation Builder",
          status: "locked",
        },
      ],
    },
  ];

  const [phases, setPhases] = useState<Phase[]>(initialPhases);

  // Check for agents that need regeneration
  useEffect(() => {
    const agentsNeedingRegeneration = agentResults.filter(
      (result) => result.feedback && result.approved === false
    );

    if (agentsNeedingRegeneration.length > 0) {
      setPhases((prevPhases) => {
        const newPhases = [...prevPhases];
        agentsNeedingRegeneration.forEach((agentResult) => {
          // Find the agent in phases and reset it to pending
          for (const phase of newPhases) {
            const agent = phase.agents.find((a) => a.id === agentResult.agentId);
            if (agent && agent.status === "completed") {
              agent.status = "pending";
              agent.badge = "Reprocessando com feedback";
              agent.badgeVariant = "warning";
              delete agent.timestamp;
              delete agent.tokensUsed;
              delete agent.cost;
              break;
            }
          }
        });
        return newPhases;
      });
    }
  }, [agentResults]);

  // Check when all agents are approved to unlock next phase
  useEffect(() => {
    setPhases((prevPhases) => {
      const newPhases = [...prevPhases];

      // Check each phase
      for (let i = 0; i < newPhases.length; i++) {
        const phase = newPhases[i];

        // Only check active phases where all agents are completed
        if (phase.status === "active") {
          const completedAgents = phase.agents.filter((a) => a.status === "completed").length;

          if (completedAgents === phase.agents.length) {
            // All agents completed, check if approved
            const phaseApproved = isPhaseApproved(i);

            if (phaseApproved && i < newPhases.length - 1) {
              // Phase approved! Mark as completed and unlock next
              phase.status = "completed";
              newPhases[i + 1].status = "active";
              newPhases[i + 1].agents.forEach((agent) => {
                agent.status = "pending";
              });

              // Update current phase index
              setCurrentPhaseIndex(i + 1);
              console.log(`✅ Fase ${i + 1} aprovada! Desbloqueando Fase ${i + 2}`);
            }
          }
        }
      }

      return newPhases;
    });
  }, [agentResults, isPhaseApproved]);

  // Simulate automatic agent processing
  useEffect(() => {
    if (isPaused) return; // Stop processing when paused

    const timer = setInterval(() => {
      setPhases((prevPhases) => {
        const newPhases = [...prevPhases];
        const currentPhase = newPhases[currentPhaseIndex];

        if (currentPhase && currentPhase.status === "active") {
          // Find first pending or processing agent
          const agentIndex = currentPhase.agents.findIndex(
            (agent) => agent.status === "pending" || agent.status === "processing"
          );

          if (agentIndex !== -1) {
            const agent = currentPhase.agents[agentIndex];

            if (agent.status === "pending") {
              // Start processing
              agent.status = "processing";
              agent.progress = 0;
              agent.estimatedTime = "~" + Math.floor(Math.random() * 30 + 20) + "s restantes";
            } else if (agent.status === "processing") {
              // Increment progress
              const currentProgress = agent.progress || 0;
              if (currentProgress < 100) {
                agent.progress = Math.min(currentProgress + 5, 100);

                const remaining = Math.floor((100 - agent.progress) / 5) * 2;
                agent.estimatedTime = remaining > 0 ? `~${remaining}s restantes` : "Finalizando...";
              } else {
                // Progress reached 100% - call API to generate real content
                if (onboardingData) {
                  // Check if agent has feedback for regeneration
                  const agentWithFeedback = agentResults.find(r => r.agentId === agent.id);
                  const feedbackToUse = agentWithFeedback?.feedback;

                  // Process agent with Gemini API (with optional feedback)
                  processAgent(agent.id, onboardingData, feedbackToUse)
                    .then((result) => {
                      console.log(`✅ Agente ${agent.id} processado:`, result);

                      // Save result to context
                      addAgentResult({
                        agentId: agent.id,
                        agentName: agent.name,
                        content: result.content,
                        timestamp: new Date().toISOString(),
                        tokensUsed: result.tokensUsed,
                        cost: result.cost,
                        approved: false, // Precisa ser aprovado pelo cliente
                        version: 1,
                      });

                      // Save agent result to Supabase
                      if (currentProjectId) {
                        saveAgentResult(currentProjectId, {
                          agentId: agent.id,
                          agentName: agent.name,
                          phaseNumber: currentPhaseIndex + 1,
                          content: result.content,
                          tokensUsed: result.tokensUsed,
                          cost: result.cost,
                          approved: false,
                        }).catch(err => console.error("❌ Erro ao salvar agente no Supabase:", err));
                      }

                      // Update agent in state
                      setPhases((prevPhases) => {
                        const updated = [...prevPhases];
                        const phase = updated[currentPhaseIndex];
                        const agentToUpdate = phase.agents.find((a) => a.id === agent.id);

                        if (agentToUpdate) {
                          agentToUpdate.status = "completed";
                          agentToUpdate.timestamp = "Concluído agora";
                          agentToUpdate.badge = "Gerado com IA";
                          agentToUpdate.badgeVariant = "success";
                          agentToUpdate.tokensUsed = result.tokensUsed;
                          agentToUpdate.cost = result.cost;
                          delete agentToUpdate.progress;
                          delete agentToUpdate.estimatedTime;

                          setTotalCost((prev) => prev + result.cost);
                        }

                        return updated;
                      });
                    })
                    .catch((error) => {
                      console.error(`❌ Erro ao processar agente ${agent.id}:`, error);

                      // Fallback: mark as completed with mock data
                      agent.status = "completed";
                      agent.timestamp = "Concluído agora";
                      agent.badge = "Fallback (sem API)";
                      agent.badgeVariant = "warning";
                      agent.tokensUsed = Math.floor(Math.random() * 3000 + 2000);
                      agent.cost = (agent.tokensUsed / 1000) * 0.001;
                      setTotalCost((prev) => prev + agent.cost!);
                      delete agent.progress;
                      delete agent.estimatedTime;
                    });
                } else {
                  // No onboarding data - use mock
                  agent.status = "completed";
                  agent.timestamp = "Concluído agora";
                  agent.badge = "Dados mockados";
                  agent.badgeVariant = "warning";
                  agent.tokensUsed = Math.floor(Math.random() * 5000 + 2000);
                  agent.cost = (agent.tokensUsed / 1000) * 0.001;
                  setTotalCost((prev) => prev + agent.cost!);
                  delete agent.progress;
                  delete agent.estimatedTime;
                }
              }
            }

            // Update phase progress
            const completedAgents = currentPhase.agents.filter((a) => a.status === "completed").length;
            currentPhase.progress = Math.floor((completedAgents / currentPhase.agents.length) * 100);

            // Não avança automaticamente - aguarda aprovação do cliente
            // A lógica de avanço está no useEffect que observa aprovações
          }
        }

        return newPhases;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentPhaseIndex, isPaused]);

  const handleViewResult = (agent: Agent) => {
    setSelectedAgent(agent);
    setShowAgentModal(true);
  };

  return (
    <div className="flex min-h-screen bg-[rgb(var(--background))]">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-[rgb(var(--background))] border-b border-[rgb(var(--border))] p-6">
          <div className="flex items-center justify-between">
            <div>
              <nav className="flex items-center gap-2 text-sm text-[rgb(var(--foreground-secondary))] mb-2">
                <span>Projetos</span>
                <ChevronRight className="h-4 w-4" />
                <span className="text-[rgb(var(--foreground))]">
                  Lançamento Mentoria Premium
                </span>
              </nav>
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold">Lançamento Mentoria Premium</h1>
                <Badge variant="info">
                  FASE {currentPhaseIndex + 1} - {phases[currentPhaseIndex]?.status === "completed" ? "Concluída" : "Em Progresso"}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-[rgb(var(--card))] border border-[rgb(var(--card-border))] rounded-lg">
                <p className="text-xs text-gray-400">Custo Total</p>
                <p className="text-lg font-bold text-white">${totalCost.toFixed(4)}</p>
              </div>
              <Button
                variant="outline"
                size="md"
                onClick={() => setIsPaused(!isPaused)}
              >
                <Pause className="h-4 w-4" />
                {isPaused ? "Retomar" : "Pausar"}
              </Button>
              <Button variant="ghost" size="md">
                <SettingsIcon className="h-4 w-4" />
                Configurações
              </Button>
              <Button variant="ghost" size="md">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Project Stats */}
        <div className="p-6 pb-0">
          <ProjectStats
            totalAgents={phases.reduce((acc, p) => acc + p.agents.length, 0)}
            completedAgents={phases.reduce((acc, p) => acc + p.agents.filter(a => a.status === "completed").length, 0)}
            processingAgents={phases.reduce((acc, p) => acc + p.agents.filter(a => a.status === "processing").length, 0)}
            totalCost={totalCost}
            currentPhase={currentPhaseIndex + 1}
            totalPhases={phases.length}
          />
        </div>

        {/* Phases */}
        <div className="p-6 space-y-6">
          {phases.map((phase, index) => {
            const Icon = phase.icon;
            return (
              <motion.div
                key={phase.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                <Card
                  className={phase.status === "locked" ? "opacity-60" : ""}
                >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div
                        className={`p-3 rounded-lg ${
                          phase.status === "locked"
                            ? "bg-[rgb(var(--card))]"
                            : "bg-gradient-to-br from-[rgb(var(--primary))] to-[rgb(var(--secondary))]"
                        }`}
                      >
                        {phase.status === "locked" ? (
                          <Lock className="h-6 w-6 text-[rgb(var(--foreground-secondary))]" />
                        ) : (
                          <Icon className="h-6 w-6 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">
                          FASE {phase.id}: {phase.title}
                        </CardTitle>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-[rgb(var(--foreground-secondary))]">
                              {phase.status === "locked"
                                ? "Aguardando fase anterior"
                                : `${phase.progress}% Concluído`}
                            </span>
                          </div>
                          <Progress value={phase.progress} showPercentage={false} />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  {phase.status === "locked" ? (
                    <div className="text-center py-8">
                      <Lock className="h-12 w-12 text-[rgb(var(--foreground-secondary))] mx-auto mb-3" />
                      <p className="text-[rgb(var(--foreground-secondary))]">
                        {index > 0 && !isPhaseApproved(index - 1)
                          ? `Aguardando aprovação da Fase ${phase.id - 1}`
                          : `Será desbloqueada após conclusão da Fase ${phase.id - 1}`}
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Warning when phase is complete but not approved */}
                      {phase.progress === 100 && !isPhaseApproved(index) && (
                        <div className="mb-4 p-4 bg-[rgb(var(--warning))]/10 border border-[rgb(var(--warning))]/30 rounded-lg">
                          <div className="flex items-start gap-3">
                            <div className="w-5 h-5 rounded-full bg-[rgb(var(--warning))]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-[rgb(var(--warning))] text-sm font-bold">!</span>
                            </div>
                            <div>
                              <h4 className="font-semibold text-[rgb(var(--warning))] mb-1">
                                Fase Aguardando Aprovação
                              </h4>
                              <p className="text-sm text-[rgb(var(--foreground-secondary))]">
                                Todos os agentes foram processados. Revise os resultados e aprove cada agente antes de avançar para a próxima fase.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {phase.agents.map((agent) => {
                          const agentResult = agentResults.find(r => r.agentId === agent.id);
                          return (
                            <AgentResultCard
                              key={agent.id}
                              agentName={agent.name}
                              agentId={agent.id}
                              content={agentResult?.content || ""}
                              status={agent.status}
                              tokensUsed={agent.tokensUsed}
                              cost={agent.cost}
                              approved={agentResult?.approved}
                              phase={phase.id}
                              onView={() => handleViewResult(agent)}
                            />
                          );
                        })}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
              </motion.div>
            );
          })}
        </div>
      </main>

      {/* Agent Result Modal */}
      {selectedAgent && (
        <AgentResultModal
          open={showAgentModal}
          onOpenChange={setShowAgentModal}
          agentName={selectedAgent.name}
          agentId={selectedAgent.id}
        />
      )}
    </div>
  );
}
