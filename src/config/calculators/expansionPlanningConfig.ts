import { CalculatorConfig } from '../../types/calculator';

export const expansionPlanningConfig: CalculatorConfig = {
  id: 'expansion-planning',
  name: 'Expansion Planning Calculator',
  description: 'Plan and evaluate business expansion strategies including facility, equipment, and workforce growth to meet future demand.',
  category: 'capacity-planning',
  difficulty: 'advanced',
  estimatedTime: '6-7 minutes',
  
  inputs: [
    {
      id: 'currentCapacity',
      label: 'Current Monthly Capacity',
      type: 'number',
      value: 800,
      unit: 'hours',
      min: 100,
      max: 5000,
      step: 50,
      required: true,
      description: 'Current monthly production capacity in machine hours',
    },
    {
      id: 'projectedDemand',
      label: 'Projected Demand (12 months)',
      type: 'number',
      value: 1200,
      unit: 'hours',
      min: 200,
      max: 10000,
      step: 50,
      required: true,
      description: 'Projected monthly demand in 12 months',
    },
    {
      id: 'expansionType',
      label: 'Expansion Type',
      type: 'select',
      value: 'equipment_only',
      options: [
        { value: 'equipment_only', label: 'Equipment Only' },
        { value: 'facility_expansion', label: 'Facility Expansion' },
        { value: 'new_location', label: 'New Location' },
        { value: 'comprehensive', label: 'Comprehensive Expansion' },
      ],
      required: true,
      description: 'Type of expansion being considered',
    },
    {
      id: 'availableBudget',
      label: 'Available Budget',
      type: 'number',
      value: 500000,
      unit: 'USD',
      min: 50000,
      max: 5000000,
      step: 25000,
      required: true,
      description: 'Total budget available for expansion',
    },
    {
      id: 'timeframe',
      label: 'Expansion Timeframe',
      type: 'select',
      value: '6_months',
      options: [
        { value: '3_months', label: '3 Months' },
        { value: '6_months', label: '6 Months' },
        { value: '12_months', label: '12 Months' },
        { value: '18_months', label: '18 Months' },
        { value: '24_months', label: '24 Months' },
      ],
      required: true,
      description: 'Target timeframe for expansion completion',
    },
    {
      id: 'riskTolerance',
      label: 'Risk Tolerance',
      type: 'select',
      value: 'moderate',
      options: [
        { value: 'conservative', label: 'Conservative' },
        { value: 'moderate', label: 'Moderate' },
        { value: 'aggressive', label: 'Aggressive' },
      ],
      required: true,
      description: 'Risk tolerance for expansion investment',
    },
    {
      id: 'marketConditions',
      label: 'Market Conditions',
      type: 'select',
      value: 'stable',
      options: [
        { value: 'declining', label: 'Declining' },
        { value: 'stable', label: 'Stable' },
        { value: 'growing', label: 'Growing' },
        { value: 'booming', label: 'Booming' },
      ],
      required: true,
      description: 'Current and expected market conditions',
    },
    {
      id: 'currentUtilization',
      label: 'Current Capacity Utilization',
      type: 'number',
      value: 85,
      unit: '%',
      min: 50,
      max: 100,
      step: 5,
      required: true,
      description: 'Current capacity utilization rate',
    },
  ],

  outputs: [
    {
      id: 'expansionStrategy',
      label: 'Expansion Strategy',
      type: 'object',
      format: 'strategy-plan',
      description: 'Recommended expansion strategy and approach',
    },
    {
      id: 'investmentPlan',
      label: 'Investment Plan',
      type: 'object',
      format: 'investment-breakdown',
      description: 'Detailed investment requirements and allocation',
    },
    {
      id: 'implementationRoadmap',
      label: 'Implementation Roadmap',
      type: 'array',
      format: 'roadmap-phases',
      description: 'Phased implementation plan with timelines',
    },
    {
      id: 'riskAssessment',
      label: 'Risk Assessment',
      type: 'object',
      format: 'expansion-risks',
      description: 'Analysis of expansion risks and mitigation strategies',
    },
  ],

  calculate: (inputs: Record<string, any>) => {
    const {
      currentCapacity,
      projectedDemand,
      expansionType,
      availableBudget,
      timeframe,
      riskTolerance,
      marketConditions,
      currentUtilization,
    } = inputs;

    // Develop expansion strategy
    const expansionStrategy = developExpansionStrategy(
      currentCapacity,
      projectedDemand,
      expansionType,
      riskTolerance,
      marketConditions,
      currentUtilization
    );

    // Create investment plan
    const investmentPlan = createInvestmentPlan(
      expansionStrategy,
      availableBudget,
      expansionType
    );

    // Generate implementation roadmap
    const implementationRoadmap = generateImplementationRoadmap(
      expansionStrategy,
      investmentPlan,
      timeframe,
      expansionType
    );

    // Assess risks
    const riskAssessment = assessExpansionRisks(
      expansionStrategy,
      investmentPlan,
      inputs
    );

    return {
      expansionStrategy,
      investmentPlan,
      implementationRoadmap,
      riskAssessment,
    };
  },

  validation: {
    currentCapacity: {
      min: 100,
      max: 5000,
      message: 'Current capacity must be between 100 and 5000 hours',
    },
    projectedDemand: {
      min: 200,
      max: 10000,
      message: 'Projected demand must be between 200 and 10000 hours',
    },
    availableBudget: {
      min: 50000,
      max: 5000000,
      message: 'Budget must be between $50K and $5M',
    },
  },

  examples: [
    {
      name: 'Equipment Expansion',
      description: 'Adding equipment to meet growing demand',
      inputs: {
        currentCapacity: 600,
        projectedDemand: 900,
        expansionType: 'equipment_only',
        availableBudget: 300000,
        timeframe: '6_months',
        riskTolerance: 'moderate',
        marketConditions: 'growing',
        currentUtilization: 90,
      },
    },
    {
      name: 'New Facility',
      description: 'Major expansion with new facility',
      inputs: {
        currentCapacity: 1000,
        projectedDemand: 2000,
        expansionType: 'new_location',
        availableBudget: 1500000,
        timeframe: '18_months',
        riskTolerance: 'aggressive',
        marketConditions: 'booming',
        currentUtilization: 95,
      },
    },
  ],

  tags: ['expansion', 'planning', 'investment', 'growth', 'strategy'],
  
  relatedCalculators: [
    'demand-forecasting',
    'resource-allocation',
    'bottleneck-analysis',
    'scalability-assessment',
  ],

  learningResources: [
    {
      title: 'Business Expansion Planning',
      type: 'article',
      url: '/learn/expansion-planning',
    },
    {
      title: 'Manufacturing Growth Strategies',
      type: 'video',
      url: '/learn/growth-strategies',
    },
  ],
};

