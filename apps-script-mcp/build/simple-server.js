#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { AppsScriptAuth } from "./auth.js";
import { SimpleAppsScriptClient } from "./simple-api-client.js";
const SIMPLE_TOOLS = [
    {
        name: "get_apps_script_project",
        description: "Get complete project content including all files",
        inputSchema: {
            type: "object",
            properties: {
                scriptId: {
                    type: "string",
                    description: "The Apps Script project ID"
                }
            },
            required: ["scriptId"]
        }
    },
    {
        name: "update_apps_script_project",
        description: "Update project files",
        inputSchema: {
            type: "object",
            properties: {
                scriptId: {
                    type: "string",
                    description: "The Apps Script project ID"
                },
                files: {
                    type: "array",
                    description: "Files to update or add",
                    items: {
                        type: "object",
                        properties: {
                            name: { type: "string", description: "File name" },
                            type: {
                                type: "string",
                                enum: ["SERVER_JS", "HTML", "JSON"],
                                description: "File type"
                            },
                            source: { type: "string", description: "File content" }
                        },
                        required: ["name", "type", "source"]
                    }
                }
            },
            required: ["scriptId", "files"]
        }
    },
    {
        name: "execute_apps_script_function",
        description: "Run a function in the script",
        inputSchema: {
            type: "object",
            properties: {
                scriptId: {
                    type: "string",
                    description: "The Apps Script project ID"
                },
                functionName: {
                    type: "string",
                    description: "Function name to execute"
                },
                parameters: {
                    type: "array",
                    description: "Function parameters",
                    items: { type: "any" }
                },
                devMode: {
                    type: "boolean",
                    default: true,
                    description: "Run in development mode"
                }
            },
            required: ["scriptId", "functionName"]
        }
    }
];
class SimpleAppsScriptServer {
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
            tools: SIMPLE_TOOLS,
        }));
        // Call tool handler
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;
            try {
                // Ensure we have an authenticated client
                if (!this.apiClient) {
                    const authClient = await this.auth.getAuthenticatedClient();
                    this.apiClient = new SimpleAppsScriptClient(authClient);
                }
                switch (name) {
                    case "get_apps_script_project":
                        return await this.handleGetProject(args);
                    case "update_apps_script_project":
                        return await this.handleUpdateProject(args);
                    case "execute_apps_script_function":
                        return await this.handleExecuteFunction(args);
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
    async start() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.error("Simple Apps Script MCP Server running on stdio");
    }
}
// Start the server
const server = new SimpleAppsScriptServer();
server.start().catch((error) => {
    console.error("Server error:", error);
    process.exit(1);
});
//# sourceMappingURL=simple-server.js.map