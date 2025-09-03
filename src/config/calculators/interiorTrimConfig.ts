import { CalculatorConfig } from '../../types/calculator';

export const interiorTrimConfig: CalculatorConfig = {
  id: 'interior-trim',
  name: 'Interior Trim Calculator',
  description: 'Specialized calculator for automotive interior trim components including dashboard panels, console parts, and decorative elements with aesthetic and functional requirements.',
  category: 'automotive',
  difficulty: 'intermediate',
  estimatedTime: '5-6 minutes',
  
  inputs: [
    {
      id: 'trimType',
      label: 'Interior Trim Type',
      type: 'select',
      value: 'dashboard_panel',
      options: [
        { value: 'dashboard_panel', label: 'Dashboard Panel' },
        { value: 'console_trim', label: 'Center Console Trim' },
        { value: 'door_panel', label: 'Door Panel Insert' },
        { value: 'decorative_accent', label: 'Decorative Accent' },
        { value: 'air_vent', label: 'Air Vent Surround' },
        { value: 'switch_bezel', label: 'Switch/Control Bezel' },
        { value: 'speaker_grille', label: 'Speaker Grille' },
      ],
      required: true,
      description: 'Type of interior trim component',
    },
    {
      id: 'materialType',
      label: 'Material Type',
      type: 'select',
      value: 'stainless_steel',
      options: [
        { value: 'stainless_steel', label: 'Stainless Steel (304/316)' },
        { value: 'aluminum_alloy', label: 'Aluminum Alloy (6061/5052)' },
        { value: 'carbon_steel', label: 'Carbon Steel (Cold Rolled)' },
        { value: 'brass', label: 'Brass (Decorative)' },
        { value: 'copper', label: 'Copper (Accent)' },
        { value: 'titanium', label: 'Titanium (Premium)' },
      ],
      required: true,
      description: 'Material for interior trim application',
    },
    {
      id: 'materialThickness',
      label: 'Material Thickness',
      type: 'number',
      value: 0.5,
      unit: 'mm',
      min: 0.2,
      max: 2.0,
      step: 0.1,
      required: true,
      description: 'Thickness of trim material',
    },
    {
      id: 'componentLength',
      label: 'Component Length',
      type: 'number',
      value: 300,
      unit: 'mm',
      min: 50,
      max: 1200,
      step: 10,
      required: true,
      description: 'Maximum length of trim component',
    },
    {
      id: 'componentWidth',
      label: 'Component Width',
      type: 'number',
      value: 150,
      unit: 'mm',
      min: 20,
      max: 600,
      step: 5,
      required: true,
      description: 'Maximum width of trim component',
    },
    {
      id: 'designComplexity',
      label: 'Design Complexity',
      type: 'select',
      value: 'moderate',
      options: [
        { value: 'simple', label: 'Simple (Basic shapes, minimal features)' },
        { value: 'moderate', label: 'Moderate (Curves, patterns, holes)' },
        { value: 'complex', label: 'Complex (Intricate patterns, fine details)' },
        { value: 'artistic', label: 'Artistic (Custom designs, logos)' },
      ],
      required: true,
      description: 'Complexity of the trim design',
    },
    {
      id: 'surfaceFinish',
      label: 'Surface Finish Requirement',
      type: 'select',
      value: 'brushed',
      options: [
        { value: 'mill_finish', label: 'Mill Finish (As-cut)' },
        { value: 'brushed', label: 'Brushed Finish' },
        { value: 'polished', label: 'Polished Finish' },
        { value: 'mirror', label: 'Mirror Finish' },
        { value: 'textured', label: 'Textured/Patterned' },
        { value: 'anodized', label: 'Anodized (Aluminum only)' },
      ],
      required: true,
      description: 'Required surface finish for aesthetic appeal',
    },
    {
      id: 'toleranceRequirement',
      label: 'Tolerance Requirement',
      type: 'select',
      value: 'standard',
      options: [
        { value: 'loose', label: 'Loose (±0.5mm)' },
        { value: 'standard', label: 'Standard (±0.2mm)' },
        { value: 'tight', label: 'Tight (±0.1mm)' },
        { value: 'precision', label: 'Precision (±0.05mm)' },
      ],
      required: true,
      description: 'Dimensional tolerance requirements',
    },
    {
      id: 'productionQuantity',
      label: 'Production Quantity',
      type: 'select',
      value: 'medium',
      options: [
        { value: 'prototype', label: 'Prototype (1-10 pieces)' },
        { value: 'small', label: 'Small Batch (10-100 pieces)' },
        { value: 'medium', label: 'Medium Run (100-1000 pieces)' },
        { value: 'large', label: 'Large Production (1000+ pieces)' },
      ],
      required: true,
      description: 'Expected production quantity',
    },
  ],

  outputs: [
    {
      id: 'cuttingParameters',
      label: 'Cutting Parameters',
      type: 'object',
      format: 'trim-cutting-specs',
      description: 'Optimized cutting parameters for interior trim materials',
    },
    {
      id: 'aestheticRequirements',
      label: 'Aesthetic Requirements',
      type: 'object',
      format: 'trim-aesthetic-specs',
      description: 'Surface finish and aesthetic quality specifications',
    },
    {
      id: 'qualityControl',
      label: 'Quality Control',
      type: 'object',
      format: 'trim-quality-specs',
      description: 'Quality control and inspection requirements',
    },
    {
      id: 'costEstimate',
      label: 'Cost Estimate',
      type: 'object',
      format: 'trim-cost-breakdown',
      description: 'Detailed cost analysis for interior trim production',
    },
  ],

  calculate: (inputs: Record<string, any>) => {
    const {
      trimType,
      materialType,
      materialThickness,
      componentLength,
      componentWidth,
      designComplexity,
      surfaceFinish,
      toleranceRequirement,
      productionQuantity,
    } = inputs;

    // Calculate cutting parameters
    const cuttingParameters = calculateTrimCuttingParameters(
      materialType,
      materialThickness,
      designComplexity,
      toleranceRequirement
    );

    // Define aesthetic requirements
    const aestheticRequirements = defineAestheticRequirements(
      surfaceFinish,
      materialType,
      trimType,
      designComplexity
    );

    // Establish quality control
    const qualityControl = establishQualityControl(
      toleranceRequirement,
      surfaceFinish,
      trimType,
      materialType
    );

    // Calculate costs
    const costEstimate = calculateTrimCosts(
      componentLength,
      componentWidth,
      materialThickness,
      materialType,
      designComplexity,
      surfaceFinish,
      productionQuantity,
      cuttingParameters
    );

    return {
      cuttingParameters,
      aestheticRequirements,
      qualityControl,
      costEstimate,
    };
  },

  validation: {
    materialThickness: {
      min: 0.2,
      max: 2.0,
      message: 'Material thickness must be between 0.2mm and 2.0mm for interior trim',
    },
    componentLength: {
      min: 50,
      max: 1200,
      message: 'Component length must be between 50mm and 1200mm',
    },
    componentWidth: {
      min: 20,
      max: 600,
      message: 'Component width must be between 20mm and 600mm',
    },
  },

  examples: [
    {
      name: 'Dashboard Accent Panel',
      description: 'Brushed stainless steel dashboard accent',
      inputs: {
        trimType: 'dashboard_panel',
        materialType: 'stainless_steel',
        materialThickness: 0.8,
        componentLength: 400,
        componentWidth: 100,
        designComplexity: 'moderate',
        surfaceFinish: 'brushed',
        toleranceRequirement: 'standard',
        productionQuantity: 'large',
      },
    },
    {
      name: 'Premium Speaker Grille',
      description: 'Intricate aluminum speaker grille with anodized finish',
      inputs: {
        trimType: 'speaker_grille',
        materialType: 'aluminum_alloy',
        materialThickness: 1.0,
        componentLength: 200,
        componentWidth: 150,
        designComplexity: 'complex',
        surfaceFinish: 'anodized',
        toleranceRequirement: 'tight',
        productionQuantity: 'medium',
      },
    },
  ],

  tags: ['automotive', 'interior', 'trim', 'aesthetic', 'decorative'],
  
  relatedCalculators: [
    'decorative-cutting',
    'surface-finish',
    'precision-cutting',
    'material-optimization',
  ],

  learningResources: [
    {
      title: 'Interior Trim Design Guide',
      type: 'article',
      url: '/learn/interior-trim-design',
    },
    {
      title: 'Automotive Aesthetics',
      type: 'video',
      url: '/learn/automotive-aesthetics',
    },
  ],
};

