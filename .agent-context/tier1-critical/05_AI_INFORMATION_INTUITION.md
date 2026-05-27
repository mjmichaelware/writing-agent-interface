AI INFORMATION INTUITION

Intent: The aim is to find, pinpoint, and accumulate an exhaustive, comprehensive, extensive sum of every bit and/or byte of data that the (4) mentioned AI/ML/LLM's and (1) GitHub [Repositories] offer alteration and/or control and/or modification of and/or decisiveness over within:

	• App/Web UI/UX
	• Free API (via Termux i.e.)
	Or,
	• "Separately," via paid service (Billing, paid API, Pro, Tier, i.e., etc).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


NOTEBOOKLM (GOOGLE)


NOTE ON YOUR SUBSCRIPTION:
Google One AI Premium bundles Gemini Advanced + NotebookLM Plus under ONE payment — but they run SEPARATE, INDEPENDENT quotas. Using up your Gemini Advanced daily message limit does NOT affect your NotebookLM Plus limits. They are different services sharing one billing line.


• App/Web UI/UX

─────────────────────────────
FREE TIER — notebooklm.google.com
─────────────────────────────

SOURCE MANAGEMENT
	• Upload sources: Google Docs, Google Slides, PDFs, web URLs, YouTube video links, pasted text, audio files
	• Max: 50 sources per notebook
	• Max: 25 notebooks per account
	• Add / remove / rename individual sources
	• Source focus toggle — include or exclude specific sources from responses
	• Source citation — responses link back to exact source passages

NOTEBOOK MANAGEMENT
	• Create / rename / delete notebooks
	• Share notebook via view-only link
	• Duplicate notebook

GENERATION OUTPUTS (all free)
	• Chat — open-ended Q&A grounded strictly in your uploaded sources
	• Audio Overview — AI-generated two-host podcast synthesizing your sources
		- Pre-generation instruction field (direct focus, specify what to skip, adjust emphasis)
		- Download generated audio as MP3
	• Study Guide — structured Q&A format extracted from sources
	• Briefing Doc — executive summary of sources
	• FAQ — auto-generated question/answer pairs
	• Timeline — chronological events extracted from sources
	• Table of Contents — structured outline of source material
	• Mind Map — visual web of concepts (where available by region)

NOTE FEATURES
	• Save AI responses as inline notes
	• Write manual free-text notes
	• Pin notes within a notebook

WHAT YOU CANNOT CONTROL (FREE)
	• No public API — no Termux access whatsoever
	• No model selection (model is fixed by Google)
	• No temperature or generation parameter access
	• No fine-tuning
	• No custom personas or system prompts
	• Audio Overview voice/style cannot be changed beyond the instruction field

─────────────────────────────
NOTEBOOKLM PLUS — Included with Google One AI Premium
(Your current tier — bundled with Gemini Advanced)
─────────────────────────────

EVERYTHING IN FREE, PLUS:

EXPANDED LIMITS
	• 500 sources per notebook (up from 50)
	• 100 notebooks per account (up from 25)
	• Longer, more detailed Audio Overview generation
	• Higher query volume before throttling

COLLABORATION & SHARING
	• Share notebooks with specific Google accounts (not just view-only links)
	• Workspace/team collaboration (if on Google Workspace plan)
	• Custom branding on shared notebooks (Enterprise tier only — above Plus)

PRIORITY ACCESS
	• Priority processing during high-traffic periods
	• Earlier access to new NotebookLM features

WHAT REMAINS UNAVAILABLE EVEN ON PLUS
	• No public API — still zero Termux/REST access
	• No model parameter control (temperature, top-p, etc.)
	• No system prompt injection
	• No fine-tuning
	• Audio Overview voices remain fixed (no voice selection)


• Free API (via Termux)

	NOT AVAILABLE. NotebookLM has no public API as of August 2025.
	No REST endpoint. No SDK. No Termux access possible.
	This applies to both Free and Plus tiers equally.


• Paid API / Billing (Separate)

	NOT AVAILABLE. There is no paid API tier for NotebookLM.
	Google has not released a NotebookLM API. The only upgrade
	path is NotebookLM Plus (via Google One AI Premium subscription),
	which expands UI/UX limits only — not API access.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


