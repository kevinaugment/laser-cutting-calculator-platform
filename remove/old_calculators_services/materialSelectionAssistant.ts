import { CalculatorInputs, CalculatorResults } from '../../types/calculator';

export interface MaterialSelectionInputs extends CalculatorInputs {
  application: string; // Application type
  requiredProperties: {
    strength: 'low' | 'medium' | 'high' | 'critical';
    corrosionResistance: 'low' | 'medium' | 'high' | 'critical';
    weldability: 'low' | 'medium' | 'high' | 'critical';
    machinability: 'low' | 'medium' | 'high' | 'critical';
    costSensitivity: 'low' | 'medium' | 'high' | 'critical';
  };
  thickness: number;
  quantity: number;
  environment: 'indoor' | 'outdoor' | 'marine' | 'chemical' | 'high_temp';
  budget: number; // Budget per unit
  laserType: 'fiber' | 'co2' | 'nd_yag';
  qualityRequirement: 'draft' | 'standard' | 'high' | 'precision';
}

export interface MaterialOption {
  material: string;
  grade: string;
  suitabilityScore: number; // 0-100
  costPerUnit: number;
  cuttingDifficulty: 'easy' | 'medium' | 'difficult';
  properties: {
    tensileStrength: number; // MPa
    yieldStrength: number; // MPa
    corrosionResistance: number; // 1-10 scale
    weldability: number; // 1-10 scale
    machinability: number; // 1-10 scale
  };
  advantages: string[];
  disadvantages: string[];
  cuttingParameters: {
    recommendedPower: number;
    recommendedSpeed: number;
    gasType: string;
  };
}

export interface MaterialSelectionResults extends CalculatorResults {
  recommendedMaterials: MaterialOption[];
  bestOverall: MaterialOption;
  bestValue: MaterialOption;
  bestPerformance: MaterialOption;
  comparison: {
    costRange: { min: number; max: number };
    strengthRange: { min: number; max: number };
    suitabilityRange: { min: number; max: number };
  };
  applicationGuidance: {
    criticalFactors: string[];
    alternativeOptions: string[];
    designConsiderations: string[];
  };
}

