import { CalculatorConfig } from '../../types/calculator';

export const pricingBenchmarksConfig: CalculatorConfig = {
  id: 'pricing-benchmarks',
  name: 'Pricing Benchmarks Calculator',
  description: 'Compare your pricing against industry benchmarks and optimize pricing strategy for competitive advantage.',
  category: 'market-analysis',
  difficulty: 'intermediate',
  estimatedTime: '4-5 minutes',
  
  inputs: [
    {
      id: 'yourHourlyRate',
      label: 'Your Hourly Rate',
      type: 'number',
      value: 120,
      unit: 'USD/hour',
      min: 50,
      max: 500,
      step: 5,
      required: true,
      description: 'Your current hourly rate for laser cutting',
    },
    {
      id: 'materialMarkup',
      label: 'Material Markup',
      type: 'number',
      value: 25,
      unit: '%',
      min: 0,
      max: 100,
      step: 5,
      required: true,
      description: 'Markup percentage on materials',
    },
    {
      id: 'setupFee',
      label: 'Setup Fee',
      type: 'number',
      value: 75,
      unit: 'USD',
      min: 0,
      max: 500,
      step: 25,
      required: true,
      description: 'Setup fee per job',
    },
    {
      id: 'marketRegion',
      label: 'Market Region',
      type: 'select',
      value: 'midwest',
      options: [
        { value: 'northeast', label: 'Northeast US' },
        { value: 'southeast', label: 'Southeast US' },
        { value: 'midwest', label: 'Midwest US' },
        { value: 'southwest', label: 'Southwest US' },
        { value: 'west_coast', label: 'West Coast US' },
        { value: 'canada', label: 'Canada' },
      ],
      required: true,
      description: 'Your geographic market region',
    },
    {
      id: 'serviceLevel',
      label: 'Service Level',
      type: 'select',
      value: 'standard',
      options: [
        { value: 'basic', label: 'Basic (Cutting only)' },
        { value: 'standard', label: 'Standard (Cutting + basic services)' },
        { value: 'premium', label: 'Premium (Full service)' },
        { value: 'specialty', label: 'Specialty (Highly specialized)' },
      ],
      required: true,
      description: 'Level of service you provide',
    },
    {
      id: 'businessSize',
      label: 'Business Size',
      type: 'select',
      value: 'small',
      options: [
        { value: 'micro', label: 'Micro (1-2 employees)' },
        { value: 'small', label: 'Small (3-10 employees)' },
        { value: 'medium', label: 'Medium (11-50 employees)' },
        { value: 'large', label: 'Large (50+ employees)' },
      ],
      required: true,
      description: 'Size of your business',
    },
    {
      id: 'targetMarket',
      label: 'Primary Target Market',
      type: 'select',
      value: 'general_manufacturing',
      options: [
        { value: 'general_manufacturing', label: 'General Manufacturing' },
        { value: 'automotive', label: 'Automotive' },
        { value: 'aerospace', label: 'Aerospace' },
        { value: 'medical', label: 'Medical Devices' },
        { value: 'electronics', label: 'Electronics' },
        { value: 'prototyping', label: 'Prototyping/R&D' },
      ],
      required: true,
      description: 'Your primary target market',
    },
    {
      id: 'competitivePosition',
      label: 'Competitive Position',
      type: 'select',
      value: 'average',
      options: [
        { value: 'premium', label: 'Premium (Top 20%)' },
        { value: 'above_average', label: 'Above Average' },
        { value: 'average', label: 'Average' },
        { value: 'below_average', label: 'Below Average' },
        { value: 'discount', label: 'Discount (Bottom 20%)' },
      ],
      required: true,
      description: 'Your competitive positioning',
    },
  ],

  outputs: [
    {
      id: 'benchmarkComparison',
      label: 'Benchmark Comparison',
      type: 'object',
      format: 'benchmark-analysis',
      description: 'Comparison of your pricing against industry benchmarks',
    },
    {
      id: 'regionalAnalysis',
      label: 'Regional Analysis',
      type: 'object',
      format: 'regional-pricing',
      description: 'Regional pricing analysis and comparisons',
    },
    {
      id: 'pricingRecommendations',
      label: 'Pricing Recommendations',
      type: 'array',
      format: 'pricing-actions',
      description: 'Specific recommendations to optimize pricing',
    },
    {
      id: 'competitiveAnalysis',
      label: 'Competitive Analysis',
      type: 'object',
      format: 'competitive-pricing',
      description: 'Analysis of competitive pricing dynamics',
    },
  ],

  calculate: (inputs: Record<string, any>) => {
    const {
      yourHourlyRate,
      materialMarkup,
      setupFee,
      marketRegion,
      serviceLevel,
      businessSize,
      targetMarket,
      competitivePosition,
    } = inputs;

    // Get industry benchmarks
    const benchmarkComparison = getBenchmarkComparison(
      yourHourlyRate,
      materialMarkup,
      setupFee,
      serviceLevel,
      targetMarket,
      businessSize
    );

    // Analyze regional pricing
    const regionalAnalysis = analyzeRegionalPricing(
      yourHourlyRate,
      marketRegion,
      serviceLevel
    );

    // Generate pricing recommendations
    const pricingRecommendations = generatePricingRecommendations(
      benchmarkComparison,
      regionalAnalysis,
      inputs
    );

    // Analyze competitive dynamics
    const competitiveAnalysis = analyzeCompetitivePricing(
      benchmarkComparison,
      competitivePosition,
      inputs
    );

    return {
      benchmarkComparison,
      regionalAnalysis,
      pricingRecommendations,
      competitiveAnalysis,
    };
  },

  validation: {
    yourHourlyRate: {
      min: 50,
      max: 500,
      message: 'Hourly rate must be between $50 and $500',
    },
    materialMarkup: {
      min: 0,
      max: 100,
      message: 'Material markup must be between 0% and 100%',
    },
    setupFee: {
      min: 0,
      max: 500,
      message: 'Setup fee must be between $0 and $500',
    },
  },

  examples: [
    {
      name: 'Premium Service Provider',
      description: 'High-end service provider in competitive market',
      inputs: {
        yourHourlyRate: 180,
        materialMarkup: 35,
        setupFee: 150,
        marketRegion: 'west_coast',
        serviceLevel: 'premium',
        businessSize: 'medium',
        targetMarket: 'aerospace',
        competitivePosition: 'premium',
      },
    },
    {
      name: 'Cost-Competitive Shop',
      description: 'Cost-competitive shop in general manufacturing',
      inputs: {
        yourHourlyRate: 95,
        materialMarkup: 15,
        setupFee: 50,
        marketRegion: 'midwest',
        serviceLevel: 'standard',
        businessSize: 'small',
        targetMarket: 'general_manufacturing',
        competitivePosition: 'below_average',
      },
    },
  ],

  tags: ['pricing', 'benchmarks', 'competitive', 'analysis', 'strategy'],
  
  relatedCalculators: [
    'competitive-pricing',
    'cost-plus-pricing',
    'value-based-pricing',
    'competitor-analysis',
  ],

  learningResources: [
    {
      title: 'Pricing Benchmark Analysis',
      type: 'article',
      url: '/learn/pricing-benchmarks',
    },
    {
      title: 'Competitive Pricing Strategies',
      type: 'video',
      url: '/learn/competitive-pricing',
    },
  ],
};

