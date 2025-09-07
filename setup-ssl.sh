#!/bin/bash

# SSL Certificate Setup Script for LocallyTrip
# This script helps set up SSL certificates using Let's Encrypt

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

error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log "🔒 LocallyTrip SSL Certificate Setup"
log "=================================="

# Check if environment file exists
if [[ ! -f ".env" ]]; then
    error "❌ .env file not found!"
    log "Please copy .env.production to .env and configure it"
    exit 1
fi

# Load environment
source .env

# Validate required variables
if [[ -z "$SSL_EMAIL" ]]; then
    error "❌ SSL_EMAIL not set in environment file"
    exit 1
fi

if [[ -z "$DOMAIN" ]]; then
    error "❌ DOMAIN not set in environment file"
    log "Please set DOMAIN=your-domain.com in .env"
    exit 1
fi

log "📧 SSL Email: $SSL_EMAIL"
log "🌐 Domain: $DOMAIN"
log "🌐 Domains: locallytrip.com, www.locallytrip.com, api.locallytrip.com, admin.locallytrip.com"

# Function to generate self-signed certificates for testing
generate_self_signed() {
    log "🛠️ Generating self-signed certificates for testing..."
    
    # Remove existing ssl directory if it exists and is a directory
    if [[ -d ssl ]]; then
        log "🗑️ Removing existing ssl directory..."
        rm -rf ssl
    fi
    
    # Create SSL directory
    mkdir -p ssl
    
    # Generate private key
    openssl genrsa -out ssl/key.pem 2048
    
    # Generate certificate
    openssl req -new -x509 -key ssl/key.pem -out ssl/cert.pem -days 365 -subj "/C=US/ST=State/L=City/O=Organization/OU=OrgUnit/CN=locallytrip.com/emailAddress=$SSL_EMAIL"
    
    # Set permissions
    chmod 600 ssl/key.pem
    chmod 644 ssl/cert.pem
    
    success "✅ Self-signed certificates generated"
    warning "⚠️ These are self-signed certificates for testing only!"
    warning "⚠️ Browsers will show security warnings"
}

# Function to setup Let's Encrypt certificates
setup_letsencrypt() {
    log "🔒 Setting up Let's Encrypt certificates..."
    
    # First, generate temporary self-signed certificates for nginx to start
    log "🛠️ Generating temporary certificates..."
    
    # Remove existing ssl directory if it exists and is a directory
    if [[ -d ssl ]]; then
        log "🗑️ Removing existing ssl directory..."
        rm -rf ssl
    fi
    
    # Create fresh ssl directory
    mkdir -p ssl
    
    # Generate temporary certificates
    openssl genrsa -out ssl/key.pem 2048
    openssl req -new -x509 -key ssl/key.pem -out ssl/cert.pem -days 1 -subj "/C=US/ST=State/L=City/O=Organization/OU=OrgUnit/CN=locallytrip.com/emailAddress=$SSL_EMAIL"
    chmod 600 ssl/key.pem
    chmod 644 ssl/cert.pem
    
    # Start nginx with temporary certificates
    log "🚀 Starting nginx for certificate challenge..."
    docker compose -f docker-compose.prod.yml up -d nginx
    
    # Wait for nginx to be ready
    sleep 10
    
    # Install certbot if not available
    if ! command -v certbot &> /dev/null; then
        log "� Installing certbot..."
        sudo apt update
        sudo apt install -y certbot
    fi
    
    # Stop nginx temporarily for standalone certbot
    log "⏸️ Stopping nginx for certificate generation..."
    docker compose -f docker-compose.prod.yml stop nginx
    
    # Run certbot in standalone mode
    log "📜 Running certbot to obtain certificates for $DOMAIN..."
    if sudo certbot certonly --standalone --non-interactive --agree-tos --email "$SSL_EMAIL" --expand \
        -d "$DOMAIN" -d "www.$DOMAIN" -d "api.$DOMAIN" -d "admin.$DOMAIN"; then
        
        success "✅ Certbot completed successfully for $DOMAIN"
        
    elif [[ $? -eq 0 ]] || sudo certbot certificates | grep -q "$DOMAIN"; then
        
        log "📋 Certificate already exists and is valid for $DOMAIN"
        success "✅ Using existing certificate"
        
    else
        error "❌ Certificate generation failed for $DOMAIN"
        # Start nginx with temporary certificates anyway
        log "🚀 Starting nginx with temporary certificates..."
        docker compose -f docker-compose.prod.yml up -d nginx
        exit 1
    fi
    
    # Copy certificates to SSL directory (whether new or existing)
    if [[ -d "/etc/letsencrypt/live/$DOMAIN" ]]; then
        log "📋 Copying certificates for $DOMAIN..."
        sudo cp "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ssl/cert.pem
        sudo cp "/etc/letsencrypt/live/$DOMAIN/privkey.pem" ssl/key.pem
        sudo chown $(whoami):$(whoami) ssl/cert.pem ssl/key.pem
        chmod 644 ssl/cert.pem
        chmod 600 ssl/key.pem
        
        # Restart nginx with real certificates
        log "🔄 Starting nginx with real certificates..."
        docker compose -f docker-compose.prod.yml up -d nginx
        
        success "✅ SSL certificates ready and nginx started with HTTPS"
    else
        error "❌ Certificate directory not found"
        # Start nginx with temporary certificates anyway
        log "🚀 Starting nginx with temporary certificates..."
        docker compose -f docker-compose.prod.yml up -d nginx
        exit 1
    fi
}

