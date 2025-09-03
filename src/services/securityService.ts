/**
 * Security Service
 * Comprehensive security hardening with encryption, privacy protection, and GDPR compliance
 */

import { performanceMonitoringService } from './performanceMonitoringService';

// ============================================================================
// Types and Interfaces
// ============================================================================

export type EncryptionAlgorithm = 'AES-256-GCM' | 'ChaCha20-Poly1305' | 'AES-128-GCM';
export type HashAlgorithm = 'SHA-256' | 'SHA-512' | 'BLAKE2b';
export type SecurityLevel = 'basic' | 'standard' | 'high' | 'maximum';
export type DataClassification = 'public' | 'internal' | 'confidential' | 'restricted';

export interface SecurityConfig {
  encryptionAlgorithm: EncryptionAlgorithm;
  hashAlgorithm: HashAlgorithm;
  securityLevel: SecurityLevel;
  enableE2EEncryption: boolean;
  enableDataMasking: boolean;
  enableAuditLogging: boolean;
  enableGDPRCompliance: boolean;
  sessionTimeout: number;
  maxLoginAttempts: number;
  passwordMinLength: number;
  requireMFA: boolean;
}

export interface EncryptionKey {
  id: string;
  algorithm: EncryptionAlgorithm;
  key: CryptoKey;
  iv: Uint8Array;
  createdAt: Date;
  expiresAt?: Date;
  usage: KeyUsage[];
}

export interface SecurityAuditLog {
  id: string;
  timestamp: Date;
  userId?: string;
  sessionId: string;
  action: string;
  resource: string;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  details: Record<string, any>;
}

export interface PrivacySettings {
  userId: string;
  dataRetentionDays: number;
  allowAnalytics: boolean;
  allowPersonalization: boolean;
  allowSharing: boolean;
  allowCookies: boolean;
  allowThirdPartyIntegrations: boolean;
  dataExportRequested: boolean;
  dataDeletionRequested: boolean;
  consentTimestamp: Date;
  lastUpdated: Date;
}

export interface GDPRRequest {
  id: string;
  userId: string;
  type: 'access' | 'rectification' | 'erasure' | 'portability' | 'restriction' | 'objection';
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  requestedAt: Date;
  processedAt?: Date;
  completedAt?: Date;
  details: string;
  response?: string;
  attachments?: string[];
}

export interface SecurityMetrics {
  totalRequests: number;
  blockedRequests: number;
  failedLogins: number;
  suspiciousActivities: number;
  encryptedDataSize: number;
  auditLogEntries: number;
  gdprRequests: number;
  averageResponseTime: number;
  securityScore: number;
}

export interface DataProtectionPolicy {
  classification: DataClassification;
  encryptionRequired: boolean;
  retentionDays: number;
  accessControls: string[];
  auditRequired: boolean;
  anonymizationRequired: boolean;
  geographicRestrictions: string[];
}

// ============================================================================
// Security Service Configuration
// ============================================================================

const DEFAULT_CONFIG: SecurityConfig = {
  encryptionAlgorithm: 'AES-256-GCM',
  hashAlgorithm: 'SHA-256',
  securityLevel: 'standard',
  enableE2EEncryption: true,
  enableDataMasking: true,
  enableAuditLogging: true,
  enableGDPRCompliance: true,
  sessionTimeout: 30 * 60 * 1000, // 30 minutes
  maxLoginAttempts: 5,
  passwordMinLength: 12,
  requireMFA: false,
};

// ============================================================================
// Security Service Class
// ============================================================================

export class SecurityService {
  private config: SecurityConfig;
  private encryptionKeys: Map<string, EncryptionKey>;
  private auditLogs: SecurityAuditLog[];
  private privacySettings: Map<string, PrivacySettings>;
  private gdprRequests: Map<string, GDPRRequest>;
  private securityMetrics: SecurityMetrics;
  private dataProtectionPolicies: Map<DataClassification, DataProtectionPolicy>;

  constructor(config: Partial<SecurityConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.encryptionKeys = new Map();
    this.auditLogs = [];
    this.privacySettings = new Map();
    this.gdprRequests = new Map();
    this.securityMetrics = {
      totalRequests: 0,
      blockedRequests: 0,
      failedLogins: 0,
      suspiciousActivities: 0,
      encryptedDataSize: 0,
      auditLogEntries: 0,
      gdprRequests: 0,
      averageResponseTime: 0,
      securityScore: 0,
    };

    // Initialize data protection policies
    this.initializeDataProtectionPolicies();

    // Initialize encryption keys
    this.initializeEncryptionKeys();
  }

