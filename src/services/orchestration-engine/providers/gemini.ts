import { VertexAI } from "@google-cloud/vertexai";
import { LLMProvider, LLMRequest, LLMResponse } from "./base";

export class GeminiProvider implements LLMProvider {
  name = "gemini";
  private vertexAI: VertexAI | null = null;

  constructor() {
    const project = process.env.GOOGLE_CLOUD_PROJECT;
    const location = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';
    if (project) {
      this.vertexAI = new VertexAI({ project, location });
    }
  }

  async generateResponse(request: LLMRequest): Promise<LLMResponse> {
    if (!this.vertexAI) throw new Error("Google Cloud Project not configured for Gemini");

    const model = this.vertexAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const fullPrompt = `
      ${request.systemPrompt ? `System: ${request.systemPrompt}\n` : ''}
      ${request.context ? `Context: ${request.context}\n` : ''}
      User: ${request.prompt}
    `;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;

    return {
      content: response.text(),
      provider: this.name,
      model: "gemini-1.5-flash",
    };
  }
}
