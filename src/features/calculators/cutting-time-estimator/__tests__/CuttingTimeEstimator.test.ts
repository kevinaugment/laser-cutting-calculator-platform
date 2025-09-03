// Test suite for Cutting Time Estimator Calculator
// Comprehensive testing of time calculation accuracy and validation

import { describe, test, expect, beforeEach } from 'vitest';
import { CuttingTimeEstimator, CuttingTimeInputs } from '../CuttingTimeEstimator';

describe('CuttingTimeEstimator', () => {
  let calculator: CuttingTimeEstimator;

  beforeEach(() => {
    calculator = new CuttingTimeEstimator();
  });

  describe('Configuration', () => {
    test('should have correct calculator configuration', () => {
      expect(calculator.config.id).toBe('cutting-time-estimator');
      expect(calculator.config.title).toBe('Cutting Time Estimator');
      expect(calculator.config.category).toBe('Core Engineering');
      expect(calculator.config.badge).toBe('Standard');
      expect(calculator.config.inputs).toHaveLength(5);
    });

    test('should have all required input fields', () => {
      const inputIds = calculator.config.inputs.map(input => input.id);
      expect(inputIds).toContain('materialType');
      expect(inputIds).toContain('thickness');
      expect(inputIds).toContain('cuttingLength');
      expect(inputIds).toContain('pierceCount');
      expect(inputIds).toContain('laserPower');
    });
  });

  describe('Input Validation', () => {
    test('should validate correct inputs', () => {
      const validInputs: CuttingTimeInputs = {
        materialType: 'steel',
        thickness: 5,
        cuttingLength: 2000,
        pierceCount: 10,
        laserPower: 3000
      };

      const validation = calculator.validateInputs(validInputs);
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    test('should reject invalid material type', () => {
      const invalidInputs = {
        materialType: 'invalid_material',
        thickness: 5,
        cuttingLength: 2000,
        pierceCount: 10,
        laserPower: 3000
      };

      const validation = calculator.validateInputs(invalidInputs);
      expect(validation.isValid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
    });

    test('should reject thickness out of range', () => {
      const invalidInputs: CuttingTimeInputs = {
        materialType: 'steel',
        thickness: 100, // Above max of 50
        cuttingLength: 2000,
        pierceCount: 10,
        laserPower: 3000
      };

      const validation = calculator.validateInputs(invalidInputs);
      expect(validation.isValid).toBe(false);
      expect(validation.errors.some(e => e.field === 'thickness')).toBe(true);
    });

    test('should reject cutting length out of range', () => {
      const invalidInputs: CuttingTimeInputs = {
        materialType: 'steel',
        thickness: 5,
        cuttingLength: 200000, // Above max of 100000
        pierceCount: 10,
        laserPower: 3000
      };

      const validation = calculator.validateInputs(invalidInputs);
      expect(validation.isValid).toBe(false);
      expect(validation.errors.some(e => e.field === 'cuttingLength')).toBe(true);
    });

    test('should generate warnings for suboptimal conditions', () => {
      const suboptimalInputs: CuttingTimeInputs = {
        materialType: 'steel',
        thickness: 30, // Very thick for steel database
        cuttingLength: 2000,
        pierceCount: 10,
        laserPower: 1000 // Low power for thick material
      };

      const validation = calculator.validateInputs(suboptimalInputs);
      expect(validation.warnings.length).toBeGreaterThan(0);
    });
  });

  describe('Calculations', () => {
    test('should calculate time for steel cutting', async () => {
      const inputs: CuttingTimeInputs = {
        materialType: 'steel',
        thickness: 5,
        cuttingLength: 2000,
        pierceCount: 10,
        laserPower: 3000
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.piercingTime).toBeGreaterThan(0);
        expect(result.data.cuttingTime).toBeGreaterThan(0);
        expect(result.data.movingTime).toBeGreaterThan(0);
        expect(result.data.totalTime).toBeGreaterThan(0);
        expect(result.data.efficiency).toBeGreaterThan(0);
        expect(result.data.efficiency).toBeLessThanOrEqual(100);
        
        // Total time should be sum of components
        const calculatedTotal = result.data.piercingTime + result.data.cuttingTime + result.data.movingTime;
        expect(Math.abs(result.data.totalTime - calculatedTotal)).toBeLessThan(0.01);
      }
    });

    test('should calculate time for stainless steel cutting', async () => {
      const inputs: CuttingTimeInputs = {
        materialType: 'stainless_steel',
        thickness: 3,
        cuttingLength: 1500,
        pierceCount: 8,
        laserPower: 2000
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.totalTime).toBeGreaterThan(0);
        expect(result.data.productionMetrics.partsPerHour).toBeGreaterThan(0);
        expect(result.data.productionMetrics.dailyCapacity).toBeGreaterThan(0);
        expect(result.data.productionMetrics.weeklyCapacity).toBeGreaterThan(0);
      }
    });

    test('should calculate time for aluminum cutting', async () => {
      const inputs: CuttingTimeInputs = {
        materialType: 'aluminum',
        thickness: 8,
        cuttingLength: 3000,
        pierceCount: 15,
        laserPower: 4000
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        // Aluminum should generally cut faster than steel
        expect(result.data.cuttingTime).toBeGreaterThan(0);
        expect(result.data.timeBreakdown.cutting).toBeGreaterThan(0);
        expect(result.data.timeBreakdown.piercing).toBeGreaterThan(0);
        expect(result.data.timeBreakdown.moving).toBeGreaterThan(0);
        
        // Time breakdown should sum to 100%
        const totalPercentage = result.data.timeBreakdown.cutting + 
                               result.data.timeBreakdown.piercing + 
                               result.data.timeBreakdown.moving;
        expect(Math.abs(totalPercentage - 100)).toBeLessThan(0.1);
      }
    });

    test('should handle thick materials appropriately', async () => {
      const thickInputs: CuttingTimeInputs = {
        materialType: 'steel',
        thickness: 20,
        cuttingLength: 1000,
        pierceCount: 5,
        laserPower: 6000
      };

      const result = await calculator.calculate(thickInputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        // Thick materials should take longer to pierce
        expect(result.data.piercingTime).toBeGreaterThan(0.1);
        // Should have lower cutting speeds
        expect(result.data.cuttingTime).toBeGreaterThan(0.5);
      }
    });

    test('should handle high pierce count correctly', async () => {
      const highPierceInputs: CuttingTimeInputs = {
        materialType: 'steel',
        thickness: 3,
        cuttingLength: 5000,
        pierceCount: 100, // High pierce count
        laserPower: 3000
      };

      const result = await calculator.calculate(highPierceInputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        // High pierce count should result in significant piercing time
        expect(result.data.piercingTime).toBeGreaterThan(1);
        expect(result.data.timeBreakdown.piercing).toBeGreaterThan(10); // >10% of total time
        
        // Should generate warnings about high pierce density
        expect(result.data.warnings).toBeDefined();
        expect(result.data.warnings.length).toBeGreaterThan(0);
      }
    });

    test('should generate appropriate recommendations', async () => {
      const inputs: CuttingTimeInputs = {
        materialType: 'aluminum',
        thickness: 15, // Thick aluminum
        cuttingLength: 10000, // Long cutting
        pierceCount: 50,
        laserPower: 2000 // Moderate power
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.recommendations).toBeDefined();
        expect(result.data.recommendations.length).toBeGreaterThan(0);
      }
    });

    test('should include calculation metadata', async () => {
      const inputs: CuttingTimeInputs = {
        materialType: 'steel',
        thickness: 5,
        cuttingLength: 2000,
        pierceCount: 10,
        laserPower: 3000
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

  describe('Edge Cases', () => {
    test('should handle minimum values', async () => {
      const minInputs: CuttingTimeInputs = {
        materialType: 'aluminum',
        thickness: 0.5, // Minimum thickness
        cuttingLength: 1, // Minimum length
        pierceCount: 1, // Minimum pierces
        laserPower: 500 // Minimum power
      };

      const result = await calculator.calculate(minInputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.totalTime).toBeGreaterThan(0);
        expect(result.data.productionMetrics.partsPerHour).toBeGreaterThan(0);
      }
    });

    test('should handle maximum values', async () => {
      const maxInputs: CuttingTimeInputs = {
        materialType: 'steel',
        thickness: 50, // Maximum thickness
        cuttingLength: 100000, // Maximum length
        pierceCount: 1000, // Maximum pierces
        laserPower: 20000 // Maximum power
      };

      const result = await calculator.calculate(maxInputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.totalTime).toBeGreaterThan(0);
        // Should generate warnings for extreme values
        expect(result.data.warnings.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Default and Example Inputs', () => {
    test('should provide valid default inputs', () => {
      const defaults = calculator.getDefaultInputs();
      
      expect(defaults.materialType).toBeDefined();
      expect(defaults.thickness).toBeGreaterThan(0);
      expect(defaults.cuttingLength).toBeGreaterThan(0);
      expect(defaults.pierceCount).toBeGreaterThan(0);
      expect(defaults.laserPower).toBeGreaterThan(0);
      
      const validation = calculator.validateInputs(defaults);
      expect(validation.isValid).toBe(true);
    });

    test('should provide valid example inputs', () => {
      const examples = calculator.getExampleInputs();
      
      expect(examples.materialType).toBe('steel');
      expect(examples.thickness).toBe(5);
      expect(examples.cuttingLength).toBe(2000);
      expect(examples.pierceCount).toBe(10);
      expect(examples.laserPower).toBe(3000);
      
      const validation = calculator.validateInputs(examples);
      expect(validation.isValid).toBe(true);
    });
  });

  describe('Performance', () => {
    test('should complete calculations within reasonable time', async () => {
      const inputs: CuttingTimeInputs = {
        materialType: 'steel',
        thickness: 5,
        cuttingLength: 2000,
        pierceCount: 10,
        laserPower: 3000
      };

      const startTime = performance.now();
      const result = await calculator.calculate(inputs);
      const endTime = performance.now();
      
      expect(result.success).toBe(true);
      expect(endTime - startTime).toBeLessThan(50); // Should complete in <50ms
    });
  });
});
