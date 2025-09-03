import { CalculatorConfig } from '../../types/calculator';

export const costPlusPricingConfig: CalculatorConfig = {
  id: 'cost-plus-pricing',
  name: 'Cost-Plus Pricing Calculator',
  description: 'Calculate pricing using cost-plus methodology with various markup strategies and profit margin targets.',
  category: 'pricing',
  difficulty: 'beginner',
  estimatedTime: '3-4 minutes',
  
  inputs: [
    {
      id: 'directMaterialCost',
      label: 'Direct Material Cost',
      type: 'number',
      value: 25,
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
      value: 18,
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
      value: 12,
      unit: 'USD',
      min: 1,
      max: 150,
      step: 1,
      required: true,
      description: 'Allocated overhead costs',
    },
    {
      id: 'markupMethod',
      label: 'Markup Method',
      type: 'select',
      value: 'margin',
      options: [
        { value: 'margin', label: 'Profit Margin (% of selling price)' },
        { value: 'markup', label: 'Markup (% of cost)' },
        { value: 'fixed_amount', label: 'Fixed Dollar Amount' },
      ],
      required: true,
      description: 'Method for calculating profit',
    },
    {
      id: 'profitPercentage',
      label: 'Profit Percentage',
      type: 'number',
      value: 25,
      unit: '%',
      min: 5,
      max: 100,
      step: 1,
      required: true,
      description: 'Profit margin or markup percentage',
    },
    {
      id: 'fixedProfitAmount',
      label: 'Fixed Profit Amount',
      type: 'number',
      value: 15,
      unit: 'USD',
      min: 1,
      max: 200,
      step: 1,
      required: false,
      description: 'Fixed dollar profit amount (if using fixed amount method)',
    },
    {
      id: 'industryType',
      label: 'Industry Type',
      type: 'select',
      value: 'general_manufacturing',
      options: [
        { value: 'job_shop', label: 'Job Shop' },
        { value: 'general_manufacturing', label: 'General Manufacturing' },
        { value: 'precision_parts', label: 'Precision Parts' },
        { value: 'prototype', label: 'Prototype/R&D' },
        { value: 'high_volume', label: 'High Volume Production' },
      ],
      required: true,
      description: 'Type of manufacturing operation',
    },
    {
      id: 'orderSize',
      label: 'Order Size',
      type: 'select',
      value: 'medium',
      options: [
        { value: 'small', label: 'Small (1-10 parts)' },
        { value: 'medium', label: 'Medium (11-100 parts)' },
        { value: 'large', label: 'Large (100+ parts)' },
      ],
      required: true,
      description: 'Size of the order',
    },
  ],

  outputs: [
    {
      id: 'pricingCalculation',
      label: 'Pricing Calculation',
      type: 'object',
      format: 'pricing-breakdown',
      description: 'Detailed cost-plus pricing calculation',
    },
    {
      id: 'alternativePricing',
      label: 'Alternative Pricing Methods',
      type: 'array',
      format: 'pricing-alternatives',
      description: 'Comparison of different markup methods',
    },
    {
      id: 'industryBenchmark',
      label: 'Industry Benchmark',
      type: 'object',
      format: 'benchmark-comparison',
      description: 'Comparison with industry standards',
    },
    {
      id: 'recommendations',
      label: 'Pricing Recommendations',
      type: 'array',
      format: 'pricing-recommendations',
      description: 'Recommendations for pricing optimization',
    },
  ],

  calculate: (inputs: Record<string, any>) => {
    const {
      directMaterialCost,
      directLaborCost,
      overheadCost,
      markupMethod,
      profitPercentage,
      fixedProfitAmount,
      industryType,
      orderSize,
    } = inputs;

    const totalCost = directMaterialCost + directLaborCost + overheadCost;

    // Calculate primary pricing
    const pricingCalculation = calculateCostPlusPricing(
      totalCost,
      markupMethod,
      profitPercentage,
      fixedProfitAmount,
      directMaterialCost,
      directLaborCost,
      overheadCost
    );

    // Generate alternative pricing methods
    const alternativePricing = generateAlternativePricing(
      totalCost,
      profitPercentage
    );

    // Compare with industry benchmarks
    const industryBenchmark = compareWithIndustryBenchmarks(
      pricingCalculation.sellingPrice,
      totalCost,
      industryType,
      orderSize
    );

    // Generate recommendations
    const recommendations = generatePricingRecommendations(
      pricingCalculation,
      industryBenchmark,
      inputs
    );

    return {
      pricingCalculation,
      alternativePricing,
      industryBenchmark,
      recommendations,
    };
  },

  validation: {
    profitPercentage: {
      min: 5,
      max: 100,
      message: 'Profit percentage must be between 5% and 100%',
    },
    directMaterialCost: {
      min: 1,
      max: 500,
      message: 'Material cost must be between $1 and $500',
    },
  },

  examples: [
    {
      name: 'Standard Job Shop Quote',
      description: 'Typical job shop cost-plus pricing',
      inputs: {
        directMaterialCost: 30,
        directLaborCost: 25,
        overheadCost: 15,
        markupMethod: 'margin',
        profitPercentage: 25,
        fixedProfitAmount: 0,
        industryType: 'job_shop',
        orderSize: 'medium',
      },
    },
    {
      name: 'High-Volume Production',
      description: 'Cost-plus pricing for high-volume order',
      inputs: {
        directMaterialCost: 20,
        directLaborCost: 12,
        overheadCost: 8,
        markupMethod: 'markup',
        profitPercentage: 35,
        fixedProfitAmount: 0,
        industryType: 'high_volume',
        orderSize: 'large',
      },
    },
  ],

  tags: ['cost-plus', 'pricing', 'markup', 'margin', 'calculation'],
  
  relatedCalculators: [
    'competitive-pricing',
    'value-based-pricing',
    'profit-margin-optimizer',
    'break-even-analysis',
  ],

  learningResources: [
    {
      title: 'Cost-Plus Pricing Fundamentals',
      type: 'article',
      url: '/learn/cost-plus-pricing',
    },
    {
      title: 'Markup vs. Margin Explained',
      type: 'video',
      url: '/learn/markup-vs-margin',
    },
  ],
};

