import { CalculatorConfig } from '../../types/calculator';

export const exhaustSystemConfig: CalculatorConfig = {
  id: 'exhaust-system',
  name: 'Exhaust System Calculator',
  description: 'Specialized calculator for automotive exhaust system components including pipes, flanges, and heat shields with thermal and corrosion resistance requirements.',
  category: 'automotive',
  difficulty: 'advanced',
  estimatedTime: '6-7 minutes',
  
  inputs: [
    {
      id: 'componentType',
      label: 'Exhaust Component Type',
      type: 'select',
      value: 'exhaust_pipe',
      options: [
        { value: 'exhaust_pipe', label: 'Exhaust Pipe Section' },
        { value: 'muffler_housing', label: 'Muffler Housing' },
        { value: 'catalytic_converter', label: 'Catalytic Converter Housing' },
        { value: 'exhaust_flange', label: 'Exhaust Flange' },
        { value: 'heat_shield', label: 'Heat Shield' },
        { value: 'resonator', label: 'Resonator Housing' },
        { value: 'tailpipe', label: 'Tailpipe Section' },
      ],
      required: true,
      description: 'Type of exhaust system component',
    },
    {
      id: 'materialGrade',
      label: 'Material Grade',
      type: 'select',
      value: 'stainless_409',
      options: [
        { value: 'mild_steel', label: 'Mild Steel (Aluminized)' },
        { value: 'stainless_409', label: 'Stainless Steel 409' },
        { value: 'stainless_304', label: 'Stainless Steel 304' },
        { value: 'stainless_316', label: 'Stainless Steel 316' },
        { value: 'stainless_321', label: 'Stainless Steel 321' },
        { value: 'inconel_625', label: 'Inconel 625 (High-temp)' },
        { value: 'hastelloy_x', label: 'Hastelloy X (Extreme-temp)' },
      ],
      required: true,
      description: 'Material grade for exhaust application',
    },
    {
      id: 'wallThickness',
      label: 'Wall Thickness',
      type: 'number',
      value: 1.5,
      unit: 'mm',
      min: 0.8,
      max: 6.0,
      step: 0.1,
      required: true,
      description: 'Wall thickness of exhaust component',
    },
    {
      id: 'pipeDiameter',
      label: 'Pipe Diameter (if applicable)',
      type: 'number',
      value: 60,
      unit: 'mm',
      min: 25,
      max: 200,
      step: 5,
      required: false,
      description: 'Internal diameter for pipe components',
    },
    {
      id: 'componentLength',
      label: 'Component Length',
      type: 'number',
      value: 500,
      unit: 'mm',
      min: 100,
      max: 2000,
      step: 10,
      required: true,
      description: 'Overall length of component',
    },
    {
      id: 'operatingTemperature',
      label: 'Operating Temperature',
      type: 'select',
      value: 'medium',
      options: [
        { value: 'low', label: 'Low (200-400°C)' },
        { value: 'medium', label: 'Medium (400-600°C)' },
        { value: 'high', label: 'High (600-800°C)' },
        { value: 'extreme', label: 'Extreme (800°C+)' },
      ],
      required: true,
      description: 'Expected operating temperature range',
    },
    {
      id: 'corrosionEnvironment',
      label: 'Corrosion Environment',
      type: 'select',
      value: 'moderate',
      options: [
        { value: 'mild', label: 'Mild (Dry climate, highway)' },
        { value: 'moderate', label: 'Moderate (Mixed conditions)' },
        { value: 'severe', label: 'Severe (Salt, moisture, city)' },
        { value: 'extreme', label: 'Extreme (Marine, industrial)' },
      ],
      required: true,
      description: 'Expected corrosion environment',
    },
    {
      id: 'cuttingComplexity',
      label: 'Cutting Complexity',
      type: 'select',
      value: 'moderate',
      options: [
        { value: 'simple', label: 'Simple (Straight cuts, basic shapes)' },
        { value: 'moderate', label: 'Moderate (Curves, holes, notches)' },
        { value: 'complex', label: 'Complex (Intricate patterns)' },
        { value: 'very_complex', label: 'Very Complex (Perforations, fine details)' },
      ],
      required: true,
      description: 'Complexity of cutting pattern',
    },
    {
      id: 'productionVolume',
      label: 'Production Volume',
      type: 'select',
      value: 'medium',
      options: [
        { value: 'prototype', label: 'Prototype (1-10 units)' },
        { value: 'low', label: 'Low Volume (10-100 units)' },
        { value: 'medium', label: 'Medium Volume (100-1000 units)' },
        { value: 'high', label: 'High Volume (1000+ units)' },
      ],
      required: true,
      description: 'Expected production volume',
    },
  ],

  outputs: [
    {
      id: 'thermalAnalysis',
      label: 'Thermal Analysis',
      type: 'object',
      format: 'exhaust-thermal-specs',
      description: 'Thermal performance and material behavior analysis',
    },
    {
      id: 'cuttingParameters',
      label: 'Cutting Parameters',
      type: 'object',
      format: 'exhaust-cutting-specs',
      description: 'Optimized cutting parameters for exhaust materials',
    },
    {
      id: 'durabilityAssessment',
      label: 'Durability Assessment',
      type: 'object',
      format: 'exhaust-durability-specs',
      description: 'Corrosion resistance and service life analysis',
    },
    {
      id: 'manufacturingCost',
      label: 'Manufacturing Cost',
      type: 'object',
      format: 'exhaust-cost-analysis',
      description: 'Comprehensive cost analysis for exhaust component manufacturing',
    },
  ],

  calculate: (inputs: Record<string, any>) => {
    const {
      componentType,
      materialGrade,
      wallThickness,
      pipeDiameter,
      componentLength,
      operatingTemperature,
      corrosionEnvironment,
      cuttingComplexity,
      productionVolume,
    } = inputs;

    // Analyze thermal performance
    const thermalAnalysis = analyzeThermalPerformance(
      materialGrade,
      wallThickness,
      operatingTemperature,
      componentType
    );

    // Calculate cutting parameters
    const cuttingParameters = calculateExhaustCuttingParameters(
      materialGrade,
      wallThickness,
      cuttingComplexity,
      componentType
    );

    // Assess durability
    const durabilityAssessment = assessExhaustDurability(
      materialGrade,
      operatingTemperature,
      corrosionEnvironment,
      wallThickness,
      componentType
    );

    // Calculate manufacturing costs
    const manufacturingCost = calculateExhaustManufacturingCost(
      componentLength,
      pipeDiameter || 100,
      wallThickness,
      materialGrade,
      cuttingComplexity,
      productionVolume,
      cuttingParameters
    );

    return {
      thermalAnalysis,
      cuttingParameters,
      durabilityAssessment,
      manufacturingCost,
    };
  },

  validation: {
    wallThickness: {
      min: 0.8,
      max: 6.0,
      message: 'Wall thickness must be between 0.8mm and 6.0mm for exhaust components',
    },
    pipeDiameter: {
      min: 25,
      max: 200,
      message: 'Pipe diameter must be between 25mm and 200mm',
    },
    componentLength: {
      min: 100,
      max: 2000,
      message: 'Component length must be between 100mm and 2000mm',
    },
  },

  examples: [
    {
      name: 'High-Performance Exhaust Pipe',
      description: 'Stainless steel exhaust pipe for performance application',
      inputs: {
        componentType: 'exhaust_pipe',
        materialGrade: 'stainless_304',
        wallThickness: 1.2,
        pipeDiameter: 76,
        componentLength: 800,
        operatingTemperature: 'high',
        corrosionEnvironment: 'moderate',
        cuttingComplexity: 'moderate',
        productionVolume: 'medium',
      },
    },
    {
      name: 'Catalytic Converter Housing',
      description: 'High-temperature catalytic converter housing',
      inputs: {
        componentType: 'catalytic_converter',
        materialGrade: 'stainless_321',
        wallThickness: 2.0,
        pipeDiameter: 100,
        componentLength: 300,
        operatingTemperature: 'extreme',
        corrosionEnvironment: 'severe',
        cuttingComplexity: 'complex',
        productionVolume: 'high',
      },
    },
  ],

  tags: ['automotive', 'exhaust', 'thermal', 'corrosion', 'stainless-steel'],
  
  relatedCalculators: [
    'thermal-analysis',
    'corrosion-resistance',
    'high-temperature-cutting',
    'stainless-steel-cutting',
  ],

  learningResources: [
    {
      title: 'Exhaust System Materials Guide',
      type: 'article',
      url: '/learn/exhaust-materials',
    },
    {
      title: 'High-Temperature Laser Cutting',
      type: 'video',
      url: '/learn/high-temp-cutting',
    },
  ],
};