CLAUDE (ANTHROPIC)


NOTE ON YOUR SUBSCRIPTION:
You have Claude Pro. This gives you access to all models (Haiku / Sonnet / Opus),
higher usage limits, Projects with system prompts, and extended context.
The API is entirely separate from claude.ai — API access requires its own key and billing.


• App/Web UI/UX

─────────────────────────────
FREE TIER — claude.ai
─────────────────────────────

ACCOUNT
	• Account creation (email + password)
	• Two-factor authentication (on/off)
	• Display name

MODEL ACCESS
	• Claude Haiku (limited)
	• Claude Sonnet (limited daily messages)
	• No Opus access

CONVERSATION CONTROLS
	• New conversation / rename / delete
	• File uploads (PDF, images, text, DOCX, code)
	• Voice input (mobile)
	• Web search toggle (where available)
	• Artifacts (HTML, React, Markdown, SVG, Mermaid rendering)

LIMITS
	• Daily message cap (resets every 24 hours — exact number not published)
	• No Projects
	• No persistent memory (may vary)
	• Shorter context window

─────────────────────────────
CLAUDE PRO — Your current tier
─────────────────────────────

EVERYTHING IN FREE, PLUS:

MODEL ACCESS
	• Claude Haiku 4.5
	• Claude Sonnet 4.6 (current default)
	• Claude Opus 4.6 (highest capability)

USAGE
	• Significantly higher message limits vs. Free
	• Priority access during high-traffic periods
	• Longer context window (up to 200K tokens depending on model)

PROJECTS
	• Create named Projects
	• Project-level system prompt — persistent operator-style instructions
	  that apply to every conversation within that project
	• Upload files to a Project knowledge base (persistent across sessions)
	• Organize conversations within Projects

TOGGLEABLE FEATURES (per conversation or Settings)
	• Web search (on/off)
	• Deep Research (on/off)
	• Code Execution & File Creation (on/off)
	• Artifacts rendering (on/off)
	• Memory generation from chat history (on/off)
	• Search & reference past chats (on/off)

PERSONALIZATION
	• User Preferences — plain text field (tone, format, behavioral instructions)
	• Style feature — train Claude on your writing style via examples
	• Memory edits — persistent facts Claude retains across all conversations
	• Dark / Light mode
	• Language preference

WHAT REMAINS UNAVAILABLE IN PRO UI
	• No temperature control
	• No top-p / top-k access
	• No stop sequence definition
	• No system prompt outside of Projects
	• No model parameter tuning of any kind
	• No batch processing
	• No prompt caching control
	• No extended thinking budget control


• Free API (via Termux — api.anthropic.com/v1/messages)

NOTE: Free API tier has rate limits and requires a free API key from console.anthropic.com.
This is entirely separate from your Claude Pro subscription.

REQUEST PARAMETERS YOU CONTROL
	• model — string (e.g., claude-sonnet-4-20250514)
	• max_tokens — integer (hard output ceiling)
	• messages — array of {role, content} objects (full conversation history)
	• system — string or array (system prompt; supports multi-block)
	• temperature — float 0.0–1.0
	• top_p — float (nucleus sampling)
	• top_k — integer (token candidate pool limit)
	• stop_sequences — array of strings
	• stream — boolean (server-sent events)
	• metadata.user_id — string

TOOL USE
	• tools — array (name, description, input_schema per tool)
	• tool_choice — auto / any / {type: "tool", name: "..."} / none

MULTIMODAL INPUT
	• Image blocks (base64 or URL, with media_type)
	• Document blocks (PDF as base64)
	• Text blocks

FREE TIER LIMITS
	• Tier 1: 50 requests/day, 40,000 tokens/minute
	• No Opus access on free tier
	• No extended thinking
	• No prompt caching
	• No batch API


• Paid API / Billing (Separate from Claude Pro subscription)

ADDITIONAL PARAMETERS UNLOCKED

Extended Thinking (Sonnet / Opus)
	• thinking.type: "enabled"
	• thinking.budget_tokens — integer (sets compute reasoning budget)
	• Thinking blocks visible in response output

Prompt Caching
	• cache_control: {type: "ephemeral"} on content blocks
	• Cache system prompts, tools, long documents
	• Reduces cost and latency on repeated context