# Function to create certificate renewal script
create_renewal_script() {
    log "🔄 Creating certificate renewal script..."
    
    cat > renew-ssl.sh << 'EOF'
#!/bin/bash
# Auto-renewal script for SSL certificates

log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

log "🔄 Starting SSL certificate renewal..."

# Renew certificates
sudo certbot renew

# Copy renewed certificates
if [[ -d "/etc/letsencrypt/live/locallytrip.com" ]]; then
    log "📋 Copying renewed certificates..."
    sudo cp /etc/letsencrypt/live/locallytrip.com/fullchain.pem ssl/cert.pem
    sudo cp /etc/letsencrypt/live/locallytrip.com/privkey.pem ssl/key.pem
    sudo chown $(whoami):$(whoami) ssl/cert.pem ssl/key.pem
    chmod 644 ssl/cert.pem
    chmod 600 ssl/key.pem
    
    log "🔄 Reloading nginx..."
    docker compose -f docker-compose.prod.yml exec nginx nginx -s reload
    
    log "✅ Certificate renewal completed"
else
    log "❌ Certificate renewal failed"
    exit 1
fi
EOF

    chmod +x renew-ssl.sh
    success "✅ Renewal script created: renew-ssl.sh"
}

# Function to auto-fix SSL issues
auto_fix_ssl() {
    log "🔧 Auto-fixing SSL certificate issues..."
    
    # Check if we're in production environment
    if [[ ! -f "docker-compose.prod.yml" ]]; then
        error "❌ Production docker-compose file not found!"
        exit 1
    fi
    
    # Stop current services
    log "⏸️ Stopping current services..."
    docker compose -f docker-compose.prod.yml down
    
    # Check if domain is reachable and points to this server
    local server_ip=$(curl -s ifconfig.me || curl -s ipinfo.io/ip)
    local domain_ip=$(dig +short $DOMAIN | tail -n1)
    
    if [[ "$server_ip" != "$domain_ip" ]]; then
        warning "⚠️ Domain $DOMAIN points to $domain_ip but server IP is $server_ip"
        warning "⚠️ Let's Encrypt may fail. Continuing with self-signed certificates..."
        generate_self_signed
        log "🚀 Starting services with self-signed certificates..."
        docker compose -f docker-compose.prod.yml up -d
        return
    fi
    
    # Try Let's Encrypt first
    log "🔒 Attempting Let's Encrypt certificate generation..."
    
    # Install certbot if needed
    if ! command -v certbot &> /dev/null; then
        log "📦 Installing certbot..."
        sudo apt update
        sudo apt install -y certbot
    fi
    
    # Generate temporary certificates for nginx to start
    log "🛠️ Generating temporary certificates..."
    mkdir -p ssl
    openssl genrsa -out ssl/key.pem 2048
    openssl req -new -x509 -key ssl/key.pem -out ssl/cert.pem -days 1 \
        -subj "/C=US/ST=State/L=City/O=LocallyTrip/CN=$DOMAIN/emailAddress=$SSL_EMAIL"
    chmod 600 ssl/key.pem
    chmod 644 ssl/cert.pem
    
    # Start nginx for ACME challenge
    log "🚀 Starting nginx for certificate validation..."
    docker compose -f docker-compose.prod.yml up -d nginx
    sleep 15
    
    # Try to get Let's Encrypt certificate
    log "📜 Requesting Let's Encrypt certificate..."
    if sudo certbot certonly --webroot \
        --webroot-path=/var/lib/docker/volumes/locallytrip_nginx_certbot/_data \
        --non-interactive --agree-tos --email "$SSL_EMAIL" \
        -d "$DOMAIN" -d "www.$DOMAIN" -d "api.$DOMAIN" -d "admin.$DOMAIN" 2>/dev/null; then
        
        success "✅ Let's Encrypt certificate obtained successfully!"
        
        # Copy certificates
        sudo cp "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ssl/cert.pem
        sudo cp "/etc/letsencrypt/live/$DOMAIN/privkey.pem" ssl/key.pem
        sudo chown $(whoami):$(whoami) ssl/cert.pem ssl/key.pem
        chmod 644 ssl/cert.pem
        chmod 600 ssl/key.pem
        
        # Restart services with real certificates
        log "🔄 Restarting services with Let's Encrypt certificates..."
        docker compose -f docker-compose.prod.yml down
        docker compose -f docker-compose.prod.yml up -d
        
        create_renewal_script
        
    else
        warning "⚠️ Let's Encrypt failed, using improved self-signed certificates..."
        
        # Generate better self-signed certificates
        openssl req -x509 -newkey rsa:4096 -nodes -days 365 \
            -keyout ssl/key.pem -out ssl/cert.pem \
            -subj "/C=ID/ST=Jakarta/L=Jakarta/O=LocallyTrip/CN=$DOMAIN" \
            -extensions SAN \
            -config <(echo "[req]"; echo "distinguished_name=req"; echo "[SAN]"; echo "subjectAltName=DNS:$DOMAIN,DNS:www.$DOMAIN,DNS:api.$DOMAIN,DNS:admin.$DOMAIN")
        
        chmod 600 ssl/key.pem
        chmod 644 ssl/cert.pem
        
        # Restart services
        log "🔄 Restarting services with self-signed certificates..."
        docker compose -f docker-compose.prod.yml down
        docker compose -f docker-compose.prod.yml up -d
    fi
    
    # Test the setup
    log "🧪 Testing SSL setup..."
    sleep 10
    
    if curl -k -s https://localhost/health > /dev/null 2>&1; then
        success "✅ HTTPS is working!"
    else
        warning "⚠️ HTTPS test failed, but services should be running"
    fi
}