// Helper functions
function analyzeThermalPerformance(
  materialGrade: string,
  wallThickness: number,
  operatingTemp: string,
  componentType: string
) {
  const materialProperties = getExhaustMaterialProperties(materialGrade);
  const thermalStress = calculateThermalStress(materialGrade, operatingTemp, wallThickness);
  const heatTransfer = calculateHeatTransfer(wallThickness, materialGrade, componentType);
  
  return {
    materialProperties,
    thermalStress,
    heatTransfer,
    temperatureRating: getTempRating(materialGrade, operatingTemp),
    thermalExpansion: calculateThermalExpansion(materialGrade, operatingTemp),
    oxidationResistance: getOxidationResistance(materialGrade, operatingTemp),
  };
}

function getExhaustMaterialProperties(materialGrade: string) {
  const materials = {
    mild_steel: {
      maxTemp: '400°C',
      thermalConductivity: '50 W/m·K',
      thermalExpansion: '12 × 10⁻⁶ /°C',
      oxidationResistance: 'Poor',
      corrosionResistance: 'Poor (requires coating)',
      cost: 'Low',
      applications: ['Low-temp sections', 'Cost-sensitive applications'],
    },
    stainless_409: {
      maxTemp: '650°C',
      thermalConductivity: '25 W/m·K',
      thermalExpansion: '11 × 10⁻⁶ /°C',
      oxidationResistance: 'Good',
      corrosionResistance: 'Good',
      cost: 'Medium',
      applications: ['Standard exhaust systems', 'Mufflers'],
    },
    stainless_304: {
      maxTemp: '800°C',
      thermalConductivity: '16 W/m·K',
      thermalExpansion: '17 × 10⁻⁶ /°C',
      oxidationResistance: 'Very Good',
      corrosionResistance: 'Very Good',
      cost: 'Medium-High',
      applications: ['Performance exhausts', 'Headers'],
    },
    stainless_316: {
      maxTemp: '850°C',
      thermalConductivity: '16 W/m·K',
      thermalExpansion: '16 × 10⁻⁶ /°C',
      oxidationResistance: 'Excellent',
      corrosionResistance: 'Excellent',
      cost: 'High',
      applications: ['Marine applications', 'Severe environments'],
    },
    stainless_321: {
      maxTemp: '900°C',
      thermalConductivity: '16 W/m·K',
      thermalExpansion: '16 × 10⁻⁶ /°C',
      oxidationResistance: 'Excellent',
      corrosionResistance: 'Excellent',
      cost: 'High',
      applications: ['High-temp sections', 'Catalytic converters'],
    },
    inconel_625: {
      maxTemp: '1000°C',
      thermalConductivity: '10 W/m·K',
      thermalExpansion: '13 × 10⁻⁶ /°C',
      oxidationResistance: 'Outstanding',
      corrosionResistance: 'Outstanding',
      cost: 'Very High',
      applications: ['Extreme temperature', 'Racing applications'],
    },
    hastelloy_x: {
      maxTemp: '1200°C',
      thermalConductivity: '9 W/m·K',
      thermalExpansion: '14 × 10⁻⁶ /°C',
      oxidationResistance: 'Outstanding',
      corrosionResistance: 'Outstanding',
      cost: 'Extremely High',
      applications: ['Aerospace', 'Extreme racing'],
    },
  };
  
  return materials[materialGrade] || materials.stainless_409;
}

