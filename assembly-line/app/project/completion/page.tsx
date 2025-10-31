"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Trophy,
  Clock,
  FileText,
  RotateCcw,
  Star,
  Download,
  Mail,
  Plus,
  Dna,
  Users,
  Compass,
  Type,
  Video,
  Image as ImageIcon,
  Globe,
  Workflow,
  Eye,
} from "lucide-react";
import { useEffect, useState } from "react";

interface Stat {
  icon: any;
  label: string;
  value: string;
}

interface Asset {
  id: string;
  icon: any;
  title: string;
  description: string;
  count: string;
}

export default function ProjectCompletionPage() {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Simular efeito de confete
    setTimeout(() => setShowConfetti(false), 5000);
  }, []);

  const stats: Stat[] = [
    {
      icon: Clock,
      label: "Tempo de execução",
      value: "38min",
    },
    {
      icon: FileText,
      label: "Assets criados",
      value: "847",
    },
    {
      icon: RotateCcw,
      label: "Feedbacks aplicados",
      value: "12",
    },
    {
      icon: Star,
      label: "Satisfação",
      value: "5/5",
    },
  ];

  const assets: Asset[] = [
    {
      id: "clone",
      icon: Dna,
      title: "Clone do Especialista",
      description: "System prompt completo + documento de voz",
      count: "1 arquivo",
    },
    {
      id: "avatars",
      icon: Users,
      title: "5 Avatares Psicológicos",
      description: "Perfis completos dos seus clientes ideais",
      count: "5 arquivos",
    },
    {
      id: "positioning",
      icon: Compass,
      title: "Posicionamento Estratégico P1-P4",
      description: "Framework completo de posicionamento",
      count: "1 arquivo",
    },
    {
      id: "copies",
      icon: Type,
      title: "500 Variações de Copy",
      description: "Headlines, CTAs e textos persuasivos",
      count: "500 variações",
    },
    {
      id: "scripts",
      icon: Video,
      title: "50 Scripts de VSL",
      description: "Scripts completos para vídeos de vendas",
      count: "50 scripts",
    },
    {
      id: "creatives",
      icon: ImageIcon,
      title: "200 Criativos para Ads",
      description: "Conceitos visuais e textos para anúncios",
      count: "200 assets",
    },
    {
      id: "landing",
      icon: Globe,
      title: "Páginas de Captura",
      description: "Landing pages otimizadas para conversão",
      count: "3 páginas",
    },
    {
      id: "funnel",
      icon: Workflow,
      title: "Funil Completo",
      description: "Estrutura end-to-end do funil de vendas",
      count: "1 funil",
    },
  ];

  return (
    <div className="flex min-h-screen bg-[rgb(var(--background))]">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-8 max-w-7xl mx-auto">
          {/* Header Celebratório */}
          <div className="text-center mb-12 relative">
            {showConfetti && (
              <div className="absolute inset-0 pointer-events-none">
                {/* Confete simples com CSS */}
                <div className="confetti-container">
                  {Array.from({ length: 50 }).map((_, i) => (
                    <div
                      key={i}
                      className="confetti"
                      style={{
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 3}s`,
                        backgroundColor: `hsl(${Math.random() * 360}, 70%, 60%)`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div className="inline-flex items-center justify-center w-24 h-24 mb-6 bg-gradient-to-br from-[rgb(var(--primary))] to-[rgb(var(--secondary))] rounded-full animate-bounce">
              <Trophy className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))] bg-clip-text text-transparent">
              Projeto Concluído com Sucesso!
            </h1>
            <p className="text-xl text-[rgb(var(--foreground-secondary))]">
              Seu Assembly Line gerou{" "}
              <span className="text-[rgb(var(--primary))] font-bold">847 assets</span> em{" "}
              <span className="text-[rgb(var(--primary))] font-bold">38 minutos</span>
            </p>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label} className="text-center">
                  <CardContent className="pt-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 mb-3 bg-gradient-to-br from-[rgb(var(--primary))] to-[rgb(var(--secondary))] rounded-lg">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <p className="text-3xl font-bold mb-1">{stat.value}</p>
                    <p className="text-sm text-[rgb(var(--foreground-secondary))]">
                      {stat.label}
                    </p>
                    {stat.label === "Satisfação" && (
                      <div className="flex justify-center gap-1 mt-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 fill-[rgb(var(--warning))] text-[rgb(var(--warning))]"
                          />
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Ações Principais */}
          <Card className="mb-12 border-2 border-[rgb(var(--primary))]/20">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold mb-1">Baixe todos os seus materiais</h3>
                  <p className="text-sm text-[rgb(var(--foreground-secondary))]">
                    Todos os assets prontos para uso em um único arquivo
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button size="lg" className="gap-2">
                    <Download className="h-5 w-5" />
                    Baixar Tudo (.zip)
                  </Button>
                  <Button size="lg" variant="secondary" className="gap-2">
                    <FileText className="h-5 w-5" />
                    Relatório PDF
                  </Button>
                  <Button size="lg" variant="outline" className="gap-2">
                    <Mail className="h-5 w-5" />
                    Enviar por Email
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Seus Entregáveis */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Seus Entregáveis</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {assets.map((asset) => {
                const Icon = asset.icon;
                return (
                  <Card
                    key={asset.id}
                    className="hover:border-[rgb(var(--primary))]/50 transition-all hover:shadow-lg group"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between mb-3">
                        <div className="p-3 bg-gradient-to-br from-[rgb(var(--primary))] to-[rgb(var(--secondary))] rounded-lg">
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 hover:bg-[rgb(var(--card))] rounded-lg">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="p-2 hover:bg-[rgb(var(--card))] rounded-lg">
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <CardTitle className="text-lg">{asset.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-[rgb(var(--foreground-secondary))] mb-3">
                        {asset.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[rgb(var(--foreground-secondary))]">
                          {asset.count}
                        </span>
                        <Button variant="ghost" size="sm">
                          Visualizar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Próximos Passos */}
          <Card className="bg-gradient-to-r from-[rgb(var(--primary))]/10 to-[rgb(var(--secondary))]/10 border-2 border-[rgb(var(--primary))]/20">
            <CardHeader>
              <CardTitle className="text-xl">Próximos Passos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <Button variant="outline" size="lg" className="h-auto py-4 justify-start">
                  <Plus className="h-5 w-5 mr-2" />
                  <div className="text-left">
                    <p className="font-bold">Criar Novo Projeto</p>
                    <p className="text-xs text-[rgb(var(--foreground-secondary))] font-normal">
                      Comece outro funil de vendas
                    </p>
                  </div>
                </Button>
                <Button variant="outline" size="lg" className="h-auto py-4 justify-start">
                  <FileText className="h-5 w-5 mr-2" />
                  <div className="text-left">
                    <p className="font-bold">Ver Todos os Projetos</p>
                    <p className="text-xs text-[rgb(var(--foreground-secondary))] font-normal">
                      Acesse seu histórico completo
                    </p>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <style jsx>{`
        .confetti-container {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow: hidden;
        }

        .confetti {
          position: absolute;
          width: 10px;
          height: 10px;
          top: -10px;
          animation: fall 3s linear infinite;
        }

        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
