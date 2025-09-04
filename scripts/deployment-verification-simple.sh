#!/bin/bash

# Simplified Production Deployment Verification Script
# Verification without Docker dependency

set -e

# Configuration
ENVIRONMENT="${ENVIRONMENT:-production}"
DOMAIN="${DOMAIN:-http://localhost:3000}"
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

# Create results directory
mkdir -p "$RESULTS_DIR/$TIMESTAMP"
cd "$RESULTS_DIR/$TIMESTAMP"

# Check basic dependencies
check_basic_dependencies() {
    log "Checking basic deployment dependencies..."
    
    local deps=("curl" "jq" "git" "node" "npm")
    local missing_deps=()
    
    for dep in "${deps[@]}"; do
        if ! command -v "$dep" &> /dev/null; then
            missing_deps+=("$dep")
        fi
    done
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        error "Missing basic dependencies: ${missing_deps[*]}"
        return 1
    else
        success "All basic dependencies are available"
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
        fi
    done
    
    if [ $found_pipelines -eq 0 ]; then
        error "No CI/CD pipeline configuration found"
        return 1
    else
        success "CI/CD pipeline configuration found ($found_pipelines files)"
        return 0
    fi
}

# Verify deployment configuration files
verify_deployment_config() {
    log "Verifying deployment configuration files..."
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    local config_files=(
        "../../../Dockerfile"
        "../../../docker-compose.yml"
        "../../../docker-compose.production.yml"
        "../../../.dockerignore"
        "../../../package.json"
        "../../../vite.config.ts"
    )
    
    local found_configs=0
    
    for file in "${config_files[@]}"; do
        if [ -f "$file" ]; then
            found_configs=$((found_configs + 1))
            success "Configuration file found: $(basename "$file")"
        fi
    done
    
    if [ $found_configs -ge 4 ]; then
        success "Comprehensive deployment configuration found ($found_configs files)"
        return 0
    else
        warning "Limited deployment configuration ($found_configs files)"
        return 1
    fi
}

# Test production build process
test_production_build() {
    log "Testing production build process..."
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    cd ../../../
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        log "Installing dependencies..."
        npm install > "$RESULTS_DIR/$TIMESTAMP/npm_install.log" 2>&1 || {
            error "npm install failed"
            cd "$RESULTS_DIR/$TIMESTAMP"
            return 1
        }
    fi
    
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
        fi
    done
    
    if [ $found_scripts -eq 0 ]; then
        warning "No deployment scripts found"
        return 1
    else
        success "Deployment scripts found ($found_scripts)"
        return 0
    fi
}

# Verify environment configuration
verify_environment_config() {
    log "Verifying environment configuration..."
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    local env_files=(
        "../../../.env.example"
        "../../../.env.production"
        "../../../.env.local"
    )
    
    local found_env_files=0
    
    for file in "${env_files[@]}"; do
        if [ -f "$file" ]; then
            found_env_files=$((found_env_files + 1))
            success "Environment file found: $(basename "$file")"
            
            # Check for security issues
            if grep -qi "password.*=" "$file" 2>/dev/null; then
                if [[ "$file" == *".example" ]]; then
                    success "Example environment file contains password template"
                else
                    warning "Environment file may contain actual passwords"
                fi
            fi
        fi
    done
    
    if [ $found_env_files -eq 0 ]; then
        warning "No environment configuration files found"
        return 1
    else
        success "Environment configuration found ($found_env_files files)"
        return 0
    fi
}

