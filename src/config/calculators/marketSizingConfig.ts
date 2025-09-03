import { CalculatorConfig } from '../../types/calculator';

export const marketSizingConfig: CalculatorConfig = {
  id: 'market-sizing',
  name: 'Market Sizing Calculator',
  description: 'Calculate total addressable market (TAM), serviceable addressable market (SAM), and serviceable obtainable market (SOM) for laser cutting services.',
  category: 'market-analysis',
  difficulty: 'advanced',
  estimatedTime: '5-6 minutes',
  
  inputs: [
    {
      id: 'geographicScope',
      label: 'Geographic Scope',
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
      description: 'Geographic scope of your target market',
    },
    {
      id: 'targetIndustries',
      label: 'Primary Target Industries',
      type: 'select',
      value: 'manufacturing',
      options: [
        { value: 'manufacturing', label: 'General Manufacturing' },
        { value: 'automotive', label: 'Automotive' },
        { value: 'aerospace', label: 'Aerospace' },
        { value: 'electronics', label: 'Electronics' },
        { value: 'medical', label: 'Medical Devices' },
        { value: 'construction', label: 'Construction' },
        { value: 'mixed', label: 'Mixed Industries' },
      ],
      required: true,
      description: 'Primary industries you serve or plan to serve',
    },
    {
      id: 'populationBase',
      label: 'Population in Target Area',
      type: 'number',
      value: 2500000,
      min: 50000,
      max: 50000000,
      step: 50000,
      required: true,
      description: 'Total population in your target geographic area',
    },
    {
      id: 'manufacturingDensity',
      label: 'Manufacturing Density',
      type: 'select',
      value: 'moderate',
      options: [
        { value: 'low', label: 'Low (Rural/Service economy)' },
        { value: 'moderate', label: 'Moderate (Mixed economy)' },
        { value: 'high', label: 'High (Industrial area)' },
        { value: 'very_high', label: 'Very High (Manufacturing hub)' },
      ],
      required: true,
      description: 'Manufacturing density in your target area',
    },
    {
      id: 'averageProjectValue',
      label: 'Average Project Value',
      type: 'number',
      value: 2500,
      unit: 'USD',
      min: 100,
      max: 50000,
      step: 100,
      required: true,
      description: 'Average value of laser cutting projects',
    },
    {
      id: 'marketMaturity',
      label: 'Market Maturity',
      type: 'select',
      value: 'developing',
      options: [
        { value: 'emerging', label: 'Emerging (New market)' },
        { value: 'developing', label: 'Developing (Growing adoption)' },
        { value: 'mature', label: 'Mature (Established market)' },
        { value: 'saturated', label: 'Saturated (Limited growth)' },
      ],
      required: true,
      description: 'Maturity level of laser cutting market in your area',
    },
    {
      id: 'competitorCount',
      label: 'Number of Competitors',
      type: 'number',
      value: 8,
      min: 0,
      max: 100,
      step: 1,
      required: true,
      description: 'Number of direct competitors in your market',
    },
    {
      id: 'yourCapabilities',
      label: 'Your Service Capabilities',
      type: 'select',
      value: 'standard',
      options: [
        { value: 'basic', label: 'Basic (Simple cutting only)' },
        { value: 'standard', label: 'Standard (Most common services)' },
        { value: 'advanced', label: 'Advanced (Specialized capabilities)' },
        { value: 'comprehensive', label: 'Comprehensive (Full service)' },
      ],
      required: true,
      description: 'Your current or planned service capabilities',
    },
  ],

  outputs: [
    {
      id: 'marketSizing',
      label: 'Market Sizing Analysis',
      type: 'object',
      format: 'market-size-breakdown',
      description: 'TAM, SAM, and SOM calculations with detailed breakdown',
    },
    {
      id: 'marketSegments',
      label: 'Market Segments',
      type: 'array',
      format: 'segment-analysis',
      description: 'Analysis of different market segments and opportunities',
    },
    {
      id: 'growthProjections',
      label: 'Growth Projections',
      type: 'object',
      format: 'growth-forecast',
      description: 'Market growth projections and trends',
    },
    {
      id: 'marketEntry',
      label: 'Market Entry Strategy',
      type: 'object',
      format: 'entry-strategy',
      description: 'Recommended market entry and penetration strategy',
    },
  ],

  calculate: (inputs: Record<string, any>) => {
    const {
      geographicScope,
      targetIndustries,
      populationBase,
      manufacturingDensity,
      averageProjectValue,
      marketMaturity,
      competitorCount,
      yourCapabilities,
    } = inputs;

    // Calculate market sizing
    const marketSizing = calculateMarketSizing(
      geographicScope,
      targetIndustries,
      populationBase,
      manufacturingDensity,
      averageProjectValue,
      marketMaturity
    );

    // Analyze market segments
    const marketSegments = analyzeMarketSegments(
      targetIndustries,
      marketSizing,
      inputs
    );

    // Project market growth
    const growthProjections = projectMarketGrowth(
      marketSizing,
      marketMaturity,
      targetIndustries
    );

    // Develop market entry strategy
    const marketEntry = developMarketEntryStrategy(
      marketSizing,
      competitorCount,
      yourCapabilities,
      inputs
    );

    return {
      marketSizing,
      marketSegments,
      growthProjections,
      marketEntry,
    };
  },

  validation: {
    populationBase: {
      min: 50000,
      max: 50000000,
      message: 'Population must be between 50,000 and 50,000,000',
    },
    averageProjectValue: {
      min: 100,
      max: 50000,
      message: 'Average project value must be between $100 and $50,000',
    },
    competitorCount: {
      min: 0,
      max: 100,
      message: 'Competitor count must be between 0 and 100',
    },
  },

  examples: [
    {
      name: 'Regional Manufacturing Hub',
      description: 'Market sizing for regional manufacturing area',
      inputs: {
        geographicScope: 'regional',
        targetIndustries: 'manufacturing',
        populationBase: 1800000,
        manufacturingDensity: 'high',
        averageProjectValue: 3500,
        marketMaturity: 'developing',
        competitorCount: 12,
        yourCapabilities: 'advanced',
      },
    },
    {
      name: 'Emerging Local Market',
      description: 'Market sizing for emerging local market',
      inputs: {
        geographicScope: 'local',
        targetIndustries: 'mixed',
        populationBase: 400000,
        manufacturingDensity: 'moderate',
        averageProjectValue: 1800,
        marketMaturity: 'emerging',
        competitorCount: 3,
        yourCapabilities: 'standard',
      },
    },
  ],

  tags: ['market-sizing', 'tam', 'sam', 'som', 'analysis'],
  
  relatedCalculators: [
    'competitor-analysis',
    'market-penetration',
    'opportunity-assessment',
    'demand-forecasting',
  ],

  learningResources: [
    {
      title: 'Market Sizing Methodologies',
      type: 'article',
      url: '/learn/market-sizing',
    },
    {
      title: 'TAM SAM SOM Framework',
      type: 'video',
      url: '/learn/tam-sam-som',
    },
  ],
};

