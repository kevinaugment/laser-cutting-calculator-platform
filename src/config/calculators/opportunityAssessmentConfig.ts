import { CalculatorConfig } from '../../types/calculator';

export const opportunityAssessmentConfig: CalculatorConfig = {
  id: 'opportunity-assessment',
  name: 'Opportunity Assessment Calculator',
  description: 'Evaluate and prioritize business opportunities to make informed decisions about market entry, expansion, and investment.',
  category: 'market-analysis',
  difficulty: 'advanced',
  estimatedTime: '6-7 minutes',
  
  inputs: [
    {
      id: 'opportunityType',
      label: 'Opportunity Type',
      type: 'select',
      value: 'market_expansion',
      options: [
        { value: 'new_market', label: 'New Market Entry' },
        { value: 'market_expansion', label: 'Market Expansion' },
        { value: 'new_service', label: 'New Service Offering' },
        { value: 'technology_upgrade', label: 'Technology Upgrade' },
        { value: 'partnership', label: 'Strategic Partnership' },
        { value: 'acquisition', label: 'Acquisition Opportunity' },
      ],
      required: true,
      description: 'Type of opportunity being evaluated',
    },
    {
      id: 'marketSize',
      label: 'Estimated Market Size',
      type: 'number',
      value: 5000000,
      unit: 'USD',
      min: 100000,
      max: 100000000,
      step: 100000,
      required: true,
      description: 'Total addressable market size for this opportunity',
    },
    {
      id: 'competitionLevel',
      label: 'Competition Level',
      type: 'select',
      value: 'moderate',
      options: [
        { value: 'low', label: 'Low (Few competitors)' },
        { value: 'moderate', label: 'Moderate (Some competition)' },
        { value: 'high', label: 'High (Many competitors)' },
        { value: 'intense', label: 'Intense (Saturated market)' },
      ],
      required: true,
      description: 'Level of competition in this opportunity',
    },
    {
      id: 'requiredInvestment',
      label: 'Required Investment',
      type: 'number',
      value: 250000,
      unit: 'USD',
      min: 10000,
      max: 10000000,
      step: 10000,
      required: true,
      description: 'Total investment required to pursue opportunity',
    },
    {
      id: 'timeToMarket',
      label: 'Time to Market',
      type: 'select',
      value: '6_months',
      options: [
        { value: '3_months', label: '3 Months' },
        { value: '6_months', label: '6 Months' },
        { value: '12_months', label: '12 Months' },
        { value: '18_months', label: '18 Months' },
        { value: '24_months', label: '24+ Months' },
      ],
      required: true,
      description: 'Expected time to bring opportunity to market',
    },
    {
      id: 'strategicFit',
      label: 'Strategic Fit',
      type: 'select',
      value: 'good',
      options: [
        { value: 'excellent', label: 'Excellent (Perfect alignment)' },
        { value: 'good', label: 'Good (Strong alignment)' },
        { value: 'fair', label: 'Fair (Some alignment)' },
        { value: 'poor', label: 'Poor (Little alignment)' },
      ],
      required: true,
      description: 'How well this opportunity aligns with your strategy',
    },
    {
      id: 'capabilityMatch',
      label: 'Capability Match',
      type: 'select',
      value: 'good',
      options: [
        { value: 'excellent', label: 'Excellent (Existing capabilities)' },
        { value: 'good', label: 'Good (Minor gaps)' },
        { value: 'fair', label: 'Fair (Some gaps)' },
        { value: 'poor', label: 'Poor (Major gaps)' },
      ],
      required: true,
      description: 'How well your capabilities match opportunity requirements',
    },
    {
      id: 'riskLevel',
      label: 'Risk Level',
      type: 'select',
      value: 'medium',
      options: [
        { value: 'low', label: 'Low Risk' },
        { value: 'medium', label: 'Medium Risk' },
        { value: 'high', label: 'High Risk' },
        { value: 'very_high', label: 'Very High Risk' },
      ],
      required: true,
      description: 'Overall risk level of the opportunity',
    },
  ],

  outputs: [
    {
      id: 'opportunityScore',
      label: 'Opportunity Score',
      type: 'object',
      format: 'opportunity-rating',
      description: 'Comprehensive opportunity assessment score and rating',
    },
    {
      id: 'financialAnalysis',
      label: 'Financial Analysis',
      type: 'object',
      format: 'financial-metrics',
      description: 'Financial projections and return analysis',
    },
    {
      id: 'riskAssessment',
      label: 'Risk Assessment',
      type: 'object',
      format: 'risk-analysis',
      description: 'Detailed risk analysis and mitigation strategies',
    },
    {
      id: 'recommendations',
      label: 'Recommendations',
      type: 'object',
      format: 'opportunity-recommendations',
      description: 'Strategic recommendations and next steps',
    },
  ],

  calculate: (inputs: Record<string, any>) => {
    const {
      opportunityType,
      marketSize,
      competitionLevel,
      requiredInvestment,
      timeToMarket,
      strategicFit,
      capabilityMatch,
      riskLevel,
    } = inputs;

    // Calculate opportunity score
    const opportunityScore = calculateOpportunityScore(inputs);

    // Perform financial analysis
    const financialAnalysis = performFinancialAnalysis(
      marketSize,
      requiredInvestment,
      competitionLevel,
      timeToMarket,
      opportunityType
    );

    // Assess risks
    const riskAssessment = assessRisks(
      riskLevel,
      competitionLevel,
      requiredInvestment,
      timeToMarket,
      capabilityMatch,
      inputs
    );

    // Generate recommendations
    const recommendations = generateRecommendations(
      opportunityScore,
      financialAnalysis,
      riskAssessment,
      inputs
    );

    return {
      opportunityScore,
      financialAnalysis,
      riskAssessment,
      recommendations,
    };
  },

  validation: {
    marketSize: {
      min: 100000,
      max: 100000000,
      message: 'Market size must be between $100K and $100M',
    },
    requiredInvestment: {
      min: 10000,
      max: 10000000,
      message: 'Investment must be between $10K and $10M',
    },
  },

  examples: [
    {
      name: 'High-Value Market Expansion',
      description: 'Expanding into aerospace market segment',
      inputs: {
        opportunityType: 'market_expansion',
        marketSize: 15000000,
        competitionLevel: 'moderate',
        requiredInvestment: 500000,
        timeToMarket: '12_months',
        strategicFit: 'excellent',
        capabilityMatch: 'good',
        riskLevel: 'medium',
      },
    },
    {
      name: 'Technology Innovation',
      description: 'Investing in advanced laser technology',
      inputs: {
        opportunityType: 'technology_upgrade',
        marketSize: 8000000,
        competitionLevel: 'high',
        requiredInvestment: 750000,
        timeToMarket: '6_months',
        strategicFit: 'good',
        capabilityMatch: 'fair',
        riskLevel: 'high',
      },
    },
  ],

  tags: ['opportunity', 'assessment', 'evaluation', 'investment', 'strategy'],
  
  relatedCalculators: [
    'market-sizing',
    'competitor-analysis',
    'trend-analysis',
    'break-even-analysis',
  ],

  learningResources: [
    {
      title: 'Opportunity Assessment Framework',
      type: 'article',
      url: '/learn/opportunity-assessment',
    },
    {
      title: 'Investment Decision Making',
      type: 'video',
      url: '/learn/investment-decisions',
    },
  ],
};

