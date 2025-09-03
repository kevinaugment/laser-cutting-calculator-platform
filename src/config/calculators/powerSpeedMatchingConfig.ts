import { CalculatorConfig } from '../../types/calculator';

export const powerSpeedMatchingConfig: CalculatorConfig = {
  id: 'power-speed-matching',
  name: 'Power-Speed Matching Calculator',
  description: 'Optimize laser power and cutting speed combinations for different materials and thicknesses to achieve optimal cut quality and efficiency.',
  category: 'parameters-settings',
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
        { value: 'acrylic', label: 'Acrylic' },
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
      ],
      required: true,
      description: 'Type of laser system being used',
    },
    {
      id: 'maxPower',
      label: 'Maximum Laser Power',
      type: 'number',
      value: 1000,
      unit: 'W',
      min: 50,
      max: 15000,
      step: 50,
      required: true,
      description: 'Maximum available laser power',
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
        { value: 'mirror', label: 'Mirror Finish' },
      ],
      required: true,
      description: 'Required cut quality level',
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
        { value: 'argon', label: 'Argon (Ar)' },
      ],
      required: true,
      description: 'Type of assist gas to be used',
    },
    {
      id: 'priorityGoal',
      label: 'Optimization Priority',
      type: 'select',
      value: 'balanced',
      options: [
        { value: 'speed', label: 'Maximum Speed' },
        { value: 'quality', label: 'Best Quality' },
        { value: 'balanced', label: 'Balanced Approach' },
        { value: 'efficiency', label: 'Energy Efficiency' },
      ],
      required: true,
      description: 'Primary optimization goal',
    },
  ],

  outputs: [
    {
      id: 'recommendedSettings',
      label: 'Recommended Power-Speed Settings',
      type: 'object',
      format: 'power-speed-table',
      description: 'Optimized power and speed combinations',
    },
    {
      id: 'qualityPrediction',
      label: 'Expected Cut Quality',
      type: 'object',
      format: 'quality-analysis',
      description: 'Predicted cut quality metrics',
    },
    {
      id: 'alternativeSettings',
      label: 'Alternative Settings',
      type: 'array',
      format: 'settings-alternatives',
      description: 'Alternative power-speed combinations',
    },
    {
      id: 'optimizationTips',
      label: 'Optimization Tips',
      type: 'array',
      format: 'tip-list',
      description: 'Tips for further optimization',
    },
  ],

  calculate: (inputs: Record<string, any>) => {
    const {
      materialType,
      thickness,
      laserType,
      maxPower,
      qualityRequirement,
      assistGas,
      priorityGoal,
    } = inputs;

    // Material-specific cutting parameters database
    const materialParams = getMaterialParameters(materialType, laserType, assistGas);
    
    // Calculate optimal power-speed combinations
    const recommendedSettings = calculateOptimalSettings(
      materialParams,
      thickness,
      maxPower,
      qualityRequirement,
      priorityGoal
    );

    // Predict cut quality
    const qualityPrediction = predictCutQuality(
      recommendedSettings,
      materialType,
      thickness,
      assistGas
    );

    // Generate alternative settings
    const alternativeSettings = generateAlternatives(
      recommendedSettings,
      materialParams,
      thickness,
      maxPower
    );

    // Generate optimization tips
    const optimizationTips = generateOptimizationTips(
      materialType,
      thickness,
      laserType,
      recommendedSettings
    );

    return {
      recommendedSettings,
      qualityPrediction,
      alternativeSettings,
      optimizationTips,
    };
  },

  validation: {
    thickness: {
      min: 0.1,
      max: 50,
      message: 'Thickness must be between 0.1mm and 50mm',
    },
    maxPower: {
      min: 50,
      max: 15000,
      message: 'Laser power must be between 50W and 15000W',
    },
  },

  examples: [
    {
      name: '3mm Steel Standard Cut',
      description: 'Standard quality cut for 3mm carbon steel',
      inputs: {
        materialType: 'carbon_steel',
        thickness: 3,
        laserType: 'fiber',
        maxPower: 1000,
        qualityRequirement: 'standard',
        assistGas: 'oxygen',
        priorityGoal: 'balanced',
      },
    },
    {
      name: '5mm Stainless Precision',
      description: 'Precision cut for 5mm stainless steel',
      inputs: {
        materialType: 'stainless_steel',
        thickness: 5,
        laserType: 'fiber',
        maxPower: 2000,
        qualityRequirement: 'precision',
        assistGas: 'nitrogen',
        priorityGoal: 'quality',
      },
    },
  ],

  tags: ['power', 'speed', 'optimization', 'parameters', 'cutting'],
  
  relatedCalculators: [
    'parameter-optimizer',
    'quality-grade',
    'gas-pressure-setting',
    'focus-height',
  ],

  learningResources: [
    {
      title: 'Power-Speed Optimization Guide',
      type: 'article',
      url: '/learn/power-speed-optimization',
    },
    {
      title: 'Material-Specific Cutting Parameters',
      type: 'video',
      url: '/learn/material-parameters',
    },
  ],
};

