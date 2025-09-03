import { CalculatorConfig } from '../../types/calculator';

export const salesForecastingConfig: CalculatorConfig = {
  id: 'sales-forecasting',
  name: 'Sales Forecasting Calculator',
  description: 'Generate accurate sales forecasts using historical data and market trends to support business planning and growth strategies.',
  category: 'customer-acquisition',
  difficulty: 'advanced',
  estimatedTime: '5-6 minutes',
  
  inputs: [
    {
      id: 'historicalRevenue',
      label: 'Last 12 Months Revenue',
      type: 'number',
      value: 2400000,
      unit: 'USD',
      min: 100000,
      max: 50000000,
      step: 100000,
      required: true,
      description: 'Total revenue for the past 12 months',
    },
    {
      id: 'revenueGrowthTrend',
      label: 'Historical Growth Trend',
      type: 'number',
      value: 12,
      unit: '%/year',
      min: -20,
      max: 100,
      step: 1,
      required: true,
      description: 'Average annual revenue growth rate',
    },
    {
      id: 'seasonalityPattern',
      label: 'Seasonality Pattern',
      type: 'select',
      value: 'moderate',
      options: [
        { value: 'none', label: 'No Seasonality' },
        { value: 'low', label: 'Low Seasonality (±10%)' },
        { value: 'moderate', label: 'Moderate Seasonality (±20%)' },
        { value: 'high', label: 'High Seasonality (±35%)' },
      ],
      required: true,
      description: 'Seasonal variation in sales',
    },
    {
      id: 'marketConditions',
      label: 'Market Conditions',
      type: 'select',
      value: 'stable',
      options: [
        { value: 'declining', label: 'Declining Market' },
        { value: 'stable', label: 'Stable Market' },
        { value: 'growing', label: 'Growing Market' },
        { value: 'booming', label: 'Booming Market' },
      ],
      required: true,
      description: 'Current market conditions',
    },
    {
      id: 'pipelineValue',
      label: 'Current Sales Pipeline Value',
      type: 'number',
      value: 800000,
      unit: 'USD',
      min: 0,
      max: 10000000,
      step: 50000,
      required: true,
      description: 'Total value of current sales opportunities',
    },
    {
      id: 'conversionRate',
      label: 'Pipeline Conversion Rate',
      type: 'number',
      value: 25,
      unit: '%',
      min: 5,
      max: 80,
      step: 1,
      required: true,
      description: 'Percentage of pipeline that converts to sales',
    },
    {
      id: 'salesCycleLength',
      label: 'Average Sales Cycle',
      type: 'number',
      value: 45,
      unit: 'days',
      min: 7,
      max: 365,
      step: 7,
      required: true,
      description: 'Average time from lead to closed sale',
    },
    {
      id: 'plannedInitiatives',
      label: 'Planned Growth Initiatives',
      type: 'select',
      value: 'moderate',
      options: [
        { value: 'none', label: 'No Major Initiatives' },
        { value: 'minor', label: 'Minor Improvements' },
        { value: 'moderate', label: 'Moderate Expansion' },
        { value: 'major', label: 'Major Growth Investment' },
      ],
      required: true,
      description: 'Planned business growth initiatives',
    },
  ],

  outputs: [
    {
      id: 'forecastSummary',
      label: 'Forecast Summary',
      type: 'object',
      format: 'forecast-overview',
      description: 'High-level sales forecast summary',
    },
    {
      id: 'monthlyForecast',
      label: 'Monthly Forecast',
      type: 'array',
      format: 'monthly-breakdown',
      description: 'Detailed month-by-month sales forecast',
    },
    {
      id: 'scenarioAnalysis',
      label: 'Scenario Analysis',
      type: 'object',
      format: 'scenario-comparison',
      description: 'Best case, worst case, and most likely scenarios',
    },
    {
      id: 'recommendations',
      label: 'Strategic Recommendations',
      type: 'array',
      format: 'forecast-recommendations',
      description: 'Recommendations based on forecast analysis',
    },
  ],

  calculate: (inputs: Record<string, any>) => {
    const {
      historicalRevenue,
      revenueGrowthTrend,
      seasonalityPattern,
      marketConditions,
      pipelineValue,
      conversionRate,
      salesCycleLength,
      plannedInitiatives,
    } = inputs;

    // Generate forecast summary
    const forecastSummary = generateForecastSummary(
      historicalRevenue,
      revenueGrowthTrend,
      marketConditions,
      plannedInitiatives
    );

    // Create monthly forecast
    const monthlyForecast = generateMonthlyForecast(
      historicalRevenue,
      forecastSummary.projectedAnnualRevenue,
      seasonalityPattern,
      pipelineValue,
      conversionRate,
      salesCycleLength
    );

    // Perform scenario analysis
    const scenarioAnalysis = performScenarioAnalysis(
      forecastSummary,
      inputs
    );

    // Generate recommendations
    const recommendations = generateRecommendations(
      forecastSummary,
      scenarioAnalysis,
      inputs
    );

    return {
      forecastSummary,
      monthlyForecast,
      scenarioAnalysis,
      recommendations,
    };
  },

  validation: {
    historicalRevenue: {
      min: 100000,
      max: 50000000,
      message: 'Historical revenue must be between $100K and $50M',
    },
    conversionRate: {
      min: 5,
      max: 80,
      message: 'Conversion rate must be between 5% and 80%',
    },
    salesCycleLength: {
      min: 7,
      max: 365,
      message: 'Sales cycle must be between 7 and 365 days',
    },
  },

  examples: [
    {
      name: 'Steady Growth Business',
      description: 'Established business with consistent growth',
      inputs: {
        historicalRevenue: 3200000,
        revenueGrowthTrend: 15,
        seasonalityPattern: 'low',
        marketConditions: 'growing',
        pipelineValue: 1200000,
        conversionRate: 30,
        salesCycleLength: 60,
        plannedInitiatives: 'moderate',
      },
    },
    {
      name: 'Seasonal Manufacturing',
      description: 'Business with strong seasonal patterns',
      inputs: {
        historicalRevenue: 1800000,
        revenueGrowthTrend: 8,
        seasonalityPattern: 'high',
        marketConditions: 'stable',
        pipelineValue: 600000,
        conversionRate: 20,
        salesCycleLength: 90,
        plannedInitiatives: 'minor',
      },
    },
  ],

  tags: ['forecasting', 'sales', 'planning', 'revenue', 'growth'],
  
  relatedCalculators: [
    'market-penetration',
    'customer-lifetime-value',
    'lead-qualification',
    'break-even-analysis',
  ],

  learningResources: [
    {
      title: 'Sales Forecasting Best Practices',
      type: 'article',
      url: '/learn/sales-forecasting',
    },
    {
      title: 'Building Accurate Revenue Models',
      type: 'video',
      url: '/learn/revenue-modeling',
    },
  ],
};

