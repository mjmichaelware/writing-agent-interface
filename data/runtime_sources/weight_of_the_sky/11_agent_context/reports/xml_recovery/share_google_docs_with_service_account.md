# Required Google Drive Sharing Step

Share the Google Docs or their containing folder with this service account email:

`wos-drive-docs-reader@ai-job-agent-498702.iam.gserviceaccount.com`

Give it Viewer access.

Until this is done, the terminal extractor cannot see or export those Google Docs.

After sharing, run:

```bash
cd /termux-home/Workspaces/UI_UX_Core_Engine/writing-agent-interface
GOOGLE_APPLICATION_CREDENTIALS=secrets/wos-drive-docs-reader.json node scripts/archive-google-docs-by-local-names.mjs src/data-layer/ingestion-buffer/gdrive_raw
python3 scripts/xml_recovery/materialize_ooxml_raw.py
find src/data-layer/ingestion-buffer/gdrive_ooxml_raw -type f | wc -l
```
