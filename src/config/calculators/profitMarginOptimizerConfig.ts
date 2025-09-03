import { CalculatorConfig } from '../../types/calculator';

export const profitMarginOptimizerConfig: CalculatorConfig = {
  id: 'profit-margin-optimizer',
  name: 'Profit Margin Optimizer',
  description: 'Optimize profit margins by analyzing cost structures and identifying opportunities to improve profitability.',
  category: 'pricing',
  difficulty: 'intermediate',
  estimatedTime: '4-5 minutes',
  
  inputs: [
    {
      id: 'directMaterialCost',
      label: 'Direct Material Cost',
      type: 'number',
      value: 30,
      unit: 'USD',
      min: 1,
      max: 500,
      step: 1,
      required: true,
      description: 'Cost of raw materials',
    },
    {
      id: 'directLaborCost',
      label: 'Direct Labor Cost',
      type: 'number',
      value: 20,
      unit: 'USD',
      min: 1,
      max: 200,
      step: 1,
      required: true,
      description: 'Direct labor costs',
    },
    {
      id: 'overheadCost',
      label: 'Overhead Cost',
      type: 'number',
      value: 15,
      unit: 'USD',
      min: 1,
      max: 150,
      step: 1,
      required: true,
      description: 'Allocated overhead costs',
    },
    {
      id: 'currentSellingPrice',
      label: 'Current Selling Price',
      type: 'number',
      value: 85,
      unit: 'USD',
      min: 10,
      max: 1000,
      step: 1,
      required: true,
      description: 'Current market selling price',
    },
    {
      id: 'targetMargin',
      label: 'Target Profit Margin',
      type: 'number',
      value: 30,
      unit: '%',
      min: 10,
      max: 60,
      step: 1,
      required: true,
      description: 'Desired profit margin percentage',
    },
    {
      id: 'orderVolume',
      label: 'Order Volume',
      type: 'number',
      value: 100,
      unit: 'parts',
      min: 1,
      max: 10000,
      step: 1,
      required: true,
      description: 'Number of parts in the order',
    },
    {
      id: 'marketFlexibility',
      label: 'Market Price Flexibility',
      type: 'select',
      value: 'moderate',
      options: [
        { value: 'rigid', label: 'Rigid (No price flexibility)' },
        { value: 'limited', label: 'Limited (±5%)' },
        { value: 'moderate', label: 'Moderate (±10%)' },
        { value: 'flexible', label: 'Flexible (±20%)' },
      ],
      required: true,
      description: 'Flexibility in market pricing',
    },
    {
      id: 'costReductionPotential',
      label: 'Cost Reduction Potential',
      type: 'select',
      value: 'moderate',
      options: [
        { value: 'low', label: 'Low (< 5%)' },
        { value: 'moderate', label: 'Moderate (5-15%)' },
        { value: 'high', label: 'High (15-25%)' },
        { value: 'very_high', label: 'Very High (> 25%)' },
      ],
      required: true,
      description: 'Potential for cost reduction',
    },
  ],

  outputs: [
    {
      id: 'marginAnalysis',
      label: 'Margin Analysis',
      type: 'object',
      format: 'margin-breakdown',
      description: 'Current margin analysis and breakdown',
    },
    {
      id: 'optimizationStrategies',
      label: 'Optimization Strategies',
      type: 'array',
      format: 'strategy-list',
      description: 'Strategies to improve profit margins',
    },
    {
      id: 'scenarioAnalysis',
      label: 'Scenario Analysis',
      type: 'array',
      format: 'scenario-table',
      description: 'Different scenarios for margin improvement',
    },
    {
      id: 'recommendations',
      label: 'Recommendations',
      type: 'object',
      format: 'action-plan',
      description: 'Prioritized recommendations for margin optimization',
    },
  ],

  calculate: (inputs: Record<string, any>) => {
    const {
      directMaterialCost,
      directLaborCost,
      overheadCost,
      currentSellingPrice,
      targetMargin,
      orderVolume,
      marketFlexibility,
      costReductionPotential,
    } = inputs;

    const totalCost = directMaterialCost + directLaborCost + overheadCost;

    // Analyze current margins
    const marginAnalysis = analyzeCurrentMargins(
      totalCost,
      currentSellingPrice,
      targetMargin,
      directMaterialCost,
      directLaborCost,
      overheadCost
    );

    // Generate optimization strategies
    const optimizationStrategies = generateOptimizationStrategies(
      marginAnalysis,
      marketFlexibility,
      costReductionPotential,
      orderVolume
    );

    // Create scenario analysis
    const scenarioAnalysis = createScenarioAnalysis(
      totalCost,
      currentSellingPrice,
      targetMargin,
      marketFlexibility,
      costReductionPotential
    );

    // Generate recommendations
    const recommendations = generateRecommendations(
      marginAnalysis,
      optimizationStrategies,
      scenarioAnalysis
    );

    return {
      marginAnalysis,
      optimizationStrategies,
      scenarioAnalysis,
      recommendations,
    };
  },

  validation: {
    targetMargin: {
      min: 10,
      max: 60,
      message: 'Target margin must be between 10% and 60%',
    },
    orderVolume: {
      min: 1,
      max: 10000,
      message: 'Order volume must be between 1 and 10,000 parts',
    },
  },

  examples: [
    {
      name: 'Low Margin Job',
      description: 'Optimizing margins for a low-profit job',
      inputs: {
        directMaterialCost: 45,
        directLaborCost: 25,
        overheadCost: 18,
        currentSellingPrice: 95,
        targetMargin: 25,
        orderVolume: 50,
        marketFlexibility: 'limited',
        costReductionPotential: 'moderate',
      },
    },
    {
      name: 'High-Volume Production',
      description: 'Margin optimization for high-volume order',
      inputs: {
        directMaterialCost: 20,
        directLaborCost: 15,
        overheadCost: 10,
        currentSellingPrice: 60,
        targetMargin: 35,
        orderVolume: 500,
        marketFlexibility: 'moderate',
        costReductionPotential: 'high',
      },
    },
  ],

  tags: ['profit', 'margin', 'optimization', 'cost-reduction', 'pricing'],
  
  relatedCalculators: [
    'competitive-pricing',
    'value-based-pricing',
    'cost-plus-pricing',
    'break-even-analysis',
  ],

  learningResources: [
    {
      title: 'Profit Margin Optimization',
      type: 'article',
      url: '/learn/profit-margin-optimization',
    },
    {
      title: 'Cost Reduction Strategies',
      type: 'video',
      url: '/learn/cost-reduction',
    },
  ],
};

