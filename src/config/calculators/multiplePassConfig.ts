import { CalculatorConfig } from '../../types/calculator';

export const multiplePassConfig: CalculatorConfig = {
  id: 'multiple-pass',
  name: 'Multiple Pass Calculator',
  description: 'Calculate optimal parameters for multi-pass cutting of thick materials, including power reduction and speed optimization for each pass.',
  category: 'parameters-settings',
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
        { value: 'acrylic', label: 'Acrylic (PMMA)' },
        { value: 'wood', label: 'Wood' },
        { value: 'plywood', label: 'Plywood' },
      ],
      required: true,
      description: 'Select the material to be cut',
    },
    {
      id: 'thickness',
      label: 'Material Thickness',
      type: 'number',
      value: 15,
      unit: 'mm',
      min: 5,
      max: 100,
      step: 0.5,
      required: true,
      description: 'Total thickness of the material to be cut',
    },
    {
      id: 'laserType',
      label: 'Laser Type',
      type: 'select',
      value: 'fiber',
      options: [
        { value: 'fiber', label: 'Fiber Laser' },
        { value: 'co2', label: 'CO₂ Laser' },
        { value: 'nd_yag', label: 'Nd:YAG Laser' },
      ],
      required: true,
      description: 'Type of laser system being used',
    },
    {
      id: 'maxLaserPower',
      label: 'Maximum Laser Power',
      type: 'number',
      value: 2000,
      unit: 'W',
      min: 500,
      max: 15000,
      step: 100,
      required: true,
      description: 'Maximum available laser power',
    },
    {
      id: 'singlePassLimit',
      label: 'Single Pass Thickness Limit',
      type: 'number',
      value: 8,
      unit: 'mm',
      min: 2,
      max: 25,
      step: 0.5,
      required: true,
      description: 'Maximum thickness achievable in a single pass with current setup',
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
      description: 'Type of assist gas being used',
    },
    {
      id: 'qualityRequirement',
      label: 'Quality Requirement',
      type: 'select',
      value: 'standard',
      options: [
        { value: 'rough', label: 'Rough Cut (Fast)' },
        { value: 'standard', label: 'Standard Quality' },
        { value: 'precision', label: 'Precision Cut' },
      ],
      required: true,
      description: 'Required cut quality level',
    },
    {
      id: 'cuttingStrategy',
      label: 'Cutting Strategy',
      type: 'select',
      value: 'progressive_power',
      options: [
        { value: 'progressive_power', label: 'Progressive Power Reduction' },
        { value: 'constant_power', label: 'Constant Power' },
        { value: 'adaptive', label: 'Adaptive Strategy' },
      ],
      required: true,
      description: 'Strategy for multiple pass cutting',
    },
  ],

  outputs: [
    {
      id: 'passStrategy',
      label: 'Multi-Pass Strategy',
      type: 'object',
      format: 'pass-strategy',
      description: 'Recommended number of passes and overall strategy',
    },
    {
      id: 'passParameters',
      label: 'Pass-by-Pass Parameters',
      type: 'array',
      format: 'pass-table',
      description: 'Detailed parameters for each cutting pass',
    },
    {
      id: 'timeAnalysis',
      label: 'Time Analysis',
      type: 'object',
      format: 'time-breakdown',
      description: 'Total cutting time and efficiency analysis',
    },
    {
      id: 'qualityPrediction',
      label: 'Quality Prediction',
      type: 'object',
      format: 'quality-analysis',
      description: 'Expected cut quality and potential issues',
    },
  ],

  calculate: (inputs: Record<string, any>) => {
    const {
      materialType,
      thickness,
      laserType,
      maxLaserPower,
      singlePassLimit,
      assistGas,
      qualityRequirement,
      cuttingStrategy,
    } = inputs;

    // Calculate optimal pass strategy
    const passStrategy = calculatePassStrategy(
      thickness,
      singlePassLimit,
      materialType,
      cuttingStrategy
    );

    // Calculate parameters for each pass
    const passParameters = calculatePassParameters(
      passStrategy,
      materialType,
      laserType,
      maxLaserPower,
      assistGas,
      qualityRequirement,
      cuttingStrategy
    );

    // Analyze total cutting time
    const timeAnalysis = analyzeTimeRequirements(passParameters, thickness);

    // Predict cut quality
    const qualityPrediction = predictMultiPassQuality(
      passParameters,
      materialType,
      thickness,
      qualityRequirement
    );

    return {
      passStrategy,
      passParameters,
      timeAnalysis,
      qualityPrediction,
    };
  },

  validation: {
    thickness: {
      min: 5,
      max: 100,
      message: 'Thickness must be between 5mm and 100mm for multi-pass cutting',
    },
    maxLaserPower: {
      min: 500,
      max: 15000,
      message: 'Laser power must be between 500W and 15000W',
    },
    singlePassLimit: {
      min: 2,
      max: 25,
      message: 'Single pass limit must be between 2mm and 25mm',
    },
  },

  examples: [
    {
      name: '15mm Steel Plate',
      description: 'Multi-pass cutting of 15mm carbon steel',
      inputs: {
        materialType: 'carbon_steel',
        thickness: 15,
        laserType: 'fiber',
        maxLaserPower: 2000,
        singlePassLimit: 8,
        assistGas: 'oxygen',
        qualityRequirement: 'standard',
        cuttingStrategy: 'progressive_power',
      },
    },
    {
      name: '25mm Stainless Steel',
      description: 'Precision multi-pass cutting of thick stainless steel',
      inputs: {
        materialType: 'stainless_steel',
        thickness: 25,
        laserType: 'fiber',
        maxLaserPower: 3000,
        singlePassLimit: 10,
        assistGas: 'nitrogen',
        qualityRequirement: 'precision',
        cuttingStrategy: 'adaptive',
      },
    },
  ],

  tags: ['multi-pass', 'thick-material', 'strategy', 'optimization'],
  
  relatedCalculators: [
    'power-speed-matching',
    'focus-height',
    'gas-pressure-setting',
    'cutting-time',
  ],

  learningResources: [
    {
      title: 'Multi-Pass Cutting Strategies',
      type: 'article',
      url: '/learn/multi-pass-strategies',
    },
    {
      title: 'Thick Material Cutting Techniques',
      type: 'video',
      url: '/learn/thick-material-cutting',
    },
  ],
};

