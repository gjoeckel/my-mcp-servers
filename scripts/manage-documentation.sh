#!/bin/bash
# Documentation Management Script
# Integrates with MCP tools for documentation management

set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DOCS_DIR="$PROJECT_ROOT/docs"

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

# Create new documentation file
create_doc() {
    local category="$1"
    local filename="$2"
    local title="$3"
    
    if [ -z "$category" ] || [ -z "$filename" ] || [ -z "$title" ]; then
        log_error "Usage: create_doc <category> <filename> <title>"
        return 1
    fi
    
    local doc_path="$DOCS_DIR/$category/$filename"
    
    if [ -f "$doc_path" ]; then
        log_warning "Document already exists: $doc_path"
        return 1
    fi
    
    # Create directory if it doesn't exist
    mkdir -p "$DOCS_DIR/$category"
    
    # Create document template
    cat > "$doc_path" << EOF
# $title

## Overview

Brief description of this document's purpose.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Instructions](#instructions)
- [Examples](#examples)
- [Troubleshooting](#troubleshooting)
- [References](#references)

## Prerequisites

- List any prerequisites here
- Include version requirements
- Mention any dependencies

## Instructions

### Step 1: Title

Detailed instructions here.

### Step 2: Title

More detailed instructions.

## Examples

\`\`\`bash
# Example commands
echo "Example code here"
\`\`\`

## Troubleshooting

### Common Issues

**Issue**: Description of common issue
**Solution**: How to resolve it

## References

- [Link 1](https://example.com)
- [Link 2](https://example.com)

---
*Last updated: $(date '+%Y-%m-%d')*
EOF
    
    log_success "Created documentation: $doc_path"
    echo "$doc_path"
}

# List documentation
list_docs() {
    log_info "Documentation Structure:"
    echo ""
    
    if [ ! -d "$DOCS_DIR" ]; then
        log_warning "Documentation directory not found. Run organize-documentation.sh first."
        return 1
    fi
    
    find "$DOCS_DIR" -name "*.md" -o -name "*.html" | sort | while read -r file; do
        local relative_path="${file#$DOCS_DIR/}"
        local category=$(dirname "$relative_path")
        local filename=$(basename "$file")
        
        if [ "$category" = "." ]; then
            category="root"
        fi
        
        echo "  📄 $category/$filename"
    done
}

# Search documentation
search_docs() {
    local query="$1"
    
    if [ -z "$query" ]; then
        log_error "Usage: search_docs <query>"
        return 1
    fi
    
    log_info "Searching documentation for: $query"
    echo ""
    
    find "$DOCS_DIR" -name "*.md" -o -name "*.html" | while read -r file; do
        if grep -qi "$query" "$file"; then
            local relative_path="${file#$DOCS_DIR/}"
            echo "  📄 $relative_path"
            grep -ni "$query" "$file" | head -3 | sed 's/^/    /'
            echo ""
        fi
    done
}

# Validate documentation
validate_docs() {
    log_info "Validating documentation structure..."
    
    local errors=0
    
    # Check for required directories
    local required_dirs=("architecture" "development" "deployment")
    for dir in "${required_dirs[@]}"; do
        if [ ! -d "$DOCS_DIR/$dir" ]; then
            log_error "Missing required directory: $dir"
            ((errors++))
        fi
    done
    
    # Check for required files
    local required_files=("README.md" "architecture/architecture_diagram.html" "development/AI-AUTONOMY-SETUP.md")
    for file in "${required_files[@]}"; do
        if [ ! -f "$DOCS_DIR/$file" ]; then
            log_warning "Missing recommended file: $file"
        fi
    done
    
    # Check for broken links
    log_info "Checking for broken internal links..."
    find "$DOCS_DIR" -name "*.md" | while read -r file; do
        grep -o '\[.*\]([^)]*)' "$file" | while read -r link; do
            # Extract the link URL
            local url=$(echo "$link" | sed 's/.*(\([^)]*\)).*/\1/')
            
            # Skip external links
            if [[ "$url" =~ ^https?:// ]]; then
                continue
            fi
            
            # Check if internal link exists
            local target_path="$DOCS_DIR/$url"
            if [ ! -f "$target_path" ] && [ ! -d "$target_path" ]; then
                log_warning "Broken link in $file: $url"
            fi
        done
    done
    
    if [ $errors -eq 0 ]; then
        log_success "Documentation validation complete"
    else
        log_error "Documentation validation found $errors errors"
        return 1
    fi
}

# Generate documentation index
generate_index() {
    log_info "Generating documentation index..."
    
    cat > "$DOCS_DIR/README.md" << 'EOF'
# AccessiList Documentation

This directory contains all project documentation organized by category.

## 📁 Directory Structure

EOF
    
    # Add directory descriptions
    find "$DOCS_DIR" -maxdepth 1 -type d | sort | while read -r dir; do
        local dirname=$(basename "$dir")
        if [ "$dirname" != "docs" ] && [ "$dirname" != "." ]; then
            case "$dirname" in
                "architecture")
                    echo "- **\`$dirname/\`** - System architecture, diagrams, and design documents" >> "$DOCS_DIR/README.md"
                    ;;
                "development")
                    echo "- **\`$dirname/\`** - Development setup, tools, and troubleshooting guides" >> "$DOCS_DIR/README.md"
                    ;;
                "deployment")
                    echo "- **\`$dirname/\`** - Deployment guides, rollback plans, and production setup" >> "$DOCS_DIR/README.md"
                    ;;
                "api")
                    echo "- **\`$dirname/\`** - API documentation and integration guides" >> "$DOCS_DIR/README.md"
                    ;;
                "user-guides")
                    echo "- **\`$dirname/\`** - User manuals and feature documentation" >> "$DOCS_DIR/README.md"
                    ;;
                *)
                    echo "- **\`$dirname/\`** - $dirname documentation" >> "$DOCS_DIR/README.md"
                    ;;
            esac
        fi
    done
    
    cat >> "$DOCS_DIR/README.md" << 'EOF'

## 🚀 Quick Start

1. **Development Setup**: See `development/AI-AUTONOMY-SETUP.md`
2. **Architecture Overview**: See `architecture/architecture_diagram.html`
3. **Deployment Guide**: See `deployment/DEPLOYMENT.md`
4. **Troubleshooting**: See `development/MCP-TROUBLESHOOTING.md`

## 📚 Documentation Standards

- Use Markdown (`.md`) for text documentation
- Use HTML (`.html`) for interactive diagrams
- Include table of contents for long documents
- Keep documentation up-to-date with code changes
- Use clear, descriptive filenames

## 🔄 Maintenance

Run `./scripts/manage-documentation.sh` to manage documentation.
EOF
    
    log_success "Generated documentation index"
}

# Show help
show_help() {
    echo "Documentation Management Script"
    echo "=============================="
    echo ""
    echo "Usage: $0 [COMMAND] [OPTIONS]"
    echo ""
    echo "Commands:"
    echo "  create <category> <filename> <title>  Create new documentation file"
    echo "  list                                  List all documentation"
    echo "  search <query>                        Search documentation content"
    echo "  validate                              Validate documentation structure"
    echo "  index                                 Generate documentation index"
    echo "  organize                              Organize existing documentation"
    echo "  help                                  Show this help message"
    echo ""
    echo "Categories:"
    echo "  architecture, development, deployment, api, user-guides"
    echo ""
    echo "Examples:"
    echo "  $0 create development setup-guide.md 'Development Setup Guide'"
    echo "  $0 search 'MCP configuration'"
    echo "  $0 list"
    echo "  $0 validate"
}

# Main script logic
main() {
    case "${1:-help}" in
        "create")
            if [ -z "${2:-}" ] || [ -z "${3:-}" ] || [ -z "${4:-}" ]; then
                log_error "Usage: $0 create <category> <filename> <title>"
                exit 1
            fi
            create_doc "$2" "$3" "$4"
            ;;
        "list")
            list_docs
            ;;
        "search")
            if [ -z "${2:-}" ]; then
                log_error "Usage: $0 search <query>"
                exit 1
            fi
            search_docs "$2"
            ;;
        "validate")
            validate_docs
            ;;
        "index")
            generate_index
            ;;
        "organize")
            bash "$PROJECT_ROOT/scripts/organize-documentation.sh"
            ;;
        "help"|*)
            show_help
            ;;
    esac
}

# Run main function with all arguments
main "$@"