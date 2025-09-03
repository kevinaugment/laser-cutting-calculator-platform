import { CalculatorConfig } from '../../types/calculator';

export const microComponentConfig: CalculatorConfig = {
  id: 'micro-component',
  name: 'Micro Component Calculator',
  description: 'Specialized calculator for micro-scale components including MEMS devices, micro-optics, and miniaturized parts with extreme precision and micro-manufacturing requirements.',
  category: 'precision',
  difficulty: 'expert',
  estimatedTime: '9-10 minutes',
  
  inputs: [
    {
      id: 'componentType',
      label: 'Micro Component Type',
      type: 'select',
      value: 'mems_device',
      options: [
        { value: 'mems_device', label: 'MEMS Device' },
        { value: 'micro_optics', label: 'Micro-Optics Component' },
        { value: 'microfluidic_chip', label: 'Microfluidic Chip' },
        { value: 'micro_sensor', label: 'Micro Sensor' },
        { value: 'micro_actuator', label: 'Micro Actuator' },
        { value: 'micro_connector', label: 'Micro Connector' },
        { value: 'micro_spring', label: 'Micro Spring/Flexure' },
        { value: 'micro_gear', label: 'Micro Gear/Mechanism' },
      ],
      required: true,
      description: 'Type of micro-scale component',
    },
    {
      id: 'materialType',
      label: 'Material Type',
      type: 'select',
      value: 'silicon',
      options: [
        { value: 'silicon', label: 'Silicon (Single Crystal)' },
        { value: 'silicon_carbide', label: 'Silicon Carbide (SiC)' },
        { value: 'sapphire', label: 'Sapphire (Al₂O₃)' },
        { value: 'quartz', label: 'Quartz (SiO₂)' },
        { value: 'titanium_foil', label: 'Titanium Foil' },
        { value: 'stainless_foil', label: 'Stainless Steel Foil' },
        { value: 'nickel_foil', label: 'Nickel Foil' },
        { value: 'polyimide', label: 'Polyimide Film' },
        { value: 'glass', label: 'Specialty Glass' },
        { value: 'ceramic', label: 'Technical Ceramic' },
      ],
      required: true,
      description: 'Material for micro-component fabrication',
    },
    {
      id: 'componentThickness',
      label: 'Component Thickness',
      type: 'number',
      value: 0.1,
      unit: 'mm',
      min: 0.001,
      max: 1.0,
      step: 0.001,
      required: true,
      description: 'Thickness of micro component',
    },
    {
      id: 'featureSize',
      label: 'Minimum Feature Size',
      type: 'select',
      value: 'sub_10_micron',
      options: [
        { value: 'macro_scale', label: 'Macro Scale (> 100μm)' },
        { value: 'micro_scale', label: 'Micro Scale (10-100μm)' },
        { value: 'sub_10_micron', label: 'Sub-10 Micron (1-10μm)' },
        { value: 'sub_micron', label: 'Sub-micron (0.1-1μm)' },
        { value: 'nano_scale', label: 'Nano Scale (< 0.1μm)' },
      ],
      required: true,
      description: 'Smallest feature size in the component',
    },
    {
      id: 'aspectRatio',
      label: 'Aspect Ratio',
      type: 'select',
      value: 'moderate',
      options: [
        { value: 'low', label: 'Low (< 5:1)' },
        { value: 'moderate', label: 'Moderate (5:1 to 20:1)' },
        { value: 'high', label: 'High (20:1 to 50:1)' },
        { value: 'extreme', label: 'Extreme (> 50:1)' },
      ],
      required: true,
      description: 'Aspect ratio of features (depth:width)',
    },
    {
      id: 'toleranceRequirement',
      label: 'Tolerance Requirement',
      type: 'select',
      value: 'micro_precision',
      options: [
        { value: 'standard_micro', label: 'Standard Micro (±5μm)' },
        { value: 'micro_precision', label: 'Micro Precision (±1μm)' },
        { value: 'sub_micron', label: 'Sub-micron (±0.5μm)' },
        { value: 'nano_precision', label: 'Nano Precision (±0.1μm)' },
        { value: 'atomic_level', label: 'Atomic Level (±0.01μm)' },
      ],
      required: true,
      description: 'Required dimensional tolerance',
    },
    {
      id: 'surfaceRoughness',
      label: 'Surface Roughness',
      type: 'select',
      value: 'optical_quality',
      options: [
        { value: 'standard_finish', label: 'Standard Finish (Ra 1μm)' },
        { value: 'smooth_finish', label: 'Smooth Finish (Ra 0.5μm)' },
        { value: 'optical_quality', label: 'Optical Quality (Ra 0.1μm)' },
        { value: 'mirror_finish', label: 'Mirror Finish (Ra 0.05μm)' },
        { value: 'atomic_smooth', label: 'Atomic Smooth (Ra 0.01μm)' },
      ],
      required: true,
      description: 'Required surface finish quality',
    },
    {
      id: 'functionalRequirement',
      label: 'Functional Requirement',
      type: 'select',
      value: 'mechanical_function',
      options: [
        { value: 'mechanical_function', label: 'Mechanical Function' },
        { value: 'optical_function', label: 'Optical Function' },
        { value: 'fluidic_function', label: 'Fluidic Function' },
        { value: 'electrical_function', label: 'Electrical Function' },
        { value: 'thermal_function', label: 'Thermal Function' },
        { value: 'multi_functional', label: 'Multi-functional' },
      ],
      required: true,
      description: 'Primary functional requirement',
    },
    {
      id: 'operatingEnvironment',
      label: 'Operating Environment',
      type: 'select',
      value: 'controlled_lab',
      options: [
        { value: 'controlled_lab', label: 'Controlled Laboratory' },
        { value: 'ambient_conditions', label: 'Ambient Conditions' },
        { value: 'harsh_environment', label: 'Harsh Environment' },
        { value: 'biological_media', label: 'Biological Media' },
        { value: 'vacuum_environment', label: 'Vacuum Environment' },
        { value: 'high_temperature', label: 'High Temperature' },
        { value: 'cryogenic', label: 'Cryogenic Conditions' },
      ],
      required: true,
      description: 'Operating environment conditions',
    },
    {
      id: 'productionVolume',
      label: 'Production Volume',
      type: 'select',
      value: 'research_prototype',
      options: [
        { value: 'research_prototype', label: 'Research Prototype (1-10 units)' },
        { value: 'small_batch', label: 'Small Batch (10-100 units)' },
        { value: 'pilot_production', label: 'Pilot Production (100-1000 units)' },
        { value: 'volume_production', label: 'Volume Production (1000+ units)' },
      ],
      required: true,
      description: 'Expected production volume',
    },
  ],

  outputs: [
    {
      id: 'microFabricationAnalysis',
      label: 'Micro-Fabrication Analysis',
      type: 'object',
      format: 'micro-fabrication-specs',
      description: 'Micro-manufacturing process and capability analysis',
    },
    {
      id: 'precisionRequirements',
      label: 'Precision Requirements',
      type: 'object',
      format: 'micro-precision-specs',
      description: 'Ultra-high precision manufacturing specifications',
    },
    {
      id: 'functionalAnalysis',
      label: 'Functional Analysis',
      type: 'object',
      format: 'micro-functional-specs',
      description: 'Functional performance and reliability analysis',
    },
    {
      id: 'manufacturingCost',
      label: 'Manufacturing Cost',
      type: 'object',
      format: 'micro-cost-analysis',
      description: 'Micro-component manufacturing cost analysis',
    },
  ],

  calculate: (inputs: Record<string, any>) => {
    const {
      componentType,
      materialType,
      componentThickness,
      featureSize,
      aspectRatio,
      toleranceRequirement,
      surfaceRoughness,
      functionalRequirement,
      operatingEnvironment,
      productionVolume,
    } = inputs;

    // Analyze micro-fabrication requirements
    const microFabricationAnalysis = analyzeMicroFabrication(
      componentType,
      materialType,
      featureSize,
      aspectRatio,
      componentThickness
    );

    // Define precision requirements
    const precisionRequirements = defineMicroPrecisionRequirements(
      toleranceRequirement,
      surfaceRoughness,
      featureSize,
      materialType,
      componentType
    );

    // Analyze functional performance
    const functionalAnalysis = analyzeMicroFunctionalPerformance(
      functionalRequirement,
      componentType,
      materialType,
      operatingEnvironment,
      featureSize
    );

    // Calculate manufacturing costs
    const manufacturingCost = calculateMicroManufacturingCost(
      componentType,
      materialType,
      componentThickness,
      featureSize,
      toleranceRequirement,
      productionVolume,
      microFabricationAnalysis
    );

    return {
      microFabricationAnalysis,
      precisionRequirements,
      functionalAnalysis,
      manufacturingCost,
    };
  },

  validation: {
    componentThickness: {
      min: 0.001,
      max: 1.0,
      message: 'Component thickness must be between 0.001mm and 1.0mm for micro components',
    },
  },

  examples: [
    {
      name: 'MEMS Accelerometer',
      description: 'Silicon MEMS accelerometer with sub-micron features',
      inputs: {
        componentType: 'mems_device',
        materialType: 'silicon',
        componentThickness: 0.05,
        featureSize: 'sub_micron',
        aspectRatio: 'high',
        toleranceRequirement: 'nano_precision',
        surfaceRoughness: 'atomic_smooth',
        functionalRequirement: 'mechanical_function',
        operatingEnvironment: 'controlled_lab',
        productionVolume: 'pilot_production',
      },
    },
    {
      name: 'Microfluidic Chip',
      description: 'Glass microfluidic chip for biological applications',
      inputs: {
        componentType: 'microfluidic_chip',
        materialType: 'glass',
        componentThickness: 0.2,
        featureSize: 'sub_10_micron',
        aspectRatio: 'moderate',
        toleranceRequirement: 'micro_precision',
        surfaceRoughness: 'optical_quality',
        functionalRequirement: 'fluidic_function',
        operatingEnvironment: 'biological_media',
        productionVolume: 'small_batch',
      },
    },
  ],

  tags: ['micro', 'mems', 'precision', 'nano-scale', 'micro-fabrication'],
  
  relatedCalculators: [
    'mems-fabrication',
    'micro-optics',
    'nano-precision',
    'micro-assembly',
  ],

  learningResources: [
    {
      title: 'MEMS Fabrication Techniques',
      type: 'article',
      url: '/learn/mems-fabrication',
    },
    {
      title: 'Micro-Laser Processing',
      type: 'video',
      url: '/learn/micro-laser-processing',
    },
  ],
};

