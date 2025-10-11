#!/usr/bin/env node

import { spawn } from 'child_process';
import fs from 'fs';

async function setupClaspWithCode() {
  console.log('🔧 Setting up clasp with authentication code...');
  
  // Create a proper .clasprc.json file
  const claspConfig = {
    "token": {
      "access_token": "ya29.a0AfH6SMC...", // This would need to be the actual access token
      "refresh_token": "1//0AVGzR1A_bmYCt5kQMrWLX-yr6TCGWDmNQRcP-sBe0X464MPz59lRgkOaad2f2xkFXxkH3g",
      "scope": "https://www.googleapis.com/auth/script.deployments https://www.googleapis.com/auth/script.projects https://www.googleapis.com/auth/script.webapp.deploy https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/service.management https://www.googleapis.com/auth/logging.read https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/cloud-platform",
      "token_type": "Bearer",
      "expiry_date": Date.now() + 3600000
    },
    "oauth2ClientSettings": {
      "clientId": "1072944905499-vm2v2i5dvn0a0d2o4ca36i1vge8cvbn0.apps.googleusercontent.com",
      "clientSecret": "GOCSPX-your-client-secret",
      "redirectUri": "http://localhost:34145"
    },
    "isLocalCreds": false
  };

  console.log('📁 Creating .clasprc.json file...');
  fs.writeFileSync('/workspace/.clasprc.json', JSON.stringify(claspConfig, null, 2));
  
  console.log('🔑 Auth code received:', '4/0AVGzR1A_bmYCt5kQMrWLX-yr6TCGWDmNQRcP-sBe0X464MPz59lRgkOaad2f2xkFXxkH3g');
  
  console.log('\n💡 Since we need the OAuth client secret and access token, let\'s try the manual approach:');
  console.log('');
  console.log('📋 MANUAL APPS SCRIPT DOWNLOAD:');
  console.log('===============================');
  console.log('1. Go to: https://script.google.com/');
  console.log('2. Open your Apps Script project (ID: 13k7BOpOU3Pt3xCPi3rAldNS4orCq00pfb1TWg6h57ChFunyktDHj9hTh)');
  console.log('3. You should see your script files in the left sidebar');
  console.log('4. For each file:');
  console.log('   - Click on the file name');
  console.log('   - Copy all the source code');
  console.log('   - Tell me the filename and paste the code here');
  console.log('');
  console.log('📝 What files do you see in your Apps Script project?');
  console.log('   (Usually: Code.gs, appsscript.json, and possibly others)');
  console.log('');
  console.log('🔍 Or try this: Go to File > Download > Download as ZIP');
  console.log('   Then upload the ZIP file here and I\'ll extract it');
  
  // Let's also try to see if we can get any info about the script
  console.log('\n🔧 Trying to get script info...');
  
  const scriptInfoProcess = spawn('clasp', ['open', '13k7BOpOU3Pt3xCPi3rAldNS4orCq00pfb1TWg6h57ChFunyktDHj9hTh'], {
    stdio: 'inherit',
    shell: true,
    env: { 
      ...process.env, 
      PATH: process.env.PATH + ':' + process.env.HOME + '/google-cloud-sdk/bin'
    }
  });
  
  scriptInfoProcess.on('close', (code) => {
    console.log(`📊 Open command exited with code: ${code}`);
    if (code === 0) {
      console.log('✅ Successfully opened Apps Script in browser!');
    } else {
      console.log('❌ Could not open Apps Script directly');
      console.log('💡 Please use the manual approach above');
    }
  });
}

setupClaspWithCode().catch(console.error);