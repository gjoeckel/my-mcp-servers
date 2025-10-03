#!/bin/bash
# Cursor Configuration Management Script
# Handles backup, restore, and optimization of Cursor settings

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
CURSOR_CONFIG_DIR="/Users/a00288946/.cursor"
BACKUP_DIR="$PROJECT_ROOT/backups/cursor-config"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Create backup directory
create_backup_dir() {
    mkdir -p "$BACKUP_DIR"
}

# Backup current configuration
backup_config() {
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_path="$BACKUP_DIR/cursor-config-$timestamp"

    log_info "Creating backup of current Cursor configuration..."

    mkdir -p "$backup_path"

    # Backup MCP configuration
    if [ -f "$CURSOR_CONFIG_DIR/mcp.json" ]; then
        cp "$CURSOR_CONFIG_DIR/mcp.json" "$backup_path/mcp.json"
        log_success "MCP configuration backed up"
    else
        log_warning "No MCP configuration found to backup"
    fi

    # Backup Cursor settings
    if [ -f "$CURSOR_CONFIG_DIR/settings.json" ]; then
        cp "$CURSOR_CONFIG_DIR/settings.json" "$backup_path/settings.json"
        log_success "Cursor settings backed up"
    else
        log_warning "No Cursor settings found to backup"
    fi

    # Create backup manifest
    cat > "$backup_path/manifest.json" << EOF
{
  "timestamp": "$timestamp",
  "backup_type": "cursor_configuration",
  "project": "autonomous-development-assistant",
  "files": [
    "mcp.json",
    "settings.json"
  ]
}
EOF

    log_success "Backup created at: $backup_path"
    echo "$backup_path"
}

# Restore configuration from backup
restore_config() {
    local backup_path="$1"

    if [ ! -d "$backup_path" ]; then
        log_error "Backup directory not found: $backup_path"
        exit 1
    fi

    log_info "Restoring Cursor configuration from backup..."

    # Restore MCP configuration
    if [ -f "$backup_path/mcp.json" ]; then
        cp "$backup_path/mcp.json" "$CURSOR_CONFIG_DIR/mcp.json"
        log_success "MCP configuration restored"
    fi

    # Restore Cursor settings
    if [ -f "$backup_path/settings.json" ]; then
        cp "$backup_path/settings.json" "$CURSOR_CONFIG_DIR/settings.json"
        log_success "Cursor settings restored"
    fi

    log_success "Configuration restored successfully"
}

# Apply optimized configuration
apply_optimized_config() {
    log_info "Applying optimized Cursor configuration..."

    # Apply optimized MCP configuration
    if [ -f "$PROJECT_ROOT/scripts/optimize-cursor-mcp.sh" ]; then
        bash "$PROJECT_ROOT/scripts/optimize-cursor-mcp.sh"
        log_success "Optimized MCP configuration applied"
    else
        log_error "MCP optimization script not found"
        exit 1
    fi

    # Apply optimized Cursor settings
    if [ -f "$PROJECT_ROOT/cursor-settings-optimized.json" ]; then
        cp "$PROJECT_ROOT/cursor-settings-optimized.json" "$CURSOR_CONFIG_DIR/settings.json"
        log_success "Optimized Cursor settings applied"
    else
        log_error "Optimized Cursor settings file not found"
        exit 1
    fi

    # Apply project-specific settings
    if [ -f "$PROJECT_ROOT/.vscode/settings.json" ]; then
        log_success "Project-specific settings already configured"
    else
        log_warning "Project-specific settings not found"
    fi
}

# List available backups
list_backups() {
    log_info "Available backups:"

    if [ ! -d "$BACKUP_DIR" ]; then
        log_warning "No backup directory found"
        return
    fi

    for backup in "$BACKUP_DIR"/*; do
        if [ -d "$backup" ]; then
            local timestamp=$(basename "$backup" | sed 's/cursor-config-//')
            local date=$(echo "$timestamp" | cut -d'_' -f1)
            local time=$(echo "$timestamp" | cut -d'_' -f2)
            echo "  📁 $backup (Date: $date, Time: $time)"
        fi
    done
}

# Validate configuration
validate_config() {
    log_info "Validating Cursor configuration..."

    # Check MCP configuration
    if [ -f "$CURSOR_CONFIG_DIR/mcp.json" ]; then
        if python3 -m json.tool "$CURSOR_CONFIG_DIR/mcp.json" > /dev/null 2>&1; then
            log_success "MCP configuration JSON is valid"
        else
            log_error "MCP configuration JSON is invalid"
            return 1
        fi
    else
        log_warning "MCP configuration file not found"
    fi

    # Check Cursor settings
    if [ -f "$CURSOR_CONFIG_DIR/settings.json" ]; then
        if python3 -m json.tool "$CURSOR_CONFIG_DIR/settings.json" > /dev/null 2>&1; then
            log_success "Cursor settings JSON is valid"
        else
            log_error "Cursor settings JSON is invalid"
            return 1
        fi
    else
        log_warning "Cursor settings file not found"
    fi

    log_success "Configuration validation complete"
}

# Show help
show_help() {
    echo "Cursor Configuration Management Script"
    echo "======================================"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  backup              Create backup of current configuration"
    echo "  restore <path>      Restore configuration from backup"
    echo "  optimize            Apply optimized configuration"
    echo "  list-backups        List available backups"
    echo "  validate            Validate current configuration"
    echo "  help                Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 backup"
    echo "  $0 restore /path/to/backup"
    echo "  $0 optimize"
    echo "  $0 list-backups"
}

# Main script logic
main() {
    create_backup_dir

    case "${1:-help}" in
        "backup")
            backup_config
            ;;
        "restore")
            if [ -z "${2:-}" ]; then
                log_error "Backup path required for restore command"
                echo "Usage: $0 restore <backup_path>"
                exit 1
            fi
            restore_config "$2"
            ;;
        "optimize")
            backup_config
            apply_optimized_config
            validate_config
            ;;
        "list-backups")
            list_backups
            ;;
        "validate")
            validate_config
            ;;
        "help"|*)
            show_help
            ;;
    esac
}

# Run main function with all arguments
main "$@"
