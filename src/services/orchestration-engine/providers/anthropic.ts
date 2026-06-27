import Anthropic from "@anthropic-ai/sdk";
import { LLMProvider, LLMRequest, LLMResponse } from "./base";

export class AnthropicProvider implements LLMProvider {
  name = "anthropic";
  private client: Anthropic | null = null;
  private model: string;

  constructor() {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    this.model = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";
    if (apiKey) {
      this.client = new Anthropic({ apiKey });
    }
  }

  async generateResponse(request: LLMRequest): Promise<LLMResponse> {
    if (!this.client) throw new Error("Anthropic API key not configured");

    const prompt = request.context
      ? `${request.context}\n\n${request.prompt}`
      : request.prompt;

    const message = await this.client.messages.create({
      model: this.model,
      max_tokens: 4096,
      system: request.systemPrompt,
      messages: [
        {
          role: "user",
          content: [{ type: "text", text: prompt }],
        },
      ],
    });

    const content = message.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n")
      .trim();

    return {
      content,
      provider: this.name,
      model: this.model,
    };
  }
}
