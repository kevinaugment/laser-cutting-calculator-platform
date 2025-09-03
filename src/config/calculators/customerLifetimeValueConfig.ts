import { CalculatorConfig } from '../../types/calculator';

export const customerLifetimeValueConfig: CalculatorConfig = {
  id: 'customer-lifetime-value',
  name: 'Customer Lifetime Value Calculator',
  description: 'Calculate the total value a customer will bring over their entire relationship to optimize acquisition and retention strategies.',
  category: 'customer-acquisition',
  difficulty: 'intermediate',
  estimatedTime: '4-5 minutes',
  
  inputs: [
    {
      id: 'averageOrderValue',
      label: 'Average Order Value',
      type: 'number',
      value: 2500,
      unit: 'USD',
      min: 100,
      max: 50000,
      step: 100,
      required: true,
      description: 'Average value of each order from this customer',
    },
    {
      id: 'orderFrequency',
      label: 'Order Frequency',
      type: 'select',
      value: 'monthly',
      options: [
        { value: 'weekly', label: 'Weekly' },
        { value: 'bi_weekly', label: 'Bi-weekly' },
        { value: 'monthly', label: 'Monthly' },
        { value: 'quarterly', label: 'Quarterly' },
        { value: 'bi_annually', label: 'Bi-annually' },
        { value: 'annually', label: 'Annually' },
      ],
      required: true,
      description: 'How often the customer places orders',
    },
    {
      id: 'customerLifespan',
      label: 'Expected Customer Lifespan',
      type: 'number',
      value: 3,
      unit: 'years',
      min: 0.5,
      max: 20,
      step: 0.5,
      required: true,
      description: 'Expected duration of customer relationship',
    },
    {
      id: 'grossMargin',
      label: 'Gross Margin',
      type: 'number',
      value: 35,
      unit: '%',
      min: 10,
      max: 80,
      step: 1,
      required: true,
      description: 'Gross profit margin on orders',
    },
    {
      id: 'customerType',
      label: 'Customer Type',
      type: 'select',
      value: 'regular',
      options: [
        { value: 'one_time', label: 'One-time Customer' },
        { value: 'occasional', label: 'Occasional Customer' },
        { value: 'regular', label: 'Regular Customer' },
        { value: 'strategic', label: 'Strategic Partner' },
      ],
      required: true,
      description: 'Type of customer relationship',
    },
    {
      id: 'retentionRate',
      label: 'Annual Retention Rate',
      type: 'number',
      value: 85,
      unit: '%',
      min: 50,
      max: 100,
      step: 1,
      required: true,
      description: 'Percentage of customers retained each year',
    },
    {
      id: 'growthRate',
      label: 'Annual Order Growth Rate',
      type: 'number',
      value: 10,
      unit: '%',
      min: -20,
      max: 50,
      step: 1,
      required: true,
      description: 'Expected annual growth in order value',
    },
    {
      id: 'referralValue',
      label: 'Referral Value',
      type: 'number',
      value: 500,
      unit: 'USD',
      min: 0,
      max: 10000,
      step: 100,
      required: true,
      description: 'Average value from customer referrals',
    },
  ],

  outputs: [
    {
      id: 'lifetimeValue',
      label: 'Lifetime Value Analysis',
      type: 'object',
      format: 'clv-breakdown',
      description: 'Comprehensive customer lifetime value calculation',
    },
    {
      id: 'acquisitionMetrics',
      label: 'Acquisition Metrics',
      type: 'object',
      format: 'acquisition-analysis',
      description: 'Customer acquisition cost and ROI analysis',
    },
    {
      id: 'retentionStrategy',
      label: 'Retention Strategy',
      type: 'array',
      format: 'retention-recommendations',
      description: 'Strategies to maximize customer lifetime value',
    },
    {
      id: 'segmentAnalysis',
      label: 'Customer Segment Analysis',
      type: 'object',
      format: 'segment-comparison',
      description: 'Comparison with different customer segments',
    },
  ],

  calculate: (inputs: Record<string, any>) => {
    const {
      averageOrderValue,
      orderFrequency,
      customerLifespan,
      grossMargin,
      customerType,
      retentionRate,
      growthRate,
      referralValue,
    } = inputs;

    // Calculate lifetime value
    const lifetimeValue = calculateLifetimeValue(
      averageOrderValue,
      orderFrequency,
      customerLifespan,
      grossMargin,
      retentionRate,
      growthRate,
      referralValue
    );

    // Calculate acquisition metrics
    const acquisitionMetrics = calculateAcquisitionMetrics(
      lifetimeValue.totalCLV,
      customerType
    );

    // Generate retention strategy
    const retentionStrategy = generateRetentionStrategy(
      lifetimeValue,
      inputs
    );

    // Analyze customer segments
    const segmentAnalysis = analyzeCustomerSegments(
      lifetimeValue,
      customerType,
      inputs
    );

    return {
      lifetimeValue,
      acquisitionMetrics,
      retentionStrategy,
      segmentAnalysis,
    };
  },

  validation: {
    averageOrderValue: {
      min: 100,
      max: 50000,
      message: 'Average order value must be between $100 and $50,000',
    },
    customerLifespan: {
      min: 0.5,
      max: 20,
      message: 'Customer lifespan must be between 0.5 and 20 years',
    },
    grossMargin: {
      min: 10,
      max: 80,
      message: 'Gross margin must be between 10% and 80%',
    },
  },

  examples: [
    {
      name: 'High-Value Strategic Partner',
      description: 'Large customer with frequent orders and high retention',
      inputs: {
        averageOrderValue: 8000,
        orderFrequency: 'monthly',
        customerLifespan: 5,
        grossMargin: 40,
        customerType: 'strategic',
        retentionRate: 95,
        growthRate: 15,
        referralValue: 2000,
      },
    },
    {
      name: 'Occasional Small Customer',
      description: 'Small customer with infrequent orders',
      inputs: {
        averageOrderValue: 800,
        orderFrequency: 'quarterly',
        customerLifespan: 2,
        grossMargin: 30,
        customerType: 'occasional',
        retentionRate: 70,
        growthRate: 5,
        referralValue: 200,
      },
    },
  ],

  tags: ['clv', 'customer-value', 'retention', 'acquisition', 'roi'],
  
  relatedCalculators: [
    'lead-qualification',
    'quote-generator',
    'market-penetration',
    'sales-forecasting',
  ],

  learningResources: [
    {
      title: 'Customer Lifetime Value Fundamentals',
      type: 'article',
      url: '/learn/customer-lifetime-value',
    },
    {
      title: 'Maximizing Customer Retention',
      type: 'video',
      url: '/learn/customer-retention',
    },
  ],
};