// Helper functions
function calculateMarketSizing(
  geographicScope: string,
  targetIndustries: string,
  populationBase: number,
  manufacturingDensity: string,
  averageProjectValue: number,
  marketMaturity: string
) {
  // Calculate TAM (Total Addressable Market)
  const tam = calculateTAM(
    geographicScope,
    populationBase,
    manufacturingDensity,
    averageProjectValue
  );

  // Calculate SAM (Serviceable Addressable Market)
  const sam = calculateSAM(tam, targetIndustries, marketMaturity);

  // Calculate SOM (Serviceable Obtainable Market)
  const som = calculateSOM(sam, marketMaturity, geographicScope);

  return {
    tam: Math.round(tam),
    sam: Math.round(sam),
    som: Math.round(som),
    tamBreakdown: getTAMBreakdown(tam, populationBase, manufacturingDensity),
    samBreakdown: getSAMBreakdown(sam, tam, targetIndustries),
    somBreakdown: getSOMBreakdown(som, sam, marketMaturity),
    marketPenetration: {
      samAsTamPercentage: Math.round((sam / tam) * 100),
      somAsSamPercentage: Math.round((som / sam) * 100),
      somAsTamPercentage: Math.round((som / tam) * 100),
    },
  };
}

function calculateTAM(
  geographicScope: string,
  populationBase: number,
  manufacturingDensity: string,
  averageProjectValue: number
) {
  // Base calculation: companies per population
  const companiesPerPopulation = getCompaniesPerPopulation(manufacturingDensity);
  const totalCompanies = populationBase * companiesPerPopulation;
  
  // Manufacturing companies percentage
  const manufacturingPercentage = getManufacturingPercentage(manufacturingDensity);
  const manufacturingCompanies = totalCompanies * manufacturingPercentage;
  
  // Laser cutting adoption rate
  const adoptionRate = getLaserCuttingAdoptionRate(geographicScope);
  const potentialCustomers = manufacturingCompanies * adoptionRate;
  
  // Annual spending per customer
  const annualSpendingMultiplier = getAnnualSpendingMultiplier(geographicScope);
  const annualSpendingPerCustomer = averageProjectValue * annualSpendingMultiplier;
  
  return potentialCustomers * annualSpendingPerCustomer;
}

