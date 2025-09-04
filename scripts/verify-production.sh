#!/bin/bash

# Production Verification Script for Laser Cutting Calculator Platform
# This script verifies that all functionality works correctly in production

set -e

# Configuration
PRODUCTION_URL=${1:-"https://lasercalc.com"}
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="./logs/verify-production-$TIMESTAMP.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0
WARNING_TESTS=0

# Logging functions
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE"
    FAILED_TESTS=$((FAILED_TESTS + 1))
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" | tee -a "$LOG_FILE"
    PASSED_TESTS=$((PASSED_TESTS + 1))
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$LOG_FILE"
    WARNING_TESTS=$((WARNING_TESTS + 1))
}

# Create logs directory
mkdir -p logs

log "Starting production verification for: $PRODUCTION_URL"
log "Timestamp: $TIMESTAMP"

# Test 1: Basic connectivity
log "Testing basic connectivity..."
TOTAL_TESTS=$((TOTAL_TESTS + 1))

if curl -s --max-time 30 "$PRODUCTION_URL" > /dev/null; then
    success "Basic connectivity test passed"
else
    error "Basic connectivity test failed"
fi

# Test 2: Main page content
log "Testing main page content..."
TOTAL_TESTS=$((TOTAL_TESTS + 1))

MAIN_PAGE_CONTENT=$(curl -s --max-time 30 "$PRODUCTION_URL")
if echo "$MAIN_PAGE_CONTENT" | grep -q "Laser Cutting Calculator"; then
    success "Main page content test passed"
else
    error "Main page content test failed"
fi

# Test 3: Security headers
log "Testing security headers..."
TOTAL_TESTS=$((TOTAL_TESTS + 1))

HEADERS=$(curl -s -I --max-time 30 "$PRODUCTION_URL")
SECURITY_HEADERS=(
    "X-Frame-Options"
    "X-Content-Type-Options"
    "X-XSS-Protection"
    "Strict-Transport-Security"
    "Content-Security-Policy"
)

MISSING_HEADERS=()
for header in "${SECURITY_HEADERS[@]}"; do
    if echo "$HEADERS" | grep -qi "$header"; then
        log "✓ Security header present: $header"
    else
        MISSING_HEADERS+=("$header")
    fi
done

