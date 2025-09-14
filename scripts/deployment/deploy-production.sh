#!/bin/bash

# LocallyTrip Production Deployment Script
# This script handles proper environment setup for production deployment

set -e

echo "🚀 Starting LocallyTrip Production Deployment..."

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    echo "❌ Error: .env.production file not found!"
    echo "Please ensure .env.production is available in the project root."
    exit 1
fi

# Copy production environment file
echo "📋 Setting up production environment..."
cp .env.production .env

# Verify environment variables are loaded
echo "🔍 Verifying environment variables..."
source .env.production

if [ -z "$NEXT_PUBLIC_API_URL" ]; then
    echo "❌ Error: NEXT_PUBLIC_API_URL not set in .env.production"
    exit 1
fi

echo "✅ NEXT_PUBLIC_API_URL: $NEXT_PUBLIC_API_URL"
echo "✅ NEXT_PUBLIC_IMAGES: $NEXT_PUBLIC_IMAGES"
echo "✅ NEXT_PUBLIC_WEBSITE_URL: $NEXT_PUBLIC_WEBSITE_URL"

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker compose -f docker-compose.prod.yml down --remove-orphans

# Remove old images to force rebuild
echo "🗑️  Removing old images..."
docker compose -f docker-compose.prod.yml down --rmi all --volumes --remove-orphans 2>/dev/null || true

# Build and start services
echo "🔨 Building and starting production services..."
docker compose -f docker-compose.prod.yml up --build -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 30

# Check service health
echo "🔍 Checking service health..."
docker compose -f docker-compose.prod.yml ps

# Test API connectivity
echo "🧪 Testing API connectivity..."
if curl -f http://localhost:3001/health >/dev/null 2>&1; then
    echo "✅ Backend API is responding"
else
    echo "❌ Backend API is not responding"
fi

if curl -f http://localhost:3000 >/dev/null 2>&1; then
    echo "✅ Frontend is responding"
else
    echo "❌ Frontend is not responding"
fi

echo "🎉 Production deployment completed!"
echo ""
echo "📊 Services Status:"
echo "   Backend API: http://localhost:3001"
echo "   Frontend Web: http://localhost:3000"
echo "   Admin Dashboard: http://localhost:3002"
echo ""
echo "📝 To check logs:"
echo "   docker compose -f docker-compose.prod.yml logs -f [service_name]"
echo ""
echo "🔧 To stop services:"
echo "   docker compose -f docker-compose.prod.yml down"
