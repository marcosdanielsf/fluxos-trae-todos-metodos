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
   * Função auxiliar para sleep
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Exporta instância singleton
export const geminiService = new GeminiService();
