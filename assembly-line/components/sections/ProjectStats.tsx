"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { TrendingUp, Clock, DollarSign, CheckCircle2, Loader2 } from "lucide-react";

interface ProjectStatsProps {
  totalAgents: number;
  completedAgents: number;
  processingAgents: number;
  totalCost: number;
  currentPhase: number;
  totalPhases: number;
}

export function ProjectStats({
  totalAgents,
  completedAgents,
  processingAgents,
  totalCost,
  currentPhase,
  totalPhases,
}: ProjectStatsProps) {
  const completionPercentage = Math.round((completedAgents / totalAgents) * 100);

  const stats = [
    {
      icon: TrendingUp,
      label: "Progresso Total",
      value: `${completionPercentage}%`,
      sublabel: `${completedAgents}/${totalAgents} agentes`,
      color: "rgb(var(--phase1))",
    },
    {
      icon: Loader2,
      label: "Em Andamento",
      value: processingAgents,
      sublabel: processingAgents === 1 ? "agente processando" : "agentes processando",
      color: "rgb(var(--phase2))",
      isAnimated: processingAgents > 0,
    },
    {
      icon: DollarSign,
      label: "Custo Total",
      value: `$${totalCost.toFixed(4)}`,
      sublabel: "tokens consumidos",
      color: "rgb(var(--phase3))",
    },
    {
      icon: CheckCircle2,
      label: "Fase Atual",
      value: `${currentPhase}/${totalPhases}`,
      sublabel: "fases concluídas",
      color: "rgb(var(--phase4))",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card variant="gradient" className="relative overflow-hidden">
              {/* Background accent */}
              <div
                className="absolute inset-0 opacity-5"
                style={{
                  background: `radial-gradient(circle at top right, ${stat.color}, transparent 70%)`,
                }}
              />

              <div className="relative z-10 p-6 space-y-3">
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${stat.color}30, ${stat.color}10)`,
                  }}
                >
                  <Icon
                    className={`w-6 h-6 ${stat.isAnimated ? "animate-spin" : ""}`}
                    style={{ color: stat.color }}
                  />
                </div>

                {/* Value */}
                <div>
                  <div className="text-3xl font-bold text-[rgb(var(--foreground))]">
                    {stat.value}
                  </div>
                  <p className="text-sm text-[rgb(var(--foreground-secondary))] mt-1">
                    {stat.label}
                  </p>
                  <p className="text-xs text-[rgb(var(--foreground-secondary))] mt-1 opacity-70">
                    {stat.sublabel}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