// Helper functions
function analyzeMicroFabrication(
  componentType: string,
  materialType: string,
  featureSize: string,
  aspectRatio: string,
  thickness: number
) {
  const fabricationMethods = getMicroFabricationMethods(componentType, materialType, featureSize);
  const processCapabilities = getProcessCapabilities(featureSize, aspectRatio, materialType);
  const equipmentRequirements = getEquipmentRequirements(featureSize, materialType);
  
  return {
    fabricationMethods,
    processCapabilities,
    equipmentRequirements,
    materialProcessing: getMaterialProcessingRequirements(materialType, featureSize),
    qualityControl: getMicroQualityControl(featureSize, componentType),
    environmentalRequirements: getMicroEnvironmentalRequirements(featureSize),
  };
}

function getMicroFabricationMethods(componentType: string, materialType: string, featureSize: string) {
  const methods = [];
  
  // Primary fabrication method based on feature size
  if (featureSize === 'nano_scale') {
    methods.push({
      method: 'Electron Beam Lithography',
      resolution: '< 10 nm',
      advantages: ['Highest resolution', 'Arbitrary patterns'],
      limitations: ['Very slow', 'Extremely expensive'],
    });
    methods.push({
      method: 'Focused Ion Beam (FIB)',
      resolution: '< 50 nm',
      advantages: ['Direct write', 'No mask required'],
      limitations: ['Serial process', 'Ion damage'],
    });
  } else if (featureSize === 'sub_micron') {
    methods.push({
      method: 'Deep UV Lithography',
      resolution: '100-500 nm',
      advantages: ['High throughput', 'Established process'],
      limitations: ['Requires masks', 'Equipment cost'],
    });
    methods.push({
      method: 'Femtosecond Laser Ablation',
      resolution: '200-800 nm',
      advantages: ['Maskless', 'Direct processing'],
      limitations: ['Heat affected zone', 'Surface roughness'],
    });
  } else if (featureSize === 'sub_10_micron') {
    methods.push({
      method: 'UV Laser Micromachining',
      resolution: '1-10 μm',
      advantages: ['Fast processing', 'Good edge quality'],
      limitations: ['Limited materials', 'Thermal effects'],
    });
    methods.push({
      method: 'Photolithography + Etching',
      resolution: '2-20 μm',
      advantages: ['High precision', 'Parallel processing'],
      limitations: ['Multi-step process', 'Material dependent'],
    });
  } else {
    methods.push({
      method: 'Precision Laser Cutting',
      resolution: '10-100 μm',
      advantages: ['Versatile', 'Cost effective'],
      limitations: ['Limited precision', 'Heat effects'],
    });
    methods.push({
      method: 'Micro-EDM',
      resolution: '5-50 μm',
      advantages: ['Conductive materials', 'High aspect ratios'],
      limitations: ['Slow process', 'Surface finish'],
    });
  }
  
  // Material-specific considerations
  if (materialType === 'silicon') {
    methods.push({
      method: 'Deep Reactive Ion Etching (DRIE)',
      resolution: '1-100 μm',
      advantages: ['High aspect ratios', 'Anisotropic'],
      limitations: ['Silicon only', 'Complex process'],
    });
  }
  
  if (materialType === 'glass') {
    methods.push({
      method: 'Wet Chemical Etching',
      resolution: '5-100 μm',
      advantages: ['Smooth surfaces', 'Isotropic'],
      limitations: ['Undercutting', 'Chemical handling'],
    });
  }
  
  return methods;
}

