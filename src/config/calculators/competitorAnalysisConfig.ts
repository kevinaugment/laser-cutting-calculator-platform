import { CalculatorConfig } from '../../types/calculator';

export const competitorAnalysisConfig: CalculatorConfig = {
  id: 'competitor-analysis',
  name: 'Competitor Analysis Calculator',
  description: 'Analyze competitive landscape and develop strategies to gain competitive advantage in the laser cutting market.',
  category: 'market-analysis',
  difficulty: 'advanced',
  estimatedTime: '6-7 minutes',
  
  inputs: [
    {
      id: 'numberOfCompetitors',
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
      id: 'yourMarketShare',
      label: 'Your Market Share',
      type: 'number',
      value: 15,
      unit: '%',
      min: 1,
      max: 80,
      step: 1,
      required: true,
      description: 'Your estimated market share',
    },
    {
      id: 'largestCompetitorShare',
      label: 'Largest Competitor Share',
      type: 'number',
      value: 25,
      unit: '%',
      min: 5,
      max: 80,
      step: 1,
      required: true,
      description: 'Market share of largest competitor',
    },
    {
      id: 'yourPricing',
      label: 'Your Average Pricing',
      type: 'select',
      value: 'market_average',
      options: [
        { value: 'premium', label: 'Premium (20%+ above market)' },
        { value: 'above_average', label: 'Above Average (10-20% above)' },
        { value: 'market_average', label: 'Market Average' },
        { value: 'below_average', label: 'Below Average (10-20% below)' },
        { value: 'discount', label: 'Discount (20%+ below market)' },
      ],
      required: true,
      description: 'Your pricing position relative to market',
    },
    {
      id: 'serviceQuality',
      label: 'Your Service Quality',
      type: 'select',
      value: 'good',
      options: [
        { value: 'excellent', label: 'Excellent (Industry leading)' },
        { value: 'good', label: 'Good (Above average)' },
        { value: 'average', label: 'Average (Market standard)' },
        { value: 'below_average', label: 'Below Average' },
      ],
      required: true,
      description: 'Your service quality relative to competitors',
    },
    {
      id: 'technologyLevel',
      label: 'Your Technology Level',
      type: 'select',
      value: 'modern',
      options: [
        { value: 'cutting_edge', label: 'Cutting Edge (Latest technology)' },
        { value: 'modern', label: 'Modern (Current generation)' },
        { value: 'standard', label: 'Standard (Previous generation)' },
        { value: 'outdated', label: 'Outdated (Multiple generations behind)' },
      ],
      required: true,
      description: 'Your technology level compared to market',
    },
    {
      id: 'customerSatisfaction',
      label: 'Customer Satisfaction Score',
      type: 'number',
      value: 8.2,
      unit: '/10',
      min: 1,
      max: 10,
      step: 0.1,
      required: true,
      description: 'Your customer satisfaction rating out of 10',
    },
    {
      id: 'competitiveAdvantages',
      label: 'Primary Competitive Advantage',
      type: 'select',
      value: 'quality',
      options: [
        { value: 'price', label: 'Price Leadership' },
        { value: 'quality', label: 'Quality Excellence' },
        { value: 'speed', label: 'Speed/Delivery' },
        { value: 'service', label: 'Customer Service' },
        { value: 'technology', label: 'Technology Innovation' },
        { value: 'specialization', label: 'Market Specialization' },
      ],
      required: true,
      description: 'Your primary competitive advantage',
    },
  ],

  outputs: [
    {
      id: 'competitivePosition',
      label: 'Competitive Position',
      type: 'object',
      format: 'position-analysis',
      description: 'Analysis of your competitive position in the market',
    },
    {
      id: 'competitorProfiles',
      label: 'Competitor Profiles',
      type: 'array',
      format: 'competitor-segments',
      description: 'Analysis of different competitor segments',
    },
    {
      id: 'strategicRecommendations',
      label: 'Strategic Recommendations',
      type: 'array',
      format: 'strategy-actions',
      description: 'Strategic recommendations to improve competitive position',
    },
    {
      id: 'competitiveThreats',
      label: 'Competitive Threats & Opportunities',
      type: 'object',
      format: 'threats-opportunities',
      description: 'Analysis of competitive threats and opportunities',
    },
  ],

  calculate: (inputs: Record<string, any>) => {
    const {
      numberOfCompetitors,
      yourMarketShare,
      largestCompetitorShare,
      yourPricing,
      serviceQuality,
      technologyLevel,
      customerSatisfaction,
      competitiveAdvantages,
    } = inputs;

    // Analyze competitive position
    const competitivePosition = analyzeCompetitivePosition(
      yourMarketShare,
      largestCompetitorShare,
      numberOfCompetitors,
      inputs
    );

    // Generate competitor profiles
    const competitorProfiles = generateCompetitorProfiles(
      numberOfCompetitors,
      yourMarketShare,
      largestCompetitorShare,
      inputs
    );

    // Develop strategic recommendations
    const strategicRecommendations = developStrategicRecommendations(
      competitivePosition,
      inputs
    );

    // Identify threats and opportunities
    const competitiveThreats = identifyThreatsAndOpportunities(
      competitivePosition,
      competitorProfiles,
      inputs
    );

    return {
      competitivePosition,
      competitorProfiles,
      strategicRecommendations,
      competitiveThreats,
    };
  },

  validation: {
    numberOfCompetitors: {
      min: 1,
      max: 50,
      message: 'Number of competitors must be between 1 and 50',
    },
    yourMarketShare: {
      min: 1,
      max: 80,
      message: 'Market share must be between 1% and 80%',
    },
    customerSatisfaction: {
      min: 1,
      max: 10,
      message: 'Customer satisfaction must be between 1 and 10',
    },
  },

  examples: [
    {
      name: 'Market Leader Position',
      description: 'Analysis for market leading position',
      inputs: {
        numberOfCompetitors: 12,
        yourMarketShare: 35,
        largestCompetitorShare: 20,
        yourPricing: 'above_average',
        serviceQuality: 'excellent',
        technologyLevel: 'cutting_edge',
        customerSatisfaction: 9.1,
        competitiveAdvantages: 'quality',
      },
    },
    {
      name: 'Challenger Position',
      description: 'Analysis for market challenger position',
      inputs: {
        numberOfCompetitors: 6,
        yourMarketShare: 18,
        largestCompetitorShare: 30,
        yourPricing: 'market_average',
        serviceQuality: 'good',
        technologyLevel: 'modern',
        customerSatisfaction: 7.8,
        competitiveAdvantages: 'speed',
      },
    },
  ],

  tags: ['competitor', 'analysis', 'strategy', 'market', 'positioning'],
  
  relatedCalculators: [
    'market-sizing',
    'pricing-benchmarks',
    'trend-analysis',
    'opportunity-assessment',
  ],

  learningResources: [
    {
      title: 'Competitive Analysis Framework',
      type: 'article',
      url: '/learn/competitive-analysis',
    },
    {
      title: 'Strategic Positioning',
      type: 'video',
      url: '/learn/strategic-positioning',
    },
  ],
};

