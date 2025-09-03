import { CalculatorInputs, CalculatorResults } from '../../types/calculator';

export interface ProfitMarginCalculatorInputs extends CalculatorInputs {
  revenueStructure: {
    totalRevenue: number; // $ annual
    revenueBySegment: { segment: string; revenue: number; growth: number }[];
    recurringRevenue: number; // $ annual
    projectBasedRevenue: number; // $ annual
    seasonalityFactor: number; // variance percentage
    averageProjectSize: number; // $
    customerConcentration: number; // percentage from top 5 customers
  };
  costStructure: {
    directCosts: {
      materialCosts: number; // $ annual
      directLabor: number; // $ annual
      machineOperating: number; // $ annual
      subcontracting: number; // $ annual
      qualityControl: number; // $ annual
      shipping: number; // $ annual
    };
    indirectCosts: {
      facilityOverhead: number; // $ annual
      administrativeExpenses: number; // $ annual
      salesAndMarketing: number; // $ annual
      engineering: number; // $ annual
      maintenance: number; // $ annual
      insurance: number; // $ annual
    };
    variableCosts: {
      materialWaste: number; // percentage of material costs
      energyConsumption: number; // $ per hour
      consumables: number; // $ annual
      outsourcedServices: number; // $ annual
    };
    fixedCosts: {
      equipmentDepreciation: number; // $ annual
      facilityLease: number; // $ annual
      baseStaffing: number; // $ annual
      softwareLicenses: number; // $ annual
      certifications: number; // $ annual
    };
  };
  operationalMetrics: {
    capacityUtilization: number; // percentage
    laborEfficiency: number; // percentage
    materialUtilization: number; // percentage
    qualityYield: number; // percentage good parts
    averageLeadTime: number; // days
    onTimeDelivery: number; // percentage
    customerSatisfaction: number; // 1-10 scale
  };
  marketFactors: {
    competitivePressure: 'low' | 'moderate' | 'high' | 'intense';
    priceElasticity: number; // demand response to price changes
    marketGrowthRate: number; // percentage annual
    customerPaymentTerms: number; // days
    badDebtRate: number; // percentage
    currencyExposure: number; // percentage of revenue
  };
  strategicObjectives: {
    targetGrossMargin: number; // percentage
    targetNetMargin: number; // percentage
    growthTarget: number; // percentage annual revenue growth
    marketShareGoal: number; // percentage
    profitabilityTimeframe: 'short_term' | 'medium_term' | 'long_term';
    investmentPriority: 'growth' | 'profitability' | 'market_share' | 'efficiency';
  };
  riskFactors: {
    demandVolatility: 'low' | 'medium' | 'high' | 'very_high';
    supplyCostVolatility: 'low' | 'medium' | 'high' | 'very_high';
    competitiveRisk: 'low' | 'medium' | 'high' | 'critical';
    technologyRisk: 'low' | 'medium' | 'high' | 'disruptive';
    regulatoryRisk: 'low' | 'medium' | 'high' | 'significant';
    economicSensitivity: 'low' | 'medium' | 'high' | 'very_high';
  };
}

