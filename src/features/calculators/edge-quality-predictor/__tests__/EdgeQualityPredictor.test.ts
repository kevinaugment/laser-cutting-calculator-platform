// Test suite for Edge Quality Predictor Calculator
// Comprehensive testing of edge quality prediction and analysis

import { describe, test, expect, beforeEach } from 'vitest';
import { EdgeQualityPredictor, EdgeQualityInputs } from '../EdgeQualityPredictor';

describe('EdgeQualityPredictor', () => {
  let calculator: EdgeQualityPredictor;

  beforeEach(() => {
    calculator = new EdgeQualityPredictor();
  });

  describe('Configuration', () => {
    test('should have correct calculator configuration', () => {
      expect(calculator.config.id).toBe('edge-quality-predictor');
      expect(calculator.config.title).toBe('Edge Quality Predictor');
      expect(calculator.config.category).toBe('Quality Control');
      expect(calculator.config.badge).toBe('Standard');
      expect(calculator.config.inputs).toHaveLength(8);
    });

    test('should have all required input fields', () => {
      const inputIds = calculator.config.inputs.map(input => input.id);
      expect(inputIds).toContain('materialType');
      expect(inputIds).toContain('thickness');
      expect(inputIds).toContain('laserPower');
      expect(inputIds).toContain('cuttingSpeed');
      expect(inputIds).toContain('assistGas');
      expect(inputIds).toContain('gasPressure');
      expect(inputIds).toContain('focusPosition');
      expect(inputIds).toContain('beamQuality');
    });
  });

  describe('Input Validation', () => {
    test('should validate correct inputs', () => {
      const validInputs: EdgeQualityInputs = {
        materialType: 'steel',
        thickness: 5,
        laserPower: 2000,
        cuttingSpeed: 2500,
        assistGas: 'oxygen',
        gasPressure: 1.2,
        focusPosition: -1.5,
        beamQuality: 1.1
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
        cuttingSpeed: 2500,
        assistGas: 'oxygen',
        gasPressure: 1.2,
        focusPosition: -1.5,
        beamQuality: 1.1
      };

      const validation = calculator.validateInputs(invalidInputs);
      expect(validation.isValid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
    });

    test('should reject thickness out of range', () => {
      const invalidInputs: EdgeQualityInputs = {
        materialType: 'steel',
        thickness: 100, // Above max of 50
        laserPower: 2000,
        cuttingSpeed: 2500,
        assistGas: 'oxygen',
        gasPressure: 1.2,
        focusPosition: -1.5,
        beamQuality: 1.1
      };

      const validation = calculator.validateInputs(invalidInputs);
      expect(validation.isValid).toBe(false);
      expect(validation.errors.some(e => e.field === 'thickness')).toBe(true);
    });

    test('should warn about suboptimal power-speed ratio', () => {
      const suboptimalInputs: EdgeQualityInputs = {
        materialType: 'steel',
        thickness: 5,
        laserPower: 5000, // Very high power
        cuttingSpeed: 500,  // Very low speed
        assistGas: 'oxygen',
        gasPressure: 1.2,
        focusPosition: -1.5,
        beamQuality: 1.1
      };

      const validation = calculator.validateInputs(suboptimalInputs);
      expect(validation.warnings.some(w => w.code === 'SUBOPTIMAL_POWER_SPEED')).toBe(true);
    });

    test('should warn about suboptimal gas choice', () => {
      const suboptimalGasInputs: EdgeQualityInputs = {
        materialType: 'aluminum',
        thickness: 5,
        laserPower: 2000,
        cuttingSpeed: 2500,
        assistGas: 'oxygen', // Not optimal for aluminum
        gasPressure: 1.2,
        focusPosition: -1.5,
        beamQuality: 1.1
      };

      const validation = calculator.validateInputs(suboptimalGasInputs);
      expect(validation.warnings.some(w => w.code === 'SUBOPTIMAL_GAS')).toBe(true);
    });
  });

  describe('Edge Quality Predictions', () => {
    test('should predict quality for steel cutting', async () => {
      const inputs: EdgeQualityInputs = {
        materialType: 'steel',
        thickness: 5,
        laserPower: 2000,
        cuttingSpeed: 2500,
        assistGas: 'oxygen',
        gasPressure: 1.2,
        focusPosition: -1.5,
        beamQuality: 1.1
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.qualityGrade).toBeGreaterThanOrEqual(1);
        expect(result.data.qualityGrade).toBeLessThanOrEqual(5);
        expect(result.data.surfaceRoughness).toBeGreaterThan(0);
        expect(result.data.edgeCharacteristics).toBeDefined();
        expect(result.data.defectRisks).toBeDefined();
        expect(result.data.qualityFactors).toBeDefined();
      }
    });

    test('should predict quality for stainless steel cutting', async () => {
      const inputs: EdgeQualityInputs = {
        materialType: 'stainless_steel',
        thickness: 8,
        laserPower: 2500,
        cuttingSpeed: 1800,
        assistGas: 'nitrogen',
        gasPressure: 12,
        focusPosition: -2.5,
        beamQuality: 1.2
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        // Stainless steel with nitrogen should have good quality
        expect(result.data.qualityGrade).toBeGreaterThan(3);
        expect(result.data.defectRisks.drossLevel).toMatch(/none|minimal/);
        expect(result.data.surfaceRoughness).toBeLessThan(5);
      }
    });

    test('should predict quality for aluminum cutting', async () => {
      const inputs: EdgeQualityInputs = {
        materialType: 'aluminum',
        thickness: 6,
        laserPower: 3000,
        cuttingSpeed: 4000,
        assistGas: 'nitrogen',
        gasPressure: 15,
        focusPosition: -2.0,
        beamQuality: 1.1
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        // Aluminum should have reasonable quality with nitrogen
        expect(result.data.qualityGrade).toBeGreaterThan(2);
        expect(result.data.defectRisks.burnRisk).toMatch(/low|medium/);
      }
    });

    test('should analyze edge characteristics', async () => {
      const inputs: EdgeQualityInputs = {
        materialType: 'titanium',
        thickness: 4,
        laserPower: 2200,
        cuttingSpeed: 1500,
        assistGas: 'argon',
        gasPressure: 8,
        focusPosition: -1.3,
        beamQuality: 1.15
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.edgeCharacteristics.topEdgeQuality).toBeGreaterThanOrEqual(1);
        expect(result.data.edgeCharacteristics.topEdgeQuality).toBeLessThanOrEqual(5);
        expect(result.data.edgeCharacteristics.bottomEdgeQuality).toBeGreaterThanOrEqual(1);
        expect(result.data.edgeCharacteristics.bottomEdgeQuality).toBeLessThanOrEqual(5);
        expect(result.data.edgeCharacteristics.kerfTaper).toBeGreaterThan(0);
        expect(result.data.edgeCharacteristics.kerfWidth).toBeGreaterThan(0);
        expect(result.data.edgeCharacteristics.edgeAngle).toBeGreaterThan(85);
        expect(result.data.edgeCharacteristics.edgeAngle).toBeLessThan(95);
      }
    });

    test('should assess defect risks', async () => {
      const inputs: EdgeQualityInputs = {
        materialType: 'copper',
        thickness: 3,
        laserPower: 4000,
        cuttingSpeed: 1000,
        assistGas: 'nitrogen',
        gasPressure: 10,
        focusPosition: -1.0,
        beamQuality: 1.3
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.defectRisks.drossLevel).toMatch(/none|minimal|moderate|excessive/);
        expect(result.data.defectRisks.burnRisk).toMatch(/low|medium|high/);
        expect(result.data.defectRisks.roughnessRisk).toMatch(/low|medium|high/);
        expect(result.data.defectRisks.taperRisk).toMatch(/low|medium|high/);
      }
    });

    test('should calculate quality factors', async () => {
      const inputs: EdgeQualityInputs = {
        materialType: 'brass',
        thickness: 7,
        laserPower: 2800,
        cuttingSpeed: 2200,
        assistGas: 'nitrogen',
        gasPressure: 14,
        focusPosition: -2.3,
        beamQuality: 1.2
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.qualityFactors.materialFactor).toBeGreaterThan(0);
        expect(result.data.qualityFactors.materialFactor).toBeLessThanOrEqual(1);
        expect(result.data.qualityFactors.powerSpeedRatio).toBeGreaterThan(0);
        expect(result.data.qualityFactors.gasPressureEffect).toBeGreaterThan(0);
        expect(result.data.qualityFactors.gasPressureEffect).toBeLessThanOrEqual(1);
        expect(result.data.qualityFactors.focusQuality).toBeGreaterThan(0);
        expect(result.data.qualityFactors.focusQuality).toBeLessThanOrEqual(1);
        expect(result.data.qualityFactors.beamQualityEffect).toBeGreaterThan(0);
        expect(result.data.qualityFactors.beamQualityEffect).toBeLessThanOrEqual(1);
      }
    });

    test('should provide optimization suggestions', async () => {
      const inputs: EdgeQualityInputs = {
        materialType: 'steel',
        thickness: 10,
        laserPower: 1500, // Low power for thickness
        cuttingSpeed: 1000, // Low speed
        assistGas: 'oxygen',
        gasPressure: 0.8, // Low pressure
        focusPosition: 1.0, // Above surface
        beamQuality: 1.5 // Poor beam quality
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.optimizationSuggestions).toBeDefined();
        expect(typeof result.data.optimizationSuggestions.powerAdjustment).toBe('number');
        expect(typeof result.data.optimizationSuggestions.speedAdjustment).toBe('number');
        expect(typeof result.data.optimizationSuggestions.pressureAdjustment).toBe('number');
        expect(typeof result.data.optimizationSuggestions.focusAdjustment).toBe('number');
      }
    });

    test('should show gas type effects', async () => {
      const oxygenInputs: EdgeQualityInputs = {
        materialType: 'steel',
        thickness: 5,
        laserPower: 2000,
        cuttingSpeed: 2500,
        assistGas: 'oxygen',
        gasPressure: 1.2,
        focusPosition: -1.5,
        beamQuality: 1.1
      };

      const nitrogenInputs: EdgeQualityInputs = {
        ...oxygenInputs,
        assistGas: 'nitrogen',
        gasPressure: 12
      };

      const oxygenResult = await calculator.calculate(oxygenInputs);
      const nitrogenResult = await calculator.calculate(nitrogenInputs);
      
      expect(oxygenResult.success).toBe(true);
      expect(nitrogenResult.success).toBe(true);
      
      if (oxygenResult.data && nitrogenResult.data) {
        // Different gas types should produce different results
        expect(oxygenResult.data.surfaceRoughness).not.toBe(nitrogenResult.data.surfaceRoughness);
        expect(oxygenResult.data.defectRisks.burnRisk).not.toBe(nitrogenResult.data.defectRisks.burnRisk);
      }
    });

    test('should include calculation metadata', async () => {
      const inputs: EdgeQualityInputs = {
        materialType: 'steel',
        thickness: 5,
        laserPower: 2000,
        cuttingSpeed: 2500,
        assistGas: 'oxygen',
        gasPressure: 1.2,
        focusPosition: -1.5,
        beamQuality: 1.1
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

  describe('Quality Relationships', () => {
    test('should show power-speed ratio effects', async () => {
      const optimalInputs: EdgeQualityInputs = {
        materialType: 'steel',
        thickness: 5,
        laserPower: 2000,
        cuttingSpeed: 2500,
        assistGas: 'oxygen',
        gasPressure: 1.2,
        focusPosition: -1.5,
        beamQuality: 1.1
      };

      const highPowerInputs: EdgeQualityInputs = {
        ...optimalInputs,
        laserPower: 5000, // Much higher power
        cuttingSpeed: 1000 // Much lower speed
      };

      const optimalResult = await calculator.calculate(optimalInputs);
      const highPowerResult = await calculator.calculate(highPowerInputs);
      
      expect(optimalResult.success).toBe(true);
      expect(highPowerResult.success).toBe(true);
      
      if (optimalResult.data && highPowerResult.data) {
        // High power/low speed should generally result in lower quality
        expect(highPowerResult.data.defectRisks.burnRisk).not.toBe('low');
        expect(highPowerResult.data.qualityGrade).toBeLessThanOrEqual(optimalResult.data.qualityGrade);
      }
    });

    test('should show focus position effects', async () => {
      const goodFocusInputs: EdgeQualityInputs = {
        materialType: 'stainless_steel',
        thickness: 6,
        laserPower: 2500,
        cuttingSpeed: 2000,
        assistGas: 'nitrogen',
        gasPressure: 12,
        focusPosition: -2.0, // Good focus position
        beamQuality: 1.1
      };

      const poorFocusInputs: EdgeQualityInputs = {
        ...goodFocusInputs,
        focusPosition: 2.0 // Poor focus position (above surface)
      };

      const goodFocusResult = await calculator.calculate(goodFocusInputs);
      const poorFocusResult = await calculator.calculate(poorFocusInputs);
      
      expect(goodFocusResult.success).toBe(true);
      expect(poorFocusResult.success).toBe(true);
      
      if (goodFocusResult.data && poorFocusResult.data) {
        // Good focus should result in better quality
        expect(goodFocusResult.data.qualityGrade).toBeGreaterThan(poorFocusResult.data.qualityGrade);
        expect(goodFocusResult.data.qualityFactors.focusQuality).toBeGreaterThan(
          poorFocusResult.data.qualityFactors.focusQuality
        );
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
      expect(defaults.assistGas).toBeDefined();
      expect(defaults.gasPressure).toBeGreaterThan(0);
      expect(defaults.focusPosition).toBeDefined();
      expect(defaults.beamQuality).toBeGreaterThanOrEqual(1);
      
      const validation = calculator.validateInputs(defaults);
      expect(validation.isValid).toBe(true);
    });

    test('should provide valid example inputs', () => {
      const examples = calculator.getExampleInputs();
      
      expect(examples.materialType).toBe('steel');
      expect(examples.thickness).toBe(5);
      expect(examples.laserPower).toBe(2000);
      expect(examples.cuttingSpeed).toBe(2500);
      expect(examples.assistGas).toBe('oxygen');
      expect(examples.gasPressure).toBe(1.2);
      expect(examples.focusPosition).toBe(-1.5);
      expect(examples.beamQuality).toBe(1.1);
      
      const validation = calculator.validateInputs(examples);
      expect(validation.isValid).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    test('should handle minimum thickness', async () => {
      const minInputs: EdgeQualityInputs = {
        materialType: 'aluminum',
        thickness: 0.5, // Minimum thickness
        laserPower: 1000,
        cuttingSpeed: 5000,
        assistGas: 'nitrogen',
        gasPressure: 10,
        focusPosition: -0.2,
        beamQuality: 1.1
      };

      const result = await calculator.calculate(minInputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.qualityGrade).toBeGreaterThanOrEqual(1);
        expect(result.data.surfaceRoughness).toBeGreaterThan(0);
      }
    });

    test('should handle maximum thickness', async () => {
      const maxInputs: EdgeQualityInputs = {
        materialType: 'steel',
        thickness: 50, // Maximum thickness
        laserPower: 15000,
        cuttingSpeed: 500,
        assistGas: 'oxygen',
        gasPressure: 2.0,
        focusPosition: -15,
        beamQuality: 1.5
      };

      const result = await calculator.calculate(maxInputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.warnings.length).toBeGreaterThan(0); // Should warn about thick material
      }
    });

    test('should handle poor beam quality', async () => {
      const poorBeamInputs: EdgeQualityInputs = {
        materialType: 'steel',
        thickness: 5,
        laserPower: 2000,
        cuttingSpeed: 2500,
        assistGas: 'oxygen',
        gasPressure: 1.2,
        focusPosition: -1.5,
        beamQuality: 3.0 // Poor beam quality
      };

      const result = await calculator.calculate(poorBeamInputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.qualityFactors.beamQualityEffect).toBeLessThan(0.5);
        expect(result.data.qualityGrade).toBeLessThan(4); // Should result in lower quality
      }
    });
  });

  describe('Performance', () => {
    test('should complete calculations within reasonable time', async () => {
      const inputs: EdgeQualityInputs = {
        materialType: 'steel',
        thickness: 5,
        laserPower: 2000,
        cuttingSpeed: 2500,
        assistGas: 'oxygen',
        gasPressure: 1.2,
        focusPosition: -1.5,
        beamQuality: 1.1
      };

      const startTime = performance.now();
      const result = await calculator.calculate(inputs);
      const endTime = performance.now();
      
      expect(result.success).toBe(true);
      expect(endTime - startTime).toBeLessThan(100); // Should complete in <100ms
    });
  });
});
