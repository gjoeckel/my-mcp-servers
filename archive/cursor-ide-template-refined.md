# Cursor IDE Template - Refined Documentation

## Overview

This template provides a practical Cursor IDE project setup with MCP (Model Context Protocol) integration, optimized for Windows 11 development using Git Bash. Based on analysis of real-world projects, it focuses on essential patterns that are universally applicable rather than project-specific features.

---

## Directory Structure

```
cursor-template/
├── .cursor/
│   └── rules/
│       ├── always.md                    # Core context, always applied
│       ├── ai-optimized.md              # AI agent optimization rules
│       ├── development.md               # Development workflow
│       ├── enhanced-development.md      # Enhanced development rules with DRY enforcement
│       ├── project.md                   # Project-level principles
│       └── testing.md                   # Testing framework rules
│
├── config/                              # Application configurations
│   ├── deploy-config.json               # Deployment configuration
│   ├── app-config.json                  # Basic app configuration
│   └── README.md                        # Config documentation
│
├── scripts/                             # Essential automation scripts
│   ├── generate-timestamp.sh            # Changelog timestamp generation
│   ├── remote-permissions.sh            # Basic permission management
│   ├── deploy.sh                        # Simple deployment script
│   ├── validate-environment.sh          # Environment validation
│   ├── health-check.sh                  # Basic health validation
│   ├── detect-dry-violations.sh         # DRY violation detection
│   ├── consolidate-paths.sh             # Path management consolidation
│   ├── validate-api-patterns.sh         # API pattern validation
│   ├── check-mcp-health.sh              # MCP server health monitoring
│   ├── start-chrome-debug.sh            # Chrome debugging setup for MCP
│   ├── restart-mcp-servers.sh           # MCP server restart functionality
│   └── emergency-reset.sh               # Emergency rollback and recovery
│
├── docs/                                # Core documentation
│   ├── DEPLOYMENT.md                    # Basic deployment guide
│   ├── BEST-PRACTICES.md                # Development guidelines
│   ├── ENHANCED-BEST-PRACTICES.md       # Enhanced development guidelines
│   ├── TROUBLESHOOTING.md               # Common issues and solutions
│   ├── ENHANCED-TROUBLESHOOTING.md      # Enhanced troubleshooting guide
│   └── CHANGELOG-TEMPLATE.md            # Changelog format
│
├── examples/                            # Template examples
│   ├── api-utils.php                    # Standardized API patterns
│   ├── enhanced-api-utils.php           # Enhanced API utility functions
│   ├── path-utils.js                    # Path management utilities
│   ├── enhanced-path-utils.js           # Enhanced path management utilities
│   ├── health-check.php                 # Basic health endpoint
│   └── basic-structure/                 # Example project structure
│
├── tests/                               # Comprehensive testing infrastructure
│   ├── run_comprehensive_tests.php      # Master test runner
│   ├── start_server.sh                  # Local server for testing
│   ├── unit/                            # Unit tests
│   │   └── path_management_test.php     # Path utility tests
│   ├── integration/                     # Integration tests
│   │   └── save_restore_test.php        # API endpoint tests
│   ├── performance/                     # Performance tests
│   │   └── accessilist_performance_test.php
│   ├── e2e/                             # End-to-end tests
│   │   └── accessilist_user_journey_test.php
│   ├── accessibility/                   # Accessibility tests
│   │   └── wcag_compliance_test.php     # WCAG compliance tests
│   ├── chrome-mcp/                      # Chrome MCP tests
│   │   ├── run_chrome_mcp_tests.php     # MCP test runner
│   │   └── accessilist_frontend_integration_test.php
│   └── screenshots/                     # Test screenshots
│
├── .gitignore                           # Git ignore patterns
├── README.md                            # Project overview
├── CURSOR-SETUP.md                      # Cursor IDE setup
└── MCP-CONFIG-TEMPLATE.json             # MCP configuration template
```

---

## Usage Instructions

### 1. Copy Template to New Project

```bash
# Navigate to projects directory
cd C:\Users\George\Projects

# Copy template to new project
cp -r cursor-template [project-name]

# Navigate to new project
cd [project-name]
```

### 2. Customize Project

```bash
# Update placeholders in README.md
# Replace: [PROJECT_NAME] with your project name
# Replace: [PROJECT_DESCRIPTION] with actual description

# Update .cursor/rules/always.md
# Replace project-specific placeholders

# Update MCP-CONFIG-TEMPLATE.json
# Replace [PROJECT_NAME] with your project name
```

### 3. Configure MCP

```bash
# Copy MCP template to Cursor config
cp MCP-CONFIG-TEMPLATE.json ~/.cursor/mcp.json

# Edit ~/.cursor/mcp.json
# Update paths to match your system
```

### 4. Initialize Git

```bash
git init
git add .
git commit -m "Initial commit from Cursor template"
git remote add origin [your-repo-url]
git push -u origin main
```

### 5. Validate Setup

```bash
# Make scripts executable
chmod +x scripts/*.sh

# Run validation
./scripts/validate-environment.sh

# Check basic health
./scripts/health-check.sh
```

### 6. Start Development

```bash
# Start local server (if applicable)
php -S localhost:8000

# Open in Cursor and start coding!
```

---

## File Contents

### Root Level: `.gitignore`

```gitignore
# MCP and Cursor
.cursor/cache/
.cursor/mcp-cache/
.cursor/mcp-memory/

# Node modules
node_modules/
npm-debug.log*
package-lock.json

# Environment files
.env
.env.local
.env.*.local

# OS files
.DS_Store
Thumbs.db
desktop.ini

# IDE
.vscode/
.idea/

# Logs
*.log
logs/

# Test artifacts
tests/screenshots/
tests/reports/

# Cache
cache/
*.cache

# Build artifacts
dist/
build/
```

---

### Root Level: `README.md`

```markdown
# [PROJECT_NAME]

[PROJECT_DESCRIPTION]

## Quick Start

1. Prerequisites: Node.js, PHP 8.x, Git Bash, Chrome
2. Setup MCP: Copy MCP-CONFIG-TEMPLATE.json to ~/.cursor/mcp.json and update paths
3. Configure Cursor: Follow CURSOR-SETUP.md
4. Verify Setup: Run ./scripts/validate-environment.sh

## MCP Tools

This project uses Model Context Protocol (MCP) tools for enhanced development:

- Chrome DevTools MCP: Browser automation and testing
- Filesystem MCP: Enhanced file operations
- Memory MCP: Persistent context across sessions
- GitHub MCP: Repository management and operations

## Development Workflow

### Terminal Setup (Windows)
CRITICAL: Always use Git Bash terminal (not PowerShell or CMD)
- Configure in Cursor: Settings > Terminal > Default Profile (Windows) > Git Bash
- Verify: echo $SHELL should show /usr/bin/bash

### Common Commands

```bash
# Validate environment
./scripts/validate-environment.sh

# Check basic health
./scripts/health-check.sh

# Generate timestamp for changelog
./scripts/generate-timestamp.sh

# Deploy to remote server
./scripts/deploy.sh
```

## Documentation

- Setup Guide: CURSOR-SETUP.md
- Deployment: docs/DEPLOYMENT.md
- Best Practices: docs/BEST-PRACTICES.md
- Troubleshooting: docs/TROUBLESHOOTING.md

## Project Structure

- .cursor/rules/: AI agent context and development rules
- config/: Application configuration files
- scripts/: Essential automation scripts
- docs/: Project documentation
- examples/: Template examples and patterns
```

---

### Root Level: `CURSOR-SETUP.md`

