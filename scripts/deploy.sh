#!/bin/bash

# Laser Cutting Calculator - Production Deployment Script
# This script handles zero-downtime deployment with health checks and rollback capability

set -e  # Exit on any error

# Configuration
ENVIRONMENT=${1:-production}
IMAGE_TAG=${2:-latest}
HEALTH_CHECK_TIMEOUT=${HEALTH_CHECK_TIMEOUT:-300}
HEALTH_CHECK_INTERVAL=${HEALTH_CHECK_INTERVAL:-10}

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

# Validate environment
validate_environment() {
    log "Validating deployment environment: $ENVIRONMENT"
    
    case $ENVIRONMENT in
        "staging"|"production")
            log "Environment validation passed: $ENVIRONMENT"
            ;;
        *)
            error "Invalid environment: $ENVIRONMENT. Must be 'staging' or 'production'"
            exit 1
            ;;
    esac
}

# Check prerequisites
check_prerequisites() {
    log "Checking deployment prerequisites..."
    
    # Check if Docker is available
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed or not in PATH"
        exit 1
    fi
    
    # Check if Docker Compose is available
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose is not installed or not in PATH"
        exit 1
    fi
    
    # Check if required environment files exist
    if [ ! -f ".env.$ENVIRONMENT" ]; then
        error "Environment file .env.$ENVIRONMENT not found"
        exit 1
    fi
    
    success "Prerequisites check passed"
}

# Pull latest images
pull_images() {
    log "Pulling latest Docker images..."
    
    # Pull the application image
    if ! docker pull "ghcr.io/lasercalc/laser-calc-app:$IMAGE_TAG"; then
        error "Failed to pull application image"
        exit 1
    fi
    
    # Pull other required images
    docker-compose -f docker-compose.$ENVIRONMENT.yml pull
    
    success "Images pulled successfully"
}

# Health check function
health_check() {
    local url=$1
    local timeout=$2
    local interval=$3
    
    log "Performing health check on $url"
    
    local elapsed=0
    while [ $elapsed -lt $timeout ]; do
        if curl -f -s "$url" > /dev/null 2>&1; then
            success "Health check passed for $url"
            return 0
        fi
        
        log "Health check failed, retrying in ${interval}s... (${elapsed}/${timeout}s elapsed)"
        sleep $interval
        elapsed=$((elapsed + interval))
    done
    
    error "Health check failed for $url after ${timeout}s"
    return 1
}

# Backup current deployment
backup_current_deployment() {
    log "Creating backup of current deployment..."
    
    # Create backup directory with timestamp
    local backup_dir="backups/deployment_$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$backup_dir"
    
    # Backup current docker-compose file
    if [ -f "docker-compose.$ENVIRONMENT.yml" ]; then
        cp "docker-compose.$ENVIRONMENT.yml" "$backup_dir/"
    fi
    
    # Backup current environment file
    if [ -f ".env.$ENVIRONMENT" ]; then
        cp ".env.$ENVIRONMENT" "$backup_dir/"
    fi
    
    # Export current container states
    docker-compose -f docker-compose.$ENVIRONMENT.yml ps > "$backup_dir/container_states.txt"
    
    success "Backup created in $backup_dir"
    echo "$backup_dir" > .last_backup_path
}

# Deploy with zero downtime
deploy_zero_downtime() {
    log "Starting zero-downtime deployment..."
    
    # Update the image tag in docker-compose file
    sed -i.bak "s|ghcr.io/lasercalc/laser-calc-app:.*|ghcr.io/lasercalc/laser-calc-app:$IMAGE_TAG|g" docker-compose.$ENVIRONMENT.yml
    
    # Start new containers alongside old ones
    log "Starting new containers..."
    docker-compose -f docker-compose.$ENVIRONMENT.yml up -d --no-deps --scale app=2 app
    
    # Wait for new containers to be healthy
    sleep 30
    
    # Check health of new containers
    local health_url
    if [ "$ENVIRONMENT" = "production" ]; then
        health_url="https://lasercalc.com/health"
    else
        health_url="https://staging.lasercalc.com/health"
    fi
    
    if health_check "$health_url" $HEALTH_CHECK_TIMEOUT $HEALTH_CHECK_INTERVAL; then
        log "New containers are healthy, scaling down old containers..."
        docker-compose -f docker-compose.$ENVIRONMENT.yml up -d --no-deps --scale app=1 app
        
        # Clean up old containers
        docker container prune -f
        
        success "Zero-downtime deployment completed successfully"
    else
        error "New containers failed health check, rolling back..."
        rollback_deployment
        exit 1
    fi
}

