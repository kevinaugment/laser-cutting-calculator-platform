import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Base Page Object Model for all calculator pages
 * 
 * This class provides common functionality for all 27 calculator pages.
 * It extends BasePage and adds calculator-specific methods.
 */
export class CalculatorBasePage extends BasePage {
  // Common calculator selectors
  readonly calculateButton: Locator;
  readonly resetButton: Locator;
  readonly resultsSection: Locator;
  readonly inputSection: Locator;
  readonly loadingIndicator: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page, calculatorPath: string) {
    super(page, `/calculator/${calculatorPath}`);
    
    // Initialize common locators
    this.calculateButton = page.locator('[data-testid="calculate-button"]');
    this.resetButton = page.locator('[data-testid="reset-button"]');
    this.resultsSection = page.locator('[data-testid="results"]');
    this.inputSection = page.locator('[data-testid="calculator-inputs"]');
    this.loadingIndicator = page.locator('[data-testid="loading"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
  }

  /**
   * Navigate to the calculator page and verify it loads correctly
   */
  async navigateAndVerify() {
    await this.goto();
    await this.verifyCalculatorPageLoaded();
  }

  /**
   * Verify that the calculator page has loaded correctly
   */
  async verifyCalculatorPageLoaded() {
    await this.verifyPageLoaded();
    
    // Verify calculator-specific elements
    await this.assertElementVisible('[data-testid="calculator-inputs"]');
    await this.assertElementVisible('[data-testid="calculate-button"]');
    
    // Verify page title contains calculator name
    const title = await this.getTitle();
    expect(title).toContain('Calculator');
  }

  /**
   * Fill a calculator input field by its data-testid
   */
  async fillCalculatorInput(fieldId: string, value: string | number) {
    const selector = `[data-testid="${fieldId}"]`;
    await this.fillInput(selector, String(value));
  }

  /**
   * Select an option in a calculator dropdown
   */
  async selectCalculatorOption(fieldId: string, value: string) {
    const selector = `[data-testid="${fieldId}"]`;
    await this.selectOption(selector, value);
  }

  /**
   * Click the calculate button and wait for results
   */
  async calculate() {
    await this.calculateButton.click();
    
    // Wait for either results or error
    await Promise.race([
      this.resultsSection.waitFor({ state: 'visible', timeout: 10000 }),
      this.errorMessage.waitFor({ state: 'visible', timeout: 10000 })
    ]);
  }

  /**
   * Reset the calculator form
   */
  async reset() {
    if (await this.resetButton.isVisible()) {
      await this.resetButton.click();
      
      // Wait for form to be reset
      await this.page.waitForTimeout(500);
    }
  }

  /**
   * Get calculation results
   */
  async getResults(): Promise<Record<string, string>> {
    await this.resultsSection.waitFor({ state: 'visible' });
    
    const results: Record<string, string> = {};
    
    // Get all result items
    const resultItems = this.resultsSection.locator('[data-testid^="result-"]');
    const count = await resultItems.count();
    
    for (let i = 0; i < count; i++) {
      const item = resultItems.nth(i);
      const testId = await item.getAttribute('data-testid');
      const text = await item.textContent();
      
      if (testId && text) {
        const key = testId.replace('result-', '');
        results[key] = text.trim();
      }
    }
    
    return results;
  }

  /**
   * Verify that results are displayed
   */
  async verifyResultsDisplayed() {
    await this.assertElementVisible('[data-testid="results"]');
    
    // Verify at least one result item exists
    const resultItems = this.resultsSection.locator('[data-testid^="result-"]');
    await expect(resultItems.first()).toBeVisible();
  }

  /**
   * Verify that an error message is displayed
   */
  async verifyErrorDisplayed(expectedError?: string | RegExp) {
    await this.assertElementVisible('[data-testid="error-message"]');
    
    if (expectedError) {
      await this.assertElementText('[data-testid="error-message"]', expectedError);
    }
  }

  /**
   * Fill multiple calculator inputs at once
   */
  async fillCalculatorInputs(inputs: Record<string, string | number>) {
    for (const [fieldId, value] of Object.entries(inputs)) {
      await this.fillCalculatorInput(fieldId, value);
    }
  }

  /**
   * Verify input validation
   */
  async verifyInputValidation(fieldId: string, invalidValue: string | number, expectedError?: string) {
    await this.fillCalculatorInput(fieldId, invalidValue);
    await this.calculate();
    
    if (expectedError) {
      await this.verifyErrorDisplayed(expectedError);
    } else {
      await this.verifyErrorDisplayed();
    }
  }

  /**
   * Test a complete calculation workflow
   */
  async performCalculation(inputs: Record<string, string | number>): Promise<Record<string, string>> {
    // Reset form first
    await this.reset();
    
    // Fill inputs
    await this.fillCalculatorInputs(inputs);
    
    // Calculate
    await this.calculate();
    
    // Verify and return results
    await this.verifyResultsDisplayed();
    return await this.getResults();
  }

  /**
   * Verify calculator responsiveness on different screen sizes
   */
  async verifyResponsiveDesign() {
    // Test mobile view
    await this.page.setViewportSize({ width: 375, height: 667 });
    await this.verifyCalculatorPageLoaded();
    
    // Test tablet view
    await this.page.setViewportSize({ width: 768, height: 1024 });
    await this.verifyCalculatorPageLoaded();
    
    // Test desktop view
    await this.page.setViewportSize({ width: 1920, height: 1080 });
    await this.verifyCalculatorPageLoaded();
  }

  /**
   * Verify calculator accessibility
   */
  async verifyAccessibility() {
    // Check for proper ARIA labels
    await expect(this.calculateButton).toHaveAttribute('aria-label');
    
    // Check for proper form labels
    const inputs = this.inputSection.locator('input, select');
    const inputCount = await inputs.count();
    
    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      const hasLabel = await input.evaluate(el => {
        const id = el.getAttribute('id');
        return id ? document.querySelector(`label[for="${id}"]`) !== null : false;
      });
      
      expect(hasLabel).toBeTruthy();
    }
  }
}