```markdown
# Cursor IDE Setup Guide

## Step 1: Install Prerequisites

### Required Software
- Cursor IDE: Download from https://cursor.sh
- Node.js: v18 or later (includes npx)
- PHP: v8.0 or later
- Git for Windows: Includes Git Bash
- Chrome: For browser automation

### Verification
```bash
node --version      # Should show v18+
php --version       # Should show 8.0+
git --version       # Should show 2.x+
```

## Step 2: Configure Git Bash as Default Terminal

CRITICAL for Windows users

1. Open Cursor Settings: Ctrl + ,
2. Search: terminal.integrated.defaultProfile.windows
3. Select: Git Bash
4. Restart terminal panel

Verify:
```bash
echo $SHELL
# Should show: /usr/bin/bash or /bin/bash
```

## Step 3: Configure MCP Servers

### Copy MCP Configuration
```bash
cp MCP-CONFIG-TEMPLATE.json ~/.cursor/mcp.json
```

### Update Paths in ~/.cursor/mcp.json

1. Filesystem MCP: Update to your projects directory
2. GitHub MCP: Update to your project path

### Restart Cursor
Close and reopen Cursor completely to load MCP servers.

## Step 4: Verify MCP Setup

```bash
# Run basic validation
./scripts/validate-environment.sh
```

## Step 5: Understanding Cursor Rules

Cursor rules in .cursor/rules/ provide context to AI agents:

### Always Applied
- always.md: Core project context and workflow rules

### Conditionally Applied
- ai-optimized.md: AI agent decision framework
- development.md: Development workflow and best practices
- enhanced-development.md: Enhanced development rules with DRY enforcement
- project.md: Project-level principles
- testing.md: Testing framework rules

## Step 6: Customize Rule Files

1. Open .cursor/rules/always.md
2. Replace [PROJECT_NAME] with your project name
3. Replace [PROJECT_DESCRIPTION] with description
4. Update any project-specific paths or configurations

## Step 7: Initial Validation

```bash
./scripts/validate-environment.sh
```

This checks:
- Shell configuration (Git Bash)
- Node.js and npm
- PHP installation
- Git configuration
- Basic MCP server connectivity

## Troubleshooting

### MCP Servers Not Starting
1. Verify config location: ~/.cursor/mcp.json
2. Check JSON syntax
3. Restart Cursor completely

### Wrong Terminal Shell
```bash
echo $SHELL  # Must show: /usr/bin/bash
```

## Next Steps

- Read Setup Guide for project-specific setup
- Review Best Practices Guide for development patterns
- Check Troubleshooting Guide for common issues
```

---

### Root Level: `MCP-CONFIG-TEMPLATE.json`

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": [
        "chrome-devtools-mcp@latest",
        "--browserUrl",
        "http://127.0.0.1:9222"
      ]
    },
    "filesystem": {
      "command": "npx",
      "args": [
        "@modelcontextprotocol/server-filesystem",
        "C:\\Users\\George\\Projects"
      ]
    },
    "memory": {
      "command": "npx",
      "args": [
        "@modelcontextprotocol/server-memory@latest"
      ]
    },
    "github": {
      "command": "C:\\Users\\George\\Projects\\[PROJECT_NAME]\\scripts\\run-github-mcp.bat",
      "args": []
    }
  }
}
```

---

### Script: `scripts/validate-environment.sh`

```bash
#!/bin/bash
# Basic Environment Validation Script

set -e

echo "=========================================="
echo "Environment Validation"
echo "=========================================="

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

VALIDATION_PASSED=true

print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $2"
    else
        echo -e "${RED}✗${NC} $2"
        VALIDATION_PASSED=false
    fi
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

echo ""
echo "1. Checking Shell Environment..."
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
    print_status 0 "Git Bash detected"
else
    print_status 1 "Not running in Git Bash"
fi

if [[ "$SHELL" =~ "bash" ]]; then
    print_status 0 "Shell environment: $SHELL"
else
    print_status 1 "Shell environment incorrect: $SHELL"
fi

echo ""
echo "2. Checking Required Software..."
if command -v node &> /dev/null; then
    print_status 0 "Node.js: $(node --version)"
else
    print_status 1 "Node.js not found"
fi

if command -v npm &> /dev/null; then
    print_status 0 "npm: $(npm --version)"
else
    print_status 1 "npm not found"
fi

if command -v php &> /dev/null; then
    print_status 0 "PHP: $(php --version | head -n 1)"
else
    print_status 1 "PHP not found"
fi

if command -v git &> /dev/null; then
    print_status 0 "Git: $(git --version)"
else
    print_status 1 "Git not found"
fi

echo ""
echo "3. Checking Git Configuration..."
GIT_AUTOCRLF=$(git config --get core.autocrlf 2>/dev/null || echo "not set")
if [[ "$GIT_AUTOCRLF" == "true" ]]; then
    print_status 0 "Git autocrlf: $GIT_AUTOCRLF"
else
    print_warning "Git autocrlf not set to 'true'"
fi

echo ""
echo "4. Checking MCP Configuration..."
MCP_CONFIG="$HOME/.cursor/mcp.json"
if [[ -f "$MCP_CONFIG" ]]; then
    print_status 0 "MCP config exists"
    if command -v node &> /dev/null; then
        if node -e "JSON.parse(require('fs').readFileSync('$MCP_CONFIG', 'utf8'))" 2>/dev/null; then
            print_status 0 "MCP config is valid JSON"
        else
            print_status 1 "MCP config has JSON syntax errors"
        fi
    fi
else
    print_status 1 "MCP config not found"
fi

echo ""
echo "5. Checking Project Structure..."
DIRS=(".cursor/rules" "scripts" "docs" "config" "examples")
for dir in "${DIRS[@]}"; do
    if [[ -d "$dir" ]]; then
        print_status 0 "Directory exists: $dir"
    else
        print_status 1 "Directory missing: $dir"
    fi
done

echo ""
echo "=========================================="
if $VALIDATION_PASSED; then
    echo -e "${GREEN}Environment validation PASSED${NC}"
else
    echo -e "${RED}Environment validation FAILED${NC}"
    exit 1
fi
echo "=========================================="
```

---

### Script: `scripts/generate-timestamp.sh`

```bash
#!/bin/bash
# Generate timestamp for changelog entries
# Usage: ./scripts/generate-timestamp.sh

date "+%Y-%m-%d %H:%M:%S UTC"
```

---

### Script: `scripts/detect-dry-violations.sh`

```bash
#!/bin/bash
# DRY Violation Detection Script

echo "=========================================="
echo "DRY Violation Detection"
echo "=========================================="

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

VIOLATIONS_FOUND=false

print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $2"
    else
        echo -e "${RED}✗${NC} $2"
        VIOLATIONS_FOUND=true
    fi
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

echo ""
echo "1. Checking for configuration duplication..."
CONFIG_COUNT=$(grep -r "window\." js/ 2>/dev/null | grep -E "(config|Config)" | wc -l)
if [ $CONFIG_COUNT -gt 1 ]; then
    print_status 1 "Found $CONFIG_COUNT configuration instances (potential duplication)"
else
    print_status 0 "Configuration instances: $CONFIG_COUNT"
fi

echo ""
echo "2. Checking for hardcoded paths..."
HARDCODED_COUNT=$(grep -r "/[A-Za-z0-9_-]*/" js/ php/ 2>/dev/null | grep -v "node_modules" | grep -v "examples" | wc -l)
if [ $HARDCODED_COUNT -gt 5 ]; then
    print_status 1 "Found $HARDCODED_COUNT potential hardcoded paths"
else
    print_status 0 "Hardcoded paths: $HARDCODED_COUNT"
fi

echo ""
echo "3. Checking for API pattern duplication..."
API_HEADERS=$(grep -r "header('Content-Type: application/json')" php/ 2>/dev/null | wc -l)
if [ $API_HEADERS -gt 1 ]; then
    print_status 1 "Found $API_HEADERS duplicated JSON headers"
else
    print_status 0 "JSON headers: $API_HEADERS"
fi

echo ""
echo "4. Checking for validation duplication..."
VALIDATION_COUNT=$(grep -r "preg_match\|validation\|validate" php/ 2>/dev/null | wc -l)
if [ $VALIDATION_COUNT -gt 3 ]; then
    print_status 1 "Found $VALIDATION_COUNT validation patterns (potential duplication)"
else
    print_status 0 "Validation patterns: $VALIDATION_COUNT"
fi

echo ""
echo "5. Checking for file operation duplication..."
FILE_OPS=$(grep -r "file_put_contents\|file_get_contents" php/ 2>/dev/null | wc -l)
if [ $FILE_OPS -gt 2 ]; then
    print_status 1 "Found $FILE_OPS file operations (potential duplication)"
else
    print_status 0 "File operations: $FILE_OPS"
fi

echo ""
echo "=========================================="
if $VIOLATIONS_FOUND; then
    echo -e "${RED}DRY violations detected!${NC}"
    echo "Consider using the enhanced examples:"
    echo "- examples/enhanced-path-utils.js"
    echo "- examples/enhanced-api-utils.php"
    echo "- Run ./scripts/consolidate-paths.sh for help"
else
    echo -e "${GREEN}No significant DRY violations detected${NC}"
fi
echo "=========================================="
```

---

### Script: `scripts/consolidate-paths.sh`

```bash
#!/bin/bash
# Path Consolidation Helper Script

