#!/bin/bash

# Backup Validation Script for Laser Cutting Calculator
# Comprehensive backup testing and validation system

set -e

# Configuration
VALIDATION_TYPE="${1:-full}"  # full, quick, integrity, restore-test
BACKUP_SOURCE="${2:-local}"   # local, s3, gcs, azure
TEST_ENVIRONMENT="${TEST_ENVIRONMENT:-validation}"
VALIDATION_DIR="${VALIDATION_DIR:-/var/validation/laser-calc}"

# Backup configuration
BACKUP_DIR="${BACKUP_DIR:-/var/backups/laser-calc}"
S3_BUCKET="${S3_BUCKET:-laser-calc-backups}"
GCS_BUCKET="${GCS_BUCKET:-laser-calc-backups-gcs}"
AZURE_CONTAINER="${AZURE_CONTAINER:-laser-calc-backups}"

# Test database configuration
TEST_DB_HOST="${TEST_DB_HOST:-localhost}"
TEST_DB_PORT="${TEST_DB_PORT:-5433}"  # Different port for test instance
TEST_DB_NAME="${TEST_DB_NAME:-laser_calc_test}"
TEST_DB_USER="${TEST_DB_USER:-test_user}"
TEST_DB_PASSWORD="${TEST_DB_PASSWORD:-test_password}"

# Monitoring and alerting
WEBHOOK_URL="${WEBHOOK_URL:-}"
SLACK_WEBHOOK="${SLACK_WEBHOOK:-}"
EMAIL_RECIPIENTS="${EMAIL_RECIPIENTS:-admin@lasercalc.com}"

# Logging
LOG_FILE="${VALIDATION_DIR}/validation.log"
ERROR_LOG="${VALIDATION_DIR}/validation_errors.log"
VALIDATION_REPORT="${VALIDATION_DIR}/validation_report.json"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Global variables
VALIDATION_START_TIME=$(date +%s)
VALIDATION_SUCCESS=true
TESTED_BACKUPS=()
FAILED_TESTS=()
VALIDATION_RESULTS=()

# Logging functions
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$ERROR_LOG" >&2
    VALIDATION_SUCCESS=false
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" | tee -a "$LOG_FILE"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$LOG_FILE"
}

# Send notifications
send_notification() {
    local message="$1"
    local severity="${2:-info}"
    
    # Slack notification
    if [ -n "$SLACK_WEBHOOK" ]; then
        local color="good"
        case $severity in
            warning) color="warning" ;;
            error) color="danger" ;;
        esac
        
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"attachments\":[{\"color\":\"$color\",\"text\":\"🔍 BACKUP VALIDATION: $message\"}]}" \
            "$SLACK_WEBHOOK" 2>/dev/null || true
    fi
}

# Setup validation environment
setup_validation_environment() {
    log "Setting up validation environment..."
    
    # Create validation directories
    mkdir -p "$VALIDATION_DIR"/{downloads,temp,reports,test-data}
    
    # Check dependencies
    local deps=("pg_dump" "pg_restore" "psql" "redis-cli" "docker" "jq")
    local missing_deps=()
    
    for dep in "${deps[@]}"; do
        if ! command -v "$dep" >/dev/null 2>&1; then
            missing_deps+=("$dep")
        fi
    done
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        error "Missing dependencies: ${missing_deps[*]}"
        exit 1
    fi
    
    # Setup test database if needed
    if [ "$VALIDATION_TYPE" = "full" ] || [ "$VALIDATION_TYPE" = "restore-test" ]; then
        setup_test_database
    fi
    
    success "Validation environment setup completed"
}

