// Test suite for Frequency Setting Assistant
// Comprehensive testing of frequency optimization and pulse characteristics

import { describe, test, expect, beforeEach } from 'vitest';
import { FrequencySettingAssistant, FrequencySettingInputs } from '../FrequencySettingAssistant';

describe('FrequencySettingAssistant', () => {
  let calculator: FrequencySettingAssistant;

  beforeEach(() => {
    calculator = new FrequencySettingAssistant();
  });

  describe('Configuration', () => {
    test('should have correct calculator configuration', () => {
      expect(calculator.config.id).toBe('frequency-setting-assistant');
      expect(calculator.config.title).toBe('Frequency Setting Assistant');
      expect(calculator.config.category).toBe('Process Optimization');
      expect(calculator.config.badge).toBe('Standard');
      expect(calculator.config.inputs).toHaveLength(9);
    });

    test('should have all required input fields', () => {
      const inputIds = calculator.config.inputs.map(input => input.id);
      expect(inputIds).toContain('materialType');
      expect(inputIds).toContain('thickness');
      expect(inputIds).toContain('laserType');
      expect(inputIds).toContain('laserPower');
      expect(inputIds).toContain('cuttingSpeed');
      expect(inputIds).toContain('cuttingMode');
      expect(inputIds).toContain('qualityPriority');
      expect(inputIds).toContain('assistGas');
      expect(inputIds).toContain('currentFrequency');
    });
  });

  describe('Input Validation', () => {
    test('should validate correct inputs', () => {
      const validInputs: FrequencySettingInputs = {
        materialType: 'steel',
        thickness: 5,
        laserType: 'fiber',
        laserPower: 2000,
        cuttingSpeed: 3000,
        cuttingMode: 'pulsed',
        qualityPriority: 'balanced',
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
        laserPower: 2000,
        cuttingSpeed: 3000,
        cuttingMode: 'pulsed',
        qualityPriority: 'balanced',
        assistGas: 'oxygen'
      };

      const validation = calculator.validateInputs(invalidInputs);
      expect(validation.isValid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
    });

    test('should warn about CW frequency mismatch', () => {
      const cwInputs: FrequencySettingInputs = {
        materialType: 'steel',
        thickness: 5,
        laserType: 'fiber',
        laserPower: 2000,
        cuttingSpeed: 3000,
        cuttingMode: 'continuous', // CW mode
        qualityPriority: 'balanced',
        assistGas: 'oxygen',
        currentFrequency: 5000 // Should not have frequency in CW
      };

      const validation = calculator.validateInputs(cwInputs);
      expect(validation.warnings.some(w => w.code === 'CW_FREQUENCY_MISMATCH')).toBe(true);
    });

    test('should warn about high speed low power', () => {
      const highSpeedInputs: FrequencySettingInputs = {
        materialType: 'steel',
        thickness: 5,
        laserType: 'fiber',
        laserPower: 500, // Low power
        cuttingSpeed: 8000, // High speed
        cuttingMode: 'pulsed',
        qualityPriority: 'balanced',
        assistGas: 'oxygen'
      };

      const validation = calculator.validateInputs(highSpeedInputs);
      expect(validation.warnings.some(w => w.code === 'HIGH_SPEED_LOW_POWER')).toBe(true);
    });

    test('should warn about suboptimal laser-material combination', () => {
      const suboptimalInputs: FrequencySettingInputs = {
        materialType: 'steel',
        thickness: 5,
        laserType: 'co2', // Not optimal for steel
        laserPower: 2000,
        cuttingSpeed: 3000,
        cuttingMode: 'pulsed',
        qualityPriority: 'balanced',
        assistGas: 'oxygen'
      };

      const validation = calculator.validateInputs(suboptimalInputs);
      expect(validation.warnings.some(w => w.code === 'SUBOPTIMAL_LASER_MATERIAL')).toBe(true);
    });
  });

  describe('Frequency Optimization', () => {
    test('should calculate optimal frequency for steel pulsed cutting', async () => {
      const inputs: FrequencySettingInputs = {
        materialType: 'steel',
        thickness: 5,
        laserType: 'fiber',
        laserPower: 2000,
        cuttingSpeed: 3000,
        cuttingMode: 'pulsed',
        qualityPriority: 'balanced',
        assistGas: 'oxygen'
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.optimalFrequency).toBeDefined();
        expect(result.data.optimalFrequency.value).toBeGreaterThan(0);
        expect(result.data.optimalFrequency.value).toBeLessThan(50000);
        expect(result.data.optimalFrequency.unit).toBe('Hz');
        expect(result.data.optimalFrequency.mode).toContain('Pulsed');
        expect(result.data.optimalFrequency.confidence).toBeGreaterThan(0.5);
        expect(Array.isArray(result.data.optimalFrequency.reasoning)).toBe(true);
      }
    });

    test('should handle continuous wave mode', async () => {
      const inputs: FrequencySettingInputs = {
        materialType: 'aluminum',
        thickness: 3,
        laserType: 'fiber',
        laserPower: 3000,
        cuttingSpeed: 2000,
        cuttingMode: 'continuous',
        qualityPriority: 'speed',
        assistGas: 'nitrogen'
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.optimalFrequency.value).toBe(0);
        expect(result.data.optimalFrequency.unit).toBe('CW');
        expect(result.data.optimalFrequency.mode).toBe('Continuous Wave');
        expect(result.data.pulseCharacteristics.repetitionRate).toBe(0);
        expect(result.data.pulseCharacteristics.averagePower).toBe(inputs.laserPower);
      }
    });

    test('should calculate pulse characteristics correctly', async () => {
      const inputs: FrequencySettingInputs = {
        materialType: 'stainless_steel',
        thickness: 8,
        laserType: 'fiber',
        laserPower: 4000,
        cuttingSpeed: 1500,
        cuttingMode: 'pulsed',
        qualityPriority: 'precision',
        assistGas: 'nitrogen'
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.pulseCharacteristics).toBeDefined();
        expect(result.data.pulseCharacteristics.pulseDuration).toBeGreaterThan(0);
        expect(result.data.pulseCharacteristics.pulseEnergy).toBeGreaterThan(0);
        expect(result.data.pulseCharacteristics.peakPower).toBeGreaterThan(0);
        expect(result.data.pulseCharacteristics.averagePower).toBeGreaterThan(0);
        expect(result.data.pulseCharacteristics.averagePower).toBeLessThan(inputs.laserPower);
        expect(result.data.pulseCharacteristics.dutyCycle).toBeGreaterThan(0);
        expect(result.data.pulseCharacteristics.dutyCycle).toBeLessThan(100);
      }
    });

    test('should analyze material response', async () => {
      const inputs: FrequencySettingInputs = {
        materialType: 'copper',
        thickness: 4,
        laserType: 'fiber',
        laserPower: 3000,
        cuttingSpeed: 2500,
        cuttingMode: 'pulsed',
        qualityPriority: 'minimal_heat',
        assistGas: 'nitrogen'
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.materialResponse).toBeDefined();
        expect(result.data.materialResponse.heatAffectedZone.width).toBeGreaterThan(0);
        expect(result.data.materialResponse.heatAffectedZone.quality).toMatch(/excellent|good|fair|poor/);
        expect(result.data.materialResponse.cutQuality.score).toBeGreaterThanOrEqual(60);
        expect(result.data.materialResponse.cutQuality.score).toBeLessThanOrEqual(100);
        expect(result.data.materialResponse.cutQuality.edgeQuality).toMatch(/excellent|good|fair|poor/);
        expect(Array.isArray(result.data.materialResponse.cutQuality.expectedFeatures)).toBe(true);
        expect(result.data.materialResponse.processingEfficiency.overall).toBeGreaterThan(0);
        expect(result.data.materialResponse.processingEfficiency.overall).toBeLessThanOrEqual(100);
      }
    });

    test('should provide frequency optimization analysis', async () => {
      const inputs: FrequencySettingInputs = {
        materialType: 'titanium',
        thickness: 6,
        laserType: 'fiber',
        laserPower: 2500,
        cuttingSpeed: 1800,
        cuttingMode: 'pulsed',
        qualityPriority: 'precision',
        assistGas: 'argon',
        currentFrequency: 8000 // Provide current frequency for comparison
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.frequencyOptimization).toBeDefined();
        expect(result.data.frequencyOptimization.currentVsOptimal).toBeDefined();
        expect(typeof result.data.frequencyOptimization.currentVsOptimal.improvement).toBe('number');
        expect(typeof result.data.frequencyOptimization.currentVsOptimal.qualityGain).toBe('number');
        expect(typeof result.data.frequencyOptimization.currentVsOptimal.efficiencyGain).toBe('number');
        expect(typeof result.data.frequencyOptimization.currentVsOptimal.heatReduction).toBe('number');
        
        expect(Array.isArray(result.data.frequencyOptimization.alternativeFrequencies)).toBe(true);
        result.data.frequencyOptimization.alternativeFrequencies.forEach(alt => {
          expect(alt.name).toBeDefined();
          expect(typeof alt.frequency).toBe('number');
          expect(alt.application).toBeDefined();
          expect(alt.tradeoff).toBeDefined();
          expect(alt.suitability).toBeGreaterThanOrEqual(1);
          expect(alt.suitability).toBeLessThanOrEqual(10);
        });
      }
    });

    test('should generate process recommendations', async () => {
      const inputs: FrequencySettingInputs = {
        materialType: 'brass',
        thickness: 3,
        laserType: 'fiber',
        laserPower: 1800,
        cuttingSpeed: 3500,
        cuttingMode: 'pulsed',
        qualityPriority: 'balanced',
        assistGas: 'nitrogen'
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.processRecommendations).toBeDefined();
        expect(Array.isArray(result.data.processRecommendations.frequencyAdjustments)).toBe(true);
        expect(Array.isArray(result.data.processRecommendations.pulseOptimizations)).toBe(true);
        expect(Array.isArray(result.data.processRecommendations.qualityImprovements)).toBe(true);
        expect(Array.isArray(result.data.processRecommendations.troubleshooting)).toBe(true);
        
        result.data.processRecommendations.troubleshooting.forEach(tip => {
          expect(tip.issue).toBeDefined();
          expect(tip.cause).toBeDefined();
          expect(tip.solution).toBeDefined();
        });
      }
    });

    test('should show quality priority effects on frequency', async () => {
      const speedInputs: FrequencySettingInputs = {
        materialType: 'steel',
        thickness: 5,
        laserType: 'fiber',
        laserPower: 2000,
        cuttingSpeed: 3000,
        cuttingMode: 'pulsed',
        qualityPriority: 'speed',
        assistGas: 'oxygen'
      };

      const precisionInputs: FrequencySettingInputs = {
        ...speedInputs,
        qualityPriority: 'precision'
      };

      const speedResult = await calculator.calculate(speedInputs);
      const precisionResult = await calculator.calculate(precisionInputs);
      
      expect(speedResult.success).toBe(true);
      expect(precisionResult.success).toBe(true);
      
      if (speedResult.data && precisionResult.data) {
        // Speed priority should have higher frequency
        expect(speedResult.data.optimalFrequency.value).toBeGreaterThan(precisionResult.data.optimalFrequency.value);
        // Precision should have better quality score
        expect(precisionResult.data.materialResponse.cutQuality.score).toBeGreaterThan(speedResult.data.materialResponse.cutQuality.score);
      }
    });

    test('should show material thermal conductivity effects', async () => {
      const steelInputs: FrequencySettingInputs = {
        materialType: 'steel', // Low thermal conductivity
        thickness: 5,
        laserType: 'fiber',
        laserPower: 2000,
        cuttingSpeed: 3000,
        cuttingMode: 'pulsed',
        qualityPriority: 'balanced',
        assistGas: 'oxygen'
      };

      const aluminumInputs: FrequencySettingInputs = {
        ...steelInputs,
        materialType: 'aluminum', // High thermal conductivity
        assistGas: 'nitrogen'
      };

      const steelResult = await calculator.calculate(steelInputs);
      const aluminumResult = await calculator.calculate(aluminumInputs);
      
      expect(steelResult.success).toBe(true);
      expect(aluminumResult.success).toBe(true);
      
      if (steelResult.data && aluminumResult.data) {
        // High thermal conductivity materials may need different frequency optimization
        expect(aluminumResult.data.optimalFrequency.value).toBeDefined();
        expect(steelResult.data.optimalFrequency.value).toBeDefined();
        // Both should be reasonable frequencies
        expect(aluminumResult.data.optimalFrequency.value).toBeGreaterThan(1000);
        expect(steelResult.data.optimalFrequency.value).toBeGreaterThan(1000);
      }
    });

    test('should include calculation metadata', async () => {
      const inputs: FrequencySettingInputs = {
        materialType: 'steel',
        thickness: 5,
        laserType: 'fiber',
        laserPower: 2000,
        cuttingSpeed: 3000,
        cuttingMode: 'pulsed',
        qualityPriority: 'balanced',
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

  describe('Cutting Mode Effects', () => {
    test('should handle different cutting modes correctly', async () => {
      const modes: FrequencySettingInputs['cuttingMode'][] = ['continuous', 'pulsed', 'modulated'];
      
      for (const mode of modes) {
        const inputs: FrequencySettingInputs = {
          materialType: 'steel',
          thickness: 5,
          laserType: 'fiber',
          laserPower: 2000,
          cuttingSpeed: 3000,
          cuttingMode: mode,
          qualityPriority: 'balanced',
          assistGas: 'oxygen'
        };

        const result = await calculator.calculate(inputs);
        
        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        
        if (result.data) {
          if (mode === 'continuous') {
            expect(result.data.optimalFrequency.value).toBe(0);
            expect(result.data.optimalFrequency.unit).toBe('CW');
          } else {
            expect(result.data.optimalFrequency.value).toBeGreaterThan(0);
            expect(result.data.optimalFrequency.unit).toBe('Hz');
          }
        }
      }
    });

    test('should show modulated CW characteristics', async () => {
      const modulatedInputs: FrequencySettingInputs = {
        materialType: 'aluminum',
        thickness: 4,
        laserType: 'fiber',
        laserPower: 2500,
        cuttingSpeed: 2500,
        cuttingMode: 'modulated',
        qualityPriority: 'balanced',
        assistGas: 'nitrogen'
      };

      const result = await calculator.calculate(modulatedInputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.optimalFrequency.value).toBeGreaterThan(0);
        expect(result.data.optimalFrequency.mode).toBe('Modulated CW');
        expect(result.data.pulseCharacteristics.averagePower).toBeLessThan(modulatedInputs.laserPower);
      }
    });
  });

  describe('Material-Specific Behavior', () => {
    test('should handle different materials correctly', async () => {
      const materials: FrequencySettingInputs['materialType'][] = ['steel', 'aluminum', 'stainless_steel', 'copper', 'titanium', 'brass'];
      
      for (const material of materials) {
        const inputs: FrequencySettingInputs = {
          materialType: material,
          thickness: 5,
          laserType: 'fiber',
          laserPower: 2000,
          cuttingSpeed: 3000,
          cuttingMode: 'pulsed',
          qualityPriority: 'balanced',
          assistGas: 'nitrogen'
        };

        const result = await calculator.calculate(inputs);
        
        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        
        if (result.data) {
          expect(result.data.optimalFrequency.value).toBeGreaterThan(0);
          expect(result.data.pulseCharacteristics.pulseDuration).toBeGreaterThan(0);
          expect(result.data.materialResponse.heatAffectedZone.width).toBeGreaterThan(0);
        }
      }
    });
  });

  describe('Default and Example Inputs', () => {
    test('should provide valid default inputs', () => {
      const defaults = calculator.getDefaultInputs();
      
      expect(defaults.materialType).toBeDefined();
      expect(defaults.thickness).toBeGreaterThan(0);
      expect(defaults.laserType).toBeDefined();
      expect(defaults.laserPower).toBeGreaterThan(0);
      expect(defaults.cuttingSpeed).toBeGreaterThan(0);
      expect(defaults.cuttingMode).toBeDefined();
      expect(defaults.qualityPriority).toBeDefined();
      expect(defaults.assistGas).toBeDefined();
      
      const validation = calculator.validateInputs(defaults);
      expect(validation.isValid).toBe(true);
    });

    test('should provide valid example inputs', () => {
      const examples = calculator.getExampleInputs();
      
      expect(examples.materialType).toBe('steel');
      expect(examples.thickness).toBe(5);
      expect(examples.laserType).toBe('fiber');
      expect(examples.laserPower).toBe(2000);
      expect(examples.cuttingSpeed).toBe(3000);
      expect(examples.cuttingMode).toBe('pulsed');
      expect(examples.qualityPriority).toBe('balanced');
      expect(examples.assistGas).toBe('oxygen');
      
      const validation = calculator.validateInputs(examples);
      expect(validation.isValid).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    test('should handle minimum thickness', async () => {
      const minInputs: FrequencySettingInputs = {
        materialType: 'aluminum',
        thickness: 0.1, // Minimum thickness
        laserType: 'fiber',
        laserPower: 1000,
        cuttingSpeed: 5000,
        cuttingMode: 'pulsed',
        qualityPriority: 'balanced',
        assistGas: 'nitrogen'
      };

      const result = await calculator.calculate(minInputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.optimalFrequency.value).toBeGreaterThan(0);
        expect(result.data.pulseCharacteristics.pulseDuration).toBeGreaterThan(0);
      }
    });

    test('should handle maximum thickness', async () => {
      const maxInputs: FrequencySettingInputs = {
        materialType: 'steel',
        thickness: 50, // Maximum thickness
        laserType: 'fiber',
        laserPower: 15000,
        cuttingSpeed: 500,
        cuttingMode: 'pulsed',
        qualityPriority: 'balanced',
        assistGas: 'oxygen'
      };

      const result = await calculator.calculate(maxInputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.optimalFrequency.value).toBeGreaterThan(0);
        expect(result.data.warnings.length).toBeGreaterThan(0); // Should warn about thick material
      }
    });

    test('should handle extreme power settings', async () => {
      const lowPowerInputs: FrequencySettingInputs = {
        materialType: 'steel',
        thickness: 1,
        laserType: 'diode',
        laserPower: 50, // Minimum power
        cuttingSpeed: 1000,
        cuttingMode: 'pulsed',
        qualityPriority: 'balanced',
        assistGas: 'air'
      };

      const highPowerInputs: FrequencySettingInputs = {
        ...lowPowerInputs,
        laserPower: 20000, // Maximum power
        laserType: 'fiber'
      };

      const lowResult = await calculator.calculate(lowPowerInputs);
      const highResult = await calculator.calculate(highPowerInputs);
      
      expect(lowResult.success).toBe(true);
      expect(highResult.success).toBe(true);
      
      if (lowResult.data && highResult.data) {
        // Both should produce valid frequencies
        expect(lowResult.data.optimalFrequency.value).toBeGreaterThan(0);
        expect(highResult.data.optimalFrequency.value).toBeGreaterThan(0);
        // High power should have different pulse characteristics
        expect(highResult.data.pulseCharacteristics.peakPower).toBeGreaterThan(
          lowResult.data.pulseCharacteristics.peakPower
        );
      }
    });
  });

  describe('Performance', () => {
    test('should complete calculations within reasonable time', async () => {
      const inputs: FrequencySettingInputs = {
        materialType: 'steel',
        thickness: 5,
        laserType: 'fiber',
        laserPower: 2000,
        cuttingSpeed: 3000,
        cuttingMode: 'pulsed',
        qualityPriority: 'balanced',
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