// Helper functions
function calculateOpportunityScore(inputs: any) {
  const scores = {
    market: calculateMarketScore(inputs.marketSize, inputs.competitionLevel),
    strategic: calculateStrategicScore(inputs.strategicFit, inputs.capabilityMatch),
    financial: calculateFinancialScore(inputs.marketSize, inputs.requiredInvestment),
    timing: calculateTimingScore(inputs.timeToMarket, inputs.opportunityType),
    risk: calculateRiskScore(inputs.riskLevel),
  };

  const weights = {
    market: 0.25,
    strategic: 0.25,
    financial: 0.25,
    timing: 0.15,
    risk: 0.10,
  };

  const weightedScore = Object.entries(scores).reduce((total, [category, score]) => {
    return total + (score * weights[category]);
  }, 0);

  return {
    overallScore: Math.round(weightedScore),
    categoryScores: scores,
    rating: getOpportunityRating(weightedScore),
    recommendation: getScoreRecommendation(weightedScore),
    strengths: identifyStrengths(scores),
    weaknesses: identifyWeaknesses(scores),
  };
}

function calculateMarketScore(marketSize: number, competitionLevel: string) {
  let score = 0;
  
  // Market size scoring
  if (marketSize >= 10000000) score += 40;
  else if (marketSize >= 5000000) score += 35;
  else if (marketSize >= 2000000) score += 30;
  else if (marketSize >= 1000000) score += 25;
  else score += 20;
  
  // Competition level scoring (inverse relationship)
  const competitionScores = {
    low: 35,
    moderate: 25,
    high: 15,
    intense: 5,
  };
  
  score += competitionScores[competitionLevel] || 20;
  
  return Math.min(100, score);
}

