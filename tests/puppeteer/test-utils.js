/**
 * Test Utilities for AccessiList Puppeteer Tests
 * Common helper functions and utilities
 */

const fs = require('fs');
const path = require('path');
const TEST_CONFIG = require('./test-config');

class TestUtils {
    constructor(page) {
        this.page = page;
        this.screenshots = [];
    }

    /**
     * Take a screenshot and save it
     */
    async screenshot(name, fullPage = false) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `${name}_${timestamp}.png`;
        const filepath = path.join(TEST_CONFIG.paths.screenshots, filename);

        // Ensure screenshots directory exists
        fs.mkdirSync(TEST_CONFIG.paths.screenshots, { recursive: true });

        await this.page.screenshot({
            path: filepath,
            fullPage
        });

        this.screenshots.push(filepath);
        return filepath;
    }

    /**
     * Wait for element to be visible
     */
    async waitForElement(selector, timeout = TEST_CONFIG.defaultTimeout) {
        await this.page.waitForSelector(selector, {
            visible: true,
            timeout
        });
    }

    /**
     * Wait for element to be hidden
     */
    async waitForElementHidden(selector, timeout = TEST_CONFIG.defaultTimeout) {
        await this.page.waitForSelector(selector, {
            hidden: true,
            timeout
        });
    }

    /**
     * Wait for loading to complete
     */
    async waitForLoadingComplete() {
        // Wait for loading overlay to disappear
        try {
            await this.waitForElementHidden(TEST_CONFIG.selectors.loadingOverlay, 10000);
        } catch (error) {
            // Loading overlay might not exist, continue
        }

        // Wait for any pending network requests
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Navigate to a page and wait for it to load
     */
    async navigateToPage(pagePath, waitForLoading = true) {
        const url = `${TEST_CONFIG.baseUrl}${pagePath}`;
        await this.page.goto(url, {
            waitUntil: 'domcontentloaded',
            timeout: TEST_CONFIG.navigationTimeout
        });

        if (waitForLoading) {
            await this.waitForLoadingComplete();
        }
    }

    /**
     * Click an element and wait for any resulting navigation/loading
     */
    async clickAndWait(selector, waitForLoading = true) {
        await this.page.click(selector);

        if (waitForLoading) {
            await this.waitForLoadingComplete();
        }
    }

    /**
     * Fill a form field
     */
    async fillField(selector, value) {
        await this.page.fill(selector, value);
    }

    /**
     * Get text content of an element
     */
    async getText(selector) {
        return await this.page.textContent(selector);
    }

    /**
     * Check if element exists
     */
    async elementExists(selector) {
        try {
            await this.page.waitForSelector(selector, { timeout: 1000 });
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Get element count
     */
    async getElementCount(selector) {
        return await this.page.locator(selector).count();
    }

    /**
     * Wait for API response
     */
    async waitForApiResponse(urlPattern, timeout = TEST_CONFIG.defaultTimeout) {
        return await this.page.waitForResponse(
            response => response.url().includes(urlPattern),
            { timeout }
        );
    }

    /**
     * Generate a unique session key for testing
     */
    generateSessionKey() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 5);
        return `tst${timestamp}${random}`.substring(0, 6);
    }

    /**
     * Create test data for API calls
     */
    createTestData(sessionKey, checklistType = 'word') {
        return {
            sessionKey: sessionKey,
            typeSlug: checklistType,
            type: this.formatChecklistType(checklistType),
            metadata: {
                version: '1.0',
                created: Date.now()
            },
            state: {
                items: [],
                notes: {},
                completed: false
            }
        };
    }

    /**
     * Format checklist type for display
     */
    formatChecklistType(typeSlug) {
        const typeMap = {
            'word': 'Word',
            'excel': 'Excel',
            'powerpoint': 'PowerPoint',
            'slides': 'Slides',
            'docs': 'Docs',
            'camtasia': 'Camtasia',
            'dojo': 'Dojo'
        };
        return typeMap[typeSlug] || typeSlug;
    }

    /**
     * Make API call
     */
    async apiCall(endpoint, method = 'GET', data = null) {
        const url = `${TEST_CONFIG.baseUrl}${endpoint}`;

        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (data && (method === 'POST' || method === 'PUT')) {
            options.body = JSON.stringify(data);
        }

        const response = await this.page.request.fetch(url, options);
        return await response.json();
    }

    /**
     * Clean up test data
     */
    async cleanupTestData(sessionKey) {
        try {
            await this.apiCall(`${TEST_CONFIG.api.delete}`, 'POST', { sessionKey });
        } catch (error) {
            // Ignore cleanup errors
            console.warn(`Cleanup failed for session ${sessionKey}:`, error.message);
        }
    }

    /**
     * Generate test report
     */
    generateTestReport(testName, results) {
        const timestamp = new Date().toISOString();
        const report = {
            testName,
            timestamp,
            results,
            screenshots: this.screenshots,
            summary: {
                total: results.length,
                passed: results.filter(r => r.status === 'PASSED').length,
                failed: results.filter(r => r.status === 'FAILED').length
            }
        };

        // Save report
        const reportPath = path.join(TEST_CONFIG.paths.reports, `${testName}-report.json`);
        fs.mkdirSync(TEST_CONFIG.paths.reports, { recursive: true });
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

        return report;
    }

    /**
     * Log test step
     */
    logStep(step, details = '') {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] ${step}${details ? ` - ${details}` : ''}`);
    }

    /**
     * Assert element is visible
     */
    async assertElementVisible(selector, message = `Element ${selector} should be visible`) {
        const isVisible = await this.page.isVisible(selector);
        if (!isVisible) {
            throw new Error(message);
        }
    }

    /**
     * Assert element is hidden
     */
    async assertElementHidden(selector, message = `Element ${selector} should be hidden`) {
        const isHidden = await this.page.isHidden(selector);
        if (!isHidden) {
            throw new Error(message);
        }
    }

    /**
     * Assert text content
     */
    async assertTextContent(selector, expectedText, message = `Text content mismatch for ${selector}`) {
        const actualText = await this.getText(selector);
        if (actualText !== expectedText) {
            throw new Error(`${message}. Expected: "${expectedText}", Actual: "${actualText}"`);
        }
    }

    /**
     * Assert URL contains
     */
    async assertUrlContains(expectedPath, message = `URL should contain ${expectedPath}`) {
        const currentUrl = this.page.url();
        if (!currentUrl.includes(expectedPath)) {
            throw new Error(`${message}. Current URL: ${currentUrl}`);
        }
    }
}

module.exports = TestUtils;
