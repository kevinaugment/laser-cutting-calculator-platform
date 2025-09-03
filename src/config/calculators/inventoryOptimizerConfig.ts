import { CalculatorConfig } from '../../types/calculator';

export const inventoryOptimizerConfig: CalculatorConfig = {
  id: 'inventory-optimizer',
  name: 'Inventory Optimizer',
  description: 'Optimize material and consumable inventory levels to minimize carrying costs while avoiding stockouts.',
  category: 'cost-control',
  difficulty: 'intermediate',
  estimatedTime: '4-5 minutes',
  
  inputs: [
    {
      id: 'monthlyMaterialUsage',
      label: 'Monthly Material Usage',
      type: 'number',
      value: 5000,
      unit: 'kg',
      min: 100,
      max: 50000,
      step: 100,
      required: true,
      description: 'Average monthly material consumption',
    },
    {
      id: 'materialCostPerKg',
      label: 'Material Cost per kg',
      type: 'number',
      value: 8,
      unit: 'USD/kg',
      min: 1,
      max: 100,
      step: 0.5,
      required: true,
      description: 'Cost per kilogram of material',
    },
    {
      id: 'leadTimeWeeks',
      label: 'Supplier Lead Time',
      type: 'number',
      value: 2,
      unit: 'weeks',
      min: 0.5,
      max: 12,
      step: 0.5,
      required: true,
      description: 'Supplier delivery lead time',
    },
    {
      id: 'orderingCost',
      label: 'Ordering Cost per Order',
      type: 'number',
      value: 150,
      unit: 'USD',
      min: 50,
      max: 1000,
      step: 25,
      required: true,
      description: 'Administrative cost per purchase order',
    },
    {
      id: 'carryingCostRate',
      label: 'Carrying Cost Rate',
      type: 'number',
      value: 20,
      unit: '%/year',
      min: 10,
      max: 50,
      step: 1,
      required: true,
      description: 'Annual carrying cost as percentage of inventory value',
    },
    {
      id: 'stockoutCost',
      label: 'Stockout Cost per Day',
      type: 'number',
      value: 500,
      unit: 'USD/day',
      min: 100,
      max: 5000,
      step: 50,
      required: true,
      description: 'Cost of production stoppage per day',
    },
    {
      id: 'demandVariability',
      label: 'Demand Variability',
      type: 'select',
      value: 'medium',
      options: [
        { value: 'low', label: 'Low (±10%)' },
        { value: 'medium', label: 'Medium (±20%)' },
        { value: 'high', label: 'High (±35%)' },
      ],
      required: true,
      description: 'Variability in monthly demand',
    },
    {
      id: 'serviceLevel',
      label: 'Target Service Level',
      type: 'select',
      value: '95',
      options: [
        { value: '90', label: '90% (1 stockout per 10 orders)' },
        { value: '95', label: '95% (1 stockout per 20 orders)' },
        { value: '99', label: '99% (1 stockout per 100 orders)' },
      ],
      required: true,
      description: 'Desired service level percentage',
    },
  ],

  outputs: [
    {
      id: 'optimalInventory',
      label: 'Optimal Inventory Levels',
      type: 'object',
      format: 'inventory-levels',
      description: 'Recommended inventory levels and reorder points',
    },
    {
      id: 'costAnalysis',
      label: 'Inventory Cost Analysis',
      type: 'object',
      format: 'cost-analysis',
      description: 'Analysis of inventory-related costs',
    },
    {
      id: 'orderingStrategy',
      label: 'Ordering Strategy',
      type: 'object',
      format: 'ordering-plan',
      description: 'Recommended ordering frequency and quantities',
    },
    {
      id: 'recommendations',
      label: 'Optimization Recommendations',
      type: 'array',
      format: 'inventory-recommendations',
      description: 'Specific recommendations for inventory optimization',
    },
  ],

  calculate: (inputs: Record<string, any>) => {
    const {
      monthlyMaterialUsage,
      materialCostPerKg,
      leadTimeWeeks,
      orderingCost,
      carryingCostRate,
      stockoutCost,
      demandVariability,
      serviceLevel,
    } = inputs;

    // Calculate optimal inventory levels
    const optimalInventory = calculateOptimalInventory(
      monthlyMaterialUsage,
      materialCostPerKg,
      leadTimeWeeks,
      orderingCost,
      carryingCostRate,
      demandVariability,
      serviceLevel
    );

    // Analyze costs
    const costAnalysis = analyzeCosts(
      optimalInventory,
      monthlyMaterialUsage,
      materialCostPerKg,
      orderingCost,
      carryingCostRate,
      stockoutCost
    );

    // Generate ordering strategy
    const orderingStrategy = generateOrderingStrategy(
      optimalInventory,
      monthlyMaterialUsage,
      leadTimeWeeks
    );

    // Generate recommendations
    const recommendations = generateRecommendations(
      optimalInventory,
      costAnalysis,
      inputs
    );

    return {
      optimalInventory,
      costAnalysis,
      orderingStrategy,
      recommendations,
    };
  },

  validation: {
    monthlyMaterialUsage: {
      min: 100,
      max: 50000,
      message: 'Monthly usage must be between 100kg and 50,000kg',
    },
    leadTimeWeeks: {
      min: 0.5,
      max: 12,
      message: 'Lead time must be between 0.5 and 12 weeks',
    },
    carryingCostRate: {
      min: 10,
      max: 50,
      message: 'Carrying cost rate must be between 10% and 50%',
    },
  },

  examples: [
    {
      name: 'Small Shop Inventory',
      description: 'Inventory optimization for small laser cutting shop',
      inputs: {
        monthlyMaterialUsage: 1500,
        materialCostPerKg: 6,
        leadTimeWeeks: 1,
        orderingCost: 100,
        carryingCostRate: 25,
        stockoutCost: 300,
        demandVariability: 'medium',
        serviceLevel: '95',
      },
    },
    {
      name: 'High-Volume Operation',
      description: 'Inventory optimization for high-volume production',
      inputs: {
        monthlyMaterialUsage: 15000,
        materialCostPerKg: 10,
        leadTimeWeeks: 3,
        orderingCost: 300,
        carryingCostRate: 18,
        stockoutCost: 1500,
        demandVariability: 'low',
        serviceLevel: '99',
      },
    },
  ],

  tags: ['inventory', 'optimization', 'stock', 'ordering', 'cost-control'],
  
  relatedCalculators: [
    'consumable-cost-tracker',
    'operating-cost-analyzer',
    'material-selection',
    'supplier-comparison',
  ],

  learningResources: [
    {
      title: 'Inventory Management Fundamentals',
      type: 'article',
      url: '/learn/inventory-management',
    },
    {
      title: 'Just-in-Time vs. Safety Stock',
      type: 'video',
      url: '/learn/inventory-strategies',
    },
  ],
};

