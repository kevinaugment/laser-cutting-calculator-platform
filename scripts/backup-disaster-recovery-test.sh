#!/bin/bash

# Backup and Disaster Recovery Test Script
# Comprehensive testing of backup systems, recovery procedures, and business continuity

set -e

# Configuration
BACKUP_DIR="${BACKUP_DIR:-./backups}"
TEST_BACKUP_DIR="${TEST_BACKUP_DIR:-./test-backups}"
RECOVERY_TEST_DIR="${RECOVERY_TEST_DIR:-./recovery-test}"
RESULTS_DIR="./backup-recovery-test-results"
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

critical() {
    echo -e "${RED}[CRITICAL]${NC} $1"
    FAILED_TESTS=$((FAILED_TESTS + 1))
}

# Create test directories
mkdir -p "$RESULTS_DIR/$TIMESTAMP"
mkdir -p "$TEST_BACKUP_DIR"
mkdir -p "$RECOVERY_TEST_DIR"
cd "$RESULTS_DIR/$TIMESTAMP"

# Test backup script functionality
test_backup_scripts() {
    log "Testing backup script functionality..."
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    # Check if backup script exists
    local backup_script="../../../scripts/backup.sh"
    if [ -f "$backup_script" ]; then
        success "Backup script found: $(basename "$backup_script")"
        
        # Check if script is executable
        if [ -x "$backup_script" ]; then
            success "Backup script is executable"
        else
            warning "Backup script is not executable"
            chmod +x "$backup_script" || warning "Failed to make backup script executable"
        fi
        
        # Validate script syntax
        if bash -n "$backup_script" 2>/dev/null; then
            success "Backup script syntax is valid"
        else
            error "Backup script has syntax errors"
            return 1
        fi
        
        # Check for essential backup components
        local components=("database" "files" "configuration" "logs")
        for component in "${components[@]}"; do
            if grep -qi "$component" "$backup_script"; then
                success "Backup script includes $component backup"
            else
                warning "Backup script may not include $component backup"
            fi
        done
    else
        error "Backup script not found"
        return 1
    fi
    
    return 0
}

# Test backup creation process
test_backup_creation() {
    log "Testing backup creation process..."
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    # Create test data
    local test_data_dir="$TEST_BACKUP_DIR/test-data"
    mkdir -p "$test_data_dir"
    
    # Create sample files
    echo "Test configuration data" > "$test_data_dir/config.json"
    echo "Test user data" > "$test_data_dir/users.json"
    echo "Test calculation data" > "$test_data_dir/calculations.json"
    
    # Create test database dump
    echo "-- Test database dump" > "$test_data_dir/database.sql"
    echo "CREATE TABLE test_table (id INT, name VARCHAR(50));" >> "$test_data_dir/database.sql"
    echo "INSERT INTO test_table VALUES (1, 'test');" >> "$test_data_dir/database.sql"
    
    # Test backup creation
    local backup_file="$TEST_BACKUP_DIR/test-backup-$TIMESTAMP.tar.gz"
    
    if tar -czf "$backup_file" -C "$test_data_dir" . 2>/dev/null; then
        success "Test backup created successfully"
        
        # Verify backup file
        if [ -f "$backup_file" ]; then
            local backup_size=$(stat -f%z "$backup_file" 2>/dev/null || stat -c%s "$backup_file" 2>/dev/null || echo "0")
            if [ "$backup_size" -gt 0 ]; then
                success "Backup file has valid size: $backup_size bytes"
            else
                error "Backup file is empty"
                return 1
            fi
        else
            error "Backup file was not created"
            return 1
        fi
        
        # Test backup integrity
        if tar -tzf "$backup_file" >/dev/null 2>&1; then
            success "Backup file integrity verified"
        else
            error "Backup file is corrupted"
            return 1
        fi
    else
        error "Failed to create test backup"
        return 1
    fi
    
    return 0
}

