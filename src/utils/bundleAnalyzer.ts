// Bundle Size Analysis and Optimization Tool
// Monitors bundle performance and provides optimization recommendations

export interface BundleAnalysisResult {
  totalSize: number;
  gzippedSize: number;
  chunks: ChunkInfo[];
  recommendations: OptimizationRecommendation[];
  performanceScore: number;
  loadTimeEstimate: number;
}

export interface ChunkInfo {
  name: string;
  size: number;
  gzippedSize: number;
  modules: ModuleInfo[];
  loadPriority: 'critical' | 'high' | 'medium' | 'low';
  isLazyLoaded: boolean;
}

export interface ModuleInfo {
  name: string;
  size: number;
  imports: string[];
  exports: string[];
  isTreeShakeable: boolean;
}

export interface OptimizationRecommendation {
  type: 'code-splitting' | 'tree-shaking' | 'compression' | 'lazy-loading' | 'dependency';
  priority: 'high' | 'medium' | 'low';
  description: string;
  potentialSavings: number;
  implementation: string[];
  effort: 'low' | 'medium' | 'high';
}

export class BundleAnalyzer {
  private static readonly PERFORMANCE_BUDGETS = {
    // Performance budgets based on industry standards
    maxTotalSize: 1024 * 1024,      // 1MB total
    maxChunkSize: 350 * 1024,       // 350KB per chunk
    maxInitialLoad: 500 * 1024,     // 500KB initial load
    targetLoadTime: 1000,           // 1 second target
    maxChunks: 50                   // Maximum number of chunks
  };

  private static readonly CONNECTION_SPEEDS = {
    // Connection speeds for load time estimation (bytes/ms)
    '3g': 375,          // 3Mbps
    '4g': 1250,         // 10Mbps
    'wifi': 6250,       // 50Mbps
    'cable': 12500      // 100Mbps
  };

  static async analyzeBundlePerformance(): Promise<BundleAnalysisResult> {
    const chunks = await this.getChunkInformation();
    const totalSize = chunks.reduce((sum, chunk) => sum + chunk.size, 0);
    const gzippedSize = chunks.reduce((sum, chunk) => sum + chunk.gzippedSize, 0);
    
    const recommendations = this.generateOptimizationRecommendations(chunks);
    const performanceScore = this.calculatePerformanceScore(totalSize, chunks);
    const loadTimeEstimate = this.estimateLoadTime(gzippedSize, '4g');

    return {
      totalSize,
      gzippedSize,
      chunks,
      recommendations,
      performanceScore,
      loadTimeEstimate
    };
  }

  private static async getChunkInformation(): Promise<ChunkInfo[]> {
    // In a real implementation, this would parse webpack stats or use build tools
    // For now, we'll simulate based on our current build output
    
    const mockChunks: ChunkInfo[] = [
      {
        name: 'vendor',
        size: 186740,
        gzippedSize: 58590,
        modules: [
          {
            name: 'react',
            size: 85000,
            imports: [],
            exports: ['React', 'Component', 'useState', 'useEffect'],
            isTreeShakeable: true
          },
          {
            name: 'react-dom',
            size: 101740,
            imports: ['react'],
            exports: ['render', 'createRoot'],
            isTreeShakeable: true
          }
        ],
        loadPriority: 'critical',
        isLazyLoaded: false
      },
      {
        name: 'main-app',
        size: 237890,
        gzippedSize: 62270,
        modules: [
          {
            name: 'App.tsx',
            size: 15000,
            imports: ['react', 'react-router-dom'],
            exports: ['App'],
            isTreeShakeable: true
          },
          {
            name: 'calculators-index',
            size: 222890,
            imports: ['react', 'various-calculators'],
            exports: ['CalculatorRoutes'],
            isTreeShakeable: false
          }
        ],
        loadPriority: 'critical',
        isLazyLoaded: false
      },
      {
        name: 'ui-components',
        size: 38590,
        gzippedSize: 8550,
        modules: [
          {
            name: 'lucide-react',
            size: 38590,
            imports: [],
            exports: ['icons'],
            isTreeShakeable: true
          }
        ],
        loadPriority: 'high',
        isLazyLoaded: false
      },
      {
        name: 'router',
        size: 33690,
        gzippedSize: 12470,
        modules: [
          {
            name: 'react-router-dom',
            size: 33690,
            imports: ['react'],
            exports: ['BrowserRouter', 'Route', 'Routes'],
            isTreeShakeable: true
          }
        ],
        loadPriority: 'critical',
        isLazyLoaded: false
      }
    ];

    return mockChunks;
  }

