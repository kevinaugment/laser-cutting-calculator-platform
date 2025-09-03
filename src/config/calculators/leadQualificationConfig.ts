import { CalculatorConfig } from '../../types/calculator';

export const leadQualificationConfig: CalculatorConfig = {
  id: 'lead-qualification',
  name: 'Lead Qualification Scorer',
  description: 'Systematically qualify and score potential customers to prioritize sales efforts and improve conversion rates.',
  category: 'customer-acquisition',
  difficulty: 'intermediate',
  estimatedTime: '4-5 minutes',
  
  inputs: [
    {
      id: 'companySize',
      label: 'Company Size',
      type: 'select',
      value: 'medium',
      options: [
        { value: 'startup', label: 'Startup (1-10 employees)' },
        { value: 'small', label: 'Small (11-50 employees)' },
        { value: 'medium', label: 'Medium (51-200 employees)' },
        { value: 'large', label: 'Large (200+ employees)' },
      ],
      required: true,
      description: 'Size of the prospect company',
    },
    {
      id: 'industry',
      label: 'Industry Sector',
      type: 'select',
      value: 'manufacturing',
      options: [
        { value: 'manufacturing', label: 'Manufacturing' },
        { value: 'automotive', label: 'Automotive' },
        { value: 'aerospace', label: 'Aerospace' },
        { value: 'electronics', label: 'Electronics' },
        { value: 'medical', label: 'Medical Devices' },
        { value: 'construction', label: 'Construction' },
        { value: 'other', label: 'Other' },
      ],
      required: true,
      description: 'Industry sector of the prospect',
    },
    {
      id: 'projectBudget',
      label: 'Estimated Project Budget',
      type: 'select',
      value: 'medium',
      options: [
        { value: 'low', label: 'Low ($500-$2,000)' },
        { value: 'medium', label: 'Medium ($2,000-$10,000)' },
        { value: 'high', label: 'High ($10,000-$50,000)' },
        { value: 'enterprise', label: 'Enterprise ($50,000+)' },
      ],
      required: true,
      description: 'Estimated budget for the project',
    },
    {
      id: 'timeline',
      label: 'Project Timeline',
      type: 'select',
      value: 'normal',
      options: [
        { value: 'immediate', label: 'Immediate (Within 1 week)' },
        { value: 'urgent', label: 'Urgent (1-4 weeks)' },
        { value: 'normal', label: 'Normal (1-3 months)' },
        { value: 'future', label: 'Future (3+ months)' },
      ],
      required: true,
      description: 'When they need the project completed',
    },
    {
      id: 'decisionMaker',
      label: 'Decision Maker Access',
      type: 'select',
      value: 'indirect',
      options: [
        { value: 'direct', label: 'Direct (Speaking with decision maker)' },
        { value: 'indirect', label: 'Indirect (One level removed)' },
        { value: 'unknown', label: 'Unknown (Multiple levels removed)' },
      ],
      required: true,
      description: 'Level of access to decision maker',
    },
    {
      id: 'currentSupplier',
      label: 'Current Supplier Status',
      type: 'select',
      value: 'has_supplier',
      options: [
        { value: 'no_supplier', label: 'No Current Supplier' },
        { value: 'has_supplier', label: 'Has Current Supplier' },
        { value: 'multiple_suppliers', label: 'Multiple Suppliers' },
        { value: 'in_house', label: 'Currently In-House' },
      ],
      required: true,
      description: 'Current supplier situation',
    },
    {
      id: 'painPoints',
      label: 'Primary Pain Points',
      type: 'select',
      value: 'quality',
      options: [
        { value: 'cost', label: 'Cost Reduction' },
        { value: 'quality', label: 'Quality Issues' },
        { value: 'delivery', label: 'Delivery Problems' },
        { value: 'capacity', label: 'Capacity Constraints' },
        { value: 'service', label: 'Service Issues' },
        { value: 'none', label: 'No Major Issues' },
      ],
      required: true,
      description: 'Main problems with current situation',
    },
    {
      id: 'volumePotential',
      label: 'Volume Potential',
      type: 'select',
      value: 'medium',
      options: [
        { value: 'one_time', label: 'One-time Project' },
        { value: 'occasional', label: 'Occasional Repeat' },
        { value: 'medium', label: 'Medium Volume' },
        { value: 'high', label: 'High Volume Potential' },
      ],
      required: true,
      description: 'Potential for ongoing business',
    },
  ],

  outputs: [
    {
      id: 'qualificationScore',
      label: 'Qualification Score',
      type: 'object',
      format: 'score-breakdown',
      description: 'Overall qualification score and breakdown',
    },
    {
      id: 'leadRanking',
      label: 'Lead Ranking',
      type: 'object',
      format: 'lead-classification',
      description: 'Lead classification and priority level',
    },
    {
      id: 'actionPlan',
      label: 'Recommended Actions',
      type: 'array',
      format: 'action-items',
      description: 'Specific next steps and strategies',
    },
    {
      id: 'riskAssessment',
      label: 'Risk Assessment',
      type: 'object',
      format: 'risk-analysis',
      description: 'Potential risks and mitigation strategies',
    },
  ],

  calculate: (inputs: Record<string, any>) => {
    const {
      companySize,
      industry,
      projectBudget,
      timeline,
      decisionMaker,
      currentSupplier,
      painPoints,
      volumePotential,
    } = inputs;

    // Calculate qualification score
    const qualificationScore = calculateQualificationScore(inputs);

    // Determine lead ranking
    const leadRanking = determineLeadRanking(qualificationScore.totalScore, inputs);

    // Generate action plan
    const actionPlan = generateActionPlan(leadRanking, inputs);

    // Assess risks
    const riskAssessment = assessRisks(inputs, qualificationScore);

    return {
      qualificationScore,
      leadRanking,
      actionPlan,
      riskAssessment,
    };
  },

  validation: {},

  examples: [
    {
      name: 'High-Potential Manufacturing Lead',
      description: 'Large manufacturing company with immediate needs',
      inputs: {
        companySize: 'large',
        industry: 'manufacturing',
        projectBudget: 'high',
        timeline: 'urgent',
        decisionMaker: 'direct',
        currentSupplier: 'has_supplier',
        painPoints: 'quality',
        volumePotential: 'high',
      },
    },
    {
      name: 'Low-Priority Prospect',
      description: 'Small company with future needs and no pain points',
      inputs: {
        companySize: 'small',
        industry: 'other',
        projectBudget: 'low',
        timeline: 'future',
        decisionMaker: 'unknown',
        currentSupplier: 'has_supplier',
        painPoints: 'none',
        volumePotential: 'one_time',
      },
    },
  ],

  tags: ['lead', 'qualification', 'sales', 'scoring', 'prioritization'],
  
  relatedCalculators: [
    'quote-generator',
    'customer-lifetime-value',
    'market-penetration',
    'sales-forecasting',
  ],

  learningResources: [
    {
      title: 'Lead Qualification Best Practices',
      type: 'article',
      url: '/learn/lead-qualification',
    },
    {
      title: 'BANT Qualification Framework',
      type: 'video',
      url: '/learn/bant-framework',
    },
  ],
};

