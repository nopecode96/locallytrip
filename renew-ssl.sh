#!/bin/bash
# Auto-renewal script for SSL certificates

log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

log "🔄 Starting SSL certificate renewal..."

# Renew certificates
docker compose -f docker-compose.prod.ssl.yml --profile ssl-setup run --rm certbot renew

# Copy renewed certificates
if [[ -d "/etc/letsencrypt/live/locallytrip.com" ]]; then
    log "📋 Copying renewed certificates..."
    sudo cp /etc/letsencrypt/live/locallytrip.com/fullchain.pem ssl/cert.pem
    sudo cp /etc/letsencrypt/live/locallytrip.com/privkey.pem ssl/key.pem
    sudo chown $(whoami):$(whoami) ssl/cert.pem ssl/key.pem
    chmod 644 ssl/cert.pem
    chmod 600 ssl/key.pem
    
    log "🔄 Reloading nginx..."
    docker compose -f docker-compose.prod.ssl.yml exec nginx nginx -s reload
    
    log "✅ Certificate renewal completed"
else
    log "❌ Certificate renewal failed"
    exit 1
fi
