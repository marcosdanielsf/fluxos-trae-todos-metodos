"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ClearDataPage() {
  const [cleared, setCleared] = useState(false);
  const router = useRouter();

  const clearAllData = () => {
    if (typeof window !== "undefined") {
      // Clear all localStorage
      localStorage.clear();
      setCleared(true);
      console.log("✅ Todos os dados foram limpos!");
    }
  };

  const goToOnboarding = () => {
    router.push("/onboarding");
  };

  return (
    <div className="min-h-screen bg-[rgb(var(--background))] flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="space-y-3">
          <h1 className="text-3xl font-bold">Limpar Dados do Sistema</h1>
          <p className="text-[rgb(var(--foreground-secondary))]">
            Esta ação irá remover todos os dados salvos localmente incluindo:
          </p>
          <ul className="text-sm text-[rgb(var(--foreground-secondary))] text-left space-y-1 bg-[rgb(var(--card))] p-4 rounded-lg">
            <li>• Dados do onboarding</li>
            <li>• Resultados dos agentes</li>
            <li>• ID do projeto</li>
            <li>• Todas as aprovações e feedbacks</li>
          </ul>
        </div>

        {!cleared ? (
          <div className="space-y-3">
            <Button
              onClick={clearAllData}
              variant="destructive"
              className="w-full"
              size="lg"
            >
              Limpar Todos os Dados
            </Button>
            <p className="text-xs text-[rgb(var(--foreground-secondary))]">
              ⚠️ Esta ação não pode ser desfeita
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-[rgb(var(--success))]/10 border border-[rgb(var(--success))]/30 rounded-lg">
              <p className="text-[rgb(var(--success))] font-semibold">
                ✓ Dados limpos com sucesso!
              </p>
              <p className="text-sm text-[rgb(var(--foreground-secondary))] mt-2">
                Você pode começar um novo projeto agora.
              </p>
            </div>
            <Button
              onClick={goToOnboarding}
              variant="default"
              className="w-full"
              size="lg"
            >
              Ir para Onboarding
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
