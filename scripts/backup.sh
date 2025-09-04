#!/bin/bash

# Laser Cutting Calculator - Production Backup Script
# This script performs automated backups of the database and application data

set -e  # Exit on any error

# Configuration
BACKUP_DIR="/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
RETENTION_DAYS=${BACKUP_RETENTION_DAYS:-30}

# Database configuration
DB_HOST=${POSTGRES_HOST:-postgres}
DB_PORT=${POSTGRES_PORT:-5432}
DB_NAME=${POSTGRES_DB:-laser_calc_prod}
DB_USER=${POSTGRES_USER:-laser_calc}
DB_PASSWORD=${POSTGRES_PASSWORD}

# S3 configuration (if enabled)
S3_BUCKET=${BACKUP_S3_BUCKET}
AWS_REGION=${AWS_REGION:-us-east-1}

# Logging
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

error() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: $1" >&2
}

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Function to backup database
backup_database() {
    log "Starting database backup..."
    
    local backup_file="$BACKUP_DIR/database_backup_$TIMESTAMP.sql"
    local compressed_file="$backup_file.gz"
    
    # Set password for pg_dump
    export PGPASSWORD="$DB_PASSWORD"
    
    # Create database dump
    if pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" \
        --verbose --clean --no-owner --no-privileges > "$backup_file"; then
        log "Database dump created successfully"
        
        # Compress the backup
        if gzip "$backup_file"; then
            log "Database backup compressed: $compressed_file"
            echo "$compressed_file"
        else
            error "Failed to compress database backup"
            return 1
        fi
    else
        error "Failed to create database dump"
        return 1
    fi
    
    unset PGPASSWORD
}

# Function to backup application data
backup_application_data() {
    log "Starting application data backup..."
    
    local backup_file="$BACKUP_DIR/app_data_backup_$TIMESTAMP.tar.gz"
    
    # Directories to backup
    local dirs_to_backup=(
        "/app/uploads"
        "/app/logs"
        "/app/cache"
    )
    
    # Create tar archive of application data
    if tar -czf "$backup_file" -C / "${dirs_to_backup[@]}" 2>/dev/null; then
        log "Application data backup created: $backup_file"
        echo "$backup_file"
    else
        log "No application data to backup or backup failed"
        return 0  # Not critical if no data exists
    fi
}

# Function to backup configuration files
backup_configuration() {
    log "Starting configuration backup..."
    
    local backup_file="$BACKUP_DIR/config_backup_$TIMESTAMP.tar.gz"
    
    # Configuration files to backup
    local config_files=(
        "/app/.env.production"
        "/etc/nginx/nginx.conf"
        "/etc/nginx/conf.d"
        "/app/docker-compose.production.yml"
    )
    
    # Create tar archive of configuration files
    if tar -czf "$backup_file" -C / "${config_files[@]}" 2>/dev/null; then
        log "Configuration backup created: $backup_file"
        echo "$backup_file"
    else
        log "No configuration files to backup or backup failed"
        return 0  # Not critical if no config exists
    fi
}

# Function to upload to S3 (if configured)
upload_to_s3() {
    local file_path="$1"
    local file_name=$(basename "$file_path")
    
    if [ -n "$S3_BUCKET" ] && command -v aws >/dev/null 2>&1; then
        log "Uploading $file_name to S3..."
        
        if aws s3 cp "$file_path" "s3://$S3_BUCKET/backups/$file_name" --region "$AWS_REGION"; then
            log "Successfully uploaded $file_name to S3"
            return 0
        else
            error "Failed to upload $file_name to S3"
            return 1
        fi
    else
        log "S3 upload not configured or AWS CLI not available"
        return 0
    fi
}

# Function to clean old backups
cleanup_old_backups() {
    log "Cleaning up backups older than $RETENTION_DAYS days..."
    
    # Clean local backups
    find "$BACKUP_DIR" -name "*.sql.gz" -mtime +$RETENTION_DAYS -delete 2>/dev/null || true
    find "$BACKUP_DIR" -name "*.tar.gz" -mtime +$RETENTION_DAYS -delete 2>/dev/null || true
    
    # Clean S3 backups (if configured)
    if [ -n "$S3_BUCKET" ] && command -v aws >/dev/null 2>&1; then
        local cutoff_date=$(date -d "$RETENTION_DAYS days ago" +%Y-%m-%d)
        aws s3 ls "s3://$S3_BUCKET/backups/" --region "$AWS_REGION" | \
        awk -v cutoff="$cutoff_date" '$1 < cutoff {print $4}' | \
        while read -r file; do
            if [ -n "$file" ]; then
                aws s3 rm "s3://$S3_BUCKET/backups/$file" --region "$AWS_REGION"
                log "Deleted old S3 backup: $file"
            fi
        done
    fi
    
    log "Cleanup completed"
}

