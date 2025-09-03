/**
 * Security Service Tests
 * Comprehensive test suite for security hardening and privacy protection functionality
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { SecurityService, securityService } from '../../services/securityService';

// Mock Web Crypto API
const mockCrypto = {
  subtle: {
    generateKey: vi.fn(),
    encrypt: vi.fn(),
    decrypt: vi.fn(),
    digest: vi.fn(),
  },
  getRandomValues: vi.fn((array) => {
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
    return array;
  }),
};

// Mock performance
const mockPerformance = {
  now: vi.fn(() => Date.now()),
};

describe('SecurityService', () => {
  let service: SecurityService;

  beforeEach(() => {
    // Setup global mocks
    global.window = {
      crypto: mockCrypto,
    } as any;
    global.performance = mockPerformance as any;
    global.btoa = vi.fn((str) => Buffer.from(str).toString('base64'));
    global.atob = vi.fn((str) => Buffer.from(str, 'base64').toString());

    // Reset mocks
    vi.clearAllMocks();

    service = new SecurityService({
      encryptionAlgorithm: 'AES-256-GCM',
      hashAlgorithm: 'SHA-256',
      securityLevel: 'standard',
      enableE2EEncryption: true,
      enableDataMasking: true,
      enableAuditLogging: true,
      enableGDPRCompliance: true,
      sessionTimeout: 30 * 60 * 1000,
      maxLoginAttempts: 5,
      passwordMinLength: 12,
      requireMFA: false,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('initialization', () => {
    it('should initialize with default config', () => {
      const defaultService = new SecurityService();
      expect(defaultService).toBeDefined();
    });

    it('should initialize with custom config', () => {
      const customService = new SecurityService({
        encryptionAlgorithm: 'AES-128-GCM',
        enableAuditLogging: false,
      });
      expect(customService).toBeDefined();
    });

    it('should initialize security metrics with zero values', () => {
      const metrics = service.getSecurityMetrics();
      expect(metrics.totalRequests).toBe(0);
      expect(metrics.blockedRequests).toBe(0);
      expect(metrics.failedLogins).toBe(0);
      expect(metrics.suspiciousActivities).toBe(0);
    });
  });

  describe('encryption and decryption', () => {
    beforeEach(() => {
      // Mock crypto operations
      mockCrypto.subtle.generateKey.mockResolvedValue({
        type: 'secret',
        algorithm: { name: 'AES-GCM', length: 256 },
      });
      mockCrypto.subtle.encrypt.mockResolvedValue(new ArrayBuffer(32));
      mockCrypto.subtle.decrypt.mockResolvedValue(new TextEncoder().encode('decrypted data'));
    });

    it('should generate encryption key', async () => {
      const key = await service.generateEncryptionKey();
      
      expect(key).toBeDefined();
      expect(key.id).toBeDefined();
      expect(key.algorithm).toBe('AES-256-GCM');
      expect(key.createdAt).toBeInstanceOf(Date);
      expect(key.usage).toContain('encrypt');
      expect(key.usage).toContain('decrypt');
    });

    it('should encrypt data', async () => {
      const testData = 'sensitive information';
      
      const result = await service.encryptData(testData);
      
      expect(result).toBeDefined();
      expect(result.encryptedData).toBeDefined();
      expect(result.keyId).toBeDefined();
      expect(result.iv).toBeDefined();
      expect(mockCrypto.subtle.encrypt).toHaveBeenCalled();
    });

    it('should decrypt data', async () => {
      const testData = 'sensitive information';
      
      // First encrypt
      const encrypted = await service.encryptData(testData);
      
      // Then decrypt
      const decrypted = await service.decryptData(encrypted.encryptedData, encrypted.keyId, encrypted.iv);
      
      expect(decrypted).toBe('decrypted data'); // Mocked return value
      expect(mockCrypto.subtle.decrypt).toHaveBeenCalled();
    });

    it('should handle encryption without Web Crypto API', async () => {
      // Remove crypto mock
      delete (global as any).window;
      
      const fallbackService = new SecurityService();
      const testData = 'test data';
      
      const result = await fallbackService.encryptData(testData);
      
      expect(result.encryptedData).toBeDefined();
      expect(result.keyId).toBeDefined();
      expect(result.iv).toBeDefined();
    });

    it('should handle decryption without Web Crypto API', async () => {
      // Remove crypto mock
      delete (global as any).window;
      
      const fallbackService = new SecurityService();
      const testData = 'test data';
      
      const encrypted = await fallbackService.encryptData(testData);
      const decrypted = await fallbackService.decryptData(encrypted.encryptedData, encrypted.keyId, encrypted.iv);
      
      expect(decrypted).toBe(testData);
    });

    it('should fail to decrypt with invalid key', async () => {
      const testData = 'sensitive information';
      const encrypted = await service.encryptData(testData);
      
      await expect(service.decryptData(encrypted.encryptedData, 'invalid-key', encrypted.iv))
        .rejects.toThrow('Encryption key invalid-key not found');
    });
  });

  describe('data hashing and verification', () => {
    beforeEach(() => {
      mockCrypto.subtle.digest.mockResolvedValue(new ArrayBuffer(32));
    });

    it('should hash data', async () => {
      const testData = 'data to hash';

      const hash = await service.hashData(testData);

      expect(hash).toBeDefined();
      expect(typeof hash).toBe('string');
      expect(mockCrypto.subtle.digest).toHaveBeenCalledWith('SHA-256', expect.any(Object));
    });

    it('should verify hash', async () => {
      const testData = 'data to hash';
      const hash = await service.hashData(testData);
      
      const isValid = await service.verifyHash(testData, hash);
      
      expect(isValid).toBe(true);
    });

    it('should fail hash verification with wrong data', async () => {
      const testData = 'data to hash';
      const wrongData = 'wrong data';

      // Mock different hash results for different data
      let callCount = 0;
      mockCrypto.subtle.digest.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return Promise.resolve(new ArrayBuffer(32)); // First hash
        } else {
          return Promise.resolve(new ArrayBuffer(16)); // Different hash for wrong data
        }
      });

      const hash = await service.hashData(testData);
      const isValid = await service.verifyHash(wrongData, hash);

      expect(isValid).toBe(false);
    });

    it('should handle hashing without Web Crypto API', async () => {
      delete (global as any).window;
      
      const fallbackService = new SecurityService();
      const testData = 'test data';
      
      const hash = await fallbackService.hashData(testData);
      
      expect(hash).toBeDefined();
      expect(typeof hash).toBe('string');
    });
  });

  describe('audit logging', () => {
    it('should log security event', () => {
      service.logSecurityEvent('login', 'user:123', true, { ip: '192.168.1.1' }, 'user123');
      
      const logs = service.getAuditLogs();
      expect(logs).toHaveLength(1);
      
      const log = logs[0];
      expect(log.action).toBe('login');
      expect(log.resource).toBe('user:123');
      expect(log.success).toBe(true);
      expect(log.userId).toBe('user123');
      expect(log.details.ip).toBe('192.168.1.1');
    });

    it('should not log when audit logging is disabled', () => {
      const serviceWithoutLogging = new SecurityService({ enableAuditLogging: false });
      
      serviceWithoutLogging.logSecurityEvent('login', 'user:123', true);
      
      const logs = serviceWithoutLogging.getAuditLogs();
      expect(logs).toHaveLength(0);
    });

    it('should filter audit logs', () => {
      // Add multiple logs
      service.logSecurityEvent('login', 'user:123', true, {}, 'user123');
      service.logSecurityEvent('logout', 'user:123', true, {}, 'user123');
      service.logSecurityEvent('login', 'user:456', false, {}, 'user456');
      
      // Filter by user
      const userLogs = service.getAuditLogs({ userId: 'user123' });
      expect(userLogs).toHaveLength(2);
      
      // Filter by action
      const loginLogs = service.getAuditLogs({ action: 'login' });
      expect(loginLogs).toHaveLength(2);
      
      // Filter by success
      const failedLogs = service.getAuditLogs().filter(log => !log.success);
      expect(failedLogs).toHaveLength(1);
    });

    it('should limit audit logs to prevent memory issues', () => {
      // Add more than 10000 logs
      for (let i = 0; i < 10005; i++) {
        service.logSecurityEvent(`action${i}`, `resource${i}`, true);
      }
      
      const logs = service.getAuditLogs();
      expect(logs.length).toBeLessThanOrEqual(10000);
    });

    it('should track suspicious activities', () => {
      service.logSecurityEvent('failed_login', 'user:123', false, {}, 'user123', 'high');
      
      const metrics = service.getSecurityMetrics();
      expect(metrics.suspiciousActivities).toBe(1);
    });
  });

  describe('privacy and GDPR compliance', () => {
    it('should set privacy settings', () => {
      const settings = service.setPrivacySettings('user123', {
        allowAnalytics: false,
        allowSharing: false,
        dataRetentionDays: 30,
      });
      
      expect(settings.userId).toBe('user123');
      expect(settings.allowAnalytics).toBe(false);
      expect(settings.allowSharing).toBe(false);
      expect(settings.dataRetentionDays).toBe(30);
      expect(settings.consentTimestamp).toBeInstanceOf(Date);
    });

    it('should get privacy settings', () => {
      service.setPrivacySettings('user123', { allowAnalytics: false });
      
      const settings = service.getPrivacySettings('user123');
      
      expect(settings).toBeDefined();
      expect(settings?.userId).toBe('user123');
      expect(settings?.allowAnalytics).toBe(false);
    });

    it('should return null for non-existent privacy settings', () => {
      const settings = service.getPrivacySettings('nonexistent');
      expect(settings).toBeNull();
    });

    it('should create GDPR request', () => {
      const request = service.createGDPRRequest('user123', 'access', 'I want to access my data');
      
      expect(request.id).toBeDefined();
      expect(request.userId).toBe('user123');
      expect(request.type).toBe('access');
      expect(request.status).toBe('pending');
      expect(request.details).toBe('I want to access my data');
      expect(request.requestedAt).toBeInstanceOf(Date);
    });

    it('should process GDPR request', () => {
      const request = service.createGDPRRequest('user123', 'access', 'Data access request');
      
      const processedRequest = service.processGDPRRequest(request.id, 'Processing your request');
      
      expect(processedRequest.status).toBe('processing');
      expect(processedRequest.processedAt).toBeInstanceOf(Date);
      expect(processedRequest.response).toBe('Processing your request');
    });

    it('should complete GDPR request', () => {
      const request = service.createGDPRRequest('user123', 'access', 'Data access request');
      service.processGDPRRequest(request.id, 'Processing your request');
      
      const completedRequest = service.completeGDPRRequest(request.id);
      
      expect(completedRequest.status).toBe('completed');
      expect(completedRequest.completedAt).toBeInstanceOf(Date);
    });

    it('should fail to process non-existent GDPR request', () => {
      expect(() => service.processGDPRRequest('nonexistent', 'response'))
        .toThrow('GDPR request nonexistent not found');
    });

    it('should get GDPR requests', () => {
      service.createGDPRRequest('user123', 'access', 'Request 1');
      service.createGDPRRequest('user456', 'erasure', 'Request 2');
      service.createGDPRRequest('user123', 'portability', 'Request 3');
      
      // Get all requests
      const allRequests = service.getGDPRRequests();
      expect(allRequests).toHaveLength(3);
      
      // Get requests for specific user
      const userRequests = service.getGDPRRequests('user123');
      expect(userRequests).toHaveLength(2);
    });
  });

  describe('data masking and anonymization', () => {
    it('should mask email addresses', () => {
      const email = 'user@example.com';
      const masked = service.maskData(email, 'email');
      
      expect(masked).toBe('us****@example.com');
    });

    it('should mask phone numbers', () => {
      const phone = '1234567890';
      const masked = service.maskData(phone, 'phone');
      
      expect(masked).toBe('123-***-7890');
    });

    it('should mask IP addresses', () => {
      const ip = '192.168.1.100';
      const masked = service.maskData(ip, 'ip');
      
      expect(masked).toBe('192.168.*******');
    });

    it('should mask custom data', () => {
      const data = 'sensitive data';
      const masked = service.maskData(data, 'custom');
      
      expect(masked).toContain('*');
      expect(masked.length).toBe(data.length);
    });

    it('should not mask data when masking is disabled', () => {
      const serviceWithoutMasking = new SecurityService({ enableDataMasking: false });
      const data = 'sensitive data';
      
      const result = serviceWithoutMasking.maskData(data, 'email');
      
      expect(result).toBe(data);
    });

    it('should anonymize user data', () => {
      const userData = {
        userId: 'user123',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        address: '123 Main St',
        publicData: 'This is public',
      };
      
      const anonymized = service.anonymizeUserData(userData);
      
      expect(anonymized.anonymousId).toBeDefined();
      expect(anonymized.userId).toBeUndefined();
      expect(anonymized.name).toContain('*');
      expect(anonymized.email).toContain('*');
      expect(anonymized.phone).toContain('*');
      expect(anonymized.address).toContain('*');
      expect(anonymized.publicData).toBe('This is public');
    });
  });

  describe('security metrics and monitoring', () => {
    it('should calculate security score', () => {
      // Add some security events
      service.logSecurityEvent('login', 'user:123', true);
      service.logSecurityEvent('login', 'user:456', true);
      service.logSecurityEvent('login', 'user:789', false, {}, undefined, 'high');
      
      const metrics = service.getSecurityMetrics();
      
      expect(metrics.securityScore).toBeGreaterThan(0);
      expect(metrics.securityScore).toBeLessThanOrEqual(100);
    });

    it('should reset security metrics', () => {
      // Add some data
      service.logSecurityEvent('login', 'user:123', true);
      
      let metrics = service.getSecurityMetrics();
      expect(metrics.auditLogEntries).toBeGreaterThan(0);
      
      // Reset metrics
      service.resetSecurityMetrics();
      
      metrics = service.getSecurityMetrics();
      expect(metrics.totalRequests).toBe(0);
      expect(metrics.blockedRequests).toBe(0);
      expect(metrics.auditLogEntries).toBe(0);
    });

    it('should return metrics copy', () => {
      const metrics1 = service.getSecurityMetrics();
      const metrics2 = service.getSecurityMetrics();
      
      expect(metrics1).not.toBe(metrics2); // Different objects
      expect(metrics1).toEqual(metrics2); // Same content
    });
  });

  describe('error handling', () => {
    it('should handle encryption errors gracefully', async () => {
      mockCrypto.subtle.encrypt.mockRejectedValue(new Error('Encryption failed'));
      
      await expect(service.encryptData('test data')).rejects.toThrow('Encryption failed');
    });

    it('should handle decryption errors gracefully', async () => {
      // First allow encryption to succeed
      mockCrypto.subtle.encrypt.mockResolvedValue(new ArrayBuffer(32));

      const encrypted = await service.encryptData('test data');

      // Then make decryption fail
      mockCrypto.subtle.decrypt.mockRejectedValue(new Error('Decryption failed'));

      await expect(service.decryptData(encrypted.encryptedData, encrypted.keyId, encrypted.iv))
        .rejects.toThrow('Decryption failed');
    });

    it('should handle hashing errors gracefully', async () => {
      mockCrypto.subtle.digest.mockRejectedValue(new Error('Hashing failed'));
      
      await expect(service.hashData('test data')).rejects.toThrow('Hashing failed');
    });

    it('should handle missing crypto API gracefully', async () => {
      delete (global as any).window;
      
      const fallbackService = new SecurityService();
      
      // Should not throw errors
      await expect(fallbackService.encryptData('test')).resolves.toBeDefined();
      await expect(fallbackService.hashData('test')).resolves.toBeDefined();
    });
  });
});
