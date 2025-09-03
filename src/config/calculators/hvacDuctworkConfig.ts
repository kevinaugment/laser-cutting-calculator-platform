import { CalculatorConfig } from '../../types/calculator';

export const hvacDuctworkConfig: CalculatorConfig = {
  id: 'hvac-ductwork',
  name: 'HVAC Ductwork Calculator',
  description: 'Specialized calculator for HVAC ductwork components including rectangular ducts, fittings, and transitions with airflow and pressure requirements.',
  category: 'construction',
  difficulty: 'advanced',
  estimatedTime: '6-7 minutes',
  
  inputs: [
    {
      id: 'ductComponent',
      label: 'Duct Component Type',
      type: 'select',
      value: 'rectangular_duct',
      options: [
        { value: 'rectangular_duct', label: 'Rectangular Duct Section' },
        { value: 'transition_fitting', label: 'Transition Fitting' },
        { value: 'elbow_fitting', label: 'Elbow/Bend Fitting' },
        { value: 'branch_fitting', label: 'Branch/Tee Fitting' },
        { value: 'reducer_fitting', label: 'Reducer Fitting' },
        { value: 'damper_frame', label: 'Damper Frame' },
        { value: 'access_panel', label: 'Access Panel/Door' },
        { value: 'plenum_box', label: 'Plenum/Distribution Box' },
      ],
      required: true,
      description: 'Type of HVAC ductwork component',
    },
    {
      id: 'materialGrade',
      label: 'Material Grade',
      type: 'select',
      value: 'galvanized_steel',
      options: [
        { value: 'galvanized_steel', label: 'Galvanized Steel (Standard)' },
        { value: 'stainless_304', label: 'Stainless Steel 304' },
        { value: 'stainless_316', label: 'Stainless Steel 316' },
        { value: 'aluminum_3003', label: 'Aluminum 3003' },
        { value: 'aluminum_5052', label: 'Aluminum 5052' },
        { value: 'carbon_steel', label: 'Carbon Steel (Painted)' },
        { value: 'pre_insulated', label: 'Pre-Insulated Panel' },
      ],
      required: true,
      description: 'Material for HVAC application',
    },
    {
      id: 'sheetThickness',
      label: 'Sheet Thickness',
      type: 'number',
      value: 1.2,
      unit: 'mm',
      min: 0.5,
      max: 3.0,
      step: 0.1,
      required: true,
      description: 'Sheet metal thickness',
    },
    {
      id: 'ductWidth',
      label: 'Duct Width',
      type: 'number',
      value: 600,
      unit: 'mm',
      min: 100,
      max: 2000,
      step: 50,
      required: true,
      description: 'Width of rectangular duct',
    },
    {
      id: 'ductHeight',
      label: 'Duct Height',
      type: 'number',
      value: 400,
      unit: 'mm',
      min: 100,
      max: 1500,
      step: 50,
      required: true,
      description: 'Height of rectangular duct',
    },
    {
      id: 'ductLength',
      label: 'Duct Length/Size',
      type: 'number',
      value: 1200,
      unit: 'mm',
      min: 200,
      max: 6000,
      step: 100,
      required: true,
      description: 'Length of duct section or fitting size',
    },
    {
      id: 'pressureClass',
      label: 'Pressure Class',
      type: 'select',
      value: 'medium_pressure',
      options: [
        { value: 'low_pressure', label: 'Low Pressure (< 500 Pa)' },
        { value: 'medium_pressure', label: 'Medium Pressure (500-1500 Pa)' },
        { value: 'high_pressure', label: 'High Pressure (1500-3000 Pa)' },
        { value: 'very_high_pressure', label: 'Very High Pressure (> 3000 Pa)' },
      ],
      required: true,
      description: 'Operating pressure classification',
    },
    {
      id: 'airflowRate',
      label: 'Airflow Rate',
      type: 'number',
      value: 2000,
      unit: 'CFM',
      min: 100,
      max: 50000,
      step: 100,
      required: true,
      description: 'Design airflow rate in CFM',
    },
    {
      id: 'applicationEnvironment',
      label: 'Application Environment',
      type: 'select',
      value: 'commercial_standard',
      options: [
        { value: 'residential', label: 'Residential HVAC' },
        { value: 'commercial_standard', label: 'Commercial Standard' },
        { value: 'industrial_standard', label: 'Industrial Standard' },
        { value: 'clean_room', label: 'Clean Room/Laboratory' },
        { value: 'kitchen_exhaust', label: 'Kitchen Exhaust' },
        { value: 'corrosive_environment', label: 'Corrosive Environment' },
        { value: 'high_temperature', label: 'High Temperature Application' },
      ],
      required: true,
      description: 'HVAC application environment',
    },
    {
      id: 'insulationRequirement',
      label: 'Insulation Requirement',
      type: 'select',
      value: 'external_insulation',
      options: [
        { value: 'none', label: 'No Insulation Required' },
        { value: 'external_insulation', label: 'External Insulation' },
        { value: 'internal_lining', label: 'Internal Acoustic Lining' },
        { value: 'double_wall', label: 'Double Wall Construction' },
        { value: 'fire_rated', label: 'Fire-Rated Insulation' },
      ],
      required: true,
      description: 'Thermal/acoustic insulation requirements',
    },
    {
      id: 'productionQuantity',
      label: 'Production Quantity',
      type: 'select',
      value: 'medium_run',
      options: [
        { value: 'custom_single', label: 'Custom Single Unit' },
        { value: 'small_run', label: 'Small Run (2-10 units)' },
        { value: 'medium_run', label: 'Medium Run (10-50 units)' },
        { value: 'large_run', label: 'Large Run (50+ units)' },
      ],
      required: true,
      description: 'Production quantity for project',
    },
  ],

  outputs: [
    {
      id: 'airflowAnalysis',
      label: 'Airflow Analysis',
      type: 'object',
      format: 'hvac-airflow-specs',
      description: 'Airflow performance and pressure drop analysis',
    },
    {
      id: 'fabricationSpecs',
      label: 'Fabrication Specifications',
      type: 'object',
      format: 'hvac-fabrication-specs',
      description: 'Detailed fabrication and cutting specifications',
    },
    {
      id: 'complianceRequirements',
      label: 'Compliance Requirements',
      type: 'object',
      format: 'hvac-compliance-specs',
      description: 'HVAC codes and standards compliance requirements',
    },
    {
      id: 'fabricationCost',
      label: 'Fabrication Cost',
      type: 'object',
      format: 'hvac-cost-analysis',
      description: 'Comprehensive cost analysis for HVAC ductwork fabrication',
    },
  ],

  calculate: (inputs: Record<string, any>) => {
    const {
      ductComponent,
      materialGrade,
      sheetThickness,
      ductWidth,
      ductHeight,
      ductLength,
      pressureClass,
      airflowRate,
      applicationEnvironment,
      insulationRequirement,
      productionQuantity,
    } = inputs;

    // Analyze airflow performance
    const airflowAnalysis = analyzeHVACAirflow(
      ductWidth,
      ductHeight,
      ductLength,
      airflowRate,
      pressureClass,
      ductComponent
    );

    // Calculate fabrication specifications
    const fabricationSpecs = calculateHVACFabrication(
      ductComponent,
      materialGrade,
      sheetThickness,
      ductWidth,
      ductHeight,
      ductLength,
      pressureClass
    );

    // Define compliance requirements
    const complianceRequirements = defineHVACCompliance(
      applicationEnvironment,
      pressureClass,
      ductComponent,
      materialGrade,
      insulationRequirement
    );

    // Calculate fabrication costs
    const fabricationCost = calculateHVACFabricationCost(
      ductComponent,
      materialGrade,
      sheetThickness,
      ductWidth,
      ductHeight,
      ductLength,
      productionQuantity,
      fabricationSpecs
    );

    return {
      airflowAnalysis,
      fabricationSpecs,
      complianceRequirements,
      fabricationCost,
    };
  },

  validation: {
    sheetThickness: {
      min: 0.5,
      max: 3.0,
      message: 'Sheet thickness must be between 0.5mm and 3.0mm for HVAC applications',
    },
    ductWidth: {
      min: 100,
      max: 2000,
      message: 'Duct width must be between 100mm and 2000mm',
    },
    ductHeight: {
      min: 100,
      max: 1500,
      message: 'Duct height must be between 100mm and 1500mm',
    },
    airflowRate: {
      min: 100,
      max: 50000,
      message: 'Airflow rate must be between 100 and 50,000 CFM',
    },
  },

  examples: [
    {
      name: 'Commercial Supply Duct',
      description: 'Standard commercial building supply ductwork',
      inputs: {
        ductComponent: 'rectangular_duct',
        materialGrade: 'galvanized_steel',
        sheetThickness: 1.2,
        ductWidth: 800,
        ductHeight: 400,
        ductLength: 3000,
        pressureClass: 'medium_pressure',
        airflowRate: 3000,
        applicationEnvironment: 'commercial_standard',
        insulationRequirement: 'external_insulation',
        productionQuantity: 'large_run',
      },
    },
    {
      name: 'Kitchen Exhaust Transition',
      description: 'Stainless steel kitchen exhaust transition fitting',
      inputs: {
        ductComponent: 'transition_fitting',
        materialGrade: 'stainless_304',
        sheetThickness: 1.5,
        ductWidth: 600,
        ductHeight: 600,
        ductLength: 800,
        pressureClass: 'high_pressure',
        airflowRate: 4000,
        applicationEnvironment: 'kitchen_exhaust',
        insulationRequirement: 'none',
        productionQuantity: 'small_run',
      },
    },
  ],

  tags: ['hvac', 'ductwork', 'airflow', 'ventilation', 'commercial'],
  
  relatedCalculators: [
    'airflow-analysis',
    'pressure-drop',
    'thermal-insulation',
    'sheet-metal-forming',
  ],

  learningResources: [
    {
      title: 'HVAC Ductwork Design Guide',
      type: 'article',
      url: '/learn/hvac-ductwork-design',
    },
    {
      title: 'Sheet Metal Fabrication for HVAC',
      type: 'video',
      url: '/learn/hvac-fabrication',
    },
  ],
};

