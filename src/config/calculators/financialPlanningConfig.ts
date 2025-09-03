import { CalculatorConfig } from '../../types/calculator';

export const financialPlanningConfig: CalculatorConfig = {
  id: 'financial-planning',
  name: 'Financial Planning Calculator',
  description: 'Comprehensive financial planning calculator for budgeting, forecasting, and strategic financial management in laser cutting operations.',
  category: 'enterprise',
  difficulty: 'expert',
  estimatedTime: '8-10 minutes',
  
  inputs: [
    {
      id: 'planningHorizon',
      label: 'Planning Horizon',
      type: 'select',
      value: 'medium_term',
      options: [
        { value: 'short_term', label: 'Short Term (1 year)' },
        { value: 'medium_term', label: 'Medium Term (3 years)' },
        { value: 'long_term', label: 'Long Term (5 years)' },
        { value: 'strategic', label: 'Strategic (10+ years)' },
      ],
      required: true,
      description: 'Financial planning time horizon',
    },
    {
      id: 'currentRevenue',
      label: 'Current Annual Revenue',
      type: 'select',
      value: 'medium',
      options: [
        { value: 'small', label: 'Small (< $1M)' },
        { value: 'medium', label: 'Medium ($1M - $10M)' },
        { value: 'large', label: 'Large ($10M - $100M)' },
        { value: 'enterprise', label: 'Enterprise (> $100M)' },
      ],
      required: true,
      description: 'Current annual revenue range',
    },
    {
      id: 'growthTarget',
      label: 'Annual Growth Target',
      type: 'select',
      value: 'moderate',
      options: [
        { value: 'conservative', label: 'Conservative (5-10%)' },
        { value: 'moderate', label: 'Moderate (10-20%)' },
        { value: 'aggressive', label: 'Aggressive (20-35%)' },
        { value: 'rapid', label: 'Rapid (35%+)' },
      ],
      required: true,
      description: 'Target annual growth rate',
    },
    {
      id: 'profitabilityTarget',
      label: 'Profitability Target',
      type: 'select',
      value: 'industry_standard',
      options: [
        { value: 'survival', label: 'Survival (Break-even)' },
        { value: 'basic', label: 'Basic (5-10% margin)' },
        { value: 'industry_standard', label: 'Industry Standard (10-15% margin)' },
        { value: 'premium', label: 'Premium (15-25% margin)' },
        { value: 'exceptional', label: 'Exceptional (25%+ margin)' },
      ],
      required: true,
      description: 'Target profit margin',
    },
    {
      id: 'capitalIntensity',
      label: 'Capital Intensity',
      type: 'select',
      value: 'moderate',
      options: [
        { value: 'low', label: 'Low (Minimal equipment investment)' },
        { value: 'moderate', label: 'Moderate (Regular equipment upgrades)' },
        { value: 'high', label: 'High (Significant capital requirements)' },
        { value: 'very_high', label: 'Very High (Continuous major investments)' },
      ],
      required: true,
      description: 'Level of capital investment required',
    },
    {
      id: 'marketVolatility',
      label: 'Market Volatility',
      type: 'select',
      value: 'moderate',
      options: [
        { value: 'stable', label: 'Stable (Predictable demand)' },
        { value: 'moderate', label: 'Moderate (Some fluctuation)' },
        { value: 'volatile', label: 'Volatile (Significant swings)' },
        { value: 'highly_volatile', label: 'Highly Volatile (Extreme fluctuations)' },
      ],
      required: true,
      description: 'Market demand volatility',
    },
    {
      id: 'financingStrategy',
      label: 'Financing Strategy',
      type: 'select',
      value: 'balanced',
      options: [
        { value: 'conservative', label: 'Conservative (Minimal debt)' },
        { value: 'balanced', label: 'Balanced (Moderate leverage)' },
        { value: 'aggressive', label: 'Aggressive (High leverage)' },
        { value: 'equity_focused', label: 'Equity Focused (Investor funding)' },
      ],
      required: true,
      description: 'Preferred financing approach',
    },
    {
      id: 'cashFlowPriority',
      label: 'Cash Flow Priority',
      type: 'select',
      value: 'balanced',
      options: [
        { value: 'liquidity', label: 'Liquidity (High cash reserves)' },
        { value: 'balanced', label: 'Balanced (Moderate reserves)' },
        { value: 'efficiency', label: 'Efficiency (Minimal idle cash)' },
        { value: 'growth', label: 'Growth (Reinvest everything)' },
      ],
      required: true,
      description: 'Cash flow management priority',
    },
    {
      id: 'riskTolerance',
      label: 'Financial Risk Tolerance',
      type: 'select',
      value: 'moderate',
      options: [
        { value: 'conservative', label: 'Conservative (Low risk)' },
        { value: 'moderate', label: 'Moderate (Balanced risk)' },
        { value: 'aggressive', label: 'Aggressive (High risk)' },
        { value: 'speculative', label: 'Speculative (Very high risk)' },
      ],
      required: true,
      description: 'Tolerance for financial risk',
    },
    {
      id: 'competitivePosition',
      label: 'Competitive Position',
      type: 'select',
      value: 'strong',
      options: [
        { value: 'weak', label: 'Weak (Price competition)' },
        { value: 'average', label: 'Average (Market follower)' },
        { value: 'strong', label: 'Strong (Competitive advantage)' },
        { value: 'dominant', label: 'Dominant (Market leader)' },
      ],
      required: true,
      description: 'Current competitive market position',
    },
  ],

  outputs: [
    {
      id: 'financialForecast',
      label: 'Financial Forecast',
      type: 'object',
      format: 'financial-forecast-model',
      description: 'Multi-year financial projections and scenarios',
    },
    {
      id: 'budgetFramework',
      label: 'Budget Framework',
      type: 'object',
      format: 'budget-planning-framework',
      description: 'Comprehensive budgeting structure and processes',
    },
    {
      id: 'investmentPlan',
      label: 'Investment Plan',
      type: 'object',
      format: 'capital-investment-plan',
      description: 'Strategic capital investment planning and prioritization',
    },
    {
      id: 'financialMetrics',
      label: 'Financial Metrics',
      type: 'object',
      format: 'financial-kpi-dashboard',
      description: 'Key financial performance indicators and targets',
    },
  ],

  calculate: (inputs: Record<string, any>) => {
    const {
      planningHorizon,
      currentRevenue,
      growthTarget,
      profitabilityTarget,
      capitalIntensity,
      marketVolatility,
      financingStrategy,
      cashFlowPriority,
      riskTolerance,
      competitivePosition,
    } = inputs;

    // Create financial forecast
    const financialForecast = createFinancialForecast(
      planningHorizon,
      currentRevenue,
      growthTarget,
      profitabilityTarget,
      marketVolatility
    );

    // Develop budget framework
    const budgetFramework = developBudgetFramework(
      currentRevenue,
      growthTarget,
      profitabilityTarget,
      marketVolatility
    );

    // Plan capital investments
    const investmentPlan = planCapitalInvestments(
      capitalIntensity,
      growthTarget,
      financingStrategy,
      planningHorizon
    );

    // Define financial metrics
    const financialMetrics = defineFinancialMetrics(
      profitabilityTarget,
      cashFlowPriority,
      competitivePosition,
      riskTolerance
    );

    return {
      financialForecast,
      budgetFramework,
      investmentPlan,
      financialMetrics,
    };
  },

  validation: {},

  examples: [
    {
      name: 'Growth-Focused Manufacturing',
      description: 'Medium-sized manufacturer with aggressive growth plans',
      inputs: {
        planningHorizon: 'medium_term',
        currentRevenue: 'medium',
        growthTarget: 'aggressive',
        profitabilityTarget: 'industry_standard',
        capitalIntensity: 'high',
        marketVolatility: 'moderate',
        financingStrategy: 'balanced',
        cashFlowPriority: 'growth',
        riskTolerance: 'aggressive',
        competitivePosition: 'strong',
      },
    },
    {
      name: 'Stable Enterprise Operations',
      description: 'Large enterprise with conservative financial approach',
      inputs: {
        planningHorizon: 'long_term',
        currentRevenue: 'enterprise',
        growthTarget: 'conservative',
        profitabilityTarget: 'premium',
        capitalIntensity: 'moderate',
        marketVolatility: 'stable',
        financingStrategy: 'conservative',
        cashFlowPriority: 'liquidity',
        riskTolerance: 'conservative',
        competitivePosition: 'dominant',
      },
    },
  ],

  tags: ['financial-planning', 'budgeting', 'forecasting', 'investment', 'strategy'],
  
  relatedCalculators: [
    'cost-analysis',
    'roi-calculator',
    'cash-flow-management',
    'investment-analysis',
  ],

  learningResources: [
    {
      title: 'Financial Planning Best Practices',
      type: 'article',
      url: '/learn/financial-planning',
    },
    {
      title: 'Strategic Budgeting Methods',
      type: 'video',
      url: '/learn/strategic-budgeting',
    },
  ],
};

