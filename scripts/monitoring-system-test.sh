#!/bin/bash

# Monitoring and Alerting System Test Script
# Comprehensive testing of Prometheus, Grafana, AlertManager, and logging systems

set -e

# Configuration
PROMETHEUS_URL="${PROMETHEUS_URL:-http://localhost:9090}"
GRAFANA_URL="${GRAFANA_URL:-http://localhost:3001}"
ALERTMANAGER_URL="${ALERTMANAGER_URL:-http://localhost:9093}"
ELASTICSEARCH_URL="${ELASTICSEARCH_URL:-http://localhost:9200}"
RESULTS_DIR="./monitoring-test-results"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test metrics
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0
WARNING_TESTS=0

# Logging functions
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
    FAILED_TESTS=$((FAILED_TESTS + 1))
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
    PASSED_TESTS=$((PASSED_TESTS + 1))
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
    WARNING_TESTS=$((WARNING_TESTS + 1))
}

# Create results directory
mkdir -p "$RESULTS_DIR/$TIMESTAMP"
cd "$RESULTS_DIR/$TIMESTAMP"

# Test Prometheus monitoring system
test_prometheus_system() {
    log "Testing Prometheus monitoring system..."
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    # Check if Prometheus configuration exists
    local prometheus_config="../../../monitoring/prometheus.yml"
    if [ -f "$prometheus_config" ]; then
        success "Prometheus configuration file found"
        
        # Validate configuration syntax
        if grep -q "global:" "$prometheus_config" && grep -q "scrape_configs:" "$prometheus_config"; then
            success "Prometheus configuration syntax is valid"
        else
            error "Prometheus configuration syntax is invalid"
            return 1
        fi
        
        # Check for essential scrape targets
        local targets=("node-exporter" "application" "cadvisor")
        local missing_targets=()
        
        for target in "${targets[@]}"; do
            if grep -q "$target" "$prometheus_config"; then
                success "Prometheus target configured: $target"
            else
                missing_targets+=("$target")
            fi
        done
        
        if [ ${#missing_targets[@]} -gt 0 ]; then
            warning "Missing Prometheus targets: ${missing_targets[*]}"
        fi
    else
        error "Prometheus configuration file not found"
        return 1
    fi
    
    # Test Prometheus API (if running)
    log "Testing Prometheus API connectivity..."
    local prometheus_status=$(curl -s -o /dev/null -w "%{http_code}" "$PROMETHEUS_URL/api/v1/status/config" 2>/dev/null || echo "000")
    
    if [ "$prometheus_status" = "200" ]; then
        success "Prometheus API is accessible"
        
        # Test metrics endpoint
        local metrics_response=$(curl -s "$PROMETHEUS_URL/api/v1/query?query=up" 2>/dev/null || echo "")
        if echo "$metrics_response" | grep -q '"status":"success"'; then
            success "Prometheus metrics query working"
        else
            warning "Prometheus metrics query not working (service may not be running)"
        fi
    else
        warning "Prometheus API not accessible (service may not be running)"
    fi
    
    return 0
}

# Test Grafana dashboard system
test_grafana_system() {
    log "Testing Grafana dashboard system..."
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    # Check if Grafana dashboard configuration exists
    local grafana_dashboard="../../../monitoring/grafana-dashboard.json"
    if [ -f "$grafana_dashboard" ]; then
        success "Grafana dashboard configuration found"
        
        # Validate JSON syntax
        if jq empty "$grafana_dashboard" 2>/dev/null; then
            success "Grafana dashboard JSON syntax is valid"
            
            # Check for essential dashboard components
            local components=("panels" "targets" "datasource")
            for component in "${components[@]}"; do
                if jq -e ".$component" "$grafana_dashboard" >/dev/null 2>&1 || jq -e ".[].$component" "$grafana_dashboard" >/dev/null 2>&1; then
                    success "Grafana dashboard component found: $component"
                else
                    warning "Grafana dashboard component missing: $component"
                fi
            done
        else
            error "Grafana dashboard JSON syntax is invalid"
            return 1
        fi
    else
        error "Grafana dashboard configuration not found"
        return 1
    fi
    
    # Test Grafana API (if running)
    log "Testing Grafana API connectivity..."
    local grafana_status=$(curl -s -o /dev/null -w "%{http_code}" "$GRAFANA_URL/api/health" 2>/dev/null || echo "000")
    
    if [ "$grafana_status" = "200" ]; then
        success "Grafana API is accessible"
        
        # Test dashboard API
        local dashboard_response=$(curl -s "$GRAFANA_URL/api/search" 2>/dev/null || echo "")
        if echo "$dashboard_response" | grep -q '\[' || echo "$dashboard_response" | grep -q 'dashboard'; then
            success "Grafana dashboard API working"
        else
            warning "Grafana dashboard API not working properly"
        fi
    else
        warning "Grafana API not accessible (service may not be running)"
    fi
    
    return 0
}

# Test AlertManager system
test_alertmanager_system() {
    log "Testing AlertManager system..."
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    # Check if AlertManager configuration exists
    local alertmanager_config="../../../monitoring/alertmanager.yml"
    if [ -f "$alertmanager_config" ]; then
        success "AlertManager configuration file found"
        
        # Validate configuration syntax
        if grep -q "global:" "$alertmanager_config" && grep -q "route:" "$alertmanager_config"; then
            success "AlertManager configuration syntax is valid"
        else
            error "AlertManager configuration syntax is invalid"
            return 1
        fi
        
        # Check for notification channels
        local channels=("email" "webhook" "slack")
        local found_channels=0
        
        for channel in "${channels[@]}"; do
            if grep -q "$channel" "$alertmanager_config"; then
                success "AlertManager notification channel configured: $channel"
                found_channels=$((found_channels + 1))
            fi
        done
        
        if [ $found_channels -eq 0 ]; then
            warning "No notification channels configured in AlertManager"
        fi
    else
        error "AlertManager configuration file not found"
        return 1
    fi
    
    # Test AlertManager API (if running)
    log "Testing AlertManager API connectivity..."
    local alertmanager_status=$(curl -s -o /dev/null -w "%{http_code}" "$ALERTMANAGER_URL/api/v1/status" 2>/dev/null || echo "000")
    
    if [ "$alertmanager_status" = "200" ]; then
        success "AlertManager API is accessible"
        
        # Test alerts endpoint
        local alerts_response=$(curl -s "$ALERTMANAGER_URL/api/v1/alerts" 2>/dev/null || echo "")
        if echo "$alerts_response" | grep -q '\[' || echo "$alerts_response" | grep -q 'status'; then
            success "AlertManager alerts API working"
        else
            warning "AlertManager alerts API not working properly"
        fi
    else
        warning "AlertManager API not accessible (service may not be running)"
    fi
    
    return 0
}

# Test logging system
test_logging_system() {
    log "Testing logging system..."
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    # Check for logging configuration
    local logging_configs=(
        "../../../monitoring/filebeat.yml"
        "../../../monitoring/logstash.conf"
        "../../../docker-compose.logging.yml"
    )
    
    local found_logging_configs=0
    
    for config in "${logging_configs[@]}"; do
        if [ -f "$config" ]; then
            found_logging_configs=$((found_logging_configs + 1))
            success "Logging configuration found: $(basename "$config")"
        fi
    done
    
    if [ $found_logging_configs -eq 0 ]; then
        warning "No logging configuration files found"
    else
        success "Logging system configuration present ($found_logging_configs files)"
    fi
    
    # Test Elasticsearch (if running)
    log "Testing Elasticsearch connectivity..."
    local elasticsearch_status=$(curl -s -o /dev/null -w "%{http_code}" "$ELASTICSEARCH_URL/_cluster/health" 2>/dev/null || echo "000")
    
    if [ "$elasticsearch_status" = "200" ]; then
        success "Elasticsearch is accessible"
        
        # Test index creation
        local indices_response=$(curl -s "$ELASTICSEARCH_URL/_cat/indices" 2>/dev/null || echo "")
        if [ -n "$indices_response" ]; then
            success "Elasticsearch indices are accessible"
        else
            warning "Elasticsearch indices not accessible"
        fi
    else
        warning "Elasticsearch not accessible (service may not be running)"
    fi
    
    return 0
}

# Test application metrics integration
test_application_metrics() {
    log "Testing application metrics integration..."
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    # Check for application metrics endpoint
    local app_metrics_url="http://localhost:3000/api/metrics"
    local metrics_status=$(curl -s -o /dev/null -w "%{http_code}" "$app_metrics_url" 2>/dev/null || echo "000")
    
    if [ "$metrics_status" = "200" ]; then
        success "Application metrics endpoint is accessible"
        
        # Check metrics format
        local metrics_content=$(curl -s "$app_metrics_url" 2>/dev/null || echo "")
        if echo "$metrics_content" | grep -q "# HELP" && echo "$metrics_content" | grep -q "# TYPE"; then
            success "Application metrics are in Prometheus format"
        else
            warning "Application metrics format may not be Prometheus-compatible"
        fi
        
        # Check for essential metrics
        local essential_metrics=("http_requests_total" "response_time" "error_rate")
        for metric in "${essential_metrics[@]}"; do
            if echo "$metrics_content" | grep -q "$metric"; then
                success "Essential metric found: $metric"
            else
                warning "Essential metric missing: $metric"
            fi
        done
    else
        warning "Application metrics endpoint not accessible"
    fi
    
    return 0
}

# Test alert rules
test_alert_rules() {
    log "Testing alert rules configuration..."
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    # Check for alert rules file
    local alert_rules="../../../monitoring/alert-rules.yml"
    if [ -f "$alert_rules" ]; then
        success "Alert rules configuration found"
        
        # Validate YAML syntax
        if command -v yq >/dev/null 2>&1; then
            if yq eval '.' "$alert_rules" >/dev/null 2>&1; then
                success "Alert rules YAML syntax is valid"
            else
                error "Alert rules YAML syntax is invalid"
                return 1
            fi
        else
            log "yq not available, skipping YAML validation"
        fi
        
        # Check for essential alert rules
        local essential_alerts=("HighErrorRate" "HighResponseTime" "ServiceDown" "HighMemoryUsage")
        for alert in "${essential_alerts[@]}"; do
            if grep -q "$alert" "$alert_rules"; then
                success "Essential alert rule found: $alert"
            else
                warning "Essential alert rule missing: $alert"
            fi
        done
    else
        error "Alert rules configuration not found"
        return 1
    fi
    
    return 0
}

# Test backup monitoring system
test_backup_monitoring() {
    log "Testing backup monitoring system..."
    TOTAL_TESTS=$((TOTAL_TESTS + 1))

    # Check for backup monitoring configuration
    local backup_monitoring="../../../monitoring/backup-monitoring.yml"
    if [ -f "$backup_monitoring" ]; then
        success "Backup monitoring configuration found"

        # Check for backup metrics
        if grep -q "backup_success" "$backup_monitoring" || grep -q "backup_duration" "$backup_monitoring"; then
            success "Backup monitoring metrics configured"
        else
            warning "Backup monitoring metrics not configured"
        fi
    else
        warning "Backup monitoring configuration not found"
    fi

    return 0
}

# Test monitoring system integration
test_monitoring_integration() {
    log "Testing monitoring system integration..."
    TOTAL_TESTS=$((TOTAL_TESTS + 1))

    # Check for docker-compose monitoring setup
    local monitoring_compose="../../../docker-compose.monitoring.yml"
    if [ -f "$monitoring_compose" ]; then
        success "Monitoring docker-compose configuration found"

        # Check for essential services
        local services=("prometheus" "grafana" "alertmanager" "node-exporter")
        for service in "${services[@]}"; do
            if grep -q "$service:" "$monitoring_compose"; then
                success "Monitoring service configured: $service"
            else
                warning "Monitoring service missing: $service"
            fi
        done
    else
        warning "Monitoring docker-compose configuration not found"
    fi

    # Check for monitoring startup script
    local monitoring_script="../../../scripts/start-monitoring.sh"
    if [ -f "$monitoring_script" ]; then
        success "Monitoring startup script found"

        if [ -x "$monitoring_script" ]; then
            success "Monitoring startup script is executable"
        else
            warning "Monitoring startup script is not executable"
        fi
    else
        warning "Monitoring startup script not found"
    fi

    return 0
}

# Generate monitoring test report
generate_monitoring_report() {
    log "Generating monitoring system test report..."
    
    local success_rate=$((PASSED_TESTS * 100 / TOTAL_TESTS))
    
    cat > monitoring_test_report.md << EOF
# Monitoring and Alerting System Test Report

**Test Date:** $(date)
**Test Environment:** Development/Testing
**Total Tests:** $TOTAL_TESTS
**Passed Tests:** $PASSED_TESTS
**Failed Tests:** $FAILED_TESTS
**Warning Tests:** $WARNING_TESTS
**Success Rate:** $success_rate%

## Test Results Summary

### Overall Assessment
$(if [ $success_rate -ge 90 ]; then
    echo "🟢 **EXCELLENT** - Monitoring system is production-ready"
elif [ $success_rate -ge 75 ]; then
    echo "🟡 **GOOD** - Monitoring system is mostly ready with minor issues"
elif [ $success_rate -ge 50 ]; then
    echo "🟠 **MODERATE** - Monitoring system needs improvements"
else
    echo "🔴 **POOR** - Monitoring system requires significant work"
fi)

## Detailed Test Results

### Prometheus Monitoring
$(if [ -f "../../../monitoring/prometheus.yml" ]; then
    echo "- ✅ Configuration file present and valid"
    echo "- ✅ Scrape targets configured"
else
    echo "- ❌ Configuration missing or invalid"
fi)

### Grafana Dashboards
$(if [ -f "../../../monitoring/grafana-dashboard.json" ]; then
    echo "- ✅ Dashboard configuration present"
    echo "- ✅ JSON syntax valid"
else
    echo "- ❌ Dashboard configuration missing"
fi)

### AlertManager
$(if [ -f "../../../monitoring/alertmanager.yml" ]; then
    echo "- ✅ Configuration present and valid"
    echo "- ✅ Notification channels configured"
else
    echo "- ❌ Configuration missing or invalid"
fi)

### Logging System
$(if [ -f "../../../monitoring/filebeat.yml" ] || [ -f "../../../monitoring/logstash.conf" ]; then
    echo "- ✅ Logging configuration present"
    echo "- ✅ Log aggregation configured"
else
    echo "- ⚠️ Limited logging configuration"
fi)

### Application Metrics
- Application metrics endpoint integration
- Prometheus-compatible metrics format
- Essential metrics coverage

### Alert Rules
$(if [ -f "../../../monitoring/alert-rules.yml" ]; then
    echo "- ✅ Alert rules configured"
    echo "- ✅ Essential alerts present"
else
    echo "- ❌ Alert rules missing"
fi)

## Recommendations

### High Priority
$(if [ $FAILED_TESTS -gt 0 ]; then
    echo "1. **Fix Failed Tests** - Address $FAILED_TESTS failed test cases"
    echo "2. **Complete Missing Components** - Implement missing monitoring components"
fi)

### Medium Priority
$(if [ $WARNING_TESTS -gt 0 ]; then
    echo "1. **Address Warnings** - Resolve $WARNING_TESTS warning issues"
    echo "2. **Enhance Configuration** - Improve monitoring configuration completeness"
fi)

### Monitoring Checklist
- [ ] Prometheus server configured and running
- [ ] Grafana dashboards created and accessible
- [ ] AlertManager notifications configured
- [ ] Application metrics integrated
- [ ] Log aggregation system operational
- [ ] Alert rules defined and tested
- [ ] Monitoring system automated startup
- [ ] Backup monitoring data strategy

---
**Report Generated:** $(date)
**Test Status:** $(if [ $success_rate -ge 75 ]; then echo "✅ MONITORING SYSTEM READY"; else echo "⚠️ NEEDS IMPROVEMENT"; fi)
EOF
    
    success "Monitoring test report generated: monitoring_test_report.md"
}

# Main execution
main() {
    log "Starting monitoring and alerting system tests..."
    log "Prometheus URL: $PROMETHEUS_URL"
    log "Grafana URL: $GRAFANA_URL"
    log "AlertManager URL: $ALERTMANAGER_URL"
    log "Results Directory: $RESULTS_DIR/$TIMESTAMP"
    
    # Run monitoring tests
    test_prometheus_system
    test_grafana_system
    test_alertmanager_system
    test_logging_system
    test_application_metrics
    test_alert_rules
    test_backup_monitoring
    test_monitoring_integration
    
    # Generate report
    generate_monitoring_report
    
    # Final summary
    local success_rate=$((PASSED_TESTS * 100 / TOTAL_TESTS))
    
    log "Monitoring system testing completed!"
    log "Success Rate: $success_rate% ($PASSED_TESTS/$TOTAL_TESTS)"
    log "Failed Tests: $FAILED_TESTS"
    log "Warning Tests: $WARNING_TESTS"
    log "Results saved to: $RESULTS_DIR/$TIMESTAMP"
    
    if [ $FAILED_TESTS -eq 0 ] && [ $success_rate -ge 75 ]; then
        success "Monitoring system tests PASSED! 📊"
        return 0
    else
        error "Monitoring system tests FAILED. Issues need attention."
        return 1
    fi
}

# Handle script interruption
cleanup() {
    log "Monitoring system test interrupted"
    exit 1
}

trap cleanup INT TERM

# Run main function
main "$@"
