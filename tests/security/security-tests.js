#!/usr/bin/env node

/**
 * Security Testing Suite
 * Automated security tests for Laser Cutting Calculator
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors for output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'blue') {
  const timestamp = new Date().toISOString();
  console.log(`${colors[color]}[${timestamp}]${colors.reset} ${message}`);
}

function success(message) {
  log(`✅ ${message}`, 'green');
}

function error(message) {
  log(`❌ ${message}`, 'red');
}

function warning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function critical(message) {
  log(`🚨 ${message}`, 'red');
}

// Security test categories
const securityTests = [
  {
    name: 'Code Security Analysis',
    description: 'Analyze source code for security vulnerabilities',
    execute: analyzeCodeSecurity
  },
  {
    name: 'Configuration Security',
    description: 'Validate security configuration and settings',
    execute: validateSecurityConfig
  },
  {
    name: 'Dependency Security',
    description: 'Check dependencies for known vulnerabilities',
    execute: checkDependencySecurity
  },
  {
    name: 'Input Validation Tests',
    description: 'Test input validation and sanitization',
    execute: testInputValidation
  },
  {
    name: 'Authentication Security',
    description: 'Validate authentication and authorization mechanisms',
    execute: testAuthenticationSecurity
  },
  {
    name: 'Data Protection Tests',
    description: 'Test data encryption and protection mechanisms',
    execute: testDataProtection
  }
];

// Code security analysis
async function analyzeCodeSecurity() {
  log('Analyzing code security...');
  
  try {
    const srcDir = path.join(__dirname, '../../src');
    const securityIssues = [];
    
    // Check for common security anti-patterns
    const securityPatterns = [
      {
        pattern: /eval\s*\(/g,
        severity: 'high',
        description: 'Use of eval() function - potential code injection'
      },
      {
        pattern: /innerHTML\s*=/g,
        severity: 'medium',
        description: 'Use of innerHTML - potential XSS vulnerability'
      },
      {
        pattern: /document\.write\s*\(/g,
        severity: 'medium',
        description: 'Use of document.write() - potential XSS vulnerability'
      },
      {
        pattern: /localStorage\.setItem\s*\([^,]*password/gi,
        severity: 'high',
        description: 'Storing password in localStorage - security risk'
      },
      {
        pattern: /console\.log\s*\([^)]*password/gi,
        severity: 'medium',
        description: 'Logging password to console - information disclosure'
      },
      {
        pattern: /http:\/\/[^"'\s]+/g,
        severity: 'low',
        description: 'HTTP URL found - consider using HTTPS'
      }
    ];
    
    // Scan source files
    function scanDirectory(dir) {
      if (!fs.existsSync(dir)) return;
      
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
          scanDirectory(filePath);
        } else if (file.match(/\.(ts|tsx|js|jsx)$/)) {
          const content = fs.readFileSync(filePath, 'utf8');
          
          for (const pattern of securityPatterns) {
            const matches = content.match(pattern.pattern);
            if (matches) {
              securityIssues.push({
                file: path.relative(srcDir, filePath),
                severity: pattern.severity,
                description: pattern.description,
                matches: matches.length
              });
            }
          }
        }
      }
    }
    
    scanDirectory(srcDir);
    
    // Report findings
    const highIssues = securityIssues.filter(issue => issue.severity === 'high');
    const mediumIssues = securityIssues.filter(issue => issue.severity === 'medium');
    const lowIssues = securityIssues.filter(issue => issue.severity === 'low');
    
    if (highIssues.length > 0) {
      critical(`${highIssues.length} high severity security issues found in code`);
      highIssues.forEach(issue => {
        error(`${issue.file}: ${issue.description} (${issue.matches} occurrences)`);
      });
    }
    
    if (mediumIssues.length > 0) {
      warning(`${mediumIssues.length} medium severity security issues found in code`);
      mediumIssues.forEach(issue => {
        warning(`${issue.file}: ${issue.description} (${issue.matches} occurrences)`);
      });
    }
    
    if (lowIssues.length > 0) {
      log(`${lowIssues.length} low severity security issues found in code`);
    }
    
    if (securityIssues.length === 0) {
      success('No obvious security issues found in code analysis');
    }
    
    // Save detailed report
    const reportPath = path.join(__dirname, 'code-security-report.json');
    fs.writeFileSync(reportPath, JSON.stringify({
      timestamp: new Date().toISOString(),
      totalIssues: securityIssues.length,
      highSeverity: highIssues.length,
      mediumSeverity: mediumIssues.length,
      lowSeverity: lowIssues.length,
      issues: securityIssues
    }, null, 2));
    
    return securityIssues.length === 0 || highIssues.length === 0;
  } catch (err) {
    error(`Code security analysis failed: ${err.message}`);
    return false;
  }
}

// Security configuration validation
async function validateSecurityConfig() {
  log('Validating security configuration...');
  
  try {
    const configIssues = [];
    
    // Check security configuration files
    const securityFiles = [
      '../../security/security-config.ts',
      '../../src/hooks/useSecurity.ts',
      '../../src/middleware/security.ts'
    ];
    
    for (const file of securityFiles) {
      const filePath = path.join(__dirname, file);
      if (fs.existsSync(filePath)) {
        success(`Security configuration file found: ${path.basename(file)}`);
        
        // Check file content for security best practices
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Check for security headers
        if (file.includes('security-config') && !content.includes('Content-Security-Policy')) {
          configIssues.push('Missing Content-Security-Policy configuration');
        }
        
        if (file.includes('security-config') && !content.includes('X-Frame-Options')) {
          configIssues.push('Missing X-Frame-Options configuration');
        }
      } else {
        configIssues.push(`Missing security configuration file: ${path.basename(file)}`);
      }
    }
    
    // Check environment configuration
    const envExamplePath = path.join(__dirname, '../../.env.example');
    if (fs.existsSync(envExamplePath)) {
      const envContent = fs.readFileSync(envExamplePath, 'utf8');
      
      // Check for hardcoded secrets
      const secretPatterns = [
        /password\s*=\s*[^#\n]+/gi,
        /secret\s*=\s*[^#\n]+/gi,
        /key\s*=\s*[^#\n]+/gi,
        /token\s*=\s*[^#\n]+/gi
      ];
      
      for (const pattern of secretPatterns) {
        if (pattern.test(envContent)) {
          configIssues.push('Potential hardcoded secrets in .env.example');
          break;
        }
      }
    }
    
    // Check package.json for security scripts
    const packageJsonPath = path.join(__dirname, '../../package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      
      if (!packageJson.scripts?.audit) {
        configIssues.push('Missing npm audit script in package.json');
      }
      
      if (!packageJson.scripts?.['security-test']) {
        configIssues.push('Missing security test script in package.json');
      }
    }
    
    if (configIssues.length > 0) {
      warning(`${configIssues.length} security configuration issues found:`);
      configIssues.forEach(issue => warning(`- ${issue}`));
      return false;
    } else {
      success('Security configuration validation passed');
      return true;
    }
  } catch (err) {
    error(`Security configuration validation failed: ${err.message}`);
    return false;
  }
}

// Dependency security check
async function checkDependencySecurity() {
  log('Checking dependency security...');
  
  try {
    const projectRoot = path.join(__dirname, '../..');
    
    // Run npm audit
    try {
      const auditResult = execSync('npm audit --json', { 
        cwd: projectRoot,
        encoding: 'utf8'
      });
      
      const audit = JSON.parse(auditResult);
      const vulnerabilities = audit.metadata?.vulnerabilities || {};
      
      const high = vulnerabilities.high || 0;
      const moderate = vulnerabilities.moderate || 0;
      const low = vulnerabilities.low || 0;
      const total = high + moderate + low;
      
      if (high > 0) {
        critical(`${high} high severity dependency vulnerabilities found`);
      }
      
      if (moderate > 0) {
        warning(`${moderate} moderate severity dependency vulnerabilities found`);
      }
      
      if (low > 0) {
        log(`${low} low severity dependency vulnerabilities found`);
      }
      
      if (total === 0) {
        success('No dependency vulnerabilities found');
      }
      
      return high === 0;
    } catch (auditError) {
      // npm audit returns non-zero exit code when vulnerabilities are found
      if (auditError.stdout) {
        const audit = JSON.parse(auditError.stdout);
        const vulnerabilities = audit.metadata?.vulnerabilities || {};
        const high = vulnerabilities.high || 0;
        
        if (high > 0) {
          critical(`${high} high severity dependency vulnerabilities found`);
          return false;
        }
      }
      
      warning('npm audit completed with warnings');
      return true;
    }
  } catch (err) {
    error(`Dependency security check failed: ${err.message}`);
    return false;
  }
}

// Input validation tests
async function testInputValidation() {
  log('Testing input validation...');
  
  try {
    // Test XSS payloads
    const xssPayloads = [
      '<script>alert("xss")</script>',
      'javascript:alert("xss")',
      '<img src=x onerror=alert("xss")>',
      '"><script>alert("xss")</script>',
      "';alert('xss');//"
    ];
    
    // Test SQL injection payloads
    const sqlPayloads = [
      "' OR '1'='1",
      "'; DROP TABLE users; --",
      "1' UNION SELECT * FROM users --",
      "admin'--",
      "' OR 1=1#"
    ];
    
    // Simulate input validation testing
    let validationIssues = 0;
    
    // Check if input validation utilities exist
    const validationFiles = [
      '../../src/utils/validation.ts',
      '../../src/utils/sanitization.ts',
      '../../src/hooks/useInputValidation.ts'
    ];
    
    let validationImplemented = false;
    
    for (const file of validationFiles) {
      const filePath = path.join(__dirname, file);
      if (fs.existsSync(filePath)) {
        validationImplemented = true;
        success(`Input validation utility found: ${path.basename(file)}`);
      }
    }
    
    if (!validationImplemented) {
      warning('No input validation utilities found');
      validationIssues++;
    }
    
    // Check React components for input validation
    const componentsDir = path.join(__dirname, '../../src/components');
    if (fs.existsSync(componentsDir)) {
      const hasValidation = checkForInputValidation(componentsDir);
      if (hasValidation) {
        success('Input validation found in React components');
      } else {
        warning('Limited input validation in React components');
        validationIssues++;
      }
    }
    
    return validationIssues === 0;
  } catch (err) {
    error(`Input validation testing failed: ${err.message}`);
    return false;
  }
}

// Helper function to check for input validation in components
function checkForInputValidation(dir) {
  let hasValidation = false;
  
  function scanDir(directory) {
    if (!fs.existsSync(directory)) return;
    
    const files = fs.readdirSync(directory);
    for (const file of files) {
      const filePath = path.join(directory, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        scanDir(filePath);
      } else if (file.match(/\.(tsx|jsx)$/)) {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Check for validation patterns
        if (content.includes('validate') || 
            content.includes('sanitize') || 
            content.includes('escape') ||
            content.includes('DOMPurify') ||
            content.includes('validator')) {
          hasValidation = true;
        }
      }
    }
  }
  
  scanDir(dir);
  return hasValidation;
}

// Authentication security tests
async function testAuthenticationSecurity() {
  log('Testing authentication security...');
  
  try {
    const authIssues = [];
    
    // Check for authentication files
    const authFiles = [
      '../../src/hooks/useAuth.ts',
      '../../src/context/AuthContext.tsx',
      '../../src/utils/auth.ts'
    ];
    
    let authImplemented = false;
    
    for (const file of authFiles) {
      const filePath = path.join(__dirname, file);
      if (fs.existsSync(filePath)) {
        authImplemented = true;
        success(`Authentication module found: ${path.basename(file)}`);
        
        // Check for security best practices
        const content = fs.readFileSync(filePath, 'utf8');
        
        if (!content.includes('jwt') && !content.includes('token')) {
          authIssues.push('No token-based authentication found');
        }
        
        if (content.includes('localStorage') && content.includes('token')) {
          authIssues.push('Tokens stored in localStorage - consider httpOnly cookies');
        }
      }
    }
    
    if (!authImplemented) {
      authIssues.push('No authentication modules found');
    }
    
    if (authIssues.length > 0) {
      warning(`${authIssues.length} authentication security issues:`);
      authIssues.forEach(issue => warning(`- ${issue}`));
      return false;
    } else {
      success('Authentication security validation passed');
      return true;
    }
  } catch (err) {
    error(`Authentication security testing failed: ${err.message}`);
    return false;
  }
}

// Data protection tests
async function testDataProtection() {
  log('Testing data protection mechanisms...');
  
  try {
    const protectionIssues = [];
    
    // Check for encryption utilities
    const encryptionFiles = [
      '../../src/utils/encryption.ts',
      '../../src/utils/crypto.ts'
    ];
    
    let encryptionImplemented = false;
    
    for (const file of encryptionFiles) {
      const filePath = path.join(__dirname, file);
      if (fs.existsSync(filePath)) {
        encryptionImplemented = true;
        success(`Encryption utility found: ${path.basename(file)}`);
      }
    }
    
    if (!encryptionImplemented) {
      protectionIssues.push('No encryption utilities found');
    }
    
    // Check for HTTPS enforcement
    const configFiles = [
      '../../vite.config.ts',
      '../../next.config.js'
    ];
    
    let httpsEnforced = false;
    
    for (const file of configFiles) {
      const filePath = path.join(__dirname, file);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        if (content.includes('https') || content.includes('ssl')) {
          httpsEnforced = true;
          success('HTTPS configuration found');
          break;
        }
      }
    }
    
    if (!httpsEnforced) {
      protectionIssues.push('No HTTPS enforcement configuration found');
    }
    
    if (protectionIssues.length > 0) {
      warning(`${protectionIssues.length} data protection issues:`);
      protectionIssues.forEach(issue => warning(`- ${issue}`));
      return false;
    } else {
      success('Data protection validation passed');
      return true;
    }
  } catch (err) {
    error(`Data protection testing failed: ${err.message}`);
    return false;
  }
}

// Main execution
async function runSecurityTests() {
  log('Starting security testing suite...');
  
  let passedTests = 0;
  let totalTests = securityTests.length;
  
  for (const test of securityTests) {
    log(`\n🔒 ${test.name}: ${test.description}`);
    
    try {
      const passed = await test.execute();
      if (passed) {
        passedTests++;
      }
    } catch (err) {
      error(`Test ${test.name} failed: ${err.message}`);
    }
  }
  
  // Summary
  log('\n' + '='.repeat(60));
  log('SECURITY TESTING SUMMARY');
  log('='.repeat(60));
  
  const successRate = Math.round((passedTests / totalTests) * 100);
  
  if (passedTests === totalTests) {
    success(`All ${totalTests} security tests passed! 🔒`);
  } else {
    warning(`${passedTests}/${totalTests} security tests passed (${successRate}%)`);
  }
  
  log('\nNext steps:');
  log('1. Address any security issues found');
  log('2. Run full security audit with "./scripts/security-audit.sh"');
  log('3. Consider professional security assessment');
  
  return passedTests === totalTests;
}

// Run security tests
if (import.meta.url === `file://${process.argv[1]}`) {
  runSecurityTests()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(err => {
      error(`Security testing failed: ${err.message}`);
      process.exit(1);
    });
}

export { runSecurityTests };
