// Test suite for Process Optimization Engine
// Comprehensive testing of multi-objective optimization and evolutionary algorithms

import { describe, test, expect, beforeEach } from 'vitest';
import { ProcessOptimizationEngine, ProcessOptimizationInputs } from '../ProcessOptimizationEngine';

describe('ProcessOptimizationEngine', () => {
  let calculator: ProcessOptimizationEngine;

  beforeEach(() => {
    calculator = new ProcessOptimizationEngine();
  });

  describe('Configuration', () => {
    test('should have correct calculator configuration', () => {
      expect(calculator.config.id).toBe('process-optimization-engine');
      expect(calculator.config.title).toBe('Process Optimization Engine');
      expect(calculator.config.category).toBe('Advanced Analysis');
      expect(calculator.config.badge).toBe('Premium');
      expect(calculator.config.inputs).toHaveLength(8);
    });

    test('should have all required input fields', () => {
      const inputIds = calculator.config.inputs.map(input => input.id);
      expect(inputIds).toContain('materialType');
      expect(inputIds).toContain('thickness');
      expect(inputIds).toContain('laserPower');
      expect(inputIds).toContain('optimizationGoal');
      expect(inputIds).toContain('algorithmType');
      expect(inputIds).toContain('populationSize');
      expect(inputIds).toContain('generations');
      expect(inputIds).toContain('convergenceTolerance');
    });
  });

  describe('Input Validation', () => {
    test('should validate correct inputs', () => {
      const validInputs: ProcessOptimizationInputs = {
        materialType: 'steel',
        thickness: 5,
        laserPower: 3000,
        optimizationGoal: 'balanced',
        constraints: {
          maxTime: 30,
          minQuality: 80
        },
        algorithmType: 'genetic',
        populationSize: 50,
        generations: 100,
        convergenceTolerance: 0.01
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
        optimizationGoal: 'balanced',
        constraints: {},
        algorithmType: 'genetic',
        populationSize: 50,
        generations: 100,
        convergenceTolerance: 0.01
      };

      const validation = calculator.validateInputs(invalidInputs);
      expect(validation.isValid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
    });

    test('should warn about high optimization complexity', () => {
      const highComplexityInputs: ProcessOptimizationInputs = {
        materialType: 'steel',
        thickness: 5,
        laserPower: 3000,
        optimizationGoal: 'balanced',
        constraints: {},
        algorithmType: 'genetic',
        populationSize: 200, // High population
        generations: 500, // High generations
        convergenceTolerance: 0.01
      };

      const validation = calculator.validateInputs(highComplexityInputs);
      expect(validation.warnings.some(w => w.code === 'HIGH_OPTIMIZATION_COMPLEXITY')).toBe(true);
    });

    test('should warn about tight constraints', () => {
      const tightConstraintInputs: ProcessOptimizationInputs = {
        materialType: 'steel',
        thickness: 5,
        laserPower: 3000,
        optimizationGoal: 'balanced',
        constraints: {
          maxTime: 3, // Very tight time constraint
          minQuality: 98 // Very high quality requirement
        },
        algorithmType: 'genetic',
        populationSize: 50,
        generations: 100,
        convergenceTolerance: 0.01
      };

      const validation = calculator.validateInputs(tightConstraintInputs);
      expect(validation.warnings.some(w => w.code === 'TIGHT_TIME_CONSTRAINT')).toBe(true);
      expect(validation.warnings.some(w => w.code === 'HIGH_QUALITY_CONSTRAINT')).toBe(true);
    });

    test('should warn about insufficient power', () => {
      const lowPowerInputs: ProcessOptimizationInputs = {
        materialType: 'steel',
        thickness: 20,
        laserPower: 300, // Very low power for thick steel
        optimizationGoal: 'balanced',
        constraints: {},
        algorithmType: 'genetic',
        populationSize: 50,
        generations: 100,
        convergenceTolerance: 0.01
      };

      const validation = calculator.validateInputs(lowPowerInputs);
      expect(validation.warnings.some(w => w.code === 'INSUFFICIENT_POWER')).toBe(true);
    });
  });

  describe('Process Optimization', () => {
    test('should perform genetic algorithm optimization', async () => {
      const inputs: ProcessOptimizationInputs = {
        materialType: 'steel',
        thickness: 5,
        laserPower: 3000,
        optimizationGoal: 'balanced',
        constraints: {
          maxTime: 30,
          minQuality: 80
        },
        algorithmType: 'genetic',
        populationSize: 20, // Smaller for faster testing
        generations: 20,
        convergenceTolerance: 0.01
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.optimizationSummary).toBeDefined();
        expect(result.data.optimizationSummary.algorithm).toBe('genetic');
        expect(result.data.optimizationSummary.goal).toBe('balanced');
        expect(result.data.optimizationSummary.generations).toBeGreaterThan(0);
        expect(result.data.optimizationSummary.executionTime).toBeGreaterThan(0);
        expect(result.data.optimizationSummary.finalFitness).toBeGreaterThan(0);
        expect(result.data.optimizationSummary.finalFitness).toBeLessThanOrEqual(1);
      }
    });

    test('should generate optimal parameters', async () => {
      const inputs: ProcessOptimizationInputs = {
        materialType: 'aluminum',
        thickness: 3,
        laserPower: 2000,
        optimizationGoal: 'cost',
        constraints: {},
        algorithmType: 'particle_swarm',
        populationSize: 15,
        generations: 15,
        convergenceTolerance: 0.02
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.optimalParameters).toBeDefined();
        expect(result.data.optimalParameters.power).toBeGreaterThan(0);
        expect(result.data.optimalParameters.power).toBeLessThanOrEqual(inputs.laserPower);
        expect(result.data.optimalParameters.speed).toBeGreaterThan(0);
        expect(result.data.optimalParameters.gasPressure).toBeGreaterThan(0);
        expect(result.data.optimalParameters.focusHeight).toBeDefined();
        expect(result.data.optimalParameters.fitnessScore).toBeGreaterThan(0);
        expect(result.data.optimalParameters.fitnessScore).toBeLessThanOrEqual(1);
        
        expect(result.data.optimalParameters.objectives).toBeDefined();
        expect(result.data.optimalParameters.objectives.cost).toBeGreaterThan(0);
        expect(result.data.optimalParameters.objectives.time).toBeGreaterThan(0);
        expect(result.data.optimalParameters.objectives.quality).toBeGreaterThan(0);
        expect(result.data.optimalParameters.objectives.energy).toBeGreaterThan(0);
      }
    });

    test('should generate Pareto front for multi-objective optimization', async () => {
      const inputs: ProcessOptimizationInputs = {
        materialType: 'stainless_steel',
        thickness: 8,
        laserPower: 4000,
        optimizationGoal: 'balanced',
        constraints: {},
        algorithmType: 'multi_objective',
        populationSize: 30,
        generations: 25,
        convergenceTolerance: 0.01
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.paretoFront).toBeDefined();
        expect(Array.isArray(result.data.paretoFront)).toBe(true);
        expect(result.data.paretoFront.length).toBeGreaterThan(0);
        
        result.data.paretoFront.forEach(solution => {
          expect(solution.parameters).toBeDefined();
          expect(solution.parameters.power).toBeGreaterThan(0);
          expect(solution.parameters.speed).toBeGreaterThan(0);
          expect(solution.parameters.gasPressure).toBeGreaterThan(0);
          expect(solution.parameters.focusHeight).toBeDefined();
          
          expect(solution.objectives).toBeDefined();
          expect(solution.objectives.cost).toBeGreaterThan(0);
          expect(solution.objectives.time).toBeGreaterThan(0);
          expect(solution.objectives.quality).toBeGreaterThan(0);
          expect(solution.objectives.energy).toBeGreaterThan(0);
          
          expect(solution.dominanceRank).toBeGreaterThan(0);
          expect(solution.crowdingDistance).toBeGreaterThanOrEqual(0);
        });
      }
    });

    test('should track convergence history', async () => {
      const inputs: ProcessOptimizationInputs = {
        materialType: 'copper',
        thickness: 4,
        laserPower: 2500,
        optimizationGoal: 'time',
        constraints: {},
        algorithmType: 'simulated_annealing',
        populationSize: 25,
        generations: 30,
        convergenceTolerance: 0.01
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.convergenceHistory).toBeDefined();
        expect(Array.isArray(result.data.convergenceHistory)).toBe(true);
        expect(result.data.convergenceHistory.length).toBeGreaterThan(0);
        
        result.data.convergenceHistory.forEach((entry, index) => {
          expect(entry.generation).toBe(index);
          expect(entry.bestFitness).toBeGreaterThan(0);
          expect(entry.averageFitness).toBeGreaterThan(0);
          expect(entry.diversity).toBeGreaterThanOrEqual(0);
          expect(entry.elapsedTime).toBeGreaterThanOrEqual(0);
        });
        
        // Check that fitness generally improves over generations
        const firstFitness = result.data.convergenceHistory[0].bestFitness;
        const lastFitness = result.data.convergenceHistory[result.data.convergenceHistory.length - 1].bestFitness;
        expect(lastFitness).toBeGreaterThanOrEqual(firstFitness);
      }
    });

    test('should generate alternative solutions', async () => {
      const inputs: ProcessOptimizationInputs = {
        materialType: 'titanium',
        thickness: 6,
        laserPower: 3500,
        optimizationGoal: 'quality',
        constraints: {},
        algorithmType: 'genetic',
        populationSize: 20,
        generations: 20,
        convergenceTolerance: 0.01
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.alternativeSolutions).toBeDefined();
        expect(Array.isArray(result.data.alternativeSolutions)).toBe(true);
        expect(result.data.alternativeSolutions.length).toBeGreaterThan(0);
        
        result.data.alternativeSolutions.forEach(solution => {
          expect(solution.name).toBeDefined();
          expect(solution.description).toBeDefined();
          expect(solution.parameters).toBeDefined();
          expect(solution.parameters.power).toBeGreaterThan(0);
          expect(solution.parameters.speed).toBeGreaterThan(0);
          expect(solution.parameters.gasPressure).toBeGreaterThan(0);
          expect(solution.parameters.focusHeight).toBeDefined();
          expect(Array.isArray(solution.tradeoffs)).toBe(true);
          expect(solution.suitability).toBeGreaterThanOrEqual(0);
          expect(solution.suitability).toBeLessThanOrEqual(10);
        });
      }
    });

    test('should provide optimization insights', async () => {
      const inputs: ProcessOptimizationInputs = {
        materialType: 'brass',
        thickness: 7,
        laserPower: 2800,
        optimizationGoal: 'energy',
        constraints: {},
        algorithmType: 'genetic',
        populationSize: 20,
        generations: 20,
        convergenceTolerance: 0.01
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.optimizationInsights).toBeDefined();
        expect(Array.isArray(result.data.optimizationInsights.criticalParameters)).toBe(true);
        expect(Array.isArray(result.data.optimizationInsights.parameterSensitivity)).toBe(true);
        expect(Array.isArray(result.data.optimizationInsights.recommendations)).toBe(true);
        expect(Array.isArray(result.data.optimizationInsights.implementationGuidance)).toBe(true);
        
        result.data.optimizationInsights.parameterSensitivity.forEach(param => {
          expect(param.parameter).toBeDefined();
          expect(param.sensitivity).toBeGreaterThanOrEqual(0);
          expect(param.sensitivity).toBeLessThanOrEqual(1);
          expect(param.impact).toMatch(/low|medium|high|critical/);
        });
      }
    });

    test('should show different optimization goals produce different results', async () => {
      const baseInputs: ProcessOptimizationInputs = {
        materialType: 'steel',
        thickness: 5,
        laserPower: 3000,
        constraints: {},
        algorithmType: 'genetic',
        populationSize: 15,
        generations: 15,
        convergenceTolerance: 0.02,
        optimizationGoal: 'cost'
      };

      const costResult = await calculator.calculate(baseInputs);
      const timeResult = await calculator.calculate({
        ...baseInputs,
        optimizationGoal: 'time'
      });
      
      expect(costResult.success).toBe(true);
      expect(timeResult.success).toBe(true);
      
      if (costResult.data && timeResult.data) {
        // Different goals should produce different optimal parameters
        const costParams = costResult.data.optimalParameters;
        const timeParams = timeResult.data.optimalParameters;
        
        // At least one parameter should be different
        const parametersDifferent = 
          costParams.power !== timeParams.power ||
          costParams.speed !== timeParams.speed ||
          costParams.gasPressure !== timeParams.gasPressure ||
          costParams.focusHeight !== timeParams.focusHeight;
        
        expect(parametersDifferent).toBe(true);
      }
    });

    test('should include calculation metadata', async () => {
      const inputs: ProcessOptimizationInputs = {
        materialType: 'steel',
        thickness: 5,
        laserPower: 3000,
        optimizationGoal: 'balanced',
        constraints: {},
        algorithmType: 'genetic',
        populationSize: 20,
        generations: 20,
        convergenceTolerance: 0.01
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

  describe('Algorithm Types', () => {
    test('should handle different algorithm types correctly', async () => {
      const algorithmTypes: ProcessOptimizationInputs['algorithmType'][] = ['genetic', 'particle_swarm', 'simulated_annealing', 'multi_objective'];
      
      for (const algorithmType of algorithmTypes) {
        const inputs: ProcessOptimizationInputs = {
          materialType: 'steel',
          thickness: 5,
          laserPower: 3000,
          optimizationGoal: 'balanced',
          constraints: {},
          algorithmType,
          populationSize: 15,
          generations: 10,
          convergenceTolerance: 0.02
        };

        const result = await calculator.calculate(inputs);
        
        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        
        if (result.data) {
          expect(result.data.optimizationSummary.algorithm).toBe(algorithmType);
          expect(result.data.optimalParameters.power).toBeGreaterThan(0);
        }
      }
    });
  });

  describe('Material-Specific Behavior', () => {
    test('should handle different materials correctly', async () => {
      const materials: ProcessOptimizationInputs['materialType'][] = ['steel', 'aluminum', 'stainless_steel', 'copper', 'titanium', 'brass'];
      
      for (const material of materials) {
        const inputs: ProcessOptimizationInputs = {
          materialType: material,
          thickness: 5,
          laserPower: 3000,
          optimizationGoal: 'balanced',
          constraints: {},
          algorithmType: 'genetic',
          populationSize: 15,
          generations: 10,
          convergenceTolerance: 0.02
        };

        const result = await calculator.calculate(inputs);
        
        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        
        if (result.data) {
          expect(result.data.optimalParameters.power).toBeGreaterThan(0);
          expect(result.data.optimalParameters.speed).toBeGreaterThan(0);
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
      expect(defaults.optimizationGoal).toBeDefined();
      expect(defaults.algorithmType).toBeDefined();
      expect(defaults.populationSize).toBeGreaterThan(0);
      expect(defaults.generations).toBeGreaterThan(0);
      expect(defaults.convergenceTolerance).toBeGreaterThan(0);
      
      const validation = calculator.validateInputs(defaults);
      expect(validation.isValid).toBe(true);
    });

    test('should provide valid example inputs', () => {
      const examples = calculator.getExampleInputs();
      
      expect(examples.materialType).toBe('steel');
      expect(examples.thickness).toBe(5);
      expect(examples.laserPower).toBe(3000);
      expect(examples.optimizationGoal).toBe('balanced');
      expect(examples.algorithmType).toBe('genetic');
      expect(examples.populationSize).toBe(50);
      expect(examples.generations).toBe(100);
      expect(examples.convergenceTolerance).toBe(0.01);
      
      const validation = calculator.validateInputs(examples);
      expect(validation.isValid).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    test('should handle minimum population size', async () => {
      const minInputs: ProcessOptimizationInputs = {
        materialType: 'aluminum',
        thickness: 2,
        laserPower: 1500,
        optimizationGoal: 'cost',
        constraints: {},
        algorithmType: 'genetic',
        populationSize: 10, // Minimum population
        generations: 10, // Minimum generations
        convergenceTolerance: 0.05
      };

      const result = await calculator.calculate(minInputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.optimalParameters.power).toBeGreaterThan(0);
        expect(result.data.convergenceHistory.length).toBeGreaterThan(0);
      }
    });

    test('should handle maximum complexity', async () => {
      const maxInputs: ProcessOptimizationInputs = {
        materialType: 'titanium',
        thickness: 15,
        laserPower: 8000,
        optimizationGoal: 'quality',
        constraints: {
          maxTime: 60,
          maxCost: 50,
          minQuality: 90
        },
        algorithmType: 'multi_objective',
        populationSize: 100, // Large population
        generations: 50, // Many generations
        convergenceTolerance: 0.001 // Tight tolerance
      };

      const result = await calculator.calculate(maxInputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.warnings.length).toBeGreaterThan(0); // Should warn about complexity
        expect(result.data.paretoFront.length).toBeGreaterThan(0);
      }
    });

    test('should handle conflicting constraints', async () => {
      const conflictingInputs: ProcessOptimizationInputs = {
        materialType: 'copper',
        thickness: 10,
        laserPower: 1000, // Low power
        optimizationGoal: 'balanced',
        constraints: {
          maxTime: 5, // Very short time
          minQuality: 95, // Very high quality
          maxCost: 2 // Very low cost
        },
        algorithmType: 'genetic',
        populationSize: 20,
        generations: 20,
        convergenceTolerance: 0.01
      };

      const result = await calculator.calculate(conflictingInputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.warnings.length).toBeGreaterThan(0); // Should warn about conflicts
        expect(result.data.optimizationSummary.finalFitness).toBeDefined();
      }
    });
  });

  describe('Performance', () => {
    test('should complete optimization within reasonable time', async () => {
      const inputs: ProcessOptimizationInputs = {
        materialType: 'steel',
        thickness: 5,
        laserPower: 3000,
        optimizationGoal: 'balanced',
        constraints: {},
        algorithmType: 'genetic',
        populationSize: 20,
        generations: 15,
        convergenceTolerance: 0.01
      };

      const startTime = performance.now();
      const result = await calculator.calculate(inputs);
      const endTime = performance.now();
      
      expect(result.success).toBe(true);
      expect(endTime - startTime).toBeLessThan(5000); // Should complete in <5000ms
    });
  });
});
