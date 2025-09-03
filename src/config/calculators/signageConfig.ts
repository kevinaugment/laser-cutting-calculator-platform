import { CalculatorConfig } from '../../types/calculator';

export const signageConfig: CalculatorConfig = {
  id: 'signage',
  name: 'Signage Calculator',
  description: 'Specialized calculator for metal signage including dimensional letters, logos, wayfinding signs, and architectural signage with visibility and mounting requirements.',
  category: 'construction',
  difficulty: 'intermediate',
  estimatedTime: '5-6 minutes',
  
  inputs: [
    {
      id: 'signageType',
      label: 'Signage Type',
      type: 'select',
      value: 'dimensional_letters',
      options: [
        { value: 'dimensional_letters', label: 'Dimensional Letters' },
        { value: 'logo_sign', label: 'Logo/Brand Sign' },
        { value: 'wayfinding_sign', label: 'Wayfinding/Directory Sign' },
        { value: 'building_identification', label: 'Building Identification' },
        { value: 'safety_signage', label: 'Safety/Emergency Signage' },
        { value: 'decorative_sign', label: 'Decorative/Artistic Sign' },
        { value: 'monument_sign', label: 'Monument/Entrance Sign' },
        { value: 'channel_letters', label: 'Channel Letters (Illuminated)' },
      ],
      required: true,
      description: 'Type of signage application',
    },
    {
      id: 'materialType',
      label: 'Material Type',
      type: 'select',
      value: 'aluminum_6061',
      options: [
        { value: 'aluminum_6061', label: 'Aluminum 6061 (Structural)' },
        { value: 'aluminum_5052', label: 'Aluminum 5052 (Formable)' },
        { value: 'aluminum_3003', label: 'Aluminum 3003 (General)' },
        { value: 'stainless_304', label: 'Stainless Steel 304' },
        { value: 'stainless_316', label: 'Stainless Steel 316' },
        { value: 'brass', label: 'Brass (Premium)' },
        { value: 'copper', label: 'Copper (Artistic)' },
        { value: 'weathering_steel', label: 'Weathering Steel (Corten)' },
        { value: 'acrylic_backed', label: 'Acrylic-Backed Metal' },
      ],
      required: true,
      description: 'Material for signage fabrication',
    },
    {
      id: 'materialThickness',
      label: 'Material Thickness',
      type: 'number',
      value: 3.0,
      unit: 'mm',
      min: 0.5,
      max: 12.0,
      step: 0.5,
      required: true,
      description: 'Thickness of signage material',
    },
    {
      id: 'signDimensions',
      label: 'Sign Size Category',
      type: 'select',
      value: 'medium',
      options: [
        { value: 'small', label: 'Small (< 0.5m²)' },
        { value: 'medium', label: 'Medium (0.5-2m²)' },
        { value: 'large', label: 'Large (2-5m²)' },
        { value: 'extra_large', label: 'Extra Large (> 5m²)' },
      ],
      required: true,
      description: 'Overall size category of signage',
    },
    {
      id: 'letterHeight',
      label: 'Letter/Element Height',
      type: 'number',
      value: 200,
      unit: 'mm',
      min: 25,
      max: 2000,
      step: 25,
      required: true,
      description: 'Height of letters or main design elements',
    },
    {
      id: 'designComplexity',
      label: 'Design Complexity',
      type: 'select',
      value: 'moderate',
      options: [
        { value: 'simple', label: 'Simple (Basic fonts, minimal detail)' },
        { value: 'moderate', label: 'Moderate (Standard fonts, some detail)' },
        { value: 'complex', label: 'Complex (Custom fonts, intricate detail)' },
        { value: 'artistic', label: 'Artistic (Custom artwork, fine detail)' },
      ],
      required: true,
      description: 'Complexity of sign design and cutting',
    },
    {
      id: 'finishType',
      label: 'Finish Type',
      type: 'select',
      value: 'brushed',
      options: [
        { value: 'mill_finish', label: 'Mill Finish (Natural)' },
        { value: 'brushed', label: 'Brushed Finish' },
        { value: 'polished', label: 'Polished Finish' },
        { value: 'anodized', label: 'Anodized (Aluminum only)' },
        { value: 'powder_coated', label: 'Powder Coated' },
        { value: 'painted', label: 'Painted Finish' },
        { value: 'patina', label: 'Natural Patina' },
        { value: 'vinyl_applied', label: 'Vinyl Graphics Applied' },
      ],
      required: true,
      description: 'Surface finish for signage',
    },
    {
      id: 'mountingMethod',
      label: 'Mounting Method',
      type: 'select',
      value: 'standoff_mounting',
      options: [
        { value: 'standoff_mounting', label: 'Standoff/Spacer Mounting' },
        { value: 'flush_mounting', label: 'Flush Wall Mounting' },
        { value: 'post_mounting', label: 'Post/Pole Mounting' },
        { value: 'hanging_mounting', label: 'Hanging/Suspended' },
        { value: 'frame_mounting', label: 'Frame/Panel System' },
        { value: 'direct_attachment', label: 'Direct Attachment' },
        { value: 'monument_base', label: 'Monument Base' },
      ],
      required: true,
      description: 'Method of sign installation',
    },
    {
      id: 'viewingDistance',
      label: 'Primary Viewing Distance',
      type: 'select',
      value: 'medium_range',
      options: [
        { value: 'close_up', label: 'Close-up (< 3m)' },
        { value: 'medium_range', label: 'Medium Range (3-10m)' },
        { value: 'long_range', label: 'Long Range (10-30m)' },
        { value: 'highway_distance', label: 'Highway Distance (> 30m)' },
      ],
      required: true,
      description: 'Primary distance from which sign will be viewed',
    },
    {
      id: 'environmentalExposure',
      label: 'Environmental Exposure',
      type: 'select',
      value: 'standard_outdoor',
      options: [
        { value: 'interior_controlled', label: 'Interior Controlled' },
        { value: 'interior_uncontrolled', label: 'Interior Uncontrolled' },
        { value: 'covered_outdoor', label: 'Covered Outdoor' },
        { value: 'standard_outdoor', label: 'Standard Outdoor' },
        { value: 'harsh_outdoor', label: 'Harsh Outdoor (Coastal/Industrial)' },
        { value: 'extreme_conditions', label: 'Extreme Conditions' },
      ],
      required: true,
      description: 'Environmental conditions sign will face',
    },
    {
      id: 'illuminationRequirement',
      label: 'Illumination Requirement',
      type: 'select',
      value: 'external_lighting',
      options: [
        { value: 'none', label: 'No Illumination' },
        { value: 'external_lighting', label: 'External Lighting' },
        { value: 'backlit', label: 'Backlit/Halo Lighting' },
        { value: 'edge_lit', label: 'Edge Lit' },
        { value: 'face_lit', label: 'Face Lit (Channel Letters)' },
        { value: 'combination', label: 'Combination Lighting' },
      ],
      required: true,
      description: 'Lighting requirements for visibility',
    },
    {
      id: 'productionQuantity',
      label: 'Production Quantity',
      type: 'select',
      value: 'small_batch',
      options: [
        { value: 'one_off', label: 'One-off Custom (1 unit)' },
        { value: 'small_batch', label: 'Small Batch (2-10 units)' },
        { value: 'medium_batch', label: 'Medium Batch (10-50 units)' },
        { value: 'large_batch', label: 'Large Batch (50+ units)' },
      ],
      required: true,
      description: 'Number of signs to be produced',
    },
  ],

  outputs: [
    {
      id: 'visibilityAnalysis',
      label: 'Visibility Analysis',
      type: 'object',
      format: 'signage-visibility-specs',
      description: 'Visibility and legibility analysis for signage design',
    },
    {
      id: 'fabricationSpecs',
      label: 'Fabrication Specifications',
      type: 'object',
      format: 'signage-fabrication-specs',
      description: 'Detailed fabrication and cutting specifications',
    },
    {
      id: 'installationRequirements',
      label: 'Installation Requirements',
      type: 'object',
      format: 'signage-installation-specs',
      description: 'Mounting and installation specifications',
    },
    {
      id: 'projectCost',
      label: 'Project Cost',
      type: 'object',
      format: 'signage-cost-analysis',
      description: 'Comprehensive cost analysis for signage project',
    },
  ],

  calculate: (inputs: Record<string, any>) => {
    const {
      signageType,
      materialType,
      materialThickness,
      signDimensions,
      letterHeight,
      designComplexity,
      finishType,
      mountingMethod,
      viewingDistance,
      environmentalExposure,
      illuminationRequirement,
      productionQuantity,
    } = inputs;

    // Analyze visibility requirements
    const visibilityAnalysis = analyzeSignageVisibility(
      letterHeight,
      viewingDistance,
      signageType,
      illuminationRequirement,
      environmentalExposure
    );

    // Calculate fabrication specifications
    const fabricationSpecs = calculateSignageFabrication(
      materialType,
      materialThickness,
      designComplexity,
      signageType,
      letterHeight
    );

    // Define installation requirements
    const installationRequirements = defineSignageInstallation(
      mountingMethod,
      signDimensions,
      materialType,
      environmentalExposure,
      signageType
    );

    // Calculate project costs
    const projectCost = calculateSignageProjectCost(
      signDimensions,
      materialType,
      materialThickness,
      designComplexity,
      finishType,
      productionQuantity,
      fabricationSpecs
    );

    return {
      visibilityAnalysis,
      fabricationSpecs,
      installationRequirements,
      projectCost,
    };
  },

  validation: {
    materialThickness: {
      min: 0.5,
      max: 12.0,
      message: 'Material thickness must be between 0.5mm and 12.0mm for signage applications',
    },
    letterHeight: {
      min: 25,
      max: 2000,
      message: 'Letter height must be between 25mm and 2000mm',
    },
  },

  examples: [
    {
      name: 'Corporate Building Sign',
      description: 'Brushed aluminum dimensional letters for corporate headquarters',
      inputs: {
        signageType: 'dimensional_letters',
        materialType: 'aluminum_6061',
        materialThickness: 6.0,
        signDimensions: 'large',
        letterHeight: 300,
        designComplexity: 'moderate',
        finishType: 'brushed',
        mountingMethod: 'standoff_mounting',
        viewingDistance: 'medium_range',
        environmentalExposure: 'standard_outdoor',
        illuminationRequirement: 'external_lighting',
        productionQuantity: 'one_off',
      },
    },
    {
      name: 'Wayfinding System',
      description: 'Powder-coated aluminum wayfinding signs for campus',
      inputs: {
        signageType: 'wayfinding_sign',
        materialType: 'aluminum_5052',
        materialThickness: 3.0,
        signDimensions: 'medium',
        letterHeight: 100,
        designComplexity: 'simple',
        finishType: 'powder_coated',
        mountingMethod: 'post_mounting',
        viewingDistance: 'close_up',
        environmentalExposure: 'standard_outdoor',
        illuminationRequirement: 'none',
        productionQuantity: 'large_batch',
      },
    },
  ],

  tags: ['signage', 'dimensional-letters', 'wayfinding', 'branding', 'visibility'],
  
  relatedCalculators: [
    'visibility-analysis',
    'mounting-systems',
    'surface-finishing',
    'illumination-design',
  ],

  learningResources: [
    {
      title: 'Signage Design and Visibility',
      type: 'article',
      url: '/learn/signage-design-visibility',
    },
    {
      title: 'Metal Signage Fabrication',
      type: 'video',
      url: '/learn/metal-signage-fabrication',
    },
  ],
};