# Main menu
echo ""
log "Select SSL setup option:"
log "1. Generate self-signed certificates (for testing)"
log "2. Setup Let's Encrypt certificates (for production)"
log "3. Create renewal script only"
log "4. Auto-fix SSL issues (recommended for production)"
echo ""

# Check if we have command line argument for auto-fix
if [[ "$1" == "--auto-fix" ]] || [[ "$1" == "-f" ]]; then
    choice=4
else
    read -p "Enter your choice (1-4): " choice
fi

case $choice in
    1)
        generate_self_signed
        ;;
    2)
        # Check if domains are properly configured
        warning "⚠️ Before proceeding, ensure:"
        warning "   • Domains point to this server's IP address"
        warning "   • Firewall allows ports 80 and 443"
        warning "   • No other services are using ports 80/443"
        echo ""
        read -p "Are domains configured correctly? (y/N): " confirm
        if [[ $confirm =~ ^[Yy]$ ]]; then
            setup_letsencrypt
        else
            log "Setup cancelled. Configure domains first."
            exit 0
        fi
        ;;
    3)
        create_renewal_script
        ;;
    4)
        auto_fix_ssl
        ;;
    *)
        error "❌ Invalid choice"
        exit 1
        ;;
esac

create_renewal_script

echo ""
success "🎉 SSL setup completed!"
log "📝 Next Steps:"
log "   1. Run: ./deploy-production-complete.sh"
log "   2. Test HTTPS access to all domains"
log "   3. Set up automatic renewal (add renew-ssl.sh to crontab)"
echo ""
log "💡 To add automatic renewal to crontab:"
log "   crontab -e"
log "   Add: 0 2 * * 0 /path/to/your/project/renew-ssl.sh"
