import { CalculatorConfig } from '../../types/calculator';

export const aerospaceComponentConfig: CalculatorConfig = {
  id: 'aerospace-component',
  name: 'Aerospace Component Calculator',
  description: 'Specialized calculator for aerospace components including structural parts, engine components, and avionics housings with stringent quality and certification requirements.',
  category: 'precision',
  difficulty: 'expert',
  estimatedTime: '8-9 minutes',
  
  inputs: [
    {
      id: 'componentType',
      label: 'Component Type',
      type: 'select',
      value: 'structural_bracket',
      options: [
        { value: 'structural_bracket', label: 'Structural Bracket/Mount' },
        { value: 'engine_component', label: 'Engine Component' },
        { value: 'avionics_housing', label: 'Avionics Housing' },
        { value: 'fuel_system_part', label: 'Fuel System Component' },
        { value: 'landing_gear_part', label: 'Landing Gear Component' },
        { value: 'control_surface', label: 'Control Surface Element' },
        { value: 'heat_shield', label: 'Heat Shield/Thermal Protection' },
        { value: 'satellite_component', label: 'Satellite/Space Component' },
      ],
      required: true,
      description: 'Type of aerospace component',
    },
    {
      id: 'materialSpecification',
      label: 'Material Specification',
      type: 'select',
      value: 'aluminum_7075',
      options: [
        { value: 'aluminum_7075', label: 'Aluminum 7075-T6 (High Strength)' },
        { value: 'aluminum_6061', label: 'Aluminum 6061-T6 (General Purpose)' },
        { value: 'aluminum_2024', label: 'Aluminum 2024-T3 (Aircraft)' },
        { value: 'titanium_6al4v', label: 'Titanium Ti-6Al-4V (Grade 5)' },
        { value: 'titanium_cp', label: 'Titanium CP (Grade 2)' },
        { value: 'inconel_718', label: 'Inconel 718 (High Temperature)' },
        { value: 'inconel_625', label: 'Inconel 625 (Corrosion Resistant)' },
        { value: 'hastelloy_x', label: 'Hastelloy X (Extreme Temperature)' },
        { value: 'stainless_15_5ph', label: 'Stainless Steel 15-5 PH' },
        { value: 'stainless_17_4ph', label: 'Stainless Steel 17-4 PH' },
      ],
      required: true,
      description: 'Aerospace-grade material specification',
    },
    {
      id: 'materialThickness',
      label: 'Material Thickness',
      type: 'number',
      value: 3.0,
      unit: 'mm',
      min: 0.5,
      max: 25.0,
      step: 0.1,
      required: true,
      description: 'Thickness of aerospace component',
    },
    {
      id: 'qualityStandard',
      label: 'Quality Standard',
      type: 'select',
      value: 'as9100',
      options: [
        { value: 'as9100', label: 'AS9100 (Aerospace Quality)' },
        { value: 'nadcap', label: 'Nadcap (Special Processes)' },
        { value: 'mil_spec', label: 'MIL-SPEC (Military Standard)' },
        { value: 'nasa_std', label: 'NASA-STD (Space Applications)' },
        { value: 'easa_part21', label: 'EASA Part 21 (European Aviation)' },
        { value: 'faa_pma', label: 'FAA PMA (Parts Manufacturing)' },
      ],
      required: true,
      description: 'Applicable aerospace quality standard',
    },
    {
      id: 'toleranceClass',
      label: 'Tolerance Class',
      type: 'select',
      value: 'aerospace_precision',
      options: [
        { value: 'commercial_grade', label: 'Commercial Grade (±0.2mm)' },
        { value: 'aerospace_standard', label: 'Aerospace Standard (±0.1mm)' },
        { value: 'aerospace_precision', label: 'Aerospace Precision (±0.05mm)' },
        { value: 'critical_dimension', label: 'Critical Dimension (±0.025mm)' },
        { value: 'ultra_precision', label: 'Ultra Precision (±0.01mm)' },
      ],
      required: true,
      description: 'Required dimensional tolerance class',
    },
    {
      id: 'operatingEnvironment',
      label: 'Operating Environment',
      type: 'select',
      value: 'flight_conditions',
      options: [
        { value: 'ground_operations', label: 'Ground Operations' },
        { value: 'flight_conditions', label: 'Flight Conditions' },
        { value: 'high_altitude', label: 'High Altitude (> 50,000 ft)' },
        { value: 'space_environment', label: 'Space Environment' },
        { value: 'engine_bay', label: 'Engine Bay (High Temperature)' },
        { value: 'cryogenic', label: 'Cryogenic Conditions' },
        { value: 'corrosive_environment', label: 'Corrosive Environment' },
      ],
      required: true,
      description: 'Operating environment conditions',
    },
    {
      id: 'temperatureRange',
      label: 'Temperature Range',
      type: 'select',
      value: 'standard_flight',
      options: [
        { value: 'ambient', label: 'Ambient (-20°C to +70°C)' },
        { value: 'standard_flight', label: 'Standard Flight (-55°C to +125°C)' },
        { value: 'high_temperature', label: 'High Temperature (+125°C to +500°C)' },
        { value: 'extreme_high', label: 'Extreme High (+500°C to +1000°C)' },
        { value: 'cryogenic_range', label: 'Cryogenic (-200°C to -55°C)' },
        { value: 'space_thermal', label: 'Space Thermal (-150°C to +150°C)' },
      ],
      required: true,
      description: 'Operating temperature range',
    },
    {
      id: 'loadRequirement',
      label: 'Load Requirement',
      type: 'select',
      value: 'high_load',
      options: [
        { value: 'light_load', label: 'Light Load (< 10 kN)' },
        { value: 'moderate_load', label: 'Moderate Load (10-50 kN)' },
        { value: 'high_load', label: 'High Load (50-200 kN)' },
        { value: 'extreme_load', label: 'Extreme Load (> 200 kN)' },
        { value: 'fatigue_critical', label: 'Fatigue Critical (Cyclic Loading)' },
        { value: 'impact_resistant', label: 'Impact Resistant' },
      ],
      required: true,
      description: 'Mechanical load requirements',
    },
    {
      id: 'certificationLevel',
      label: 'Certification Level',
      type: 'select',
      value: 'type_certified',
      options: [
        { value: 'commercial_off_shelf', label: 'Commercial Off-the-Shelf' },
        { value: 'qualified_part', label: 'Qualified Part' },
        { value: 'type_certified', label: 'Type Certified Component' },
        { value: 'flight_critical', label: 'Flight Critical Component' },
        { value: 'life_limited', label: 'Life Limited Part' },
        { value: 'space_qualified', label: 'Space Qualified' },
      ],
      required: true,
      description: 'Required certification level',
    },
    {
      id: 'productionVolume',
      label: 'Production Volume',
      type: 'select',
      value: 'low_rate',
      options: [
        { value: 'prototype', label: 'Prototype (1-5 units)' },
        { value: 'development', label: 'Development (5-25 units)' },
        { value: 'low_rate', label: 'Low Rate Production (25-100 units)' },
        { value: 'full_rate', label: 'Full Rate Production (100+ units)' },
      ],
      required: true,
      description: 'Expected production volume',
    },
  ],

  outputs: [
    {
      id: 'materialAnalysis',
      label: 'Material Analysis',
      type: 'object',
      format: 'aerospace-material-specs',
      description: 'Aerospace material properties and performance analysis',
    },
    {
      id: 'qualityRequirements',
      label: 'Quality Requirements',
      type: 'object',
      format: 'aerospace-quality-specs',
      description: 'Quality control and certification requirements',
    },
    {
      id: 'environmentalAnalysis',
      label: 'Environmental Analysis',
      type: 'object',
      format: 'aerospace-environmental-specs',
      description: 'Environmental performance and durability analysis',
    },
    {
      id: 'manufacturingCost',
      label: 'Manufacturing Cost',
      type: 'object',
      format: 'aerospace-cost-analysis',
      description: 'Aerospace-grade manufacturing cost analysis',
    },
  ],

  calculate: (inputs: Record<string, any>) => {
    const {
      componentType,
      materialSpecification,
      materialThickness,
      qualityStandard,
      toleranceClass,
      operatingEnvironment,
      temperatureRange,
      loadRequirement,
      certificationLevel,
      productionVolume,
    } = inputs;

    // Analyze material properties
    const materialAnalysis = analyzeAerospaceMaterial(
      materialSpecification,
      componentType,
      temperatureRange,
      operatingEnvironment,
      loadRequirement
    );

    // Define quality requirements
    const qualityRequirements = defineAerospaceQuality(
      qualityStandard,
      toleranceClass,
      certificationLevel,
      componentType,
      materialSpecification
    );

    // Analyze environmental performance
    const environmentalAnalysis = analyzeAerospaceEnvironmental(
      operatingEnvironment,
      temperatureRange,
      materialSpecification,
      componentType,
      loadRequirement
    );

    // Calculate manufacturing costs
    const manufacturingCost = calculateAerospaceManufacturingCost(
      componentType,
      materialSpecification,
      materialThickness,
      toleranceClass,
      qualityStandard,
      productionVolume,
      qualityRequirements
    );

    return {
      materialAnalysis,
      qualityRequirements,
      environmentalAnalysis,
      manufacturingCost,
    };
  },

  validation: {
    materialThickness: {
      min: 0.5,
      max: 25.0,
      message: 'Material thickness must be between 0.5mm and 25.0mm for aerospace components',
    },
  },

  examples: [
    {
      name: 'Aircraft Structural Bracket',
      description: 'High-strength aluminum bracket for aircraft structure',
      inputs: {
        componentType: 'structural_bracket',
        materialSpecification: 'aluminum_7075',
        materialThickness: 6.0,
        qualityStandard: 'as9100',
        toleranceClass: 'aerospace_precision',
        operatingEnvironment: 'flight_conditions',
        temperatureRange: 'standard_flight',
        loadRequirement: 'high_load',
        certificationLevel: 'type_certified',
        productionVolume: 'low_rate',
      },
    },
    {
      name: 'Engine Component',
      description: 'Inconel engine component for high-temperature application',
      inputs: {
        componentType: 'engine_component',
        materialSpecification: 'inconel_718',
        materialThickness: 4.0,
        qualityStandard: 'nadcap',
        toleranceClass: 'critical_dimension',
        operatingEnvironment: 'engine_bay',
        temperatureRange: 'high_temperature',
        loadRequirement: 'fatigue_critical',
        certificationLevel: 'flight_critical',
        productionVolume: 'development',
      },
    },
  ],

  tags: ['aerospace', 'aviation', 'precision', 'certification', 'high-performance'],
  
  relatedCalculators: [
    'high-temperature-cutting',
    'precision-tolerances',
    'fatigue-analysis',
    'certification-compliance',
  ],

  learningResources: [
    {
      title: 'Aerospace Manufacturing Standards',
      type: 'article',
      url: '/learn/aerospace-manufacturing',
    },
    {
      title: 'AS9100 Quality Requirements',
      type: 'video',
      url: '/learn/as9100-quality',
    },
  ],
};

