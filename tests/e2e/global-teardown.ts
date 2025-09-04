import { FullConfig } from '@playwright/test';

/**
 * Global teardown for Playwright E2E tests
 * 
 * This runs once after all tests complete and cleans up the testing environment.
 */
async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting Playwright E2E Test Teardown...');
  
  try {
    // Clean up any global resources
    // For example, clean up test data, close connections, etc.
    
    // Optional: Generate test summary report
    console.log('📊 Test execution completed');
    
    // Optional: Clean up temporary files
    // await fs.rm('temp-test-data', { recursive: true, force: true });
    
  } catch (error) {
    console.error('⚠️ Warning during teardown:', error);
    // Don't throw here as it might mask test failures
  }
  
  console.log('✅ Playwright E2E Test Teardown Complete');
}

export default globalTeardown;
