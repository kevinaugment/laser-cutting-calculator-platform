/**
 * Performance Monitoring Service
 * Comprehensive performance monitoring and metrics collection
 */

import { cacheService } from './cacheService';

// ============================================================================
// Types and Interfaces
// ============================================================================

export type MetricType = 'counter' | 'gauge' | 'histogram' | 'timer';
export type AlertLevel = 'info' | 'warning' | 'error' | 'critical';

export interface PerformanceMetric {
  name: string;
  type: MetricType;
  value: number;
  timestamp: number;
  tags: Record<string, string>;
  unit?: string;
}

export interface TimingMetric {
  operation: string;
  duration: number;
  timestamp: number;
  success: boolean;
  error?: string;
  metadata?: Record<string, any>;
}

export interface PerformanceAlert {
  id: string;
  level: AlertLevel;
  message: string;
  metric: string;
  threshold: number;
  currentValue: number;
  timestamp: number;
  resolved: boolean;
}

export interface PerformanceReport {
  timeframe: string;
  metrics: {
    responseTime: {
      average: number;
      p50: number;
      p95: number;
      p99: number;
    };
    throughput: {
      requestsPerSecond: number;
      totalRequests: number;
    };
    errorRate: {
      percentage: number;
      totalErrors: number;
    };
    cachePerformance: {
      hitRate: number;
      averageAccessTime: number;
    };
    memoryUsage: {
      current: number;
      peak: number;
      average: number;
    };
  };
  alerts: PerformanceAlert[];
  recommendations: string[];
}

export interface PerformanceThresholds {
  responseTimeWarning: number; // ms
  responseTimeError: number; // ms
  errorRateWarning: number; // percentage
  errorRateError: number; // percentage
  cacheHitRateWarning: number; // percentage
  memoryUsageWarning: number; // bytes
  memoryUsageError: number; // bytes
}

// ============================================================================
// Performance Monitoring Service Configuration
// ============================================================================

const DEFAULT_THRESHOLDS: PerformanceThresholds = {
  responseTimeWarning: 200, // 200ms
  responseTimeError: 500, // 500ms
  errorRateWarning: 5, // 5%
  errorRateError: 10, // 10%
  cacheHitRateWarning: 70, // 70%
  memoryUsageWarning: 100 * 1024 * 1024, // 100MB
  memoryUsageError: 200 * 1024 * 1024, // 200MB
};

// ============================================================================
// Performance Monitoring Service Class
// ============================================================================

export class PerformanceMonitoringService {
  private metrics: Map<string, PerformanceMetric[]>;
  private timings: TimingMetric[];
  private alerts: PerformanceAlert[];
  private thresholds: PerformanceThresholds;
  private isEnabled: boolean;
  private reportingInterval: number;

  constructor(
    thresholds: Partial<PerformanceThresholds> = {},
    reportingInterval: number = 60000 // 1 minute
  ) {
    this.metrics = new Map();
    this.timings = [];
    this.alerts = [];
    this.thresholds = { ...DEFAULT_THRESHOLDS, ...thresholds };
    this.isEnabled = true;
    this.reportingInterval = reportingInterval;

    // Start periodic reporting
    this.startPeriodicReporting();
  }

  // ============================================================================
  // Metric Collection
  // ============================================================================

  /**
   * Record a performance metric
   */
  public recordMetric(
    name: string,
    type: MetricType,
    value: number,
    tags: Record<string, string> = {},
    unit?: string
  ): void {
    if (!this.isEnabled) return;

    const metric: PerformanceMetric = {
      name,
      type,
      value,
      timestamp: Date.now(),
      tags,
      unit,
    };

    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }

    const metricHistory = this.metrics.get(name)!;
    metricHistory.push(metric);

    // Keep only recent metrics (last 1000 entries)
    if (metricHistory.length > 1000) {
      metricHistory.splice(0, metricHistory.length - 500);
    }

