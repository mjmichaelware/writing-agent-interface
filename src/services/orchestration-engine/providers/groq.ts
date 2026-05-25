import { Groq } from "groq-sdk";
import { LLMProvider, LLMRequest, LLMResponse } from "./base";

export class GroqProvider implements LLMProvider {
  name = "groq";
  private client: Groq | null = null;

  constructor() {
    const apiKey = process.env.GROQ_API_KEY;
    if (apiKey) {
      this.client = new Groq({ apiKey });
    }
  }

  async generateResponse(request: LLMRequest): Promise<LLMResponse> {
    if (!this.client) throw new Error("Groq API key not configured");

    const messages: any[] = [];
    if (request.systemPrompt) {
      messages.push({ role: "system", content: request.systemPrompt });
    }
    if (request.context) {
      messages.push({ role: "system", content: `Context: ${request.context}` });
    }
    messages.push({ role: "user", content: request.prompt });

    const completion = await this.client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages,
      response_format: request.responseFormat === 'json' ? { type: "json_object" } : undefined,
    });

    return {
      content: completion.choices[0].message.content || "",
      provider: this.name,
      model: "llama-3.3-70b-versatile",
      usage: {
        promptTokens: completion.usage?.prompt_tokens || 0,
        completionTokens: completion.usage?.completion_tokens || 0,
        totalTokens: completion.usage?.total_tokens || 0,
      }
    };
  }
}
