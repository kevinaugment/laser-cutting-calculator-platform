import { CalculatorConfig } from '../../types/calculator';

export const customProjectConfig: CalculatorConfig = {
  id: 'custom-project',
  name: 'Custom Project Calculator',
  description: 'Comprehensive calculator for custom laser cutting projects with multi-material, multi-process capabilities and advanced project planning features.',
  category: 'general',
  difficulty: 'advanced',
  estimatedTime: '10-15 minutes',
  
  inputs: [
    {
      id: 'projectType',
      label: 'Project Type',
      type: 'select',
      value: 'multi_component',
      options: [
        { value: 'single_component', label: 'Single Component Project' },
        { value: 'multi_component', label: 'Multi-Component Assembly' },
        { value: 'prototype_development', label: 'Prototype Development' },
        { value: 'production_run', label: 'Production Run' },
        { value: 'custom_fabrication', label: 'Custom Fabrication' },
        { value: 'repair_modification', label: 'Repair/Modification' },
        { value: 'research_project', label: 'Research Project' },
      ],
      required: true,
      description: 'Type of custom project',
    },
    {
      id: 'projectComplexity',
      label: 'Project Complexity',
      type: 'select',
      value: 'moderate',
      options: [
        { value: 'simple', label: 'Simple (1-3 operations, single material)' },
        { value: 'moderate', label: 'Moderate (4-8 operations, 2-3 materials)' },
        { value: 'complex', label: 'Complex (9-15 operations, multiple materials)' },
        { value: 'highly_complex', label: 'Highly Complex (15+ operations, advanced features)' },
      ],
      required: true,
      description: 'Overall complexity of the project',
    },
    {
      id: 'materialCount',
      label: 'Number of Different Materials',
      type: 'number',
      value: 2,
      min: 1,
      max: 10,
      step: 1,
      required: true,
      description: 'Number of different materials in the project',
    },
    {
      id: 'primaryMaterial',
      label: 'Primary Material',
      type: 'select',
      value: 'stainless_steel',
      options: [
        { value: 'carbon_steel', label: 'Carbon Steel' },
        { value: 'stainless_steel', label: 'Stainless Steel' },
        { value: 'aluminum', label: 'Aluminum' },
        { value: 'brass', label: 'Brass' },
        { value: 'copper', label: 'Copper' },
        { value: 'titanium', label: 'Titanium' },
        { value: 'inconel', label: 'Inconel/Superalloy' },
        { value: 'acrylic', label: 'Acrylic' },
        { value: 'wood', label: 'Wood' },
        { value: 'composite', label: 'Composite Material' },
      ],
      required: true,
      description: 'Primary material for the project',
    },
    {
      id: 'thicknessRange',
      label: 'Material Thickness Range',
      type: 'select',
      value: 'medium_range',
      options: [
        { value: 'thin_only', label: 'Thin Only (< 3mm)' },
        { value: 'medium_range', label: 'Medium Range (3-12mm)' },
        { value: 'thick_range', label: 'Thick Range (12-25mm)' },
        { value: 'mixed_thickness', label: 'Mixed Thickness (< 3mm to > 25mm)' },
      ],
      required: true,
      description: 'Range of material thicknesses in project',
    },
    {
      id: 'precisionRequirement',
      label: 'Precision Requirement',
      type: 'select',
      value: 'high_precision',
      options: [
        { value: 'standard', label: 'Standard (±0.2mm)' },
        { value: 'high_precision', label: 'High Precision (±0.1mm)' },
        { value: 'ultra_precision', label: 'Ultra Precision (±0.05mm)' },
        { value: 'mixed_precision', label: 'Mixed Precision Requirements' },
      ],
      required: true,
      description: 'Overall precision requirements',
    },
    {
      id: 'surfaceFinish',
      label: 'Surface Finish Requirements',
      type: 'select',
      value: 'high_quality',
      options: [
        { value: 'standard', label: 'Standard Finish' },
        { value: 'high_quality', label: 'High Quality Finish' },
        { value: 'mirror_finish', label: 'Mirror/Optical Finish' },
        { value: 'textured', label: 'Textured/Patterned' },
        { value: 'mixed_finish', label: 'Mixed Finish Requirements' },
      ],
      required: true,
      description: 'Surface finish quality requirements',
    },
    {
      id: 'assemblyRequirement',
      label: 'Assembly Requirement',
      type: 'select',
      value: 'partial_assembly',
      options: [
        { value: 'parts_only', label: 'Parts Only (No Assembly)' },
        { value: 'partial_assembly', label: 'Partial Assembly' },
        { value: 'complete_assembly', label: 'Complete Assembly' },
        { value: 'testing_validation', label: 'Assembly + Testing/Validation' },
      ],
      required: true,
      description: 'Level of assembly services required',
    },
    {
      id: 'timeline',
      label: 'Project Timeline',
      type: 'select',
      value: 'standard',
      options: [
        { value: 'rush', label: 'Rush (< 1 week)' },
        { value: 'expedited', label: 'Expedited (1-2 weeks)' },
        { value: 'standard', label: 'Standard (2-4 weeks)' },
        { value: 'extended', label: 'Extended (4-8 weeks)' },
        { value: 'development', label: 'Development Project (8+ weeks)' },
      ],
      required: true,
      description: 'Required project timeline',
    },
    {
      id: 'quantity',
      label: 'Project Quantity',
      type: 'select',
      value: 'small_batch',
      options: [
        { value: 'prototype', label: 'Prototype (1-5 units)' },
        { value: 'small_batch', label: 'Small Batch (5-25 units)' },
        { value: 'medium_batch', label: 'Medium Batch (25-100 units)' },
        { value: 'large_batch', label: 'Large Batch (100-500 units)' },
        { value: 'production', label: 'Production Run (500+ units)' },
      ],
      required: true,
      description: 'Total quantity for the project',
    },
    {
      id: 'specialRequirements',
      label: 'Special Requirements',
      type: 'select',
      value: 'none',
      options: [
        { value: 'none', label: 'No Special Requirements' },
        { value: 'certification', label: 'Certification Required (ISO, AS9100, etc.)' },
        { value: 'traceability', label: 'Material Traceability Required' },
        { value: 'testing', label: 'Special Testing/Validation' },
        { value: 'packaging', label: 'Special Packaging/Shipping' },
        { value: 'documentation', label: 'Extensive Documentation' },
        { value: 'multiple', label: 'Multiple Special Requirements' },
      ],
      required: true,
      description: 'Any special project requirements',
    },
  ],

  outputs: [
    {
      id: 'projectAnalysis',
      label: 'Project Analysis',
      type: 'object',
      format: 'custom-project-analysis',
      description: 'Comprehensive project feasibility and planning analysis',
    },
    {
      id: 'processPlanning',
      label: 'Process Planning',
      type: 'object',
      format: 'custom-process-plan',
      description: 'Detailed manufacturing process planning and sequencing',
    },
    {
      id: 'resourceRequirements',
      label: 'Resource Requirements',
      type: 'object',
      format: 'custom-resource-specs',
      description: 'Equipment, tooling, and resource requirements',
    },
    {
      id: 'projectCost',
      label: 'Project Cost',
      type: 'object',
      format: 'custom-project-cost',
      description: 'Comprehensive project cost breakdown and timeline',
    },
  ],

  calculate: (inputs: Record<string, any>) => {
    const {
      projectType,
      projectComplexity,
      materialCount,
      primaryMaterial,
      thicknessRange,
      precisionRequirement,
      surfaceFinish,
      assemblyRequirement,
      timeline,
      quantity,
      specialRequirements,
    } = inputs;

    // Analyze project feasibility and requirements
    const projectAnalysis = analyzeCustomProject(
      projectType,
      projectComplexity,
      materialCount,
      primaryMaterial,
      precisionRequirement
    );

    // Plan manufacturing processes
    const processPlanning = planCustomProcesses(
      projectComplexity,
      materialCount,
      thicknessRange,
      precisionRequirement,
      surfaceFinish
    );

    // Determine resource requirements
    const resourceRequirements = determineCustomResources(
      projectComplexity,
      materialCount,
      precisionRequirement,
      assemblyRequirement,
      specialRequirements
    );

    // Calculate project costs and timeline
    const projectCost = calculateCustomProjectCost(
      projectType,
      projectComplexity,
      materialCount,
      quantity,
      timeline,
      assemblyRequirement,
      processPlanning
    );

    return {
      projectAnalysis,
      processPlanning,
      resourceRequirements,
      projectCost,
    };
  },

  validation: {
    materialCount: {
      min: 1,
      max: 10,
      message: 'Material count must be between 1 and 10',
    },
  },

  examples: [
    {
      name: 'Multi-Material Prototype',
      description: 'Complex prototype with multiple materials and high precision',
      inputs: {
        projectType: 'prototype_development',
        projectComplexity: 'complex',
        materialCount: 4,
        primaryMaterial: 'stainless_steel',
        thicknessRange: 'mixed_thickness',
        precisionRequirement: 'ultra_precision',
        surfaceFinish: 'high_quality',
        assemblyRequirement: 'complete_assembly',
        timeline: 'extended',
        quantity: 'prototype',
        specialRequirements: 'testing',
      },
    },
    {
      name: 'Production Run',
      description: 'Medium complexity production run with standard requirements',
      inputs: {
        projectType: 'production_run',
        projectComplexity: 'moderate',
        materialCount: 2,
        primaryMaterial: 'aluminum',
        thicknessRange: 'medium_range',
        precisionRequirement: 'high_precision',
        surfaceFinish: 'standard',
        assemblyRequirement: 'partial_assembly',
        timeline: 'standard',
        quantity: 'large_batch',
        specialRequirements: 'none',
      },
    },
  ],

  tags: ['custom', 'project-planning', 'multi-material', 'assembly', 'comprehensive'],
  
  relatedCalculators: [
    'project-planning',
    'multi-material-cutting',
    'assembly-services',
    'cost-estimation',
  ],

  learningResources: [
    {
      title: 'Custom Project Planning Guide',
      type: 'article',
      url: '/learn/custom-project-planning',
    },
    {
      title: 'Multi-Material Processing',
      type: 'video',
      url: '/learn/multi-material-processing',
    },
  ],
};

