import { CalculatorConfig } from '../../types/calculator';

export const materialYieldConfig: CalculatorConfig = {
  id: 'material-yield',
  name: 'Material Yield Calculator',
  description: 'Calculate actual material yield considering kerf loss, edge waste, and cutting inefficiencies to predict true material usage.',
  category: 'material-optimization',
  difficulty: 'intermediate',
  estimatedTime: '3-4 minutes',
  
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
      id: 'partArea',
      label: 'Total Part Area',
      type: 'number',
      value: 50000,
      unit: 'mm²',
      min: 100,
      max: 1000000,
      step: 100,
      required: true,
      description: 'Total area of all parts to be cut',
    },
    {
      id: 'cuttingLength',
      label: 'Total Cutting Length',
      type: 'number',
      value: 2000,
      unit: 'mm',
      min: 100,
      max: 50000,
      step: 10,
      required: true,
      description: 'Total length of all cutting paths',
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
    {
      id: 'numberOfParts',
      label: 'Number of Parts',
      type: 'number',
      value: 10,
      min: 1,
      max: 1000,
      step: 1,
      required: true,
      description: 'Total number of individual parts',
    },
    {
      id: 'materialType',
      label: 'Material Type',
      type: 'select',
      value: 'carbon_steel',
      options: [
        { value: 'carbon_steel', label: 'Carbon Steel' },
        { value: 'stainless_steel', label: 'Stainless Steel' },
        { value: 'aluminum', label: 'Aluminum' },
        { value: 'copper', label: 'Copper' },
        { value: 'acrylic', label: 'Acrylic' },
        { value: 'wood', label: 'Wood' },
      ],
      required: true,
      description: 'Type of material being cut',
    },
    {
      id: 'cuttingComplexity',
      label: 'Cutting Complexity',
      type: 'select',
      value: 'medium',
      options: [
        { value: 'simple', label: 'Simple (rectangles, basic shapes)' },
        { value: 'medium', label: 'Medium (some curves, holes)' },
        { value: 'complex', label: 'Complex (intricate details, many features)' },
      ],
      required: true,
      description: 'Complexity of the cutting patterns',
    },
  ],

  outputs: [
    {
      id: 'yieldAnalysis',
      label: 'Material Yield Analysis',
      type: 'object',
      format: 'yield-summary',
      description: 'Overall material yield results',
    },
    {
      id: 'lossBreakdown',
      label: 'Material Loss Breakdown',
      type: 'object',
      format: 'loss-analysis',
      description: 'Detailed breakdown of material losses',
    },
    {
      id: 'efficiencyMetrics',
      label: 'Efficiency Metrics',
      type: 'object',
      format: 'efficiency-metrics',
      description: 'Key efficiency indicators',
    },
    {
      id: 'recommendations',
      label: 'Yield Improvement Recommendations',
      type: 'array',
      format: 'recommendation-list',
      description: 'Suggestions for improving material yield',
    },
  ],

  calculate: (inputs: Record<string, any>) => {
    const {
      sheetWidth,
      sheetLength,
      partArea,
      cuttingLength,
      kerfWidth,
      edgeDistance,
      numberOfParts,
      materialType,
      cuttingComplexity,
    } = inputs;

    // Calculate material losses
    const lossBreakdown = calculateMaterialLosses(
      sheetWidth,
      sheetLength,
      partArea,
      cuttingLength,
      kerfWidth,
      edgeDistance,
      numberOfParts,
      materialType,
      cuttingComplexity
    );

    // Calculate yield analysis
    const yieldAnalysis = calculateYieldAnalysis(
      sheetWidth,
      sheetLength,
      partArea,
      lossBreakdown
    );

    // Calculate efficiency metrics
    const efficiencyMetrics = calculateEfficiencyMetrics(
      yieldAnalysis,
      lossBreakdown,
      materialType
    );

    // Generate recommendations
    const recommendations = generateYieldRecommendations(
      yieldAnalysis,
      lossBreakdown,
      inputs
    );

    return {
      yieldAnalysis,
      lossBreakdown,
      efficiencyMetrics,
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
    partArea: {
      min: 100,
      max: 1000000,
      message: 'Part area must be between 100mm² and 1,000,000mm²',
    },
  },

  examples: [
    {
      name: 'Steel Bracket Production',
      description: 'Yield analysis for steel bracket cutting',
      inputs: {
        sheetWidth: 1500,
        sheetLength: 3000,
        partArea: 50000,
        cuttingLength: 2000,
        kerfWidth: 0.1,
        edgeDistance: 5,
        numberOfParts: 10,
        materialType: 'carbon_steel',
        cuttingComplexity: 'medium',
      },
    },
    {
      name: 'Complex Aluminum Parts',
      description: 'Yield analysis for complex aluminum components',
      inputs: {
        sheetWidth: 2000,
        sheetLength: 4000,
        partArea: 120000,
        cuttingLength: 5000,
        kerfWidth: 0.08,
        edgeDistance: 8,
        numberOfParts: 15,
        materialType: 'aluminum',
        cuttingComplexity: 'complex',
      },
    },
  ],

  tags: ['yield', 'efficiency', 'waste', 'loss', 'optimization'],
  
  relatedCalculators: [
    'material-nesting',
    'kerf-compensation',
    'sheet-optimization',
    'scrap-utilization',
  ],

  learningResources: [
    {
      title: 'Material Yield Optimization',
      type: 'article',
      url: '/learn/yield-optimization',
    },
    {
      title: 'Understanding Material Losses',
      type: 'video',
      url: '/learn/material-losses',
    },
  ],
};

