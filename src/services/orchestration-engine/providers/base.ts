export interface LLMRequest {
  prompt: string;
  systemPrompt?: string;
  context?: string;
  responseFormat?: 'text' | 'json';
}

export interface LLMResponse {
  content: string;
  provider: string;
  model: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface LLMProvider {
  name: string;
  generateResponse(request: LLMRequest): Promise<LLMResponse>;
}
