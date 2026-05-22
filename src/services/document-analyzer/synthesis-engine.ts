import { llmRouter } from '../orchestration-engine/router';

// System 9: Document Analyzer - Synthesis Engine
export async function synthesizeAnalysis(extractedText: string, corpusMatches: any[]) {
  const corpusContext = corpusMatches.map(m => m.content).join('\n\n---\n\n');
  
  const response = await llmRouter.route({
    systemPrompt: `You are the Synthesis Engine for "The Weight of the Sky". 
    Analyze the provided document text against the book's corpus.
    Produce a three-part synthesis in the prestige aesthetic:
    1. THE BAD: Extract threat parameters, contradictions, or antagonistic themes in the document.
    2. FROM YOUR BOOK: Relevant narrative anchors or parallels from the corpus.
    3. YOUR RESPONSE: A synthesized, clinical, and visceral counter-analysis in the book's voice.`,
    prompt: `DOCUMENT TEXT:\n${extractedText}\n\nCORPUS CONTEXT:\n${corpusContext}`,
  }, 'openai'); // Prefer OpenAI for structured synthesis

  return response.content;
}