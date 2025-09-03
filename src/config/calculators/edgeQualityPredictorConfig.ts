import { CalculatorConfig } from '../../types/calculator';

export const edgeQualityPredictorConfig: CalculatorConfig = {
  id: 'edge-quality-predictor',
  name: 'Edge Quality Predictor',
  description: 'Predict cut edge quality and surface roughness based on laser cutting parameters before actual cutting.',
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
        { value: 'wood', label: 'Wood' },
      ],
      required: true,
      description: 'Select the material to be cut',
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
      description: 'Cutting speed setting',
    },
    {
      id: 'assistGas',
      label: 'Assist Gas',
      type: 'select',
      value: 'oxygen',
      options: [
        { value: 'oxygen', label: 'Oxygen (O₂)' },
        { value: 'nitrogen', label: 'Nitrogen (N₂)' },
        { value: 'air', label: 'Compressed Air' },
      ],
      required: true,
      description: 'Type of assist gas',
    },
    {
      id: 'gasPressure',
      label: 'Gas Pressure',
      type: 'number',
      value: 1.0,
      unit: 'bar',
      min: 0.1,
      max: 20,
      step: 0.1,
      required: true,
      description: 'Gas pressure setting',
    },
    {
      id: 'focusPosition',
      label: 'Focus Position',
      type: 'number',
      value: -1.5,
      unit: 'mm',
      min: -10,
      max: 5,
      step: 0.1,
      required: true,
      description: 'Focus position relative to surface (negative = into material)',
    },
    {
      id: 'pulseFrequency',
      label: 'Pulse Frequency',
      type: 'number',
      value: 0,
      unit: 'Hz',
      min: 0,
      max: 50000,
      step: 100,
      required: true,
      description: 'Pulse frequency (0 = continuous wave)',
    },
  ],

  outputs: [
    {
      id: 'qualityPrediction',
      label: 'Edge Quality Prediction',
      type: 'object',
      format: 'quality-prediction',
      description: 'Predicted edge quality metrics',
    },
    {
      id: 'surfaceAnalysis',
      label: 'Surface Analysis',
      type: 'object',
      format: 'surface-analysis',
      description: 'Surface roughness and texture predictions',
    },
    {
      id: 'geometryPrediction',
      label: 'Geometry Prediction',
      type: 'object',
      format: 'geometry-analysis',
      description: 'Predicted geometric characteristics',
    },
    {
      id: 'recommendations',
      label: 'Quality Improvement Recommendations',
      type: 'array',
      format: 'improvement-suggestions',
      description: 'Suggestions for achieving better edge quality',
    },
  ],

  calculate: (inputs: Record<string, any>) => {
    const {
      materialType,
      thickness,
      laserPower,
      cuttingSpeed,
      assistGas,
      gasPressure,
      focusPosition,
      pulseFrequency,
    } = inputs;

    // Predict edge quality
    const qualityPrediction = predictEdgeQuality(
      materialType,
      thickness,
      laserPower,
      cuttingSpeed,
      assistGas,
      gasPressure,
      focusPosition,
      pulseFrequency
    );

    // Analyze surface characteristics
    const surfaceAnalysis = analyzeSurfaceCharacteristics(
      qualityPrediction,
      materialType,
      assistGas,
      pulseFrequency
    );

    // Predict geometry
    const geometryPrediction = predictGeometry(
      qualityPrediction,
      thickness,
      focusPosition,
      gasPressure
    );

    // Generate recommendations
    const recommendations = generateQualityRecommendations(
      qualityPrediction,
      surfaceAnalysis,
      inputs
    );

    return {
      qualityPrediction,
      surfaceAnalysis,
      geometryPrediction,
      recommendations,
    };
  },

  validation: {
    thickness: {
      min: 0.5,
      max: 50,
      message: 'Thickness must be between 0.5mm and 50mm',
    },
    laserPower: {
      min: 100,
      max: 15000,
      message: 'Laser power must be between 100W and 15000W',
    },
    cuttingSpeed: {
      min: 100,
      max: 15000,
      message: 'Cutting speed must be between 100 and 15000 mm/min',
    },
  },

  examples: [
    {
      name: 'High Quality Steel Cut',
      description: 'Predicting quality for precision steel cutting',
      inputs: {
        materialType: 'carbon_steel',
        thickness: 5,
        laserPower: 1500,
        cuttingSpeed: 2500,
        assistGas: 'oxygen',
        gasPressure: 1.0,
        focusPosition: -1.5,
        pulseFrequency: 0,
      },
    },
    {
      name: 'Stainless Steel Precision',
      description: 'Quality prediction for stainless steel precision cutting',
      inputs: {
        materialType: 'stainless_steel',
        thickness: 8,
        laserPower: 2000,
        cuttingSpeed: 1800,
        assistGas: 'nitrogen',
        gasPressure: 15,
        focusPosition: -2.5,
        pulseFrequency: 0,
      },
    },
  ],

  tags: ['quality', 'prediction', 'edge', 'surface', 'roughness'],
  
  relatedCalculators: [
    'dross-prevention',
    'quality-grade',
    'power-speed-matching',
    'focus-height',
  ],

  learningResources: [
    {
      title: 'Edge Quality Fundamentals',
      type: 'article',
      url: '/learn/edge-quality-basics',
    },
    {
      title: 'Surface Roughness in Laser Cutting',
      type: 'video',
      url: '/learn/surface-roughness',
    },
  ],
};

