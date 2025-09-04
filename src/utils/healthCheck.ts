/**
 * Health Check System
 * 
 * Provides comprehensive health monitoring for the application
 * including system status, dependencies, and performance metrics.
 */

export interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  uptime: number;
  checks: {
    [key: string]: {
      status: 'pass' | 'warn' | 'fail';
      message: string;
      duration: number;
      metadata?: Record<string, any>;
    };
  };
  metrics: {
    memory: {
      used: number;
      total: number;
      percentage: number;
    };
    performance: {
      loadTime: number;
      renderTime: number;
      interactionTime: number;
    };
    errors: {
      count: number;
      rate: number;
    };
  };
}

export class HealthCheckService {
  private startTime: number;
  private errorCount: number = 0;
  private lastErrorTime: number = 0;

  constructor() {
    this.startTime = Date.now();
    this.setupErrorTracking();
  }

  /**
   * Perform comprehensive health check
   */
  async performHealthCheck(): Promise<HealthCheckResult> {
    const startTime = performance.now();
    const checks: HealthCheckResult['checks'] = {};

    // System checks
    checks.system = await this.checkSystem();
    checks.memory = await this.checkMemory();
    checks.storage = await this.checkStorage();
    checks.network = await this.checkNetwork();
    checks.dependencies = await this.checkDependencies();
    checks.performance = await this.checkPerformance();

    // Calculate overall status
    const statuses = Object.values(checks).map(check => check.status);
    const overallStatus = this.calculateOverallStatus(statuses);

    // Get metrics
    const metrics = await this.getMetrics();

    const result: HealthCheckResult = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      version: this.getVersion(),
      uptime: Date.now() - this.startTime,
      checks,
      metrics
    };

    const duration = performance.now() - startTime;
    console.log(`Health check completed in ${duration.toFixed(2)}ms with status: ${overallStatus}`);

