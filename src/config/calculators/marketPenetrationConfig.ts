import { CalculatorConfig } from '../../types/calculator';

export const marketPenetrationConfig: CalculatorConfig = {
  id: 'market-penetration',
  name: 'Market Penetration Analyzer',
  description: 'Analyze market penetration opportunities and develop strategies to capture larger market share in target segments.',
  category: 'customer-acquisition',
  difficulty: 'advanced',
  estimatedTime: '5-6 minutes',
  
  inputs: [
    {
      id: 'totalMarketSize',
      label: 'Total Addressable Market (TAM)',
      type: 'number',
      value: 50000000,
      unit: 'USD',
      min: 1000000,
      max: 1000000000,
      step: 1000000,
      required: true,
      description: 'Total market size for laser cutting services in your region',
    },
    {
      id: 'currentRevenue',
      label: 'Current Annual Revenue',
      type: 'number',
      value: 2500000,
      unit: 'USD',
      min: 100000,
      max: 100000000,
      step: 100000,
      required: true,
      description: 'Your current annual revenue',
    },
    {
      id: 'targetSegment',
      label: 'Primary Target Segment',
      type: 'select',
      value: 'manufacturing',
      options: [
        { value: 'manufacturing', label: 'General Manufacturing' },
        { value: 'automotive', label: 'Automotive' },
        { value: 'aerospace', label: 'Aerospace' },
        { value: 'electronics', label: 'Electronics' },
        { value: 'medical', label: 'Medical Devices' },
        { value: 'construction', label: 'Construction' },
        { value: 'prototyping', label: 'Prototyping/R&D' },
      ],
      required: true,
      description: 'Primary market segment you serve',
    },
    {
      id: 'competitorCount',
      label: 'Number of Direct Competitors',
      type: 'number',
      value: 8,
      min: 1,
      max: 50,
      step: 1,
      required: true,
      description: 'Number of direct competitors in your market',
    },
    {
      id: 'marketGrowthRate',
      label: 'Market Growth Rate',
      type: 'number',
      value: 8,
      unit: '%/year',
      min: -10,
      max: 30,
      step: 1,
      required: true,
      description: 'Annual market growth rate',
    },
    {
      id: 'customerAcquisitionRate',
      label: 'Monthly New Customer Rate',
      type: 'number',
      value: 5,
      unit: 'customers',
      min: 1,
      max: 100,
      step: 1,
      required: true,
      description: 'Number of new customers acquired per month',
    },
    {
      id: 'averageCustomerValue',
      label: 'Average Customer Annual Value',
      type: 'number',
      value: 25000,
      unit: 'USD',
      min: 1000,
      max: 500000,
      step: 1000,
      required: true,
      description: 'Average annual revenue per customer',
    },
    {
      id: 'geographicReach',
      label: 'Geographic Reach',
      type: 'select',
      value: 'regional',
      options: [
        { value: 'local', label: 'Local (50 mile radius)' },
        { value: 'regional', label: 'Regional (200 mile radius)' },
        { value: 'state', label: 'State-wide' },
        { value: 'multi_state', label: 'Multi-state' },
        { value: 'national', label: 'National' },
      ],
      required: true,
      description: 'Current geographic market reach',
    },
  ],

  outputs: [
    {
      id: 'penetrationAnalysis',
      label: 'Market Penetration Analysis',
      type: 'object',
      format: 'penetration-metrics',
      description: 'Current market penetration and positioning',
    },
    {
      id: 'growthOpportunities',
      label: 'Growth Opportunities',
      type: 'array',
      format: 'opportunity-list',
      description: 'Identified opportunities for market expansion',
    },
    {
      id: 'competitiveAnalysis',
      label: 'Competitive Analysis',
      type: 'object',
      format: 'competitive-landscape',
      description: 'Analysis of competitive positioning',
    },
    {
      id: 'penetrationStrategy',
      label: 'Penetration Strategy',
      type: 'object',
      format: 'strategy-roadmap',
      description: 'Strategic roadmap for market penetration',
    },
  ],

  calculate: (inputs: Record<string, any>) => {
    const {
      totalMarketSize,
      currentRevenue,
      targetSegment,
      competitorCount,
      marketGrowthRate,
      customerAcquisitionRate,
      averageCustomerValue,
      geographicReach,
    } = inputs;

    // Calculate penetration analysis
    const penetrationAnalysis = calculatePenetrationAnalysis(
      totalMarketSize,
      currentRevenue,
      targetSegment,
      competitorCount,
      geographicReach
    );

    // Identify growth opportunities
    const growthOpportunities = identifyGrowthOpportunities(
      penetrationAnalysis,
      inputs
    );

    // Analyze competitive landscape
    const competitiveAnalysis = analyzeCompetitiveLandscape(
      penetrationAnalysis,
      competitorCount,
      targetSegment
    );

    // Develop penetration strategy
    const penetrationStrategy = developPenetrationStrategy(
      penetrationAnalysis,
      growthOpportunities,
      inputs
    );

    return {
      penetrationAnalysis,
      growthOpportunities,
      competitiveAnalysis,
      penetrationStrategy,
    };
  },

  validation: {
    totalMarketSize: {
      min: 1000000,
      max: 1000000000,
      message: 'Market size must be between $1M and $1B',
    },
    currentRevenue: {
      min: 100000,
      max: 100000000,
      message: 'Revenue must be between $100K and $100M',
    },
    competitorCount: {
      min: 1,
      max: 50,
      message: 'Competitor count must be between 1 and 50',
    },
  },

  examples: [
    {
      name: 'Regional Manufacturing Focus',
      description: 'Regional player in general manufacturing market',
      inputs: {
        totalMarketSize: 75000000,
        currentRevenue: 3500000,
        targetSegment: 'manufacturing',
        competitorCount: 12,
        marketGrowthRate: 6,
        customerAcquisitionRate: 8,
        averageCustomerValue: 30000,
        geographicReach: 'regional',
      },
    },
    {
      name: 'Specialized Aerospace Niche',
      description: 'Specialized player in aerospace market',
      inputs: {
        totalMarketSize: 25000000,
        currentRevenue: 5000000,
        targetSegment: 'aerospace',
        competitorCount: 4,
        marketGrowthRate: 12,
        customerAcquisitionRate: 3,
        averageCustomerValue: 75000,
        geographicReach: 'multi_state',
      },
    },
  ],

  tags: ['market-penetration', 'growth', 'strategy', 'competitive', 'expansion'],
  
  relatedCalculators: [
    'customer-lifetime-value',
    'lead-qualification',
    'sales-forecasting',
    'competitive-pricing',
  ],

  learningResources: [
    {
      title: 'Market Penetration Strategies',
      type: 'article',
      url: '/learn/market-penetration',
    },
    {
      title: 'Competitive Analysis Framework',
      type: 'video',
      url: '/learn/competitive-analysis',
    },
  ],
};