// Helper functions
function analyzeCurrentMargins(
  totalCost: number,
  sellingPrice: number,
  targetMargin: number,
  materialCost: number,
  laborCost: number,
  overheadCost: number
) {
  const grossProfit = sellingPrice - totalCost;
  const currentMargin = (grossProfit / sellingPrice) * 100;
  const marginGap = targetMargin - currentMargin;
  
  const requiredPrice = totalCost / (1 - targetMargin / 100);
  const priceGap = requiredPrice - sellingPrice;
  
  return {
    totalCost: Math.round(totalCost * 100) / 100,
    sellingPrice,
    grossProfit: Math.round(grossProfit * 100) / 100,
    currentMargin: Math.round(currentMargin * 10) / 10,
    targetMargin,
    marginGap: Math.round(marginGap * 10) / 10,
    requiredPrice: Math.round(requiredPrice * 100) / 100,
    priceGap: Math.round(priceGap * 100) / 100,
    costBreakdown: {
      material: {
        amount: materialCost,
        percentage: Math.round((materialCost / totalCost) * 100),
      },
      labor: {
        amount: laborCost,
        percentage: Math.round((laborCost / totalCost) * 100),
      },
      overhead: {
        amount: overheadCost,
        percentage: Math.round((overheadCost / totalCost) * 100),
      },
    },
    marginStatus: getMarginStatus(currentMargin, targetMargin),
  };
}

function getMarginStatus(current: number, target: number) {
  const gap = target - current;
  
  if (gap <= 0) return 'Target Achieved';
  if (gap <= 5) return 'Close to Target';
  if (gap <= 10) return 'Moderate Gap';
  return 'Significant Gap';
}

