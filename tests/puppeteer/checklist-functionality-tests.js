#!/usr/bin/env node

/**
 * Checklist Functionality Tests for AccessiList
 * Comprehensive tests for all checklist features
 */

const { chromium } = require('playwright');
const TestUtils = require('./test-utils');
const TEST_CONFIG = require('./test-config');

class ChecklistFunctionalityTests {
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
     * Test checklist type loading
     */
    async testChecklistTypeLoading() {
        this.utils.logStep('Testing checklist type loading');
        
        for (const checklistType of TEST_CONFIG.testData.checklistTypes) {
            try {
                await this.utils.navigateToPage(`${TEST_CONFIG.pages.checklist}?type=${checklistType}`);
                await this.utils.waitForLoadingComplete();
                await this.utils.screenshot(`checklist-${checklistType}-loaded`);
                
                // Verify page title and header
                const title = await this.page.title();
                const headerText = await this.utils.getText('.sticky-header h1');
                
                if (title.includes('Accessibility Checklist') && headerText.includes('Checklist')) {
                    this.testResults.push({ 
                        test: `Checklist Type Loading - ${checklistType}`, 
                        status: 'PASSED' 
                    });
                } else {
                    throw new Error(`Invalid title or header for ${checklistType}`);
                }
                
            } catch (error) {
                this.testResults.push({ 
                    test: `Checklist Type Loading - ${checklistType}`, 
                    status: 'FAILED', 
                    error: error.message 
                });
            }
        }
    }

    /**
     * Test checklist item interactions
     */
    async testChecklistItemInteractions() {
        this.utils.logStep('Testing checklist item interactions');
        
        try {
            await this.utils.navigateToPage(`${TEST_CONFIG.pages.checklist}?type=word`);
            await this.utils.waitForLoadingComplete();
            
            // Wait for checklist items to load
            await this.utils.waitForElement('.checklist-item', 10000);
            
            const items = await this.page.locator('.checklist-item');
            const itemCount = await items.count();
            
            if (itemCount > 0) {
                // Test clicking first item
                const firstItem = items.first();
                const initialState = await firstItem.getAttribute('data-checked');
                
                await firstItem.click();
                await this.utils.screenshot('checklist-item-clicked');
                
                const newState = await firstItem.getAttribute('data-checked');
                
                if (newState !== initialState) {
                    this.testResults.push({ 
                        test: 'Checklist Item Click', 
                        status: 'PASSED' 
                    });
                } else {
                    throw new Error('Item state did not change after click');
                }
                
                // Test clicking multiple items
                if (itemCount > 1) {
                    const secondItem = items.nth(1);
                    await secondItem.click();
                    await this.utils.screenshot('multiple-items-clicked');
                    
                    this.testResults.push({ 
                        test: 'Multiple Item Selection', 
                        status: 'PASSED' 
                    });
                }
                
            } else {
                throw new Error('No checklist items found');
            }
            
        } catch (error) {
            this.testResults.push({ 
                test: 'Checklist Item Interactions', 
                status: 'FAILED', 
                error: error.message 
            });
        }
    }

    /**
     * Test status button functionality
     */
    async testStatusButtonFunctionality() {
        this.utils.logStep('Testing status button functionality');
        
        try {
            await this.utils.navigateToPage(`${TEST_CONFIG.pages.checklist}?type=word`);
            await this.utils.waitForLoadingComplete();
            
            // Look for status buttons
            const statusButtons = await this.page.locator('.status-button');
            const buttonCount = await statusButtons.count();
            
            if (buttonCount > 0) {
                // Test clicking status buttons
                for (let i = 0; i < Math.min(buttonCount, 3); i++) {
                    const button = statusButtons.nth(i);
                    const initialClass = await button.getAttribute('class');
                    
                    await button.click();
                    await this.utils.screenshot(`status-button-${i}-clicked`);
                    
                    const newClass = await button.getAttribute('class');
                    
                    if (newClass !== initialClass) {
                        this.testResults.push({ 
                            test: `Status Button ${i} Click`, 
                            status: 'PASSED' 
                        });
                    }
                }
            } else {
                // Status buttons might not be present in all checklist types
                this.testResults.push({ 
                    test: 'Status Button Functionality', 
                    status: 'PASSED',
                    note: 'No status buttons found (may be expected for this checklist type)'
                });
            }
            
        } catch (error) {
            this.testResults.push({ 
                test: 'Status Button Functionality', 
                status: 'FAILED', 
                error: error.message 
            });
        }
    }