// Helper functions
function analyzeCustomProject(
  projectType: string,
  complexity: string,
  materialCount: number,
  primaryMaterial: string,
  precision: string
) {
  const feasibilityAssessment = assessProjectFeasibility(complexity, materialCount, precision);
  const riskAnalysis = analyzeProjectRisks(projectType, complexity, materialCount);
  const designConsiderations = getDesignConsiderations(primaryMaterial, precision);
  
  return {
    feasibilityAssessment,
    riskAnalysis,
    designConsiderations,
    projectScope: defineProjectScope(projectType, complexity),
    successFactors: identifySuccessFactors(complexity, precision),
    recommendations: getProjectRecommendations(feasibilityAssessment, riskAnalysis),
  };
}

function assessProjectFeasibility(complexity: string, materialCount: number, precision: string) {
  let feasibilityScore = 100;
  
  // Complexity impact
  const complexityPenalties = {
    simple: 0,
    moderate: -10,
    complex: -25,
    highly_complex: -40,
  };
  feasibilityScore += complexityPenalties[complexity] || -10;
  
  // Material count impact
  if (materialCount > 5) feasibilityScore -= 20;
  else if (materialCount > 3) feasibilityScore -= 10;
  else if (materialCount > 1) feasibilityScore -= 5;
  
  // Precision impact
  const precisionPenalties = {
    standard: 0,
    high_precision: -5,
    ultra_precision: -15,
    mixed_precision: -20,
  };
  feasibilityScore += precisionPenalties[precision] || -5;
  
  feasibilityScore = Math.max(0, Math.min(100, feasibilityScore));
  
  return {
    score: feasibilityScore,
    rating: getFeasibilityRating(feasibilityScore),
    challenges: getFeasibilityChallenges(complexity, materialCount, precision),
    mitigationStrategies: getMitigationStrategies(feasibilityScore),
  };
}

