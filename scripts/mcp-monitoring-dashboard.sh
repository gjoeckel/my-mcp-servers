#!/bin/bash
# AccessiList MCP Monitoring Dashboard
# Comprehensive MCP health monitoring and status reporting

set -euo pipefail

echo "📊 AccessiList MCP Monitoring Dashboard"
echo "======================================"
echo "Timestamp: $(date)"
echo ""

# Configuration
DASHBOARD_REFRESH_INTERVAL=30
LOG_FILE="logs/mcp-monitoring.log"
ALERT_THRESHOLD_ISSUES=3

# Function to create log directory
setup_logging() {
    mkdir -p logs
    if [ ! -f "$LOG_FILE" ]; then
        touch "$LOG_FILE"
    fi
}

# Function to log with timestamp
log_message() {
    local message="$1"
    local level="${2:-INFO}"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [$level] $message" >> "$LOG_FILE"
}

# Function to check MCP server health
check_mcp_server_health() {
    local server="$1"
    local status="unknown"
    local details=""
    
    case "$server" in
        "chrome-devtools")
            if command -v google-chrome &> /dev/null || command -v chromium &> /dev/null; then
                status="healthy"
                details="Browser available"
            else
                status="unhealthy"
                details="Browser not found"
            fi
            ;;
        "filesystem")
            if [ -r "." ] && [ -w "." ]; then
                status="healthy"
                details="Read/write access OK"
            else
                status="unhealthy"
                details="Access issues"
            fi
            ;;
        "memory")
            if command -v free &> /dev/null; then
                local available_memory=$(free -m | awk 'NR==2{printf "%.0f", $7}')
                if [ "$available_memory" -gt 1000 ]; then
                    status="healthy"
                    details="Memory: ${available_memory}MB"
                else
                    status="warning"
                    details="Low memory: ${available_memory}MB"
                fi
            else
                status="healthy"
                details="Memory check not available"
            fi
            ;;
        "github")
            if command -v git &> /dev/null; then
                if git rev-parse --git-dir >/dev/null 2>&1; then
                    status="healthy"
                    details="Git repository OK"
                else
                    status="unhealthy"
                    details="Not a git repository"
                fi
            else
                status="unhealthy"
                details="Git not found"
            fi
            ;;
    esac
    
    echo "$status|$details"
}

# Function to generate MCP status report
generate_mcp_status_report() {
    echo "🔧 MCP Server Status Report"
    echo "=========================="
    
    local total_issues=0
    local servers=("chrome-devtools" "filesystem" "memory" "github")
    
    for server in "${servers[@]}"; do
        local health_info=$(check_mcp_server_health "$server")
        local status=$(echo "$health_info" | cut -d'|' -f1)
        local details=$(echo "$health_info" | cut -d'|' -f2)
        
        case "$status" in
            "healthy")
                echo "  ✅ $server: $details"
                ;;
            "warning")
                echo "  ⚠️  $server: $details"
                total_issues=$((total_issues + 1))
                ;;
            "unhealthy")
                echo "  ❌ $server: $details"
                total_issues=$((total_issues + 2))
                ;;
            *)
                echo "  ❓ $server: Unknown status"
                total_issues=$((total_issues + 1))
                ;;
        esac
        
        # Log the status
        log_message "MCP Server $server: $status - $details"
    done
    
    echo ""
    echo "📊 Overall MCP Health:"
    if [ "$total_issues" -eq 0 ]; then
        echo "  ✅ EXCELLENT - All MCP servers are healthy"
        log_message "MCP Health: EXCELLENT - All servers healthy"
    elif [ "$total_issues" -le 2 ]; then
        echo "  ✅ GOOD - Minor issues detected"
        log_message "MCP Health: GOOD - Minor issues detected"
    else
        echo "  ⚠️  NEEDS ATTENTION - Multiple issues detected"
        log_message "MCP Health: NEEDS ATTENTION - $total_issues issues detected"
    fi
    
    return $total_issues
}

# Function to check MCP integration status
check_mcp_integration_status() {
    echo ""
    echo "🔗 MCP Integration Status"
    echo "========================"
    
    local integration_issues=0
    
    # Check Cursor rules
    if [ -d ".cursor/rules" ]; then
        if grep -r "mcp\|MCP" ".cursor/rules" >/dev/null 2>&1; then
            echo "  ✅ Cursor rules with MCP references found"
        else
            echo "  ⚠️  No MCP references in Cursor rules"
            integration_issues=$((integration_issues + 1))
        fi
    else
        echo "  ❌ Cursor rules directory not found"
        integration_issues=$((integration_issues + 2))
    fi
    
    # Check MCP scripts
    local mcp_scripts=("check-mcp-health.sh" "start-chrome-debug.sh" "restart-mcp-servers.sh" "emergency-reset.sh")
    for script in "${mcp_scripts[@]}"; do
        if [ -f "scripts/$script" ]; then
            echo "  ✅ MCP script $script found"
        else
            echo "  ❌ MCP script $script missing"
            integration_issues=$((integration_issues + 1))
        fi
    done
    
    # Check test infrastructure
    if [ -f "tests/chrome-mcp/run_chrome_mcp_tests.php" ]; then
        echo "  ✅ Chrome MCP test infrastructure found"
    else
        echo "  ❌ Chrome MCP test infrastructure missing"
        integration_issues=$((integration_issues + 2))
    fi
    
    log_message "MCP Integration Status: $integration_issues issues detected"
    return $integration_issues
}

