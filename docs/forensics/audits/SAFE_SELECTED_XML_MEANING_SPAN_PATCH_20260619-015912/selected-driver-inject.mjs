function findFilesByName(root, name) {
  try {
    return execFileSync("find", [root, "-type", "f", "-name", name], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] })
      .split("\n")
      .map((x) => x.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

function loadSelectedXmlTruth() {
  const roots = [ROOT, "/storage/emulated/0/Download", process.env.HOME || "", join(process.env.HOME || "", "storage/downloads")].filter(Boolean);
  const candidates = [];
  if (SELECTED_TRUTH_OVERRIDE) candidates.push(SELECTED_TRUTH_OVERRIDE);
  for (const root of roots) candidates.push(...findFilesByName(root, "xml_starred_hash_truth.txt"));
  for (const root of roots) candidates.push(...findFilesByName(root, "xml_starred_hash_doc_folders.txt"));

  for (const p of [...new Set(candidates)].filter((x) => x && existsSync(x))) {
    const text = readText(p);
    const folders = [];
    let inside = /xml_starred_hash_doc_folders\.txt$/.test(p);
    for (const line of text.split(/\r?\n/)) {
      if (/Included XML doc folders:/i.test(line)) {
        inside = true;
        continue;
      }
      if (/Explicitly excluded/i.test(line)) inside = false;
      if (!inside) continue;
      const m = line.match(/(?:-\s*)?(\d{4}_[^\s]+)/);
      if (m) folders.push(m[1]);
    }
    const selected = [...new Set(folders)];
    if (selected.length === 16) return { path: p, sha256: sha256File(p), folders: selected };
  }

  throw new Error("Could not find selected/starred XML truth with exactly 16 folders.");
}

function decodeOoxml(s) {
  return String(s || "")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function paragraphProps(pXml) {
  return {
    style: pXml.match(/<w:pStyle[^>]*w:val="([^"]+)"/)?.[1] || "",
    jc: pXml.match(/<w:jc[^>]*w:val="([^"]+)"/)?.[1] || "",
    firstLine: pXml.match(/<w:ind[^>]*w:firstLine="([^"]+)"/)?.[1] || "",
    left: pXml.match(/<w:ind[^>]*w:left="([^"]+)"/)?.[1] || "",
    hanging: pXml.match(/<w:ind[^>]*w:hanging="([^"]+)"/)?.[1] || "",
    hasNumbering: /<w:numPr[\s>]/.test(pXml),
  };
}

function extractOoxmlParagraphs(xml, folder, docSha) {
  const body = String(xml || "").match(/<w:body[\s\S]*?<\/w:body>/)?.[0] || String(xml || "");
  const out = [];
  const re = /<w:p\b[\s\S]*?<\/w:p>/g;
  let m;
  let index = 0;
  let charCursor = 0;

  while ((m = re.exec(body))) {
    index += 1;
    const pXml = m[0];
    const text = [...pXml.matchAll(/<w:t\b[^>]*>([\s\S]*?)<\/w:t>|<w:tab\b[^>]*\/>|<w:br\b[^>]*\/>/g)]
      .map((x) => x[1] !== undefined ? decodeOoxml(x[1]) : x[0].startsWith("<w:tab") ? "\t" : "\n")
      .join("")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\s+/g, " ")
      .trim();

    const start = charCursor;
    const end = start + text.length;
    charCursor = end + 2;

    out.push({
      xml_paragraph_index: index,
      folder,
      document_xml_sha256: docSha,
      text,
      text_sha256: sha256Text(text),
      start_char: start,
      end_char: end,
      props: paragraphProps(pXml),
      empty: !text,
    });
  }

  return out;
}

