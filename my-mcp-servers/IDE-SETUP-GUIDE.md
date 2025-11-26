# Custom MCP Servers - IDE Setup Guide

**Repository**: [https://github.com/gjoeckel/my-mcp-servers](https://github.com/gjoeckel/my-mcp-servers)
**Purpose**: Optimized MCP servers for 40-tool limit compliance
**Version**: 1.0.1

---

## 📋 Overview

This repository contains custom minimal MCP servers optimized to stay under the 40-tool limit while maintaining essential functionality. These servers are available as npm packages and can be configured in various IDEs that support the Model Context Protocol.

### **Available Packages**:

| Package | Tools | Description |
|---------|-------|-------------|
| `mcp-agent-autonomy` | 4 | Workflow automation and execution |
| `mcp-github-minimal` | 4 | Essential GitHub operations |
| `mcp-shell-minimal` | 4 | Shell command execution |
| `mcp-playwright-minimal` | 4 | Browser automation |
| `mcp-sequential-thinking-minimal` | ~5 | Problem-solving workflows |
| `mcp-everything-minimal` | ~25 | Protocol validation and diagnostics |

**Official Servers** (used alongside custom servers):
- `@modelcontextprotocol/server-filesystem` - 15 tools
- `@modelcontextprotocol/server-memory` - 8 tools

---

## 🎯 Recommended Configuration (39 Tools)

For optimal performance while staying under the 40-tool limit:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "${HOME}"]
    },
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"]
    },
    "agent-autonomy": {
      "command": "npx",
      "args": ["-y", "mcp-agent-autonomy"],
      "env": {
        "WORKING_DIRECTORY": "${HOME}/your-project"
      }
    },
    "github-minimal": {
      "command": "npx",
      "args": ["-y", "mcp-github-minimal"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "shell-minimal": {
      "command": "npx",
      "args": ["-y", "mcp-shell-minimal"],
      "env": {
        "WORKING_DIRECTORY": "${HOME}/your-project",
        "ALLOWED_COMMANDS": "npm,git,node,php,composer,curl,wget,ls,cat,grep,find,chmod,chown,mkdir,rm,cp,mv"
      }
    },
    "playwright-minimal": {
      "command": "npx",
      "args": ["-y", "mcp-playwright-minimal"]
    }
  }
}
```

**Total: 39 tools** ✅ (15 + 8 + 4 + 4 + 4 + 4)

---

## 🚀 Setup Instructions by IDE

### **1. Cursor IDE**

Cursor IDE has native MCP support with configuration in `.cursor/mcp.json`.

#### **Setup Steps**:

1. **Create/Edit Configuration File**:
   ```bash
   mkdir -p ~/.cursor
   nano ~/.cursor/mcp.json
   ```

2. **Add Configuration**:
   Copy the recommended configuration above, adjusting paths and environment variables as needed.

3. **Set Environment Variables** (if using GitHub):
   ```bash
   export GITHUB_TOKEN="your_github_token_here"
   ```

4. **Restart Cursor IDE**:
   - Quit Cursor completely (Cmd+Q / Ctrl+Q)
   - Reopen Cursor
   - MCP servers will auto-start

5. **Verify Installation**:
   - Check Cursor IDE's MCP status indicator
   - Should show 6 servers connected
   - Tool count should be ~39 tools

#### **Configuration File Location**:
- **macOS/Linux**: `~/.cursor/mcp.json`
- **Windows**: `%APPDATA%\Cursor\mcp.json`

---

### **2. Antigravity IDE**

Antigravity IDE supports MCP servers through its configuration system.

#### **Setup Steps**:

1. **Locate Configuration Directory**:
   - **macOS**: `~/Library/Application Support/Antigravity/`
   - **Linux**: `~/.config/antigravity/`
   - **Windows**: `%APPDATA%\Antigravity\`

2. **Create MCP Configuration**:
   ```bash
   mkdir -p ~/Library/Application\ Support/Antigravity/
   nano ~/Library/Application\ Support/Antigravity/mcp.json
   ```

3. **Add Configuration**:
   Use the recommended configuration above.

4. **Configure Environment Variables**:
   Create `.env` file in Antigravity config directory:
   ```bash
   echo "GITHUB_TOKEN=your_token_here" >> ~/Library/Application\ Support/Antigravity/.env
   ```

5. **Restart Antigravity IDE**:
   - Quit and reopen Antigravity IDE
   - MCP servers should initialize automatically

6. **Verify in Antigravity**:
   - Open IDE settings/preferences
   - Look for "MCP Servers" or "Model Context Protocol" section
   - Verify all 6 servers are connected

---

### **3. Claude Code IDE (Anthropic)**

Claude Code IDE supports MCP through Claude Desktop configuration.

#### **Setup Steps**:

1. **Locate Claude Desktop Configuration**:
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Linux**: `~/.config/Claude/claude_desktop_config.json`
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

2. **Create/Edit Configuration**:
   ```bash
   nano ~/Library/Application\ Support/Claude/claude_desktop_config.json
   ```

3. **Add MCP Servers Configuration**:
   ```json
   {
     "mcpServers": {
       "filesystem": {
         "command": "npx",
         "args": ["-y", "@modelcontextprotocol/server-filesystem", "${HOME}"]
       },
       "memory": {
         "command": "npx",
         "args": ["-y", "@modelcontextprotocol/server-memory"]
       },
       "agent-autonomy": {
         "command": "npx",
         "args": ["-y", "mcp-agent-autonomy"],
         "env": {
           "WORKING_DIRECTORY": "${HOME}/your-project"
         }
       },
       "github-minimal": {
         "command": "npx",
         "args": ["-y", "mcp-github-minimal"],
         "env": {
           "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
         }
       },
       "shell-minimal": {
         "command": "npx",
         "args": ["-y", "mcp-shell-minimal"],
         "env": {
           "WORKING_DIRECTORY": "${HOME}/your-project",
           "ALLOWED_COMMANDS": "npm,git,node,php,composer,curl,wget,ls,cat,grep,find,chmod,chown,mkdir,rm,cp,mv"
         }
       },
       "playwright-minimal": {
         "command": "npx",
         "args": ["-y", "mcp-playwright-minimal"]
       }
     }
   }
   ```

4. **Set Environment Variables**:
   Add to your shell profile (`.zshrc`, `.bashrc`, etc.):
   ```bash
   export GITHUB_TOKEN="your_github_token_here"
   ```

5. **Restart Claude Desktop**:
   - Quit Claude Desktop completely
   - Reopen Claude Desktop
   - MCP servers will auto-start

6. **Verify Connection**:
   - In Claude Desktop, check the status indicator
   - Should show MCP servers connected
   - Verify tool count is ~39

---

## 📦 Installation Methods

### **Method 1: npm Packages (Recommended)**

All custom servers are available on npm and will auto-install via `npx`:

```bash
# No manual installation needed - npx handles it automatically
# Just use in your mcp.json configuration as shown above
```

### **Method 2: Local Installation**

If you prefer to install locally:

```bash
npm install -g mcp-agent-autonomy
npm install -g mcp-github-minimal
npm install -g mcp-shell-minimal
npm install -g mcp-playwright-minimal
```

Then update `mcp.json` to use local paths:
```json
{
  "agent-autonomy": {
    "command": "mcp-agent-autonomy"
  }
}
```

---

## 🔧 Environment Variables

### **Required**:

- `GITHUB_TOKEN` or `GITHUB_PERSONAL_ACCESS_TOKEN` (for github-minimal)

### **Optional**:

- `WORKING_DIRECTORY` - Base directory for agent-autonomy and shell-minimal
- `ALLOWED_COMMANDS` - Space-separated list of allowed shell commands

### **Setting Environment Variables**:

**macOS/Linux** (add to `~/.zshrc` or `~/.bashrc`):
```bash
export GITHUB_TOKEN="your_token_here"
export WORKING_DIRECTORY="$HOME/your-project"
```

**Windows**:
```powershell
setx GITHUB_TOKEN "your_token_here"
setx WORKING_DIRECTORY "%USERPROFILE%\your-project"
```

---

## ✅ Verification

### **Check MCP Server Status**:

**Cursor IDE**:
- Look for MCP status indicator in status bar
- Check Cursor IDE logs for MCP connection messages

**Antigravity IDE**:
- Open IDE settings/preferences
- Navigate to MCP/Servers section
- Verify all servers show "Connected" status

**Claude Desktop**:
- Check Claude Desktop status/menu
- Look for MCP connection indicators
- Review connection logs if available

### **Verify Tool Count**:

All IDEs should show approximately **39 tools** when using the recommended configuration. If you see more than 40 tools, you may need to remove optional servers.

---

## 🐛 Troubleshooting

### **Issue: Servers Not Connecting**

1. **Check Node.js Installation**:
   ```bash
   node --version  # Should be v18+
   npm --version
   ```

2. **Verify npm Packages**:
   ```bash
   npm view mcp-agent-autonomy version
   npm view mcp-github-minimal version
   ```

3. **Check Configuration Syntax**:
   ```bash
   python3 -m json.tool ~/.cursor/mcp.json  # Validate JSON
   ```

4. **Review IDE Logs**:
   - Cursor: Check Cursor IDE console/logs
   - Antigravity: Check IDE error logs
   - Claude: Check Claude Desktop logs

### **Issue: Over 40 Tools**

Remove optional servers:
- Remove `mcp-everything-minimal` (25 tools)
- Remove `mcp-sequential-thinking-minimal` (~5 tools)

This will reduce total to **39 tools**.

### **Issue: GitHub Operations Failing**

1. **Verify Token**:
   ```bash
   echo $GITHUB_TOKEN  # Should show your token
   ```

2. **Check Token Permissions**:
   - Token needs `repo` scope for GitHub operations
   - Regenerate token if needed: https://github.com/settings/tokens

---

## 📚 Additional Resources

- **Repository**: https://github.com/gjoeckel/my-mcp-servers
- **npm Packages**: https://www.npmjs.com/~gjoeckel
- **MCP Documentation**: https://modelcontextprotocol.io
- **Cursor IDE Docs**: https://cursor.sh/docs

---

## 🆘 Support

For issues or questions:
- **GitHub Issues**: https://github.com/gjoeckel/my-mcp-servers/issues
- **Email**: g.joeckel@usu.edu

---

## 📝 Version History

- **v1.0.1** (2025-11-24): Optimized for 40-tool limit, added IDE setup guides
- **v1.0.0**: Initial release
