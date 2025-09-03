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
  | 'anomaly-detection'
  | 'parameter-correlation'
  | 'usage-evolution';

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

export interface BehaviorSequencePattern {
  sequence: string[];
  frequency: number;
  averageTimeSpan: number;
  successRate: number;
  nextProbableActions: Array<{ action: string; probability: number }>;
}

export interface AnomalyDetectionPattern {
  type: 'unusual-parameter' | 'unusual-timing' | 'unusual-sequence';
  description: string;
  severity: 'low' | 'medium' | 'high';
  affectedData: any;
  suggestedAction: string;
}

export interface ParameterCorrelationPattern {
  parameterA: string;
  parameterB: string;
  correlationCoefficient: number;
  calculatorType: string;
  sampleSize: number;
  significance: number;
}

export interface UsageEvolutionPattern {
  metric: string;
  timePoints: Array<{ date: string; value: number }>;
  trend: 'increasing' | 'decreasing' | 'stable' | 'cyclical';
  changeRate: number;
  prediction: { nextValue: number; confidence: number };
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

      // Advanced pattern analyses
      patterns.push(...await this.analyzeBehaviorSequences(historyData, userId));
      patterns.push(...await this.detectAnomalies(historyData, userId));
      patterns.push(...await this.analyzeParameterCorrelations(historyData, userId));
      patterns.push(...await this.analyzeUsageEvolution(historyData, userId));

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
  // Advanced Pattern Analysis Methods
  // ============================================================================