// Helper functions
function calculateCostPlusPricing(
  totalCost: number,
  markupMethod: string,
  profitPercentage: number,
  fixedProfitAmount: number,
  materialCost: number,
  laborCost: number,
  overheadCost: number
) {
  let sellingPrice = 0;
  let profit = 0;
  let actualMargin = 0;
  let actualMarkup = 0;

  switch (markupMethod) {
    case 'margin':
      // Profit margin = profit / selling price
      sellingPrice = totalCost / (1 - profitPercentage / 100);
      profit = sellingPrice - totalCost;
      actualMargin = profitPercentage;
      actualMarkup = (profit / totalCost) * 100;
      break;
      
    case 'markup':
      // Markup = profit / cost
      profit = totalCost * (profitPercentage / 100);
      sellingPrice = totalCost + profit;
      actualMarkup = profitPercentage;
      actualMargin = (profit / sellingPrice) * 100;
      break;
      
    case 'fixed_amount':
      profit = fixedProfitAmount || 0;
      sellingPrice = totalCost + profit;
      actualMargin = (profit / sellingPrice) * 100;
      actualMarkup = (profit / totalCost) * 100;
      break;
  }

  return {
    totalCost: Math.round(totalCost * 100) / 100,
    profit: Math.round(profit * 100) / 100,
    sellingPrice: Math.round(sellingPrice * 100) / 100,
    actualMargin: Math.round(actualMargin * 10) / 10,
    actualMarkup: Math.round(actualMarkup * 10) / 10,
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
    priceBreakdown: {
      cost: Math.round(totalCost * 100) / 100,
      profit: Math.round(profit * 100) / 100,
      total: Math.round(sellingPrice * 100) / 100,
    },
  };
}