// Helper functions
function predictEdgeQuality(
  materialType: string,
  thickness: number,
  laserPower: number,
  cuttingSpeed: number,
  assistGas: string,
  gasPressure: number,
  focusPosition: number,
  pulseFrequency: number
) {
  // Calculate power density
  const powerDensity = laserPower / (thickness * cuttingSpeed / 1000);
  
  // Base quality score (0-100)
  let qualityScore = 75;
  
  // Power-speed optimization factor
  const optimalPowerSpeed = getOptimalPowerSpeed(materialType, thickness, assistGas);
  const powerSpeedRatio = laserPower / cuttingSpeed;
  const powerSpeedDeviation = Math.abs(powerSpeedRatio - optimalPowerSpeed) / optimalPowerSpeed;
  
  if (powerSpeedDeviation < 0.1) {
    qualityScore += 15;
  } else if (powerSpeedDeviation < 0.2) {
    qualityScore += 10;
  } else if (powerSpeedDeviation > 0.5) {
    qualityScore -= 20;
  }
  
  // Gas pressure optimization
  const optimalPressure = getOptimalPressure(materialType, thickness, assistGas);
  const pressureDeviation = Math.abs(gasPressure - optimalPressure) / optimalPressure;
  
  if (pressureDeviation < 0.1) {
    qualityScore += 10;
  } else if (pressureDeviation > 0.3) {
    qualityScore -= 15;
  }
  
  // Focus position optimization
  const optimalFocus = -thickness / 3;
  const focusDeviation = Math.abs(focusPosition - optimalFocus);
  
  if (focusDeviation < 0.5) {
    qualityScore += 5;
  } else if (focusDeviation > 2) {
    qualityScore -= 10;
  }
  
  // Material-specific adjustments
  const materialFactors = {
    carbon_steel: 1.0,
    stainless_steel: 0.9,
    aluminum: 1.1,
    copper: 0.8,
    brass: 0.9,
    titanium: 0.85,
    acrylic: 1.2,
    wood: 0.7,
  };
  
  qualityScore *= materialFactors[materialType] || 1.0;
  
  // Pulse frequency effects
  if (pulseFrequency > 0) {
    if (materialType === 'acrylic' || materialType === 'wood') {
      qualityScore += 5; // Pulsed mode helps with organics
    } else if (thickness < 3) {
      qualityScore += 3; // Pulsed helps with thin metals
    }
  }
  
  const finalScore = Math.max(20, Math.min(100, qualityScore));
  
  return {
    overallScore: Math.round(finalScore),
    grade: getQualityGrade(finalScore),
    drossRisk: calculateDrossRisk(powerDensity, assistGas, materialType),
    edgeAngle: predictEdgeAngle(focusPosition, gasPressure, thickness),
    consistency: predictConsistency(finalScore, powerSpeedDeviation),
  };
}