// Helper functions
function createFinancialForecast(
  horizon: string,
  currentRevenue: string,
  growthTarget: string,
  profitabilityTarget: string,
  volatility: string
) {
  const baseRevenue = getBaseRevenue(currentRevenue);
  const growthRate = getGrowthRate(growthTarget);
  const profitMargin = getProfitMargin(profitabilityTarget);
  const years = getYears(horizon);
  
  const forecast = {
    revenueProjections: generateRevenueProjections(baseRevenue, growthRate, years, volatility),
    profitProjections: generateProfitProjections(baseRevenue, growthRate, profitMargin, years),
    cashFlowProjections: generateCashFlowProjections(baseRevenue, growthRate, profitMargin, years),
    scenarios: generateScenarios(baseRevenue, growthRate, profitMargin, years, volatility),
    assumptions: getAssumptions(growthTarget, profitabilityTarget, volatility),
  };

  return forecast;
}

function getBaseRevenue(currentRevenue: string) {
  const revenues = {
    small: 500000,      // $500K
    medium: 5000000,    // $5M
    large: 50000000,    // $50M
    enterprise: 200000000, // $200M
  };
  
  return revenues[currentRevenue] || 5000000;
}

function getGrowthRate(growthTarget: string) {
  const rates = {
    conservative: 0.075,  // 7.5%
    moderate: 0.15,       // 15%
    aggressive: 0.275,    // 27.5%
    rapid: 0.40,          // 40%
  };
  
  return rates[growthTarget] || 0.15;
}