// Helper functions
function getBenchmarkComparison(
  yourRate: number,
  yourMarkup: number,
  yourSetup: number,
  serviceLevel: string,
  targetMarket: string,
  businessSize: string
) {
  // Get industry benchmarks
  const benchmarks = getIndustryBenchmarks(serviceLevel, targetMarket, businessSize);
  
  // Calculate variances
  const rateVariance = ((yourRate - benchmarks.hourlyRate) / benchmarks.hourlyRate) * 100;
  const markupVariance = ((yourMarkup - benchmarks.materialMarkup) / benchmarks.materialMarkup) * 100;
  const setupVariance = ((yourSetup - benchmarks.setupFee) / benchmarks.setupFee) * 100;
  
  return {
    yourPricing: {
      hourlyRate: yourRate,
      materialMarkup: yourMarkup,
      setupFee: yourSetup,
    },
    benchmarks,
    variances: {
      hourlyRate: Math.round(rateVariance),
      materialMarkup: Math.round(markupVariance),
      setupFee: Math.round(setupVariance),
    },
    overallPosition: calculateOverallPosition(rateVariance, markupVariance, setupVariance),
    competitiveIndex: calculateCompetitiveIndex(yourRate, yourMarkup, yourSetup, benchmarks),
  };
}

function getIndustryBenchmarks(serviceLevel: string, targetMarket: string, businessSize: string) {
  // Base benchmarks by service level
  const baseBenchmarks = {
    basic: { hourlyRate: 85, materialMarkup: 15, setupFee: 50 },
    standard: { hourlyRate: 115, materialMarkup: 25, setupFee: 75 },
    premium: { hourlyRate: 155, materialMarkup: 35, setupFee: 125 },
    specialty: { hourlyRate: 200, materialMarkup: 40, setupFee: 175 },
  };
  
  const base = baseBenchmarks[serviceLevel] || baseBenchmarks.standard;
  
  // Market adjustments
  const marketAdjustments = {
    general_manufacturing: 1.0,
    automotive: 1.1,
    aerospace: 1.3,
    medical: 1.25,
    electronics: 1.15,
    prototyping: 1.2,
  };
  
  // Business size adjustments
  const sizeAdjustments = {
    micro: 0.9,
    small: 1.0,
    medium: 1.1,
    large: 1.2,
  };
  
  const marketMultiplier = marketAdjustments[targetMarket] || 1.0;
  const sizeMultiplier = sizeAdjustments[businessSize] || 1.0;
  
  return {
    hourlyRate: Math.round(base.hourlyRate * marketMultiplier * sizeMultiplier),
    materialMarkup: Math.round(base.materialMarkup * marketMultiplier),
    setupFee: Math.round(base.setupFee * marketMultiplier),
    source: `${serviceLevel} service level, ${targetMarket} market, ${businessSize} business`,
  };
}

