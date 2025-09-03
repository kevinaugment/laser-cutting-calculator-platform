// Cost-Benefit Analyzer Implementation
// Comprehensive financial analysis for laser cutting investment decisions

import { z } from 'zod';
import Decimal from 'decimal.js';
import { 
  BaseCalculator, 
  BaseCalculatorConfig, 
  BaseCalculationResult,
  ValidationResult 
} from '@/lib/calculator/BaseCalculator';

// Input validation schema
const costBenefitSchema = z.object({
  projectType: z.enum(['equipment_purchase', 'process_improvement', 'capacity_expansion', 'technology_upgrade']),
  initialInvestment: z.number().min(1000).max(10000000),
  projectLifespan: z.number().min(1).max(20),
  discountRate: z.number().min(0.01).max(0.30),
  currentOperatingCosts: z.object({
    materialCosts: z.number().min(0).max(1000000),
    energyCosts: z.number().min(0).max(500000),
    laborCosts: z.number().min(0).max(1000000),
    maintenanceCosts: z.number().min(0).max(200000),
    overheadCosts: z.number().min(0).max(500000)
  }),
  projectedSavings: z.object({
    materialSavings: z.number().min(0).max(500000),
    energySavings: z.number().min(0).max(200000),
    laborSavings: z.number().min(0).max(500000),
    maintenanceSavings: z.number().min(0).max(100000),
    qualityImprovements: z.number().min(0).max(200000)
  }),
  revenueImpact: z.object({
    additionalRevenue: z.number().min(0).max(2000000),
    revenueGrowthRate: z.number().min(0).max(0.50),
    marketShareGain: z.number().min(0).max(0.30)
  }),
  riskFactors: z.object({
    technologyRisk: z.number().min(0.1).max(1.0),
    marketRisk: z.number().min(0.1).max(1.0),
    operationalRisk: z.number().min(0.1).max(1.0),
    competitiveRisk: z.number().min(0.1).max(1.0)
  }),
  analysisType: z.enum(['basic', 'detailed', 'monte_carlo', 'sensitivity']),
  confidenceLevel: z.number().min(0.80).max(0.99),
  inflationRate: z.number().min(0).max(0.10).optional(),
  taxRate: z.number().min(0).max(0.50).optional()
});

// Input types
export type CostBenefitInputs = z.infer<typeof costBenefitSchema>;

// Result types
export interface CostBenefitResults {
  financialMetrics: {
    npv: number;                    // Net Present Value (USD)
    irr: number;                    // Internal Rate of Return (%)
    roi: number;                    // Return on Investment (%)
    paybackPeriod: number;          // Years
    profitabilityIndex: number;     // PI ratio
    breakEvenPoint: number;         // Years
    totalCostSavings: number;       // USD over project life
    totalRevenueIncrease: number;   // USD over project life
  };
  cashFlowAnalysis: {
    yearlyBreakdown: Array<{
      year: number;
      initialInvestment: number;
      operatingCosts: number;
      savings: number;
      additionalRevenue: number;
      netCashFlow: number;
      cumulativeCashFlow: number;
      presentValue: number;
      cumulativePV: number;
    }>;
    totalInvestment: number;
    totalSavings: number;
    totalRevenue: number;
    netBenefit: number;
  };
  scenarioAnalysis: {
    baseCase: ScenarioResult;
    optimisticCase: ScenarioResult;
    pessimisticCase: ScenarioResult;
    worstCase: ScenarioResult;
    scenarioComparison: {
      probabilityWeightedNPV: number;
      expectedROI: number;
      riskAdjustedReturn: number;
    };
  };
  sensitivityAnalysis: {
    parameters: Array<{
      parameter: string;
      baseValue: number;
      sensitivity: number;          // % change in NPV per % change in parameter
      elasticity: number;           // Elasticity coefficient
      impact: 'low' | 'medium' | 'high' | 'critical';
      variationRange: [number, number]; // Min/max reasonable values
    }>;
    tornadoChart: Array<{
      parameter: string;
      lowImpact: number;           // NPV at low parameter value
      highImpact: number;          // NPV at high parameter value
      range: number;               // Absolute range
    }>;
    criticalFactors: string[];
  };
  riskAssessment: {
    overallRiskScore: number;        // 0-100 scale
    riskCategories: Array<{
      category: string;
      score: number;               // 0-100
      impact: 'low' | 'medium' | 'high' | 'critical';
      mitigation: string[];
    }>;
    probabilityOfSuccess: number;    // 0-1 scale
    valueAtRisk: number;            // USD at 95% confidence
    expectedShortfall: number;       // USD conditional VaR
  };
  benchmarkComparison: {
    industryAverageROI: number;
    industryAveragePayback: number;
    performanceRanking: 'excellent' | 'above_average' | 'average' | 'below_average' | 'poor';
    competitiveAdvantage: string[];
    improvementAreas: string[];
  };
  recommendations: {
    investmentDecision: 'strongly_recommend' | 'recommend' | 'conditional' | 'not_recommend' | 'strongly_against';
    reasoning: string[];
    keySuccessFactors: string[];
    implementationPriorities: Array<{
      priority: string;
      timeline: string;
      impact: 'high' | 'medium' | 'low';
      effort: 'high' | 'medium' | 'low';
    }>;
    alternativeOptions: Array<{
      option: string;
      description: string;
      estimatedNPV: number;
      pros: string[];
      cons: string[];
    }>;
  };
  warnings: string[];
}

