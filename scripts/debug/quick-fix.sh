#!/bin/bash

# Quick Stability Fix for LocallyTrip
# Fixes 404s, CORS, and improves stability

set -e

echo "🔧 Quick Stability Fix for LocallyTrip"
echo "======================================"

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin main

# Restart services in correct order for stability
echo "🔄 Restarting services for stability..."

echo "🛑 Stopping all services..."
docker compose -f docker-compose.prod.yml down

echo "🚀 Starting services in optimal order..."
docker compose -f docker-compose.prod.yml up -d postgres
sleep 10

docker compose -f docker-compose.prod.yml up -d backend
sleep 15

docker compose -f docker-compose.prod.yml up -d web web-admin
sleep 10

docker compose -f docker-compose.prod.yml up -d nginx
sleep 10

# Check status
echo "📊 Checking service status..."
docker compose -f docker-compose.prod.yml ps

# Test connectivity
echo "🧪 Testing connectivity..."
sleep 5

if curl -k -s --connect-timeout 10 https://localhost > /dev/null 2>&1; then
    echo "✅ Site is responsive!"
else
    echo "⚠️ Site may need a moment to fully start"
fi

echo ""
echo "🎉 Quick fix completed!"
echo "🌐 Visit: https://locallytrip.com"
echo "📊 Monitor: docker compose -f docker-compose.prod.yml ps"
echo "📋 Logs: docker compose -f docker-compose.prod.yml logs -f"
