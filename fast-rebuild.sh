#!/bin/bash

# Fast Production Rebuild Script
# Optimized for minimal downtime and faster builds

set -e

echo "⚡ Fast LocallyTrip Production Rebuild..."

# Ensure production environment
echo "📋 Setting up production environment..."
if [ -f ".env.production" ]; then
    cp .env.production .env
    echo "✅ Production environment configured"
else
    echo "❌ .env.production not found!"
    exit 1
fi

# Check if services are running
RUNNING_SERVICES=$(docker compose -f docker-compose.prod.yml ps --services --filter "status=running" | wc -l)

if [ "$RUNNING_SERVICES" -gt 0 ]; then
    echo "🔄 Services are running, performing rolling update..."
    
    # Update backend first (usually fastest)
    echo "🔄 Updating backend..."
    docker compose -f docker-compose.prod.yml up --build -d backend
    
    # Wait for backend to be healthy
    echo "⏳ Waiting for backend health check..."
    sleep 30
    
    # Update frontend services
    echo "🔄 Updating frontend services..."
    docker compose -f docker-compose.prod.yml up --build -d web web-admin
    
    # Wait for frontend health
    echo "⏳ Waiting for frontend health check..."
    sleep 45
    
    # Update nginx last
    echo "🔄 Updating nginx..."
    docker compose -f docker-compose.prod.yml up --build -d nginx
    
else
    echo "🚀 No services running, performing full startup..."
    docker compose -f docker-compose.prod.yml up --build -d
fi

# Health checks
echo "🔍 Performing health checks..."

# Wait a bit more for all services
sleep 30

# Check backend
if curl -f -s --max-time 10 http://localhost:3001/health >/dev/null 2>&1; then
    echo "✅ Backend is healthy"
else
    echo "⚠️  Backend health check failed, checking logs..."
    docker compose -f docker-compose.prod.yml logs backend | tail -10
fi

# Check frontend
if curl -f -s --max-time 10 http://localhost:3000 >/dev/null 2>&1; then
    echo "✅ Frontend is healthy"
else
    echo "⚠️  Frontend health check failed, checking logs..."
    docker compose -f docker-compose.prod.yml logs web | tail -10
fi

# Check API proxy
if curl -f -s --max-time 10 http://localhost:3000/api/cities >/dev/null 2>&1; then
    echo "✅ API proxy is working"
else
    echo "⚠️  API proxy failed, checking logs..."
    docker compose -f docker-compose.prod.yml logs web | tail -5
fi

# Show final status
echo ""
echo "📊 Final Status:"
docker compose -f docker-compose.prod.yml ps

echo ""
echo "⚡ Fast rebuild completed!"
echo "🌐 Services:"
echo "   Frontend: http://localhost:3000"
echo "   Admin: http://localhost:3002" 
echo "   API: http://localhost:3001"
