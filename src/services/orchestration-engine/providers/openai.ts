import OpenAI from "openai";
import { LLMProvider, LLMRequest, LLMResponse } from "./base";

export class OpenAIProvider implements LLMProvider {
  name = "openai";
  private client: OpenAI | null = null;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      this.client = new OpenAI({ apiKey });
    }
  }

  async generateResponse(request: LLMRequest): Promise<LLMResponse> {
    if (!this.client) throw new Error("OpenAI API key not configured");

    const messages: any[] = [];
    if (request.systemPrompt) {
      messages.push({ role: "system", content: request.systemPrompt });
    }
    if (request.context) {
      messages.push({ role: "system", content: `Context: ${request.context}` });
    }
    messages.push({ role: "user", content: request.prompt });

    const completion = await this.client.chat.completions.create({
      model: "gpt-4o",
      messages,
      response_format: request.responseFormat === 'json' ? { type: "json_object" } : undefined,
    });

    return {
      content: completion.choices[0].message.content || "",
      provider: this.name,
      model: "gpt-4o",
      usage: {
        promptTokens: completion.usage?.prompt_tokens || 0,
        completionTokens: completion.usage?.completion_tokens || 0,
        totalTokens: completion.usage?.total_tokens || 0,
      }
    };
  }
}