function getOptimalPowerSpeed(materialType: string, thickness: number, assistGas: string) {
  const baseRatios = {
    carbon_steel: { oxygen: 0.4, nitrogen: 0.6, air: 0.5 },
    stainless_steel: { nitrogen: 0.8, oxygen: 0.5, air: 0.6 },
    aluminum: { nitrogen: 0.3, air: 0.4 },
  };
  
  return (baseRatios[materialType]?.[assistGas] || 0.5) * Math.sqrt(thickness / 3);
}

function getOptimalPressure(materialType: string, thickness: number, assistGas: string) {
  const basePressures = {
    oxygen: 0.8 + (thickness * 0.1),
    nitrogen: 12 + (thickness * 1.5),
    air: 6 + (thickness * 0.8),
  };
  
  return basePressures[assistGas] || 6;
}

function getQualityGrade(score: number) {
  if (score >= 90) return 'A+';
  if (score >= 85) return 'A';
  if (score >= 80) return 'B+';
  if (score >= 75) return 'B';
  if (score >= 70) return 'C+';
  if (score >= 65) return 'C';
  if (score >= 60) return 'D+';
  return 'D';
}

function calculateDrossRisk(powerDensity: number, assistGas: string, materialType: string) {
  let risk = 'Low';
  
  if (powerDensity > 100 && assistGas === 'oxygen') {
    risk = 'High';
  } else if (powerDensity > 50) {
    risk = 'Medium';
  }
  
  if (materialType === 'stainless_steel' && assistGas === 'oxygen') {
    risk = 'High';
  }
  
  return risk;
}

function predictEdgeAngle(focusPosition: number, gasPressure: number, thickness: number) {
  // Predict edge perpendicularity
  let angle = 90; // Perfect perpendicular
  
  // Focus position effects
  if (Math.abs(focusPosition + thickness/3) > 1) {
    angle -= Math.min(5, Math.abs(focusPosition + thickness/3));
  }
  
  // Gas pressure effects
  if (gasPressure < 0.5) {
    angle -= 2; // Low pressure causes taper
  }
  
  return {
    angle: Math.round(angle * 10) / 10,
    deviation: Math.round((90 - angle) * 10) / 10,
    quality: angle > 88 ? 'Excellent' : angle > 85 ? 'Good' : 'Fair',
  };
}

function predictConsistency(qualityScore: number, powerSpeedDeviation: number) {
  let consistency = 'High';
  
  if (powerSpeedDeviation > 0.3 || qualityScore < 70) {
    consistency = 'Low';
  } else if (powerSpeedDeviation > 0.2 || qualityScore < 80) {
    consistency = 'Medium';
  }
  
  return consistency;
}

function analyzeSurfaceCharacteristics(
  qualityPrediction: any,
  materialType: string,
  assistGas: string,
  pulseFrequency: number
) {
  // Predict surface roughness (Ra value)
  let roughness = 3.2; // Base roughness in micrometers
  
  if (qualityPrediction.overallScore > 85) {
    roughness = 1.6;
  } else if (qualityPrediction.overallScore > 75) {
    roughness = 2.5;
  } else if (qualityPrediction.overallScore < 60) {
    roughness = 6.3;
  }
  
  // Material-specific adjustments
  const materialRoughnessFactors = {
    carbon_steel: 1.0,
    stainless_steel: 1.1,
    aluminum: 0.8,
    copper: 1.3,
    acrylic: 0.6,
    wood: 2.0,
  };
  
  roughness *= materialRoughnessFactors[materialType] || 1.0;
  
  // Gas type effects
  if (assistGas === 'nitrogen') {
    roughness *= 0.9; // Nitrogen generally gives better surface
  }
  
  // Pulse frequency effects
  if (pulseFrequency > 0 && (materialType === 'acrylic' || materialType === 'wood')) {
    roughness *= 0.8; // Pulsed mode improves organic materials
  }
  
  return {
    roughness: Math.round(roughness * 10) / 10,
    roughnessClass: getRoughnessClass(roughness),
    texture: predictTexture(qualityPrediction.overallScore, assistGas),
    oxidation: predictOxidation(materialType, assistGas),
    heatAffectedZone: predictHAZ(qualityPrediction.overallScore, pulseFrequency),
  };
}