// Helper functions
function generateForecastSummary(
  historicalRevenue: number,
  growthTrend: number,
  marketConditions: string,
  plannedInitiatives: string
) {
  // Adjust growth rate based on market conditions
  const marketAdjustments = {
    declining: -0.3,
    stable: 0,
    growing: 0.2,
    booming: 0.5,
  };
  
  // Adjust growth rate based on planned initiatives
  const initiativeAdjustments = {
    none: -0.1,
    minor: 0,
    moderate: 0.15,
    major: 0.3,
  };
  
  const marketAdjustment = marketAdjustments[marketConditions] || 0;
  const initiativeAdjustment = initiativeAdjustments[plannedInitiatives] || 0;
  
  const adjustedGrowthRate = growthTrend * (1 + marketAdjustment + initiativeAdjustment);
  const projectedAnnualRevenue = historicalRevenue * (1 + adjustedGrowthRate / 100);
  
  const monthlyAverage = projectedAnnualRevenue / 12;
  const quarterlyAverage = projectedAnnualRevenue / 4;
  
  return {
    historicalRevenue: Math.round(historicalRevenue),
    projectedAnnualRevenue: Math.round(projectedAnnualRevenue),
    revenueGrowth: Math.round(projectedAnnualRevenue - historicalRevenue),
    growthPercentage: Math.round(adjustedGrowthRate * 10) / 10,
    monthlyAverage: Math.round(monthlyAverage),
    quarterlyAverage: Math.round(quarterlyAverage),
    confidence: calculateConfidence(marketConditions, plannedInitiatives),
    forecastPeriod: '12 months',
  };
}

