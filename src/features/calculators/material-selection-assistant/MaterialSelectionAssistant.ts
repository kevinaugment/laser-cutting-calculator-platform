// Material Selection Assistant Calculator Implementation
// AI-enhanced material selection based on application requirements

import { z } from 'zod';
import Decimal from 'decimal.js';
import { 
  BaseCalculator, 
  BaseCalculatorConfig, 
  BaseCalculationResult,
  ValidationResult 
} from '@/lib/calculator/BaseCalculator';

// Input validation schema
const materialSelectionSchema = z.object({
  application: z.enum(['structural', 'decorative', 'automotive', 'aerospace', 'marine', 'food_grade', 'medical']),
  strengthRequirement: z.enum(['low', 'medium', 'high', 'ultra_high']),
  corrosionResistance: z.enum(['none', 'mild', 'moderate', 'high', 'extreme']),
  budget: z.number().min(0.1).max(1000)
});

// Input types
export type MaterialSelectionInputs = z.infer<typeof materialSelectionSchema>;

// Material recommendation result
export interface MaterialRecommendation {
  material: string;
  score: number;
  costPerKg: number;
  suitabilityRating: number;
  pros: string[];
  cons: string[];
  cuttingParameters: {
    recommendedLaser: string;
    typicalSpeed: string;
    gasType: string;
    difficulty: 'easy' | 'medium' | 'hard';
  };
}

// Result types
export interface MaterialSelectionResults {
  recommendedMaterials: MaterialRecommendation[];
  materialProperties: Record<string, any>;
  costAnalysis: {
    budgetFit: 'excellent' | 'good' | 'marginal' | 'over_budget';
    costRange: { min: number; max: number };
    valueRating: number;
  };
  cuttingParameters: {
    recommendedLaser: string;
    estimatedDifficulty: string;
    specialConsiderations: string[];
  };
  prosAndCons: {
    topChoice: {
      material: string;
      pros: string[];
      cons: string[];
    };
  };
  recommendations: string[];
  warnings: string[];
}