function getRoughnessClass(roughness: number) {
  if (roughness <= 1.6) return 'N6 (Very Fine)';
  if (roughness <= 3.2) return 'N7 (Fine)';
  if (roughness <= 6.3) return 'N8 (Medium)';
  return 'N9 (Coarse)';
}

function predictTexture(qualityScore: number, assistGas: string) {
  if (qualityScore > 85) {
    return assistGas === 'nitrogen' ? 'Mirror-like' : 'Very Smooth';
  } else if (qualityScore > 75) {
    return 'Smooth';
  } else if (qualityScore > 65) {
    return 'Slightly Rough';
  }
  return 'Rough';
}

function predictOxidation(materialType: string, assistGas: string) {
  if (assistGas === 'nitrogen') {
    return 'None (Inert atmosphere)';
  } else if (assistGas === 'oxygen' && materialType.includes('steel')) {
    return 'Minimal (Controlled oxidation)';
  } else if (assistGas === 'air') {
    return 'Light oxidation possible';
  }
  return 'Minimal';
}

function predictHAZ(qualityScore: number, pulseFrequency: number) {
  let hazWidth = 0.2; // Base HAZ width in mm
  
  if (qualityScore > 85) {
    hazWidth = 0.1;
  } else if (qualityScore < 65) {
    hazWidth = 0.4;
  }
  
  if (pulseFrequency > 0) {
    hazWidth *= 0.7; // Pulsed mode reduces HAZ
  }
  
  return {
    width: Math.round(hazWidth * 100) / 100,
    quality: hazWidth < 0.15 ? 'Minimal' : hazWidth < 0.3 ? 'Acceptable' : 'Significant',
  };
}

function predictGeometry(qualityPrediction: any, thickness: number, focusPosition: number, gasPressure: number) {
  // Predict kerf characteristics
  const kerfWidth = 0.1 + (thickness * 0.02);
  const kerfTaper = Math.abs(focusPosition + thickness/3) * 0.1;
  
  return {
    kerfWidth: Math.round(kerfWidth * 100) / 100,
    kerfTaper: Math.round(kerfTaper * 100) / 100,
    edgeAngle: qualityPrediction.edgeAngle,
    dimensionalAccuracy: qualityPrediction.overallScore > 80 ? '±0.05mm' : '±0.1mm',
    cornerRadius: Math.round((kerfWidth / 2) * 100) / 100,
  };
}

function generateQualityRecommendations(qualityPrediction: any, surfaceAnalysis: any, inputs: any) {
  const recommendations = [];
  
  if (qualityPrediction.overallScore < 75) {
    recommendations.push({
      priority: 'High',
      category: 'Parameter Optimization',
      suggestion: 'Optimize power-speed ratio for better edge quality',
      expectedImprovement: '10-20 points',
    });
  }
  
  if (qualityPrediction.drossRisk === 'High') {
    recommendations.push({
      priority: 'High',
      category: 'Dross Prevention',
      suggestion: 'Reduce power or increase speed to prevent dross formation',
      expectedImprovement: 'Eliminate dross',
    });
  }
  
  if (surfaceAnalysis.roughness > 3.2) {
    recommendations.push({
      priority: 'Medium',
      category: 'Surface Quality',
      suggestion: 'Consider using nitrogen assist gas for smoother surface',
      expectedImprovement: 'Reduce roughness by 30%',
    });
  }
  
  if (qualityPrediction.edgeAngle.angle < 88) {
    recommendations.push({
      priority: 'Medium',
      category: 'Geometry',
      suggestion: 'Adjust focus position closer to optimal depth',
      expectedImprovement: 'Improve edge perpendicularity',
    });
  }
  
  if (inputs.materialType === 'stainless_steel' && inputs.assistGas === 'oxygen') {
    recommendations.push({
      priority: 'Medium',
      category: 'Material-Specific',
      suggestion: 'Switch to nitrogen assist gas for stainless steel',
      expectedImprovement: 'Better surface finish and no oxidation',
    });
  }
  
  return recommendations;
}

export default edgeQualityPredictorConfig;
