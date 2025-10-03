#!/bin/bash
# Environment setup for Cursor MCP optimization

echo "🔧 Setting up Cursor MCP environment..."

# Check for GitHub token
if [ -z "${GITHUB_TOKEN:-}" ]; then
    echo "⚠️  GITHUB_TOKEN not set. GitHub MCP will have limited functionality."
    echo "   To enable full GitHub integration:"
    echo "   1. Create a GitHub Personal Access Token"
    echo "   2. Set environment variable: export GITHUB_TOKEN=your_token_here"
    echo "   3. Add to your shell profile: echo 'export GITHUB_TOKEN=your_token_here' >> ~/.zshrc"
fi

# Verify Node.js and npm
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js for MCP functionality."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm not found. Please install npm for MCP functionality."
    exit 1
fi

echo "✅ Environment setup complete"
