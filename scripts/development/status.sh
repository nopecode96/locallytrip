#!/bin/bash

# LocallyTrip Development Status Script
# This script shows the status of all services

echo "🔍 LocallyTrip Development Environment Status"
echo "============================================="

# Navigate to project root
cd "$(dirname "$0")/../.."

# Show container status
echo "📦 Container Status:"
echo "-------------------"
docker compose ps

echo ""
echo "🌐 Service Health Checks:"
echo "------------------------"

# Check Database
if docker compose exec postgres pg_isready -U locallytrip_prod_user -d locallytrip_prod >/dev/null 2>&1; then
    echo "✅ Database: Ready (localhost:5432)"
else
    echo "❌ Database: Not ready"
fi

# Check Backend
if curl -f http://localhost:3001/health >/dev/null 2>&1; then
    echo "✅ Backend API: Ready (http://localhost:3001)"
else
    echo "❌ Backend API: Not ready"
fi

# Check Frontend
if curl -f http://localhost:3000 >/dev/null 2>&1; then
    echo "✅ Frontend: Ready (http://localhost:3000)"
else
    echo "❌ Frontend: Not ready"
fi

# Check Admin
if curl -f http://localhost:3002 >/dev/null 2>&1; then
    echo "✅ Admin Panel: Ready (http://localhost:3002)"
else
    echo "❌ Admin Panel: Not ready"
fi

echo ""
echo "🔗 Quick Links:"
echo "--------------"
echo "🌐 Frontend:    http://localhost:3000"
echo "🔧 Admin:       http://localhost:3002"
echo "📡 API:         http://localhost:3001"
echo "📊 API Health:  http://localhost:3001/health"
echo ""
echo "📝 View logs: docker compose logs -f [service-name]"
echo "🔄 Restart:   docker compose restart [service-name]"
