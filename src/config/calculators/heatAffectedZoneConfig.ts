import { CalculatorConfig } from '../../types/calculator';

export const heatAffectedZoneConfig: CalculatorConfig = {
  id: 'heat-affected-zone',
  name: 'Heat Affected Zone Calculator',
  description: 'Calculate and minimize heat affected zone (HAZ) width to prevent material property changes and thermal distortion.',
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
        { value: 'titanium', label: 'Titanium' },
        { value: 'tool_steel', label: 'Tool Steel' },
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
    {
      id: 'beamDiameter',
      label: 'Focused Beam Diameter',
      type: 'number',
      value: 0.1,
      unit: 'mm',
      min: 0.05,
      max: 1.0,
      step: 0.01,
      required: true,
      description: 'Focused laser beam diameter',
    },
    {
      id: 'hazRequirement',
      label: 'HAZ Requirement',
      type: 'select',
      value: 'standard',
      options: [
        { value: 'minimal', label: 'Minimal HAZ (Critical applications)' },
        { value: 'standard', label: 'Standard HAZ (General use)' },
        { value: 'acceptable', label: 'Acceptable HAZ (Non-critical)' },
      ],
      required: true,
      description: 'Required HAZ control level',
    },
  ],

  outputs: [
    {
      id: 'hazAnalysis',
      label: 'HAZ Analysis',
      type: 'object',
      format: 'haz-analysis',
      description: 'Heat affected zone width and characteristics',
    },
    {
      id: 'thermalEffects',
      label: 'Thermal Effects',
      type: 'object',
      format: 'thermal-analysis',
      description: 'Thermal impact on material properties',
    },
    {
      id: 'optimizedParameters',
      label: 'HAZ-Optimized Parameters',
      type: 'object',
      format: 'optimized-params',
      description: 'Parameters optimized for minimal HAZ',
    },
    {
      id: 'recommendations',
      label: 'HAZ Minimization Recommendations',
      type: 'array',
      format: 'haz-recommendations',
      description: 'Strategies to minimize heat affected zone',
    },
  ],

  calculate: (inputs: Record<string, any>) => {
    const {
      materialType,
      thickness,
      laserPower,
      cuttingSpeed,
      pulseFrequency,
      beamDiameter,
      hazRequirement,
    } = inputs;

    // Calculate HAZ characteristics
    const hazAnalysis = calculateHAZ(
      materialType,
      thickness,
      laserPower,
      cuttingSpeed,
      pulseFrequency,
      beamDiameter
    );

    // Analyze thermal effects
    const thermalEffects = analyzeThermalEffects(
      hazAnalysis,
      materialType,
      laserPower,
      cuttingSpeed
    );

    // Calculate optimized parameters
    const optimizedParameters = optimizeForHAZ(
      hazAnalysis,
      materialType,
      thickness,
      hazRequirement,
      inputs
    );

    // Generate recommendations
    const recommendations = generateHAZRecommendations(
      hazAnalysis,
      thermalEffects,
      hazRequirement,
      inputs
    );

    return {
      hazAnalysis,
      thermalEffects,
      optimizedParameters,
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
    beamDiameter: {
      min: 0.05,
      max: 1.0,
      message: 'Beam diameter must be between 0.05mm and 1.0mm',
    },
  },

  examples: [
    {
      name: 'Precision Tool Steel',
      description: 'Minimal HAZ for precision tool steel cutting',
      inputs: {
        materialType: 'tool_steel',
        thickness: 3,
        laserPower: 800,
        cuttingSpeed: 1500,
        pulseFrequency: 20000,
        beamDiameter: 0.08,
        hazRequirement: 'minimal',
      },
    },
    {
      name: 'Thick Stainless Steel',
      description: 'HAZ control for thick stainless steel',
      inputs: {
        materialType: 'stainless_steel',
        thickness: 12,
        laserPower: 3000,
        cuttingSpeed: 1200,
        pulseFrequency: 0,
        beamDiameter: 0.15,
        hazRequirement: 'standard',
      },
    },
  ],

  tags: ['haz', 'thermal', 'heat', 'distortion', 'metallurgy'],
  
  relatedCalculators: [
    'edge-quality-predictor',
    'frequency-setting',
    'power-speed-matching',
    'thermal-distortion',
  ],

  learningResources: [
    {
      title: 'Heat Affected Zone Fundamentals',
      type: 'article',
      url: '/learn/haz-fundamentals',
    },
    {
      title: 'Thermal Management in Laser Cutting',
      type: 'video',
      url: '/learn/thermal-management',
    },
  ],
};

