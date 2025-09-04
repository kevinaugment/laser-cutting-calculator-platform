#!/bin/bash

# Disaster Recovery Script for Laser Cutting Calculator
# Comprehensive disaster recovery with automated failover and restoration

set -e

# Configuration
RECOVERY_TYPE="${1:-full}"  # full, partial, database, application
BACKUP_SOURCE="${2:-local}"  # local, s3, gcs, azure
RECOVERY_POINT="${3:-latest}"  # latest, timestamp, or specific backup
DRY_RUN="${DRY_RUN:-false}"

# Directories and paths
BACKUP_DIR="${BACKUP_DIR:-/var/backups/laser-calc}"
RECOVERY_DIR="${RECOVERY_DIR:-/var/recovery/laser-calc}"
APP_DIR="${APP_DIR:-/app}"
CONFIG_DIR="${CONFIG_DIR:-/etc/laser-calc}"

# Database configuration
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-laser_calc}"
DB_USER="${DB_USER:-postgres}"
DB_PASSWORD="${DB_PASSWORD:-}"
DB_RECOVERY_NAME="${DB_RECOVERY_NAME:-${DB_NAME}_recovery}"

# Redis configuration
REDIS_HOST="${REDIS_HOST:-localhost}"
REDIS_PORT="${REDIS_PORT:-6379}"
REDIS_PASSWORD="${REDIS_PASSWORD:-}"

# Cloud storage configuration
S3_BUCKET="${S3_BUCKET:-laser-calc-backups}"
GCS_BUCKET="${GCS_BUCKET:-laser-calc-backups-gcs}"
AZURE_CONTAINER="${AZURE_CONTAINER:-laser-calc-backups}"

# Monitoring and alerting
WEBHOOK_URL="${WEBHOOK_URL:-}"
SLACK_WEBHOOK="${SLACK_WEBHOOK:-}"
EMAIL_RECIPIENTS="${EMAIL_RECIPIENTS:-admin@lasercalc.com}"

# Logging
LOG_FILE="${RECOVERY_DIR}/recovery.log"
ERROR_LOG="${RECOVERY_DIR}/recovery_errors.log"
RECOVERY_REPORT="${RECOVERY_DIR}/recovery_report.json"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Global variables
RECOVERY_START_TIME=$(date +%s)
RECOVERY_SUCCESS=true
RECOVERED_COMPONENTS=()
FAILED_COMPONENTS=()

# Logging functions
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$ERROR_LOG" >&2
    RECOVERY_SUCCESS=false
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
            --data "{\"attachments\":[{\"color\":\"$color\",\"text\":\"🚨 DISASTER RECOVERY: $message\"}]}" \
            "$SLACK_WEBHOOK" 2>/dev/null || true
    fi
    
    # Email notification
    if [ -n "$EMAIL_RECIPIENTS" ] && command -v mail >/dev/null 2>&1; then
        echo "$message" | mail -s "DISASTER RECOVERY ALERT" "$EMAIL_RECIPIENTS" 2>/dev/null || true
    fi
}

# Pre-flight checks
preflight_checks() {
    log "Performing pre-flight checks..."
    
    # Check if this is a dry run
    if [ "$DRY_RUN" = "true" ]; then
        warning "DRY RUN MODE - No actual recovery will be performed"
    fi
    
    # Create recovery directory
    mkdir -p "$RECOVERY_DIR"
    
    # Check dependencies
    local deps=("pg_restore" "psql" "redis-cli" "docker" "docker-compose")
    local missing_deps=()
    
    for dep in "${deps[@]}"; do
        if ! command -v "$dep" >/dev/null 2>&1; then
            missing_deps+=("$dep")
        fi
    done
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        error "Missing dependencies: ${missing_deps[*]}"
        send_notification "Recovery failed: Missing dependencies ${missing_deps[*]}" "error"
        exit 1
    fi
    
    # Check backup source availability
    case $BACKUP_SOURCE in
        s3)
            if ! command -v aws >/dev/null 2>&1; then
                error "AWS CLI not available for S3 backup source"
                exit 1
            fi
            ;;
        gcs)
            if ! command -v gsutil >/dev/null 2>&1; then
                error "Google Cloud SDK not available for GCS backup source"
                exit 1
            fi
            ;;
        azure)
            if ! command -v az >/dev/null 2>&1; then
                error "Azure CLI not available for Azure backup source"
                exit 1
            fi
            ;;
    esac
    
    success "Pre-flight checks completed"
}