// Helper functions
function calculateQualificationScore(inputs: any) {
  const scores = {
    companySize: 0,
    industry: 0,
    projectBudget: 0,
    timeline: 0,
    decisionMaker: 0,
    currentSupplier: 0,
    painPoints: 0,
    volumePotential: 0,
  };

  // Company size scoring
  const companySizeScores = {
    startup: 5,
    small: 10,
    medium: 15,
    large: 20,
  };
  scores.companySize = companySizeScores[inputs.companySize] || 10;

  // Industry scoring
  const industryScores = {
    manufacturing: 20,
    automotive: 18,
    aerospace: 16,
    electronics: 15,
    medical: 14,
    construction: 12,
    other: 8,
  };
  scores.industry = industryScores[inputs.industry] || 10;

  // Budget scoring
  const budgetScores = {
    low: 5,
    medium: 15,
    high: 20,
    enterprise: 25,
  };
  scores.projectBudget = budgetScores[inputs.projectBudget] || 10;

  // Timeline scoring
  const timelineScores = {
    immediate: 25,
    urgent: 20,
    normal: 15,
    future: 5,
  };
  scores.timeline = timelineScores[inputs.timeline] || 10;

  // Decision maker access scoring
  const decisionMakerScores = {
    direct: 20,
    indirect: 12,
    unknown: 5,
  };
  scores.decisionMaker = decisionMakerScores[inputs.decisionMaker] || 10;

  // Current supplier scoring
  const supplierScores = {
    no_supplier: 20,
    has_supplier: 10,
    multiple_suppliers: 15,
    in_house: 8,
  };
  scores.currentSupplier = supplierScores[inputs.currentSupplier] || 10;

  // Pain points scoring
  const painPointScores = {
    cost: 15,
    quality: 20,
    delivery: 18,
    capacity: 16,
    service: 14,
    none: 2,
  };
  scores.painPoints = painPointScores[inputs.painPoints] || 10;

  // Volume potential scoring
  const volumeScores = {
    one_time: 5,
    occasional: 10,
    medium: 15,
    high: 20,
  };
  scores.volumePotential = volumeScores[inputs.volumePotential] || 10;

  const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
  const maxPossibleScore = 165; // Sum of all maximum scores
  const percentageScore = Math.round((totalScore / maxPossibleScore) * 100);

  return {
    breakdown: scores,
    totalScore,
    percentageScore,
    maxPossibleScore,
    scoreInterpretation: getScoreInterpretation(percentageScore),
  };
}