function calculateStrategicScore(strategicFit: string, capabilityMatch: string) {
  const fitScores = {
    excellent: 50,
    good: 40,
    fair: 25,
    poor: 10,
  };
  
  const capabilityScores = {
    excellent: 50,
    good: 40,
    fair: 25,
    poor: 10,
  };
  
  return fitScores[strategicFit] + capabilityScores[capabilityMatch];
}

function calculateFinancialScore(marketSize: number, requiredInvestment: number) {
  const marketToInvestmentRatio = marketSize / requiredInvestment;
  
  if (marketToInvestmentRatio >= 50) return 100;
  if (marketToInvestmentRatio >= 30) return 85;
  if (marketToInvestmentRatio >= 20) return 70;
  if (marketToInvestmentRatio >= 10) return 55;
  if (marketToInvestmentRatio >= 5) return 40;
  return 25;
}

function calculateTimingScore(timeToMarket: string, opportunityType: string) {
  const timeScores = {
    '3_months': 40,
    '6_months': 35,
    '12_months': 25,
    '18_months': 15,
    '24_months': 10,
  };
  
  const typeMultipliers = {
    new_service: 1.2,
    market_expansion: 1.1,
    technology_upgrade: 1.0,
    new_market: 0.9,
    partnership: 1.1,
    acquisition: 0.8,
  };
  
  const baseScore = timeScores[timeToMarket] || 20;
  const multiplier = typeMultipliers[opportunityType] || 1.0;
  
  return Math.min(100, Math.round(baseScore * multiplier));
}

function calculateRiskScore(riskLevel: string) {
  const riskScores = {
    low: 30,
    medium: 20,
    high: 10,
    very_high: 5,
  };
  
  return riskScores[riskLevel] || 15;
}

function getOpportunityRating(score: number) {
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 55) return 'Fair';
  if (score >= 40) return 'Poor';
  return 'Very Poor';
}

function getScoreRecommendation(score: number) {
  if (score >= 85) return 'Strongly Recommended - High priority opportunity';
  if (score >= 70) return 'Recommended - Good opportunity worth pursuing';
  if (score >= 55) return 'Consider - Opportunity with potential but requires careful evaluation';
  if (score >= 40) return 'Caution - Significant challenges and risks';
  return 'Not Recommended - High risk, low potential opportunity';
}

function identifyStrengths(scores: any) {
  return Object.entries(scores)
    .filter(([_, score]) => score >= 70)
    .map(([category, score]) => ({
      area: category.charAt(0).toUpperCase() + category.slice(1),
      score,
      description: getStrengthDescription(category),
    }));
}

function identifyWeaknesses(scores: any) {
  return Object.entries(scores)
    .filter(([_, score]) => score < 50)
    .map(([category, score]) => ({
      area: category.charAt(0).toUpperCase() + category.slice(1),
      score,
      description: getWeaknessDescription(category),
    }));
}

