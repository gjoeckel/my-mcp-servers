#!/usr/bin/env node

/**
 * API Integration Tests for AccessiList
 * Comprehensive tests for all API endpoints
 */

const { chromium } = require('playwright');
const TestUtils = require('./test-utils');
const TEST_CONFIG = require('./test-config');

class ApiIntegrationTests {
    constructor() {
        this.browser = null;
        this.page = null;
        this.utils = null;
        this.testResults = [];
    }

    /**
     * Setup browser and page
     */
    async setup() {
        this.browser = await chromium.launch(TEST_CONFIG.browser);
        this.page = await this.browser.newPage();
        this.utils = new TestUtils(this.page);
        
        await this.page.setViewportSize(TEST_CONFIG.browser.viewport);
        this.utils.logStep('Browser setup complete');
    }

    /**
     * Cleanup browser
     */
    async cleanup() {
        if (this.browser) {
            await this.browser.close();
        }
    }

    /**
     * Test API health endpoint
     */
    async testApiHealth() {
        this.utils.logStep('Testing API health endpoint');
        
        try {
            const response = await this.utils.apiCall(TEST_CONFIG.api.health);
            
            if (response.success) {
                this.testResults.push({ 
                    test: 'API Health Check', 
                    status: 'PASSED' 
                });
            } else {
                throw new Error('Health check returned failure');
            }
            
        } catch (error) {
            this.testResults.push({ 
                test: 'API Health Check', 
                status: 'FAILED', 
                error: error.message 
            });
        }
    }

    /**
     * Test API list endpoint
     */
    async testApiList() {
        this.utils.logStep('Testing API list endpoint');
        
        try {
            const response = await this.utils.apiCall(TEST_CONFIG.api.list);
            
            if (response.success && Array.isArray(response.data)) {
                this.testResults.push({ 
                    test: 'API List Endpoint', 
                    status: 'PASSED',
                    note: `Found ${response.data.length} saved checklists`
                });
            } else {
                throw new Error('List endpoint returned invalid response');
            }
            
        } catch (error) {
            this.testResults.push({ 
                test: 'API List Endpoint', 
                status: 'FAILED', 
                error: error.message 
            });
        }
    }

    /**
     * Test API instantiate endpoint
     */
    async testApiInstantiate() {
        this.utils.logStep('Testing API instantiate endpoint');
        
        const sessionKey = this.utils.generateSessionKey();
        
        try {
            const testData = this.utils.createTestData(sessionKey, 'word');
            
            const response = await this.utils.apiCall(
                TEST_CONFIG.api.instantiate, 
                'POST', 
                testData
            );
            
            if (response.success) {
                this.testResults.push({ 
                    test: 'API Instantiate Endpoint', 
                    status: 'PASSED' 
                });
            } else {
                throw new Error('Instantiate endpoint failed');
            }
            
        } catch (error) {
            this.testResults.push({ 
                test: 'API Instantiate Endpoint', 
                status: 'FAILED', 
                error: error.message 
            });
        } finally {
            await this.utils.cleanupTestData(sessionKey);
        }
    }

    /**
     * Test API save endpoint
     */
    async testApiSave() {
        this.utils.logStep('Testing API save endpoint');
        
        const sessionKey = this.utils.generateSessionKey();
        
        try {
            // First instantiate
            const instantiateData = this.utils.createTestData(sessionKey, 'word');
            await this.utils.apiCall(TEST_CONFIG.api.instantiate, 'POST', instantiateData);
            
            // Then save with additional data
            const saveData = {
                ...instantiateData,
                state: {
                    items: [
                        { id: 'test-item-1', checked: true },
                        { id: 'test-item-2', checked: false }
                    ],
                    notes: {
                        'test-item-1': 'Test note 1',
                        'test-item-2': 'Test note 2'
                    }
                }
            };
            
            const response = await this.utils.apiCall(
                TEST_CONFIG.api.save, 
                'POST', 
                saveData
            );
            
            if (response.success) {
                this.testResults.push({ 
                    test: 'API Save Endpoint', 
                    status: 'PASSED' 
                });
            } else {
                throw new Error('Save endpoint failed');
            }
            
        } catch (error) {
            this.testResults.push({ 
                test: 'API Save Endpoint', 
                status: 'FAILED', 
                error: error.message 
            });
        } finally {
            await this.utils.cleanupTestData(sessionKey);
        }
    }

