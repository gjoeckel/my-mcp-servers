# macOS Tahoe Development Environment Setup - AI Agent Instructions

## Overview
This template provides step-by-step instructions for an AI agent to configure a complete macOS Tahoe development environment optimized for Cursor IDE. The setup follows Apple's best practices and leverages the latest macOS 16 features including Model Context Protocol integration.

## Prerequisites
- macOS Tahoe (16.0+) installed
- Administrator access
- Internet connection
- Terminal access

## macOS Tahoe Compatibility Notes
- This guide has been updated for macOS 16 (Tahoe) compatibility
- Xcode 17+ is recommended for full macOS 16 feature support
- Enhanced security features may require additional manual configuration
- Some third-party tools may require updates for full compatibility

## Phase 1: System Assessment (Estimated: 2-3 minutes)

### 1.1 Create Backup of Existing Configuration
```bash
# Create backup directory with timestamp
BACKUP_DIR="$HOME/.config-backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

# Backup existing configurations
[ -f ~/.zshrc ] && cp ~/.zshrc "$BACKUP_DIR/"
[ -f ~/.gitconfig ] && cp ~/.gitconfig "$BACKUP_DIR/"
[ -f ~/.zprofile ] && cp ~/.zprofile "$BACKUP_DIR/"
[ -f ~/.bash_profile ] && cp ~/.bash_profile "$BACKUP_DIR/"
[ -f ~/.bashrc ] && cp ~/.bashrc "$BACKUP_DIR/"

echo "✓ Backups created in $BACKUP_DIR"
```

### 1.2 Detect System Architecture
```bash
# Check processor architecture
ARCH=$(uname -m)
echo "Detected architecture: $ARCH"

case $ARCH in
  arm64)
    echo "✓ Apple Silicon Mac detected"
    HOMEBREW_PREFIX="/opt/homebrew"
    ;;
  x86_64)
    echo "✓ Intel Mac detected"
    HOMEBREW_PREFIX="/usr/local"
    ;;
  *)
    echo "✗ Unsupported architecture: $ARCH"
    exit 1
    ;;
esac

# Verify macOS version
MACOS_VERSION=$(sw_vers -productVersion)
echo "macOS Version: $MACOS_VERSION"

# Check if macOS Tahoe (16.x)
if [[ $MACOS_VERSION =~ ^16\. ]]; then
  echo "✓ macOS Tahoe detected"
else
  echo "⚠️  Warning: This guide is optimized for macOS Tahoe (16.x)"
  echo "   Current version: $MACOS_VERSION"
  read -p "Continue anyway? (y/N): " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
fi
```

### 1.3 Check Current Shell
```bash
# Verify zsh is default shell
CURRENT_SHELL=$(echo $SHELL)
echo "Current shell: $CURRENT_SHELL"

if [[ $CURRENT_SHELL == "/bin/zsh" ]]; then
  echo "✓ zsh is already the default shell"
else
  echo "⚠️  Current shell is not zsh: $CURRENT_SHELL"
  echo "Changing default shell to zsh..."
  
  # Check if zsh is available
  if command -v zsh &> /dev/null; then
    chsh -s /bin/zsh
    echo "✓ Default shell changed to zsh"
    echo "⚠️  Please restart your terminal or run: exec zsh"
  else
    echo "✗ zsh not found. Installing zsh..."
    # zsh should be available by default on macOS
    echo "This should not happen on macOS. Please check your system."
    exit 1
  fi
fi
```

## Phase 2: Homebrew Installation (Estimated: 5-10 minutes)

### 2.1 Install Homebrew with Error Handling
```bash
# Check if Homebrew is already installed
if command -v brew &> /dev/null; then
  echo "✓ Homebrew already installed: $(brew --version | head -n1)"
  echo "Homebrew path: $(which brew)"
  
  # Verify it's in the correct location
  if [[ $(which brew) == "$HOMEBREW_PREFIX/bin/brew" ]]; then
    echo "✓ Homebrew is in the correct location for $ARCH"
  else
    echo "⚠️  Warning: Homebrew is not in the expected location"
    echo "   Expected: $HOMEBREW_PREFIX/bin/brew"
    echo "   Actual: $(which brew)"
    echo "   This may cause issues with bottle support."
  fi
else
  echo "Installing Homebrew..."
  echo "This will install to: $HOMEBREW_PREFIX"
  
  # Install Homebrew
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  
  # Check if installation was successful
  if [ $? -eq 0 ]; then
    echo "✓ Homebrew installed successfully"
  else
    echo "✗ Homebrew installation failed"
    echo "Please check your internet connection and try again"
    echo "You can also try the manual installation from: https://brew.sh"
    exit 1
  fi
fi
```

