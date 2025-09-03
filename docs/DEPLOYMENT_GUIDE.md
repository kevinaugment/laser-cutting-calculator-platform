# Laser Cutting Calculator Platform - Deployment Guide

## Overview

This guide covers the deployment of the Laser Cutting Calculator Platform, a comprehensive web application with 90 specialized calculators for laser cutting operations.

## Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Components**: Tailwind CSS + shadcn/ui
- **State Management**: React Context + Custom Hooks
- **Charts**: Recharts
- **Performance**: Advanced caching and optimization

### Backend Services
- **API**: RESTful services for data persistence
- **Database**: PostgreSQL for production, SQLite for development
- **Caching**: Redis for session and calculation caching
- **File Storage**: AWS S3 for reports and exports

## Prerequisites

### Development Environment
- Node.js 18+ 
- npm 9+ or yarn 1.22+
- Git
- Docker (optional, for containerized deployment)

### Production Environment
- Linux server (Ubuntu 20.04+ recommended)
- Nginx (reverse proxy)
- SSL certificate
- Domain name
- Monitoring tools (optional)

## Environment Configuration

### Environment Variables

Create `.env.production` file:

```bash
# Application
VITE_APP_TITLE="Laser Cutting Calculator Platform"
VITE_APP_VERSION="1.0.0"
VITE_APP_ENVIRONMENT="production"

# API Configuration
VITE_API_BASE_URL="https://api.yourdomain.com"
VITE_API_TIMEOUT=30000

# Analytics
VITE_GOOGLE_ANALYTICS_ID="GA_MEASUREMENT_ID"
VITE_ENABLE_ANALYTICS=true

# Performance
VITE_ENABLE_PERFORMANCE_MONITORING=true
VITE_CACHE_STRATEGY="hybrid"
VITE_CACHE_TTL=300000

# Features
VITE_ENABLE_ADVANCED_ANALYTICS=true
VITE_ENABLE_COST_TRACKING=true
VITE_ENABLE_AI_OPTIMIZATION=true

# Security
VITE_ENABLE_CSP=true
VITE_ALLOWED_ORIGINS="https://yourdomain.com,https://www.yourdomain.com"
```

### Build Configuration

Update `vite.config.ts` for production:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'es2015',
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['recharts'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-tabs'],
          utils: ['date-fns', 'lodash-es'],
        },
      },
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  server: {
    port: 3000,
    host: true,
  },
  preview: {
    port: 4173,
    host: true,
  },
})
```

## Deployment Methods

### Method 1: Static Hosting (Recommended)

#### Vercel Deployment

1. **Install Vercel CLI**:
```bash
npm i -g vercel
```

2. **Configure `vercel.json`**:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "VITE_APP_ENVIRONMENT": "production"
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

3. **Deploy**:
```bash
npm run build
vercel --prod
```

#### Netlify Deployment

1. **Configure `netlify.toml`**:
```toml
[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

2. **Deploy**:
```bash
npm run build
# Upload dist folder to Netlify or connect GitHub repository
```

### Method 2: Docker Deployment

#### Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine as builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built application
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
```

#### Nginx Configuration

Create `nginx.conf`:

```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # Handle client-side routing
        location / {
            try_files $uri $uri/ /index.html;
        }

        # API proxy (if needed)
        location /api/ {
            proxy_pass http://api-server:3001/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

#### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Optional: Add database and cache services
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: laser_calc
      POSTGRES_USER: laser_user
      POSTGRES_PASSWORD: secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

#### Deploy with Docker

```bash
# Build and run
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f app
```

### Method 3: Traditional Server Deployment

#### Server Setup (Ubuntu 20.04+)

1. **Update system**:
```bash
sudo apt update && sudo apt upgrade -y
```

2. **Install Node.js**:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

3. **Install Nginx**:
```bash
sudo apt install nginx -y
sudo systemctl enable nginx
```

4. **Install PM2** (for process management):
```bash
sudo npm install -g pm2
```

#### Application Deployment

1. **Clone repository**:
```bash
git clone https://github.com/yourusername/laser-calc-app.git
cd laser-calc-app
```

2. **Install dependencies**:
```bash
npm ci --production
```

3. **Build application**:
```bash
npm run build
```

4. **Configure Nginx**:
```bash
sudo nano /etc/nginx/sites-available/laser-calc
```

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    root /var/www/laser-calc/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Handle client-side routing
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

5. **Enable site**:
```bash
sudo ln -s /etc/nginx/sites-available/laser-calc /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

6. **Copy files**:
```bash
sudo mkdir -p /var/www/laser-calc
sudo cp -r dist/* /var/www/laser-calc/
sudo chown -R www-data:www-data /var/www/laser-calc
```

## SSL Configuration

### Using Certbot (Let's Encrypt)

1. **Install Certbot**:
```bash
sudo apt install certbot python3-certbot-nginx -y
```

2. **Obtain certificate**:
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

3. **Auto-renewal**:
```bash
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## Performance Optimization

### CDN Configuration

Configure CDN for static assets:

```javascript
// In vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `images/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
      },
    },
  },
});
```

### Caching Strategy

Implement service worker for offline capabilities:

```javascript
// public/sw.js
const CACHE_NAME = 'laser-calc-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});
```

## Monitoring and Analytics

### Health Checks

Create health check endpoint:

```typescript
// src/utils/healthCheck.ts
export const healthCheck = {
  status: 'healthy',
  timestamp: new Date().toISOString(),
  version: process.env.VITE_APP_VERSION,
  uptime: process.uptime(),
  memory: process.memoryUsage(),
};
```

### Error Tracking

Configure error tracking:

```typescript
// src/utils/errorTracking.ts
export const initErrorTracking = () => {
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    // Send to monitoring service
  });

  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    // Send to monitoring service
  });
};
```

## Backup and Recovery

### Database Backup

```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump laser_calc > backup_$DATE.sql
aws s3 cp backup_$DATE.sql s3://your-backup-bucket/
```

### Application Backup

```bash
#!/bin/bash
# app-backup.sh
tar -czf app_backup_$(date +%Y%m%d).tar.gz /var/www/laser-calc
```

## Troubleshooting

### Common Issues

1. **Build failures**:
   - Check Node.js version compatibility
   - Clear node_modules and reinstall
   - Verify environment variables

2. **Performance issues**:
   - Enable gzip compression
   - Optimize bundle size
   - Implement lazy loading

3. **Routing issues**:
   - Configure server for SPA routing
   - Check base URL configuration

### Logs

Monitor application logs:

```bash
# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Application logs (if using PM2)
pm2 logs

# Docker logs
docker-compose logs -f
```

## Security Checklist

- [ ] HTTPS enabled with valid SSL certificate
- [ ] Security headers configured
- [ ] Content Security Policy implemented
- [ ] Regular dependency updates
- [ ] Environment variables secured
- [ ] Access logs monitored
- [ ] Backup strategy implemented
- [ ] Error tracking configured

## Maintenance

### Regular Tasks

1. **Weekly**:
   - Monitor performance metrics
   - Check error logs
   - Verify backup integrity

2. **Monthly**:
   - Update dependencies
   - Review security headers
   - Performance optimization review

3. **Quarterly**:
   - Security audit
   - Disaster recovery testing
   - Documentation updates

## Support

For deployment issues:
1. Check logs for error messages
2. Verify environment configuration
3. Test in staging environment first
4. Contact development team with specific error details

---

**Last Updated**: December 2024
**Version**: 1.0.0
