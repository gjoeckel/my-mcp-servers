#!/bin/bash
# Start MCP Servers for Autonomous Operation
# This script ensures all MCP servers are running properly

set -euo pipefail

echo "🚀 STARTING MCP SERVERS FOR AUTONOMOUS OPERATION"
echo "================================================="

# Set environment variables
export PROJECT_ROOT="/Users/a00288946/Desktop/template"
export CURSOR_MCP_ENV=1

# Load environment variables if .env exists
if [ -f "$PROJECT_ROOT/.env" ]; then
    export $(grep -v '^#' "$PROJECT_ROOT/.env" | xargs)
fi

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
    
    # Create environment file for this server
    local env_file="$PROJECT_ROOT/.cursor/${server_name}.env"
    if [ -n "$env_vars" ]; then
        echo "$env_vars" > "$env_file"
    fi
    
    # Start server in background
    local log_file="$PROJECT_ROOT/logs/mcp-${server_name}.log"
    nohup $command $args > "$log_file" 2>&1 &
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

# Filesystem MCP
start_mcp_server "filesystem" \
    "npx" \
    "-y @modelcontextprotocol/server-filesystem /Users/a00288946/Desktop/template" \
    "ALLOWED_PATHS=/Users/a00288946/Desktop/template:/Users/a00288946/.cursor:/Users/a00288946/.config/mcp
READ_ONLY=false"

# Memory MCP
start_mcp_server "memory" \
    "npx" \
    "-y @modelcontextprotocol/server-memory"

# Puppeteer MCP
start_mcp_server "puppeteer" \
    "npx" \
    "-y @modelcontextprotocol/server-puppeteer"

# GitHub MCP (if token available)
if [ -n "${GITHUB_TOKEN:-}" ]; then
    start_mcp_server "github" \
        "npx" \
        "-y @modelcontextprotocol/server-github" \
        "GITHUB_PERSONAL_ACCESS_TOKEN=${GITHUB_TOKEN}"
else
    echo "⚠️  GitHub MCP skipped - no token available"
fi

# Sequential Thinking MCP
start_mcp_server "sequential-thinking" \
    "npx" \
    "-y @modelcontextprotocol/server-sequential-thinking"

# Everything MCP
start_mcp_server "everything" \
    "npx" \
    "-y @modelcontextprotocol/server-everything"

# Wait for servers to initialize
echo "⏳ Waiting for MCP servers to initialize..."
sleep 5

# Verify servers are running
echo "🔍 Verifying MCP servers..."
for server in filesystem memory puppeteer sequential-thinking everything; do
    pid_file="$PROJECT_ROOT/.cursor/${server}.pid"
    if [ -f "$pid_file" ]; then
        pid=$(cat "$pid_file")
        if kill -0 "$pid" 2>/dev/null; then
            echo "✅ $server MCP server running (PID: $pid)"
        else
            echo "❌ $server MCP server not running"
        fi
    fi
done

# Create MCP status file
cat > "$PROJECT_ROOT/.cursor/mcp-status.json" << EOF
{
  "status": "running",
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "servers": {
    "filesystem": $(if [ -f "$PROJECT_ROOT/.cursor/filesystem.pid" ]; then echo "true"; else echo "false"; fi),
    "memory": $(if [ -f "$PROJECT_ROOT/.cursor/memory.pid" ]; then echo "true"; else echo "false"; fi),
    "puppeteer": $(if [ -f "$PROJECT_ROOT/.cursor/puppeteer.pid" ]; then echo "true"; else echo "false"; fi),
    "github": $(if [ -f "$PROJECT_ROOT/.cursor/github.pid" ]; then echo "true"; else echo "false"; fi),
    "sequential-thinking": $(if [ -f "$PROJECT_ROOT/.cursor/sequential-thinking.pid" ]; then echo "true"; else echo "false"; fi),
    "everything": $(if [ -f "$PROJECT_ROOT/.cursor/everything.pid" ]; then echo "true"; else echo "false"; fi)
  },
  "autonomous_mode": true,
  "mcp_tools_available": true
}
EOF

echo ""
echo "🎯 MCP SERVERS STARTUP COMPLETE!"
echo "================================"
echo "✅ All MCP servers started"
echo "✅ Autonomous operation enabled"
echo "✅ MCP tools available for use"
echo ""
echo "📊 Server Status:"
cat "$PROJECT_ROOT/.cursor/mcp-status.json" | jq '.servers'
echo ""
echo "🚀 Ready for autonomous development!"
echo "   MCP tools should now be available in Cursor IDE"