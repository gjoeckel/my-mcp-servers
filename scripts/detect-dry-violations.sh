#!/bin/bash
# AccessiList DRY Violation Detection Script
# Detects code duplication and DRY principle violations
#
# FUTURE IMPROVEMENTS NEEDED:
# 1. Reduce false positives by being more intelligent about what constitutes real duplication
# 2. Distinguish between legitimate patterns (createElement, catch blocks) and actual code duplication
# 3. Add context-aware analysis (e.g., DOM manipulation in UI builders is legitimate)
# 4. Exclude test files from certain violation types (test assertions are expected)
# 5. Add whitelist for legitimate patterns (error handling, DOM creation, etc.)
# 6. Implement semantic analysis to detect actual duplicated logic vs. similar patterns
# 7. Add severity levels (critical, warning, info) for different violation types
# 8. Focus on function-level duplication rather than pattern matching
# 9. Add support for detecting duplicated utility functions that could be centralized
# 10. Improve accuracy by analyzing code structure, not just text patterns

set -euo pipefail

echo "🔍 AccessiList DRY Violation Detection"
echo "====================================="
echo "Timestamp: $(date)"
echo ""

# Configuration
TOTAL_VIOLATIONS=0
VIOLATION_THRESHOLD=10

# Initialize temporary file for counting violations
rm -f /tmp/dry_violations_count

# Function to count violations in a file
count_violations() {
    local file="$1"
    local pattern="$2"
    local description="$3"
    
    if [ -f "$file" ]; then
        local count=$(grep -c "$pattern" "$file" 2>/dev/null || echo "0")
        # Ensure count is a single integer
        count=$(echo "$count" | head -1 | tr -d '\n')
        if [ "$count" -gt 0 ] 2>/dev/null; then
            echo "  ❌ $file: $count $description"
            echo "$count" >> /tmp/dry_violations_count
        fi
    fi
}

# Function to check for duplicated code patterns
check_duplicated_patterns() {
    echo "📋 Checking for Duplicated Code Patterns..."
    
    # Check for hardcoded paths (exclude node_modules and other unnecessary directories)
    echo "  🔍 Hardcoded Path Patterns:"
    find . -name "*.js" -o -name "*.php" | grep -v node_modules | grep -v ".git" | while read -r file; do
        count_violations "$file" "/training/online/accessilist" "hardcoded paths"
    done
    
    # Check for duplicated error handling (exclude node_modules)
    echo "  🔍 Duplicated Error Handling:"
    find . -name "*.js" -o -name "*.php" | grep -v node_modules | grep -v ".git" | while read -r file; do
        count_violations "$file" "catch.*error" "duplicated error handling"
    done
    
    # Check for duplicated session validation
    echo "  🔍 Duplicated Session Validation:"
    find . -name "*.php" | grep -v node_modules | grep -v ".git" | while read -r file; do
        count_violations "$file" "session.*validation" "duplicated session validation"
    done
    
    # Check for duplicated API response patterns
    echo "  🔍 Duplicated API Response Patterns:"
    find . -name "*.php" | grep -v node_modules | grep -v ".git" | while read -r file; do
        count_violations "$file" "Content-Type.*application/json" "duplicated API responses"
    done
}

# Function to check for embedded configurations
check_embedded_configs() {
    echo "📋 Checking for Embedded Configurations..."
    
    # Check for embedded path configs
    echo "  🔍 Embedded Path Configurations:"
    find . -name "*.php" | grep -v node_modules | grep -v ".git" | while read -r file; do
        count_violations "$file" "window\.pathConfig.*=" "embedded path configs"
    done
    
    # Check for embedded API configs
    echo "  🔍 Embedded API Configurations:"
    find . -name "*.php" | grep -v node_modules | grep -v ".git" | while read -r file; do
        count_violations "$file" "api.*endpoint.*=" "embedded API configs"
    done
}

# Function to check for hardcoded fallback patterns
check_fallback_patterns() {
    echo "📋 Checking for Hardcoded Fallback Patterns..."
    
    # Check for window.pathConfig fallback patterns
    echo "  🔍 window.pathConfig Fallback Patterns:"
    find . -name "*.js" | grep -v node_modules | grep -v ".git" | while read -r file; do
        count_violations "$file" "window\.pathConfig.*\?" "hardcoded fallback patterns"
    done
    
    # Check for hardcoded production paths
    echo "  🔍 Hardcoded Production Paths:"
    find . -name "*.js" -o -name "*.php" | grep -v node_modules | grep -v ".git" | while read -r file; do
        count_violations "$file" "/training/online/accessilist" "hardcoded production paths"
    done
}

# Function to check for duplicated utility functions
check_utility_duplication() {
    echo "📋 Checking for Duplicated Utility Functions..."
    
    # Check for duplicated date formatting
    echo "  🔍 Duplicated Date Formatting:"
    find . -name "*.js" -o -name "*.php" | grep -v node_modules | grep -v ".git" | while read -r file; do
        count_violations "$file" "toLocaleString\|toLocaleDateString" "duplicated date formatting"
    done
    
    # Check for duplicated DOM manipulation
    echo "  🔍 Duplicated DOM Manipulation:"
    find . -name "*.js" | grep -v node_modules | grep -v ".git" | while read -r file; do
        count_violations "$file" "createElement\|appendChild" "duplicated DOM manipulation"
    done
}

# Function to generate summary report
generate_summary() {
    echo ""
    echo "📊 DRY Violation Summary"
    echo "======================="
    
    # Calculate total violations from temporary file
    if [ -f "/tmp/dry_violations_count" ]; then
        TOTAL_VIOLATIONS=$(awk '{sum += $1} END {print sum}' /tmp/dry_violations_count 2>/dev/null || echo "0")
        rm -f /tmp/dry_violations_count
    else
        TOTAL_VIOLATIONS=0
    fi
    
    echo "Total Violations Found: $TOTAL_VIOLATIONS"
    echo ""
    echo "⚠️  NOTE: Many violations are false positives (legitimate patterns flagged incorrectly)"
    echo "    Focus on actual code duplication rather than pattern matching results"
    echo "    See script comments for future improvements needed"
    echo ""
    
    if [ "$TOTAL_VIOLATIONS" -eq 0 ]; then
        echo "✅ Status: EXCELLENT - No DRY violations detected!"
        echo "🎯 All code follows DRY principles"
    elif [ "$TOTAL_VIOLATIONS" -le "$VIOLATION_THRESHOLD" ]; then
        echo "✅ Status: GOOD - Minimal DRY violations detected"
        echo "💡 Consider addressing remaining violations for better maintainability"
    else
        echo "⚠️  Status: NEEDS ATTENTION - Multiple DRY violations detected"
        echo "🔧 Consider refactoring to eliminate duplication"
        echo "    (Note: Many are false positives - focus on real duplications)"
    fi
    
    echo ""
    echo "💡 Recommendations:"
    echo "  - Use centralized utility functions"
    echo "  - Eliminate hardcoded paths and configurations"
    echo "  - Consolidate duplicated error handling"
    echo "  - Use shared API response patterns"
    echo "  - Implement centralized session validation"
}

# Main execution
main() {
    check_duplicated_patterns
    check_embedded_configs
    check_fallback_patterns
    check_utility_duplication
    generate_summary
    
    # Exit with appropriate code
    if [ "$TOTAL_VIOLATIONS" -gt "$VIOLATION_THRESHOLD" ]; then
        exit 1
    else
        exit 0
    fi
}

# Run main function
main "$@"
