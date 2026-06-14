# THE WEIGHT OF THE SKY — NARRATIVE OS PROJECT HANDOFF

**Document Date:** May 12, 2026  
**Status:** Active Development — File Sync Crisis  
**Owner:** Michael Alonzo Prentice Ware

---

## EXECUTIVE SUMMARY

Building a **Narrative Operating System** for "The Weight of the Sky" novel. The system is meant to:
- Run locally on Termux (Android/Arch64)
- Serve UI via localhost:3000
- Work offline without cloud dependency
- Eventually package as native iOS/Android via Capacitor

**Current Blocker:** File synchronization and ingestion. Google Drive has ~933 files. Local app has 182 files. Attempt to deduplicate and identify what's truly missing has failed repeatedly.

---

## PROJECT STRUCTURE

### Repository Location
`~/writing-agent-interface/`

### Codebase Status (191 files, 64 directories)
- **src/app/** — Next.js frontend pages & API routes (NOT YET WIRED)
- **src/components/ui/** — React components (character-view, editor, graph-view, memory-panel, sidebar, timeline)
- **src/core/** — Type definitions & constants (document-types, narrative-types, graph-types)
- **src/services/** — 4 core engines (all SKELETON ONLY, no implementation):
  - Memory Engine (corpus-loader, embedding-processor, vector-store, etc.)
  - Retrieval Engine (fulltext-searcher, vector-searcher, relevance-ranker)
  - Narrative Graph Engine (node-builder, edge-builder, graph-serializer, path-finder)
  - Writing Agent (agent-kernel, prompt-controller, generation-executor)
- **src/data-layer/** — File storage & ingestion:
  - `ingestion-buffer/gdrive_raw/` — Local copies of Drive files (182 files, mostly .txt)
  - `entities/` — 25 entity folders (entity-01 through entity-25, currently empty)
  - Other subdirs (aggregation-engine, disposal-bin, reference-data, static-assets, version-archive)

### 4 Core Engine Architecture (NOT IMPLEMENTED)
1. **Memory Engine** — Loads corpus, generates embeddings, stores in vector DB
2. **Retrieval Engine** — Vector search + fulltext search + ranking
3. **Narrative Graph Engine** — Builds nodes (character/scene/event/object/theme), edges (appears_in/causes/foreshadows/contradicts)
4. **Writing Agent** — Orchestrates everything, injects memory, controls generation

### 5 Intelligence Modes (NOT CREATED)
- Mode 1: Draft Analysis (compare versions, EMA across drafts)
- Mode 2: Hyperlink Visualization (biblical echoes, foreshadows, archetypal symbols)
- Mode 3: Content-to-Image (select passage → image generation prompt)
- Mode 4: Semantic Search (find by character density, theme, concept)
- Mode 5: Question Answering (ask about the book, get contextual answers)

---

## GOOGLE DRIVE STATUS

### Credentials Setup
- OAuth credentials stored at: `~/.gdrive_secrets/credentials.json`
- **Issue:** Initially broken (client_secret.json instead of authorized_user credentials)
- **Fix Applied:** Extracted refresh_token from rclone config at `~/.config/rclone/rclone.conf` and built proper credentials.json
- **Current Status:** Credentials file exists; refresh_token should work

### File Inventory
- **Google Drive:** 933 files total
- **Local App:** 182 files in `ingestion-buffer/gdrive_raw/`
- **Supposedly Missing:** ~751 files

---

## SYNC/DEDUP ATTEMPTS (ALL FAILED)

### Attempt 1: Basic rclone + comm
- Used `rclone lsf` + simple filename comparison
- **Issue:** Pagination broken (only got 1000 Drive files, not full set)
- **Issue:** Filename matching ignored extensions & special chars

### Attempt 2: ID-based Google Drive API script
- Built Python script using google-auth-oauthlib + googleapiclient
- **Status:** Auth failed (credentials.json was malformed)
- Pagination was fixed but couldn't proceed

### Attempt 3: Extract credentials from rclone
- Pulled refresh_token from rclone.conf
- Built authorized_user credentials.json
- **Status:** Credentials file created; auth should work now

### Attempt 4: Raw file comparison without normalization
```bash
rclone lsf gdrive:/ > ~/drive_all.txt
ls -1 ~/writing-agent-interface/docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw > ~/local_all.txt
comm -23 ~/drive_all.txt ~/local_all.txt > DRIVE_NOT_LOCAL_RAW.txt
```
- **Result:** ~460 files marked as "missing"
- **Problem:** Included extensions, spaces vs underscores, punctuation variants

### Attempt 5: Dedup with extension stripping
```bash
cat ~/drive_not_local_raw.txt | sed 's/\.[a-zA-Z0-9]*$//' | sed 's/ /_/g' | sort -u
```
- **Result:** 293 supposedly unique files
- **Problem:** Still had many duplicates; didn't normalize special chars

### Attempt 6: Full normalization (strip ALL special chars)
```python
def normalize(name):
    clean = re.sub(r'[^a-z0-9\s]', '', name.lower())
    return ' '.join(clean.split())
```
- **Result:** ACTUALLY_NEW_FILES.txt with 561 files
- **Problem:** User points out this still includes files that ARE in the local project
- **Root cause:** Not actually comparing normalized local files against normalized Drive files; only normalized Drive, not local

---

## WHY DEDUP KEEPS FAILING

The core logic error:
1. I normalize Drive filenames
2. I DO NOT normalize local filenames the same way
3. I compare mismatched normalized vs non-normalized
4. Result: False positives (files that exist locally but show as "new")

**Example:**
- Local: `10.0_MASTER_SYSTEM_FOR_CHAPTER_REVISION.txt`
- Drive: `10.0 MASTER SYSTEM FOR CHAPTER REVISION.docx`
- Normalized Drive: `10 master system for chapter revision`
- Normalized Local (not done): `10 master system for chapter revision`
- → Should match but doesn't because local wasn't normalized before comparison

---

## OAUTH CREDENTIALS HISTORY

### What Happened
1. User had `~/.gdrive_secrets/credentials.json` containing Google Cloud Console client_secret.json
2. Script tried to use it as authorized_user credentials → FAILED
3. User said "I already authorized" (via rclone)
4. I extracted refresh_token from rclone config
5. Built new credentials.json with:
   - client_id
   - client_secret
   - refresh_token
6. File saved to `~/.gdrive_secrets/credentials.json`

### Current State
- Credentials file exists with refresh_token
- Should allow Python Google API calls without re-authorization
- **Untested:** Script hasn't actually been run since credentials were fixed

---

## FILE STRUCTURE CONFUSION

### What's In the Local Folder?
User ran: `ls -1 ~/writing-agent-interface/docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw | head -50`
**Result:** No output (appears directory doesn't exist or is empty)

**Possible issues:**
- Directory path is wrong
- Files are stored elsewhere
- Directory is empty despite earlier claims of 182 files

### What We Know for Sure
- Earlier comparison showed 182 files in some form
- User confirmed the path: `~/writing-agent-interface/docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw`
- Files were listed in COMPARISON.txt with names like:
  - `(A)Chapter_8:_Sea_People.txt`
  - `Chapter_1:_Stardust_to_Stardust.txt`
  - `ALITTERAS_SYSTEM_BLUEPRINT_v1.txt`

---

## WHAT WENT WRONG (HONESTY SECTION)

1. **Overengineering:** Started with fancy scripts when simple bash would do
2. **Auth obsession:** Spent too long on OAuth instead of just using what rclone already had
3. **Dedup logic error:** Normalized one side but not the other; user caught it immediately
4. **Directory confusion:** At the end, tried to list files in a directory that may not exist or is empty
5. **Not asking for clarification:** Should have asked "where are your 182 files exactly?" much earlier

---

## WHAT USER ACTUALLY WANTS

1. **A list of files in Google Drive that are NOT in the local app**
2. **Truly deduplicated** — same file in different formats (.docx, .txt, .pdf) counted as one
3. **Special char agnostic** — "Chapter 1 - Stardust" = "Chapter_1_Stardust" = "chapter1stardust"
4. **Personal files excluded** (if possible) — resumes, credit reports, tax docs, etc. are noise
5. **Interactive review** — eyeballs to decide which ones to download

---

## WHAT WE STILL DON'T KNOW

1. **Exact local file path:** Where are the 182 local files actually stored?
2. **Credentials working:** Has the fixed credentials.json been tested?
3. **True file count:** How many files are ACTUALLY unique across Drive + local?
4. **What needs to be downloaded:** Which of the "missing" files are book-related vs personal?
5. **Entity mapping:** How should files be organized into entity-01 through entity-25?

---

## NEXT STEPS FOR NEW AI

### Immediate (Must Do)
1. **Verify local file directory exists:**
   ```bash
   find ~ -name "gdrive_raw" -type d
   ls -la <actual_path>
   wc -l <actual_path>/*
   ```

2. **Verify Google Drive credentials work:**
   ```bash
   python3 -c "from google.oauth2.credentials import Credentials; from googleapiclient.discovery import build; creds = Credentials.from_authorized_user_file('~/.gdrive_secrets/credentials.json', ['https://www.googleapis.com/auth/drive.readonly']); service = build('drive', 'v3', credentials=creds); print('Auth OK')"
   ```

3. **Proper dedup script:**
   - Normalize BOTH Drive AND local filenames the same way
   - Strip all special chars, lowercase, remove extensions
   - Build sets: `local_normalized`, `drive_normalized`
   - Find files in Drive but not local: `drive_normalized - local_normalized`
   - Output actual filenames from Drive, not normalized versions

### Secondary (Should Do)
4. **Filter personal files** (optional but helpful)
   - Exclude: Resume, Credit, Tax, School, Doctors, Housing, Paystub, Photo, Email, Messenger, Hanon, Saxophone, etc.
   - Keep: Chapter, Protocol, Guide, Critique, Singularity, Blueprint, Weight of the Sky, etc.

5. **Build interactive checklist** (HTML artifact on phone)
   - List of truly new/missing files
   - User checks which ones to download
   - Output: `to_download.txt`

### Tertiary (Nice to Have)
6. **Auto-download** using rclone or Google Drive API
7. **Organize into entities** based on user mapping
8. **Start engine implementation** once files are sorted

---

## KEY FILES & LOCATIONS

| Item | Path |
|------|------|
| Project root | `~/writing-agent-interface/` |
| Local files (supposedly) | `~/writing-agent-interface/docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/` |
| Google Drive credentials | `~/.gdrive_secrets/credentials.json` |
| rclone config | `~/.config/rclone/rclone.conf` |
| Latest comparison outputs | `~/storage/downloads/ACTUALLY_NEW_FILES.txt` (561 files - likely has duplicates) |
| Downloads folder | `~/storage/downloads/` |

---

## CREDENTIALS DETAILS

**File:** `~/.gdrive_secrets/credentials.json`

```json
{
  "type": "authorized_user",
  "client_id": "439008308970-57jb439vd5h72b1ld277an8icke6rbq5.apps.googleusercontent.com",
  "client_secret": "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",
  "refresh_token": "1//04EvR9qMOV3wjCgYIARAAGAQSNwF-L9IrLH1-cKu8NL68VOwnWzkRBm53FNCsIhufzK3p8xqyfLMqCM59-sPeld4Wfk3mGXDLD8I"
}
```

---

## ENVIRONMENT

- **OS:** Termux (Android)
- **Python:** 3.13
- **Required packages:**
  - google-auth-oauthlib
  - google-api-python-client
  - requests
- **Node.js/npm:** Project uses Next.js, needs setup

---

## ENDING STATE

- **Codebase:** Structurally complete (skeleton), zero implementations
- **File Sync:** BROKEN — dedup failed, don't know true file count
- **Google Drive:** Connected (credentials exist), untested
- **Local Files:** Unknown state (directory path unclear)
- **UI:** Not wired to backend; pages exist but don't call APIs
- **Engines:** All empty stubs; Memory, Retrieval, Graph, Writing Agent need full implementation

---

## INSTRUCTIONS FOR NEW AI

Read this document first. Ask clarifying questions:
1. Where are the actual 182 local files?
2. Is Google Drive auth working?
3. What's the actual unique file count after proper dedup?

Then follow the "Next Steps" section. Do not proceed with implementation until file sync is 100% clear.

---

**End of Handoff Document**
