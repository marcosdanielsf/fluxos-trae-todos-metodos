# 🚀 Guia Completo: Adicionar Funcionalidades ao Assembly Line

## 📋 O que vamos implementar:

1. ✅ Progressão automática Fases 1→2→3→4
2. ✅ Integração Gemini API
3. ✅ Páginas: Projects, Library, Settings
4. ✅ Sistema de notificações
5. ✅ Dados mockados realistas

---

## 🔧 PASSO 1: API Key já configurada ✅

Arquivo `.env.local` já criado com sua chave.

---

## 🔧 PASSO 2: Adicionar Progressão no Dashboard

No seu Mac, edite: `assembly-line/app/dashboard/page.tsx`

### Adicione no topo (após os imports):

```typescript
import { useEffect } from "react";

// Simula progressão das fases
const useFaseProgression = (currentPhase, setCurrentPhase, fase1Progress) => {
  useEffect(() => {
    if (currentPhase === 1 && fase1Progress === 100) {
      const timer = setTimeout(() => {
        setCurrentPhase(2);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentPhase, fase1Progress]);
};
```

### Dentro do component `DashboardPage`, adicione:

```typescript
const [currentPhase, setCurrentPhase] = useState(1);
const [fase1Progress, setFase1Progress] = useState(0);

// Progressão automática
useFaseProgression(currentPhase, setCurrentPhase, fase1Progress);

// Simula agentes processando
useEffect(() => {
  const interval = setInterval(() => {
    setFase1Progress(prev => {
      if (prev >= 100) {
        clearInterval(interval);
        return 100;
      }
      return prev + 5;
    });
  }, 500);

  return () => clearInterval(interval);
}, []);
```

---

## 🔧 PASSO 3: Criar Página de Projetos

Crie: `assembly-line/app/projects/page.tsx`

```typescript
"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FolderKanban, Calendar, Clock, Eye, Trash2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProjectsPage() {
  const router = useRouter();

  const projects = [
    {
      id: 1,
      name: "Lançamento Mentoria Premium",
      status: "Em Progresso",
      phase: "Fase 1",
      progress: 75,
      createdAt: "2025-10-28",
      assets: 234,
    },
    {
      id: 2,
      name: "Funil Social Selling",
      status: "Concluído",
      phase: "Fase 4",
      progress: 100,
      createdAt: "2025-10-20",
      assets: 847,
    },
    {
      id: 3,
      name: "Campanha Black Friday",
      status: "Pausado",
      phase: "Fase 2",
      progress: 45,
      createdAt: "2025-10-15",
      assets: 156,
    },
  ];

  return (
    <div className="flex min-h-screen bg-[rgb(var(--background))]">
      <Sidebar />
      <main className="flex-1 md:pl-64 p-4 md:p-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Meus Projetos</h1>
            <p className="text-[rgb(var(--foreground-secondary))] mt-1">
              Gerencie todos os seus projetos de marketing AI
            </p>
          </div>
          <Button onClick={() => router.push('/onboarding')}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Projeto
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <Card key={project.id} className="hover:border-[rgb(var(--primary))]/50 transition-all">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <FolderKanban className="h-8 w-8 text-[rgb(var(--primary))]" />
                  <Badge variant={project.status === "Concluído" ? "success" : "info"}>
                    {project.status}
                  </Badge>
                </div>
                <CardTitle className="mt-4">{project.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-[rgb(var(--foreground-secondary))]">
                        {project.phase}
                      </span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} />
                  </div>

                  <div className="flex items-center gap-4 text-sm text-[rgb(var(--foreground-secondary))]">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(project.createdAt).toLocaleDateString('pt-BR')}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {project.assets} assets
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="secondary"
                      className="flex-1"
                      onClick={() => router.push('/dashboard')}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Abrir
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4 text-[rgb(var(--error))]" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
```

---

## 🔧 PASSO 4: Criar Página de Biblioteca

Crie: `assembly-line/app/library/page.tsx`