function terminalPunctuation(text) {
  return /[.!?…]["”’')\]]?$/.test(String(text || "").trim());
}
function continuationEnd(text) {
  return /[,;:—–-]["”’')\]]?$/.test(String(text || "").trim());
}
function continuationStart(text) {
  return /^[a-z,;:—–\-)\]”’]/.test(String(text || "").trim()) || /^(and|but|or|because|while|when|as|that|which|who|then)\b/i.test(String(text || "").trim());
}
function sceneBreak(text) {
  return /^([*#\-–—_\s]{3,}|chapter\s+\d+|part\s+[ivx]+)$/i.test(String(text || "").trim());
}
function dialogueStart(text) {
  return /^["“]/.test(String(text || "").trim());
}
function shouldStartRenderParagraph(prevText, cur) {
  if (!prevText) return true;
  if (cur.empty) return true;
  if (sceneBreak(prevText) || sceneBreak(cur.text)) return true;
  if (cur.props?.firstLine || cur.props?.style || cur.props?.hasNumbering) return true;
  if (!terminalPunctuation(prevText) || continuationEnd(prevText) || continuationStart(cur.text)) return false;
  if (dialogueStart(cur.text)) return true;
  return true;
}

function buildRenderParagraphs(xmlParagraphs, folder, docSha) {
  const out = [];
  let cur = null;

  const flush = (reason) => {
    if (!cur) return;
    cur.text = cur.text.replace(/\s+/g, " ").trim();
    cur.content = cur.text;
    cur.text_sha256 = sha256Text(cur.text);
    cur.render_para_key = "rp_" + sha256Text([folder, docSha, cur.render_index, cur.text].join("\t")).slice(0, 32);
    cur.id = cur.render_para_key;
    cur.metadata.render_para_key = cur.render_para_key;
    cur.metadata.source_span.render_para_key = cur.render_para_key;
    cur.boundary_reason = cur.boundary_reason || reason;
    cur.metadata.boundary_reason = cur.boundary_reason;
    out.push(cur);
    cur = null;
  };

  for (const xp of xmlParagraphs) {
    if (xp.empty) {
      flush("blank_xml_paragraph_boundary");
      continue;
    }

    if (!cur || shouldStartRenderParagraph(cur.text, xp)) {
      flush("novel_standard_boundary");
      cur = {
        id: "",
        chapter_id: null,
        chunk_index: out.length + 1,
        content: xp.text,
        metadata: {
          selected_xml_driver: true,
          source_doc_folder: folder,
          document_xml_sha256: docSha,
          source_xml_paragraph_indexes: [xp.xml_paragraph_index],
          source_span: {
            source_doc_folder: folder,
            document_xml_sha256: docSha,
            source_xml_paragraph_indexes: [xp.xml_paragraph_index],
            start_char: xp.start_char,
            end_char: xp.end_char,
          },
          boundary_method: "xml_plus_novel_grammar_v4",
          boundary_confidence: xp.props.firstLine || xp.props.style ? 0.92 : 0.76,
          boundary_reason: xp.props.firstLine ? "xml_first_line_indent" : xp.props.style ? "xml_style_" + xp.props.style : "novel_grammar_boundary",
          xml_props: xp.props,
        },
        folder,
        document_xml_sha256: docSha,
        render_index: out.length + 1,
        text: xp.text,
        start_char: xp.start_char,
        end_char: xp.end_char,
        source_xml_paragraph_indexes: [xp.xml_paragraph_index],
        boundary_method: "xml_plus_novel_grammar_v4",
        boundary_confidence: xp.props.firstLine || xp.props.style ? 0.92 : 0.76,
        boundary_reason: xp.props.firstLine ? "xml_first_line_indent" : xp.props.style ? "xml_style_" + xp.props.style : "novel_grammar_boundary",
      };
    } else {
      cur.text += " " + xp.text;
      cur.content = cur.text;
      cur.end_char = xp.end_char;
      cur.source_xml_paragraph_indexes.push(xp.xml_paragraph_index);
      cur.metadata.source_xml_paragraph_indexes = cur.source_xml_paragraph_indexes;
      cur.metadata.source_span.source_xml_paragraph_indexes = cur.source_xml_paragraph_indexes;
      cur.metadata.source_span.end_char = xp.end_char;
      cur.boundary_confidence = Math.min(cur.boundary_confidence, 0.63);
      cur.metadata.boundary_confidence = cur.boundary_confidence;
      cur.metadata.merge_reason = "continued_sentence_or_lowercase_start";
    }
  }

  flush("end_of_document");
  return out;
}

function buildSceneWindows(renderParagraphs, size = Math.max(1, BATCH_SIZE)) {
  const out = [];
  for (let i = 0; i < renderParagraphs.length; i += size) {
    const chunk = renderParagraphs.slice(i, i + size);
    const text = chunk.map((p) => p.text).join("\n\n");
    out.push({
      scene_window_key: "scene_" + sha256Text([chunk[0]?.folder || "", i, text].join("\t")).slice(0, 32),
      folder: chunk[0]?.folder || "",
      document_xml_sha256: chunk[0]?.document_xml_sha256 || "",
      render_paragraphs: chunk,
      text,
      text_sha256: sha256Text(text),
    });
  }
  return out;
}

function loadSelectedXmlDocuments() {
  const selected = loadSelectedXmlTruth();
  let folders = selected.folders;

  if (CHAPTER_FILTER) {
    const n = String(CHAPTER_FILTER);
    folders = folders.filter((f) =>
      f.toLowerCase().includes(`chapter_${n}`) ||
      f.toLowerCase().includes(`chapter${n}`) ||
      f.toLowerCase().includes(`chapter_${n}_`)
    );
  }

  if (LIMIT_DOCS) folders = folders.slice(0, LIMIT_DOCS);

  const docs = [];
  for (const folder of folders) {
    const documentPath = join(paths.ooxmlRaw, folder, "word", "document.xml");
    must(existsSync(documentPath), `Selected folder missing word/document.xml: ${folder}`);
    const docSha = sha256File(documentPath);
    const xmlParagraphs = extractOoxmlParagraphs(readText(documentPath), folder, docSha);
    const renderParagraphs = buildRenderParagraphs(xmlParagraphs, folder, docSha);
    const sceneWindows = buildSceneWindows(renderParagraphs);
    const fullText = renderParagraphs.map((p) => p.text).join("\n\n");

    docs.push({
      folder,
      document_path: documentPath,
      document_xml_sha256: docSha,
      xml_paragraphs: xmlParagraphs.filter((p) => !p.empty),
      render_paragraphs: renderParagraphs,
      scene_windows: sceneWindows,
      full_text_sha256: sha256Text(fullText),
    });
  }

  return { selected, docs };
}

function selectedXmlWindows(docs) {
  const windows = docs.flatMap((doc) =>
    doc.scene_windows.map((w) => ({
      ...w,
      folder: doc.folder,
      document_xml_sha256: doc.document_xml_sha256,
    }))
  );
  return LIMIT ? windows.slice(0, LIMIT) : windows;
}

function renderParagraphRowsForDb(semanticRun, docs) {
  return docs.flatMap((doc) =>
    doc.render_paragraphs.map((p) => ({
      semantic_run_id: semanticRun.id,
      source_doc_folder: doc.folder,
      source_document_xml_sha256: doc.document_xml_sha256,
      render_para_key: p.render_para_key,
      render_index: p.render_index,
      text: p.text,
      text_sha256: p.text_sha256,
      start_char: p.start_char,
      end_char: p.end_char,
      source_xml_paragraph_indexes: p.source_xml_paragraph_indexes,
      boundary_method: p.boundary_method,
      boundary_confidence: p.boundary_confidence,
      boundary_reason: p.boundary_reason,
      metadata: p.metadata || {},
      active: true,
    }))
  );
}

function xmlEvidenceForWindow(window) {
  return [{
    source: `selected_xml:${window.folder}`,
    part_path: "word/document.xml",
    sha256: window.document_xml_sha256,
    scene_window_key: window.scene_window_key,
    selected_xml_driver: true,
    text: clip(window.text, 12000),
  }];
}

function buildSelectedXmlPrompt({ contextPack, availableNarrativeContextMap, window }) {
  const base = buildPrompt({
    contextPack,
    availableNarrativeContextMap,
    chapter: {
      chapter_number: null,
      path: `selected_xml:${window.folder}`,
      sha256: window.text_sha256,
    },
    xmlEvidence: xmlEvidenceForWindow(window),
    paragraphs: window.render_paragraphs,
  });

  return `${base}

SELECTED XML HASHING OVERRIDE:
- Source truth for this batch is selected/starred XML: word/document.xml plus its sha256 and source spans.
- Public chapter text, compendium, synopsis, and narrative context pack are interpretive context only. They do not drive source hashing.
- The paragraph_id values above are render_para_key coordinates for Layer 3, not database paragraph UUIDs.
- Render paragraphs are display/navigation coordinates, not semantic truth boundaries.
- Meaning spans may be smaller than a render paragraph, larger than a render paragraph, overlapping, or discontinuous.
- Preserve the mature PR6 output categories: archetype_observations, biblical_references, derived_hyperlinks, dualism_relations, dualism_relation_evidence, and archetype_movements.
- For every claim, quote exact evidence_text from selected XML render paragraphs when possible.
- If whole-story context affects interpretation, mark it as context support in the interpretation. Do not treat it as the source span.
- Do not invent missing chapter prose, missing biblical references, or unsupported mirrors.
- Return the original PR6 JSON shape only.
`;
}

function sourceSpanForParagraph(paragraph) {
  return paragraph?.metadata?.source_span || {
    render_para_key: paragraph?.render_para_key || paragraph?.id || null,
    source_doc_folder: paragraph?.folder || null,
    document_xml_sha256: paragraph?.document_xml_sha256 || null,
    source_xml_paragraph_indexes: paragraph?.source_xml_paragraph_indexes || [],
  };
}

function meaningSpanRow({ semanticRun, family, spanType, label, subjectName, evidenceText, interpretation, confidence, sourceSpan, promptHash, outputHash, raw }) {
  const semanticHash = sha256Text(canonicalJson({
    selected_xml_driver: true,
    semantic_run_id: semanticRun.id,
    family,
    spanType,
    label,
    subjectName,
    evidenceText,
    interpretation,
    sourceSpan,
    raw,
    promptHash,
    outputHash,
  }));

  return {
    semantic_run_id: semanticRun.id,
    span_key: "mspan_" + semanticHash.slice(0, 32),
    span_type: spanType || family,
    claim_family: family,
    label: label || null,
    subject_name: subjectName || null,
    evidence_text: evidenceText || null,
    evidence_sha256: evidenceText ? sha256Text(evidenceText) : null,
    source_span: sourceSpan || {},
    interpretation: interpretation || null,
    confidence: Number(confidence || 0),
    prompt_sha256: promptHash,
    model_output_sha256: outputHash,
    semantic_hash: semanticHash,
    metadata: {
      selected_xml_driver: true,
      primary_lane: "semantic_meaning_spans",
      old_table_mirror_blocked_on_first_run: true,
      prompt_version: PROMPT_VERSION,
      model: VERTEX_MODEL,
      raw,
    },
    active: true,
  };
}

function meaningSpanRowsFromResult({ semanticRun, window, result, promptHash, outputHash }) {
  const rows = [];
  const paragraphMap = new Map(window.render_paragraphs.map((p) => [p.id, p]));

  for (const pr of Array.isArray(result.paragraphs) ? result.paragraphs : []) {
    const paragraph = paragraphMap.get(pr.paragraph_id) || window.render_paragraphs.find((p) => p.render_para_key === pr.paragraph_id) || null;
    const sourceSpan = sourceSpanForParagraph(paragraph);

    for (const a of pr.archetype_observations || []) {
      rows.push(meaningSpanRow({
        semanticRun,
        family: "archetype",
        spanType: "archetype_observation",
        label: a.archetype,
        subjectName: a.subject_name,
        evidenceText: a.evidence_text,
        interpretation: a.interpretation,
        confidence: a.confidence,
        sourceSpan,
        promptHash,
        outputHash,
        raw: a,
      }));
    }

    for (const b of pr.biblical_references || []) {
      rows.push(meaningSpanRow({
        semanticRun,
        family: "biblical",
        spanType: "biblical_reference",
        label: b.reference_text,
        subjectName: b.book,
        evidenceText: b.evidence_text,
        interpretation: b.interpretation,
        confidence: b.confidence,
        sourceSpan: { ...sourceSpan, biblical_source_span: b.source_span || {} },
        promptHash,
        outputHash,
        raw: b,
      }));
    }

    for (const h of pr.derived_hyperlinks || []) {
      rows.push(meaningSpanRow({
        semanticRun,
        family: "hyperlink",
        spanType: "derived_hyperlink",
        label: [h.theme_node_a, h.theme_node_b].filter(Boolean).join(" ↔ "),
        subjectName: h.edge_type || h.connection_type,
        evidenceText: h.evidence_text,
        interpretation: h.connection_type,
        confidence: h.confidence,
        sourceSpan,
        promptHash,
        outputHash,
        raw: h,
      }));
    }
  }

  for (const d of Array.isArray(result.dualism_relations) ? result.dualism_relations : []) {
    const evidenceText = Array.isArray(d.evidence) ? d.evidence.map((e) => e.evidence_text || "").filter(Boolean).join("\n---\n") : "";
    rows.push(meaningSpanRow({
      semanticRun,
      family: "dualism",
      spanType: "dualism_relation",
      label: d.relation_type || d.shared_substrate,
      subjectName: null,
      evidenceText,
      interpretation: d.interpretation,
      confidence: d.confidence,
      sourceSpan: {
        scene_window_key: window.scene_window_key,
        evidence: d.evidence || [],
        pole_a: d.pole_a || {},
        pole_b: d.pole_b || {},
      },
      promptHash,
      outputHash,
      raw: d,
    }));
  }

  for (const m of Array.isArray(result.archetype_movements) ? result.archetype_movements : []) {
    rows.push(meaningSpanRow({
      semanticRun,
      family: "archetype",
      spanType: "archetype_movement",
      label: m.arc_label,
      subjectName: m.subject_name,
      evidenceText: m.evidence_summary,
      interpretation: m.interpretation,
      confidence: m.confidence,
      sourceSpan: {
        scene_window_key: window.scene_window_key,
        start_paragraph_id: m.start_paragraph_id,
        end_paragraph_id: m.end_paragraph_id,
      },
      promptHash,
      outputHash,
      raw: m,
    }));
  }

  return rows;
}

function emptySemanticResult() {
  return { paragraphs: [], dualism_relations: [], archetype_movements: [] };
}

async function writeSelectedSemanticResult({ semanticRun, window, result, promptHash, outputHash }) {
  const spanRows = meaningSpanRowsFromResult({ semanticRun, window, result, promptHash, outputHash });

  if (!writeMode) {
    console.log(JSON.stringify({
      dry_run_selected_window: window.scene_window_key,
      render_para_keys: window.render_paragraphs.map((p) => p.render_para_key),
      old_semantic_table_writes: "blocked",
      primary_lane: "semantic_meaning_spans",
      paragraph_results: Array.isArray(result.paragraphs) ? result.paragraphs.length : 0,
      dualism_relations: Array.isArray(result.dualism_relations) ? result.dualism_relations.length : 0,
      archetype_movements: Array.isArray(result.archetype_movements) ? result.archetype_movements.length : 0,
      semantic_meaning_spans: spanRows.length,
    }, null, 2));
    return spanRows;
  }

  if (spanRows.length) await insertRows("semantic_meaning_spans?on_conflict=semantic_hash", spanRows);
  return spanRows;
}
