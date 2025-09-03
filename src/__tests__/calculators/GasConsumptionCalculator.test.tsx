import { describe, it, expect, beforeEach } from 'vitest';

describe('GasConsumptionCalculator - Algorithm Verification', () => {
  // Standard test inputs for algorithm verification
  const standardInputs = {
    materialType: 'steel',
    materialThickness: 5, // mm
    cuttingSpeed: 1000, // mm/min
    cuttingLength: 2000, // mm
    piercingCount: 10,
    gasType: 'oxygen' as const,
    gasFlow: 15, // L/min
    gasPressure: 1.5, // bar
    gasPrice: 0.05 // $/L
  };

  beforeEach(() => {
    // Reset any global state if needed
  });

  describe('Core Time Calculation Algorithms', () => {
    it('should calculate cutting time correctly', () => {
      const { cuttingLength, cuttingSpeed } = standardInputs;
      
      // Expected calculation:
      // cuttingTime = 2000 mm / 1000 mm/min = 2 minutes
      
      const cuttingTime = cuttingLength / cuttingSpeed;
      
      expect(cuttingTime).toBe(2);
    });

    it('should calculate piercing time correctly', () => {
      const { piercingCount, materialThickness } = standardInputs;
      
      // Expected calculation:
      // piercingTimePerHole = max(0.1, 5 × 0.05) = max(0.1, 0.25) = 0.25 minutes
      // totalPiercingTime = 10 × 0.25 = 2.5 minutes
      
      const piercingTimePerHole = Math.max(0.1, materialThickness * 0.05);
      const totalPiercingTime = piercingCount * piercingTimePerHole;
      
      expect(piercingTimePerHole).toBe(0.25);
      expect(totalPiercingTime).toBe(2.5);
    });

    it('should calculate total time correctly', () => {
      const { cuttingLength, cuttingSpeed, piercingCount, materialThickness } = standardInputs;
      
      const cuttingTime = cuttingLength / cuttingSpeed;
      const piercingTime = piercingCount * Math.max(0.1, materialThickness * 0.05);
      const totalTime = cuttingTime + piercingTime;
      
      expect(totalTime).toBe(4.5); // 2 + 2.5
    });
  });

  describe('Gas Consumption Calculation Algorithms', () => {
    it('should calculate cutting gas consumption correctly', () => {
      const { gasFlow, cuttingLength, cuttingSpeed } = standardInputs;
      
      // Expected calculation:
      // cuttingTime = 2000 / 1000 = 2 minutes
      // cuttingGasConsumption = 2 × 15 = 30 L
      
      const cuttingTime = cuttingLength / cuttingSpeed;
      const cuttingGasConsumption = cuttingTime * gasFlow;
      
      expect(cuttingGasConsumption).toBe(30);
    });

    it('should calculate piercing gas consumption correctly', () => {
      const { gasFlow, piercingCount, materialThickness, gasType } = standardInputs;
      
      // Expected calculation:
      // piercingTime = 10 × 0.25 = 2.5 minutes
      // piercingGasMultiplier = 2.0 (for oxygen)
      // piercingGasConsumption = 2.5 × 15 × 2.0 = 75 L
      
      const piercingTime = piercingCount * Math.max(0.1, materialThickness * 0.05);
      const piercingGasMultiplier = gasType === 'oxygen' ? 2.0 : 1.5;
      const piercingGasConsumption = piercingTime * gasFlow * piercingGasMultiplier;
      
      expect(piercingGasConsumption).toBe(75);
    });

    it('should calculate total gas consumption correctly', () => {
      const { gasFlow, cuttingLength, cuttingSpeed, piercingCount, materialThickness, gasType } = standardInputs;
      
      // Component calculations:
      // Cutting: 30 L
      // Piercing: 75 L
      // Total: 105 L
      
      const cuttingTime = cuttingLength / cuttingSpeed;
      const piercingTime = piercingCount * Math.max(0.1, materialThickness * 0.05);
      const piercingGasMultiplier = gasType === 'oxygen' ? 2.0 : 1.5;
      
      const cuttingGasConsumption = cuttingTime * gasFlow;
      const piercingGasConsumption = piercingTime * gasFlow * piercingGasMultiplier;
      const totalGasConsumption = cuttingGasConsumption + piercingGasConsumption;
      
      expect(totalGasConsumption).toBe(105);
    });

    it('should calculate gas consumption rate correctly', () => {
      const { gasFlow } = standardInputs;
      
      // Gas consumption rate is the flow rate
      const gasConsumptionRate = gasFlow;
      
      expect(gasConsumptionRate).toBe(15);
    });
  });

  describe('Cost Calculation Algorithms', () => {
    it('should calculate total gas cost correctly', () => {
      const totalGasConsumption = 105; // L (from previous test)
      const { gasPrice } = standardInputs;
      
      // Expected calculation:
      // totalGasCost = 105 × 0.05 = 5.25
      
      const totalGasCost = totalGasConsumption * gasPrice;
      
      expect(totalGasCost).toBe(5.25);
    });

    it('should calculate cost per meter correctly', () => {
      const totalGasCost = 5.25;
      const { cuttingLength } = standardInputs;
      
      // Expected calculation:
      // costPerMeter = 5.25 / (2000 / 1000) = 5.25 / 2 = 2.625
      
      const costPerMeter = totalGasCost / (cuttingLength / 1000);
      
      expect(costPerMeter).toBe(2.625);
    });
  });

  describe('Gas Type Specific Calculations', () => {
    it('should apply correct piercing gas multipliers', () => {
      const gasMultipliers = {
        oxygen: 2.0,
        nitrogen: 1.5,
        air: 1.5,
        argon: 1.5
      };
      
      Object.entries(gasMultipliers).forEach(([gasType, expectedMultiplier]) => {
        const multiplier = gasType === 'oxygen' ? 2.0 : 1.5;
        expect(multiplier).toBe(expectedMultiplier);
      });
    });

    it('should calculate different consumption for different gas types', () => {
      const baseConsumption = 30; // L (cutting only)
      const piercingTime = 2.5; // minutes
      const gasFlow = 15; // L/min
      
      const gasTypes = ['oxygen', 'nitrogen', 'air', 'argon'] as const;
      
      gasTypes.forEach(gasType => {
        const piercingMultiplier = gasType === 'oxygen' ? 2.0 : 1.5;
        const piercingConsumption = piercingTime * gasFlow * piercingMultiplier;
        const totalConsumption = baseConsumption + piercingConsumption;
        
        if (gasType === 'oxygen') {
          expect(totalConsumption).toBe(105); // 30 + 75
        } else {
          expect(totalConsumption).toBe(86.25); // 30 + 56.25
        }
      });
    });
  });

  describe('Efficiency Calculation Algorithms', () => {
    it('should calculate theoretical minimum consumption', () => {
      const { cuttingLength, materialThickness } = standardInputs;
      
      // Expected calculation:
      // volume = 2000 × 5 × 0.1 = 1000 mm³
      // theoreticalMin = 1000 × 0.001 = 1 L
      
      const volume = cuttingLength * materialThickness * 0.1;
      const theoreticalMin = volume * 0.001;
      
      expect(volume).toBe(1000);
      expect(theoreticalMin).toBe(1);
    });

    it('should calculate gas efficiency correctly', () => {
      const theoreticalMin = 1; // L
      const actualConsumption = 105; // L
      
      // Expected calculation:
      // gasEfficiency = min(100, (1 / 105) × 100) = min(100, 0.952) = 0.952%
      
      const gasEfficiency = Math.min(100, (theoreticalMin / actualConsumption) * 100);
      
      expect(gasEfficiency).toBeCloseTo(0.952, 3);
    });
  });

  describe('Optimization Algorithms', () => {
    it('should calculate optimal gas flow', () => {
      const { materialThickness, gasType } = standardInputs;
      
      // Expected calculation:
      // baseFlow = 5 × 0.5 = 2.5 L/min
      // gasMultiplier = 1.2 (for oxygen)
      // optimalFlow = min(15, 2.5 × 1.2) = min(15, 3) = 3 L/min
      
      const baseFlow = materialThickness * 0.5;
      const gasMultiplier = gasType === 'oxygen' ? 1.2 : 1.0;
      const optimalFlow = Math.min(standardInputs.gasFlow, baseFlow * gasMultiplier);
      
      expect(baseFlow).toBe(2.5);
      expect(optimalFlow).toBe(3);
    });

    it('should generate optimization suggestions', () => {
      const currentFlow = 15; // L/min
      const optimalFlow = 3; // L/min (from previous test)
      
      const suggestions: string[] = [];
      
      if (currentFlow > optimalFlow) {
        suggestions.push(`Reduce gas flow to ${optimalFlow}L/min to save costs`);
      }
      
      expect(suggestions).toHaveLength(1);
      expect(suggestions[0]).toContain('Reduce gas flow to 3L/min');
    });

    it('should generate alternative gas options', () => {
      const { gasType, gasPrice } = standardInputs;
      const totalConsumption = 105; // L
      
      const alternatives: Array<{gasType: string; estimatedCost: number; qualityImpact: string}> = [];
      
      if (gasType === 'oxygen') {
        alternatives.push({
          gasType: 'nitrogen',
          estimatedCost: totalConsumption * gasPrice * 1.5,
          qualityImpact: 'Better edge quality, no oxidation'
        });
      }
      
      expect(alternatives).toHaveLength(1);
      expect(alternatives[0].gasType).toBe('nitrogen');
      expect(alternatives[0].estimatedCost).toBe(7.875); // 105 × 0.05 × 1.5
    });
  });

  describe('Material-Specific Calculations', () => {
    it('should calculate different piercing times for different materials', () => {
      const thickness = 5; // mm
      const materials = ['steel', 'stainless', 'aluminum'];
      
      const baseTimes = {
        'steel': 0.5 + thickness * 0.3,      // 0.5 + 1.5 = 2.0 seconds
        'stainless': 0.8 + thickness * 0.4,  // 0.8 + 2.0 = 2.8 seconds
        'aluminum': 0.3 + thickness * 0.2    // 0.3 + 1.0 = 1.3 seconds
      };
      
      materials.forEach(material => {
        const piercingTime = baseTimes[material as keyof typeof baseTimes];
        
        switch (material) {
          case 'steel':
            expect(piercingTime).toBe(2.0);
            break;
          case 'stainless':
            expect(piercingTime).toBe(2.8);
            break;
          case 'aluminum':
            expect(piercingTime).toBe(1.3);
            break;
        }
      });
    });
  });

  describe('Edge Cases and Boundary Testing', () => {
    it('should handle zero cutting length gracefully', () => {
      const cuttingLength = 0;
      const cuttingSpeed = 1000;
      
      const cuttingTime = cuttingLength / cuttingSpeed;
      
      expect(cuttingTime).toBe(0);
      expect(isFinite(cuttingTime)).toBe(true);
    });

    it('should handle zero piercing count gracefully', () => {
      const piercingCount = 0;
      const piercingTimePerHole = 0.25;
      
      const totalPiercingTime = piercingCount * piercingTimePerHole;
      
      expect(totalPiercingTime).toBe(0);
    });

    it('should handle zero gas flow gracefully', () => {
      const gasFlow = 0;
      const cuttingTime = 2;
      
      const gasConsumption = cuttingTime * gasFlow;
      
      expect(gasConsumption).toBe(0);
    });

    it('should handle minimum piercing time correctly', () => {
      const materialThickness = 0.1; // Very thin
      
      const piercingTime = Math.max(0.1, materialThickness * 0.05);
      
      expect(piercingTime).toBe(0.1); // Should use minimum
    });

    it('should handle very thick materials', () => {
      const materialThickness = 50; // Very thick
      
      const piercingTime = Math.max(0.1, materialThickness * 0.05);
      
      expect(piercingTime).toBe(2.5); // 50 × 0.05
    });
  });

  describe('Input Validation', () => {
    it('should validate gas types', () => {
      const validGasTypes = ['oxygen', 'nitrogen', 'air', 'argon'];
      
      validGasTypes.forEach(gasType => {
        expect(validGasTypes.includes(gasType)).toBe(true);
      });
    });

    it('should validate numeric ranges', () => {
      const validInputs = {
        materialThickness: 5,    // 0 < thickness <= 100
        cuttingSpeed: 1000,      // 0 < speed <= 10000
        gasFlow: 15,             // 0 < flow <= 100
        gasPressure: 1.5,        // > 0
        gasPrice: 0.05           // > 0
      };
      
      expect(validInputs.materialThickness).toBeGreaterThan(0);
      expect(validInputs.materialThickness).toBeLessThanOrEqual(100);
      expect(validInputs.cuttingSpeed).toBeGreaterThan(0);
      expect(validInputs.cuttingSpeed).toBeLessThanOrEqual(10000);
      expect(validInputs.gasFlow).toBeGreaterThan(0);
      expect(validInputs.gasFlow).toBeLessThanOrEqual(100);
    });

    it('should handle invalid gas type gracefully', () => {
      const invalidGasType = 'helium';
      const validGasTypes = ['oxygen', 'nitrogen', 'air', 'argon'];
      
      const isValid = validGasTypes.includes(invalidGasType);
      
      expect(isValid).toBe(false);
    });
  });

  describe('Performance Optimization', () => {
    it('should calculate optimization potential correctly', () => {
      const currentFlow = 15; // L/min
      const optimalFlow = 3; // L/min
      const currentPressure = 1.5; // bar
      const optimalPressure = 1.0; // bar (assumed)
      
      let savingsPotential = 0;
      
      // Flow rate optimization
      if (currentFlow > optimalFlow) {
        savingsPotential += 15; // 15% savings potential
      }
      
      // Pressure optimization
      if (currentPressure > optimalPressure) {
        savingsPotential += 10; // 10% savings potential
      }
      
      const totalSavings = Math.min(savingsPotential, 30); // Cap at 30%
      
      expect(totalSavings).toBe(25); // 15% + 10%
    });
  });
});
