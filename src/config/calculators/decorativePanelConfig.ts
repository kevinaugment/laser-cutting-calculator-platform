import { CalculatorConfig } from '../../types/calculator';

export const decorativePanelConfig: CalculatorConfig = {
  id: 'decorative-panel',
  name: 'Decorative Panel Calculator',
  description: 'Specialized calculator for decorative metal panels including perforated screens, artistic features, and ornamental elements with aesthetic and functional requirements.',
  category: 'construction',
  difficulty: 'intermediate',
  estimatedTime: '5-6 minutes',
  
  inputs: [
    {
      id: 'panelType',
      label: 'Panel Type',
      type: 'select',
      value: 'perforated_screen',
      options: [
        { value: 'perforated_screen', label: 'Perforated Screen/Privacy Panel' },
        { value: 'artistic_feature', label: 'Artistic Feature/Sculpture' },
        { value: 'logo_signage', label: 'Logo/Corporate Signage' },
        { value: 'geometric_pattern', label: 'Geometric Pattern Panel' },
        { value: 'nature_inspired', label: 'Nature-Inspired Design' },
        { value: 'abstract_art', label: 'Abstract Art Panel' },
        { value: 'functional_screen', label: 'Functional Screen (Ventilation/Light)' },
      ],
      required: true,
      description: 'Type of decorative panel',
    },
    {
      id: 'materialChoice',
      label: 'Material Choice',
      type: 'select',
      value: 'aluminum_5052',
      options: [
        { value: 'aluminum_5052', label: 'Aluminum 5052 (Marine Grade)' },
        { value: 'aluminum_6061', label: 'Aluminum 6061 (Structural)' },
        { value: 'stainless_304', label: 'Stainless Steel 304' },
        { value: 'stainless_316', label: 'Stainless Steel 316' },
        { value: 'weathering_steel', label: 'Weathering Steel (Corten)' },
        { value: 'brass', label: 'Brass (Decorative)' },
        { value: 'copper', label: 'Copper (Patina Effect)' },
        { value: 'titanium', label: 'Titanium (Premium)' },
      ],
      required: true,
      description: 'Material for decorative application',
    },
    {
      id: 'panelThickness',
      label: 'Panel Thickness',
      type: 'number',
      value: 2.0,
      unit: 'mm',
      min: 0.5,
      max: 8.0,
      step: 0.5,
      required: true,
      description: 'Thickness of decorative panel',
    },
    {
      id: 'panelDimensions',
      label: 'Panel Size',
      type: 'select',
      value: 'medium',
      options: [
        { value: 'small', label: 'Small (< 1m²)' },
        { value: 'medium', label: 'Medium (1-4m²)' },
        { value: 'large', label: 'Large (4-10m²)' },
        { value: 'extra_large', label: 'Extra Large (> 10m²)' },
      ],
      required: true,
      description: 'Overall size of decorative panel',
    },
    {
      id: 'patternComplexity',
      label: 'Pattern Complexity',
      type: 'select',
      value: 'moderate',
      options: [
        { value: 'simple', label: 'Simple (Basic shapes, large openings)' },
        { value: 'moderate', label: 'Moderate (Regular patterns, medium detail)' },
        { value: 'complex', label: 'Complex (Intricate patterns, fine detail)' },
        { value: 'ultra_complex', label: 'Ultra Complex (Micro details, artistic)' },
      ],
      required: true,
      description: 'Complexity of decorative pattern',
    },
    {
      id: 'openAreaPercentage',
      label: 'Open Area Percentage',
      type: 'number',
      value: 40,
      unit: '%',
      min: 0,
      max: 80,
      step: 5,
      required: true,
      description: 'Percentage of panel that is open/cut out',
    },
    {
      id: 'finishRequirement',
      label: 'Finish Requirement',
      type: 'select',
      value: 'powder_coated',
      options: [
        { value: 'mill_finish', label: 'Mill Finish (Natural)' },
        { value: 'brushed', label: 'Brushed Finish' },
        { value: 'polished', label: 'Polished Finish' },
        { value: 'anodized', label: 'Anodized (Aluminum only)' },
        { value: 'powder_coated', label: 'Powder Coated' },
        { value: 'painted', label: 'Wet Paint System' },
        { value: 'patina', label: 'Natural Patina (Copper/Brass)' },
        { value: 'weathered', label: 'Weathered Finish (Corten)' },
      ],
      required: true,
      description: 'Required surface finish',
    },
    {
      id: 'installationMethod',
      label: 'Installation Method',
      type: 'select',
      value: 'mechanical_fasteners',
      options: [
        { value: 'mechanical_fasteners', label: 'Mechanical Fasteners' },
        { value: 'structural_glazing', label: 'Structural Glazing' },
        { value: 'frame_system', label: 'Frame/Rail System' },
        { value: 'direct_weld', label: 'Direct Welding' },
        { value: 'tension_system', label: 'Tension Cable System' },
      ],
      required: true,
      description: 'Method of panel installation',
    },
    {
      id: 'environmentalConditions',
      label: 'Environmental Conditions',
      type: 'select',
      value: 'standard_exterior',
      options: [
        { value: 'interior_controlled', label: 'Interior Controlled Environment' },
        { value: 'interior_uncontrolled', label: 'Interior Uncontrolled' },
        { value: 'covered_exterior', label: 'Covered Exterior' },
        { value: 'standard_exterior', label: 'Standard Exterior' },
        { value: 'harsh_exterior', label: 'Harsh Exterior (Coastal/Industrial)' },
      ],
      required: true,
      description: 'Environmental exposure conditions',
    },
    {
      id: 'quantityRequired',
      label: 'Quantity Required',
      type: 'select',
      value: 'medium_batch',
      options: [
        { value: 'prototype', label: 'Prototype (1-5 panels)' },
        { value: 'small_batch', label: 'Small Batch (5-25 panels)' },
        { value: 'medium_batch', label: 'Medium Batch (25-100 panels)' },
        { value: 'large_batch', label: 'Large Batch (100+ panels)' },
      ],
      required: true,
      description: 'Number of panels required',
    },
  ],

  outputs: [
    {
      id: 'designAnalysis',
      label: 'Design Analysis',
      type: 'object',
      format: 'decorative-design-specs',
      description: 'Design feasibility and aesthetic performance analysis',
    },
    {
      id: 'cuttingParameters',
      label: 'Cutting Parameters',
      type: 'object',
      format: 'decorative-cutting-specs',
      description: 'Optimized cutting parameters for decorative patterns',
    },
    {
      id: 'finishingRequirements',
      label: 'Finishing Requirements',
      type: 'object',
      format: 'decorative-finishing-specs',
      description: 'Surface finishing and treatment requirements',
    },
    {
      id: 'projectEstimate',
      label: 'Project Estimate',
      type: 'object',
      format: 'decorative-project-cost',
      description: 'Comprehensive project cost estimate including all processes',
    },
  ],

  calculate: (inputs: Record<string, any>) => {
    const {
      panelType,
      materialChoice,
      panelThickness,
      panelDimensions,
      patternComplexity,
      openAreaPercentage,
      finishRequirement,
      installationMethod,
      environmentalConditions,
      quantityRequired,
    } = inputs;

    // Analyze design feasibility
    const designAnalysis = analyzeDecorativeDesign(
      panelType,
      patternComplexity,
      openAreaPercentage,
      materialChoice,
      panelThickness
    );

    // Calculate cutting parameters
    const cuttingParameters = calculateDecorativeCutting(
      materialChoice,
      panelThickness,
      patternComplexity,
      openAreaPercentage
    );

    // Define finishing requirements
    const finishingRequirements = defineDecorativeFinishing(
      finishRequirement,
      materialChoice,
      environmentalConditions,
      panelType
    );

    // Calculate project costs
    const projectEstimate = calculateDecorativeProjectCost(
      panelDimensions,
      panelThickness,
      materialChoice,
      patternComplexity,
      finishRequirement,
      quantityRequired,
      cuttingParameters
    );

    return {
      designAnalysis,
      cuttingParameters,
      finishingRequirements,
      projectEstimate,
    };
  },

  validation: {
    panelThickness: {
      min: 0.5,
      max: 8.0,
      message: 'Panel thickness must be between 0.5mm and 8.0mm for decorative applications',
    },
    openAreaPercentage: {
      min: 0,
      max: 80,
      message: 'Open area percentage must be between 0% and 80%',
    },
  },

  examples: [
    {
      name: 'Corporate Logo Screen',
      description: 'Stainless steel corporate logo screen for building entrance',
      inputs: {
        panelType: 'logo_signage',
        materialChoice: 'stainless_304',
        panelThickness: 3.0,
        panelDimensions: 'medium',
        patternComplexity: 'complex',
        openAreaPercentage: 30,
        finishRequirement: 'brushed',
        installationMethod: 'mechanical_fasteners',
        environmentalConditions: 'standard_exterior',
        quantityRequired: 'small_batch',
      },
    },
    {
      name: 'Artistic Perforated Screen',
      description: 'Aluminum artistic screen with nature-inspired pattern',
      inputs: {
        panelType: 'nature_inspired',
        materialChoice: 'aluminum_5052',
        panelThickness: 2.0,
        panelDimensions: 'large',
        patternComplexity: 'ultra_complex',
        openAreaPercentage: 60,
        finishRequirement: 'powder_coated',
        installationMethod: 'frame_system',
        environmentalConditions: 'standard_exterior',
        quantityRequired: 'medium_batch',
      },
    },
  ],

  tags: ['decorative', 'perforated', 'artistic', 'pattern', 'screen'],
  
  relatedCalculators: [
    'perforated-metal',
    'artistic-cutting',
    'surface-finishing',
    'pattern-optimization',
  ],

  learningResources: [
    {
      title: 'Decorative Metal Design Guide',
      type: 'article',
      url: '/learn/decorative-metal-design',
    },
    {
      title: 'Pattern Cutting Techniques',
      type: 'video',
      url: '/learn/pattern-cutting',
    },
  ],
};

