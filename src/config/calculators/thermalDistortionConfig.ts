import { CalculatorConfig } from '../../types/calculator';

export const thermalDistortionConfig: CalculatorConfig = {
  id: 'thermal-distortion',
  name: 'Thermal Distortion Predictor',
  description: 'Predict and minimize thermal distortion in laser cut parts to maintain dimensional accuracy and prevent warping.',
  category: 'quality-control',
  difficulty: 'advanced',
  estimatedTime: '4-5 minutes',
  
  inputs: [
    {
      id: 'partLength',
      label: 'Part Length',
      type: 'number',
      value: 200,
      unit: 'mm',
      min: 10,
      max: 2000,
      step: 1,
      required: true,
      description: 'Length of the part being cut',
    },
    {
      id: 'partWidth',
      label: 'Part Width',
      type: 'number',
      value: 100,
      unit: 'mm',
      min: 10,
      max: 1000,
      step: 1,
      required: true,
      description: 'Width of the part being cut',
    },
    {
      id: 'thickness',
      label: 'Material Thickness',
      type: 'number',
      value: 5,
      unit: 'mm',
      min: 0.5,
      max: 50,
      step: 0.1,
      required: true,
      description: 'Thickness of the material',
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
        { value: 'titanium', label: 'Titanium' },
      ],
      required: true,
      description: 'Material type',
    },
    {
      id: 'laserPower',
      label: 'Laser Power',
      type: 'number',
      value: 1500,
      unit: 'W',
      min: 100,
      max: 15000,
      step: 50,
      required: true,
      description: 'Laser power setting',
    },
    {
      id: 'cuttingSpeed',
      label: 'Cutting Speed',
      type: 'number',
      value: 2500,
      unit: 'mm/min',
      min: 100,
      max: 15000,
      step: 100,
      required: true,
      description: 'Cutting speed',
    },
    {
      id: 'cuttingSequence',
      label: 'Cutting Sequence',
      type: 'select',
      value: 'outside_first',
      options: [
        { value: 'outside_first', label: 'Outside Contour First' },
        { value: 'inside_first', label: 'Inside Features First' },
        { value: 'balanced', label: 'Balanced Sequence' },
      ],
      required: true,
      description: 'Order of cutting operations',
    },
    {
      id: 'partComplexity',
      label: 'Part Complexity',
      type: 'select',
      value: 'medium',
      options: [
        { value: 'simple', label: 'Simple (Rectangle, basic shapes)' },
        { value: 'medium', label: 'Medium (Some features, holes)' },
        { value: 'complex', label: 'Complex (Many features, intricate)' },
      ],
      required: true,
      description: 'Complexity of the part geometry',
    },
  ],

  outputs: [
    {
      id: 'distortionPrediction',
      label: 'Distortion Prediction',
      type: 'object',
      format: 'distortion-analysis',
      description: 'Predicted thermal distortion characteristics',
    },
    {
      id: 'preventionStrategy',
      label: 'Distortion Prevention Strategy',
      type: 'object',
      format: 'prevention-plan',
      description: 'Strategies to minimize thermal distortion',
    },
    {
      id: 'optimizedParameters',
      label: 'Optimized Parameters',
      type: 'object',
      format: 'optimized-settings',
      description: 'Parameters optimized for minimal distortion',
    },
    {
      id: 'recommendations',
      label: 'Distortion Control Recommendations',
      type: 'array',
      format: 'distortion-recommendations',
      description: 'Specific recommendations for distortion control',
    },
  ],

  calculate: (inputs: Record<string, any>) => {
    const {
      partLength,
      partWidth,
      thickness,
      materialType,
      laserPower,
      cuttingSpeed,
      cuttingSequence,
      partComplexity,
    } = inputs;

    // Predict thermal distortion
    const distortionPrediction = predictThermalDistortion(
      partLength,
      partWidth,
      thickness,
      materialType,
      laserPower,
      cuttingSpeed,
      partComplexity
    );

    // Generate prevention strategy
    const preventionStrategy = generatePreventionStrategy(
      distortionPrediction,
      cuttingSequence,
      partComplexity,
      materialType
    );

    // Calculate optimized parameters
    const optimizedParameters = optimizeForDistortion(
      distortionPrediction,
      inputs
    );

    // Generate recommendations
    const recommendations = generateDistortionRecommendations(
      distortionPrediction,
      preventionStrategy,
      inputs
    );

    return {
      distortionPrediction,
      preventionStrategy,
      optimizedParameters,
      recommendations,
    };
  },

  validation: {
    partLength: {
      min: 10,
      max: 2000,
      message: 'Part length must be between 10mm and 2000mm',
    },
    partWidth: {
      min: 10,
      max: 1000,
      message: 'Part width must be between 10mm and 1000mm',
    },
    thickness: {
      min: 0.5,
      max: 50,
      message: 'Thickness must be between 0.5mm and 50mm',
    },
  },

  examples: [
    {
      name: 'Large Steel Plate',
      description: 'Distortion prediction for large steel plate cutting',
      inputs: {
        partLength: 500,
        partWidth: 300,
        thickness: 8,
        materialType: 'carbon_steel',
        laserPower: 2000,
        cuttingSpeed: 2000,
        cuttingSequence: 'outside_first',
        partComplexity: 'medium',
      },
    },
    {
      name: 'Thin Aluminum Sheet',
      description: 'Distortion control for thin aluminum cutting',
      inputs: {
        partLength: 200,
        partWidth: 150,
        thickness: 2,
        materialType: 'aluminum',
        laserPower: 800,
        cuttingSpeed: 4000,
        cuttingSequence: 'balanced',
        partComplexity: 'complex',
      },
    },
  ],

  tags: ['distortion', 'thermal', 'warping', 'accuracy', 'prevention'],
  
  relatedCalculators: [
    'heat-affected-zone',
    'cutting-sequence-optimizer',
    'thermal-stress-calculator',
    'dimensional-accuracy',
  ],

  learningResources: [
    {
      title: 'Thermal Distortion in Laser Cutting',
      type: 'article',
      url: '/learn/thermal-distortion',
    },
    {
      title: 'Distortion Prevention Techniques',
      type: 'video',
      url: '/learn/distortion-prevention',
    },
  ],
};

