import { createHash } from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

type CachedImageRow = {
  paragraph_hash?: string | null;
  image_url?: string | null;
  source?: string | null;
};

function getSupabase() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

function hashPrompt(prompt: string) {
  return createHash('sha256').update(prompt).digest('hex');
}

async function canResolve(url: string) {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

function extractKeywords(prompt: string) {
  const stopWords = new Set([
    'the', 'and', 'with', 'from', 'that', 'this', 'into', 'over', 'under', 'through',
    'cinematic', 'painting', 'deep', 'shadows', 'scene', 'image', 'black', 'white',
  ]);

  const terms = prompt
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((term) => term.length > 2 && !stopWords.has(term));

  return Array.from(new Set(terms)).slice(0, 3);
}

async function readCachedImage(supabase: ReturnType<typeof getSupabase>, promptHash: string) {
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('generated_images')
      .select('paragraph_hash, image_url, source')
      .eq('paragraph_hash', promptHash)
      .maybeSingle();

    if (error) throw error;
    return (data as CachedImageRow | null) ?? null;
  } catch {
    return null;
  }
}

async function writeCachedImage(
  supabase: ReturnType<typeof getSupabase>,
  promptHash: string,
  imageUrl: string,
  source: string
) {
  if (!supabase) return;

  try {
    await supabase.from('generated_images').upsert(
      {
        paragraph_hash: promptHash,
        image_url: imageUrl,
        source,
      } as any,
      { onConflict: 'paragraph_hash' }
    );
  } catch {
    // Cache table is optional until the migration lands.
  }
}

async function fetchUnsplashImage(prompt: string) {
  const accessKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;
  if (!accessKey) return null;

  const keywords = extractKeywords(prompt);
  if (keywords.length === 0) return null;

  const search = new URL('https://api.unsplash.com/search/photos');
  search.searchParams.set('query', keywords.join(' '));
  search.searchParams.set('orientation', 'landscape');
  search.searchParams.set('color', 'black');
  search.searchParams.set('per_page', '1');

  const response = await fetch(search, {
    headers: {
      Authorization: `Client-ID ${accessKey}`,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    return null;
  }

  const payload = await response.json();
  const first = payload?.results?.[0];
  const rawUrl = first?.urls?.raw;

  if (!rawUrl) {
    return null;
  }

  return `${rawUrl}&fit=crop&w=1600&q=80`;
}

async function fetchReplicateImage(prompt: string) {
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) return null;

  const createResponse = await fetch('https://api.replicate.com/v1/models/stability-ai/sdxl/predictions', {
    method: 'POST',
    headers: {
      Authorization: `Token ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      input: {
        prompt,
      },
    }),
  });

  if (!createResponse.ok) {
    return null;
  }

  let prediction = await createResponse.json();
  const statusUrl = prediction?.urls?.get;
  if (!statusUrl) return null;

  for (let attempt = 0; attempt < 20; attempt += 1) {
    if (prediction?.status === 'succeeded') {
      const output = prediction?.output;
      if (Array.isArray(output)) {
        return output[0] ?? null;
      }
      return typeof output === 'string' ? output : null;
    }

    if (prediction?.status === 'failed' || prediction?.status === 'canceled') {
      return null;
    }

    await new Promise((resolve) => setTimeout(resolve, 1500));
    const statusResponse = await fetch(statusUrl, {
      headers: {
        Authorization: `Token ${token}`,
        Accept: 'application/json',
      },
    });

    if (!statusResponse.ok) {
      return null;
    }

    prediction = await statusResponse.json();
  }

  return null;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const prompt = (searchParams.get('prompt') || 'The Void').trim();
  const promptHash = hashPrompt(prompt);
  const supabase = getSupabase();

  const cached = await readCachedImage(supabase, promptHash);
  if (cached?.image_url && await canResolve(cached.image_url)) {
    return NextResponse.json({
      url: cached.image_url,
      cached: true,
      source: cached.source || 'cache',
    });
  }

  const unsplashUrl = await fetchUnsplashImage(prompt);
  if (unsplashUrl) {
    await writeCachedImage(supabase, promptHash, unsplashUrl, 'unsplash');
    return NextResponse.json({
      url: unsplashUrl,
      cached: false,
      source: 'unsplash',
    });
  }

  const replicateUrl = await fetchReplicateImage(prompt);
  if (replicateUrl) {
    await writeCachedImage(supabase, promptHash, replicateUrl, 'replicate');
    return NextResponse.json({
      url: replicateUrl,
      cached: false,
      source: 'replicate',
    });
  }

  return NextResponse.json(
    { error: 'Unable to generate image for prompt' },
    { status: 503 }
  );
}
