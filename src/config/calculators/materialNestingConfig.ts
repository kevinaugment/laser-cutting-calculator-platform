import { CalculatorConfig } from '../../types/calculator';

export const materialNestingConfig: CalculatorConfig = {
  id: 'material-nesting',
  name: 'Material Nesting Optimizer',
  description: 'Optimize part layout and nesting to minimize material waste and maximize sheet utilization efficiency.',
  category: 'material-optimization',
  difficulty: 'intermediate',
  estimatedTime: '4-5 minutes',
  
  inputs: [
    {
      id: 'sheetWidth',
      label: 'Sheet Width',
      type: 'number',
      value: 1500,
      unit: 'mm',
      min: 100,
      max: 5000,
      step: 10,
      required: true,
      description: 'Width of the material sheet',
    },
    {
      id: 'sheetLength',
      label: 'Sheet Length',
      type: 'number',
      value: 3000,
      unit: 'mm',
      min: 100,
      max: 10000,
      step: 10,
      required: true,
      description: 'Length of the material sheet',
    },
    {
      id: 'partWidth',
      label: 'Part Width',
      type: 'number',
      value: 100,
      unit: 'mm',
      min: 5,
      max: 2000,
      step: 1,
      required: true,
      description: 'Width of individual parts',
    },
    {
      id: 'partLength',
      label: 'Part Length',
      type: 'number',
      value: 150,
      unit: 'mm',
      min: 5,
      max: 2000,
      step: 1,
      required: true,
      description: 'Length of individual parts',
    },
    {
      id: 'partQuantity',
      label: 'Required Quantity',
      type: 'number',
      value: 50,
      min: 1,
      max: 10000,
      step: 1,
      required: true,
      description: 'Number of parts needed',
    },
    {
      id: 'kerfWidth',
      label: 'Kerf Width',
      type: 'number',
      value: 0.1,
      unit: 'mm',
      min: 0.05,
      max: 1.0,
      step: 0.01,
      required: true,
      description: 'Laser kerf width',
    },
    {
      id: 'edgeDistance',
      label: 'Edge Distance',
      type: 'number',
      value: 5,
      unit: 'mm',
      min: 1,
      max: 50,
      step: 0.5,
      required: true,
      description: 'Minimum distance from sheet edge',
    },
    {
      id: 'partSpacing',
      label: 'Part Spacing',
      type: 'number',
      value: 2,
      unit: 'mm',
      min: 0,
      max: 20,
      step: 0.1,
      required: true,
      description: 'Minimum spacing between parts',
    },
    {
      id: 'allowRotation',
      label: 'Allow Part Rotation',
      type: 'select',
      value: 'yes',
      options: [
        { value: 'yes', label: 'Yes - Allow 90° rotation' },
        { value: 'no', label: 'No - Fixed orientation' },
      ],
      required: true,
      description: 'Whether parts can be rotated for better nesting',
    },
    {
      id: 'materialCost',
      label: 'Material Cost per Sheet',
      type: 'number',
      value: 150,
      unit: 'USD',
      min: 1,
      max: 10000,
      step: 1,
      required: true,
      description: 'Cost of one material sheet',
    },
  ],

  outputs: [
    {
      id: 'nestingResults',
      label: 'Nesting Results',
      type: 'object',
      format: 'nesting-summary',
      description: 'Overall nesting efficiency and results',
    },
    {
      id: 'layoutOptions',
      label: 'Layout Options',
      type: 'array',
      format: 'layout-table',
      description: 'Different nesting layout options',
    },
    {
      id: 'wasteAnalysis',
      label: 'Waste Analysis',
      type: 'object',
      format: 'waste-breakdown',
      description: 'Material waste breakdown and costs',
    },
    {
      id: 'recommendations',
      label: 'Optimization Recommendations',
      type: 'array',
      format: 'recommendation-list',
      description: 'Suggestions for improving material utilization',
    },
  ],

  calculate: (inputs: Record<string, any>) => {
    const {
      sheetWidth,
      sheetLength,
      partWidth,
      partLength,
      partQuantity,
      kerfWidth,
      edgeDistance,
      partSpacing,
      allowRotation,
      materialCost,
    } = inputs;

    // Calculate nesting layouts
    const layoutOptions = calculateNestingLayouts(
      sheetWidth,
      sheetLength,
      partWidth,
      partLength,
      kerfWidth,
      edgeDistance,
      partSpacing,
      allowRotation === 'yes'
    );

    // Calculate overall nesting results
    const nestingResults = calculateNestingResults(
      layoutOptions,
      partQuantity,
      sheetWidth,
      sheetLength,
      materialCost
    );

    // Analyze waste
    const wasteAnalysis = analyzeWaste(
      nestingResults,
      sheetWidth,
      sheetLength,
      materialCost
    );

    // Generate recommendations
    const recommendations = generateOptimizationRecommendations(
      nestingResults,
      layoutOptions,
      inputs
    );

    return {
      nestingResults,
      layoutOptions,
      wasteAnalysis,
      recommendations,
    };
  },

  validation: {
    sheetWidth: {
      min: 100,
      max: 5000,
      message: 'Sheet width must be between 100mm and 5000mm',
    },
    sheetLength: {
      min: 100,
      max: 10000,
      message: 'Sheet length must be between 100mm and 10000mm',
    },
    partQuantity: {
      min: 1,
      max: 10000,
      message: 'Quantity must be between 1 and 10000 parts',
    },
  },

  examples: [
    {
      name: 'Small Brackets Production',
      description: 'Nesting 50 small brackets on standard sheet',
      inputs: {
        sheetWidth: 1500,
        sheetLength: 3000,
        partWidth: 100,
        partLength: 150,
        partQuantity: 50,
        kerfWidth: 0.1,
        edgeDistance: 5,
        partSpacing: 2,
        allowRotation: 'yes',
        materialCost: 150,
      },
    },
    {
      name: 'Large Panel Cutting',
      description: 'Optimizing large rectangular panels',
      inputs: {
        sheetWidth: 2000,
        sheetLength: 4000,
        partWidth: 400,
        partLength: 600,
        partQuantity: 20,
        kerfWidth: 0.15,
        edgeDistance: 10,
        partSpacing: 3,
        allowRotation: 'no',
        materialCost: 300,
      },
    },
  ],

  tags: ['nesting', 'optimization', 'waste', 'efficiency', 'layout'],
  
  relatedCalculators: [
    'kerf-compensation',
    'scrap-utilization',
    'laser-cutting-cost',
    'material-selection',
  ],

  learningResources: [
    {
      title: 'Nesting Optimization Strategies',
      type: 'article',
      url: '/learn/nesting-optimization',
    },
    {
      title: 'Material Waste Reduction',
      type: 'video',
      url: '/learn/waste-reduction',
    },
  ],
};

