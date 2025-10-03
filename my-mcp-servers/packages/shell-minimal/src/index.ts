import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { spawn } from 'child_process';
import { promisify } from 'util';
import { exec } from 'child_process';

const execAsync = promisify(exec);

const server = new Server(
  {
    name: 'shell-minimal',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Get allowed commands from environment or use default
const getAllowedCommands = (): string[] => {
  const allowed = process.env.ALLOWED_COMMANDS;
  if (allowed) {
    return allowed.split(',').map(cmd => cmd.trim());
  }
  return ['npm', 'git', 'node', 'php', 'composer', 'curl', 'wget', 'ls', 'cat', 'grep', 'find', 'chmod', 'chown', 'mkdir', 'rm', 'cp', 'mv'];
};

// Get working directory from environment
const getWorkingDirectory = (): string => {
  return process.env.WORKING_DIRECTORY || process.cwd();
};

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'execute_command',
        description: 'Execute a shell command with security restrictions',
        inputSchema: {
          type: 'object',
          properties: {
            command: {
              type: 'string',
              description: 'The command to execute (must be in allowed commands list)',
            },
            args: {
              type: 'array',
              items: { type: 'string' },
              description: 'Command arguments',
            },
            workingDirectory: {
              type: 'string',
              description: 'Working directory for the command (optional)',
            },
          },
          required: ['command'],
        },
      },
      {
        name: 'list_processes',
        description: 'List running processes',
        inputSchema: {
          type: 'object',
          properties: {
            filter: {
              type: 'string',
              description: 'Optional filter for process names',
            },
          },
        },
      },
      {
        name: 'kill_process',
        description: 'Kill a process by PID',
        inputSchema: {
          type: 'object',
          properties: {
            pid: {
              type: 'number',
              description: 'Process ID to kill',
            },
            signal: {
              type: 'string',
              description: 'Signal to send (default: SIGTERM)',
              default: 'SIGTERM',
            },
          },
          required: ['pid'],
        },
      },
      {
        name: 'get_environment',
        description: 'Get environment variables and system information',
        inputSchema: {
          type: 'object',
          properties: {
            variable: {
              type: 'string',
              description: 'Specific environment variable to get (optional)',
            },
          },
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'execute_command': {
        const { command, args: commandArgs = [], workingDirectory } = args as {
          command: string;
          args?: string[];
          workingDirectory?: string;
        };

        const allowedCommands = getAllowedCommands();
        const baseCommand = command.split(' ')[0];

        if (!allowedCommands.includes(baseCommand)) {
          throw new Error(`Command '${baseCommand}' is not in the allowed commands list: ${allowedCommands.join(', ')}`);
        }

        const fullCommand = commandArgs.length > 0 ? `${command} ${commandArgs.join(' ')}` : command;
        const cwd = workingDirectory || getWorkingDirectory();

        const { stdout, stderr } = await execAsync(fullCommand, {
          cwd,
          timeout: 30000, // 30 second timeout
        });

        return {
          content: [
            {
              type: 'text',
              text: `Command: ${fullCommand}\nWorking Directory: ${cwd}\n\nSTDOUT:\n${stdout}\n\nSTDERR:\n${stderr}`,
            },
          ],
        };
      }

      case 'list_processes': {
        const { filter } = args as { filter?: string };

        let psCommand = 'ps aux';
        if (filter) {
          psCommand += ` | grep "${filter}"`;
        }

        const { stdout } = await execAsync(psCommand);

        return {
          content: [
            {
              type: 'text',
              text: `Process List${filter ? ` (filtered by: ${filter})` : ''}:\n\n${stdout}`,
            },
          ],
        };
      }

      case 'kill_process': {
        const { pid, signal = 'SIGTERM' } = args as { pid: number; signal?: string };

        if (typeof pid !== 'number' || pid <= 0) {
          throw new Error('Invalid PID: must be a positive number');
        }

        // Check if process exists
        try {
          await execAsync(`kill -0 ${pid}`);
        } catch (error) {
          throw new Error(`Process with PID ${pid} does not exist or cannot be accessed`);
        }

        await execAsync(`kill -${signal} ${pid}`);

        return {
          content: [
            {
              type: 'text',
              text: `Successfully sent ${signal} signal to process ${pid}`,
            },
          ],
        };
      }

      case 'get_environment': {
        const { variable } = args as { variable?: string };

        if (variable) {
          const value = process.env[variable];
          return {
            content: [
              {
                type: 'text',
                text: `${variable}=${value || '(not set)'}`,
              },
            ],
          };
        } else {
          const envInfo = {
            'Working Directory': getWorkingDirectory(),
            'Allowed Commands': getAllowedCommands().join(', '),
            'Node.js Version': process.version,
            'Platform': process.platform,
            'Architecture': process.arch,
            'User': process.env.USER || process.env.USERNAME || 'unknown',
            'Home Directory': process.env.HOME || process.env.USERPROFILE || 'unknown',
          };

          const envText = Object.entries(envInfo)
            .map(([key, value]) => `${key}: ${value}`)
            .join('\n');

          return {
            content: [
              {
                type: 'text',
                text: `Environment Information:\n\n${envText}`,
              },
            ],
          };
        }
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Shell minimal MCP server running');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

