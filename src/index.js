import Anthropic from "@anthropic-ai/sdk";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import chokidar from "chokidar";
import { join } from "path";
class SimpleAutonomousAssistant {
  constructor(config) { this.config = config; this.anthropic = new Anthropic({ apiKey: config.anthropicApiKey }); this.mcpClient = null; this.watcher = null; this.isRunning = false; }
  async initialize() { console.log("🚀 Initializing..."); await this.connectMCP(); this.setupWatcher(); this.isRunning = true; console.log("✅ Assistant running!"); console.log(`👀 Watching: ${this.config.projectPath}`); console.log("   Ctrl+C to stop\n"); }
  async connectMCP() { try { const transport = new StdioClientTransport({ command: "npx", args: ["-y", "@modelcontextprotocol/server-shell"], env: { ...process.env, ALLOWED_COMMANDS: "npm,git,ls,pwd" } }); this.mcpClient = new Client({ name: "autonomous-assistant", version: "1.0.0" }, { capabilities: { tools: {} } }); await this.mcpClient.connect(transport); console.log("✅ Connected to MCP Shell"); } catch (error) { console.error("❌ MCP connection failed:", error.message); } }
  setupWatcher() { const pattern = join(this.config.projectPath, "src/**/*.{js,ts,jsx,tsx}"); this.watcher = chokidar.watch(pattern, { ignored: /(^|[\/\\])\../, persistent: true, ignoreInitial: true, awaitWriteFinish: { stabilityThreshold: 1000, pollInterval: 100 } }); this.watcher.on("change", async (path) => { console.log(`\n📝 File changed: ${path.replace(this.config.projectPath, '.')}`); await this.handleFileChange(path); }); console.log("✅ File watcher active"); }
  async handleFileChange(filePath) { console.log("🎯 Auto-lint goal triggered"); try { console.log("   Running: npm run lint:fix"); const result = await this.mcpClient.callTool({ name: "execute_command", arguments: { command: "npm run lint:fix", workingDirectory: this.config.projectPath } }); console.log("✅ Lint completed\n"); } catch (error) { console.error("❌ Failed:", error.message, "\n"); } }
  async shutdown() { console.log("\n🛑 Shutting down..."); if (this.watcher) await this.watcher.close(); if (this.mcpClient) await this.mcpClient.close(); console.log("✅ Goodbye!"); }
}
const config = { anthropicApiKey: process.env.ANTHROPIC_API_KEY, projectPath: process.env.PROJECT_PATH || process.cwd() };
const assistant = new SimpleAutonomousAssistant(config);
process.on("SIGINT", async () => { await assistant.shutdown(); process.exit(0); });
assistant.initialize().catch(console.error);
