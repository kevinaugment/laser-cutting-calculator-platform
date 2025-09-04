import { test, expect } from '@playwright/test';
import { CalculatorBasePage } from '../pages/CalculatorBasePage';

/**
 * E2E Tests for Laser Cutting Cost Calculator
 * 
 * This calculator is one of the core 5 calculators and has existing implementation.
 * These tests verify the complete user workflow from input to results.
 */

class LaserCuttingCostPage extends CalculatorBasePage {
  constructor(page: any) {
    super(page, 'laser-cutting-cost');
  }

  // Specific methods for this calculator can be added here
  async fillBasicInputs() {
    await this.fillCalculatorInputs({
      'material-type': 'steel',
      'material-thickness': '5',
      'cutting-length': '1000',
      'cutting-speed': '1000',
      'laser-power': '2000'
    });
  }
}

test.describe('Laser Cutting Cost Calculator', () => {
  let calculatorPage: LaserCuttingCostPage;

  test.beforeEach(async ({ page }) => {
    calculatorPage = new LaserCuttingCostPage(page);
    await calculatorPage.navigateAndVerify();
  });

  test('should load calculator page correctly', async () => {
    // Verify page title
    await calculatorPage.assertPageTitle(/Laser Cutting Cost Calculator/i);
    
    // Verify URL
    await calculatorPage.assertURL(/\/calculator\/laser-cutting-cost/);
    
    // Verify essential elements are visible
    await calculatorPage.assertElementVisible('[data-testid="calculator-inputs"]');
    await calculatorPage.assertElementVisible('[data-testid="calculate-button"]');
  });

  test('should perform basic cost calculation', async () => {
    // Fill in basic inputs
    await calculatorPage.fillBasicInputs();
    
    // Perform calculation
    const results = await calculatorPage.performCalculation({
      'material-type': 'steel',
      'material-thickness': '5',
      'cutting-length': '1000',
      'cutting-speed': '1000',
      'laser-power': '2000'
    });
    
    // Verify results are displayed
    expect(Object.keys(results).length).toBeGreaterThan(0);
    
    // Verify specific result fields (adjust based on actual implementation)
    expect(results).toHaveProperty('total-cost');
    expect(results['total-cost']).toMatch(/\$[\d,]+\.?\d*/);
  });

  test('should handle input validation', async () => {
    // Test invalid material thickness
    await calculatorPage.verifyInputValidation('material-thickness', '-1', /invalid/i);
    
    // Test invalid cutting length
    await calculatorPage.verifyInputValidation('cutting-length', '0', /invalid/i);
    
    // Test invalid laser power
    await calculatorPage.verifyInputValidation('laser-power', 'abc', /invalid/i);
  });

  test('should reset form correctly', async () => {
    // Fill inputs
    await calculatorPage.fillBasicInputs();
    
    // Reset form
    await calculatorPage.reset();
    
    // Verify inputs are cleared
    await calculatorPage.assertElementValue('[data-testid="material-thickness"]', '');
    await calculatorPage.assertElementValue('[data-testid="cutting-length"]', '');
  });

  test('should be responsive on different screen sizes', async () => {
    await calculatorPage.verifyResponsiveDesign();
  });

  test('should be accessible', async () => {
    await calculatorPage.verifyAccessibility();
  });

  test('should handle different material types', async ({ page }) => {
    const materials = ['steel', 'aluminum', 'stainless-steel'];
    
    for (const material of materials) {
      await calculatorPage.reset();
      
      const results = await calculatorPage.performCalculation({
        'material-type': material,
        'material-thickness': '3',
        'cutting-length': '500',
        'cutting-speed': '800',
        'laser-power': '1500'
      });
      
      // Verify calculation completed for each material
      expect(Object.keys(results).length).toBeGreaterThan(0);
      expect(results['total-cost']).toBeTruthy();
    }
  });

  test('should calculate costs for different thicknesses', async () => {
    const thicknesses = ['1', '5', '10', '20'];
    const costs: number[] = [];
    
    for (const thickness of thicknesses) {
      await calculatorPage.reset();
      
      const results = await calculatorPage.performCalculation({
        'material-type': 'steel',
        'material-thickness': thickness,
        'cutting-length': '1000',
        'cutting-speed': '1000',
        'laser-power': '2000'
      });
      
      // Extract numeric cost value
      const costText = results['total-cost'];
      const costValue = parseFloat(costText.replace(/[$,]/g, ''));
      costs.push(costValue);
    }
    
    // Verify that cost generally increases with thickness
    expect(costs[3]).toBeGreaterThan(costs[0]); // 20mm should cost more than 1mm
  });

  test('should handle edge cases', async () => {
    // Test minimum values
    await calculatorPage.performCalculation({
      'material-type': 'steel',
      'material-thickness': '0.1',
      'cutting-length': '1',
      'cutting-speed': '100',
      'laser-power': '500'
    });
    
    await calculatorPage.verifyResultsDisplayed();
    
    // Test maximum reasonable values
    await calculatorPage.performCalculation({
      'material-type': 'steel',
      'material-thickness': '50',
      'cutting-length': '10000',
      'cutting-speed': '5000',
      'laser-power': '10000'
    });
    
    await calculatorPage.verifyResultsDisplayed();
  });

  test('should maintain calculation accuracy', async () => {
    // Perform the same calculation multiple times
    const testInputs = {
      'material-type': 'steel',
      'material-thickness': '5',
      'cutting-length': '1000',
      'cutting-speed': '1000',
      'laser-power': '2000'
    };
    
    const results1 = await calculatorPage.performCalculation(testInputs);
    await calculatorPage.reset();
    const results2 = await calculatorPage.performCalculation(testInputs);
    
    // Results should be identical
    expect(results1['total-cost']).toBe(results2['total-cost']);
  });
});
