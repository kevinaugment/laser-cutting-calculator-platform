/**
 * Pattern Recognition Service Tests
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { PatternRecognitionService } from '../../services/patternRecognitionService';
import { CalculationRecord } from '../../types/memory';

// Mock the dependent services
vi.mock('../../services/calculationHistoryService', () => ({
  calculationHistoryService: {
    getHistory: vi.fn(),
  },
}));

vi.mock('../../services/parameterPresetService', () => ({
  parameterPresetService: {
    getPresets: vi.fn(),
  },
}));

vi.mock('../../services/userPreferencesService', () => ({
  userPreferencesService: {
    getPreferences: vi.fn(),
  },
}));

describe('PatternRecognitionService', () => {
  let service: PatternRecognitionService;
  let mockHistoryService: any;
  let mockPresetService: any;
  let mockPreferencesService: any;

  beforeEach(async () => {
    // Clear all mocks
    vi.clearAllMocks();
    
    // Get mock services
    const { calculationHistoryService } = await import('../../services/calculationHistoryService');
    const { parameterPresetService } = await import('../../services/parameterPresetService');
    const { userPreferencesService } = await import('../../services/userPreferencesService');
    
    mockHistoryService = calculationHistoryService;
    mockPresetService = parameterPresetService;
    mockPreferencesService = userPreferencesService;
    
    // Create new service instance
    service = new PatternRecognitionService({
      analysisWindowDays: 7,
      minPatternFrequency: 2,
      confidenceThreshold: 0.5,
      maxPatternsPerType: 5,
      cacheExpiryMinutes: 1,
    });
  });

  afterEach(() => {
    service.clearCache();
  });

  describe('initialization', () => {
    it('should initialize with default config', () => {
      const defaultService = new PatternRecognitionService();
      expect(defaultService).toBeDefined();
    });

    it('should initialize with custom config', () => {
      const customService = new PatternRecognitionService({
        analysisWindowDays: 14,
        minPatternFrequency: 5,
      });
      expect(customService).toBeDefined();
    });
  });

  describe('calculatePatternConfidence', () => {
    it('should calculate confidence correctly', () => {
      const confidence = service.calculatePatternConfidence(5, 10, 0.8);
      expect(confidence).toBeGreaterThan(0);
      expect(confidence).toBeLessThanOrEqual(1);
    });

    it('should return 0 for zero total samples', () => {
      const confidence = service.calculatePatternConfidence(5, 0, 0.8);
      expect(confidence).toBe(0);
    });

    it('should handle edge cases', () => {
      const confidence1 = service.calculatePatternConfidence(0, 10, 0.5);
      expect(confidence1).toBe(0.1); // Only consistency score (0.5 * 0.2)

      const confidence2 = service.calculatePatternConfidence(10, 10, 1.0);
      expect(confidence2).toBe(1.0); // Perfect score
    });
  });

  describe('analyzeUserPatterns', () => {
    beforeEach(() => {
      // Setup mock data
      const mockRecords: CalculationRecord[] = [
        {
          id: 'calc-1',
          calculatorType: 'laser-cutting-cost',
          calculatorName: 'Laser Cutting Cost Calculator',
          inputs: { thickness: 5, material: 'steel', area: 100 },
          outputs: { cost: 50, time: 30 },
          timestamp: new Date('2024-01-01T10:00:00Z'),
          executionTime: 150,
          context: {},
          metadata: {
            version: '1.0',
            userAgent: 'test',
            sessionId: 'session-1'
          }
        },
        {
          id: 'calc-2',
          calculatorType: 'laser-cutting-cost',
          calculatorName: 'Laser Cutting Cost Calculator',
          inputs: { thickness: 5, material: 'steel', area: 200 },
          outputs: { cost: 100, time: 60 },
          timestamp: new Date('2024-01-01T11:00:00Z'),
          executionTime: 200,
          context: {},
          metadata: {
            version: '1.0',
            userAgent: 'test',
            sessionId: 'session-1'
          }
        },
        {
          id: 'calc-3',
          calculatorType: 'cutting-time-estimator',
          calculatorName: 'Cutting Time Estimator',
          inputs: { length: 100, speed: 10 },
          outputs: { time: 10 },
          timestamp: new Date('2024-01-01T14:00:00Z'),
          executionTime: 100,
          context: {},
          metadata: {
            version: '1.0',
            userAgent: 'test',
            sessionId: 'session-2'
          }
        }
      ];

      mockHistoryService.getHistory.mockResolvedValue({
        records: mockRecords,
        total: mockRecords.length,
        pagination: { page: 1, limit: 1000, hasNext: false, hasPrevious: false }
      });

      mockPresetService.getPresets.mockResolvedValue({
        presets: [],
        total: 0,
        hasMore: false
      });

      mockPreferencesService.getPreferences.mockReturnValue({
        defaultUnits: 'metric',
        autoSaveCalculations: true,
        showAdvancedOptions: false,
        theme: 'light',
        language: 'en',
        notifications: { email: true, push: false, inApp: true },
        privacy: { shareUsageData: false, allowAnalytics: true },
        display: { compactMode: false, showTooltips: true, animationsEnabled: true }
      });
    });

    it('should analyze user patterns successfully', async () => {
      const patterns = await service.analyzeUserPatterns('test-user');
      
      expect(patterns).toBeDefined();
      expect(Array.isArray(patterns)).toBe(true);
      expect(patterns.length).toBeGreaterThan(0);
    });

    it('should return patterns with required properties', async () => {
      const patterns = await service.analyzeUserPatterns('test-user');
      
      patterns.forEach(pattern => {
        expect(pattern).toHaveProperty('id');
        expect(pattern).toHaveProperty('type');
        expect(pattern).toHaveProperty('confidence');
        expect(pattern).toHaveProperty('description');
        expect(pattern).toHaveProperty('data');
        expect(pattern).toHaveProperty('timestamp');
        expect(pattern).toHaveProperty('userId');
        
        expect(pattern.confidence).toBeGreaterThanOrEqual(0);
        expect(pattern.confidence).toBeLessThanOrEqual(1);
      });
    });

    it('should filter patterns by confidence threshold', async () => {
      const patterns = await service.analyzeUserPatterns('test-user');
      
      patterns.forEach(pattern => {
        expect(pattern.confidence).toBeGreaterThanOrEqual(0.5); // Our test threshold
      });
    });

    it('should cache results', async () => {
      // First call
      const patterns1 = await service.analyzeUserPatterns('test-user');
      
      // Second call should use cache (mock should only be called once)
      const patterns2 = await service.analyzeUserPatterns('test-user');
      
      expect(patterns1).toEqual(patterns2);
      expect(mockHistoryService.getHistory).toHaveBeenCalledTimes(1);
    });

    it('should prevent concurrent analysis', async () => {
      // Start two analyses simultaneously
      const promise1 = service.analyzeUserPatterns('test-user');
      const promise2 = service.analyzeUserPatterns('test-user');
      
      // One should succeed, one should fail
      const results = await Promise.allSettled([promise1, promise2]);
      
      const successes = results.filter(r => r.status === 'fulfilled');
      const failures = results.filter(r => r.status === 'rejected');
      
      expect(successes.length).toBe(1);
      expect(failures.length).toBe(1);
      
      if (failures[0].status === 'rejected') {
        expect(failures[0].reason.message).toContain('already in progress');
      }
    });
  });

  describe('getPatternsByType', () => {
    beforeEach(() => {
      // Setup mock data for specific pattern types
      mockHistoryService.getHistory.mockResolvedValue({
        records: [
          {
            id: 'calc-1',
            calculatorType: 'laser-cutting-cost',
            calculatorName: 'Laser Cutting Cost Calculator',
            inputs: { thickness: 5, material: 'steel' },
            outputs: { cost: 50 },
            timestamp: new Date('2024-01-01T10:00:00Z'),
            executionTime: 150,
            context: {},
            metadata: { version: '1.0', userAgent: 'test', sessionId: 'session-1' }
          },
          {
            id: 'calc-2',
            calculatorType: 'laser-cutting-cost',
            calculatorName: 'Laser Cutting Cost Calculator',
            inputs: { thickness: 5, material: 'steel' },
            outputs: { cost: 50 },
            timestamp: new Date('2024-01-01T11:00:00Z'),
            executionTime: 160,
            context: {},
            metadata: { version: '1.0', userAgent: 'test', sessionId: 'session-1' }
          }
        ],
        total: 2,
        pagination: { page: 1, limit: 1000, hasNext: false, hasPrevious: false }
      });

      mockPresetService.getPresets.mockResolvedValue({
        presets: [],
        total: 0,
        hasMore: false
      });

      mockPreferencesService.getPreferences.mockReturnValue({
        defaultUnits: 'metric',
        autoSaveCalculations: true,
        showAdvancedOptions: false,
        theme: 'light',
        language: 'en',
        notifications: { email: true, push: false, inApp: true },
        privacy: { shareUsageData: false, allowAnalytics: true },
        display: { compactMode: false, showTooltips: true, animationsEnabled: true }
      });
    });

    it('should return patterns of specific type', async () => {
      const parameterPatterns = await service.getPatternsByType('parameter-frequency', 'test-user');
      
      parameterPatterns.forEach(pattern => {
        expect(pattern.type).toBe('parameter-frequency');
      });
    });

    it('should return empty array for non-existent pattern type', async () => {
      const patterns = await service.getPatternsByType('anomaly-detection', 'test-user');
      expect(patterns).toEqual([]);
    });
  });

  describe('cache management', () => {
    it('should clear cache', () => {
      service.clearCache();
      // No error should be thrown
      expect(true).toBe(true);
    });
  });

  describe('error handling', () => {
    it('should handle service errors gracefully', async () => {
      mockHistoryService.getHistory.mockRejectedValue(new Error('Service error'));
      
      await expect(service.analyzeUserPatterns('test-user')).rejects.toThrow('Service error');
    });

    it('should handle empty data gracefully', async () => {
      mockHistoryService.getHistory.mockResolvedValue({
        records: [],
        total: 0,
        pagination: { page: 1, limit: 1000, hasNext: false, hasPrevious: false }
      });

      mockPresetService.getPresets.mockResolvedValue({
        presets: [],
        total: 0,
        hasMore: false
      });

      const patterns = await service.analyzeUserPatterns('test-user');
      expect(patterns).toEqual([]);
    });
  });
});
