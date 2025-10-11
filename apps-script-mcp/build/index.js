#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { AppsScriptAuth } from "./auth.js";
import { AppsScriptApiClient } from "./api-client.js";
import { APPS_SCRIPT_TOOLS } from "./tools.js";
class AppsScriptMCPServer {
    server;
    auth;
    apiClient = null;
    constructor() {
        this.server = new Server({
            name: "apps-script-mcp",
            version: "1.0.0",
        }, {
            capabilities: {
                tools: {},
            },
        });
        this.auth = new AppsScriptAuth();
        this.setupHandlers();
    }
    setupHandlers() {
        // List tools handler
        this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
            tools: APPS_SCRIPT_TOOLS,
        }));
        // Call tool handler
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;
            try {
                // Ensure we have an authenticated client
                if (!this.apiClient) {
                    const authClient = await this.auth.getAuthenticatedClient();
                    this.apiClient = new AppsScriptApiClient(authClient);
                }
                switch (name) {
                    case "list_apps_script_projects":
                        return await this.handleListProjects(args);
                    case "get_apps_script_project":
                        return await this.handleGetProject(args);
                    case "create_apps_script_project":
                        return await this.handleCreateProject(args);
                    case "update_apps_script_project":
                        return await this.handleUpdateProject(args);
                    case "deploy_apps_script":
                        return await this.handleDeployScript(args);
                    case "execute_apps_script_function":
                        return await this.handleExecuteFunction(args);
                    case "get_execution_logs":
                        return await this.handleGetLogs(args);
                    default:
                        throw new Error(`Unknown tool: ${name}`);
                }
            }
            catch (error) {
                return {
                    content: [
                        {
                            type: "text",
                            text: `Error: ${error instanceof Error ? error.message : String(error)}`,
                        },
                    ],
                    isError: true,
                };
            }
        });
    }
    async handleListProjects(args) {
        const { pageSize = 50, pageToken, searchQuery } = args;
        const result = await this.apiClient.listProjects(pageSize, pageToken, searchQuery);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        projects: result.projects,
                        nextPageToken: result.nextPageToken,
                        total: result.projects.length
                    }, null, 2),
                },
            ],
        };
    }
    async handleGetProject(args) {
        const { scriptId } = args;
        const project = await this.apiClient.getProject(scriptId);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(project, null, 2),
                },
            ],
        };
    }
    async handleCreateProject(args) {
        const { title, parentId, files = [] } = args;
        const project = await this.apiClient.createProject(title, files, parentId);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        message: "Project created successfully",
                        project
                    }, null, 2),
                },
            ],
        };
    }
    async handleUpdateProject(args) {
        const { scriptId, files } = args;
        const project = await this.apiClient.updateProject(scriptId, files);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        message: "Project updated successfully",
                        project
                    }, null, 2),
                },
            ],
        };
    }
    async handleDeployScript(args) {
        const { scriptId, versionNumber, description, manifestFileName } = args;
        const deployment = await this.apiClient.createDeployment(scriptId, versionNumber, description, manifestFileName);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        message: "Deployment created successfully",
                        deployment
                    }, null, 2),
                },
            ],
        };
    }
    async handleExecuteFunction(args) {
        const { scriptId, functionName, parameters = [], devMode = true } = args;
        const result = await this.apiClient.executeFunction(scriptId, functionName, parameters, devMode);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        message: "Function executed",
                        result
                    }, null, 2),
                },
            ],
        };
    }
    async handleGetLogs(args) {
        const { scriptId, limit = 100 } = args;
        const logs = await this.apiClient.getExecutionLogs(scriptId, limit);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        message: "Execution logs retrieved",
                        logs
                    }, null, 2),
                },
            ],
        };
    }
    async start() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.error("Apps Script MCP Server running on stdio");
    }
}
// Start the server
const server = new AppsScriptMCPServer();
server.start().catch((error) => {
    console.error("Server error:", error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map