    /**
     * Test API restore endpoint
     */
    async testApiRestore() {
        this.utils.logStep('Testing API restore endpoint');
        
        const sessionKey = this.utils.generateSessionKey();
        
        try {
            // First create and save data
            const testData = this.utils.createTestData(sessionKey, 'word');
            testData.state = {
                items: [{ id: 'restore-test', checked: true }],
                notes: { 'restore-test': 'Restore test note' }
            };
            
            await this.utils.apiCall(TEST_CONFIG.api.instantiate, 'POST', testData);
            await this.utils.apiCall(TEST_CONFIG.api.save, 'POST', testData);
            
            // Then test restore
            const response = await this.utils.apiCall(
                `${TEST_CONFIG.api.restore}?sessionKey=${sessionKey}`
            );
            
            if (response.success && response.data.state) {
                this.testResults.push({ 
                    test: 'API Restore Endpoint', 
                    status: 'PASSED' 
                });
            } else {
                throw new Error('Restore endpoint failed or returned invalid data');
            }
            
        } catch (error) {
            this.testResults.push({ 
                test: 'API Restore Endpoint', 
                status: 'FAILED', 
                error: error.message 
            });
        } finally {
            await this.utils.cleanupTestData(sessionKey);
        }
    }

    /**
     * Test API delete endpoint
     */
    async testApiDelete() {
        this.utils.logStep('Testing API delete endpoint');
        
        const sessionKey = this.utils.generateSessionKey();
        
        try {
            // First create data
            const testData = this.utils.createTestData(sessionKey, 'word');
            await this.utils.apiCall(TEST_CONFIG.api.instantiate, 'POST', testData);
            
            // Then test delete
            const response = await this.utils.apiCall(
                TEST_CONFIG.api.delete, 
                'POST', 
                { sessionKey }
            );
            
            if (response.success) {
                this.testResults.push({ 
                    test: 'API Delete Endpoint', 
                    status: 'PASSED' 
                });
            } else {
                throw new Error('Delete endpoint failed');
            }
            
        } catch (error) {
            this.testResults.push({ 
                test: 'API Delete Endpoint', 
                status: 'FAILED', 
                error: error.message 
            });
        }
    }

    /**
     * Test API error handling
     */
    async testApiErrorHandling() {
        this.utils.logStep('Testing API error handling');
        
        const errorTests = [
            {
                name: 'Invalid Session Key',
                endpoint: `${TEST_CONFIG.api.restore}?sessionKey=invalid`,
                expectedError: true
            },
            {
                name: 'Missing Session Key',
                endpoint: TEST_CONFIG.api.restore,
                expectedError: true
            },
            {
                name: 'Invalid Save Data',
                endpoint: TEST_CONFIG.api.save,
                method: 'POST',
                data: { invalid: 'data' },
                expectedError: true
            }
        ];
        
        for (const test of errorTests) {
            try {
                const response = await this.utils.apiCall(
                    test.endpoint, 
                    test.method || 'GET', 
                    test.data
                );
                
                if (test.expectedError && !response.success) {
                    this.testResults.push({ 
                        test: `API Error Handling - ${test.name}`, 
                        status: 'PASSED' 
                    });
                } else if (!test.expectedError && response.success) {
                    this.testResults.push({ 
                        test: `API Error Handling - ${test.name}`, 
                        status: 'PASSED' 
                    });
                } else {
                    throw new Error(`Unexpected response for ${test.name}`);
                }
                
            } catch (error) {
                if (test.expectedError) {
                    this.testResults.push({ 
                        test: `API Error Handling - ${test.name}`, 
                        status: 'PASSED' 
                    });
                } else {
                    this.testResults.push({ 
                        test: `API Error Handling - ${test.name}`, 
                        status: 'FAILED', 
                        error: error.message 
                    });
                }
            }
        }
    }