export interface ProfitMarginCalculatorResults extends CalculatorResults {
  marginAnalysis: {
    grossMargin: { amount: number; percentage: number };
    operatingMargin: { amount: number; percentage: number };
    netMargin: { amount: number; percentage: number };
    contributionMargin: { amount: number; percentage: number };
    ebitdaMargin: { amount: number; percentage: number };
    marginTrends: { period: string; grossMargin: number; netMargin: number }[];
  };
  costAnalysis: {
    totalCosts: number; // $
    costBreakdown: {
      directCosts: number; // $
      indirectCosts: number; // $
      variableCosts: number; // $
      fixedCosts: number; // $
    };
    costPerRevenueDollar: number; // $ cost per $ revenue
    costStructureRatio: { fixed: number; variable: number }; // percentages
    costDriverAnalysis: { driver: string; impact: number; controllability: string }[];
  };
  profitabilityDrivers: {
    volumeImpact: { volumeChange: number; marginImpact: number; revenueImpact: number }[];
    priceImpact: { priceChange: number; marginImpact: number; demandImpact: number }[];
    costImpact: { costCategory: string; reduction: number; marginImprovement: number }[];
    efficiencyImpact: { metric: string; improvement: number; marginBenefit: number }[];
  };
  benchmarkComparison: {
    industryAverageMargins: { gross: number; operating: number; net: number };
    competitivePosition: 'below_average' | 'average' | 'above_average' | 'top_quartile';
    marginGap: { gross: number; operating: number; net: number };
    performanceRating: number; // 1-10 scale
  };
  scenarioAnalysis: {
    optimisticScenario: { revenue: number; costs: number; netMargin: number; probability: number };
    mostLikelyScenario: { revenue: number; costs: number; netMargin: number; probability: number };
    pessimisticScenario: { revenue: number; costs: number; netMargin: number; probability: number };
    breakEvenAnalysis: { breakEvenRevenue: number; marginOfSafety: number; operatingLeverage: number };
  };
  improvementOpportunities: {
    revenueEnhancement: { opportunity: string; impact: number; timeframe: string; investment: number }[];
    costReduction: { opportunity: string; savings: number; timeframe: string; risk: string }[];
    efficiencyGains: { improvement: string; marginBenefit: number; implementation: string }[];
    pricingOptimization: { strategy: string; marginImpact: number; marketRisk: string }[];
  };
  riskAssessment: {
    marginRisk: 'low' | 'medium' | 'high' | 'critical';
    riskFactors: { factor: string; impact: string; probability: number; mitigation: string }[];
    sensitivityAnalysis: { variable: string; sensitivity: number; riskLevel: string }[];
    contingencyPlanning: { scenario: string; response: string; marginImpact: number }[];
  };
  strategicRecommendations: {
    marginOptimization: string[];
    costManagement: string[];
    revenueGrowth: string[];
    operationalExcellence: string[];
    riskMitigation: string[];
  };
  alertsAndRecommendations: {
    marginAlerts: string[];
    profitabilityWarnings: string[];
    costOptimizationAlerts: string[];
    strategicInsights: string[];
    actionItems: string[];
  };
}

export class ProfitMarginCalculator {
  private industryBenchmarks = {
    grossMargin: 35, // 35% industry average
    operatingMargin: 12, // 12% industry average
    netMargin: 8 // 8% industry average
  };

  private riskMultipliers = {
    'low': 1.0,
    'medium': 1.1,
    'high': 1.25,
    'very_high': 1.4,
    'critical': 1.6,
    'disruptive': 1.8,
    'significant': 1.3
  };

  calculate(inputs: ProfitMarginCalculatorInputs): ProfitMarginCalculatorResults {
    // Input validation
    this.validateInputs(inputs);

    // Calculate margin analysis
    const marginAnalysis = this.calculateMarginAnalysis(inputs);

    // Analyze cost structure
    const costAnalysis = this.analyzeCostStructure(inputs);

    // Identify profitability drivers
    const profitabilityDrivers = this.identifyProfitabilityDrivers(inputs, marginAnalysis);

    // Benchmark comparison
    const benchmarkComparison = this.performBenchmarkComparison(inputs, marginAnalysis);

    // Scenario analysis
    const scenarioAnalysis = this.performScenarioAnalysis(inputs, marginAnalysis);

    // Identify improvement opportunities
    const improvementOpportunities = this.identifyImprovementOpportunities(inputs, costAnalysis);

    // Risk assessment
    const riskAssessment = this.assessRisks(inputs, marginAnalysis);

    // Strategic recommendations
    const strategicRecommendations = this.generateStrategicRecommendations(inputs, improvementOpportunities);

    // Alerts and recommendations
    const alertsAndRecommendations = this.generateAlertsAndRecommendations(inputs, marginAnalysis, riskAssessment);

    // Generate general recommendations
    const recommendations = this.generateRecommendations(inputs, strategicRecommendations, benchmarkComparison);

    return {
      marginAnalysis,
      costAnalysis,
      profitabilityDrivers,
      benchmarkComparison,
      scenarioAnalysis,
      improvementOpportunities,
      riskAssessment,
      strategicRecommendations,
      alertsAndRecommendations,
      recommendations,
      keyMetrics: {
        'Gross Margin': `${marginAnalysis.grossMargin.percentage.toFixed(1)}%`,
        'Net Margin': `${marginAnalysis.netMargin.percentage.toFixed(1)}%`,
        'Performance Rating': `${benchmarkComparison.performanceRating}/10`,
        'Risk Level': riskAssessment.marginRisk
      },
      sensitivityAnalysis: this.performSensitivityAnalysis(inputs)
    };
  }

