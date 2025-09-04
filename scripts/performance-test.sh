#!/bin/bash

# Performance Testing Script for Laser Cutting Calculator
# Comprehensive performance testing including load testing, stress testing, and monitoring

set -e

# Configuration
DOMAIN="${DOMAIN:-https://lasercalc.com}"
API_DOMAIN="${API_DOMAIN:-https://api.lasercalc.com}"
CONCURRENT_USERS="${CONCURRENT_USERS:-100}"
TEST_DURATION="${TEST_DURATION:-300}"
RAMP_UP_TIME="${RAMP_UP_TIME:-60}"
RESULTS_DIR="./performance-results"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Create results directory
mkdir -p "$RESULTS_DIR/$TIMESTAMP"
cd "$RESULTS_DIR/$TIMESTAMP"

# Check dependencies
check_dependencies() {
    log "Checking dependencies..."
    
    local deps=("curl" "jq" "ab" "wrk" "lighthouse")
    local missing_deps=()
    
    for dep in "${deps[@]}"; do
        if ! command -v "$dep" &> /dev/null; then
            missing_deps+=("$dep")
        fi
    done
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        error "Missing dependencies: ${missing_deps[*]}"
        log "Please install missing dependencies:"
        log "  - curl: HTTP client"
        log "  - jq: JSON processor"
        log "  - ab: Apache Bench for load testing"
        log "  - wrk: Modern HTTP benchmarking tool"
        log "  - lighthouse: Performance auditing"
        exit 1
    fi
    
    success "All dependencies are installed"
}

# Test basic connectivity
test_connectivity() {
    log "Testing connectivity to $DOMAIN..."
    
    if curl -s --max-time 10 "$DOMAIN" > /dev/null; then
        success "Main domain is accessible"
    else
        error "Cannot connect to main domain: $DOMAIN"
        exit 1
    fi
    
    log "Testing API connectivity to $API_DOMAIN..."
    
    if curl -s --max-time 10 "$API_DOMAIN/health" > /dev/null; then
        success "API domain is accessible"
    else
        warning "API domain may not be accessible: $API_DOMAIN"
    fi
}

# Lighthouse performance audit
run_lighthouse_audit() {
    log "Running Lighthouse performance audit..."
    
    local pages=(
        "/"
        "/calculators"
        "/calculator/laser-cutting-cost"
        "/calculator/cutting-time-estimator"
        "/features"
    )
    
    for page in "${pages[@]}"; do
        log "Auditing page: $page"
        
        lighthouse "$DOMAIN$page" \
            --output=json \
            --output-path="lighthouse_${page//\//_}.json" \
            --chrome-flags="--headless --no-sandbox" \
            --quiet || warning "Lighthouse audit failed for $page"
    done
    
    # Generate summary report
    if command -v jq &> /dev/null; then
        log "Generating Lighthouse summary..."
        
        echo "# Lighthouse Performance Summary" > lighthouse_summary.md
        echo "Generated: $(date)" >> lighthouse_summary.md
        echo "" >> lighthouse_summary.md
        
        for page in "${pages[@]}"; do
            local file="lighthouse_${page//\//_}.json"
            if [ -f "$file" ]; then
                local performance=$(jq -r '.lhr.categories.performance.score * 100' "$file" 2>/dev/null || echo "N/A")
                local accessibility=$(jq -r '.lhr.categories.accessibility.score * 100' "$file" 2>/dev/null || echo "N/A")
                local best_practices=$(jq -r '.lhr.categories["best-practices"].score * 100' "$file" 2>/dev/null || echo "N/A")
                local seo=$(jq -r '.lhr.categories.seo.score * 100' "$file" 2>/dev/null || echo "N/A")
                
                echo "## Page: $page" >> lighthouse_summary.md
                echo "- Performance: $performance" >> lighthouse_summary.md
                echo "- Accessibility: $accessibility" >> lighthouse_summary.md
                echo "- Best Practices: $best_practices" >> lighthouse_summary.md
                echo "- SEO: $seo" >> lighthouse_summary.md
                echo "" >> lighthouse_summary.md
            fi
        done
        
        success "Lighthouse summary generated"
    fi
}