// Helper functions
function analyzeAerospaceMaterial(
  materialSpec: string,
  componentType: string,
  tempRange: string,
  environment: string,
  loadReq: string
) {
  const materialProperties = getAerospaceMaterialProperties(materialSpec);
  const temperaturePerformance = analyzeTemperaturePerformance(materialSpec, tempRange);
  const mechanicalProperties = analyzeMechanicalProperties(materialSpec, loadReq);
  
  return {
    materialProperties,
    temperaturePerformance,
    mechanicalProperties,
    environmentalSuitability: assessEnvironmentalSuitability(materialSpec, environment),
    materialCertification: getMaterialCertification(materialSpec),
    traceabilityRequirements: getTraceabilityRequirements(materialSpec, componentType),
  };
}

function getAerospaceMaterialProperties(materialSpec: string) {
  const materials = {
    aluminum_7075: {
      designation: 'AA 7075-T6',
      density: '2.81 g/cm³',
      tensileStrength: '572 MPa',
      yieldStrength: '503 MPa',
      elasticModulus: '71.7 GPa',
      thermalConductivity: '130 W/m·K',
      thermalExpansion: '23.2 × 10⁻⁶ /°C',
      maxServiceTemp: '175°C',
      corrosionResistance: 'Fair (requires protection)',
      applications: ['Aircraft structures', 'High-stress components'],
      advantages: ['High strength-to-weight ratio', 'Good machinability'],
      limitations: ['Poor corrosion resistance', 'Stress corrosion susceptible'],
    },
    aluminum_6061: {
      designation: 'AA 6061-T6',
      density: '2.70 g/cm³',
      tensileStrength: '310 MPa',
      yieldStrength: '276 MPa',
      elasticModulus: '68.9 GPa',
      thermalConductivity: '167 W/m·K',
      thermalExpansion: '23.6 × 10⁻⁶ /°C',
      maxServiceTemp: '200°C',
      corrosionResistance: 'Good',
      applications: ['General aircraft structures', 'Non-critical components'],
      advantages: ['Good corrosion resistance', 'Excellent weldability'],
      limitations: ['Lower strength than 7075', 'Limited high-temp use'],
    },
    aluminum_2024: {
      designation: 'AA 2024-T3',
      density: '2.78 g/cm³',
      tensileStrength: '469 MPa',
      yieldStrength: '324 MPa',
      elasticModulus: '73.1 GPa',
      thermalConductivity: '121 W/m·K',
      thermalExpansion: '22.9 × 10⁻⁶ /°C',
      maxServiceTemp: '150°C',
      corrosionResistance: 'Poor (requires cladding)',
      applications: ['Aircraft fuselage', 'Wing structures'],
      advantages: ['High strength', 'Good fatigue resistance'],
      limitations: ['Poor corrosion resistance', 'Not weldable'],
    },
    titanium_6al4v: {
      designation: 'Ti-6Al-4V (Grade 5)',
      density: '4.43 g/cm³',
      tensileStrength: '950 MPa',
      yieldStrength: '880 MPa',
      elasticModulus: '114 GPa',
      thermalConductivity: '6.7 W/m·K',
      thermalExpansion: '8.6 × 10⁻⁶ /°C',
      maxServiceTemp: '400°C',
      corrosionResistance: 'Excellent',
      applications: ['Engine components', 'Landing gear', 'Fasteners'],
      advantages: ['High strength-to-weight', 'Excellent corrosion resistance'],
      limitations: ['Expensive', 'Difficult to machine'],
    },
    titanium_cp: {
      designation: 'Ti CP (Grade 2)',
      density: '4.51 g/cm³',
      tensileStrength: '345 MPa',
      yieldStrength: '275 MPa',
      elasticModulus: '103 GPa',
      thermalConductivity: '17 W/m·K',
      thermalExpansion: '8.6 × 10⁻⁶ /°C',
      maxServiceTemp: '300°C',
      corrosionResistance: 'Outstanding',
      applications: ['Corrosive environments', 'Chemical processing'],
      advantages: ['Superior corrosion resistance', 'Good formability'],
      limitations: ['Lower strength than alloys', 'Expensive'],
    },
    inconel_718: {
      designation: 'Inconel 718',
      density: '8.19 g/cm³',
      tensileStrength: '1275 MPa',
      yieldStrength: '1034 MPa',
      elasticModulus: '200 GPa',
      thermalConductivity: '11.4 W/m·K',
      thermalExpansion: '13.0 × 10⁻⁶ /°C',
      maxServiceTemp: '700°C',
      corrosionResistance: 'Excellent',
      applications: ['Jet engines', 'Gas turbines', 'Rocket motors'],
      advantages: ['High temperature strength', 'Oxidation resistant'],
      limitations: ['Very expensive', 'Difficult to machine'],
    },
    inconel_625: {
      designation: 'Inconel 625',
      density: '8.44 g/cm³',
      tensileStrength: '827 MPa',
      yieldStrength: '414 MPa',
      elasticModulus: '208 GPa',
      thermalConductivity: '9.8 W/m·K',
      thermalExpansion: '12.8 × 10⁻⁶ /°C',
      maxServiceTemp: '980°C',
      corrosionResistance: 'Outstanding',
      applications: ['Chemical processing', 'Marine applications'],
      advantages: ['Outstanding corrosion resistance', 'High temperature capability'],
      limitations: ['Very expensive', 'Work hardening'],
    },
    hastelloy_x: {
      designation: 'Hastelloy X',
      density: '8.22 g/cm³',
      tensileStrength: '785 MPa',
      yieldStrength: '345 MPa',
      elasticModulus: '205 GPa',
      thermalConductivity: '9.1 W/m·K',
      thermalExpansion: '14.0 × 10⁻⁶ /°C',
      maxServiceTemp: '1200°C',
      corrosionResistance: 'Excellent',
      applications: ['Gas turbine combustors', 'Afterburners'],
      advantages: ['Extreme temperature capability', 'Oxidation resistant'],
      limitations: ['Extremely expensive', 'Specialized processing'],
    },
    stainless_15_5ph: {
      designation: '15-5 PH',
      density: '7.80 g/cm³',
      tensileStrength: '1380 MPa',
      yieldStrength: '1310 MPa',
      elasticModulus: '196 GPa',
      thermalConductivity: '16.3 W/m·K',
      thermalExpansion: '10.8 × 10⁻⁶ /°C',
      maxServiceTemp: '315°C',
      corrosionResistance: 'Very Good',
      applications: ['Aerospace fasteners', 'Valve components'],
      advantages: ['High strength', 'Good corrosion resistance'],
      limitations: ['Limited high temperature use', 'Heat treatment required'],
    },
    stainless_17_4ph: {
      designation: '17-4 PH',
      density: '7.80 g/cm³',
      tensileStrength: '1310 MPa',
      yieldStrength: '1172 MPa',
      elasticModulus: '196 GPa',
      thermalConductivity: '19.3 W/m·K',
      thermalExpansion: '10.8 × 10⁻⁶ /°C',
      maxServiceTemp: '315°C',
      corrosionResistance: 'Very Good',
      applications: ['Aerospace components', 'Chemical processing'],
      advantages: ['High strength', 'Good toughness'],
      limitations: ['Limited high temperature use', 'Expensive'],
    },
  };
  
  return materials[materialSpec] || materials.aluminum_6061;
}

