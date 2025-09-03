import { CalculatorConfig } from '../../types/calculator';

export const overheadAllocationConfig: CalculatorConfig = {
  id: 'overhead-allocation',
  name: 'Overhead Allocation Calculator',
  description: 'Accurately allocate overhead costs to jobs and products for precise cost accounting and pricing decisions.',
  category: 'cost-control',
  difficulty: 'advanced',
  estimatedTime: '5-6 minutes',
  
  inputs: [
    {
      id: 'facilityRent',
      label: 'Monthly Facility Rent',
      type: 'number',
      value: 5000,
      unit: 'USD',
      min: 500,
      max: 50000,
      step: 100,
      required: true,
      description: 'Monthly rent or facility costs',
    },
    {
      id: 'utilities',
      label: 'Monthly Utilities',
      type: 'number',
      value: 800,
      unit: 'USD',
      min: 100,
      max: 5000,
      step: 50,
      required: true,
      description: 'Monthly utilities (excluding laser power)',
    },
    {
      id: 'insurance',
      label: 'Monthly Insurance',
      type: 'number',
      value: 600,
      unit: 'USD',
      min: 100,
      max: 3000,
      step: 50,
      required: true,
      description: 'Monthly insurance premiums',
    },
    {
      id: 'managementSalaries',
      label: 'Monthly Management Salaries',
      type: 'number',
      value: 8000,
      unit: 'USD',
      min: 2000,
      max: 30000,
      step: 500,
      required: true,
      description: 'Monthly management and administrative salaries',
    },
    {
      id: 'equipmentDepreciation',
      label: 'Monthly Equipment Depreciation',
      type: 'number',
      value: 2500,
      unit: 'USD',
      min: 500,
      max: 15000,
      step: 100,
      required: true,
      description: 'Monthly equipment depreciation',
    },
    {
      id: 'otherOverhead',
      label: 'Other Monthly Overhead',
      type: 'number',
      value: 1200,
      unit: 'USD',
      min: 0,
      max: 10000,
      step: 100,
      required: true,
      description: 'Other overhead costs (office supplies, software, etc.)',
    },
    {
      id: 'totalMachineHours',
      label: 'Total Monthly Machine Hours',
      type: 'number',
      value: 350,
      unit: 'hours',
      min: 50,
      max: 1000,
      step: 10,
      required: true,
      description: 'Total machine hours across all equipment',
    },
    {
      id: 'totalLaborHours',
      label: 'Total Monthly Labor Hours',
      type: 'number',
      value: 400,
      unit: 'hours',
      min: 50,
      max: 1200,
      step: 10,
      required: true,
      description: 'Total direct labor hours',
    },
    {
      id: 'allocationMethod',
      label: 'Allocation Method',
      type: 'select',
      value: 'machine_hours',
      options: [
        { value: 'machine_hours', label: 'Machine Hours' },
        { value: 'labor_hours', label: 'Labor Hours' },
        { value: 'direct_costs', label: 'Direct Costs' },
        { value: 'activity_based', label: 'Activity-Based Costing' },
      ],
      required: true,
      description: 'Method for allocating overhead costs',
    },
  ],

  outputs: [
    {
      id: 'overheadBreakdown',
      label: 'Overhead Cost Breakdown',
      type: 'object',
      format: 'overhead-breakdown',
      description: 'Detailed breakdown of overhead costs',
    },
    {
      id: 'allocationRates',
      label: 'Allocation Rates',
      type: 'object',
      format: 'allocation-rates',
      description: 'Overhead allocation rates by method',
    },
    {
      id: 'jobCostingExample',
      label: 'Job Costing Example',
      type: 'object',
      format: 'job-example',
      description: 'Example of overhead allocation to a typical job',
    },
    {
      id: 'recommendations',
      label: 'Cost Allocation Recommendations',
      type: 'array',
      format: 'allocation-recommendations',
      description: 'Recommendations for improving cost allocation accuracy',
    },
  ],

  calculate: (inputs: Record<string, any>) => {
    const {
      facilityRent,
      utilities,
      insurance,
      managementSalaries,
      equipmentDepreciation,
      otherOverhead,
      totalMachineHours,
      totalLaborHours,
      allocationMethod,
    } = inputs;

    // Calculate overhead breakdown
    const overheadBreakdown = calculateOverheadBreakdown(
      facilityRent,
      utilities,
      insurance,
      managementSalaries,
      equipmentDepreciation,
      otherOverhead
    );

    // Calculate allocation rates
    const allocationRates = calculateAllocationRates(
      overheadBreakdown.totalOverhead,
      totalMachineHours,
      totalLaborHours,
      allocationMethod
    );

    // Generate job costing example
    const jobCostingExample = generateJobCostingExample(
      allocationRates,
      allocationMethod
    );

    // Generate recommendations
    const recommendations = generateAllocationRecommendations(
      overheadBreakdown,
      allocationRates,
      inputs
    );

    return {
      overheadBreakdown,
      allocationRates,
      jobCostingExample,
      recommendations,
    };
  },

  validation: {
    totalMachineHours: {
      min: 50,
      max: 1000,
      message: 'Machine hours must be between 50 and 1000 hours per month',
    },
    totalLaborHours: {
      min: 50,
      max: 1200,
      message: 'Labor hours must be between 50 and 1200 hours per month',
    },
    facilityRent: {
      min: 500,
      max: 50000,
      message: 'Facility rent must be between $500 and $50,000 per month',
    },
  },

  examples: [
    {
      name: 'Small Shop Overhead',
      description: 'Overhead allocation for small laser cutting shop',
      inputs: {
        facilityRent: 3000,
        utilities: 500,
        insurance: 400,
        managementSalaries: 5000,
        equipmentDepreciation: 1500,
        otherOverhead: 800,
        totalMachineHours: 180,
        totalLaborHours: 200,
        allocationMethod: 'machine_hours',
      },
    },
    {
      name: 'Large Production Facility',
      description: 'Overhead allocation for large production facility',
      inputs: {
        facilityRent: 15000,
        utilities: 2500,
        insurance: 1500,
        managementSalaries: 20000,
        equipmentDepreciation: 8000,
        otherOverhead: 3000,
        totalMachineHours: 600,
        totalLaborHours: 800,
        allocationMethod: 'activity_based',
      },
    },
  ],

  tags: ['overhead', 'allocation', 'costing', 'accounting', 'pricing'],
  
  relatedCalculators: [
    'operating-cost-analyzer',
    'job-costing',
    'pricing-calculator',
    'profitability-analyzer',
  ],

  learningResources: [
    {
      title: 'Overhead Allocation Methods',
      type: 'article',
      url: '/learn/overhead-allocation',
    },
    {
      title: 'Activity-Based Costing',
      type: 'video',
      url: '/learn/activity-based-costing',
    },
  ],
};

