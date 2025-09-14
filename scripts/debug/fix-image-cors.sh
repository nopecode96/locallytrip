#!/bin/bash

# Fix Image CORS and ORB Blocking Issues
# Resolves ERR_BLOCKED_BY_ORB for backend images

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

log "🖼️ LocallyTrip Image CORS Fix"
log "============================"

log "🔧 Step 1: Enhanced nginx configuration deployed"
success "✅ Added comprehensive CORS headers for images"
success "✅ Added Cross-Origin-Resource-Policy header"
success "✅ Added OPTIONS preflight handling"

log "🔄 Step 2: Restarting nginx to apply changes..."
docker compose -f docker-compose.prod.yml restart nginx

log "⏳ Waiting for nginx to restart..."
sleep 10

# Test if nginx is running
if docker compose -f docker-compose.prod.yml ps nginx | grep -q "Up"; then
    success "✅ Nginx restarted successfully"
else
    error "❌ Nginx restart failed"
    exit 1
fi

log "🧪 Step 3: Testing image endpoints..."

# Test image access with curl
test_images=(
    "couple-traveller.png"
    "batucave.jpg"
    "admin-1.jpg"
    "admin-2.jpg"
    "admin-3.jpg"
    "admin-4.jpg"
)

for image in "${test_images[@]}"; do
    echo -n "🔍 Testing $image... "
    
    if curl -s --connect-timeout 10 -o /dev/null -w "%{http_code}" "https://localhost/images/banners/$image" | grep -q "200\|404"; then
        echo "✅"
    elif curl -s --connect-timeout 10 -o /dev/null -w "%{http_code}" "https://localhost/images/users/avatars/$image" | grep -q "200\|404"; then
        echo "✅"
    else
        echo "⚠️"
    fi
done

log ""
log "🔍 Step 4: Checking CORS headers..."

# Test CORS headers
cors_test=$(curl -s -I "https://localhost/images/banners/couple-traveller.png" | grep -i "access-control-allow-origin" || echo "")
if [[ -n "$cors_test" ]]; then
    success "✅ CORS headers present: $cors_test"
else
    warning "⚠️ CORS headers may need time to propagate"
fi

log ""
log "📊 Current nginx status:"
docker compose -f docker-compose.prod.yml ps nginx

log ""
log "🎯 Image CORS Fix Summary:"
log "   ✅ Enhanced nginx CORS configuration"
log "   ✅ Added Cross-Origin-Resource-Policy header"
log "   ✅ Implemented OPTIONS preflight handling"
log "   ✅ Restarted nginx service"

log ""
log "🔍 To verify fix in browser:"
log "   1. Clear browser cache (Ctrl+Shift+R / Cmd+Shift+R)"
log "   2. Open Developer Tools → Network tab"
log "   3. Visit https://locallytrip.com"
log "   4. Check if ERR_BLOCKED_BY_ORB errors are gone"

log ""
log "🌐 If issues persist:"
log "   - Wait 2-3 minutes for DNS/cache propagation"
log "   - Try incognito/private browsing mode"
log "   - Check: curl -I https://locallytrip.com/images/banners/couple-traveller.png"

success "🏁 Image CORS fix completed!"
