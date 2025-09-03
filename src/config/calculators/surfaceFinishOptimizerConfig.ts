import { CalculatorConfig } from '../../types/calculator';

export const surfaceFinishOptimizerConfig: CalculatorConfig = {
  id: 'surface-finish-optimizer',
  name: 'Surface Finish Optimizer',
  description: 'Optimize laser cutting parameters to achieve desired surface finish and roughness specifications.',
  category: 'quality-control',
  difficulty: 'advanced',
  estimatedTime: '4-5 minutes',
  
  inputs: [
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
        { value: 'brass', label: 'Brass' },
        { value: 'titanium', label: 'Titanium' },
        { value: 'acrylic', label: 'Acrylic' },
      ],
      required: true,
      description: 'Select the material type',
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
      id: 'targetRoughness',
      label: 'Target Surface Roughness',
      type: 'select',
      value: 'Ra_3_2',
      options: [
        { value: 'Ra_0_8', label: 'Ra 0.8 μm (Mirror finish)' },
        { value: 'Ra_1_6', label: 'Ra 1.6 μm (Very fine)' },
        { value: 'Ra_3_2', label: 'Ra 3.2 μm (Fine)' },
        { value: 'Ra_6_3', label: 'Ra 6.3 μm (Medium)' },
        { value: 'Ra_12_5', label: 'Ra 12.5 μm (Rough)' },
      ],
      required: true,
      description: 'Desired surface roughness specification',
    },
    {
      id: 'currentPower',
      label: 'Current Laser Power',
      type: 'number',
      value: 1500,
      unit: 'W',
      min: 100,
      max: 15000,
      step: 50,
      required: true,
      description: 'Current laser power setting',
    },
    {
      id: 'currentSpeed',
      label: 'Current Cutting Speed',
      type: 'number',
      value: 2500,
      unit: 'mm/min',
      min: 100,
      max: 15000,
      step: 100,
      required: true,
      description: 'Current cutting speed',
    },
    {
      id: 'assistGas',
      label: 'Assist Gas',
      type: 'select',
      value: 'nitrogen',
      options: [
        { value: 'oxygen', label: 'Oxygen (O₂)' },
        { value: 'nitrogen', label: 'Nitrogen (N₂)' },
        { value: 'air', label: 'Compressed Air' },
        { value: 'argon', label: 'Argon (Ar)' },
      ],
      required: true,
      description: 'Type of assist gas',
    },
    {
      id: 'applicationRequirement',
      label: 'Application Requirement',
      type: 'select',
      value: 'general',
      options: [
        { value: 'cosmetic', label: 'Cosmetic/Visible surfaces' },
        { value: 'functional', label: 'Functional surfaces' },
        { value: 'general', label: 'General manufacturing' },
        { value: 'precision', label: 'Precision applications' },
      ],
      required: true,
      description: 'Application requirements for surface finish',
    },
    {
      id: 'currentFinishQuality',
      label: 'Current Finish Quality',
      type: 'select',
      value: 'fair',
      options: [
        { value: 'excellent', label: 'Excellent' },
        { value: 'good', label: 'Good' },
        { value: 'fair', label: 'Fair' },
        { value: 'poor', label: 'Poor' },
        { value: 'unacceptable', label: 'Unacceptable' },
      ],
      required: true,
      description: 'Current surface finish quality',
    },
  ],

  outputs: [
    {
      id: 'finishAnalysis',
      label: 'Surface Finish Analysis',
      type: 'object',
      format: 'finish-analysis',
      description: 'Analysis of current and target surface finish',
    },
    {
      id: 'optimizedParameters',
      label: 'Optimized Parameters',
      type: 'object',
      format: 'optimized-parameters',
      description: 'Parameters optimized for target surface finish',
    },
    {
      id: 'improvementStrategy',
      label: 'Improvement Strategy',
      type: 'object',
      format: 'improvement-plan',
      description: 'Strategy to achieve target surface finish',
    },
    {
      id: 'recommendations',
      label: 'Surface Finish Recommendations',
      type: 'array',
      format: 'finish-recommendations',
      description: 'Specific recommendations for surface finish optimization',
    },
  ],

  calculate: (inputs: Record<string, any>) => {
    const {
      materialType,
      thickness,
      targetRoughness,
      currentPower,
      currentSpeed,
      assistGas,
      applicationRequirement,
      currentFinishQuality,
    } = inputs;

    // Analyze current and target finish
    const finishAnalysis = analyzeFinishRequirements(
      targetRoughness,
      currentFinishQuality,
      materialType,
      applicationRequirement
    );

    // Calculate optimized parameters
    const optimizedParameters = optimizeForSurfaceFinish(
      finishAnalysis,
      materialType,
      thickness,
      currentPower,
      currentSpeed,
      assistGas
    );

    // Generate improvement strategy
    const improvementStrategy = generateImprovementStrategy(
      finishAnalysis,
      optimizedParameters,
      materialType,
      assistGas
    );

    // Generate recommendations
    const recommendations = generateFinishRecommendations(
      finishAnalysis,
      optimizedParameters,
      inputs
    );

    return {
      finishAnalysis,
      optimizedParameters,
      improvementStrategy,
      recommendations,
    };
  },

  validation: {
    thickness: {
      min: 0.5,
      max: 50,
      message: 'Thickness must be between 0.5mm and 50mm',
    },
    currentPower: {
      min: 100,
      max: 15000,
      message: 'Laser power must be between 100W and 15000W',
    },
    currentSpeed: {
      min: 100,
      max: 15000,
      message: 'Cutting speed must be between 100 and 15000 mm/min',
    },
  },

  examples: [
    {
      name: 'Precision Stainless Steel',
      description: 'Optimizing for mirror finish on stainless steel',
      inputs: {
        materialType: 'stainless_steel',
        thickness: 3,
        targetRoughness: 'Ra_0_8',
        currentPower: 1000,
        currentSpeed: 1500,
        assistGas: 'nitrogen',
        applicationRequirement: 'cosmetic',
        currentFinishQuality: 'fair',
      },
    },
    {
      name: 'Aluminum Functional Parts',
      description: 'Functional surface finish for aluminum components',
      inputs: {
        materialType: 'aluminum',
        thickness: 6,
        targetRoughness: 'Ra_3_2',
        currentPower: 1200,
        currentSpeed: 3000,
        assistGas: 'nitrogen',
        applicationRequirement: 'functional',
        currentFinishQuality: 'good',
      },
    },
  ],

  tags: ['surface', 'finish', 'roughness', 'quality', 'optimization'],
  
  relatedCalculators: [
    'edge-quality-predictor',
    'dross-prevention',
    'power-speed-matching',
    'gas-pressure-setting',
  ],

  learningResources: [
    {
      title: 'Surface Finish in Laser Cutting',
      type: 'article',
      url: '/learn/surface-finish-basics',
    },
    {
      title: 'Achieving Mirror Finish',
      type: 'video',
      url: '/learn/mirror-finish-techniques',
    },
  ],
};