function getStrengthDescription(category: string) {
  const descriptions = {
    market: 'Strong market potential with favorable competitive dynamics',
    strategic: 'Excellent alignment with strategy and capabilities',
    financial: 'Attractive financial returns relative to investment',
    timing: 'Favorable timing for market entry',
    risk: 'Low risk profile enhances opportunity attractiveness',
  };
  return descriptions[category] || 'Positive factor for opportunity';
}

function getWeaknessDescription(category: string) {
  const descriptions = {
    market: 'Limited market potential or intense competition',
    strategic: 'Poor strategic fit or capability gaps',
    financial: 'Unfavorable financial returns or high investment requirements',
    timing: 'Challenging timing or long time to market',
    risk: 'High risk profile creates uncertainty',
  };
  return descriptions[category] || 'Area requiring attention';
}

function performFinancialAnalysis(
  marketSize: number,
  requiredInvestment: number,
  competitionLevel: string,
  timeToMarket: string,
  opportunityType: string
) {
  // Estimate market share potential
  const marketSharePotential = estimateMarketShare(competitionLevel, opportunityType);
  
  // Calculate revenue projections
  const revenueProjections = calculateRevenueProjections(
    marketSize,
    marketSharePotential,
    timeToMarket
  );
  
  // Calculate ROI and payback
  const roiAnalysis = calculateROI(revenueProjections, requiredInvestment);
  
  // Perform sensitivity analysis
  const sensitivityAnalysis = performSensitivityAnalysis(
    marketSize,
    marketSharePotential,
    requiredInvestment
  );

  return {
    marketSharePotential,
    revenueProjections,
    roiAnalysis,
    sensitivityAnalysis,
    breakEvenAnalysis: calculateBreakEven(revenueProjections, requiredInvestment),
  };
}

function estimateMarketShare(competitionLevel: string, opportunityType: string) {
  const baseShares = {
    low: 0.15,      // 15% in low competition
    moderate: 0.08, // 8% in moderate competition
    high: 0.04,     // 4% in high competition
    intense: 0.02,  // 2% in intense competition
  };
  
  const typeMultipliers = {
    new_market: 1.5,        // Higher share in new markets
    market_expansion: 1.2,  // Good share in expansion
    new_service: 1.1,       // Slight advantage with new services
    technology_upgrade: 1.0, // Standard share
    partnership: 1.3,       // Partnership advantage
    acquisition: 2.0,       // Acquisition provides immediate share
  };
  
  const baseShare = baseShares[competitionLevel] || 0.06;
  const multiplier = typeMultipliers[opportunityType] || 1.0;
  
  return Math.min(0.3, baseShare * multiplier); // Cap at 30%
}

function calculateRevenueProjections(
  marketSize: number,
  marketShare: number,
  timeToMarket: string
) {
  const timeToRevenue = {
    '3_months': 0.25,
    '6_months': 0.5,
    '12_months': 1.0,
    '18_months': 1.5,
    '24_months': 2.0,
  };
  
  const rampUpTime = timeToRevenue[timeToMarket] || 1.0;
  const fullMarketRevenue = marketSize * marketShare;
  
  const projections = [];
  for (let year = 1; year <= 5; year++) {
    let revenueMultiplier = 0;
    
    if (year <= rampUpTime) {
      revenueMultiplier = year / rampUpTime * 0.6; // Ramp up to 60% in first period
    } else if (year <= rampUpTime + 1) {
      revenueMultiplier = 0.8; // 80% in second period
    } else {
      revenueMultiplier = Math.min(1.0, 0.8 + (year - rampUpTime - 1) * 0.1); // Grow to 100%
    }
    
    projections.push({
      year,
      revenue: Math.round(fullMarketRevenue * revenueMultiplier),
      marketShare: Math.round(marketShare * revenueMultiplier * 100 * 100) / 100, // Percentage with 2 decimals
      cumulativeRevenue: projections.reduce((sum, p) => sum + p.revenue, 0) + Math.round(fullMarketRevenue * revenueMultiplier),
    });
  }
  
  return {
    projections,
    fullMarketRevenue: Math.round(fullMarketRevenue),
    totalFiveYearRevenue: projections.reduce((sum, p) => sum + p.revenue, 0),
  };
}