function calculateConfidence(marketConditions: string, plannedInitiatives: string) {
  let confidence = 70; // Base confidence
  
  // Market condition adjustments
  if (marketConditions === 'stable') confidence += 15;
  else if (marketConditions === 'growing') confidence += 10;
  else if (marketConditions === 'declining') confidence -= 10;
  else if (marketConditions === 'booming') confidence -= 5; // Uncertainty in rapid growth
  
  // Initiative adjustments
  if (plannedInitiatives === 'none') confidence += 10; // More predictable
  else if (plannedInitiatives === 'major') confidence -= 15; // Higher uncertainty
  
  return Math.max(50, Math.min(90, confidence));
}

function generateMonthlyForecast(
  historicalRevenue: number,
  projectedRevenue: number,
  seasonalityPattern: string,
  pipelineValue: number,
  conversionRate: number,
  salesCycleLength: number
) {
  const monthlyBase = projectedRevenue / 12;
  const seasonalFactors = getSeasonalFactors(seasonalityPattern);
  
  const forecast = [];
  const currentDate = new Date();
  
  for (let month = 0; month < 12; month++) {
    const forecastDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + month + 1, 1);
    const seasonalFactor = seasonalFactors[month % 12];
    
    const baseRevenue = monthlyBase * seasonalFactor;
    const pipelineContribution = calculatePipelineContribution(
      pipelineValue,
      conversionRate,
      salesCycleLength,
      month
    );
    
    const totalRevenue = baseRevenue + pipelineContribution;
    
    forecast.push({
      month: forecastDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      monthNumber: month + 1,
      baseRevenue: Math.round(baseRevenue),
      pipelineRevenue: Math.round(pipelineContribution),
      totalRevenue: Math.round(totalRevenue),
      seasonalFactor: Math.round(seasonalFactor * 100) / 100,
      cumulativeRevenue: forecast.reduce((sum, m) => sum + m.totalRevenue, 0) + Math.round(totalRevenue),
    });
  }
  
  return forecast;
}

function getSeasonalFactors(pattern: string) {
  const patterns = {
    none: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    low: [0.95, 0.95, 1.05, 1.05, 1.0, 1.0, 0.95, 0.95, 1.05, 1.05, 1.0, 1.0],
    moderate: [0.8, 0.85, 1.1, 1.15, 1.05, 1.0, 0.9, 0.85, 1.1, 1.15, 1.05, 1.0],
    high: [0.65, 0.7, 1.3, 1.35, 1.2, 1.1, 0.8, 0.75, 1.25, 1.3, 1.15, 1.05],
  };
  
  return patterns[pattern] || patterns.none;
}

function calculatePipelineContribution(
  pipelineValue: number,
  conversionRate: number,
  salesCycleLength: number,
  monthOffset: number
) {
  const expectedRevenue = pipelineValue * (conversionRate / 100);
  const cycleLengthMonths = salesCycleLength / 30;
  
  // Distribute pipeline revenue over the sales cycle
  if (monthOffset < cycleLengthMonths) {
    return expectedRevenue / cycleLengthMonths;
  }
  
  return 0;
}

function performScenarioAnalysis(forecastSummary: any, inputs: any) {
  const baseRevenue = forecastSummary.projectedAnnualRevenue;
  
  // Best case scenario (20% above base)
  const bestCase = {
    revenue: Math.round(baseRevenue * 1.2),
    growth: Math.round((baseRevenue * 1.2 - inputs.historicalRevenue) / inputs.historicalRevenue * 100),
    probability: 25,
    assumptions: [
      'All planned initiatives succeed',
      'Market conditions improve',
      'Higher than expected conversion rates',
      'New customer acquisition exceeds targets',
    ],
  };
  
  // Most likely scenario (base forecast)
  const mostLikely = {
    revenue: Math.round(baseRevenue),
    growth: Math.round((baseRevenue - inputs.historicalRevenue) / inputs.historicalRevenue * 100),
    probability: 50,
    assumptions: [
      'Current trends continue',
      'Planned initiatives deliver as expected',
      'Market conditions remain stable',
      'Normal seasonal patterns',
    ],
  };
  
  // Worst case scenario (20% below base)
  const worstCase = {
    revenue: Math.round(baseRevenue * 0.8),
    growth: Math.round((baseRevenue * 0.8 - inputs.historicalRevenue) / inputs.historicalRevenue * 100),
    probability: 25,
    assumptions: [
      'Market conditions deteriorate',
      'Planned initiatives underperform',
      'Increased competition',
      'Economic downturn impact',
    ],
  };
  
  return {
    bestCase,
    mostLikely,
    worstCase,
    range: {
      low: worstCase.revenue,
      high: bestCase.revenue,
      spread: bestCase.revenue - worstCase.revenue,
      spreadPercentage: Math.round(((bestCase.revenue - worstCase.revenue) / mostLikely.revenue) * 100),
    },
    riskAssessment: assessForecastRisk(inputs),
  };
}

