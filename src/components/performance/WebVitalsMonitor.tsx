/**
 * Web Vitals Monitor Component
 * 
 * This component monitors Core Web Vitals in real-time and provides
 * performance insights for optimization.
 */

import React, { useEffect, useState } from 'react';
import { getCLS, getFCP, getFID, getLCP, getTTFB } from 'web-vitals';

interface WebVitalsMetrics {
  cls: number | null;
  fcp: number | null;
  fid: number | null;
  lcp: number | null;
  ttfb: number | null;
}

interface WebVitalsMonitorProps {
  onMetricsUpdate?: (metrics: WebVitalsMetrics) => void;
  showDebugInfo?: boolean;
}

export const WebVitalsMonitor: React.FC<WebVitalsMonitorProps> = ({
  onMetricsUpdate,
  showDebugInfo = false
}) => {
  const [metrics, setMetrics] = useState<WebVitalsMetrics>({
    cls: null,
    fcp: null,
    fid: null,
    lcp: null,
    ttfb: null
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Collect Core Web Vitals
    const collectMetrics = () => {
      // Cumulative Layout Shift
      getCLS((metric) => {
        setMetrics(prev => {
          const updated = { ...prev, cls: metric.value };
          onMetricsUpdate?.(updated);
          return updated;
        });
      });

      // First Contentful Paint
      getFCP((metric) => {
        setMetrics(prev => {
          const updated = { ...prev, fcp: metric.value };
          onMetricsUpdate?.(updated);
          return updated;
        });
      });

      // First Input Delay
      getFID((metric) => {
        setMetrics(prev => {
          const updated = { ...prev, fid: metric.value };
          onMetricsUpdate?.(updated);
          return updated;
        });
      });

      // Largest Contentful Paint
      getLCP((metric) => {
        setMetrics(prev => {
          const updated = { ...prev, lcp: metric.value };
          onMetricsUpdate?.(updated);
          return updated;
        });
      });

      // Time to First Byte
      getTTFB((metric) => {
        setMetrics(prev => {
          const updated = { ...prev, ttfb: metric.value };
          onMetricsUpdate?.(updated);
          return updated;
        });
      });

      setIsLoading(false);
    };

    collectMetrics();
  }, [onMetricsUpdate]);

  // Helper function to get metric status
  const getMetricStatus = (metric: keyof WebVitalsMetrics, value: number | null) => {
    if (value === null) return 'loading';

    switch (metric) {
      case 'cls':
        return value <= 0.1 ? 'good' : value <= 0.25 ? 'needs-improvement' : 'poor';
      case 'fcp':
        return value <= 1800 ? 'good' : value <= 3000 ? 'needs-improvement' : 'poor';
      case 'fid':
        return value <= 100 ? 'good' : value <= 300 ? 'needs-improvement' : 'poor';
      case 'lcp':
        return value <= 2500 ? 'good' : value <= 4000 ? 'needs-improvement' : 'poor';
      case 'ttfb':
        return value <= 800 ? 'good' : value <= 1800 ? 'needs-improvement' : 'poor';
      default:
        return 'loading';
    }
  };

  // Helper function to format metric value
  const formatMetricValue = (metric: keyof WebVitalsMetrics, value: number | null) => {
    if (value === null) return '...';

    switch (metric) {
      case 'cls':
        return value.toFixed(3);
      case 'fcp':
      case 'fid':
      case 'lcp':
      case 'ttfb':
        return `${Math.round(value)}ms`;
      default:
        return value.toString();
    }
  };

  // Helper function to get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'text-green-600 bg-green-50';
      case 'needs-improvement':
        return 'text-yellow-600 bg-yellow-50';
      case 'poor':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  // Helper function to get metric description
  const getMetricDescription = (metric: keyof WebVitalsMetrics) => {
    switch (metric) {
      case 'cls':
        return 'Cumulative Layout Shift - Visual stability';
      case 'fcp':
        return 'First Contentful Paint - Loading performance';
      case 'fid':
        return 'First Input Delay - Interactivity';
      case 'lcp':
        return 'Largest Contentful Paint - Loading performance';
      case 'ttfb':
        return 'Time to First Byte - Server response time';
      default:
        return '';
    }
  };

  if (!showDebugInfo) {
    // Silent monitoring mode - just collect metrics
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm z-50">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900">Web Vitals</h3>
        {isLoading && (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        )}
      </div>

      <div className="space-y-2">
        {Object.entries(metrics).map(([key, value]) => {
          const metric = key as keyof WebVitalsMetrics;
          const status = getMetricStatus(metric, value);
          const formattedValue = formatMetricValue(metric, value);
          const description = getMetricDescription(metric);

          return (
            <div key={key} className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-xs font-medium text-gray-900 uppercase">
                  {key}
                </div>
                <div className="text-xs text-gray-500 truncate" title={description}>
                  {description}
                </div>
              </div>
              <div className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(status)}`}>
                {formattedValue}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
              Good
            </span>
            <span className="flex items-center">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></div>
              Needs Improvement
            </span>
            <span className="flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
              Poor
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Hook for using Web Vitals in components
export const useWebVitals = () => {
  const [metrics, setMetrics] = useState<WebVitalsMetrics>({
    cls: null,
    fcp: null,
    fid: null,
    lcp: null,
    ttfb: null
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const collectMetrics = () => {
      getCLS((metric) => setMetrics(prev => ({ ...prev, cls: metric.value })));
      getFCP((metric) => setMetrics(prev => ({ ...prev, fcp: metric.value })));
      getFID((metric) => setMetrics(prev => ({ ...prev, fid: metric.value })));
      getLCP((metric) => setMetrics(prev => ({ ...prev, lcp: metric.value })));
      getTTFB((metric) => setMetrics(prev => ({ ...prev, ttfb: metric.value })));
      
      setIsLoading(false);
    };

    collectMetrics();
  }, []);

  const getCoreWebVitalsScore = () => {
    const { cls, fid, lcp } = metrics;
    
    if (cls === null || fid === null || lcp === null) {
      return null;
    }

    const clsScore = cls <= 0.1 ? 100 : cls <= 0.25 ? 50 : 0;
    const fidScore = fid <= 100 ? 100 : fid <= 300 ? 50 : 0;
    const lcpScore = lcp <= 2500 ? 100 : lcp <= 4000 ? 50 : 0;

    return Math.round((clsScore + fidScore + lcpScore) / 3);
  };

  return {
    metrics,
    isLoading,
    coreWebVitalsScore: getCoreWebVitalsScore()
  };
};

export default WebVitalsMonitor;