Batch API
	• POST /v1/messages/batches — async bulk processing
	• Up to 10,000 requests per batch
	• 50% cost reduction vs. standard
	• processing_status: in_progress / ended
	• Cancel batch endpoint available

Files API
	• Upload once, reference by file_id across multiple requests
	• POST /v1/files / GET /v1/files/{id} / DELETE /v1/files/{id}
	• Supported: PDF, plain text, images

Computer Use (Beta)
	• computer_20241022 tool type
	• bash_20241022 / text_editor_20241022 tools
	• display_width_px / display_height_px control
	• Actions: screenshot, left_click, right_click, double_click,
	  type, key, scroll, mouse_move, left_click_drag

PAID TIER RATE LIMITS (tiered by billing level)
	• Tier 1 (free): 50 req/day
	• Tier 2 (first payment): 1,000 RPD, higher TPM
	• Tier 3 / 4: increasing RPM, TPM, TPD
	• Enterprise: custom negotiated limits

ADMIN API (Enterprise)
	• Organization management
	• Scoped API key creation/deletion
	• Workspace management

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


GOOGLE AI STUDIO


NOTE ON YOUR SUBSCRIPTION:
Google AI Studio is free to use with a Google account. Paying for Google One AI Premium
(Gemini Advanced) does NOT automatically expand your AI Studio API quota — those are
governed separately by Google Cloud billing. AI Studio's free tier is generous for
personal/development use.


• App/Web UI/UX

─────────────────────────────
FREE TIER — aistudio.google.com
─────────────────────────────

PROMPT TYPES
	• Chat prompt (multi-turn conversation)
	• Single-turn / Freeform prompt
	• Structured prompt (few-shot with input/output examples)

MODEL SELECTION
	• Gemini 2.0 Flash (default)
	• Gemini 2.0 Flash-Lite
	• Gemini 2.0 Pro Experimental
	• Gemini 1.5 Flash / Flash-8B
	• Gemini 1.5 Pro
	• Gemini 2.0 Flash Thinking (extended reasoning)
	• Gemma (open weights variant)

GENERATION PARAMETERS (all accessible free)
	• Temperature — 0.0 to 2.0
	• Top-P — float
	• Top-K — integer
	• Max output tokens — integer
	• Stop sequences — custom strings
	• Candidate count — integer (number of response variants)
	• Seed — integer (reproducibility)

SYSTEM INSTRUCTIONS
	• Free-text system prompt field (persistent across conversation)

SAFETY SETTINGS (4 categories, each independently tunable)
	• Harassment — Block none / few / some / most
	• Hate speech — Block none / few / some / most
	• Sexually explicit — Block none / few / some / most
	• Dangerous content — Block none / few / some / most

TOOLS & GROUNDING
	• Google Search grounding (on/off — real-time web data injected)
	• Code Execution (on/off — Python sandbox)
	• Function calling — define custom tools with JSON schema
	• URL context tool

STRUCTURED OUTPUT
	• Response MIME type: text/plain vs. application/json
	• JSON Schema definition (constrain model output to your schema)

THINKING MODE (Flash Thinking model)
	• Thinking budget tokens — integer (controls reasoning depth)

MULTIMODAL INPUTS
	• Images: JPEG, PNG, WEBP, GIF, HEIC
	• Audio: MP3, WAV, AIFF, AAC, OGG, FLAC
	• Video: MP4, MPEG, AVI, MOV, MKV, WebM
	• Documents: PDF
	• Text

FINE-TUNING (Supervised — free to configure, compute has cost)
	• Upload training data (JSONL input/output pairs)
	• Base model selection
	• Epoch count
	• Batch size
	• Learning rate multiplier
	• Access tuned model via API after training

API KEY MANAGEMENT
	• Create API keys
	• Revoke API keys
	• View usage per key

CODE EXPORT
	• Export any prompt as: Python / JavaScript / REST curl / Kotlin / Swift

FREE TIER API LIMITS (via AI Studio key)
	• Gemini 2.0 Flash: 15 RPM, 1,000,000 TPM, 1,500 requests/day
	• Gemini 1.5 Pro: 2 RPM, 32,000 TPM, 50 requests/day
	• Gemini 1.5 Flash: 15 RPM, 1,000,000 TPM, 1,500 requests/day
	• No billing required for free tier

