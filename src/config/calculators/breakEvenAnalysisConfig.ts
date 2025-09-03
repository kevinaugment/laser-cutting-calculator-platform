import { CalculatorConfig } from '../../types/calculator';

export const breakEvenAnalysisConfig: CalculatorConfig = {
  id: 'break-even-analysis',
  name: 'Break-Even Analysis Calculator',
  description: 'Calculate break-even points for pricing decisions and determine minimum volumes needed for profitability.',
  category: 'pricing',
  difficulty: 'intermediate',
  estimatedTime: '4-5 minutes',
  
  inputs: [
    {
      id: 'fixedCosts',
      label: 'Fixed Costs',
      type: 'number',
      value: 5000,
      unit: 'USD/month',
      min: 100,
      max: 50000,
      step: 100,
      required: true,
      description: 'Monthly fixed costs (rent, insurance, equipment)',
    },
    {
      id: 'variableCostPerUnit',
      label: 'Variable Cost per Unit',
      type: 'number',
      value: 25,
      unit: 'USD',
      min: 1,
      max: 500,
      step: 1,
      required: true,
      description: 'Variable costs per unit (materials, labor)',
    },
    {
      id: 'sellingPricePerUnit',
      label: 'Selling Price per Unit',
      type: 'number',
      value: 45,
      unit: 'USD',
      min: 5,
      max: 1000,
      step: 1,
      required: true,
      description: 'Selling price per unit',
    },
    {
      id: 'targetProfit',
      label: 'Target Monthly Profit',
      type: 'number',
      value: 2000,
      unit: 'USD',
      min: 0,
      max: 20000,
      step: 100,
      required: true,
      description: 'Desired monthly profit target',
    },
    {
      id: 'currentVolume',
      label: 'Current Monthly Volume',
      type: 'number',
      value: 200,
      unit: 'units',
      min: 0,
      max: 5000,
      step: 10,
      required: true,
      description: 'Current monthly production volume',
    },
    {
      id: 'capacityLimit',
      label: 'Maximum Monthly Capacity',
      type: 'number',
      value: 500,
      unit: 'units',
      min: 50,
      max: 10000,
      step: 10,
      required: true,
      description: 'Maximum monthly production capacity',
    },
    {
      id: 'seasonalVariation',
      label: 'Seasonal Variation',
      type: 'select',
      value: 'moderate',
      options: [
        { value: 'none', label: 'No Variation' },
        { value: 'low', label: 'Low (±10%)' },
        { value: 'moderate', label: 'Moderate (±25%)' },
        { value: 'high', label: 'High (±50%)' },
      ],
      required: true,
      description: 'Seasonal demand variation',
    },
    {
      id: 'marketGrowth',
      label: 'Expected Market Growth',
      type: 'select',
      value: 'stable',
      options: [
        { value: 'declining', label: 'Declining (-10% annually)' },
        { value: 'stable', label: 'Stable (0% growth)' },
        { value: 'growing', label: 'Growing (+15% annually)' },
        { value: 'rapid', label: 'Rapid Growth (+30% annually)' },
      ],
      required: true,
      description: 'Expected market growth rate',
    },
  ],

  outputs: [
    {
      id: 'breakEvenAnalysis',
      label: 'Break-Even Analysis',
      type: 'object',
      format: 'breakeven-metrics',
      description: 'Core break-even calculations and metrics',
    },
    {
      id: 'profitabilityAnalysis',
      label: 'Profitability Analysis',
      type: 'object',
      format: 'profit-analysis',
      description: 'Analysis of current and projected profitability',
    },
    {
      id: 'scenarioAnalysis',
      label: 'Scenario Analysis',
      type: 'array',
      format: 'scenario-table',
      description: 'Different pricing and volume scenarios',
    },
    {
      id: 'recommendations',
      label: 'Strategic Recommendations',
      type: 'array',
      format: 'strategy-recommendations',
      description: 'Recommendations based on break-even analysis',
    },
  ],

  calculate: (inputs: Record<string, any>) => {
    const {
      fixedCosts,
      variableCostPerUnit,
      sellingPricePerUnit,
      targetProfit,
      currentVolume,
      capacityLimit,
      seasonalVariation,
      marketGrowth,
    } = inputs;

    // Calculate break-even analysis
    const breakEvenAnalysis = calculateBreakEven(
      fixedCosts,
      variableCostPerUnit,
      sellingPricePerUnit,
      targetProfit
    );

    // Analyze profitability
    const profitabilityAnalysis = analyzeProfitability(
      breakEvenAnalysis,
      currentVolume,
      capacityLimit,
      fixedCosts,
      variableCostPerUnit,
      sellingPricePerUnit
    );

    // Create scenario analysis
    const scenarioAnalysis = createScenarioAnalysis(
      fixedCosts,
      variableCostPerUnit,
      sellingPricePerUnit,
      breakEvenAnalysis,
      seasonalVariation,
      marketGrowth
    );

    // Generate recommendations
    const recommendations = generateRecommendations(
      breakEvenAnalysis,
      profitabilityAnalysis,
      inputs
    );

    return {
      breakEvenAnalysis,
      profitabilityAnalysis,
      scenarioAnalysis,
      recommendations,
    };
  },

  validation: {
    sellingPricePerUnit: {
      min: 5,
      max: 1000,
      message: 'Selling price must be between $5 and $1000',
    },
    capacityLimit: {
      min: 50,
      max: 10000,
      message: 'Capacity limit must be between 50 and 10,000 units',
    },
  },

  examples: [
    {
      name: 'Small Job Shop',
      description: 'Break-even analysis for small job shop operation',
      inputs: {
        fixedCosts: 3000,
        variableCostPerUnit: 20,
        sellingPricePerUnit: 35,
        targetProfit: 1500,
        currentVolume: 150,
        capacityLimit: 300,
        seasonalVariation: 'moderate',
        marketGrowth: 'stable',
      },
    },
    {
      name: 'High-Volume Production',
      description: 'Break-even analysis for high-volume production',
      inputs: {
        fixedCosts: 12000,
        variableCostPerUnit: 15,
        sellingPricePerUnit: 28,
        targetProfit: 5000,
        currentVolume: 800,
        capacityLimit: 1500,
        seasonalVariation: 'low',
        marketGrowth: 'growing',
      },
    },
  ],

  tags: ['break-even', 'profitability', 'volume', 'pricing', 'analysis'],
  
  relatedCalculators: [
    'profit-margin-optimizer',
    'competitive-pricing',
    'value-based-pricing',
    'cost-plus-pricing',
  ],

  learningResources: [
    {
      title: 'Break-Even Analysis Fundamentals',
      type: 'article',
      url: '/learn/break-even-analysis',
    },
    {
      title: 'Volume-Based Pricing Strategies',
      type: 'video',
      url: '/learn/volume-pricing',
    },
  ],
};

