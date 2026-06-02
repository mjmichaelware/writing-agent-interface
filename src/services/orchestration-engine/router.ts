import { LLMProvider, LLMRequest, LLMResponse } from "./providers/base";
import { OpenAIProvider } from "./providers/openai";
import { GeminiProvider } from "./providers/gemini";
import { GroqProvider } from "./providers/groq";
import { AnthropicProvider } from "./providers/anthropic";

export class OrchestrationRouter {
  private providers: Record<string, LLMProvider> = {};

  constructor() {
    this.providers['openai'] = new OpenAIProvider();
    this.providers['gemini'] = new GeminiProvider();
    this.providers['groq'] = new GroqProvider();
    this.providers['anthropic'] = new AnthropicProvider();
  }

  async route(request: LLMRequest, preferredProvider?: string): Promise<LLMResponse> {
    // 1. Logic to decide which provider to use if none preferred
    let providerName = preferredProvider;

    if (!providerName) {
      const promptLower = request.prompt.toLowerCase();
      
      if (promptLower.includes('multimodal') || promptLower.includes('image') || promptLower.includes('diagram')) {
        providerName = 'gemini'; // Gemini for multimodal
      } else if (promptLower.includes('compose') || promptLower.includes('prose') || promptLower.includes('literary')) {
        providerName = 'anthropic'; // Claude for literary prose
      } else if (promptLower.includes('mapping') || promptLower.includes('semantic') || promptLower.includes('entities')) {
        providerName = 'groq'; // Groq for edge-fast mapping
      } else if (request.prompt.length > 8000) {
        providerName = 'gemini'; // Large context
      } else {
        providerName = 'openai'; // Reliable default
      }
    }

    const provider = this.providers[providerName!] || this.providers['openai'];
    
    try {
      console.log(`Routing request to: ${providerName || 'default(openai)'}`);
      return await provider.generateResponse(request);
    } catch (e: any) {
      console.warn(`Provider ${providerName} failed, falling back to OpenAI:`, e.message);
      return await this.providers['openai'].generateResponse(request);
    }
  }
}

export const llmRouter = new OrchestrationRouter();