function getProfitMargin(profitabilityTarget: string) {
  const margins = {
    survival: 0.02,        // 2%
    basic: 0.075,          // 7.5%
    industry_standard: 0.125, // 12.5%
    premium: 0.20,         // 20%
    exceptional: 0.30,     // 30%
  };
  
  return margins[profitabilityTarget] || 0.125;
}

function getYears(horizon: string) {
  const years = {
    short_term: 1,
    medium_term: 3,
    long_term: 5,
    strategic: 10,
  };
  
  return years[horizon] || 3;
}

function generateRevenueProjections(baseRevenue: number, growthRate: number, years: number, volatility: string) {
  const projections = [];
  const volatilityFactor = getVolatilityFactor(volatility);
  
  for (let year = 1; year <= years; year++) {
    const baseProjection = baseRevenue * Math.pow(1 + growthRate, year);
    const volatilityAdjustment = 1 + (Math.random() - 0.5) * volatilityFactor;
    const adjustedProjection = baseProjection * volatilityAdjustment;
    
    projections.push({
      year,
      revenue: Math.round(adjustedProjection),
      growthRate: year === 1 ? growthRate : (adjustedProjection / projections[year - 2].revenue - 1),
    });
  }
  
  return projections;
}

function getVolatilityFactor(volatility: string) {
  const factors = {
    stable: 0.05,         // ±2.5%
    moderate: 0.15,       // ±7.5%
    volatile: 0.30,       // ±15%
    highly_volatile: 0.50, // ±25%
  };
  
  return factors[volatility] || 0.15;
}

