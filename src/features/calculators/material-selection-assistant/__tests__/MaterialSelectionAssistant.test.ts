// Test suite for Material Selection Assistant Calculator
// Comprehensive testing of AI-enhanced material selection logic

import { describe, test, expect, beforeEach } from 'vitest';
import { MaterialSelectionAssistant, MaterialSelectionInputs } from '../MaterialSelectionAssistant';

describe('MaterialSelectionAssistant', () => {
  let calculator: MaterialSelectionAssistant;

  beforeEach(() => {
    calculator = new MaterialSelectionAssistant();
  });

  describe('Configuration', () => {
    test('should have correct calculator configuration', () => {
      expect(calculator.config.id).toBe('material-selection-assistant');
      expect(calculator.config.title).toBe('Material Selection Assistant');
      expect(calculator.config.category).toBe('Core Engineering');
      expect(calculator.config.badge).toBe('AI Enhanced');
      expect(calculator.config.inputs).toHaveLength(4);
    });

    test('should have all required input fields', () => {
      const inputIds = calculator.config.inputs.map(input => input.id);
      expect(inputIds).toContain('application');
      expect(inputIds).toContain('strengthRequirement');
      expect(inputIds).toContain('corrosionResistance');
      expect(inputIds).toContain('budget');
    });
  });

  describe('Input Validation', () => {
    test('should validate correct inputs', () => {
      const validInputs: MaterialSelectionInputs = {
        application: 'structural',
        strengthRequirement: 'medium',
        corrosionResistance: 'mild',
        budget: 10.0
      };

      const validation = calculator.validateInputs(validInputs);
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    test('should reject invalid application type', () => {
      const invalidInputs = {
        application: 'invalid_app',
        strengthRequirement: 'medium',
        corrosionResistance: 'mild',
        budget: 10.0
      };

      const validation = calculator.validateInputs(invalidInputs);
      expect(validation.isValid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
    });

    test('should reject budget out of range', () => {
      const invalidInputs: MaterialSelectionInputs = {
        application: 'structural',
        strengthRequirement: 'medium',
        corrosionResistance: 'mild',
        budget: 0.05 // Below min of 0.1
      };

      const validation = calculator.validateInputs(invalidInputs);
      expect(validation.isValid).toBe(false);
      expect(validation.errors.some(e => e.field === 'budget')).toBe(true);
    });

    test('should generate warnings for low budget', () => {
      const lowBudgetInputs: MaterialSelectionInputs = {
        application: 'aerospace',
        strengthRequirement: 'high',
        corrosionResistance: 'high',
        budget: 2.0 // Very low for aerospace
      };

      const validation = calculator.validateInputs(lowBudgetInputs);
      expect(validation.warnings.length).toBeGreaterThan(0);
      expect(validation.warnings.some(w => w.code === 'LOW_BUDGET')).toBe(true);
    });

    test('should warn about demanding requirements', () => {
      const demandingInputs: MaterialSelectionInputs = {
        application: 'aerospace',
        strengthRequirement: 'ultra_high',
        corrosionResistance: 'extreme',
        budget: 50.0
      };

      const validation = calculator.validateInputs(demandingInputs);
      expect(validation.warnings.some(w => w.code === 'DEMANDING_REQUIREMENTS')).toBe(true);
    });
  });

  describe('Material Selection Logic', () => {
    test('should recommend materials for structural application', async () => {
      const inputs: MaterialSelectionInputs = {
        application: 'structural',
        strengthRequirement: 'medium',
        corrosionResistance: 'mild',
        budget: 10.0
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.recommendedMaterials).toBeDefined();
        expect(result.data.recommendedMaterials.length).toBeGreaterThan(0);
        expect(result.data.recommendedMaterials.length).toBeLessThanOrEqual(3);
        
        // Should recommend cost-effective materials for structural use
        const topChoice = result.data.recommendedMaterials[0];
        expect(topChoice.costPerKg).toBeLessThanOrEqual(inputs.budget);
        expect(topChoice.score).toBeGreaterThan(0);
        expect(topChoice.suitabilityRating).toBeGreaterThan(0);
      }
    });

    test('should recommend materials for aerospace application', async () => {
      const inputs: MaterialSelectionInputs = {
        application: 'aerospace',
        strengthRequirement: 'high',
        corrosionResistance: 'high',
        budget: 50.0
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        const topChoice = result.data.recommendedMaterials[0];
        // Should recommend high-performance materials like aluminum or titanium
        expect(topChoice.material).toMatch(/(Aluminum|Titanium)/);
        expect(topChoice.suitabilityRating).toBeGreaterThan(6); // High suitability
      }
    });

    test('should recommend materials for food grade application', async () => {
      const inputs: MaterialSelectionInputs = {
        application: 'food_grade',
        strengthRequirement: 'medium',
        corrosionResistance: 'high',
        budget: 15.0
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        const topChoice = result.data.recommendedMaterials[0];
        // Should recommend stainless steel for food grade
        expect(topChoice.material).toMatch(/Stainless Steel/);
        expect(topChoice.pros).toContain('Food safe');
      }
    });

    test('should handle low budget constraints', async () => {
      const inputs: MaterialSelectionInputs = {
        application: 'structural',
        strengthRequirement: 'low',
        corrosionResistance: 'none',
        budget: 3.0 // Low budget
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        // Should recommend carbon steel or similar low-cost options
        const topChoice = result.data.recommendedMaterials[0];
        expect(topChoice.costPerKg).toBeLessThanOrEqual(inputs.budget);
        expect(topChoice.material).toMatch(/Carbon Steel/);
      }
    });

    test('should handle high-end requirements', async () => {
      const inputs: MaterialSelectionInputs = {
        application: 'medical',
        strengthRequirement: 'high',
        corrosionResistance: 'extreme',
        budget: 100.0 // High budget
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        const topChoice = result.data.recommendedMaterials[0];
        // Should recommend titanium or high-grade stainless steel
        expect(topChoice.material).toMatch(/(Titanium|Stainless Steel 316)/);
        expect(topChoice.pros).toContain('Biocompatible');
      }
    });

    test('should provide cost analysis', async () => {
      const inputs: MaterialSelectionInputs = {
        application: 'automotive',
        strengthRequirement: 'medium',
        corrosionResistance: 'moderate',
        budget: 8.0
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.costAnalysis).toBeDefined();
        expect(result.data.costAnalysis.budgetFit).toMatch(/excellent|good|marginal|over_budget/);
        expect(result.data.costAnalysis.costRange.min).toBeGreaterThan(0);
        expect(result.data.costAnalysis.costRange.max).toBeGreaterThanOrEqual(result.data.costAnalysis.costRange.min);
        expect(result.data.costAnalysis.valueRating).toBeGreaterThanOrEqual(0);
        expect(result.data.costAnalysis.valueRating).toBeLessThanOrEqual(10);
      }
    });

    test('should provide cutting parameters', async () => {
      const inputs: MaterialSelectionInputs = {
        application: 'decorative',
        strengthRequirement: 'low',
        corrosionResistance: 'moderate',
        budget: 12.0
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.cuttingParameters).toBeDefined();
        expect(result.data.cuttingParameters.recommendedLaser).toMatch(/fiber|co2|nd_yag/);
        expect(result.data.cuttingParameters.estimatedDifficulty).toMatch(/straightforward|moderate|challenging/);
        expect(Array.isArray(result.data.cuttingParameters.specialConsiderations)).toBe(true);
      }
    });

    test('should handle no suitable materials scenario', async () => {
      const inputs: MaterialSelectionInputs = {
        application: 'aerospace',
        strengthRequirement: 'ultra_high',
        corrosionResistance: 'extreme',
        budget: 1.0 // Impossibly low budget
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.recommendedMaterials).toHaveLength(0);
        expect(result.data.costAnalysis.budgetFit).toBe('over_budget');
        expect(result.data.warnings).toContain('No materials found within budget constraints');
      }
    });
  });

  describe('Material Scoring Algorithm', () => {
    test('should score materials consistently', async () => {
      const inputs: MaterialSelectionInputs = {
        application: 'structural',
        strengthRequirement: 'medium',
        corrosionResistance: 'mild',
        budget: 15.0
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data && result.data.recommendedMaterials.length > 1) {
        const materials = result.data.recommendedMaterials;
        
        // Materials should be sorted by score (highest first)
        for (let i = 0; i < materials.length - 1; i++) {
          expect(materials[i].score).toBeGreaterThanOrEqual(materials[i + 1].score);
        }
        
        // All scores should be positive
        materials.forEach(material => {
          expect(material.score).toBeGreaterThan(0);
          expect(material.suitabilityRating).toBeGreaterThan(0);
          expect(material.suitabilityRating).toBeLessThanOrEqual(10);
        });
      }
    });

    test('should prefer application-suitable materials', async () => {
      const marineInputs: MaterialSelectionInputs = {
        application: 'marine',
        strengthRequirement: 'medium',
        corrosionResistance: 'high',
        budget: 20.0
      };

      const result = await calculator.calculate(marineInputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        const topChoice = result.data.recommendedMaterials[0];
        // Should prefer marine-suitable materials like stainless steel
        expect(topChoice.material).toMatch(/Stainless Steel|Titanium/);
      }
    });
  });

  describe('Default and Example Inputs', () => {
    test('should provide valid default inputs', () => {
      const defaults = calculator.getDefaultInputs();
      
      expect(defaults.application).toBeDefined();
      expect(defaults.strengthRequirement).toBeDefined();
      expect(defaults.corrosionResistance).toBeDefined();
      expect(defaults.budget).toBeGreaterThan(0);
      
      const validation = calculator.validateInputs(defaults);
      expect(validation.isValid).toBe(true);
    });

    test('should provide valid example inputs', () => {
      const examples = calculator.getExampleInputs();
      
      expect(examples.application).toBe('structural');
      expect(examples.strengthRequirement).toBe('medium');
      expect(examples.corrosionResistance).toBe('mild');
      expect(examples.budget).toBe(10.0);
      
      const validation = calculator.validateInputs(examples);
      expect(validation.isValid).toBe(true);
    });
  });

  describe('Performance', () => {
    test('should complete calculations within reasonable time', async () => {
      const inputs: MaterialSelectionInputs = {
        application: 'automotive',
        strengthRequirement: 'medium',
        corrosionResistance: 'moderate',
        budget: 8.0
      };

      const startTime = performance.now();
      const result = await calculator.calculate(inputs);
      const endTime = performance.now();
      
      expect(result.success).toBe(true);
      expect(endTime - startTime).toBeLessThan(100); // Should complete in <100ms
    });
  });

  describe('Edge Cases', () => {
    test('should handle maximum budget', async () => {
      const inputs: MaterialSelectionInputs = {
        application: 'aerospace',
        strengthRequirement: 'ultra_high',
        corrosionResistance: 'extreme',
        budget: 1000.0 // Maximum budget
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.recommendedMaterials.length).toBeGreaterThan(0);
        expect(result.data.costAnalysis.budgetFit).toMatch(/excellent|good/);
      }
    });

    test('should handle minimum budget', async () => {
      const inputs: MaterialSelectionInputs = {
        application: 'structural',
        strengthRequirement: 'low',
        corrosionResistance: 'none',
        budget: 0.1 // Minimum budget
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      // May or may not find materials, but should not crash
    });
  });
});
