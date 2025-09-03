import { CalculatorConfig } from '../../types/calculator';

export const precisionInstrumentConfig: CalculatorConfig = {
  id: 'precision-instrument',
  name: 'Precision Instrument Calculator',
  description: 'Specialized calculator for precision instruments including measurement devices, optical components, and scientific equipment with ultra-high precision and stability requirements.',
  category: 'precision',
  difficulty: 'expert',
  estimatedTime: '8-9 minutes',
  
  inputs: [
    {
      id: 'instrumentType',
      label: 'Instrument Type',
      type: 'select',
      value: 'measurement_device',
      options: [
        { value: 'measurement_device', label: 'Measurement Device' },
        { value: 'optical_component', label: 'Optical Component' },
        { value: 'scientific_instrument', label: 'Scientific Instrument' },
        { value: 'calibration_standard', label: 'Calibration Standard' },
        { value: 'sensor_housing', label: 'Sensor Housing' },
        { value: 'precision_fixture', label: 'Precision Fixture' },
        { value: 'metrology_tool', label: 'Metrology Tool' },
        { value: 'laboratory_equipment', label: 'Laboratory Equipment' },
      ],
      required: true,
      description: 'Type of precision instrument',
    },
    {
      id: 'materialSelection',
      label: 'Material Selection',
      type: 'select',
      value: 'stainless_316l',
      options: [
        { value: 'stainless_316l', label: 'Stainless Steel 316L' },
        { value: 'stainless_17_4ph', label: 'Stainless Steel 17-4 PH' },
        { value: 'titanium_grade2', label: 'Titanium Grade 2' },
        { value: 'titanium_6al4v', label: 'Titanium Ti-6Al-4V' },
        { value: 'aluminum_6061', label: 'Aluminum 6061-T6' },
        { value: 'aluminum_7075', label: 'Aluminum 7075-T6' },
        { value: 'invar_36', label: 'Invar 36 (Low Expansion)' },
        { value: 'kovar', label: 'Kovar (Glass Sealing)' },
        { value: 'beryllium_copper', label: 'Beryllium Copper' },
        { value: 'tungsten', label: 'Tungsten (Ultra Stable)' },
      ],
      required: true,
      description: 'Material for precision instrument application',
    },
    {
      id: 'componentThickness',
      label: 'Component Thickness',
      type: 'number',
      value: 2.0,
      unit: 'mm',
      min: 0.1,
      max: 20.0,
      step: 0.1,
      required: true,
      description: 'Thickness of precision component',
    },
    {
      id: 'precisionClass',
      label: 'Precision Class',
      type: 'select',
      value: 'ultra_precision',
      options: [
        { value: 'high_precision', label: 'High Precision (±0.01mm)' },
        { value: 'ultra_precision', label: 'Ultra Precision (±0.005mm)' },
        { value: 'micro_precision', label: 'Micro Precision (±0.002mm)' },
        { value: 'nano_precision', label: 'Nano Precision (±0.001mm)' },
        { value: 'atomic_precision', label: 'Atomic Precision (±0.0005mm)' },
      ],
      required: true,
      description: 'Required precision class',
    },
    {
      id: 'surfaceQuality',
      label: 'Surface Quality',
      type: 'select',
      value: 'optical_grade',
      options: [
        { value: 'precision_machined', label: 'Precision Machined (Ra 0.4μm)' },
        { value: 'fine_finish', label: 'Fine Finish (Ra 0.2μm)' },
        { value: 'optical_grade', label: 'Optical Grade (Ra 0.1μm)' },
        { value: 'mirror_finish', label: 'Mirror Finish (Ra 0.05μm)' },
        { value: 'super_mirror', label: 'Super Mirror (Ra 0.025μm)' },
      ],
      required: true,
      description: 'Required surface finish quality',
    },
    {
      id: 'stabilityRequirement',
      label: 'Stability Requirement',
      type: 'select',
      value: 'high_stability',
      options: [
        { value: 'standard_stability', label: 'Standard Stability' },
        { value: 'high_stability', label: 'High Stability (±0.1% over time)' },
        { value: 'ultra_stability', label: 'Ultra Stability (±0.01% over time)' },
        { value: 'metrology_grade', label: 'Metrology Grade (±0.001% over time)' },
        { value: 'reference_standard', label: 'Reference Standard (±0.0001% over time)' },
      ],
      required: true,
      description: 'Long-term dimensional stability requirements',
    },
    {
      id: 'operatingConditions',
      label: 'Operating Conditions',
      type: 'select',
      value: 'controlled_environment',
      options: [
        { value: 'ambient_conditions', label: 'Ambient Conditions' },
        { value: 'controlled_environment', label: 'Controlled Environment (±1°C)' },
        { value: 'precision_environment', label: 'Precision Environment (±0.1°C)' },
        { value: 'metrology_lab', label: 'Metrology Lab (±0.01°C)' },
        { value: 'vacuum_chamber', label: 'Vacuum Chamber' },
        { value: 'cryogenic_conditions', label: 'Cryogenic Conditions' },
      ],
      required: true,
      description: 'Operating environment conditions',
    },
    {
      id: 'measurementAccuracy',
      label: 'Measurement Accuracy',
      type: 'select',
      value: 'sub_micron',
      options: [
        { value: 'standard_accuracy', label: 'Standard Accuracy (±10μm)' },
        { value: 'high_accuracy', label: 'High Accuracy (±1μm)' },
        { value: 'sub_micron', label: 'Sub-micron (±0.1μm)' },
        { value: 'nano_scale', label: 'Nano-scale (±0.01μm)' },
        { value: 'atomic_scale', label: 'Atomic Scale (±0.001μm)' },
      ],
      required: true,
      description: 'Required measurement accuracy',
    },
    {
      id: 'calibrationRequirement',
      label: 'Calibration Requirement',
      type: 'select',
      value: 'nist_traceable',
      options: [
        { value: 'internal_calibration', label: 'Internal Calibration' },
        { value: 'iso_17025', label: 'ISO 17025 Accredited' },
        { value: 'nist_traceable', label: 'NIST Traceable' },
        { value: 'primary_standard', label: 'Primary Standard' },
        { value: 'international_standard', label: 'International Standard' },
      ],
      required: true,
      description: 'Calibration and traceability requirements',
    },
    {
      id: 'productionQuantity',
      label: 'Production Quantity',
      type: 'select',
      value: 'small_batch',
      options: [
        { value: 'one_off', label: 'One-off Custom (1 unit)' },
        { value: 'small_batch', label: 'Small Batch (2-10 units)' },
        { value: 'limited_production', label: 'Limited Production (10-50 units)' },
        { value: 'series_production', label: 'Series Production (50+ units)' },
      ],
      required: true,
      description: 'Expected production quantity',
    },
  ],

  outputs: [
    {
      id: 'precisionAnalysis',
      label: 'Precision Analysis',
      type: 'object',
      format: 'instrument-precision-specs',
      description: 'Ultra-precision manufacturing and tolerance analysis',
    },
    {
      id: 'stabilityAnalysis',
      label: 'Stability Analysis',
      type: 'object',
      format: 'instrument-stability-specs',
      description: 'Long-term dimensional stability and drift analysis',
    },
    {
      id: 'calibrationSpecs',
      label: 'Calibration Specifications',
      type: 'object',
      format: 'instrument-calibration-specs',
      description: 'Calibration and measurement traceability specifications',
    },
    {
      id: 'manufacturingCost',
      label: 'Manufacturing Cost',
      type: 'object',
      format: 'instrument-cost-analysis',
      description: 'Precision instrument manufacturing cost analysis',
    },
  ],

  calculate: (inputs: Record<string, any>) => {
    const {
      instrumentType,
      materialSelection,
      componentThickness,
      precisionClass,
      surfaceQuality,
      stabilityRequirement,
      operatingConditions,
      measurementAccuracy,
      calibrationRequirement,
      productionQuantity,
    } = inputs;

    // Analyze precision requirements
    const precisionAnalysis = analyzePrecisionRequirements(
      precisionClass,
      surfaceQuality,
      measurementAccuracy,
      instrumentType,
      materialSelection
    );

    // Analyze stability requirements
    const stabilityAnalysis = analyzeStabilityRequirements(
      stabilityRequirement,
      materialSelection,
      operatingConditions,
      componentThickness,
      instrumentType
    );

    // Define calibration specifications
    const calibrationSpecs = defineCalibrationSpecifications(
      calibrationRequirement,
      measurementAccuracy,
      instrumentType,
      stabilityRequirement
    );

    // Calculate manufacturing costs
    const manufacturingCost = calculatePrecisionManufacturingCost(
      instrumentType,
      materialSelection,
      componentThickness,
      precisionClass,
      surfaceQuality,
      productionQuantity,
      precisionAnalysis
    );

    return {
      precisionAnalysis,
      stabilityAnalysis,
      calibrationSpecs,
      manufacturingCost,
    };
  },

  validation: {
    componentThickness: {
      min: 0.1,
      max: 20.0,
      message: 'Component thickness must be between 0.1mm and 20.0mm for precision instruments',
    },
  },

  examples: [
    {
      name: 'Optical Measurement Device',
      description: 'Ultra-precision optical measurement component',
      inputs: {
        instrumentType: 'optical_component',
        materialSelection: 'invar_36',
        componentThickness: 5.0,
        precisionClass: 'nano_precision',
        surfaceQuality: 'super_mirror',
        stabilityRequirement: 'metrology_grade',
        operatingConditions: 'metrology_lab',
        measurementAccuracy: 'nano_scale',
        calibrationRequirement: 'nist_traceable',
        productionQuantity: 'small_batch',
      },
    },
    {
      name: 'Calibration Standard',
      description: 'Primary calibration standard for dimensional metrology',
      inputs: {
        instrumentType: 'calibration_standard',
        materialSelection: 'tungsten',
        componentThickness: 10.0,
        precisionClass: 'atomic_precision',
        surfaceQuality: 'mirror_finish',
        stabilityRequirement: 'reference_standard',
        operatingConditions: 'precision_environment',
        measurementAccuracy: 'atomic_scale',
        calibrationRequirement: 'primary_standard',
        productionQuantity: 'one_off',
      },
    },
  ],

  tags: ['precision', 'metrology', 'calibration', 'ultra-precision', 'stability'],
  
  relatedCalculators: [
    'ultra-precision-cutting',
    'dimensional-stability',
    'surface-finish-optimization',
    'metrology-standards',
  ],

  learningResources: [
    {
      title: 'Precision Instrument Design',
      type: 'article',
      url: '/learn/precision-instrument-design',
    },
    {
      title: 'Ultra-Precision Manufacturing',
      type: 'video',
      url: '/learn/ultra-precision-manufacturing',
    },
  ],
};