// Helper functions
function predictThermalDistortion(
  partLength: number,
  partWidth: number,
  thickness: number,
  materialType: string,
  laserPower: number,
  cuttingSpeed: number,
  partComplexity: string
) {
  // Get material properties
  const materialProps = getMaterialProperties(materialType);
  
  // Calculate heat input
  const heatInput = (laserPower * 60) / cuttingSpeed; // J/mm
  
  // Calculate aspect ratio effects
  const aspectRatio = Math.max(partLength, partWidth) / Math.min(partLength, partWidth);
  const slendernessRatio = Math.max(partLength, partWidth) / thickness;
  
  // Base distortion calculation
  let distortionMagnitude = calculateBaseDistortion(
    heatInput,
    slendernessRatio,
    materialProps,
    thickness
  );
  
  // Complexity factor
  const complexityFactors = {
    simple: 1.0,
    medium: 1.3,
    complex: 1.6,
  };
  distortionMagnitude *= complexityFactors[partComplexity] || 1.3;
  
  // Aspect ratio effects
  if (aspectRatio > 3) {
    distortionMagnitude *= (1 + (aspectRatio - 3) * 0.1);
  }
  
  return {
    magnitude: Math.round(distortionMagnitude * 1000) / 1000, // mm
    type: classifyDistortionType(aspectRatio, slendernessRatio),
    riskLevel: assessDistortionRisk(distortionMagnitude, thickness),
    primaryDirection: aspectRatio > 2 ? 'Longitudinal' : 'Uniform',
    thermalStress: calculateThermalStress(heatInput, materialProps),
    coolingPattern: analyzeCoolingPattern(partLength, partWidth, heatInput),
  };
}

