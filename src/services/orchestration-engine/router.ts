import { LLMProvider, LLMRequest, LLMResponse } from "./providers/base";
import { OpenAIProvider } from "./providers/openai";
import { GeminiProvider } from "./providers/gemini";
import { GroqProvider } from "./providers/groq";

export class OrchestrationRouter {
  private providers: Record<string, LLMProvider> = {};

  constructor() {
    this.providers['openai'] = new OpenAIProvider();
    this.providers['gemini'] = new GeminiProvider();
    this.providers['groq'] = new GroqProvider();
  }

  async route(request: LLMRequest, preferredProvider?: string): Promise<LLMResponse> {
    // 1. Logic to decide which provider to use if none preferred
    let providerName = preferredProvider;

    if (!providerName) {
      if (request.prompt.length > 4000) {
        providerName = 'gemini'; // Gemini has larger context
      } else if (request.prompt.toLowerCase().includes('json') || request.responseFormat === 'json') {
        providerName = 'openai'; // OpenAI is very reliable for JSON
      } else {
        providerName = 'groq'; // Groq is fast for general chat
      }
    }

    const provider = this.providers[providerName!] || this.providers['openai'];
    
    try {
      return await provider.generateResponse(request);
    } catch (e) {
      console.warn(`Provider ${providerName} failed, falling back to OpenAI:`, e.message);
      return await this.providers['openai'].generateResponse(request);
    }
  }
}

export const llmRouter = new OrchestrationRouter();