// Helper functions
function calculateTrimCuttingParameters(
  materialType: string,
  thickness: number,
  complexity: string,
  tolerance: string
) {
  const materialParams = getTrimMaterialParams(materialType, thickness);
  const complexityAdjustments = getComplexityAdjustments(complexity);
  const toleranceAdjustments = getToleranceAdjustments(tolerance);
  
  return {
    laserPower: calculateTrimLaserPower(materialType, thickness),
    cuttingSpeed: Math.round(materialParams.baseSpeed * complexityAdjustments.speedFactor * toleranceAdjustments.speedFactor),
    assistGas: materialParams.assistGas,
    focusPosition: materialParams.focusPosition + toleranceAdjustments.focusAdjustment,
    pierceSettings: calculateTrimPierceSettings(materialType, thickness),
    edgeQuality: predictTrimEdgeQuality(materialType, thickness, complexity),
    kerf: calculateTrimKerf(materialType, thickness),
    heatAffectedZone: calculateTrimHAZ(materialType, thickness),
    recommendedNozzle: getTrimNozzleRecommendation(materialType, thickness),
  };
}

function getTrimMaterialParams(materialType: string, thickness: number) {
  const materials = {
    stainless_steel: {
      baseSpeed: 2500 / thickness,
      assistGas: { type: 'nitrogen', pressure: 12, flow: 80 },
      focusPosition: -0.5,
      difficulty: 'moderate',
    },
    aluminum_alloy: {
      baseSpeed: 4000 / thickness,
      assistGas: { type: 'nitrogen', pressure: 8, flow: 60 },
      focusPosition: 0,
      difficulty: 'easy',
    },
    carbon_steel: {
      baseSpeed: 3000 / thickness,
      assistGas: { type: 'oxygen', pressure: 3, flow: 40 },
      focusPosition: 0,
      difficulty: 'easy',
    },
    brass: {
      baseSpeed: 3500 / thickness,
      assistGas: { type: 'nitrogen', pressure: 10, flow: 70 },
      focusPosition: 0,
      difficulty: 'moderate',
    },
    copper: {
      baseSpeed: 3200 / thickness,
      assistGas: { type: 'nitrogen', pressure: 10, flow: 70 },
      focusPosition: 0,
      difficulty: 'challenging',
    },
    titanium: {
      baseSpeed: 1800 / thickness,
      assistGas: { type: 'argon', pressure: 15, flow: 90 },
      focusPosition: -1.0,
      difficulty: 'challenging',
    },
  };
  
  return materials[materialType] || materials.stainless_steel;
}