# Find and download backup files
get_backup_files() {
    log "Locating backup files..."
    
    local backup_pattern=""
    if [ "$RECOVERY_POINT" = "latest" ]; then
        backup_pattern="*"
    else
        backup_pattern="*${RECOVERY_POINT}*"
    fi
    
    case $BACKUP_SOURCE in
        local)
            # Find local backup files
            BACKUP_FILES=($(find "$BACKUP_DIR" -name "$backup_pattern" -type f | sort -r | head -10))
            ;;
        s3)
            # Download from S3
            log "Downloading backups from S3..."
            aws s3 sync "s3://$S3_BUCKET/backups/" "$RECOVERY_DIR/downloads/" \
                --exclude "*" --include "$backup_pattern" || error "Failed to download from S3"
            BACKUP_FILES=($(find "$RECOVERY_DIR/downloads" -name "$backup_pattern" -type f))
            ;;
        gcs)
            # Download from Google Cloud Storage
            log "Downloading backups from GCS..."
            gsutil -m cp "gs://$GCS_BUCKET/backups/$backup_pattern" "$RECOVERY_DIR/downloads/" || error "Failed to download from GCS"
            BACKUP_FILES=($(find "$RECOVERY_DIR/downloads" -name "$backup_pattern" -type f))
            ;;
        azure)
            # Download from Azure Blob Storage
            log "Downloading backups from Azure..."
            az storage blob download-batch --source "$AZURE_CONTAINER" --destination "$RECOVERY_DIR/downloads/" \
                --pattern "$backup_pattern" || error "Failed to download from Azure"
            BACKUP_FILES=($(find "$RECOVERY_DIR/downloads" -name "$backup_pattern" -type f))
            ;;
    esac
    
    if [ ${#BACKUP_FILES[@]} -eq 0 ]; then
        error "No backup files found matching pattern: $backup_pattern"
        exit 1
    fi
    
    log "Found ${#BACKUP_FILES[@]} backup files"
    for file in "${BACKUP_FILES[@]}"; do
        log "  - $(basename "$file")"
    done
}

# Verify backup integrity
verify_backup_integrity() {
    log "Verifying backup integrity..."
    
    for backup_file in "${BACKUP_FILES[@]}"; do
        local checksum_file="${backup_file}.sha256"
        
        if [ -f "$checksum_file" ]; then
            log "Verifying checksum for $(basename "$backup_file")..."
            
            if sha256sum -c "$checksum_file" >/dev/null 2>&1; then
                success "Checksum verified for $(basename "$backup_file")"
            else
                error "Checksum verification failed for $(basename "$backup_file")"
                return 1
            fi
        else
            warning "No checksum file found for $(basename "$backup_file")"
        fi
        
        # Test file readability
        if [ -r "$backup_file" ]; then
            success "File is readable: $(basename "$backup_file")"
        else
            error "File is not readable: $(basename "$backup_file")"
            return 1
        fi
    done
    
    success "Backup integrity verification completed"
}

# Stop services before recovery
stop_services() {
    log "Stopping services for recovery..."
    
    if [ "$DRY_RUN" = "true" ]; then
        log "DRY RUN: Would stop services"
        return 0
    fi
    
    # Stop Docker Compose services
    if [ -f "$APP_DIR/docker-compose.production.yml" ]; then
        log "Stopping Docker Compose services..."
        docker-compose -f "$APP_DIR/docker-compose.production.yml" down || warning "Failed to stop some services"
    fi
    
    # Stop individual services if needed
    local services=("nginx" "redis-server" "postgresql")
    for service in "${services[@]}"; do
        if systemctl is-active --quiet "$service" 2>/dev/null; then
            log "Stopping $service..."
            systemctl stop "$service" || warning "Failed to stop $service"
        fi
    done
    
    success "Services stopped"
}

# Recover database
recover_database() {
    log "Starting database recovery..."
    
    # Find database backup file
    local db_backup_file=""
    for file in "${BACKUP_FILES[@]}"; do
        if [[ "$file" == *"database"* ]] || [[ "$file" == *"postgres"* ]]; then
            db_backup_file="$file"
            break
        fi
    done
    
    if [ -z "$db_backup_file" ]; then
        error "No database backup file found"
        FAILED_COMPONENTS+=("database")
        return 1
    fi
    
    log "Using database backup: $(basename "$db_backup_file")"
    
    if [ "$DRY_RUN" = "true" ]; then
        log "DRY RUN: Would recover database from $db_backup_file"
        RECOVERED_COMPONENTS+=("database")
        return 0
    fi
    
    # Decrypt if needed
    local working_file="$db_backup_file"
    if [[ "$db_backup_file" == *.gpg ]]; then
        log "Decrypting database backup..."
        local decrypted_file="${db_backup_file%.gpg}"
        gpg --decrypt --batch --yes --passphrase-file "$ENCRYPTION_KEY" \
            --output "$decrypted_file" "$db_backup_file" || {
            error "Failed to decrypt database backup"
            FAILED_COMPONENTS+=("database")
            return 1
        }
        working_file="$decrypted_file"
    fi
    
    # Decompress if needed
    if [[ "$working_file" == *.gz ]]; then
        log "Decompressing database backup..."
        gunzip -c "$working_file" > "${working_file%.gz}" || {
            error "Failed to decompress database backup"
            FAILED_COMPONENTS+=("database")
            return 1
        }
        working_file="${working_file%.gz}"
    fi
    
    # Set database password
    export PGPASSWORD="$DB_PASSWORD"
    
    # Create recovery database
    log "Creating recovery database..."
    createdb -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" "$DB_RECOVERY_NAME" 2>/dev/null || {
        log "Recovery database may already exist, dropping and recreating..."
        dropdb -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" "$DB_RECOVERY_NAME" --if-exists
        createdb -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" "$DB_RECOVERY_NAME"
    }
    
    # Restore database
    log "Restoring database from backup..."
    if [[ "$working_file" == *.dump ]]; then
        # Custom format restore
        pg_restore -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_RECOVERY_NAME" \
            --verbose --clean --no-owner --no-privileges "$working_file" || {
            error "Database restore failed"
            FAILED_COMPONENTS+=("database")
            unset PGPASSWORD
            return 1
        }
    else
        # SQL format restore
        psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_RECOVERY_NAME" \
            -f "$working_file" || {
            error "Database restore failed"
            FAILED_COMPONENTS+=("database")
            unset PGPASSWORD
            return 1
        }
    fi
    
    # Verify database recovery
    log "Verifying database recovery..."
    local table_count=$(psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_RECOVERY_NAME" \
        -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" | tr -d ' ')
    
    if [ "$table_count" -gt 0 ]; then
        success "Database recovery completed successfully ($table_count tables restored)"
        RECOVERED_COMPONENTS+=("database")
        
        # Optionally switch to recovered database
        if [ "$RECOVERY_TYPE" = "full" ]; then
            log "Switching to recovered database..."
            # This would involve updating application configuration
            # Implementation depends on your specific setup
        fi
    else
        error "Database recovery verification failed"
        FAILED_COMPONENTS+=("database")
        unset PGPASSWORD
        return 1
    fi
    
    unset PGPASSWORD
}