# Test package.json scripts
test_package_scripts() {
    log "Testing package.json scripts..."
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    if [ ! -f "../../../package.json" ]; then
        error "package.json not found"
        return 1
    fi
    
    local required_scripts=("build" "start" "dev")
    local missing_scripts=()
    
    for script in "${required_scripts[@]}"; do
        if grep -q "\"$script\":" "../../../package.json"; then
            success "Package script found: $script"
        else
            missing_scripts+=("$script")
        fi
    done
    
    if [ ${#missing_scripts[@]} -eq 0 ]; then
        success "All required package scripts are present"
        return 0
    else
        error "Missing package scripts: ${missing_scripts[*]}"
        return 1
    fi
}

# Verify security configuration
verify_security_config() {
    log "Verifying security configuration..."
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    local security_files=(
        "../../../security/security-config.ts"
        "../../../src/hooks/useSecurity.ts"
        "../../../src/middleware/security.ts"
    )
    
    local found_security_files=0
    
    for file in "${security_files[@]}"; do
        if [ -f "$file" ]; then
            found_security_files=$((found_security_files + 1))
            success "Security configuration found: $(basename "$file")"
        fi
    done
    
    if [ $found_security_files -eq 0 ]; then
        warning "No security configuration files found"
        return 1
    else
        success "Security configuration found ($found_security_files files)"
        return 0
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

### CI/CD Pipeline Configuration
$(if [ -f "../../../.github/workflows/ci.yml" ] || [ -f "../../../.github/workflows/cd.yml" ]; then
    echo "- ✅ CI/CD pipeline configuration present"
else
    echo "- ⚠️ CI/CD pipeline configuration missing"
fi)

### Deployment Configuration
$(if [ -f "../../../Dockerfile" ] && [ -f "../../../docker-compose.yml" ]; then
    echo "- ✅ Docker configuration complete"
elif [ -f "../../../package.json" ] && [ -f "../../../vite.config.ts" ]; then
    echo "- ✅ Node.js deployment configuration present"
else
    echo "- ⚠️ Deployment configuration incomplete"
fi)

### Build Process
$(if [ -d "../../../dist" ] || [ -d "../../../build" ]; then
    echo "- ✅ Production build successful"
    echo "- ✅ Build artifacts generated"
else
    echo "- ⚠️ Production build needs verification"
fi)

### Environment Configuration
$(if [ -f "../../../.env.example" ]; then
    echo "- ✅ Environment configuration template present"
else
    echo "- ⚠️ Environment configuration missing"
fi)

### Security Configuration
$(if [ -f "../../../security/security-config.ts" ]; then
    echo "- ✅ Security configuration implemented"
else
    echo "- ⚠️ Security configuration needs attention"
fi)

## Deployment Recommendations

### High Priority
$(if [ $CRITICAL_ISSUES -gt 0 ]; then
    echo "1. **Address Critical Issues** - $CRITICAL_ISSUES critical issues need immediate attention"
    echo "2. **Complete Missing Components** - Ensure all required components are present"
fi)

### Medium Priority
$(if [ $WARNING_ISSUES -gt 0 ]; then
    echo "1. **Resolve Warnings** - $WARNING_ISSUES warning issues should be addressed"
    echo "2. **Enhance Configuration** - Improve deployment configuration completeness"
fi)

### Deployment Checklist
- [ ] CI/CD pipeline configured and tested
- [ ] Production build process verified
- [ ] Environment variables configured
- [ ] Security configuration implemented
- [ ] Deployment scripts available
- [ ] Health check endpoints working
- [ ] SSL/TLS certificates configured
- [ ] Monitoring and logging enabled
- [ ] Backup and recovery procedures tested

---
**Report Generated:** $(date)
**Verification Status:** $(if [ $success_rate -ge 75 ]; then echo "✅ READY FOR DEPLOYMENT"; else echo "⚠️ NEEDS IMPROVEMENT"; fi)
EOF
    
    success "Deployment verification report generated: deployment_verification_report.md"
}

# Main execution
main() {
    log "Starting simplified production deployment verification..."
    log "Environment: $ENVIRONMENT"
    log "Domain: $DOMAIN"
    log "Results Directory: $RESULTS_DIR/$TIMESTAMP"
    
    # Run verification checks
    check_basic_dependencies || exit 1
    
    verify_cicd_pipeline
    verify_deployment_config
    test_production_build
    verify_deployment_scripts
    verify_environment_config
    test_package_scripts
    verify_security_config
    
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

# Run main function
main "$@"