// Helper functions
function analyzeDecorativeDesign(
  panelType: string,
  complexity: string,
  openArea: number,
  material: string,
  thickness: number
) {
  const designFeasibility = assessDesignFeasibility(complexity, openArea, thickness);
  const structuralIntegrity = assessStructuralIntegrity(openArea, thickness, material);
  const aestheticConsiderations = getAestheticConsiderations(panelType, complexity);
  
  return {
    designFeasibility,
    structuralIntegrity,
    aestheticConsiderations,
    materialSuitability: getMaterialSuitability(material, panelType),
    patternOptimization: getPatternOptimization(complexity, openArea),
    visualImpact: assessVisualImpact(panelType, complexity, openArea),
  };
}

function assessDesignFeasibility(complexity: string, openArea: number, thickness: number) {
  const complexityScores = {
    simple: 100,
    moderate: 85,
    complex: 70,
    ultra_complex: 50,
  };
  
  let feasibilityScore = complexityScores[complexity] || 70;
  
  // Adjust for open area
  if (openArea > 70) feasibilityScore -= 15;
  else if (openArea > 50) feasibilityScore -= 10;
  else if (openArea < 10) feasibilityScore -= 5;
  
  // Adjust for thickness
  if (thickness < 1.0 && complexity === 'ultra_complex') feasibilityScore -= 20;
  else if (thickness < 1.5 && complexity === 'complex') feasibilityScore -= 10;
  
  return {
    score: Math.max(0, feasibilityScore),
    rating: getFeasibilityRating(feasibilityScore),
    challenges: getDesignChallenges(complexity, openArea, thickness),
    recommendations: getDesignRecommendations(feasibilityScore, complexity),
  };
}