function getFeasibilityRating(score: number) {
  if (score >= 90) return 'Excellent - Highly feasible project';
  if (score >= 75) return 'Good - Feasible with standard processes';
  if (score >= 60) return 'Moderate - Requires careful planning';
  if (score >= 40) return 'Challenging - Significant complexity';
  return 'Very Difficult - Consider simplification';
}

function getFeasibilityChallenges(complexity: string, materialCount: number, precision: string) {
  const challenges = [];
  
  if (complexity === 'highly_complex') {
    challenges.push('Very high complexity requires extensive planning');
    challenges.push('Multiple process steps increase risk');
    challenges.push('Quality control becomes critical');
  }
  
  if (materialCount > 3) {
    challenges.push('Multiple materials require different processing parameters');
    challenges.push('Material compatibility considerations');
    challenges.push('Increased setup and changeover time');
  }
  
  if (precision === 'ultra_precision') {
    challenges.push('Ultra-precision requirements need specialized equipment');
    challenges.push('Environmental control becomes critical');
    challenges.push('Extensive quality control required');
  }
  
  return challenges;
}

function getMitigationStrategies(score: number) {
  const strategies = [];
  
  if (score < 60) {
    strategies.push('Break project into smaller phases');
    strategies.push('Prototype critical features first');
    strategies.push('Consider design simplification');
    strategies.push('Implement extensive quality planning');
  } else if (score < 80) {
    strategies.push('Develop detailed process plans');
    strategies.push('Implement risk management procedures');
    strategies.push('Plan for additional quality control');
  } else {
    strategies.push('Follow standard project management practices');
    strategies.push('Implement normal quality procedures');
  }
  
  return strategies;
}