# Setup test database instance
setup_test_database() {
    log "Setting up test database instance..."
    
    # Check if test database instance is running
    if ! pg_isready -h "$TEST_DB_HOST" -p "$TEST_DB_PORT" >/dev/null 2>&1; then
        log "Starting test PostgreSQL instance..."
        
        # Start test database container
        docker run -d --name postgres-test \
            -e POSTGRES_DB="$TEST_DB_NAME" \
            -e POSTGRES_USER="$TEST_DB_USER" \
            -e POSTGRES_PASSWORD="$TEST_DB_PASSWORD" \
            -p "$TEST_DB_PORT:5432" \
            postgres:13-alpine || {
            error "Failed to start test database instance"
            return 1
        }
        
        # Wait for database to be ready
        local timeout=60
        local elapsed=0
        while ! pg_isready -h "$TEST_DB_HOST" -p "$TEST_DB_PORT" >/dev/null 2>&1; do
            if [ $elapsed -ge $timeout ]; then
                error "Test database failed to start within timeout"
                return 1
            fi
            sleep 2
            elapsed=$((elapsed + 2))
        done
    fi
    
    success "Test database instance is ready"
}

# Get backup files for validation
get_backup_files() {
    log "Collecting backup files for validation..."
    
    local backup_files=()
    
    case $BACKUP_SOURCE in
        local)
            # Get recent local backups
            backup_files=($(find "$BACKUP_DIR" -name "*.gz" -o -name "*.dump" -o -name "*.tar.gz" | sort -r | head -5))
            ;;
        s3)
            # Download recent S3 backups
            log "Downloading recent backups from S3..."
            aws s3 sync "s3://$S3_BUCKET/backups/" "$VALIDATION_DIR/downloads/" \
                --exclude "*" --include "*.gz" --include "*.dump" --include "*.tar.gz" || {
                error "Failed to download backups from S3"
                return 1
            }
            backup_files=($(find "$VALIDATION_DIR/downloads" -type f | sort -r | head -5))
            ;;
        gcs)
            # Download recent GCS backups
            log "Downloading recent backups from GCS..."
            gsutil -m cp "gs://$GCS_BUCKET/backups/*.gz" "gs://$GCS_BUCKET/backups/*.dump" \
                "$VALIDATION_DIR/downloads/" 2>/dev/null || {
                error "Failed to download backups from GCS"
                return 1
            }
            backup_files=($(find "$VALIDATION_DIR/downloads" -type f | sort -r | head -5))
            ;;
        azure)
            # Download recent Azure backups
            log "Downloading recent backups from Azure..."
            az storage blob download-batch --source "$AZURE_CONTAINER" \
                --destination "$VALIDATION_DIR/downloads/" \
                --pattern "*.gz" || {
                error "Failed to download backups from Azure"
                return 1
            }
            backup_files=($(find "$VALIDATION_DIR/downloads" -type f | sort -r | head -5))
            ;;
    esac
    
    if [ ${#backup_files[@]} -eq 0 ]; then
        error "No backup files found for validation"
        return 1
    fi
    
    BACKUP_FILES=("${backup_files[@]}")
    log "Found ${#BACKUP_FILES[@]} backup files for validation"
    
    for file in "${BACKUP_FILES[@]}"; do
        log "  - $(basename "$file") ($(du -h "$file" | cut -f1))"
    done
}

# Validate backup file integrity
validate_file_integrity() {
    local backup_file="$1"
    local test_name="integrity_$(basename "$backup_file")"
    
    log "Validating integrity of $(basename "$backup_file")..."
    
    local result="{\"test\":\"$test_name\",\"file\":\"$(basename "$backup_file")\",\"start_time\":\"$(date -Iseconds)\""
    
    # Check file exists and is readable
    if [ ! -f "$backup_file" ] || [ ! -r "$backup_file" ]; then
        error "Backup file is not accessible: $(basename "$backup_file")"
        result+=",\"status\":\"failed\",\"error\":\"file_not_accessible\""
        FAILED_TESTS+=("$test_name")
    else
        # Check file size
        local file_size=$(stat -c%s "$backup_file")
        if [ "$file_size" -eq 0 ]; then
            error "Backup file is empty: $(basename "$backup_file")"
            result+=",\"status\":\"failed\",\"error\":\"empty_file\""
            FAILED_TESTS+=("$test_name")
        else
            # Verify checksum if available
            local checksum_file="${backup_file}.sha256"
            if [ -f "$checksum_file" ]; then
                if sha256sum -c "$checksum_file" >/dev/null 2>&1; then
                    success "Checksum verified for $(basename "$backup_file")"
                    result+=",\"status\":\"passed\",\"checksum_verified\":true"
                else
                    error "Checksum verification failed for $(basename "$backup_file")"
                    result+=",\"status\":\"failed\",\"error\":\"checksum_mismatch\""
                    FAILED_TESTS+=("$test_name")
                fi
            else
                warning "No checksum file found for $(basename "$backup_file")"
                result+=",\"status\":\"passed\",\"checksum_verified\":false"
            fi
            
            result+=",\"file_size\":$file_size"
        fi
    fi
    
    result+=",\"end_time\":\"$(date -Iseconds)\"}"
    VALIDATION_RESULTS+=("$result")
    
    if [[ ! " ${FAILED_TESTS[@]} " =~ " ${test_name} " ]]; then
        TESTED_BACKUPS+=("$(basename "$backup_file")")
    fi
}

# Test database backup restoration
test_database_restore() {
    local backup_file="$1"
    local test_name="database_restore_$(basename "$backup_file")"
    
    # Skip if not a database backup
    if [[ "$backup_file" != *"database"* ]] && [[ "$backup_file" != *"postgres"* ]]; then
        return 0
    fi
    
    log "Testing database restore from $(basename "$backup_file")..."
    
    local result="{\"test\":\"$test_name\",\"file\":\"$(basename "$backup_file")\",\"start_time\":\"$(date -Iseconds)\""
    
    # Prepare backup file
    local working_file="$backup_file"
    local temp_dir="$VALIDATION_DIR/temp/$(basename "$backup_file" .gz)"
    mkdir -p "$temp_dir"
    
    # Decrypt if needed
    if [[ "$backup_file" == *.gpg ]]; then
        log "Decrypting backup for testing..."
        local decrypted_file="$temp_dir/$(basename "${backup_file%.gpg}")"
        if gpg --decrypt --batch --yes --passphrase-file "$ENCRYPTION_KEY" \
            --output "$decrypted_file" "$backup_file" 2>/dev/null; then
            working_file="$decrypted_file"
        else
            error "Failed to decrypt backup for testing"
            result+=",\"status\":\"failed\",\"error\":\"decryption_failed\""
            FAILED_TESTS+=("$test_name")
            result+=",\"end_time\":\"$(date -Iseconds)\"}"
            VALIDATION_RESULTS+=("$result")
            return 1
        fi
    fi
    
    # Decompress if needed
    if [[ "$working_file" == *.gz ]]; then
        log "Decompressing backup for testing..."
        local decompressed_file="$temp_dir/$(basename "${working_file%.gz}")"
        if gunzip -c "$working_file" > "$decompressed_file" 2>/dev/null; then
            working_file="$decompressed_file"
        else
            error "Failed to decompress backup for testing"
            result+=",\"status\":\"failed\",\"error\":\"decompression_failed\""
            FAILED_TESTS+=("$test_name")
            result+=",\"end_time\":\"$(date -Iseconds)\"}"
            VALIDATION_RESULTS+=("$result")
            return 1
        fi
    fi
    
    # Create test database
    local test_db_name="${TEST_DB_NAME}_$(date +%s)"
    export PGPASSWORD="$TEST_DB_PASSWORD"
    
    if createdb -h "$TEST_DB_HOST" -p "$TEST_DB_PORT" -U "$TEST_DB_USER" "$test_db_name" 2>/dev/null; then
        log "Created test database: $test_db_name"
        
        # Restore backup
        local restore_success=false
        if [[ "$working_file" == *.dump ]]; then
            # Custom format restore
            if pg_restore -h "$TEST_DB_HOST" -p "$TEST_DB_PORT" -U "$TEST_DB_USER" \
                -d "$test_db_name" --clean --no-owner --no-privileges "$working_file" 2>/dev/null; then
                restore_success=true
            fi
        else
            # SQL format restore
            if psql -h "$TEST_DB_HOST" -p "$TEST_DB_PORT" -U "$TEST_DB_USER" \
                -d "$test_db_name" -f "$working_file" 2>/dev/null; then
                restore_success=true
            fi
        fi
        
        if [ "$restore_success" = true ]; then
            # Verify restoration
            local table_count=$(psql -h "$TEST_DB_HOST" -p "$TEST_DB_PORT" -U "$TEST_DB_USER" \
                -d "$test_db_name" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" 2>/dev/null | tr -d ' ')
            
            if [ "$table_count" -gt 0 ]; then
                success "Database restore test passed: $table_count tables restored"
                result+=",\"status\":\"passed\",\"tables_restored\":$table_count"
                TESTED_BACKUPS+=("$(basename "$backup_file")")
            else
                error "Database restore test failed: no tables found"
                result+=",\"status\":\"failed\",\"error\":\"no_tables_restored\""
                FAILED_TESTS+=("$test_name")
            fi
        else
            error "Database restore failed"
            result+=",\"status\":\"failed\",\"error\":\"restore_failed\""
            FAILED_TESTS+=("$test_name")
        fi
        
        # Cleanup test database
        dropdb -h "$TEST_DB_HOST" -p "$TEST_DB_PORT" -U "$TEST_DB_USER" "$test_db_name" 2>/dev/null || true
    else
        error "Failed to create test database"
        result+=",\"status\":\"failed\",\"error\":\"test_db_creation_failed\""
        FAILED_TESTS+=("$test_name")
    fi
    
    unset PGPASSWORD
    
    # Cleanup temp files
    rm -rf "$temp_dir"
    
    result+=",\"end_time\":\"$(date -Iseconds)\"}"
    VALIDATION_RESULTS+=("$result")
}

# Test application backup extraction
test_application_backup() {
    local backup_file="$1"
    local test_name="application_extract_$(basename "$backup_file")"
    
    # Skip if not an application backup
    if [[ "$backup_file" != *"app"* ]] && [[ "$backup_file" != *"application"* ]]; then
        return 0
    fi
    
    log "Testing application backup extraction from $(basename "$backup_file")..."
    
    local result="{\"test\":\"$test_name\",\"file\":\"$(basename "$backup_file")\",\"start_time\":\"$(date -Iseconds)\""
    local temp_dir="$VALIDATION_DIR/temp/app_$(date +%s)"
    mkdir -p "$temp_dir"
    
    # Test tar extraction
    if tar -tzf "$backup_file" >/dev/null 2>&1; then
        if tar -xzf "$backup_file" -C "$temp_dir" 2>/dev/null; then
            local extracted_files=$(find "$temp_dir" -type f | wc -l)
            success "Application backup extraction test passed: $extracted_files files extracted"
            result+=",\"status\":\"passed\",\"files_extracted\":$extracted_files"
            TESTED_BACKUPS+=("$(basename "$backup_file")")
        else
            error "Application backup extraction failed"
            result+=",\"status\":\"failed\",\"error\":\"extraction_failed\""
            FAILED_TESTS+=("$test_name")
        fi
    else
        error "Application backup file is corrupted"
        result+=",\"status\":\"failed\",\"error\":\"corrupted_archive\""
        FAILED_TESTS+=("$test_name")
    fi
    
    # Cleanup
    rm -rf "$temp_dir"
    
    result+=",\"end_time\":\"$(date -Iseconds)\"}"
    VALIDATION_RESULTS+=("$result")
}

# Run validation tests
run_validation_tests() {
    log "Running validation tests..."
    
    for backup_file in "${BACKUP_FILES[@]}"; do
        log "Processing backup file: $(basename "$backup_file")"
        
        # Always test file integrity
        validate_file_integrity "$backup_file"
        
        # Additional tests based on validation type
        case $VALIDATION_TYPE in
            full|restore-test)
                test_database_restore "$backup_file"
                test_application_backup "$backup_file"
                ;;
            quick)
                # Only integrity checks for quick validation
                ;;
        esac
    done
}

