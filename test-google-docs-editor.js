#!/usr/bin/env node

import puppeteer from 'puppeteer';

async function testGoogleDocsEditor() {
  console.log('🚀 Starting Google Docs Editor test...');
  
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

    // Wait longer for Google Docs to fully load
    console.log('⏳ Waiting for Google Docs to load...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Try to wait for specific Google Docs elements
    try {
      await page.waitForSelector('.kix-appview-editor', { timeout: 10000 });
      console.log('✅ Google Docs editor loaded');
    } catch (e) {
      console.log('⚠️ Google Docs editor not fully loaded, continuing...');
    }

    console.log('📊 Page title:', await page.title());
    console.log('🔗 Current URL:', page.url());

    // Check for authentication status
    const authStatus = await page.evaluate(() => {
      const signInElements = document.querySelectorAll('[data-action="signin"], [aria-label*="Sign in"], .sign-in-button');
      const editingElements = document.querySelectorAll('[data-action="edit"], .editing, [aria-label*="Editing"]');
      const toolbarElements = document.querySelectorAll('[role="toolbar"], .docs-toolbar');
      
      return {
        hasSignInPrompt: signInElements.length > 0,
        hasEditingMode: editingElements.length > 0,
        hasToolbar: toolbarElements.length > 0,
        signInText: Array.from(signInElements).map(el => el.textContent).join(' '),
        editingText: Array.from(editingElements).map(el => el.textContent).join(' ')
      };
    });

    console.log('🔐 Authentication status:', authStatus);

    // Try to find the main document content area
    console.log('🔍 Looking for document content...');
    const documentContent = await page.evaluate(() => {
      // Try multiple selectors for Google Docs content
      const selectors = [
        '.kix-appview-editor',
        '[role="textbox"]',
        '.kix-document',
        '.kix-page',
        '.kix-lineview-text-block',
        '.kix-lineview',
        '[data-params*="textbox"]',
        '.docs-texteventtarget-iframe'
      ];

      let bestContent = '';
      let bestSelector = '';

      for (const selector of selectors) {
        try {
          const elements = document.querySelectorAll(selector);
          for (const element of elements) {
            const text = element.innerText || element.textContent || '';
            if (text && text.length > bestContent.length && !text.includes('Sign in') && !text.includes('Request edit access')) {
              bestContent = text;
              bestSelector = selector;
            }
          }
        } catch (e) {
          // Continue to next selector
        }
      }

      return {
        content: bestContent,
        selector: bestSelector,
        length: bestContent.length
      };
    });

    console.log('📄 Document content found:');
    console.log(`  Selector: ${documentContent.selector}`);
    console.log(`  Length: ${documentContent.length} characters`);
    console.log(`  Content preview: ${documentContent.content.substring(0, 500)}`);

    // Try to access iframe content more thoroughly
    console.log('🖼️ Checking iframe content...');
    const iframeContent = await page.evaluate(() => {
      const iframes = document.querySelectorAll('iframe');
      const results = [];

      for (let i = 0; i < iframes.length; i++) {
        try {
          const iframe = iframes[i];
          const src = iframe.src || iframe.getAttribute('data-src') || 'no-src';
          results.push({
            index: i,
            src: src.substring(0, 100),
            hasContent: iframe.contentDocument !== null
          });
        } catch (e) {
          results.push({
            index: i,
            src: 'error',
            hasContent: false,
            error: e.message
          });
        }
      }

      return results;
    });

    console.log('🖼️ Iframe analysis:');
    iframeContent.forEach((iframe, i) => {
      console.log(`  Iframe ${i}: ${iframe.src} (content: ${iframe.hasContent})`);
    });

    // Try to get all text content from the page
    console.log('📝 Extracting all page text...');
    const allText = await page.evaluate(() => {
      // Get all text content, filtering out navigation and UI elements
      const textElements = document.querySelectorAll('*');
      const textContent = [];
      
      for (const element of textElements) {
        const text = element.innerText || element.textContent || '';
        if (text && 
            text.length > 10 && 
            !text.includes('Sign in') && 
            !text.includes('Request edit access') &&
            !text.includes('Share') &&
            !text.includes('FileEditView') &&
            !text.includes('Document tabs') &&
            !text.includes('Turn on screen reader') &&
            !text.includes('Banner hidden') &&
            !text.includes('Normal text') &&
            !text.includes('Calibri')) {
          textContent.push(text.trim());
        }
      }
      
      return textContent.filter((text, index, arr) => arr.indexOf(text) === index);
    });

    console.log('📄 All relevant text content:');
    allText.forEach((text, i) => {
      if (text.length > 20) {
        console.log(`  ${i + 1}: ${text.substring(0, 100)}${text.length > 100 ? '...' : ''}`);
      }
    });

    // Take a final screenshot
    console.log('📸 Taking final screenshot...');
    await page.screenshot({ 
      path: '/workspace/google-docs-editor-screenshot.png',
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

testGoogleDocsEditor();