function generateAlternativePricing(totalCost: number, basePercentage: number) {
  const alternatives = [];

  // Margin-based pricing
  const marginPrice = totalCost / (1 - basePercentage / 100);
  const marginProfit = marginPrice - totalCost;
  alternatives.push({
    method: 'Profit Margin',
    description: `${basePercentage}% profit margin`,
    sellingPrice: Math.round(marginPrice * 100) / 100,
    profit: Math.round(marginProfit * 100) / 100,
    margin: basePercentage,
    markup: Math.round((marginProfit / totalCost) * 100 * 10) / 10,
  });

  // Markup-based pricing
  const markupProfit = totalCost * (basePercentage / 100);
  const markupPrice = totalCost + markupProfit;
  const markupMargin = (markupProfit / markupPrice) * 100;
  alternatives.push({
    method: 'Cost Markup',
    description: `${basePercentage}% markup on cost`,
    sellingPrice: Math.round(markupPrice * 100) / 100,
    profit: Math.round(markupProfit * 100) / 100,
    margin: Math.round(markupMargin * 10) / 10,
    markup: basePercentage,
  });

  // Industry standard markups
  const industryMarkups = [20, 30, 40, 50];
  industryMarkups.forEach(markup => {
    if (markup !== basePercentage) {
      const profit = totalCost * (markup / 100);
      const price = totalCost + profit;
      const margin = (profit / price) * 100;
      
      alternatives.push({
        method: 'Industry Standard',
        description: `${markup}% industry markup`,
        sellingPrice: Math.round(price * 100) / 100,
        profit: Math.round(profit * 100) / 100,
        margin: Math.round(margin * 10) / 10,
        markup,
      });
    }
  });

  return alternatives.slice(0, 5); // Limit to 5 alternatives
}

function compareWithIndustryBenchmarks(
  sellingPrice: number,
  totalCost: number,
  industryType: string,
  orderSize: string
) {
  const benchmarks = getIndustryBenchmarks(industryType, orderSize);
  const currentMargin = ((sellingPrice - totalCost) / sellingPrice) * 100;
  const currentMarkup = ((sellingPrice - totalCost) / totalCost) * 100;

  return {
    industryType,
    orderSize,
    benchmarks,
    current: {
      margin: Math.round(currentMargin * 10) / 10,
      markup: Math.round(currentMarkup * 10) / 10,
      price: sellingPrice,
    },
    comparison: {
      marginVsBenchmark: Math.round((currentMargin - benchmarks.typicalMargin) * 10) / 10,
      markupVsBenchmark: Math.round((currentMarkup - benchmarks.typicalMarkup) * 10) / 10,
      performance: assessPerformance(currentMargin, benchmarks),
    },
    recommendations: getBenchmarkRecommendations(currentMargin, benchmarks),
  };
}

function getIndustryBenchmarks(industryType: string, orderSize: string) {
  const baseBenchmarks = {
    job_shop: { typicalMargin: 25, typicalMarkup: 33, range: '20-35%' },
    general_manufacturing: { typicalMargin: 22, typicalMarkup: 28, range: '18-30%' },
    precision_parts: { typicalMargin: 30, typicalMarkup: 43, range: '25-40%' },
    prototype: { typicalMargin: 35, typicalMarkup: 54, range: '30-50%' },
    high_volume: { typicalMargin: 18, typicalMarkup: 22, range: '15-25%' },
  };

  const benchmark = baseBenchmarks[industryType] || baseBenchmarks.general_manufacturing;

  // Adjust for order size
  const sizeAdjustments = {
    small: 1.2,   // Higher margins for small orders
    medium: 1.0,  // Base margins
    large: 0.85,  // Lower margins for large orders
  };

  const adjustment = sizeAdjustments[orderSize] || 1.0;

  return {
    typicalMargin: Math.round(benchmark.typicalMargin * adjustment),
    typicalMarkup: Math.round(benchmark.typicalMarkup * adjustment),
    range: benchmark.range,
    industryNote: getIndustryNote(industryType),
  };
}