// Helper functions
function calculatePenetrationAnalysis(
  totalMarketSize: number,
  currentRevenue: number,
  targetSegment: string,
  competitorCount: number,
  geographicReach: string
) {
  // Calculate basic penetration metrics
  const marketShare = (currentRevenue / totalMarketSize) * 100;
  
  // Estimate serviceable addressable market based on segment and geography
  const segmentMultipliers = {
    manufacturing: 0.4,
    automotive: 0.15,
    aerospace: 0.08,
    electronics: 0.12,
    medical: 0.1,
    construction: 0.1,
    prototyping: 0.05,
  };
  
  const geographicMultipliers = {
    local: 0.05,
    regional: 0.15,
    state: 0.3,
    multi_state: 0.6,
    national: 1.0,
  };
  
  const segmentMultiplier = segmentMultipliers[targetSegment] || 0.2;
  const geoMultiplier = geographicMultipliers[geographicReach] || 0.15;
  
  const serviceableMarket = totalMarketSize * segmentMultiplier * geoMultiplier;
  const serviceableMarketShare = (currentRevenue / serviceableMarket) * 100;
  
  // Calculate competitive metrics
  const averageCompetitorShare = (100 - serviceableMarketShare) / competitorCount;
  const marketPosition = calculateMarketPosition(serviceableMarketShare, competitorCount);
  
  return {
    totalMarketSize: Math.round(totalMarketSize),
    serviceableMarket: Math.round(serviceableMarket),
    currentRevenue: Math.round(currentRevenue),
    marketShare: Math.round(marketShare * 100) / 100,
    serviceableMarketShare: Math.round(serviceableMarketShare * 100) / 100,
    averageCompetitorShare: Math.round(averageCompetitorShare * 100) / 100,
    marketPosition,
    penetrationLevel: getPenetrationLevel(serviceableMarketShare),
    growthPotential: calculateGrowthPotential(serviceableMarketShare, targetSegment),
  };
}

