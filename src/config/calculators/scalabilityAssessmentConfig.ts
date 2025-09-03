import { CalculatorConfig } from '../../types/calculator';

export const scalabilityAssessmentConfig: CalculatorConfig = {
  id: 'scalability-assessment',
  name: 'Scalability Assessment Calculator',
  description: 'Assess business scalability potential and identify key factors for sustainable growth in laser cutting operations.',
  category: 'capacity-planning',
  difficulty: 'advanced',
  estimatedTime: '5-6 minutes',
  
  inputs: [
    {
      id: 'currentRevenue',
      label: 'Current Annual Revenue',
      type: 'number',
      value: 1500000,
      unit: 'USD',
      min: 100000,
      max: 20000000,
      step: 50000,
      required: true,
      description: 'Current annual revenue',
    },
    {
      id: 'targetRevenue',
      label: 'Target Revenue (3 years)',
      type: 'number',
      value: 4000000,
      unit: 'USD',
      min: 200000,
      max: 50000000,
      step: 100000,
      required: true,
      description: 'Target revenue in 3 years',
    },
    {
      id: 'currentEmployees',
      label: 'Current Employee Count',
      type: 'number',
      value: 12,
      min: 2,
      max: 200,
      step: 1,
      required: true,
      description: 'Current number of employees',
    },
    {
      id: 'operationalComplexity',
      label: 'Operational Complexity',
      type: 'select',
      value: 'medium',
      options: [
        { value: 'low', label: 'Low (Simple operations)' },
        { value: 'medium', label: 'Medium (Moderate complexity)' },
        { value: 'high', label: 'High (Complex operations)' },
        { value: 'very_high', label: 'Very High (Highly complex)' },
      ],
      required: true,
      description: 'Current operational complexity level',
    },
    {
      id: 'technologyLevel',
      label: 'Technology Sophistication',
      type: 'select',
      value: 'modern',
      options: [
        { value: 'basic', label: 'Basic (Manual processes)' },
        { value: 'standard', label: 'Standard (Some automation)' },
        { value: 'modern', label: 'Modern (Good automation)' },
        { value: 'advanced', label: 'Advanced (High automation)' },
      ],
      required: true,
      description: 'Current technology sophistication level',
    },
    {
      id: 'processStandardization',
      label: 'Process Standardization',
      type: 'select',
      value: 'partial',
      options: [
        { value: 'minimal', label: 'Minimal (Ad-hoc processes)' },
        { value: 'partial', label: 'Partial (Some standards)' },
        { value: 'good', label: 'Good (Most processes standardized)' },
        { value: 'excellent', label: 'Excellent (Fully standardized)' },
      ],
      required: true,
      description: 'Level of process standardization',
    },
    {
      id: 'marketPosition',
      label: 'Market Position',
      type: 'select',
      value: 'established',
      options: [
        { value: 'startup', label: 'Startup (New to market)' },
        { value: 'emerging', label: 'Emerging (Growing presence)' },
        { value: 'established', label: 'Established (Strong position)' },
        { value: 'dominant', label: 'Dominant (Market leader)' },
      ],
      required: true,
      description: 'Current market position',
    },
    {
      id: 'customerBase',
      label: 'Customer Base Diversity',
      type: 'select',
      value: 'moderate',
      options: [
        { value: 'concentrated', label: 'Concentrated (Few large customers)' },
        { value: 'moderate', label: 'Moderate (Mixed customer base)' },
        { value: 'diversified', label: 'Diversified (Many customers)' },
      ],
      required: true,
      description: 'Diversity of customer base',
    },
  ],

  outputs: [
    {
      id: 'scalabilityScore',
      label: 'Scalability Score',
      type: 'object',
      format: 'scalability-rating',
      description: 'Overall scalability assessment and score',
    },
    {
      id: 'growthFactors',
      label: 'Growth Factors Analysis',
      type: 'array',
      format: 'factor-analysis',
      description: 'Analysis of key growth enabling and limiting factors',
    },
    {
      id: 'scalingStrategy',
      label: 'Scaling Strategy',
      type: 'object',
      format: 'scaling-roadmap',
      description: 'Recommended scaling strategy and approach',
    },
    {
      id: 'investmentRequirements',
      label: 'Investment Requirements',
      type: 'object',
      format: 'investment-analysis',
      description: 'Investment needed for successful scaling',
    },
  ],

  calculate: (inputs: Record<string, any>) => {
    const {
      currentRevenue,
      targetRevenue,
      currentEmployees,
      operationalComplexity,
      technologyLevel,
      processStandardization,
      marketPosition,
      customerBase,
    } = inputs;

    // Calculate scalability score
    const scalabilityScore = calculateScalabilityScore(inputs);

    // Analyze growth factors
    const growthFactors = analyzeGrowthFactors(inputs, scalabilityScore);

    // Develop scaling strategy
    const scalingStrategy = developScalingStrategy(
      currentRevenue,
      targetRevenue,
      scalabilityScore,
      inputs
    );

    // Calculate investment requirements
    const investmentRequirements = calculateInvestmentRequirements(
      currentRevenue,
      targetRevenue,
      currentEmployees,
      scalingStrategy
    );

    return {
      scalabilityScore,
      growthFactors,
      scalingStrategy,
      investmentRequirements,
    };
  },

  validation: {
    currentRevenue: {
      min: 100000,
      max: 20000000,
      message: 'Current revenue must be between $100K and $20M',
    },
    targetRevenue: {
      min: 200000,
      max: 50000000,
      message: 'Target revenue must be between $200K and $50M',
    },
    currentEmployees: {
      min: 2,
      max: 200,
      message: 'Employee count must be between 2 and 200',
    },
  },

  examples: [
    {
      name: 'High-Growth Startup',
      description: 'Fast-growing startup with aggressive targets',
      inputs: {
        currentRevenue: 800000,
        targetRevenue: 5000000,
        currentEmployees: 8,
        operationalComplexity: 'medium',
        technologyLevel: 'modern',
        processStandardization: 'partial',
        marketPosition: 'emerging',
        customerBase: 'moderate',
      },
    },
    {
      name: 'Established Business',
      description: 'Established business planning steady growth',
      inputs: {
        currentRevenue: 3000000,
        targetRevenue: 6000000,
        currentEmployees: 25,
        operationalComplexity: 'high',
        technologyLevel: 'advanced',
        processStandardization: 'good',
        marketPosition: 'established',
        customerBase: 'diversified',
      },
    },
  ],

  tags: ['scalability', 'growth', 'assessment', 'strategy', 'planning'],
  
  relatedCalculators: [
    'expansion-planning',
    'demand-forecasting',
    'resource-allocation',
    'market-penetration',
  ],

  learningResources: [
    {
      title: 'Business Scalability Principles',
      type: 'article',
      url: '/learn/scalability-principles',
    },
    {
      title: 'Scaling Manufacturing Operations',
      type: 'video',
      url: '/learn/scaling-operations',
    },
  ],
};

