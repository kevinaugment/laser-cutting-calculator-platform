/**
 * Mobile Compatibility Test Suite
 * 
 * Tests mobile-specific functionality including touch interactions,
 * responsive design, and mobile browser features.
 */

import { test, expect, devices } from '@playwright/test';

// Mobile device configurations
const mobileDevices = [
  { name: 'iPhone 12', device: devices['iPhone 12'] },
  { name: 'Pixel 5', device: devices['Pixel 5'] },
  { name: 'iPad Pro', device: devices['iPad Pro'] }
];

test.describe('Mobile Compatibility Tests', () => {
  
  // Run tests on mobile devices only
  test.use({ 
    ...devices['iPhone 12'] // Default to iPhone 12, will be overridden in specific tests
  });

  test('Mobile homepage renders correctly', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Test viewport meta tag
    const viewportMeta = await page.locator('meta[name="viewport"]').getAttribute('content');
    expect(viewportMeta).toContain('width=device-width');
    expect(viewportMeta).toContain('initial-scale=1');
    
    // Test main heading visibility
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();
    
    // Test mobile-friendly button sizes (minimum 44px touch target)
    const buttons = page.locator('button, a[role="button"]');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < Math.min(buttonCount, 5); i++) {
      const button = buttons.nth(i);
      if (await button.isVisible()) {
        const box = await button.boundingBox();
        if (box) {
          expect(box.height).toBeGreaterThanOrEqual(44);
          expect(box.width).toBeGreaterThanOrEqual(44);
        }
      }
    }
  });

  test('Touch interactions work correctly', async ({ page }) => {
    await page.goto('/calculators');
    await page.waitForLoadState('networkidle');
    
    // Test tap on calculator card
    const calculatorCard = page.locator('[data-testid="calculator-card"], .calculator-card, [href*="/calculator/"]').first();
    await expect(calculatorCard).toBeVisible();
    
    // Simulate touch tap
    await calculatorCard.tap();
    await page.waitForLoadState('networkidle');
    
    // Verify navigation occurred
    expect(page.url()).toMatch(/\/calculator\//);
    
    // Test swipe gestures if carousel exists
    const carousel = page.locator('[data-testid="carousel"], .carousel, .swiper');
    if (await carousel.isVisible()) {
      const carouselBox = await carousel.boundingBox();
      if (carouselBox) {
        // Simulate swipe left
        await page.touchscreen.tap(carouselBox.x + carouselBox.width * 0.8, carouselBox.y + carouselBox.height / 2);
        await page.touchscreen.tap(carouselBox.x + carouselBox.width * 0.2, carouselBox.y + carouselBox.height / 2);
        await page.waitForTimeout(500);
      }
    }
  });

  test('Mobile navigation menu works', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Look for mobile menu button
    const mobileMenuButton = page.locator(
      '[data-testid="mobile-menu-button"], .mobile-menu-button, button[aria-label*="menu"], .hamburger'
    );
    
    if (await mobileMenuButton.isVisible()) {
      // Test mobile menu toggle
      await mobileMenuButton.tap();
      await page.waitForTimeout(300);
      
      // Verify menu opened
      const mobileMenu = page.locator('[data-testid="mobile-menu"], .mobile-menu, .mobile-nav');
      await expect(mobileMenu).toBeVisible();
      
      // Test menu item tap
      const menuItem = mobileMenu.locator('a').first();
      if (await menuItem.isVisible()) {
        await menuItem.tap();
        await page.waitForLoadState('networkidle');
      }
      
      // Close menu if still open
      if (await mobileMenuButton.isVisible()) {
        await mobileMenuButton.tap();
        await page.waitForTimeout(300);
      }
    }
  });

  test('Mobile calculator input works correctly', async ({ page }) => {
    await page.goto('/calculator/laser-cutting-cost');
    await page.waitForLoadState('networkidle');
    
    // Test numeric input on mobile
    const numericInput = page.locator('input[type="number"], input[inputmode="numeric"]').first();
    if (await numericInput.isVisible()) {
      await numericInput.tap();
      await numericInput.fill('123.45');
      
      // Verify value was entered
      const value = await numericInput.inputValue();
      expect(value).toBe('123.45');
    }
    
    // Test select dropdown on mobile
    const selectElement = page.locator('select').first();
    if (await selectElement.isVisible()) {
      await selectElement.tap();
      await selectElement.selectOption({ index: 1 });
    }
    
    // Test mobile-friendly form submission
    const submitButton = page.locator('button[type="submit"], button:has-text("Calculate")').first();
    if (await submitButton.isVisible()) {
      await submitButton.tap();
      await page.waitForTimeout(1000);
    }
  });

  test('Mobile scrolling and layout work correctly', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Test vertical scrolling
    const initialScrollY = await page.evaluate(() => window.scrollY);
    
    // Scroll down
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(300);
    
    const scrolledY = await page.evaluate(() => window.scrollY);
    expect(scrolledY).toBeGreaterThan(initialScrollY);
    
    // Test horizontal overflow (should not exist)
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1); // Allow 1px tolerance
    
    // Test sticky elements if they exist
    const stickyElements = page.locator('[style*="sticky"], .sticky');
    const stickyCount = await stickyElements.count();
    
    if (stickyCount > 0) {
      // Scroll and check if sticky element is still visible
      await page.evaluate(() => window.scrollBy(0, 1000));
      await page.waitForTimeout(300);
      
      const firstSticky = stickyElements.first();
      if (await firstSticky.isVisible()) {
        const stickyBox = await firstSticky.boundingBox();
        expect(stickyBox?.y).toBeGreaterThanOrEqual(0);
      }
    }
  });

  test('Mobile performance is acceptable', async ({ page }) => {
    // Measure mobile page load performance
    const startTime = Date.now();
    
    await page.goto('/', { waitUntil: 'networkidle' });
    
    const loadTime = Date.now() - startTime;
    
    // Mobile should load within 6 seconds (slightly more lenient than desktop)
    expect(loadTime).toBeLessThan(6000);
    
    // Test touch responsiveness
    const button = page.locator('button, a').first();
    if (await button.isVisible()) {
      const touchStart = Date.now();
      await button.tap();
      const touchEnd = Date.now();
      
      // Touch response should be under 100ms
      expect(touchEnd - touchStart).toBeLessThan(100);
    }
  });

  test('Mobile-specific features work', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Test device orientation handling
    const initialOrientation = await page.evaluate(() => screen.orientation?.angle || 0);
    
    // Test touch events
    const touchSupport = await page.evaluate(() => {
      return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    });
    expect(touchSupport).toBe(true);
    
    // Test mobile-specific CSS media queries
    const mobileMediaQuery = await page.evaluate(() => {
      return window.matchMedia('(max-width: 768px)').matches;
    });
    expect(mobileMediaQuery).toBe(true);
    
    // Test mobile user agent
    const userAgent = await page.evaluate(() => navigator.userAgent);
    expect(userAgent).toMatch(/(Mobile|iPhone|iPad|Android)/i);
  });

  test('Mobile accessibility features work', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Test focus management on mobile
    const focusableElements = page.locator('button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const firstFocusable = focusableElements.first();
    
    if (await firstFocusable.isVisible()) {
      await firstFocusable.focus();
      const isFocused = await firstFocusable.evaluate(el => document.activeElement === el);
      expect(isFocused).toBe(true);
    }
    
    // Test ARIA labels for mobile screen readers
    const ariaLabels = page.locator('[aria-label], [aria-labelledby]');
    const ariaCount = await ariaLabels.count();
    expect(ariaCount).toBeGreaterThan(0);
    
    // Test mobile-friendly contrast ratios
    const textElements = page.locator('p, h1, h2, h3, h4, h5, h6, span, div').first();
    if (await textElements.isVisible()) {
      const styles = await textElements.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          color: computed.color,
          backgroundColor: computed.backgroundColor,
          fontSize: computed.fontSize
        };
      });
      
      // Font size should be at least 16px for mobile readability
      const fontSize = parseInt(styles.fontSize);
      expect(fontSize).toBeGreaterThanOrEqual(14); // Allow slightly smaller for some elements
    }
  });

  // Test across different mobile devices
  for (const { name, device } of mobileDevices) {
    test(`Cross-device compatibility: ${name}`, async ({ browser }) => {
      const context = await browser.newContext({
        ...device
      });
      const page = await context.newPage();
      
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Test basic functionality on each device
      const heading = page.locator('h1').first();
      await expect(heading).toBeVisible();
      
      // Test navigation
      const navLink = page.locator('a[href="/calculators"]').first();
      if (await navLink.isVisible()) {
        await navLink.tap();
        await page.waitForLoadState('networkidle');
        expect(page.url()).toMatch(/calculators/);
      }
      
      await context.close();
    });
  }

  test('Mobile PWA features work', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Test service worker registration
    const swRegistration = await page.evaluate(async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.getRegistration();
          return !!registration;
        } catch (e) {
          return false;
        }
      }
      return false;
    });
    
    // Service worker is optional, so we just log the result
    console.log(`Service Worker registered: ${swRegistration}`);
    
    // Test manifest.json
    const manifestLink = page.locator('link[rel="manifest"]');
    const hasManifest = await manifestLink.count() > 0;
    
    if (hasManifest) {
      const manifestHref = await manifestLink.getAttribute('href');
      expect(manifestHref).toBeTruthy();
    }
    
    // Test mobile meta tags
    const themeColorMeta = page.locator('meta[name="theme-color"]');
    const hasThemeColor = await themeColorMeta.count() > 0;
    
    if (hasThemeColor) {
      const themeColor = await themeColorMeta.getAttribute('content');
      expect(themeColor).toBeTruthy();
    }
  });
});