function getCompaniesPerPopulation(density: string) {
  const rates = {
    low: 0.015,      // 1.5 companies per 100 people
    moderate: 0.025, // 2.5 companies per 100 people
    high: 0.035,     // 3.5 companies per 100 people
    very_high: 0.045, // 4.5 companies per 100 people
  };
  return rates[density] || 0.025;
}

function getManufacturingPercentage(density: string) {
  const percentages = {
    low: 0.08,       // 8% of companies are manufacturing
    moderate: 0.15,  // 15% of companies are manufacturing
    high: 0.25,      // 25% of companies are manufacturing
    very_high: 0.35, // 35% of companies are manufacturing
  };
  return percentages[density] || 0.15;
}

function getLaserCuttingAdoptionRate(scope: string) {
  const rates = {
    local: 0.12,     // 12% adoption in local markets
    regional: 0.18,  // 18% adoption in regional markets
    state: 0.22,     // 22% adoption in state markets
    multi_state: 0.25, // 25% adoption in multi-state markets
    national: 0.30,  // 30% adoption nationally
  };
  return rates[scope] || 0.18;
}

function getAnnualSpendingMultiplier(scope: string) {
  const multipliers = {
    local: 3,        // 3 projects per year
    regional: 4,     // 4 projects per year
    state: 5,        // 5 projects per year
    multi_state: 6,  // 6 projects per year
    national: 8,     // 8 projects per year
  };
  return multipliers[scope] || 4;
}

function calculateSAM(tam: number, targetIndustries: string, marketMaturity: string) {
  // Industry focus factor
  const industryFactor = getIndustryFactor(targetIndustries);
  
  // Market maturity factor
  const maturityFactor = getMaturityFactor(marketMaturity);
  
  return tam * industryFactor * maturityFactor;
}

function getIndustryFactor(industry: string) {
  const factors = {
    manufacturing: 0.4,   // 40% of TAM
    automotive: 0.15,     // 15% of TAM
    aerospace: 0.08,      // 8% of TAM
    electronics: 0.12,    // 12% of TAM
    medical: 0.10,        // 10% of TAM
    construction: 0.10,   // 10% of TAM
    mixed: 0.6,           // 60% of TAM (multiple industries)
  };
  return factors[industry] || 0.4;
}

function getMaturityFactor(maturity: string) {
  const factors = {
    emerging: 0.3,     // 30% of potential realized
    developing: 0.6,   // 60% of potential realized
    mature: 0.85,      // 85% of potential realized
    saturated: 0.95,   // 95% of potential realized
  };
  return factors[maturity] || 0.6;
}

function calculateSOM(sam: number, marketMaturity: string, geographicScope: string) {
  // Realistic market share achievable
  const achievableShare = getAchievableMarketShare(marketMaturity, geographicScope);
  
  return sam * achievableShare;
}

function getAchievableMarketShare(maturity: string, scope: string) {
  // Base achievable share by maturity
  const baseShares = {
    emerging: 0.25,    // 25% achievable in emerging markets
    developing: 0.15,  // 15% achievable in developing markets
    mature: 0.08,      // 8% achievable in mature markets
    saturated: 0.03,   // 3% achievable in saturated markets
  };
  
  // Scope adjustment
  const scopeAdjustments = {
    local: 1.5,        // Easier to dominate local markets
    regional: 1.2,     // Moderate advantage in regional markets
    state: 1.0,        // Base level
    multi_state: 0.8,  // Harder in multi-state markets
    national: 0.5,     // Much harder nationally
  };
  
  const baseShare = baseShares[maturity] || 0.15;
  const scopeAdjustment = scopeAdjustments[scope] || 1.0;
  
  return Math.min(0.4, baseShare * scopeAdjustment); // Cap at 40%
}

