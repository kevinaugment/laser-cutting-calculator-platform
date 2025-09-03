// Test suite for Tolerance Stack Calculator
// Comprehensive testing of tolerance stackup analysis and dimensional accuracy

import { describe, test, expect, beforeEach } from 'vitest';
import { ToleranceStackCalculator, ToleranceStackInputs } from '../ToleranceStackCalculator';

describe('ToleranceStackCalculator', () => {
  let calculator: ToleranceStackCalculator;

  beforeEach(() => {
    calculator = new ToleranceStackCalculator();
  });

  describe('Configuration', () => {
    test('should have correct calculator configuration', () => {
      expect(calculator.config.id).toBe('tolerance-stack-calculator');
      expect(calculator.config.title).toBe('Tolerance Stack Calculator');
      expect(calculator.config.category).toBe('Quality Control');
      expect(calculator.config.badge).toBe('Standard');
      expect(calculator.config.inputs).toHaveLength(9);
    });

    test('should have all required input fields', () => {
      const inputIds = calculator.config.inputs.map(input => input.id);
      expect(inputIds).toContain('materialType');
      expect(inputIds).toContain('partComplexity');
      expect(inputIds).toContain('numberOfFeatures');
      expect(inputIds).toContain('overallDimension');
      expect(inputIds).toContain('criticalDimension');
      expect(inputIds).toContain('toleranceClass');
      expect(inputIds).toContain('assemblyRequirement');
      expect(inputIds).toContain('measurementMethod');
      expect(inputIds).toContain('environmentalConditions');
    });
  });

  describe('Input Validation', () => {
    test('should validate correct inputs', () => {
      const validInputs: ToleranceStackInputs = {
        materialType: 'steel',
        partComplexity: 'moderate',
        numberOfFeatures: 8,
        overallDimension: 100,
        criticalDimension: 25,
        toleranceClass: 'precision',
        assemblyRequirement: 'standard_fit',
        measurementMethod: 'cmm',
        environmentalConditions: 'workshop'
      };

      const validation = calculator.validateInputs(validInputs);
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    test('should reject invalid material type', () => {
      const invalidInputs = {
        materialType: 'invalid_material',
        partComplexity: 'moderate',
        numberOfFeatures: 8,
        overallDimension: 100,
        criticalDimension: 25,
        toleranceClass: 'precision',
        assemblyRequirement: 'standard_fit',
        measurementMethod: 'cmm',
        environmentalConditions: 'workshop'
      };

      const validation = calculator.validateInputs(invalidInputs);
      expect(validation.isValid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
    });

    test('should warn about large critical dimension', () => {
      const largeInputs: ToleranceStackInputs = {
        materialType: 'steel',
        partComplexity: 'moderate',
        numberOfFeatures: 8,
        overallDimension: 100,
        criticalDimension: 90, // Very large relative to overall
        toleranceClass: 'precision',
        assemblyRequirement: 'standard_fit',
        measurementMethod: 'cmm',
        environmentalConditions: 'workshop'
      };

      const validation = calculator.validateInputs(largeInputs);
      expect(validation.warnings.some(w => w.code === 'LARGE_CRITICAL_DIMENSION')).toBe(true);
    });

    test('should warn about tolerance-complexity mismatch', () => {
      const mismatchInputs: ToleranceStackInputs = {
        materialType: 'steel',
        partComplexity: 'highly_complex',
        numberOfFeatures: 30,
        overallDimension: 100,
        criticalDimension: 25,
        toleranceClass: 'rough', // Too loose for complex part
        assemblyRequirement: 'standard_fit',
        measurementMethod: 'cmm',
        environmentalConditions: 'workshop'
      };

      const validation = calculator.validateInputs(mismatchInputs);
      expect(validation.warnings.some(w => w.code === 'TOLERANCE_COMPLEXITY_MISMATCH')).toBe(true);
    });

    test('should warn about measurement-precision mismatch', () => {
      const mismatchInputs: ToleranceStackInputs = {
        materialType: 'steel',
        partComplexity: 'moderate',
        numberOfFeatures: 8,
        overallDimension: 100,
        criticalDimension: 25,
        toleranceClass: 'ultra_precision',
        assemblyRequirement: 'standard_fit',
        measurementMethod: 'manual', // Not adequate for ultra precision
        environmentalConditions: 'workshop'
      };

      const validation = calculator.validateInputs(mismatchInputs);
      expect(validation.warnings.some(w => w.code === 'MEASUREMENT_PRECISION_MISMATCH')).toBe(true);
    });
  });

  describe('Tolerance Stack Analysis', () => {
    test('should analyze tolerance stackup for standard part', async () => {
      const inputs: ToleranceStackInputs = {
        materialType: 'steel',
        partComplexity: 'moderate',
        numberOfFeatures: 8,
        overallDimension: 100,
        criticalDimension: 25,
        toleranceClass: 'precision',
        assemblyRequirement: 'standard_fit',
        measurementMethod: 'cmm',
        environmentalConditions: 'workshop'
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.toleranceAnalysis).toBeDefined();
        expect(result.data.toleranceAnalysis.totalStackup).toBeGreaterThan(0);
        expect(result.data.toleranceAnalysis.worstCaseStackup).toBeGreaterThan(result.data.toleranceAnalysis.statisticalStackup);
        expect(result.data.toleranceAnalysis.confidenceLevel).toBeGreaterThanOrEqual(95);
        expect(result.data.toleranceAnalysis.stackupMethod).toMatch(/Statistical|Worst Case/);
      }
    });

    test('should analyze dimensional chain', async () => {
      const inputs: ToleranceStackInputs = {
        materialType: 'aluminum',
        partComplexity: 'complex',
        numberOfFeatures: 15,
        overallDimension: 200,
        criticalDimension: 50,
        toleranceClass: 'standard',
        assemblyRequirement: 'precision_fit',
        measurementMethod: 'optical',
        environmentalConditions: 'controlled'
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.dimensionalChain).toBeDefined();
        expect(result.data.dimensionalChain.chainLength).toBe(200);
        expect(result.data.dimensionalChain.contributingDimensions).toBeGreaterThan(0);
        expect(Array.isArray(result.data.dimensionalChain.criticalPath)).toBe(true);
        expect(result.data.dimensionalChain.weakestLink).toBeDefined();
        expect(result.data.dimensionalChain.chainEfficiency).toBeGreaterThan(0);
        expect(result.data.dimensionalChain.chainEfficiency).toBeLessThanOrEqual(1);
      }
    });

    test('should predict accuracy correctly', async () => {
      const inputs: ToleranceStackInputs = {
        materialType: 'titanium',
        partComplexity: 'simple',
        numberOfFeatures: 3,
        overallDimension: 50,
        criticalDimension: 10,
        toleranceClass: 'ultra_precision',
        assemblyRequirement: 'precision_fit',
        measurementMethod: 'laser_scanning',
        environmentalConditions: 'controlled'
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.accuracyPrediction).toBeDefined();
        expect(result.data.accuracyPrediction.expectedAccuracy).toBeGreaterThan(0);
        expect(result.data.accuracyPrediction.achievableAccuracy).toBeGreaterThanOrEqual(result.data.accuracyPrediction.expectedAccuracy);
        expect(result.data.accuracyPrediction.accuracyGrade).toMatch(/excellent|good|acceptable|poor/);
        expect(result.data.accuracyPrediction.processCapability).toBeGreaterThan(0);
        expect(result.data.accuracyPrediction.yieldPrediction).toBeGreaterThanOrEqual(0);
        expect(result.data.accuracyPrediction.yieldPrediction).toBeLessThanOrEqual(100);
      }
    });

    test('should calculate tolerance allocation', async () => {
      const inputs: ToleranceStackInputs = {
        materialType: 'brass',
        partComplexity: 'moderate',
        numberOfFeatures: 12,
        overallDimension: 150,
        criticalDimension: 40,
        toleranceClass: 'precision',
        assemblyRequirement: 'loose_fit',
        measurementMethod: 'cmm',
        environmentalConditions: 'workshop'
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.toleranceAllocation).toBeDefined();
        expect(result.data.toleranceAllocation.featureTolerance).toBeGreaterThan(0);
        expect(result.data.toleranceAllocation.cumulativeError).toBeGreaterThan(0);
        expect(result.data.toleranceAllocation.safetyFactor).toBeGreaterThan(1);
        expect(result.data.toleranceAllocation.allocationStrategy).toBeDefined();
        expect(result.data.toleranceAllocation.optimizationPotential).toBeGreaterThanOrEqual(0);
      }
    });

    test('should assess quality control requirements', async () => {
      const inputs: ToleranceStackInputs = {
        materialType: 'stainless_steel',
        partComplexity: 'complex',
        numberOfFeatures: 20,
        overallDimension: 300,
        criticalDimension: 75,
        toleranceClass: 'standard',
        assemblyRequirement: 'standard_fit',
        measurementMethod: 'cmm',
        environmentalConditions: 'workshop'
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.qualityControl).toBeDefined();
        expect(result.data.qualityControl.measurementUncertainty).toBeGreaterThan(0);
        expect(result.data.qualityControl.inspectionStrategy).toBeDefined();
        expect(result.data.qualityControl.samplingPlan).toBeDefined();
        expect(result.data.qualityControl.controlLimits.upper).toBeGreaterThan(result.data.qualityControl.controlLimits.lower);
        expect(Array.isArray(result.data.qualityControl.spcRecommendations)).toBe(true);
      }
    });

    test('should assess risks correctly', async () => {
      const inputs: ToleranceStackInputs = {
        materialType: 'copper',
        partComplexity: 'highly_complex',
        numberOfFeatures: 35,
        overallDimension: 500,
        criticalDimension: 125,
        toleranceClass: 'ultra_precision',
        assemblyRequirement: 'interference_fit',
        measurementMethod: 'optical',
        environmentalConditions: 'harsh'
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.riskAssessment).toBeDefined();
        expect(result.data.riskAssessment.riskLevel).toMatch(/low|medium|high|critical/);
        expect(result.data.riskAssessment.riskScore).toBeGreaterThanOrEqual(0);
        expect(result.data.riskAssessment.riskScore).toBeLessThanOrEqual(10);
        expect(Array.isArray(result.data.riskAssessment.riskFactors)).toBe(true);
        expect(Array.isArray(result.data.riskAssessment.mitigationStrategies)).toBe(true);
      }
    });

    test('should show complexity effects on tolerance stackup', async () => {
      const simpleInputs: ToleranceStackInputs = {
        materialType: 'steel',
        partComplexity: 'simple',
        numberOfFeatures: 3,
        overallDimension: 100,
        criticalDimension: 25,
        toleranceClass: 'precision',
        assemblyRequirement: 'standard_fit',
        measurementMethod: 'cmm',
        environmentalConditions: 'workshop'
      };

      const complexInputs: ToleranceStackInputs = {
        ...simpleInputs,
        partComplexity: 'highly_complex',
        numberOfFeatures: 30
      };

      const simpleResult = await calculator.calculate(simpleInputs);
      const complexResult = await calculator.calculate(complexInputs);
      
      expect(simpleResult.success).toBe(true);
      expect(complexResult.success).toBe(true);
      
      if (simpleResult.data && complexResult.data) {
        // Complex parts should have higher risk and lower chain efficiency
        expect(complexResult.data.riskAssessment.riskScore).toBeGreaterThan(simpleResult.data.riskAssessment.riskScore);
        expect(complexResult.data.dimensionalChain.chainEfficiency).toBeLessThan(simpleResult.data.dimensionalChain.chainEfficiency);
        expect(complexResult.data.toleranceAnalysis.totalStackup).toBeGreaterThan(simpleResult.data.toleranceAnalysis.totalStackup);
      }
    });

    test('should show tolerance class effects', async () => {
      const roughInputs: ToleranceStackInputs = {
        materialType: 'steel',
        partComplexity: 'moderate',
        numberOfFeatures: 8,
        overallDimension: 100,
        criticalDimension: 25,
        toleranceClass: 'rough',
        assemblyRequirement: 'standard_fit',
        measurementMethod: 'cmm',
        environmentalConditions: 'workshop'
      };

      const precisionInputs: ToleranceStackInputs = {
        ...roughInputs,
        toleranceClass: 'ultra_precision'
      };

      const roughResult = await calculator.calculate(roughInputs);
      const precisionResult = await calculator.calculate(precisionInputs);
      
      expect(roughResult.success).toBe(true);
      expect(precisionResult.success).toBe(true);
      
      if (roughResult.data && precisionResult.data) {
        // Precision class should have better accuracy and higher process capability
        expect(precisionResult.data.accuracyPrediction.expectedAccuracy).toBeLessThan(roughResult.data.accuracyPrediction.expectedAccuracy);
        expect(precisionResult.data.accuracyPrediction.processCapability).toBeGreaterThan(roughResult.data.accuracyPrediction.processCapability);
      }
    });

    test('should include calculation metadata', async () => {
      const inputs: ToleranceStackInputs = {
        materialType: 'steel',
        partComplexity: 'moderate',
        numberOfFeatures: 8,
        overallDimension: 100,
        criticalDimension: 25,
        toleranceClass: 'precision',
        assemblyRequirement: 'standard_fit',
        measurementMethod: 'cmm',
        environmentalConditions: 'workshop'
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

  describe('Risk Level Classification', () => {
    test('should classify low risk correctly', async () => {
      const lowRiskInputs: ToleranceStackInputs = {
        materialType: 'steel',
        partComplexity: 'simple',
        numberOfFeatures: 3,
        overallDimension: 50,
        criticalDimension: 10,
        toleranceClass: 'standard',
        assemblyRequirement: 'loose_fit',
        measurementMethod: 'cmm',
        environmentalConditions: 'controlled'
      };

      const result = await calculator.calculate(lowRiskInputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.riskAssessment.riskLevel).toMatch(/low|medium/);
        expect(result.data.riskAssessment.riskScore).toBeLessThan(6);
      }
    });

    test('should classify high risk correctly', async () => {
      const highRiskInputs: ToleranceStackInputs = {
        materialType: 'aluminum', // Lower dimensional stability
        partComplexity: 'highly_complex',
        numberOfFeatures: 40,
        overallDimension: 500,
        criticalDimension: 125,
        toleranceClass: 'ultra_precision',
        assemblyRequirement: 'interference_fit',
        measurementMethod: 'manual',
        environmentalConditions: 'harsh'
      };

      const result = await calculator.calculate(highRiskInputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.riskAssessment.riskLevel).toMatch(/high|critical/);
        expect(result.data.riskAssessment.riskScore).toBeGreaterThan(6);
        expect(result.data.warnings.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Material-Specific Behavior', () => {
    test('should handle different materials correctly', async () => {
      const materials: ToleranceStackInputs['materialType'][] = ['steel', 'aluminum', 'titanium', 'copper'];
      
      for (const material of materials) {
        const inputs: ToleranceStackInputs = {
          materialType: material,
          partComplexity: 'moderate',
          numberOfFeatures: 8,
          overallDimension: 100,
          criticalDimension: 25,
          toleranceClass: 'precision',
          assemblyRequirement: 'standard_fit',
          measurementMethod: 'cmm',
          environmentalConditions: 'workshop'
        };

        const result = await calculator.calculate(inputs);
        
        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        
        if (result.data) {
          expect(result.data.accuracyPrediction.expectedAccuracy).toBeGreaterThan(0);
          expect(result.data.toleranceAnalysis.totalStackup).toBeGreaterThan(0);
        }
      }
    });

    test('should show material stability effects', async () => {
      const steelInputs: ToleranceStackInputs = {
        materialType: 'steel', // Good dimensional stability
        partComplexity: 'moderate',
        numberOfFeatures: 8,
        overallDimension: 100,
        criticalDimension: 25,
        toleranceClass: 'precision',
        assemblyRequirement: 'standard_fit',
        measurementMethod: 'cmm',
        environmentalConditions: 'workshop'
      };

      const aluminumInputs: ToleranceStackInputs = {
        ...steelInputs,
        materialType: 'aluminum' // Lower dimensional stability
      };

      const steelResult = await calculator.calculate(steelInputs);
      const aluminumResult = await calculator.calculate(aluminumInputs);
      
      expect(steelResult.success).toBe(true);
      expect(aluminumResult.success).toBe(true);
      
      if (steelResult.data && aluminumResult.data) {
        // Steel should have better dimensional stability
        expect(steelResult.data.dimensionalChain.chainEfficiency).toBeGreaterThan(aluminumResult.data.dimensionalChain.chainEfficiency);
      }
    });
  });

  describe('Default and Example Inputs', () => {
    test('should provide valid default inputs', () => {
      const defaults = calculator.getDefaultInputs();
      
      expect(defaults.materialType).toBeDefined();
      expect(defaults.partComplexity).toBeDefined();
      expect(defaults.numberOfFeatures).toBeGreaterThan(0);
      expect(defaults.overallDimension).toBeGreaterThan(0);
      expect(defaults.criticalDimension).toBeGreaterThan(0);
      expect(defaults.toleranceClass).toBeDefined();
      expect(defaults.assemblyRequirement).toBeDefined();
      expect(defaults.measurementMethod).toBeDefined();
      expect(defaults.environmentalConditions).toBeDefined();
      
      const validation = calculator.validateInputs(defaults);
      expect(validation.isValid).toBe(true);
    });

    test('should provide valid example inputs', () => {
      const examples = calculator.getExampleInputs();
      
      expect(examples.materialType).toBe('steel');
      expect(examples.partComplexity).toBe('moderate');
      expect(examples.numberOfFeatures).toBe(8);
      expect(examples.overallDimension).toBe(100);
      expect(examples.criticalDimension).toBe(25);
      expect(examples.toleranceClass).toBe('precision');
      expect(examples.assemblyRequirement).toBe('standard_fit');
      expect(examples.measurementMethod).toBe('cmm');
      expect(examples.environmentalConditions).toBe('workshop');
      
      const validation = calculator.validateInputs(examples);
      expect(validation.isValid).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    test('should handle minimum features', async () => {
      const minInputs: ToleranceStackInputs = {
        materialType: 'steel',
        partComplexity: 'simple',
        numberOfFeatures: 1, // Minimum features
        overallDimension: 10,
        criticalDimension: 5,
        toleranceClass: 'standard',
        assemblyRequirement: 'none',
        measurementMethod: 'manual',
        environmentalConditions: 'workshop'
      };

      const result = await calculator.calculate(minInputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.toleranceAnalysis.totalStackup).toBeGreaterThan(0);
        expect(result.data.dimensionalChain.contributingDimensions).toBeGreaterThanOrEqual(1);
      }
    });

    test('should handle maximum features', async () => {
      const maxInputs: ToleranceStackInputs = {
        materialType: 'steel',
        partComplexity: 'highly_complex',
        numberOfFeatures: 50, // Maximum features
        overallDimension: 1000,
        criticalDimension: 250,
        toleranceClass: 'rough',
        assemblyRequirement: 'loose_fit',
        measurementMethod: 'laser_scanning',
        environmentalConditions: 'field'
      };

      const result = await calculator.calculate(maxInputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.toleranceAnalysis.stackupMethod).toBe('Statistical (RSS)');
        expect(result.data.riskAssessment.riskScore).toBeGreaterThan(5); // High feature count should increase risk
      }
    });

    test('should handle harsh environmental conditions', async () => {
      const harshInputs: ToleranceStackInputs = {
        materialType: 'titanium',
        partComplexity: 'complex',
        numberOfFeatures: 15,
        overallDimension: 200,
        criticalDimension: 50,
        toleranceClass: 'ultra_precision',
        assemblyRequirement: 'precision_fit',
        measurementMethod: 'optical',
        environmentalConditions: 'harsh'
      };

      const result = await calculator.calculate(harshInputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.toleranceAnalysis.totalStackup).toBeGreaterThan(0);
        expect(result.data.warnings.some(w => w.includes('harsh'))).toBe(true);
      }
    });
  });

  describe('Performance', () => {
    test('should complete calculations within reasonable time', async () => {
      const inputs: ToleranceStackInputs = {
        materialType: 'steel',
        partComplexity: 'moderate',
        numberOfFeatures: 8,
        overallDimension: 100,
        criticalDimension: 25,
        toleranceClass: 'precision',
        assemblyRequirement: 'standard_fit',
        measurementMethod: 'cmm',
        environmentalConditions: 'workshop'
      };

      const startTime = performance.now();
      const result = await calculator.calculate(inputs);
      const endTime = performance.now();
      
      expect(result.success).toBe(true);
      expect(endTime - startTime).toBeLessThan(100); // Should complete in <100ms
    });
  });
});