function calculateMarketPosition(marketShare: number, competitorCount: number) {
  if (marketShare > 100 / competitorCount * 2) return 'Market Leader';
  if (marketShare > 100 / competitorCount * 1.5) return 'Strong Player';
  if (marketShare > 100 / competitorCount) return 'Average Player';
  return 'Niche Player';
}

function getPenetrationLevel(marketShare: number) {
  if (marketShare < 5) return 'Low Penetration';
  if (marketShare < 15) return 'Moderate Penetration';
  if (marketShare < 30) return 'High Penetration';
  return 'Dominant Position';
}

function calculateGrowthPotential(marketShare: number, segment: string) {
  const segmentGrowthPotentials = {
    manufacturing: 'High',
    automotive: 'Medium',
    aerospace: 'High',
    electronics: 'High',
    medical: 'Very High',
    construction: 'Medium',
    prototyping: 'High',
  };
  
  const basePotential = segmentGrowthPotentials[segment] || 'Medium';
  
  // Adjust based on current penetration
  if (marketShare > 30) return 'Limited';
  if (marketShare > 20) return 'Moderate';
  
  return basePotential;
}

function identifyGrowthOpportunities(penetrationAnalysis: any, inputs: any) {
  const opportunities = [];
  
  // Geographic expansion
  if (inputs.geographicReach !== 'national') {
    opportunities.push({
      opportunity: 'Geographic Expansion',
      type: 'Market Expansion',
      description: 'Expand to new geographic markets',
      potential: calculateGeographicPotential(inputs.geographicReach, inputs.totalMarketSize),
      difficulty: 'Medium',
      timeframe: '6-18 months',
      investment: 'Medium',
      actions: [
        'Market research in target regions',
        'Establish local partnerships',
        'Develop logistics capabilities',
      ],
    });
  }
  
  // Market share growth
  if (penetrationAnalysis.serviceableMarketShare < 20) {
    opportunities.push({
      opportunity: 'Market Share Growth',
      type: 'Competitive Gain',
      description: 'Capture market share from competitors',
      potential: calculateMarketSharePotential(penetrationAnalysis),
      difficulty: 'High',
      timeframe: '12-24 months',
      investment: 'High',
      actions: [
        'Competitive pricing strategy',
        'Service differentiation',
        'Customer acquisition campaigns',
      ],
    });
  }
  
  // Segment diversification
  opportunities.push({
    opportunity: 'Segment Diversification',
    type: 'Market Development',
    description: 'Enter adjacent market segments',
    potential: calculateSegmentPotential(inputs.targetSegment, inputs.totalMarketSize),
    difficulty: 'Medium',
    timeframe: '6-12 months',
    investment: 'Medium',
    actions: [
      'Capability assessment',
      'Segment-specific marketing',
      'Partnership development',
    ],
  });
  
  // Customer penetration
  if (inputs.averageCustomerValue < 50000) {
    opportunities.push({
      opportunity: 'Customer Value Expansion',
      type: 'Account Growth',
      description: 'Increase value per customer through upselling',
      potential: Math.round(inputs.currentRevenue * 0.3),
      difficulty: 'Low',
      timeframe: '3-6 months',
      investment: 'Low',
      actions: [
        'Value-added services',
        'Account management program',
        'Cross-selling initiatives',
      ],
    });
  }
  
  // Digital transformation
  opportunities.push({
    opportunity: 'Digital Market Penetration',
    type: 'Channel Development',
    description: 'Leverage digital channels for market reach',
    potential: Math.round(inputs.currentRevenue * 0.25),
    difficulty: 'Medium',
    timeframe: '3-9 months',
    investment: 'Medium',
    actions: [
      'Online platform development',
      'Digital marketing campaigns',
      'E-commerce capabilities',
    ],
  });
  
  return opportunities.sort((a, b) => b.potential - a.potential).slice(0, 4);
}

function calculateGeographicPotential(currentReach: string, totalMarket: number) {
  const expansionMultipliers = {
    local: 3.0,
    regional: 2.0,
    state: 1.5,
    multi_state: 1.3,
    national: 1.0,
  };
  
  const multiplier = expansionMultipliers[currentReach] || 1.5;
  return Math.round(totalMarket * 0.1 * (multiplier - 1));
}

function calculateMarketSharePotential(penetrationAnalysis: any) {
  const currentShare = penetrationAnalysis.serviceableMarketShare;
  const targetShare = Math.min(currentShare * 2, 25); // Double share or 25%, whichever is lower
  const shareGain = targetShare - currentShare;
  
  return Math.round((shareGain / 100) * penetrationAnalysis.serviceableMarket);
}