function calculateROI(revenueProjections: any, requiredInvestment: number) {
  const totalRevenue = revenueProjections.totalFiveYearRevenue;
  const grossProfit = totalRevenue * 0.3; // Assume 30% gross margin
  const netProfit = grossProfit - requiredInvestment;
  const roi = (netProfit / requiredInvestment) * 100;
  
  // Calculate payback period
  let cumulativeProfit = -requiredInvestment;
  let paybackPeriod = 'More than 5 years';
  
  for (const projection of revenueProjections.projections) {
    cumulativeProfit += projection.revenue * 0.3; // 30% margin
    if (cumulativeProfit > 0) {
      paybackPeriod = `${projection.year} years`;
      break;
    }
  }
  
  return {
    totalRevenue,
    grossProfit: Math.round(grossProfit),
    netProfit: Math.round(netProfit),
    roi: Math.round(roi),
    paybackPeriod,
    irr: calculateIRR(revenueProjections.projections, requiredInvestment),
  };
}

function calculateIRR(projections: any[], investment: number) {
  // Simplified IRR calculation
  const cashFlows = [-investment];
  projections.forEach(p => {
    cashFlows.push(p.revenue * 0.3); // 30% margin
  });
  
  // Approximate IRR using simple calculation
  const totalCashFlow = cashFlows.slice(1).reduce((sum, cf) => sum + cf, 0);
  const averageAnnualCashFlow = totalCashFlow / projections.length;
  const approximateIRR = ((averageAnnualCashFlow / investment) * 100);
  
  return Math.round(approximateIRR);
}

function performSensitivityAnalysis(
  marketSize: number,
  marketShare: number,
  investment: number
) {
  const scenarios = {
    optimistic: {
      marketSizeMultiplier: 1.3,
      marketShareMultiplier: 1.5,
      description: 'Market grows 30%, achieve 50% higher share',
    },
    realistic: {
      marketSizeMultiplier: 1.0,
      marketShareMultiplier: 1.0,
      description: 'Base case scenario',
    },
    pessimistic: {
      marketSizeMultiplier: 0.7,
      marketShareMultiplier: 0.6,
      description: 'Market shrinks 30%, achieve 40% lower share',
    },
  };
  
  const results = {};
  
  Object.entries(scenarios).forEach(([scenario, params]) => {
    const adjustedMarketSize = marketSize * params.marketSizeMultiplier;
    const adjustedMarketShare = marketShare * params.marketShareMultiplier;
    const annualRevenue = adjustedMarketSize * adjustedMarketShare;
    const fiveYearRevenue = annualRevenue * 4; // Simplified 5-year total
    const roi = ((fiveYearRevenue * 0.3 - investment) / investment) * 100;
    
    results[scenario] = {
      description: params.description,
      annualRevenue: Math.round(annualRevenue),
      fiveYearRevenue: Math.round(fiveYearRevenue),
      roi: Math.round(roi),
    };
  });
  
  return results;
}

function calculateBreakEven(revenueProjections: any, investment: number) {
  const monthlyFixedCosts = investment * 0.02; // Assume 2% monthly fixed costs
  const variableCostRatio = 0.7; // 70% variable costs
  
  let breakEvenMonth = 'Not achieved in 5 years';
  let cumulativeProfit = -investment;
  
  revenueProjections.projections.forEach((projection, index) => {
    const monthlyRevenue = projection.revenue / 12;
    const monthlyProfit = monthlyRevenue * (1 - variableCostRatio) - monthlyFixedCosts;
    
    for (let month = 1; month <= 12; month++) {
      cumulativeProfit += monthlyProfit;
      if (cumulativeProfit > 0 && breakEvenMonth === 'Not achieved in 5 years') {
        breakEvenMonth = `Year ${projection.year}, Month ${month}`;
        break;
      }
    }
  });
  
  return {
    breakEvenPoint: breakEvenMonth,
    monthlyFixedCosts: Math.round(monthlyFixedCosts),
    variableCostRatio: Math.round(variableCostRatio * 100),
    contributionMargin: Math.round((1 - variableCostRatio) * 100),
  };
}

