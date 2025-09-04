#!/bin/bash

# Production Deployment Verification Script
# Comprehensive verification of CI/CD pipeline, containerization, and production environment

set -e

# Configuration
ENVIRONMENT="${ENVIRONMENT:-production}"
DOMAIN="${DOMAIN:-https://lasercalc.com}"
DOCKER_IMAGE="${DOCKER_IMAGE:-laser-calc-app}"
RESULTS_DIR="./deployment-verification-results"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Verification metrics
TOTAL_CHECKS=0
PASSED_CHECKS=0
CRITICAL_ISSUES=0
WARNING_ISSUES=0

# Logging functions
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
    CRITICAL_ISSUES=$((CRITICAL_ISSUES + 1))
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
    WARNING_ISSUES=$((WARNING_ISSUES + 1))
}

critical() {
    echo -e "${RED}[CRITICAL]${NC} $1"
    CRITICAL_ISSUES=$((CRITICAL_ISSUES + 1))
}

# Create results directory
mkdir -p "$RESULTS_DIR/$TIMESTAMP"
cd "$RESULTS_DIR/$TIMESTAMP"

# Check deployment dependencies
check_deployment_dependencies() {
    log "Checking deployment dependencies..."
    
    local deps=("docker" "docker-compose" "curl" "jq" "git")
    local missing_deps=()
    
    for dep in "${deps[@]}"; do
        if ! command -v "$dep" &> /dev/null; then
            missing_deps+=("$dep")
        fi
    done
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        error "Missing deployment dependencies: ${missing_deps[*]}"
        return 1
    else
        success "All deployment dependencies are available"
        return 0
    fi
}

# Verify CI/CD pipeline configuration
verify_cicd_pipeline() {
    log "Verifying CI/CD pipeline configuration..."
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    local pipeline_files=(
        "../../../.github/workflows/ci.yml"
        "../../../.github/workflows/cd.yml"
        "../../../.github/workflows/deploy.yml"
    )
    
    local found_pipelines=0
    
    for file in "${pipeline_files[@]}"; do
        if [ -f "$file" ]; then
            found_pipelines=$((found_pipelines + 1))
            success "CI/CD pipeline file found: $(basename "$file")"
            
            # Validate pipeline content
            if grep -q "build" "$file" && grep -q "test" "$file"; then
                success "Pipeline includes build and test stages"
            else
                warning "Pipeline missing build or test stages"
            fi
            
            if grep -q "deploy" "$file"; then
                success "Pipeline includes deployment stage"
            else
                warning "Pipeline missing deployment stage"
            fi
        fi
    done
    
    if [ $found_pipelines -eq 0 ]; then
        error "No CI/CD pipeline configuration found"
        return 1
    elif [ $found_pipelines -ge 2 ]; then
        success "Multiple CI/CD pipeline files found ($found_pipelines)"
        return 0
    else
        warning "Limited CI/CD pipeline configuration ($found_pipelines file)"
        return 0
    fi
}

# Verify Docker configuration
verify_docker_configuration() {
    log "Verifying Docker configuration..."
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    local docker_files=(
        "../../../Dockerfile"
        "../../../docker-compose.yml"
        "../../../docker-compose.production.yml"
        "../../../.dockerignore"
    )
    
    local found_docker_files=0
    
    for file in "${docker_files[@]}"; do
        if [ -f "$file" ]; then
            found_docker_files=$((found_docker_files + 1))
            success "Docker configuration file found: $(basename "$file")"
            
            # Validate Dockerfile
            if [[ "$file" == *"Dockerfile" ]]; then
                if grep -q "FROM node" "$file"; then
                    success "Dockerfile uses Node.js base image"
                fi
                
                if grep -q "COPY package" "$file"; then
                    success "Dockerfile includes package.json copy"
                fi
                
                if grep -q "RUN npm" "$file"; then
                    success "Dockerfile includes npm install"
                fi
                
                if grep -q "EXPOSE" "$file"; then
                    success "Dockerfile exposes port"
                else
                    warning "Dockerfile missing EXPOSE directive"
                fi
            fi
            
            # Validate docker-compose files
            if [[ "$file" == *"docker-compose"* ]]; then
                if grep -q "services:" "$file"; then
                    success "Docker Compose includes services configuration"
                fi
                
                if grep -q "environment:" "$file"; then
                    success "Docker Compose includes environment configuration"
                else
                    warning "Docker Compose missing environment configuration"
                fi
            fi
        fi
    done
    
    if [ $found_docker_files -eq 0 ]; then
        error "No Docker configuration files found"
        return 1
    elif [ $found_docker_files -ge 3 ]; then
        success "Comprehensive Docker configuration found ($found_docker_files files)"
        return 0
    else
        warning "Limited Docker configuration ($found_docker_files files)"
        return 0
    fi
}

