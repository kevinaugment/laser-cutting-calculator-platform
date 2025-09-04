import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration for Laser Cutting Calculator Platform
 * 
 * This configuration is designed to work alongside existing Vitest tests
 * without conflicts. It focuses on E2E testing for 27 calculators.
 */
export default defineConfig({
  // Test directory - separate from existing src/__tests__
  testDir: './tests/e2e',
  
  // Run tests in files in parallel
  fullyParallel: true,
  
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  
  // Retry on CI only
  retries: process.env.CI ? 2 : 0,
  
  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter to use
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    // Console reporter for development
    process.env.CI ? ['github'] : ['list']
  ],
  
  // Shared settings for all the projects below
  use: {
    // Base URL to use in actions like `await page.goto('/')`
    baseURL: 'http://localhost:5173',
    
    // Collect trace when retrying the failed test
    trace: 'on-first-retry',
    
    // Capture screenshot on failure
    screenshot: 'only-on-failure',
    
    // Record video on failure
    video: 'retain-on-failure',
    
    // Global timeout for each action (e.g., click, fill)
    actionTimeout: 10000,
    
    // Global timeout for navigation actions
    navigationTimeout: 30000,
  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Use Chrome channel for better compatibility
        channel: 'chrome',
      },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    {
      name: 'Microsoft Edge',
      use: { 
        ...devices['Desktop Edge'], 
        channel: 'msedge' 
      },
    },

    // Mobile testing
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },

    // Tablet testing
    {
      name: 'iPad',
      use: { ...devices['iPad Pro'] },
    },
  ],

  // Global setup and teardown
  globalSetup: './tests/e2e/global-setup.ts',
  globalTeardown: './tests/e2e/global-teardown.ts',

  // Run your local dev server before starting the tests
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000, // 2 minutes
    stdout: 'ignore',
    stderr: 'pipe',
  },

  // Test timeout
  timeout: 30 * 1000, // 30 seconds per test

  // Expect timeout
  expect: {
    timeout: 10 * 1000, // 10 seconds for assertions
  },

  // Output directory for test artifacts
  outputDir: 'test-results/',

  // Whether to preserve test output directory
  preserveOutput: 'failures-only',

  // Maximum number of test failures for the whole test suite run
  maxFailures: process.env.CI ? 10 : undefined,

  // Metadata
  metadata: {
    'test-type': 'e2e',
    'framework': 'playwright',
    'project': 'laser-cutting-calculator-platform',
    'target-calculators': 27,
  },
});