// Helper functions
function calculateOverheadBreakdown(
  facilityRent: number,
  utilities: number,
  insurance: number,
  managementSalaries: number,
  equipmentDepreciation: number,
  otherOverhead: number
) {
  const totalOverhead = facilityRent + utilities + insurance + 
                       managementSalaries + equipmentDepreciation + otherOverhead;

  return {
    facilityRent,
    utilities,
    insurance,
    managementSalaries,
    equipmentDepreciation,
    otherOverhead,
    totalOverhead,
    percentages: {
      facilityRent: Math.round((facilityRent / totalOverhead) * 100),
      utilities: Math.round((utilities / totalOverhead) * 100),
      insurance: Math.round((insurance / totalOverhead) * 100),
      managementSalaries: Math.round((managementSalaries / totalOverhead) * 100),
      equipmentDepreciation: Math.round((equipmentDepreciation / totalOverhead) * 100),
      otherOverhead: Math.round((otherOverhead / totalOverhead) * 100),
    },
    categories: {
      fixed: facilityRent + insurance + equipmentDepreciation,
      variable: utilities + otherOverhead,
      labor: managementSalaries,
    },
  };
}

function calculateAllocationRates(
  totalOverhead: number,
  machineHours: number,
  laborHours: number,
  allocationMethod: string
) {
  const rates = {
    machineHourRate: totalOverhead / machineHours,
    laborHourRate: totalOverhead / laborHours,
    directCostRate: 0.25, // Assume 25% of direct costs
  };

  // Activity-based rates (simplified)
  const activityRates = {
    setupRate: totalOverhead * 0.3 / (machineHours * 0.2), // 30% for setup activities
    machiningRate: totalOverhead * 0.5 / machineHours, // 50% for machining
    qualityRate: totalOverhead * 0.2 / (machineHours * 0.1), // 20% for quality control
  };

  return {
    selectedMethod: allocationMethod,
    machineHourRate: Math.round(rates.machineHourRate * 100) / 100,
    laborHourRate: Math.round(rates.laborHourRate * 100) / 100,
    directCostRate: rates.directCostRate,
    activityRates: {
      setup: Math.round(activityRates.setupRate * 100) / 100,
      machining: Math.round(activityRates.machiningRate * 100) / 100,
      quality: Math.round(activityRates.qualityRate * 100) / 100,
    },
    recommendedMethod: recommendAllocationMethod(machineHours, laborHours, totalOverhead),
  };
}

function recommendAllocationMethod(machineHours: number, laborHours: number, totalOverhead: number) {
  const machineIntensity = machineHours / (machineHours + laborHours);
  
  if (machineIntensity > 0.7) {
    return {
      method: 'machine_hours',
      reason: 'High machine intensity - machine hours most appropriate',
    };
  } else if (machineIntensity < 0.3) {
    return {
      method: 'labor_hours',
      reason: 'High labor intensity - labor hours most appropriate',
    };
  } else if (totalOverhead > 20000) {
    return {
      method: 'activity_based',
      reason: 'High overhead costs - activity-based costing recommended',
    };
  } else {
    return {
      method: 'machine_hours',
      reason: 'Balanced operation - machine hours generally preferred',
    };
  }
}