// Helper functions
function calculateHAZ(
  materialType: string,
  thickness: number,
  laserPower: number,
  cuttingSpeed: number,
  pulseFrequency: number,
  beamDiameter: number
) {
  // Get material thermal properties
  const thermalProps = getMaterialThermalProperties(materialType);
  
  // Calculate heat input per unit length
  const heatInput = (laserPower * 60) / cuttingSpeed; // J/mm
  
  // Calculate HAZ width using thermal diffusion model
  let hazWidth = Math.sqrt((heatInput * thermalProps.diffusivity) / 
                          (Math.PI * thermalProps.conductivity * thickness));
  
  // Adjust for beam diameter
  hazWidth = Math.max(hazWidth, beamDiameter * 2);
  
  // Pulse frequency effects
  if (pulseFrequency > 0) {
    const dutyCycle = calculateDutyCycle(pulseFrequency, cuttingSpeed);
    hazWidth *= Math.sqrt(dutyCycle / 100); // Pulsed mode reduces HAZ
  }
  
  // Material-specific adjustments
  const materialFactors = {
    carbon_steel: 1.0,
    stainless_steel: 1.2,
    aluminum: 0.8,
    copper: 1.5,
    titanium: 0.9,
    tool_steel: 1.1,
  };
  
  hazWidth *= materialFactors[materialType] || 1.0;
  
  return {
    width: Math.round(hazWidth * 1000) / 1000, // mm
    depth: Math.round(hazWidth * 0.7 * 1000) / 1000, // Depth is typically 70% of width
    heatInput: Math.round(heatInput),
    classification: classifyHAZ(hazWidth),
    acceptability: assessHAZAcceptability(hazWidth, materialType),
  };
}

function getMaterialThermalProperties(materialType: string) {
  const properties = {
    carbon_steel: {
      conductivity: 50, // W/m·K
      diffusivity: 1.3e-5, // m²/s
      specificHeat: 490, // J/kg·K
      density: 7850, // kg/m³
    },
    stainless_steel: {
      conductivity: 16,
      diffusivity: 4.2e-6,
      specificHeat: 500,
      density: 8000,
    },
    aluminum: {
      conductivity: 237,
      diffusivity: 9.7e-5,
      specificHeat: 900,
      density: 2700,
    },
    copper: {
      conductivity: 401,
      diffusivity: 1.1e-4,
      specificHeat: 385,
      density: 8960,
    },
    titanium: {
      conductivity: 22,
      diffusivity: 9.8e-6,
      specificHeat: 520,
      density: 4500,
    },
    tool_steel: {
      conductivity: 25,
      diffusivity: 6.5e-6,
      specificHeat: 460,
      density: 7800,
    },
  };
  
  return properties[materialType] || properties.carbon_steel;
}

function calculateDutyCycle(frequency: number, cuttingSpeed: number) {
  // Estimate duty cycle based on frequency and speed
  const pulsePeriod = 1 / frequency; // seconds
  const pulseWidth = Math.min(pulsePeriod * 0.5, 0.0001); // Max 100μs
  return (pulseWidth * frequency) * 100; // Percentage
}

