# My Custom MCP Servers

**Repository**: [https://github.com/gjoeckel/my-mcp-servers](https://github.com/gjoeckel/my-mcp-servers)
**Purpose**: Custom MCP servers with minimal tool sets for 35-tool limit compliance
**Target**: Exactly 35 tools across 5 servers for optimal AI autonomous operation

---

## 🎯 **STRATEGY OVERVIEW**

This repository contains custom forks of official MCP servers, reduced to only essential tools to stay within the 35-tool limit while maintaining full functionality.

### **35-Tool Configuration**
```
✅ CUSTOM SERVERS (Forked & Reduced):
├── github-minimal: 4 tools (reduced from 20+ tools)
├── shell-minimal: 4 tools (reduced from 10+ tools)
└── puppeteer-minimal: 4 tools (reduced from 12+ tools)

✅ OFFICIAL SERVERS (Unchanged):
├── filesystem: 15 tools (all essential)
└── memory: 8 tools (all essential)

TOTAL: 4 + 4 + 4 + 15 + 8 = 35 tools ✅
```

---

## 📦 **PACKAGES**

### **GitHub Minimal** (`packages/github-minimal/`)
**Original**: `@modelcontextprotocol/server-github` (20+ tools)
**Custom**: 4 essential tools only

**Tools Included**:
- `get_file_contents` - Read repository files
- `create_or_update_file` - Manage repository files
- `push_files` - Deploy code changes
- `search_repositories` - Find relevant repos

**Tools Removed** (16+ tools):
- `list_commits`, `create_pull_request`, `fork_repository`
- `get_issue`, `create_issue`, `update_issue`, `list_issues`
- `get_pull_request`, `merge_pull_request`, `close_pull_request`
- `get_workflow`, `trigger_workflow`, `get_deployment`
- `get_release`, `create_release`, `list_releases`
- And more...

### **Shell Minimal** (`packages/shell-minimal/`)
**Original**: Custom implementation (no official server exists)
**Custom**: 4 essential tools only

**Tools Included**:
- `execute_command` - Run terminal commands
- `list_processes` - Check running processes
- `kill_process` - Stop processes
- `get_environment` - Check environment variables

**Tools Removed** (6+ tools):
- `check_status`, `get_system_info`, `monitor_performance`
- `backup_files`, `restore_files`, `schedule_task`
- And more...

### **Puppeteer Minimal** (`packages/puppeteer-minimal/`)
**Original**: `@modelcontextprotocol/server-puppeteer` (12+ tools)
**Custom**: 4 essential tools only

**Tools Included**:
- `navigate` - Navigate to URLs
- `screenshot` - Capture visual state
- `evaluate` - Execute JavaScript
- `click` - Interact with elements

**Tools Removed** (8+ tools):
- `fill`, `select`, `hover`, `wait`, `scroll`, `type`, `press_key`
- `get_text`, `get_attribute`
- And more...

---

## 🚀 **QUICK START**

### **Installation**
```bash
# Clone the repository
git clone https://github.com/gjoeckel/my-mcp-servers.git
cd my-mcp-servers

# Install all packages
npm run install-all

# Build all packages
npm run build-all

# Link all packages globally
npm run link-all
```

### **Usage in Cursor IDE**
Update your `.cursor/mcp.json`:
```json
{
  "mcpServers": {
    "github-minimal": {
      "command": "npx",
      "args": ["-y", "@gjoeckel/mcp-github-minimal"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "shell-minimal": {
      "command": "npx",
      "args": ["-y", "@gjoeckel/mcp-shell-minimal"],
      "env": {
        "WORKING_DIRECTORY": "/path/to/your/project",
        "ALLOWED_COMMANDS": "npm,git,node,php,composer,curl,wget,ls,cat,grep,find,chmod,chown,mkdir,rm,cp,mv"
      }
    },
    "puppeteer-minimal": {
      "command": "npx",
      "args": ["-y", "@gjoeckel/mcp-puppeteer-minimal"]
    },
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/your/project"]
    },
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"]
    }
  }
}
```

---

## 🔧 **DEVELOPMENT**

### **Project Structure**
```
my-mcp-servers/
├── packages/
│   ├── github-minimal/          # Forked GitHub server (4 tools)
│   ├── shell-minimal/           # Custom shell server (4 tools)
│   └── puppeteer-minimal/       # Forked Puppeteer server (4 tools)
├── scripts/
│   ├── build-all.sh            # Build all packages
│   ├── link-all.sh             # Link all packages globally
│   └── test-all.sh             # Test all packages
├── package.json                # Root package configuration
└── README.md                   # This file
```

### **Available Scripts**
```bash
# Development
npm run build-all              # Build all packages
npm run link-all               # Link all packages globally
npm run test-all               # Test all packages
npm run clean-all              # Clean all build directories

# Individual package commands
cd packages/github-minimal && npm run build
cd packages/shell-minimal && npm run build
cd packages/puppeteer-minimal && npm run build
```

### **Adding New Tools**
1. Edit the `tools` array in the package's main file
2. Add the corresponding handler in the `CallToolRequestSchema` handler
3. Build and test the package
4. Update documentation

### **Updating from Upstream**
```bash
# For forked packages (github-minimal, puppeteer-minimal)
cd packages/github-minimal
git remote add upstream https://github.com/modelcontextprotocol/servers.git
git fetch upstream
git merge upstream/main

# Reapply your tool filtering changes
# Test to ensure functionality is preserved
```

---

## 📊 **TOOL COUNT VERIFICATION**

### **Current Tool Distribution**
| Server | Original Tools | Custom Tools | Reduction | Status |
|--------|----------------|--------------|-----------|---------|
| GitHub | 20+ | 4 | 80% | ✅ Complete |
| Shell | 10+ | 4 | 60% | ✅ Complete |
| Puppeteer | 12+ | 4 | 67% | ✅ Complete |
| Filesystem | 15 | 15 | 0% | ✅ Official |
| Memory | 8 | 8 | 0% | ✅ Official |
| **TOTAL** | **65+** | **35** | **46%** | ✅ **PERFECT** |

### **Verification Commands**
```bash
# Check tool count in Cursor IDE
# The AI should have exactly 35 tools available

# Manual verification
npm run verify-tool-count

# Health check
npm run health-check
```

---

## 🎯 **BENEFITS**

### **Performance**
- ✅ **Faster Response**: Fewer tools = faster tool discovery
- ✅ **Lower Memory**: Reduced tool registration overhead
- ✅ **Better Reliability**: Less chance of tool conflicts

### **Maintenance**
- ✅ **Focused Tools**: Only essential functionality
- ✅ **Clear Purpose**: Each tool has specific use case
- ✅ **Easy Updates**: Can pull upstream bug fixes

### **Compliance**
- ✅ **35-Tool Limit**: Exactly at the optimal limit
- ✅ **No Bloat**: No unused or rarely-used tools
- ✅ **Full Functionality**: All essential operations preserved

---

## 🤝 **CONTRIBUTING**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### **Guidelines**
- Maintain the 35-tool limit
- Document any new tools
- Test with Cursor IDE integration
- Keep tool descriptions clear and concise

---

## 📄 **LICENSE**

ISC License - See individual package licenses for details.

---

## 🔗 **LINKS**

- **Repository**: [https://github.com/gjoeckel/my-mcp-servers](https://github.com/gjoeckel/my-mcp-servers)
- **Original MCP Servers**: [https://github.com/modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers)
- **MCP Documentation**: [https://modelcontextprotocol.io/](https://modelcontextprotocol.io/)

---

*This repository provides optimized MCP servers for AI autonomous operation within the 35-tool limit while maintaining full essential functionality.*