// Helper functions
function calculatePassStrategy(thickness: number, singlePassLimit: number, materialType: string, strategy: string) {
  // Calculate minimum number of passes required
  const minPasses = Math.ceil(thickness / singlePassLimit);
  
  // Optimize number of passes based on strategy and material
  let optimalPasses = minPasses;
  
  if (strategy === 'progressive_power') {
    // Progressive power strategy may benefit from more passes
    optimalPasses = Math.min(minPasses + 1, 5);
  } else if (strategy === 'adaptive') {
    // Adaptive strategy optimizes based on material properties
    const materialFactors = {
      carbon_steel: 1.0,
      stainless_steel: 1.2,
      aluminum: 0.9,
      copper: 1.3,
      titanium: 1.4,
      acrylic: 0.8,
      wood: 0.7,
    };
    
    const factor = materialFactors[materialType] || 1.0;
    optimalPasses = Math.ceil(minPasses * factor);
  }
  
  // Calculate depth per pass
  const depthPerPass = thickness / optimalPasses;
  
  return {
    totalPasses: optimalPasses,
    depthPerPass: Math.round(depthPerPass * 10) / 10,
    strategy: strategy,
    reasoning: generateStrategyReasoning(optimalPasses, strategy, materialType),
    efficiency: calculateStrategyEfficiency(optimalPasses, minPasses),
  };
}

function calculatePassParameters(
  passStrategy: any,
  materialType: string,
  laserType: string,
  maxPower: number,
  assistGas: string,
  quality: string,
  strategy: string
) {
  const passes = [];
  const totalPasses = passStrategy.totalPasses;
  
  for (let i = 1; i <= totalPasses; i++) {
    const passDepth = passStrategy.depthPerPass;
    const cumulativeDepth = i * passDepth;
    
    // Calculate power for this pass
    const power = calculatePassPower(i, totalPasses, maxPower, strategy, materialType);
    
    // Calculate speed for this pass
    const speed = calculatePassSpeed(i, totalPasses, passDepth, materialType, laserType, quality);
    
    // Calculate gas pressure for this pass
    const gasPressure = calculatePassGasPressure(i, totalPasses, assistGas, materialType, passDepth);
    
    // Calculate focus position for this pass
    const focusPosition = calculatePassFocus(i, passDepth, cumulativeDepth);
    
    passes.push({
      passNumber: i,
      depth: passDepth,
      cumulativeDepth: Math.round(cumulativeDepth * 10) / 10,
      power: Math.round(power),
      powerPercentage: Math.round((power / maxPower) * 100),
      speed: Math.round(speed),
      gasPressure: Math.round(gasPressure * 10) / 10,
      focusPosition: Math.round(focusPosition * 10) / 10,
      estimatedTime: calculatePassTime(speed, passDepth),
      notes: generatePassNotes(i, totalPasses, strategy),
    });
  }
  
  return passes;
}

