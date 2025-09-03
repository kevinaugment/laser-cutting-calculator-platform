import { CalculatorConfig } from '../../types/calculator';

export const chassisComponentConfig: CalculatorConfig = {
  id: 'chassis-component',
  name: 'Chassis Component Calculator',
  description: 'Specialized calculator for automotive chassis components including frame rails, cross members, and structural reinforcements with crash safety considerations.',
  category: 'automotive',
  difficulty: 'advanced',
  estimatedTime: '7-8 minutes',
  
  inputs: [
    {
      id: 'componentType',
      label: 'Chassis Component Type',
      type: 'select',
      value: 'frame_rail',
      options: [
        { value: 'frame_rail', label: 'Frame Rail/Longitudinal' },
        { value: 'cross_member', label: 'Cross Member/Transverse' },
        { value: 'subframe', label: 'Subframe Component' },
        { value: 'reinforcement', label: 'Structural Reinforcement' },
        { value: 'mounting_bracket', label: 'Engine/Suspension Mount' },
        { value: 'crash_box', label: 'Crash Box/Energy Absorber' },
      ],
      required: true,
      description: 'Type of chassis structural component',
    },
    {
      id: 'materialSpecification',
      label: 'Material Specification',
      type: 'select',
      value: 'hsla_590',
      options: [
        { value: 'hsla_420', label: 'HSLA 420 MPa' },
        { value: 'hsla_590', label: 'HSLA 590 MPa' },
        { value: 'dp_780', label: 'Dual Phase 780 MPa' },
        { value: 'dp_980', label: 'Dual Phase 980 MPa' },
        { value: 'cp_800', label: 'Complex Phase 800 MPa' },
        { value: 'mart_1200', label: 'Martensitic 1200 MPa' },
        { value: 'mart_1500', label: 'Martensitic 1500 MPa' },
        { value: 'boron_steel', label: 'Boron Steel 1500+ MPa' },
      ],
      required: true,
      description: 'High-strength steel specification for chassis',
    },
    {
      id: 'plateThickness',
      label: 'Plate Thickness',
      type: 'number',
      value: 2.0,
      unit: 'mm',
      min: 1.0,
      max: 8.0,
      step: 0.1,
      required: true,
      description: 'Steel plate thickness',
    },
    {
      id: 'componentLength',
      label: 'Component Length',
      type: 'number',
      value: 1500,
      unit: 'mm',
      min: 200,
      max: 4000,
      step: 10,
      required: true,
      description: 'Overall length of chassis component',
    },
    {
      id: 'componentWidth',
      label: 'Component Width',
      type: 'number',
      value: 300,
      unit: 'mm',
      min: 50,
      max: 800,
      step: 10,
      required: true,
      description: 'Maximum width of component',
    },
    {
      id: 'structuralComplexity',
      label: 'Structural Complexity',
      type: 'select',
      value: 'high',
      options: [
        { value: 'moderate', label: 'Moderate (Basic shapes, few features)' },
        { value: 'high', label: 'High (Complex geometry, multiple features)' },
        { value: 'very_high', label: 'Very High (Intricate design, tight tolerances)' },
        { value: 'extreme', label: 'Extreme (Aerospace-level complexity)' },
      ],
      required: true,
      description: 'Geometric complexity of the component',
    },
    {
      id: 'safetyRequirement',
      label: 'Safety Requirement Level',
      type: 'select',
      value: 'crash_critical',
      options: [
        { value: 'standard', label: 'Standard (Non-critical structural)' },
        { value: 'safety_relevant', label: 'Safety Relevant (Secondary structure)' },
        { value: 'crash_critical', label: 'Crash Critical (Primary structure)' },
        { value: 'ultra_critical', label: 'Ultra Critical (Occupant protection)' },
      ],
      required: true,
      description: 'Safety criticality level for crash performance',
    },
    {
      id: 'weldingRequirement',
      label: 'Welding Requirements',
      type: 'select',
      value: 'extensive',
      options: [
        { value: 'minimal', label: 'Minimal (Few weld points)' },
        { value: 'moderate', label: 'Moderate (Standard welding)' },
        { value: 'extensive', label: 'Extensive (Complex weld patterns)' },
        { value: 'precision', label: 'Precision (Robotic welding)' },
      ],
      required: true,
      description: 'Post-cutting welding requirements',
    },
    {
      id: 'productionScale',
      label: 'Production Scale',
      type: 'select',
      value: 'mass_production',
      options: [
        { value: 'prototype', label: 'Prototype (1-5 units)' },
        { value: 'pilot', label: 'Pilot Production (5-50 units)' },
        { value: 'low_volume', label: 'Low Volume (50-500 units)' },
        { value: 'mass_production', label: 'Mass Production (500+ units)' },
      ],
      required: true,
      description: 'Expected production volume scale',
    },
  ],

  outputs: [
    {
      id: 'structuralAnalysis',
      label: 'Structural Analysis',
      type: 'object',
      format: 'chassis-structural-specs',
      description: 'Structural performance and material analysis for chassis component',
    },
    {
      id: 'cuttingSpecification',
      label: 'Cutting Specification',
      type: 'object',
      format: 'chassis-cutting-params',
      description: 'Optimized cutting parameters for high-strength chassis materials',
    },
    {
      id: 'safetyCompliance',
      label: 'Safety & Compliance',
      type: 'object',
      format: 'chassis-safety-specs',
      description: 'Safety requirements and compliance specifications',
    },
    {
      id: 'manufacturingCost',
      label: 'Manufacturing Cost',
      type: 'object',
      format: 'chassis-cost-analysis',
      description: 'Comprehensive cost analysis for chassis component manufacturing',
    },
  ],

  calculate: (inputs: Record<string, any>) => {
    const {
      componentType,
      materialSpecification,
      plateThickness,
      componentLength,
      componentWidth,
      structuralComplexity,
      safetyRequirement,
      weldingRequirement,
      productionScale,
    } = inputs;

    // Analyze structural requirements
    const structuralAnalysis = analyzeStructuralRequirements(
      componentType,
      materialSpecification,
      plateThickness,
      safetyRequirement,
      structuralComplexity
    );

    // Calculate cutting specifications
    const cuttingSpecification = calculateCuttingSpecification(
      materialSpecification,
      plateThickness,
      structuralComplexity,
      componentType
    );

    // Define safety compliance
    const safetyCompliance = defineSafetyCompliance(
      safetyRequirement,
      componentType,
      materialSpecification,
      structuralComplexity
    );

    // Calculate manufacturing costs
    const manufacturingCost = calculateManufacturingCost(
      componentLength,
      componentWidth,
      plateThickness,
      materialSpecification,
      structuralComplexity,
      productionScale,
      weldingRequirement,
      cuttingSpecification
    );

    return {
      structuralAnalysis,
      cuttingSpecification,
      safetyCompliance,
      manufacturingCost,
    };
  },

  validation: {
    plateThickness: {
      min: 1.0,
      max: 8.0,
      message: 'Plate thickness must be between 1.0mm and 8.0mm for chassis components',
    },
    componentLength: {
      min: 200,
      max: 4000,
      message: 'Component length must be between 200mm and 4000mm',
    },
    componentWidth: {
      min: 50,
      max: 800,
      message: 'Component width must be between 50mm and 800mm',
    },
  },

  examples: [
    {
      name: 'Front Frame Rail',
      description: 'Primary structural frame rail for crash energy absorption',
      inputs: {
        componentType: 'frame_rail',
        materialSpecification: 'dp_980',
        plateThickness: 2.5,
        componentLength: 2000,
        componentWidth: 200,
        structuralComplexity: 'high',
        safetyRequirement: 'crash_critical',
        weldingRequirement: 'extensive',
        productionScale: 'mass_production',
      },
    },
    {
      name: 'Engine Cross Member',
      description: 'Cross member for engine mounting and structural support',
      inputs: {
        componentType: 'cross_member',
        materialSpecification: 'hsla_590',
        plateThickness: 3.0,
        componentLength: 800,
        componentWidth: 400,
        structuralComplexity: 'high',
        safetyRequirement: 'safety_relevant',
        weldingRequirement: 'precision',
        productionScale: 'mass_production',
      },
    },
  ],

  tags: ['automotive', 'chassis', 'structural', 'safety', 'high-strength-steel'],
  
  relatedCalculators: [
    'automotive-sheet-metal',
    'crash-simulation',
    'structural-analysis',
    'welding-cost',
  ],

  learningResources: [
    {
      title: 'Chassis Design Fundamentals',
      type: 'article',
      url: '/learn/chassis-design',
    },
    {
      title: 'High-Strength Steel Processing',
      type: 'video',
      url: '/learn/high-strength-steel',
    },
  ],
};

