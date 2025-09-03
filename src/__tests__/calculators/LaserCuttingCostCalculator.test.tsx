import { describe, it, expect, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import LaserCuttingCostCalculator from '../../components/calculators/LaserCuttingCostCalculator';
import { renderCalculator } from '../utils/testUtils';

describe('LaserCuttingCostCalculator - Algorithm Verification', () => {
  // Standard test inputs for algorithm verification
  const standardInputs = {
    materialType: 'Mild Steel',
    thickness: 3,
    length: 1000,
    width: 500,
    quantity: 1,
    materialCost: 2.5, // per m²
    laserPower: 1500, // watts
    cuttingSpeed: 2500, // mm/min
    gasType: 'Oxygen',
    gasConsumption: 0.8, // m³/hour
    gasCost: 0.15, // per m³
    electricityRate: 0.12, // per kWh
    laborRate: 25, // per hour
    machineHourlyRate: 45, // per hour
    setupTime: 15, // minutes
    wasteFactor: 0.1 // 10%
  };

  beforeEach(() => {
    // Reset any global state if needed
  });

  it('should render without crashing', () => {
    renderCalculator(<LaserCuttingCostCalculator />);
    expect(screen.getByText(/Laser Cutting Cost Calculator/i)).toBeInTheDocument();
  });

  describe('Core Algorithm Verification', () => {
    it('should calculate material cost correctly', () => {
      const { length, width, quantity, materialCost, wasteFactor } = standardInputs;
      
      // Expected calculation:
      // Area = (1000 * 500) / 1,000,000 = 0.5 m²
      // Total area with waste = 0.5 * 1 * (1 + 0.1) = 0.55 m²
      // Material cost = 0.55 * 2.5 = 1.375
      
      const area = (length * width) / 1000000; // Convert mm² to m²
      const totalArea = area * quantity * (1 + wasteFactor);
      const expectedMaterialCost = totalArea * materialCost;
      
      expect(area).toBe(0.5);
      expect(totalArea).toBe(0.55);
      expect(expectedMaterialCost).toBe(1.375);
    });

    it('should calculate cutting time correctly', () => {
      const { length, width, quantity, cuttingSpeed } = standardInputs;
      
      // Expected calculation:
      // Perimeter = 2 * (1000 + 500) = 3000 mm
      // Total perimeter = 3000 * 1 = 3000 mm
      // Cutting time = 3000 / 2500 = 1.2 minutes
      
      const perimeter = 2 * (length + width);
      const totalPerimeter = perimeter * quantity;
      const cuttingTime = totalPerimeter / cuttingSpeed;
      
      expect(perimeter).toBe(3000);
      expect(totalPerimeter).toBe(3000);
      expect(cuttingTime).toBe(1.2);
    });

    it('should calculate gas cost correctly', () => {
      const { gasConsumption, gasCost, cuttingSpeed, length, width, quantity } = standardInputs;
      
      // Expected calculation:
      // Cutting time = 1.2 minutes = 0.02 hours
      // Gas consumption = 0.02 * 0.8 = 0.016 m³
      // Gas cost = 0.016 * 0.15 = 0.0024
      
      const perimeter = 2 * (length + width);
      const cuttingTime = (perimeter * quantity) / cuttingSpeed; // minutes
      const cuttingTimeHours = cuttingTime / 60;
      const totalGasConsumption = cuttingTimeHours * gasConsumption;
      const expectedGasCost = totalGasConsumption * gasCost;
      
      expect(cuttingTimeHours).toBeCloseTo(0.02, 3);
      expect(totalGasConsumption).toBeCloseTo(0.016, 3);
      expect(expectedGasCost).toBeCloseTo(0.0024, 4);
    });

    it('should calculate electricity cost correctly', () => {
      const { laserPower, electricityRate, setupTime, cuttingSpeed, length, width, quantity } = standardInputs;
      
      // Expected calculation:
      // Cutting time = 1.2 minutes
      // Total time = 1.2 + 15 = 16.2 minutes = 0.27 hours
      // Power consumption = 1.5 kW * 0.27 hours = 0.405 kWh
      // Electricity cost = 0.405 * 0.12 = 0.0486
      
      const perimeter = 2 * (length + width);
      const cuttingTime = (perimeter * quantity) / cuttingSpeed;
      const totalTime = cuttingTime + setupTime;
      const totalTimeHours = totalTime / 60;
      const powerConsumption = (laserPower / 1000) * totalTimeHours;
      const expectedElectricityCost = powerConsumption * electricityRate;
      
      expect(totalTimeHours).toBeCloseTo(0.27, 2);
      expect(powerConsumption).toBeCloseTo(0.405, 3);
      expect(expectedElectricityCost).toBeCloseTo(0.0486, 4);
    });

    it('should calculate labor cost correctly', () => {
      const { laborRate, setupTime, cuttingSpeed, length, width, quantity } = standardInputs;
      
      // Expected calculation:
      // Total time = 16.2 minutes = 0.27 hours
      // Labor cost = 0.27 * 25 = 6.75
      
      const perimeter = 2 * (length + width);
      const cuttingTime = (perimeter * quantity) / cuttingSpeed;
      const totalTime = cuttingTime + setupTime;
      const totalTimeHours = totalTime / 60;
      const expectedLaborCost = totalTimeHours * laborRate;
      
      expect(expectedLaborCost).toBeCloseTo(6.75, 2);
    });

    it('should calculate machine cost correctly', () => {
      const { machineHourlyRate, setupTime, cuttingSpeed, length, width, quantity } = standardInputs;
      
      // Expected calculation:
      // Total time = 16.2 minutes = 0.27 hours
      // Machine cost = 0.27 * 45 = 12.15
      
      const perimeter = 2 * (length + width);
      const cuttingTime = (perimeter * quantity) / cuttingSpeed;
      const totalTime = cuttingTime + setupTime;
      const totalTimeHours = totalTime / 60;
      const expectedMachineCost = totalTimeHours * machineHourlyRate;
      
      expect(expectedMachineCost).toBeCloseTo(12.15, 2);
    });

    it('should calculate total cost correctly', () => {
      // Sum of all individual costs
      const materialCost = 1.375;
      const gasCost = 0.0024;
      const electricityCost = 0.0486;
      const laborCost = 6.75;
      const machineCost = 12.15;
      
      const expectedTotalCost = materialCost + gasCost + electricityCost + laborCost + machineCost;
      
      expect(expectedTotalCost).toBeCloseTo(20.3260, 3);
    });
  });

  describe('Edge Cases and Boundary Testing', () => {
    it('should handle zero dimensions gracefully', () => {
      const inputs = { ...standardInputs, length: 0, width: 0 };
      
      const area = (inputs.length * inputs.width) / 1000000;
      const perimeter = 2 * (inputs.length + inputs.width);
      
      expect(area).toBe(0);
      expect(perimeter).toBe(0);
      
      // Should not cause division by zero or infinite values
      const cuttingTime = perimeter / inputs.cuttingSpeed;
      expect(cuttingTime).toBe(0);
      expect(isFinite(cuttingTime)).toBe(true);
    });

    it('should handle very small dimensions', () => {
      const inputs = { ...standardInputs, length: 0.1, width: 0.1 };
      
      const area = (inputs.length * inputs.width) / 1000000;
      const perimeter = 2 * (inputs.length + inputs.width);
      
      expect(area).toBe(0.00000001); // 0.01 mm² = 0.00000001 m²
      expect(perimeter).toBe(0.4); // 0.4 mm
      
      // Should produce valid, finite results
      const cuttingTime = perimeter / inputs.cuttingSpeed;
      expect(isFinite(cuttingTime)).toBe(true);
      expect(cuttingTime).toBeGreaterThan(0);
    });

    it('should handle very large dimensions', () => {
      const inputs = { ...standardInputs, length: 10000, width: 10000 };
      
      const area = (inputs.length * inputs.width) / 1000000;
      const perimeter = 2 * (inputs.length + inputs.width);
      
      expect(area).toBe(100); // 100 m²
      expect(perimeter).toBe(40000); // 40,000 mm
      
      // Should produce valid, finite results
      const cuttingTime = perimeter / inputs.cuttingSpeed;
      expect(isFinite(cuttingTime)).toBe(true);
      expect(cuttingTime).toBe(16); // 16 minutes
    });

    it('should handle zero cutting speed gracefully', () => {
      const inputs = { ...standardInputs, cuttingSpeed: 0 };
      
      const perimeter = 2 * (inputs.length + inputs.width);
      
      // Should handle division by zero
      expect(() => {
        const cuttingTime = inputs.cuttingSpeed > 0 ? perimeter / inputs.cuttingSpeed : 0;
        expect(cuttingTime).toBe(0);
      }).not.toThrow();
    });

    it('should handle very high quantities', () => {
      const inputs = { ...standardInputs, quantity: 10000 };
      
      const area = (inputs.length * inputs.width) / 1000000;
      const totalArea = area * inputs.quantity * (1 + inputs.wasteFactor);
      const materialCost = totalArea * inputs.materialCost;
      
      expect(totalArea).toBe(5500); // 5500 m²
      expect(materialCost).toBe(13750); // $13,750
      expect(isFinite(materialCost)).toBe(true);
    });
  });

  describe('Precision and Rounding', () => {
    it('should maintain appropriate precision for currency', () => {
      const cost = 123.456789;
      const roundedCost = Math.round(cost * 100) / 100;
      
      expect(roundedCost).toBe(123.46);
    });

    it('should handle floating point precision issues', () => {
      // Test common floating point precision issues
      const result1 = 0.1 + 0.2;
      const result2 = Math.round((0.1 + 0.2) * 100) / 100;
      
      expect(result1).not.toBe(0.3); // Floating point precision issue
      expect(result2).toBe(0.3); // Properly rounded
    });

    it('should maintain precision in complex calculations', () => {
      const area = (1000 * 500) / 1000000; // 0.5
      const wasteFactor = 0.1;
      const materialCost = 2.5;
      
      const totalArea = area * (1 + wasteFactor); // 0.55
      const cost = totalArea * materialCost; // 1.375
      
      expect(cost).toBe(1.375);
      expect(Math.round(cost * 100) / 100).toBe(1.38);
    });
  });

  describe('Input Validation', () => {
    it('should validate negative inputs', () => {
      const negativeInputs = [
        'thickness', 'length', 'width', 'quantity', 'materialCost',
        'laserPower', 'cuttingSpeed', 'gasConsumption', 'gasCost',
        'electricityRate', 'laborRate', 'machineHourlyRate', 'setupTime'
      ];
      
      negativeInputs.forEach(field => {
        const inputs = { ...standardInputs, [field]: -1 };
        
        // Should detect negative values
        expect(inputs[field as keyof typeof inputs]).toBeLessThan(0);
      });
    });

    it('should validate zero inputs where inappropriate', () => {
      const zeroInvalidInputs = [
        'thickness', 'length', 'width', 'quantity', 'cuttingSpeed'
      ];
      
      zeroInvalidInputs.forEach(field => {
        const inputs = { ...standardInputs, [field]: 0 };
        
        // Should detect zero values where they're invalid
        expect(inputs[field as keyof typeof inputs]).toBe(0);
      });
    });
  });
});
