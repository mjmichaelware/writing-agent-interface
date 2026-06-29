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
    this.providers['claude'] = this.providers['anthropic'];
  }

  async route(request: LLMRequest, preferredProvider?: string): Promise<LLMResponse> {
    let providerName = preferredProvider;
    const combinedLength =
      (request.systemPrompt?.length || 0) +
      (request.context?.length || 0) +
      (request.prompt?.length || 0);

    if (!providerName) {
      const promptLower = request.prompt.toLowerCase();

      if (request.responseFormat === "json") {
        providerName = "openai";
      } else if (combinedLength > 400000) {
        providerName = "gemini";
      } else if (
        promptLower.includes("multimodal") ||
        promptLower.includes("image") ||
        promptLower.includes("diagram")
      ) {
        providerName = "gemini";
      } else {
        providerName = "anthropic";
      }
    }

    const provider =
      this.providers[providerName || "anthropic"] || this.providers["anthropic"];

    try {
      console.log(`Routing request to: ${providerName || "default(anthropic)"}`);
      return await provider.generateResponse(request);
    } catch (e: any) {
      console.warn(`Provider ${providerName} failed:`, e.message);

      if (providerName !== "anthropic") {
        try {
          return await this.providers["anthropic"].generateResponse(request);
        } catch (anthropicError: any) {
          console.warn("Anthropic fallback failed:", anthropicError.message);
        }
      }

      if (providerName !== "openai") {
        return await this.providers["openai"].generateResponse(request);
      }

      return await this.providers["groq"].generateResponse(request);
    }
  }
}

export const llmRouter = new OrchestrationRouter();
