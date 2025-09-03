/**
 * Mobile Optimization Service
 * Optimizes memory system features for mobile devices with responsive design and touch interactions
 */

import { performanceMonitoringService } from './performanceMonitoringService';

// ============================================================================
// Types and Interfaces
// ============================================================================

export type DeviceType = 'mobile' | 'tablet' | 'desktop';
export type OrientationType = 'portrait' | 'landscape';
export type TouchGesture = 'tap' | 'double-tap' | 'long-press' | 'swipe' | 'pinch' | 'pan';

export interface DeviceInfo {
  type: DeviceType;
  orientation: OrientationType;
  screenWidth: number;
  screenHeight: number;
  pixelRatio: number;
  touchSupport: boolean;
  userAgent: string;
  platform: string;
  isIOS: boolean;
  isAndroid: boolean;
  browserName: string;
  browserVersion: string;
}

export interface TouchEvent {
  type: TouchGesture;
  target: string;
  timestamp: number;
  coordinates: { x: number; y: number };
  duration?: number;
  distance?: number;
  velocity?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

export interface MobileOptimization {
  componentId: string;
  deviceType: DeviceType;
  optimizations: {
    layout: LayoutOptimization;
    interaction: InteractionOptimization;
    performance: PerformanceOptimization;
    accessibility: AccessibilityOptimization;
  };
  enabled: boolean;
  lastUpdated: Date;
}

export interface LayoutOptimization {
  responsiveBreakpoints: Record<string, number>;
  gridSystem: {
    columns: number;
    gutters: number;
    margins: number;
  };
  typography: {
    baseFontSize: number;
    lineHeight: number;
    scaleRatio: number;
  };
  spacing: {
    baseUnit: number;
    verticalRhythm: number;
  };
  components: {
    minTouchTarget: number;
    maxContentWidth: number;
    cardSpacing: number;
  };
}

export interface InteractionOptimization {
  touchTargets: {
    minSize: number;
    spacing: number;
    feedback: 'haptic' | 'visual' | 'both';
  };
  gestures: {
    enabled: TouchGesture[];
    sensitivity: number;
    threshold: number;
  };
  navigation: {
    type: 'bottom-tabs' | 'drawer' | 'top-tabs';
    swipeNavigation: boolean;
    backGesture: boolean;
  };
  forms: {
    autoFocus: boolean;
    virtualKeyboard: 'numeric' | 'text' | 'email' | 'tel';
    validation: 'realtime' | 'onblur' | 'onsubmit';
  };
}

export interface PerformanceOptimization {
  lazyLoading: {
    enabled: boolean;
    threshold: number;
    placeholder: 'skeleton' | 'spinner' | 'blur';
  };
  imageOptimization: {
    webpSupport: boolean;
    responsiveImages: boolean;
    compressionLevel: number;
  };
  caching: {
    strategy: 'cache-first' | 'network-first' | 'stale-while-revalidate';
    maxAge: number;
    maxEntries: number;
  };
  bundleOptimization: {
    codesplitting: boolean;
    treeshaking: boolean;
    compression: boolean;
  };
}

export interface AccessibilityOptimization {
  screenReader: {
    enabled: boolean;
    announcements: boolean;
    landmarks: boolean;
  };
  contrast: {
    ratio: number;
    darkMode: boolean;
    highContrast: boolean;
  };
  motion: {
    reducedMotion: boolean;
    animationDuration: number;
    parallax: boolean;
  };
  focus: {
    visibleOutlines: boolean;
    skipLinks: boolean;
    focusTrap: boolean;
  };
}

export interface MobileAnalytics {
  deviceDistribution: Record<DeviceType, number>;
  orientationUsage: Record<OrientationType, number>;
  touchInteractions: Record<TouchGesture, number>;
  performanceMetrics: {
    averageLoadTime: number;
    bounceRate: number;
    sessionDuration: number;
    pageViews: number;
  };
  usabilityMetrics: {
    taskCompletionRate: number;
    errorRate: number;
    userSatisfaction: number;
    accessibilityScore: number;
  };
}

// ============================================================================
// Mobile Optimization Service Configuration
// ============================================================================

export interface MobileOptimizationConfig {
  enableTouchOptimization: boolean;
  enableResponsiveDesign: boolean;
  enablePerformanceOptimization: boolean;
  enableAccessibilityFeatures: boolean;
  enableAnalytics: boolean;
  autoDetectDevice: boolean;
  cacheOptimizations: boolean;
}

const DEFAULT_CONFIG: MobileOptimizationConfig = {
  enableTouchOptimization: true,
  enableResponsiveDesign: true,
  enablePerformanceOptimization: true,
  enableAccessibilityFeatures: true,
  enableAnalytics: true,
  autoDetectDevice: true,
  cacheOptimizations: true,
};

// ============================================================================
// Mobile Optimization Service Class
// ============================================================================

export class MobileOptimizationService {
  private config: MobileOptimizationConfig;
  private deviceInfo: DeviceInfo | null;
  private optimizations: Map<string, MobileOptimization>;
  private touchEvents: TouchEvent[];
  private analytics: MobileAnalytics;
  private observers: Map<string, ResizeObserver | IntersectionObserver>;

