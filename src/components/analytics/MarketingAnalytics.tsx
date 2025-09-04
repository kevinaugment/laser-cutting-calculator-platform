/**
 * Marketing Analytics Component
 * Tracks user behavior and marketing performance for growth optimization
 */

import React, { useEffect, useCallback } from 'react';

// Analytics event types
export interface AnalyticsEvent {
  event: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

// User properties for segmentation
export interface UserProperties {
  user_type: 'free' | 'pro' | 'enterprise' | 'trial';
  signup_date?: string;
  last_active?: string;
  total_calculations?: number;
  favorite_calculator?: string;
  traffic_source?: string;
  utm_campaign?: string;
  utm_medium?: string;
  utm_source?: string;
}

// Marketing analytics configuration
const ANALYTICS_CONFIG = {
  // Google Analytics 4 Configuration
  GA4_MEASUREMENT_ID: 'G-XXXXXXXXXX', // Replace with actual GA4 ID
  
  // Custom events for marketing tracking
  EVENTS: {
    // User engagement
    PAGE_VIEW: 'page_view',
    CALCULATOR_USED: 'calculator_used',
    EXPORT_PERFORMED: 'export_performed',
    SEARCH_PERFORMED: 'search_performed',
    
    // Marketing funnel
    SIGNUP_STARTED: 'signup_started',
    SIGNUP_COMPLETED: 'signup_completed',
    TRIAL_STARTED: 'trial_started',
    SUBSCRIPTION_PURCHASED: 'subscription_purchased',
    
    // Content engagement
    BLOG_POST_READ: 'blog_post_read',
    VIDEO_WATCHED: 'video_watched',
    RESOURCE_DOWNLOADED: 'resource_downloaded',
    
    // Feature usage
    FEATURE_DISCOVERED: 'feature_discovered',
    FEATURE_USED: 'feature_used',
    HELP_ACCESSED: 'help_accessed',
    
    // Social and sharing
    CONTENT_SHARED: 'content_shared',
    REFERRAL_MADE: 'referral_made'
  },
  
  // Event categories
  CATEGORIES: {
    ENGAGEMENT: 'engagement',
    CONVERSION: 'conversion',
    RETENTION: 'retention',
    ACQUISITION: 'acquisition',
    MONETIZATION: 'monetization'
  }
};

// Analytics service class
class MarketingAnalyticsService {
  private isInitialized = false;
  private userId: string | null = null;
  private userProperties: UserProperties = { user_type: 'free' };

  // Initialize analytics
  initialize(userId?: string, userProperties?: UserProperties) {
    if (this.isInitialized) return;

    // Initialize Google Analytics 4
    this.initializeGA4();
    
    // Set user properties
    if (userId) {
      this.setUserId(userId);
    }
    
    if (userProperties) {
      this.setUserProperties(userProperties);
    }

    this.isInitialized = true;
  }

  // Initialize Google Analytics 4
  private initializeGA4() {
    if (typeof window === 'undefined') return;

    // Load gtag script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_CONFIG.GA4_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    // Initialize gtag
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).gtag = function() {
      (window as any).dataLayer.push(arguments);
    };

    (window as any).gtag('js', new Date());
    (window as any).gtag('config', ANALYTICS_CONFIG.GA4_MEASUREMENT_ID, {
      send_page_view: false, // We'll send page views manually
      custom_map: {
        custom_parameter_1: 'calculator_id',
        custom_parameter_2: 'user_tier',
        custom_parameter_3: 'feature_used'
      }
    });
  }

