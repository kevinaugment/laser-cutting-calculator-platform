import { CalculatorConfig } from '../../types/calculator';

export const safetyComponentConfig: CalculatorConfig = {
  id: 'safety-component',
  name: 'Safety Component Calculator',
  description: 'Specialized calculator for automotive safety-critical components including airbag brackets, seatbelt anchors, and crash sensors with stringent safety and regulatory requirements.',
  category: 'automotive',
  difficulty: 'expert',
  estimatedTime: '8-9 minutes',
  
  inputs: [
    {
      id: 'safetyComponentType',
      label: 'Safety Component Type',
      type: 'select',
      value: 'airbag_bracket',
      options: [
        { value: 'airbag_bracket', label: 'Airbag Mounting Bracket' },
        { value: 'seatbelt_anchor', label: 'Seatbelt Anchor Point' },
        { value: 'crash_sensor_mount', label: 'Crash Sensor Mount' },
        { value: 'steering_column_bracket', label: 'Steering Column Bracket' },
        { value: 'pedal_assembly', label: 'Brake/Clutch Pedal Assembly' },
        { value: 'door_latch_plate', label: 'Door Latch Reinforcement' },
        { value: 'rollover_protection', label: 'Rollover Protection Bar' },
      ],
      required: true,
      description: 'Type of safety-critical automotive component',
    },
    {
      id: 'materialSpecification',
      label: 'Material Specification',
      type: 'select',
      value: 'hsla_590',
      options: [
        { value: 'hsla_590', label: 'HSLA 590 MPa (High Strength)' },
        { value: 'dp_780', label: 'Dual Phase 780 MPa' },
        { value: 'dp_980', label: 'Dual Phase 980 MPa' },
        { value: 'cp_1000', label: 'Complex Phase 1000 MPa' },
        { value: 'mart_1200', label: 'Martensitic 1200 MPa' },
        { value: 'mart_1500', label: 'Martensitic 1500 MPa' },
        { value: 'boron_steel_1500', label: 'Boron Steel 1500+ MPa' },
        { value: 'stainless_316', label: 'Stainless Steel 316 (Corrosion Critical)' },
      ],
      required: true,
      description: 'High-strength material for safety applications',
    },
    {
      id: 'componentThickness',
      label: 'Component Thickness',
      type: 'number',
      value: 3.0,
      unit: 'mm',
      min: 1.5,
      max: 10.0,
      step: 0.1,
      required: true,
      description: 'Thickness of safety component',
    },
    {
      id: 'componentDimensions',
      label: 'Component Size',
      type: 'select',
      value: 'medium',
      options: [
        { value: 'small', label: 'Small (< 100mm)' },
        { value: 'medium', label: 'Medium (100-300mm)' },
        { value: 'large', label: 'Large (300-600mm)' },
        { value: 'extra_large', label: 'Extra Large (> 600mm)' },
      ],
      required: true,
      description: 'Overall size category of component',
    },
    {
      id: 'safetyStandard',
      label: 'Safety Standard',
      type: 'select',
      value: 'fmvss',
      options: [
        { value: 'fmvss', label: 'FMVSS (US Federal Motor Vehicle Safety Standards)' },
        { value: 'ece', label: 'ECE (European Economic Commission)' },
        { value: 'jis', label: 'JIS (Japanese Industrial Standards)' },
        { value: 'iso', label: 'ISO 26262 (Functional Safety)' },
        { value: 'ncap', label: 'NCAP (New Car Assessment Program)' },
      ],
      required: true,
      description: 'Applicable safety standard or regulation',
    },
    {
      id: 'loadRequirement',
      label: 'Load Requirement',
      type: 'select',
      value: 'high',
      options: [
        { value: 'moderate', label: 'Moderate (< 10 kN)' },
        { value: 'high', label: 'High (10-50 kN)' },
        { value: 'very_high', label: 'Very High (50-100 kN)' },
        { value: 'extreme', label: 'Extreme (> 100 kN)' },
      ],
      required: true,
      description: 'Expected load requirements for safety function',
    },
    {
      id: 'geometricComplexity',
      label: 'Geometric Complexity',
      type: 'select',
      value: 'high',
      options: [
        { value: 'moderate', label: 'Moderate (Basic shapes, few features)' },
        { value: 'high', label: 'High (Complex geometry, multiple features)' },
        { value: 'very_high', label: 'Very High (Intricate design, tight tolerances)' },
        { value: 'extreme', label: 'Extreme (Precision features, micro-geometry)' },
      ],
      required: true,
      description: 'Geometric complexity of safety component',
    },
    {
      id: 'qualityLevel',
      label: 'Quality Level',
      type: 'select',
      value: 'safety_critical',
      options: [
        { value: 'automotive_standard', label: 'Automotive Standard' },
        { value: 'safety_critical', label: 'Safety Critical' },
        { value: 'life_critical', label: 'Life Critical' },
        { value: 'aerospace_grade', label: 'Aerospace Grade' },
      ],
      required: true,
      description: 'Required quality and inspection level',
    },
    {
      id: 'productionVolume',
      label: 'Production Volume',
      type: 'select',
      value: 'mass_production',
      options: [
        { value: 'prototype', label: 'Prototype/Validation (1-10 units)' },
        { value: 'pilot', label: 'Pilot Production (10-100 units)' },
        { value: 'low_volume', label: 'Low Volume (100-1000 units)' },
        { value: 'mass_production', label: 'Mass Production (1000+ units)' },
      ],
      required: true,
      description: 'Expected production volume',
    },
  ],

  outputs: [
    {
      id: 'safetyAnalysis',
      label: 'Safety Analysis',
      type: 'object',
      format: 'safety-performance-specs',
      description: 'Comprehensive safety performance and compliance analysis',
    },
    {
      id: 'cuttingSpecification',
      label: 'Cutting Specification',
      type: 'object',
      format: 'safety-cutting-params',
      description: 'Precision cutting parameters for safety-critical components',
    },
    {
      id: 'qualityAssurance',
      label: 'Quality Assurance',
      type: 'object',
      format: 'safety-qa-requirements',
      description: 'Quality assurance and testing requirements for safety compliance',
    },
    {
      id: 'complianceCost',
      label: 'Compliance Cost',
      type: 'object',
      format: 'safety-cost-analysis',
      description: 'Cost analysis including safety compliance and certification requirements',
    },
  ],

  calculate: (inputs: Record<string, any>) => {
    const {
      safetyComponentType,
      materialSpecification,
      componentThickness,
      componentDimensions,
      safetyStandard,
      loadRequirement,
      geometricComplexity,
      qualityLevel,
      productionVolume,
    } = inputs;

    // Analyze safety performance
    const safetyAnalysis = analyzeSafetyPerformance(
      safetyComponentType,
      materialSpecification,
      componentThickness,
      loadRequirement,
      safetyStandard
    );

    // Calculate cutting specifications
    const cuttingSpecification = calculateSafetyCuttingSpecification(
      materialSpecification,
      componentThickness,
      geometricComplexity,
      qualityLevel
    );

    // Define quality assurance
    const qualityAssurance = defineSafetyQualityAssurance(
      qualityLevel,
      safetyStandard,
      safetyComponentType,
      materialSpecification
    );

    // Calculate compliance costs
    const complianceCost = calculateSafetyComplianceCost(
      componentDimensions,
      componentThickness,
      materialSpecification,
      geometricComplexity,
      qualityLevel,
      productionVolume,
      safetyStandard,
      cuttingSpecification
    );

    return {
      safetyAnalysis,
      cuttingSpecification,
      qualityAssurance,
      complianceCost,
    };
  },

  validation: {
    componentThickness: {
      min: 1.5,
      max: 10.0,
      message: 'Component thickness must be between 1.5mm and 10.0mm for safety components',
    },
  },

  examples: [
    {
      name: 'Airbag Mounting Bracket',
      description: 'High-strength airbag mounting bracket for passenger safety',
      inputs: {
        safetyComponentType: 'airbag_bracket',
        materialSpecification: 'dp_980',
        componentThickness: 2.5,
        componentDimensions: 'medium',
        safetyStandard: 'fmvss',
        loadRequirement: 'very_high',
        geometricComplexity: 'high',
        qualityLevel: 'safety_critical',
        productionVolume: 'mass_production',
      },
    },
    {
      name: 'Seatbelt Anchor Point',
      description: 'Ultra-high strength seatbelt anchor for crash protection',
      inputs: {
        safetyComponentType: 'seatbelt_anchor',
        materialSpecification: 'mart_1500',
        componentThickness: 4.0,
        componentDimensions: 'small',
        safetyStandard: 'fmvss',
        loadRequirement: 'extreme',
        geometricComplexity: 'very_high',
        qualityLevel: 'life_critical',
        productionVolume: 'mass_production',
      },
    },
  ],

  tags: ['automotive', 'safety', 'critical', 'compliance', 'high-strength'],
  
  relatedCalculators: [
    'chassis-component',
    'crash-simulation',
    'regulatory-compliance',
    'quality-assurance',
  ],

  learningResources: [
    {
      title: 'Automotive Safety Standards',
      type: 'article',
      url: '/learn/automotive-safety-standards',
    },
    {
      title: 'Safety-Critical Manufacturing',
      type: 'video',
      url: '/learn/safety-critical-manufacturing',
    },
  ],
};

