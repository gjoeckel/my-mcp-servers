# CSS Refactor Plan (MCP Visual Parity Baseline)

- **Goal**: Consolidate CSS into a minimal, well-structured set of files while preserving visuals and layout exactly.
- **Non‑negotiable**: No visual or layout changes. Accessibility and focus styles remain identical.
- **Build Process Preservation**: Maintain existing npm build workflow that produces identical global.css

## Current Structure (observed)

- `global.css` (production concatenated build - 2094 lines)
- `css/`: `base.css`, `header.css`, `landing.css`, `section.css`, `table.css`, `form-elements.css`, `side-panel.css`, `status.css`, `modal.css`, `admin.css`, `focus.css` (2083 total lines)
- `css/compiled/*.css` (production build outputs; includes `save-restore.css` from prior builds)
- **Build Order**: modal.css → focus.css → landing.css → admin.css → form-elements.css → table.css → section.css → status.css → side-panel.css → header.css → base.css

### MCP Workflow (capture → analyze → consolidate → verify)

1) Capture computed styles per page
   - Start server: `./tests/start_server.sh`
   - **MCP Availability Check**: Verify Chrome MCP tools are available before starting
   - Pages: `index.php`, `php/home.php`, `php/mychecklist.php`, `php/admin.php`
   - **Chrome MCP Methods**: navigate, take_snapshot, take_screenshot, evaluate_script (getComputedStyle), get_network_requests
   - Viewports: desktop only (1440×900)
   - Collect `getComputedStyle` for all elements (reduced to layout/paint-impacting properties)
   - **Property Whitelist**: Use `tests/config/cssom-diff-properties.json` to define the exact CSS properties considered for parity to reduce noise
   - **Interactive State Coverage**: For each page, capture base + `:hover`, `:focus`, open modal, expanded panels, and any toggled states via scripted interactions
   - Store artifacts in `tests/reports/` with timestamps

2) Build style coverage map
   - Compare computed-style JSONs to detect redundant/unused rules and conflicts
   - Cross-check selectors against DOM snapshots to find dead CSS
     - Generate selector → element coverage by matching parsed selectors to DOM snapshots, including pseudo-class simulations
     - Treat a selector as dead only if uncovered across all pages and interactive states (desktop)
   - **Build Process Analysis**: Validate current concatenation order and dependencies
     - Extract current build order into `tests/config/build-order.json` from `package.json`/build scripts to serve as a single source of truth

3) Consolidation strategy (separation of concerns)
   - **Base Layer**: Keep `global.css` structure for tokens/resets/layout primitives
   - **Component Layer**: `header.css`, `table.css`, `modal.css`, `side-panel.css`, `form-elements.css`, `status.css`
   - **Page Layer** (only if unique): `landing.css`, `admin.css`, `section.css`
   - **Interactive Layer**: Centralize states in `focus.css`
   - **Preserve Build Order**: Maintain current npm concat order to prevent cascade issues
   - Regenerate `css/compiled/*.css`; preserve selector names, specificity, and file order
   - **Merge Unit Discipline**: Consolidate one component/page at a time; run full parity checks after each unit before proceeding

4) Exactness guardrails (must pass 0-diff)
   - Visual diffs across all pages/states (desktop 1440×900)
   - CSSOM diffs: computed-style parity for all layout/paint properties
   - **Build Parity**: Rebuilt global.css must produce identical CSSOM
   - Network parity: either identical file set or a bundle producing identical CSSOM
   - Merge blocked if any diff ≠ 0
   - **Performance Budgets**: No increase in total CSS bytes (+0 KB tolerance), number of CSS requests unchanged, and no regression in CSS parse time (±0 ms tolerance)

### Automation & Rollback

- **Automation Script**: Implement a Git Bash script to orchestrate consolidation units with parity gates and safe rollback
  - Workflow per unit: create temp branch → apply consolidation edits → rebuild CSS → run visual + CSSOM + performance checks → if all pass, merge; else hard reset and abort
  - Script location: `scripts/css-consolidation.sh` (invoked from repo root)