function analyzeTemperaturePerformance(materialSpec: string, tempRange: string) {
  const tempRanges = {
    ambient: { min: -20, max: 70 },
    standard_flight: { min: -55, max: 125 },
    high_temperature: { min: 125, max: 500 },
    extreme_high: { min: 500, max: 1000 },
    cryogenic_range: { min: -200, max: -55 },
    space_thermal: { min: -150, max: 150 },
  };
  
  const range = tempRanges[tempRange] || tempRanges.standard_flight;
  const materialProps = getAerospaceMaterialProperties(materialSpec);
  const maxServiceTemp = parseFloat(materialProps.maxServiceTemp.replace('°C', ''));
  
  const suitability = range.max <= maxServiceTemp ? 'Suitable' : 'Marginal/Unsuitable';
  const margin = maxServiceTemp - range.max;
  
  return {
    operatingRange: `${range.min}°C to ${range.max}°C`,
    materialLimit: materialProps.maxServiceTemp,
    temperatureMargin: `${margin}°C`,
    suitability,
    recommendations: getTemperatureRecommendations(suitability, margin, materialSpec),
    thermalStressAnalysis: analyzeThermalStress(materialSpec, range),
  };
}

function getTemperatureRecommendations(suitability: string, margin: number, materialSpec: string) {
  const recommendations = [];
  
  if (suitability === 'Marginal/Unsuitable') {
    recommendations.push('Material temperature limit exceeded');
    recommendations.push('Consider higher temperature material');
    recommendations.push('Evaluate thermal protection systems');
  } else if (margin < 50) {
    recommendations.push('Limited temperature margin - monitor closely');
    recommendations.push('Consider thermal barrier coatings');
    recommendations.push('Validate performance at operating temperature');
  } else {
    recommendations.push('Adequate temperature margin');
    recommendations.push('Material suitable for application');
  }
  
  if (['aluminum_7075', 'aluminum_6061', 'aluminum_2024'].includes(materialSpec) && margin < 25) {
    recommendations.push('Consider titanium or superalloy for higher temperatures');
  }
  
  return recommendations;
}

