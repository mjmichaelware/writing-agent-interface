import { NextResponse } from 'next/server';
import { orchestrateAgent } from '@/services/orchestration-engine/router';

export async function POST(request: Request) {
  try {
    const { role, prompt, context } = await request.json();

    if (!role || !prompt) {
      return NextResponse.json({ error: 'role and prompt are required' }, { status: 400 });
    }

    const result = await orchestrateAgent(role, prompt, context);

    // If result is from OpenAI/Groq it will have a specific shape, 
    // if from Vertex AI it might be a string.
    let content = result;
    if (typeof result === 'object' && result.choices) {
      content = result.choices[0].message.content;
    }

    return NextResponse.json({ result: content });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}