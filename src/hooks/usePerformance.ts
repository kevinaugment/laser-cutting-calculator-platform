import { useEffect, useRef, useState, useCallback } from 'react';
import { metricsService } from '../services/metricsService';

export interface PerformanceMetrics {
  // Core Web Vitals
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  inp?: number; // Interaction to Next Paint
  
  // Navigation Timing
  domContentLoaded?: number;
  loadComplete?: number;
  firstPaint?: number;
  firstContentfulPaint?: number;
  
  // Resource Timing
  resourceLoadTime?: number;
  totalResources?: number;
  
  // Memory Usage
  usedJSHeapSize?: number;
  totalJSHeapSize?: number;
  jsHeapSizeLimit?: number;
  
  // Custom Metrics
  renderTime?: number;
  interactionTime?: number;
}

export interface UsePerformanceOptions {
  enableCoreWebVitals?: boolean;
  enableResourceTiming?: boolean;
  enableMemoryMonitoring?: boolean;
  enableCustomMetrics?: boolean;
  reportInterval?: number; // in milliseconds
}

/**
 * Hook for monitoring and reporting performance metrics
 */
export const usePerformance = (options: UsePerformanceOptions = {}) => {
  const {
    enableCoreWebVitals = true,
    enableResourceTiming = true,
    enableMemoryMonitoring = true,
    enableCustomMetrics = true,
    reportInterval = 30000, // 30 seconds
  } = options;

  const [metrics, setMetrics] = useState<PerformanceMetrics>({});
  const observersRef = useRef<PerformanceObserver[]>([]);
  const reportTimerRef = useRef<NodeJS.Timeout>();
  const renderStartRef = useRef<number>();

  // Core Web Vitals measurement
  const measureCoreWebVitals = useCallback(() => {
    if (!enableCoreWebVitals || typeof PerformanceObserver === 'undefined') return;

    // Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as PerformanceEntry & { renderTime?: number; loadTime?: number };
      
      if (lastEntry) {
        const lcp = lastEntry.renderTime || lastEntry.loadTime || 0;
        setMetrics(prev => ({ ...prev, lcp }));
        
        // Report to metrics service
        metricsService.recordBusinessMetric('core_web_vitals_lcp', lcp / 1000, {
          page: window.location.pathname,
        });
      }
    });

    try {
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      observersRef.current.push(lcpObserver);
    } catch (error) {
      console.warn('LCP observer not supported:', error);
    }

    // First Input Delay (FID)
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        const fid = entry.processingStart - entry.startTime;
        setMetrics(prev => ({ ...prev, fid }));
        
        // Report to metrics service
        metricsService.recordBusinessMetric('core_web_vitals_fid', fid, {
          page: window.location.pathname,
        });
      });
    });

    try {
      fidObserver.observe({ entryTypes: ['first-input'] });
      observersRef.current.push(fidObserver);
    } catch (error) {
      console.warn('FID observer not supported:', error);
    }

    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      
      setMetrics(prev => ({ ...prev, cls: clsValue }));
      
      // Report to metrics service
      metricsService.recordBusinessMetric('core_web_vitals_cls', clsValue, {
        page: window.location.pathname,
      });
    });

    try {
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      observersRef.current.push(clsObserver);
    } catch (error) {
      console.warn('CLS observer not supported:', error);
    }

    // Interaction to Next Paint (INP) - newer metric
    const inpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        const inp = entry.processingEnd - entry.startTime;
        setMetrics(prev => ({ ...prev, inp }));
        
        // Report to metrics service
        metricsService.recordBusinessMetric('core_web_vitals_inp', inp, {
          page: window.location.pathname,
        });
      });
    });

    try {
      inpObserver.observe({ entryTypes: ['event'] });
      observersRef.current.push(inpObserver);
    } catch (error) {
      console.warn('INP observer not supported:', error);
    }
  }, [enableCoreWebVitals]);

  // Navigation timing measurement
  const measureNavigationTiming = useCallback(() => {
    if (typeof performance === 'undefined' || !performance.getEntriesByType) return;

    const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    if (navigationEntries.length > 0) {
      const entry = navigationEntries[0];
      
      const navigationMetrics = {
        domContentLoaded: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
        loadComplete: entry.loadEventEnd - entry.loadEventStart,
        firstPaint: 0,
        firstContentfulPaint: 0,
      };

      // Get paint timing
      const paintEntries = performance.getEntriesByType('paint');
      paintEntries.forEach((entry) => {
        if (entry.name === 'first-paint') {
          navigationMetrics.firstPaint = entry.startTime;
        } else if (entry.name === 'first-contentful-paint') {
          navigationMetrics.firstContentfulPaint = entry.startTime;
        }
      });

      setMetrics(prev => ({ ...prev, ...navigationMetrics }));

      // Report to metrics service
      Object.entries(navigationMetrics).forEach(([key, value]) => {
        if (value > 0) {
          metricsService.recordBusinessMetric(`navigation_${key}`, value / 1000, {
            page: window.location.pathname,
          });
        }
      });
    }
  }, []);

  // Resource timing measurement
  const measureResourceTiming = useCallback(() => {
    if (!enableResourceTiming || typeof performance === 'undefined') return;

    const resourceEntries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    
    if (resourceEntries.length > 0) {
      const totalLoadTime = resourceEntries.reduce((total, entry) => total + entry.duration, 0);
      const averageLoadTime = totalLoadTime / resourceEntries.length;
      
      setMetrics(prev => ({
        ...prev,
        resourceLoadTime: averageLoadTime,
        totalResources: resourceEntries.length,
      }));

      // Report to metrics service
      metricsService.recordBusinessMetric('resource_load_time_avg', averageLoadTime / 1000, {
        page: window.location.pathname,
        resource_count: resourceEntries.length.toString(),
      });

      // Report slow resources
      const slowResources = resourceEntries.filter(entry => entry.duration > 1000);
      if (slowResources.length > 0) {
        metricsService.recordBusinessMetric('slow_resources_count', slowResources.length, {
          page: window.location.pathname,
        });
      }
    }
  }, [enableResourceTiming]);

  // Memory monitoring
  const measureMemoryUsage = useCallback(() => {
    if (!enableMemoryMonitoring || typeof performance === 'undefined' || !('memory' in performance)) return;

    const memory = (performance as any).memory;
    const memoryMetrics = {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
    };

    setMetrics(prev => ({ ...prev, ...memoryMetrics }));

    // Report to metrics service
    const memoryUsagePercent = (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100;
    metricsService.recordBusinessMetric('memory_usage_percent', memoryUsagePercent, {
      page: window.location.pathname,
    });

    // Alert if memory usage is high
    if (memoryUsagePercent > 80) {
      console.warn('High memory usage detected:', memoryUsagePercent.toFixed(2) + '%');
      metricsService.recordBusinessMetric('high_memory_usage_alert', 1, {
        page: window.location.pathname,
        usage_percent: memoryUsagePercent.toString(),
      });
    }
  }, [enableMemoryMonitoring]);

  // Custom render time measurement
  const startRenderMeasurement = useCallback(() => {
    if (!enableCustomMetrics) return;
    renderStartRef.current = performance.now();
  }, [enableCustomMetrics]);

  const endRenderMeasurement = useCallback(() => {
    if (!enableCustomMetrics || !renderStartRef.current) return;
    
    const renderTime = performance.now() - renderStartRef.current;
    setMetrics(prev => ({ ...prev, renderTime }));
    
    // Report to metrics service
    metricsService.recordBusinessMetric('component_render_time', renderTime / 1000, {
      page: window.location.pathname,
    });
    
    renderStartRef.current = undefined;
  }, [enableCustomMetrics]);

  // Measure interaction time
  const measureInteractionTime = useCallback((startTime: number) => {
    if (!enableCustomMetrics) return;
    
    const interactionTime = performance.now() - startTime;
    setMetrics(prev => ({ ...prev, interactionTime }));
    
    // Report to metrics service
    metricsService.recordBusinessMetric('user_interaction_time', interactionTime / 1000, {
      page: window.location.pathname,
    });
  }, [enableCustomMetrics]);

  // Get performance score based on Core Web Vitals
  const getPerformanceScore = useCallback(() => {
    const { lcp, fid, cls } = metrics;
    
    if (!lcp || fid === undefined || cls === undefined) return null;
    
    // Scoring based on Google's thresholds
    const lcpScore = lcp <= 2500 ? 100 : lcp <= 4000 ? 50 : 0;
    const fidScore = fid <= 100 ? 100 : fid <= 300 ? 50 : 0;
    const clsScore = cls <= 0.1 ? 100 : cls <= 0.25 ? 50 : 0;
    
    return Math.round((lcpScore + fidScore + clsScore) / 3);
  }, [metrics]);

  // Report all metrics periodically
  const reportMetrics = useCallback(() => {
    measureNavigationTiming();
    measureResourceTiming();
    measureMemoryUsage();
  }, [measureNavigationTiming, measureResourceTiming, measureMemoryUsage]);

  // Initialize performance monitoring
  useEffect(() => {
    measureCoreWebVitals();
    
    // Initial measurements
    setTimeout(() => {
      reportMetrics();
    }, 1000);

    // Set up periodic reporting
    if (reportInterval > 0) {
      reportTimerRef.current = setInterval(reportMetrics, reportInterval);
    }

    return () => {
      // Clean up observers
      observersRef.current.forEach(observer => observer.disconnect());
      observersRef.current = [];
      
      // Clear timer
      if (reportTimerRef.current) {
        clearInterval(reportTimerRef.current);
      }
    };
  }, [measureCoreWebVitals, reportMetrics, reportInterval]);

  return {
    metrics,
    performanceScore: getPerformanceScore(),
    startRenderMeasurement,
    endRenderMeasurement,
    measureInteractionTime,
    reportMetrics,
  };
};

