#!/usr/bin/env node

/**
 * Performance Audit Script
 * 
 * This script performs comprehensive performance audits including:
 * - Lighthouse performance testing
 * - Core Web Vitals measurement
 * - Bundle size analysis
 * - Performance budget validation
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class PerformanceAuditor {
  constructor() {
    this.results = {
      lighthouse: { score: 0, metrics: {}, issues: [], passed: [] },
      coreWebVitals: { lcp: 0, fid: 0, cls: 0, passed: false },
      bundleSize: { total: 0, chunks: [], warnings: [] },
      overall: { score: 0, grade: 'F' }
    };
    
    this.thresholds = {
      lighthouse: 90,
      lcp: 2500, // milliseconds
      fid: 100,  // milliseconds
      cls: 0.1,  // score
      bundleSize: 250 * 1024 // 250KB per chunk
    };
  }

  /**
   * Run complete performance audit
   */
  async runAudit() {
    console.log('🚀 Starting Performance Audit...\n');

    try {
      await this.buildProject();
      await this.analyzeBundleSize();
      await this.runLighthouseAudit();
      await this.measureCoreWebVitals();
      
      this.calculateOverallScore();
      this.generateReport();
      
    } catch (error) {
      console.error('❌ Performance audit failed:', error.message);
      process.exit(1);
    }
  }

  /**
   * Build project for performance testing
   */
  async buildProject() {
    console.log('🔨 Building project for performance testing...');
    
    try {
      execSync('npm run build', { 
        stdio: 'pipe',
        encoding: 'utf8'
      });
      
      console.log('✅ Project built successfully');
      
    } catch (error) {
      console.error('❌ Build failed:', error.message);
      throw error;
    }
  }

  /**
   * Analyze bundle size
   */
  async analyzeBundleSize() {
    console.log('📦 Analyzing bundle size...');
    
    const distPath = path.join(process.cwd(), 'dist');
    if (!fs.existsSync(distPath)) {
      throw new Error('Dist directory not found. Please build the project first.');
    }

    // Analyze JavaScript chunks
    const jsPath = path.join(distPath, 'js');
    if (fs.existsSync(jsPath)) {
      const jsFiles = fs.readdirSync(jsPath);
      let totalSize = 0;
      
      for (const file of jsFiles) {
        const filePath = path.join(jsPath, file);
        const stats = fs.statSync(filePath);
        const sizeKB = Math.round(stats.size / 1024);
        
        this.results.bundleSize.chunks.push({
          name: file,
          size: sizeKB,
          path: `js/${file}`
        });
        
        totalSize += stats.size;
        
        // Check against threshold
        if (stats.size > this.thresholds.bundleSize) {
          this.results.bundleSize.warnings.push(
            `${file} (${sizeKB}KB) exceeds size limit (${Math.round(this.thresholds.bundleSize / 1024)}KB)`
          );
        }
      }
      
      this.results.bundleSize.total = Math.round(totalSize / 1024);
      console.log(`📊 Total JS bundle size: ${this.results.bundleSize.total}KB`);
      
      // Sort chunks by size
      this.results.bundleSize.chunks.sort((a, b) => b.size - a.size);
      
      // Show largest chunks
      console.log('📈 Largest chunks:');
      this.results.bundleSize.chunks.slice(0, 5).forEach(chunk => {
        console.log(`  - ${chunk.name}: ${chunk.size}KB`);
      });
    }
  }

  /**
   * Run Lighthouse audit
   */
  async runLighthouseAudit() {
    console.log('🔍 Running Lighthouse audit...');
    
    try {
      // Start preview server
      console.log('🌐 Starting preview server...');
      const serverProcess = execSync('npm run preview &', { 
        stdio: 'pipe',
        encoding: 'utf8'
      });
      
      // Wait for server to start
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Run Lighthouse
      const lighthouseOutput = execSync(
        'npx lighthouse http://localhost:4173 --output=json --quiet --chrome-flags="--headless --no-sandbox"',
        { 
          stdio: 'pipe',
          encoding: 'utf8'
        }
      );
      
      const lighthouseResult = JSON.parse(lighthouseOutput);
      
      // Extract key metrics
      const audits = lighthouseResult.audits;
      this.results.lighthouse.score = Math.round(lighthouseResult.categories.performance.score * 100);
      
      this.results.lighthouse.metrics = {
        fcp: audits['first-contentful-paint']?.numericValue || 0,
        lcp: audits['largest-contentful-paint']?.numericValue || 0,
        fid: audits['max-potential-fid']?.numericValue || 0,
        cls: audits['cumulative-layout-shift']?.numericValue || 0,
        tti: audits['interactive']?.numericValue || 0,
        tbt: audits['total-blocking-time']?.numericValue || 0
      };
      
      // Check thresholds
      if (this.results.lighthouse.score >= this.thresholds.lighthouse) {
        this.results.lighthouse.passed.push(`Lighthouse score: ${this.results.lighthouse.score}%`);
      } else {
        this.results.lighthouse.issues.push(`Lighthouse score below threshold: ${this.results.lighthouse.score}% (target: ${this.thresholds.lighthouse}%)`);
      }
      
      // Core Web Vitals from Lighthouse
      this.results.coreWebVitals.lcp = this.results.lighthouse.metrics.lcp;
      this.results.coreWebVitals.fid = this.results.lighthouse.metrics.fid;
      this.results.coreWebVitals.cls = this.results.lighthouse.metrics.cls;
      
      console.log(`✅ Lighthouse Performance Score: ${this.results.lighthouse.score}%`);
      console.log(`📊 Core Web Vitals:`);
      console.log(`  - LCP: ${Math.round(this.results.coreWebVitals.lcp)}ms`);
      console.log(`  - FID: ${Math.round(this.results.coreWebVitals.fid)}ms`);
      console.log(`  - CLS: ${this.results.coreWebVitals.cls.toFixed(3)}`);
      
      // Kill preview server
      try {
        execSync('pkill -f "vite preview"', { stdio: 'ignore' });
      } catch (e) {
        // Ignore errors when killing server
      }
      
    } catch (error) {
      console.error('⚠️ Lighthouse audit failed:', error.message);
      // Continue with other audits
    }
  }

  /**
   * Measure Core Web Vitals
   */
  async measureCoreWebVitals() {
    console.log('📏 Measuring Core Web Vitals...');
    
    // Validate against thresholds
    const lcpPassed = this.results.coreWebVitals.lcp <= this.thresholds.lcp;
    const fidPassed = this.results.coreWebVitals.fid <= this.thresholds.fid;
    const clsPassed = this.results.coreWebVitals.cls <= this.thresholds.cls;
    
    this.results.coreWebVitals.passed = lcpPassed && fidPassed && clsPassed;
    
    if (lcpPassed) {
      this.results.lighthouse.passed.push(`LCP: ${Math.round(this.results.coreWebVitals.lcp)}ms (Good)`);
    } else {
      this.results.lighthouse.issues.push(`LCP: ${Math.round(this.results.coreWebVitals.lcp)}ms (target: <${this.thresholds.lcp}ms)`);
    }
    
    if (fidPassed) {
      this.results.lighthouse.passed.push(`FID: ${Math.round(this.results.coreWebVitals.fid)}ms (Good)`);
    } else {
      this.results.lighthouse.issues.push(`FID: ${Math.round(this.results.coreWebVitals.fid)}ms (target: <${this.thresholds.fid}ms)`);
    }
    
    if (clsPassed) {
      this.results.lighthouse.passed.push(`CLS: ${this.results.coreWebVitals.cls.toFixed(3)} (Good)`);
    } else {
      this.results.lighthouse.issues.push(`CLS: ${this.results.coreWebVitals.cls.toFixed(3)} (target: <${this.thresholds.cls})`);
    }
  }

  /**
   * Calculate overall performance score
   */
  calculateOverallScore() {
    let score = 0;
    let maxScore = 0;

    // Lighthouse score (40 points)
    maxScore += 40;
    score += Math.round((this.results.lighthouse.score / 100) * 40);

    // Core Web Vitals (40 points)
    maxScore += 40;
    if (this.results.coreWebVitals.passed) {
      score += 40;
    } else {
      // Partial credit for individual metrics
      if (this.results.coreWebVitals.lcp <= this.thresholds.lcp) score += 15;
      if (this.results.coreWebVitals.fid <= this.thresholds.fid) score += 15;
      if (this.results.coreWebVitals.cls <= this.thresholds.cls) score += 10;
    }

    // Bundle size (20 points)
    maxScore += 20;
    const oversizedChunks = this.results.bundleSize.warnings.length;
    if (oversizedChunks === 0) {
      score += 20;
    } else if (oversizedChunks <= 2) {
      score += 10;
    }

    this.results.overall.score = Math.round((score / maxScore) * 100);
    
    // Assign grade
    if (this.results.overall.score >= 90) this.results.overall.grade = 'A';
    else if (this.results.overall.score >= 80) this.results.overall.grade = 'B';
    else if (this.results.overall.score >= 70) this.results.overall.grade = 'C';
    else if (this.results.overall.score >= 60) this.results.overall.grade = 'D';
    else this.results.overall.grade = 'F';
  }

  /**
   * Generate performance report
   */
  generateReport() {
    console.log('\n📊 Performance Audit Report');
    console.log('============================');
    
    console.log(`Lighthouse Score: ${this.results.lighthouse.score}%`);
    console.log(`Core Web Vitals: ${this.results.coreWebVitals.passed ? '✅ Passed' : '❌ Failed'}`);
    console.log(`Bundle Size: ${this.results.bundleSize.total}KB (${this.results.bundleSize.warnings.length} warnings)`);
    
    console.log(`\n🎯 Overall Performance Score: ${this.results.overall.score}% (Grade: ${this.results.overall.grade})`);
    
    // Show issues
    const allIssues = [
      ...this.results.lighthouse.issues,
      ...this.results.bundleSize.warnings
    ];

    if (allIssues.length > 0) {
      console.log('\n⚠️ Issues Found:');
      allIssues.forEach(issue => console.log(`  - ${issue}`));
    }

    // Show passed items
    if (this.results.lighthouse.passed.length > 0) {
      console.log('\n✅ Passed Checks:');
      this.results.lighthouse.passed.forEach(item => console.log(`  - ${item}`));
    }

    // Save detailed report
    const reportPath = path.join(process.cwd(), 'performance-audit-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
    console.log(`\n📄 Detailed report saved to: ${reportPath}`);

    // Recommendations
    console.log('\n💡 Performance Recommendations:');
    if (this.results.overall.score >= 90) {
      console.log('  - Excellent performance! 🎉');
      console.log('  - Continue monitoring and maintaining');
    } else {
      if (this.results.lighthouse.score < 90) {
        console.log('  - Optimize images and fonts');
        console.log('  - Implement code splitting');
        console.log('  - Reduce JavaScript execution time');
      }
      if (!this.results.coreWebVitals.passed) {
        console.log('  - Focus on Core Web Vitals optimization');
        console.log('  - Implement lazy loading');
        console.log('  - Optimize layout stability');
      }
      if (this.results.bundleSize.warnings.length > 0) {
        console.log('  - Split large chunks');
        console.log('  - Implement dynamic imports');
      }
    }
  }
}

// Run the performance auditor
if (require.main === module) {
  const auditor = new PerformanceAuditor();
  auditor.runAudit().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = PerformanceAuditor;