// Helper functions
function analyzeHVACAirflow(
  width: number,
  height: number,
  length: number,
  airflowRate: number,
  pressureClass: string,
  componentType: string
) {
  const ductArea = (width * height) / 1000000; // m²
  const velocity = (airflowRate * 0.000472) / ductArea; // m/s (CFM to m³/s conversion)
  
  const pressureDropAnalysis = calculatePressureDrop(velocity, length, width, height, componentType);
  const velocityAnalysis = analyzeVelocity(velocity, componentType);
  const reynoldsNumber = calculateReynoldsNumber(velocity, width, height);
  
  return {
    ductCrossSection: {
      area: Math.round(ductArea * 1000000), // mm²
      perimeter: Math.round(2 * (width + height)), // mm
      hydraulicDiameter: Math.round(4 * ductArea * 1000000 / (2 * (width + height))), // mm
    },
    airflowCharacteristics: {
      velocity: Math.round(velocity * 100) / 100, // m/s
      volumeFlow: airflowRate, // CFM
      massFlow: Math.round(velocity * ductArea * 1.2 * 100) / 100, // kg/s (assuming air density 1.2 kg/m³)
    },
    pressureDropAnalysis,
    velocityAnalysis,
    reynoldsNumber: Math.round(reynoldsNumber),
    flowRegime: getFlowRegime(reynoldsNumber),
    noiseAnalysis: analyzeNoise(velocity, ductArea),
  };
}

