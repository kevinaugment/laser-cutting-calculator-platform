import { CalculatorConfig } from '../../types/calculator';

export const frequencySettingConfig: CalculatorConfig = {
  id: 'frequency-setting',
  name: 'Frequency Setting Assistant',
  description: 'Determine optimal laser pulse frequency for different materials (wood, acrylic, metals) to achieve best cut quality and efficiency.',
  category: 'parameters-settings',
  difficulty: 'intermediate',
  estimatedTime: '2-3 minutes',
  
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
        { value: 'polycarbonate', label: 'Polycarbonate' },
        { value: 'wood_hardwood', label: 'Hardwood' },
        { value: 'wood_softwood', label: 'Softwood' },
        { value: 'plywood', label: 'Plywood' },
        { value: 'mdf', label: 'MDF' },
        { value: 'cardboard', label: 'Cardboard' },
        { value: 'fabric', label: 'Fabric/Textile' },
      ],
      required: true,
      description: 'Select the material to be cut',
    },
    {
      id: 'thickness',
      label: 'Material Thickness',
      type: 'number',
      value: 3,
      unit: 'mm',
      min: 0.1,
      max: 50,
      step: 0.1,
      required: true,
      description: 'Thickness of the material in millimeters',
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
        { value: 'diode', label: 'Diode Laser' },
      ],
      required: true,
      description: 'Type of laser system being used',
    },
    {
      id: 'cuttingSpeed',
      label: 'Cutting Speed',
      type: 'number',
      value: 3000,
      unit: 'mm/min',
      min: 100,
      max: 15000,
      step: 100,
      required: true,
      description: 'Planned cutting speed',
    },
    {
      id: 'laserPower',
      label: 'Laser Power',
      type: 'number',
      value: 1000,
      unit: 'W',
      min: 50,
      max: 15000,
      step: 50,
      required: true,
      description: 'Laser power setting',
    },
    {
      id: 'cuttingMode',
      label: 'Cutting Mode',
      type: 'select',
      value: 'continuous',
      options: [
        { value: 'continuous', label: 'Continuous Wave (CW)' },
        { value: 'pulsed', label: 'Pulsed Mode' },
        { value: 'modulated', label: 'Modulated CW' },
      ],
      required: true,
      description: 'Laser operation mode',
    },
    {
      id: 'qualityPriority',
      label: 'Quality Priority',
      type: 'select',
      value: 'balanced',
      options: [
        { value: 'speed', label: 'Maximum Speed' },
        { value: 'balanced', label: 'Balanced Quality' },
        { value: 'precision', label: 'Precision Cut' },
        { value: 'minimal_heat', label: 'Minimal Heat Affected Zone' },
      ],
      required: true,
      description: 'Primary quality objective',
    },
    {
      id: 'assistGas',
      label: 'Assist Gas',
      type: 'select',
      value: 'air',
      options: [
        { value: 'oxygen', label: 'Oxygen (O₂)' },
        { value: 'nitrogen', label: 'Nitrogen (N₂)' },
        { value: 'air', label: 'Compressed Air' },
        { value: 'argon', label: 'Argon (Ar)' },
      ],
      required: true,
      description: 'Type of assist gas being used',
    },
  ],

  outputs: [
    {
      id: 'recommendedFrequency',
      label: 'Recommended Frequency',
      type: 'object',
      format: 'frequency-settings',
      description: 'Optimal frequency settings for the material and conditions',
    },
    {
      id: 'pulseCharacteristics',
      label: 'Pulse Characteristics',
      type: 'object',
      format: 'pulse-analysis',
      description: 'Pulse duration, energy, and overlap analysis',
    },
    {
      id: 'materialResponse',
      label: 'Material Response Analysis',
      type: 'object',
      format: 'material-response',
      description: 'Expected material behavior with recommended settings',
    },
    {
      id: 'alternativeSettings',
      label: 'Alternative Frequency Options',
      type: 'array',
      format: 'frequency-alternatives',
      description: 'Alternative frequency settings for different priorities',
    },
  ],

  calculate: (inputs: Record<string, any>) => {
    const {
      materialType,
      thickness,
      laserType,
      cuttingSpeed,
      laserPower,
      cuttingMode,
      qualityPriority,
      assistGas,
    } = inputs;

    // Calculate recommended frequency
    const recommendedFrequency = calculateOptimalFrequency(
      materialType,
      thickness,
      laserType,
      cuttingSpeed,
      cuttingMode,
      qualityPriority
    );

    // Calculate pulse characteristics
    const pulseCharacteristics = calculatePulseCharacteristics(
      recommendedFrequency,
      laserPower,
      cuttingSpeed,
      cuttingMode
    );

    // Analyze material response
    const materialResponse = analyzeMaterialResponse(
      materialType,
      thickness,
      recommendedFrequency,
      pulseCharacteristics
    );

    // Generate alternative settings
    const alternativeSettings = generateAlternativeFrequencies(
      recommendedFrequency,
      materialType,
      qualityPriority
    );

    return {
      recommendedFrequency,
      pulseCharacteristics,
      materialResponse,
      alternativeSettings,
    };
  },

  validation: {
    thickness: {
      min: 0.1,
      max: 50,
      message: 'Thickness must be between 0.1mm and 50mm',
    },
    cuttingSpeed: {
      min: 100,
      max: 15000,
      message: 'Cutting speed must be between 100 and 15000 mm/min',
    },
    laserPower: {
      min: 50,
      max: 15000,
      message: 'Laser power must be between 50W and 15000W',
    },
  },

  examples: [
    {
      name: '3mm Acrylic Cutting',
      description: 'CO₂ laser cutting of 3mm acrylic sheet',
      inputs: {
        materialType: 'acrylic',
        thickness: 3,
        laserType: 'co2',
        cuttingSpeed: 1200,
        laserPower: 80,
        cuttingMode: 'continuous',
        qualityPriority: 'precision',
        assistGas: 'air',
      },
    },
    {
      name: '2mm Steel Pulsed Cutting',
      description: 'Fiber laser pulsed cutting of thin steel',
      inputs: {
        materialType: 'carbon_steel',
        thickness: 2,
        laserType: 'fiber',
        cuttingSpeed: 4000,
        laserPower: 500,
        cuttingMode: 'pulsed',
        qualityPriority: 'minimal_heat',
        assistGas: 'nitrogen',
      },
    },
  ],

  tags: ['frequency', 'pulse', 'modulation', 'quality', 'heat'],
  
  relatedCalculators: [
    'power-speed-matching',
    'focus-height',
    'quality-grade',
    'multiple-pass',
  ],

  learningResources: [
    {
      title: 'Laser Frequency Fundamentals',
      type: 'article',
      url: '/learn/laser-frequency-basics',
    },
    {
      title: 'Pulse Mode Optimization',
      type: 'video',
      url: '/learn/pulse-mode-optimization',
    },
  ],
};

