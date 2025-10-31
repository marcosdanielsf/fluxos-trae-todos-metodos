"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  FileText,
  ThumbsUp,
  Edit3,
  RotateCcw,
  Download,
  Share2,
  Copy,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface AgentResultModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agentName: string;
  agentId: string;
}

export function AgentResultModal({
  open,
  onOpenChange,
  agentName,
  agentId,
}: AgentResultModalProps) {
  const [feedback, setFeedback] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  const handleApprove = () => {
    console.log("Approved:", agentId);
    onOpenChange(false);
  };

  const handleFeedback = () => {
    console.log("Feedback:", feedback);
    setShowFeedbackForm(false);
    setFeedback("");
  };

  const handleRedo = () => {
    if (confirm("Tem certeza? O agente será executado novamente.")) {
      console.log("Redo:", agentId);
      onOpenChange(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader onClose={() => onOpenChange(false)}>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Badge variant="info" size="md">
                {agentName}
              </Badge>
              <Badge variant="success" size="sm">
                Concluído
              </Badge>
            </div>
            <DialogTitle>Resultado do Agente</DialogTitle>
            <p className="text-sm text-[rgb(var(--foreground-secondary))]">
              Concluído em 14:32
            </p>
          </div>
        </DialogHeader>

        <DialogBody>
          <div className="space-y-6">
            {/* Resumo Executivo */}
            <div className="p-4 bg-[rgb(var(--background-secondary))] rounded-lg border border-[rgb(var(--border))]">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-5 w-5 text-[rgb(var(--primary))]" />
                <h3 className="font-bold text-lg">DNA do Especialista Extraído</h3>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-[rgb(var(--primary))]">•</span>
                  <span>
                    <strong>Tom:</strong> Inspirador + Direto
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[rgb(var(--primary))]">•</span>
                  <span>
                    <strong>Valores Core:</strong> Autenticidade, Resultado, Transparência
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[rgb(var(--primary))]">•</span>
                  <span>
                    <strong>História Central:</strong> De 0 a R$5M em 3 anos no nicho X
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[rgb(var(--primary))]">•</span>
                  <span>
                    <strong>Linguagem Característica:</strong> Brasileira, casual, usa gírias
                    específicas
                  </span>
                </li>
              </ul>
            </div>

            {/* Detalhamento Completo */}
            <div>
              <h3 className="font-bold mb-3">Detalhamento Completo</h3>
              <Tabs defaultValue="patterns">
                <TabsList className="w-full">
                  <TabsTrigger value="patterns" className="flex-1">
                    Padrões Linguísticos
                  </TabsTrigger>
                  <TabsTrigger value="thinking" className="flex-1">
                    Estrutura de Pensamento
                  </TabsTrigger>
                  <TabsTrigger value="raw" className="flex-1">
                    Dados Brutos
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="patterns">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2 text-sm">Palavras mais usadas</h4>
                      <div className="flex flex-wrap gap-2">
                        {["resultado", "transformar", "autêntico", "estratégia", "sucesso"].map(
                          (word) => (
                            <Badge key={word} variant="default" size="sm">
                              {word}
                            </Badge>
                          )
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2 text-sm">Expressões recorrentes</h4>
                      <ul className="space-y-1 text-sm text-[rgb(var(--foreground-secondary))]">
                        <li>• "Vamos direto ao ponto"</li>
                        <li>• "Eu sempre digo que..."</li>
                        <li>• "A verdade é que..."</li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="thinking">
                  <div className="space-y-2 text-sm text-[rgb(var(--foreground-secondary))]">
                    <p>
                      • Usa storytelling para ilustrar conceitos complexos
                    </p>
                    <p>
                      • Sempre conecta teoria com exemplos práticos reais
                    </p>
                    <p>
                      • Utiliza metáforas de esportes e construção
                    </p>
                    <p>
                      • Estrutura em 3 pontos principais
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="raw">
                  <div className="relative">
                    <pre className="p-4 bg-[rgb(var(--background))] rounded-lg text-xs overflow-x-auto border border-[rgb(var(--border))]">
                      <code>{`{
  "tone": "inspirational_direct",
  "core_values": ["authenticity", "results", "transparency"],
  "central_story": "0_to_5M_in_3_years",
  "language_style": "brazilian_casual_specific_slang",
  "common_phrases": [
    "Vamos direto ao ponto",
    "Eu sempre digo que...",
    "A verdade é que..."
  ],
  "metaphors": ["sports", "construction"],
  "structure_pattern": "three_main_points"
}`}</code>
                    </pre>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() =>
                        copyToClipboard(
                          '{"tone": "inspirational_direct", "core_values": ["authenticity", "results", "transparency"]}'
                        )
                      }
                    >
                      <Copy className="h-4 w-4" />
                      Copiar
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Avaliação do Cliente */}
            <div className="p-4 bg-gradient-to-r from-[rgb(var(--primary))]/10 to-[rgb(var(--secondary))]/10 rounded-lg border border-[rgb(var(--primary))]/20">
              <h3 className="font-bold mb-4">Este resultado representa você fielmente?</h3>

              {!showFeedbackForm ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Button
                    variant="success"
                    className="h-auto py-4 flex flex-col items-center gap-2"
                    onClick={handleApprove}
                  >
                    <ThumbsUp className="h-5 w-5" />
                    <span className="text-sm">Perfeito! Aprovar</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-auto py-4 flex flex-col items-center gap-2 border-[rgb(var(--warning))] hover:bg-[rgb(var(--warning))]/10"
                    onClick={() => setShowFeedbackForm(true)}
                  >
                    <Edit3 className="h-5 w-5 text-[rgb(var(--warning))]" />
                    <span className="text-sm">Quase lá, dar feedback</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-auto py-4 flex flex-col items-center gap-2 border-[rgb(var(--error))] hover:bg-[rgb(var(--error))]/10"
                    onClick={handleRedo}
                  >
                    <RotateCcw className="h-5 w-5 text-[rgb(var(--error))]" />
                    <span className="text-sm">Refazer do zero</span>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Ex: Adicionar que sempre uso metáforas de esportes..."
                    rows={4}
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleFeedback} className="flex-1">
                      Reprocessar com Feedback
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setShowFeedbackForm(false);
                        setFeedback("");
                      }}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Histórico de Versões */}
            <div>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center gap-2 text-sm text-[rgb(var(--foreground-secondary))] hover:text-[rgb(var(--foreground))] transition-colors"
              >
                {showHistory ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
                Ver versões anteriores (2)
              </button>
              {showHistory && (
                <div className="mt-3 space-y-2 pl-6">
                  <div className="p-3 bg-[rgb(var(--background))] rounded-lg text-sm">
                    <p className="font-medium">Versão 2 - há 5 min</p>
                    <p className="text-xs text-[rgb(var(--foreground-secondary))]">
                      Ajustado após feedback sobre tom de voz
                    </p>
                  </div>
                  <div className="p-3 bg-[rgb(var(--background))] rounded-lg text-sm">
                    <p className="font-medium">Versão 1 - há 10 min</p>
                    <p className="text-xs text-[rgb(var(--foreground-secondary))]">
                      Versão inicial
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogBody>

        <DialogFooter>
          <Button variant="outline" size="md">
            <Download className="h-4 w-4" />
            Baixar PDF
          </Button>
          <Button variant="outline" size="md">
            <Share2 className="h-4 w-4" />
            Compartilhar
          </Button>
          <Button variant="ghost" size="md" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
