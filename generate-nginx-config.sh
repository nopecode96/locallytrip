#!/bin/bash

# Generate Nginx Server Configuration Script
# This script creates nginx server blocks based on environment variables

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

log "🔧 Generating Nginx server configuration..."

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

# Create nginx server configuration
cat > nginx/conf.d/default.conf << EOF
# LocallyTrip Production Server Configuration
# Generated for domain: $DOMAIN

# HTTP to HTTPS redirect
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN api.$DOMAIN admin.$DOMAIN;
    
    # ACME challenge for Let's Encrypt
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
        try_files \$uri =404;
    }
    
    # Redirect all other HTTP traffic to HTTPS
    location / {
        return 301 https://\$server_name\$request_uri;
    }
}

# Main Website (Frontend)
server {
    listen 443 ssl http2;
    server_name $DOMAIN www.$DOMAIN;
    
    # SSL Configuration
    ssl_certificate /etc/ssl/certs/cert.pem;
    ssl_certificate_key /etc/ssl/private/key.pem;
    
    # Security Headers
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https:; font-src 'self' https:; connect-src 'self' https: wss:; media-src 'self' https:;" always;
    
    # Rate limiting
    limit_req zone=general burst=20 nodelay;
    limit_conn conn_limit_per_ip 10;
    
    # Frontend proxy
    location / {
        proxy_pass http://web:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 86400;
    }
    
    # Health check endpoint
    location /health {
        proxy_pass http://backend:3001/health;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}

# Admin Dashboard
server {
    listen 443 ssl http2;
    server_name admin.$DOMAIN;
    
    # SSL Configuration
    ssl_certificate /etc/ssl/certs/cert.pem;
    ssl_certificate_key /etc/ssl/private/key.pem;
    
    # Security Headers
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https:; font-src 'self' https:; connect-src 'self' https: wss:;" always;
    
    # Rate limiting
    limit_req zone=general burst=20 nodelay;
    limit_conn conn_limit_per_ip 10;
    
    # Admin dashboard proxy
    location / {
        proxy_pass http://web-admin:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 86400;
    }
}

# API Server
server {
    listen 443 ssl http2;
    server_name api.$DOMAIN;
    
    # SSL Configuration
    ssl_certificate /etc/ssl/certs/cert.pem;
    ssl_certificate_key /etc/ssl/private/key.pem;
    
    # Security Headers
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    
    # API Rate limiting (more restrictive)
    limit_req zone=api burst=10 nodelay;
    limit_conn conn_limit_per_ip 5;
    
    # API endpoints
    location /api {
        proxy_pass http://backend:3001;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_read_timeout 60s;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        
        # CORS headers for API
        add_header Access-Control-Allow-Origin "https://$DOMAIN" always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept, Authorization" always;
        add_header Access-Control-Allow-Credentials "true" always;
        
        # Handle preflight requests
        if (\$request_method = 'OPTIONS') {
            return 204;
        }
    }
    
    # Health check endpoint
    location /health {
        proxy_pass http://backend:3001/health;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
    
    # Static files (images, uploads)
    location /images {
        proxy_pass http://backend:3001/images;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # Caching for static files
        proxy_cache_valid 200 302 1h;
        proxy_cache_valid 404 1m;
        add_header X-Cache-Status \$upstream_cache_status;
        
        # CORS for images
        add_header Access-Control-Allow-Origin "*" always;
    }
    
    # Uploads
    location /uploads {
        proxy_pass http://backend:3001/uploads;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # CORS for uploads
        add_header Access-Control-Allow-Origin "https://$DOMAIN" always;
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

# Generate docker-compose override for nginx config
cat > docker-compose.nginx.yml << EOF
version: '3.8'

services:
  nginx:
    volumes:
      - ./nginx/nginx-prod-dynamic.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/conf.d/default.conf:/etc/nginx/conf.d/default.conf:ro
EOF

success "✅ Docker compose nginx override generated"
log "📄 Override saved to: docker-compose.nginx.yml"

log "🔄 Next steps:"
log "1. Ensure DNS records point to this server:"
log "   $DOMAIN → Server IP"
log "   www.$DOMAIN → Server IP"
log "   api.$DOMAIN → Server IP"  
log "   admin.$DOMAIN → Server IP"
log "2. Run: ./setup-ssl.sh to configure SSL certificates"
log "3. Run: ./deploy-ubuntu-server.sh to deploy with new configuration"