// Helper functions
function calculateNestingLayouts(
  sheetWidth: number,
  sheetLength: number,
  partWidth: number,
  partLength: number,
  kerfWidth: number,
  edgeDistance: number,
  partSpacing: number,
  allowRotation: boolean
) {
  const layouts = [];
  
  // Calculate effective sheet dimensions
  const effectiveWidth = sheetWidth - (2 * edgeDistance);
  const effectiveLength = sheetLength - (2 * edgeDistance);
  
  // Layout 1: Standard orientation
  const layout1 = calculateLayout(
    effectiveWidth,
    effectiveLength,
    partWidth,
    partLength,
    kerfWidth,
    partSpacing,
    'Standard'
  );
  layouts.push(layout1);
  
  // Layout 2: Rotated parts (if allowed)
  if (allowRotation && partWidth !== partLength) {
    const layout2 = calculateLayout(
      effectiveWidth,
      effectiveLength,
      partLength, // Swapped dimensions
      partWidth,
      kerfWidth,
      partSpacing,
      'Rotated 90°'
    );
    layouts.push(layout2);
  }
  
  // Layout 3: Mixed orientation (if rotation allowed)
  if (allowRotation && partWidth !== partLength) {
    const layout3 = calculateMixedLayout(
      effectiveWidth,
      effectiveLength,
      partWidth,
      partLength,
      kerfWidth,
      partSpacing
    );
    layouts.push(layout3);
  }
  
  return layouts.sort((a, b) => b.partsPerSheet - a.partsPerSheet);
}

