#!/bin/bash

# LocallyTrip Infrastructure Emergency Recovery
# Specialized for ERR_TUNNEL_CONNECTION_FAILED and complete server outages

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

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to wait for service
wait_for_service() {
    local service_name=$1
    local check_command=$2
    local timeout=${3:-60}
    local count=0
    
    log "⏳ Waiting for $service_name to be ready..."
    
    while ! eval "$check_command" > /dev/null 2>&1; do
        if [[ $count -ge $timeout ]]; then
            error "❌ Timeout waiting for $service_name"
            return 1
        fi
        
        echo -n "."
        sleep 2
        count=$((count + 2))
    done
    
    echo ""
    success "✅ $service_name is ready"
    return 0
}

log "🆘 LocallyTrip Infrastructure Emergency Recovery"
log "==============================================="

# Step 1: Environment Check
log "🔍 Step 1: Environment Verification"

if [[ ! -f "docker-compose.prod.yml" ]]; then
    error "❌ docker-compose.prod.yml not found!"
    error "Please ensure you're in the LocallyTrip project directory"
    exit 1
fi

success "✅ Found docker-compose.prod.yml"

# Check if running as correct user
current_user=$(whoami)
log "👤 Current user: $current_user"

# Step 2: Docker Service Recovery
log ""
log "🐳 Step 2: Docker Service Recovery"

if ! command_exists docker; then
    error "❌ Docker is not installed!"
    exit 1
fi

# Check and start Docker service if needed
if ! systemctl is-active --quiet docker 2>/dev/null; then
    warning "⚠️ Docker service is not running"
    log "🔄 Starting Docker service..."
    
    # Try to start with sudo if not root
    if [[ $EUID -ne 0 ]]; then
        if sudo systemctl start docker; then
            success "✅ Docker service started with sudo"
        else
            error "❌ Failed to start Docker service"
            exit 1
        fi
    else
        if systemctl start docker; then
            success "✅ Docker service started"
        else
            error "❌ Failed to start Docker service"
            exit 1
        fi
    fi
    
    # Wait for Docker to be ready
    wait_for_service "Docker daemon" "docker info" 30
else
    success "✅ Docker service is running"
fi

# Step 3: Complete Container Reset
log ""
log "🔄 Step 3: Complete Container Reset"

log "🛑 Stopping all containers..."
docker compose -f docker-compose.prod.yml down --remove-orphans 2>/dev/null || true

log "🧹 Cleaning up unused resources..."
docker system prune -f --volumes 2>/dev/null || true

# Step 4: Network Recovery
log ""
log "🌐 Step 4: Network Infrastructure Recovery"

# Remove any conflicting networks
log "🔗 Cleaning Docker networks..."
docker network prune -f 2>/dev/null || true

# Check port conflicts
check_port_conflict() {
    local port=$1
    local service_name=$2
    
    if netstat -tuln 2>/dev/null | grep -q ":$port "; then
        warning "⚠️ Port $port ($service_name) is already in use"
        
        if command_exists lsof && [[ $EUID -eq 0 ]]; then
            process=$(lsof -ti :$port 2>/dev/null)
            if [[ -n "$process" ]]; then
                log "🔍 Process using port $port: $process"
                read -p "Kill process $process? (y/N): " -n 1 -r
                echo
                if [[ $REPLY =~ ^[Yy]$ ]]; then
                    kill -9 $process 2>/dev/null || true
                    success "✅ Killed process $process"
                fi
            fi
        fi
    else
        success "✅ Port $port ($service_name) is available"
    fi
}

check_port_conflict 80 "HTTP"
check_port_conflict 443 "HTTPS"
check_port_conflict 3001 "Backend"
check_port_conflict 5432 "PostgreSQL"

# Step 5: SSL Certificate Recovery
log ""
log "🔐 Step 5: SSL Certificate Recovery"

if [[ ! -f "ssl/cert.pem" ]] || [[ ! -f "ssl/key.pem" ]]; then
    warning "⚠️ SSL certificates missing"
    log "🔧 Generating self-signed certificates for emergency recovery..."
    
    mkdir -p ssl
    
    # Generate self-signed certificate
    openssl req -x509 -newkey rsa:4096 -keyout ssl/key.pem -out ssl/cert.pem \
        -days 365 -nodes -subj "/CN=locallytrip.com" 2>/dev/null || {
        error "❌ Failed to generate SSL certificates"
        exit 1
    }
    
    success "✅ Generated emergency SSL certificates"
else
    success "✅ SSL certificates exist"
fi

# Step 6: Environment Configuration
log ""
log "⚙️ Step 6: Environment Configuration"

if [[ ! -f ".env.production" ]]; then
    warning "⚠️ .env.production missing"
    log "🔧 Creating minimal production environment..."
    
    cat > .env.production << EOF
# Emergency Production Environment
NODE_ENV=production
DATABASE_URL=postgresql://locallytrip:locallytrip123@postgres:5432/locallytrip_prod
NEXT_PUBLIC_API_URL=https://api.locallytrip.com
NEXT_PUBLIC_IMAGES=https://api.locallytrip.com/images
JWT_SECRET=emergency-jwt-secret-$(openssl rand -hex 32)
POSTGRES_DB=locallytrip_prod
POSTGRES_USER=locallytrip
POSTGRES_PASSWORD=locallytrip123
EOF
    
    success "✅ Created emergency .env.production"
