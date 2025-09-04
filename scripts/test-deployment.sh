#!/bin/bash

# Laser Cutting Calculator - Deployment Testing Script
# This script runs comprehensive tests against deployed environments

set -e  # Exit on any error

# Configuration
ENVIRONMENT=${1:-staging}
BASE_URL=""
TIMEOUT=30

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')] INFO: $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] WARN: $1${NC}"
}

error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}" >&2
}

success() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')] SUCCESS: $1${NC}"
}

# Set base URL based on environment
set_base_url() {
    case $ENVIRONMENT in
        "staging")
            BASE_URL="https://staging.lasercalc.com"
            ;;
        "production")
            BASE_URL="https://lasercalc.com"
            ;;
        "local")
            BASE_URL="http://localhost:3000"
            ;;
        *)
            error "Invalid environment: $ENVIRONMENT"
            exit 1
            ;;
    esac
    
    log "Testing environment: $ENVIRONMENT ($BASE_URL)"
}

# Test HTTP response
test_http_response() {
    local url=$1
    local expected_status=${2:-200}
    local description=$3
    
    log "Testing: $description"
    
    local response=$(curl -s -o /dev/null -w "%{http_code}" --max-time $TIMEOUT "$url")
    
    if [ "$response" = "$expected_status" ]; then
        success "$description - HTTP $response"
        return 0
    else
        error "$description - Expected HTTP $expected_status, got $response"
        return 1
    fi
}

# Test JSON API response
test_json_api() {
    local url=$1
    local description=$2
    
    log "Testing API: $description"
    
    local response=$(curl -s --max-time $TIMEOUT -H "Accept: application/json" "$url")
    
    if echo "$response" | jq . >/dev/null 2>&1; then
        success "$description - Valid JSON response"
        return 0
    else
        error "$description - Invalid JSON response"
        return 1
    fi
}

# Test health endpoint
test_health_endpoint() {
    log "Testing health endpoint..."
    
    local health_url="$BASE_URL/health"
    local response=$(curl -s --max-time $TIMEOUT "$health_url")
    
    if echo "$response" | jq -e '.status == "healthy"' >/dev/null 2>&1; then
        success "Health endpoint - System is healthy"
        return 0
    else
        error "Health endpoint - System is not healthy"
        echo "Response: $response"
        return 1
    fi
}

# Test core pages
test_core_pages() {
    log "Testing core pages..."
    
    local pages=(
        "/ Homepage"
        "/calculators Calculators Page"
        "/features Features Page"
        "/contact Contact Page"
        "/learn Learn Page"
    )
    
    local failed=0
    
    for page_info in "${pages[@]}"; do
        local path=$(echo $page_info | cut -d' ' -f1)
        local name=$(echo $page_info | cut -d' ' -f2-)
        
        if ! test_http_response "$BASE_URL$path" 200 "$name"; then
            failed=$((failed + 1))
        fi
    done
    
    if [ $failed -eq 0 ]; then
        success "All core pages are accessible"
        return 0
    else
        error "$failed core pages failed"
        return 1
    fi
}

# Test calculator pages
test_calculator_pages() {
    log "Testing calculator pages..."
    
    local calculators=(
        "/calculator/laser-cutting-cost-calculator Laser Cutting Cost Calculator"
        "/calculator/cutting-time-estimator Cutting Time Estimator"
        "/calculator/laser-parameter-optimizer Laser Parameter Optimizer"
        "/calculator/material-selection-assistant Material Selection Assistant"
        "/calculator/gas-consumption-calculator Gas Consumption Calculator"
    )
    
    local failed=0
    
    for calc_info in "${calculators[@]}"; do
        local path=$(echo $calc_info | cut -d' ' -f1)
        local name=$(echo $calc_info | cut -d' ' -f2-)
        
        if ! test_http_response "$BASE_URL$path" 200 "$name"; then
            failed=$((failed + 1))
        fi
    done
    
    if [ $failed -eq 0 ]; then
        success "All calculator pages are accessible"
        return 0
    else
        error "$failed calculator pages failed"
        return 1
    fi
}