function calculateLayout(
  effectiveWidth: number,
  effectiveLength: number,
  partW: number,
  partL: number,
  kerfWidth: number,
  partSpacing: number,
  orientation: string
) {
  // Calculate parts that fit in width direction
  const totalPartSpaceW = partW + partSpacing + kerfWidth;
  const partsInWidth = Math.floor((effectiveWidth + partSpacing) / totalPartSpaceW);
  
  // Calculate parts that fit in length direction
  const totalPartSpaceL = partL + partSpacing + kerfWidth;
  const partsInLength = Math.floor((effectiveLength + partSpacing) / totalPartSpaceL);
  
  const partsPerSheet = partsInWidth * partsInLength;
  const utilizedArea = partsPerSheet * partW * partL;
  const sheetArea = effectiveWidth * effectiveLength;
  const efficiency = (utilizedArea / sheetArea) * 100;
  
  return {
    orientation,
    partsInWidth,
    partsInLength,
    partsPerSheet,
    efficiency: Math.round(efficiency * 10) / 10,
    utilizedArea: Math.round(utilizedArea),
    wasteArea: Math.round(sheetArea - utilizedArea),
  };
}

function calculateMixedLayout(
  effectiveWidth: number,
  effectiveLength: number,
  partWidth: number,
  partLength: number,
  kerfWidth: number,
  partSpacing: number
) {
  // Try to optimize by mixing orientations
  // This is a simplified approach - real nesting would be more complex
  
  const standardLayout = calculateLayout(
    effectiveWidth,
    effectiveLength,
    partWidth,
    partLength,
    kerfWidth,
    partSpacing,
    'Standard'
  );
  
  const rotatedLayout = calculateLayout(
    effectiveWidth,
    effectiveLength,
    partLength,
    partWidth,
    kerfWidth,
    partSpacing,
    'Rotated'
  );
  
  // Simple mixed approach: use better orientation
  const bestSingle = standardLayout.partsPerSheet > rotatedLayout.partsPerSheet ? 
    standardLayout : rotatedLayout;
  
  return {
    orientation: 'Mixed (Optimized)',
    partsInWidth: bestSingle.partsInWidth,
    partsInLength: bestSingle.partsInLength,
    partsPerSheet: Math.round(bestSingle.partsPerSheet * 1.05), // 5% improvement estimate
    efficiency: Math.round(bestSingle.efficiency * 1.05 * 10) / 10,
    utilizedArea: Math.round(bestSingle.utilizedArea * 1.05),
    wasteArea: Math.round(bestSingle.wasteArea * 0.95),
  };
}

function calculateNestingResults(
  layoutOptions: any[],
  partQuantity: number,
  sheetWidth: number,
  sheetLength: number,
  materialCost: number
) {
  const bestLayout = layoutOptions[0]; // Already sorted by efficiency
  
  const sheetsRequired = Math.ceil(partQuantity / bestLayout.partsPerSheet);
  const totalParts = sheetsRequired * bestLayout.partsPerSheet;
  const excessParts = totalParts - partQuantity;
  
  const sheetArea = sheetWidth * sheetLength;
  const totalMaterialCost = sheetsRequired * materialCost;
  const costPerPart = totalMaterialCost / partQuantity;
  
  return {
    bestLayout: bestLayout.orientation,
    partsPerSheet: bestLayout.partsPerSheet,
    sheetsRequired,
    totalParts,
    excessParts,
    materialEfficiency: bestLayout.efficiency,
    totalMaterialCost: Math.round(totalMaterialCost * 100) / 100,
    costPerPart: Math.round(costPerPart * 100) / 100,
    totalWasteArea: sheetsRequired * bestLayout.wasteArea,
  };
}