// Helper functions
function calculateBreakEven(
  fixedCosts: number,
  variableCost: number,
  sellingPrice: number,
  targetProfit: number
) {
  const contributionMargin = sellingPrice - variableCost;
  const contributionMarginRatio = (contributionMargin / sellingPrice) * 100;
  
  const breakEvenUnits = Math.ceil(fixedCosts / contributionMargin);
  const breakEvenRevenue = breakEvenUnits * sellingPrice;
  
  const targetProfitUnits = Math.ceil((fixedCosts + targetProfit) / contributionMargin);
  const targetProfitRevenue = targetProfitUnits * sellingPrice;
  
  return {
    contributionMargin: Math.round(contributionMargin * 100) / 100,
    contributionMarginRatio: Math.round(contributionMarginRatio * 10) / 10,
    breakEvenUnits,
    breakEvenRevenue: Math.round(breakEvenRevenue),
    targetProfitUnits,
    targetProfitRevenue: Math.round(targetProfitRevenue),
    marginOfSafety: calculateMarginOfSafety(breakEvenUnits, targetProfitUnits),
  };
}

function calculateMarginOfSafety(breakEvenUnits: number, targetUnits: number) {
  const safetyUnits = targetUnits - breakEvenUnits;
  const safetyPercentage = (safetyUnits / targetUnits) * 100;
  
  return {
    units: safetyUnits,
    percentage: Math.round(safetyPercentage * 10) / 10,
  };
}