function getProcessCapabilities(featureSize: string, aspectRatio: string, materialType: string) {
  const capabilities = {
    minimumFeatureSize: getMinimumFeatureSize(featureSize),
    maximumAspectRatio: getMaximumAspectRatio(aspectRatio, featureSize),
    toleranceCapability: getToleranceCapability(featureSize),
    surfaceQuality: getSurfaceQualityCapability(featureSize, materialType),
    throughput: getThroughputCapability(featureSize),
  };
  
  return capabilities;
}

function getMinimumFeatureSize(featureSize: string) {
  const sizes = {
    macro_scale: '100 μm',
    micro_scale: '10 μm',
    sub_10_micron: '1 μm',
    sub_micron: '0.1 μm',
    nano_scale: '0.01 μm',
  };
  
  return sizes[featureSize] || '10 μm';
}

function getMaximumAspectRatio(aspectRatio: string, featureSize: string) {
  const ratios = {
    low: '5:1',
    moderate: '20:1',
    high: '50:1',
    extreme: '100:1',
  };
  
  const baseRatio = ratios[aspectRatio] || '20:1';
  
  // Adjust based on feature size
  if (['nano_scale', 'sub_micron'].includes(featureSize)) {
    return `${baseRatio} (challenging at nano-scale)`;
  }
  
  return baseRatio;
}

