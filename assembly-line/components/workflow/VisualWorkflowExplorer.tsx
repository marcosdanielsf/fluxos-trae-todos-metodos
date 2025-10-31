"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WorkflowCanvas } from "./WorkflowCanvas";
import { macroNodes, macroEdges, detailedNodes, detailedEdges } from "./workflow-data";
import { Maximize2, Grid3x3, Info } from "lucide-react";

type ViewMode = "macro" | "detailed";

export function VisualWorkflowExplorer() {
  const [viewMode, setViewMode] = useState<ViewMode>("macro");

  return (
    <section className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl font-bold gradient-text mb-4">
            Fluxo de Trabalho Visual
          </h2>
          <p className="text-lg text-[rgb(var(--foreground-secondary))] max-w-2xl mx-auto">
            Explore como nossa Assembly Line de IA processa sua marca através de 4 fases e 13 agentes especializados.
          </p>
        </motion.div>

        {/* View Mode Toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-center justify-between gap-4 mb-6"
        >
          <div className="flex gap-2">
            <Button
              variant={viewMode === "macro" ? "gradient" : "outline"}
              size="md"
              onClick={() => setViewMode("macro")}
              icon={<Maximize2 className="w-4 h-4" />}
            >
              Visão Macro
            </Button>
            <Button
              variant={viewMode === "detailed" ? "gradient" : "outline"}
              size="md"
              onClick={() => setViewMode("detailed")}
              icon={<Grid3x3 className="w-4 h-4" />}
            >
              Visão Detalhada
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-[rgb(var(--primary))]" />
            <span className="text-sm text-[rgb(var(--foreground-secondary))]">
              {viewMode === "macro"
                ? "4 fases principais da produção"
                : "13 agentes trabalhando em paralelo"}
            </span>
          </div>
        </motion.div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Card variant="solid" className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-sm font-semibold text-[rgb(var(--foreground))]">Legenda:</span>
              <div className="flex flex-wrap gap-3">
                <Badge variant="phase1" size="sm">Clonagem</Badge>
                <Badge variant="phase2" size="sm">Inteligência</Badge>
                <Badge variant="phase3" size="sm">Criação</Badge>
                <Badge variant="phase4" size="sm">Funil</Badge>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-[rgb(var(--success))]"></div>
                  <span className="text-xs text-[rgb(var(--foreground-secondary))]">Concluído</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-[rgb(var(--primary))] animate-pulse"></div>
                  <span className="text-xs text-[rgb(var(--foreground-secondary))]">Em andamento</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-[rgb(var(--foreground-secondary))]"></div>
                  <span className="text-xs text-[rgb(var(--foreground-secondary))]">Pendente</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Canvas */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glow-blue"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={viewMode}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <WorkflowCanvas
                initialNodes={viewMode === "macro" ? macroNodes : detailedNodes}
                initialEdges={viewMode === "macro" ? macroEdges : detailedEdges}
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center"
        >
          <p className="text-sm text-[rgb(var(--foreground-secondary))]">
            💡 Dica: Use o scroll do mouse para zoom, arraste para navegar, e clique nos nós para mais informações
          </p>
        </motion.div>
      </div>
    </section>
  );
}