function assessRisks(
  riskLevel: string,
  competitionLevel: string,
  requiredInvestment: number,
  timeToMarket: string,
  capabilityMatch: string,
  inputs: any
) {
  const risks = [];
  
  // Market risks
  if (competitionLevel === 'high' || competitionLevel === 'intense') {
    risks.push({
      category: 'Market Risk',
      risk: 'Intense Competition',
      probability: 'High',
      impact: 'High',
      description: 'High competition may limit market share and pricing power',
      mitigation: 'Differentiation strategy and competitive advantages',
    });
  }
  
  // Execution risks
  if (capabilityMatch === 'fair' || capabilityMatch === 'poor') {
    risks.push({
      category: 'Execution Risk',
      risk: 'Capability Gaps',
      probability: 'Medium',
      impact: 'High',
      description: 'Capability gaps may delay execution or increase costs',
      mitigation: 'Capability development plan and training programs',
    });
  }
  
  // Financial risks
  if (requiredInvestment > 500000) {
    risks.push({
      category: 'Financial Risk',
      risk: 'High Investment Requirements',
      probability: 'Medium',
      impact: 'Medium',
      description: 'Large investment creates financial exposure',
      mitigation: 'Phased investment approach and milestone-based funding',
    });
  }
  
  // Timing risks
  if (timeToMarket === '18_months' || timeToMarket === '24_months') {
    risks.push({
      category: 'Timing Risk',
      risk: 'Long Time to Market',
      probability: 'Medium',
      impact: 'Medium',
      description: 'Extended timeline increases market and competitive risks',
      mitigation: 'Accelerated development and early market validation',
    });
  }
  
  // Technology risks
  if (inputs.opportunityType === 'technology_upgrade') {
    risks.push({
      category: 'Technology Risk',
      risk: 'Technology Adoption',
      probability: 'Medium',
      impact: 'Medium',
      description: 'New technology may face adoption challenges',
      mitigation: 'Pilot programs and customer education',
    });
  }
  
  return {
    risks,
    overallRiskLevel: calculateOverallRiskLevel(risks, riskLevel),
    riskScore: calculateRiskScore(risks),
    mitigationPlan: generateMitigationPlan(risks),
  };
}

function calculateOverallRiskLevel(risks: any[], inputRiskLevel: string) {
  const highRisks = risks.filter(r => r.impact === 'High').length;
  const mediumRisks = risks.filter(r => r.impact === 'Medium').length;
  
  let calculatedLevel = 'Low';
  if (highRisks >= 2) calculatedLevel = 'Very High';
  else if (highRisks >= 1) calculatedLevel = 'High';
  else if (mediumRisks >= 3) calculatedLevel = 'Medium';
  else if (mediumRisks >= 1) calculatedLevel = 'Low';
  
  // Combine with input risk level
  const riskLevels = ['Low', 'Medium', 'High', 'Very High'];
  const inputIndex = riskLevels.indexOf(inputRiskLevel.charAt(0).toUpperCase() + inputRiskLevel.slice(1));
  const calculatedIndex = riskLevels.indexOf(calculatedLevel);
  
  return riskLevels[Math.max(inputIndex, calculatedIndex)];
}

function calculateRiskScore(risks: any[]) {
  let score = 100; // Start with perfect score
  
  risks.forEach(risk => {
    const impactDeduction = {
      'High': 20,
      'Medium': 10,
      'Low': 5,
    };
    
    const probabilityMultiplier = {
      'High': 1.0,
      'Medium': 0.7,
      'Low': 0.4,
    };
    
    const deduction = impactDeduction[risk.impact] * probabilityMultiplier[risk.probability];
    score -= deduction;
  });
  
  return Math.max(0, Math.round(score));
}

