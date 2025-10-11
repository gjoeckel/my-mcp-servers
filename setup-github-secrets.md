# GitHub Secrets Setup for Apps Script Project

## 🔑 GitHub Secrets to Add

Go to your GitHub repository settings and add these secrets:

### 1. CLASP_TOKEN
**Value:** The contents of your `.clasprc.json` file
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

### 2. GOOGLE_CLIENT_SECRET (Optional)
**Value:** Your OAuth client secret (if you have it)
```
GOCSPX-your-actual-client-secret
```

## 📋 Steps to Add Secrets:

1. **Go to your GitHub repository**
2. **Click on "Settings" tab**
3. **Click on "Secrets and variables" → "Actions"**
4. **Click "New repository secret"**
5. **Add each secret above**

## 🚀 Alternative: Manual Code Extraction

Since Puppeteer needs authentication, here's a manual approach:

### Step 1: Extract Your Apps Script Code
1. Go to: https://script.google.com/d/13k7BOpOU3Pt3xCPi3rAldNS4orCq00pfb1TWg6h57ChFunyktDHj9hTh/edit
2. Sign in with your Google account
3. Look at the left sidebar for your files
4. For each file:
   - Click on the filename
   - Select all code (Ctrl+A)
   - Copy (Ctrl+C)
   - Tell me the filename and paste the code here

### Step 2: I'll Save the Code
Once you provide the code, I'll:
- Save it to the correct files in `src/` directory
- Update the GitHub repository
- Set up the deployment pipeline

## 🔧 Quick Setup Commands

```bash
# Navigate to your project
cd /workspace/apps-script-project

# Check current status
git status

# Add any new files
git add .

# Commit changes
git commit -m "Add Apps Script source code"

# Push to GitHub
git push origin main
```

## 📁 Current Project Structure
```
apps-script-project/
├── .clasprc.json          # Your authentication
├── .clasp.json            # Project config
├── package.json           # NPM scripts
├── README.md              # Documentation
├── .github/workflows/     # GitHub Actions
└── src/                   # Your Apps Script files
    ├── Code.gs           # Main code file
    └── appsscript.json   # Project manifest
```

## 🎯 Next Steps
1. Add the GitHub secrets above
2. Provide your Apps Script source code
3. I'll complete the setup and deployment