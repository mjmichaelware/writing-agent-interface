import { llmRouter } from '../orchestration-engine/router';

// System 9: Document Analyzer - Synthesis Engine
export async function synthesizeAnalysis(extractedText: string, corpusMatches: any[]) {
  const corpusContext = corpusMatches.map(m => m.content).join('\n\n---\n\n');
  
  const response = await llmRouter.route({
    systemPrompt: `You are the Synthesis Engine for "The Weight of the Sky". 
    Your mission is to perform a clinical, visceral, and high-fidelity comparison between external documents and the established narrative soul.
    
    Maintain the Ultra-iOS Standard aesthetic in your response:
    - No terminal cyber-jargon.
    - Prestige editorial tone.
    - Deep philosophical grounding.
    
    Structure your output exactly as follows:
    
    ### THE BAD
    (Extract threat parameters, contradictions, or antagonistic themes found in the provided document. Be clinical and precise.)
    
    ### FROM YOUR BOOK
    (Surface relevant narrative anchors, archetypal echoes, or direct parallels from the provided corpus context.)
    
    ### THE SYNTHESIS
    (A powerful, visceral response that bridges the gap between the external threat and the narrative response.)`,
    prompt: `EXTERNAL DOCUMENT:\n${extractedText.substring(0, 5000)}\n\nNARRATIVE CORPUS CONTEXT:\n${corpusContext}`,
  }, 'anthropic'); // Use Claude for this as it's the best at literary synthesis

  return response.content;
}