# Generate validation report
generate_validation_report() {
    local end_time=$(date +%s)
    local duration=$((end_time - VALIDATION_START_TIME))
    
    log "Generating validation report..."
    
    # Create JSON report
    cat > "$VALIDATION_REPORT" << EOF
{
  "validation_type": "$VALIDATION_TYPE",
  "backup_source": "$BACKUP_SOURCE",
  "start_time": "$(date -d @$VALIDATION_START_TIME -Iseconds)",
  "end_time": "$(date -Iseconds)",
  "duration_seconds": $duration,
  "overall_success": $VALIDATION_SUCCESS,
  "total_backups_tested": ${#BACKUP_FILES[@]},
  "successful_backups": ${#TESTED_BACKUPS[@]},
  "failed_tests": ${#FAILED_TESTS[@]},
  "tested_backups": $(printf '%s\n' "${TESTED_BACKUPS[@]}" | jq -R . | jq -s .),
  "failed_test_names": $(printf '%s\n' "${FAILED_TESTS[@]}" | jq -R . | jq -s .),
  "detailed_results": [$(IFS=,; echo "${VALIDATION_RESULTS[*]}")]
}
EOF
    
    # Create human-readable summary
    cat > "${VALIDATION_REPORT%.json}.txt" << EOF
Backup Validation Report
========================

Validation Type: $VALIDATION_TYPE
Backup Source: $BACKUP_SOURCE
Test Duration: ${duration}s
Overall Result: $([ "$VALIDATION_SUCCESS" = "true" ] && echo "PASSED" || echo "FAILED")

Summary:
- Total backups tested: ${#BACKUP_FILES[@]}
- Successful validations: ${#TESTED_BACKUPS[@]}
- Failed tests: ${#FAILED_TESTS[@]}

$(if [ ${#TESTED_BACKUPS[@]} -gt 0 ]; then
    echo "Successfully validated backups:"
    for backup in "${TESTED_BACKUPS[@]}"; do
        echo "  ✓ $backup"
    done
fi)

$(if [ ${#FAILED_TESTS[@]} -gt 0 ]; then
    echo "Failed tests:"
    for test in "${FAILED_TESTS[@]}"; do
        echo "  ✗ $test"
    done
fi)

Detailed results available in: $VALIDATION_REPORT
EOF
    
    success "Validation report generated"
    
    # Send notification
    local message="Backup validation completed - Tested: ${#BACKUP_FILES[@]}, Passed: ${#TESTED_BACKUPS[@]}, Failed: ${#FAILED_TESTS[@]}"
    local severity="info"
    if [ "$VALIDATION_SUCCESS" != "true" ]; then
        severity="warning"
    fi
    send_notification "$message" "$severity"
}

# Cleanup validation environment
cleanup_validation_environment() {
    log "Cleaning up validation environment..."
    
    # Stop test database container
    if docker ps -q -f name=postgres-test >/dev/null 2>&1; then
        docker stop postgres-test >/dev/null 2>&1 || true
        docker rm postgres-test >/dev/null 2>&1 || true
    fi
    
    # Clean temporary files
    rm -rf "$VALIDATION_DIR/temp"/*
    
    success "Validation environment cleaned up"
}

# Main validation function
main() {
    log "Starting backup validation process..."
    log "Validation Type: $VALIDATION_TYPE"
    log "Backup Source: $BACKUP_SOURCE"
    
    setup_validation_environment
    get_backup_files
    run_validation_tests
    generate_validation_report
    cleanup_validation_environment
    
    if [ "$VALIDATION_SUCCESS" = "true" ]; then
        success "Backup validation completed successfully!"
        exit 0
    else
        error "Backup validation completed with failures!"
        exit 1
    fi
}

# Handle script interruption
cleanup() {
    log "Validation process interrupted"
    cleanup_validation_environment
    exit 1
}

trap cleanup INT TERM

# Run main function
main "$@"
