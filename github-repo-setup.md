# GitHub Repository Setup for Apps Script Project

## Repository Structure
```
apps-script-project/
├── .github/
│   └── workflows/
│       └── deploy-apps-script.yml
├── src/
│   ├── Code.gs
│   ├── appsscript.json
│   └── (other .gs files)
├── .clasprc.json
├── .clasp.json
├── README.md
└── package.json
```

## Files to Create

### 1. Create `.clasprc.json` (Authentication)
```json
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
```

### 2. Create `.clasp.json` (Project Config)
```json
{
  "scriptId": "13k7BOpOU3Pt3xCPi3rAldNS4orCq00pfb1TWg6h57ChFunyktDHj9hTh",
  "rootDir": "./src"
}
```

### 3. Create `package.json`
```json
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
```

### 4. Create `README.md`
```markdown
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
```

### 5. Create GitHub Actions Workflow `.github/workflows/deploy-apps-script.yml`
```yaml
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
```

## GitHub Repository Setup Commands

### Create new repository:
```bash
# Create new directory
mkdir apps-script-project
cd apps-script-project

# Initialize git
git init

# Create all the files above
# (Copy and paste the content for each file)

# Add to git
git add .

# Commit
git commit -m "Initial Apps Script project setup"

# Add remote (replace with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/apps-script-project.git

# Push to GitHub
git push -u origin main
```

## GitHub Secrets to Add

In your GitHub repository settings, add these secrets:

1. `CLASP_TOKEN` - The contents of your `.clasprc.json` file
2. `GOOGLE_CLIENT_SECRET` - Your OAuth client secret (if you have it)

## Next Steps

1. Create the GitHub repository using the commands above
2. Copy your Apps Script source code into the `src/` directory
3. Update the `.clasprc.json` with your actual access token when you get it
4. Push to GitHub and the Actions will handle deployment