// Helper functions
function analyzeStructuralRequirements(
  componentType: string,
  materialSpec: string,
  thickness: number,
  safetyLevel: string,
  complexity: string
) {
  const materialProperties = getChassisMaterialProperties(materialSpec);
  const loadRequirements = getLoadRequirements(componentType, safetyLevel);
  const structuralPerformance = calculateStructuralPerformance(
    materialProperties,
    thickness,
    componentType
  );
  
  return {
    materialProperties,
    loadRequirements,
    structuralPerformance,
    designConsiderations: getDesignConsiderations(componentType, complexity),
    crashPerformance: analyzeCrashPerformance(materialSpec, thickness, componentType),
    fatigueResistance: calculateFatigueResistance(materialSpec, thickness, safetyLevel),
  };
}

function getChassisMaterialProperties(materialSpec: string) {
  const materials = {
    hsla_420: {
      tensileStrength: '420-520 MPa',
      yieldStrength: '420 MPa min',
      elongation: '18-25%',
      bendability: 'Good',
      weldability: 'Excellent',
      fatigueStrength: '180-220 MPa',
      applications: ['Non-critical chassis parts', 'Brackets'],
    },
    hsla_590: {
      tensileStrength: '590-700 MPa',
      yieldStrength: '590 MPa min',
      elongation: '16-22%',
      bendability: 'Good',
      weldability: 'Good',
      fatigueStrength: '250-300 MPa',
      applications: ['Frame rails', 'Cross members'],
    },
    dp_780: {
      tensileStrength: '780-950 MPa',
      yieldStrength: '450-600 MPa',
      elongation: '12-18%',
      bendability: 'Fair',
      weldability: 'Good',
      fatigueStrength: '320-380 MPa',
      applications: ['B-pillars', 'Door frames', 'Roof rails'],
    },
    dp_980: {
      tensileStrength: '980-1200 MPa',
      yieldStrength: '600-800 MPa',
      elongation: '10-16%',
      bendability: 'Fair',
      weldability: 'Good',
      fatigueStrength: '400-480 MPa',
      applications: ['A-pillars', 'Frame rails', 'Impact beams'],
    },
    cp_800: {
      tensileStrength: '800-1000 MPa',
      yieldStrength: '500-700 MPa',
      elongation: '12-18%',
      bendability: 'Good',
      weldability: 'Good',
      fatigueStrength: '350-420 MPa',
      applications: ['Complex formed parts', 'Structural components'],
    },
    mart_1200: {
      tensileStrength: '1200-1500 MPa',
      yieldStrength: '1000-1300 MPa',
      elongation: '4-8%',
      bendability: 'Poor',
      weldability: 'Challenging',
      fatigueStrength: '500-600 MPa',
      applications: ['Door intrusion beams', 'Bumper reinforcements'],
    },
    mart_1500: {
      tensileStrength: '1500-1800 MPa',
      yieldStrength: '1300-1600 MPa',
      elongation: '3-6%',
      bendability: 'Very Poor',
      weldability: 'Difficult',
      fatigueStrength: '600-720 MPa',
      applications: ['Ultra-high strength applications'],
    },
    boron_steel: {
      tensileStrength: '1500-2000 MPa',
      yieldStrength: '1400-1800 MPa',
      elongation: '2-5%',
      bendability: 'Very Poor',
      weldability: 'Very Difficult',
      fatigueStrength: '650-800 MPa',
      applications: ['Hot-formed parts', 'A-pillars', 'B-pillars'],
    },
  };
  
  return materials[materialSpec] || materials.hsla_590;
}

