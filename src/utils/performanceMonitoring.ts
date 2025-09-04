/**
 * Performance Monitoring System
 * 
 * Collects and reports Core Web Vitals and custom performance metrics
 * for production monitoring and optimization.
 */

export interface PerformanceMetrics {
  // Core Web Vitals
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  fcp?: number; // First Contentful Paint
  ttfb?: number; // Time to First Byte
  
  // Custom Metrics
  calculationTime?: number;
  renderTime?: number;
  navigationTime?: number;
  memoryUsage?: number;
  
  // Context
  url: string;
  userAgent: string;
  timestamp: number;
  sessionId: string;
}

export interface PerformanceReport {
  metrics: PerformanceMetrics;
  status: 'good' | 'needs-improvement' | 'poor';
  recommendations: string[];
}

class PerformanceMonitor {
  private metrics: Partial<PerformanceMetrics> = {};
  private sessionId: string;
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initializeMonitoring();
  }

  /**
   * Initialize performance monitoring
   */
  private initializeMonitoring(): void {
    if (typeof window === 'undefined') return;

    // Monitor Core Web Vitals
    this.observeLCP();
    this.observeFID();
    this.observeCLS();
    this.observeFCP();
    this.observeTTFB();

    // Monitor custom metrics
    this.observeNavigationTiming();
    this.observeMemoryUsage();

    // Report metrics periodically
    this.scheduleReporting();
  }

  /**
   * Observe Largest Contentful Paint (LCP)
   */
  private observeLCP(): void {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as PerformanceEntry;
        
        if (lastEntry) {
          this.metrics.lcp = lastEntry.startTime;
          console.log('LCP:', lastEntry.startTime);
        }
      });

      observer.observe({ type: 'largest-contentful-paint', buffered: true });
      this.observers.push(observer);
    } catch (error) {
      console.warn('LCP observation failed:', error);
    }
  }

  /**
   * Observe First Input Delay (FID)
   */
  private observeFID(): void {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (entry.processingStart && entry.startTime) {
            const fid = entry.processingStart - entry.startTime;
            this.metrics.fid = fid;
            console.log('FID:', fid);
          }
        });
      });

      observer.observe({ type: 'first-input', buffered: true });
      this.observers.push(observer);
    } catch (error) {
      console.warn('FID observation failed:', error);
    }
  }

  /**
   * Observe Cumulative Layout Shift (CLS)
   */
  private observeCLS(): void {
    if (!('PerformanceObserver' in window)) return;

    try {
      let clsValue = 0;
      
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        
        this.metrics.cls = clsValue;
        console.log('CLS:', clsValue);
      });

      observer.observe({ type: 'layout-shift', buffered: true });
      this.observers.push(observer);
    } catch (error) {
      console.warn('CLS observation failed:', error);
    }
  }

  /**
   * Observe First Contentful Paint (FCP)
   */
  private observeFCP(): void {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.fcp = entry.startTime;
            console.log('FCP:', entry.startTime);
          }
        });
      });

      observer.observe({ type: 'paint', buffered: true });
      this.observers.push(observer);
    } catch (error) {
      console.warn('FCP observation failed:', error);
    }
  }

  /**
   * Observe Time to First Byte (TTFB)
   */
  private observeTTFB(): void {
    try {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        const ttfb = navigation.responseStart - navigation.requestStart;
        this.metrics.ttfb = ttfb;
        console.log('TTFB:', ttfb);
      }
    } catch (error) {
      console.warn('TTFB observation failed:', error);
    }
  }

  /**
   * Observe navigation timing
   */
  private observeNavigationTiming(): void {
    try {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        this.metrics.navigationTime = navigation.loadEventEnd - navigation.navigationStart;
        this.metrics.renderTime = navigation.domContentLoadedEventEnd - navigation.navigationStart;
      }
    } catch (error) {
      console.warn('Navigation timing observation failed:', error);
    }
  }

  /**
   * Observe memory usage
   */
  private observeMemoryUsage(): void {
    try {
      // @ts-ignore - performance.memory is available in Chrome
      const memory = (performance as any).memory;
      if (memory) {
        this.metrics.memoryUsage = memory.usedJSHeapSize;
      }
    } catch (error) {
      console.warn('Memory usage observation failed:', error);
    }
  }

  /**
   * Record custom calculation time
   */
  recordCalculationTime(startTime: number, endTime: number): void {
    this.metrics.calculationTime = endTime - startTime;
  }

  /**
   * Get current metrics
   */
  getMetrics(): PerformanceMetrics {
    return {
      ...this.metrics,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
      sessionId: this.sessionId
    } as PerformanceMetrics;
  }

  /**
   * Generate performance report with recommendations
   */
  generateReport(): PerformanceReport {
    const metrics = this.getMetrics();
    const status = this.evaluatePerformance(metrics);
    const recommendations = this.generateRecommendations(metrics);

    return {
      metrics,
      status,
      recommendations
    };
  }

  /**
   * Evaluate overall performance status
   */
  private evaluatePerformance(metrics: PerformanceMetrics): 'good' | 'needs-improvement' | 'poor' {
    const scores = [];

    // LCP scoring
    if (metrics.lcp !== undefined) {
      if (metrics.lcp <= 2500) scores.push('good');
      else if (metrics.lcp <= 4000) scores.push('needs-improvement');
      else scores.push('poor');
    }

    // FID scoring
    if (metrics.fid !== undefined) {
      if (metrics.fid <= 100) scores.push('good');
      else if (metrics.fid <= 300) scores.push('needs-improvement');
      else scores.push('poor');
    }

    // CLS scoring
    if (metrics.cls !== undefined) {
      if (metrics.cls <= 0.1) scores.push('good');
      else if (metrics.cls <= 0.25) scores.push('needs-improvement');
      else scores.push('poor');
    }

    // Overall scoring
    const poorCount = scores.filter(s => s === 'poor').length;
    const needsImprovementCount = scores.filter(s => s === 'needs-improvement').length;

    if (poorCount > 0) return 'poor';
    if (needsImprovementCount > 0) return 'needs-improvement';
    return 'good';
  }

  /**
   * Generate performance recommendations
   */
  private generateRecommendations(metrics: PerformanceMetrics): string[] {
    const recommendations: string[] = [];

    // LCP recommendations
    if (metrics.lcp && metrics.lcp > 2500) {
      recommendations.push('Optimize Largest Contentful Paint by reducing server response times and optimizing critical resources');
    }

    // FID recommendations
    if (metrics.fid && metrics.fid > 100) {
      recommendations.push('Improve First Input Delay by reducing JavaScript execution time and breaking up long tasks');
    }

    // CLS recommendations
    if (metrics.cls && metrics.cls > 0.1) {
      recommendations.push('Reduce Cumulative Layout Shift by setting dimensions for images and avoiding dynamic content insertion');
    }

    // TTFB recommendations
    if (metrics.ttfb && metrics.ttfb > 600) {
      recommendations.push('Improve Time to First Byte by optimizing server performance and using CDN');
    }

    // Memory recommendations
    if (metrics.memoryUsage && metrics.memoryUsage > 50 * 1024 * 1024) { // 50MB
      recommendations.push('Optimize memory usage by reducing bundle size and implementing code splitting');
    }

    return recommendations;
  }

  /**
   * Schedule periodic reporting
   */
  private scheduleReporting(): void {
    // Report metrics after page load
    window.addEventListener('load', () => {
      setTimeout(() => {
        this.reportMetrics();
      }, 1000);
    });

    // Report metrics before page unload
    window.addEventListener('beforeunload', () => {
      this.reportMetrics();
    });

    // Report metrics periodically
    setInterval(() => {
      this.reportMetrics();
    }, 30000); // Every 30 seconds
  }

  /**
   * Report metrics to monitoring service
   */
  private reportMetrics(): void {
    const report = this.generateReport();
    
    // Log to console in development
    if (import.meta.env.DEV) {
      console.log('Performance Report:', report);
    }

    // Send to monitoring service in production
    if (import.meta.env.PROD && import.meta.env.VITE_ENABLE_MONITORING === 'true') {
      this.sendToMonitoringService(report);
    }
  }

  /**
   * Send metrics to external monitoring service
   */
  private async sendToMonitoringService(report: PerformanceReport): Promise<void> {
    try {
      // This would integrate with your monitoring service (e.g., Sentry, DataDog, etc.)
      const response = await fetch('/api/metrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(report),
      });

      if (!response.ok) {
        console.warn('Failed to send metrics to monitoring service');
      }
    } catch (error) {
      console.warn('Error sending metrics:', error);
    }
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Cleanup observers
   */
  cleanup(): void {
    this.observers.forEach(observer => {
      observer.disconnect();
    });
    this.observers = [];
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Export utility functions
export const recordCalculationStart = () => performance.now();
export const recordCalculationEnd = (startTime: number) => {
  const endTime = performance.now();
  performanceMonitor.recordCalculationTime(startTime, endTime);
  return endTime - startTime;
};
