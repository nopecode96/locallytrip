#!/bin/bash

# LocallyTrip Quick Deploy and SSL Fix Script
# Usage: ./deploy-and-fix-ssl.sh

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log "🚀 LocallyTrip Deploy & SSL Fix"
log "=============================="

# Check if we're in the right directory
if [[ ! -f "docker-compose.prod.yml" ]]; then
    error "❌ docker-compose.prod.yml not found! Are you in the project directory?"
    exit 1
fi

# Check if .env exists
if [[ ! -f ".env" ]]; then
    if [[ -f ".env.production" ]]; then
        log "📋 Copying .env.production to .env..."
        cp .env.production .env
        success "✅ .env created from .env.production"
    else
        error "❌ Neither .env nor .env.production found!"
        log "Please create .env file with required variables"
        exit 1
    fi
fi

# Load environment
source .env

# Set default values if not provided
SSL_EMAIL=${SSL_EMAIL:-"admin@locallytrip.com"}
DOMAIN=${DOMAIN:-"locallytrip.com"}

log "📧 SSL Email: $SSL_EMAIL"
log "🌐 Domain: $DOMAIN"
log "🖼️ Images URL: ${NEXT_PUBLIC_IMAGES:-'Not set'}"
log "🔌 API URL: ${NEXT_PUBLIC_API_URL:-'Not set'}"

# Function to deploy and fix SSL
deploy_and_fix() {
    log "🛑 Stopping existing services..."
    docker compose -f docker-compose.prod.yml down || true
    
    log "🧹 Cleaning up old containers and images..."
    docker system prune -f
    
    log "🏗️ Building and starting services..."
    docker compose -f docker-compose.prod.yml up --build -d --remove-orphans
    
    log "⏳ Waiting for services to be ready..."
    sleep 30
    
    # Check if backend is healthy
    log "🏥 Checking backend health..."
    for i in {1..30}; do
        if docker compose -f docker-compose.prod.yml exec -T backend curl -f http://localhost:3001/health > /dev/null 2>&1; then
            success "✅ Backend is healthy!"
            break
        fi
        if [[ $i -eq 30 ]]; then
            error "❌ Backend failed to start properly"
            docker compose -f docker-compose.prod.yml logs backend
            exit 1
        fi
        sleep 2
    done
    
    log "🔒 Starting SSL setup..."
    
    # Make setup-ssl.sh executable
    chmod +x setup-ssl.sh
    
    # Run SSL setup with auto-fix
    ./setup-ssl.sh --auto-fix
    
    log "🧪 Testing final setup..."
    sleep 10
    
    # Test HTTP to HTTPS redirect
    if curl -s -o /dev/null -w "%{http_code}" http://localhost | grep -q "301\|302"; then
        success "✅ HTTP to HTTPS redirect working!"
    else
        warning "⚠️ HTTP redirect may not be working properly"
    fi
    
    # Test HTTPS (with self-signed certificate acceptance)
    if curl -k -s -o /dev/null -w "%{http_code}" https://localhost | grep -q "200"; then
        success "✅ HTTPS is responding!"
    else
        warning "⚠️ HTTPS may not be working properly"
    fi
    
    # Show service status
    log "📊 Service Status:"
    docker compose -f docker-compose.prod.yml ps
    
    # Show SSL certificate info
    log "🔍 SSL Certificate Info:"
    if [[ -f "ssl/cert.pem" ]]; then
        openssl x509 -in ssl/cert.pem -text -noout | grep -E "(Subject:|Issuer:|Not Before:|Not After:|DNS:)" || true
    fi
}

# Function to show helpful information
show_info() {
    echo ""
    success "🎉 Deployment completed!"
    echo ""
    log "📝 Access URLs:"
    log "   🌐 Main Website: https://$DOMAIN"
    log "   👑 Admin Panel: https://admin.$DOMAIN"
    log "   🔌 API: https://api.$DOMAIN"
    echo ""
    log "📊 Useful Commands:"
    log "   📋 Check logs: docker compose -f docker-compose.prod.yml logs -f [service]"
    log "   🔄 Restart: docker compose -f docker-compose.prod.yml restart [service]"
    log "   📈 Status: docker compose -f docker-compose.prod.yml ps"
    echo ""
    
    if [[ -f "ssl/cert.pem" ]]; then
        # Check if it's self-signed
        if openssl x509 -in ssl/cert.pem -text -noout | grep -q "Issuer: C = US, ST = State"; then
            warning "⚠️ Using self-signed certificates!"
            log "💡 To get trusted certificates:"
            log "   1. Ensure domain points to server IP"
            log "   2. Run: ./setup-ssl.sh and choose option 2"
        else
            success "✅ Using trusted SSL certificates!"
        fi
    fi
    
    echo ""
    log "🧪 Test SSL setup:"
    log "   curl -k https://$DOMAIN/health"
    log "   curl https://$DOMAIN (should work if using trusted certs)"
}

# Main execution
log "Starting deployment process..."

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --help|-h)
            echo "Usage: $0 [options]"
            echo "Options:"
            echo "  --help, -h          Show this help"
            echo "  --ssl-only          Only fix SSL, don't redeploy"
            exit 0
            ;;
        --ssl-only)
            log "🔒 SSL-only mode selected"
            chmod +x setup-ssl.sh
            ./setup-ssl.sh --auto-fix
            exit 0
            ;;
        *)
            error "Unknown option: $1"
            exit 1
            ;;
    esac
    shift
done

# Execute deployment
deploy_and_fix
show_info

log "✨ Deploy and SSL fix completed successfully!"