# Apache Bench load testing
run_apache_bench_test() {
    log "Running Apache Bench load test..."
    
    local endpoints=(
        "$DOMAIN/"
        "$DOMAIN/calculators"
        "$DOMAIN/calculator/laser-cutting-cost"
        "$API_DOMAIN/health"
    )
    
    for endpoint in "${endpoints[@]}"; do
        log "Load testing endpoint: $endpoint"
        
        local filename="ab_$(echo "$endpoint" | sed 's/[^a-zA-Z0-9]/_/g').txt"
        
        ab -n 1000 -c 10 -g "$filename.gnuplot" "$endpoint" > "$filename" 2>&1 || warning "Apache Bench test failed for $endpoint"
    done
    
    success "Apache Bench tests completed"
}

# WRK load testing
run_wrk_test() {
    log "Running WRK load test..."
    
    # Test main page
    log "Testing main page with WRK..."
    wrk -t12 -c100 -d30s --latency "$DOMAIN/" > wrk_main_page.txt 2>&1 || warning "WRK test failed for main page"
    
    # Test calculator page
    log "Testing calculator page with WRK..."
    wrk -t12 -c100 -d30s --latency "$DOMAIN/calculator/laser-cutting-cost" > wrk_calculator_page.txt 2>&1 || warning "WRK test failed for calculator page"
    
    # Test API endpoint
    if curl -s --max-time 5 "$API_DOMAIN/health" > /dev/null; then
        log "Testing API endpoint with WRK..."
        wrk -t12 -c100 -d30s --latency "$API_DOMAIN/health" > wrk_api_endpoint.txt 2>&1 || warning "WRK test failed for API endpoint"
    fi
    
    success "WRK tests completed"
}