export class MaterialSelectionAssistant {
  private materialDatabase: MaterialOption[] = [
    {
      material: 'Carbon Steel',
      grade: 'A36',
      suitabilityScore: 0,
      costPerUnit: 2.50,
      cuttingDifficulty: 'easy',
      properties: {
        tensileStrength: 400,
        yieldStrength: 250,
        corrosionResistance: 3,
        weldability: 9,
        machinability: 8
      },
      advantages: ['Low cost', 'Excellent weldability', 'Good machinability', 'Widely available'],
      disadvantages: ['Poor corrosion resistance', 'Requires coating for outdoor use'],
      cuttingParameters: { recommendedPower: 2000, recommendedSpeed: 4000, gasType: 'oxygen' }
    },
    {
      material: 'Stainless Steel',
      grade: '304',
      suitabilityScore: 0,
      costPerUnit: 8.50,
      cuttingDifficulty: 'medium',
      properties: {
        tensileStrength: 515,
        yieldStrength: 205,
        corrosionResistance: 8,
        weldability: 8,
        machinability: 6
      },
      advantages: ['Excellent corrosion resistance', 'Food grade safe', 'Good appearance'],
      disadvantages: ['Higher cost', 'Work hardening during cutting'],
      cuttingParameters: { recommendedPower: 2500, recommendedSpeed: 3000, gasType: 'nitrogen' }
    },
    {
      material: 'Stainless Steel',
      grade: '316L',
      suitabilityScore: 0,
      costPerUnit: 12.00,
      cuttingDifficulty: 'medium',
      properties: {
        tensileStrength: 485,
        yieldStrength: 170,
        corrosionResistance: 9,
        weldability: 9,
        machinability: 6
      },
      advantages: ['Superior corrosion resistance', 'Marine grade', 'Excellent weldability'],
      disadvantages: ['High cost', 'Lower strength than 304'],
      cuttingParameters: { recommendedPower: 2500, recommendedSpeed: 2800, gasType: 'nitrogen' }
    },
    {
      material: 'Aluminum',
      grade: '6061-T6',
      suitabilityScore: 0,
      costPerUnit: 6.20,
      cuttingDifficulty: 'easy',
      properties: {
        tensileStrength: 310,
        yieldStrength: 275,
        corrosionResistance: 7,
        weldability: 7,
        machinability: 9
      },
      advantages: ['Lightweight', 'Good strength-to-weight ratio', 'Excellent machinability'],
      disadvantages: ['Lower strength than steel', 'Requires special welding'],
      cuttingParameters: { recommendedPower: 1800, recommendedSpeed: 6000, gasType: 'nitrogen' }
    },
    {
      material: 'Aluminum',
      grade: '5052-H32',
      suitabilityScore: 0,
      costPerUnit: 5.80,
      cuttingDifficulty: 'easy',
      properties: {
        tensileStrength: 230,
        yieldStrength: 195,
        corrosionResistance: 8,
        weldability: 8,
        machinability: 8
      },
      advantages: ['Excellent corrosion resistance', 'Good formability', 'Marine applications'],
      disadvantages: ['Lower strength', 'Not heat treatable'],
      cuttingParameters: { recommendedPower: 1600, recommendedSpeed: 7000, gasType: 'nitrogen' }
    },
    {
      material: 'Mild Steel',
      grade: '1018',
      suitabilityScore: 0,
      costPerUnit: 2.80,
      cuttingDifficulty: 'easy',
      properties: {
        tensileStrength: 440,
        yieldStrength: 370,
        corrosionResistance: 3,
        weldability: 9,
        machinability: 9
      },
      advantages: ['Good strength', 'Excellent machinability', 'Low cost'],
      disadvantages: ['Poor corrosion resistance', 'Requires surface treatment'],
      cuttingParameters: { recommendedPower: 2200, recommendedSpeed: 4500, gasType: 'oxygen' }
    }
  ];

  calculate(inputs: MaterialSelectionInputs): MaterialSelectionResults {
    // Input validation
    this.validateInputs(inputs);

    // Calculate suitability scores for all materials
    const scoredMaterials = this.materialDatabase.map(material => ({
      ...material,
      suitabilityScore: this.calculateSuitabilityScore(material, inputs)
    }));

    // Sort by suitability score
    const sortedMaterials = scoredMaterials.sort((a, b) => b.suitabilityScore - a.suitabilityScore);

    // Get top recommendations
    const recommendedMaterials = sortedMaterials.slice(0, 5);

    // Find best options
    const bestOverall = sortedMaterials[0];
    const bestValue = this.findBestValue(sortedMaterials, inputs);
    const bestPerformance = this.findBestPerformance(sortedMaterials);

    // Calculate comparison ranges
    const comparison = this.calculateComparison(recommendedMaterials);

    // Generate application guidance
    const applicationGuidance = this.generateApplicationGuidance(inputs, recommendedMaterials);

    // Generate recommendations
    const recommendations = this.generateRecommendations(inputs, recommendedMaterials);

    return {
      recommendedMaterials,
      bestOverall,
      bestValue,
      bestPerformance,
      comparison,
      applicationGuidance,
      recommendations,
      keyMetrics: {
        'Best Overall': `${bestOverall.material} ${bestOverall.grade}`,
        'Suitability Score': `${bestOverall.suitabilityScore.toFixed(1)}/100`,
        'Cost per Unit': `$${bestOverall.costPerUnit.toFixed(2)}`,
        'Cutting Difficulty': bestOverall.cuttingDifficulty
      },
      sensitivityAnalysis: this.performSensitivityAnalysis(inputs)
    };
  }

