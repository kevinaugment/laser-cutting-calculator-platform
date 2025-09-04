#!/bin/bash

# Security Audit and Vulnerability Scanning Script
# Comprehensive security testing for Laser Cutting Calculator

set -e

# Configuration
DOMAIN="${DOMAIN:-http://localhost:3000}"
RESULTS_DIR="./security-results"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
SEVERITY_THRESHOLD="${SEVERITY_THRESHOLD:-medium}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Security metrics
TOTAL_CHECKS=0
PASSED_CHECKS=0
HIGH_SEVERITY_ISSUES=0
MEDIUM_SEVERITY_ISSUES=0
LOW_SEVERITY_ISSUES=0

# Logging functions
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

critical() {
    echo -e "${RED}[CRITICAL]${NC} $1"
    HIGH_SEVERITY_ISSUES=$((HIGH_SEVERITY_ISSUES + 1))
}

medium() {
    echo -e "${YELLOW}[MEDIUM]${NC} $1"
    MEDIUM_SEVERITY_ISSUES=$((MEDIUM_SEVERITY_ISSUES + 1))
}

low() {
    echo -e "${BLUE}[LOW]${NC} $1"
    LOW_SEVERITY_ISSUES=$((LOW_SEVERITY_ISSUES + 1))
}

# Create results directory
mkdir -p "$RESULTS_DIR/$TIMESTAMP"
cd "$RESULTS_DIR/$TIMESTAMP"

# Check dependencies
check_dependencies() {
    log "Checking security audit dependencies..."
    
    local deps=("curl" "nmap" "nikto" "node" "npm")
    local missing_deps=()
    
    for dep in "${deps[@]}"; do
        if ! command -v "$dep" &> /dev/null; then
            missing_deps+=("$dep")
        fi
    done
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        warning "Missing optional dependencies: ${missing_deps[*]}"
        log "Some security tests may be skipped. Install missing tools for complete audit."
    else
        success "All security audit dependencies are available"
    fi
}