  // ============================================================================
  // Encryption and Decryption
  // ============================================================================

  /**
   * Generate encryption key
   */
  public async generateEncryptionKey(
    algorithm: EncryptionAlgorithm = this.config.encryptionAlgorithm,
    usage: KeyUsage[] = ['encrypt', 'decrypt']
  ): Promise<EncryptionKey> {
    const keyId = this.generateId();
    
    // Generate key based on algorithm
    let key: CryptoKey;
    let keyLength: number;
    
    switch (algorithm) {
      case 'AES-256-GCM':
        keyLength = 256;
        break;
      case 'AES-128-GCM':
        keyLength = 128;
        break;
      case 'ChaCha20-Poly1305':
        keyLength = 256;
        break;
      default:
        keyLength = 256;
    }

    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
      key = await window.crypto.subtle.generateKey(
        {
          name: 'AES-GCM',
          length: keyLength,
        },
        true,
        usage
      );
    } else {
      // Fallback for server-side or unsupported environments
      key = {} as CryptoKey;
    }

    // Generate IV
    const iv = typeof window !== 'undefined' && window.crypto 
      ? window.crypto.getRandomValues(new Uint8Array(12))
      : new Uint8Array(12);

    const encryptionKey: EncryptionKey = {
      id: keyId,
      algorithm,
      key,
      iv,
      createdAt: new Date(),
      usage,
    };

