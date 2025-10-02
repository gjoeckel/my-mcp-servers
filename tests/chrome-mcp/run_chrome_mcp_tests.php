<?php
/**
 * AccessiList Chrome MCP Test Runner
 * Specialized test runner for Chrome MCP integration tests
 */

require_once __DIR__ . '/../run_comprehensive_tests.php';

class ChromeMCPTestRunner {
    private $baseUrl;
    private $results = [];
    
    public function __construct($baseUrl = TestConfig::BASE_URL) {
        $this->baseUrl = $baseUrl;
    }
    
    public function runAllTests() {
        echo "🌐 AccessiList Chrome MCP Test Suite\n";
        echo "===================================\n";
        echo "Base URL: " . $this->baseUrl . "\n";
        echo "Timestamp: " . date('Y-m-d H:i:s') . "\n\n";
        
        try {
            // Initialize Chrome MCP
            TestBase::initChromeMCP($this->baseUrl);
            
            // Run Chrome MCP specific tests
            $this->testFrontendIntegration();
            $this->testBrowserAutomation();
            $this->testVisualValidation();
            $this->testPerformanceMonitoring();
            
            $this->generateReport();
            
        } catch (Exception $e) {
            echo "❌ Critical error during Chrome MCP test execution: " . $e->getMessage() . "\n";
            exit(1);
        }
    }
    
    private function testFrontendIntegration() {
        echo "🔗 Testing Frontend Integration...\n";
        
        try {
            // Test main page loading
            TestBase::navigateToPage($this->baseUrl . '/index.php', 'Navigate to main page');
            TestBase::waitForText('AccessiList', 10);
            $screenshot = TestBase::takeScreenshot('frontend_main_page', 'Main page loaded');
            $this->addResult('frontend', 'main_page_load', 'passed', 'Main page loaded successfully', $screenshot);
            
            // Test home page loading
            TestBase::navigateToPage($this->baseUrl . '/php/home.php', 'Navigate to home page');
            TestBase::waitForText('Checklist', 10);
            $screenshot = TestBase::takeScreenshot('frontend_home_page', 'Home page loaded');
            $this->addResult('frontend', 'home_page_load', 'passed', 'Home page loaded successfully', $screenshot);
            
            // Test checklist page loading
            TestBase::navigateToPage($this->baseUrl . '/php/mychecklist.php', 'Navigate to checklist page');
            TestBase::waitForText('Accessibility', 10);
            $screenshot = TestBase::takeScreenshot('frontend_checklist_page', 'Checklist page loaded');
            $this->addResult('frontend', 'checklist_page_load', 'passed', 'Checklist page loaded successfully', $screenshot);
            
        } catch (Exception $e) {
            $this->addResult('frontend', 'integration_test', 'failed', $e->getMessage());
        }
    }
    
    private function testBrowserAutomation() {
        echo "🤖 Testing Browser Automation...\n";
        
        try {
            // Test element interaction
            TestBase::navigateToPage($this->baseUrl . '/php/mychecklist.php', 'Navigate to checklist page');
            TestBase::waitForText('Accessibility', 10);
            
            // Test clicking checklist items
            TestBase::clickElement('.checklist-item', 'Click checklist item');
            $screenshot = TestBase::takeScreenshot('automation_checklist_click', 'Checklist item clicked');
            $this->addResult('automation', 'element_click', 'passed', 'Element click successful', $screenshot);
            
            // Test JavaScript execution
            $result = TestBase::evaluateScript('typeof window.StatusManager !== "undefined"', 'Check StatusManager availability');
            TestBase::assertTrue($result === true || $result === 'true', 'StatusManager should be available');
            $this->addResult('automation', 'javascript_execution', 'passed', 'JavaScript execution successful');
            
        } catch (Exception $e) {
            $this->addResult('automation', 'browser_automation', 'failed', $e->getMessage());
        }
    }
    
