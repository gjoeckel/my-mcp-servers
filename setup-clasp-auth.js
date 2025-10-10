#!/usr/bin/env node

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

async function setupClaspAuth() {
  console.log('🚀 Setting up clasp authentication...');
  
  try {
    // Method 1: Try to get the auth URL and let user handle it manually
    console.log('📋 Method 1: Getting authentication URL...');
    
    const claspProcess = spawn('clasp', ['login'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: true,
      env: { ...process.env, PATH: process.env.PATH + ':' + process.env.HOME + '/google-cloud-sdk/bin' }
    });

    let authUrl = '';
    let output = '';

    claspProcess.stdout.on('data', (data) => {
      const text = data.toString();
      output += text;
      console.log('📤 Clasp stdout:', text);
      
      const urlMatch = text.match(/https:\/\/accounts\.google\.com\/o\/oauth2\/v2\/auth[^\s]+/);
      if (urlMatch) {
        authUrl = urlMatch[0];
      }
    });

    claspProcess.stderr.on('data', (data) => {
      const text = data.toString();
      output += text;
      console.log('📤 Clasp stderr:', text);
      
      const urlMatch = text.match(/https:\/\/accounts\.google\.com\/o\/oauth2\/v2\/auth[^\s]+/);
      if (urlMatch) {
        authUrl = urlMatch[0];
      }
    });

    // Wait for the auth URL
    await new Promise(resolve => setTimeout(resolve, 5000));

    if (authUrl) {
      console.log('\n🔗 AUTHENTICATION URL FOUND:');
      console.log('================================');
      console.log(authUrl);
      console.log('================================');
      console.log('\n📋 INSTRUCTIONS:');
      console.log('1. Copy the URL above');
      console.log('2. Open it in your browser');
      console.log('3. Complete the Google authentication');
      console.log('4. You should be redirected to a localhost URL with a code');
      console.log('5. Copy the entire redirected URL and paste it here');
      console.log('\n⏳ Waiting for you to complete authentication...');
      
      // Wait for user input
      process.stdin.setEncoding('utf8');
      process.stdin.on('data', async (data) => {
        const redirectedUrl = data.toString().trim();
        console.log('📥 Received URL:', redirectedUrl);
        
        // Extract the code from the URL
        const urlParams = new URLSearchParams(redirectedUrl.split('?')[1]);
        const code = urlParams.get('code');
        
        if (code) {
          console.log('🔑 Extracted auth code:', code);
          console.log('✅ Authentication should be complete!');
        } else {
          console.log('❌ Could not extract auth code from URL');
        }
        
        process.exit(0);
      });
      
    } else {
      console.log('❌ Could not extract auth URL from clasp output');
      console.log('📄 Full output:', output);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Alternative method: Create a service account approach
async function createServiceAccountInstructions() {
  console.log('\n🔧 ALTERNATIVE METHOD: Service Account');
  console.log('=====================================');
  console.log('1. Go to Google Cloud Console: https://console.cloud.google.com/');
  console.log('2. Create a new project or select existing one');
  console.log('3. Enable Google Apps Script API');
  console.log('4. Create a Service Account:');
  console.log('   - Go to IAM & Admin > Service Accounts');
  console.log('   - Click "Create Service Account"');
  console.log('   - Download the JSON key file');
  console.log('5. Share your Apps Script with the service account email');
  console.log('6. Set environment variable:');
  console.log('   export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json');
  console.log('7. Then run: clasp login --adc');
}

setupClaspAuth().catch(console.error);

// Also show service account instructions
setTimeout(() => {
  createServiceAccountInstructions();
}, 2000);