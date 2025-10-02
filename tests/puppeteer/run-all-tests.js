#!/usr/bin/env node

/**
 * Master Test Runner for AccessiList Puppeteer Tests
 * Runs all test suites and generates comprehensive reports
 */

const CriticalPathTests = require('./critical-path-tests');
const ChecklistFunctionalityTests = require('./checklist-functionality-tests');
const ApiIntegrationTests = require('./api-integration-tests');
const FrontendTestSuite = require('./frontend_tests');
const AccessibilityTestSuite = require('./accessibility_tests');
const PerformanceTestSuite = require('./performance_tests');
const fs = require('fs');
const path = require('path');
const TEST_CONFIG = require('./test-config');

class MasterTestRunner {
    constructor() {
        this.testSuites = [
            { name: 'Critical Path Tests', runner: CriticalPathTests },
            { name: 'Checklist Functionality Tests', runner: ChecklistFunctionalityTests },
            { name: 'API Integration Tests', runner: ApiIntegrationTests },
            { name: 'Frontend Tests', runner: FrontendTestSuite },
            { name: 'Accessibility Tests', runner: AccessibilityTestSuite },
            { name: 'Performance Tests', runner: PerformanceTestSuite }
        ];
        this.results = [];
        this.startTime = null;
        this.endTime = null;
    }

    /**
     * Run a single test suite
     */
    async runTestSuite(suite) {
        console.log(`\n🧪 Running ${suite.name}...`);
        console.log('=' .repeat(50));
        
        const startTime = Date.now();
        
        try {
            const testRunner = new suite.runner();
            const result = await testRunner.runAllTests();
            
            const endTime = Date.now();
            const duration = endTime - startTime;
            
            this.results.push({
                suite: suite.name,
                status: result.summary.failed === 0 ? 'PASSED' : 'FAILED',
                duration: duration,
                summary: result.summary,
                details: result.results
            });
            
            console.log(`\n✅ ${suite.name} completed in ${duration}ms`);
            
        } catch (error) {
            const endTime = Date.now();
            const duration = endTime - startTime;
            
            this.results.push({
                suite: suite.name,
                status: 'ERROR',
                duration: duration,
                error: error.message,
                summary: { total: 0, passed: 0, failed: 1 }
            });
            
            console.log(`\n❌ ${suite.name} failed: ${error.message}`);
        }
    }

    /**
     * Generate master test report
     */
    generateMasterReport() {
        const totalTests = this.results.reduce((sum, result) => sum + result.summary.total, 0);
        const totalPassed = this.results.reduce((sum, result) => sum + result.summary.passed, 0);
        const totalFailed = this.results.reduce((sum, result) => sum + result.summary.failed, 0);
        const totalDuration = this.endTime - this.startTime;
        
        const masterReport = {
            timestamp: new Date().toISOString(),
            testRun: {
                startTime: new Date(this.startTime).toISOString(),
                endTime: new Date(this.endTime).toISOString(),
                duration: totalDuration
            },
            summary: {
                totalSuites: this.results.length,
                passedSuites: this.results.filter(r => r.status === 'PASSED').length,
                failedSuites: this.results.filter(r => r.status === 'FAILED').length,
                errorSuites: this.results.filter(r => r.status === 'ERROR').length,
                totalTests: totalTests,
                totalPassed: totalPassed,
                totalFailed: totalFailed,
                successRate: totalTests > 0 ? ((totalPassed / totalTests) * 100).toFixed(2) + '%' : '0%'
            },
            suites: this.results
        };
        
        // Save master report
        const reportPath = path.join(TEST_CONFIG.paths.reports, 'master-test-report.json');
        fs.mkdirSync(TEST_CONFIG.paths.reports, { recursive: true });
        fs.writeFileSync(reportPath, JSON.stringify(masterReport, null, 2));
        
        return masterReport;
    }

    /**
     * Display master test results
     */
    displayMasterResults(report) {
        console.log('\n' + '=' .repeat(80));
        console.log('🎯 MASTER TEST RESULTS FOR ACCESSILIST');
        console.log('=' .repeat(80));
        console.log(`Test Run Duration: ${report.testRun.duration}ms`);
        console.log(`Total Test Suites: ${report.summary.totalSuites}`);
        console.log(`Passed Suites: ${report.summary.passedSuites}`);
        console.log(`Failed Suites: ${report.summary.failedSuites}`);
        console.log(`Error Suites: ${report.summary.errorSuites}`);
        console.log(`Total Tests: ${report.summary.totalTests}`);
        console.log(`Passed Tests: ${report.summary.totalPassed}`);
        console.log(`Failed Tests: ${report.summary.totalFailed}`);
        console.log(`Overall Success Rate: ${report.summary.successRate}`);
        console.log('=' .repeat(80));
        
        // Display suite results
        console.log('\n📊 Test Suite Results:');
        this.results.forEach(result => {
            const status = result.status === 'PASSED' ? '✅' : 
                          result.status === 'FAILED' ? '❌' : '💥';
            console.log(`   ${status} ${result.suite} (${result.duration}ms)`);
            console.log(`      Tests: ${result.summary.total}, Passed: ${result.summary.passed}, Failed: ${result.summary.failed}`);
        });
        
        // Display failed tests
        const failedSuites = this.results.filter(r => r.status === 'FAILED' || r.status === 'ERROR');
        if (failedSuites.length > 0) {
            console.log('\n❌ Failed Test Suites:');
            failedSuites.forEach(suite => {
                console.log(`   • ${suite.suite}: ${suite.error || 'Tests failed'}`);
            });
        }
        
        console.log('\n' + '=' .repeat(80));
    }

    /**
     * Run all test suites
     */
    async runAllTests() {
        console.log('🚀 Starting Master Test Run for AccessiList');
        console.log('=' .repeat(80));
        console.log(`Running ${this.testSuites.length} test suites...`);
        console.log(`Base URL: ${TEST_CONFIG.baseUrl}`);
        console.log(`Browser: ${TEST_CONFIG.browser.headless ? 'Headless' : 'Headed'}`);
        console.log('=' .repeat(80));
        
        this.startTime = Date.now();
        
        // Run each test suite
        for (const suite of this.testSuites) {
            await this.runTestSuite(suite);
        }
        
        this.endTime = Date.now();
        
        // Generate and display results
        const masterReport = this.generateMasterReport();
        this.displayMasterResults(masterReport);
        
        return masterReport;
    }
}

// Run all tests if this file is executed directly
if (require.main === module) {
    const runner = new MasterTestRunner();
    runner.runAllTests().then(report => {
        const exitCode = report.summary.failedSuites > 0 || report.summary.errorSuites > 0 ? 1 : 0;
        process.exit(exitCode);
    }).catch(error => {
        console.error('💥 Master test run failed:', error);
        process.exit(1);
    });
}

module.exports = MasterTestRunner;