function getToleranceCapability(featureSize: string) {
  const tolerances = {
    macro_scale: '±5 μm',
    micro_scale: '±1 μm',
    sub_10_micron: '±0.5 μm',
    sub_micron: '±0.1 μm',
    nano_scale: '±0.01 μm',
  };
  
  return tolerances[featureSize] || '±1 μm';
}

function getSurfaceQualityCapability(featureSize: string, materialType: string) {
  const qualities = {
    nano_scale: 'Ra < 10 nm (atomic level)',
    sub_micron: 'Ra < 50 nm (optical quality)',
    sub_10_micron: 'Ra < 200 nm (precision)',
    micro_scale: 'Ra < 500 nm (standard)',
    macro_scale: 'Ra < 1 μm (general)',
  };
  
  let quality = qualities[featureSize] || 'Ra < 500 nm';
  
  // Material-specific adjustments
  if (materialType === 'silicon') {
    quality += ' (excellent with proper etching)';
  } else if (materialType === 'glass') {
    quality += ' (very good with chemical etching)';
  }
  
  return quality;
}

function getThroughputCapability(featureSize: string) {
  const throughputs = {
    nano_scale: 'Very Low (serial processes)',
    sub_micron: 'Low (limited parallelization)',
    sub_10_micron: 'Moderate (some parallel processing)',
    micro_scale: 'Good (parallel processing possible)',
    macro_scale: 'High (fast processing)',
  };
  
  return throughputs[featureSize] || 'Moderate';
}

