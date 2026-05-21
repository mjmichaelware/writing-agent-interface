import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// System 9: Document Analyzer - Synthesis Engine
export async function synthesizeAnalysis(extractedText: string, corpusMatches: any[]) {
  const corpusContext = corpusMatches.map(m => m.content).join('\n\n---\n\n');
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `You are the Synthesis Engine for "The Weight of the Sky". 
        Analyze the provided document text against the book's corpus.
        Produce a three-part synthesis in the prestige aesthetic:
        1. THE BAD: Extract threat parameters, contradictions, or antagonistic themes in the document.
        2. FROM YOUR BOOK: Relevant narrative anchors or parallels from the corpus.
        3. YOUR RESPONSE: A synthesized, clinical, and visceral counter-analysis in the book's voice.`
      },
      {
        role: 'user',
        content: `DOCUMENT TEXT:\n${extractedText}\n\nCORPUS CONTEXT:\n${corpusContext}`
      }
    ]
  });

  return response.choices[0].message.content;
}