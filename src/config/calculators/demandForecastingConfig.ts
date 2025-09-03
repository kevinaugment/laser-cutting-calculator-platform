import { CalculatorConfig } from '../../types/calculator';

export const demandForecastingConfig: CalculatorConfig = {
  id: 'demand-forecasting',
  name: 'Demand Forecasting Calculator',
  description: 'Forecast future demand patterns to optimize capacity planning and resource allocation for laser cutting operations.',
  category: 'capacity-planning',
  difficulty: 'advanced',
  estimatedTime: '5-6 minutes',
  
  inputs: [
    {
      id: 'historicalDemand',
      label: 'Historical Monthly Demand',
      type: 'number',
      value: 150,
      unit: 'hours',
      min: 50,
      max: 2000,
      step: 10,
      required: true,
      description: 'Average monthly machine hours demanded',
    },
    {
      id: 'demandTrend',
      label: 'Demand Growth Trend',
      type: 'number',
      value: 8,
      unit: '%/year',
      min: -20,
      max: 50,
      step: 1,
      required: true,
      description: 'Annual growth rate in demand',
    },
    {
      id: 'seasonalVariation',
      label: 'Seasonal Variation',
      type: 'select',
      value: 'moderate',
      options: [
        { value: 'none', label: 'No Seasonality' },
        { value: 'low', label: 'Low (±15%)' },
        { value: 'moderate', label: 'Moderate (±25%)' },
        { value: 'high', label: 'High (±40%)' },
      ],
      required: true,
      description: 'Seasonal demand variation pattern',
    },
    {
      id: 'industryGrowth',
      label: 'Industry Growth Rate',
      type: 'number',
      value: 12,
      unit: '%/year',
      min: -10,
      max: 30,
      step: 1,
      required: true,
      description: 'Overall industry growth rate',
    },
    {
      id: 'marketShare',
      label: 'Current Market Share',
      type: 'number',
      value: 15,
      unit: '%',
      min: 1,
      max: 50,
      step: 1,
      required: true,
      description: 'Your current market share',
    },
    {
      id: 'customerConcentration',
      label: 'Customer Concentration',
      type: 'select',
      value: 'balanced',
      options: [
        { value: 'concentrated', label: 'Concentrated (Top 3 = 70%+)' },
        { value: 'balanced', label: 'Balanced (Top 3 = 40-70%)' },
        { value: 'diversified', label: 'Diversified (Top 3 < 40%)' },
      ],
      required: true,
      description: 'Customer base concentration level',
    },
    {
      id: 'economicIndicator',
      label: 'Economic Outlook',
      type: 'select',
      value: 'stable',
      options: [
        { value: 'recession', label: 'Recession Expected' },
        { value: 'slowdown', label: 'Economic Slowdown' },
        { value: 'stable', label: 'Stable Economy' },
        { value: 'growth', label: 'Economic Growth' },
      ],
      required: true,
      description: 'Expected economic conditions',
    },
    {
      id: 'newCustomerRate',
      label: 'New Customer Acquisition Rate',
      type: 'number',
      value: 3,
      unit: 'customers/month',
      min: 0,
      max: 20,
      step: 1,
      required: true,
      description: 'Rate of new customer acquisition',
    },
  ],

  outputs: [
    {
      id: 'demandForecast',
      label: 'Demand Forecast',
      type: 'object',
      format: 'demand-projection',
      description: 'Comprehensive demand forecast analysis',
    },
    {
      id: 'monthlyProjections',
      label: 'Monthly Projections',
      type: 'array',
      format: 'monthly-demand',
      description: 'Month-by-month demand projections',
    },
    {
      id: 'capacityRequirements',
      label: 'Capacity Requirements',
      type: 'object',
      format: 'capacity-needs',
      description: 'Required capacity to meet projected demand',
    },
    {
      id: 'riskAnalysis',
      label: 'Risk Analysis',
      type: 'object',
      format: 'demand-risks',
      description: 'Analysis of demand forecast risks and uncertainties',
    },
  ],

  calculate: (inputs: Record<string, any>) => {
    const {
      historicalDemand,
      demandTrend,
      seasonalVariation,
      industryGrowth,
      marketShare,
      customerConcentration,
      economicIndicator,
      newCustomerRate,
    } = inputs;

    // Generate demand forecast
    const demandForecast = generateDemandForecast(
      historicalDemand,
      demandTrend,
      industryGrowth,
      marketShare,
      economicIndicator,
      newCustomerRate
    );

    // Create monthly projections
    const monthlyProjections = generateMonthlyProjections(
      demandForecast.projectedAnnualDemand,
      seasonalVariation,
      demandTrend
    );

    // Calculate capacity requirements
    const capacityRequirements = calculateCapacityRequirements(
      demandForecast,
      monthlyProjections
    );

    // Analyze risks
    const riskAnalysis = analyzeDemandRisks(
      inputs,
      demandForecast
    );

    return {
      demandForecast,
      monthlyProjections,
      capacityRequirements,
      riskAnalysis,
    };
  },

  validation: {
    historicalDemand: {
      min: 50,
      max: 2000,
      message: 'Historical demand must be between 50 and 2000 hours',
    },
    marketShare: {
      min: 1,
      max: 50,
      message: 'Market share must be between 1% and 50%',
    },
  },

  examples: [
    {
      name: 'Growing Manufacturing Market',
      description: 'High-growth manufacturing market with seasonal patterns',
      inputs: {
        historicalDemand: 200,
        demandTrend: 15,
        seasonalVariation: 'moderate',
        industryGrowth: 18,
        marketShare: 12,
        customerConcentration: 'balanced',
        economicIndicator: 'growth',
        newCustomerRate: 5,
      },
    },
    {
      name: 'Stable Aerospace Market',
      description: 'Stable aerospace market with concentrated customers',
      inputs: {
        historicalDemand: 120,
        demandTrend: 6,
        seasonalVariation: 'low',
        industryGrowth: 8,
        marketShare: 25,
        customerConcentration: 'concentrated',
        economicIndicator: 'stable',
        newCustomerRate: 2,
      },
    },
  ],

  tags: ['demand', 'forecasting', 'capacity', 'planning', 'growth'],
  
  relatedCalculators: [
    'resource-allocation',
    'expansion-planning',
    'bottleneck-analysis',
    'scalability-assessment',
  ],

  learningResources: [
    {
      title: 'Demand Forecasting Methods',
      type: 'article',
      url: '/learn/demand-forecasting',
    },
    {
      title: 'Capacity Planning Strategies',
      type: 'video',
      url: '/learn/capacity-planning',
    },
  ],
};