function getScoreInterpretation(percentage: number) {
  if (percentage >= 80) return 'Excellent - High priority lead';
  if (percentage >= 65) return 'Good - Strong potential';
  if (percentage >= 50) return 'Fair - Moderate potential';
  if (percentage >= 35) return 'Poor - Low priority';
  return 'Very Poor - Consider disqualifying';
}

function determineLeadRanking(totalScore: number, inputs: any) {
  let tier = 'C';
  let priority = 'Low';
  let conversionProbability = 10;

  if (totalScore >= 130) {
    tier = 'A';
    priority = 'High';
    conversionProbability = 70;
  } else if (totalScore >= 100) {
    tier = 'B';
    priority = 'Medium';
    conversionProbability = 45;
  } else if (totalScore >= 70) {
    tier = 'C';
    priority = 'Low';
    conversionProbability = 25;
  } else {
    tier = 'D';
    priority = 'Very Low';
    conversionProbability = 10;
  }

  // Adjust for specific factors
  if (inputs.timeline === 'immediate') conversionProbability += 15;
  if (inputs.painPoints === 'quality' || inputs.painPoints === 'delivery') conversionProbability += 10;
  if (inputs.decisionMaker === 'direct') conversionProbability += 10;

  conversionProbability = Math.min(90, conversionProbability);

  return {
    tier,
    priority,
    conversionProbability,
    description: getTierDescription(tier),
    recommendedAction: getRecommendedAction(tier, inputs),
    followUpFrequency: getFollowUpFrequency(tier),
  };
}

function getTierDescription(tier: string) {
  const descriptions = {
    A: 'Hot lead - Immediate attention required',
    B: 'Warm lead - Active pursuit recommended',
    C: 'Cool lead - Nurture and monitor',
    D: 'Cold lead - Minimal resources allocated',
  };
  return descriptions[tier] || 'Unknown tier';
}

function getRecommendedAction(tier: string, inputs: any) {
  if (tier === 'A') {
    return inputs.timeline === 'immediate' ? 
      'Schedule immediate meeting/call' : 
      'Prepare detailed proposal within 24 hours';
  }
  if (tier === 'B') {
    return 'Schedule discovery call within 3 days';
  }
  if (tier === 'C') {
    return 'Add to nurture campaign, follow up monthly';
  }
  return 'Add to database, quarterly check-in';
}

function getFollowUpFrequency(tier: string) {
  const frequencies = {
    A: 'Daily until closed',
    B: 'Weekly',
    C: 'Monthly',
    D: 'Quarterly',
  };
  return frequencies[tier] || 'As needed';
}

