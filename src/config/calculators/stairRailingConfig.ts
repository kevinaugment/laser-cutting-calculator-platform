import { CalculatorConfig } from '../../types/calculator';

export const stairRailingConfig: CalculatorConfig = {
  id: 'stair-railing',
  name: 'Stair & Railing Calculator',
  description: 'Specialized calculator for stair and railing components including stringers, treads, handrails, and balusters with building code compliance and safety requirements.',
  category: 'construction',
  difficulty: 'advanced',
  estimatedTime: '7-8 minutes',
  
  inputs: [
    {
      id: 'componentType',
      label: 'Component Type',
      type: 'select',
      value: 'stair_stringer',
      options: [
        { value: 'stair_stringer', label: 'Stair Stringer/Carriage' },
        { value: 'stair_tread', label: 'Stair Tread' },
        { value: 'stair_riser', label: 'Stair Riser' },
        { value: 'handrail', label: 'Handrail' },
        { value: 'baluster', label: 'Baluster/Spindle' },
        { value: 'newel_post', label: 'Newel Post' },
        { value: 'railing_panel', label: 'Railing Panel/Infill' },
        { value: 'landing_platform', label: 'Landing Platform' },
      ],
      required: true,
      description: 'Type of stair or railing component',
    },
    {
      id: 'materialSelection',
      label: 'Material Selection',
      type: 'select',
      value: 'carbon_steel',
      options: [
        { value: 'carbon_steel', label: 'Carbon Steel (Painted)' },
        { value: 'galvanized_steel', label: 'Galvanized Steel' },
        { value: 'stainless_304', label: 'Stainless Steel 304' },
        { value: 'stainless_316', label: 'Stainless Steel 316' },
        { value: 'aluminum_6061', label: 'Aluminum 6061-T6' },
        { value: 'aluminum_5052', label: 'Aluminum 5052-H32' },
        { value: 'weathering_steel', label: 'Weathering Steel (Corten)' },
        { value: 'brass', label: 'Brass (Decorative)' },
      ],
      required: true,
      description: 'Material for stair/railing component',
    },
    {
      id: 'materialThickness',
      label: 'Material Thickness',
      type: 'number',
      value: 6.0,
      unit: 'mm',
      min: 2.0,
      max: 20.0,
      step: 0.5,
      required: true,
      description: 'Thickness of material',
    },
    {
      id: 'stairConfiguration',
      label: 'Stair Configuration',
      type: 'select',
      value: 'straight_run',
      options: [
        { value: 'straight_run', label: 'Straight Run' },
        { value: 'l_shaped', label: 'L-Shaped (90° turn)' },
        { value: 'u_shaped', label: 'U-Shaped (180° turn)' },
        { value: 'spiral', label: 'Spiral/Curved' },
        { value: 'switchback', label: 'Switchback' },
        { value: 'custom', label: 'Custom Configuration' },
      ],
      required: true,
      description: 'Overall stair configuration',
    },
    {
      id: 'totalRise',
      label: 'Total Rise',
      type: 'number',
      value: 2800,
      unit: 'mm',
      min: 500,
      max: 6000,
      step: 50,
      required: true,
      description: 'Total vertical height of stair',
    },
    {
      id: 'totalRun',
      label: 'Total Run',
      type: 'number',
      value: 3600,
      unit: 'mm',
      min: 1000,
      max: 8000,
      step: 100,
      required: true,
      description: 'Total horizontal length of stair',
    },
    {
      id: 'stairWidth',
      label: 'Stair Width',
      type: 'number',
      value: 1200,
      unit: 'mm',
      min: 800,
      max: 3000,
      step: 50,
      required: true,
      description: 'Width of stair',
    },
    {
      id: 'buildingCode',
      label: 'Building Code',
      type: 'select',
      value: 'ibc',
      options: [
        { value: 'ibc', label: 'IBC (International Building Code)' },
        { value: 'nbc', label: 'NBC (National Building Code)' },
        { value: 'osha', label: 'OSHA (Occupational Safety)' },
        { value: 'ada', label: 'ADA (Accessibility)' },
        { value: 'local', label: 'Local Building Code' },
        { value: 'custom', label: 'Custom Requirements' },
      ],
      required: true,
      description: 'Applicable building code or standard',
    },
    {
      id: 'occupancyType',
      label: 'Occupancy Type',
      type: 'select',
      value: 'commercial',
      options: [
        { value: 'residential', label: 'Residential' },
        { value: 'commercial', label: 'Commercial/Office' },
        { value: 'industrial', label: 'Industrial' },
        { value: 'institutional', label: 'Institutional' },
        { value: 'assembly', label: 'Assembly/Public' },
        { value: 'emergency_egress', label: 'Emergency Egress' },
      ],
      required: true,
      description: 'Building occupancy classification',
    },
    {
      id: 'loadRequirement',
      label: 'Load Requirement',
      type: 'select',
      value: 'standard_commercial',
      options: [
        { value: 'residential', label: 'Residential (1.4 kPa)' },
        { value: 'standard_commercial', label: 'Standard Commercial (2.4 kPa)' },
        { value: 'heavy_commercial', label: 'Heavy Commercial (4.8 kPa)' },
        { value: 'industrial', label: 'Industrial (7.2 kPa)' },
        { value: 'emergency_egress', label: 'Emergency Egress (4.8 kPa)' },
        { value: 'custom', label: 'Custom Load Requirements' },
      ],
      required: true,
      description: 'Design load requirements',
    },
    {
      id: 'projectComplexity',
      label: 'Project Complexity',
      type: 'select',
      value: 'moderate',
      options: [
        { value: 'simple', label: 'Simple (Standard straight stairs)' },
        { value: 'moderate', label: 'Moderate (Some custom features)' },
        { value: 'complex', label: 'Complex (Custom design, curves)' },
        { value: 'architectural', label: 'Architectural (High-end, artistic)' },
      ],
      required: true,
      description: 'Overall project complexity level',
    },
  ],

  outputs: [
    {
      id: 'codeCompliance',
      label: 'Code Compliance',
      type: 'object',
      format: 'stair-code-compliance',
      description: 'Building code compliance analysis and requirements',
    },
    {
      id: 'structuralAnalysis',
      label: 'Structural Analysis',
      type: 'object',
      format: 'stair-structural-specs',
      description: 'Structural design and load analysis',
    },
    {
      id: 'fabricationSpecs',
      label: 'Fabrication Specifications',
      type: 'object',
      format: 'stair-fabrication-specs',
      description: 'Detailed fabrication and cutting specifications',
    },
    {
      id: 'projectCost',
      label: 'Project Cost',
      type: 'object',
      format: 'stair-project-cost',
      description: 'Comprehensive project cost analysis',
    },
  ],

  calculate: (inputs: Record<string, any>) => {
    const {
      componentType,
      materialSelection,
      materialThickness,
      stairConfiguration,
      totalRise,
      totalRun,
      stairWidth,
      buildingCode,
      occupancyType,
      loadRequirement,
      projectComplexity,
    } = inputs;

    // Analyze code compliance
    const codeCompliance = analyzeStairCodeCompliance(
      totalRise,
      totalRun,
      stairWidth,
      buildingCode,
      occupancyType,
      stairConfiguration
    );

    // Perform structural analysis
    const structuralAnalysis = performStairStructuralAnalysis(
      componentType,
      materialSelection,
      materialThickness,
      totalRise,
      totalRun,
      stairWidth,
      loadRequirement
    );

    // Calculate fabrication specifications
    const fabricationSpecs = calculateStairFabrication(
      componentType,
      materialSelection,
      materialThickness,
      stairConfiguration,
      projectComplexity
    );

    // Calculate project costs
    const projectCost = calculateStairProjectCost(
      componentType,
      materialSelection,
      materialThickness,
      totalRise,
      totalRun,
      stairWidth,
      projectComplexity,
      fabricationSpecs
    );

    return {
      codeCompliance,
      structuralAnalysis,
      fabricationSpecs,
      projectCost,
    };
  },

  validation: {
    materialThickness: {
      min: 2.0,
      max: 20.0,
      message: 'Material thickness must be between 2.0mm and 20.0mm for stair components',
    },
    totalRise: {
      min: 500,
      max: 6000,
      message: 'Total rise must be between 500mm and 6000mm',
    },
    totalRun: {
      min: 1000,
      max: 8000,
      message: 'Total run must be between 1000mm and 8000mm',
    },
    stairWidth: {
      min: 800,
      max: 3000,
      message: 'Stair width must be between 800mm and 3000mm',
    },
  },

  examples: [
    {
      name: 'Commercial Office Stair',
      description: 'Standard commercial office building staircase',
      inputs: {
        componentType: 'stair_stringer',
        materialSelection: 'carbon_steel',
        materialThickness: 8.0,
        stairConfiguration: 'straight_run',
        totalRise: 3000,
        totalRun: 3900,
        stairWidth: 1200,
        buildingCode: 'ibc',
        occupancyType: 'commercial',
        loadRequirement: 'standard_commercial',
        projectComplexity: 'moderate',
      },
    },
    {
      name: 'Industrial Platform Access',
      description: 'Heavy-duty industrial platform access stairs',
      inputs: {
        componentType: 'stair_stringer',
        materialSelection: 'galvanized_steel',
        materialThickness: 12.0,
        stairConfiguration: 'straight_run',
        totalRise: 4000,
        totalRun: 4800,
        stairWidth: 1000,
        buildingCode: 'osha',
        occupancyType: 'industrial',
        loadRequirement: 'industrial',
        projectComplexity: 'simple',
      },
    },
  ],

  tags: ['stairs', 'railing', 'building-code', 'structural', 'safety'],
  
  relatedCalculators: [
    'structural-analysis',
    'building-code-compliance',
    'load-analysis',
    'safety-requirements',
  ],

  learningResources: [
    {
      title: 'Stair Design and Building Codes',
      type: 'article',
      url: '/learn/stair-design-codes',
    },
    {
      title: 'Structural Steel Stairs',
      type: 'video',
      url: '/learn/steel-stair-construction',
    },
  ],
};