// Helper functions
function analyzeSignageVisibility(
  letterHeight: number,
  viewingDistance: string,
  signageType: string,
  illumination: string,
  environment: string
) {
  const visibilityRequirements = getVisibilityRequirements(viewingDistance, signageType);
  const legibilityAnalysis = analyzeLegibility(letterHeight, viewingDistance, illumination);
  const contrastRequirements = getContrastRequirements(environment, illumination);
  
  return {
    visibilityRequirements,
    legibilityAnalysis,
    contrastRequirements,
    readabilityDistance: calculateReadabilityDistance(letterHeight, signageType),
    lightingRecommendations: getLightingRecommendations(illumination, environment, viewingDistance),
    visibilityRating: assessVisibilityRating(legibilityAnalysis, contrastRequirements),
  };
}

function getVisibilityRequirements(viewingDistance: string, signageType: string) {
  const requirements = {
    close_up: {
      minLetterHeight: 25, // mm
      maxViewingAngle: 60, // degrees
      minContrast: 70, // percentage
      readingTime: 'Extended reading possible',
    },
    medium_range: {
      minLetterHeight: 100, // mm
      maxViewingAngle: 45, // degrees
      minContrast: 80, // percentage
      readingTime: 'Quick recognition required',
    },
    long_range: {
      minLetterHeight: 200, // mm
      maxViewingAngle: 30, // degrees
      minContrast: 90, // percentage
      readingTime: 'Instant recognition required',
    },
    highway_distance: {
      minLetterHeight: 500, // mm
      maxViewingAngle: 15, // degrees
      minContrast: 95, // percentage
      readingTime: 'Split-second recognition',
    },
  };
  
  return requirements[viewingDistance] || requirements.medium_range;
}

