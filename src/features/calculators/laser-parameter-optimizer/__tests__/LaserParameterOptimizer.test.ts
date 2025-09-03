// Test suite for Laser Parameter Optimizer Calculator
// Comprehensive testing of calculation accuracy and validation

import { describe, test, expect, beforeEach } from 'vitest';
import { LaserParameterOptimizer, LaserParameterInputs } from '../LaserParameterOptimizer';

describe('LaserParameterOptimizer', () => {
  let calculator: LaserParameterOptimizer;

  beforeEach(() => {
    calculator = new LaserParameterOptimizer();
  });

  describe('Configuration', () => {
    test('should have correct calculator configuration', () => {
      expect(calculator.config.id).toBe('laser-parameter-optimizer');
      expect(calculator.config.title).toBe('Laser Parameter Optimizer');
      expect(calculator.config.category).toBe('Core Engineering');
      expect(calculator.config.badge).toBe('AI Enhanced');
      expect(calculator.config.inputs).toHaveLength(5);
    });

    test('should have all required input fields', () => {
      const inputIds = calculator.config.inputs.map(input => input.id);
      expect(inputIds).toContain('materialType');
      expect(inputIds).toContain('thickness');
      expect(inputIds).toContain('laserType');
      expect(inputIds).toContain('maxPower');
      expect(inputIds).toContain('qualityRequirement');
    });
  });

  describe('Input Validation', () => {
    test('should validate correct inputs', () => {
      const validInputs: LaserParameterInputs = {
        materialType: 'steel',
        thickness: 5,
        laserType: 'fiber',
        maxPower: 3000,
        qualityRequirement: 'standard'
      };

      const validation = calculator.validateInputs(validInputs);
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    test('should reject invalid material type', () => {
      const invalidInputs = {
        materialType: 'invalid_material',
        thickness: 5,
        laserType: 'fiber',
        maxPower: 3000,
        qualityRequirement: 'standard'
      };

      const validation = calculator.validateInputs(invalidInputs);
      expect(validation.isValid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
    });

    test('should reject thickness out of range', () => {
      const invalidInputs: LaserParameterInputs = {
        materialType: 'steel',
        thickness: 150, // Above max of 100
        laserType: 'fiber',
        maxPower: 3000,
        qualityRequirement: 'standard'
      };

      const validation = calculator.validateInputs(invalidInputs);
      expect(validation.isValid).toBe(false);
      expect(validation.errors.some(e => e.field === 'thickness')).toBe(true);
    });

    test('should reject power out of range', () => {
      const invalidInputs: LaserParameterInputs = {
        materialType: 'steel',
        thickness: 5,
        laserType: 'fiber',
        maxPower: 50, // Below min of 100
        qualityRequirement: 'standard'
      };

      const validation = calculator.validateInputs(invalidInputs);
      expect(validation.isValid).toBe(false);
      expect(validation.errors.some(e => e.field === 'maxPower')).toBe(true);
    });

    test('should generate warnings for suboptimal combinations', () => {
      const suboptimalInputs: LaserParameterInputs = {
        materialType: 'aluminum',
        thickness: 5,
        laserType: 'co2', // CO2 has low absorptivity for aluminum
        maxPower: 3000,
        qualityRequirement: 'standard'
      };

      const validation = calculator.validateInputs(suboptimalInputs);
      expect(validation.warnings.length).toBeGreaterThan(0);
      expect(validation.warnings.some(w => w.code === 'LOW_ABSORPTIVITY')).toBe(true);
    });
  });

  describe('Calculations', () => {
    test('should calculate parameters for steel with fiber laser', async () => {
      const inputs: LaserParameterInputs = {
        materialType: 'steel',
        thickness: 5,
        laserType: 'fiber',
        maxPower: 3000,
        qualityRequirement: 'standard'
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.optimalPower).toBeGreaterThan(0);
        expect(result.data.optimalPower).toBeLessThanOrEqual(inputs.maxPower);
        expect(result.data.cuttingSpeed).toBeGreaterThan(0);
        expect(result.data.gasPressure).toBeGreaterThan(0);
        expect(result.data.qualityPrediction).toBeGreaterThan(0);
        expect(result.data.qualityPrediction).toBeLessThanOrEqual(1);
        expect(result.data.efficiency).toBeGreaterThan(0);
        expect(result.data.efficiency).toBeLessThanOrEqual(100);
        expect(result.data.gasType).toBe('oxygen'); // Steel typically uses oxygen
      }
    });

    test('should calculate parameters for aluminum with fiber laser', async () => {
      const inputs: LaserParameterInputs = {
        materialType: 'aluminum',
        thickness: 3,
        laserType: 'fiber',
        maxPower: 2000,
        qualityRequirement: 'precision'
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.gasType).toBe('nitrogen'); // Aluminum typically uses nitrogen
        expect(result.data.cuttingSpeed).toBeGreaterThan(0);
        expect(result.data.focusPosition).toBeLessThan(0); // Below surface
      }
    });

    test('should adjust parameters based on quality requirement', async () => {
      const baseInputs: LaserParameterInputs = {
        materialType: 'steel',
        thickness: 5,
        laserType: 'fiber',
        maxPower: 3000,
        qualityRequirement: 'standard'
      };

      const standardResult = await calculator.calculate(baseInputs);
      
      const precisionInputs = { ...baseInputs, qualityRequirement: 'precision' as const };
      const precisionResult = await calculator.calculate(precisionInputs);

      expect(standardResult.success).toBe(true);
      expect(precisionResult.success).toBe(true);
      
      if (standardResult.data && precisionResult.data) {
        // Precision should have lower speed for better quality
        expect(precisionResult.data.cuttingSpeed).toBeLessThan(standardResult.data.cuttingSpeed);
        // Precision should have higher quality prediction
        expect(precisionResult.data.qualityPrediction).toBeGreaterThan(standardResult.data.qualityPrediction);
      }
    });

    test('should handle thick materials appropriately', async () => {
      const thickInputs: LaserParameterInputs = {
        materialType: 'steel',
        thickness: 25,
        laserType: 'fiber',
        maxPower: 6000,
        qualityRequirement: 'standard'
      };

      const result = await calculator.calculate(thickInputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        // Thick materials should require higher power
        expect(result.data.optimalPower).toBeGreaterThan(3000);
        // And lower cutting speed
        expect(result.data.cuttingSpeed).toBeLessThan(2000);
        // Larger nozzle diameter
        expect(result.data.nozzleDiameter).toBeGreaterThanOrEqual(2.5);
      }
    });

    test('should generate appropriate recommendations', async () => {
      const inputs: LaserParameterInputs = {
        materialType: 'aluminum',
        thickness: 10,
        laserType: 'co2', // Suboptimal for aluminum
        maxPower: 5000,
        qualityRequirement: 'ultra_precision'
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.recommendations).toBeDefined();
        expect(result.data.recommendations.length).toBeGreaterThan(0);
        // Should recommend fiber laser for aluminum
        expect(result.data.recommendations.some(r => 
          r.includes('Fiber laser') || r.includes('fiber laser')
        )).toBe(true);
      }
    });

    test('should include calculation metadata', async () => {
      const inputs: LaserParameterInputs = {
        materialType: 'steel',
        thickness: 5,
        laserType: 'fiber',
        maxPower: 3000,
        qualityRequirement: 'standard'
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.metadata).toBeDefined();
      expect(result.metadata.calculationTime).toBeGreaterThanOrEqual(0);
      expect(result.metadata.timestamp).toBeDefined();
      expect(result.metadata.version).toBe('1.0.0');
      expect(result.metadata.inputHash).toBeDefined();
    });
  });

  describe('Default and Example Inputs', () => {
    test('should provide valid default inputs', () => {
      const defaults = calculator.getDefaultInputs();
      
      expect(defaults.materialType).toBeDefined();
      expect(defaults.thickness).toBeGreaterThan(0);
      expect(defaults.laserType).toBeDefined();
      expect(defaults.maxPower).toBeGreaterThan(0);
      expect(defaults.qualityRequirement).toBeDefined();
      
      const validation = calculator.validateInputs(defaults);
      expect(validation.isValid).toBe(true);
    });

    test('should provide valid example inputs', () => {
      const examples = calculator.getExampleInputs();
      
      expect(examples.materialType).toBe('steel');
      expect(examples.thickness).toBe(5);
      expect(examples.laserType).toBe('fiber');
      expect(examples.maxPower).toBe(3000);
      expect(examples.qualityRequirement).toBe('standard');
      
      const validation = calculator.validateInputs(examples);
      expect(validation.isValid).toBe(true);
    });
  });

  describe('Error Handling', () => {
    test('should handle calculation errors gracefully', async () => {
      // Mock a calculation error by providing invalid internal state
      const invalidInputs = {
        materialType: 'steel',
        thickness: 5,
        laserType: 'fiber',
        maxPower: 3000,
        qualityRequirement: 'standard'
      } as LaserParameterInputs;

      // Override a method to force an error
      const originalMethod = calculator['calculateOptimalPowerRatio'];
      calculator['calculateOptimalPowerRatio'] = () => {
        throw new Error('Test calculation error');
      };

      const result = await calculator.calculate(invalidInputs);
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Test calculation error');
      
      // Restore original method
      calculator['calculateOptimalPowerRatio'] = originalMethod;
    });
  });

  describe('Performance', () => {
    test('should complete calculations within reasonable time', async () => {
      const inputs: LaserParameterInputs = {
        materialType: 'steel',
        thickness: 5,
        laserType: 'fiber',
        maxPower: 3000,
        qualityRequirement: 'standard'
      };

      const startTime = performance.now();
      const result = await calculator.calculate(inputs);
      const endTime = performance.now();
      
      expect(result.success).toBe(true);
      expect(endTime - startTime).toBeLessThan(100); // Should complete in <100ms
    });
  });
});