function calculatePressureDrop(velocity: number, length: number, width: number, height: number, componentType: string) {
  const hydraulicDiameter = (4 * width * height) / (2 * (width + height)) / 1000; // m
  const frictionFactor = 0.02; // Simplified friction factor for smooth ducts
  
  // Straight duct pressure drop
  const straightPressureDrop = frictionFactor * (length / 1000) / hydraulicDiameter * 0.5 * 1.2 * Math.pow(velocity, 2);
  
  // Component pressure drop
  const componentFactors = {
    rectangular_duct: 0,
    transition_fitting: 0.2,
    elbow_fitting: 0.5,
    branch_fitting: 0.8,
    reducer_fitting: 0.3,
    damper_frame: 0.1,
    access_panel: 0.05,
    plenum_box: 0.4,
  };
  
  const componentFactor = componentFactors[componentType] || 0;
  const componentPressureDrop = componentFactor * 0.5 * 1.2 * Math.pow(velocity, 2);
  
  const totalPressureDrop = straightPressureDrop + componentPressureDrop;
  
  return {
    straightDuctLoss: Math.round(straightPressureDrop * 100) / 100, // Pa
    componentLoss: Math.round(componentPressureDrop * 100) / 100, // Pa
    totalPressureDrop: Math.round(totalPressureDrop * 100) / 100, // Pa
    pressureClass: getPressureClassification(totalPressureDrop),
    recommendation: getPressureRecommendation(totalPressureDrop, velocity),
  };
}

function getPressureClassification(pressureDrop: number) {
  if (pressureDrop < 50) return 'Low pressure drop - Excellent';
  if (pressureDrop < 150) return 'Moderate pressure drop - Good';
  if (pressureDrop < 300) return 'High pressure drop - Acceptable';
  return 'Very high pressure drop - Review design';
}