function getTAMBreakdown(tam: number, populationBase: number, manufacturingDensity: string) {
  const companiesPerPopulation = getCompaniesPerPopulation(manufacturingDensity);
  const manufacturingPercentage = getManufacturingPercentage(manufacturingDensity);
  
  const totalCompanies = Math.round(populationBase * companiesPerPopulation);
  const manufacturingCompanies = Math.round(totalCompanies * manufacturingPercentage);
  
  return {
    populationBase,
    totalCompanies,
    manufacturingCompanies,
    potentialCustomers: Math.round(manufacturingCompanies * 0.2), // Simplified
    averageAnnualSpend: Math.round(tam / (manufacturingCompanies * 0.2)),
  };
}

function getSAMBreakdown(sam: number, tam: number, targetIndustries: string) {
  const industryFactor = getIndustryFactor(targetIndustries);
  
  return {
    industryFocus: targetIndustries,
    industryFactor: Math.round(industryFactor * 100),
    addressableMarket: sam,
    excludedMarket: Math.round(tam - sam),
    focusRationale: getIndustryFocusRationale(targetIndustries),
  };
}

function getIndustryFocusRationale(industry: string) {
  const rationales = {
    manufacturing: 'General manufacturing provides broad market opportunity',
    automotive: 'Automotive industry has high precision requirements',
    aerospace: 'Aerospace demands highest quality and certification',
    electronics: 'Electronics requires precision and clean cutting',
    medical: 'Medical devices need regulatory compliance and precision',
    construction: 'Construction industry uses laser cutting for structural components',
    mixed: 'Multiple industries provide diversified market opportunity',
  };
  return rationales[industry] || 'Focused industry approach';
}

function getSOMBreakdown(som: number, sam: number, marketMaturity: string) {
  const achievableShare = som / sam;
  
  return {
    achievableShare: Math.round(achievableShare * 100),
    obtainableMarket: som,
    competitiveMarket: Math.round(sam - som),
    marketMaturity,
    realizationTimeframe: getRealizationTimeframe(marketMaturity),
    keySuccessFactors: getKeySuccessFactors(marketMaturity),
  };
}

function getRealizationTimeframe(maturity: string) {
  const timeframes = {
    emerging: '2-3 years',
    developing: '3-5 years',
    mature: '5-7 years',
    saturated: '7-10 years',
  };
  return timeframes[maturity] || '3-5 years';
}

function getKeySuccessFactors(maturity: string) {
  const factors = {
    emerging: ['Market education', 'Early adoption', 'Technology leadership'],
    developing: ['Competitive pricing', 'Service quality', 'Market presence'],
    mature: ['Differentiation', 'Efficiency', 'Customer relationships'],
    saturated: ['Innovation', 'Niche focus', 'Cost leadership'],
  };
  return factors[maturity] || ['Market presence', 'Service quality'];
}

function analyzeMarketSegments(targetIndustries: string, marketSizing: any, inputs: any) {
  const segments = [];
  
  if (targetIndustries === 'mixed') {
    // Create segments for mixed industries
    const industries = ['manufacturing', 'automotive', 'electronics', 'construction'];
    industries.forEach(industry => {
      segments.push(createSegmentAnalysis(industry, marketSizing, inputs));
    });
  } else {
    // Create detailed analysis for single industry
    segments.push(createSegmentAnalysis(targetIndustries, marketSizing, inputs));
    
    // Add related segments
    const relatedIndustries = getRelatedIndustries(targetIndustries);
    relatedIndustries.forEach(industry => {
      segments.push(createSegmentAnalysis(industry, marketSizing, inputs, true));
    });
  }
  
  return segments.sort((a, b) => b.marketSize - a.marketSize);
}

function createSegmentAnalysis(industry: string, marketSizing: any, inputs: any, isSecondary = false) {
  const industryFactor = getIndustryFactor(industry);
  const segmentSize = Math.round(marketSizing.tam * industryFactor * (isSecondary ? 0.5 : 1));
  
  return {
    industry,
    marketSize: segmentSize,
    growthRate: getIndustryGrowthRate(industry),
    competitionLevel: getCompetitionLevel(industry),
    entryBarriers: getEntryBarriers(industry),
    profitability: getProfitability(industry),
    keyRequirements: getKeyRequirements(industry),
    opportunity: assessOpportunity(segmentSize, industry, inputs),
  };
}

