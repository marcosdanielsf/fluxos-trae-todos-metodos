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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  FileText,
  ThumbsUp,
  Edit3,
  RotateCcw,
  Download,
  Copy,
} from "lucide-react";
import { useProject } from "@/contexts/ProjectContext";

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
  const { agentResults, approveAgent, requestRegeneration } = useProject();
  const [feedback, setFeedback] = useState("");
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  // Get the result for this specific agent
  const agentResult = agentResults.find((r) => r.agentId === agentId);
  const hasRealContent = !!agentResult?.content;
  const isApproved = agentResult?.approved === true;

  const handleApprove = () => {
    approveAgent(agentId);
    onOpenChange(false);
  };

  const handleFeedback = () => {
    if (feedback.trim()) {
      requestRegeneration(agentId, feedback);
      setShowFeedbackForm(false);
      setFeedback("");
      onOpenChange(false);
      // Página será recarregada ou agente será reprocessado
      window.location.reload();
    }
  };

  const handleRedo = () => {
    if (confirm("Tem certeza? O agente será executado novamente do zero.")) {
      requestRegeneration(agentId, "Refazer do zero conforme solicitado");
      onOpenChange(false);
      window.location.reload();
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
            {/* Status Badge */}
            {hasRealContent ? (
              <div className="flex items-center gap-2 flex-wrap">
                {isApproved ? (
                  <Badge variant="success" size="sm">
                    ✓ Aprovado
                  </Badge>
                ) : (
                  <Badge variant="warning" size="sm">
                    Aguardando Aprovação
                  </Badge>
                )}
                <Badge variant="info" size="sm">
                  Gerado com IA
                </Badge>
                {agentResult.tokensUsed && (
                  <Badge variant="default" size="sm">
                    {agentResult.tokensUsed.toLocaleString("pt-BR")} tokens
                  </Badge>
                )}
                {agentResult.cost && (
                  <Badge variant="default" size="sm">
                    ${agentResult.cost.toFixed(4)}
                  </Badge>
                )}
              </div>
            ) : (
              <Badge variant="warning" size="sm">
                Dados mockados (sem conexão com API)
              </Badge>
            )}

            {/* Conteúdo Real do Agente */}
            <div className="p-4 bg-[rgb(var(--background-secondary))] rounded-lg border border-[rgb(var(--border))]">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-5 w-5 text-[rgb(var(--primary))]" />
                <h3 className="font-bold text-lg">{agentName}</h3>
              </div>
              <div className="prose prose-sm max-w-none text-[rgb(var(--foreground-secondary))]">
                {hasRealContent ? (
                  <pre className="whitespace-pre-wrap font-sans text-sm">
                    {agentResult.content}
                  </pre>
                ) : (
                  <p className="text-[rgb(var(--foreground-secondary))] italic">
                    Nenhum conteúdo gerado ainda. Execute o agente para ver os resultados reais da IA.
                  </p>
                )}
              </div>
            </div>

            {/* Ações com o Conteúdo */}
            {hasRealContent && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => copyToClipboard(agentResult.content)}
                >
                  <Copy className="h-4 w-4" />
                  Copiar Conteúdo
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    const blob = new Blob([agentResult.content], { type: "text/plain" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `${agentId}-${new Date().toISOString().split("T")[0]}.txt`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                >
                  <Download className="h-4 w-4" />
                  Baixar TXT
                </Button>
              </div>
            )}

            {/* Avaliação do Cliente */}
            {hasRealContent && (
              <div className="p-4 bg-gradient-to-r from-[rgb(var(--primary))]/10 to-[rgb(var(--secondary))]/10 rounded-lg border border-[rgb(var(--primary))]/20">
                {isApproved ? (
                  <div className="text-center py-4">
                    <div className="w-12 h-12 rounded-full bg-[rgb(var(--success))]/20 flex items-center justify-center mx-auto mb-3">
                      <ThumbsUp className="h-6 w-6 text-[rgb(var(--success))]" />
                    </div>
                    <h3 className="font-bold mb-2 text-[rgb(var(--success))]">Agente Aprovado!</h3>
                    <p className="text-sm text-[rgb(var(--foreground-secondary))]">
                      Este resultado foi aprovado e está pronto para uso.
                    </p>
                  </div>
                ) : (
                  <>
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
                          placeholder="Ex: Adicionar que sempre uso metáforas de esportes, falar mais sobre cases reais..."
                          rows={4}
                        />
                        <div className="flex gap-2">
                          <Button onClick={handleFeedback} className="flex-1" disabled={!feedback.trim()}>
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
                  </>
                )}
              </div>
            )}

            {/* Informações Adicionais */}
            {hasRealContent && agentResult.timestamp && (
              <div className="text-xs text-[rgb(var(--foreground-secondary))]">
                Gerado em: {new Date(agentResult.timestamp).toLocaleString("pt-BR")}
              </div>
            )}
          </div>
        </DialogBody>

        <DialogFooter>
          <Button variant="default" size="md" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
