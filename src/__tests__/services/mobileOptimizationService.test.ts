/**
 * Mobile Optimization Service Tests
 * Comprehensive test suite for mobile optimization functionality
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { MobileOptimizationService, mobileOptimizationService } from '../../services/mobileOptimizationService';

// Mock window and navigator objects
const mockWindow = {
  screen: { width: 1920, height: 1080 },
  devicePixelRatio: 1,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
};

const mockNavigator = {
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  platform: 'Win32',
  maxTouchPoints: 0,
};

// Mock DOM elements
const mockElement = {
  style: {
    setProperty: vi.fn(),
  },
  classList: {
    add: vi.fn(),
    remove: vi.fn(),
    contains: vi.fn(),
  },
  querySelectorAll: vi.fn(() => []),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
} as any;

const mockDocument = {
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  getElementById: vi.fn(() => mockElement),
};

describe('MobileOptimizationService', () => {
  let service: MobileOptimizationService;

  beforeEach(() => {
    // Setup global mocks
    global.window = mockWindow as any;
    global.navigator = mockNavigator as any;
    global.document = mockDocument as any;

    service = new MobileOptimizationService({
      enableTouchOptimization: true,
      enableResponsiveDesign: true,
      enablePerformanceOptimization: true,
      enableAccessibilityFeatures: true,
      enableAnalytics: true,
      autoDetectDevice: false, // Disable auto-detect for testing
      cacheOptimizations: false,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('initialization', () => {
    it('should initialize with default config', () => {
      const defaultService = new MobileOptimizationService();
      expect(defaultService).toBeDefined();
    });

    it('should initialize with custom config', () => {
      const customService = new MobileOptimizationService({
        enableTouchOptimization: false,
        enableAnalytics: false,
      });
      expect(customService).toBeDefined();
    });

    it('should initialize analytics with zero values', () => {
      const analytics = service.getAnalytics();
      expect(analytics.deviceDistribution.mobile).toBe(0);
      expect(analytics.deviceDistribution.tablet).toBe(0);
      expect(analytics.deviceDistribution.desktop).toBe(0);
      expect(analytics.performanceMetrics.averageLoadTime).toBe(0);
    });
  });

  describe('device detection', () => {
    it('should detect desktop device', () => {
      const deviceInfo = service.detectDevice();
      
      expect(deviceInfo.type).toBe('desktop');
      expect(deviceInfo.screenWidth).toBe(1920);
      expect(deviceInfo.screenHeight).toBe(1080);
      expect(deviceInfo.touchSupport).toBe(false);
      expect(deviceInfo.browserName).toBe('Chrome');
      expect(deviceInfo.isIOS).toBe(false);
      expect(deviceInfo.isAndroid).toBe(false);
    });

    it('should detect mobile device', () => {
      // Mock mobile user agent and screen size
      global.navigator = {
        ...mockNavigator,
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1',
      } as any;
      
      global.window = {
        ...mockWindow,
        screen: { width: 375, height: 812 },
      } as any;

      const deviceInfo = service.detectDevice();
      
      expect(deviceInfo.type).toBe('mobile');
      expect(deviceInfo.screenWidth).toBe(375);
      expect(deviceInfo.screenHeight).toBe(812);
      expect(deviceInfo.isIOS).toBe(true);
      expect(deviceInfo.orientation).toBe('portrait');
    });

    it('should detect tablet device', () => {
      // Mock tablet user agent and screen size
      global.navigator = {
        ...mockNavigator,
        userAgent: 'Mozilla/5.0 (iPad; CPU OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1',
        maxTouchPoints: 5,
      } as any;
      
      global.window = {
        ...mockWindow,
        screen: { width: 768, height: 1024 },
      } as any;

      const deviceInfo = service.detectDevice();
      
      expect(deviceInfo.type).toBe('tablet');
      expect(deviceInfo.touchSupport).toBe(true);
      expect(deviceInfo.isIOS).toBe(true);
      expect(deviceInfo.orientation).toBe('portrait');
    });

    it('should detect Android device', () => {
      global.navigator = {
        ...mockNavigator,
        userAgent: 'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36',
      } as any;

      const deviceInfo = service.detectDevice();
      
      expect(deviceInfo.isAndroid).toBe(true);
      expect(deviceInfo.isIOS).toBe(false);
    });

    it('should handle server-side rendering', () => {
      // Remove window object
      delete (global as any).window;
      
      const ssrService = new MobileOptimizationService();
      const deviceInfo = ssrService.detectDevice();
      
      expect(deviceInfo.type).toBe('desktop');
      expect(deviceInfo.touchSupport).toBe(false);
      expect(deviceInfo.userAgent).toBe('');
    });
  });

  describe('device type helpers', () => {
    beforeEach(() => {
      service.detectDevice();
    });

    it('should identify mobile device', () => {
      global.window = {
        ...mockWindow,
        screen: { width: 375, height: 812 },
      } as any;
      
      service.detectDevice();
      expect(service.isMobile()).toBe(true);
      expect(service.isTablet()).toBe(false);
    });

    it('should identify tablet device', () => {
      global.window = {
        ...mockWindow,
        screen: { width: 768, height: 1024 },
      } as any;
      
      service.detectDevice();
      expect(service.isTablet()).toBe(true);
      expect(service.isMobile()).toBe(false);
    });

    it('should identify touch device', () => {
      global.navigator = {
        ...mockNavigator,
        maxTouchPoints: 5,
      } as any;
      
      service.detectDevice();
      expect(service.isTouchDevice()).toBe(true);
    });
  });

  describe('optimization management', () => {
    it('should create optimization for component', () => {
      const optimization = service.createOptimization('test-component', 'mobile');
      
      expect(optimization.componentId).toBe('test-component');
      expect(optimization.deviceType).toBe('mobile');
      expect(optimization.enabled).toBe(true);
      expect(optimization.optimizations.layout).toBeDefined();
      expect(optimization.optimizations.interaction).toBeDefined();
      expect(optimization.optimizations.performance).toBeDefined();
      expect(optimization.optimizations.accessibility).toBeDefined();
    });

    it('should get optimization for component', () => {
      service.createOptimization('test-component', 'mobile');
      const optimization = service.getOptimization('test-component');
      
      expect(optimization).toBeDefined();
      expect(optimization?.componentId).toBe('test-component');
    });

    it('should return null for non-existent optimization', () => {
      const optimization = service.getOptimization('non-existent');
      expect(optimization).toBeNull();
    });

    it('should update optimization', () => {
      service.createOptimization('test-component', 'mobile');
      
      const updatedOptimization = service.updateOptimization('test-component', {
        layout: {
          responsiveBreakpoints: { xs: 0, sm: 600 },
          gridSystem: { columns: 2, gutters: 20, margins: 20 },
          typography: { baseFontSize: 18, lineHeight: 1.6, scaleRatio: 1.3 },
          spacing: { baseUnit: 10, verticalRhythm: 30 },
          components: { minTouchTarget: 48, maxContentWidth: 400, cardSpacing: 20 },
        },
      });
      
      expect(updatedOptimization).toBeDefined();
      expect(updatedOptimization?.optimizations.layout.gridSystem.columns).toBe(2);
      expect(updatedOptimization?.optimizations.layout.typography.baseFontSize).toBe(18);
    });

    it('should return null when updating non-existent optimization', () => {
      const result = service.updateOptimization('non-existent', {});
      expect(result).toBeNull();
    });
  });

  describe('default optimizations', () => {
    it('should provide mobile-specific optimizations', () => {
      const optimization = service.createOptimization('mobile-component', 'mobile');
      
      expect(optimization.optimizations.layout.gridSystem.columns).toBe(1);
      expect(optimization.optimizations.layout.components.minTouchTarget).toBe(44);
      expect(optimization.optimizations.interaction.touchTargets.minSize).toBe(44);
      expect(optimization.optimizations.interaction.navigation.type).toBe('bottom-tabs');
      expect(optimization.optimizations.interaction.forms.autoFocus).toBe(false);
    });

    it('should provide tablet-specific optimizations', () => {
      const optimization = service.createOptimization('tablet-component', 'tablet');
      
      expect(optimization.optimizations.layout.gridSystem.columns).toBe(2);
      expect(optimization.optimizations.layout.components.minTouchTarget).toBe(48);
      expect(optimization.optimizations.interaction.touchTargets.minSize).toBe(48);
    });

    it('should provide desktop-specific optimizations', () => {
      const optimization = service.createOptimization('desktop-component', 'desktop');
      
      expect(optimization.optimizations.layout.gridSystem.columns).toBe(12);
      expect(optimization.optimizations.layout.components.minTouchTarget).toBe(32);
      expect(optimization.optimizations.interaction.touchTargets.minSize).toBe(32);
      expect(optimization.optimizations.interaction.navigation.type).toBe('top-tabs');
      expect(optimization.optimizations.interaction.forms.autoFocus).toBe(true);
    });

    it('should configure performance optimizations based on device type', () => {
      const mobileOpt = service.createOptimization('mobile-component', 'mobile');
      const desktopOpt = service.createOptimization('desktop-component', 'desktop');
      
      // Mobile should have more aggressive caching
      expect(mobileOpt.optimizations.performance.caching.maxAge).toBeGreaterThan(
        desktopOpt.optimizations.performance.caching.maxAge
      );
      
      // Mobile should have higher compression
      expect(mobileOpt.optimizations.performance.imageOptimization.compressionLevel).toBeLessThan(
        desktopOpt.optimizations.performance.imageOptimization.compressionLevel
      );
    });

    it('should configure accessibility optimizations', () => {
      const optimization = service.createOptimization('test-component', 'mobile');
      
      expect(optimization.optimizations.accessibility.screenReader.enabled).toBe(true);
      expect(optimization.optimizations.accessibility.contrast.ratio).toBe(4.5);
      expect(optimization.optimizations.accessibility.focus.visibleOutlines).toBe(true);
      expect(optimization.optimizations.accessibility.motion.parallax).toBe(false); // Disabled on mobile
    });
  });

  describe('optimization application', () => {
    beforeEach(() => {
      service.createOptimization('test-component', 'mobile');
    });

    it('should apply layout optimizations to element', () => {
      service.applyOptimizations(mockElement, 'test-component');
      
      expect(mockElement.style.setProperty).toHaveBeenCalledWith('--grid-columns', '1');
      expect(mockElement.style.setProperty).toHaveBeenCalledWith('--base-font-size', '16px');
      expect(mockElement.style.setProperty).toHaveBeenCalledWith('--min-touch-target', '44px');
    });

    it('should apply interaction optimizations to touch targets', () => {
      const mockTouchTarget1 = { style: { minHeight: '', minWidth: '' } };
      const mockTouchTarget2 = { style: { minHeight: '', minWidth: '' } };
      const mockTouchTargets = [mockTouchTarget1, mockTouchTarget2];
      mockElement.querySelectorAll.mockReturnValue(mockTouchTargets);

      service.applyOptimizations(mockElement, 'test-component');

      mockTouchTargets.forEach(target => {
        expect(target.style.minHeight).toBe('44px');
        expect(target.style.minWidth).toBe('44px');
      });
    });

    it('should apply performance optimizations to images', () => {
      const mockImages = [{ loading: '', classList: { add: vi.fn() } }];
      mockElement.querySelectorAll.mockReturnValue(mockImages);
      
      service.applyOptimizations(mockElement, 'test-component');
      
      mockImages.forEach(img => {
        expect(img.loading).toBe('lazy');
        expect(img.classList.add).toHaveBeenCalledWith('responsive-image');
      });
    });

    it('should apply accessibility optimizations', () => {
      service.applyOptimizations(mockElement, 'test-component');
      
      expect(mockElement.classList.add).toHaveBeenCalledWith('visible-focus');
    });

    it('should skip optimization for disabled component', () => {
      const optimization = service.getOptimization('test-component');
      if (optimization) {
        optimization.enabled = false;
      }
      
      service.applyOptimizations(mockElement, 'test-component');
      
      // Should not apply any styles
      expect(mockElement.style.setProperty).not.toHaveBeenCalled();
    });

    it('should skip optimization for non-existent component', () => {
      service.applyOptimizations(mockElement, 'non-existent');
      
      // Should not apply any styles
      expect(mockElement.style.setProperty).not.toHaveBeenCalled();
    });
  });

  describe('analytics', () => {
    it('should track device distribution', () => {
      service.detectDevice(); // Desktop
      
      const analytics = service.getAnalytics();
      expect(analytics.deviceDistribution.desktop).toBe(1);
      expect(analytics.deviceDistribution.mobile).toBe(0);
    });

    it('should track orientation usage', () => {
      global.window = {
        ...mockWindow,
        screen: { width: 375, height: 812 }, // Portrait
      } as any;
      
      service.detectDevice();
      
      const analytics = service.getAnalytics();
      expect(analytics.orientationUsage.portrait).toBe(1);
      expect(analytics.orientationUsage.landscape).toBe(0);
    });

    it('should reset analytics', () => {
      service.detectDevice();
      
      let analytics = service.getAnalytics();
      expect(analytics.deviceDistribution.desktop).toBe(1);
      
      service.resetAnalytics();
      
      analytics = service.getAnalytics();
      expect(analytics.deviceDistribution.desktop).toBe(0);
      expect(analytics.deviceDistribution.mobile).toBe(0);
      expect(analytics.deviceDistribution.tablet).toBe(0);
    });

    it('should return analytics copy', () => {
      const analytics1 = service.getAnalytics();
      const analytics2 = service.getAnalytics();
      
      expect(analytics1).not.toBe(analytics2); // Different objects
      expect(analytics1).toEqual(analytics2); // Same content
    });
  });

  describe('error handling', () => {
    it('should handle missing window object gracefully', () => {
      delete (global as any).window;
      
      const ssrService = new MobileOptimizationService();
      expect(() => ssrService.detectDevice()).not.toThrow();
    });

    it('should handle missing navigator object gracefully', () => {
      delete (global as any).navigator;
      
      expect(() => service.detectDevice()).not.toThrow();
    });

    it('should handle invalid element in applyOptimizations', () => {
      const invalidElement = null as any;
      
      expect(() => service.applyOptimizations(invalidElement, 'test-component')).not.toThrow();
    });
  });
});
