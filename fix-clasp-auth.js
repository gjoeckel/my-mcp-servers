#!/usr/bin/env node

import { spawn } from 'child_process';

async function fixClaspAuth() {
  console.log('🔧 Fixing clasp authentication with corrected scopes...');
  
  // The corrected scopes (removing the invalid one)
  const validScopes = [
    'https://www.googleapis.com/auth/script.deployments',
    'https://www.googleapis.com/auth/script.projects',
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
  
  // Generate a random port
  const port = Math.floor(Math.random() * 10000) + 30000;
  
  const correctedUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `access_type=offline&` +
    `scope=${encodeURIComponent(scopeString)}&` +
    `response_type=code&` +
    `client_id=${clientId}`;

  console.log('\n🔗 CORRECTED AUTHENTICATION URL:');
  console.log('================================');
  console.log(correctedUrl);
  console.log('================================');
  
  console.log('\n📋 INSTRUCTIONS:');
  console.log('1. Copy the corrected URL above');
  console.log('2. Open it in your browser');
  console.log('3. Complete the Google authentication');
  console.log('4. You should be redirected to a localhost URL with a code');
  console.log('5. Copy the entire redirected URL and paste it here');
  
  // Now let's try to start clasp login with the corrected scopes
  console.log('\n🚀 Starting clasp login with corrected scopes...');
  
  const claspProcess = spawn('clasp', ['login'], {
    stdio: ['pipe', 'pipe', 'pipe'],
    shell: true,
    env: { 
      ...process.env, 
      PATH: process.env.PATH + ':' + process.env.HOME + '/google-cloud-sdk/bin',
      // Try to set the corrected scopes
      CLASP_SCOPES: scopeString
    }
  });

  let output = '';

  claspProcess.stdout.on('data', (data) => {
    const text = data.toString();
    output += text;
    console.log('📤 Clasp stdout:', text);
  });

  claspProcess.stderr.on('data', (data) => {
    const text = data.toString();
    output += text;
    console.log('📤 Clasp stderr:', text);
  });

  // Wait for clasp to provide the URL
  await new Promise(resolve => setTimeout(resolve, 3000));

  console.log('\n⏳ Waiting for you to complete authentication...');
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
        
        // Try to complete the authentication
        try {
          const authProcess = spawn('clasp', ['login'], {
            stdio: ['pipe', 'pipe', 'pipe'],
            shell: true,
            env: { 
              ...process.env, 
              PATH: process.env.PATH + ':' + process.env.HOME + '/google-cloud-sdk/bin'
            }
          });
          
          // Send the code to clasp
          authProcess.stdin.write(code + '\n');
          authProcess.stdin.end();
          
          authProcess.stdout.on('data', (data) => {
            console.log('📤 Auth stdout:', data.toString());
          });
          
          authProcess.stderr.on('data', (data) => {
            console.log('📤 Auth stderr:', data.toString());
          });
          
          authProcess.on('close', (code) => {
            console.log(`📊 Auth process exited with code: ${code}`);
            if (code === 0) {
              console.log('✅ Authentication completed successfully!');
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
                } else {
                  console.log('❌ Failed to clone Apps Script');
                }
                process.exit(0);
              });
            } else {
              console.log('❌ Authentication failed');
              process.exit(1);
            }
          });
          
        } catch (error) {
          console.error('❌ Error completing authentication:', error.message);
        }
        
      } else {
        console.log('❌ Could not extract auth code from URL');
        console.log('🔍 URL structure:', redirectedUrl);
      }
    } catch (error) {
      console.error('❌ Error parsing URL:', error.message);
    }
  });
}

fixClaspAuth().catch(console.error);