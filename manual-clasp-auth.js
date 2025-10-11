#!/usr/bin/env node

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

async function manualClaspAuth() {
  console.log('🔧 Manual clasp authentication setup...');
  
  // Create a custom .clasprc.json file with valid scopes
  const claspConfig = {
    "token": {
      "access_token": "PLACEHOLDER",
      "refresh_token": "PLACEHOLDER",
      "scope": "https://www.googleapis.com/auth/script.deployments https://www.googleapis.com/auth/script.projects https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/service.management https://www.googleapis.com/auth/logging.read https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/cloud-platform",
      "token_type": "Bearer",
      "expiry_date": Date.now() + 3600000
    },
    "oauth2ClientSettings": {
      "clientId": "1072944905499-vm2v2i5dvn0a0d2o4ca36i1vge8cvbn0.apps.googleusercontent.com",
      "clientSecret": "PLACEHOLDER",
      "redirectUri": "http://localhost"
    },
    "isLocalCreds": false
  };

  console.log('📋 MANUAL AUTHENTICATION SETUP');
  console.log('===============================');
  console.log('Since clasp has scope issues, let\'s try a different approach:');
  console.log('');
  console.log('1. Go to: https://script.google.com/');
  console.log('2. Open your Apps Script project (ID: 13k7BOpOU3Pt3xCPi3rAldNS4orCq00pfb1TWg6h57ChFunyktDHj9hTh)');
  console.log('3. Go to File > Download > Download as ZIP');
  console.log('4. Upload the ZIP file here, and I\'ll extract it');
  console.log('');
  console.log('OR');
  console.log('');
  console.log('5. Copy the source code from your Apps Script editor');
  console.log('6. Paste it here and I\'ll save it as files');
  console.log('');
  console.log('Which option would you prefer?');
  console.log('');

  // Also try to use the Google Apps Script API directly
  console.log('🔧 ALTERNATIVE: Trying direct API approach...');
  
  // Create a simple script to try accessing the Apps Script via API
  const apiScript = `
import { google } from 'googleapis';

async function getAppsScript() {
  try {
    const auth = new google.auth.GoogleAuth({
      scopes: [
        'https://www.googleapis.com/auth/script.projects',
        'https://www.googleapis.com/auth/drive.file'
      ]
    });
    
    const authClient = await auth.getClient();
    const script = google.script({ version: 'v1', auth: authClient });
    
    const response = await script.projects.get({
      scriptId: '13k7BOpOU3Pt3xCPi3rAldNS4orCq00pfb1TWg6h57ChFunyktDHj9hTh'
    });
    
    console.log('Script content:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

getAppsScript();
`;

  fs.writeFileSync('/workspace/api-script.js', apiScript);
  
  console.log('📁 Created API script at /workspace/api-script.js');
  console.log('🔧 Installing required packages...');
  
  // Install googleapis
  const installProcess = spawn('npm', ['install', 'googleapis'], {
    stdio: 'inherit',
    shell: true
  });
  
  installProcess.on('close', (code) => {
    if (code === 0) {
      console.log('✅ Google APIs package installed');
      console.log('🚀 Now you can:');
      console.log('1. Provide your Apps Script source code directly');
      console.log('2. Or upload the ZIP file from Google Apps Script');
      console.log('3. Or try the API approach (requires authentication)');
    } else {
      console.log('❌ Failed to install Google APIs package');
    }
  });
}

manualClaspAuth().catch(console.error);