function assessForecastRisk(inputs: any) {
  const risks = [];
  
  if (inputs.seasonalityPattern === 'high') {
    risks.push({
      risk: 'High Seasonality',
      impact: 'Medium',
      mitigation: 'Develop counter-seasonal revenue streams',
    });
  }
  
  if (inputs.conversionRate < 20) {
    risks.push({
      risk: 'Low Conversion Rate',
      impact: 'High',
      mitigation: 'Improve sales process and lead qualification',
    });
  }
  
  if (inputs.salesCycleLength > 90) {
    risks.push({
      risk: 'Long Sales Cycle',
      impact: 'Medium',
      mitigation: 'Streamline sales process and decision-making',
    });
  }
  
  if (inputs.marketConditions === 'declining') {
    risks.push({
      risk: 'Market Decline',
      impact: 'High',
      mitigation: 'Diversify into growing market segments',
    });
  }
  
  return {
    risks,
    overallRisk: calculateOverallRisk(risks),
    confidenceLevel: inputs.marketConditions === 'stable' ? 'High' : 'Medium',
  };
}

function calculateOverallRisk(risks: any[]) {
  const highRisks = risks.filter(r => r.impact === 'High').length;
  const mediumRisks = risks.filter(r => r.impact === 'Medium').length;
  
  if (highRisks >= 2) return 'High';
  if (highRisks >= 1 || mediumRisks >= 3) return 'Medium';
  return 'Low';
}

function generateRecommendations(forecastSummary: any, scenarioAnalysis: any, inputs: any) {
  const recommendations = [];
  
  // Growth acceleration
  if (forecastSummary.growthPercentage < 10) {
    recommendations.push({
      category: 'Growth Acceleration',
      priority: 'High',
      recommendation: 'Implement growth acceleration initiatives',
      rationale: 'Current growth rate below industry average',
      actions: [
        'Expand marketing efforts',
        'Develop new service offerings',
        'Enter new market segments',
      ],
      expectedImpact: '5-15% additional growth',
    });
  }
  
  // Pipeline optimization
  if (inputs.conversionRate < 25) {
    recommendations.push({
      category: 'Sales Optimization',
      priority: 'High',
      recommendation: 'Improve sales pipeline conversion',
      rationale: 'Conversion rate below optimal levels',
      actions: [
        'Enhance lead qualification process',
        'Improve sales training',
        'Implement CRM system',
      ],
      expectedImpact: '20-40% conversion improvement',
    });
  }
  
  // Seasonality management
  if (inputs.seasonalityPattern === 'high' || inputs.seasonalityPattern === 'moderate') {
    recommendations.push({
      category: 'Seasonality Management',
      priority: 'Medium',
      recommendation: 'Develop counter-seasonal strategies',
      rationale: 'High seasonal variation creates cash flow challenges',
      actions: [
        'Diversify service offerings',
        'Target different industries',
        'Develop maintenance contracts',
      ],
      expectedImpact: '10-25% seasonality reduction',
    });
  }
  
  // Risk mitigation
  if (scenarioAnalysis.riskAssessment.overallRisk === 'High') {
    recommendations.push({
      category: 'Risk Mitigation',
      priority: 'High',
      recommendation: 'Implement risk mitigation strategies',
      rationale: 'High forecast risk requires proactive management',
      actions: [
        'Diversify customer base',
        'Build cash reserves',
        'Develop contingency plans',
      ],
      expectedImpact: 'Reduced forecast volatility',
    });
  }
  
  // Market expansion
  if (inputs.marketConditions === 'growing' || inputs.marketConditions === 'booming') {
    recommendations.push({
      category: 'Market Expansion',
      priority: 'Medium',
      recommendation: 'Capitalize on favorable market conditions',
      rationale: 'Strong market conditions support aggressive growth',
      actions: [
        'Increase capacity',
        'Expand geographic reach',
        'Invest in technology',
      ],
      expectedImpact: '15-30% market share growth',
    });
  }
  
  return recommendations.sort((a, b) => {
    const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
}

export default salesForecastingConfig;
