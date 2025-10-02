#!/usr/bin/env node

/**
 * Demo Test to Show Different Puppeteer Modes
 * This demonstrates the speed difference between headless and headed modes
 */

const { chromium } = require('playwright');
const TEST_CONFIG = require('./test-config');

class DemoTest {
    constructor() {
        this.browser = null;
        this.page = null;
    }

    async setup() {
        this.browser = await chromium.launch(TEST_CONFIG.browser);
        this.page = await this.browser.newPage();
        await this.page.setViewportSize(TEST_CONFIG.browser.viewport);
    }

    async cleanup() {
        if (this.browser) {
            await this.browser.close();
        }
    }

    async runDemo() {
        console.log('🎭 Puppeteer Demo Test');
        console.log('=' .repeat(50));
        console.log(`Mode: ${TEST_CONFIG.browser.headless ? 'HEADLESS' : 'HEADED'}`);
        console.log(`Slow Motion: ${TEST_CONFIG.browser.slowMo}ms`);
        console.log(`DevTools: ${TEST_CONFIG.browser.devtools ? 'OPEN' : 'CLOSED'}`);
        console.log('=' .repeat(50));

        const startTime = Date.now();

        try {
            await this.setup();

            // Navigate to a simple page (our local server)
            console.log('🌐 Navigating to local server...');
            await this.page.goto('http://localhost:8000');

            // Take a screenshot
            console.log('📸 Taking screenshot...');
            await this.page.screenshot({
                path: 'tests/screenshots/demo-test.png',
                fullPage: true
            });

            // Look for any input field or button
            console.log('🔍 Looking for interactive elements...');
            const inputs = await this.page.locator('input, button, a').count();
            console.log(`Found ${inputs} interactive elements`);

            // Try to click on a link if available
            const links = await this.page.locator('a').count();
            if (links > 0) {
                console.log('🔗 Clicking on first link...');
                await this.page.locator('a').first().click();
                await this.page.waitForTimeout(1000);
            }

            // Wait a moment to see the typing
            await this.page.waitForTimeout(1000);

            // Take another screenshot
            console.log('📸 Taking final screenshot...');
            await this.page.screenshot({
                path: 'tests/screenshots/demo-test-final.png',
                fullPage: true
            });

            const endTime = Date.now();
            const duration = endTime - startTime;

            console.log('=' .repeat(50));
            console.log(`✅ Demo completed in ${duration}ms`);
            console.log('📁 Screenshots saved to tests/screenshots/');
            console.log('=' .repeat(50));

        } catch (error) {
            console.error('❌ Demo failed:', error.message);
        } finally {
            await this.cleanup();
        }
    }
}

// Run demo if this file is executed directly
if (require.main === module) {
    const demo = new DemoTest();
    demo.runDemo().catch(error => {
        console.error('💥 Demo failed:', error);
        process.exit(1);
    });
}

module.exports = DemoTest;