function generateJobCostingExample(allocationRates: any, allocationMethod: string) {
  // Example job parameters
  const exampleJob = {
    machineHours: 2.5,
    laborHours: 3.0,
    directMaterialCost: 150,
    directLaborCost: 90,
  };

  let overheadCost = 0;
  let allocationBasis = '';

  switch (allocationMethod) {
    case 'machine_hours':
      overheadCost = exampleJob.machineHours * allocationRates.machineHourRate;
      allocationBasis = `${exampleJob.machineHours} hours × $${allocationRates.machineHourRate}/hour`;
      break;
    case 'labor_hours':
      overheadCost = exampleJob.laborHours * allocationRates.laborHourRate;
      allocationBasis = `${exampleJob.laborHours} hours × $${allocationRates.laborHourRate}/hour`;
      break;
    case 'direct_costs':
      const directCosts = exampleJob.directMaterialCost + exampleJob.directLaborCost;
      overheadCost = directCosts * allocationRates.directCostRate;
      allocationBasis = `$${directCosts} × ${allocationRates.directCostRate * 100}%`;
      break;
    case 'activity_based':
      const setupCost = 0.2 * allocationRates.activityRates.setup; // 0.2 hours setup
      const machiningCost = exampleJob.machineHours * allocationRates.activityRates.machining;
      const qualityCost = 0.1 * allocationRates.activityRates.quality; // 0.1 hours quality
      overheadCost = setupCost + machiningCost + qualityCost;
      allocationBasis = 'Activity-based allocation';
      break;
  }

  const totalJobCost = exampleJob.directMaterialCost + exampleJob.directLaborCost + overheadCost;

  return {
    jobParameters: exampleJob,
    overheadCost: Math.round(overheadCost * 100) / 100,
    allocationBasis,
    totalJobCost: Math.round(totalJobCost * 100) / 100,
    overheadPercentage: Math.round((overheadCost / totalJobCost) * 100),
    costBreakdown: {
      directMaterial: exampleJob.directMaterialCost,
      directLabor: exampleJob.directLaborCost,
      overhead: Math.round(overheadCost * 100) / 100,
      total: Math.round(totalJobCost * 100) / 100,
    },
  };
}

function generateAllocationRecommendations(overheadBreakdown: any, allocationRates: any, inputs: any) {
  const recommendations = [];

  // High overhead percentage
  const overheadIntensity = overheadBreakdown.totalOverhead / 
                           (inputs.totalMachineHours * 50); // Assume $50/hour direct cost
  
  if (overheadIntensity > 0.5) {
    recommendations.push({
      category: 'Overhead Management',
      recommendation: 'High overhead costs relative to direct costs',
      impact: 'High',
      actions: [
        'Review and reduce non-essential overhead expenses',
        'Increase machine utilization to spread overhead',
        'Consider outsourcing some overhead functions',
      ],
      potentialSaving: `$${Math.round(overheadBreakdown.totalOverhead * 0.1)}/month`,
    });
  }

  // Allocation method optimization
  if (allocationRates.selectedMethod !== allocationRates.recommendedMethod.method) {
    recommendations.push({
      category: 'Allocation Method',
      recommendation: `Consider switching to ${allocationRates.recommendedMethod.method}`,
      impact: 'Medium',
      actions: [
        'Implement recommended allocation method',
        'Update costing systems',
        'Train staff on new method',
      ],
      rationale: allocationRates.recommendedMethod.reason,
    });
  }

  // Fixed vs variable cost analysis
  const fixedPercentage = (overheadBreakdown.categories.fixed / overheadBreakdown.totalOverhead) * 100;
  if (fixedPercentage > 70) {
    recommendations.push({
      category: 'Cost Structure',
      recommendation: 'High fixed cost percentage requires high utilization',
      impact: 'High',
      actions: [
        'Focus on maximizing machine utilization',
        'Consider flexible cost structures where possible',
        'Implement capacity planning',
      ],
      note: `${Math.round(fixedPercentage)}% of overhead is fixed costs`,
    });
  }

  // Activity-based costing recommendation
  if (overheadBreakdown.totalOverhead > 15000 && allocationRates.selectedMethod !== 'activity_based') {
    recommendations.push({
      category: 'Costing Accuracy',
      recommendation: 'Consider implementing activity-based costing',
      impact: 'Medium',
      actions: [
        'Identify key cost drivers',
        'Implement activity tracking',
        'Develop activity-based rates',
      ],
      benefit: 'More accurate product costing and pricing',
    });
  }

  // Overhead rate monitoring
  recommendations.push({
    category: 'Monitoring',
    recommendation: 'Implement regular overhead rate monitoring',
    impact: 'Low',
    actions: [
      'Monthly overhead rate calculations',
      'Variance analysis against budget',
      'Quarterly rate adjustments',
    ],
    benefit: 'Maintain accurate costing throughout the year',
  });

  return recommendations;
}

export default overheadAllocationConfig;