  private validateInputs(inputs: ProfitMarginCalculatorInputs): void {
    if (inputs.revenueStructure.totalRevenue <= 0) {
      throw new Error('Total revenue must be greater than 0');
    }
    if (inputs.strategicObjectives.targetGrossMargin < 0) {
      throw new Error('Target gross margin cannot be negative');
    }
    if (inputs.operationalMetrics.capacityUtilization < 0 || inputs.operationalMetrics.capacityUtilization > 100) {
      throw new Error('Capacity utilization must be between 0 and 100');
    }
  }

  private calculateMarginAnalysis(inputs: ProfitMarginCalculatorInputs): any {
    const revenue = inputs.revenueStructure.totalRevenue;
    
    // Calculate total costs
    const directCosts = Object.values(inputs.costStructure.directCosts).reduce((sum, cost) => sum + cost, 0);
    const indirectCosts = Object.values(inputs.costStructure.indirectCosts).reduce((sum, cost) => sum + cost, 0);
    const variableCosts = Object.values(inputs.costStructure.variableCosts).reduce((sum, cost) => sum + cost, 0);
    const fixedCosts = Object.values(inputs.costStructure.fixedCosts).reduce((sum, cost) => sum + cost, 0);
    
    const totalCosts = directCosts + indirectCosts + variableCosts + fixedCosts;
    const cogs = directCosts + variableCosts; // Cost of Goods Sold
    
    // Calculate margins
    const grossProfit = revenue - cogs;
    const grossMargin = {
      amount: grossProfit,
      percentage: (grossProfit / revenue) * 100
    };

    const operatingProfit = grossProfit - indirectCosts;
    const operatingMargin = {
      amount: operatingProfit,
      percentage: (operatingProfit / revenue) * 100
    };

    // Net margin (simplified - excluding taxes and interest)
    const netProfit = operatingProfit - fixedCosts;
    const netMargin = {
      amount: netProfit,
      percentage: (netProfit / revenue) * 100
    };

    // Contribution margin
    const contributionProfit = revenue - variableCosts;
    const contributionMargin = {
      amount: contributionProfit,
      percentage: (contributionProfit / revenue) * 100
    };

    // EBITDA margin (simplified)
    const ebitda = operatingProfit + inputs.costStructure.fixedCosts.equipmentDepreciation;
    const ebitdaMargin = {
      amount: ebitda,
      percentage: (ebitda / revenue) * 100
    };

    // Margin trends (simplified historical data)
    const marginTrends = [
      { period: 'Q1', grossMargin: grossMargin.percentage - 2, netMargin: netMargin.percentage - 1.5 },
      { period: 'Q2', grossMargin: grossMargin.percentage - 1, netMargin: netMargin.percentage - 0.5 },
      { period: 'Q3', grossMargin: grossMargin.percentage + 0.5, netMargin: netMargin.percentage + 0.3 },
      { period: 'Q4', grossMargin: grossMargin.percentage, netMargin: netMargin.percentage }
    ];

    return {
      grossMargin: {
        amount: Math.round(grossMargin.amount),
        percentage: Math.round(grossMargin.percentage * 10) / 10
      },
      operatingMargin: {
        amount: Math.round(operatingMargin.amount),
        percentage: Math.round(operatingMargin.percentage * 10) / 10
      },
      netMargin: {
        amount: Math.round(netMargin.amount),
        percentage: Math.round(netMargin.percentage * 10) / 10
      },
      contributionMargin: {
        amount: Math.round(contributionMargin.amount),
        percentage: Math.round(contributionMargin.percentage * 10) / 10
      },
      ebitdaMargin: {
        amount: Math.round(ebitdaMargin.amount),
        percentage: Math.round(ebitdaMargin.percentage * 10) / 10
      },
      marginTrends
    };
  }

