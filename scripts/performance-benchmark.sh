#!/bin/bash

# Performance Benchmark Testing Script
# Comprehensive performance testing and optimization for Laser Cutting Calculator

set -e

# Configuration
DOMAIN="${DOMAIN:-http://localhost:3000}"
CONCURRENT_USERS="${CONCURRENT_USERS:-50}"
TEST_DURATION="${TEST_DURATION:-300}"
RAMP_UP_TIME="${RAMP_UP_TIME:-60}"
RESULTS_DIR="./performance-results"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Performance thresholds
MAX_RESPONSE_TIME=2000  # 2 seconds
MAX_LOAD_TIME=3000      # 3 seconds
MIN_THROUGHPUT=100      # requests per second
MAX_ERROR_RATE=1        # 1% error rate

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Global variables
PERFORMANCE_SCORE=0
TOTAL_TESTS=0
PASSED_TESTS=0

# Logging functions
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
    PASSED_TESTS=$((PASSED_TESTS + 1))
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Create results directory
mkdir -p "$RESULTS_DIR/$TIMESTAMP"
cd "$RESULTS_DIR/$TIMESTAMP"

# Check dependencies
check_dependencies() {
    log "Checking performance testing dependencies..."
    
    local deps=("curl" "ab" "wrk" "lighthouse" "node")
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
        log "  - ab: Apache Bench for load testing"
        log "  - wrk: Modern HTTP benchmarking tool"
        log "  - lighthouse: Performance auditing"
        log "  - node: Node.js runtime"
        exit 1
    fi
    
    success "All dependencies are available"
}

# Test basic connectivity
test_connectivity() {
    log "Testing connectivity to $DOMAIN..."
    
    if curl -s --max-time 10 "$DOMAIN" > /dev/null; then
        success "Application is accessible"
    else
        error "Cannot connect to application: $DOMAIN"
        exit 1
    fi
}