// Helper functions
function calculateLifetimeValue(
  averageOrderValue: number,
  orderFrequency: string,
  customerLifespan: number,
  grossMargin: number,
  retentionRate: number,
  growthRate: number,
  referralValue: number
) {
  // Convert frequency to orders per year
  const frequencyMultipliers = {
    weekly: 52,
    bi_weekly: 26,
    monthly: 12,
    quarterly: 4,
    bi_annually: 2,
    annually: 1,
  };
  
  const ordersPerYear = frequencyMultipliers[orderFrequency] || 12;
  
  // Calculate annual revenue
  const annualRevenue = averageOrderValue * ordersPerYear;
  const annualProfit = annualRevenue * (grossMargin / 100);
  
  // Calculate CLV with retention and growth
  let totalCLV = 0;
  let currentAnnualProfit = annualProfit;
  let retentionFactor = 1;
  
  for (let year = 1; year <= customerLifespan; year++) {
    totalCLV += currentAnnualProfit * retentionFactor;
    currentAnnualProfit *= (1 + growthRate / 100);
    retentionFactor *= (retentionRate / 100);
  }
  
  // Add referral value
  const totalCLVWithReferrals = totalCLV + referralValue;
  
  return {
    annualRevenue: Math.round(annualRevenue),
    annualProfit: Math.round(annualProfit),
    totalCLV: Math.round(totalCLV),
    totalCLVWithReferrals: Math.round(totalCLVWithReferrals),
    referralValue,
    ordersPerYear,
    totalOrders: Math.round(ordersPerYear * customerLifespan),
    averageProfitPerOrder: Math.round(annualProfit / ordersPerYear),
    yearlyBreakdown: generateYearlyBreakdown(
      annualProfit,
      customerLifespan,
      retentionRate,
      growthRate
    ),
  };
}