function analyzeThermalStress(materialSpec: string, tempRange: any) {
  const materialProps = getAerospaceMaterialProperties(materialSpec);
  const expansionCoeff = parseFloat(materialProps.thermalExpansion.split(' ')[0]);
  const deltaT = tempRange.max - tempRange.min;
  const thermalStrain = expansionCoeff * deltaT / 1000000;
  
  return {
    temperatureDelta: deltaT,
    thermalStrain: Math.round(thermalStrain * 1000000),
    thermalStress: 'Requires detailed analysis based on constraints',
    designConsiderations: getThermalDesignConsiderations(deltaT, expansionCoeff),
  };
}

function getThermalDesignConsiderations(deltaT: number, expansionCoeff: number) {
  const considerations = [];
  
  if (deltaT > 200) {
    considerations.push('Large temperature range - significant thermal expansion');
    considerations.push('Design for thermal growth and stress relief');
    considerations.push('Consider expansion joints or flexible connections');
  }
  
  if (expansionCoeff > 20) {
    considerations.push('High thermal expansion material');
    considerations.push('Careful attention to thermal stress management');
  }
  
  considerations.push('Validate thermal cycling performance');
  considerations.push('Consider thermal barrier coatings if applicable');
  
  return considerations;
}

function analyzeMechanicalProperties(materialSpec: string, loadReq: string) {
  const materialProps = getAerospaceMaterialProperties(materialSpec);
  const tensileStrength = parseFloat(materialProps.tensileStrength.split(' ')[0]);
  const yieldStrength = parseFloat(materialProps.yieldStrength.split(' ')[0]);
  
  const loadCapabilities = assessLoadCapabilities(tensileStrength, yieldStrength, loadReq);
  const fatiguePerformance = assessFatiguePerformance(materialSpec, loadReq);
  
  return {
    strengthProperties: {
      tensileStrength: materialProps.tensileStrength,
      yieldStrength: materialProps.yieldStrength,
      elasticModulus: materialProps.elasticModulus,
    },
    loadCapabilities,
    fatiguePerformance,
    designAllowables: getDesignAllowables(materialSpec),
    safetyFactors: getAerospaceSafetyFactors(loadReq),
  };
}