// Helper functions
function generateDemandForecast(
  historicalDemand: number,
  demandTrend: number,
  industryGrowth: number,
  marketShare: number,
  economicIndicator: string,
  newCustomerRate: number
) {
  // Adjust demand trend based on economic conditions
  const economicAdjustments = {
    recession: -0.4,
    slowdown: -0.2,
    stable: 0,
    growth: 0.2,
  };
  
  const economicAdjustment = economicAdjustments[economicIndicator] || 0;
  const adjustedDemandTrend = demandTrend * (1 + economicAdjustment);
  
  // Calculate market-driven growth
  const marketGrowthImpact = (industryGrowth * marketShare) / 100;
  
  // Calculate new customer impact
  const newCustomerImpact = newCustomerRate * 12 * 8; // Assume 8 hours per new customer per month
  
  // Project annual demand
  const baseGrowth = historicalDemand * 12 * (adjustedDemandTrend / 100);
  const marketGrowth = historicalDemand * 12 * (marketGrowthImpact / 100);
  const projectedAnnualDemand = (historicalDemand * 12) + baseGrowth + marketGrowth + newCustomerImpact;
  
  return {
    historicalMonthlyDemand: historicalDemand,
    historicalAnnualDemand: historicalDemand * 12,
    projectedAnnualDemand: Math.round(projectedAnnualDemand),
    projectedMonthlyAverage: Math.round(projectedAnnualDemand / 12),
    demandGrowth: Math.round(projectedAnnualDemand - (historicalDemand * 12)),
    growthPercentage: Math.round(((projectedAnnualDemand / (historicalDemand * 12)) - 1) * 100 * 10) / 10,
    adjustedTrend: Math.round(adjustedDemandTrend * 10) / 10,
    marketImpact: Math.round(marketGrowth),
    newCustomerImpact: Math.round(newCustomerImpact),
    confidence: calculateForecastConfidence(economicIndicator, demandTrend),
  };
}