  constructor(config: Partial<MobileOptimizationConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.deviceInfo = null;
    this.optimizations = new Map();
    this.touchEvents = [];
    this.observers = new Map();
    this.analytics = {
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
    };

    // Initialize device detection
    if (this.config.autoDetectDevice && typeof window !== 'undefined') {
      this.detectDevice();
      this.setupEventListeners();
    }
  }

  // ============================================================================
  // Device Detection
  // ============================================================================

  /**
   * Detect device information
   */
  public detectDevice(): DeviceInfo {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      // Server-side fallback
      return {
        type: 'desktop',
        orientation: 'landscape',
        screenWidth: 1920,
        screenHeight: 1080,
        pixelRatio: 1,
        touchSupport: false,
        userAgent: '',
        platform: 'unknown',
        isIOS: false,
        isAndroid: false,
        browserName: 'unknown',
        browserVersion: '0',
      };
    }

    const userAgent = navigator.userAgent || '';
    const platform = navigator.platform || 'unknown';
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    const pixelRatio = window.devicePixelRatio || 1;
    const touchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // Detect device type
    let deviceType: DeviceType = 'desktop';
    if (screenWidth <= 768 || /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
      deviceType = screenWidth <= 480 ? 'mobile' : 'tablet';
    }

    // Detect orientation
    const orientation: OrientationType = screenWidth > screenHeight ? 'landscape' : 'portrait';

    // Detect OS
    const isIOS = /iPad|iPhone|iPod/.test(userAgent);
    const isAndroid = /Android/.test(userAgent);

    // Detect browser
    let browserName = 'unknown';
    let browserVersion = '0';
    
    if (userAgent.includes('Chrome')) {
      browserName = 'Chrome';
      browserVersion = userAgent.match(/Chrome\/(\d+)/)?.[1] || '0';
    } else if (userAgent.includes('Firefox')) {
      browserName = 'Firefox';
      browserVersion = userAgent.match(/Firefox\/(\d+)/)?.[1] || '0';
    } else if (userAgent.includes('Safari')) {
      browserName = 'Safari';
      browserVersion = userAgent.match(/Version\/(\d+)/)?.[1] || '0';
    }

    this.deviceInfo = {
      type: deviceType,
      orientation,
      screenWidth,
      screenHeight,
      pixelRatio,
      touchSupport,
      userAgent,
      platform,
      isIOS,
      isAndroid,
      browserName,
      browserVersion,
    };

    // Update analytics
    this.analytics.deviceDistribution[deviceType]++;
    this.analytics.orientationUsage[orientation]++;

    return this.deviceInfo;
  }

  /**
   * Get current device information
   */
  public getDeviceInfo(): DeviceInfo | null {
    return this.deviceInfo;
  }

  /**
   * Check if device is mobile
   */
  public isMobile(): boolean {
    return this.deviceInfo?.type === 'mobile' || false;
  }

  /**
   * Check if device is tablet
   */
  public isTablet(): boolean {
    return this.deviceInfo?.type === 'tablet' || false;
  }

  /**
   * Check if device supports touch
   */
  public isTouchDevice(): boolean {
    return this.deviceInfo?.touchSupport || false;
  }

  // ============================================================================
  // Optimization Management
  // ============================================================================

