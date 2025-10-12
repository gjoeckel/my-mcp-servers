/**
 * Agent Monitoring System
 * Monitors JSON files for instructions and processes them
 */

class AgentMonitor {
    constructor() {
        this.dataPath = './data/';
        this.pollingInterval = 30000; // 30 seconds
        this.heartbeatInterval = 120000; // 2 minutes
        this.isRunning = false;
        this.currentTask = null;
        
        this.initialize();
    }

    async initialize() {
        try {
            console.log('🤖 Agent Monitor initialized');
            this.startPolling();
            this.startHeartbeat();
        } catch (error) {
            console.error('Failed to initialize agent monitor:', error);
        }
    }

    startPolling() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        console.log('🔄 Starting instruction polling...');
        
        setInterval(async () => {
            try {
                await this.checkForInstructions();
            } catch (error) {
                console.error('Polling error:', error);
            }
        }, this.pollingInterval);
    }

    startHeartbeat() {
        setInterval(async () => {
            try {
                await this.updateHeartbeat();
            } catch (error) {
                console.error('Heartbeat error:', error);
            }
        }, this.heartbeatInterval);
    }

    async checkForInstructions() {
        try {
            const instructions = await this.readInstructions();
            const pendingInstructions = instructions.instructions.filter(
                inst => !inst.processed_by_agent && inst.status === 'pending'
            );

            if (pendingInstructions.length > 0) {
                console.log(`📥 Found ${pendingInstructions.length} pending instructions`);
                
                for (const instruction of pendingInstructions) {
                    await this.processInstruction(instruction);
                }
            }
        } catch (error) {
            console.error('Error checking instructions:', error);
        }
    }

    async processInstruction(instruction) {
        try {
            console.log(`🔄 Processing instruction: ${instruction.id}`);
            this.currentTask = `Processing ${instruction.type}: ${instruction.tool || instruction.message}`;
            
            // Mark as processing
            await this.updateInstructionStatus(instruction.id, 'processing');
            
            let result = null;
            
            switch (instruction.type) {
                case 'run_tool':
                    result = await this.runTool(instruction);
                    break;
                case 'freeform':
                    result = await this.processFreeformInstruction(instruction);
                    break;
                default:
                    throw new Error(`Unknown instruction type: ${instruction.type}`);
            }
            
            // Mark as completed
            await this.updateInstructionStatus(instruction.id, 'completed');
            
            // Save result
            if (result) {
                await this.saveResult(instruction, result);
            }
            
            console.log(`✅ Completed instruction: ${instruction.id}`);
            this.currentTask = null;
            
        } catch (error) {
            console.error(`❌ Error processing instruction ${instruction.id}:`, error);
            await this.updateInstructionStatus(instruction.id, 'failed');
            await this.saveError(instruction, error);
            this.currentTask = null;
        }
    }

    async runTool(instruction) {
        const { tool, document_id, document_name } = instruction;
        
        console.log(`🔧 Running tool: ${tool} on document: ${document_name}`);
        
        // Simulate tool execution (replace with actual tool logic)
        const result = {
            tool: tool,
            document_id: document_id,
            document_name: document_name,
            status: 'complete',
            summary: {
                total_checks: Math.floor(Math.random() * 50) + 10,
                violations: Math.floor(Math.random() * 20),
                warnings: Math.floor(Math.random() * 10),
                passed: Math.floor(Math.random() * 30) + 5
            },
            details: {
                violations: this.generateSampleViolations(tool)
            },
            execution_time: Math.floor(Math.random() * 5000) + 1000,
            timestamp: new Date().toISOString()
        };
        
        return result;
    }

    async processFreeformInstruction(instruction) {
        const { message } = instruction;
        
        console.log(`💬 Processing freeform instruction: ${message}`);
        
        // Simulate processing (replace with actual logic)
        const result = {
            type: 'freeform_response',
            message: message,
            response: `Processed instruction: "${message}". This is a simulated response.`,
            status: 'complete',
            timestamp: new Date().toISOString()
        };
        
        return result;
    }

    generateSampleViolations(tool) {
        const violations = [];
        const count = Math.floor(Math.random() * 5) + 1;
        
        for (let i = 0; i < count; i++) {
            violations.push({
                type: 'contrast_ratio',
                severity: Math.random() > 0.5 ? 'AA_fail' : 'AAA_fail',
                location: `Page ${Math.floor(Math.random() * 5) + 1}, Paragraph ${Math.floor(Math.random() * 10) + 1}`,
                foreground: this.getRandomColor(),
                background: this.getRandomColor(),
                ratio: (Math.random() * 3 + 1).toFixed(1),
                required: Math.random() > 0.5 ? '4.5' : '7.0',
                suggestion: 'Use a darker color for better contrast'
            });
        }
        
        return violations;
    }

    getRandomColor() {
        const colors = ['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#808080', '#800000', '#008000', '#000080'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    async readInstructions() {
        try {
            const fs = require('fs').promises;
            const data = await fs.readFile(`${this.dataPath}instructions.json`, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error reading instructions:', error);
            return { version: '1.0', instructions: [] };
        }
    }

    async updateInstructionStatus(instructionId, status) {
        try {
            const instructions = await this.readInstructions();
            const instruction = instructions.instructions.find(inst => inst.id === instructionId);
            
            if (instruction) {
                instruction.status = status;
                instruction.processed_by_agent = true;
                instruction.processed_at = new Date().toISOString();
                
                const fs = require('fs').promises;
                await fs.writeFile(`${this.dataPath}instructions.json`, JSON.stringify(instructions, null, 2));
            }
        } catch (error) {
            console.error('Error updating instruction status:', error);
        }
    }

    async saveResult(instruction, result) {
        try {
            const results = await this.readResults();
            
            const resultEntry = {
                id: `result_${Date.now()}`,
                instruction_id: instruction.id,
                timestamp: new Date().toISOString(),
                ...result
            };
            
            results.results.push(resultEntry);
            
            const fs = require('fs').promises;
            await fs.writeFile(`${this.dataPath}results.json`, JSON.stringify(results, null, 2));
            
            console.log(`💾 Saved result: ${resultEntry.id}`);
        } catch (error) {
            console.error('Error saving result:', error);
        }
    }

    async saveError(instruction, error) {
        try {
            const results = await this.readResults();
            
            const errorEntry = {
                id: `error_${Date.now()}`,
                instruction_id: instruction.id,
                timestamp: new Date().toISOString(),
                type: 'error',
                message: error.message,
                stack: error.stack,
                status: 'failed'
            };
            
            results.results.push(errorEntry);
            
            const fs = require('fs').promises;
            await fs.writeFile(`${this.dataPath}results.json`, JSON.stringify(results, null, 2));
            
            console.log(`💾 Saved error: ${errorEntry.id}`);
        } catch (error) {
            console.error('Error saving error:', error);
        }
    }

    async readResults() {
        try {
            const fs = require('fs').promises;
            const data = await fs.readFile(`${this.dataPath}results.json`, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error reading results:', error);
            return { version: '1.0', results: [] };
        }
    }

    async updateHeartbeat() {
        try {
            const status = {
                agent: {
                    last_heartbeat: new Date().toISOString(),
                    status: this.isRunning ? 'active' : 'inactive',
                    current_task: this.currentTask || 'Monitoring for instructions',
                    pending_instructions: await this.getPendingInstructionCount(),
                    completed_today: await this.getCompletedTodayCount()
                },
                deployment: {
                    last_deploy: new Date().toISOString(),
                    github_pages_status: 'live',
                    version: '0.1.0'
                }
            };
            
            const fs = require('fs').promises;
            await fs.writeFile(`${this.dataPath}status.json`, JSON.stringify(status, null, 2));
            
            console.log('💓 Heartbeat updated');
        } catch (error) {
            console.error('Error updating heartbeat:', error);
        }
    }

    async getPendingInstructionCount() {
        try {
            const instructions = await this.readInstructions();
            return instructions.instructions.filter(
                inst => !inst.processed_by_agent && inst.status === 'pending'
            ).length;
        } catch (error) {
            return 0;
        }
    }

    async getCompletedTodayCount() {
        try {
            const results = await this.readResults();
            const today = new Date().toISOString().split('T')[0];
            return results.results.filter(
                result => result.timestamp.startsWith(today) && result.status === 'complete'
            ).length;
        } catch (error) {
            return 0;
        }
    }

    stop() {
        this.isRunning = false;
        console.log('🛑 Agent monitor stopped');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AgentMonitor;
}

// Auto-start if running directly
if (require.main === module) {
    const monitor = new AgentMonitor();
    
    // Graceful shutdown
    process.on('SIGINT', () => {
        console.log('\n🛑 Shutting down agent monitor...');
        monitor.stop();
        process.exit(0);
    });
}