// Helper functions
function calculateScalabilityScore(inputs: any) {
  const scores = {
    technology: 0,
    processes: 0,
    market: 0,
    operations: 0,
    financial: 0,
  };

  // Technology score
  const techScores = { basic: 20, standard: 40, modern: 70, advanced: 90 };
  scores.technology = techScores[inputs.technologyLevel] || 50;

  // Process score
  const processScores = { minimal: 20, partial: 45, good: 70, excellent: 90 };
  scores.processes = processScores[inputs.processStandardization] || 50;

  // Market score
  const marketScores = { startup: 30, emerging: 50, established: 75, dominant: 90 };
  scores.market = marketScores[inputs.marketPosition] || 50;

  // Operations score (inverse of complexity)
  const operationsScores = { low: 90, medium: 70, high: 50, very_high: 30 };
  scores.operations = operationsScores[inputs.operationalComplexity] || 50;

  // Financial score (based on growth target reasonableness)
  const growthMultiple = inputs.targetRevenue / inputs.currentRevenue;
  if (growthMultiple <= 2) scores.financial = 90;
  else if (growthMultiple <= 3) scores.financial = 75;
  else if (growthMultiple <= 5) scores.financial = 60;
  else if (growthMultiple <= 8) scores.financial = 40;
  else scores.financial = 20;

  // Customer base diversity bonus
  const customerBonus = {
    concentrated: -10,
    moderate: 0,
    diversified: 10,
  };
  const bonus = customerBonus[inputs.customerBase] || 0;

  const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0) / 5 + bonus;
  const finalScore = Math.max(0, Math.min(100, totalScore));

  return {
    overallScore: Math.round(finalScore),
    categoryScores: scores,
    rating: getScalabilityRating(finalScore),
    strengths: identifyStrengths(scores),
    weaknesses: identifyWeaknesses(scores),
    growthMultiple: Math.round(growthMultiple * 10) / 10,
  };
}

