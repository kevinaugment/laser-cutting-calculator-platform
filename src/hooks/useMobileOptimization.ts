/**
 * Mobile Optimization Hook
 * React hook for mobile device optimization and responsive design
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { 
  mobileOptimizationService,
  DeviceInfo,
  MobileOptimization,
  MobileAnalytics,
  DeviceType,
  TouchEvent
} from '../services/mobileOptimizationService';

// ============================================================================
// Hook State Types
// ============================================================================

export interface MobileOptimizationState {
  deviceInfo: DeviceInfo | null;
  optimizations: Map<string, MobileOptimization>;
  analytics: MobileAnalytics;
  touchEvents: TouchEvent[];
  isLoading: boolean;
  error: string | null;
  initialized: boolean;
}

export interface MobileOptimizationActions {
  detectDevice: () => DeviceInfo;
  createOptimization: (componentId: string, deviceType?: DeviceType) => MobileOptimization;
  getOptimization: (componentId: string) => MobileOptimization | null;
  updateOptimization: (componentId: string, updates: Partial<MobileOptimization['optimizations']>) => MobileOptimization | null;
  applyOptimizations: (element: HTMLElement, componentId: string) => void;
  getAnalytics: () => MobileAnalytics;
  resetAnalytics: () => void;
  clearError: () => void;
}

// ============================================================================
// Hook Configuration
// ============================================================================

export interface UseMobileOptimizationConfig {
  autoDetect?: boolean;
  enableTouchTracking?: boolean;
  enableAnalytics?: boolean;
  enablePerformanceMonitoring?: boolean;
  updateInterval?: number;
}

const DEFAULT_CONFIG: Required<UseMobileOptimizationConfig> = {
  autoDetect: true,
  enableTouchTracking: true,
  enableAnalytics: true,
  enablePerformanceMonitoring: true,
  updateInterval: 5000, // 5 seconds
};

// ============================================================================
// Main Hook
// ============================================================================

export function useMobileOptimization(
  config: UseMobileOptimizationConfig = {}
): [MobileOptimizationState, MobileOptimizationActions] {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  
  // State
  const [state, setState] = useState<MobileOptimizationState>({
    deviceInfo: null,
    optimizations: new Map(),
    analytics: {
      deviceDistribution: { mobile: 0, tablet: 0, desktop: 0 },
      orientationUsage: { portrait: 0, landscape: 0 },
      touchInteractions: { tap: 0, 'double-tap': 0, 'long-press': 0, swipe: 0, pinch: 0, pan: 0 },
      performanceMetrics: {
        averageLoadTime: 0,
        bounceRate: 0,
        sessionDuration: 0,
        pageViews: 0,
      },
      usabilityMetrics: {
        taskCompletionRate: 0,
        errorRate: 0,
        userSatisfaction: 0,
        accessibilityScore: 0,
      },
    },
    touchEvents: [],
    isLoading: false,
    error: null,
    initialized: false,
  });

  // Refs for intervals
  const analyticsIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize
  useEffect(() => {
    if (!state.initialized) {
      initializeOptimization();
    }
  }, [state.initialized]);

  // Setup analytics updates
  useEffect(() => {
    if (finalConfig.enableAnalytics && state.initialized) {
      analyticsIntervalRef.current = setInterval(() => {
        updateAnalytics();
      }, finalConfig.updateInterval);

      return () => {
        if (analyticsIntervalRef.current) {
          clearInterval(analyticsIntervalRef.current);
        }
      };
    }
  }, [finalConfig.enableAnalytics, finalConfig.updateInterval, state.initialized]);

  // Initialize optimization
  const initializeOptimization = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      let deviceInfo: DeviceInfo | null = null;
      
      if (finalConfig.autoDetect) {
        deviceInfo = mobileOptimizationService.detectDevice();
      }

      const analytics = mobileOptimizationService.getAnalytics();

      setState(prev => ({
        ...prev,
        deviceInfo,
        analytics,
        isLoading: false,
        initialized: true,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to initialize mobile optimization';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
        initialized: true,
      }));
    }
  }, [finalConfig.autoDetect]);

  // Detect device
  const detectDevice = useCallback((): DeviceInfo => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const deviceInfo = mobileOptimizationService.detectDevice();
      
      setState(prev => ({
        ...prev,
        deviceInfo,
        isLoading: false,
      }));

      return deviceInfo;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to detect device';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, []);

  // Create optimization
  const createOptimization = useCallback((
    componentId: string,
    deviceType?: DeviceType
  ): MobileOptimization => {
    setState(prev => ({ ...prev, error: null }));

    try {
      const optimization = mobileOptimizationService.createOptimization(componentId, deviceType);
      
      setState(prev => ({
        ...prev,
        optimizations: new Map(prev.optimizations).set(componentId, optimization),
      }));

      return optimization;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create optimization';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    }
  }, []);

  // Get optimization
  const getOptimization = useCallback((componentId: string): MobileOptimization | null => {
    return mobileOptimizationService.getOptimization(componentId);
  }, []);

  // Update optimization
  const updateOptimization = useCallback((
    componentId: string,
    updates: Partial<MobileOptimization['optimizations']>
  ): MobileOptimization | null => {
    setState(prev => ({ ...prev, error: null }));

    try {
      const optimization = mobileOptimizationService.updateOptimization(componentId, updates);
      
      if (optimization) {
        setState(prev => ({
          ...prev,
          optimizations: new Map(prev.optimizations).set(componentId, optimization),
        }));
      }

      return optimization;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update optimization';
      setState(prev => ({ ...prev, error: errorMessage }));
      return null;
    }
  }, []);

  // Apply optimizations
  const applyOptimizations = useCallback((element: HTMLElement, componentId: string): void => {
    setState(prev => ({ ...prev, error: null }));

    try {
      mobileOptimizationService.applyOptimizations(element, componentId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to apply optimizations';
      setState(prev => ({ ...prev, error: errorMessage }));
    }
  }, []);

  // Get analytics
  const getAnalytics = useCallback((): MobileAnalytics => {
    return mobileOptimizationService.getAnalytics();
  }, []);

  // Update analytics
  const updateAnalytics = useCallback(() => {
    if (!finalConfig.enableAnalytics) return;

    try {
      const analytics = mobileOptimizationService.getAnalytics();
      setState(prev => ({ ...prev, analytics }));
    } catch (error) {
      console.warn('Failed to update analytics:', error);
    }
  }, [finalConfig.enableAnalytics]);

  // Reset analytics
  const resetAnalytics = useCallback((): void => {
    setState(prev => ({ ...prev, error: null }));

    try {
      mobileOptimizationService.resetAnalytics();
      const analytics = mobileOptimizationService.getAnalytics();
      
      setState(prev => ({ ...prev, analytics }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to reset analytics';
      setState(prev => ({ ...prev, error: errorMessage }));
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Actions object
  const actions: MobileOptimizationActions = {
    detectDevice,
    createOptimization,
    getOptimization,
    updateOptimization,
    applyOptimizations,
    getAnalytics,
    resetAnalytics,
    clearError,
  };

  return [state, actions];
}

// ============================================================================
// Specialized Hooks
// ============================================================================

/**
 * Hook for device detection
 */