else
    success "✅ .env.production exists"
fi

# Step 7: Infrastructure Startup
log ""
log "🚀 Step 7: Infrastructure Startup (Ordered)"

log "📦 Starting PostgreSQL database..."
docker compose -f docker-compose.prod.yml up -d postgres

if wait_for_service "PostgreSQL" "docker compose -f docker-compose.prod.yml exec postgres pg_isready -U locallytrip" 60; then
    success "✅ PostgreSQL is ready"
else
    error "❌ PostgreSQL failed to start"
    log "🔍 PostgreSQL logs:"
    docker compose -f docker-compose.prod.yml logs postgres --tail=20
    exit 1
fi

log "🖥️ Starting backend API..."
docker compose -f docker-compose.prod.yml up -d backend

if wait_for_service "Backend API" "curl -s http://localhost:3001/health" 60; then
    success "✅ Backend API is ready"
else
    warning "⚠️ Backend API health check failed, but continuing..."
    log "🔍 Backend logs:"
    docker compose -f docker-compose.prod.yml logs backend --tail=20
fi

log "🌐 Starting web frontend..."
docker compose -f docker-compose.prod.yml up -d web

if wait_for_service "Web Frontend" "curl -s http://localhost:3000" 60; then
    success "✅ Web frontend is ready"
else
    warning "⚠️ Web frontend check failed, but continuing..."
    log "🔍 Web logs:"
    docker compose -f docker-compose.prod.yml logs web --tail=20
fi

log "🔀 Starting nginx proxy..."
docker compose -f docker-compose.prod.yml up -d nginx

if wait_for_service "Nginx" "curl -k -s https://localhost" 60; then
    success "✅ Nginx is ready"
else
    warning "⚠️ Nginx check failed"
    log "🔍 Nginx logs:"
    docker compose -f docker-compose.prod.yml logs nginx --tail=20
fi

# Step 8: Health Verification
log ""
log "🏥 Step 8: Complete Health Verification"

log "📊 Container Status:"
docker compose -f docker-compose.prod.yml ps

log ""
log "🧪 Service Tests:"

# Test internal connectivity
if curl -s --connect-timeout 10 http://localhost > /dev/null 2>&1; then
    success "✅ HTTP (port 80): Working"
else
    error "❌ HTTP (port 80): Failed"
fi

if curl -k -s --connect-timeout 10 https://localhost > /dev/null 2>&1; then
    success "✅ HTTPS (port 443): Working"
else
    error "❌ HTTPS (port 443): Failed"
fi

if curl -s --connect-timeout 10 http://localhost:3001/health > /dev/null 2>&1; then
    success "✅ Backend Health: Working"
else
    error "❌ Backend Health: Failed"
fi

# Test external connectivity
external_ip=$(curl -s --connect-timeout 10 ifconfig.me 2>/dev/null || echo "UNKNOWN")
if [[ "$external_ip" != "UNKNOWN" ]]; then
    success "✅ External IP: $external_ip"
    
    log "🌐 Testing external connectivity..."
    if curl -k -s --connect-timeout 15 https://$external_ip > /dev/null 2>&1; then
        success "✅ External HTTPS: Working"
    else
        error "❌ External HTTPS: Failed"
    fi
else
    error "❌ Cannot determine external IP"
fi

# Step 9: Final Status Report
log ""
log "📋 Recovery Summary"
log "=================="

running_containers=$(docker compose -f docker-compose.prod.yml ps --services --filter "status=running" | wc -l)
total_services=$(docker compose -f docker-compose.prod.yml config --services | wc -l)

log "📦 Containers: $running_containers/$total_services running"

if [[ $running_containers -eq $total_services ]]; then
    success "🎉 All services are running!"
else
    warning "⚠️ Some services may have issues"
fi

# Check if site is accessible
if curl -k -s --connect-timeout 10 https://localhost | grep -q "LocallyTrip\|locallytrip" 2>/dev/null; then
    success "🌟 Website is responding and serving content!"
else
    warning "⚠️ Website may not be serving expected content"
fi

log ""
log "🔍 Monitoring Commands:"
log "   📊 Status: docker compose -f docker-compose.prod.yml ps"
log "   📋 Logs: docker compose -f docker-compose.prod.yml logs -f"
log "   🧪 Test: curl -k https://localhost"

if [[ "$external_ip" != "UNKNOWN" ]]; then
    log "   🌐 External: curl -k https://$external_ip"
    log "   🔗 Visit: https://locallytrip.com"
fi

log ""
if [[ $running_containers -eq $total_services ]]; then
    success "✅ RECOVERY COMPLETE! All services are running."
    log "🌐 Your LocallyTrip site should now be accessible."
else
    critical "⚠️ PARTIAL RECOVERY: Some services may need attention."
    log "🔍 Check logs for specific service issues."
fi

log ""
log "🆘 If the site is still not accessible externally:"
log "   1. Check domain DNS settings"
log "   2. Verify Alibaba Cloud security groups"
log "   3. Check firewall rules: sudo ufw status"
log "   4. Test with: curl -k https://locallytrip.com"
