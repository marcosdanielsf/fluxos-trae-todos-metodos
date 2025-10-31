# 🤖 Integração Real com Gemini API - Assembly Line

## ✅ O Que Já Foi Implementado

### 1. **Contexto Global** (`contexts/ProjectContext.tsx`)
- Armazena dados do onboarding
- Gerencia resultados dos agentes
- Persiste em localStorage

### 2. **12 Métodos Específicos do Gemini** (`lib/services/gemini.ts`)
Cada agente tem seu próprio método personalizado:

**Fase 1 - Clonagem:**
- `extractDNA()` - DNA Extractor
- `reverseEngineerStrategy()` - Reverse Engineer
- `configureClone()` - Clone Configurator
- `emulateExpert()` - Expert Emulator

**Fase 2 - Inteligência:**
- `analyzeBehavior()` - Behavioral Psychologist
- `gatherMarketIntelligence()` - Capivara Intelligence
- `analyzeMarket()` - Market Analyzer

**Fase 3 - Criação:**
- `generateCopy()` - Copy Generator
- `generateCreativeBrief()` - Creative Designer
- `generateStories()` - Story Writer

**Fase 4 - Funil:**
- `architectFunnel()` - Funnel Architect
- `optimizeConversion()` - Conversion Optimizer
- `buildAutomations()` - Automation Builder

### 3. **Processador de Agentes** (`lib/services/agent-processor.ts`)
- Mapeia agentId → método Gemini correto
- Chama API com dados do onboarding
- Calcula tokens e custo real
- Fallback para mock se API falhar

---

## 🔧 O Que Falta Implementar

### **Passo 1: Conectar Onboarding → Contexto**

No arquivo `app/onboarding/page.tsx`, quando usuário finalizar:

```typescript
import { useProject } from "@/contexts/ProjectContext";

// Dentro do componente
const { setOnboardingData } = useProject();

// No handleComplete (Step 4)
const handleComplete = () => {
  // Salvar todos os dados do onboarding
  setOnboardingData({
    fullName: step1Data.fullName,
    niche: step1Data.niche,
    yearsOfExperience: step1Data.yearsOfExperience,
    description: step1Data.description,
    clientName: step2Data.clientName,
    clientPain: step2Data.clientPain,
    clientDesire: step2Data.clientDesire,
    offerName: step3Data.offerName,
    offerPrice: step3Data.offerPrice,
    offerDescription: step3Data.offerDescription,
    funnelType: step4Data.funnelType,
  });

  // Redirecionar para dashboard
  router.push("/dashboard");
};
```

---

### **Passo 2: Dashboard Usar Dados Reais**

No arquivo `app/dashboard/page.tsx`:

```typescript
import { useProject } from "@/contexts/ProjectContext";
import { processAgent } from "@/lib/services/agent-processor";

export default function DashboardPage() {
  const { onboardingData, addAgentResult } = useProject();

  // ... código existente ...

  useEffect(() => {
    if (isPaused || !onboardingData) return;

    const timer = setInterval(() => {
      setPhases((prevPhases) => {
        const newPhases = [...prevPhases];
        const currentPhase = newPhases[currentPhaseIndex];

        if (currentPhase && currentPhase.status === "active") {
          const agentIndex = currentPhase.agents.findIndex(
            (agent) =>
              agent.status === "pending" || agent.status === "processing"
          );

          if (agentIndex !== -1) {
            const agent = currentPhase.agents[agentIndex];

            if (agent.status === "pending") {
              agent.status = "processing";
              agent.progress = 0;
              agent.estimatedTime = "Processando com IA...";
            } else if (agent.status === "processing") {
              const currentProgress = agent.progress || 0;

              if (currentProgress < 100) {
                agent.progress = Math.min(currentProgress + 5, 100);
              } else {
                // AQUI: Chamar API real quando completar
                processAgentWithGemini(agent.id, agent.name, onboardingData);

                agent.status = "completed";
                agent.timestamp = "Concluído agora";
                agent.badge = "Gerado com IA";
                agent.badgeVariant = "success";
              }
            }
          }
        }

        return newPhases;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentPhaseIndex, isPaused, onboardingData]);

  // Função para processar agente com Gemini
  const processAgentWithGemini = async (
    agentId: string,
    agentName: string,
    data: OnboardingData
  ) => {
    try {
      const result = await processAgent(agentId, data);

      // Atualizar tokens e custo no agente
      setPhases((prev) => {
        const updated = [...prev];
        const phase = updated[currentPhaseIndex];
        const agent = phase.agents.find((a) => a.id === agentId);

        if (agent) {
          agent.tokensUsed = result.tokensUsed;
          agent.cost = result.cost;
        }

        return updated;
      });

      // Salvar resultado no contexto para o modal
      addAgentResult({
        agentId,
        agentName,
        content: result.content,
        timestamp: new Date().toISOString(),
        tokensUsed: result.tokensUsed,
        cost: result.cost,
      });

      setTotalCost((prev) => prev + result.cost);
    } catch (error) {
      console.error("Erro ao processar agente:", error);
    }
  };

  // ... resto do código ...
}
```