function calculateThermalStress(materialGrade: string, operatingTemp: string, wallThickness: number) {
  const tempRanges = {
    low: 300,    // Average 300°C
    medium: 500, // Average 500°C
    high: 700,   // Average 700°C
    extreme: 900, // Average 900°C
  };
  
  const avgTemp = tempRanges[operatingTemp] || 500;
  const ambientTemp = 25; // Room temperature
  const deltaT = avgTemp - ambientTemp;
  
  // Thermal expansion coefficients (×10⁻⁶ /°C)
  const expansionCoeffs = {
    mild_steel: 12,
    stainless_409: 11,
    stainless_304: 17,
    stainless_316: 16,
    stainless_321: 16,
    inconel_625: 13,
    hastelloy_x: 14,
  };
  
  const expansionCoeff = expansionCoeffs[materialGrade] || 15;
  const thermalStrain = expansionCoeff * deltaT / 1000000;
  
  // Elastic modulus (GPa) at temperature
  const elasticModulus = getElasticModulusAtTemp(materialGrade, avgTemp);
  const thermalStress = thermalStrain * elasticModulus * 1000; // MPa
  
  return {
    operatingTemperature: avgTemp,
    temperatureDelta: deltaT,
    thermalStrain: Math.round(thermalStrain * 1000000),
    thermalStress: Math.round(thermalStress),
    stressLevel: getStressLevel(thermalStress, materialGrade),
    recommendations: getThermalStressRecommendations(thermalStress, materialGrade),
  };
}

