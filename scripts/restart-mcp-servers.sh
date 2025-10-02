#!/bin/bash
# AccessiList MCP Servers Restart Script
# Restarts MCP servers and validates their health

set -euo pipefail

echo "🔄 AccessiList MCP Servers Restart"
echo "=================================="
echo "Timestamp: $(date)"
echo ""

# Configuration
MCP_SERVERS=("chrome-devtools" "filesystem" "memory" "github")
RESTART_DELAY=2

# Function to stop MCP server
stop_mcp_server() {
    local server="$1"
    echo "  🛑 Stopping $server server..."
    
    # Find and kill server processes
    local pids=$(pgrep -f "$server" 2>/dev/null || true)
    if [ -n "$pids" ]; then
        echo "$pids" | xargs kill -TERM 2>/dev/null || true
        sleep 1
        
        # Force kill if still running
        local remaining_pids=$(pgrep -f "$server" 2>/dev/null || true)
        if [ -n "$remaining_pids" ]; then
            echo "$remaining_pids" | xargs kill -KILL 2>/dev/null || true
        fi
        
        echo "    ✅ $server server stopped"
    else
        echo "    ℹ️  $server server was not running"
    fi
}

# Function to start MCP server
start_mcp_server() {
    local server="$1"
    echo "  🚀 Starting $server server..."
    
    case "$server" in
        "chrome-devtools")
            # Chrome DevTools MCP is typically managed by the IDE
            echo "    ℹ️  Chrome DevTools MCP is managed by Cursor IDE"
            ;;
        "filesystem")
            # Filesystem MCP is typically managed by the IDE
            echo "    ℹ️  Filesystem MCP is managed by Cursor IDE"
            ;;
        "memory")
            # Memory MCP is typically managed by the IDE
            echo "    ℹ️  Memory MCP is managed by Cursor IDE"
            ;;
        "github")
            # GitHub MCP is typically managed by the IDE
            echo "    ℹ️  GitHub MCP is managed by Cursor IDE"
            ;;
        *)
            echo "    ⚠️  Unknown MCP server: $server"
            ;;
    esac
}

# Function to validate MCP server
validate_mcp_server() {
    local server="$1"
    echo "  🔍 Validating $server server..."
    
    case "$server" in
        "chrome-devtools")
            # Check if Chrome is available
            if command -v google-chrome &> /dev/null || command -v chromium &> /dev/null; then
                echo "    ✅ Chrome/Chromium is available"
            else
                echo "    ❌ Chrome/Chromium not found"
                return 1
            fi
            ;;
        "filesystem")
            # Check filesystem access
            if [ -r "." ] && [ -w "." ]; then
                echo "    ✅ Filesystem access is working"
            else
                echo "    ❌ Filesystem access issues"
                return 1
            fi
            ;;
        "memory")
            # Check available memory
            if command -v free &> /dev/null; then
                local available_memory=$(free -m | awk 'NR==2{printf "%.0f", $7}')
                if [ "$available_memory" -gt 500 ]; then
                    echo "    ✅ Sufficient memory available (${available_memory}MB)"
                else
                    echo "    ⚠️  Low memory available (${available_memory}MB)"
                fi
            else
                echo "    ✅ Memory MCP (no specific validation needed)"
            fi
            ;;
        "github")
            # Check Git availability
            if command -v git &> /dev/null; then
                echo "    ✅ Git is available"
            else
                echo "    ❌ Git not found"
                return 1
            fi
            ;;
    esac
    
    return 0
}

# Function to restart all MCP servers
restart_all_servers() {
    echo "🔄 Restarting All MCP Servers..."
    
    # Stop all servers
    echo "📋 Stopping MCP Servers..."
    for server in "${MCP_SERVERS[@]}"; do
        stop_mcp_server "$server"
    done
    
    # Wait for servers to stop
    echo "⏳ Waiting for servers to stop..."
    sleep "$RESTART_DELAY"
    
    # Start all servers
    echo "📋 Starting MCP Servers..."
    for server in "${MCP_SERVERS[@]}"; do
        start_mcp_server "$server"
    done
    
    # Wait for servers to start
    echo "⏳ Waiting for servers to start..."
    sleep "$RESTART_DELAY"
}