interface ScenarioResult {
  name: string;
  probability: number;
  npv: number;
  irr: number;
  roi: number;
  paybackPeriod: number;
  assumptions: string[];
}

// Industry benchmarks for different project types
const industryBenchmarks = {
  equipment_purchase: {
    averageROI: 18,
    averagePayback: 3.2,
    successRate: 0.75
  },
  process_improvement: {
    averageROI: 25,
    averagePayback: 2.1,
    successRate: 0.85
  },
  capacity_expansion: {
    averageROI: 22,
    averagePayback: 2.8,
    successRate: 0.70
  },
  technology_upgrade: {
    averageROI: 20,
    averagePayback: 3.5,
    successRate: 0.65
  }
};

export class CostBenefitAnalyzer extends BaseCalculator {
  readonly config: BaseCalculatorConfig = {
    id: 'cost-benefit-analyzer',
    title: 'Cost-Benefit Analyzer',
    description: 'Comprehensive financial analysis for laser cutting investment decisions with NPV, IRR, and risk assessment',
    category: 'Advanced Analysis',
    badge: 'Premium',
    iconName: 'Calculator',
    inputs: [
      {
        id: 'projectType',
        label: 'Project Type',
        type: 'select',
        required: true,
        help: 'Type of investment project',
        options: [
          { value: 'equipment_purchase', label: 'Equipment Purchase' },
          { value: 'process_improvement', label: 'Process Improvement' },
          { value: 'capacity_expansion', label: 'Capacity Expansion' },
          { value: 'technology_upgrade', label: 'Technology Upgrade' }
        ]
      },
      {
        id: 'initialInvestment',
        label: 'Initial Investment',
        type: 'number',
        required: true,
        min: 1000,
        max: 10000000,
        step: 1000,
        unit: 'USD',
        help: 'Total upfront investment required'
      },
      {
        id: 'projectLifespan',
        label: 'Project Lifespan',
        type: 'number',
        required: true,
        min: 1,
        max: 20,
        step: 1,
        unit: 'years',
        help: 'Expected project duration'
      },
      {
        id: 'discountRate',
        label: 'Discount Rate',
        type: 'number',
        required: true,
        min: 0.01,
        max: 0.30,
        step: 0.01,
        unit: '%',
        help: 'Cost of capital or required rate of return'
      },
      {
        id: 'analysisType',
        label: 'Analysis Type',
        type: 'select',
        required: true,
        help: 'Depth of financial analysis',
        options: [
          { value: 'basic', label: 'Basic Analysis' },
          { value: 'detailed', label: 'Detailed Analysis' },
          { value: 'monte_carlo', label: 'Monte Carlo Simulation' },
          { value: 'sensitivity', label: 'Sensitivity Analysis' }
        ]
      },
      {
        id: 'confidenceLevel',
        label: 'Confidence Level',
        type: 'number',
        required: true,
        min: 0.80,
        max: 0.99,
        step: 0.01,
        help: 'Statistical confidence level for analysis'
      }
    ],
    resultType: 'analysis',
    version: '1.0.0',
    lastUpdated: '2025-01-02'
  };

  getInputSchema(): z.ZodSchema {
    return costBenefitSchema;
  }

