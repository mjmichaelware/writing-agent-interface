import { GoogleGenerativeAI } from "@google/generative-ai";
import { LLMProvider, LLMRequest, LLMResponse } from "./base";

export class GeminiProvider implements LLMProvider {
  name = "gemini";

  private getClient() {
    // Support GEMINI_API_KEY (simplest), GOOGLE_API_KEY, or fall through to Vertex config check
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      // Also accept Vertex-style config — but we won't instantiate VertexAI here
      // because it pulls in a heavy dep and requires a GCP project
      throw new Error("Gemini API key not configured — set GEMINI_API_KEY in Vercel env vars");
    }
    return new GoogleGenerativeAI(apiKey);
  }

  async generateResponse(request: LLMRequest): Promise<LLMResponse> {
    const genAI = this.getClient();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const parts: any[] = [];

    if (request.imageData && request.mimeType) {
      parts.push({ inlineData: { data: request.imageData, mimeType: request.mimeType } });
    }

    const text = [
      request.systemPrompt ? `System: ${request.systemPrompt}` : "",
      request.context ? `Context: ${request.context}` : "",
      `User: ${request.prompt}`,
    ].filter(Boolean).join("\n\n");

    parts.push({ text });

    const result = await model.generateContent({ contents: [{ role: "user", parts }] });
    const response = result.response;
    const content = response.text();

    return {
      content,
      provider: this.name,
      model: "gemini-1.5-flash",
    };
  }
}