// Helper functions
function calculateOptimalFrequency(
  materialType: string,
  thickness: number,
  laserType: string,
  cuttingSpeed: number,
  cuttingMode: string,
  qualityPriority: string
) {
  // Base frequencies by material type and laser
  const baseFrequencies = {
    // Metals - typically higher frequencies
    carbon_steel: { fiber: 20000, co2: 5000, nd_yag: 15000, diode: 10000 },
    stainless_steel: { fiber: 20000, co2: 5000, nd_yag: 15000, diode: 10000 },
    aluminum: { fiber: 20000, co2: 2000, nd_yag: 15000, diode: 8000 },
    copper: { fiber: 20000, co2: 1000, nd_yag: 12000, diode: 6000 },
    brass: { fiber: 18000, co2: 2000, nd_yag: 12000, diode: 8000 },
    titanium: { fiber: 15000, co2: 3000, nd_yag: 12000, diode: 8000 },
    
    // Plastics - medium frequencies
    acrylic: { fiber: 5000, co2: 1000, nd_yag: 3000, diode: 2000 },
    polycarbonate: { fiber: 8000, co2: 1500, nd_yag: 5000, diode: 3000 },
    
    // Wood materials - lower frequencies
    wood_hardwood: { fiber: 2000, co2: 500, nd_yag: 1500, diode: 1000 },
    wood_softwood: { fiber: 1500, co2: 300, nd_yag: 1000, diode: 800 },
    plywood: { fiber: 2500, co2: 600, nd_yag: 2000, diode: 1200 },
    mdf: { fiber: 3000, co2: 800, nd_yag: 2500, diode: 1500 },
    
    // Other materials
    cardboard: { fiber: 1000, co2: 200, nd_yag: 800, diode: 500 },
    fabric: { fiber: 500, co2: 100, nd_yag: 400, diode: 300 },
  };

  let baseFreq = baseFrequencies[materialType]?.[laserType] || 5000;

  // Adjust for thickness
  const thicknessAdjustment = Math.pow(thickness, -0.3); // Higher frequency for thinner materials
  baseFreq *= thicknessAdjustment;

  // Adjust for cutting speed
  const speedAdjustment = Math.sqrt(cuttingSpeed / 3000); // Higher frequency for higher speeds
  baseFreq *= speedAdjustment;

  // Adjust for quality priority
  const qualityAdjustments = {
    speed: 1.2,           // Higher frequency for speed
    balanced: 1.0,        // Standard frequency
    precision: 0.8,       // Lower frequency for precision
    minimal_heat: 0.6,    // Much lower frequency to reduce heat
  };
  baseFreq *= qualityAdjustments[qualityPriority] || 1.0;

  // Adjust for cutting mode
  if (cuttingMode === 'continuous') {
    baseFreq = 0; // CW mode
  } else if (cuttingMode === 'modulated') {
    baseFreq *= 0.5; // Lower frequency for modulated CW
  }

  const finalFrequency = Math.round(baseFreq);

  return {
    frequency: finalFrequency,
    unit: finalFrequency > 0 ? 'Hz' : 'CW',
    mode: cuttingMode,
    reasoning: generateFrequencyReasoning(materialType, thickness, qualityPriority, cuttingMode),
    range: calculateFrequencyRange(finalFrequency),
  };
}