- **Pre-merge Gate**: Require successful local run of the automation script before opening/merging PRs; parity failures block merges
- **Source of Truth**: Enforce CSSOM equality of `global.css` output as the ultimate target; compiled assets must yield identical CSSOM in pages under test

### Risks & Mitigations

- Specificity/cascade changes → preserve selector lists and original inclusion order; add minimal wrappers only if necessary
- Hidden states (hover/focus/modals) → exercise all interactions in MCP before/after runs
- UA default overrides (focus outlines/inputs) → retain `focus.css` behavior as-is
- Compiled vs source drift → rebuild compiled CSS and validate CSSOM equality
- **Build Process Breakage**: Test npm run build:css produces identical output before deployment
 - Over-aggressive dead CSS pruning → Only prune selectors uncovered across all pages and interactive states (desktop)

### SRD Success Metrics

- **Simple**: Reduce CSS file count by 30% while maintaining functionality
- **Reliable**: 100% visual parity (0-diff) across all test scenarios
- **DRY**: Eliminate 50%+ of duplicate CSS rules
- **WCAG**: Maintain 100% WCAG compliance score
- **Build**: npm run build:css produces identical output
- **Performance**: No regression in CSS load/parse times
 - **Requests**: Number of CSS requests does not increase

### Execution Outline

- Baseline (before changes)
  - Start server; run Chrome MCP to collect screenshots + computed-style JSON
  - **Validate MCP Tools**: Check Chrome MCP availability before starting
  - Commit artifacts to `tests/reports/`
  - **Document Build Order**: Record current npm concat sequence
  - **Commit Config**: Create and commit `tests/config/cssom-diff-properties.json` and `tests/config/build-order.json`

- Refactor (iterative)
  - Remove duplicates, consolidate files; preserve order and specificity
  - **Maintain Build Compatibility**: Ensure new structure works with existing concat script
  - Rebuild compiled CSS
  - **Automated Loop**: Use `scripts/css-consolidation.sh` per merge unit with parity gates and auto-rollback on failure

- Verification
  - Re-run MCP visual + CSSOM diffs; require exact matches
  - **Build Validation**: Test that npm run build:css produces identical global.css
  - **Accessibility Validation**: Re-check focus states, keyboard navigation, and contrast remain unchanged
  - **Performance Validation**: Confirm CSS bytes, request count, and parse time meet budgets

- Deployment
  - Update HTML/PHP `<link>`s only after parity proven; keep rollback path documented
  - **Update Documentation**: Document new CSS architecture and build process

### Artifacts

- `tests/reports/<timestamp>/*`: screenshots, DOM snapshots, computed-style JSONs, diff reports
- **Build Process Docs**: Updated package.json comments and README section
- **CSS Architecture**: Layer documentation and naming conventions
 - **Config Files**: `tests/config/cssom-diff-properties.json`, `tests/config/build-order.json`

### Notes

- No change to class names, selectors, or focus behavior during consolidation
- Accessibility remains first-class; WCAG parity required
- **Modern CSS Features**: Consider CSS nesting and modern layout techniques where appropriate
- **Windows Compatibility**: Ensure all paths work in Git Bash environment
 - Scope for this phase: Mobile CSS is out of scope; validation is desktop-only

### Progress

- Completed (desktop-only scope):
  - Plan refined to desktop-only validation and updated guardrails
  - Config added: `tests/config/cssom-diff-properties.json` and `tests/config/build-order.json`
  - Automation stub created: `scripts/css-consolidation.sh`
  - Local server verified and Chrome MCP connectivity confirmed
  - Baseline capture started for `php/home.php` (desktop): meta, DOM, network, screenshot captured; CSSOM subset computed (file write queued)

- Next (desktop-only):
  - Write `cssom-desktop.json` for `php/home.php`
  - Capture desktop baselines for `index.php`, `php/mychecklist.php`, `php/admin.php`
  - Proceed to iterative consolidation with parity gates
