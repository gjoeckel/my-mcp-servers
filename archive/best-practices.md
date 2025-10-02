### Best Practices (AccessiList)

These practices optimize for Simple, Reliable, DRY (SRD) code and MCP-first workflows.

### Guiding Principles

- **Simple**: Prefer the smallest effective solution; avoid over-engineering
- **Reliable**: Use proven patterns and deterministic scripts
- **DRY**: Centralize shared logic; avoid repeating paths, selectors, and formats
- **MCP-first**: Prefer MCP tools for testing, file ops, and automation

### Environment and Tooling

- Use Git Bash on Windows for all repository scripts
- Ensure Google Chrome is installed for Chrome MCP
- Start the server via `./tests/start_server.sh` and prefer MCP validation

### Path Management

- Use `js/path-utils.js` and `js/simple-path-config.js` for all asset and API paths
- Avoid hardcoded environment-specific prefixes in PHP or JS; resolve via shared utilities

### API Contracts

- Standardize responses using a consistent envelope (e.g., top-level `data`)
- Validate inputs (e.g., session keys) via shared helpers in `php/includes/api-utils.php`
- Keep endpoints minimal: `save.php`, `restore.php`, `list.php`, `delete.php`

### JavaScript Modules

- Use ES modules and load with `<script type="module">` in HTML/PHP pages
- Keep orchestration in `js/main.js` and feature logic in focused modules
- Prefer explicit imports/exports; avoid global side effects

### CSS Discipline

- Maintain the established build order; changes can break cascade-specificity

```4:15:tests/config/build-order.json
  "order": [
    "css/modal.css",
    "css/focus.css",
    "css/landing.css",
    "css/admin.css",
    "css/form-elements.css",
    "css/table.css",
    "css/section.css",
    "css/status.css",
    "css/side-panel.css",
    "css/header.css",
    "css/base.css"
  ]
```

- Build with `npm run build:css`; avoid manual edits to `global.css`

### Testing Strategy (MCP-first)

- Default minimal flow for most tasks:
  1) Start server: `./tests/start_server.sh`
  2) Chrome MCP: navigate to base URL; perform a single health verification if available; otherwise confirm HTTP 200 for `/index.php`

- Full suite (when needed):
  - `php tests/run_comprehensive_tests.php`
  - `php tests/chrome-mcp/run_chrome_mcp_tests.php`
  - Startup tokens: `./scripts/startup-runbook.sh [quick|new|full]`

### Known Risks (Documented; out-of-scope to fix here)

- **Short session IDs**: Current session keys are only 3 characters, which increases collision risk. Use longer, cryptographically strong IDs (e.g., 16+ chars) and validate on both client and server.
- **Saves location**: JSON save files reside under the web root, which risks exposure via direct URL access. Move `php/saves` outside the document root or block direct access via server rules (e.g., Apache `.htaccess` deny) and route all access through API endpoints.

### Accessibility and UI

- Preserve existing visuals and layout unless explicitly directed
- Ensure focus management and keyboard interaction remain intact

### Version Control

- Keep edits small and coherent; write clear commit messages
- Ask before pushing to remote; never auto-push without explicit authorization

### Documentation

- Update `README.md` and this file when behavior changes
- Prefer concise, high-signal examples and reference snippets
