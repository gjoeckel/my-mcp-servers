export const APPS_SCRIPT_TOOLS = [
    {
        name: "list_apps_script_projects",
        description: "List all Apps Script projects accessible to the user",
        inputSchema: {
            type: "object",
            properties: {
                pageSize: {
                    type: "number",
                    default: 50,
                    description: "Maximum number of projects to return (1-100)"
                },
                pageToken: {
                    type: "string",
                    description: "Token for pagination"
                },
                searchQuery: {
                    type: "string",
                    description: "Filter projects by title"
                }
            }
        }
    },
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
        name: "create_apps_script_project",
        description: "Create new Apps Script project",
        inputSchema: {
            type: "object",
            properties: {
                title: {
                    type: "string",
                    description: "Project title"
                },
                parentId: {
                    type: "string",
                    description: "Drive folder ID or bound container ID"
                },
                files: {
                    type: "array",
                    description: "Initial files to create",
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
            required: ["title"]
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
        name: "deploy_apps_script",
        description: "Create deployment for script",
        inputSchema: {
            type: "object",
            properties: {
                scriptId: {
                    type: "string",
                    description: "The Apps Script project ID"
                },
                versionNumber: {
                    type: "number",
                    description: "Version number to deploy"
                },
                description: {
                    type: "string",
                    description: "Deployment description"
                },
                manifestFileName: {
                    type: "string",
                    default: "appsscript",
                    description: "Manifest file name"
                }
            },
            required: ["scriptId"]
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
    },
    {
        name: "get_execution_logs",
        description: "Retrieve script execution logs",
        inputSchema: {
            type: "object",
            properties: {
                scriptId: {
                    type: "string",
                    description: "The Apps Script project ID"
                },
                limit: {
                    type: "number",
                    default: 100,
                    description: "Maximum number of log entries"
                }
            },
            required: ["scriptId"]
        }
    }
];
//# sourceMappingURL=tools.js.map