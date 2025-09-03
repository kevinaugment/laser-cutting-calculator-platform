// Test suite for Power-Speed Matching Calculator
// Comprehensive testing of power-speed optimization and parameter matching

import { describe, test, expect, beforeEach } from 'vitest';
import { PowerSpeedMatchingCalculator, PowerSpeedMatchingInputs } from '../PowerSpeedMatchingCalculator';

describe('PowerSpeedMatchingCalculator', () => {
  let calculator: PowerSpeedMatchingCalculator;

  beforeEach(() => {
    calculator = new PowerSpeedMatchingCalculator();
  });

  describe('Configuration', () => {
    test('should have correct calculator configuration', () => {
      expect(calculator.config.id).toBe('power-speed-matching-calculator');
      expect(calculator.config.title).toBe('Power-Speed Matching Calculator');
      expect(calculator.config.category).toBe('Process Optimization');
      expect(calculator.config.badge).toBe('Standard');
      expect(calculator.config.inputs).toHaveLength(9);
    });

    test('should have all required input fields', () => {
      const inputIds = calculator.config.inputs.map(input => input.id);
      expect(inputIds).toContain('materialType');
      expect(inputIds).toContain('thickness');
      expect(inputIds).toContain('laserType');
      expect(inputIds).toContain('maxPower');
      expect(inputIds).toContain('assistGas');
      expect(inputIds).toContain('qualityRequirement');
      expect(inputIds).toContain('priorityGoal');
      expect(inputIds).toContain('currentPower');
      expect(inputIds).toContain('currentSpeed');
    });
  });

  describe('Input Validation', () => {
    test('should validate correct inputs', () => {
      const validInputs: PowerSpeedMatchingInputs = {
        materialType: 'steel',
        thickness: 5,
        laserType: 'fiber',
        maxPower: 3000,
        assistGas: 'oxygen',
        qualityRequirement: 'standard',
        priorityGoal: 'balanced'
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
        assistGas: 'oxygen',
        qualityRequirement: 'standard',
        priorityGoal: 'balanced'
      };

      const validation = calculator.validateInputs(invalidInputs);
      expect(validation.isValid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
    });

    test('should warn about suboptimal laser-material combination', () => {
      const suboptimalInputs: PowerSpeedMatchingInputs = {
        materialType: 'copper',
        thickness: 5,
        laserType: 'fiber', // Not optimal for copper
        maxPower: 3000,
        assistGas: 'nitrogen',
        qualityRequirement: 'standard',
        priorityGoal: 'balanced'
      };

      const validation = calculator.validateInputs(suboptimalInputs);
      expect(validation.warnings.some(w => w.code === 'SUBOPTIMAL_LASER_MATERIAL')).toBe(true);
    });

    test('should warn about insufficient power', () => {
      const lowPowerInputs: PowerSpeedMatchingInputs = {
        materialType: 'steel',
        thickness: 20, // Thick material
        laserType: 'fiber',
        maxPower: 500, // Low power for thick steel
        assistGas: 'oxygen',
        qualityRequirement: 'standard',
        priorityGoal: 'balanced'
      };

      const validation = calculator.validateInputs(lowPowerInputs);
      expect(validation.warnings.some(w => w.code === 'INSUFFICIENT_POWER')).toBe(true);
    });

    test('should warn about suboptimal gas choice', () => {
      const suboptimalGasInputs: PowerSpeedMatchingInputs = {
        materialType: 'aluminum',
        thickness: 5,
        laserType: 'fiber',
        maxPower: 3000,
        assistGas: 'oxygen', // Poor choice for aluminum
        qualityRequirement: 'standard',
        priorityGoal: 'balanced'
      };

      const validation = calculator.validateInputs(suboptimalGasInputs);
      expect(validation.warnings.some(w => w.code === 'SUBOPTIMAL_GAS')).toBe(true);
    });
  });

  describe('Power-Speed Optimization', () => {
    test('should calculate optimal settings for steel cutting', async () => {
      const inputs: PowerSpeedMatchingInputs = {
        materialType: 'steel',
        thickness: 5,
        laserType: 'fiber',
        maxPower: 3000,
        assistGas: 'oxygen',
        qualityRequirement: 'standard',
        priorityGoal: 'balanced'
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.optimalSettings).toBeDefined();
        expect(result.data.optimalSettings.power).toBeGreaterThan(0);
        expect(result.data.optimalSettings.power).toBeLessThanOrEqual(inputs.maxPower);
        expect(result.data.optimalSettings.speed).toBeGreaterThan(0);
        expect(result.data.optimalSettings.powerPercentage).toBeGreaterThanOrEqual(0);
        expect(result.data.optimalSettings.powerPercentage).toBeLessThanOrEqual(100);
        expect(result.data.optimalSettings.powerDensity).toBeGreaterThan(0);
        expect(result.data.optimalSettings.specificEnergy).toBeGreaterThan(0);
      }
    });

    test('should predict performance correctly', async () => {
      const inputs: PowerSpeedMatchingInputs = {
        materialType: 'aluminum',
        thickness: 3,
        laserType: 'fiber',
        maxPower: 2000,
        assistGas: 'nitrogen',
        qualityRequirement: 'precision',
        priorityGoal: 'quality'
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.performancePrediction).toBeDefined();
        expect(result.data.performancePrediction.cuttingEfficiency).toBeGreaterThanOrEqual(0);
        expect(result.data.performancePrediction.cuttingEfficiency).toBeLessThanOrEqual(100);
        expect(result.data.performancePrediction.edgeQuality).toBeGreaterThanOrEqual(1);
        expect(result.data.performancePrediction.edgeQuality).toBeLessThanOrEqual(10);
        expect(result.data.performancePrediction.expectedKerf).toBeGreaterThan(0);
        expect(result.data.performancePrediction.surfaceRoughness).toMatch(/Ra \d+\.\d+/);
        expect(result.data.performancePrediction.heatAffectedZone).toBeGreaterThan(0);
      }
    });

    test('should generate alternative settings', async () => {
      const inputs: PowerSpeedMatchingInputs = {
        materialType: 'stainless_steel',
        thickness: 8,
        laserType: 'fiber',
        maxPower: 4000,
        assistGas: 'nitrogen',
        qualityRequirement: 'standard',
        priorityGoal: 'balanced'
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.alternativeSettings).toBeDefined();
        expect(Array.isArray(result.data.alternativeSettings)).toBe(true);
        expect(result.data.alternativeSettings.length).toBeGreaterThan(0);
        
        result.data.alternativeSettings.forEach(alt => {
          expect(alt.name).toBeDefined();
          expect(alt.power).toBeGreaterThan(0);
          expect(alt.speed).toBeGreaterThan(0);
          expect(alt.tradeoff).toBeDefined();
          expect(alt.efficiency).toBeGreaterThanOrEqual(0);
          expect(alt.efficiency).toBeLessThanOrEqual(100);
          expect(alt.qualityScore).toBeGreaterThanOrEqual(1);
          expect(alt.qualityScore).toBeLessThanOrEqual(10);
        });
      }
    });

    test('should analyze optimization potential', async () => {
      const inputs: PowerSpeedMatchingInputs = {
        materialType: 'titanium',
        thickness: 6,
        laserType: 'fiber',
        maxPower: 3500,
        assistGas: 'argon',
        qualityRequirement: 'precision',
        priorityGoal: 'quality',
        currentPower: 2000,
        currentSpeed: 1500
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.optimizationAnalysis).toBeDefined();
        expect(result.data.optimizationAnalysis.powerUtilization).toBeGreaterThanOrEqual(0);
        expect(result.data.optimizationAnalysis.powerUtilization).toBeLessThanOrEqual(100);
        expect(result.data.optimizationAnalysis.speedOptimization).toBeGreaterThanOrEqual(0);
        expect(result.data.optimizationAnalysis.speedOptimization).toBeLessThanOrEqual(100);
        expect(result.data.optimizationAnalysis.energyEfficiency).toBeGreaterThanOrEqual(0);
        expect(result.data.optimizationAnalysis.energyEfficiency).toBeLessThanOrEqual(100);
        expect(result.data.optimizationAnalysis.productivityGain).toBeGreaterThanOrEqual(0);
        expect(result.data.optimizationAnalysis.qualityImprovement).toBeGreaterThanOrEqual(0);
      }
    });

    test('should provide process recommendations', async () => {
      const inputs: PowerSpeedMatchingInputs = {
        materialType: 'brass',
        thickness: 4,
        laserType: 'fiber',
        maxPower: 2500,
        assistGas: 'nitrogen',
        qualityRequirement: 'standard',
        priorityGoal: 'efficiency'
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.processRecommendations).toBeDefined();
        expect(Array.isArray(result.data.processRecommendations.parameterAdjustments)).toBe(true);
        expect(Array.isArray(result.data.processRecommendations.qualityTips)).toBe(true);
        expect(Array.isArray(result.data.processRecommendations.efficiencyTips)).toBe(true);
        expect(Array.isArray(result.data.processRecommendations.troubleshooting)).toBe(true);
      }
    });

    test('should show priority goal effects', async () => {
      const baseInputs: PowerSpeedMatchingInputs = {
        materialType: 'steel',
        thickness: 5,
        laserType: 'fiber',
        maxPower: 3000,
        assistGas: 'oxygen',
        qualityRequirement: 'standard',
        priorityGoal: 'speed'
      };

      const speedResult = await calculator.calculate(baseInputs);
      const qualityResult = await calculator.calculate({
        ...baseInputs,
        priorityGoal: 'quality'
      });
      
      expect(speedResult.success).toBe(true);
      expect(qualityResult.success).toBe(true);
      
      if (speedResult.data && qualityResult.data) {
        // Speed priority should result in higher speed
        expect(speedResult.data.optimalSettings.speed).toBeGreaterThan(qualityResult.data.optimalSettings.speed);
        // Quality priority should result in better edge quality
        expect(qualityResult.data.performancePrediction.edgeQuality).toBeGreaterThan(speedResult.data.performancePrediction.edgeQuality);
      }
    });

    test('should show quality requirement effects', async () => {
      const roughInputs: PowerSpeedMatchingInputs = {
        materialType: 'steel',
        thickness: 5,
        laserType: 'fiber',
        maxPower: 3000,
        assistGas: 'oxygen',
        qualityRequirement: 'rough',
        priorityGoal: 'balanced'
      };

      const precisionInputs: PowerSpeedMatchingInputs = {
        ...roughInputs,
        qualityRequirement: 'precision'
      };

      const roughResult = await calculator.calculate(roughInputs);
      const precisionResult = await calculator.calculate(precisionInputs);
      
      expect(roughResult.success).toBe(true);
      expect(precisionResult.success).toBe(true);
      
      if (roughResult.data && precisionResult.data) {
        // Rough should be faster but lower quality
        expect(roughResult.data.optimalSettings.speed).toBeGreaterThan(precisionResult.data.optimalSettings.speed);
        expect(precisionResult.data.performancePrediction.edgeQuality).toBeGreaterThan(roughResult.data.performancePrediction.edgeQuality);
      }
    });

    test('should include calculation metadata', async () => {
      const inputs: PowerSpeedMatchingInputs = {
        materialType: 'steel',
        thickness: 5,
        laserType: 'fiber',
        maxPower: 3000,
        assistGas: 'oxygen',
        qualityRequirement: 'standard',
        priorityGoal: 'balanced'
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

  describe('Laser Type Effects', () => {
    test('should show fiber laser advantages for steel', async () => {
      const fiberInputs: PowerSpeedMatchingInputs = {
        materialType: 'steel',
        thickness: 5,
        laserType: 'fiber',
        maxPower: 3000,
        assistGas: 'oxygen',
        qualityRequirement: 'standard',
        priorityGoal: 'balanced'
      };

      const co2Inputs: PowerSpeedMatchingInputs = {
        ...fiberInputs,
        laserType: 'co2'
      };

      const fiberResult = await calculator.calculate(fiberInputs);
      const co2Result = await calculator.calculate(co2Inputs);
      
      expect(fiberResult.success).toBe(true);
      expect(co2Result.success).toBe(true);
      
      if (fiberResult.data && co2Result.data) {
        // Fiber should be more efficient for steel
        expect(fiberResult.data.optimizationAnalysis.energyEfficiency).toBeGreaterThan(co2Result.data.optimizationAnalysis.energyEfficiency);
      }
    });

    test('should show CO2 laser advantages for aluminum', async () => {
      const co2Inputs: PowerSpeedMatchingInputs = {
        materialType: 'aluminum',
        thickness: 5,
        laserType: 'co2',
        maxPower: 3000,
        assistGas: 'nitrogen',
        qualityRequirement: 'standard',
        priorityGoal: 'balanced'
      };

      const fiberInputs: PowerSpeedMatchingInputs = {
        ...co2Inputs,
        laserType: 'fiber'
      };

      const co2Result = await calculator.calculate(co2Inputs);
      const fiberResult = await calculator.calculate(fiberInputs);
      
      expect(co2Result.success).toBe(true);
      expect(fiberResult.success).toBe(true);
      
      if (co2Result.data && fiberResult.data) {
        // CO2 should have better absorption for aluminum
        expect(co2Result.data.performancePrediction.cuttingEfficiency).toBeGreaterThan(fiberResult.data.performancePrediction.cuttingEfficiency);
      }
    });
  });

  describe('Material-Specific Behavior', () => {
    test('should handle different materials correctly', async () => {
      const materials: PowerSpeedMatchingInputs['materialType'][] = ['steel', 'aluminum', 'stainless_steel', 'copper', 'titanium', 'brass'];
      
      for (const material of materials) {
        const inputs: PowerSpeedMatchingInputs = {
          materialType: material,
          thickness: 5,
          laserType: 'fiber',
          maxPower: 3000,
          assistGas: 'nitrogen',
          qualityRequirement: 'standard',
          priorityGoal: 'balanced'
        };

        const result = await calculator.calculate(inputs);
        
        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        
        if (result.data) {
          expect(result.data.optimalSettings.power).toBeGreaterThan(0);
          expect(result.data.optimalSettings.speed).toBeGreaterThan(0);
          expect(result.data.performancePrediction.edgeQuality).toBeGreaterThanOrEqual(1);
        }
      }
    });

    test('should show material thermal properties effects', async () => {
      const steelInputs: PowerSpeedMatchingInputs = {
        materialType: 'steel',
        thickness: 5,
        laserType: 'fiber',
        maxPower: 3000,
        assistGas: 'oxygen',
        qualityRequirement: 'standard',
        priorityGoal: 'balanced'
      };

      const copperInputs: PowerSpeedMatchingInputs = {
        ...steelInputs,
        materialType: 'copper',
        assistGas: 'nitrogen'
      };

      const steelResult = await calculator.calculate(steelInputs);
      const copperResult = await calculator.calculate(copperInputs);
      
      expect(steelResult.success).toBe(true);
      expect(copperResult.success).toBe(true);
      
      if (steelResult.data && copperResult.data) {
        // Copper should require higher power due to thermal conductivity
        expect(copperResult.data.optimalSettings.power).toBeGreaterThan(steelResult.data.optimalSettings.power);
      }
    });
  });

  describe('Default and Example Inputs', () => {
    test('should provide valid default inputs', () => {
      const defaults = calculator.getDefaultInputs();
      
      expect(defaults.materialType).toBeDefined();
      expect(defaults.thickness).toBeGreaterThan(0);
      expect(defaults.laserType).toBeDefined();
      expect(defaults.maxPower).toBeGreaterThan(0);
      expect(defaults.assistGas).toBeDefined();
      expect(defaults.qualityRequirement).toBeDefined();
      expect(defaults.priorityGoal).toBeDefined();
      
      const validation = calculator.validateInputs(defaults);
      expect(validation.isValid).toBe(true);
    });

    test('should provide valid example inputs', () => {
      const examples = calculator.getExampleInputs();
      
      expect(examples.materialType).toBe('steel');
      expect(examples.thickness).toBe(5);
      expect(examples.laserType).toBe('fiber');
      expect(examples.maxPower).toBe(3000);
      expect(examples.assistGas).toBe('oxygen');
      expect(examples.qualityRequirement).toBe('standard');
      expect(examples.priorityGoal).toBe('balanced');
      
      const validation = calculator.validateInputs(examples);
      expect(validation.isValid).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    test('should handle minimum thickness', async () => {
      const minInputs: PowerSpeedMatchingInputs = {
        materialType: 'aluminum',
        thickness: 0.1, // Minimum thickness
        laserType: 'fiber',
        maxPower: 1000,
        assistGas: 'nitrogen',
        qualityRequirement: 'standard',
        priorityGoal: 'speed'
      };

      const result = await calculator.calculate(minInputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.optimalSettings.power).toBeGreaterThan(0);
        expect(result.data.optimalSettings.speed).toBeGreaterThan(0);
      }
    });

    test('should handle maximum thickness', async () => {
      const maxInputs: PowerSpeedMatchingInputs = {
        materialType: 'steel',
        thickness: 50, // Maximum thickness
        laserType: 'fiber',
        maxPower: 15000,
        assistGas: 'oxygen',
        qualityRequirement: 'rough',
        priorityGoal: 'balanced'
      };

      const result = await calculator.calculate(maxInputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.optimalSettings.power).toBeGreaterThan(0);
        expect(result.data.warnings.length).toBeGreaterThan(0); // Should warn about thick material
      }
    });

    test('should handle high power utilization', async () => {
      const highPowerInputs: PowerSpeedMatchingInputs = {
        materialType: 'titanium',
        thickness: 15,
        laserType: 'fiber',
        maxPower: 2000, // Relatively low for thick titanium
        assistGas: 'argon',
        qualityRequirement: 'precision',
        priorityGoal: 'quality'
      };

      const result = await calculator.calculate(highPowerInputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.optimalSettings.powerPercentage).toBeGreaterThan(80);
        expect(result.data.warnings.some(w => w.includes('power'))).toBe(true);
      }
    });
  });

  describe('Performance', () => {
    test('should complete calculations within reasonable time', async () => {
      const inputs: PowerSpeedMatchingInputs = {
        materialType: 'steel',
        thickness: 5,
        laserType: 'fiber',
        maxPower: 3000,
        assistGas: 'oxygen',
        qualityRequirement: 'standard',
        priorityGoal: 'balanced'
      };

      const startTime = performance.now();
      const result = await calculator.calculate(inputs);
      const endTime = performance.now();
      
      expect(result.success).toBe(true);
      expect(endTime - startTime).toBeLessThan(100); // Should complete in <100ms
    });
  });
});