// Helper functions
function calculateMaterialLosses(
  sheetWidth: number,
  sheetLength: number,
  partArea: number,
  cuttingLength: number,
  kerfWidth: number,
  edgeDistance: number,
  numberOfParts: number,
  materialType: string,
  cuttingComplexity: string
) {
  const sheetArea = sheetWidth * sheetLength;
  
  // 1. Edge waste (unusable area near edges)
  const edgeWasteArea = calculateEdgeWaste(sheetWidth, sheetLength, edgeDistance);
  
  // 2. Kerf loss (material removed by cutting)
  const kerfLossArea = cuttingLength * kerfWidth;
  
  // 3. Nesting inefficiency (gaps between parts)
  const nestingInefficiency = calculateNestingInefficiency(
    sheetArea - edgeWasteArea,
    partArea,
    numberOfParts,
    cuttingComplexity
  );
  
  // 4. Material-specific losses
  const materialSpecificLoss = calculateMaterialSpecificLoss(
    sheetArea,
    materialType,
    cuttingComplexity
  );
  
  // 5. Setup and handling waste
  const setupWaste = calculateSetupWaste(sheetArea, numberOfParts);
  
  const totalLoss = edgeWasteArea + kerfLossArea + nestingInefficiency + 
                   materialSpecificLoss + setupWaste;
  
  return {
    edgeWaste: {
      area: Math.round(edgeWasteArea),
      percentage: Math.round((edgeWasteArea / sheetArea) * 100 * 10) / 10,
    },
    kerfLoss: {
      area: Math.round(kerfLossArea),
      percentage: Math.round((kerfLossArea / sheetArea) * 100 * 10) / 10,
    },
    nestingInefficiency: {
      area: Math.round(nestingInefficiency),
      percentage: Math.round((nestingInefficiency / sheetArea) * 100 * 10) / 10,
    },
    materialSpecificLoss: {
      area: Math.round(materialSpecificLoss),
      percentage: Math.round((materialSpecificLoss / sheetArea) * 100 * 10) / 10,
    },
    setupWaste: {
      area: Math.round(setupWaste),
      percentage: Math.round((setupWaste / sheetArea) * 100 * 10) / 10,
    },
    totalLoss: {
      area: Math.round(totalLoss),
      percentage: Math.round((totalLoss / sheetArea) * 100 * 10) / 10,
    },
  };
}

