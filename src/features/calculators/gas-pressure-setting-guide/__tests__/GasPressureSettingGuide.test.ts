// Test suite for Gas Pressure Setting Guide
// Comprehensive testing of gas pressure optimization and setting recommendations

import { describe, test, expect, beforeEach } from 'vitest';
import { GasPressureSettingGuide, GasPressureSettingInputs } from '../GasPressureSettingGuide';

describe('GasPressureSettingGuide', () => {
  let calculator: GasPressureSettingGuide;

  beforeEach(() => {
    calculator = new GasPressureSettingGuide();
  });

  describe('Configuration', () => {
    test('should have correct calculator configuration', () => {
      expect(calculator.config.id).toBe('gas-pressure-setting-guide');
      expect(calculator.config.title).toBe('Gas Pressure Setting Guide');
      expect(calculator.config.category).toBe('Process Optimization');
      expect(calculator.config.badge).toBe('Standard');
      expect(calculator.config.inputs).toHaveLength(8);
    });

    test('should have all required input fields', () => {
      const inputIds = calculator.config.inputs.map(input => input.id);
      expect(inputIds).toContain('materialType');
      expect(inputIds).toContain('thickness');
      expect(inputIds).toContain('assistGas');
      expect(inputIds).toContain('nozzleDiameter');
      expect(inputIds).toContain('cuttingSpeed');
      expect(inputIds).toContain('laserPower');
      expect(inputIds).toContain('cutQuality');
      expect(inputIds).toContain('currentPressure');
    });
  });

  describe('Input Validation', () => {
    test('should validate correct inputs', () => {
      const validInputs: GasPressureSettingInputs = {
        materialType: 'steel',
        thickness: 5,
        assistGas: 'oxygen',
        nozzleDiameter: 1.5,
        cuttingSpeed: 3000,
        laserPower: 2000,
        cutQuality: 'standard'
      };

      const validation = calculator.validateInputs(validInputs);
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    test('should reject invalid material type', () => {
      const invalidInputs = {
        materialType: 'invalid_material',
        thickness: 5,
        assistGas: 'oxygen',
        nozzleDiameter: 1.5,
        cuttingSpeed: 3000,
        laserPower: 2000,
        cutQuality: 'standard'
      };

      const validation = calculator.validateInputs(invalidInputs);
      expect(validation.isValid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
    });

    test('should warn about uncommon gas-material combination', () => {
      const uncommonInputs: GasPressureSettingInputs = {
        materialType: 'titanium',
        thickness: 5,
        assistGas: 'oxygen', // Not recommended for titanium
        nozzleDiameter: 1.5,
        cuttingSpeed: 3000,
        laserPower: 2000,
        cutQuality: 'standard'
      };

      const validation = calculator.validateInputs(uncommonInputs);
      expect(validation.warnings.some(w => w.code === 'UNCOMMON_GAS_MATERIAL')).toBe(true);
    });

    test('should warn about small nozzle diameter', () => {
      const smallNozzleInputs: GasPressureSettingInputs = {
        materialType: 'steel',
        thickness: 10,
        assistGas: 'oxygen',
        nozzleDiameter: 1.0, // Small relative to thickness
        cuttingSpeed: 3000,
        laserPower: 2000,
        cutQuality: 'standard'
      };

      const validation = calculator.validateInputs(smallNozzleInputs);
      expect(validation.warnings.some(w => w.code === 'SMALL_NOZZLE_DIAMETER')).toBe(true);
    });

    test('should warn about high speed-thickness ratio', () => {
      const highSpeedInputs: GasPressureSettingInputs = {
        materialType: 'steel',
        thickness: 2,
        assistGas: 'oxygen',
        nozzleDiameter: 1.5,
        cuttingSpeed: 8000, // Very high for thin material
        laserPower: 2000,
        cutQuality: 'standard'
      };

      const validation = calculator.validateInputs(highSpeedInputs);
      expect(validation.warnings.some(w => w.code === 'HIGH_SPEED_THICKNESS_RATIO')).toBe(true);
    });
  });

  describe('Gas Pressure Optimization', () => {
    test('should calculate optimal pressure for steel with oxygen', async () => {
      const inputs: GasPressureSettingInputs = {
        materialType: 'steel',
        thickness: 5,
        assistGas: 'oxygen',
        nozzleDiameter: 1.5,
        cuttingSpeed: 3000,
        laserPower: 2000,
        cutQuality: 'standard'
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.optimalPressure).toBeDefined();
        expect(result.data.optimalPressure.value).toBeGreaterThan(0);
        expect(result.data.optimalPressure.value).toBeLessThan(5); // Oxygen pressure should be low
        expect(result.data.optimalPressure.unit).toBe('bar');
        expect(result.data.optimalPressure.confidence).toBeGreaterThan(0.8);
        expect(Array.isArray(result.data.optimalPressure.reasoning)).toBe(true);
      }
    });

    test('should calculate optimal pressure for stainless steel with nitrogen', async () => {
      const inputs: GasPressureSettingInputs = {
        materialType: 'stainless_steel',
        thickness: 8,
        assistGas: 'nitrogen',
        nozzleDiameter: 2.0,
        cuttingSpeed: 2000,
        laserPower: 3000,
        cutQuality: 'precision'
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.optimalPressure.value).toBeGreaterThan(10); // Nitrogen pressure should be high
        expect(result.data.optimalPressure.value).toBeLessThan(30);
        expect(result.data.pressureRange).toBeDefined();
        expect(result.data.pressureRange.minimum).toBeLessThan(result.data.pressureRange.optimal);
        expect(result.data.pressureRange.maximum).toBeGreaterThan(result.data.pressureRange.optimal);
      }
    });

    test('should analyze gas flow correctly', async () => {
      const inputs: GasPressureSettingInputs = {
        materialType: 'aluminum',
        thickness: 6,
        assistGas: 'nitrogen',
        nozzleDiameter: 1.8,
        cuttingSpeed: 4000,
        laserPower: 2500,
        cutQuality: 'standard'
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.gasFlowAnalysis).toBeDefined();
        expect(result.data.gasFlowAnalysis.flowRate).toBeGreaterThan(0);
        expect(result.data.gasFlowAnalysis.velocity).toBeGreaterThan(0);
        expect(result.data.gasFlowAnalysis.efficiency).toBeGreaterThanOrEqual(0);
        expect(result.data.gasFlowAnalysis.efficiency).toBeLessThanOrEqual(100);
        expect(result.data.gasFlowAnalysis.hourlyConsumption).toBeGreaterThan(0);
        expect(result.data.gasFlowAnalysis.costPerHour).toBeGreaterThan(0);
      }
    });

    test('should analyze pressure effects', async () => {
      const inputs: GasPressureSettingInputs = {
        materialType: 'copper',
        thickness: 4,
        assistGas: 'nitrogen',
        nozzleDiameter: 1.6,
        cuttingSpeed: 2500,
        laserPower: 3500,
        cutQuality: 'precision'
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.pressureEffects).toBeDefined();
        expect(result.data.pressureEffects.kerfWidth).toBeGreaterThan(0);
        expect(result.data.pressureEffects.edgeQuality).toBeGreaterThanOrEqual(1);
        expect(result.data.pressureEffects.edgeQuality).toBeLessThanOrEqual(10);
        expect(result.data.pressureEffects.drossRisk).toMatch(/low|medium|high/);
        expect(result.data.pressureEffects.penetrationDepth).toBeGreaterThan(0);
        expect(result.data.pressureEffects.gasUtilization).toBeGreaterThanOrEqual(0);
        expect(result.data.pressureEffects.gasUtilization).toBeLessThanOrEqual(100);
      }
    });

    test('should provide optimization recommendations', async () => {
      const inputs: GasPressureSettingInputs = {
        materialType: 'brass',
        thickness: 3,
        assistGas: 'nitrogen',
        nozzleDiameter: 1.4,
        cuttingSpeed: 3500,
        laserPower: 1800,
        cutQuality: 'standard',
        currentPressure: 8 // Provide current pressure for comparison
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.optimizationRecommendations).toBeDefined();
        expect(Array.isArray(result.data.optimizationRecommendations.pressureAdjustments)).toBe(true);
        expect(Array.isArray(result.data.optimizationRecommendations.qualityImprovements)).toBe(true);
        expect(Array.isArray(result.data.optimizationRecommendations.costOptimizations)).toBe(true);
        expect(Array.isArray(result.data.optimizationRecommendations.troubleshooting)).toBe(true);
        
        result.data.optimizationRecommendations.troubleshooting.forEach(tip => {
          expect(tip.issue).toBeDefined();
          expect(tip.cause).toBeDefined();
          expect(tip.solution).toBeDefined();
        });
      }
    });

    test('should generate alternative settings', async () => {
      const inputs: GasPressureSettingInputs = {
        materialType: 'titanium',
        thickness: 7,
        assistGas: 'argon',
        nozzleDiameter: 1.8,
        cuttingSpeed: 1800,
        laserPower: 2800,
        cutQuality: 'precision'
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
          expect(alt.pressure).toBeGreaterThan(0);
          expect(alt.tradeoff).toBeDefined();
          expect(alt.qualityImpact).toBeGreaterThanOrEqual(1);
          expect(alt.qualityImpact).toBeLessThanOrEqual(10);
          expect(typeof alt.costImpact).toBe('number');
        });
      }
    });

    test('should show quality requirement effects', async () => {
      const roughInputs: GasPressureSettingInputs = {
        materialType: 'steel',
        thickness: 5,
        assistGas: 'oxygen',
        nozzleDiameter: 1.5,
        cuttingSpeed: 3000,
        laserPower: 2000,
        cutQuality: 'rough'
      };

      const precisionInputs: GasPressureSettingInputs = {
        ...roughInputs,
        cutQuality: 'precision'
      };

      const roughResult = await calculator.calculate(roughInputs);
      const precisionResult = await calculator.calculate(precisionInputs);
      
      expect(roughResult.success).toBe(true);
      expect(precisionResult.success).toBe(true);
      
      if (roughResult.data && precisionResult.data) {
        // Precision should require higher pressure
        expect(precisionResult.data.optimalPressure.value).toBeGreaterThan(roughResult.data.optimalPressure.value);
        expect(precisionResult.data.pressureEffects.edgeQuality).toBeGreaterThan(roughResult.data.pressureEffects.edgeQuality);
      }
    });

    test('should show thickness effects on pressure', async () => {
      const thinInputs: GasPressureSettingInputs = {
        materialType: 'stainless_steel',
        thickness: 2,
        assistGas: 'nitrogen',
        nozzleDiameter: 1.5,
        cuttingSpeed: 3000,
        laserPower: 2000,
        cutQuality: 'standard'
      };

      const thickInputs: GasPressureSettingInputs = {
        ...thinInputs,
        thickness: 15
      };

      const thinResult = await calculator.calculate(thinInputs);
      const thickResult = await calculator.calculate(thickInputs);
      
      expect(thinResult.success).toBe(true);
      expect(thickResult.success).toBe(true);
      
      if (thinResult.data && thickResult.data) {
        // Thicker material should require higher pressure
        expect(thickResult.data.optimalPressure.value).toBeGreaterThan(thinResult.data.optimalPressure.value);
        expect(thickResult.data.gasFlowAnalysis.flowRate).toBeGreaterThan(thinResult.data.gasFlowAnalysis.flowRate);
      }
    });

    test('should include calculation metadata', async () => {
      const inputs: GasPressureSettingInputs = {
        materialType: 'steel',
        thickness: 5,
        assistGas: 'oxygen',
        nozzleDiameter: 1.5,
        cuttingSpeed: 3000,
        laserPower: 2000,
        cutQuality: 'standard'
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

  describe('Gas Type Effects', () => {
    test('should show oxygen vs nitrogen pressure differences', async () => {
      const oxygenInputs: GasPressureSettingInputs = {
        materialType: 'steel',
        thickness: 5,
        assistGas: 'oxygen',
        nozzleDiameter: 1.5,
        cuttingSpeed: 3000,
        laserPower: 2000,
        cutQuality: 'standard'
      };

      const nitrogenInputs: GasPressureSettingInputs = {
        ...oxygenInputs,
        assistGas: 'nitrogen'
      };

      const oxygenResult = await calculator.calculate(oxygenInputs);
      const nitrogenResult = await calculator.calculate(nitrogenInputs);
      
      expect(oxygenResult.success).toBe(true);
      expect(nitrogenResult.success).toBe(true);
      
      if (oxygenResult.data && nitrogenResult.data) {
        // Nitrogen should require much higher pressure than oxygen
        expect(nitrogenResult.data.optimalPressure.value).toBeGreaterThan(oxygenResult.data.optimalPressure.value * 5);
        expect(nitrogenResult.data.gasFlowAnalysis.costPerHour).toBeGreaterThan(oxygenResult.data.gasFlowAnalysis.costPerHour);
      }
    });

    test('should handle unsupported gas-material combinations', async () => {
      const unsupportedInputs: GasPressureSettingInputs = {
        materialType: 'titanium',
        thickness: 5,
        assistGas: 'oxygen', // Oxygen not supported for titanium
        nozzleDiameter: 1.5,
        cuttingSpeed: 3000,
        laserPower: 2000,
        cutQuality: 'standard'
      };

      const result = await calculator.calculate(unsupportedInputs);
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('not supported');
    });
  });

  describe('Material-Specific Behavior', () => {
    test('should handle different materials correctly', async () => {
      const materials: Array<{ material: GasPressureSettingInputs['materialType'], gas: GasPressureSettingInputs['assistGas'] }> = [
        { material: 'steel', gas: 'oxygen' },
        { material: 'stainless_steel', gas: 'nitrogen' },
        { material: 'aluminum', gas: 'nitrogen' },
        { material: 'copper', gas: 'nitrogen' },
        { material: 'titanium', gas: 'argon' },
        { material: 'brass', gas: 'nitrogen' }
      ];
      
      for (const { material, gas } of materials) {
        const inputs: GasPressureSettingInputs = {
          materialType: material,
          thickness: 5,
          assistGas: gas,
          nozzleDiameter: 1.5,
          cuttingSpeed: 3000,
          laserPower: 2000,
          cutQuality: 'standard'
        };

        const result = await calculator.calculate(inputs);
        
        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        
        if (result.data) {
          expect(result.data.optimalPressure.value).toBeGreaterThan(0);
          expect(result.data.gasFlowAnalysis.flowRate).toBeGreaterThan(0);
        }
      }
    });
  });

  describe('Default and Example Inputs', () => {
    test('should provide valid default inputs', () => {
      const defaults = calculator.getDefaultInputs();
      
      expect(defaults.materialType).toBeDefined();
      expect(defaults.thickness).toBeGreaterThan(0);
      expect(defaults.assistGas).toBeDefined();
      expect(defaults.nozzleDiameter).toBeGreaterThan(0);
      expect(defaults.cuttingSpeed).toBeGreaterThan(0);
      expect(defaults.laserPower).toBeGreaterThan(0);
      expect(defaults.cutQuality).toBeDefined();
      
      const validation = calculator.validateInputs(defaults);
      expect(validation.isValid).toBe(true);
    });

    test('should provide valid example inputs', () => {
      const examples = calculator.getExampleInputs();
      
      expect(examples.materialType).toBe('steel');
      expect(examples.thickness).toBe(5);
      expect(examples.assistGas).toBe('oxygen');
      expect(examples.nozzleDiameter).toBe(1.5);
      expect(examples.cuttingSpeed).toBe(3000);
      expect(examples.laserPower).toBe(2000);
      expect(examples.cutQuality).toBe('standard');
      
      const validation = calculator.validateInputs(examples);
      expect(validation.isValid).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    test('should handle minimum thickness', async () => {
      const minInputs: GasPressureSettingInputs = {
        materialType: 'aluminum',
        thickness: 0.1, // Minimum thickness
        assistGas: 'nitrogen',
        nozzleDiameter: 1.0,
        cuttingSpeed: 5000,
        laserPower: 1000,
        cutQuality: 'standard'
      };

      const result = await calculator.calculate(minInputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.optimalPressure.value).toBeGreaterThan(0);
        expect(result.data.gasFlowAnalysis.flowRate).toBeGreaterThan(0);
      }
    });

    test('should handle maximum thickness', async () => {
      const maxInputs: GasPressureSettingInputs = {
        materialType: 'steel',
        thickness: 50, // Maximum thickness
        assistGas: 'oxygen',
        nozzleDiameter: 3.0,
        cuttingSpeed: 500,
        laserPower: 15000,
        cutQuality: 'rough'
      };

      const result = await calculator.calculate(maxInputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.optimalPressure.value).toBeGreaterThan(0);
        expect(result.data.warnings.length).toBeGreaterThan(0); // Should warn about thick material
      }
    });

    test('should handle high pressure scenarios', async () => {
      const highPressureInputs: GasPressureSettingInputs = {
        materialType: 'copper',
        thickness: 20,
        assistGas: 'nitrogen',
        nozzleDiameter: 1.0, // Small nozzle
        cuttingSpeed: 1000,
        laserPower: 8000,
        cutQuality: 'mirror'
      };

      const result = await calculator.calculate(highPressureInputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.optimalPressure.value).toBeGreaterThan(15);
        expect(result.data.warnings.some(w => w.includes('pressure'))).toBe(true);
      }
    });
  });

  describe('Performance', () => {
    test('should complete calculations within reasonable time', async () => {
      const inputs: GasPressureSettingInputs = {
        materialType: 'steel',
        thickness: 5,
        assistGas: 'oxygen',
        nozzleDiameter: 1.5,
        cuttingSpeed: 3000,
        laserPower: 2000,
        cutQuality: 'standard'
      };

      const startTime = performance.now();
      const result = await calculator.calculate(inputs);
      const endTime = performance.now();
      
      expect(result.success).toBe(true);
      expect(endTime - startTime).toBeLessThan(100); // Should complete in <100ms
    });
  });
});
