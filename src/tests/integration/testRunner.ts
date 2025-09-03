/**
 * Integration Test Runner
 * Executes and manages integration tests for Phase 3 components
 */

import { phase3IntegrationTestFramework } from './phase3IntegrationTestFramework';

export interface TestRunner {
  runTests(options?: TestRunOptions): Promise<TestRunResult>;
  runSpecificTests(testIds: string[]): Promise<TestRunResult>;
  runContinuousTests(): Promise<void>;
  generateReport(format: 'json' | 'html' | 'xml'): Promise<string>;
}

export interface TestRunOptions {
  categories?: ('calculator' | 'dataflow' | 'performance' | 'ai_integration' | 'monitoring')[];
  parallel?: boolean;
  timeout?: number;
  retries?: number;
  coverage?: boolean;
  verbose?: boolean;
  failFast?: boolean;
}

export interface TestRunResult {
  success: boolean;
  summary: TestExecutionSummary;
  results: any;
  report: string;
  recommendations: string[];
}

export interface TestExecutionSummary {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  skippedTests: number;
  duration: number;
  coverage: number;
  performanceScore: number;
  reliabilityScore: number;
}

class IntegrationTestRunner implements TestRunner {
  private isRunning: boolean = false;
  private currentResults: any = null;

  async runTests(options: TestRunOptions = {}): Promise<TestRunResult> {
    console.log('🚀 Starting Integration Test Execution...');
    
    if (this.isRunning) {
      throw new Error('Tests are already running');
    }

    this.isRunning = true;
    const startTime = Date.now();

    try {
      // Configure test framework based on options
      this.configureTestFramework(options);

      // Run the integration tests
      const results = await phase3IntegrationTestFramework.runAllTests();
      this.currentResults = results;

      // Calculate scores
      const performanceScore = this.calculatePerformanceScore(results);
      const reliabilityScore = this.calculateReliabilityScore(results);

      // Generate summary
      const summary: TestExecutionSummary = {
        totalTests: results.totalTests,
        passedTests: results.passedTests,
        failedTests: results.failedTests,
        skippedTests: results.skippedTests,
        duration: results.duration,
        coverage: results.coverage,
        performanceScore,
        reliabilityScore,
      };

      // Generate report
      const report = await this.generateReport('json');

      // Generate recommendations
      const recommendations = this.generateRecommendations(results);

      const success = results.failedTests === 0 && performanceScore >= 80 && reliabilityScore >= 90;

      console.log(`✅ Test Execution Completed: ${success ? 'SUCCESS' : 'ISSUES FOUND'}`);
      console.log(`📊 Results: ${results.passedTests}/${results.totalTests} passed`);
      console.log(`⚡ Performance Score: ${performanceScore}%`);
      console.log(`🛡️ Reliability Score: ${reliabilityScore}%`);

      return {
        success,
        summary,
        results,
        report,
        recommendations,
      };
    } catch (error) {
      console.error('❌ Test Execution Failed:', error);
      throw error;
    } finally {
      this.isRunning = false;
    }
  }

  async runSpecificTests(testIds: string[]): Promise<TestRunResult> {
    console.log(`🎯 Running Specific Tests: ${testIds.join(', ')}`);
    
    // For now, run all tests and filter results
    // In a real implementation, this would run only specific tests
    const fullResults = await this.runTests();
    
    // Filter results to only include specified test IDs
    const filteredResults = {
      ...fullResults.results,
      results: fullResults.results.results.filter((result: any) => 
        testIds.includes(result.testId)
      ),
    };

    // Recalculate summary for filtered results
    const filteredSummary = this.calculateFilteredSummary(filteredResults);

    return {
      ...fullResults,
      summary: filteredSummary,
      results: filteredResults,
    };
  }

