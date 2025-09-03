/**
 * Security Hook
 * React hook for security management, encryption, and privacy protection
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { 
  securityService,
  SecurityAuditLog,
  PrivacySettings,
  GDPRRequest,
  SecurityMetrics,
  EncryptionAlgorithm,
  HashAlgorithm,
  SecurityLevel
} from '../services/securityService';

// ============================================================================
// Hook State Types
// ============================================================================

export interface SecurityState {
  auditLogs: SecurityAuditLog[];
  privacySettings: PrivacySettings | null;
  gdprRequests: GDPRRequest[];
  securityMetrics: SecurityMetrics;
  encryptionKeys: string[];
  isLoading: boolean;
  error: string | null;
  initialized: boolean;
}

export interface SecurityActions {
  encryptData: (data: string, keyId?: string) => Promise<{ encryptedData: string; keyId: string; iv: string }>;
  decryptData: (encryptedData: string, keyId: string, iv: string) => Promise<string>;
  hashData: (data: string, algorithm?: HashAlgorithm) => Promise<string>;
  verifyHash: (data: string, hash: string, algorithm?: HashAlgorithm) => Promise<boolean>;
  logSecurityEvent: (action: string, resource: string, success: boolean, details?: Record<string, any>, userId?: string) => void;
  getAuditLogs: (filters?: any) => SecurityAuditLog[];
  setPrivacySettings: (userId: string, settings: Partial<PrivacySettings>) => PrivacySettings;
  getPrivacySettings: (userId: string) => PrivacySettings | null;
  createGDPRRequest: (userId: string, type: GDPRRequest['type'], details: string) => GDPRRequest;
  processGDPRRequest: (requestId: string, response?: string, attachments?: string[]) => GDPRRequest;
  completeGDPRRequest: (requestId: string) => GDPRRequest;
  getGDPRRequests: (userId?: string) => GDPRRequest[];
  maskData: (data: string, type?: 'email' | 'phone' | 'ip' | 'custom', maskChar?: string) => string;
  anonymizeUserData: (userData: Record<string, any>) => Record<string, any>;
  getSecurityMetrics: () => SecurityMetrics;
  resetSecurityMetrics: () => void;
  clearError: () => void;
}

// ============================================================================
// Hook Configuration
// ============================================================================

export interface UseSecurityConfig {
  enableAuditLogging?: boolean;
  enableGDPRCompliance?: boolean;
  enableEncryption?: boolean;
  enableMetricsTracking?: boolean;
  autoLoadData?: boolean;
  updateInterval?: number;
}

const DEFAULT_CONFIG: Required<UseSecurityConfig> = {
  enableAuditLogging: true,
  enableGDPRCompliance: true,
  enableEncryption: true,
  enableMetricsTracking: true,
  autoLoadData: true,
  updateInterval: 30000, // 30 seconds
};

// ============================================================================
// Main Hook
// ============================================================================

export function useSecurity(
  config: UseSecurityConfig = {}
): [SecurityState, SecurityActions] {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  
  // State
  const [state, setState] = useState<SecurityState>({
    auditLogs: [],
    privacySettings: null,
    gdprRequests: [],
    securityMetrics: {
      totalRequests: 0,
      blockedRequests: 0,
      failedLogins: 0,
      suspiciousActivities: 0,
      encryptedDataSize: 0,
      auditLogEntries: 0,
      gdprRequests: 0,
      averageResponseTime: 0,
      securityScore: 0,
    },
    encryptionKeys: [],
    isLoading: false,
    error: null,
    initialized: false,
  });

  // Refs for intervals
  const metricsIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize
  useEffect(() => {
    if (!state.initialized && finalConfig.autoLoadData) {
      initializeSecurity();
    }
  }, [state.initialized, finalConfig.autoLoadData]);

  // Setup metrics updates
  useEffect(() => {
    if (finalConfig.enableMetricsTracking && state.initialized) {
      metricsIntervalRef.current = setInterval(() => {
        updateSecurityMetrics();
      }, finalConfig.updateInterval);

      return () => {
        if (metricsIntervalRef.current) {
          clearInterval(metricsIntervalRef.current);
        }
      };
    }
  }, [finalConfig.enableMetricsTracking, finalConfig.updateInterval, state.initialized]);

  // Initialize security
  const initializeSecurity = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const securityMetrics = securityService.getSecurityMetrics();
      const auditLogs = finalConfig.enableAuditLogging ? securityService.getAuditLogs({ limit: 100 }) : [];
      const gdprRequests = finalConfig.enableGDPRCompliance ? securityService.getGDPRRequests() : [];

      setState(prev => ({
        ...prev,
        securityMetrics,
        auditLogs,
        gdprRequests,
        isLoading: false,
        initialized: true,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to initialize security';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
        initialized: true,
      }));
    }
  }, [finalConfig]);

  // Encrypt data
  const encryptData = useCallback(async (data: string, keyId?: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await securityService.encryptData(data, keyId);
      
      setState(prev => ({
        ...prev,
        isLoading: false,
      }));

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to encrypt data';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, []);

  // Decrypt data
  const decryptData = useCallback(async (encryptedData: string, keyId: string, iv: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await securityService.decryptData(encryptedData, keyId, iv);
      
      setState(prev => ({
        ...prev,
        isLoading: false,
      }));

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to decrypt data';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, []);

  // Hash data
  const hashData = useCallback(async (data: string, algorithm?: HashAlgorithm) => {
    setState(prev => ({ ...prev, error: null }));

    try {
      return await securityService.hashData(data, algorithm);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to hash data';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    }
  }, []);

  // Verify hash
  const verifyHash = useCallback(async (data: string, hash: string, algorithm?: HashAlgorithm) => {
    setState(prev => ({ ...prev, error: null }));

    try {
      return await securityService.verifyHash(data, hash, algorithm);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to verify hash';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    }
  }, []);

  // Log security event
  const logSecurityEvent = useCallback((
    action: string,
    resource: string,
    success: boolean,
    details: Record<string, any> = {},
    userId?: string
  ) => {
    if (!finalConfig.enableAuditLogging) return;

    setState(prev => ({ ...prev, error: null }));

    try {
      securityService.logSecurityEvent(action, resource, success, details, userId);
      
      // Update audit logs in state
      const updatedLogs = securityService.getAuditLogs({ limit: 100 });
      setState(prev => ({ ...prev, auditLogs: updatedLogs }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to log security event';
      setState(prev => ({ ...prev, error: errorMessage }));
    }
  }, [finalConfig.enableAuditLogging]);

  // Get audit logs
  const getAuditLogs = useCallback((filters: any = {}) => {
    return securityService.getAuditLogs(filters);
  }, []);

  // Set privacy settings
  const setPrivacySettings = useCallback((userId: string, settings: Partial<PrivacySettings>) => {
    setState(prev => ({ ...prev, error: null }));

    try {
      const privacySettings = securityService.setPrivacySettings(userId, settings);
      
      setState(prev => ({ ...prev, privacySettings }));
      
      return privacySettings;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to set privacy settings';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    }
  }, []);

  // Get privacy settings
  const getPrivacySettings = useCallback((userId: string) => {
    return securityService.getPrivacySettings(userId);
  }, []);

  // Create GDPR request
  const createGDPRRequest = useCallback((userId: string, type: GDPRRequest['type'], details: string) => {
    setState(prev => ({ ...prev, error: null }));

    try {
      const request = securityService.createGDPRRequest(userId, type, details);
      
      setState(prev => ({
        ...prev,
        gdprRequests: [request, ...prev.gdprRequests],
      }));
      
      return request;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create GDPR request';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    }
  }, []);

  // Process GDPR request
  const processGDPRRequest = useCallback((requestId: string, response?: string, attachments?: string[]) => {
    setState(prev => ({ ...prev, error: null }));

    try {
      const request = securityService.processGDPRRequest(requestId, response, attachments);
      
      setState(prev => ({
        ...prev,
        gdprRequests: prev.gdprRequests.map(r => r.id === requestId ? request : r),
      }));
      
      return request;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to process GDPR request';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    }
  }, []);

  // Complete GDPR request
  const completeGDPRRequest = useCallback((requestId: string) => {
    setState(prev => ({ ...prev, error: null }));

    try {
      const request = securityService.completeGDPRRequest(requestId);
      
      setState(prev => ({
        ...prev,
        gdprRequests: prev.gdprRequests.map(r => r.id === requestId ? request : r),
      }));
      
      return request;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to complete GDPR request';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    }
  }, []);

  // Get GDPR requests
  const getGDPRRequests = useCallback((userId?: string) => {
    return securityService.getGDPRRequests(userId);
  }, []);

  // Mask data
  const maskData = useCallback((data: string, type?: 'email' | 'phone' | 'ip' | 'custom', maskChar?: string) => {
    return securityService.maskData(data, type, maskChar);
  }, []);

  // Anonymize user data
  const anonymizeUserData = useCallback((userData: Record<string, any>) => {
    return securityService.anonymizeUserData(userData);
  }, []);

  // Get security metrics
  const getSecurityMetrics = useCallback(() => {
    return securityService.getSecurityMetrics();
  }, []);

  // Update security metrics
  const updateSecurityMetrics = useCallback(() => {
    if (!finalConfig.enableMetricsTracking) return;

    try {
      const securityMetrics = securityService.getSecurityMetrics();
      setState(prev => ({ ...prev, securityMetrics }));
    } catch (error) {
      console.warn('Failed to update security metrics:', error);
    }
  }, [finalConfig.enableMetricsTracking]);

  // Reset security metrics
  const resetSecurityMetrics = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));

    try {
      securityService.resetSecurityMetrics();
      const securityMetrics = securityService.getSecurityMetrics();
      
      setState(prev => ({ ...prev, securityMetrics }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to reset security metrics';
      setState(prev => ({ ...prev, error: errorMessage }));
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Actions object
  const actions: SecurityActions = {
    encryptData,
    decryptData,
    hashData,
    verifyHash,
    logSecurityEvent,
    getAuditLogs,
    setPrivacySettings,
    getPrivacySettings,
    createGDPRRequest,
    processGDPRRequest,
    completeGDPRRequest,
    getGDPRRequests,
    maskData,
    anonymizeUserData,
    getSecurityMetrics,
    resetSecurityMetrics,
    clearError,
  };

  return [state, actions];
}

// ============================================================================
// Specialized Hooks
// ============================================================================

/**
 * Hook for encryption and decryption
 */
