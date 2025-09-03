// Test suite for Cost-Benefit Analyzer
// Comprehensive testing of financial analysis and investment decision support

import { describe, test, expect, beforeEach } from 'vitest';
import { CostBenefitAnalyzer, CostBenefitInputs } from '../CostBenefitAnalyzer';

describe('CostBenefitAnalyzer', () => {
  let calculator: CostBenefitAnalyzer;

  beforeEach(() => {
    calculator = new CostBenefitAnalyzer();
  });

  describe('Configuration', () => {
    test('should have correct calculator configuration', () => {
      expect(calculator.config.id).toBe('cost-benefit-analyzer');
      expect(calculator.config.title).toBe('Cost-Benefit Analyzer');
      expect(calculator.config.category).toBe('Advanced Analysis');
      expect(calculator.config.badge).toBe('Premium');
      expect(calculator.config.inputs).toHaveLength(6);
    });

    test('should have all required input fields', () => {
      const inputIds = calculator.config.inputs.map(input => input.id);
      expect(inputIds).toContain('projectType');
      expect(inputIds).toContain('initialInvestment');
      expect(inputIds).toContain('projectLifespan');
      expect(inputIds).toContain('discountRate');
      expect(inputIds).toContain('analysisType');
      expect(inputIds).toContain('confidenceLevel');
    });
  });

  describe('Input Validation', () => {
    test('should validate correct inputs', () => {
      const validInputs: CostBenefitInputs = {
        projectType: 'equipment_purchase',
        initialInvestment: 250000,
        projectLifespan: 7,
        discountRate: 0.10,
        currentOperatingCosts: {
          materialCosts: 120000,
          energyCosts: 45000,
          laborCosts: 180000,
          maintenanceCosts: 25000,
          overheadCosts: 60000
        },
        projectedSavings: {
          materialSavings: 15000,
          energySavings: 12000,
          laborSavings: 25000,
          maintenanceSavings: 8000,
          qualityImprovements: 10000
        },
        revenueImpact: {
          additionalRevenue: 50000,
          revenueGrowthRate: 0.05,
          marketShareGain: 0.02
        },
        riskFactors: {
          technologyRisk: 0.3,
          marketRisk: 0.4,
          operationalRisk: 0.2,
          competitiveRisk: 0.3
        },
        analysisType: 'detailed',
        confidenceLevel: 0.95
      };

      const validation = calculator.validateInputs(validInputs);
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    test('should reject invalid project type', () => {
      const invalidInputs = {
        projectType: 'invalid_project',
        initialInvestment: 250000,
        projectLifespan: 7,
        discountRate: 0.10,
        currentOperatingCosts: {
          materialCosts: 120000,
          energyCosts: 45000,
          laborCosts: 180000,
          maintenanceCosts: 25000,
          overheadCosts: 60000
        },
        projectedSavings: {
          materialSavings: 15000,
          energySavings: 12000,
          laborSavings: 25000,
          maintenanceSavings: 8000,
          qualityImprovements: 10000
        },
        revenueImpact: {
          additionalRevenue: 50000,
          revenueGrowthRate: 0.05,
          marketShareGain: 0.02
        },
        riskFactors: {
          technologyRisk: 0.3,
          marketRisk: 0.4,
          operationalRisk: 0.2,
          competitiveRisk: 0.3
        },
        analysisType: 'detailed',
        confidenceLevel: 0.95
      };

      const validation = calculator.validateInputs(invalidInputs);
      expect(validation.isValid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
    });

    test('should warn about high savings ratio', () => {
      const highSavingsInputs: CostBenefitInputs = {
        projectType: 'equipment_purchase',
        initialInvestment: 250000,
        projectLifespan: 7,
        discountRate: 0.10,
        currentOperatingCosts: {
          materialCosts: 50000,
          energyCosts: 20000,
          laborCosts: 30000,
          maintenanceCosts: 10000,
          overheadCosts: 15000
        },
        projectedSavings: {
          materialSavings: 40000, // Very high savings
          energySavings: 18000,
          laborSavings: 25000,
          maintenanceSavings: 8000,
          qualityImprovements: 10000
        },
        revenueImpact: {
          additionalRevenue: 50000,
          revenueGrowthRate: 0.05,
          marketShareGain: 0.02
        },
        riskFactors: {
          technologyRisk: 0.3,
          marketRisk: 0.4,
          operationalRisk: 0.2,
          competitiveRisk: 0.3
        },
        analysisType: 'detailed',
        confidenceLevel: 0.95
      };

      const validation = calculator.validateInputs(highSavingsInputs);
      expect(validation.warnings.some(w => w.code === 'HIGH_SAVINGS_RATIO')).toBe(true);
    });

    test('should warn about long payback period', () => {
      const longPaybackInputs: CostBenefitInputs = {
        projectType: 'equipment_purchase',
        initialInvestment: 1000000, // Very high investment
        projectLifespan: 5,
        discountRate: 0.10,
        currentOperatingCosts: {
          materialCosts: 120000,
          energyCosts: 45000,
          laborCosts: 180000,
          maintenanceCosts: 25000,
          overheadCosts: 60000
        },
        projectedSavings: {
          materialSavings: 5000, // Very low savings
          energySavings: 3000,
          laborSavings: 8000,
          maintenanceSavings: 2000,
          qualityImprovements: 2000
        },
        revenueImpact: {
          additionalRevenue: 10000, // Low additional revenue
          revenueGrowthRate: 0.02,
          marketShareGain: 0.01
        },
        riskFactors: {
          technologyRisk: 0.3,
          marketRisk: 0.4,
          operationalRisk: 0.2,
          competitiveRisk: 0.3
        },
        analysisType: 'detailed',
        confidenceLevel: 0.95
      };

      const validation = calculator.validateInputs(longPaybackInputs);
      expect(validation.warnings.some(w => w.code === 'LONG_PAYBACK_PERIOD')).toBe(true);
    });

    test('should warn about high discount rate', () => {
      const highDiscountInputs: CostBenefitInputs = {
        projectType: 'equipment_purchase',
        initialInvestment: 250000,
        projectLifespan: 7,
        discountRate: 0.25, // Very high discount rate
        currentOperatingCosts: {
          materialCosts: 120000,
          energyCosts: 45000,
          laborCosts: 180000,
          maintenanceCosts: 25000,
          overheadCosts: 60000
        },
        projectedSavings: {
          materialSavings: 15000,
          energySavings: 12000,
          laborSavings: 25000,
          maintenanceSavings: 8000,
          qualityImprovements: 10000
        },
        revenueImpact: {
          additionalRevenue: 50000,
          revenueGrowthRate: 0.05,
          marketShareGain: 0.02
        },
        riskFactors: {
          technologyRisk: 0.3,
          marketRisk: 0.4,
          operationalRisk: 0.2,
          competitiveRisk: 0.3
        },
        analysisType: 'detailed',
        confidenceLevel: 0.95
      };

      const validation = calculator.validateInputs(highDiscountInputs);
      expect(validation.warnings.some(w => w.code === 'HIGH_DISCOUNT_RATE')).toBe(true);
    });
  });

  describe('Financial Analysis', () => {
    test('should perform comprehensive financial analysis', async () => {
      const inputs: CostBenefitInputs = {
        projectType: 'equipment_purchase',
        initialInvestment: 250000,
        projectLifespan: 7,
        discountRate: 0.10,
        currentOperatingCosts: {
          materialCosts: 120000,
          energyCosts: 45000,
          laborCosts: 180000,
          maintenanceCosts: 25000,
          overheadCosts: 60000
        },
        projectedSavings: {
          materialSavings: 15000,
          energySavings: 12000,
          laborSavings: 25000,
          maintenanceSavings: 8000,
          qualityImprovements: 10000
        },
        revenueImpact: {
          additionalRevenue: 50000,
          revenueGrowthRate: 0.05,
          marketShareGain: 0.02
        },
        riskFactors: {
          technologyRisk: 0.3,
          marketRisk: 0.4,
          operationalRisk: 0.2,
          competitiveRisk: 0.3
        },
        analysisType: 'detailed',
        confidenceLevel: 0.95
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.financialMetrics).toBeDefined();
        expect(result.data.financialMetrics.npv).toBeDefined();
        expect(result.data.financialMetrics.irr).toBeGreaterThan(0);
        expect(result.data.financialMetrics.roi).toBeDefined();
        expect(result.data.financialMetrics.paybackPeriod).toBeGreaterThan(0);
        expect(result.data.financialMetrics.profitabilityIndex).toBeGreaterThan(0);
        expect(result.data.financialMetrics.breakEvenPoint).toBeGreaterThan(0);
        expect(result.data.financialMetrics.totalCostSavings).toBeGreaterThan(0);
        expect(result.data.financialMetrics.totalRevenueIncrease).toBeGreaterThan(0);
      }
    });

    test('should generate cash flow analysis', async () => {
      const inputs: CostBenefitInputs = {
        projectType: 'process_improvement',
        initialInvestment: 150000,
        projectLifespan: 5,
        discountRate: 0.08,
        currentOperatingCosts: {
          materialCosts: 80000,
          energyCosts: 30000,
          laborCosts: 120000,
          maintenanceCosts: 15000,
          overheadCosts: 40000
        },
        projectedSavings: {
          materialSavings: 10000,
          energySavings: 8000,
          laborSavings: 15000,
          maintenanceSavings: 5000,
          qualityImprovements: 7000
        },
        revenueImpact: {
          additionalRevenue: 30000,
          revenueGrowthRate: 0.03,
          marketShareGain: 0.015
        },
        riskFactors: {
          technologyRisk: 0.2,
          marketRisk: 0.3,
          operationalRisk: 0.15,
          competitiveRisk: 0.25
        },
        analysisType: 'detailed',
        confidenceLevel: 0.90
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.cashFlowAnalysis).toBeDefined();
        expect(result.data.cashFlowAnalysis.yearlyBreakdown).toBeDefined();
        expect(Array.isArray(result.data.cashFlowAnalysis.yearlyBreakdown)).toBe(true);
        expect(result.data.cashFlowAnalysis.yearlyBreakdown.length).toBe(inputs.projectLifespan);
        
        result.data.cashFlowAnalysis.yearlyBreakdown.forEach((year, index) => {
          expect(year.year).toBe(index + 1);
          expect(year.savings).toBeGreaterThan(0);
          expect(year.additionalRevenue).toBeGreaterThan(0);
          expect(year.netCashFlow).toBeGreaterThan(0);
          expect(year.presentValue).toBeGreaterThan(0);
        });
        
        expect(result.data.cashFlowAnalysis.totalInvestment).toBe(inputs.initialInvestment);
        expect(result.data.cashFlowAnalysis.totalSavings).toBeGreaterThan(0);
        expect(result.data.cashFlowAnalysis.totalRevenue).toBeGreaterThan(0);
        expect(result.data.cashFlowAnalysis.netBenefit).toBeDefined();
      }
    });

    test('should perform scenario analysis', async () => {
      const inputs: CostBenefitInputs = {
        projectType: 'capacity_expansion',
        initialInvestment: 400000,
        projectLifespan: 10,
        discountRate: 0.12,
        currentOperatingCosts: {
          materialCosts: 200000,
          energyCosts: 75000,
          laborCosts: 300000,
          maintenanceCosts: 50000,
          overheadCosts: 100000
        },
        projectedSavings: {
          materialSavings: 25000,
          energySavings: 20000,
          laborSavings: 40000,
          maintenanceSavings: 15000,
          qualityImprovements: 20000
        },
        revenueImpact: {
          additionalRevenue: 100000,
          revenueGrowthRate: 0.08,
          marketShareGain: 0.05
        },
        riskFactors: {
          technologyRisk: 0.4,
          marketRisk: 0.5,
          operationalRisk: 0.3,
          competitiveRisk: 0.4
        },
        analysisType: 'detailed',
        confidenceLevel: 0.95
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.scenarioAnalysis).toBeDefined();
        expect(result.data.scenarioAnalysis.baseCase).toBeDefined();
        expect(result.data.scenarioAnalysis.optimisticCase).toBeDefined();
        expect(result.data.scenarioAnalysis.pessimisticCase).toBeDefined();
        expect(result.data.scenarioAnalysis.worstCase).toBeDefined();
        
        // Check scenario structure
        const scenarios = [
          result.data.scenarioAnalysis.baseCase,
          result.data.scenarioAnalysis.optimisticCase,
          result.data.scenarioAnalysis.pessimisticCase,
          result.data.scenarioAnalysis.worstCase
        ];
        
        scenarios.forEach(scenario => {
          expect(scenario.name).toBeDefined();
          expect(scenario.probability).toBeGreaterThan(0);
          expect(scenario.probability).toBeLessThanOrEqual(1);
          expect(scenario.npv).toBeDefined();
          expect(scenario.irr).toBeGreaterThan(0);
          expect(scenario.roi).toBeDefined();
          expect(scenario.paybackPeriod).toBeGreaterThan(0);
          expect(Array.isArray(scenario.assumptions)).toBe(true);
        });
        
        expect(result.data.scenarioAnalysis.scenarioComparison).toBeDefined();
        expect(result.data.scenarioAnalysis.scenarioComparison.probabilityWeightedNPV).toBeDefined();
        expect(result.data.scenarioAnalysis.scenarioComparison.expectedROI).toBeDefined();
        expect(result.data.scenarioAnalysis.scenarioComparison.riskAdjustedReturn).toBeDefined();
      }
    });

    test('should conduct sensitivity analysis', async () => {
      const inputs: CostBenefitInputs = {
        projectType: 'technology_upgrade',
        initialInvestment: 300000,
        projectLifespan: 8,
        discountRate: 0.09,
        currentOperatingCosts: {
          materialCosts: 150000,
          energyCosts: 60000,
          laborCosts: 200000,
          maintenanceCosts: 35000,
          overheadCosts: 80000
        },
        projectedSavings: {
          materialSavings: 20000,
          energySavings: 15000,
          laborSavings: 30000,
          maintenanceSavings: 10000,
          qualityImprovements: 15000
        },
        revenueImpact: {
          additionalRevenue: 75000,
          revenueGrowthRate: 0.06,
          marketShareGain: 0.03
        },
        riskFactors: {
          technologyRisk: 0.5,
          marketRisk: 0.4,
          operationalRisk: 0.3,
          competitiveRisk: 0.4
        },
        analysisType: 'sensitivity',
        confidenceLevel: 0.95
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.sensitivityAnalysis).toBeDefined();
        expect(Array.isArray(result.data.sensitivityAnalysis.parameters)).toBe(true);
        expect(result.data.sensitivityAnalysis.parameters.length).toBeGreaterThan(0);
        
        result.data.sensitivityAnalysis.parameters.forEach(param => {
          expect(param.parameter).toBeDefined();
          expect(param.baseValue).toBeGreaterThan(0);
          expect(param.sensitivity).toBeGreaterThanOrEqual(0);
          expect(param.elasticity).toBeDefined();
          expect(param.impact).toMatch(/low|medium|high|critical/);
          expect(Array.isArray(param.variationRange)).toBe(true);
          expect(param.variationRange.length).toBe(2);
        });
        
        expect(Array.isArray(result.data.sensitivityAnalysis.tornadoChart)).toBe(true);
        result.data.sensitivityAnalysis.tornadoChart.forEach(item => {
          expect(item.parameter).toBeDefined();
          expect(item.lowImpact).toBeDefined();
          expect(item.highImpact).toBeDefined();
          expect(item.range).toBeGreaterThanOrEqual(0);
        });
        
        expect(Array.isArray(result.data.sensitivityAnalysis.criticalFactors)).toBe(true);
      }
    });

    test('should assess risks comprehensively', async () => {
      const inputs: CostBenefitInputs = {
        projectType: 'equipment_purchase',
        initialInvestment: 500000,
        projectLifespan: 12,
        discountRate: 0.11,
        currentOperatingCosts: {
          materialCosts: 250000,
          energyCosts: 100000,
          laborCosts: 400000,
          maintenanceCosts: 75000,
          overheadCosts: 150000
        },
        projectedSavings: {
          materialSavings: 35000,
          energySavings: 25000,
          laborSavings: 50000,
          maintenanceSavings: 20000,
          qualityImprovements: 30000
        },
        revenueImpact: {
          additionalRevenue: 120000,
          revenueGrowthRate: 0.07,
          marketShareGain: 0.04
        },
        riskFactors: {
          technologyRisk: 0.6,
          marketRisk: 0.7,
          operationalRisk: 0.5,
          competitiveRisk: 0.6
        },
        analysisType: 'detailed',
        confidenceLevel: 0.95
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.riskAssessment).toBeDefined();
        expect(result.data.riskAssessment.overallRiskScore).toBeGreaterThan(0);
        expect(result.data.riskAssessment.overallRiskScore).toBeLessThanOrEqual(100);
        
        expect(Array.isArray(result.data.riskAssessment.riskCategories)).toBe(true);
        result.data.riskAssessment.riskCategories.forEach(category => {
          expect(category.category).toBeDefined();
          expect(category.score).toBeGreaterThanOrEqual(0);
          expect(category.score).toBeLessThanOrEqual(100);
          expect(category.impact).toMatch(/low|medium|high|critical/);
          expect(Array.isArray(category.mitigation)).toBe(true);
        });
        
        expect(result.data.riskAssessment.probabilityOfSuccess).toBeGreaterThan(0);
        expect(result.data.riskAssessment.probabilityOfSuccess).toBeLessThanOrEqual(1);
        expect(result.data.riskAssessment.valueAtRisk).toBeGreaterThanOrEqual(0);
        expect(result.data.riskAssessment.expectedShortfall).toBeGreaterThanOrEqual(0);
      }
    });

    test('should compare with industry benchmarks', async () => {
      const inputs: CostBenefitInputs = {
        projectType: 'process_improvement',
        initialInvestment: 200000,
        projectLifespan: 6,
        discountRate: 0.10,
        currentOperatingCosts: {
          materialCosts: 100000,
          energyCosts: 40000,
          laborCosts: 150000,
          maintenanceCosts: 20000,
          overheadCosts: 50000
        },
        projectedSavings: {
          materialSavings: 15000,
          energySavings: 10000,
          laborSavings: 20000,
          maintenanceSavings: 6000,
          qualityImprovements: 9000
        },
        revenueImpact: {
          additionalRevenue: 40000,
          revenueGrowthRate: 0.04,
          marketShareGain: 0.02
        },
        riskFactors: {
          technologyRisk: 0.2,
          marketRisk: 0.3,
          operationalRisk: 0.15,
          competitiveRisk: 0.25
        },
        analysisType: 'detailed',
        confidenceLevel: 0.95
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.benchmarkComparison).toBeDefined();
        expect(result.data.benchmarkComparison.industryAverageROI).toBeGreaterThan(0);
        expect(result.data.benchmarkComparison.industryAveragePayback).toBeGreaterThan(0);
        expect(result.data.benchmarkComparison.performanceRanking).toMatch(/excellent|above_average|average|below_average|poor/);
        expect(Array.isArray(result.data.benchmarkComparison.competitiveAdvantage)).toBe(true);
        expect(Array.isArray(result.data.benchmarkComparison.improvementAreas)).toBe(true);
      }
    });

    test('should generate comprehensive recommendations', async () => {
      const inputs: CostBenefitInputs = {
        projectType: 'capacity_expansion',
        initialInvestment: 350000,
        projectLifespan: 9,
        discountRate: 0.08,
        currentOperatingCosts: {
          materialCosts: 180000,
          energyCosts: 70000,
          laborCosts: 250000,
          maintenanceCosts: 40000,
          overheadCosts: 90000
        },
        projectedSavings: {
          materialSavings: 25000,
          energySavings: 18000,
          laborSavings: 35000,
          maintenanceSavings: 12000,
          qualityImprovements: 20000
        },
        revenueImpact: {
          additionalRevenue: 80000,
          revenueGrowthRate: 0.05,
          marketShareGain: 0.025
        },
        riskFactors: {
          technologyRisk: 0.3,
          marketRisk: 0.4,
          operationalRisk: 0.25,
          competitiveRisk: 0.35
        },
        analysisType: 'detailed',
        confidenceLevel: 0.95
      };

      const result = await calculator.calculate(inputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.recommendations).toBeDefined();
        expect(result.data.recommendations.investmentDecision).toMatch(/strongly_recommend|recommend|conditional|not_recommend|strongly_against/);
        expect(Array.isArray(result.data.recommendations.reasoning)).toBe(true);
        expect(Array.isArray(result.data.recommendations.keySuccessFactors)).toBe(true);
        expect(Array.isArray(result.data.recommendations.implementationPriorities)).toBe(true);
        expect(Array.isArray(result.data.recommendations.alternativeOptions)).toBe(true);
        
        result.data.recommendations.implementationPriorities.forEach(priority => {
          expect(priority.priority).toBeDefined();
          expect(priority.timeline).toBeDefined();
          expect(priority.impact).toMatch(/high|medium|low/);
          expect(priority.effort).toMatch(/high|medium|low/);
        });
        
        result.data.recommendations.alternativeOptions.forEach(option => {
          expect(option.option).toBeDefined();
          expect(option.description).toBeDefined();
          expect(option.estimatedNPV).toBeDefined();
          expect(Array.isArray(option.pros)).toBe(true);
          expect(Array.isArray(option.cons)).toBe(true);
        });
      }
    });

    test('should show different project types produce different results', async () => {
      const baseInputs: CostBenefitInputs = {
        initialInvestment: 250000,
        projectLifespan: 7,
        discountRate: 0.10,
        currentOperatingCosts: {
          materialCosts: 120000,
          energyCosts: 45000,
          laborCosts: 180000,
          maintenanceCosts: 25000,
          overheadCosts: 60000
        },
        projectedSavings: {
          materialSavings: 15000,
          energySavings: 12000,
          laborSavings: 25000,
          maintenanceSavings: 8000,
          qualityImprovements: 10000
        },
        revenueImpact: {
          additionalRevenue: 50000,
          revenueGrowthRate: 0.05,
          marketShareGain: 0.02
        },
        riskFactors: {
          technologyRisk: 0.3,
          marketRisk: 0.4,
          operationalRisk: 0.2,
          competitiveRisk: 0.3
        },
        analysisType: 'detailed',
        confidenceLevel: 0.95,
        projectType: 'equipment_purchase'
      };

      const equipmentResult = await calculator.calculate(baseInputs);
      const processResult = await calculator.calculate({
        ...baseInputs,
        projectType: 'process_improvement'
      });
      
      expect(equipmentResult.success).toBe(true);
      expect(processResult.success).toBe(true);
      
      if (equipmentResult.data && processResult.data) {
        // Different project types should have different benchmark comparisons
        expect(equipmentResult.data.benchmarkComparison.industryAverageROI).not.toBe(
          processResult.data.benchmarkComparison.industryAverageROI
        );
        
        // Both should have valid financial metrics
        expect(equipmentResult.data.financialMetrics.npv).toBeDefined();
        expect(processResult.data.financialMetrics.npv).toBeDefined();
      }
    });

    test('should include calculation metadata', async () => {
      const inputs: CostBenefitInputs = {
        projectType: 'equipment_purchase',
        initialInvestment: 250000,
        projectLifespan: 7,
        discountRate: 0.10,
        currentOperatingCosts: {
          materialCosts: 120000,
          energyCosts: 45000,
          laborCosts: 180000,
          maintenanceCosts: 25000,
          overheadCosts: 60000
        },
        projectedSavings: {
          materialSavings: 15000,
          energySavings: 12000,
          laborSavings: 25000,
          maintenanceSavings: 8000,
          qualityImprovements: 10000
        },
        revenueImpact: {
          additionalRevenue: 50000,
          revenueGrowthRate: 0.05,
          marketShareGain: 0.02
        },
        riskFactors: {
          technologyRisk: 0.3,
          marketRisk: 0.4,
          operationalRisk: 0.2,
          competitiveRisk: 0.3
        },
        analysisType: 'detailed',
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

  describe('Analysis Types', () => {
    test('should handle different analysis types correctly', async () => {
      const analysisTypes: CostBenefitInputs['analysisType'][] = ['basic', 'detailed', 'monte_carlo', 'sensitivity'];
      
      for (const analysisType of analysisTypes) {
        const inputs: CostBenefitInputs = {
          projectType: 'equipment_purchase',
          initialInvestment: 250000,
          projectLifespan: 7,
          discountRate: 0.10,
          currentOperatingCosts: {
            materialCosts: 120000,
            energyCosts: 45000,
            laborCosts: 180000,
            maintenanceCosts: 25000,
            overheadCosts: 60000
          },
          projectedSavings: {
            materialSavings: 15000,
            energySavings: 12000,
            laborSavings: 25000,
            maintenanceSavings: 8000,
            qualityImprovements: 10000
          },
          revenueImpact: {
            additionalRevenue: 50000,
            revenueGrowthRate: 0.05,
            marketShareGain: 0.02
          },
          riskFactors: {
            technologyRisk: 0.3,
            marketRisk: 0.4,
            operationalRisk: 0.2,
            competitiveRisk: 0.3
          },
          analysisType,
          confidenceLevel: 0.95
        };

        const result = await calculator.calculate(inputs);
        
        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        
        if (result.data) {
          expect(result.data.financialMetrics.npv).toBeDefined();
          expect(result.data.cashFlowAnalysis).toBeDefined();
        }
      }
    });
  });

  describe('Default and Example Inputs', () => {
    test('should provide valid default inputs', () => {
      const defaults = calculator.getDefaultInputs();
      
      expect(defaults.projectType).toBeDefined();
      expect(defaults.initialInvestment).toBeGreaterThan(0);
      expect(defaults.projectLifespan).toBeGreaterThan(0);
      expect(defaults.discountRate).toBeGreaterThan(0);
      expect(defaults.currentOperatingCosts).toBeDefined();
      expect(defaults.projectedSavings).toBeDefined();
      expect(defaults.revenueImpact).toBeDefined();
      expect(defaults.riskFactors).toBeDefined();
      expect(defaults.analysisType).toBeDefined();
      expect(defaults.confidenceLevel).toBeGreaterThan(0.8);
      
      const validation = calculator.validateInputs(defaults);
      expect(validation.isValid).toBe(true);
    });

    test('should provide valid example inputs', () => {
      const examples = calculator.getExampleInputs();
      
      expect(examples.projectType).toBe('equipment_purchase');
      expect(examples.initialInvestment).toBe(250000);
      expect(examples.projectLifespan).toBe(7);
      expect(examples.discountRate).toBe(0.10);
      expect(examples.analysisType).toBe('detailed');
      expect(examples.confidenceLevel).toBe(0.95);
      
      const validation = calculator.validateInputs(examples);
      expect(validation.isValid).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    test('should handle minimum investment', async () => {
      const minInputs: CostBenefitInputs = {
        projectType: 'process_improvement',
        initialInvestment: 1000, // Minimum investment
        projectLifespan: 1, // Minimum lifespan
        discountRate: 0.01, // Minimum discount rate
        currentOperatingCosts: {
          materialCosts: 50000,
          energyCosts: 20000,
          laborCosts: 80000,
          maintenanceCosts: 10000,
          overheadCosts: 25000
        },
        projectedSavings: {
          materialSavings: 5000,
          energySavings: 3000,
          laborSavings: 8000,
          maintenanceSavings: 2000,
          qualityImprovements: 2000
        },
        revenueImpact: {
          additionalRevenue: 10000,
          revenueGrowthRate: 0.01,
          marketShareGain: 0.005
        },
        riskFactors: {
          technologyRisk: 0.1,
          marketRisk: 0.1,
          operationalRisk: 0.1,
          competitiveRisk: 0.1
        },
        analysisType: 'basic',
        confidenceLevel: 0.80
      };

      const result = await calculator.calculate(minInputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.financialMetrics.npv).toBeDefined();
        expect(result.data.financialMetrics.paybackPeriod).toBeGreaterThan(0);
      }
    });

    test('should handle maximum investment', async () => {
      const maxInputs: CostBenefitInputs = {
        projectType: 'capacity_expansion',
        initialInvestment: 10000000, // Maximum investment
        projectLifespan: 20, // Maximum lifespan
        discountRate: 0.30, // Maximum discount rate
        currentOperatingCosts: {
          materialCosts: 1000000,
          energyCosts: 500000,
          laborCosts: 1000000,
          maintenanceCosts: 200000,
          overheadCosts: 500000
        },
        projectedSavings: {
          materialSavings: 100000,
          energySavings: 50000,
          laborSavings: 100000,
          maintenanceSavings: 30000,
          qualityImprovements: 70000
        },
        revenueImpact: {
          additionalRevenue: 500000,
          revenueGrowthRate: 0.10,
          marketShareGain: 0.05
        },
        riskFactors: {
          technologyRisk: 1.0,
          marketRisk: 1.0,
          operationalRisk: 1.0,
          competitiveRisk: 1.0
        },
        analysisType: 'monte_carlo',
        confidenceLevel: 0.99
      };

      const result = await calculator.calculate(maxInputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.warnings.length).toBeGreaterThan(0); // Should have warnings for extreme values
        expect(result.data.riskAssessment.overallRiskScore).toBeGreaterThan(90); // Should show high risk
      }
    });

    test('should handle negative NPV scenarios', async () => {
      const negativeNPVInputs: CostBenefitInputs = {
        projectType: 'technology_upgrade',
        initialInvestment: 1000000, // Very high investment
        projectLifespan: 3, // Short lifespan
        discountRate: 0.25, // High discount rate
        currentOperatingCosts: {
          materialCosts: 100000,
          energyCosts: 40000,
          laborCosts: 150000,
          maintenanceCosts: 20000,
          overheadCosts: 50000
        },
        projectedSavings: {
          materialSavings: 5000, // Very low savings
          energySavings: 3000,
          laborSavings: 8000,
          maintenanceSavings: 2000,
          qualityImprovements: 2000
        },
        revenueImpact: {
          additionalRevenue: 10000, // Very low additional revenue
          revenueGrowthRate: 0.01,
          marketShareGain: 0.005
        },
        riskFactors: {
          technologyRisk: 0.8,
          marketRisk: 0.9,
          operationalRisk: 0.7,
          competitiveRisk: 0.8
        },
        analysisType: 'detailed',
        confidenceLevel: 0.95
      };

      const result = await calculator.calculate(negativeNPVInputs);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.financialMetrics.npv).toBeLessThan(0);
        expect(result.data.recommendations.investmentDecision).toMatch(/not_recommend|strongly_against/);
        expect(result.data.warnings.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Performance', () => {
    test('should complete analysis within reasonable time', async () => {
      const inputs: CostBenefitInputs = {
        projectType: 'equipment_purchase',
        initialInvestment: 250000,
        projectLifespan: 7,
        discountRate: 0.10,
        currentOperatingCosts: {
          materialCosts: 120000,
          energyCosts: 45000,
          laborCosts: 180000,
          maintenanceCosts: 25000,
          overheadCosts: 60000
        },
        projectedSavings: {
          materialSavings: 15000,
          energySavings: 12000,
          laborSavings: 25000,
          maintenanceSavings: 8000,
          qualityImprovements: 10000
        },
        revenueImpact: {
          additionalRevenue: 50000,
          revenueGrowthRate: 0.05,
          marketShareGain: 0.02
        },
        riskFactors: {
          technologyRisk: 0.3,
          marketRisk: 0.4,
          operationalRisk: 0.2,
          competitiveRisk: 0.3
        },
        analysisType: 'detailed',
        confidenceLevel: 0.95
      };

      const startTime = performance.now();
      const result = await calculator.calculate(inputs);
      const endTime = performance.now();
      
      expect(result.success).toBe(true);
      expect(endTime - startTime).toBeLessThan(3000); // Should complete in <3000ms
    });
  });
});