function calculateSegmentPotential(currentSegment: string, totalMarket: number) {
  // Estimate potential from adjacent segments
  const adjacentSegments = {
    manufacturing: ['automotive', 'electronics'],
    automotive: ['manufacturing', 'aerospace'],
    aerospace: ['automotive', 'medical'],
    electronics: ['manufacturing', 'medical'],
    medical: ['electronics', 'aerospace'],
    construction: ['manufacturing'],
    prototyping: ['manufacturing', 'electronics'],
  };
  
  const adjacent = adjacentSegments[currentSegment] || ['manufacturing'];
  return Math.round(totalMarket * 0.05 * adjacent.length);
}

function analyzeCompetitiveLandscape(penetrationAnalysis: any, competitorCount: number, segment: string) {
  const competitiveIntensity = calculateCompetitiveIntensity(competitorCount, segment);
  const marketConcentration = calculateMarketConcentration(penetrationAnalysis.serviceableMarketShare, competitorCount);
  
  return {
    competitorCount,
    competitiveIntensity,
    marketConcentration,
    yourPosition: penetrationAnalysis.marketPosition,
    averageCompetitorSize: Math.round(penetrationAnalysis.serviceableMarket / competitorCount),
    competitiveAdvantages: identifyCompetitiveAdvantages(penetrationAnalysis),
    threats: identifyCompetitiveThreats(competitiveIntensity, marketConcentration),
    opportunities: identifyCompetitiveOpportunities(penetrationAnalysis, competitorCount),
  };
}

function calculateCompetitiveIntensity(competitorCount: number, segment: string) {
  let intensity = 'Medium';
  
  if (competitorCount > 15) intensity = 'Very High';
  else if (competitorCount > 10) intensity = 'High';
  else if (competitorCount > 5) intensity = 'Medium';
  else intensity = 'Low';
  
  // Adjust for segment characteristics
  const highCompetitionSegments = ['manufacturing', 'construction'];
  if (highCompetitionSegments.includes(segment) && intensity !== 'Very High') {
    const levels = ['Low', 'Medium', 'High', 'Very High'];
    const currentIndex = levels.indexOf(intensity);
    intensity = levels[Math.min(currentIndex + 1, 3)];
  }
  
  return intensity;
}

function calculateMarketConcentration(yourShare: number, competitorCount: number) {
  const averageShare = (100 - yourShare) / competitorCount;
  
  if (averageShare > 15) return 'Highly Concentrated';
  if (averageShare > 8) return 'Moderately Concentrated';
  return 'Fragmented';
}

function identifyCompetitiveAdvantages(penetrationAnalysis: any) {
  const advantages = [];
  
  if (penetrationAnalysis.marketPosition === 'Market Leader') {
    advantages.push('Market leadership position');
    advantages.push('Brand recognition');
  }
  
  if (penetrationAnalysis.serviceableMarketShare > 15) {
    advantages.push('Significant market presence');
    advantages.push('Economies of scale');
  }
  
  advantages.push('Established customer base');
  advantages.push('Operational experience');
  
  return advantages;
}

function identifyCompetitiveThreats(intensity: string, concentration: string) {
  const threats = [];
  
  if (intensity === 'Very High' || intensity === 'High') {
    threats.push('Intense price competition');
    threats.push('Customer acquisition challenges');
  }
  
  if (concentration === 'Highly Concentrated') {
    threats.push('Dominant competitors');
    threats.push('Barriers to growth');
  }
  
  threats.push('New market entrants');
  threats.push('Technology disruption');
  
  return threats;
}

function identifyCompetitiveOpportunities(penetrationAnalysis: any, competitorCount: number) {
  const opportunities = [];
  
  if (penetrationAnalysis.serviceableMarketShare < 10) {
    opportunities.push('Market share consolidation');
  }
  
  if (competitorCount > 10) {
    opportunities.push('Acquisition opportunities');
    opportunities.push('Partnership potential');
  }
  
  opportunities.push('Service differentiation');
  opportunities.push('Niche specialization');
  
  return opportunities;
}

function developPenetrationStrategy(penetrationAnalysis: any, opportunities: any[], inputs: any) {
  const strategy = {
    primaryFocus: determinePrimaryFocus(penetrationAnalysis, opportunities),
    phases: generateStrategyPhases(opportunities, inputs),
    keyMetrics: defineKeyMetrics(penetrationAnalysis, inputs),
    resourceRequirements: calculateResourceRequirements(opportunities),
    riskMitigation: identifyRiskMitigation(penetrationAnalysis),
  };
  
  return strategy;
}