# Run Lighthouse performance audit
run_lighthouse_audit() {
    log "Running Lighthouse performance audit..."
    
    local pages=(
        "/"
        "/calculators"
        "/calculator/laser-cutting-cost"
        "/calculator/cutting-time-estimator"
        "/features"
        "/learn"
    )
    
    local total_performance=0
    local page_count=0
    
    for page in "${pages[@]}"; do
        log "Auditing page: $page"
        
        lighthouse "$DOMAIN$page" \
            --output=json \
            --output-path="lighthouse_${page//\//_}.json" \
            --chrome-flags="--headless --no-sandbox" \
            --quiet || {
            warning "Lighthouse audit failed for $page"
            continue
        }
        
        # Extract performance score
        if [ -f "lighthouse_${page//\//_}.json" ]; then
            local performance=$(node -e "
                const data = JSON.parse(require('fs').readFileSync('lighthouse_${page//\//_}.json', 'utf8'));
                console.log(Math.round(data.lhr.categories.performance.score * 100));
            " 2>/dev/null || echo "0")
            
            log "Performance score for $page: $performance/100"
            total_performance=$((total_performance + performance))
            page_count=$((page_count + 1))
        fi
    done
    
    if [ $page_count -gt 0 ]; then
        local avg_performance=$((total_performance / page_count))
        log "Average Lighthouse performance score: $avg_performance/100"
        
        TOTAL_TESTS=$((TOTAL_TESTS + 1))
        if [ $avg_performance -ge 90 ]; then
            success "Lighthouse Performance: Excellent ($avg_performance/100)"
            PERFORMANCE_SCORE=$((PERFORMANCE_SCORE + 25))
        elif [ $avg_performance -ge 75 ]; then
            warning "Lighthouse Performance: Good ($avg_performance/100)"
            PERFORMANCE_SCORE=$((PERFORMANCE_SCORE + 20))
        elif [ $avg_performance -ge 50 ]; then
            warning "Lighthouse Performance: Needs Improvement ($avg_performance/100)"
            PERFORMANCE_SCORE=$((PERFORMANCE_SCORE + 10))
        else
            error "Lighthouse Performance: Poor ($avg_performance/100)"
        fi
    fi
    
    success "Lighthouse audit completed"
}

# Run Apache Bench load test
run_apache_bench_test() {
    log "Running Apache Bench load test..."
    
    local endpoints=(
        "$DOMAIN/"
        "$DOMAIN/calculators"
        "$DOMAIN/calculator/laser-cutting-cost"
    )
    
    local total_rps=0
    local endpoint_count=0
    
    for endpoint in "${endpoints[@]}"; do
        log "Load testing endpoint: $endpoint"
        
        local filename="ab_$(echo "$endpoint" | sed 's/[^a-zA-Z0-9]/_/g').txt"
        
        ab -n 1000 -c 10 -g "$filename.gnuplot" "$endpoint" > "$filename" 2>&1 || {
            warning "Apache Bench test failed for $endpoint"
            continue
        }
        
        # Extract requests per second
        local rps=$(grep "Requests per second" "$filename" | awk '{print $4}' | cut -d'.' -f1 || echo "0")
        local response_time=$(grep "Time per request" "$filename" | head -1 | awk '{print $4}' | cut -d'.' -f1 || echo "0")
        
        log "RPS for $endpoint: $rps req/sec, Response time: ${response_time}ms"
        
        if [ "$rps" -gt 0 ]; then
            total_rps=$((total_rps + rps))
            endpoint_count=$((endpoint_count + 1))
        fi
    done
    
    if [ $endpoint_count -gt 0 ]; then
        local avg_rps=$((total_rps / endpoint_count))
        log "Average requests per second: $avg_rps"
        
        TOTAL_TESTS=$((TOTAL_TESTS + 1))
        if [ $avg_rps -ge $MIN_THROUGHPUT ]; then
            success "Load Test: Throughput meets requirements ($avg_rps >= $MIN_THROUGHPUT RPS)"
            PERFORMANCE_SCORE=$((PERFORMANCE_SCORE + 25))
        else
            error "Load Test: Throughput below requirements ($avg_rps < $MIN_THROUGHPUT RPS)"
        fi
    fi
    
    success "Apache Bench load test completed"
}

# Run WRK stress test
run_wrk_stress_test() {
    log "Running WRK stress test..."
    
    # Test main page under stress
    log "Stress testing main page..."
    wrk -t12 -c$CONCURRENT_USERS -d${TEST_DURATION}s --latency "$DOMAIN/" > wrk_stress_test.txt 2>&1 || {
        warning "WRK stress test failed"
        return 1
    }
    
    # Extract metrics
    local rps=$(grep "Requests/sec:" wrk_stress_test.txt | awk '{print $2}' | cut -d'.' -f1 || echo "0")
    local avg_latency=$(grep "Latency" wrk_stress_test.txt | awk '{print $2}' | sed 's/ms//' || echo "0")
    local p99_latency=$(grep "99%" wrk_stress_test.txt | awk '{print $2}' | sed 's/ms//' || echo "0")
    
    log "Stress test results: $rps RPS, Avg latency: ${avg_latency}ms, P99: ${p99_latency}ms"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    if [ "$rps" -ge $MIN_THROUGHPUT ] && [ "${avg_latency%.*}" -le $MAX_RESPONSE_TIME ]; then
        success "Stress Test: Performance meets requirements"
        PERFORMANCE_SCORE=$((PERFORMANCE_SCORE + 25))
    else
        error "Stress Test: Performance below requirements"
    fi
    
    success "WRK stress test completed"
}

# Test calculator performance
test_calculator_performance() {
    log "Testing calculator performance..."
    
    local calculators=(
        "laser-cutting-cost"
        "cutting-time-estimator"
        "laser-parameter-optimizer"
        "material-selection-assistant"
    )
    
    local total_time=0
    local calc_count=0
    
    for calc in "${calculators[@]}"; do
        log "Testing calculator: $calc"
        
        # Measure response time
        local start_time=$(date +%s%N)
        curl -s "$DOMAIN/calculator/$calc" > /dev/null || {
            warning "Failed to test calculator: $calc"
            continue
        }
        local end_time=$(date +%s%N)
        
        local response_time=$(( (end_time - start_time) / 1000000 )) # Convert to milliseconds
        log "Calculator $calc response time: ${response_time}ms"
        
        total_time=$((total_time + response_time))
        calc_count=$((calc_count + 1))
    done
    
    if [ $calc_count -gt 0 ]; then
        local avg_time=$((total_time / calc_count))
        log "Average calculator response time: ${avg_time}ms"
        
        TOTAL_TESTS=$((TOTAL_TESTS + 1))
        if [ $avg_time -le $MAX_RESPONSE_TIME ]; then
            success "Calculator Performance: Response time meets requirements (${avg_time}ms <= ${MAX_RESPONSE_TIME}ms)"
            PERFORMANCE_SCORE=$((PERFORMANCE_SCORE + 25))
        else
            error "Calculator Performance: Response time exceeds requirements (${avg_time}ms > ${MAX_RESPONSE_TIME}ms)"
        fi
    fi
    
    success "Calculator performance test completed"
}

# Generate performance report
generate_performance_report() {
    log "Generating performance report..."
    
    local final_score=$((PERFORMANCE_SCORE))
    local max_score=$((TOTAL_TESTS * 25))
    local percentage=$((final_score * 100 / max_score))
    
    cat > performance_report.md << EOF
# Performance Benchmark Report

**Test Date:** $(date)
**Domain:** $DOMAIN
**Test Duration:** ${TEST_DURATION}s
**Concurrent Users:** $CONCURRENT_USERS
**Overall Score:** $final_score/$max_score ($percentage%)

## Performance Summary

### Overall Assessment
$(if [ $percentage -ge 90 ]; then
    echo "🟢 **EXCELLENT** - Performance exceeds expectations"
elif [ $percentage -ge 75 ]; then
    echo "🟡 **GOOD** - Performance meets most requirements"
elif [ $percentage -ge 50 ]; then
    echo "🟠 **NEEDS IMPROVEMENT** - Performance has issues"
else
    echo "🔴 **POOR** - Performance requires immediate attention"
fi)

### Test Results
- **Total Tests:** $TOTAL_TESTS
- **Passed Tests:** $PASSED_TESTS
- **Success Rate:** $((PASSED_TESTS * 100 / TOTAL_TESTS))%

### Key Metrics
$(if [ -f "wrk_stress_test.txt" ]; then
    echo "- **Throughput:** $(grep "Requests/sec:" wrk_stress_test.txt | awk '{print $2}') RPS"
    echo "- **Average Latency:** $(grep "Latency" wrk_stress_test.txt | awk '{print $2}')"
    echo "- **99th Percentile:** $(grep "99%" wrk_stress_test.txt | awk '{print $2}')"
fi)

### Lighthouse Scores
$(for file in lighthouse_*.json; do
    if [ -f "$file" ]; then
        local page=$(echo "$file" | sed 's/lighthouse_//' | sed 's/.json//' | sed 's/_/\//g')
        local score=$(node -e "
            const data = JSON.parse(require('fs').readFileSync('$file', 'utf8'));
            console.log(Math.round(data.lhr.categories.performance.score * 100));
        " 2>/dev/null || echo "N/A")
        echo "- **$page:** $score/100"
    fi
done)

## Recommendations

### Performance Optimizations
$(if [ $percentage -lt 90 ]; then
    echo "1. **Enable Compression:** Implement gzip/brotli compression"
    echo "2. **Optimize Images:** Use WebP format and lazy loading"
    echo "3. **Minify Assets:** Minify CSS, JavaScript, and HTML"
    echo "4. **Enable Caching:** Implement browser and CDN caching"
    echo "5. **Code Splitting:** Implement dynamic imports for better loading"
fi)

### Infrastructure Improvements
$(if [ $percentage -lt 75 ]; then
    echo "1. **CDN Integration:** Use a Content Delivery Network"
    echo "2. **Load Balancing:** Implement load balancing for high availability"
    echo "3. **Database Optimization:** Optimize database queries and indexing"
    echo "4. **Caching Layer:** Add Redis/Memcached for application caching"
fi)

## Detailed Results

### Load Testing Results
$(if [ -f "ab_*.txt" ]; then
    for file in ab_*.txt; do
        if [ -f "$file" ]; then
            echo "#### $(basename "$file" .txt)"
            echo "\`\`\`"
            grep -E "(Requests per second|Time per request|Transfer rate)" "$file" || echo "No detailed metrics available"
            echo "\`\`\`"
        fi
    done
fi)

### Stress Testing Results
$(if [ -f "wrk_stress_test.txt" ]; then
    echo "\`\`\`"
    cat wrk_stress_test.txt
    echo "\`\`\`"
fi)

---
**Report Generated:** $(date)
**Test Environment:** Performance Benchmark Suite v1.0
EOF
    
    success "Performance report generated: performance_report.md"
}

# Main execution
main() {
    log "Starting performance benchmark testing..."
    log "Domain: $DOMAIN"
    log "Concurrent Users: $CONCURRENT_USERS"
    log "Test Duration: ${TEST_DURATION}s"
    log "Results Directory: $RESULTS_DIR/$TIMESTAMP"
    
    check_dependencies
    test_connectivity
    
    # Run performance tests
    run_lighthouse_audit
    run_apache_bench_test
    run_wrk_stress_test
    test_calculator_performance
    
    # Generate report
    generate_performance_report
    
    # Final summary
    local final_score=$((PERFORMANCE_SCORE))
    local max_score=$((TOTAL_TESTS * 25))
    local percentage=$((final_score * 100 / max_score))
    
    log "Performance testing completed!"
    log "Final Score: $final_score/$max_score ($percentage%)"
    log "Results saved to: $RESULTS_DIR/$TIMESTAMP"
    
    if [ $percentage -ge 75 ]; then
        success "Performance benchmark PASSED! 🎉"
        return 0
    else
        error "Performance benchmark FAILED. Optimization needed."
        return 1
    fi
}

# Handle script interruption
cleanup() {
    log "Performance benchmark interrupted"
    exit 1
}

trap cleanup INT TERM

# Run main function
main "$@"
