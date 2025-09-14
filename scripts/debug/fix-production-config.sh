#!/bin/bash

# Fix Production Configuration Issues
# This script addresses Next.js warnings and missing assets

set -e

echo "🔧 Fixing LocallyTrip Production Configuration Issues..."

# Pull latest changes first
echo "📥 Pulling latest changes..."
git pull origin main

# Ensure production environment
echo "📋 Setting up production environment..."
if [ -f ".env.production" ]; then
    cp .env.production .env
    echo "✅ Production environment configured"
else
    echo "❌ .env.production not found!"
    exit 1
fi

# Stop services for rebuild
echo "🛑 Stopping services for configuration update..."
docker compose -f docker-compose.prod.yml down

# Clean build cache to ensure new configs are used
echo "🧹 Cleaning build cache..."
docker system prune -f

# Rebuild with updated configurations
echo "🔨 Rebuilding with updated configurations..."
docker compose -f docker-compose.prod.yml up --build -d

# Wait for services to start
echo "⏳ Waiting for services to start..."
sleep 60

# Health checks
echo "🔍 Performing health checks..."

# Check backend
if curl -f -s --max-time 10 http://localhost:3001/health >/dev/null 2>&1; then
    echo "✅ Backend is healthy"
else
    echo "⚠️  Backend health check failed"
    docker compose -f docker-compose.prod.yml logs backend | tail -10
fi

# Check frontend
if curl -f -s --max-time 10 http://localhost:3000 >/dev/null 2>&1; then
    echo "✅ Frontend is healthy"
else
    echo "⚠️  Frontend health check failed"
    docker compose -f docker-compose.prod.yml logs web | tail -10
fi

# Check admin
if curl -f -s --max-time 10 http://localhost:3002 >/dev/null 2>&1; then
    echo "✅ Admin is healthy"
else
    echo "⚠️  Admin health check failed"
    docker compose -f docker-compose.prod.yml logs web-admin | tail -10
fi

# Test API proxy
echo "🧪 Testing API proxy..."
if curl -f -s --max-time 10 http://localhost:3000/api/cities >/dev/null 2>&1; then
    echo "✅ API proxy is working"
else
    echo "⚠️  API proxy test failed"
fi

# Test favicon
echo "🧪 Testing favicon files..."
if curl -f -s --max-time 5 http://localhost:3000/favicon.ico >/dev/null 2>&1; then
    echo "✅ Favicon is accessible"
else
    echo "⚠️  Favicon test failed"
fi

# Show final status
echo ""
echo "📊 Final Status:"
docker compose -f docker-compose.prod.yml ps

# Check for warnings in logs
echo ""
echo "🔍 Checking for warnings..."
echo "Backend logs (last 5 lines):"
docker compose -f docker-compose.prod.yml logs backend | tail -5

echo ""
echo "Frontend logs (last 5 lines):"
docker compose -f docker-compose.prod.yml logs web | tail -5

echo ""
echo "Admin logs (last 5 lines):"
docker compose -f docker-compose.prod.yml logs web-admin | tail -5

echo ""
echo "🎉 Configuration fix completed!"
echo ""
echo "📝 Expected Results:"
echo "   ✅ No more 'version is obsolete' warnings"
echo "   ✅ No more Next.js standalone configuration warnings"
echo "   ✅ No more invalid next.config.js warnings"
echo "   ✅ Favicon files should be accessible"
echo ""
echo "🌐 Test URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Admin: http://localhost:3002"
echo "   API: http://localhost:3001/health"
echo "   Favicon: http://localhost:3000/favicon.ico"