  /**
   * Create mobile optimization for component
   */
  public createOptimization(componentId: string, deviceType?: DeviceType): MobileOptimization {
    const targetDeviceType = deviceType || this.deviceInfo?.type || 'desktop';
    
    const optimization: MobileOptimization = {
      componentId,
      deviceType: targetDeviceType,
      optimizations: {
        layout: this.getDefaultLayoutOptimization(targetDeviceType),
        interaction: this.getDefaultInteractionOptimization(targetDeviceType),
        performance: this.getDefaultPerformanceOptimization(targetDeviceType),
        accessibility: this.getDefaultAccessibilityOptimization(targetDeviceType),
      },
      enabled: true,
      lastUpdated: new Date(),
    };

    this.optimizations.set(componentId, optimization);
    return optimization;
  }

  /**
   * Get optimization for component
   */
  public getOptimization(componentId: string): MobileOptimization | null {
    return this.optimizations.get(componentId) || null;
  }

  /**
   * Update optimization
   */
  public updateOptimization(
    componentId: string,
    updates: Partial<MobileOptimization['optimizations']>
  ): MobileOptimization | null {
    const optimization = this.optimizations.get(componentId);
    if (!optimization) return null;

    optimization.optimizations = {
      ...optimization.optimizations,
      ...updates,
    };
    optimization.lastUpdated = new Date();

    this.optimizations.set(componentId, optimization);
    return optimization;
  }

  /**
   * Apply optimizations to element
   */
  public applyOptimizations(element: HTMLElement, componentId: string): void {
    const optimization = this.optimizations.get(componentId);
    if (!optimization || !optimization.enabled) return;

    const { layout, interaction, performance, accessibility } = optimization.optimizations;

    // Apply layout optimizations
    if (this.config.enableResponsiveDesign) {
      this.applyLayoutOptimizations(element, layout);
    }

    // Apply interaction optimizations
    if (this.config.enableTouchOptimization) {
      this.applyInteractionOptimizations(element, interaction);
    }

    // Apply performance optimizations
    if (this.config.enablePerformanceOptimization) {
      this.applyPerformanceOptimizations(element, performance);
    }

    // Apply accessibility optimizations
    if (this.config.enableAccessibilityFeatures) {
      this.applyAccessibilityOptimizations(element, accessibility);
    }
  }

  // ============================================================================
  // Touch Event Handling
  // ============================================================================

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    if (typeof window === 'undefined') return;

    // Touch events
    if (this.isTouchDevice()) {
      document.addEventListener('touchstart', this.handleTouchStart.bind(this));
      document.addEventListener('touchend', this.handleTouchEnd.bind(this));
      document.addEventListener('touchmove', this.handleTouchMove.bind(this));
    }

    // Orientation change
    window.addEventListener('orientationchange', this.handleOrientationChange.bind(this));
    window.addEventListener('resize', this.handleResize.bind(this));