# Test basic connectivity and SSL
test_ssl_security() {
    log "Testing SSL/TLS security..."
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    # Extract domain from URL
    local domain=$(echo "$DOMAIN" | sed -e 's|^[^/]*//||' -e 's|/.*$||')
    
    if [[ "$DOMAIN" == https://* ]]; then
        # Test SSL certificate
        local ssl_info=$(echo | openssl s_client -connect "$domain:443" -servername "$domain" 2>/dev/null | openssl x509 -noout -dates 2>/dev/null || echo "SSL_ERROR")
        
        if [[ "$ssl_info" != "SSL_ERROR" ]]; then
            success "SSL certificate is valid"
            echo "$ssl_info" > ssl_certificate_info.txt
        else
            critical "SSL certificate issues detected"
        fi
        
        # Test SSL configuration
        if command -v nmap &> /dev/null; then
            nmap --script ssl-enum-ciphers -p 443 "$domain" > ssl_cipher_scan.txt 2>&1 || warning "SSL cipher scan failed"
        fi
    else
        warning "Application not using HTTPS - security risk"
        medium "HTTP connection detected - data transmitted in plain text"
    fi
}

# Security headers check
check_security_headers() {
    log "Checking security headers..."
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    local headers_response=$(curl -I -s "$DOMAIN" 2>/dev/null || echo "CURL_ERROR")
    
    if [[ "$headers_response" == "CURL_ERROR" ]]; then
        error "Cannot connect to application for header check"
        return 1
    fi
    
    echo "$headers_response" > security_headers.txt
    
    # Check for security headers
    local security_headers=(
        "X-Content-Type-Options"
        "X-Frame-Options"
        "X-XSS-Protection"
        "Strict-Transport-Security"
        "Content-Security-Policy"
        "Referrer-Policy"
        "Permissions-Policy"
    )
    
    local missing_headers=()
    local present_headers=()
    
    for header in "${security_headers[@]}"; do
        if echo "$headers_response" | grep -qi "$header"; then
            present_headers+=("$header")
        else
            missing_headers+=("$header")
        fi
    done
    
    log "Present security headers: ${#present_headers[@]}/${#security_headers[@]}"
    
    if [ ${#present_headers[@]} -ge 5 ]; then
        success "Good security headers coverage (${#present_headers[@]}/${#security_headers[@]})"
    elif [ ${#present_headers[@]} -ge 3 ]; then
        warning "Moderate security headers coverage (${#present_headers[@]}/${#security_headers[@]})"
        medium "Missing security headers: ${missing_headers[*]}"
    else
        critical "Poor security headers coverage (${#present_headers[@]}/${#security_headers[@]})"
        critical "Missing critical security headers: ${missing_headers[*]}"
    fi
}

# Input validation testing
test_input_validation() {
    log "Testing input validation..."
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    # Test XSS payloads
    local xss_payloads=(
        "<script>alert('xss')</script>"
        "javascript:alert('xss')"
        "<img src=x onerror=alert('xss')>"
        "';alert('xss');//"
    )
    
    local xss_vulnerable=false
    
    for payload in "${xss_payloads[@]}"; do
        local encoded_payload=$(printf '%s' "$payload" | jq -sRr @uri)
        local response=$(curl -s "$DOMAIN/calculator/laser-cutting-cost?test=$encoded_payload" 2>/dev/null || echo "")
        
        if echo "$response" | grep -q "$payload"; then
            xss_vulnerable=true
            critical "XSS vulnerability detected with payload: $payload"
        fi
    done
    
    if [ "$xss_vulnerable" = false ]; then
        success "No XSS vulnerabilities detected in basic tests"
    fi
    
    # Test SQL injection (if applicable)
    local sql_payloads=(
        "' OR '1'='1"
        "'; DROP TABLE users; --"
        "1' UNION SELECT * FROM users --"
    )
    
    local sql_vulnerable=false
    
    for payload in "${sql_payloads[@]}"; do
        local encoded_payload=$(printf '%s' "$payload" | jq -sRr @uri)
        local response=$(curl -s "$DOMAIN/api/test?id=$encoded_payload" 2>/dev/null || echo "")
        
        # Check for SQL error messages
        if echo "$response" | grep -qi -E "(sql|mysql|postgresql|sqlite|oracle|error|syntax)"; then
            sql_vulnerable=true
            critical "Potential SQL injection vulnerability detected"
        fi
    done
    
    if [ "$sql_vulnerable" = false ]; then
        success "No SQL injection vulnerabilities detected in basic tests"
    fi
}

# Authentication and authorization testing
test_authentication() {
    log "Testing authentication and authorization..."
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    # Test for common authentication endpoints
    local auth_endpoints=(
        "/api/auth/login"
        "/api/auth/register"
        "/api/auth/logout"
        "/api/user/profile"
        "/admin"
        "/dashboard"
    )
    
    local auth_issues=0
    
    for endpoint in "${auth_endpoints[@]}"; do
        local response=$(curl -s -o /dev/null -w "%{http_code}" "$DOMAIN$endpoint" 2>/dev/null || echo "000")
        
        case $endpoint in
            "/admin")
                if [ "$response" = "200" ]; then
                    critical "Admin endpoint accessible without authentication"
                    auth_issues=$((auth_issues + 1))
                fi
                ;;
            "/api/user/profile")
                if [ "$response" = "200" ]; then
                    medium "User profile endpoint may be accessible without authentication"
                    auth_issues=$((auth_issues + 1))
                fi
                ;;
        esac
    done
    
    if [ $auth_issues -eq 0 ]; then
        success "No obvious authentication bypass issues detected"
    fi
    
    # Test for weak session management
    local session_response=$(curl -s -I "$DOMAIN/api/auth/login" 2>/dev/null || echo "")
    
    if echo "$session_response" | grep -qi "set-cookie"; then
        if echo "$session_response" | grep -qi "secure"; then
            success "Session cookies have Secure flag"
        else
            medium "Session cookies missing Secure flag"
        fi
        
        if echo "$session_response" | grep -qi "httponly"; then
            success "Session cookies have HttpOnly flag"
        else
            medium "Session cookies missing HttpOnly flag"
        fi
        
        if echo "$session_response" | grep -qi "samesite"; then
            success "Session cookies have SameSite attribute"
        else
            low "Session cookies missing SameSite attribute"
        fi
    fi
}

# Directory traversal and file access testing
test_directory_traversal() {
    log "Testing directory traversal vulnerabilities..."
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    local traversal_payloads=(
        "../../../etc/passwd"
        "..\\..\\..\\windows\\system32\\drivers\\etc\\hosts"
        "....//....//....//etc/passwd"
        "%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fpasswd"
    )
    
    local traversal_vulnerable=false
    
    for payload in "${traversal_payloads[@]}"; do
        local response=$(curl -s "$DOMAIN/api/file?path=$payload" 2>/dev/null || echo "")
        
        if echo "$response" | grep -q "root:"; then
            traversal_vulnerable=true
            critical "Directory traversal vulnerability detected with payload: $payload"
        fi
    done
    
    if [ "$traversal_vulnerable" = false ]; then
        success "No directory traversal vulnerabilities detected"
    fi
}

# Rate limiting and DoS protection testing
test_rate_limiting() {
    log "Testing rate limiting and DoS protection..."
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    # Test rate limiting with rapid requests
    local rate_limit_detected=false
    local consecutive_200s=0
    
    for i in {1..20}; do
        local response_code=$(curl -s -o /dev/null -w "%{http_code}" "$DOMAIN/api/health" 2>/dev/null || echo "000")
        
        if [ "$response_code" = "429" ]; then
            rate_limit_detected=true
            break
        elif [ "$response_code" = "200" ]; then
            consecutive_200s=$((consecutive_200s + 1))
        fi
        
        sleep 0.1
    done
    
    if [ "$rate_limit_detected" = true ]; then
        success "Rate limiting is implemented"
    elif [ $consecutive_200s -ge 15 ]; then
        medium "No rate limiting detected - potential DoS vulnerability"
    else
        low "Rate limiting behavior unclear"
    fi
}

# Dependency vulnerability scanning
scan_dependencies() {
    log "Scanning dependencies for vulnerabilities..."
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    if [ -f "../../../package.json" ]; then
        cd ../../../
        
        # Run npm audit
        if command -v npm &> /dev/null; then
            npm audit --json > "$RESULTS_DIR/$TIMESTAMP/npm_audit.json" 2>/dev/null || {
                warning "npm audit failed or no vulnerabilities found"
                echo '{"vulnerabilities": {}}' > "$RESULTS_DIR/$TIMESTAMP/npm_audit.json"
            }
            
            # Parse audit results
            local high_vulns=$(jq -r '.metadata.vulnerabilities.high // 0' "$RESULTS_DIR/$TIMESTAMP/npm_audit.json" 2>/dev/null || echo "0")
            local moderate_vulns=$(jq -r '.metadata.vulnerabilities.moderate // 0' "$RESULTS_DIR/$TIMESTAMP/npm_audit.json" 2>/dev/null || echo "0")
            local low_vulns=$(jq -r '.metadata.vulnerabilities.low // 0' "$RESULTS_DIR/$TIMESTAMP/npm_audit.json" 2>/dev/null || echo "0")
            
            if [ "$high_vulns" -gt 0 ]; then
                critical "$high_vulns high severity dependency vulnerabilities found"
            fi
            
            if [ "$moderate_vulns" -gt 0 ]; then
                medium "$moderate_vulns moderate severity dependency vulnerabilities found"
            fi
            
            if [ "$low_vulns" -gt 0 ]; then
                low "$low_vulns low severity dependency vulnerabilities found"
            fi
            
            if [ "$high_vulns" -eq 0 ] && [ "$moderate_vulns" -eq 0 ] && [ "$low_vulns" -eq 0 ]; then
                success "No dependency vulnerabilities detected"
            fi
        fi
        
        cd "$RESULTS_DIR/$TIMESTAMP"
    else
        warning "package.json not found - skipping dependency scan"
    fi
}

# Web application scanning with Nikto (if available)
run_nikto_scan() {
    log "Running Nikto web application scan..."
    
    if command -v nikto &> /dev/null; then
        TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
        
        nikto -h "$DOMAIN" -output nikto_scan.txt -Format txt || {
            warning "Nikto scan failed or completed with warnings"
        }
        
        if [ -f "nikto_scan.txt" ]; then
            local nikto_issues=$(grep -c "OSVDB\|CVE" nikto_scan.txt 2>/dev/null || echo "0")
            
            if [ "$nikto_issues" -gt 0 ]; then
                medium "$nikto_issues potential security issues found by Nikto"
            else
                success "Nikto scan completed with no major issues"
            fi
        fi
    else
        warning "Nikto not available - skipping web application scan"
    fi
}

# Generate security report
generate_security_report() {
    log "Generating security audit report..."
    
    local total_issues=$((HIGH_SEVERITY_ISSUES + MEDIUM_SEVERITY_ISSUES + LOW_SEVERITY_ISSUES))
    local security_score=$((100 - (HIGH_SEVERITY_ISSUES * 20) - (MEDIUM_SEVERITY_ISSUES * 10) - (LOW_SEVERITY_ISSUES * 5)))
    
    if [ $security_score -lt 0 ]; then
        security_score=0
    fi
    
    cat > security_audit_report.md << EOF
# Security Audit Report

**Audit Date:** $(date)
**Target:** $DOMAIN
**Audit Duration:** Security Assessment
**Overall Security Score:** $security_score/100

## Executive Summary

### Security Assessment
$(if [ $security_score -ge 90 ]; then
    echo "🟢 **EXCELLENT** - Strong security posture with minimal issues"
elif [ $security_score -ge 75 ]; then
    echo "🟡 **GOOD** - Generally secure with some areas for improvement"
elif [ $security_score -ge 50 ]; then
    echo "🟠 **MODERATE** - Security issues present that should be addressed"
else
    echo "🔴 **POOR** - Significant security vulnerabilities require immediate attention"
fi)

### Issue Summary
- **Total Security Checks:** $TOTAL_CHECKS
- **Passed Checks:** $PASSED_CHECKS
- **High Severity Issues:** $HIGH_SEVERITY_ISSUES
- **Medium Severity Issues:** $MEDIUM_SEVERITY_ISSUES
- **Low Severity Issues:** $LOW_SEVERITY_ISSUES
- **Total Issues:** $total_issues

## Detailed Findings

### SSL/TLS Security
$(if [[ "$DOMAIN" == https://* ]]; then
    echo "- HTTPS connection verified"
    echo "- SSL certificate validation performed"
else
    echo "- ⚠️ HTTP connection detected - recommend HTTPS implementation"
fi)

### Security Headers
$(if [ -f "security_headers.txt" ]; then
    echo "- Security headers analysis completed"
    echo "- Results saved in security_headers.txt"
else
    echo "- Security headers check not completed"
fi)

### Input Validation
- XSS vulnerability testing performed
- SQL injection testing performed
- Directory traversal testing performed

### Authentication & Authorization
- Authentication endpoint testing completed
- Session management analysis performed
- Authorization bypass testing completed

### Rate Limiting
- DoS protection testing performed
- Rate limiting verification completed

### Dependency Security
$(if [ -f "npm_audit.json" ]; then
    echo "- Dependency vulnerability scan completed"
    echo "- Results saved in npm_audit.json"
else
    echo "- Dependency scan not available"
fi)

## Recommendations

### High Priority
$(if [ $HIGH_SEVERITY_ISSUES -gt 0 ]; then
    echo "1. **Address Critical Vulnerabilities** - $HIGH_SEVERITY_ISSUES high severity issues require immediate attention"
    echo "2. **Security Review** - Conduct thorough security code review"
    echo "3. **Penetration Testing** - Consider professional penetration testing"
fi)

### Medium Priority
$(if [ $MEDIUM_SEVERITY_ISSUES -gt 0 ]; then
    echo "1. **Security Headers** - Implement missing security headers"
    echo "2. **Input Validation** - Strengthen input validation and sanitization"
    echo "3. **Authentication** - Review authentication and session management"
fi)

### Low Priority
$(if [ $LOW_SEVERITY_ISSUES -gt 0 ]; then
    echo "1. **Security Monitoring** - Implement security monitoring and logging"
    echo "2. **Regular Audits** - Schedule regular security audits"
    echo "3. **Security Training** - Provide security awareness training"
fi)

## Security Checklist

### Infrastructure Security
- [ ] HTTPS implementation with valid SSL certificate
- [ ] Security headers properly configured
- [ ] Rate limiting and DoS protection implemented
- [ ] Secure session management

### Application Security
- [ ] Input validation and sanitization
- [ ] XSS protection implemented
- [ ] SQL injection prevention
- [ ] Directory traversal protection
- [ ] Authentication and authorization controls

### Dependency Security
- [ ] Regular dependency vulnerability scanning
- [ ] Timely security updates
- [ ] Minimal dependency footprint

---
**Report Generated:** $(date)
**Security Auditor:** Automated Security Audit System
**Next Audit Recommended:** $(date -d "+3 months")
EOF
    
    success "Security audit report generated: security_audit_report.md"
}

# Security configuration validation
validate_security_config() {
    log "Validating security configuration files..."
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))

    local config_issues=0

    # Check for security configuration files
    local security_files=(
        "../../../security/security-config.ts"
        "../../../src/hooks/useSecurity.ts"
        "../../../src/middleware/security.ts"
    )

    for file in "${security_files[@]}"; do
        if [ -f "$file" ]; then
            success "Security configuration file found: $(basename "$file")"
        else
            medium "Missing security configuration file: $(basename "$file")"
            config_issues=$((config_issues + 1))
        fi
    done

    # Check environment variables security
    if [ -f "../../../.env.example" ]; then
        local env_secrets=$(grep -i -E "(password|secret|key|token)" "../../../.env.example" | grep -v "EXAMPLE" || echo "")
        if [ -n "$env_secrets" ]; then
            critical "Potential secrets found in .env.example file"
            config_issues=$((config_issues + 1))
        else
            success "No secrets detected in .env.example"
        fi
    fi

    if [ $config_issues -eq 0 ]; then
        success "Security configuration validation passed"
    fi
}

# Main execution
main() {
    log "Starting comprehensive security audit..."
    log "Target: $DOMAIN"
    log "Results Directory: $RESULTS_DIR/$TIMESTAMP"

    check_dependencies

    # Run security tests
    test_ssl_security
    check_security_headers
    test_input_validation
    test_authentication
    test_directory_traversal
    test_rate_limiting
    scan_dependencies
    validate_security_config
    run_nikto_scan

    # Generate report
    generate_security_report
    
    # Final summary
    local total_issues=$((HIGH_SEVERITY_ISSUES + MEDIUM_SEVERITY_ISSUES + LOW_SEVERITY_ISSUES))
    local security_score=$((100 - (HIGH_SEVERITY_ISSUES * 20) - (MEDIUM_SEVERITY_ISSUES * 10) - (LOW_SEVERITY_ISSUES * 5)))
    
    if [ $security_score -lt 0 ]; then
        security_score=0
    fi
    
    log "Security audit completed!"
    log "Security Score: $security_score/100"
    log "Total Issues: $total_issues (High: $HIGH_SEVERITY_ISSUES, Medium: $MEDIUM_SEVERITY_ISSUES, Low: $LOW_SEVERITY_ISSUES)"
    log "Results saved to: $RESULTS_DIR/$TIMESTAMP"
    
    if [ $HIGH_SEVERITY_ISSUES -eq 0 ] && [ $security_score -ge 75 ]; then
        success "Security audit PASSED! 🔒"
        return 0
    else
        error "Security audit FAILED. Critical issues need attention."
        return 1
    fi
}

# Handle script interruption
cleanup() {
    log "Security audit interrupted"
    exit 1
}

trap cleanup INT TERM

# Run main function
main "$@"