// Helper functions
function analyzePrecisionRequirements(
  precisionClass: string,
  surfaceQuality: string,
  measurementAccuracy: string,
  instrumentType: string,
  materialSelection: string
) {
  const toleranceSpecs = getPrecisionToleranceSpecs(precisionClass);
  const surfaceSpecs = getSurfaceQualitySpecs(surfaceQuality);
  const manufacturingRequirements = getUltraPrecisionManufacturingRequirements(precisionClass, surfaceQuality);
  
  return {
    toleranceSpecifications: toleranceSpecs,
    surfaceSpecifications: surfaceSpecs,
    manufacturingRequirements,
    materialSuitability: assessMaterialSuitability(materialSelection, precisionClass),
    qualityControl: getUltraPrecisionQualityControl(precisionClass, instrumentType),
    environmentalRequirements: getManufacturingEnvironmentRequirements(precisionClass),
  };
}

function getPrecisionToleranceSpecs(precisionClass: string) {
  const tolerances = {
    high_precision: {
      linear: '±0.01mm',
      angular: '±0.1°',
      flatness: '0.005mm',
      straightness: '0.003mm',
      roundness: '0.005mm',
      concentricity: '±0.01mm',
      parallelism: '±0.005mm',
      perpendicularity: '±0.005mm',
    },
    ultra_precision: {
      linear: '±0.005mm',
      angular: '±0.05°',
      flatness: '0.002mm',
      straightness: '0.001mm',
      roundness: '0.002mm',
      concentricity: '±0.005mm',
      parallelism: '±0.002mm',
      perpendicularity: '±0.002mm',
    },
    micro_precision: {
      linear: '±0.002mm',
      angular: '±0.02°',
      flatness: '0.001mm',
      straightness: '0.0005mm',
      roundness: '0.001mm',
      concentricity: '±0.002mm',
      parallelism: '±0.001mm',
      perpendicularity: '±0.001mm',
    },
    nano_precision: {
      linear: '±0.001mm',
      angular: '±0.01°',
      flatness: '0.0005mm',
      straightness: '0.0002mm',
      roundness: '0.0005mm',
      concentricity: '±0.001mm',
      parallelism: '±0.0005mm',
      perpendicularity: '±0.0005mm',
    },
    atomic_precision: {
      linear: '±0.0005mm',
      angular: '±0.005°',
      flatness: '0.0002mm',
      straightness: '0.0001mm',
      roundness: '0.0002mm',
      concentricity: '±0.0005mm',
      parallelism: '±0.0002mm',
      perpendicularity: '±0.0002mm',
    },
  };
  
  return tolerances[precisionClass] || tolerances.ultra_precision;
}