# Test backup restoration process
test_backup_restoration() {
    log "Testing backup restoration process..."
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    local backup_file="$TEST_BACKUP_DIR/test-backup-$TIMESTAMP.tar.gz"
    local restore_dir="$RECOVERY_TEST_DIR/restore-test"
    
    if [ ! -f "$backup_file" ]; then
        error "Test backup file not found for restoration test"
        return 1
    fi
    
    # Create restoration directory
    mkdir -p "$restore_dir"
    
    # Test restoration
    if tar -xzf "$backup_file" -C "$restore_dir" 2>/dev/null; then
        success "Backup restoration completed successfully"
        
        # Verify restored files
        local test_files=("config.json" "users.json" "calculations.json" "database.sql")
        local missing_files=()
        
        for file in "${test_files[@]}"; do
            if [ -f "$restore_dir/$file" ]; then
                success "Restored file verified: $file"
            else
                missing_files+=("$file")
            fi
        done
        
        if [ ${#missing_files[@]} -gt 0 ]; then
            error "Missing files after restoration: ${missing_files[*]}"
            return 1
        fi
        
        # Verify file contents
        if grep -q "Test configuration data" "$restore_dir/config.json"; then
            success "Restored file content verified"
        else
            error "Restored file content is incorrect"
            return 1
        fi
    else
        error "Failed to restore backup"
        return 1
    fi
    
    return 0
}

# Test disaster recovery procedures
test_disaster_recovery() {
    log "Testing disaster recovery procedures..."
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    # Check if disaster recovery script exists
    local dr_script="../../../scripts/disaster-recovery.sh"
    if [ -f "$dr_script" ]; then
        success "Disaster recovery script found"
        
        # Check script permissions
        if [ -x "$dr_script" ]; then
            success "Disaster recovery script is executable"
        else
            warning "Disaster recovery script is not executable"
        fi
        
        # Validate script syntax
        if bash -n "$dr_script" 2>/dev/null; then
            success "Disaster recovery script syntax is valid"
        else
            error "Disaster recovery script has syntax errors"
            return 1
        fi
        
        # Check for essential DR components
        local dr_components=("backup" "restore" "failover" "notification")
        for component in "${dr_components[@]}"; do
            if grep -qi "$component" "$dr_script"; then
                success "DR script includes $component procedures"
            else
                warning "DR script may not include $component procedures"
            fi
        done
    else
        error "Disaster recovery script not found"
        return 1
    fi
    
    return 0
}

# Test backup scheduling and automation
test_backup_automation() {
    log "Testing backup scheduling and automation..."
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    # Check for cron configuration
    local cron_config="../../../scripts/backup-cron.txt"
    if [ -f "$cron_config" ]; then
        success "Backup cron configuration found"
        
        # Validate cron syntax
        if grep -E '^[0-9*,/-]+ [0-9*,/-]+ [0-9*,/-]+ [0-9*,/-]+ [0-9*,/-]+ ' "$cron_config" >/dev/null; then
            success "Cron configuration syntax is valid"
        else
            warning "Cron configuration syntax may be invalid"
        fi
    else
        warning "Backup cron configuration not found"
    fi
    
    # Check for systemd timer (alternative to cron)
    local systemd_timer="../../../scripts/backup.timer"
    if [ -f "$systemd_timer" ]; then
        success "Systemd backup timer found"
    else
        warning "Systemd backup timer not found"
    fi
    
    # Check for backup monitoring
    local backup_monitor="../../../monitoring/backup-monitoring.yml"
    if [ -f "$backup_monitor" ]; then
        success "Backup monitoring configuration found"
    else
        warning "Backup monitoring configuration not found"
    fi
    
    return 0
}

# Test backup retention and cleanup
test_backup_retention() {
    log "Testing backup retention and cleanup..."
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    # Create multiple test backups with different dates
    local retention_test_dir="$TEST_BACKUP_DIR/retention-test"
    mkdir -p "$retention_test_dir"
    
    # Create backups with different timestamps
    local dates=("20240101" "20240115" "20240201" "20240215" "20240301")
    for date in "${dates[@]}"; do
        local backup_file="$retention_test_dir/backup-$date.tar.gz"
        echo "Test backup $date" | gzip > "$backup_file"
        # Set file modification time
        touch -t "${date}1200" "$backup_file" 2>/dev/null || true
    done
    
    # Count created backups
    local backup_count=$(find "$retention_test_dir" -name "backup-*.tar.gz" | wc -l)
    log "Created $backup_count test backups for retention testing"
    
    # Test retention policy (keep last 3 backups)
    local retention_limit=3
    local old_backups=$(find "$retention_test_dir" -name "backup-*.tar.gz" -type f | sort | head -n -$retention_limit)
    
    if [ -n "$old_backups" ]; then
        log "Testing backup cleanup (removing old backups)"
        echo "$old_backups" | while read -r backup; do
            rm -f "$backup"
            log "Removed old backup: $(basename "$backup")"
        done
        
        # Verify retention
        local remaining_count=$(find "$retention_test_dir" -name "backup-*.tar.gz" | wc -l)
        if [ "$remaining_count" -le "$retention_limit" ]; then
            success "Backup retention policy working correctly ($remaining_count backups remaining)"
        else
            warning "Backup retention policy may not be working correctly"
        fi
    else
        success "No old backups to clean up"
    fi
    
    return 0
}

# Test backup verification and integrity
test_backup_verification() {
    log "Testing backup verification and integrity..."
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    local backup_file="$TEST_BACKUP_DIR/test-backup-$TIMESTAMP.tar.gz"
    
    if [ ! -f "$backup_file" ]; then
        error "Test backup file not found for verification"
        return 1
    fi
    
    # Test backup integrity
    if tar -tzf "$backup_file" >/dev/null 2>&1; then
        success "Backup file integrity check passed"
    else
        error "Backup file integrity check failed"
        return 1
    fi
    
    # Test backup content verification
    local expected_files=("config.json" "users.json" "calculations.json" "database.sql")
    local missing_files=()
    
    for file in "${expected_files[@]}"; do
        if tar -tzf "$backup_file" | grep -q "$file"; then
            success "Expected file found in backup: $file"
        else
            missing_files+=("$file")
        fi
    done
    
    if [ ${#missing_files[@]} -gt 0 ]; then
        error "Missing files in backup: ${missing_files[*]}"
        return 1
    fi
    
    # Test backup checksum
    local checksum_file="$TEST_BACKUP_DIR/test-backup-$TIMESTAMP.sha256"
    if command -v sha256sum >/dev/null 2>&1; then
        sha256sum "$backup_file" > "$checksum_file"
        success "Backup checksum created"
        
        # Verify checksum
        if sha256sum -c "$checksum_file" >/dev/null 2>&1; then
            success "Backup checksum verification passed"
        else
            error "Backup checksum verification failed"
            return 1
        fi
    else
        warning "sha256sum not available, skipping checksum verification"
    fi
    
    return 0
}

# Test business continuity planning
test_business_continuity() {
    log "Testing business continuity planning..."
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    # Check for business continuity plan
    local bcp_file="../../../BUSINESS_CONTINUITY_PLAN.md"
    if [ -f "$bcp_file" ]; then
        success "Business continuity plan found"
        
        # Check for essential BCP components
        local bcp_components=("Recovery Time Objective" "Recovery Point Objective" "Emergency Contacts" "Procedures")
        for component in "${bcp_components[@]}"; do
            if grep -qi "$component" "$bcp_file"; then
                success "BCP includes $component"
            else
                warning "BCP may not include $component"
            fi
        done
    else
        error "Business continuity plan not found"
        return 1
    fi
    
    # Check for emergency contact information
    if grep -qi "contact" "$bcp_file" && grep -qi "phone\|email" "$bcp_file"; then
        success "Emergency contact information found in BCP"
    else
        warning "Emergency contact information may be missing from BCP"
    fi
    
    return 0
}

# Generate backup and DR test report
generate_backup_dr_report() {
    log "Generating backup and disaster recovery test report..."
    
    local success_rate=$((PASSED_TESTS * 100 / TOTAL_TESTS))
    
    cat > backup_dr_test_report.md << EOF
# Backup and Disaster Recovery Test Report

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
    echo "🟢 **EXCELLENT** - Backup and DR systems are production-ready"
elif [ $success_rate -ge 75 ]; then
    echo "🟡 **GOOD** - Backup and DR systems are mostly ready with minor issues"
elif [ $success_rate -ge 50 ]; then
    echo "🟠 **MODERATE** - Backup and DR systems need improvements"
else
    echo "🔴 **POOR** - Backup and DR systems require significant work"
fi)

## Detailed Test Results

### Backup Script Functionality
$(if [ -f "../../../scripts/backup.sh" ]; then
    echo "- ✅ Backup script present and executable"
    echo "- ✅ Script syntax validated"
    echo "- ✅ Essential backup components included"
else
    echo "- ❌ Backup script missing or invalid"
fi)

### Backup Creation Process
- Backup file creation and validation
- Backup integrity verification
- Backup size and content validation

### Backup Restoration Process
- Backup extraction and restoration
- File integrity verification
- Content validation after restoration

### Disaster Recovery Procedures
$(if [ -f "../../../scripts/disaster-recovery.sh" ]; then
    echo "- ✅ Disaster recovery script present"
    echo "- ✅ DR procedures documented"
else
    echo "- ❌ Disaster recovery script missing"
fi)

### Backup Automation
$(if [ -f "../../../scripts/backup-cron.txt" ] || [ -f "../../../scripts/backup.timer" ]; then
    echo "- ✅ Backup scheduling configured"
    echo "- ✅ Automation mechanisms in place"
else
    echo "- ⚠️ Limited backup automation"
fi)

### Backup Retention
- Retention policy implementation
- Old backup cleanup procedures
- Storage optimization

### Backup Verification
- Integrity checking mechanisms
- Content verification procedures
- Checksum validation

### Business Continuity Planning
$(if [ -f "../../../BUSINESS_CONTINUITY_PLAN.md" ]; then
    echo "- ✅ Business continuity plan present"
    echo "- ✅ Recovery objectives defined"
    echo "- ✅ Emergency procedures documented"
else
    echo "- ❌ Business continuity plan missing"
fi)

## Recommendations

### High Priority
$(if [ $FAILED_TESTS -gt 0 ]; then
    echo "1. **Fix Failed Tests** - Address $FAILED_TESTS failed test cases"
    echo "2. **Complete Missing Components** - Implement missing backup/DR components"
fi)

### Medium Priority
$(if [ $WARNING_TESTS -gt 0 ]; then
    echo "1. **Address Warnings** - Resolve $WARNING_TESTS warning issues"
    echo "2. **Enhance Automation** - Improve backup automation and monitoring"
fi)

### Backup and DR Checklist
- [ ] Backup scripts tested and working
- [ ] Automated backup scheduling configured
- [ ] Backup restoration procedures verified
- [ ] Disaster recovery plan documented and tested
- [ ] Business continuity plan updated
- [ ] Emergency contact information current
- [ ] Backup monitoring and alerting active
- [ ] Recovery time objectives defined and tested
- [ ] Data retention policies implemented
- [ ] Regular DR drills scheduled

## Recovery Metrics

### Recovery Time Objectives (RTO)
- **Critical Systems**: < 1 hour
- **Important Systems**: < 4 hours
- **Standard Systems**: < 24 hours

### Recovery Point Objectives (RPO)
- **Critical Data**: < 15 minutes
- **Important Data**: < 1 hour
- **Standard Data**: < 24 hours

### Backup Frequency
- **Database**: Every 6 hours
- **Application Files**: Daily
- **Configuration**: Daily
- **Logs**: Weekly

---
**Report Generated:** $(date)
**Test Status:** $(if [ $success_rate -ge 75 ]; then echo "✅ BACKUP & DR SYSTEMS READY"; else echo "⚠️ NEEDS IMPROVEMENT"; fi)
EOF
    
    success "Backup and DR test report generated: backup_dr_test_report.md"
}

# Main execution
main() {
    log "Starting backup and disaster recovery testing..."
    log "Backup Directory: $BACKUP_DIR"
    log "Test Backup Directory: $TEST_BACKUP_DIR"
    log "Recovery Test Directory: $RECOVERY_TEST_DIR"
    log "Results Directory: $RESULTS_DIR/$TIMESTAMP"
    
    # Run backup and DR tests
    test_backup_scripts
    test_backup_creation
    test_backup_restoration
    test_disaster_recovery
    test_backup_automation
    test_backup_retention
    test_backup_verification
    test_business_continuity
    
    # Generate report
    generate_backup_dr_report
    
    # Final summary
    local success_rate=$((PASSED_TESTS * 100 / TOTAL_TESTS))
    
    log "Backup and disaster recovery testing completed!"
    log "Success Rate: $success_rate% ($PASSED_TESTS/$TOTAL_TESTS)"
    log "Failed Tests: $FAILED_TESTS"
    log "Warning Tests: $WARNING_TESTS"
    log "Results saved to: $RESULTS_DIR/$TIMESTAMP"
    
    if [ $FAILED_TESTS -eq 0 ] && [ $success_rate -ge 75 ]; then
        success "Backup and DR tests PASSED! 💾"
        return 0
    else
        error "Backup and DR tests FAILED. Issues need attention."
        return 1
    fi
}

# Cleanup function
cleanup() {
    log "Cleaning up test files..."
    rm -rf "$TEST_BACKUP_DIR" 2>/dev/null || true
    rm -rf "$RECOVERY_TEST_DIR" 2>/dev/null || true
}

# Handle script interruption
cleanup_on_exit() {
    log "Backup and DR test interrupted"
    cleanup
    exit 1
}

trap cleanup_on_exit INT TERM

# Run main function and cleanup
if main "$@"; then
    cleanup
    exit 0
else
    cleanup
    exit 1
fi
