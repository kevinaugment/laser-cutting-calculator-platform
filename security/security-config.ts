/**
 * Security Configuration for Laser Cutting Calculator
 * Comprehensive security settings and utilities
 */

// Content Security Policy configuration
export const CSP_CONFIG = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'", // Required for Vite in development
    "'unsafe-eval'", // Required for development tools
    'https://www.googletagmanager.com',
    'https://www.google-analytics.com',
    'https://cdn.jsdelivr.net',
  ],
  'style-src': [
    "'self'",
    "'unsafe-inline'", // Required for CSS-in-JS and dynamic styles
    'https://fonts.googleapis.com',
    'https://cdn.jsdelivr.net',
  ],
  'font-src': [
    "'self'",
    'https://fonts.gstatic.com',
    'data:',
  ],
  'img-src': [
    "'self'",
    'data:',
    'blob:',
    'https:',
    'https://www.google-analytics.com',
  ],
  'connect-src': [
    "'self'",
    'https://api.lasercalc.com',
    'https://www.google-analytics.com',
    'https://vitals.vercel-analytics.com',
    'wss:', // WebSocket connections
  ],
  'media-src': ["'self'", 'data:', 'blob:'],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'none'"],
  'upgrade-insecure-requests': [],
  'block-all-mixed-content': [],
};

// Security Headers configuration
export const SECURITY_HEADERS = {
  // Prevent clickjacking
  'X-Frame-Options': 'DENY',
  
  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',
  
  // XSS protection
  'X-XSS-Protection': '1; mode=block',
  
  // Referrer policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // Permissions policy (formerly Feature Policy)
  'Permissions-Policy': [
    'camera=()',
    'microphone=()',
    'geolocation=()',
    'payment=()',
    'usb=()',
    'magnetometer=()',
    'gyroscope=()',
    'accelerometer=()',
  ].join(', '),
  
  // HSTS (HTTP Strict Transport Security)
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  
  // Cross-Origin policies
  'Cross-Origin-Embedder-Policy': 'require-corp',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
};

// Rate limiting configuration
export const RATE_LIMIT_CONFIG = {
  // General API rate limiting
  api: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Limit each IP to 1000 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  },
  
  // Authentication endpoints
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login attempts per windowMs
    message: 'Too many login attempts, please try again later.',
    skipSuccessfulRequests: true,
  },
  
  // Calculator endpoints
  calculator: {
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 100, // Limit each IP to 100 calculations per minute
    message: 'Too many calculations, please slow down.',
  },
  
  // File upload endpoints
  upload: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // Limit each IP to 10 uploads per hour
    message: 'Upload limit exceeded, please try again later.',
  },
};

// Input validation patterns
export const VALIDATION_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  username: /^[a-zA-Z0-9_]{3,20}$/,
  phone: /^\+?[\d\s\-\(\)]{10,}$/,
  url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  
  // Calculator-specific patterns
  number: /^-?\d*\.?\d+$/,
  positiveNumber: /^\d*\.?\d+$/,
  integer: /^-?\d+$/,
  positiveInteger: /^\d+$/,
  percentage: /^(100(\.0+)?|[0-9]?[0-9](\.[0-9]+)?)$/,
  
  // Material and measurement patterns
  materialThickness: /^(0\.[0-9]+|[1-9][0-9]*(\.[0-9]+)?)$/,
  laserPower: /^[1-9][0-9]*$/,
  cuttingSpeed: /^[1-9][0-9]*(\.[0-9]+)?$/,
};

// Sanitization utilities
export class SecurityUtils {
  /**
   * Sanitize HTML input to prevent XSS
   */
  static sanitizeHTML(input: string): string {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  }

