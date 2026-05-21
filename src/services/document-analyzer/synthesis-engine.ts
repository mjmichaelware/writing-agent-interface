import { OrchestrationEngine } from "../orchestration-engine/router";

export interface AnalysisResult {
  theBad: string;
  fromYourBook: string;
  yourResponse: string;
  rawContent: string;
}

export const SynthesisEngine = {
  async analyze(content: string, contextNodes: string[]): Promise<AnalysisResult> {
    console.log("[Synthesis] Initiating Three-Part Analysis...");

    const systemPrompt = `
      You are the Writing Agent for "The Weight of the Sky". 
      Your task is to analyze the provided document and produce a three-part output.
      
      PART 1: THE BAD
      Identify the core threat, logical fallacy, or narrative issue in the document. Be clinical, sharp, and unforgiving.
      
      PART 2: FROM YOUR BOOK
      Cite a parallel theme, character arc (Dan, Kasha, etc.), or archetypal dualism from "The Weight of the Sky" that resonates with this issue.
      
      PART 3: YOUR RESPONSE
      Provide a refined narrative counter-move. How does the "Weight of the Sky" protocol resolve or transcend this issue?
      
      Format the output as a JSON object with keys: "theBad", "fromYourBook", "yourResponse".
    `;

    const response = await OrchestrationEngine.route({
      prompt: content,
      systemPrompt,
      context: contextNodes.join("\n"),
      provider: "claude" // Use Claude for literary/thematic analysis
    });

    try {
      // Assuming the LLM returns JSON as requested
      const parsed = JSON.parse(response.content);
      return {
        theBad: parsed.theBad,
        fromYourBook: parsed.fromYourBook,
        yourResponse: parsed.yourResponse,
        rawContent: content
      };
    } catch {
      // Fallback if parsing fails
      return {
        theBad: "Failed to parse analysis.",
        fromYourBook: "Context lost.",
        yourResponse: response.content,
        rawContent: content
      };
    }
  }
};
