/**
 * Serviço para integração com Google Gemini API
 * Inclui retry com exponential backoff e tratamento de erros
 */

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
}

export interface GeminiRequest {
  systemPrompt: string;
  userQuery: string;
  temperature?: number;
  maxTokens?: number;
}

export class GeminiService {
  private apiKey: string;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
    if (!this.apiKey) {
      console.warn('⚠️ Gemini API Key não configurada');
    }
  }

  /**
   * Gera conteúdo com a API Gemini
   * Inclui retry automático com exponential backoff
   */
  async generateContent({
    systemPrompt,
    userQuery,
    temperature = 0.7,
    maxTokens = 2048,
  }: GeminiRequest): Promise<string> {
    if (!this.apiKey) {
      throw new Error('API Key do Gemini não configurada');
    }

    const url = `${this.baseUrl}?key=${this.apiKey}`;

    const payload = {
      contents: [{ parts: [{ text: userQuery }] }],
      systemInstruction: {
        parts: [{ text: systemPrompt }],
      },
      generationConfig: {
        temperature,
        topP: 1,
        topK: 1,
        maxOutputTokens: maxTokens,
      },
    };

    let lastError: Error | null = null;
    let delay = 1000; // Começa com 1 segundo

    // Tenta até 5 vezes com exponential backoff
    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        // Sucesso
        if (response.ok) {
          const result: GeminiResponse = await response.json();
          const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

          if (text) {
            return text;
          } else {
            throw new Error('Resposta da API vazia ou inválida');
          }
        }

        // Rate limit ou erro de servidor - tenta novamente
        if (response.status === 429 || response.status >= 500) {
          console.warn(`⚠️ Tentativa ${attempt + 1}/5: Status ${response.status}`);
          await this.sleep(delay);
          delay *= 2; // Dobra o tempo de espera
          continue;
        }

        // Erro do cliente - não tenta novamente
        const errorText = await response.text();
        throw new Error(`Erro ${response.status}: ${errorText}`);
      } catch (error) {
        lastError = error as Error;

        // Se não for a última tentativa, espera e tenta novamente
        if (attempt < 4) {
          console.warn(`⚠️ Erro na tentativa ${attempt + 1}/5:`, error);
          await this.sleep(delay);
          delay *= 2;
        }
      }
    }

    // Se chegou aqui, todas as tentativas falharam
    throw lastError || new Error('Falha ao gerar conteúdo após múltiplas tentativas');
  }

  /**
   * Gera variações de copy/texto
   */
  async generateCopyVariations(originalText: string, count: number = 3): Promise<string> {
    return this.generateContent({
      systemPrompt: 'Você é um copywriter de resposta direta, especialista em criar textos persuasivos e de alto impacto.',
      userQuery: `Gere ${count} variações criativas e persuasivas deste texto de marketing:\n\n"${originalText}"\n\nCada variação deve ter um ângulo diferente mas manter a mesma essência e promessa.`,
      temperature: 0.8,
    });
  }

  /**
   * Otimiza promessa de oferta
   */
  async optimizePromise(promise: string): Promise<string> {
    return this.generateContent({
      systemPrompt: 'Você é um especialista em posicionamento de ofertas e criação de promessas de alto impacto.',
      userQuery: `Otimize esta promessa de marketing tornando-a mais específica, clara e irresistível:\n\n"${promise}"\n\nGere 3 versões otimizadas com diferentes ângulos (resultado, transformação, velocidade).`,
      temperature: 0.7,
    });
  }

  /**
   * Gera histórias de transformação
   */
  async generateStoryVariations(context: string): Promise<string> {
    return this.generateContent({
      systemPrompt: 'Você é um storyteller e estrategista de marca, especialista em criar narrativas pessoais que geram conexão e autoridade.',
      userQuery: `Com base neste contexto:\n\n${context}\n\nGere 3 variações cativantes de "história de transformação" (jornada do herói) curtas e impactantes. Cada uma com um ângulo diferente: 1) Superação, 2) Descoberta, 3) Resultados.`,
      temperature: 0.8,
    });
  }

  /**
   * Gera amostras de copy para anúncios
   */
  async generateAdCopy(offerDetails: {
    name: string;
    price: number;
    promise: string;
    targetAudience: string;
  }): Promise<string> {
    const { name, price, promise, targetAudience } = offerDetails;

    return this.generateContent({
      systemPrompt: 'Você é um copywriter de resposta direta, mestre em criar anúncios curtos e persuasivos para redes sociais.',
      userQuery: `Gere 3 exemplos de copy de anúncio (título + texto curto) para:\n\nOferta: ${name}\nPreço: R$${price}\nPromessa: ${promise}\nPúblico: ${targetAudience}\n\nCada copy deve ter: Título chamativo (hook) + 2-3 linhas de texto + CTA forte.`,
      temperature: 0.8,
      maxTokens: 1500,
    });
  }

  /**
   * FASE 1: CLONAGEM DE IDENTIDADE
   */

  /**
   * DNA Extractor - Extrai o DNA do especialista
   */
  async extractDNA(userData: {
    fullName: string;
    niche: string;
    yearsOfExperience: number;
    description: string;
  }): Promise<string> {
    const { fullName, niche, yearsOfExperience, description } = userData;

    return this.generateContent({
      systemPrompt: 'Você é um especialista em análise de personalidade e posicionamento de marca. Sua missão é extrair o "DNA" único de um especialista.',
      userQuery: `Analise este especialista e extraia seu DNA de marca:

Nome: ${fullName}
Nicho: ${niche}
Anos de Experiência: ${yearsOfExperience}
Descrição: ${description}

Extraia e formate:
• Tom de Voz: [descreva em 2-3 palavras]
• Valores Core: [liste 3-4 valores principais]
• História Central: [resuma a jornada em 1 frase impactante]
• Linguagem Característica: [descreva o estilo de comunicação]
• Diferencial Único: [o que torna esta pessoa única no mercado]

Seja específico e baseie-se nos dados fornecidos.`,
      temperature: 0.7,
      maxTokens: 1000,
    });
  }

  /**
   * Reverse Engineer - Engenharia reversa da estratégia
   */
  async reverseEngineerStrategy(userData: {
    niche: string;
    yearsOfExperience: number;
    description: string;
  }): Promise<string> {
    const { niche, yearsOfExperience, description } = userData;

    return this.generateContent({
      systemPrompt: 'Você é um estrategista de marketing que faz engenharia reversa de cases de sucesso.',
      userQuery: `Faça a engenharia reversa da estratégia deste especialista:

Nicho: ${niche}
Experiência: ${yearsOfExperience} anos
Background: ${description}

Identifique:
• Padrões de Sucesso: [3-4 padrões principais]
• Estratégias Core: [2-3 estratégias fundamentais]
• Hooks Efetivos: [3 ganchos que funcionam neste nicho]
• Gatilhos Mentais: [principais gatilhos a usar]

Formato: Bullet points diretos e acionáveis.`,
      temperature: 0.7,
      maxTokens: 1200,
    });
  }

  /**
   * Clone Configurator - Configuração do clone
   */
  async configureClone(userData: {
    fullName: string;
    niche: string;
    description: string;
  }): Promise<string> {
    const { fullName, niche, description } = userData;

    return this.generateContent({
      systemPrompt: 'Você é um configurador de IA especializado em criar personas de marca.',
      userQuery: `Configure o "clone digital" para:

Especialista: ${fullName}
Nicho: ${niche}
Contexto: ${description}

Configure:
• Persona da Marca: [descrição em 2-3 frases]
• Estilo de Conteúdo: [formato, estrutura, elementos]
• Tom Específico: [como se comunica]
• Palavras-Chave Recorrentes: [5-7 termos característicos]
• Formato de Stories: [estrutura típica]

Crie uma configuração clara e pronta para usar.`,
      temperature: 0.6,
      maxTokens: 1500,
    });
  }

  /**
   * Expert Emulator - Emulação do especialista
   */
  async emulateExpert(userData: {
    fullName: string;
    niche: string;
    description: string;
  }): Promise<string> {
    const { fullName, niche, description } = userData;

    return this.generateContent({
      systemPrompt: `Você é ${fullName}, um especialista em ${niche}. Fale como esta pessoa falaria, com seu estilo único.`,
      userQuery: `Com base neste contexto:
${description}

Crie uma amostra de 3 posts curtos (tipo stories/tweets) que demonstram:
1. Um post de autoridade (compartilhando conhecimento)
2. Um post de conexão (história pessoal/vulnerabilidade)
3. Um post de call-to-action (promovendo algo)

Use o tom, linguagem e estilo que ${fullName} usaria naturalmente.`,
      temperature: 0.8,
      maxTokens: 1500,
    });
  }

  /**
   * FASE 2: INTELIGÊNCIA DE MERCADO
   */

  /**
   * Behavioral Psychologist - Análise psicológica do avatar
   */
  async analyzeBehavior(clientData: {
    clientName: string;
    clientPain: string;
    clientDesire: string;
  }): Promise<string> {
    const { clientName, clientPain, clientDesire } = clientData;

    return this.generateContent({
      systemPrompt: 'Você é um psicólogo comportamental especializado em compreender motivações de compra.',
      userQuery: `Analise o perfil psicológico deste cliente ideal:

Nome/Perfil: ${clientName}
Dor Principal: ${clientPain}
Desejo Principal: ${clientDesire}

Forneça:
• Motivações Profundas: [2-3 motivações emocionais]
• Objeções Principais: [3-4 objeções típicas]
• Gatilhos de Ação: [3 gatilhos que fazem comprar]
• Linguagem que Ressoa: [palavras/frases que conectam]
• Medos Ocultos: [o que realmente temem]`,
      temperature: 0.7,
      maxTokens: 1500,
    });
  }

  /**
   * Capivara Intelligence - Inteligência de mercado
   */
  async gatherMarketIntelligence(data: {
    niche: string;
    clientPain: string;
  }): Promise<string> {
    const { niche, clientPain } = data;

    return this.generateContent({
      systemPrompt: 'Você é um analista de inteligência de mercado com acesso a dados de tendências e comportamento.',
      userQuery: `Gere um relatório de inteligência para:

Nicho: ${niche}
Dor do Cliente: ${clientPain}

Analise:
• Tendências do Nicho: [3 tendências atuais]
• Competidores Principais: [padrões que usam]
• Oportunidades: [gaps no mercado]
• Ameaças: [o que evitar]
• Posicionamento Ideal: [como se destacar]`,
      temperature: 0.6,
      maxTokens: 2000,
    });
  }

  /**
   * Market Analyzer - Análise de mercado
   */
  async analyzeMarket(data: {
    niche: string;
    offerName: string;
    offerPrice: string;
  }): Promise<string> {
    const { niche, offerName, offerPrice } = data;

    return this.generateContent({
      systemPrompt: 'Você é um analista de mercado especializado em precificação e posicionamento competitivo.',
      userQuery: `Analise o mercado para:

Nicho: ${niche}
Oferta: ${offerName}
Preço: ${offerPrice}

Forneça:
• Análise de Preço: [está caro/barato/justo? Por quê?]
• Posicionamento: [premium/intermediário/acessível]
• Competidores Aproximados: [faixa similar]
• Percepção de Valor: [como o preço é percebido]
• Sugestões de Ajuste: [se houver]`,
      temperature: 0.6,
      maxTokens: 1500,
    });
  }

  /**
   * FASE 3: CRIAÇÃO DE CONTEÚDO
   */

  /**
   * Copy Generator - Gera copy persuasiva
   */
  async generateCopy(data: {
    offerName: string;
    offerDescription: string;
    clientPain: string;
    clientDesire: string;
  }): Promise<string> {
    const { offerName, offerDescription, clientPain, clientDesire } = data;

    return this.generateContent({
      systemPrompt: 'Você é um copywriter de resposta direta especializado em criar copy que converte.',
      userQuery: `Crie 3 versões de copy de vendas para:

Oferta: ${offerName}
Descrição: ${offerDescription}
Dor do Cliente: ${clientPain}
Desejo do Cliente: ${clientDesire}

Gere:
1. Copy Longa (VSL): Introdução + Problema + Solução + Prova + Oferta + CTA
2. Copy Média (Email): Hook + História + Oferta + CTA
3. Copy Curta (Anúncio): Hook + Benefício + CTA

Use fórmulas clássicas (AIDA, PAS, etc).`,
      temperature: 0.8,
      maxTokens: 3000,
    });
  }

  /**
   * Creative Designer - Direcionamento criativo
   */
  async generateCreativeBrief(data: {
    offerName: string;
    niche: string;
    clientDesire: string;
  }): Promise<string> {
    const { offerName, niche, clientDesire } = data;

    return this.generateContent({
      systemPrompt: 'Você é um diretor criativo especializado em criar briefings para designers.',
      userQuery: `Crie um briefing criativo para:

Oferta: ${offerName}
Nicho: ${niche}
Desejo do Cliente: ${clientDesire}

Especifique:
• Conceito Visual: [direção artística]
• Paleta de Cores: [cores sugeridas + significado]
• Tipografia: [estilo de fontes]
• Elementos Visuais: [o que deve aparecer]
• Mood: [sentimento/atmosfera]
• Referências: [estilos similares]`,
      temperature: 0.7,
      maxTokens: 1500,
    });
  }

  /**
   * Story Writer - Escreve stories/sequências
   */
  async generateStories(data: {
    fullName: string;
    offerName: string;
    clientDesire: string;
  }): Promise<string> {
    const { fullName, offerName, clientDesire } = data;

    return this.generateContent({
      systemPrompt: 'Você é um storyteller especializado em criar sequências de stories para Instagram.',
      userQuery: `Crie uma sequência de 5 stories para:

Especialista: ${fullName}
Oferta: ${offerName}
Desejo do Cliente: ${clientDesire}

Estrutura:
Story 1: Hook/Gancho (problema/situação)
Story 2: Agitação (amplifica a dor)
Story 3: Solução (apresenta a oferta)
Story 4: Prova/Resultado (social proof)
Story 5: CTA (chamada para ação clara)

Cada story: 1-2 frases curtas + sugestão de visual.`,
      temperature: 0.8,
      maxTokens: 2000,
    });
  }

  /**
   * FASE 4: ESTRUTURA DE FUNIL
   */

  /**
   * Funnel Architect - Arquitetura do funil
   */
  async architectFunnel(data: {
    funnelType: string;
    offerName: string;
    offerPrice: string;
  }): Promise<string> {
    const { funnelType, offerName, offerPrice } = data;

    return this.generateContent({
      systemPrompt: 'Você é um arquiteto de funis de vendas especializado em estruturas de alta conversão.',
      userQuery: `Projete a arquitetura completa de um funil:

Tipo de Funil: ${funnelType}
Oferta: ${offerName}
Preço: ${offerPrice}

Estruture:
• Páginas Necessárias: [lista completa]
• Sequência de Emails: [quantos + temas]
• Pontos de Fricção: [onde podem desistir]
• Otimizações: [o que testar]
• Métricas-Chave: [o que medir]
• Timeline: [duração do funil]`,
      temperature: 0.6,
      maxTokens: 2500,
    });
  }

  /**
   * Conversion Optimizer - Otimizações de conversão
   */
  async optimizeConversion(data: {
    funnelType: string;
    offerPrice: string;
  }): Promise<string> {
    const { funnelType, offerPrice } = data;

    return this.generateContent({
      systemPrompt: 'Você é um especialista em CRO (Conversion Rate Optimization) com foco em funis digitais.',
      userQuery: `Otimize a conversão para:

Tipo de Funil: ${funnelType}
Ticket Médio: ${offerPrice}

Forneça:
• Headlines que Convertem: [3 exemplos testados]
• CTAs de Alta Performance: [5 variações]
• Elementos de Urgência: [como implementar]
• Provas Sociais: [onde e como usar]
• Garantia Ideal: [tipo e duração]
• Testes A/B Prioritários: [o que testar primeiro]`,
      temperature: 0.7,
      maxTokens: 2000,
    });
  }

  /**
   * Automation Builder - Automações e sequências
   */
  async buildAutomations(data: {
    offerName: string;
    funnelType: string;
  }): Promise<string> {
    const { offerName, funnelType } = data;

    return this.generateContent({
      systemPrompt: 'Você é um especialista em automação de marketing e sequências inteligentes.',
      userQuery: `Construa o plano de automação para:

Oferta: ${offerName}
Funil: ${funnelType}

Especifique:
• Automação de Email: [sequência completa com dias]
• Segmentações: [quando e como segmentar]
• Triggers: [eventos que acionam ações]
• Remarketing: [quando e para quem]
• Recuperação de Carrinho: [estratégia]
• Follow-up Pós-Venda: [sequência de nutrição]`,
      temperature: 0.6,
      maxTokens: 2500,
    });
  }

  /**
   * Função auxiliar para sleep
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Exporta instância singleton
export const geminiService = new GeminiService();