function getRelatedIndustries(primaryIndustry: string) {
  const related = {
    manufacturing: ['construction', 'electronics'],
    automotive: ['manufacturing', 'aerospace'],
    aerospace: ['automotive', 'medical'],
    electronics: ['manufacturing', 'medical'],
    medical: ['electronics', 'aerospace'],
    construction: ['manufacturing'],
  };
  return related[primaryIndustry] || [];
}

function getIndustryGrowthRate(industry: string) {
  const rates = {
    manufacturing: 5,
    automotive: 3,
    aerospace: 7,
    electronics: 8,
    medical: 12,
    construction: 4,
  };
  return rates[industry] || 5;
}

function getCompetitionLevel(industry: string) {
  const levels = {
    manufacturing: 'High',
    automotive: 'Medium',
    aerospace: 'Low',
    electronics: 'High',
    medical: 'Medium',
    construction: 'Medium',
  };
  return levels[industry] || 'Medium';
}

function getEntryBarriers(industry: string) {
  const barriers = {
    manufacturing: 'Low',
    automotive: 'Medium',
    aerospace: 'High',
    electronics: 'Medium',
    medical: 'High',
    construction: 'Low',
  };
  return barriers[industry] || 'Medium';
}

function getProfitability(industry: string) {
  const profitability = {
    manufacturing: 'Medium',
    automotive: 'Medium',
    aerospace: 'High',
    electronics: 'Medium',
    medical: 'High',
    construction: 'Low',
  };
  return profitability[industry] || 'Medium';
}

function getKeyRequirements(industry: string) {
  const requirements = {
    manufacturing: ['Cost efficiency', 'Reliability', 'Flexibility'],
    automotive: ['Quality standards', 'Volume capability', 'Lean processes'],
    aerospace: ['Certification', 'Precision', 'Traceability'],
    electronics: ['Precision', 'Clean environment', 'Small features'],
    medical: ['FDA compliance', 'Biocompatibility', 'Documentation'],
    construction: ['Durability', 'Weather resistance', 'Cost efficiency'],
  };
  return requirements[industry] || ['Quality', 'Reliability'];
}

function assessOpportunity(marketSize: number, industry: string, inputs: any) {
  const capabilityMatch = assessCapabilityMatch(industry, inputs.yourCapabilities);
  const marketAttractiveness = assessMarketAttractiveness(industry);
  
  let opportunity = 'Medium';
  if (capabilityMatch === 'High' && marketAttractiveness === 'High') {
    opportunity = 'High';
  } else if (capabilityMatch === 'Low' || marketAttractiveness === 'Low') {
    opportunity = 'Low';
  }
  
  return {
    level: opportunity,
    capabilityMatch,
    marketAttractiveness,
    recommendedAction: getRecommendedAction(opportunity, capabilityMatch),
  };
}

function assessCapabilityMatch(industry: string, capabilities: string) {
  const requiredCapabilities = {
    manufacturing: 'standard',
    automotive: 'advanced',
    aerospace: 'comprehensive',
    electronics: 'advanced',
    medical: 'comprehensive',
    construction: 'basic',
  };
  
  const required = requiredCapabilities[industry] || 'standard';
  const capabilityLevels = { basic: 1, standard: 2, advanced: 3, comprehensive: 4 };
  
  const yourLevel = capabilityLevels[capabilities] || 2;
  const requiredLevel = capabilityLevels[required] || 2;
  
  if (yourLevel >= requiredLevel) return 'High';
  if (yourLevel >= requiredLevel - 1) return 'Medium';
  return 'Low';
}

function assessMarketAttractiveness(industry: string) {
  const growthRate = getIndustryGrowthRate(industry);
  const profitability = getProfitability(industry);
  const competition = getCompetitionLevel(industry);
  
  let score = 0;
  if (growthRate > 7) score += 2;
  else if (growthRate > 4) score += 1;
  
  if (profitability === 'High') score += 2;
  else if (profitability === 'Medium') score += 1;
  
  if (competition === 'Low') score += 2;
  else if (competition === 'Medium') score += 1;
  
  if (score >= 5) return 'High';
  if (score >= 3) return 'Medium';
  return 'Low';
}

function getRecommendedAction(opportunity: string, capabilityMatch: string) {
  if (opportunity === 'High') {
    return capabilityMatch === 'High' ? 'Aggressive pursuit' : 'Capability development';
  } else if (opportunity === 'Medium') {
    return 'Selective targeting';
  } else {
    return 'Monitor for changes';
  }
}

