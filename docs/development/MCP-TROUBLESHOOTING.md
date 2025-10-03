# MCP (Model Context Protocol) Troubleshooting Guide

## Why MCP Tools Aren't Showing Up

If you're not seeing MCP tools in Cursor IDE after restarting, here are the most common causes and solutions:

## 🔍 **Quick Diagnosis**

### 1. Check MCP Status
```bash
~/.config/mcp/check-mcp-status.sh
```

### 2. Verify Cursor Settings
Check if MCP is enabled in Cursor settings:
```bash
cat ~/Library/Application\ Support/Cursor/User/settings.json | grep -A 10 "mcp"
```

### 3. Check MCP Configuration
```bash
cat ~/.config/mcp/cursor-config.json
```

## 🛠️ **Common Issues & Solutions**

### Issue 1: MCP Not Enabled in Cursor Settings
**Symptoms:** No MCP tools visible in Cursor
**Solution:**
```bash
# Run the updated configuration script
/Users/a00288946/Desktop/template/configure-cursor-autonomy.sh
```

### Issue 2: MCP Servers Not Installed
**Symptoms:** MCP tools show but don't work
**Solution:**
```bash
# Install MCP servers
/Users/a00288946/Desktop/template/setup-mcp-servers.sh
```

### Issue 3: Node.js Not Available
**Symptoms:** MCP setup fails
**Solution:**
```bash
# Install Node.js via NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
source ~/.zshrc
nvm install --lts
nvm use --lts
```

### Issue 4: Cursor Not Restarted Properly
**Symptoms:** Settings applied but MCP not working
**Solution:**
1. Quit Cursor completely (Cmd+Q)
2. Wait 5 seconds
3. Reopen Cursor
4. Open the template directory: `cursor /Users/a00288946/Desktop/template`

### Issue 5: MCP Configuration Path Issues
**Symptoms:** MCP config not found
**Solution:**
```bash
# Verify config file exists
ls -la ~/.config/mcp/cursor-config.json

# If missing, recreate it
mkdir -p ~/.config/mcp
/Users/a00288946/Desktop/template/setup-mcp-servers.sh
```

## 🔧 **Manual MCP Setup**

If the automated setup isn't working, try manual setup:

### 1. Install MCP Servers Manually
```bash
npm install -g @modelcontextprotocol/server-filesystem
npm install -g @modelcontextprotocol/server-memory
npm install -g @modelcontextprotocol/server-git
npm install -g @modelcontextprotocol/server-github
```

### 2. Create MCP Configuration
```bash
mkdir -p ~/.config/mcp
cat > ~/.config/mcp/cursor-config.json << 'EOF'
{
  "mcpServers": {
    "filesystem": {
      "command": "@modelcontextprotocol/server-filesystem",
      "args": ["--root", "~"]
    },
    "memory": {
      "command": "@modelcontextprotocol/server-memory"
    },
    "git": {
      "command": "@modelcontextprotocol/server-git",
      "args": ["--root", "~"]
    },
    "github": {
      "command": "@modelcontextprotocol/server-github"
    }
  }
}
EOF
```

### 3. Update Cursor Settings
```bash
# Add MCP settings to Cursor
cat >> ~/Library/Application\ Support/Cursor/User/settings.json << 'EOF'
,
  "mcp.enabled": true,
  "mcp.configPath": "~/.config/mcp/cursor-config.json",
  "mcp.autoStart": true
EOF
```

## 🚀 **Complete Reset & Reinstall**

If nothing else works, try a complete reset:

```bash
# 1. Remove existing MCP configuration
rm -rf ~/.config/mcp

# 2. Remove MCP from Cursor settings
cp ~/Library/Application\ Support/Cursor/User/settings.json ~/Library/Application\ Support/Cursor/User/settings.json.backup
grep -v "mcp\." ~/Library/Application\ Support/Cursor/User/settings.json > ~/Library/Application\ Support/Cursor/User/settings.json.tmp
mv ~/Library/Application\ Support/Cursor/User/settings.json.tmp ~/Library/Application\ Support/Cursor/User/settings.json

# 3. Run complete setup
/Users/a00288946/Desktop/template/configure-cursor-autonomy.sh

# 4. Restart Cursor completely
```

## 📊 **Verification Steps**

After setup, verify MCP is working:

1. **Check MCP Status:**
   ```bash
   ~/.config/mcp/check-mcp-status.sh
   ```

2. **Test in Cursor:**
   - Open Cursor IDE
   - Open chat/AI interface
   - Look for MCP tools in the interface
   - Try asking: "What MCP tools are available?"

3. **Test MCP Functionality:**
   - Try file system operations
   - Try memory operations
   - Try git operations

## 🆘 **Still Not Working?**

If MCP tools still aren't showing up:

1. **Check Cursor Version:** Ensure you're using a recent version of Cursor IDE
2. **Check Logs:** Look for error messages in Cursor's developer console
3. **Try Alternative MCP Servers:** Some servers might not be compatible
4. **Contact Support:** The issue might be with Cursor IDE itself

## 📝 **Expected MCP Tools**

Once working, you should see these MCP tools:
- **File System:** Read, write, list files and directories
- **Memory:** Store and retrieve information
- **Git:** Git operations and repository management
- **GitHub:** GitHub API operations
- **macOS:** System control and application management
- **Xcode:** Build and development operations

## 🎯 **Success Indicators**

MCP is working correctly when:
- ✅ MCP tools appear in Cursor's AI interface
- ✅ You can perform file system operations
- ✅ Memory operations work
- ✅ Git operations are available
- ✅ No error messages in Cursor console