function getLoadRequirements(componentType: string, safetyLevel: string) {
  const baseLoads = {
    frame_rail: {
      tension: '50-150 kN',
      compression: '100-300 kN',
      bending: '20-80 kN⋅m',
      torsion: '10-40 kN⋅m',
    },
    cross_member: {
      tension: '30-100 kN',
      compression: '80-200 kN',
      bending: '15-60 kN⋅m',
      torsion: '5-25 kN⋅m',
    },
    subframe: {
      tension: '40-120 kN',
      compression: '60-180 kN',
      bending: '10-50 kN⋅m',
      torsion: '8-30 kN⋅m',
    },
    reinforcement: {
      tension: '20-80 kN',
      compression: '40-150 kN',
      bending: '5-30 kN⋅m',
      torsion: '3-15 kN⋅m',
    },
    mounting_bracket: {
      tension: '15-60 kN',
      compression: '30-120 kN',
      bending: '8-35 kN⋅m',
      torsion: '2-12 kN⋅m',
    },
    crash_box: {
      tension: '80-250 kN',
      compression: '150-500 kN',
      bending: '30-120 kN⋅m',
      torsion: '15-60 kN⋅m',
    },
  };
  
  const safetyMultipliers = {
    standard: 1.0,
    safety_relevant: 1.5,
    crash_critical: 2.0,
    ultra_critical: 2.5,
  };
  
  const loads = baseLoads[componentType] || baseLoads.frame_rail;
  const multiplier = safetyMultipliers[safetyLevel] || 1.5;
  
  return {
    designLoads: loads,
    safetyFactor: multiplier,
    ultimateLoads: Object.fromEntries(
      Object.entries(loads).map(([key, value]) => [
        key,
        value.replace(/(\d+)-(\d+)/, (match, min, max) => 
          `${Math.round(parseFloat(min) * multiplier)}-${Math.round(parseFloat(max) * multiplier)}`
        )
      ])
    ),
  };
}

