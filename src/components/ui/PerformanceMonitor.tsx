import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { Button } from './button';
import { Progress } from './progress';
import { Icon, StatusIcon } from './IconRegistry';
import { globalCalculationCache } from '../../utils/calculationCache';
import { globalWorkerManager } from '../../utils/workerManager';

interface PerformanceMetrics {
  // Core Web Vitals
  fcp: number | null; // First Contentful Paint
  lcp: number | null; // Largest Contentful Paint
  fid: number | null; // First Input Delay
  cls: number | null; // Cumulative Layout Shift
  
  // 自定义指标
  pageLoadTime: number;
  jsHeapSize: number;
  jsHeapSizeLimit: number;
  memoryUsage: number;
  
  // 计算性能
  averageCalculationTime: number;
  cacheHitRate: number;
  workerUtilization: number;
}

interface PerformanceMonitorProps {
  isVisible?: boolean;
  position?: 'top-right' | 'bottom-right' | 'bottom-left' | 'top-left';
  compact?: boolean;
}

const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  isVisible = false,
  position = 'bottom-right',
  compact = false
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    pageLoadTime: 0,
    jsHeapSize: 0,
    jsHeapSizeLimit: 0,
    memoryUsage: 0,
    averageCalculationTime: 0,
    cacheHitRate: 0,
    workerUtilization: 0
  });

  const [isExpanded, setIsExpanded] = useState(!compact);
  const [performanceScore, setPerformanceScore] = useState(0);

  // 收集性能指标
  const collectMetrics = useCallback(() => {
    // Core Web Vitals
    if ('performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');
      
      const fcp = paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || null;
      const pageLoadTime = navigation ? navigation.loadEventEnd - navigation.navigationStart : 0;

      // 内存使用情况
      const memory = (performance as any).memory;
      const jsHeapSize = memory ? memory.usedJSHeapSize : 0;
      const jsHeapSizeLimit = memory ? memory.totalJSHeapSize : 0;
      const memoryUsage = jsHeapSizeLimit > 0 ? (jsHeapSize / jsHeapSizeLimit) * 100 : 0;

      // 缓存统计
      const cacheStats = globalCalculationCache.getStats();
      const cacheHitRate = cacheStats.hitRate;

      // Worker统计
      const workerStats = globalWorkerManager.getStats();
      const averageCalculationTime = workerStats.averageComputeTime;
      const workerUtilization = workerStats.pendingTasks > 0 ? 100 : 0;

      setMetrics({
        fcp,
        lcp: null, // 需要通过Intersection Observer API获取
        fid: null, // 需要通过事件监听器获取
        cls: null, // 需要通过Layout Shift API获取
        pageLoadTime,
        jsHeapSize,
        jsHeapSizeLimit,
        memoryUsage,
        averageCalculationTime,
        cacheHitRate,
        workerUtilization
      });
    }
  }, []);

  // 计算性能评分
  const calculatePerformanceScore = useCallback((metrics: PerformanceMetrics) => {
    let score = 100;
    
    // FCP评分 (目标: < 1.8s)
    if (metrics.fcp) {
      if (metrics.fcp > 3000) score -= 20;
      else if (metrics.fcp > 1800) score -= 10;
    }
    
    // 页面加载时间评分 (目标: < 2s)
    if (metrics.pageLoadTime > 3000) score -= 15;
    else if (metrics.pageLoadTime > 2000) score -= 8;
    
    // 内存使用评分 (目标: < 70%)
    if (metrics.memoryUsage > 90) score -= 20;
    else if (metrics.memoryUsage > 70) score -= 10;
    
    // 缓存命中率评分 (目标: > 60%)
    if (metrics.cacheHitRate < 30) score -= 15;
    else if (metrics.cacheHitRate < 60) score -= 8;
    
    // 计算时间评分 (目标: < 500ms)
    if (metrics.averageCalculationTime > 1000) score -= 10;
    else if (metrics.averageCalculationTime > 500) score -= 5;
    
    return Math.max(0, Math.min(100, score));
  }, []);

  // 定期更新指标
  useEffect(() => {
    if (!isVisible) return;

    collectMetrics();
    const interval = setInterval(collectMetrics, 2000);
    
    return () => clearInterval(interval);
  }, [isVisible, collectMetrics]);

  // 更新性能评分
  useEffect(() => {
    const score = calculatePerformanceScore(metrics);
    setPerformanceScore(score);
  }, [metrics, calculatePerformanceScore]);

  // 获取性能等级
  const getPerformanceGrade = (score: number) => {
    if (score >= 90) return { grade: 'A', color: 'success', label: 'Excellent' };
    if (score >= 80) return { grade: 'B', color: 'info', label: 'Good' };
    if (score >= 70) return { grade: 'C', color: 'warning', label: 'Fair' };
    return { grade: 'D', color: 'danger', label: 'Poor' };
  };

  // 格式化数值
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${Math.round(ms)}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  if (!isVisible) return null;

  const performanceGrade = getPerformanceGrade(performanceScore);
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-left': 'top-4 left-4'
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50 max-w-sm`}>
      <Card className="bg-white/95 backdrop-blur-sm border shadow-lg">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center">
              <Icon name="activity" size="sm" className="mr-2" />
              Performance Monitor
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge 
                variant={performanceGrade.color as any}
                className="text-xs"
              >
                {performanceGrade.grade} - {performanceScore}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-6 w-6 p-0"
              >
                <Icon 
                  name={isExpanded ? "chevronUp" : "chevronDown"} 
                  size="xs" 
                />
              </Button>
            </div>
          </div>
        </CardHeader>

        {isExpanded && (
          <CardContent className="pt-0 space-y-3">
            {/* 性能评分 */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Performance Score</span>
                <span className="font-medium">{performanceScore}/100</span>
              </div>
              <Progress value={performanceScore} className="h-2" />
              <p className="text-xs text-gray-500">{performanceGrade.label}</p>
            </div>

            {/* Core Web Vitals */}
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-gray-700">Core Web Vitals</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex justify-between">
                  <span>FCP:</span>
                  <span className="font-mono">
                    {metrics.fcp ? formatTime(metrics.fcp) : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Load:</span>
                  <span className="font-mono">
                    {formatTime(metrics.pageLoadTime)}
                  </span>
                </div>
              </div>
            </div>

            {/* 内存使用 */}
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-gray-700">Memory Usage</h4>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>JS Heap:</span>
                  <span className="font-mono">
                    {formatBytes(metrics.jsHeapSize)}
                  </span>
                </div>
                <Progress value={metrics.memoryUsage} className="h-1" />
                <p className="text-xs text-gray-500">
                  {metrics.memoryUsage.toFixed(1)}% used
                </p>
              </div>
            </div>

            {/* 计算性能 */}
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-gray-700">Calculation Performance</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex justify-between">
                  <span>Avg Time:</span>
                  <span className="font-mono">
                    {formatTime(metrics.averageCalculationTime)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Cache Hit:</span>
                  <span className="font-mono">
                    {metrics.cacheHitRate.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Worker状态 */}
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-gray-700">Worker Status</h4>
              <div className="flex items-center justify-between text-xs">
                <span>Utilization:</span>
                <div className="flex items-center space-x-1">
                  <StatusIcon 
                    status={metrics.workerUtilization > 0 ? "loading" : "success"}
                    size="xs"
                  />
                  <span className="font-mono">
                    {metrics.workerUtilization.toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex space-x-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  globalCalculationCache.clear();
                  collectMetrics();
                }}
                className="flex-1 text-xs"
              >
                <Icon name="refresh" size="xs" className="mr-1" />
                Clear Cache
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={collectMetrics}
                className="flex-1 text-xs"
              >
                <Icon name="activity" size="xs" className="mr-1" />
                Refresh
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default PerformanceMonitor;
