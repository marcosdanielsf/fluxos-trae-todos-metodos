"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { StatsSection } from "@/components/sections/StatsSection";
import { VisualWorkflowExplorer } from "@/components/workflow/VisualWorkflowExplorer";
import { useRouter } from "next/navigation";
import { Sparkles, Zap, Target, ArrowRight } from "lucide-react";

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[rgb(var(--background))] bg-grid overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative py-24 px-6">
        {/* Background gradient */}
        <div className="absolute inset-0 gradient-hero opacity-10"></div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgb(var(--primary))]/10 border border-[rgb(var(--primary))]/20 glow-blue"
            >
              <Sparkles className="w-4 h-4 text-[rgb(var(--primary))]" />
              <span className="text-sm font-medium text-[rgb(var(--primary))]">
                Powered by Gemini 2.0 Flash
              </span>
            </motion.div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-bold">
              <span className="gradient-text">Assembly Line</span>
              <br />
              <span className="text-[rgb(var(--foreground))]">
                Marketing de IA em Escala
              </span>
            </h1>

            {/* Description */}
            <p className="text-xl md:text-2xl text-[rgb(var(--foreground-secondary))] max-w-3xl mx-auto">
              Transforme sua identidade de marca em campanhas completas de marketing usando nossa linha de produção de IA com 13 agentes especializados.
            </p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap items-center justify-center gap-4 pt-4"
            >
              <Button
                variant="gradient"
                size="lg"
                onClick={() => router.push("/onboarding")}
                icon={<Zap className="w-5 h-5" />}
                className="text-lg px-8"
              >
                Começar Agora
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => router.push("/auth/login")}
                className="text-lg px-8"
              >
                Fazer Login
              </Button>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 max-w-4xl mx-auto"
            >
              <div className="flex items-center gap-3 p-4 rounded-lg bg-[rgb(var(--card))]/50 border border-[rgb(var(--border))]">
                <div className="w-10 h-10 rounded-lg bg-[rgb(var(--phase1))]/20 flex items-center justify-center">
                  <Target className="w-5 h-5 text-[rgb(var(--phase1))]" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-[rgb(var(--foreground))]">Clonagem de DNA</div>
                  <div className="text-sm text-[rgb(var(--foreground-secondary))]">
                    Identidade Única
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-lg bg-[rgb(var(--card))]/50 border border-[rgb(var(--border))]">
                <div className="w-10 h-10 rounded-lg bg-[rgb(var(--phase2))]/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-[rgb(var(--phase2))]" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-[rgb(var(--foreground))]">13 Agentes IA</div>
                  <div className="text-sm text-[rgb(var(--foreground-secondary))]">
                    Trabalho Paralelo
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-lg bg-[rgb(var(--card))]/50 border border-[rgb(var(--border))]">
                <div className="w-10 h-10 rounded-lg bg-[rgb(var(--phase3))]/20 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-[rgb(var(--phase3))]" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-[rgb(var(--foreground))]">35 Minutos</div>
                  <div className="text-sm text-[rgb(var(--foreground-secondary))]">
                    Campanha Completa
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* Visual Workflow Explorer */}
      <VisualWorkflowExplorer />

      {/* Final CTA */}
      <section className="py-24 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="p-12 rounded-2xl gradient-card border border-[rgb(var(--primary))]/20 glow-blue-strong space-y-6">
            <h2 className="text-4xl font-bold gradient-text">
              Pronto para Escalar seu Marketing?
            </h2>
            <p className="text-lg text-[rgb(var(--foreground-secondary))]">
              Junte-se a centenas de especialistas que já estão usando a Assembly Line para criar campanhas de marketing em minutos, não meses.
            </p>
            <Button
              variant="gradient"
              size="lg"
              onClick={() => router.push("/onboarding")}
              className="text-lg px-12"
            >
              Começar Gratuitamente
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