function assessLoadCapabilities(tensile: number, yield: number, loadReq: string) {
  const loadLevels = {
    light_load: 50,      // MPa equivalent stress
    moderate_load: 150,  // MPa equivalent stress
    high_load: 300,      // MPa equivalent stress
    extreme_load: 500,   // MPa equivalent stress
    fatigue_critical: 200, // MPa equivalent stress
    impact_resistant: 400, // MPa equivalent stress
  };
  
  const requiredStress = loadLevels[loadReq] || 200;
  const allowableStress = yield / 1.5; // Factor of safety 1.5
  
  return {
    requiredStress: `${requiredStress} MPa`,
    allowableStress: `${Math.round(allowableStress)} MPa`,
    adequacy: allowableStress > requiredStress ? 'Adequate' : 'Inadequate',
    margin: `${Math.round(((allowableStress / requiredStress) - 1) * 100)}%`,
    recommendation: getLoadRecommendation(allowableStress, requiredStress),
  };
}

function getLoadRecommendation(allowable: number, required: number) {
  const margin = (allowable / required) - 1;
  
  if (margin > 0.5) return 'Excellent margin - material well suited';
  if (margin > 0.2) return 'Good margin - material adequate';
  if (margin > 0) return 'Marginal margin - verify with detailed analysis';
  return 'Inadequate - select higher strength material';
}

