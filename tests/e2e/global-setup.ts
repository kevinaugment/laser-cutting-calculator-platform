import { chromium, FullConfig } from '@playwright/test';

/**
 * Global setup for Playwright E2E tests
 * 
 * This runs once before all tests and prepares the testing environment.
 * It ensures the application is ready and performs any necessary setup.
 */
async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting Playwright E2E Test Setup...');
  
  // Get the base URL from config
  const baseURL = config.projects[0].use.baseURL || 'http://localhost:5173';
  
  // Launch a browser to verify the application is running
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    console.log(`📡 Checking if application is running at ${baseURL}...`);
    
    // Wait for the application to be ready
    await page.goto(baseURL, { waitUntil: 'domcontentloaded' });

    // Verify the main page loads correctly - wait for any content
    await page.waitForSelector('body', { timeout: 15000 });

    // Wait a bit more for React to render
    await page.waitForTimeout(2000);
    
    console.log('✅ Application is ready for testing');
    
    // Optional: Perform any global authentication or setup here
    // For example, if you need to login or set up test data
    
    // Store any global state if needed
    // await page.context().storageState({ path: 'tests/e2e/fixtures/auth.json' });
    
  } catch (error) {
    console.error('❌ Failed to setup test environment:', error);
    throw error;
  } finally {
    await browser.close();
  }
  
  console.log('🎯 Playwright E2E Test Setup Complete');
}

export default globalSetup;