function classifyHAZ(width: number) {
  if (width < 0.05) return 'Minimal';
  if (width < 0.1) return 'Very Small';
  if (width < 0.2) return 'Small';
  if (width < 0.4) return 'Moderate';
  return 'Large';
}

function assessHAZAcceptability(width: number, materialType: string) {
  const limits = {
    tool_steel: 0.1,
    titanium: 0.15,
    stainless_steel: 0.2,
    carbon_steel: 0.25,
    aluminum: 0.3,
    copper: 0.4,
  };
  
  const limit = limits[materialType] || 0.2;
  
  if (width <= limit * 0.5) return 'Excellent';
  if (width <= limit) return 'Acceptable';
  if (width <= limit * 1.5) return 'Marginal';
  return 'Unacceptable';
}

function analyzeThermalEffects(hazAnalysis: any, materialType: string, laserPower: number, cuttingSpeed: number) {
  const effects = [];
  const hazWidth = hazAnalysis.width;
  
  // Microstructural changes
  if (materialType.includes('steel')) {
    if (hazWidth > 0.2) {
      effects.push({
        type: 'Microstructural',
        description: 'Potential grain growth and hardness changes',
        severity: 'High',
      });
    } else if (hazWidth > 0.1) {
      effects.push({
        type: 'Microstructural',
        description: 'Minor microstructural changes',
        severity: 'Medium',
      });
    }
  }
  
  // Thermal stress
  const thermalStress = calculateThermalStress(laserPower, cuttingSpeed, materialType);
  if (thermalStress > 200) {
    effects.push({
      type: 'Mechanical',
      description: 'High thermal stress may cause distortion',
      severity: 'High',
    });
  }
  
  // Oxidation
  if (hazWidth > 0.15 && (materialType === 'titanium' || materialType === 'stainless_steel')) {
    effects.push({
      type: 'Chemical',
      description: 'Potential surface oxidation in HAZ',
      severity: 'Medium',
    });
  }
  
  return {
    effects,
    thermalStress: Math.round(thermalStress),
    coolingRate: calculateCoolingRate(laserPower, cuttingSpeed, materialType),
    temperatureProfile: estimateTemperatureProfile(hazAnalysis.width),
  };
}

function calculateThermalStress(laserPower: number, cuttingSpeed: number, materialType: string) {
  const heatInput = (laserPower * 60) / cuttingSpeed;
  const expansionCoefficients = {
    carbon_steel: 12e-6,
    stainless_steel: 17e-6,
    aluminum: 23e-6,
    copper: 17e-6,
    titanium: 8.6e-6,
    tool_steel: 11e-6,
  };
  
  const alpha = expansionCoefficients[materialType] || 12e-6;
  const deltaT = heatInput / 10; // Simplified temperature rise
  const elasticModulus = 200000; // MPa (typical for steel)
  
  return alpha * deltaT * elasticModulus;
}

function calculateCoolingRate(laserPower: number, cuttingSpeed: number, materialType: string) {
  const heatInput = (laserPower * 60) / cuttingSpeed;
  const thermalProps = getMaterialThermalProperties(materialType);
  
  // Simplified cooling rate calculation
  const coolingRate = (thermalProps.conductivity * 1000) / heatInput;
  
  return {
    rate: Math.round(coolingRate),
    unit: '°C/s',
    classification: coolingRate > 100 ? 'Fast' : coolingRate > 50 ? 'Medium' : 'Slow',
  };
}

function estimateTemperatureProfile(hazWidth: number) {
  const peakTemp = 1500 + (hazWidth * 2000); // Estimated peak temperature
  
  return {
    peakTemperature: Math.round(peakTemp),
    hazBoundaryTemp: 727, // A1 transformation temperature for steel
    gradientSteepness: hazWidth < 0.1 ? 'Steep' : 'Gradual',
  };
}