function getElasticModulusAtTemp(materialGrade: string, temperature: number) {
  // Simplified temperature-dependent modulus
  const roomTempModulus = {
    mild_steel: 200,
    stainless_409: 200,
    stainless_304: 200,
    stainless_316: 200,
    stainless_321: 200,
    inconel_625: 208,
    hastelloy_x: 205,
  };
  
  const baseModulus = roomTempModulus[materialGrade] || 200;
  const tempReduction = (temperature - 25) * 0.0002; // Simplified reduction
  
  return Math.max(baseModulus * 0.5, baseModulus * (1 - tempReduction));
}

function getStressLevel(stress: number, materialGrade: string) {
  const yieldStrengths = {
    mild_steel: 250,
    stainless_409: 280,
    stainless_304: 210,
    stainless_316: 220,
    stainless_321: 240,
    inconel_625: 415,
    hastelloy_x: 345,
  };
  
  const yieldStrength = yieldStrengths[materialGrade] || 250;
  const stressRatio = stress / yieldStrength;
  
  if (stressRatio < 0.3) return 'Low';
  if (stressRatio < 0.6) return 'Moderate';
  if (stressRatio < 0.8) return 'High';
  return 'Critical';
}

function getThermalStressRecommendations(stress: number, materialGrade: string) {
  const recommendations = [];
  
  if (stress > 150) {
    recommendations.push('Consider expansion joints or flexible sections');
    recommendations.push('Use stress-relief heat treatment');
  }
  
  if (stress > 200) {
    recommendations.push('Upgrade to higher-grade material');
    recommendations.push('Increase wall thickness for better stress distribution');
  }
  
  if (['mild_steel', 'stainless_409'].includes(materialGrade) && stress > 100) {
    recommendations.push('Consider upgrading to 304 or 316 stainless steel');
  }
  
  return recommendations;
}

function calculateHeatTransfer(wallThickness: number, materialGrade: string, componentType: string) {
  const thermalConductivities = {
    mild_steel: 50,
    stainless_409: 25,
    stainless_304: 16,
    stainless_316: 16,
    stainless_321: 16,
    inconel_625: 10,
    hastelloy_x: 9,
  };
  
  const k = thermalConductivities[materialGrade] || 20; // W/m·K
  const thickness = wallThickness / 1000; // Convert to meters
  
  // Simplified heat transfer calculation
  const thermalResistance = thickness / k;
  const heatFlux = 1000 / thermalResistance; // Assuming 1000°C temperature difference
  
  return {
    thermalConductivity: k,
    thermalResistance: Math.round(thermalResistance * 10000) / 10000,
    heatFlux: Math.round(heatFlux),
    insulationEffect: getInsulationEffect(thermalResistance),
    heatShieldRecommendation: getHeatShieldRecommendation(componentType, heatFlux),
  };
}

function getInsulationEffect(resistance: number) {
  if (resistance > 0.0001) return 'Good insulation properties';
  if (resistance > 0.00005) return 'Moderate insulation properties';
  return 'Poor insulation properties';
}

function getHeatShieldRecommendation(componentType: string, heatFlux: number) {
  if (componentType === 'heat_shield') {
    return 'Component is designed as heat shield';
  }
  
  if (heatFlux > 50000) {
    return 'Heat shield recommended for surrounding components';
  } else if (heatFlux > 30000) {
    return 'Consider heat shield for sensitive nearby components';
  }
  
  return 'Heat shield not required';
}

function getTempRating(materialGrade: string, operatingTemp: string) {
  const materialMaxTemps = {
    mild_steel: 400,
    stainless_409: 650,
    stainless_304: 800,
    stainless_316: 850,
    stainless_321: 900,
    inconel_625: 1000,
    hastelloy_x: 1200,
  };
  
  const operatingTemps = {
    low: 400,
    medium: 600,
    high: 800,
    extreme: 1000,
  };
  
  const maxTemp = materialMaxTemps[materialGrade] || 650;
  const opTemp = operatingTemps[operatingTemp] || 600;
  
  const safetyMargin = maxTemp - opTemp;
  
  return {
    materialMaxTemp: maxTemp,
    operatingTemp: opTemp,
    safetyMargin,
    rating: safetyMargin > 200 ? 'Excellent' : 
            safetyMargin > 100 ? 'Good' : 
            safetyMargin > 50 ? 'Adequate' : 'Marginal',
    recommendation: safetyMargin < 50 ? 'Upgrade material grade' : 'Material suitable',
  };
}