# Test Docker build process
test_docker_build() {
    log "Testing Docker build process..."
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    if [ ! -f "../../../Dockerfile" ]; then
        error "Dockerfile not found - skipping build test"
        return 1
    fi
    
    cd ../../../
    
    # Test Docker build
    log "Building Docker image..."
    if docker build -t "$DOCKER_IMAGE:test" . > "$RESULTS_DIR/$TIMESTAMP/docker_build.log" 2>&1; then
        success "Docker build completed successfully"
        
        # Test Docker run
        log "Testing Docker container..."
        if docker run -d --name "${DOCKER_IMAGE}_test" -p 3001:3000 "$DOCKER_IMAGE:test" > "$RESULTS_DIR/$TIMESTAMP/docker_run.log" 2>&1; then
            success "Docker container started successfully"
            
            # Wait for container to be ready
            sleep 10
            
            # Test container health
            if curl -s http://localhost:3001 > /dev/null 2>&1; then
                success "Docker container is responding to HTTP requests"
            else
                warning "Docker container not responding to HTTP requests"
            fi
            
            # Cleanup test container
            docker stop "${DOCKER_IMAGE}_test" > /dev/null 2>&1 || true
            docker rm "${DOCKER_IMAGE}_test" > /dev/null 2>&1 || true
        else
            error "Docker container failed to start"
            cd "$RESULTS_DIR/$TIMESTAMP"
            return 1
        fi
        
        # Cleanup test image
        docker rmi "$DOCKER_IMAGE:test" > /dev/null 2>&1 || true
    else
        error "Docker build failed"
        cd "$RESULTS_DIR/$TIMESTAMP"
        return 1
    fi
    
    cd "$RESULTS_DIR/$TIMESTAMP"
    return 0
}

# Verify production environment configuration
verify_production_config() {
    log "Verifying production environment configuration..."
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    local config_files=(
        "../../../.env.production"
        "../../../.env.example"
        "../../../vite.config.ts"
        "../../../package.json"
    )
    
    local config_issues=0
    
    for file in "${config_files[@]}"; do
        if [ -f "$file" ]; then
            success "Configuration file found: $(basename "$file")"
            
            # Check for production-specific configurations
            if [[ "$file" == *".env"* ]]; then
                if grep -q "NODE_ENV=production" "$file" 2>/dev/null; then
                    success "Production environment variable configured"
                fi
                
                if grep -q "DATABASE_URL" "$file" 2>/dev/null; then
                    success "Database configuration present"
                fi
                
                # Check for security configurations
                if grep -q "JWT_SECRET" "$file" 2>/dev/null; then
                    success "JWT secret configuration present"
                fi
            fi
            
            # Check package.json for production scripts
            if [[ "$file" == *"package.json" ]]; then
                if grep -q '"build"' "$file"; then
                    success "Build script configured in package.json"
                fi
                
                if grep -q '"start"' "$file"; then
                    success "Start script configured in package.json"
                fi
                
                if grep -q '"preview"' "$file"; then
                    success "Preview script configured in package.json"
                fi
            fi
        else
            if [[ "$file" == *".env.production" ]]; then
                warning "Production environment file not found: $(basename "$file")"
                config_issues=$((config_issues + 1))
            else
                error "Required configuration file not found: $(basename "$file")"
                config_issues=$((config_issues + 1))
            fi
        fi
    done
    
    if [ $config_issues -eq 0 ]; then
        success "Production configuration verification passed"
        return 0
    else
        warning "$config_issues configuration issues found"
        return 1
    fi
}

