-- Allow authenticated users to read semantic visualization tables
-- These tables have RLS enabled; service_role already has ALL access from prior migrations.

CREATE POLICY "auth_read_meaning_spans" ON semantic_meaning_spans
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "auth_read_meaning_span_edges" ON semantic_meaning_span_edges
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "auth_read_archetype_anchors" ON semantic_archetype_anchors
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "auth_read_biblical_anchors" ON semantic_biblical_anchors
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "auth_read_crosslinks" ON semantic_crosslinks
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "auth_read_run_artifacts" ON semantic_run_artifacts
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "auth_read_semantic_runs" ON semantic_runs
  FOR SELECT TO authenticated USING (true);