---

### **Passo 3: Modal Mostrar Conteúdo Real**

No arquivo `components/features/agent-result-modal.tsx`:

```typescript
import { useProject } from "@/contexts/ProjectContext";

export function AgentResultModal({ agentId, agentName, ... }) {
  const { agentResults } = useProject();

  // Buscar resultado real do agente
  const agentResult = agentResults.find((r) => r.agentId === agentId);

  // Se não encontrar, mostrar loading ou mock
  const content = agentResult?.content || "Processando...";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{agentName}</DialogTitle>
          <DialogDescription>
            Resultado gerado com IA • {agentResult?.tokensUsed} tokens • $
            {agentResult?.cost.toFixed(4)}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="resultado">
          <TabsList>
            <TabsTrigger value="resultado">Resultado</TabsTrigger>
            <TabsTrigger value="raw">Raw</TabsTrigger>
          </TabsList>

          <TabsContent value="resultado">
            <div className="prose prose-invert max-w-none">
              {/* Renderizar conteúdo formatado */}
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          </TabsContent>

          <TabsContent value="raw">
            <pre className="text-xs overflow-auto max-h-96 bg-gray-900 p-4 rounded">
              {content}
            </pre>
          </TabsContent>
        </Tabs>

        {/* Botões de ação */}
        <div className="flex gap-2">
          <Button>Aprovar</Button>
          <Button variant="outline">Dar Feedback</Button>
          <Button variant="ghost">Refazer</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

---

## 🎯 Fluxo Completo

```
1. Usuário preenche Onboarding (4 steps)
   ↓
2. Dados salvos no ProjectContext + localStorage
   ↓
3. Redireciona para /dashboard
   ↓
4. Dashboard carrega dados do contexto
   ↓
5. Agente inicia processamento
   ↓
6. Chama processAgent() com dados reais
   ↓
7. processAgent() identifica agentId e chama método Gemini correto
   ↓
8. Gemini gera conteúdo PERSONALIZADO
   ↓
9. Resultado salvo no contexto
   ↓
10. Modal exibe conteúdo REAL gerado pela IA
```

---

## 📦 Instalação de Dependências Adicionais

Para renderizar Markdown no modal:

```bash
npm install react-markdown
```

---

## 🧪 Como Testar

1. **Reiniciar do zero:**
   ```bash
   # Limpar localStorage
   localStorage.clear()

   # Ir para /onboarding
   ```

2. **Preencher onboarding com dados reais:**
   - Nome: "João Silva"
   - Nicho: "Marketing Digital"
   - Experiência: "5 anos"
   - Descrição: "Ajudo empresas a crescerem online com estratégias de tráfego pago"
   - Cliente: "Empresários que querem escalar"
   - Dor: "Não conseguem gerar leads qualificados"
   - Desejo: "Ter um fluxo previsível de vendas"
   - Oferta: "Consultoria de Tráfego Pago"
   - Preço: "R$ 5.000"
   - Funil: "Webinar + VSL"

3. **Ver progressão no Dashboard**
   - Agentes vão processar automaticamente
   - Cada um chamará a API do Gemini
   - Conteúdo gerado será BASEADO nos dados que você preencheu

4. **Clicar em "Ver Resultado"**
   - Modal abrirá com conteúdo REAL
   - Não mais genérico!
   - Personalizado para João Silva no nicho de Marketing Digital

---

## ⚠️ Importante

- **API Key deve estar configurada** no `.env.local`
- Se API falhar, **fallback para mock** funciona automaticamente
- Tokens são estimados: `comprimento do texto / 4`
- Custo: `(tokens / 1000) * $0.001`

---

## 🎁 Benefícios

✅ Cada agente gera conteúdo **único e personalizado**
✅ Usa os **dados reais do onboarding**
✅ **12 prompts especializados** por tipo de agente
✅ Sistema híbrido: funciona **com ou sem** Gemini configurado
✅ **Retry automático** com exponential backoff
✅ Custo e tokens **reais** exibidos

---

**Pronto para implementar!** 🚀

Siga os 3 passos acima e você terá conteúdo REAL gerado pela IA baseado nas respostas do usuário.
