// Test suite for Beam Quality Calculator
// Comprehensive testing of beam quality analysis and optical calculations

import { describe, test, expect, beforeEach } from 'vitest';
import { BeamQualityCalculator, BeamQualityInputs } from '../BeamQualityCalculator';

describe('BeamQualityCalculator', () => {
  let calculator: BeamQualityCalculator;

  beforeEach(() => {
    calculator = new BeamQualityCalculator();
  });

  describe('Configuration', () => {
    test('should have correct calculator configuration', () => {
      expect(calculator.config.id).toBe('beam-quality-calculator');
      expect(calculator.config.title).toBe('Beam Quality Calculator');
      expect(calculator.config.category).toBe('Core Engineering');
      expect(calculator.config.badge).toBe('Standard');
      expect(calculator.config.inputs).toHaveLength(6);
    });

    test('should have all required input fields', () => {
      const inputIds = calculator.config.inputs.map(input => input.id);
      expect(inputIds).toContain('laserType');
      expect(inputIds).toContain('wavelength');
      expect(inputIds).toContain('power');
      expect(inputIds).toContain('beamDiameter');
      expect(inputIds).toContain('divergenceAngle');
      expect(inputIds).toContain('focalLength');
    });
  });

  describe('Input Validation', () => {
    test('should validate correct inputs', () => {
      const validInputs: BeamQualityInputs = {
        laserType: 'fiber',
        wavelength: 1.064,
        power: 3000,
        beamDiameter: 0.2,
        divergenceAngle: 1.0,
        focalLength: 100
      };

      const validation = calculator.validateInputs(validInputs);
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    test('should reject invalid laser type', () => {
      const invalidInputs = {
        laserType: 'invalid_laser',
        wavelength: 1.064,
        power: 3000,
        beamDiameter: 0.2,
        divergenceAngle: 1.0,
        focalLength: 100
      };

      const validation = calculator.validateInputs(invalidInputs);
      expect(validation.isValid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
    });

    test('should reject wavelength out of range', () => {
      const invalidInputs: BeamQualityInputs = {
        laserType: 'fiber',
        wavelength: 0.5, // Below min of 0.8
        power: 3000,
        beamDiameter: 0.2,
        divergenceAngle: 1.0,
        focalLength: 100
      };

      const validation = calculator.validateInputs(invalidInputs);
      expect(validation.isValid).toBe(false);
      expect(validation.errors.some(e => e.field === 'wavelength')).toBe(true);
    });

    test('should warn about unusual wavelength for laser type', () => {
      const unusualInputs: BeamQualityInputs = {
        laserType: 'fiber',
        wavelength: 10.6, // CO2 wavelength for fiber laser
        power: 3000,
        beamDiameter: 0.2,
        divergenceAngle: 1.0,
        focalLength: 100
      };

      const validation = calculator.validateInputs(unusualInputs);
      expect(validation.warnings.some(w => w.code === 'UNUSUAL_WAVELENGTH')).toBe(true);
    });

    test('should warn about high power density', () => {
      const highPowerInputs: BeamQualityInputs = {
        laserType: 'fiber',
        wavelength: 1.064,
        power: 10000, // High power
        beamDiameter: 0.05, // Small beam = high power density
        divergenceAngle: 1.0,
        focalLength: 100
      };

      const validation = calculator.validateInputs(highPowerInputs);
      expect(validation.warnings.some(w => w.code === 'HIGH_POWER_DENSITY')).toBe(true);
    });
  });

  describe('Beam Quality Calculations', () => {
    test('should calculate beam quality for fiber laser', async () => {
      const inputs: BeamQualityInputs = {
        laserType: 'fiber',
        wavelength: 1.064,
        power: 3000,
        beamDiameter: 0.2,
        divergenceAngle: 1.0,
        focalLength: 100
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.mSquaredFactor).toBeGreaterThanOrEqual(1.0);
        expect(result.data.beamParameterProduct).toBeGreaterThan(0);
        expect(result.data.rayleighLength).toBeGreaterThan(0);
        expect(result.data.focusedSpotSize).toBeGreaterThan(0);
        expect(result.data.powerDensity).toBeGreaterThan(0);
        expect(result.data.beamQualityGrade).toMatch(/excellent|good|fair|poor/);
      }
    });

    test('should calculate beam quality for CO2 laser', async () => {
      const inputs: BeamQualityInputs = {
        laserType: 'co2',
        wavelength: 10.6,
        power: 5000,
        beamDiameter: 0.3,
        divergenceAngle: 0.8,
        focalLength: 150
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        // CO2 lasers typically have excellent beam quality
        expect(result.data.mSquaredFactor).toBeLessThan(1.2);
        expect(result.data.beamQualityGrade).toMatch(/excellent|good/);
        expect(result.data.focusedSpotSize).toBeGreaterThan(5); // Larger due to longer wavelength
      }
    });

    test('should calculate beam quality for diode laser', async () => {
      const inputs: BeamQualityInputs = {
        laserType: 'diode',
        wavelength: 0.808,
        power: 1000,
        beamDiameter: 0.5,
        divergenceAngle: 5.0, // Higher divergence for diode
        focalLength: 50
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        // Diode lasers typically have poor beam quality
        expect(result.data.mSquaredFactor).toBeGreaterThan(1.5);
        expect(result.data.beamQualityGrade).toMatch(/fair|poor/);
      }
    });

    test('should provide optical analysis', async () => {
      const inputs: BeamQualityInputs = {
        laserType: 'nd_yag',
        wavelength: 1.064,
        power: 2000,
        beamDiameter: 0.25,
        divergenceAngle: 1.5,
        focalLength: 120
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.opticalAnalysis).toBeDefined();
        expect(result.data.opticalAnalysis.diffrationLimit).toBeGreaterThan(0);
        expect(result.data.opticalAnalysis.focusability).toBeGreaterThan(0);
        expect(result.data.opticalAnalysis.focusability).toBeLessThanOrEqual(1);
        expect(result.data.opticalAnalysis.beamPropagation).toBeDefined();
      }
    });

    test('should assess cutting performance', async () => {
      const inputs: BeamQualityInputs = {
        laserType: 'disk',
        wavelength: 1.030,
        power: 8000,
        beamDiameter: 0.15,
        divergenceAngle: 0.9,
        focalLength: 80
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.cuttingPerformance).toBeDefined();
        expect(result.data.cuttingPerformance.edgeQuality).toMatch(/excellent|good|fair|poor/);
        expect(result.data.cuttingPerformance.cuttingSpeed).toMatch(/very_fast|fast|medium|slow/);
        expect(result.data.cuttingPerformance.thicknessCapability).toBeGreaterThan(0);
        expect(result.data.cuttingPerformance.precisionLevel).toMatch(/ultra|high|medium|standard/);
      }
    });

    test('should calculate laser characteristics', async () => {
      const inputs: BeamQualityInputs = {
        laserType: 'fiber',
        wavelength: 1.064,
        power: 4000,
        beamDiameter: 0.18,
        divergenceAngle: 1.2,
        focalLength: 100
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.laserCharacteristics).toBeDefined();
        expect(result.data.laserCharacteristics.coherenceLength).toBeGreaterThan(0);
        expect(result.data.laserCharacteristics.brightness).toBeGreaterThan(0);
        expect(result.data.laserCharacteristics.beamDivergence).toBeGreaterThan(0);
        expect(result.data.laserCharacteristics.numericalAperture).toBeGreaterThan(0);
      }
    });

    test('should handle missing optional parameters', async () => {
      const inputs: BeamQualityInputs = {
        laserType: 'fiber',
        wavelength: 1.064,
        power: 3000,
        beamDiameter: 0.2
        // divergenceAngle and focalLength omitted
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        // Should still provide meaningful results with estimated values
        expect(result.data.mSquaredFactor).toBeGreaterThanOrEqual(1.0);
        expect(result.data.focusedSpotSize).toBeGreaterThan(0);
      }
    });

    test('should show relationship between M² and beam quality grade', async () => {
      const excellentInputs: BeamQualityInputs = {
        laserType: 'co2',
        wavelength: 10.6,
        power: 3000,
        beamDiameter: 0.2,
        divergenceAngle: 0.5, // Very low divergence
        focalLength: 100
      };

      const poorInputs: BeamQualityInputs = {
        laserType: 'diode',
        wavelength: 0.808,
        power: 1000,
        beamDiameter: 0.5,
        divergenceAngle: 10.0, // High divergence
        focalLength: 50
      };

      const excellentResult = await calculator.calculate(excellentInputs);
      const poorResult = await calculator.calculate(poorInputs);
      
      expect(excellentResult.success).toBe(true);
      expect(poorResult.success).toBe(true);
      
      if (excellentResult.data && poorResult.data) {
        expect(excellentResult.data.mSquaredFactor).toBeLessThan(poorResult.data.mSquaredFactor);
        expect(excellentResult.data.beamQualityGrade).not.toBe('poor');
        expect(poorResult.data.beamQualityGrade).toMatch(/fair|poor/);
      }
    });

    test('should include calculation metadata', async () => {
      const inputs: BeamQualityInputs = {
        laserType: 'fiber',
        wavelength: 1.064,
        power: 3000,
        beamDiameter: 0.2,
        divergenceAngle: 1.0,
        focalLength: 100
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

  describe('Physical Relationships', () => {
    test('should show inverse relationship between M² and focusability', async () => {
      const goodBeamInputs: BeamQualityInputs = {
        laserType: 'fiber',
        wavelength: 1.064,
        power: 3000,
        beamDiameter: 0.2,
        divergenceAngle: 0.8,
        focalLength: 100
      };

      const poorBeamInputs: BeamQualityInputs = {
        ...goodBeamInputs,
        divergenceAngle: 3.0 // Higher divergence = higher M²
      };

      const goodResult = await calculator.calculate(goodBeamInputs);
      const poorResult = await calculator.calculate(poorBeamInputs);
      
      expect(goodResult.success).toBe(true);
      expect(poorResult.success).toBe(true);
      
      if (goodResult.data && poorResult.data) {
        expect(goodResult.data.mSquaredFactor).toBeLessThan(poorResult.data.mSquaredFactor);
        expect(goodResult.data.opticalAnalysis.focusability).toBeGreaterThan(
          poorResult.data.opticalAnalysis.focusability
        );
      }
    });

    test('should show wavelength effects on spot size', async () => {
      const shortWavelengthInputs: BeamQualityInputs = {
        laserType: 'fiber',
        wavelength: 1.064,
        power: 3000,
        beamDiameter: 0.2,
        divergenceAngle: 1.0,
        focalLength: 100
      };

      const longWavelengthInputs: BeamQualityInputs = {
        ...shortWavelengthInputs,
        laserType: 'co2',
        wavelength: 10.6
      };

      const shortResult = await calculator.calculate(shortWavelengthInputs);
      const longResult = await calculator.calculate(longWavelengthInputs);
      
      expect(shortResult.success).toBe(true);
      expect(longResult.success).toBe(true);
      
      if (shortResult.data && longResult.data) {
        // Longer wavelength should result in larger focused spot size
        expect(longResult.data.focusedSpotSize).toBeGreaterThan(shortResult.data.focusedSpotSize);
      }
    });
  });

  describe('Default and Example Inputs', () => {
    test('should provide valid default inputs', () => {
      const defaults = calculator.getDefaultInputs();
      
      expect(defaults.laserType).toBeDefined();
      expect(defaults.wavelength).toBeGreaterThan(0);
      expect(defaults.power).toBeGreaterThan(0);
      expect(defaults.beamDiameter).toBeGreaterThan(0);
      
      const validation = calculator.validateInputs(defaults);
      expect(validation.isValid).toBe(true);
    });

    test('should provide valid example inputs', () => {
      const examples = calculator.getExampleInputs();
      
      expect(examples.laserType).toBe('fiber');
      expect(examples.wavelength).toBe(1.064);
      expect(examples.power).toBe(3000);
      expect(examples.beamDiameter).toBe(0.2);
      expect(examples.divergenceAngle).toBe(1.0);
      expect(examples.focalLength).toBe(100);
      
      const validation = calculator.validateInputs(examples);
      expect(validation.isValid).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    test('should handle minimum beam diameter', async () => {
      const minInputs: BeamQualityInputs = {
        laserType: 'fiber',
        wavelength: 1.064,
        power: 1000,
        beamDiameter: 0.01, // Minimum beam diameter
        divergenceAngle: 2.0,
        focalLength: 50
      };

      const result = await calculator.calculate(minInputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.focusedSpotSize).toBeGreaterThan(0);
        expect(result.data.warnings.length).toBeGreaterThan(0); // Should warn about small beam
      }
    });

    test('should handle maximum power', async () => {
      const maxInputs: BeamQualityInputs = {
        laserType: 'disk',
        wavelength: 1.030,
        power: 50000, // Maximum power
        beamDiameter: 1.0,
        divergenceAngle: 1.0,
        focalLength: 200
      };

      const result = await calculator.calculate(maxInputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.powerDensity).toBeGreaterThan(10); // High power density expected
        expect(result.data.cuttingPerformance.cuttingSpeed).toMatch(/very_fast|fast/);
      }
    });
  });

  describe('Performance', () => {
    test('should complete calculations within reasonable time', async () => {
      const inputs: BeamQualityInputs = {
        laserType: 'fiber',
        wavelength: 1.064,
        power: 3000,
        beamDiameter: 0.2,
        divergenceAngle: 1.0,
        focalLength: 100
      };

      const startTime = performance.now();
      const result = await calculator.calculate(inputs);
      const endTime = performance.now();
      
      expect(result.success).toBe(true);
      expect(endTime - startTime).toBeLessThan(100); // Should complete in <100ms
    });
  });
});