  private static generateOptimizationRecommendations(chunks: ChunkInfo[]): OptimizationRecommendation[] {
    const recommendations: OptimizationRecommendation[] = [];

    // Check for oversized chunks
    chunks.forEach(chunk => {
      if (chunk.size > this.PERFORMANCE_BUDGETS.maxChunkSize) {
        recommendations.push({
          type: 'code-splitting',
          priority: 'high',
          description: `Chunk "${chunk.name}" (${Math.round(chunk.size / 1024)}KB) exceeds recommended size limit`,
          potentialSavings: chunk.size - this.PERFORMANCE_BUDGETS.maxChunkSize,
          implementation: [
            'Split large chunk into smaller, more focused chunks',
            'Implement dynamic imports for non-critical code',
            'Move vendor dependencies to separate chunks'
          ],
          effort: 'medium'
        });
      }
    });

    // Check for tree-shaking opportunities
    const nonTreeShakeableModules = chunks.flatMap(chunk => 
      chunk.modules.filter(module => !module.isTreeShakeable)
    );

    if (nonTreeShakeableModules.length > 0) {
      const potentialSavings = nonTreeShakeableModules.reduce((sum, module) => sum + module.size * 0.3, 0);
      
      recommendations.push({
        type: 'tree-shaking',
        priority: 'medium',
        description: `${nonTreeShakeableModules.length} modules are not tree-shakeable`,
        potentialSavings,
        implementation: [
          'Use ES6 imports/exports instead of CommonJS',
          'Configure webpack for better tree-shaking',
          'Remove unused exports from modules'
        ],
        effort: 'low'
      });
    }

    // Check for lazy loading opportunities
    const criticalChunks = chunks.filter(chunk => 
      chunk.loadPriority === 'critical' && chunk.size > 50000
    );

    if (criticalChunks.length > 3) {
      recommendations.push({
        type: 'lazy-loading',
        priority: 'high',
        description: 'Too many large chunks loaded on initial page load',
        potentialSavings: criticalChunks.slice(3).reduce((sum, chunk) => sum + chunk.size, 0),
        implementation: [
          'Implement route-based code splitting',
          'Lazy load calculator components',
          'Use React.lazy() for non-critical components'
        ],
        effort: 'medium'
      });
    }

    // Check for compression opportunities
    const totalSize = chunks.reduce((sum, chunk) => sum + chunk.size, 0);
    const totalGzipped = chunks.reduce((sum, chunk) => sum + chunk.gzippedSize, 0);
    const compressionRatio = totalGzipped / totalSize;

    if (compressionRatio > 0.3) {
      recommendations.push({
        type: 'compression',
        priority: 'medium',
        description: `Compression ratio (${Math.round(compressionRatio * 100)}%) could be improved`,
        potentialSavings: totalGzipped - (totalSize * 0.25),
        implementation: [
          'Enable Brotli compression on server',
          'Optimize asset compression settings',
          'Minify and optimize code further'
        ],
        effort: 'low'
      });
    }

    // Check for dependency optimization
    const vendorChunk = chunks.find(chunk => chunk.name === 'vendor');
    if (vendorChunk && vendorChunk.size > 150000) {
      recommendations.push({
        type: 'dependency',
        priority: 'medium',
        description: 'Vendor bundle is large and could be optimized',
        potentialSavings: vendorChunk.size * 0.2,
        implementation: [
          'Audit and remove unused dependencies',
          'Use lighter alternatives for heavy libraries',
          'Implement dynamic imports for optional dependencies'
        ],
        effort: 'medium'
      });
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  private static calculatePerformanceScore(totalSize: number, chunks: ChunkInfo[]): number {
    let score = 100;

    // Deduct points for oversized bundle
    if (totalSize > this.PERFORMANCE_BUDGETS.maxTotalSize) {
      const overage = totalSize - this.PERFORMANCE_BUDGETS.maxTotalSize;
      score -= Math.min(30, (overage / this.PERFORMANCE_BUDGETS.maxTotalSize) * 30);
    }

    // Deduct points for oversized chunks
    const oversizedChunks = chunks.filter(chunk => chunk.size > this.PERFORMANCE_BUDGETS.maxChunkSize);
    score -= oversizedChunks.length * 10;

    // Deduct points for too many chunks
    if (chunks.length > this.PERFORMANCE_BUDGETS.maxChunks) {
      score -= (chunks.length - this.PERFORMANCE_BUDGETS.maxChunks) * 2;
    }

    // Add points for good practices
    const lazyLoadedChunks = chunks.filter(chunk => chunk.isLazyLoaded);
    score += Math.min(10, lazyLoadedChunks.length * 2);

    return Math.max(0, Math.min(100, score));
  }

  private static estimateLoadTime(gzippedSize: number, connectionType: keyof typeof BundleAnalyzer.CONNECTION_SPEEDS): number {
    const speed = this.CONNECTION_SPEEDS[connectionType];
    return Math.round(gzippedSize / speed);
  }

  static generateOptimizationReport(analysis: BundleAnalysisResult): string {
    const report = `
# Bundle Performance Analysis Report

## 📊 Current Metrics
- **Total Size**: ${Math.round(analysis.totalSize / 1024)}KB (${Math.round(analysis.gzippedSize / 1024)}KB gzipped)
- **Performance Score**: ${analysis.performanceScore}/100
- **Estimated Load Time (4G)**: ${analysis.loadTimeEstimate}ms
- **Number of Chunks**: ${analysis.chunks.length}

## 🎯 Performance Budget Status
- Total Size: ${analysis.totalSize <= this.PERFORMANCE_BUDGETS.maxTotalSize ? '✅' : '❌'} ${Math.round(analysis.totalSize / 1024)}KB / ${Math.round(this.PERFORMANCE_BUDGETS.maxTotalSize / 1024)}KB
- Load Time: ${analysis.loadTimeEstimate <= this.PERFORMANCE_BUDGETS.targetLoadTime ? '✅' : '❌'} ${analysis.loadTimeEstimate}ms / ${this.PERFORMANCE_BUDGETS.targetLoadTime}ms

## 📦 Largest Chunks
${analysis.chunks
  .sort((a, b) => b.size - a.size)
  .slice(0, 5)
  .map(chunk => `- **${chunk.name}**: ${Math.round(chunk.size / 1024)}KB (${Math.round(chunk.gzippedSize / 1024)}KB gzipped)`)
  .join('\n')}

## 🚀 Optimization Recommendations
${analysis.recommendations
  .slice(0, 5)
  .map((rec, index) => `
### ${index + 1}. ${rec.description}
- **Priority**: ${rec.priority.toUpperCase()}
- **Potential Savings**: ${Math.round(rec.potentialSavings / 1024)}KB
- **Effort**: ${rec.effort}
- **Implementation**:
${rec.implementation.map(step => `  - ${step}`).join('\n')}
`).join('\n')}

## 📈 Next Steps
1. Implement high-priority optimizations first
2. Monitor bundle size changes with each deployment
3. Set up automated bundle size monitoring
4. Regular dependency audits and updates
`;

    return report;
  }

  // Real-time bundle monitoring
  static startBundleMonitoring(): void {
    if (typeof window === 'undefined') return;

    // Monitor resource loading
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      entries.forEach(entry => {
        if (entry.entryType === 'resource' && entry.name.includes('.js')) {
          const resourceEntry = entry as PerformanceResourceTiming;
          const size = resourceEntry.transferSize || 0;
          
          if (size > this.PERFORMANCE_BUDGETS.maxChunkSize) {
            console.warn(`🚨 Large chunk loaded: ${entry.name} (${Math.round(size / 1024)}KB)`);
          }
        }
      });
    });

    observer.observe({ entryTypes: ['resource'] });

    // Monitor total page weight
    setTimeout(() => {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      const totalSize = resources.reduce((sum, resource) => sum + (resource.transferSize || 0), 0);
      
      console.log(`📊 Total page weight: ${Math.round(totalSize / 1024)}KB`);
      
      if (totalSize > this.PERFORMANCE_BUDGETS.maxTotalSize) {
        console.warn(`⚠️ Page weight exceeds budget: ${Math.round(totalSize / 1024)}KB > ${Math.round(this.PERFORMANCE_BUDGETS.maxTotalSize / 1024)}KB`);
      }
    }, 5000);
  }
}

// Initialize bundle monitoring in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  BundleAnalyzer.startBundleMonitoring();
}
