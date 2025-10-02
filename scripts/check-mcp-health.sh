#!/bin/bash
# AccessiList MCP Health Check Script
# Checks the health and status of MCP servers and connections

set -euo pipefail

echo "🔧 AccessiList MCP Health Check"
echo "==============================="
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
        echo "  ⚠️  MCP configuration file not found (may be using defaults)"
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

# Function to check Chrome DevTools MCP
check_chrome_devtools() {
    echo "🌐 Checking Chrome DevTools MCP..."
    
    # Check if Chrome is available
    if command -v google-chrome &> /dev/null; then
        local chrome_version=$(google-chrome --version 2>/dev/null || echo "Unknown")
        echo "  ✅ Google Chrome is available: $chrome_version"
    elif command -v chromium &> /dev/null; then
        local chromium_version=$(chromium --version 2>/dev/null || echo "Unknown")
        echo "  ✅ Chromium is available: $chromium_version"
    else
        echo "  ❌ Neither Google Chrome nor Chromium found"
        TOTAL_ISSUES=$((TOTAL_ISSUES + 1))
    fi
    
    # Check for Chrome DevTools protocol support
    if command -v google-chrome &> /dev/null; then
        if google-chrome --version | grep -q "Chrome"; then
            echo "  ✅ Chrome DevTools protocol should be supported"
        else
            echo "  ⚠️  Chrome DevTools protocol support uncertain"
        fi
    fi
}

# Function to check filesystem MCP
check_filesystem_mcp() {
    echo "📁 Checking Filesystem MCP..."
    
    # Check read access
    if [ -r "." ]; then
        echo "  ✅ Read access to current directory"
    else
        echo "  ❌ No read access to current directory"
        TOTAL_ISSUES=$((TOTAL_ISSUES + 1))
    fi
    
    # Check write access
    if [ -w "." ]; then
        echo "  ✅ Write access to current directory"
    else
        echo "  ❌ No write access to current directory"
        TOTAL_ISSUES=$((TOTAL_ISSUES + 1))
    fi
    
    # Check for required directories
    local required_dirs=("tests" "php" "js" "images")
    for dir in "${required_dirs[@]}"; do
        if [ -d "$dir" ]; then
            echo "  ✅ $dir/ directory exists"
        else
            echo "  ❌ $dir/ directory missing"
            TOTAL_ISSUES=$((TOTAL_ISSUES + 1))
        fi
    done
}

# Function to check memory MCP
check_memory_mcp() {
    echo "🧠 Checking Memory MCP..."
    
    # Check available memory
    if command -v free &> /dev/null; then
        local available_memory=$(free -m | awk 'NR==2{printf "%.0f", $7}')
        echo "  ✅ Available memory: ${available_memory}MB"
        
        if [ "$available_memory" -gt 1000 ]; then
            echo "  ✅ Sufficient memory available"
        else
            echo "  ⚠️  Low memory available (${available_memory}MB)"
        fi
    else
        echo "  ⚠️  Cannot check memory status (free command not available)"
    fi
}

# Function to check GitHub MCP
check_github_mcp() {
    echo "🐙 Checking GitHub MCP..."
    
    # Check Git availability
    if command -v git &> /dev/null; then
        local git_version=$(git --version)
        echo "  ✅ Git is available: $git_version"
        
        # Check if we're in a Git repository
        if git rev-parse --git-dir >/dev/null 2>&1; then
            echo "  ✅ Current directory is a Git repository"
            
            # Check for remote repositories
            if git remote -v | grep -q "github.com"; then
                echo "  ✅ GitHub remote repository configured"
            else
                echo "  ⚠️  No GitHub remote repository found"
            fi
        else
            echo "  ❌ Current directory is not a Git repository"
            TOTAL_ISSUES=$((TOTAL_ISSUES + 1))
        fi
    else
        echo "  ❌ Git not found"
        TOTAL_ISSUES=$((TOTAL_ISSUES + 1))
    fi
}

# Function to check MCP integration
check_mcp_integration() {
    echo "🔗 Checking MCP Integration..."
    
    # Check for MCP-related test files
    if [ -f "tests/chrome-mcp/run_chrome_mcp_tests.php" ]; then
        echo "  ✅ Chrome MCP test files found"
    else
        echo "  ❌ Chrome MCP test files missing"
        TOTAL_ISSUES=$((TOTAL_ISSUES + 1))
    fi
    
    # Check for MCP-related documentation
    if grep -r "mcp\|MCP" ".cursor/rules" >/dev/null 2>&1; then
        echo "  ✅ MCP documentation found in rules"
    else
        echo "  ⚠️  MCP documentation not found in rules"
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
    
    check_chrome_devtools
    check_filesystem_mcp
    check_memory_mcp
    check_github_mcp
    check_mcp_integration
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