function getScalabilityRating(score: number) {
  if (score >= 80) return 'Excellent';
  if (score >= 65) return 'Good';
  if (score >= 50) return 'Fair';
  if (score >= 35) return 'Poor';
  return 'Very Poor';
}

function identifyStrengths(scores: any) {
  return Object.entries(scores)
    .filter(([_, score]) => score >= 70)
    .map(([category, score]) => ({
      category: category.charAt(0).toUpperCase() + category.slice(1),
      score,
      description: getStrengthDescription(category),
    }));
}

function identifyWeaknesses(scores: any) {
  return Object.entries(scores)
    .filter(([_, score]) => score < 50)
    .map(([category, score]) => ({
      category: category.charAt(0).toUpperCase() + category.slice(1),
      score,
      description: getWeaknessDescription(category),
    }));
}

function getStrengthDescription(category: string) {
  const descriptions = {
    technology: 'Strong technology foundation supports efficient scaling',
    processes: 'Well-standardized processes enable consistent growth',
    market: 'Strong market position provides growth opportunities',
    operations: 'Simple operations facilitate easy scaling',
    financial: 'Realistic financial targets support sustainable growth',
  };
  return descriptions[category] || 'Positive factor for scaling';
}

function getWeaknessDescription(category: string) {
  const descriptions = {
    technology: 'Technology limitations may constrain growth',
    processes: 'Lack of standardization creates scaling challenges',
    market: 'Weak market position limits growth potential',
    operations: 'Complex operations make scaling difficult',
    financial: 'Aggressive targets may be unrealistic',
  };
  return descriptions[category] || 'Potential constraint for scaling';
}

function analyzeGrowthFactors(inputs: any, scalabilityScore: any) {
  const factors = [];

  // Technology factor
  factors.push({
    factor: 'Technology Infrastructure',
    type: inputs.technologyLevel === 'advanced' || inputs.technologyLevel === 'modern' ? 'Enabler' : 'Constraint',
    impact: scalabilityScore.categoryScores.technology >= 70 ? 'High' : 'Medium',
    description: getTechnologyFactorDescription(inputs.technologyLevel),
    recommendations: getTechnologyRecommendations(inputs.technologyLevel),
  });

  // Process factor
  factors.push({
    factor: 'Process Standardization',
    type: inputs.processStandardization === 'good' || inputs.processStandardization === 'excellent' ? 'Enabler' : 'Constraint',
    impact: scalabilityScore.categoryScores.processes >= 70 ? 'High' : 'Medium',
    description: getProcessFactorDescription(inputs.processStandardization),
    recommendations: getProcessRecommendations(inputs.processStandardization),
  });

  // Market factor
  factors.push({
    factor: 'Market Position',
    type: inputs.marketPosition === 'established' || inputs.marketPosition === 'dominant' ? 'Enabler' : 'Neutral',
    impact: scalabilityScore.categoryScores.market >= 70 ? 'High' : 'Medium',
    description: getMarketFactorDescription(inputs.marketPosition),
    recommendations: getMarketRecommendations(inputs.marketPosition),
  });

  // Customer base factor
  factors.push({
    factor: 'Customer Base Diversity',
    type: inputs.customerBase === 'diversified' ? 'Enabler' : inputs.customerBase === 'concentrated' ? 'Risk' : 'Neutral',
    impact: inputs.customerBase === 'concentrated' ? 'High' : 'Medium',
    description: getCustomerFactorDescription(inputs.customerBase),
    recommendations: getCustomerRecommendations(inputs.customerBase),
  });

  // Financial factor
  factors.push({
    factor: 'Growth Targets',
    type: scalabilityScore.growthMultiple <= 3 ? 'Enabler' : scalabilityScore.growthMultiple <= 5 ? 'Neutral' : 'Risk',
    impact: scalabilityScore.growthMultiple > 5 ? 'High' : 'Medium',
    description: getFinancialFactorDescription(scalabilityScore.growthMultiple),
    recommendations: getFinancialRecommendations(scalabilityScore.growthMultiple),
  });

  return factors.sort((a, b) => {
    const impactOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
    return impactOrder[b.impact] - impactOrder[a.impact];
  });
}