  private validateInputs(inputs: MaterialSelectionInputs): void {
    if (inputs.thickness <= 0) {
      throw new Error('Thickness must be greater than 0');
    }
    if (inputs.quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }
    if (inputs.budget <= 0) {
      throw new Error('Budget must be greater than 0');
    }
  }

  private calculateSuitabilityScore(material: MaterialOption, inputs: MaterialSelectionInputs): number {
    let score = 0;
    const weights = {
      strength: 20,
      corrosionResistance: 20,
      weldability: 15,
      machinability: 15,
      cost: 20,
      cuttingDifficulty: 10
    };

    // Strength score
    const strengthScore = this.getPropertyScore(inputs.requiredProperties.strength, material.properties.tensileStrength / 100);
    score += strengthScore * weights.strength;

    // Corrosion resistance score
    const corrosionScore = this.getPropertyScore(inputs.requiredProperties.corrosionResistance, material.properties.corrosionResistance);
    score += corrosionScore * weights.corrosionResistance;

    // Weldability score
    const weldabilityScore = this.getPropertyScore(inputs.requiredProperties.weldability, material.properties.weldability);
    score += weldabilityScore * weights.weldability;

    // Machinability score
    const machinabilityScore = this.getPropertyScore(inputs.requiredProperties.machinability, material.properties.machinability);
    score += machinabilityScore * weights.machinability;

    // Cost score (inverse - lower cost = higher score)
    const costRatio = inputs.budget / material.costPerUnit;
    const costScore = Math.min(10, costRatio * 2);
    const costWeight = this.getRequirementWeight(inputs.requiredProperties.costSensitivity);
    score += costScore * weights.cost * costWeight;

    // Cutting difficulty score
    const difficultyScore = material.cuttingDifficulty === 'easy' ? 10 : 
                           material.cuttingDifficulty === 'medium' ? 7 : 4;
    score += difficultyScore * weights.cuttingDifficulty;

    // Environment bonus/penalty
    score += this.getEnvironmentScore(material, inputs.environment);

    // Laser compatibility bonus
    score += this.getLaserCompatibilityScore(material, inputs.laserType);

    return Math.max(0, Math.min(100, score));
  }

  private getPropertyScore(requirement: string, propertyValue: number): number {
    const requirementValues = {
      'low': 3,
      'medium': 5,
      'high': 7,
      'critical': 9
    };

    const requiredValue = requirementValues[requirement];
    if (propertyValue >= requiredValue) {
      return 10;
    } else {
      return (propertyValue / requiredValue) * 10;
    }
  }

  private getRequirementWeight(requirement: string): number {
    const weights = {
      'low': 0.5,
      'medium': 1.0,
      'high': 1.5,
      'critical': 2.0
    };
    return weights[requirement] || 1.0;
  }

  private getEnvironmentScore(material: MaterialOption, environment: string): number {
    const environmentRequirements = {
      'indoor': { corrosionResistance: 3 },
      'outdoor': { corrosionResistance: 6 },
      'marine': { corrosionResistance: 8 },
      'chemical': { corrosionResistance: 9 },
      'high_temp': { strength: 400 }
    };

    const requirements = environmentRequirements[environment];
    if (!requirements) return 0;

    let bonus = 0;
    if (requirements.corrosionResistance && material.properties.corrosionResistance >= requirements.corrosionResistance) {
      bonus += 5;
    }
    if (requirements.strength && material.properties.tensileStrength >= requirements.strength) {
      bonus += 5;
    }

    return bonus;
  }

  private getLaserCompatibilityScore(material: MaterialOption, laserType: string): number {
    const compatibility = {
      'fiber': {
        'Carbon Steel': 5,
        'Stainless Steel': 4,
        'Aluminum': 3,
        'Mild Steel': 5
      },
      'co2': {
        'Carbon Steel': 4,
        'Stainless Steel': 3,
        'Aluminum': 5,
        'Mild Steel': 4
      }
    };

    return compatibility[laserType]?.[material.material] || 3;
  }

