#!/bin/bash

# Emergency Server Recovery Script
# Run this on production server when site is completely down

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
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

critical() {
    echo -e "${PURPLE}[CRITICAL]${NC} $1"
}

log "🚨 LocallyTrip Emergency Recovery"
log "================================="

# 1. Check if we're in the right directory
if [[ ! -f "docker-compose.prod.yml" ]]; then
    error "❌ Not in project directory! Run this from ~/locallytrip/"
    exit 1
fi

# 2. Check basic server status
log "🖥️ Server Basic Checks:"

# Check disk space
disk_usage=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
if [[ $disk_usage -gt 90 ]]; then
    critical "⚠️ Disk usage critical: ${disk_usage}%"
else
    success "✅ Disk usage OK: ${disk_usage}%"
fi

# Check memory
mem_usage=$(free | grep Mem | awk '{printf "%.0f", $3/$2 * 100.0}')
if [[ $mem_usage -gt 90 ]]; then
    critical "⚠️ Memory usage high: ${mem_usage}%"
else
    success "✅ Memory usage OK: ${mem_usage}%"
fi

# 3. Check Docker status
log "🐳 Docker Service Checks:"

if ! systemctl is-active --quiet docker; then
    error "❌ Docker service not running!"
    log "🔄 Starting Docker service..."
    sudo systemctl start docker
    sleep 5
    
    if systemctl is-active --quiet docker; then
        success "✅ Docker service started"
    else
        critical "❌ Failed to start Docker service"
        exit 1
    fi
else
    success "✅ Docker service running"
fi

# 4. Check containers status
log "📦 Container Status:"
if docker compose -f docker-compose.prod.yml ps > /dev/null 2>&1; then
    docker compose -f docker-compose.prod.yml ps
    
    # Count running containers
    running_containers=$(docker compose -f docker-compose.prod.yml ps --services --filter "status=running" | wc -l)
    total_containers=$(docker compose -f docker-compose.prod.yml ps --services | wc -l)
    
    log "📊 Running: $running_containers/$total_containers containers"
    
    if [[ $running_containers -eq 0 ]]; then
        critical "❌ No containers running!"
    elif [[ $running_containers -lt $total_containers ]]; then
        warning "⚠️ Some containers not running"
    else
        success "✅ All containers running"
    fi
else
    error "❌ Cannot check container status"
fi

# 5. Check ports
log "🔌 Port Checks:"

ports=("80" "443" "3001" "5432")
for port in "${ports[@]}"; do
    if netstat -tuln | grep -q ":$port "; then
        success "✅ Port $port: Open"
    else
        error "❌ Port $port: Closed"
    fi
done

# 6. Check SSL certificates
log "🔐 SSL Certificate Check:"
if [[ -f "ssl/cert.pem" ]]; then
    success "✅ SSL certificate exists"
    
    # Check if certificate is valid
    if openssl x509 -in ssl/cert.pem -noout -checkend 86400 > /dev/null 2>&1; then
        success "✅ SSL certificate valid"
    else
        warning "⚠️ SSL certificate expired or invalid"
    fi
else
    error "❌ SSL certificate missing"
fi

# 7. Emergency recovery attempts
echo ""
log "🛠️ Emergency Recovery Attempts:"

# Stop all containers first
log "🛑 Stopping all containers..."
docker compose -f docker-compose.prod.yml down --remove-orphans || true

# Kill any hanging processes
log "🔪 Killing hanging processes..."
docker system prune -f || true

# Check if .env exists
if [[ ! -f ".env" ]]; then
    if [[ -f ".env.production" ]]; then
        log "📋 Creating .env from .env.production..."
        cp .env.production .env
        success "✅ .env created"
    else
        critical "❌ No .env file found!"
        exit 1
    fi
fi

# Start services step by step
log "🚀 Starting services step by step..."

# 1. Start database first
log "📀 Starting database..."
docker compose -f docker-compose.prod.yml up -d postgres
sleep 10

# Check database
if docker compose -f docker-compose.prod.yml exec -T postgres pg_isready -U locallytrip_prod_user > /dev/null 2>&1; then
    success "✅ Database started"
else
    error "❌ Database failed to start"
    docker compose -f docker-compose.prod.yml logs postgres
fi

# 2. Start backend
log "🔧 Starting backend..."
docker compose -f docker-compose.prod.yml up -d backend
sleep 15

# Check backend
if docker compose -f docker-compose.prod.yml exec -T backend curl -f http://localhost:3001/health > /dev/null 2>&1; then
    success "✅ Backend started"
else
    error "❌ Backend failed to start"
    docker compose -f docker-compose.prod.yml logs backend
fi

# 3. Start web services
log "🌐 Starting web services..."
docker compose -f docker-compose.prod.yml up -d web web-admin
sleep 20

# Check web
if docker compose -f docker-compose.prod.yml exec -T web curl -f http://localhost:3000 > /dev/null 2>&1; then
    success "✅ Web service started"
else
    error "❌ Web service failed to start"
    docker compose -f docker-compose.prod.yml logs web
fi

# 4. Generate SSL if missing
if [[ ! -f "ssl/cert.pem" ]]; then
    log "🔐 Generating emergency SSL certificate..."
    mkdir -p ssl
    openssl req -x509 -newkey rsa:2048 -nodes -days 30 \
        -keyout ssl/key.pem -out ssl/cert.pem \
        -subj "/C=ID/ST=Jakarta/L=Jakarta/O=LocallyTrip/CN=locallytrip.com"
    chmod 600 ssl/key.pem
    chmod 644 ssl/cert.pem
    success "✅ Emergency SSL certificate created"
fi

# 5. Start nginx
log "🔧 Starting nginx..."
docker compose -f docker-compose.prod.yml up -d nginx
sleep 10

# Check nginx
if docker compose -f docker-compose.prod.yml exec -T nginx nginx -t > /dev/null 2>&1; then
    success "✅ Nginx started"
else
    error "❌ Nginx failed to start"
    docker compose -f docker-compose.prod.yml logs nginx
fi

# 8. Final verification
echo ""
log "🧪 Final Verification:"

# Test internal connectivity
if curl -k -s -f https://localhost > /dev/null 2>&1; then
    success "✅ Internal HTTPS working"
else
    error "❌ Internal HTTPS not working"
fi

# Test external connectivity (if possible)
external_ip=$(curl -s ifconfig.me || echo "unknown")
log "🌐 External IP: $external_ip"

# Show final status
echo ""
log "📊 Final Status:"
docker compose -f docker-compose.prod.yml ps

# Show helpful commands
echo ""
log "💡 Helpful Commands:"
log "   📋 Check logs: docker compose -f docker-compose.prod.yml logs -f [service]"
log "   🔄 Restart: docker compose -f docker-compose.prod.yml restart [service]"
log "   🧪 Test: curl -k https://localhost"
log "   📊 Status: docker compose -f docker-compose.prod.yml ps"

echo ""
if docker compose -f docker-compose.prod.yml ps | grep -q "Up"; then
    success "🎉 Recovery attempt completed! Some services are running."
    log "💡 Try accessing: https://locallytrip.com"
    log "🔍 If still not working, check firewall and DNS settings"
else
    critical "❌ Recovery failed! No services running."
    log "💡 Manual intervention required."
fi