function calculateEdgeWaste(sheetWidth: number, sheetLength: number, edgeDistance: number) {
  const totalArea = sheetWidth * sheetLength;
  const usableArea = (sheetWidth - 2 * edgeDistance) * (sheetLength - 2 * edgeDistance);
  return totalArea - usableArea;
}

function calculateNestingInefficiency(
  usableArea: number,
  partArea: number,
  numberOfParts: number,
  complexity: string
) {
  // Base inefficiency factors by complexity
  const inefficiencyFactors = {
    simple: 0.05,    // 5% inefficiency
    medium: 0.12,    // 12% inefficiency
    complex: 0.20,   // 20% inefficiency
  };
  
  const factor = inefficiencyFactors[complexity] || 0.12;
  const theoreticalPartArea = partArea;
  const actualUsedArea = theoreticalPartArea * (1 + factor);
  
  return Math.min(actualUsedArea - theoreticalPartArea, usableArea * 0.3); // Cap at 30%
}

function calculateMaterialSpecificLoss(
  sheetArea: number,
  materialType: string,
  complexity: string
) {
  // Material-specific loss factors
  const materialLossFactors = {
    carbon_steel: 0.02,
    stainless_steel: 0.025,
    aluminum: 0.015,
    copper: 0.03,
    acrylic: 0.01,
    wood: 0.05,
  };
  
  const complexityMultipliers = {
    simple: 1.0,
    medium: 1.2,
    complex: 1.5,
  };
  
  const baseFactor = materialLossFactors[materialType] || 0.02;
  const complexityMultiplier = complexityMultipliers[complexity] || 1.2;
  
  return sheetArea * baseFactor * complexityMultiplier;
}

function calculateSetupWaste(sheetArea: number, numberOfParts: number) {
  // Setup waste decreases with more parts (economies of scale)
  const baseSetupWaste = 0.01; // 1% base
  const scaleFactor = Math.max(0.3, 1 - (numberOfParts - 1) * 0.05); // Decreases with more parts
  
  return sheetArea * baseSetupWaste * scaleFactor;
}

function calculateYieldAnalysis(
  sheetWidth: number,
  sheetLength: number,
  partArea: number,
  lossBreakdown: any
) {
  const sheetArea = sheetWidth * sheetLength;
  const totalLossArea = lossBreakdown.totalLoss.area;
  const usableArea = sheetArea - totalLossArea;
  const materialYield = (usableArea / sheetArea) * 100;
  const partYield = (partArea / sheetArea) * 100;
  const wasteArea = sheetArea - partArea;
  
  return {
    sheetArea: Math.round(sheetArea),
    partArea: Math.round(partArea),
    usableArea: Math.round(usableArea),
    wasteArea: Math.round(wasteArea),
    materialYield: Math.round(materialYield * 10) / 10,
    partYield: Math.round(partYield * 10) / 10,
    wastePercentage: Math.round(((wasteArea / sheetArea) * 100) * 10) / 10,
    yieldEfficiency: calculateYieldEfficiency(materialYield),
  };
}

function calculateYieldEfficiency(materialYield: number) {
  if (materialYield >= 85) return 'Excellent';
  if (materialYield >= 75) return 'Good';
  if (materialYield >= 65) return 'Fair';
  return 'Poor';
}

function calculateEfficiencyMetrics(
  yieldAnalysis: any,
  lossBreakdown: any,
  materialType: string
) {
  // Industry benchmarks by material type
  const industryBenchmarks = {
    carbon_steel: 78,
    stainless_steel: 75,
    aluminum: 80,
    copper: 72,
    acrylic: 85,
    wood: 70,
  };
  
  const benchmark = industryBenchmarks[materialType] || 75;
  const performanceVsBenchmark = yieldAnalysis.materialYield - benchmark;
  
  // Calculate improvement potential
  const maxTheoreticalYield = 95; // Theoretical maximum
  const improvementPotential = maxTheoreticalYield - yieldAnalysis.materialYield;
  
  return {
    industryBenchmark: benchmark,
    performanceVsBenchmark: Math.round(performanceVsBenchmark * 10) / 10,
    improvementPotential: Math.round(improvementPotential * 10) / 10,
    primaryLossSource: findPrimaryLossSource(lossBreakdown),
    yieldGrade: calculateYieldGrade(yieldAnalysis.materialYield, benchmark),
  };
}