function assessFatiguePerformance(materialSpec: string, loadReq: string) {
  const fatigueStrengths = {
    aluminum_7075: 159,   // MPa at 10^7 cycles
    aluminum_6061: 96,    // MPa at 10^7 cycles
    aluminum_2024: 138,   // MPa at 10^7 cycles
    titanium_6al4v: 510,  // MPa at 10^7 cycles
    titanium_cp: 241,     // MPa at 10^7 cycles
    inconel_718: 620,     // MPa at 10^7 cycles
    inconel_625: 310,     // MPa at 10^7 cycles
    hastelloy_x: 275,     // MPa at 10^7 cycles
    stainless_15_5ph: 483, // MPa at 10^7 cycles
    stainless_17_4ph: 448, // MPa at 10^7 cycles
  };
  
  const fatigueStrength = fatigueStrengths[materialSpec] || 200;
  const isFatigueCritical = loadReq === 'fatigue_critical';
  
  return {
    fatigueStrength: `${fatigueStrength} MPa (10^7 cycles)`,
    fatigueRating: getFatigueRating(fatigueStrength),
    criticalityAssessment: isFatigueCritical ? 'Fatigue critical application' : 'Standard fatigue consideration',
    designRecommendations: getFatigueDesignRecommendations(materialSpec, isFatigueCritical),
  };
}

