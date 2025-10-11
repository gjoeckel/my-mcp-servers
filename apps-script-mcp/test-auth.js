#!/usr/bin/env node

import { AppsScriptAuth } from './build/auth.js';

async function testAuth() {
  console.log('🔐 Testing OAuth2 Authentication');
  console.log('================================');
  
  try {
    const auth = new AppsScriptAuth();
    
    console.log('📋 Checking authentication status...');
    
    if (auth.isAuthenticated()) {
      console.log('✅ Already authenticated!');
      
      // Test getting authenticated client
      console.log('🔄 Testing API client...');
      const client = await auth.getAuthenticatedClient();
      console.log('✅ API client ready!');
      
      return true;
    } else {
      console.log('❌ Not authenticated');
      console.log('');
      console.log('Please run: node setup-auth.js');
      return false;
    }
  } catch (error) {
    console.error('❌ Authentication test failed:', error.message);
    return false;
  }
}

testAuth().then(success => {
  if (success) {
    console.log('');
    console.log('🎉 Ready to use the MCP server!');
  } else {
    console.log('');
    console.log('🔧 Please set up authentication first.');
  }
}).catch(console.error);