  private findBestValue(materials: MaterialOption[], inputs: MaterialSelectionInputs): MaterialOption {
    return materials.reduce((best, current) => {
      const currentValue = current.suitabilityScore / current.costPerUnit;
      const bestValue = best.suitabilityScore / best.costPerUnit;
      return currentValue > bestValue ? current : best;
    });
  }

  private findBestPerformance(materials: MaterialOption[]): MaterialOption {
    return materials.reduce((best, current) => {
      const currentPerformance = current.properties.tensileStrength + current.properties.corrosionResistance * 50;
      const bestPerformance = best.properties.tensileStrength + best.properties.corrosionResistance * 50;
      return currentPerformance > bestPerformance ? current : best;
    });
  }

  private calculateComparison(materials: MaterialOption[]): any {
    const costs = materials.map(m => m.costPerUnit);
    const strengths = materials.map(m => m.properties.tensileStrength);
    const suitabilities = materials.map(m => m.suitabilityScore);

    return {
      costRange: { min: Math.min(...costs), max: Math.max(...costs) },
      strengthRange: { min: Math.min(...strengths), max: Math.max(...strengths) },
      suitabilityRange: { min: Math.min(...suitabilities), max: Math.max(...suitabilities) }
    };
  }

  private generateApplicationGuidance(inputs: MaterialSelectionInputs, materials: MaterialOption[]): any {
    const criticalFactors: string[] = [];
    const alternativeOptions: string[] = [];
    const designConsiderations: string[] = [];

    // Identify critical factors
    Object.entries(inputs.requiredProperties).forEach(([property, level]) => {
      if (level === 'critical') {
        criticalFactors.push(`${property} is critical for this application`);
      }
    });

    // Alternative options
    if (inputs.environment === 'marine' || inputs.environment === 'chemical') {
      alternativeOptions.push('Consider specialized coatings for enhanced protection');
    }
    if (inputs.requiredProperties.strength === 'critical') {
      alternativeOptions.push('Consider heat treatment for improved strength');
    }

    // Design considerations
    designConsiderations.push('Verify material availability and lead times');
    designConsiderations.push('Consider joining methods and compatibility');
    designConsiderations.push('Evaluate total lifecycle costs including maintenance');

    return { criticalFactors, alternativeOptions, designConsiderations };
  }

  private generateRecommendations(inputs: MaterialSelectionInputs, materials: MaterialOption[]): string[] {
    const recommendations: string[] = [];

    const topMaterial = materials[0];

    // Cost recommendations
    if (topMaterial.costPerUnit > inputs.budget) {
      recommendations.push('Top material exceeds budget - consider alternatives or increase budget');
    }

    // Environment recommendations
    if (inputs.environment === 'outdoor' && topMaterial.properties.corrosionResistance < 6) {
      recommendations.push('Consider protective coatings for outdoor applications');
    }

    // Cutting recommendations
    if (topMaterial.cuttingDifficulty === 'difficult') {
      recommendations.push('Difficult cutting material - ensure proper laser parameters and gas selection');
    }

    // Quality recommendations
    if (inputs.qualityRequirement === 'precision' && topMaterial.properties.machinability < 7) {
      recommendations.push('For precision requirements, consider materials with better machinability');
    }

    return recommendations;
  }

  private performSensitivityAnalysis(inputs: MaterialSelectionInputs): any {
    const baseResult = this.calculate(inputs);
    const budgetVariations = [0.8, 0.9, 1.1, 1.2];

    return {
      budget: budgetVariations.map(factor => {
        const modifiedInputs = { ...inputs, budget: inputs.budget * factor };
        const result = this.calculate(modifiedInputs);
        return {
          variation: `${((factor - 1) * 100).toFixed(0)}%`,
          bestMaterial: `${result.bestOverall.material} ${result.bestOverall.grade}`,
          suitabilityScore: result.bestOverall.suitabilityScore
        };
      })
    };
  }
}

export const materialSelectionAssistant = new MaterialSelectionAssistant();