    // Performance monitoring
    if (this.config.enableAnalytics) {
      this.setupPerformanceMonitoring();
    }
  }

  /**
   * Handle touch start
   */
  private handleTouchStart(event: Event): void {
    const touchEvent = event as any;
    const touch = touchEvent.touches[0];
    
    if (touch) {
      const touchEventData: TouchEvent = {
        type: 'tap',
        target: (event.target as Element)?.tagName || 'unknown',
        timestamp: Date.now(),
        coordinates: { x: touch.clientX, y: touch.clientY },
      };

      this.touchEvents.push(touchEventData);
      this.analytics.touchInteractions.tap++;

      // Record performance
      performanceMonitoringService.recordMetric(
        'mobile.touch.start',
        'counter',
        1,
        { target: touchEventData.target }
      );
    }
  }

  /**
   * Handle touch end
   */
  private handleTouchEnd(event: Event): void {
    // Implementation for touch end handling
    performanceMonitoringService.recordMetric(
      'mobile.touch.end',
      'counter',
      1
    );
  }

  /**
   * Handle touch move
   */
  private handleTouchMove(event: Event): void {
    // Implementation for touch move handling
    performanceMonitoringService.recordMetric(
      'mobile.touch.move',
      'counter',
      1
    );
  }

  /**
   * Handle orientation change
   */
  private handleOrientationChange(): void {
    setTimeout(() => {
      this.detectDevice();
      this.updateAllOptimizations();
    }, 100); // Small delay to ensure screen dimensions are updated
  }

  /**
   * Handle resize
   */
  private handleResize(): void {
    this.detectDevice();
    this.updateAllOptimizations();
  }

  // ============================================================================
  // Default Optimizations
  // ============================================================================

  /**
   * Get default layout optimization
   */
  private getDefaultLayoutOptimization(deviceType: DeviceType): LayoutOptimization {
    const baseConfig = {
      mobile: {
        responsiveBreakpoints: { xs: 0, sm: 576, md: 768, lg: 992, xl: 1200 },
        gridSystem: { columns: 1, gutters: 16, margins: 16 },
        typography: { baseFontSize: 16, lineHeight: 1.5, scaleRatio: 1.2 },
        spacing: { baseUnit: 8, verticalRhythm: 24 },
        components: { minTouchTarget: 44, maxContentWidth: 320, cardSpacing: 16 },
      },
      tablet: {
        responsiveBreakpoints: { xs: 0, sm: 576, md: 768, lg: 992, xl: 1200 },
        gridSystem: { columns: 2, gutters: 24, margins: 24 },
        typography: { baseFontSize: 18, lineHeight: 1.6, scaleRatio: 1.25 },
        spacing: { baseUnit: 12, verticalRhythm: 32 },
        components: { minTouchTarget: 48, maxContentWidth: 768, cardSpacing: 24 },
      },
      desktop: {
        responsiveBreakpoints: { xs: 0, sm: 576, md: 768, lg: 992, xl: 1200 },
        gridSystem: { columns: 12, gutters: 32, margins: 32 },
        typography: { baseFontSize: 16, lineHeight: 1.6, scaleRatio: 1.333 },
        spacing: { baseUnit: 16, verticalRhythm: 32 },
        components: { minTouchTarget: 32, maxContentWidth: 1200, cardSpacing: 32 },
      },
    };

    return baseConfig[deviceType];
  }

  /**
   * Get default interaction optimization
   */
  private getDefaultInteractionOptimization(deviceType: DeviceType): InteractionOptimization {
    const isMobile = deviceType === 'mobile';
    const isTablet = deviceType === 'tablet';

    return {
      touchTargets: {
        minSize: isMobile ? 44 : isTablet ? 48 : 32,
        spacing: isMobile || isTablet ? 8 : 4,
        feedback: isMobile || isTablet ? 'both' : 'visual',
      },
      gestures: {
        enabled: isMobile ? ['tap', 'swipe', 'long-press'] : ['tap'],
        sensitivity: isMobile ? 0.8 : 1.0,
        threshold: isMobile ? 10 : 5,
      },
      navigation: {
        type: isMobile ? 'bottom-tabs' : 'top-tabs',
        swipeNavigation: isMobile,
        backGesture: isMobile,
      },
      forms: {
        autoFocus: !isMobile, // Avoid keyboard popup on mobile
        virtualKeyboard: 'text',
        validation: isMobile ? 'onblur' : 'realtime',
      },
    };
  }

  /**
   * Get default performance optimization
   */
  private getDefaultPerformanceOptimization(deviceType: DeviceType): PerformanceOptimization {
    const isMobile = deviceType === 'mobile';
    
    return {
      lazyLoading: {
        enabled: true,
        threshold: isMobile ? 100 : 200,
        placeholder: isMobile ? 'skeleton' : 'blur',
      },
      imageOptimization: {
        webpSupport: true,
        responsiveImages: true,
        compressionLevel: isMobile ? 0.8 : 0.9,
      },
      caching: {
        strategy: isMobile ? 'cache-first' : 'stale-while-revalidate',
        maxAge: isMobile ? 86400 : 3600, // 24h for mobile, 1h for desktop
        maxEntries: isMobile ? 50 : 100,
      },
      bundleOptimization: {
        codesplitting: true,
        treeshaking: true,
        compression: true,
      },
    };
  }

  /**
   * Get default accessibility optimization
   */
  private getDefaultAccessibilityOptimization(deviceType: DeviceType): AccessibilityOptimization {
    return {
      screenReader: {
        enabled: true,
        announcements: true,
        landmarks: true,
      },
      contrast: {
        ratio: 4.5,
        darkMode: true,
        highContrast: false,
      },
      motion: {
        reducedMotion: false,
        animationDuration: 300,
        parallax: deviceType !== 'mobile', // Disable parallax on mobile for performance
      },
      focus: {
        visibleOutlines: true,
        skipLinks: true,
        focusTrap: true,
      },
    };
  }

  // ============================================================================
  // Apply Optimizations
  // ============================================================================

  /**
   * Apply layout optimizations
   */
  private applyLayoutOptimizations(element: HTMLElement, layout: LayoutOptimization): void {
    // Apply responsive grid system
    element.style.setProperty('--grid-columns', layout.gridSystem.columns.toString());
    element.style.setProperty('--grid-gutters', `${layout.gridSystem.gutters}px`);
    element.style.setProperty('--grid-margins', `${layout.gridSystem.margins}px`);

    // Apply typography
    element.style.setProperty('--base-font-size', `${layout.typography.baseFontSize}px`);
    element.style.setProperty('--line-height', layout.typography.lineHeight.toString());

    // Apply spacing
    element.style.setProperty('--base-unit', `${layout.spacing.baseUnit}px`);
    element.style.setProperty('--vertical-rhythm', `${layout.spacing.verticalRhythm}px`);

    // Apply component sizing
    element.style.setProperty('--min-touch-target', `${layout.components.minTouchTarget}px`);
    element.style.setProperty('--max-content-width', `${layout.components.maxContentWidth}px`);
  }

  /**
   * Apply interaction optimizations
   */
  private applyInteractionOptimizations(element: HTMLElement, interaction: InteractionOptimization): void {
    // Apply touch target sizing
    const touchTargets = element.querySelectorAll('button, a, input, [role="button"]');
    touchTargets.forEach((target) => {
      const htmlTarget = target as HTMLElement;
      if (htmlTarget && htmlTarget.style) {
        htmlTarget.style.minHeight = `${interaction.touchTargets.minSize}px`;
        htmlTarget.style.minWidth = `${interaction.touchTargets.minSize}px`;
      }
    });

    // Add touch feedback classes
    if (interaction.touchTargets.feedback === 'both' || interaction.touchTargets.feedback === 'visual') {
      element.classList.add('touch-feedback');
    }
  }

  /**
   * Apply performance optimizations
   */
  private applyPerformanceOptimizations(element: HTMLElement, performance: PerformanceOptimization): void {
    // Apply lazy loading to images
    if (performance.lazyLoading.enabled) {
      const images = element.querySelectorAll('img');
      images.forEach((img) => {
        const htmlImg = img as HTMLImageElement;
        if (htmlImg) {
          htmlImg.loading = 'lazy';
          if (performance.lazyLoading.placeholder === 'skeleton' && htmlImg.classList) {
            htmlImg.classList.add('skeleton-loading');
          }
        }
      });
    }

    // Apply image optimization
    if (performance.imageOptimization.responsiveImages) {
      const images = element.querySelectorAll('img');
      images.forEach((img) => {
        const htmlImg = img as HTMLImageElement;
        if (htmlImg && htmlImg.classList) {
          htmlImg.classList.add('responsive-image');
        }
      });
    }
  }

  /**
   * Apply accessibility optimizations
   */
  private applyAccessibilityOptimizations(element: HTMLElement, accessibility: AccessibilityOptimization): void {
    // Apply focus management
    if (accessibility.focus.visibleOutlines) {
      element.classList.add('visible-focus');
    }

    // Apply motion preferences
    if (accessibility.motion.reducedMotion) {
      element.classList.add('reduced-motion');
    }

    // Apply contrast settings
    if (accessibility.contrast.highContrast) {
      element.classList.add('high-contrast');
    }
  }

  /**
   * Update all optimizations
   */
  private updateAllOptimizations(): void {
    this.optimizations.forEach((optimization, componentId) => {
      const element = document.getElementById(componentId);
      if (element) {
        this.applyOptimizations(element, componentId);
      }
    });
  }

  /**
   * Setup performance monitoring
   */
  private setupPerformanceMonitoring(): void {
    // Monitor page load performance
    if (typeof window !== 'undefined' && 'performance' in window) {
      window.addEventListener('load', () => {
        const loadTime = performance.now();
        this.analytics.performanceMetrics.averageLoadTime = loadTime;
        
        performanceMonitoringService.recordMetric(
          'mobile.page.load',
          'timer',
          loadTime,
          { deviceType: this.deviceInfo?.type || 'unknown' }
        );
      });
    }
  }

  /**
   * Get mobile analytics
   */
  public getAnalytics(): MobileAnalytics {
    return { ...this.analytics };
  }

  /**
   * Reset analytics
   */
  public resetAnalytics(): void {
    this.analytics = {
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
    };
  }
}

// ============================================================================
// Service Instance
// ============================================================================

export const mobileOptimizationService = new MobileOptimizationService();
