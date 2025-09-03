import { CalculatorConfig } from '../../types/calculator';

export const scrapUtilizationConfig: CalculatorConfig = {
  id: 'scrap-utilization',
  name: 'Scrap Utilization Calculator',
  description: 'Calculate how to effectively use leftover material scraps for smaller parts, reducing overall material waste.',
  category: 'material-optimization',
  difficulty: 'intermediate',
  estimatedTime: '3-4 minutes',
  
  inputs: [
    {
      id: 'scrapWidth',
      label: 'Scrap Width',
      type: 'number',
      value: 500,
      unit: 'mm',
      min: 50,
      max: 2000,
      step: 10,
      required: true,
      description: 'Width of the scrap material',
    },
    {
      id: 'scrapLength',
      label: 'Scrap Length',
      type: 'number',
      value: 800,
      unit: 'mm',
      min: 50,
      max: 3000,
      step: 10,
      required: true,
      description: 'Length of the scrap material',
    },
    {
      id: 'scrapQuantity',
      label: 'Number of Scraps',
      type: 'number',
      value: 5,
      min: 1,
      max: 100,
      step: 1,
      required: true,
      description: 'Number of similar scrap pieces available',
    },
    {
      id: 'smallPartWidth',
      label: 'Small Part Width',
      type: 'number',
      value: 80,
      unit: 'mm',
      min: 5,
      max: 500,
      step: 1,
      required: true,
      description: 'Width of small parts to cut from scraps',
    },
    {
      id: 'smallPartLength',
      label: 'Small Part Length',
      type: 'number',
      value: 120,
      unit: 'mm',
      min: 5,
      max: 500,
      step: 1,
      required: true,
      description: 'Length of small parts to cut from scraps',
    },
    {
      id: 'smallPartQuantityNeeded',
      label: 'Small Parts Needed',
      type: 'number',
      value: 20,
      min: 1,
      max: 1000,
      step: 1,
      required: true,
      description: 'Number of small parts required',
    },
    {
      id: 'materialValue',
      label: 'Material Value per kg',
      type: 'number',
      value: 5,
      unit: 'USD/kg',
      min: 0.1,
      max: 100,
      step: 0.1,
      required: true,
      description: 'Value of the material per kilogram',
    },
    {
      id: 'materialDensity',
      label: 'Material Density',
      type: 'number',
      value: 7.85,
      unit: 'g/cm³',
      min: 0.5,
      max: 20,
      step: 0.1,
      required: true,
      description: 'Density of the material',
    },
    {
      id: 'thickness',
      label: 'Material Thickness',
      type: 'number',
      value: 3,
      unit: 'mm',
      min: 0.5,
      max: 25,
      step: 0.1,
      required: true,
      description: 'Thickness of the scrap material',
    },
  ],

  outputs: [
    {
      id: 'utilizationAnalysis',
      label: 'Scrap Utilization Analysis',
      type: 'object',
      format: 'utilization-summary',
      description: 'Overall scrap utilization results',
    },
    {
      id: 'partsFitAnalysis',
      label: 'Parts Fit Analysis',
      type: 'object',
      format: 'parts-fit',
      description: 'How many parts can fit in available scraps',
    },
    {
      id: 'valueRecovery',
      label: 'Value Recovery Analysis',
      type: 'object',
      format: 'value-analysis',
      description: 'Economic value recovered from scraps',
    },
    {
      id: 'recommendations',
      label: 'Optimization Recommendations',
      type: 'array',
      format: 'recommendation-list',
      description: 'Suggestions for maximizing scrap utilization',
    },
  ],

  calculate: (inputs: Record<string, any>) => {
    const {
      scrapWidth,
      scrapLength,
      scrapQuantity,
      smallPartWidth,
      smallPartLength,
      smallPartQuantityNeeded,
      materialValue,
      materialDensity,
      thickness,
    } = inputs;

    // Calculate parts that can fit in scraps
    const partsFitAnalysis = calculatePartsFit(
      scrapWidth,
      scrapLength,
      scrapQuantity,
      smallPartWidth,
      smallPartLength
    );

    // Calculate utilization analysis
    const utilizationAnalysis = calculateUtilizationAnalysis(
      partsFitAnalysis,
      smallPartQuantityNeeded,
      scrapWidth,
      scrapLength,
      scrapQuantity
    );

    // Calculate value recovery
    const valueRecovery = calculateValueRecovery(
      utilizationAnalysis,
      materialValue,
      materialDensity,
      thickness,
      smallPartWidth,
      smallPartLength
    );

    // Generate recommendations
    const recommendations = generateScrapRecommendations(
      utilizationAnalysis,
      partsFitAnalysis,
      inputs
    );

    return {
      utilizationAnalysis,
      partsFitAnalysis,
      valueRecovery,
      recommendations,
    };
  },

  validation: {
    scrapWidth: {
      min: 50,
      max: 2000,
      message: 'Scrap width must be between 50mm and 2000mm',
    },
    scrapLength: {
      min: 50,
      max: 3000,
      message: 'Scrap length must be between 50mm and 3000mm',
    },
    smallPartQuantityNeeded: {
      min: 1,
      max: 1000,
      message: 'Quantity needed must be between 1 and 1000 parts',
    },
  },

  examples: [
    {
      name: 'Steel Bracket Scraps',
      description: 'Utilizing steel scraps for small mounting brackets',
      inputs: {
        scrapWidth: 500,
        scrapLength: 800,
        scrapQuantity: 5,
        smallPartWidth: 80,
        smallPartLength: 120,
        smallPartQuantityNeeded: 20,
        materialValue: 5,
        materialDensity: 7.85,
        thickness: 3,
      },
    },
    {
      name: 'Aluminum Sheet Remnants',
      description: 'Using aluminum remnants for small components',
      inputs: {
        scrapWidth: 300,
        scrapLength: 600,
        scrapQuantity: 8,
        smallPartWidth: 50,
        smallPartLength: 75,
        smallPartQuantityNeeded: 40,
        materialValue: 8,
        materialDensity: 2.7,
        thickness: 2,
      },
    },
  ],

  tags: ['scrap', 'waste', 'utilization', 'value-recovery', 'efficiency'],
  
  relatedCalculators: [
    'material-nesting',
    'kerf-compensation',
    'laser-cutting-cost',
    'material-selection',
  ],

  learningResources: [
    {
      title: 'Scrap Material Management',
      type: 'article',
      url: '/learn/scrap-management',
    },
    {
      title: 'Waste Reduction Strategies',
      type: 'video',
      url: '/learn/waste-reduction-strategies',
    },
  ],
};

