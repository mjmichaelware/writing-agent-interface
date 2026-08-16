import Anthropic from "@anthropic-ai/sdk";
import { LLMProvider, LLMRequest, LLMResponse } from "./base";

export class AnthropicProvider implements LLMProvider {
  name = "anthropic";

  // Read env var lazily so Vercel container restarts / late-set vars work
  private getClient(): Anthropic {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error("Anthropic API key not configured");
    return new Anthropic({ apiKey });
  }

  async generateResponse(request: LLMRequest): Promise<LLMResponse> {
    const client = this.getClient();
    const model = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";

    const prompt = request.context
      ? `${request.context}\n\n${request.prompt}`
      : request.prompt;

    const userContent: any[] = [{ type: "text", text: prompt }];
    if (request.imageData && request.mimeType) {
      userContent.unshift({
        type: "image",
        source: { type: "base64", media_type: request.mimeType, data: request.imageData },
      });
    }

    const message = await client.messages.create({
      model,
      max_tokens: 4096,
      system: request.systemPrompt,
      messages: [{ role: "user", content: userContent }],
    });

    const content = message.content
      .filter((block) => block.type === "text")
      .map((block) => (block as any).text)
      .join("\n")
      .trim();

    return {
      content,
      provider: this.name,
      model,
      usage: {
        promptTokens: message.usage.input_tokens,
        completionTokens: message.usage.output_tokens,
        totalTokens: message.usage.input_tokens + message.usage.output_tokens,
      },
    };
  }
}