function findPrimaryLossSource(lossBreakdown: any) {
  const losses = [
    { name: 'Edge Waste', percentage: lossBreakdown.edgeWaste.percentage },
    { name: 'Kerf Loss', percentage: lossBreakdown.kerfLoss.percentage },
    { name: 'Nesting Inefficiency', percentage: lossBreakdown.nestingInefficiency.percentage },
    { name: 'Material-Specific Loss', percentage: lossBreakdown.materialSpecificLoss.percentage },
    { name: 'Setup Waste', percentage: lossBreakdown.setupWaste.percentage },
  ];
  
  return losses.reduce((max, current) => 
    current.percentage > max.percentage ? current : max
  );
}

function calculateYieldGrade(actualYield: number, benchmark: number) {
  const ratio = actualYield / benchmark;
  
  if (ratio >= 1.1) return 'A+';
  if (ratio >= 1.05) return 'A';
  if (ratio >= 1.0) return 'B+';
  if (ratio >= 0.95) return 'B';
  if (ratio >= 0.9) return 'C+';
  if (ratio >= 0.85) return 'C';
  return 'D';
}

function generateYieldRecommendations(
  yieldAnalysis: any,
  lossBreakdown: any,
  inputs: any
) {
  const recommendations = [];
  
  // Primary loss source recommendations
  const primaryLoss = findPrimaryLossSource(lossBreakdown);
  
  if (primaryLoss.name === 'Edge Waste' && primaryLoss.percentage > 8) {
    recommendations.push({
      type: 'Edge Optimization',
      suggestion: 'Reduce edge distances if quality allows, or use larger sheets.',
      impact: 'High',
      potentialSaving: `${Math.round(primaryLoss.percentage * 0.5 * 10) / 10}%`,
    });
  }
  
  if (primaryLoss.name === 'Nesting Inefficiency' && primaryLoss.percentage > 15) {
    recommendations.push({
      type: 'Nesting Optimization',
      suggestion: 'Use professional nesting software or optimize part layout.',
      impact: 'High',
      potentialSaving: `${Math.round(primaryLoss.percentage * 0.3 * 10) / 10}%`,
    });
  }
  
  if (primaryLoss.name === 'Kerf Loss' && primaryLoss.percentage > 5) {
    recommendations.push({
      type: 'Cutting Optimization',
      suggestion: 'Optimize cutting paths and consider common cutting for adjacent parts.',
      impact: 'Medium',
      potentialSaving: `${Math.round(primaryLoss.percentage * 0.4 * 10) / 10}%`,
    });
  }
  
  // Overall yield recommendations
  if (yieldAnalysis.materialYield < 70) {
    recommendations.push({
      type: 'Overall Strategy',
      suggestion: 'Consider redesigning parts or changing production approach.',
      impact: 'High',
      potentialSaving: 'Up to 15%',
    });
  }
  
  // Complexity-based recommendations
  if (inputs.cuttingComplexity === 'complex') {
    recommendations.push({
      type: 'Design Simplification',
      suggestion: 'Simplify part designs where possible to reduce nesting inefficiency.',
      impact: 'Medium',
      potentialSaving: '5-10%',
    });
  }
  
  // Material-specific recommendations
  if (inputs.materialType === 'wood' && yieldAnalysis.materialYield < 75) {
    recommendations.push({
      type: 'Material Handling',
      suggestion: 'Improve material handling to reduce wood-specific waste.',
      impact: 'Medium',
      potentialSaving: '3-7%',
    });
  }
  
  return recommendations;
}

export default materialYieldConfig;
