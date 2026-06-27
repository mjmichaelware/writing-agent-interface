import { createHash } from 'crypto';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { NextResponse } from 'next/server';

const AUDIO_CACHE = new Map<string, string>();
const AUDIO_CACHE_LIMIT = 50;

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

function sha256(text: string) {
  return createHash('sha256').update(text).digest('hex');
}

function cacheAudio(key: string, audioBase64: string) {
  if (AUDIO_CACHE.has(key)) {
    AUDIO_CACHE.delete(key);
  }

  while (AUDIO_CACHE.size >= AUDIO_CACHE_LIMIT) {
    const oldestKey = AUDIO_CACHE.keys().next().value;
    if (typeof oldestKey !== 'string') break;
    AUDIO_CACHE.delete(oldestKey);
  }

  AUDIO_CACHE.set(key, audioBase64);
}

function toBase64(audioContent: unknown) {
  if (typeof audioContent === 'string') {
    return Buffer.from(audioContent).toString('base64');
  }

  if (Buffer.isBuffer(audioContent)) {
    return audioContent.toString('base64');
  }

  if (audioContent instanceof Uint8Array) {
    return Buffer.from(audioContent).toString('base64');
  }

  return Buffer.from(audioContent as ArrayBufferLike).toString('base64');
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { text?: string; voice?: string };
    const text = typeof body?.text === 'string' ? body.text.trim() : '';
    const voice = typeof body?.voice === 'string' && body.voice.trim() ? body.voice.trim() : 'en-US-Wavenet-D';
    const cacheKey = sha256(text);

    if (!text) {
      return NextResponse.json({ error: 'text is required' }, { status: 400 });
    }

    const cached = AUDIO_CACHE.get(cacheKey);
    if (cached) {
      AUDIO_CACHE.delete(cacheKey);
      AUDIO_CACHE.set(cacheKey, cached);
      return NextResponse.json({ audioBase64: cached });
    }

    const client = getClient();
    if (!client) {
      return NextResponse.json({ error: 'TTS not configured' }, { status: 503 });
    }

    const [response] = await client.synthesizeSpeech({
      input: { text },
      voice: { languageCode: 'en-US', name: voice, ssmlGender: 'MALE' },
      audioConfig: { audioEncoding: 'MP3', speakingRate: 0.92, pitch: -2.0 },
    });

    if (!response.audioContent) {
      throw new Error('TTS returned empty audio');
    }

    const audioBase64 = toBase64(response.audioContent);
    cacheAudio(cacheKey, audioBase64);

    return NextResponse.json({ audioBase64 });
  } catch (error: any) {
    console.error('TTS synthesis failed:', error);
    return NextResponse.json({ error: error?.message ?? 'TTS synthesis failed' }, { status: 500 });
  }
}