  async runContinuousTests(): Promise<void> {
    console.log('🔄 Starting Continuous Testing Mode...');
    
    const runInterval = 5 * 60 * 1000; // 5 minutes
    let consecutiveFailures = 0;
    const maxConsecutiveFailures = 3;

    while (consecutiveFailures < maxConsecutiveFailures) {
      try {
        console.log(`🔄 Running continuous test cycle at ${new Date().toISOString()}`);
        
        const result = await this.runTests({
          categories: ['calculator', 'dataflow', 'performance'],
          failFast: true,
          verbose: false,
        });

        if (result.success) {
          consecutiveFailures = 0;
          console.log('✅ Continuous test cycle passed');
        } else {
          consecutiveFailures++;
          console.warn(`⚠️ Continuous test cycle failed (${consecutiveFailures}/${maxConsecutiveFailures})`);
          
          // Send alert if configured
          await this.sendAlert(result);
        }

        // Wait before next cycle
        await new Promise(resolve => setTimeout(resolve, runInterval));
      } catch (error) {
        consecutiveFailures++;
        console.error(`❌ Continuous test cycle error (${consecutiveFailures}/${maxConsecutiveFailures}):`, error);
        
        if (consecutiveFailures >= maxConsecutiveFailures) {
          console.error('🚨 Maximum consecutive failures reached. Stopping continuous testing.');
          break;
        }

        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, runInterval));
      }
    }
  }

  async generateReport(format: 'json' | 'html' | 'xml' = 'json'): Promise<string> {
    if (!this.currentResults) {
      throw new Error('No test results available. Run tests first.');
    }

    switch (format) {
      case 'json':
        return this.generateJSONReport();
      case 'html':
        return this.generateHTMLReport();
      case 'xml':
        return this.generateXMLReport();
      default:
        throw new Error(`Unsupported report format: ${format}`);
    }
  }

  private configureTestFramework(options: TestRunOptions) {
    // Configure the test framework based on options
    console.log('⚙️ Configuring test framework with options:', options);
    
    // In a real implementation, this would configure the framework
    // For now, we'll just log the configuration
  }

  private calculatePerformanceScore(results: any): number {
    const performanceResults = results.results.filter((r: any) => r.category === 'performance');
    if (performanceResults.length === 0) return 100;

    const passedPerformanceTests = performanceResults.filter((r: any) => r.status === 'passed').length;
    const performancePassRate = (passedPerformanceTests / performanceResults.length) * 100;

    // Factor in response times
    const responseTimeResults = performanceResults.filter((r: any) => r.metrics?.responseTime);
    const avgResponseTime = responseTimeResults.length > 0 
      ? responseTimeResults.reduce((sum: number, r: any) => sum + r.metrics.responseTime, 0) / responseTimeResults.length
      : 0;

    const responseTimeScore = avgResponseTime < 100 ? 100 : 
                             avgResponseTime < 150 ? 90 : 
                             avgResponseTime < 200 ? 80 : 60;

    return Math.round((performancePassRate * 0.7) + (responseTimeScore * 0.3));
  }

  private calculateReliabilityScore(results: any): number {
    const totalTests = results.totalTests;
    const passedTests = results.passedTests;
    const errorTests = results.results.filter((r: any) => r.status === 'error').length;

    if (totalTests === 0) return 100;

    const passRate = (passedTests / totalTests) * 100;
    const errorRate = (errorTests / totalTests) * 100;

    // Penalize errors more heavily than failures
    const reliabilityScore = passRate - (errorRate * 2);

    return Math.max(0, Math.min(100, Math.round(reliabilityScore)));
  }

  private generateRecommendations(results: any): string[] {
    const recommendations: string[] = [];

    // Analyze results and generate recommendations
    if (results.failedTests > 0) {
      recommendations.push(`Fix ${results.failedTests} failing tests before deployment`);
    }

    const performanceIssues = results.results.filter((r: any) => 
      r.category === 'performance' && r.status === 'failed'
    );
    if (performanceIssues.length > 0) {
      recommendations.push('Optimize performance for components exceeding 200ms response time');
    }

    const errorTests = results.results.filter((r: any) => r.status === 'error');
    if (errorTests.length > 0) {
      recommendations.push('Investigate and fix test execution errors');
    }

    if (results.coverage < 80) {
      recommendations.push('Increase test coverage to at least 80%');
    }

    // Add general recommendations
    recommendations.push('Implement continuous integration testing');
    recommendations.push('Add performance monitoring in production');
    recommendations.push('Set up automated alerting for test failures');

    return recommendations;
  }

  private calculateFilteredSummary(filteredResults: any): TestExecutionSummary {
    const results = filteredResults.results;
    const totalTests = results.length;
    const passedTests = results.filter((r: any) => r.status === 'passed').length;
    const failedTests = results.filter((r: any) => r.status === 'failed').length;
    const skippedTests = results.filter((r: any) => r.status === 'skipped').length;
    const duration = results.reduce((sum: number, r: any) => sum + r.duration, 0);

    return {
      totalTests,
      passedTests,
      failedTests,
      skippedTests,
      duration,
      coverage: totalTests > 0 ? (passedTests / totalTests) * 100 : 0,
      performanceScore: this.calculatePerformanceScore(filteredResults),
      reliabilityScore: this.calculateReliabilityScore(filteredResults),
    };
  }

  private async sendAlert(result: TestRunResult): Promise<void> {
    // In a real implementation, this would send alerts via email, Slack, etc.
    console.log('🚨 ALERT: Test failures detected');
    console.log(`Failed tests: ${result.summary.failedTests}`);
    console.log(`Performance score: ${result.summary.performanceScore}%`);
    console.log(`Reliability score: ${result.summary.reliabilityScore}%`);
  }

  private generateJSONReport(): string {
    const report = {
      timestamp: new Date().toISOString(),
      summary: this.currentResults.summary,
      results: this.currentResults.results,
      coverage: this.currentResults.coverage,
      performance: {
        averageResponseTime: this.calculateAverageResponseTime(),
        slowestTests: this.getSlowestTests(5),
        performanceScore: this.calculatePerformanceScore(this.currentResults),
      },
      reliability: {
        reliabilityScore: this.calculateReliabilityScore(this.currentResults),
        errorRate: this.calculateErrorRate(),
        criticalIssues: this.currentResults.summary.criticalIssues,
      },
      recommendations: this.generateRecommendations(this.currentResults),
    };

    return JSON.stringify(report, null, 2);
  }

  private generateHTMLReport(): string {
    const summary = this.currentResults.summary;
    const performanceScore = this.calculatePerformanceScore(this.currentResults);
    const reliabilityScore = this.calculateReliabilityScore(this.currentResults);

    return `
<!DOCTYPE html>
<html>
<head>
    <title>Phase 3 Integration Test Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #f5f5f5; padding: 20px; border-radius: 5px; }
        .summary { display: flex; gap: 20px; margin: 20px 0; }
        .metric { background: white; padding: 15px; border: 1px solid #ddd; border-radius: 5px; flex: 1; }
        .passed { color: #28a745; }
        .failed { color: #dc3545; }
        .warning { color: #ffc107; }
        .results { margin: 20px 0; }
        .test-result { padding: 10px; margin: 5px 0; border-left: 4px solid #ddd; }
        .test-passed { border-left-color: #28a745; }
        .test-failed { border-left-color: #dc3545; }
        .test-error { border-left-color: #ffc107; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Phase 3 Integration Test Report</h1>
        <p>Generated: ${new Date().toISOString()}</p>
        <p>Status: ${summary.overallStatus === 'passed' ? '✅ PASSED' : '❌ ISSUES FOUND'}</p>
    </div>
    
    <div class="summary">
        <div class="metric">
            <h3>Test Results</h3>
            <p class="passed">Passed: ${this.currentResults.passedTests}</p>
            <p class="failed">Failed: ${this.currentResults.failedTests}</p>
            <p class="warning">Skipped: ${this.currentResults.skippedTests}</p>
        </div>
        <div class="metric">
            <h3>Performance</h3>
            <p>Score: ${performanceScore}%</p>
            <p>Avg Response: ${this.calculateAverageResponseTime()}ms</p>
        </div>
        <div class="metric">
            <h3>Reliability</h3>
            <p>Score: ${reliabilityScore}%</p>
            <p>Coverage: ${this.currentResults.coverage.toFixed(1)}%</p>
        </div>
    </div>
    
    <div class="results">
        <h2>Test Results</h2>
        ${this.currentResults.results.map((result: any) => `
            <div class="test-result test-${result.status}">
                <strong>${result.testName}</strong> (${result.duration}ms)
                <br>Status: ${result.status.toUpperCase()}
                ${result.message ? `<br>Message: ${result.message}` : ''}
            </div>
        `).join('')}
    </div>
    
    <div class="recommendations">
        <h2>Recommendations</h2>
        <ul>
            ${this.generateRecommendations(this.currentResults).map(rec => `<li>${rec}</li>`).join('')}
        </ul>
    </div>
</body>
</html>`;
  }

  private generateXMLReport(): string {
    const summary = this.currentResults.summary;
    
    return `<?xml version="1.0" encoding="UTF-8"?>
<testReport>
    <timestamp>${new Date().toISOString()}</timestamp>
    <summary>
        <totalTests>${this.currentResults.totalTests}</totalTests>
        <passedTests>${this.currentResults.passedTests}</passedTests>
        <failedTests>${this.currentResults.failedTests}</failedTests>
        <skippedTests>${this.currentResults.skippedTests}</skippedTests>
        <duration>${this.currentResults.duration}</duration>
        <coverage>${this.currentResults.coverage}</coverage>
        <status>${summary.overallStatus}</status>
    </summary>
    <results>
        ${this.currentResults.results.map((result: any) => `
        <test>
            <id>${result.testId}</id>
            <name>${result.testName}</name>
            <category>${result.category}</category>
            <status>${result.status}</status>
            <duration>${result.duration}</duration>
            ${result.message ? `<message>${result.message}</message>` : ''}
        </test>
        `).join('')}
    </results>
    <recommendations>
        ${this.generateRecommendations(this.currentResults).map(rec => `<recommendation>${rec}</recommendation>`).join('')}
    </recommendations>
</testReport>`;
  }

  private calculateAverageResponseTime(): number {
    const resultsWithMetrics = this.currentResults.results.filter((r: any) => r.metrics?.responseTime);
    if (resultsWithMetrics.length === 0) return 0;
    
    const totalTime = resultsWithMetrics.reduce((sum: number, r: any) => sum + r.metrics.responseTime, 0);
    return Math.round(totalTime / resultsWithMetrics.length);
  }

  private getSlowestTests(count: number): any[] {
    return this.currentResults.results
      .filter((r: any) => r.metrics?.responseTime)
      .sort((a: any, b: any) => b.metrics.responseTime - a.metrics.responseTime)
      .slice(0, count)
      .map((r: any) => ({
        testName: r.testName,
        responseTime: r.metrics.responseTime,
        category: r.category,
      }));
  }

  private calculateErrorRate(): number {
    const errorTests = this.currentResults.results.filter((r: any) => r.status === 'error').length;
    return this.currentResults.totalTests > 0 ? (errorTests / this.currentResults.totalTests) * 100 : 0;
  }
}