function generateOptimizationStrategies(
  marginAnalysis: any,
  marketFlexibility: string,
  costReductionPotential: string,
  orderVolume: number
) {
  const strategies = [];
  
  // Price increase strategy
  if (marketFlexibility !== 'rigid') {
    const maxPriceIncrease = getMaxPriceIncrease(marketFlexibility);
    const priceIncreaseNeeded = marginAnalysis.priceGap;
    
    if (priceIncreaseNeeded <= maxPriceIncrease) {
      strategies.push({
        strategy: 'Price Increase',
        description: `Increase price by $${Math.round(priceIncreaseNeeded * 100) / 100}`,
        feasibility: 'High',
        impact: 'Direct margin improvement',
        implementation: 'Immediate',
        marginImprovement: marginAnalysis.marginGap,
        risks: ['Customer resistance', 'Competitive disadvantage'],
      });
    }
  }
  
  // Cost reduction strategy
  const costReductionAmount = getCostReductionAmount(marginAnalysis.totalCost, costReductionPotential);
  if (costReductionAmount > 0) {
    const newCost = marginAnalysis.totalCost - costReductionAmount;
    const newMargin = ((marginAnalysis.sellingPrice - newCost) / marginAnalysis.sellingPrice) * 100;
    const marginImprovement = newMargin - marginAnalysis.currentMargin;
    
    strategies.push({
      strategy: 'Cost Reduction',
      description: `Reduce costs by $${Math.round(costReductionAmount * 100) / 100}`,
      feasibility: getFeasibility(costReductionPotential),
      impact: `${Math.round(marginImprovement * 10) / 10}% margin improvement`,
      implementation: '2-6 months',
      marginImprovement: Math.round(marginImprovement * 10) / 10,
      risks: ['Quality impact', 'Implementation time'],
    });
  }
  
  // Volume strategy
  if (orderVolume < 100) {
    strategies.push({
      strategy: 'Volume Increase',
      description: 'Negotiate larger order quantities for better economies of scale',
      feasibility: 'Medium',
      impact: 'Overhead absorption improvement',
      implementation: '1-3 months',
      marginImprovement: 2,
      risks: ['Customer commitment', 'Inventory costs'],
    });
  }
  
  // Value-added services
  strategies.push({
    strategy: 'Value-Added Services',
    description: 'Add services like finishing, assembly, or expedited delivery',
    feasibility: 'Medium',
    impact: 'Additional revenue streams',
    implementation: '1-2 months',
    marginImprovement: 5,
    risks: ['Capability requirements', 'Customer acceptance'],
  });
  
  // Hybrid strategy
  if (strategies.length > 1) {
    strategies.push({
      strategy: 'Hybrid Approach',
      description: 'Combine moderate price increase with cost reduction',
      feasibility: 'High',
      impact: 'Balanced risk and reward',
      implementation: '2-4 months',
      marginImprovement: Math.min(marginAnalysis.marginGap, 8),
      risks: ['Execution complexity', 'Timing coordination'],
    });
  }
  
  return strategies.sort((a, b) => b.marginImprovement - a.marginImprovement);
}

function getMaxPriceIncrease(flexibility: string) {
  const increases = {
    rigid: 0,
    limited: 0.05,
    moderate: 0.10,
    flexible: 0.20,
  };
  return increases[flexibility] || 0;
}

function getCostReductionAmount(totalCost: number, potential: string) {
  const potentials = {
    low: 0.03,
    moderate: 0.10,
    high: 0.20,
    very_high: 0.30,
  };
  
  const percentage = potentials[potential] || 0.05;
  return totalCost * percentage;
}

function getFeasibility(potential: string) {
  const feasibilities = {
    low: 'Low',
    moderate: 'Medium',
    high: 'High',
    very_high: 'High',
  };
  return feasibilities[potential] || 'Medium';
}