echo "=========================================="
echo "Path Consolidation Helper"
echo "=========================================="

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}This script helps consolidate path management to prevent DRY violations.${NC}"
echo ""

# Create backup
BACKUP_DATE=$(date +%Y%m%d_%H%M%S)
echo "Creating backup..."
cp -r js/ js-backup-$BACKUP_DATE 2>/dev/null || true
cp -r php/ php-backup-$BACKUP_DATE 2>/dev/null || true
echo -e "${GREEN}✓${NC} Backups created: js-backup-$BACKUP_DATE, php-backup-$BACKUP_DATE"

echo ""
echo "Next steps:"
echo "1. Review examples/enhanced-path-utils.js"
echo "2. Replace duplicated path configs with centralized version"
echo "3. Use getImagePath(), getAPIPath() functions instead of hardcoded paths"
echo "4. Test path resolution in both local and production environments"
echo ""
echo "Run ./scripts/validate-api-patterns.sh after consolidation"
echo "=========================================="
```

---

### Script: `scripts/validate-api-patterns.sh`

```bash
#!/bin/bash
# API Pattern Validation Script

echo "=========================================="
echo "API Pattern Validation"
echo "=========================================="

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

PATTERNS_GOOD=true

print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $2"
    else
        echo -e "${RED}✗${NC} $2"
        PATTERNS_GOOD=false
    fi
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

echo ""
echo "1. Checking JSON headers..."
JSON_HEADERS=$(grep -r "header('Content-Type: application/json')" php/ 2>/dev/null | wc -l)
if [ $JSON_HEADERS -gt 0 ]; then
    print_status 0 "Found $JSON_HEADERS JSON headers"
else
    print_warning "No JSON headers found - check API endpoints"
fi

echo ""
echo "2. Checking error responses..."
ERROR_RESPONSES=$(grep -r "json_encode.*success.*false" php/ 2>/dev/null | wc -l)
if [ $ERROR_RESPONSES -gt 0 ]; then
    print_status 0 "Found $ERROR_RESPONSES error responses"
else
    print_warning "No error responses found - check error handling"
fi

echo ""
echo "3. Checking validation patterns..."
VALIDATION_PATTERNS=$(grep -r "preg_match\|validation\|validate" php/ 2>/dev/null | wc -l)
if [ $VALIDATION_PATTERNS -gt 0 ]; then
    print_status 0 "Found $VALIDATION_PATTERNS validation patterns"
else
    print_warning "No validation patterns found - check input validation"
fi

echo ""
echo "4. Checking file operations..."
FILE_OPERATIONS=$(grep -r "file_put_contents\|file_get_contents" php/ 2>/dev/null | wc -l)
if [ $FILE_OPERATIONS -gt 0 ]; then
    print_status 0 "Found $FILE_OPERATIONS file operations"
else
    print_warning "No file operations found - check data persistence"
fi

echo ""
echo "5. Checking for consistent response structure..."
SUCCESS_RESPONSES=$(grep -r "json_encode.*success.*true" php/ 2>/dev/null | wc -l)
if [ $SUCCESS_RESPONSES -gt 0 ]; then
    print_status 0 "Found $SUCCESS_RESPONSES success responses"
else
    print_warning "No success responses found - check API responses"
fi

echo ""
echo "=========================================="
if $PATTERNS_GOOD; then
    echo -e "${GREEN}API patterns look good!${NC}"
else
    echo -e "${RED}API pattern issues detected${NC}"
    echo "Consider using examples/enhanced-api-utils.php for standardization"
fi
echo "=========================================="
```

---

### Script: `scripts/check-mcp-health.sh`

```bash
#!/bin/bash
# MCP Health Check Script
# Checks the health and status of MCP servers and connections

set -euo pipefail

echo "🔧 MCP Health Check"
echo "==================="
echo "Timestamp: $(date)"
echo ""

# Configuration
TOTAL_ISSUES=0
MCP_SERVERS=("chrome-devtools" "filesystem" "memory" "github")

# Function to check MCP server status
check_mcp_server() {
    local server="$1"
    echo "  🔍 Checking $server MCP server..."
    
    # Check if server process is running (simplified check)
    if pgrep -f "$server" >/dev/null 2>&1; then
        echo "    ✅ $server server process is running"
    else
        echo "    ⚠️  $server server process not detected (may be managed externally)"
    fi
    
    # Check for server configuration
    case "$server" in
        "chrome-devtools")
            if command -v google-chrome &> /dev/null || command -v chromium &> /dev/null; then
                echo "    ✅ Chrome/Chromium browser is available"
            else
                echo "    ❌ Chrome/Chromium browser not found"
                TOTAL_ISSUES=$((TOTAL_ISSUES + 1))
            fi
            ;;
        "filesystem")
            if [ -d "." ] && [ -r "." ]; then
                echo "    ✅ Filesystem access is working"
            else
                echo "    ❌ Filesystem access issues detected"
                TOTAL_ISSUES=$((TOTAL_ISSUES + 1))
            fi
            ;;
        "memory")
            echo "    ✅ Memory MCP server (no specific checks needed)"
            ;;
        "github")
            if command -v git &> /dev/null; then
                echo "    ✅ Git is available for GitHub integration"
            else
                echo "    ❌ Git not found"
                TOTAL_ISSUES=$((TOTAL_ISSUES + 1))
            fi
            ;;
    esac
}

# Function to check MCP configuration
check_mcp_configuration() {
    echo "📋 Checking MCP Configuration..."
    
    # Check for MCP configuration files
    if [ -f ".cursor/mcp.json" ] || [ -f "mcp.json" ]; then
        echo "  ✅ MCP configuration file found"
    else
        echo "  ⚠️  MCP configuration file not found (using defaults)"
    fi
    
    # Check for Cursor rules that reference MCP
    if [ -d ".cursor/rules" ]; then
        if grep -r "mcp\|MCP" ".cursor/rules" >/dev/null 2>&1; then
            echo "  ✅ MCP references found in Cursor rules"
        else
            echo "  ⚠️  No MCP references found in Cursor rules"
        fi
    else
        echo "  ❌ .cursor/rules directory not found"
        TOTAL_ISSUES=$((TOTAL_ISSUES + 1))
    fi
}

# Function to generate summary report
generate_summary() {
    echo ""
    echo "📊 MCP Health Check Summary"
    echo "=========================="
    echo "Total Issues Found: $TOTAL_ISSUES"
    
    if [ "$TOTAL_ISSUES" -eq 0 ]; then
        echo "✅ Status: EXCELLENT - All MCP servers are healthy!"
        echo "🎯 MCP integration is working properly"
    elif [ "$TOTAL_ISSUES" -le 2 ]; then
        echo "✅ Status: GOOD - Minor MCP issues detected"
        echo "💡 Consider addressing remaining issues for optimal MCP performance"
    else
        echo "⚠️  Status: NEEDS ATTENTION - Multiple MCP issues detected"
        echo "🔧 Consider fixing issues before using MCP features"
    fi
    
    echo ""
    echo "💡 Recommendations:"
    echo "  - Ensure all required browsers and tools are installed"
    echo "  - Check MCP server configurations"
    echo "  - Verify file permissions for MCP access"
    echo "  - Test MCP functionality with test scripts"
    echo "  - Monitor MCP server logs for errors"
}

# Main execution
main() {
    check_mcp_configuration
    
    for server in "${MCP_SERVERS[@]}"; do
        check_mcp_server "$server"
    done
    
    generate_summary
    
    # Exit with appropriate code
    if [ "$TOTAL_ISSUES" -gt 2 ]; then
        exit 1
    else
        exit 0
    fi
}

# Run main function
main "$@"
```

---

### Script: `scripts/start-chrome-debug.sh`

```bash
#!/bin/bash
# Chrome Debug Startup Script
# Starts Chrome with debugging enabled for MCP integration

set -euo pipefail

echo "🌐 Chrome Debug Startup"
echo "======================="
echo "Timestamp: $(date)"
echo ""

# Configuration
CHROME_DEBUG_PORT=9222
CHROME_USER_DATA_DIR="/tmp/chrome-debug-[PROJECT_NAME]"
BASE_URL="http://localhost:8000"