─────────────────────────────
PAID / BILLING ENABLED (Google Cloud)
─────────────────────────────

EVERYTHING IN FREE, PLUS:

EXPANDED RATE LIMITS
	• Gemini 2.0 Flash: 2,000 RPM, 4,000,000 TPM, unlimited RPD
	• Gemini 1.5 Pro: 1,000 RPM, 4,000,000 TPM, unlimited RPD
	• Higher limits available on request / enterprise tier

CONTEXT CACHING
	• Cache large inputs (documents, system prompts) server-side
	• TTL (time-to-live) setting in seconds
	• POST /v1beta/cachedContents
	• Significant cost reduction on repeated large-context calls

BATCH MODE
	• Async bulk request processing
	• 50% cost discount vs. standard synchronous calls

LIVE API
	• Real-time bidirectional streaming
	• Audio I/O (speak and receive spoken responses)
	• Screen sharing as live input
	• Camera feed as live input
	• Ultra-low latency

LONG CONTEXT (1M tokens)
	• Available on Gemini 1.5 Pro and Gemini 2.0 models with billing


• Free API (via Termux — generativelanguage.googleapis.com)

Same parameters as AI Studio UI, accessed via REST. Key objects:

	• generationConfig:
		- temperature, topP, topK
		- maxOutputTokens
		- stopSequences
		- responseMimeType
		- responseSchema
		- candidateCount
		- seed
	• safetySettings — array of {category, threshold}
	• systemInstruction — string or parts array
	• tools — array of function declarations
	• toolConfig.functionCallingConfig.mode: AUTO / ANY / NONE
	• contents — array (full conversation history)
	• cachedContent — reference ID (paid feature)
	• Stream endpoint: streamGenerateContent


• Paid API / Billing

	All of the above plus:
	• Higher RPM/TPM/TPD across all models
	• Context caching cost savings
	• Batch mode (async, 50% discount)
	• Fine-tuned model hosting
	• Live API (real-time audio/video streaming)
	• 1M token context window (Pro / 2.0 models)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


GEMINI (GOOGLE)


NOTE ON YOUR SUBSCRIPTION:
Google One AI Premium = Gemini Advanced. This gives you access to Gemini 2.0 Pro,
1.5 Pro, Deep Research, Gems, Gemini Live extended sessions, and 1M token context.
Quota for Gemini Advanced is SEPARATE from NotebookLM Plus — they do not share limits.


• App/Web UI/UX

─────────────────────────────
FREE TIER — gemini.google.com
─────────────────────────────

MODEL ACCESS
	• Gemini 2.0 Flash (default)
	• Limited access to other models

EXTENSIONS (connect Gemini to live data — free)
	• Google Search (always active)
	• Google Workspace: Gmail, Google Docs, Google Drive, Google Calendar
	• YouTube
	• Google Maps
	• Google Flights
	• Google Hotels
	• Chrome browsing history (optional toggle)

INPUT MODES
	• Text
	• Voice
	• Image upload
	• Document upload
	• Camera (mobile)

CONVERSATION MANAGEMENT
	• Pin conversations
	• Rename conversations
	• Delete conversations
	• Share conversation via link

RESPONSE MODIFICATION (post-generation)
	• Shorter / Longer
	• Simpler
	• More casual / More formal
	• Regenerate response

MEMORY (free)
	• On/off toggle
	• View saved memories
	• Delete individual memories
	• Delete all memories
	• Memories auto-generated from conversations

LIMITS (Free)
	• Daily message cap on advanced models
	• No Gems creation
	• No Deep Research
	• No Gemini Live extended sessions
	• Shorter context window

─────────────────────────────
GEMINI ADVANCED — Your current tier
(Google One AI Premium — includes NotebookLM Plus)
─────────────────────────────

EVERYTHING IN FREE, PLUS:

MODEL ACCESS
	• Gemini 2.0 Pro Experimental (highest capability)
	• Gemini 1.5 Pro
	• Gemini 2.0 Flash Thinking (extended reasoning visible)
	• Gemini 2.0 Flash (always available)

