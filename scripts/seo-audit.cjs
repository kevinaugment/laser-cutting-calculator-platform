#!/usr/bin/env node

/**
 * SEO Audit Script
 * 
 * This script performs comprehensive SEO audits including:
 * - Meta tag completeness
 * - Structured data validation
 * - Google 2025 compliance
 * - Performance optimization
 * - Mobile-first indexing readiness
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class SEOAuditor {
  constructor() {
    this.results = {
      metaTags: { score: 0, issues: [], passed: [] },
      structuredData: { score: 0, issues: [], passed: [] },
      performance: { score: 0, issues: [], passed: [] },
      mobile: { score: 0, issues: [], passed: [] },
      google2025: { score: 0, issues: [], passed: [] },
      overall: { score: 0, grade: 'F' }
    };
    
    this.srcPath = path.join(process.cwd(), 'src');
  }

  /**
   * Run complete SEO audit
   */
  async runAudit() {
    console.log('🔍 Starting SEO Audit...\n');

    try {
      await this.auditMetaTags();
      await this.auditStructuredData();
      await this.auditPerformance();
      await this.auditMobileOptimization();
      await this.auditGoogle2025Compliance();
      
      this.calculateOverallScore();
      this.generateReport();
      
    } catch (error) {
      console.error('❌ SEO audit failed:', error.message);
      process.exit(1);
    }
  }

  /**
   * Audit Meta Tags Implementation
   */
  async auditMetaTags() {
    console.log('📝 Auditing Meta Tags...');
    
    const seoFiles = this.findSEOFiles();
    let totalChecks = 0;
    let passedChecks = 0;

    // Check for SEO Head components
    if (seoFiles.length > 0) {
      this.results.metaTags.passed.push(`Found ${seoFiles.length} SEO components`);
      passedChecks += 2;
    } else {
      this.results.metaTags.issues.push('No SEO Head components found');
    }
    totalChecks += 2;

    // Check for essential meta tags in components
    const essentialTags = [
      'title', 'description', 'keywords', 'robots', 'canonical',
      'og:title', 'og:description', 'og:image', 'twitter:card'
    ];

    for (const file of seoFiles) {
      const content = fs.readFileSync(file, 'utf8');
      
      for (const tag of essentialTags) {
        if (content.includes(tag)) {
          passedChecks++;
        } else {
          this.results.metaTags.issues.push(`Missing ${tag} in ${path.basename(file)}`);
        }
        totalChecks++;
      }
    }

    this.results.metaTags.score = Math.round((passedChecks / totalChecks) * 100);
    console.log(`✅ Meta Tags Score: ${this.results.metaTags.score}%`);
  }

  /**
   * Audit Structured Data Implementation
   */
  async auditStructuredData() {
    console.log('🏗️ Auditing Structured Data...');
    
    const configFiles = this.findConfigFiles();
    let totalChecks = 0;
    let passedChecks = 0;

    // Check for structured data configuration
    const seoConfigFile = path.join(this.srcPath, 'config', 'seo.ts');
    if (fs.existsSync(seoConfigFile)) {
      const content = fs.readFileSync(seoConfigFile, 'utf8');
      
      // Check for essential structured data types
      const structuredDataTypes = [
        'WebApplication', 'Organization', 'WebSite', 'BreadcrumbList',
        'Product', 'SoftwareApplication', 'CollectionPage'
      ];

      for (const type of structuredDataTypes) {
        if (content.includes(type)) {
          this.results.structuredData.passed.push(`Found ${type} schema`);
          passedChecks++;
        } else {
          this.results.structuredData.issues.push(`Missing ${type} schema`);
        }
        totalChecks++;
      }

      // Check for schema.org context
      if (content.includes('https://schema.org')) {
        this.results.structuredData.passed.push('Schema.org context found');
        passedChecks++;
      } else {
        this.results.structuredData.issues.push('Missing schema.org context');
      }
      totalChecks++;

    } else {
      this.results.structuredData.issues.push('SEO configuration file not found');
      totalChecks += 8;
    }

    this.results.structuredData.score = Math.round((passedChecks / totalChecks) * 100);
    console.log(`✅ Structured Data Score: ${this.results.structuredData.score}%`);
  }

  /**
   * Audit Performance Optimization
   */
  async auditPerformance() {
    console.log('⚡ Auditing Performance Optimization...');
    
    let totalChecks = 0;
    let passedChecks = 0;

    // Check for performance configuration
    const viteConfigFile = path.join(process.cwd(), 'vite.config.ts');
    if (fs.existsSync(viteConfigFile)) {
      const content = fs.readFileSync(viteConfigFile, 'utf8');
      
      const performanceFeatures = [
        'minify', 'sourcemap', 'rollupOptions', 'manualChunks',
        'terserOptions', 'compression'
      ];

      for (const feature of performanceFeatures) {
        if (content.includes(feature)) {
          this.results.performance.passed.push(`${feature} optimization enabled`);
          passedChecks++;
        } else {
          this.results.performance.issues.push(`Missing ${feature} optimization`);
        }
        totalChecks++;
      }
    }

    // Check for preload/prefetch implementation
    const seoFiles = this.findSEOFiles();
    for (const file of seoFiles) {
      const content = fs.readFileSync(file, 'utf8');
      
      if (content.includes('preconnect')) {
        this.results.performance.passed.push('Preconnect links found');
        passedChecks++;
      }
      if (content.includes('preload')) {
        this.results.performance.passed.push('Preload links found');
        passedChecks++;
      }
      totalChecks += 2;
      break; // Only check first file
    }

    this.results.performance.score = Math.round((passedChecks / totalChecks) * 100);
    console.log(`✅ Performance Score: ${this.results.performance.score}%`);
  }

  /**
   * Audit Mobile Optimization
   */
  async auditMobileOptimization() {
    console.log('📱 Auditing Mobile Optimization...');
    
    let totalChecks = 0;
    let passedChecks = 0;

    const seoFiles = this.findSEOFiles();
    for (const file of seoFiles) {
      const content = fs.readFileSync(file, 'utf8');
      
      const mobileFeatures = [
        'viewport', 'mobile-web-app-capable', 'apple-mobile-web-app',
        'theme-color', 'width=device-width'
      ];

      for (const feature of mobileFeatures) {
        if (content.includes(feature)) {
          this.results.mobile.passed.push(`${feature} meta tag found`);
          passedChecks++;
        } else {
          this.results.mobile.issues.push(`Missing ${feature} meta tag`);
        }
        totalChecks++;
      }
      break; // Only check first file
    }

    this.results.mobile.score = Math.round((passedChecks / totalChecks) * 100);
    console.log(`✅ Mobile Score: ${this.results.mobile.score}%`);
  }

  /**
   * Audit Google 2025 Compliance
   */
  async auditGoogle2025Compliance() {
    console.log('🎯 Auditing Google 2025 Compliance...');
    
    let totalChecks = 0;
    let passedChecks = 0;

    // Check for Google 2025 specific component
    const google2025File = path.join(this.srcPath, 'components', 'seo', 'Google2025SEOHead.tsx');
    if (fs.existsSync(google2025File)) {
      this.results.google2025.passed.push('Google 2025 SEO component found');
      passedChecks++;
      
      const content = fs.readFileSync(google2025File, 'utf8');
      
      const google2025Features = [
        'E-A-T', 'Core Web Vitals', 'mobile-first', 'max-snippet:-1',
        'max-image-preview:large', 'expertise-level', 'content-type'
      ];

      for (const feature of google2025Features) {
        if (content.includes(feature)) {
          this.results.google2025.passed.push(`${feature} implementation found`);
          passedChecks++;
        } else {
          this.results.google2025.issues.push(`Missing ${feature} implementation`);
        }
        totalChecks++;
      }
    } else {
      this.results.google2025.issues.push('Google 2025 SEO component not found');
    }
    totalChecks++;

    this.results.google2025.score = Math.round((passedChecks / totalChecks) * 100);
    console.log(`✅ Google 2025 Compliance Score: ${this.results.google2025.score}%`);
  }

  /**
   * Find SEO-related files
   */
  findSEOFiles() {
    const seoDir = path.join(this.srcPath, 'components', 'seo');
    if (!fs.existsSync(seoDir)) return [];
    
    return fs.readdirSync(seoDir)
      .filter(file => file.endsWith('.tsx'))
      .map(file => path.join(seoDir, file));
  }

  /**
   * Find configuration files
   */
  findConfigFiles() {
    const configDir = path.join(this.srcPath, 'config');
    if (!fs.existsSync(configDir)) return [];
    
    return fs.readdirSync(configDir)
      .filter(file => file.endsWith('.ts'))
      .map(file => path.join(configDir, file));
  }

  /**
   * Calculate overall SEO score
   */
  calculateOverallScore() {
    const scores = [
      this.results.metaTags.score,
      this.results.structuredData.score,
      this.results.performance.score,
      this.results.mobile.score,
      this.results.google2025.score
    ];

    this.results.overall.score = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
    
    // Assign grade
    if (this.results.overall.score >= 90) this.results.overall.grade = 'A';
    else if (this.results.overall.score >= 80) this.results.overall.grade = 'B';
    else if (this.results.overall.score >= 70) this.results.overall.grade = 'C';
    else if (this.results.overall.score >= 60) this.results.overall.grade = 'D';
    else this.results.overall.grade = 'F';
  }

  /**
   * Generate SEO audit report
   */
  generateReport() {
    console.log('\n📊 SEO Audit Report');
    console.log('===================');
    
    console.log(`Meta Tags: ${this.results.metaTags.score}%`);
    console.log(`Structured Data: ${this.results.structuredData.score}%`);
    console.log(`Performance: ${this.results.performance.score}%`);
    console.log(`Mobile: ${this.results.mobile.score}%`);
    console.log(`Google 2025: ${this.results.google2025.score}%`);
    
    console.log(`\n🎯 Overall SEO Score: ${this.results.overall.score}% (Grade: ${this.results.overall.grade})`);
    
    // Show issues
    const allIssues = [
      ...this.results.metaTags.issues,
      ...this.results.structuredData.issues,
      ...this.results.performance.issues,
      ...this.results.mobile.issues,
      ...this.results.google2025.issues
    ];

    if (allIssues.length > 0) {
      console.log('\n⚠️ Issues Found:');
      allIssues.forEach(issue => console.log(`  - ${issue}`));
    }

    // Show passed items
    const allPassed = [
      ...this.results.metaTags.passed,
      ...this.results.structuredData.passed,
      ...this.results.performance.passed,
      ...this.results.mobile.passed,
      ...this.results.google2025.passed
    ];

    if (allPassed.length > 0) {
      console.log('\n✅ Passed Checks:');
      allPassed.forEach(item => console.log(`  - ${item}`));
    }

    // Save detailed report
    const reportPath = path.join(process.cwd(), 'seo-audit-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
    console.log(`\n📄 Detailed report saved to: ${reportPath}`);

    // Recommendations
    console.log('\n💡 Recommendations:');
    if (this.results.overall.score < 90) {
      console.log('  - Address the issues listed above');
      console.log('  - Implement Google 2025 SEO component');
      console.log('  - Optimize Core Web Vitals');
      console.log('  - Enhance structured data coverage');
    } else {
      console.log('  - Excellent SEO implementation! 🎉');
      console.log('  - Continue monitoring and updating');
    }
  }
}

// Run the SEO auditor
if (require.main === module) {
  const auditor = new SEOAuditor();
  auditor.runAudit().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = SEOAuditor;