function getSurfaceQualitySpecs(surfaceQuality: string) {
  const surfaces = {
    precision_machined: {
      roughness: 'Ra 0.4μm',
      waviness: 'Wa 2.0μm',
      lay: 'Multidirectional',
      defects: 'No visible tool marks',
      measurement: 'Stylus profilometer',
    },
    fine_finish: {
      roughness: 'Ra 0.2μm',
      waviness: 'Wa 1.0μm',
      lay: 'Controlled direction',
      defects: 'No scratches > 0.5μm',
      measurement: 'Optical profilometer',
    },
    optical_grade: {
      roughness: 'Ra 0.1μm',
      waviness: 'Wa 0.5μm',
      lay: 'Random',
      defects: 'No scratches > 0.2μm',
      measurement: 'White light interferometer',
    },
    mirror_finish: {
      roughness: 'Ra 0.05μm',
      waviness: 'Wa 0.2μm',
      lay: 'Random',
      defects: 'No visible defects',
      measurement: 'Atomic force microscope',
    },
    super_mirror: {
      roughness: 'Ra 0.025μm',
      waviness: 'Wa 0.1μm',
      lay: 'Atomic level',
      defects: 'Atomic level smoothness',
      measurement: 'Scanning tunneling microscope',
    },
  };
  
  return surfaces[surfaceQuality] || surfaces.optical_grade;
}