function generateYearlyBreakdown(
  initialProfit: number,
  lifespan: number,
  retentionRate: number,
  growthRate: number
) {
  const breakdown = [];
  let currentProfit = initialProfit;
  let retentionFactor = 1;
  
  for (let year = 1; year <= lifespan; year++) {
    const yearlyProfit = currentProfit * retentionFactor;
    breakdown.push({
      year,
      profit: Math.round(yearlyProfit),
      retentionRate: Math.round(retentionFactor * 100),
      cumulativeProfit: breakdown.reduce((sum, y) => sum + y.profit, 0) + Math.round(yearlyProfit),
    });
    
    currentProfit *= (1 + growthRate / 100);
    retentionFactor *= (retentionRate / 100);
  }
  
  return breakdown;
}

function calculateAcquisitionMetrics(totalCLV: number, customerType: string) {
  // Industry benchmarks for customer acquisition cost
  const acquisitionCostBenchmarks = {
    one_time: totalCLV * 0.1,
    occasional: totalCLV * 0.15,
    regular: totalCLV * 0.2,
    strategic: totalCLV * 0.25,
  };
  
  const maxAcquisitionCost = acquisitionCostBenchmarks[customerType] || totalCLV * 0.2;
  const recommendedAcquisitionCost = maxAcquisitionCost * 0.7; // 70% of max for safety
  
  const roi = ((totalCLV - maxAcquisitionCost) / maxAcquisitionCost) * 100;
  const paybackPeriod = calculatePaybackPeriod(totalCLV, maxAcquisitionCost);
  
  return {
    maxAcquisitionCost: Math.round(maxAcquisitionCost),
    recommendedAcquisitionCost: Math.round(recommendedAcquisitionCost),
    roi: Math.round(roi),
    paybackPeriod,
    acquisitionBudget: calculateAcquisitionBudget(totalCLV),
    costPerLead: Math.round(recommendedAcquisitionCost * 0.1), // Assume 10% conversion
    conversionRate: getExpectedConversionRate(customerType),
  };
}

function calculatePaybackPeriod(clv: number, acquisitionCost: number) {
  // Simplified payback calculation
  const monthlyProfit = clv / 36; // Assume 3-year average lifespan
  const paybackMonths = acquisitionCost / monthlyProfit;
  
  if (paybackMonths <= 3) return 'Less than 3 months';
  if (paybackMonths <= 6) return '3-6 months';
  if (paybackMonths <= 12) return '6-12 months';
  if (paybackMonths <= 24) return '1-2 years';
  return 'More than 2 years';
}

function calculateAcquisitionBudget(clv: number) {
  return {
    conservative: Math.round(clv * 0.1),
    moderate: Math.round(clv * 0.15),
    aggressive: Math.round(clv * 0.25),
  };
}

function getExpectedConversionRate(customerType: string) {
  const rates = {
    one_time: 5,
    occasional: 8,
    regular: 12,
    strategic: 20,
  };
  return rates[customerType] || 10;
}

function generateRetentionStrategy(lifetimeValue: any, inputs: any) {
  const strategies = [];
  
  // High-value customer strategies
  if (lifetimeValue.totalCLV > 10000) {
    strategies.push({
      strategy: 'VIP Treatment Program',
      priority: 'High',
      description: 'Dedicated account management and priority service',
      expectedImpact: '15-25% retention improvement',
      cost: 'Medium',
      timeframe: 'Immediate',
    });
  }
  
  // Retention rate improvement
  if (inputs.retentionRate < 80) {
    strategies.push({
      strategy: 'Retention Improvement Program',
      priority: 'High',
      description: 'Proactive outreach and satisfaction monitoring',
      expectedImpact: '10-20% retention improvement',
      cost: 'Low',
      timeframe: '1-3 months',
    });
  }
  
  // Growth rate optimization
  if (inputs.growthRate < 10) {
    strategies.push({
      strategy: 'Upselling Initiative',
      priority: 'Medium',
      description: 'Identify opportunities for larger or more frequent orders',
      expectedImpact: '5-15% revenue growth',
      cost: 'Low',
      timeframe: '2-6 months',
    });
  }
  
  // Referral program
  if (inputs.referralValue < 1000) {
    strategies.push({
      strategy: 'Referral Program Enhancement',
      priority: 'Medium',
      description: 'Incentivize customer referrals with rewards',
      expectedImpact: '20-50% referral increase',
      cost: 'Medium',
      timeframe: '1-2 months',
    });
  }
  
  // Communication strategy
  strategies.push({
    strategy: 'Regular Communication Program',
    priority: 'Medium',
    description: 'Scheduled check-ins and value-added communications',
    expectedImpact: '5-10% retention improvement',
    cost: 'Low',
    timeframe: 'Ongoing',
  });
  
  return strategies.slice(0, 5);
}

