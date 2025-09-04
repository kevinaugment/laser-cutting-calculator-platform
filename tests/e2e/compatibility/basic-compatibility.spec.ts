/**
 * Basic Browser Compatibility Test Suite
 * 
 * Simple tests to verify core functionality across browsers
 */

import { test, expect } from '@playwright/test';

test.describe('Basic Browser Compatibility', () => {
  
  test('Page loads and renders content', async ({ page, browserName }) => {
    console.log(`Testing on ${browserName}`);
    
    // Navigate to homepage
    await page.goto('/');
    
    // Wait for page to load
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(5000); // Wait for lazy loading
    
    // Check if page has content
    const body = page.locator('body');
    await expect(body).toBeVisible();
    
    // Check for any heading (h1, h2, h3)
    const headings = page.locator('h1, h2, h3');
    const headingCount = await headings.count();
    expect(headingCount).toBeGreaterThan(0);
    
    // Check for navigation
    const nav = page.locator('nav, [role="navigation"]');
    const navExists = await nav.count() > 0;
    console.log(`Navigation found: ${navExists}`);
    
    // Check for buttons or links
    const interactiveElements = page.locator('button, a[href]');
    const interactiveCount = await interactiveElements.count();
    expect(interactiveCount).toBeGreaterThan(0);
    
    console.log(`✅ ${browserName}: Page loaded with ${headingCount} headings and ${interactiveCount} interactive elements`);
  });

  test('Basic navigation works', async ({ page, browserName }) => {
    console.log(`Testing navigation on ${browserName}`);
    
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    
    // Try to find and click a calculators link
    const calculatorsLink = page.locator('a[href*="/calculators"], a:has-text("Calculator")').first();
    
    if (await calculatorsLink.isVisible()) {
      await calculatorsLink.click();
      await page.waitForLoadState('domcontentloaded');
      
      // Verify navigation occurred
      const currentUrl = page.url();
      expect(currentUrl).toMatch(/calculators|calculator/i);
      console.log(`✅ ${browserName}: Navigation successful to ${currentUrl}`);
    } else {
      console.log(`⚠️ ${browserName}: No calculators link found, skipping navigation test`);
    }
  });

  test('CSS and JavaScript work', async ({ page, browserName }) => {
    console.log(`Testing CSS/JS on ${browserName}`);
    
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    
    // Test CSS support
    const cssSupport = await page.evaluate(() => {
      const div = document.createElement('div');
      div.style.display = 'flex';
      return div.style.display === 'flex';
    });
    expect(cssSupport).toBe(true);
    
    // Test JavaScript execution
    const jsSupport = await page.evaluate(() => {
      try {
        const test = () => 'working';
        return test() === 'working';
      } catch (e) {
        return false;
      }
    });
    expect(jsSupport).toBe(true);
    
    // Test local storage
    const storageSupport = await page.evaluate(() => {
      try {
        localStorage.setItem('test', 'value');
        const value = localStorage.getItem('test');
        localStorage.removeItem('test');
        return value === 'value';
      } catch (e) {
        return false;
      }
    });
    expect(storageSupport).toBe(true);
    
    console.log(`✅ ${browserName}: CSS, JS, and Storage all working`);
  });

  test('Responsive design basics', async ({ page, browserName }) => {
    console.log(`Testing responsive design on ${browserName}`);
    
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Test desktop view
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(1000);
    
    let bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    let viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 50); // Allow some tolerance
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);
    
    bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 50); // Allow some tolerance
    
    console.log(`✅ ${browserName}: Responsive design working`);
  });

  test('Performance is acceptable', async ({ page, browserName }) => {
    console.log(`Testing performance on ${browserName}`);
    
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    const loadTime = Date.now() - startTime;
    
    // Page should load within 10 seconds (generous for testing)
    expect(loadTime).toBeLessThan(10000);
    
    console.log(`✅ ${browserName}: Page loaded in ${loadTime}ms`);
  });

  test('Error handling works', async ({ page, browserName }) => {
    console.log(`Testing error handling on ${browserName}`);
    
    // Test 404 page
    await page.goto('/non-existent-page-12345');
    await page.waitForLoadState('domcontentloaded');
    
    // Should either show 404 or redirect to home
    const is404 = await page.locator('text=/404|not found/i').isVisible();
    const isHome = await page.locator('text=/home|calculator|laser/i').isVisible();
    
    expect(is404 || isHome).toBe(true);
    
    console.log(`✅ ${browserName}: Error handling working`);
  });
});

// Test across all configured browsers
test.describe('Cross-Browser Feature Support', () => {
  
  test('Modern JavaScript features', async ({ page, browserName }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    const modernJSSupport = await page.evaluate(() => {
      try {
        // Test ES6+ features
        const arrow = () => true;
        const template = `test ${arrow()}`;
        const { length } = 'test';
        const promiseSupport = typeof Promise !== 'undefined';
        
        return arrow() && template.includes('true') && length === 4 && promiseSupport;
      } catch (e) {
        return false;
      }
    });
    
    expect(modernJSSupport).toBe(true);
    console.log(`✅ ${browserName}: Modern JavaScript features supported`);
  });

  test('CSS Grid and Flexbox support', async ({ page, browserName }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    const cssSupport = await page.evaluate(() => {
      const div = document.createElement('div');
      
      // Test Flexbox
      div.style.display = 'flex';
      const flexSupport = div.style.display === 'flex';
      
      // Test Grid
      div.style.display = 'grid';
      const gridSupport = div.style.display === 'grid';
      
      return { flexSupport, gridSupport };
    });
    
    expect(cssSupport.flexSupport).toBe(true);
    expect(cssSupport.gridSupport).toBe(true);
    
    console.log(`✅ ${browserName}: CSS Grid and Flexbox supported`);
  });

  test('Web APIs availability', async ({ page, browserName }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    const apiSupport = await page.evaluate(() => {
      return {
        localStorage: typeof localStorage !== 'undefined',
        sessionStorage: typeof sessionStorage !== 'undefined',
        fetch: typeof fetch !== 'undefined',
        Promise: typeof Promise !== 'undefined',
        URL: typeof URL !== 'undefined'
      };
    });
    
    expect(apiSupport.localStorage).toBe(true);
    expect(apiSupport.sessionStorage).toBe(true);
    expect(apiSupport.fetch).toBe(true);
    expect(apiSupport.Promise).toBe(true);
    expect(apiSupport.URL).toBe(true);
    
    console.log(`✅ ${browserName}: All required Web APIs available`);
  });
});