function calculateOverallPosition(rateVar: number, markupVar: number, setupVar: number) {
  const avgVariance = (rateVar + markupVar + setupVar) / 3;
  
  if (avgVariance > 15) return 'Above Market';
  if (avgVariance > 5) return 'Slightly Above Market';
  if (avgVariance > -5) return 'At Market';
  if (avgVariance > -15) return 'Slightly Below Market';
  return 'Below Market';
}

function calculateCompetitiveIndex(
  yourRate: number,
  yourMarkup: number,
  yourSetup: number,
  benchmarks: any
) {
  // Weighted competitive index (rate is most important)
  const rateScore = (yourRate / benchmarks.hourlyRate) * 0.6;
  const markupScore = (yourMarkup / benchmarks.materialMarkup) * 0.25;
  const setupScore = (yourSetup / benchmarks.setupFee) * 0.15;
  
  const index = (rateScore + markupScore + setupScore) * 100;
  
  return {
    score: Math.round(index),
    interpretation: getIndexInterpretation(index),
  };
}

function getIndexInterpretation(index: number) {
  if (index > 120) return 'Premium Pricing';
  if (index > 110) return 'Above Market Pricing';
  if (index > 90) return 'Market Pricing';
  if (index > 80) return 'Below Market Pricing';
  return 'Discount Pricing';
}

function analyzeRegionalPricing(yourRate: number, region: string, serviceLevel: string) {
  const regionalBenchmarks = getRegionalBenchmarks(region, serviceLevel);
  const variance = ((yourRate - regionalBenchmarks.averageRate) / regionalBenchmarks.averageRate) * 100;
  
  return {
    region,
    regionalBenchmarks,
    yourRate,
    variance: Math.round(variance),
    position: getRegionalPosition(variance),
    marketCharacteristics: getMarketCharacteristics(region),
    costOfLiving: getCostOfLivingIndex(region),
  };
}