function generateActionPlan(leadRanking: any, inputs: any) {
  const actions = [];

  // Immediate actions based on tier
  if (leadRanking.tier === 'A') {
    actions.push({
      action: 'Immediate Contact',
      priority: 'Critical',
      timeframe: 'Within 2 hours',
      description: 'Contact lead immediately while interest is high',
      owner: 'Sales Manager',
    });
  }

  // Timeline-based actions
  if (inputs.timeline === 'immediate' || inputs.timeline === 'urgent') {
    actions.push({
      action: 'Fast-Track Proposal',
      priority: 'High',
      timeframe: 'Within 24 hours',
      description: 'Prepare and deliver proposal quickly',
      owner: 'Sales Team',
    });
  }

  // Decision maker actions
  if (inputs.decisionMaker !== 'direct') {
    actions.push({
      action: 'Identify Decision Maker',
      priority: 'High',
      timeframe: 'Within 1 week',
      description: 'Map decision-making process and key stakeholders',
      owner: 'Account Executive',
    });
  }

  // Pain point actions
  if (inputs.painPoints !== 'none') {
    actions.push({
      action: 'Pain Point Discovery',
      priority: 'Medium',
      timeframe: 'Next call',
      description: 'Deep dive into specific pain points and quantify impact',
      owner: 'Sales Team',
    });
  }

  // Competitive actions
  if (inputs.currentSupplier === 'has_supplier') {
    actions.push({
      action: 'Competitive Analysis',
      priority: 'Medium',
      timeframe: 'Within 3 days',
      description: 'Research current supplier and identify differentiation opportunities',
      owner: 'Sales Support',
    });
  }

  // Volume potential actions
  if (inputs.volumePotential === 'high') {
    actions.push({
      action: 'Volume Pricing Strategy',
      priority: 'Medium',
      timeframe: 'Before proposal',
      description: 'Develop volume-based pricing and terms',
      owner: 'Pricing Team',
    });
  }

  return actions.slice(0, 5); // Limit to top 5 actions
}

function assessRisks(inputs: any, qualificationScore: any) {
  const risks = [];

  // Low score risk
  if (qualificationScore.percentageScore < 50) {
    risks.push({
      risk: 'Low Qualification Score',
      severity: 'High',
      probability: 'High',
      impact: 'Wasted sales resources',
      mitigation: 'Focus on higher-scoring leads first',
    });
  }

  // Budget risk
  if (inputs.projectBudget === 'low') {
    risks.push({
      risk: 'Limited Budget',
      severity: 'Medium',
      probability: 'Medium',
      impact: 'Low margin or no deal',
      mitigation: 'Emphasize value proposition and ROI',
    });
  }

  // Timeline risk
  if (inputs.timeline === 'future') {
    risks.push({
      risk: 'Distant Timeline',
      severity: 'Medium',
      probability: 'High',
      impact: 'Deal may not materialize',
      mitigation: 'Nurture relationship, stay top-of-mind',
    });
  }

  // Decision maker risk
  if (inputs.decisionMaker === 'unknown') {
    risks.push({
      risk: 'No Decision Maker Access',
      severity: 'High',
      probability: 'High',
      impact: 'Unable to close deal',
      mitigation: 'Map organization and find path to decision maker',
    });
  }

  // Competition risk
  if (inputs.currentSupplier === 'has_supplier' && inputs.painPoints === 'none') {
    risks.push({
      risk: 'Satisfied with Current Supplier',
      severity: 'High',
      probability: 'Medium',
      impact: 'Difficult to win business',
      mitigation: 'Find hidden pain points or create new value',
    });
  }

  return {
    risks,
    overallRiskLevel: calculateOverallRisk(risks),
    riskScore: calculateRiskScore(risks),
    mitigation: generateRiskMitigation(risks),
  };
}

function calculateOverallRisk(risks: any[]) {
  const highRisks = risks.filter(r => r.severity === 'High').length;
  const mediumRisks = risks.filter(r => r.severity === 'Medium').length;

  if (highRisks >= 2) return 'High';
  if (highRisks >= 1 || mediumRisks >= 3) return 'Medium';
  if (mediumRisks >= 1) return 'Low';
  return 'Very Low';
}

function calculateRiskScore(risks: any[]) {
  let score = 0;
  risks.forEach(risk => {
    if (risk.severity === 'High') score += 3;
    else if (risk.severity === 'Medium') score += 2;
    else score += 1;
  });
  return Math.min(10, score);
}

function generateRiskMitigation(risks: any[]) {
  if (risks.length === 0) {
    return ['Continue with standard sales process', 'Monitor for new risks'];
  }

  const strategies = [];
  
  if (risks.some(r => r.risk.includes('Decision Maker'))) {
    strategies.push('Prioritize stakeholder mapping and access');
  }
  
  if (risks.some(r => r.risk.includes('Budget'))) {
    strategies.push('Focus on value-based selling and ROI demonstration');
  }
  
  if (risks.some(r => r.risk.includes('Timeline'))) {
    strategies.push('Implement lead nurturing campaign');
  }
  
  strategies.push('Regular risk assessment and mitigation review');
  
  return strategies;
}

export default leadQualificationConfig;