function getUltraPrecisionManufacturingRequirements(precisionClass: string, surfaceQuality: string) {
  const requirements = [];
  
  if (precisionClass === 'atomic_precision' || surfaceQuality === 'super_mirror') {
    requirements.push('Ultra-precision diamond turning');
    requirements.push('Vibration-isolated manufacturing environment');
    requirements.push('Temperature control ±0.01°C');
    requirements.push('Humidity control ±1%');
    requirements.push('Clean room Class 100 or better');
    requirements.push('Atomic-level surface metrology');
  } else if (precisionClass === 'nano_precision' || surfaceQuality === 'mirror_finish') {
    requirements.push('Precision diamond turning or grinding');
    requirements.push('Vibration control systems');
    requirements.push('Temperature control ±0.1°C');
    requirements.push('Humidity control ±2%');
    requirements.push('Clean room Class 1000');
    requirements.push('Nanometer-level metrology');
  } else if (precisionClass === 'micro_precision' || surfaceQuality === 'optical_grade') {
    requirements.push('High-precision machining centers');
    requirements.push('Environmental control systems');
    requirements.push('Temperature control ±0.5°C');
    requirements.push('Clean manufacturing environment');
    requirements.push('Sub-micron metrology equipment');
  } else {
    requirements.push('Precision machining equipment');
    requirements.push('Controlled manufacturing environment');
    requirements.push('Calibrated measurement systems');
    requirements.push('Quality control procedures');
  }
  
  return requirements;
}

