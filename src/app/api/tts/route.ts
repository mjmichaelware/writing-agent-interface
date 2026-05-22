import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { NextResponse } from 'next/server';

function getClient() {
  const email = process.env.GOOGLE_CLIENT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const project = process.env.GOOGLE_CLOUD_PROJECT;

  if (!email || !key || !project) return null;

  return new TextToSpeechClient({
    credentials: {
      client_email: email,
      private_key: key,
    },
    projectId: project,
  });
}

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'text is required' }, { status: 400 });
    }

    const client = getClient();
    if (!client) {
      return NextResponse.json({ error: 'Google Cloud credentials not configured' }, { status: 503 });
    }

    // Feature 32: Prestige Voice Configuration (Wavenet-D, Studio Quality)
    const [response] = await client.synthesizeSpeech({
      input: { text },
      voice: { languageCode: 'en-US', name: 'en-US-Wavenet-D', ssmlGender: 'MALE' },
      audioConfig: { audioEncoding: 'MP3', speakingRate: 0.92, pitch: -2.0 },
    });

    const audioContent = response.audioContent as Buffer;
    return new Response(audioContent, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioContent.length.toString(),
      },
    });
  } catch (error: any) {
    console.error("TTS synthesis failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
