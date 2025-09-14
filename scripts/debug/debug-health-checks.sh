#!/bin/bash

# Debug Health Check Issues
# This script helps diagnose why frontend containers are unhealthy

set -e

echo "🔍 Debugging LocallyTrip Health Check Issues..."

# Check container status
echo "📊 Container Status:"
docker compose -f docker-compose.prod.yml ps

echo ""
echo "🔍 Health Check Details:"

# Check web container health
echo "--- Web Container Health ---"
docker inspect locallytrip-web-prod --format='{{json .State.Health}}' | jq -r '.Log[-1].Output' 2>/dev/null || echo "No detailed health log available"

# Check admin container health  
echo "--- Admin Container Health ---"
docker inspect locallytrip-admin-prod --format='{{json .State.Health}}' | jq -r '.Log[-1].Output' 2>/dev/null || echo "No detailed health log available"

# Test direct container access
echo ""
echo "🧪 Testing Direct Container Access:"

# Test web container internally
echo "Testing web container curl localhost:3000..."
docker exec locallytrip-web-prod curl -f -s --max-time 5 http://localhost:3000 >/dev/null 2>&1 && echo "✅ Web internal curl SUCCESS" || echo "❌ Web internal curl FAILED"

# Test admin container internally
echo "Testing admin container curl localhost:3000..."
docker exec locallytrip-admin-prod curl -f -s --max-time 5 http://localhost:3000 >/dev/null 2>&1 && echo "✅ Admin internal curl SUCCESS" || echo "❌ Admin internal curl FAILED"

# Test external access
echo ""
echo "🌐 Testing External Access:"

# Test via network
echo "Testing web via network (port 3000)..."
curl -f -s --max-time 5 http://localhost:3000 >/dev/null 2>&1 && echo "✅ Web external access SUCCESS" || echo "❌ Web external access FAILED"

echo "Testing admin via network (port 3002)..."
curl -f -s --max-time 5 http://localhost:3002 >/dev/null 2>&1 && echo "✅ Admin external access SUCCESS" || echo "❌ Admin external access FAILED"

# Test API proxy
echo "Testing API proxy..."
curl -f -s --max-time 5 http://localhost:3000/api/cities >/dev/null 2>&1 && echo "✅ API proxy SUCCESS" || echo "❌ API proxy FAILED"

# Check if nginx is running
echo ""
echo "🔍 Checking Nginx Status:"
docker compose -f docker-compose.prod.yml ps nginx || echo "Nginx not running"

# Check nginx logs if running
if docker compose -f docker-compose.prod.yml ps nginx | grep -q "Up"; then
    echo "📋 Recent Nginx Logs:"
    docker compose -f docker-compose.prod.yml logs nginx | tail -10
else
    echo "🚀 Starting Nginx..."
    docker compose -f docker-compose.prod.yml up -d nginx
fi

# Show port mappings
echo ""
echo "🔌 Port Mappings:"
docker compose -f docker-compose.prod.yml ps --format "table {{.Names}}\t{{.Ports}}"

# Check if curl is available in containers
echo ""
echo "🔍 Checking if curl is available in containers:"
echo "Web container curl version:"
docker exec locallytrip-web-prod curl --version 2>/dev/null | head -1 || echo "❌ curl not available in web container"

echo "Admin container curl version:"
docker exec locallytrip-admin-prod curl --version 2>/dev/null | head -1 || echo "❌ curl not available in admin container"

# Show container logs
echo ""
echo "📋 Recent Container Logs:"
echo "--- Web Logs ---"
docker compose -f docker-compose.prod.yml logs web | tail -5

echo "--- Admin Logs ---"
docker compose -f docker-compose.prod.yml logs web-admin | tail -5

echo ""
echo "💡 Recommendations:"
echo "1. If curl is missing in containers, we need to add it to Dockerfiles"
echo "2. If external access fails, check nginx configuration"
echo "3. If internal curl works but health check fails, check health check command"
echo "4. Use 'docker exec [container] curl -v http://localhost:3000' for detailed debugging"