function getEquipmentRequirements(featureSize: string, materialType: string) {
  const requirements = [];
  
  if (['nano_scale', 'sub_micron'].includes(featureSize)) {
    requirements.push('Clean room Class 10 or better');
    requirements.push('Vibration isolation systems');
    requirements.push('Temperature control ±0.01°C');
    requirements.push('Humidity control ±1%');
    requirements.push('Specialized nano-fabrication equipment');
  } else if (featureSize === 'sub_10_micron') {
    requirements.push('Clean room Class 100');
    requirements.push('Precision environmental control');
    requirements.push('High-resolution imaging systems');
    requirements.push('Micro-fabrication equipment');
  } else {
    requirements.push('Controlled manufacturing environment');
    requirements.push('Precision machining equipment');
    requirements.push('Quality measurement systems');
  }
  
  // Material-specific equipment
  if (materialType === 'silicon') {
    requirements.push('Silicon processing equipment');
    requirements.push('Plasma etching systems');
  } else if (materialType === 'glass') {
    requirements.push('Glass processing capabilities');
    requirements.push('Chemical etching facilities');
  }
  
  return requirements;
}

function getMaterialProcessingRequirements(materialType: string, featureSize: string) {
  const materials = {
    silicon: {
      processingMethod: 'Semiconductor fabrication techniques',
      specialRequirements: ['Clean room processing', 'Wafer handling'],
      challenges: ['Crystal orientation effects', 'Doping considerations'],
      advantages: ['Excellent precision', 'Established processes'],
    },
    silicon_carbide: {
      processingMethod: 'Advanced ceramic processing',
      specialRequirements: ['High-temperature processing', 'Hard material tooling'],
      challenges: ['Difficult to machine', 'Chemical inertness'],
      advantages: ['High temperature stability', 'Chemical resistance'],
    },
    sapphire: {
      processingMethod: 'Single crystal processing',
      specialRequirements: ['Diamond tooling', 'Crystal orientation'],
      challenges: ['Very hard material', 'Expensive processing'],
      advantages: ['Optical transparency', 'Chemical inertness'],
    },
    quartz: {
      processingMethod: 'Glass processing techniques',
      specialRequirements: ['Thermal shock prevention', 'Clean surfaces'],
      challenges: ['Brittle material', 'Thermal sensitivity'],
      advantages: ['Low thermal expansion', 'Optical properties'],
    },
    titanium_foil: {
      processingMethod: 'Thin metal processing',
      specialRequirements: ['Inert atmosphere', 'Gentle handling'],
      challenges: ['Work hardening', 'Oxidation'],
      advantages: ['Biocompatibility', 'Corrosion resistance'],
    },
    stainless_foil: {
      processingMethod: 'Stainless steel processing',
      specialRequirements: ['Heat management', 'Work hardening control'],
      challenges: ['Heat affected zone', 'Burr formation'],
      advantages: ['Good machinability', 'Cost effective'],
    },
    nickel_foil: {
      processingMethod: 'Nickel alloy processing',
      specialRequirements: ['Controlled atmosphere', 'Stress relief'],
      challenges: ['Work hardening', 'Magnetic properties'],
      advantages: ['Good formability', 'Electrical properties'],
    },
    polyimide: {
      processingMethod: 'Polymer processing',
      specialRequirements: ['Temperature control', 'Chemical compatibility'],
      challenges: ['Thermal degradation', 'Dimensional stability'],
      advantages: ['Flexibility', 'Chemical resistance'],
    },
    glass: {
      processingMethod: 'Glass micromachining',
      specialRequirements: ['Thermal management', 'Clean processing'],
      challenges: ['Brittle fracture', 'Thermal stress'],
      advantages: ['Optical transparency', 'Chemical inertness'],
    },
    ceramic: {
      processingMethod: 'Technical ceramic processing',
      specialRequirements: ['Diamond tooling', 'Controlled atmosphere'],
      challenges: ['Hardness', 'Brittleness'],
      advantages: ['High temperature stability', 'Wear resistance'],
    },
  };
  
  const material = materials[materialType] || materials.silicon;
  
  // Add feature size specific considerations
  if (['nano_scale', 'sub_micron'].includes(featureSize)) {
    material.specialRequirements.push('Atomic-level surface control');
    material.specialRequirements.push('Contamination-free processing');
  }
  
  return material;
}

