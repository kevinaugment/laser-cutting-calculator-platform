import { useCallback, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  metricsService, 
  recordCalculatorUsage, 
  recordUserAction, 
  recordError, 
  recordFeatureUsage,
  type CalculatorMetrics,
  type UserMetrics 
} from '../services/metricsService';

export interface UseMetricsOptions {
  userId?: string;
  sessionId?: string;
  enableAutoTracking?: boolean;
}

export interface MetricsHookReturn {
  recordCalculator: (metrics: Omit<CalculatorMetrics, 'userId'>) => void;
  recordAction: (action: string, additionalData?: Record<string, string>) => void;
  recordError: (error: Error, context?: Record<string, string>) => void;
  recordFeature: (feature: string) => void;
  recordPageView: () => void;
  recordTiming: (name: string, duration: number, labels?: Record<string, string>) => void;
  startTimer: (name: string) => () => void;
}

/**
 * Hook for collecting application metrics
 */
export const useMetrics = (options: UseMetricsOptions = {}): MetricsHookReturn => {
  const location = useLocation();
  const timersRef = useRef<Map<string, number>>(new Map());
  const pageLoadTimeRef = useRef<number>(Date.now());
  
  const {
    userId,
    sessionId = generateSessionId(),
    enableAutoTracking = true,
  } = options;

  // Record page view when location changes
  useEffect(() => {
    if (enableAutoTracking) {
      recordPageView();
    }
  }, [location.pathname, enableAutoTracking]);

  // Record page load time on mount
  useEffect(() => {
    if (enableAutoTracking) {
      const loadTime = Date.now() - pageLoadTimeRef.current;
      metricsService.recordPageLoad(location.pathname, loadTime);
    }
  }, [location.pathname, enableAutoTracking]);

  // Record calculator usage
  const recordCalculator = useCallback((metrics: Omit<CalculatorMetrics, 'userId'>) => {
    recordCalculatorUsage({
      ...metrics,
      userId,
    });
  }, [userId]);

  // Record user action
  const recordAction = useCallback((action: string, additionalData?: Record<string, string>) => {
    const userMetrics: UserMetrics = {
      userId: userId || 'anonymous',
      sessionId,
      action,
      page: location.pathname,
      timestamp: Date.now(),
    };

    recordUserAction(userMetrics);

    // Record additional custom metrics if provided
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        metricsService.recordBusinessMetric(`user_action_${key}`, 1, {
          action,
          page: location.pathname,
          value,
        });
      });
    }
  }, [userId, sessionId, location.pathname]);

  // Record error with context
  const recordErrorMetric = useCallback((error: Error, context?: Record<string, string>) => {
    recordError(error, {
      page: location.pathname,
      user_id: userId || 'anonymous',
      session_id: sessionId,
      ...context,
    });
  }, [userId, sessionId, location.pathname]);

  // Record feature usage
  const recordFeature = useCallback((feature: string) => {
    recordFeatureUsage(feature, userId);
    
    // Also record as user action
    recordAction('feature_used', { feature });
  }, [userId, recordAction]);

  // Record page view
  const recordPageView = useCallback(() => {
    recordAction('page_view');
    
    // Record page-specific metrics
    metricsService.recordBusinessMetric('page_views_total', 1, {
      page: location.pathname,
      user_id: userId || 'anonymous',
    });
  }, [recordAction, location.pathname, userId]);

  // Record custom timing
  const recordTiming = useCallback((name: string, duration: number, labels?: Record<string, string>) => {
    metricsService.recordBusinessMetric(`timing_${name}_seconds`, duration / 1000, {
      page: location.pathname,
      user_id: userId || 'anonymous',
      ...labels,
    });
  }, [location.pathname, userId]);

  // Start a timer and return a function to stop it
  const startTimer = useCallback((name: string) => {
    const startTime = Date.now();
    const timerId = `${name}_${startTime}`;
    timersRef.current.set(timerId, startTime);

    return () => {
      const endTime = Date.now();
      const duration = endTime - startTime;
      timersRef.current.delete(timerId);
      
      recordTiming(name, duration);
      return duration;
    };
  }, [recordTiming]);

  return {
    recordCalculator,
    recordAction,
    recordError: recordErrorMetric,
    recordFeature,
    recordPageView,
    recordTiming,
    startTimer,
  };
};

