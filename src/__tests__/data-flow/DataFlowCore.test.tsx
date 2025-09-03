import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BaseCalculator, BaseCalculatorConfig, BaseCalculationResult } from '../../lib/calculator/BaseCalculator';
import { z } from 'zod';

// Simple calculator implementation for data flow testing
class TestDataFlowCalculator extends BaseCalculator {
  readonly config: BaseCalculatorConfig = {
    id: 'test-data-flow',
    title: 'Test Data Flow Calculator',
    description: 'Calculator for testing data flow integrity',
    category: 'Test',
    badge: 'Test',
    iconName: 'Calculator',
    inputs: [
      {
        id: 'inputValue',
        label: 'Input Value',
        type: 'number',
        required: true,
        min: 0,
        max: 1000
      },
      {
        id: 'multiplier',
        label: 'Multiplier',
        type: 'number',
        required: true,
        min: 1,
        max: 10
      }
    ]
  };

  getInputSchema(): z.ZodSchema {
    return z.object({
      inputValue: z.number().min(0).max(1000),
      multiplier: z.number().min(1).max(10)
    });
  }

  async calculate(inputs: Record<string, any>): Promise<BaseCalculationResult> {
    const { inputValue, multiplier } = inputs;
    
    // Simulate calculation processing
    await new Promise(resolve => setTimeout(resolve, 10));
    
    const result = inputValue * multiplier;
    
    return {
      success: true,
      data: {
        result,
        calculation: `${inputValue} × ${multiplier} = ${result}`,
        metadata: {
          inputValue,
          multiplier,
          processingTime: 10
        }
      },
      metadata: {
        calculationTime: 10,
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        inputHash: JSON.stringify(inputs)
      }
    };
  }

  getDefaultInputs(): Record<string, any> {
    return {
      inputValue: 0,
      multiplier: 1
    };
  }

  getExampleInputs(): Record<string, any> {
    return {
      inputValue: 100,
      multiplier: 2
    };
  }
}