function getMicroQualityControl(featureSize: string, componentType: string) {
  const requirements = {
    inspection: [],
    measurement: [],
    testing: [],
    documentation: [],
  };
  
  // Inspection requirements based on feature size
  if (featureSize === 'nano_scale') {
    requirements.inspection.push('Scanning electron microscopy (SEM)');
    requirements.inspection.push('Atomic force microscopy (AFM)');
    requirements.inspection.push('Transmission electron microscopy (TEM)');
    requirements.inspection.push('X-ray photoelectron spectroscopy (XPS)');
  } else if (featureSize === 'sub_micron') {
    requirements.inspection.push('High-resolution SEM');
    requirements.inspection.push('Optical profilometry');
    requirements.inspection.push('White light interferometry');
    requirements.inspection.push('Confocal microscopy');
  } else if (featureSize === 'sub_10_micron') {
    requirements.inspection.push('Optical microscopy');
    requirements.inspection.push('Coordinate measuring machine (CMM)');
    requirements.inspection.push('Laser scanning microscopy');
    requirements.inspection.push('Surface profilometry');
  } else {
    requirements.inspection.push('Standard optical inspection');
    requirements.inspection.push('Dimensional measurement');
    requirements.inspection.push('Surface quality assessment');
  }
  
  // Measurement requirements
  requirements.measurement.push('Dimensional verification');
  requirements.measurement.push('Surface roughness measurement');
  requirements.measurement.push('Feature size validation');
  requirements.measurement.push('Geometric tolerance checking');
  
  // Component-specific testing
  if (componentType === 'mems_device') {
    requirements.testing.push('Functional testing');
    requirements.testing.push('Reliability testing');
    requirements.testing.push('Environmental testing');
  } else if (componentType === 'micro_optics') {
    requirements.testing.push('Optical performance testing');
    requirements.testing.push('Wavefront analysis');
    requirements.testing.push('Transmission/reflection measurement');
  } else if (componentType === 'microfluidic_chip') {
    requirements.testing.push('Flow rate testing');
    requirements.testing.push('Pressure drop measurement');
    requirements.testing.push('Leak testing');
  }
  
  // Documentation requirements
  requirements.documentation.push('Complete dimensional reports');
  requirements.documentation.push('Surface quality documentation');
  requirements.documentation.push('Process parameter records');
  requirements.documentation.push('Material certificates');
  requirements.documentation.push('Functional test results');
  
  return requirements;
}

