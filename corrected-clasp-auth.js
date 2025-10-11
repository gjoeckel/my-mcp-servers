#!/usr/bin/env node

import { spawn } from 'child_process';

async function correctedClaspAuth() {
  console.log('🔧 Corrected clasp authentication with proper scopes...');
  
  // The corrected scopes with proper /auth/ paths
  const validScopes = [
    'https://www.googleapis.com/auth/script.deployments',
    'https://www.googleapis.com/auth/script.projects',
    'https://www.googleapis.com/auth/script.webapp.deploy', // Fixed: added /auth/
    'https://www.googleapis.com/auth/drive.metadata.readonly',
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/service.management',
    'https://www.googleapis.com/auth/logging.read',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/cloud-platform'
  ];

  const scopeString = validScopes.join(' ');
  const clientId = '1072944905499-vm2v2i5dvn0a0d2o4ca36i1vge8cvbn0.apps.googleusercontent.com';
  const redirectUri = 'http://localhost:34145';
  
  const correctedUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `access_type=offline&` +
    `scope=${encodeURIComponent(scopeString)}&` +
    `response_type=code&` +
    `client_id=${clientId}`;

  console.log('\n🔗 CORRECTED AUTHENTICATION URL (with proper /auth/ paths):');
  console.log('==========================================================');
  console.log(correctedUrl);
  console.log('==========================================================');
  
  console.log('\n📋 INSTRUCTIONS:');
  console.log('1. Copy the corrected URL above');
  console.log('2. Open it in your browser');
  console.log('3. Complete the Google authentication');
  console.log('4. You should be redirected to a localhost URL with a code');
  console.log('5. Copy the entire redirected URL and paste it here');
  console.log('');
  console.log('⏳ Waiting for you to complete authentication...');
  console.log('📝 After completing auth, paste the redirected URL here:');
  
  // Wait for user input
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', async (data) => {
    const redirectedUrl = data.toString().trim();
    console.log('📥 Received URL:', redirectedUrl);
    
    // Extract the code from the URL
    try {
      const url = new URL(redirectedUrl);
      const code = url.searchParams.get('code');
      
      if (code) {
        console.log('🔑 Extracted auth code:', code);
        console.log('✅ Authentication code received!');
        console.log('🔄 Now trying to complete clasp authentication...');
        
        // Try to complete the authentication by creating a .clasprc.json file
        const claspConfig = {
          "token": {
            "access_token": "PLACEHOLDER_ACCESS_TOKEN",
            "refresh_token": "PLACEHOLDER_REFRESH_TOKEN", 
            "scope": scopeString,
            "token_type": "Bearer",
            "expiry_date": Date.now() + 3600000
          },
          "oauth2ClientSettings": {
            "clientId": clientId,
            "clientSecret": "PLACEHOLDER_CLIENT_SECRET",
            "redirectUri": redirectUri
          },
          "isLocalCreds": false
        };
        
        console.log('📁 Creating temporary clasp config...');
        const fs = await import('fs');
        fs.writeFileSync('/workspace/.clasprc.json', JSON.stringify(claspConfig, null, 2));
        
        console.log('🚀 Now trying to clone your Apps Script...');
        
        // Try to clone the script
        const cloneProcess = spawn('clasp', ['clone', '13k7BOpOU3Pt3xCPi3rAldNS4orCq00pfb1TWg6h57ChFunyktDHj9hTh'], {
          stdio: 'inherit',
          shell: true,
          env: { 
            ...process.env, 
            PATH: process.env.PATH + ':' + process.env.HOME + '/google-cloud-sdk/bin'
          }
        });
        
        cloneProcess.on('close', (cloneCode) => {
          console.log(`📊 Clone process exited with code: ${cloneCode}`);
          if (cloneCode === 0) {
            console.log('🎉 Apps Script cloned successfully!');
            console.log('📁 Check the current directory for your script files');
            
            // List the files that were cloned
            const { exec } = require('child_process');
            exec('ls -la', (error, stdout, stderr) => {
              if (stdout) {
                console.log('📂 Files in current directory:');
                console.log(stdout);
              }
            });
          } else {
            console.log('❌ Failed to clone Apps Script');
            console.log('💡 Let\'s try the manual approach instead...');
            console.log('📋 Please copy your Apps Script source code and paste it here');
          }
          process.exit(0);
        });
        
      } else {
        console.log('❌ Could not extract auth code from URL');
        console.log('🔍 URL structure:', redirectedUrl);
        console.log('💡 Please make sure you copied the complete redirected URL');
      }
    } catch (error) {
      console.error('❌ Error parsing URL:', error.message);
      console.log('💡 Please make sure you copied the complete redirected URL');
    }
  });
}

correctedClaspAuth().catch(console.error);