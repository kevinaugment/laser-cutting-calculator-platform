// Test suite for Burn Mark Preventer Calculator
// Comprehensive testing of burn mark prevention and thermal damage analysis

import { describe, test, expect, beforeEach } from 'vitest';
import { BurnMarkPreventer, BurnMarkPreventerInputs } from '../BurnMarkPreventer';

describe('BurnMarkPreventer', () => {
  let calculator: BurnMarkPreventer;

  beforeEach(() => {
    calculator = new BurnMarkPreventer();
  });

  describe('Configuration', () => {
    test('should have correct calculator configuration', () => {
      expect(calculator.config.id).toBe('burn-mark-preventer');
      expect(calculator.config.title).toBe('Burn Mark Preventer');
      expect(calculator.config.category).toBe('Quality Control');
      expect(calculator.config.badge).toBe('Standard');
      expect(calculator.config.inputs).toHaveLength(9);
    });

    test('should have all required input fields', () => {
      const inputIds = calculator.config.inputs.map(input => input.id);
      expect(inputIds).toContain('materialType');
      expect(inputIds).toContain('thickness');
      expect(inputIds).toContain('laserPower');
      expect(inputIds).toContain('cuttingSpeed');
      expect(inputIds).toContain('assistGas');
      expect(inputIds).toContain('gasPressure');
      expect(inputIds).toContain('nozzleStandoff');
      expect(inputIds).toContain('surfaceCondition');
      expect(inputIds).toContain('ambientTemperature');
    });
  });

  describe('Input Validation', () => {
    test('should validate correct inputs', () => {
      const validInputs: BurnMarkPreventerInputs = {
        materialType: 'steel',
        thickness: 5,
        laserPower: 2000,
        cuttingSpeed: 2500,
        assistGas: 'oxygen',
        gasPressure: 1.2,
        nozzleStandoff: 1.5,
        surfaceCondition: 'clean',
        ambientTemperature: 20
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
        nozzleStandoff: 1.5,
        surfaceCondition: 'clean',
        ambientTemperature: 20
      };

      const validation = calculator.validateInputs(invalidInputs);
      expect(validation.isValid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
    });

    test('should warn about high power density', () => {
      const highPowerInputs: BurnMarkPreventerInputs = {
        materialType: 'steel',
        thickness: 2,     // Thin material
        laserPower: 5000, // High power = high power density
        cuttingSpeed: 2500,
        assistGas: 'oxygen',
        gasPressure: 1.2,
        nozzleStandoff: 1.5,
        surfaceCondition: 'clean',
        ambientTemperature: 20
      };

      const validation = calculator.validateInputs(highPowerInputs);
      expect(validation.warnings.some(w => w.code === 'HIGH_POWER_DENSITY')).toBe(true);
    });

    test('should warn about suboptimal gas choice', () => {
      const suboptimalGasInputs: BurnMarkPreventerInputs = {
        materialType: 'aluminum',
        thickness: 5,
        laserPower: 2000,
        cuttingSpeed: 2500,
        assistGas: 'oxygen', // Not optimal for aluminum
        gasPressure: 1.2,
        nozzleStandoff: 1.5,
        surfaceCondition: 'clean',
        ambientTemperature: 20
      };

      const validation = calculator.validateInputs(suboptimalGasInputs);
      expect(validation.warnings.some(w => w.code === 'SUBOPTIMAL_GAS')).toBe(true);
    });

    test('should warn about contaminated surface', () => {
      const contaminatedSurfaceInputs: BurnMarkPreventerInputs = {
        materialType: 'steel',
        thickness: 5,
        laserPower: 2000,
        cuttingSpeed: 2500,
        assistGas: 'oxygen',
        gasPressure: 1.2,
        nozzleStandoff: 1.5,
        surfaceCondition: 'oily', // Contaminated surface
        ambientTemperature: 20
      };

      const validation = calculator.validateInputs(contaminatedSurfaceInputs);
      expect(validation.warnings.some(w => w.code === 'CONTAMINATED_SURFACE')).toBe(true);
    });
  });

  describe('Burn Mark Prevention Analysis', () => {
    test('should analyze burn risk for steel cutting', async () => {
      const inputs: BurnMarkPreventerInputs = {
        materialType: 'steel',
        thickness: 5,
        laserPower: 2000,
        cuttingSpeed: 2500,
        assistGas: 'oxygen',
        gasPressure: 1.2,
        nozzleStandoff: 1.5,
        surfaceCondition: 'clean',
        ambientTemperature: 20
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.burnRiskScore).toBeGreaterThanOrEqual(0);
        expect(result.data.burnRiskScore).toBeLessThanOrEqual(10);
        expect(result.data.burnRiskLevel).toMatch(/low|medium|high|critical/);
        expect(result.data.thermalDamageAnalysis).toBeDefined();
        expect(result.data.burnMarkFactors).toBeDefined();
        expect(result.data.preventionStrategy).toBeDefined();
      }
    });

    test('should analyze burn risk for aluminum cutting', async () => {
      const inputs: BurnMarkPreventerInputs = {
        materialType: 'aluminum',
        thickness: 6,
        laserPower: 3000,
        cuttingSpeed: 4000,
        assistGas: 'nitrogen',
        gasPressure: 15,
        nozzleStandoff: 1.2,
        surfaceCondition: 'clean',
        ambientTemperature: 20
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        // Aluminum should have higher burn susceptibility
        expect(result.data.burnMarkFactors.materialSusceptibility).toBeGreaterThan(0.8);
        expect(result.data.thermalDamageAnalysis.surfaceTemperature).toBeGreaterThan(20);
      }
    });

    test('should analyze thermal damage effects', async () => {
      const inputs: BurnMarkPreventerInputs = {
        materialType: 'stainless_steel',
        thickness: 4,
        laserPower: 2500,
        cuttingSpeed: 2000,
        assistGas: 'nitrogen',
        gasPressure: 12,
        nozzleStandoff: 1.0,
        surfaceCondition: 'clean',
        ambientTemperature: 25
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.thermalDamageAnalysis.heatInput).toBeGreaterThan(0);
        expect(result.data.thermalDamageAnalysis.surfaceTemperature).toBeGreaterThan(inputs.ambientTemperature);
        expect(result.data.thermalDamageAnalysis.oxidationRisk).toBeGreaterThanOrEqual(0);
        expect(result.data.thermalDamageAnalysis.oxidationRisk).toBeLessThanOrEqual(1);
        expect(result.data.thermalDamageAnalysis.thermalStress).toBeGreaterThan(0);
        expect(result.data.thermalDamageAnalysis.coolingRate).toBeGreaterThan(0);
      }
    });

    test('should analyze burn mark factors', async () => {
      const inputs: BurnMarkPreventerInputs = {
        materialType: 'titanium',
        thickness: 3,
        laserPower: 2200,
        cuttingSpeed: 1500,
        assistGas: 'argon',
        gasPressure: 8,
        nozzleStandoff: 1.0,
        surfaceCondition: 'clean',
        ambientTemperature: 20
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.burnMarkFactors.powerDensityFactor).toBeGreaterThanOrEqual(0);
        expect(result.data.burnMarkFactors.powerDensityFactor).toBeLessThanOrEqual(1);
        expect(result.data.burnMarkFactors.gasEffectivenessFactor).toBeGreaterThanOrEqual(0);
        expect(result.data.burnMarkFactors.gasEffectivenessFactor).toBeLessThanOrEqual(1);
        expect(result.data.burnMarkFactors.surfaceConditionFactor).toBeGreaterThanOrEqual(0);
        expect(result.data.burnMarkFactors.surfaceConditionFactor).toBeLessThanOrEqual(1);
        expect(result.data.burnMarkFactors.materialSusceptibility).toBeGreaterThanOrEqual(0);
        expect(result.data.burnMarkFactors.materialSusceptibility).toBeLessThanOrEqual(1);
        expect(result.data.burnMarkFactors.geometryFactor).toBeGreaterThanOrEqual(0);
        expect(result.data.burnMarkFactors.geometryFactor).toBeLessThanOrEqual(1);
      }
    });

    test('should provide prevention strategy', async () => {
      const inputs: BurnMarkPreventerInputs = {
        materialType: 'copper',
        thickness: 4,
        laserPower: 4000, // High power for high risk
        cuttingSpeed: 1000, // Low speed for high heat input
        assistGas: 'oxygen', // Not optimal for copper
        gasPressure: 2,
        nozzleStandoff: 2.5, // High standoff
        surfaceCondition: 'oily', // Contaminated
        ambientTemperature: 30
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.preventionStrategy).toBeDefined();
        expect(result.data.preventionStrategy.parameterOptimization.recommendedPower).toBeLessThanOrEqual(inputs.laserPower);
        expect(result.data.preventionStrategy.parameterOptimization.recommendedSpeed).toBeGreaterThanOrEqual(inputs.cuttingSpeed);
        expect(result.data.preventionStrategy.gasOptimization.optimalGasType).toBe('nitrogen');
        expect(Array.isArray(result.data.preventionStrategy.surfacePreparation)).toBe(true);
        expect(Array.isArray(result.data.preventionStrategy.processModifications)).toBe(true);
      }
    });

    test('should predict quality outcomes', async () => {
      const inputs: BurnMarkPreventerInputs = {
        materialType: 'brass',
        thickness: 5,
        laserPower: 2800,
        cuttingSpeed: 3000,
        assistGas: 'nitrogen',
        gasPressure: 10,
        nozzleStandoff: 1.3,
        surfaceCondition: 'clean',
        ambientTemperature: 20
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.qualityPrediction).toBeDefined();
        expect(result.data.qualityPrediction.expectedSurfaceQuality).toBeGreaterThanOrEqual(1);
        expect(result.data.qualityPrediction.expectedSurfaceQuality).toBeLessThanOrEqual(5);
        expect(result.data.qualityPrediction.discolorationRisk).toMatch(/none|minimal|moderate|severe/);
        expect(result.data.qualityPrediction.oxidationDepth).toBeGreaterThanOrEqual(0);
        expect(result.data.qualityPrediction.heatAffectedZone).toBeGreaterThan(0);
      }
    });

    test('should show gas type effects on burn risk', async () => {
      const oxygenInputs: BurnMarkPreventerInputs = {
        materialType: 'aluminum',
        thickness: 5,
        laserPower: 3000,
        cuttingSpeed: 3000,
        assistGas: 'oxygen', // High burn risk for aluminum
        gasPressure: 2,
        nozzleStandoff: 1.5,
        surfaceCondition: 'clean',
        ambientTemperature: 20
      };

      const nitrogenInputs: BurnMarkPreventerInputs = {
        ...oxygenInputs,
        assistGas: 'nitrogen' // Optimal for aluminum
      };

      const oxygenResult = await calculator.calculate(oxygenInputs);
      const nitrogenResult = await calculator.calculate(nitrogenInputs);
      
      expect(oxygenResult.success).toBe(true);
      expect(nitrogenResult.success).toBe(true);
      
      if (oxygenResult.data && nitrogenResult.data) {
        // Nitrogen should result in lower burn risk for aluminum
        expect(nitrogenResult.data.burnRiskScore).toBeLessThan(oxygenResult.data.burnRiskScore);
        expect(nitrogenResult.data.burnMarkFactors.gasEffectivenessFactor).toBeGreaterThan(
          oxygenResult.data.burnMarkFactors.gasEffectivenessFactor
        );
      }
    });

    test('should show surface condition effects', async () => {
      const cleanInputs: BurnMarkPreventerInputs = {
        materialType: 'steel',
        thickness: 5,
        laserPower: 2000,
        cuttingSpeed: 2500,
        assistGas: 'oxygen',
        gasPressure: 1.2,
        nozzleStandoff: 1.5,
        surfaceCondition: 'clean',
        ambientTemperature: 20
      };

      const oilyInputs: BurnMarkPreventerInputs = {
        ...cleanInputs,
        surfaceCondition: 'oily'
      };

      const cleanResult = await calculator.calculate(cleanInputs);
      const oilyResult = await calculator.calculate(oilyInputs);
      
      expect(cleanResult.success).toBe(true);
      expect(oilyResult.success).toBe(true);
      
      if (cleanResult.data && oilyResult.data) {
        // Oily surface should result in higher burn risk
        expect(oilyResult.data.burnRiskScore).toBeGreaterThan(cleanResult.data.burnRiskScore);
        expect(oilyResult.data.burnMarkFactors.surfaceConditionFactor).toBeGreaterThan(
          cleanResult.data.burnMarkFactors.surfaceConditionFactor
        );
      }
    });

    test('should include calculation metadata', async () => {
      const inputs: BurnMarkPreventerInputs = {
        materialType: 'steel',
        thickness: 5,
        laserPower: 2000,
        cuttingSpeed: 2500,
        assistGas: 'oxygen',
        gasPressure: 1.2,
        nozzleStandoff: 1.5,
        surfaceCondition: 'clean',
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
      const lowRiskInputs: BurnMarkPreventerInputs = {
        materialType: 'steel',
        thickness: 10,            // Thick material
        laserPower: 1500,         // Moderate power
        cuttingSpeed: 4000,       // High speed
        assistGas: 'oxygen',      // Optimal for steel
        gasPressure: 1.5,
        nozzleStandoff: 1.0,      // Optimal standoff
        surfaceCondition: 'clean',
        ambientTemperature: 20
      };

      const result = await calculator.calculate(lowRiskInputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.burnRiskLevel).toMatch(/low|medium/);
        expect(result.data.burnRiskScore).toBeLessThan(5);
      }
    });

    test('should classify high risk correctly', async () => {
      const highRiskInputs: BurnMarkPreventerInputs = {
        materialType: 'titanium',   // High susceptibility
        thickness: 2,              // Thin material
        laserPower: 5000,          // High power
        cuttingSpeed: 1000,        // Low speed
        assistGas: 'oxygen',       // Wrong gas for titanium
        gasPressure: 1,            // Low pressure
        nozzleStandoff: 3.0,       // High standoff
        surfaceCondition: 'oily',  // Contaminated
        ambientTemperature: 35
      };

      const result = await calculator.calculate(highRiskInputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.burnRiskLevel).toMatch(/high|critical/);
        expect(result.data.burnRiskScore).toBeGreaterThan(6);
        expect(result.data.warnings.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Material-Specific Behavior', () => {
    test('should handle titanium with oxygen warning', async () => {
      const titaniumOxygenInputs: BurnMarkPreventerInputs = {
        materialType: 'titanium',
        thickness: 3,
        laserPower: 2000,
        cuttingSpeed: 1500,
        assistGas: 'oxygen', // Dangerous for titanium
        gasPressure: 2,
        nozzleStandoff: 1.5,
        surfaceCondition: 'clean',
        ambientTemperature: 20
      };

      const result = await calculator.calculate(titaniumOxygenInputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.warnings.some(w => w.includes('titanium') && w.includes('oxygen'))).toBe(true);
        expect(result.data.burnRiskLevel).toMatch(/high|critical/);
      }
    });

    test('should recommend optimal gas for each material', async () => {
      const materials: Array<{ material: BurnMarkPreventerInputs['materialType'], expectedGas: string }> = [
        { material: 'steel', expectedGas: 'oxygen' },
        { material: 'stainless_steel', expectedGas: 'nitrogen' },
        { material: 'aluminum', expectedGas: 'nitrogen' },
        { material: 'titanium', expectedGas: 'argon' },
        { material: 'copper', expectedGas: 'nitrogen' },
        { material: 'brass', expectedGas: 'nitrogen' }
      ];

      for (const { material, expectedGas } of materials) {
        const inputs: BurnMarkPreventerInputs = {
          materialType: material,
          thickness: 5,
          laserPower: 2000,
          cuttingSpeed: 2500,
          assistGas: 'air', // Suboptimal gas
          gasPressure: 5,
          nozzleStandoff: 1.5,
          surfaceCondition: 'clean',
          ambientTemperature: 20
        };

        const result = await calculator.calculate(inputs);
        
        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        
        if (result.data) {
          expect(result.data.preventionStrategy.gasOptimization.optimalGasType).toBe(expectedGas);
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
      expect(defaults.assistGas).toBeDefined();
      expect(defaults.gasPressure).toBeGreaterThan(0);
      expect(defaults.nozzleStandoff).toBeGreaterThan(0);
      expect(defaults.surfaceCondition).toBeDefined();
      expect(defaults.ambientTemperature).toBeDefined();
      
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
      expect(examples.nozzleStandoff).toBe(1.5);
      expect(examples.surfaceCondition).toBe('clean');
      expect(examples.ambientTemperature).toBe(20);
      
      const validation = calculator.validateInputs(examples);
      expect(validation.isValid).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    test('should handle minimum thickness', async () => {
      const minInputs: BurnMarkPreventerInputs = {
        materialType: 'aluminum',
        thickness: 0.5, // Minimum thickness
        laserPower: 1000,
        cuttingSpeed: 5000,
        assistGas: 'nitrogen',
        gasPressure: 10,
        nozzleStandoff: 1.0,
        surfaceCondition: 'clean',
        ambientTemperature: 20
      };

      const result = await calculator.calculate(minInputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.burnRiskScore).toBeGreaterThanOrEqual(0);
        expect(result.data.thermalDamageAnalysis.surfaceTemperature).toBeGreaterThan(20);
      }
    });

    test('should handle maximum power', async () => {
      const maxInputs: BurnMarkPreventerInputs = {
        materialType: 'steel',
        thickness: 20,
        laserPower: 20000, // Maximum power
        cuttingSpeed: 1000,
        assistGas: 'oxygen',
        gasPressure: 3,
        nozzleStandoff: 1.5,
        surfaceCondition: 'clean',
        ambientTemperature: 20
      };

      const result = await calculator.calculate(maxInputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.burnRiskScore).toBeGreaterThan(5); // High power should increase risk
        expect(result.data.warnings.length).toBeGreaterThan(0);
      }
    });

    test('should handle extreme temperatures', async () => {
      const extremeTempInputs: BurnMarkPreventerInputs = {
        materialType: 'steel',
        thickness: 5,
        laserPower: 2000,
        cuttingSpeed: 2500,
        assistGas: 'oxygen',
        gasPressure: 1.2,
        nozzleStandoff: 1.5,
        surfaceCondition: 'clean',
        ambientTemperature: 45 // High ambient temperature
      };

      const result = await calculator.calculate(extremeTempInputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.thermalDamageAnalysis.surfaceTemperature).toBeGreaterThan(45);
      }
    });
  });

  describe('Performance', () => {
    test('should complete calculations within reasonable time', async () => {
      const inputs: BurnMarkPreventerInputs = {
        materialType: 'steel',
        thickness: 5,
        laserPower: 2000,
        cuttingSpeed: 2500,
        assistGas: 'oxygen',
        gasPressure: 1.2,
        nozzleStandoff: 1.5,
        surfaceCondition: 'clean',
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