function calculateStructuralPerformance(materialProps: any, thickness: number, componentType: string) {
  // Simplified structural calculations
  const area = thickness * 100; // Assume 100mm width for calculation
  const momentOfInertia = (100 * Math.pow(thickness, 3)) / 12; // mm⁴
  
  // Extract tensile strength range
  const tensileRange = materialProps.tensileStrength.match(/(\d+)-(\d+)/);
  const minTensile = tensileRange ? parseInt(tensileRange[1]) : 500;
  const maxTensile = tensileRange ? parseInt(tensileRange[2]) : 600;
  const avgTensile = (minTensile + maxTensile) / 2;
  
  return {
    crossSectionalArea: Math.round(area),
    momentOfInertia: Math.round(momentOfInertia),
    sectionModulus: Math.round(momentOfInertia / (thickness / 2)),
    maxTensileLoad: Math.round(area * avgTensile / 1000), // kN
    maxBendingMoment: Math.round(momentOfInertia * avgTensile / (thickness / 2) / 1000000), // kN⋅m
    bucklingResistance: calculateBucklingResistance(thickness, avgTensile),
    stiffness: calculateStiffness(momentOfInertia, componentType),
  };
}

function calculateBucklingResistance(thickness: number, tensileStrength: number) {
  // Simplified buckling calculation
  const slendernessRatio = 100 / thickness; // Simplified
  const bucklingStress = tensileStrength / (1 + Math.pow(slendernessRatio / 100, 2));
  
  return {
    criticalStress: Math.round(bucklingStress),
    slendernessRatio: Math.round(slendernessRatio),
    bucklingMode: slendernessRatio > 50 ? 'Euler buckling' : 'Local buckling',
  };
}

