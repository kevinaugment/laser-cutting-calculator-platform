#!/usr/bin/env node

/**
 * Integration Test Execution Script
 * Command-line interface for running Phase 3 integration tests
 */

import { runIntegrationTests, integrationTestRunner } from './testRunner';

interface CLIOptions {
  categories?: string[];
  parallel?: boolean;
  timeout?: number;
  retries?: number;
  coverage?: boolean;
  verbose?: boolean;
  failFast?: boolean;
  continuous?: boolean;
  report?: 'json' | 'html' | 'xml';
  output?: string;
  help?: boolean;
}

function parseArguments(): CLIOptions {
  const args = process.argv.slice(2);
  const options: CLIOptions = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const nextArg = args[i + 1];

    switch (arg) {
      case '--categories':
      case '-c':
        if (nextArg && !nextArg.startsWith('--')) {
          options.categories = nextArg.split(',');
          i++;
        }
        break;
      case '--parallel':
      case '-p':
        options.parallel = true;
        break;
      case '--timeout':
      case '-t':
        if (nextArg && !nextArg.startsWith('--')) {
          options.timeout = parseInt(nextArg, 10);
          i++;
        }
        break;
      case '--retries':
      case '-r':
        if (nextArg && !nextArg.startsWith('--')) {
          options.retries = parseInt(nextArg, 10);
          i++;
        }
        break;
      case '--coverage':
        options.coverage = true;
        break;
      case '--verbose':
      case '-v':
        options.verbose = true;
        break;
      case '--fail-fast':
      case '-f':
        options.failFast = true;
        break;
      case '--continuous':
        options.continuous = true;
        break;
      case '--report':
        if (nextArg && ['json', 'html', 'xml'].includes(nextArg)) {
          options.report = nextArg as 'json' | 'html' | 'xml';
          i++;
        }
        break;
      case '--output':
      case '-o':
        if (nextArg && !nextArg.startsWith('--')) {
          options.output = nextArg;
          i++;
        }
        break;
      case '--help':
      case '-h':
        options.help = true;
        break;
    }
  }

  return options;
}

function printHelp(): void {
  console.log(`
Phase 3 Integration Test Runner

Usage: npm run test:integration [options]

Options:
  -c, --categories <list>    Test categories to run (comma-separated)
                            Options: calculator,dataflow,performance,ai_integration,monitoring
  -p, --parallel            Run tests in parallel
  -t, --timeout <ms>        Test timeout in milliseconds (default: 30000)
  -r, --retries <count>     Number of retries for failed tests (default: 3)
  --coverage                Generate test coverage report
  -v, --verbose             Verbose output
  -f, --fail-fast           Stop on first test failure
  --continuous              Run tests continuously
  --report <format>         Report format: json, html, xml (default: json)
  -o, --output <file>       Output file for report
  -h, --help                Show this help message

Examples:
  npm run test:integration                           # Run all tests
  npm run test:integration -c calculator,dataflow   # Run specific categories
  npm run test:integration --parallel --coverage    # Run with parallel execution and coverage
  npm run test:integration --continuous             # Run in continuous mode
  npm run test:integration --report html -o report.html  # Generate HTML report

Test Categories:
  calculator      - Individual calculator functionality tests
  dataflow        - Data flow and integration tests
  performance     - Performance and response time tests
  ai_integration  - AI recommendation engine tests
  monitoring      - Real-time monitoring and analytics tests
`);
}

async function main(): Promise<void> {
  const options = parseArguments();

  if (options.help) {
    printHelp();
    return;
  }

  console.log('🧪 Phase 3 Integration Test Suite');
  console.log('================================\n');

  try {
    if (options.continuous) {
      console.log('🔄 Starting continuous testing mode...');
      console.log('Press Ctrl+C to stop\n');
      await integrationTestRunner.runContinuousTests();
    } else {
      // Convert CLI options to test run options
      const testOptions = {
        categories: options.categories as any,
        parallel: options.parallel,
        timeout: options.timeout,
        retries: options.retries,
        coverage: options.coverage,
        verbose: options.verbose,
        failFast: options.failFast,
      };

      console.log('⚙️ Test Configuration:');
      console.log(`  Categories: ${testOptions.categories?.join(', ') || 'all'}`);
      console.log(`  Parallel: ${testOptions.parallel ? 'enabled' : 'disabled'}`);
      console.log(`  Timeout: ${testOptions.timeout || 30000}ms`);
      console.log(`  Retries: ${testOptions.retries || 3}`);
      console.log(`  Coverage: ${testOptions.coverage ? 'enabled' : 'disabled'}`);
      console.log(`  Verbose: ${testOptions.verbose ? 'enabled' : 'disabled'}`);
      console.log(`  Fail Fast: ${testOptions.failFast ? 'enabled' : 'disabled'}\n`);

      // Run the tests
      const result = await integrationTestRunner.runTests(testOptions);

      // Generate and save report if requested
      if (options.report || options.output) {
        const reportFormat = options.report || 'json';
        const reportContent = await integrationTestRunner.generateReport(reportFormat);
        
        if (options.output) {
          const fs = await import('fs');
          await fs.promises.writeFile(options.output, reportContent);
          console.log(`\n📄 Report saved to: ${options.output}`);
        } else {
          console.log(`\n📄 ${reportFormat.toUpperCase()} Report:`);
          if (reportFormat === 'json') {
            console.log(reportContent);
          } else {
            console.log(`Report generated (${reportContent.length} characters)`);
          }
        }
      }

      // Exit with appropriate code
      process.exit(result.success ? 0 : 1);
    }
  } catch (error) {
    console.error('\n💥 Test execution failed:', error);
    process.exit(1);
  }
}

// Handle process signals for graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Received SIGINT. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Received SIGTERM. Shutting down gracefully...');
  process.exit(0);
});

// Run the main function
if (require.main === module) {
  main().catch(error => {
    console.error('💥 Unhandled error:', error);
    process.exit(1);
  });
}

export { main as runTestCLI };