function analyzeCustomerSegments(lifetimeValue: any, customerType: string, inputs: any) {
  const segments = generateSegmentComparisons(inputs);
  const currentSegment = segments.find(s => s.type === customerType);
  
  return {
    currentSegment: currentSegment || segments[0],
    allSegments: segments,
    recommendations: generateSegmentRecommendations(lifetimeValue, customerType),
    upgradeOpportunity: calculateUpgradeOpportunity(customerType, lifetimeValue),
  };
}

function generateSegmentComparisons(inputs: any) {
  const baseInputs = { ...inputs };
  
  return [
    {
      type: 'one_time',
      name: 'One-time Customer',
      clv: calculateSimpleCLV(baseInputs.averageOrderValue, 1, baseInputs.grossMargin),
      characteristics: ['Single purchase', 'Price sensitive', 'Low engagement'],
      retention: '0%',
      growth: '0%',
    },
    {
      type: 'occasional',
      name: 'Occasional Customer',
      clv: calculateSimpleCLV(baseInputs.averageOrderValue * 0.8, 3, baseInputs.grossMargin),
      characteristics: ['Infrequent orders', 'Project-based', 'Moderate loyalty'],
      retention: '60-70%',
      growth: '0-5%',
    },
    {
      type: 'regular',
      name: 'Regular Customer',
      clv: calculateSimpleCLV(baseInputs.averageOrderValue, 12, baseInputs.grossMargin),
      characteristics: ['Consistent orders', 'Predictable demand', 'Good loyalty'],
      retention: '80-90%',
      growth: '5-15%',
    },
    {
      type: 'strategic',
      name: 'Strategic Partner',
      clv: calculateSimpleCLV(baseInputs.averageOrderValue * 1.5, 20, baseInputs.grossMargin),
      characteristics: ['High volume', 'Long-term contracts', 'Collaborative'],
      retention: '90-95%',
      growth: '10-25%',
    },
  ];
}

function calculateSimpleCLV(orderValue: number, ordersPerYear: number, margin: number) {
  return Math.round(orderValue * ordersPerYear * (margin / 100) * 3); // 3-year assumption
}

function generateSegmentRecommendations(lifetimeValue: any, customerType: string) {
  const recommendations = [];
  
  if (customerType === 'one_time') {
    recommendations.push('Focus on converting to occasional customer');
    recommendations.push('Implement follow-up campaigns');
  } else if (customerType === 'occasional') {
    recommendations.push('Increase order frequency through value-added services');
    recommendations.push('Develop long-term partnership opportunities');
  } else if (customerType === 'regular') {
    recommendations.push('Explore strategic partnership potential');
    recommendations.push('Implement loyalty programs');
  } else {
    recommendations.push('Maintain strategic relationship');
    recommendations.push('Explore expansion opportunities');
  }
  
  return recommendations;
}

function calculateUpgradeOpportunity(customerType: string, lifetimeValue: any) {
  const upgradePaths = {
    one_time: { target: 'occasional', potential: lifetimeValue.totalCLV * 2 },
    occasional: { target: 'regular', potential: lifetimeValue.totalCLV * 3 },
    regular: { target: 'strategic', potential: lifetimeValue.totalCLV * 2 },
    strategic: { target: 'expanded', potential: lifetimeValue.totalCLV * 1.5 },
  };
  
  const upgrade = upgradePaths[customerType];
  if (!upgrade) return null;
  
  return {
    targetSegment: upgrade.target,
    potentialValue: Math.round(upgrade.potential),
    valueIncrease: Math.round(upgrade.potential - lifetimeValue.totalCLV),
    probability: getUpgradeProbability(customerType),
    timeframe: getUpgradeTimeframe(customerType),
  };
}

function getUpgradeProbability(customerType: string) {
  const probabilities = {
    one_time: 15,
    occasional: 25,
    regular: 35,
    strategic: 20,
  };
  return probabilities[customerType] || 20;
}

function getUpgradeTimeframe(customerType: string) {
  const timeframes = {
    one_time: '6-12 months',
    occasional: '3-6 months',
    regular: '6-18 months',
    strategic: '12-24 months',
  };
  return timeframes[customerType] || '6-12 months';
}

export default customerLifetimeValueConfig;