### 2.2 Configure Homebrew Environment
```bash
# Add Homebrew to shell configuration
HOMEBREW_SHELLENV_CMD="eval \"\$($HOMEBREW_PREFIX/bin/brew shellenv)\""

# Check if already configured
if grep -q "brew shellenv" ~/.zprofile 2>/dev/null; then
  echo "✓ Homebrew shellenv already configured in ~/.zprofile"
else
  echo "Adding Homebrew to ~/.zprofile..."
  echo "$HOMEBREW_SHELLENV_CMD" >> ~/.zprofile
  echo "✓ Homebrew added to ~/.zprofile"
fi

# Also add to ~/.zshrc for immediate availability
if grep -q "brew shellenv" ~/.zshrc 2>/dev/null; then
  echo "✓ Homebrew shellenv already configured in ~/.zshrc"
else
  echo "Adding Homebrew to ~/.zshrc..."
  echo "$HOMEBREW_SHELLENV_CMD" >> ~/.zshrc
  echo "✓ Homebrew added to ~/.zshrc"
fi

# Reload shell configuration
source ~/.zprofile 2>/dev/null || true
source ~/.zshrc 2>/dev/null || true

# Verify installation
if command -v brew &> /dev/null; then
  echo "✓ Homebrew is now available: $(brew --version | head -n1)"
else
  echo "✗ Homebrew not found in PATH"
  echo "Please restart your terminal or run: source ~/.zshrc"
  exit 1
fi
```

### 2.3 Homebrew Maintenance Setup
```bash
# Run initial maintenance
echo "Updating Homebrew..."
if brew update; then
  echo "✓ Homebrew updated successfully"
else
  echo "⚠️  Homebrew update failed, but continuing..."
fi

echo "Running Homebrew doctor..."
if brew doctor; then
  echo "✓ Homebrew doctor passed - no issues found"
else
  echo "⚠️  Homebrew doctor found issues:"
  echo "Please review the output above and fix any issues"
  echo "Common fixes:"
  echo "  - Fix permissions: sudo chown -R $(whoami) $HOMEBREW_PREFIX"
  echo "  - Remove conflicting installations"
  echo "  - Update Xcode command line tools: xcode-select --install"
  
  read -p "Continue with setup? (y/N): " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Please fix Homebrew issues and run this script again"
    exit 1
  fi
fi
```

## Phase 3: Shell Configuration

### 3.1 Install Oh My Zsh
```bash
# Install Oh My Zsh framework
sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

# Follow prompts (press Enter for default options)
```

### 3.2 Install Powerlevel10k Theme
```bash
# Install Powerlevel10k theme
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k

# Edit ~/.zshrc to set theme
sed -i '' 's/ZSH_THEME="robbyrussell"/ZSH_THEME="powerlevel10k\/powerlevel10k"/' ~/.zshrc

# Reload shell
source ~/.zshrc
```

### 3.3 Configure Essential Zsh Plugins
```bash
# Edit ~/.zshrc to add plugins
cat >> ~/.zshrc << 'EOF'

# Essential plugins
plugins=(
  git
  zsh-autosuggestions
  zsh-syntax-highlighting
  brew
  macos
  node
  npm
  yarn
  docker
  docker-compose
)

EOF

# Install zsh-autosuggestions
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions

# Install zsh-syntax-highlighting
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting

# Reload shell
source ~/.zshrc
```

## Phase 4: Terminal Application Setup

### 4.1 Install iTerm2
```bash
# Install iTerm2
brew install --cask iterm2

# Open iTerm2 to complete setup
open -a iTerm2
```

### 4.2 Configure iTerm2 Settings
```bash
# Create iTerm2 configuration directory
mkdir -p ~/.config/iterm2

# Download and install color schemes
git clone https://github.com/mbadolato/iTerm2-Color-Schemes.git ~/iTerm2-Color-Schemes

# Note: Manual configuration required in iTerm2 preferences:
# 1. Open iTerm2 Preferences (Cmd+,)
# 2. Profiles > Keys > Key Mappings
# 3. Add Natural Text Editing mappings:
#    - Option+Left Arrow: Send Escape Sequence [1;5D
#    - Option+Right Arrow: Send Escape Sequence [1;5C
#    - Option+Delete: Send Escape Sequence [3;5~
```

## Phase 5: Cross-Platform Development Tools

### 5.1 Install GNU Tools
```bash
# Install GNU tools suite for cross-platform compatibility
brew install coreutils findutils gnu-sed grep gnu-tar gawk gnu-indent gnu-getopt

# Configure GNU tools as default (add to ~/.zshrc)
cat >> ~/.zshrc << 'EOF'

# GNU tools configuration for cross-platform compatibility
export PATH="/opt/homebrew/opt/coreutils/libexec/gnubin:$PATH"
export PATH="/opt/homebrew/opt/findutils/libexec/gnubin:$PATH"
export PATH="/opt/homebrew/opt/gnu-sed/libexec/gnubin:$PATH"
export PATH="/opt/homebrew/opt/grep/libexec/gnubin:$PATH"

EOF

# Reload shell
source ~/.zshrc

# Verify GNU tools are default
which sed grep find date
# Should show /opt/homebrew/opt/*/libexec/gnubin/ paths
```

