// Test suite for Performance Benchmarking Tool
// Comprehensive testing of performance analysis and benchmarking

import { describe, test, expect, beforeEach } from 'vitest';
import { PerformanceBenchmarkingTool, PerformanceBenchmarkingInputs } from '../PerformanceBenchmarkingTool';

describe('PerformanceBenchmarkingTool', () => {
  let calculator: PerformanceBenchmarkingTool;

  beforeEach(() => {
    calculator = new PerformanceBenchmarkingTool();
  });

  describe('Configuration', () => {
    test('should have correct calculator configuration', () => {
      expect(calculator.config.id).toBe('performance-benchmarking-tool');
      expect(calculator.config.title).toBe('Performance Benchmarking Tool');
      expect(calculator.config.category).toBe('Advanced Analysis');
      expect(calculator.config.badge).toBe('Premium');
      expect(calculator.config.inputs).toHaveLength(6);
    });

    test('should have all required input fields', () => {
      const inputIds = calculator.config.inputs.map(input => input.id);
      expect(inputIds).toContain('benchmarkType');
      expect(inputIds).toContain('comparisonTarget');
      expect(inputIds).toContain('timeframe');
      expect(inputIds).toContain('analysisDepth');
      expect(inputIds).toContain('confidenceLevel');
      expect(inputIds).toContain('includeProjections');
    });
  });

  describe('Input Validation', () => {
    test('should validate correct inputs', () => {
      const validInputs: PerformanceBenchmarkingInputs = {
        benchmarkType: 'comprehensive',
        comparisonTarget: 'industry_standard',
        timeframe: 'monthly',
        systemConfiguration: {
          laserPower: 3000,
          machineType: 'fiber',
          workingArea: 3000,
          automationLevel: 'semi_automatic',
          operatingHours: 16
        },
        performanceMetrics: {
          throughput: 28,
          utilization: 78,
          qualityRate: 96,
          energyEfficiency: 82,
          materialUtilization: 88
        },
        costMetrics: {
          operatingCostPerHour: 62,
          materialCostPerPart: 8.50,
          energyCostPerHour: 15,
          maintenanceCostPerMonth: 2500,
          laborCostPerHour: 35
        },
        qualityMetrics: {
          defectRate: 3.2,
          reworkRate: 1.8,
          customerSatisfaction: 92,
          deliveryOnTime: 94,
          dimensionalAccuracy: 97
        },
        analysisDepth: 'comprehensive',
        confidenceLevel: 0.95
      };

      const validation = calculator.validateInputs(validInputs);
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    test('should reject invalid benchmark type', () => {
      const invalidInputs = {
        benchmarkType: 'invalid_type',
        comparisonTarget: 'industry_standard',
        timeframe: 'monthly',
        systemConfiguration: {
          laserPower: 3000,
          machineType: 'fiber',
          workingArea: 3000,
          automationLevel: 'semi_automatic',
          operatingHours: 16
        },
        performanceMetrics: {
          throughput: 28,
          utilization: 78,
          qualityRate: 96,
          energyEfficiency: 82,
          materialUtilization: 88
        },
        costMetrics: {
          operatingCostPerHour: 62,
          materialCostPerPart: 8.50,
          energyCostPerHour: 15,
          maintenanceCostPerMonth: 2500,
          laborCostPerHour: 35
        },
        qualityMetrics: {
          defectRate: 3.2,
          reworkRate: 1.8,
          customerSatisfaction: 92,
          deliveryOnTime: 94,
          dimensionalAccuracy: 97
        },
        analysisDepth: 'comprehensive',
        confidenceLevel: 0.95
      };

      const validation = calculator.validateInputs(invalidInputs);
      expect(validation.isValid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
    });

    test('should warn about high throughput for diode laser', () => {
      const highThroughputInputs: PerformanceBenchmarkingInputs = {
        benchmarkType: 'system_performance',
        comparisonTarget: 'industry_standard',
        timeframe: 'monthly',
        systemConfiguration: {
          laserPower: 1500,
          machineType: 'diode',
          workingArea: 2000,
          automationLevel: 'manual',
          operatingHours: 12
        },
        performanceMetrics: {
          throughput: 150, // Very high for diode
          utilization: 70,
          qualityRate: 90,
          energyEfficiency: 85,
          materialUtilization: 80
        },
        costMetrics: {
          operatingCostPerHour: 45,
          materialCostPerPart: 6.00,
          energyCostPerHour: 12,
          maintenanceCostPerMonth: 1500,
          laborCostPerHour: 25
        },
        qualityMetrics: {
          defectRate: 5.0,
          reworkRate: 3.0,
          customerSatisfaction: 88,
          deliveryOnTime: 90,
          dimensionalAccuracy: 92
        },
        analysisDepth: 'detailed',
        confidenceLevel: 0.90
      };

      const validation = calculator.validateInputs(highThroughputInputs);
      expect(validation.warnings.some(w => w.code === 'HIGH_THROUGHPUT_DIODE')).toBe(true);
    });

    test('should warn about high utilization with low hours', () => {
      const inconsistentInputs: PerformanceBenchmarkingInputs = {
        benchmarkType: 'process_efficiency',
        comparisonTarget: 'best_practice',
        timeframe: 'weekly',
        systemConfiguration: {
          laserPower: 2500,
          machineType: 'co2',
          workingArea: 2500,
          automationLevel: 'fully_automatic',
          operatingHours: 10 // Low hours
        },
        performanceMetrics: {
          throughput: 22,
          utilization: 95, // Very high utilization
          qualityRate: 94,
          energyEfficiency: 75,
          materialUtilization: 85
        },
        costMetrics: {
          operatingCostPerHour: 55,
          materialCostPerPart: 7.25,
          energyCostPerHour: 18,
          maintenanceCostPerMonth: 2000,
          laborCostPerHour: 30
        },
        qualityMetrics: {
          defectRate: 4.5,
          reworkRate: 2.5,
          customerSatisfaction: 90,
          deliveryOnTime: 92,
          dimensionalAccuracy: 95
        },
        analysisDepth: 'basic',
        confidenceLevel: 0.85
      };

      const validation = calculator.validateInputs(inconsistentInputs);
      expect(validation.warnings.some(w => w.code === 'HIGH_UTILIZATION_LOW_HOURS')).toBe(true);
    });

    test('should warn about inconsistent quality metrics', () => {
      const inconsistentQualityInputs: PerformanceBenchmarkingInputs = {
        benchmarkType: 'quality_metrics',
        comparisonTarget: 'industry_standard',
        timeframe: 'quarterly',
        systemConfiguration: {
          laserPower: 4000,
          machineType: 'fiber',
          workingArea: 4000,
          automationLevel: 'semi_automatic',
          operatingHours: 18
        },
        performanceMetrics: {
          throughput: 35,
          utilization: 82,
          qualityRate: 98, // Very high quality rate
          energyEfficiency: 88,
          materialUtilization: 92
        },
        costMetrics: {
          operatingCostPerHour: 70,
          materialCostPerPart: 9.00,
          energyCostPerHour: 20,
          maintenanceCostPerMonth: 3000,
          laborCostPerHour: 40
        },
        qualityMetrics: {
          defectRate: 8.0, // High defect rate
          reworkRate: 4.0,
          customerSatisfaction: 95,
          deliveryOnTime: 96,
          dimensionalAccuracy: 98
        },
        analysisDepth: 'expert',
        confidenceLevel: 0.99
      };

      const validation = calculator.validateInputs(inconsistentQualityInputs);
      expect(validation.warnings.some(w => w.code === 'INCONSISTENT_QUALITY_METRICS')).toBe(true);
    });
  });

  describe('Performance Benchmarking', () => {
    test('should perform comprehensive benchmarking analysis', async () => {
      const inputs: PerformanceBenchmarkingInputs = {
        benchmarkType: 'comprehensive',
        comparisonTarget: 'industry_standard',
        timeframe: 'monthly',
        systemConfiguration: {
          laserPower: 3000,
          machineType: 'fiber',
          workingArea: 3000,
          automationLevel: 'semi_automatic',
          operatingHours: 16
        },
        performanceMetrics: {
          throughput: 28,
          utilization: 78,
          qualityRate: 96,
          energyEfficiency: 82,
          materialUtilization: 88
        },
        costMetrics: {
          operatingCostPerHour: 62,
          materialCostPerPart: 8.50,
          energyCostPerHour: 15,
          maintenanceCostPerMonth: 2500,
          laborCostPerHour: 35
        },
        qualityMetrics: {
          defectRate: 3.2,
          reworkRate: 1.8,
          customerSatisfaction: 92,
          deliveryOnTime: 94,
          dimensionalAccuracy: 97
        },
        analysisDepth: 'comprehensive',
        confidenceLevel: 0.95
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.benchmarkSummary).toBeDefined();
        expect(result.data.benchmarkSummary.benchmarkType).toBe('comprehensive');
        expect(result.data.benchmarkSummary.comparisonTarget).toBe('industry_standard');
        expect(result.data.benchmarkSummary.overallScore).toBeGreaterThan(0);
        expect(result.data.benchmarkSummary.overallScore).toBeLessThanOrEqual(100);
        expect(result.data.benchmarkSummary.performanceRating).toMatch(/excellent|good|average|below_average|poor/);
        expect(Array.isArray(result.data.benchmarkSummary.keyStrengths)).toBe(true);
        expect(Array.isArray(result.data.benchmarkSummary.improvementAreas)).toBe(true);
        expect(result.data.benchmarkSummary.benchmarkDate).toBeDefined();
      }
    });

    test('should generate performance analysis', async () => {
      const inputs: PerformanceBenchmarkingInputs = {
        benchmarkType: 'system_performance',
        comparisonTarget: 'best_practice',
        timeframe: 'weekly',
        systemConfiguration: {
          laserPower: 2000,
          machineType: 'co2',
          workingArea: 2000,
          automationLevel: 'manual',
          operatingHours: 12
        },
        performanceMetrics: {
          throughput: 18,
          utilization: 65,
          qualityRate: 92,
          energyEfficiency: 68,
          materialUtilization: 82
        },
        costMetrics: {
          operatingCostPerHour: 48,
          materialCostPerPart: 6.75,
          energyCostPerHour: 14,
          maintenanceCostPerMonth: 1800,
          laborCostPerHour: 28
        },
        qualityMetrics: {
          defectRate: 6.5,
          reworkRate: 4.2,
          customerSatisfaction: 86,
          deliveryOnTime: 88,
          dimensionalAccuracy: 93
        },
        analysisDepth: 'detailed',
        confidenceLevel: 0.90
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.performanceAnalysis).toBeDefined();
        expect(result.data.performanceAnalysis.throughputAnalysis).toBeDefined();
        expect(result.data.performanceAnalysis.utilizationAnalysis).toBeDefined();
        expect(result.data.performanceAnalysis.qualityAnalysis).toBeDefined();
        expect(result.data.performanceAnalysis.efficiencyAnalysis).toBeDefined();
        expect(result.data.performanceAnalysis.costAnalysis).toBeDefined();
        expect(result.data.performanceAnalysis.overallPerformanceIndex).toBeGreaterThan(0);
        expect(result.data.performanceAnalysis.overallPerformanceIndex).toBeLessThanOrEqual(100);
        
        // Check benchmark metric structure
        const metrics = [
          result.data.performanceAnalysis.throughputAnalysis,
          result.data.performanceAnalysis.utilizationAnalysis,
          result.data.performanceAnalysis.qualityAnalysis,
          result.data.performanceAnalysis.efficiencyAnalysis,
          result.data.performanceAnalysis.costAnalysis
        ];
        
        metrics.forEach(metric => {
          expect(metric.currentValue).toBeGreaterThan(0);
          expect(metric.benchmarkValue).toBeGreaterThan(0);
          expect(metric.percentageDifference).toBeDefined();
          expect(metric.performance).toMatch(/excellent|good|average|below_average|poor/);
          expect(metric.trend).toMatch(/improving|stable|declining/);
          expect(Array.isArray(metric.recommendations)).toBe(true);
        });
      }
    });

    test('should conduct industry comparison', async () => {
      const inputs: PerformanceBenchmarkingInputs = {
        benchmarkType: 'cost_effectiveness',
        comparisonTarget: 'competitor_analysis',
        timeframe: 'quarterly',
        systemConfiguration: {
          laserPower: 5000,
          machineType: 'fiber',
          workingArea: 5000,
          automationLevel: 'fully_automatic',
          operatingHours: 20
        },
        performanceMetrics: {
          throughput: 42,
          utilization: 88,
          qualityRate: 98,
          energyEfficiency: 90,
          materialUtilization: 95
        },
        costMetrics: {
          operatingCostPerHour: 85,
          materialCostPerPart: 12.00,
          energyCostPerHour: 25,
          maintenanceCostPerMonth: 4000,
          laborCostPerHour: 45
        },
        qualityMetrics: {
          defectRate: 1.5,
          reworkRate: 0.8,
          customerSatisfaction: 98,
          deliveryOnTime: 99,
          dimensionalAccuracy: 99
        },
        analysisDepth: 'expert',
        confidenceLevel: 0.99
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.industryComparison).toBeDefined();
        expect(result.data.industryComparison.industryAverages).toBeDefined();
        expect(result.data.industryComparison.industryAverages.throughput).toBeGreaterThan(0);
        expect(result.data.industryComparison.industryAverages.utilization).toBeGreaterThan(0);
        expect(result.data.industryComparison.industryAverages.qualityRate).toBeGreaterThan(0);
        expect(result.data.industryComparison.industryAverages.costPerHour).toBeGreaterThan(0);
        expect(result.data.industryComparison.industryAverages.energyEfficiency).toBeGreaterThan(0);
        
        expect(result.data.industryComparison.percentileRanking).toBeDefined();
        expect(result.data.industryComparison.percentileRanking.throughput).toBeGreaterThanOrEqual(0);
        expect(result.data.industryComparison.percentileRanking.throughput).toBeLessThanOrEqual(100);
        expect(result.data.industryComparison.percentileRanking.overall).toBeGreaterThanOrEqual(0);
        expect(result.data.industryComparison.percentileRanking.overall).toBeLessThanOrEqual(100);
        
        expect(result.data.industryComparison.competitivePosition).toMatch(/leader|above_average|average|below_average|laggard/);
        
        expect(Array.isArray(result.data.industryComparison.gapAnalysis)).toBe(true);
        result.data.industryComparison.gapAnalysis.forEach(gap => {
          expect(gap.metric).toBeDefined();
          expect(gap.currentValue).toBeGreaterThanOrEqual(0);
          expect(gap.industryBest).toBeGreaterThan(0);
          expect(gap.gap).toBeDefined();
          expect(gap.gapPercentage).toBeDefined();
        });
      }
    });

    test('should analyze trends', async () => {
      const inputs: PerformanceBenchmarkingInputs = {
        benchmarkType: 'process_efficiency',
        comparisonTarget: 'previous_period',
        timeframe: 'yearly',
        systemConfiguration: {
          laserPower: 3500,
          machineType: 'nd_yag',
          workingArea: 3500,
          automationLevel: 'semi_automatic',
          operatingHours: 14
        },
        performanceMetrics: {
          throughput: 20,
          utilization: 72,
          qualityRate: 94,
          energyEfficiency: 70,
          materialUtilization: 86
        },
        costMetrics: {
          operatingCostPerHour: 58,
          materialCostPerPart: 8.25,
          energyCostPerHour: 16,
          maintenanceCostPerMonth: 2200,
          laborCostPerHour: 32
        },
        qualityMetrics: {
          defectRate: 4.8,
          reworkRate: 3.2,
          customerSatisfaction: 89,
          deliveryOnTime: 91,
          dimensionalAccuracy: 95
        },
        analysisDepth: 'comprehensive',
        confidenceLevel: 0.95,
        includeProjections: true
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.trendAnalysis).toBeDefined();
        expect(Array.isArray(result.data.trendAnalysis.performanceTrends)).toBe(true);
        expect(result.data.trendAnalysis.performanceTrends.length).toBeGreaterThan(0);
        
        result.data.trendAnalysis.performanceTrends.forEach(trend => {
          expect(trend.metric).toBeDefined();
          expect(trend.trend).toMatch(/improving|stable|declining/);
          expect(trend.changeRate).toBeDefined();
          expect(trend.projection).toBeGreaterThan(0);
          expect(trend.confidence).toBeGreaterThan(0);
          expect(trend.confidence).toBeLessThanOrEqual(1);
        });
        
        expect(Array.isArray(result.data.trendAnalysis.seasonalPatterns)).toBe(true);
        result.data.trendAnalysis.seasonalPatterns.forEach(pattern => {
          expect(pattern.metric).toBeDefined();
          expect(typeof pattern.hasSeasonality).toBe('boolean');
          expect(pattern.variability).toBeGreaterThanOrEqual(0);
        });
        
        expect(result.data.trendAnalysis.forecastAccuracy).toBeGreaterThan(0);
        expect(result.data.trendAnalysis.forecastAccuracy).toBeLessThanOrEqual(100);
      }
    });

    test('should perform root cause analysis', async () => {
      const inputs: PerformanceBenchmarkingInputs = {
        benchmarkType: 'quality_metrics',
        comparisonTarget: 'custom_baseline',
        timeframe: 'monthly',
        systemConfiguration: {
          laserPower: 2500,
          machineType: 'diode',
          workingArea: 2500,
          automationLevel: 'manual',
          operatingHours: 10
        },
        performanceMetrics: {
          throughput: 15,
          utilization: 58,
          qualityRate: 88,
          energyEfficiency: 83,
          materialUtilization: 78
        },
        costMetrics: {
          operatingCostPerHour: 42,
          materialCostPerPart: 5.50,
          energyCostPerHour: 11,
          maintenanceCostPerMonth: 1200,
          laborCostPerHour: 22
        },
        qualityMetrics: {
          defectRate: 8.5,
          reworkRate: 6.0,
          customerSatisfaction: 82,
          deliveryOnTime: 85,
          dimensionalAccuracy: 90
        },
        analysisDepth: 'detailed',
        confidenceLevel: 0.90,
        customBaseline: {
          throughput: 18,
          utilization: 65,
          qualityRate: 92,
          costPerHour: 38
        }
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.rootCauseAnalysis).toBeDefined();
        expect(Array.isArray(result.data.rootCauseAnalysis.performanceDrivers)).toBe(true);
        expect(result.data.rootCauseAnalysis.performanceDrivers.length).toBeGreaterThan(0);
        
        result.data.rootCauseAnalysis.performanceDrivers.forEach(driver => {
          expect(driver.factor).toBeDefined();
          expect(driver.impact).toBeGreaterThanOrEqual(0);
          expect(driver.impact).toBeLessThanOrEqual(100);
          expect(driver.correlation).toBeGreaterThanOrEqual(-1);
          expect(driver.correlation).toBeLessThanOrEqual(1);
          expect(typeof driver.actionable).toBe('boolean');
          expect(Array.isArray(driver.recommendations)).toBe(true);
        });
        
        expect(Array.isArray(result.data.rootCauseAnalysis.bottleneckIdentification)).toBe(true);
        result.data.rootCauseAnalysis.bottleneckIdentification.forEach(bottleneck => {
          expect(bottleneck.bottleneck).toBeDefined();
          expect(bottleneck.severity).toMatch(/critical|major|minor/);
          expect(bottleneck.impactOnThroughput).toBeGreaterThanOrEqual(0);
          expect(bottleneck.estimatedResolutionTime).toBeDefined();
          expect(bottleneck.resolutionCost).toBeGreaterThanOrEqual(0);
        });
        
        expect(Array.isArray(result.data.rootCauseAnalysis.improvementOpportunities)).toBe(true);
        result.data.rootCauseAnalysis.improvementOpportunities.forEach(opportunity => {
          expect(opportunity.opportunity).toBeDefined();
          expect(opportunity.potentialGain).toBeGreaterThan(0);
          expect(opportunity.implementationDifficulty).toMatch(/low|medium|high/);
          expect(opportunity.estimatedROI).toBeGreaterThan(0);
          expect(opportunity.timeToRealize).toBeDefined();
        });
      }
    });

    test('should generate action plan', async () => {
      const inputs: PerformanceBenchmarkingInputs = {
        benchmarkType: 'comprehensive',
        comparisonTarget: 'industry_standard',
        timeframe: 'quarterly',
        systemConfiguration: {
          laserPower: 4000,
          machineType: 'fiber',
          workingArea: 4000,
          automationLevel: 'fully_automatic',
          operatingHours: 18
        },
        performanceMetrics: {
          throughput: 32,
          utilization: 82,
          qualityRate: 95,
          energyEfficiency: 85,
          materialUtilization: 90
        },
        costMetrics: {
          operatingCostPerHour: 68,
          materialCostPerPart: 9.75,
          energyCostPerHour: 18,
          maintenanceCostPerMonth: 2800,
          laborCostPerHour: 38
        },
        qualityMetrics: {
          defectRate: 3.8,
          reworkRate: 2.2,
          customerSatisfaction: 91,
          deliveryOnTime: 93,
          dimensionalAccuracy: 96
        },
        analysisDepth: 'expert',
        confidenceLevel: 0.95
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.actionPlan).toBeDefined();
        expect(Array.isArray(result.data.actionPlan.prioritizedActions)).toBe(true);
        expect(result.data.actionPlan.prioritizedActions.length).toBeGreaterThan(0);
        
        result.data.actionPlan.prioritizedActions.forEach(action => {
          expect(action.action).toBeDefined();
          expect(action.priority).toMatch(/high|medium|low/);
          expect(action.expectedImpact).toBeGreaterThan(0);
          expect(action.implementationCost).toBeGreaterThanOrEqual(0);
          expect(action.timeframe).toBeDefined();
          expect(Array.isArray(action.resources)).toBe(true);
          expect(Array.isArray(action.successMetrics)).toBe(true);
        });
        
        expect(Array.isArray(result.data.actionPlan.quickWins)).toBe(true);
        result.data.actionPlan.quickWins.forEach(quickWin => {
          expect(quickWin.action).toBeDefined();
          expect(quickWin.expectedBenefit).toBeDefined();
          expect(quickWin.implementationTime).toBeDefined();
          expect(quickWin.cost).toBeGreaterThanOrEqual(0);
        });
        
        expect(Array.isArray(result.data.actionPlan.longTermInitiatives)).toBe(true);
        result.data.actionPlan.longTermInitiatives.forEach(initiative => {
          expect(initiative.initiative).toBeDefined();
          expect(initiative.strategicValue).toBeGreaterThanOrEqual(0);
          expect(initiative.strategicValue).toBeLessThanOrEqual(100);
          expect(initiative.investmentRequired).toBeGreaterThan(0);
          expect(initiative.paybackPeriod).toBeGreaterThan(0);
          expect(initiative.riskLevel).toMatch(/low|medium|high/);
        });
      }
    });

    test('should show different machine types produce different benchmarks', async () => {
      const baseInputs: PerformanceBenchmarkingInputs = {
        benchmarkType: 'system_performance',
        comparisonTarget: 'industry_standard',
        timeframe: 'monthly',
        systemConfiguration: {
          laserPower: 3000,
          workingArea: 3000,
          automationLevel: 'semi_automatic',
          operatingHours: 16,
          machineType: 'fiber'
        },
        performanceMetrics: {
          throughput: 25,
          utilization: 75,
          qualityRate: 95,
          energyEfficiency: 80,
          materialUtilization: 85
        },
        costMetrics: {
          operatingCostPerHour: 60,
          materialCostPerPart: 8.00,
          energyCostPerHour: 15,
          maintenanceCostPerMonth: 2000,
          laborCostPerHour: 30
        },
        qualityMetrics: {
          defectRate: 4.0,
          reworkRate: 2.5,
          customerSatisfaction: 90,
          deliveryOnTime: 92,
          dimensionalAccuracy: 95
        },
        analysisDepth: 'detailed',
        confidenceLevel: 0.95
      };

      const fiberResult = await calculator.calculate(baseInputs);
      const co2Result = await calculator.calculate({
        ...baseInputs,
        systemConfiguration: {
          ...baseInputs.systemConfiguration,
          machineType: 'co2'
        }
      });
      
      expect(fiberResult.success).toBe(true);
      expect(co2Result.success).toBe(true);
      
      if (fiberResult.data && co2Result.data) {
        // Different machine types should have different industry averages
        expect(fiberResult.data.industryComparison.industryAverages.throughput).not.toBe(
          co2Result.data.industryComparison.industryAverages.throughput
        );
        
        // Both should have valid performance analysis
        expect(fiberResult.data.performanceAnalysis.overallPerformanceIndex).toBeGreaterThan(0);
        expect(co2Result.data.performanceAnalysis.overallPerformanceIndex).toBeGreaterThan(0);
      }
    });

    test('should include calculation metadata', async () => {
      const inputs: PerformanceBenchmarkingInputs = {
        benchmarkType: 'comprehensive',
        comparisonTarget: 'industry_standard',
        timeframe: 'monthly',
        systemConfiguration: {
          laserPower: 3000,
          machineType: 'fiber',
          workingArea: 3000,
          automationLevel: 'semi_automatic',
          operatingHours: 16
        },
        performanceMetrics: {
          throughput: 28,
          utilization: 78,
          qualityRate: 96,
          energyEfficiency: 82,
          materialUtilization: 88
        },
        costMetrics: {
          operatingCostPerHour: 62,
          materialCostPerPart: 8.50,
          energyCostPerHour: 15,
          maintenanceCostPerMonth: 2500,
          laborCostPerHour: 35
        },
        qualityMetrics: {
          defectRate: 3.2,
          reworkRate: 1.8,
          customerSatisfaction: 92,
          deliveryOnTime: 94,
          dimensionalAccuracy: 97
        },
        analysisDepth: 'comprehensive',
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

  describe('Benchmark Types', () => {
    test('should handle different benchmark types correctly', async () => {
      const benchmarkTypes: PerformanceBenchmarkingInputs['benchmarkType'][] = ['system_performance', 'process_efficiency', 'quality_metrics', 'cost_effectiveness', 'comprehensive'];
      
      for (const benchmarkType of benchmarkTypes) {
        const inputs: PerformanceBenchmarkingInputs = {
          benchmarkType,
          comparisonTarget: 'industry_standard',
          timeframe: 'monthly',
          systemConfiguration: {
            laserPower: 3000,
            machineType: 'fiber',
            workingArea: 3000,
            automationLevel: 'semi_automatic',
            operatingHours: 16
          },
          performanceMetrics: {
            throughput: 28,
            utilization: 78,
            qualityRate: 96,
            energyEfficiency: 82,
            materialUtilization: 88
          },
          costMetrics: {
            operatingCostPerHour: 62,
            materialCostPerPart: 8.50,
            energyCostPerHour: 15,
            maintenanceCostPerMonth: 2500,
            laborCostPerHour: 35
          },
          qualityMetrics: {
            defectRate: 3.2,
            reworkRate: 1.8,
            customerSatisfaction: 92,
            deliveryOnTime: 94,
            dimensionalAccuracy: 97
          },
          analysisDepth: 'detailed',
          confidenceLevel: 0.95
        };

        const result = await calculator.calculate(inputs);
        
        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        
        if (result.data) {
          expect(result.data.benchmarkSummary.benchmarkType).toBe(benchmarkType);
          expect(result.data.performanceAnalysis.overallPerformanceIndex).toBeGreaterThan(0);
        }
      }
    });
  });

  describe('Default and Example Inputs', () => {
    test('should provide valid default inputs', () => {
      const defaults = calculator.getDefaultInputs();
      
      expect(defaults.benchmarkType).toBeDefined();
      expect(defaults.comparisonTarget).toBeDefined();
      expect(defaults.timeframe).toBeDefined();
      expect(defaults.systemConfiguration).toBeDefined();
      expect(defaults.performanceMetrics).toBeDefined();
      expect(defaults.costMetrics).toBeDefined();
      expect(defaults.qualityMetrics).toBeDefined();
      expect(defaults.analysisDepth).toBeDefined();
      expect(defaults.confidenceLevel).toBeGreaterThan(0.8);
      
      const validation = calculator.validateInputs(defaults);
      expect(validation.isValid).toBe(true);
    });

    test('should provide valid example inputs', () => {
      const examples = calculator.getExampleInputs();
      
      expect(examples.benchmarkType).toBe('comprehensive');
      expect(examples.comparisonTarget).toBe('industry_standard');
      expect(examples.timeframe).toBe('monthly');
      expect(examples.systemConfiguration.machineType).toBe('fiber');
      expect(examples.analysisDepth).toBe('comprehensive');
      expect(examples.confidenceLevel).toBe(0.95);
      
      const validation = calculator.validateInputs(examples);
      expect(validation.isValid).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    test('should handle minimum performance values', async () => {
      const minInputs: PerformanceBenchmarkingInputs = {
        benchmarkType: 'basic',
        comparisonTarget: 'industry_standard',
        timeframe: 'daily',
        systemConfiguration: {
          laserPower: 100, // Minimum power
          machineType: 'diode',
          workingArea: 100, // Minimum area
          automationLevel: 'manual',
          operatingHours: 8 // Minimum hours
        },
        performanceMetrics: {
          throughput: 5, // Low throughput
          utilization: 30, // Low utilization
          qualityRate: 70, // Low quality
          energyEfficiency: 50, // Low efficiency
          materialUtilization: 60 // Low material utilization
        },
        costMetrics: {
          operatingCostPerHour: 20,
          materialCostPerPart: 2.00,
          energyCostPerHour: 5,
          maintenanceCostPerMonth: 500,
          laborCostPerHour: 15
        },
        qualityMetrics: {
          defectRate: 15, // High defect rate
          reworkRate: 10, // High rework rate
          customerSatisfaction: 70,
          deliveryOnTime: 75,
          dimensionalAccuracy: 85
        },
        analysisDepth: 'basic',
        confidenceLevel: 0.80
      };

      const result = await calculator.calculate(minInputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.benchmarkSummary.performanceRating).toBe('poor');
        expect(result.data.warnings.length).toBeGreaterThan(0);
      }
    });

    test('should handle maximum performance values', async () => {
      const maxInputs: PerformanceBenchmarkingInputs = {
        benchmarkType: 'comprehensive',
        comparisonTarget: 'best_practice',
        timeframe: 'yearly',
        systemConfiguration: {
          laserPower: 20000, // Maximum power
          machineType: 'fiber',
          workingArea: 10000, // Maximum area
          automationLevel: 'fully_automatic',
          operatingHours: 24 // Maximum hours
        },
        performanceMetrics: {
          throughput: 100, // Very high throughput
          utilization: 100, // Maximum utilization
          qualityRate: 100, // Perfect quality
          energyEfficiency: 100, // Perfect efficiency
          materialUtilization: 100 // Perfect material utilization
        },
        costMetrics: {
          operatingCostPerHour: 200,
          materialCostPerPart: 50.00,
          energyCostPerHour: 100,
          maintenanceCostPerMonth: 10000,
          laborCostPerHour: 100
        },
        qualityMetrics: {
          defectRate: 0, // No defects
          reworkRate: 0, // No rework
          customerSatisfaction: 100,
          deliveryOnTime: 100,
          dimensionalAccuracy: 100
        },
        analysisDepth: 'expert',
        confidenceLevel: 0.99
      };

      const result = await calculator.calculate(maxInputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.benchmarkSummary.performanceRating).toBe('excellent');
        expect(result.data.industryComparison.competitivePosition).toBe('leader');
      }
    });
  });

  describe('Performance', () => {
    test('should complete benchmarking within reasonable time', async () => {
      const inputs: PerformanceBenchmarkingInputs = {
        benchmarkType: 'comprehensive',
        comparisonTarget: 'industry_standard',
        timeframe: 'monthly',
        systemConfiguration: {
          laserPower: 3000,
          machineType: 'fiber',
          workingArea: 3000,
          automationLevel: 'semi_automatic',
          operatingHours: 16
        },
        performanceMetrics: {
          throughput: 28,
          utilization: 78,
          qualityRate: 96,
          energyEfficiency: 82,
          materialUtilization: 88
        },
        costMetrics: {
          operatingCostPerHour: 62,
          materialCostPerPart: 8.50,
          energyCostPerHour: 15,
          maintenanceCostPerMonth: 2500,
          laborCostPerHour: 35
        },
        qualityMetrics: {
          defectRate: 3.2,
          reworkRate: 1.8,
          customerSatisfaction: 92,
          deliveryOnTime: 94,
          dimensionalAccuracy: 97
        },
        analysisDepth: 'comprehensive',
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
