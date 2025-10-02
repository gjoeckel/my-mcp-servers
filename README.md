### AccessiList

An accessibility checklist app built with PHP and vanilla JavaScript (ES modules), with CSS built via a simple PostCSS pipeline. The project emphasizes MCP-first workflows and SRD principles: Simple, Reliable, DRY.

### Requirements

- PHP 8.x CLI
- Node.js 16+ (for CSS build scripts)
- Google Chrome (for Chrome MCP)
- Git Bash on Windows (mandatory for scripts)

### Quick Start

1) Start the local server (Git Bash):

```bash
./tests/start_server.sh
```

2) Minimal verification (constrained agents):
- Prefer MCP tools. If Chrome MCP is available, navigate to `http://localhost:8000/index.php` and confirm it loads; optionally request a simple health URL if one is provided.
- Fallback: curl `http://localhost:8000/index.php` and expect HTTP 200.

3) Optional: Docker

```bash
docker compose up --build -d
```

Port mapping (host 8000 → container 80):

```7:8:docker-compose.yml
      - "127.0.0.1:8000:80"
```

### Entrypoints and Pages

- `index.php` redirects to the main UI:

```1:3:index.php
<?php
header('Location: php/home.php');
exit;
```

- Primary pages: `php/home.php`, `php/mychecklist.php`, `php/admin.php`

### API Endpoints (PHP)

- `POST /php/api/save.php` – Save session data
- `GET /php/api/restore.php?sessionKey=XXX` – Restore session data
- `GET /php/api/list.php` – List saved sessions
- `POST /php/api/delete.php?sessionKey=XXX` – Delete saved data

Endpoints use shared helpers in `php/includes/api-utils.php` and typically return a standardized JSON envelope with a `data` field.

### JavaScript Modules

ES modules orchestrate UI behavior and checklist logic (imports from `main.js`):

```11:14:js/main.js
import { buildContent } from './buildPrinciples.js';
import { buildReportsSection } from './buildReport.js';
import { initializeAddRowButton } from './addRow.js';
```

Path utilities and configuration live in `js/path-utils.js` and `js/simple-path-config.js`.

### CSS Build

CSS is concatenated then minified with PostCSS cssnano. Use:

```5:11:package.json
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "concat:css": "concat -o global.css css/modal.css css/focus.css css/landing.css css/admin.css css/form-elements.css css/table.css css/section.css css/status.css css/side-panel.css css/header.css css/base.css",
    "minify:css": "npx postcss global.css -o global.css",
    "build:css": "npm-run-all concat:css minify:css",
    "generate:user-stories": "node scripts/generate-user-stories.js"
  },
```

Canonical build order is tracked in `tests/config/build-order.json`:

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

Build commands:

```bash
npm install
npm run build:css
```

### Testing (MCP-first)

- Minimal (preferred default for constrained agents):
  - Start server with `./tests/start_server.sh`
  - Use Chrome MCP to navigate to base URL and perform a simple health check if available; otherwise verify HTTP 200 for `/index.php`

- Comprehensive (on demand):
  - `php tests/run_comprehensive_tests.php`
  - `php tests/chrome-mcp/run_chrome_mcp_tests.php`
  - Startup tokens: `./scripts/startup-runbook.sh [quick|new|full]`

### Configuration

- Default base URL is `http://localhost:8000`:

```7:11:tests/start_server.sh
# Configuration
PORT=8000
HOST=localhost
BASE_URL="http://${HOST}:${PORT}"
```

### Conventions

- Use Git Bash on Windows for all script execution
- Prefer MCP tools (Chrome DevTools, Filesystem, Memory, GitHub) for testing and operations
- Keep code SRD: Simple, Reliable, DRY

### Troubleshooting

- Ensure port 8000 is free before starting the server
- If ES modules fail to load (e.g., `Unexpected token 'export'`), confirm `<script type="module">` usage where applicable
- Verify Chrome remote debugging if using Chrome MCP
