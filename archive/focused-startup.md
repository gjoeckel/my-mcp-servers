### Understanding

- **Priority order**:
  - **A.** Always use MCP tools when available
  - **B.** Code must be Simple, Reliable, and DRY (SRD)
  - **C.** Limit Chrome MCP startup to only:
    1. Validating the server is running
    2. Performing just the healthcheck

- **Follow Rules process**: It is currently too comprehensive and resource-heavy for most agents. We will simplify it to align with the above priorities and reduce resource usage.

### Clarifications Needed Before Changes

1. **Target scripts/files to modify**: Should the scope include `scripts/follow-rules.sh`, `scripts/start-chrome-debug.sh`, `tests/start_server.sh`, and any others?
2. **Healthcheck details**:
   - Exact healthcheck URL (e.g., `/health`, `/api/health`, or another route)?
   - Expected success criteria (HTTP 200 only, JSON shape, specific text)?
3. **Server startup assumptions**:
   - Confirm that the canonical startup command is `./tests/start_server.sh` (Git Bash), and whether it should be idempotent/non-blocking.
   - Default host/port to validate (e.g., `http://localhost:8080` or another).
4. **Chrome MCP scope**:
   - Confirm that we should strictly stop after: navigate to base URL → verify server up → call healthcheck → stop. No screenshots, no E2E, no performance, no accessibility.
5. **Environment/MCP availability**:
   - Which MCP servers are guaranteed available (Chrome DevTools, filesystem, GitHub)? Any constraints we should design around?
6. **Documentation updates**:
   - Should we update `README.md` and `best-practices.md` to reflect the minimal flow once implemented?
7. **Compatibility expectations**:
   - Any agents/environments with limited resources we must explicitly support beyond the default?

### Proposed Minimal Flow (pending your confirmation)

1. Start local server via `./tests/start_server.sh`.
2. Using Chrome MCP, navigate to base URL and confirm HTTP 200.
3. Call the defined healthcheck endpoint and verify success criteria.
4. End. Skip all extended checks (screenshots, E2E, perf, accessibility) unless explicitly requested.

Please confirm the above and provide the requested details so I can proceed with the implementation.