// Helper functions
function analyzeSafetyPerformance(
  componentType: string,
  materialSpec: string,
  thickness: number,
  loadReq: string,
  safetyStandard: string
) {
  const materialProperties = getSafetyMaterialProperties(materialSpec);
  const loadCapacity = calculateLoadCapacity(materialSpec, thickness, componentType);
  const safetyFactors = calculateSafetyFactors(loadReq, safetyStandard, componentType);
  const failureAnalysis = analyzeFailureModes(componentType, materialSpec, loadReq);
  
  return {
    materialProperties,
    loadCapacity,
    safetyFactors,
    failureAnalysis,
    complianceAssessment: assessCompliance(componentType, safetyStandard, materialSpec),
    performanceRating: calculatePerformanceRating(loadCapacity, safetyFactors, materialProperties),
  };
}

function getSafetyMaterialProperties(materialSpec: string) {
  const materials = {
    hsla_590: {
      tensileStrength: '590-700 MPa',
      yieldStrength: '590 MPa min',
      elongation: '16-22%',
      impactToughness: '150-200 J',
      fatigueStrength: '250-300 MPa',
      safetyRating: 'Good',
      applications: ['Moderate load safety components'],
    },
    dp_780: {
      tensileStrength: '780-950 MPa',
      yieldStrength: '450-600 MPa',
      elongation: '12-18%',
      impactToughness: '180-250 J',
      fatigueStrength: '320-380 MPa',
      safetyRating: 'Very Good',
      applications: ['High load safety components', 'Crash structures'],
    },
    dp_980: {
      tensileStrength: '980-1200 MPa',
      yieldStrength: '600-800 MPa',
      elongation: '10-16%',
      impactToughness: '200-280 J',
      fatigueStrength: '400-480 MPa',
      safetyRating: 'Excellent',
      applications: ['Critical safety components', 'Impact beams'],
    },
    cp_1000: {
      tensileStrength: '1000-1200 MPa',
      yieldStrength: '700-900 MPa',
      elongation: '8-14%',
      impactToughness: '220-300 J',
      fatigueStrength: '450-550 MPa',
      safetyRating: 'Excellent',
      applications: ['High-performance safety components'],
    },
    mart_1200: {
      tensileStrength: '1200-1500 MPa',
      yieldStrength: '1000-1300 MPa',
      elongation: '4-8%',
      impactToughness: '100-150 J',
      fatigueStrength: '500-600 MPa',
      safetyRating: 'Very High Strength',
      applications: ['Ultra-high load components', 'Specialized safety parts'],
    },
    mart_1500: {
      tensileStrength: '1500-1800 MPa',
      yieldStrength: '1300-1600 MPa',
      elongation: '3-6%',
      impactToughness: '80-120 J',
      fatigueStrength: '600-720 MPa',
      safetyRating: 'Ultra-High Strength',
      applications: ['Extreme load safety components'],
    },
    boron_steel_1500: {
      tensileStrength: '1500-2000 MPa',
      yieldStrength: '1400-1800 MPa',
      elongation: '2-5%',
      impactToughness: '60-100 J',
      fatigueStrength: '650-800 MPa',
      safetyRating: 'Maximum Strength',
      applications: ['Ultimate strength requirements'],
    },
    stainless_316: {
      tensileStrength: '515-620 MPa',
      yieldStrength: '205-310 MPa',
      elongation: '35-45%',
      impactToughness: '300-400 J',
      fatigueStrength: '200-250 MPa',
      safetyRating: 'Corrosion Critical',
      applications: ['Corrosive environment safety components'],
    },
  };
  
  return materials[materialSpec] || materials.hsla_590;
}