// Helper functions
function analyzeStairCodeCompliance(
  totalRise: number,
  totalRun: number,
  stairWidth: number,
  buildingCode: string,
  occupancyType: string,
  stairConfiguration: string
) {
  const stepGeometry = calculateStepGeometry(totalRise, totalRun);
  const codeRequirements = getCodeRequirements(buildingCode, occupancyType);
  const complianceCheck = checkCompliance(stepGeometry, stairWidth, codeRequirements);
  
  return {
    stepGeometry,
    codeRequirements,
    complianceCheck,
    recommendations: getComplianceRecommendations(complianceCheck),
    accessibilityRequirements: getAccessibilityRequirements(buildingCode, occupancyType),
    safetyFeatures: getSafetyFeatures(buildingCode, occupancyType),
  };
}

function calculateStepGeometry(totalRise: number, totalRun: number) {
  // Calculate optimal number of risers
  const idealRiserHeight = 175; // mm - optimal riser height
  const numberOfRisers = Math.round(totalRise / idealRiserHeight);
  const actualRiserHeight = totalRise / numberOfRisers;
  
  // Calculate tread depth
  const numberOfTreads = numberOfRisers - 1;
  const treadDepth = totalRun / numberOfTreads;
  
  // Calculate slope angle
  const slopeAngle = Math.atan(totalRise / totalRun) * (180 / Math.PI);
  
  return {
    numberOfRisers,
    numberOfTreads,
    riserHeight: Math.round(actualRiserHeight * 10) / 10,
    treadDepth: Math.round(treadDepth * 10) / 10,
    slopeAngle: Math.round(slopeAngle * 10) / 10,
    riserTreadFormula: Math.round((2 * actualRiserHeight + treadDepth) * 10) / 10, // Should be 600-650mm
  };
}