function getFatigueRating(strength: number) {
  if (strength > 500) return 'Excellent fatigue resistance';
  if (strength > 300) return 'Good fatigue resistance';
  if (strength > 150) return 'Moderate fatigue resistance';
  return 'Limited fatigue resistance';
}

function getFatigueDesignRecommendations(materialSpec: string, isCritical: boolean) {
  const recommendations = [];
  
  if (isCritical) {
    recommendations.push('Implement damage tolerance design approach');
    recommendations.push('Specify fatigue testing requirements');
    recommendations.push('Consider shot peening or other surface treatments');
    recommendations.push('Establish inspection intervals');
  }
  
  if (['aluminum_7075', 'aluminum_6061', 'aluminum_2024'].includes(materialSpec)) {
    recommendations.push('Consider stress concentration factors');
    recommendations.push('Avoid sharp corners and notches');
    recommendations.push('Specify surface finish requirements');
  }
  
  recommendations.push('Validate fatigue life with testing');
  recommendations.push('Consider environmental effects on fatigue');
  
  return recommendations;
}

function getDesignAllowables(materialSpec: string) {
  // Simplified design allowables - actual values would come from material specifications
  const materialProps = getAerospaceMaterialProperties(materialSpec);
  const tensile = parseFloat(materialProps.tensileStrength.split(' ')[0]);
  const yield = parseFloat(materialProps.yieldStrength.split(' ')[0]);
  
  return {
    ultimateAllowable: `${Math.round(tensile / 1.5)} MPa`,
    yieldAllowable: `${Math.round(yield / 1.5)} MPa`,
    bearingAllowable: `${Math.round(tensile * 1.6 / 1.5)} MPa`,
    shearAllowable: `${Math.round(tensile * 0.6 / 1.5)} MPa`,
    note: 'Simplified allowables - use certified material data for design',
  };
}

function getAerospaceSafetyFactors(loadReq: string) {
  const factors = {
    light_load: { ultimate: 1.5, yield: 1.5 },
    moderate_load: { ultimate: 1.5, yield: 1.5 },
    high_load: { ultimate: 2.0, yield: 1.5 },
    extreme_load: { ultimate: 2.5, yield: 2.0 },
    fatigue_critical: { ultimate: 4.0, yield: 2.0 },
    impact_resistant: { ultimate: 2.0, yield: 1.8 },
  };
  
  return factors[loadReq] || factors.moderate_load;
}

function assessEnvironmentalSuitability(materialSpec: string, environment: string) {
  const suitabilityMatrix = {
    aluminum_7075: {
      ground_operations: 'Excellent',
      flight_conditions: 'Good',
      high_altitude: 'Good',
      space_environment: 'Fair',
      engine_bay: 'Poor',
      cryogenic: 'Good',
      corrosive_environment: 'Poor',
    },
    titanium_6al4v: {
      ground_operations: 'Excellent',
      flight_conditions: 'Excellent',
      high_altitude: 'Excellent',
      space_environment: 'Excellent',
      engine_bay: 'Good',
      cryogenic: 'Excellent',
      corrosive_environment: 'Excellent',
    },
    inconel_718: {
      ground_operations: 'Excellent',
      flight_conditions: 'Excellent',
      high_altitude: 'Excellent',
      space_environment: 'Excellent',
      engine_bay: 'Excellent',
      cryogenic: 'Good',
      corrosive_environment: 'Excellent',
    },
  };
  
  const materialSuitability = suitabilityMatrix[materialSpec] || {};
  const rating = materialSuitability[environment] || 'Good';
  
  return {
    suitabilityRating: rating,
    environmentalChallenges: getEnvironmentalChallenges(environment),
    protectionRequirements: getProtectionRequirements(materialSpec, environment),
    testingRequirements: getEnvironmentalTestingRequirements(environment),
  };
}

