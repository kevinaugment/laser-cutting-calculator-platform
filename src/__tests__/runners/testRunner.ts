// Test Runner for 20 Core Calculators
// Orchestrates comprehensive testing with reporting and CI/CD integration

import { coreCalculatorTestFramework, TestExecutionResult } from '../core/coreCalculatorTestFramework';
import { coreCalculatorMetadata } from '../../data/coreCalculatorConfigs';
import fs from 'fs';
import path from 'path';

export interface TestRunnerConfig {
  outputDir: string;
  generateReports: boolean;
  parallel: boolean;
  verbose: boolean;
  failFast: boolean;
  categories?: string[];
  calculators?: string[];
}

export interface TestRunnerResult {
  success: boolean;
  totalCalculators: number;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  duration: number;
  coverage: number;
  results: Map<string, TestExecutionResult>;
  reportPaths: string[];
}

export class CoreCalculatorTestRunner {
  private config: TestRunnerConfig;

  constructor(config: Partial<TestRunnerConfig> = {}) {
    this.config = {
      outputDir: './test-reports',
      generateReports: true,
      parallel: true,
      verbose: false,
      failFast: false,
      ...config
    };

    // Ensure output directory exists
    if (this.config.generateReports && !fs.existsSync(this.config.outputDir)) {
      fs.mkdirSync(this.config.outputDir, { recursive: true });
    }
  }

  /**
   * Run all tests for 20 core calculators
   */
  async runAllTests(): Promise<TestRunnerResult> {
    console.log('🚀 Starting Core Calculator Test Suite...');
    console.log(`📊 Testing ${Object.keys(coreCalculatorMetadata).length} calculators`);
    
    const startTime = Date.now();
    const calculatorIds = this.getCalculatorsToTest();
    
    try {
      // Configure test framework
      const testFramework = coreCalculatorTestFramework;
      
      // Run tests
      const results = this.config.parallel 
        ? await this.runTestsInParallel(calculatorIds)
        : await this.runTestsSequentially(calculatorIds);
      
      const duration = Date.now() - startTime;
      const runnerResult = this.aggregateResults(results, duration);
      
      // Generate reports
      if (this.config.generateReports) {
        await this.generateReports(runnerResult);
      }
      
      // Print summary
      this.printSummary(runnerResult);
      
      return runnerResult;
      
    } catch (error) {
      console.error('❌ Test execution failed:', error);
      throw error;
    }
  }

  /**
   * Run tests for specific calculators
   */
  async runSpecificTests(calculatorIds: string[]): Promise<TestRunnerResult> {
    console.log(`🎯 Running tests for specific calculators: ${calculatorIds.join(', ')}`);
    
    const startTime = Date.now();
    
    try {
      const results = this.config.parallel 
        ? await this.runTestsInParallel(calculatorIds)
        : await this.runTestsSequentially(calculatorIds);
      
      const duration = Date.now() - startTime;
      const runnerResult = this.aggregateResults(results, duration);
      
      if (this.config.generateReports) {
        await this.generateReports(runnerResult);
      }
      
      this.printSummary(runnerResult);
      
      return runnerResult;
      
    } catch (error) {
      console.error('❌ Specific test execution failed:', error);
      throw error;
    }
  }

  /**
   * Run tests by category
   */
  async runTestsByCategory(categories: string[]): Promise<TestRunnerResult> {
    console.log(`📂 Running tests for categories: ${categories.join(', ')}`);
    
    const calculatorIds = Object.entries(coreCalculatorMetadata)
      .filter(([_, metadata]) => categories.includes(metadata.category))
      .map(([id, _]) => id);
    
    return this.runSpecificTests(calculatorIds);
  }

  /**
   * Get calculators to test based on configuration
   */
  private getCalculatorsToTest(): string[] {
    if (this.config.calculators) {
      return this.config.calculators;
    }
    
    if (this.config.categories) {
      return Object.entries(coreCalculatorMetadata)
        .filter(([_, metadata]) => this.config.categories!.includes(metadata.category))
        .map(([id, _]) => id);
    }
    
    return Object.keys(coreCalculatorMetadata);
  }

  /**
   * Run tests in parallel
   */
  private async runTestsInParallel(calculatorIds: string[]): Promise<Map<string, TestExecutionResult>> {
    console.log('⚡ Running tests in parallel...');
    
    const promises = calculatorIds.map(async (calculatorId) => {
      try {
        const result = await coreCalculatorTestFramework.runCalculatorTests(calculatorId);
        return [calculatorId, result] as [string, TestExecutionResult];
      } catch (error) {
        console.error(`❌ Failed to test ${calculatorId}:`, error);
        if (this.config.failFast) {
          throw error;
        }
        // Return a failed result
        return [calculatorId, {
          calculatorId,
          totalTests: 0,
          passedTests: 0,
          failedTests: 1,
          skippedTests: 0,
          duration: 0,
          coverage: 0,
          errors: [String(error)],
          warnings: []
        }] as [string, TestExecutionResult];
      }
    });
    
    const results = await Promise.all(promises);
    return new Map(results);
  }