// Export singleton instance
export const integrationTestRunner = new IntegrationTestRunner();

// CLI interface for running tests
export async function runIntegrationTests(options: TestRunOptions = {}): Promise<void> {
  try {
    console.log('🧪 Phase 3 Integration Test Suite');
    console.log('================================');
    
    const result = await integrationTestRunner.runTests(options);
    
    if (result.success) {
      console.log('\n🎉 All tests passed successfully!');
      console.log(`📊 Performance Score: ${result.summary.performanceScore}%`);
      console.log(`🛡️ Reliability Score: ${result.summary.reliabilityScore}%`);
      console.log(`📈 Coverage: ${result.summary.coverage.toFixed(1)}%`);
    } else {
      console.log('\n⚠️ Some tests failed or have issues:');
      console.log(`❌ Failed: ${result.summary.failedTests}`);
      console.log(`⏱️ Performance Score: ${result.summary.performanceScore}%`);
      console.log(`🛡️ Reliability Score: ${result.summary.reliabilityScore}%`);
      
      console.log('\n📋 Recommendations:');
      result.recommendations.forEach(rec => console.log(`  • ${rec}`));
    }
    
    // Generate and save report
    const report = await integrationTestRunner.generateReport('html');
    console.log('\n📄 Test report generated');
    
  } catch (error) {
    console.error('\n💥 Test execution failed:', error);
    process.exit(1);
  }
}

// Export for use in other modules
export { TestRunOptions, TestRunResult, TestExecutionSummary };