function optimizeForHAZ(hazAnalysis: any, materialType: string, thickness: number, hazRequirement: string, inputs: any) {
  const targetHAZ = getTargetHAZ(hazRequirement, materialType);
  const currentHAZ = hazAnalysis.width;
  
  if (currentHAZ <= targetHAZ) {
    return {
      status: 'Already Optimized',
      currentHAZ,
      targetHAZ,
      improvements: ['Current parameters are within acceptable HAZ limits'],
    };
  }
  
  // Calculate optimized parameters
  const reductionNeeded = (currentHAZ - targetHAZ) / currentHAZ;
  
  const optimizedPower = inputs.laserPower * (1 - reductionNeeded * 0.5);
  const optimizedSpeed = inputs.cuttingSpeed * (1 + reductionNeeded * 0.3);
  const recommendedFrequency = inputs.pulseFrequency === 0 ? 
    Math.min(20000, 5000 * thickness) : inputs.pulseFrequency * 1.5;
  
  return {
    status: 'Optimization Needed',
    currentHAZ,
    targetHAZ,
    optimizedPower: Math.round(optimizedPower),
    optimizedSpeed: Math.round(optimizedSpeed),
    recommendedFrequency: Math.round(recommendedFrequency),
    expectedHAZ: Math.round(targetHAZ * 1000) / 1000,
    improvements: [
      `Reduce power to ${Math.round(optimizedPower)}W`,
      `Increase speed to ${Math.round(optimizedSpeed)}mm/min`,
      `Use pulsed mode at ${Math.round(recommendedFrequency)}Hz`,
    ],
  };
}

function getTargetHAZ(requirement: string, materialType: string) {
  const targets = {
    minimal: {
      tool_steel: 0.05,
      titanium: 0.08,
      stainless_steel: 0.1,
      carbon_steel: 0.12,
      aluminum: 0.15,
      copper: 0.2,
    },
    standard: {
      tool_steel: 0.1,
      titanium: 0.15,
      stainless_steel: 0.2,
      carbon_steel: 0.25,
      aluminum: 0.3,
      copper: 0.4,
    },
    acceptable: {
      tool_steel: 0.2,
      titanium: 0.25,
      stainless_steel: 0.3,
      carbon_steel: 0.4,
      aluminum: 0.5,
      copper: 0.6,
    },
  };
  
  return targets[requirement]?.[materialType] || targets.standard[materialType] || 0.2;
}

function generateHAZRecommendations(hazAnalysis: any, thermalEffects: any, hazRequirement: string, inputs: any) {
  const recommendations = [];
  
  if (hazAnalysis.acceptability === 'Unacceptable') {
    recommendations.push({
      priority: 'Critical',
      category: 'Parameter Adjustment',
      suggestion: 'Reduce laser power and increase cutting speed',
      impact: 'Major HAZ reduction',
    });
  }
  
  if (inputs.pulseFrequency === 0 && hazRequirement === 'minimal') {
    recommendations.push({
      priority: 'High',
      category: 'Pulse Mode',
      suggestion: 'Switch to pulsed mode for minimal HAZ',
      impact: '30-50% HAZ reduction',
    });
  }
  
  if (thermalEffects.effects.some(e => e.severity === 'High')) {
    recommendations.push({
      priority: 'High',
      category: 'Thermal Management',
      suggestion: 'Implement active cooling or reduce heat input',
      impact: 'Prevent thermal damage',
    });
  }
  
  if (inputs.materialType.includes('steel') && hazAnalysis.width > 0.2) {
    recommendations.push({
      priority: 'Medium',
      category: 'Post-Processing',
      suggestion: 'Consider stress relief heat treatment',
      impact: 'Reduce residual stress',
    });
  }
  
  recommendations.push({
    priority: 'Low',
    category: 'Monitoring',
    suggestion: 'Regular HAZ measurement and documentation',
    impact: 'Quality assurance',
  });
  
  return recommendations;
}

export default heatAffectedZoneConfig;