function analyzeProjectRisks(projectType: string, complexity: string, materialCount: number) {
  const technicalRisks = assessTechnicalRisks(complexity, materialCount);
  const scheduleRisks = assessScheduleRisks(projectType, complexity);
  const qualityRisks = assessQualityRisks(complexity, materialCount);
  
  return {
    technicalRisks,
    scheduleRisks,
    qualityRisks,
    overallRiskLevel: calculateOverallRisk(technicalRisks, scheduleRisks, qualityRisks),
    riskMitigation: getRiskMitigationPlan(technicalRisks, scheduleRisks, qualityRisks),
  };
}

function assessTechnicalRisks(complexity: string, materialCount: number) {
  const risks = [];
  let riskLevel = 'Low';
  
  if (complexity === 'highly_complex') {
    risks.push('Complex geometry may require specialized tooling');
    risks.push('Multiple process steps increase failure points');
    riskLevel = 'High';
  } else if (complexity === 'complex') {
    risks.push('Moderate complexity requires careful process control');
    riskLevel = 'Medium';
  }
  
  if (materialCount > 3) {
    risks.push('Multiple materials increase process complexity');
    risks.push('Material compatibility issues possible');
    if (riskLevel === 'Low') riskLevel = 'Medium';
    else if (riskLevel === 'Medium') riskLevel = 'High';
  }
  
  return {
    level: riskLevel,
    risks,
    mitigation: getTechnicalRiskMitigation(complexity, materialCount),
  };
}