function getComplexityAdjustments(complexity: string) {
  const adjustments = {
    simple: { speedFactor: 1.2, qualityFactor: 1.0 },
    moderate: { speedFactor: 1.0, qualityFactor: 1.1 },
    complex: { speedFactor: 0.7, qualityFactor: 1.3 },
    artistic: { speedFactor: 0.5, qualityFactor: 1.5 },
  };
  
  return adjustments[complexity] || adjustments.moderate;
}

function getToleranceAdjustments(tolerance: string) {
  const adjustments = {
    loose: { speedFactor: 1.2, focusAdjustment: 0 },
    standard: { speedFactor: 1.0, focusAdjustment: 0 },
    tight: { speedFactor: 0.8, focusAdjustment: -0.2 },
    precision: { speedFactor: 0.6, focusAdjustment: -0.5 },
  };
  
  return adjustments[tolerance] || adjustments.standard;
}

function calculateTrimLaserPower(materialType: string, thickness: number) {
  const basePower = thickness * 800; // Base power calculation
  
  const materialMultipliers = {
    stainless_steel: 1.2,
    aluminum_alloy: 0.8,
    carbon_steel: 1.0,
    brass: 1.1,
    copper: 1.3,
    titanium: 1.8,
  };
  
  const multiplier = materialMultipliers[materialType] || 1.0;
  return Math.min(6000, Math.round(basePower * multiplier)); // Cap at 6kW for trim work
}