function calculateStiffness(momentOfInertia: number, componentType: string) {
  const elasticModulus = 210000; // MPa for steel
  const flexuralRigidity = elasticModulus * momentOfInertia;
  
  const typicalLengths = {
    frame_rail: 2000,
    cross_member: 800,
    subframe: 1200,
    reinforcement: 600,
    mounting_bracket: 300,
    crash_box: 400,
  };
  
  const length = typicalLengths[componentType] || 1000;
  const deflection = Math.pow(length, 3) / (48 * flexuralRigidity); // mm/N
  
  return {
    flexuralRigidity: Math.round(flexuralRigidity / 1000000), // N⋅m²
    deflectionCoefficient: deflection.toExponential(2),
    stiffnessRating: deflection < 1e-6 ? 'Very High' : deflection < 1e-5 ? 'High' : 'Moderate',
  };
}

function getDesignConsiderations(componentType: string, complexity: string) {
  const considerations = [];
  
  // Component-specific considerations
  if (componentType === 'frame_rail') {
    considerations.push('Crash energy absorption optimization');
    considerations.push('Progressive deformation control');
    considerations.push('Connection point reinforcement');
  } else if (componentType === 'cross_member') {
    considerations.push('Multi-directional load distribution');
    considerations.push('Mounting point precision');
    considerations.push('Torsional rigidity optimization');
  } else if (componentType === 'crash_box') {
    considerations.push('Controlled collapse behavior');
    considerations.push('Energy absorption efficiency');
    considerations.push('Trigger mechanism design');
  }
  
  // Complexity-specific considerations
  if (complexity === 'very_high' || complexity === 'extreme') {
    considerations.push('Tight tolerance manufacturing');
    considerations.push('Advanced forming requirements');
    considerations.push('Specialized tooling needs');
  }
  
  // General considerations
  considerations.push('Weld accessibility and quality');
  considerations.push('Corrosion protection requirements');
  considerations.push('Assembly sequence optimization');
  
  return considerations;
}

function analyzeCrashPerformance(materialSpec: string, thickness: number, componentType: string) {
  const energyAbsorption = calculateEnergyAbsorption(materialSpec, thickness, componentType);
  const deformationBehavior = getDeformationBehavior(materialSpec, componentType);
  
  return {
    energyAbsorption,
    deformationBehavior,
    crashworthiness: assessCrashworthiness(materialSpec, thickness, componentType),
    safetyMargin: calculateSafetyMargin(materialSpec, componentType),
  };
}

function calculateEnergyAbsorption(materialSpec: string, thickness: number, componentType: string) {
  // Simplified energy absorption calculation
  const materialFactors = {
    hsla_420: 0.8,
    hsla_590: 1.0,
    dp_780: 1.2,
    dp_980: 1.4,
    cp_800: 1.3,
    mart_1200: 1.6,
    mart_1500: 1.8,
    boron_steel: 2.0,
  };
  
  const componentFactors = {
    frame_rail: 1.5,
    cross_member: 1.0,
    subframe: 1.2,
    reinforcement: 0.8,
    mounting_bracket: 0.6,
    crash_box: 2.0,
  };
  
  const baseFactor = materialFactors[materialSpec] || 1.0;
  const compFactor = componentFactors[componentType] || 1.0;
  const thicknessFactor = Math.pow(thickness, 1.5);
  
  const energyCapacity = baseFactor * compFactor * thicknessFactor * 10; // kJ
  
  return {
    specificEnergyAbsorption: Math.round(energyCapacity),
    absorptionMode: getAbsorptionMode(materialSpec),
    efficiency: calculateAbsorptionEfficiency(materialSpec, componentType),
  };
}