function getRegionalBenchmarks(region: string, serviceLevel: string) {
  // Regional multipliers for different areas
  const regionalMultipliers = {
    northeast: 1.15,
    southeast: 0.9,
    midwest: 0.95,
    southwest: 1.0,
    west_coast: 1.25,
    canada: 0.85, // USD equivalent
  };
  
  const baseRate = {
    basic: 85,
    standard: 115,
    premium: 155,
    specialty: 200,
  }[serviceLevel] || 115;
  
  const multiplier = regionalMultipliers[region] || 1.0;
  const averageRate = Math.round(baseRate * multiplier);
  
  return {
    averageRate,
    range: {
      low: Math.round(averageRate * 0.8),
      high: Math.round(averageRate * 1.2),
    },
    percentile25: Math.round(averageRate * 0.9),
    percentile75: Math.round(averageRate * 1.1),
  };
}

function getRegionalPosition(variance: number) {
  if (variance > 20) return 'Top Quartile';
  if (variance > 10) return 'Above Average';
  if (variance > -10) return 'Average';
  if (variance > -20) return 'Below Average';
  return 'Bottom Quartile';
}

function getMarketCharacteristics(region: string) {
  const characteristics = {
    northeast: {
      competitionLevel: 'High',
      demandLevel: 'High',
      priceElasticity: 'Low',
      keyFactors: ['High cost of living', 'Dense manufacturing', 'Quality focus'],
    },
    southeast: {
      competitionLevel: 'Medium',
      demandLevel: 'Medium',
      priceElasticity: 'Medium',
      keyFactors: ['Growing manufacturing', 'Cost competitive', 'Automotive focus'],
    },
    midwest: {
      competitionLevel: 'Medium',
      demandLevel: 'High',
      priceElasticity: 'High',
      keyFactors: ['Manufacturing hub', 'Price sensitive', 'Volume focus'],
    },
    southwest: {
      competitionLevel: 'Medium',
      demandLevel: 'Medium',
      priceElasticity: 'Medium',
      keyFactors: ['Aerospace industry', 'Energy sector', 'Growing market'],
    },
    west_coast: {
      competitionLevel: 'High',
      demandLevel: 'High',
      priceElasticity: 'Low',
      keyFactors: ['Tech industry', 'High wages', 'Innovation focus'],
    },
    canada: {
      competitionLevel: 'Medium',
      demandLevel: 'Medium',
      priceElasticity: 'Medium',
      keyFactors: ['Resource industries', 'Currency effects', 'Regulatory differences'],
    },
  };
  
  return characteristics[region] || characteristics.midwest;
}

function getCostOfLivingIndex(region: string) {
  const indices = {
    northeast: 115,
    southeast: 92,
    midwest: 95,
    southwest: 98,
    west_coast: 125,
    canada: 88,
  };
  
  return indices[region] || 100;
}

