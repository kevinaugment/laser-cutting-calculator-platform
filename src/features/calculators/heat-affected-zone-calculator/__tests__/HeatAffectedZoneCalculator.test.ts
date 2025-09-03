// Test suite for Heat Affected Zone Calculator
// Comprehensive testing of HAZ analysis and thermal calculations

import { describe, test, expect, beforeEach } from 'vitest';
import { HeatAffectedZoneCalculator, HeatAffectedZoneInputs } from '../HeatAffectedZoneCalculator';

describe('HeatAffectedZoneCalculator', () => {
  let calculator: HeatAffectedZoneCalculator;

  beforeEach(() => {
    calculator = new HeatAffectedZoneCalculator();
  });

  describe('Configuration', () => {
    test('should have correct calculator configuration', () => {
      expect(calculator.config.id).toBe('heat-affected-zone-calculator');
      expect(calculator.config.title).toBe('Heat Affected Zone Calculator');
      expect(calculator.config.category).toBe('Core Engineering');
      expect(calculator.config.badge).toBe('Standard');
      expect(calculator.config.inputs).toHaveLength(6);
    });

    test('should have all required input fields', () => {
      const inputIds = calculator.config.inputs.map(input => input.id);
      expect(inputIds).toContain('materialType');
      expect(inputIds).toContain('thickness');
      expect(inputIds).toContain('laserPower');
      expect(inputIds).toContain('cuttingSpeed');
      expect(inputIds).toContain('beamDiameter');
      expect(inputIds).toContain('pulseFrequency');
    });
  });

  describe('Input Validation', () => {
    test('should validate correct inputs', () => {
      const validInputs: HeatAffectedZoneInputs = {
        materialType: 'steel',
        thickness: 5,
        laserPower: 3000,
        cuttingSpeed: 2000,
        beamDiameter: 0.2,
        pulseFrequency: 0
      };

      const validation = calculator.validateInputs(validInputs);
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    test('should reject invalid material type', () => {
      const invalidInputs = {
        materialType: 'invalid_material',
        thickness: 5,
        laserPower: 3000,
        cuttingSpeed: 2000,
        beamDiameter: 0.2,
        pulseFrequency: 0
      };

      const validation = calculator.validateInputs(invalidInputs);
      expect(validation.isValid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
    });

    test('should reject thickness out of range', () => {
      const invalidInputs: HeatAffectedZoneInputs = {
        materialType: 'steel',
        thickness: 100, // Above max of 50
        laserPower: 3000,
        cuttingSpeed: 2000,
        beamDiameter: 0.2,
        pulseFrequency: 0
      };

      const validation = calculator.validateInputs(invalidInputs);
      expect(validation.isValid).toBe(false);
      expect(validation.errors.some(e => e.field === 'thickness')).toBe(true);
    });

    test('should generate warnings for high heat input', () => {
      const highHeatInputs: HeatAffectedZoneInputs = {
        materialType: 'steel',
        thickness: 5,
        laserPower: 10000, // High power
        cuttingSpeed: 500,  // Low speed = high heat input
        beamDiameter: 0.2,
        pulseFrequency: 0
      };

      const validation = calculator.validateInputs(highHeatInputs);
      expect(validation.warnings.length).toBeGreaterThan(0);
      expect(validation.warnings.some(w => w.code === 'HIGH_HEAT_INPUT')).toBe(true);
    });

    test('should warn about low power for aluminum', () => {
      const lowPowerAluminum: HeatAffectedZoneInputs = {
        materialType: 'aluminum',
        thickness: 5,
        laserPower: 1000, // Low power for aluminum
        cuttingSpeed: 2000,
        beamDiameter: 0.2,
        pulseFrequency: 0
      };

      const validation = calculator.validateInputs(lowPowerAluminum);
      expect(validation.warnings.some(w => w.code === 'LOW_POWER_ALUMINUM')).toBe(true);
    });
  });

  describe('HAZ Calculations', () => {
    test('should calculate HAZ for steel', async () => {
      const inputs: HeatAffectedZoneInputs = {
        materialType: 'steel',
        thickness: 5,
        laserPower: 3000,
        cuttingSpeed: 2000,
        beamDiameter: 0.2,
        pulseFrequency: 0
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.hazWidth).toBeGreaterThan(0);
        expect(result.data.hazDepth).toBeGreaterThan(0);
        expect(result.data.hazVolume).toBeGreaterThan(0);
        expect(result.data.hazDepth).toBeLessThanOrEqual(inputs.thickness);
        expect(result.data.temperatureProfile).toBeDefined();
        expect(result.data.temperatureProfile.length).toBeGreaterThan(0);
      }
    });

    test('should calculate HAZ for stainless steel', async () => {
      const inputs: HeatAffectedZoneInputs = {
        materialType: 'stainless_steel',
        thickness: 3,
        laserPower: 2500,
        cuttingSpeed: 1500,
        beamDiameter: 0.15,
        pulseFrequency: 0
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        // Stainless steel should have larger HAZ than carbon steel due to lower thermal conductivity
        expect(result.data.hazWidth).toBeGreaterThan(0.1);
        expect(result.data.thermalAnalysis.peakTemperature).toBeGreaterThan(100);
        expect(result.data.coolingRate).toBeGreaterThan(0);
      }
    });

    test('should calculate HAZ for aluminum', async () => {
      const inputs: HeatAffectedZoneInputs = {
        materialType: 'aluminum',
        thickness: 8,
        laserPower: 4000,
        cuttingSpeed: 3000,
        beamDiameter: 0.25,
        pulseFrequency: 0
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        // Aluminum should have smaller HAZ due to high thermal conductivity
        expect(result.data.hazWidth).toBeGreaterThan(0);
        expect(result.data.thermalAnalysis.peakTemperature).toBeLessThan(1000); // Below melting point
        expect(result.data.microstructureChanges.severity).toMatch(/low|medium|high/);
      }
    });

    test('should show pulse frequency effects', async () => {
      const cwInputs: HeatAffectedZoneInputs = {
        materialType: 'steel',
        thickness: 5,
        laserPower: 3000,
        cuttingSpeed: 2000,
        beamDiameter: 0.2,
        pulseFrequency: 0 // Continuous wave
      };

      const pulsedInputs: HeatAffectedZoneInputs = {
        ...cwInputs,
        pulseFrequency: 10000 // Pulsed mode
      };

      const cwResult = await calculator.calculate(cwInputs);
      const pulsedResult = await calculator.calculate(pulsedInputs);
      
      expect(cwResult.success).toBe(true);
      expect(pulsedResult.success).toBe(true);
      
      if (cwResult.data && pulsedResult.data) {
        // Pulsed mode should result in smaller HAZ
        expect(pulsedResult.data.hazWidth).toBeLessThan(cwResult.data.hazWidth);
      }
    });

    test('should provide thermal analysis', async () => {
      const inputs: HeatAffectedZoneInputs = {
        materialType: 'titanium',
        thickness: 6,
        laserPower: 3500,
        cuttingSpeed: 1800,
        beamDiameter: 0.18,
        pulseFrequency: 5000
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.thermalAnalysis).toBeDefined();
        expect(result.data.thermalAnalysis.peakTemperature).toBeGreaterThan(0);
        expect(result.data.thermalAnalysis.heatInput).toBeGreaterThan(0);
        expect(result.data.thermalAnalysis.thermalStress).toBeGreaterThan(0);
        expect(result.data.thermalAnalysis.energyDensity).toBeGreaterThan(0);
      }
    });

    test('should analyze microstructure changes', async () => {
      const highTempInputs: HeatAffectedZoneInputs = {
        materialType: 'steel',
        thickness: 2,
        laserPower: 5000, // High power for high temperature
        cuttingSpeed: 1000, // Low speed for high heat input
        beamDiameter: 0.1,
        pulseFrequency: 0
      };

      const result = await calculator.calculate(highTempInputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.microstructureChanges).toBeDefined();
        expect(result.data.microstructureChanges.grainGrowth).toBeDefined();
        expect(result.data.microstructureChanges.hardnessChange).toBeDefined();
        expect(result.data.microstructureChanges.phaseTransformation).toBeDefined();
        expect(result.data.microstructureChanges.severity).toMatch(/low|medium|high/);
      }
    });

    test('should generate temperature profile', async () => {
      const inputs: HeatAffectedZoneInputs = {
        materialType: 'copper',
        thickness: 4,
        laserPower: 6000,
        cuttingSpeed: 2500,
        beamDiameter: 0.3,
        pulseFrequency: 0
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.temperatureProfile).toBeDefined();
        expect(result.data.temperatureProfile.length).toBe(11); // 0 to 10 steps
        
        // Temperature should decrease with distance
        const profile = result.data.temperatureProfile;
        expect(profile[0].temperature).toBeGreaterThan(profile[profile.length - 1].temperature);
        
        // All distances should be non-negative
        profile.forEach(point => {
          expect(point.distance).toBeGreaterThanOrEqual(0);
          expect(point.temperature).toBeGreaterThan(0);
        });
      }
    });

    test('should provide control recommendations', async () => {
      const inputs: HeatAffectedZoneInputs = {
        materialType: 'brass',
        thickness: 10,
        laserPower: 4000,
        cuttingSpeed: 1200,
        beamDiameter: 0.25,
        pulseFrequency: 0
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.controlRecommendations).toBeDefined();
        expect(Array.isArray(result.data.controlRecommendations)).toBe(true);
        
        if (result.data.controlRecommendations.length > 0) {
          result.data.controlRecommendations.forEach(rec => {
            expect(typeof rec).toBe('string');
            expect(rec.length).toBeGreaterThan(0);
          });
        }
      }
    });

    test('should include calculation metadata', async () => {
      const inputs: HeatAffectedZoneInputs = {
        materialType: 'steel',
        thickness: 5,
        laserPower: 3000,
        cuttingSpeed: 2000,
        beamDiameter: 0.2,
        pulseFrequency: 0
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

  describe('Material-Specific Behavior', () => {
    test('should handle high thermal conductivity materials', async () => {
      const copperInputs: HeatAffectedZoneInputs = {
        materialType: 'copper',
        thickness: 3,
        laserPower: 8000, // High power needed for copper
        cuttingSpeed: 1500,
        beamDiameter: 0.2,
        pulseFrequency: 0
      };

      const result = await calculator.calculate(copperInputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        // Copper should have larger HAZ due to high thermal conductivity
        expect(result.data.hazWidth).toBeGreaterThan(0.2);
        expect(result.data.warnings.length).toBeGreaterThan(0);
      }
    });

    test('should handle low thermal conductivity materials', async () => {
      const stainlessInputs: HeatAffectedZoneInputs = {
        materialType: 'stainless_steel',
        thickness: 5,
        laserPower: 3000,
        cuttingSpeed: 2000,
        beamDiameter: 0.2,
        pulseFrequency: 0
      };

      const result = await calculator.calculate(stainlessInputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        // Should have reasonable HAZ for stainless steel
        expect(result.data.hazWidth).toBeGreaterThan(0.1);
        expect(result.data.hazWidth).toBeLessThan(2.0);
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
      expect(defaults.beamDiameter).toBeGreaterThan(0);
      expect(defaults.pulseFrequency).toBeGreaterThanOrEqual(0);
      
      const validation = calculator.validateInputs(defaults);
      expect(validation.isValid).toBe(true);
    });

    test('should provide valid example inputs', () => {
      const examples = calculator.getExampleInputs();
      
      expect(examples.materialType).toBe('steel');
      expect(examples.thickness).toBe(5);
      expect(examples.laserPower).toBe(3000);
      expect(examples.cuttingSpeed).toBe(2000);
      expect(examples.beamDiameter).toBe(0.2);
      expect(examples.pulseFrequency).toBe(0);
      
      const validation = calculator.validateInputs(examples);
      expect(validation.isValid).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    test('should handle minimum thickness', async () => {
      const minInputs: HeatAffectedZoneInputs = {
        materialType: 'aluminum',
        thickness: 0.5, // Minimum thickness
        laserPower: 1000,
        cuttingSpeed: 3000,
        beamDiameter: 0.1,
        pulseFrequency: 0
      };

      const result = await calculator.calculate(minInputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.hazDepth).toBeLessThanOrEqual(minInputs.thickness);
      }
    });

    test('should handle maximum thickness', async () => {
      const maxInputs: HeatAffectedZoneInputs = {
        materialType: 'steel',
        thickness: 50, // Maximum thickness
        laserPower: 15000,
        cuttingSpeed: 500,
        beamDiameter: 0.5,
        pulseFrequency: 0
      };

      const result = await calculator.calculate(maxInputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.hazWidth).toBeGreaterThan(0);
        expect(result.data.warnings.length).toBeGreaterThan(0); // Should warn about large HAZ
      }
    });
  });

  describe('Performance', () => {
    test('should complete calculations within reasonable time', async () => {
      const inputs: HeatAffectedZoneInputs = {
        materialType: 'steel',
        thickness: 5,
        laserPower: 3000,
        cuttingSpeed: 2000,
        beamDiameter: 0.2,
        pulseFrequency: 0
      };

      const startTime = performance.now();
      const result = await calculator.calculate(inputs);
      const endTime = performance.now();
      
      expect(result.success).toBe(true);
      expect(endTime - startTime).toBeLessThan(100); // Should complete in <100ms
    });
  });
});