### 5.2 Install Essential Development Tools
```bash
# Install Git (avoid Apple's bundled version)
brew install git

# Install Node.js via NVM (avoid Homebrew installation)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash

# Reload shell to activate NVM
source ~/.zshrc

# Install latest LTS Node.js
nvm install --lts
nvm use --lts
nvm alias default node

# Install package managers
npm install -g pnpm yarn

# Verify installations
node --version
npm --version
pnpm --version
yarn --version
```

## Phase 6: File Organization

### 6.1 Create Development Directory Structure
```bash
# Create development directories
mkdir -p ~/Developer/{projects,scripts,configs,tools}
mkdir -p ~/Developer/projects/{github,gitlab,bitbucket,local}
mkdir -p ~/.dotfiles/{zsh,git,cursor,iterm2}

# Create symbolic links for easy access
ln -sf ~/Developer ~/dev
ln -sf ~/Developer/projects ~/projects
```

### 6.2 Setup Dotfile Management
```bash
# Install GNU Stow for dotfile management
brew install stow

# Create dotfile structure
mkdir -p ~/.dotfiles/{zsh,git,cursor,iterm2}

# Move existing config files to dotfiles
mv ~/.zshrc ~/.dotfiles/zsh/
mv ~/.gitconfig ~/.dotfiles/git/ 2>/dev/null || true

# Create symlinks using stow
cd ~/.dotfiles
stow zsh git
```

## Phase 7: Performance Optimizations

### 7.1 Node.js Performance Optimization
```bash
# Create global .metadata_never_index for node_modules
echo 'touch ./.metadata_never_index' > ~/Developer/scripts/prevent-indexing.sh
chmod +x ~/Developer/scripts/prevent-indexing.sh

# Apply to existing node_modules directories
find ~/Developer -name "node_modules" -type d -exec touch "{}/.metadata_never_index" \; 2>/dev/null || true

# Create npm postinstall script template
cat > ~/Developer/scripts/npm-postinstall.js << 'EOF'
const fs = require('fs');
const path = require('path');

const nodeModulesPath = path.join(process.cwd(), 'node_modules');
if (fs.existsSync(nodeModulesPath)) {
  const metadataFile = path.join(nodeModulesPath, '.metadata_never_index');
  fs.writeFileSync(metadataFile, '');
  console.log('Created .metadata_never_index in node_modules');
}
EOF
```

### 7.2 System Performance Settings
```bash
# Create performance optimization script
cat > ~/Developer/scripts/optimize-macos.sh << 'EOF'
#!/bin/bash

echo "Optimizing macOS for development..."

# Enable Reduce Motion (requires manual System Settings)
echo "Please manually enable:"
echo "System Settings > Accessibility > Display > Reduce Motion"
echo "System Settings > Accessibility > Display > Reduce Transparency"

# Exclude development directories from Spotlight
sudo mdutil -i off ~/Developer 2>/dev/null || true
sudo mdutil -i off ~/node_modules 2>/dev/null || true

echo "Performance optimizations applied!"
EOF

chmod +x ~/Developer/scripts/optimize-macos.sh
```

## Phase 8: Security Configuration

### 8.1 Configure Development Permissions
```bash
# Create security configuration script
cat > ~/Developer/scripts/configure-security.sh << 'EOF'
#!/bin/bash

echo "Configuring macOS security for development..."

# Remove quarantine from common development tools
find /opt/homebrew/bin -name "*" -exec xattr -d com.apple.quarantine {} \; 2>/dev/null || true
find /usr/local/bin -name "*" -exec xattr -d com.apple.quarantine {} \; 2>/dev/null || true

echo "Security configuration complete!"
echo "Please manually configure:"
echo "System Settings > Privacy & Security > Full Disk Access"
echo "Add: Terminal, Cursor, VS Code, and other development tools"
EOF

chmod +x ~/Developer/scripts/configure-security.sh
```

## Phase 9: Model Context Protocol Integration

### 9.1 Install MCP Servers
```bash
# Install Node.js if not already installed
if ! command -v node &> /dev/null; then
  echo "Installing Node.js via NVM..."
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
  source ~/.zshrc
  nvm install --lts
  nvm use --lts
fi

# Install macOS-specific MCP servers
npx -y install-mcp apple-mcp --client claude
npx -y install-mcp xcode-build-mcp --client cursor
npx -y install-mcp app-opener --client cursor
npx -y install-mcp mac-monitor-mcp --client cursor

# Create MCP configuration directory
mkdir -p ~/.config/mcp
```