function getTechnologyFactorDescription(level: string) {
  const descriptions = {
    basic: 'Manual processes limit scaling efficiency',
    standard: 'Some automation supports moderate growth',
    modern: 'Good automation enables efficient scaling',
    advanced: 'High automation provides excellent scaling foundation',
  };
  return descriptions[level] || 'Technology level affects scaling potential';
}

function getTechnologyRecommendations(level: string) {
  const recommendations = {
    basic: ['Invest in automation systems', 'Upgrade core technology'],
    standard: ['Expand automation coverage', 'Integrate systems'],
    modern: ['Optimize existing systems', 'Add advanced features'],
    advanced: ['Maintain technology leadership', 'Explore cutting-edge solutions'],
  };
  return recommendations[level] || ['Assess technology needs'];
}

function getProcessFactorDescription(level: string) {
  const descriptions = {
    minimal: 'Ad-hoc processes create scaling bottlenecks',
    partial: 'Some standardization supports limited scaling',
    good: 'Well-standardized processes enable smooth scaling',
    excellent: 'Fully standardized processes provide optimal scaling foundation',
  };
  return descriptions[level] || 'Process standardization affects scaling';
}

function getProcessRecommendations(level: string) {
  const recommendations = {
    minimal: ['Document core processes', 'Implement basic standards'],
    partial: ['Complete process standardization', 'Add quality controls'],
    good: ['Optimize existing processes', 'Add automation'],
    excellent: ['Continuous improvement', 'Share best practices'],
  };
  return recommendations[level] || ['Improve process standardization'];
}

function getMarketFactorDescription(position: string) {
  const descriptions = {
    startup: 'New market presence requires customer acquisition focus',
    emerging: 'Growing presence provides expansion opportunities',
    established: 'Strong position supports confident scaling',
    dominant: 'Market leadership enables aggressive growth',
  };
  return descriptions[position] || 'Market position affects growth potential';
}

function getMarketRecommendations(position: string) {
  const recommendations = {
    startup: ['Focus on customer acquisition', 'Build market presence'],
    emerging: ['Strengthen market position', 'Expand service offerings'],
    established: ['Leverage market position', 'Enter new segments'],
    dominant: ['Maintain leadership', 'Explore new markets'],
  };
  return recommendations[position] || ['Strengthen market position'];
}

function getCustomerFactorDescription(diversity: string) {
  const descriptions = {
    concentrated: 'Heavy dependence on few customers creates scaling risk',
    moderate: 'Balanced customer base supports steady growth',
    diversified: 'Diverse customer base provides stable scaling foundation',
  };
  return descriptions[diversity] || 'Customer diversity affects scaling stability';
}

function getCustomerRecommendations(diversity: string) {
  const recommendations = {
    concentrated: ['Diversify customer base', 'Reduce customer concentration'],
    moderate: ['Continue diversification', 'Strengthen key relationships'],
    diversified: ['Maintain diversity', 'Develop customer segments'],
  };
  return recommendations[diversity] || ['Optimize customer portfolio'];
}

function getFinancialFactorDescription(multiple: number) {
  if (multiple <= 2) return 'Conservative growth targets support sustainable scaling';
  if (multiple <= 3) return 'Moderate growth targets are achievable with good execution';
  if (multiple <= 5) return 'Aggressive targets require significant investment and execution';
  return 'Very aggressive targets may be unrealistic without major changes';
}

function getFinancialRecommendations(multiple: number) {
  if (multiple <= 2) return ['Focus on operational efficiency', 'Maintain steady growth'];
  if (multiple <= 3) return ['Invest in growth capabilities', 'Monitor progress closely'];
  if (multiple <= 5) return ['Develop detailed scaling plan', 'Secure adequate funding'];
  return ['Reassess growth targets', 'Consider phased approach'];
}

