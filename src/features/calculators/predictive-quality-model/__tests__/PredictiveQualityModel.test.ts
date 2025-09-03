// Test suite for Predictive Quality Model
// Comprehensive testing of machine learning-based quality prediction

import { describe, test, expect, beforeEach } from 'vitest';
import { PredictiveQualityModel, PredictiveQualityInputs } from '../PredictiveQualityModel';

describe('PredictiveQualityModel', () => {
  let calculator: PredictiveQualityModel;

  beforeEach(() => {
    calculator = new PredictiveQualityModel();
  });

  describe('Configuration', () => {
    test('should have correct calculator configuration', () => {
      expect(calculator.config.id).toBe('predictive-quality-model');
      expect(calculator.config.title).toBe('Predictive Quality Model');
      expect(calculator.config.category).toBe('Advanced Analysis');
      expect(calculator.config.badge).toBe('Premium');
      expect(calculator.config.inputs).toHaveLength(12);
    });

    test('should have all required input fields', () => {
      const inputIds = calculator.config.inputs.map(input => input.id);
      expect(inputIds).toContain('materialType');
      expect(inputIds).toContain('thickness');
      expect(inputIds).toContain('laserPower');
      expect(inputIds).toContain('cuttingSpeed');
      expect(inputIds).toContain('gasPressure');
      expect(inputIds).toContain('focusHeight');
      expect(inputIds).toContain('assistGas');
      expect(inputIds).toContain('beamQuality');
      expect(inputIds).toContain('nozzleDistance');
      expect(inputIds).toContain('modelType');
      expect(inputIds).toContain('predictionScope');
      expect(inputIds).toContain('confidenceLevel');
    });
  });

  describe('Input Validation', () => {
    test('should validate correct inputs', () => {
      const validInputs: PredictiveQualityInputs = {
        materialType: 'steel',
        thickness: 5,
        laserPower: 2000,
        cuttingSpeed: 3000,
        gasPressure: 15,
        focusHeight: -2,
        assistGas: 'oxygen',
        beamQuality: 1.2,
        nozzleDistance: 1.5,
        modelType: 'ensemble',
        predictionScope: 'comprehensive',
        confidenceLevel: 0.95
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
        cuttingSpeed: 3000,
        gasPressure: 15,
        focusHeight: -2,
        assistGas: 'oxygen',
        beamQuality: 1.2,
        nozzleDistance: 1.5,
        modelType: 'ensemble',
        predictionScope: 'comprehensive',
        confidenceLevel: 0.95
      };

      const validation = calculator.validateInputs(invalidInputs);
      expect(validation.isValid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
    });

    test('should warn about high power density', () => {
      const highPowerInputs: PredictiveQualityInputs = {
        materialType: 'steel',
        thickness: 1, // Very thin
        laserPower: 5000, // Very high power
        cuttingSpeed: 3000,
        gasPressure: 15,
        focusHeight: -2,
        assistGas: 'oxygen',
        beamQuality: 1.2,
        nozzleDistance: 1.5,
        modelType: 'ensemble',
        predictionScope: 'comprehensive',
        confidenceLevel: 0.95
      };

      const validation = calculator.validateInputs(highPowerInputs);
      expect(validation.warnings.some(w => w.code === 'HIGH_POWER_DENSITY')).toBe(true);
    });

    test('should warn about unusual speed-power ratio', () => {
      const unusualRatioInputs: PredictiveQualityInputs = {
        materialType: 'steel',
        thickness: 5,
        laserPower: 500, // Low power
        cuttingSpeed: 8000, // High speed
        gasPressure: 15,
        focusHeight: -2,
        assistGas: 'oxygen',
        beamQuality: 1.2,
        nozzleDistance: 1.5,
        modelType: 'ensemble',
        predictionScope: 'comprehensive',
        confidenceLevel: 0.95
      };

      const validation = calculator.validateInputs(unusualRatioInputs);
      expect(validation.warnings.some(w => w.code === 'UNUSUAL_SPEED_POWER_RATIO')).toBe(true);
    });

    test('should warn about poor beam quality', () => {
      const poorBeamInputs: PredictiveQualityInputs = {
        materialType: 'steel',
        thickness: 5,
        laserPower: 2000,
        cuttingSpeed: 3000,
        gasPressure: 15,
        focusHeight: -2,
        assistGas: 'oxygen',
        beamQuality: 5, // Poor beam quality
        nozzleDistance: 1.5,
        modelType: 'ensemble',
        predictionScope: 'dimensional_accuracy',
        confidenceLevel: 0.95
      };

      const validation = calculator.validateInputs(poorBeamInputs);
      expect(validation.warnings.some(w => w.code === 'POOR_BEAM_QUALITY')).toBe(true);
    });
  });

  describe('Quality Prediction', () => {
    test('should perform comprehensive quality prediction', async () => {
      const inputs: PredictiveQualityInputs = {
        materialType: 'steel',
        thickness: 5,
        laserPower: 2000,
        cuttingSpeed: 3000,
        gasPressure: 15,
        focusHeight: -2,
        assistGas: 'oxygen',
        beamQuality: 1.2,
        nozzleDistance: 1.5,
        modelType: 'ensemble',
        predictionScope: 'comprehensive',
        confidenceLevel: 0.95
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.modelSummary).toBeDefined();
        expect(result.data.modelSummary.modelType).toBe('ensemble');
        expect(result.data.modelSummary.predictionScope).toBe('comprehensive');
        expect(result.data.modelSummary.trainingAccuracy).toBeGreaterThan(80);
        expect(result.data.modelSummary.validationAccuracy).toBeGreaterThan(80);
        expect(result.data.modelSummary.confidenceLevel).toBe(0.95);
        expect(Array.isArray(result.data.modelSummary.featureImportance)).toBe(true);
      }
    });

    test('should generate quality predictions', async () => {
      const inputs: PredictiveQualityInputs = {
        materialType: 'aluminum',
        thickness: 3,
        laserPower: 1500,
        cuttingSpeed: 4000,
        gasPressure: 12,
        focusHeight: -1,
        assistGas: 'nitrogen',
        beamQuality: 1.5,
        nozzleDistance: 1.2,
        modelType: 'neural_network',
        predictionScope: 'surface_quality',
        confidenceLevel: 0.90
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.qualityPredictions).toBeDefined();
        expect(result.data.qualityPredictions.overallQualityScore).toBeGreaterThan(0);
        expect(result.data.qualityPredictions.overallQualityScore).toBeLessThanOrEqual(100);
        
        expect(result.data.qualityPredictions.surfaceRoughness).toBeDefined();
        expect(result.data.qualityPredictions.surfaceRoughness.predicted).toBeGreaterThan(0);
        expect(Array.isArray(result.data.qualityPredictions.surfaceRoughness.range)).toBe(true);
        expect(result.data.qualityPredictions.surfaceRoughness.grade).toMatch(/excellent|good|fair|poor/);
        
        expect(result.data.qualityPredictions.edgeQuality).toBeDefined();
        expect(result.data.qualityPredictions.edgeQuality.squareness).toBeGreaterThan(0);
        expect(result.data.qualityPredictions.edgeQuality.straightness).toBeGreaterThan(0);
        expect(result.data.qualityPredictions.edgeQuality.drossLevel).toMatch(/none|minimal|moderate|excessive/);
        
        expect(result.data.qualityPredictions.dimensionalAccuracy).toBeDefined();
        expect(result.data.qualityPredictions.dimensionalAccuracy.tolerance).toBeGreaterThan(0);
        expect(result.data.qualityPredictions.dimensionalAccuracy.repeatability).toBeGreaterThan(0);
        expect(result.data.qualityPredictions.dimensionalAccuracy.kerf).toBeGreaterThan(0);
        
        expect(result.data.qualityPredictions.heatAffectedZone).toBeDefined();
        expect(result.data.qualityPredictions.heatAffectedZone.width).toBeGreaterThan(0);
        expect(result.data.qualityPredictions.heatAffectedZone.hardnessChange).toBeGreaterThanOrEqual(0);
        expect(result.data.qualityPredictions.heatAffectedZone.microstructureImpact).toMatch(/minimal|moderate|significant/);
      }
    });

    test('should calculate defect probabilities', async () => {
      const inputs: PredictiveQualityInputs = {
        materialType: 'stainless_steel',
        thickness: 8,
        laserPower: 3000,
        cuttingSpeed: 2000,
        gasPressure: 18,
        focusHeight: -3,
        assistGas: 'nitrogen',
        beamQuality: 1.1,
        nozzleDistance: 1.8,
        modelType: 'random_forest',
        predictionScope: 'edge_quality',
        confidenceLevel: 0.92
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.defectProbabilities).toBeDefined();
        expect(result.data.defectProbabilities.drossFormation).toBeGreaterThanOrEqual(0);
        expect(result.data.defectProbabilities.drossFormation).toBeLessThanOrEqual(1);
        expect(result.data.defectProbabilities.burnMarks).toBeGreaterThanOrEqual(0);
        expect(result.data.defectProbabilities.burnMarks).toBeLessThanOrEqual(1);
        expect(result.data.defectProbabilities.microCracks).toBeGreaterThanOrEqual(0);
        expect(result.data.defectProbabilities.microCracks).toBeLessThanOrEqual(1);
        expect(result.data.defectProbabilities.warpingDistortion).toBeGreaterThanOrEqual(0);
        expect(result.data.defectProbabilities.warpingDistortion).toBeLessThanOrEqual(1);
        expect(result.data.defectProbabilities.incompletecuts).toBeGreaterThanOrEqual(0);
        expect(result.data.defectProbabilities.incompletecuts).toBeLessThanOrEqual(1);
        expect(result.data.defectProbabilities.overallDefectRisk).toMatch(/low|medium|high|critical/);
      }
    });

    test('should analyze process stability', async () => {
      const inputs: PredictiveQualityInputs = {
        materialType: 'copper',
        thickness: 4,
        laserPower: 2500,
        cuttingSpeed: 1500,
        gasPressure: 20,
        focusHeight: -2,
        assistGas: 'argon',
        beamQuality: 1.3,
        nozzleDistance: 1.4,
        modelType: 'svm',
        predictionScope: 'dimensional_accuracy',
        confidenceLevel: 0.88
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.processStability).toBeDefined();
        expect(result.data.processStability.repeatabilityIndex).toBeGreaterThanOrEqual(0);
        expect(result.data.processStability.repeatabilityIndex).toBeLessThanOrEqual(1);
        expect(result.data.processStability.robustnessScore).toBeGreaterThanOrEqual(0);
        expect(result.data.processStability.robustnessScore).toBeLessThanOrEqual(100);
        expect(Array.isArray(result.data.processStability.sensitivityFactors)).toBe(true);
        expect(Array.isArray(result.data.processStability.controlRecommendations)).toBe(true);
        
        result.data.processStability.sensitivityFactors.forEach(factor => {
          expect(factor.parameter).toBeDefined();
          expect(factor.sensitivity).toBeGreaterThanOrEqual(0);
          expect(factor.sensitivity).toBeLessThanOrEqual(1);
          expect(factor.stabilityImpact).toMatch(/low|medium|high/);
        });
      }
    });

    test('should generate quality optimization recommendations', async () => {
      const inputs: PredictiveQualityInputs = {
        materialType: 'titanium',
        thickness: 6,
        laserPower: 1800,
        cuttingSpeed: 1200,
        gasPressure: 25,
        focusHeight: -2.5,
        assistGas: 'argon',
        beamQuality: 1.0,
        nozzleDistance: 1.6,
        modelType: 'ensemble',
        predictionScope: 'comprehensive',
        confidenceLevel: 0.96
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.qualityOptimization).toBeDefined();
        expect(result.data.qualityOptimization.currentPerformance).toBeGreaterThan(0);
        expect(result.data.qualityOptimization.currentPerformance).toBeLessThanOrEqual(100);
        expect(result.data.qualityOptimization.optimizationPotential).toBeGreaterThanOrEqual(0);
        expect(Array.isArray(result.data.qualityOptimization.recommendedAdjustments)).toBe(true);
        expect(Array.isArray(result.data.qualityOptimization.alternativeSettings)).toBe(true);
        
        result.data.qualityOptimization.recommendedAdjustments.forEach(adjustment => {
          expect(adjustment.parameter).toBeDefined();
          expect(adjustment.currentValue).toBeDefined();
          expect(adjustment.recommendedValue).toBeDefined();
          expect(adjustment.expectedImprovement).toBeGreaterThanOrEqual(0);
          expect(adjustment.confidence).toBeGreaterThan(0);
          expect(adjustment.confidence).toBeLessThanOrEqual(1);
        });
        
        result.data.qualityOptimization.alternativeSettings.forEach(setting => {
          expect(setting.name).toBeDefined();
          expect(setting.parameters).toBeDefined();
          expect(setting.predictedQuality).toBeGreaterThan(0);
          expect(setting.predictedQuality).toBeLessThanOrEqual(100);
          expect(Array.isArray(setting.tradeoffs)).toBe(true);
        });
      }
    });

    test('should perform uncertainty analysis', async () => {
      const inputs: PredictiveQualityInputs = {
        materialType: 'brass',
        thickness: 7,
        laserPower: 2200,
        cuttingSpeed: 2800,
        gasPressure: 14,
        focusHeight: -2.2,
        assistGas: 'air',
        beamQuality: 2.0,
        nozzleDistance: 1.3,
        modelType: 'neural_network',
        predictionScope: 'surface_quality',
        confidenceLevel: 0.85
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.uncertaintyAnalysis).toBeDefined();
        expect(result.data.uncertaintyAnalysis.predictionUncertainty).toBeGreaterThan(0);
        expect(Array.isArray(result.data.uncertaintyAnalysis.modelLimitations)).toBe(true);
        expect(result.data.uncertaintyAnalysis.dataQualityAssessment).toBeDefined();
        expect(result.data.uncertaintyAnalysis.dataQualityAssessment.completeness).toBeGreaterThan(0);
        expect(result.data.uncertaintyAnalysis.dataQualityAssessment.completeness).toBeLessThanOrEqual(1);
        expect(result.data.uncertaintyAnalysis.dataQualityAssessment.consistency).toBeGreaterThan(0);
        expect(result.data.uncertaintyAnalysis.dataQualityAssessment.consistency).toBeLessThanOrEqual(1);
        expect(result.data.uncertaintyAnalysis.dataQualityAssessment.relevance).toBeGreaterThan(0);
        expect(result.data.uncertaintyAnalysis.dataQualityAssessment.relevance).toBeLessThanOrEqual(1);
        expect(Array.isArray(result.data.uncertaintyAnalysis.recommendedValidation)).toBe(true);
      }
    });

    test('should show different model types produce different results', async () => {
      const baseInputs: PredictiveQualityInputs = {
        materialType: 'steel',
        thickness: 5,
        laserPower: 2000,
        cuttingSpeed: 3000,
        gasPressure: 15,
        focusHeight: -2,
        assistGas: 'oxygen',
        beamQuality: 1.2,
        nozzleDistance: 1.5,
        predictionScope: 'comprehensive',
        confidenceLevel: 0.95,
        modelType: 'neural_network'
      };

      const neuralResult = await calculator.calculate(baseInputs);
      const forestResult = await calculator.calculate({
        ...baseInputs,
        modelType: 'random_forest'
      });
      
      expect(neuralResult.success).toBe(true);
      expect(forestResult.success).toBe(true);
      
      if (neuralResult.data && forestResult.data) {
        // Different models should produce different accuracy scores
        expect(neuralResult.data.modelSummary.trainingAccuracy).not.toBe(
          forestResult.data.modelSummary.trainingAccuracy
        );
        
        // Both should have valid predictions
        expect(neuralResult.data.qualityPredictions.overallQualityScore).toBeGreaterThan(0);
        expect(forestResult.data.qualityPredictions.overallQualityScore).toBeGreaterThan(0);
      }
    });

    test('should include calculation metadata', async () => {
      const inputs: PredictiveQualityInputs = {
        materialType: 'steel',
        thickness: 5,
        laserPower: 2000,
        cuttingSpeed: 3000,
        gasPressure: 15,
        focusHeight: -2,
        assistGas: 'oxygen',
        beamQuality: 1.2,
        nozzleDistance: 1.5,
        modelType: 'ensemble',
        predictionScope: 'comprehensive',
        confidenceLevel: 0.95
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

  describe('Model Types', () => {
    test('should handle different model types correctly', async () => {
      const modelTypes: PredictiveQualityInputs['modelType'][] = ['neural_network', 'random_forest', 'svm', 'ensemble'];
      
      for (const modelType of modelTypes) {
        const inputs: PredictiveQualityInputs = {
          materialType: 'steel',
          thickness: 5,
          laserPower: 2000,
          cuttingSpeed: 3000,
          gasPressure: 15,
          focusHeight: -2,
          assistGas: 'oxygen',
          beamQuality: 1.2,
          nozzleDistance: 1.5,
          modelType,
          predictionScope: 'comprehensive',
          confidenceLevel: 0.95
        };

        const result = await calculator.calculate(inputs);
        
        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        
        if (result.data) {
          expect(result.data.modelSummary.modelType).toBe(modelType);
          expect(result.data.qualityPredictions.overallQualityScore).toBeGreaterThan(0);
        }
      }
    });
  });

  describe('Material-Specific Behavior', () => {
    test('should handle different materials correctly', async () => {
      const materials: PredictiveQualityInputs['materialType'][] = ['steel', 'aluminum', 'stainless_steel', 'copper', 'titanium', 'brass'];
      
      for (const material of materials) {
        const inputs: PredictiveQualityInputs = {
          materialType: material,
          thickness: 5,
          laserPower: 2000,
          cuttingSpeed: 3000,
          gasPressure: 15,
          focusHeight: -2,
          assistGas: 'oxygen',
          beamQuality: 1.2,
          nozzleDistance: 1.5,
          modelType: 'ensemble',
          predictionScope: 'comprehensive',
          confidenceLevel: 0.95
        };

        const result = await calculator.calculate(inputs);
        
        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        
        if (result.data) {
          expect(result.data.qualityPredictions.overallQualityScore).toBeGreaterThan(0);
          expect(result.data.qualityPredictions.surfaceRoughness.predicted).toBeGreaterThan(0);
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
      expect(defaults.gasPressure).toBeGreaterThan(0);
      expect(defaults.focusHeight).toBeDefined();
      expect(defaults.assistGas).toBeDefined();
      expect(defaults.beamQuality).toBeGreaterThan(0);
      expect(defaults.nozzleDistance).toBeGreaterThan(0);
      expect(defaults.modelType).toBeDefined();
      expect(defaults.predictionScope).toBeDefined();
      expect(defaults.confidenceLevel).toBeGreaterThan(0.8);
      
      const validation = calculator.validateInputs(defaults);
      expect(validation.isValid).toBe(true);
    });

    test('should provide valid example inputs', () => {
      const examples = calculator.getExampleInputs();
      
      expect(examples.materialType).toBe('steel');
      expect(examples.thickness).toBe(5);
      expect(examples.laserPower).toBe(2000);
      expect(examples.cuttingSpeed).toBe(3000);
      expect(examples.gasPressure).toBe(15);
      expect(examples.focusHeight).toBe(-2);
      expect(examples.assistGas).toBe('oxygen');
      expect(examples.beamQuality).toBe(1.2);
      expect(examples.nozzleDistance).toBe(1.5);
      expect(examples.modelType).toBe('ensemble');
      expect(examples.predictionScope).toBe('comprehensive');
      expect(examples.confidenceLevel).toBe(0.95);
      
      const validation = calculator.validateInputs(examples);
      expect(validation.isValid).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    test('should handle minimum thickness', async () => {
      const minInputs: PredictiveQualityInputs = {
        materialType: 'aluminum',
        thickness: 0.1, // Minimum thickness
        laserPower: 500,
        cuttingSpeed: 5000,
        gasPressure: 8,
        focusHeight: -0.1,
        assistGas: 'nitrogen',
        beamQuality: 1.0,
        nozzleDistance: 0.8,
        modelType: 'random_forest',
        predictionScope: 'surface_quality',
        confidenceLevel: 0.85
      };

      const result = await calculator.calculate(minInputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.qualityPredictions.overallQualityScore).toBeGreaterThan(0);
        expect(result.data.qualityPredictions.surfaceRoughness.predicted).toBeGreaterThan(0);
      }
    });

    test('should handle maximum thickness', async () => {
      const maxInputs: PredictiveQualityInputs = {
        materialType: 'steel',
        thickness: 50, // Maximum thickness
        laserPower: 15000,
        cuttingSpeed: 500,
        gasPressure: 25,
        focusHeight: -15,
        assistGas: 'oxygen',
        beamQuality: 3.0,
        nozzleDistance: 3.0,
        modelType: 'svm',
        predictionScope: 'edge_quality',
        confidenceLevel: 0.90
      };

      const result = await calculator.calculate(maxInputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.warnings.length).toBeGreaterThan(0); // Should have warnings for extreme values
        expect(result.data.qualityPredictions.overallQualityScore).toBeGreaterThan(0);
      }
    });

    test('should handle poor beam quality', async () => {
      const poorBeamInputs: PredictiveQualityInputs = {
        materialType: 'copper',
        thickness: 8,
        laserPower: 3000,
        cuttingSpeed: 1000,
        gasPressure: 20,
        focusHeight: -3,
        assistGas: 'argon',
        beamQuality: 8.0, // Very poor beam quality
        nozzleDistance: 2.5,
        modelType: 'neural_network',
        predictionScope: 'dimensional_accuracy',
        confidenceLevel: 0.80
      };

      const result = await calculator.calculate(poorBeamInputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.warnings.length).toBeGreaterThan(0);
        expect(result.data.qualityPredictions.overallQualityScore).toBeLessThan(90); // Should predict lower quality
      }
    });
  });

  describe('Performance', () => {
    test('should complete predictions within reasonable time', async () => {
      const inputs: PredictiveQualityInputs = {
        materialType: 'steel',
        thickness: 5,
        laserPower: 2000,
        cuttingSpeed: 3000,
        gasPressure: 15,
        focusHeight: -2,
        assistGas: 'oxygen',
        beamQuality: 1.2,
        nozzleDistance: 1.5,
        modelType: 'ensemble',
        predictionScope: 'comprehensive',
        confidenceLevel: 0.95
      };

      const startTime = performance.now();
      const result = await calculator.calculate(inputs);
      const endTime = performance.now();
      
      expect(result.success).toBe(true);
      expect(endTime - startTime).toBeLessThan(2000); // Should complete in <2000ms
    });
  });
});