// Comprehensive material database
const materialDatabase = {
  'carbon_steel': {
    name: 'Carbon Steel',
    costPerKg: 2.5,
    properties: {
      tensileStrength: 400, // MPa
      yieldStrength: 250,
      corrosionResistance: 1,
      weldability: 9,
      machinability: 8,
      density: 7.85
    },
    applications: ['structural', 'automotive'],
    cuttingParams: {
      laser: 'fiber',
      speed: 'fast',
      gas: 'oxygen',
      difficulty: 'easy' as const
    },
    pros: ['Low cost', 'High strength', 'Easy to weld', 'Widely available'],
    cons: ['Poor corrosion resistance', 'Requires coating for outdoor use']
  },
  'stainless_steel_304': {
    name: 'Stainless Steel 304',
    costPerKg: 8.5,
    properties: {
      tensileStrength: 515,
      yieldStrength: 205,
      corrosionResistance: 8,
      weldability: 8,
      machinability: 6,
      density: 8.0
    },
    applications: ['food_grade', 'medical', 'marine', 'decorative'],
    cuttingParams: {
      laser: 'fiber',
      speed: 'medium',
      gas: 'nitrogen',
      difficulty: 'medium' as const
    },
    pros: ['Excellent corrosion resistance', 'Food safe', 'Hygienic', 'Good formability'],
    cons: ['Higher cost', 'Work hardening', 'Lower thermal conductivity']
  },
  'stainless_steel_316': {
    name: 'Stainless Steel 316',
    costPerKg: 12.0,
    properties: {
      tensileStrength: 515,
      yieldStrength: 205,
      corrosionResistance: 9,
      weldability: 8,
      machinability: 6,
      density: 8.0
    },
    applications: ['marine', 'medical', 'food_grade'],
    cuttingParams: {
      laser: 'fiber',
      speed: 'medium',
      gas: 'nitrogen',
      difficulty: 'medium' as const
    },
    pros: ['Superior corrosion resistance', 'Marine grade', 'Biocompatible', 'Chemical resistant'],
    cons: ['High cost', 'Work hardening', 'Specialized welding required']
  },
  'aluminum_6061': {
    name: 'Aluminum 6061',
    costPerKg: 4.2,
    properties: {
      tensileStrength: 310,
      yieldStrength: 276,
      corrosionResistance: 7,
      weldability: 7,
      machinability: 9,
      density: 2.7
    },
    applications: ['aerospace', 'automotive', 'structural'],
    cuttingParams: {
      laser: 'fiber',
      speed: 'fast',
      gas: 'nitrogen',
      difficulty: 'easy' as const
    },
    pros: ['Lightweight', 'Good strength-to-weight', 'Corrosion resistant', 'Easy to machine'],
    cons: ['Lower strength than steel', 'Requires special welding', 'Thermal expansion']
  },
  'aluminum_7075': {
    name: 'Aluminum 7075',
    costPerKg: 8.8,
    properties: {
      tensileStrength: 572,
      yieldStrength: 503,
      corrosionResistance: 6,
      weldability: 4,
      machinability: 7,
      density: 2.81
    },
    applications: ['aerospace', 'automotive'],
    cuttingParams: {
      laser: 'fiber',
      speed: 'medium',
      gas: 'nitrogen',
      difficulty: 'medium' as const
    },
    pros: ['Very high strength', 'Lightweight', 'Aerospace grade', 'Good fatigue resistance'],
    cons: ['Expensive', 'Difficult to weld', 'Stress corrosion susceptible']
  },
  'titanium_grade2': {
    name: 'Titanium Grade 2',
    costPerKg: 35.0,
    properties: {
      tensileStrength: 345,
      yieldStrength: 275,
      corrosionResistance: 10,
      weldability: 6,
      machinability: 4,
      density: 4.5
    },
    applications: ['aerospace', 'medical', 'marine'],
    cuttingParams: {
      laser: 'fiber',
      speed: 'slow',
      gas: 'argon',
      difficulty: 'hard' as const
    },
    pros: ['Excellent corrosion resistance', 'Biocompatible', 'High strength-to-weight', 'Temperature resistant'],
    cons: ['Very expensive', 'Difficult to machine', 'Specialized welding', 'Reactive at high temps']
  },
  'copper_c101': {
    name: 'Copper C101',
    costPerKg: 9.5,
    properties: {
      tensileStrength: 220,
      yieldStrength: 70,
      corrosionResistance: 8,
      weldability: 6,
      machinability: 3,
      density: 8.96
    },
    applications: ['decorative', 'marine'],
    cuttingParams: {
      laser: 'fiber',
      speed: 'slow',
      gas: 'nitrogen',
      difficulty: 'hard' as const
    },
    pros: ['Excellent conductivity', 'Antimicrobial', 'Corrosion resistant', 'Attractive appearance'],
    cons: ['Expensive', 'Soft material', 'Difficult to cut', 'High thermal conductivity']
  },
  'brass_c360': {
    name: 'Brass C360',
    costPerKg: 7.2,
    properties: {
      tensileStrength: 470,
      yieldStrength: 310,
      corrosionResistance: 7,
      weldability: 5,
      machinability: 9,
      density: 8.5
    },
    applications: ['decorative', 'marine'],
    cuttingParams: {
      laser: 'fiber',
      speed: 'medium',
      gas: 'nitrogen',
      difficulty: 'medium' as const
    },
    pros: ['Excellent machinability', 'Attractive appearance', 'Good corrosion resistance', 'Easy to form'],
    cons: ['Contains lead', 'Moderate cost', 'Dezincification risk', 'Limited strength']
  }
};