function calculateLoadCapacity(materialSpec: string, thickness: number, componentType: string) {
  // Extract tensile strength
  const materialProps = getSafetyMaterialProperties(materialSpec);
  const tensileRange = materialProps.tensileStrength.match(/(\d+)-(\d+)/);
  const minTensile = tensileRange ? parseInt(tensileRange[1]) : 500;
  const maxTensile = tensileRange ? parseInt(tensileRange[2]) : 600;
  const avgTensile = (minTensile + maxTensile) / 2;
  
  // Component geometry factors
  const geometryFactors = {
    airbag_bracket: 0.8,        // Complex geometry reduces effective area
    seatbelt_anchor: 1.0,       // Simple, robust geometry
    crash_sensor_mount: 0.7,    // Delicate mounting features
    steering_column_bracket: 0.9, // Moderate complexity
    pedal_assembly: 0.85,       // Multiple load paths
    door_latch_plate: 0.9,      // Reinforcement design
    rollover_protection: 1.0,   // Maximum strength design
  };
  
  const geometryFactor = geometryFactors[componentType] || 0.8;
  const effectiveArea = thickness * 100 * geometryFactor; // Assume 100mm width, adjusted for geometry
  
  const ultimateLoad = (effectiveArea * avgTensile) / 1000; // kN
  const yieldLoad = ultimateLoad * 0.7; // Approximate yield load
  
  return {
    ultimateLoad: Math.round(ultimateLoad),
    yieldLoad: Math.round(yieldLoad),
    workingLoad: Math.round(yieldLoad / 2.5), // With safety factor
    loadCapacityRating: getLoadCapacityRating(ultimateLoad),
    designMargin: calculateDesignMargin(ultimateLoad, componentType),
  };
}

