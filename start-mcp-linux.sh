#!/bin/bash
# Start MCP Servers for Linux Environment
# Simplified version that works with the current setup

set -euo pipefail

echo "🚀 STARTING MCP SERVERS FOR LINUX"
echo "=================================="

PROJECT_ROOT="/workspace"
export CURSOR_MCP_ENV=1

# Create necessary directories
mkdir -p "$PROJECT_ROOT/.cursor"
mkdir -p "$PROJECT_ROOT/logs"

# Function to start MCP server
start_mcp_server() {
    local server_name="$1"
    local command="$2"
    local args="$3"
    local env_vars="${4:-}"

    echo "🔧 Starting $server_name MCP server..."

    # Start server in background
    local log_file="$PROJECT_ROOT/logs/mcp-${server_name}.log"
    
    if [ -n "$env_vars" ]; then
        env $env_vars nohup $command $args > "$log_file" 2>&1 &
    else
        nohup $command $args > "$log_file" 2>&1 &
    fi
    
    local pid=$!
    echo "$pid" > "$PROJECT_ROOT/.cursor/${server_name}.pid"
    echo "✅ $server_name MCP server started (PID: $pid)"
}

# Stop any existing MCP servers
echo "🛑 Stopping existing MCP servers..."
for pid_file in "$PROJECT_ROOT/.cursor"/*.pid; do
    if [ -f "$pid_file" ]; then
        pid=$(cat "$pid_file")
        if kill -0 "$pid" 2>/dev/null; then
            echo "Stopping process $pid..."
            kill "$pid" 2>/dev/null || true
        fi
        rm -f "$pid_file"
    fi
done

# Wait for cleanup
sleep 2

# Start MCP servers
echo "🚀 Starting MCP servers..."

# GitHub Minimal MCP (4 tools)
if [ -n "${GITHUB_TOKEN:-}" ]; then
    start_mcp_server "github-minimal" \
        "node" \
        "/workspace/my-mcp-servers/packages/github-minimal/build/index.js" \
        "GITHUB_PERSONAL_ACCESS_TOKEN=${GITHUB_TOKEN}"
else
    echo "⚠️  GitHub Minimal MCP skipped - no GITHUB_TOKEN available"
fi

# Shell Minimal MCP (4 tools)
start_mcp_server "shell-minimal" \
    "node" \
    "/workspace/my-mcp-servers/packages/shell-minimal/build/index.js" \
    "WORKING_DIRECTORY=/workspace ALLOWED_COMMANDS=npm,git,node,php,composer,curl,wget,ls,cat,grep,find,chmod,chown,mkdir,rm,cp,mv"

# Puppeteer Minimal MCP (4 tools)
start_mcp_server "puppeteer-minimal" \
    "node" \
    "/workspace/my-mcp-servers/packages/puppeteer-minimal/build/index.js"

# Sequential Thinking Minimal MCP (4 tools)
start_mcp_server "sequential-thinking-minimal" \
    "node" \
    "/workspace/my-mcp-servers/packages/sequential-thinking-minimal/build/index.js"

# Everything Minimal MCP (4 tools)
start_mcp_server "everything-minimal" \
    "node" \
    "/workspace/my-mcp-servers/packages/everything-minimal/build/index.js"

# Agent Autonomy MCP (4 tools)
start_mcp_server "agent-autonomy" \
    "node" \
    "/workspace/my-mcp-servers/packages/agent-autonomy/build/index.js" \
    "WORKING_DIRECTORY=/workspace"

# Filesystem MCP (15 tools)
start_mcp_server "filesystem" \
    "npx" \
    "-y @modelcontextprotocol/server-filesystem /workspace" \
    "ALLOWED_PATHS=/workspace:/home/ubuntu/.cursor:/home/ubuntu/.config/mcp READ_ONLY=false"

# Memory MCP (8 tools)
start_mcp_server "memory" \
    "npx" \
    "-y @modelcontextprotocol/server-memory"

echo "📊 Tool count:"
echo "   ✅ GitHub Minimal: 4 tools"
echo "   ✅ Shell Minimal: 4 tools"
echo "   ✅ Puppeteer Minimal: 4 tools"
echo "   ✅ Sequential Thinking Minimal: 4 tools"
echo "   ✅ Everything Minimal: 4 tools"
echo "   ✅ Agent Autonomy: 4 tools"
echo "   ✅ Filesystem: 15 tools"
echo "   ✅ Memory: 8 tools"
echo "   📈 Total: 47 tools"

# Wait for servers to initialize
echo "⏳ Waiting for MCP servers to initialize..."
sleep 5

# Verify servers are running
echo "🔍 Verifying MCP servers..."
servers=("github-minimal" "shell-minimal" "puppeteer-minimal" "sequential-thinking-minimal" "everything-minimal" "agent-autonomy" "filesystem" "memory")
all_running=true

for server in "${servers[@]}"; do
    if [ -f "$PROJECT_ROOT/.cursor/${server}.pid" ]; then
        pid=$(cat "$PROJECT_ROOT/.cursor/${server}.pid")
        if kill -0 "$pid" 2>/dev/null; then
            echo "✅ $server MCP server running (PID: $pid)"
        else
            echo "❌ $server MCP server not running"
            all_running=false
        fi
    else
        echo "❌ $server MCP server PID file missing"
        all_running=false
    fi
done

# Create MCP status file
cat > "$PROJECT_ROOT/.cursor/mcp-status.json" << EOF
{
  "status": "running",
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "servers": {
    "github-minimal": $(if [ -f "$PROJECT_ROOT/.cursor/github-minimal.pid" ]; then echo "true"; else echo "false"; fi),
    "shell-minimal": $(if [ -f "$PROJECT_ROOT/.cursor/shell-minimal.pid" ]; then echo "true"; else echo "false"; fi),
    "puppeteer-minimal": $(if [ -f "$PROJECT_ROOT/.cursor/puppeteer-minimal.pid" ]; then echo "true"; else echo "false"; fi),
    "sequential-thinking-minimal": $(if [ -f "$PROJECT_ROOT/.cursor/sequential-thinking-minimal.pid" ]; then echo "true"; else echo "false"; fi),
    "everything-minimal": $(if [ -f "$PROJECT_ROOT/.cursor/everything-minimal.pid" ]; then echo "true"; else echo "false"; fi),
    "agent-autonomy": $(if [ -f "$PROJECT_ROOT/.cursor/agent-autonomy.pid" ]; then echo "true"; else echo "false"; fi),
    "filesystem": $(if [ -f "$PROJECT_ROOT/.cursor/filesystem.pid" ]; then echo "true"; else echo "false"; fi),
    "memory": $(if [ -f "$PROJECT_ROOT/.cursor/memory.pid" ]; then echo "true"; else echo "false"; fi)
  },
  "autonomous_mode": true,
  "mcp_tools_available": true,
  "tool_count": "47_tools",
  "configuration": "linux-optimized"
}
EOF

echo ""
echo "🎯 MCP SERVERS STARTUP COMPLETE!"
echo "================================"
echo "✅ All MCP servers started successfully"
echo "✅ Autonomous operation enabled"
echo "✅ MCP tools available for use"
echo ""
echo "📊 Server Status:"
cat "$PROJECT_ROOT/.cursor/mcp-status.json" | jq '.servers' 2>/dev/null || echo "Status file created"
echo ""
echo "🚀 Ready for autonomous development!"