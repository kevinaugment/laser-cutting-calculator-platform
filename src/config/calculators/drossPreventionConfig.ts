import { CalculatorConfig } from '../../types/calculator';

export const drossPreventionConfig: CalculatorConfig = {
  id: 'dross-prevention',
  name: 'Dross Prevention Calculator',
  description: 'Calculate optimal parameters to prevent dross formation and achieve clean cut edges in laser cutting.',
  category: 'quality-control',
  difficulty: 'intermediate',
  estimatedTime: '3-4 minutes',
  
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
      description: 'Thickness of the material in millimeters',
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
      description: 'Available laser power',
    },
    {
      id: 'cuttingSpeed',
      label: 'Current Cutting Speed',
      type: 'number',
      value: 2500,
      unit: 'mm/min',
      min: 100,
      max: 15000,
      step: 100,
      required: true,
      description: 'Current cutting speed setting',
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
      id: 'gasPressure',
      label: 'Gas Pressure',
      type: 'number',
      value: 1.0,
      unit: 'bar',
      min: 0.1,
      max: 20,
      step: 0.1,
      required: true,
      description: 'Current gas pressure setting',
    },
    {
      id: 'nozzleDiameter',
      label: 'Nozzle Diameter',
      type: 'number',
      value: 1.5,
      unit: 'mm',
      min: 0.5,
      max: 5.0,
      step: 0.1,
      required: true,
      description: 'Cutting nozzle diameter',
    },
    {
      id: 'currentDrossLevel',
      label: 'Current Dross Level',
      type: 'select',
      value: 'moderate',
      options: [
        { value: 'none', label: 'No Dross' },
        { value: 'minimal', label: 'Minimal Dross' },
        { value: 'moderate', label: 'Moderate Dross' },
        { value: 'heavy', label: 'Heavy Dross' },
        { value: 'severe', label: 'Severe Dross' },
      ],
      required: true,
      description: 'Current level of dross formation',
    },
  ],

  outputs: [
    {
      id: 'drossAnalysis',
      label: 'Dross Formation Analysis',
      type: 'object',
      format: 'dross-analysis',
      description: 'Analysis of current dross formation causes',
    },
    {
      id: 'optimizedParameters',
      label: 'Optimized Parameters',
      type: 'object',
      format: 'parameter-optimization',
      description: 'Recommended parameter adjustments',
    },
    {
      id: 'preventionStrategy',
      label: 'Prevention Strategy',
      type: 'object',
      format: 'prevention-plan',
      description: 'Comprehensive dross prevention strategy',
    },
    {
      id: 'qualityPrediction',
      label: 'Quality Prediction',
      type: 'object',
      format: 'quality-forecast',
      description: 'Expected quality improvement with optimized parameters',
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
      nozzleDiameter,
      currentDrossLevel,
    } = inputs;

    // Analyze current dross formation
    const drossAnalysis = analyzeDrossFormation(
      materialType,
      thickness,
      laserPower,
      cuttingSpeed,
      assistGas,
      gasPressure,
      currentDrossLevel
    );

    // Calculate optimized parameters
    const optimizedParameters = calculateOptimizedParameters(
      drossAnalysis,
      materialType,
      thickness,
      laserPower,
      assistGas,
      nozzleDiameter
    );

    // Generate prevention strategy
    const preventionStrategy = generatePreventionStrategy(
      drossAnalysis,
      optimizedParameters,
      materialType,
      assistGas
    );

    // Predict quality improvement
    const qualityPrediction = predictQualityImprovement(
      currentDrossLevel,
      optimizedParameters,
      materialType
    );

    return {
      drossAnalysis,
      optimizedParameters,
      preventionStrategy,
      qualityPrediction,
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
      name: '5mm Steel with Heavy Dross',
      description: 'Optimizing parameters for heavy dross on 5mm steel',
      inputs: {
        materialType: 'carbon_steel',
        thickness: 5,
        laserPower: 1500,
        cuttingSpeed: 2500,
        assistGas: 'oxygen',
        gasPressure: 1.0,
        nozzleDiameter: 1.5,
        currentDrossLevel: 'heavy',
      },
    },
    {
      name: 'Stainless Steel Dross Issues',
      description: 'Preventing dross on stainless steel cuts',
      inputs: {
        materialType: 'stainless_steel',
        thickness: 8,
        laserPower: 2000,
        cuttingSpeed: 1800,
        assistGas: 'nitrogen',
        gasPressure: 15,
        nozzleDiameter: 2.0,
        currentDrossLevel: 'moderate',
      },
    },
  ],

  tags: ['dross', 'quality', 'prevention', 'edge-quality', 'optimization'],
  
  relatedCalculators: [
    'gas-pressure-setting',
    'power-speed-matching',
    'quality-grade',
    'edge-quality-predictor',
  ],

  learningResources: [
    {
      title: 'Understanding Dross Formation',
      type: 'article',
      url: '/learn/dross-formation',
    },
    {
      title: 'Dross Prevention Techniques',
      type: 'video',
      url: '/learn/dross-prevention',
    },
  ],
};