function getLoadCapacityRating(ultimateLoad: number) {
  if (ultimateLoad > 200) return 'Extreme Load Capacity';
  if (ultimateLoad > 100) return 'Very High Load Capacity';
  if (ultimateLoad > 50) return 'High Load Capacity';
  if (ultimateLoad > 20) return 'Moderate Load Capacity';
  return 'Low Load Capacity';
}

function calculateDesignMargin(ultimateLoad: number, componentType: string) {
  const requiredLoads = {
    airbag_bracket: 25,         // kN
    seatbelt_anchor: 150,       // kN (very high for crash loads)
    crash_sensor_mount: 10,     // kN
    steering_column_bracket: 50, // kN
    pedal_assembly: 30,         // kN
    door_latch_plate: 40,       // kN
    rollover_protection: 200,   // kN
  };
  
  const requiredLoad = requiredLoads[componentType] || 50;
  const margin = (ultimateLoad / requiredLoad) - 1;
  
  return {
    requiredLoad,
    availableLoad: ultimateLoad,
    safetyMargin: Math.round(margin * 100),
    adequacy: margin > 1.5 ? 'Excellent' : margin > 1.0 ? 'Good' : margin > 0.5 ? 'Adequate' : 'Insufficient',
  };
}

function calculateSafetyFactors(loadReq: string, safetyStandard: string, componentType: string) {
  const baseFactors = {
    moderate: 2.0,
    high: 2.5,
    very_high: 3.0,
    extreme: 4.0,
  };
  
  const standardMultipliers = {
    fmvss: 1.2,    // US standards are stringent
    ece: 1.1,      // European standards
    jis: 1.0,      // Japanese standards
    iso: 1.3,      // ISO 26262 functional safety
    ncap: 1.4,     // NCAP testing is most stringent
  };
  
  const componentMultipliers = {
    airbag_bracket: 1.2,
    seatbelt_anchor: 1.5,      // Highest safety factor
    crash_sensor_mount: 1.0,
    steering_column_bracket: 1.1,
    pedal_assembly: 1.0,
    door_latch_plate: 1.1,
    rollover_protection: 1.3,
  };
  
  const baseFactor = baseFactors[loadReq] || 2.5;
  const standardMultiplier = standardMultipliers[safetyStandard] || 1.1;
  const componentMultiplier = componentMultipliers[componentType] || 1.0;
  
  const totalSafetyFactor = baseFactor * standardMultiplier * componentMultiplier;
  
  return {
    baseSafetyFactor: baseFactor,
    standardRequirement: standardMultiplier,
    componentRequirement: componentMultiplier,
    totalSafetyFactor: Math.round(totalSafetyFactor * 10) / 10,
    justification: getSafetyFactorJustification(totalSafetyFactor, componentType),
  };
}