function getMicroEnvironmentalRequirements(featureSize: string) {
  const requirements = {
    cleanRoom: '',
    temperature: '',
    humidity: '',
    vibration: '',
    lighting: '',
    airflow: '',
  };
  
  if (featureSize === 'nano_scale') {
    requirements.cleanRoom = 'Class 1 (ISO 3)';
    requirements.temperature = '±0.01°C';
    requirements.humidity = '±0.5% RH';
    requirements.vibration = '< 0.01 μm';
    requirements.lighting = 'Yellow light (no UV)';
    requirements.airflow = 'Laminar flow, 0.3-0.5 m/s';
  } else if (featureSize === 'sub_micron') {
    requirements.cleanRoom = 'Class 10 (ISO 4)';
    requirements.temperature = '±0.1°C';
    requirements.humidity = '±1% RH';
    requirements.vibration = '< 0.1 μm';
    requirements.lighting = 'Controlled spectrum';
    requirements.airflow = 'Laminar flow, 0.3-0.5 m/s';
  } else if (featureSize === 'sub_10_micron') {
    requirements.cleanRoom = 'Class 100 (ISO 5)';
    requirements.temperature = '±0.5°C';
    requirements.humidity = '±2% RH';
    requirements.vibration = '< 1 μm';
    requirements.lighting = 'Standard clean room';
    requirements.airflow = 'Turbulent flow acceptable';
  } else {
    requirements.cleanRoom = 'Class 1000 (ISO 6)';
    requirements.temperature = '±1°C';
    requirements.humidity = '±5% RH';
    requirements.vibration = '< 10 μm';
    requirements.lighting = 'Standard industrial';
    requirements.airflow = 'Standard ventilation';
  }
  
  return requirements;
}

function defineMicroPrecisionRequirements(
  toleranceReq: string,
  surfaceRoughness: string,
  featureSize: string,
  materialType: string,
  componentType: string
) {
  const toleranceSpecs = getMicroToleranceSpecs(toleranceReq);
  const surfaceSpecs = getMicroSurfaceSpecs(surfaceRoughness);
  const measurementRequirements = getMicroMeasurementRequirements(toleranceReq, featureSize);
  
  return {
    toleranceSpecifications: toleranceSpecs,
    surfaceSpecifications: surfaceSpecs,
    measurementRequirements,
    calibrationRequirements: getMicroCalibrationRequirements(toleranceReq),
    traceabilityRequirements: getMicroTraceabilityRequirements(componentType),
    uncertaintyBudget: getMicroUncertaintyBudget(toleranceReq, featureSize),
  };
}

function getMicroToleranceSpecs(toleranceReq: string) {
  const tolerances = {
    standard_micro: {
      linear: '±5 μm',
      angular: '±0.1°',
      flatness: '2 μm',
      straightness: '1 μm',
      roundness: '2 μm',
      concentricity: '±5 μm',
    },
    micro_precision: {
      linear: '±1 μm',
      angular: '±0.02°',
      flatness: '0.5 μm',
      straightness: '0.2 μm',
      roundness: '0.5 μm',
      concentricity: '±1 μm',
    },
    sub_micron: {
      linear: '±0.5 μm',
      angular: '±0.01°',
      flatness: '0.2 μm',
      straightness: '0.1 μm',
      roundness: '0.2 μm',
      concentricity: '±0.5 μm',
    },
    nano_precision: {
      linear: '±0.1 μm',
      angular: '±0.005°',
      flatness: '0.05 μm',
      straightness: '0.02 μm',
      roundness: '0.05 μm',
      concentricity: '±0.1 μm',
    },
    atomic_level: {
      linear: '±0.01 μm',
      angular: '±0.001°',
      flatness: '0.01 μm',
      straightness: '0.005 μm',
      roundness: '0.01 μm',
      concentricity: '±0.01 μm',
    },
  };
  
  return tolerances[toleranceReq] || tolerances.micro_precision;
}

function getMicroSurfaceSpecs(surfaceRoughness: string) {
  const surfaces = {
    standard_finish: {
      roughness: 'Ra 1 μm',
      waviness: 'Wa 5 μm',
      peakToPeak: 'Rt 8 μm',
      measurement: 'Stylus profilometer',
    },
    smooth_finish: {
      roughness: 'Ra 0.5 μm',
      waviness: 'Wa 2 μm',
      peakToPeak: 'Rt 4 μm',
      measurement: 'Optical profilometer',
    },
    optical_quality: {
      roughness: 'Ra 0.1 μm',
      waviness: 'Wa 0.5 μm',
      peakToPeak: 'Rt 1 μm',
      measurement: 'White light interferometer',
    },
    mirror_finish: {
      roughness: 'Ra 0.05 μm',
      waviness: 'Wa 0.2 μm',
      peakToPeak: 'Rt 0.5 μm',
      measurement: 'Atomic force microscope',
    },
    atomic_smooth: {
      roughness: 'Ra 0.01 μm',
      waviness: 'Wa 0.05 μm',
      peakToPeak: 'Rt 0.1 μm',
      measurement: 'Scanning tunneling microscope',
    },
  };
  
  return surfaces[surfaceRoughness] || surfaces.optical_quality;
}

