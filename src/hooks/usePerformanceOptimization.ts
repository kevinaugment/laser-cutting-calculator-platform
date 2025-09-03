/**
 * Performance Optimization Hook
 * React hook for performance monitoring and optimization
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { 
  performanceMonitoringService,
  PerformanceReport,
  PerformanceAlert,
  PerformanceThresholds
} from '../services/performanceMonitoringService';
import { cacheService } from '../services/cacheService';

// ============================================================================
// Hook State Types
// ============================================================================

export interface PerformanceOptimizationState {
  report: PerformanceReport | null;
  realTimeMetrics: {
    responseTime: number;
    throughput: number;
    errorRate: number;
    cacheHitRate: number;
    activeAlerts: number;
  };
  alerts: PerformanceAlert[];
  cacheStats: any;
  loading: boolean;
  error: string | null;
  isMonitoring: boolean;
}

export interface PerformanceOptimizationActions {
  generateReport: (timeframe?: string) => Promise<PerformanceReport>;
  refreshMetrics: () => void;
  clearCache: () => Promise<void>;
  resolveAlert: (alertId: string) => boolean;
  startMonitoring: () => void;
  stopMonitoring: () => void;
  recordTiming: (operation: string, duration: number, success?: boolean) => void;
  timeOperation: <T>(operation: string, fn: () => Promise<T>) => Promise<T>;
  clearError: () => void;
}

// ============================================================================
// Hook Configuration
// ============================================================================

export interface UsePerformanceOptimizationConfig {
  autoRefresh?: boolean;
  refreshInterval?: number;
  enableRealTimeMetrics?: boolean;
  thresholds?: Partial<PerformanceThresholds>;
}

const DEFAULT_CONFIG: Required<UsePerformanceOptimizationConfig> = {
  autoRefresh: true,
  refreshInterval: 30000, // 30 seconds
  enableRealTimeMetrics: true,
  thresholds: {},
};

// ============================================================================
// Main Hook
// ============================================================================

export function usePerformanceOptimization(
  config: UsePerformanceOptimizationConfig = {}
): [PerformanceOptimizationState, PerformanceOptimizationActions] {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  
  // State
  const [state, setState] = useState<PerformanceOptimizationState>({
    report: null,
    realTimeMetrics: {
      responseTime: 0,
      throughput: 0,
      errorRate: 0,
      cacheHitRate: 0,
      activeAlerts: 0,
    },
    alerts: [],
    cacheStats: null,
    loading: false,
    error: null,
    isMonitoring: false,
  });

  // Refs for intervals
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const metricsIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize monitoring
  useEffect(() => {
    if (finalConfig.autoRefresh) {
      startMonitoring();
    }

    return () => {
      stopMonitoring();
    };
  }, [finalConfig.autoRefresh]);

  // Generate performance report
  const generateReport = useCallback(async (timeframe: string = '1h'): Promise<PerformanceReport> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const report = performanceMonitoringService.generateReport(timeframe);
      const cacheStats = cacheService.getStats();
      
      setState(prev => ({
        ...prev,
        report,
        cacheStats,
        alerts: report.alerts,
        loading: false,
      }));

      return report;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate performance report';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, []);

  // Refresh real-time metrics
  const refreshMetrics = useCallback(() => {
    if (!finalConfig.enableRealTimeMetrics) return;

    try {
      const realTimeMetrics = performanceMonitoringService.getRealTimeMetrics();
      
      setState(prev => ({
        ...prev,
        realTimeMetrics,
      }));
    } catch (error) {
      console.warn('Failed to refresh real-time metrics:', error);
    }
  }, [finalConfig.enableRealTimeMetrics]);

  // Clear cache
  const clearCache = useCallback(async (): Promise<void> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      await cacheService.clear();
      const cacheStats = cacheService.getStats();
      
      setState(prev => ({
        ...prev,
        cacheStats,
        loading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to clear cache';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, []);

  // Resolve alert
  const resolveAlert = useCallback((alertId: string): boolean => {
    const resolved = performanceMonitoringService.resolveAlert(alertId);
    
    if (resolved) {
      setState(prev => ({
        ...prev,
        alerts: prev.alerts.map(alert => 
          alert.id === alertId ? { ...alert, resolved: true } : alert
        ),
      }));
    }
    
    return resolved;
  }, []);

  // Start monitoring
  const startMonitoring = useCallback(() => {
    if (state.isMonitoring) return;

    // Start periodic report generation
    if (finalConfig.autoRefresh && finalConfig.refreshInterval > 0) {
      refreshIntervalRef.current = setInterval(() => {
        generateReport('5m').catch(console.error);
      }, finalConfig.refreshInterval);
    }

    // Start real-time metrics refresh
    if (finalConfig.enableRealTimeMetrics) {
      metricsIntervalRef.current = setInterval(() => {
        refreshMetrics();
      }, 5000); // Every 5 seconds
    }

    setState(prev => ({ ...prev, isMonitoring: true }));
    
    // Initial data load
    generateReport('1h').catch(console.error);
    refreshMetrics();
  }, [finalConfig, generateReport, refreshMetrics, state.isMonitoring]);

  // Stop monitoring
  const stopMonitoring = useCallback(() => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }

    if (metricsIntervalRef.current) {
      clearInterval(metricsIntervalRef.current);
      metricsIntervalRef.current = null;
    }

    setState(prev => ({ ...prev, isMonitoring: false }));
  }, []);

  // Record timing
  const recordTiming = useCallback((
    operation: string,
    duration: number,
    success: boolean = true
  ) => {
    performanceMonitoringService.recordTiming(operation, duration, success);
    
    // Update real-time metrics if enabled
    if (finalConfig.enableRealTimeMetrics) {
      refreshMetrics();
    }
  }, [finalConfig.enableRealTimeMetrics, refreshMetrics]);

  // Time operation
  const timeOperation = useCallback(async <T>(
    operation: string,
    fn: () => Promise<T>
  ): Promise<T> => {
    const result = await performanceMonitoringService.timeOperation(operation, fn);
    
    // Update real-time metrics if enabled
    if (finalConfig.enableRealTimeMetrics) {
      refreshMetrics();
    }
    
    return result;
  }, [finalConfig.enableRealTimeMetrics, refreshMetrics]);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Actions object
  const actions: PerformanceOptimizationActions = {
    generateReport,
    refreshMetrics,
    clearCache,
    resolveAlert,
    startMonitoring,
    stopMonitoring,
    recordTiming,
    timeOperation,
    clearError,
  };

  return [state, actions];
}

// ============================================================================
// Specialized Hooks
// ============================================================================

/**
 * Hook for performance monitoring dashboard
 */