### 9.2 Configure MCP for Cursor
```bash
# Create Cursor MCP configuration
cat > ~/.config/mcp/cursor-config.json << 'EOF'
{
  "mcpServers": {
    "apple-mcp": {
      "command": "npx",
      "args": ["-y", "install-mcp", "apple-mcp", "--client", "cursor"]
    },
    "xcode-build-mcp": {
      "command": "npx", 
      "args": ["-y", "install-mcp", "xcode-build-mcp", "--client", "cursor"]
    },
    "app-opener": {
      "command": "npx",
      "args": ["-y", "install-mcp", "app-opener", "--client", "cursor"]
    }
  }
}
EOF
```

## Phase 10: Cursor IDE Configuration

### 10.1 Install Cursor IDE
```bash
# Download and install Cursor IDE
brew install --cask cursor

# Open Cursor to complete setup
open -a Cursor
```

### 10.2 Configure Cursor Settings
```bash
# Create Cursor configuration directory
mkdir -p ~/Library/Application\ Support/Cursor/User

# Create optimized Cursor settings
cat > ~/Library/Application\ Support/Cursor/User/settings.json << 'EOF'
{
  "editor.fontSize": 14,
  "editor.lineHeight": 2,
  "editor.fontFamily": "SF Mono, Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace",
  "editor.tabSize": 2,
  "editor.insertSpaces": true,
  "editor.wordWrap": "on",
  "editor.minimap.enabled": true,
  "editor.minimap.maxColumn": 120,
  "files.autoSave": "afterDelay",
  "files.autoSaveDelay": 1000,
  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true,
  "terminal.integrated.fontSize": 13,
  "terminal.integrated.lineHeight": 2,
  "terminal.integrated.fontFamily": "SF Mono, Monaco, 'Cascadia Code', monospace",
  "workbench.colorTheme": "Default Dark+",
  "workbench.iconTheme": "vs-seti",
  "git.enableSmartCommit": true,
  "git.confirmSync": false,
  "extensions.autoUpdate": true,
  "telemetry.telemetryLevel": "off"
}
EOF
```

### 10.3 Install Essential Extensions
```bash
# Create extension installation script
cat > ~/Developer/scripts/install-cursor-extensions.sh << 'EOF'
#!/bin/bash

echo "Installing essential Cursor extensions..."

# Essential extensions for development
extensions=(
  "eamodio.gitlens"
  "esbenp.prettier-vscode"
  "dbaeumer.vscode-eslint"
  "ms-python.python"
  "swift-server.swift"
  "ms-vscode.vscode-json"
  "bradlc.vscode-tailwindcss"
  "ms-vscode.vscode-typescript-next"
  "formulahendry.auto-rename-tag"
  "christian-kohler.path-intellisense"
)

for extension in "${extensions[@]}"; do
  echo "Installing $extension..."
  cursor --install-extension "$extension"
done

echo "Extension installation complete!"
EOF

chmod +x ~/Developer/scripts/install-cursor-extensions.sh
```

## Phase 11: Validation and Testing