function getSafetyFactorJustification(factor: number, componentType: string) {
  const justifications = [];
  
  if (factor > 4.0) {
    justifications.push('Extremely high safety factor for life-critical application');
  } else if (factor > 3.0) {
    justifications.push('High safety factor for safety-critical application');
  } else {
    justifications.push('Standard safety factor for automotive application');
  }
  
  if (['seatbelt_anchor', 'rollover_protection'].includes(componentType)) {
    justifications.push('Enhanced factor for primary crash protection');
  }
  
  justifications.push('Accounts for material variability and manufacturing tolerances');
  justifications.push('Meets regulatory requirements for automotive safety');
  
  return justifications;
}

function analyzeFailureModes(componentType: string, materialSpec: string, loadReq: string) {
  const failureModes = [];
  
  // Primary failure modes by component type
  const componentFailures = {
    airbag_bracket: [
      { mode: 'Bracket fracture', probability: 'Low', consequence: 'High', mitigation: 'Material upgrade, design optimization' },
      { mode: 'Mounting bolt failure', probability: 'Medium', consequence: 'High', mitigation: 'High-strength fasteners' },
      { mode: 'Weld failure', probability: 'Low', consequence: 'High', mitigation: 'Certified welding procedures' },
    ],
    seatbelt_anchor: [
      { mode: 'Anchor point fracture', probability: 'Very Low', consequence: 'Critical', mitigation: 'Ultra-high strength material' },
      { mode: 'Progressive tearing', probability: 'Low', consequence: 'Critical', mitigation: 'Stress distribution design' },
      { mode: 'Fatigue cracking', probability: 'Medium', consequence: 'High', mitigation: 'Fatigue-resistant design' },
    ],
    crash_sensor_mount: [
      { mode: 'Mount deformation', probability: 'Medium', consequence: 'Medium', mitigation: 'Rigid mounting design' },
      { mode: 'Sensor misalignment', probability: 'Medium', consequence: 'High', mitigation: 'Precision manufacturing' },
      { mode: 'Vibration loosening', probability: 'High', consequence: 'Medium', mitigation: 'Thread locking compounds' },
    ],
  };
  
  const specificFailures = componentFailures[componentType] || componentFailures.airbag_bracket;
  
  // Material-specific considerations
  if (['mart_1200', 'mart_1500', 'boron_steel_1500'].includes(materialSpec)) {
    failureModes.push({
      mode: 'Brittle fracture',
      probability: 'Low',
      consequence: 'High',
      mitigation: 'Careful heat treatment, avoid stress concentrations',
    });
  }
  
  return {
    primaryFailureModes: specificFailures,
    materialConsiderations: getMaterialFailureConsiderations(materialSpec),
    preventiveMeasures: getPreventiveMeasures(componentType, materialSpec),
    inspectionRequirements: getFailureInspectionRequirements(componentType),
  };
}

