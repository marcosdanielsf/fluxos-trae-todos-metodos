"use client";

import { useState } from "react";
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
  const [showAgentModal, setShowAgentModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  const phases: Phase[] = [
    {
      id: 1,
      title: "Clonagem de Identidade",
      icon: Dna,
      progress: 75,
      status: "active",
      agents: [
        {
          id: "dna-extractor",
          name: "DNA Extractor",
          status: "completed",
          timestamp: "Concluído há 2 min",
          badge: "Aprovado",
          badgeVariant: "success",
        },
        {
          id: "reverse-engineer",
          name: "Reverse Engineer",
          status: "completed",
          timestamp: "Concluído há 1 min",
          badge: "Aprovado com ajustes",
          badgeVariant: "warning",
        },
        {
          id: "clone-configurator",
          name: "Clone Configurator",
          status: "completed",
          timestamp: "Concluído agora",
          badge: "Aprovado",
          badgeVariant: "success",
        },
        {
          id: "expert-emulator",
          name: "Expert Emulator",
          status: "processing",
          progress: 45,
          estimatedTime: "~1m 30s restantes",
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
      ],
    },
  ];

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
                <Badge variant="info">FASE 1 - Em Progresso</Badge>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="md">
                <Pause className="h-4 w-4" />
                Pausar
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
                        Será desbloqueada após conclusão da Fase {phase.id - 1}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {phase.agents.map((agent) => (
                        <div
                          key={agent.id}
                          className="flex items-center gap-4 p-4 rounded-lg bg-[rgb(var(--background-secondary))] border border-[rgb(var(--border))] hover:border-[rgb(var(--primary))]/50 transition-all"
                        >
                          {/* Status Icon */}
                          <div>
                            {agent.status === "completed" && (
                              <div className="w-8 h-8 rounded-full bg-[rgb(var(--success))]/20 flex items-center justify-center">
                                <Check className="h-5 w-5 text-[rgb(var(--success))]" />
                              </div>
                            )}
                            {agent.status === "processing" && (
                              <div className="w-8 h-8 rounded-full bg-[rgb(var(--primary))]/20 flex items-center justify-center">
                                <Loader2 className="h-5 w-5 text-[rgb(var(--primary))] animate-spin" />
                              </div>
                            )}
                            {agent.status === "pending" && (
                              <div className="w-8 h-8 rounded-full bg-[rgb(var(--foreground-secondary))]/20 flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-[rgb(var(--foreground-secondary))]" />
                              </div>
                            )}
                          </div>

                          {/* Agent Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">{agent.name}</h4>
                              {agent.badge && (
                                <Badge variant={agent.badgeVariant} size="sm">
                                  {agent.badge}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-[rgb(var(--foreground-secondary))]">
                              {agent.timestamp || agent.estimatedTime || "Aguardando..."}
                            </p>
                            {agent.status === "processing" && agent.progress !== undefined && (
                              <div className="mt-2">
                                <Progress value={agent.progress} showPercentage={false} />
                              </div>
                            )}
                          </div>

                          {/* Action Button */}
                          {agent.status === "completed" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewResult(agent)}
                            >
                              Ver Resultado
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
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