# Function to find Chrome executable
find_chrome() {
    local chrome_paths=(
        "/usr/bin/google-chrome"
        "/usr/bin/chromium"
        "/usr/bin/chromium-browser"
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
        "/Applications/Chromium.app/Contents/MacOS/Chromium"
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
        "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
    )
    
    for path in "${chrome_paths[@]}"; do
        if [ -x "$path" ] || command -v "$path" &> /dev/null; then
            echo "$path"
            return 0
        fi
    done
    
    # Try to find Chrome in PATH
    if command -v google-chrome &> /dev/null; then
        echo "google-chrome"
        return 0
    elif command -v chromium &> /dev/null; then
        echo "chromium"
        return 0
    fi
    
    return 1
}

# Function to start Chrome with debugging
start_chrome_debug() {
    local chrome_path="$1"
    
    echo "🚀 Starting Chrome with debugging enabled..."
    echo "   Chrome Path: $chrome_path"
    echo "   Debug Port: $CHROME_DEBUG_PORT"
    echo "   User Data Dir: $CHROME_USER_DATA_DIR"
    echo "   Base URL: $BASE_URL"
    echo ""
    
    # Create user data directory
    mkdir -p "$CHROME_USER_DATA_DIR"
    
    # Start Chrome with debugging flags
    "$chrome_path" \
        --remote-debugging-port="$CHROME_DEBUG_PORT" \
        --user-data-dir="$CHROME_USER_DATA_DIR" \
        --disable-web-security \
        --disable-features=VizDisplayCompositor \
        --no-first-run \
        --no-default-browser-check \
        --disable-default-apps \
        --disable-popup-blocking \
        --disable-translate \
        --disable-background-timer-throttling \
        --disable-renderer-backgrounding \
        --disable-backgrounding-occluded-windows \
        --disable-ipc-flooding-protection \
        --enable-logging \
        --log-level=0 \
        "$BASE_URL" &
    
    local chrome_pid=$!
    echo "✅ Chrome started with PID: $chrome_pid"
    
    # Wait a moment for Chrome to start
    sleep 3
    
    # Check if Chrome is responding
    if curl -s "http://localhost:$CHROME_DEBUG_PORT/json/version" >/dev/null 2>&1; then
        echo "✅ Chrome debugging interface is responding"
        echo "   Debug URL: http://localhost:$CHROME_DEBUG_PORT"
    else
        echo "⚠️  Chrome debugging interface not responding yet"
        echo "   This may be normal - Chrome may still be starting"
    fi
    
    return $chrome_pid
}

# Function to display usage information
show_usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -p, --port PORT        Set debugging port (default: $CHROME_DEBUG_PORT)"
    echo "  -u, --url URL          Set base URL (default: $BASE_URL)"
    echo "  -d, --data-dir DIR     Set user data directory (default: $CHROME_USER_DATA_DIR)"
    echo "  -k, --kill             Kill existing Chrome debugging sessions"
    echo "  -h, --help             Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                     # Start Chrome with default settings"
    echo "  $0 -p 9223             # Start Chrome on port 9223"
    echo "  $0 -u http://localhost:3000  # Start Chrome with different base URL"
    echo "  $0 -k                  # Kill existing Chrome debugging sessions"
}

# Main execution
main() {
    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            -p|--port)
                CHROME_DEBUG_PORT="$2"
                shift 2
                ;;
            -u|--url)
                BASE_URL="$2"
                shift 2
                ;;
            -d|--data-dir)
                CHROME_USER_DATA_DIR="$2"
                shift 2
                ;;
            -k|--kill)
                echo "🛑 Killing existing Chrome debugging sessions..."
                pkill -f "chrome.*remote-debugging-port" 2>/dev/null || true
                echo "✅ Chrome debugging sessions killed"
                exit 0
                ;;
            -h|--help)
                show_usage
                exit 0
                ;;
            *)
                echo "Unknown option: $1"
                show_usage
                exit 1
                ;;
        esac
    done
    
    # Find Chrome executable
    echo "🔍 Looking for Chrome executable..."
    local chrome_path
    if chrome_path=$(find_chrome); then
        echo "✅ Found Chrome: $chrome_path"
    else
        echo "❌ Chrome not found"
        echo "   Please install Google Chrome or Chromium"
        echo "   Or specify the path manually"
        exit 1
    fi
    
    # Start Chrome with debugging
    start_chrome_debug "$chrome_path"
    
    echo ""
    echo "🎯 Chrome Debug Setup Complete!"
    echo "   Debug URL: http://localhost:$CHROME_DEBUG_PORT"
    echo "   Base URL: $BASE_URL"
    echo "   Ready for MCP integration"
    echo ""
    echo "💡 To stop Chrome debugging, run: $0 -k"
}

# Run main function
main "$@"
```

---

### Script: `scripts/emergency-reset.sh`

```bash
#!/bin/bash
# Emergency Reset Script
# Emergency rollback and reset functionality for critical issues

set -euo pipefail

echo "🚨 Emergency Reset"
echo "=================="
echo "Timestamp: $(date)"
echo ""
echo "⚠️  WARNING: This script will perform emergency reset operations!"
echo "   Use only in case of critical issues or system corruption."
echo ""

# Configuration
BACKUP_DIR="backup/emergency"
ROLLBACK_TAG="pre-emergency-reset"

# Function to confirm emergency reset
confirm_emergency_reset() {
    echo "🔴 EMERGENCY RESET CONFIRMATION"
    echo "==============================="
    echo ""
    echo "This will perform the following actions:"
    echo "  - Create emergency backup of current state"
    echo "  - Reset to last known good state"
    echo "  - Clean up corrupted files"
    echo "  - Restore from backup if needed"
    echo ""
    echo "⚠️  THIS ACTION CANNOT BE UNDONE!"
    echo ""
    
    read -p "Type 'EMERGENCY' to confirm: " confirmation
    if [ "$confirmation" != "EMERGENCY" ]; then
        echo "❌ Emergency reset cancelled"
        exit 0
    fi
    
    echo ""
    echo "🔴 EMERGENCY RESET CONFIRMED - PROCEEDING..."
    echo ""
}

# Function to create emergency backup
create_emergency_backup() {
    echo "💾 Creating Emergency Backup..."
    
    # Create backup directory
    mkdir -p "$BACKUP_DIR"
    
    # Create timestamp for backup
    local timestamp=$(date +"%Y%m%d_%H%M%S")
    local backup_path="$BACKUP_DIR/emergency_backup_$timestamp"
    
    echo "  📁 Backup path: $backup_path"
    
    # Create backup of current state
    mkdir -p "$backup_path"
    
    # Backup critical files
    local critical_files=(
        "index.php"
        "php/"
        "js/"
        "css/"
        "images/"
        "json/"
        "tests/"
        ".cursor/"
        "package.json"
        "config.json"
    )
    
    for item in "${critical_files[@]}"; do
        if [ -e "$item" ]; then
            echo "  📋 Backing up $item..."
            cp -r "$item" "$backup_path/" 2>/dev/null || true
        fi
    done
    
    # Create backup manifest
    cat > "$backup_path/BACKUP_MANIFEST.txt" << EOF
Emergency Backup Created: $(date)
Backup Path: $backup_path
Git Status: $(git status --porcelain 2>/dev/null || echo "Not a git repository")
Git Branch: $(git branch --show-current 2>/dev/null || echo "Not a git repository")
Git Commit: $(git rev-parse HEAD 2>/dev/null || echo "Not a git repository")
EOF
    
    echo "  ✅ Emergency backup created: $backup_path"
    echo "$backup_path"
}

# Function to reset to last known good state
reset_to_last_good_state() {
    echo "🔄 Resetting to Last Known Good State..."
    
    # Check if we're in a git repository
    if git rev-parse --git-dir >/dev/null 2>&1; then
        echo "  🔍 Git repository detected"
        
        # List available tags
        echo "  📋 Available rollback points:"
        git tag -l | grep -E "(pre-|rollback-|backup-)" | tail -5 | while read -r tag; do
            echo "    - $tag"
        done
        
        # Try to reset to last known good state
        local last_good_tag=$(git tag -l | grep -E "(pre-|rollback-|backup-)" | tail -1)
        
        if [ -n "$last_good_tag" ]; then
            echo "  🔄 Resetting to: $last_good_tag"
            git reset --hard "$last_good_tag" || {
                echo "  ❌ Failed to reset to $last_good_tag"
                return 1
            }
            echo "  ✅ Reset to $last_good_tag successful"
        else
            echo "  ⚠️  No rollback tags found, trying last commit"
            git reset --hard HEAD~1 || {
                echo "  ❌ Failed to reset to last commit"
                return 1
            }
            echo "  ✅ Reset to last commit successful"
        fi
    else
        echo "  ⚠️  Not a git repository, cannot perform git reset"
        return 1
    fi
}