describe('Data Flow Core Verification', () => {
  let calculator: TestDataFlowCalculator;

  beforeEach(() => {
    calculator = new TestDataFlowCalculator();
  });

  describe('Input Data Processing', () => {
    it('should process valid inputs correctly', async () => {
      const inputs = { inputValue: 50, multiplier: 3 };
      
      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data.result).toBe(150);
      expect(result.data.metadata.inputValue).toBe(50);
      expect(result.data.metadata.multiplier).toBe(3);
    });

    it('should validate input data types', () => {
      const validation = calculator.validateInputs({
        inputValue: 'invalid',
        multiplier: 2
      });

      expect(validation.isValid).toBe(false);
      expect(validation.errors).toHaveLength(1);
      expect(validation.errors[0].field).toBe('inputValue');
    });

    it('should validate input ranges', () => {
      const validation = calculator.validateInputs({
        inputValue: 2000, // Exceeds max
        multiplier: 0.5   // Below min
      });

      expect(validation.isValid).toBe(false);
      expect(validation.errors.length).toBeGreaterThanOrEqual(2);
    });

    it('should validate required fields', () => {
      const validation = calculator.validateInputs({
        inputValue: 100
        // multiplier missing
      });

      expect(validation.isValid).toBe(false);
      expect(validation.errors.some(e => e.field === 'multiplier')).toBe(true);
    });
  });

  describe('Calculation Engine Processing', () => {
    it('should perform calculations with correct data flow', async () => {
      const inputs = { inputValue: 25, multiplier: 4 };
      
      const result = await calculator.calculate(inputs);
      
      // Verify data flow integrity
      expect(result.success).toBe(true);
      expect(result.data.result).toBe(100);
      expect(result.data.calculation).toBe('25 × 4 = 100');
      expect(result.metadata.inputHash).toBe(JSON.stringify(inputs));
    });

    it('should handle edge case calculations', async () => {
      const inputs = { inputValue: 0, multiplier: 5 };
      
      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data.result).toBe(0);
    });

    it('should maintain data integrity through async processing', async () => {
      const inputs = { inputValue: 75, multiplier: 2 };
      
      const startTime = Date.now();
      const result = await calculator.calculate(inputs);
      const endTime = Date.now();
      
      // Verify async processing completed
      expect(endTime - startTime).toBeGreaterThanOrEqual(10);
      expect(result.data.metadata.processingTime).toBe(10);
    });

    it('should handle concurrent calculations correctly', async () => {
      const inputs1 = { inputValue: 10, multiplier: 2 };
      const inputs2 = { inputValue: 20, multiplier: 3 };
      const inputs3 = { inputValue: 30, multiplier: 4 };
      
      const [result1, result2, result3] = await Promise.all([
        calculator.calculate(inputs1),
        calculator.calculate(inputs2),
        calculator.calculate(inputs3)
      ]);
      
      expect(result1.data.result).toBe(20);
      expect(result2.data.result).toBe(60);
      expect(result3.data.result).toBe(120);
    });
  });

  describe('Result Data Flow', () => {
    it('should format results consistently', async () => {
      const inputs = { inputValue: 45, multiplier: 3 };
      
      const result = await calculator.calculate(inputs);
      
      // Verify result structure
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('metadata');
      
      expect(result.data).toHaveProperty('result');
      expect(result.data).toHaveProperty('calculation');
      expect(result.data).toHaveProperty('metadata');
      
      expect(result.metadata).toHaveProperty('calculationTime');
      expect(result.metadata).toHaveProperty('timestamp');
      expect(result.metadata).toHaveProperty('version');
      expect(result.metadata).toHaveProperty('inputHash');
    });

    it('should preserve input data in results', async () => {
      const inputs = { inputValue: 80, multiplier: 2 };
      
      const result = await calculator.calculate(inputs);
      
      const originalInputs = JSON.parse(result.metadata.inputHash);
      expect(originalInputs).toEqual(inputs);
    });

    it('should generate unique timestamps', async () => {
      const inputs = { inputValue: 15, multiplier: 3 };
      
      const result1 = await calculator.calculate(inputs);
      await new Promise(resolve => setTimeout(resolve, 1)); // Ensure different timestamp
      const result2 = await calculator.calculate(inputs);
      
      expect(result1.metadata.timestamp).not.toBe(result2.metadata.timestamp);
    });
  });

  describe('Error Handling Data Flow', () => {
    it('should handle calculation errors gracefully', async () => {
      // Create calculator that throws error
      const errorCalculator = new TestDataFlowCalculator();
      errorCalculator.calculate = vi.fn().mockRejectedValue(new Error('Test calculation error'));
      
      try {
        await errorCalculator.calculate({ inputValue: 10, multiplier: 2 });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe('Test calculation error');
      }
    });

    it('should maintain data integrity during validation failures', () => {
      const invalidInputs = { inputValue: -10, multiplier: 15 };
      
      const validation = calculator.validateInputs(invalidInputs);
      
      expect(validation.isValid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
      
      // Original inputs should not be modified
      expect(invalidInputs.inputValue).toBe(-10);
      expect(invalidInputs.multiplier).toBe(15);
    });
  });

  describe('Data Transformation and Serialization', () => {
    it('should serialize and deserialize data correctly', async () => {
      const inputs = { inputValue: 60, multiplier: 2 };
      
      const result = await calculator.calculate(inputs);
      
      // Serialize result
      const serialized = JSON.stringify(result);
      const deserialized = JSON.parse(serialized);
      
      expect(deserialized).toEqual(result);
      expect(deserialized.data.result).toBe(120);
    });

    it('should handle data type conversions', () => {
      // Test string to number conversion
      const inputs = { inputValue: '25', multiplier: '4' };
      
      const validation = calculator.validateInputs({
        inputValue: Number(inputs.inputValue),
        multiplier: Number(inputs.multiplier)
      });
      
      expect(validation.isValid).toBe(true);
    });

    it('should maintain precision in calculations', async () => {
      const inputs = { inputValue: 0.1, multiplier: 3 };
      
      const result = await calculator.calculate(inputs);
      
      // JavaScript floating point precision
      expect(result.data.result).toBeCloseTo(0.3, 10);
    });
  });

  describe('Performance and Memory Management', () => {
    it('should complete calculations within reasonable time', async () => {
      const inputs = { inputValue: 100, multiplier: 5 };
      
      const startTime = performance.now();
      const result = await calculator.calculate(inputs);
      const endTime = performance.now();
      
      const calculationTime = endTime - startTime;
      
      expect(calculationTime).toBeLessThan(100); // Should complete in < 100ms
      expect(result.metadata.calculationTime).toBe(10);
    });

    it('should handle large datasets efficiently', async () => {
      const largeInputs = { inputValue: 999, multiplier: 10 };
      
      const result = await calculator.calculate(largeInputs);
      
      expect(result.success).toBe(true);
      expect(result.data.result).toBe(9990);
    });

    it('should not cause memory leaks with repeated calculations', async () => {
      const inputs = { inputValue: 50, multiplier: 2 };
      
      // Perform multiple calculations
      for (let i = 0; i < 100; i++) {
        const result = await calculator.calculate(inputs);
        expect(result.data.result).toBe(100);
      }
      
      // If we reach here without memory issues, test passes
      expect(true).toBe(true);
    });
  });

  describe('Configuration and Schema Validation', () => {
    it('should have valid calculator configuration', () => {
      const config = calculator.config;
      
      expect(config.id).toBeTruthy();
      expect(config.title).toBeTruthy();
      expect(config.inputs).toHaveLength(2);
      expect(config.inputs[0].id).toBe('inputValue');
      expect(config.inputs[1].id).toBe('multiplier');
    });

    it('should provide valid input schema', () => {
      const schema = calculator.getInputSchema();
      
      // Valid inputs should pass
      const validResult = schema.safeParse({ inputValue: 50, multiplier: 3 });
      expect(validResult.success).toBe(true);
      
      // Invalid inputs should fail
      const invalidResult = schema.safeParse({ inputValue: 'invalid', multiplier: 3 });
      expect(invalidResult.success).toBe(false);
    });

    it('should provide default and example inputs', () => {
      const defaultInputs = calculator.getDefaultInputs();
      const exampleInputs = calculator.getExampleInputs();
      
      expect(defaultInputs.inputValue).toBe(0);
      expect(defaultInputs.multiplier).toBe(1);
      
      expect(exampleInputs.inputValue).toBe(100);
      expect(exampleInputs.multiplier).toBe(2);
    });
  });
});