function projectMarketGrowth(marketSizing: any, marketMaturity: string, targetIndustries: string) {
  const baseGrowthRate = getMarketGrowthRate(marketMaturity, targetIndustries);
  const projections = [];
  
  let currentTAM = marketSizing.tam;
  let currentSAM = marketSizing.sam;
  let currentSOM = marketSizing.som;
  
  for (let year = 1; year <= 5; year++) {
    const growthFactor = 1 + (baseGrowthRate / 100);
    currentTAM *= growthFactor;
    currentSAM *= growthFactor;
    currentSOM *= growthFactor;
    
    projections.push({
      year,
      tam: Math.round(currentTAM),
      sam: Math.round(currentSAM),
      som: Math.round(currentSOM),
      growthRate: baseGrowthRate,
    });
  }
  
  return {
    baseGrowthRate,
    projections,
    drivers: getGrowthDrivers(targetIndustries),
    risks: getGrowthRisks(marketMaturity),
  };
}

function getMarketGrowthRate(maturity: string, industry: string) {
  const baseRates = {
    emerging: 15,
    developing: 10,
    mature: 5,
    saturated: 2,
  };
  
  const industryAdjustments = {
    manufacturing: 0,
    automotive: -1,
    aerospace: 2,
    electronics: 3,
    medical: 5,
    construction: -2,
    mixed: 1,
  };
  
  const baseRate = baseRates[maturity] || 8;
  const adjustment = industryAdjustments[industry] || 0;
  
  return Math.max(1, baseRate + adjustment);
}

function getGrowthDrivers(industry: string) {
  const drivers = {
    manufacturing: ['Automation adoption', 'Reshoring trends', 'Customization demand'],
    automotive: ['Electric vehicle growth', 'Lightweighting trends', 'Autonomous vehicles'],
    aerospace: ['Commercial aviation recovery', 'Space industry growth', 'Defense spending'],
    electronics: ['IoT expansion', '5G deployment', 'Miniaturization trends'],
    medical: ['Aging population', 'Personalized medicine', 'Regulatory approvals'],
    construction: ['Infrastructure investment', 'Green building trends', 'Prefabrication'],
    mixed: ['Digital transformation', 'Supply chain localization', 'Sustainability focus'],
  };
  return drivers[industry] || ['Technology advancement', 'Market expansion'];
}

function getGrowthRisks(maturity: string) {
  const risks = {
    emerging: ['Market education challenges', 'Technology adoption barriers'],
    developing: ['Competitive pressure', 'Economic sensitivity'],
    mature: ['Market saturation', 'Price competition'],
    saturated: ['Declining demand', 'Substitution threats'],
  };
  return risks[maturity] || ['Economic uncertainty', 'Competitive pressure'];
}

function developMarketEntryStrategy(
  marketSizing: any,
  competitorCount: number,
  yourCapabilities: string,
  inputs: any
) {
  const entryApproach = determineEntryApproach(marketSizing, competitorCount, inputs);
  const targetSegments = identifyTargetSegments(marketSizing, inputs);
  const entryBarriers = assessEntryBarriers(competitorCount, inputs.marketMaturity);
  const timeline = developEntryTimeline(entryApproach, yourCapabilities);
  
  return {
    recommendedApproach: entryApproach,
    targetSegments,
    entryBarriers,
    timeline,
    investmentRequirements: calculateInvestmentRequirements(entryApproach, marketSizing),
    successMetrics: defineSuccessMetrics(marketSizing),
  };
}

function determineEntryApproach(marketSizing: any, competitorCount: number, inputs: any) {
  const marketSize = marketSizing.som;
  const competitionLevel = competitorCount > 10 ? 'High' : competitorCount > 5 ? 'Medium' : 'Low';
  
  if (marketSize > 5000000 && competitionLevel === 'Low') {
    return {
      strategy: 'Aggressive Entry',
      description: 'Large market with low competition - aggressive expansion',
      riskLevel: 'Medium',
    };
  } else if (marketSize > 2000000 && competitionLevel === 'Medium') {
    return {
      strategy: 'Focused Entry',
      description: 'Target specific segments with differentiation',
      riskLevel: 'Medium',
    };
  } else if (competitionLevel === 'High') {
    return {
      strategy: 'Niche Entry',
      description: 'Focus on underserved niches and specialization',
      riskLevel: 'Low',
    };
  } else {
    return {
      strategy: 'Gradual Entry',
      description: 'Gradual market entry with capability building',
      riskLevel: 'Low',
    };
  }
}