function getIndustryNote(industryType: string) {
  const notes = {
    job_shop: 'Job shops typically have higher margins due to customization and setup costs',
    general_manufacturing: 'General manufacturing maintains moderate margins with volume efficiency',
    precision_parts: 'Precision work commands premium pricing due to specialized skills',
    prototype: 'Prototype work has highest margins due to engineering and development costs',
    high_volume: 'High volume production operates on lower margins with economies of scale',
  };
  
  return notes[industryType] || 'Standard manufacturing margins apply';
}

function assessPerformance(currentMargin: number, benchmarks: any) {
  const benchmark = benchmarks.typicalMargin;
  const difference = currentMargin - benchmark;

  if (difference >= 5) return 'Above Industry Average';
  if (difference >= 0) return 'At Industry Average';
  if (difference >= -5) return 'Below Industry Average';
  return 'Significantly Below Average';
}

function getBenchmarkRecommendations(currentMargin: number, benchmarks: any) {
  const recommendations = [];
  const benchmark = benchmarks.typicalMargin;

  if (currentMargin < benchmark - 5) {
    recommendations.push('Consider increasing markup to meet industry standards');
    recommendations.push('Review cost structure for potential reductions');
  } else if (currentMargin > benchmark + 5) {
    recommendations.push('Margin is above industry average - good positioning');
    recommendations.push('Monitor competitive response to pricing');
  } else {
    recommendations.push('Margin is within industry norms');
    recommendations.push('Focus on operational efficiency improvements');
  }

  return recommendations;
}

function generatePricingRecommendations(
  pricingCalculation: any,
  industryBenchmark: any,
  inputs: any
) {
  const recommendations = [];

  // Margin analysis recommendations
  if (pricingCalculation.actualMargin < 15) {
    recommendations.push({
      category: 'Margin Improvement',
      priority: 'High',
      recommendation: 'Increase profit margin to ensure sustainability',
      rationale: 'Current margin may not cover unexpected costs or market fluctuations',
      action: 'Consider 20-25% minimum margin for job shop work',
    });
  }

  // Cost structure recommendations
  const materialPercentage = pricingCalculation.costBreakdown.material.percentage;
  if (materialPercentage > 60) {
    recommendations.push({
      category: 'Cost Structure',
      priority: 'Medium',
      recommendation: 'High material cost ratio detected',
      rationale: 'Material costs dominate pricing - consider value-added services',
      action: 'Explore material cost reduction or additional service offerings',
    });
  }

  // Industry comparison recommendations
  if (industryBenchmark.comparison.performance === 'Below Industry Average') {
    recommendations.push({
      category: 'Competitive Position',
      priority: 'High',
      recommendation: 'Pricing below industry standards',
      rationale: 'May indicate undervaluing services or inefficient operations',
      action: 'Review pricing strategy and operational efficiency',
    });
  }

  // Order size recommendations
  if (inputs.orderSize === 'small' && pricingCalculation.actualMargin < 30) {
    recommendations.push({
      category: 'Order Size Strategy',
      priority: 'Medium',
      recommendation: 'Small orders should carry premium pricing',
      rationale: 'Setup costs and handling overhead are proportionally higher',
      action: 'Implement minimum order charges or higher margins for small quantities',
    });
  }

  // Method optimization recommendations
  if (inputs.markupMethod === 'fixed_amount' && inputs.fixedProfitAmount < 20) {
    recommendations.push({
      category: 'Pricing Method',
      priority: 'Low',
      recommendation: 'Consider percentage-based pricing for consistency',
      rationale: 'Fixed amounts may not scale appropriately with cost variations',
      action: 'Evaluate switching to margin or markup percentage method',
    });
  }

  return recommendations.sort((a, b) => {
    const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
}

export default costPlusPricingConfig;
