/**
 * Recommendation Service Tests
 * Comprehensive test suite for the ML-based recommendation engine
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { RecommendationService, recommendationService } from '../../services/recommendationService';

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

// Import mocked services
import { calculationHistoryService } from '../../services/calculationHistoryService';
import { patternRecognitionService } from '../../services/patternRecognitionService';
import { parameterPresetService } from '../../services/parameterPresetService';
import { userPreferencesService } from '../../services/userPreferencesService';

const mockHistoryService = calculationHistoryService as any;
const mockPatternService = patternRecognitionService as any;
const mockPresetService = parameterPresetService as any;
const mockPreferencesService = userPreferencesService as any;

describe('RecommendationService', () => {
  let service: RecommendationService;

  beforeEach(() => {
    // Create a fresh service instance for each test
    service = new RecommendationService({
      cacheEnabled: false, // Disable cache for testing
      maxRecommendations: 10,
      minConfidenceThreshold: 0.1,
    });

    // Reset all mocks
    vi.clearAllMocks();

    // Setup default mock responses
    mockHistoryService.getHistory.mockResolvedValue({
      records: [],
      total: 0,
      pagination: { page: 1, limit: 1000, hasNext: false, hasPrevious: false }
    });

    mockPatternService.analyzeUserPatterns.mockResolvedValue([]);
    mockPresetService.getPresets.mockResolvedValue({ presets: [], total: 0, hasMore: false });
    mockPreferencesService.getPreferences.mockResolvedValue(null);
  });

  afterEach(() => {
    service.clearCache();
  });

  describe('initialization', () => {
    it('should initialize with default config', () => {
      const defaultService = new RecommendationService();
      expect(defaultService).toBeDefined();
      expect(defaultService.getCacheStats().size).toBe(0);
    });

    it('should initialize with custom config', () => {
      const customService = new RecommendationService({
        maxRecommendations: 5,
        minConfidenceThreshold: 0.5,
      });
      expect(customService).toBeDefined();
    });
  });

  describe('calculateConfidence', () => {
    it('should calculate confidence correctly', () => {
      const confidence = service.calculateConfidence(5, 0.8, 0.5, 0.7, 0.6);
      expect(confidence).toBeGreaterThan(0);
      expect(confidence).toBeLessThanOrEqual(1);
    });

    it('should return low confidence for all zero inputs', () => {
      const confidence = service.calculateConfidence(0, 0, 0, 0, 0);
      expect(confidence).toBeGreaterThanOrEqual(0);
      expect(confidence).toBeLessThan(0.5); // Should be low but not necessarily 0
    });

    it('should handle edge cases', () => {
      const confidence1 = service.calculateConfidence(100, 1.0, 0, 1.0, 1.0);
      expect(confidence1).toBeLessThanOrEqual(1);

      const confidence2 = service.calculateConfidence(0, 0, 100, 0, 0);
      expect(confidence2).toBeGreaterThanOrEqual(0);
    });
  });

  describe('generateRecommendations', () => {
    it('should generate recommendations successfully', async () => {
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
        pagination: { page: 1, limit: 1000, hasNext: false, hasPrevious: false }
      });

      const recommendations = await service.generateRecommendations({
        userId: 'test-user',
        calculatorType: 'laser-cutting-cost',
        recommendationType: ['parameter-value'],
      });

      expect(recommendations).toBeDefined();
      expect(Array.isArray(recommendations)).toBe(true);
    });

    it('should return recommendations with required properties', async () => {
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
        pagination: { page: 1, limit: 1000, hasNext: false, hasPrevious: false }
      });

      const recommendations = await service.generateRecommendations({
        userId: 'test-user',
        calculatorType: 'laser-cutting-cost',
        recommendationType: ['parameter-value'],
      });

      if (recommendations.length > 0) {
        const recommendation = recommendations[0];
        expect(recommendation).toHaveProperty('id');
        expect(recommendation).toHaveProperty('type');
        expect(recommendation).toHaveProperty('title');
        expect(recommendation).toHaveProperty('description');
        expect(recommendation).toHaveProperty('confidence');
        expect(recommendation).toHaveProperty('relevanceScore');
        expect(recommendation).toHaveProperty('data');
        expect(recommendation).toHaveProperty('explanation');
        expect(recommendation).toHaveProperty('actionable');
        expect(recommendation).toHaveProperty('timestamp');
      }
    });

    it('should filter recommendations by confidence threshold', async () => {
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
        pagination: { page: 1, limit: 1000, hasNext: false, hasPrevious: false }
      });

      const recommendations = await service.generateRecommendations({
        userId: 'test-user',
        minConfidence: 0.9, // Very high threshold
        recommendationType: ['parameter-value'],
      });

      // Should return fewer or no recommendations due to high threshold
      expect(recommendations.length).toBeLessThanOrEqual(1);
    });

    it('should handle empty data gracefully', async () => {
      const recommendations = await service.generateRecommendations({
        userId: 'test-user',
        recommendationType: ['parameter-value'],
      });

      expect(recommendations).toEqual([]);
    });
  });

  describe('getRecommendationsByType', () => {
    it('should return recommendations of specific type', async () => {
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
        pagination: { page: 1, limit: 1000, hasNext: false, hasPrevious: false }
      });

      const recommendations = await service.getRecommendationsByType('parameter-value', {
        userId: 'test-user',
        calculatorType: 'laser-cutting-cost',
      });

      expect(recommendations).toBeDefined();
      recommendations.forEach(rec => {
        expect(rec.type).toBe('parameter-value');
      });
    });
  });

  describe('parameter combination recommendations', () => {
    it('should generate parameter combination recommendations', async () => {
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
          inputs: { thickness: 5, material: 'steel' },
          outputs: { cost: 50 },
          timestamp: new Date(),
          executionTime: 1000,
        },
      ];

      mockHistoryService.getHistory.mockResolvedValue({
        records: mockHistoryData,
        total: mockHistoryData.length,
        pagination: { page: 1, limit: 1000, hasNext: false, hasPrevious: false }
      });

      const recommendations = await service.getRecommendationsByType('parameter-combination', {
        userId: 'test-user',
        calculatorType: 'laser-cutting-cost',
      });

      expect(recommendations).toBeDefined();
      if (recommendations.length > 0) {
        expect(recommendations[0].type).toBe('parameter-combination');
        expect(recommendations[0].data).toHaveProperty('parameters');
        expect(recommendations[0].data).toHaveProperty('successRate');
      }
    });
  });

  describe('cache management', () => {
    it('should cache results when enabled', async () => {
      const cachedService = new RecommendationService({ cacheEnabled: true });
      
      mockHistoryService.getHistory.mockResolvedValue({
        records: [],
        total: 0,
        pagination: { page: 1, limit: 1000, hasNext: false, hasPrevious: false }
      });

      const request = { userId: 'test-user', recommendationType: ['parameter-value'] as any };
      
      await cachedService.generateRecommendations(request);
      await cachedService.generateRecommendations(request);

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

      const recommendations = await service.generateRecommendations({
        userId: 'test-user',
        recommendationType: ['parameter-value'],
      });

      expect(recommendations).toEqual([]);
    });
  });
});
