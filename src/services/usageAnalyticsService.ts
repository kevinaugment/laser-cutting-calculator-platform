/**
 * Usage Analytics Service
 * Tracks and analyzes parameter usage, success rates, and team performance
 */

import { teamManagementService } from './teamManagementService';
import { TeamParameterPreset } from './teamParameterLibraryService';

// ============================================================================
// Types and Interfaces
// ============================================================================

export type AnalyticsTimeframe = 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year';
export type MetricType = 'usage' | 'success' | 'performance' | 'quality' | 'efficiency';
export type AggregationType = 'sum' | 'average' | 'count' | 'min' | 'max' | 'median';

export interface UsageEvent {
  id: string;
  userId: string;
  teamId?: string;
  calculatorType: string;
  presetId?: string;
  parameters: Record<string, any>;
  results: Record<string, any>;
  timestamp: Date;
  duration: number; // milliseconds
  success: boolean;
  errorMessage?: string;
  sessionId: string;
  userAgent?: string;
  ipAddress?: string;
  metadata: Record<string, any>;
}

export interface AnalyticsMetric {
  id: string;
  name: string;
  type: MetricType;
  value: number;
  unit: string;
  timestamp: Date;
  timeframe: AnalyticsTimeframe;
  dimensions: Record<string, string>;
  metadata: Record<string, any>;
}

export interface UsageStatistics {
  totalUsage: number;
  uniqueUsers: number;
  averageSessionDuration: number;
  successRate: number;
  errorRate: number;
  topCalculators: CalculatorUsage[];
  topPresets: PresetUsage[];
  userActivity: UserActivity[];
  timeDistribution: TimeDistribution[];
  performanceMetrics: PerformanceMetrics;
}

export interface CalculatorUsage {
  calculatorType: string;
  usageCount: number;
  uniqueUsers: number;
  successRate: number;
  averageDuration: number;
  errorCount: number;
  lastUsed: Date;
}

export interface PresetUsage {
  presetId: string;
  presetName: string;
  usageCount: number;
  uniqueUsers: number;
  successRate: number;
  averageRating: number;
  shareCount: number;
  lastUsed: Date;
}

export interface UserActivity {
  userId: string;
  username?: string;
  totalUsage: number;
  uniqueCalculators: number;
  averageSessionDuration: number;
  successRate: number;
  lastActivity: Date;
  favoriteCalculator: string;
  contributionScore: number;
}

export interface TimeDistribution {
  timeSlot: string;
  usageCount: number;
  uniqueUsers: number;
  averageDuration: number;
  successRate: number;
}

export interface PerformanceMetrics {
  averageResponseTime: number;
  p95ResponseTime: number;
  p99ResponseTime: number;
  errorRate: number;
  throughput: number;
  availability: number;
}

export interface TeamAnalytics {
  teamId: string;
  teamName: string;
  memberCount: number;
  totalUsage: number;
  uniqueCalculators: number;
  sharedPresets: number;
  collaborationScore: number;
  knowledgeShareRate: number;
  expertValidations: number;
  averageQualityScore: number;
  topContributors: UserActivity[];
  usageTrends: UsageTrend[];
}

export interface UsageTrend {
  date: Date;
  value: number;
  change: number;
  changePercent: number;
}

export interface AnalyticsQuery {
  timeframe: AnalyticsTimeframe;
  startDate?: Date;
  endDate?: Date;
  userId?: string;
  teamId?: string;
  calculatorType?: string;
  presetId?: string;
  metrics: MetricType[];
  dimensions?: string[];
  filters?: Record<string, any>;
  aggregation?: AggregationType;
  limit?: number;
}

export interface AnalyticsReport {
  id: string;
  title: string;
  description: string;
  query: AnalyticsQuery;
  data: AnalyticsMetric[];
  charts: ChartConfig[];
  generatedAt: Date;
  generatedBy: string;
  isScheduled: boolean;
  scheduleConfig?: ScheduleConfig;
}