function generateMitigationPlan(risks: any[]) {
  const plan = {
    immediate: [],
    shortTerm: [],
    longTerm: [],
  };
  
  risks.forEach(risk => {
    if (risk.impact === 'High' && risk.probability === 'High') {
      plan.immediate.push({
        action: risk.mitigation,
        risk: risk.risk,
        timeline: '0-3 months',
      });
    } else if (risk.impact === 'High' || risk.probability === 'High') {
      plan.shortTerm.push({
        action: risk.mitigation,
        risk: risk.risk,
        timeline: '3-12 months',
      });
    } else {
      plan.longTerm.push({
        action: risk.mitigation,
        risk: risk.risk,
        timeline: '12+ months',
      });
    }
  });
  
  return plan;
}

function generateRecommendations(
  opportunityScore: any,
  financialAnalysis: any,
  riskAssessment: any,
  inputs: any
) {
  const decision = determineDecision(opportunityScore.overallScore, riskAssessment.overallRiskLevel);
  const nextSteps = generateNextSteps(decision, opportunityScore, inputs);
  const alternatives = generateAlternatives(inputs, opportunityScore);
  const successFactors = identifySuccessFactors(inputs, opportunityScore);
  
  return {
    decision,
    nextSteps,
    alternatives,
    successFactors,
    timeline: generateTimeline(decision, inputs.timeToMarket),
    investmentStrategy: generateInvestmentStrategy(decision, inputs.requiredInvestment),
  };
}

function determineDecision(score: number, riskLevel: string) {
  if (score >= 85 && (riskLevel === 'Low' || riskLevel === 'Medium')) {
    return {
      recommendation: 'Strongly Pursue',
      confidence: 'High',
      rationale: 'Excellent opportunity with manageable risk',
    };
  } else if (score >= 70 && riskLevel !== 'Very High') {
    return {
      recommendation: 'Pursue with Caution',
      confidence: 'Medium',
      rationale: 'Good opportunity but requires careful risk management',
    };
  } else if (score >= 55) {
    return {
      recommendation: 'Further Analysis Required',
      confidence: 'Low',
      rationale: 'Opportunity has potential but needs deeper evaluation',
    };
  } else {
    return {
      recommendation: 'Do Not Pursue',
      confidence: 'High',
      rationale: 'Opportunity does not meet minimum criteria',
    };
  }
}

function generateNextSteps(decision: any, opportunityScore: any, inputs: any) {
  const steps = [];
  
  if (decision.recommendation === 'Strongly Pursue') {
    steps.push('Develop detailed implementation plan');
    steps.push('Secure necessary funding and resources');
    steps.push('Begin capability development if needed');
    steps.push('Initiate market entry activities');
  } else if (decision.recommendation === 'Pursue with Caution') {
    steps.push('Develop comprehensive risk mitigation plan');
    steps.push('Conduct pilot program or market test');
    steps.push('Secure stakeholder buy-in');
    steps.push('Establish success metrics and monitoring');
  } else if (decision.recommendation === 'Further Analysis Required') {
    steps.push('Conduct additional market research');
    steps.push('Validate financial assumptions');
    steps.push('Assess competitive landscape in detail');
    steps.push('Evaluate capability requirements');
  } else {
    steps.push('Document analysis for future reference');
    steps.push('Monitor market conditions for changes');
    steps.push('Explore alternative opportunities');
    steps.push('Focus resources on higher-priority initiatives');
  }
  
  return steps;
}