function analyzeLegibility(letterHeight: number, viewingDistance: string, illumination: string) {
  const distanceFactors = {
    close_up: 3, // 3m average
    medium_range: 6, // 6m average
    long_range: 20, // 20m average
    highway_distance: 50, // 50m average
  };
  
  const avgDistance = distanceFactors[viewingDistance] || 6;
  const letterToDistanceRatio = letterHeight / (avgDistance * 1000); // mm to mm
  
  // Rule of thumb: 1mm letter height per 1m viewing distance minimum
  const adequacyRatio = letterHeight / avgDistance;
  
  let legibilityRating = 'Good';
  if (adequacyRatio < 0.5) legibilityRating = 'Poor';
  else if (adequacyRatio < 1.0) legibilityRating = 'Fair';
  else if (adequacyRatio > 2.0) legibilityRating = 'Excellent';
  
  return {
    letterHeight,
    viewingDistance: avgDistance,
    adequacyRatio: Math.round(adequacyRatio * 100) / 100,
    legibilityRating,
    recommendations: getLegibilityRecommendations(adequacyRatio, illumination),
  };
}

function getLegibilityRecommendations(ratio: number, illumination: string) {
  const recommendations = [];
  
  if (ratio < 1.0) {
    recommendations.push('Increase letter height for better visibility');
    recommendations.push('Consider bolder font weights');
    recommendations.push('Enhance contrast with background');
  }
  
  if (illumination === 'none' && ratio < 1.5) {
    recommendations.push('Consider adding illumination for better visibility');
  }
  
  if (ratio > 3.0) {
    recommendations.push('Letter size may be larger than necessary');
    recommendations.push('Consider cost optimization opportunities');
  }
  
  return recommendations;
}

