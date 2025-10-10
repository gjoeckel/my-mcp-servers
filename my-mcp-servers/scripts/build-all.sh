#!/bin/bash
# Build All Custom MCP Servers
# This script builds all packages in the correct order

set -euo pipefail

echo "🔨 BUILDING ALL CUSTOM MCP SERVERS"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to build a package
build_package() {
    local package_name="$1"
    local package_dir="packages/$package_name"

    echo -e "${BLUE}🔧 Building $package_name...${NC}"

    if [ ! -d "$package_dir" ]; then
        echo -e "${RED}❌ Package directory not found: $package_dir${NC}"
        return 1
    fi

    cd "$package_dir"

    # Check if package.json exists
    if [ ! -f "package.json" ]; then
        echo -e "${RED}❌ package.json not found in $package_dir${NC}"
        cd - > /dev/null
        return 1
    fi

    # Install dependencies if node_modules doesn't exist
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}📦 Installing dependencies for $package_name...${NC}"
        npm install
    fi

    # Build the package
    if npm run build; then
        echo -e "${GREEN}✅ $package_name built successfully${NC}"
    else
        echo -e "${RED}❌ Failed to build $package_name${NC}"
        cd - > /dev/null
        return 1
    fi

    cd - > /dev/null
    echo ""
}

# Build packages in dependency order
echo -e "${BLUE}📋 Building packages in dependency order...${NC}"
echo ""

# Build packages in order
build_package "everything-minimal"
build_package "github-minimal"
build_package "puppeteer-minimal"
build_package "sequential-thinking-minimal"

echo -e "${GREEN}🎉 ALL PACKAGES BUILT SUCCESSFULLY!${NC}"
echo ""
echo -e "${BLUE}📊 Build Summary:${NC}"
echo "✅ everything-minimal"
echo "✅ github-minimal"
echo "✅ puppeteer-minimal"
echo "✅ sequential-thinking-minimal"
echo ""
echo -e "${YELLOW}💡 Next steps:${NC}"
echo "1. Run: npm run link-all"
echo "2. Update your .cursor/mcp.json configuration"
echo "3. Restart Cursor IDE"
echo "4. Verify 35 tools are available"