function getFeasibilityRating(score: number) {
  if (score >= 90) return 'Excellent - Highly feasible';
  if (score >= 75) return 'Good - Feasible with standard processes';
  if (score >= 60) return 'Moderate - Requires careful planning';
  if (score >= 40) return 'Challenging - Specialized techniques needed';
  return 'Very Difficult - Consider design simplification';
}

function getDesignChallenges(complexity: string, openArea: number, thickness: number) {
  const challenges = [];
  
  if (complexity === 'ultra_complex') {
    challenges.push('Very fine details require precision cutting');
    challenges.push('High risk of heat distortion');
    challenges.push('Potential for micro-bridging in thin sections');
  }
  
  if (openArea > 60) {
    challenges.push('High open area may compromise structural integrity');
    challenges.push('Requires careful support during cutting');
  }
  
  if (thickness < 1.0) {
    challenges.push('Thin material prone to warping');
    challenges.push('Requires specialized handling and fixturing');
  }
  
  return challenges;
}

function getDesignRecommendations(score: number, complexity: string) {
  const recommendations = [];
  
  if (score < 60) {
    recommendations.push('Consider simplifying the pattern design');
    recommendations.push('Increase material thickness if possible');
    recommendations.push('Use pilot holes for complex internal features');
  }
  
  if (complexity === 'ultra_complex') {
    recommendations.push('Use high-precision laser cutting');
    recommendations.push('Consider multiple cutting passes for quality');
    recommendations.push('Plan for extensive post-processing');
  }
  
  recommendations.push('Optimize cutting sequence to minimize distortion');
  recommendations.push('Consider grain direction for best results');
  
  return recommendations;
}