  /**
   * Run tests sequentially
   */
  private async runTestsSequentially(calculatorIds: string[]): Promise<Map<string, TestExecutionResult>> {
    console.log('🔄 Running tests sequentially...');
    
    const results = new Map<string, TestExecutionResult>();
    
    for (const calculatorId of calculatorIds) {
      try {
        if (this.config.verbose) {
          console.log(`🧮 Testing ${calculatorId}...`);
        }
        
        const result = await coreCalculatorTestFramework.runCalculatorTests(calculatorId);
        results.set(calculatorId, result);
        
        if (this.config.verbose) {
          console.log(`✅ ${calculatorId}: ${result.passedTests}/${result.totalTests} passed`);
        }
        
        if (this.config.failFast && result.failedTests > 0) {
          throw new Error(`Test failed for ${calculatorId}: ${result.errors.join(', ')}`);
        }
        
      } catch (error) {
        console.error(`❌ Failed to test ${calculatorId}:`, error);
        
        if (this.config.failFast) {
          throw error;
        }
        
        // Add failed result
        results.set(calculatorId, {
          calculatorId,
          totalTests: 0,
          passedTests: 0,
          failedTests: 1,
          skippedTests: 0,
          duration: 0,
          coverage: 0,
          errors: [String(error)],
          warnings: []
        });
      }
    }
    
    return results;
  }

  /**
   * Aggregate test results
   */
  private aggregateResults(results: Map<string, TestExecutionResult>, duration: number): TestRunnerResult {
    const resultArray = Array.from(results.values());
    
    const totalCalculators = results.size;
    const totalTests = resultArray.reduce((sum, result) => sum + result.totalTests, 0);
    const passedTests = resultArray.reduce((sum, result) => sum + result.passedTests, 0);
    const failedTests = resultArray.reduce((sum, result) => sum + result.failedTests, 0);
    const coverage = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;
    const success = failedTests === 0;
    
    return {
      success,
      totalCalculators,
      totalTests,
      passedTests,
      failedTests,
      duration,
      coverage,
      results,
      reportPaths: []
    };
  }

  /**
   * Generate comprehensive reports
   */
  private async generateReports(result: TestRunnerResult): Promise<void> {
    console.log('📄 Generating test reports...');
    
    try {
      // Generate JSON report
      const jsonReport = this.generateJSONReport(result);
      const jsonPath = path.join(this.config.outputDir, 'core-calculator-tests.json');
      fs.writeFileSync(jsonPath, JSON.stringify(jsonReport, null, 2));
      result.reportPaths.push(jsonPath);
      
      // Generate HTML report
      const htmlReport = this.generateHTMLReport(result);
      const htmlPath = path.join(this.config.outputDir, 'core-calculator-tests.html');
      fs.writeFileSync(htmlPath, htmlReport);
      result.reportPaths.push(htmlPath);
      
      // Generate markdown report
      const markdownReport = this.generateMarkdownReport(result);
      const mdPath = path.join(this.config.outputDir, 'core-calculator-tests.md');
      fs.writeFileSync(mdPath, markdownReport);
      result.reportPaths.push(mdPath);
      
      // Generate JUnit XML for CI/CD
      const junitReport = this.generateJUnitReport(result);
      const xmlPath = path.join(this.config.outputDir, 'junit-results.xml');
      fs.writeFileSync(xmlPath, junitReport);
      result.reportPaths.push(xmlPath);
      
      console.log(`📊 Reports generated in: ${this.config.outputDir}`);
      
    } catch (error) {
      console.error('❌ Failed to generate reports:', error);
    }
  }

  /**
   * Generate JSON report
   */
  private generateJSONReport(result: TestRunnerResult): any {
    return {
      timestamp: new Date().toISOString(),
      summary: {
        success: result.success,
        totalCalculators: result.totalCalculators,
        totalTests: result.totalTests,
        passedTests: result.passedTests,
        failedTests: result.failedTests,
        duration: result.duration,
        coverage: result.coverage
      },
      calculators: Array.from(result.results.entries()).map(([id, testResult]) => ({
        id,
        name: coreCalculatorMetadata[id]?.name || id,
        category: coreCalculatorMetadata[id]?.category || 'Unknown',
        ...testResult
      }))
    };
  }