function getCodeRequirements(buildingCode: string, occupancyType: string) {
  const codeSpecs = {
    ibc: {
      residential: {
        maxRiserHeight: 196, // mm
        minTreadDepth: 254, // mm
        minWidth: 914, // mm
        maxSlopeAngle: 32.4, // degrees
        handrailHeight: [865, 965], // mm range
      },
      commercial: {
        maxRiserHeight: 178, // mm
        minTreadDepth: 279, // mm
        minWidth: 1118, // mm
        maxSlopeAngle: 32.4, // degrees
        handrailHeight: [865, 965], // mm range
      },
      industrial: {
        maxRiserHeight: 191, // mm
        minTreadDepth: 254, // mm
        minWidth: 914, // mm
        maxSlopeAngle: 37, // degrees
        handrailHeight: [865, 1070], // mm range
      },
    },
    osha: {
      industrial: {
        maxRiserHeight: 241, // mm
        minTreadDepth: 203, // mm
        minWidth: 559, // mm
        maxSlopeAngle: 50, // degrees
        handrailHeight: [965, 1219], // mm range
      },
    },
    ada: {
      accessible: {
        maxRiserHeight: 178, // mm
        minTreadDepth: 279, // mm
        minWidth: 1220, // mm
        maxSlopeAngle: 32.4, // degrees
        handrailHeight: [865, 965], // mm range
      },
    },
  };
  
  const code = codeSpecs[buildingCode] || codeSpecs.ibc;
  return code[occupancyType] || code.commercial;
}