    return result;
  }

  /**
   * Check system status
   */
  private async checkSystem(): Promise<HealthCheckResult['checks'][string]> {
    const start = performance.now();
    
    try {
      // Check if main application components are available
      const hasReact = typeof React !== 'undefined';
      const hasDOM = typeof document !== 'undefined';
      const hasWindow = typeof window !== 'undefined';

      if (!hasReact || !hasDOM || !hasWindow) {
        return {
          status: 'fail',
          message: 'Core system components missing',
          duration: performance.now() - start,
          metadata: { hasReact, hasDOM, hasWindow }
        };
      }

      return {
        status: 'pass',
        message: 'System components available',
        duration: performance.now() - start,
        metadata: { hasReact, hasDOM, hasWindow }
      };
    } catch (error) {
      return {
        status: 'fail',
        message: `System check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration: performance.now() - start
      };
    }
  }

  /**
   * Check memory usage
   */
  private async checkMemory(): Promise<HealthCheckResult['checks'][string]> {
    const start = performance.now();
    
    try {
      // @ts-ignore - performance.memory is available in Chrome
      const memory = (performance as any).memory;
      
      if (!memory) {
        return {
          status: 'warn',
          message: 'Memory information not available',
          duration: performance.now() - start
        };
      }

      const used = memory.usedJSHeapSize;
      const total = memory.totalJSHeapSize;
      const limit = memory.jsHeapSizeLimit;
      const percentage = (used / limit) * 100;

      const status = percentage > 90 ? 'fail' : percentage > 70 ? 'warn' : 'pass';
      const message = `Memory usage: ${percentage.toFixed(1)}% (${(used / 1024 / 1024).toFixed(1)}MB / ${(limit / 1024 / 1024).toFixed(1)}MB)`;

      return {
        status,
        message,
        duration: performance.now() - start,
        metadata: { used, total, limit, percentage }
      };
    } catch (error) {
      return {
        status: 'warn',
        message: `Memory check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration: performance.now() - start
      };
    }
  }

  /**
   * Check local storage availability
   */
  private async checkStorage(): Promise<HealthCheckResult['checks'][string]> {
    const start = performance.now();
    
    try {
      const testKey = '__health_check_test__';
      const testValue = 'test';

      // Test localStorage
      localStorage.setItem(testKey, testValue);
      const retrieved = localStorage.getItem(testKey);
      localStorage.removeItem(testKey);

      if (retrieved !== testValue) {
        return {
          status: 'fail',
          message: 'localStorage read/write test failed',
          duration: performance.now() - start
        };
      }

      // Check available storage
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        const used = estimate.usage || 0;
        const quota = estimate.quota || 0;
        const percentage = quota > 0 ? (used / quota) * 100 : 0;

        const status = percentage > 90 ? 'warn' : 'pass';
        const message = `Storage usage: ${percentage.toFixed(1)}% (${(used / 1024 / 1024).toFixed(1)}MB / ${(quota / 1024 / 1024).toFixed(1)}MB)`;

        return {
          status,
          message,
          duration: performance.now() - start,
          metadata: { used, quota, percentage }
        };
      }

      return {
        status: 'pass',
        message: 'localStorage available',
        duration: performance.now() - start
      };
    } catch (error) {
      return {
        status: 'fail',
        message: `Storage check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration: performance.now() - start
      };
    }
  }

  /**
   * Check network connectivity
   */
  private async checkNetwork(): Promise<HealthCheckResult['checks'][string]> {
    const start = performance.now();
    
    try {
      const online = navigator.onLine;
      
      if (!online) {
        return {
          status: 'fail',
          message: 'Network offline',
          duration: performance.now() - start,
          metadata: { online }
        };
      }

      // Test network speed if available
      // @ts-ignore - connection is available in some browsers
      const connection = (navigator as any).connection;
      
      if (connection) {
        const effectiveType = connection.effectiveType;
        const downlink = connection.downlink;
        const rtt = connection.rtt;

        const status = effectiveType === 'slow-2g' ? 'warn' : 'pass';
        const message = `Network: ${effectiveType}, ${downlink}Mbps, ${rtt}ms RTT`;

        return {
          status,
          message,
          duration: performance.now() - start,
          metadata: { online, effectiveType, downlink, rtt }
        };
      }

      return {
        status: 'pass',
        message: 'Network online',
        duration: performance.now() - start,
        metadata: { online }
      };
    } catch (error) {
      return {
        status: 'warn',
        message: `Network check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration: performance.now() - start
      };
    }
  }

  /**
   * Check critical dependencies
   */
  private async checkDependencies(): Promise<HealthCheckResult['checks'][string]> {
    const start = performance.now();
    
    try {
      const dependencies = {
        react: typeof React !== 'undefined',
        reactDOM: typeof ReactDOM !== 'undefined',
        router: typeof window !== 'undefined' && 'history' in window,
        webWorkers: typeof Worker !== 'undefined',
        serviceWorker: 'serviceWorker' in navigator,
        webGL: this.checkWebGLSupport(),
        indexedDB: 'indexedDB' in window,
        fetch: typeof fetch !== 'undefined'
      };

      const missing = Object.entries(dependencies)
        .filter(([, available]) => !available)
        .map(([name]) => name);

      if (missing.length > 0) {
        const status = missing.includes('react') || missing.includes('reactDOM') ? 'fail' : 'warn';
        return {
          status,
          message: `Missing dependencies: ${missing.join(', ')}`,
          duration: performance.now() - start,
          metadata: dependencies
        };
      }

      return {
        status: 'pass',
        message: 'All dependencies available',
        duration: performance.now() - start,
        metadata: dependencies
      };
    } catch (error) {
      return {
        status: 'fail',
        message: `Dependency check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration: performance.now() - start
      };
    }
  }

  /**
   * Check performance metrics
   */
  private async checkPerformance(): Promise<HealthCheckResult['checks'][string]> {
    const start = performance.now();
    
    try {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (!navigation) {
        return {
          status: 'warn',
          message: 'Performance navigation timing not available',
          duration: performance.now() - start
        };
      }

      const loadTime = navigation.loadEventEnd - navigation.navigationStart;
      const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.navigationStart;
      const firstPaint = this.getFirstPaint();

      const status = loadTime > 5000 ? 'warn' : loadTime > 3000 ? 'warn' : 'pass';
      const message = `Load time: ${loadTime.toFixed(0)}ms, DOM: ${domContentLoaded.toFixed(0)}ms`;

      return {
        status,
        message,
        duration: performance.now() - start,
        metadata: { loadTime, domContentLoaded, firstPaint }
      };
    } catch (error) {
      return {
        status: 'warn',
        message: `Performance check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration: performance.now() - start
      };
    }
  }

  /**
   * Get application metrics
   */
  private async getMetrics(): Promise<HealthCheckResult['metrics']> {
    // @ts-ignore
    const memory = (performance as any).memory;
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

    return {
      memory: {
        used: memory ? memory.usedJSHeapSize : 0,
        total: memory ? memory.totalJSHeapSize : 0,
        percentage: memory ? (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100 : 0
      },
      performance: {
        loadTime: navigation ? navigation.loadEventEnd - navigation.navigationStart : 0,
        renderTime: navigation ? navigation.domContentLoadedEventEnd - navigation.navigationStart : 0,
        interactionTime: this.getFirstInputDelay()
      },
      errors: {
        count: this.errorCount,
        rate: this.calculateErrorRate()
      }
    };
  }

  /**
   * Setup error tracking
   */
  private setupErrorTracking(): void {
    window.addEventListener('error', (event) => {
      this.errorCount++;
      this.lastErrorTime = Date.now();
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.errorCount++;
      this.lastErrorTime = Date.now();
    });
  }

  /**
   * Helper methods
   */
  private calculateOverallStatus(statuses: string[]): 'healthy' | 'degraded' | 'unhealthy' {
    if (statuses.includes('fail')) return 'unhealthy';
    if (statuses.includes('warn')) return 'degraded';
    return 'healthy';
  }

  private getVersion(): string {
    return import.meta.env.VITE_APP_VERSION || '1.0.0';
  }

  private checkWebGLSupport(): boolean {
    try {
      const canvas = document.createElement('canvas');
      return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    } catch {
      return false;
    }
  }

  private getFirstPaint(): number {
    const paintEntries = performance.getEntriesByType('paint');
    const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
    return firstPaint ? firstPaint.startTime : 0;
  }

  private getFirstInputDelay(): number {
    // This would be populated by Web Vitals library in a real implementation
    return 0;
  }

  private calculateErrorRate(): number {
    const timeWindow = 60000; // 1 minute
    const now = Date.now();
    
    if (now - this.lastErrorTime > timeWindow) {
      return 0;
    }
    
    return this.errorCount / (this.getUptime() / 1000); // errors per second
  }

  private getUptime(): number {
    return Date.now() - this.startTime;
  }
}

// Export singleton instance
export const healthCheckService = new HealthCheckService();