function analyzeProfitability(
  breakEven: any,
  currentVolume: number,
  capacityLimit: number,
  fixedCosts: number,
  variableCost: number,
  sellingPrice: number
) {
  const currentRevenue = currentVolume * sellingPrice;
  const currentVariableCosts = currentVolume * variableCost;
  const currentProfit = currentRevenue - currentVariableCosts - fixedCosts;
  const currentMargin = currentVolume > 0 ? (currentProfit / currentRevenue) * 100 : 0;
  
  const maxRevenue = capacityLimit * sellingPrice;
  const maxVariableCosts = capacityLimit * variableCost;
  const maxProfit = maxRevenue - maxVariableCosts - fixedCosts;
  
  const volumeUtilization = (currentVolume / capacityLimit) * 100;
  const breakEvenUtilization = (breakEven.breakEvenUnits / capacityLimit) * 100;
  
  return {
    current: {
      volume: currentVolume,
      revenue: Math.round(currentRevenue),
      profit: Math.round(currentProfit),
      margin: Math.round(currentMargin * 10) / 10,
    },
    maximum: {
      volume: capacityLimit,
      revenue: Math.round(maxRevenue),
      profit: Math.round(maxProfit),
      margin: Math.round((maxProfit / maxRevenue) * 100 * 10) / 10,
    },
    utilization: {
      current: Math.round(volumeUtilization * 10) / 10,
      breakEven: Math.round(breakEvenUtilization * 10) / 10,
      available: Math.round((100 - volumeUtilization) * 10) / 10,
    },
    status: getProfitabilityStatus(currentVolume, breakEven.breakEvenUnits, breakEven.targetProfitUnits),
  };
}

function getProfitabilityStatus(current: number, breakEven: number, target: number) {
  if (current < breakEven) return 'Loss Making';
  if (current < target) return 'Profitable but Below Target';
  return 'Target Achieved';
}

function createScenarioAnalysis(
  fixedCosts: number,
  variableCost: number,
  sellingPrice: number,
  breakEven: any,
  seasonalVariation: string,
  marketGrowth: string
) {
  const scenarios = [];
  
  // Current scenario
  scenarios.push(createScenario('Current', sellingPrice, variableCost, fixedCosts, breakEven.breakEvenUnits));
  
  // Price variation scenarios
  const priceVariations = [-10, -5, 5, 10]; // Percentage changes
  priceVariations.forEach(variation => {
    const newPrice = sellingPrice * (1 + variation / 100);
    const newBreakEven = Math.ceil(fixedCosts / (newPrice - variableCost));
    scenarios.push(createScenario(
      `Price ${variation > 0 ? '+' : ''}${variation}%`,
      newPrice,
      variableCost,
      fixedCosts,
      newBreakEven
    ));
  });
  
  // Cost variation scenarios
  const costVariations = [-15, -10, 10, 15]; // Percentage changes
  costVariations.forEach(variation => {
    const newVariableCost = variableCost * (1 + variation / 100);
    const newBreakEven = Math.ceil(fixedCosts / (sellingPrice - newVariableCost));
    scenarios.push(createScenario(
      `Cost ${variation > 0 ? '+' : ''}${variation}%`,
      sellingPrice,
      newVariableCost,
      fixedCosts,
      newBreakEven
    ));
  });
  
  // Seasonal scenarios
  if (seasonalVariation !== 'none') {
    const seasonalFactors = getSeasonalFactors(seasonalVariation);
    scenarios.push(createScenario(
      'Peak Season',
      sellingPrice,
      variableCost,
      fixedCosts,
      Math.ceil(breakEven.breakEvenUnits / seasonalFactors.peak)
    ));
    scenarios.push(createScenario(
      'Low Season',
      sellingPrice,
      variableCost,
      fixedCosts,
      Math.ceil(breakEven.breakEvenUnits / seasonalFactors.low)
    ));
  }
  
  return scenarios.sort((a, b) => a.breakEvenUnits - b.breakEvenUnits);
}