# Rollback deployment
rollback_deployment() {
    log "Rolling back deployment..."
    
    if [ -f ".last_backup_path" ]; then
        local backup_path=$(cat .last_backup_path)
        
        if [ -d "$backup_path" ]; then
            # Restore docker-compose file
            if [ -f "$backup_path/docker-compose.$ENVIRONMENT.yml" ]; then
                cp "$backup_path/docker-compose.$ENVIRONMENT.yml" .
            fi
            
            # Restore environment file
            if [ -f "$backup_path/.env.$ENVIRONMENT" ]; then
                cp "$backup_path/.env.$ENVIRONMENT" .
            fi
            
            # Restart services with old configuration
            docker-compose -f docker-compose.$ENVIRONMENT.yml up -d
            
            success "Rollback completed successfully"
        else
            error "Backup directory not found: $backup_path"
            exit 1
        fi
    else
        error "No backup path found for rollback"
        exit 1
    fi
}

# Run database migrations
run_migrations() {
    log "Running database migrations..."
    
    # Run migrations in a temporary container
    docker-compose -f docker-compose.$ENVIRONMENT.yml run --rm app yarn migrate:up
    
    if [ $? -eq 0 ]; then
        success "Database migrations completed successfully"
    else
        error "Database migrations failed"
        exit 1
    fi
}

# Update services
update_services() {
    log "Updating all services..."
    
    # Update all services
    docker-compose -f docker-compose.$ENVIRONMENT.yml up -d
    
    # Wait for services to stabilize
    sleep 30
    
    success "Services updated successfully"
}

# Post-deployment verification
post_deployment_verification() {
    log "Running post-deployment verification..."
    
    # Check all service health
    local services=("app" "postgres" "redis" "nginx")
    
    for service in "${services[@]}"; do
        if docker-compose -f docker-compose.$ENVIRONMENT.yml ps $service | grep -q "Up"; then
            success "$service is running"
        else
            error "$service is not running"
            exit 1
        fi
    done
    
    # Run application health check
    local health_url
    if [ "$ENVIRONMENT" = "production" ]; then
        health_url="https://lasercalc.com/health"
    else
        health_url="https://staging.lasercalc.com/health"
    fi
    
    if health_check "$health_url" 60 5; then
        success "Application health check passed"
    else
        error "Application health check failed"
        exit 1
    fi
    
    success "Post-deployment verification completed"
}

# Send deployment notification
send_notification() {
    local status=$1
    local message=$2
    
    log "Sending deployment notification..."
    
    # This would integrate with your notification system
    # Examples: Slack webhook, Discord, email, etc.
    
    if [ -n "$SLACK_WEBHOOK_URL" ]; then
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"Deployment $status: $message\"}" \
            "$SLACK_WEBHOOK_URL"
    fi
    
    log "Notification sent: $status - $message"
}

# Main deployment function
main() {
    log "Starting deployment process for $ENVIRONMENT environment with image tag $IMAGE_TAG"
    
    # Validate inputs
    validate_environment
    check_prerequisites
    
    # Create backup
    backup_current_deployment
    
    # Pull latest images
    pull_images
    
    # Run migrations if needed
    if [ "$ENVIRONMENT" = "production" ]; then
        run_migrations
    fi
    
    # Deploy with zero downtime
    deploy_zero_downtime
    
    # Update other services
    update_services
    
    # Verify deployment
    post_deployment_verification
    
    # Send success notification
    send_notification "SUCCESS" "Deployment to $ENVIRONMENT completed successfully"
    
    success "Deployment completed successfully!"
}

# Rollback function
rollback() {
    log "Starting rollback process..."
    rollback_deployment
    post_deployment_verification
    send_notification "ROLLBACK" "Rollback to previous version completed"
    success "Rollback completed successfully!"
}

# Script entry point
case "${1:-deploy}" in
    "deploy")
        main
        ;;
    "rollback")
        rollback
        ;;
    "health-check")
        if [ "$ENVIRONMENT" = "production" ]; then
            health_check "https://lasercalc.com/health" 60 5
        else
            health_check "https://staging.lasercalc.com/health" 60 5
        fi
        ;;
    *)
        echo "Usage: $0 {deploy|rollback|health-check} [environment] [image_tag]"
        echo "  deploy      - Deploy to specified environment (default: production)"
        echo "  rollback    - Rollback to previous deployment"
        echo "  health-check - Check application health"
        echo ""
        echo "Environment: staging|production (default: production)"
        echo "Image tag: Docker image tag (default: latest)"
        exit 1
        ;;
esac
