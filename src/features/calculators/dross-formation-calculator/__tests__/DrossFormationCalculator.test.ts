// Test suite for Dross Formation Calculator
// Comprehensive testing of dross formation analysis and prevention

import { describe, test, expect, beforeEach } from 'vitest';
import { DrossFormationCalculator, DrossFormationInputs } from '../DrossFormationCalculator';

describe('DrossFormationCalculator', () => {
  let calculator: DrossFormationCalculator;

  beforeEach(() => {
    calculator = new DrossFormationCalculator();
  });

  describe('Configuration', () => {
    test('should have correct calculator configuration', () => {
      expect(calculator.config.id).toBe('dross-formation-calculator');
      expect(calculator.config.title).toBe('Dross Formation Calculator');
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
      expect(inputIds).toContain('nozzleDiameter');
      expect(inputIds).toContain('nozzleStandoff');
      expect(inputIds).toContain('currentDrossLevel');
    });
  });

  describe('Input Validation', () => {
    test('should validate correct inputs', () => {
      const validInputs: DrossFormationInputs = {
        materialType: 'steel',
        thickness: 8,
        laserPower: 2500,
        cuttingSpeed: 2000,
        assistGas: 'oxygen',
        gasPressure: 1.5,
        nozzleDiameter: 1.5,
        nozzleStandoff: 1.0,
        currentDrossLevel: 'moderate'
      };

      const validation = calculator.validateInputs(validInputs);
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    test('should reject invalid material type', () => {
      const invalidInputs = {
        materialType: 'invalid_material',
        thickness: 8,
        laserPower: 2500,
        cuttingSpeed: 2000,
        assistGas: 'oxygen',
        gasPressure: 1.5,
        nozzleDiameter: 1.5,
        nozzleStandoff: 1.0,
        currentDrossLevel: 'moderate'
      };

      const validation = calculator.validateInputs(invalidInputs);
      expect(validation.isValid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
    });

    test('should warn about suboptimal power-speed ratio', () => {
      const suboptimalInputs: DrossFormationInputs = {
        materialType: 'steel',
        thickness: 8,
        laserPower: 5000, // Very high power
        cuttingSpeed: 1000, // Very low speed
        assistGas: 'oxygen',
        gasPressure: 1.5,
        nozzleDiameter: 1.5,
        nozzleStandoff: 1.0,
        currentDrossLevel: 'moderate'
      };

      const validation = calculator.validateInputs(suboptimalInputs);
      expect(validation.warnings.some(w => w.code === 'SUBOPTIMAL_POWER_SPEED')).toBe(true);
    });

    test('should warn about suboptimal gas choice', () => {
      const suboptimalGasInputs: DrossFormationInputs = {
        materialType: 'aluminum',
        thickness: 8,
        laserPower: 2500,
        cuttingSpeed: 2000,
        assistGas: 'oxygen', // Not optimal for aluminum
        gasPressure: 1.5,
        nozzleDiameter: 1.5,
        nozzleStandoff: 1.0,
        currentDrossLevel: 'moderate'
      };

      const validation = calculator.validateInputs(suboptimalGasInputs);
      expect(validation.warnings.some(w => w.code === 'SUBOPTIMAL_GAS')).toBe(true);
    });

    test('should warn about suboptimal pressure', () => {
      const suboptimalPressureInputs: DrossFormationInputs = {
        materialType: 'stainless_steel',
        thickness: 8,
        laserPower: 2500,
        cuttingSpeed: 2000,
        assistGas: 'nitrogen',
        gasPressure: 5, // Too low for nitrogen on stainless steel
        nozzleDiameter: 1.5,
        nozzleStandoff: 1.0,
        currentDrossLevel: 'moderate'
      };

      const validation = calculator.validateInputs(suboptimalPressureInputs);
      expect(validation.warnings.some(w => w.code === 'SUBOPTIMAL_PRESSURE')).toBe(true);
    });
  });

  describe('Dross Formation Analysis', () => {
    test('should analyze dross formation for steel cutting', async () => {
      const inputs: DrossFormationInputs = {
        materialType: 'steel',
        thickness: 8,
        laserPower: 2500,
        cuttingSpeed: 2000,
        assistGas: 'oxygen',
        gasPressure: 1.5,
        nozzleDiameter: 1.5,
        nozzleStandoff: 1.0,
        currentDrossLevel: 'moderate'
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.drossRiskScore).toBeGreaterThanOrEqual(0);
        expect(result.data.drossRiskScore).toBeLessThanOrEqual(10);
        expect(result.data.drossRiskLevel).toMatch(/low|medium|high|critical/);
        expect(result.data.drossAnalysis).toBeDefined();
        expect(result.data.meltEjectionAnalysis).toBeDefined();
        expect(result.data.bottomEdgeQuality).toBeDefined();
      }
    });

    test('should analyze dross formation for stainless steel', async () => {
      const inputs: DrossFormationInputs = {
        materialType: 'stainless_steel',
        thickness: 10,
        laserPower: 3000,
        cuttingSpeed: 1800,
        assistGas: 'nitrogen',
        gasPressure: 15,
        nozzleDiameter: 2.0,
        nozzleStandoff: 1.4,
        currentDrossLevel: 'heavy'
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        // Stainless steel should have higher dross formation tendency
        expect(result.data.drossAnalysis.severityScore).toBeGreaterThanOrEqual(4);
        expect(result.data.drossRiskScore).toBeGreaterThan(3);
      }
    });

    test('should analyze dross formation mechanism', async () => {
      const inputs: DrossFormationInputs = {
        materialType: 'copper',
        thickness: 6,
        laserPower: 4000,
        cuttingSpeed: 1500,
        assistGas: 'nitrogen',
        gasPressure: 20,
        nozzleDiameter: 1.8,
        nozzleStandoff: 1.2,
        currentDrossLevel: 'severe'
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.drossAnalysis.formationMechanism).toBeDefined();
        expect(typeof result.data.drossAnalysis.formationMechanism).toBe('string');
        expect(Array.isArray(result.data.drossAnalysis.primaryCauses)).toBe(true);
        expect(result.data.drossAnalysis.severityScore).toBe(5); // Severe = 5
        expect(result.data.drossAnalysis.attachmentStrength).toMatch(/weak|moderate|strong/);
        expect(result.data.drossAnalysis.removalDifficulty).toMatch(/easy|moderate|difficult/);
      }
    });

    test('should analyze melt ejection effectiveness', async () => {
      const inputs: DrossFormationInputs = {
        materialType: 'titanium',
        thickness: 5,
        laserPower: 2200,
        cuttingSpeed: 1200,
        assistGas: 'argon',
        gasPressure: 10,
        nozzleDiameter: 1.6,
        nozzleStandoff: 1.1,
        currentDrossLevel: 'minimal'
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.meltEjectionAnalysis.ejectionEfficiency).toBeGreaterThanOrEqual(0);
        expect(result.data.meltEjectionAnalysis.ejectionEfficiency).toBeLessThanOrEqual(1);
        expect(result.data.meltEjectionAnalysis.gasFlowEffectiveness).toBeGreaterThanOrEqual(0);
        expect(result.data.meltEjectionAnalysis.gasFlowEffectiveness).toBeLessThanOrEqual(1);
        expect(result.data.meltEjectionAnalysis.meltViscosity).toBeGreaterThan(0);
        expect(result.data.meltEjectionAnalysis.ejectionVelocity).toBeGreaterThan(0);
        expect(result.data.meltEjectionAnalysis.turbulenceLevel).toMatch(/low|medium|high/);
      }
    });

    test('should assess bottom edge quality', async () => {
      const inputs: DrossFormationInputs = {
        materialType: 'brass',
        thickness: 7,
        laserPower: 2800,
        cuttingSpeed: 2200,
        assistGas: 'nitrogen',
        gasPressure: 14,
        nozzleDiameter: 1.7,
        nozzleStandoff: 1.2,
        currentDrossLevel: 'moderate'
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.bottomEdgeQuality.qualityGrade).toBeGreaterThanOrEqual(1);
        expect(result.data.bottomEdgeQuality.qualityGrade).toBeLessThanOrEqual(5);
        expect(result.data.bottomEdgeQuality.roughness).toBeGreaterThan(0);
        expect(result.data.bottomEdgeQuality.squareness).toBeGreaterThan(0);
        expect(result.data.bottomEdgeQuality.drossThickness).toBeGreaterThanOrEqual(0);
        expect(result.data.bottomEdgeQuality.cleanCutPercentage).toBeGreaterThanOrEqual(0);
        expect(result.data.bottomEdgeQuality.cleanCutPercentage).toBeLessThanOrEqual(100);
      }
    });

    test('should provide prevention strategy', async () => {
      const inputs: DrossFormationInputs = {
        materialType: 'aluminum',
        thickness: 12,
        laserPower: 3500,
        cuttingSpeed: 1800,
        assistGas: 'oxygen', // Suboptimal for aluminum
        gasPressure: 2, // Low pressure
        nozzleDiameter: 2.0,
        nozzleStandoff: 2.5, // High standoff
        currentDrossLevel: 'heavy'
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.preventionStrategy).toBeDefined();
        expect(result.data.preventionStrategy.parameterOptimization.recommendedPower).toBeLessThanOrEqual(inputs.laserPower);
        expect(result.data.preventionStrategy.parameterOptimization.recommendedSpeed).toBeGreaterThanOrEqual(inputs.cuttingSpeed);
        expect(result.data.preventionStrategy.gasFlowOptimization.optimalFlowRate).toBeGreaterThan(0);
        expect(Array.isArray(result.data.preventionStrategy.processModifications)).toBe(true);
        expect(Array.isArray(result.data.preventionStrategy.maintenanceActions)).toBe(true);
      }
    });

    test('should predict quality outcomes', async () => {
      const inputs: DrossFormationInputs = {
        materialType: 'steel',
        thickness: 15,
        laserPower: 4000,
        cuttingSpeed: 1500,
        assistGas: 'oxygen',
        gasPressure: 2.5,
        nozzleDiameter: 2.2,
        nozzleStandoff: 1.5,
        currentDrossLevel: 'severe'
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.qualityPrediction).toBeDefined();
        expect(result.data.qualityPrediction.expectedDrossLevel).toMatch(/none|minimal|moderate|heavy|severe/);
        expect(result.data.qualityPrediction.bottomEdgeImprovement).toBeGreaterThanOrEqual(0);
        expect(result.data.qualityPrediction.bottomEdgeImprovement).toBeLessThanOrEqual(100);
        expect(result.data.qualityPrediction.cleaningRequirement).toMatch(/none|minimal|moderate|extensive/);
        expect(Array.isArray(result.data.qualityPrediction.secondaryOperations)).toBe(true);
      }
    });

    test('should show gas type effects on dross formation', async () => {
      const oxygenInputs: DrossFormationInputs = {
        materialType: 'stainless_steel',
        thickness: 8,
        laserPower: 2500,
        cuttingSpeed: 2000,
        assistGas: 'oxygen', // Not optimal for stainless steel
        gasPressure: 2,
        nozzleDiameter: 1.5,
        nozzleStandoff: 1.0,
        currentDrossLevel: 'moderate'
      };

      const nitrogenInputs: DrossFormationInputs = {
        ...oxygenInputs,
        assistGas: 'nitrogen', // Optimal for stainless steel
        gasPressure: 15
      };

      const oxygenResult = await calculator.calculate(oxygenInputs);
      const nitrogenResult = await calculator.calculate(nitrogenInputs);
      
      expect(oxygenResult.success).toBe(true);
      expect(nitrogenResult.success).toBe(true);
      
      if (oxygenResult.data && nitrogenResult.data) {
        // Nitrogen should result in lower dross risk for stainless steel
        expect(nitrogenResult.data.drossRiskScore).toBeLessThan(oxygenResult.data.drossRiskScore);
        expect(nitrogenResult.data.meltEjectionAnalysis.ejectionEfficiency).toBeGreaterThan(
          oxygenResult.data.meltEjectionAnalysis.ejectionEfficiency
        );
      }
    });

    test('should show thickness effects on dross formation', async () => {
      const thinInputs: DrossFormationInputs = {
        materialType: 'steel',
        thickness: 3, // Thin material
        laserPower: 1500,
        cuttingSpeed: 3000,
        assistGas: 'oxygen',
        gasPressure: 1.2,
        nozzleDiameter: 1.2,
        nozzleStandoff: 0.8,
        currentDrossLevel: 'minimal'
      };

      const thickInputs: DrossFormationInputs = {
        ...thinInputs,
        thickness: 20, // Thick material
        laserPower: 5000,
        cuttingSpeed: 1000,
        gasPressure: 3.0,
        nozzleDiameter: 2.5,
        currentDrossLevel: 'heavy'
      };

      const thinResult = await calculator.calculate(thinInputs);
      const thickResult = await calculator.calculate(thickInputs);
      
      expect(thinResult.success).toBe(true);
      expect(thickResult.success).toBe(true);
      
      if (thinResult.data && thickResult.data) {
        // Thick material should generally have higher dross risk
        expect(thickResult.data.drossRiskScore).toBeGreaterThan(thinResult.data.drossRiskScore);
        expect(thickResult.data.drossAnalysis.severityScore).toBeGreaterThan(
          thinResult.data.drossAnalysis.severityScore
        );
      }
    });

    test('should include calculation metadata', async () => {
      const inputs: DrossFormationInputs = {
        materialType: 'steel',
        thickness: 8,
        laserPower: 2500,
        cuttingSpeed: 2000,
        assistGas: 'oxygen',
        gasPressure: 1.5,
        nozzleDiameter: 1.5,
        nozzleStandoff: 1.0,
        currentDrossLevel: 'moderate'
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
      const lowRiskInputs: DrossFormationInputs = {
        materialType: 'aluminum', // Lower dross tendency
        thickness: 4,             // Thin material
        laserPower: 2000,         // Moderate power
        cuttingSpeed: 4000,       // High speed
        assistGas: 'nitrogen',    // Optimal for aluminum
        gasPressure: 18,          // High pressure
        nozzleDiameter: 1.5,
        nozzleStandoff: 1.0,      // Optimal standoff
        currentDrossLevel: 'minimal'
      };

      const result = await calculator.calculate(lowRiskInputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.drossRiskLevel).toMatch(/low|medium/);
        expect(result.data.drossRiskScore).toBeLessThan(6);
      }
    });

    test('should classify high risk correctly', async () => {
      const highRiskInputs: DrossFormationInputs = {
        materialType: 'copper',   // High dross tendency
        thickness: 25,            // Very thick material
        laserPower: 6000,         // High power
        cuttingSpeed: 800,        // Low speed
        assistGas: 'air',         // Suboptimal gas
        gasPressure: 2,           // Low pressure
        nozzleDiameter: 1.0,
        nozzleStandoff: 3.0,      // High standoff
        currentDrossLevel: 'severe'
      };

      const result = await calculator.calculate(highRiskInputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.drossRiskLevel).toMatch(/high|critical/);
        expect(result.data.drossRiskScore).toBeGreaterThan(6);
        expect(result.data.warnings.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Material-Specific Behavior', () => {
    test('should handle copper with high dross tendency', async () => {
      const copperInputs: DrossFormationInputs = {
        materialType: 'copper',
        thickness: 8,
        laserPower: 3000,
        cuttingSpeed: 1500,
        assistGas: 'nitrogen',
        gasPressure: 20,
        nozzleDiameter: 1.8,
        nozzleStandoff: 1.2,
        currentDrossLevel: 'heavy'
      };

      const result = await calculator.calculate(copperInputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        // Copper should have high dross formation tendency
        expect(result.data.drossRiskScore).toBeGreaterThan(4);
        expect(result.data.meltEjectionAnalysis.meltViscosity).toBeGreaterThan(1.0);
      }
    });

    test('should recommend optimal gas for each material', async () => {
      const materials: Array<{ material: DrossFormationInputs['materialType'], expectedGas: string }> = [
        { material: 'steel', expectedGas: 'oxygen' },
        { material: 'stainless_steel', expectedGas: 'nitrogen' },
        { material: 'aluminum', expectedGas: 'nitrogen' },
        { material: 'titanium', expectedGas: 'argon' },
        { material: 'copper', expectedGas: 'nitrogen' },
        { material: 'brass', expectedGas: 'nitrogen' }
      ];

      for (const { material, expectedGas } of materials) {
        const inputs: DrossFormationInputs = {
          materialType: material,
          thickness: 8,
          laserPower: 2500,
          cuttingSpeed: 2000,
          assistGas: 'air', // Suboptimal gas
          gasPressure: 5,
          nozzleDiameter: 1.5,
          nozzleStandoff: 1.0,
          currentDrossLevel: 'moderate'
        };

        const result = await calculator.calculate(inputs);
        
        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        
        if (result.data) {
          expect(result.data.recommendations.some(r => r.includes(expectedGas))).toBe(true);
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
      expect(defaults.nozzleDiameter).toBeGreaterThan(0);
      expect(defaults.nozzleStandoff).toBeGreaterThan(0);
      expect(defaults.currentDrossLevel).toBeDefined();
      
      const validation = calculator.validateInputs(defaults);
      expect(validation.isValid).toBe(true);
    });

    test('should provide valid example inputs', () => {
      const examples = calculator.getExampleInputs();
      
      expect(examples.materialType).toBe('steel');
      expect(examples.thickness).toBe(8);
      expect(examples.laserPower).toBe(2500);
      expect(examples.cuttingSpeed).toBe(2000);
      expect(examples.assistGas).toBe('oxygen');
      expect(examples.gasPressure).toBe(1.5);
      expect(examples.nozzleDiameter).toBe(1.5);
      expect(examples.nozzleStandoff).toBe(1.0);
      expect(examples.currentDrossLevel).toBe('moderate');
      
      const validation = calculator.validateInputs(examples);
      expect(validation.isValid).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    test('should handle minimum thickness', async () => {
      const minInputs: DrossFormationInputs = {
        materialType: 'aluminum',
        thickness: 0.5, // Minimum thickness
        laserPower: 1000,
        cuttingSpeed: 5000,
        assistGas: 'nitrogen',
        gasPressure: 15,
        nozzleDiameter: 1.0,
        nozzleStandoff: 0.7,
        currentDrossLevel: 'none'
      };

      const result = await calculator.calculate(minInputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.drossRiskScore).toBeGreaterThanOrEqual(0);
        expect(result.data.bottomEdgeQuality.qualityGrade).toBeGreaterThanOrEqual(1);
      }
    });

    test('should handle maximum thickness', async () => {
      const maxInputs: DrossFormationInputs = {
        materialType: 'steel',
        thickness: 50, // Maximum thickness
        laserPower: 15000,
        cuttingSpeed: 500,
        assistGas: 'oxygen',
        gasPressure: 5,
        nozzleDiameter: 3.0,
        nozzleStandoff: 2.0,
        currentDrossLevel: 'severe'
      };

      const result = await calculator.calculate(maxInputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.drossRiskScore).toBeGreaterThan(5); // Thick material should increase risk
        expect(result.data.warnings.length).toBeGreaterThan(0);
      }
    });

    test('should handle severe dross level', async () => {
      const severeInputs: DrossFormationInputs = {
        materialType: 'stainless_steel',
        thickness: 12,
        laserPower: 4000,
        cuttingSpeed: 1200,
        assistGas: 'air', // Suboptimal
        gasPressure: 3,   // Low for stainless steel
        nozzleDiameter: 1.5,
        nozzleStandoff: 2.5, // High standoff
        currentDrossLevel: 'severe'
      };

      const result = await calculator.calculate(severeInputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.drossAnalysis.severityScore).toBe(5);
        expect(result.data.drossAnalysis.attachmentStrength).toBe('strong');
        expect(result.data.drossAnalysis.removalDifficulty).toBe('difficult');
        expect(result.data.qualityPrediction.cleaningRequirement).toMatch(/moderate|extensive/);
      }
    });
  });

  describe('Performance', () => {
    test('should complete calculations within reasonable time', async () => {
      const inputs: DrossFormationInputs = {
        materialType: 'steel',
        thickness: 8,
        laserPower: 2500,
        cuttingSpeed: 2000,
        assistGas: 'oxygen',
        gasPressure: 1.5,
        nozzleDiameter: 1.5,
        nozzleStandoff: 1.0,
        currentDrossLevel: 'moderate'
      };

      const startTime = performance.now();
      const result = await calculator.calculate(inputs);
      const endTime = performance.now();
      
      expect(result.success).toBe(true);
      expect(endTime - startTime).toBeLessThan(100); // Should complete in <100ms
    });
  });
});
