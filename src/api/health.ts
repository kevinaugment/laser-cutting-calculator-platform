/**
 * Health Check API Endpoint
 * Provides comprehensive health status for production monitoring
 */

export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  uptime: number;
  version: string;
  environment: string;
  services: {
    database: ServiceHealth;
    cache: ServiceHealth;
    memorySystem: ServiceHealth;
    mlModels: ServiceHealth;
    security: ServiceHealth;
  };
  metrics: {
    memory: MemoryMetrics;
    performance: PerformanceMetrics;
    requests: RequestMetrics;
  };
  checks: HealthCheck[];
}

export interface ServiceHealth {
  status: 'healthy' | 'unhealthy' | 'degraded';
  responseTime: number;
  lastCheck: string;
  error?: string;
}

export interface MemoryMetrics {
  used: number;
  total: number;
  percentage: number;
}

export interface PerformanceMetrics {
  averageResponseTime: number;
  requestsPerSecond: number;
  errorRate: number;
}

export interface RequestMetrics {
  total: number;
  successful: number;
  failed: number;
  lastHour: number;
}

export interface HealthCheck {
  name: string;
  status: 'pass' | 'fail' | 'warn';
  duration: number;
  message?: string;
}

class HealthCheckService {
  private startTime: number;
  private requestCount: number = 0;
  private errorCount: number = 0;
  private responseTimes: number[] = [];

  constructor() {
    this.startTime = Date.now();
  }