function getEnvironmentalChallenges(environment: string) {
  const challenges = {
    ground_operations: ['Humidity', 'Temperature cycling', 'Handling damage'],
    flight_conditions: ['Pressure changes', 'Temperature extremes', 'Vibration'],
    high_altitude: ['Low pressure', 'Temperature extremes', 'UV exposure'],
    space_environment: ['Vacuum', 'Radiation', 'Thermal cycling', 'Micrometeorites'],
    engine_bay: ['High temperature', 'Vibration', 'Chemical exposure'],
    cryogenic: ['Extreme cold', 'Thermal shock', 'Embrittlement'],
    corrosive_environment: ['Chemical attack', 'Galvanic corrosion', 'Stress corrosion'],
  };
  
  return challenges[environment] || challenges.flight_conditions;
}

function getProtectionRequirements(materialSpec: string, environment: string) {
  const requirements = [];
  
  if (['aluminum_7075', 'aluminum_2024'].includes(materialSpec)) {
    requirements.push('Corrosion protection coating required');
    requirements.push('Anodizing or primer/paint system');
  }
  
  if (environment === 'space_environment') {
    requirements.push('Radiation-resistant coatings');
    requirements.push('Thermal control coatings');
    requirements.push('Micrometeorite protection');
  }
  
  if (environment === 'engine_bay') {
    requirements.push('High-temperature coatings');
    requirements.push('Thermal barrier systems');
  }
  
  return requirements;
}

function getEnvironmentalTestingRequirements(environment: string) {
  const requirements = {
    ground_operations: ['Salt spray testing', 'Humidity testing', 'Temperature cycling'],
    flight_conditions: ['Altitude testing', 'Temperature extremes', 'Vibration testing'],
    high_altitude: ['Low pressure testing', 'UV exposure testing', 'Thermal cycling'],
    space_environment: ['Vacuum testing', 'Radiation testing', 'Thermal cycling', 'Outgassing'],
    engine_bay: ['High temperature testing', 'Vibration testing', 'Chemical exposure'],
    cryogenic: ['Cryogenic testing', 'Thermal shock testing', 'Impact testing'],
    corrosive_environment: ['Corrosion testing', 'Stress corrosion testing', 'Galvanic compatibility'],
  };
  
  return requirements[environment] || requirements.flight_conditions;
}

function getMaterialCertification(materialSpec: string) {
  return {
    requiredCertifications: [
      'Material Test Report (MTR)',
      'Chemical composition analysis',
      'Mechanical property testing',
      'Heat treatment certification',
    ],
    traceabilityRequirements: [
      'Heat/lot number tracking',
      'Mill test certificates',
      'Processing records',
      'Chain of custody documentation',
    ],
    qualityStandards: [
      'AMS specifications',
      'ASTM standards',
      'Military specifications (if applicable)',
    ],
  };
}

function getTraceabilityRequirements(materialSpec: string, componentType: string) {
  const requirements = {
    documentation: [
      'Material pedigree from mill to final part',
      'Processing parameter records',
      'Inspection and test results',
      'Non-conformance reports (if any)',
    ],
    marking: [
      'Part number and serial number',
      'Material specification',
      'Heat/lot number',
      'Manufacturing date',
    ],
    retention: [
      'Minimum 10 years for commercial aircraft',
      'Life of aircraft + 10 years for critical parts',
      'Permanent for space applications',
    ],
  };
  
  if (['engine_component', 'landing_gear_part'].includes(componentType)) {
    requirements.documentation.push('Life limited part tracking');
    requirements.documentation.push('Service history records');
  }
  
  return requirements;
}

export default aerospaceComponentConfig;