function getTechnicalRiskMitigation(complexity: string, materialCount: number) {
  const mitigation = [];
  
  if (complexity === 'highly_complex') {
    mitigation.push('Develop detailed process documentation');
    mitigation.push('Create process validation procedures');
    mitigation.push('Implement design reviews at each stage');
  }
  
  if (materialCount > 3) {
    mitigation.push('Test material compatibility early');
    mitigation.push('Develop material-specific process parameters');
    mitigation.push('Create material handling procedures');
  }
  
  mitigation.push('Implement regular design reviews');
  mitigation.push('Plan for iterative testing and refinement');
  
  return mitigation;
}

function assessScheduleRisks(projectType: string, complexity: string) {
  const risks = [];
  let riskLevel = 'Low';
  
  if (projectType === 'prototype_development') {
    risks.push('Prototype development often requires iterations');
    risks.push('Unknown issues may emerge during development');
    riskLevel = 'Medium';
  }
  
  if (complexity === 'highly_complex') {
    risks.push('Complex projects prone to schedule delays');
    risks.push('Quality issues may require rework');
    riskLevel = 'High';
  }
  
  return {
    level: riskLevel,
    risks,
    mitigation: getScheduleRiskMitigation(projectType, complexity),
  };
}

function getScheduleRiskMitigation(projectType: string, complexity: string) {
  const mitigation = [];
  
  if (projectType === 'prototype_development') {
    mitigation.push('Build iteration time into schedule');
    mitigation.push('Plan for design changes and refinements');
    mitigation.push('Implement agile development approach');
  }
  
  if (complexity === 'highly_complex') {
    mitigation.push('Add schedule buffers for complex operations');
    mitigation.push('Implement parallel processing where possible');
    mitigation.push('Plan for contingency scenarios');
  }
  
  mitigation.push('Regular progress reviews and updates');
  mitigation.push('Maintain clear communication channels');
  
  return mitigation;
}

function assessQualityRisks(complexity: string, materialCount: number) {
  const risks = [];
  let riskLevel = 'Low';
  
  if (complexity === 'highly_complex') {
    risks.push('Complex features increase quality control challenges');
    risks.push('Multiple operations increase cumulative error');
    riskLevel = 'High';
  }
  
  if (materialCount > 3) {
    risks.push('Different materials may have varying quality characteristics');
    risks.push('Material interactions may affect quality');
    if (riskLevel === 'Low') riskLevel = 'Medium';
  }
  
  return {
    level: riskLevel,
    risks,
    mitigation: getQualityRiskMitigation(complexity, materialCount),
  };
}

function getQualityRiskMitigation(complexity: string, materialCount: number) {
  const mitigation = [];
  
  if (complexity === 'highly_complex') {
    mitigation.push('Implement comprehensive quality planning');
    mitigation.push('Develop detailed inspection procedures');
    mitigation.push('Plan for in-process quality checks');
  }
  
  if (materialCount > 3) {
    mitigation.push('Develop material-specific quality standards');
    mitigation.push('Implement material verification procedures');
    mitigation.push('Plan for material-specific testing');
  }
  
  mitigation.push('Implement statistical process control');
  mitigation.push('Plan for first article inspection');
  
  return mitigation;
}

function calculateOverallRisk(technical: any, schedule: any, quality: any) {
  const riskLevels = { Low: 1, Medium: 2, High: 3 };
  const avgRisk = (riskLevels[technical.level] + riskLevels[schedule.level] + riskLevels[quality.level]) / 3;
  
  if (avgRisk >= 2.5) return 'High';
  if (avgRisk >= 1.5) return 'Medium';
  return 'Low';
}

function getRiskMitigationPlan(technical: any, schedule: any, quality: any) {
  const plan = [];
  
  plan.push(...technical.mitigation);
  plan.push(...schedule.mitigation);
  plan.push(...quality.mitigation);
  
  // Remove duplicates
  return [...new Set(plan)];
}

