/**
 * Pattern Recognition Service
 * Analyzes user patterns in parameter usage and calculation frequency
 */

import { 
  CalculationRecord, 
  ParameterPreset,
  UserPreferences
} from '../types/memory';
import { calculationHistoryService } from './calculationHistoryService';
import { parameterPresetService } from './parameterPresetService';
import { userPreferencesService } from './userPreferencesService';

// ============================================================================
// Pattern Types
// ============================================================================

export interface PatternAnalysisResult {
  id: string;
  type: PatternType;
  confidence: number;
  description: string;
  data: any;
  timestamp: Date;
  userId: string;
}

export type PatternType = 
  | 'parameter-frequency'
  | 'calculator-usage'
  | 'time-activity'
  | 'parameter-combination'
  | 'behavior-sequence'
  | 'anomaly-detection';

export interface ParameterFrequencyPattern {
  parameter: string;
  value: any;
  frequency: number;
  percentage: number;
  calculatorType: string;
  trend: 'increasing' | 'decreasing' | 'stable';
}

export interface CalculatorUsagePattern {
  calculatorType: string;
  usageCount: number;
  percentage: number;
  averageSessionTime: number;
  preferredTimeSlots: string[];
  trend: 'increasing' | 'decreasing' | 'stable';
}

export interface TimeActivityPattern {
  timeSlot: string; // e.g., "09:00-10:00"
  dayOfWeek: string;
  activityLevel: number;
  calculatorTypes: string[];
  averageCalculations: number;
}

export interface ParameterCombinationPattern {
  parameters: Record<string, any>;
  frequency: number;
  calculatorType: string;
  successRate: number;
  averageExecutionTime: number;
}

// ============================================================================
// Service Configuration
// ============================================================================

export interface PatternRecognitionConfig {
  analysisWindowDays: number;
  minPatternFrequency: number;
  confidenceThreshold: number;
  maxPatternsPerType: number;
  cacheExpiryMinutes: number;
  storageKey: string;
}

const DEFAULT_CONFIG: PatternRecognitionConfig = {
  analysisWindowDays: 30,
  minPatternFrequency: 3,
  confidenceThreshold: 0.6,
  maxPatternsPerType: 10,
  cacheExpiryMinutes: 60,
  storageKey: 'laser-calc-patterns',
};

// ============================================================================
// Pattern Recognition Service
// ============================================================================

export class PatternRecognitionService {
  private config: PatternRecognitionConfig;
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();
  private analysisInProgress: Set<string> = new Set();

  constructor(config?: Partial<PatternRecognitionConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  // ============================================================================
  // Public API
  // ============================================================================

  /**
   * Analyze all patterns for a user
   */
  public async analyzeUserPatterns(userId: string = 'anonymous-user'): Promise<PatternAnalysisResult[]> {
    const cacheKey = `user-patterns:${userId}`;
    
    // Check cache first
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    // Prevent concurrent analysis
    if (this.analysisInProgress.has(userId)) {
      throw new Error('Pattern analysis already in progress for this user');
    }

    try {
      this.analysisInProgress.add(userId);
      
      const patterns: PatternAnalysisResult[] = [];
      
      // Collect data from all sources
      const historyData = await this.collectHistoryData(userId);
      const presetData = await this.collectPresetData(userId);
      const preferenceData = await this.collectPreferenceData(userId);

      // Run all pattern analyses
      patterns.push(...await this.analyzeParameterFrequency(historyData, userId));
      patterns.push(...await this.analyzeCalculatorUsage(historyData, userId));
      patterns.push(...await this.analyzeTimeActivity(historyData, userId));
      patterns.push(...await this.analyzeParameterCombinations(historyData, userId));

      // Sort by confidence and limit results
      const sortedPatterns = patterns
        .filter(p => p.confidence >= this.config.confidenceThreshold)
        .sort((a, b) => b.confidence - a.confidence);

      // Cache results
      this.setCache(cacheKey, sortedPatterns, this.config.cacheExpiryMinutes * 60 * 1000);

      return sortedPatterns;
    } finally {
      this.analysisInProgress.delete(userId);
    }
  }

  /**
   * Get patterns by type
   */
  public async getPatternsByType(
    type: PatternType, 
    userId: string = 'anonymous-user'
  ): Promise<PatternAnalysisResult[]> {
    const allPatterns = await this.analyzeUserPatterns(userId);
    return allPatterns.filter(p => p.type === type);
  }

  /**
   * Get pattern confidence score
   */
  public calculatePatternConfidence(
    frequency: number,
    totalSamples: number,
    consistency: number
  ): number {
    if (totalSamples === 0) return 0;
    
    const frequencyScore = Math.min(frequency / this.config.minPatternFrequency, 1);
    const prevalenceScore = frequency / totalSamples;
    const consistencyScore = consistency;
    
    return (frequencyScore * 0.4 + prevalenceScore * 0.4 + consistencyScore * 0.2);
  }

  // ============================================================================
  // Data Collection Methods
  // ============================================================================

  private async collectHistoryData(userId: string): Promise<CalculationRecord[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.config.analysisWindowDays);

    const historyResult = await calculationHistoryService.getHistory({
      dateFrom: cutoffDate,
      limit: 1000,
      sortBy: 'timestamp',
      sortOrder: 'desc'
    });

    return historyResult.records;
  }