// Helper functions
function analyzeFinishRequirements(
  targetRoughness: string,
  currentFinishQuality: string,
  materialType: string,
  applicationRequirement: string
) {
  // Convert target roughness to numeric value
  const targetRa = parseRoughnessValue(targetRoughness);
  const currentRa = estimateCurrentRoughness(currentFinishQuality, materialType);
  
  // Assess improvement needed
  const improvementNeeded = currentRa / targetRa;
  const difficultyLevel = assessOptimizationDifficulty(targetRa, materialType, applicationRequirement);
  
  return {
    targetRoughness: targetRa,
    currentRoughness: currentRa,
    improvementFactor: Math.round(improvementNeeded * 10) / 10,
    improvementNeeded: improvementNeeded > 1.2,
    difficultyLevel,
    achievability: assessAchievability(targetRa, materialType),
    applicationSuitability: assessApplicationSuitability(targetRa, applicationRequirement),
  };
}

function parseRoughnessValue(roughnessCode: string) {
  const values = {
    Ra_0_8: 0.8,
    Ra_1_6: 1.6,
    Ra_3_2: 3.2,
    Ra_6_3: 6.3,
    Ra_12_5: 12.5,
  };
  return values[roughnessCode] || 3.2;
}

function estimateCurrentRoughness(quality: string, materialType: string) {
  const baseRoughness = {
    excellent: 1.6,
    good: 3.2,
    fair: 6.3,
    poor: 12.5,
    unacceptable: 25,
  };
  
  const materialFactors = {
    carbon_steel: 1.0,
    stainless_steel: 0.9,
    aluminum: 0.8,
    copper: 1.2,
    brass: 1.1,
    titanium: 1.3,
    acrylic: 0.6,
  };
  
  return (baseRoughness[quality] || 6.3) * (materialFactors[materialType] || 1.0);
}

function assessOptimizationDifficulty(targetRa: number, materialType: string, applicationRequirement: string) {
  let difficulty = 'Medium';
  
  if (targetRa <= 1.6) {
    difficulty = 'High';
  } else if (targetRa >= 6.3) {
    difficulty = 'Low';
  }
  
  // Material-specific adjustments
  if (materialType === 'copper' || materialType === 'titanium') {
    difficulty = difficulty === 'Low' ? 'Medium' : 'High';
  }
  
  // Application adjustments
  if (applicationRequirement === 'cosmetic' && targetRa <= 3.2) {
    difficulty = 'High';
  }
  
  return difficulty;
}