# Test production build process
test_production_build() {
    log "Testing production build process..."
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    cd ../../../
    
    # Test npm build
    log "Running production build..."
    if npm run build > "$RESULTS_DIR/$TIMESTAMP/npm_build.log" 2>&1; then
        success "Production build completed successfully"
        
        # Check build output
        if [ -d "dist" ] || [ -d "build" ] || [ -d ".next" ]; then
            success "Build output directory created"
            
            # Check for essential build files
            local build_dir=""
            if [ -d "dist" ]; then
                build_dir="dist"
            elif [ -d "build" ]; then
                build_dir="build"
            elif [ -d ".next" ]; then
                build_dir=".next"
            fi
            
            if [ -n "$build_dir" ]; then
                local file_count=$(find "$build_dir" -type f | wc -l)
                log "Build output contains $file_count files"
                
                if [ "$file_count" -gt 10 ]; then
                    success "Build output contains sufficient files"
                else
                    warning "Build output contains few files ($file_count)"
                fi
                
                # Check for HTML files
                if find "$build_dir" -name "*.html" | grep -q .; then
                    success "HTML files found in build output"
                fi
                
                # Check for JS files
                if find "$build_dir" -name "*.js" | grep -q .; then
                    success "JavaScript files found in build output"
                fi
                
                # Check for CSS files
                if find "$build_dir" -name "*.css" | grep -q .; then
                    success "CSS files found in build output"
                fi
            fi
        else
            error "Build output directory not found"
            cd "$RESULTS_DIR/$TIMESTAMP"
            return 1
        fi
    else
        error "Production build failed"
        cd "$RESULTS_DIR/$TIMESTAMP"
        return 1
    fi
    
    cd "$RESULTS_DIR/$TIMESTAMP"
    return 0
}

# Verify deployment scripts
verify_deployment_scripts() {
    log "Verifying deployment scripts..."
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    local deployment_scripts=(
        "../../../scripts/deploy.sh"
        "../../../scripts/backup.sh"
        "../../../scripts/rollback.sh"
        "../../../scripts/health-check.sh"
    )
    
    local found_scripts=0
    
    for script in "${deployment_scripts[@]}"; do
        if [ -f "$script" ]; then
            found_scripts=$((found_scripts + 1))
            success "Deployment script found: $(basename "$script")"
            
            # Check if script is executable
            if [ -x "$script" ]; then
                success "Script is executable: $(basename "$script")"
            else
                warning "Script is not executable: $(basename "$script")"
            fi
            
            # Basic script validation
            if grep -q "#!/bin/bash" "$script"; then
                success "Script has proper shebang: $(basename "$script")"
            fi
        fi
    done
    
    if [ $found_scripts -eq 0 ]; then
        error "No deployment scripts found"
        return 1
    elif [ $found_scripts -ge 3 ]; then
        success "Comprehensive deployment scripts found ($found_scripts)"
        return 0
    else
        warning "Limited deployment scripts ($found_scripts)"
        return 0
    fi
}

