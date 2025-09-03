import { CalculatorConfig } from '../../types/calculator';
import { realTimeCostTracker } from '../../utils/costTracker';

export const consumableCostTrackerConfig: CalculatorConfig = {
  id: 'consumable-cost-tracker',
  name: 'Consumable Cost Tracker',
  description: 'Track and optimize costs of consumable items including nozzles, lenses, filters, and other replaceable components.',
  category: 'cost-control',
  difficulty: 'intermediate',
  estimatedTime: '4-5 minutes',
  
  inputs: [
    {
      id: 'nozzleLifespan',
      label: 'Nozzle Lifespan',
      type: 'number',
      value: 40,
      unit: 'hours',
      min: 10,
      max: 200,
      step: 5,
      required: true,
      description: 'Average lifespan of cutting nozzles',
    },
    {
      id: 'nozzleCost',
      label: 'Nozzle Cost',
      type: 'number',
      value: 25,
      unit: 'USD',
      min: 5,
      max: 200,
      step: 1,
      required: true,
      description: 'Cost per cutting nozzle',
    },
    {
      id: 'lensLifespan',
      label: 'Lens Lifespan',
      type: 'number',
      value: 500,
      unit: 'hours',
      min: 100,
      max: 2000,
      step: 50,
      required: true,
      description: 'Average lifespan of focusing lens',
    },
    {
      id: 'lensCost',
      label: 'Lens Cost',
      type: 'number',
      value: 150,
      unit: 'USD',
      min: 50,
      max: 1000,
      step: 10,
      required: true,
      description: 'Cost per focusing lens',
    },
    {
      id: 'filterLifespan',
      label: 'Filter Lifespan',
      type: 'number',
      value: 200,
      unit: 'hours',
      min: 50,
      max: 1000,
      step: 25,
      required: true,
      description: 'Average lifespan of air filters',
    },
    {
      id: 'filterCost',
      label: 'Filter Cost',
      type: 'number',
      value: 30,
      unit: 'USD',
      min: 10,
      max: 200,
      step: 5,
      required: true,
      description: 'Cost per air filter set',
    },
    {
      id: 'monthlyOperatingHours',
      label: 'Monthly Operating Hours',
      type: 'number',
      value: 180,
      unit: 'hours',
      min: 20,
      max: 600,
      step: 10,
      required: true,
      description: 'Total monthly operating hours',
    },
    {
      id: 'otherConsumables',
      label: 'Other Monthly Consumables',
      type: 'number',
      value: 100,
      unit: 'USD',
      min: 0,
      max: 1000,
      step: 10,
      required: true,
      description: 'Other monthly consumable costs (lubricants, cleaning supplies, etc.)',
    },
  ],

  outputs: [
    {
      id: 'monthlyCosts',
      label: 'Monthly Consumable Costs',
      type: 'object',
      format: 'monthly-breakdown',
      description: 'Monthly cost breakdown by consumable type',
    },
    {
      id: 'hourlyCosts',
      label: 'Hourly Consumable Costs',
      type: 'object',
      format: 'hourly-rates',
      description: 'Cost per operating hour by consumable',
    },
    {
      id: 'replacementSchedule',
      label: 'Replacement Schedule',
      type: 'array',
      format: 'schedule-table',
      description: 'Recommended replacement schedule for consumables',
    },
    {
      id: 'costOptimization',
      label: 'Cost Optimization Tips',
      type: 'array',
      format: 'optimization-tips',
      description: 'Tips to reduce consumable costs',
    },
  ],

  calculate: (inputs: Record<string, any>) => {
    const {
      nozzleLifespan,
      nozzleCost,
      lensLifespan,
      lensCost,
      filterLifespan,
      filterCost,
      monthlyOperatingHours,
      otherConsumables,
    } = inputs;

    // Calculate monthly costs
    const monthlyCosts = calculateMonthlyCosts(
      monthlyOperatingHours,
      { lifespan: nozzleLifespan, cost: nozzleCost },
      { lifespan: lensLifespan, cost: lensCost },
      { lifespan: filterLifespan, cost: filterCost },
      otherConsumables
    );

    // Calculate hourly costs
    const hourlyCosts = calculateHourlyCosts(monthlyCosts, monthlyOperatingHours);

    // Generate replacement schedule
    const replacementSchedule = generateReplacementSchedule(
      monthlyOperatingHours,
      { name: 'Nozzles', lifespan: nozzleLifespan, cost: nozzleCost },
      { name: 'Lenses', lifespan: lensLifespan, cost: lensCost },
      { name: 'Filters', lifespan: filterLifespan, cost: filterCost }
    );

    // Generate optimization tips
    const costOptimization = generateOptimizationTips(monthlyCosts, inputs);

    return {
      monthlyCosts,
      hourlyCosts,
      replacementSchedule,
      costOptimization,
    };
  },

  validation: {
    monthlyOperatingHours: {
      min: 20,
      max: 600,
      message: 'Monthly operating hours must be between 20 and 600 hours',
    },
    nozzleLifespan: {
      min: 10,
      max: 200,
      message: 'Nozzle lifespan must be between 10 and 200 hours',
    },
    lensLifespan: {
      min: 100,
      max: 2000,
      message: 'Lens lifespan must be between 100 and 2000 hours',
    },
  },

  examples: [
    {
      name: 'Standard Production Setup',
      description: 'Typical consumable costs for standard production',
      inputs: {
        nozzleLifespan: 40,
        nozzleCost: 25,
        lensLifespan: 500,
        lensCost: 150,
        filterLifespan: 200,
        filterCost: 30,
        monthlyOperatingHours: 180,
        otherConsumables: 100,
      },
    },
    {
      name: 'High-Volume Operation',
      description: 'Consumable costs for high-volume cutting operation',
      inputs: {
        nozzleLifespan: 30,
        nozzleCost: 35,
        lensLifespan: 400,
        lensCost: 200,
        filterLifespan: 150,
        filterCost: 45,
        monthlyOperatingHours: 400,
        otherConsumables: 250,
      },
    },
  ],

  tags: ['consumables', 'tracking', 'replacement', 'maintenance', 'cost-control'],
  
  relatedCalculators: [
    'operating-cost-analyzer',
    'maintenance-cost',
    'equipment-utilization',
    'inventory-optimizer',
  ],

  learningResources: [
    {
      title: 'Consumable Management Best Practices',
      type: 'article',
      url: '/learn/consumable-management',
    },
    {
      title: 'Extending Consumable Life',
      type: 'video',
      url: '/learn/extending-consumable-life',
    },
  ],
};

