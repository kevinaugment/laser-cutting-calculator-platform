import { Page, Locator, expect } from '@playwright/test';

/**
 * Base Page Object Model for all pages in the application
 * 
 * This class provides common functionality that all page objects can inherit.
 * It includes navigation, waiting, and common assertions.
 */
export class BasePage {
  readonly page: Page;
  readonly url: string;

  constructor(page: Page, url: string = '') {
    this.page = page;
    this.url = url;
  }

  /**
   * Navigate to this page
   */
  async goto(options?: { waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' }) {
    await this.page.goto(this.url, { 
      waitUntil: options?.waitUntil || 'networkidle',
      timeout: 30000 
    });
  }

  /**
   * Wait for the page to be loaded
   */
  async waitForLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get the page title
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Check if an element is visible
   */
  async isVisible(selector: string): Promise<boolean> {
    try {
      await this.page.waitForSelector(selector, { state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Wait for an element to be visible
   */
  async waitForElement(selector: string, timeout: number = 10000): Promise<Locator> {
    await this.page.waitForSelector(selector, { state: 'visible', timeout });
    return this.page.locator(selector);
  }

  /**
   * Click an element with retry logic
   */
  async clickElement(selector: string, options?: { timeout?: number; force?: boolean }) {
    const element = this.page.locator(selector);
    await element.click({
      timeout: options?.timeout || 10000,
      force: options?.force || false
    });
  }

  /**
   * Fill an input field
   */
  async fillInput(selector: string, value: string, options?: { clear?: boolean }) {
    const input = this.page.locator(selector);
    
    if (options?.clear !== false) {
      await input.clear();
    }
    
    await input.fill(value);
  }

  /**
   * Select an option from a dropdown
   */
  async selectOption(selector: string, value: string) {
    await this.page.locator(selector).selectOption(value);
  }

  /**
   * Get text content of an element
   */
  async getTextContent(selector: string): Promise<string> {
    const element = await this.waitForElement(selector);
    return await element.textContent() || '';
  }

  /**
   * Take a screenshot of the current page
   */
  async takeScreenshot(name: string) {
    await this.page.screenshot({ 
      path: `test-results/screenshots/${name}.png`,
      fullPage: true 
    });
  }

  /**
   * Wait for a specific URL pattern
   */
  async waitForURL(pattern: string | RegExp, timeout: number = 10000) {
    await this.page.waitForURL(pattern, { timeout });
  }

  /**
   * Scroll to an element
   */
  async scrollToElement(selector: string) {
    await this.page.locator(selector).scrollIntoViewIfNeeded();
  }

  /**
   * Check if the page has loaded without errors
   */
  async verifyPageLoaded() {
    // Check for common error indicators
    const errorSelectors = [
      '[data-testid="error-message"]',
      '.error',
      '[role="alert"]'
    ];

    for (const selector of errorSelectors) {
      const hasError = await this.isVisible(selector);
      if (hasError) {
        const errorText = await this.getTextContent(selector);
        throw new Error(`Page loaded with error: ${errorText}`);
      }
    }

    // Verify page is interactive
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Wait for API calls to complete
   */
  async waitForAPIResponse(urlPattern: string | RegExp, timeout: number = 10000) {
    return await this.page.waitForResponse(
      response => {
        const url = response.url();
        if (typeof urlPattern === 'string') {
          return url.includes(urlPattern);
        }
        return urlPattern.test(url);
      },
      { timeout }
    );
  }

  /**
   * Common assertions for all pages
   */
  async assertPageTitle(expectedTitle: string | RegExp) {
    await expect(this.page).toHaveTitle(expectedTitle);
  }

  async assertURL(expectedURL: string | RegExp) {
    await expect(this.page).toHaveURL(expectedURL);
  }

  async assertElementVisible(selector: string) {
    await expect(this.page.locator(selector)).toBeVisible();
  }

  async assertElementHidden(selector: string) {
    await expect(this.page.locator(selector)).toBeHidden();
  }

  async assertElementText(selector: string, expectedText: string | RegExp) {
    await expect(this.page.locator(selector)).toHaveText(expectedText);
  }

  async assertElementValue(selector: string, expectedValue: string) {
    await expect(this.page.locator(selector)).toHaveValue(expectedValue);
  }
}