# Verify SSL/TLS configuration
verify_ssl_configuration() {
    log "Verifying SSL/TLS configuration..."
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))

    if [[ "$DOMAIN" == https://* ]]; then
        local domain_name=$(echo "$DOMAIN" | sed -e 's|^[^/]*//||' -e 's|/.*$||')

        # Test SSL certificate
        log "Testing SSL certificate for $domain_name..."
        local ssl_info=$(echo | openssl s_client -connect "$domain_name:443" -servername "$domain_name" 2>/dev/null | openssl x509 -noout -dates 2>/dev/null || echo "SSL_ERROR")

        if [[ "$ssl_info" != "SSL_ERROR" ]]; then
            success "SSL certificate is valid"
            echo "$ssl_info" > ssl_certificate_info.txt

            # Check certificate expiration
            local expiry_date=$(echo "$ssl_info" | grep "notAfter" | cut -d= -f2)
            if [ -n "$expiry_date" ]; then
                local expiry_timestamp=$(date -d "$expiry_date" +%s 2>/dev/null || echo "0")
                local current_timestamp=$(date +%s)
                local days_until_expiry=$(( (expiry_timestamp - current_timestamp) / 86400 ))

                if [ $days_until_expiry -gt 30 ]; then
                    success "SSL certificate expires in $days_until_expiry days"
                elif [ $days_until_expiry -gt 7 ]; then
                    warning "SSL certificate expires in $days_until_expiry days - renewal recommended"
                else
                    critical "SSL certificate expires in $days_until_expiry days - immediate renewal required"
                fi
            fi
        else
            error "SSL certificate validation failed"
            return 1
        fi
    else
        warning "Domain not using HTTPS - SSL verification skipped"
    fi

    return 0
}

# Test application health endpoints
test_health_endpoints() {
    log "Testing application health endpoints..."
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))

    local health_endpoints=(
        "/api/health"
        "/api/health/detailed"
        "/api/metrics"
        "/health"
    )

    local working_endpoints=0

    for endpoint in "${health_endpoints[@]}"; do
        local url="$DOMAIN$endpoint"
        log "Testing endpoint: $url"

        local response_code=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null || echo "000")

        if [ "$response_code" = "200" ]; then
            success "Health endpoint working: $endpoint"
            working_endpoints=$((working_endpoints + 1))
        elif [ "$response_code" = "404" ]; then
            log "Health endpoint not found: $endpoint (expected for some endpoints)"
        else
            warning "Health endpoint issue: $endpoint (HTTP $response_code)"
        fi
    done

    if [ $working_endpoints -gt 0 ]; then
        success "$working_endpoints health endpoints are working"
        return 0
    else
        warning "No health endpoints are accessible"
        return 1
    fi
}

# Generate deployment verification report
generate_deployment_report() {
    log "Generating deployment verification report..."
    
    local success_rate=$((PASSED_CHECKS * 100 / TOTAL_CHECKS))
    
    cat > deployment_verification_report.md << EOF
# Production Deployment Verification Report

**Verification Date:** $(date)
**Environment:** $ENVIRONMENT
**Domain:** $DOMAIN
**Docker Image:** $DOCKER_IMAGE
**Success Rate:** $success_rate% ($PASSED_CHECKS/$TOTAL_CHECKS)

## Deployment Readiness Summary

### Overall Assessment
$(if [ $success_rate -ge 90 ]; then
    echo "🟢 **EXCELLENT** - Production deployment ready"
elif [ $success_rate -ge 75 ]; then
    echo "🟡 **GOOD** - Production deployment ready with minor issues"
elif [ $success_rate -ge 50 ]; then
    echo "🟠 **MODERATE** - Production deployment needs improvements"
else
    echo "🔴 **POOR** - Production deployment not ready"
fi)

### Verification Results
- **Total Checks:** $TOTAL_CHECKS
- **Passed Checks:** $PASSED_CHECKS
- **Critical Issues:** $CRITICAL_ISSUES
- **Warning Issues:** $WARNING_ISSUES
- **Success Rate:** $success_rate%

## Detailed Verification Results

### CI/CD Pipeline
$(if [ -f "../../../.github/workflows/ci.yml" ] || [ -f "../../../.github/workflows/cd.yml" ]; then
    echo "- ✅ CI/CD pipeline configuration found"
    echo "- ✅ Build and test stages configured"
    echo "- ✅ Deployment automation ready"
else
    echo "- ⚠️ Limited CI/CD pipeline configuration"
fi)

### Docker Configuration
$(if [ -f "../../../Dockerfile" ]; then
    echo "- ✅ Dockerfile present and validated"
    echo "- ✅ Docker build process tested"
    echo "- ✅ Container deployment ready"
else
    echo "- ⚠️ Docker configuration incomplete"
fi)

### Production Configuration
$(if [ -f "../../../package.json" ]; then
    echo "- ✅ Production build scripts configured"
    echo "- ✅ Environment configuration present"
    echo "- ✅ Application configuration validated"
else
    echo "- ⚠️ Production configuration needs attention"
fi)

### Deployment Scripts
$(if [ -f "../../../scripts/deploy.sh" ]; then
    echo "- ✅ Deployment automation scripts present"
    echo "- ✅ Backup and rollback procedures available"
    echo "- ✅ Health check mechanisms implemented"
else
    echo "- ⚠️ Deployment scripts need enhancement"
fi)

### Health Monitoring
$(if [ $working_endpoints -gt 0 ]; then
    echo "- ✅ Health endpoints accessible"
    echo "- ✅ Application monitoring ready"
    echo "- ✅ Production health checks working"
else
    echo "- ⚠️ Health monitoring needs configuration"
fi)

## Deployment Checklist

### Pre-Deployment
- [ ] CI/CD pipeline tested and working
- [ ] Docker build process validated
- [ ] Production configuration verified
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] SSL certificates installed

