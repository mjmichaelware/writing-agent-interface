#!/usr/bin/env node
import { createHash } from "node:crypto";
import { readFileSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();

const expectedContextSha =
  "6e7e306c32940db56e82f1aff23942e6f3d62d7483db8e5735bb2ef2ef75eb8c";
const expectedXmlManifestSha =
  "bca8eeacca6a9dd260d50a14a8b2dce9f2f2e759dd16a5cc3ef2ee06d0a1b970";
const expectedXmlManifestCount = 579;

const paths = {
  contextPack: join(ROOT, "docs/agent_context/source_drop/hasher_context_v1/narrative_context_pack_v1.txt"),
  xmlManifest: join(ROOT, "reports/xml_recovery/materialized_ooxml_manifest.json"),
  ooxmlRaw: join(ROOT, "src/data-layer/ingestion-buffer/gdrive_ooxml_raw"),
  publicChapters: join(ROOT, "public/data/chapters"),
};

function sha256(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function assert(condition, message) {
  if (!condition) {
    console.error(`FAIL: ${message}`);
    process.exitCode = 1;
  } else {
    console.log(`OK: ${message}`);
  }
}

assert(existsSync(paths.contextPack), `context pack exists: ${paths.contextPack}`);
assert(existsSync(paths.xmlManifest), `XML manifest exists: ${paths.xmlManifest}`);
assert(existsSync(paths.ooxmlRaw), `OOXML raw root exists: ${paths.ooxmlRaw}`);
assert(existsSync(paths.publicChapters), `public chapter txt root exists: ${paths.publicChapters}`);

if (existsSync(paths.contextPack)) {
  const actual = sha256(paths.contextPack);
  assert(actual === expectedContextSha, `context sha matches ${actual}`);
  console.log(`context_bytes=${statSync(paths.contextPack).size}`);
}

if (existsSync(paths.xmlManifest)) {
  const actual = sha256(paths.xmlManifest);
  const manifest = JSON.parse(readFileSync(paths.xmlManifest, "utf8"));
  assert(actual === expectedXmlManifestSha, `XML manifest sha matches ${actual}`);
  assert(Array.isArray(manifest), "XML manifest is array");
  assert(manifest.length === expectedXmlManifestCount, `XML manifest count is ${manifest.length}`);
  console.log(`xml_manifest_bytes=${statSync(paths.xmlManifest).size}`);
}