  private analyzeCostStructure(inputs: ProfitMarginCalculatorInputs): any {
    const directCosts = Object.values(inputs.costStructure.directCosts).reduce((sum, cost) => sum + cost, 0);
    const indirectCosts = Object.values(inputs.costStructure.indirectCosts).reduce((sum, cost) => sum + cost, 0);
    const variableCosts = Object.values(inputs.costStructure.variableCosts).reduce((sum, cost) => sum + cost, 0);
    const fixedCosts = Object.values(inputs.costStructure.fixedCosts).reduce((sum, cost) => sum + cost, 0);
    
    const totalCosts = directCosts + indirectCosts + variableCosts + fixedCosts;
    const costPerRevenueDollar = totalCosts / inputs.revenueStructure.totalRevenue;
    
    const totalVariableCosts = directCosts + variableCosts;
    const totalFixedCosts = indirectCosts + fixedCosts;
    
    const costStructureRatio = {
      fixed: (totalFixedCosts / totalCosts) * 100,
      variable: (totalVariableCosts / totalCosts) * 100
    };

    const costDriverAnalysis = [
      { driver: 'Material costs', impact: (inputs.costStructure.directCosts.materialCosts / totalCosts) * 100, controllability: 'Medium' },
      { driver: 'Labor costs', impact: (inputs.costStructure.directCosts.directLabor / totalCosts) * 100, controllability: 'High' },
      { driver: 'Overhead costs', impact: (indirectCosts / totalCosts) * 100, controllability: 'High' },
      { driver: 'Fixed costs', impact: (fixedCosts / totalCosts) * 100, controllability: 'Medium' }
    ];

    return {
      totalCosts: Math.round(totalCosts),
      costBreakdown: {
        directCosts: Math.round(directCosts),
        indirectCosts: Math.round(indirectCosts),
        variableCosts: Math.round(variableCosts),
        fixedCosts: Math.round(fixedCosts)
      },
      costPerRevenueDollar: Math.round(costPerRevenueDollar * 1000) / 1000,
      costStructureRatio: {
        fixed: Math.round(costStructureRatio.fixed * 10) / 10,
        variable: Math.round(costStructureRatio.variable * 10) / 10
      },
      costDriverAnalysis
    };
  }

  private identifyProfitabilityDrivers(inputs: ProfitMarginCalculatorInputs, margins: any): any {
    const baseRevenue = inputs.revenueStructure.totalRevenue;
    const baseMargin = margins.netMargin.percentage;

    // Volume impact analysis
    const volumeImpact = [-20, -10, 10, 20].map(change => {
      const newRevenue = baseRevenue * (1 + change / 100);
      const marginImpact = change * 0.6; // 60% flow-through
      const revenueImpact = newRevenue - baseRevenue;
      
      return {
        volumeChange: change,
        marginImpact: Math.round(marginImpact * 10) / 10,
        revenueImpact: Math.round(revenueImpact)
      };
    });

    // Price impact analysis
    const priceImpact = [-10, -5, 5, 10].map(change => {
      const elasticity = inputs.marketFactors.priceElasticity;
      const demandImpact = change * elasticity;
      const marginImpact = change + (demandImpact * 0.4); // Combined effect
      
      return {
        priceChange: change,
        marginImpact: Math.round(marginImpact * 10) / 10,
        demandImpact: Math.round(demandImpact * 10) / 10
      };
    });

    // Cost impact analysis
    const costImpact = [
      { costCategory: 'Material costs', reduction: 10, marginImprovement: 6 },
      { costCategory: 'Labor efficiency', reduction: 15, marginImprovement: 8 },
      { costCategory: 'Overhead reduction', reduction: 20, marginImprovement: 5 },
      { costCategory: 'Fixed cost optimization', reduction: 12, marginImprovement: 4 }
    ];

    // Efficiency impact analysis
    const efficiencyImpact = [
      { metric: 'Capacity utilization', improvement: 10, marginBenefit: 4 },
      { metric: 'Material utilization', improvement: 5, marginBenefit: 2 },
      { metric: 'Quality yield', improvement: 3, marginBenefit: 1.5 },
      { metric: 'Labor efficiency', improvement: 8, marginBenefit: 3 }
    ];

    return {
      volumeImpact,
      priceImpact,
      costImpact,
      efficiencyImpact
    };
  }