  /**
   * Generate HTML report
   */
  private generateHTMLReport(result: TestRunnerResult): string {
    const successRate = ((result.passedTests / result.totalTests) * 100).toFixed(2);
    const statusColor = result.success ? '#28a745' : '#dc3545';
    
    return `
<!DOCTYPE html>
<html>
<head>
    <title>Core Calculator Test Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: ${statusColor}; color: white; padding: 20px; border-radius: 5px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
        .metric { background: #f8f9fa; padding: 15px; border-radius: 5px; text-align: center; }
        .metric-value { font-size: 2em; font-weight: bold; color: ${statusColor}; }
        .calculator { margin: 10px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
        .success { border-left: 4px solid #28a745; }
        .failure { border-left: 4px solid #dc3545; }
        .error { color: #dc3545; font-size: 0.9em; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Core Calculator Test Report</h1>
        <p>Generated: ${new Date().toLocaleString()}</p>
        <p>Status: ${result.success ? '✅ PASSED' : '❌ FAILED'}</p>
    </div>
    
    <div class="summary">
        <div class="metric">
            <div class="metric-value">${result.totalCalculators}</div>
            <div>Calculators</div>
        </div>
        <div class="metric">
            <div class="metric-value">${result.totalTests}</div>
            <div>Total Tests</div>
        </div>
        <div class="metric">
            <div class="metric-value">${result.passedTests}</div>
            <div>Passed</div>
        </div>
        <div class="metric">
            <div class="metric-value">${successRate}%</div>
            <div>Success Rate</div>
        </div>
    </div>
    
    <h2>Calculator Results</h2>
    ${Array.from(result.results.entries()).map(([id, testResult]) => `
        <div class="calculator ${testResult.failedTests === 0 ? 'success' : 'failure'}">
            <h3>${coreCalculatorMetadata[id]?.name || id}</h3>
            <p><strong>Category:</strong> ${coreCalculatorMetadata[id]?.category || 'Unknown'}</p>
            <p><strong>Tests:</strong> ${testResult.passedTests}/${testResult.totalTests} passed</p>
            <p><strong>Duration:</strong> ${testResult.duration}ms</p>
            <p><strong>Coverage:</strong> ${testResult.coverage.toFixed(2)}%</p>
            ${testResult.errors.length > 0 ? `
                <div class="error">
                    <strong>Errors:</strong>
                    <ul>${testResult.errors.map(error => `<li>${error}</li>`).join('')}</ul>
                </div>
            ` : ''}
        </div>
    `).join('')}
</body>
</html>`;
  }

  /**
   * Generate Markdown report
   */
  private generateMarkdownReport(result: TestRunnerResult): string {
    return coreCalculatorTestFramework.generateTestReport();
  }

  /**
   * Generate JUnit XML report for CI/CD
   */
  private generateJUnitReport(result: TestRunnerResult): string {
    const testsuites = Array.from(result.results.entries()).map(([id, testResult]) => {
      const failures = testResult.errors.map(error => 
        `<failure message="${error.replace(/"/g, '&quot;')}">${error}</failure>`
      ).join('');
      
      return `
    <testsuite name="${id}" tests="${testResult.totalTests}" failures="${testResult.failedTests}" time="${testResult.duration / 1000}">
      <testcase name="${id}-validation" classname="CoreCalculator" time="${testResult.duration / 1000}">
        ${failures}
      </testcase>
    </testsuite>`;
    }).join('');
    
    return `<?xml version="1.0" encoding="UTF-8"?>
<testsuites name="CoreCalculatorTests" tests="${result.totalTests}" failures="${result.failedTests}" time="${result.duration / 1000}">
${testsuites}
</testsuites>`;
  }

  /**
   * Print test summary to console
   */
  private printSummary(result: TestRunnerResult): void {
    console.log('\n' + '='.repeat(60));
    console.log('📊 CORE CALCULATOR TEST SUMMARY');
    console.log('='.repeat(60));
    console.log(`🎯 Status: ${result.success ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`📱 Calculators: ${result.totalCalculators}/20`);
    console.log(`🧪 Total Tests: ${result.totalTests}`);
    console.log(`✅ Passed: ${result.passedTests}`);
    console.log(`❌ Failed: ${result.failedTests}`);
    console.log(`📈 Success Rate: ${((result.passedTests / result.totalTests) * 100).toFixed(2)}%`);
    console.log(`⏱️  Duration: ${(result.duration / 1000).toFixed(2)}s`);
    console.log(`📊 Coverage: ${result.coverage.toFixed(2)}%`);
    
    if (result.reportPaths.length > 0) {
      console.log('\n📄 Reports generated:');
      result.reportPaths.forEach(path => console.log(`   - ${path}`));
    }
    
    if (!result.success) {
      console.log('\n❌ Failed calculators:');
      result.results.forEach((testResult, calculatorId) => {
        if (testResult.failedTests > 0) {
          console.log(`   - ${calculatorId}: ${testResult.errors.join(', ')}`);
        }
      });
    }
    
    console.log('='.repeat(60));
  }
}

// Export default instance
export const coreCalculatorTestRunner = new CoreCalculatorTestRunner();
