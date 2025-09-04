#!/usr/bin/env node

/**
 * System Integration Verification Script
 * Verifies that all system components are properly integrated
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors for output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'blue') {
  const timestamp = new Date().toISOString();
  console.log(`${colors[color]}[${timestamp}]${colors.reset} ${message}`);
}

function success(message) {
  log(`✅ ${message}`, 'green');
}

function error(message) {
  log(`❌ ${message}`, 'red');
}

function warning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

// Verification checks
const verificationChecks = [
  {
    name: 'Calculator Services',
    check: () => {
      const servicesDir = path.join(__dirname, '../src/services/calculators');
      if (!fs.existsSync(servicesDir)) {
        return { passed: false, message: 'Calculator services directory not found' };
      }
      
      const expectedCalculators = [
        'LaserCuttingCostCalculator.ts',
        'CuttingTimeEstimator.ts',
        'LaserParameterOptimizer.ts',
        'MaterialSelectionAssistant.ts',
        'KerfWidthCalculator.ts',
        'PowerRequirementCalculator.ts',
        'ProductionCapacityPlanner.ts',
        'QualityGradeAssessor.ts',
        'EnergyCostCalculator.ts',
        'BatchProcessingOptimizer.ts',
        'MaintenanceCostEstimator.ts',
        'CompetitivePricingAnalyzer.ts',
        'EquipmentComparisonTool.ts',
        'GasConsumptionCalculator.ts',
        'PowerSpeedMatchingCalculator.ts'
      ];
      
      const missingCalculators = expectedCalculators.filter(calc => 
        !fs.existsSync(path.join(servicesDir, calc))
      );
      
      if (missingCalculators.length > 0) {
        return { 
          passed: false, 
          message: `Missing calculators: ${missingCalculators.join(', ')}` 
        };
      }
      
      return { passed: true, message: `All ${expectedCalculators.length} core calculators found` };
    }
  },
  
  {
    name: 'API Routes',
    check: () => {
      const routesDir = path.join(__dirname, '../src/routes');
      if (!fs.existsSync(routesDir)) {
        return { passed: false, message: 'Routes directory not found' };
      }
      
      const expectedRoutes = [
        'auth.ts',
        'calculators.ts',
        'users.ts',
        'subscriptions.ts',
        'health.ts'
      ];
      
      const missingRoutes = expectedRoutes.filter(route => 
        !fs.existsSync(path.join(routesDir, route))
      );
      
      if (missingRoutes.length > 0) {
        return { 
          passed: false, 
          message: `Missing routes: ${missingRoutes.join(', ')}` 
        };
      }
      
      return { passed: true, message: `All ${expectedRoutes.length} API routes found` };
    }
  },
  
  {
    name: 'Frontend Components',
    check: () => {
      const componentsDir = path.join(__dirname, '../src/components');
      if (!fs.existsSync(componentsDir)) {
        return { passed: false, message: 'Components directory not found' };
      }
      
      const expectedComponents = [
        'calculators',
        'auth',
        'dashboard',
        'layout',
        'ui'
      ];
      
      const missingComponents = expectedComponents.filter(comp => 
        !fs.existsSync(path.join(componentsDir, comp))
      );
      
      if (missingComponents.length > 0) {
        return { 
          passed: false, 
          message: `Missing component directories: ${missingComponents.join(', ')}` 
        };
      }
      
      return { passed: true, message: `All ${expectedComponents.length} component directories found` };
    }
  },
  
  {
    name: 'Database Migrations',
    check: () => {
      const migrationsDir = path.join(__dirname, '../migrations');
      if (!fs.existsSync(migrationsDir)) {
        return { passed: false, message: 'Migrations directory not found' };
      }
      
      const migrationFiles = fs.readdirSync(migrationsDir).filter(file => 
        file.endsWith('.sql') || file.endsWith('.js') || file.endsWith('.ts')
      );
      
      if (migrationFiles.length === 0) {
        return { passed: false, message: 'No migration files found' };
      }
      
      return { passed: true, message: `${migrationFiles.length} migration files found` };
    }
  },
  
  {
    name: 'Configuration Files',
    check: () => {
      const configFiles = [
        'package.json',
        'tsconfig.json',
        'docker-compose.yml',
        'docker-compose.production.yml',
        '.env.example',
        'vite.config.ts'
      ];
      
      const missingFiles = configFiles.filter(file => 
        !fs.existsSync(path.join(__dirname, '..', file))
      );
      
      if (missingFiles.length > 0) {
        return { 
          passed: false, 
          message: `Missing config files: ${missingFiles.join(', ')}` 
        };
      }
      
      return { passed: true, message: `All ${configFiles.length} configuration files found` };
    }
  },
  
  {
    name: 'Test Files',
    check: () => {
      const testsDir = path.join(__dirname, '../tests');
      if (!fs.existsSync(testsDir)) {
        return { passed: false, message: 'Tests directory not found' };
      }
      
      const testDirs = ['unit', 'integration', 'helpers'];
      const missingTestDirs = testDirs.filter(dir => 
        !fs.existsSync(path.join(testsDir, dir))
      );
      
      if (missingTestDirs.length > 0) {
        return { 
          passed: false, 
          message: `Missing test directories: ${missingTestDirs.join(', ')}` 
        };
      }
      
      return { passed: true, message: `All ${testDirs.length} test directories found` };
    }
  },
  
  {
    name: 'Docker Configuration',
    check: () => {
      const dockerFiles = [
        'Dockerfile',
        'docker-compose.yml',
        'docker-compose.production.yml',
        '.dockerignore'
      ];
      
      const missingFiles = dockerFiles.filter(file => 
        !fs.existsSync(path.join(__dirname, '..', file))
      );
      
      if (missingFiles.length > 0) {
        return { 
          passed: false, 
          message: `Missing Docker files: ${missingFiles.join(', ')}` 
        };
      }
      
      return { passed: true, message: `All ${dockerFiles.length} Docker files found` };
    }
  },
  
  {
    name: 'CI/CD Configuration',
    check: () => {
      const cicdFiles = [
        '.github/workflows/ci.yml',
        '.github/workflows/cd.yml',
        'scripts/deploy.sh',
        'scripts/backup.sh'
      ];
      
      const existingFiles = cicdFiles.filter(file => 
        fs.existsSync(path.join(__dirname, '..', file))
      );
      
      if (existingFiles.length === 0) {
        return { passed: false, message: 'No CI/CD configuration files found' };
      }
      
      return { passed: true, message: `${existingFiles.length} CI/CD files found` };
    }
  },
  
  {
    name: 'Monitoring Configuration',
    check: () => {
      const monitoringFiles = [
        'monitoring/prometheus.yml',
        'monitoring/grafana-dashboard.json',
        'monitoring/alertmanager.yml'
      ];
      
      const existingFiles = monitoringFiles.filter(file => 
        fs.existsSync(path.join(__dirname, '..', file))
      );
      
      if (existingFiles.length === 0) {
        return { passed: false, message: 'No monitoring configuration files found' };
      }
      
      return { passed: true, message: `${existingFiles.length} monitoring files found` };
    }
  },
  
  {
    name: 'Security Configuration',
    check: () => {
      const securityFiles = [
        'security/security-config.ts',
        'src/hooks/useSecurity.ts',
        'src/middleware/security.ts'
      ];
      
      const existingFiles = securityFiles.filter(file => 
        fs.existsSync(path.join(__dirname, '..', file))
      );
      
      if (existingFiles.length === 0) {
        return { passed: false, message: 'No security configuration files found' };
      }
      
      return { passed: true, message: `${existingFiles.length} security files found` };
    }
  },
  
  {
    name: 'Documentation',
    check: () => {
      const docFiles = [
        'README.md',
        'API_DOCUMENTATION.md',
        'DEPLOYMENT_GUIDE.md',
        'BACKUP_DISASTER_RECOVERY_PLAN.md',
        'BUSINESS_CONTINUITY_PLAN.md'
      ];
      
      const existingFiles = docFiles.filter(file => 
        fs.existsSync(path.join(__dirname, '..', file))
      );
      
      if (existingFiles.length < 3) {
        return { passed: false, message: `Only ${existingFiles.length} documentation files found` };
      }
      
      return { passed: true, message: `${existingFiles.length} documentation files found` };
    }
  },
  
  {
    name: 'Package Dependencies',
    check: () => {
      const packageJsonPath = path.join(__dirname, '../package.json');
      if (!fs.existsSync(packageJsonPath)) {
        return { passed: false, message: 'package.json not found' };
      }
      
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      
      const requiredDeps = [
        'react',
        'react-dom',
        'react-router-dom',
        'typescript',
        'vite'
      ];
      
      const missingDeps = requiredDeps.filter(dep => 
        !packageJson.dependencies?.[dep] && !packageJson.devDependencies?.[dep]
      );
      
      if (missingDeps.length > 0) {
        return { 
          passed: false, 
          message: `Missing dependencies: ${missingDeps.join(', ')}` 
        };
      }
      
      const totalDeps = Object.keys(packageJson.dependencies || {}).length + 
                       Object.keys(packageJson.devDependencies || {}).length;
      
      return { passed: true, message: `${totalDeps} dependencies configured` };
    }
  }
];

// Run all verification checks
async function runVerification() {
  log('Starting system integration verification...');
  
  const results = [];
  let passedChecks = 0;
  let totalChecks = verificationChecks.length;
  
  for (const check of verificationChecks) {
    log(`Running check: ${check.name}`);
    
    try {
      const result = await check.check();
      results.push({
        name: check.name,
        ...result
      });
      
      if (result.passed) {
        success(`${check.name}: ${result.message}`);
        passedChecks++;
      } else {
        error(`${check.name}: ${result.message}`);
      }
    } catch (err) {
      error(`${check.name}: Check failed with error - ${err.message}`);
      results.push({
        name: check.name,
        passed: false,
        message: `Check failed: ${err.message}`
      });
    }
  }
  
  // Generate summary
  log('\n' + '='.repeat(60));
  log('SYSTEM INTEGRATION VERIFICATION SUMMARY');
  log('='.repeat(60));
  
  if (passedChecks === totalChecks) {
    success(`All ${totalChecks} checks passed! System integration is complete. 🎉`);
  } else {
    error(`${passedChecks}/${totalChecks} checks passed. ${totalChecks - passedChecks} issues found.`);
  }
  
  // Generate detailed report
  const reportPath = path.join(__dirname, '../test-results/integration-verification-report.json');
  const reportDir = path.dirname(reportPath);
  
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }
  
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalChecks,
      passedChecks,
      failedChecks: totalChecks - passedChecks,
      successRate: Math.round((passedChecks / totalChecks) * 100)
    },
    results
  };
  
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  log(`Detailed report saved to: ${reportPath}`);
  
  return passedChecks === totalChecks;
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
  runVerification()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(err => {
      error(`Verification failed: ${err.message}`);
      process.exit(1);
    });
}

export { runVerification };