function getAbsorptionMode(materialSpec: string) {
  if (['mart_1200', 'mart_1500', 'boron_steel'].includes(materialSpec)) {
    return 'Brittle fracture with high peak loads';
  } else if (['dp_780', 'dp_980'].includes(materialSpec)) {
    return 'Progressive plastic deformation';
  } else {
    return 'Ductile deformation with folding';
  }
}

function calculateAbsorptionEfficiency(materialSpec: string, componentType: string) {
  const baseEfficiency = {
    hsla_420: 65,
    hsla_590: 70,
    dp_780: 75,
    dp_980: 80,
    cp_800: 78,
    mart_1200: 85,
    mart_1500: 88,
    boron_steel: 90,
  };
  
  const componentBonus = {
    crash_box: 10,
    frame_rail: 5,
    cross_member: 0,
    subframe: 0,
    reinforcement: -5,
    mounting_bracket: -10,
  };
  
  const base = baseEfficiency[materialSpec] || 70;
  const bonus = componentBonus[componentType] || 0;
  
  return Math.min(95, base + bonus);
}

function getDeformationBehavior(materialSpec: string, componentType: string) {
  const behaviors = {
    hsla_420: {
      mode: 'Ductile bending and folding',
      predictability: 'High',
      controlability: 'Good',
    },
    hsla_590: {
      mode: 'Controlled plastic deformation',
      predictability: 'High',
      controlability: 'Good',
    },
    dp_780: {
      mode: 'Progressive crushing with strain hardening',
      predictability: 'Very High',
      controlability: 'Excellent',
    },
    dp_980: {
      mode: 'Stable progressive deformation',
      predictability: 'Very High',
      controlability: 'Excellent',
    },
    cp_800: {
      mode: 'Complex deformation with multiple phases',
      predictability: 'High',
      controlability: 'Good',
    },
    mart_1200: {
      mode: 'High-strength brittle fracture',
      predictability: 'Moderate',
      controlability: 'Fair',
    },
    mart_1500: {
      mode: 'Ultra-high strength fracture',
      predictability: 'Moderate',
      controlability: 'Fair',
    },
    boron_steel: {
      mode: 'Controlled high-energy fracture',
      predictability: 'Good',
      controlability: 'Good',
    },
  };
  
  return behaviors[materialSpec] || behaviors.hsla_590;
}

function assessCrashworthiness(materialSpec: string, thickness: number, componentType: string) {
  const strengthScore = getStrengthScore(materialSpec);
  const thicknessScore = Math.min(100, thickness * 25); // Max score at 4mm
  const componentScore = getComponentScore(componentType);
  
  const overallScore = (strengthScore * 0.4 + thicknessScore * 0.3 + componentScore * 0.3);
  
  return {
    overallRating: getPerformanceRating(overallScore),
    strengthContribution: Math.round(strengthScore),
    thicknessContribution: Math.round(thicknessScore),
    designContribution: Math.round(componentScore),
    recommendations: getCrashworthinessRecommendations(overallScore, materialSpec),
  };
}

function getStrengthScore(materialSpec: string) {
  const scores = {
    hsla_420: 40,
    hsla_590: 55,
    dp_780: 70,
    dp_980: 85,
    cp_800: 75,
    mart_1200: 95,
    mart_1500: 98,
    boron_steel: 100,
  };
  
  return scores[materialSpec] || 60;
}

function getComponentScore(componentType: string) {
  const scores = {
    crash_box: 100,
    frame_rail: 90,
    cross_member: 70,
    subframe: 60,
    reinforcement: 50,
    mounting_bracket: 30,
  };
  
  return scores[componentType] || 60;
}

function getPerformanceRating(score: number) {
  if (score >= 90) return 'Excellent';
  if (score >= 80) return 'Very Good';
  if (score >= 70) return 'Good';
  if (score >= 60) return 'Adequate';
  return 'Needs Improvement';
}

