// Lazy Route Configuration for Performance Optimization
// Implements code splitting and lazy loading for all calculator routes

import { lazy, Suspense } from 'react';
import { LoadingFallback } from '@/utils/performanceOptimizer';

// Loading component for route transitions
const RouteLoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        Loading Calculator
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Please wait while we prepare your tools...
      </p>
    </div>
  </div>
);

// Lazy load core calculators (high priority)
export const LazyCalculatorRoutes = {
  // Core Engineering Calculators
  LaserParameterOptimizer: lazy(() => 
    import('../features/calculators/laser-parameter-optimizer').then(module => ({
      default: module.default
    }))
  ),
  
  CuttingTimeEstimator: lazy(() => 
    import('../components/calculators/CuttingTimeEstimator').then(module => ({
      default: module.default
    }))
  ),
  
  LaserCuttingCostCalculator: lazy(() => 
    import('../components/calculators/LaserCuttingCostCalculator').then(module => ({
      default: module.default
    }))
  ),
  
  MaterialSelectionAssistant: lazy(() =>
    import('../features/calculators/material-selection-assistant').then(module => ({
      default: module.default
    }))
  ),

  // Quality Control Calculators (medium priority)
  EdgeQualityPredictor: lazy(() => 
    import('../components/calculators/EdgeQualityPredictor').then(module => ({
      default: module.default
    }))
  ),
  
  WarpingRiskCalculator: lazy(() => 
    import('../components/calculators/WarpingRiskCalculator').then(module => ({
      default: module.default
    }))
  ),
  
  BurnMarkPreventer: lazy(() => 
    import('../components/calculators/BurnMarkPreventer').then(module => ({
      default: module.default
    }))
  ),
  
  DrossFormationCalculator: lazy(() => 
    import('../components/calculators/DrossFormationCalculator').then(module => ({
      default: module.default
    }))
  ),
  
  ToleranceStackCalculator: lazy(() => 
    import('../components/calculators/ToleranceStackCalculator').then(module => ({
      default: module.default
    }))
  ),

  // Process Optimization Calculators (medium priority)
  PowerSpeedMatching: lazy(() => 
    import('../components/calculators/PowerSpeedMatching').then(module => ({
      default: module.default
    }))
  ),
  
  GasPressureSettingGuide: lazy(() => 
    import('../components/calculators/GasPressureSettingGuide').then(module => ({
      default: module.default
    }))
  ),
  
  FocusHeightCalculator: lazy(() => 
    import('../components/calculators/FocusHeightCalculator').then(module => ({
      default: module.default
    }))
  ),
  
  FrequencySettingAssistant: lazy(() => 
    import('../components/calculators/FrequencySettingAssistant').then(module => ({
      default: module.default
    }))
  ),
  
  MultiplePassCalculator: lazy(() => 
    import('../components/calculators/MultiplePassCalculator').then(module => ({
      default: module.default
    }))
  ),

  // Advanced Analysis Calculators (low priority)
  BeamQualityCalculator: lazy(() => 
    import('../components/calculators/BeamQualityCalculator').then(module => ({
      default: module.default
    }))
  ),
  
  HeatAffectedZoneCalculator: lazy(() => 
    import('../components/calculators/HeatAffectedZoneCalculator').then(module => ({
      default: module.default
    }))
  ),
  
  KerfCompensationCalculator: lazy(() => 
    import('../components/calculators/KerfCompensationCalculator').then(module => ({
      default: module.default
    }))
  ),
  
  MaterialNestingOptimizer: lazy(() => 
    import('../components/calculators/MaterialNestingOptimizer').then(module => ({
      default: module.default
    }))
  ),
  
  RemnantValueCalculator: lazy(() => 
    import('../components/calculators/RemnantValueCalculator').then(module => ({
      default: module.default
    }))
  ),
  
  CutPathOptimizer: lazy(() => 
    import('../components/calculators/CutPathOptimizer').then(module => ({
      default: module.default
    }))
  )
};

// Lazy load learn pages (lowest priority)
export const LazyLearnRoutes = {
  LaserParameterOptimizerLearn: lazy(() => 
    import('../pages/learn/LaserParameterOptimizerLearn').then(module => ({
      default: module.default
    }))
  ),
  
  CuttingTimeEstimatorLearn: lazy(() => 
    import('../pages/learn/CuttingTimeEstimatorLearn').then(module => ({
      default: module.default
    }))
  ),
  
  LaserCuttingCostLearn: lazy(() => 
    import('../pages/learn/LaserCuttingCostLearn').then(module => ({
      default: module.default
    }))
  ),
  
  MaterialSelectionLearn: lazy(() => 
    import('../pages/learn/MaterialSelectionLearn').then(module => ({
      default: module.default
    }))
  )
};

// Wrapper component for lazy routes with error boundary
export function LazyRouteWrapper({ 
  Component, 
  fallback = RouteLoadingFallback 
}: { 
  Component: React.ComponentType; 
  fallback?: React.ComponentType;
}) {
  return (
    <Suspense fallback={<fallback />}>
      <Component />
    </Suspense>
  );
}

// Route preloading utilities
export class RoutePreloader {
  private static preloadedRoutes = new Set<string>();
  
  // Preload high-priority routes on app initialization
  static preloadCriticalRoutes(): void {
    const criticalRoutes = [
      'LaserParameterOptimizer',
      'CuttingTimeEstimator', 
      'LaserCuttingCostCalculator'
    ];
    
    criticalRoutes.forEach(routeName => {
      this.preloadRoute(routeName);
    });
  }
  
  // Preload route on hover/focus for better UX
  static preloadRoute(routeName: string): void {
    if (this.preloadedRoutes.has(routeName)) {
      return;
    }
    
    const routeComponent = LazyCalculatorRoutes[routeName as keyof typeof LazyCalculatorRoutes];
    if (routeComponent) {
      // Trigger the lazy import
      routeComponent._payload?._result || routeComponent._payload?._fn?.();
      this.preloadedRoutes.add(routeName);
    }
  }
  
  // Preload routes based on user behavior patterns
  static intelligentPreload(): void {
    // Preload commonly accessed routes after initial load
    setTimeout(() => {
      const commonRoutes = [
        'MaterialSelectionAssistant',
        'EdgeQualityPredictor',
        'PowerSpeedMatching'
      ];
      
      commonRoutes.forEach(route => this.preloadRoute(route));
    }, 3000); // Wait 3 seconds after initial load
  }
}

// Performance monitoring for route loading
export function useRoutePerformanceMonitoring() {
  React.useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      entries.forEach(entry => {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming;
          const loadTime = navEntry.loadEventEnd - navEntry.navigationStart;
          
          console.log(`📊 Route load time: ${Math.round(loadTime)}ms`);
          
          // Report to analytics if available
          if (typeof gtag !== 'undefined') {
            gtag('event', 'route_performance', {
              custom_map: {
                load_time: Math.round(loadTime),
                route: window.location.pathname
              }
            });
          }
        }
      });
    });
    
    observer.observe({ entryTypes: ['navigation'] });
    
    return () => observer.disconnect();
  }, []);
}

// Initialize route optimization
if (typeof window !== 'undefined') {
  // Preload critical routes after a short delay
  setTimeout(() => {
    RoutePreloader.preloadCriticalRoutes();
    RoutePreloader.intelligentPreload();
  }, 1000);
}
