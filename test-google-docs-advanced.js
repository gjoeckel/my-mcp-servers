#!/usr/bin/env node

import puppeteer from 'puppeteer';

async function testGoogleDocsAdvanced() {
  console.log('🚀 Starting advanced Google Docs test...');
  
  let browser;
  try {
    // Launch browser
    console.log('📱 Launching browser...');
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      ]
    });

    const page = await browser.newPage();
    
    // Set viewport and user agent
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    // Set extra headers
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
    });

    console.log('🌐 Navigating to Google Docs...');
    const url = 'https://docs.google.com/document/d/1KwG-yohBPNWX8Nn8Nfy_48U_3cbd2RvMjimsRKWjwUE/edit?usp=drivesdk';
    
    // Navigate to the URL
    await page.goto(url, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });

    // Wait a bit for the page to load
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log('📊 Page title:', await page.title());
    console.log('🔗 Current URL:', page.url());

    // Try to find different content areas
    const contentSelectors = [
      '[role="textbox"]',
      '.kix-appview-editor',
      '.docs-texteventtarget-iframe',
      '.kix-document',
      '.kix-page',
      '[data-params*="textbox"]',
      '.kix-lineview-text-block',
      '.kix-lineview'
    ];

    console.log('🔍 Checking for content in different selectors...');
    for (const selector of contentSelectors) {
      const elements = await page.$$(selector);
      console.log(`  ${selector}: ${elements.length} elements found`);
    }

    // Try to extract text from iframes
    console.log('🖼️ Checking for iframes...');
    const iframes = await page.$$('iframe');
    console.log(`Found ${iframes.length} iframes`);

    for (let i = 0; i < iframes.length; i++) {
      try {
        const frame = await iframes[i].contentFrame();
        if (frame) {
          const frameText = await frame.evaluate(() => document.body.innerText);
          console.log(`Iframe ${i} content length: ${frameText.length}`);
          if (frameText.length > 50) {
            console.log(`Iframe ${i} first 200 chars: ${frameText.substring(0, 200)}`);
          }
        }
      } catch (e) {
        console.log(`Iframe ${i} error: ${e.message}`);
      }
    }

    // Try to get the main document content
    console.log('📝 Extracting main content...');
    const mainContent = await page.evaluate(() => {
      // Try multiple approaches to get content
      const approaches = [
        () => document.body.innerText,
        () => document.querySelector('[role="textbox"]')?.innerText || '',
        () => document.querySelector('.kix-appview-editor')?.innerText || '',
        () => {
          const textElements = document.querySelectorAll('[data-params*="textbox"]');
          return Array.from(textElements).map(el => el.innerText).join('\n');
        },
        () => {
          const lineElements = document.querySelectorAll('.kix-lineview-text-block');
          return Array.from(lineElements).map(el => el.innerText).join('\n');
        }
      ];

      let bestContent = '';
      for (const approach of approaches) {
        try {
          const content = approach();
          if (content && content.length > bestContent.length) {
            bestContent = content;
          }
        } catch (e) {
          // Continue to next approach
        }
      }
      return bestContent;
    });

    console.log('📄 Main content length:', mainContent.length);
    console.log('📄 First 1000 characters of content:');
    console.log(mainContent.substring(0, 1000));

    // Check for specific Google Docs elements
    const hasGoogleDocsElements = await page.evaluate(() => {
      return {
        hasTextbox: document.querySelector('[role="textbox"]') !== null,
        hasKixEditor: document.querySelector('.kix-appview-editor') !== null,
        hasIframe: document.querySelector('iframe') !== null,
        hasDocumentTabs: document.querySelector('[role="tablist"]') !== null,
        hasToolbar: document.querySelector('[role="toolbar"]') !== null
      };
    });

    console.log('📋 Google Docs elements detected:', hasGoogleDocsElements);

    // Take a screenshot
    console.log('📸 Taking screenshot...');
    await page.screenshot({ 
      path: '/workspace/google-docs-advanced-screenshot.png',
      fullPage: true 
    });

    console.log('✅ Test completed successfully!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (browser) {
      console.log('🔒 Closing browser...');
      await browser.close();
    }
  }
}

testGoogleDocsAdvanced();