function generateProfitProjections(baseRevenue: number, growthRate: number, profitMargin: number, years: number) {
  const projections = [];
  
  for (let year = 1; year <= years; year++) {
    const revenue = baseRevenue * Math.pow(1 + growthRate, year);
    const profit = revenue * profitMargin;
    const marginImprovement = year * 0.005; // 0.5% improvement per year
    const adjustedMargin = profitMargin + marginImprovement;
    const adjustedProfit = revenue * adjustedMargin;
    
    projections.push({
      year,
      revenue: Math.round(revenue),
      profit: Math.round(adjustedProfit),
      margin: adjustedMargin,
    });
  }
  
  return projections;
}

function generateCashFlowProjections(baseRevenue: number, growthRate: number, profitMargin: number, years: number) {
  const projections = [];
  
  for (let year = 1; year <= years; year++) {
    const revenue = baseRevenue * Math.pow(1 + growthRate, year);
    const profit = revenue * profitMargin;
    const depreciation = revenue * 0.05; // 5% of revenue
    const workingCapitalChange = revenue * growthRate * 0.1; // 10% of growth
    const capex = revenue * 0.08; // 8% of revenue
    
    const operatingCashFlow = profit + depreciation;
    const freeCashFlow = operatingCashFlow - workingCapitalChange - capex;
    
    projections.push({
      year,
      operatingCashFlow: Math.round(operatingCashFlow),
      freeCashFlow: Math.round(freeCashFlow),
      capex: Math.round(capex),
      workingCapitalChange: Math.round(workingCapitalChange),
    });
  }
  
  return projections;
}

function generateScenarios(baseRevenue: number, growthRate: number, profitMargin: number, years: number, volatility: string) {
  const scenarios = {
    optimistic: generateScenario(baseRevenue, growthRate * 1.5, profitMargin * 1.2, years),
    base: generateScenario(baseRevenue, growthRate, profitMargin, years),
    pessimistic: generateScenario(baseRevenue, growthRate * 0.5, profitMargin * 0.8, years),
  };
  
  return scenarios;
}

function generateScenario(baseRevenue: number, growthRate: number, profitMargin: number, years: number) {
  const finalRevenue = baseRevenue * Math.pow(1 + growthRate, years);
  const finalProfit = finalRevenue * profitMargin;
  
  return {
    finalRevenue: Math.round(finalRevenue),
    finalProfit: Math.round(finalProfit),
    cagr: growthRate,
    averageMargin: profitMargin,
  };
}

function getAssumptions(growthTarget: string, profitabilityTarget: string, volatility: string) {
  return {
    growthAssumptions: getGrowthAssumptions(growthTarget),
    profitabilityAssumptions: getProfitabilityAssumptions(profitabilityTarget),
    marketAssumptions: getMarketAssumptions(volatility),
    keyRisks: getKeyRisks(growthTarget, volatility),
  };
}

function getGrowthAssumptions(growthTarget: string) {
  const assumptions = {
    conservative: ['Stable market conditions', 'Gradual market expansion', 'Organic growth focus'],
    moderate: ['Market growth alignment', 'Balanced organic and acquisition growth', 'Competitive positioning'],
    aggressive: ['Market share gains', 'New market entry', 'Acquisition opportunities'],
    rapid: ['Disruptive innovation', 'First-mover advantage', 'Exponential market growth'],
  };
  
  return assumptions[growthTarget] || assumptions.moderate;
}

function getProfitabilityAssumptions(profitabilityTarget: string) {
  const assumptions = {
    survival: ['Cost minimization focus', 'Basic operational efficiency'],
    basic: ['Standard industry practices', 'Cost control measures'],
    industry_standard: ['Operational excellence', 'Competitive cost structure'],
    premium: ['Value-added services', 'Premium market positioning'],
    exceptional: ['Market leadership', 'Proprietary advantages'],
  };
  
  return assumptions[profitabilityTarget] || assumptions.industry_standard;
}

function getMarketAssumptions(volatility: string) {
  const assumptions = {
    stable: ['Predictable demand patterns', 'Stable pricing environment'],
    moderate: ['Normal business cycles', 'Manageable market fluctuations'],
    volatile: ['Significant demand swings', 'Price volatility'],
    highly_volatile: ['Extreme market conditions', 'Unpredictable demand'],
  };
  
  return assumptions[volatility] || assumptions.moderate;
}

