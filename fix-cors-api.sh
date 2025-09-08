#!/bin/bash

# Fix CORS and API Configuration Issues
# This script addresses multiple issues preventing frontend from accessing backend

set -e

echo "🔧 Fixing LocallyTrip CORS and API Configuration Issues..."

# Ensure we're using production environment
echo "📋 Setting up production environment..."
if [ -f ".env.production" ]; then
    cp .env.production .env
    echo "✅ Copied .env.production to .env"
else
    echo "❌ .env.production not found!"
    exit 1
fi

# Stop all services
echo "🛑 Stopping all services..."
docker compose -f docker-compose.prod.yml down

# Clean up old containers and images
echo "🧹 Cleaning up old containers..."
docker compose -f docker-compose.prod.yml down --remove-orphans
docker system prune -f

# Rebuild and start services
echo "🔨 Rebuilding services with updated configuration..."
docker compose -f docker-compose.prod.yml up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 60

# Check service status
echo "📊 Checking service status..."
docker compose -f docker-compose.prod.yml ps

# Test backend health
echo "🧪 Testing backend health..."
if curl -f -s http://localhost:3001/health >/dev/null; then
    echo "✅ Backend is responding"
else
    echo "❌ Backend is not responding"
    echo "📋 Backend logs:"
    docker compose -f docker-compose.prod.yml logs backend | tail -20
fi

# Test frontend health
echo "🧪 Testing frontend health..."
if curl -f -s http://localhost:3000 >/dev/null; then
    echo "✅ Frontend is responding"
else
    echo "❌ Frontend is not responding"
    echo "📋 Frontend logs:"
    docker compose -f docker-compose.prod.yml logs web | tail -20
fi

# Test API proxy
echo "🧪 Testing API proxy..."
if curl -f -s http://localhost:3000/api/cities >/dev/null; then
    echo "✅ API proxy is working"
else
    echo "❌ API proxy is not working"
    echo "📋 Web container logs:"
    docker compose -f docker-compose.prod.yml logs web | tail -10
fi

# Show environment variables in containers
echo "🔍 Checking environment variables in containers..."
echo "Backend CORS_ORIGIN:"
docker compose -f docker-compose.prod.yml exec backend printenv CORS_ORIGIN || echo "Not set"

echo "Frontend NEXT_PUBLIC_API_URL:"
docker compose -f docker-compose.prod.yml exec web printenv NEXT_PUBLIC_API_URL || echo "Not set"

echo "Frontend INTERNAL_API_URL:"
docker compose -f docker-compose.prod.yml exec web printenv INTERNAL_API_URL || echo "Not set"

echo ""
echo "🎉 CORS and API configuration fix completed!"
echo ""
echo "📊 Expected Results:"
echo "   - Frontend should use /api/* routes (Next.js proxy pattern)"
echo "   - Backend should have proper CORS headers"
echo "   - No direct calls to https://api.locallytrip.com from frontend"
echo ""
echo "📝 If issues persist:"
echo "   1. Check logs: docker compose -f docker-compose.prod.yml logs -f [service]"
echo "   2. Verify domain DNS: dig locallytrip.com"
echo "   3. Check SSL certificates: curl -I https://locallytrip.com"
