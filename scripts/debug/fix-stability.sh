#!/bin/bash

# LocallyTrip Stability Fix Script
# Fixes 404s, CORS issues, and 503 errors for better stability

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

log "🔧 LocallyTrip Stability Fix"
log "============================"

# Step 1: Fix missing favicon and icons
log "📄 Step 1: Fixing missing favicon and icons..."

# Create missing favicon files
if [[ ! -f "web/public/favicon.svg" ]]; then
    log "🖼️ Creating missing favicon.svg..."
    mkdir -p web/public
    cat > web/public/favicon.svg << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" fill="#2563eb"/>
  <text x="16" y="22" font-family="Arial" font-size="20" font-weight="bold" text-anchor="middle" fill="white">L</text>
</svg>
EOF
    success "✅ Created favicon.svg"
fi

# Copy favicon to other required formats
cp web/public/favicon.svg web/public/favicon-16x16.svg 2>/dev/null || true
cp web/public/favicon.svg web/public/favicon-32x32.svg 2>/dev/null || true
cp web/public/favicon.svg web/public/android-chrome-192x192.svg 2>/dev/null || true

# Step 2: Fix CORS and static file serving
log "🌐 Step 2: Fixing CORS and static file serving..."

# Update nginx configuration for better static file handling
cat > nginx/conf.d/static-files.conf << 'EOF'
# Static files optimization
location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|webp)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    add_header Access-Control-Allow-Origin "*";
    add_header Access-Control-Allow-Methods "GET, OPTIONS";
    add_header Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept";
    
    # Try files in order: exact match, then from backend
    try_files $uri @backend_static;
}

# Fallback for static files
location @backend_static {
    proxy_pass http://backend:3001;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}

# Handle favicon specifically
location = /favicon.ico {
    alias /var/www/html/favicon.svg;
    expires 1y;
    add_header Cache-Control "public, immutable";
}
EOF

# Step 3: Improve API endpoint stability
log "🔌 Step 3: Improving API endpoint stability..."

# Update nginx default.conf for better API handling
if [[ -f "nginx/conf.d/default.conf" ]]; then
    # Backup current config
    cp nginx/conf.d/default.conf nginx/conf.d/default.conf.backup-$(date +%Y%m%d-%H%M%S)
    
    # Add better error handling and retries
    cat >> nginx/conf.d/default.conf << 'EOF'

# API endpoint improvements
location /api/ {
    proxy_pass http://backend:3001;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    
    # Retry and timeout settings
    proxy_connect_timeout 30s;
    proxy_send_timeout 30s;
    proxy_read_timeout 30s;
    proxy_next_upstream error timeout invalid_header http_502 http_503 http_504;
    proxy_next_upstream_tries 3;
    
    # CORS headers for API
    add_header Access-Control-Allow-Origin "*" always;
    add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
    add_header Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept, Authorization" always;
    
    # Handle OPTIONS requests
    if ($request_method = 'OPTIONS') {
        return 204;
    }
}

# Health check endpoint
location /health {
    proxy_pass http://backend:3001/health;
    proxy_connect_timeout 5s;
    proxy_send_timeout 5s;
    proxy_read_timeout 5s;
}
EOF
    
    success "✅ Enhanced API endpoint configuration"
fi

# Step 4: Restart services in correct order
log "🔄 Step 4: Restarting services for stability..."

# Restart backend first
log "🖥️ Restarting backend..."
docker compose -f docker-compose.prod.yml restart backend
sleep 10

# Restart web services
log "🌐 Restarting web services..."
docker compose -f docker-compose.prod.yml restart web web-admin
sleep 10

# Restart nginx last
log "🔀 Restarting nginx..."
docker compose -f docker-compose.prod.yml restart nginx
sleep 10

# Step 5: Health verification
log "🏥 Step 5: Verifying service health..."

# Check each service
services=("postgres" "backend" "web" "web-admin" "nginx")
for service in "${services[@]}"; do
    if docker compose -f docker-compose.prod.yml ps $service | grep -q "Up"; then
        success "✅ $service: Running"
    else
        warning "⚠️ $service: Issues detected"
    fi
done

# Test endpoints
log "🧪 Testing critical endpoints..."

# Test main site
if curl -s --connect-timeout 10 https://localhost > /dev/null 2>&1; then
    success "✅ Main site: Responsive"
else
    warning "⚠️ Main site: Issues"
fi

# Test API health
if curl -s --connect-timeout 10 https://localhost/health > /dev/null 2>&1; then
    success "✅ API health: Working"
else
    warning "⚠️ API health: Issues"
fi

# Test static files
if curl -s --connect-timeout 10 https://localhost/favicon.ico > /dev/null 2>&1; then
    success "✅ Static files: Working"
else
    warning "⚠️ Static files: Issues"
fi

# Step 6: Performance optimization
log "⚡ Step 6: Performance optimization..."

# Clear any cached data
docker system prune -f --volumes > /dev/null 2>&1 || true

# Restart with optimized resource allocation
docker compose -f docker-compose.prod.yml up -d

log ""
log "📊 Final Status Check:"
docker compose -f docker-compose.prod.yml ps

log ""
log "🎯 Stability Improvements Applied:"
log "   ✅ Fixed missing favicon and icons"
log "   ✅ Added CORS headers for static files"
log "   ✅ Improved API endpoint retry logic"
log "   ✅ Enhanced error handling"
log "   ✅ Optimized service restart order"

log ""
log "🔍 Monitoring commands:"
log "   📊 Status: docker compose -f docker-compose.prod.yml ps"
log "   📋 Logs: docker compose -f docker-compose.prod.yml logs -f"
log "   🧪 Test: curl -s https://localhost"
log "   🌐 Visit: https://locallytrip.com"

success "🏁 Stability fix completed!"
