#!/bin/bash

# Production Deployment Script for Laser Cutting Calculator Platform
# This script handles the complete production deployment process

set -e

# Configuration
PROJECT_NAME="laser-cutting-calculator"
VERSION="1.0.0"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="./logs/deploy-production-$TIMESTAMP.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE" >&2
    exit 1
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" | tee -a "$LOG_FILE"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$LOG_FILE"
}

# Create logs directory
mkdir -p logs

# Deployment platform selection
PLATFORM=${1:-"vercel"}

log "Starting production deployment for $PROJECT_NAME v$VERSION"
log "Deployment platform: $PLATFORM"
log "Timestamp: $TIMESTAMP"

# Pre-deployment checks
log "Running pre-deployment checks..."

# Check if we're on the main branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    warning "Not on main branch (current: $CURRENT_BRANCH). Continue? (y/N)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        error "Deployment cancelled"
    fi
fi

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
    error "Uncommitted changes detected. Please commit or stash changes before deployment."
fi

# Check Node.js version
NODE_VERSION=$(node --version)
log "Node.js version: $NODE_VERSION"
if ! node --version | grep -q "v18\|v20"; then
    warning "Node.js version should be 18 or 20 for optimal compatibility"
fi

# Install dependencies
log "Installing dependencies..."
npm ci --only=production || error "Failed to install dependencies"

# Run tests
log "Running test suite..."
npm run test:ci || error "Tests failed. Deployment aborted."

# Type checking
log "Running TypeScript type checking..."
npm run type-check || error "Type checking failed. Deployment aborted."

# Linting
log "Running linting..."
npm run lint || error "Linting failed. Deployment aborted."

# Security audit
log "Running security audit..."
npm audit --audit-level high || warning "Security audit found issues. Review before proceeding."

# Build for production
log "Building for production..."
npm run build:production || error "Production build failed"

# Verify build output
log "Verifying build output..."
if [ ! -d "dist" ]; then
    error "Build output directory 'dist' not found"
fi

if [ ! -f "dist/index.html" ]; then
    error "Main HTML file not found in build output"
fi

# Check build size
BUILD_SIZE=$(du -sh dist | cut -f1)
log "Build size: $BUILD_SIZE"

# Run lighthouse audit on preview
log "Starting preview server for testing..."
npm run preview &
PREVIEW_PID=$!
sleep 5

# Wait for server to be ready
for i in {1..30}; do
    if curl -s http://localhost:4173 > /dev/null; then
        break
    fi
    sleep 1
done

# Run basic smoke tests
log "Running smoke tests..."
if ! curl -s http://localhost:4173 | grep -q "Laser Cutting Calculator"; then
    kill $PREVIEW_PID
    error "Smoke test failed: Main page not loading correctly"
fi

# Test calculator pages
CALCULATOR_PATHS=(
    "/calculators/laser-cutting-cost"
    "/calculators/cutting-time-estimator"
    "/calculators/laser-parameter-optimizer"
)

for path in "${CALCULATOR_PATHS[@]}"; do
    if ! curl -s "http://localhost:4173$path" | grep -q "html"; then
        warning "Calculator page may not be loading correctly: $path"
    fi
done

# Stop preview server
kill $PREVIEW_PID

success "Pre-deployment checks completed successfully"