function calculatePassPower(passNumber: number, totalPasses: number, maxPower: number, strategy: string, materialType: string) {
  let powerFactor = 1.0;
  
  if (strategy === 'progressive_power') {
    // Reduce power for later passes
    powerFactor = 1.0 - ((passNumber - 1) / totalPasses) * 0.3;
  } else if (strategy === 'adaptive') {
    // Adaptive power based on pass depth and material
    if (passNumber === 1) {
      powerFactor = 0.9; // Slightly lower for first pass
    } else if (passNumber === totalPasses) {
      powerFactor = 0.7; // Lower for final pass to improve quality
    } else {
      powerFactor = 0.8; // Medium power for middle passes
    }
  }
  // constant_power strategy uses powerFactor = 1.0
  
  // Material-specific adjustments
  const materialFactors = {
    carbon_steel: 1.0,
    stainless_steel: 1.1,
    aluminum: 0.8,
    copper: 1.2,
    titanium: 1.3,
    acrylic: 0.4,
    wood: 0.3,
  };
  
  powerFactor *= materialFactors[materialType] || 1.0;
  
  return Math.min(maxPower * powerFactor, maxPower);
}

function calculatePassSpeed(passNumber: number, totalPasses: number, passDepth: number, materialType: string, laserType: string, quality: string) {
  // Base speeds by material and laser type
  const baseSpeeds = {
    carbon_steel: { fiber: 2000, co2: 1500, nd_yag: 1800 },
    stainless_steel: { fiber: 1800, co2: 1200, nd_yag: 1500 },
    aluminum: { fiber: 3000, co2: 800, nd_yag: 2000 },
    acrylic: { fiber: 1000, co2: 1500, nd_yag: 1200 },
    wood: { fiber: 800, co2: 2000, nd_yag: 1000 },
  };
  
  let baseSpeed = baseSpeeds[materialType]?.[laserType] || 1500;
  
  // Adjust for pass depth
  baseSpeed *= Math.sqrt(3 / passDepth); // Slower for deeper passes
  
  // Adjust for pass number
  if (passNumber === totalPasses) {
    baseSpeed *= 0.8; // Slower final pass for better quality
  }
  
  // Quality adjustments
  const qualityFactors = {
    rough: 1.3,
    standard: 1.0,
    precision: 0.7,
  };
  
  baseSpeed *= qualityFactors[quality] || 1.0;
  
  return Math.max(200, baseSpeed); // Minimum speed limit
}

function calculatePassGasPressure(passNumber: number, totalPasses: number, assistGas: string, materialType: string, passDepth: number) {
  // Base pressures by gas type
  const basePressures = {
    oxygen: 0.8,
    nitrogen: 12,
    air: 6,
  };
  
  let pressure = basePressures[assistGas] || 6;
  
  // Increase pressure for deeper passes to improve melt ejection
  pressure *= (1 + (passNumber - 1) * 0.2);
  
  // Adjust for pass depth
  pressure *= Math.sqrt(passDepth / 3);
  
  return pressure;
}

function calculatePassFocus(passNumber: number, passDepth: number, cumulativeDepth: number) {
  // Focus position relative to original surface
  // Negative values = into material
  
  if (passNumber === 1) {
    return -passDepth / 3; // Focus 1/3 into first pass
  } else {
    // Focus at the bottom of previous cut plus 1/3 into current pass
    return -(cumulativeDepth - passDepth) - (passDepth / 3);
  }
}

function calculatePassTime(speed: number, depth: number) {
  // Estimate time per meter of cutting
  const timePerMeter = 60 / (speed / 1000); // minutes per meter
  
  // Add setup time between passes
  const setupTime = 0.5; // minutes
  
  return {
    cuttingTime: Math.round(timePerMeter * 10) / 10,
    setupTime: setupTime,
    total: Math.round((timePerMeter + setupTime) * 10) / 10,
  };
}

function analyzeTimeRequirements(passParameters: any[]) {
  const totalCuttingTime = passParameters.reduce((sum, pass) => sum + pass.estimatedTime.cuttingTime, 0);
  const totalSetupTime = passParameters.reduce((sum, pass) => sum + pass.estimatedTime.setupTime, 0);
  const totalTime = totalCuttingTime + totalSetupTime;
  
  // Compare with single-pass estimate
  const singlePassEstimate = passParameters[0].estimatedTime.cuttingTime * 2; // Rough estimate
  const efficiency = (singlePassEstimate / totalTime) * 100;
  
  return {
    totalCuttingTime: Math.round(totalCuttingTime * 10) / 10,
    totalSetupTime: Math.round(totalSetupTime * 10) / 10,
    totalTime: Math.round(totalTime * 10) / 10,
    efficiency: Math.round(efficiency),
    timePerMeter: Math.round(totalTime * 10) / 10,
    comparison: generateTimeComparison(totalTime, singlePassEstimate),
  };
}