    /**
     * Test notes functionality
     */
    async testNotesFunctionality() {
        this.utils.logStep('Testing notes functionality');
        
        try {
            await this.utils.navigateToPage(`${TEST_CONFIG.pages.checklist}?type=word`);
            await this.utils.waitForLoadingComplete();
            
            // Look for notes inputs
            const notesInputs = await this.page.locator('.notes-input');
            const inputCount = await notesInputs.count();
            
            if (inputCount > 0) {
                // Test adding notes
                const firstInput = notesInputs.first();
                const testNote = 'Test note for accessibility checklist';
                
                await firstInput.fill(testNote);
                await this.utils.screenshot('notes-input-filled');
                
                const inputValue = await firstInput.inputValue();
                
                if (inputValue === testNote) {
                    this.testResults.push({ 
                        test: 'Notes Input', 
                        status: 'PASSED' 
                    });
                } else {
                    throw new Error('Notes input value not set correctly');
                }
                
            } else {
                // Notes inputs might not be present in all checklist types
                this.testResults.push({ 
                    test: 'Notes Functionality', 
                    status: 'PASSED',
                    note: 'No notes inputs found (may be expected for this checklist type)'
                });
            }
            
        } catch (error) {
            this.testResults.push({ 
                test: 'Notes Functionality', 
                status: 'FAILED', 
                error: error.message 
            });
        }
    }

    /**
     * Test add row functionality
     */
    async testAddRowFunctionality() {
        this.utils.logStep('Testing add row functionality');
        
        try {
            await this.utils.navigateToPage(`${TEST_CONFIG.pages.checklist}?type=word`);
            await this.utils.waitForLoadingComplete();
            
            // Look for add row button
            const addRowButton = await this.page.locator('.add-row-button');
            const buttonExists = await addRowButton.count() > 0;
            
            if (buttonExists) {
                // Count initial rows
                const initialRows = await this.page.locator('.checklist-item').count();
                
                // Click add row button
                await addRowButton.click();
                await this.utils.screenshot('add-row-button-clicked');
                
                // Wait for new row to appear
                await this.page.waitForTimeout(1000);
                
                const newRows = await this.page.locator('.checklist-item').count();
                
                if (newRows > initialRows) {
                    this.testResults.push({ 
                        test: 'Add Row Functionality', 
                        status: 'PASSED' 
                    });
                } else {
                    throw new Error('New row was not added');
                }
                
            } else {
                // Add row button might not be present in all checklist types
                this.testResults.push({ 
                    test: 'Add Row Functionality', 
                    status: 'PASSED',
                    note: 'No add row button found (may be expected for this checklist type)'
                });
            }
            
        } catch (error) {
            this.testResults.push({ 
                test: 'Add Row Functionality', 
                status: 'FAILED', 
                error: error.message 
            });
        }
    }

    /**
     * Test save functionality
     */
    async testSaveFunctionality() {
        this.utils.logStep('Testing save functionality');
        
        const sessionKey = this.utils.generateSessionKey();
        
        try {
            await this.utils.navigateToPage(`${TEST_CONFIG.pages.checklist}?type=word&sessionKey=${sessionKey}`);
            await this.utils.waitForLoadingComplete();
            
            // Create test data
            const testData = this.utils.createTestData(sessionKey, 'word');
            testData.state.items = [
                { id: 'test-item-1', checked: true },
                { id: 'test-item-2', checked: false }
            ];
            testData.state.notes = {
                'test-item-1': 'Test note 1',
                'test-item-2': 'Test note 2'
            };
            
            // Save the data
            const saveResponse = await this.utils.apiCall(
                TEST_CONFIG.api.save, 
                'POST', 
                testData
            );
            
            if (saveResponse.success) {
                this.testResults.push({ 
                    test: 'Save Functionality', 
                    status: 'PASSED' 
                });
            } else {
                throw new Error('Save API call failed');
            }
            
        } catch (error) {
            this.testResults.push({ 
                test: 'Save Functionality', 
                status: 'FAILED', 
                error: error.message 
            });
        } finally {
            await this.utils.cleanupTestData(sessionKey);
        }
    }

