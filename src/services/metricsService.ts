/**
 * Metrics Service for Application Performance Monitoring
 * Collects and exports metrics for Prometheus monitoring
 */

export interface MetricData {
  name: string;
  value: number;
  labels?: Record<string, string>;
  timestamp?: number;
}

export interface CalculatorMetrics {
  calculatorType: string;
  executionTime: number;
  success: boolean;
  errorType?: string;
  userId?: string;
}

export interface UserMetrics {
  userId: string;
  sessionId: string;
  action: string;
  page: string;
  timestamp: number;
}

export interface PerformanceMetrics {
  route: string;
  method: string;
  statusCode: number;
  responseTime: number;
  timestamp: number;
}

class MetricsService {
  private metrics: Map<string, MetricData[]> = new Map();
  private isEnabled: boolean;
  private batchSize: number = 100;
  private flushInterval: number = 30000; // 30 seconds
  private flushTimer?: NodeJS.Timeout;

  constructor() {
    this.isEnabled = import.meta.env.VITE_MONITORING_ENABLED === 'true';
    
    if (this.isEnabled) {
      this.startPeriodicFlush();
      this.setupPerformanceObserver();
    }
  }

  /**
   * Record calculator usage metrics
   */
  recordCalculatorUsage(metrics: CalculatorMetrics): void {
    if (!this.isEnabled) return;

    const labels = {
      calculator_type: metrics.calculatorType,
      success: metrics.success.toString(),
      ...(metrics.errorType && { error_type: metrics.errorType }),
      ...(metrics.userId && { user_id: metrics.userId }),
    };

    // Calculator execution time
    this.addMetric({
      name: 'calculator_execution_duration_seconds',
      value: metrics.executionTime / 1000, // Convert to seconds
      labels,
    });

    // Calculator usage counter
    this.addMetric({
      name: 'calculator_usage_total',
      value: 1,
      labels,
    });

    // Error counter
    if (!metrics.success) {
      this.addMetric({
        name: 'calculator_errors_total',
        value: 1,
        labels,
      });
    }
  }

  /**
   * Record user behavior metrics
   */
  recordUserAction(metrics: UserMetrics): void {
    if (!this.isEnabled) return;

    const labels = {
      user_id: metrics.userId,
      session_id: metrics.sessionId,
      action: metrics.action,
      page: metrics.page,
    };

    this.addMetric({
      name: 'user_actions_total',
      value: 1,
      labels,
    });
  }

  /**
   * Record HTTP request metrics
   */
  recordHttpRequest(metrics: PerformanceMetrics): void {
    if (!this.isEnabled) return;

    const labels = {
      route: metrics.route,
      method: metrics.method,
      status_code: metrics.statusCode.toString(),
    };

    // Request duration
    this.addMetric({
      name: 'http_request_duration_seconds',
      value: metrics.responseTime / 1000,
      labels,
    });

    // Request counter
    this.addMetric({
      name: 'http_requests_total',
      value: 1,
      labels,
    });
  }

  /**
   * Record custom business metrics
   */
  recordBusinessMetric(name: string, value: number, labels?: Record<string, string>): void {
    if (!this.isEnabled) return;

    this.addMetric({
      name: `business_${name}`,
      value,
      labels,
    });
  }

  /**
   * Record memory usage metrics
   */
  recordMemoryUsage(): void {
    if (!this.isEnabled || typeof performance === 'undefined' || !('memory' in performance)) return;

    const memory = (performance as any).memory;
    
    this.addMetric({
      name: 'memory_used_bytes',
      value: memory.usedJSHeapSize,
    });

    this.addMetric({
      name: 'memory_total_bytes',
      value: memory.totalJSHeapSize,
    });

    this.addMetric({
      name: 'memory_limit_bytes',
      value: memory.jsHeapSizeLimit,
    });
  }

  /**
   * Record page load performance
   */
  recordPageLoad(page: string, loadTime: number): void {
    if (!this.isEnabled) return;

    this.addMetric({
      name: 'page_load_duration_seconds',
      value: loadTime / 1000,
      labels: { page },
    });
  }

  /**
   * Record error metrics
   */
  recordError(error: Error, context?: Record<string, string>): void {
    if (!this.isEnabled) return;

    const labels = {
      error_type: error.name,
      error_message: error.message.substring(0, 100), // Limit message length
      ...context,
    };

    this.addMetric({
      name: 'application_errors_total',
      value: 1,
      labels,
    });
  }

  /**
   * Record feature usage
   */
  recordFeatureUsage(feature: string, userId?: string): void {
    if (!this.isEnabled) return;

    const labels = {
      feature,
      ...(userId && { user_id: userId }),
    };

    this.addMetric({
      name: 'feature_usage_total',
      value: 1,
      labels,
    });
  }