function getKeyRisks(growthTarget: string, volatility: string) {
  const risks = [];
  
  if (growthTarget === 'aggressive' || growthTarget === 'rapid') {
    risks.push('Execution risk on growth initiatives');
    risks.push('Capital requirements may exceed projections');
  }
  
  if (volatility === 'volatile' || volatility === 'highly_volatile') {
    risks.push('Market demand uncertainty');
    risks.push('Revenue timing variability');
  }
  
  risks.push('Competitive response to growth');
  risks.push('Economic downturn impact');
  
  return risks;
}

function developBudgetFramework(
  currentRevenue: string,
  growthTarget: string,
  profitabilityTarget: string,
  volatility: string
) {
  const framework = {
    budgetingApproach: getBudgetingApproach(volatility, growthTarget),
    budgetCategories: getBudgetCategories(currentRevenue),
    allocationStrategy: getAllocationStrategy(growthTarget, profitabilityTarget),
    controlMechanisms: getControlMechanisms(volatility),
    reviewCycle: getReviewCycle(volatility, growthTarget),
  };

  return framework;
}

function getBudgetingApproach(volatility: string, growthTarget: string) {
  if (volatility === 'highly_volatile' || growthTarget === 'rapid') {
    return 'Rolling forecasts with quarterly updates';
  } else if (volatility === 'volatile' || growthTarget === 'aggressive') {
    return 'Flexible budgeting with scenario planning';
  } else {
    return 'Annual budgeting with monthly reviews';
  }
}

function getBudgetCategories(currentRevenue: string) {
  const baseCategories = [
    'Revenue',
    'Cost of Goods Sold',
    'Operating Expenses',
    'Capital Expenditures',
    'Working Capital',
  ];

  const enterpriseCategories = [
    'Research & Development',
    'Marketing & Sales',
    'General & Administrative',
    'Information Technology',
    'Human Resources',
  ];

  if (currentRevenue === 'enterprise' || currentRevenue === 'large') {
    return [...baseCategories, ...enterpriseCategories];
  } else {
    return baseCategories;
  }
}

function getAllocationStrategy(growthTarget: string, profitabilityTarget: string) {
  const strategies = {
    growth_focused: {
      revenue_investment: '15-20%',
      cost_optimization: '5-10%',
      profit_reinvestment: '80-90%',
    },
    balanced: {
      revenue_investment: '10-15%',
      cost_optimization: '10-15%',
      profit_reinvestment: '60-70%',
    },
    profit_focused: {
      revenue_investment: '5-10%',
      cost_optimization: '15-20%',
      profit_reinvestment: '40-50%',
    },
  };

  if (growthTarget === 'aggressive' || growthTarget === 'rapid') {
    return strategies.growth_focused;
  } else if (profitabilityTarget === 'premium' || profitabilityTarget === 'exceptional') {
    return strategies.profit_focused;
  } else {
    return strategies.balanced;
  }
}

function getControlMechanisms(volatility: string) {
  const mechanisms = {
    stable: ['Monthly variance analysis', 'Quarterly budget reviews'],
    moderate: ['Bi-weekly flash reports', 'Monthly variance analysis', 'Quarterly reforecasting'],
    volatile: ['Weekly flash reports', 'Bi-weekly variance analysis', 'Monthly reforecasting'],
    highly_volatile: ['Daily flash reports', 'Weekly variance analysis', 'Bi-weekly reforecasting'],
  };

  return mechanisms[volatility] || mechanisms.moderate;
}

function getReviewCycle(volatility: string, growthTarget: string) {
  if (volatility === 'highly_volatile' || growthTarget === 'rapid') {
    return 'Monthly budget reviews with quarterly strategic updates';
  } else if (volatility === 'volatile' || growthTarget === 'aggressive') {
    return 'Quarterly budget reviews with semi-annual strategic updates';
  } else {
    return 'Semi-annual budget reviews with annual strategic planning';
  }
}

export default financialPlanningConfig;