function calculateTrimPierceSettings(materialType: string, thickness: number) {
  const basePierceTime = thickness * 0.3; // Faster pierce for thin materials
  
  const materialFactors = {
    stainless_steel: 1.2,
    aluminum_alloy: 0.8,
    carbon_steel: 1.0,
    brass: 1.1,
    copper: 1.3,
    titanium: 1.8,
  };
  
  const factor = materialFactors[materialType] || 1.0;
  
  return {
    pierceTime: Math.round(basePierceTime * factor * 10) / 10,
    pierceHeight: Math.max(0.5, thickness * 2),
    pierceStrategy: thickness < 0.5 ? 'Single pulse' : 'Ramped pierce',
  };
}

function predictTrimEdgeQuality(materialType: string, thickness: number, complexity: string) {
  let baseQuality = 'Good';
  
  if (thickness < 0.5) {
    baseQuality = 'Excellent';
  } else if (thickness > 1.5) {
    baseQuality = 'Fair';
  }
  
  // Material-specific adjustments
  if (['aluminum_alloy', 'carbon_steel'].includes(materialType)) {
    baseQuality = baseQuality === 'Fair' ? 'Good' : 'Excellent';
  } else if (['copper', 'titanium'].includes(materialType)) {
    baseQuality = baseQuality === 'Excellent' ? 'Good' : 'Fair';
  }
  
  return {
    rating: baseQuality,
    surfaceRoughness: thickness < 0.8 ? 'Ra 1.6μm' : 'Ra 3.2μm',
    drossLevel: thickness < 1.0 ? 'None' : 'Minimal',
    straightness: '±0.02mm',
    squareness: '±0.05mm',
  };
}

function calculateTrimKerf(materialType: string, thickness: number) {
  const baseKerf = 0.08 + thickness * 0.03; // Smaller kerf for trim work
  
  const materialFactors = {
    stainless_steel: 1.0,
    aluminum_alloy: 1.1,
    carbon_steel: 1.0,
    brass: 1.05,
    copper: 1.1,
    titanium: 0.95,
  };
  
  const factor = materialFactors[materialType] || 1.0;
  return Math.round(baseKerf * factor * 1000) / 1000; // 3 decimal places
}

function calculateTrimHAZ(materialType: string, thickness: number) {
  const baseHAZ = 0.02 + thickness * 0.01; // Minimal HAZ for trim
  
  const materialFactors = {
    stainless_steel: 1.1,
    aluminum_alloy: 1.3,
    carbon_steel: 1.2,
    brass: 1.2,
    copper: 1.4,
    titanium: 0.8,
  };
  
  const factor = materialFactors[materialType] || 1.1;
  return Math.round(baseHAZ * factor * 1000) / 1000; // 3 decimal places
}

function getTrimNozzleRecommendation(materialType: string, thickness: number) {
  if (thickness <= 0.5) {
    return '0.8mm conical (fine cutting)';
  } else if (thickness <= 1.0) {
    return '1.0mm conical (standard)';
  } else {
    return '1.2mm conical (thick material)';
  }
}

function defineAestheticRequirements(
  surfaceFinish: string,
  materialType: string,
  trimType: string,
  complexity: string
) {
  const finishSpecs = getFinishSpecifications(surfaceFinish, materialType);
  const visualRequirements = getVisualRequirements(trimType, complexity);
  const postProcessing = getPostProcessingRequirements(surfaceFinish, materialType);
  
  return {
    finishSpecifications: finishSpecs,
    visualRequirements,
    postProcessing,
    qualityStandards: getAestheticQualityStandards(surfaceFinish),
    inspectionCriteria: getAestheticInspectionCriteria(trimType, surfaceFinish),
  };
}