function calculateThermalExpansion(materialGrade: string, operatingTemp: string) {
  const expansionCoeffs = {
    mild_steel: 12,
    stainless_409: 11,
    stainless_304: 17,
    stainless_316: 16,
    stainless_321: 16,
    inconel_625: 13,
    hastelloy_x: 14,
  };
  
  const tempRanges = {
    low: 300,
    medium: 500,
    high: 700,
    extreme: 900,
  };
  
  const coeff = expansionCoeffs[materialGrade] || 15;
  const deltaT = tempRanges[operatingTemp] - 25;
  const expansion = coeff * deltaT / 1000; // mm/m
  
  return {
    expansionCoefficient: coeff,
    temperatureRise: deltaT,
    linearExpansion: Math.round(expansion * 100) / 100,
    designConsiderations: getExpansionConsiderations(expansion),
  };
}

function getExpansionConsiderations(expansion: number) {
  const considerations = [];
  
  if (expansion > 8) {
    considerations.push('Significant thermal expansion - design for movement');
    considerations.push('Use expansion joints or flexible connections');
  } else if (expansion > 5) {
    considerations.push('Moderate expansion - allow for thermal growth');
    considerations.push('Consider slip joints at connections');
  } else {
    considerations.push('Low expansion - standard mounting acceptable');
  }
  
  return considerations;
}

function getOxidationResistance(materialGrade: string, operatingTemp: string) {
  const resistanceData = {
    mild_steel: {
      low: 'Poor - requires coating',
      medium: 'Very Poor - rapid oxidation',
      high: 'Unacceptable',
      extreme: 'Unacceptable',
    },
    stainless_409: {
      low: 'Good',
      medium: 'Good',
      high: 'Fair',
      extreme: 'Poor',
    },
    stainless_304: {
      low: 'Excellent',
      medium: 'Excellent',
      high: 'Very Good',
      extreme: 'Good',
    },
    stainless_316: {
      low: 'Excellent',
      medium: 'Excellent',
      high: 'Excellent',
      extreme: 'Very Good',
    },
    stainless_321: {
      low: 'Excellent',
      medium: 'Excellent',
      high: 'Excellent',
      extreme: 'Excellent',
    },
    inconel_625: {
      low: 'Outstanding',
      medium: 'Outstanding',
      high: 'Outstanding',
      extreme: 'Outstanding',
    },
    hastelloy_x: {
      low: 'Outstanding',
      medium: 'Outstanding',
      high: 'Outstanding',
      extreme: 'Outstanding',
    },
  };
  
  const resistance = resistanceData[materialGrade]?.[operatingTemp] || 'Good';
  
  return {
    rating: resistance,
    scaleFormation: getScaleFormation(materialGrade, operatingTemp),
    serviceLife: getOxidationServiceLife(materialGrade, operatingTemp),
    protection: getOxidationProtection(materialGrade, operatingTemp),
  };
}

function getScaleFormation(materialGrade: string, operatingTemp: string) {
  if (materialGrade === 'mild_steel') {
    return 'Rapid iron oxide scale formation';
  } else if (['stainless_409'].includes(materialGrade) && operatingTemp === 'extreme') {
    return 'Moderate chromium oxide scale';
  } else if (['stainless_304', 'stainless_316', 'stainless_321'].includes(materialGrade)) {
    return 'Protective chromium oxide layer';
  } else {
    return 'Minimal scale formation';
  }
}

function getOxidationServiceLife(materialGrade: string, operatingTemp: string) {
  const lifeMatrix = {
    mild_steel: { low: '1-2 years', medium: '6 months', high: 'Weeks', extreme: 'Days' },
    stainless_409: { low: '10+ years', medium: '5-10 years', high: '2-5 years', extreme: '1-2 years' },
    stainless_304: { low: '20+ years', medium: '15+ years', high: '10+ years', extreme: '5-10 years' },
    stainless_316: { low: '25+ years', medium: '20+ years', high: '15+ years', extreme: '10+ years' },
    stainless_321: { low: '25+ years', medium: '20+ years', high: '15+ years', extreme: '15+ years' },
    inconel_625: { low: '30+ years', medium: '25+ years', high: '20+ years', extreme: '20+ years' },
    hastelloy_x: { low: '30+ years', medium: '30+ years', high: '25+ years', extreme: '25+ years' },
  };
  
  return lifeMatrix[materialGrade]?.[operatingTemp] || '5-10 years';
}

function getOxidationProtection(materialGrade: string, operatingTemp: string) {
  if (materialGrade === 'mild_steel') {
    return 'Aluminized coating required';
  } else if (['stainless_409'].includes(materialGrade) && operatingTemp === 'extreme') {
    return 'Consider ceramic coating for extended life';
  } else {
    return 'No additional protection required';
  }
}

export default exhaustSystemConfig;
