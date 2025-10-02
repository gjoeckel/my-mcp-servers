### Autonomous User Stories Generation — Implementation Guide

This guide defines a fully non-interactive, token‑frugal method for an AI agent to generate and maintain `user-stories.md` directly from the codebase and runtime observations.

### Objectives
- **Autonomy**: One-shot execution with no prompts.
- **Token‑frugality**: Zero model calls; rely on filesystem, regex, and deterministic templates.
- **Truthfulness**: Derive user stories from static code signals and optional runtime traces.
- **Idempotence**: Only rewrite changed content; persist manifests and hashes.

### Prerequisites
- **Git Bash** on Windows for any git actions.
- **Node.js 16+**, **PHP CLI**, and **Google Chrome** installed.
- Local server script: `tests/start_server.sh`
- Chrome debug script: `scripts/start-chrome-debug.sh`

### Key Paths and Commands
- **Run local server**: `./tests/start_server.sh`
- **Start Chrome debug (optional)**: `./scripts/start-chrome-debug.sh`
- **Run generator**: `npm run generate:user-stories`
- **Primary files**:
  - `scripts/generate-user-stories.js`
  - `user-stories.md`
  - Reports directory: `tests/reports/`

### Inputs and Signals
- Code: `php/**/*.php`, `js/**/*.js`, `css/**/*.css`, `index.php`
- Static patterns (regex):
  - **event-binding**: `addEventListener(`
  - **inline-event**: `onclick|oninput|onchange|onsubmit|onkeydown|onkeyup`
  - **network-fetch**: `fetch(`
  - **network-xhr**: `XMLHttpRequest` or `$.ajax(`
  - **storage**: `localStorage|sessionStorage`
  - **navigation**: `window.location|location.href`
  - **a11y**: `aria-*|role=|tabindex=|focus(|blur(`
  - **entrypoints**: `index.php|home.php|mychecklist.php|admin.php`
  - **api-endpoints**: `php/api/(save|restore|list|delete).php`

### Optional Runtime Observation (Chrome MCP)
- Navigate to `http://localhost:8000/index.php` → `php/home.php` → `mychecklist.php` (sample session) → `admin.php`.
- Script minimal interactions:
  - Click status buttons through states; type into textareas
  - Toggle side panel; add/delete a report row
- Collect network requests (URL, method, status), console logs, and small DOM snapshots.
- Write structured observations to `tests/reports/features_dynamic.json`.
- If Chrome MCP is not available, skip this step and proceed with static-only generation.

### Reports and Schemas
- `tests/reports/story_inventory.json` — manifest for change detection
```json
[
  { "path": "js/main.js", "size": 12345, "mtimeMs": 1696032000000, "sha1": "..." }
]
```

- `tests/reports/features_static.json` — static feature hits
```json
[
  { "file": "js/save-restore.js", "line": 150, "category": "network-fetch", "snippet": "fetch('/php/api/save.php', ...)" }
]
```

- `tests/reports/features_dynamic.json` — runtime observations (optional)
```json
[
  { "t": "2025-10-01T08:00:00Z", "category": "network", "event": "fetch", "meta": { "url": "/php/api/save.php", "status": 200 } }
]
```

- `tests/reports/stories_generated.json` — synthesized stories
```json
{
  "stories": [
    {
      "id": "story-session",
      "title": "Automatic Session Creation",
      "acceptance": ["Session ID 3-char alphanumeric", "URL params drive save/restore"],
      "evidence": ["storage", "entrypoints", "navigation"]
    }
  ],
  "metadata": { "generatedAt": "...", "commitHash": "..." }
}
```

### Deterministic Rewrite Strategy for `user-stories.md`
1. Locate the section header `## **Primary Save/Restore User Stories**`.
2. If present, replace contents up to `## **Critical Technical Issues Identified**` with freshly generated stories.
3. If the footer header is absent, append generated stories at the end.
4. Number stories sequentially as they are emitted by the generator.
5. Append a scan metadata line with timestamp and commit hash.

### Generation Flow (Non-Interactive)
1. Ensure reports directory exists: `tests/reports/`.
2. Load previous manifest `story_inventory.json` (if exists).
3. Walk repository (excluding `node_modules`, `tests/screenshots`, `saves`, `php/saves`), compute SHA-1 per file.
4. Identify changed files; only rescan those to save time and tokens.
5. Run static regex scans over changed (or all, if first run) files.
6. Optionally perform a minimal runtime script via Chrome MCP to capture `features_dynamic.json`.
7. Synthesize stories via category coverage and deterministic templates; include evidence categories.
8. Rewrite `user-stories.md` deterministically (see strategy above).
9. Emit execution log to `tests/reports/stories_run.log`.

### Token‑Frugality and Robustness
- Prefer regex scans with line-window snippets over full-file semantic reads.
- Cache manifest and reuse; incremental updates by hash.
- Small, deterministic templates for story text; avoid free‑form generation.
- Minimal runtime path and snapshots.
- Batch filesystem operations; avoid repeated reads.

### Validation Checklist
- Each `php/api/*.php` endpoint appears in acceptance criteria or evidence.
- Observed network routes map to ≥1 story.
- Core UI events (status change, textarea, side panel) map to stories.
- `user-stories.md` changes only when inputs differ (hash compare old vs new content).

### Failure Handling
- If server fails to start, log and proceed with static mode only.
- If Chrome debugging isn’t reachable, skip dynamic capture.
- If `user-stories.md` is missing, create it with generated core sections.

### Git Workflow (Local Only)
- Use Git Bash for all git actions.
- Stage `tests/reports/*.json` and `user-stories.md`.
- Commit locally with a single message. Do not push unless explicitly authorized.

### Runbook
- Start server (optional for static-only):
```
./tests/start_server.sh
```
- Start Chrome debug (optional):
```
./scripts/start-chrome-debug.sh
```
- Generate stories:
```
npm run generate:user-stories
```

### Extensibility
- Add new regex categories by extending `scripts/generate-user-stories.js` with a new `grepMatches` call.
- Expand runtime probes by appending actions to the Chrome MCP script and emitting normalized events.
- Customize acceptance criteria per category in the synthesizer function to reflect evolving product contracts.