function getDesignConsiderations(primaryMaterial: string, precision: string) {
  const considerations = [];
  
  // Material-specific considerations
  const materialConsiderations = {
    carbon_steel: ['Consider corrosion protection', 'Plan for heat treatment if needed'],
    stainless_steel: ['Excellent corrosion resistance', 'Good for precision applications'],
    aluminum: ['Lightweight option', 'Good thermal conductivity'],
    brass: ['Good machinability', 'Decorative applications'],
    copper: ['Excellent conductivity', 'Antimicrobial properties'],
    titanium: ['High strength-to-weight ratio', 'Biocompatible'],
    inconel: ['High temperature resistance', 'Challenging to machine'],
    acrylic: ['Optical clarity', 'Easy to machine'],
    wood: ['Natural material', 'Grain direction important'],
    composite: ['Specialized processing required', 'Fiber orientation critical'],
  };
  
  considerations.push(...(materialConsiderations[primaryMaterial] || []));
  
  // Precision-specific considerations
  if (precision === 'ultra_precision') {
    considerations.push('Environmental control critical');
    considerations.push('Specialized measurement equipment required');
    considerations.push('Material stress relief important');
  } else if (precision === 'high_precision') {
    considerations.push('Careful process control required');
    considerations.push('Quality measurement planning important');
  }
  
  return considerations;
}

function defineProjectScope(projectType: string, complexity: string) {
  const scope = {
    primaryObjectives: [],
    deliverables: [],
    constraints: [],
    assumptions: [],
  };
  
  // Project type specific scope
  if (projectType === 'prototype_development') {
    scope.primaryObjectives.push('Develop functional prototype');
    scope.primaryObjectives.push('Validate design concepts');
    scope.deliverables.push('Working prototype');
    scope.deliverables.push('Design documentation');
    scope.constraints.push('Limited quantity production');
    scope.assumptions.push('Design may require iterations');
  } else if (projectType === 'production_run') {
    scope.primaryObjectives.push('Manufacture specified quantities');
    scope.primaryObjectives.push('Meet quality specifications');
    scope.deliverables.push('Finished parts/assemblies');
    scope.deliverables.push('Quality documentation');
    scope.constraints.push('Fixed design specifications');
    scope.assumptions.push('Design is finalized');
  }
  
  // Complexity specific scope
  if (complexity === 'highly_complex') {
    scope.constraints.push('Extended development time');
    scope.constraints.push('Specialized equipment requirements');
    scope.assumptions.push('Multiple process steps required');
  }
  
  return scope;
}

function identifySuccessFactors(complexity: string, precision: string) {
  const factors = [];
  
  // Universal success factors
  factors.push('Clear project requirements and specifications');
  factors.push('Effective communication between all stakeholders');
  factors.push('Adequate project planning and scheduling');
  
  // Complexity-specific factors
  if (complexity === 'highly_complex') {
    factors.push('Experienced project management');
    factors.push('Detailed process documentation');
    factors.push('Comprehensive risk management');
  }
  
  // Precision-specific factors
  if (precision === 'ultra_precision') {
    factors.push('Environmental control and stability');
    factors.push('Precision measurement capabilities');
    factors.push('Skilled technicians and operators');
  }
  
  factors.push('Quality control throughout the process');
  factors.push('Flexibility to adapt to challenges');
  
  return factors;
}

function getProjectRecommendations(feasibility: any, risks: any) {
  const recommendations = [];
  
  if (feasibility.score < 60) {
    recommendations.push('Consider breaking project into phases');
    recommendations.push('Prototype critical features first');
    recommendations.push('Implement extensive planning and review cycles');
  }
  
  if (risks.overallRiskLevel === 'High') {
    recommendations.push('Develop comprehensive risk mitigation plans');
    recommendations.push('Implement frequent progress reviews');
    recommendations.push('Plan for contingency scenarios');
  }
  
  recommendations.push('Establish clear success criteria');
  recommendations.push('Implement regular stakeholder communication');
  recommendations.push('Plan for quality control at each stage');
  
  return recommendations;
}

export default customProjectConfig;
