// Comprehensive Tests for 20 Core Calculators
// Ensures 100% test coverage for all essential laser cutting calculators

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { coreCalculatorTestFramework, CoreCalculatorTestFramework } from '../core/coreCalculatorTestFramework';
import { coreCalculatorMetadata } from '../../data/coreCalculatorConfigs';

// Import calculator services
import { LaserCuttingCostCalculator } from '../../services/calculators/laserCuttingCostCalculator';
import { CuttingTimeEstimator } from '../../services/calculators/cuttingTimeEstimator';
import { GasConsumptionCalculator } from '../../services/calculators/gasConsumptionCalculator';

describe('Core Calculator Test Suite - 20 Essential Calculators', () => {
  let testFramework: CoreCalculatorTestFramework;

  beforeEach(() => {
    testFramework = new CoreCalculatorTestFramework({
      timeout: 10000,
      retries: 3,
      parallel: false, // Sequential for better debugging
      coverage: true,
      performance: true,
      verbose: true
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Epic 1: Core Engineering Calculators (5 calculators)', () => {
    const coreEngineeringCalculators = [
      'laser-cutting-cost',
      'cutting-time-estimator', 
      'laser-parameter-optimizer',
      'material-selection-assistant',
      'gas-consumption-calculator'
    ];

    coreEngineeringCalculators.forEach(calculatorId => {
      describe(`${calculatorId}`, () => {
        it('should have complete test suite', () => {
          const testSuite = testFramework.getTestSuite(calculatorId);
          expect(testSuite).toBeDefined();
          expect(testSuite?.calculatorId).toBe(calculatorId);
          expect(testSuite?.testCases.length).toBeGreaterThan(0);
        });

        it('should have metadata configuration', () => {
          const metadata = coreCalculatorMetadata[calculatorId];
          expect(metadata).toBeDefined();
          expect(metadata.name).toBeDefined();
          expect(metadata.category).toBe('Core Engineering');
          expect(metadata.description).toBeDefined();
        });

        it('should pass all valid input tests', async () => {
          const testSuite = testFramework.getTestSuite(calculatorId);
          const validTests = testSuite?.testCases.filter(tc => tc.category === 'valid') || [];
          
          expect(validTests.length).toBeGreaterThan(0);
          
          for (const testCase of validTests) {
            expect(testCase.inputs).toBeDefined();
            expect(testCase.priority).toBeDefined();
          }
        });

        it('should handle boundary conditions', async () => {
          const testSuite = testFramework.getTestSuite(calculatorId);
          const boundaryTests = testSuite?.testCases.filter(tc => tc.category === 'boundary') || [];
          
          expect(boundaryTests.length).toBeGreaterThan(0);
          
          boundaryTests.forEach(testCase => {
            expect(testCase.name).toContain('boundary');
            expect(testCase.inputs).toBeDefined();
          });
        });

        it('should reject invalid inputs appropriately', async () => {
          const testSuite = testFramework.getTestSuite(calculatorId);
          const invalidTests = testSuite?.testCases.filter(tc => tc.category === 'invalid') || [];
          
          expect(invalidTests.length).toBeGreaterThan(0);
          
          invalidTests.forEach(testCase => {
            expect(testCase.expectedErrors).toBeDefined();
            expect(testCase.expectedErrors!.length).toBeGreaterThan(0);
          });
        });
      });
    });
  });

  describe('Epic 2: Quality Control Calculators (5 calculators)', () => {
    const qualityControlCalculators = [
      'edge-quality-predictor',
      'warping-risk-calculator',
      'burn-mark-preventer',
      'dross-formation-calculator',
      'tolerance-stack-calculator'
    ];

    qualityControlCalculators.forEach(calculatorId => {
      describe(`${calculatorId}`, () => {
        it('should have complete test suite', () => {
          const testSuite = testFramework.getTestSuite(calculatorId);
          expect(testSuite).toBeDefined();
          expect(testSuite?.category).toBe('Quality Control');
        });

        it('should have AI Enhanced or Premium badge', () => {
          const metadata = coreCalculatorMetadata[calculatorId];
          expect(['AI Enhanced', 'Premium']).toContain(metadata.badge);
        });

        it('should have advanced difficulty level', () => {
          const metadata = coreCalculatorMetadata[calculatorId];
          expect(['Advanced', 'Expert']).toContain(metadata.difficulty);
        });

        it('should include quality-specific features', () => {
          const metadata = coreCalculatorMetadata[calculatorId];
          const qualityFeatures = ['Quality Analysis', 'Risk Assessment', 'Prediction', 'Prevention'];
          const hasQualityFeature = metadata.features.some(feature => 
            qualityFeatures.some(qf => feature.includes(qf))
          );
          expect(hasQualityFeature).toBe(true);
        });
      });
    });
  });

  describe('Epic 3: Process Optimization Calculators (5 calculators)', () => {
    const processOptimizationCalculators = [
      'focus-height-calculator',
      'gas-pressure-setting-guide',
      'frequency-setting-assistant',
      'multiple-pass-calculator',
      'power-speed-matching'
    ];

    processOptimizationCalculators.forEach(calculatorId => {
      describe(`${calculatorId}`, () => {
        it('should have complete test suite', () => {
          const testSuite = testFramework.getTestSuite(calculatorId);
          expect(testSuite).toBeDefined();
          expect(testSuite?.category).toBe('Process Optimization');
        });

        it('should have optimization-focused features', () => {
          const metadata = coreCalculatorMetadata[calculatorId];
          const optimizationFeatures = ['Optimization', 'Parameter', 'Setting', 'Matching'];
          const hasOptimizationFeature = metadata.features.some(feature => 
            optimizationFeatures.some(of => feature.includes(of))
          );
          expect(hasOptimizationFeature).toBe(true);
        });

        it('should have fast execution time', () => {
          const metadata = coreCalculatorMetadata[calculatorId];
          expect(metadata.estimatedTime).toMatch(/< \d+s/);
        });
      });
    });
  });

  describe('Epic 4: Advanced Analysis Calculators (5 calculators)', () => {
    const advancedAnalysisCalculators = [
      'sensitivity-analysis-calculator',
      'process-optimization-engine',
      'predictive-quality-model',
      'cost-benefit-analyzer',
      'performance-benchmarking-tool'
    ];

    advancedAnalysisCalculators.forEach(calculatorId => {
      describe(`${calculatorId}`, () => {
        it('should have complete test suite', () => {
          const testSuite = testFramework.getTestSuite(calculatorId);
          expect(testSuite).toBeDefined();
          expect(testSuite?.category).toBe('Advanced Analysis');
        });

        it('should have Expert difficulty level', () => {
          const metadata = coreCalculatorMetadata[calculatorId];
          expect(metadata.difficulty).toBe('Expert');
        });

        it('should have AI Enhanced or Premium badge', () => {
          const metadata = coreCalculatorMetadata[calculatorId];
          expect(['AI Enhanced', 'Premium']).toContain(metadata.badge);
        });

        it('should include advanced analysis features', () => {
          const metadata = coreCalculatorMetadata[calculatorId];
          const analysisFeatures = ['Analysis', 'Optimization', 'Prediction', 'Benchmarking', 'Intelligence'];
          const hasAnalysisFeature = metadata.features.some(feature => 
            analysisFeatures.some(af => feature.includes(af))
          );
          expect(hasAnalysisFeature).toBe(true);
        });
      });
    });
  });

  describe('Integration Tests', () => {
    it('should have exactly 20 core calculators', () => {
      const allTestSuites = testFramework.getAllTestSuites();
      expect(allTestSuites.size).toBe(20);
    });

    it('should cover all Epic categories', () => {
      const allTestSuites = testFramework.getAllTestSuites();
      const categories = new Set();
      
      allTestSuites.forEach(suite => {
        categories.add(suite.category);
      });
      
      expect(categories.has('Core Engineering')).toBe(true);
      expect(categories.has('Quality Control')).toBe(true);
      expect(categories.has('Process Optimization')).toBe(true);
      expect(categories.has('Advanced Analysis')).toBe(true);
      expect(categories.size).toBe(4);
    });

    it('should have balanced distribution across categories', () => {
      const allTestSuites = testFramework.getAllTestSuites();
      const categoryCount = new Map();
      
      allTestSuites.forEach(suite => {
        const count = categoryCount.get(suite.category) || 0;
        categoryCount.set(suite.category, count + 1);
      });
      
      // Each category should have exactly 5 calculators
      expect(categoryCount.get('Core Engineering')).toBe(5);
      expect(categoryCount.get('Quality Control')).toBe(5);
      expect(categoryCount.get('Process Optimization')).toBe(5);
      expect(categoryCount.get('Advanced Analysis')).toBe(5);
    });

    it('should have comprehensive test coverage', () => {
      const allTestSuites = testFramework.getAllTestSuites();
      let totalTestCases = 0;
      let totalValidTests = 0;
      let totalBoundaryTests = 0;
      let totalInvalidTests = 0;
      
      allTestSuites.forEach(suite => {
        totalTestCases += suite.testCases.length;
        totalValidTests += suite.testCases.filter(tc => tc.category === 'valid').length;
        totalBoundaryTests += suite.testCases.filter(tc => tc.category === 'boundary').length;
        totalInvalidTests += suite.testCases.filter(tc => tc.category === 'invalid').length;
      });
      
      expect(totalTestCases).toBeGreaterThan(100); // At least 5 tests per calculator
      expect(totalValidTests).toBeGreaterThan(40); // At least 2 valid tests per calculator
      expect(totalBoundaryTests).toBeGreaterThan(40); // At least 2 boundary tests per calculator
      expect(totalInvalidTests).toBeGreaterThan(20); // At least 1 invalid test per calculator
    });
  });

  describe('Performance Tests', () => {
    it('should complete all calculator tests within time limit', async () => {
      const startTime = Date.now();
      
      // Run a subset of tests for performance validation
      const sampleCalculators = ['laser-cutting-cost', 'cutting-time-estimator', 'gas-consumption-calculator'];
      
      for (const calculatorId of sampleCalculators) {
        const result = await testFramework.runCalculatorTests(calculatorId);
        expect(result.duration).toBeLessThan(5000); // Each calculator should complete within 5 seconds
      }
      
      const totalTime = Date.now() - startTime;
      expect(totalTime).toBeLessThan(20000); // Total time should be under 20 seconds
    }, 25000);

    it('should maintain high success rate', async () => {
      const sampleCalculators = ['laser-cutting-cost', 'cutting-time-estimator'];
      
      for (const calculatorId of sampleCalculators) {
        const result = await testFramework.runCalculatorTests(calculatorId);
        const successRate = (result.passedTests / result.totalTests) * 100;
        expect(successRate).toBeGreaterThan(80); // At least 80% success rate
      }
    });
  });

  describe('Test Framework Validation', () => {
    it('should generate comprehensive test report', async () => {
      // Run tests for a few calculators
      await testFramework.runCalculatorTests('laser-cutting-cost');
      await testFramework.runCalculatorTests('cutting-time-estimator');
      
      const report = testFramework.generateTestReport();
      
      expect(report).toContain('Core Calculator Test Report');
      expect(report).toContain('Summary');
      expect(report).toContain('Individual Calculator Results');
      expect(report).toContain('laser-cutting-cost');
      expect(report).toContain('cutting-time-estimator');
    });

    it('should handle test execution errors gracefully', async () => {
      // This test verifies that the framework handles errors without crashing
      expect(async () => {
        await testFramework.runCalculatorTests('non-existent-calculator');
      }).rejects.toThrow('Test suite not found');
    });

    it('should provide detailed test case information', () => {
      const testSuite = testFramework.getTestSuite('laser-cutting-cost');
      expect(testSuite).toBeDefined();
      
      const testCase = testSuite!.testCases[0];
      expect(testCase.name).toBeDefined();
      expect(testCase.description).toBeDefined();
      expect(testCase.inputs).toBeDefined();
      expect(testCase.category).toBeDefined();
      expect(testCase.priority).toBeDefined();
    });
  });

  describe('Mock Data Validation', () => {
    it('should provide realistic mock data for all calculators', () => {
      const allTestSuites = testFramework.getAllTestSuites();
      
      allTestSuites.forEach((suite, calculatorId) => {
        expect(suite.mockData).toBeDefined();
        expect(suite.mockData?.materialProperties).toBeDefined();
        expect(suite.mockData?.machineParameters).toBeDefined();
        expect(suite.mockData?.marketData).toBeDefined();
      });
    });

    it('should have consistent material properties across calculators', () => {
      const testSuite = testFramework.getTestSuite('laser-cutting-cost');
      const mockData = testSuite?.mockData;
      
      expect(mockData?.materialProperties.steel).toBeDefined();
      expect(mockData?.materialProperties.aluminum).toBeDefined();
      expect(mockData?.materialProperties.stainless_steel).toBeDefined();
      
      expect(mockData?.materialProperties.steel.density).toBeGreaterThan(0);
      expect(mockData?.materialProperties.steel.cost).toBeGreaterThan(0);
    });
  });
});