// Helper functions
function getMaterialParameters(materialType: string, laserType: string, assistGas: string) {
  // Material parameter database
  const params = {
    carbon_steel: {
      fiber: {
        oxygen: { basePower: 0.8, baseSpeed: 3000, qualityFactor: 0.85 },
        nitrogen: { basePower: 1.2, baseSpeed: 2000, qualityFactor: 0.95 },
        air: { basePower: 1.0, baseSpeed: 2500, qualityFactor: 0.75 },
      },
    },
    stainless_steel: {
      fiber: {
        nitrogen: { basePower: 1.0, baseSpeed: 2500, qualityFactor: 0.90 },
        oxygen: { basePower: 0.9, baseSpeed: 2800, qualityFactor: 0.80 },
      },
    },
    aluminum: {
      fiber: {
        nitrogen: { basePower: 1.1, baseSpeed: 4000, qualityFactor: 0.85 },
        air: { basePower: 1.3, baseSpeed: 3500, qualityFactor: 0.75 },
      },
    },
    acrylic: {
      co2: {
        air: { basePower: 0.3, baseSpeed: 1000, qualityFactor: 0.95 },
      },
    },
  };

  return params[materialType]?.[laserType]?.[assistGas] || 
         { basePower: 1.0, baseSpeed: 2000, qualityFactor: 0.80 };
}

function calculateOptimalSettings(materialParams: any, thickness: number, maxPower: number, quality: string, priority: string) {
  const thicknessFactor = Math.pow(thickness, 1.2);
  const qualityFactors = {
    rough: { powerMult: 1.2, speedMult: 1.5 },
    standard: { powerMult: 1.0, speedMult: 1.0 },
    precision: { powerMult: 0.8, speedMult: 0.7 },
    mirror: { powerMult: 0.6, speedMult: 0.5 },
  };

  const qf = qualityFactors[quality] || qualityFactors.standard;
  
  let optimalPower = Math.min(
    materialParams.basePower * thicknessFactor * qf.powerMult * 100,
    maxPower
  );
  
  let optimalSpeed = materialParams.baseSpeed * qf.speedMult / Math.sqrt(thickness);

  // Adjust based on priority
  if (priority === 'speed') {
    optimalPower = Math.min(optimalPower * 1.2, maxPower);
    optimalSpeed *= 1.3;
  } else if (priority === 'quality') {
    optimalPower *= 0.8;
    optimalSpeed *= 0.7;
  } else if (priority === 'efficiency') {
    optimalPower *= 0.9;
    optimalSpeed *= 1.1;
  }

  return {
    power: Math.round(optimalPower),
    speed: Math.round(optimalSpeed),
    powerPercentage: Math.round((optimalPower / maxPower) * 100),
    efficiency: calculateEfficiency(optimalPower, optimalSpeed, thickness),
  };
}

function predictCutQuality(settings: any, materialType: string, thickness: number, assistGas: string) {
  const baseQuality = 85;
  const powerFactor = settings.powerPercentage > 80 ? -5 : 0;
  const speedFactor = settings.speed > 5000 ? -3 : 0;
  const thicknessFactor = thickness > 10 ? -2 : 0;
  
  const qualityScore = baseQuality + powerFactor + speedFactor + thicknessFactor;
  
  return {
    overallScore: Math.max(60, Math.min(100, qualityScore)),
    edgeQuality: qualityScore > 85 ? 'Excellent' : qualityScore > 75 ? 'Good' : 'Fair',
    expectedKerf: (0.1 + thickness * 0.02).toFixed(2),
    surfaceRoughness: qualityScore > 85 ? 'Ra 1.6' : 'Ra 3.2',
  };
}

function generateAlternatives(recommended: any, materialParams: any, thickness: number, maxPower: number) {
  return [
    {
      name: 'High Speed Option',
      power: Math.min(recommended.power * 1.2, maxPower),
      speed: recommended.speed * 1.4,
      tradeoff: 'Faster cutting, slightly lower quality',
    },
    {
      name: 'High Quality Option',
      power: recommended.power * 0.8,
      speed: recommended.speed * 0.7,
      tradeoff: 'Better edge quality, slower cutting',
    },
    {
      name: 'Energy Efficient Option',
      power: recommended.power * 0.9,
      speed: recommended.speed * 1.1,
      tradeoff: 'Lower energy consumption, good balance',
    },
  ];
}

function generateOptimizationTips(materialType: string, thickness: number, laserType: string, settings: any) {
  const tips = [];
  
  if (settings.powerPercentage > 90) {
    tips.push('Consider reducing power slightly to extend laser life');
  }
  
  if (thickness > 10) {
    tips.push('For thick materials, consider multiple passes for better quality');
  }
  
  if (materialType === 'stainless_steel') {
    tips.push('Use nitrogen assist gas for oxide-free cuts');
  }
  
  if (laserType === 'co2' && materialType.includes('steel')) {
    tips.push('Fiber laser would be more efficient for this material');
  }
  
  return tips;
}

function calculateEfficiency(power: number, speed: number, thickness: number) {
  return Math.round((speed * thickness) / (power / 1000));
}

export default powerSpeedMatchingConfig;