// Hook for measuring component render performance
export const useRenderPerformance = (componentName: string) => {
  const renderStartRef = useRef<number>();
  
  const startMeasurement = useCallback(() => {
    renderStartRef.current = performance.now();
  }, []);
  
  const endMeasurement = useCallback(() => {
    if (!renderStartRef.current) return;
    
    const renderTime = performance.now() - renderStartRef.current;
    
    // Report to metrics service
    metricsService.recordBusinessMetric('component_render_time', renderTime / 1000, {
      component: componentName,
      page: window.location.pathname,
    });
    
    renderStartRef.current = undefined;
    return renderTime;
  }, [componentName]);
  
  return { startMeasurement, endMeasurement };
};

// Hook for measuring API call performance
export const useAPIPerformance = () => {
  const measureAPICall = useCallback(async <T>(
    apiCall: () => Promise<T>,
    endpoint: string
  ): Promise<T> => {
    const startTime = performance.now();
    
    try {
      const result = await apiCall();
      const duration = performance.now() - startTime;
      
      // Report successful API call
      metricsService.recordBusinessMetric('api_call_duration', duration / 1000, {
        endpoint,
        status: 'success',
        page: window.location.pathname,
      });
      
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      
      // Report failed API call
      metricsService.recordBusinessMetric('api_call_duration', duration / 1000, {
        endpoint,
        status: 'error',
        page: window.location.pathname,
      });
      
      throw error;
    }
  }, []);
  
  return { measureAPICall };
};