export interface ChartConfig {
  id: string;
  type: 'line' | 'bar' | 'pie' | 'area' | 'scatter' | 'heatmap';
  title: string;
  xAxis: string;
  yAxis: string;
  series: string[];
  colors?: string[];
  options?: Record<string, any>;
}

export interface ScheduleConfig {
  frequency: 'daily' | 'weekly' | 'monthly';
  time: string;
  recipients: string[];
  format: 'pdf' | 'excel' | 'json';
}

// ============================================================================
// Service Configuration
// ============================================================================

export interface UsageAnalyticsServiceConfig {
  retentionDays: number;
  batchSize: number;
  enableRealTimeTracking: boolean;
  enablePerformanceTracking: boolean;
  enableUserTracking: boolean;
  aggregationIntervals: AnalyticsTimeframe[];
}

const DEFAULT_CONFIG: UsageAnalyticsServiceConfig = {
  retentionDays: 365,
  batchSize: 1000,
  enableRealTimeTracking: true,
  enablePerformanceTracking: true,
  enableUserTracking: true,
  aggregationIntervals: ['hour', 'day', 'week', 'month'],
};

// ============================================================================
// Usage Analytics Service Class
// ============================================================================

export class UsageAnalyticsService {
  private config: UsageAnalyticsServiceConfig;
  private events: Map<string, UsageEvent[]>;
  private metrics: Map<string, AnalyticsMetric[]>;
  private reports: Map<string, AnalyticsReport>;

  constructor(config: Partial<UsageAnalyticsServiceConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.events = new Map();
    this.metrics = new Map();
    this.reports = new Map();
  }

  // ============================================================================
  // Event Tracking
  // ============================================================================

  /**
   * Track usage event
   */
  public async trackUsage(event: Omit<UsageEvent, 'id' | 'timestamp'>): Promise<UsageEvent> {
    const usageEvent: UsageEvent = {
      id: this.generateId(),
      timestamp: new Date(),
      ...event,
    };

    // Store event
    const key = this.getEventKey(usageEvent.userId, usageEvent.calculatorType);
    if (!this.events.has(key)) {
      this.events.set(key, []);
    }
    this.events.get(key)!.push(usageEvent);

    // Aggregate metrics if real-time tracking is enabled
    if (this.config.enableRealTimeTracking) {
      await this.aggregateMetrics(usageEvent);
    }

    // Clean up old events
    await this.cleanupOldEvents();

    return usageEvent;
  }

  /**
   * Track calculator performance
   */
  public async trackPerformance(
    calculatorType: string,
    responseTime: number,
    success: boolean,
    userId?: string
  ): Promise<void> {
    if (!this.config.enablePerformanceTracking) return;

    const performanceEvent: Omit<UsageEvent, 'id' | 'timestamp'> = {
      userId: userId || 'anonymous',
      calculatorType,
      parameters: {},
      results: {},
      duration: responseTime,
      success,
      sessionId: this.generateSessionId(),
      metadata: {
        type: 'performance',
        responseTime,
      },
    };

    await this.trackUsage(performanceEvent);
  }

  /**
   * Track user activity
   */
  public async trackUserActivity(
    userId: string,
    activity: string,
    metadata: Record<string, any> = {}
  ): Promise<void> {
    if (!this.config.enableUserTracking) return;

    const activityEvent: Omit<UsageEvent, 'id' | 'timestamp'> = {
      userId,
      calculatorType: 'user-activity',
      parameters: { activity },
      results: {},
      duration: 0,
      success: true,
      sessionId: this.generateSessionId(),
      metadata: {
        type: 'activity',
        activity,
        ...metadata,
      },
    };

    await this.trackUsage(activityEvent);
  }

  // ============================================================================
  // Analytics Queries
  // ============================================================================