GEMS (Custom AI Personas)
	• Create named Gem (custom AI assistant)
	• Custom instructions / personality definition
	• Specific task or domain focus
	• Base model selection per Gem
	• Shareable Gem link
	• Edit / delete Gems

DEEP RESEARCH
	• Multi-step autonomous web research
	• Research topic input field
	• Research plan preview — review and edit before execution begins
	• Full written report with citations generated
	• Export research report to Google Docs

GEMINI LIVE (Extended — Advanced only)
	• Real-time voice conversation (extended session length)
	• Screen sharing as live model input
	• Camera feed as live model input
	• Interrupt model mid-speech
	• Available on mobile and desktop

CONTEXT WINDOW
	• Up to 1,000,000 tokens (1M) with compatible models

IMAGE GENERATION
	• Imagen 3 integration (text-to-image within Gemini chat)
	• Style and detail prompting

GOOGLE WORKSPACE INTEGRATION (Advanced)
	• Gemini in Gmail (draft, summarize, reply)
	• Gemini in Google Docs (draft, rewrite, summarize)
	• Gemini in Google Sheets (formula generation, data analysis)
	• Gemini in Google Slides (generate presentation content)
	• Gemini in Google Meet (real-time note-taking)

STORAGE BUNDLE
	• 2TB Google One cloud storage included

WHAT REMAINS UNAVAILABLE IN GEMINI UI (ANY TIER)
	• No temperature or generation parameter control
	• No system prompt injection (use Gems for persona, not full system prompt)
	• No function/tool calling (UI only — available in AI Studio/API)
	• No fine-tuning
	• No JSON schema output control


• Free API (via Termux)

	Same endpoint as Google AI Studio.
	See: GOOGLE AI STUDIO → Free API section above.
	API key from aistudio.google.com — free tier limits apply.


• Paid API / Billing

	See: GOOGLE AI STUDIO → Paid API / Billing section above.
	Gemini Advanced subscription does NOT expand API quota.
	API billing is governed separately via Google Cloud.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


GITHUB
https://github.com/mjmichaelware/-The-Weight-of-the-Sky-/blob/main/README.md


NOTE ON YOUR ACCOUNT:
Free GitHub accounts have access to nearly all repository features listed below.
The main paid upgrades are GitHub Pro (advanced branch protection, more Actions minutes)
and GitHub Copilot (separate AI subscription).


• App/Web UI/UX

─────────────────────────────
FREE TIER — github.com
─────────────────────────────

REPOSITORY SETTINGS
	• Repository name
	• Description
	• Website URL field
	• Topics / tags (for searchability)
	• Visibility: Public / Private
	• Default branch name
	• Merge strategies: merge commit / squash / rebase (enable/disable each)
	• Auto-delete head branches after PR merge (on/off)
	• Archive repository
	• Transfer ownership
	• Delete repository

README & FILE MANAGEMENT
	• Edit README.md via web editor or local push
	• Add / edit / delete / rename any file via web UI
	• Upload files (drag and drop)
	• Per-file commit history
	• Blame view (line-by-line authorship attribution)
	• Raw file view

BRANCHES
	• Create / rename / delete branches
	• Default branch selection
	• Basic branch protection rules (free):
		- Require pull request before merging
		- Require status checks to pass
		- Restrict who can push to branch

COMMITS
	• Commit message (title + extended body)
	• Commit author (name + email)
	• GPG/SSH signed commits
	• Amend via force push (on unprotected branches)

RELEASES & TAGS
	• Create release (tag name, title, description, attached assets)
	• Mark as pre-release
	• Set as latest release
	• Attach binary files / documents to release download

ISSUES
	• Create / edit / close / reopen issues
	• Custom labels (create, rename, color)
	• Milestones
	• Assignees
	• Issue templates (markdown-based)
	• Link issues to commits and pull requests

PULL REQUESTS
	• Draft vs. ready-for-review state
	• Assigned reviewers
	• Labels, milestones, assignees
	• Review: approve / request changes / comment
	• Merge method selection per PR

GITHUB PAGES (free for public repos)
	• Enable / disable Pages
	• Source branch + folder (/root or /docs)
	• Custom domain
	• HTTPS enforcement (on/off)

