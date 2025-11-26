# Claude Code IDE Setup Guide

**Template for Claude Code IDE (Claude Desktop) specific documentation**

---

## Overview

This branch contains **Claude Code IDE-specific documentation** for setting up MCP servers with Claude Desktop.

**Status**: This branch is a template. Please review the [cursor branch](https://github.com/gjoeckel/my-mcp-servers/tree/cursor) and use its structure as a template to populate this branch with Claude Code IDE-specific information.

---


## ⚠️ Editing Guidelines

**DO EDIT in this branch**:
- Claude Code-specific setup guides
- Claude Code-specific configuration examples
- Claude Code-specific workflows

**DO NOT EDIT in this branch** (edit in `main` branch instead):
- IDE-agnostic configuration files
- Shared documentation
- Package information

**For IDE-agnostic information**, always edit in the `main` branch to ensure consistency across all IDEs.


## Instructions for AI Agents

### Step 1: Review Cursor Branch

1. **Switch to cursor branch**
   ```bash
   git checkout cursor
   ```

2. **Review documentation structure**
   - README.md - Overview and navigation
   - CURSOR-SETUP-GUIDE.md - Detailed setup instructions
   - CURSOR-AUTONOMOUS-SETUP.md - Autonomous operation setup
   - YOLO-FULL-WORKFLOW.md - Workflow documentation
   - config/ - Configuration files

3. **Understand the pattern**
   - How Cursor-specific setup is documented
   - How configuration files are structured
   - How workflows are explained

### Step 2: Adapt for Claude Code IDE

1. **Create Claude Code-specific documentation**
   - CLAUDE-CODE-SETUP-GUIDE.md - Claude Desktop setup instructions
   - CLAUDE-CODE-CONFIG.md - Claude Desktop configuration
   - Claude Desktop workflows and features

2. **Adapt configuration examples**
   - Claude Desktop config file locations:
     - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
     - Windows: `%APPDATA%\Claude\claude_desktop_config.json`
     - Linux: `~/.config/Claude/claude_desktop_config.json`
   - Claude Desktop-specific settings
   - Claude Desktop MCP server configuration

3. **Document Claude Desktop-specific features**
   - Claude Desktop workflows
   - Claude Desktop settings
   - Claude Desktop troubleshooting

### Step 3: Maintain Consistency

- Use same documentation structure as cursor branch
- Link back to main branch for shared information
- Include Claude Desktop-specific details
- Provide working examples

---

## General MCP Information

For general MCP server information (IDE-agnostic), see the [main branch](https://github.com/gjoeckel/my-mcp-servers):

- [Main README](https://github.com/gjoeckel/my-mcp-servers)
- [OPTIMIZED-CONFIG.md](https://github.com/gjoeckel/my-mcp-servers/blob/main/OPTIMIZED-CONFIG.md) - 39-tool configuration
- [MCP-SERVERS-IMPLEMENTATION.md](https://github.com/gjoeckel/my-mcp-servers/blob/main/docs/MCP-SERVERS-IMPLEMENTATION.md) - Implementation guide

---

## Claude Desktop Information Needed

To complete this branch, gather:

1. **Configuration Location**
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`
   - Linux: `~/.config/Claude/claude_desktop_config.json`
   - Config file format and structure

2. **Settings Location**
   - Where are Claude Desktop settings stored?
   - Settings file format

3. **MCP Integration**
   - How does Claude Desktop integrate with MCP?
   - Claude Desktop-specific MCP features
   - MCP server startup process

4. **Workflows**
   - Claude Desktop-specific workflows
   - Claude Desktop automation features

5. **Troubleshooting**
   - Claude Desktop-specific issues
   - Common Claude Desktop setup problems

---

## Template Structure

Based on cursor branch, this branch should include:

```
claude-code/
├── README.md                          # This file (update with Claude Desktop info)
├── CLAUDE-CODE-SETUP-GUIDE.md        # Detailed Claude Desktop setup
├── CLAUDE-CODE-CONFIG.md             # Claude Desktop configuration guide
└── config/                            # Claude Desktop config examples
    ├── claude_desktop_config.json    # Claude Desktop MCP config
    └── settings.json                 # Claude Desktop settings (if applicable)
```

---

## Known Claude Desktop Configuration

### Config File Location

**macOS**:
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

**Windows**:
```
%APPDATA%\Claude\claude_desktop_config.json
```

**Linux**:
```
~/.config/Claude/claude_desktop_config.json
```

### MCP Configuration Format

Claude Desktop uses a similar MCP configuration format:

```json
{
  "mcpServers": {
    "server-name": {
      "command": "npx",
      "args": ["-y", "package-name"],
      "env": {
        "ENV_VAR": "value"
      }
    }
  }
}
```

**Note**: Replace `${HOME}` with actual paths (Claude Desktop may not expand variables).

---

## Next Steps

1. **Review cursor branch structure**
2. **Research Claude Desktop**
   - Configuration locations (see above)
   - MCP integration details
   - Settings format
3. **Create Claude Desktop-specific documentation**
4. **Test configuration examples**
5. **Update this README with actual information**

---

## Related Branches

- [Main Branch](https://github.com/gjoeckel/my-mcp-servers) - Shared documentation
- [Cursor Branch](https://github.com/gjoeckel/my-mcp-servers/tree/cursor) - Template reference
- [Antigravity Branch](https://github.com/gjoeckel/my-mcp-servers/tree/antigravity) - Antigravity IDE setup

---

**Status**: Template - Awaiting Claude Desktop-specific documentation
**Last Updated**: November 26, 2025

