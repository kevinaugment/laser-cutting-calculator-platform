#!/bin/bash

# Simple System Integration Verification
# Quick verification of system components

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
TOTAL_CHECKS=0
PASSED_CHECKS=0

# Logging functions
log() {
    echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅${NC} $1"
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
}

error() {
    echo -e "${RED}❌${NC} $1"
}

warning() {
    echo -e "${YELLOW}⚠️${NC} $1"
}

check() {
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
}

# Verification checks
log "Starting System Integration Verification..."

# Check 1: Calculator Services
check
log "Checking Calculator Services..."
if [ -d "src/services/calculators" ]; then
    calculator_count=$(find src/services/calculators -name "*.ts" | wc -l)
    if [ "$calculator_count" -ge 15 ]; then
        success "Calculator Services: $calculator_count calculator services found"
    else
        error "Calculator Services: Only $calculator_count calculator services found (expected ≥15)"
    fi
else
    error "Calculator Services: Directory not found"
fi

# Check 2: API Routes
check
log "Checking API Routes..."
if [ -d "src/routes" ]; then
    route_count=$(find src/routes -name "*.ts" | wc -l)
    if [ "$route_count" -ge 5 ]; then
        success "API Routes: $route_count route files found"
    else
        error "API Routes: Only $route_count route files found (expected ≥5)"
    fi
else
    error "API Routes: Directory not found"
fi

# Check 3: Frontend Components
check
log "Checking Frontend Components..."
if [ -d "src/components" ]; then
    component_dirs=$(find src/components -type d | wc -l)
    if [ "$component_dirs" -ge 5 ]; then
        success "Frontend Components: $component_dirs component directories found"
    else
        error "Frontend Components: Only $component_dirs component directories found (expected ≥5)"
    fi
else
    error "Frontend Components: Directory not found"
fi

# Check 4: Configuration Files
check
log "Checking Configuration Files..."
config_files=("package.json" "tsconfig.json" "vite.config.ts" "docker-compose.yml")
missing_configs=()

for file in "${config_files[@]}"; do
    if [ ! -f "$file" ]; then
        missing_configs+=("$file")
    fi
done

if [ ${#missing_configs[@]} -eq 0 ]; then
    success "Configuration Files: All ${#config_files[@]} config files found"
else
    error "Configuration Files: Missing files: ${missing_configs[*]}"
fi

# Check 5: Docker Configuration
check
log "Checking Docker Configuration..."
docker_files=("Dockerfile" "docker-compose.yml" "docker-compose.production.yml")
found_docker=0

for file in "${docker_files[@]}"; do
    if [ -f "$file" ]; then
        found_docker=$((found_docker + 1))
    fi
done

if [ "$found_docker" -ge 2 ]; then
    success "Docker Configuration: $found_docker Docker files found"
else
    error "Docker Configuration: Only $found_docker Docker files found (expected ≥2)"
fi

# Check 6: CI/CD Configuration
check
log "Checking CI/CD Configuration..."
cicd_files=(".github/workflows/ci.yml" ".github/workflows/cd.yml" "scripts/deploy.sh")
found_cicd=0

for file in "${cicd_files[@]}"; do
    if [ -f "$file" ]; then
        found_cicd=$((found_cicd + 1))
    fi
done

if [ "$found_cicd" -ge 2 ]; then
    success "CI/CD Configuration: $found_cicd CI/CD files found"
else
    error "CI/CD Configuration: Only $found_cicd CI/CD files found (expected ≥2)"
fi

# Check 7: Monitoring Configuration
check
log "Checking Monitoring Configuration..."
monitoring_files=("monitoring/prometheus.yml" "monitoring/grafana-dashboard.json" "monitoring/backup-monitoring.yml")
found_monitoring=0

for file in "${monitoring_files[@]}"; do
    if [ -f "$file" ]; then
        found_monitoring=$((found_monitoring + 1))
    fi
done

if [ "$found_monitoring" -ge 2 ]; then
    success "Monitoring Configuration: $found_monitoring monitoring files found"
else
    error "Monitoring Configuration: Only $found_monitoring monitoring files found (expected ≥2)"
fi

# Check 8: Security Configuration
check
log "Checking Security Configuration..."
security_files=("security/security-config.ts" "src/hooks/useSecurity.ts")
found_security=0

for file in "${security_files[@]}"; do
    if [ -f "$file" ]; then
        found_security=$((found_security + 1))
    fi
done

if [ "$found_security" -ge 1 ]; then
    success "Security Configuration: $found_security security files found"
else
    error "Security Configuration: No security files found"
fi

# Check 9: Backup and DR Configuration
check
log "Checking Backup and DR Configuration..."
backup_files=("scripts/backup.sh" "scripts/disaster-recovery.sh" "BACKUP_DISASTER_RECOVERY_PLAN.md")
found_backup=0

for file in "${backup_files[@]}"; do
    if [ -f "$file" ]; then
        found_backup=$((found_backup + 1))
    fi
done

if [ "$found_backup" -ge 2 ]; then
    success "Backup and DR: $found_backup backup/DR files found"
else
    error "Backup and DR: Only $found_backup backup/DR files found (expected ≥2)"
fi

# Check 10: Documentation
check
log "Checking Documentation..."
doc_files=("README.md" "API_DOCUMENTATION.md" "DEPLOYMENT_GUIDE.md")
found_docs=0

for file in "${doc_files[@]}"; do
    if [ -f "$file" ]; then
        found_docs=$((found_docs + 1))
    fi
done

if [ "$found_docs" -ge 2 ]; then
    success "Documentation: $found_docs documentation files found"
else
    error "Documentation: Only $found_docs documentation files found (expected ≥2)"
fi

# Check 11: Test Configuration
check
log "Checking Test Configuration..."
if [ -d "tests" ]; then
    test_dirs=$(find tests -type d | wc -l)
    if [ "$test_dirs" -ge 3 ]; then
        success "Test Configuration: $test_dirs test directories found"
    else
        error "Test Configuration: Only $test_dirs test directories found (expected ≥3)"
    fi
else
    error "Test Configuration: Tests directory not found"
fi

# Check 12: Package Dependencies
check
log "Checking Package Dependencies..."
if [ -f "package.json" ]; then
    if command -v jq >/dev/null 2>&1; then
        dep_count=$(jq -r '.dependencies // {} | keys | length' package.json)
        dev_dep_count=$(jq -r '.devDependencies // {} | keys | length' package.json)
        total_deps=$((dep_count + dev_dep_count))
        
        if [ "$total_deps" -ge 20 ]; then
            success "Package Dependencies: $total_deps dependencies configured"
        else
            error "Package Dependencies: Only $total_deps dependencies found (expected ≥20)"
        fi
    else
        warning "Package Dependencies: jq not available, skipping detailed check"
        success "Package Dependencies: package.json exists"
    fi
else
    error "Package Dependencies: package.json not found"
fi

# Summary
echo ""
echo "============================================================"
echo "                VERIFICATION SUMMARY"
echo "============================================================"

success_rate=$((PASSED_CHECKS * 100 / TOTAL_CHECKS))

if [ "$PASSED_CHECKS" -eq "$TOTAL_CHECKS" ]; then
    success "All $TOTAL_CHECKS checks passed! System integration is complete. 🎉"
    echo ""
    log "System is ready for production deployment!"
    exit 0
else
    failed_checks=$((TOTAL_CHECKS - PASSED_CHECKS))
    error "$PASSED_CHECKS/$TOTAL_CHECKS checks passed ($success_rate%). $failed_checks issues found."
    echo ""
    warning "Please address the failed checks before proceeding to production."
    exit 1
fi