  private async collectPresetData(userId: string): Promise<ParameterPreset[]> {
    const presetResult = await parameterPresetService.getPresets({
      limit: 100,
      sortBy: 'usageCount',
      sortOrder: 'desc'
    });

    return presetResult.presets;
  }

  private async collectPreferenceData(userId: string): Promise<UserPreferences> {
    return userPreferencesService.getPreferences();
  }

  // ============================================================================
  // Pattern Analysis Methods
  // ============================================================================

  private async analyzeParameterFrequency(
    records: CalculationRecord[],
    userId: string
  ): Promise<PatternAnalysisResult[]> {
    const patterns: PatternAnalysisResult[] = [];
    const parameterCounts: Map<string, Map<string, number>> = new Map();

    // Count parameter usage by calculator type
    records.forEach(record => {
      if (!parameterCounts.has(record.calculatorType)) {
        parameterCounts.set(record.calculatorType, new Map());
      }
      
      const calcCounts = parameterCounts.get(record.calculatorType)!;
      
      Object.entries(record.inputs).forEach(([param, value]) => {
        const key = `${param}:${JSON.stringify(value)}`;
        calcCounts.set(key, (calcCounts.get(key) || 0) + 1);
      });
    });

    // Generate patterns for frequent parameters
    parameterCounts.forEach((counts, calculatorType) => {
      const totalRecords = records.filter(r => r.calculatorType === calculatorType).length;
      
      counts.forEach((frequency, paramKey) => {
        if (frequency >= this.config.minPatternFrequency) {
          const [parameter, valueStr] = paramKey.split(':');
          const value = JSON.parse(valueStr);
          const percentage = (frequency / totalRecords) * 100;
          
          const confidence = this.calculatePatternConfidence(
            frequency,
            totalRecords,
            frequency / Math.max(...counts.values())
          );

          patterns.push({
            id: `param-freq-${calculatorType}-${parameter}-${Date.now()}`,
            type: 'parameter-frequency',
            confidence,
            description: `Parameter "${parameter}" with value "${value}" used ${frequency} times (${percentage.toFixed(1)}%) in ${calculatorType}`,
            data: {
              parameter,
              value,
              frequency,
              percentage,
              calculatorType,
              trend: 'stable' // TODO: Calculate trend from historical data
            } as ParameterFrequencyPattern,
            timestamp: new Date(),
            userId
          });
        }
      });
    });

    return patterns.slice(0, this.config.maxPatternsPerType);
  }

  private async analyzeCalculatorUsage(
    records: CalculationRecord[],
    userId: string
  ): Promise<PatternAnalysisResult[]> {
    const patterns: PatternAnalysisResult[] = [];
    const usageCounts: Map<string, number> = new Map();
    const sessionTimes: Map<string, number[]> = new Map();

    // Count calculator usage and session times
    records.forEach(record => {
      const calcType = record.calculatorType;
      usageCounts.set(calcType, (usageCounts.get(calcType) || 0) + 1);
      
      if (record.executionTime) {
        if (!sessionTimes.has(calcType)) {
          sessionTimes.set(calcType, []);
        }
        sessionTimes.get(calcType)!.push(record.executionTime);
      }
    });

    const totalRecords = records.length;

    // Generate calculator usage patterns
    usageCounts.forEach((count, calculatorType) => {
      if (count >= this.config.minPatternFrequency) {
        const percentage = (count / totalRecords) * 100;
        const times = sessionTimes.get(calculatorType) || [];
        const averageSessionTime = times.length > 0 
          ? times.reduce((sum, time) => sum + time, 0) / times.length 
          : 0;

        const confidence = this.calculatePatternConfidence(
          count,
          totalRecords,
          count / Math.max(...usageCounts.values())
        );

        patterns.push({
          id: `calc-usage-${calculatorType}-${Date.now()}`,
          type: 'calculator-usage',
          confidence,
          description: `Calculator "${calculatorType}" used ${count} times (${percentage.toFixed(1)}%) with average session time ${averageSessionTime.toFixed(2)}ms`,
          data: {
            calculatorType,
            usageCount: count,
            percentage,
            averageSessionTime,
            preferredTimeSlots: [], // TODO: Analyze time slots
            trend: 'stable' // TODO: Calculate trend
          } as CalculatorUsagePattern,
          timestamp: new Date(),
          userId
        });
      }
    });

    return patterns.slice(0, this.config.maxPatternsPerType);
  }

