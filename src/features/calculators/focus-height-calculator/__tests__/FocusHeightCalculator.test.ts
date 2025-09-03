// Test suite for Focus Height Calculator
// Comprehensive testing of focus height optimization and beam analysis

import { describe, test, expect, beforeEach } from 'vitest';
import { FocusHeightCalculator, FocusHeightInputs } from '../FocusHeightCalculator';

describe('FocusHeightCalculator', () => {
  let calculator: FocusHeightCalculator;

  beforeEach(() => {
    calculator = new FocusHeightCalculator();
  });

  describe('Configuration', () => {
    test('should have correct calculator configuration', () => {
      expect(calculator.config.id).toBe('focus-height-calculator');
      expect(calculator.config.title).toBe('Focus Height Calculator');
      expect(calculator.config.category).toBe('Process Optimization');
      expect(calculator.config.badge).toBe('Standard');
      expect(calculator.config.inputs).toHaveLength(9);
    });

    test('should have all required input fields', () => {
      const inputIds = calculator.config.inputs.map(input => input.id);
      expect(inputIds).toContain('materialType');
      expect(inputIds).toContain('thickness');
      expect(inputIds).toContain('laserType');
      expect(inputIds).toContain('focalLength');
      expect(inputIds).toContain('beamDiameter');
      expect(inputIds).toContain('cuttingApplication');
      expect(inputIds).toContain('qualityRequirement');
      expect(inputIds).toContain('assistGas');
      expect(inputIds).toContain('currentFocusHeight');
    });
  });

  describe('Input Validation', () => {
    test('should validate correct inputs', () => {
      const validInputs: FocusHeightInputs = {
        materialType: 'steel',
        thickness: 5,
        laserType: 'fiber',
        focalLength: 127,
        beamDiameter: 6,
        cuttingApplication: 'through_cut',
        qualityRequirement: 'standard',
        assistGas: 'oxygen'
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
        focalLength: 127,
        beamDiameter: 6,
        cuttingApplication: 'through_cut',
        qualityRequirement: 'standard',
        assistGas: 'oxygen'
      };

      const validation = calculator.validateInputs(invalidInputs);
      expect(validation.isValid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
    });

    test('should warn about low f-number', () => {
      const lowFNumberInputs: FocusHeightInputs = {
        materialType: 'steel',
        thickness: 5,
        laserType: 'fiber',
        focalLength: 50, // Low focal length
        beamDiameter: 25, // Large beam diameter
        cuttingApplication: 'through_cut',
        qualityRequirement: 'standard',
        assistGas: 'oxygen'
      };

      const validation = calculator.validateInputs(lowFNumberInputs);
      expect(validation.warnings.some(w => w.code === 'LOW_F_NUMBER')).toBe(true);
    });

    test('should warn about challenging welding', () => {
      const challengingInputs: FocusHeightInputs = {
        materialType: 'copper',
        thickness: 5,
        laserType: 'fiber',
        focalLength: 127,
        beamDiameter: 6,
        cuttingApplication: 'welding', // Challenging with copper
        qualityRequirement: 'standard',
        assistGas: 'nitrogen'
      };

      const validation = calculator.validateInputs(challengingInputs);
      expect(validation.warnings.some(w => w.code === 'CHALLENGING_WELDING')).toBe(true);
    });

    test('should warn about suboptimal laser-material combination', () => {
      const suboptimalInputs: FocusHeightInputs = {
        materialType: 'steel',
        thickness: 5,
        laserType: 'co2', // Not optimal for steel
        focalLength: 127,
        beamDiameter: 6,
        cuttingApplication: 'through_cut',
        qualityRequirement: 'standard',
        assistGas: 'oxygen'
      };

      const validation = calculator.validateInputs(suboptimalInputs);
      expect(validation.warnings.some(w => w.code === 'SUBOPTIMAL_LASER_MATERIAL')).toBe(true);
    });
  });

  describe('Focus Height Optimization', () => {
    test('should calculate optimal focus for steel through cutting', async () => {
      const inputs: FocusHeightInputs = {
        materialType: 'steel',
        thickness: 5,
        laserType: 'fiber',
        focalLength: 127,
        beamDiameter: 6,
        cuttingApplication: 'through_cut',
        qualityRequirement: 'standard',
        assistGas: 'oxygen'
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.optimalFocus).toBeDefined();
        expect(result.data.optimalFocus.position).toBeLessThan(0); // Should be into material
        expect(result.data.optimalFocus.position).toBeGreaterThan(-inputs.thickness);
        expect(result.data.optimalFocus.unit).toBe('mm');
        expect(result.data.optimalFocus.tolerance).toBeGreaterThan(0);
        expect(result.data.optimalFocus.confidence).toBeGreaterThan(0.5);
        expect(Array.isArray(result.data.optimalFocus.reasoning)).toBe(true);
      }
    });

    test('should calculate beam characteristics correctly', async () => {
      const inputs: FocusHeightInputs = {
        materialType: 'aluminum',
        thickness: 3,
        laserType: 'fiber',
        focalLength: 127,
        beamDiameter: 6,
        cuttingApplication: 'through_cut',
        qualityRequirement: 'precision',
        assistGas: 'nitrogen'
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.beamCharacteristics).toBeDefined();
        expect(result.data.beamCharacteristics.spotSize).toBeGreaterThan(0);
        expect(result.data.beamCharacteristics.powerDensity).toBeGreaterThan(0);
        expect(result.data.beamCharacteristics.rayleighRange).toBeGreaterThan(0);
        expect(result.data.beamCharacteristics.depthOfFocus).toBeGreaterThan(0);
        expect(result.data.beamCharacteristics.beamQuality).toBeGreaterThan(1);
        expect(result.data.beamCharacteristics.numericalAperture).toBeGreaterThan(0);
      }
    });

    test('should generate focus position table', async () => {
      const inputs: FocusHeightInputs = {
        materialType: 'stainless_steel',
        thickness: 8,
        laserType: 'fiber',
        focalLength: 127,
        beamDiameter: 6,
        cuttingApplication: 'through_cut',
        qualityRequirement: 'standard',
        assistGas: 'nitrogen'
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.focusPositionTable).toBeDefined();
        expect(Array.isArray(result.data.focusPositionTable)).toBe(true);
        expect(result.data.focusPositionTable.length).toBeGreaterThan(0);
        
        result.data.focusPositionTable.forEach(position => {
          expect(position.application).toBeDefined();
          expect(typeof position.position).toBe('number');
          expect(position.description).toBeDefined();
          expect(position.qualityImpact).toBeGreaterThanOrEqual(1);
          expect(position.qualityImpact).toBeLessThanOrEqual(10);
          expect(position.suitability).toMatch(/excellent|good|acceptable|poor/);
        });
      }
    });

    test('should predict quality outcomes', async () => {
      const inputs: FocusHeightInputs = {
        materialType: 'copper',
        thickness: 4,
        laserType: 'fiber',
        focalLength: 127,
        beamDiameter: 6,
        cuttingApplication: 'through_cut',
        qualityRequirement: 'precision',
        assistGas: 'nitrogen'
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.qualityPrediction).toBeDefined();
        expect(result.data.qualityPrediction.topEdgeQuality).toBeGreaterThanOrEqual(1);
        expect(result.data.qualityPrediction.topEdgeQuality).toBeLessThanOrEqual(10);
        expect(result.data.qualityPrediction.bottomEdgeQuality).toBeGreaterThanOrEqual(1);
        expect(result.data.qualityPrediction.bottomEdgeQuality).toBeLessThanOrEqual(10);
        expect(result.data.qualityPrediction.kerfTaper).toBeGreaterThanOrEqual(0);
        expect(result.data.qualityPrediction.heatAffectedZone).toBeGreaterThan(0);
        expect(result.data.qualityPrediction.overallQuality).toMatch(/excellent|good|acceptable|poor/);
      }
    });

    test('should provide adjustment guidance', async () => {
      const inputs: FocusHeightInputs = {
        materialType: 'titanium',
        thickness: 6,
        laserType: 'fiber',
        focalLength: 127,
        beamDiameter: 6,
        cuttingApplication: 'through_cut',
        qualityRequirement: 'precision',
        assistGas: 'argon'
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.adjustmentGuidance).toBeDefined();
        expect(Array.isArray(result.data.adjustmentGuidance.setupInstructions)).toBe(true);
        expect(Array.isArray(result.data.adjustmentGuidance.calibrationSteps)).toBe(true);
        expect(Array.isArray(result.data.adjustmentGuidance.troubleshooting)).toBe(true);
        expect(Array.isArray(result.data.adjustmentGuidance.maintenanceTips)).toBe(true);
        
        result.data.adjustmentGuidance.troubleshooting.forEach(tip => {
          expect(tip.issue).toBeDefined();
          expect(tip.cause).toBeDefined();
          expect(tip.solution).toBeDefined();
        });
      }
    });

    test('should perform sensitivity analysis', async () => {
      const inputs: FocusHeightInputs = {
        materialType: 'brass',
        thickness: 3,
        laserType: 'fiber',
        focalLength: 127,
        beamDiameter: 6,
        cuttingApplication: 'through_cut',
        qualityRequirement: 'standard',
        assistGas: 'nitrogen'
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.sensitivityAnalysis).toBeDefined();
        expect(Array.isArray(result.data.sensitivityAnalysis.focusVariation)).toBe(true);
        expect(result.data.sensitivityAnalysis.toleranceRecommendation).toBeDefined();
        
        result.data.sensitivityAnalysis.focusVariation.forEach(variation => {
          expect(typeof variation.offset).toBe('number');
          expect(variation.qualityImpact).toBeGreaterThanOrEqual(0);
          expect(variation.description).toBeDefined();
        });
      }
    });

    test('should show application effects on focus position', async () => {
      const throughCutInputs: FocusHeightInputs = {
        materialType: 'steel',
        thickness: 5,
        laserType: 'fiber',
        focalLength: 127,
        beamDiameter: 6,
        cuttingApplication: 'through_cut',
        qualityRequirement: 'standard',
        assistGas: 'oxygen'
      };

      const engravingInputs: FocusHeightInputs = {
        ...throughCutInputs,
        cuttingApplication: 'engraving'
      };

      const throughCutResult = await calculator.calculate(throughCutInputs);
      const engravingResult = await calculator.calculate(engravingInputs);
      
      expect(throughCutResult.success).toBe(true);
      expect(engravingResult.success).toBe(true);
      
      if (throughCutResult.data && engravingResult.data) {
        // Through cutting should have negative focus (into material)
        expect(throughCutResult.data.optimalFocus.position).toBeLessThan(0);
        // Engraving should have surface focus (0mm)
        expect(engravingResult.data.optimalFocus.position).toBe(0);
      }
    });

    test('should show thickness effects on focus position', async () => {
      const thinInputs: FocusHeightInputs = {
        materialType: 'steel',
        thickness: 2, // Thin material
        laserType: 'fiber',
        focalLength: 127,
        beamDiameter: 6,
        cuttingApplication: 'through_cut',
        qualityRequirement: 'standard',
        assistGas: 'oxygen'
      };

      const thickInputs: FocusHeightInputs = {
        ...thinInputs,
        thickness: 15 // Thick material
      };

      const thinResult = await calculator.calculate(thinInputs);
      const thickResult = await calculator.calculate(thickInputs);
      
      expect(thinResult.success).toBe(true);
      expect(thickResult.success).toBe(true);
      
      if (thinResult.data && thickResult.data) {
        // Thick material should have deeper focus position
        expect(Math.abs(thickResult.data.optimalFocus.position)).toBeGreaterThan(
          Math.abs(thinResult.data.optimalFocus.position)
        );
      }
    });

    test('should include calculation metadata', async () => {
      const inputs: FocusHeightInputs = {
        materialType: 'steel',
        thickness: 5,
        laserType: 'fiber',
        focalLength: 127,
        beamDiameter: 6,
        cuttingApplication: 'through_cut',
        qualityRequirement: 'standard',
        assistGas: 'oxygen'
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
    test('should show different beam characteristics for different lasers', async () => {
      const fiberInputs: FocusHeightInputs = {
        materialType: 'steel',
        thickness: 5,
        laserType: 'fiber',
        focalLength: 127,
        beamDiameter: 6,
        cuttingApplication: 'through_cut',
        qualityRequirement: 'standard',
        assistGas: 'oxygen'
      };

      const co2Inputs: FocusHeightInputs = {
        ...fiberInputs,
        laserType: 'co2'
      };

      const fiberResult = await calculator.calculate(fiberInputs);
      const co2Result = await calculator.calculate(co2Inputs);
      
      expect(fiberResult.success).toBe(true);
      expect(co2Result.success).toBe(true);
      
      if (fiberResult.data && co2Result.data) {
        // Different laser types should have different beam characteristics
        expect(fiberResult.data.beamCharacteristics.spotSize).not.toBe(
          co2Result.data.beamCharacteristics.spotSize
        );
        expect(fiberResult.data.beamCharacteristics.beamQuality).not.toBe(
          co2Result.data.beamCharacteristics.beamQuality
        );
      }
    });

    test('should show diode laser beam quality limitations', async () => {
      const diodeInputs: FocusHeightInputs = {
        materialType: 'steel',
        thickness: 5,
        laserType: 'diode',
        focalLength: 127,
        beamDiameter: 6,
        cuttingApplication: 'through_cut',
        qualityRequirement: 'mirror',
        assistGas: 'oxygen'
      };

      const result = await calculator.calculate(diodeInputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        // Diode laser should have higher M² (lower beam quality)
        expect(result.data.beamCharacteristics.beamQuality).toBeGreaterThan(1.5);
        expect(result.data.warnings.some(w => w.includes('beam quality'))).toBe(true);
      }
    });
  });

  describe('Material-Specific Behavior', () => {
    test('should handle different materials correctly', async () => {
      const materials: FocusHeightInputs['materialType'][] = ['steel', 'aluminum', 'stainless_steel', 'copper', 'titanium', 'brass'];
      
      for (const material of materials) {
        const inputs: FocusHeightInputs = {
          materialType: material,
          thickness: 5,
          laserType: 'fiber',
          focalLength: 127,
          beamDiameter: 6,
          cuttingApplication: 'through_cut',
          qualityRequirement: 'standard',
          assistGas: 'nitrogen'
        };

        const result = await calculator.calculate(inputs);
        
        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        
        if (result.data) {
          expect(result.data.optimalFocus.position).toBeLessThan(0); // Should be into material for through cutting
          expect(result.data.beamCharacteristics.spotSize).toBeGreaterThan(0);
        }
      }
    });

    test('should show material reflectivity effects', async () => {
      const steelInputs: FocusHeightInputs = {
        materialType: 'steel', // Low reflectivity
        thickness: 5,
        laserType: 'fiber',
        focalLength: 127,
        beamDiameter: 6,
        cuttingApplication: 'through_cut',
        qualityRequirement: 'standard',
        assistGas: 'oxygen'
      };

      const copperInputs: FocusHeightInputs = {
        ...steelInputs,
        materialType: 'copper', // High reflectivity
        assistGas: 'nitrogen'
      };

      const steelResult = await calculator.calculate(steelInputs);
      const copperResult = await calculator.calculate(copperInputs);
      
      expect(steelResult.success).toBe(true);
      expect(copperResult.success).toBe(true);
      
      if (steelResult.data && copperResult.data) {
        // Copper should have different focus adjustment due to reflectivity
        expect(copperResult.data.optimalFocus.position).not.toBe(steelResult.data.optimalFocus.position);
        expect(copperResult.data.warnings.some(w => w.includes('reflectivity'))).toBe(true);
      }
    });
  });

  describe('Default and Example Inputs', () => {
    test('should provide valid default inputs', () => {
      const defaults = calculator.getDefaultInputs();
      
      expect(defaults.materialType).toBeDefined();
      expect(defaults.thickness).toBeGreaterThan(0);
      expect(defaults.laserType).toBeDefined();
      expect(defaults.focalLength).toBeGreaterThan(0);
      expect(defaults.beamDiameter).toBeGreaterThan(0);
      expect(defaults.cuttingApplication).toBeDefined();
      expect(defaults.qualityRequirement).toBeDefined();
      expect(defaults.assistGas).toBeDefined();
      
      const validation = calculator.validateInputs(defaults);
      expect(validation.isValid).toBe(true);
    });

    test('should provide valid example inputs', () => {
      const examples = calculator.getExampleInputs();
      
      expect(examples.materialType).toBe('steel');
      expect(examples.thickness).toBe(5);
      expect(examples.laserType).toBe('fiber');
      expect(examples.focalLength).toBe(127);
      expect(examples.beamDiameter).toBe(6);
      expect(examples.cuttingApplication).toBe('through_cut');
      expect(examples.qualityRequirement).toBe('standard');
      expect(examples.assistGas).toBe('oxygen');
      
      const validation = calculator.validateInputs(examples);
      expect(validation.isValid).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    test('should handle minimum thickness', async () => {
      const minInputs: FocusHeightInputs = {
        materialType: 'aluminum',
        thickness: 0.1, // Minimum thickness
        laserType: 'fiber',
        focalLength: 127,
        beamDiameter: 6,
        cuttingApplication: 'through_cut',
        qualityRequirement: 'standard',
        assistGas: 'nitrogen'
      };

      const result = await calculator.calculate(minInputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.optimalFocus.position).toBeLessThan(0);
        expect(result.data.beamCharacteristics.spotSize).toBeGreaterThan(0);
      }
    });

    test('should handle maximum thickness', async () => {
      const maxInputs: FocusHeightInputs = {
        materialType: 'steel',
        thickness: 50, // Maximum thickness
        laserType: 'fiber',
        focalLength: 127,
        beamDiameter: 6,
        cuttingApplication: 'through_cut',
        qualityRequirement: 'rough',
        assistGas: 'oxygen'
      };

      const result = await calculator.calculate(maxInputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.optimalFocus.position).toBeLessThan(-10); // Deep focus for thick material
        expect(result.data.warnings.length).toBeGreaterThan(0); // Should warn about thick material
      }
    });

    test('should handle extreme focal lengths', async () => {
      const shortFocalInputs: FocusHeightInputs = {
        materialType: 'steel',
        thickness: 5,
        laserType: 'fiber',
        focalLength: 50, // Minimum focal length
        beamDiameter: 6,
        cuttingApplication: 'through_cut',
        qualityRequirement: 'standard',
        assistGas: 'oxygen'
      };

      const longFocalInputs: FocusHeightInputs = {
        ...shortFocalInputs,
        focalLength: 500 // Maximum focal length
      };

      const shortResult = await calculator.calculate(shortFocalInputs);
      const longResult = await calculator.calculate(longFocalInputs);
      
      expect(shortResult.success).toBe(true);
      expect(longResult.success).toBe(true);
      
      if (shortResult.data && longResult.data) {
        // Different focal lengths should produce different spot sizes
        expect(shortResult.data.beamCharacteristics.spotSize).not.toBe(
          longResult.data.beamCharacteristics.spotSize
        );
      }
    });
  });

  describe('Performance', () => {
    test('should complete calculations within reasonable time', async () => {
      const inputs: FocusHeightInputs = {
        materialType: 'steel',
        thickness: 5,
        laserType: 'fiber',
        focalLength: 127,
        beamDiameter: 6,
        cuttingApplication: 'through_cut',
        qualityRequirement: 'standard',
        assistGas: 'oxygen'
      };

      const startTime = performance.now();
      const result = await calculator.calculate(inputs);
      const endTime = performance.now();
      
      expect(result.success).toBe(true);
      expect(endTime - startTime).toBeLessThan(100); // Should complete in <100ms
    });
  });
});