// Application requirements mapping
const applicationRequirements = {
  structural: {
    minStrength: 300,
    minCorrosionResistance: 3,
    maxCost: 15,
    priorities: ['strength', 'cost', 'weldability']
  },
  decorative: {
    minStrength: 200,
    minCorrosionResistance: 6,
    maxCost: 25,
    priorities: ['appearance', 'corrosion_resistance', 'formability']
  },
  automotive: {
    minStrength: 250,
    minCorrosionResistance: 5,
    maxCost: 12,
    priorities: ['strength', 'weight', 'cost']
  },
  aerospace: {
    minStrength: 400,
    minCorrosionResistance: 7,
    maxCost: 50,
    priorities: ['strength_to_weight', 'fatigue_resistance', 'temperature_resistance']
  },
  marine: {
    minStrength: 250,
    minCorrosionResistance: 8,
    maxCost: 20,
    priorities: ['corrosion_resistance', 'strength', 'weldability']
  },
  food_grade: {
    minStrength: 200,
    minCorrosionResistance: 8,
    maxCost: 15,
    priorities: ['hygiene', 'corrosion_resistance', 'cleanability']
  },
  medical: {
    minStrength: 300,
    minCorrosionResistance: 9,
    maxCost: 40,
    priorities: ['biocompatibility', 'corrosion_resistance', 'sterilizability']
  }
};

export class MaterialSelectionAssistant extends BaseCalculator {
  readonly config: BaseCalculatorConfig = {
    id: 'material-selection-assistant',
    title: 'Material Selection Assistant',
    description: 'AI-enhanced material selection based on application requirements and budget',
    category: 'Core Engineering',
    badge: 'AI Enhanced',
    iconName: 'Layers',
    inputs: [
      {
        id: 'application',
        label: 'Application Type',
        type: 'select',
        required: true,
        help: 'Select the intended application for the part',
        options: [
          { value: 'structural', label: 'Structural/Construction' },
          { value: 'decorative', label: 'Decorative/Architectural' },
          { value: 'automotive', label: 'Automotive' },
          { value: 'aerospace', label: 'Aerospace' },
          { value: 'marine', label: 'Marine/Offshore' },
          { value: 'food_grade', label: 'Food Grade' },
          { value: 'medical', label: 'Medical/Biomedical' }
        ]
      },
      {
        id: 'strengthRequirement',
        label: 'Strength Requirement',
        type: 'select',
        required: true,
        help: 'Required mechanical strength level',
        options: [
          { value: 'low', label: 'Low (< 250 MPa)' },
          { value: 'medium', label: 'Medium (250-400 MPa)' },
          { value: 'high', label: 'High (400-600 MPa)' },
          { value: 'ultra_high', label: 'Ultra High (> 600 MPa)' }
        ]
      },
      {
        id: 'corrosionResistance',
        label: 'Corrosion Resistance',
        type: 'select',
        required: true,
        help: 'Required level of corrosion resistance',
        options: [
          { value: 'none', label: 'None (Indoor, dry)' },
          { value: 'mild', label: 'Mild (Indoor, humid)' },
          { value: 'moderate', label: 'Moderate (Outdoor)' },
          { value: 'high', label: 'High (Chemical exposure)' },
          { value: 'extreme', label: 'Extreme (Marine, acid)' }
        ]
      },
      {
        id: 'budget',
        label: 'Budget per kg',
        type: 'number',
        required: true,
        min: 0.1,
        max: 1000,
        step: 0.1,
        unit: '$/kg',
        help: 'Maximum budget per kilogram of material'
      }
    ],
    resultType: 'selection',
    version: '1.0.0',
    lastUpdated: '2025-01-02'
  };

  getInputSchema(): z.ZodSchema {
    return materialSelectionSchema;
  }

  customValidation(inputs: MaterialSelectionInputs): Pick<ValidationResult, 'errors' | 'warnings'> {
    const errors: ValidationResult['errors'] = [];
    const warnings: ValidationResult['warnings'] = [];

    // Check budget vs application requirements
    const appReqs = applicationRequirements[inputs.application];
    if (!appReqs) {
      errors.push({
        field: 'application',
        message: `Application type '${inputs.application}' is not supported. Please select a valid application.`,
        code: 'INVALID_APPLICATION'
      });
      return { errors, warnings };
    }

    if (inputs.budget < appReqs.maxCost * 0.3) {
      warnings.push({
        field: 'budget',
        message: `Budget may be too low for ${inputs.application} applications. Consider increasing budget for better material options.`,
        code: 'LOW_BUDGET'
      });
    }

    // Check strength vs corrosion requirements
    if (inputs.strengthRequirement === 'ultra_high' && inputs.corrosionResistance === 'extreme') {
      warnings.push({
        field: 'strengthRequirement',
        message: 'Ultra-high strength with extreme corrosion resistance may require expensive specialty alloys.',
        code: 'DEMANDING_REQUIREMENTS'
      });
    }

    // Check application-specific warnings
    if (inputs.application === 'food_grade' && inputs.corrosionResistance === 'none') {
      warnings.push({
        field: 'corrosionResistance',
        message: 'Food grade applications typically require good corrosion resistance for hygiene.',
        code: 'FOOD_GRADE_WARNING'
      });
    }

    return { errors, warnings };
  }