function getContrastRequirements(environment: string, illumination: string) {
  const baseContrast = {
    interior_controlled: 70,
    interior_uncontrolled: 75,
    covered_outdoor: 80,
    standard_outdoor: 85,
    harsh_outdoor: 90,
    extreme_conditions: 95,
  };
  
  let requiredContrast = baseContrast[environment] || 80;
  
  // Adjust for illumination
  if (illumination === 'none') requiredContrast += 5;
  else if (['backlit', 'face_lit'].includes(illumination)) requiredContrast -= 10;
  
  return {
    requiredContrast: Math.min(95, Math.max(70, requiredContrast)),
    colorRecommendations: getColorRecommendations(environment, illumination),
    finishRecommendations: getFinishRecommendations(environment),
  };
}

function getColorRecommendations(environment: string, illumination: string) {
  const recommendations = [];
  
  if (['harsh_outdoor', 'extreme_conditions'].includes(environment)) {
    recommendations.push('Use high-contrast color combinations');
    recommendations.push('Avoid colors that fade in UV exposure');
    recommendations.push('Consider reflective or fluorescent colors');
  }
  
  if (illumination === 'backlit') {
    recommendations.push('Light colors work well with backlighting');
    recommendations.push('Avoid very dark colors that block light');
  }
  
  if (illumination === 'face_lit') {
    recommendations.push('Dark backgrounds enhance illuminated faces');
    recommendations.push('Consider color temperature of lighting');
  }
  
  return recommendations;
}

function getFinishRecommendations(environment: string) {
  const recommendations = {
    interior_controlled: ['Any finish suitable', 'Focus on aesthetics'],
    interior_uncontrolled: ['Durable finishes recommended', 'Consider maintenance access'],
    covered_outdoor: ['Weather-resistant finishes', 'UV protection important'],
    standard_outdoor: ['High-durability finishes required', 'Regular maintenance planned'],
    harsh_outdoor: ['Marine-grade finishes', 'Frequent inspection needed'],
    extreme_conditions: ['Specialized coatings required', 'Professional maintenance essential'],
  };
  
  return recommendations[environment] || recommendations.standard_outdoor;
}

function calculateReadabilityDistance(letterHeight: number, signageType: string) {
  // Basic readability formula: 1mm letter height = 1m reading distance
  const baseDistance = letterHeight; // mm = m
  
  // Adjust for sign type
  const typeFactors = {
    dimensional_letters: 1.0,
    logo_sign: 0.8, // Logos often more recognizable
    wayfinding_sign: 1.2, // Need clear reading
    building_identification: 0.9,
    safety_signage: 1.5, // Must be very clear
    decorative_sign: 0.7, // Aesthetics over distance
    monument_sign: 0.8,
    channel_letters: 0.9, // Illumination helps
  };
  
  const factor = typeFactors[signageType] || 1.0;
  const effectiveDistance = baseDistance * factor;
  
  return {
    calculatedDistance: Math.round(effectiveDistance),
    optimumDistance: Math.round(effectiveDistance * 0.7),
    maximumDistance: Math.round(effectiveDistance * 1.3),
    recommendation: getDistanceRecommendation(effectiveDistance, signageType),
  };
}