### 11.1 Enhanced Environment Validation Script
```bash
# Create comprehensive validation script with progress tracking
cat > ~/Developer/scripts/validate-setup.sh << 'EOF'
#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Progress tracking
TOTAL_STEPS=10
CURRENT_STEP=0

update_progress() {
  local current=$1
  local total=$2
  local percent=$((current * 100 / total))
  local filled=$((percent / 5))
  local empty=$((20 - filled))
  
  printf "\r${BLUE}Progress: ["
  printf "%*s" $filled | tr ' ' '='
  printf "%*s" $empty | tr ' ' ' '
  printf "] %d%%${NC}" $percent
}

echo -e "${BLUE}=== macOS Tahoe Development Environment Validation ===${NC}"
echo ""

# System Information
((CURRENT_STEP++))
echo -e "\n${BLUE}[$CURRENT_STEP/$TOTAL_STEPS] System Information:${NC}"
echo "Architecture: $(uname -m)"
echo "macOS Version: $(sw_vers -productVersion)"
echo "Shell: $SHELL"
update_progress $CURRENT_STEP $TOTAL_STEPS

# Homebrew Validation
((CURRENT_STEP++))
echo -e "\n${BLUE}[$CURRENT_STEP/$TOTAL_STEPS] Homebrew Status:${NC}"
if command -v brew &> /dev/null; then
  echo -e "${GREEN}✓${NC} Homebrew installed: $(brew --version | head -n1)"
  echo -e "${GREEN}✓${NC} Homebrew path: $(which brew)"
else
  echo -e "${RED}✗${NC} Homebrew not found"
fi
update_progress $CURRENT_STEP $TOTAL_STEPS

# Development Tools Validation
((CURRENT_STEP++))
echo -e "\n${BLUE}[$CURRENT_STEP/$TOTAL_STEPS] Development Tools:${NC}"
tools=("git" "node" "npm" "pnpm" "yarn")
for tool in "${tools[@]}"; do
  if command -v "$tool" &> /dev/null; then
    echo -e "${GREEN}✓${NC} $tool: $($tool --version | head -n1)"
  else
    echo -e "${RED}✗${NC} $tool not found"
  fi
done
update_progress $CURRENT_STEP $TOTAL_STEPS

# GNU Tools Validation
((CURRENT_STEP++))
echo -e "\n${BLUE}[$CURRENT_STEP/$TOTAL_STEPS] GNU Tools:${NC}"
gnu_tools=("sed" "grep" "find" "date")
for tool in "${gnu_tools[@]}"; do
  if command -v "$tool" &> /dev/null; then
    if which "$tool" | grep -q "gnubin"; then
      echo -e "${GREEN}✓${NC} $tool: $(which $tool)"
    else
      echo -e "${YELLOW}⚠${NC} $tool: $(which $tool) (not GNU version)"
    fi
  else
    echo -e "${RED}✗${NC} $tool not found"
  fi
done
update_progress $CURRENT_STEP $TOTAL_STEPS

# Directory Structure Validation
((CURRENT_STEP++))
echo -e "\n${BLUE}[$CURRENT_STEP/$TOTAL_STEPS] Directory Structure:${NC}"
directories=("$HOME/Developer" "$HOME/.dotfiles" "$HOME/Developer/scripts")
for dir in "${directories[@]}"; do
  if [ -d "$dir" ]; then
    echo -e "${GREEN}✓${NC} $dir exists"
  else
    echo -e "${RED}✗${NC} $dir missing"
  fi
done
update_progress $CURRENT_STEP $TOTAL_STEPS

# Cursor IDE Validation
((CURRENT_STEP++))
echo -e "\n${BLUE}[$CURRENT_STEP/$TOTAL_STEPS] Cursor IDE:${NC}"
if [ -d "/Applications/Cursor.app" ]; then
  echo -e "${GREEN}✓${NC} Cursor IDE installed"
else
  echo -e "${RED}✗${NC} Cursor IDE not found"
fi
update_progress $CURRENT_STEP $TOTAL_STEPS

# Docker Validation
((CURRENT_STEP++))
echo -e "\n${BLUE}[$CURRENT_STEP/$TOTAL_STEPS] Docker:${NC}"
if command -v docker &> /dev/null; then
  if docker info &> /dev/null; then
    echo -e "${GREEN}✓${NC} Docker installed and running"
  else
    echo -e "${YELLOW}⚠${NC} Docker installed but not running"
  fi
else
  echo -e "${RED}✗${NC} Docker not found"
fi
update_progress $CURRENT_STEP $TOTAL_STEPS

# MCP Integration Validation
((CURRENT_STEP++))
echo -e "\n${BLUE}[$CURRENT_STEP/$TOTAL_STEPS] MCP Integration:${NC}"
if [ -f ~/.config/mcp/cursor-config.json ]; then
  echo -e "${GREEN}✓${NC} MCP configuration file exists"
else
  echo -e "${YELLOW}⚠${NC} MCP configuration file missing"
fi
update_progress $CURRENT_STEP $TOTAL_STEPS

# Security Configuration Validation
((CURRENT_STEP++))
echo -e "\n${BLUE}[$CURRENT_STEP/$TOTAL_STEPS] Security Configuration:${NC}"
if [ "$HOMEBREW_NO_ANALYTICS" = "1" ]; then
  echo -e "${GREEN}✓${NC} Homebrew analytics disabled"
else
  echo -e "${YELLOW}⚠${NC} Homebrew analytics enabled"
fi
update_progress $CURRENT_STEP $TOTAL_STEPS

# Performance Optimization Validation
((CURRENT_STEP++))
echo -e "\n${BLUE}[$CURRENT_STEP/$TOTAL_STEPS] Performance Optimizations:${NC}"
if find ~/Developer -name "node_modules" -type d -exec test -f "{}/.metadata_never_index" \; 2>/dev/null | head -1 | grep -q .; then
  echo -e "${GREEN}✓${NC} Some node_modules have .metadata_never_index"
else
  echo -e "${YELLOW}⚠${NC} No .metadata_never_index files found in node_modules"
fi
update_progress $CURRENT_STEP $TOTAL_STEPS

# Final Summary
echo -e "\n${BLUE}=== Validation Complete ===${NC}"
echo -e "${GREEN}✓${NC} = Working correctly"
echo -e "${YELLOW}⚠${NC} = Warning or manual configuration needed"
echo -e "${RED}✗${NC} = Issue found"

echo -e "\n${BLUE}Next Steps:${NC}"
echo "1. Fix any issues marked with ✗"
echo "2. Review warnings marked with ⚠"
echo "3. Run maintenance script: ~/Developer/scripts/maintenance.sh"
echo "4. Check quick reference: ~/Developer/QUICK_REFERENCE.md"
EOF

chmod +x ~/Developer/scripts/validate-setup.sh
```