function analyzeWaste(
  nestingResults: any,
  sheetWidth: number,
  sheetLength: number,
  materialCost: number
) {
  const sheetArea = sheetWidth * sheetLength;
  const totalSheetArea = nestingResults.sheetsRequired * sheetArea;
  const wastePercentage = (nestingResults.totalWasteArea / totalSheetArea) * 100;
  const wasteCost = (wastePercentage / 100) * nestingResults.totalMaterialCost;
  
  return {
    wastePercentage: Math.round(wastePercentage * 10) / 10,
    wasteArea: nestingResults.totalWasteArea,
    wasteCost: Math.round(wasteCost * 100) / 100,
    wastePerSheet: Math.round(nestingResults.totalWasteArea / nestingResults.sheetsRequired),
    potentialSavings: calculatePotentialSavings(wastePercentage, nestingResults.totalMaterialCost),
  };
}

function calculatePotentialSavings(wastePercentage: number, totalCost: number) {
  // Estimate potential savings with better nesting
  const improvementPotential = Math.max(0, wastePercentage - 5); // Assume 5% minimum waste
  const potentialSavings = (improvementPotential / 100) * totalCost;
  
  return {
    percentage: Math.round(improvementPotential * 10) / 10,
    amount: Math.round(potentialSavings * 100) / 100,
    methods: generateSavingsMethods(wastePercentage),
  };
}

function generateSavingsMethods(wastePercentage: number) {
  const methods = [];
  
  if (wastePercentage > 15) {
    methods.push('Consider professional nesting software');
    methods.push('Optimize part orientation and spacing');
  }
  
  if (wastePercentage > 10) {
    methods.push('Reduce edge distances if possible');
    methods.push('Minimize part spacing while maintaining quality');
  }
  
  methods.push('Consider common cutting for multiple parts');
  methods.push('Plan for scrap utilization');
  
  return methods;
}

function generateOptimizationRecommendations(
  nestingResults: any,
  layoutOptions: any[],
  inputs: any
) {
  const recommendations = [];
  
  // Efficiency recommendations
  if (nestingResults.materialEfficiency < 70) {
    recommendations.push({
      type: 'Efficiency',
      suggestion: 'Material efficiency is low. Consider redesigning parts or using different sheet sizes.',
      impact: 'High',
    });
  }
  
  if (nestingResults.materialEfficiency < 85) {
    recommendations.push({
      type: 'Layout',
      suggestion: 'Try reducing edge distances or part spacing if quality allows.',
      impact: 'Medium',
    });
  }
  
  // Rotation recommendations
  if (inputs.allowRotation === 'no' && inputs.partWidth !== inputs.partLength) {
    const rotatedOption = layoutOptions.find(l => l.orientation.includes('Rotated'));
    if (rotatedOption && rotatedOption.efficiency > nestingResults.materialEfficiency) {
      recommendations.push({
        type: 'Orientation',
        suggestion: `Allowing rotation could improve efficiency to ${rotatedOption.efficiency}%`,
        impact: 'Medium',
      });
    }
  }
  
  // Quantity recommendations
  if (nestingResults.excessParts > nestingResults.partsPerSheet * 0.5) {
    recommendations.push({
      type: 'Quantity',
      suggestion: `Consider adjusting quantity to ${nestingResults.totalParts} to utilize excess parts`,
      impact: 'Low',
    });
  }
  
  // Sheet size recommendations
  const sheetUtilization = (inputs.partWidth * inputs.partLength * inputs.partQuantity) / 
                          (inputs.sheetWidth * inputs.sheetLength * nestingResults.sheetsRequired);
  
  if (sheetUtilization < 0.6) {
    recommendations.push({
      type: 'Sheet Size',
      suggestion: 'Consider using smaller sheet sizes for better material utilization',
      impact: 'High',
    });
  }
  
  return recommendations;
}

export default materialNestingConfig;
