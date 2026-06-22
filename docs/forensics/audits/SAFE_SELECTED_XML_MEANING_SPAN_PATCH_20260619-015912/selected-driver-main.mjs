async function main() {
  validateSources();
  const contextPack = readText(paths.contextPack);
  const chapters = loadPublicChapters();
  const availableNarrativeContextMap = buildAvailableNarrativeContextMap(chapters);
  const { selected, docs } = loadSelectedXmlDocuments();
  const windows = selectedXmlWindows(docs);

  const sourceSummary = {
    context_pack_sha256: NARRATIVE_CONTEXT_SHA256,
    xml_manifest_sha256: XML_MANIFEST_SHA256,
    xml_manifest_count: XML_MANIFEST_COUNT,
    selected_truth_path: selected.path,
    selected_truth_sha256: selected.sha256,
    selected_folder_count: selected.folders.length,
    run_doc_count: docs.length,
    xml_paragraph_count: docs.reduce((sum, doc) => sum + doc.xml_paragraphs.length, 0),
    render_paragraph_count: docs.reduce((sum, doc) => sum + doc.render_paragraphs.length, 0),
    scene_window_count: windows.length,
    public_chapter_context_count: chapters.length,
    available_narrative_context_map: true,
    available_narrative_context_map_sha256: sha256Text(availableNarrativeContextMap),
    selected_xml_driver: true,
    render_segmentation: "xml_plus_novel_grammar_v4",
    primary_hash_lane: "semantic_meaning_spans",
    old_semantic_table_writes: "blocked_on_first_run",
    write_mode: writeMode,
    no_ai: noAi,
  };

  writeFileSync(join(paths.outDir, "source-summary.json"), JSON.stringify(sourceSummary, null, 2));
  writeFileSync(join(paths.outDir, "selected-truth.json"), JSON.stringify(selected, null, 2));
  writeFileSync(join(paths.outDir, "selected-documents.jsonl"), docs.map((doc) => JSON.stringify({
    folder: doc.folder,
    document_path: doc.document_path,
    document_xml_sha256: doc.document_xml_sha256,
    xml_paragraph_count: doc.xml_paragraphs.length,
    render_paragraph_count: doc.render_paragraphs.length,
    scene_window_count: doc.scene_windows.length,
    full_text_sha256: doc.full_text_sha256,
  })).join("\n") + "\n");
  writeFileSync(join(paths.outDir, "render-paragraphs.jsonl"), docs.flatMap((doc) => doc.render_paragraphs).map((p) => JSON.stringify(p)).join("\n") + "\n");
  writeFileSync(join(paths.outDir, "scene-windows.jsonl"), windows.map((w) => JSON.stringify({
    scene_window_key: w.scene_window_key,
    folder: w.folder,
    document_xml_sha256: w.document_xml_sha256,
    render_para_keys: w.render_paragraphs.map((p) => p.render_para_key),
    text_sha256: w.text_sha256,
  })).join("\n") + "\n");

  const semanticRun = await createSemanticRun(sourceSummary);

  if (writeMode) {
    await insertRows("render_paragraphs?on_conflict=render_para_key", renderParagraphRowsForDb(semanticRun, docs));
  }

  let totalProcessed = 0;
  let totalMeaningSpans = 0;

  for (const window of windows) {
    const prompt = buildSelectedXmlPrompt({ contextPack, availableNarrativeContextMap, window });
    const promptHash = sha256Text(prompt);

    writeFileSync(join(paths.outDir, `prompt-selected-${String(totalProcessed).padStart(5, "0")}.txt`), prompt);
    writeFileSync(join(paths.outDir, `prompt-selected-${String(totalProcessed).padStart(5, "0")}.sha256`), `${promptHash}\n`);

    const result = noAi ? emptySemanticResult() : await callVertex(prompt);
    const outputText = JSON.stringify(result, null, 2);
    const outputHash = sha256Text(outputText);

    writeFileSync(join(paths.outDir, `result-selected-${String(totalProcessed).padStart(5, "0")}.json`), outputText);
    writeFileSync(join(paths.outDir, `result-selected-${String(totalProcessed).padStart(5, "0")}.sha256`), `${outputHash}\n`);

    const spanRows = await writeSelectedSemanticResult({ semanticRun, window, result, promptHash, outputHash });
    totalMeaningSpans += spanRows.length;

    writeFileSync(
      join(paths.outDir, `meaning-spans-selected-${String(totalProcessed).padStart(5, "0")}.jsonl`),
      spanRows.map((r) => JSON.stringify(r)).join("\n") + (spanRows.length ? "\n" : "")
    );

    totalProcessed += 1;

    console.log(JSON.stringify({
      run_id: semanticRun.id,
      selected_xml_driver: true,
      old_semantic_table_writes: "blocked",
      primary_lane: "semantic_meaning_spans",
      window: window.scene_window_key,
      folder: window.folder,
      processed_windows: totalProcessed,
      total_windows: windows.length,
      meaning_spans: totalMeaningSpans,
      no_ai: noAi,
      write_mode: writeMode,
      prompt_hash: promptHash,
      output_hash: outputHash,
    }));
  }

  if (writeMode) {
    await patchRow("semantic_runs", semanticRun.id, {
      status: "completed",
      completed_at: new Date().toISOString(),
      metadata: {
        ...(semanticRun.metadata || {}),
        total_processed_windows: totalProcessed,
        total_meaning_spans: totalMeaningSpans,
        selected_xml_driver: true,
        primary_hash_lane: "semantic_meaning_spans",
        old_semantic_table_writes: "blocked_on_first_run",
      },
    });
  }

  writeFileSync(join(paths.outDir, "run-summary.json"), JSON.stringify({
    run_id: semanticRun.id,
    write_mode: writeMode,
    no_ai: noAi,
    selected_xml_driver: true,
    primary_hash_lane: "semantic_meaning_spans",
    old_semantic_table_writes: "blocked_on_first_run",
    total_processed_windows: totalProcessed,
    total_meaning_spans: totalMeaningSpans,
    narrative_context_sha256: NARRATIVE_CONTEXT_SHA256,
    xml_manifest_sha256: XML_MANIFEST_SHA256,
    provider: noAi ? "none" : "vertex",
    model: noAi ? "no-ai" : VERTEX_MODEL,
    sourceSummary,
  }, null, 2));
}