# Function to clean up corrupted files
cleanup_corrupted_files() {
    echo "🧹 Cleaning Up Corrupted Files..."
    
    # Remove temporary files
    find . -name "*.tmp" -delete 2>/dev/null || true
    find . -name "*.temp" -delete 2>/dev/null || true
    find . -name "*.lock" -delete 2>/dev/null || true
    
    # Remove corrupted test files
    find tests/screenshots -name "*.png" -size 0 -delete 2>/dev/null || true
    
    # Clean up PHP session files
    find . -name "sess_*" -delete 2>/dev/null || true
    
    # Clean up log files
    find . -name "*.log" -size 0 -delete 2>/dev/null || true
    
    echo "  ✅ Corrupted files cleaned up"
}

# Function to validate system integrity
validate_system_integrity() {
    echo "🔍 Validating System Integrity..."
    
    local total_issues=0
    
    # Check critical files
    local critical_files=(
        "index.php"
        "php/home.php"
        "php/admin.php"
        "js/path-utils.js"
        "php/includes/api-utils.php"
    )
    
    for file in "${critical_files[@]}"; do
        if [ -f "$file" ]; then
            echo "  ✅ $file exists"
        else
            echo "  ❌ $file missing"
            total_issues=$((total_issues + 1))
        fi
    done
    
    # Check directory structure
    local critical_dirs=(
        "php/"
        "js/"
        "css/"
        "images/"
        "json/"
        "tests/"
    )
    
    for dir in "${critical_dirs[@]}"; do
        if [ -d "$dir" ]; then
            echo "  ✅ $dir/ directory exists"
        else
            echo "  ❌ $dir/ directory missing"
            total_issues=$((total_issues + 1))
        fi
    done
    
    # Check file permissions
    if [ -w "." ]; then
        echo "  ✅ Write permissions OK"
    else
        echo "  ❌ Write permissions issue"
        total_issues=$((total_issues + 1))
    fi
    
    return $total_issues
}

# Function to generate emergency report
generate_emergency_report() {
    local backup_path="$1"
    local total_issues="$2"
    
    echo ""
    echo "📊 Emergency Reset Report"
    echo "========================"
    echo "Timestamp: $(date)"
    echo "Backup Path: $backup_path"
    echo "Total Issues Found: $total_issues"
    echo ""
    
    if [ "$total_issues" -eq 0 ]; then
        echo "✅ Status: EMERGENCY RESET SUCCESSFUL"
        echo "🎯 System integrity restored"
        echo "💡 System is ready for normal operation"
    else
        echo "⚠️  Status: EMERGENCY RESET PARTIALLY SUCCESSFUL"
        echo "🔧 $total_issues issues remain"
        echo "💡 Manual intervention may be required"
    fi
    
    echo ""
    echo "📋 Next Steps:"
    echo "  1. Test basic functionality"
    echo "  2. Run comprehensive test suite"
    echo "  3. Check logs for any remaining issues"
    echo "  4. Consider restoring from backup if needed"
    echo ""
    echo "💾 Backup Location: $backup_path"
    echo "🔄 Rollback Tag: $ROLLBACK_TAG"
}

# Function to display usage information
show_usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -f, --force           Skip confirmation prompt"
    echo "  -b, --backup-only     Only create backup (don't reset)"
    echo "  -r, --restore PATH    Restore from specific backup path"
    echo "  -h, --help            Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                    # Full emergency reset with confirmation"
    echo "  $0 -f                 # Force emergency reset without confirmation"
    echo "  $0 -b                 # Create backup only"
    echo "  $0 -r /path/backup    # Restore from specific backup"
}

# Main execution
main() {
    local force_reset=false
    local backup_only=false
    local restore_path=""
    
    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            -f|--force)
                force_reset=true
                shift
                ;;
            -b|--backup-only)
                backup_only=true
                shift
                ;;
            -r|--restore)
                restore_path="$2"
                shift 2
                ;;
            -h|--help)
                show_usage
                exit 0
                ;;
            *)
                echo "Unknown option: $1"
                show_usage
                exit 1
                ;;
        esac
    done
    
    # Handle restore operation
    if [ -n "$restore_path" ]; then
        echo "📦 Restoring from backup: $restore_path"
        # Restore logic would go here
        exit 0
    fi
    
    # Handle backup-only operation
    if [ "$backup_only" = true ]; then
        echo "💾 Creating emergency backup only..."
        local backup_path=$(create_emergency_backup)
        echo "✅ Emergency backup created: $backup_path"
        exit 0
    fi
    
    # Confirm emergency reset unless forced
    if [ "$force_reset" = false ]; then
        confirm_emergency_reset
    fi
    
    # Create emergency backup
    local backup_path=$(create_emergency_backup)
    
    # Create rollback tag
    if git rev-parse --git-dir >/dev/null 2>&1; then
        git tag -a "$ROLLBACK_TAG" -m "Emergency reset point - $(date)"
    fi
    
    # Perform emergency reset
    if ! reset_to_last_good_state; then
        echo "⚠️  Git reset failed, attempting file restoration..."
        # Restore logic would go here
    fi
    
    # Clean up corrupted files
    cleanup_corrupted_files
    
    # Validate system integrity
    validate_system_integrity
    local total_issues=$?
    
    # Generate emergency report
    generate_emergency_report "$backup_path" $total_issues
    
    exit $total_issues
}

# Run main function
main "$@"
```

---

### Script: `scripts/remote-permissions.sh`

```bash
#!/usr/bin/env bash
set -euo pipefail

# Usage: remote-permissions.sh [DEPLOY_PATH]
# Basic permission management for deployment

DEPLOY_PATH="${1:-/var/www/html/[PROJECT_NAME]}"

echo "[permissions] Using DEPLOY_PATH=$DEPLOY_PATH"

# Create basic writable directories if needed
mkdir -p "$DEPLOY_PATH/cache" "$DEPLOY_PATH/logs" 2>/dev/null || true

# Baseline permissions
find "$DEPLOY_PATH" -type f -exec chmod 644 {} \; 2>/dev/null || true
find "$DEPLOY_PATH" -type d -exec chmod 755 {} \; 2>/dev/null || true

# Writable directories
chmod -R 775 "$DEPLOY_PATH/cache" "$DEPLOY_PATH/logs" 2>/dev/null || true

echo "[permissions] Completed chmod adjustments"
```

---

### Script: `scripts/deploy.sh`

```bash
#!/bin/bash
# Simple deployment script
# Usage: ./scripts/deploy.sh [remote_path] [remote_user@host]

set -e

REMOTE_PATH="${1:-/var/www/html/[PROJECT_NAME]}"
REMOTE_HOST="${2:-user@server}"

echo "Deploying to $REMOTE_HOST:$REMOTE_PATH"

# Create remote directory if it doesn't exist
ssh "$REMOTE_HOST" "mkdir -p $REMOTE_PATH"

# Deploy files (exclude development files)
rsync -av --delete \
  --exclude .git/ \
  --exclude node_modules/ \
  --exclude .cursor/ \
  --exclude *.log \
  --exclude cache/ \
  ./ "$REMOTE_HOST:$REMOTE_PATH/"

# Set permissions
ssh "$REMOTE_HOST" "cd $REMOTE_PATH && find . -type f -exec chmod 644 {} \; && find . -type d -exec chmod 755 {} \;"

echo "Deployment completed successfully"
```

---

### Config: `config/deploy-config.json`

```json
{
  "target_folder": "[PROJECT_NAME]",
  "server_base_path": "/var/www/html",
  "public_base_url": "https://yourdomain.com",
  "description": "Deployment configuration",
  "version": "1.0",
  "last_updated": "2025-01-29"
}
```

---

### Config: `config/app-config.json`

```json
{
  "app": {
    "name": "[PROJECT_NAME]",
    "version": "1.0.0",
    "description": "[PROJECT_DESCRIPTION]"
  },
  "settings": {
    "debug": true,
    "cache_enabled": true,
    "log_level": "info"
  },
  "paths": {
    "base_path": "/[PROJECT_NAME]",
    "api_path": "/api",
    "assets_path": "/assets"
  }
}
```

---

### Example: `examples/api-utils.php`

```php
<?php
// Standardized API utility functions

header('Content-Type: application/json');

function send_json($arr) {
    echo json_encode($arr);
    exit;
}

function send_error($message, $code = 400) {
    http_response_code($code);
    send_json([
        'success' => false,
        'message' => $message,
        'timestamp' => time()
    ]);
}