function getFinishSpecifications(surfaceFinish: string, materialType: string) {
  const specifications = {
    mill_finish: {
      description: 'As-cut surface with minimal processing',
      roughness: 'Ra 3.2μm',
      appearance: 'Natural material finish',
      durability: 'Standard',
      cost: 'Low',
    },
    brushed: {
      description: 'Uniform directional brush pattern',
      roughness: 'Ra 0.8μm',
      appearance: 'Satin finish with visible grain',
      durability: 'Good',
      cost: 'Medium',
    },
    polished: {
      description: 'High-gloss polished surface',
      roughness: 'Ra 0.4μm',
      appearance: 'High reflectivity, mirror-like',
      durability: 'Good',
      cost: 'High',
    },
    mirror: {
      description: 'Ultra-high gloss mirror finish',
      roughness: 'Ra 0.2μm',
      appearance: 'Perfect reflection, no visible scratches',
      durability: 'Excellent',
      cost: 'Very High',
    },
    textured: {
      description: 'Custom texture or pattern',
      roughness: 'Ra 1.6μm',
      appearance: 'Decorative surface pattern',
      durability: 'Good',
      cost: 'High',
    },
    anodized: {
      description: 'Anodized aluminum with color options',
      roughness: 'Ra 0.8μm',
      appearance: 'Colored, corrosion resistant',
      durability: 'Excellent',
      cost: 'Medium-High',
      applicability: materialType === 'aluminum_alloy' ? 'Available' : 'Not applicable',
    },
  };
  
  return specifications[surfaceFinish] || specifications.mill_finish;
}

function getVisualRequirements(trimType: string, complexity: string) {
  const requirements = {
    dashboard_panel: {
      visibility: 'High - Driver focal point',
      lightReflection: 'Controlled to avoid glare',
      colorConsistency: 'Critical',
      scratchResistance: 'High',
    },
    console_trim: {
      visibility: 'Medium - Passenger interaction',
      lightReflection: 'Moderate',
      colorConsistency: 'Important',
      scratchResistance: 'Medium',
    },
    door_panel: {
      visibility: 'Medium - Side visibility',
      lightReflection: 'Low',
      colorConsistency: 'Important',
      scratchResistance: 'High',
    },
    decorative_accent: {
      visibility: 'High - Aesthetic focus',
      lightReflection: 'Enhanced for appeal',
      colorConsistency: 'Critical',
      scratchResistance: 'Medium',
    },
    air_vent: {
      visibility: 'Medium - Functional element',
      lightReflection: 'Moderate',
      colorConsistency: 'Standard',
      scratchResistance: 'Medium',
    },
    switch_bezel: {
      visibility: 'High - User interface',
      lightReflection: 'Controlled',
      colorConsistency: 'Important',
      scratchResistance: 'High',
    },
    speaker_grille: {
      visibility: 'Medium - Audio component',
      lightReflection: 'Low to moderate',
      colorConsistency: 'Standard',
      scratchResistance: 'Medium',
    },
  };
  
  return requirements[trimType] || requirements.dashboard_panel;
}

function getPostProcessingRequirements(surfaceFinish: string, materialType: string) {
  const processes = [];
  
  // Deburring (always required)
  processes.push({
    process: 'Deburring',
    method: 'Manual or tumbling',
    requirement: 'All edges smooth, no sharp corners',
    cost: 'Low',
  });
  
  // Surface finishing
  if (surfaceFinish === 'brushed') {
    processes.push({
      process: 'Brushing',
      method: 'Abrasive belt or wheel',
      requirement: 'Uniform directional pattern',
      cost: 'Medium',
    });
  } else if (surfaceFinish === 'polished' || surfaceFinish === 'mirror') {
    processes.push({
      process: 'Polishing',
      method: 'Progressive abrasive compounds',
      requirement: 'High gloss, scratch-free surface',
      cost: 'High',
    });
  } else if (surfaceFinish === 'anodized' && materialType === 'aluminum_alloy') {
    processes.push({
      process: 'Anodizing',
      method: 'Electrochemical oxidation',
      requirement: 'Uniform color and thickness',
      cost: 'Medium-High',
    });
  }
  
  // Protective coating
  if (!['anodized'].includes(surfaceFinish)) {
    processes.push({
      process: 'Protective Coating',
      method: 'Clear coat or wax',
      requirement: 'Corrosion and fingerprint resistance',
      cost: 'Low-Medium',
    });
  }
  
  return processes;
}

