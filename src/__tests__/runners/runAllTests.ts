#!/usr/bin/env tsx
// Test Runner Script for 20 Core Calculators
// Execute comprehensive testing suite with detailed reporting

import { coreCalculatorTestRunner } from './testRunner';

async function main() {
  console.log('🚀 Starting Core Calculator Test Suite...');
  console.log('📊 Testing all 20 core calculators with comprehensive coverage\n');

  try {
    // Run all tests
    const result = await coreCalculatorTestRunner.runAllTests();
    
    // Exit with appropriate code
    process.exit(result.success ? 0 : 1);
    
  } catch (error) {
    console.error('❌ Test execution failed:', error);
    process.exit(1);
  }
}

// Handle CLI arguments
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Core Calculator Test Runner

Usage:
  npm run test:all-calculators                    # Run all tests
  npm run test:all-calculators -- --category      # Run tests by category
  npm run test:all-calculators -- --calculator    # Run specific calculator tests

Options:
  --help, -h                Show this help message
  --category <name>         Run tests for specific category
  --calculator <id>         Run tests for specific calculator
  --parallel               Run tests in parallel (default)
  --sequential             Run tests sequentially
  --verbose                Enable verbose output
  --fail-fast              Stop on first failure

Examples:
  npm run test:all-calculators -- --category "Core Engineering"
  npm run test:all-calculators -- --calculator laser-cutting-cost
  npm run test:all-calculators -- --verbose --sequential
`);
  process.exit(0);
}

// Parse arguments and run appropriate tests
if (args.includes('--category')) {
  const categoryIndex = args.indexOf('--category');
  const category = args[categoryIndex + 1];
  if (category) {
    coreCalculatorTestRunner.runTestsByCategory([category])
      .then(result => process.exit(result.success ? 0 : 1))
      .catch(error => {
        console.error('❌ Category test execution failed:', error);
        process.exit(1);
      });
  } else {
    console.error('❌ Category name required after --category');
    process.exit(1);
  }
} else if (args.includes('--calculator')) {
  const calculatorIndex = args.indexOf('--calculator');
  const calculator = args[calculatorIndex + 1];
  if (calculator) {
    coreCalculatorTestRunner.runSpecificTests([calculator])
      .then(result => process.exit(result.success ? 0 : 1))
      .catch(error => {
        console.error('❌ Calculator test execution failed:', error);
        process.exit(1);
      });
  } else {
    console.error('❌ Calculator ID required after --calculator');
    process.exit(1);
  }
} else {
  // Run all tests
  main();
}