function getMaterialFailureConsiderations(materialSpec: string) {
  const considerations = {
    hsla_590: ['Standard ductile failure modes', 'Good damage tolerance'],
    dp_780: ['Excellent energy absorption', 'Predictable failure progression'],
    dp_980: ['High strength with good ductility', 'Controlled failure behavior'],
    cp_1000: ['Complex microstructure benefits', 'Good formability retention'],
    mart_1200: ['High strength but reduced ductility', 'Potential for brittle failure'],
    mart_1500: ['Very high strength, limited ductility', 'Requires careful design'],
    boron_steel_1500: ['Maximum strength, minimal ductility', 'Brittle failure risk'],
    stainless_316: ['Excellent corrosion resistance', 'Good ductility and toughness'],
  };
  
  return considerations[materialSpec] || considerations.hsla_590;
}

function getPreventiveMeasures(componentType: string, materialSpec: string) {
  const measures = [
    'Stress concentration elimination',
    'Proper heat treatment',
    'Quality welding procedures',
    'Corrosion protection',
  ];
  
  if (['mart_1200', 'mart_1500', 'boron_steel_1500'].includes(materialSpec)) {
    measures.push('Hydrogen embrittlement prevention');
    measures.push('Careful machining to avoid work hardening');
  }
  
  if (componentType === 'seatbelt_anchor') {
    measures.push('Redundant load paths');
    measures.push('Progressive failure design');
  }
  
  return measures;
}

function getFailureInspectionRequirements(componentType: string) {
  const requirements = [
    'Visual inspection for cracks',
    'Dimensional verification',
    'Material hardness testing',
  ];
  
  if (['seatbelt_anchor', 'rollover_protection'].includes(componentType)) {
    requirements.push('Non-destructive testing (NDT)');
    requirements.push('Proof load testing');
  }
  
  return requirements;
}

function assessCompliance(componentType: string, safetyStandard: string, materialSpec: string) {
  const complianceRequirements = getComplianceRequirements(safetyStandard, componentType);
  const materialCompliance = getMaterialCompliance(materialSpec, safetyStandard);
  const testingRequirements = getComplianceTestingRequirements(componentType, safetyStandard);
  
  return {
    applicableStandards: complianceRequirements.standards,
    materialCompliance,
    testingRequirements,
    certificationRequirements: complianceRequirements.certification,
    documentationRequirements: complianceRequirements.documentation,
    complianceRating: calculateComplianceRating(materialCompliance, componentType),
  };
}

function getComplianceRequirements(safetyStandard: string, componentType: string) {
  const requirements = {
    fmvss: {
      standards: ['FMVSS 208 (Occupant Protection)', 'FMVSS 210 (Seat Belt Assembly)'],
      certification: 'DOT certification required',
      documentation: 'Full compliance documentation package',
    },
    ece: {
      standards: ['ECE R16 (Seat Belts)', 'ECE R94 (Frontal Impact)'],
      certification: 'E-mark certification required',
      documentation: 'European compliance documentation',
    },
    jis: {
      standards: ['JIS D 4604 (Seat Belt)', 'JIS D 0203 (Automotive Parts)'],
      certification: 'JIS certification required',
      documentation: 'Japanese compliance documentation',
    },
    iso: {
      standards: ['ISO 26262 (Functional Safety)', 'ISO 6487 (Crash Testing)'],
      certification: 'ISO 26262 ASIL rating required',
      documentation: 'Functional safety documentation',
    },
    ncap: {
      standards: ['NCAP Test Protocols', 'Advanced Safety Requirements'],
      certification: 'NCAP compliance verification',
      documentation: 'Enhanced safety documentation',
    },
  };
  
  return requirements[safetyStandard] || requirements.fmvss;
}