function calculateForecastConfidence(economicIndicator: string, demandTrend: number) {
  let confidence = 70; // Base confidence
  
  // Economic stability impact
  if (economicIndicator === 'stable') confidence += 15;
  else if (economicIndicator === 'growth') confidence += 10;
  else if (economicIndicator === 'recession') confidence -= 20;
  else confidence -= 10;
  
  // Trend stability impact
  if (Math.abs(demandTrend) < 5) confidence += 10;
  else if (Math.abs(demandTrend) > 20) confidence -= 15;
  
  return Math.max(40, Math.min(90, confidence));
}

function generateMonthlyProjections(
  annualDemand: number,
  seasonalVariation: string,
  demandTrend: number
) {
  const monthlyBase = annualDemand / 12;
  const seasonalFactors = getSeasonalFactors(seasonalVariation);
  const monthlyGrowth = (demandTrend / 100) / 12; // Monthly growth rate
  
  const projections = [];
  const currentDate = new Date();
  
  for (let month = 0; month < 12; month++) {
    const projectionDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + month + 1, 1);
    const seasonalFactor = seasonalFactors[month % 12];
    const growthFactor = 1 + (monthlyGrowth * month);
    
    const monthlyDemand = monthlyBase * seasonalFactor * growthFactor;
    
    projections.push({
      month: projectionDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      monthNumber: month + 1,
      demandHours: Math.round(monthlyDemand),
      seasonalFactor: Math.round(seasonalFactor * 100) / 100,
      growthFactor: Math.round(growthFactor * 100) / 100,
      cumulativeDemand: projections.reduce((sum, p) => sum + p.demandHours, 0) + Math.round(monthlyDemand),
      variance: calculateVariance(monthlyDemand, monthlyBase),
    });
  }
  
  return projections;
}

function getSeasonalFactors(variation: string) {
  const patterns = {
    none: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    low: [0.9, 0.95, 1.1, 1.15, 1.05, 1.0, 0.95, 0.9, 1.05, 1.1, 1.0, 0.95],
    moderate: [0.8, 0.85, 1.2, 1.25, 1.15, 1.05, 0.9, 0.8, 1.1, 1.2, 1.05, 0.95],
    high: [0.6, 0.7, 1.4, 1.5, 1.3, 1.2, 0.8, 0.7, 1.2, 1.4, 1.1, 1.0],
  };
  
  return patterns[variation] || patterns.none;
}

function calculateVariance(actual: number, base: number) {
  const variance = ((actual - base) / base) * 100;
  return Math.round(variance * 10) / 10;
}

function calculateCapacityRequirements(demandForecast: any, monthlyProjections: any[]) {
  const peakDemand = Math.max(...monthlyProjections.map(p => p.demandHours));
  const averageDemand = demandForecast.projectedMonthlyAverage;
  
  // Assume 160 working hours per month per machine
  const hoursPerMachinePerMonth = 160;
  
  const requiredMachinesAverage = Math.ceil(averageDemand / hoursPerMachinePerMonth);
  const requiredMachinesPeak = Math.ceil(peakDemand / hoursPerMachinePerMonth);
  
  // Calculate utilization rates
  const averageUtilization = (averageDemand / (requiredMachinesPeak * hoursPerMachinePerMonth)) * 100;
  const peakUtilization = (peakDemand / (requiredMachinesPeak * hoursPerMachinePerMonth)) * 100;
  
  return {
    peakMonthlyDemand: peakDemand,
    averageMonthlyDemand: averageDemand,
    requiredMachinesForAverage: requiredMachinesAverage,
    requiredMachinesForPeak: requiredMachinesPeak,
    recommendedCapacity: requiredMachinesPeak + 1, // Add buffer
    averageUtilization: Math.round(averageUtilization),
    peakUtilization: Math.round(peakUtilization),
    capacityBuffer: Math.round(((requiredMachinesPeak + 1) * hoursPerMachinePerMonth - peakDemand) / peakDemand * 100),
    investmentTiming: determineInvestmentTiming(requiredMachinesPeak, averageUtilization),
    scalingStrategy: generateScalingStrategy(demandForecast.growthPercentage, requiredMachinesPeak),
  };
}

function determineInvestmentTiming(requiredMachines: number, utilization: number) {
  if (utilization > 90) return 'Immediate - Capacity constraint';
  if (utilization > 80) return 'Within 3 months - High utilization';
  if (utilization > 70) return 'Within 6 months - Moderate utilization';
  return 'Within 12 months - Plan ahead';
}