// Helper functions
function developExpansionStrategy(
  currentCapacity: number,
  projectedDemand: number,
  expansionType: string,
  riskTolerance: string,
  marketConditions: string,
  currentUtilization: number
) {
  const capacityGap = projectedDemand - currentCapacity;
  const expansionRequired = capacityGap > 0;
  const expansionPercentage = expansionRequired ? (capacityGap / currentCapacity) * 100 : 0;
  
  // Determine expansion urgency
  const urgency = determineExpansionUrgency(currentUtilization, capacityGap, marketConditions);
  
  // Calculate target capacity with buffer
  const bufferFactors = {
    conservative: 0.2,
    moderate: 0.15,
    aggressive: 0.1,
  };
  
  const bufferFactor = bufferFactors[riskTolerance] || 0.15;
  const targetCapacity = Math.round(projectedDemand * (1 + bufferFactor));
  const totalExpansionNeeded = targetCapacity - currentCapacity;
  
  return {
    expansionRequired,
    capacityGap: Math.max(0, capacityGap),
    expansionPercentage: Math.round(expansionPercentage),
    urgency,
    targetCapacity,
    totalExpansionNeeded: Math.max(0, totalExpansionNeeded),
    recommendedApproach: getRecommendedApproach(expansionType, expansionPercentage, riskTolerance),
    marketAlignment: assessMarketAlignment(marketConditions, expansionPercentage),
    scalingStrategy: determineScalingStrategy(totalExpansionNeeded, currentCapacity, riskTolerance),
  };
}

function determineExpansionUrgency(utilization: number, capacityGap: number, marketConditions: string) {
  let urgency = 'Medium';
  
  if (utilization > 95 || capacityGap > 0) {
    urgency = 'High';
  } else if (utilization > 85) {
    urgency = 'Medium';
  } else {
    urgency = 'Low';
  }
  
  // Adjust for market conditions
  if (marketConditions === 'booming' && urgency !== 'High') {
    urgency = 'High';
  } else if (marketConditions === 'declining') {
    urgency = 'Low';
  }
  
  return urgency;
}

