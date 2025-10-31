import { geminiService } from "./gemini";
import { OnboardingData } from "@/contexts/ProjectContext";

export interface ProcessedAgentResult {
  content: string;
  tokensUsed: number;
  cost: number;
}

/**
 * Processa um agente específico chamando o método correto do Gemini
 */
export async function processAgent(
  agentId: string,
  onboardingData: OnboardingData
): Promise<ProcessedAgentResult> {
  console.log(`🤖 Processando agente: ${agentId}`);

  let content: string;
  let tokensUsed: number;

  try {
    // FASE 1: CLONAGEM DE IDENTIDADE
    if (agentId === "dna-extractor") {
      content = await geminiService.extractDNA({
        fullName: onboardingData.fullName,
        niche: onboardingData.niche,
        yearsOfExperience: onboardingData.yearsOfExperience,
        description: onboardingData.description,
      });
      tokensUsed = estimateTokens(content);
    } else if (agentId === "reverse-engineer") {
      content = await geminiService.reverseEngineerStrategy({
        niche: onboardingData.niche,
        yearsOfExperience: onboardingData.yearsOfExperience,
        description: onboardingData.description,
      });
      tokensUsed = estimateTokens(content);
    } else if (agentId === "clone-configurator") {
      content = await geminiService.configureClone({
        fullName: onboardingData.fullName,
        niche: onboardingData.niche,
        description: onboardingData.description,
      });
      tokensUsed = estimateTokens(content);
    } else if (agentId === "expert-emulator") {
      content = await geminiService.emulateExpert({
        fullName: onboardingData.fullName,
        niche: onboardingData.niche,
        description: onboardingData.description,
      });
      tokensUsed = estimateTokens(content);
    }

    // FASE 2: INTELIGÊNCIA DE MERCADO
    else if (agentId === "behavioral-psychologist") {
      content = await geminiService.analyzeBehavior({
        clientName: onboardingData.clientName,
        clientPain: onboardingData.clientPain,
        clientDesire: onboardingData.clientDesire,
      });
      tokensUsed = estimateTokens(content);
    } else if (agentId === "capivara-intelligence") {
      content = await geminiService.gatherMarketIntelligence({
        niche: onboardingData.niche,
        clientPain: onboardingData.clientPain,
      });
      tokensUsed = estimateTokens(content);
    } else if (agentId === "market-analyzer") {
      content = await geminiService.analyzeMarket({
        niche: onboardingData.niche,
        offerName: onboardingData.offerName,
        offerPrice: onboardingData.offerPrice,
      });
      tokensUsed = estimateTokens(content);
    }

    // FASE 3: CRIAÇÃO DE CONTEÚDO
    else if (agentId === "copy-generator") {
      content = await geminiService.generateCopy({
        offerName: onboardingData.offerName,
        offerDescription: onboardingData.offerDescription,
        clientPain: onboardingData.clientPain,
        clientDesire: onboardingData.clientDesire,
      });
      tokensUsed = estimateTokens(content);
    } else if (agentId === "creative-designer") {
      content = await geminiService.generateCreativeBrief({
        offerName: onboardingData.offerName,
        niche: onboardingData.niche,
        clientDesire: onboardingData.clientDesire,
      });
      tokensUsed = estimateTokens(content);
    } else if (agentId === "story-writer") {
      content = await geminiService.generateStories({
        fullName: onboardingData.fullName,
        offerName: onboardingData.offerName,
        clientDesire: onboardingData.clientDesire,
      });
      tokensUsed = estimateTokens(content);
    }

    // FASE 4: ESTRUTURA DE FUNIL
    else if (agentId === "funnel-architect") {
      content = await geminiService.architectFunnel({
        funnelType: onboardingData.funnelType,
        offerName: onboardingData.offerName,
        offerPrice: onboardingData.offerPrice,
      });
      tokensUsed = estimateTokens(content);
    } else if (agentId === "conversion-optimizer") {
      content = await geminiService.optimizeConversion({
        funnelType: onboardingData.funnelType,
        offerPrice: onboardingData.offerPrice,
      });
      tokensUsed = estimateTokens(content);
    } else if (agentId === "automation-builder") {
      content = await geminiService.buildAutomations({
        offerName: onboardingData.offerName,
        funnelType: onboardingData.funnelType,
      });
      tokensUsed = estimateTokens(content);
    }

    // Fallback para agentes desconhecidos
    else {
      console.warn(`⚠️ Agente desconhecido: ${agentId}, usando conteúdo mockado`);
      content = generateMockContent(agentId, onboardingData);
      tokensUsed = Math.floor(Math.random() * 3000 + 2000);
    }

    // Calcula custo (Gemini Pro: $0.001 per 1K tokens)
    const cost = (tokensUsed / 1000) * 0.001;

    console.log(
      `✅ Agente ${agentId} processado: ${tokensUsed} tokens, $${cost.toFixed(4)}`
    );

    return {
      content,
      tokensUsed,
      cost,
    };
  } catch (error) {
    console.error(`❌ Erro ao processar agente ${agentId}:`, error);

    // Em caso de erro, retorna conteúdo mockado
    content = generateMockContent(agentId, onboardingData);
    tokensUsed = Math.floor(Math.random() * 3000 + 2000);
    const cost = (tokensUsed / 1000) * 0.001;

    return {
      content,
      tokensUsed,
      cost,
    };
  }
}

/**
 * Estima tokens baseado no comprimento do conteúdo
 * (aproximadamente 4 caracteres por token)
 */
function estimateTokens(content: string): number {
  return Math.floor(content.length / 4);
}

/**
 * Gera conteúdo mockado caso a API falhe ou agente não seja reconhecido
 */
function generateMockContent(
  agentId: string,
  onboardingData: OnboardingData
): string {
  const { fullName, niche, clientName, offerName } = onboardingData;

  const mockContent: Record<string, string> = {
    "dna-extractor": `DNA do Especialista Extraído para ${fullName}

• Tom de Voz: Inspirador + Direto
• Valores Core: Autenticidade, Resultado, Transparência
• História Central: Transformando vidas no nicho de ${niche} há anos
• Linguagem Característica: Brasileira, casual, usa termos do nicho
• Diferencial Único: Abordagem prática e focada em resultados`,

    "reverse-engineer": `Engenharia Reversa - ${niche}

• Padrões de Sucesso: Conteúdo educativo, Prova social, Urgência controlada
• Estratégias Core: Funil de valor primeiro, Autoridade antes de venda
• Hooks Efetivos: "Você já percebeu que...", "O segredo que ninguém conta", "3 erros que..."
• Gatilhos Mentais: Escassez, Reciprocidade, Prova Social`,

    "clone-configurator": `Configuração do Clone Digital - ${fullName}

• Persona da Marca: Especialista acessível que compartilha conhecimento real e prático do nicho ${niche}
• Estilo de Conteúdo: Stories educativos + posts de autoridade + CTAs diretos
• Tom Específico: Conversacional mas profissional, usa analogias do dia a dia
• Palavras-Chave Recorrentes: resultado, transformação, prático, ação, real, método
• Formato de Stories: Gancho → Conteúdo → CTA`,

    // ... adicione mais conforme necessário
  };

  return (
    mockContent[agentId] ||
    `Resultado gerado para ${agentId}\n\nBaseado nos dados de ${fullName} no nicho ${niche}, atendendo ${clientName} com a oferta ${offerName}.`
  );
}
