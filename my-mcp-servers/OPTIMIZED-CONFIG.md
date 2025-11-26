# Optimized MCP Configuration (39 Tools)

**Target**: Stay under 40-tool limit for Claude/Cursor IDE
**Date**: November 24, 2025

---

## 🎯 Recommended Configuration

This configuration provides 39 tools across 6 essential servers, staying safely under the 40-tool limit.

### **Configuration File**: `.cursor/mcp.json` (Cursor) or IDE-specific config

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "${HOME}"
      ],
      "env": {
        "ALLOWED_PATHS": "${HOME}:${HOME}/.cursor:${HOME}/.config",
        "READ_ONLY": "false"
      }
    },
    "memory": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-memory"
      ]
    },
    "agent-autonomy": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-agent-autonomy"
      ],
      "env": {
        "WORKING_DIRECTORY": "${HOME}/your-project"
      }
    },
    "github-minimal": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-github-minimal"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "shell-minimal": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-shell-minimal"
      ],
      "env": {
        "WORKING_DIRECTORY": "${HOME}/your-project",
        "ALLOWED_COMMANDS": "npm,git,node,php,composer,curl,wget,ls,cat,grep,find,chmod,chown,mkdir,rm,cp,mv,echo,sleep,kill,ps,touch,pwd,which,whoami"
      }
    },
    "playwright-minimal": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-playwright-minimal"
      ]
    }
  }
}
```

---

## 📊 Tool Count Breakdown

| Server | Tools | Type | Essential |
|--------|-------|------|-----------|
| `filesystem` | 15 | Official | ✅ Yes |
| `memory` | 8 | Official | ✅ Yes |
| `agent-autonomy` | 4 | Custom | ✅ Yes |
| `github-minimal` | 4 | Custom | ✅ Yes |
| `shell-minimal` | 4 | Custom | ✅ Yes |
| `playwright-minimal` | 4 | Custom | ✅ Yes |
| **TOTAL** | **39** | | ✅ **Under Limit** |

---

## ⚠️ Servers to Avoid (When Over Limit)

If you exceed 40 tools, remove these optional servers:

| Server | Tools | Priority |
|--------|-------|----------|
| `mcp-everything-minimal` | ~25 | ❌ Remove first |
| `mcp-sequential-thinking-minimal` | ~5 | ⚠️ Remove if needed |

---

## 🔧 Quick Setup

1. **Copy configuration** above to your IDE's MCP config file
2. **Set environment variables**:
   ```bash
   export GITHUB_TOKEN="your_token_here"
   export WORKING_DIRECTORY="$HOME/your-project"
   ```
3. **Restart IDE**
4. **Verify**: Should show 39 tools connected

---

## 📝 Configuration Notes

- **npx -y**: Automatically installs packages if not present
- **Environment variables**: Use `${VAR}` syntax in config
- **Paths**: Adjust `${HOME}` and paths for your system
- **Security**: GitHub token requires `repo` scope

For detailed setup instructions, see [IDE-SETUP-GUIDE.md](./IDE-SETUP-GUIDE.md).