export function useEncryption() {
  const [state, actions] = useSecurity({
    enableAuditLogging: false,
    enableGDPRCompliance: false,
    enableMetricsTracking: false,
    autoLoadData: false,
  });

  return {
    isLoading: state.isLoading,
    error: state.error,
    encryptData: actions.encryptData,
    decryptData: actions.decryptData,
    hashData: actions.hashData,
    verifyHash: actions.verifyHash,
    clearError: actions.clearError,
  };
}

/**
 * Hook for audit logging
 */
export function useAuditLogging() {
  const [state, actions] = useSecurity({
    enableAuditLogging: true,
    enableGDPRCompliance: false,
    enableEncryption: false,
    enableMetricsTracking: false,
  });

  return {
    auditLogs: state.auditLogs,
    isLoading: state.isLoading,
    error: state.error,
    logSecurityEvent: actions.logSecurityEvent,
    getAuditLogs: actions.getAuditLogs,
    clearError: actions.clearError,
  };
}

/**
 * Hook for privacy and GDPR compliance
 */
export function usePrivacyCompliance(userId?: string) {
  const [state, actions] = useSecurity({
    enableAuditLogging: false,
    enableGDPRCompliance: true,
    enableEncryption: false,
    enableMetricsTracking: false,
  });

  const userPrivacySettings = userId ? actions.getPrivacySettings(userId) : null;
  const userGDPRRequests = userId ? actions.getGDPRRequests(userId) : state.gdprRequests;

  return {
    privacySettings: userPrivacySettings,
    gdprRequests: userGDPRRequests,
    isLoading: state.isLoading,
    error: state.error,
    setPrivacySettings: actions.setPrivacySettings,
    createGDPRRequest: actions.createGDPRRequest,
    processGDPRRequest: actions.processGDPRRequest,
    completeGDPRRequest: actions.completeGDPRRequest,
    maskData: actions.maskData,
    anonymizeUserData: actions.anonymizeUserData,
    clearError: actions.clearError,
  };
}

/**
 * Hook for security monitoring
 */
export function useSecurityMonitoring() {
  const [state, actions] = useSecurity({
    enableAuditLogging: true,
    enableGDPRCompliance: false,
    enableEncryption: false,
    enableMetricsTracking: true,
  });

  return {
    securityMetrics: state.securityMetrics,
    auditLogs: state.auditLogs,
    isLoading: state.isLoading,
    error: state.error,
    getSecurityMetrics: actions.getSecurityMetrics,
    resetSecurityMetrics: actions.resetSecurityMetrics,
    getAuditLogs: actions.getAuditLogs,
    clearError: actions.clearError,
  };
}
