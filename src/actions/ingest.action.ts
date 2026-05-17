import { CorpusLoader } from "../services/memory-engine/corpus-loader";

async function main() {
  const loader = new CorpusLoader();
  await loader.ingestCorpus();
  console.log("Ingest complete.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Ingest failed:", err);
  process.exit(1);
});