  private performBenchmarkComparison(inputs: ProfitMarginCalculatorInputs, margins: any): any {
    const industryAverageMargins = this.industryBenchmarks;
    
    let competitivePosition: 'below_average' | 'average' | 'above_average' | 'top_quartile';
    const grossGap = margins.grossMargin.percentage - industryAverageMargins.grossMargin;
    const netGap = margins.netMargin.percentage - industryAverageMargins.netMargin;
    
    if (netGap > 5) competitivePosition = 'top_quartile';
    else if (netGap > 0) competitivePosition = 'above_average';
    else if (netGap > -3) competitivePosition = 'average';
    else competitivePosition = 'below_average';

    const marginGap = {
      gross: grossGap,
      operating: margins.operatingMargin.percentage - industryAverageMargins.operatingMargin,
      net: netGap
    };

    // Performance rating (1-10 scale)
    const performanceRating = Math.min(10, Math.max(1, 5 + netGap / 2));

    return {
      industryAverageMargins,
      competitivePosition,
      marginGap: {
        gross: Math.round(marginGap.gross * 10) / 10,
        operating: Math.round(marginGap.operating * 10) / 10,
        net: Math.round(marginGap.net * 10) / 10
      },
      performanceRating: Math.round(performanceRating * 10) / 10
    };
  }

  private performScenarioAnalysis(inputs: ProfitMarginCalculatorInputs, margins: any): any {
    const baseRevenue = inputs.revenueStructure.totalRevenue;
    const baseCosts = baseRevenue - margins.netMargin.amount;
    const baseNetMargin = margins.netMargin.percentage;

    const optimisticScenario = {
      revenue: Math.round(baseRevenue * 1.2),
      costs: Math.round(baseCosts * 1.1),
      netMargin: Math.round((baseNetMargin + 5) * 10) / 10,
      probability: 25
    };

    const mostLikelyScenario = {
      revenue: Math.round(baseRevenue * 1.05),
      costs: Math.round(baseCosts * 1.03),
      netMargin: Math.round((baseNetMargin + 1) * 10) / 10,
      probability: 50
    };

    const pessimisticScenario = {
      revenue: Math.round(baseRevenue * 0.9),
      costs: Math.round(baseCosts * 1.05),
      netMargin: Math.round((baseNetMargin - 4) * 10) / 10,
      probability: 25
    };

    // Break-even analysis
    const fixedCosts = Object.values(inputs.costStructure.fixedCosts).reduce((sum, cost) => sum + cost, 0) +
                      Object.values(inputs.costStructure.indirectCosts).reduce((sum, cost) => sum + cost, 0);
    const variableCostRatio = 0.6; // Simplified variable cost ratio
    const breakEvenRevenue = fixedCosts / (1 - variableCostRatio);
    const marginOfSafety = ((baseRevenue - breakEvenRevenue) / baseRevenue) * 100;
    const operatingLeverage = 1.5; // Simplified operating leverage

    const breakEvenAnalysis = {
      breakEvenRevenue: Math.round(breakEvenRevenue),
      marginOfSafety: Math.round(marginOfSafety * 10) / 10,
      operatingLeverage: Math.round(operatingLeverage * 10) / 10
    };

    return {
      optimisticScenario,
      mostLikelyScenario,
      pessimisticScenario,
      breakEvenAnalysis
    };
  }

  private identifyImprovementOpportunities(inputs: ProfitMarginCalculatorInputs, costs: any): any {
    const revenueEnhancement = [
      { opportunity: 'Premium service offerings', impact: 8, timeframe: '6 months', investment: 50000 },
      { opportunity: 'Market expansion', impact: 15, timeframe: '12 months', investment: 100000 },
      { opportunity: 'Customer retention programs', impact: 5, timeframe: '3 months', investment: 25000 },
      { opportunity: 'Value-added services', impact: 10, timeframe: '9 months', investment: 75000 }
    ];

    const costReduction = [
      { opportunity: 'Process automation', savings: 75000, timeframe: '12 months', risk: 'Medium' },
      { opportunity: 'Supplier consolidation', savings: 50000, timeframe: '6 months', risk: 'Low' },
      { opportunity: 'Energy efficiency', savings: 30000, timeframe: '9 months', risk: 'Low' },
      { opportunity: 'Overhead optimization', savings: 60000, timeframe: '6 months', risk: 'Medium' }
    ];

    const efficiencyGains = [
      { improvement: 'Lean manufacturing implementation', marginBenefit: 4, implementation: 'Process redesign and training' },
      { improvement: 'Quality improvement programs', marginBenefit: 2, implementation: 'Six Sigma methodology' },
      { improvement: 'Capacity optimization', marginBenefit: 3, implementation: 'Workflow analysis and scheduling' },
      { improvement: 'Technology upgrades', marginBenefit: 5, implementation: 'Equipment modernization' }
    ];

    const pricingOptimization = [
      { strategy: 'Value-based pricing', marginImpact: 6, marketRisk: 'Medium' },
      { strategy: 'Dynamic pricing', marginImpact: 4, marketRisk: 'High' },
      { strategy: 'Bundle pricing', marginImpact: 3, marketRisk: 'Low' },
      { strategy: 'Premium positioning', marginImpact: 8, marketRisk: 'High' }
    ];

    return {
      revenueEnhancement,
      costReduction,
      efficiencyGains,
      pricingOptimization
    };
  }