// Helper functions
function analyzeCompetitivePosition(
  yourShare: number,
  largestShare: number,
  competitorCount: number,
  inputs: any
) {
  // Determine market position
  let position = 'Follower';
  if (yourShare >= largestShare) {
    position = 'Leader';
  } else if (yourShare >= largestShare * 0.7) {
    position = 'Challenger';
  } else if (yourShare >= (100 / competitorCount)) {
    position = 'Contender';
  }

  // Calculate competitive strength score
  const strengthScore = calculateCompetitiveStrength(inputs);
  
  // Analyze market concentration
  const marketConcentration = analyzeMarketConcentration(
    yourShare,
    largestShare,
    competitorCount
  );

  // Calculate competitive gaps
  const competitiveGaps = identifyCompetitiveGaps(inputs);

  return {
    marketPosition: position,
    marketShare: yourShare,
    shareGapToLeader: Math.max(0, largestShare - yourShare),
    competitiveStrength: strengthScore,
    marketConcentration,
    competitiveGaps,
    positioningStrategy: determinePositioningStrategy(position, strengthScore, inputs),
    competitiveAdvantages: assessCompetitiveAdvantages(inputs),
  };
}

function calculateCompetitiveStrength(inputs: any) {
  const scores = {
    pricing: getPricingScore(inputs.yourPricing),
    quality: getQualityScore(inputs.serviceQuality),
    technology: getTechnologyScore(inputs.technologyLevel),
    satisfaction: (inputs.customerSatisfaction / 10) * 100,
  };

  const weightedScore = (
    scores.pricing * 0.2 +
    scores.quality * 0.3 +
    scores.technology * 0.25 +
    scores.satisfaction * 0.25
  );

  return {
    overallScore: Math.round(weightedScore),
    categoryScores: scores,
    rating: getStrengthRating(weightedScore),
    strongestArea: Object.entries(scores).reduce((max, [key, value]) => 
      value > max.value ? { area: key, value } : max, 
      { area: '', value: 0 }
    ).area,
    weakestArea: Object.entries(scores).reduce((min, [key, value]) => 
      value < min.value ? { area: key, value } : min, 
      { area: '', value: 100 }
    ).area,
  };
}