function generateScalingStrategy(growthRate: number, currentRequirement: number) {
  if (growthRate > 20) {
    return {
      approach: 'Aggressive Scaling',
      recommendation: 'Add capacity ahead of demand',
      timeline: 'Quarterly capacity reviews',
      riskLevel: 'Medium',
    };
  } else if (growthRate > 10) {
    return {
      approach: 'Moderate Scaling',
      recommendation: 'Scale capacity with demand',
      timeline: 'Semi-annual capacity reviews',
      riskLevel: 'Low',
    };
  } else {
    return {
      approach: 'Conservative Scaling',
      recommendation: 'Scale capacity after demand confirmation',
      timeline: 'Annual capacity reviews',
      riskLevel: 'Very Low',
    };
  }
}

function analyzeDemandRisks(inputs: any, demandForecast: any) {
  const risks = [];
  
  // Customer concentration risk
  if (inputs.customerConcentration === 'concentrated') {
    risks.push({
      risk: 'Customer Concentration',
      severity: 'High',
      probability: 'Medium',
      impact: 'Loss of major customer could reduce demand by 30-50%',
      mitigation: 'Diversify customer base and develop new market segments',
    });
  }
  
  // Economic sensitivity risk
  if (inputs.economicIndicator === 'recession' || inputs.economicIndicator === 'slowdown') {
    risks.push({
      risk: 'Economic Downturn',
      severity: 'High',
      probability: 'High',
      impact: 'Demand could decrease by 20-40%',
      mitigation: 'Focus on recession-resistant industries and maintain flexibility',
    });
  }
  
  // High growth risk
  if (demandForecast.growthPercentage > 25) {
    risks.push({
      risk: 'Unsustainable Growth',
      severity: 'Medium',
      probability: 'Medium',
      impact: 'Growth may not be sustainable long-term',
      mitigation: 'Plan for growth moderation and build scalable processes',
    });
  }
  
  // Seasonal risk
  if (inputs.seasonalVariation === 'high') {
    risks.push({
      risk: 'High Seasonality',
      severity: 'Medium',
      probability: 'High',
      impact: 'Significant capacity underutilization in low seasons',
      mitigation: 'Develop counter-seasonal revenue streams',
    });
  }
  
  // Market share risk
  if (inputs.marketShare > 30) {
    risks.push({
      risk: 'Market Saturation',
      severity: 'Medium',
      probability: 'Medium',
      impact: 'Limited growth potential in current market',
      mitigation: 'Expand into new markets or develop new services',
    });
  }
  
  return {
    risks,
    overallRiskLevel: calculateOverallRisk(risks),
    confidenceLevel: demandForecast.confidence,
    contingencyPlanning: generateContingencyPlans(risks, demandForecast),
  };
}

function calculateOverallRisk(risks: any[]) {
  const highRisks = risks.filter(r => r.severity === 'High').length;
  const mediumRisks = risks.filter(r => r.severity === 'Medium').length;
  
  if (highRisks >= 2) return 'High';
  if (highRisks >= 1 || mediumRisks >= 3) return 'Medium';
  if (mediumRisks >= 1) return 'Low';
  return 'Very Low';
}

function generateContingencyPlans(risks: any[], demandForecast: any) {
  const plans = [];
  
  // Demand drop scenario
  plans.push({
    scenario: 'Demand Drop (20% below forecast)',
    triggers: ['Economic downturn', 'Major customer loss'],
    actions: [
      'Reduce variable costs',
      'Delay capacity investments',
      'Focus on customer retention',
    ],
    timeframe: 'Immediate response',
  });
  
  // Demand surge scenario
  plans.push({
    scenario: 'Demand Surge (30% above forecast)',
    triggers: ['Economic boom', 'New major contracts'],
    actions: [
      'Increase overtime capacity',
      'Accelerate equipment purchases',
      'Hire temporary staff',
    ],
    timeframe: '1-3 months',
  });
  
  // Market disruption scenario
  plans.push({
    scenario: 'Market Disruption',
    triggers: ['New technology', 'Regulatory changes'],
    actions: [
      'Assess technology impact',
      'Develop adaptation strategy',
      'Diversify service offerings',
    ],
    timeframe: '3-6 months',
  });
  
  return plans;
}

export default demandForecastingConfig;