# Test API endpoints
test_api_endpoints() {
    log "Testing API endpoints..."
    
    local apis=(
        "/api/health Health API"
        "/api/calculators Calculators API"
    )
    
    local failed=0
    
    for api_info in "${apis[@]}"; do
        local path=$(echo $api_info | cut -d' ' -f1)
        local name=$(echo $api_info | cut -d' ' -f2-)
        
        if ! test_json_api "$BASE_URL$path" "$name"; then
            failed=$((failed + 1))
        fi
    done
    
    if [ $failed -eq 0 ]; then
        success "All API endpoints are working"
        return 0
    else
        error "$failed API endpoints failed"
        return 1
    fi
}

# Test static assets
test_static_assets() {
    log "Testing static assets..."
    
    # Get the main page and extract asset URLs
    local main_page=$(curl -s --max-time $TIMEOUT "$BASE_URL/")
    
    # Extract CSS and JS files
    local css_files=$(echo "$main_page" | grep -oP 'href="[^"]*\.css[^"]*"' | sed 's/href="//g' | sed 's/"//g' | head -3)
    local js_files=$(echo "$main_page" | grep -oP 'src="[^"]*\.js[^"]*"' | sed 's/src="//g' | sed 's/"//g' | head -3)
    
    local failed=0
    
    # Test CSS files
    for css_file in $css_files; do
        local full_url
        if [[ $css_file == http* ]]; then
            full_url=$css_file
        else
            full_url="$BASE_URL$css_file"
        fi
        
        if ! test_http_response "$full_url" 200 "CSS Asset: $css_file"; then
            failed=$((failed + 1))
        fi
    done
    
    # Test JS files
    for js_file in $js_files; do
        local full_url
        if [[ $js_file == http* ]]; then
            full_url=$js_file
        else
            full_url="$BASE_URL$js_file"
        fi
        
        if ! test_http_response "$full_url" 200 "JS Asset: $js_file"; then
            failed=$((failed + 1))
        fi
    done
    
    if [ $failed -eq 0 ]; then
        success "Static assets are loading correctly"
        return 0
    else
        warn "$failed static assets failed (non-critical)"
        return 0  # Don't fail deployment for static assets
    fi
}

# Test security headers
test_security_headers() {
    log "Testing security headers..."
    
    local headers=$(curl -s -I --max-time $TIMEOUT "$BASE_URL/")
    
    local required_headers=(
        "X-Frame-Options"
        "X-Content-Type-Options"
        "X-XSS-Protection"
        "Strict-Transport-Security"
    )
    
    local failed=0
    
    for header in "${required_headers[@]}"; do
        if echo "$headers" | grep -qi "$header"; then
            success "Security header present: $header"
        else
            error "Security header missing: $header"
            failed=$((failed + 1))
        fi
    done
    
    if [ $failed -eq 0 ]; then
        success "All security headers are present"
        return 0
    else
        error "$failed security headers missing"
        return 1
    fi
}

# Test SSL certificate (for HTTPS environments)
test_ssl_certificate() {
    if [[ $BASE_URL == https* ]]; then
        log "Testing SSL certificate..."
        
        local domain=$(echo $BASE_URL | sed 's|https://||' | sed 's|/.*||')
        
        if openssl s_client -connect "$domain:443" -servername "$domain" </dev/null 2>/dev/null | openssl x509 -noout -dates >/dev/null 2>&1; then
            success "SSL certificate is valid"
            return 0
        else
            error "SSL certificate is invalid or expired"
            return 1
        fi
    else
        log "Skipping SSL test for non-HTTPS environment"
        return 0
    fi
}

# Test performance
test_performance() {
    log "Testing performance..."
    
    local start_time=$(date +%s%N)
    local response=$(curl -s --max-time $TIMEOUT "$BASE_URL/")
    local end_time=$(date +%s%N)
    
    local duration=$(( (end_time - start_time) / 1000000 ))  # Convert to milliseconds
    
    if [ $duration -lt 3000 ]; then  # Less than 3 seconds
        success "Performance test passed: ${duration}ms"
        return 0
    else
        warn "Performance test slow: ${duration}ms (>3000ms)"
        return 0  # Don't fail deployment for performance
    fi
}