function getPricingScore(pricing: string) {
  const scores = {
    premium: 60,      // High price can limit market but indicates value
    above_average: 75,
    market_average: 80,
    below_average: 85,
    discount: 70,     // Low price competitive but may indicate low value
  };
  return scores[pricing] || 80;
}

function getQualityScore(quality: string) {
  const scores = {
    excellent: 95,
    good: 80,
    average: 60,
    below_average: 40,
  };
  return scores[quality] || 60;
}

function getTechnologyScore(technology: string) {
  const scores = {
    cutting_edge: 95,
    modern: 80,
    standard: 60,
    outdated: 30,
  };
  return scores[technology] || 60;
}

function getStrengthRating(score: number) {
  if (score >= 85) return 'Very Strong';
  if (score >= 75) return 'Strong';
  if (score >= 65) return 'Moderate';
  if (score >= 50) return 'Weak';
  return 'Very Weak';
}

function analyzeMarketConcentration(yourShare: number, largestShare: number, competitorCount: number) {
  const averageShare = 100 / competitorCount;
  const herfindahlIndex = calculateHerfindahlIndex(yourShare, largestShare, competitorCount);
  
  let concentration = 'Fragmented';
  if (herfindahlIndex > 2500) concentration = 'Highly Concentrated';
  else if (herfindahlIndex > 1500) concentration = 'Moderately Concentrated';
  else if (herfindahlIndex > 1000) concentration = 'Low Concentration';

  return {
    level: concentration,
    herfindahlIndex,
    averageShare: Math.round(averageShare),
    topPlayerAdvantage: largestShare - averageShare,
    yourAdvantage: yourShare - averageShare,
  };
}

function calculateHerfindahlIndex(yourShare: number, largestShare: number, competitorCount: number) {
  // Simplified HHI calculation
  const remainingShare = 100 - yourShare - largestShare;
  const otherCompetitors = competitorCount - 2;
  const averageOtherShare = otherCompetitors > 0 ? remainingShare / otherCompetitors : 0;
  
  let hhi = Math.pow(yourShare, 2) + Math.pow(largestShare, 2);
  for (let i = 0; i < otherCompetitors; i++) {
    hhi += Math.pow(averageOtherShare, 2);
  }
  
  return Math.round(hhi);
}

function identifyCompetitiveGaps(inputs: any) {
  const gaps = [];
  
  if (inputs.yourPricing === 'premium' || inputs.yourPricing === 'above_average') {
    gaps.push({
      area: 'Price Competitiveness',
      severity: 'Medium',
      description: 'Higher pricing may limit market accessibility',
    });
  }
  
  if (inputs.serviceQuality === 'average' || inputs.serviceQuality === 'below_average') {
    gaps.push({
      area: 'Service Quality',
      severity: 'High',
      description: 'Service quality below competitive standards',
    });
  }
  
  if (inputs.technologyLevel === 'standard' || inputs.technologyLevel === 'outdated') {
    gaps.push({
      area: 'Technology',
      severity: inputs.technologyLevel === 'outdated' ? 'High' : 'Medium',
      description: 'Technology capabilities behind market leaders',
    });
  }
  
  if (inputs.customerSatisfaction < 7.5) {
    gaps.push({
      area: 'Customer Satisfaction',
      severity: inputs.customerSatisfaction < 6.5 ? 'High' : 'Medium',
      description: 'Customer satisfaction below competitive levels',
    });
  }
  
  return gaps;
}

