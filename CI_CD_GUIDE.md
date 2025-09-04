# CI/CD Pipeline Guide

## Overview

This document describes the Continuous Integration and Continuous Deployment (CI/CD) pipeline for the Laser Cutting Calculator platform. The pipeline is built using GitHub Actions and provides automated testing, building, and deployment capabilities.

## Pipeline Architecture

### Workflow Triggers
- **Push to main**: Triggers production deployment
- **Push to develop**: Triggers staging deployment
- **Pull Request**: Triggers testing and validation
- **Release**: Triggers production deployment with versioning

### Pipeline Stages

#### 1. Test & Quality Checks
- **Linting**: ESLint and Prettier checks
- **Type Checking**: TypeScript compilation
- **Unit Tests**: Vitest test suite with coverage
- **Build Verification**: Production build test

#### 2. Security Scanning
- **Vulnerability Scanning**: Trivy filesystem scan
- **Dependency Audit**: npm/yarn audit
- **SARIF Upload**: Security results to GitHub Security tab

#### 3. Docker Image Build
- **Multi-platform Build**: AMD64 and ARM64 support
- **Registry Push**: GitHub Container Registry
- **Image Tagging**: Branch, SHA, and semantic versioning
- **Build Caching**: GitHub Actions cache optimization

#### 4. Environment Deployment
- **Staging**: Automatic deployment from develop branch
- **Production**: Automatic deployment from main branch
- **Manual Approval**: Production deployments require approval

#### 5. Testing & Validation
- **Smoke Tests**: Basic functionality verification
- **Performance Tests**: Lighthouse CI integration
- **Security Tests**: SSL and header validation
- **Health Checks**: Endpoint monitoring

## Environment Configuration

### Staging Environment
- **URL**: https://staging.lasercalc.com
- **Branch**: develop
- **Database**: Separate staging database
- **Features**: Debug mode enabled, test data

### Production Environment
- **URL**: https://lasercalc.com
- **Branch**: main
- **Database**: Production database with backups
- **Features**: Optimized for performance and security

## Deployment Process

### Zero-Downtime Deployment
1. **Image Build**: New Docker image is built and pushed
2. **Health Check**: Verify new image health
3. **Rolling Update**: Gradual replacement of containers
4. **Verification**: Post-deployment health checks
5. **Rollback**: Automatic rollback on failure

### Manual Deployment Commands

```bash
# Deploy to staging
yarn deploy:staging

# Deploy to production
yarn deploy:production

# Rollback deployment
yarn deploy:rollback

# Test deployment
yarn test:deployment staging

# Run smoke tests
yarn test:smoke
```

## Security Features

### Image Security
- **Base Image**: Official Node.js Alpine images
- **Vulnerability Scanning**: Trivy integration
- **Non-root User**: Containers run as non-root
- **Minimal Dependencies**: Production-only packages

### Secrets Management
- **GitHub Secrets**: Sensitive configuration
- **Environment Variables**: Runtime configuration
- **SSL Certificates**: Automated certificate management
- **Database Credentials**: Secure credential storage

## Monitoring & Observability

### Health Checks
- **Application Health**: /health endpoint
- **Database Health**: Connection verification
- **Cache Health**: Redis connectivity
- **Service Health**: All dependencies

### Performance Monitoring
- **Lighthouse CI**: Performance metrics
- **Response Time**: API response monitoring
- **Resource Usage**: CPU and memory tracking
- **Error Rates**: Application error monitoring

## Backup & Recovery

### Automated Backups
- **Database Backups**: Daily PostgreSQL dumps
- **Application Data**: File uploads and logs
- **Configuration**: Environment and settings
- **S3 Storage**: Cloud backup storage

### Disaster Recovery
- **Rollback Capability**: Quick version rollback
- **Data Recovery**: Point-in-time recovery
- **Service Restoration**: Automated service restart
- **Monitoring Alerts**: Real-time issue detection

## Development Workflow

### Branch Strategy
```
main (production)
├── develop (staging)
│   ├── feature/new-calculator
│   ├── feature/ui-improvements
│   └── hotfix/critical-bug
```

### Commit Guidelines
- **Conventional Commits**: Standardized commit messages
- **Semantic Versioning**: Automated version bumping
- **Pull Requests**: Required for main and develop
- **Code Review**: Mandatory peer review

### Testing Strategy
- **Unit Tests**: Component and service testing
- **Integration Tests**: API and database testing
- **E2E Tests**: Full user workflow testing
- **Performance Tests**: Load and stress testing

## Configuration Files

### GitHub Actions
- `.github/workflows/ci-cd.yml`: Main CI/CD pipeline
- `lighthouserc.json`: Performance testing config

### Docker
- `Dockerfile.production`: Production image build
- `docker-compose.production.yml`: Production stack
- `docker-compose.staging.yml`: Staging stack

### Scripts
- `scripts/deploy.sh`: Deployment automation
- `scripts/test-deployment.sh`: Deployment testing
- `scripts/backup.sh`: Backup automation

### Environment
- `.env.production.example`: Production config template
- `.env.staging.example`: Staging config template

## Troubleshooting

### Common Issues

#### Build Failures
```bash
# Check build logs
docker build -f Dockerfile.production .

# Test locally
yarn build
```

#### Deployment Failures
```bash
# Check deployment status
yarn test:deployment staging

# View container logs
docker-compose -f docker-compose.staging.yml logs app

# Rollback if needed
yarn deploy:rollback
```

#### Performance Issues
```bash
# Run performance tests
yarn test:deployment staging comprehensive

# Check resource usage
docker stats

# Analyze Lighthouse results
npx lighthouse https://staging.lasercalc.com
```

### Health Check Endpoints
- **Application**: `/health`
- **API**: `/api/health`
- **Database**: Internal health check
- **Cache**: Internal health check

### Log Locations
- **Application Logs**: `./logs/app.log`
- **Nginx Logs**: `./logs/nginx/`
- **Database Logs**: Container logs
- **Deployment Logs**: GitHub Actions

## Best Practices

### Security
- **Secrets Rotation**: Regular credential updates
- **Dependency Updates**: Automated security patches
- **Access Control**: Minimal required permissions
- **Audit Logging**: Comprehensive activity logs

### Performance
- **Image Optimization**: Multi-stage builds
- **Caching Strategy**: Build and runtime caching
- **Resource Limits**: Container resource constraints
- **CDN Integration**: Static asset optimization

### Reliability
- **Health Checks**: Comprehensive monitoring
- **Graceful Shutdown**: Proper signal handling
- **Circuit Breakers**: Failure isolation
- **Retry Logic**: Resilient error handling

## Maintenance

### Regular Tasks
- **Dependency Updates**: Weekly security updates
- **Image Updates**: Monthly base image updates
- **Backup Verification**: Weekly restore tests
- **Performance Review**: Monthly optimization

### Monitoring
- **Uptime Monitoring**: 24/7 availability checks
- **Performance Metrics**: Response time tracking
- **Error Tracking**: Real-time error monitoring
- **Security Scanning**: Continuous vulnerability assessment

## Support

### Documentation
- **API Documentation**: OpenAPI/Swagger specs
- **Deployment Guide**: This document
- **Troubleshooting**: Common issues and solutions
- **Architecture**: System design documentation

### Contacts
- **Development Team**: Primary support
- **DevOps Team**: Infrastructure support
- **Security Team**: Security issues
- **Management**: Escalation path

---

**Last Updated**: $(date)
**Version**: 1.0.0
**Environment**: Production Ready