function assessMaterialSuitability(materialSelection: string, precisionClass: string) {
  const materials = {
    stainless_316l: {
      stability: 'Good',
      machinability: 'Good',
      thermalExpansion: '16.0 × 10⁻⁶ /°C',
      suitability: 'Good for general precision applications',
    },
    stainless_17_4ph: {
      stability: 'Very Good',
      machinability: 'Good',
      thermalExpansion: '10.8 × 10⁻⁶ /°C',
      suitability: 'Excellent for high-strength precision parts',
    },
    titanium_grade2: {
      stability: 'Excellent',
      machinability: 'Moderate',
      thermalExpansion: '8.6 × 10⁻⁶ /°C',
      suitability: 'Excellent for corrosive environments',
    },
    titanium_6al4v: {
      stability: 'Excellent',
      machinability: 'Challenging',
      thermalExpansion: '8.6 × 10⁻⁶ /°C',
      suitability: 'Excellent for high-strength applications',
    },
    aluminum_6061: {
      stability: 'Good',
      machinability: 'Excellent',
      thermalExpansion: '23.6 × 10⁻⁶ /°C',
      suitability: 'Good for moderate precision applications',
    },
    aluminum_7075: {
      stability: 'Good',
      machinability: 'Good',
      thermalExpansion: '23.2 × 10⁻⁶ /°C',
      suitability: 'Good for high-strength precision parts',
    },
    invar_36: {
      stability: 'Outstanding',
      machinability: 'Moderate',
      thermalExpansion: '1.2 × 10⁻⁶ /°C',
      suitability: 'Outstanding for ultra-stable applications',
    },
    kovar: {
      stability: 'Excellent',
      machinability: 'Moderate',
      thermalExpansion: '5.9 × 10⁻⁶ /°C',
      suitability: 'Excellent for glass-to-metal seals',
    },
    beryllium_copper: {
      stability: 'Very Good',
      machinability: 'Good',
      thermalExpansion: '17.0 × 10⁻⁶ /°C',
      suitability: 'Excellent for electrical applications',
    },
    tungsten: {
      stability: 'Outstanding',
      machinability: 'Very Challenging',
      thermalExpansion: '4.5 × 10⁻⁶ /°C',
      suitability: 'Outstanding for ultimate stability',
    },
  };
  
  const material = materials[materialSelection] || materials.stainless_316l;
  
  // Assess suitability for precision class
  let precisionSuitability = 'Suitable';
  if (['nano_precision', 'atomic_precision'].includes(precisionClass)) {
    if (!['invar_36', 'tungsten', 'kovar'].includes(materialSelection)) {
      precisionSuitability = 'Consider ultra-stable materials';
    }
  }
  
  return {
    materialProperties: material,
    precisionSuitability,
    recommendations: getMaterialRecommendations(materialSelection, precisionClass),
  };
}

function getMaterialRecommendations(materialSelection: string, precisionClass: string) {
  const recommendations = [];
  
  if (['nano_precision', 'atomic_precision'].includes(precisionClass)) {
    if (materialSelection === 'invar_36') {
      recommendations.push('Excellent choice for ultra-stable applications');
      recommendations.push('Minimize thermal gradients during machining');
    } else if (materialSelection === 'tungsten') {
      recommendations.push('Ultimate stability but very difficult to machine');
      recommendations.push('Consider EDM or specialized machining');
    } else {
      recommendations.push('Consider Invar 36 or tungsten for better stability');
      recommendations.push('Implement strict thermal control');
    }
  }
  
  if (['aluminum_6061', 'aluminum_7075'].includes(materialSelection)) {
    recommendations.push('Good machinability but higher thermal expansion');
    recommendations.push('Implement thermal compensation if required');
  }
  
  recommendations.push('Stress relieve material before machining');
  recommendations.push('Use appropriate cutting parameters for material');
  
  return recommendations;
}

function getUltraPrecisionQualityControl(precisionClass: string, instrumentType: string) {
  const requirements = {
    inspection: [],
    documentation: [],
    equipment: [],
    procedures: [],
  };
  
  // Inspection requirements
  if (['nano_precision', 'atomic_precision'].includes(precisionClass)) {
    requirements.inspection.push('Coordinate measuring machine (CMM) with nanometer resolution');
    requirements.inspection.push('Laser interferometer measurement');
    requirements.inspection.push('Atomic force microscope (AFM) surface analysis');
    requirements.inspection.push('100% dimensional inspection');
  } else if (precisionClass === 'micro_precision') {
    requirements.inspection.push('High-precision CMM measurement');
    requirements.inspection.push('Optical measurement systems');
    requirements.inspection.push('Surface roughness measurement');
    requirements.inspection.push('Statistical sampling inspection');
  } else {
    requirements.inspection.push('Precision measurement equipment');
    requirements.inspection.push('Calibrated gauges and fixtures');
    requirements.inspection.push('Standard dimensional inspection');
  }
  
  // Documentation requirements
  requirements.documentation.push('Complete dimensional inspection reports');
  requirements.documentation.push('Surface finish measurement data');
  requirements.documentation.push('Material certificates and traceability');
  requirements.documentation.push('Process parameter records');
  requirements.documentation.push('Environmental condition logs');
  
  // Equipment requirements
  if (['nano_precision', 'atomic_precision'].includes(precisionClass)) {
    requirements.equipment.push('Nanometer-resolution measurement systems');
    requirements.equipment.push('Vibration-isolated metrology lab');
    requirements.equipment.push('Temperature-controlled environment');
  }
  
  requirements.equipment.push('Calibrated measurement instruments');
  requirements.equipment.push('Traceability to national standards');
  
  return requirements;
}

