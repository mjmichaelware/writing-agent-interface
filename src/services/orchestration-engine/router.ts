import OpenAI from 'openai';
import { VertexAI } from '@google-cloud/vertexai';
import { Groq } from 'groq-sdk';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const project = process.env.GOOGLE_CLOUD_PROJECT || 'weight-of-the-sky';
const location = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';
const vertexAI = new VertexAI({ project, location });

export type AgentRole = 'literary_analyst' | 'creative_writer' | 'semantic_mapper' | 'logic_auditor';

export async function orchestrateAgent(role: AgentRole, prompt: string, context: any = {}) {
  switch (role) {
    case 'literary_analyst':
      // Claude 3.5 for literary prose analysis (Simulated via OpenAI if key missing, or use proper SDK if available)
      return openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: `Analyze this literary prose:\n${prompt}` }],
      });

    case 'semantic_mapper':
      // Groq for fast edge mapping
      return groq.chat.completions.create({
        model: 'llama3-70b-8192',
        messages: [{ role: 'user', content: `Map the dualisms in this text:\n${prompt}` }],
      });

    case 'creative_writer':
      // Gemini for multimodal / vision-integrated prose
      const model = vertexAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
      const result = await model.generateContent(prompt);
      return result.response.text();

    default:
      return openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
      });
  }
}