function assessStructuralIntegrity(openArea: number, thickness: number, material: string) {
  const materialStrengths = {
    aluminum_5052: 228,
    aluminum_6061: 310,
    stainless_304: 515,
    stainless_316: 580,
    weathering_steel: 485,
    brass: 300,
    copper: 220,
    titanium: 900,
  };
  
  const materialStrength = materialStrengths[material] || 300; // MPa
  const solidArea = 100 - openArea; // Percentage of solid material
  const effectiveStrength = (materialStrength * solidArea * thickness) / 100;
  
  return {
    effectiveStrength: Math.round(effectiveStrength),
    structuralRating: getStructuralRating(effectiveStrength),
    supportRequirements: getSupportRequirements(openArea, thickness),
    deflectionRisk: getDeflectionRisk(openArea, thickness),
    reinforcementOptions: getReinforcementOptions(openArea, effectiveStrength),
  };
}

function getStructuralRating(effectiveStrength: number) {
  if (effectiveStrength > 800) return 'Excellent - High structural capacity';
  if (effectiveStrength > 400) return 'Good - Adequate for most applications';
  if (effectiveStrength > 200) return 'Moderate - Suitable for light loads';
  if (effectiveStrength > 100) return 'Low - Decorative use only';
  return 'Very Low - Requires structural support';
}

function getSupportRequirements(openArea: number, thickness: number) {
  const requirements = [];
  
  if (openArea > 60 || thickness < 1.5) {
    requirements.push('Frame support recommended');
    requirements.push('Maximum unsupported span: 1.5m');
  } else if (openArea > 40 || thickness < 2.0) {
    requirements.push('Intermediate supports may be needed');
    requirements.push('Maximum unsupported span: 2.5m');
  } else {
    requirements.push('Self-supporting for typical applications');
    requirements.push('Maximum unsupported span: 3.5m');
  }
  
  return requirements;
}

