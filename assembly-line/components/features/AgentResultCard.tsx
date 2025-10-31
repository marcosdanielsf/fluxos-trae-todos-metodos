"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, DollarSign, Eye, FileText, Sparkles } from "lucide-react";
import { useState } from "react";

interface AgentResultCardProps {
  agentName: string;
  agentId: string;
  content: string;
  status: "completed" | "processing" | "pending";
  tokensUsed?: number;
  cost?: number;
  approved?: boolean;
  phase: number;
  onView?: () => void;
}

export function AgentResultCard({
  agentName,
  agentId,
  content,
  status,
  tokensUsed,
  cost,
  approved,
  phase,
  onView,
}: AgentResultCardProps) {
  const phaseColors = {
    1: "rgb(var(--phase1))",
    2: "rgb(var(--phase2))",
    3: "rgb(var(--phase3))",
    4: "rgb(var(--phase4))",
  };

  const phaseColor = phaseColors[phase as keyof typeof phaseColors] || "rgb(var(--primary))";
  const phaseVariant = `phase${phase}` as "phase1" | "phase2" | "phase3" | "phase4";

  const StatusIcon = () => {
    if (status === "completed" && approved) return <CheckCircle2 className="w-5 h-5 text-[rgb(var(--success))]" />;
    if (status === "completed") return <Eye className="w-5 h-5 text-[rgb(var(--warning))]" />;
    if (status === "processing") return <Sparkles className="w-5 h-5 text-[rgb(var(--primary))] animate-pulse" />;
    return <Clock className="w-5 h-5 text-[rgb(var(--foreground-secondary))]" />;
  };

  const getStatusText = () => {
    if (status === "completed" && approved) return "Aprovado";
    if (status === "completed") return "Aguardando Aprovação";
    if (status === "processing") return "Processando...";
    return "Pendente";
  };

  const getStatusVariant = () => {
    if (status === "completed" && approved) return "success";
    if (status === "completed") return "warning";
    if (status === "processing") return "info";
    return "default";
  };

  // Truncate content preview
  const contentPreview = content ? content.substring(0, 120) + "..." : "Aguardando processamento...";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card
        variant="gradient"
        className="relative overflow-hidden cursor-pointer"
        onClick={onView}
      >
        {/* Phase accent bar */}
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ background: phaseColor }}
        />

        <div className="p-6 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${phaseColor}30, ${phaseColor}10)`,
                }}
              >
                <FileText className="w-6 h-6" style={{ color: phaseColor }} />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-[rgb(var(--foreground))]">
                  {agentName}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={phaseVariant} size="sm">
                    Fase {phase}
                  </Badge>
                  <Badge variant={getStatusVariant() as any} size="sm">
                    <StatusIcon />
                    <span className="ml-1">{getStatusText()}</span>
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Content Preview */}
          {status === "completed" && content && (
            <div className="bg-[rgb(var(--background-secondary))] rounded-lg p-4 border border-[rgb(var(--border))]">
              <p className="text-sm text-[rgb(var(--foreground-secondary))] line-clamp-3">
                {contentPreview}
              </p>
            </div>
          )}

          {/* Processing State */}
          {status === "processing" && (
            <div className="flex items-center gap-2 text-sm text-[rgb(var(--primary))]">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>Gerando conteúdo com IA...</span>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-[rgb(var(--border))]">
            {/* Stats */}
            <div className="flex items-center gap-4 text-sm">
              {tokensUsed && (
                <div className="flex items-center gap-1 text-[rgb(var(--foreground-secondary))]">
                  <Sparkles className="w-4 h-4" />
                  <span>{tokensUsed.toLocaleString()} tokens</span>
                </div>
              )}
              {cost && (
                <div className="flex items-center gap-1 text-[rgb(var(--foreground-secondary))]">
                  <DollarSign className="w-4 h-4" />
                  <span>${cost.toFixed(4)}</span>
                </div>
              )}
            </div>

            {/* Action Button */}
            {status === "completed" && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onView?.();
                }}
              >
                <Eye className="w-4 h-4 mr-1" />
                Ver Detalhes
              </Button>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