// Helper functions
function calculateOptimalInventory(
  monthlyUsage: number,
  costPerKg: number,
  leadTimeWeeks: number,
  orderingCost: number,
  carryingCostRate: number,
  demandVariability: string,
  serviceLevel: string
) {
  // Convert to annual figures
  const annualDemand = monthlyUsage * 12;
  const annualCarryingCost = costPerKg * (carryingCostRate / 100);
  
  // Economic Order Quantity (EOQ)
  const eoq = Math.sqrt((2 * annualDemand * orderingCost) / annualCarryingCost);
  
  // Lead time demand
  const leadTimeDemand = monthlyUsage * (leadTimeWeeks / 4.33); // 4.33 weeks per month
  
  // Safety stock calculation
  const variabilityFactors = { low: 1.28, medium: 1.65, high: 2.33 }; // Z-scores
  const serviceLevelFactors = { '90': 1.28, '95': 1.65, '99': 2.33 };
  
  const demandStdDev = leadTimeDemand * (demandVariability === 'low' ? 0.1 : 
                                       demandVariability === 'medium' ? 0.2 : 0.35);
  const zScore = serviceLevelFactors[serviceLevel] || 1.65;
  const safetyStock = zScore * demandStdDev;
  
  // Reorder point
  const reorderPoint = leadTimeDemand + safetyStock;
  
  // Maximum inventory level
  const maxInventory = reorderPoint + eoq;
  
  // Average inventory
  const averageInventory = (eoq / 2) + safetyStock;

  return {
    eoq: Math.round(eoq),
    safetyStock: Math.round(safetyStock),
    reorderPoint: Math.round(reorderPoint),
    maxInventory: Math.round(maxInventory),
    averageInventory: Math.round(averageInventory),
    leadTimeDemand: Math.round(leadTimeDemand),
    orderFrequency: Math.round((annualDemand / eoq) * 10) / 10, // orders per year
  };
}

function analyzeCosts(
  inventory: any,
  monthlyUsage: number,
  costPerKg: number,
  orderingCost: number,
  carryingCostRate: number,
  stockoutCost: number
) {
  const annualDemand = monthlyUsage * 12;
  const annualCarryingCost = costPerKg * (carryingCostRate / 100);
  
  // Annual ordering cost
  const annualOrderingCost = (annualDemand / inventory.eoq) * orderingCost;
  
  // Annual carrying cost
  const annualCarryingCostTotal = inventory.averageInventory * annualCarryingCost;
  
  // Safety stock carrying cost
  const safetyStockCost = inventory.safetyStock * annualCarryingCost;
  
  // Total annual inventory cost
  const totalAnnualCost = annualOrderingCost + annualCarryingCostTotal;
  
  // Average inventory value
  const averageInventoryValue = inventory.averageInventory * costPerKg;
  
  // Monthly costs
  const monthlyOrderingCost = annualOrderingCost / 12;
  const monthlyCarryingCost = annualCarryingCostTotal / 12;

  return {
    annualOrderingCost: Math.round(annualOrderingCost),
    annualCarryingCost: Math.round(annualCarryingCostTotal),
    safetyStockCost: Math.round(safetyStockCost),
    totalAnnualCost: Math.round(totalAnnualCost),
    monthlyOrderingCost: Math.round(monthlyOrderingCost),
    monthlyCarryingCost: Math.round(monthlyCarryingCost),
    averageInventoryValue: Math.round(averageInventoryValue),
    costPerKgStored: Math.round((annualCarryingCostTotal / annualDemand) * 100) / 100,
  };
}