  customValidation(inputs: CostBenefitInputs): Pick<ValidationResult, 'errors' | 'warnings'> {
    const errors: ValidationResult['errors'] = [];
    const warnings: ValidationResult['warnings'] = [];

    // Check if savings are realistic compared to current costs
    const totalCurrentCosts = Object.values(inputs.currentOperatingCosts).reduce((sum, cost) => sum + cost, 0);
    const totalProjectedSavings = Object.values(inputs.projectedSavings).reduce((sum, saving) => sum + saving, 0);
    
    if (totalProjectedSavings > totalCurrentCosts * 0.8) {
      warnings.push({
        field: 'projectedSavings',
        message: 'Projected savings exceed 80% of current costs - verify assumptions',
        code: 'HIGH_SAVINGS_RATIO'
      });
    }

    // Check payback period feasibility
    const annualSavings = totalProjectedSavings + inputs.revenueImpact.additionalRevenue;
    const roughPayback = inputs.initialInvestment / annualSavings;
    
    if (roughPayback > inputs.projectLifespan) {
      warnings.push({
        field: 'initialInvestment',
        message: 'Investment may not pay back within project lifespan',
        code: 'LONG_PAYBACK_PERIOD'
      });
    }

    // Check discount rate reasonableness
    if (inputs.discountRate > 0.20) {
      warnings.push({
        field: 'discountRate',
        message: 'Very high discount rate may undervalue long-term benefits',
        code: 'HIGH_DISCOUNT_RATE'
      });
    }

    // Check risk factor consistency
    const avgRisk = Object.values(inputs.riskFactors).reduce((sum, risk) => sum + risk, 0) / 4;
    if (avgRisk > 0.8 && inputs.analysisType === 'basic') {
      warnings.push({
        field: 'analysisType',
        message: 'High risk factors suggest detailed analysis would be more appropriate',
        code: 'HIGH_RISK_BASIC_ANALYSIS'
      });
    }

    return { errors, warnings };
  }

