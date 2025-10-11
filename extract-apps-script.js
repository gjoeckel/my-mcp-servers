#!/usr/bin/env node

import puppeteer from 'puppeteer';

async function extractAppsScript() {
  console.log('🚀 Extracting Apps Script code via Puppeteer...');
  
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

    console.log('🌐 Navigating to Apps Script...');
    const url = 'https://script.google.com/d/13k7BOpOU3Pt3xCPi3rAldNS4orCq00pfb1TWg6h57ChFunyktDHj9hTh/edit';
    
    // Navigate to the Apps Script editor
    await page.goto(url, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });

    // Wait for the editor to load
    console.log('⏳ Waiting for Apps Script editor to load...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log('📊 Page title:', await page.title());
    console.log('🔗 Current URL:', page.url());

    // Check if we need to sign in
    const needsSignIn = await page.evaluate(() => {
      return document.body.innerText.includes('Sign in') || 
             document.body.innerText.includes('Sign-in required') ||
             document.querySelector('[data-action="signin"]') !== null;
    });

    if (needsSignIn) {
      console.log('🔐 Authentication required - Apps Script needs sign in');
      console.log('📋 Please sign in manually and then I\'ll extract the code');
      
      // Wait for user to sign in
      console.log('⏳ Waiting for you to sign in...');
      console.log('💡 After signing in, the page should show the code editor');
      
      // Wait for the editor to appear (indicating successful sign in)
      try {
        await page.waitForSelector('.monaco-editor, .ace_editor, [role="textbox"]', { timeout: 60000 });
        console.log('✅ Sign in detected - editor loaded!');
      } catch (error) {
        console.log('⏰ Timeout waiting for editor - continuing anyway...');
      }
    }

    // Try to extract file list from the sidebar
    console.log('📁 Looking for file list...');
    const fileList = await page.evaluate(() => {
      const files = [];
      
      // Look for file list in various possible selectors
      const selectors = [
        '.file-list-item',
        '.file-item',
        '[data-file-name]',
        '.file-name',
        '.js-file-list-item',
        '.sidebar-file-item'
      ];
      
      for (const selector of selectors) {
        const elements = document.querySelectorAll(selector);
        for (const element of elements) {
          const name = element.textContent || element.getAttribute('data-file-name') || element.title;
          if (name && name.trim()) {
            files.push(name.trim());
          }
        }
      }
      
      return files;
    });

    console.log('📂 Found files:', fileList);

    // Try to extract code from the editor
    console.log('📝 Extracting code from editor...');
    const codeContent = await page.evaluate(() => {
      // Try multiple selectors for the code editor
      const editorSelectors = [
        '.monaco-editor .view-lines',
        '.ace_editor .ace_text-layer',
        '[role="textbox"]',
        '.CodeMirror-code',
        '.editor-content',
        '.code-editor'
      ];
      
      for (const selector of editorSelectors) {
        const element = document.querySelector(selector);
        if (element) {
          return element.innerText || element.textContent || '';
        }
      }
      
      return '';
    });

    console.log('📄 Code content length:', codeContent.length);
    if (codeContent.length > 0) {
      console.log('📄 First 500 characters of code:');
      console.log(codeContent.substring(0, 500));
    }

    // Try to get the current file name
    const currentFileName = await page.evaluate(() => {
      const selectors = [
        '.file-name',
        '.current-file-name',
        '.tab-title',
        '.editor-tab-title',
        '[data-file-name]'
      ];
      
      for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element) {
          return element.textContent || element.getAttribute('data-file-name') || '';
        }
      }
      
      return 'Code.gs'; // Default fallback
    });

    console.log('📄 Current file name:', currentFileName);

    // Try to extract all visible text content
    const allContent = await page.evaluate(() => {
      // Get all text content, filtering out navigation and UI elements
      const textElements = document.querySelectorAll('*');
      const content = [];
      
      for (const element of textElements) {
        const text = element.innerText || element.textContent || '';
        if (text && 
            text.length > 10 && 
            !text.includes('Sign in') && 
            !text.includes('Apps Script') &&
            !text.includes('File') &&
            !text.includes('Edit') &&
            !text.includes('View') &&
            !text.includes('Run') &&
            !text.includes('Debug') &&
            !text.includes('Deploy') &&
            !text.includes('Help') &&
            !text.includes('Extensions') &&
            !text.includes('Tools') &&
            !text.includes('Untitled project') &&
            !text.includes('New file') &&
            !text.includes('Open') &&
            !text.includes('Save') &&
            !text.includes('Undo') &&
            !text.includes('Redo') &&
            !text.includes('Cut') &&
            !text.includes('Copy') &&
            !text.includes('Paste') &&
            !text.includes('Find') &&
            !text.includes('Replace')) {
          content.push(text.trim());
        }
      }
      
      return content.filter((text, index, arr) => arr.indexOf(text) === index);
    });

    console.log('📄 All relevant content found:');
    allContent.forEach((text, i) => {
      if (text.length > 20) {
        console.log(`  ${i + 1}: ${text.substring(0, 100)}${text.length > 100 ? '...' : ''}`);
      }
    });

    // Save the extracted content
    if (codeContent.length > 0) {
      const fs = await import('fs');
      const fileName = currentFileName || 'Code.gs';
      fs.writeFileSync(`/workspace/apps-script-project/src/${fileName}`, codeContent);
      console.log(`💾 Saved code to: src/${fileName}`);
    }

    // Take a screenshot
    console.log('📸 Taking screenshot...');
    await page.screenshot({ 
      path: '/workspace/apps-script-screenshot.png',
      fullPage: true 
    });

    console.log('✅ Extraction completed!');

  } catch (error) {
    console.error('❌ Error during extraction:', error.message);
  } finally {
    if (browser) {
      console.log('🔒 Closing browser...');
      await browser.close();
    }
  }
}

extractAppsScript();