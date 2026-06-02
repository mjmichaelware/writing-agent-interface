import Anthropic from "@anthropic-ai/sdk";
import { LLMProvider, LLMRequest, LLMResponse } from "./base";

export class AnthropicProvider implements LLMProvider {
  name = "anthropic";
  private client: Anthropic | null = null;

  constructor() {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (apiKey) {
      this.client = new Anthropic({ apiKey });
    }
  }

  async generateResponse(request: LLMRequest): Promise<LLMResponse> {
    if (!this.client) throw new Error("Anthropic API key not configured");

    const message = await this.client.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 4096,
      system: request.systemPrompt,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: request.prompt },
            ...(request.context ? [{ type: "text", text: `Context: ${request.context}` }] as any : [])
          ],
        },
      ],
    });

    const content = message.content[0].type === 'text' ? message.content[0].text : '';

    return {
      content,
      provider: this.name,
      model: "claude-3-5-sonnet-20240620",
    };
  }
}
