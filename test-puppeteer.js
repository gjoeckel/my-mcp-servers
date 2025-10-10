#!/usr/bin/env node

import puppeteer from 'puppeteer';

async function testGoogleDocs() {
  console.log('🚀 Starting Puppeteer test...');
  
  let browser;
  try {
    // Launch browser
    console.log('📱 Launching browser...');
    browser = await puppeteer.launch({
      headless: true, // Run in headless mode for server environment
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
    
    // Set user agent to avoid detection
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    console.log('🌐 Navigating to Google Docs...');
    const url = 'https://docs.google.com/document/d/1KwG-yohBPNWX8Nn8Nfy_48U_3cbd2RvMjimsRKWjwUE/edit?usp=drivesdk';
    
    // Navigate to the URL
    await page.goto(url, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });

    console.log('📸 Taking screenshot...');
    await page.screenshot({ 
      path: '/workspace/google-docs-screenshot.png',
      fullPage: true 
    });

    console.log('📝 Extracting text content...');
    const textContent = await page.evaluate(() => {
      return document.body.innerText;
    });

    console.log('📊 Page title:', await page.title());
    console.log('🔗 Current URL:', page.url());
    console.log('📄 Text content length:', textContent.length);
    console.log('📄 First 500 characters of content:');
    console.log(textContent.substring(0, 500));

    // Check if we can see any specific elements
    const hasGoogleDocsContent = await page.evaluate(() => {
      return document.querySelector('[role="textbox"]') !== null || 
             document.querySelector('.kix-appview-editor') !== null ||
             document.querySelector('.docs-texteventtarget-iframe') !== null;
    });

    console.log('📋 Google Docs editor detected:', hasGoogleDocsContent);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (browser) {
      console.log('🔒 Closing browser...');
      await browser.close();
    }
  }
}

testGoogleDocs();