function checkCompliance(stepGeometry: any, stairWidth: number, requirements: any) {
  const checks = {
    riserHeight: {
      compliant: stepGeometry.riserHeight <= requirements.maxRiserHeight,
      actual: stepGeometry.riserHeight,
      required: `≤ ${requirements.maxRiserHeight}mm`,
    },
    treadDepth: {
      compliant: stepGeometry.treadDepth >= requirements.minTreadDepth,
      actual: stepGeometry.treadDepth,
      required: `≥ ${requirements.minTreadDepth}mm`,
    },
    stairWidth: {
      compliant: stairWidth >= requirements.minWidth,
      actual: stairWidth,
      required: `≥ ${requirements.minWidth}mm`,
    },
    slopeAngle: {
      compliant: stepGeometry.slopeAngle <= requirements.maxSlopeAngle,
      actual: stepGeometry.slopeAngle,
      required: `≤ ${requirements.maxSlopeAngle}°`,
    },
    riserTreadFormula: {
      compliant: stepGeometry.riserTreadFormula >= 600 && stepGeometry.riserTreadFormula <= 650,
      actual: stepGeometry.riserTreadFormula,
      required: '600-650mm (2R + T)',
    },
  };
  
  const overallCompliance = Object.values(checks).every(check => check.compliant);
  
  return {
    overallCompliance,
    individualChecks: checks,
    nonCompliantItems: Object.entries(checks)
      .filter(([_, check]) => !check.compliant)
      .map(([key, _]) => key),
  };
}

function getComplianceRecommendations(complianceCheck: any) {
  const recommendations = [];
  
  if (!complianceCheck.overallCompliance) {
    recommendations.push('Stair geometry does not meet code requirements');
    
    complianceCheck.nonCompliantItems.forEach(item => {
      switch (item) {
        case 'riserHeight':
          recommendations.push('Reduce riser height by adding more steps');
          break;
        case 'treadDepth':
          recommendations.push('Increase tread depth or total run');
          break;
        case 'stairWidth':
          recommendations.push('Increase stair width to meet minimum requirements');
          break;
        case 'slopeAngle':
          recommendations.push('Reduce slope angle by increasing total run');
          break;
        case 'riserTreadFormula':
          recommendations.push('Adjust riser height and tread depth for optimal proportion');
          break;
      }
    });
  } else {
    recommendations.push('Stair geometry meets all code requirements');
    recommendations.push('Proceed with detailed design and fabrication');
  }
  
  return recommendations;
}

function getAccessibilityRequirements(buildingCode: string, occupancyType: string) {
  const requirements = [];
  
  if (buildingCode === 'ada' || occupancyType === 'assembly') {
    requirements.push('Handrails required on both sides');
    requirements.push('Handrail extensions required at top and bottom');
    requirements.push('Tactile warning surfaces at top of stairs');
    requirements.push('Consistent riser heights and tread depths');
  }
  
  if (occupancyType === 'commercial' || occupancyType === 'institutional') {
    requirements.push('Visual contrast on step edges');
    requirements.push('Adequate lighting levels');
    requirements.push('Non-slip tread surfaces');
  }
  
  return requirements;
}

function getSafetyFeatures(buildingCode: string, occupancyType: string) {
  const features = [
    'Handrails with proper grip size and shape',
    'Guardrails where required by code',
    'Non-slip tread surfaces',
    'Adequate lighting',
  ];
  
  if (occupancyType === 'industrial') {
    features.push('Toe plates on open sides');
    features.push('Self-draining treads');
    features.push('Corrosion-resistant materials');
  }
  
  if (occupancyType === 'emergency_egress') {
    features.push('Photoluminescent markings');
    features.push('Emergency lighting');
    features.push('Clear sight lines');
  }
  
  return features;
}