export function useDeviceDetection() {
  const [state, actions] = useMobileOptimization({
    autoDetect: true,
    enableTouchTracking: false,
    enableAnalytics: false,
    enablePerformanceMonitoring: false,
  });

  return {
    deviceInfo: state.deviceInfo,
    isMobile: state.deviceInfo?.type === 'mobile',
    isTablet: state.deviceInfo?.type === 'tablet',
    isDesktop: state.deviceInfo?.type === 'desktop',
    isTouchDevice: state.deviceInfo?.touchSupport || false,
    isPortrait: state.deviceInfo?.orientation === 'portrait',
    isLandscape: state.deviceInfo?.orientation === 'landscape',
    isLoading: state.isLoading,
    error: state.error,
    detectDevice: actions.detectDevice,
    clearError: actions.clearError,
  };
}

/**
 * Hook for responsive design
 */
export function useResponsiveDesign(componentId: string) {
  const [state, actions] = useMobileOptimization({
    autoDetect: true,
    enableTouchTracking: false,
    enableAnalytics: false,
  });

  const elementRef = useRef<HTMLElement | null>(null);

  // Create optimization on mount
  useEffect(() => {
    if (state.initialized && !state.optimizations.has(componentId)) {
      actions.createOptimization(componentId);
    }
  }, [state.initialized, componentId, actions]);

  // Apply optimizations when element ref changes
  useEffect(() => {
    if (elementRef.current && state.optimizations.has(componentId)) {
      actions.applyOptimizations(elementRef.current, componentId);
    }
  }, [elementRef.current, componentId, actions, state.optimizations]);

  return {
    elementRef,
    deviceInfo: state.deviceInfo,
    optimization: state.optimizations.get(componentId),
    updateOptimization: (updates: Partial<MobileOptimization['optimizations']>) => 
      actions.updateOptimization(componentId, updates),
    isLoading: state.isLoading,
    error: state.error,
    clearError: actions.clearError,
  };
}