function generateOrderingStrategy(inventory: any, monthlyUsage: number, leadTimeWeeks: number) {
  const daysPerOrder = (inventory.eoq / monthlyUsage) * 30; // Convert to days
  const ordersPerMonth = monthlyUsage / inventory.eoq;
  
  return {
    orderQuantity: inventory.eoq,
    orderFrequency: `Every ${Math.round(daysPerOrder)} days`,
    ordersPerMonth: Math.round(ordersPerMonth * 10) / 10,
    ordersPerYear: inventory.orderFrequency,
    reorderTrigger: `When inventory reaches ${inventory.reorderPoint} kg`,
    leadTimeBuffer: `${Math.round(inventory.safetyStock)} kg safety stock`,
    recommendedSchedule: generateOrderSchedule(daysPerOrder),
  };
}

function generateOrderSchedule(daysPerOrder: number) {
  if (daysPerOrder <= 7) return 'Weekly ordering recommended';
  if (daysPerOrder <= 14) return 'Bi-weekly ordering recommended';
  if (daysPerOrder <= 30) return 'Monthly ordering recommended';
  return 'Quarterly ordering recommended';
}

function generateRecommendations(inventory: any, costAnalysis: any, inputs: any) {
  const recommendations = [];

  // High carrying costs
  if (costAnalysis.annualCarryingCost > costAnalysis.annualOrderingCost * 2) {
    recommendations.push({
      category: 'Carrying Cost Reduction',
      recommendation: 'Reduce average inventory levels',
      rationale: 'Carrying costs are significantly higher than ordering costs',
      actions: [
        'Negotiate shorter lead times with suppliers',
        'Implement more frequent ordering',
        'Consider consignment inventory',
      ],
      potentialSaving: `$${Math.round(costAnalysis.annualCarryingCost * 0.2)}/year`,
    });
  }

  // High ordering costs
  if (costAnalysis.annualOrderingCost > costAnalysis.annualCarryingCost * 2) {
    recommendations.push({
      category: 'Ordering Cost Reduction',
      recommendation: 'Reduce ordering frequency',
      rationale: 'Ordering costs are significantly higher than carrying costs',
      actions: [
        'Negotiate volume discounts',
        'Implement electronic ordering systems',
        'Consolidate suppliers',
      ],
      potentialSaving: `$${Math.round(costAnalysis.annualOrderingCost * 0.3)}/year`,
    });
  }

  // High safety stock
  if (inventory.safetyStock > inputs.monthlyMaterialUsage * 0.5) {
    recommendations.push({
      category: 'Safety Stock Optimization',
      recommendation: 'Reduce safety stock requirements',
      rationale: 'Safety stock is more than 50% of monthly usage',
      actions: [
        'Improve demand forecasting',
        'Develop backup suppliers',
        'Implement vendor-managed inventory',
      ],
      potentialSaving: `$${Math.round(costAnalysis.safetyStockCost * 0.4)}/year`,
    });
  }

  // Inventory turnover
  const inventoryTurnover = (inputs.monthlyMaterialUsage * 12) / inventory.averageInventory;
  if (inventoryTurnover < 6) {
    recommendations.push({
      category: 'Inventory Turnover',
      recommendation: 'Improve inventory turnover',
      rationale: `Current turnover of ${Math.round(inventoryTurnover * 10) / 10} is below optimal`,
      actions: [
        'Reduce order quantities',
        'Implement just-in-time delivery',
        'Improve sales forecasting',
      ],
      potentialSaving: `$${Math.round(costAnalysis.averageInventoryValue * 0.1)}/year`,
    });
  }

  // Lead time optimization
  if (inputs.leadTimeWeeks > 4) {
    recommendations.push({
      category: 'Lead Time Reduction',
      recommendation: 'Negotiate shorter lead times',
      rationale: 'Long lead times require higher safety stock',
      actions: [
        'Develop local suppliers',
        'Negotiate expedited delivery options',
        'Consider alternative materials with shorter lead times',
      ],
      potentialSaving: `$${Math.round(costAnalysis.safetyStockCost * 0.3)}/year`,
    });
  }

  return recommendations;
}

export default inventoryOptimizerConfig;