function generateAlternatives(inputs: any, opportunityScore: any) {
  const alternatives = [];
  
  // Phased approach alternative
  if (inputs.requiredInvestment > 200000) {
    alternatives.push({
      alternative: 'Phased Implementation',
      description: 'Implement opportunity in smaller phases to reduce risk',
      pros: ['Lower initial investment', 'Reduced risk', 'Learning opportunities'],
      cons: ['Slower market entry', 'Potential competitive disadvantage'],
    });
  }
  
  // Partnership alternative
  if (opportunityScore.weaknesses.some(w => w.area === 'Strategic')) {
    alternatives.push({
      alternative: 'Strategic Partnership',
      description: 'Partner with another company to pursue opportunity',
      pros: ['Shared risk and investment', 'Complementary capabilities', 'Faster entry'],
      cons: ['Shared returns', 'Coordination complexity', 'Dependency risk'],
    });
  }
  
  // Wait and see alternative
  if (inputs.timeToMarket === '24_months') {
    alternatives.push({
      alternative: 'Delayed Entry',
      description: 'Wait for market conditions to improve or risks to decrease',
      pros: ['Reduced uncertainty', 'Better timing', 'Lower risk'],
      cons: ['Missed opportunity', 'Competitive disadvantage', 'Market changes'],
    });
  }
  
  return alternatives;
}

function identifySuccessFactors(inputs: any, opportunityScore: any) {
  const factors = [];
  
  // Address weaknesses
  opportunityScore.weaknesses.forEach(weakness => {
    factors.push({
      factor: `Address ${weakness.area} Gap`,
      importance: 'High',
      description: weakness.description,
    });
  });
  
  // Leverage strengths
  opportunityScore.strengths.slice(0, 2).forEach(strength => {
    factors.push({
      factor: `Leverage ${strength.area} Advantage`,
      importance: 'Medium',
      description: strength.description,
    });
  });
  
  // General success factors
  factors.push({
    factor: 'Strong Execution',
    importance: 'High',
    description: 'Disciplined execution of implementation plan',
  });
  
  factors.push({
    factor: 'Market Monitoring',
    importance: 'Medium',
    description: 'Continuous monitoring of market and competitive changes',
  });
  
  return factors.slice(0, 5);
}

function generateTimeline(decision: any, timeToMarket: string) {
  const phases = [];
  
  if (decision.recommendation === 'Strongly Pursue' || decision.recommendation === 'Pursue with Caution') {
    phases.push({
      phase: 'Planning',
      duration: '1-3 months',
      activities: ['Detailed planning', 'Resource allocation', 'Team formation'],
    });
    
    phases.push({
      phase: 'Development',
      duration: timeToMarket,
      activities: ['Capability building', 'Product/service development', 'Market preparation'],
    });
    
    phases.push({
      phase: 'Launch',
      duration: '3-6 months',
      activities: ['Market entry', 'Customer acquisition', 'Performance monitoring'],
    });
  } else {
    phases.push({
      phase: 'Analysis',
      duration: '2-4 months',
      activities: ['Additional research', 'Validation', 'Alternative evaluation'],
    });
  }
  
  return phases;
}

function generateInvestmentStrategy(decision: any, requiredInvestment: number) {
  if (decision.recommendation === 'Do Not Pursue') {
    return {
      approach: 'No Investment',
      description: 'Opportunity does not warrant investment',
      phases: [],
    };
  }
  
  const phases = [];
  
  if (requiredInvestment > 500000) {
    phases.push({
      phase: 1,
      amount: Math.round(requiredInvestment * 0.3),
      purpose: 'Initial development and validation',
      timeline: '0-6 months',
    });
    
    phases.push({
      phase: 2,
      amount: Math.round(requiredInvestment * 0.5),
      purpose: 'Full development and market preparation',
      timeline: '6-18 months',
    });
    
    phases.push({
      phase: 3,
      amount: Math.round(requiredInvestment * 0.2),
      purpose: 'Market launch and scaling',
      timeline: '18-24 months',
    });
  } else {
    phases.push({
      phase: 1,
      amount: Math.round(requiredInvestment * 0.6),
      purpose: 'Development and preparation',
      timeline: '0-12 months',
    });
    
    phases.push({
      phase: 2,
      amount: Math.round(requiredInvestment * 0.4),
      purpose: 'Launch and initial scaling',
      timeline: '12-18 months',
    });
  }
  
  return {
    approach: phases.length > 2 ? 'Phased Investment' : 'Two-Phase Investment',
    description: 'Staged investment approach to manage risk and validate progress',
    phases,
    totalInvestment: requiredInvestment,
  };
}

export default opportunityAssessmentConfig;
