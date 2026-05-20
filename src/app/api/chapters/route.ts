import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";
import { Pool } from "pg";

export const dynamic = "force-dynamic";

const RAW_DIR = path.join(
  process.cwd(),
  "src/data-layer/ingestion-buffer/gdrive_raw"
);

const EMA_HISTORY = path.join(
  process.cwd(),
  "src/data-layer/version-archive/ema_history.json"
);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

function manifestIdFromSlug(slug: string) {
  const clean = String(slug || "7").trim().replace(/^chapter[_-]?/i, "");
  return `chapter_${clean}`;
}

function stripXml(raw: string) {
  return raw
    .replace(/<[^>]*>/g, "\n")
    .replace(/\r/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function splitBlocks(cleaned: string) {
  return cleaned
    .split(/\n\s*\n/g)
    .map((block) => block.trim())
    .filter(Boolean);
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

async function findChapterFile(slug: string) {
  const files = await fs.readdir(RAW_DIR);
  const clean = String(slug || "7").trim();

  const rejectTerms = [
    "prompt",
    "guide",
    "notes",
    "critique",
    "analysis",
    "revision_prompt",
    "blueprint",
    "rulebook",
    "marketability",
    "principles",
    "synthesis_mandate",
    "refinery",
  ];

  const candidates = files
    .filter((file) => {
      const n = normalize(file);

      const matches =
        n.includes(`chapter_${clean}`) ||
        n.includes(`ch_${clean}`) ||
        n.includes(`ch${clean}`);

      if (!matches) return false;

      return !rejectTerms.some((term) => n.includes(term));
    })
    .map((file) => {
      const n = normalize(file);
      let score = 0;

      if (n.includes("final")) score += 100;
      if (file.trim().startsWith("*")) score += 90;
      if (n.includes(`chapter_${clean}`)) score += 30;

      return { file, score };
    })
    .sort((a, b) => b.score - a.score || a.file.localeCompare(b.file));

  return candidates[0]?.file;
}

async function readEmaMetadata() {
  try {
    const raw = await fs.readFile(EMA_HISTORY, "utf-8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function readChapterFromDatabase(slug: string) {
  if (!process.env.DATABASE_URL) return null;

  const manifestId = manifestIdFromSlug(slug);

  const chapter = await pool.query(
    `SELECT id, manifest_id
     FROM chapters
     WHERE manifest_id = $1
     LIMIT 1`,
    [manifestId]
  );

  if (!chapter.rows[0]) return null;

  const paragraphs = await pool.query(
    `SELECT
       chunk_index,
       content,
       archetypal_weights,
       dualism_map,
       embedding
     FROM paragraphs
     WHERE chapter_id = $1
     ORDER BY chunk_index ASC`,
    [chapter.rows[0].id]
  );

  return {
    slug,
    source: chapter.rows[0].manifest_id,
    blocks: paragraphs.rows.map((row) => String(row.content || "")),
    total: paragraphs.rows.length,
    metadata: {
      sourceLayer: "postgres",
      manifest_id: chapter.rows[0].manifest_id,
      paragraphs: paragraphs.rows.map((row) => ({
        chunk_index: row.chunk_index,
        archetypal_weights: row.archetypal_weights || {},
        dualism_map: row.dualism_map || [],
        has_embedding: Boolean(row.embedding),
      })),
    },
  };
}

async function readChapterFromIngestionBuffer(slug: string) {
  const fileName = await findChapterFile(slug);

  if (!fileName) {
    return null;
  }

  const raw = await fs.readFile(path.join(RAW_DIR, fileName), "utf-8");
  const cleaned = stripXml(raw);
  const blocks = splitBlocks(cleaned);
  const ema = await readEmaMetadata();

  return {
    slug,
    source: fileName,
    blocks,
    total: blocks.length,
    metadata: {
      emaLoaded: Boolean(ema),
      sourceLayer: "ingestion-buffer/gdrive_raw",
      xmlFiltered: true,
    },
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug") || "7";

  try {
    const fromDatabase = await readChapterFromDatabase(slug);

    if (fromDatabase && fromDatabase.blocks.length > 0) {
      return NextResponse.json(fromDatabase);
    }

    const fromBuffer = await readChapterFromIngestionBuffer(slug);

    if (fromBuffer) {
      return NextResponse.json(fromBuffer);
    }

    return NextResponse.json(
      {
        slug,
        blocks: [],
        total: 0,
        metadata: {
          sourceLayer: "postgres+ingestion-buffer",
          manifest_id: manifestIdFromSlug(slug),
          fileFound: false,
        },
        error: "Chapter source not found in database or ingestion buffer.",
      },
      { status: 404 }
    );
  } catch (err) {
    return NextResponse.json(
      {
        slug,
        blocks: [],
        total: 0,
        metadata: {},
        error: err instanceof Error ? err.message : "Chapter route failure.",
      },
      { status: 500 }
    );
  }
}