function getMaterialProperties(materialType: string) {
  const properties = {
    carbon_steel: {
      thermalExpansion: 12e-6, // /°C
      elasticModulus: 200000, // MPa
      thermalConductivity: 50, // W/m·K
      yieldStrength: 250, // MPa
    },
    stainless_steel: {
      thermalExpansion: 17e-6,
      elasticModulus: 200000,
      thermalConductivity: 16,
      yieldStrength: 300,
    },
    aluminum: {
      thermalExpansion: 23e-6,
      elasticModulus: 70000,
      thermalConductivity: 237,
      yieldStrength: 100,
    },
    copper: {
      thermalExpansion: 17e-6,
      elasticModulus: 120000,
      thermalConductivity: 401,
      yieldStrength: 70,
    },
    titanium: {
      thermalExpansion: 8.6e-6,
      elasticModulus: 110000,
      thermalConductivity: 22,
      yieldStrength: 350,
    },
  };
  
  return properties[materialType] || properties.carbon_steel;
}

function calculateBaseDistortion(heatInput: number, slendernessRatio: number, materialProps: any, thickness: number) {
  // Simplified thermal distortion model
  const thermalStrain = materialProps.thermalExpansion * (heatInput / 100); // Simplified temperature rise
  const constraintFactor = Math.min(1.0, slendernessRatio / 50); // Higher slenderness = less constraint
  
  return thermalStrain * slendernessRatio * constraintFactor * 1000; // Convert to mm
}

function classifyDistortionType(aspectRatio: number, slendernessRatio: number) {
  if (slendernessRatio > 100) {
    return aspectRatio > 3 ? 'Longitudinal Bowing' : 'Plate Buckling';
  } else if (slendernessRatio > 50) {
    return 'Angular Distortion';
  } else {
    return 'Dimensional Change';
  }
}

function assessDistortionRisk(magnitude: number, thickness: number) {
  const relativeDistortion = magnitude / thickness;
  
  if (relativeDistortion < 0.001) return 'Low';
  if (relativeDistortion < 0.005) return 'Medium';
  if (relativeDistortion < 0.01) return 'High';
  return 'Critical';
}

function calculateThermalStress(heatInput: number, materialProps: any) {
  const temperatureRise = heatInput / 50; // Simplified
  const thermalStress = materialProps.thermalExpansion * temperatureRise * materialProps.elasticModulus;
  
  return {
    magnitude: Math.round(thermalStress),
    unit: 'MPa',
    yieldRatio: Math.round((thermalStress / materialProps.yieldStrength) * 100),
  };
}

function analyzeCoolingPattern(partLength: number, partWidth: number, heatInput: number) {
  const area = partLength * partWidth;
  const perimeter = 2 * (partLength + partWidth);
  const shapeCompactness = area / (perimeter * perimeter);
  
  return {
    uniformity: shapeCompactness > 0.08 ? 'Good' : 'Poor',
    coolingRate: heatInput / area > 0.1 ? 'Fast' : 'Moderate',
    gradientSeverity: shapeCompactness < 0.05 ? 'High' : 'Low',
  };
}

function generatePreventionStrategy(distortionPrediction: any, cuttingSequence: string, partComplexity: string, materialType: string) {
  const strategies = [];
  
  // Sequence optimization
  if (distortionPrediction.riskLevel === 'High' || distortionPrediction.riskLevel === 'Critical') {
    strategies.push({
      category: 'Cutting Sequence',
      strategy: 'Use balanced cutting sequence to distribute heat evenly',
      effectiveness: 'High',
    });
  }
  
  // Fixturing recommendations
  if (distortionPrediction.type.includes('Bowing') || distortionPrediction.type.includes('Buckling')) {
    strategies.push({
      category: 'Fixturing',
      strategy: 'Use distributed clamping or vacuum fixturing',
      effectiveness: 'High',
    });
  }
  
  // Thermal management
  if (distortionPrediction.thermalStress.yieldRatio > 50) {
    strategies.push({
      category: 'Thermal Management',
      strategy: 'Implement active cooling or reduce heat input',
      effectiveness: 'Medium',
    });
  }
  
  // Material-specific strategies
  if (materialType === 'aluminum' && distortionPrediction.riskLevel !== 'Low') {
    strategies.push({
      category: 'Material-Specific',
      strategy: 'Pre-stress relief or use thicker material',
      effectiveness: 'Medium',
    });
  }
  
  return {
    strategies,
    primaryApproach: determinePrimaryApproach(distortionPrediction),
    implementationOrder: rankStrategiesByEffectiveness(strategies),
  };
}

