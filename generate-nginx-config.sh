#!/bin/bash

# Generate Nginx Server Configuration Script - Fixed Version
# This script creates nginx server blocks with correct upstream names

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log "🔧 Generating Nginx server configuration (Fixed Version)..."

# Check if environment file exists
if [[ ! -f ".env" ]]; then
    error "❌ .env file not found!"
    exit 1
fi

# Load environment
source .env

# Set default domain if not provided
DOMAIN=${DOMAIN:-"localhost"}
log "🌐 Configuring for domain: $DOMAIN"

# Create nginx configuration directory if it doesn't exist
mkdir -p nginx/conf.d

# Create nginx server configuration
cat > nginx/conf.d/default.conf << 'EOF'
# LocallyTrip Production Server Configuration
# Fixed version with correct upstream names

# Upstream definitions for load balancing
upstream web_backend {
    server web:3000;
    keepalive 32;
}

upstream admin_backend {
    server web-admin:3000;
    keepalive 32;
}

upstream api_backend {
    server backend:3001;
    keepalive 32;
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
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        access_log off;
    }
    
    # ACME challenge for Let's Encrypt
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
        try_files $uri =404;
    }
    
    # Redirect all other HTTP traffic to HTTPS
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# Main Website (Frontend)
server {
    listen 443 ssl http2;
    server_name locallytrip.com www.locallytrip.com;
    
    # SSL Configuration
    ssl_certificate /etc/ssl/certs/cert.pem;
    ssl_certificate_key /etc/ssl/private/key.pem;
    
    # Security Headers
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # Rate limiting
    limit_req zone=general burst=20 nodelay;
    limit_conn conn_limit_per_ip 10;
    
    # Frontend proxy
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
        proxy_read_timeout 86400;
    }
    
    # Health check endpoint
    location /health {
        proxy_pass http://api_backend/health;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        access_log off;
    }
    
    # Next.js static files
    location /_next/static/ {
        proxy_pass http://web_backend;
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }
}

# Admin Dashboard
server {
    listen 443 ssl http2;
    server_name admin.locallytrip.com;
    
    # SSL Configuration
    ssl_certificate /etc/ssl/certs/cert.pem;
    ssl_certificate_key /etc/ssl/private/key.pem;
    
    # Security Headers
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # Rate limiting
    limit_req zone=general burst=20 nodelay;
    limit_conn conn_limit_per_ip 10;
    
    # Admin dashboard proxy
    location / {
        proxy_pass http://admin_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }
    
    # Admin static files
    location /_next/static/ {
        proxy_pass http://admin_backend;
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }
}

# API Server
server {
    listen 443 ssl http2;
    server_name api.locallytrip.com;
    
    # SSL Configuration
    ssl_certificate /etc/ssl/certs/cert.pem;
    ssl_certificate_key /etc/ssl/private/key.pem;
    
    # Security Headers
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    
    # API Rate limiting (more restrictive)
    limit_req zone=general burst=10 nodelay;
    limit_conn conn_limit_per_ip 5;
    
    # API endpoints
    location / {
        proxy_pass http://api_backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 60s;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        
        # CORS headers for API
        add_header Access-Control-Allow-Origin "https://locallytrip.com" always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept, Authorization" always;
        add_header Access-Control-Allow-Credentials "true" always;
        
        # Handle preflight requests
        if ($request_method = 'OPTIONS') {
            return 204;
        }
    }
    
    # Health check endpoint
    location /health {
        proxy_pass http://api_backend/health;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        access_log off;
    }
    
    # Static files (images, uploads)
    location /images/ {
        proxy_pass http://api_backend/images/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Caching for static files
        expires 1h;
        add_header Cache-Control "public";
        
        # CORS for images
        add_header Access-Control-Allow-Origin "*" always;
        access_log off;
    }
    
    # Uploads
    location /uploads/ {
        proxy_pass http://api_backend/uploads/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # CORS for uploads
        add_header Access-Control-Allow-Origin "https://locallytrip.com" always;
        access_log off;
    }
}

# Fallback for any unmatched domains (security)
server {
    listen 80 default_server;
    listen 443 ssl default_server;
    server_name _;
    
    # SSL Configuration (for HTTPS requests to unknown domains)
    ssl_certificate /etc/ssl/certs/cert.pem;
    ssl_certificate_key /etc/ssl/private/key.pem;
    
    # Return 444 (no response) for unmatched domains
    return 444;
}
EOF

success "✅ Nginx server configuration generated for domain: $DOMAIN"
log "📄 Configuration saved to: nginx/conf.d/default.conf"

log "🔄 Next steps:"
log "1. Ensure DNS records point to this server:"
log "   $DOMAIN → Server IP"
log "   www.$DOMAIN → Server IP"
log "   api.$DOMAIN → Server IP"
log "   admin.$DOMAIN → Server IP"
log "2. Run: ./setup-ssl.sh to configure SSL certificates"
log "3. Test nginx config: docker run --rm -v \$(pwd)/nginx/conf.d:/etc/nginx/conf.d nginx:1.24-alpine nginx -t"
log "4. Deploy: docker compose -f docker-compose.prod.yml up -d nginx"