    this.encryptionKeys.set(keyId, encryptionKey);
    return encryptionKey;
  }

  /**
   * Encrypt data
   */
  public async encryptData(data: string, keyId?: string): Promise<{
    encryptedData: string;
    keyId: string;
    iv: string;
  }> {
    const startTime = performance.now();

    try {
      // Get or create encryption key
      let encryptionKey: EncryptionKey;
      if (keyId && this.encryptionKeys.has(keyId)) {
        encryptionKey = this.encryptionKeys.get(keyId)!;
      } else {
        encryptionKey = await this.generateEncryptionKey();
      }

      let encryptedData: string;

      if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
        // Browser environment with Web Crypto API
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(data);

        const encrypted = await window.crypto.subtle.encrypt(
          {
            name: 'AES-GCM',
            iv: encryptionKey.iv,
          },
          encryptionKey.key,
          dataBuffer
        );

        encryptedData = this.arrayBufferToBase64(encrypted);
      } else {
        // Fallback for server-side or unsupported environments
        encryptedData = btoa(data); // Simple base64 encoding as fallback
      }

      const result = {
        encryptedData,
        keyId: encryptionKey.id,
        iv: this.arrayBufferToBase64(encryptionKey.iv),
      };

      // Update metrics
      this.securityMetrics.encryptedDataSize += data.length;

      // Record performance
      const duration = performance.now() - startTime;
      performanceMonitoringService.recordTiming(
        'security.encryption',
        duration,
        true,
        undefined,
        { algorithm: encryptionKey.algorithm, dataSize: data.length }
      );

      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Encryption failed';
      
      performanceMonitoringService.recordTiming(
        'security.encryption',
        duration,
        false,
        errorMessage
      );

      throw error;
    }
  }

  /**
   * Decrypt data
   */
  public async decryptData(encryptedData: string, keyId: string, iv: string): Promise<string> {
    const startTime = performance.now();

    try {
      const encryptionKey = this.encryptionKeys.get(keyId);
      if (!encryptionKey) {
        throw new Error(`Encryption key ${keyId} not found`);
      }

      let decryptedData: string;

      if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
        // Browser environment with Web Crypto API
        const encryptedBuffer = this.base64ToArrayBuffer(encryptedData);
        const ivBuffer = this.base64ToArrayBuffer(iv);

        const decrypted = await window.crypto.subtle.decrypt(
          {
            name: 'AES-GCM',
            iv: ivBuffer,
          },
          encryptionKey.key,
          encryptedBuffer
        );

        const decoder = new TextDecoder();
        decryptedData = decoder.decode(decrypted);
      } else {
        // Fallback for server-side or unsupported environments
        decryptedData = atob(encryptedData); // Simple base64 decoding as fallback
      }

      // Record performance
      const duration = performance.now() - startTime;
      performanceMonitoringService.recordTiming(
        'security.decryption',
        duration,
        true,
        undefined,
        { keyId, dataSize: decryptedData.length }
      );

      return decryptedData;
    } catch (error) {
      const duration = performance.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Decryption failed';
      
      performanceMonitoringService.recordTiming(
        'security.decryption',
        duration,
        false,
        errorMessage
      );

      throw error;
    }
  }

  // ============================================================================
  // Data Hashing and Verification
  // ============================================================================

  /**
   * Hash data
   */
  public async hashData(data: string, algorithm: HashAlgorithm = this.config.hashAlgorithm): Promise<string> {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(data);
      
      const hashBuffer = await window.crypto.subtle.digest(algorithm, dataBuffer);
      return this.arrayBufferToHex(hashBuffer);
    } else {
      // Fallback for server-side or unsupported environments
      return btoa(data); // Simple base64 encoding as fallback
    }
  }

  /**
   * Verify hash
   */
  public async verifyHash(data: string, hash: string, algorithm: HashAlgorithm = this.config.hashAlgorithm): Promise<boolean> {
    const computedHash = await this.hashData(data, algorithm);
    return computedHash === hash;
  }

  // ============================================================================
  // Audit Logging
  // ============================================================================

  /**
   * Log security event
   */
  public logSecurityEvent(
    action: string,
    resource: string,
    success: boolean,
    details: Record<string, any> = {},
    userId?: string,
    riskLevel: SecurityAuditLog['riskLevel'] = 'low'
  ): void {
    if (!this.config.enableAuditLogging) return;

    const auditLog: SecurityAuditLog = {
      id: this.generateId(),
      timestamp: new Date(),
      userId,
      sessionId: this.generateSessionId(),
      action,
      resource,
      ipAddress: this.getClientIP(),
      userAgent: this.getUserAgent(),
      success,
      riskLevel,
      details,
    };

    this.auditLogs.push(auditLog);
    this.securityMetrics.auditLogEntries++;

    // Record high-risk events
    if (riskLevel === 'high' || riskLevel === 'critical') {
      this.securityMetrics.suspiciousActivities++;
      
      performanceMonitoringService.recordMetric(
        'security.suspicious_activity',
        'counter',
        1,
        { action, resource, riskLevel }
      );
    }

    // Clean up old logs (keep last 10000 entries)
    if (this.auditLogs.length > 10000) {
      this.auditLogs = this.auditLogs.slice(-10000);
    }
  }

  /**
   * Get audit logs
   */
  public getAuditLogs(filters: {
    userId?: string;
    action?: string;
    resource?: string;
    riskLevel?: SecurityAuditLog['riskLevel'];
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  } = {}): SecurityAuditLog[] {
    let logs = [...this.auditLogs];

    // Apply filters
    if (filters.userId) {
      logs = logs.filter(log => log.userId === filters.userId);
    }

    if (filters.action) {
      logs = logs.filter(log => log.action.includes(filters.action));
    }

    if (filters.resource) {
      logs = logs.filter(log => log.resource.includes(filters.resource));
    }

    if (filters.riskLevel) {
      logs = logs.filter(log => log.riskLevel === filters.riskLevel);
    }

    if (filters.startDate) {
      logs = logs.filter(log => log.timestamp >= filters.startDate!);
    }

    if (filters.endDate) {
      logs = logs.filter(log => log.timestamp <= filters.endDate!);
    }

    // Sort by timestamp (newest first)
    logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    // Apply limit
    if (filters.limit) {
      logs = logs.slice(0, filters.limit);
    }

    return logs;
  }

  // ============================================================================
  // Privacy and GDPR Compliance
  // ============================================================================

  /**
   * Set user privacy settings
   */
  public setPrivacySettings(userId: string, settings: Partial<Omit<PrivacySettings, 'userId' | 'consentTimestamp' | 'lastUpdated'>>): PrivacySettings {
    const existingSettings = this.privacySettings.get(userId);
    
    const privacySettings: PrivacySettings = {
      userId,
      dataRetentionDays: settings.dataRetentionDays ?? 365,
      allowAnalytics: settings.allowAnalytics ?? true,
      allowPersonalization: settings.allowPersonalization ?? true,
      allowSharing: settings.allowSharing ?? false,
      allowCookies: settings.allowCookies ?? true,
      allowThirdPartyIntegrations: settings.allowThirdPartyIntegrations ?? false,
      dataExportRequested: settings.dataExportRequested ?? false,
      dataDeletionRequested: settings.dataDeletionRequested ?? false,
      consentTimestamp: existingSettings?.consentTimestamp ?? new Date(),
      lastUpdated: new Date(),
    };

    this.privacySettings.set(userId, privacySettings);

    // Log privacy settings change
    this.logSecurityEvent(
      'privacy_settings_updated',
      `user:${userId}`,
      true,
      { settings },
      userId,
      'low'
    );

    return privacySettings;
  }

  /**
   * Get user privacy settings
   */
  public getPrivacySettings(userId: string): PrivacySettings | null {
    return this.privacySettings.get(userId) || null;
  }

  /**
   * Create GDPR request
   */
  public createGDPRRequest(
    userId: string,
    type: GDPRRequest['type'],
    details: string
  ): GDPRRequest {
    const request: GDPRRequest = {
      id: this.generateId(),
      userId,
      type,
      status: 'pending',
      requestedAt: new Date(),
      details,
    };

    this.gdprRequests.set(request.id, request);
    this.securityMetrics.gdprRequests++;

    // Log GDPR request
    this.logSecurityEvent(
      'gdpr_request_created',
      `user:${userId}`,
      true,
      { requestType: type, requestId: request.id },
      userId,
      'medium'
    );

    return request;
  }

  /**
   * Process GDPR request
   */
  public processGDPRRequest(requestId: string, response?: string, attachments?: string[]): GDPRRequest {
    const request = this.gdprRequests.get(requestId);
    if (!request) {
      throw new Error(`GDPR request ${requestId} not found`);
    }

    request.status = 'processing';
    request.processedAt = new Date();
    request.response = response;
    request.attachments = attachments;

    this.gdprRequests.set(requestId, request);

    // Log GDPR request processing
    this.logSecurityEvent(
      'gdpr_request_processed',
      `user:${request.userId}`,
      true,
      { requestType: request.type, requestId },
      request.userId,
      'medium'
    );

    return request;
  }

  /**
   * Complete GDPR request
   */
  public completeGDPRRequest(requestId: string): GDPRRequest {
    const request = this.gdprRequests.get(requestId);
    if (!request) {
      throw new Error(`GDPR request ${requestId} not found`);
    }

    request.status = 'completed';
    request.completedAt = new Date();

    this.gdprRequests.set(requestId, request);

    // Log GDPR request completion
    this.logSecurityEvent(
      'gdpr_request_completed',
      `user:${request.userId}`,
      true,
      { requestType: request.type, requestId },
      request.userId,
      'medium'
    );

    return request;
  }

  /**
   * Get GDPR requests
   */
  public getGDPRRequests(userId?: string): GDPRRequest[] {
    let requests = Array.from(this.gdprRequests.values());

    if (userId) {
      requests = requests.filter(request => request.userId === userId);
    }

    return requests.sort((a, b) => b.requestedAt.getTime() - a.requestedAt.getTime());
  }

  // ============================================================================
  // Data Masking and Anonymization
  // ============================================================================

  /**
   * Mask sensitive data
   */
  public maskData(data: string, type: 'email' | 'phone' | 'ip' | 'custom' = 'custom', maskChar: string = '*'): string {
    if (!this.config.enableDataMasking) return data;

    switch (type) {
      case 'email':
        return data.replace(/(.{2})(.*)(@.*)/, `$1${maskChar.repeat(4)}$3`);
      case 'phone':
        return data.replace(/(\d{3})(\d{3})(\d{4})/, `$1-${maskChar.repeat(3)}-$3`);
      case 'ip':
        return data.replace(/(\d+\.\d+\.)(\d+\.\d+)/, `$1${maskChar.repeat(7)}`);
      default:
        const visibleChars = Math.min(2, Math.floor(data.length * 0.3));
        const maskedLength = data.length - visibleChars * 2;
        return data.substring(0, visibleChars) + 
               maskChar.repeat(Math.max(0, maskedLength)) + 
               data.substring(data.length - visibleChars);
    }
  }

  /**
   * Anonymize user data
   */
  public anonymizeUserData(userData: Record<string, any>): Record<string, any> {
    const anonymized = { ...userData };

    // Remove or mask PII fields
    const piiFields = ['email', 'phone', 'address', 'name', 'ssn', 'creditCard'];
    
    piiFields.forEach(field => {
      if (anonymized[field]) {
        if (field === 'email') {
          anonymized[field] = this.maskData(anonymized[field], 'email');
        } else if (field === 'phone') {
          anonymized[field] = this.maskData(anonymized[field], 'phone');
        } else {
          anonymized[field] = this.maskData(anonymized[field]);
        }
      }
    });

    // Replace user ID with anonymous ID
    if (anonymized.userId) {
      anonymized.anonymousId = this.generateAnonymousId(anonymized.userId);
      delete anonymized.userId;
    }

    return anonymized;
  }

  // ============================================================================
  // Security Metrics and Monitoring
  // ============================================================================

  /**
   * Get security metrics
   */
  public getSecurityMetrics(): SecurityMetrics {
    // Calculate security score
    const totalEvents = this.securityMetrics.totalRequests || 1;
    const successRate = 1 - (this.securityMetrics.blockedRequests / totalEvents);
    const threatLevel = this.securityMetrics.suspiciousActivities / totalEvents;
    
    this.securityMetrics.securityScore = Math.max(0, Math.min(100, 
      (successRate * 0.4 + (1 - threatLevel) * 0.6) * 100
    ));

    return { ...this.securityMetrics };
  }

  /**
   * Reset security metrics
   */
  public resetSecurityMetrics(): void {
    this.securityMetrics = {
      totalRequests: 0,
      blockedRequests: 0,
      failedLogins: 0,
      suspiciousActivities: 0,
      encryptedDataSize: 0,
      auditLogEntries: 0,
      gdprRequests: 0,
      averageResponseTime: 0,
      securityScore: 0,
    };
  }

  // ============================================================================
  // Helper Methods
  // ============================================================================

  /**
   * Initialize data protection policies
   */
  private initializeDataProtectionPolicies(): void {
    this.dataProtectionPolicies = new Map([
      ['public', {
        classification: 'public',
        encryptionRequired: false,
        retentionDays: 365,
        accessControls: ['read'],
        auditRequired: false,
        anonymizationRequired: false,
        geographicRestrictions: [],
      }],
      ['internal', {
        classification: 'internal',
        encryptionRequired: true,
        retentionDays: 180,
        accessControls: ['read', 'write'],
        auditRequired: true,
        anonymizationRequired: false,
        geographicRestrictions: [],
      }],
      ['confidential', {
        classification: 'confidential',
        encryptionRequired: true,
        retentionDays: 90,
        accessControls: ['read'],
        auditRequired: true,
        anonymizationRequired: true,
        geographicRestrictions: ['EU', 'US'],
      }],
      ['restricted', {
        classification: 'restricted',
        encryptionRequired: true,
        retentionDays: 30,
        accessControls: [],
        auditRequired: true,
        anonymizationRequired: true,
        geographicRestrictions: ['EU'],
      }],
    ]);
  }

  /**
   * Initialize encryption keys
   */
  private async initializeEncryptionKeys(): Promise<void> {
    try {
      // Generate default encryption key
      await this.generateEncryptionKey();
    } catch (error) {
      console.warn('Failed to initialize encryption keys:', error);
    }
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  /**
   * Generate session ID
   */
  private generateSessionId(): string {
    return 'session_' + this.generateId();
  }

  /**
   * Generate anonymous ID
   */
  private generateAnonymousId(userId: string): string {
    return 'anon_' + btoa(userId).replace(/[^a-zA-Z0-9]/g, '').substring(0, 8);
  }

  /**
   * Get client IP address
   */
  private getClientIP(): string {
    // In a real implementation, this would extract the IP from request headers
    return '127.0.0.1';
  }

  /**
   * Get user agent
   */
  private getUserAgent(): string {
    return typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown';
  }

  /**
   * Convert ArrayBuffer to Base64
   */
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  /**
   * Convert Base64 to ArrayBuffer
   */
  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }

  /**
   * Convert ArrayBuffer to Hex
   */
  private arrayBufferToHex(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    return Array.from(bytes)
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('');
  }
}

// ============================================================================
// Service Instance
// ============================================================================

export const securityService = new SecurityService();
