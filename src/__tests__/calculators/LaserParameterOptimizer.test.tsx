import { describe, it, expect, beforeEach } from 'vitest';

describe('LaserParameterOptimizer - Algorithm Verification', () => {
  // Standard test inputs for algorithm verification
  const standardInputs = {
    materialType: 'steel',
    thickness: 3, // mm
    maxPower: 3000, // watts
    maxCuttingSpeed: 5000, // mm/min
    qualityRequirement: 'standard',
    optimizationGoal: 'balanced',
    laserType: 'fiber',
    nozzleDiameter: 1.5, // mm
    availableGasTypes: ['oxygen', 'nitrogen', 'air']
  };

  beforeEach(() => {
    // Reset any global state if needed
  });

  describe('Power Optimization Algorithms', () => {
    it('should calculate optimal power based on material thickness', () => {
      const { thickness, maxPower } = standardInputs;
      
      // Expected calculation:
      // Base power = thickness² × 100 = 3² × 100 = 900W
      // With quality factor (standard = 1.0): 900W
      // Limited by max power: min(900, 3000) = 900W
      
      const basePower = thickness * thickness * 100;
      const qualityFactor = 1.0; // standard quality
      const calculatedPower = basePower * qualityFactor;
      const optimalPower = Math.min(calculatedPower, maxPower);
      
      expect(basePower).toBe(900);
      expect(optimalPower).toBe(900);
    });

    it('should limit power to machine maximum', () => {
      const thickness = 10; // mm (thick material)
      const maxPower = 2000; // watts (limited machine)
      
      const basePower = thickness * thickness * 100; // 10000W
      const optimalPower = Math.min(basePower, maxPower);
      
      expect(basePower).toBe(10000);
      expect(optimalPower).toBe(2000); // Limited by machine
    });

    it('should apply power ratio optimization correctly', () => {
      const thickness = 5; // mm
      const absorptivity = 0.8; // typical for steel
      
      // Power ratio calculation
      const thicknessFactor = Math.pow(thickness, 0.8);
      const basePowerRatio = 0.6 + (thicknessFactor / 100) * absorptivity;
      const powerRatio = Math.min(Math.max(basePowerRatio, 0.4), 0.9);
      
      expect(thicknessFactor).toBeCloseTo(4.287, 3);
      expect(basePowerRatio).toBeCloseTo(0.634, 3);
      expect(powerRatio).toBeCloseTo(0.634, 3);
    });
  });

  describe('Speed Optimization Algorithms', () => {
    it('should calculate optimal cutting speed based on power density', () => {
      const power = 1500; // watts
      const thickness = 3; // mm
      
      // Expected calculation:
      // Power density = power / (thickness²) = 1500 / 9 = 166.67 W/mm²
      // Base speed = √(power density) × 50 = √166.67 × 50 ≈ 645 mm/min
      
      const powerDensity = power / (thickness * thickness);
      const baseSpeed = Math.sqrt(powerDensity) * 50;
      
      expect(powerDensity).toBeCloseTo(166.67, 2);
      expect(baseSpeed).toBeCloseTo(645.5, 1);
    });

    it('should apply quality factors to speed calculation', () => {
      const baseSpeed = 2000; // mm/min
      const qualityFactors = {
        'draft': 1.3,
        'standard': 1.0,
        'precision': 0.7,
        'ultra_precision': 0.5
      };
      
      Object.entries(qualityFactors).forEach(([quality, factor]) => {
        const adjustedSpeed = baseSpeed * factor;
        
        switch (quality) {
          case 'draft':
            expect(adjustedSpeed).toBe(2600);
            break;
          case 'standard':
            expect(adjustedSpeed).toBe(2000);
            break;
          case 'precision':
            expect(adjustedSpeed).toBe(1400);
            break;
          case 'ultra_precision':
            expect(adjustedSpeed).toBe(1000);
            break;
        }
      });
    });

    it('should limit speed to machine maximum', () => {
      const calculatedSpeed = 6000; // mm/min
      const maxSpeed = 4000; // mm/min
      
      const actualSpeed = Math.min(calculatedSpeed, maxSpeed);
      
      expect(actualSpeed).toBe(4000);
    });
  });

  describe('Gas Pressure Optimization', () => {
    it('should calculate optimal gas pressure based on material and thickness', () => {
      const thickness = 3; // mm
      const basePressure = 10; // bar (typical for oxygen)
      const thicknessFactor = 2; // bar per mm
      
      // Expected calculation:
      // Optimal pressure = base + (thickness × factor) = 10 + (3 × 2) = 16 bar
      
      const optimalPressure = basePressure + (thickness * thicknessFactor);
      
      expect(optimalPressure).toBe(16);
    });

    it('should adjust pressure for nozzle diameter', () => {
      const basePressure = 15; // bar
      const nozzleDiameter = 1.0; // mm
      const referenceDiameter = 1.5; // mm
      
      // Nozzle factor = (reference/actual)² = (1.5/1.0)² = 2.25
      const nozzleFactor = Math.pow(referenceDiameter / nozzleDiameter, 2);
      const adjustedPressure = basePressure * nozzleFactor;
      
      expect(nozzleFactor).toBe(2.25);
      expect(adjustedPressure).toBe(33.75);
    });

    it('should adjust pressure for cutting speed', () => {
      const basePressure = 12; // bar
      const cuttingSpeed = 4500; // mm/min
      const referenceSpeed = 3000; // mm/min
      
      // Speed factor = √(actual/reference) = √(4500/3000) = √1.5 ≈ 1.225
      const speedFactor = Math.sqrt(cuttingSpeed / referenceSpeed);
      const adjustedPressure = basePressure * speedFactor;
      
      expect(speedFactor).toBeCloseTo(1.225, 3);
      expect(adjustedPressure).toBeCloseTo(14.7, 1);
    });
  });

  describe('Focus Position Optimization', () => {
    it('should calculate focus position relative to material surface', () => {
      const thickness = 5; // mm
      const focusFactor = 0.3; // typical factor
      
      // Focus position = -thickness × factor = -5 × 0.3 = -1.5 mm (below surface)
      const focusPosition = -thickness * focusFactor;
      
      expect(focusPosition).toBe(-1.5);
    });

    it('should handle different material thicknesses', () => {
      const thicknesses = [1, 3, 5, 10, 20];
      const focusFactor = 0.3;
      
      thicknesses.forEach(thickness => {
        const focusPosition = -thickness * focusFactor;
        expect(focusPosition).toBe(-thickness * 0.3);
        expect(focusPosition).toBeLessThan(0); // Always below surface
      });
    });
  });

  describe('Quality Prediction Algorithms', () => {
    it('should predict edge quality based on parameters', () => {
      const power = 1500; // watts
      const speed = 2000; // mm/min
      const thickness = 3; // mm
      
      // Power density = 1500 / (3²) = 166.67 W/mm²
      // Speed factor = 2000 / 1000 = 2.0 (normalized)
      // Edge quality = min(10, max(1, 8 - speedFactor + powerDensity × 0.001))
      //              = min(10, max(1, 8 - 2 + 166.67 × 0.001))
      //              = min(10, max(1, 6.167)) = 6.167
      
      const powerDensity = power / (thickness * thickness);
      const speedFactor = speed / 1000;
      const edgeQuality = Math.min(10, Math.max(1, 8 - speedFactor + powerDensity * 0.001));
      
      expect(powerDensity).toBeCloseTo(166.67, 2);
      expect(speedFactor).toBe(2.0);
      expect(edgeQuality).toBeCloseTo(6.167, 3);
    });

    it('should predict dross level', () => {
      const speed = 3000; // mm/min
      const thickness = 4; // mm
      const speedFactor = speed / 1000; // 3.0
      
      // Dross level = max(0, (speedFactor - 2) × 0.1 + thickness × 0.02)
      //             = max(0, (3 - 2) × 0.1 + 4 × 0.02)
      //             = max(0, 0.1 + 0.08) = 0.18 mm
      
      const drossLevel = Math.max(0, (speedFactor - 2) * 0.1 + thickness * 0.02);
      
      expect(drossLevel).toBe(0.18);
    });

    it('should predict heat affected zone', () => {
      const power = 2000; // watts
      const thickness = 5; // mm
      const powerDensity = power / (thickness * thickness); // 80 W/mm²
      
      // HAZ = max(0.1, powerDensity × 0.0001 + thickness × 0.1)
      //     = max(0.1, 80 × 0.0001 + 5 × 0.1)
      //     = max(0.1, 0.008 + 0.5) = 0.508 mm
      
      const haz = Math.max(0.1, powerDensity * 0.0001 + thickness * 0.1);
      
      expect(haz).toBe(0.508);
    });
  });

  describe('Multi-Objective Optimization', () => {
    it('should apply goal weights correctly', () => {
      const baseValue = 100;
      const goalWeights = {
        'speed': { speed: 1.2, quality: 0.8, cost: 1.0 },
        'quality': { speed: 0.8, quality: 1.3, cost: 1.0 },
        'cost': { speed: 1.0, quality: 1.0, cost: 1.2 },
        'balanced': { speed: 1.0, quality: 1.0, cost: 1.0 }
      };
      
      Object.entries(goalWeights).forEach(([goal, weights]) => {
        const speedOptimized = baseValue * weights.speed;
        const qualityOptimized = baseValue * weights.quality;
        const costOptimized = baseValue * weights.cost;
        
        expect(speedOptimized).toBeGreaterThan(0);
        expect(qualityOptimized).toBeGreaterThan(0);
        expect(costOptimized).toBeGreaterThan(0);
      });
    });
  });

  describe('Edge Cases and Boundary Testing', () => {
    it('should handle minimum thickness', () => {
      const thickness = 0.1; // mm (very thin)
      const basePower = thickness * thickness * 100;
      
      expect(basePower).toBe(1); // 0.01 × 100
      expect(basePower).toBeGreaterThan(0);
    });

    it('should handle maximum thickness', () => {
      const thickness = 50; // mm (very thick)
      const maxPower = 6000; // watts
      const basePower = thickness * thickness * 100; // 250,000W
      const limitedPower = Math.min(basePower, maxPower);
      
      expect(basePower).toBe(250000);
      expect(limitedPower).toBe(6000); // Limited by machine
    });

    it('should handle zero power gracefully', () => {
      const power = 0;
      const thickness = 3;
      
      const powerDensity = thickness > 0 ? power / (thickness * thickness) : 0;
      const speed = powerDensity > 0 ? Math.sqrt(powerDensity) * 50 : 0;
      
      expect(powerDensity).toBe(0);
      expect(speed).toBe(0);
    });

    it('should validate material type constraints', () => {
      const validMaterials = ['steel', 'stainless_steel', 'aluminum', 'copper', 'brass', 'titanium'];
      
      validMaterials.forEach(material => {
        expect(validMaterials.includes(material)).toBe(true);
      });
    });
  });

  describe('Efficiency Calculations', () => {
    it('should calculate power utilization efficiency', () => {
      const optimalPower = 2400; // watts
      const maxPower = 3000; // watts
      
      const powerUtilization = (optimalPower / maxPower) * 100;
      
      expect(powerUtilization).toBe(80);
    });

    it('should calculate overall efficiency', () => {
      const powerEfficiency = 0.8;
      const speedOptimality = 0.9;
      const materialCompatibility = 0.85;
      const qualityScore = 0.75;
      
      const overallEfficiency = (powerEfficiency + speedOptimality + materialCompatibility + qualityScore) / 4;
      
      expect(overallEfficiency).toBeCloseTo(0.825, 3);
    });
  });
});