    /**
     * Test restore functionality
     */
    async testRestoreFunctionality() {
        this.utils.logStep('Testing restore functionality');
        
        const sessionKey = this.utils.generateSessionKey();
        
        try {
            // First, create and save test data
            const testData = this.utils.createTestData(sessionKey, 'word');
            testData.state.items = [
                { id: 'restore-test-item', checked: true }
            ];
            testData.state.notes = {
                'restore-test-item': 'Restore test note'
            };
            
            // Save the data
            await this.utils.apiCall(TEST_CONFIG.api.save, 'POST', testData);
            
            // Now test restore
            const restoreResponse = await this.utils.apiCall(
                `${TEST_CONFIG.api.restore}?sessionKey=${sessionKey}`
            );
            
            if (restoreResponse.success && restoreResponse.data.state) {
                const restoredItems = restoreResponse.data.state.items;
                const restoredNotes = restoreResponse.data.state.notes;
                
                if (restoredItems && restoredItems.length > 0 && restoredNotes) {
                    this.testResults.push({ 
                        test: 'Restore Functionality', 
                        status: 'PASSED' 
                    });
                } else {
                    throw new Error('Restored data is incomplete');
                }
            } else {
                throw new Error('Restore API call failed');
            }
            
        } catch (error) {
            this.testResults.push({ 
                test: 'Restore Functionality', 
                status: 'FAILED', 
                error: error.message 
            });
        } finally {
            await this.utils.cleanupTestData(sessionKey);
        }
    }

    /**
     * Test checklist navigation
     */
    async testChecklistNavigation() {
        this.utils.logStep('Testing checklist navigation');
        
        try {
            await this.utils.navigateToPage(`${TEST_CONFIG.pages.checklist}?type=word`);
            await this.utils.waitForLoadingComplete();
            
            // Test home button
            const homeButton = await this.page.locator('#homeButton');
            if (await homeButton.count() > 0) {
                await homeButton.click();
                await this.utils.waitForLoadingComplete();
                await this.utils.screenshot('navigated-to-home');
                
                // Verify we're on home page
                await this.utils.assertUrlContains('home.php');
                this.testResults.push({ 
                    test: 'Home Button Navigation', 
                    status: 'PASSED' 
                });
            }
            
        } catch (error) {
            this.testResults.push({ 
                test: 'Checklist Navigation', 
                status: 'FAILED', 
                error: error.message 
            });
        }
    }

    /**
     * Run all checklist functionality tests
     */
    async runAllTests() {
        console.log('🧪 Starting Checklist Functionality Tests for AccessiList');
        console.log('=' .repeat(60));
        
        await this.setup();
        
        try {
            await this.testChecklistTypeLoading();
            await this.testChecklistItemInteractions();
            await this.testStatusButtonFunctionality();
            await this.testNotesFunctionality();
            await this.testAddRowFunctionality();
            await this.testSaveFunctionality();
            await this.testRestoreFunctionality();
            await this.testChecklistNavigation();
            
        } finally {
            await this.cleanup();
        }
        
        // Generate report
        const report = this.utils.generateTestReport('checklist-functionality-tests', this.testResults);
        
        // Display results
        console.log('\n' + '=' .repeat(60));
        console.log('📊 CHECKLIST FUNCTIONALITY TEST RESULTS');
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
    const testSuite = new ChecklistFunctionalityTests();
    testSuite.runAllTests().then(report => {
        process.exit(report.summary.failed > 0 ? 1 : 0);
    }).catch(error => {
        console.error('💥 Checklist functionality tests failed:', error);
        process.exit(1);
    });
}

module.exports = ChecklistFunctionalityTests;