# Run smoke tests
run_smoke_tests() {
    log "Running smoke tests..."
    
    local tests=(
        "test_health_endpoint"
        "test_core_pages"
        "test_calculator_pages"
    )
    
    local failed=0
    
    for test in "${tests[@]}"; do
        if ! $test; then
            failed=$((failed + 1))
        fi
    done
    
    return $failed
}

# Run comprehensive tests
run_comprehensive_tests() {
    log "Running comprehensive tests..."
    
    local tests=(
        "test_health_endpoint"
        "test_core_pages"
        "test_calculator_pages"
        "test_api_endpoints"
        "test_static_assets"
        "test_security_headers"
        "test_ssl_certificate"
        "test_performance"
    )
    
    local failed=0
    
    for test in "${tests[@]}"; do
        if ! $test; then
            failed=$((failed + 1))
        fi
        echo ""  # Add spacing between tests
    done
    
    return $failed
}

# Generate test report
generate_report() {
    local test_result=$1
    local report_file="test-report-$ENVIRONMENT-$(date +%Y%m%d_%H%M%S).txt"
    
    {
        echo "Deployment Test Report"
        echo "====================="
        echo "Environment: $ENVIRONMENT"
        echo "Base URL: $BASE_URL"
        echo "Test Date: $(date)"
        echo "Test Result: $([ $test_result -eq 0 ] && echo "PASSED" || echo "FAILED")"
        echo ""
        echo "Test Details:"
        echo "- Health Endpoint: $(test_health_endpoint >/dev/null 2>&1 && echo "PASS" || echo "FAIL")"
        echo "- Core Pages: $(test_core_pages >/dev/null 2>&1 && echo "PASS" || echo "FAIL")"
        echo "- Calculator Pages: $(test_calculator_pages >/dev/null 2>&1 && echo "PASS" || echo "FAIL")"
        echo "- API Endpoints: $(test_api_endpoints >/dev/null 2>&1 && echo "PASS" || echo "FAIL")"
        echo "- Static Assets: $(test_static_assets >/dev/null 2>&1 && echo "PASS" || echo "FAIL")"
        echo "- Security Headers: $(test_security_headers >/dev/null 2>&1 && echo "PASS" || echo "FAIL")"
        echo "- SSL Certificate: $(test_ssl_certificate >/dev/null 2>&1 && echo "PASS" || echo "FAIL")"
        echo "- Performance: $(test_performance >/dev/null 2>&1 && echo "PASS" || echo "FAIL")"
    } > "$report_file"
    
    log "Test report generated: $report_file"
}

# Main function
main() {
    log "Starting deployment tests for $ENVIRONMENT environment"
    
    set_base_url
    
    local test_result
    case "${2:-comprehensive}" in
        "smoke")
            run_smoke_tests
            test_result=$?
            ;;
        "comprehensive")
            run_comprehensive_tests
            test_result=$?
            ;;
        *)
            error "Invalid test type. Use 'smoke' or 'comprehensive'"
            exit 1
            ;;
    esac
    
    generate_report $test_result
    
    if [ $test_result -eq 0 ]; then
        success "All tests passed! Deployment is healthy."
        exit 0
    else
        error "$test_result tests failed! Deployment may have issues."
        exit 1
    fi
}

# Script entry point
case "${1:-staging}" in
    "staging"|"production"|"local")
        main "$@"
        ;;
    *)
        echo "Usage: $0 {staging|production|local} [smoke|comprehensive]"
        echo "  staging     - Test staging environment"
        echo "  production  - Test production environment"
        echo "  local       - Test local environment"
        echo ""
        echo "Test types:"
        echo "  smoke       - Quick smoke tests (default)"
        echo "  comprehensive - Full test suite"
        exit 1
        ;;
esac
