/**
 * Smart Defaults Service
 * Intelligent default value system based on user history, patterns, and context
 */

import { calculationHistoryService } from './calculationHistoryService';
import { patternRecognitionService } from './patternRecognitionService';
import { recommendationService } from './recommendationService';
import { userPreferencesService } from './userPreferencesService';

// ============================================================================
// Types and Interfaces
// ============================================================================

export type DefaultValueType = 
  | 'frequency-based'
  | 'context-aware'
  | 'pattern-based'
  | 'recommendation-integrated'
  | 'adaptive-learning'
  | 'fallback';

export interface DefaultValueRequest {
  userId?: string;
  calculatorType: string;
  parameterName: string;
  context?: {
    timeOfDay?: string;
    taskType?: string;
    deviceType?: string;
    urgency?: 'low' | 'medium' | 'high';
    sessionContext?: Record<string, any>;
  };
  currentParameters?: Record<string, any>;
  options?: {
    includeTypes?: DefaultValueType[];
    minConfidence?: number;
    maxResults?: number;
    enableLearning?: boolean;
  };
}

export interface DefaultValueResult {
  id: string;
  parameterName: string;
  value: any;
  type: DefaultValueType;
  confidence: number;
  relevanceScore: number;
  explanation: string;
  source: string;
  metadata: {
    frequency?: number;
    recency?: number;
    contextMatch?: number;
    patternConfidence?: number;
    recommendationScore?: number;
    learningScore?: number;
  };
  timestamp: Date;
  userId?: string;
}

export interface FrequencyBasedDefault {
  value: any;
  frequency: number;
  recency: number;
  consistency: number;
  lastUsed: Date;
}

export interface ContextAwareDefault {
  value: any;
  contextSimilarity: number;
  usageCount: number;
  successRate: number;
  contextFactors: string[];
}

export interface PatternBasedDefault {
  value: any;
  patternType: string;
  patternConfidence: number;
  correlationStrength: number;
  patternFrequency: number;
}

export interface RecommendationIntegratedDefault {
  value: any;
  recommendationType: string;
  recommendationConfidence: number;
  relevanceScore: number;
  actionable: boolean;
}

// ============================================================================
// Service Configuration
// ============================================================================

export interface SmartDefaultsServiceConfig {
  cacheEnabled: boolean;
  cacheTTL: number; // in milliseconds
  maxDefaultsPerParameter: number;
  minConfidenceThreshold: number;
  enableAdaptiveLearning: boolean;
  algorithmWeights: {
    frequency: number;
    context: number;
    pattern: number;
    recommendation: number;
    learning: number;
  };
  fallbackDefaults: Record<string, Record<string, any>>;
}

const DEFAULT_CONFIG: SmartDefaultsServiceConfig = {
  cacheEnabled: true,
  cacheTTL: 180000, // 3 minutes
  maxDefaultsPerParameter: 5,
  minConfidenceThreshold: 0.4,
  enableAdaptiveLearning: true,
  algorithmWeights: {
    frequency: 0.35,
    context: 0.25,
    pattern: 0.2,
    recommendation: 0.15,
    learning: 0.05,
  },
  fallbackDefaults: {
    'laser-cutting-cost': {
      thickness: 3,
      material: 'steel',
      area: 100,
      quantity: 1,
    },
    'cutting-time-estimator': {
      length: 100,
      speed: 10,
      thickness: 3,
    },
    'laser-parameter-optimizer': {
      power: 80,
      speed: 1000,
      frequency: 20000,
    },
  },
};

// ============================================================================
// Smart Defaults Service Class
// ============================================================================

export class SmartDefaultsService {
  private config: SmartDefaultsServiceConfig;
  private cache: Map<string, { data: DefaultValueResult[]; timestamp: number }>;
  private calculationInProgress: Set<string>;
  private userFeedback: Map<string, { accepted: number; rejected: number }>;

  constructor(config: Partial<SmartDefaultsServiceConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.cache = new Map();
    this.calculationInProgress = new Set();
    this.userFeedback = new Map();
  }