function getDistanceRecommendation(distance: number, signageType: string) {
  if (distance < 50) {
    return 'Suitable for close-up viewing and detailed reading';
  } else if (distance < 200) {
    return 'Good for medium-range identification and wayfinding';
  } else if (distance < 500) {
    return 'Effective for long-range visibility and building identification';
  } else {
    return 'Suitable for highway and long-distance visibility';
  }
}

function getLightingRecommendations(illumination: string, environment: string, viewingDistance: string) {
  const recommendations = [];
  
  if (illumination === 'none') {
    recommendations.push('Ensure adequate ambient lighting');
    recommendations.push('Consider reflective materials for low-light visibility');
    
    if (['long_range', 'highway_distance'].includes(viewingDistance)) {
      recommendations.push('Strong recommendation to add illumination');
    }
  }
  
  if (illumination === 'external_lighting') {
    recommendations.push('Use LED fixtures for energy efficiency');
    recommendations.push('Ensure even illumination across sign face');
    recommendations.push('Consider glare control for viewers');
  }
  
  if (illumination === 'backlit') {
    recommendations.push('Use translucent materials for even light distribution');
    recommendations.push('Plan for LED strip or panel lighting');
    recommendations.push('Consider dimming controls for different times');
  }
  
  if (['harsh_outdoor', 'extreme_conditions'].includes(environment)) {
    recommendations.push('Use marine-grade electrical components');
    recommendations.push('Plan for regular maintenance access');
    recommendations.push('Consider backup lighting systems');
  }
  
  return recommendations;
}

function assessVisibilityRating(legibilityAnalysis: any, contrastRequirements: any) {
  let score = 50; // Base score
  
  // Legibility contribution (50%)
  if (legibilityAnalysis.legibilityRating === 'Excellent') score += 40;
  else if (legibilityAnalysis.legibilityRating === 'Good') score += 30;
  else if (legibilityAnalysis.legibilityRating === 'Fair') score += 15;
  else score += 0;
  
  // Contrast contribution (30%)
  if (contrastRequirements.requiredContrast < 75) score += 25;
  else if (contrastRequirements.requiredContrast < 85) score += 20;
  else if (contrastRequirements.requiredContrast < 95) score += 15;
  else score += 10;
  
  // Environmental factors (20%)
  score += 15; // Base environmental score
  
  const finalScore = Math.min(100, Math.max(0, score));
  
  return {
    score: finalScore,
    rating: getVisibilityRatingText(finalScore),
    strengths: getVisibilityStrengths(legibilityAnalysis, contrastRequirements),
    improvements: getVisibilityImprovements(finalScore, legibilityAnalysis),
  };
}

function getVisibilityRatingText(score: number) {
  if (score >= 90) return 'Outstanding - Excellent visibility in all conditions';
  if (score >= 80) return 'Very Good - Good visibility in most conditions';
  if (score >= 70) return 'Good - Adequate visibility for intended use';
  if (score >= 60) return 'Fair - May have visibility challenges';
  return 'Poor - Significant visibility improvements needed';
}

function getVisibilityStrengths(legibilityAnalysis: any, contrastRequirements: any) {
  const strengths = [];
  
  if (legibilityAnalysis.adequacyRatio > 1.5) {
    strengths.push('Excellent letter size for viewing distance');
  }
  
  if (contrastRequirements.requiredContrast < 80) {
    strengths.push('Good environmental conditions for visibility');
  }
  
  if (legibilityAnalysis.legibilityRating === 'Excellent') {
    strengths.push('Optimal legibility characteristics');
  }
  
  return strengths;
}

function getVisibilityImprovements(score: number, legibilityAnalysis: any) {
  const improvements = [];
  
  if (score < 70) {
    improvements.push('Consider increasing letter height');
    improvements.push('Enhance contrast with background');
    improvements.push('Add or improve illumination');
  }
  
  if (legibilityAnalysis.adequacyRatio < 1.0) {
    improvements.push('Increase letter size for better readability');
  }
  
  if (score < 60) {
    improvements.push('Review overall design approach');
    improvements.push('Consider professional visibility analysis');
  }
  
  return improvements;
}

export default signageConfig;