  async calculate(inputs: MaterialSelectionInputs): Promise<BaseCalculationResult> {
    try {
      // Score all materials based on requirements
      const materialScores = this.scoreMaterials(inputs);
      
      // Filter materials within budget
      const affordableMaterials = materialScores.filter(
        material => material.costPerKg <= inputs.budget
      );

      // Sort by score (highest first)
      const sortedMaterials = affordableMaterials.sort((a, b) => b.score - a.score);
      
      // Take top 3 recommendations
      const recommendedMaterials = sortedMaterials.slice(0, 3);

      // Analyze cost fit
      const costAnalysis = this.analyzeCostFit(inputs, recommendedMaterials);
      
      // Generate cutting parameters
      const cuttingParameters = this.generateCuttingParameters(recommendedMaterials);
      
      // Generate recommendations and warnings
      const recommendations = this.generateRecommendations(inputs, recommendedMaterials);
      const warnings = this.generateWarnings(inputs, recommendedMaterials);

      const results: MaterialSelectionResults = {
        recommendedMaterials,
        materialProperties: this.getMaterialProperties(recommendedMaterials),
        costAnalysis,
        cuttingParameters,
        prosAndCons: {
          topChoice: {
            material: recommendedMaterials[0]?.material || 'No suitable material found',
            pros: recommendedMaterials[0]?.pros || [],
            cons: recommendedMaterials[0]?.cons || []
          }
        },
        recommendations,
        warnings
      };

      return this.createSuccessResult(results, inputs);

    } catch (error) {
      return this.createErrorResult(
        `Material selection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        inputs
      );
    }
  }

  private scoreMaterials(inputs: MaterialSelectionInputs): MaterialRecommendation[] {
    const appReqs = applicationRequirements[inputs.application];
    const strengthMultipliers = { low: 0.5, medium: 1.0, high: 1.5, ultra_high: 2.0 };
    const corrosionMultipliers = { none: 0.2, mild: 0.5, moderate: 1.0, high: 1.5, extreme: 2.0 };

    return Object.entries(materialDatabase).map(([key, material]) => {
      let score = 0;

      // Strength scoring
      const strengthReq = strengthMultipliers[inputs.strengthRequirement] * 300;
      const strengthScore = Math.min(material.properties.tensileStrength / strengthReq, 2) * 25;
      score += strengthScore;

      // Corrosion resistance scoring
      const corrosionReq = corrosionMultipliers[inputs.corrosionResistance] * 5;
      const corrosionScore = Math.min(material.properties.corrosionResistance / corrosionReq, 2) * 25;
      score += corrosionScore;

      // Application suitability
      const appSuitability = material.applications.includes(inputs.application) ? 25 : 0;
      score += appSuitability;

      // Cost efficiency (inverse relationship)
      const costEfficiency = Math.max(0, 25 - (material.costPerKg / inputs.budget) * 25);
      score += costEfficiency;

      // Suitability rating (0-10 scale)
      const suitabilityRating = Math.min(score / 10, 10);

      return {
        material: material.name,
        score: Math.round(score),
        costPerKg: material.costPerKg,
        suitabilityRating: Math.round(suitabilityRating * 10) / 10,
        pros: material.pros,
        cons: material.cons,
        cuttingParameters: {
          recommendedLaser: material.cuttingParams.laser,
          typicalSpeed: material.cuttingParams.speed,
          gasType: material.cuttingParams.gas,
          difficulty: material.cuttingParams.difficulty
        }
      };
    });
  }

  private analyzeCostFit(inputs: MaterialSelectionInputs, materials: MaterialRecommendation[]) {
    if (materials.length === 0) {
      return {
        budgetFit: 'over_budget' as const,
        costRange: { min: 0, max: 0 },
        valueRating: 0
      };
    }

    const costs = materials.map(m => m.costPerKg);
    const minCost = Math.min(...costs);
    const maxCost = Math.max(...costs);
    
    let budgetFit: 'excellent' | 'good' | 'marginal' | 'over_budget';
    if (maxCost <= inputs.budget * 0.7) budgetFit = 'excellent';
    else if (maxCost <= inputs.budget * 0.9) budgetFit = 'good';
    else if (maxCost <= inputs.budget) budgetFit = 'marginal';
    else budgetFit = 'over_budget';

    const valueRating = Math.round((materials[0]?.score || 0) / 10);

    return {
      budgetFit,
      costRange: { min: minCost, max: maxCost },
      valueRating
    };
  }

  private generateCuttingParameters(materials: MaterialRecommendation[]) {
    if (materials.length === 0) {
      return {
        recommendedLaser: 'fiber',
        estimatedDifficulty: 'unknown',
        specialConsiderations: ['No suitable materials found within budget']
      };
    }

    const topMaterial = materials[0];
    const difficulties = materials.map(m => m.cuttingParameters.difficulty);
    const avgDifficulty = difficulties.includes('hard') ? 'challenging' : 
                         difficulties.includes('medium') ? 'moderate' : 'straightforward';

    const considerations: string[] = [];
    if (difficulties.includes('hard')) {
      considerations.push('Some materials require specialized cutting parameters');
    }
    if (materials.some(m => m.cuttingParameters.gasType === 'argon')) {
      considerations.push('Inert gas atmosphere required for some materials');
    }

    return {
      recommendedLaser: topMaterial.cuttingParameters.recommendedLaser,
      estimatedDifficulty: avgDifficulty,
      specialConsiderations: considerations
    };
  }

  private getMaterialProperties(materials: MaterialRecommendation[]) {
    if (materials.length === 0) return {};

    const topMaterial = materials[0].material;
    const materialData = Object.values(materialDatabase).find(m => m.name === topMaterial);
    
    return materialData?.properties || {};
  }

  private generateRecommendations(inputs: MaterialSelectionInputs, materials: MaterialRecommendation[]): string[] {
    const recommendations: string[] = [];

    if (materials.length === 0) {
      recommendations.push('Consider increasing budget or relaxing requirements');
      return recommendations;
    }

    if (materials.length === 1) {
      recommendations.push('Limited options available - consider expanding budget for alternatives');
    }

    if (inputs.application === 'aerospace' && materials[0]?.material.includes('Aluminum')) {
      recommendations.push('Consider titanium for critical aerospace applications');
    }

    if (inputs.corrosionResistance === 'extreme' && !materials[0]?.material.includes('Stainless')) {
      recommendations.push('Stainless steel or titanium recommended for extreme corrosion resistance');
    }

    if (materials[0]?.cuttingParameters.difficulty === 'hard') {
      recommendations.push('Selected material may require specialized cutting expertise');
    }

    return recommendations;
  }

  private generateWarnings(inputs: MaterialSelectionInputs, materials: MaterialRecommendation[]): string[] {
    const warnings: string[] = [];

    if (materials.length === 0) {
      warnings.push('No materials found within budget constraints');
    }

    if (materials.length > 0 && materials[0].score < 60) {
      warnings.push('Top recommendation has moderate suitability - review requirements');
    }

    if (inputs.budget < 5 && inputs.application === 'aerospace') {
      warnings.push('Budget may be insufficient for aerospace-grade materials');
    }

    return warnings;
  }

  getExampleInputs(): MaterialSelectionInputs {
    return {
      application: 'structural',
      strengthRequirement: 'medium',
      corrosionResistance: 'mild',
      budget: 10.0
    };
  }
}