  async calculate(inputs: CostBenefitInputs): Promise<BaseCalculationResult> {
    try {
      const startTime = Date.now();
      
      // Calculate financial metrics
      const financialMetrics = this.calculateFinancialMetrics(inputs);
      
      // Generate cash flow analysis
      const cashFlowAnalysis = this.generateCashFlowAnalysis(inputs);
      
      // Perform scenario analysis
      const scenarioAnalysis = this.performScenarioAnalysis(inputs, financialMetrics);
      
      // Conduct sensitivity analysis
      const sensitivityAnalysis = this.conductSensitivityAnalysis(inputs, financialMetrics);
      
      // Assess risks
      const riskAssessment = this.assessRisks(inputs, financialMetrics);
      
      // Compare with industry benchmarks
      const benchmarkComparison = this.compareBenchmarks(inputs, financialMetrics);
      
      // Generate recommendations
      const recommendations = this.generateRecommendations(inputs, financialMetrics, riskAssessment, benchmarkComparison);
      
      // Generate warnings
      const warnings = this.generateWarnings(inputs, financialMetrics, riskAssessment);
      
      const results: CostBenefitResults = {
        financialMetrics,
        cashFlowAnalysis,
        scenarioAnalysis,
        sensitivityAnalysis,
        riskAssessment,
        benchmarkComparison,
        recommendations,
        warnings
      };

      return this.createSuccessResult(results, inputs);

    } catch (error) {
      return this.createErrorResult(
        `Cost-benefit analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        inputs
      );
    }
  }

  private calculateFinancialMetrics(inputs: CostBenefitInputs) {
    const totalCurrentCosts = Object.values(inputs.currentOperatingCosts).reduce((sum, cost) => sum + cost, 0);
    const totalProjectedSavings = Object.values(inputs.projectedSavings).reduce((sum, saving) => sum + saving, 0);
    const annualSavings = totalProjectedSavings;
    const annualRevenue = inputs.revenueImpact.additionalRevenue;
    const annualBenefit = annualSavings + annualRevenue;
    
    // Calculate NPV
    let npv = -inputs.initialInvestment;
    for (let year = 1; year <= inputs.projectLifespan; year++) {
      const yearlyBenefit = annualBenefit * Math.pow(1 + (inputs.revenueImpact.revenueGrowthRate || 0), year - 1);
      npv += yearlyBenefit / Math.pow(1 + inputs.discountRate, year);
    }
    
    // Calculate IRR (simplified Newton-Raphson method)
    const irr = this.calculateIRR(inputs.initialInvestment, annualBenefit, inputs.projectLifespan);
    
    // Calculate ROI
    const totalBenefits = annualBenefit * inputs.projectLifespan;
    const roi = ((totalBenefits - inputs.initialInvestment) / inputs.initialInvestment) * 100;
    
    // Calculate Payback Period
    const paybackPeriod = inputs.initialInvestment / annualBenefit;
    
    // Calculate Profitability Index
    const presentValueOfBenefits = totalBenefits / Math.pow(1 + inputs.discountRate, inputs.projectLifespan / 2);
    const profitabilityIndex = presentValueOfBenefits / inputs.initialInvestment;
    
    // Calculate Break-even Point
    const breakEvenPoint = Math.log(1 + (inputs.initialInvestment * inputs.discountRate) / annualBenefit) / Math.log(1 + inputs.discountRate);
    
    return {
      npv: Math.round(npv),
      irr: Math.round(irr * 100) / 100,
      roi: Math.round(roi * 100) / 100,
      paybackPeriod: Math.round(paybackPeriod * 100) / 100,
      profitabilityIndex: Math.round(profitabilityIndex * 100) / 100,
      breakEvenPoint: Math.round(breakEvenPoint * 100) / 100,
      totalCostSavings: Math.round(totalProjectedSavings * inputs.projectLifespan),
      totalRevenueIncrease: Math.round(annualRevenue * inputs.projectLifespan)
    };
  }

  private calculateIRR(investment: number, annualBenefit: number, years: number): number {
    // Simplified IRR calculation using approximation
    let rate = 0.1; // Initial guess
    let tolerance = 0.0001;
    let maxIterations = 100;
    
    for (let i = 0; i < maxIterations; i++) {
      let npv = -investment;
      let derivative = 0;
      
      for (let year = 1; year <= years; year++) {
        const factor = Math.pow(1 + rate, year);
        npv += annualBenefit / factor;
        derivative -= (year * annualBenefit) / Math.pow(1 + rate, year + 1);
      }
      
      if (Math.abs(npv) < tolerance) break;
      
      rate = rate - npv / derivative;
      
      if (rate < 0) rate = 0.01; // Prevent negative rates
      if (rate > 1) rate = 0.99; // Cap at 99%
    }
    
    return rate;
  }

  private generateCashFlowAnalysis(inputs: CostBenefitInputs) {
    const totalProjectedSavings = Object.values(inputs.projectedSavings).reduce((sum, saving) => sum + saving, 0);
    const annualSavings = totalProjectedSavings;
    const annualRevenue = inputs.revenueImpact.additionalRevenue;
    
    const yearlyBreakdown = [];
    let cumulativeCashFlow = -inputs.initialInvestment;
    let cumulativePV = -inputs.initialInvestment;
    
    for (let year = 1; year <= inputs.projectLifespan; year++) {
      const growthFactor = Math.pow(1 + (inputs.revenueImpact.revenueGrowthRate || 0), year - 1);
      const yearlyRevenue = annualRevenue * growthFactor;
      const yearlySavings = annualSavings * growthFactor;
      const netCashFlow = yearlySavings + yearlyRevenue;
      const presentValue = netCashFlow / Math.pow(1 + inputs.discountRate, year);
      
      cumulativeCashFlow += netCashFlow;
      cumulativePV += presentValue;
      
      yearlyBreakdown.push({
        year,
        initialInvestment: year === 1 ? inputs.initialInvestment : 0,
        operatingCosts: Object.values(inputs.currentOperatingCosts).reduce((sum, cost) => sum + cost, 0),
        savings: Math.round(yearlySavings),
        additionalRevenue: Math.round(yearlyRevenue),
        netCashFlow: Math.round(netCashFlow),
        cumulativeCashFlow: Math.round(cumulativeCashFlow),
        presentValue: Math.round(presentValue),
        cumulativePV: Math.round(cumulativePV)
      });
    }
    
    return {
      yearlyBreakdown,
      totalInvestment: inputs.initialInvestment,
      totalSavings: Math.round(annualSavings * inputs.projectLifespan),
      totalRevenue: Math.round(annualRevenue * inputs.projectLifespan),
      netBenefit: Math.round(cumulativeCashFlow)
    };
  }

  private performScenarioAnalysis(inputs: CostBenefitInputs, baseMetrics: any) {
    // Base case (current inputs)
    const baseCase: ScenarioResult = {
      name: 'Base Case',
      probability: 0.5,
      npv: baseMetrics.npv,
      irr: baseMetrics.irr,
      roi: baseMetrics.roi,
      paybackPeriod: baseMetrics.paybackPeriod,
      assumptions: ['Current market conditions', 'Expected performance levels']
    };
    
    // Optimistic case (20% better performance)
    const optimisticInputs = this.adjustInputsForScenario(inputs, 1.2);
    const optimisticMetrics = this.calculateFinancialMetrics(optimisticInputs);
    const optimisticCase: ScenarioResult = {
      name: 'Optimistic Case',
      probability: 0.25,
      npv: optimisticMetrics.npv,
      irr: optimisticMetrics.irr,
      roi: optimisticMetrics.roi,
      paybackPeriod: optimisticMetrics.paybackPeriod,
      assumptions: ['Favorable market conditions', 'Above-expected performance']
    };
    
    // Pessimistic case (20% worse performance)
    const pessimisticInputs = this.adjustInputsForScenario(inputs, 0.8);
    const pessimisticMetrics = this.calculateFinancialMetrics(pessimisticInputs);
    const pessimisticCase: ScenarioResult = {
      name: 'Pessimistic Case',
      probability: 0.2,
      nnpv: pessimisticMetrics.npv,
      irr: pessimisticMetrics.irr,
      roi: pessimisticMetrics.roi,
      paybackPeriod: pessimisticMetrics.paybackPeriod,
      assumptions: ['Challenging market conditions', 'Below-expected performance']
    };
    
    // Worst case (40% worse performance)
    const worstInputs = this.adjustInputsForScenario(inputs, 0.6);
    const worstMetrics = this.calculateFinancialMetrics(worstInputs);
    const worstCase: ScenarioResult = {
      name: 'Worst Case',
      probability: 0.05,
      npv: worstMetrics.npv,
      irr: worstMetrics.irr,
      roi: worstMetrics.roi,
      paybackPeriod: worstMetrics.paybackPeriod,
      assumptions: ['Severe market downturn', 'Significant performance issues']
    };
    
    // Calculate probability-weighted metrics
    const probabilityWeightedNPV = 
      baseCase.npv * baseCase.probability +
      optimisticCase.npv * optimisticCase.probability +
      pessimisticCase.npv * pessimisticCase.probability +
      worstCase.npv * worstCase.probability;
    
    const expectedROI = 
      baseCase.roi * baseCase.probability +
      optimisticCase.roi * optimisticCase.probability +
      pessimisticCase.roi * pessimisticCase.probability +
      worstCase.roi * worstCase.probability;
    
    // Risk-adjusted return (considering downside scenarios)
    const riskAdjustedReturn = expectedROI * (1 - this.calculateOverallRisk(inputs));
    
    return {
      baseCase,
      optimisticCase,
      pessimisticCase,
      worstCase,
      scenarioComparison: {
        probabilityWeightedNPV: Math.round(probabilityWeightedNPV),
        expectedROI: Math.round(expectedROI * 100) / 100,
        riskAdjustedReturn: Math.round(riskAdjustedReturn * 100) / 100
      }
    };
  }

  private adjustInputsForScenario(inputs: CostBenefitInputs, multiplier: number): CostBenefitInputs {
    return {
      ...inputs,
      projectedSavings: {
        materialSavings: inputs.projectedSavings.materialSavings * multiplier,
        energySavings: inputs.projectedSavings.energySavings * multiplier,
        laborSavings: inputs.projectedSavings.laborSavings * multiplier,
        maintenanceSavings: inputs.projectedSavings.maintenanceSavings * multiplier,
        qualityImprovements: inputs.projectedSavings.qualityImprovements * multiplier
      },
      revenueImpact: {
        ...inputs.revenueImpact,
        additionalRevenue: inputs.revenueImpact.additionalRevenue * multiplier
      }
    };
  }

  private conductSensitivityAnalysis(inputs: CostBenefitInputs, baseMetrics: any) {
    const parameters = [
      { name: 'initialInvestment', baseValue: inputs.initialInvestment, variation: 0.2 },
      { name: 'materialSavings', baseValue: inputs.projectedSavings.materialSavings, variation: 0.3 },
      { name: 'additionalRevenue', baseValue: inputs.revenueImpact.additionalRevenue, variation: 0.4 },
      { name: 'discountRate', baseValue: inputs.discountRate, variation: 0.3 },
      { name: 'projectLifespan', baseValue: inputs.projectLifespan, variation: 0.2 }
    ];
    
    const sensitivityResults = parameters.map(param => {
      const lowValue = param.baseValue * (1 - param.variation);
      const highValue = param.baseValue * (1 + param.variation);
      
      // Calculate NPV at low and high values
      const lowInputs = this.adjustParameterValue(inputs, param.name, lowValue);
      const highInputs = this.adjustParameterValue(inputs, param.name, highValue);
      
      const lowNPV = this.calculateFinancialMetrics(lowInputs).npv;
      const highNPV = this.calculateFinancialMetrics(highInputs).npv;
      
      // Calculate sensitivity
      const parameterChange = ((highValue - lowValue) / param.baseValue) * 100;
      const npvChange = ((highNPV - lowNPV) / baseMetrics.npv) * 100;
      const sensitivity = Math.abs(npvChange / parameterChange);
      
      // Calculate elasticity
      const elasticity = (npvChange / parameterChange);
      
      return {
        parameter: param.name,
        baseValue: param.baseValue,
        sensitivity: Math.round(sensitivity * 100) / 100,
        elasticity: Math.round(elasticity * 100) / 100,
        impact: this.classifyImpact(sensitivity),
        variationRange: [lowValue, highValue] as [number, number]
      };
    });
    
    // Generate tornado chart data
    const tornadoChart = sensitivityResults.map(param => {
      const lowInputs = this.adjustParameterValue(inputs, param.parameter, param.variationRange[0]);
      const highInputs = this.adjustParameterValue(inputs, param.parameter, param.variationRange[1]);
      
      const lowImpact = this.calculateFinancialMetrics(lowInputs).npv;
      const highImpact = this.calculateFinancialMetrics(highInputs).npv;
      
      return {
        parameter: param.parameter,
        lowImpact,
        highImpact,
        range: Math.abs(highImpact - lowImpact)
      };
    }).sort((a, b) => b.range - a.range);
    
    // Identify critical factors
    const criticalFactors = sensitivityResults
      .filter(param => param.impact === 'critical' || param.impact === 'high')
      .map(param => param.parameter);
    
    return {
      parameters: sensitivityResults.sort((a, b) => b.sensitivity - a.sensitivity),
      tornadoChart,
      criticalFactors
    };
  }

  private adjustParameterValue(inputs: CostBenefitInputs, parameterName: string, newValue: number): CostBenefitInputs {
    const adjustedInputs = { ...inputs };
    
    switch (parameterName) {
      case 'initialInvestment':
        adjustedInputs.initialInvestment = newValue;
        break;
      case 'materialSavings':
        adjustedInputs.projectedSavings = { ...inputs.projectedSavings, materialSavings: newValue };
        break;
      case 'additionalRevenue':
        adjustedInputs.revenueImpact = { ...inputs.revenueImpact, additionalRevenue: newValue };
        break;
      case 'discountRate':
        adjustedInputs.discountRate = newValue;
        break;
      case 'projectLifespan':
        adjustedInputs.projectLifespan = Math.round(newValue);
        break;
    }
    
    return adjustedInputs;
  }

  private classifyImpact(sensitivity: number): 'low' | 'medium' | 'high' | 'critical' {
    if (sensitivity > 2.0) return 'critical';
    if (sensitivity > 1.0) return 'high';
    if (sensitivity > 0.5) return 'medium';
    return 'low';
  }

  private assessRisks(inputs: CostBenefitInputs, financialMetrics: any) {
    // Calculate overall risk score
    const riskFactors = Object.values(inputs.riskFactors);
    const overallRiskScore = (riskFactors.reduce((sum, risk) => sum + risk, 0) / riskFactors.length) * 100;
    
    // Analyze risk categories
    const riskCategories = [
      {
        category: 'Technology Risk',
        score: inputs.riskFactors.technologyRisk * 100,
        impact: this.classifyRiskImpact(inputs.riskFactors.technologyRisk),
        mitigation: ['Pilot testing', 'Vendor support agreements', 'Training programs']
      },
      {
        category: 'Market Risk',
        score: inputs.riskFactors.marketRisk * 100,
        impact: this.classifyRiskImpact(inputs.riskFactors.marketRisk),
        mitigation: ['Market research', 'Flexible capacity', 'Diversification']
      },
      {
        category: 'Operational Risk',
        score: inputs.riskFactors.operationalRisk * 100,
        impact: this.classifyRiskImpact(inputs.riskFactors.operationalRisk),
        mitigation: ['Process documentation', 'Staff training', 'Backup systems']
      },
      {
        category: 'Competitive Risk',
        score: inputs.riskFactors.competitiveRisk * 100,
        impact: this.classifyRiskImpact(inputs.riskFactors.competitiveRisk),
        mitigation: ['Competitive analysis', 'Innovation pipeline', 'Customer loyalty programs']
      }
    ];
    
    // Calculate probability of success
    const probabilityOfSuccess = 1 - (overallRiskScore / 100) * 0.6; // Risk reduces success probability
    
    // Calculate Value at Risk (VaR) - simplified
    const valueAtRisk = Math.abs(financialMetrics.npv * (overallRiskScore / 100) * 1.65); // 95% confidence
    
    // Calculate Expected Shortfall
    const expectedShortfall = valueAtRisk * 1.3; // Conditional VaR
    
    return {
      overallRiskScore: Math.round(overallRiskScore),
      riskCategories,
      probabilityOfSuccess: Math.round(probabilityOfSuccess * 1000) / 1000,
      valueAtRisk: Math.round(valueAtRisk),
      expectedShortfall: Math.round(expectedShortfall)
    };
  }

  private classifyRiskImpact(riskScore: number): 'low' | 'medium' | 'high' | 'critical' {
    if (riskScore > 0.8) return 'critical';
    if (riskScore > 0.6) return 'high';
    if (riskScore > 0.4) return 'medium';
    return 'low';
  }

  private calculateOverallRisk(inputs: CostBenefitInputs): number {
    const riskFactors = Object.values(inputs.riskFactors);
    return riskFactors.reduce((sum, risk) => sum + risk, 0) / riskFactors.length;
  }

  private compareBenchmarks(inputs: CostBenefitInputs, financialMetrics: any) {
    const benchmark = industryBenchmarks[inputs.projectType];
    
    // Compare ROI
    let performanceRanking: 'excellent' | 'above_average' | 'average' | 'below_average' | 'poor';
    if (financialMetrics.roi > benchmark.averageROI * 1.3) performanceRanking = 'excellent';
    else if (financialMetrics.roi > benchmark.averageROI * 1.1) performanceRanking = 'above_average';
    else if (financialMetrics.roi > benchmark.averageROI * 0.9) performanceRanking = 'average';
    else if (financialMetrics.roi > benchmark.averageROI * 0.7) performanceRanking = 'below_average';
    else performanceRanking = 'poor';
    
    // Identify competitive advantages
    const competitiveAdvantage = [];
    if (financialMetrics.roi > benchmark.averageROI) {
      competitiveAdvantage.push('Above-average return on investment');
    }
    if (financialMetrics.paybackPeriod < benchmark.averagePayback) {
      competitiveAdvantage.push('Faster payback than industry average');
    }
    if (financialMetrics.npv > 0) {
      competitiveAdvantage.push('Positive net present value');
    }
    
    // Identify improvement areas
    const improvementAreas = [];
    if (financialMetrics.roi < benchmark.averageROI) {
      improvementAreas.push('ROI below industry average');
    }
    if (financialMetrics.paybackPeriod > benchmark.averagePayback) {
      improvementAreas.push('Payback period longer than typical');
    }
    
    return {
      industryAverageROI: benchmark.averageROI,
      industryAveragePayback: benchmark.averagePayback,
      performanceRanking,
      competitiveAdvantage,
      improvementAreas
    };
  }

  private generateRecommendations(inputs: CostBenefitInputs, financialMetrics: any, riskAssessment: any, benchmarkComparison: any) {
    // Determine investment decision
    let investmentDecision: 'strongly_recommend' | 'recommend' | 'conditional' | 'not_recommend' | 'strongly_against';
    
    if (financialMetrics.npv > 0 && financialMetrics.irr > inputs.discountRate * 100 && riskAssessment.overallRiskScore < 40) {
      investmentDecision = 'strongly_recommend';
    } else if (financialMetrics.npv > 0 && financialMetrics.irr > inputs.discountRate * 100) {
      investmentDecision = 'recommend';
    } else if (financialMetrics.npv > 0 || (financialMetrics.irr > inputs.discountRate * 100 && riskAssessment.overallRiskScore < 60)) {
      investmentDecision = 'conditional';
    } else if (financialMetrics.npv < 0 && financialMetrics.irr < inputs.discountRate * 100) {
      investmentDecision = 'not_recommend';
    } else {
      investmentDecision = 'strongly_against';
    }
    
    // Generate reasoning
    const reasoning = [];
    if (financialMetrics.npv > 0) {
      reasoning.push(`Positive NPV of $${financialMetrics.npv.toLocaleString()} indicates value creation`);
    }
    if (financialMetrics.irr > inputs.discountRate * 100) {
      reasoning.push(`IRR of ${financialMetrics.irr}% exceeds required return of ${inputs.discountRate * 100}%`);
    }
    if (financialMetrics.paybackPeriod < inputs.projectLifespan / 2) {
      reasoning.push(`Payback period of ${financialMetrics.paybackPeriod} years is reasonable`);
    }
    
    // Key success factors
    const keySuccessFactors = [
      'Accurate cost and benefit projections',
      'Effective project management and implementation',
      'Market conditions remain favorable',
      'Technology performs as expected'
    ];
    
    // Implementation priorities
    const implementationPriorities = [
      { priority: 'Detailed project planning', timeline: '1-2 months', impact: 'high' as const, effort: 'medium' as const },
      { priority: 'Risk mitigation strategies', timeline: 'Ongoing', impact: 'high' as const, effort: 'medium' as const },
      { priority: 'Performance monitoring system', timeline: '3-6 months', impact: 'medium' as const, effort: 'low' as const }
    ];
    
    // Alternative options
    const alternativeOptions = [
      {
        option: 'Phased Implementation',
        description: 'Implement project in phases to reduce risk',
        estimatedNPV: financialMetrics.npv * 0.8,
        pros: ['Lower initial investment', 'Reduced risk', 'Learning opportunities'],
        cons: ['Delayed benefits', 'Higher complexity', 'Potential cost increases']
      },
      {
        option: 'Lease vs Buy',
        description: 'Consider leasing equipment instead of purchasing',
        estimatedNPV: financialMetrics.npv * 0.7,
        pros: ['Lower upfront cost', 'Flexibility', 'Maintenance included'],
        cons: ['Higher long-term cost', 'No ownership', 'Contract constraints']
      }
    ];
    
    return {
      investmentDecision,
      reasoning,
      keySuccessFactors,
      implementationPriorities,
      alternativeOptions
    };
  }

  private generateWarnings(inputs: CostBenefitInputs, financialMetrics: any, riskAssessment: any): string[] {
    const warnings: string[] = [];
    
    if (financialMetrics.npv < 0) {
      warnings.push('Negative NPV indicates the project may destroy value');
    }
    
    if (financialMetrics.irr < inputs.discountRate * 100) {
      warnings.push('IRR below required rate of return - project may not meet financial objectives');
    }
    
    if (financialMetrics.paybackPeriod > inputs.projectLifespan * 0.8) {
      warnings.push('Long payback period increases risk of not recovering investment');
    }
    
    if (riskAssessment.overallRiskScore > 70) {
      warnings.push('High overall risk score - consider additional risk mitigation measures');
    }
    
    if (financialMetrics.profitabilityIndex < 1.1) {
      warnings.push('Low profitability index suggests marginal project attractiveness');
    }
    
    const totalSavings = Object.values(inputs.projectedSavings).reduce((sum, saving) => sum + saving, 0);
    const totalCosts = Object.values(inputs.currentOperatingCosts).reduce((sum, cost) => sum + cost, 0);
    
    if (totalSavings > totalCosts * 0.5) {
      warnings.push('Projected savings are very high - verify assumptions carefully');
    }
    
    return warnings;
  }

  getExampleInputs(): CostBenefitInputs {
    return {
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
      confidenceLevel: 0.95,
      inflationRate: 0.03,
      taxRate: 0.25
    };
  }
}