function getRecommendedApproach(expansionType: string, expansionPercentage: number, riskTolerance: string) {
  if (expansionPercentage < 25) {
    return 'Incremental Growth';
  } else if (expansionPercentage < 50) {
    return 'Moderate Expansion';
  } else if (expansionPercentage < 100) {
    return 'Significant Expansion';
  } else {
    return 'Major Transformation';
  }
}

function assessMarketAlignment(marketConditions: string, expansionPercentage: number) {
  const alignmentMatrix = {
    declining: expansionPercentage < 25 ? 'Good' : 'Poor',
    stable: expansionPercentage < 50 ? 'Good' : 'Fair',
    growing: expansionPercentage < 75 ? 'Excellent' : 'Good',
    booming: 'Excellent',
  };
  
  return alignmentMatrix[marketConditions] || 'Fair';
}

function determineScalingStrategy(expansionNeeded: number, currentCapacity: number, riskTolerance: string) {
  const expansionRatio = expansionNeeded / currentCapacity;
  
  if (riskTolerance === 'conservative' || expansionRatio < 0.3) {
    return {
      approach: 'Phased Expansion',
      phases: 2,
      description: 'Gradual capacity increase in multiple phases',
    };
  } else if (riskTolerance === 'moderate' || expansionRatio < 0.7) {
    return {
      approach: 'Balanced Growth',
      phases: 2,
      description: 'Balanced approach with measured expansion',
    };
  } else {
    return {
      approach: 'Aggressive Scaling',
      phases: 1,
      description: 'Rapid capacity increase to capture market opportunity',
    };
  }
}

function createInvestmentPlan(expansionStrategy: any, availableBudget: number, expansionType: string) {
  const baseCosts = calculateBaseCosts(expansionStrategy.totalExpansionNeeded, expansionType);
  const totalRequired = baseCosts.total;
  const budgetAdequacy = availableBudget >= totalRequired;
  
  // Adjust plan based on budget constraints
  let adjustedPlan = { ...baseCosts };
  if (!budgetAdequacy) {
    adjustedPlan = adjustPlanForBudget(baseCosts, availableBudget, expansionStrategy);
  }
  
  return {
    totalRequired: Math.round(totalRequired),
    availableBudget,
    budgetAdequacy,
    budgetGap: Math.max(0, totalRequired - availableBudget),
    investmentBreakdown: adjustedPlan.breakdown,
    financingOptions: generateFinancingOptions(totalRequired, availableBudget),
    roi: calculateExpansionROI(adjustedPlan.total, expansionStrategy.totalExpansionNeeded),
    paybackPeriod: calculatePaybackPeriod(adjustedPlan.total, expansionStrategy.totalExpansionNeeded),
  };
}

function calculateBaseCosts(expansionNeeded: number, expansionType: string) {
  // Base cost per hour of capacity
  const costPerHour = {
    equipment_only: 1500,
    facility_expansion: 2000,
    new_location: 2500,
    comprehensive: 3000,
  };
  
  const baseRate = costPerHour[expansionType] || 2000;
  const equipmentCost = expansionNeeded * baseRate;
  
  // Additional costs based on expansion type
  const additionalCosts = {
    equipment_only: {
      installation: equipmentCost * 0.15,
      training: equipmentCost * 0.05,
      infrastructure: equipmentCost * 0.1,
    },
    facility_expansion: {
      construction: equipmentCost * 0.3,
      utilities: equipmentCost * 0.1,
      permits: equipmentCost * 0.05,
    },
    new_location: {
      landBuilding: equipmentCost * 0.5,
      utilities: equipmentCost * 0.15,
      permits: equipmentCost * 0.08,
    },
    comprehensive: {
      construction: equipmentCost * 0.4,
      technology: equipmentCost * 0.2,
      workforce: equipmentCost * 0.15,
    },
  };
  
  const additional = additionalCosts[expansionType] || additionalCosts.equipment_only;
  const totalAdditional = Object.values(additional).reduce((sum, cost) => sum + cost, 0);
  
  return {
    breakdown: {
      equipment: Math.round(equipmentCost),
      ...Object.fromEntries(
        Object.entries(additional).map(([key, value]) => [key, Math.round(value)])
      ),
    },
    total: Math.round(equipmentCost + totalAdditional),
  };
}