function getAestheticQualityStandards(surfaceFinish: string) {
  return {
    surfaceDefects: 'No visible scratches, dents, or discoloration',
    colorMatching: 'Within ΔE < 2.0 color difference',
    reflectivity: getReflectivityStandard(surfaceFinish),
    uniformity: 'Consistent finish across entire surface',
    edgeQuality: 'Smooth, rounded edges with no burrs',
  };
}

function getReflectivityStandard(surfaceFinish: string) {
  const standards = {
    mill_finish: '10-20% reflectivity',
    brushed: '30-50% reflectivity',
    polished: '70-85% reflectivity',
    mirror: '90%+ reflectivity',
    textured: '20-40% reflectivity',
    anodized: '40-60% reflectivity',
  };
  
  return standards[surfaceFinish] || '30-50% reflectivity';
}

function getAestheticInspectionCriteria(trimType: string, surfaceFinish: string) {
  const criteria = [
    {
      parameter: 'Surface Finish Quality',
      method: 'Visual inspection under controlled lighting',
      acceptance: 'No visible defects at 60cm viewing distance',
      frequency: '100%',
    },
    {
      parameter: 'Dimensional Accuracy',
      method: 'Coordinate measuring machine',
      acceptance: 'Within specified tolerances',
      frequency: 'First article + 10%',
    },
    {
      parameter: 'Edge Quality',
      method: 'Visual and tactile inspection',
      acceptance: 'Smooth edges, no sharp corners',
      frequency: '100%',
    },
  ];
  
  if (['polished', 'mirror'].includes(surfaceFinish)) {
    criteria.push({
      parameter: 'Reflectivity',
      method: 'Gloss meter measurement',
      acceptance: 'Meet specified gloss units',
      frequency: 'Sample basis',
    });
  }
  
  if (trimType === 'dashboard_panel') {
    criteria.push({
      parameter: 'Glare Assessment',
      method: 'Photometric analysis',
      acceptance: 'No glare in driver sight lines',
      frequency: 'Design validation',
    });
  }
  
  return criteria;
}

function establishQualityControl(
  tolerance: string,
  surfaceFinish: string,
  trimType: string,
  materialType: string
) {
  const toleranceSpecs = getToleranceSpecifications(tolerance);
  const inspectionPlan = createInspectionPlan(tolerance, surfaceFinish, trimType);
  const testingRequirements = getTestingRequirements(materialType, trimType);
  
  return {
    toleranceSpecifications: toleranceSpecs,
    inspectionPlan,
    testingRequirements,
    documentation: getQualityDocumentation(trimType),
    certificationRequirements: getCertificationRequirements(trimType, materialType),
  };
}

function getToleranceSpecifications(tolerance: string) {
  const specs = {
    loose: {
      linear: '±0.5mm',
      angular: '±2°',
      flatness: '0.5mm per 100mm',
      straightness: '0.3mm per 100mm',
    },
    standard: {
      linear: '±0.2mm',
      angular: '±1°',
      flatness: '0.2mm per 100mm',
      straightness: '0.1mm per 100mm',
    },
    tight: {
      linear: '±0.1mm',
      angular: '±0.5°',
      flatness: '0.1mm per 100mm',
      straightness: '0.05mm per 100mm',
    },
    precision: {
      linear: '±0.05mm',
      angular: '±0.25°',
      flatness: '0.05mm per 100mm',
      straightness: '0.02mm per 100mm',
    },
  };
  
  return specs[tolerance] || specs.standard;
}

function createInspectionPlan(tolerance: string, surfaceFinish: string, trimType: string) {
  const plan = {
    incomingMaterial: {
      frequency: 'Per lot',
      parameters: ['Thickness', 'Surface condition', 'Material certification'],
      method: 'Sampling inspection',
    },
    inProcess: {
      frequency: 'Every 50 pieces',
      parameters: ['Dimensions', 'Edge quality', 'Surface condition'],
      method: 'Statistical process control',
    },
    final: {
      frequency: '100%',
      parameters: ['All critical dimensions', 'Surface finish', 'Aesthetic quality'],
      method: 'Comprehensive inspection',
    },
  };
  
  if (tolerance === 'precision') {
    plan.inProcess.frequency = 'Every 25 pieces';
    plan.final.parameters.push('Geometric tolerances');
  }
  
  return plan;
}