# Function to generate performance metrics
generate_performance_metrics() {
    echo ""
    echo "📈 Performance Metrics"
    echo "===================="
    
    # Check available memory
    if command -v free &> /dev/null; then
        local total_memory=$(free -m | awk 'NR==2{printf "%.0f", $2}')
        local available_memory=$(free -m | awk 'NR==2{printf "%.0f", $7}')
        local memory_usage=$((total_memory - available_memory))
        local memory_percent=$((memory_usage * 100 / total_memory))
        
        echo "  💾 Memory Usage: ${memory_usage}MB / ${total_memory}MB (${memory_percent}%)"
        
        if [ "$memory_percent" -gt 80 ]; then
            echo "    ⚠️  High memory usage detected"
            log_message "Performance: High memory usage - ${memory_percent}%"
        else
            echo "    ✅ Memory usage is normal"
        fi
    fi
    
    # Check disk space
    if command -v df &> /dev/null; then
        local disk_usage=$(df -h . | awk 'NR==2{print $5}' | sed 's/%//')
        echo "  💿 Disk Usage: ${disk_usage}%"
        
        if [ "$disk_usage" -gt 90 ]; then
            echo "    ⚠️  High disk usage detected"
            log_message "Performance: High disk usage - ${disk_usage}%"
        else
            echo "    ✅ Disk usage is normal"
        fi
    fi
}

# Function to generate alerts
generate_alerts() {
    local total_issues="$1"
    
    echo ""
    echo "🚨 Alert Status"
    echo "=============="
    
    if [ "$total_issues" -ge "$ALERT_THRESHOLD_ISSUES" ]; then
        echo "  🔴 HIGH PRIORITY - $total_issues issues require immediate attention"
        echo ""
        echo "  📋 Recommended Actions:"
        echo "    1. Run: ./scripts/check-mcp-health.sh"
        echo "    2. Run: ./scripts/restart-mcp-servers.sh"
        echo "    3. Check logs: tail -f $LOG_FILE"
        echo "    4. Run comprehensive tests: php tests/run_comprehensive_tests.php"
        
        log_message "ALERT: High priority - $total_issues issues detected" "ALERT"
    elif [ "$total_issues" -gt 0 ]; then
        echo "  🟡 MEDIUM PRIORITY - $total_issues issues detected"
        echo ""
        echo "  📋 Recommended Actions:"
        echo "    1. Monitor MCP server status"
        echo "    2. Check for any error logs"
        echo "    3. Run health check: ./scripts/check-mcp-health.sh"
        
        log_message "ALERT: Medium priority - $total_issues issues detected" "WARNING"
    else
        echo "  🟢 ALL SYSTEMS NORMAL - No issues detected"
        log_message "Status: All systems normal" "INFO"
    fi
}

# Function to display usage information
show_usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -c, --continuous    Run in continuous monitoring mode"
    echo "  -i, --interval SEC  Set refresh interval in seconds (default: $DASHBOARD_REFRESH_INTERVAL)"
    echo "  -l, --log           Show recent log entries"
    echo "  -h, --help          Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                  # Run single monitoring check"
    echo "  $0 -c               # Run continuous monitoring"
    echo "  $0 -c -i 60         # Run continuous monitoring with 60-second intervals"
    echo "  $0 -l               # Show recent log entries"
}

# Function to show recent logs
show_recent_logs() {
    echo "📋 Recent MCP Monitoring Logs"
    echo "============================="
    
    if [ -f "$LOG_FILE" ]; then
        tail -20 "$LOG_FILE"
    else
        echo "No log file found at $LOG_FILE"
    fi
}

# Function to run continuous monitoring
run_continuous_monitoring() {
    local interval="${1:-$DASHBOARD_REFRESH_INTERVAL}"
    
    echo "🔄 Starting Continuous MCP Monitoring"
    echo "Refresh Interval: ${interval} seconds"
    echo "Press Ctrl+C to stop"
    echo ""
    
    while true; do
        clear
        echo "📊 AccessiList MCP Monitoring Dashboard (Continuous Mode)"
        echo "========================================================"
        echo "Last Updated: $(date)"
        echo ""
        
        # Run monitoring checks
        local server_issues=0
        local integration_issues=0
        
        generate_mcp_status_report
        server_issues=$?
        
        check_mcp_integration_status
        integration_issues=$?
        
        generate_performance_metrics
        
        local total_issues=$((server_issues + integration_issues))
        generate_alerts $total_issues
        
        echo ""
        echo "⏰ Next refresh in ${interval} seconds..."
        sleep "$interval"
    done
}

# Main execution
main() {
    local continuous_mode=false
    local interval="$DASHBOARD_REFRESH_INTERVAL"
    local show_logs=false
    
    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            -c|--continuous)
                continuous_mode=true
                shift
                ;;
            -i|--interval)
                interval="$2"
                shift 2
                ;;
            -l|--log)
                show_logs=true
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
    
    # Setup logging
    setup_logging
    
    # Handle different modes
    if [ "$show_logs" = true ]; then
        show_recent_logs
        exit 0
    fi
    
    if [ "$continuous_mode" = true ]; then
        run_continuous_monitoring "$interval"
    else
        # Single monitoring check
        local server_issues=0
        local integration_issues=0
        
        generate_mcp_status_report
        server_issues=$?
        
        check_mcp_integration_status
        integration_issues=$?
        
        generate_performance_metrics
        
        local total_issues=$((server_issues + integration_issues))
        generate_alerts $total_issues
        
        echo ""
        echo "💡 For continuous monitoring, run: $0 -c"
        echo "📋 For recent logs, run: $0 -l"
        
        # Exit with appropriate code
        if [ "$total_issues" -ge "$ALERT_THRESHOLD_ISSUES" ]; then
            exit 2
        elif [ "$total_issues" -gt 0 ]; then
            exit 1
        else
            exit 0
        fi
    fi
}

# Run main function
main "$@"
