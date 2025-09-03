#!/bin/bash

# Laser Cutting Calculator Platform - Cloudflare Deployment Script
# 
# Before running this script, please:
# 1. Get your Cloudflare API Token from: https://dash.cloudflare.com/profile/api-tokens
# 2. Set the environment variable: export CLOUDFLARE_API_TOKEN="your-token-here"
# 3. Run: chmod +x deploy.sh && ./deploy.sh

echo "🚀 Deploying Laser Cutting Calculator Platform to Cloudflare Pages..."

# Check if API token is set
if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
    echo "❌ Error: CLOUDFLARE_API_TOKEN environment variable is not set"
    echo "Please set your Cloudflare API Token:"
    echo "export CLOUDFLARE_API_TOKEN=\"your-token-here\""
    exit 1
fi

# Build the project
echo "📦 Building project..."
npm run build:production

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the build errors first."
    exit 1
fi

# Deploy to Cloudflare Pages
echo "🌐 Deploying to Cloudflare Pages..."
npx wrangler pages deploy dist --project-name=laser-calc-platform

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo "🎉 Your Laser Cutting Calculator Platform is now live!"
    echo "📱 Visit: https://laser-calc-platform.pages.dev"
else
    echo "❌ Deployment failed. Please check the error messages above."
    exit 1
fi
