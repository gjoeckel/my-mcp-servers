#!/bin/bash
# Link All Custom MCP Servers Globally
# This script links all packages for global npm access

set -euo pipefail

echo "🔗 LINKING ALL CUSTOM MCP SERVERS"
echo "================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to link a package
link_package() {
    local package_name="$1"
    local package_dir="packages/$package_name"

    echo -e "${BLUE}🔗 Linking $package_name...${NC}"

    if [ ! -d "$package_dir" ]; then
        echo -e "${RED}❌ Package directory not found: $package_dir${NC}"
        return 1
    fi

    cd "$package_dir"

    # Check if package was built
    if [ ! -d "build" ] && [ ! -f "dist/index.js" ]; then
        echo -e "${YELLOW}⚠️  Package not built, building first...${NC}"
        npm run build
    fi

    # Link the package globally
    if npm link; then
        echo -e "${GREEN}✅ $package_name linked successfully${NC}"
    else
        echo -e "${RED}❌ Failed to link $package_name${NC}"
        cd - > /dev/null
        return 1
    fi

    cd - > /dev/null
    echo ""
}

# Link packages
echo -e "${BLUE}📋 Linking packages for global access...${NC}"
echo ""

link_package "everything-minimal"
link_package "github-minimal"
link_package "puppeteer-minimal"
link_package "sequential-thinking-minimal"

echo -e "${GREEN}🎉 ALL PACKAGES LINKED SUCCESSFULLY!${NC}"
echo ""
echo -e "${BLUE}📊 Link Summary:${NC}"
echo "✅ @gjoeckel/mcp-everything-minimal"
echo "✅ @gjoeckel/mcp-github-minimal"
echo "✅ @gjoeckel/mcp-puppeteer-minimal"
echo "✅ @gjoeckel/mcp-sequential-thinking-minimal"
echo ""
echo -e "${YELLOW}💡 Available globally as:${NC}"
echo "• npx @gjoeckel/mcp-everything-minimal"
echo "• npx @gjoeckel/mcp-github-minimal"
echo "• npx @gjoeckel/mcp-puppeteer-minimal"
echo "• npx @gjoeckel/mcp-sequential-thinking-minimal"
echo ""
echo -e "${YELLOW}💡 Next steps:${NC}"
echo "1. Update your .cursor/mcp.json configuration"
echo "2. Restart Cursor IDE"
echo "3. Test the custom servers"
echo "4. Verify 35 tools are available"