function getDeflectionRisk(openArea: number, thickness: number) {
  let risk = 'Low';
  
  if (openArea > 70 && thickness < 2.0) risk = 'Very High';
  else if (openArea > 50 && thickness < 2.5) risk = 'High';
  else if (openArea > 30 && thickness < 2.0) risk = 'Moderate';
  
  return {
    level: risk,
    mitigation: getDeflectionMitigation(risk),
  };
}

function getDeflectionMitigation(risk: string) {
  const mitigations = {
    'Very High': ['Increase thickness', 'Add structural backing', 'Reduce panel size'],
    'High': ['Consider thicker material', 'Add edge stiffening', 'Provide intermediate support'],
    'Moderate': ['Monitor deflection in large panels', 'Consider edge reinforcement'],
    'Low': ['Standard installation practices adequate'],
  };
  
  return mitigations[risk] || mitigations['Low'];
}

function getReinforcementOptions(openArea: number, effectiveStrength: number) {
  const options = [];
  
  if (effectiveStrength < 200) {
    options.push('Structural backing frame');
    options.push('Edge reinforcement channels');
    options.push('Intermediate support ribs');
  } else if (effectiveStrength < 400) {
    options.push('Perimeter frame system');
    options.push('Strategic reinforcement at stress points');
  } else {
    options.push('Minimal reinforcement required');
  }
  
  return options;
}

function getAestheticConsiderations(panelType: string, complexity: string) {
  const considerations = {
    perforated_screen: {
      primary: 'Light and shadow play',
      secondary: 'Privacy vs. visibility balance',
      lighting: 'Backlighting enhances pattern',
    },
    artistic_feature: {
      primary: 'Visual impact and focal point',
      secondary: 'Integration with architecture',
      lighting: 'Accent lighting recommended',
    },
    logo_signage: {
      primary: 'Brand recognition and clarity',
      secondary: 'Visibility from target distances',
      lighting: 'Illumination for night visibility',
    },
    geometric_pattern: {
      primary: 'Pattern rhythm and scale',
      secondary: 'Moiré effect prevention',
      lighting: 'Even illumination important',
    },
    nature_inspired: {
      primary: 'Organic flow and natural feel',
      secondary: 'Seasonal lighting changes',
      lighting: 'Dynamic lighting possibilities',
    },
    abstract_art: {
      primary: 'Artistic expression and interpretation',
      secondary: 'Viewer perspective changes',
      lighting: 'Creative lighting opportunities',
    },
    functional_screen: {
      primary: 'Function vs. aesthetics balance',
      secondary: 'Maintenance accessibility',
      lighting: 'Functional lighting integration',
    },
  };
  
  return considerations[panelType] || considerations.perforated_screen;
}

function getMaterialSuitability(material: string, panelType: string) {
  const suitability = {
    aluminum_5052: {
      rating: 'Excellent',
      advantages: ['Corrosion resistant', 'Good formability', 'Cost effective'],
      limitations: ['Lower strength than 6061'],
      bestFor: ['Marine environments', 'General decorative use'],
    },
    aluminum_6061: {
      rating: 'Very Good',
      advantages: ['High strength', 'Excellent machinability', 'Structural capability'],
      limitations: ['Higher cost than 5052'],
      bestFor: ['Structural decorative elements', 'Large panels'],
    },
    stainless_304: {
      rating: 'Excellent',
      advantages: ['Superior finish quality', 'Excellent corrosion resistance', 'Premium appearance'],
      limitations: ['Higher cost', 'More difficult to cut'],
      bestFor: ['High-end applications', 'Architectural features'],
    },
    stainless_316: {
      rating: 'Outstanding',
      advantages: ['Maximum corrosion resistance', 'Marine grade', 'Premium quality'],
      limitations: ['Highest cost', 'Specialized cutting required'],
      bestFor: ['Marine environments', 'Chemical exposure'],
    },
    weathering_steel: {
      rating: 'Good',
      advantages: ['Unique patina finish', 'Self-protecting', 'Artistic appeal'],
      limitations: ['Staining potential', 'Patina development time'],
      bestFor: ['Artistic installations', 'Industrial aesthetics'],
    },
    brass: {
      rating: 'Good',
      advantages: ['Beautiful natural finish', 'Antimicrobial properties', 'Traditional appeal'],
      limitations: ['Requires maintenance', 'Tarnishing', 'Higher cost'],
      bestFor: ['Interior applications', 'Traditional designs'],
    },
    copper: {
      rating: 'Good',
      advantages: ['Natural patina development', 'Antimicrobial', 'Unique appearance'],
      limitations: ['Expensive', 'Patina staining', 'Soft material'],
      bestFor: ['Artistic features', 'Historic restoration'],
    },
    titanium: {
      rating: 'Outstanding',
      advantages: ['Maximum strength', 'Corrosion proof', 'Lightweight'],
      limitations: ['Very expensive', 'Specialized processing'],
      bestFor: ['Premium applications', 'Extreme environments'],
    },
  };
  
  return suitability[material] || suitability.aluminum_5052;
}