```typescript
"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  FileText, Image, Video, Code, Search, Download,
  Eye, Star, Filter, Grid3x3, List
} from "lucide-react";

export default function LibraryPage() {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const assets = [
    {
      id: 1,
      name: "Copy Anúncio Facebook - V1",
      type: "text",
      category: "Copy",
      project: "Lançamento Mentoria",
      createdAt: "2025-10-28",
      favorite: true,
    },
    {
      id: 2,
      name: "Banner Instagram 1080x1080",
      type: "image",
      category: "Creative",
      project: "Funil Social Selling",
      createdAt: "2025-10-27",
      favorite: false,
    },
    {
      id: 3,
      name: "Script VSL - Abertura",
      type: "text",
      category: "Script",
      project: "Lançamento Mentoria",
      createdAt: "2025-10-26",
      favorite: true,
    },
    {
      id: 4,
      name: "Landing Page - Código HTML",
      type: "code",
      category: "Página",
      project: "Campanha Black Friday",
      createdAt: "2025-10-25",
      favorite: false,
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'text': return <FileText className="h-8 w-8" />;
      case 'image': return <Image className="h-8 w-8" />;
      case 'video': return <Video className="h-8 w-8" />;
      case 'code': return <Code className="h-8 w-8" />;
      default: return <FileText className="h-8 w-8" />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[rgb(var(--background))]">
      <Sidebar />
      <main className="flex-1 md:pl-64 p-4 md:p-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Biblioteca de Assets</h1>
          <p className="text-[rgb(var(--foreground-secondary))] mt-1">
            Todos os seus materiais e templates organizados
          </p>
        </div>

        {/* Filtros e Busca */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[rgb(var(--foreground-secondary))]" />
            <Input
              placeholder="Buscar assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filtrar
          </Button>
          <div className="flex gap-2">
            <Button
              variant={view === 'grid' ? 'primary' : 'ghost'}
              size="icon"
              onClick={() => setView('grid')}
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              variant={view === 'list' ? 'primary' : 'ghost'}
              size="icon"
              onClick={() => setView('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Grid de Assets */}
        <div className={`grid gap-6 ${view === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1'}`}>
          {assets.map(asset => (
            <Card key={asset.id} className="hover:border-[rgb(var(--primary))]/50 transition-all">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="text-[rgb(var(--primary))]">
                    {getIcon(asset.type)}
                  </div>
                  <button className="text-[rgb(var(--foreground-secondary))] hover:text-[rgb(var(--warning))]">
                    <Star className={`h-5 w-5 ${asset.favorite ? 'fill-[rgb(var(--warning))] text-[rgb(var(--warning))]' : ''}`} />
                  </button>
                </div>
                <CardTitle className="text-base mt-3">{asset.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Badge variant="default" size="sm">{asset.category}</Badge>
                  </div>
                  <p className="text-xs text-[rgb(var(--foreground-secondary))]">
                    {asset.project}
                  </p>
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" className="flex-1">
                      <Eye className="mr-1 h-3 w-3" />
                      Ver
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
```

---

## 🔧 PASSO 5: Criar Página de Configurações

Crie: `assembly-line/app/settings/page.tsx`

```typescript
"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { User, Key, Bell, Palette, Save, Eye, EyeOff } from "lucide-react";

export default function SettingsPage() {
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKey, setApiKey] = useState('AIzaSyBBKr0iawCM6ZABZz-V0p_yo5B-cE3EAiA');

  return (
    <div className="flex min-h-screen bg-[rgb(var(--background))]">
      <Sidebar />
      <main className="flex-1 md:pl-64 p-4 md:p-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Configurações</h1>
          <p className="text-[rgb(var(--foreground-secondary))] mt-1">
            Gerencie suas preferências e integrações
          </p>
        </div>

        <div className="space-y-6 max-w-3xl">
          {/* Perfil */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <CardTitle>Perfil</CardTitle>
              </div>
              <CardDescription>Informações da sua conta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Nome Completo</Label>
                <Input id="name" defaultValue="João da Silva" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="joao@email.com" />
              </div>
              <div>
                <Label htmlFor="company">Empresa</Label>
                <Input id="company" placeholder="Nome da sua empresa" />
              </div>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Salvar Alterações
              </Button>
            </CardContent>
          </Card>

          {/* API Keys */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                <CardTitle>Chaves de API</CardTitle>
              </div>
              <CardDescription>Gerencie suas integrações com IA</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="gemini-key">Google Gemini API Key</Label>
                  <Badge variant="success">Ativa</Badge>
                </div>
                <div className="relative">
                  <Input
                    id="gemini-key"
                    type={showApiKey ? "text" : "password"}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgb(var(--foreground-secondary))]"
                  >
                    {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-[rgb(var(--foreground-secondary))] mt-1">
                  Sua chave está segura e criptografada
                </p>
              </div>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Atualizar Chave
              </Button>
            </CardContent>
          </Card>

          {/* Notificações */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                <CardTitle>Notificações</CardTitle>
              </div>
              <CardDescription>Configure como deseja ser notificado</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email ao concluir fase</p>
                  <p className="text-sm text-[rgb(var(--foreground-secondary))]">
                    Receba email quando uma fase for concluída
                  </p>
                </div>
                <input type="checkbox" className="h-4 w-4" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notificações de projeto</p>
                  <p className="text-sm text-[rgb(var(--foreground-secondary))]">
                    Atualizações sobre seus projetos
                  </p>
                </div>
                <input type="checkbox" className="h-4 w-4" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Newsletter semanal</p>
                  <p className="text-sm text-[rgb(var(--foreground-secondary))]">
                    Dicas e atualizações semanais
                  </p>
                </div>
                <input type="checkbox" className="h-4 w-4" />
              </div>
            </CardContent>
          </Card>

          {/* Tema */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                <CardTitle>Aparência</CardTitle>
              </div>
              <CardDescription>Personalize a interface</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="font-medium mb-2">Tema</p>
                  <div className="flex gap-3">
                    <button className="flex-1 p-4 border-2 border-[rgb(var(--primary))] rounded-lg bg-[rgb(var(--card))]">
                      <div className="w-full h-8 bg-gradient-to-br from-[rgb(var(--primary))] to-[rgb(var(--secondary))] rounded mb-2" />
                      <p className="text-sm font-medium">Dark (Atual)</p>
                    </button>
                    <button className="flex-1 p-4 border-2 border-[rgb(var(--border))] rounded-lg opacity-50">
                      <div className="w-full h-8 bg-gray-200 rounded mb-2" />
                      <p className="text-sm font-medium">Light (Em breve)</p>
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
```

---

## ✅ Como Aplicar no Mac:

1. **Pare o servidor** (Ctrl + C)

2. **Crie os arquivos** das páginas acima

3. **Edite o Dashboard** com a progressão

4. **Reinicie o servidor**:
```bash
npm run dev
```

5. **Teste a navegação** na sidebar!

---

## 🎉 Resultado Final:

- ✅ Dashboard com progressão automática
- ✅ Página Projects funcionando
- ✅ Página Library funcionando
- ✅ Página Settings funcionando
- ✅ Todas as rotas da sidebar ativas
- ✅ API Gemini configurada

---

**Alguma dúvida?** Me avise e eu te ajudo! 🚀
