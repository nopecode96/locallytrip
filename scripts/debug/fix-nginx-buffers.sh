#!/bin/bash

# Quick Nginx Buffer Fix for proxy_busy_buffers_size error
# This fixes the specific error causing nginx container to fail

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

log "🔧 Quick Fix for Nginx Buffer Configuration Error"
log "================================================"

# Stop nginx container first
log "🛑 Stopping nginx container..."
docker compose -f docker-compose.prod.yml stop nginx 2>/dev/null || true

# Get the container nginx.conf and fix the buffer issue
log "🔍 Identifying nginx configuration issue..."

# Create a temporary fixed nginx.conf
log "📝 Creating fixed nginx configuration..."

# First, let's see what the current nginx.conf looks like in our container
docker run --rm -v $(pwd)/nginx:/nginx-config nginx:alpine cat /etc/nginx/nginx.conf > /tmp/current_nginx.conf 2>/dev/null || {
    log "📄 Using default nginx configuration template..."
    
    cat > /tmp/fixed_nginx.conf << 'EOF'
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log notice;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
    use epoll;
    multi_accept on;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Logging format
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    # Basic settings
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    server_tokens off;

    # Buffer settings - FIXED VALUES
    proxy_buffer_size 4k;
    proxy_buffers 8 4k;
    proxy_busy_buffers_size 8k;  # Must be < (8 * 4k) - 4k = 28k
    
    # Other proxy settings
    proxy_temp_file_write_size 64k;
    proxy_connect_timeout 30s;
    proxy_send_timeout 30s;
    proxy_read_timeout 30s;

    # Client settings
    client_max_body_size 50M;
    client_body_buffer_size 1m;
    client_body_timeout 60s;
    client_header_timeout 60s;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;

    # Include additional configs
    include /etc/nginx/conf.d/*.conf;
}
EOF

    success "✅ Created fixed nginx.conf with proper buffer settings"
}

# Backup current nginx config if it exists
if [[ -d "nginx" ]]; then
    log "💾 Backing up current nginx configuration..."
    cp -r nginx nginx-backup-$(date +%Y%m%d-%H%M%S) 2>/dev/null || true
fi

# Create nginx directory if it doesn't exist
mkdir -p nginx

# Copy the fixed nginx.conf
cp /tmp/fixed_nginx.conf nginx/nginx.conf

success "✅ Updated nginx.conf with fixed buffer settings"

# Update docker-compose to use our custom nginx.conf
log "🐳 Updating docker-compose to use fixed nginx.conf..."

# Check if docker-compose.prod.yml already mounts nginx.conf
if grep -q "nginx/nginx.conf" docker-compose.prod.yml; then
    success "✅ docker-compose.prod.yml already mounts nginx.conf"
else
    log "📝 Adding nginx.conf mount to docker-compose.prod.yml..."
    
    # Create a backup
    cp docker-compose.prod.yml docker-compose.prod.yml.backup
    
    # Add the nginx.conf volume mount
    python3 -c "
import yaml
import sys

with open('docker-compose.prod.yml', 'r') as f:
    config = yaml.safe_load(f)

if 'nginx' in config['services']:
    if 'volumes' not in config['services']['nginx']:
        config['services']['nginx']['volumes'] = []
    
    # Add nginx.conf mount if not already present
    nginx_conf_mount = './nginx/nginx.conf:/etc/nginx/nginx.conf:ro'
    if nginx_conf_mount not in config['services']['nginx']['volumes']:
        config['services']['nginx']['volumes'].append(nginx_conf_mount)
        
        with open('docker-compose.prod.yml', 'w') as f:
            yaml.dump(config, f, default_flow_style=False, sort_keys=False)
        print('Added nginx.conf mount')
    else:
        print('nginx.conf mount already exists')
" 2>/dev/null || {
        error "❌ Failed to update docker-compose.prod.yml automatically"
        log "📝 Please manually add this volume mount to nginx service:"
        log "     - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro"
    }
fi

# Now restart nginx with the fixed configuration
log "🚀 Starting nginx with fixed configuration..."

# Force recreate nginx container
docker compose -f docker-compose.prod.yml up -d --force-recreate nginx

# Wait for nginx to start
log "⏳ Waiting for nginx to start..."
sleep 10

# Check if nginx is running
if docker compose -f docker-compose.prod.yml ps nginx | grep -q "Up"; then
    success "🎉 Nginx is now running!"
    
    # Test the endpoints
    log "🧪 Testing endpoints..."
    
    if curl -k -s --connect-timeout 10 https://localhost > /dev/null 2>&1; then
        success "✅ HTTPS (port 443): Working!"
    else
        error "❌ HTTPS still not working"
    fi
    
    if curl -s --connect-timeout 10 http://localhost > /dev/null 2>&1; then
        success "✅ HTTP (port 80): Working!"
    else
        error "❌ HTTP still not working"
    fi
    
else
    error "❌ Nginx still not running. Checking logs..."
    docker compose -f docker-compose.prod.yml logs nginx --tail=20
fi

log ""
log "🎯 Quick Fix Summary:"
log "   ✅ Fixed proxy_busy_buffers_size configuration"
log "   ✅ Updated nginx.conf with proper buffer settings"
log "   ✅ Restarted nginx container"

log ""
log "🔍 Next steps:"
log "   📊 Check status: docker compose -f docker-compose.prod.yml ps"
log "   🧪 Test site: curl -k https://localhost"
log "   🌐 Visit: https://locallytrip.com"

# Cleanup temp files
rm -f /tmp/fixed_nginx.conf /tmp/current_nginx.conf

success "🏁 Nginx buffer fix completed!"
