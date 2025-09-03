import { CalculatorConfig } from '../../types/calculator';

export const sheetOptimizationConfig: CalculatorConfig = {
  id: 'sheet-optimization',
  name: 'Sheet Size Optimization',
  description: 'Determine optimal sheet sizes for your parts to minimize waste and reduce material costs.',
  category: 'material-optimization',
  difficulty: 'intermediate',
  estimatedTime: '3-4 minutes',
  
  inputs: [
    {
      id: 'partWidth',
      label: 'Part Width',
      type: 'number',
      value: 200,
      unit: 'mm',
      min: 10,
      max: 2000,
      step: 1,
      required: true,
      description: 'Width of the parts to be cut',
    },
    {
      id: 'partLength',
      label: 'Part Length',
      type: 'number',
      value: 300,
      unit: 'mm',
      min: 10,
      max: 3000,
      step: 1,
      required: true,
      description: 'Length of the parts to be cut',
    },
    {
      id: 'partQuantity',
      label: 'Total Quantity Needed',
      type: 'number',
      value: 100,
      min: 1,
      max: 10000,
      step: 1,
      required: true,
      description: 'Total number of parts needed',
    },
    {
      id: 'availableSheetSizes',
      label: 'Available Sheet Sizes',
      type: 'select',
      value: 'standard',
      options: [
        { value: 'standard', label: 'Standard Sizes (1500x3000, 2000x4000, etc.)' },
        { value: 'custom', label: 'Custom Size Analysis' },
        { value: 'all', label: 'All Available Sizes' },
      ],
      required: true,
      description: 'Which sheet sizes to consider',
    },
    {
      id: 'materialCostPerKg',
      label: 'Material Cost per kg',
      type: 'number',
      value: 5,
      unit: 'USD/kg',
      min: 0.1,
      max: 100,
      step: 0.1,
      required: true,
      description: 'Cost of material per kilogram',
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
      max: 50,
      step: 0.1,
      required: true,
      description: 'Thickness of the material',
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
      description: 'Laser cutting kerf width',
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
  ],

  outputs: [
    {
      id: 'optimalSheetSize',
      label: 'Optimal Sheet Size',
      type: 'object',
      format: 'optimal-sheet',
      description: 'Recommended optimal sheet size',
    },
    {
      id: 'sheetComparison',
      label: 'Sheet Size Comparison',
      type: 'array',
      format: 'sheet-comparison-table',
      description: 'Comparison of different sheet sizes',
    },
    {
      id: 'costAnalysis',
      label: 'Cost Analysis',
      type: 'object',
      format: 'cost-breakdown',
      description: 'Detailed cost analysis for optimal size',
    },
    {
      id: 'recommendations',
      label: 'Optimization Recommendations',
      type: 'array',
      format: 'recommendation-list',
      description: 'Suggestions for further optimization',
    },
  ],

  calculate: (inputs: Record<string, any>) => {
    const {
      partWidth,
      partLength,
      partQuantity,
      availableSheetSizes,
      materialCostPerKg,
      materialDensity,
      thickness,
      kerfWidth,
      edgeDistance,
    } = inputs;

    // Get sheet sizes to analyze
    const sheetSizes = getSheetSizesToAnalyze(availableSheetSizes);

    // Calculate comparison for all sheet sizes
    const sheetComparison = calculateSheetComparison(
      sheetSizes,
      partWidth,
      partLength,
      partQuantity,
      kerfWidth,
      edgeDistance,
      materialCostPerKg,
      materialDensity,
      thickness
    );

    // Find optimal sheet size
    const optimalSheetSize = findOptimalSheetSize(sheetComparison);

    // Calculate detailed cost analysis
    const costAnalysis = calculateDetailedCostAnalysis(
      optimalSheetSize,
      partQuantity,
      materialCostPerKg,
      materialDensity,
      thickness
    );

    // Generate recommendations
    const recommendations = generateOptimizationRecommendations(
      sheetComparison,
      optimalSheetSize,
      inputs
    );

    return {
      optimalSheetSize,
      sheetComparison,
      costAnalysis,
      recommendations,
    };
  },

  validation: {
    partWidth: {
      min: 10,
      max: 2000,
      message: 'Part width must be between 10mm and 2000mm',
    },
    partLength: {
      min: 10,
      max: 3000,
      message: 'Part length must be between 10mm and 3000mm',
    },
    partQuantity: {
      min: 1,
      max: 10000,
      message: 'Quantity must be between 1 and 10000 parts',
    },
  },

  examples: [
    {
      name: 'Medium Production Run',
      description: 'Optimizing sheet size for 100 medium-sized parts',
      inputs: {
        partWidth: 200,
        partLength: 300,
        partQuantity: 100,
        availableSheetSizes: 'standard',
        materialCostPerKg: 5,
        materialDensity: 7.85,
        thickness: 3,
        kerfWidth: 0.1,
        edgeDistance: 5,
      },
    },
    {
      name: 'Small Parts High Volume',
      description: 'Sheet optimization for high volume small parts',
      inputs: {
        partWidth: 50,
        partLength: 80,
        partQuantity: 500,
        availableSheetSizes: 'all',
        materialCostPerKg: 8,
        materialDensity: 2.7,
        thickness: 2,
        kerfWidth: 0.08,
        edgeDistance: 3,
      },
    },
  ],

  tags: ['sheet-size', 'optimization', 'cost', 'efficiency', 'material'],
  
  relatedCalculators: [
    'material-nesting',
    'scrap-utilization',
    'laser-cutting-cost',
    'kerf-compensation',
  ],

  learningResources: [
    {
      title: 'Sheet Size Selection Guide',
      type: 'article',
      url: '/learn/sheet-size-selection',
    },
    {
      title: 'Material Cost Optimization',
      type: 'video',
      url: '/learn/material-cost-optimization',
    },
  ],
};

// Helper functions
function getSheetSizesToAnalyze(availableSheetSizes: string) {
  const standardSizes = [
    { width: 1250, length: 2500, name: '1250x2500' },
    { width: 1500, length: 3000, name: '1500x3000' },
    { width: 2000, length: 4000, name: '2000x4000' },
    { width: 2500, length: 5000, name: '2500x5000' },
  ];

  const customSizes = [
    { width: 1000, length: 2000, name: '1000x2000' },
    { width: 1200, length: 2400, name: '1200x2400' },
    { width: 1800, length: 3600, name: '1800x3600' },
  ];

  if (availableSheetSizes === 'standard') {
    return standardSizes;
  } else if (availableSheetSizes === 'custom') {
    return customSizes;
  } else {
    return [...standardSizes, ...customSizes];
  }
}

function calculateSheetComparison(
  sheetSizes: any[],
  partWidth: number,
  partLength: number,
  partQuantity: number,
  kerfWidth: number,
  edgeDistance: number,
  materialCostPerKg: number,
  materialDensity: number,
  thickness: number
) {
  return sheetSizes.map(sheet => {
    const analysis = analyzeSheetSize(
      sheet,
      partWidth,
      partLength,
      partQuantity,
      kerfWidth,
      edgeDistance,
      materialCostPerKg,
      materialDensity,
      thickness
    );
    return { ...sheet, ...analysis };
  }).sort((a, b) => a.costPerPart - b.costPerPart);
}

function analyzeSheetSize(
  sheet: any,
  partWidth: number,
  partLength: number,
  partQuantity: number,
  kerfWidth: number,
  edgeDistance: number,
  materialCostPerKg: number,
  materialDensity: number,
  thickness: number
) {
  // Calculate effective cutting area
  const effectiveWidth = sheet.width - (2 * edgeDistance);
  const effectiveLength = sheet.length - (2 * edgeDistance);

  // Calculate parts per sheet (standard orientation)
  const partSpaceWidth = partWidth + kerfWidth;
  const partSpaceLength = partLength + kerfWidth;
  
  const partsInWidth = Math.floor(effectiveWidth / partSpaceWidth);
  const partsInLength = Math.floor(effectiveLength / partSpaceLength);
  const partsPerSheetStandard = partsInWidth * partsInLength;

  // Calculate parts per sheet (rotated orientation)
  const partsInWidthRotated = Math.floor(effectiveWidth / partSpaceLength);
  const partsInLengthRotated = Math.floor(effectiveLength / partSpaceWidth);
  const partsPerSheetRotated = partsInWidthRotated * partsInLengthRotated;

  // Choose best orientation
  const partsPerSheet = Math.max(partsPerSheetStandard, partsPerSheetRotated);
  const bestOrientation = partsPerSheetStandard >= partsPerSheetRotated ? 'standard' : 'rotated';

  // Calculate sheets needed
  const sheetsNeeded = Math.ceil(partQuantity / partsPerSheet);
  const totalParts = sheetsNeeded * partsPerSheet;
  const excessParts = totalParts - partQuantity;

  // Calculate material efficiency
  const partArea = partWidth * partLength;
  const sheetArea = sheet.width * sheet.length;
  const materialEfficiency = (partsPerSheet * partArea) / sheetArea * 100;

  // Calculate costs
  const sheetWeight = (sheetArea * thickness / 1000000) * materialDensity; // kg
  const sheetCost = sheetWeight * materialCostPerKg;
  const totalCost = sheetsNeeded * sheetCost;
  const costPerPart = totalCost / partQuantity;

  return {
    partsPerSheet,
    sheetsNeeded,
    totalParts,
    excessParts,
    materialEfficiency: Math.round(materialEfficiency * 10) / 10,
    sheetCost: Math.round(sheetCost * 100) / 100,
    totalCost: Math.round(totalCost * 100) / 100,
    costPerPart: Math.round(costPerPart * 100) / 100,
    bestOrientation,
    wastePercentage: Math.round((100 - materialEfficiency) * 10) / 10,
  };
}

function findOptimalSheetSize(sheetComparison: any[]) {
  // Already sorted by cost per part, so first is optimal
  const optimal = sheetComparison[0];
  
  return {
    ...optimal,
    rank: 1,
    savings: calculateSavings(optimal, sheetComparison),
  };
}

function calculateSavings(optimal: any, allOptions: any[]) {
  if (allOptions.length < 2) return { amount: 0, percentage: 0 };
  
  const worstOption = allOptions[allOptions.length - 1];
  const savingsAmount = worstOption.totalCost - optimal.totalCost;
  const savingsPercentage = (savingsAmount / worstOption.totalCost) * 100;
  
  return {
    amount: Math.round(savingsAmount * 100) / 100,
    percentage: Math.round(savingsPercentage * 10) / 10,
    comparedTo: worstOption.name,
  };
}

function calculateDetailedCostAnalysis(
  optimalSheet: any,
  partQuantity: number,
  materialCostPerKg: number,
  materialDensity: number,
  thickness: number
) {
  const materialCost = optimalSheet.totalCost;
  const wasteCost = (optimalSheet.wastePercentage / 100) * materialCost;
  const usefulMaterialCost = materialCost - wasteCost;
  
  return {
    materialCost: Math.round(materialCost * 100) / 100,
    wasteCost: Math.round(wasteCost * 100) / 100,
    usefulMaterialCost: Math.round(usefulMaterialCost * 100) / 100,
    costPerPart: optimalSheet.costPerPart,
    materialEfficiency: optimalSheet.materialEfficiency,
    sheetsRequired: optimalSheet.sheetsNeeded,
    breakdown: {
      rawMaterial: Math.round(materialCost * 100) / 100,
      waste: Math.round(wasteCost * 100) / 100,
      excessParts: optimalSheet.excessParts > 0 ? 
        Math.round((optimalSheet.excessParts / optimalSheet.totalParts) * materialCost * 100) / 100 : 0,
    },
  };
}

function generateOptimizationRecommendations(
  sheetComparison: any[],
  optimalSheet: any,
  inputs: any
) {
  const recommendations = [];

  // Efficiency recommendations
  if (optimalSheet.materialEfficiency < 70) {
    recommendations.push({
      type: 'Efficiency',
      suggestion: 'Material efficiency is low. Consider adjusting part dimensions or using custom sheet sizes.',
      impact: 'High',
    });
  }

  // Alternative sheet recommendations
  if (sheetComparison.length > 1) {
    const secondBest = sheetComparison[1];
    const costDifference = secondBest.costPerPart - optimalSheet.costPerPart;
    
    if (costDifference < 0.10) { // Less than 10 cents difference
      recommendations.push({
        type: 'Alternative',
        suggestion: `${secondBest.name} is only $${costDifference.toFixed(2)} more per part and might offer other advantages.`,
        impact: 'Low',
      });
    }
  }

  // Quantity optimization
  if (optimalSheet.excessParts > optimalSheet.partsPerSheet * 0.3) {
    const suggestedQuantity = optimalSheet.totalParts;
    recommendations.push({
      type: 'Quantity',
      suggestion: `Consider increasing order to ${suggestedQuantity} parts to utilize excess material.`,
      impact: 'Medium',
    });
  }

  // Part design recommendations
  const partAspectRatio = inputs.partLength / inputs.partWidth;
  const sheetAspectRatio = optimalSheet.length / optimalSheet.width;
  
  if (Math.abs(partAspectRatio - sheetAspectRatio) > 1) {
    recommendations.push({
      type: 'Design',
      suggestion: 'Part proportions don\'t match sheet proportions well. Consider adjusting part design.',
      impact: 'Medium',
    });
  }

  // Orientation recommendations
  if (optimalSheet.bestOrientation === 'rotated') {
    recommendations.push({
      type: 'Layout',
      suggestion: 'Rotating parts 90° provides better material utilization.',
      impact: 'Low',
    });
  }

  return recommendations;
}

export default sheetOptimizationConfig;