function predictMultiPassQuality(passParameters: any[], materialType: string, thickness: number, qualityReq: string) {
  let qualityScore = 75; // Base quality score
  
  // Multi-pass generally improves quality
  qualityScore += 10;
  
  // More passes = better quality (up to a point)
  const passCount = passParameters.length;
  if (passCount >= 3) {
    qualityScore += 5;
  }
  
  // Final pass speed affects quality
  const finalPass = passParameters[passParameters.length - 1];
  if (finalPass.speed < 1000) {
    qualityScore += 5; // Slow final pass improves quality
  }
  
  // Thickness affects quality
  if (thickness > 20) {
    qualityScore -= 5; // Very thick materials are challenging
  }
  
  const issues = predictPotentialIssues(passParameters, materialType, thickness);
  
  return {
    overallScore: Math.max(60, Math.min(100, qualityScore)),
    edgeQuality: qualityScore > 85 ? 'Excellent' : qualityScore > 75 ? 'Good' : 'Fair',
    expectedFeatures: generateQualityFeatures(qualityScore, passCount),
    potentialIssues: issues,
    recommendations: generateQualityRecommendations(issues, passParameters),
  };
}

function generateStrategyReasoning(passes: number, strategy: string, materialType: string) {
  const reasons = [];
  
  reasons.push(`${passes} passes recommended for optimal balance of quality and efficiency`);
  
  if (strategy === 'progressive_power') {
    reasons.push('Progressive power reduction minimizes heat buildup in later passes');
  } else if (strategy === 'adaptive') {
    reasons.push('Adaptive strategy optimized for material thermal properties');
  }
  
  if (materialType.includes('steel')) {
    reasons.push('Steel materials benefit from controlled multi-pass approach');
  }
  
  return reasons;
}

function calculateStrategyEfficiency(optimal: number, minimum: number) {
  const efficiency = (minimum / optimal) * 100;
  return {
    score: Math.round(efficiency),
    rating: efficiency > 90 ? 'Excellent' : efficiency > 75 ? 'Good' : 'Fair',
  };
}

function generatePassNotes(passNumber: number, totalPasses: number, strategy: string) {
  const notes = [];
  
  if (passNumber === 1) {
    notes.push('First pass: Establish initial cut path');
    notes.push('Monitor for proper penetration');
  } else if (passNumber === totalPasses) {
    notes.push('Final pass: Focus on edge quality');
    notes.push('Reduced speed for best finish');
  } else {
    notes.push('Intermediate pass: Maintain consistent parameters');
  }
  
  if (strategy === 'progressive_power') {
    notes.push('Power reduced to minimize heat accumulation');
  }
  
  return notes;
}

function generateTimeComparison(multiPassTime: number, singlePassEstimate: number) {
  const difference = multiPassTime - singlePassEstimate;
  const percentDiff = (difference / singlePassEstimate) * 100;
  
  return {
    difference: Math.round(difference * 10) / 10,
    percentIncrease: Math.round(percentDiff),
    justification: percentDiff < 50 ? 'Reasonable time increase for quality improvement' : 'Significant time increase - consider single pass if quality allows',
  };
}

function predictPotentialIssues(passParameters: any[], materialType: string, thickness: number) {
  const issues = [];
  
  if (passParameters.length > 4) {
    issues.push('Many passes may cause heat accumulation');
  }
  
  if (thickness > 25) {
    issues.push('Very thick material may have kerf taper');
  }
  
  if (materialType === 'stainless_steel') {
    issues.push('Stainless steel may work-harden between passes');
  }
  
  const powerVariation = Math.max(...passParameters.map(p => p.power)) - Math.min(...passParameters.map(p => p.power));
  if (powerVariation > 500) {
    issues.push('Large power variation may cause inconsistent kerf width');
  }
  
  return issues;
}

function generateQualityFeatures(score: number, passCount: number) {
  const features = [];
  
  if (score > 85) {
    features.push('Excellent edge perpendicularity');
    features.push('Minimal heat affected zone');
  }
  
  if (passCount >= 3) {
    features.push('Consistent kerf width throughout thickness');
    features.push('Reduced dross formation');
  }
  
  features.push('Better dimensional accuracy than single pass');
  
  return features;
}

function generateQualityRecommendations(issues: any[], passParameters: any[]) {
  const recommendations = [];
  
  if (issues.some(issue => issue.includes('heat accumulation'))) {
    recommendations.push('Allow cooling time between passes');
    recommendations.push('Consider reducing cutting speed');
  }
  
  if (issues.some(issue => issue.includes('kerf taper'))) {
    recommendations.push('Adjust focus position for each pass');
    recommendations.push('Monitor gas pressure consistency');
  }
  
  if (issues.some(issue => issue.includes('work-harden'))) {
    recommendations.push('Minimize delay between passes');
    recommendations.push('Consider stress relief if necessary');
  }
  
  recommendations.push('Perform test cuts to verify parameters');
  
  return recommendations;
}

export default multiplePassConfig;