  // Set user ID for cross-device tracking
  setUserId(userId: string) {
    this.userId = userId;
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', ANALYTICS_CONFIG.GA4_MEASUREMENT_ID, {
        user_id: userId
      });
    }
  }

  // Set user properties for segmentation
  setUserProperties(properties: UserProperties) {
    this.userProperties = { ...this.userProperties, ...properties };
    
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('set', 'user_properties', properties);
    }
  }

  // Track page views
  trackPageView(page_title: string, page_location: string) {
    this.trackEvent({
      event: ANALYTICS_CONFIG.EVENTS.PAGE_VIEW,
      category: ANALYTICS_CONFIG.CATEGORIES.ENGAGEMENT,
      action: 'page_view',
      custom_parameters: {
        page_title,
        page_location,
        user_type: this.userProperties.user_type
      }
    });
  }

  // Track calculator usage
  trackCalculatorUsage(calculatorId: string, inputParameters: Record<string, any>) {
    this.trackEvent({
      event: ANALYTICS_CONFIG.EVENTS.CALCULATOR_USED,
      category: ANALYTICS_CONFIG.CATEGORIES.ENGAGEMENT,
      action: 'calculator_used',
      label: calculatorId,
      custom_parameters: {
        calculator_id: calculatorId,
        user_type: this.userProperties.user_type,
        input_count: Object.keys(inputParameters).length,
        ...inputParameters
      }
    });
  }

  // Track conversion events
  trackConversion(conversionType: string, value?: number, currency = 'USD') {
    this.trackEvent({
      event: conversionType,
      category: ANALYTICS_CONFIG.CATEGORIES.CONVERSION,
      action: 'conversion',
      label: conversionType,
      value,
      custom_parameters: {
        currency,
        user_type: this.userProperties.user_type,
        conversion_type: conversionType
      }
    });
  }

  // Track feature usage
  trackFeatureUsage(featureName: string, context?: string) {
    this.trackEvent({
      event: ANALYTICS_CONFIG.EVENTS.FEATURE_USED,
      category: ANALYTICS_CONFIG.CATEGORIES.ENGAGEMENT,
      action: 'feature_used',
      label: featureName,
      custom_parameters: {
        feature_name: featureName,
        context,
        user_type: this.userProperties.user_type
      }
    });
  }

  // Track content engagement
  trackContentEngagement(contentType: string, contentId: string, engagementType: string) {
    this.trackEvent({
      event: `${contentType}_${engagementType}`,
      category: ANALYTICS_CONFIG.CATEGORIES.ENGAGEMENT,
      action: engagementType,
      label: contentId,
      custom_parameters: {
        content_type: contentType,
        content_id: contentId,
        engagement_type: engagementType,
        user_type: this.userProperties.user_type
      }
    });
  }

  // Track search behavior
  trackSearch(searchTerm: string, resultsCount: number, source: string) {
    this.trackEvent({
      event: ANALYTICS_CONFIG.EVENTS.SEARCH_PERFORMED,
      category: ANALYTICS_CONFIG.CATEGORIES.ENGAGEMENT,
      action: 'search',
      label: searchTerm,
      custom_parameters: {
        search_term: searchTerm,
        results_count: resultsCount,
        search_source: source,
        user_type: this.userProperties.user_type
      }
    });
  }

  // Generic event tracking
  trackEvent(eventData: AnalyticsEvent) {
    if (typeof window === 'undefined' || !(window as any).gtag) return;

    const { event, category, action, label, value, custom_parameters } = eventData;

    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
      custom_parameter_1: custom_parameters?.calculator_id,
      custom_parameter_2: custom_parameters?.user_type,
      custom_parameter_3: custom_parameters?.feature_name,
      ...custom_parameters
    });

    // Also send to custom analytics endpoint if needed
    this.sendToCustomAnalytics(eventData);
  }

  // Send to custom analytics endpoint
  private sendToCustomAnalytics(eventData: AnalyticsEvent) {
    // This would send to your custom analytics API
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event:', eventData);
    }

    // Example: Send to custom endpoint
    // fetch('/api/analytics/track', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     ...eventData,
    //     userId: this.userId,
    //     userProperties: this.userProperties,
    //     timestamp: new Date().toISOString()
    //   })
    // });
  }
}

// Create singleton instance
export const marketingAnalytics = new MarketingAnalyticsService();

// React component for analytics initialization
interface MarketingAnalyticsProps {
  userId?: string;
  userProperties?: UserProperties;
  children?: React.ReactNode;
}

export function MarketingAnalytics({ userId, userProperties, children }: MarketingAnalyticsProps) {
  useEffect(() => {
    // Initialize analytics on mount
    marketingAnalytics.initialize(userId, userProperties);
  }, [userId, userProperties]);

  // Track page views on route changes
  useEffect(() => {
    const handleRouteChange = () => {
      const pageTitle = document.title;
      const pageLocation = window.location.href;
      marketingAnalytics.trackPageView(pageTitle, pageLocation);
    };

    // Track initial page view
    handleRouteChange();

    // Listen for route changes (for SPA)
    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  return <>{children}</>;
}

// Hook for using analytics in components
export function useMarketingAnalytics() {
  const trackCalculatorUsage = useCallback((calculatorId: string, inputParameters: Record<string, any>) => {
    marketingAnalytics.trackCalculatorUsage(calculatorId, inputParameters);
  }, []);

  const trackFeatureUsage = useCallback((featureName: string, context?: string) => {
    marketingAnalytics.trackFeatureUsage(featureName, context);
  }, []);

  const trackConversion = useCallback((conversionType: string, value?: number, currency = 'USD') => {
    marketingAnalytics.trackConversion(conversionType, value, currency);
  }, []);

  const trackContentEngagement = useCallback((contentType: string, contentId: string, engagementType: string) => {
    marketingAnalytics.trackContentEngagement(contentType, contentId, engagementType);
  }, []);

  const trackSearch = useCallback((searchTerm: string, resultsCount: number, source: string) => {
    marketingAnalytics.trackSearch(searchTerm, resultsCount, source);
  }, []);

  const trackCustomEvent = useCallback((eventData: AnalyticsEvent) => {
    marketingAnalytics.trackEvent(eventData);
  }, []);

  return {
    trackCalculatorUsage,
    trackFeatureUsage,
    trackConversion,
    trackContentEngagement,
    trackSearch,
    trackCustomEvent,
    setUserProperties: marketingAnalytics.setUserProperties.bind(marketingAnalytics),
    setUserId: marketingAnalytics.setUserId.bind(marketingAnalytics)
  };
}

export default MarketingAnalytics;
