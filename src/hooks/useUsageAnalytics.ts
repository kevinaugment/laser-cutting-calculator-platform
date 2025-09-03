/**
 * Usage Analytics Hook
 * React hook for usage analytics and dashboard functionality
 */

import { useState, useCallback, useEffect } from 'react';
import { 
  usageAnalyticsService,
  UsageEvent,
  UsageStatistics,
  TeamAnalytics,
  AnalyticsQuery,
  AnalyticsReport,
  AnalyticsTimeframe,
  MetricType
} from '../services/usageAnalyticsService';

// ============================================================================
// Hook State Types
// ============================================================================

export interface UsageAnalyticsState {
  statistics: UsageStatistics | null;
  teamAnalytics: TeamAnalytics | null;
  reports: AnalyticsReport[];
  recentEvents: UsageEvent[];
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

export interface UsageAnalyticsActions {
  trackUsage: (event: Omit<UsageEvent, 'id' | 'timestamp'>) => Promise<UsageEvent>;
  trackPerformance: (calculatorType: string, responseTime: number, success: boolean, userId?: string) => Promise<void>;
  trackUserActivity: (userId: string, activity: string, metadata?: Record<string, any>) => Promise<void>;
  getUsageStatistics: (query?: Partial<AnalyticsQuery>) => Promise<UsageStatistics>;
  getTeamAnalytics: (teamId: string) => Promise<TeamAnalytics>;
  generateReport: (title: string, description: string, query: AnalyticsQuery, userId: string) => Promise<AnalyticsReport>;
  refreshData: () => Promise<void>;
  clearError: () => void;
}

// ============================================================================
// Hook Configuration
// ============================================================================

export interface UseUsageAnalyticsConfig {
  userId?: string;
  teamId?: string;
  autoLoadStatistics?: boolean;
  autoLoadTeamAnalytics?: boolean;
  refreshInterval?: number;
  defaultTimeframe?: AnalyticsTimeframe;
}

const DEFAULT_CONFIG: Required<UseUsageAnalyticsConfig> = {
  userId: 'anonymous-user',
  teamId: '',
  autoLoadStatistics: true,
  autoLoadTeamAnalytics: false,
  refreshInterval: 0,
  defaultTimeframe: 'week',
};

// ============================================================================
// Main Hook
// ============================================================================

export function useUsageAnalytics(
  config: UseUsageAnalyticsConfig = {}
): [UsageAnalyticsState, UsageAnalyticsActions] {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  
  // State
  const [state, setState] = useState<UsageAnalyticsState>({
    statistics: null,
    teamAnalytics: null,
    reports: [],
    recentEvents: [],
    loading: false,
    error: null,
    initialized: false,
  });

  // Initialize data
  useEffect(() => {
    if (!state.initialized) {
      initializeData();
    }
  }, [state.initialized]);

  // Auto-refresh data
  useEffect(() => {
    if (finalConfig.refreshInterval > 0) {
      const interval = setInterval(() => {
        if (!state.loading) {
          refreshData();
        }
      }, finalConfig.refreshInterval);

      return () => clearInterval(interval);
    }
  }, [finalConfig.refreshInterval, state.loading]);

  // Initialize data
  const initializeData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const promises: Promise<any>[] = [];

      if (finalConfig.autoLoadStatistics) {
        promises.push(usageAnalyticsService.getUsageStatistics({
          timeframe: finalConfig.defaultTimeframe,
          userId: finalConfig.userId,
        }));
      }

      if (finalConfig.autoLoadTeamAnalytics && finalConfig.teamId) {
        promises.push(usageAnalyticsService.getTeamAnalytics(finalConfig.teamId));
      }

      const results = await Promise.all(promises);
      
      setState(prev => ({
        ...prev,
        statistics: finalConfig.autoLoadStatistics ? results[0] : null,
        teamAnalytics: finalConfig.autoLoadTeamAnalytics && finalConfig.teamId ? 
          results[finalConfig.autoLoadStatistics ? 1 : 0] : null,
        loading: false,
        initialized: true,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to initialize analytics data';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
        initialized: true,
      }));
    }
  }, [finalConfig]);

  // Track usage
  const trackUsage = useCallback(async (
    event: Omit<UsageEvent, 'id' | 'timestamp'>
  ): Promise<UsageEvent> => {
    try {
      const usageEvent = await usageAnalyticsService.trackUsage(event);
      
      setState(prev => ({
        ...prev,
        recentEvents: [usageEvent, ...prev.recentEvents.slice(0, 99)], // Keep last 100 events
      }));

      return usageEvent;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to track usage';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    }
  }, []);

  // Track performance
  const trackPerformance = useCallback(async (
    calculatorType: string,
    responseTime: number,
    success: boolean,
    userId?: string
  ): Promise<void> => {
    try {
      await usageAnalyticsService.trackPerformance(
        calculatorType,
        responseTime,
        success,
        userId || finalConfig.userId
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to track performance';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    }
  }, [finalConfig.userId]);

  // Track user activity
  const trackUserActivity = useCallback(async (
    userId: string,
    activity: string,
    metadata: Record<string, any> = {}
  ): Promise<void> => {
    try {
      await usageAnalyticsService.trackUserActivity(userId, activity, metadata);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to track user activity';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    }
  }, []);

  // Get usage statistics
  const getUsageStatistics = useCallback(async (
    query: Partial<AnalyticsQuery> = {}
  ): Promise<UsageStatistics> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const statistics = await usageAnalyticsService.getUsageStatistics({
        timeframe: finalConfig.defaultTimeframe,
        userId: finalConfig.userId,
        ...query,
      });
      
      setState(prev => ({
        ...prev,
        statistics,
        loading: false,
      }));

      return statistics;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get usage statistics';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, [finalConfig.defaultTimeframe, finalConfig.userId]);

  // Get team analytics
  const getTeamAnalytics = useCallback(async (teamId: string): Promise<TeamAnalytics> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const teamAnalytics = await usageAnalyticsService.getTeamAnalytics(teamId);
      
      setState(prev => ({
        ...prev,
        teamAnalytics,
        loading: false,
      }));

      return teamAnalytics;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get team analytics';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, []);

  // Generate report
  const generateReport = useCallback(async (
    title: string,
    description: string,
    query: AnalyticsQuery,
    userId: string
  ): Promise<AnalyticsReport> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const report = await usageAnalyticsService.generateReport(title, description, query, userId);
      
      setState(prev => ({
        ...prev,
        reports: [report, ...prev.reports],
        loading: false,
      }));

      return report;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate report';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, []);

  // Refresh data
  const refreshData = useCallback(async (): Promise<void> => {
    await initializeData();
  }, [initializeData]);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Actions object
  const actions: UsageAnalyticsActions = {
    trackUsage,
    trackPerformance,
    trackUserActivity,
    getUsageStatistics,
    getTeamAnalytics,
    generateReport,
    refreshData,
    clearError,
  };

  return [state, actions];
}

// ============================================================================
// Specialized Hooks
// ============================================================================

/**
 * Hook for usage tracking
 */
export function useUsageTracking(userId?: string) {
  const [state, actions] = useUsageAnalytics({ 
    userId, 
    autoLoadStatistics: false, 
    autoLoadTeamAnalytics: false 
  });

  return {
    trackUsage: actions.trackUsage,
    trackPerformance: actions.trackPerformance,
    trackUserActivity: actions.trackUserActivity,
    recentEvents: state.recentEvents,
    error: state.error,
    clearError: actions.clearError,
  };
}

/**
 * Hook for dashboard statistics
 */
export function useDashboardStatistics(
  timeframe: AnalyticsTimeframe = 'week',
  userId?: string
) {
  const [state, actions] = useUsageAnalytics({ 
    userId, 
    autoLoadStatistics: true, 
    defaultTimeframe: timeframe,
    refreshInterval: 60000, // Refresh every minute
  });

  const refreshStatistics = useCallback((newTimeframe?: AnalyticsTimeframe) => {
    return actions.getUsageStatistics({
      timeframe: newTimeframe || timeframe,
    });
  }, [actions, timeframe]);

  return {
    statistics: state.statistics,
    loading: state.loading,
    error: state.error,
    refresh: refreshStatistics,
    clearError: actions.clearError,
  };
}

/**
 * Hook for team analytics dashboard
 */
export function useTeamAnalyticsDashboard(teamId: string, userId?: string) {
  const [state, actions] = useUsageAnalytics({ 
    userId, 
    teamId,
    autoLoadTeamAnalytics: true,
    refreshInterval: 300000, // Refresh every 5 minutes
  });

  return {
    teamAnalytics: state.teamAnalytics,
    loading: state.loading,
    error: state.error,
    refresh: () => actions.getTeamAnalytics(teamId),
    clearError: actions.clearError,
  };
}

/**
 * Hook for analytics reports
 */
export function useAnalyticsReports(userId?: string) {
  const [state, actions] = useUsageAnalytics({ 
    userId, 
    autoLoadStatistics: false, 
    autoLoadTeamAnalytics: false 
  });

  return {
    reports: state.reports,
    loading: state.loading,
    error: state.error,
    generateReport: actions.generateReport,
    clearError: actions.clearError,
  };
}

/**
 * Hook for performance monitoring
 */
export function usePerformanceMonitoring(calculatorType?: string) {
  const [performanceData, setPerformanceData] = useState<{
    averageResponseTime: number;
    successRate: number;
    errorCount: number;
    lastUpdated: Date;
  } | null>(null);

  const [, actions] = useUsageAnalytics({ autoLoadStatistics: false });

  const trackCalculatorPerformance = useCallback(async (
    type: string,
    responseTime: number,
    success: boolean,
    userId?: string
  ) => {
    await actions.trackPerformance(type, responseTime, success, userId);
    
    // Update local performance data
    setPerformanceData(prev => {
      if (!prev) {
        return {
          averageResponseTime: responseTime,
          successRate: success ? 1 : 0,
          errorCount: success ? 0 : 1,
          lastUpdated: new Date(),
        };
      }

      const newErrorCount = prev.errorCount + (success ? 0 : 1);
      const totalRequests = prev.errorCount + (success ? 1 : 0) + newErrorCount;
      
      return {
        averageResponseTime: (prev.averageResponseTime + responseTime) / 2,
        successRate: totalRequests > 0 ? (totalRequests - newErrorCount) / totalRequests : 1,
        errorCount: newErrorCount,
        lastUpdated: new Date(),
      };
    });
  }, [actions]);

  return {
    performanceData,
    trackPerformance: trackCalculatorPerformance,
  };
}