### 11.2 Run Validation
```bash
# Execute validation script
~/Developer/scripts/validate-setup.sh
```

## Phase 12: Docker and Containerization Setup (Estimated: 10-15 minutes)

### 12.1 Install Docker Desktop
```bash
# Install Docker Desktop
echo "Installing Docker Desktop..."
if brew install --cask docker; then
  echo "✓ Docker Desktop installed successfully"
else
  echo "✗ Docker Desktop installation failed"
  echo "Please check your internet connection and try again"
  exit 1
fi

# Start Docker Desktop
echo "Starting Docker Desktop..."
open -a Docker

# Wait for Docker to start
echo "Waiting for Docker to start (this may take a few minutes)..."
DOCKER_START_TIMEOUT=120
DOCKER_START_COUNT=0

while ! docker info &> /dev/null; do
  sleep 2
  DOCKER_START_COUNT=$((DOCKER_START_COUNT + 2))
  echo -n "."
  
  if [ $DOCKER_START_COUNT -ge $DOCKER_START_TIMEOUT ]; then
    echo ""
    echo "⚠️  Docker took longer than expected to start"
    echo "Please check Docker Desktop manually and ensure it's running"
    break
  fi
done

if docker info &> /dev/null; then
  echo ""
  echo "✓ Docker is running"
  
  # Test Docker installation
  echo "Testing Docker installation..."
  if docker run --rm hello-world; then
    echo "✓ Docker test successful"
  else
    echo "⚠️  Docker test failed, but Docker appears to be running"
  fi
else
  echo ""
  echo "⚠️  Docker may not be running. Please start Docker Desktop manually."
fi
```

## Phase 13: Final Configuration

### 13.1 Create Development Workflow Scripts
```bash
# Create project initialization script
cat > ~/Developer/scripts/new-project.sh << 'EOF'
#!/bin/bash

if [ -z "$1" ]; then
  echo "Usage: new-project.sh <project-name>"
  exit 1
fi

PROJECT_NAME="$1"
PROJECT_PATH="$HOME/Developer/projects/local/$PROJECT_NAME"

echo "Creating new project: $PROJECT_NAME"
mkdir -p "$PROJECT_PATH"
cd "$PROJECT_PATH"

# Initialize git repository
git init

# Create basic project structure
mkdir -p src tests docs
touch README.md .gitignore

echo "Project created at: $PROJECT_PATH"
echo "Opening in Cursor..."
cursor .
EOF

chmod +x ~/Developer/scripts/new-project.sh

# Create maintenance script
cat > ~/Developer/scripts/maintenance.sh << 'EOF'
#!/bin/bash

echo "Running development environment maintenance..."

# Update Homebrew
echo "Updating Homebrew..."
brew update
brew upgrade
brew cleanup

# Update Node.js via NVM
echo "Updating Node.js..."
nvm install --lts
nvm use --lts

# Update global npm packages
echo "Updating global npm packages..."
npm update -g

# Run brew doctor
echo "Checking Homebrew health..."
brew doctor

echo "Maintenance complete!"
EOF

chmod +x ~/Developer/scripts/maintenance.sh
```