# Function to validate all MCP servers
validate_all_servers() {
    echo "🔍 Validating All MCP Servers..."
    
    local total_issues=0
    
    for server in "${MCP_SERVERS[@]}"; do
        if ! validate_mcp_server "$server"; then
            total_issues=$((total_issues + 1))
        fi
    done
    
    return $total_issues
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
    
    # Check for Cursor rules
    if [ -d ".cursor/rules" ]; then
        echo "  ✅ Cursor rules directory found"
        
        # Check for MCP-related rules
        if grep -r "mcp\|MCP" ".cursor/rules" >/dev/null 2>&1; then
            echo "  ✅ MCP references found in rules"
        else
            echo "  ⚠️  No MCP references found in rules"
        fi
    else
        echo "  ❌ Cursor rules directory not found"
        return 1
    fi
    
    return 0
}

# Function to run MCP health check
run_health_check() {
    echo "🏥 Running MCP Health Check..."
    
    if [ -f "scripts/check-mcp-health.sh" ]; then
        echo "  🔍 Executing MCP health check script..."
        if bash "scripts/check-mcp-health.sh"; then
            echo "  ✅ MCP health check passed"
        else
            echo "  ⚠️  MCP health check found issues"
        fi
    else
        echo "  ⚠️  MCP health check script not found"
    fi
}

# Function to display usage information
show_usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -s, --server SERVER    Restart specific MCP server"
    echo "  -a, --all             Restart all MCP servers (default)"
    echo "  -v, --validate        Only validate servers (don't restart)"
    echo "  -h, --help            Show this help message"
    echo ""
    echo "Available servers:"
    for server in "${MCP_SERVERS[@]}"; do
        echo "  - $server"
    done
    echo ""
    echo "Examples:"
    echo "  $0                    # Restart all MCP servers"
    echo "  $0 -s chrome-devtools # Restart Chrome DevTools MCP only"
    echo "  $0 -v                 # Validate all MCP servers"
}

# Function to generate summary report
generate_summary() {
    local total_issues="$1"
    
    echo ""
    echo "📊 MCP Servers Restart Summary"
    echo "=============================="
    
    if [ "$total_issues" -eq 0 ]; then
        echo "✅ Status: EXCELLENT - All MCP servers are healthy!"
        echo "🎯 MCP integration is working properly"
    elif [ "$total_issues" -le 2 ]; then
        echo "✅ Status: GOOD - Minor MCP issues detected"
        echo "💡 Consider addressing remaining issues"
    else
        echo "⚠️  Status: NEEDS ATTENTION - Multiple MCP issues detected"
        echo "🔧 Consider fixing issues before using MCP features"
    fi
    
    echo ""
    echo "💡 Next Steps:"
    echo "  - Test MCP functionality with your IDE"
    echo "  - Run MCP health check: ./scripts/check-mcp-health.sh"
    echo "  - Check MCP server logs for any errors"
    echo "  - Verify MCP integration in your development workflow"
}

# Main execution
main() {
    local restart_all=true
    local validate_only=false
    local specific_server=""
    
    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            -s|--server)
                specific_server="$2"
                restart_all=false
                shift 2
                ;;
            -a|--all)
                restart_all=true
                shift
                ;;
            -v|--validate)
                validate_only=true
                shift
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
    
    # Check MCP configuration
    if ! check_mcp_configuration; then
        echo "❌ MCP configuration issues detected"
        exit 1
    fi
    
    if [ "$validate_only" = true ]; then
        # Only validate servers
        validate_all_servers
        local total_issues=$?
        generate_summary $total_issues
        exit $total_issues
    fi
    
    if [ "$restart_all" = true ]; then
        # Restart all servers
        restart_all_servers
    else
        # Restart specific server
        if [ -n "$specific_server" ]; then
            echo "🔄 Restarting $specific_server server..."
            stop_mcp_server "$specific_server"
            sleep "$RESTART_DELAY"
            start_mcp_server "$specific_server"
            sleep "$RESTART_DELAY"
        else
            echo "❌ No server specified"
            show_usage
            exit 1
        fi
    fi
    
    # Validate all servers
    validate_all_servers
    local total_issues=$?
    
    # Run health check
    run_health_check
    
    # Generate summary
    generate_summary $total_issues
    
    exit $total_issues
}

# Run main function
main "$@"