  /**
   * Get usage statistics
   */
  public async getUsageStatistics(
    query: Partial<AnalyticsQuery> = {}
  ): Promise<UsageStatistics> {
    const events = await this.queryEvents(query);
    
    const totalUsage = events.length;
    const uniqueUsers = new Set(events.map(e => e.userId)).size;
    const successfulEvents = events.filter(e => e.success);
    const successRate = totalUsage > 0 ? successfulEvents.length / totalUsage : 0;
    const errorRate = 1 - successRate;
    
    const averageSessionDuration = events.length > 0 
      ? events.reduce((sum, e) => sum + e.duration, 0) / events.length 
      : 0;

    // Calculate top calculators
    const calculatorStats = new Map<string, any>();
    events.forEach(event => {
      const calc = event.calculatorType;
      if (!calculatorStats.has(calc)) {
        calculatorStats.set(calc, {
          calculatorType: calc,
          usageCount: 0,
          uniqueUsers: new Set(),
          successCount: 0,
          totalDuration: 0,
          errorCount: 0,
          lastUsed: event.timestamp,
        });
      }
      
      const stats = calculatorStats.get(calc);
      stats.usageCount++;
      stats.uniqueUsers.add(event.userId);
      if (event.success) stats.successCount++;
      else stats.errorCount++;
      stats.totalDuration += event.duration;
      if (event.timestamp > stats.lastUsed) stats.lastUsed = event.timestamp;
    });

    const topCalculators: CalculatorUsage[] = Array.from(calculatorStats.values())
      .map(stats => ({
        calculatorType: stats.calculatorType,
        usageCount: stats.usageCount,
        uniqueUsers: stats.uniqueUsers.size,
        successRate: stats.usageCount > 0 ? stats.successCount / stats.usageCount : 0,
        averageDuration: stats.usageCount > 0 ? stats.totalDuration / stats.usageCount : 0,
        errorCount: stats.errorCount,
        lastUsed: stats.lastUsed,
      }))
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, 10);

    // Calculate user activity
    const userStats = new Map<string, any>();
    events.forEach(event => {
      if (!userStats.has(event.userId)) {
        userStats.set(event.userId, {
          userId: event.userId,
          totalUsage: 0,
          calculators: new Set(),
          totalDuration: 0,
          successCount: 0,
          lastActivity: event.timestamp,
          calculatorUsage: new Map(),
        });
      }
      
      const stats = userStats.get(event.userId);
      stats.totalUsage++;
      stats.calculators.add(event.calculatorType);
      stats.totalDuration += event.duration;
      if (event.success) stats.successCount++;
      if (event.timestamp > stats.lastActivity) stats.lastActivity = event.timestamp;
      
      // Track calculator usage for favorite calculation
      const calcUsage = stats.calculatorUsage.get(event.calculatorType) || 0;
      stats.calculatorUsage.set(event.calculatorType, calcUsage + 1);
    });

    const userActivity: UserActivity[] = Array.from(userStats.values())
      .map(stats => {
        const favoriteCalc = Array.from(stats.calculatorUsage.entries())
          .sort((a, b) => b[1] - a[1])[0];
        
        return {
          userId: stats.userId,
          totalUsage: stats.totalUsage,
          uniqueCalculators: stats.calculators.size,
          averageSessionDuration: stats.totalUsage > 0 ? stats.totalDuration / stats.totalUsage : 0,
          successRate: stats.totalUsage > 0 ? stats.successCount / stats.totalUsage : 0,
          lastActivity: stats.lastActivity,
          favoriteCalculator: favoriteCalc ? favoriteCalc[0] : 'none',
          contributionScore: this.calculateContributionScore(stats),
        };
      })
      .sort((a, b) => b.totalUsage - a.totalUsage)
      .slice(0, 20);

    // Calculate time distribution
    const timeDistribution = this.calculateTimeDistribution(events);

    // Calculate performance metrics
    const performanceMetrics = this.calculatePerformanceMetrics(events);