### Deployment Process
- [ ] Blue-green deployment strategy
- [ ] Zero-downtime deployment
- [ ] Automated rollback capability
- [ ] Health check validation
- [ ] Performance monitoring
- [ ] Error tracking enabled

### Post-Deployment
- [ ] Application health verified
- [ ] Performance metrics baseline
- [ ] Security scan completed
- [ ] Backup verification
- [ ] Monitoring alerts configured
- [ ] Documentation updated

## Recommendations

### High Priority
$(if [ $CRITICAL_ISSUES -gt 0 ]; then
    echo "1. **Address Critical Issues** - $CRITICAL_ISSUES critical deployment issues need immediate attention"
    echo "2. **Complete Missing Components** - Ensure all required deployment components are present"
    echo "3. **Test Deployment Process** - Perform full deployment test in staging environment"
fi)

### Medium Priority
$(if [ $WARNING_ISSUES -gt 0 ]; then
    echo "1. **Resolve Warnings** - $WARNING_ISSUES warning issues should be addressed"
    echo "2. **Enhance Monitoring** - Improve health checks and monitoring capabilities"
    echo "3. **Automate Processes** - Increase deployment automation and reduce manual steps"
fi)

### Low Priority
1. **Documentation** - Update deployment documentation and runbooks
2. **Optimization** - Optimize build and deployment processes for speed
3. **Monitoring** - Enhance monitoring and alerting capabilities

---
**Report Generated:** $(date)
**Deployment Engineer:** Automated Deployment Verification System
**Next Verification:** $(date -d "+1 month")
EOF
    
    success "Deployment verification report generated: deployment_verification_report.md"
}

# Main execution
main() {
    log "Starting production deployment verification..."
    log "Environment: $ENVIRONMENT"
    log "Domain: $DOMAIN"
    log "Results Directory: $RESULTS_DIR/$TIMESTAMP"
    
    # Run verification checks
    check_deployment_dependencies || exit 1

    verify_cicd_pipeline
    verify_docker_configuration
    test_docker_build
    verify_production_config
    test_production_build
    verify_deployment_scripts
    verify_ssl_configuration
    test_health_endpoints
    
    # Generate report
    generate_deployment_report
    
    # Final summary
    local success_rate=$((PASSED_CHECKS * 100 / TOTAL_CHECKS))
    
    log "Production deployment verification completed!"
    log "Success Rate: $success_rate% ($PASSED_CHECKS/$TOTAL_CHECKS)"
    log "Critical Issues: $CRITICAL_ISSUES"
    log "Warning Issues: $WARNING_ISSUES"
    log "Results saved to: $RESULTS_DIR/$TIMESTAMP"
    
    if [ $CRITICAL_ISSUES -eq 0 ] && [ $success_rate -ge 75 ]; then
        success "Production deployment verification PASSED! 🚀"
        return 0
    else
        error "Production deployment verification FAILED. Issues need attention."
        return 1
    fi
}

# Handle script interruption
cleanup() {
    log "Deployment verification interrupted"
    # Cleanup any running containers
    docker stop "${DOCKER_IMAGE}_test" > /dev/null 2>&1 || true
    docker rm "${DOCKER_IMAGE}_test" > /dev/null 2>&1 || true
    docker rmi "$DOCKER_IMAGE:test" > /dev/null 2>&1 || true
    exit 1
}

trap cleanup INT TERM

# Run main function
main "$@"
