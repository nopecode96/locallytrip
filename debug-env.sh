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
log "🧪 Testing Image URLs:"

# Test image access
IMAGE_URL="https://api.locallytrip.com/images/logo.webp"
if curl -s -f "$IMAGE_URL" > /dev/null; then
    success "✅ Image URL accessible: $IMAGE_URL"
else
    warning "❌ Image URL not accessible: $IMAGE_URL"
fi

# Test local image access
LOCAL_IMAGE_URL="http://localhost:3001/images/logo.webp"
if curl -s -f "$LOCAL_IMAGE_URL" > /dev/null; then
    success "✅ Local image URL accessible: $LOCAL_IMAGE_URL"
else
    warning "❌ Local image URL not accessible: $LOCAL_IMAGE_URL"
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