function determinePrimaryFocus(penetrationAnalysis: any, opportunities: any[]) {
  const topOpportunity = opportunities[0];
  
  if (penetrationAnalysis.serviceableMarketShare < 5) {
    return 'Market Share Growth';
  }
  
  if (topOpportunity?.type === 'Market Expansion') {
    return 'Geographic Expansion';
  }
  
  return 'Market Development';
}

function generateStrategyPhases(opportunities: any[], inputs: any) {
  const phases = [];
  
  // Phase 1: Foundation (0-6 months)
  phases.push({
    phase: 1,
    name: 'Foundation Building',
    duration: '0-6 months',
    objectives: [
      'Strengthen core operations',
      'Improve customer satisfaction',
      'Build competitive advantages',
    ],
    keyActions: [
      'Operational excellence program',
      'Customer feedback system',
      'Competitive analysis',
    ],
  });
  
  // Phase 2: Growth (6-18 months)
  const primaryOpportunity = opportunities[0];
  phases.push({
    phase: 2,
    name: 'Market Penetration',
    duration: '6-18 months',
    objectives: [
      `Execute ${primaryOpportunity?.opportunity || 'growth strategy'}`,
      'Increase market share',
      'Expand customer base',
    ],
    keyActions: primaryOpportunity?.actions || [
      'Market expansion',
      'Customer acquisition',
      'Service enhancement',
    ],
  });
  
  // Phase 3: Scale (18+ months)
  phases.push({
    phase: 3,
    name: 'Market Leadership',
    duration: '18+ months',
    objectives: [
      'Achieve market leadership',
      'Diversify revenue streams',
      'Build sustainable advantages',
    ],
    keyActions: [
      'Strategic partnerships',
      'Innovation initiatives',
      'Market consolidation',
    ],
  });
  
  return phases;
}

function defineKeyMetrics(penetrationAnalysis: any, inputs: any) {
  return [
    {
      metric: 'Market Share',
      current: `${penetrationAnalysis.serviceableMarketShare}%`,
      target: `${Math.min(penetrationAnalysis.serviceableMarketShare * 2, 25)}%`,
      timeframe: '18 months',
    },
    {
      metric: 'Revenue Growth',
      current: `$${Math.round(inputs.currentRevenue / 1000)}K`,
      target: `$${Math.round(inputs.currentRevenue * 1.5 / 1000)}K`,
      timeframe: '24 months',
    },
    {
      metric: 'Customer Acquisition',
      current: `${inputs.customerAcquisitionRate}/month`,
      target: `${Math.round(inputs.customerAcquisitionRate * 1.5)}/month`,
      timeframe: '12 months',
    },
    {
      metric: 'Geographic Reach',
      current: inputs.geographicReach,
      target: getNextGeographicLevel(inputs.geographicReach),
      timeframe: '18 months',
    },
  ];
}

function getNextGeographicLevel(current: string) {
  const progression = {
    local: 'regional',
    regional: 'state',
    state: 'multi_state',
    multi_state: 'national',
    national: 'international',
  };
  return progression[current] || 'expanded';
}

function calculateResourceRequirements(opportunities: any[]) {
  const totalInvestment = opportunities.reduce((sum, opp) => {
    const investmentLevels = { Low: 50000, Medium: 150000, High: 400000 };
    return sum + (investmentLevels[opp.investment] || 100000);
  }, 0);
  
  return {
    totalInvestment: Math.round(totalInvestment),
    breakdown: {
      marketing: Math.round(totalInvestment * 0.4),
      operations: Math.round(totalInvestment * 0.3),
      technology: Math.round(totalInvestment * 0.2),
      personnel: Math.round(totalInvestment * 0.1),
    },
    paybackPeriod: '12-24 months',
    expectedROI: '150-300%',
  };
}

function identifyRiskMitigation(penetrationAnalysis: any) {
  return [
    {
      risk: 'Competitive Response',
      mitigation: 'Differentiate through service quality and specialization',
    },
    {
      risk: 'Market Saturation',
      mitigation: 'Diversify into adjacent segments and geographies',
    },
    {
      risk: 'Economic Downturn',
      mitigation: 'Focus on recession-resistant segments like medical',
    },
    {
      risk: 'Technology Disruption',
      mitigation: 'Invest in technology upgrades and innovation',
    },
  ];
}

export default marketPenetrationConfig;
