/**
 * Agent Monitor
 * Monitors and manages mobile agent activities and test results
 */

class AgentMonitor {
    constructor() {
        this.agents = new Map();
        this.testResults = [];
        this.maxHistoryItems = 50;
        this.monitoringInterval = null;
        this.isMonitoring = false;
        
        this.initializeStorage();
        this.bindEvents();
    }

    /**
     * Initialize local storage for agent data
     */
    initializeStorage() {
        // Load existing data
        const savedAgents = localStorage.getItem('agentMonitor_agents');
        const savedResults = localStorage.getItem('agentMonitor_results');
        
        if (savedAgents) {
            try {
                const agents = JSON.parse(savedAgents);
                agents.forEach(agent => {
                    this.agents.set(agent.id, agent);
                });
            } catch (e) {
                console.warn('Failed to load saved agents:', e);
            }
        }
        
        if (savedResults) {
            try {
                this.testResults = JSON.parse(savedResults);
            } catch (e) {
                console.warn('Failed to load saved results:', e);
            }
        }
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Listen for agent messages
        window.addEventListener('message', (event) => {
            this.handleAgentMessage(event);
        });

        // Listen for storage changes from other tabs
        window.addEventListener('storage', (event) => {
            if (event.key === 'agentMonitor_agents' || event.key === 'agentMonitor_results') {
                this.loadFromStorage();
            }
        });

        // Listen for page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseMonitoring();
            } else {
                this.resumeMonitoring();
            }
        });
    }

    /**
     * Register a new agent
     * @param {Object} agentInfo - Agent information
     * @returns {string} Agent ID
     */
    registerAgent(agentInfo) {
        const agentId = this.generateAgentId();
        const agent = {
            id: agentId,
            name: agentInfo.name || 'Unknown Agent',
            type: agentInfo.type || 'mobile',
            status: 'active',
            capabilities: agentInfo.capabilities || [],
            lastSeen: new Date().toISOString(),
            testCount: 0,
            successCount: 0,
            errorCount: 0,
            metadata: agentInfo.metadata || {}
        };

        this.agents.set(agentId, agent);
        this.saveToStorage();
        
        this.notify('Agent registered', `Agent ${agent.name} has been registered`, 'info');
        return agentId;
    }

    /**
     * Update agent status
     * @param {string} agentId - Agent ID
     * @param {Object} updates - Status updates
     */
    updateAgent(agentId, updates) {
        const agent = this.agents.get(agentId);
        if (!agent) {
            console.warn(`Agent ${agentId} not found`);
            return;
        }

        Object.assign(agent, updates, {
            lastSeen: new Date().toISOString()
        });

        this.agents.set(agentId, agent);
        this.saveToStorage();
    }

    /**
     * Record test result
     * @param {Object} testResult - Test result data
     */
    recordTestResult(testResult) {
        const result = {
            id: this.generateTestId(),
            timestamp: new Date().toISOString(),
            agentId: testResult.agentId,
            tool: testResult.tool,
            document: testResult.document,
            status: testResult.status || 'completed',
            score: testResult.score || 0,
            issues: testResult.issues || [],
            recommendations: testResult.recommendations || [],
            metadata: testResult.metadata || {}
        };

        this.testResults.unshift(result);
        
        // Keep only recent results
        if (this.testResults.length > this.maxHistoryItems) {
            this.testResults = this.testResults.slice(0, this.maxHistoryItems);
        }

        // Update agent statistics
        if (testResult.agentId) {
            this.updateAgentStats(testResult.agentId, testResult.status);
        }

        this.saveToStorage();
        this.notify('Test completed', `Test ${result.tool} completed with score ${result.score}`, 'success');
    }

    /**
     * Update agent statistics
     * @param {string} agentId - Agent ID
     * @param {string} status - Test status
     */
    updateAgentStats(agentId, status) {
        const agent = this.agents.get(agentId);
        if (!agent) return;

        agent.testCount++;
        if (status === 'completed' || status === 'success') {
            agent.successCount++;
        } else if (status === 'error' || status === 'failed') {
            agent.errorCount++;
        }

        this.agents.set(agentId, agent);
        this.saveToStorage();
    }

    /**
     * Get agent statistics
     * @param {string} agentId - Agent ID (optional)
     * @returns {Object} Statistics
     */
    getAgentStats(agentId = null) {
        if (agentId) {
            const agent = this.agents.get(agentId);
            return agent ? {
                name: agent.name,
                testCount: agent.testCount,
                successCount: agent.successCount,
                errorCount: agent.errorCount,
                successRate: agent.testCount > 0 ? (agent.successCount / agent.testCount * 100).toFixed(1) : 0,
                lastSeen: agent.lastSeen
            } : null;
        }

        // Overall statistics
        const allAgents = Array.from(this.agents.values());
        const totalTests = allAgents.reduce((sum, agent) => sum + agent.testCount, 0);
        const totalSuccess = allAgents.reduce((sum, agent) => sum + agent.successCount, 0);
        const totalErrors = allAgents.reduce((sum, agent) => sum + agent.errorCount, 0);

        return {
            totalAgents: allAgents.length,
            activeAgents: allAgents.filter(agent => agent.status === 'active').length,
            totalTests: totalTests,
            successRate: totalTests > 0 ? (totalSuccess / totalTests * 100).toFixed(1) : 0,
            errorRate: totalTests > 0 ? (totalErrors / totalTests * 100).toFixed(1) : 0
        };
    }

    /**
     * Get recent test results
     * @param {number} limit - Number of results to return
     * @returns {Array} Recent test results
     */
    getRecentResults(limit = 10) {
        return this.testResults.slice(0, limit);
    }

    /**
     * Start monitoring agents
     * @param {number} interval - Monitoring interval in milliseconds
     */
    startMonitoring(interval = 30000) {
        if (this.isMonitoring) return;

        this.isMonitoring = true;
        this.monitoringInterval = setInterval(() => {
            this.checkAgentHealth();
        }, interval);

        this.notify('Monitoring started', 'Agent monitoring is now active', 'info');
    }

    /**
     * Stop monitoring agents
     */
    stopMonitoring() {
        if (!this.isMonitoring) return;

        this.isMonitoring = false;
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            this.monitoringInterval = null;
        }

        this.notify('Monitoring stopped', 'Agent monitoring has been stopped', 'info');
    }

    /**
     * Pause monitoring
     */
    pauseMonitoring() {
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
        }
    }

    /**
     * Resume monitoring
     */
    resumeMonitoring() {
        if (this.isMonitoring && !this.monitoringInterval) {
            this.startMonitoring();
        }
    }

    /**
     * Check agent health
     */
    checkAgentHealth() {
        const now = new Date();
        const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

        this.agents.forEach((agent, agentId) => {
            const lastSeen = new Date(agent.lastSeen);
            if (lastSeen < fiveMinutesAgo && agent.status === 'active') {
                this.updateAgent(agentId, { status: 'inactive' });
                this.notify('Agent inactive', `Agent ${agent.name} has been inactive for 5+ minutes`, 'warning');
            }
        });
    }

    /**
     * Handle agent messages
     * @param {MessageEvent} event - Message event
     */
    handleAgentMessage(event) {
        if (event.data.type === 'agent_test_result') {
            this.recordTestResult(event.data);
        } else if (event.data.type === 'agent_status_update') {
            this.updateAgent(event.data.agentId, event.data.updates);
        }
    }

    /**
     * Send message to agent
     * @param {string} agentId - Agent ID
     * @param {Object} message - Message data
     */
    sendMessageToAgent(agentId, message) {
        const agent = this.agents.get(agentId);
        if (!agent) {
            console.warn(`Agent ${agentId} not found`);
            return;
        }

        // In a real implementation, this would send to the actual agent
        // For now, we'll just log it
        console.log(`Sending message to agent ${agentId}:`, message);
    }

    /**
     * Export data
     * @param {string} format - Export format ('json' or 'csv')
     * @returns {string} Exported data
     */
    exportData(format = 'json') {
        const data = {
            agents: Array.from(this.agents.values()),
            testResults: this.testResults,
            exportDate: new Date().toISOString()
        };

        if (format === 'json') {
            return JSON.stringify(data, null, 2);
        } else if (format === 'csv') {
            return this.convertToCSV(data);
        }

        return '';
    }

    /**
     * Convert data to CSV format
     * @param {Object} data - Data to convert
     * @returns {string} CSV data
     */
    convertToCSV(data) {
        const headers = ['Test ID', 'Timestamp', 'Agent', 'Tool', 'Status', 'Score', 'Issues Count'];
        const rows = data.testResults.map(result => [
            result.id,
            result.timestamp,
            result.agentId,
            result.tool,
            result.status,
            result.score,
            result.issues.length
        ]);

        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }

    /**
     * Clear all data
     */
    clearData() {
        this.agents.clear();
        this.testResults = [];
        this.saveToStorage();
        this.notify('Data cleared', 'All agent and test data has been cleared', 'info');
    }

    /**
     * Save data to storage
     */
    saveToStorage() {
        try {
            localStorage.setItem('agentMonitor_agents', JSON.stringify(Array.from(this.agents.values())));
            localStorage.setItem('agentMonitor_results', JSON.stringify(this.testResults));
        } catch (e) {
            console.error('Failed to save to storage:', e);
        }
    }

    /**
     * Load data from storage
     */
    loadFromStorage() {
        this.initializeStorage();
    }

    /**
     * Show notification
     * @param {string} title - Notification title
     * @param {string} message - Notification message
     * @param {string} type - Notification type
     */
    notify(title, message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `agent-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-title">${title}</div>
            <div class="notification-message">${message}</div>
        `;

        // Add styles if not already added
        if (!document.getElementById('agent-monitor-styles')) {
            const style = document.createElement('style');
            style.id = 'agent-monitor-styles';
            style.textContent = `
                .agent-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    padding: 16px;
                    max-width: 300px;
                    z-index: 1000;
                    animation: slideIn 0.3s ease;
                }
                .agent-notification.info { border-left: 4px solid #3b82f6; }
                .agent-notification.success { border-left: 4px solid #10b981; }
                .agent-notification.warning { border-left: 4px solid #f59e0b; }
                .agent-notification.error { border-left: 4px solid #ef4444; }
                .notification-title { font-weight: 600; margin-bottom: 4px; }
                .notification-message { font-size: 14px; color: #666; }
                @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        // Remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    /**
     * Generate unique agent ID
     * @returns {string} Agent ID
     */
    generateAgentId() {
        return 'agent_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Generate unique test ID
     * @returns {string} Test ID
     */
    generateTestId() {
        return 'test_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
}

// Initialize agent monitor when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.agentMonitor = new AgentMonitor();
    
    // Auto-start monitoring
    window.agentMonitor.startMonitoring();
    
    console.log('Agent Monitor initialized');
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AgentMonitor;
} else {
    window.AgentMonitor = AgentMonitor;
}