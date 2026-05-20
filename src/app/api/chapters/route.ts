import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

export const dynamic = "force-dynamic";

const RAW_DIR = path.join(
  process.cwd(),
  "src/data-layer/ingestion-buffer/gdrive_raw"
);

const EMA_HISTORY = path.join(
  process.cwd(),
  "src/data-layer/version-archive/ema_history.json"
);

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

async function findChapterFile(slug: string) {
  const files = await fs.readdir(RAW_DIR);

  const hints = [
    `chapter_${slug}`,
    `chapter-${slug}`,
    `chapter ${slug}`,
    `ch${slug}`,
    `ch_${slug}`,
    slug,
  ];

  return files.find((file) =>
    hints.some((hint) => file.toLowerCase().includes(hint.toLowerCase()))
  );
}

async function readEmaMetadata() {
  try {
    const raw = await fs.readFile(EMA_HISTORY, "utf-8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug") || "7";

  try {
    const fileName = await findChapterFile(slug);

    if (!fileName) {
      return NextResponse.json(
        {
          slug,
          blocks: [],
          total: 0,
          metadata: {
            sourceLayer: "ingestion-buffer/gdrive_raw",
            fileFound: false,
          },
          error: "Chapter source file not found.",
        },
        { status: 404 }
      );
    }

    const raw = await fs.readFile(path.join(RAW_DIR, fileName), "utf-8");
    const cleaned = stripXml(raw);
    const blocks = splitBlocks(cleaned);
    const ema = await readEmaMetadata();

    return NextResponse.json({
      slug,
      source: fileName,
      blocks,
      total: blocks.length,
      metadata: {
        emaLoaded: Boolean(ema),
        sourceLayer: "ingestion-buffer/gdrive_raw",
        xmlFiltered: true,
      },
    });
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