  private async analyzeBehaviorSequences(
    records: CalculationRecord[],
    userId: string
  ): Promise<PatternAnalysisResult[]> {
    const patterns: PatternAnalysisResult[] = [];
    const sequences: Map<string, {
      count: number;
      timespans: number[];
      calculatorTypes: string[];
    }> = new Map();

    // Sort records by timestamp
    const sortedRecords = records.sort((a, b) =>
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    // Extract sequences of calculator usage
    for (let i = 0; i < sortedRecords.length - 2; i++) {
      const sequence = [
        sortedRecords[i].calculatorType,
        sortedRecords[i + 1].calculatorType,
        sortedRecords[i + 2].calculatorType
      ];

      const sequenceKey = sequence.join(' -> ');
      const timespan = new Date(sortedRecords[i + 2].timestamp).getTime() -
                      new Date(sortedRecords[i].timestamp).getTime();

      if (!sequences.has(sequenceKey)) {
        sequences.set(sequenceKey, {
          count: 0,
          timespans: [],
          calculatorTypes: sequence
        });
      }

      const seq = sequences.get(sequenceKey)!;
      seq.count++;
      seq.timespans.push(timespan);
    }

    // Generate patterns for frequent sequences
    sequences.forEach((seq, sequenceKey) => {
      if (seq.count >= this.config.minPatternFrequency) {
        const averageTimeSpan = seq.timespans.reduce((sum, time) => sum + time, 0) / seq.timespans.length;
        const confidence = this.calculatePatternConfidence(
          seq.count,
          Math.max(0, sortedRecords.length - 2),
          seq.count / Math.max(...Array.from(sequences.values()).map(s => s.count))
        );

        patterns.push({
          id: `behavior-seq-${sequenceKey.replace(/\s/g, '-')}-${Date.now()}`,
          type: 'behavior-sequence',
          confidence,
          description: `Behavior sequence "${sequenceKey}" occurs ${seq.count} times with average timespan ${(averageTimeSpan / 1000 / 60).toFixed(1)} minutes`,
          data: {
            sequence: seq.calculatorTypes,
            frequency: seq.count,
            averageTimeSpan,
            successRate: 1.0, // TODO: Calculate based on completion
            nextProbableActions: [] // TODO: Calculate next probable actions
          } as BehaviorSequencePattern,
          timestamp: new Date(),
          userId
        });
      }
    });

    return patterns.slice(0, this.config.maxPatternsPerType);
  }

  private async detectAnomalies(
    records: CalculationRecord[],
    userId: string
  ): Promise<PatternAnalysisResult[]> {
    const patterns: PatternAnalysisResult[] = [];

    // Detect unusual parameter values
    const parameterStats: Map<string, { values: number[]; mean: number; stdDev: number }> = new Map();

    // Calculate statistics for numeric parameters
    records.forEach(record => {
      Object.entries(record.inputs).forEach(([param, value]) => {
        if (typeof value === 'number') {
          const key = `${record.calculatorType}:${param}`;
          if (!parameterStats.has(key)) {
            parameterStats.set(key, { values: [], mean: 0, stdDev: 0 });
          }
          parameterStats.get(key)!.values.push(value);
        }
      });
    });

    // Calculate mean and standard deviation
    parameterStats.forEach((stats, key) => {
      const values = stats.values;
      stats.mean = values.reduce((sum, val) => sum + val, 0) / values.length;
      const variance = values.reduce((sum, val) => sum + Math.pow(val - stats.mean, 2), 0) / values.length;
      stats.stdDev = Math.sqrt(variance);
    });

    // Detect outliers (values beyond 2 standard deviations)
    records.forEach(record => {
      Object.entries(record.inputs).forEach(([param, value]) => {
        if (typeof value === 'number') {
          const key = `${record.calculatorType}:${param}`;
          const stats = parameterStats.get(key);

          if (stats && stats.stdDev > 0) {
            const zScore = Math.abs(value - stats.mean) / stats.stdDev;

            if (zScore > 2) { // Outlier detected
              const confidence = Math.min(zScore / 3, 1); // Higher z-score = higher confidence

              patterns.push({
                id: `anomaly-param-${record.id}-${param}`,
                type: 'anomaly-detection',
                confidence,
                description: `Unusual parameter value: ${param} = ${value} (${zScore.toFixed(2)} standard deviations from mean)`,
                data: {
                  type: 'unusual-parameter',
                  description: `Parameter "${param}" has unusual value ${value}`,
                  severity: zScore > 3 ? 'high' : zScore > 2.5 ? 'medium' : 'low',
                  affectedData: { parameter: param, value, zScore, mean: stats.mean, stdDev: stats.stdDev },
                  suggestedAction: `Review parameter "${param}" - value ${value} is unusual for this calculator`
                } as AnomalyDetectionPattern,
                timestamp: new Date(),
                userId
              });
            }
          }
        }
      });
    });

    return patterns.slice(0, this.config.maxPatternsPerType);
  }

  private async analyzeParameterCorrelations(
    records: CalculationRecord[],
    userId: string
  ): Promise<PatternAnalysisResult[]> {
    const patterns: PatternAnalysisResult[] = [];
    const correlationData: Map<string, Array<{ paramA: number; paramB: number }>> = new Map();

    // Group numeric parameters by calculator type
    const calculatorParams: Map<string, Set<string>> = new Map();

    records.forEach(record => {
      if (!calculatorParams.has(record.calculatorType)) {
        calculatorParams.set(record.calculatorType, new Set());
      }

      Object.entries(record.inputs).forEach(([param, value]) => {
        if (typeof value === 'number') {
          calculatorParams.get(record.calculatorType)!.add(param);
        }
      });
    });

    // Calculate correlations for each calculator type
    calculatorParams.forEach((params, calculatorType) => {
      const paramArray = Array.from(params);

      // Check all parameter pairs
      for (let i = 0; i < paramArray.length; i++) {
        for (let j = i + 1; j < paramArray.length; j++) {
          const paramA = paramArray[i];
          const paramB = paramArray[j];
          const key = `${calculatorType}:${paramA}:${paramB}`;

          correlationData.set(key, []);

          // Collect data points
          records
            .filter(r => r.calculatorType === calculatorType)
            .forEach(record => {
              const valueA = record.inputs[paramA];
              const valueB = record.inputs[paramB];

              if (typeof valueA === 'number' && typeof valueB === 'number') {
                correlationData.get(key)!.push({ paramA: valueA, paramB: valueB });
              }
            });
        }
      }
    });

    // Calculate correlation coefficients
    correlationData.forEach((dataPoints, key) => {
      if (dataPoints.length >= this.config.minPatternFrequency) {
        const correlation = this.calculateCorrelation(dataPoints);

        if (Math.abs(correlation) > 0.5) { // Strong correlation
          const [calculatorType, paramA, paramB] = key.split(':');
          const confidence = Math.abs(correlation);

          patterns.push({
            id: `param-corr-${calculatorType}-${paramA}-${paramB}-${Date.now()}`,
            type: 'parameter-correlation',
            confidence,
            description: `Strong ${correlation > 0 ? 'positive' : 'negative'} correlation (${correlation.toFixed(3)}) between ${paramA} and ${paramB} in ${calculatorType}`,
            data: {
              parameterA: paramA,
              parameterB: paramB,
              correlationCoefficient: correlation,
              calculatorType,
              sampleSize: dataPoints.length,
              significance: confidence
            } as ParameterCorrelationPattern,
            timestamp: new Date(),
            userId
          });
        }
      }
    });

    return patterns.slice(0, this.config.maxPatternsPerType);
  }

  private async analyzeUsageEvolution(
    records: CalculationRecord[],
    userId: string
  ): Promise<PatternAnalysisResult[]> {
    const patterns: PatternAnalysisResult[] = [];

    // Group records by day
    const dailyUsage: Map<string, number> = new Map();

    records.forEach(record => {
      const date = new Date(record.timestamp).toISOString().split('T')[0];
      dailyUsage.set(date, (dailyUsage.get(date) || 0) + 1);
    });

    // Convert to time series
    const timePoints = Array.from(dailyUsage.entries())
      .map(([date, value]) => ({ date, value }))
      .sort((a, b) => a.date.localeCompare(b.date));

    if (timePoints.length >= 7) { // Need at least a week of data
      const trend = this.calculateTrend(timePoints.map(p => p.value));
      const changeRate = this.calculateChangeRate(timePoints.map(p => p.value));

      const confidence = Math.min(timePoints.length / 30, 1); // More data = higher confidence

      patterns.push({
        id: `usage-evolution-daily-${Date.now()}`,
        type: 'usage-evolution',
        confidence,
        description: `Daily usage shows ${trend} trend with ${changeRate > 0 ? 'increase' : 'decrease'} of ${Math.abs(changeRate).toFixed(2)} calculations per day`,
        data: {
          metric: 'daily-calculations',
          timePoints,
          trend,
          changeRate,
          prediction: {
            nextValue: timePoints[timePoints.length - 1].value + changeRate,
            confidence: confidence * 0.7 // Predictions are less confident
          }
        } as UsageEvolutionPattern,
        timestamp: new Date(),
        userId
      });
    }

    return patterns.slice(0, this.config.maxPatternsPerType);
  }

  // ============================================================================
  // Helper Methods for Advanced Analysis
  // ============================================================================

  private calculateCorrelation(dataPoints: Array<{ paramA: number; paramB: number }>): number {
    const n = dataPoints.length;
    if (n < 2) return 0;

    const sumA = dataPoints.reduce((sum, point) => sum + point.paramA, 0);
    const sumB = dataPoints.reduce((sum, point) => sum + point.paramB, 0);
    const sumAB = dataPoints.reduce((sum, point) => sum + point.paramA * point.paramB, 0);
    const sumA2 = dataPoints.reduce((sum, point) => sum + point.paramA * point.paramA, 0);
    const sumB2 = dataPoints.reduce((sum, point) => sum + point.paramB * point.paramB, 0);

    const numerator = n * sumAB - sumA * sumB;
    const denominator = Math.sqrt((n * sumA2 - sumA * sumA) * (n * sumB2 - sumB * sumB));

    return denominator === 0 ? 0 : numerator / denominator;
  }

  private calculateTrend(values: number[]): 'increasing' | 'decreasing' | 'stable' | 'cyclical' {
    if (values.length < 3) return 'stable';

    // Simple linear regression to determine trend
    const n = values.length;
    const x = Array.from({ length: n }, (_, i) => i);
    const sumX = x.reduce((sum, val) => sum + val, 0);
    const sumY = values.reduce((sum, val) => sum + val, 0);
    const sumXY = x.reduce((sum, val, i) => sum + val * values[i], 0);
    const sumX2 = x.reduce((sum, val) => sum + val * val, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);

    if (Math.abs(slope) < 0.1) return 'stable';
    return slope > 0 ? 'increasing' : 'decreasing';
  }

  private calculateChangeRate(values: number[]): number {
    if (values.length < 2) return 0;

    // Calculate average change per period
    let totalChange = 0;
    for (let i = 1; i < values.length; i++) {
      totalChange += values[i] - values[i - 1];
    }

    return totalChange / (values.length - 1);
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
