/**
 * Calculation History Service Tests
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { CalculationHistoryService } from '../../services/calculationHistoryService';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
});

// Mock performance.now
Object.defineProperty(window, 'performance', {
  value: {
    now: vi.fn(() => 100),
  },
});

describe('CalculationHistoryService', () => {
  let service: CalculationHistoryService;

  beforeEach(async () => {
    // Clear all mocks
    vi.clearAllMocks();
    
    // Reset localStorage mock
    localStorageMock.getItem.mockReturnValue(null);
    sessionStorageMock.getItem.mockReturnValue('test-session-id');
    
    // Create new service instance
    service = new CalculationHistoryService({
      maxRecords: 10,
      autoCleanupDays: 30,
      compressionEnabled: false,
      batchSize: 5,
      storageKey: 'test-history',
    });
    
    await service.initialize();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('initialization', () => {
    it('should initialize successfully', async () => {
      const newService = new CalculationHistoryService();
      await expect(newService.initialize()).resolves.not.toThrow();
    });

    it('should load existing data from localStorage', async () => {
      const existingData = {
        'anonymous-user': [
          {
            id: 'test-1',
            calculatorType: 'laser-cutting-cost',
            calculatorName: 'Laser Cutting Cost Calculator',
            timestamp: '2024-01-01T00:00:00Z',
            inputs: { thickness: 5, material: 'steel' },
            outputs: { cost: 100 },
            metadata: { version: '1.0.0', executionTime: 50 },
          },
        ],
      };
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingData));
      
      const newService = new CalculationHistoryService();
      await newService.initialize();
      
      const history = await newService.getHistory();
      expect(history.records).toHaveLength(1);
      expect(history.records[0].id).toBe('test-1');
    });
  });

  describe('saveCalculation', () => {
    it('should save a calculation successfully', async () => {
      const inputs = { thickness: 5, material: 'steel' };
      const outputs = { cost: 100, time: 30 };
      
      const id = await service.saveCalculation(
        'laser-cutting-cost',
        'Laser Cutting Cost Calculator',
        inputs,
        outputs
      );
      
      expect(id).toBeDefined();
      expect(typeof id).toBe('string');
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });

    it('should include metadata in saved calculation', async () => {
      const inputs = { thickness: 5 };
      const outputs = { cost: 100 };
      const context = { projectName: 'Test Project' };
      
      await service.saveCalculation(
        'test-calculator',
        'Test Calculator',
        inputs,
        outputs,
        context
      );
      
      const history = await service.getHistory();
      const record = history.records[0];
      
      expect(record.metadata.context?.projectName).toBe('Test Project');
      expect(record.metadata.executionTime).toBeDefined();
      expect(record.metadata.sessionId).toBe('test-session-id');
    });

    it('should enforce max records limit', async () => {
      // Add more records than the limit
      for (let i = 0; i < 15; i++) {
        await service.saveCalculation(
          'test-calculator',
          'Test Calculator',
          { value: i },
          { result: i * 2 }
        );
      }
      
      const history = await service.getHistory();
      expect(history.records.length).toBe(10); // Should be limited to maxRecords
    });
  });

  describe('getHistory', () => {
    beforeEach(async () => {
      // Add some test data
      for (let i = 0; i < 5; i++) {
        await service.saveCalculation(
          i % 2 === 0 ? 'calculator-a' : 'calculator-b',
          `Calculator ${i % 2 === 0 ? 'A' : 'B'}`,
          { value: i },
          { result: i * 2 }
        );
      }
    });

    it('should return all records without query', async () => {
      const history = await service.getHistory();
      
      expect(history.records).toHaveLength(5);
      expect(history.total).toBe(5);
      expect(history.pagination.page).toBe(1);
    });

    it('should filter by calculator type', async () => {
      const history = await service.getHistory({
        calculatorType: 'calculator-a',
      });
      
      expect(history.records).toHaveLength(3);
      expect(history.records.every(r => r.calculatorType === 'calculator-a')).toBe(true);
    });

    it('should apply pagination', async () => {
      const history = await service.getHistory({
        limit: 2,
        offset: 0,
      });
      
      expect(history.records).toHaveLength(2);
      expect(history.pagination.hasNext).toBe(true);
      expect(history.pagination.hasPrevious).toBe(false);
    });

    it('should sort records correctly', async () => {
      const history = await service.getHistory({
        sortBy: 'timestamp',
        sortOrder: 'asc',
      });
      
      // Should be sorted by timestamp ascending
      for (let i = 1; i < history.records.length; i++) {
        const prevTime = new Date(history.records[i - 1].timestamp).getTime();
        const currTime = new Date(history.records[i].timestamp).getTime();
        expect(prevTime).toBeLessThanOrEqual(currTime);
      }
    });

    it('should search in records', async () => {
      await service.saveCalculation(
        'special-calculator',
        'Special Calculator',
        { specialValue: 42 },
        { specialResult: 84 }
      );
      
      const history = await service.getHistory({
        search: 'special',
      });
      
      expect(history.records.length).toBeGreaterThan(0);
      expect(history.records.some(r => r.calculatorType.includes('special'))).toBe(true);
    });
  });

  describe('getCalculation', () => {
    it('should return specific calculation by ID', async () => {
      const id = await service.saveCalculation(
        'test-calculator',
        'Test Calculator',
        { value: 42 },
        { result: 84 }
      );
      
      const record = await service.getCalculation(id);
      
      expect(record).toBeDefined();
      expect(record?.id).toBe(id);
      expect(record?.inputs.value).toBe(42);
    });

    it('should return null for non-existent ID', async () => {
      const record = await service.getCalculation('non-existent-id');
      expect(record).toBeNull();
    });
  });

  describe('deleteCalculation', () => {
    it('should delete calculation successfully', async () => {
      const id = await service.saveCalculation(
        'test-calculator',
        'Test Calculator',
        { value: 42 },
        { result: 84 }
      );
      
      const success = await service.deleteCalculation(id);
      expect(success).toBe(true);
      
      const record = await service.getCalculation(id);
      expect(record).toBeNull();
    });

    it('should return false for non-existent ID', async () => {
      const success = await service.deleteCalculation('non-existent-id');
      expect(success).toBe(false);
    });
  });

  describe('clearHistory', () => {
    it('should clear all history', async () => {
      // Add some records
      await service.saveCalculation('test', 'Test', { a: 1 }, { b: 2 });
      await service.saveCalculation('test', 'Test', { a: 2 }, { b: 4 });
      
      await service.clearHistory();
      
      const history = await service.getHistory();
      expect(history.records).toHaveLength(0);
      expect(history.total).toBe(0);
    });
  });

  describe('getStats', () => {
    beforeEach(async () => {
      // Add test data with different calculators and parameters
      await service.saveCalculation(
        'calculator-a',
        'Calculator A',
        { thickness: 5, width: 100 },
        { cost: 50 }
      );
      await service.saveCalculation(
        'calculator-a',
        'Calculator A',
        { thickness: 3, width: 200 },
        { cost: 60 }
      );
      await service.saveCalculation(
        'calculator-b',
        'Calculator B',
        { power: 1000 },
        { efficiency: 85 }
      );
    });

    it('should return correct statistics', async () => {
      const stats = await service.getStats();
      
      expect(stats.totalRecords).toBe(3);
      expect(stats.calculatorUsage['calculator-a']).toBe(2);
      expect(stats.calculatorUsage['calculator-b']).toBe(1);
      expect(stats.averageExecutionTime).toBeDefined();
      expect(stats.mostUsedParameters).toBeDefined();
      expect(stats.dailyUsage).toBeDefined();
    });

    it('should calculate parameter usage correctly', async () => {
      const stats = await service.getStats();
      
      const thicknessParam = stats.mostUsedParameters.find(p => p.parameter === 'thickness');
      expect(thicknessParam).toBeDefined();
      expect(thicknessParam?.count).toBe(2);
      expect(thicknessParam?.averageValue).toBe(4); // (5 + 3) / 2
    });

    it('should handle empty history', async () => {
      await service.clearHistory();
      const stats = await service.getStats();
      
      expect(stats.totalRecords).toBe(0);
      expect(stats.averageExecutionTime).toBe(0);
      expect(stats.mostUsedParameters).toHaveLength(0);
    });
  });
});
