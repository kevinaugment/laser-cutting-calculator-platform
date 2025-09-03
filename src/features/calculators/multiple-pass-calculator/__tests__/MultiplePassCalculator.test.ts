// Test suite for Multiple Pass Calculator
// Comprehensive testing of multi-pass cutting optimization and strategy analysis

import { describe, test, expect, beforeEach } from 'vitest';
import { MultiplePassCalculator, MultiplePassInputs } from '../MultiplePassCalculator';

describe('MultiplePassCalculator', () => {
  let calculator: MultiplePassCalculator;

  beforeEach(() => {
    calculator = new MultiplePassCalculator();
  });

  describe('Configuration', () => {
    test('should have correct calculator configuration', () => {
      expect(calculator.config.id).toBe('multiple-pass-calculator');
      expect(calculator.config.title).toBe('Multiple Pass Calculator');
      expect(calculator.config.category).toBe('Process Optimization');
      expect(calculator.config.badge).toBe('Standard');
      expect(calculator.config.inputs).toHaveLength(10);
    });

    test('should have all required input fields', () => {
      const inputIds = calculator.config.inputs.map(input => input.id);
      expect(inputIds).toContain('materialType');
      expect(inputIds).toContain('thickness');
      expect(inputIds).toContain('laserType');
      expect(inputIds).toContain('maxLaserPower');
      expect(inputIds).toContain('singlePassLimit');
      expect(inputIds).toContain('cuttingStrategy');
      expect(inputIds).toContain('qualityRequirement');
      expect(inputIds).toContain('assistGas');
      expect(inputIds).toContain('cuttingLength');
      expect(inputIds).toContain('currentPasses');
    });
  });

  describe('Input Validation', () => {
    test('should validate correct inputs', () => {
      const validInputs: MultiplePassInputs = {
        materialType: 'steel',
        thickness: 15,
        laserType: 'fiber',
        maxLaserPower: 3000,
        singlePassLimit: 8,
        cuttingStrategy: 'adaptive',
        qualityRequirement: 'standard',
        assistGas: 'oxygen',
        cuttingLength: 1000
      };

      const validation = calculator.validateInputs(validInputs);
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    test('should reject invalid material type', () => {
      const invalidInputs = {
        materialType: 'invalid_material',
        thickness: 15,
        laserType: 'fiber',
        maxLaserPower: 3000,
        singlePassLimit: 8,
        cuttingStrategy: 'adaptive',
        qualityRequirement: 'standard',
        assistGas: 'oxygen',
        cuttingLength: 1000
      };

      const validation = calculator.validateInputs(invalidInputs);
      expect(validation.isValid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
    });

    test('should warn about single pass possibility', () => {
      const singlePassInputs: MultiplePassInputs = {
        materialType: 'aluminum',
        thickness: 8, // Within single pass capability
        laserType: 'fiber',
        maxLaserPower: 3000,
        singlePassLimit: 10,
        cuttingStrategy: 'adaptive',
        qualityRequirement: 'standard',
        assistGas: 'nitrogen',
        cuttingLength: 1000
      };

      const validation = calculator.validateInputs(singlePassInputs);
      expect(validation.warnings.some(w => w.code === 'SINGLE_PASS_POSSIBLE')).toBe(true);
    });

    test('should warn about excessive single pass limit', () => {
      const excessiveLimitInputs: MultiplePassInputs = {
        materialType: 'steel',
        thickness: 10,
        laserType: 'fiber',
        maxLaserPower: 3000,
        singlePassLimit: 15, // Exceeds thickness
        cuttingStrategy: 'adaptive',
        qualityRequirement: 'standard',
        assistGas: 'oxygen',
        cuttingLength: 1000
      };

      const validation = calculator.validateInputs(excessiveLimitInputs);
      expect(validation.warnings.some(w => w.code === 'EXCESSIVE_SINGLE_PASS_LIMIT')).toBe(true);
    });

    test('should warn about insufficient power', () => {
      const lowPowerInputs: MultiplePassInputs = {
        materialType: 'steel',
        thickness: 25,
        laserType: 'fiber',
        maxLaserPower: 1000, // Low power for thick material
        singlePassLimit: 8,
        cuttingStrategy: 'adaptive',
        qualityRequirement: 'standard',
        assistGas: 'oxygen',
        cuttingLength: 1000
      };

      const validation = calculator.validateInputs(lowPowerInputs);
      expect(validation.warnings.some(w => w.code === 'INSUFFICIENT_POWER')).toBe(true);
    });
  });

  describe('Multi-Pass Strategy Optimization', () => {
    test('should calculate optimal pass strategy for thick steel', async () => {
      const inputs: MultiplePassInputs = {
        materialType: 'steel',
        thickness: 20,
        laserType: 'fiber',
        maxLaserPower: 4000,
        singlePassLimit: 8,
        cuttingStrategy: 'adaptive',
        qualityRequirement: 'standard',
        assistGas: 'oxygen',
        cuttingLength: 1500
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.passStrategy).toBeDefined();
        expect(result.data.passStrategy.totalPasses).toBeGreaterThan(1);
        expect(result.data.passStrategy.totalPasses).toBeLessThan(10);
        expect(result.data.passStrategy.depthPerPass).toBeGreaterThan(0);
        expect(result.data.passStrategy.depthPerPass * result.data.passStrategy.totalPasses).toBeCloseTo(inputs.thickness, 1);
        expect(result.data.passStrategy.strategy).toBe('adaptive');
        expect(result.data.passStrategy.efficiency).toBeGreaterThan(60);
        expect(result.data.passStrategy.confidence).toBeGreaterThan(0.5);
        expect(Array.isArray(result.data.passStrategy.reasoning)).toBe(true);
      }
    });

    test('should calculate pass parameters correctly', async () => {
      const inputs: MultiplePassInputs = {
        materialType: 'stainless_steel',
        thickness: 18,
        laserType: 'fiber',
        maxLaserPower: 3500,
        singlePassLimit: 6,
        cuttingStrategy: 'progressive_power',
        qualityRequirement: 'precision',
        assistGas: 'nitrogen',
        cuttingLength: 2000
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.passParameters).toBeDefined();
        expect(Array.isArray(result.data.passParameters)).toBe(true);
        expect(result.data.passParameters.length).toBeGreaterThan(1);
        
        result.data.passParameters.forEach((pass, index) => {
          expect(pass.passNumber).toBe(index + 1);
          expect(pass.depth).toBeGreaterThan(0);
          expect(pass.cumulativeDepth).toBeGreaterThan(0);
          expect(pass.power).toBeGreaterThan(0);
          expect(pass.power).toBeLessThanOrEqual(inputs.maxLaserPower);
          expect(pass.powerPercentage).toBeGreaterThan(0);
          expect(pass.powerPercentage).toBeLessThanOrEqual(100);
          expect(pass.speed).toBeGreaterThan(0);
          expect(pass.gasPressure).toBeGreaterThan(0);
          expect(pass.estimatedTime).toBeGreaterThan(0);
          expect(pass.notes).toBeDefined();
        });
        
        // Check cumulative depth progression
        const finalPass = result.data.passParameters[result.data.passParameters.length - 1];
        expect(finalPass.cumulativeDepth).toBeCloseTo(inputs.thickness, 1);
      }
    });

    test('should analyze time requirements', async () => {
      const inputs: MultiplePassInputs = {
        materialType: 'aluminum',
        thickness: 12,
        laserType: 'fiber',
        maxLaserPower: 2500,
        singlePassLimit: 5,
        cuttingStrategy: 'uniform',
        qualityRequirement: 'standard',
        assistGas: 'nitrogen',
        cuttingLength: 800
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.timeAnalysis).toBeDefined();
        expect(result.data.timeAnalysis.totalCuttingTime).toBeGreaterThan(0);
        expect(Array.isArray(result.data.timeAnalysis.timePerPass)).toBe(true);
        expect(result.data.timeAnalysis.timePerPass.length).toBe(result.data.passParameters.length);
        expect(result.data.timeAnalysis.setupTime).toBeGreaterThan(0);
        expect(result.data.timeAnalysis.totalTime).toBeGreaterThan(result.data.timeAnalysis.totalCuttingTime);
        expect(result.data.timeAnalysis.productionRate).toBeGreaterThan(0);
        
        // Check time consistency
        const calculatedTotal = result.data.timeAnalysis.timePerPass.reduce((sum, time) => sum + time, 0);
        expect(calculatedTotal).toBeCloseTo(result.data.timeAnalysis.totalCuttingTime, 1);
      }
    });

    test('should predict quality outcomes', async () => {
      const inputs: MultiplePassInputs = {
        materialType: 'titanium',
        thickness: 16,
        laserType: 'fiber',
        maxLaserPower: 3000,
        singlePassLimit: 5,
        cuttingStrategy: 'quality_focused',
        qualityRequirement: 'precision',
        assistGas: 'argon',
        cuttingLength: 1200
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.qualityPrediction).toBeDefined();
        expect(result.data.qualityPrediction.overallScore).toBeGreaterThanOrEqual(60);
        expect(result.data.qualityPrediction.overallScore).toBeLessThanOrEqual(100);
        expect(result.data.qualityPrediction.edgeQuality).toMatch(/excellent|good|fair|poor/);
        expect(Array.isArray(result.data.qualityPrediction.expectedFeatures)).toBe(true);
        expect(Array.isArray(result.data.qualityPrediction.potentialIssues)).toBe(true);
        expect(result.data.qualityPrediction.qualityConsistency).toBeGreaterThan(0);
        expect(result.data.qualityPrediction.qualityConsistency).toBeLessThanOrEqual(100);
      }
    });

    test('should analyze costs comprehensively', async () => {
      const inputs: MultiplePassInputs = {
        materialType: 'copper',
        thickness: 14,
        laserType: 'fiber',
        maxLaserPower: 2800,
        singlePassLimit: 4,
        cuttingStrategy: 'adaptive',
        qualityRequirement: 'standard',
        assistGas: 'nitrogen',
        cuttingLength: 1000
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.costAnalysis).toBeDefined();
        expect(result.data.costAnalysis.materialCost).toBeGreaterThan(0);
        expect(result.data.costAnalysis.energyCost).toBeGreaterThan(0);
        expect(result.data.costAnalysis.gasCost).toBeGreaterThan(0);
        expect(result.data.costAnalysis.laborCost).toBeGreaterThan(0);
        expect(result.data.costAnalysis.totalCost).toBeGreaterThan(0);
        expect(result.data.costAnalysis.costPerMm).toBeGreaterThan(0);
        
        expect(result.data.costAnalysis.costComparison).toBeDefined();
        expect(result.data.costAnalysis.costComparison.singlePassAttempt).toBeGreaterThan(0);
        expect(result.data.costAnalysis.costComparison.multiPassSavings).toBeDefined();
        expect(result.data.costAnalysis.costComparison.savingsPercentage).toBeDefined();
        
        // Check cost consistency
        const calculatedTotal = result.data.costAnalysis.materialCost + 
                               result.data.costAnalysis.energyCost + 
                               result.data.costAnalysis.gasCost + 
                               result.data.costAnalysis.laborCost;
        expect(calculatedTotal).toBeCloseTo(result.data.costAnalysis.totalCost, 0.01);
      }
    });

    test('should provide process recommendations', async () => {
      const inputs: MultiplePassInputs = {
        materialType: 'brass',
        thickness: 22,
        laserType: 'fiber',
        maxLaserPower: 3200,
        singlePassLimit: 7,
        cuttingStrategy: 'progressive_power',
        qualityRequirement: 'standard',
        assistGas: 'nitrogen',
        cuttingLength: 1800
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.processRecommendations).toBeDefined();
        expect(Array.isArray(result.data.processRecommendations.strategyOptimizations)).toBe(true);
        expect(Array.isArray(result.data.processRecommendations.parameterAdjustments)).toBe(true);
        expect(Array.isArray(result.data.processRecommendations.qualityImprovements)).toBe(true);
        expect(Array.isArray(result.data.processRecommendations.troubleshooting)).toBe(true);
        
        result.data.processRecommendations.troubleshooting.forEach(tip => {
          expect(tip.issue).toBeDefined();
          expect(tip.cause).toBeDefined();
          expect(tip.solution).toBeDefined();
        });
      }
    });

    test('should show strategy effects on pass count', async () => {
      const baseInputs: MultiplePassInputs = {
        materialType: 'steel',
        thickness: 15,
        laserType: 'fiber',
        maxLaserPower: 3000,
        singlePassLimit: 6,
        qualityRequirement: 'standard',
        assistGas: 'oxygen',
        cuttingLength: 1000,
        cuttingStrategy: 'uniform'
      };

      const uniformResult = await calculator.calculate(baseInputs);
      const qualityResult = await calculator.calculate({
        ...baseInputs,
        cuttingStrategy: 'quality_focused'
      });
      
      expect(uniformResult.success).toBe(true);
      expect(qualityResult.success).toBe(true);
      
      if (uniformResult.data && qualityResult.data) {
        // Quality focused should have more passes
        expect(qualityResult.data.passStrategy.totalPasses).toBeGreaterThanOrEqual(
          uniformResult.data.passStrategy.totalPasses
        );
        // Quality focused should have better quality score
        expect(qualityResult.data.qualityPrediction.overallScore).toBeGreaterThan(
          uniformResult.data.qualityPrediction.overallScore
        );
      }
    });

    test('should show quality requirement effects', async () => {
      const roughInputs: MultiplePassInputs = {
        materialType: 'stainless_steel',
        thickness: 12,
        laserType: 'fiber',
        maxLaserPower: 2500,
        singlePassLimit: 5,
        cuttingStrategy: 'adaptive',
        qualityRequirement: 'rough',
        assistGas: 'nitrogen',
        cuttingLength: 1000
      };

      const precisionInputs: MultiplePassInputs = {
        ...roughInputs,
        qualityRequirement: 'precision'
      };

      const roughResult = await calculator.calculate(roughInputs);
      const precisionResult = await calculator.calculate(precisionInputs);
      
      expect(roughResult.success).toBe(true);
      expect(precisionResult.success).toBe(true);
      
      if (roughResult.data && precisionResult.data) {
        // Precision should have more passes
        expect(precisionResult.data.passStrategy.totalPasses).toBeGreaterThanOrEqual(
          roughResult.data.passStrategy.totalPasses
        );
        // Precision should take longer
        expect(precisionResult.data.timeAnalysis.totalTime).toBeGreaterThan(
          roughResult.data.timeAnalysis.totalTime
        );
      }
    });

    test('should include calculation metadata', async () => {
      const inputs: MultiplePassInputs = {
        materialType: 'steel',
        thickness: 15,
        laserType: 'fiber',
        maxLaserPower: 3000,
        singlePassLimit: 8,
        cuttingStrategy: 'adaptive',
        qualityRequirement: 'standard',
        assistGas: 'oxygen',
        cuttingLength: 1000
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

  describe('Material-Specific Behavior', () => {
    test('should handle different materials correctly', async () => {
      const materials: MultiplePassInputs['materialType'][] = ['steel', 'aluminum', 'stainless_steel', 'copper', 'titanium', 'brass'];
      
      for (const material of materials) {
        const inputs: MultiplePassInputs = {
          materialType: material,
          thickness: 15,
          laserType: 'fiber',
          maxLaserPower: 3000,
          singlePassLimit: 6,
          cuttingStrategy: 'adaptive',
          qualityRequirement: 'standard',
          assistGas: 'nitrogen',
          cuttingLength: 1000
        };

        const result = await calculator.calculate(inputs);
        
        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        
        if (result.data) {
          expect(result.data.passStrategy.totalPasses).toBeGreaterThan(1);
          expect(result.data.passParameters.length).toBe(result.data.passStrategy.totalPasses);
          expect(result.data.timeAnalysis.totalTime).toBeGreaterThan(0);
          expect(result.data.costAnalysis.totalCost).toBeGreaterThan(0);
        }
      }
    });

    test('should show work-hardening material effects', async () => {
      const steelInputs: MultiplePassInputs = {
        materialType: 'steel', // Low work-hardening
        thickness: 15,
        laserType: 'fiber',
        maxLaserPower: 3000,
        singlePassLimit: 6,
        cuttingStrategy: 'adaptive',
        qualityRequirement: 'standard',
        assistGas: 'oxygen',
        cuttingLength: 1000
      };

      const titaniumInputs: MultiplePassInputs = {
        ...steelInputs,
        materialType: 'titanium', // High work-hardening
        assistGas: 'argon'
      };

      const steelResult = await calculator.calculate(steelInputs);
      const titaniumResult = await calculator.calculate(titaniumInputs);
      
      expect(steelResult.success).toBe(true);
      expect(titaniumResult.success).toBe(true);
      
      if (steelResult.data && titaniumResult.data) {
        // Titanium should have different pass strategy due to work-hardening
        expect(titaniumResult.data.passStrategy.totalPasses).toBeDefined();
        expect(steelResult.data.passStrategy.totalPasses).toBeDefined();
        // Both should be reasonable
        expect(titaniumResult.data.passStrategy.totalPasses).toBeGreaterThan(1);
        expect(steelResult.data.passStrategy.totalPasses).toBeGreaterThan(1);
      }
    });
  });

  describe('Default and Example Inputs', () => {
    test('should provide valid default inputs', () => {
      const defaults = calculator.getDefaultInputs();
      
      expect(defaults.materialType).toBeDefined();
      expect(defaults.thickness).toBeGreaterThan(4); // Multi-pass minimum
      expect(defaults.laserType).toBeDefined();
      expect(defaults.maxLaserPower).toBeGreaterThan(0);
      expect(defaults.singlePassLimit).toBeGreaterThan(0);
      expect(defaults.cuttingStrategy).toBeDefined();
      expect(defaults.qualityRequirement).toBeDefined();
      expect(defaults.assistGas).toBeDefined();
      expect(defaults.cuttingLength).toBeGreaterThan(0);
      
      const validation = calculator.validateInputs(defaults);
      expect(validation.isValid).toBe(true);
    });

    test('should provide valid example inputs', () => {
      const examples = calculator.getExampleInputs();
      
      expect(examples.materialType).toBe('steel');
      expect(examples.thickness).toBe(15);
      expect(examples.laserType).toBe('fiber');
      expect(examples.maxLaserPower).toBe(3000);
      expect(examples.singlePassLimit).toBe(8);
      expect(examples.cuttingStrategy).toBe('adaptive');
      expect(examples.qualityRequirement).toBe('standard');
      expect(examples.assistGas).toBe('oxygen');
      expect(examples.cuttingLength).toBe(1000);
      
      const validation = calculator.validateInputs(examples);
      expect(validation.isValid).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    test('should handle minimum thickness', async () => {
      const minInputs: MultiplePassInputs = {
        materialType: 'aluminum',
        thickness: 5, // Minimum thickness
        laserType: 'fiber',
        maxLaserPower: 2000,
        singlePassLimit: 3,
        cuttingStrategy: 'uniform',
        qualityRequirement: 'standard',
        assistGas: 'nitrogen',
        cuttingLength: 500
      };

      const result = await calculator.calculate(minInputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.passStrategy.totalPasses).toBeGreaterThan(1);
        expect(result.data.passParameters.length).toBeGreaterThan(1);
      }
    });

    test('should handle maximum thickness', async () => {
      const maxInputs: MultiplePassInputs = {
        materialType: 'steel',
        thickness: 100, // Maximum thickness
        laserType: 'fiber',
        maxLaserPower: 15000,
        singlePassLimit: 15,
        cuttingStrategy: 'adaptive',
        qualityRequirement: 'rough',
        assistGas: 'oxygen',
        cuttingLength: 2000
      };

      const result = await calculator.calculate(maxInputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.passStrategy.totalPasses).toBeGreaterThan(3);
        expect(result.data.warnings.length).toBeGreaterThan(0); // Should warn about extreme thickness
      }
    });

    test('should handle high pass count scenarios', async () => {
      const highPassInputs: MultiplePassInputs = {
        materialType: 'titanium',
        thickness: 30,
        laserType: 'fiber',
        maxLaserPower: 2000, // Lower power forces more passes
        singlePassLimit: 3, // Small single pass limit
        cuttingStrategy: 'quality_focused',
        qualityRequirement: 'precision',
        assistGas: 'argon',
        cuttingLength: 1500
      };

      const result = await calculator.calculate(highPassInputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.passStrategy.totalPasses).toBeGreaterThan(5);
        expect(result.data.passStrategy.totalPasses).toBeLessThanOrEqual(8); // Should be capped
        expect(result.data.warnings.some(w => w.includes('passes'))).toBe(true);
      }
    });
  });

  describe('Performance', () => {
    test('should complete calculations within reasonable time', async () => {
      const inputs: MultiplePassInputs = {
        materialType: 'steel',
        thickness: 15,
        laserType: 'fiber',
        maxLaserPower: 3000,
        singlePassLimit: 8,
        cuttingStrategy: 'adaptive',
        qualityRequirement: 'standard',
        assistGas: 'oxygen',
        cuttingLength: 1000
      };

      const startTime = performance.now();
      const result = await calculator.calculate(inputs);
      const endTime = performance.now();
      
      expect(result.success).toBe(true);
      expect(endTime - startTime).toBeLessThan(100); // Should complete in <100ms
    });
  });
});
