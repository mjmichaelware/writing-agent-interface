import { promises as fs } from "fs";
import { IndexStore } from "./indexStore";

const indexStore = new IndexStore();
const cache = new Map<string, string>();

export async function getFile(name: string) {
  if (cache.has(name)) return cache.get(name)!;

  const index = indexStore.getAll();
  const file = index.find(f => f.filename === name);
  if (!file) throw Error("missing:" + name);

  const raw = await fs.readFile(file.filename, "utf8");
  const clean = raw.replace(/^\uFEFF/, "").replace(/\r/g, "");

  cache.set(name, clean);
  return clean;
}

export async function getAll() {
  return indexStore.getAll();
}

export function split(t: string) {
  return t.split(/\n\s*\n/).map(x => x.trim()).filter(Boolean);
}
