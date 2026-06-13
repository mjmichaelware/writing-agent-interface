// Active runtime source reader for Weight of the Sky.
//
// These documents are not archives. They are active runtime inputs for:
// - typography
// - layer-to-cinema rendering
// - manuscript state
// - lore/worldbuilding
// - synopsis/compendium context
// - revision-aware source recovery
//
// This module is server-side only.

import fs from "node:fs";
import path from "node:path";

export const RUNTIME_SOURCE_ROOT = "data/runtime_sources/weight_of_the_sky";

export const RUNTIME_SOURCE_PATHS = {
  protocols: "data/runtime_sources/weight_of_the_sky/00_protocols",
  rendererActiveInputs: "data/runtime_sources/weight_of_the_sky/01_renderer_active_inputs",
  typographySources: "data/runtime_sources/weight_of_the_sky/02_typography_sources",
  layerToCinemaSources: "data/runtime_sources/weight_of_the_sky/03_layer_to_cinema_sources",
  currentFinalDrafts: "data/runtime_sources/weight_of_the_sky/04_current_final_drafts",
  revisionSnapshots: "data/runtime_sources/weight_of_the_sky/05_revision_snapshots",
  currentOoxml: "data/runtime_sources/weight_of_the_sky/06_ooxml_current",
  revisionOoxml: "data/runtime_sources/weight_of_the_sky/07_ooxml_revision_exports",
  worldbuildingLore: "data/runtime_sources/weight_of_the_sky/08_worldbuilding_lore",
  synopsisCompendiums: "data/runtime_sources/weight_of_the_sky/09_synopsis_compendiums",
  ingestionBaselines: "data/runtime_sources/weight_of_the_sky/10_ingestion_baselines",
  agentContext: "data/runtime_sources/weight_of_the_sky/11_agent_context",
  supabaseIndexes: "data/runtime_sources/weight_of_the_sky/12_supabase_indexes",
  manualSortInbox: "data/runtime_sources/weight_of_the_sky/99_manual_sort_inbox",
  quarantineDoNotIngest: "data/runtime_sources/weight_of_the_sky/99_quarantine_do_not_ingest",
} as const;

const TEXT_EXTENSIONS = new Set([
  ".txt",
  ".md",
  ".markdown",
  ".json",
  ".jsonl",
  ".xml",
  ".rels",
  ".sql",
  ".csv",
  ".tsv",
]);

export type RuntimeSourceKind =
  | "protocol"
  | "renderer_active_input"
  | "typography_source"
  | "layer_to_cinema_source"
  | "current_final_draft"
  | "revision_snapshot"
  | "current_ooxml"
  | "revision_ooxml"
  | "worldbuilding_lore"
  | "synopsis_compendium"
  | "ingestion_baseline"
  | "agent_context"
  | "supabase_index"
  | "manual_sort_inbox"
  | "quarantine_do_not_ingest"
  | "unknown";

export type RuntimeSourceRecord = {
  path: string;
  absolutePath: string;
  filename: string;
  extension: string;
  kind: RuntimeSourceKind;
  bytes: number;
  readableText: boolean;
  preview?: string;
};

function getKind(relativePath: string): RuntimeSourceKind {
  if (relativePath.startsWith("00_protocols/")) return "protocol";
  if (relativePath.startsWith("01_renderer_active_inputs/")) return "renderer_active_input";
  if (relativePath.startsWith("02_typography_sources/")) return "typography_source";
  if (relativePath.startsWith("03_layer_to_cinema_sources/")) return "layer_to_cinema_source";
  if (relativePath.startsWith("04_current_final_drafts/")) return "current_final_draft";
  if (relativePath.startsWith("05_revision_snapshots/")) return "revision_snapshot";
  if (relativePath.startsWith("06_ooxml_current/")) return "current_ooxml";
  if (relativePath.startsWith("07_ooxml_revision_exports/")) return "revision_ooxml";
  if (relativePath.startsWith("08_worldbuilding_lore/")) return "worldbuilding_lore";
  if (relativePath.startsWith("09_synopsis_compendiums/")) return "synopsis_compendium";
  if (relativePath.startsWith("10_ingestion_baselines/")) return "ingestion_baseline";
  if (relativePath.startsWith("11_agent_context/")) return "agent_context";
  if (relativePath.startsWith("12_supabase_indexes/")) return "supabase_index";
  if (relativePath.startsWith("99_manual_sort_inbox/")) return "manual_sort_inbox";
  if (relativePath.startsWith("99_quarantine_do_not_ingest/")) return "quarantine_do_not_ingest";
  return "unknown";
}

function walkFiles(root: string): string[] {
  if (!fs.existsSync(root)) return [];

  const files: string[] = [];
  const stack = [root];

  while (stack.length) {
    const current = stack.pop();
    if (!current) continue;

    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);

      if (entry.isDirectory()) {
        stack.push(full);
      } else if (entry.isFile()) {
        files.push(full);
      }
    }
  }

  return files.sort();
}

function safePreview(fullPath: string, maxChars: number): string | undefined {
  try {
    const ext = path.extname(fullPath).toLowerCase();
    if (!TEXT_EXTENSIONS.has(ext)) return undefined;

    const text = fs.readFileSync(fullPath, "utf8");
    return text.slice(0, maxChars);
  } catch {
    return undefined;
  }
}

export function listRuntimeSources(options?: {
  includePreview?: boolean;
  maxPreviewChars?: number;
  kind?: RuntimeSourceKind;
}): RuntimeSourceRecord[] {
  const root = path.resolve(process.cwd(), RUNTIME_SOURCE_ROOT);
  const maxPreviewChars = options?.maxPreviewChars ?? 800;

  const records = walkFiles(root).map((absolutePath) => {
    const relFromRoot = path.relative(root, absolutePath).split(path.sep).join("/");
    const projectRelative = path.relative(process.cwd(), absolutePath).split(path.sep).join("/");
    const stat = fs.statSync(absolutePath);
    const ext = path.extname(absolutePath).toLowerCase();
    const readableText = TEXT_EXTENSIONS.has(ext);

    const record: RuntimeSourceRecord = {
      path: projectRelative,
      absolutePath,
      filename: path.basename(absolutePath),
      extension: ext,
      kind: getKind(relFromRoot),
      bytes: stat.size,
      readableText,
    };

    if (options?.includePreview && readableText) {
      record.preview = safePreview(absolutePath, maxPreviewChars);
    }

    return record;
  });

  if (options?.kind) return records.filter((record) => record.kind === options.kind);
  return records;
}

export function getRuntimeSourceSummary() {
  const records = listRuntimeSources();

  const byKind = records.reduce<Record<string, { files: number; bytes: number }>>((acc, record) => {
    acc[record.kind] ??= { files: 0, bytes: 0 };
    acc[record.kind].files += 1;
    acc[record.kind].bytes += record.bytes;
    return acc;
  }, {});

  return {
    root: RUNTIME_SOURCE_ROOT,
    totalFiles: records.length,
    totalBytes: records.reduce((sum, record) => sum + record.bytes, 0),
    byKind,
  };
}