function getManufacturingEnvironmentRequirements(precisionClass: string) {
  const requirements = {
    temperature: '',
    humidity: '',
    vibration: '',
    cleanliness: '',
    lighting: '',
  };
  
  if (['nano_precision', 'atomic_precision'].includes(precisionClass)) {
    requirements.temperature = '±0.01°C stability';
    requirements.humidity = '±1% RH control';
    requirements.vibration = 'Vibration isolation < 0.1 μm';
    requirements.cleanliness = 'Clean room Class 100';
    requirements.lighting = 'Stable, non-heating illumination';
  } else if (precisionClass === 'micro_precision') {
    requirements.temperature = '±0.1°C stability';
    requirements.humidity = '±2% RH control';
    requirements.vibration = 'Vibration control < 1 μm';
    requirements.cleanliness = 'Clean room Class 1000';
    requirements.lighting = 'Controlled lighting conditions';
  } else {
    requirements.temperature = '±0.5°C stability';
    requirements.humidity = '±5% RH control';
    requirements.vibration = 'Minimal vibration environment';
    requirements.cleanliness = 'Clean manufacturing area';
    requirements.lighting = 'Adequate task lighting';
  }
  
  return requirements;
}

function analyzeStabilityRequirements(
  stabilityRequirement: string,
  materialSelection: string,
  operatingConditions: string,
  componentThickness: number,
  instrumentType: string
) {
  const stabilitySpecs = getStabilitySpecifications(stabilityRequirement);
  const materialStability = getMaterialStabilityCharacteristics(materialSelection);
  const environmentalFactors = getEnvironmentalStabilityFactors(operatingConditions);
  
  return {
    stabilitySpecifications: stabilitySpecs,
    materialStability,
    environmentalFactors,
    thermalStability: analyzeThermalStability(materialSelection, operatingConditions),
    mechanicalStability: analyzeMechanicalStability(materialSelection, componentThickness),
    agingCharacteristics: getAgingCharacteristics(materialSelection, stabilityRequirement),
  };
}

function getStabilitySpecifications(stabilityRequirement: string) {
  const specs = {
    standard_stability: {
      shortTerm: '±0.1% over 24 hours',
      longTerm: '±1% over 1 year',
      temperature: '±0.01%/°C',
      humidity: '±0.05%/%RH',
      vibration: 'Standard vibration resistance',
    },
    high_stability: {
      shortTerm: '±0.01% over 24 hours',
      longTerm: '±0.1% over 1 year',
      temperature: '±0.001%/°C',
      humidity: '±0.005%/%RH',
      vibration: 'Enhanced vibration resistance',
    },
    ultra_stability: {
      shortTerm: '±0.001% over 24 hours',
      longTerm: '±0.01% over 1 year',
      temperature: '±0.0001%/°C',
      humidity: '±0.0005%/%RH',
      vibration: 'High vibration resistance',
    },
    metrology_grade: {
      shortTerm: '±0.0001% over 24 hours',
      longTerm: '±0.001% over 1 year',
      temperature: '±0.00001%/°C',
      humidity: '±0.00005%/%RH',
      vibration: 'Ultra-high vibration resistance',
    },
    reference_standard: {
      shortTerm: '±0.00001% over 24 hours',
      longTerm: '±0.0001% over 1 year',
      temperature: '±0.000001%/°C',
      humidity: '±0.000005%/%RH',
      vibration: 'Maximum vibration resistance',
    },
  };
  
  return specs[stabilityRequirement] || specs.high_stability;
}