  /**
   * Add metric to collection
   */
  private addMetric(metric: MetricData): void {
    const key = metric.name;
    
    if (!this.metrics.has(key)) {
      this.metrics.set(key, []);
    }

    const metrics = this.metrics.get(key)!;
    metrics.push({
      ...metric,
      timestamp: metric.timestamp || Date.now(),
    });

    // Trigger flush if batch size reached
    if (metrics.length >= this.batchSize) {
      this.flushMetrics();
    }
  }

  /**
   * Setup performance observer for automatic metrics collection
   */
  private setupPerformanceObserver(): void {
    if (typeof PerformanceObserver === 'undefined') return;

    try {
      // Navigation timing
      const navObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            
            this.addMetric({
              name: 'page_load_time_seconds',
              value: navEntry.loadEventEnd / 1000,
              labels: { page: window.location.pathname },
            });

            this.addMetric({
              name: 'dom_content_loaded_seconds',
              value: navEntry.domContentLoadedEventEnd / 1000,
              labels: { page: window.location.pathname },
            });
          }
        }
      });

      navObserver.observe({ entryTypes: ['navigation'] });

      // Resource timing
      const resourceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'resource') {
            const resourceEntry = entry as PerformanceResourceTiming;
            
            this.addMetric({
              name: 'resource_load_time_seconds',
              value: resourceEntry.duration / 1000,
              labels: {
                resource_type: resourceEntry.initiatorType,
                resource_name: resourceEntry.name.split('/').pop() || 'unknown',
              },
            });
          }
        }
      });

      resourceObserver.observe({ entryTypes: ['resource'] });

    } catch (error) {
      console.warn('Performance Observer not supported:', error);
    }
  }

  /**
   * Start periodic metrics flush
   */
  private startPeriodicFlush(): void {
    this.flushTimer = setInterval(() => {
      this.flushMetrics();
      this.recordMemoryUsage();
    }, this.flushInterval);
  }

  /**
   * Flush metrics to monitoring endpoint
   */
  private async flushMetrics(): Promise<void> {
    if (this.metrics.size === 0) return;

    const metricsToFlush = new Map(this.metrics);
    this.metrics.clear();

    try {
      const metricsData = this.formatMetricsForExport(metricsToFlush);
      await this.sendMetrics(metricsData);
    } catch (error) {
      console.error('Failed to flush metrics:', error);
      // Re-add metrics back to queue for retry
      for (const [key, values] of metricsToFlush) {
        const existing = this.metrics.get(key) || [];
        this.metrics.set(key, [...existing, ...values]);
      }
    }
  }

  /**
   * Format metrics for Prometheus export
   */
  private formatMetricsForExport(metrics: Map<string, MetricData[]>): string {
    const lines: string[] = [];

    for (const [metricName, metricValues] of metrics) {
      // Add metric help and type
      lines.push(`# HELP ${metricName} Application metric`);
      lines.push(`# TYPE ${metricName} counter`);

      // Add metric values
      for (const metric of metricValues) {
        const labelsStr = metric.labels 
          ? Object.entries(metric.labels)
              .map(([key, value]) => `${key}="${value}"`)
              .join(',')
          : '';
        
        const metricLine = labelsStr 
          ? `${metricName}{${labelsStr}} ${metric.value} ${metric.timestamp}`
          : `${metricName} ${metric.value} ${metric.timestamp}`;
        
        lines.push(metricLine);
      }
    }

    return lines.join('\n');
  }

  /**
   * Send metrics to monitoring endpoint
   */
  private async sendMetrics(metricsData: string): Promise<void> {
    const endpoint = '/api/metrics';
    
    await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: metricsData,
    });
  }

  /**
   * Get current metrics for debugging
   */
  getMetrics(): Map<string, MetricData[]> {
    return new Map(this.metrics);
  }

  /**
   * Clear all metrics
   */
  clearMetrics(): void {
    this.metrics.clear();
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = undefined;
    }
    
    // Flush remaining metrics
    this.flushMetrics();
  }
}

// Export singleton instance
export const metricsService = new MetricsService();

// Utility functions for common metrics
export const recordCalculatorUsage = (metrics: CalculatorMetrics) => 
  metricsService.recordCalculatorUsage(metrics);

export const recordUserAction = (metrics: UserMetrics) => 
  metricsService.recordUserAction(metrics);

export const recordHttpRequest = (metrics: PerformanceMetrics) => 
  metricsService.recordHttpRequest(metrics);

export const recordError = (error: Error, context?: Record<string, string>) => 
  metricsService.recordError(error, context);

export const recordFeatureUsage = (feature: string, userId?: string) => 
  metricsService.recordFeatureUsage(feature, userId);

// Cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    metricsService.destroy();
  });
}