  private assessRisks(inputs: ProfitMarginCalculatorInputs, margins: any): any {
    // Calculate overall margin risk
    const riskFactors = [
      inputs.riskFactors.demandVolatility,
      inputs.riskFactors.supplyCostVolatility,
      inputs.riskFactors.competitiveRisk,
      inputs.riskFactors.economicSensitivity
    ];

    const riskScores = riskFactors.map(risk => {
      switch (risk) {
        case 'low': return 1;
        case 'medium': return 2;
        case 'high': return 3;
        case 'very_high': return 4;
        case 'critical': return 5;
        default: return 2;
      }
    });

    const averageRisk = riskScores.reduce((sum, score) => sum + score, 0) / riskScores.length;
    
    let marginRisk: 'low' | 'medium' | 'high' | 'critical';
    if (averageRisk <= 1.5) marginRisk = 'low';
    else if (averageRisk <= 2.5) marginRisk = 'medium';
    else if (averageRisk <= 3.5) marginRisk = 'high';
    else marginRisk = 'critical';

    const riskFactorDetails = [
      {
        factor: 'Demand volatility',
        impact: 'Revenue and margin fluctuations',
        probability: 60,
        mitigation: 'Diversify customer base and develop flexible capacity'
      },
      {
        factor: 'Cost inflation',
        impact: 'Margin compression',
        probability: 70,
        mitigation: 'Long-term supplier contracts and cost pass-through mechanisms'
      },
      {
        factor: 'Competitive pressure',
        impact: 'Price and margin pressure',
        probability: 50,
        mitigation: 'Differentiation strategy and value proposition enhancement'
      }
    ];

    const sensitivityAnalysis = [
      { variable: 'Revenue volume', sensitivity: 0.8, riskLevel: 'Medium' },
      { variable: 'Material costs', sensitivity: 0.6, riskLevel: 'High' },
      { variable: 'Labor costs', sensitivity: 0.4, riskLevel: 'Medium' },
      { variable: 'Pricing pressure', sensitivity: 0.9, riskLevel: 'High' }
    ];

    const contingencyPlanning = [
      { scenario: 'Economic downturn', response: 'Cost reduction and capacity adjustment', marginImpact: -5 },
      { scenario: 'Competitive price war', response: 'Value differentiation and selective pricing', marginImpact: -3 },
      { scenario: 'Supply disruption', response: 'Alternative suppliers and inventory buffers', marginImpact: -2 }
    ];

    return {
      marginRisk,
      riskFactors: riskFactorDetails,
      sensitivityAnalysis,
      contingencyPlanning
    };
  }

  private generateStrategicRecommendations(inputs: ProfitMarginCalculatorInputs, opportunities: any): any {
    const marginOptimization = [
      'Focus on high-margin products and services',
      'Implement value-based pricing strategies',
      'Optimize product mix for profitability',
      'Develop premium service offerings'
    ];

    const costManagement = [
      'Implement lean manufacturing principles',
      'Automate routine processes',
      'Optimize supplier relationships',
      'Reduce overhead through efficiency gains'
    ];

    const revenueGrowth = [
      'Expand into higher-margin market segments',
      'Develop strategic customer partnerships',
      'Invest in innovation and differentiation',
      'Implement customer retention programs'
    ];

    const operationalExcellence = [
      'Improve capacity utilization',
      'Enhance quality and reduce waste',
      'Optimize workflow and scheduling',
      'Invest in technology and automation'
    ];

    const riskMitigation = [
      'Diversify customer and supplier base',
      'Develop flexible cost structure',
      'Implement robust financial controls',
      'Create contingency plans for market changes'
    ];

    return {
      marginOptimization,
      costManagement,
      revenueGrowth,
      operationalExcellence,
      riskMitigation
    };
  }