# Recover Redis data
recover_redis() {
    log "Starting Redis recovery..."
    
    # Find Redis backup file
    local redis_backup_file=""
    for file in "${BACKUP_FILES[@]}"; do
        if [[ "$file" == *"redis"* ]]; then
            redis_backup_file="$file"
            break
        fi
    done
    
    if [ -z "$redis_backup_file" ]; then
        warning "No Redis backup file found"
        return 0
    fi
    
    log "Using Redis backup: $(basename "$redis_backup_file")"
    
    if [ "$DRY_RUN" = "true" ]; then
        log "DRY RUN: Would recover Redis from $redis_backup_file"
        RECOVERED_COMPONENTS+=("redis")
        return 0
    fi
    
    # Stop Redis service
    systemctl stop redis-server 2>/dev/null || warning "Failed to stop Redis service"
    
    # Prepare backup file
    local working_file="$redis_backup_file"
    
    # Decrypt if needed
    if [[ "$redis_backup_file" == *.gpg ]]; then
        log "Decrypting Redis backup..."
        local decrypted_file="${redis_backup_file%.gpg}"
        gpg --decrypt --batch --yes --passphrase-file "$ENCRYPTION_KEY" \
            --output "$decrypted_file" "$redis_backup_file" || {
            error "Failed to decrypt Redis backup"
            FAILED_COMPONENTS+=("redis")
            return 1
        }
        working_file="$decrypted_file"
    fi
    
    # Decompress if needed
    if [[ "$working_file" == *.gz ]]; then
        log "Decompressing Redis backup..."
        gunzip -c "$working_file" > "${working_file%.gz}" || {
            error "Failed to decompress Redis backup"
            FAILED_COMPONENTS+=("redis")
            return 1
        }
        working_file="${working_file%.gz}"
    fi
    
    # Copy Redis dump file
    local redis_data_dir="/var/lib/redis"
    if [ -f "$working_file" ]; then
        log "Restoring Redis dump file..."
        cp "$working_file" "$redis_data_dir/dump.rdb"
        chown redis:redis "$redis_data_dir/dump.rdb"
        chmod 660 "$redis_data_dir/dump.rdb"
        
        # Start Redis service
        systemctl start redis-server || {
            error "Failed to start Redis service"
            FAILED_COMPONENTS+=("redis")
            return 1
        }
        
        # Verify Redis recovery
        sleep 5
        local redis_cmd="redis-cli -h $REDIS_HOST -p $REDIS_PORT"
        if [ -n "$REDIS_PASSWORD" ]; then
            redis_cmd="$redis_cmd -a $REDIS_PASSWORD"
        fi
        
        if $redis_cmd ping | grep -q PONG; then
            success "Redis recovery completed successfully"
            RECOVERED_COMPONENTS+=("redis")
        else
            error "Redis recovery verification failed"
            FAILED_COMPONENTS+=("redis")
            return 1
        fi
    else
        error "Redis backup file not found after processing"
        FAILED_COMPONENTS+=("redis")
        return 1
    fi
}