function developScalingStrategy(
  currentRevenue: number,
  targetRevenue: number,
  scalabilityScore: any,
  inputs: any
) {
  const growthMultiple = targetRevenue / currentRevenue;
  const annualGrowthRate = Math.pow(growthMultiple, 1/3) - 1; // 3-year CAGR
  
  // Determine scaling approach
  let approach = 'Organic Growth';
  if (growthMultiple > 5) approach = 'Aggressive Expansion';
  else if (growthMultiple > 3) approach = 'Accelerated Growth';
  else if (growthMultiple > 2) approach = 'Steady Growth';

  // Identify key scaling priorities
  const priorities = identifyScalingPriorities(scalabilityScore, inputs);
  
  // Generate scaling phases
  const phases = generateScalingPhases(growthMultiple, scalabilityScore, inputs);

  return {
    approach,
    annualGrowthRate: Math.round(annualGrowthRate * 100),
    scalingPriorities: priorities,
    phases,
    criticalSuccessFactors: identifyCriticalSuccessFactors(scalabilityScore, inputs),
    riskMitigation: generateRiskMitigation(scalabilityScore, growthMultiple),
  };
}

function identifyScalingPriorities(scalabilityScore: any, inputs: any) {
  const priorities = [];

  // Address weaknesses first
  scalabilityScore.weaknesses.forEach(weakness => {
    priorities.push({
      priority: 'High',
      area: weakness.category,
      description: `Address ${weakness.category.toLowerCase()} constraints`,
      rationale: weakness.description,
    });
  });

  // Leverage strengths
  scalabilityScore.strengths.slice(0, 2).forEach(strength => {
    priorities.push({
      priority: 'Medium',
      area: strength.category,
      description: `Leverage ${strength.category.toLowerCase()} advantages`,
      rationale: strength.description,
    });
  });

  return priorities.slice(0, 5);
}

function generateScalingPhases(growthMultiple: number, scalabilityScore: any, inputs: any) {
  const phases = [];

  // Phase 1: Foundation (0-12 months)
  phases.push({
    phase: 1,
    name: 'Foundation Building',
    duration: '0-12 months',
    objectives: [
      'Address critical weaknesses',
      'Strengthen core capabilities',
      'Prepare for growth',
    ],
    keyActions: getFoundationActions(scalabilityScore.weaknesses),
    targetGrowth: '20-40%',
  });

  // Phase 2: Acceleration (12-24 months)
  phases.push({
    phase: 2,
    name: 'Growth Acceleration',
    duration: '12-24 months',
    objectives: [
      'Scale operations',
      'Expand market presence',
      'Build team capabilities',
    ],
    keyActions: getAccelerationActions(inputs),
    targetGrowth: '40-80%',
  });

  // Phase 3: Optimization (24-36 months)
  phases.push({
    phase: 3,
    name: 'Scale Optimization',
    duration: '24-36 months',
    objectives: [
      'Optimize scaled operations',
      'Achieve target performance',
      'Prepare for next phase',
    ],
    keyActions: getOptimizationActions(growthMultiple),
    targetGrowth: 'Achieve target',
  });

  return phases;
}

function getFoundationActions(weaknesses: any[]) {
  const actions = ['Strengthen operational foundation', 'Improve core processes'];
  
  weaknesses.forEach(weakness => {
    if (weakness.category === 'Technology') {
      actions.push('Upgrade technology infrastructure');
    } else if (weakness.category === 'Processes') {
      actions.push('Standardize key processes');
    } else if (weakness.category === 'Market') {
      actions.push('Strengthen market position');
    }
  });

  return actions.slice(0, 4);
}

function getAccelerationActions(inputs: any) {
  const actions = [
    'Scale production capacity',
    'Expand team and capabilities',
    'Increase market penetration',
  ];

  if (inputs.customerBase === 'concentrated') {
    actions.push('Diversify customer base');
  }

  return actions;
}

function getOptimizationActions(growthMultiple: number) {
  const actions = [
    'Optimize scaled operations',
    'Achieve efficiency targets',
    'Consolidate market position',
  ];

  if (growthMultiple > 3) {
    actions.push('Integrate acquired capabilities');
  }

  return actions;
}