function getTestingRequirements(materialType: string, trimType: string) {
  const tests = [
    {
      test: 'Dimensional Verification',
      standard: 'ISO 9001',
      frequency: 'First article',
      requirement: 'Full dimensional report',
    },
    {
      test: 'Surface Finish Measurement',
      standard: 'ISO 4287',
      frequency: 'Sample basis',
      requirement: 'Meet specified roughness',
    },
  ];
  
  if (trimType === 'dashboard_panel') {
    tests.push({
      test: 'UV Resistance',
      standard: 'ASTM G154',
      frequency: 'Qualification',
      requirement: 'No color change after 500 hours',
    });
  }
  
  if (['stainless_steel', 'aluminum_alloy'].includes(materialType)) {
    tests.push({
      test: 'Corrosion Resistance',
      standard: 'ASTM B117',
      frequency: 'Qualification',
      requirement: 'No corrosion after 240 hours',
    });
  }
  
  return tests;
}

function getQualityDocumentation(trimType: string) {
  return {
    required: [
      'Material certificates',
      'Dimensional inspection reports',
      'Surface finish measurements',
      'Process parameter records',
    ],
    retention: '5 years minimum',
    traceability: 'Lot-level traceability required',
    customerReports: trimType === 'dashboard_panel' ? 'Full documentation package' : 'Summary report',
  };
}

function getCertificationRequirements(trimType: string, materialType: string) {
  const requirements = ['ISO 9001 quality management'];
  
  if (trimType === 'dashboard_panel') {
    requirements.push('Automotive industry certification');
    requirements.push('Safety compliance documentation');
  }
  
  if (materialType === 'aluminum_alloy') {
    requirements.push('Material grade certification');
  }
  
  return requirements;
}

function calculateTrimCosts(
  length: number,
  width: number,
  thickness: number,
  materialType: string,
  complexity: string,
  surfaceFinish: string,
  quantity: string,
  cuttingParams: any
) {
  const area = (length * width) / 1000000; // Convert to m²
  
  // Material costs
  const materialCosts = calculateTrimMaterialCosts(area, thickness, materialType);
  
  // Processing costs
  const processingCosts = calculateTrimProcessingCosts(
    area,
    complexity,
    quantity,
    cuttingParams
  );
  
  // Finishing costs
  const finishingCosts = calculateFinishingCosts(
    area,
    surfaceFinish,
    materialType,
    quantity
  );
  
  // Quality costs
  const qualityCosts = calculateTrimQualityCosts(area, quantity, complexity);
  
  const totalCost = materialCosts.total + processingCosts.total + 
                   finishingCosts.total + qualityCosts.total;
  
  return {
    materialCosts,
    processingCosts,
    finishingCosts,
    qualityCosts,
    totalCost: Math.round(totalCost * 100) / 100,
    costPerPiece: Math.round(totalCost * 100) / 100,
    costBreakdown: {
      material: Math.round((materialCosts.total / totalCost) * 100),
      processing: Math.round((processingCosts.total / totalCost) * 100),
      finishing: Math.round((finishingCosts.total / totalCost) * 100),
      quality: Math.round((qualityCosts.total / totalCost) * 100),
    },
  };
}

function calculateTrimMaterialCosts(area: number, thickness: number, materialType: string) {
  const materialPrices = {
    stainless_steel: 8.5,
    aluminum_alloy: 4.2,
    carbon_steel: 2.1,
    brass: 12.0,
    copper: 15.0,
    titanium: 45.0,
  };
  
  const pricePerKg = materialPrices[materialType] || 5.0;
  const density = getDensity(materialType);
  const volume = area * thickness / 1000; // m³
  const weight = volume * density; // kg
  
  const materialCost = weight * pricePerKg;
  const scrapAllowance = materialCost * 0.08; // 8% scrap for trim work
  const handling = materialCost * 0.03; // 3% handling
  
  return {
    materialCost: Math.round(materialCost * 100) / 100,
    scrapAllowance: Math.round(scrapAllowance * 100) / 100,
    handling: Math.round(handling * 100) / 100,
    total: Math.round((materialCost + scrapAllowance + handling) * 100) / 100,
  };
}