function getCrashworthinessRecommendations(score: number, materialSpec: string) {
  const recommendations = [];
  
  if (score < 70) {
    recommendations.push('Consider higher strength material grade');
    recommendations.push('Increase thickness for better energy absorption');
    recommendations.push('Add reinforcement features');
  }
  
  if (['mart_1200', 'mart_1500', 'boron_steel'].includes(materialSpec)) {
    recommendations.push('Design trigger mechanisms for controlled failure');
    recommendations.push('Consider hybrid design with ductile materials');
  }
  
  if (score >= 90) {
    recommendations.push('Excellent crashworthiness - optimize for weight');
    recommendations.push('Consider cost optimization opportunities');
  }
  
  return recommendations;
}

function calculateSafetyMargin(materialSpec: string, componentType: string) {
  const baseSafetyFactors = {
    standard: 1.5,
    safety_relevant: 2.0,
    crash_critical: 2.5,
    ultra_critical: 3.0,
  };
  
  const materialReliability = {
    hsla_420: 0.95,
    hsla_590: 0.96,
    dp_780: 0.97,
    dp_980: 0.98,
    cp_800: 0.97,
    mart_1200: 0.94,
    mart_1500: 0.93,
    boron_steel: 0.95,
  };
  
  const reliability = materialReliability[materialSpec] || 0.95;
  const recommendedFactor = baseSafetyFactors.crash_critical || 2.5;
  
  return {
    recommendedSafetyFactor: recommendedFactor,
    materialReliability: Math.round(reliability * 100),
    designMargin: Math.round((recommendedFactor - 1) * 100),
    confidenceLevel: reliability > 0.97 ? 'Very High' : reliability > 0.95 ? 'High' : 'Moderate',
  };
}

function calculateFatigueResistance(materialSpec: string, thickness: number, safetyLevel: string) {
  const fatigueStrengths = {
    hsla_420: 200,
    hsla_590: 275,
    dp_780: 350,
    dp_980: 440,
    cp_800: 385,
    mart_1200: 550,
    mart_1500: 660,
    boron_steel: 700,
  };
  
  const baseFatigueStrength = fatigueStrengths[materialSpec] || 300;
  const thicknessEffect = Math.pow(thickness / 2.0, -0.1); // Thickness effect on fatigue
  const adjustedFatigueStrength = baseFatigueStrength * thicknessEffect;
  
  const cycleLife = calculateCycleLife(adjustedFatigueStrength, safetyLevel);
  
  return {
    fatigueStrength: Math.round(adjustedFatigueStrength),
    expectedCycleLife: cycleLife,
    fatigueRating: getFatigueRating(adjustedFatigueStrength),
    criticalAreas: identifyCriticalFatigueAreas(),
  };
}

function calculateCycleLife(fatigueStrength: number, safetyLevel: string) {
  const stressLevels = {
    standard: 0.6,
    safety_relevant: 0.5,
    crash_critical: 0.4,
    ultra_critical: 0.3,
  };
  
  const stressRatio = stressLevels[safetyLevel] || 0.5;
  const appliedStress = fatigueStrength * stressRatio;
  
  // Simplified S-N curve calculation
  const logCycles = 6 + 3 * Math.log10(fatigueStrength / appliedStress);
  const cycles = Math.pow(10, logCycles);
  
  if (cycles > 1e6) return `${Math.round(cycles / 1e6)}M+ cycles`;
  if (cycles > 1e3) return `${Math.round(cycles / 1e3)}K cycles`;
  return `${Math.round(cycles)} cycles`;
}

function getFatigueRating(fatigueStrength: number) {
  if (fatigueStrength > 600) return 'Excellent';
  if (fatigueStrength > 450) return 'Very Good';
  if (fatigueStrength > 300) return 'Good';
  if (fatigueStrength > 200) return 'Adequate';
  return 'Poor';
}

function identifyCriticalFatigueAreas() {
  return [
    'Weld heat-affected zones',
    'Stress concentration points',
    'Connection interfaces',
    'Load transfer regions',
    'Geometric discontinuities',
  ];
}

export default chassisComponentConfig;