function identifyCriticalSuccessFactors(scalabilityScore: any, inputs: any) {
  const factors = [
    'Maintain operational excellence during growth',
    'Secure adequate funding for scaling',
    'Build and retain skilled team',
    'Preserve customer satisfaction',
  ];

  if (scalabilityScore.overallScore < 60) {
    factors.push('Address fundamental scalability constraints');
  }

  if (inputs.customerBase === 'concentrated') {
    factors.push('Diversify customer base to reduce risk');
  }

  return factors.slice(0, 5);
}

function generateRiskMitigation(scalabilityScore: any, growthMultiple: number) {
  const strategies = [];

  if (scalabilityScore.overallScore < 50) {
    strategies.push('Implement phased scaling approach to manage risks');
  }

  if (growthMultiple > 4) {
    strategies.push('Secure contingency funding for aggressive growth');
  }

  strategies.push('Monitor key performance indicators closely');
  strategies.push('Maintain operational flexibility');
  strategies.push('Build strong management team');

  return strategies;
}

function calculateInvestmentRequirements(
  currentRevenue: number,
  targetRevenue: number,
  currentEmployees: number,
  scalingStrategy: any
) {
  const revenueGrowth = targetRevenue - currentRevenue;
  
  // Estimate investment as percentage of revenue growth
  const investmentRatio = scalingStrategy.approach === 'Aggressive Expansion' ? 0.4 :
                         scalingStrategy.approach === 'Accelerated Growth' ? 0.3 :
                         scalingStrategy.approach === 'Steady Growth' ? 0.2 : 0.15;
  
  const totalInvestment = revenueGrowth * investmentRatio;
  
  // Break down investment categories
  const breakdown = {
    equipment: Math.round(totalInvestment * 0.4),
    technology: Math.round(totalInvestment * 0.2),
    facilities: Math.round(totalInvestment * 0.15),
    workforce: Math.round(totalInvestment * 0.15),
    marketing: Math.round(totalInvestment * 0.1),
  };

  // Estimate workforce growth
  const revenuePerEmployee = currentRevenue / currentEmployees;
  const targetEmployees = Math.round(targetRevenue / revenuePerEmployee);
  const employeeGrowth = targetEmployees - currentEmployees;

  return {
    totalInvestment: Math.round(totalInvestment),
    investmentBreakdown: breakdown,
    investmentAsPercentageOfGrowth: Math.round(investmentRatio * 100),
    workforceGrowth: {
      currentEmployees,
      targetEmployees,
      additionalEmployees: employeeGrowth,
      growthPercentage: Math.round((employeeGrowth / currentEmployees) * 100),
    },
    fundingOptions: generateFundingOptions(totalInvestment),
    roi: calculateScalingROI(totalInvestment, revenueGrowth),
  };
}

function generateFundingOptions(totalInvestment: number) {
  const options = [];

  if (totalInvestment < 500000) {
    options.push({
      option: 'Self-Funding',
      description: 'Fund growth from cash flow and savings',
      suitability: 'High',
    });
  }

  options.push({
    option: 'Bank Financing',
    description: 'Traditional bank loans and lines of credit',
    suitability: totalInvestment < 2000000 ? 'High' : 'Medium',
  });

  if (totalInvestment > 200000) {
    options.push({
      option: 'SBA Loans',
      description: 'Small Business Administration guaranteed loans',
      suitability: 'High',
    });
  }

  if (totalInvestment > 1000000) {
    options.push({
      option: 'Private Investment',
      description: 'Angel investors or private equity',
      suitability: 'Medium',
    });
  }

  return options;
}

function calculateScalingROI(investment: number, revenueGrowth: number) {
  // Assume 15% net margin on additional revenue
  const additionalProfit = revenueGrowth * 0.15;
  const roi = (additionalProfit / investment) * 100;
  const paybackYears = investment / (additionalProfit / 3); // 3-year period

  return {
    expectedROI: Math.round(roi),
    paybackPeriod: Math.round(paybackYears * 10) / 10,
    additionalAnnualProfit: Math.round(additionalProfit / 3),
  };
}

export default scalabilityAssessmentConfig;
