#!/usr/bin/env node

import fs from 'fs';
import { spawn } from 'child_process';

async function manualCodeExtractor() {
  console.log('📝 Manual Apps Script Code Extractor');
  console.log('=====================================');
  
  console.log('\n🔗 Your Apps Script URL:');
  console.log('https://script.google.com/d/13k7BOpOU3Pt3xCPi3rAldNS4orCq00pfb1TWg6h57ChFunyktDHj9hTh/edit');
  
  console.log('\n📋 INSTRUCTIONS:');
  console.log('1. Open the URL above in your browser');
  console.log('2. Sign in with your Google account');
  console.log('3. Look at the left sidebar - you should see your files');
  console.log('4. For each file:');
  console.log('   - Click on the filename');
  console.log('   - Select all code (Ctrl+A)');
  console.log('   - Copy (Ctrl+C)');
  console.log('   - Tell me the filename and paste the code here');
  
  console.log('\n📁 Common file types you might see:');
  console.log('- Code.gs (main JavaScript file)');
  console.log('- appsscript.json (project manifest)');
  console.log('- HTML.html (HTML files)');
  console.log('- Other .gs files (additional JavaScript)');
  
  console.log('\n⏳ Waiting for you to provide the code...');
  console.log('💡 Format: "FILENAME: [paste your code here]"');
  console.log('   Example: "Code.gs: function myFunction() { ... }"');
  
  // Set up input handling
  process.stdin.setEncoding('utf8');
  let currentFile = null;
  let currentCode = '';
  
  process.stdin.on('data', (data) => {
    const input = data.toString().trim();
    
    if (input.includes(':')) {
      // Save previous file if exists
      if (currentFile && currentCode) {
        saveFile(currentFile, currentCode);
      }
      
      // Parse new file
      const parts = input.split(':');
      currentFile = parts[0].trim();
      currentCode = parts.slice(1).join(':').trim();
      
      console.log(`📝 Processing file: ${currentFile}`);
      console.log(`📄 Code length: ${currentCode.length} characters`);
      
      if (currentCode.length > 0) {
        saveFile(currentFile, currentCode);
        currentFile = null;
        currentCode = '';
      }
    } else if (currentFile) {
      // Continue adding to current file
      currentCode += '\n' + input;
    } else {
      console.log('❌ Please provide filename and code in format: "FILENAME: code here"');
    }
  });
  
  function saveFile(filename, code) {
    try {
      // Ensure src directory exists
      if (!fs.existsSync('/workspace/apps-script-project/src')) {
        fs.mkdirSync('/workspace/apps-script-project/src', { recursive: true });
      }
      
      // Save the file
      const filePath = `/workspace/apps-script-project/src/${filename}`;
      fs.writeFileSync(filePath, code);
      
      console.log(`✅ Saved: ${filename} (${code.length} characters)`);
      console.log(`📁 Location: ${filePath}`);
      
      // Show preview
      const preview = code.substring(0, 200);
      console.log(`📄 Preview: ${preview}${code.length > 200 ? '...' : ''}`);
      console.log('');
      
    } catch (error) {
      console.error(`❌ Error saving ${filename}:`, error.message);
    }
  }
  
  // Handle process exit
  process.on('SIGINT', () => {
    if (currentFile && currentCode) {
      saveFile(currentFile, currentCode);
    }
    console.log('\n👋 Goodbye!');
    process.exit(0);
  });
}

// Also create a helper script for GitHub setup
function createGitHubSetupScript() {
  const setupScript = `#!/bin/bash

echo "🚀 Setting up GitHub repository for Apps Script..."

# Navigate to project directory
cd /workspace/apps-script-project

# Check git status
echo "📊 Current git status:"
git status

# Add all files
echo "📁 Adding files to git..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "Add Apps Script source code and configuration"

# Show current branch
echo "🌿 Current branch:"
git branch

# Instructions for pushing
echo ""
echo "📋 Next steps:"
echo "1. Create a new repository on GitHub"
echo "2. Add the remote origin:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/apps-script-project.git"
echo "3. Push to GitHub:"
echo "   git push -u origin main"
echo ""
echo "🔑 Don't forget to add GitHub secrets:"
echo "- CLASP_TOKEN: Contents of .clasprc.json"
echo "- GOOGLE_CLIENT_SECRET: Your OAuth client secret"
`;

  fs.writeFileSync('/workspace/setup-github.sh', setupScript);
  console.log('📁 Created GitHub setup script: /workspace/setup-github.sh');
}

manualCodeExtractor();
createGitHubSetupScript();