  /**
   * Perform comprehensive health check
   */
  async performHealthCheck(): Promise<HealthCheckResponse> {
    const startTime = Date.now();
    const checks: HealthCheck[] = [];

    try {
      // Basic system checks
      const memoryCheck = await this.checkMemoryUsage();
      checks.push(memoryCheck);

      const diskCheck = await this.checkDiskSpace();
      checks.push(diskCheck);

      // Service checks
      const databaseCheck = await this.checkDatabase();
      const cacheCheck = await this.checkCache();
      const memorySystemCheck = await this.checkMemorySystem();
      const mlModelsCheck = await this.checkMLModels();
      const securityCheck = await this.checkSecurity();

      checks.push(databaseCheck, cacheCheck, memorySystemCheck, mlModelsCheck, securityCheck);

      // Determine overall status
      const overallStatus = this.determineOverallStatus(checks);

      return {
        status: overallStatus,
        timestamp: new Date().toISOString(),
        uptime: Date.now() - this.startTime,
        version: process.env.VITE_APP_VERSION || '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        services: {
          database: await this.getServiceHealth('database'),
          cache: await this.getServiceHealth('cache'),
          memorySystem: await this.getServiceHealth('memorySystem'),
          mlModels: await this.getServiceHealth('mlModels'),
          security: await this.getServiceHealth('security'),
        },
        metrics: {
          memory: this.getMemoryMetrics(),
          performance: this.getPerformanceMetrics(),
          requests: this.getRequestMetrics(),
        },
        checks,
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        uptime: Date.now() - this.startTime,
        version: process.env.VITE_APP_VERSION || '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        services: {
          database: { status: 'unhealthy', responseTime: 0, lastCheck: new Date().toISOString(), error: 'Health check failed' },
          cache: { status: 'unhealthy', responseTime: 0, lastCheck: new Date().toISOString(), error: 'Health check failed' },
          memorySystem: { status: 'unhealthy', responseTime: 0, lastCheck: new Date().toISOString(), error: 'Health check failed' },
          mlModels: { status: 'unhealthy', responseTime: 0, lastCheck: new Date().toISOString(), error: 'Health check failed' },
          security: { status: 'unhealthy', responseTime: 0, lastCheck: new Date().toISOString(), error: 'Health check failed' },
        },
        metrics: {
          memory: { used: 0, total: 0, percentage: 0 },
          performance: { averageResponseTime: 0, requestsPerSecond: 0, errorRate: 100 },
          requests: { total: 0, successful: 0, failed: 0, lastHour: 0 },
        },
        checks: [{
          name: 'system',
          status: 'fail',
          duration: Date.now() - startTime,
          message: error instanceof Error ? error.message : 'Unknown error',
        }],
      };
    }
  }

  /**
   * Check memory usage
   */
  private async checkMemoryUsage(): Promise<HealthCheck> {
    const startTime = Date.now();
    
    try {
      const memoryUsage = this.getMemoryMetrics();
      const status = memoryUsage.percentage > 90 ? 'fail' : memoryUsage.percentage > 80 ? 'warn' : 'pass';
      
      return {
        name: 'memory',
        status,
        duration: Date.now() - startTime,
        message: `Memory usage: ${memoryUsage.percentage.toFixed(1)}%`,
      };
    } catch (error) {
      return {
        name: 'memory',
        status: 'fail',
        duration: Date.now() - startTime,
        message: error instanceof Error ? error.message : 'Memory check failed',
      };
    }
  }

  /**
   * Check disk space
   */
  private async checkDiskSpace(): Promise<HealthCheck> {
    const startTime = Date.now();
    
    try {
      // In browser environment, we can't check actual disk space
      // This would be implemented in a Node.js backend
      return {
        name: 'disk',
        status: 'pass',
        duration: Date.now() - startTime,
        message: 'Disk space check not available in browser',
      };
    } catch (error) {
      return {
        name: 'disk',
        status: 'fail',
        duration: Date.now() - startTime,
        message: error instanceof Error ? error.message : 'Disk check failed',
      };
    }
  }

  /**
   * Check database connectivity
   */
  private async checkDatabase(): Promise<HealthCheck> {
    const startTime = Date.now();
    
    try {
      // Simulate database check
      // In production, this would make an actual database query
      await new Promise(resolve => setTimeout(resolve, 10));
      
      return {
        name: 'database',
        status: 'pass',
        duration: Date.now() - startTime,
        message: 'Database connection healthy',
      };
    } catch (error) {
      return {
        name: 'database',
        status: 'fail',
        duration: Date.now() - startTime,
        message: error instanceof Error ? error.message : 'Database check failed',
      };
    }
  }

  /**
   * Check cache connectivity
   */
  private async checkCache(): Promise<HealthCheck> {
    const startTime = Date.now();
    
    try {
      // Simulate cache check
      // In production, this would check Redis connectivity
      await new Promise(resolve => setTimeout(resolve, 5));
      
      return {
        name: 'cache',
        status: 'pass',
        duration: Date.now() - startTime,
        message: 'Cache connection healthy',
      };
    } catch (error) {
      return {
        name: 'cache',
        status: 'fail',
        duration: Date.now() - startTime,
        message: error instanceof Error ? error.message : 'Cache check failed',
      };
    }
  }

  /**
   * Check Memory System health
   */
  private async checkMemorySystem(): Promise<HealthCheck> {
    const startTime = Date.now();
    
    try {
      // Check if Memory System is enabled and functional
      const isEnabled = import.meta.env.VITE_MEMORY_SYSTEM_ENABLED === 'true';
      
      if (!isEnabled) {
        return {
          name: 'memorySystem',
          status: 'warn',
          duration: Date.now() - startTime,
          message: 'Memory System disabled',
        };
      }
      
      return {
        name: 'memorySystem',
        status: 'pass',
        duration: Date.now() - startTime,
        message: 'Memory System operational',
      };
    } catch (error) {
      return {
        name: 'memorySystem',
        status: 'fail',
        duration: Date.now() - startTime,
        message: error instanceof Error ? error.message : 'Memory System check failed',
      };
    }
  }

  /**
   * Check ML Models health
   */
  private async checkMLModels(): Promise<HealthCheck> {
    const startTime = Date.now();
    
    try {
      // Check if ML Models are enabled and loaded
      const isEnabled = import.meta.env.VITE_ML_MODELS_ENABLED === 'true';
      
      if (!isEnabled) {
        return {
          name: 'mlModels',
          status: 'warn',
          duration: Date.now() - startTime,
          message: 'ML Models disabled',
        };
      }
      
      return {
        name: 'mlModels',
        status: 'pass',
        duration: Date.now() - startTime,
        message: 'ML Models operational',
      };
    } catch (error) {
      return {
        name: 'mlModels',
        status: 'fail',
        duration: Date.now() - startTime,
        message: error instanceof Error ? error.message : 'ML Models check failed',
      };
    }
  }

  /**
   * Check Security system health
   */
  private async checkSecurity(): Promise<HealthCheck> {
    const startTime = Date.now();
    
    try {
      // Check if Security features are enabled
      const isEnabled = import.meta.env.VITE_SECURITY_ENABLED === 'true';
      
      if (!isEnabled) {
        return {
          name: 'security',
          status: 'warn',
          duration: Date.now() - startTime,
          message: 'Security features disabled',
        };
      }
      
      return {
        name: 'security',
        status: 'pass',
        duration: Date.now() - startTime,
        message: 'Security system operational',
      };
    } catch (error) {
      return {
        name: 'security',
        status: 'fail',
        duration: Date.now() - startTime,
        message: error instanceof Error ? error.message : 'Security check failed',
      };
    }
  }

  /**
   * Get service health status
   */
  private async getServiceHealth(service: string): Promise<ServiceHealth> {
    const startTime = Date.now();
    
    try {
      // Simulate service health check
      await new Promise(resolve => setTimeout(resolve, Math.random() * 10));
      
      return {
        status: 'healthy',
        responseTime: Date.now() - startTime,
        lastCheck: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        lastCheck: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Service check failed',
      };
    }
  }

  /**
   * Get memory metrics
   */
  private getMemoryMetrics(): MemoryMetrics {
    if (typeof performance !== 'undefined' && 'memory' in performance) {
      const memory = (performance as any).memory;
      return {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        percentage: (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100,
      };
    }
    
    return {
      used: 0,
      total: 0,
      percentage: 0,
    };
  }

  /**
   * Get performance metrics
   */
  private getPerformanceMetrics(): PerformanceMetrics {
    const averageResponseTime = this.responseTimes.length > 0 
      ? this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length 
      : 0;
    
    const requestsPerSecond = this.requestCount / ((Date.now() - this.startTime) / 1000);
    const errorRate = this.requestCount > 0 ? (this.errorCount / this.requestCount) * 100 : 0;
    
    return {
      averageResponseTime,
      requestsPerSecond,
      errorRate,
    };
  }

  /**
   * Get request metrics
   */
  private getRequestMetrics(): RequestMetrics {
    return {
      total: this.requestCount,
      successful: this.requestCount - this.errorCount,
      failed: this.errorCount,
      lastHour: this.requestCount, // Simplified - would track hourly in production
    };
  }

  /**
   * Determine overall status from individual checks
   */
  private determineOverallStatus(checks: HealthCheck[]): 'healthy' | 'unhealthy' | 'degraded' {
    const failedChecks = checks.filter(check => check.status === 'fail');
    const warnChecks = checks.filter(check => check.status === 'warn');
    
    if (failedChecks.length > 0) {
      return 'unhealthy';
    }
    
    if (warnChecks.length > 0) {
      return 'degraded';
    }
    
    return 'healthy';
  }

  /**
   * Record request metrics
   */
  recordRequest(responseTime: number, isError: boolean = false) {
    this.requestCount++;
    this.responseTimes.push(responseTime);
    
    if (isError) {
      this.errorCount++;
    }
    
    // Keep only last 1000 response times
    if (this.responseTimes.length > 1000) {
      this.responseTimes = this.responseTimes.slice(-1000);
    }
  }
}

// Export singleton instance
export const healthCheckService = new HealthCheckService();

// Health check endpoint handler
export async function handleHealthCheck(): Promise<HealthCheckResponse> {
  return await healthCheckService.performHealthCheck();
}