// Helper functions
function analyzeDrossFormation(
  materialType: string,
  thickness: number,
  laserPower: number,
  cuttingSpeed: number,
  assistGas: string,
  gasPressure: number,
  currentDrossLevel: string
) {
  const causes = [];
  const severity = getDrossSeverityScore(currentDrossLevel);
  
  // Analyze power-to-speed ratio
  const powerSpeedRatio = laserPower / cuttingSpeed;
  const optimalRatio = getOptimalPowerSpeedRatio(materialType, thickness, assistGas);
  
  if (powerSpeedRatio > optimalRatio * 1.2) {
    causes.push({
      factor: 'Excessive Power/Speed Ratio',
      impact: 'High',
      description: 'Too much power relative to cutting speed causes excessive melting',
    });
  }
  
  // Analyze gas pressure
  const optimalPressure = getOptimalGasPressure(materialType, thickness, assistGas);
  if (Math.abs(gasPressure - optimalPressure) > optimalPressure * 0.3) {
    causes.push({
      factor: 'Suboptimal Gas Pressure',
      impact: gasPressure < optimalPressure ? 'High' : 'Medium',
      description: gasPressure < optimalPressure ? 
        'Insufficient gas pressure for melt ejection' : 
        'Excessive gas pressure causing turbulence',
    });
  }
  
  // Material-specific analysis
  if (materialType === 'carbon_steel' && assistGas === 'nitrogen') {
    causes.push({
      factor: 'Gas Type Mismatch',
      impact: 'Medium',
      description: 'Nitrogen may not provide optimal cutting for carbon steel',
    });
  }
  
  return {
    severity,
    primaryCauses: causes,
    riskFactors: identifyRiskFactors(materialType, thickness, assistGas),
    recommendation: severity > 3 ? 'Immediate parameter adjustment needed' : 'Minor optimization recommended',
  };
}

function getDrossSeverityScore(drossLevel: string) {
  const scores = {
    none: 0,
    minimal: 1,
    moderate: 3,
    heavy: 4,
    severe: 5,
  };
  return scores[drossLevel] || 3;
}

function getOptimalPowerSpeedRatio(materialType: string, thickness: number, assistGas: string) {
  const baseRatios = {
    carbon_steel: { oxygen: 0.4, nitrogen: 0.6, air: 0.5 },
    stainless_steel: { nitrogen: 0.8, oxygen: 0.5, air: 0.6 },
    aluminum: { nitrogen: 0.3, air: 0.4 },
    copper: { nitrogen: 1.0, air: 0.8 },
  };
  
  const baseRatio = baseRatios[materialType]?.[assistGas] || 0.5;
  return baseRatio * Math.sqrt(thickness / 3); // Adjust for thickness
}

function getOptimalGasPressure(materialType: string, thickness: number, assistGas: string) {
  const basePressures = {
    oxygen: 0.8 + (thickness * 0.1),
    nitrogen: 12 + (thickness * 1.5),
    air: 6 + (thickness * 0.8),
  };
  
  let pressure = basePressures[assistGas] || 6;
  
  // Material adjustments
  if (materialType === 'stainless_steel' && assistGas === 'nitrogen') {
    pressure *= 1.2;
  } else if (materialType === 'aluminum') {
    pressure *= 1.1;
  }
  
  return pressure;
}

function identifyRiskFactors(materialType: string, thickness: number, assistGas: string) {
  const factors = [];
  
  if (thickness > 10) {
    factors.push('Thick material increases dross risk');
  }
  
  if (materialType === 'stainless_steel') {
    factors.push('Stainless steel prone to dross with incorrect parameters');
  }
  
  if (assistGas === 'air' && thickness > 5) {
    factors.push('Air assist may be insufficient for thick materials');
  }
  
  return factors;
}

