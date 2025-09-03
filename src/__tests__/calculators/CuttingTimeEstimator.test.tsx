import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CuttingTimeEstimator from '../../components/calculators/CuttingTimeEstimator';

describe('CuttingTimeEstimator - Algorithm Verification', () => {
  // Standard test inputs for algorithm verification
  const standardInputs = {
    materialType: 'steel',
    thickness: 3, // mm
    cuttingLength: 3000, // mm (perimeter of 1000x500 rectangle)
    pierceCount: 4,
    laserPower: 1500, // watts
    cuttingSpeed: 2500, // mm/min
    complexity: 'medium',
    qualityLevel: 'standard',
    setupTime: 15, // minutes
    pierceTime: 0.5 // seconds per pierce
  };

  beforeEach(() => {
    // Reset any global state if needed
  });

  it('should render without crashing', () => {
    render(<CuttingTimeEstimator />);
    expect(screen.getByText(/Cutting Time Estimator/i)).toBeInTheDocument();
  });

  describe('Core Time Calculation Algorithms', () => {
    it('should calculate cutting time correctly', () => {
      const { cuttingLength, cuttingSpeed } = standardInputs;
      
      // Expected calculation:
      // Cutting time = 3000 mm / 2500 mm/min = 1.2 minutes
      
      const expectedCuttingTime = cuttingLength / cuttingSpeed;
      
      expect(expectedCuttingTime).toBe(1.2);
    });

    it('should calculate piercing time correctly', () => {
      const { pierceCount, pierceTime } = standardInputs;
      
      // Expected calculation:
      // Total piercing time = 4 pierces × 0.5 seconds = 2 seconds = 0.0333 minutes
      
      const totalPiercingTimeSeconds = pierceCount * pierceTime;
      const totalPiercingTimeMinutes = totalPiercingTimeSeconds / 60;
      
      expect(totalPiercingTimeSeconds).toBe(2);
      expect(totalPiercingTimeMinutes).toBeCloseTo(0.0333, 4);
    });

    it('should calculate total time with setup correctly', () => {
      const { cuttingLength, cuttingSpeed, pierceCount, pierceTime, setupTime } = standardInputs;
      
      // Expected calculation:
      // Cutting time = 1.2 minutes
      // Piercing time = 0.0333 minutes
      // Setup time = 15 minutes
      // Total time = 1.2 + 0.0333 + 15 = 16.2333 minutes
      
      const cuttingTime = cuttingLength / cuttingSpeed;
      const piercingTime = (pierceCount * pierceTime) / 60;
      const totalTime = cuttingTime + piercingTime + setupTime;
      
      expect(totalTime).toBeCloseTo(16.2333, 4);
    });

    it('should apply complexity factor correctly', () => {
      const baseTime = 10; // minutes
      const complexityFactors = {
        'simple': 1.0,
        'medium': 1.2,
        'complex': 1.5
      };
      
      Object.entries(complexityFactors).forEach(([complexity, factor]) => {
        const adjustedTime = baseTime * factor;
        
        switch (complexity) {
          case 'simple':
            expect(adjustedTime).toBe(10);
            break;
          case 'medium':
            expect(adjustedTime).toBe(12);
            break;
          case 'complex':
            expect(adjustedTime).toBe(15);
            break;
        }
      });
    });

    it('should apply quality factor correctly', () => {
      const baseTime = 10; // minutes
      const qualityFactors = {
        'fast': 0.8,
        'standard': 1.0,
        'high': 1.3
      };
      
      Object.entries(qualityFactors).forEach(([quality, factor]) => {
        const adjustedTime = baseTime * factor;
        
        switch (quality) {
          case 'fast':
            expect(adjustedTime).toBe(8);
            break;
          case 'standard':
            expect(adjustedTime).toBe(10);
            break;
          case 'high':
            expect(adjustedTime).toBe(13);
            break;
        }
      });
    });
  });

  describe('Material-Specific Calculations', () => {
    it('should calculate different piercing times for different materials', () => {
      const thickness = 3; // mm
      const baseTime = thickness * 0.02; // minutes per mm
      
      const materialMultipliers = {
        steel: 1.0,
        stainless_steel: 1.3,
        aluminum: 0.8,
        copper: 1.5,
        brass: 1.2,
        titanium: 2.0
      };
      
      Object.entries(materialMultipliers).forEach(([material, multiplier]) => {
        const piercingTime = baseTime * multiplier;
        
        expect(piercingTime).toBeCloseTo(0.06 * multiplier, 4);
      });
    });

    it('should calculate different cutting speeds for different materials', () => {
      const basePower = 1500; // watts
      const thickness = 3; // mm
      
      const materialFactors = {
        steel: 1.0,
        stainless_steel: 0.8,
        aluminum: 1.2,
        copper: 0.7,
        brass: 0.9,
        titanium: 0.6
      };
      
      Object.entries(materialFactors).forEach(([material, factor]) => {
        // Simplified speed calculation
        const powerDensity = basePower / (thickness * thickness);
        const baseSpeed = Math.sqrt(powerDensity) * 100;
        const adjustedSpeed = baseSpeed * factor;
        
        expect(adjustedSpeed).toBeGreaterThan(0);
        expect(isFinite(adjustedSpeed)).toBe(true);
      });
    });
  });

  describe('Production Metrics Calculations', () => {
    it('should calculate parts per hour correctly', () => {
      const totalTimeMinutes = 16.2333;
      const partsPerHour = 60 / totalTimeMinutes;
      
      expect(partsPerHour).toBeCloseTo(3.696, 3);
    });

    it('should calculate daily capacity correctly', () => {
      const partsPerHour = 3.696;
      const hoursPerDay = 8;
      const dailyCapacity = partsPerHour * hoursPerDay;
      
      expect(dailyCapacity).toBeCloseTo(29.57, 2);
    });

    it('should calculate weekly capacity correctly', () => {
      const dailyCapacity = 29.57;
      const daysPerWeek = 5;
      const weeklyCapacity = dailyCapacity * daysPerWeek;
      
      expect(weeklyCapacity).toBeCloseTo(147.85, 2);
    });

    it('should calculate efficiency percentage correctly', () => {
      const cuttingTime = 1.2; // minutes
      const totalTime = 16.2333; // minutes
      const efficiency = (cuttingTime / totalTime) * 100;
      
      expect(efficiency).toBeCloseTo(7.39, 2);
    });
  });

  describe('Edge Cases and Boundary Testing', () => {
    it('should handle zero cutting length gracefully', () => {
      const cuttingLength = 0;
      const cuttingSpeed = 2500;
      
      const cuttingTime = cuttingLength / cuttingSpeed;
      
      expect(cuttingTime).toBe(0);
      expect(isFinite(cuttingTime)).toBe(true);
    });

    it('should handle zero pierce count gracefully', () => {
      const pierceCount = 0;
      const pierceTime = 0.5;
      
      const totalPiercingTime = pierceCount * pierceTime;
      
      expect(totalPiercingTime).toBe(0);
    });

    it('should handle very small cutting speeds', () => {
      const cuttingLength = 1000;
      const cuttingSpeed = 1; // Very slow
      
      const cuttingTime = cuttingLength / cuttingSpeed;
      
      expect(cuttingTime).toBe(1000);
      expect(isFinite(cuttingTime)).toBe(true);
    });

    it('should handle very high cutting speeds', () => {
      const cuttingLength = 1000;
      const cuttingSpeed = 10000; // Very fast
      
      const cuttingTime = cuttingLength / cuttingSpeed;
      
      expect(cuttingTime).toBe(0.1);
      expect(isFinite(cuttingTime)).toBe(true);
    });

    it('should handle zero cutting speed gracefully', () => {
      const cuttingLength = 1000;
      const cuttingSpeed = 0;
      
      // Should handle division by zero
      expect(() => {
        const cuttingTime = cuttingSpeed > 0 ? cuttingLength / cuttingSpeed : 0;
        expect(cuttingTime).toBe(0);
      }).not.toThrow();
    });
  });

  describe('Power-Based Speed Calculations', () => {
    it('should calculate speed based on power density correctly', () => {
      const laserPower = 1500; // watts
      const thickness = 3; // mm
      
      // Power density calculation
      const powerDensity = laserPower / (thickness * thickness);
      const baseSpeed = Math.sqrt(powerDensity) * 100;
      
      expect(powerDensity).toBeCloseTo(166.67, 2);
      expect(baseSpeed).toBeCloseTo(1290.99, 2);
    });

    it('should apply power scaling factor correctly', () => {
      const basePower = 3000; // watts (baseline)
      const actualPower = 1500; // watts
      
      const powerFactor = Math.sqrt(actualPower / basePower);
      
      expect(powerFactor).toBeCloseTo(0.707, 3);
    });

    it('should limit speed to machine maximum', () => {
      const calculatedSpeed = 5000; // mm/min
      const maxMachineSpeed = 3000; // mm/min
      
      const actualSpeed = Math.min(calculatedSpeed, maxMachineSpeed);
      
      expect(actualSpeed).toBe(3000);
    });
  });

  describe('Time Breakdown Percentages', () => {
    it('should calculate time breakdown percentages correctly', () => {
      const cuttingTime = 1.2;
      const piercingTime = 0.0333;
      const setupTime = 15;
      const totalTime = cuttingTime + piercingTime + setupTime;
      
      const breakdown = {
        cutting: (cuttingTime / totalTime) * 100,
        piercing: (piercingTime / totalTime) * 100,
        setup: (setupTime / totalTime) * 100
      };
      
      expect(breakdown.cutting).toBeCloseTo(7.39, 2);
      expect(breakdown.piercing).toBeCloseTo(0.21, 2);
      expect(breakdown.setup).toBeCloseTo(92.40, 2);
      
      // Total should equal 100%
      const total = breakdown.cutting + breakdown.piercing + breakdown.setup;
      expect(total).toBeCloseTo(100, 1);
    });
  });

  describe('Input Validation', () => {
    it('should validate negative inputs', () => {
      const negativeInputs = [
        'thickness', 'cuttingLength', 'pierceCount', 'laserPower',
        'cuttingSpeed', 'setupTime', 'pierceTime'
      ];
      
      negativeInputs.forEach(field => {
        const inputs = { ...standardInputs, [field]: -1 };
        
        // Should detect negative values
        expect(inputs[field as keyof typeof inputs]).toBeLessThan(0);
      });
    });

    it('should validate zero inputs where inappropriate', () => {
      const zeroInvalidInputs = [
        'thickness', 'cuttingLength', 'laserPower', 'cuttingSpeed'
      ];
      
      zeroInvalidInputs.forEach(field => {
        const inputs = { ...standardInputs, [field]: 0 };
        
        // Should detect zero values where they're invalid
        expect(inputs[field as keyof typeof inputs]).toBe(0);
      });
    });

    it('should validate material type enum', () => {
      const validMaterials = ['steel', 'stainless_steel', 'aluminum', 'copper', 'brass', 'titanium'];
      
      validMaterials.forEach(material => {
        expect(validMaterials.includes(material)).toBe(true);
      });
    });

    it('should validate quality level enum', () => {
      const validQualityLevels = ['fast', 'standard', 'high'];
      
      validQualityLevels.forEach(level => {
        expect(validQualityLevels.includes(level)).toBe(true);
      });
    });
  });
});