function assessAchievability(targetRa: number, materialType: string) {
  const materialLimits = {
    carbon_steel: 1.6,
    stainless_steel: 0.8,
    aluminum: 1.6,
    copper: 3.2,
    brass: 1.6,
    titanium: 3.2,
    acrylic: 0.8,
  };
  
  const achievableLimit = materialLimits[materialType] || 1.6;
  
  if (targetRa <= achievableLimit) {
    return 'Achievable with optimization';
  } else if (targetRa <= achievableLimit * 2) {
    return 'Challenging but possible';
  } else {
    return 'May require post-processing';
  }
}

function assessApplicationSuitability(targetRa: number, applicationRequirement: string) {
  const requirements = {
    cosmetic: { min: 0.8, max: 3.2 },
    functional: { min: 1.6, max: 6.3 },
    general: { min: 3.2, max: 12.5 },
    precision: { min: 0.8, max: 1.6 },
  };
  
  const req = requirements[applicationRequirement] || requirements.general;
  
  if (targetRa >= req.min && targetRa <= req.max) {
    return 'Well suited for application';
  } else if (targetRa < req.min) {
    return 'Higher quality than needed';
  } else {
    return 'May not meet application requirements';
  }
}

function optimizeForSurfaceFinish(
  finishAnalysis: any,
  materialType: string,
  thickness: number,
  currentPower: number,
  currentSpeed: number,
  assistGas: string
) {
  if (!finishAnalysis.improvementNeeded) {
    return {
      status: 'Current parameters acceptable',
      power: currentPower,
      speed: currentSpeed,
      improvements: ['Current finish meets requirements'],
    };
  }
  
  // Calculate optimization factors
  const targetRa = finishAnalysis.targetRoughness;
  const optimizationFactor = Math.min(finishAnalysis.improvementFactor, 3);
  
  // Power optimization (generally reduce for better finish)
  let optimizedPower = currentPower;
  if (targetRa <= 3.2) {
    optimizedPower = currentPower * (1 - (optimizationFactor - 1) * 0.15);
  }
  
  // Speed optimization (generally reduce for better finish)
  let optimizedSpeed = currentSpeed;
  if (targetRa <= 3.2) {
    optimizedSpeed = currentSpeed * (1 - (optimizationFactor - 1) * 0.1);
  }
  
  // Gas-specific optimizations
  const gasOptimizations = optimizeForGas(assistGas, materialType, targetRa);
  
  // Frequency recommendations
  const frequencyRecommendation = recommendFrequency(materialType, thickness, targetRa);
  
  return {
    status: 'Optimization recommended',
    power: Math.round(optimizedPower),
    speed: Math.round(optimizedSpeed),
    powerReduction: Math.round(((currentPower - optimizedPower) / currentPower) * 100),
    speedReduction: Math.round(((currentSpeed - optimizedSpeed) / currentSpeed) * 100),
    gasOptimizations,
    frequencyRecommendation,
    expectedImprovement: calculateExpectedImprovement(finishAnalysis, optimizationFactor),
  };
}

function optimizeForGas(assistGas: string, materialType: string, targetRa: number) {
  const optimizations = [];
  
  if (targetRa <= 1.6 && assistGas !== 'nitrogen') {
    optimizations.push({
      parameter: 'Gas Type',
      recommendation: 'Switch to nitrogen for best surface finish',
      impact: 'Major improvement',
    });
  }
  
  if (assistGas === 'oxygen' && materialType === 'stainless_steel') {
    optimizations.push({
      parameter: 'Gas Type',
      recommendation: 'Use nitrogen to prevent oxidation',
      impact: 'Prevents surface contamination',
    });
  }
  
  if (targetRa <= 3.2) {
    optimizations.push({
      parameter: 'Gas Pressure',
      recommendation: 'Optimize pressure for smooth melt ejection',
      impact: 'Reduces surface striations',
    });
  }
  
  return optimizations;
}

function recommendFrequency(materialType: string, thickness: number, targetRa: number) {
  if (targetRa > 6.3) {
    return {
      mode: 'Continuous Wave',
      frequency: 0,
      reason: 'CW mode sufficient for rough finish requirements',
    };
  }
  
  if (materialType === 'acrylic' || materialType === 'aluminum') {
    const frequency = Math.min(20000, 5000 * thickness);
    return {
      mode: 'Pulsed',
      frequency: Math.round(frequency),
      reason: 'Pulsed mode improves surface quality for this material',
    };
  }
  
  if (targetRa <= 1.6) {
    return {
      mode: 'High Frequency Pulsed',
      frequency: 20000,
      reason: 'High frequency pulsing for mirror finish',
    };
  }
  
  return {
    mode: 'Continuous Wave',
    frequency: 0,
    reason: 'CW mode with optimized parameters',
  };
}