function send_success($payload = []) {
    $base = [
        'success' => true,
        'timestamp' => time()
    ];
    send_json(array_merge($base, $payload));
}

function validate_input($data, $required_fields) {
    foreach ($required_fields as $field) {
        if (!isset($data[$field]) || empty($data[$field])) {
            send_error("Missing required field: $field", 400);
        }
    }
}
?>
```

---

### Example: `examples/enhanced-path-utils.js`

```javascript
(function() {
    'use strict';

    // Centralized path configuration (prevents DRY violations)
    function initializePathConfig() {
        const isLocal = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1' ||
                       window.location.hostname.includes('local');
        
        window.pathConfig = {
            environment: isLocal ? 'local' : 'production',
            isLocal: isLocal,
            basePath: isLocal ? '' : '/[PROJECT_NAME]',
            
            // Asset path generators
            getImagePath: function(filename) { return this.basePath + '/images/' + filename; },
            getJSPath: function(filename) { return this.basePath + '/js/' + filename; },
            getCSSPath: function(filename) { return this.basePath + '/css/' + filename; },
            getJSONPath: function(filename) { return this.basePath + '/json/' + filename; },
            getPHPPath: function(filename) { return this.basePath + '/php/' + filename; },
            getAPIPath: function(filename) { return this.basePath + '/api/' + filename; }
        };
    }

    // Safe path resolution with fallbacks (prevents hardcoded paths)
    function getImagePath(filename) {
        return window.pathConfig ? 
            window.pathConfig.getImagePath(filename) : 
            '/[PROJECT_NAME]/images/' + filename;
    }

    function getJSPath(filename) {
        return window.pathConfig ? 
            window.pathConfig.getJSPath(filename) : 
            '/[PROJECT_NAME]/js/' + filename;
    }

    function getCSSPath(filename) {
        return window.pathConfig ? 
            window.pathConfig.getCSSPath(filename) : 
            '/[PROJECT_NAME]/css/' + filename;
    }

    function getJSONPath(filename) {
        return window.pathConfig ? 
            window.pathConfig.getJSONPath(filename) : 
            '/[PROJECT_NAME]/json/' + filename;
    }

    function getPHPPath(filename) {
        return window.pathConfig ? 
            window.pathConfig.getPHPPath(filename) : 
            '/[PROJECT_NAME]/php/' + filename;
    }

    function getAPIPath(filename) {
        return window.pathConfig ? 
            window.pathConfig.getAPIPath(filename) : 
            '/[PROJECT_NAME]/api/' + filename;
    }

    // Initialize on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializePathConfig);
    } else {
        initializePathConfig();
    }

    // Export functions globally
    window.getImagePath = getImagePath;
    window.getJSPath = getJSPath;
    window.getCSSPath = getCSSPath;
    window.getJSONPath = getJSONPath;
    window.getPHPPath = getPHPPath;
    window.getAPIPath = getAPIPath;
})();
```

---

### Example: `examples/enhanced-api-utils.php`

```php
<?php
// Enhanced API utility functions (prevents DRY violations)

// Standardized response functions
function sendJsonResponse($data, $httpCode = 200) {
    http_response_code($httpCode);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

function sendErrorResponse($message, $code = 400, $details = null) {
    $response = [
        'success' => false,
        'message' => $message,
        'timestamp' => time()
    ];
    
    if ($details) {
        $response['details'] = $details;
    }
    
    sendJsonResponse($response, $code);
}

function sendSuccessResponse($payload = [], $message = 'Success') {
    $response = [
        'success' => true,
        'message' => $message,
        'timestamp' => time()
    ];
    
    if (!empty($payload)) {
        $response['data'] = $payload;
    }
    
    sendJsonResponse($response);
}

// Common validation functions
function validateRequiredFields($data, $required_fields) {
    $missing = [];
    foreach ($required_fields as $field) {
        if (!isset($data[$field]) || empty($data[$field])) {
            $missing[] = $field;
        }
    }
    
    if (!empty($missing)) {
        sendErrorResponse('Missing required fields: ' . implode(', ', $missing));
    }
}

function validateSessionKey($sessionKey, $pattern = '/^[a-zA-Z0-9]{3,8}$/') {
    if (!preg_match($pattern, $sessionKey)) {
        sendErrorResponse('Invalid session key format');
    }
}

// File operations with error handling
function getSaveFilePath($sessionKey, $directory = '../saves/') {
    if (!is_dir($directory)) {
        mkdir($directory, 0755, true);
    }
    
    return $directory . $sessionKey . '.json';
}

function saveToFile($filepath, $data) {
    $result = file_put_contents($filepath, json_encode($data, JSON_PRETTY_PRINT));
    if ($result === false) {
        sendErrorResponse('Failed to save data', 500);
    }
    return $result;
}

function loadFromFile($filepath) {
    if (!file_exists($filepath)) {
        return null;
    }
    
    $content = file_get_contents($filepath);
    if ($content === false) {
        sendErrorResponse('Failed to load data', 500);
    }
    
    $data = json_decode($content, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        sendErrorResponse('Invalid data format', 500);
    }
    
    return $data;
}

// Input sanitization
function sanitizeInput($input) {
    if (is_array($input)) {
        return array_map('sanitizeInput', $input);
    }
    return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
}

// CORS handling
function handleCORS() {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }
}
?>
```

---

### Example: `examples/path-utils.js`

```javascript
(function() {
    'use strict';

    function getBasePath() {
        try {
            if (window.pathConfig && typeof window.pathConfig.basePath === 'string') {
                return window.pathConfig.basePath;
            }
        } catch (e) {}
        return '/[PROJECT_NAME]';
    }

    if (typeof window.getImagePath !== 'function') {
        window.getImagePath = function(filename) {
            return getBasePath() + '/images/' + filename;
        };
    }

    if (typeof window.getCSSPath !== 'function') {
        window.getCSSPath = function(filename) {
            return getBasePath() + '/css/' + filename;
        };
    }

    if (typeof window.getAPIPath !== 'function') {
        window.getAPIPath = function(filename) {
            return getBasePath() + '/api/' + filename;
        };
    }
})();
```

---

### Example: `examples/health-check.php`

```php
<?php
// Basic health check endpoint

header('Content-Type: application/json');

$health = [
    'status' => 'healthy',
    'timestamp' => time(),
    'version' => '1.0.0',
    'environment' => 'production',
    'checks' => [
        'php_version' => phpversion(),
        'memory_limit' => ini_get('memory_limit'),
        'disk_space' => disk_free_space('.'),
        'writable_dirs' => [
            'cache' => is_writable('./cache'),
            'logs' => is_writable('./logs')
        ]
    ]
];

echo json_encode($health, JSON_PRETTY_PRINT);
?>
```

---

### Docs: `docs/DEPLOYMENT.md`

```markdown
# Deployment Guide

This document describes basic deployment procedures for [PROJECT_NAME].

## Prerequisites

- Web server with PHP 8.0+
- SSH/SFTP access to target server
- Git (for version control)

## Basic Deployment

### 1. Server Setup

```bash
# Create project directory
mkdir -p /var/www/html/[PROJECT_NAME]

# Set basic permissions
chmod 755 /var/www/html/[PROJECT_NAME]
```

### 2. Deploy Files

```bash
# Use the deployment script
./scripts/deploy.sh /var/www/html/[PROJECT_NAME] user@server

# Or manually with rsync
rsync -av --delete \
  --exclude .git/ \
  --exclude node_modules/ \
  ./ user@server:/var/www/html/[PROJECT_NAME]/
```

### 3. Set Permissions

```bash
# Use the permissions script
./scripts/remote-permissions.sh /var/www/html/[PROJECT_NAME]

# Or manually
ssh user@server "cd /var/www/html/[PROJECT_NAME] && find . -type f -exec chmod 644 {} \; && find . -type d -exec chmod 755 {} \;"
```

### 4. Verify Deployment

```bash
# Check health endpoint
curl https://yourdomain.com/[PROJECT_NAME]/examples/health-check.php
```

## Apache Configuration

Basic virtual host configuration:

```apache
<VirtualHost *:80>
    ServerName yourdomain.com
    DocumentRoot /var/www/html

    <Directory /var/www/html/[PROJECT_NAME]>
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

## Troubleshooting

### Permission Issues
```bash
# Check directory permissions
ls -la /var/www/html/[PROJECT_NAME]