function adjustPlanForBudget(baseCosts: any, budget: number, expansionStrategy: any) {
  const reductionFactor = budget / baseCosts.total;
  
  const adjustedBreakdown = Object.fromEntries(
    Object.entries(baseCosts.breakdown).map(([key, value]) => [
      key,
      Math.round(value * reductionFactor),
    ])
  );
  
  return {
    breakdown: adjustedBreakdown,
    total: budget,
    capacityReduction: Math.round((1 - reductionFactor) * 100),
  };
}

function generateFinancingOptions(totalRequired: number, availableBudget: number) {
  const gap = totalRequired - availableBudget;
  
  if (gap <= 0) {
    return [{ option: 'Self-Funded', description: 'Sufficient budget available' }];
  }
  
  return [
    {
      option: 'Equipment Financing',
      description: `Finance ${Math.round(gap * 0.7)} of equipment costs`,
      terms: '5-7 years at 6-8% interest',
    },
    {
      option: 'SBA Loan',
      description: `SBA loan for ${Math.round(gap)}`,
      terms: '10-25 years at 5-7% interest',
    },
    {
      option: 'Phased Implementation',
      description: 'Implement expansion in phases as cash flow allows',
      terms: 'Self-funded over 18-24 months',
    },
  ];
}

function calculateExpansionROI(investment: number, capacityIncrease: number) {
  // Assume $100 profit per hour of capacity per month
  const monthlyProfitIncrease = capacityIncrease * 100;
  const annualProfitIncrease = monthlyProfitIncrease * 12;
  const roi = (annualProfitIncrease / investment) * 100;
  
  return Math.round(roi);
}

function calculatePaybackPeriod(investment: number, capacityIncrease: number) {
  const monthlyProfitIncrease = capacityIncrease * 100;
  const paybackMonths = investment / monthlyProfitIncrease;
  
  if (paybackMonths < 12) return `${Math.round(paybackMonths)} months`;
  return `${Math.round(paybackMonths / 12 * 10) / 10} years`;
}

function generateImplementationRoadmap(
  expansionStrategy: any,
  investmentPlan: any,
  timeframe: string,
  expansionType: string
) {
  const timeframeMonths = parseInt(timeframe.split('_')[0]);
  const phases = expansionStrategy.scalingStrategy.phases;
  
  const roadmap = [];
  
  // Phase 1: Planning and Preparation
  roadmap.push({
    phase: 1,
    name: 'Planning & Preparation',
    duration: `${Math.ceil(timeframeMonths * 0.2)} months`,
    activities: [
      'Finalize expansion plans',
      'Secure financing',
      'Obtain permits and approvals',
      'Select vendors and contractors',
    ],
    milestones: ['Financing secured', 'Permits approved', 'Contracts signed'],
    budget: Math.round(investmentPlan.totalRequired * 0.1),
  });
  
  // Phase 2: Implementation
  const implementationPhases = phases === 1 ? 1 : 2;
  const implementationDuration = timeframeMonths * 0.7;
  
  for (let i = 0; i < implementationPhases; i++) {
    const phaseNumber = i + 2;
    const phaseDuration = Math.ceil(implementationDuration / implementationPhases);
    const phaseBudget = Math.round((investmentPlan.totalRequired * 0.8) / implementationPhases);
    
    roadmap.push({
      phase: phaseNumber,
      name: `Implementation Phase ${implementationPhases > 1 ? i + 1 : ''}`,
      duration: `${phaseDuration} months`,
      activities: getImplementationActivities(expansionType, i === 0),
      milestones: getImplementationMilestones(expansionType, i === 0),
      budget: phaseBudget,
    });
  }
  
  // Final Phase: Testing and Launch
  roadmap.push({
    phase: roadmap.length + 1,
    name: 'Testing & Launch',
    duration: `${Math.ceil(timeframeMonths * 0.1)} months`,
    activities: [
      'Equipment testing and calibration',
      'Staff training and certification',
      'Process optimization',
      'Full production launch',
    ],
    milestones: ['Testing completed', 'Staff certified', 'Production launched'],
    budget: Math.round(investmentPlan.totalRequired * 0.1),
  });
  
  return roadmap;
}