/**
 * Hook for touch interactions
 */
export function useTouchInteractions() {
  const [state, actions] = useMobileOptimization({
    autoDetect: true,
    enableTouchTracking: true,
    enableAnalytics: true,
  });

  return {
    touchEvents: state.touchEvents,
    touchInteractions: state.analytics.touchInteractions,
    isTouchDevice: state.deviceInfo?.touchSupport || false,
    isLoading: state.isLoading,
    error: state.error,
    clearError: actions.clearError,
  };
}

/**
 * Hook for mobile analytics
 */
export function useMobileAnalytics() {
  const [state, actions] = useMobileOptimization({
    autoDetect: true,
    enableAnalytics: true,
    enablePerformanceMonitoring: true,
  });

  return {
    analytics: state.analytics,
    deviceDistribution: state.analytics.deviceDistribution,
    orientationUsage: state.analytics.orientationUsage,
    performanceMetrics: state.analytics.performanceMetrics,
    usabilityMetrics: state.analytics.usabilityMetrics,
    isLoading: state.isLoading,
    error: state.error,
    getAnalytics: actions.getAnalytics,
    resetAnalytics: actions.resetAnalytics,
    clearError: actions.clearError,
  };
}

/**
 * Hook for mobile-first component optimization
 */
export function useMobileFirst(componentId: string) {
  const { elementRef, deviceInfo, optimization, updateOptimization, isLoading, error, clearError } = useResponsiveDesign(componentId);
  const { isTouchDevice } = useTouchInteractions();

  // Mobile-first CSS classes
  const getMobileClasses = useCallback(() => {
    const classes: string[] = [];
    
    if (deviceInfo) {
      classes.push(`device-${deviceInfo.type}`);
      classes.push(`orientation-${deviceInfo.orientation}`);
      
      if (isTouchDevice) {
        classes.push('touch-device');
      }
      
      if (deviceInfo.isIOS) {
        classes.push('ios-device');
      } else if (deviceInfo.isAndroid) {
        classes.push('android-device');
      }
    }
    
    return classes.join(' ');
  }, [deviceInfo, isTouchDevice]);

  // Mobile-first styles
  const getMobileStyles = useCallback(() => {
    if (!optimization) return {};
    
    const { layout } = optimization.optimizations;
    
    return {
      '--mobile-font-size': `${layout.typography.baseFontSize}px`,
      '--mobile-line-height': layout.typography.lineHeight,
      '--mobile-spacing': `${layout.spacing.baseUnit}px`,
      '--mobile-touch-target': `${layout.components.minTouchTarget}px`,
      '--mobile-max-width': `${layout.components.maxContentWidth}px`,
    } as React.CSSProperties;
  }, [optimization]);

  return {
    elementRef,
    deviceInfo,
    optimization,
    updateOptimization,
    getMobileClasses,
    getMobileStyles,
    isMobile: deviceInfo?.type === 'mobile',
    isTablet: deviceInfo?.type === 'tablet',
    isTouchDevice,
    isLoading,
    error,
    clearError,
  };
}