function performStairStructuralAnalysis(
  componentType: string,
  materialSelection: string,
  materialThickness: number,
  totalRise: number,
  totalRun: number,
  stairWidth: number,
  loadRequirement: string
) {
  const materialProperties = getStairMaterialProperties(materialSelection);
  const loadAnalysis = calculateStairLoads(loadRequirement, stairWidth, totalRun);
  const structuralCapacity = calculateStairStructuralCapacity(
    componentType,
    materialProperties,
    materialThickness,
    stairWidth,
    totalRun
  );
  
  return {
    materialProperties,
    loadAnalysis,
    structuralCapacity,
    deflectionAnalysis: calculateStairDeflection(structuralCapacity, loadAnalysis, totalRun),
    connectionRequirements: getStairConnectionRequirements(componentType, loadAnalysis),
    safetyFactors: calculateStairSafetyFactors(structuralCapacity, loadAnalysis),
  };
}

function getStairMaterialProperties(materialSelection: string) {
  const materials = {
    carbon_steel: {
      yieldStrength: 250, // MPa
      tensileStrength: 400, // MPa
      elasticModulus: 200, // GPa
      density: 7850, // kg/m³
      cost: 'Low',
      corrosionResistance: 'Poor (requires coating)',
    },
    galvanized_steel: {
      yieldStrength: 250, // MPa
      tensileStrength: 400, // MPa
      elasticModulus: 200, // GPa
      density: 7850, // kg/m³
      cost: 'Low-Medium',
      corrosionResistance: 'Good',
    },
    stainless_304: {
      yieldStrength: 205, // MPa
      tensileStrength: 515, // MPa
      elasticModulus: 200, // GPa
      density: 8000, // kg/m³
      cost: 'High',
      corrosionResistance: 'Excellent',
    },
    stainless_316: {
      yieldStrength: 290, // MPa
      tensileStrength: 580, // MPa
      elasticModulus: 200, // GPa
      density: 8000, // kg/m³
      cost: 'Very High',
      corrosionResistance: 'Outstanding',
    },
    aluminum_6061: {
      yieldStrength: 276, // MPa
      tensileStrength: 310, // MPa
      elasticModulus: 69, // GPa
      density: 2700, // kg/m³
      cost: 'Medium',
      corrosionResistance: 'Excellent',
    },
    aluminum_5052: {
      yieldStrength: 193, // MPa
      tensileStrength: 228, // MPa
      elasticModulus: 70, // GPa
      density: 2680, // kg/m³
      cost: 'Medium',
      corrosionResistance: 'Excellent',
    },
    weathering_steel: {
      yieldStrength: 345, // MPa
      tensileStrength: 485, // MPa
      elasticModulus: 200, // GPa
      density: 7850, // kg/m³
      cost: 'Medium',
      corrosionResistance: 'Self-protecting',
    },
    brass: {
      yieldStrength: 200, // MPa
      tensileStrength: 300, // MPa
      elasticModulus: 100, // GPa
      density: 8500, // kg/m³
      cost: 'Very High',
      corrosionResistance: 'Good',
    },
  };
  
  return materials[materialSelection] || materials.carbon_steel;
}

function calculateStairLoads(loadRequirement: string, stairWidth: number, totalRun: number) {
  const loadValues = {
    residential: 1.4, // kPa
    standard_commercial: 2.4, // kPa
    heavy_commercial: 4.8, // kPa
    industrial: 7.2, // kPa
    emergency_egress: 4.8, // kPa
    custom: 2.4, // kPa default
  };
  
  const liveLoad = loadValues[loadRequirement] || 2.4; // kPa
  const deadLoad = 0.5; // kPa (estimated self-weight and finishes)
  
  const stairArea = (stairWidth * totalRun) / 1000000; // m²
  const totalLiveLoad = liveLoad * stairArea; // kN
  const totalDeadLoad = deadLoad * stairArea; // kN
  
  // Load factors for ultimate limit state
  const factoredLoad = 1.25 * totalDeadLoad + 1.5 * totalLiveLoad; // kN
  
  return {
    liveLoad: Math.round(totalLiveLoad * 10) / 10,
    deadLoad: Math.round(totalDeadLoad * 10) / 10,
    factoredLoad: Math.round(factoredLoad * 10) / 10,
    loadPerMeter: Math.round(factoredLoad / (totalRun / 1000) * 10) / 10, // kN/m
    concentratedLoad: Math.round(liveLoad * 0.25 * 10) / 10, // kN (point load)
  };
}

