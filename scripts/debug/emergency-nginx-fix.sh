#!/bin/bash

# Emergency Nginx Config Fix
# Fixes corrupted nginx configuration

set -e

log() {
    echo "[$(date +'%H:%M:%S')] $1"
}

log "🆘 Emergency Nginx Config Fix"
log "============================"

log "🔧 Creating clean nginx configuration..."

# Backup current broken config
cp nginx/conf.d/default.conf nginx/conf.d/default.conf.broken-backup-$(date +%Y%m%d-%H%M%S)

# Create clean working configuration
cat > nginx/conf.d/default.conf << 'EOF'
# LocallyTrip Production Server Configuration
# Clean version without corruption

# Upstream definitions for load balancing
upstream web_backend {
    server web:3000 max_fails=3 fail_timeout=30s;
    keepalive 32;
    keepalive_requests 1000;
    keepalive_timeout 60s;
}

upstream admin_backend {
    server web-admin:3000 max_fails=3 fail_timeout=30s;
    keepalive 32;
    keepalive_requests 1000;
    keepalive_timeout 60s;
}

upstream api_backend {
    server backend:3001 max_fails=3 fail_timeout=30s;
    keepalive 32;
    keepalive_requests 1000;
    keepalive_timeout 60s;
}

# Rate limiting zones
limit_req_zone $binary_remote_addr zone=general:10m rate=10r/s;
limit_conn_zone $binary_remote_addr zone=conn_limit_per_ip:10m;

# HTTP to HTTPS redirect
server {
    listen 80;
    server_name locallytrip.com www.locallytrip.com api.locallytrip.com admin.locallytrip.com _;
    
    # Health check for load balancer (without SSL redirect)
    location /health {
        proxy_pass http://api_backend/health;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_Set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        access_log off;
    }
    
    # ACME challenge for Let's Encrypt
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
        try_files $uri =404;
    }
    
    # All other traffic redirect to HTTPS
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS Server Configuration
server {
    listen 443 ssl http2;
    server_name locallytrip.com www.locallytrip.com;
    
    # SSL Configuration
    ssl_certificate /etc/ssl/certs/cert.pem;
    ssl_certificate_key /etc/ssl/private/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:50m;
    ssl_session_timeout 1d;
    ssl_session_tickets off;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=63072000" always;
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # Rate limiting
    limit_req zone=general burst=20 nodelay;
    limit_conn conn_limit_per_ip 10;
    
    # Root location - main web app
    location / {
        proxy_pass http://web_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Static files with CORS
    location /images/ {
        proxy_pass http://api_backend/images/;
        proxy_set_header Host $host;
        proxy_Set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Caching for static files
        expires 1h;
        add_header Cache-Control "public";
        
        # CORS for images
        add_header Access-Control-Allow-Origin "*" always;
        add_header Access-Control-Allow-Methods "GET, HEAD, OPTIONS" always;
        add_header Cross-Origin-Resource-Policy "cross-origin" always;
        
        access_log off;
    }
    
    # API routes
    location /api/ {
        proxy_pass http://api_backend/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_Set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_Set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 60s;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        
        # CORS headers for API
        add_header Access-Control-Allow-Origin "*" always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept, Authorization" always;
        
        # Handle preflight requests
        if ($request_method = 'OPTIONS') {
            return 204;
        }
    }
    
    # Health check
    location /health {
        proxy_pass http://api_backend/health;
        access_log off;
    }
}

# API subdomain
server {
    listen 443 ssl http2;
    server_name api.locallytrip.com;
    
    # SSL Configuration
    ssl_certificate /etc/ssl/certs/cert.pem;
    ssl_certificate_key /etc/ssl/private/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:50m;
    ssl_session_timeout 1d;
    ssl_session_tickets off;
    
    # Rate limiting
    limit_req zone=general burst=20 nodelay;
    limit_conn conn_limit_per_ip 10;
    
    # All API traffic
    location / {
        proxy_pass http://api_backend/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_Set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_Set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 60s;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        
        # CORS headers for API
        add_header Access-Control-Allow-Origin "*" always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept, Authorization" always;
        
        # Handle preflight requests
        if ($request_method = 'OPTIONS') {
            return 204;
        }
    }
}

# Admin subdomain
server {
    listen 443 ssl http2;
    server_name admin.locallytrip.com;
    
    # SSL Configuration
    ssl_certificate /etc/ssl/certs/cert.pem;
    ssl_certificate_key /etc/ssl/private/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:50m;
    ssl_session_timeout 1d;
    ssl_session_tickets off;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=63072000" always;
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # Rate limiting
    limit_req zone=general burst=20 nodelay;
    limit_conn conn_limit_per_ip 10;
    
    # Admin interface
    location / {
        proxy_pass http://admin_backend;
        proxy_http_version 1.1;
        proxy_Set_header Upgrade $http_upgrade;
        proxy_Set_header Connection 'upgrade';
        proxy_Set_header Host $host;
        proxy_Set_header X-Real-IP $remote_addr;
        proxy_Set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_Set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
EOF

log "✅ Created clean nginx configuration"

log "🔄 Restarting nginx with clean config..."
docker compose -f docker-compose.prod.yml restart nginx

log "⏳ Waiting for nginx to start..."
sleep 15

# Check nginx status
if docker compose -f docker-compose.prod.yml ps nginx | grep -q "Up"; then
    log "✅ Nginx is now running!"
    
    # Test connectivity
    if curl -k -s --connect-timeout 10 https://localhost > /dev/null 2>&1; then
        log "🎉 HTTPS is working!"
    else
        log "⚠️ HTTPS may need a moment more"
    fi
else
    log "❌ Nginx still not running. Check logs:"
    docker compose -f docker-compose.prod.yml logs nginx --tail=10
fi

log "📊 Final status:"
docker compose -f docker-compose.prod.yml ps

log "🏁 Emergency nginx fix completed!"
EOF

chmod +x emergency-nginx-fix.sh

log "✅ Created emergency nginx fix script"
log "🚀 Running fix now..."

./emergency-nginx-fix.sh