function getMaterialStabilityCharacteristics(materialSelection: string) {
  const characteristics = {
    stainless_316l: {
      thermalStability: 'Good',
      dimensionalStability: 'Good',
      agingRate: 'Low',
      stressRelief: 'Required',
    },
    stainless_17_4ph: {
      thermalStability: 'Very Good',
      dimensionalStability: 'Very Good',
      agingRate: 'Very Low',
      stressRelief: 'Recommended',
    },
    titanium_grade2: {
      thermalStability: 'Excellent',
      dimensionalStability: 'Excellent',
      agingRate: 'Minimal',
      stressRelief: 'Minimal',
    },
    titanium_6al4v: {
      thermalStability: 'Excellent',
      dimensionalStability: 'Excellent',
      agingRate: 'Minimal',
      stressRelief: 'Recommended',
    },
    aluminum_6061: {
      thermalStability: 'Moderate',
      dimensionalStability: 'Good',
      agingRate: 'Moderate',
      stressRelief: 'Required',
    },
    aluminum_7075: {
      thermalStability: 'Moderate',
      dimensionalStability: 'Good',
      agingRate: 'Moderate',
      stressRelief: 'Required',
    },
    invar_36: {
      thermalStability: 'Outstanding',
      dimensionalStability: 'Outstanding',
      agingRate: 'Minimal',
      stressRelief: 'Critical',
    },
    kovar: {
      thermalStability: 'Excellent',
      dimensionalStability: 'Excellent',
      agingRate: 'Low',
      stressRelief: 'Required',
    },
    beryllium_copper: {
      thermalStability: 'Good',
      dimensionalStability: 'Very Good',
      agingRate: 'Low',
      stressRelief: 'Required',
    },
    tungsten: {
      thermalStability: 'Outstanding',
      dimensionalStability: 'Outstanding',
      agingRate: 'Negligible',
      stressRelief: 'Minimal',
    },
  };
  
  return characteristics[materialSelection] || characteristics.stainless_316l;
}

function getEnvironmentalStabilityFactors(operatingConditions: string) {
  const factors = {
    ambient_conditions: {
      temperatureVariation: '±20°C',
      humidityVariation: '±30% RH',
      vibrationLevel: 'Standard',
      stabilityImpact: 'Moderate',
    },
    controlled_environment: {
      temperatureVariation: '±1°C',
      humidityVariation: '±5% RH',
      vibrationLevel: 'Low',
      stabilityImpact: 'Low',
    },
    precision_environment: {
      temperatureVariation: '±0.1°C',
      humidityVariation: '±2% RH',
      vibrationLevel: 'Very Low',
      stabilityImpact: 'Very Low',
    },
    metrology_lab: {
      temperatureVariation: '±0.01°C',
      humidityVariation: '±1% RH',
      vibrationLevel: 'Isolated',
      stabilityImpact: 'Minimal',
    },
    vacuum_chamber: {
      temperatureVariation: '±0.1°C',
      humidityVariation: 'None',
      vibrationLevel: 'Isolated',
      stabilityImpact: 'Minimal',
    },
    cryogenic_conditions: {
      temperatureVariation: '±0.01°C',
      humidityVariation: 'None',
      vibrationLevel: 'Isolated',
      stabilityImpact: 'Material dependent',
    },
  };
  
  return factors[operatingConditions] || factors.controlled_environment;
}

function analyzeThermalStability(materialSelection: string, operatingConditions: string) {
  const materialProps = getMaterialStabilityCharacteristics(materialSelection);
  const envFactors = getEnvironmentalStabilityFactors(operatingConditions);
  
  return {
    thermalExpansionCoeff: getThermalExpansionCoeff(materialSelection),
    temperatureSensitivity: materialProps.thermalStability,
    environmentalImpact: envFactors.stabilityImpact,
    compensationRequired: getCompensationRequirements(materialSelection, operatingConditions),
  };
}

