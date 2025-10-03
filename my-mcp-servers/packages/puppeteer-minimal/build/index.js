#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import puppeteer from "puppeteer";
// Puppeteer API wrapper (simplified)
class PuppeteerAPI {
    browser = null;
    page = null;
    async initialize() {
        if (!this.browser) {
            this.browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
        }
        if (!this.page) {
            this.page = await this.browser.newPage();
        }
    }
    async navigate(url) {
        await this.initialize();
        if (!this.page)
            throw new Error("Page not initialized");
        await this.page.goto(url, { waitUntil: 'networkidle2' });
        return { url: this.page.url(), title: await this.page.title() };
    }
    async takeScreenshot(options = {}) {
        await this.initialize();
        if (!this.page)
            throw new Error("Page not initialized");
        const screenshot = await this.page.screenshot({
            fullPage: options.fullPage || false
        });
        return Buffer.from(screenshot).toString('base64');
    }
    async extractText(selector) {
        await this.initialize();
        if (!this.page)
            throw new Error("Page not initialized");
        if (selector) {
            return await this.page.evaluate((sel) => {
                const element = document.querySelector(sel);
                return element ? element.innerText : '';
            }, selector);
        }
        return await this.page.evaluate(() => document.body.innerText);
    }
    async clickElement(selector) {
        await this.initialize();
        if (!this.page)
            throw new Error("Page not initialized");
        await this.page.click(selector);
        return { action: 'clicked', selector };
    }
    async close() {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
            this.page = null;
        }
    }
}
// Tool schemas
const NavigateSchema = z.object({
    url: z.string().describe("URL to navigate to"),
});
const TakeScreenshotSchema = z.object({
    fullPage: z.boolean().optional().describe("Take full page screenshot"),
    quality: z.number().min(0).max(100).optional().describe("Screenshot quality (0-100)"),
});
const ExtractTextSchema = z.object({
    selector: z.string().optional().describe("CSS selector to extract text from (default: body)"),
});
const ClickElementSchema = z.object({
    selector: z.string().describe("CSS selector of element to click"),
});
// Initialize Puppeteer API
const puppeteerAPI = new PuppeteerAPI();
// Define available tools (only 4 essential tools)
const tools = [
    {
        name: "navigate",
        description: "Navigate to a URL in the browser",
        inputSchema: {
            type: "object",
            properties: NavigateSchema.shape,
            required: ["url"],
        },
    },
    {
        name: "take_screenshot",
        description: "Take a screenshot of the current page",
        inputSchema: {
            type: "object",
            properties: TakeScreenshotSchema.shape,
            required: [],
        },
    },
    {
        name: "extract_text",
        description: "Extract text content from the current page",
        inputSchema: {
            type: "object",
            properties: ExtractTextSchema.shape,
            required: [],
        },
    },
    {
        name: "click_element",
        description: "Click an element on the current page",
        inputSchema: {
            type: "object",
            properties: ClickElementSchema.shape,
            required: ["selector"],
        },
    },
];
// Create MCP server
const server = new Server({
    name: "puppeteer-minimal",
    version: "1.0.0",
}, {
    capabilities: {
        tools: {},
    },
});
// List tools handler
server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools,
}));
// Call tool handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    try {
        switch (name) {
            case "navigate": {
                const { url } = NavigateSchema.parse(args);
                const result = await puppeteerAPI.navigate(url);
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(result, null, 2),
                        },
                    ],
                };
            }
            case "take_screenshot": {
                const options = TakeScreenshotSchema.parse(args);
                const screenshot = await puppeteerAPI.takeScreenshot(options);
                return {
                    content: [
                        {
                            type: "text",
                            text: `Screenshot taken (${screenshot.length} characters): ${screenshot.substring(0, 100)}...`,
                        },
                    ],
                };
            }
            case "extract_text": {
                const { selector } = ExtractTextSchema.parse(args);
                const text = await puppeteerAPI.extractText(selector);
                return {
                    content: [
                        {
                            type: "text",
                            text: selector ? `Text from ${selector}: ${text}` : text,
                        },
                    ],
                };
            }
            case "click_element": {
                const { selector } = ClickElementSchema.parse(args);
                const result = await puppeteerAPI.clickElement(selector);
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
// Graceful shutdown
process.on('SIGINT', async () => {
    await puppeteerAPI.close();
    process.exit(0);
});
process.on('SIGTERM', async () => {
    await puppeteerAPI.close();
    process.exit(0);
});
// Start server
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Puppeteer Minimal MCP Server running on stdio");
}
main().catch((error) => {
    console.error("Server error:", error);
    puppeteerAPI.close().finally(() => process.exit(1));
});
//# sourceMappingURL=index.js.map