  private async analyzeTimeActivity(
    records: CalculationRecord[],
    userId: string
  ): Promise<PatternAnalysisResult[]> {
    const patterns: PatternAnalysisResult[] = [];
    const timeSlotCounts: Map<string, number> = new Map();
    const dayOfWeekCounts: Map<string, number> = new Map();

    // Analyze time patterns
    records.forEach(record => {
      const date = new Date(record.timestamp);
      const hour = date.getHours();
      const timeSlot = `${hour.toString().padStart(2, '0')}:00-${(hour + 1).toString().padStart(2, '0')}:00`;
      const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });

      timeSlotCounts.set(timeSlot, (timeSlotCounts.get(timeSlot) || 0) + 1);
      dayOfWeekCounts.set(dayOfWeek, (dayOfWeekCounts.get(dayOfWeek) || 0) + 1);
    });

    // Generate time activity patterns for most active time slots
    const sortedTimeSlots = Array.from(timeSlotCounts.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3); // Top 3 time slots

    sortedTimeSlots.forEach(([timeSlot, count]) => {
      if (count >= this.config.minPatternFrequency) {
        const confidence = this.calculatePatternConfidence(
          count,
          records.length,
          count / Math.max(...timeSlotCounts.values())
        );

        patterns.push({
          id: `time-activity-${timeSlot.replace(':', '-')}-${Date.now()}`,
          type: 'time-activity',
          confidence,
          description: `Most active during ${timeSlot} with ${count} calculations`,
          data: {
            timeSlot,
            dayOfWeek: 'All', // TODO: Correlate with day of week
            activityLevel: count,
            calculatorTypes: [], // TODO: Analyze calculator types for this time slot
            averageCalculations: count
          } as TimeActivityPattern,
          timestamp: new Date(),
          userId
        });
      }
    });

    return patterns.slice(0, this.config.maxPatternsPerType);
  }

  private async analyzeParameterCombinations(
    records: CalculationRecord[],
    userId: string
  ): Promise<PatternAnalysisResult[]> {
    const patterns: PatternAnalysisResult[] = [];
    const combinationCounts: Map<string, {
      count: number;
      calculatorType: string;
      parameters: Record<string, any>;
      executionTimes: number[];
    }> = new Map();

    // Count parameter combinations
    records.forEach(record => {
      const paramKey = JSON.stringify(record.inputs);
      const key = `${record.calculatorType}:${paramKey}`;
      
      if (!combinationCounts.has(key)) {
        combinationCounts.set(key, {
          count: 0,
          calculatorType: record.calculatorType,
          parameters: record.inputs,
          executionTimes: []
        });
      }
      
      const combo = combinationCounts.get(key)!;
      combo.count++;
      if (record.executionTime) {
        combo.executionTimes.push(record.executionTime);
      }
    });

    // Generate patterns for frequent combinations
    combinationCounts.forEach((combo, key) => {
      if (combo.count >= this.config.minPatternFrequency) {
        const averageExecutionTime = combo.executionTimes.length > 0
          ? combo.executionTimes.reduce((sum, time) => sum + time, 0) / combo.executionTimes.length
          : 0;

        const confidence = this.calculatePatternConfidence(
          combo.count,
          records.filter(r => r.calculatorType === combo.calculatorType).length,
          combo.count / Math.max(...Array.from(combinationCounts.values()).map(c => c.count))
        );

        patterns.push({
          id: `param-combo-${combo.calculatorType}-${Date.now()}`,
          type: 'parameter-combination',
          confidence,
          description: `Parameter combination used ${combo.count} times in ${combo.calculatorType}`,
          data: {
            parameters: combo.parameters,
            frequency: combo.count,
            calculatorType: combo.calculatorType,
            successRate: 1.0, // TODO: Calculate success rate based on completion
            averageExecutionTime
          } as ParameterCombinationPattern,
          timestamp: new Date(),
          userId
        });
      }
    });

    return patterns.slice(0, this.config.maxPatternsPerType);
  }

  // ============================================================================
  // Cache Management
  // ============================================================================

  private getFromCache(key: string): any {
    const cached = this.cache.get(key);
    if (!cached) return null;

    if (Date.now() > cached.timestamp + cached.ttl) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  private setCache(key: string, data: any, ttl: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  public clearCache(): void {
    this.cache.clear();
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

export const patternRecognitionService = new PatternRecognitionService();
