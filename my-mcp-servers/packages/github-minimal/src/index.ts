#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

// GitHub API interaction (simplified)
class GitHubAPI {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`https://api.github.com${endpoint}`, {
      ...options,
      headers: {
        "Authorization": `Bearer ${this.token}`,
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "mcp-github-minimal",
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getFileContents(owner: string, repo: string, path: string) {
    return this.request(`/repos/${owner}/${repo}/contents/${path}`);
  }

  async createOrUpdateFile(owner: string, repo: string, path: string, content: string, message: string, sha?: string) {
    return this.request(`/repos/${owner}/${repo}/contents/${path}`, {
      method: "PUT",
      body: JSON.stringify({
        message,
        content: Buffer.from(content).toString("base64"),
        ...(sha && { sha }),
      }),
    });
  }

  async pushFiles(owner: string, repo: string, ref: string, tree: any[], message: string) {
    // Simplified push implementation
    return this.request(`/repos/${owner}/${repo}/git/refs/heads/${ref}`, {
      method: "PATCH",
      body: JSON.stringify({
        sha: "latest",
      }),
    });
  }

  async searchRepositories(query: string, limit: number = 10) {
    return this.request(`/search/repositories?q=${encodeURIComponent(query)}&per_page=${limit}`);
  }
}

// Tool schemas
const GetFileContentsSchema = z.object({
  owner: z.string().describe("Repository owner"),
  repo: z.string().describe("Repository name"),
  path: z.string().describe("File path in repository"),
});

const CreateOrUpdateFileSchema = z.object({
  owner: z.string().describe("Repository owner"),
  repo: z.string().describe("Repository name"),
  path: z.string().describe("File path in repository"),
  content: z.string().describe("File content"),
  message: z.string().describe("Commit message"),
  sha: z.string().optional().describe("File SHA (for updates)"),
});

const PushFilesSchema = z.object({
  owner: z.string().describe("Repository owner"),
  repo: z.string().describe("Repository name"),
  ref: z.string().describe("Branch reference"),
  message: z.string().describe("Commit message"),
});

const SearchRepositoriesSchema = z.object({
  query: z.string().describe("Search query"),
  limit: z.number().optional().default(10).describe("Maximum number of results"),
});

// Initialize GitHub API
const githubToken = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
if (!githubToken) {
  console.error("Error: GITHUB_PERSONAL_ACCESS_TOKEN environment variable is required");
  process.exit(1);
}

const github = new GitHubAPI(githubToken);

// Define available tools (only 4 essential tools)
const tools: Tool[] = [
  {
    name: "get_file_contents",
    description: "Read repository files from GitHub",
    inputSchema: {
      type: "object",
      properties: GetFileContentsSchema.shape,
      required: ["owner", "repo", "path"],
    },
  },
  {
    name: "create_or_update_file",
    description: "Create or update repository files on GitHub",
    inputSchema: {
      type: "object",
      properties: CreateOrUpdateFileSchema.shape,
      required: ["owner", "repo", "path", "content", "message"],
    },
  },
  {
    name: "push_files",
    description: "Push files to GitHub repository",
    inputSchema: {
      type: "object",
      properties: PushFilesSchema.shape,
      required: ["owner", "repo", "ref", "message"],
    },
  },
  {
    name: "search_repositories",
    description: "Search for repositories on GitHub",
    inputSchema: {
      type: "object",
      properties: SearchRepositoriesSchema.shape,
      required: ["query"],
    },
  },
];

// Create MCP server
const server = new Server(
  {
    name: "github-minimal",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List tools handler
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools,
}));

// Call tool handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "get_file_contents": {
        const { owner, repo, path } = GetFileContentsSchema.parse(args);
        const result = await github.getFileContents(owner, repo, path);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "create_or_update_file": {
        const { owner, repo, path, content, message, sha } = CreateOrUpdateFileSchema.parse(args);
        const result = await github.createOrUpdateFile(owner, repo, path, content, message, sha);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "push_files": {
        const { owner, repo, ref, message } = PushFilesSchema.parse(args);
        const result = await github.pushFiles(owner, repo, ref, [], message);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "search_repositories": {
        const { query, limit } = SearchRepositoriesSchema.parse(args);
        const result = await github.searchRepositories(query, limit);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
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

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("GitHub Minimal MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
