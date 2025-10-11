#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { homedir } from 'os';
import { createInterface } from 'readline';

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setupAuth() {
  console.log('🔐 Google Apps Script MCP Server - OAuth2 Setup');
  console.log('==============================================');
  console.log('');
  
  // Get OAuth2 credentials from user
  const clientId = await question('Enter your OAuth2 Client ID: ');
  const clientSecret = await question('Enter your OAuth2 Client Secret: ');
  
  // Create config directory
  const configDir = join(homedir(), '.apps-script-mcp');
  if (!existsSync(configDir)) {
    mkdirSync(configDir, { recursive: true });
  }
  
  // Create config file
  const config = {
    clientId: clientId.trim(),
    clientSecret: clientSecret.trim(),
    redirectUri: 'http://localhost:3000/oauth2callback',
    tokenPath: join(configDir, 'tokens.json')
  };
  
  const configPath = join(configDir, 'config.json');
  writeFileSync(configPath, JSON.stringify(config, null, 2));
  
  console.log('');
  console.log('✅ Configuration saved to:', configPath);
  console.log('');
  
  // Generate OAuth URL
  const scopes = [
    'https://www.googleapis.com/auth/script.projects',
    'https://www.googleapis.com/auth/script.deployments',
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/drive.metadata.readonly'
  ];
  
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${encodeURIComponent(clientId)}&` +
    `redirect_uri=${encodeURIComponent(config.redirectUri)}&` +
    `scope=${encodeURIComponent(scopes.join(' '))}&` +
    `response_type=code&` +
    `access_type=offline&` +
    `prompt=consent`;
  
  console.log('🌐 Please visit this URL to authorize the application:');
  console.log('');
  console.log(authUrl);
  console.log('');
  
  const authCode = await question('After authorization, paste the code from the redirect URL: ');
  
  // Exchange code for tokens
  console.log('');
  console.log('🔄 Exchanging code for tokens...');
  
  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code: authCode.trim(),
        grant_type: 'authorization_code',
        redirect_uri: config.redirectUri
      })
    });
    
    const tokens = await response.json();
    
    if (tokens.error) {
      throw new Error(`OAuth error: ${tokens.error_description || tokens.error}`);
    }
    
    // Save tokens
    const tokenData = {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      scope: tokens.scope,
      token_type: tokens.token_type || 'Bearer',
      expiry_date: Date.now() + (tokens.expires_in * 1000)
    };
    
    writeFileSync(config.tokenPath, JSON.stringify(tokenData, null, 2));
    
    console.log('✅ Authentication successful!');
    console.log('✅ Tokens saved to:', config.tokenPath);
    console.log('');
    console.log('🚀 Your MCP server is now ready to use!');
    console.log('');
    console.log('Test it with:');
    console.log('  node test-color-checker.js');
    
  } catch (error) {
    console.error('❌ Authentication failed:', error.message);
    console.log('');
    console.log('Please check your credentials and try again.');
  }
  
  rl.close();
}

setupAuth().catch(console.error);