function generatePricingRecommendations(
  benchmarkComparison: any,
  regionalAnalysis: any,
  inputs: any
) {
  const recommendations = [];
  
  // Hourly rate recommendations
  const rateVariance = benchmarkComparison.variances.hourlyRate;
  if (rateVariance < -15) {
    recommendations.push({
      category: 'Hourly Rate',
      priority: 'High',
      recommendation: 'Increase hourly rate to market level',
      currentValue: `$${inputs.yourHourlyRate}/hour`,
      suggestedValue: `$${benchmarkComparison.benchmarks.hourlyRate}/hour`,
      rationale: 'Currently priced significantly below market',
      expectedImpact: `${Math.abs(rateVariance)}% revenue increase potential`,
    });
  } else if (rateVariance > 20) {
    recommendations.push({
      category: 'Hourly Rate',
      priority: 'Medium',
      recommendation: 'Consider rate justification or reduction',
      currentValue: `$${inputs.yourHourlyRate}/hour`,
      suggestedValue: `$${benchmarkComparison.benchmarks.hourlyRate}/hour`,
      rationale: 'Premium pricing requires strong value proposition',
      expectedImpact: 'May limit market accessibility',
    });
  }
  
  // Material markup recommendations
  const markupVariance = benchmarkComparison.variances.materialMarkup;
  if (markupVariance < -25) {
    recommendations.push({
      category: 'Material Markup',
      priority: 'Medium',
      recommendation: 'Increase material markup',
      currentValue: `${inputs.materialMarkup}%`,
      suggestedValue: `${benchmarkComparison.benchmarks.materialMarkup}%`,
      rationale: 'Low markup may not cover material handling costs',
      expectedImpact: 'Improved material profitability',
    });
  }
  
  // Setup fee recommendations
  const setupVariance = benchmarkComparison.variances.setupFee;
  if (setupVariance < -30) {
    recommendations.push({
      category: 'Setup Fee',
      priority: 'Medium',
      recommendation: 'Increase setup fee',
      currentValue: `$${inputs.setupFee}`,
      suggestedValue: `$${benchmarkComparison.benchmarks.setupFee}`,
      rationale: 'Setup fee should cover changeover costs',
      expectedImpact: 'Better coverage of setup costs',
    });
  }
  
  // Regional recommendations
  if (regionalAnalysis.variance < -20) {
    recommendations.push({
      category: 'Regional Positioning',
      priority: 'High',
      recommendation: 'Align pricing with regional market',
      currentValue: `$${inputs.yourHourlyRate}/hour`,
      suggestedValue: `$${regionalAnalysis.regionalBenchmarks.averageRate}/hour`,
      rationale: `Pricing below ${regionalAnalysis.region} market standards`,
      expectedImpact: 'Improved regional competitiveness',
    });
  }
  
  // Competitive position recommendations
  if (inputs.competitivePosition === 'premium' && benchmarkComparison.overallPosition !== 'Above Market') {
    recommendations.push({
      category: 'Competitive Alignment',
      priority: 'High',
      recommendation: 'Align pricing with premium positioning',
      currentValue: benchmarkComparison.overallPosition,
      suggestedValue: 'Above Market',
      rationale: 'Premium positioning requires premium pricing',
      expectedImpact: 'Consistent brand positioning',
    });
  }
  
  return recommendations.sort((a, b) => {
    const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
}

function analyzeCompetitivePricing(
  benchmarkComparison: any,
  competitivePosition: string,
  inputs: any
) {
  const competitiveGaps = identifyCompetitiveGaps(benchmarkComparison, competitivePosition);
  const pricingStrategy = determinePricingStrategy(competitivePosition, benchmarkComparison);
  const marketOpportunities = identifyMarketOpportunities(benchmarkComparison, inputs);
  
  return {
    currentPosition: benchmarkComparison.overallPosition,
    targetPosition: competitivePosition,
    competitiveGaps,
    pricingStrategy,
    marketOpportunities,
    competitiveThreats: identifyCompetitiveThreats(benchmarkComparison, inputs),
    strategicOptions: generateStrategicOptions(benchmarkComparison, competitivePosition),
  };
}

function identifyCompetitiveGaps(benchmarkComparison: any, targetPosition: string) {
  const gaps = [];
  const currentIndex = benchmarkComparison.competitiveIndex.score;
  
  const targetIndices = {
    premium: 120,
    above_average: 110,
    average: 100,
    below_average: 90,
    discount: 80,
  };
  
  const targetIndex = targetIndices[targetPosition] || 100;
  const gap = targetIndex - currentIndex;
  
  if (Math.abs(gap) > 10) {
    gaps.push({
      area: 'Overall Pricing',
      gap: gap > 0 ? 'Under-priced' : 'Over-priced',
      magnitude: Math.abs(gap),
      recommendation: gap > 0 ? 'Increase pricing' : 'Reduce pricing or improve value',
    });
  }
  
  // Specific component gaps
  Object.entries(benchmarkComparison.variances).forEach(([component, variance]) => {
    if (Math.abs(variance) > 20) {
      gaps.push({
        area: component,
        gap: variance > 0 ? 'Above market' : 'Below market',
        magnitude: Math.abs(variance),
        recommendation: getComponentRecommendation(component, variance),
      });
    }
  });
  
  return gaps;
}

function getComponentRecommendation(component: string, variance: number) {
  const recommendations = {
    hourlyRate: variance > 0 ? 'Justify premium rate with value' : 'Increase rate to market level',
    materialMarkup: variance > 0 ? 'Review markup competitiveness' : 'Increase markup for profitability',
    setupFee: variance > 0 ? 'Consider setup fee reduction' : 'Increase setup fee to cover costs',
  };
  
  return recommendations[component] || 'Align with market standards';
}

function determinePricingStrategy(competitivePosition: string, benchmarkComparison: any) {
  const strategies = {
    premium: {
      strategy: 'Value-Based Premium Pricing',
      focus: 'Differentiation and superior value delivery',
      keyActions: ['Emphasize quality', 'Highlight expertise', 'Premium service'],
    },
    above_average: {
      strategy: 'Competitive Differentiation',
      focus: 'Balance value and competitive pricing',
      keyActions: ['Service excellence', 'Reliability focus', 'Selective premium'],
    },
    average: {
      strategy: 'Market Following',
      focus: 'Match market standards with efficiency',
      keyActions: ['Operational efficiency', 'Standard service', 'Market alignment'],
    },
    below_average: {
      strategy: 'Cost Leadership',
      focus: 'Efficiency and volume-based pricing',
      keyActions: ['Cost optimization', 'Volume focus', 'Efficiency gains'],
    },
    discount: {
      strategy: 'Low-Cost Provider',
      focus: 'Maximum efficiency and cost control',
      keyActions: ['Lean operations', 'High volume', 'Cost minimization'],
    },
  };
  
  return strategies[competitivePosition] || strategies.average;
}

function identifyMarketOpportunities(benchmarkComparison: any, inputs: any) {
  const opportunities = [];
  
  // Under-pricing opportunity
  if (benchmarkComparison.overallPosition === 'Below Market') {
    opportunities.push({
      opportunity: 'Price Increase Potential',
      description: 'Current pricing below market allows for increases',
      potential: 'High',
      action: 'Gradual price increases with value communication',
    });
  }
  
  // Premium positioning opportunity
  if (inputs.serviceLevel === 'premium' && benchmarkComparison.competitiveIndex.score < 110) {
    opportunities.push({
      opportunity: 'Premium Market Entry',
      description: 'Premium service level supports higher pricing',
      potential: 'Medium',
      action: 'Develop premium value proposition',
    });
  }
  
  // Market segment opportunity
  if (inputs.targetMarket === 'aerospace' || inputs.targetMarket === 'medical') {
    opportunities.push({
      opportunity: 'High-Value Market Focus',
      description: 'Target market supports premium pricing',
      potential: 'High',
      action: 'Emphasize specialized capabilities',
    });
  }
  
  return opportunities;
}

function identifyCompetitiveThreats(benchmarkComparison: any, inputs: any) {
  const threats = [];
  
  // Over-pricing threat
  if (benchmarkComparison.overallPosition === 'Above Market' && inputs.competitivePosition !== 'premium') {
    threats.push({
      threat: 'Price Competition',
      severity: 'High',
      description: 'Higher pricing may attract competitive pressure',
      mitigation: 'Strengthen value proposition or adjust pricing',
    });
  }
  
  // Discount competition threat
  if (benchmarkComparison.competitiveIndex.score > 110) {
    threats.push({
      threat: 'Discount Competitors',
      severity: 'Medium',
      description: 'Premium pricing vulnerable to low-cost competitors',
      mitigation: 'Focus on differentiation and customer loyalty',
    });
  }
  
  return threats;
}

function generateStrategicOptions(benchmarkComparison: any, competitivePosition: string) {
  const options = [];
  
  // Pricing adjustment options
  const currentIndex = benchmarkComparison.competitiveIndex.score;
  
  if (currentIndex < 95) {
    options.push({
      option: 'Price Increase Strategy',
      description: 'Gradually increase prices to market level',
      pros: ['Improved profitability', 'Market alignment'],
      cons: ['Potential customer loss', 'Competitive response'],
      timeline: '3-6 months',
    });
  }
  
  if (currentIndex > 115) {
    options.push({
      option: 'Value Enhancement Strategy',
      description: 'Improve value proposition to justify premium pricing',
      pros: ['Maintain pricing', 'Strengthen position'],
      cons: ['Investment required', 'Time to implement'],
      timeline: '6-12 months',
    });
  }
  
  // Market positioning options
  options.push({
    option: 'Market Segmentation Strategy',
    description: 'Target specific segments with tailored pricing',
    pros: ['Optimized pricing', 'Reduced competition'],
    cons: ['Complex management', 'Market education needed'],
    timeline: '3-9 months',
  });
  
  return options;
}

export default pricingBenchmarksConfig;
