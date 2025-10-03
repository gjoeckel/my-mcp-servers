#!/bin/bash
# Make all MCP scripts executable

chmod +x scripts/start-mcp-servers.sh
chmod +x scripts/restart-mcp-servers.sh
chmod +x scripts/check-cursor-mcp.sh
chmod +x scripts/check-mcp-health.sh
chmod +x scripts/check-mcp-simple.sh

echo "✅ All MCP scripts made executable"