function getPatternOptimization(complexity: string, openArea: number) {
  const optimizations = [];
  
  if (complexity === 'ultra_complex') {
    optimizations.push('Minimize sharp internal corners');
    optimizations.push('Ensure minimum feature size > 0.5mm');
    optimizations.push('Avoid thin connecting bridges');
  }
  
  if (openArea > 60) {
    optimizations.push('Maintain adequate structural connections');
    optimizations.push('Consider pattern flow for structural integrity');
  }
  
  optimizations.push('Optimize cutting path for efficiency');
  optimizations.push('Consider nesting for material utilization');
  optimizations.push('Plan for consistent edge quality');
  
  return optimizations;
}

function assessVisualImpact(panelType: string, complexity: string, openArea: number) {
  let impactScore = 50; // Base score
  
  // Complexity contribution
  const complexityScores = {
    simple: 20,
    moderate: 40,
    complex: 70,
    ultra_complex: 90,
  };
  impactScore += complexityScores[complexity] || 40;
  
  // Open area contribution
  if (openArea > 50) impactScore += 20;
  else if (openArea > 30) impactScore += 10;
  else if (openArea < 10) impactScore -= 10;
  
  // Panel type contribution
  const typeMultipliers = {
    artistic_feature: 1.3,
    logo_signage: 1.2,
    abstract_art: 1.3,
    nature_inspired: 1.1,
    geometric_pattern: 1.0,
    perforated_screen: 0.9,
    functional_screen: 0.8,
  };
  
  impactScore *= typeMultipliers[panelType] || 1.0;
  impactScore = Math.min(100, Math.round(impactScore));
  
  return {
    score: impactScore,
    rating: getVisualRating(impactScore),
    enhancementSuggestions: getVisualEnhancements(panelType, impactScore),
  };
}

function getVisualRating(score: number) {
  if (score >= 90) return 'Outstanding - Dramatic visual impact';
  if (score >= 75) return 'Excellent - Strong visual presence';
  if (score >= 60) return 'Good - Notable visual interest';
  if (score >= 45) return 'Moderate - Subtle visual effect';
  return 'Low - Minimal visual impact';
}

function getVisualEnhancements(panelType: string, score: number) {
  const enhancements = [];
  
  if (score < 60) {
    enhancements.push('Consider increasing pattern complexity');
    enhancements.push('Add backlighting for enhanced effect');
    enhancements.push('Use contrasting background materials');
  }
  
  if (panelType === 'logo_signage') {
    enhancements.push('Optimize viewing distance and angle');
    enhancements.push('Consider illumination for night visibility');
  }
  
  if (panelType === 'artistic_feature') {
    enhancements.push('Plan for multiple viewing perspectives');
    enhancements.push('Consider seasonal lighting changes');
  }
  
  enhancements.push('Coordinate with surrounding architectural elements');
  enhancements.push('Consider maintenance access for cleaning');
  
  return enhancements;
}

export default decorativePanelConfig;
