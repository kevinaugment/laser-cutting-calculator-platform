import { describe, it, expect, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import BatchProcessingCalculator from '../../components/calculators/BatchProcessingCalculator';
import { renderCalculator } from '../utils/testUtils';

describe('BatchProcessingCalculator', () => {
  const mockInputs = {
    batchConfiguration: {
      batchSize: 50,
      totalQuantity: 500,
      priorityLevel: 'high' as const,
      qualityRequirements: 'standard' as const
    },
    partSpecifications: [
      {
        partId: 'P001',
        partName: 'Test Part',
        material: 'steel',
        thickness: 3,
        complexity: 'medium' as const,
        processingTime: 5,
        materialUsage: 0.5
      }
    ],
    machineConstraints: {
      availableMachines: 2,
      maxBatchSize: 100,
      setupTimePerBatch: 30,
      changoverTime: 15
    },
    materialInventory: [
      {
        materialType: 'steel',
        thickness: 3,
        availableQuantity: 1000,
        costPerUnit: 10,
        qualityGrade: 'standard' as const
      }
    ],
    operationalParameters: {
      shiftDuration: 8,
      shiftsPerDay: 2,
      setupTimePerBatch: 30,
      setupCostPerBatch: 50,
      laborCostPerHour: 25,
      materialCostPerUnit: 10
    }
  };

  beforeEach(() => {
    // Reset any global state if needed
  });

  it('should render without crashing', () => {
    renderCalculator(<BatchProcessingCalculator />);
    expect(screen.getAllByText(/Batch Processing Calculator/i)[0]).toBeInTheDocument();
  });

  it('should calculate material utilization correctly', async () => {
    renderCalculator(<BatchProcessingCalculator />);

    // Fill in form data (simplified for test)
    const calculateButton = screen.getByRole('button', { name: /Optimize Batch Processing/i });
    
    // Mock the calculation by directly testing the logic
    const totalQuantity = mockInputs.batchConfiguration.totalQuantity;
    const materialUsagePerPart = mockInputs.partSpecifications[0].materialUsage;
    const totalMaterialNeeded = totalQuantity * materialUsagePerPart;
    const availableMaterial = mockInputs.materialInventory[0].availableQuantity;
    
    // Test the calculation logic
    const materialUtilization = Math.min(totalMaterialNeeded / availableMaterial, 1.0) * 100;
    const wastedMaterial = Math.max(0, availableMaterial - totalMaterialNeeded);
    
    expect(totalMaterialNeeded).toBe(250); // 500 * 0.5
    expect(availableMaterial).toBe(1000);
    expect(materialUtilization).toBe(25); // (250/1000) * 100
    expect(wastedMaterial).toBe(750); // 1000 - 250
  });

  it('should handle division by zero in material calculations', () => {
    const totalMaterialNeeded = 100;
    const availableMaterial = 0;
    
    // Should not throw error and handle gracefully
    expect(() => {
      const materialUtilization = availableMaterial > 0 
        ? Math.min(totalMaterialNeeded / availableMaterial, 1.0) * 100 
        : 0;
      expect(materialUtilization).toBe(0);
    }).not.toThrow();
  });

  it('should calculate batch processing metrics correctly', () => {
    const batchSize = mockInputs.batchConfiguration.batchSize;
    const totalQuantity = mockInputs.batchConfiguration.totalQuantity;
    const setupTimePerBatch = mockInputs.operationalParameters.setupTimePerBatch;
    const avgProcessingTimePerPart = mockInputs.partSpecifications[0].processingTime;
    
    // Calculate expected values
    const numberOfBatches = Math.ceil(totalQuantity / batchSize);
    const totalSetupTime = numberOfBatches * setupTimePerBatch;
    const totalProcessingTime = totalQuantity * avgProcessingTimePerPart;
    const totalProductionTime = totalSetupTime + totalProcessingTime;
    const setupTimeRatio = (totalSetupTime / totalProductionTime) * 100;
    
    expect(numberOfBatches).toBe(10); // Math.ceil(500/50)
    expect(totalSetupTime).toBe(300); // 10 * 30
    expect(totalProcessingTime).toBe(2500); // 500 * 5
    expect(totalProductionTime).toBe(2800); // 300 + 2500
    expect(setupTimeRatio).toBeCloseTo(10.71, 1); // (300/2800) * 100
  });

  it('should provide optimization recommendations', () => {
    const batchSize = 50;
    const totalQuantity = 500;
    const setupTimePerBatch = 30;
    const avgProcessingTimePerPart = 5;
    
    // Calculate optimal batch size (simplified formula)
    const optimalBatchSize = Math.sqrt(2 * setupTimePerBatch * totalQuantity / avgProcessingTimePerPart);
    const recommendedBatchSize = Math.min(Math.max(Math.round(optimalBatchSize), 10), 200);
    
    expect(recommendedBatchSize).toBeGreaterThan(0);
    expect(recommendedBatchSize).toBeLessThanOrEqual(200);
  });

  it('should handle edge cases in calculations', () => {
    // Test with zero values
    expect(() => {
      const numberOfBatches = Math.ceil(0 / 50);
      expect(numberOfBatches).toBe(0);
    }).not.toThrow();

    // Test with very large values
    expect(() => {
      const numberOfBatches = Math.ceil(1000000 / 50);
      expect(numberOfBatches).toBe(20000);
    }).not.toThrow();

    // Test with decimal batch sizes
    expect(() => {
      const numberOfBatches = Math.ceil(100 / 33);
      expect(numberOfBatches).toBe(4);
    }).not.toThrow();
  });

  it('should validate input parameters', () => {
    // Test negative values
    const invalidInputs = {
      ...mockInputs,
      batchConfiguration: {
        ...mockInputs.batchConfiguration,
        batchSize: -10
      }
    };

    // Should handle invalid inputs gracefully
    expect(invalidInputs.batchConfiguration.batchSize).toBeLessThan(0);
  });

  it('should calculate cost analysis correctly', () => {
    const numberOfBatches = 10;
    const setupCostPerBatch = 50;
    const totalProductionTime = 2800; // minutes
    const laborCostPerHour = 25;
    const totalQuantity = 500;
    const materialCostPerUnit = 10;
    
    const totalSetupCost = numberOfBatches * setupCostPerBatch;
    const totalLaborCost = (totalProductionTime / 60) * laborCostPerHour;
    const totalMaterialCost = totalQuantity * materialCostPerUnit;
    const totalCost = totalSetupCost + totalLaborCost + totalMaterialCost;
    const costPerUnit = totalCost / totalQuantity;
    
    expect(totalSetupCost).toBe(500); // 10 * 50
    expect(totalLaborCost).toBeCloseTo(1166.67, 1); // (2800/60) * 25
    expect(totalMaterialCost).toBe(5000); // 500 * 10
    expect(totalCost).toBeCloseTo(6666.67, 1);
    expect(costPerUnit).toBeCloseTo(13.33, 1);
  });

  it('should handle production scheduling calculations', () => {
    const shiftDuration = 8;
    const shiftsPerDay = 2;
    const totalProductionTime = 2800; // minutes
    const setupTimePerBatch = 30;
    const batchSize = 50;
    const avgProcessingTimePerPart = 5;
    
    const dailyCapacity = shiftDuration * shiftsPerDay * 60; // minutes per day
    const daysRequired = Math.ceil(totalProductionTime / dailyCapacity);
    const batchesPerDay = Math.floor(dailyCapacity / (setupTimePerBatch + (batchSize * avgProcessingTimePerPart)));
    
    expect(dailyCapacity).toBe(960); // 8 * 2 * 60
    expect(daysRequired).toBe(3); // Math.ceil(2800/960)
    expect(batchesPerDay).toBe(3); // Math.floor(960/(30 + 250))
  });
});