function calculateOptimizedParameters(
  drossAnalysis: any,
  materialType: string,
  thickness: number,
  laserPower: number,
  assistGas: string,
  nozzleDiameter: number
) {
  // Calculate optimal power and speed
  const optimalPowerSpeedRatio = getOptimalPowerSpeedRatio(materialType, thickness, assistGas);
  const optimalSpeed = Math.sqrt(laserPower / optimalPowerSpeedRatio);
  const optimalPower = optimalSpeed * optimalPowerSpeedRatio;
  
  // Calculate optimal gas pressure
  const optimalGasPressure = getOptimalGasPressure(materialType, thickness, assistGas);
  
  // Calculate optimal nozzle standoff
  const optimalStandoff = calculateOptimalStandoff(thickness, nozzleDiameter);
  
  return {
    power: Math.round(Math.min(optimalPower, laserPower)),
    speed: Math.round(optimalSpeed),
    gasPressure: Math.round(optimalGasPressure * 10) / 10,
    nozzleStandoff: optimalStandoff,
    focusPosition: calculateOptimalFocus(thickness),
    improvements: calculateImprovements(drossAnalysis.severity),
  };
}

function calculateOptimalStandoff(thickness: number, nozzleDiameter: number) {
  // Optimal standoff is typically 0.5-1.0 times nozzle diameter
  const baseStandoff = nozzleDiameter * 0.7;
  const thicknessAdjustment = thickness > 10 ? 0.2 : 0;
  
  return {
    distance: Math.round((baseStandoff + thicknessAdjustment) * 10) / 10,
    tolerance: '±0.1mm',
    note: 'Maintain consistent standoff for uniform gas flow',
  };
}

function calculateOptimalFocus(thickness: number) {
  // Focus position relative to material surface
  const focusPosition = -thickness / 3; // 1/3 into material
  
  return {
    position: Math.round(focusPosition * 10) / 10,
    unit: 'mm',
    reference: 'Material surface (negative = into material)',
  };
}

function calculateImprovements(currentSeverity: number) {
  const improvements = [];
  
  if (currentSeverity >= 4) {
    improvements.push('Expected 70-90% reduction in dross formation');
    improvements.push('Significant improvement in edge quality');
  } else if (currentSeverity >= 2) {
    improvements.push('Expected 40-60% reduction in dross formation');
    improvements.push('Moderate improvement in edge quality');
  } else {
    improvements.push('Fine-tuning for optimal edge quality');
  }
  
  return improvements;
}

function generatePreventionStrategy(
  drossAnalysis: any,
  optimizedParameters: any,
  materialType: string,
  assistGas: string
) {
  const strategy = {
    immediate: [],
    ongoing: [],
    monitoring: [],
  };
  
  // Immediate actions
  if (drossAnalysis.severity >= 3) {
    strategy.immediate.push('Adjust power and speed to recommended values');
    strategy.immediate.push('Optimize gas pressure settings');
    strategy.immediate.push('Check and adjust nozzle standoff distance');
  }
  
  // Ongoing practices
  strategy.ongoing.push('Regular nozzle condition inspection');
  strategy.ongoing.push('Maintain consistent material surface condition');
  strategy.ongoing.push('Monitor gas purity and flow consistency');
  
  if (materialType === 'stainless_steel') {
    strategy.ongoing.push('Use high-purity nitrogen for best results');
  }
  
  // Monitoring points
  strategy.monitoring.push('Edge quality inspection after parameter changes');
  strategy.monitoring.push('Dross formation patterns on test cuts');
  strategy.monitoring.push('Gas consumption efficiency');
  
  return strategy;
}

function predictQualityImprovement(
  currentDrossLevel: string,
  optimizedParameters: any,
  materialType: string
) {
  const currentScore = getDrossSeverityScore(currentDrossLevel);
  const expectedImprovement = Math.min(currentScore * 0.7, 4); // Up to 70% improvement
  const newScore = Math.max(0, currentScore - expectedImprovement);
  
  const qualityGrades = {
    0: 'Excellent - No dross',
    1: 'Very Good - Minimal dross',
    2: 'Good - Light dross',
    3: 'Fair - Moderate dross',
    4: 'Poor - Heavy dross',
    5: 'Very Poor - Severe dross',
  };
  
  return {
    currentQuality: qualityGrades[currentScore],
    expectedQuality: qualityGrades[Math.round(newScore)],
    improvementPercentage: Math.round((expectedImprovement / currentScore) * 100),
    timeToSeeResults: '1-3 test cuts',
    confidenceLevel: currentScore >= 3 ? 'High' : 'Medium',
  };
}

export default drossPreventionConfig;