### 12.2 Create Rollback and Recovery Scripts
```bash
# Create rollback script
cat > ~/Developer/scripts/rollback-setup.sh << 'EOF'
#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Rollback Development Environment Setup ===${NC}"

# Find latest backup
LATEST_BACKUP=$(ls -t ~/.config-backup-* 2>/dev/null | head -n1)

if [ -z "$LATEST_BACKUP" ]; then
  echo -e "${RED}✗${NC} No backup found for rollback"
  echo "Available backups:"
  ls -la ~/.config-backup-* 2>/dev/null || echo "None found"
  exit 1
fi

echo -e "${YELLOW}Found backup: $LATEST_BACKUP${NC}"
echo "This will restore your configuration files to their previous state."
read -p "Continue with rollback? (y/N): " -n 1 -r
echo

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Rollback cancelled"
  exit 0
fi

echo "Restoring configurations from backup..."

# Restore configurations
if [ -f "$LATEST_BACKUP/.zshrc" ]; then
  cp "$LATEST_BACKUP/.zshrc" ~/
  echo -e "${GREEN}✓${NC} Restored .zshrc"
fi

if [ -f "$LATEST_BACKUP/.gitconfig" ]; then
  cp "$LATEST_BACKUP/.gitconfig" ~/
  echo -e "${GREEN}✓${NC} Restored .gitconfig"
fi

if [ -f "$LATEST_BACKUP/.zprofile" ]; then
  cp "$LATEST_BACKUP/.zprofile" ~/
  echo -e "${GREEN}✓${NC} Restored .zprofile"
fi

if [ -f "$LATEST_BACKUP/.bash_profile" ]; then
  cp "$LATEST_BACKUP/.bash_profile" ~/
  echo -e "${GREEN}✓${NC} Restored .bash_profile"
fi

if [ -f "$LATEST_BACKUP/.bashrc" ]; then
  cp "$LATEST_BACKUP/.bashrc" ~/
  echo -e "${GREEN}✓${NC} Restored .bashrc"
fi

echo -e "${GREEN}✓${NC} Configuration restored from backup"
echo -e "${YELLOW}⚠${NC} Please restart your terminal or run: source ~/.zshrc"
EOF

chmod +x ~/Developer/scripts/rollback-setup.sh

# Create recovery script for common issues
cat > ~/Developer/scripts/recovery.sh << 'EOF'
#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Development Environment Recovery Tool ===${NC}"
echo "This script helps recover from common setup issues."
echo ""

# Function to fix Homebrew permissions
fix_homebrew_permissions() {
  echo -e "${YELLOW}Fixing Homebrew permissions...${NC}"
  
  if [[ $(uname -m) == "arm64" ]]; then
    sudo chown -R $(whoami) /opt/homebrew
    echo -e "${GREEN}✓${NC} Fixed permissions for Apple Silicon Homebrew"
  else
    sudo chown -R $(whoami) /usr/local
    echo -e "${GREEN}✓${NC} Fixed permissions for Intel Homebrew"
  fi
}

# Function to fix shell configuration
fix_shell_config() {
  echo -e "${YELLOW}Fixing shell configuration...${NC}"
  
  # Detect architecture
  if [[ $(uname -m) == "arm64" ]]; then
    HOMEBREW_PREFIX="/opt/homebrew"
  else
    HOMEBREW_PREFIX="/usr/local"
  fi
  
  # Add Homebrew to shell config
  HOMEBREW_CMD="eval \"\$($HOMEBREW_PREFIX/bin/brew shellenv)\""
  
  if ! grep -q "brew shellenv" ~/.zshrc 2>/dev/null; then
    echo "$HOMEBREW_CMD" >> ~/.zshrc
    echo -e "${GREEN}✓${NC} Added Homebrew to ~/.zshrc"
  fi
  
  if ! grep -q "brew shellenv" ~/.zprofile 2>/dev/null; then
    echo "$HOMEBREW_CMD" >> ~/.zprofile
    echo -e "${GREEN}✓${NC} Added Homebrew to ~/.zprofile"
  fi
}

# Function to fix NVM
fix_nvm() {
  echo -e "${YELLOW}Fixing NVM configuration...${NC}"
  
  NVM_CONFIG='export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"'
  
  if ! grep -q "NVM_DIR" ~/.zshrc 2>/dev/null; then
    echo "$NVM_CONFIG" >> ~/.zshrc
    echo -e "${GREEN}✓${NC} Added NVM configuration to ~/.zshrc"
  fi
}

# Function to fix GNU tools
fix_gnu_tools() {
  echo -e "${YELLOW}Fixing GNU tools configuration...${NC}"
  
  if [[ $(uname -m) == "arm64" ]]; then
    HOMEBREW_PREFIX="/opt/homebrew"
  else
    HOMEBREW_PREFIX="/usr/local"
  fi
  
  GNU_CONFIG="
# GNU tools configuration for cross-platform compatibility
export PATH=\"$HOMEBREW_PREFIX/opt/coreutils/libexec/gnubin:\$PATH\"
export PATH=\"$HOMEBREW_PREFIX/opt/findutils/libexec/gnubin:\$PATH\"
export PATH=\"$HOMEBREW_PREFIX/opt/gnu-sed/libexec/gnubin:\$PATH\"
export PATH=\"$HOMEBREW_PREFIX/opt/grep/libexec/gnubin:\$PATH\""
  
  if ! grep -q "gnubin" ~/.zshrc 2>/dev/null; then
    echo "$GNU_CONFIG" >> ~/.zshrc
    echo -e "${GREEN}✓${NC} Added GNU tools configuration to ~/.zshrc"
  fi
}

# Main menu
echo "Select recovery option:"
echo "1) Fix Homebrew permissions"
echo "2) Fix shell configuration"
echo "3) Fix NVM configuration"
echo "4) Fix GNU tools configuration"
echo "5) Fix all issues"
echo "6) Exit"

read -p "Enter your choice (1-6): " choice

case $choice in
  1) fix_homebrew_permissions ;;
  2) fix_shell_config ;;
  3) fix_nvm ;;
  4) fix_gnu_tools ;;
  5) 
    fix_homebrew_permissions
    fix_shell_config
    fix_nvm
    fix_gnu_tools
    ;;
  6) echo "Exiting..." && exit 0 ;;
  *) echo -e "${RED}Invalid choice${NC}" && exit 1 ;;
esac

echo -e "${GREEN}✓${NC} Recovery complete!"
echo -e "${YELLOW}⚠${NC} Please restart your terminal or run: source ~/.zshrc"
EOF

chmod +x ~/Developer/scripts/recovery.sh
```