    /**
     * Test API data validation
     */
    async testApiDataValidation() {
        this.utils.logStep('Testing API data validation');
        
        const validationTests = [
            {
                name: 'Invalid Checklist Type',
                data: { sessionKey: 'tst1', typeSlug: 'invalid-type' },
                endpoint: TEST_CONFIG.api.instantiate,
                method: 'POST',
                shouldFail: true
            },
            {
                name: 'Missing Required Fields',
                data: { sessionKey: 'tst2' },
                endpoint: TEST_CONFIG.api.instantiate,
                method: 'POST',
                shouldFail: true
            },
            {
                name: 'Valid Data',
                data: this.utils.createTestData('tst3', 'word'),
                endpoint: TEST_CONFIG.api.instantiate,
                method: 'POST',
                shouldFail: false
            }
        ];
        
        for (const test of validationTests) {
            try {
                const response = await this.utils.apiCall(
                    test.endpoint, 
                    test.method, 
                    test.data
                );
                
                if (test.shouldFail && !response.success) {
                    this.testResults.push({ 
                        test: `API Data Validation - ${test.name}`, 
                        status: 'PASSED' 
                    });
                } else if (!test.shouldFail && response.success) {
                    this.testResults.push({ 
                        test: `API Data Validation - ${test.name}`, 
                        status: 'PASSED' 
                    });
                } else {
                    throw new Error(`Validation test failed for ${test.name}`);
                }
                
            } catch (error) {
                if (test.shouldFail) {
                    this.testResults.push({ 
                        test: `API Data Validation - ${test.name}`, 
                        status: 'PASSED' 
                    });
                } else {
                    this.testResults.push({ 
                        test: `API Data Validation - ${test.name}`, 
                        status: 'FAILED', 
                        error: error.message 
                    });
                }
            }
        }
    }

    /**
     * Test API performance
     */
    async testApiPerformance() {
        this.utils.logStep('Testing API performance');
        
        const performanceTests = [
            {
                name: 'Health Check Performance',
                endpoint: TEST_CONFIG.api.health,
                maxTime: 1000
            },
            {
                name: 'List Performance',
                endpoint: TEST_CONFIG.api.list,
                maxTime: 2000
            }
        ];
        
        for (const test of performanceTests) {
            try {
                const startTime = Date.now();
                const response = await this.utils.apiCall(test.endpoint);
                const endTime = Date.now();
                const duration = endTime - startTime;
                
                if (response.success && duration <= test.maxTime) {
                    this.testResults.push({ 
                        test: `API Performance - ${test.name}`, 
                        status: 'PASSED',
                        note: `Response time: ${duration}ms`
                    });
                } else if (response.success) {
                    this.testResults.push({ 
                        test: `API Performance - ${test.name}`, 
                        status: 'FAILED',
                        error: `Response time too slow: ${duration}ms (max: ${test.maxTime}ms)`
                    });
                } else {
                    throw new Error('API call failed');
                }
                
            } catch (error) {
                this.testResults.push({ 
                    test: `API Performance - ${test.name}`, 
                    status: 'FAILED', 
                    error: error.message 
                });
            }
        }
    }

    /**
     * Run all API integration tests
     */
    async runAllTests() {
        console.log('🔌 Starting API Integration Tests for AccessiList');
        console.log('=' .repeat(60));
        
        await this.setup();
        
        try {
            await this.testApiHealth();
            await this.testApiList();
            await this.testApiInstantiate();
            await this.testApiSave();
            await this.testApiRestore();
            await this.testApiDelete();
            await this.testApiErrorHandling();
            await this.testApiDataValidation();
            await this.testApiPerformance();
            
        } finally {
            await this.cleanup();
        }
        
        // Generate report
        const report = this.utils.generateTestReport('api-integration-tests', this.testResults);
        
        // Display results
        console.log('\n' + '=' .repeat(60));
        console.log('📊 API INTEGRATION TEST RESULTS');
        console.log('=' .repeat(60));
        console.log(`Total Tests: ${report.summary.total}`);
        console.log(`Passed: ${report.summary.passed}`);
        console.log(`Failed: ${report.summary.failed}`);
        console.log(`Success Rate: ${((report.summary.passed / report.summary.total) * 100).toFixed(2)}%`);
        console.log('=' .repeat(60));
        
        return report;
    }
}

// Run tests if this file is executed directly
if (require.main === module) {
    const testSuite = new ApiIntegrationTests();
    testSuite.runAllTests().then(report => {
        process.exit(report.summary.failed > 0 ? 1 : 0);
    }).catch(error => {
        console.error('💥 API integration tests failed:', error);
        process.exit(1);
    });
}

module.exports = ApiIntegrationTests;
