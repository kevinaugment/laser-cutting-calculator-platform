// Service Worker for Laser Cutting Calculator Platform
// Enhanced caching strategy for optimal performance

const CACHE_NAME = 'laser-calc-v1.3.1';
const STATIC_CACHE = 'laser-calc-static-v1.3.1';
const DYNAMIC_CACHE = 'laser-calc-dynamic-v1.3.1';
const CALCULATOR_CACHE = 'laser-calc-calculators-v1.3.1';
const PERFORMANCE_CACHE = 'laser-calc-performance-v1.3.1';

// Static assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  // Core CSS and JS will be added dynamically
];

// Calculator routes to cache (all 21 calculators)
const CALCULATOR_ROUTES = [
  '/calculator/laser-cutting-cost',
  '/calculator/cutting-time-estimator',
  '/calculator/laser-parameter-optimizer',
  '/calculator/material-selection-assistant',
  '/calculator/energy-cost',
  '/calculator/focus-height',
  '/calculator/kerf-width',
  '/calculator/warping-risk',
  '/calculator/material-nesting-optimizer',
  '/calculator/batch-processing',
  '/calculator/production-capacity',
  '/calculator/quality-grade',
  '/calculator/edge-quality-predictor',
  '/calculator/profit-margin',
  '/calculator/project-quoting',
  '/calculator/maintenance-cost',
  '/calculator/gas-consumption',
  '/calculator/equipment-comparison',
  '/calculator/heat-affected-zone',
  '/calculator/job-queue-optimizer',
  '/calculator/cut-path-optimizer',
];

// Enhanced cache strategies with TTL
const CACHE_STRATEGIES = {
  // Static assets: Cache first, fallback to network
  static: 'cache-first',
  // API calls: Network first, fallback to cache
  api: 'network-first',
  // Calculator pages: Stale while revalidate
  calculators: 'stale-while-revalidate',
  // Images: Cache first with long TTL
  images: 'cache-first',
  // Performance data: Cache with short TTL
  performance: 'network-first',
};

// Cache TTL settings (in milliseconds)
const CACHE_TTL = {
  static: 24 * 60 * 60 * 1000,      // 24 hours
  dynamic: 60 * 60 * 1000,          // 1 hour
  calculators: 12 * 60 * 60 * 1000, // 12 hours
  images: 7 * 24 * 60 * 60 * 1000,  // 7 days
  performance: 5 * 60 * 1000,       // 5 minutes
};

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('📦 Caching static assets...');
        return cache.addAll(STATIC_ASSETS);
      }),
      
      // Cache calculator routes
      caches.open(CALCULATOR_CACHE).then((cache) => {
        console.log('🧮 Pre-caching calculator routes...');
        return cache.addAll(CALCULATOR_ROUTES);
      }),
    ])
  );
  
  // Force activation of new service worker
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker activating...');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (
              cacheName !== STATIC_CACHE &&
              cacheName !== DYNAMIC_CACHE &&
              cacheName !== CALCULATOR_CACHE &&
              cacheName.startsWith('laser-calc-')
            ) {
              console.log('🗑️ Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      
      // Take control of all clients
      self.clients.claim(),
    ])
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) {
    return;
  }
  
  event.respondWith(handleRequest(request));
});

// Main request handler with different strategies
async function handleRequest(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  try {
    // Static assets (JS, CSS, fonts)
    if (isStaticAsset(pathname)) {
      return await cacheFirst(request, STATIC_CACHE);
    }
    
    // Images
    if (isImage(pathname)) {
      return await cacheFirst(request, DYNAMIC_CACHE);
    }
    
    // Calculator pages
    if (isCalculatorRoute(pathname)) {
      return await staleWhileRevalidate(request, CALCULATOR_CACHE);
    }
    
    // API calls
    if (pathname.startsWith('/api/')) {
      return await networkFirst(request, DYNAMIC_CACHE);
    }
    
    // Default: network first for HTML pages
    return await networkFirst(request, DYNAMIC_CACHE);
    
  } catch (error) {
    console.error('❌ Service Worker fetch error:', error);
    
    // Fallback for calculator pages
    if (isCalculatorRoute(pathname)) {
      const fallbackResponse = await caches.match('/');
      if (fallbackResponse) {
        return fallbackResponse;
      }
    }
    
    // Return a basic offline page or error response
    return new Response('Offline - Please check your connection', {
      status: 503,
      statusText: 'Service Unavailable',
    });
  }
}

// Cache-first strategy
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    // Update cache in background
    fetch(request).then((response) => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
    }).catch(() => {
      // Ignore network errors for background updates
    });
    
    return cachedResponse;
  }
  
  // Fetch from network and cache
  const networkResponse = await fetch(request);
  if (networkResponse.ok) {
    cache.put(request, networkResponse.clone());
  }
  
  return networkResponse;
}

// Network-first strategy
async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Fallback to cache
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

// Stale-while-revalidate strategy
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  // Always try to update cache in background
  const networkPromise = fetch(request).then((response) => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => {
    // Ignore network errors for background updates
  });
  
  // Return cached version immediately if available
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Wait for network if no cache
  return await networkPromise;
}

// Helper functions
function isStaticAsset(pathname) {
  return /\.(js|css|woff2?|eot|ttf|otf)$/i.test(pathname);
}

function isImage(pathname) {
  return /\.(png|jpe?g|gif|svg|webp|ico)$/i.test(pathname);
}

function isCalculatorRoute(pathname) {
  return pathname.startsWith('/calculator/') || CALCULATOR_ROUTES.includes(pathname);
}

// Message handling for cache management
self.addEventListener('message', (event) => {
  const { type, payload } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'CLEAR_CACHE':
      clearAllCaches().then(() => {
        event.ports[0].postMessage({ success: true });
      });
      break;
      
    case 'GET_CACHE_SIZE':
      getCacheSize().then((size) => {
        event.ports[0].postMessage({ size });
      });
      break;
  }
});

// Utility functions
async function clearAllCaches() {
  const cacheNames = await caches.keys();
  return Promise.all(
    cacheNames.map((cacheName) => {
      if (cacheName.startsWith('laser-calc-')) {
        return caches.delete(cacheName);
      }
    })
  );
}

async function getCacheSize() {
  const cacheNames = await caches.keys();
  let totalSize = 0;
  
  for (const cacheName of cacheNames) {
    if (cacheName.startsWith('laser-calc-')) {
      const cache = await caches.open(cacheName);
      const requests = await cache.keys();
      totalSize += requests.length;
    }
  }
  
  return totalSize;
}

console.log('🚀 Service Worker loaded successfully');
