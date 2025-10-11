# Google Apps Script MCP Server

A Model Context Protocol (MCP) server for Google Apps Script API integration, enabling AI agents to manage Apps Script projects programmatically.

## Features

- **List Projects**: Retrieve all accessible Apps Script projects
- **Get Project Content**: Fetch complete project structure and files
- **Create Projects**: Initialize new standalone or bound script projects
- **Update Projects**: Modify existing project files
- **Deploy Scripts**: Create versioned deployments
- **Execute Functions**: Run specific functions within scripts
- **View Logs**: Retrieve execution logs and error traces

## Installation

```bash
npm install
npm run build
```

## Configuration

1. **Create Google Cloud Project**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable the Google Apps Script API

2. **Set up OAuth Credentials**:
   - Go to APIs & Services → Credentials
   - Create OAuth 2.0 Client ID
   - Set redirect URI to `http://localhost:3000/oauth2callback`

3. **Configure Authentication**:
   ```bash
   # The server will create ~/.apps-script-mcp/config.json automatically
   # Edit it with your credentials:
   {
     "clientId": "YOUR_CLIENT_ID",
     "clientSecret": "YOUR_CLIENT_SECRET",
     "redirectUri": "http://localhost:3000/oauth2callback",
     "tokenPath": "~/.apps-script-mcp/tokens.json"
   }
   ```

## Usage

### As MCP Server

Add to your MCP client configuration:

```json
{
  "mcpServers": {
    "apps-script": {
      "command": "node",
      "args": ["/path/to/apps-script-mcp/build/index.js"]
    }
  }
}
```

### Direct Usage

```bash
# Start the server
npm start

# Or run in development mode
npm run dev
```

## Available Tools

### 1. list_apps_script_projects
List all accessible Apps Script projects with optional filtering.

**Parameters:**
- `pageSize` (number, optional): Maximum projects to return (1-100)
- `pageToken` (string, optional): Pagination token
- `searchQuery` (string, optional): Filter by project title

### 2. get_apps_script_project
Get complete project content including all files.

**Parameters:**
- `scriptId` (string, required): The Apps Script project ID

### 3. create_apps_script_project
Create a new Apps Script project.

**Parameters:**
- `title` (string, required): Project title
- `parentId` (string, optional): Drive folder ID or bound container ID
- `files` (array, optional): Initial files to create

### 4. update_apps_script_project
Update project files.

**Parameters:**
- `scriptId` (string, required): The Apps Script project ID
- `files` (array, required): Files to update or add

### 5. deploy_apps_script
Create a deployment for the script.

**Parameters:**
- `scriptId` (string, required): The Apps Script project ID
- `versionNumber` (number, optional): Version number to deploy
- `description` (string, optional): Deployment description
- `manifestFileName` (string, optional): Manifest file name

### 6. execute_apps_script_function
Run a function in the script.

**Parameters:**
- `scriptId` (string, required): The Apps Script project ID
- `functionName` (string, required): Function name to execute
- `parameters` (array, optional): Function parameters
- `devMode` (boolean, optional): Run in development mode

### 7. get_execution_logs
Retrieve script execution logs.

**Parameters:**
- `scriptId` (string, required): The Apps Script project ID
- `limit` (number, optional): Maximum number of log entries

## Example Usage

```javascript
// List all projects
const projects = await mcpClient.callTool("list_apps_script_projects", {
  pageSize: 10,
  searchQuery: "color"
});

// Get specific project
const project = await mcpClient.callTool("get_apps_script_project", {
  scriptId: "13k7BOpOU3Pt3xCPi3rAldNS4orCq00pfb1TWg6h57ChFunyktDHj9hTh"
});

// Update project files
await mcpClient.callTool("update_apps_script_project", {
  scriptId: "13k7BOpOU3Pt3xCPi3rAldNS4orCq00pfb1TWg6h57ChFunyktDHj9hTh",
  files: [
    {
      name: "Code.gs",
      type: "SERVER_JS",
      source: "function myFunction() { console.log('Hello World!'); }"
    }
  ]
});

// Execute a function
const result = await mcpClient.callTool("execute_apps_script_function", {
  scriptId: "13k7BOpOU3Pt3xCPi3rAldNS4orCq00pfb1TWg6h57ChFunyktDHj9hTh",
  functionName: "myFunction",
  parameters: []
});
```

## Error Handling

The server provides detailed error messages for common issues:

- **Authentication errors**: "No valid authentication found. Please run authentication flow."
- **Project not found**: "Script not found. Use list_apps_script_projects to find valid IDs"
- **Rate limit exceeded**: "Rate limit exceeded. Retrying in X seconds..."
- **Missing scopes**: "Missing OAuth scope: https://www.googleapis.com/auth/script.projects"

## Security

- OAuth tokens are stored securely in the user's home directory
- Tokens are automatically refreshed when expired
- Minimal OAuth scopes are requested
- No sensitive data is logged

## API Quotas

The server respects Google Apps Script API quotas:
- 30 requests per minute per user
- Automatic retry with exponential backoff
- Caching for frequently accessed data

## Development

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Run in development mode
npm run dev

# Run tests
npm test
```

## License

MIT License - See LICENSE file for details.