# Function to verify backup integrity
verify_backup() {
    local backup_file="$1"
    
    log "Verifying backup integrity: $(basename "$backup_file")"
    
    if [ "${backup_file##*.}" = "gz" ]; then
        if gzip -t "$backup_file"; then
            log "Backup integrity verified: $(basename "$backup_file")"
            return 0
        else
            error "Backup integrity check failed: $(basename "$backup_file")"
            return 1
        fi
    else
        log "Skipping integrity check for non-compressed file"
        return 0
    fi
}

# Function to send notification (placeholder)
send_notification() {
    local status="$1"
    local message="$2"
    
    # This would integrate with your notification system
    # Examples: Slack webhook, email, Discord, etc.
    log "NOTIFICATION [$status]: $message"
    
    # Example Slack webhook (uncomment and configure)
    # if [ -n "$SLACK_WEBHOOK_URL" ]; then
    #     curl -X POST -H 'Content-type: application/json' \
    #         --data "{\"text\":\"Backup $status: $message\"}" \
    #         "$SLACK_WEBHOOK_URL"
    # fi
}

# Main backup function
main() {
    log "Starting backup process..."
    
    local backup_files=()
    local failed_backups=()
    
    # Perform database backup
    if db_backup=$(backup_database); then
        backup_files+=("$db_backup")
        if verify_backup "$db_backup"; then
            upload_to_s3 "$db_backup"
        else
            failed_backups+=("database")
        fi
    else
        failed_backups+=("database")
    fi
    
    # Perform application data backup
    if app_backup=$(backup_application_data); then
        backup_files+=("$app_backup")
        if verify_backup "$app_backup"; then
            upload_to_s3 "$app_backup"
        else
            failed_backups+=("application_data")
        fi
    fi
    
    # Perform configuration backup
    if config_backup=$(backup_configuration); then
        backup_files+=("$config_backup")
        if verify_backup "$config_backup"; then
            upload_to_s3 "$config_backup"
        else
            failed_backups+=("configuration")
        fi
    fi
    
    # Clean up old backups
    cleanup_old_backups
    
    # Report results
    if [ ${#failed_backups[@]} -eq 0 ]; then
        log "Backup process completed successfully"
        log "Created backups: ${backup_files[*]}"
        send_notification "SUCCESS" "All backups completed successfully"
    else
        error "Some backups failed: ${failed_backups[*]}"
        send_notification "FAILURE" "Failed backups: ${failed_backups[*]}"
        exit 1
    fi
}

# Health check function
health_check() {
    log "Performing backup system health check..."
    
    # Check if backup directory is writable
    if [ ! -w "$BACKUP_DIR" ]; then
        error "Backup directory is not writable: $BACKUP_DIR"
        return 1
    fi
    
    # Check database connectivity
    export PGPASSWORD="$DB_PASSWORD"
    if ! pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" >/dev/null 2>&1; then
        error "Cannot connect to database"
        unset PGPASSWORD
        return 1
    fi
    unset PGPASSWORD
    
    # Check available disk space (require at least 1GB)
    local available_space=$(df "$BACKUP_DIR" | awk 'NR==2 {print $4}')
    if [ "$available_space" -lt 1048576 ]; then  # 1GB in KB
        error "Insufficient disk space for backups"
        return 1
    fi
    
    log "Backup system health check passed"
    return 0
}

# Script entry point
case "${1:-backup}" in
    "backup")
        if health_check; then
            main
        else
            error "Health check failed, aborting backup"
            exit 1
        fi
        ;;
    "health")
        health_check
        ;;
    "cleanup")
        cleanup_old_backups
        ;;
    *)
        echo "Usage: $0 {backup|health|cleanup}"
        echo "  backup  - Perform full backup (default)"
        echo "  health  - Check backup system health"
        echo "  cleanup - Clean up old backups"
        exit 1
        ;;
esac
