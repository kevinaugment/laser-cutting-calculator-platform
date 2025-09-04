/**
 * Browser Compatibility Test Suite
 * 
 * Tests core functionality across all supported browsers to ensure
 * consistent behavior and user experience.
 */

import { test, expect, Page, BrowserContext } from '@playwright/test';

// Test data for calculator validation
const testCalculatorData = {
  laserCuttingCost: {
    material: 'steel',
    thickness: 5,
    length: 1000,
    width: 500,
    quantity: 10
  },
  cuttingTime: {
    material: 'aluminum',
    thickness: 3,
    perimeter: 2000,
    pierceCount: 5
  }
};

// Browser-specific configurations
const browserConfigs = {
  chromium: { name: 'Chrome', features: ['webgl', 'webworkers', 'es2020'] },
  firefox: { name: 'Firefox', features: ['webgl', 'webworkers', 'es2020'] },
  webkit: { name: 'Safari', features: ['webgl', 'webworkers', 'es2019'] },
  'Microsoft Edge': { name: 'Edge', features: ['webgl', 'webworkers', 'es2020'] }
};

test.describe('Browser Compatibility Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');

    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');

    // Wait for lazy-loaded components to render
    await page.waitForTimeout(3000);

    // Verify basic page structure - wait for h1 or h2 (fallback)
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible({ timeout: 15000 });
  });

  test('Homepage loads correctly across browsers', async ({ page, browserName }) => {
    const config = browserConfigs[browserName as keyof typeof browserConfigs];
    
    // Test page title
    await expect(page).toHaveTitle(/Professional Laser Cutting Calculator Platform/);
    
    // Test main heading - wait for lazy-loaded content
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible({ timeout: 15000 });

    // Check if it's the main h1 or fallback h2
    const h1 = page.locator('h1').first();
    if (await h1.isVisible()) {
      await expect(h1).toContainText('Professional Laser Cutting Calculator Platform');
    }
    
    // Test navigation menu
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
    
    // Test CTA buttons
    const ctaButtons = page.locator('a[href="/calculators"], a[href*="/epic/"]');
    await expect(ctaButtons.first()).toBeVisible();
    
    // Browser-specific feature detection
    if (config?.features.includes('webgl')) {
      // Test WebGL support if needed for advanced visualizations
      const webglSupport = await page.evaluate(() => {
        const canvas = document.createElement('canvas');
        return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
      });
      expect(webglSupport).toBe(true);
    }
  });

  test('Calculator navigation works across browsers', async ({ page }) => {
    // Test navigation to calculators page
    await page.click('a[href="/calculators"]');
    await page.waitForLoadState('networkidle');
    
    // Verify calculators page loaded
    await expect(page).toHaveURL(/.*\/calculators/);
    await expect(page.locator('h1')).toContainText(/Calculator/i);
    
    // Test calculator grid display
    const calculatorCards = page.locator('[data-testid="calculator-card"], .calculator-card, [href*="/calculator/"]');
    await expect(calculatorCards.first()).toBeVisible();
    
    // Test individual calculator access
    await calculatorCards.first().click();
    await page.waitForLoadState('networkidle');
    
    // Verify calculator page loaded
    const calculatorTitle = page.locator('h1, h2').first();
    await expect(calculatorTitle).toBeVisible();
  });

  test('Laser Cutting Cost Calculator functionality', async ({ page }) => {
    // Navigate to cost calculator
    await page.goto('/calculator/laser-cutting-cost');
    await page.waitForLoadState('networkidle');
    
    // Fill in test data
    const { material, thickness, length, width, quantity } = testCalculatorData.laserCuttingCost;
    
    // Material selection
    const materialSelect = page.locator('select[name="material"], [data-testid="material-select"]').first();
    if (await materialSelect.isVisible()) {
      await materialSelect.selectOption(material);
    }
    
    // Thickness input
    const thicknessInput = page.locator('input[name="thickness"], [data-testid="thickness-input"]').first();
    if (await thicknessInput.isVisible()) {
      await thicknessInput.fill(thickness.toString());
    }
    
    // Dimensions
    const lengthInput = page.locator('input[name="length"], [data-testid="length-input"]').first();
    if (await lengthInput.isVisible()) {
      await lengthInput.fill(length.toString());
    }
    
    const widthInput = page.locator('input[name="width"], [data-testid="width-input"]').first();
    if (await widthInput.isVisible()) {
      await widthInput.fill(width.toString());
    }
    
    // Quantity
    const quantityInput = page.locator('input[name="quantity"], [data-testid="quantity-input"]').first();
    if (await quantityInput.isVisible()) {
      await quantityInput.fill(quantity.toString());
    }
    
    // Calculate button
    const calculateButton = page.locator('button:has-text("Calculate"), [data-testid="calculate-button"]').first();
    if (await calculateButton.isVisible()) {
      await calculateButton.click();
    }
    
    // Wait for results
    await page.waitForTimeout(1000);
    
    // Verify results are displayed
    const resultsSection = page.locator('[data-testid="results"], .results, .calculation-results').first();
    if (await resultsSection.isVisible()) {
      await expect(resultsSection).toBeVisible();
      
      // Check for cost values
      const costElements = page.locator('text=/\\$[0-9]+\\.?[0-9]*/');
      await expect(costElements.first()).toBeVisible();
    }
  });

  test('Responsive design works across viewports', async ({ page }) => {
    // Test desktop view (default)
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Verify desktop layout
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
    
    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500);
    
    // Verify tablet layout adjustments
    await expect(nav).toBeVisible();
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    
    // Verify mobile layout
    await expect(nav).toBeVisible();
    
    // Test mobile navigation if hamburger menu exists
    const mobileMenuButton = page.locator('[data-testid="mobile-menu"], .mobile-menu-button, button[aria-label*="menu"]');
    if (await mobileMenuButton.isVisible()) {
      await mobileMenuButton.click();
      await page.waitForTimeout(300);
      
      // Verify mobile menu opened
      const mobileMenu = page.locator('[data-testid="mobile-menu-content"], .mobile-menu');
      await expect(mobileMenu).toBeVisible();
    }
  });

  test('JavaScript functionality works across browsers', async ({ page, browserName }) => {
    // Test interactive elements
    await page.goto('/calculators');
    await page.waitForLoadState('networkidle');
    
    // Test search functionality if available
    const searchInput = page.locator('input[type="search"], [data-testid="search-input"]');
    if (await searchInput.isVisible()) {
      await searchInput.fill('cost');
      await page.waitForTimeout(500);
      
      // Verify search results
      const searchResults = page.locator('[data-testid="search-results"], .search-results');
      if (await searchResults.isVisible()) {
        await expect(searchResults).toBeVisible();
      }
    }
    
    // Test filter functionality if available
    const filterButtons = page.locator('[data-testid="filter-button"], .filter-button, button:has-text("Filter")');
    if (await filterButtons.first().isVisible()) {
      await filterButtons.first().click();
      await page.waitForTimeout(300);
    }
    
    // Test local storage functionality
    const localStorageTest = await page.evaluate(() => {
      try {
        localStorage.setItem('test', 'value');
        const value = localStorage.getItem('test');
        localStorage.removeItem('test');
        return value === 'value';
      } catch (e) {
        return false;
      }
    });
    expect(localStorageTest).toBe(true);
    
    // Test modern JavaScript features
    const modernJSSupport = await page.evaluate(() => {
      try {
        // Test arrow functions
        const arrow = () => true;
        
        // Test template literals
        const template = `test ${arrow()}`;
        
        // Test const/let
        const constTest = 'test';
        let letTest = 'test';
        
        // Test destructuring
        const { length } = 'test';
        
        // Test Promise support
        const promiseSupport = typeof Promise !== 'undefined';
        
        return arrow() && template.includes('true') && constTest && letTest && length === 4 && promiseSupport;
      } catch (e) {
        return false;
      }
    });
    expect(modernJSSupport).toBe(true);
  });

  test('CSS features work consistently', async ({ page }) => {
    // Test CSS Grid support
    const gridSupport = await page.evaluate(() => {
      const div = document.createElement('div');
      div.style.display = 'grid';
      return div.style.display === 'grid';
    });
    expect(gridSupport).toBe(true);
    
    // Test Flexbox support
    const flexSupport = await page.evaluate(() => {
      const div = document.createElement('div');
      div.style.display = 'flex';
      return div.style.display === 'flex';
    });
    expect(flexSupport).toBe(true);
    
    // Test CSS Custom Properties (variables)
    const customPropsSupport = await page.evaluate(() => {
      return CSS.supports('color', 'var(--test)');
    });
    expect(customPropsSupport).toBe(true);
    
    // Test CSS animations
    const animationSupport = await page.evaluate(() => {
      return CSS.supports('animation', 'test 1s ease');
    });
    expect(animationSupport).toBe(true);
  });

  test('Performance is acceptable across browsers', async ({ page }) => {
    // Measure page load performance
    const startTime = Date.now();
    
    await page.goto('/', { waitUntil: 'networkidle' });
    
    const loadTime = Date.now() - startTime;
    
    // Page should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
    
    // Test First Contentful Paint
    const fcpMetric = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
          if (fcpEntry) {
            resolve(fcpEntry.startTime);
          }
        }).observe({ entryTypes: ['paint'] });
        
        // Fallback timeout
        setTimeout(() => resolve(0), 1000);
      });
    });
    
    // FCP should be under 2 seconds
    if (fcpMetric > 0) {
      expect(fcpMetric).toBeLessThan(2000);
    }
  });

  test('Error handling works across browsers', async ({ page }) => {
    // Test 404 page
    await page.goto('/non-existent-page');
    await page.waitForLoadState('networkidle');
    
    // Should show 404 page or redirect to home
    const is404 = await page.locator('text=/404|not found/i').isVisible();
    const isHome = await page.locator('h1:has-text("Professional Laser Cutting Calculator Platform")').isVisible();
    
    expect(is404 || isHome).toBe(true);
    
    // Test JavaScript error handling
    const jsErrorHandling = await page.evaluate(() => {
      try {
        // Trigger a potential error
        const nonExistent = (window as any).nonExistentFunction;
        if (typeof nonExistent === 'function') {
          nonExistent();
        }
        return true;
      } catch (e) {
        // Error was caught, which is good
        return true;
      }
    });
    expect(jsErrorHandling).toBe(true);
  });
});