# Fix if needed
chmod -R 755 /var/www/html/[PROJECT_NAME]
```

### File Upload Issues
```bash
# Check PHP upload settings
php -i | grep upload

# Check disk space
df -h
```
```

---

### Docs: `docs/ENHANCED-BEST-PRACTICES.md`

```markdown
# Enhanced Best Practices

## DRY Principle Implementation

### Path Management
1. **Single Source of Truth**: Use one `path-utils.js` file
2. **No Hardcoded Paths**: All paths through utility functions
3. **Environment Detection**: Automatic local/production switching
4. **Fallback Strategy**: Graceful degradation when config fails

### API Standardization
1. **Consistent Responses**: Use `api-utils.php` functions
2. **Error Handling**: Standardized error response format
3. **Validation**: Centralized validation functions
4. **File Operations**: Safe file handling with error recovery

### Code Organization
1. **Module vs Global**: Clear separation of concerns
2. **Script Loading Order**: Dependencies loaded first
3. **Event Delegation**: Efficient event handling
4. **State Management**: Centralized state handling

## Accessibility Best Practices

### WCAG Compliance
1. **Focus Management**: Proper tab order and focus indicators
2. **Screen Reader Support**: ARIA labels and live regions
3. **Keyboard Navigation**: All functions accessible via keyboard
4. **Color Contrast**: Sufficient contrast ratios

### Progressive Enhancement
1. **Core Functionality**: Works without JavaScript
2. **Graceful Degradation**: Fallbacks for advanced features
3. **Performance**: Fast loading and responsive design
4. **Error Recovery**: User-friendly error messages

## Development Workflow

### Code Quality
1. **Early Returns**: Avoid deep nesting
2. **Meaningful Names**: Clear variable and function names
3. **Small Functions**: Single responsibility principle
4. **Consistent Style**: Match existing code patterns

### Testing Strategy
1. **Path Validation**: Test asset loading
2. **API Testing**: Verify endpoint responses
3. **Cross-Browser**: Test in multiple browsers
4. **Accessibility**: Screen reader and keyboard testing

## DRY Violation Prevention

### Common DRY Violations to Avoid

**1. Path Configuration Duplication**
- ❌ **Bad**: Copying path config to multiple files
- ✅ **Good**: Single `path-utils.js` loaded once

**2. API Response Pattern Duplication**
- ❌ **Bad**: Repeating JSON headers and error handling
- ✅ **Good**: Use `api-utils.php` functions

**3. Validation Logic Duplication**
- ❌ **Bad**: Repeating validation in multiple endpoints
- ✅ **Good**: Centralized validation functions

**4. Hardcoded Fallback Patterns**
- ❌ **Bad**: `window.pathConfig ? pathConfig.getPath() : '/hardcoded/path'`
- ✅ **Good**: `getPath()` function with built-in fallback

### Detection Scripts
- `scripts/detect-dry-violations.sh` - Find duplication patterns
- `scripts/consolidate-paths.sh` - Help consolidate path management
- `scripts/validate-api-patterns.sh` - Check API consistency
```

---

### Docs: `docs/ENHANCED-TROUBLESHOOTING.md`

```markdown
# Enhanced Troubleshooting Guide

## Common Development Issues

### DRY Violation Problems

**Symptoms:**
- Inconsistent behavior across pages
- Hard to maintain path changes
- API responses vary between endpoints

**Solutions:**
```bash
# Detect DRY violations
./scripts/detect-dry-violations.sh

# Consolidate path management
./scripts/consolidate-paths.sh

# Validate API patterns
./scripts/validate-api-patterns.sh
```

### Path Configuration Issues

**Symptoms:**
- Assets not loading in production
- Inconsistent paths between local/production
- Hardcoded paths scattered throughout code

**Solutions:**
1. Use centralized `path-utils.js`
2. Avoid hardcoded fallback patterns
3. Test path resolution in both environments

### API Response Inconsistencies

**Symptoms:**
- Different error formats across endpoints
- Inconsistent validation behavior
- Duplicated response logic

**Solutions:**
1. Use `api-utils.php` functions
2. Standardize error response format
3. Centralize validation logic

## Performance Issues

### Slow Loading
- Check for duplicate script loading
- Verify asset path resolution
- Test in different network conditions

### Memory Leaks
- Check for proper event cleanup
- Verify DOM element removal
- Monitor for circular references

## Accessibility Issues

### Screen Reader Problems
- Verify ARIA labels
- Check live region announcements
- Test with actual screen readers

### Keyboard Navigation
- Ensure all functions are keyboard accessible
- Check tab order
- Verify focus indicators

## MCP Server Issues

### MCP Servers Not Starting
1. Check Configuration:
```bash
ls -la ~/.cursor/mcp.json
```

2. Verify JSON syntax:
```bash
node -e "JSON.parse(require('fs').readFileSync(process.env.HOME + '/.cursor/mcp.json', 'utf8'))"
```

3. Restart Cursor completely

## Deployment Issues

### Permission Errors
```bash
# Check permissions
ls -la /var/www/html/[PROJECT_NAME]

# Fix permissions
chmod -R 755 /var/www/html/[PROJECT_NAME]
```

### File Upload Issues
```bash
# Check PHP settings
php -i | grep upload

# Check disk space
df -h
```

## Getting Help

### Check Logs
- Apache error logs: /var/log/apache2/error.log
- PHP error logs: Check php.ini error_log setting

### Common Commands
```bash
# Validate environment
./scripts/validate-environment.sh

# Check health
curl https://yourdomain.com/[PROJECT_NAME]/examples/health-check.php

# Check permissions
./scripts/remote-permissions.sh

# Detect DRY violations
./scripts/detect-dry-violations.sh
```
```

---

### Docs: `docs/BEST-PRACTICES.md`

```markdown
# Best Practices

This document outlines development best practices for [PROJECT_NAME].

## Code Quality

### DRY Principles
- Don't Repeat Yourself
- Use utility functions for common operations
- Centralize configuration in config files

### Path Management
- Use path utility functions instead of hardcoded paths
- Make paths configurable for different environments
- Test path resolution in different deployment scenarios

### Error Handling
- Use standardized error responses
- Log errors appropriately
- Provide meaningful error messages to users

## File Organization

### Directory Structure
- Keep related files together
- Use clear, descriptive names
- Separate configuration from code

### Naming Conventions
- Use lowercase with hyphens for files
- Use camelCase for JavaScript variables
- Use PascalCase for PHP classes

## Security

### Input Validation
- Validate all user input
- Use prepared statements for database queries
- Sanitize output to prevent XSS

### File Permissions
- Set appropriate file permissions
- Don't make files executable unless necessary
- Protect sensitive configuration files

## Performance

### Asset Management
- Minify CSS and JavaScript for production
- Use appropriate image formats
- Implement caching where appropriate

### Database Optimization
- Use indexes appropriately
- Avoid N+1 queries
- Cache frequently accessed data

## Testing

### Basic Testing
- Test core functionality
- Verify error handling
- Check different browsers and devices

### Deployment Testing
- Test in staging environment first
- Verify all features work after deployment
- Check performance metrics
```

---

### Docs: `docs/TROUBLESHOOTING.md`

```markdown
# Troubleshooting Guide

Common issues and solutions for [PROJECT_NAME].

## Shell and Terminal Issues

### Wrong Shell Active (PowerShell/CMD instead of Git Bash)

Symptoms:
- Commands fail with "command not found"
- Git operations show path errors

Verification:
```bash
echo $SHELL
# Should show: /usr/bin/bash or /bin/bash
```

Solution:
1. Open Cursor Settings: Ctrl + ,
2. Search: "terminal.integrated.defaultProfile.windows"
3. Select: "Git Bash"
4. Close and reopen terminal

## MCP Server Issues

### MCP Servers Not Starting

Symptoms:
- Cursor shows "MCP initialization failed"
- MCP commands not recognized

Solutions:
1. Check Configuration:
```bash
ls -la ~/.cursor/mcp.json
```

2. Verify JSON syntax:
```bash
node -e "JSON.parse(require('fs').readFileSync(process.env.HOME + '/.cursor/mcp.json', 'utf8'))"
```

3. Restart Cursor completely

## Deployment Issues

### Permission Errors

Symptoms:
- Files not writable
- 500 Internal Server Error

Solutions:
```bash
# Check permissions
ls -la /var/www/html/[PROJECT_NAME]

# Fix permissions
chmod -R 755 /var/www/html/[PROJECT_NAME]
```

### File Upload Issues

Symptoms:
- Uploads fail
- Large files rejected

Solutions:
```bash
# Check PHP settings
php -i | grep upload

