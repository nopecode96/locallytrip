#!/bin/bash

# Simple Deploy Script for Nginx Buffer Fix
# This script will deploy the fixed nginx configuration and restart the services

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

log "🚀 LocallyTrip Nginx Buffer Fix Deployment"
log "=========================================="

# Step 1: Stop problematic nginx
log "🛑 Stopping problematic nginx container..."
docker compose -f docker-compose.prod.yml stop nginx 2>/dev/null || true

# Step 2: Remove the broken container
log "🗑️ Removing broken nginx container..."
docker compose -f docker-compose.prod.yml rm -f nginx 2>/dev/null || true

# Step 3: Verify fixed nginx.conf exists
if [[ -f "nginx/nginx.conf" ]]; then
    success "✅ Fixed nginx.conf found"
else
    error "❌ nginx/nginx.conf not found!"
    exit 1
fi

# Step 4: Start nginx with fixed configuration
log "🚀 Starting nginx with fixed configuration..."
docker compose -f docker-compose.prod.yml up -d nginx

# Step 5: Wait for nginx to start
log "⏳ Waiting for nginx to start..."
sleep 10

# Step 6: Check nginx status
if docker compose -f docker-compose.prod.yml ps nginx | grep -q "Up"; then
    success "🎉 Nginx is now running!"
else
    error "❌ Nginx failed to start. Checking logs..."
    docker compose -f docker-compose.prod.yml logs nginx --tail=20
    exit 1
fi

# Step 7: Test connectivity
log "🧪 Testing connectivity..."

# Test HTTP
if curl -s --connect-timeout 10 http://localhost > /dev/null 2>&1; then
    success "✅ HTTP (port 80): Working"
else
    warning "⚠️ HTTP (port 80): Not responding yet"
fi

# Test HTTPS
if curl -k -s --connect-timeout 10 https://localhost > /dev/null 2>&1; then
    success "✅ HTTPS (port 443): Working"
else
    warning "⚠️ HTTPS (port 443): Not responding yet"
fi

# Step 8: Show final status
log ""
log "📊 Final Container Status:"
docker compose -f docker-compose.prod.yml ps

log ""
log "🎯 Deployment Summary:"
log "   ✅ Fixed nginx buffer configuration"
log "   ✅ Deployed new nginx.conf"
log "   ✅ Restarted nginx container"

# Get external IP if possible
external_ip=$(curl -s --connect-timeout 5 ifconfig.me 2>/dev/null || echo "UNKNOWN")
if [[ "$external_ip" != "UNKNOWN" ]]; then
    log ""
    log "🌐 Test your site:"
    log "   🔗 https://locallytrip.com"
    log "   🧪 https://$external_ip"
    log "   🏠 https://localhost (local)"
else
    log ""
    log "🌐 Test your site:"
    log "   🔗 https://locallytrip.com"
    log "   🏠 https://localhost (local)"
fi

log ""
log "🔍 Monitoring commands:"
log "   📊 Status: docker compose -f docker-compose.prod.yml ps"
log "   📋 Logs: docker compose -f docker-compose.prod.yml logs -f nginx"
log "   🧪 Test: curl -k https://localhost"

success "🏁 Deployment completed successfully!"
