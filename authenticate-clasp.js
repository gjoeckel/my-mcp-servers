#!/usr/bin/env node

import puppeteer from 'puppeteer';
import { spawn } from 'child_process';

async function authenticateClasp() {
  console.log('🚀 Starting clasp authentication via Puppeteer...');
  
  let browser;
  try {
    // Launch browser
    console.log('📱 Launching browser...');
    browser = await puppeteer.launch({
      headless: false, // We need to see the browser for auth
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--no-first-run',
        '--no-zygote',
        '--single-process'
      ]
    });

    const page = await browser.newPage();
    
    // Set viewport and user agent
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    console.log('🔑 Starting clasp login process...');
    
    // Start clasp login in the background
    const claspProcess = spawn('clasp', ['login'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: true,
      env: { ...process.env, PATH: process.env.PATH + ':' + process.env.HOME + '/google-cloud-sdk/bin' }
    });

    let authUrl = '';
    let authCode = '';

    // Capture clasp output to get the auth URL
    claspProcess.stdout.on('data', (data) => {
      const output = data.toString();
      console.log('📤 Clasp output:', output);
      
      // Look for the auth URL
      const urlMatch = output.match(/https:\/\/accounts\.google\.com\/o\/oauth2\/v2\/auth[^\s]+/);
      if (urlMatch) {
        authUrl = urlMatch[0];
        console.log('🔗 Found auth URL:', authUrl);
      }
    });

    claspProcess.stderr.on('data', (data) => {
      const output = data.toString();
      console.log('📤 Clasp stderr:', output);
      
      // Look for the auth URL in stderr too
      const urlMatch = output.match(/https:\/\/accounts\.google\.com\/o\/oauth2\/v2\/auth[^\s]+/);
      if (urlMatch) {
        authUrl = urlMatch[0];
        console.log('🔗 Found auth URL in stderr:', authUrl);
      }
    });

    // Wait a moment for clasp to start and provide the URL
    await new Promise(resolve => setTimeout(resolve, 3000));

    if (!authUrl) {
      console.log('❌ Could not extract auth URL from clasp output');
      return;
    }

    console.log('🌐 Navigating to Google OAuth...');
    await page.goto(authUrl, { waitUntil: 'networkidle2', timeout: 30000 });

    console.log('⏳ Waiting for user to complete authentication...');
    console.log('📋 Please complete the authentication in the browser window that opened');
    console.log('🔍 Watching for redirect to localhost...');

    // Wait for redirect to localhost (which means auth is complete)
    try {
      await page.waitForFunction(() => {
        return window.location.href.includes('localhost') || 
               window.location.href.includes('authcode.html') ||
               document.body.innerText.includes('Success') ||
               document.body.innerText.includes('success');
      }, { timeout: 300000 }); // 5 minute timeout

      console.log('✅ Authentication appears to be complete!');
      console.log('🔗 Final URL:', page.url());
      
      // Extract any auth code from the URL
      const urlParams = new URLSearchParams(page.url().split('?')[1]);
      authCode = urlParams.get('code');
      
      if (authCode) {
        console.log('🔑 Auth code extracted:', authCode);
      }

    } catch (error) {
      console.log('⏰ Timeout waiting for authentication completion');
      console.log('🔍 Current page URL:', page.url());
      console.log('📄 Page content preview:', await page.evaluate(() => document.body.innerText.substring(0, 500)));
    }

    // Wait a bit more for clasp to process the auth
    console.log('⏳ Waiting for clasp to process authentication...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Check if clasp is still running
    if (!claspProcess.killed) {
      console.log('🔄 Clasp process is still running, waiting for completion...');
      
      // Wait for clasp to finish
      await new Promise((resolve) => {
        claspProcess.on('close', (code) => {
          console.log(`📊 Clasp process exited with code: ${code}`);
          resolve();
        });
        
        // Timeout after 30 seconds
        setTimeout(() => {
          console.log('⏰ Timeout waiting for clasp to complete');
          claspProcess.kill();
          resolve();
        }, 30000);
      });
    }

    console.log('✅ Authentication process completed!');

  } catch (error) {
    console.error('❌ Error during authentication:', error.message);
  } finally {
    if (browser) {
      console.log('🔒 Closing browser...');
      await browser.close();
    }
  }
}

authenticateClasp();