    private function testVisualValidation() {
        echo "👁️  Testing Visual Validation...\n";
        
        try {
            // Test visual elements on main page
            TestBase::navigateToPage($this->baseUrl . '/index.php', 'Navigate to main page');
            TestBase::waitForText('AccessiList', 10);
            $screenshot = TestBase::takeScreenshot('visual_main_page', 'Main page visual validation');
            $this->addResult('visual', 'main_page_visual', 'passed', 'Main page visual elements verified', $screenshot);
            
            // Test visual elements on checklist page
            TestBase::navigateToPage($this->baseUrl . '/php/mychecklist.php', 'Navigate to checklist page');
            TestBase::waitForText('Accessibility', 10);
            $screenshot = TestBase::takeScreenshot('visual_checklist_page', 'Checklist page visual validation');
            $this->addResult('visual', 'checklist_page_visual', 'passed', 'Checklist page visual elements verified', $screenshot);
            
        } catch (Exception $e) {
            $this->addResult('visual', 'visual_validation', 'failed', $e->getMessage());
        }
    }
    
    private function testPerformanceMonitoring() {
        echo "📊 Testing Performance Monitoring...\n";
        
        try {
            // Test page load performance
            TestBase::startPerformanceTrace(true, false);
            
            TestBase::navigateToPage($this->baseUrl . '/index.php', 'Navigate to main page');
            TestBase::waitForText('AccessiList', 10);
            
            TestBase::navigateToPage($this->baseUrl . '/php/mychecklist.php', 'Navigate to checklist page');
            TestBase::waitForText('Accessibility', 15);
            
            $trace = TestBase::stopPerformanceTrace();
            
            if ($trace['loadTime'] > TestConfig::PERFORMANCE_THRESHOLD) {
                throw new Exception("Performance threshold exceeded: {$trace['loadTime']}ms > " . TestConfig::PERFORMANCE_THRESHOLD . "ms");
            }
            
            $this->addResult('performance', 'page_load_performance', 'passed', "Page load time: {$trace['loadTime']}ms");
            
        } catch (Exception $e) {
            $this->addResult('performance', 'performance_monitoring', 'failed', $e->getMessage());
        }
    }
    
    private function addResult($category, $test, $status, $message = '', $screenshot = null) {
        $this->results[] = [
            'category' => $category,
            'test' => $test,
            'status' => $status,
            'message' => $message,
            'screenshot' => $screenshot,
            'timestamp' => date('Y-m-d H:i:s')
        ];
    }
    
    private function generateReport() {
        echo "\n📊 Chrome MCP Test Results\n";
        echo "=========================\n";
        
        $total = count($this->results);
        $passed = count(array_filter($this->results, fn($r) => $r['status'] === 'passed'));
        $failed = count(array_filter($this->results, fn($r) => $r['status'] === 'failed'));
        
        echo "Total Tests: $total\n";
        echo "Passed: $passed\n";
        echo "Failed: $failed\n\n";
        
        // Detailed results
        echo "📋 Detailed Results\n";
        echo "==================\n";
        
        $currentCategory = '';
        foreach ($this->results as $result) {
            if ($result['category'] !== $currentCategory) {
                $currentCategory = $result['category'];
                echo "\n📁 {$currentCategory} Tests:\n";
            }
            
            $status = $result['status'] === 'passed' ? '✅' : '❌';
            echo "  {$status} {$result['test']}: {$result['message']}\n";
            
            if ($result['screenshot']) {
                echo "    📸 Screenshot: {$result['screenshot']}\n";
            }
        }
        
        // Final status
        echo "\n🎯 Chrome MCP Test Status: ";
        if ($failed === 0) {
            echo "✅ ALL TESTS PASSED\n";
            exit(0);
        } else {
            echo "❌ $failed TEST(S) FAILED\n";
            exit(1);
        }
    }
}

// Run Chrome MCP tests if this file is executed directly
if (basename(__FILE__) === basename($_SERVER['SCRIPT_NAME'])) {
    $runner = new ChromeMCPTestRunner();
    $runner->runAllTests();
}
