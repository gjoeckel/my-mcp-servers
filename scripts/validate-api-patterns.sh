#!/bin/bash
# AccessiList API Pattern Validation Script
# Validates API endpoint consistency and patterns

set -euo pipefail

echo "🔌 AccessiList API Pattern Validation"
echo "====================================="
echo "Timestamp: $(date)"
echo ""

# Configuration
API_DIR="php/api"
UTILS_FILE="php/includes/api-utils.php"
TOTAL_ISSUES=0

# Function to check API endpoint
check_api_endpoint() {
    local endpoint="$1"
    local file="$API_DIR/$endpoint"
    
    echo "  🔍 Checking $endpoint..."
    
    if [ ! -f "$file" ]; then
        echo "    ❌ File not found: $file"
        TOTAL_ISSUES=$((TOTAL_ISSUES + 1))
        return
    fi
    
    # Check if uses api-utils.php
    if ! grep -q "api-utils.php" "$file"; then
        echo "    ❌ Does not use api-utils.php"
        TOTAL_ISSUES=$((TOTAL_ISSUES + 1))
    else
        echo "    ✅ Uses api-utils.php"
    fi
    
    # Check for proper JSON headers
    if ! grep -q "Content-Type.*application/json" "$file"; then
        echo "    ❌ Missing JSON content type header"
        TOTAL_ISSUES=$((TOTAL_ISSUES + 1))
    else
        echo "    ✅ Has JSON content type header"
    fi
    
    # Check for error handling
    if ! grep -q "send_error\|send_success" "$file"; then
        echo "    ❌ Does not use centralized error/success functions"
        TOTAL_ISSUES=$((TOTAL_ISSUES + 1))
    else
        echo "    ✅ Uses centralized response functions"
    fi
    
    # Check for session validation
    if ! grep -q "validate_session_key" "$file"; then
        echo "    ⚠️  Does not use session validation (may be intentional)"
    else
        echo "    ✅ Uses session validation"
    fi
}

# Function to check API utilities
check_api_utilities() {
    echo "📋 Checking API Utilities..."
    
    if [ ! -f "$UTILS_FILE" ]; then
        echo "  ❌ API utilities file not found: $UTILS_FILE"
        TOTAL_ISSUES=$((TOTAL_ISSUES + 1))
        return
    fi
    
    echo "  ✅ API utilities file exists"
    
    # Check for required functions
    local required_functions=("send_error" "send_success" "validate_session_key" "saves_path_for")
    
    for func in "${required_functions[@]}"; do
        if grep -q "function $func" "$UTILS_FILE"; then
            echo "  ✅ Function $func found"
        else
            echo "  ❌ Function $func not found"
            TOTAL_ISSUES=$((TOTAL_ISSUES + 1))
        fi
    done
}

# Function to check API consistency
check_api_consistency() {
    echo "📋 Checking API Consistency..."
    
    # Check all API endpoints
    local endpoints=("save.php" "restore.php" "delete.php" "list.php")
    
    for endpoint in "${endpoints[@]}"; do
        check_api_endpoint "$endpoint"
    done
}

# Function to check response patterns
check_response_patterns() {
    echo "📋 Checking Response Patterns..."
    
    # Check for consistent error response format
    echo "  🔍 Error Response Format:"
    if grep -r "send_error" "$API_DIR" | grep -q "error.*message"; then
        echo "    ✅ Consistent error response format"
    else
        echo "    ⚠️  Error response format may be inconsistent"
    fi
    
    # Check for consistent success response format
    echo "  🔍 Success Response Format:"
    if grep -r "send_success" "$API_DIR" | grep -q "data.*message"; then
        echo "    ✅ Consistent success response format"
    else
        echo "    ⚠️  Success response format may be inconsistent"
    fi
}

# Function to check security patterns
check_security_patterns() {
    echo "📋 Checking Security Patterns..."
    
    # Check for input validation
    echo "  🔍 Input Validation:"
    if grep -r "validate_session_key\|filter_input\|htmlspecialchars" "$API_DIR" >/dev/null; then
        echo "    ✅ Input validation present"
    else
        echo "    ⚠️  Input validation may be missing"
    fi
    
    # Check for proper HTTP methods
    echo "  🔍 HTTP Method Validation:"
    if grep -r "REQUEST_METHOD" "$API_DIR" >/dev/null; then
        echo "    ✅ HTTP method validation present"
    else
        echo "    ⚠️  HTTP method validation may be missing"
    fi
}

# Function to generate summary report
generate_summary() {
    echo ""
    echo "📊 API Pattern Validation Summary"
    echo "================================="
    echo "Total Issues Found: $TOTAL_ISSUES"
    
    if [ "$TOTAL_ISSUES" -eq 0 ]; then
        echo "✅ Status: EXCELLENT - All API patterns are consistent!"
        echo "🎯 All endpoints follow established patterns"
    elif [ "$TOTAL_ISSUES" -le 3 ]; then
        echo "✅ Status: GOOD - Minor API pattern issues detected"
        echo "💡 Consider addressing remaining issues for better consistency"
    else
        echo "⚠️  Status: NEEDS ATTENTION - Multiple API pattern issues detected"
        echo "🔧 Consider standardizing API patterns"
    fi
    
    echo ""
    echo "💡 Recommendations:"
    echo "  - Ensure all endpoints use api-utils.php"
    echo "  - Standardize response formats"
    echo "  - Implement consistent error handling"
    echo "  - Add proper input validation"
    echo "  - Use centralized session validation"
}

# Main execution
main() {
    check_api_utilities
    check_api_consistency
    check_response_patterns
    check_security_patterns
    generate_summary
    
    # Exit with appropriate code
    if [ "$TOTAL_ISSUES" -gt 3 ]; then
        exit 1
    else
        exit 0
    fi
}

# Run main function
main "$@"
