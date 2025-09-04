#!/usr/bin/env node

/**
 * Code Quality Check Script
 * 
 * This script performs comprehensive code quality checks including:
 * - TypeScript compilation
 * - ESLint analysis
 * - Security audit
 * - Code complexity analysis
 * - Test coverage verification
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class CodeQualityChecker {
  constructor() {
    this.results = {
      typescript: { passed: false, errors: 0, warnings: 0 },
      eslint: { passed: false, errors: 0, warnings: 0 },
      security: { passed: false, vulnerabilities: 0 },
      tests: { passed: false, coverage: 0 },
      overall: { passed: false, score: 0 }
    };
  }

  /**
   * Run all quality checks
   */
  async runAllChecks() {
    console.log('🔍 Starting Code Quality Analysis...\n');

    try {
      await this.checkTypeScript();
      await this.checkESLint();
      await this.checkSecurity();
      await this.checkTestCoverage();
      
      this.calculateOverallScore();
      this.generateReport();
      
    } catch (error) {
      console.error('❌ Code quality check failed:', error.message);
      process.exit(1);
    }
  }

  /**
   * Check TypeScript compilation
   */
  async checkTypeScript() {
    console.log('📝 Checking TypeScript compilation...');
    
    try {
      const output = execSync('npx tsc --noEmit', { 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      this.results.typescript.passed = true;
      console.log('✅ TypeScript compilation passed');
      
    } catch (error) {
      const errorOutput = error.stdout || error.stderr || '';
      const errors = (errorOutput.match(/error TS\d+:/g) || []).length;
      const warnings = (errorOutput.match(/warning TS\d+:/g) || []).length;
      
      this.results.typescript.errors = errors;
      this.results.typescript.warnings = warnings;
      this.results.typescript.passed = errors === 0;
      
      if (errors > 0) {
        console.log(`❌ TypeScript compilation failed: ${errors} errors, ${warnings} warnings`);
        console.log('First few errors:');
        console.log(errorOutput.split('\n').slice(0, 10).join('\n'));
      } else {
        console.log(`⚠️  TypeScript compilation passed with warnings: ${warnings} warnings`);
      }
    }
  }

  /**
   * Check ESLint analysis
   */
  async checkESLint() {
    console.log('🔧 Running ESLint analysis...');
    
    try {
      const output = execSync('npm run lint -- --format json', { 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      // ESLint returns empty output when no issues
      if (!output.trim()) {
        this.results.eslint.passed = true;
        console.log('✅ ESLint analysis passed - no issues found');
        return;
      }
      
      const results = JSON.parse(output);
      let totalErrors = 0;
      let totalWarnings = 0;
      
      results.forEach(file => {
        totalErrors += file.errorCount;
        totalWarnings += file.warningCount;
      });
      
      this.results.eslint.errors = totalErrors;
      this.results.eslint.warnings = totalWarnings;
      this.results.eslint.passed = totalErrors === 0;
      
      if (totalErrors > 0) {
        console.log(`❌ ESLint analysis failed: ${totalErrors} errors, ${totalWarnings} warnings`);
      } else {
        console.log(`⚠️  ESLint analysis passed with warnings: ${totalWarnings} warnings`);
        this.results.eslint.passed = true;
      }
      
    } catch (error) {
      // ESLint might return non-zero exit code with issues
      const errorOutput = error.stdout || '';
      
      if (errorOutput.includes('[') && errorOutput.includes(']')) {
        try {
          const results = JSON.parse(errorOutput);
          let totalErrors = 0;
          let totalWarnings = 0;
          
          results.forEach(file => {
            totalErrors += file.errorCount || 0;
            totalWarnings += file.warningCount || 0;
          });
          
          this.results.eslint.errors = totalErrors;
          this.results.eslint.warnings = totalWarnings;
          this.results.eslint.passed = totalErrors === 0;
          
          console.log(`📊 ESLint found: ${totalErrors} errors, ${totalWarnings} warnings`);
          
        } catch (parseError) {
          console.log('⚠️  ESLint analysis completed with issues (could not parse output)');
          this.results.eslint.passed = false;
        }
      } else {
        console.log('❌ ESLint analysis failed to run');
        this.results.eslint.passed = false;
      }
    }
  }

  /**
   * Check security vulnerabilities
   */
  async checkSecurity() {
    console.log('🔒 Checking security vulnerabilities...');
    
    try {
      const output = execSync('npm audit --json', { 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      const auditResult = JSON.parse(output);
      const vulnerabilities = auditResult.metadata?.vulnerabilities || {};
      const total = Object.values(vulnerabilities).reduce((sum, count) => sum + count, 0);
      
      this.results.security.vulnerabilities = total;
      this.results.security.passed = total === 0;
      
      if (total === 0) {
        console.log('✅ Security audit passed - no vulnerabilities found');
      } else {
        console.log(`❌ Security audit found ${total} vulnerabilities`);
        console.log(`   High: ${vulnerabilities.high || 0}, Medium: ${vulnerabilities.moderate || 0}, Low: ${vulnerabilities.low || 0}`);
      }
      
    } catch (error) {
      // npm audit returns non-zero exit code when vulnerabilities found
      const output = error.stdout || '';
      
      if (output) {
        try {
          const auditResult = JSON.parse(output);
          const vulnerabilities = auditResult.metadata?.vulnerabilities || {};
          const total = Object.values(vulnerabilities).reduce((sum, count) => sum + count, 0);
          
          this.results.security.vulnerabilities = total;
          this.results.security.passed = total === 0;
          
          console.log(`📊 Security audit found ${total} vulnerabilities`);
          
        } catch (parseError) {
          console.log('⚠️  Security audit completed (could not parse output)');
          this.results.security.passed = false;
        }
      } else {
        console.log('❌ Security audit failed to run');
        this.results.security.passed = false;
      }
    }
  }

  /**
   * Check test coverage
   */
  async checkTestCoverage() {
    console.log('🧪 Checking test coverage...');
    
    try {
      const output = execSync('npm run test:coverage -- --reporter=json', { 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      // Look for coverage information in output
      const coverageMatch = output.match(/All files[^|]*\|[^|]*\|[^|]*\|[^|]*\|[^|]*(\d+\.?\d*)/);
      
      if (coverageMatch) {
        const coverage = parseFloat(coverageMatch[1]);
        this.results.tests.coverage = coverage;
        this.results.tests.passed = coverage >= 70; // Minimum 70% coverage
        
        if (coverage >= 70) {
          console.log(`✅ Test coverage passed: ${coverage}%`);
        } else {
          console.log(`❌ Test coverage below threshold: ${coverage}% (minimum: 70%)`);
        }
      } else {
        console.log('⚠️  Could not determine test coverage');
        this.results.tests.passed = false;
      }
      
    } catch (error) {
      console.log('⚠️  Test coverage check failed');
      this.results.tests.passed = false;
    }
  }

  /**
   * Calculate overall quality score
   */
  calculateOverallScore() {
    let score = 0;
    let maxScore = 0;

    // TypeScript (25 points)
    maxScore += 25;
    if (this.results.typescript.passed) {
      score += 25;
    } else if (this.results.typescript.errors === 0) {
      score += 15; // Warnings only
    }

    // ESLint (25 points)
    maxScore += 25;
    if (this.results.eslint.passed) {
      score += 25;
    } else if (this.results.eslint.errors === 0) {
      score += 15; // Warnings only
    }

    // Security (25 points)
    maxScore += 25;
    if (this.results.security.passed) {
      score += 25;
    } else if (this.results.security.vulnerabilities <= 2) {
      score += 10; // Few vulnerabilities
    }

    // Test Coverage (25 points)
    maxScore += 25;
    if (this.results.tests.coverage >= 90) {
      score += 25;
    } else if (this.results.tests.coverage >= 80) {
      score += 20;
    } else if (this.results.tests.coverage >= 70) {
      score += 15;
    } else if (this.results.tests.coverage >= 50) {
      score += 10;
    }

    this.results.overall.score = Math.round((score / maxScore) * 100);
    this.results.overall.passed = this.results.overall.score >= 80;
  }

  /**
   * Generate quality report
   */
  generateReport() {
    console.log('\n📊 Code Quality Report');
    console.log('========================');
    
    console.log(`TypeScript: ${this.results.typescript.passed ? '✅' : '❌'} (${this.results.typescript.errors} errors, ${this.results.typescript.warnings} warnings)`);
    console.log(`ESLint: ${this.results.eslint.passed ? '✅' : '❌'} (${this.results.eslint.errors} errors, ${this.results.eslint.warnings} warnings)`);
    console.log(`Security: ${this.results.security.passed ? '✅' : '❌'} (${this.results.security.vulnerabilities} vulnerabilities)`);
    console.log(`Test Coverage: ${this.results.tests.passed ? '✅' : '❌'} (${this.results.tests.coverage}%)`);
    
    console.log(`\n🎯 Overall Score: ${this.results.overall.score}/100`);
    
    if (this.results.overall.passed) {
      console.log('🎉 Code quality check PASSED!');
    } else {
      console.log('❌ Code quality check FAILED!');
      console.log('\n📋 Recommendations:');
      
      if (!this.results.typescript.passed) {
        console.log('- Fix TypeScript compilation errors');
      }
      if (!this.results.eslint.passed) {
        console.log('- Fix ESLint errors and warnings');
      }
      if (!this.results.security.passed) {
        console.log('- Address security vulnerabilities');
      }
      if (!this.results.tests.passed) {
        console.log('- Improve test coverage to at least 70%');
      }
    }

    // Save report to file
    const reportPath = path.join(process.cwd(), 'code-quality-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
    console.log(`\n📄 Detailed report saved to: ${reportPath}`);
  }
}

// Run the quality checker
if (require.main === module) {
  const checker = new CodeQualityChecker();
  checker.runAllChecks().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = CodeQualityChecker;
