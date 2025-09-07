#!/bin/bash

# Emergency Check and Fix for LocallyTrip Server
# When curl fails to connect to port 443

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

log "🆘 Emergency Server Check & Fix"
log "=============================="

log "🔍 Step 1: Quick system check..."

# Check if we're in the right directory
if [[ ! -f "docker-compose.prod.yml" ]]; then
    error "❌ Not in LocallyTrip directory!"
    exit 1
fi

# Check Docker service
if ! systemctl is-active --quiet docker; then
    warning "⚠️ Docker service not running, starting..."
    sudo systemctl start docker
    sleep 5
fi

log "📊 Step 2: Container status check..."
docker compose -f docker-compose.prod.yml ps

log ""
log "🔌 Step 3: Port check..."

# Check if ports are listening
check_port() {
    local port=$1
    local service=$2
    
    if ss -tlnp | grep -q ":$port "; then
        success "✅ Port $port ($service): Listening"
    else
        error "❌ Port $port ($service): NOT listening"
        return 1
    fi
}

ports_down=0

check_port 80 "HTTP" || ports_down=$((ports_down + 1))
check_port 443 "HTTPS" || ports_down=$((ports_down + 1))
check_port 3001 "Backend" || ports_down=$((ports_down + 1))

if [[ $ports_down -gt 0 ]]; then
    warning "⚠️ $ports_down critical ports are down!"
    
    log "🔄 Step 4: Emergency restart sequence..."
    
    # Pull latest changes first
    log "📥 Pulling latest changes..."
    git pull origin main || true
    
    # Stop all containers
    log "🛑 Stopping all containers..."
    docker compose -f docker-compose.prod.yml down || true
    
    # Clean up any orphaned containers
    log "🧹 Cleaning up..."
    docker system prune -f || true
    
    # Start services in order
    log "🚀 Starting services in optimal order..."
    
    docker compose -f docker-compose.prod.yml up -d postgres
    sleep 15
    
    docker compose -f docker-compose.prod.yml up -d backend
    sleep 15
    
    docker compose -f docker-compose.prod.yml up -d web web-admin
    sleep 10
    
    docker compose -f docker-compose.prod.yml up -d nginx
    sleep 10
    
    log "⏳ Waiting for services to stabilize..."
    sleep 20
    
else
    success "✅ All critical ports are listening"
    
    log "🔄 Step 4: Gentle restart (services are up but may have issues)..."
    docker compose -f docker-compose.prod.yml restart nginx
    sleep 10
fi

log ""
log "📊 Step 5: Final status check..."
docker compose -f docker-compose.prod.yml ps

log ""
log "🧪 Step 6: Connectivity test..."

# Test local connections
echo -n "🔍 Testing HTTP (80): "
if curl -s --connect-timeout 5 http://localhost > /dev/null 2>&1; then
    echo "✅"
else
    echo "❌"
fi

echo -n "🔍 Testing HTTPS (443): "
if curl -k -s --connect-timeout 5 https://localhost > /dev/null 2>&1; then
    echo "✅"
else
    echo "❌"
fi

echo -n "🔍 Testing Backend (3001): "
if curl -s --connect-timeout 5 http://localhost:3001/health > /dev/null 2>&1; then
    echo "✅"
else
    echo "❌"
fi

# Test external domain (if accessible)
echo -n "🔍 Testing External Domain: "
if curl -k -s --connect-timeout 10 https://locallytrip.com > /dev/null 2>&1; then
    echo "✅"
    success "🎉 Domain is accessible!"
else
    echo "❌"
    warning "⚠️ Domain may need a few moments to respond"
fi

log ""
log "📋 Emergency Fix Summary:"
if [[ $ports_down -gt 0 ]]; then
    log "   🚨 Performed emergency restart"
    log "   ✅ Restarted all services in optimal order"
else
    log "   🔄 Performed gentle nginx restart"
fi

log "   📊 Check status: docker compose -f docker-compose.prod.yml ps"
log "   🧪 Test site: curl -k https://locallytrip.com"
log "   📋 Check logs: docker compose -f docker-compose.prod.yml logs -f nginx"

log ""
if curl -k -s --connect-timeout 5 https://localhost > /dev/null 2>&1; then
    success "🎉 Server is responding! Try https://locallytrip.com now"
else
    warning "⚠️ Server may need 1-2 more minutes to fully start"
    log "💡 Run: docker compose -f docker-compose.prod.yml logs -f nginx"
fi

success "🏁 Emergency fix completed!"