  /**
   * Sanitize SQL input to prevent SQL injection
   */
  static sanitizeSQL(input: string): string {
    return input.replace(/['";\\]/g, '');
  }

  /**
   * Validate and sanitize email
   */
  static sanitizeEmail(email: string): string | null {
    const sanitized = email.trim().toLowerCase();
    return VALIDATION_PATTERNS.email.test(sanitized) ? sanitized : null;
  }

  /**
   * Validate password strength
   */
  static validatePassword(password: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/[@$!%*?&]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Generate secure random token
   */
  static generateSecureToken(length: number = 32): string {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Hash sensitive data (client-side hashing for additional security)
   */
  static async hashData(data: string): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Validate calculator input
   */
  static validateCalculatorInput(
    value: string,
    type: 'number' | 'positiveNumber' | 'integer' | 'positiveInteger' | 'percentage',
    min?: number,
    max?: number
  ): { isValid: boolean; error?: string } {
    const pattern = VALIDATION_PATTERNS[type];
    
    if (!pattern.test(value)) {
      return {
        isValid: false,
        error: `Invalid ${type} format`,
      };
    }
    
    const numValue = parseFloat(value);
    
    if (min !== undefined && numValue < min) {
      return {
        isValid: false,
        error: `Value must be at least ${min}`,
      };
    }
    
    if (max !== undefined && numValue > max) {
      return {
        isValid: false,
        error: `Value must be at most ${max}`,
      };
    }
    
    return { isValid: true };
  }

  /**
   * Detect and prevent common attack patterns
   */
  static detectAttackPatterns(input: string): {
    isSuspicious: boolean;
    patterns: string[];
  } {
    const attackPatterns = [
      // XSS patterns
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      
      // SQL injection patterns
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/gi,
      /(\b(OR|AND)\s+\d+\s*=\s*\d+)/gi,
      /('|(\\')|(;)|(--)|(\|)|(\*)|(%27)|(%3D)|(%3B)|(%22)|(%2A)|(%7C))/gi,
      
      // Path traversal
      /\.\.\//gi,
      /\.\.\\/gi,
      
      // Command injection
      /(\b(eval|exec|system|shell_exec|passthru|file_get_contents)\b)/gi,
      /(\||&|;|\$\(|\`)/gi,
    ];
    
    const detectedPatterns: string[] = [];
    
    attackPatterns.forEach((pattern, index) => {
      if (pattern.test(input)) {
        detectedPatterns.push(`Pattern ${index + 1}`);
      }
    });
    
    return {
      isSuspicious: detectedPatterns.length > 0,
      patterns: detectedPatterns,
    };
  }

  /**
   * Generate Content Security Policy header value
   */
  static generateCSPHeader(): string {
    return Object.entries(CSP_CONFIG)
      .map(([directive, sources]) => {
        if (sources.length === 0) {
          return directive;
        }
        return `${directive} ${sources.join(' ')}`;
      })
      .join('; ');
  }

  /**
   * Validate file upload security
   */
  static validateFileUpload(file: File): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/svg+xml',
      'application/pdf',
      'text/plain',
      'text/csv',
    ];
    
    // Check file size
    if (file.size > maxSize) {
      errors.push('File size exceeds 10MB limit');
    }
    
    // Check file type
    if (!allowedTypes.includes(file.type)) {
      errors.push('File type not allowed');
    }
    
    // Check file name for suspicious patterns
    const suspiciousExtensions = /\.(exe|bat|cmd|com|pif|scr|vbs|js|jar|php|asp|jsp)$/i;
    if (suspiciousExtensions.test(file.name)) {
      errors.push('Suspicious file extension detected');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Mask sensitive data for logging
   */
  static maskSensitiveData(data: any): any {
    const sensitiveFields = ['password', 'token', 'secret', 'key', 'auth', 'credential'];
    
    if (typeof data === 'string') {
      return data.replace(/./g, '*');
    }
    
    if (typeof data === 'object' && data !== null) {
      const masked = { ...data };
      
      Object.keys(masked).forEach(key => {
        const lowerKey = key.toLowerCase();
        if (sensitiveFields.some(field => lowerKey.includes(field))) {
          masked[key] = '***MASKED***';
        } else if (typeof masked[key] === 'object') {
          masked[key] = SecurityUtils.maskSensitiveData(masked[key]);
        }
      });
      
      return masked;
    }
    
    return data;
  }
}

// CSRF token management
export class CSRFTokenManager {
  private static token: string | null = null;
  
  static generateToken(): string {
    this.token = SecurityUtils.generateSecureToken();
    return this.token;
  }
  
  static getToken(): string | null {
    return this.token;
  }
  
  static validateToken(token: string): boolean {
    return this.token === token;
  }
  
  static clearToken(): void {
    this.token = null;
  }
}

// Security event logging
export class SecurityLogger {
  static logSecurityEvent(
    event: string,
    details: Record<string, any>,
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'
  ): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      severity,
      details: SecurityUtils.maskSensitiveData(details),
      userAgent: navigator.userAgent,
      url: window.location.href,
      ip: 'client-side', // Would be filled by server
    };
    
    // In production, this would send to a security logging service
    console.warn('Security Event:', logEntry);
    
    // Send to monitoring service
    if (typeof fetch !== 'undefined') {
      fetch('/api/security-events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logEntry),
      }).catch(error => {
        console.error('Failed to log security event:', error);
      });
    }
  }
}

export default SecurityUtils;
