/**
 * Confidence Scoring Service Tests
 * Comprehensive test suite for the confidence scoring system
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ConfidenceScoringService, confidenceScoringService } from '../../services/confidenceScoringService';

describe('ConfidenceScoringService', () => {
  let service: ConfidenceScoringService;

  beforeEach(() => {
    service = new ConfidenceScoringService();
  });

  describe('initialization', () => {
    it('should initialize with default config', () => {
      const defaultService = new ConfidenceScoringService();
      expect(defaultService).toBeDefined();
    });

    it('should initialize with custom config', () => {
      const customService = new ConfidenceScoringService({
        thresholds: {
          veryLow: 0.1,
          low: 0.3,
          medium: 0.5,
          high: 0.7,
          veryHigh: 0.9,
        },
      });
      expect(customService).toBeDefined();
    });
  });

  describe('calculateRecommendationConfidence', () => {
    it('should calculate high confidence for good recommendation data', () => {
      const data = {
        frequency: 10,
        successRate: 0.9,
        recency: 0.8,
        similarity: 0.85,
        userFeedback: 0.9,
      };

      const context = {
        dataSource: 'user-history',
        sampleSize: 100,
        timeRange: '30-days',
        userExperience: 'expert' as const,
        domainComplexity: 'moderate' as const,
        historicalAccuracy: 0.85,
      };

      const result = service.calculateRecommendationConfidence(data, context);

      expect(result.score).toBeGreaterThan(0.7);
      expect(result.level).toMatch(/high|very-high/);
      expect(result.factors).toHaveLength(6);
      expect(result.explanation).toContain('confidence');
      expect(result.visualIndicator).toHaveProperty('color');
      expect(result.reliability).toBeGreaterThan(0.5);
    });

    it('should calculate low confidence for poor recommendation data', () => {
      const data = {
        frequency: 1,
        successRate: 0.3,
        recency: 0.2,
        similarity: 0.4,
        userFeedback: 0.2,
      };

      const context = {
        dataSource: 'limited-data',
        sampleSize: 5,
        timeRange: '7-days',
        userExperience: 'novice' as const,
        domainComplexity: 'complex' as const,
      };

      const result = service.calculateRecommendationConfidence(data, context);

      expect(result.score).toBeLessThan(0.6);
      expect(result.level).toMatch(/low|very-low|medium/);
      expect(result.factors).toHaveLength(6);
      expect(result.reliability).toBeLessThan(1.0);
    });

    it('should handle missing user feedback gracefully', () => {
      const data = {
        frequency: 5,
        successRate: 0.7,
        recency: 0.6,
        similarity: 0.7,
      };

      const context = {
        dataSource: 'user-history',
        sampleSize: 50,
        timeRange: '30-days',
        userExperience: 'intermediate' as const,
        domainComplexity: 'simple' as const,
      };

      const result = service.calculateRecommendationConfidence(data, context);

      expect(result.factors).toHaveLength(5); // No user feedback factor
      expect(result.score).toBeGreaterThan(0);
      expect(result.score).toBeLessThanOrEqual(1);
    });
  });

  describe('calculatePatternConfidence', () => {
    it('should calculate high confidence for strong patterns', () => {
      const data = {
        frequency: 15,
        consistency: 0.9,
        significance: 0.95,
        coverage: 0.8,
      };

      const context = {
        dataSource: 'pattern-analysis',
        sampleSize: 200,
        timeRange: '90-days',
        userExperience: 'expert' as const,
        domainComplexity: 'moderate' as const,
        historicalAccuracy: 0.9,
      };

      const result = service.calculatePatternConfidence(data, context);

      expect(result.score).toBeGreaterThan(0.7);
      expect(result.level).toMatch(/high|very-high/);
      expect(result.factors).toHaveLength(4);
      expect(result.explanation).toContain('confidence');
    });

    it('should calculate low confidence for weak patterns', () => {
      const data = {
        frequency: 2,
        consistency: 0.4,
        significance: 0.3,
        coverage: 0.2,
      };

      const context = {
        dataSource: 'limited-analysis',
        sampleSize: 10,
        timeRange: '7-days',
        userExperience: 'novice' as const,
        domainComplexity: 'complex' as const,
      };

      const result = service.calculatePatternConfidence(data, context);

      expect(result.score).toBeLessThan(0.5);
      expect(result.level).toMatch(/low|very-low/);
      expect(result.factors).toHaveLength(4);
    });
  });

  describe('calculateDefaultConfidence', () => {
    it('should calculate high confidence for frequently used defaults', () => {
      const data = {
        frequency: 20,
        contextMatch: 0.9,
        patternStrength: 0.8,
        userAcceptance: 0.95,
      };

      const context = {
        dataSource: 'usage-history',
        sampleSize: 150,
        timeRange: '60-days',
        userExperience: 'expert' as const,
        domainComplexity: 'simple' as const,
        historicalAccuracy: 0.88,
      };

      const result = service.calculateDefaultConfidence(data, context);

      expect(result.score).toBeGreaterThan(0.7);
      expect(result.level).toMatch(/high|very-high/);
      expect(result.factors).toHaveLength(4);
      expect(result.explanation).toContain('confidence');
    });

    it('should calculate medium confidence for moderately used defaults', () => {
      const data = {
        frequency: 5,
        contextMatch: 0.6,
        patternStrength: 0.5,
        userAcceptance: 0.7,
      };

      const context = {
        dataSource: 'usage-history',
        sampleSize: 50,
        timeRange: '30-days',
        userExperience: 'intermediate' as const,
        domainComplexity: 'moderate' as const,
      };

      const result = service.calculateDefaultConfidence(data, context);

      expect(result.score).toBeGreaterThan(0.3);
      expect(result.score).toBeLessThan(0.8);
      expect(result.level).toMatch(/low|medium/);
    });

    it('should handle missing user acceptance gracefully', () => {
      const data = {
        frequency: 8,
        contextMatch: 0.7,
        patternStrength: 0.6,
      };

      const context = {
        dataSource: 'usage-history',
        sampleSize: 75,
        timeRange: '45-days',
        userExperience: 'intermediate' as const,
        domainComplexity: 'moderate' as const,
      };

      const result = service.calculateDefaultConfidence(data, context);

      expect(result.factors).toHaveLength(3); // No user acceptance factor
      expect(result.score).toBeGreaterThan(0);
      expect(result.score).toBeLessThanOrEqual(1);
    });
  });

  describe('confidence levels and visual indicators', () => {
    it('should return correct confidence levels for different scores', () => {
      const testCases = [
        { score: 0.95, expectedLevel: /very-high|high|medium/ },
        { score: 0.85, expectedLevel: /high|very-high|medium/ },
        { score: 0.65, expectedLevel: /medium|high|low/ },
        { score: 0.45, expectedLevel: /low|medium|very-low/ },
        { score: 0.15, expectedLevel: /very-low|low/ },
      ];

      testCases.forEach(({ score, expectedLevel }) => {
        const data = {
          frequency: score * 10,
          successRate: score,
          recency: score,
          similarity: score,
        };

        const context = {
          dataSource: 'test',
          sampleSize: 100,
          timeRange: '30-days',
          userExperience: 'intermediate' as const,
          domainComplexity: 'moderate' as const,
        };

        const result = service.calculateRecommendationConfidence(data, context);
        expect(result.level).toMatch(expectedLevel);
        expect(result.visualIndicator.label).toBeDefined();
        expect(result.visualIndicator.color).toBeDefined();
        expect(result.visualIndicator.cssClass).toBeDefined();
      });
    });

    it('should provide consistent visual indicators for same confidence levels', () => {
      const data1 = {
        frequency: 8,
        successRate: 0.8,
        recency: 0.8,
        similarity: 0.8,
      };

      const data2 = {
        frequency: 9,
        successRate: 0.85,
        recency: 0.75,
        similarity: 0.85,
      };

      const context = {
        dataSource: 'test',
        sampleSize: 100,
        timeRange: '30-days',
        userExperience: 'intermediate' as const,
        domainComplexity: 'moderate' as const,
      };

      const result1 = service.calculateRecommendationConfidence(data1, context);
      const result2 = service.calculateRecommendationConfidence(data2, context);

      if (result1.level === result2.level) {
        expect(result1.visualIndicator.color).toBe(result2.visualIndicator.color);
        expect(result1.visualIndicator.label).toBe(result2.visualIndicator.label);
      }
    });
  });

  describe('edge cases and error handling', () => {
    it('should handle extreme values gracefully', () => {
      const data = {
        frequency: 1000,
        successRate: 1.0,
        recency: 1.0,
        similarity: 1.0,
        userFeedback: 1.0,
      };

      const context = {
        dataSource: 'extreme-test',
        sampleSize: 10000,
        timeRange: '365-days',
        userExperience: 'expert' as const,
        domainComplexity: 'simple' as const,
        historicalAccuracy: 1.0,
      };

      const result = service.calculateRecommendationConfidence(data, context);

      expect(result.score).toBeLessThanOrEqual(1.0);
      expect(result.score).toBeGreaterThanOrEqual(0.0);
      expect(result.reliability).toBeLessThanOrEqual(1.0);
      expect(result.reliability).toBeGreaterThanOrEqual(0.0);
    });

    it('should handle zero values gracefully', () => {
      const data = {
        frequency: 0,
        successRate: 0,
        recency: 0,
        similarity: 0,
        userFeedback: 0,
      };

      const context = {
        dataSource: 'zero-test',
        sampleSize: 0,
        timeRange: '0-days',
        userExperience: 'novice' as const,
        domainComplexity: 'complex' as const,
      };

      const result = service.calculateRecommendationConfidence(data, context);

      expect(result.score).toBeGreaterThanOrEqual(0.0);
      expect(result.score).toBeLessThanOrEqual(1.0);
      expect(result.level).toBe('very-low');
    });
  });
});