function createScenarioAnalysis(
  totalCost: number,
  currentPrice: number,
  targetMargin: number,
  marketFlexibility: string,
  costReductionPotential: string
) {
  const scenarios = [];
  
  // Current scenario
  const currentMargin = ((currentPrice - totalCost) / currentPrice) * 100;
  scenarios.push({
    scenario: 'Current State',
    price: currentPrice,
    cost: totalCost,
    margin: Math.round(currentMargin * 10) / 10,
    profit: Math.round((currentPrice - totalCost) * 100) / 100,
    feasibility: 'Current',
  });
  
  // Price increase scenarios
  const maxIncrease = getMaxPriceIncrease(marketFlexibility);
  if (maxIncrease > 0) {
    const newPrice = currentPrice * (1 + maxIncrease);
    const newMargin = ((newPrice - totalCost) / newPrice) * 100;
    scenarios.push({
      scenario: 'Price Increase',
      price: Math.round(newPrice * 100) / 100,
      cost: totalCost,
      margin: Math.round(newMargin * 10) / 10,
      profit: Math.round((newPrice - totalCost) * 100) / 100,
      feasibility: 'Medium',
    });
  }
  
  // Cost reduction scenarios
  const costReduction = getCostReductionAmount(totalCost, costReductionPotential);
  if (costReduction > 0) {
    const newCost = totalCost - costReduction;
    const newMargin = ((currentPrice - newCost) / currentPrice) * 100;
    scenarios.push({
      scenario: 'Cost Reduction',
      price: currentPrice,
      cost: Math.round(newCost * 100) / 100,
      margin: Math.round(newMargin * 10) / 10,
      profit: Math.round((currentPrice - newCost) * 100) / 100,
      feasibility: getFeasibility(costReductionPotential),
    });
  }
  
  // Optimal scenario (target margin)
  const optimalPrice = totalCost / (1 - targetMargin / 100);
  scenarios.push({
    scenario: 'Target Margin',
    price: Math.round(optimalPrice * 100) / 100,
    cost: totalCost,
    margin: targetMargin,
    profit: Math.round((optimalPrice - totalCost) * 100) / 100,
    feasibility: assessTargetFeasibility(optimalPrice, currentPrice, marketFlexibility),
  });
  
  return scenarios;
}

function assessTargetFeasibility(targetPrice: number, currentPrice: number, flexibility: string) {
  const increase = (targetPrice - currentPrice) / currentPrice;
  const maxIncrease = getMaxPriceIncrease(flexibility);
  
  if (increase <= maxIncrease) return 'High';
  if (increase <= maxIncrease * 1.5) return 'Medium';
  return 'Low';
}

function generateRecommendations(
  marginAnalysis: any,
  strategies: any[],
  scenarios: any[]
) {
  const recommendations = {
    immediate: [],
    shortTerm: [],
    longTerm: [],
    priority: '',
  };
  
  // Immediate actions
  if (marginAnalysis.marginGap > 0) {
    recommendations.immediate.push('Analyze cost structure for quick wins');
    recommendations.immediate.push('Review pricing strategy with sales team');
  }
  
  // Short-term actions (1-6 months)
  const topStrategy = strategies[0];
  if (topStrategy) {
    recommendations.shortTerm.push(`Implement ${topStrategy.strategy.toLowerCase()}`);
    recommendations.shortTerm.push('Monitor margin performance weekly');
  }
  
  // Long-term actions (6+ months)
  recommendations.longTerm.push('Develop systematic cost reduction program');
  recommendations.longTerm.push('Invest in process improvements');
  recommendations.longTerm.push('Build value-added service capabilities');
  
  // Priority recommendation
  if (marginAnalysis.marginGap > 10) {
    recommendations.priority = 'Critical: Immediate action required to achieve target margins';
  } else if (marginAnalysis.marginGap > 5) {
    recommendations.priority = 'High: Implement margin improvement strategies within 3 months';
  } else {
    recommendations.priority = 'Medium: Fine-tune existing processes for optimal margins';
  }
  
  return {
    ...recommendations,
    keyMetrics: defineKeyMetrics(marginAnalysis),
    successCriteria: defineSuccessCriteria(marginAnalysis.targetMargin),
  };
}

function defineKeyMetrics(marginAnalysis: any) {
  return [
    {
      metric: 'Gross Profit Margin',
      current: `${marginAnalysis.currentMargin}%`,
      target: `${marginAnalysis.targetMargin}%`,
      frequency: 'Weekly',
    },
    {
      metric: 'Cost per Unit',
      current: `$${marginAnalysis.totalCost}`,
      target: 'Reduce by 5-10%',
      frequency: 'Monthly',
    },
    {
      metric: 'Price Realization',
      current: `$${marginAnalysis.sellingPrice}`,
      target: 'Optimize based on value',
      frequency: 'Per Quote',
    },
  ];
}

function defineSuccessCriteria(targetMargin: number) {
  return [
    `Achieve ${targetMargin}% gross margin consistently`,
    'Maintain or improve customer satisfaction',
    'Reduce cost per unit by 5% annually',
    'Increase win rate on profitable jobs',
  ];
}

export default profitMarginOptimizerConfig;
