import { LLMProvider, LLMRequest, LLMResponse } from "./providers/base";
import { GeminiProvider } from "./providers/gemini";
import { GroqProvider } from "./providers/groq";
import { AnthropicProvider } from "./providers/anthropic";

// Provider priority: anthropic → groq → gemini. OpenAI is not in this project.
const FALLBACK_ORDER = ["anthropic", "groq", "gemini"];

export class OrchestrationRouter {
  private providers: Record<string, LLMProvider> = {};

  constructor() {
    this.providers["gemini"]    = new GeminiProvider();
    this.providers["groq"]      = new GroqProvider();
    this.providers["anthropic"] = new AnthropicProvider();
    this.providers["claude"]    = this.providers["anthropic"];
  }

  async route(request: LLMRequest, preferredProvider?: string): Promise<LLMResponse> {
    let providerName = preferredProvider;

    if (!providerName) {
      const combinedLength =
        (request.systemPrompt?.length || 0) +
        (request.context?.length || 0) +
        (request.prompt?.length || 0);
      if (combinedLength > 400000) {
        providerName = "gemini";
      } else {
        providerName = "anthropic";
      }
    }

    // Normalize "claude" → "anthropic"
    const normalized = providerName === "claude" ? "anthropic" : providerName;

    // Try the requested provider first, then fallback chain without OpenAI
    const order = [
      normalized,
      ...FALLBACK_ORDER.filter(p => p !== normalized),
    ];

    const errors: string[] = [];
    for (const name of order) {
      const provider = this.providers[name];
      if (!provider) continue;
      try {
        console.log(`Routing to: ${name}`);
        return await provider.generateResponse(request);
      } catch (e: any) {
        const msg = e?.message || String(e);
        console.warn(`Provider ${name} failed: ${msg}`);
        errors.push(`${name}: ${msg}`);
      }
    }

    throw new Error(
      `All providers failed. Check ANTHROPIC_API_KEY, GROQ_API_KEY, and GOOGLE_CLOUD_PROJECT in Vercel environment variables.\n\nDetails: ${errors.join(" | ")}`
    );
  }
}

export const llmRouter = new OrchestrationRouter();
