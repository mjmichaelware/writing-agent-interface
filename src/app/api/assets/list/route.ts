import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const ASSETS_DIR = path.join(process.cwd(), "public/assets");
const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);

export async function GET() {
  try {
    const entries = await fs.readdir(ASSETS_DIR);
    const images = entries.filter(f => IMAGE_EXT.has(path.extname(f).toLowerCase()));
    return NextResponse.json({ assets: images.map(f => `/assets/${f}`) });
  } catch {
    return NextResponse.json({ assets: [] });
  }
}
