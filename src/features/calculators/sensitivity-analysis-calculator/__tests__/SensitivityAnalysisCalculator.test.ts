// Test suite for Sensitivity Analysis Calculator
// Comprehensive testing of parameter sensitivity analysis and optimization insights

import { describe, test, expect, beforeEach } from 'vitest';
import { SensitivityAnalysisCalculator, SensitivityAnalysisInputs } from '../SensitivityAnalysisCalculator';

describe('SensitivityAnalysisCalculator', () => {
  let calculator: SensitivityAnalysisCalculator;

  beforeEach(() => {
    calculator = new SensitivityAnalysisCalculator();
  });

  describe('Configuration', () => {
    test('should have correct calculator configuration', () => {
      expect(calculator.config.id).toBe('sensitivity-analysis-calculator');
      expect(calculator.config.title).toBe('Sensitivity Analysis Calculator');
      expect(calculator.config.category).toBe('Advanced Analysis');
      expect(calculator.config.badge).toBe('Premium');
      expect(calculator.config.inputs).toHaveLength(10);
    });

    test('should have all required input fields', () => {
      const inputIds = calculator.config.inputs.map(input => input.id);
      expect(inputIds).toContain('materialType');
      expect(inputIds).toContain('thickness');
      expect(inputIds).toContain('laserPower');
      expect(inputIds).toContain('cuttingSpeed');
      expect(inputIds).toContain('gasPressure');
      expect(inputIds).toContain('focusHeight');
      expect(inputIds).toContain('analysisType');
      expect(inputIds).toContain('outputMetric');
      expect(inputIds).toContain('variationRange');
      expect(inputIds).toContain('analysisPoints');
    });
  });

  describe('Input Validation', () => {
    test('should validate correct inputs', () => {
      const validInputs: SensitivityAnalysisInputs = {
        materialType: 'steel',
        thickness: 5,
        laserPower: 2000,
        cuttingSpeed: 3000,
        gasPressure: 15,
        focusHeight: -2,
        analysisType: 'multi_parameter',
        outputMetric: 'cost',
        variationRange: 20,
        analysisPoints: 15
      };

      const validation = calculator.validateInputs(validInputs);
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    test('should reject invalid material type', () => {
      const invalidInputs = {
        materialType: 'invalid_material',
        thickness: 5,
        laserPower: 2000,
        cuttingSpeed: 3000,
        gasPressure: 15,
        focusHeight: -2,
        analysisType: 'multi_parameter',
        outputMetric: 'cost',
        variationRange: 20,
        analysisPoints: 15
      };

      const validation = calculator.validateInputs(invalidInputs);
      expect(validation.isValid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
    });

    test('should warn about high computation complexity', () => {
      const highComplexityInputs: SensitivityAnalysisInputs = {
        materialType: 'steel',
        thickness: 5,
        laserPower: 2000,
        cuttingSpeed: 3000,
        gasPressure: 15,
        focusHeight: -2,
        analysisType: 'monte_carlo',
        outputMetric: 'cost',
        variationRange: 20,
        analysisPoints: 40 // High number of points
      };

      const validation = calculator.validateInputs(highComplexityInputs);
      expect(validation.warnings.some(w => w.code === 'HIGH_COMPUTATION_COMPLEXITY')).toBe(true);
    });

    test('should warn about large variation range', () => {
      const largeRangeInputs: SensitivityAnalysisInputs = {
        materialType: 'steel',
        thickness: 5,
        laserPower: 2000,
        cuttingSpeed: 3000,
        gasPressure: 15,
        focusHeight: -2,
        analysisType: 'multi_parameter',
        outputMetric: 'cost',
        variationRange: 40, // Large variation range
        analysisPoints: 15
      };

      const validation = calculator.validateInputs(largeRangeInputs);
      expect(validation.warnings.some(w => w.code === 'LARGE_VARIATION_RANGE')).toBe(true);
    });

    test('should warn about unusual power-speed ratio', () => {
      const unusualRatioInputs: SensitivityAnalysisInputs = {
        materialType: 'steel',
        thickness: 5,
        laserPower: 500, // Low power
        cuttingSpeed: 8000, // High speed
        gasPressure: 15,
        focusHeight: -2,
        analysisType: 'multi_parameter',
        outputMetric: 'cost',
        variationRange: 20,
        analysisPoints: 15
      };

      const validation = calculator.validateInputs(unusualRatioInputs);
      expect(validation.warnings.some(w => w.code === 'UNUSUAL_POWER_SPEED_RATIO')).toBe(true);
    });
  });

  describe('Sensitivity Analysis', () => {
    test('should perform comprehensive sensitivity analysis', async () => {
      const inputs: SensitivityAnalysisInputs = {
        materialType: 'steel',
        thickness: 5,
        laserPower: 2000,
        cuttingSpeed: 3000,
        gasPressure: 15,
        focusHeight: -2,
        analysisType: 'multi_parameter',
        outputMetric: 'cost',
        variationRange: 20,
        analysisPoints: 15
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.analysisOverview).toBeDefined();
        expect(result.data.analysisOverview.analysisType).toBe('multi_parameter');
        expect(result.data.analysisOverview.outputMetric).toBe('cost');
        expect(result.data.analysisOverview.parametersAnalyzed).toBeGreaterThan(0);
        expect(result.data.analysisOverview.totalScenarios).toBeGreaterThan(0);
        expect(result.data.analysisOverview.analysisTime).toBeGreaterThan(0);
        expect(result.data.analysisOverview.confidence).toBeGreaterThan(0.5);
      }
    });

    test('should analyze parameter sensitivity correctly', async () => {
      const inputs: SensitivityAnalysisInputs = {
        materialType: 'aluminum',
        thickness: 3,
        laserPower: 1500,
        cuttingSpeed: 4000,
        gasPressure: 12,
        focusHeight: -1,
        analysisType: 'single_parameter',
        outputMetric: 'time',
        variationRange: 15,
        analysisPoints: 10
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.parameterSensitivity).toBeDefined();
        expect(Array.isArray(result.data.parameterSensitivity)).toBe(true);
        expect(result.data.parameterSensitivity.length).toBeGreaterThan(0);
        
        result.data.parameterSensitivity.forEach(param => {
          expect(param.parameter).toBeDefined();
          expect(param.baseValue).toBeGreaterThan(0);
          expect(param.unit).toBeDefined();
          expect(param.sensitivity).toBeGreaterThanOrEqual(0);
          expect(param.elasticity).toBeDefined();
          expect(param.impact).toMatch(/low|medium|high|critical/);
          expect(param.ranking).toBeGreaterThan(0);
          expect(Array.isArray(param.variationData)).toBe(true);
          expect(param.variationData.length).toBe(inputs.analysisPoints);
        });
        
        // Check that parameters are ranked by sensitivity
        const sensitivities = result.data.parameterSensitivity.map(p => p.sensitivity);
        const sortedSensitivities = [...sensitivities].sort((a, b) => b - a);
        expect(sensitivities).toEqual(sortedSensitivities);
      }
    });

    test('should generate tornado chart data', async () => {
      const inputs: SensitivityAnalysisInputs = {
        materialType: 'stainless_steel',
        thickness: 8,
        laserPower: 3000,
        cuttingSpeed: 2000,
        gasPressure: 18,
        focusHeight: -3,
        analysisType: 'tornado',
        outputMetric: 'quality',
        variationRange: 25,
        analysisPoints: 12
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.tornadoChart).toBeDefined();
        expect(result.data.tornadoChart.baselineOutput).toBeGreaterThan(0);
        expect(Array.isArray(result.data.tornadoChart.parameters)).toBe(true);
        
        result.data.tornadoChart.parameters.forEach(param => {
          expect(param.name).toBeDefined();
          expect(param.lowImpact).toBeDefined();
          expect(param.highImpact).toBeDefined();
          expect(param.range).toBeGreaterThanOrEqual(0);
          expect(param.relativeRange).toBeDefined();
        });
        
        // Check that parameters are sorted by range (descending)
        const ranges = result.data.tornadoChart.parameters.map(p => p.range);
        const sortedRanges = [...ranges].sort((a, b) => b - a);
        expect(ranges).toEqual(sortedRanges);
      }
    });

    test('should generate spider chart data', async () => {
      const inputs: SensitivityAnalysisInputs = {
        materialType: 'copper',
        thickness: 4,
        laserPower: 2500,
        cuttingSpeed: 2500,
        gasPressure: 20,
        focusHeight: -2,
        analysisType: 'multi_parameter',
        outputMetric: 'efficiency',
        variationRange: 20,
        analysisPoints: 15
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.spiderChart).toBeDefined();
        expect(Array.isArray(result.data.spiderChart.parameters)).toBe(true);
        expect(Array.isArray(result.data.spiderChart.scenarios)).toBe(true);
        
        result.data.spiderChart.scenarios.forEach(scenario => {
          expect(scenario.name).toBeDefined();
          expect(Array.isArray(scenario.values)).toBe(true);
          expect(scenario.values.length).toBe(result.data.spiderChart.parameters.length);
          
          // Check that values are normalized (0-1 range)
          scenario.values.forEach(value => {
            expect(value).toBeGreaterThanOrEqual(0);
            expect(value).toBeLessThanOrEqual(1);
          });
        });
      }
    });

    test('should analyze interaction effects', async () => {
      const inputs: SensitivityAnalysisInputs = {
        materialType: 'titanium',
        thickness: 6,
        laserPower: 2200,
        cuttingSpeed: 1800,
        gasPressure: 16,
        focusHeight: -2.5,
        analysisType: 'multi_parameter',
        outputMetric: 'cost',
        variationRange: 20,
        analysisPoints: 15
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.interactionEffects).toBeDefined();
        expect(Array.isArray(result.data.interactionEffects)).toBe(true);
        
        result.data.interactionEffects.forEach(interaction => {
          expect(interaction.parameter1).toBeDefined();
          expect(interaction.parameter2).toBeDefined();
          expect(interaction.interactionStrength).toBeGreaterThanOrEqual(0);
          expect(interaction.interactionStrength).toBeLessThanOrEqual(1);
          expect(typeof interaction.synergistic).toBe('boolean');
          expect(interaction.description).toBeDefined();
        });
      }
    });

    test('should perform risk analysis', async () => {
      const inputs: SensitivityAnalysisInputs = {
        materialType: 'brass',
        thickness: 7,
        laserPower: 1800,
        cuttingSpeed: 3500,
        gasPressure: 14,
        focusHeight: -2.2,
        analysisType: 'multi_parameter',
        outputMetric: 'all',
        variationRange: 30,
        analysisPoints: 20
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.riskAnalysis).toBeDefined();
        expect(Array.isArray(result.data.riskAnalysis.criticalParameters)).toBe(true);
        expect(Array.isArray(result.data.riskAnalysis.riskFactors)).toBe(true);
        expect(result.data.riskAnalysis.robustness).toBeGreaterThanOrEqual(0);
        expect(result.data.riskAnalysis.robustness).toBeLessThanOrEqual(100);
        
        result.data.riskAnalysis.riskFactors.forEach(risk => {
          expect(risk.parameter).toBeDefined();
          expect(risk.riskLevel).toMatch(/low|medium|high/);
          expect(risk.description).toBeDefined();
          expect(risk.mitigation).toBeDefined();
        });
      }
    });

    test('should generate optimization insights', async () => {
      const inputs: SensitivityAnalysisInputs = {
        materialType: 'steel',
        thickness: 10,
        laserPower: 4000,
        cuttingSpeed: 1500,
        gasPressure: 22,
        focusHeight: -4,
        analysisType: 'multi_parameter',
        outputMetric: 'cost',
        variationRange: 25,
        analysisPoints: 18
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.optimizationInsights).toBeDefined();
        expect(result.data.optimizationInsights.mostInfluential).toBeDefined();
        expect(result.data.optimizationInsights.leastInfluential).toBeDefined();
        expect(Array.isArray(result.data.optimizationInsights.recommendations)).toBe(true);
        expect(Array.isArray(result.data.optimizationInsights.parameterRanking)).toBe(true);
        
        result.data.optimizationInsights.parameterRanking.forEach(ranking => {
          expect(ranking.parameter).toBeDefined();
          expect(ranking.importance).toBeGreaterThanOrEqual(0);
          expect(ranking.importance).toBeLessThanOrEqual(100);
          expect(ranking.controlPriority).toMatch(/high|medium|low/);
        });
      }
    });

    test('should show different output metrics produce different results', async () => {
      const baseInputs: SensitivityAnalysisInputs = {
        materialType: 'aluminum',
        thickness: 5,
        laserPower: 2000,
        cuttingSpeed: 3000,
        gasPressure: 15,
        focusHeight: -2,
        analysisType: 'multi_parameter',
        variationRange: 20,
        analysisPoints: 15,
        outputMetric: 'cost'
      };

      const costResult = await calculator.calculate(baseInputs);
      const timeResult = await calculator.calculate({
        ...baseInputs,
        outputMetric: 'time'
      });
      
      expect(costResult.success).toBe(true);
      expect(timeResult.success).toBe(true);
      
      if (costResult.data && timeResult.data) {
        // Different metrics should produce different sensitivity rankings
        const costRanking = costResult.data.parameterSensitivity.map(p => p.parameter);
        const timeRanking = timeResult.data.parameterSensitivity.map(p => p.parameter);
        
        // At least some parameters should have different rankings
        let differentRankings = false;
        for (let i = 0; i < Math.min(costRanking.length, timeRanking.length); i++) {
          if (costRanking[i] !== timeRanking[i]) {
            differentRankings = true;
            break;
          }
        }
        expect(differentRankings).toBe(true);
      }
    });

    test('should include calculation metadata', async () => {
      const inputs: SensitivityAnalysisInputs = {
        materialType: 'steel',
        thickness: 5,
        laserPower: 2000,
        cuttingSpeed: 3000,
        gasPressure: 15,
        focusHeight: -2,
        analysisType: 'multi_parameter',
        outputMetric: 'cost',
        variationRange: 20,
        analysisPoints: 15
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

  describe('Analysis Types', () => {
    test('should handle different analysis types correctly', async () => {
      const analysisTypes: SensitivityAnalysisInputs['analysisType'][] = ['single_parameter', 'multi_parameter', 'monte_carlo', 'tornado'];
      
      for (const analysisType of analysisTypes) {
        const inputs: SensitivityAnalysisInputs = {
          materialType: 'steel',
          thickness: 5,
          laserPower: 2000,
          cuttingSpeed: 3000,
          gasPressure: 15,
          focusHeight: -2,
          analysisType,
          outputMetric: 'cost',
          variationRange: 20,
          analysisPoints: 10
        };

        const result = await calculator.calculate(inputs);
        
        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        
        if (result.data) {
          expect(result.data.analysisOverview.analysisType).toBe(analysisType);
          expect(result.data.parameterSensitivity.length).toBeGreaterThan(0);
        }
      }
    });
  });

  describe('Material-Specific Behavior', () => {
    test('should handle different materials correctly', async () => {
      const materials: SensitivityAnalysisInputs['materialType'][] = ['steel', 'aluminum', 'stainless_steel', 'copper', 'titanium', 'brass'];
      
      for (const material of materials) {
        const inputs: SensitivityAnalysisInputs = {
          materialType: material,
          thickness: 5,
          laserPower: 2000,
          cuttingSpeed: 3000,
          gasPressure: 15,
          focusHeight: -2,
          analysisType: 'multi_parameter',
          outputMetric: 'cost',
          variationRange: 20,
          analysisPoints: 10
        };

        const result = await calculator.calculate(inputs);
        
        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        
        if (result.data) {
          expect(result.data.parameterSensitivity.length).toBeGreaterThan(0);
          expect(result.data.tornadoChart.baselineOutput).toBeGreaterThan(0);
        }
      }
    });
  });

  describe('Default and Example Inputs', () => {
    test('should provide valid default inputs', () => {
      const defaults = calculator.getDefaultInputs();
      
      expect(defaults.materialType).toBeDefined();
      expect(defaults.thickness).toBeGreaterThan(0);
      expect(defaults.laserPower).toBeGreaterThan(0);
      expect(defaults.cuttingSpeed).toBeGreaterThan(0);
      expect(defaults.gasPressure).toBeGreaterThan(0);
      expect(defaults.focusHeight).toBeDefined();
      expect(defaults.analysisType).toBeDefined();
      expect(defaults.outputMetric).toBeDefined();
      expect(defaults.variationRange).toBeGreaterThan(0);
      expect(defaults.analysisPoints).toBeGreaterThan(0);
      
      const validation = calculator.validateInputs(defaults);
      expect(validation.isValid).toBe(true);
    });

    test('should provide valid example inputs', () => {
      const examples = calculator.getExampleInputs();
      
      expect(examples.materialType).toBe('steel');
      expect(examples.thickness).toBe(5);
      expect(examples.laserPower).toBe(2000);
      expect(examples.cuttingSpeed).toBe(3000);
      expect(examples.gasPressure).toBe(15);
      expect(examples.focusHeight).toBe(-2);
      expect(examples.analysisType).toBe('multi_parameter');
      expect(examples.outputMetric).toBe('cost');
      expect(examples.variationRange).toBe(20);
      expect(examples.analysisPoints).toBe(15);
      
      const validation = calculator.validateInputs(examples);
      expect(validation.isValid).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    test('should handle minimum variation range', async () => {
      const minInputs: SensitivityAnalysisInputs = {
        materialType: 'aluminum',
        thickness: 2,
        laserPower: 1000,
        cuttingSpeed: 2000,
        gasPressure: 10,
        focusHeight: -1,
        analysisType: 'single_parameter',
        outputMetric: 'time',
        variationRange: 5, // Minimum range
        analysisPoints: 5 // Minimum points
      };

      const result = await calculator.calculate(minInputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.parameterSensitivity.length).toBeGreaterThan(0);
        result.data.parameterSensitivity.forEach(param => {
          expect(param.variationData.length).toBe(5);
        });
      }
    });

    test('should handle maximum variation range', async () => {
      const maxInputs: SensitivityAnalysisInputs = {
        materialType: 'steel',
        thickness: 20,
        laserPower: 5000,
        cuttingSpeed: 1000,
        gasPressure: 25,
        focusHeight: -5,
        analysisType: 'multi_parameter',
        outputMetric: 'quality',
        variationRange: 50, // Maximum range
        analysisPoints: 25
      };

      const result = await calculator.calculate(maxInputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.warnings.length).toBeGreaterThan(0); // Should warn about large range
        expect(result.data.parameterSensitivity.length).toBeGreaterThan(0);
      }
    });

    test('should handle extreme parameter values', async () => {
      const extremeInputs: SensitivityAnalysisInputs = {
        materialType: 'copper',
        thickness: 0.5, // Very thin
        laserPower: 20000, // Very high power
        cuttingSpeed: 15000, // Very high speed
        gasPressure: 0.5, // Very low pressure
        focusHeight: 8, // High positive focus
        analysisType: 'tornado',
        outputMetric: 'efficiency',
        variationRange: 15,
        analysisPoints: 12
      };

      const result = await calculator.calculate(extremeInputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.parameterSensitivity.length).toBeGreaterThan(0);
        expect(result.data.warnings.length).toBeGreaterThan(0); // Should have warnings
      }
    });
  });

  describe('Performance', () => {
    test('should complete calculations within reasonable time', async () => {
      const inputs: SensitivityAnalysisInputs = {
        materialType: 'steel',
        thickness: 5,
        laserPower: 2000,
        cuttingSpeed: 3000,
        gasPressure: 15,
        focusHeight: -2,
        analysisType: 'multi_parameter',
        outputMetric: 'cost',
        variationRange: 20,
        analysisPoints: 15
      };

      const startTime = performance.now();
      const result = await calculator.calculate(inputs);
      const endTime = performance.now();
      
      expect(result.success).toBe(true);
      expect(endTime - startTime).toBeLessThan(1000); // Should complete in <1000ms
    });
  });
});
