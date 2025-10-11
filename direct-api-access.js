#!/usr/bin/env node

import { google } from 'googleapis';

async function getAppsScriptDirectly() {
  console.log('🚀 Accessing Apps Script directly via API...');
  
  try {
    // Create OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      '1072944905499-vm2v2i5dvn0a0d2o4ca36i1vge8cvbn0.apps.googleusercontent.com',
      'GOCSPX-your-client-secret', // This would need to be the actual client secret
      'http://localhost:34145'
    );

    // Set the credentials using the auth code
    const authCode = '4/0AVGzR1A_bmYCt5kQMrWLX-yr6TCGWDmNQRcP-sBe0X464MPz59lRgkOaad2f2xkFXxkH3g';
    
    console.log('🔑 Using auth code:', authCode);
    
    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(authCode);
    oauth2Client.setCredentials(tokens);
    
    console.log('✅ Tokens obtained successfully!');
    
    // Create Apps Script API client
    const script = google.script({ version: 'v1', auth: oauth2Client });
    
    console.log('📥 Fetching Apps Script project...');
    const scriptId = '13k7BOpOU3Pt3xCPi3rAldNS4orCq00pfb1TWg6h57ChFunyktDHj9hTh';
    
    // Get the script content
    const response = await script.projects.get({
      scriptId: scriptId
    });
    
    console.log('🎉 Apps Script project retrieved successfully!');
    console.log('📄 Project details:');
    console.log('Title:', response.data.title);
    console.log('Script ID:', response.data.scriptId);
    console.log('Created:', response.data.createTime);
    console.log('Updated:', response.data.updateTime);
    
    // Get the files in the project
    const filesResponse = await script.projects.getContent({
      scriptId: scriptId
    });
    
    console.log('\n📁 Files in the project:');
    if (filesResponse.data.files) {
      filesResponse.data.files.forEach((file, index) => {
        console.log(`\n--- File ${index + 1} ---`);
        console.log('Name:', file.name);
        console.log('Type:', file.type);
        console.log('Source:', file.source ? file.source.substring(0, 200) + '...' : 'No source');
        
        // Save each file
        const fileName = file.name || `file_${index + 1}.${file.type === 'SERVER_JS' ? 'js' : 'json'}`;
        const fs = await import('fs');
        fs.writeFileSync(`/workspace/${fileName}`, file.source || '');
        console.log(`💾 Saved as: ${fileName}`);
      });
    }
    
    console.log('\n✅ All files downloaded successfully!');
    
  } catch (error) {
    console.error('❌ Error accessing Apps Script:', error.message);
    
    if (error.message.includes('client_secret')) {
      console.log('\n💡 The issue is that we need the OAuth client secret.');
      console.log('🔧 Let\'s try a different approach...');
      console.log('\n📋 MANUAL APPROACH:');
      console.log('1. Go to https://script.google.com/');
      console.log('2. Open your Apps Script project');
      console.log('3. Copy the source code from each file');
      console.log('4. Paste it here and I\'ll save it as files');
    }
  }
}

getAppsScriptDirectly();