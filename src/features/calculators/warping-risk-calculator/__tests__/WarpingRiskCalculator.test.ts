// Test suite for Warping Risk Calculator
// Comprehensive testing of warping risk analysis and thermal distortion calculations

import { describe, test, expect, beforeEach } from 'vitest';
import { WarpingRiskCalculator, WarpingRiskInputs } from '../WarpingRiskCalculator';

describe('WarpingRiskCalculator', () => {
  let calculator: WarpingRiskCalculator;

  beforeEach(() => {
    calculator = new WarpingRiskCalculator();
  });

  describe('Configuration', () => {
    test('should have correct calculator configuration', () => {
      expect(calculator.config.id).toBe('warping-risk-calculator');
      expect(calculator.config.title).toBe('Warping Risk Calculator');
      expect(calculator.config.category).toBe('Quality Control');
      expect(calculator.config.badge).toBe('Standard');
      expect(calculator.config.inputs).toHaveLength(10);
    });

    test('should have all required input fields', () => {
      const inputIds = calculator.config.inputs.map(input => input.id);
      expect(inputIds).toContain('materialType');
      expect(inputIds).toContain('thickness');
      expect(inputIds).toContain('length');
      expect(inputIds).toContain('width');
      expect(inputIds).toContain('laserPower');
      expect(inputIds).toContain('cuttingSpeed');
      expect(inputIds).toContain('numberOfPasses');
      expect(inputIds).toContain('supportType');
      expect(inputIds).toContain('coolingMethod');
      expect(inputIds).toContain('ambientTemperature');
    });
  });

  describe('Input Validation', () => {
    test('should validate correct inputs', () => {
      const validInputs: WarpingRiskInputs = {
        materialType: 'steel',
        thickness: 3,
        length: 500,
        width: 200,
        laserPower: 2000,
        cuttingSpeed: 2500,
        numberOfPasses: 1,
        supportType: 'moderate',
        coolingMethod: 'natural',
        ambientTemperature: 20
      };

      const validation = calculator.validateInputs(validInputs);
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    test('should reject invalid material type', () => {
      const invalidInputs = {
        materialType: 'invalid_material',
        thickness: 3,
        length: 500,
        width: 200,
        laserPower: 2000,
        cuttingSpeed: 2500,
        numberOfPasses: 1,
        supportType: 'moderate',
        coolingMethod: 'natural',
        ambientTemperature: 20
      };

      const validation = calculator.validateInputs(invalidInputs);
      expect(validation.isValid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
    });

    test('should reject dimensions out of range', () => {
      const invalidInputs: WarpingRiskInputs = {
        materialType: 'steel',
        thickness: 3,
        length: 5000, // Above max of 3000
        width: 200,
        laserPower: 2000,
        cuttingSpeed: 2500,
        numberOfPasses: 1,
        supportType: 'moderate',
        coolingMethod: 'natural',
        ambientTemperature: 20
      };

      const validation = calculator.validateInputs(invalidInputs);
      expect(validation.isValid).toBe(false);
      expect(validation.errors.some(e => e.field === 'length')).toBe(true);
    });

    test('should warn about high aspect ratio', () => {
      const highAspectRatioInputs: WarpingRiskInputs = {
        materialType: 'steel',
        thickness: 3,
        length: 2000, // High aspect ratio
        width: 100,   // 20:1 ratio
        laserPower: 2000,
        cuttingSpeed: 2500,
        numberOfPasses: 1,
        supportType: 'moderate',
        coolingMethod: 'natural',
        ambientTemperature: 20
      };

      const validation = calculator.validateInputs(highAspectRatioInputs);
      expect(validation.warnings.some(w => w.code === 'HIGH_ASPECT_RATIO')).toBe(true);
    });

    test('should warn about thin material', () => {
      const thinMaterialInputs: WarpingRiskInputs = {
        materialType: 'steel',
        thickness: 1,    // Very thin
        length: 1000,    // Large dimension
        width: 500,
        laserPower: 2000,
        cuttingSpeed: 2500,
        numberOfPasses: 1,
        supportType: 'moderate',
        coolingMethod: 'natural',
        ambientTemperature: 20
      };

      const validation = calculator.validateInputs(thinMaterialInputs);
      expect(validation.warnings.some(w => w.code === 'THIN_MATERIAL')).toBe(true);
    });

    test('should warn about inadequate support', () => {
      const inadequateSupportInputs: WarpingRiskInputs = {
        materialType: 'steel',
        thickness: 3,
        length: 1000,
        width: 100,    // High aspect ratio
        laserPower: 2000,
        cuttingSpeed: 2500,
        numberOfPasses: 1,
        supportType: 'none', // No support
        coolingMethod: 'natural',
        ambientTemperature: 20
      };

      const validation = calculator.validateInputs(inadequateSupportInputs);
      expect(validation.warnings.some(w => w.code === 'INADEQUATE_SUPPORT')).toBe(true);
    });
  });

  describe('Warping Risk Calculations', () => {
    test('should calculate warping risk for steel', async () => {
      const inputs: WarpingRiskInputs = {
        materialType: 'steel',
        thickness: 3,
        length: 500,
        width: 200,
        laserPower: 2000,
        cuttingSpeed: 2500,
        numberOfPasses: 1,
        supportType: 'moderate',
        coolingMethod: 'natural',
        ambientTemperature: 20
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.overallRiskScore).toBeGreaterThanOrEqual(0);
        expect(result.data.overallRiskScore).toBeLessThanOrEqual(10);
        expect(result.data.riskLevel).toMatch(/low|medium|high|critical/);
        expect(result.data.thermalAnalysis).toBeDefined();
        expect(result.data.mechanicalAnalysis).toBeDefined();
        expect(result.data.geometricFactors).toBeDefined();
      }
    });

    test('should calculate warping risk for aluminum', async () => {
      const inputs: WarpingRiskInputs = {
        materialType: 'aluminum',
        thickness: 5,
        length: 800,
        width: 300,
        laserPower: 3000,
        cuttingSpeed: 4000,
        numberOfPasses: 1,
        supportType: 'extensive',
        coolingMethod: 'forced',
        ambientTemperature: 20
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        // Aluminum should have higher warping risk due to high thermal expansion
        expect(result.data.overallRiskScore).toBeGreaterThan(2);
        expect(result.data.thermalAnalysis.peakTemperature).toBeGreaterThan(20);
        expect(result.data.mechanicalAnalysis.totalDeformation).toBeGreaterThan(0);
      }
    });

    test('should analyze thermal effects', async () => {
      const inputs: WarpingRiskInputs = {
        materialType: 'stainless_steel',
        thickness: 4,
        length: 600,
        width: 250,
        laserPower: 2500,
        cuttingSpeed: 2000,
        numberOfPasses: 2,
        supportType: 'moderate',
        coolingMethod: 'natural',
        ambientTemperature: 25
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.thermalAnalysis.peakTemperature).toBeGreaterThan(inputs.ambientTemperature);
        expect(result.data.thermalAnalysis.temperatureGradient).toBeGreaterThan(0);
        expect(result.data.thermalAnalysis.thermalStress).toBeGreaterThan(0);
        expect(result.data.thermalAnalysis.coolingRate).toBeGreaterThan(0);
        expect(result.data.thermalAnalysis.heatAffectedArea).toBeGreaterThan(0);
      }
    });

    test('should analyze mechanical effects', async () => {
      const inputs: WarpingRiskInputs = {
        materialType: 'titanium',
        thickness: 6,
        length: 400,
        width: 400,
        laserPower: 3000,
        cuttingSpeed: 1500,
        numberOfPasses: 1,
        supportType: 'extensive',
        coolingMethod: 'controlled',
        ambientTemperature: 20
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.mechanicalAnalysis.residualStress).toBeGreaterThan(0);
        expect(result.data.mechanicalAnalysis.elasticDeformation).toBeGreaterThanOrEqual(0);
        expect(result.data.mechanicalAnalysis.plasticDeformation).toBeGreaterThanOrEqual(0);
        expect(result.data.mechanicalAnalysis.totalDeformation).toBeGreaterThanOrEqual(0);
        expect(result.data.mechanicalAnalysis.stressConcentration).toBeGreaterThanOrEqual(1);
      }
    });

    test('should analyze geometric factors', async () => {
      const inputs: WarpingRiskInputs = {
        materialType: 'brass',
        thickness: 2,
        length: 1000, // High aspect ratio
        width: 100,
        laserPower: 2200,
        cuttingSpeed: 3000,
        numberOfPasses: 1,
        supportType: 'minimal',
        coolingMethod: 'natural',
        ambientTemperature: 20
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.geometricFactors.aspectRatio).toBe(10); // 1000/100
        expect(result.data.geometricFactors.thicknessRatio).toBe(0.002); // 2/1000
        expect(result.data.geometricFactors.supportAdequacy).toBeLessThan(1);
        expect(result.data.geometricFactors.shapeComplexity).toBeGreaterThan(0);
      }
    });

    test('should provide prevention strategies', async () => {
      const inputs: WarpingRiskInputs = {
        materialType: 'copper',
        thickness: 3,
        length: 800,
        width: 150,
        laserPower: 4000, // High power
        cuttingSpeed: 1000, // Low speed = high heat input
        numberOfPasses: 3,
        supportType: 'none',
        coolingMethod: 'none',
        ambientTemperature: 30
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.preventionStrategies).toBeDefined();
        expect(result.data.preventionStrategies.parameterAdjustments.recommendedPower).toBeLessThan(inputs.laserPower);
        expect(result.data.preventionStrategies.parameterAdjustments.recommendedSpeed).toBeGreaterThan(inputs.cuttingSpeed);
        expect(Array.isArray(result.data.preventionStrategies.supportRecommendations)).toBe(true);
        expect(Array.isArray(result.data.preventionStrategies.coolingStrategies)).toBe(true);
        expect(Array.isArray(result.data.preventionStrategies.sequenceOptimization)).toBe(true);
      }
    });

    test('should make deformation predictions', async () => {
      const inputs: WarpingRiskInputs = {
        materialType: 'aluminum',
        thickness: 2,
        length: 1200,
        width: 200,
        laserPower: 3500,
        cuttingSpeed: 2000,
        numberOfPasses: 1,
        supportType: 'minimal',
        coolingMethod: 'natural',
        ambientTemperature: 20
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.predictions).toBeDefined();
        expect(result.data.predictions.expectedFlatness).toBeGreaterThan(0);
        expect(result.data.predictions.dimensionalAccuracy).toBeGreaterThan(0);
        expect(typeof result.data.predictions.warpingDirection).toBe('string');
        expect(Array.isArray(result.data.predictions.criticalAreas)).toBe(true);
      }
    });

    test('should show support type effects', async () => {
      const noSupportInputs: WarpingRiskInputs = {
        materialType: 'steel',
        thickness: 3,
        length: 600,
        width: 200,
        laserPower: 2000,
        cuttingSpeed: 2500,
        numberOfPasses: 1,
        supportType: 'none',
        coolingMethod: 'natural',
        ambientTemperature: 20
      };

      const extensiveSupportInputs: WarpingRiskInputs = {
        ...noSupportInputs,
        supportType: 'extensive'
      };

      const noSupportResult = await calculator.calculate(noSupportInputs);
      const extensiveSupportResult = await calculator.calculate(extensiveSupportInputs);
      
      expect(noSupportResult.success).toBe(true);
      expect(extensiveSupportResult.success).toBe(true);
      
      if (noSupportResult.data && extensiveSupportResult.data) {
        // Extensive support should result in lower risk
        expect(extensiveSupportResult.data.overallRiskScore).toBeLessThan(noSupportResult.data.overallRiskScore);
        expect(extensiveSupportResult.data.geometricFactors.supportAdequacy).toBeGreaterThan(
          noSupportResult.data.geometricFactors.supportAdequacy
        );
      }
    });

    test('should show cooling method effects', async () => {
      const noCoolingInputs: WarpingRiskInputs = {
        materialType: 'stainless_steel',
        thickness: 4,
        length: 500,
        width: 300,
        laserPower: 2500,
        cuttingSpeed: 2000,
        numberOfPasses: 1,
        supportType: 'moderate',
        coolingMethod: 'none',
        ambientTemperature: 20
      };

      const controlledCoolingInputs: WarpingRiskInputs = {
        ...noCoolingInputs,
        coolingMethod: 'controlled'
      };

      const noCoolingResult = await calculator.calculate(noCoolingInputs);
      const controlledCoolingResult = await calculator.calculate(controlledCoolingInputs);
      
      expect(noCoolingResult.success).toBe(true);
      expect(controlledCoolingResult.success).toBe(true);
      
      if (noCoolingResult.data && controlledCoolingResult.data) {
        // Controlled cooling should result in higher cooling rate
        expect(controlledCoolingResult.data.thermalAnalysis.coolingRate).toBeGreaterThan(
          noCoolingResult.data.thermalAnalysis.coolingRate
        );
      }
    });

    test('should include calculation metadata', async () => {
      const inputs: WarpingRiskInputs = {
        materialType: 'steel',
        thickness: 3,
        length: 500,
        width: 200,
        laserPower: 2000,
        cuttingSpeed: 2500,
        numberOfPasses: 1,
        supportType: 'moderate',
        coolingMethod: 'natural',
        ambientTemperature: 20
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
      const lowRiskInputs: WarpingRiskInputs = {
        materialType: 'titanium', // Low warping tendency
        thickness: 5,             // Thick material
        length: 200,              // Small dimensions
        width: 200,
        laserPower: 1500,         // Moderate power
        cuttingSpeed: 3000,       // High speed
        numberOfPasses: 1,
        supportType: 'extensive',
        coolingMethod: 'controlled',
        ambientTemperature: 20
      };

      const result = await calculator.calculate(lowRiskInputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.riskLevel).toMatch(/low|medium/);
        expect(result.data.overallRiskScore).toBeLessThan(6);
      }
    });

    test('should classify high risk correctly', async () => {
      const highRiskInputs: WarpingRiskInputs = {
        materialType: 'aluminum',  // High thermal expansion
        thickness: 1,              // Very thin
        length: 2000,              // Large dimensions
        width: 100,                // High aspect ratio
        laserPower: 5000,          // High power
        cuttingSpeed: 1000,        // Low speed
        numberOfPasses: 3,         // Multiple passes
        supportType: 'none',
        coolingMethod: 'none',
        ambientTemperature: 35
      };

      const result = await calculator.calculate(highRiskInputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.riskLevel).toMatch(/high|critical/);
        expect(result.data.overallRiskScore).toBeGreaterThan(5);
        expect(result.data.warnings.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Default and Example Inputs', () => {
    test('should provide valid default inputs', () => {
      const defaults = calculator.getDefaultInputs();
      
      expect(defaults.materialType).toBeDefined();
      expect(defaults.thickness).toBeGreaterThan(0);
      expect(defaults.length).toBeGreaterThan(0);
      expect(defaults.width).toBeGreaterThan(0);
      expect(defaults.laserPower).toBeGreaterThan(0);
      expect(defaults.cuttingSpeed).toBeGreaterThan(0);
      expect(defaults.numberOfPasses).toBeGreaterThanOrEqual(1);
      expect(defaults.supportType).toBeDefined();
      expect(defaults.coolingMethod).toBeDefined();
      expect(defaults.ambientTemperature).toBeDefined();
      
      const validation = calculator.validateInputs(defaults);
      expect(validation.isValid).toBe(true);
    });

    test('should provide valid example inputs', () => {
      const examples = calculator.getExampleInputs();
      
      expect(examples.materialType).toBe('steel');
      expect(examples.thickness).toBe(3);
      expect(examples.length).toBe(500);
      expect(examples.width).toBe(200);
      expect(examples.laserPower).toBe(2000);
      expect(examples.cuttingSpeed).toBe(2500);
      expect(examples.numberOfPasses).toBe(1);
      expect(examples.supportType).toBe('moderate');
      expect(examples.coolingMethod).toBe('natural');
      expect(examples.ambientTemperature).toBe(20);
      
      const validation = calculator.validateInputs(examples);
      expect(validation.isValid).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    test('should handle minimum dimensions', async () => {
      const minInputs: WarpingRiskInputs = {
        materialType: 'steel',
        thickness: 0.5, // Minimum thickness
        length: 10,     // Minimum length
        width: 10,      // Minimum width
        laserPower: 500,
        cuttingSpeed: 5000,
        numberOfPasses: 1,
        supportType: 'extensive',
        coolingMethod: 'controlled',
        ambientTemperature: 20
      };

      const result = await calculator.calculate(minInputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.overallRiskScore).toBeGreaterThanOrEqual(0);
        expect(result.data.thermalAnalysis.peakTemperature).toBeGreaterThan(20);
      }
    });

    test('should handle maximum dimensions', async () => {
      const maxInputs: WarpingRiskInputs = {
        materialType: 'aluminum',
        thickness: 50,   // Maximum thickness
        length: 3000,    // Maximum length
        width: 3000,     // Maximum width
        laserPower: 20000,
        cuttingSpeed: 500,
        numberOfPasses: 1,
        supportType: 'extensive',
        coolingMethod: 'controlled',
        ambientTemperature: 20
      };

      const result = await calculator.calculate(maxInputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.overallRiskScore).toBeGreaterThan(0);
        expect(result.data.recommendations.length).toBeGreaterThan(0);
      }
    });

    test('should handle extreme temperatures', async () => {
      const extremeTempInputs: WarpingRiskInputs = {
        materialType: 'steel',
        thickness: 3,
        length: 500,
        width: 200,
        laserPower: 2000,
        cuttingSpeed: 2500,
        numberOfPasses: 1,
        supportType: 'moderate',
        coolingMethod: 'natural',
        ambientTemperature: 45 // High ambient temperature
      };

      const result = await calculator.calculate(extremeTempInputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.thermalAnalysis.peakTemperature).toBeGreaterThan(45);
      }
    });
  });

  describe('Performance', () => {
    test('should complete calculations within reasonable time', async () => {
      const inputs: WarpingRiskInputs = {
        materialType: 'steel',
        thickness: 3,
        length: 500,
        width: 200,
        laserPower: 2000,
        cuttingSpeed: 2500,
        numberOfPasses: 1,
        supportType: 'moderate',
        coolingMethod: 'natural',
        ambientTemperature: 20
      };

      const startTime = performance.now();
      const result = await calculator.calculate(inputs);
      const endTime = performance.now();
      
      expect(result.success).toBe(true);
      expect(endTime - startTime).toBeLessThan(100); // Should complete in <100ms
    });
  });
});