export function usePerformanceDashboard(refreshInterval: number = 30000) {
  const [state, actions] = usePerformanceOptimization({
    autoRefresh: true,
    refreshInterval,
    enableRealTimeMetrics: true,
  });

  return {
    report: state.report,
    realTimeMetrics: state.realTimeMetrics,
    alerts: state.alerts,
    cacheStats: state.cacheStats,
    loading: state.loading,
    error: state.error,
    generateReport: actions.generateReport,
    refreshMetrics: actions.refreshMetrics,
    clearCache: actions.clearCache,
    resolveAlert: actions.resolveAlert,
    clearError: actions.clearError,
  };
}

/**
 * Hook for operation timing
 */
export function useOperationTiming() {
  const [, actions] = usePerformanceOptimization({
    autoRefresh: false,
    enableRealTimeMetrics: false,
  });

  return {
    recordTiming: actions.recordTiming,
    timeOperation: actions.timeOperation,
  };
}

/**
 * Hook for cache management
 */
export function useCacheManagement() {
  const [state, actions] = usePerformanceOptimization({
    autoRefresh: false,
    enableRealTimeMetrics: false,
  });

  const [cacheStats, setCacheStats] = useState(null);

  const refreshCacheStats = useCallback(async () => {
    const stats = cacheService.getStats();
    setCacheStats(stats);
  }, []);

  useEffect(() => {
    refreshCacheStats();
  }, [refreshCacheStats]);

  return {
    cacheStats: cacheStats || state.cacheStats,
    loading: state.loading,
    error: state.error,
    clearCache: actions.clearCache,
    refreshStats: refreshCacheStats,
    clearError: actions.clearError,
  };
}

/**
 * Hook for performance alerts
 */
export function usePerformanceAlerts() {
  const [state, actions] = usePerformanceOptimization({
    autoRefresh: true,
    refreshInterval: 60000, // 1 minute
    enableRealTimeMetrics: false,
  });

  const activeAlerts = state.alerts.filter(alert => !alert.resolved);
  const resolvedAlerts = state.alerts.filter(alert => alert.resolved);

  return {
    activeAlerts,
    resolvedAlerts,
    totalAlerts: state.alerts.length,
    loading: state.loading,
    error: state.error,
    resolveAlert: actions.resolveAlert,
    clearError: actions.clearError,
  };
}

/**
 * Performance timing decorator hook
 */
export function usePerformanceTimer(operationName: string) {
  const { timeOperation } = useOperationTiming();

  return useCallback(
    async <T>(fn: () => Promise<T>): Promise<T> => {
      return timeOperation(operationName, fn);
    },
    [operationName, timeOperation]
  );
}