function determinePositioningStrategy(position: string, strengthScore: any, inputs: any) {
  if (position === 'Leader') {
    return {
      strategy: 'Defend Leadership',
      focus: 'Maintain competitive advantages and market share',
      keyActions: ['Continuous innovation', 'Market expansion', 'Competitive response'],
    };
  } else if (position === 'Challenger') {
    return {
      strategy: 'Challenge Leader',
      focus: 'Attack leader weaknesses and build market share',
      keyActions: ['Differentiation', 'Aggressive marketing', 'Price competition'],
    };
  } else if (position === 'Contender') {
    return {
      strategy: 'Build Position',
      focus: 'Strengthen capabilities and grow market presence',
      keyActions: ['Capability building', 'Niche focus', 'Strategic partnerships'],
    };
  } else {
    return {
      strategy: 'Niche Focus',
      focus: 'Find and dominate specific market segments',
      keyActions: ['Specialization', 'Cost efficiency', 'Service excellence'],
    };
  }
}

function assessCompetitiveAdvantages(inputs: any) {
  const advantages = [];
  
  if (inputs.serviceQuality === 'excellent') {
    advantages.push({
      advantage: 'Service Excellence',
      strength: 'High',
      sustainability: 'Medium',
      description: 'Superior service quality differentiates from competitors',
    });
  }
  
  if (inputs.technologyLevel === 'cutting_edge') {
    advantages.push({
      advantage: 'Technology Leadership',
      strength: 'High',
      sustainability: 'Medium',
      description: 'Advanced technology provides operational advantages',
    });
  }
  
  if (inputs.customerSatisfaction >= 8.5) {
    advantages.push({
      advantage: 'Customer Loyalty',
      strength: 'High',
      sustainability: 'High',
      description: 'High customer satisfaction creates loyalty and referrals',
    });
  }
  
  if (inputs.yourPricing === 'below_average' || inputs.yourPricing === 'discount') {
    advantages.push({
      advantage: 'Cost Leadership',
      strength: 'Medium',
      sustainability: 'Low',
      description: 'Lower pricing attracts price-sensitive customers',
    });
  }
  
  return advantages;
}

function generateCompetitorProfiles(
  competitorCount: number,
  yourShare: number,
  largestShare: number,
  inputs: any
) {
  const profiles = [];
  
  // Market Leader profile
  if (yourShare < largestShare) {
    profiles.push({
      segment: 'Market Leader',
      marketShare: largestShare,
      characteristics: [
        'Established market presence',
        'Strong brand recognition',
        'Comprehensive service offerings',
        'Premium pricing capability',
      ],
      strengths: ['Market position', 'Resources', 'Customer base'],
      weaknesses: ['Potential complacency', 'Higher cost structure'],
      threatLevel: 'High',
      strategy: 'Maintain dominance through innovation and market expansion',
    });
  }
  
  // Major Competitors
  const majorCompetitorShare = Math.max(10, (100 - yourShare - largestShare) * 0.4);
  profiles.push({
    segment: 'Major Competitors',
    marketShare: majorCompetitorShare,
    characteristics: [
      'Significant market presence',
      'Competitive capabilities',
      'Active in key segments',
      'Growth-oriented',
    ],
    strengths: ['Agility', 'Competitive pricing', 'Market knowledge'],
    weaknesses: ['Limited resources', 'Brand recognition'],
    threatLevel: 'Medium',
    strategy: 'Challenge market leaders through differentiation and competitive pricing',
  });
  
  // Niche Players
  const nicheShare = Math.max(5, (100 - yourShare - largestShare - majorCompetitorShare) / 2);
  profiles.push({
    segment: 'Niche Players',
    marketShare: nicheShare,
    characteristics: [
      'Specialized focus',
      'Limited market presence',
      'Specific expertise',
      'Flexible operations',
    ],
    strengths: ['Specialization', 'Flexibility', 'Customer focus'],
    weaknesses: ['Limited scale', 'Resource constraints'],
    threatLevel: 'Low',
    strategy: 'Focus on specific market segments with specialized offerings',
  });
  
  // New Entrants
  profiles.push({
    segment: 'New Entrants',
    marketShare: 5,
    characteristics: [
      'Recent market entry',
      'Modern technology',
      'Aggressive pricing',
      'Limited track record',
    ],
    strengths: ['Innovation', 'Lower costs', 'Agility'],
    weaknesses: ['No market presence', 'Limited experience'],
    threatLevel: 'Medium',
    strategy: 'Disrupt market with new technology and competitive pricing',
  });
  
  return profiles;
}