  private generateAlertsAndRecommendations(inputs: ProfitMarginCalculatorInputs, margins: any, risks: any): any {
    const marginAlerts: string[] = [];
    const profitabilityWarnings: string[] = [];
    const costOptimizationAlerts: string[] = [];
    const strategicInsights: string[] = [];
    const actionItems: string[] = [];

    // Margin alerts
    if (margins.netMargin.percentage < inputs.strategicObjectives.targetNetMargin) {
      marginAlerts.push('Net margin below target - review pricing and cost structure');
    }

    if (margins.grossMargin.percentage < this.industryBenchmarks.grossMargin) {
      marginAlerts.push('Gross margin below industry average');
    }

    // Profitability warnings
    if (risks.marginRisk === 'high' || risks.marginRisk === 'critical') {
      profitabilityWarnings.push('High margin risk - implement risk mitigation strategies');
    }

    // Cost optimization alerts
    if (inputs.operationalMetrics.capacityUtilization < 75) {
      costOptimizationAlerts.push('Low capacity utilization - optimize resource allocation');
    }

    // Strategic insights
    strategicInsights.push('Focus on value-based pricing to improve margins');
    strategicInsights.push('Implement operational efficiency programs');

    // Action items
    actionItems.push('Conduct detailed cost analysis by product line');
    actionItems.push('Develop margin improvement action plan');

    return {
      marginAlerts,
      profitabilityWarnings,
      costOptimizationAlerts,
      strategicInsights,
      actionItems
    };
  }

  private generateRecommendations(inputs: ProfitMarginCalculatorInputs, strategic: any, benchmark: any): string[] {
    const recommendations: string[] = [];

    recommendations.push(`Current margin performance: ${benchmark.competitivePosition} vs industry`);
    recommendations.push(`Net margin: ${inputs.strategicObjectives.targetNetMargin}% target vs current performance`);

    if (benchmark.competitivePosition === 'below_average') {
      recommendations.push('Priority focus on margin improvement required');
    }

    recommendations.push('Implement comprehensive margin optimization strategy');
    recommendations.push('Regular margin analysis and performance monitoring recommended');

    return recommendations;
  }

  private performSensitivityAnalysis(inputs: ProfitMarginCalculatorInputs): any {
    const baseResult = this.calculate(inputs);
    const variations = [-20, -10, 10, 20];

    return {
      revenueChanges: variations.map(variation => {
        const modifiedInputs = {
          ...inputs,
          revenueStructure: {
            ...inputs.revenueStructure,
            totalRevenue: inputs.revenueStructure.totalRevenue * (1 + variation / 100)
          }
        };
        const result = this.calculate(modifiedInputs);
        return {
          variation: `${variation > 0 ? '+' : ''}${variation}%`,
          netMargin: result.marginAnalysis.netMargin.percentage,
          marginChange: result.marginAnalysis.netMargin.percentage - baseResult.marginAnalysis.netMargin.percentage,
          impact: 'Revenue changes have significant margin impact due to operating leverage'
        };
      }),
      costChanges: variations.map(variation => {
        const modifiedInputs = {
          ...inputs,
          costStructure: {
            ...inputs.costStructure,
            directCosts: Object.fromEntries(
              Object.entries(inputs.costStructure.directCosts).map(([key, value]) => 
                [key, value * (1 + variation / 100)]
              )
            )
          }
        };
        const result = this.calculate(modifiedInputs);
        return {
          variation: `${variation > 0 ? '+' : ''}${variation}%`,
          netMargin: result.marginAnalysis.netMargin.percentage,
          marginChange: result.marginAnalysis.netMargin.percentage - baseResult.marginAnalysis.netMargin.percentage,
          impact: 'Direct cost changes flow through to margins'
        };
      }),
      utilizationChanges: [
        {
          utilization: '60%',
          marginImpact: -4,
          recommendation: 'Focus on capacity optimization and demand generation'
        },
        {
          utilization: '90%',
          marginImpact: 6,
          recommendation: 'Excellent utilization - consider capacity expansion'
        }
      ]
    };
  }
}

export const profitMarginCalculator = new ProfitMarginCalculator();
