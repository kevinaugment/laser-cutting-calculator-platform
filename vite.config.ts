import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
// import { splitVendorChunkPlugin } from 'vite' // Not available in this version
import { visualizer } from 'rollup-plugin-visualizer'
import viteCompression from 'vite-plugin-compression'
import { createHtmlPlugin } from 'vite-plugin-html'
/// <reference types="vitest" />

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables for the current mode
  loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react({
        // Enable React Fast Refresh for better development experience
        fastRefresh: mode === 'development',
        // Enable JSX runtime optimization
        jsxRuntime: 'automatic',
      }),

      // Split vendor chunks for better caching (handled by manual chunks below)

      // Gzip compression
      viteCompression({
        algorithm: 'gzip',
        ext: '.gz',
        threshold: 1024,
        deleteOriginFile: false,
      }),

      // Brotli compression for better compression ratio
      viteCompression({
        algorithm: 'brotliCompress',
        ext: '.br',
        threshold: 1024,
        deleteOriginFile: false,
      }),

      // HTML optimization
      createHtmlPlugin({
        minify: mode === 'production' ? {
          collapseWhitespace: true,
          keepClosingSlash: true,
          removeComments: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true,
          minifyCSS: true,
          minifyJS: true,
        } : false,
        inject: {
          data: {
            title: 'Laser Cutting Calculator',
            description: 'Professional laser cutting calculator platform with advanced optimization tools',
            keywords: 'laser cutting, calculator, manufacturing, optimization',
          },
        },
      }),

      // Bundle analyzer (only in production)
      ...(mode === 'production' ? [
        visualizer({
          filename: 'dist/stats.html',
          open: false,
          gzipSize: true,
          brotliSize: true,
          template: 'treemap',
        }),
      ] : []),
    ],

    // Path resolution
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@components': resolve(__dirname, 'src/components'),
        '@hooks': resolve(__dirname, 'src/hooks'),
        '@services': resolve(__dirname, 'src/services'),
        '@utils': resolve(__dirname, 'src/utils'),
        '@types': resolve(__dirname, 'src/types'),
        '@styles': resolve(__dirname, 'src/styles'),
      },
    },

    // Build configuration
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: mode === 'development' || mode === 'staging',

      // Bundle splitting for better caching
      rollupOptions: {
        output: {
          // Enhanced manual chunks for better caching and performance
          manualChunks: (id) => {
            // Core React libraries
            if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
              return 'vendor-react';
            }

            // Router
            if (id.includes('node_modules/react-router-dom/')) {
              return 'vendor-router';
            }

            // UI and Icons
            if (id.includes('node_modules/lucide-react/')) {
              return 'vendor-ui';
            }

            // Charts and visualization
            if (id.includes('node_modules/chart.js/') || id.includes('node_modules/react-chartjs-2/')) {
              return 'vendor-charts';
            }

            // Utilities
            if (id.includes('node_modules/date-fns/') || id.includes('node_modules/lodash-es/')) {
              return 'vendor-utils';
            }

            // Decimal.js for high precision calculations
            if (id.includes('node_modules/decimal.js/')) {
              return 'vendor-math';
            }

            // Zod for validation
            if (id.includes('node_modules/zod/')) {
              return 'vendor-validation';
            }

            // i18next for internationalization
            if (id.includes('node_modules/i18next') || id.includes('node_modules/react-i18next')) {
              return 'vendor-i18n';
            }

            // Split calculators by Epic for better performance (5 calculators each)
            // Epic 1: Core Engineering
            if (id.includes('/features/calculators/cutting-time-estimator') ||
                id.includes('/features/calculators/laser-parameter-optimizer') ||
                id.includes('/features/calculators/material-selection-assistant')) {
              return 'calculators-core-engineering';
            }

            // Epic 2: Quality Control
            if (id.includes('/features/calculators/edge-quality-predictor') ||
                id.includes('/features/calculators/warping-risk-calculator') ||
                id.includes('/features/calculators/burn-mark-preventer') ||
                id.includes('/features/calculators/dross-formation-calculator') ||
                id.includes('/features/calculators/tolerance-stack-calculator')) {
              return 'calculators-quality-control';
            }

            // Epic 3: Process Optimization
            if (id.includes('/features/calculators/focus-height-calculator') ||
                id.includes('/features/calculators/gas-pressure-setting-guide') ||
                id.includes('/features/calculators/frequency-setting-assistant') ||
                id.includes('/features/calculators/multiple-pass-calculator') ||
                id.includes('/features/calculators/power-speed-matching')) {
              return 'calculators-process-optimization';
            }

            // Epic 4: Advanced Analysis
            if (id.includes('/features/calculators/sensitivity-analysis-calculator') ||
                id.includes('/features/calculators/process-optimization-engine') ||
                id.includes('/features/calculators/predictive-quality-model') ||
                id.includes('/features/calculators/cost-benefit-analyzer') ||
                id.includes('/features/calculators/performance-benchmarking-tool')) {
              return 'calculators-advanced-analysis';
            }

            // Legacy calculator components (separate chunk)
            if (id.includes('/components/calculators/LaserCuttingCostCalculator') ||
                id.includes('/components/calculators/GasConsumptionCalculator')) {
              return 'calculators-legacy';
            }

            // Heat Affected Zone and Beam Quality calculators
            if (id.includes('/features/calculators/heat-affected-zone-calculator') ||
                id.includes('/features/calculators/beam-quality-calculator')) {
              return 'calculators-additional';
            }

            // Base calculator framework
            if (id.includes('/services/calculators/BaseCalculator') ||
                id.includes('/components/calculator/BaseCalculatorComponents')) {
              return 'calculator-framework';
            }

            // Search functionality
            if (id.includes('/services/searchService') ||
                id.includes('/components/search/')) {
              return 'search-system';
            }

            // Common components
            if (id.includes('/components/ui/') || id.includes('/components/common/')) {
              return 'ui-components';
            }

            // Layout components
            if (id.includes('/components/layout/')) {
              return 'layout-components';
            }

            // Data and configuration
            if (id.includes('/data/coreCalculatorConfigs') ||
                id.includes('/services/calculators/index')) {
              return 'app-data';
            }

            // Router configuration
            if (id.includes('/router/')) {
              return 'app-router';
            }

            // Internationalization
            if (id.includes('/lib/i18n/')) {
              return 'app-i18n';
            }

            // Pages
            if (id.includes('/pages/')) {
              return 'app-pages';
            }
          },

          // Optimize asset file names for better caching
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name?.split('.') || [];
            const ext = info[info.length - 1];
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
              return `images/[name]-[hash][extname]`;
            }
            if (/woff2?|eot|ttf|otf/i.test(ext)) {
              return `fonts/[name]-[hash][extname]`;
            }
            return `assets/[name]-[hash][extname]`;
          },

          // Optimize chunk file names
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'js/[name]-[hash].js',
        },
      },

      // Enhanced performance budgets - stricter limits for better performance
      chunkSizeWarningLimit: mode === 'production' ? 250 : 1000,

      // Enable compression and optimization
      cssCodeSplit: true,
      reportCompressedSize: mode === 'production',

      // Additional optimizations
      assetsInlineLimit: 4096, // Inline assets smaller than 4KB
      emptyOutDir: true, // Clean output directory before build

      // Enhanced minification for production
      minify: mode === 'production' ? 'terser' : false,
      terserOptions: mode === 'production' ? {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
          passes: 2
        },
        mangle: {
          safari10: true
        },
        format: {
          comments: false
        }
      } : undefined,

      // Target modern browsers for better optimization
      target: mode === 'production' ? ['es2020', 'chrome80', 'firefox78', 'safari14', 'edge88'] : 'es2015'
    },

    // Development server configuration
    server: {
      port: 5173,
      host: true,
      open: true,
    },

    // Preview server configuration
    preview: {
      port: 4173,
      host: true,
    },

    // Environment variables
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    },

    // CSS configuration will use postcss.config.js

    // Vitest configuration
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/setupTests.ts'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        exclude: [
          'node_modules/',
          'src/setupTests.ts',
          '**/*.d.ts',
          '**/*.test.{ts,tsx}',
          '**/__tests__/**',
        ],
        thresholds: {
          global: {
            branches: 70,
            functions: 70,
            lines: 70,
            statements: 70,
          },
        },
      },
    },

    // Enhanced optimization for 20 core calculators
    optimizeDeps: {
      include: [
        // Core React libraries - always pre-bundle for performance
        'react',
        'react-dom',
        'react-router-dom',

        // UI libraries - frequently used
        'lucide-react',

        // Essential utilities - used across calculators
        'clsx',
        'tailwind-merge',

        // Validation - used in all calculators
        'zod',

        // Chart libraries - used in advanced analysis
        'chart.js',
        'react-chartjs-2',

        // Internationalization
        'react-i18next',
        'i18next',
        'i18next-browser-languagedetector'
      ],

      // Exclude large dependencies that should be loaded on demand
      exclude: [
        // Large calculation libraries that can be lazy loaded
        'mathjs',
        // Keep decimal.js excluded to reduce initial bundle size
        'decimal.js'
      ],

      // Force optimization for problematic dependencies
      force: mode === 'development',

      // Additional optimization settings
      esbuildOptions: {
        target: mode === 'production' ? 'es2020' : 'es2015',
        // Enable tree shaking for better optimization
        treeShaking: true,
        // Minify identifiers for smaller bundle size
        minifyIdentifiers: mode === 'production',
        // Minify syntax for better compression
        minifySyntax: mode === 'production',
        // Enable JSX optimization
        jsx: 'automatic',
        // Drop unused imports
        drop: mode === 'production' ? ['console', 'debugger'] : []
      },
    },

    // Enhanced CSS processing
    css: {
      devSourcemap: mode === 'development',
      preprocessorOptions: {
        scss: {
          // Add any SCSS global variables here if needed
        },
      },
    },
  }
})