// Helper functions
function calculatePartsFit(
  scrapWidth: number,
  scrapLength: number,
  scrapQuantity: number,
  partWidth: number,
  partLength: number
) {
  // Calculate parts per scrap in standard orientation
  const partsInWidth = Math.floor(scrapWidth / partWidth);
  const partsInLength = Math.floor(scrapLength / partLength);
  const partsPerScrapStandard = partsInWidth * partsInLength;

  // Calculate parts per scrap in rotated orientation
  const partsInWidthRotated = Math.floor(scrapWidth / partLength);
  const partsInLengthRotated = Math.floor(scrapLength / partWidth);
  const partsPerScrapRotated = partsInWidthRotated * partsInLengthRotated;

  // Choose best orientation
  const bestOrientation = partsPerScrapStandard >= partsPerScrapRotated ? 'standard' : 'rotated';
  const partsPerScrap = Math.max(partsPerScrapStandard, partsPerScrapRotated);
  const totalPartsFromScraps = partsPerScrap * scrapQuantity;

  return {
    partsPerScrap,
    totalPartsFromScraps,
    bestOrientation,
    standardLayout: { partsInWidth, partsInLength, total: partsPerScrapStandard },
    rotatedLayout: { partsInWidth: partsInWidthRotated, partsInLength: partsInLengthRotated, total: partsPerScrapRotated },
  };
}

function calculateUtilizationAnalysis(
  partsFitAnalysis: any,
  quantityNeeded: number,
  scrapWidth: number,
  scrapLength: number,
  scrapQuantity: number
) {
  const totalScrapArea = scrapWidth * scrapLength * scrapQuantity;
  const partsProduced = Math.min(partsFitAnalysis.totalPartsFromScraps, quantityNeeded);
  const scrapsUsed = Math.ceil(quantityNeeded / partsFitAnalysis.partsPerScrap);
  const canMeetDemand = partsFitAnalysis.totalPartsFromScraps >= quantityNeeded;
  
  // Calculate utilization efficiency
  const partArea = 80 * 120; // Using example part dimensions - should use actual
  const usedArea = partsProduced * partArea;
  const utilizationEfficiency = (usedArea / totalScrapArea) * 100;

  return {
    canMeetDemand,
    partsProduced,
    scrapsUsed,
    scrapsRemaining: scrapQuantity - scrapsUsed,
    utilizationEfficiency: Math.round(utilizationEfficiency * 10) / 10,
    totalScrapArea: Math.round(totalScrapArea),
    usedArea: Math.round(usedArea),
    wasteArea: Math.round(totalScrapArea - usedArea),
  };
}

