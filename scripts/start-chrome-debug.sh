#!/bin/bash
# AccessiList Chrome Debug Startup Script
# Starts Chrome with debugging enabled for MCP integration
# Line endings normalized to LF for Git Bash compatibility

set -euo pipefail

echo "🌐 AccessiList Chrome Debug Startup"
echo "==================================="
echo "Timestamp: $(date)"
echo ""

# Configuration
CHROME_DEBUG_PORT=9222
CHROME_USER_DATA_DIR="/tmp/chrome-debug-accessilist"
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

# Function to check if Chrome is already running
check_chrome_running() {
    if pgrep -f "chrome.*remote-debugging-port" >/dev/null 2>&1; then
        echo "⚠️  Chrome with debugging is already running"
        echo "   Port $CHROME_DEBUG_PORT may be in use"
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

# Function to kill existing Chrome sessions
kill_chrome_sessions() {
    echo "🛑 Killing existing Chrome debugging sessions..."
    
    local pids=$(pgrep -f "chrome.*remote-debugging-port" 2>/dev/null || true)
    if [ -n "$pids" ]; then
        echo "$pids" | xargs kill -TERM 2>/dev/null || true
        sleep 2
        
        # Force kill if still running
        local remaining_pids=$(pgrep -f "chrome.*remote-debugging-port" 2>/dev/null || true)
        if [ -n "$remaining_pids" ]; then
            echo "$remaining_pids" | xargs kill -KILL 2>/dev/null || true
        fi
        
        echo "✅ Chrome debugging sessions killed"
    else
        echo "ℹ️  No Chrome debugging sessions found"
    fi
}

# Function to test MCP connection
test_mcp_connection() {
    echo "🔧 Testing MCP Connection..."
    
    # Test if debugging port is accessible
    if curl -s "http://localhost:$CHROME_DEBUG_PORT/json/version" >/dev/null 2>&1; then
        echo "✅ Chrome debugging port is accessible"
        
        # Get Chrome version info
        local version_info=$(curl -s "http://localhost:$CHROME_DEBUG_PORT/json/version" 2>/dev/null || echo "{}")
        if [ "$version_info" != "{}" ]; then
            echo "✅ Chrome version info retrieved"
            echo "   Chrome is ready for MCP integration"
        else
            echo "⚠️  Could not retrieve Chrome version info"
        fi
    else
        echo "❌ Chrome debugging port is not accessible"
        echo "   MCP integration may not work properly"
    fi
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
                kill_chrome_sessions
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
    
    # Check if Chrome is already running
    if check_chrome_running; then
        echo "ℹ️  Chrome debugging is already running"
        echo "   You can access it at: http://localhost:$CHROME_DEBUG_PORT"
        exit 0
    fi
    
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
    
    # Test MCP connection
    test_mcp_connection
    
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