function getImplementationActivities(expansionType: string, isFirstPhase: boolean) {
  const activities = {
    equipment_only: [
      'Equipment procurement and delivery',
      'Installation and setup',
      'Utility connections',
      'Safety system installation',
    ],
    facility_expansion: [
      'Construction and renovation',
      'Equipment installation',
      'Infrastructure upgrades',
      'Safety and compliance setup',
    ],
    new_location: [
      'Site preparation and construction',
      'Equipment procurement and installation',
      'Utility and infrastructure setup',
      'Staffing and recruitment',
    ],
    comprehensive: [
      'Facility construction/renovation',
      'Technology implementation',
      'Equipment installation',
      'Workforce development',
    ],
  };
  
  return activities[expansionType] || activities.equipment_only;
}

function getImplementationMilestones(expansionType: string, isFirstPhase: boolean) {
  const milestones = {
    equipment_only: ['Equipment delivered', 'Installation completed', 'Testing passed'],
    facility_expansion: ['Construction completed', 'Equipment installed', 'Inspections passed'],
    new_location: ['Facility completed', 'Equipment operational', 'Staff hired'],
    comprehensive: ['Infrastructure ready', 'Systems integrated', 'Operations launched'],
  };
  
  return milestones[expansionType] || milestones.equipment_only;
}

function assessExpansionRisks(expansionStrategy: any, investmentPlan: any, inputs: any) {
  const risks = [];
  
  // Financial risk
  if (!investmentPlan.budgetAdequacy) {
    risks.push({
      risk: 'Budget Shortfall',
      severity: 'High',
      probability: 'High',
      impact: 'Delayed or reduced expansion',
      mitigation: 'Secure additional financing or phase implementation',
    });
  }
  
  // Market risk
  if (inputs.marketConditions === 'declining') {
    risks.push({
      risk: 'Market Decline',
      severity: 'High',
      probability: 'Medium',
      impact: 'Reduced demand for expanded capacity',
      mitigation: 'Conservative expansion approach and market diversification',
    });
  }
  
  // Execution risk
  if (inputs.timeframe === '3_months') {
    risks.push({
      risk: 'Aggressive Timeline',
      severity: 'Medium',
      probability: 'High',
      impact: 'Implementation delays and cost overruns',
      mitigation: 'Detailed project management and contingency planning',
    });
  }
  
  // Capacity utilization risk
  if (expansionStrategy.expansionPercentage > 75) {
    risks.push({
      risk: 'Over-Expansion',
      severity: 'Medium',
      probability: 'Medium',
      impact: 'Underutilized capacity and poor ROI',
      mitigation: 'Phased implementation and demand validation',
    });
  }
  
  return {
    risks,
    overallRiskLevel: calculateOverallRisk(risks),
    riskScore: calculateRiskScore(risks, inputs),
    mitigation: generateRiskMitigation(risks, expansionStrategy),
  };
}

function calculateOverallRisk(risks: any[]) {
  const highRisks = risks.filter(r => r.severity === 'High').length;
  const mediumRisks = risks.filter(r => r.severity === 'Medium').length;
  
  if (highRisks >= 2) return 'High';
  if (highRisks >= 1 || mediumRisks >= 3) return 'Medium';
  return 'Low';
}

function calculateRiskScore(risks: any[], inputs: any) {
  let score = 100; // Start with perfect score
  
  risks.forEach(risk => {
    if (risk.severity === 'High') score -= 25;
    else if (risk.severity === 'Medium') score -= 15;
    else score -= 5;
  });
  
  // Adjust for risk tolerance
  if (inputs.riskTolerance === 'conservative') score += 10;
  else if (inputs.riskTolerance === 'aggressive') score -= 10;
  
  return Math.max(0, Math.min(100, score));
}

function generateRiskMitigation(risks: any[], expansionStrategy: any) {
  const strategies = [];
  
  if (risks.some(r => r.risk.includes('Budget'))) {
    strategies.push('Develop detailed financial contingency plans');
  }
  
  if (risks.some(r => r.risk.includes('Market'))) {
    strategies.push('Implement market monitoring and demand validation');
  }
  
  if (risks.some(r => r.risk.includes('Timeline'))) {
    strategies.push('Create detailed project schedules with buffer time');
  }
  
  strategies.push('Regular progress reviews and course correction');
  strategies.push('Maintain flexibility in implementation approach');
  
  return strategies;
}

export default expansionPlanningConfig;