# Recover application files
recover_application() {
    log "Starting application recovery..."
    
    # Find application backup file
    local app_backup_file=""
    for file in "${BACKUP_FILES[@]}"; do
        if [[ "$file" == *"application"* ]] || [[ "$file" == *"app_data"* ]]; then
            app_backup_file="$file"
            break
        fi
    done
    
    if [ -z "$app_backup_file" ]; then
        warning "No application backup file found"
        return 0
    fi
    
    log "Using application backup: $(basename "$app_backup_file")"
    
    if [ "$DRY_RUN" = "true" ]; then
        log "DRY RUN: Would recover application from $app_backup_file"
        RECOVERED_COMPONENTS+=("application")
        return 0
    fi
    
    # Extract application backup
    log "Extracting application backup..."
    if tar -xzf "$app_backup_file" -C / 2>/dev/null; then
        success "Application recovery completed successfully"
        RECOVERED_COMPONENTS+=("application")
    else
        error "Application recovery failed"
        FAILED_COMPONENTS+=("application")
        return 1
    fi
}

# Start services after recovery
start_services() {
    log "Starting services after recovery..."
    
    if [ "$DRY_RUN" = "true" ]; then
        log "DRY RUN: Would start services"
        return 0
    fi
    
    # Start system services
    local services=("postgresql" "redis-server" "nginx")
    for service in "${services[@]}"; do
        if systemctl is-enabled --quiet "$service" 2>/dev/null; then
            log "Starting $service..."
            systemctl start "$service" || warning "Failed to start $service"
        fi
    done
    
    # Start Docker Compose services
    if [ -f "$APP_DIR/docker-compose.production.yml" ]; then
        log "Starting Docker Compose services..."
        docker-compose -f "$APP_DIR/docker-compose.production.yml" up -d || warning "Failed to start some services"
    fi
    
    success "Services started"
}