function determinePrimaryApproach(distortionPrediction: any) {
  if (distortionPrediction.riskLevel === 'Critical') {
    return 'Comprehensive approach with multiple strategies';
  } else if (distortionPrediction.riskLevel === 'High') {
    return 'Focus on cutting sequence and fixturing';
  } else if (distortionPrediction.riskLevel === 'Medium') {
    return 'Optimize cutting parameters and sequence';
  }
  return 'Monitor and document for quality control';
}

function rankStrategiesByEffectiveness(strategies: any[]) {
  return strategies
    .sort((a, b) => {
      const effectivenessOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
      return effectivenessOrder[b.effectiveness] - effectivenessOrder[a.effectiveness];
    })
    .map((s, index) => ({ ...s, priority: index + 1 }));
}

function optimizeForDistortion(distortionPrediction: any, inputs: any) {
  if (distortionPrediction.riskLevel === 'Low') {
    return {
      status: 'Current parameters acceptable',
      recommendations: ['Monitor distortion during cutting'],
    };
  }
  
  // Calculate optimized parameters
  const reductionFactor = distortionPrediction.riskLevel === 'Critical' ? 0.4 : 0.2;
  
  const optimizedPower = inputs.laserPower * (1 - reductionFactor);
  const optimizedSpeed = inputs.cuttingSpeed * (1 + reductionFactor * 0.5);
  
  return {
    status: 'Optimization recommended',
    originalPower: inputs.laserPower,
    optimizedPower: Math.round(optimizedPower),
    originalSpeed: inputs.cuttingSpeed,
    optimizedSpeed: Math.round(optimizedSpeed),
    expectedReduction: Math.round(reductionFactor * 100),
    additionalMeasures: generateAdditionalMeasures(distortionPrediction),
  };
}

function generateAdditionalMeasures(distortionPrediction: any) {
  const measures = [];
  
  if (distortionPrediction.type.includes('Buckling')) {
    measures.push('Use backup support or reduced sheet size');
  }
  
  if (distortionPrediction.coolingPattern.uniformity === 'Poor') {
    measures.push('Implement controlled cooling zones');
  }
  
  if (distortionPrediction.thermalStress.yieldRatio > 70) {
    measures.push('Consider stress relief heat treatment');
  }
  
  return measures;
}

function generateDistortionRecommendations(distortionPrediction: any, preventionStrategy: any, inputs: any) {
  const recommendations = [];
  
  // Critical recommendations
  if (distortionPrediction.riskLevel === 'Critical') {
    recommendations.push({
      priority: 'Critical',
      category: 'Process Change',
      suggestion: 'Consider alternative cutting method or part redesign',
      impact: 'Major distortion reduction',
    });
  }
  
  // High priority recommendations
  if (distortionPrediction.riskLevel === 'High') {
    recommendations.push({
      priority: 'High',
      category: 'Cutting Sequence',
      suggestion: 'Implement balanced cutting sequence',
      impact: '30-50% distortion reduction',
    });
  }
  
  // Fixturing recommendations
  if (distortionPrediction.type.includes('Bowing')) {
    recommendations.push({
      priority: 'High',
      category: 'Fixturing',
      suggestion: 'Use distributed clamping system',
      impact: 'Prevent bowing distortion',
    });
  }
  
  // Parameter optimization
  if (distortionPrediction.thermalStress.yieldRatio > 50) {
    recommendations.push({
      priority: 'Medium',
      category: 'Parameters',
      suggestion: 'Reduce heat input through power/speed optimization',
      impact: '20-30% stress reduction',
    });
  }
  
  // Monitoring recommendations
  recommendations.push({
    priority: 'Low',
    category: 'Quality Control',
    suggestion: 'Implement distortion measurement and documentation',
    impact: 'Process improvement data',
  });
  
  return recommendations;
}

export default thermalDistortionConfig;
