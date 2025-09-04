#!/usr/bin/env node

/**
 * Performance Optimization Script
 * Automated performance optimization for Laser Cutting Calculator
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

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

// Performance optimization tasks
const optimizationTasks = [
  {
    name: 'Bundle Analysis',
    description: 'Analyze bundle size and identify optimization opportunities',
    execute: analyzeBundleSize
  },
  {
    name: 'Image Optimization',
    description: 'Optimize images for web delivery',
    execute: optimizeImages
  },
  {
    name: 'Code Splitting',
    description: 'Implement code splitting for better loading performance',
    execute: implementCodeSplitting
  },
  {
    name: 'Asset Minification',
    description: 'Minify CSS, JavaScript, and HTML assets',
    execute: minifyAssets
  },
  {
    name: 'Caching Strategy',
    description: 'Implement optimal caching strategies',
    execute: implementCaching
  },
  {
    name: 'Performance Monitoring',
    description: 'Add performance monitoring and metrics',
    execute: addPerformanceMonitoring
  }
];

// Bundle size analysis
async function analyzeBundleSize() {
  log('Analyzing bundle size...');
  
  try {
    // Check if webpack-bundle-analyzer is available
    const packageJsonPath = path.join(__dirname, '../package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    if (!packageJson.devDependencies?.['webpack-bundle-analyzer']) {
      log('Installing webpack-bundle-analyzer...');
      execSync('npm install --save-dev webpack-bundle-analyzer', { cwd: path.dirname(packageJsonPath) });
    }
    
    // Create bundle analyzer script
    const analyzerScript = `
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      reportFilename: 'bundle-report.html'
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@mui/material', '@emotion/react', '@emotion/styled']
        }
      }
    }
  }
});
`;
    
    fs.writeFileSync(path.join(__dirname, '../vite.analyzer.config.js'), analyzerScript);
    
    // Run bundle analysis
    execSync('npm run build -- --config vite.analyzer.config.js', { 
      cwd: path.dirname(packageJsonPath),
      stdio: 'inherit'
    });
    
    success('Bundle analysis completed. Check bundle-report.html for details.');
    return true;
  } catch (err) {
    error(`Bundle analysis failed: ${err.message}`);
    return false;
  }
}

// Image optimization
async function optimizeImages() {
  log('Optimizing images...');
  
  try {
    const publicDir = path.join(__dirname, '../public');
    const srcDir = path.join(__dirname, '../src');
    
    // Find all image files
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg'];
    const imageFiles = [];
    
    function findImages(dir) {
      if (!fs.existsSync(dir)) return;
      
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
          findImages(filePath);
        } else if (imageExtensions.some(ext => file.toLowerCase().endsWith(ext))) {
          imageFiles.push(filePath);
        }
      }
    }
    
    findImages(publicDir);
    findImages(srcDir);
    
    log(`Found ${imageFiles.length} image files`);
    
    // Create optimized image component
    const optimizedImageComponent = `
import React, { useState, useRef, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  loading?: 'lazy' | 'eager';
  placeholder?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  loading = 'lazy',
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1zaXplPSIxMiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iIGZpbGw9IiNhYWEiPkxvYWRpbmcuLi48L3RleHQ+PC9zdmc+'
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Generate WebP source if supported
  const webpSrc = src.replace(/\\.(jpg|jpeg|png)$/i, '.webp');
  
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      setIsLoaded(true);
    }
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  return (
    <picture className={className}>
      <source srcSet={webpSrc} type="image/webp" />
      <img
        ref={imgRef}
        src={hasError ? placeholder : src}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out'
        }}
      />
    </picture>
  );
};
`;
    
    const componentPath = path.join(__dirname, '../src/components/ui/OptimizedImage.tsx');
    fs.writeFileSync(componentPath, optimizedImageComponent);
    
    success(`Image optimization setup completed. Found ${imageFiles.length} images.`);
    success('Created OptimizedImage component for lazy loading and WebP support.');
    return true;
  } catch (err) {
    error(`Image optimization failed: ${err.message}`);
    return false;
  }
}

// Code splitting implementation
async function implementCodeSplitting() {
  log('Implementing code splitting...');
  
  try {
    // Create lazy loading utility
    const lazyLoadingUtil = `
import { lazy, Suspense, ComponentType } from 'react';
import { CircularProgress, Box } from '@mui/material';

// Loading component
const LoadingSpinner = () => (
  <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
    <CircularProgress />
  </Box>
);

// Lazy loading wrapper with error boundary
export function lazyLoad<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback: React.ComponentType = LoadingSpinner
) {
  const LazyComponent = lazy(importFunc);
  
  return (props: React.ComponentProps<T>) => (
    <Suspense fallback={<fallback />}>
      <LazyComponent {...props} />
    </Suspense>
  );
}

// Preload function for critical routes
export function preloadRoute(importFunc: () => Promise<any>) {
  const componentImport = importFunc();
  return componentImport;
}

// Route-based code splitting
export const LazyRoutes = {
  HomePage: lazyLoad(() => import('../pages/HomePage')),
  CalculatorsPage: lazyLoad(() => import('../pages/CalculatorsPage')),
  FeaturesPage: lazyLoad(() => import('../pages/FeaturesPage')),
  LearnPage: lazyLoad(() => import('../pages/LearnPage')),
  ContactPage: lazyLoad(() => import('../pages/ContactPage')),
  
  // Calculator components
  LaserCuttingCostCalculator: lazyLoad(() => import('../components/calculators/LaserCuttingCostCalculator')),
  CuttingTimeEstimator: lazyLoad(() => import('../components/calculators/CuttingTimeEstimator')),
  LaserParameterOptimizer: lazyLoad(() => import('../components/calculators/LaserParameterOptimizer')),
  MaterialSelectionAssistant: lazyLoad(() => import('../components/calculators/MaterialSelectionAssistant')),
  
  // Hub components
  BusinessROIHub: lazyLoad(() => import('../components/hubs/BusinessROIHub')),
  CostPricingHub: lazyLoad(() => import('../components/hubs/CostPricingHub')),
  ParametersSettingsHub: lazyLoad(() => import('../components/hubs/ParametersSettingsHub')),
  QualityOptimizationHub: lazyLoad(() => import('../components/hubs/QualityOptimizationHub')),
  TimeEfficiencyHub: lazyLoad(() => import('../components/hubs/TimeEfficiencyHub'))
};
`;
    
    const utilPath = path.join(__dirname, '../src/utils/lazyLoading.tsx');
    fs.writeFileSync(utilPath, lazyLoadingUtil);
    
    // Update Vite config for optimal code splitting
    const viteConfigPath = path.join(__dirname, '../vite.config.ts');
    let viteConfig = fs.readFileSync(viteConfigPath, 'utf8');
    
    // Add code splitting configuration
    const codeSplittingConfig = `
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom'],
          'ui-vendor': ['@mui/material', '@emotion/react', '@emotion/styled'],
          
          // Feature chunks
          'calculators': [
            './src/components/calculators/LaserCuttingCostCalculator',
            './src/components/calculators/CuttingTimeEstimator',
            './src/components/calculators/LaserParameterOptimizer'
          ],
          'hubs': [
            './src/components/hubs/BusinessROIHub',
            './src/components/hubs/CostPricingHub',
            './src/components/hubs/ParametersSettingsHub'
          ],
          'utils': ['./src/utils', './src/hooks']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },`;
    
    // Insert code splitting config if not present
    if (!viteConfig.includes('manualChunks')) {
      viteConfig = viteConfig.replace(
        'export default defineConfig({',
        `export default defineConfig({${codeSplittingConfig}`
      );
      fs.writeFileSync(viteConfigPath, viteConfig);
    }
    
    success('Code splitting implementation completed.');
    success('Created lazy loading utilities and updated Vite configuration.');
    return true;
  } catch (err) {
    error(`Code splitting implementation failed: ${err.message}`);
    return false;
  }
}

// Asset minification
async function minifyAssets() {
  log('Setting up asset minification...');
  
  try {
    // Update Vite config for minification
    const viteConfigPath = path.join(__dirname, '../vite.config.ts');
    let viteConfig = fs.readFileSync(viteConfigPath, 'utf8');
    
    const minificationConfig = `
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn']
      },
      mangle: {
        safari10: true
      },
      format: {
        comments: false
      }
    },
    cssMinify: true,
    reportCompressedSize: true
  },`;
    
    // Add minification config if not present
    if (!viteConfig.includes('terserOptions')) {
      viteConfig = viteConfig.replace(
        'build: {',
        `build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn']
      },
      mangle: {
        safari10: true
      },
      format: {
        comments: false
      }
    },
    cssMinify: true,
    reportCompressedSize: true,`
      );
      fs.writeFileSync(viteConfigPath, viteConfig);
    }
    
    success('Asset minification configuration completed.');
    return true;
  } catch (err) {
    error(`Asset minification setup failed: ${err.message}`);
    return false;
  }
}

// Caching strategy implementation
async function implementCaching() {
  log('Implementing caching strategies...');
  
  try {
    // Create service worker for caching
    const serviceWorkerContent = `
// Service Worker for Laser Cutting Calculator
// Implements caching strategies for optimal performance

const CACHE_NAME = 'laser-calc-v1';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/calculators',
  '/features',
  '/manifest.json',
  // Add critical CSS and JS files
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE)
            .map((cacheName) => caches.delete(cacheName))
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Cache strategy for different types of requests
  if (request.method === 'GET') {
    // Static assets - cache first
    if (url.pathname.match(/\\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2)$/)) {
      event.respondWith(cacheFirst(request));
    }
    // API requests - network first
    else if (url.pathname.startsWith('/api/')) {
      event.respondWith(networkFirst(request));
    }
    // Pages - stale while revalidate
    else {
      event.respondWith(staleWhileRevalidate(request));
    }
  }
});

// Cache first strategy
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    const cache = await caches.open(STATIC_CACHE);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    console.error('Cache first strategy failed:', error);
    return new Response('Offline', { status: 503 });
  }
}

// Network first strategy
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    const cache = await caches.open(DYNAMIC_CACHE);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    return cachedResponse || new Response('Offline', { status: 503 });
  }
}

// Stale while revalidate strategy
async function staleWhileRevalidate(request) {
  const cachedResponse = await caches.match(request);
  
  const fetchPromise = fetch(request).then((networkResponse) => {
    const cache = caches.open(DYNAMIC_CACHE);
    cache.then((c) => c.put(request, networkResponse.clone()));
    return networkResponse;
  });
  
  return cachedResponse || fetchPromise;
}
`;
    
    const swPath = path.join(__dirname, '../public/sw.js');
    fs.writeFileSync(swPath, serviceWorkerContent);
    
    // Create service worker registration
    const swRegistration = `
// Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}
`;
    
    const swRegPath = path.join(__dirname, '../src/utils/serviceWorker.ts');
    fs.writeFileSync(swRegPath, swRegistration);
    
    success('Caching strategy implementation completed.');
    success('Created service worker and registration utilities.');
    return true;
  } catch (err) {
    error(`Caching implementation failed: ${err.message}`);
    return false;
  }
}

// Performance monitoring
async function addPerformanceMonitoring() {
  log('Adding performance monitoring...');
  
  try {
    // Create performance monitoring hook
    const performanceHook = `
import { useEffect, useCallback } from 'react';

interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
}

export const usePerformanceMonitoring = () => {
  const measurePerformance = useCallback(() => {
    // Measure Core Web Vitals
    if ('web-vital' in window) {
      // Use web-vitals library if available
      return;
    }
    
    // Fallback measurements
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');
    
    const metrics: Partial<PerformanceMetrics> = {
      ttfb: navigation.responseStart - navigation.requestStart,
    };
    
    // First Contentful Paint
    const fcp = paint.find(entry => entry.name === 'first-contentful-paint');
    if (fcp) {
      metrics.fcp = fcp.startTime;
    }
    
    // Send metrics to analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'performance_metrics', {
        custom_map: { metric_1: 'fcp', metric_2: 'ttfb' },
        metric_1: metrics.fcp,
        metric_2: metrics.ttfb
      });
    }
    
    console.log('Performance Metrics:', metrics);
  }, []);
  
  useEffect(() => {
    // Measure performance after page load
    if (document.readyState === 'complete') {
      measurePerformance();
    } else {
      window.addEventListener('load', measurePerformance);
      return () => window.removeEventListener('load', measurePerformance);
    }
  }, [measurePerformance]);
  
  return { measurePerformance };
};
`;
    
    const hookPath = path.join(__dirname, '../src/hooks/usePerformanceMonitoring.ts');
    fs.writeFileSync(hookPath, performanceHook);
    
    success('Performance monitoring hook created.');
    return true;
  } catch (err) {
    error(`Performance monitoring setup failed: ${err.message}`);
    return false;
  }
}

// Main execution
async function runOptimizations() {
  log('Starting performance optimization...');
  
  let completedTasks = 0;
  let totalTasks = optimizationTasks.length;
  
  for (const task of optimizationTasks) {
    log(`\n🔧 ${task.name}: ${task.description}`);
    
    try {
      const success = await task.execute();
      if (success) {
        completedTasks++;
      }
    } catch (err) {
      error(`Task ${task.name} failed: ${err.message}`);
    }
  }
  
  // Summary
  log('\n' + '='.repeat(60));
  log('PERFORMANCE OPTIMIZATION SUMMARY');
  log('='.repeat(60));
  
  const successRate = Math.round((completedTasks / totalTasks) * 100);
  
  if (completedTasks === totalTasks) {
    success(`All ${totalTasks} optimization tasks completed successfully! 🎉`);
  } else {
    warning(`${completedTasks}/${totalTasks} optimization tasks completed (${successRate}%)`);
  }
  
  log('\nNext steps:');
  log('1. Run "npm run build" to build optimized version');
  log('2. Test performance with "./scripts/performance-benchmark.sh"');
  log('3. Deploy optimized version to production');
  
  return completedTasks === totalTasks;
}

// Run optimizations
if (import.meta.url === `file://${process.argv[1]}`) {
  runOptimizations()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(err => {
      error(`Optimization failed: ${err.message}`);
      process.exit(1);
    });
}

export { runOptimizations };