WIKI
	• Enable / disable
	• Create / edit pages (Markdown)
	• Sidebar customization

DISCUSSIONS
	• Enable / disable
	• Create custom categories
	• Pin discussions

GITHUB ACTIONS (CI/CD — 2,000 minutes/month free)
	• .github/workflows/*.yml — full workflow definition
	• Triggers: push, pull_request, schedule, workflow_dispatch, etc.
	• Jobs / steps definition
	• Encrypted Secrets (environment variables, API keys)
	• Environment variables
	• Artifacts (upload/download build outputs)
	• Dependency caching
	• Matrix builds (run job across multiple OS/version configs)

SECURITY
	• Dependabot alerts (on/off)
	• Secret scanning (on/off)
	• Code scanning (on/off)
	• SECURITY.md policy file

COLLABORATORS & PERMISSIONS
	• Add collaborators by username
	• Permission levels: Read / Triage / Write / Maintain / Admin

WEBHOOKS
	• Target URL
	• Content type (JSON / form)
	• Secret token
	• Events to trigger on (push, PR, issues, releases, etc.)
	• Active / inactive toggle

SOCIAL & METADATA
	• Social preview image (Open Graph image for link sharing)
	• LICENSE file
	• .gitignore file
	• CODEOWNERS file
	• CONTRIBUTING.md
	• CHANGELOG.md

─────────────────────────────
GITHUB PRO / TEAM / ENTERPRISE — Paid
─────────────────────────────

GITHUB PRO (~$4/month — individual)
	• Advanced branch protection rules
		- Required reviewers (up to 6)
		- Dismiss stale reviews
		- Require conversation resolution before merge
	• GitHub Insights (traffic, clone stats, referral sources)
	• 3,000 Actions minutes/month (vs. 2,000 free)
	• Larger Git LFS storage

GITHUB COPILOT (separate subscription — ~$10/month individual)
	• Inline code completion in IDE
	• Copilot Chat (in IDE or github.com)
	• Copilot CLI (terminal command suggestions)
	• Model selection: GPT-4o / Claude Sonnet / Gemini (varies by feature)
	• Custom instructions file: .github/copilot-instructions.md
	• Copilot Workspace (AI-assisted issue-to-PR pipeline)

GITHUB TEAM / ENTERPRISE
	• SAML Single Sign-On (SSO)
	• Organization audit log
	• IP allowlisting
	• Advanced security: CodeQL scanning, secret scanning push protection
	• Repository rulesets (enforce policy across multiple repos)
	• Self-hosted Actions runners (use your own compute)
	• Copilot Enterprise: org-wide knowledge bases, PR summaries


• Free API (via Termux — api.github.com)

	GitHub REST API — free, requires Personal Access Token (PAT)

	WHAT YOU CAN CONTROL VIA API
	• Repos: create, delete, update settings, list contents
	• Files: GET / PUT / DELETE file contents (with SHA for updates)
	• Commits: list, compare, get specific commit
	• Branches: list, create, delete, get branch protection
	• Issues: create, edit, list, close, add labels/assignees
	• Pull Requests: create, merge, list, update
	• Releases: create, edit, delete, upload assets
	• Actions: trigger workflow_dispatch, list runs, cancel run, download artifacts
	• Webhooks: create, list, delete, ping
	• Collaborators: add, remove, check permission level
	• GitHub Pages: enable, update source, get status
	• Secrets: create/update encrypted secrets for Actions
	• Git objects: low-level blobs, trees, commits, refs

	RATE LIMITS (authenticated)
	• 5,000 requests/hour with PAT (free)
	• Search API: 30 requests/minute


• Paid API / Billing

	GitHub Enterprise Cloud / Server:
	• Higher API rate limits (custom)
	• Audit log streaming API
	• SCIM provisioning API (user management)
	• Advanced Security API endpoints (CodeQL results, secret scanning alerts)
	• Copilot API (Enterprise tier — org seat management, knowledge base management)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Knowledge cutoff: August 2025.
Verify current limits and pricing at:
	• claude.ai / console.anthropic.com / docs.anthropic.com
	• notebooklm.google.com
	• aistudio.google.com
	• gemini.google.com
	• github.com/pricing
	• support.claude.com
