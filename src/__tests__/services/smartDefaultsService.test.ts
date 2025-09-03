/**
 * Smart Defaults Service Tests
 * Comprehensive test suite for the intelligent default value system
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { SmartDefaultsService, smartDefaultsService } from '../../services/smartDefaultsService';

// Mock the dependent services
vi.mock('../../services/calculationHistoryService', () => ({
  calculationHistoryService: {
    getHistory: vi.fn(),
  },
}));

vi.mock('../../services/patternRecognitionService', () => ({
  patternRecognitionService: {
    analyzeUserPatterns: vi.fn(),
  },
}));

vi.mock('../../services/recommendationService', () => ({
  recommendationService: {
    generateRecommendations: vi.fn(),
  },
}));

vi.mock('../../services/userPreferencesService', () => ({
  userPreferencesService: {
    getPreferences: vi.fn(),
  },
}));

// Import mocked services
import { calculationHistoryService } from '../../services/calculationHistoryService';
import { patternRecognitionService } from '../../services/patternRecognitionService';
import { recommendationService } from '../../services/recommendationService';
import { userPreferencesService } from '../../services/userPreferencesService';

const mockHistoryService = calculationHistoryService as any;
const mockPatternService = patternRecognitionService as any;
const mockRecommendationService = recommendationService as any;
const mockPreferencesService = userPreferencesService as any;

describe('SmartDefaultsService', () => {
  let service: SmartDefaultsService;

  beforeEach(() => {
    // Create a fresh service instance for each test
    service = new SmartDefaultsService({
      cacheEnabled: false, // Disable cache for testing
      maxDefaultsPerParameter: 5,
      minConfidenceThreshold: 0.1,
    });

    // Reset all mocks
    vi.clearAllMocks();

    // Setup default mock responses
    mockHistoryService.getHistory.mockResolvedValue({
      records: [],
      total: 0,
      pagination: { page: 1, limit: 500, hasNext: false, hasPrevious: false }
    });

    mockPatternService.analyzeUserPatterns.mockResolvedValue([]);
    mockRecommendationService.generateRecommendations.mockResolvedValue([]);
    mockPreferencesService.getPreferences.mockResolvedValue(null);
  });

  afterEach(() => {
    service.clearCache();
  });

  describe('initialization', () => {
    it('should initialize with default config', () => {
      const defaultService = new SmartDefaultsService();
      expect(defaultService).toBeDefined();
      expect(defaultService.getCacheStats().size).toBe(0);
    });

    it('should initialize with custom config', () => {
      const customService = new SmartDefaultsService({
        maxDefaultsPerParameter: 3,
        minConfidenceThreshold: 0.5,
      });
      expect(customService).toBeDefined();
    });
  });

  describe('calculateConfidence', () => {
    it('should calculate confidence correctly', () => {
      const confidence = service.calculateConfidence(5, 0.8, 0.7, 0.6, 0.5);
      expect(confidence).toBeGreaterThan(0);
      expect(confidence).toBeLessThanOrEqual(1);
    });

    it('should return low confidence for all zero inputs', () => {
      const confidence = service.calculateConfidence(0, 0, 0, 0, 0);
      expect(confidence).toBeGreaterThanOrEqual(0);
      expect(confidence).toBeLessThan(0.5);
    });

    it('should handle edge cases', () => {
      const confidence1 = service.calculateConfidence(100, 1.0, 1.0, 1.0, 1.0);
      expect(confidence1).toBeLessThanOrEqual(1);

      const confidence2 = service.calculateConfidence(0, 0, 0, 0, 0);
      expect(confidence2).toBeGreaterThanOrEqual(0);
    });
  });

  describe('getSmartDefaults', () => {
    it('should generate smart defaults successfully', async () => {
      // Setup mock data
      const mockHistoryData = [
        {
          id: 'calc-1',
          calculatorType: 'laser-cutting-cost',
          inputs: { thickness: 5, material: 'steel' },
          outputs: { cost: 50 },
          timestamp: new Date(),
          executionTime: 1000,
        },
        {
          id: 'calc-2',
          calculatorType: 'laser-cutting-cost',
          inputs: { thickness: 5, material: 'aluminum' },
          outputs: { cost: 30 },
          timestamp: new Date(),
          executionTime: 800,
        },
      ];

      mockHistoryService.getHistory.mockResolvedValue({
        records: mockHistoryData,
        total: mockHistoryData.length,
        pagination: { page: 1, limit: 500, hasNext: false, hasPrevious: false }
      });

      const defaults = await service.getSmartDefaults({
        userId: 'test-user',
        calculatorType: 'laser-cutting-cost',
        parameterName: 'thickness',
      });

      expect(defaults).toBeDefined();
      expect(Array.isArray(defaults)).toBe(true);
    });

    it('should return defaults with required properties', async () => {
      const mockHistoryData = [
        {
          id: 'calc-1',
          calculatorType: 'laser-cutting-cost',
          inputs: { thickness: 5 },
          outputs: { cost: 50 },
          timestamp: new Date(),
          executionTime: 1000,
        },
        {
          id: 'calc-2',
          calculatorType: 'laser-cutting-cost',
          inputs: { thickness: 5 },
          outputs: { cost: 50 },
          timestamp: new Date(),
          executionTime: 1000,
        },
      ];

      mockHistoryService.getHistory.mockResolvedValue({
        records: mockHistoryData,
        total: mockHistoryData.length,
        pagination: { page: 1, limit: 500, hasNext: false, hasPrevious: false }
      });

      const defaults = await service.getSmartDefaults({
        userId: 'test-user',
        calculatorType: 'laser-cutting-cost',
        parameterName: 'thickness',
      });

      if (defaults.length > 0) {
        const defaultValue = defaults[0];
        expect(defaultValue).toHaveProperty('id');
        expect(defaultValue).toHaveProperty('parameterName');
        expect(defaultValue).toHaveProperty('value');
        expect(defaultValue).toHaveProperty('type');
        expect(defaultValue).toHaveProperty('confidence');
        expect(defaultValue).toHaveProperty('relevanceScore');
        expect(defaultValue).toHaveProperty('explanation');
        expect(defaultValue).toHaveProperty('source');
        expect(defaultValue).toHaveProperty('metadata');
        expect(defaultValue).toHaveProperty('timestamp');
      }
    });

    it('should filter defaults by confidence threshold', async () => {
      const mockHistoryData = [
        {
          id: 'calc-1',
          calculatorType: 'laser-cutting-cost',
          inputs: { thickness: 5 },
          outputs: { cost: 50 },
          timestamp: new Date(),
          executionTime: 1000,
        },
      ];

      mockHistoryService.getHistory.mockResolvedValue({
        records: mockHistoryData,
        total: mockHistoryData.length,
        pagination: { page: 1, limit: 500, hasNext: false, hasPrevious: false }
      });

      const defaults = await service.getSmartDefaults({
        userId: 'test-user',
        calculatorType: 'laser-cutting-cost',
        parameterName: 'thickness',
        options: {
          minConfidence: 0.9, // Very high threshold
        },
      });

      // Should return fewer or no defaults due to high threshold
      expect(defaults.length).toBeLessThanOrEqual(1);
    });

    it('should return fallback default when no smart defaults found', async () => {
      const defaults = await service.getSmartDefaults({
        userId: 'test-user',
        calculatorType: 'laser-cutting-cost',
        parameterName: 'thickness',
      });

      expect(defaults.length).toBeGreaterThan(0);
      expect(defaults[0].type).toBe('fallback');
      expect(defaults[0].value).toBe(3); // From fallback config
    });
  });

  describe('getDefaultByType', () => {
    it('should return default of specific type', async () => {
      const mockHistoryData = [
        {
          id: 'calc-1',
          calculatorType: 'laser-cutting-cost',
          inputs: { thickness: 5 },
          outputs: { cost: 50 },
          timestamp: new Date(),
          executionTime: 1000,
        },
        {
          id: 'calc-2',
          calculatorType: 'laser-cutting-cost',
          inputs: { thickness: 5 },
          outputs: { cost: 50 },
          timestamp: new Date(),
          executionTime: 1000,
        },
      ];

      mockHistoryService.getHistory.mockResolvedValue({
        records: mockHistoryData,
        total: mockHistoryData.length,
        pagination: { page: 1, limit: 500, hasNext: false, hasPrevious: false }
      });

      const defaultValue = await service.getDefaultByType('frequency-based', {
        userId: 'test-user',
        calculatorType: 'laser-cutting-cost',
        parameterName: 'thickness',
      });

      if (defaultValue) {
        expect(defaultValue.type).toBe('frequency-based');
      }
    });
  });

  describe('recordFeedback', () => {
    it('should record user feedback', () => {
      service.recordFeedback('test-default-id', true, 'test-user');
      service.recordFeedback('test-default-id', false, 'test-user');
      
      // Should not throw errors
      expect(true).toBe(true);
    });
  });

  describe('frequency-based defaults', () => {
    it('should generate frequency-based defaults', async () => {
      const mockHistoryData = [
        {
          id: 'calc-1',
          calculatorType: 'laser-cutting-cost',
          inputs: { thickness: 5 },
          outputs: { cost: 50 },
          timestamp: new Date(),
          executionTime: 1000,
        },
        {
          id: 'calc-2',
          calculatorType: 'laser-cutting-cost',
          inputs: { thickness: 5 },
          outputs: { cost: 50 },
          timestamp: new Date(),
          executionTime: 1000,
        },
      ];

      mockHistoryService.getHistory.mockResolvedValue({
        records: mockHistoryData,
        total: mockHistoryData.length,
        pagination: { page: 1, limit: 500, hasNext: false, hasPrevious: false }
      });

      const defaults = await service.getSmartDefaults({
        userId: 'test-user',
        calculatorType: 'laser-cutting-cost',
        parameterName: 'thickness',
        options: {
          includeTypes: ['frequency-based'],
        },
      });

      const frequencyDefaults = defaults.filter(d => d.type === 'frequency-based');
      if (frequencyDefaults.length > 0) {
        expect(frequencyDefaults[0].type).toBe('frequency-based');
        expect(frequencyDefaults[0].metadata).toHaveProperty('frequency');
      }
    });
  });

  describe('cache management', () => {
    it('should cache results when enabled', async () => {
      const cachedService = new SmartDefaultsService({ cacheEnabled: true });
      
      mockHistoryService.getHistory.mockResolvedValue({
        records: [],
        total: 0,
        pagination: { page: 1, limit: 500, hasNext: false, hasPrevious: false }
      });

      const request = {
        userId: 'test-user',
        calculatorType: 'laser-cutting-cost',
        parameterName: 'thickness',
      };
      
      await cachedService.getSmartDefaults(request);
      await cachedService.getSmartDefaults(request);

      // Should only call the service once due to caching
      expect(mockHistoryService.getHistory).toHaveBeenCalledTimes(1);
      
      cachedService.clearCache();
    });

    it('should clear cache', () => {
      service.clearCache();
      const stats = service.getCacheStats();
      expect(stats.size).toBe(0);
      expect(stats.keys).toEqual([]);
    });
  });

  describe('error handling', () => {
    it('should handle service errors gracefully', async () => {
      mockHistoryService.getHistory.mockRejectedValue(new Error('Service error'));

      const defaults = await service.getSmartDefaults({
        userId: 'test-user',
        calculatorType: 'laser-cutting-cost',
        parameterName: 'thickness',
      });

      // Should return fallback default
      expect(defaults.length).toBeGreaterThan(0);
      expect(defaults[0].type).toBe('fallback');
    });
  });
});