function getDensity(materialType: string) {
  const densities = {
    stainless_steel: 8000,
    aluminum_alloy: 2700,
    carbon_steel: 7850,
    brass: 8500,
    copper: 8960,
    titanium: 4500,
  };
  
  return densities[materialType] || 7850; // kg/m³
}

function calculateTrimProcessingCosts(area: number, complexity: string, quantity: string, cuttingParams: any) {
  const complexityMultipliers = {
    simple: 1.0,
    moderate: 1.4,
    complex: 2.0,
    artistic: 3.0,
  };
  
  const quantityMultipliers = {
    prototype: 4.0,
    small: 2.5,
    medium: 1.0,
    large: 0.6,
  };
  
  const baseCostPerM2 = 35; // Higher base cost for precision trim work
  const complexityMultiplier = complexityMultipliers[complexity] || 1.4;
  const quantityMultiplier = quantityMultipliers[quantity] || 1.0;
  
  const cuttingCost = area * baseCostPerM2 * complexityMultiplier * quantityMultiplier;
  const setupCost = quantity === 'prototype' ? 200 : quantity === 'small' ? 120 : 60;
  const gasConsumption = calculateTrimGasConsumption(area, cuttingParams.assistGas);
  
  return {
    cuttingCost: Math.round(cuttingCost * 100) / 100,
    setupCost,
    gasConsumption: Math.round(gasConsumption * 100) / 100,
    total: Math.round((cuttingCost + setupCost + gasConsumption) * 100) / 100,
  };
}

function calculateTrimGasConsumption(area: number, assistGas: any) {
  const gasPrice = assistGas.type === 'nitrogen' ? 0.8 : 
                  assistGas.type === 'argon' ? 2.5 : 0.3; // Price per m³
  const consumptionRate = assistGas.flow / 60; // m³/min
  const cuttingTime = area * 3; // Estimated cutting time for trim work
  const gasVolume = consumptionRate * cuttingTime;
  
  return gasVolume * gasPrice;
}

function calculateFinishingCosts(area: number, surfaceFinish: string, materialType: string, quantity: string) {
  const finishingCosts = {
    mill_finish: 0,
    brushed: 15,
    polished: 35,
    mirror: 60,
    textured: 25,
    anodized: materialType === 'aluminum_alloy' ? 20 : 0,
  };
  
  const quantityMultipliers = {
    prototype: 2.0,
    small: 1.5,
    medium: 1.0,
    large: 0.8,
  };
  
  const baseCost = finishingCosts[surfaceFinish] || 0;
  const quantityMultiplier = quantityMultipliers[quantity] || 1.0;
  const finishingCost = area * baseCost * quantityMultiplier;
  
  const packaging = area * 2; // Protective packaging
  
  return {
    finishing: Math.round(finishingCost * 100) / 100,
    packaging: Math.round(packaging * 100) / 100,
    total: Math.round((finishingCost + packaging) * 100) / 100,
  };
}

function calculateTrimQualityCosts(area: number, quantity: string, complexity: string) {
  const inspectionCost = area * 8; // Higher inspection cost for trim
  
  const quantityFactors = {
    prototype: 3.0,
    small: 2.0,
    medium: 1.0,
    large: 0.7,
  };
  
  const complexityFactors = {
    simple: 0.8,
    moderate: 1.0,
    complex: 1.4,
    artistic: 1.8,
  };
  
  const quantityFactor = quantityFactors[quantity] || 1.0;
  const complexityFactor = complexityFactors[complexity] || 1.0;
  
  const adjustedInspectionCost = inspectionCost * quantityFactor * complexityFactor;
  const documentation = 20; // Documentation cost
  
  return {
    inspection: Math.round(adjustedInspectionCost * 100) / 100,
    documentation,
    total: Math.round((adjustedInspectionCost + documentation) * 100) / 100,
  };
}

export default interiorTrimConfig;