function calculateStairStructuralCapacity(
  componentType: string,
  materialProps: any,
  thickness: number,
  width: number,
  span: number
) {
  // Simplified structural capacity calculation
  const area = thickness * width; // mm²
  const momentOfInertia = (width * Math.pow(thickness, 3)) / 12; // mm⁴
  const sectionModulus = momentOfInertia / (thickness / 2); // mm³
  
  const tensileCapacity = (area * materialProps.yieldStrength) / 1000; // kN
  const bendingCapacity = (sectionModulus * materialProps.yieldStrength) / 1000000; // kN⋅m
  
  return {
    tensileCapacity: Math.round(tensileCapacity * 10) / 10,
    bendingCapacity: Math.round(bendingCapacity * 10) / 10,
    allowableStress: Math.round(materialProps.yieldStrength / 2.5), // Factor of safety 2.5
    sectionModulus: Math.round(sectionModulus),
    momentOfInertia: Math.round(momentOfInertia),
  };
}

function calculateStairDeflection(structuralCapacity: any, loadAnalysis: any, span: number) {
  // Simplified deflection calculation for simply supported beam
  const elasticModulus = 200000; // MPa (steel)
  const momentOfInertia = structuralCapacity.momentOfInertia; // mm⁴
  const load = loadAnalysis.loadPerMeter * 1000; // N/m
  
  // Maximum deflection: δ = 5wL⁴/(384EI)
  const deflection = (5 * load * Math.pow(span, 4)) / (384 * elasticModulus * momentOfInertia);
  const deflectionRatio = span / deflection;
  
  // Allowable deflection limits
  const allowableRatio = 300; // L/300 for stairs
  
  return {
    calculatedDeflection: Math.round(deflection * 100) / 100,
    deflectionRatio: Math.round(deflectionRatio),
    allowableDeflection: Math.round(span / allowableRatio * 100) / 100,
    compliance: deflectionRatio > allowableRatio ? 'Compliant' : 'Non-compliant',
    recommendation: getDeflectionRecommendation(deflectionRatio, allowableRatio),
  };
}

function getDeflectionRecommendation(actual: number, allowable: number) {
  if (actual > allowable * 1.5) {
    return 'Excellent stiffness - very rigid structure';
  } else if (actual > allowable) {
    return 'Adequate stiffness - meets code requirements';
  } else {
    return 'Insufficient stiffness - increase member size or add support';
  }
}

function getStairConnectionRequirements(componentType: string, loadAnalysis: any) {
  const requirements = {
    stair_stringer: {
      topConnection: 'Bolted or welded to landing beam',
      bottomConnection: 'Anchor bolts to foundation',
      intermediateSupport: 'Consider mid-span support for long spans',
    },
    handrail: {
      postSpacing: 'Maximum 2400mm centers',
      connectionType: 'Structural bolts or welding',
      loadCapacity: '0.9 kN concentrated load',
    },
    baluster: {
      spacing: 'Maximum 100mm clear opening',
      connectionType: 'Welded or mechanical fasteners',
      loadCapacity: '0.5 kN concentrated load',
    },
  };
  
  return requirements[componentType] || requirements.stair_stringer;
}

function calculateStairSafetyFactors(structuralCapacity: any, loadAnalysis: any) {
  const tensileRatio = structuralCapacity.tensileCapacity / loadAnalysis.factoredLoad;
  const bendingRatio = structuralCapacity.bendingCapacity / (loadAnalysis.loadPerMeter * 2); // Simplified moment
  
  return {
    tensileRatio: Math.round(tensileRatio * 10) / 10,
    bendingRatio: Math.round(bendingRatio * 10) / 10,
    overallSafety: Math.min(tensileRatio, bendingRatio),
    adequacy: getAdequacyRating(Math.min(tensileRatio, bendingRatio)),
  };
}

function getAdequacyRating(ratio: number) {
  if (ratio > 3.0) return 'Excellent - Very conservative design';
  if (ratio > 2.0) return 'Good - Adequate safety margin';
  if (ratio > 1.5) return 'Adequate - Meets minimum requirements';
  if (ratio > 1.0) return 'Marginal - Consider increasing capacity';
  return 'Inadequate - Increase member size';
}

export default stairRailingConfig;