### 12.3 Create Quick Reference
```bash
# Create comprehensive quick reference guide
cat > ~/Developer/QUICK_REFERENCE.md << 'EOF'
# macOS Tahoe Development Environment - Quick Reference

## Essential Commands
- `new-project.sh <name>` - Create new development project
- `maintenance.sh` - Run environment maintenance
- `validate-setup.sh` - Validate environment configuration
- `rollback-setup.sh` - Rollback to previous configuration
- `recovery.sh` - Fix common setup issues

## Key Directories
- `~/Developer/` - Main development directory
- `~/Developer/projects/` - All project repositories
- `~/.dotfiles/` - Configuration files
- `~/Developer/scripts/` - Utility scripts
- `~/.config-backup-*/` - Configuration backups

## Performance Tips
- Use pnpm instead of npm for 70% less disk usage
- node_modules directories have .metadata_never_index files
- GNU tools are configured as default for cross-platform compatibility
- Enable Reduce Motion and Reduce Transparency in System Settings

## MCP Integration
- Apple MCP: Native macOS application control
- XcodeBuildMCP: iOS development in Cursor
- App Opener: Launch applications via natural language
- GitHub MCP: Enhanced GitHub workflow automation
- Docker MCP: Container management and orchestration

## Docker Development
- `docker-compose -f ~/Developer/docker/docker-compose.dev.yml up` - Start development services
- `docker-compose -f ~/Developer/docker/docker-compose.dev.yml down` - Stop development services
- `docker system prune` - Clean up unused Docker resources

## Cross-Platform Development
- `asdf list` - Show installed language versions
- `asdf install <language> latest` - Install latest version
- `asdf global <language> <version>` - Set global version
- `direnv allow` - Allow direnv in current directory

## Troubleshooting
- Run `brew doctor` for Homebrew issues
- Check `validate-setup.sh` for environment problems
- Use `maintenance.sh` for regular updates
- Use `recovery.sh` for common fixes
- Use `rollback-setup.sh` to restore previous configuration

## Security Configuration
- Grant Full Disk Access to Terminal, Cursor, VS Code, Docker Desktop
- Configure Git credential helper: `git config --global credential.helper osxkeychain`
- Disable Homebrew analytics: `export HOMEBREW_NO_ANALYTICS=1`

## Backup and Recovery
- Automatic backups created in `~/.config-backup-YYYYMMDD-HHMMSS/`
- Use `rollback-setup.sh` to restore from backup
- Use `recovery.sh` to fix common issues without full rollback
EOF
```

## Execution Summary

This enhanced template provides a complete, automated setup process for configuring a professional macOS Tahoe development environment optimized for Cursor IDE. The setup includes:

### Core Setup (Phases 1-11)
1. **System Assessment** - Architecture detection, shell verification, and automatic backups
2. **Homebrew Installation** - Architecture-specific package management with error handling
3. **Shell Configuration** - Zsh with Oh My Zsh and Powerlevel10k
4. **Terminal Setup** - iTerm2 with optimal configurations
5. **Cross-Platform Tools** - GNU tools for Linux compatibility
6. **Development Tools** - Git, Node.js, package managers
7. **File Organization** - Structured development directories with dotfile management
8. **Performance Optimization** - Node.js and system optimizations
9. **Security Configuration** - Development-friendly permissions
10. **MCP Integration** - AI-enhanced development capabilities
11. **Cursor Configuration** - Optimized IDE settings with extensions

### Enhanced Features (Phases 12-13)
12. **Docker Integration** - Container development with Docker Desktop
13. **Cross-Platform Development** - Universal version management with asdf and direnv

### Advanced Features
- **Enhanced Validation** - Comprehensive environment testing with progress tracking
- **Rollback & Recovery** - Automatic backups and recovery tools for common issues
- **Error Handling** - Robust error handling throughout all phases
- **Progress Tracking** - Visual progress indicators and time estimates
- **Interactive Configuration** - User prompts for customization options

### Key Improvements
- **Backup System**: Automatic configuration backups before changes
- **Error Recovery**: Comprehensive error handling and recovery scripts
- **Progress Tracking**: Visual progress bars and time estimates
- **Enhanced Validation**: Color-coded validation with detailed reporting
- **Rollback Capability**: Easy restoration of previous configurations
- **Docker Support**: Complete container development environment
- **Cross-Platform Tools**: Universal version management and environment configuration

The setup follows Apple's best practices and leverages macOS Tahoe's enhanced performance optimizations and emerging AI integration capabilities through Model Context Protocol servers.

## Notes for AI Agent
- Execute commands in sequence as presented
- Follow any manual configuration steps noted
- Run validation scripts to verify successful setup
- Use the maintenance script for regular environment updates
- Use recovery scripts for common issues
- Use rollback script if setup fails
- Refer to QUICK_REFERENCE.md for daily usage guidance
- Check backup directories for configuration history