/**
 * Hook for tracking calculator performance
 */
export const useCalculatorMetrics = (calculatorType: string, options: UseMetricsOptions = {}) => {
  const metrics = useMetrics(options);
  
  const trackCalculation = useCallback(async <T>(
    calculationFn: () => Promise<T> | T,
    additionalLabels?: Record<string, string>
  ): Promise<T> => {
    const stopTimer = metrics.startTimer(`calculator_${calculatorType}`);
    
    try {
      const result = await calculationFn();
      
      const duration = stopTimer();
      metrics.recordCalculator({
        calculatorType,
        executionTime: duration,
        success: true,
      });
      
      // Record additional business metrics
      if (additionalLabels) {
        Object.entries(additionalLabels).forEach(([key, value]) => {
          metricsService.recordBusinessMetric(`calculator_${key}`, 1, {
            calculator_type: calculatorType,
            value,
          });
        });
      }
      
      return result;
    } catch (error) {
      const duration = stopTimer();
      metrics.recordCalculator({
        calculatorType,
        executionTime: duration,
        success: false,
        errorType: error instanceof Error ? error.name : 'UnknownError',
      });
      
      metrics.recordError(
        error instanceof Error ? error : new Error('Unknown calculation error'),
        { calculator_type: calculatorType }
      );
      
      throw error;
    }
  }, [calculatorType, metrics]);

  return {
    ...metrics,
    trackCalculation,
  };
};

/**
 * Hook for tracking form interactions
 */
export const useFormMetrics = (formName: string, options: UseMetricsOptions = {}) => {
  const metrics = useMetrics(options);
  
  const trackFormStart = useCallback(() => {
    metrics.recordAction('form_start', { form_name: formName });
  }, [metrics, formName]);
  
  const trackFormSubmit = useCallback((success: boolean, errorType?: string) => {
    metrics.recordAction('form_submit', { 
      form_name: formName, 
      success: success.toString(),
      ...(errorType && { error_type: errorType }),
    });
  }, [metrics, formName]);
  
  const trackFieldInteraction = useCallback((fieldName: string, action: 'focus' | 'blur' | 'change') => {
    metrics.recordAction('form_field_interaction', {
      form_name: formName,
      field_name: fieldName,
      interaction_type: action,
    });
  }, [metrics, formName]);
  
  return {
    ...metrics,
    trackFormStart,
    trackFormSubmit,
    trackFieldInteraction,
  };
};

/**
 * Hook for tracking user engagement
 */
export const useEngagementMetrics = (options: UseMetricsOptions = {}) => {
  const metrics = useMetrics(options);
  const engagementStartRef = useRef<number>(Date.now());
  
  useEffect(() => {
    engagementStartRef.current = Date.now();
    
    return () => {
      const engagementTime = Date.now() - engagementStartRef.current;
      metrics.recordTiming('page_engagement', engagementTime);
    };
  }, [metrics]);
  
  const trackScroll = useCallback((scrollPercentage: number) => {
    metrics.recordAction('scroll', { 
      scroll_percentage: scrollPercentage.toString(),
    });
  }, [metrics]);
  
  const trackClick = useCallback((elementType: string, elementId?: string) => {
    metrics.recordAction('click', {
      element_type: elementType,
      ...(elementId && { element_id: elementId }),
    });
  }, [metrics]);
  
  const trackHover = useCallback((elementType: string, duration: number) => {
    metrics.recordAction('hover', {
      element_type: elementType,
      duration: duration.toString(),
    });
  }, [metrics]);
  
  return {
    ...metrics,
    trackScroll,
    trackClick,
    trackHover,
  };
};

// Utility function to generate session ID
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