function getPressureRecommendation(pressureDrop: number, velocity: number) {
  const recommendations = [];
  
  if (pressureDrop > 300) {
    recommendations.push('Consider increasing duct size to reduce pressure drop');
    recommendations.push('Review system design for optimization opportunities');
  }
  
  if (velocity > 12) {
    recommendations.push('High velocity may cause noise issues');
    recommendations.push('Consider acoustic treatment or velocity reduction');
  }
  
  if (velocity < 3) {
    recommendations.push('Low velocity may cause poor air distribution');
    recommendations.push('Verify adequate air mixing and distribution');
  }
  
  return recommendations;
}

function analyzeVelocity(velocity: number, componentType: string) {
  const recommendedRanges = {
    rectangular_duct: { min: 4, max: 10, optimal: 7 },
    transition_fitting: { min: 4, max: 12, optimal: 8 },
    elbow_fitting: { min: 4, max: 10, optimal: 7 },
    branch_fitting: { min: 4, max: 10, optimal: 7 },
    reducer_fitting: { min: 4, max: 12, optimal: 8 },
    damper_frame: { min: 3, max: 8, optimal: 5 },
    access_panel: { min: 2, max: 6, optimal: 4 },
    plenum_box: { min: 2, max: 5, optimal: 3 },
  };
  
  const range = recommendedRanges[componentType] || recommendedRanges.rectangular_duct;
  
  let rating = 'Good';
  if (velocity < range.min) rating = 'Too Low';
  else if (velocity > range.max) rating = 'Too High';
  else if (Math.abs(velocity - range.optimal) < 1) rating = 'Optimal';
  
  return {
    velocity: Math.round(velocity * 100) / 100,
    recommendedRange: `${range.min}-${range.max} m/s`,
    optimalVelocity: `${range.optimal} m/s`,
    rating,
    energyEfficiency: getEnergyEfficiency(velocity, range.optimal),
    noiseRisk: getNoiseRisk(velocity),
  };
}

function getEnergyEfficiency(actual: number, optimal: number) {
  const deviation = Math.abs(actual - optimal) / optimal;
  
  if (deviation < 0.1) return 'Excellent';
  if (deviation < 0.2) return 'Very Good';
  if (deviation < 0.3) return 'Good';
  if (deviation < 0.5) return 'Fair';
  return 'Poor';
}

function getNoiseRisk(velocity: number) {
  if (velocity > 15) return 'Very High - Noise mitigation required';
  if (velocity > 12) return 'High - Consider acoustic treatment';
  if (velocity > 8) return 'Moderate - Monitor noise levels';
  if (velocity > 4) return 'Low - Acceptable noise levels';
  return 'Very Low - Quiet operation';
}

function calculateReynoldsNumber(velocity: number, width: number, height: number) {
  const hydraulicDiameter = (4 * width * height) / (2 * (width + height)) / 1000; // m
  const kinematicViscosity = 1.5e-5; // m²/s for air at 20°C
  
  return (velocity * hydraulicDiameter) / kinematicViscosity;
}

function getFlowRegime(reynoldsNumber: number) {
  if (reynoldsNumber < 2300) return 'Laminar Flow';
  if (reynoldsNumber < 4000) return 'Transitional Flow';
  return 'Turbulent Flow';
}

function analyzeNoise(velocity: number, ductArea: number) {
  // Simplified noise calculation
  const baseNoise = 20 * Math.log10(velocity) + 10 * Math.log10(ductArea) + 40;
  
  return {
    estimatedNoiseLevel: Math.round(baseNoise), // dB
    noiseRating: getNoiseRating(baseNoise),
    mitigationOptions: getNoiseMitigation(baseNoise, velocity),
  };
}

function getNoiseRating(noiseLevel: number) {
  if (noiseLevel < 35) return 'Very Quiet - Suitable for all applications';
  if (noiseLevel < 45) return 'Quiet - Suitable for offices and residential';
  if (noiseLevel < 55) return 'Moderate - Acceptable for commercial';
  if (noiseLevel < 65) return 'Loud - Industrial applications only';
  return 'Very Loud - Noise control required';
}

function getNoiseMitigation(noiseLevel: number, velocity: number) {
  const options = [];
  
  if (noiseLevel > 55) {
    options.push('Install acoustic lining in ductwork');
    options.push('Add silencers at critical locations');
    options.push('Consider velocity reduction');
  }
  
  if (velocity > 10) {
    options.push('Reduce air velocity through larger ducts');
    options.push('Use gradual transitions instead of abrupt changes');
  }
  
  if (noiseLevel > 45) {
    options.push('Isolate ductwork from structure');
    options.push('Use flexible connections at equipment');
  }
  
  return options;
}

export default hvacDuctworkConfig;