function developStrategicRecommendations(competitivePosition: any, inputs: any) {
  const recommendations = [];
  
  // Address competitive gaps
  competitivePosition.competitiveGaps.forEach(gap => {
    recommendations.push({
      priority: gap.severity === 'High' ? 'High' : 'Medium',
      category: 'Gap Closure',
      recommendation: `Address ${gap.area} gap`,
      description: gap.description,
      actions: getGapClosureActions(gap.area),
      timeframe: gap.severity === 'High' ? '3-6 months' : '6-12 months',
    });
  });
  
  // Leverage strengths
  if (competitivePosition.competitiveStrength.overallScore >= 75) {
    recommendations.push({
      priority: 'High',
      category: 'Strength Leverage',
      recommendation: `Leverage ${competitivePosition.competitiveStrength.strongestArea} advantage`,
      description: 'Build on existing competitive strengths',
      actions: getStrengthLeverageActions(competitivePosition.competitiveStrength.strongestArea),
      timeframe: '1-3 months',
    });
  }
  
  // Market position strategy
  const positioningStrategy = competitivePosition.positioningStrategy;
  recommendations.push({
    priority: 'High',
    category: 'Positioning',
    recommendation: positioningStrategy.strategy,
    description: positioningStrategy.focus,
    actions: positioningStrategy.keyActions,
    timeframe: '6-18 months',
  });
  
  // Market share growth
  if (competitivePosition.shareGapToLeader > 10) {
    recommendations.push({
      priority: 'Medium',
      category: 'Market Share',
      recommendation: 'Accelerate market share growth',
      description: 'Close gap with market leader',
      actions: [
        'Aggressive customer acquisition',
        'Competitive pricing strategy',
        'Market expansion',
      ],
      timeframe: '12-24 months',
    });
  }
  
  return recommendations.sort((a, b) => {
    const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
}

function getGapClosureActions(area: string) {
  const actions = {
    'Price Competitiveness': [
      'Optimize cost structure',
      'Review pricing strategy',
      'Improve operational efficiency',
    ],
    'Service Quality': [
      'Implement quality improvement program',
      'Train customer service team',
      'Establish service standards',
    ],
    'Technology': [
      'Invest in technology upgrades',
      'Evaluate new equipment',
      'Implement automation',
    ],
    'Customer Satisfaction': [
      'Improve customer feedback system',
      'Address service issues',
      'Enhance customer experience',
    ],
  };
  
  return actions[area] || ['Develop improvement plan', 'Implement best practices'];
}

function getStrengthLeverageActions(area: string) {
  const actions = {
    pricing: [
      'Promote cost advantage',
      'Target price-sensitive segments',
      'Expand market reach',
    ],
    quality: [
      'Highlight quality differentiators',
      'Target quality-focused customers',
      'Build premium brand',
    ],
    technology: [
      'Showcase technology capabilities',
      'Develop innovative solutions',
      'Lead market innovation',
    ],
    satisfaction: [
      'Leverage customer testimonials',
      'Implement referral programs',
      'Build customer advocacy',
    ],
  };
  
  return actions[area] || ['Promote competitive advantage', 'Build market presence'];
}

function identifyThreatsAndOpportunities(
  competitivePosition: any,
  competitorProfiles: any[],
  inputs: any
) {
  const threats = [];
  const opportunities = [];
  
  // Identify threats
  const marketLeader = competitorProfiles.find(p => p.segment === 'Market Leader');
  if (marketLeader && competitivePosition.shareGapToLeader > 15) {
    threats.push({
      threat: 'Market Leader Dominance',
      severity: 'High',
      description: 'Large market leader could leverage position to squeeze competitors',
      mitigation: 'Focus on differentiation and niche markets',
    });
  }
  
  const newEntrants = competitorProfiles.find(p => p.segment === 'New Entrants');
  if (newEntrants) {
    threats.push({
      threat: 'New Market Entrants',
      severity: 'Medium',
      description: 'New competitors with modern technology and aggressive pricing',
      mitigation: 'Accelerate innovation and strengthen customer relationships',
    });
  }
  
  if (competitivePosition.competitiveStrength.overallScore < 65) {
    threats.push({
      threat: 'Competitive Weakness',
      severity: 'High',
      description: 'Overall competitive position is weak',
      mitigation: 'Address fundamental capability gaps',
    });
  }
  
  // Identify opportunities
  if (competitivePosition.marketConcentration.level === 'Fragmented') {
    opportunities.push({
      opportunity: 'Market Consolidation',
      potential: 'High',
      description: 'Fragmented market provides consolidation opportunities',
      approach: 'Strategic acquisitions and aggressive growth',
    });
  }
  
  if (competitivePosition.competitiveStrength.overallScore >= 75) {
    opportunities.push({
      opportunity: 'Market Leadership',
      potential: 'High',
      description: 'Strong competitive position enables market leadership',
      approach: 'Leverage strengths to capture market share',
    });
  }
  
  const nicheOpportunity = competitorProfiles.find(p => p.segment === 'Niche Players');
  if (nicheOpportunity && nicheOpportunity.marketShare < 15) {
    opportunities.push({
      opportunity: 'Niche Market Expansion',
      potential: 'Medium',
      description: 'Underserved niche markets provide growth opportunities',
      approach: 'Develop specialized capabilities and targeted offerings',
    });
  }
  
  return {
    threats,
    opportunities,
    overallThreatLevel: calculateOverallThreatLevel(threats),
    overallOpportunityLevel: calculateOverallOpportunityLevel(opportunities),
    strategicPriorities: generateStrategicPriorities(threats, opportunities),
  };
}

function calculateOverallThreatLevel(threats: any[]) {
  const highThreats = threats.filter(t => t.severity === 'High').length;
  const mediumThreats = threats.filter(t => t.severity === 'Medium').length;
  
  if (highThreats >= 2) return 'High';
  if (highThreats >= 1 || mediumThreats >= 3) return 'Medium';
  return 'Low';
}

function calculateOverallOpportunityLevel(opportunities: any[]) {
  const highOpportunities = opportunities.filter(o => o.potential === 'High').length;
  const mediumOpportunities = opportunities.filter(o => o.potential === 'Medium').length;
  
  if (highOpportunities >= 2) return 'High';
  if (highOpportunities >= 1 || mediumOpportunities >= 2) return 'Medium';
  return 'Low';
}

function generateStrategicPriorities(threats: any[], opportunities: any[]) {
  const priorities = [];
  
  // Address high-severity threats first
  threats.filter(t => t.severity === 'High').forEach(threat => {
    priorities.push({
      priority: 'Critical',
      focus: 'Threat Mitigation',
      description: `Address ${threat.threat.toLowerCase()}`,
      action: threat.mitigation,
    });
  });
  
  // Pursue high-potential opportunities
  opportunities.filter(o => o.potential === 'High').forEach(opportunity => {
    priorities.push({
      priority: 'High',
      focus: 'Opportunity Capture',
      description: `Pursue ${opportunity.opportunity.toLowerCase()}`,
      action: opportunity.approach,
    });
  });
  
  return priorities.slice(0, 5);
}

export default competitorAnalysisConfig;