    // Check for alerts
    this.checkAlerts(metric);
  }

  /**
   * Record timing information
   */
  public recordTiming(
    operation: string,
    duration: number,
    success: boolean = true,
    error?: string,
    metadata?: Record<string, any>
  ): void {
    if (!this.isEnabled) return;

    const timing: TimingMetric = {
      operation,
      duration,
      timestamp: Date.now(),
      success,
      error,
      metadata,
    };

    this.timings.push(timing);

    // Keep only recent timings (last 10000 entries)
    if (this.timings.length > 10000) {
      this.timings = this.timings.slice(-5000);
    }

    // Record as metrics
    this.recordMetric(`timing.${operation}`, 'timer', duration, {
      success: success.toString(),
      ...(error && { error }),
    }, 'ms');
  }

  /**
   * Time a function execution
   */
  public async timeOperation<T>(
    operation: string,
    fn: () => Promise<T>,
    metadata?: Record<string, any>
  ): Promise<T> {
    const startTime = performance.now();
    let success = true;
    let error: string | undefined;

    try {
      const result = await fn();
      return result;
    } catch (err) {
      success = false;
      error = err instanceof Error ? err.message : 'Unknown error';
      throw err;
    } finally {
      const duration = performance.now() - startTime;
      this.recordTiming(operation, duration, success, error, metadata);
    }
  }

  /**
   * Create a timer decorator
   */
  public timer(operation?: string) {
    return (target: any, propertyName: string, descriptor: PropertyDescriptor) => {
      const method = descriptor.value;
      const operationName = operation || `${target.constructor.name}.${propertyName}`;

      descriptor.value = async function (...args: any[]) {
        return performanceMonitoringService.timeOperation(
          operationName,
          () => method.apply(this, args),
          { args: args.length }
        );
      };
    };
  }

  // ============================================================================
  // Performance Analysis
  // ============================================================================

  /**
   * Calculate percentiles for timing data
   */
  private calculatePercentiles(values: number[]): {
    p50: number;
    p95: number;
    p99: number;
  } {
    if (values.length === 0) {
      return { p50: 0, p95: 0, p99: 0 };
    }

    const sorted = [...values].sort((a, b) => a - b);
    const len = sorted.length;

    return {
      p50: sorted[Math.floor(len * 0.5)],
      p95: sorted[Math.floor(len * 0.95)],
      p99: sorted[Math.floor(len * 0.99)],
    };
  }

  /**
   * Generate performance report
   */
  public generateReport(timeframe: string = '1h'): PerformanceReport {
    const now = Date.now();
    const timeframeMs = this.parseTimeframe(timeframe);
    const cutoff = now - timeframeMs;

    // Filter recent timings
    const recentTimings = this.timings.filter(t => t.timestamp >= cutoff);
    const successfulTimings = recentTimings.filter(t => t.success);
    const failedTimings = recentTimings.filter(t => !t.success);

    // Calculate response time metrics
    const durations = successfulTimings.map(t => t.duration);
    const average = durations.length > 0 ? 
      durations.reduce((a, b) => a + b, 0) / durations.length : 0;
    const percentiles = this.calculatePercentiles(durations);

    // Calculate throughput
    const totalRequests = recentTimings.length;
    const requestsPerSecond = totalRequests / (timeframeMs / 1000);

    // Calculate error rate
    const errorRate = totalRequests > 0 ? 
      (failedTimings.length / totalRequests) * 100 : 0;

    // Get cache performance
    const cacheStats = cacheService.getStats();

    // Estimate memory usage
    const memoryUsage = this.estimateMemoryUsage();

    // Get recent alerts
    const recentAlerts = this.alerts.filter(a => a.timestamp >= cutoff);

    // Generate recommendations
    const recommendations = this.generateRecommendations({
      averageResponseTime: average,
      errorRate,
      cacheHitRate: cacheStats.metrics.hitRate * 100,
      memoryUsage: memoryUsage.current,
    });

    return {
      timeframe,
      metrics: {
        responseTime: {
          average,
          ...percentiles,
        },
        throughput: {
          requestsPerSecond,
          totalRequests,
        },
        errorRate: {
          percentage: errorRate,
          totalErrors: failedTimings.length,
        },
        cachePerformance: {
          hitRate: cacheStats.metrics.hitRate * 100,
          averageAccessTime: cacheStats.metrics.averageAccessTime,
        },
        memoryUsage,
      },
      alerts: recentAlerts,
      recommendations,
    };
  }

  /**
   * Get real-time performance metrics
   */
  public getRealTimeMetrics(): {
    responseTime: number;
    throughput: number;
    errorRate: number;
    cacheHitRate: number;
    activeAlerts: number;
  } {
    const recentTimings = this.timings.slice(-100); // Last 100 operations
    const successfulTimings = recentTimings.filter(t => t.success);
    
    const responseTime = successfulTimings.length > 0 ?
      successfulTimings.reduce((sum, t) => sum + t.duration, 0) / successfulTimings.length : 0;
    
    const throughput = recentTimings.length; // Operations in recent window
    
    const errorRate = recentTimings.length > 0 ?
      ((recentTimings.length - successfulTimings.length) / recentTimings.length) * 100 : 0;
    
    const cacheStats = cacheService.getStats();
    const cacheHitRate = cacheStats.metrics.hitRate * 100;
    
    const activeAlerts = this.alerts.filter(a => !a.resolved).length;

    return {
      responseTime,
      throughput,
      errorRate,
      cacheHitRate,
      activeAlerts,
    };
  }

  // ============================================================================
  // Alert Management
  // ============================================================================

  /**
   * Check for performance alerts
   */
  private checkAlerts(metric: PerformanceMetric): void {
    const alerts: PerformanceAlert[] = [];

    // Response time alerts
    if (metric.name.startsWith('timing.') && metric.type === 'timer') {
      if (metric.value > this.thresholds.responseTimeError) {
        alerts.push(this.createAlert(
          'critical',
          `Response time critical: ${metric.value.toFixed(2)}ms`,
          metric.name,
          this.thresholds.responseTimeError,
          metric.value
        ));
      } else if (metric.value > this.thresholds.responseTimeWarning) {
        alerts.push(this.createAlert(
          'warning',
          `Response time warning: ${metric.value.toFixed(2)}ms`,
          metric.name,
          this.thresholds.responseTimeWarning,
          metric.value
        ));
      }
    }

    // Add alerts to collection
    alerts.forEach(alert => {
      this.alerts.push(alert);
    });

    // Keep only recent alerts
    if (this.alerts.length > 1000) {
      this.alerts = this.alerts.slice(-500);
    }
  }

  /**
   * Create performance alert
   */
  private createAlert(
    level: AlertLevel,
    message: string,
    metric: string,
    threshold: number,
    currentValue: number
  ): PerformanceAlert {
    return {
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      level,
      message,
      metric,
      threshold,
      currentValue,
      timestamp: Date.now(),
      resolved: false,
    };
  }

  /**
   * Resolve alert
   */
  public resolveAlert(alertId: string): boolean {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.resolved = true;
      return true;
    }
    return false;
  }

  // ============================================================================
  // Utility Methods
  // ============================================================================

  /**
   * Parse timeframe string to milliseconds
   */
  private parseTimeframe(timeframe: string): number {
    const match = timeframe.match(/^(\d+)([smhd])$/);
    if (!match) return 60 * 60 * 1000; // Default 1 hour

    const value = parseInt(match[1]);
    const unit = match[2];

    switch (unit) {
      case 's': return value * 1000;
      case 'm': return value * 60 * 1000;
      case 'h': return value * 60 * 60 * 1000;
      case 'd': return value * 24 * 60 * 60 * 1000;
      default: return 60 * 60 * 1000;
    }
  }

  /**
   * Estimate memory usage
   */
  private estimateMemoryUsage(): { current: number; peak: number; average: number } {
    // Simple estimation based on cache size and metrics
    const cacheStats = cacheService.getStats();
    const baseMemory = 10 * 1024 * 1024; // 10MB base
    const current = baseMemory + cacheStats.metrics.totalSize;
    
    return {
      current,
      peak: current * 1.2, // Estimate
      average: current * 0.8, // Estimate
    };
  }

  /**
   * Generate performance recommendations
   */
  private generateRecommendations(metrics: {
    averageResponseTime: number;
    errorRate: number;
    cacheHitRate: number;
    memoryUsage: number;
  }): string[] {
    const recommendations: string[] = [];

    if (metrics.averageResponseTime > this.thresholds.responseTimeWarning) {
      recommendations.push('Consider optimizing slow operations or implementing additional caching');
    }

    if (metrics.errorRate > this.thresholds.errorRateWarning) {
      recommendations.push('Investigate and fix sources of errors to improve reliability');
    }

    if (metrics.cacheHitRate < this.thresholds.cacheHitRateWarning) {
      recommendations.push('Review caching strategy and consider increasing cache size or TTL');
    }

    if (metrics.memoryUsage > this.thresholds.memoryUsageWarning) {
      recommendations.push('Monitor memory usage and consider implementing memory optimization');
    }

    if (recommendations.length === 0) {
      recommendations.push('Performance is within acceptable thresholds');
    }

    return recommendations;
  }

  /**
   * Start periodic reporting
   */
  private startPeriodicReporting(): void {
    setInterval(() => {
      if (this.isEnabled) {
        const report = this.generateReport('5m');
        
        // Log performance summary
        console.log('Performance Report:', {
          responseTime: report.metrics.responseTime.average.toFixed(2) + 'ms',
          throughput: report.metrics.throughput.requestsPerSecond.toFixed(2) + ' req/s',
          errorRate: report.metrics.errorRate.percentage.toFixed(2) + '%',
          cacheHitRate: report.metrics.cachePerformance.hitRate.toFixed(2) + '%',
          activeAlerts: report.alerts.filter(a => !a.resolved).length,
        });
      }
    }, this.reportingInterval);
  }

  /**
   * Enable/disable monitoring
   */
  public setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  /**
   * Get monitoring status
   */
  public isMonitoringEnabled(): boolean {
    return this.isEnabled;
  }
}

// ============================================================================
// Service Instance
// ============================================================================

export const performanceMonitoringService = new PerformanceMonitoringService();