// Helper functions
function calculateMonthlyCosts(
  monthlyHours: number,
  nozzle: any,
  lens: any,
  filter: any,
  otherConsumables: number
) {
  const nozzleMonthlyCost = (monthlyHours / nozzle.lifespan) * nozzle.cost;
  const lensMonthlyCost = (monthlyHours / lens.lifespan) * lens.cost;
  const filterMonthlyCost = (monthlyHours / filter.lifespan) * filter.cost;
  
  const totalMonthlyCost = nozzleMonthlyCost + lensMonthlyCost + filterMonthlyCost + otherConsumables;

  return {
    nozzles: Math.round(nozzleMonthlyCost * 100) / 100,
    lenses: Math.round(lensMonthlyCost * 100) / 100,
    filters: Math.round(filterMonthlyCost * 100) / 100,
    other: otherConsumables,
    total: Math.round(totalMonthlyCost * 100) / 100,
    percentages: {
      nozzles: Math.round((nozzleMonthlyCost / totalMonthlyCost) * 100),
      lenses: Math.round((lensMonthlyCost / totalMonthlyCost) * 100),
      filters: Math.round((filterMonthlyCost / totalMonthlyCost) * 100),
      other: Math.round((otherConsumables / totalMonthlyCost) * 100),
    },
  };
}

function calculateHourlyCosts(monthlyCosts: any, monthlyHours: number) {
  return {
    total: Math.round((monthlyCosts.total / monthlyHours) * 100) / 100,
    nozzles: Math.round((monthlyCosts.nozzles / monthlyHours) * 100) / 100,
    lenses: Math.round((monthlyCosts.lenses / monthlyHours) * 100) / 100,
    filters: Math.round((monthlyCosts.filters / monthlyHours) * 100) / 100,
    other: Math.round((monthlyCosts.other / monthlyHours) * 100) / 100,
  };
}

function generateReplacementSchedule(monthlyHours: number, ...consumables: any[]) {
  return consumables.map(consumable => {
    const replacementsPerMonth = monthlyHours / consumable.lifespan;
    const daysUntilReplacement = consumable.lifespan / (monthlyHours / 30);
    
    return {
      item: consumable.name,
      lifespan: `${consumable.lifespan} hours`,
      replacementsPerMonth: Math.round(replacementsPerMonth * 10) / 10,
      daysUntilReplacement: Math.round(daysUntilReplacement),
      costPerReplacement: `$${consumable.cost}`,
      recommendedStock: Math.ceil(replacementsPerMonth * 1.5), // 1.5 months buffer
    };
  });
}

function generateOptimizationTips(monthlyCosts: any, inputs: any) {
  const tips = [];

  // High nozzle costs
  if (monthlyCosts.percentages.nozzles > 40) {
    tips.push({
      category: 'Nozzle Optimization',
      tip: 'High nozzle costs detected',
      suggestions: [
        'Check gas pressure settings - excessive pressure reduces nozzle life',
        'Ensure proper nozzle alignment',
        'Consider higher quality nozzles with longer lifespan',
        'Implement nozzle cleaning procedures',
      ],
      potentialSaving: `$${Math.round(monthlyCosts.nozzles * 0.3)}/month`,
    });
  }

  // High lens costs
  if (monthlyCosts.percentages.lenses > 25) {
    tips.push({
      category: 'Lens Protection',
      tip: 'High lens replacement costs',
      suggestions: [
        'Install protective windows',
        'Improve fume extraction',
        'Regular lens cleaning schedule',
        'Check for spatter contamination',
      ],
      potentialSaving: `$${Math.round(monthlyCosts.lenses * 0.4)}/month`,
    });
  }

  // High filter costs
  if (monthlyCosts.percentages.filters > 20) {
    tips.push({
      category: 'Filter Efficiency',
      tip: 'Frequent filter replacements needed',
      suggestions: [
        'Upgrade to higher capacity filters',
        'Implement pre-filtering system',
        'Regular filter maintenance',
        'Check for air leaks in system',
      ],
      potentialSaving: `$${Math.round(monthlyCosts.filters * 0.25)}/month`,
    });
  }

  // General optimization
  tips.push({
    category: 'General Optimization',
    tip: 'Inventory management',
    suggestions: [
      'Implement just-in-time ordering',
      'Negotiate bulk purchase discounts',
      'Track usage patterns for better forecasting',
      'Consider alternative suppliers',
    ],
    potentialSaving: `$${Math.round(monthlyCosts.total * 0.1)}/month`,
  });

  return tips;
}

export default consumableCostTrackerConfig;