function createScenario(name: string, price: number, variableCost: number, fixedCosts: number, breakEvenUnits: number) {
  const contributionMargin = price - variableCost;
  const revenue = breakEvenUnits * price;
  
  return {
    scenario: name,
    price: Math.round(price * 100) / 100,
    variableCost: Math.round(variableCost * 100) / 100,
    contributionMargin: Math.round(contributionMargin * 100) / 100,
    breakEvenUnits,
    breakEvenRevenue: Math.round(revenue),
    marginRatio: Math.round((contributionMargin / price) * 100 * 10) / 10,
  };
}

function getSeasonalFactors(variation: string) {
  const factors = {
    low: { peak: 1.1, low: 0.9 },
    moderate: { peak: 1.25, low: 0.75 },
    high: { peak: 1.5, low: 0.5 },
  };
  return factors[variation] || { peak: 1.0, low: 1.0 };
}

function generateRecommendations(
  breakEven: any,
  profitability: any,
  inputs: any
) {
  const recommendations = [];
  
  // Volume recommendations
  if (profitability.current.volume < breakEven.breakEvenUnits) {
    recommendations.push({
      category: 'Volume',
      priority: 'Critical',
      recommendation: 'Increase volume to reach break-even point',
      action: `Need ${breakEven.breakEvenUnits - profitability.current.volume} more units monthly`,
      impact: 'Move from loss to profitability',
      timeframe: '1-3 months',
    });
  }
  
  // Pricing recommendations
  if (breakEven.contributionMarginRatio < 40) {
    recommendations.push({
      category: 'Pricing',
      priority: 'High',
      recommendation: 'Improve contribution margin through pricing',
      action: 'Increase prices or reduce variable costs',
      impact: 'Lower break-even point',
      timeframe: 'Immediate',
    });
  }
  
  // Capacity recommendations
  if (profitability.utilization.current > 80) {
    recommendations.push({
      category: 'Capacity',
      priority: 'Medium',
      recommendation: 'Consider capacity expansion',
      action: 'Evaluate equipment or facility expansion',
      impact: 'Enable higher profit potential',
      timeframe: '6-12 months',
    });
  }
  
  // Cost structure recommendations
  if (inputs.fixedCosts > inputs.sellingPricePerUnit * 100) {
    recommendations.push({
      category: 'Cost Structure',
      priority: 'High',
      recommendation: 'Review fixed cost structure',
      action: 'Identify opportunities to reduce fixed costs',
      impact: 'Lower break-even point',
      timeframe: '2-6 months',
    });
  }
  
  // Market growth recommendations
  if (inputs.marketGrowth === 'growing' || inputs.marketGrowth === 'rapid') {
    recommendations.push({
      category: 'Growth Strategy',
      priority: 'Medium',
      recommendation: 'Capitalize on market growth',
      action: 'Invest in marketing and capacity to capture growth',
      impact: 'Accelerate path to profitability',
      timeframe: '3-12 months',
    });
  }
  
  // Risk management recommendations
  if (inputs.seasonalVariation === 'high') {
    recommendations.push({
      category: 'Risk Management',
      priority: 'Medium',
      recommendation: 'Develop seasonal strategy',
      action: 'Plan for seasonal variations in demand',
      impact: 'Maintain profitability year-round',
      timeframe: 'Ongoing',
    });
  }
  
  return recommendations.sort((a, b) => {
    const priorityOrder = { 'Critical': 3, 'High': 2, 'Medium': 1, 'Low': 0 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
}

export default breakEvenAnalysisConfig;
