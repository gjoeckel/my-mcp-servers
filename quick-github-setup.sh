#!/bin/bash

# Quick GitHub Repository Setup Script
# Run this to create a new GitHub repository with your Apps Script project

echo "🚀 Setting up GitHub repository for Apps Script project..."

# Create project directory
mkdir -p apps-script-project
cd apps-script-project

echo "📁 Created project directory"

# Initialize git
git init

echo "🔧 Initialized git repository"

# Create .clasprc.json with your authentication
cat > .clasprc.json << 'EOF'
{
  "token": {
    "access_token": "PLACEHOLDER_ACCESS_TOKEN",
    "refresh_token": "4/0AVGzR1A_bmYCt5kQMrWLX-yr6TCGWDmNQRcP-sBe0X464MPz59lRgkOaad2f2xkFXxkH3g",
    "scope": "https://www.googleapis.com/auth/script.deployments https://www.googleapis.com/auth/script.projects https://www.googleapis.com/auth/script.webapp.deploy https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/service.management https://www.googleapis.com/auth/logging.read https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/cloud-platform",
    "token_type": "Bearer",
    "expiry_date": 1728600000000
  },
  "oauth2ClientSettings": {
    "clientId": "1072944905499-vm2v2i5dvn0a0d2o4ca36i1vge8cvbn0.apps.googleusercontent.com",
    "clientSecret": "GOCSPX-PLACEHOLDER_CLIENT_SECRET",
    "redirectUri": "http://localhost:34145"
  },
  "isLocalCreds": false
}
EOF

echo "🔑 Created .clasprc.json with your authentication code"

# Create .clasp.json
cat > .clasp.json << 'EOF'
{
  "scriptId": "13k7BOpOU3Pt3xCPi3rAldNS4orCq00pfb1TWg6h57ChFunyktDHj9hTh",
  "rootDir": "./src"
}
EOF

echo "⚙️ Created .clasp.json configuration"

# Create package.json
cat > package.json << 'EOF'
{
  "name": "apps-script-project",
  "version": "1.0.0",
  "description": "Google Apps Script project with clasp integration",
  "main": "src/Code.gs",
  "scripts": {
    "login": "clasp login",
    "clone": "clasp clone 13k7BOpOU3Pt3xCPi3rAldNS4orCq00pfb1TWg6h57ChFunyktDHj9hTh",
    "push": "clasp push",
    "pull": "clasp pull",
    "deploy": "clasp deploy",
    "open": "clasp open"
  },
  "keywords": ["google-apps-script", "clasp", "automation"],
  "author": "g.joeckel@usu.edu",
  "license": "MIT",
  "devDependencies": {
    "@google/clasp": "^3.0.6"
  }
}
EOF

echo "📦 Created package.json"

# Create src directory
mkdir -p src

# Create placeholder files
cat > src/Code.gs << 'EOF'
// Main Apps Script code will go here
// Copy your Apps Script source code into this file

function myFunction() {
  console.log('Hello from Apps Script!');
}
EOF

cat > src/appsscript.json << 'EOF'
{
  "timeZone": "America/Denver",
  "dependencies": {
    "enabledAdvancedServices": []
  },
  "exceptionLogging": "STACKDRIVER",
  "runtimeVersion": "V8"
}
EOF

echo "📁 Created src directory with placeholder files"

# Create README.md
cat > README.md << 'EOF'
# Apps Script Project

Google Apps Script project with clasp integration for version control and deployment.

## Setup

1. Install clasp globally:
   ```bash
   npm install -g @google/clasp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Login to Google (if needed):
   ```bash
   npm run login
   ```

## Available Scripts

- `npm run clone` - Clone the Apps Script project
- `npm run push` - Push changes to Apps Script
- `npm run pull` - Pull changes from Apps Script
- `npm run deploy` - Deploy the script
- `npm run open` - Open in Apps Script editor

## Project Structure

- `src/` - Source files for the Apps Script project
- `.clasprc.json` - Authentication configuration
- `.clasp.json` - Project configuration

## Authentication

The project includes authentication tokens for automated deployment. Make sure to keep these secure and don't commit sensitive credentials to public repositories.

## Apps Script ID

Your Apps Script ID: `13k7BOpOU3Pt3xCPi3rAldNS4orCq00pfb1TWg6h57ChFunyktDHj9hTh`

Direct link: https://script.google.com/d/13k7BOpOU3Pt3xCPi3rAldNS4orCq00pfb1TWg6h57ChFunyktDHj9hTh/edit
EOF

echo "📖 Created README.md"

# Create GitHub Actions workflow
mkdir -p .github/workflows
cat > .github/workflows/deploy-apps-script.yml << 'EOF'
name: Deploy Apps Script

on:
  push:
    branches: [ main ]
    paths: [ 'src/**' ]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install clasp
      run: npm install -g @google/clasp
      
    - name: Setup clasp authentication
      run: |
        echo '${{ secrets.CLASP_TOKEN }}' > ~/.clasprc.json
        
    - name: Deploy to Apps Script
      run: |
        clasp push
        clasp deploy
EOF

echo "🔄 Created GitHub Actions workflow"

# Add all files to git
git add .

# Commit
git commit -m "Initial Apps Script project setup with authentication"

echo "✅ Git repository initialized and committed"

echo ""
echo "🎉 Repository setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Create a new repository on GitHub"
echo "2. Add the remote origin:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/apps-script-project.git"
echo "3. Push to GitHub:"
echo "   git push -u origin main"
echo ""
echo "🔑 Your authentication code is already included in .clasprc.json"
echo "📁 Copy your Apps Script source code into the src/ directory"
echo "🚀 The GitHub Actions will handle deployment automatically"
echo ""
echo "📂 Current directory structure:"
ls -la