    return {
      totalUsage,
      uniqueUsers,
      averageSessionDuration,
      successRate,
      errorRate,
      topCalculators,
      topPresets: [], // Would be populated from preset usage data
      userActivity,
      timeDistribution,
      performanceMetrics,
    };
  }

  /**
   * Get team analytics
   */
  public async getTeamAnalytics(teamId: string): Promise<TeamAnalytics> {
    const team = await teamManagementService.getTeam(teamId);
    if (!team) {
      throw new Error('Team not found');
    }

    const members = await teamManagementService.getTeamMembers(teamId);
    const memberIds = members.map(m => m.userId);

    // Get events for team members
    const teamEvents = await this.queryEvents({
      userId: memberIds.join(','), // Simplified - would need proper filtering
      timeframe: 'month',
    });

    const totalUsage = teamEvents.length;
    const uniqueCalculators = new Set(teamEvents.map(e => e.calculatorType)).size;
    
    // Calculate collaboration metrics
    const collaborationScore = this.calculateCollaborationScore(teamEvents, memberIds);
    const knowledgeShareRate = this.calculateKnowledgeShareRate(teamId);

    // Calculate usage trends
    const usageTrends = this.calculateUsageTrends(teamEvents);

    // Get top contributors
    const userStats = await this.getUsageStatistics({ userId: memberIds.join(',') });
    const topContributors = userStats.userActivity.slice(0, 5);

    return {
      teamId,
      teamName: team.name,
      memberCount: members.length,
      totalUsage,
      uniqueCalculators,
      sharedPresets: 0, // Would be calculated from preset sharing data
      collaborationScore,
      knowledgeShareRate,
      expertValidations: 0, // Would be calculated from validation data
      averageQualityScore: 0, // Would be calculated from quality metrics
      topContributors,
      usageTrends,
    };
  }

  /**
   * Generate analytics report
   */
  public async generateReport(
    title: string,
    description: string,
    query: AnalyticsQuery,
    userId: string
  ): Promise<AnalyticsReport> {
    const data = await this.queryMetrics(query);
    const charts = this.generateChartConfigs(query, data);

    const report: AnalyticsReport = {
      id: this.generateId(),
      title,
      description,
      query,
      data,
      charts,
      generatedAt: new Date(),
      generatedBy: userId,
      isScheduled: false,
    };

    this.reports.set(report.id, report);
    return report;
  }

  // ============================================================================
  // Private Helper Methods
  // ============================================================================

  private async queryEvents(query: Partial<AnalyticsQuery>): Promise<UsageEvent[]> {
    const allEvents: UsageEvent[] = [];
    
    for (const events of this.events.values()) {
      allEvents.push(...events);
    }

    // Apply filters
    let filteredEvents = allEvents;

    if (query.startDate) {
      filteredEvents = filteredEvents.filter(e => e.timestamp >= query.startDate!);
    }

    if (query.endDate) {
      filteredEvents = filteredEvents.filter(e => e.timestamp <= query.endDate!);
    }

    if (query.userId) {
      filteredEvents = filteredEvents.filter(e => e.userId === query.userId);
    }

    if (query.calculatorType) {
      filteredEvents = filteredEvents.filter(e => e.calculatorType === query.calculatorType);
    }

    // Sort by timestamp
    filteredEvents.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    // Apply limit
    if (query.limit) {
      filteredEvents = filteredEvents.slice(0, query.limit);
    }

    return filteredEvents;
  }

  private async queryMetrics(query: AnalyticsQuery): Promise<AnalyticsMetric[]> {
    // This would query aggregated metrics based on the query parameters
    // For now, return empty array as this would be implemented with actual data storage
    return [];
  }

  private async aggregateMetrics(event: UsageEvent): Promise<void> {
    // Aggregate metrics for different timeframes
    for (const timeframe of this.config.aggregationIntervals) {
      const key = this.getMetricKey(event, timeframe);
      
      if (!this.metrics.has(key)) {
        this.metrics.set(key, []);
      }

      // Create or update metric
      const metric: AnalyticsMetric = {
        id: this.generateId(),
        name: `usage_${event.calculatorType}`,
        type: 'usage',
        value: 1,
        unit: 'count',
        timestamp: this.roundToTimeframe(event.timestamp, timeframe),
        timeframe,
        dimensions: {
          calculatorType: event.calculatorType,
          userId: event.userId,
          success: event.success.toString(),
        },
        metadata: {
          duration: event.duration,
          sessionId: event.sessionId,
        },
      };

      this.metrics.get(key)!.push(metric);
    }
  }

  private calculateTimeDistribution(events: UsageEvent[]): TimeDistribution[] {
    const distribution = new Map<string, any>();

    events.forEach(event => {
      const hour = event.timestamp.getHours();
      const timeSlot = `${hour}:00-${hour + 1}:00`;
      
      if (!distribution.has(timeSlot)) {
        distribution.set(timeSlot, {
          timeSlot,
          usageCount: 0,
          uniqueUsers: new Set(),
          totalDuration: 0,
          successCount: 0,
        });
      }

      const stats = distribution.get(timeSlot);
      stats.usageCount++;
      stats.uniqueUsers.add(event.userId);
      stats.totalDuration += event.duration;
      if (event.success) stats.successCount++;
    });

    return Array.from(distribution.values()).map(stats => ({
      timeSlot: stats.timeSlot,
      usageCount: stats.usageCount,
      uniqueUsers: stats.uniqueUsers.size,
      averageDuration: stats.usageCount > 0 ? stats.totalDuration / stats.usageCount : 0,
      successRate: stats.usageCount > 0 ? stats.successCount / stats.usageCount : 0,
    }));
  }

  private calculatePerformanceMetrics(events: UsageEvent[]): PerformanceMetrics {
    const durations = events.map(e => e.duration).sort((a, b) => a - b);
    const successfulEvents = events.filter(e => e.success);

    return {
      averageResponseTime: durations.length > 0 ? durations.reduce((a, b) => a + b, 0) / durations.length : 0,
      p95ResponseTime: durations.length > 0 ? durations[Math.floor(durations.length * 0.95)] : 0,
      p99ResponseTime: durations.length > 0 ? durations[Math.floor(durations.length * 0.99)] : 0,
      errorRate: events.length > 0 ? (events.length - successfulEvents.length) / events.length : 0,
      throughput: events.length, // Simplified - would calculate per time unit
      availability: events.length > 0 ? successfulEvents.length / events.length : 1,
    };
  }

  private calculateContributionScore(userStats: any): number {
    // Simplified contribution score calculation
    const usageScore = Math.min(userStats.totalUsage / 100, 1) * 40;
    const diversityScore = Math.min(userStats.calculators.size / 10, 1) * 30;
    const qualityScore = userStats.successRate * 30;
    
    return Math.round(usageScore + diversityScore + qualityScore);
  }

  private calculateCollaborationScore(events: UsageEvent[], memberIds: string[]): number {
    // Simplified collaboration score based on shared usage patterns
    const sharedCalculators = new Set();
    const userCalculators = new Map<string, Set<string>>();

    events.forEach(event => {
      if (!userCalculators.has(event.userId)) {
        userCalculators.set(event.userId, new Set());
      }
      userCalculators.get(event.userId)!.add(event.calculatorType);
    });

    // Calculate overlap between users
    let totalOverlap = 0;
    let comparisons = 0;

    for (let i = 0; i < memberIds.length; i++) {
      for (let j = i + 1; j < memberIds.length; j++) {
        const user1Calcs = userCalculators.get(memberIds[i]) || new Set();
        const user2Calcs = userCalculators.get(memberIds[j]) || new Set();
        
        const intersection = new Set([...user1Calcs].filter(x => user2Calcs.has(x)));
        const union = new Set([...user1Calcs, ...user2Calcs]);
        
        if (union.size > 0) {
          totalOverlap += intersection.size / union.size;
          comparisons++;
        }
      }
    }

    return comparisons > 0 ? Math.round((totalOverlap / comparisons) * 100) : 0;
  }

  private calculateKnowledgeShareRate(teamId: string): number {
    // This would calculate based on preset sharing, comments, etc.
    // Simplified implementation
    return Math.random() * 100; // Placeholder
  }

  private calculateUsageTrends(events: UsageEvent[]): UsageTrend[] {
    // Group events by day and calculate trends
    const dailyUsage = new Map<string, number>();
    
    events.forEach(event => {
      const dateKey = event.timestamp.toISOString().split('T')[0];
      dailyUsage.set(dateKey, (dailyUsage.get(dateKey) || 0) + 1);
    });

    const sortedDates = Array.from(dailyUsage.keys()).sort();
    const trends: UsageTrend[] = [];

    for (let i = 0; i < sortedDates.length; i++) {
      const date = new Date(sortedDates[i]);
      const value = dailyUsage.get(sortedDates[i])!;
      const previousValue = i > 0 ? dailyUsage.get(sortedDates[i - 1])! : value;
      const change = value - previousValue;
      const changePercent = previousValue > 0 ? (change / previousValue) * 100 : 0;

      trends.push({
        date,
        value,
        change,
        changePercent,
      });
    }

    return trends;
  }

  private generateChartConfigs(query: AnalyticsQuery, data: AnalyticsMetric[]): ChartConfig[] {
    // Generate appropriate chart configurations based on query and data
    const charts: ChartConfig[] = [];

    if (query.metrics.includes('usage')) {
      charts.push({
        id: this.generateId(),
        type: 'line',
        title: 'Usage Over Time',
        xAxis: 'timestamp',
        yAxis: 'value',
        series: ['usage'],
        colors: ['#3B82F6'],
      });
    }

    if (query.metrics.includes('performance')) {
      charts.push({
        id: this.generateId(),
        type: 'bar',
        title: 'Performance Metrics',
        xAxis: 'calculatorType',
        yAxis: 'responseTime',
        series: ['averageResponseTime', 'p95ResponseTime'],
        colors: ['#10B981', '#F59E0B'],
      });
    }

    return charts;
  }

  private async cleanupOldEvents(): Promise<void> {
    const cutoffDate = new Date(Date.now() - this.config.retentionDays * 24 * 60 * 60 * 1000);
    
    for (const [key, events] of this.events.entries()) {
      const filteredEvents = events.filter(event => event.timestamp > cutoffDate);
      this.events.set(key, filteredEvents);
    }
  }

  private getEventKey(userId: string, calculatorType: string): string {
    return `${userId}:${calculatorType}`;
  }

  private getMetricKey(event: UsageEvent, timeframe: AnalyticsTimeframe): string {
    const timestamp = this.roundToTimeframe(event.timestamp, timeframe);
    return `${event.calculatorType}:${timeframe}:${timestamp.getTime()}`;
  }

  private roundToTimeframe(date: Date, timeframe: AnalyticsTimeframe): Date {
    const rounded = new Date(date);
    
    switch (timeframe) {
      case 'hour':
        rounded.setMinutes(0, 0, 0);
        break;
      case 'day':
        rounded.setHours(0, 0, 0, 0);
        break;
      case 'week':
        const dayOfWeek = rounded.getDay();
        rounded.setDate(rounded.getDate() - dayOfWeek);
        rounded.setHours(0, 0, 0, 0);
        break;
      case 'month':
        rounded.setDate(1);
        rounded.setHours(0, 0, 0, 0);
        break;
      case 'quarter':
        const quarter = Math.floor(rounded.getMonth() / 3);
        rounded.setMonth(quarter * 3, 1);
        rounded.setHours(0, 0, 0, 0);
        break;
      case 'year':
        rounded.setMonth(0, 1);
        rounded.setHours(0, 0, 0, 0);
        break;
    }
    
    return rounded;
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private generateSessionId(): string {
    return Math.random().toString(36).substr(2, 12);
  }
}

// ============================================================================
// Service Instance
// ============================================================================

export const usageAnalyticsService = new UsageAnalyticsService();