# Platform-specific deployment
case $PLATFORM in
    "vercel")
        log "Deploying to Vercel..."
        
        # Check if Vercel CLI is installed
        if ! command -v vercel &> /dev/null; then
            log "Installing Vercel CLI..."
            npm install -g vercel
        fi
        
        # Deploy to Vercel
        vercel --prod --confirm || error "Vercel deployment failed"
        
        # Get deployment URL
        DEPLOYMENT_URL=$(vercel ls | grep "$PROJECT_NAME" | head -1 | awk '{print $2}')
        log "Deployment URL: https://$DEPLOYMENT_URL"
        ;;
        
    "netlify")
        log "Deploying to Netlify..."
        
        # Check if Netlify CLI is installed
        if ! command -v netlify &> /dev/null; then
            log "Installing Netlify CLI..."
            npm install -g netlify-cli
        fi
        
        # Deploy to Netlify
        netlify deploy --prod --dir=dist || error "Netlify deployment failed"
        ;;
        
    "cloudflare")
        log "Deploying to Cloudflare Pages..."
        
        # Check if Wrangler is installed
        if ! command -v wrangler &> /dev/null; then
            log "Installing Wrangler..."
            npm install -g wrangler
        fi
        
        # Deploy to Cloudflare Pages
        wrangler pages deploy dist --project-name="$PROJECT_NAME" || error "Cloudflare deployment failed"
        ;;
        
    *)
        error "Unknown deployment platform: $PLATFORM. Supported: vercel, netlify, cloudflare"
        ;;
esac

# Post-deployment verification
log "Running post-deployment verification..."

# Wait for deployment to propagate
log "Waiting for deployment to propagate..."
sleep 30

# Verify deployment (you'll need to update these URLs based on your actual deployment)
PRODUCTION_URL="https://lasercalc.com"
if [ "$PLATFORM" = "vercel" ] && [ -n "$DEPLOYMENT_URL" ]; then
    PRODUCTION_URL="https://$DEPLOYMENT_URL"
fi

log "Verifying deployment at: $PRODUCTION_URL"

# Basic connectivity test
if curl -s --max-time 30 "$PRODUCTION_URL" > /dev/null; then
    success "Production site is accessible"
else
    error "Production site is not accessible"
fi

# Test main page content
if curl -s --max-time 30 "$PRODUCTION_URL" | grep -q "Laser Cutting Calculator"; then
    success "Main page content verified"
else
    warning "Main page content verification failed"
fi

# Test calculator functionality (basic check)
CALC_URL="$PRODUCTION_URL/calculators/laser-cutting-cost"
if curl -s --max-time 30 "$CALC_URL" > /dev/null; then
    success "Calculator pages accessible"
else
    warning "Calculator pages may not be accessible"
fi

# Create deployment record
DEPLOYMENT_RECORD="deployments/deployment-$TIMESTAMP.json"
mkdir -p deployments

cat > "$DEPLOYMENT_RECORD" << EOF
{
  "timestamp": "$TIMESTAMP",
  "version": "$VERSION",
  "platform": "$PLATFORM",
  "branch": "$CURRENT_BRANCH",
  "commit": "$(git rev-parse HEAD)",
  "buildSize": "$BUILD_SIZE",
  "deploymentUrl": "$PRODUCTION_URL",
  "nodeVersion": "$NODE_VERSION",
  "status": "success"
}
EOF

# Update version in package.json if needed
npm version patch --no-git-tag-version || warning "Failed to update version"

# Tag the release
git tag -a "v$VERSION-$TIMESTAMP" -m "Production deployment v$VERSION" || warning "Failed to create git tag"

# Cleanup
log "Cleaning up..."
rm -rf node_modules/.cache || true

success "Production deployment completed successfully!"
log "Deployment URL: $PRODUCTION_URL"
log "Deployment record: $DEPLOYMENT_RECORD"
log "Log file: $LOG_FILE"

# Final summary
echo ""
echo "🎉 Deployment Summary:"
echo "   Platform: $PLATFORM"
echo "   Version: $VERSION"
echo "   URL: $PRODUCTION_URL"
echo "   Build Size: $BUILD_SIZE"
echo "   Timestamp: $TIMESTAMP"
echo ""
echo "Next steps:"
echo "1. Verify all 27 calculators work correctly"
echo "2. Test mobile responsiveness"
echo "3. Check performance metrics"
echo "4. Monitor error logs"
echo "5. Update DNS if using custom domain"
echo ""

log "Deployment script completed"