function getMaterialCompliance(materialSpec: string, safetyStandard: string) {
  const compliance = {
    approved: true,
    certificationLevel: 'Standard',
    restrictions: [],
    additionalRequirements: [],
  };
  
  if (['mart_1500', 'boron_steel_1500'].includes(materialSpec)) {
    compliance.certificationLevel = 'Special Approval Required';
    compliance.additionalRequirements.push('Material property verification');
    compliance.additionalRequirements.push('Hydrogen embrittlement testing');
  }
  
  if (safetyStandard === 'ncap') {
    compliance.additionalRequirements.push('Enhanced material documentation');
    compliance.additionalRequirements.push('Batch testing requirements');
  }
  
  return compliance;
}

function getComplianceTestingRequirements(componentType: string, safetyStandard: string) {
  const tests = [
    {
      test: 'Tensile Testing',
      standard: 'ASTM E8',
      frequency: 'Per material lot',
      requirement: 'Meet minimum strength requirements',
    },
    {
      test: 'Impact Testing',
      standard: 'ASTM E23',
      frequency: 'Sample basis',
      requirement: 'Minimum impact toughness',
    },
  ];
  
  if (['seatbelt_anchor', 'rollover_protection'].includes(componentType)) {
    tests.push({
      test: 'Proof Load Testing',
      standard: 'Component specific',
      frequency: '100% or statistical sampling',
      requirement: 'No permanent deformation at proof load',
    });
  }
  
  if (safetyStandard === 'iso') {
    tests.push({
      test: 'Functional Safety Testing',
      standard: 'ISO 26262',
      frequency: 'Design validation',
      requirement: 'Meet ASIL requirements',
    });
  }
  
  return tests;
}

function calculateComplianceRating(materialCompliance: any, componentType: string) {
  let score = 100;
  
  if (materialCompliance.certificationLevel === 'Special Approval Required') {
    score -= 10;
  }
  
  if (materialCompliance.additionalRequirements.length > 2) {
    score -= 15;
  }
  
  if (['seatbelt_anchor', 'rollover_protection'].includes(componentType)) {
    score -= 5; // Higher scrutiny for critical components
  }
  
  if (score >= 95) return 'Excellent';
  if (score >= 85) return 'Very Good';
  if (score >= 75) return 'Good';
  if (score >= 65) return 'Adequate';
  return 'Needs Improvement';
}

function calculatePerformanceRating(loadCapacity: any, safetyFactors: any, materialProps: any) {
  let score = 0;
  
  // Load capacity contribution (40%)
  if (loadCapacity.designMargin.safetyMargin > 150) score += 40;
  else if (loadCapacity.designMargin.safetyMargin > 100) score += 35;
  else if (loadCapacity.designMargin.safetyMargin > 50) score += 30;
  else if (loadCapacity.designMargin.safetyMargin > 0) score += 20;
  else score += 0;
  
  // Safety factor contribution (30%)
  if (safetyFactors.totalSafetyFactor > 4.0) score += 30;
  else if (safetyFactors.totalSafetyFactor > 3.0) score += 25;
  else if (safetyFactors.totalSafetyFactor > 2.5) score += 20;
  else score += 10;
  
  // Material rating contribution (30%)
  const materialRatings = {
    'Good': 15,
    'Very Good': 20,
    'Excellent': 25,
    'Very High Strength': 28,
    'Ultra-High Strength': 30,
    'Maximum Strength': 30,
    'Corrosion Critical': 20,
  };
  
  score += materialRatings[materialProps.safetyRating] || 15;
  
  if (score >= 90) return 'Outstanding';
  if (score >= 80) return 'Excellent';
  if (score >= 70) return 'Very Good';
  if (score >= 60) return 'Good';
  if (score >= 50) return 'Adequate';
  return 'Needs Improvement';
}

export default safetyComponentConfig;