  // ============================================================================
  // Public API Methods
  // ============================================================================

  /**
   * Get smart default values for a parameter
   */
  public async getSmartDefaults(
    request: DefaultValueRequest
  ): Promise<DefaultValueResult[]> {
    const cacheKey = this.generateCacheKey(request);
    
    // Check cache first
    if (this.config.cacheEnabled && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)!;
      if (Date.now() - cached.timestamp < this.config.cacheTTL) {
        return cached.data;
      }
    }

    // Prevent concurrent calculations for same request
    if (this.calculationInProgress.has(cacheKey)) {
      await this.waitForCalculation(cacheKey);
      return this.cache.get(cacheKey)?.data || [];
    }

    this.calculationInProgress.add(cacheKey);

    try {
      const defaults: DefaultValueResult[] = [];
      const userId = request.userId || 'anonymous-user';

      // Collect data from all sources
      const [historyData, patterns, recommendations, preferences] = await Promise.all([
        this.collectHistoryData(userId, request.calculatorType),
        this.collectPatternData(userId),
        this.collectRecommendationData(userId, request),
        this.collectPreferenceData(userId),
      ]);

      // Generate different types of defaults
      const requestedTypes = request.options?.includeTypes || [
        'frequency-based',
        'context-aware',
        'pattern-based',
        'recommendation-integrated',
      ];

      for (const type of requestedTypes) {
        const typeDefaults = await this.generateDefaultsByType(
          type,
          request,
          { historyData, patterns, recommendations, preferences }
        );
        defaults.push(...typeDefaults);
      }

      // Filter by confidence threshold
      const filteredDefaults = defaults.filter(
        d => d.confidence >= (request.options?.minConfidence || this.config.minConfidenceThreshold)
      );

      // Sort by relevance and confidence
      const sortedDefaults = this.sortDefaults(filteredDefaults);

      // Apply limit
      const limitedDefaults = sortedDefaults.slice(
        0, 
        request.options?.maxResults || this.config.maxDefaultsPerParameter
      );

      // Add fallback if no smart defaults found
      if (limitedDefaults.length === 0) {
        const fallbackDefault = this.getFallbackDefault(request);
        if (fallbackDefault) {
          limitedDefaults.push(fallbackDefault);
        }
      }

      // Cache results
      if (this.config.cacheEnabled) {
        this.cache.set(cacheKey, {
          data: limitedDefaults,
          timestamp: Date.now(),
        });
      }

      return limitedDefaults;
    } finally {
      this.calculationInProgress.delete(cacheKey);
    }
  }

  /**
   * Get default value by specific type
   */
  public async getDefaultByType(
    type: DefaultValueType,
    request: Omit<DefaultValueRequest, 'options'>
  ): Promise<DefaultValueResult | null> {
    const defaults = await this.getSmartDefaults({
      ...request,
      options: {
        includeTypes: [type],
        maxResults: 1,
      },
    });

    return defaults.length > 0 ? defaults[0] : null;
  }

  /**
   * Record user feedback on default value
   */
  public recordFeedback(
    defaultId: string,
    accepted: boolean,
    userId?: string
  ): void {
    const feedbackKey = `${userId || 'anonymous'}-${defaultId}`;
    
    if (!this.userFeedback.has(feedbackKey)) {
      this.userFeedback.set(feedbackKey, { accepted: 0, rejected: 0 });
    }

    const feedback = this.userFeedback.get(feedbackKey)!;
    if (accepted) {
      feedback.accepted++;
    } else {
      feedback.rejected++;
    }

    // Clear cache to force recalculation with new feedback
    this.clearCache();
  }

  /**
   * Calculate default value confidence score
   */
  public calculateConfidence(
    frequency: number,
    contextMatch: number,
    patternStrength: number,
    recommendationScore: number,
    learningScore: number
  ): number {
    const weights = this.config.algorithmWeights;
    
    // Normalize inputs to 0-1 range
    const normalizedFrequency = Math.min(frequency / 10, 1);
    const normalizedPattern = Math.min(patternStrength, 1);
    
    const confidence = 
      weights.frequency * normalizedFrequency +
      weights.context * contextMatch +
      weights.pattern * normalizedPattern +
      weights.recommendation * recommendationScore +
      weights.learning * learningScore;

    return Math.min(Math.max(confidence, 0), 1);
  }

  // ============================================================================
  // Data Collection Methods
  // ============================================================================

  private async collectHistoryData(userId: string, calculatorType: string) {
    try {
      const response = await calculationHistoryService.getHistory({
        userId,
        calculatorType,
        limit: 500,
        sortBy: 'timestamp',
        sortOrder: 'desc',
      });
      return response.records;
    } catch (error) {
      console.warn('Failed to collect history data:', error);
      return [];
    }
  }

  private async collectPatternData(userId: string) {
    try {
      return await patternRecognitionService.analyzeUserPatterns(userId);
    } catch (error) {
      console.warn('Failed to collect pattern data:', error);
      return [];
    }
  }

  private async collectRecommendationData(userId: string, request: DefaultValueRequest) {
    try {
      return await recommendationService.generateRecommendations({
        userId,
        calculatorType: request.calculatorType,
        currentParameters: request.currentParameters,
        context: request.context,
        recommendationType: ['parameter-value', 'parameter-combination'],
        limit: 5,
      });
    } catch (error) {
      console.warn('Failed to collect recommendation data:', error);
      return [];
    }
  }

  private async collectPreferenceData(userId: string) {
    try {
      return await userPreferencesService.getPreferences(userId);
    } catch (error) {
      console.warn('Failed to collect preference data:', error);
      return null;
    }
  }

  // ============================================================================
  // Default Value Generation Methods
  // ============================================================================

  private async generateDefaultsByType(
    type: DefaultValueType,
    request: DefaultValueRequest,
    data: any
  ): Promise<DefaultValueResult[]> {
    switch (type) {
      case 'frequency-based':
        return this.generateFrequencyBasedDefaults(request, data);
      case 'context-aware':
        return this.generateContextAwareDefaults(request, data);
      case 'pattern-based':
        return this.generatePatternBasedDefaults(request, data);
      case 'recommendation-integrated':
        return this.generateRecommendationIntegratedDefaults(request, data);
      case 'adaptive-learning':
        return this.generateAdaptiveLearningDefaults(request, data);
      default:
        return [];
    }
  }

  private async generateFrequencyBasedDefaults(
    request: DefaultValueRequest,
    data: any
  ): Promise<DefaultValueResult[]> {
    const defaults: DefaultValueResult[] = [];
    const { historyData } = data;

    if (!historyData || historyData.length === 0) {
      return defaults;
    }

    // Analyze parameter frequency
    const parameterStats: Map<any, { 
      count: number; 
      recency: number; 
      consistency: number;
      lastUsed: Date;
    }> = new Map();

    historyData.forEach((record: any, index: number) => {
      const value = record.inputs[request.parameterName];
      if (value !== undefined) {
        if (!parameterStats.has(value)) {
          parameterStats.set(value, {
            count: 0,
            recency: 0,
            consistency: 0,
            lastUsed: new Date(record.timestamp),
          });
        }

        const stats = parameterStats.get(value)!;
        stats.count++;
        
        // Calculate recency weight (more recent = higher weight)
        const daysSinceUsed = (Date.now() - new Date(record.timestamp).getTime()) / (1000 * 60 * 60 * 24);
        stats.recency += Math.max(0, 1 - daysSinceUsed / 30); // 30 days decay
        
        // Update last used
        if (new Date(record.timestamp) > stats.lastUsed) {
          stats.lastUsed = new Date(record.timestamp);
        }
      }
    });

    // Calculate consistency for each value
    parameterStats.forEach((stats, value) => {
      stats.consistency = stats.count / historyData.length;
    });

    // Generate defaults for top values
    const sortedValues = Array.from(parameterStats.entries())
      .sort(([,a], [,b]) => (b.count * b.recency) - (a.count * a.recency))
      .slice(0, 3);

    sortedValues.forEach(([value, stats]) => {
      if (stats.count >= 2) { // Minimum frequency threshold
        const frequency = stats.count;
        const recency = stats.recency / stats.count;
        const consistency = stats.consistency;
        
        const confidence = this.calculateConfidence(
          frequency,
          0.5, // Neutral context match for frequency-based
          0.5, // Neutral pattern strength
          0.5, // Neutral recommendation score
          0.5  // Neutral learning score
        );

        defaults.push({
          id: `freq-${request.parameterName}-${value}-${Date.now()}`,
          parameterName: request.parameterName,
          value,
          type: 'frequency-based',
          confidence,
          relevanceScore: frequency * recency * consistency,
          explanation: `Most frequently used value (${frequency} times) with good recency`,
          source: 'User History Analysis',
          metadata: {
            frequency,
            recency,
            contextMatch: 0.5,
          },
          timestamp: new Date(),
          userId: request.userId,
        });
      }
    });

    return defaults;
  }

  private async generateContextAwareDefaults(
    request: DefaultValueRequest,
    data: any
  ): Promise<DefaultValueResult[]> {
    const defaults: DefaultValueResult[] = [];
    const { historyData } = data;
    const context = request.context;

    if (!historyData || historyData.length === 0 || !context) {
      return defaults;
    }

    // Analyze context similarity
    const contextMatches: Map<any, {
      count: number;
      similarity: number;
      successRate: number;
      contexts: string[];
    }> = new Map();

    historyData.forEach((record: any) => {
      const value = record.inputs[request.parameterName];
      if (value !== undefined) {
        // Calculate context similarity
        let similarity = 0;
        let factors = 0;

        // Time context matching
        if (context.timeOfDay && record.metadata?.timeOfDay) {
          similarity += context.timeOfDay === record.metadata.timeOfDay ? 1 : 0;
          factors++;
        }

        // Task type matching
        if (context.taskType && record.metadata?.taskType) {
          similarity += context.taskType === record.metadata.taskType ? 1 : 0;
          factors++;
        }

        // Device type matching
        if (context.deviceType && record.metadata?.deviceType) {
          similarity += context.deviceType === record.metadata.deviceType ? 1 : 0;
          factors++;
        }

        // Urgency matching
        if (context.urgency && record.metadata?.urgency) {
          similarity += context.urgency === record.metadata.urgency ? 1 : 0;
          factors++;
        }

        const contextSimilarity = factors > 0 ? similarity / factors : 0.5;

        if (contextSimilarity > 0.3) { // Minimum similarity threshold
          if (!contextMatches.has(value)) {
            contextMatches.set(value, {
              count: 0,
              similarity: 0,
              successRate: 0,
              contexts: [],
            });
          }

          const match = contextMatches.get(value)!;
          match.count++;
          match.similarity += contextSimilarity;

          // Assume success if execution time is reasonable
          if (record.executionTime < 5000) {
            match.successRate++;
          }

          // Add context factors
          if (context.timeOfDay && !match.contexts.includes(context.timeOfDay)) {
            match.contexts.push(context.timeOfDay);
          }
        }
      }
    });

    // Generate defaults for context matches
    Array.from(contextMatches.entries())
      .filter(([, match]) => match.count >= 2)
      .sort(([,a], [,b]) => (b.similarity / b.count) - (a.similarity / a.count))
      .slice(0, 2)
      .forEach(([value, match]) => {
        const avgSimilarity = match.similarity / match.count;
        const successRate = match.successRate / match.count;

        const confidence = this.calculateConfidence(
          match.count,
          avgSimilarity,
          0.5, // Neutral pattern strength
          0.5, // Neutral recommendation score
          0.5  // Neutral learning score
        );

        defaults.push({
          id: `context-${request.parameterName}-${value}-${Date.now()}`,
          parameterName: request.parameterName,
          value,
          type: 'context-aware',
          confidence,
          relevanceScore: avgSimilarity * successRate * match.count,
          explanation: `Context-appropriate value based on similar usage patterns (${Math.round(avgSimilarity * 100)}% context match)`,
          source: 'Context Analysis',
          metadata: {
            contextMatch: avgSimilarity,
            frequency: match.count,
          },
          timestamp: new Date(),
          userId: request.userId,
        });
      });

    return defaults;
  }

  private async generatePatternBasedDefaults(
    request: DefaultValueRequest,
    data: any
  ): Promise<DefaultValueResult[]> {
    const defaults: DefaultValueResult[] = [];
    const { patterns } = data;

    if (!patterns || patterns.length === 0) {
      return defaults;
    }

    // Find relevant patterns for the parameter
    const relevantPatterns = patterns.filter((pattern: any) => {
      switch (pattern.type) {
        case 'parameter-frequency':
          return pattern.data.parameter === request.parameterName;
        case 'parameter-combination':
          return request.parameterName in pattern.data.parameters;
        case 'parameter-correlation':
          return pattern.data.parameterA === request.parameterName ||
                 pattern.data.parameterB === request.parameterName;
        default:
          return false;
      }
    });

    relevantPatterns.forEach((pattern: any) => {
      let value: any;
      let patternConfidence = pattern.confidence;
      let explanation = '';

      switch (pattern.type) {
        case 'parameter-frequency':
          value = pattern.data.value;
          explanation = `Frequently used value based on usage patterns (${pattern.data.frequency} times)`;
          break;

        case 'parameter-combination':
          if (request.parameterName in pattern.data.parameters) {
            value = pattern.data.parameters[request.parameterName];
            explanation = `Value from successful parameter combination (${Math.round(pattern.data.successRate * 100)}% success rate)`;
          }
          break;

        case 'parameter-correlation':
          // Use correlation to suggest value based on current parameters
          if (request.currentParameters) {
            const correlatedParam = pattern.data.parameterA === request.parameterName
              ? pattern.data.parameterB
              : pattern.data.parameterA;

            if (correlatedParam in request.currentParameters) {
              // Simple correlation-based suggestion (this could be more sophisticated)
              const correlatedValue = request.currentParameters[correlatedParam];
              const correlation = pattern.data.correlationCoefficient;

              if (typeof correlatedValue === 'number') {
                // For positive correlation, suggest similar magnitude
                // For negative correlation, suggest inverse relationship
                value = correlation > 0
                  ? Math.round(correlatedValue * (1 + correlation * 0.1))
                  : Math.round(correlatedValue * (1 - Math.abs(correlation) * 0.1));

                explanation = `Value based on ${correlation > 0 ? 'positive' : 'negative'} correlation with ${correlatedParam}`;
              }
            }
          }
          break;
      }

      if (value !== undefined) {
        const confidence = this.calculateConfidence(
          pattern.data.frequency || 1,
          0.5, // Neutral context match
          patternConfidence,
          0.5, // Neutral recommendation score
          0.5  // Neutral learning score
        );

        defaults.push({
          id: `pattern-${request.parameterName}-${value}-${Date.now()}`,
          parameterName: request.parameterName,
          value,
          type: 'pattern-based',
          confidence,
          relevanceScore: patternConfidence,
          explanation,
          source: `Pattern Recognition (${pattern.type})`,
          metadata: {
            patternConfidence,
            frequency: pattern.data.frequency || 1,
          },
          timestamp: new Date(),
          userId: request.userId,
        });
      }
    });

    return defaults;
  }

  private async generateRecommendationIntegratedDefaults(
    request: DefaultValueRequest,
    data: any
  ): Promise<DefaultValueResult[]> {
    const defaults: DefaultValueResult[] = [];
    const { recommendations } = data;

    if (!recommendations || recommendations.length === 0) {
      return defaults;
    }

    // Find parameter-related recommendations
    const parameterRecommendations = recommendations.filter((rec: any) => {
      switch (rec.type) {
        case 'parameter-value':
          return rec.data.parameter === request.parameterName;
        case 'parameter-combination':
          return request.parameterName in rec.data.parameters;
        case 'optimization-suggestion':
          return rec.data.parameter === request.parameterName;
        default:
          return false;
      }
    });

    parameterRecommendations.forEach((rec: any) => {
      let value: any;
      let explanation = '';

      switch (rec.type) {
        case 'parameter-value':
          value = rec.data.value;
          explanation = `Recommended value based on usage analysis (${Math.round(rec.data.successRate * 100)}% success rate)`;
          break;

        case 'parameter-combination':
          if (request.parameterName in rec.data.parameters) {
            value = rec.data.parameters[request.parameterName];
            explanation = `Value from recommended parameter combination (${Math.round(rec.data.successRate * 100)}% success rate)`;
          }
          break;

        case 'optimization-suggestion':
          value = rec.data.suggestedValue;
          explanation = `Optimized value: ${rec.data.reasoning}`;
          break;
      }

      if (value !== undefined) {
        const confidence = this.calculateConfidence(
          rec.data.frequency || 1,
          0.5, // Neutral context match
          0.5, // Neutral pattern strength
          rec.confidence,
          0.5  // Neutral learning score
        );

        defaults.push({
          id: `rec-${request.parameterName}-${value}-${Date.now()}`,
          parameterName: request.parameterName,
          value,
          type: 'recommendation-integrated',
          confidence,
          relevanceScore: rec.relevanceScore || rec.confidence,
          explanation,
          source: `Recommendation System (${rec.type})`,
          metadata: {
            recommendationScore: rec.confidence,
            frequency: rec.data.frequency || 1,
          },
          timestamp: new Date(),
          userId: request.userId,
        });
      }
    });

    return defaults;
  }

  private async generateAdaptiveLearningDefaults(
    request: DefaultValueRequest,
    data: any
  ): Promise<DefaultValueResult[]> {
    // Implementation for adaptive learning defaults
    // This would use user feedback to improve defaults
    return [];
  }

  // ============================================================================
  // Utility Methods
  // ============================================================================

  private generateCacheKey(request: DefaultValueRequest): string {
    return JSON.stringify({
      userId: request.userId,
      calculatorType: request.calculatorType,
      parameterName: request.parameterName,
      context: request.context,
      currentParameters: request.currentParameters,
    });
  }

  private sortDefaults(defaults: DefaultValueResult[]): DefaultValueResult[] {
    return defaults.sort((a, b) => {
      // Primary sort by relevance score
      if (b.relevanceScore !== a.relevanceScore) {
        return b.relevanceScore - a.relevanceScore;
      }
      // Secondary sort by confidence
      return b.confidence - a.confidence;
    });
  }

  private getFallbackDefault(request: DefaultValueRequest): DefaultValueResult | null {
    const fallbacks = this.config.fallbackDefaults[request.calculatorType];
    if (!fallbacks || !fallbacks[request.parameterName]) {
      return null;
    }

    const value = fallbacks[request.parameterName];
    
    return {
      id: `fallback-${request.parameterName}-${Date.now()}`,
      parameterName: request.parameterName,
      value,
      type: 'fallback',
      confidence: 0.3, // Low confidence for fallback
      relevanceScore: 0.3,
      explanation: 'System default value when no smart defaults are available',
      source: 'System Fallback',
      metadata: {},
      timestamp: new Date(),
      userId: request.userId,
    };
  }

  private async waitForCalculation(cacheKey: string): Promise<void> {
    while (this.calculationInProgress.has(cacheKey)) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  // ============================================================================
  // Cache Management
  // ============================================================================

  public clearCache(): void {
    this.cache.clear();
  }

  public getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// ============================================================================
// Service Instance
// ============================================================================

export const smartDefaultsService = new SmartDefaultsService();