if [ ${#MISSING_HEADERS[@]} -eq 0 ]; then
    success "Security headers test passed"
else
    warning "Missing security headers: ${MISSING_HEADERS[*]}"
fi

# Test 4: SSL certificate
log "Testing SSL certificate..."
TOTAL_TESTS=$((TOTAL_TESTS + 1))

if openssl s_client -connect "$(echo "$PRODUCTION_URL" | sed 's|https://||'):443" -servername "$(echo "$PRODUCTION_URL" | sed 's|https://||')" < /dev/null 2>/dev/null | openssl x509 -noout -dates > /dev/null 2>&1; then
    success "SSL certificate test passed"
else
    error "SSL certificate test failed"
fi

# Test 5: Performance metrics
log "Testing performance metrics..."
TOTAL_TESTS=$((TOTAL_TESTS + 1))

# Test page load time
START_TIME=$(date +%s%N)
curl -s --max-time 30 "$PRODUCTION_URL" > /dev/null
END_TIME=$(date +%s%N)
LOAD_TIME=$(( (END_TIME - START_TIME) / 1000000 )) # Convert to milliseconds

log "Page load time: ${LOAD_TIME}ms"
if [ "$LOAD_TIME" -lt 3000 ]; then
    success "Performance test passed (${LOAD_TIME}ms < 3000ms)"
else
    warning "Performance test warning (${LOAD_TIME}ms >= 3000ms)"
fi

# Test 6: Calculator pages accessibility
log "Testing calculator pages..."

# Define all 27 calculators
CALCULATORS=(
    "laser-cutting-cost"
    "competitive-pricing-analyzer"
    "project-quoting-calculator"
    "profit-margin-calculator"
    "energy-cost-calculator"
    "gas-consumption-calculator"
    "cutting-time-estimator"
    "production-capacity-planner"
    "batch-processing-calculator"
    "job-queue-optimizer"
    "material-nesting-optimizer"
    "cut-path-optimizer"
    "laser-parameter-optimizer"
    "power-speed-matching"
    "gas-pressure-setting"
    "focus-height-calculator"
    "frequency-setting-assistant"
    "multiple-pass-calculator"
    "kerf-width-calculator"
    "beam-quality-calculator"
    "edge-quality-predictor"
    "warping-risk-calculator"
    "burn-mark-preventer"
    "dross-formation-calculator"
    "tolerance-stack-calculator"
    "heat-affected-zone-calculator"
    "quality-grade-calculator"
)

ACCESSIBLE_CALCULATORS=0
for calculator in "${CALCULATORS[@]}"; do
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    CALC_URL="$PRODUCTION_URL/calculators/$calculator"
    
    if curl -s --max-time 15 "$CALC_URL" > /dev/null; then
        log "✓ Calculator accessible: $calculator"
        ACCESSIBLE_CALCULATORS=$((ACCESSIBLE_CALCULATORS + 1))
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        error "✗ Calculator not accessible: $calculator"
    fi
done

log "Calculator accessibility: $ACCESSIBLE_CALCULATORS/${#CALCULATORS[@]} calculators accessible"

# Test 7: Mobile responsiveness
log "Testing mobile responsiveness..."
TOTAL_TESTS=$((TOTAL_TESTS + 1))

MOBILE_HEADERS="User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1"
MOBILE_RESPONSE=$(curl -s --max-time 30 -H "$MOBILE_HEADERS" "$PRODUCTION_URL")

if echo "$MOBILE_RESPONSE" | grep -q "viewport"; then
    success "Mobile responsiveness test passed"
else
    warning "Mobile responsiveness test warning"
fi

# Test 8: PWA manifest
log "Testing PWA manifest..."
TOTAL_TESTS=$((TOTAL_TESTS + 1))

MANIFEST_URL="$PRODUCTION_URL/manifest.json"
if curl -s --max-time 15 "$MANIFEST_URL" | grep -q "name"; then
    success "PWA manifest test passed"
else
    warning "PWA manifest test warning"
fi

# Test 9: Service worker
log "Testing service worker..."
TOTAL_TESTS=$((TOTAL_TESTS + 1))

SW_URL="$PRODUCTION_URL/sw.js"
if curl -s --max-time 15 "$SW_URL" > /dev/null; then
    success "Service worker test passed"
else
    warning "Service worker test warning"
fi

# Test 10: Robots.txt
log "Testing robots.txt..."
TOTAL_TESTS=$((TOTAL_TESTS + 1))

ROBOTS_URL="$PRODUCTION_URL/robots.txt"
if curl -s --max-time 15 "$ROBOTS_URL" | grep -q "User-agent"; then
    success "Robots.txt test passed"
else
    warning "Robots.txt test warning"
fi

# Test 11: Sitemap
log "Testing sitemap..."
TOTAL_TESTS=$((TOTAL_TESTS + 1))

SITEMAP_URL="$PRODUCTION_URL/sitemap.xml"
if curl -s --max-time 15 "$SITEMAP_URL" | grep -q "urlset"; then
    success "Sitemap test passed"
else
    warning "Sitemap test warning"
fi

# Test 12: Error pages
log "Testing error pages..."
TOTAL_TESTS=$((TOTAL_TESTS + 1))

ERROR_URL="$PRODUCTION_URL/non-existent-page"
ERROR_RESPONSE=$(curl -s -w "%{http_code}" --max-time 15 "$ERROR_URL")
HTTP_CODE="${ERROR_RESPONSE: -3}"

if [ "$HTTP_CODE" = "404" ] || [ "$HTTP_CODE" = "200" ]; then
    success "Error page handling test passed (HTTP $HTTP_CODE)"
else
    warning "Error page handling test warning (HTTP $HTTP_CODE)"
fi

# Test 13: API endpoints (if any)
log "Testing API endpoints..."
TOTAL_TESTS=$((TOTAL_TESTS + 1))

API_URL="$PRODUCTION_URL/api/health"
if curl -s --max-time 15 "$API_URL" > /dev/null 2>&1; then
    success "API endpoints test passed"
else
    warning "API endpoints test warning (may not be implemented)"
fi

# Generate verification report
VERIFICATION_REPORT="logs/verification-report-$TIMESTAMP.json"
SUCCESS_RATE=$((PASSED_TESTS * 100 / TOTAL_TESTS))

cat > "$VERIFICATION_REPORT" << EOF
{
  "timestamp": "$TIMESTAMP",
  "productionUrl": "$PRODUCTION_URL",
  "totalTests": $TOTAL_TESTS,
  "passedTests": $PASSED_TESTS,
  "failedTests": $FAILED_TESTS,
  "warningTests": $WARNING_TESTS,
  "successRate": $SUCCESS_RATE,
  "calculatorsAccessible": $ACCESSIBLE_CALCULATORS,
  "totalCalculators": ${#CALCULATORS[@]},
  "pageLoadTime": $LOAD_TIME,
  "status": "$([ $FAILED_TESTS -eq 0 ] && echo "PASSED" || echo "FAILED")"
}
EOF

# Final summary
echo ""
echo "🔍 Production Verification Summary:"
echo "   URL: $PRODUCTION_URL"
echo "   Total Tests: $TOTAL_TESTS"
echo "   Passed: $PASSED_TESTS"
echo "   Failed: $FAILED_TESTS"
echo "   Warnings: $WARNING_TESTS"
echo "   Success Rate: $SUCCESS_RATE%"
echo "   Calculators Accessible: $ACCESSIBLE_CALCULATORS/${#CALCULATORS[@]}"
echo "   Page Load Time: ${LOAD_TIME}ms"
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
    success "🎉 Production verification PASSED!"
    echo "   Status: ✅ PRODUCTION READY"
else
    error "❌ Production verification FAILED!"
    echo "   Status: ⚠️ NEEDS ATTENTION"
fi

echo ""
echo "Detailed report: $VERIFICATION_REPORT"
echo "Full log: $LOG_FILE"

log "Production verification completed"

# Exit with appropriate code
exit $FAILED_TESTS