# Generate recovery report
generate_recovery_report() {
    local end_time=$(date +%s)
    local duration=$((end_time - RECOVERY_START_TIME))
    
    log "Generating recovery report..."
    
    cat > "$RECOVERY_REPORT" << EOF
{
  "recovery_type": "$RECOVERY_TYPE",
  "backup_source": "$BACKUP_SOURCE",
  "recovery_point": "$RECOVERY_POINT",
  "dry_run": $DRY_RUN,
  "start_time": "$(date -d @$RECOVERY_START_TIME -Iseconds)",
  "end_time": "$(date -Iseconds)",
  "duration_seconds": $duration,
  "success": $RECOVERY_SUCCESS,
  "recovered_components": $(printf '%s\n' "${RECOVERED_COMPONENTS[@]}" | jq -R . | jq -s .),
  "failed_components": $(printf '%s\n' "${FAILED_COMPONENTS[@]}" | jq -R . | jq -s .),
  "backup_files_used": $(printf '%s\n' "${BACKUP_FILES[@]}" | jq -R . | jq -s .)
}
EOF
    
    success "Recovery report generated: $RECOVERY_REPORT"
}

# Main recovery function
main() {
    log "Starting disaster recovery process..."
    log "Recovery Type: $RECOVERY_TYPE"
    log "Backup Source: $BACKUP_SOURCE"
    log "Recovery Point: $RECOVERY_POINT"
    
    send_notification "Disaster recovery started - Type: $RECOVERY_TYPE, Source: $BACKUP_SOURCE" "warning"
    
    # Execute recovery steps
    preflight_checks
    get_backup_files
    verify_backup_integrity
    
    case $RECOVERY_TYPE in
        full)
            stop_services
            recover_database
            recover_redis
            recover_application
            start_services
            ;;
        database)
            recover_database
            ;;
        application)
            recover_application
            ;;
        partial)
            # Recover only critical components
            recover_database
            recover_redis
            ;;
        *)
            error "Unknown recovery type: $RECOVERY_TYPE"
            exit 1
            ;;
    esac
    
    generate_recovery_report
    
    if [ "$RECOVERY_SUCCESS" = "true" ]; then
        success "Disaster recovery completed successfully!"
        send_notification "Disaster recovery completed successfully - Recovered: ${RECOVERED_COMPONENTS[*]}" "info"
    else
        error "Disaster recovery completed with errors!"
        send_notification "Disaster recovery completed with errors - Failed: ${FAILED_COMPONENTS[*]}" "error"
        exit 1
    fi
}

# Handle script interruption
cleanup() {
    log "Recovery process interrupted"
    send_notification "Disaster recovery process was interrupted" "error"
    exit 1
}

trap cleanup INT TERM

# Run main function
main "$@"