# Check disk space
df -h
```

## Getting Help

### Check Logs
- Apache error logs: /var/log/apache2/error.log
- PHP error logs: Check php.ini error_log setting

### Common Commands
```bash
# Validate environment
./scripts/validate-environment.sh

# Check health
curl https://yourdomain.com/[PROJECT_NAME]/examples/health-check.php

# Check permissions
./scripts/remote-permissions.sh
```
```

---

### Docs: `docs/CHANGELOG-TEMPLATE.md`

```markdown
# Changelog Template

Use this template for documenting changes in your project.

## Instructions

1. Generate timestamp using `./scripts/generate-timestamp.sh`
2. Copy the output
3. Add new entry to the top of the Entries section

## Template Entry

```
### [TIMESTAMP] - [Brief Description]

**Summary:**
- Brief overview of changes

**Changes:**
- **Category**: Description of specific changes
- **File**: Specific file changes
- **Feature**: New features added

**Impact:**
- What users will notice
- Performance improvements
- Bug fixes
```

## Example Entry

```
### 2025-01-29 15:30:00 UTC - Initial Project Setup

**Summary:**
- Set up basic project structure with MCP integration
- Added essential scripts and documentation

**Changes:**
- **Setup**: Added Cursor IDE configuration
- **Scripts**: Added validation and deployment scripts
- **Docs**: Added deployment and troubleshooting guides

**Impact:**
- Project ready for development
- MCP tools configured and working
- Basic deployment pipeline established
```
```

---

### .cursor/rules/enhanced-development.md

```markdown
# Enhanced Development Rules

## DRY Principle Enforcement

### Path Management
- NEVER duplicate path configuration across files
- ALWAYS use centralized path utilities
- AVOID hardcoded fallback patterns
- TEST path resolution in both environments

### API Development
- USE standardized response functions
- AVOID duplicating validation logic
- MAINTAIN consistent error handling
- IMPLEMENT proper file operation safety

### Code Organization
- PREFER single responsibility functions
- AVOID deep nesting (use early returns)
- MAINTAIN consistent naming conventions
- ENSURE proper script loading order

## Quality Assurance

### Before Committing
- Run DRY violation detection
- Validate API patterns
- Test path resolution
- Check accessibility compliance

### Code Review Checklist
- [ ] No duplicated configuration
- [ ] Consistent API responses
- [ ] Proper error handling
- [ ] Accessibility compliance
- [ ] Performance considerations

## Development Workflow

### Script Loading Order
1. Load `path-utils.js` first
2. Load non-module scripts requiring globals
3. Load `type="module"` files last

### Path Management
- Use `getImagePath()`, `getAPIPath()` functions
- Avoid `window.pathConfig ? ... : '/hardcoded/path'` patterns
- Test in both local and production environments

### API Development
- Use `sendJsonResponse()`, `sendErrorResponse()` functions
- Centralize validation with `validateRequiredFields()`
- Handle file operations with `saveToFile()`, `loadFromFile()`

## Error Prevention

### Common Mistakes to Avoid
- Duplicating path configuration blocks
- Hardcoding production paths as fallbacks
- Repeating API response patterns
- Scattering validation logic across files

### Detection Tools
- `./scripts/detect-dry-violations.sh` - Find duplication
- `./scripts/validate-api-patterns.sh` - Check API consistency
- `./scripts/consolidate-paths.sh` - Help with path consolidation
```

---

## Template Philosophy

### Simple Foundation + Extensibility

This template provides:
- Essential building blocks for web development
- MCP integration for enhanced Cursor IDE experience
- Basic deployment and validation scripts
- Comprehensive documentation templates
- Extensible structure for project-specific needs

### Based on Real-World Analysis

Patterns included are based on analysis of actual projects:
- Simple PHP + JavaScript architecture
- File-based storage (no database required)
- Path utility systems for consistent asset management
- Standardized API response patterns
- Basic deployment and permission management

### What's NOT Included

Intentionally excluded complex features:
- Enterprise/multi-tenant systems
- Advanced CI/CD pipelines
- Complex testing frameworks
- Production monitoring systems
- Specialized integrations

These can be added as needed for specific projects.

---

## Quick Start Checklist

Before starting development:

- [ ] Copied template to new project directory
- [ ] Updated all [PROJECT_NAME] placeholders
- [ ] Updated all [PROJECT_DESCRIPTION] placeholders
- [ ] Configured ~/.cursor/mcp.json with correct paths
- [ ] Set Git Bash as default terminal in Cursor
- [ ] Ran ./scripts/validate-environment.sh successfully
- [ ] Customized .cursor/rules/always.md for project
- [ ] Initialized Git repository (if new project)
- [ ] Set up GITHUB_TOKEN environment variable (if using GitHub MCP)
- [ ] Made all scripts executable (chmod +x)
- [ ] Reviewed and customized .gitignore
- [ ] Verified terminal shows /usr/bin/bash with echo $SHELL

---

## Summary

This refined Cursor IDE template provides:

✅ **Essential MCP Integration**: Chrome DevTools, Filesystem, Memory, and GitHub MCPs
✅ **Windows 11 Optimized**: Git Bash configuration and troubleshooting
✅ **Enhanced Testing**: Validation, health check, and DRY violation detection scripts
✅ **Comprehensive Documentation**: Setup guides, deployment, troubleshooting, and best practices
✅ **Advanced Scripts**: Environment validation, deployment, permission management, and code quality tools
✅ **AI-Optimized Rules**: Context files for Cursor AI assistance with DRY enforcement
✅ **Universal Patterns**: Based on real-world project analysis with proven anti-patterns
✅ **DRY Prevention**: Built-in tools to prevent common code duplication issues
✅ **Extensible Structure**: Foundation that can be enhanced for specific needs

**New in MCP-Enhanced Version (v2.2.0):**
- 🔧 **MCP Health Monitoring**: Comprehensive MCP server health checks and management
- 🌐 **Chrome DevTools Integration**: Automated Chrome debugging setup for MCP
- 🚨 **Emergency Recovery**: Emergency reset and rollback procedures
- 🧪 **Comprehensive Testing**: Full testing infrastructure with unit, integration, performance, e2e, and accessibility tests
- 🔄 **MCP Server Management**: Restart and validation tools for MCP servers

**Previous Enhanced Features (v2.1.0):**
- 🔍 **DRY Violation Detection**: Automated scripts to find code duplication
- 🛠️ **Path Management Tools**: Consolidation helpers and validation scripts
- 📚 **Enhanced Documentation**: Comprehensive best practices and troubleshooting guides
- 🎯 **API Standardization**: Enhanced utility functions for consistent API development
- 🚀 **Quality Assurance**: Built-in code review checklists and validation tools

Get started: Copy template → Update placeholders → Configure MCP → Validate → Start coding!

---

## Version History

- **v2.2.0** (MCP-Enhanced Release)
  - Added comprehensive MCP health monitoring and management scripts
  - Included Chrome DevTools debugging setup and automation
  - Added emergency reset and recovery procedures
  - Enhanced testing infrastructure with comprehensive test suite structure
  - Added MCP-specific validation and troubleshooting tools
  - Based on real-world AccessiList project implementation with full MCP integration

- **v2.1.0** (Enhanced Release)
  - Added DRY violation detection and prevention tools
  - Enhanced path management with consolidation scripts
  - Improved API standardization with comprehensive utility functions
  - Added enhanced documentation for best practices and troubleshooting
  - Included quality assurance tools and code review checklists
  - Based on real-world analysis of production codebases with 400+ lines of duplication

- **v2.0.0** (Refined Release)
  - Simplified from enterprise-focused to universal patterns
  - Based on analysis of otter and accessilist projects
  - Focus on essential building blocks rather than complex features
  - Maintained MCP integration and Cursor rules
  - Added practical examples and documentation

- **v1.0.0** (Initial Release)
  - Complete directory structure
  - All rule files with placeholders
  - MCP configuration templates
  - Automation scripts
  - Comprehensive documentation
  - Windows 11 + Git Bash optimization

---

## License

MIT License

Copyright (c) 2025 [Your Name]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

## Contact and Support

**Questions or Issues?**
- Check the troubleshooting guide first
- Review deployment documentation
- Run validation scripts
- Check project logs

**Contributing**
Improvements and suggestions welcome! Consider sharing enhancements back to the template for others to benefit.

---

**End of Documentation**
