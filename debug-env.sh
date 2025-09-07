#!/bin/bash

# Debug Environment Variables Script
# Usage: ./debug-env.sh

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
    echo -e "${BLUE}[DEBUG]${NC} $1"
}

success() {
    echo -e "${GREEN}[OK]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[CHECK]${NC} $1"
}

log "🔍 LocallyTrip Environment Debug"
log "==============================="

# Check if services are running
log "📊 Docker Services Status:"
docker compose -f docker-compose.prod.yml ps

echo ""
log "🌍 Environment Variables in Containers:"

# Check web container environment
log "📱 Web Container Environment:"
docker compose -f docker-compose.prod.yml exec -T web printenv | grep -E "(NEXT_PUBLIC|API_URL|IMAGES)" | sort || warning "Web container not running or no env vars found"

echo ""
log "🔧 Backend Container Environment:"
docker compose -f docker-compose.prod.yml exec -T backend printenv | grep -E "(NODE_ENV|API_URL|DB_|PORT)" | sort || warning "Backend container not running or no env vars found"

echo ""
log "📋 Local .env File:"
if [[ -f ".env" ]]; then
    success ".env file exists"
    grep -E "(NEXT_PUBLIC|DOMAIN|SSL_EMAIL)" .env | head -10
else
    warning ".env file not found"
fi

echo ""
log "🧪 Testing URLs:"

# Test main website
if curl -k -s -o /dev/null -w "%{http_code}" https://localhost > /dev/null; then
    response_code=$(curl -k -s -o /dev/null -w "%{http_code}" https://localhost)
    if [[ "$response_code" == "200" ]]; then
        success "✅ Main website accessible (HTTP $response_code)"
    else
        warning "⚠️ Main website returns HTTP $response_code"
    fi
else
    warning "❌ Main website not accessible"
fi

# Test Next.js static files endpoint
if curl -k -s -o /dev/null -w "%{http_code}" https://localhost/_next/static/ > /dev/null; then
    response_code=$(curl -k -s -o /dev/null -w "%{http_code}" https://localhost/_next/static/)
    if [[ "$response_code" == "200" ]] || [[ "$response_code" == "404" ]]; then
        success "✅ Next.js static endpoint responding (HTTP $response_code)"
    else
        warning "❌ Next.js static endpoint returns HTTP $response_code (this causes 503 errors)"
    fi
else
    warning "❌ Next.js static endpoint not accessible"
fi

# Test favicon
if curl -k -s -o /dev/null -w "%{http_code}" https://localhost/favicon.svg > /dev/null; then
    response_code=$(curl -k -s -o /dev/null -w "%{http_code}" https://localhost/favicon.svg)
    if [[ "$response_code" == "200" ]]; then
        success "✅ Favicon accessible (HTTP $response_code)"
    else
        warning "⚠️ Favicon returns HTTP $response_code"
    fi
else
    warning "❌ Favicon not accessible"
fi

# Test image access
IMAGE_URL="https://api.locallytrip.com/images/logo.webp"
if curl -s -f "$IMAGE_URL" > /dev/null; then
    success "✅ Image URL accessible: $IMAGE_URL"
else
    warning "❌ Image URL not accessible: $IMAGE_URL"
fi

# Test internal web service
if docker compose -f docker-compose.prod.yml exec -T web curl -s -f http://localhost:3000 > /dev/null; then
    success "✅ Internal web service responding"
else
    warning "❌ Internal web service not responding (this causes 503 errors)"
fi

echo ""
log "🔐 SSL Certificate Info:"
if [[ -f "ssl/cert.pem" ]]; then
    success "SSL certificate exists"
    openssl x509 -in ssl/cert.pem -text -noout | grep -E "(Subject:|Issuer:|DNS:)" | head -5
else
    warning "SSL certificate not found"
fi

echo ""
log "📈 Recent Container Logs (last 20 lines):"
log "Web logs:"
docker compose -f docker-compose.prod.yml logs -n 20 web 2>/dev/null | tail -10 || warning "Cannot get web logs"

log "Backend logs:"
docker compose -f docker-compose.prod.yml logs -n 20 backend 2>/dev/null | tail -10 || warning "Cannot get backend logs"

log "Nginx logs:"
docker compose -f docker-compose.prod.yml logs -n 20 nginx 2>/dev/null | tail -10 || warning "Cannot get nginx logs"

echo ""
success "🎯 Debug completed! Check the output above for any issues."
