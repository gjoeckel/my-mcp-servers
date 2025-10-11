#!/usr/bin/env node

import { spawn } from 'child_process';
import { readFileSync } from 'fs';

// Test the MCP server with your Color Contrast Checker project
async function testColorChecker() {
  console.log('🧪 Testing Apps Script MCP Server with Color Contrast Checker');
  console.log('============================================================');
  
  const scriptId = '13k7BOpOU3Pt3xCPi3rAldNS4orCq00pfb1TWg6h57ChFunyktDHj9hTh';
  
  // Start the MCP server
  const server = spawn('node', ['build/simple-server.js'], {
    stdio: ['pipe', 'pipe', 'pipe']
  });
  
  let serverOutput = '';
  let serverError = '';
  
  server.stdout.on('data', (data) => {
    serverOutput += data.toString();
  });
  
  server.stderr.on('data', (data) => {
    serverError += data.toString();
  });
  
  // Wait for server to start
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  console.log('📡 Server started, testing tools...');
  
  // Test 1: List tools
  console.log('\n1️⃣ Testing list tools...');
  const listToolsRequest = {
    jsonrpc: '2.0',
    id: 1,
    method: 'tools/list',
    params: {}
  };
  
  server.stdin.write(JSON.stringify(listToolsRequest) + '\n');
  
  // Test 2: Get project
  console.log('\n2️⃣ Testing get project...');
  const getProjectRequest = {
    jsonrpc: '2.0',
    id: 2,
    method: 'tools/call',
    params: {
      name: 'get_apps_script_project',
      arguments: {
        scriptId: scriptId
      }
    }
  };
  
  server.stdin.write(JSON.stringify(getProjectRequest) + '\n');
  
  // Test 3: Update project with our Color Contrast Checker code
  console.log('\n3️⃣ Testing update project...');
  
  // Read the Color Contrast Checker files
  const codeGs = readFileSync('/workspace/apps-script-project/apps-script-projects/color-contrast-checker/src/Code.gs', 'utf8');
  const sidebarHtml = readFileSync('/workspace/apps-script-project/apps-script-projects/color-contrast-checker/src/Sidebar.html', 'utf8');
  const appsscriptJson = readFileSync('/workspace/apps-script-project/apps-script-projects/color-contrast-checker/src/appsscript.json', 'utf8');
  
  const updateProjectRequest = {
    jsonrpc: '2.0',
    id: 3,
    method: 'tools/call',
    params: {
      name: 'update_apps_script_project',
      arguments: {
        scriptId: scriptId,
        files: [
          {
            name: 'Code.gs',
            type: 'SERVER_JS',
            source: codeGs
          },
          {
            name: 'Sidebar.html',
            type: 'HTML',
            source: sidebarHtml
          },
          {
            name: 'appsscript.json',
            type: 'JSON',
            source: appsscriptJson
          }
        ]
      }
    }
  };
  
  server.stdin.write(JSON.stringify(updateProjectRequest) + '\n');
  
  // Test 4: Execute function
  console.log('\n4️⃣ Testing execute function...');
  const executeRequest = {
    jsonrpc: '2.0',
    id: 4,
    method: 'tools/call',
    params: {
      name: 'execute_apps_script_function',
      arguments: {
        scriptId: scriptId,
        functionName: 'showSidebar',
        parameters: [],
        devMode: true
      }
    }
  };
  
  server.stdin.write(JSON.stringify(executeRequest) + '\n');
  
  // Wait for responses
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  console.log('\n📊 Server Output:');
  console.log(serverOutput);
  
  if (serverError) {
    console.log('\n❌ Server Error:');
    console.log(serverError);
  }
  
  // Clean up
  server.kill();
  
  console.log('\n✅ Test completed!');
}

testColorChecker().catch(console.error);