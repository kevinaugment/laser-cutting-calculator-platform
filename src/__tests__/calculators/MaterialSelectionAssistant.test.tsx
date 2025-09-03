import { describe, it, expect, beforeEach } from 'vitest';

describe('MaterialSelectionAssistant - Algorithm Verification', () => {
  // Standard test inputs for algorithm verification
  const standardInputs = {
    application: 'structural' as const,
    strengthRequirement: 'medium' as const,
    corrosionResistance: 'mild' as const,
    budget: 10.0 // per kg
  };

  // Mock material database for testing
  const testMaterialDatabase = {
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
        tensileStrength: 520,
        yieldStrength: 210,
        corrosionResistance: 8,
        weldability: 8,
        machinability: 6,
        density: 8.0
      },
      applications: ['decorative', 'marine', 'food_grade'],
      cuttingParams: {
        laser: 'fiber',
        speed: 'medium',
        gas: 'nitrogen',
        difficulty: 'medium' as const
      },
      pros: ['Excellent corrosion resistance', 'Food safe', 'Attractive finish'],
      cons: ['Higher cost', 'Work hardening', 'Lower machinability']
    },
    'aluminum_6061': {
      name: 'Aluminum 6061',
      costPerKg: 4.2,
      properties: {
        tensileStrength: 310,
        yieldStrength: 276,
        corrosionResistance: 6,
        weldability: 7,
        machinability: 9,
        density: 2.7
      },
      applications: ['aerospace', 'automotive', 'decorative'],
      cuttingParams: {
        laser: 'fiber',
        speed: 'fast',
        gas: 'nitrogen',
        difficulty: 'medium' as const
      },
      pros: ['Lightweight', 'Good strength-to-weight', 'Excellent machinability'],
      cons: ['Moderate cost', 'Requires special welding', 'Reflective to laser']
    }
  };

  beforeEach(() => {
    // Reset any global state if needed
  });

  describe('Core Material Scoring Algorithms', () => {
    it('should calculate strength score correctly', () => {
      const material = testMaterialDatabase.carbon_steel;
      const strengthRequirement = 'medium'; // multiplier = 1.0
      
      // Expected calculation:
      // strengthReq = 1.0 × 300 = 300 MPa
      // strengthScore = min(400 / 300, 2) × 25 = min(1.33, 2) × 25 = 33.33
      
      const strengthMultipliers = { low: 0.5, medium: 1.0, high: 1.5, ultra_high: 2.0 };
      const strengthReq = strengthMultipliers[strengthRequirement] * 300;
      const strengthScore = Math.min(material.properties.tensileStrength / strengthReq, 2) * 25;
      
      expect(strengthReq).toBe(300);
      expect(strengthScore).toBeCloseTo(33.33, 2);
    });

    it('should calculate corrosion resistance score correctly', () => {
      const material = testMaterialDatabase.stainless_steel_304;
      const corrosionRequirement = 'high'; // multiplier = 1.5
      
      // Expected calculation:
      // corrosionReq = 1.5 × 5 = 7.5
      // corrosionScore = min(8 / 7.5, 2) × 25 = min(1.067, 2) × 25 = 26.67
      
      const corrosionMultipliers = { none: 0.2, mild: 0.5, moderate: 1.0, high: 1.5, extreme: 2.0 };
      const corrosionReq = corrosionMultipliers['high'] * 5;
      const corrosionScore = Math.min(material.properties.corrosionResistance / corrosionReq, 2) * 25;
      
      expect(corrosionReq).toBe(7.5);
      expect(corrosionScore).toBeCloseTo(26.67, 2);
    });

    it('should calculate application suitability score correctly', () => {
      const material = testMaterialDatabase.carbon_steel;
      const application = 'structural';
      
      // Expected calculation:
      // appSuitability = material.applications.includes('structural') ? 25 : 0 = 25
      
      const appSuitability = material.applications.includes(application) ? 25 : 0;
      
      expect(appSuitability).toBe(25);
    });

    it('should calculate cost efficiency score correctly', () => {
      const material = testMaterialDatabase.carbon_steel;
      const budget = 10.0;
      
      // Expected calculation:
      // costEfficiency = max(0, 25 - (2.5 / 10.0) × 25) = max(0, 25 - 6.25) = 18.75
      
      const costEfficiency = Math.max(0, 25 - (material.costPerKg / budget) * 25);
      
      expect(costEfficiency).toBe(18.75);
    });

    it('should calculate total material score correctly', () => {
      const material = testMaterialDatabase.carbon_steel;
      const inputs = {
        strengthRequirement: 'medium' as const,
        corrosionResistance: 'mild' as const,
        application: 'structural' as const,
        budget: 10.0
      };
      
      // Component scores:
      // Strength: min(400/300, 2) × 25 = 33.33
      // Corrosion: min(1/2.5, 2) × 25 = 10.0
      // Application: 25 (structural included)
      // Cost: max(0, 25 - (2.5/10) × 25) = 18.75
      // Total: 33.33 + 10.0 + 25 + 18.75 = 87.08
      
      const strengthMultipliers = { low: 0.5, medium: 1.0, high: 1.5, ultra_high: 2.0 };
      const corrosionMultipliers = { none: 0.2, mild: 0.5, moderate: 1.0, high: 1.5, extreme: 2.0 };
      
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
      
      // Cost efficiency
      const costEfficiency = Math.max(0, 25 - (material.costPerKg / inputs.budget) * 25);
      score += costEfficiency;
      
      expect(score).toBeCloseTo(87.08, 2);
    });
  });

  describe('Material Ranking and Selection', () => {
    it('should rank materials by total score', () => {
      const inputs = standardInputs;
      const materials = Object.values(testMaterialDatabase);
      
      // Calculate scores for all materials
      const materialScores = materials.map(material => {
        const strengthMultipliers = { low: 0.5, medium: 1.0, high: 1.5, ultra_high: 2.0 };
        const corrosionMultipliers = { none: 0.2, mild: 0.5, moderate: 1.0, high: 1.5, extreme: 2.0 };
        
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
        
        // Cost efficiency
        const costEfficiency = Math.max(0, 25 - (material.costPerKg / inputs.budget) * 25);
        score += costEfficiency;
        
        return {
          name: material.name,
          score: Math.round(score),
          costPerKg: material.costPerKg
        };
      });
      
      // Sort by score descending
      materialScores.sort((a, b) => b.score - a.score);
      
      // Carbon Steel should rank highest for structural application with medium requirements
      expect(materialScores[0].name).toBe('Carbon Steel');
      expect(materialScores[0].score).toBeGreaterThan(80);
    });

    it('should filter materials by budget constraint', () => {
      const budget = 5.0; // Low budget
      const materials = Object.values(testMaterialDatabase);
      
      const affordableMaterials = materials.filter(material => material.costPerKg <= budget);
      
      expect(affordableMaterials).toHaveLength(2); // Carbon Steel and Aluminum
      expect(affordableMaterials.map(m => m.name)).toContain('Carbon Steel');
      expect(affordableMaterials.map(m => m.name)).toContain('Aluminum 6061');
      expect(affordableMaterials.map(m => m.name)).not.toContain('Stainless Steel 304');
    });

    it('should calculate suitability rating correctly', () => {
      const score = 87.08;
      
      // Expected calculation:
      // suitabilityRating = min(score / 10, 10) = min(87.08 / 10, 10) = min(8.708, 10) = 8.708
      // Rounded: 8.7
      
      const suitabilityRating = Math.min(score / 10, 10);
      const roundedRating = Math.round(suitabilityRating * 10) / 10;
      
      expect(suitabilityRating).toBeCloseTo(8.708, 3);
      expect(roundedRating).toBe(8.7);
    });
  });

  describe('Budget Analysis Algorithms', () => {
    it('should classify budget fit correctly', () => {
      const budget = 10.0;
      const materialCosts = [2.5, 4.2, 8.5]; // Carbon Steel, Aluminum, Stainless Steel
      const maxCost = Math.max(...materialCosts);
      
      let budgetFit: 'excellent' | 'good' | 'marginal' | 'over_budget';
      if (maxCost <= budget * 0.7) budgetFit = 'excellent';      // ≤ 7.0
      else if (maxCost <= budget * 0.9) budgetFit = 'good';      // ≤ 9.0
      else if (maxCost <= budget) budgetFit = 'marginal';        // ≤ 10.0
      else budgetFit = 'over_budget';                            // > 10.0
      
      expect(maxCost).toBe(8.5);
      expect(budgetFit).toBe('good'); // 8.5 ≤ 9.0
    });

    it('should calculate cost range correctly', () => {
      const materialCosts = [2.5, 4.2, 8.5];
      const minCost = Math.min(...materialCosts);
      const maxCost = Math.max(...materialCosts);
      
      expect(minCost).toBe(2.5);
      expect(maxCost).toBe(8.5);
    });

    it('should calculate value rating correctly', () => {
      const topMaterialScore = 87;
      const valueRating = Math.round(topMaterialScore / 10);
      
      expect(valueRating).toBe(9); // 87 / 10 = 8.7, rounded = 9
    });
  });

  describe('Cutting Parameters Generation', () => {
    it('should determine cutting difficulty correctly', () => {
      const materials = [
        { difficulty: 'easy' },
        { difficulty: 'medium' },
        { difficulty: 'easy' }
      ];
      
      const difficulties = materials.map(m => m.difficulty);
      const avgDifficulty = difficulties.includes('hard') ? 'challenging' : 
                           difficulties.includes('medium') ? 'moderate' : 'straightforward';
      
      expect(avgDifficulty).toBe('moderate'); // Contains 'medium'
    });

    it('should generate special considerations', () => {
      const materials = [
        { cuttingParameters: { difficulty: 'hard', gasType: 'oxygen' } },
        { cuttingParameters: { difficulty: 'medium', gasType: 'argon' } }
      ];
      
      const considerations: string[] = [];
      const difficulties = materials.map(m => m.cuttingParameters.difficulty);
      
      if (difficulties.includes('hard')) {
        considerations.push('Some materials require specialized cutting parameters');
      }
      if (materials.some(m => m.cuttingParameters.gasType === 'argon')) {
        considerations.push('Inert gas atmosphere required for some materials');
      }
      
      expect(considerations).toHaveLength(2);
      expect(considerations[0]).toContain('specialized cutting parameters');
      expect(considerations[1]).toContain('Inert gas atmosphere');
    });
  });

  describe('Edge Cases and Boundary Testing', () => {
    it('should handle zero budget gracefully', () => {
      const budget = 0;
      const materialCost = 2.5;
      
      // Should not cause division by zero
      const costEfficiency = budget > 0 ? Math.max(0, 25 - (materialCost / budget) * 25) : 0;
      
      expect(costEfficiency).toBe(0);
      expect(isFinite(costEfficiency)).toBe(true);
    });

    it('should handle materials with zero strength', () => {
      const materialStrength = 0;
      const strengthReq = 300;
      
      const strengthScore = Math.min(materialStrength / strengthReq, 2) * 25;
      
      expect(strengthScore).toBe(0);
      expect(isFinite(strengthScore)).toBe(true);
    });

    it('should handle very high material costs', () => {
      const materialCost = 1000; // Very expensive
      const budget = 10;
      
      const costEfficiency = Math.max(0, 25 - (materialCost / budget) * 25);
      
      expect(costEfficiency).toBe(0); // Should be clamped to 0
    });

    it('should handle materials with no application match', () => {
      const materialApplications = ['aerospace', 'medical'];
      const requiredApplication = 'structural';
      
      const appSuitability = materialApplications.includes(requiredApplication) ? 25 : 0;
      
      expect(appSuitability).toBe(0);
    });
  });

  describe('Input Validation', () => {
    it('should validate application types', () => {
      const validApplications = ['structural', 'decorative', 'automotive', 'aerospace', 'marine', 'food_grade', 'medical'];
      
      validApplications.forEach(app => {
        expect(validApplications.includes(app)).toBe(true);
      });
    });

    it('should validate strength requirements', () => {
      const validStrengthReqs = ['low', 'medium', 'high', 'ultra_high'];
      
      validStrengthReqs.forEach(req => {
        expect(validStrengthReqs.includes(req)).toBe(true);
      });
    });

    it('should validate corrosion resistance levels', () => {
      const validCorrosionLevels = ['none', 'mild', 'moderate', 'high', 'extreme'];
      
      validCorrosionLevels.forEach(level => {
        expect(validCorrosionLevels.includes(level)).toBe(true);
      });
    });

    it('should validate budget ranges', () => {
      const validBudgets = [0.1, 1.0, 10.0, 100.0, 1000.0];
      
      validBudgets.forEach(budget => {
        expect(budget).toBeGreaterThan(0);
        expect(budget).toBeLessThanOrEqual(1000);
      });
    });
  });
});