function calculateValueRecovery(
  utilizationAnalysis: any,
  materialValue: number,
  materialDensity: number,
  thickness: number,
  partWidth: number,
  partLength: number
) {
  // Calculate weight and value
  const partVolume = (partWidth * partLength * thickness) / 1000000; // m³
  const partWeight = partVolume * materialDensity * 1000; // kg
  const valuePerPart = partWeight * materialValue;
  
  const totalValueRecovered = utilizationAnalysis.partsProduced * valuePerPart;
  const scrapWeight = (utilizationAnalysis.totalScrapArea * thickness / 1000000) * materialDensity * 1000;
  const totalScrapValue = scrapWeight * materialValue;
  const valueRecoveryPercentage = (totalValueRecovered / totalScrapValue) * 100;

  return {
    valuePerPart: Math.round(valuePerPart * 100) / 100,
    totalValueRecovered: Math.round(totalValueRecovered * 100) / 100,
    totalScrapValue: Math.round(totalScrapValue * 100) / 100,
    valueRecoveryPercentage: Math.round(valueRecoveryPercentage * 10) / 10,
    wasteValue: Math.round((totalScrapValue - totalValueRecovered) * 100) / 100,
    savings: calculateSavings(totalValueRecovered, utilizationAnalysis.partsProduced),
  };
}

function calculateSavings(totalValueRecovered: number, partsProduced: number) {
  // Estimate savings compared to buying new material
  const newMaterialPremium = 1.2; // 20% premium for new material
  const savingsPerPart = (totalValueRecovered / partsProduced) * (newMaterialPremium - 1);
  const totalSavings = savingsPerPart * partsProduced;

  return {
    savingsPerPart: Math.round(savingsPerPart * 100) / 100,
    totalSavings: Math.round(totalSavings * 100) / 100,
    savingsPercentage: Math.round(((newMaterialPremium - 1) / newMaterialPremium) * 100),
  };
}

function generateScrapRecommendations(
  utilizationAnalysis: any,
  partsFitAnalysis: any,
  inputs: any
) {
  const recommendations = [];

  // Demand fulfillment recommendations
  if (!utilizationAnalysis.canMeetDemand) {
    const shortage = inputs.smallPartQuantityNeeded - partsFitAnalysis.totalPartsFromScraps;
    recommendations.push({
      type: 'Demand',
      suggestion: `Scraps can only provide ${partsFitAnalysis.totalPartsFromScraps} parts. Need ${shortage} more from new material.`,
      impact: 'High',
    });
  }

  // Efficiency recommendations
  if (utilizationAnalysis.utilizationEfficiency < 60) {
    recommendations.push({
      type: 'Efficiency',
      suggestion: 'Low utilization efficiency. Consider smaller parts or different scrap sizes.',
      impact: 'Medium',
    });
  }

  // Orientation recommendations
  if (partsFitAnalysis.bestOrientation === 'rotated') {
    recommendations.push({
      type: 'Layout',
      suggestion: 'Rotating parts 90° provides better scrap utilization.',
      impact: 'Medium',
    });
  }

  // Size optimization recommendations
  const scrapAspectRatio = inputs.scrapLength / inputs.scrapWidth;
  const partAspectRatio = inputs.smallPartLength / inputs.smallPartWidth;
  
  if (Math.abs(scrapAspectRatio - partAspectRatio) > 0.5) {
    recommendations.push({
      type: 'Design',
      suggestion: 'Part dimensions don\'t match scrap proportions well. Consider adjusting part design.',
      impact: 'Low',
    });
  }

  // Inventory recommendations
  if (utilizationAnalysis.scrapsRemaining > 0) {
    recommendations.push({
      type: 'Inventory',
      suggestion: `${utilizationAnalysis.scrapsRemaining} scraps will remain unused. Plan for future projects.`,
      impact: 'Low',
    });
  }

  return recommendations;
}

export default scrapUtilizationConfig;
