#!/bin/bash

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