function getThermalExpansionCoeff(materialSelection: string) {
  const coefficients = {
    stainless_316l: '16.0 × 10⁻⁶ /°C',
    stainless_17_4ph: '10.8 × 10⁻⁶ /°C',
    titanium_grade2: '8.6 × 10⁻⁶ /°C',
    titanium_6al4v: '8.6 × 10⁻⁶ /°C',
    aluminum_6061: '23.6 × 10⁻⁶ /°C',
    aluminum_7075: '23.2 × 10⁻⁶ /°C',
    invar_36: '1.2 × 10⁻⁶ /°C',
    kovar: '5.9 × 10⁻⁶ /°C',
    beryllium_copper: '17.0 × 10⁻⁶ /°C',
    tungsten: '4.5 × 10⁻⁶ /°C',
  };
  
  return coefficients[materialSelection] || '15.0 × 10⁻⁶ /°C';
}

function getCompensationRequirements(materialSelection: string, operatingConditions: string) {
  const requirements = [];
  
  if (['aluminum_6061', 'aluminum_7075'].includes(materialSelection)) {
    requirements.push('Thermal compensation recommended');
    requirements.push('Temperature monitoring required');
  }
  
  if (materialSelection === 'invar_36') {
    requirements.push('Minimal thermal compensation needed');
    requirements.push('Excellent thermal stability');
  }
  
  if (['ambient_conditions', 'controlled_environment'].includes(operatingConditions)) {
    requirements.push('Environmental temperature control important');
    requirements.push('Consider thermal isolation');
  }
  
  return requirements;
}

function analyzeMechanicalStability(materialSelection: string, componentThickness: number) {
  const materialProps = getMaterialStabilityCharacteristics(materialSelection);
  
  return {
    dimensionalStability: materialProps.dimensionalStability,
    stressReliefRequirement: materialProps.stressRelief,
    thicknessConsiderations: getThicknessConsiderations(componentThickness),
    mechanicalRecommendations: getMechanicalStabilityRecommendations(materialSelection),
  };
}

function getThicknessConsiderations(thickness: number) {
  const considerations = [];
  
  if (thickness < 1.0) {
    considerations.push('Thin section - high stress sensitivity');
    considerations.push('Careful handling required');
    considerations.push('Consider stress relief after machining');
  } else if (thickness > 10.0) {
    considerations.push('Thick section - potential internal stresses');
    considerations.push('Stress relief highly recommended');
    considerations.push('Monitor for warping during machining');
  } else {
    considerations.push('Standard thickness - normal precautions');
    considerations.push('Follow standard stress relief procedures');
  }
  
  return considerations;
}

function getMechanicalStabilityRecommendations(materialSelection: string) {
  const recommendations = [];
  
  if (materialSelection === 'invar_36') {
    recommendations.push('Critical stress relief required');
    recommendations.push('Slow cooling after stress relief');
    recommendations.push('Minimize machining stresses');
  }
  
  if (['aluminum_6061', 'aluminum_7075'].includes(materialSelection)) {
    recommendations.push('Stress relief before final machining');
    recommendations.push('Symmetric machining to minimize distortion');
  }
  
  recommendations.push('Use appropriate cutting parameters');
  recommendations.push('Monitor part temperature during machining');
  recommendations.push('Allow adequate settling time');
  
  return recommendations;
}

function getAgingCharacteristics(materialSelection: string, stabilityRequirement: string) {
  const characteristics = {
    stainless_316l: {
      agingRate: 'Low - minimal dimensional change over time',
      timeConstant: '1-2 years to stabilize',
      mitigationMethods: ['Stress relief', 'Thermal cycling'],
    },
    invar_36: {
      agingRate: 'Very Low - excellent long-term stability',
      timeConstant: '6 months to stabilize',
      mitigationMethods: ['Critical stress relief', 'Controlled cooling'],
    },
    tungsten: {
      agingRate: 'Negligible - ultimate stability',
      timeConstant: 'Immediate stability',
      mitigationMethods: ['Minimal processing required'],
    },
    aluminum_6061: {
      agingRate: 'Moderate - some dimensional change expected',
      timeConstant: '2-3 years to stabilize',
      mitigationMethods: ['Artificial aging', 'Stress relief'],
    },
  };
  
  const material = characteristics[materialSelection] || characteristics.stainless_316l;
  
  // Adjust recommendations based on stability requirement
  if (['metrology_grade', 'reference_standard'].includes(stabilityRequirement)) {
    material.mitigationMethods.push('Extended stabilization period');
    material.mitigationMethods.push('Accelerated aging procedures');
  }
  
  return material;
}

export default precisionInstrumentConfig;