function identifyTargetSegments(marketSizing: any, inputs: any) {
  const segments = [];
  
  // Primary segment
  segments.push({
    segment: 'Primary Target',
    industry: inputs.targetIndustries,
    marketSize: Math.round(marketSizing.sam * 0.6),
    priority: 'High',
    rationale: 'Core competency alignment',
  });
  
  // Secondary segments
  const relatedIndustries = getRelatedIndustries(inputs.targetIndustries);
  relatedIndustries.slice(0, 2).forEach((industry, index) => {
    segments.push({
      segment: `Secondary Target ${index + 1}`,
      industry,
      marketSize: Math.round(marketSizing.sam * 0.2),
      priority: 'Medium',
      rationale: 'Adjacent market opportunity',
    });
  });
  
  return segments;
}

function assessEntryBarriers(competitorCount: number, marketMaturity: string) {
  const barriers = [];
  
  if (competitorCount > 10) {
    barriers.push({
      barrier: 'High Competition',
      severity: 'High',
      description: 'Many established competitors',
      mitigation: 'Differentiation and niche focus',
    });
  }
  
  if (marketMaturity === 'mature' || marketMaturity === 'saturated') {
    barriers.push({
      barrier: 'Market Maturity',
      severity: 'Medium',
      description: 'Established customer relationships',
      mitigation: 'Superior value proposition',
    });
  }
  
  barriers.push({
    barrier: 'Capital Requirements',
    severity: 'Medium',
    description: 'Equipment and facility investment needed',
    mitigation: 'Phased investment approach',
  });
  
  return barriers;
}

function developEntryTimeline(entryApproach: any, capabilities: string) {
  const phases = [];
  
  // Phase 1: Preparation
  phases.push({
    phase: 1,
    name: 'Market Preparation',
    duration: '3-6 months',
    activities: [
      'Market research and validation',
      'Capability assessment and development',
      'Initial customer outreach',
    ],
  });
  
  // Phase 2: Entry
  phases.push({
    phase: 2,
    name: 'Market Entry',
    duration: '6-12 months',
    activities: [
      'Launch marketing campaigns',
      'Acquire first customers',
      'Establish market presence',
    ],
  });
  
  // Phase 3: Growth
  phases.push({
    phase: 3,
    name: 'Market Growth',
    duration: '12-24 months',
    activities: [
      'Scale operations',
      'Expand customer base',
      'Achieve target market share',
    ],
  });
  
  return phases;
}

function calculateInvestmentRequirements(entryApproach: any, marketSizing: any) {
  const baseInvestment = marketSizing.som * 0.05; // 5% of SOM
  
  const strategyMultipliers = {
    'Aggressive Entry': 1.5,
    'Focused Entry': 1.0,
    'Niche Entry': 0.7,
    'Gradual Entry': 0.5,
  };
  
  const multiplier = strategyMultipliers[entryApproach.strategy] || 1.0;
  const totalInvestment = baseInvestment * multiplier;
  
  return {
    totalInvestment: Math.round(totalInvestment),
    breakdown: {
      marketing: Math.round(totalInvestment * 0.3),
      equipment: Math.round(totalInvestment * 0.4),
      operations: Math.round(totalInvestment * 0.2),
      working_capital: Math.round(totalInvestment * 0.1),
    },
    paybackPeriod: calculatePaybackPeriod(totalInvestment, marketSizing.som),
  };
}

function calculatePaybackPeriod(investment: number, som: number) {
  const annualRevenuePotential = som * 0.1; // 10% of SOM annually
  const paybackYears = investment / annualRevenuePotential;
  
  if (paybackYears < 1) return 'Less than 1 year';
  if (paybackYears < 2) return '1-2 years';
  if (paybackYears < 3) return '2-3 years';
  return 'More than 3 years';
}

function defineSuccessMetrics(marketSizing: any) {
  return [
    {
      metric: 'Market Share',
      target: '5-10% of SOM',
      timeframe: '3 years',
    },
    {
      metric: 'Revenue',
      target: `$${Math.round(marketSizing.som * 0.05 / 1000)}K annually`,
      timeframe: '2 years',
    },
    {
      metric: 'Customer Acquisition',
      target: '50+ active customers',
      timeframe: '18 months',
    },
    {
      metric: 'Brand Recognition',
      target: 'Top 3 in target segments',
      timeframe: '3 years',
    },
  ];
}

export default marketSizingConfig;
