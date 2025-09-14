#!/bin/bash

# Immediate Server Diagnostics and Fix Script
# Run this on production server to diagnose and fix 503 issues

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
    echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}[OK]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log "🚨 LocallyTrip 503 Error Diagnostics"
log "===================================="

# 1. Check if services are running
log "📊 Service Status:"
docker compose -f docker-compose.prod.yml ps

echo ""
log "🏥 Health Check Results:"

# 2. Test web service directly
if docker compose -f docker-compose.prod.yml exec -T web curl -s -f http://localhost:3000 > /dev/null 2>&1; then
    success "✅ Web service internal health: OK"
else
    error "❌ Web service internal health: FAILED"
    log "📋 Web service logs (last 20 lines):"
    docker compose -f docker-compose.prod.yml logs --tail=20 web
fi

# 3. Test nginx to web proxy
if curl -s -k -f https://localhost > /dev/null 2>&1; then
    success "✅ Nginx to web proxy: OK"
else
    error "❌ Nginx to web proxy: FAILED"
    log "📋 Nginx logs (last 20 lines):"
    docker compose -f docker-compose.prod.yml logs --tail=20 nginx
fi

# 4. Test specific problematic endpoints
echo ""
log "🧪 Testing Problematic Endpoints:"

test_endpoints=(
    "/_next/static/chunks/main-app-180cce987a1fe211.js"
    "/_next/static/chunks/2392-403fa007065b00cb.js"
    "/_next/static/chunks/app/page-37163abc34c19309.js"
    "/_next/static/chunks/4014-86e9b7c5ab8475cf.js"
    "/_next/static/chunks/app/layout-91c41a2cebfdd8a8.js"
    "/favicon.svg"
)

for endpoint in "${test_endpoints[@]}"; do
    response_code=$(curl -s -k -o /dev/null -w "%{http_code}" "https://localhost$endpoint" 2>/dev/null || echo "FAILED")
    if [[ "$response_code" == "200" ]]; then
        success "✅ $endpoint: $response_code"
    else
        error "❌ $endpoint: $response_code"
    fi
done

# 5. Check container resources
echo ""
log "💾 Container Resource Usage:"
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}" $(docker compose -f docker-compose.prod.yml ps -q)

# 6. Check nginx upstream status
echo ""
log "🔧 Nginx Configuration Test:"
if docker compose -f docker-compose.prod.yml exec -T nginx nginx -t > /dev/null 2>&1; then
    success "✅ Nginx configuration: Valid"
else
    error "❌ Nginx configuration: Invalid"
    docker compose -f docker-compose.prod.yml exec nginx nginx -t
fi

# 7. Quick fix attempts
echo ""
log "🛠️ Attempting Quick Fixes:"

# Restart web service if unhealthy
if ! docker compose -f docker-compose.prod.yml exec -T web curl -s -f http://localhost:3000 > /dev/null 2>&1; then
    warning "🔄 Web service unhealthy, restarting..."
    docker compose -f docker-compose.prod.yml restart web
    sleep 10
    
    if docker compose -f docker-compose.prod.yml exec -T web curl -s -f http://localhost:3000 > /dev/null 2>&1; then
        success "✅ Web service restart: Successful"
    else
        error "❌ Web service restart: Failed"
    fi
fi

# Reload nginx if needed
log "🔄 Reloading nginx configuration..."
docker compose -f docker-compose.prod.yml exec nginx nginx -s reload

# 8. Final test
echo ""
log "🎯 Final Verification:"
sleep 5

final_test_code=$(curl -s -k -o /dev/null -w "%{http_code}" "https://localhost/_next/static/" 2>/dev/null || echo "FAILED")
if [[ "$final_test_code" == "200" ]] || [[ "$final_test_code" == "404" ]]; then
    success "✅ Static files endpoint responding: $final_test_code"
else
    error "❌ Static files endpoint still failing: $final_test_code"
fi

echo ""
log "📋 Diagnosis Complete!"
log "💡 Next steps:"
log "   - If errors persist, check the logs above"
log "   - Consider running: docker compose -f docker-compose.prod.yml restart"
log "   - Monitor: docker compose -f docker-compose.prod.yml logs -f web"