# Custom calculator performance test
run_calculator_performance_test() {
    log "Running calculator-specific performance tests..."
    
    # Create test script for calculator interactions
    cat > calculator_test.lua << 'EOF'
-- Calculator performance test script for WRK

local json = require("json")

-- Test data for different calculators
local test_data = {
    {
        path = "/api/calculator/laser-cutting-cost",
        body = json.encode({
            material = "steel",
            thickness = 5,
            length = 1000,
            width = 500,
            quantity = 10
        })
    },
    {
        path = "/api/calculator/cutting-time-estimator",
        body = json.encode({
            material = "aluminum",
            thickness = 3,
            perimeter = 2000,
            complexity = "medium"
        })
    }
}

local counter = 0

function request()
    counter = counter + 1
    local data = test_data[(counter % #test_data) + 1]
    
    return wrk.format("POST", data.path, {
        ["Content-Type"] = "application/json",
        ["Content-Length"] = string.len(data.body)
    }, data.body)
end

function response(status, headers, body)
    if status ~= 200 then
        print("Error: " .. status .. " - " .. body)
    end
end
EOF
    
    # Run calculator-specific load test
    if curl -s --max-time 5 "$API_DOMAIN/health" > /dev/null; then
        log "Running calculator API load test..."
        wrk -t8 -c50 -d60s --script=calculator_test.lua "$API_DOMAIN" > wrk_calculator_api.txt 2>&1 || warning "Calculator API test failed"
    fi
    
    success "Calculator performance tests completed"
}

# Memory and CPU monitoring during tests
run_monitoring_test() {
    log "Running monitoring test..."
    
    # Start monitoring in background
    (
        echo "timestamp,cpu_percent,memory_mb,load_avg" > system_metrics.csv
        for i in {1..300}; do
            local timestamp=$(date +%s)
            local cpu_percent=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | sed 's/%us,//' || echo "0")
            local memory_mb=$(free -m | awk 'NR==2{printf "%.1f", $3}' || echo "0")
            local load_avg=$(uptime | awk -F'load average:' '{print $2}' | awk '{print $1}' | sed 's/,//' || echo "0")
            
            echo "$timestamp,$cpu_percent,$memory_mb,$load_avg" >> system_metrics.csv
            sleep 1
        done
    ) &
    
    local monitor_pid=$!
    
    # Run concurrent tests while monitoring
    log "Running concurrent performance tests..."
    
    # Run multiple tests in parallel
    (run_apache_bench_test) &
    (run_wrk_test) &
    (run_calculator_performance_test) &
    
    # Wait for tests to complete
    wait
    
    # Stop monitoring
    kill $monitor_pid 2>/dev/null || true
    
    success "Monitoring test completed"
}

# Generate performance report
generate_report() {
    log "Generating performance report..."
    
    cat > performance_report.md << EOF
# Performance Test Report

**Test Date:** $(date)
**Domain:** $DOMAIN
**API Domain:** $API_DOMAIN
**Test Duration:** ${TEST_DURATION}s
**Concurrent Users:** $CONCURRENT_USERS

## Test Summary

### Lighthouse Audit Results
$(if [ -f lighthouse_summary.md ]; then cat lighthouse_summary.md | tail -n +3; else echo "Lighthouse tests not completed"; fi)

### Load Test Results

#### Apache Bench Results
$(if [ -f ab_*.txt ]; then
    echo "Apache Bench tests completed. Check individual ab_*.txt files for detailed results."
    for file in ab_*.txt; do
        if [ -f "$file" ]; then
            echo "- $file: $(grep "Requests per second" "$file" | head -1 || echo "No RPS data")"
        fi
    done
else
    echo "Apache Bench tests not completed"
fi)

#### WRK Results
$(if [ -f wrk_*.txt ]; then
    echo "WRK tests completed. Summary:"
    for file in wrk_*.txt; do
        if [ -f "$file" ]; then
            echo "- $file:"
            echo "  - $(grep "Requests/sec" "$file" || echo "No RPS data")"
            echo "  - $(grep "Latency" "$file" | head -1 || echo "No latency data")"
        fi
    done
else
    echo "WRK tests not completed"
fi)

### System Metrics
$(if [ -f system_metrics.csv ]; then
    echo "System monitoring completed. Check system_metrics.csv for detailed metrics."
    echo "Average CPU: $(awk -F',' 'NR>1 {sum+=$2; count++} END {if(count>0) printf "%.1f%%", sum/count; else print "N/A"}' system_metrics.csv)"
    echo "Average Memory: $(awk -F',' 'NR>1 {sum+=$3; count++} END {if(count>0) printf "%.1f MB", sum/count; else print "N/A"}' system_metrics.csv)"
else
    echo "System monitoring not completed"
fi)

## Recommendations

### Performance Optimizations
- Monitor response times and optimize slow endpoints
- Implement caching for frequently accessed resources
- Consider CDN for static assets
- Optimize database queries if response times are high

### Scalability Considerations
- Monitor resource usage during peak loads
- Consider horizontal scaling if CPU/memory usage is high
- Implement load balancing for high availability
- Set up auto-scaling based on metrics

## Files Generated
- Lighthouse audit results: lighthouse_*.json
- Apache Bench results: ab_*.txt
- WRK results: wrk_*.txt
- System metrics: system_metrics.csv
- Test scripts: calculator_test.lua

EOF
    
    success "Performance report generated: performance_report.md"
}

# Cleanup function
cleanup() {
    log "Cleaning up temporary files..."
    rm -f calculator_test.lua
}

# Main execution
main() {
    log "Starting performance testing for Laser Cutting Calculator"
    log "Domain: $DOMAIN"
    log "API Domain: $API_DOMAIN"
    log "Results will be saved to: $RESULTS_DIR/$TIMESTAMP"
    
    check_dependencies
    test_connectivity
    
    # Run performance tests
    run_lighthouse_audit
    run_monitoring_test
    
    # Generate report
    generate_report
    
    # Cleanup
    cleanup
    
    success "Performance testing completed!"
    log "Results saved to: $RESULTS_DIR/$TIMESTAMP"
    log "View the report: $RESULTS_DIR/$TIMESTAMP/performance_report.md"
}

# Handle script interruption
trap cleanup EXIT

# Run main function
main "$@"