function calculatePulseCharacteristics(frequency: any, laserPower: number, cuttingSpeed: number, cuttingMode: string) {
  if (frequency.frequency === 0 || cuttingMode === 'continuous') {
    return {
      mode: 'Continuous Wave',
      pulseDuration: 'N/A',
      pulseEnergy: 'N/A',
      peakPower: laserPower,
      averagePower: laserPower,
      dutyCycle: 100,
    };
  }

  // Calculate pulse characteristics for pulsed mode
  const freq = frequency.frequency;
  const pulseDuration = calculateOptimalPulseDuration(freq, cuttingSpeed);
  const dutyCycle = Math.min(95, pulseDuration * freq * 100); // Percentage
  const averagePower = laserPower * (dutyCycle / 100);
  const pulseEnergy = averagePower / freq; // Joules per pulse
  const peakPower = pulseEnergy / (pulseDuration / 1000000); // Peak power in watts

  return {
    mode: 'Pulsed',
    pulseDuration: Math.round(pulseDuration * 10) / 10, // microseconds
    pulseEnergy: Math.round(pulseEnergy * 1000000) / 1000000, // mJ
    peakPower: Math.round(peakPower),
    averagePower: Math.round(averagePower),
    dutyCycle: Math.round(dutyCycle * 10) / 10,
  };
}

function calculateOptimalPulseDuration(frequency: number, cuttingSpeed: number) {
  // Base pulse duration calculation
  const baseDuration = 1000000 / frequency; // microseconds (1/freq)
  
  // Adjust for cutting speed - faster speeds need shorter pulses
  const speedFactor = Math.sqrt(3000 / cuttingSpeed);
  
  // Typical pulse duration is 10-80% of the period
  const optimalDuration = baseDuration * 0.5 * speedFactor;
  
  return Math.max(1, Math.min(optimalDuration, baseDuration * 0.8));
}

function analyzeMaterialResponse(materialType: string, thickness: number, frequency: any, pulseChar: any) {
  const materialProperties = {
    carbon_steel: { thermalConductivity: 50, meltingPoint: 1538, heatCapacity: 0.49 },
    stainless_steel: { thermalConductivity: 16, meltingPoint: 1400, heatCapacity: 0.50 },
    aluminum: { thermalConductivity: 237, meltingPoint: 660, heatCapacity: 0.90 },
    acrylic: { thermalConductivity: 0.2, meltingPoint: 160, heatCapacity: 1.47 },
    wood_hardwood: { thermalConductivity: 0.16, meltingPoint: 300, heatCapacity: 1.76 },
  };

  const material = materialProperties[materialType] || materialProperties.carbon_steel;
  
  // Calculate heat affected zone
  const heatAffectedZone = calculateHAZ(material, frequency, pulseChar, thickness);
  
  // Predict cut quality
  const cutQuality = predictCutQuality(materialType, frequency, pulseChar);
  
  // Calculate processing efficiency
  const efficiency = calculateProcessingEfficiency(frequency, pulseChar, material);

  return {
    heatAffectedZone,
    cutQuality,
    efficiency,
    thermalEffects: analyzeThermalEffects(material, frequency, pulseChar),
  };
}

function calculateHAZ(material: any, frequency: any, pulseChar: any, thickness: number) {
  let hazWidth = 0.1; // Base HAZ width in mm
  
  if (frequency.frequency === 0) {
    // Continuous wave - larger HAZ
    hazWidth = 0.2 + (thickness * 0.05);
  } else {
    // Pulsed mode - smaller HAZ
    hazWidth = 0.05 + (thickness * 0.02);
    hazWidth *= (pulseChar.dutyCycle / 100); // Reduce HAZ with lower duty cycle
  }
  
  // Adjust for material thermal conductivity
  hazWidth *= Math.sqrt(material.thermalConductivity / 50);
  
  return {
    width: Math.round(hazWidth * 100) / 100,
    unit: 'mm',
    quality: hazWidth < 0.1 ? 'Excellent' : hazWidth < 0.2 ? 'Good' : 'Fair',
  };
}