function calculateExpectedImprovement(finishAnalysis: any, optimizationFactor: number) {
  const currentRa = finishAnalysis.currentRoughness;
  const targetRa = finishAnalysis.targetRoughness;
  
  // Estimate achievable improvement (typically 60-80% of theoretical)
  const theoreticalImprovement = currentRa - targetRa;
  const practicalImprovement = theoreticalImprovement * 0.7;
  const expectedRa = currentRa - practicalImprovement;
  
  return {
    expectedRoughness: Math.round(expectedRa * 10) / 10,
    improvementPercentage: Math.round((practicalImprovement / currentRa) * 100),
    confidenceLevel: optimizationFactor < 2 ? 'High' : optimizationFactor < 3 ? 'Medium' : 'Low',
  };
}

function generateImprovementStrategy(finishAnalysis: any, optimizedParameters: any, materialType: string, assistGas: string) {
  const strategies = [];
  
  // Parameter optimization strategy
  if (optimizedParameters.status === 'Optimization recommended') {
    strategies.push({
      phase: 'Parameter Optimization',
      actions: [
        `Reduce power to ${optimizedParameters.power}W`,
        `Reduce speed to ${optimizedParameters.speed}mm/min`,
      ],
      expectedImpact: 'Primary surface finish improvement',
    });
  }
  
  // Gas optimization strategy
  if (optimizedParameters.gasOptimizations.length > 0) {
    strategies.push({
      phase: 'Gas Optimization',
      actions: optimizedParameters.gasOptimizations.map(opt => opt.recommendation),
      expectedImpact: 'Surface quality and consistency improvement',
    });
  }
  
  // Advanced techniques
  if (finishAnalysis.targetRoughness <= 1.6) {
    strategies.push({
      phase: 'Advanced Techniques',
      actions: [
        'Implement precise focus control',
        'Use high-quality assist gas',
        'Optimize beam quality',
      ],
      expectedImpact: 'Achieve mirror finish quality',
    });
  }
  
  return {
    strategies,
    implementationOrder: strategies.map((s, i) => ({ ...s, priority: i + 1 })),
    timeToResults: estimateTimeToResults(finishAnalysis.difficultyLevel),
  };
}

function estimateTimeToResults(difficultyLevel: string) {
  const timeEstimates = {
    Low: '1-2 test cuts',
    Medium: '3-5 test cuts',
    High: '5-10 test cuts with iterative optimization',
  };
  
  return timeEstimates[difficultyLevel] || '3-5 test cuts';
}

function generateFinishRecommendations(finishAnalysis: any, optimizedParameters: any, inputs: any) {
  const recommendations = [];
  
  // Critical recommendations
  if (finishAnalysis.achievability.includes('post-processing')) {
    recommendations.push({
      priority: 'Critical',
      category: 'Process Limitation',
      suggestion: 'Target roughness may require post-processing (polishing/grinding)',
      impact: 'Achieve target specification',
    });
  }
  
  // High priority recommendations
  if (optimizedParameters.powerReduction > 20) {
    recommendations.push({
      priority: 'High',
      category: 'Power Optimization',
      suggestion: `Reduce laser power by ${optimizedParameters.powerReduction}%`,
      impact: 'Significant surface finish improvement',
    });
  }
  
  if (inputs.assistGas === 'oxygen' && finishAnalysis.targetRoughness <= 3.2) {
    recommendations.push({
      priority: 'High',
      category: 'Gas Selection',
      suggestion: 'Switch to nitrogen assist gas for better surface finish',
      impact: 'Cleaner, smoother surface',
    });
  }
  
  // Medium priority recommendations
  if (finishAnalysis.difficultyLevel === 'High') {
    recommendations.push({
      priority: 'Medium',
      category: 'Process Control',
      suggestion: 'Implement strict parameter control and monitoring',
      impact: 'Consistent surface finish quality',
    });
  }
  
  // Material-specific recommendations
  if (inputs.materialType === 'stainless_steel' && finishAnalysis.targetRoughness <= 1.6) {
    recommendations.push({
      priority: 'Medium',
      category: 'Material-Specific',
      suggestion: 'Use high-purity nitrogen and optimize focus position',
      impact: 'Achieve mirror finish on stainless steel',
    });
  }
  
  // Quality control recommendations
  recommendations.push({
    priority: 'Low',
    category: 'Quality Control',
    suggestion: 'Implement surface roughness measurement and documentation',
    impact: 'Process validation and improvement',
  });
  
  return recommendations;
}

export default surfaceFinishOptimizerConfig;
