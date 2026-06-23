CREATE TABLE IF NOT EXISTS semantic_window_task_checkpoints (
  checkpoint_key TEXT PRIMARY KEY,
  source_doc_folder TEXT NOT NULL,
  source_document_xml_sha256 TEXT NOT NULL,
  scene_window_id TEXT NOT NULL,
  task_name TEXT NOT NULL,
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  prompt_version TEXT NOT NULL,
  prompt_sha256 TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'running', 'completed', 'empty', 'rejected', 'failed')),
  semantic_run_id UUID REFERENCES semantic_runs(id) ON DELETE SET NULL,
  attempt_count INTEGER NOT NULL DEFAULT 0,
  result_count INTEGER NOT NULL DEFAULT 0,
  last_error_type TEXT,
  last_error_message TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_semantic_window_task_checkpoints_source_window_task
  ON semantic_window_task_checkpoints (source_doc_folder, source_document_xml_sha256, scene_window_id, task_name);

CREATE INDEX IF NOT EXISTS idx_semantic_window_task_checkpoints_status
  ON semantic_window_task_checkpoints (status);

CREATE INDEX IF NOT EXISTS idx_semantic_window_task_checkpoints_semantic_run
  ON semantic_window_task_checkpoints (semantic_run_id);

CREATE OR REPLACE FUNCTION update_semantic_window_task_checkpoints_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_semantic_window_task_checkpoints_updated_at
  ON semantic_window_task_checkpoints;

CREATE TRIGGER update_semantic_window_task_checkpoints_updated_at
  BEFORE UPDATE ON semantic_window_task_checkpoints
  FOR EACH ROW
  EXECUTE FUNCTION update_semantic_window_task_checkpoints_updated_at_column();