function predictCutQuality(materialType: string, frequency: any, pulseChar: any) {
  let qualityScore = 80; // Base quality score
  
  if (frequency.frequency === 0) {
    // Continuous wave
    if (materialType.includes('metal')) {
      qualityScore += 5; // Good for metals
    } else {
      qualityScore -= 10; // May cause burning in organics
    }
  } else {
    // Pulsed mode
    if (materialType.includes('wood') || materialType === 'acrylic') {
      qualityScore += 10; // Excellent for heat-sensitive materials
    }
    
    if (pulseChar.dutyCycle < 50) {
      qualityScore += 5; // Lower duty cycle = better quality
    }
  }
  
  return {
    score: Math.max(60, Math.min(100, qualityScore)),
    edgeQuality: qualityScore > 85 ? 'Excellent' : qualityScore > 75 ? 'Good' : 'Fair',
    expectedFeatures: generateQualityFeatures(materialType, frequency, qualityScore),
  };
}

function calculateProcessingEfficiency(frequency: any, pulseChar: any, material: any) {
  let efficiency = 70; // Base efficiency percentage
  
  if (frequency.frequency === 0) {
    efficiency = 85; // CW is generally more efficient
  } else {
    efficiency = 60 + (pulseChar.dutyCycle * 0.3); // Higher duty cycle = higher efficiency
  }
  
  return {
    overall: Math.round(efficiency),
    energyUtilization: Math.round(efficiency * 0.9),
    materialRemovalRate: Math.round(efficiency * 1.1),
  };
}

function analyzeThermalEffects(material: any, frequency: any, pulseChar: any) {
  const effects = [];
  
  if (frequency.frequency === 0) {
    effects.push('Continuous heating may cause thermal stress');
    if (material.thermalConductivity > 100) {
      effects.push('High thermal conductivity requires higher power');
    }
  } else {
    effects.push('Pulsed mode allows cooling between pulses');
    if (pulseChar.dutyCycle < 30) {
      effects.push('Low duty cycle minimizes heat buildup');
    }
  }
  
  return effects;
}

function generateFrequencyReasoning(materialType: string, thickness: number, qualityPriority: string, cuttingMode: string) {
  const reasons = [];
  
  if (cuttingMode === 'continuous') {
    reasons.push('Continuous wave mode selected for maximum power delivery');
  } else {
    reasons.push('Pulsed mode allows precise energy control and heat management');
  }
  
  if (materialType.includes('wood') || materialType === 'acrylic') {
    reasons.push('Lower frequency reduces heat affected zone in organic materials');
  }
  
  if (materialType.includes('steel') || materialType.includes('metal')) {
    reasons.push('Higher frequency optimizes metal cutting efficiency');
  }
  
  if (qualityPriority === 'minimal_heat') {
    reasons.push('Reduced frequency minimizes thermal effects');
  }
  
  return reasons;
}

function calculateFrequencyRange(frequency: number) {
  if (frequency === 0) {
    return { min: 0, max: 0, note: 'Continuous Wave mode' };
  }
  
  const tolerance = 0.2; // ±20% tolerance
  return {
    min: Math.round(frequency * (1 - tolerance)),
    max: Math.round(frequency * (1 + tolerance)),
    note: 'Acceptable frequency range for fine-tuning',
  };
}

function generateAlternativeFrequencies(recommended: any, materialType: string, qualityPriority: string) {
  if (recommended.frequency === 0) {
    return [
      {
        name: 'Low Frequency Pulsed',
        frequency: 1000,
        application: 'Minimal heat affected zone',
        tradeoff: 'Slower cutting speed',
      },
      {
        name: 'Medium Frequency Pulsed',
        frequency: 5000,
        application: 'Balanced approach',
        tradeoff: 'Moderate heat effects',
      },
    ];
  }
  
  return [
    {
      name: 'High Speed Option',
      frequency: Math.round(recommended.frequency * 1.5),
      application: 'Faster cutting',
      tradeoff: 'Increased heat affected zone',
    },
    {
      name: 'High Quality Option',
      frequency: Math.round(recommended.frequency * 0.7),
      application: 'Superior edge quality',
      tradeoff: 'Reduced cutting speed',
    },
    {
      name: 'Continuous Wave',
      frequency: 0,
      application: 'Maximum power efficiency',
      tradeoff: 'Larger heat affected zone',
    },
  ];
}

function generateQualityFeatures(materialType: string, frequency: any, qualityScore: number) {
  const features = [];
  
  if (qualityScore > 85) {
    features.push('Smooth edge finish');
    features.push('Minimal dross formation');
  }
  
  if (frequency.frequency > 0) {
    features.push('Reduced heat affected zone');
    if (materialType.includes('wood') || materialType === 'acrylic') {
      features.push('Minimal burning or charring');
    }
  }
  
  if (qualityScore > 75) {
    features.push('Good dimensional accuracy');
    features.push('Consistent kerf width');
  }
  
  return features;
}

export default frequencySettingConfig;