function getMicroMeasurementRequirements(toleranceReq: string, featureSize: string) {
  const requirements = [];
  
  if (['nano_precision', 'atomic_level'].includes(toleranceReq)) {
    requirements.push('Nanometer-resolution measurement systems');
    requirements.push('Environmental isolation chambers');
    requirements.push('Vibration-free measurement platforms');
    requirements.push('Temperature-controlled metrology');
  } else if (toleranceReq === 'sub_micron') {
    requirements.push('Sub-micron measurement capability');
    requirements.push('High-resolution imaging systems');
    requirements.push('Precision coordinate measurement');
  } else {
    requirements.push('Micron-level measurement systems');
    requirements.push('Optical measurement techniques');
    requirements.push('Standard precision metrology');
  }
  
  if (['nano_scale', 'sub_micron'].includes(featureSize)) {
    requirements.push('Electron microscopy capability');
    requirements.push('Atomic force microscopy');
    requirements.push('Scanning probe techniques');
  }
  
  return requirements;
}

function getMicroCalibrationRequirements(toleranceReq: string) {
  const requirements = {
    frequency: '',
    standards: [],
    traceability: '',
    uncertainty: '',
  };
  
  if (['nano_precision', 'atomic_level'].includes(toleranceReq)) {
    requirements.frequency = 'Monthly or before critical measurements';
    requirements.standards = ['NIST traceable standards', 'Atomic lattice references'];
    requirements.traceability = 'Direct NIST traceability required';
    requirements.uncertainty = 'Uncertainty < 10% of tolerance';
  } else if (toleranceReq === 'sub_micron') {
    requirements.frequency = 'Quarterly calibration';
    requirements.standards = ['Certified reference standards', 'Laser interferometer'];
    requirements.traceability = 'NIST traceable through accredited lab';
    requirements.uncertainty = 'Uncertainty < 20% of tolerance';
  } else {
    requirements.frequency = 'Annual calibration';
    requirements.standards = ['Standard reference artifacts', 'Gauge blocks'];
    requirements.traceability = 'ISO 17025 accredited calibration';
    requirements.uncertainty = 'Uncertainty < 25% of tolerance';
  }
  
  return requirements;
}

function getMicroTraceabilityRequirements(componentType: string) {
  const requirements = [
    'Complete process documentation',
    'Material lot traceability',
    'Equipment calibration records',
    'Environmental condition logs',
    'Operator qualification records',
  ];
  
  if (['mems_device', 'micro_sensor'].includes(componentType)) {
    requirements.push('Functional test data');
    requirements.push('Reliability test results');
    requirements.push('Failure analysis capability');
  }
  
  if (componentType === 'micro_optics') {
    requirements.push('Optical performance data');
    requirements.push('Coating specifications');
    requirements.push('Transmission/reflection curves');
  }
  
  return requirements;
}

function getMicroUncertaintyBudget(toleranceReq: string, featureSize: string) {
  const budget = {
    measurement: '',
    environmental: '',
    material: '',
    process: '',
    total: '',
  };
  
  if (['nano_precision', 'atomic_level'].includes(toleranceReq)) {
    budget.measurement = '±0.005 μm';
    budget.environmental = '±0.002 μm';
    budget.material = '±0.003 μm';
    budget.process = '±0.005 μm';
    budget.total = '±0.008 μm';
  } else if (toleranceReq === 'sub_micron') {
    budget.measurement = '±0.05 μm';
    budget.environmental = '±0.02 μm';
    budget.material = '±0.03 μm';
    budget.process = '±0.05 μm';
    budget.total = '±0.08 μm';
  } else {
    budget.measurement = '±0.2 μm';
    budget.environmental = '±0.1 μm';
    budget.material = '±0.15 μm';
    budget.process = '±0.2 μm';
    budget.total = '±0.3 μm';
  }
  
  return budget;
}

export default microComponentConfig;
