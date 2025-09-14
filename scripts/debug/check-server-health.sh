#!/bin/bash

# Server Network and Connectivity Diagnostics
# Check fundamental server issues

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

success() {
    echo -e "${GREEN}[OK]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log "🌐 LocallyTrip Network Diagnostics"
log "=================================="

# 1. Check server basic info
log "🖥️ Server Information:"
echo "   Hostname: $(hostname)"
echo "   Internal IP: $(hostname -I | awk '{print $1}')"
echo "   External IP: $(curl -s ifconfig.me || echo 'Cannot determine')"
echo "   DNS Server: $(cat /etc/resolv.conf | grep nameserver | head -1 | awk '{print $2}')"

# 2. Check if running as root or with sudo
if [[ $EUID -eq 0 ]]; then
    success "✅ Running as root"
    CAN_MODIFY_FIREWALL=true
else
    if sudo -n true 2>/dev/null; then
        success "✅ Has sudo access"
        CAN_MODIFY_FIREWALL=true
    else
        warning "⚠️ No root/sudo access (some checks limited)"
        CAN_MODIFY_FIREWALL=false
    fi
fi

# 3. Check firewall status
echo ""
log "🔥 Firewall Status:"

if command -v ufw &> /dev/null; then
    if [[ $CAN_MODIFY_FIREWALL == true ]]; then
        ufw_status=$(sudo ufw status | head -1)
        echo "   UFW: $ufw_status"
        
        if echo "$ufw_status" | grep -q "inactive"; then
            warning "⚠️ UFW is inactive"
            log "🔧 Enabling UFW with basic rules..."
            sudo ufw --force enable
            sudo ufw allow 22/tcp
            sudo ufw allow 80/tcp
            sudo ufw allow 443/tcp
            success "✅ UFW enabled with web ports"
        else
            success "✅ UFW is active"
            log "📋 UFW Rules:"
            sudo ufw status numbered | grep -E "(80|443)" || warning "⚠️ Web ports not explicitly allowed"
        fi
    else
        warning "⚠️ Cannot check UFW (need sudo)"
    fi
elif command -v iptables &> /dev/null; then
    if [[ $CAN_MODIFY_FIREWALL == true ]]; then
        log "📋 IPTables rules for ports 80, 443:"
        sudo iptables -L -n | grep -E "(80|443)" || warning "⚠️ No explicit rules for web ports"
    else
        warning "⚠️ Cannot check iptables (need sudo)"
    fi
else
    warning "⚠️ No firewall tools found"
fi

# 4. Check if ports are being used
echo ""
log "🔌 Port Usage:"

check_port() {
    local port=$1
    local service_name=$2
    
    if netstat -tuln 2>/dev/null | grep -q ":$port "; then
        success "✅ Port $port ($service_name): In use"
        
        # Try to identify what's using the port
        if command -v lsof &> /dev/null; then
            process=$(sudo lsof -i :$port 2>/dev/null | tail -1 | awk '{print $1}' || echo "unknown")
            echo "     Process: $process"
        fi
    else
        error "❌ Port $port ($service_name): Not in use"
    fi
}

check_port 80 "HTTP"
check_port 443 "HTTPS"
check_port 3001 "Backend API"
check_port 5432 "PostgreSQL"

# 5. Check Docker and containers
echo ""
log "🐳 Docker Status:"

if systemctl is-active --quiet docker 2>/dev/null; then
    success "✅ Docker service running"
    
    if [[ -f "docker-compose.prod.yml" ]]; then
        log "📦 Container Status:"
        if docker compose -f docker-compose.prod.yml ps > /dev/null 2>&1; then
            docker compose -f docker-compose.prod.yml ps --format "table {{.Service}}\t{{.Status}}\t{{.Ports}}"
        else
            error "❌ Cannot get container status"
        fi
    else
        warning "⚠️ docker-compose.prod.yml not found"
    fi
else
    error "❌ Docker service not running"
    if [[ $CAN_MODIFY_FIREWALL == true ]]; then
        log "🔄 Starting Docker..."
        sudo systemctl start docker
        sleep 3
        if systemctl is-active --quiet docker; then
            success "✅ Docker started"
        else
            error "❌ Failed to start Docker"
        fi
    fi
fi

# 6. Test connectivity
echo ""
log "🧪 Connectivity Tests:"

# Test internal connectivity
if curl -k -s --connect-timeout 5 https://localhost > /dev/null 2>&1; then
    success "✅ Internal HTTPS: Working"
else
    error "❌ Internal HTTPS: Failed"
fi

if curl -s --connect-timeout 5 http://localhost > /dev/null 2>&1; then
    success "✅ Internal HTTP: Working"
else
    error "❌ Internal HTTP: Failed"
fi

# Test external connectivity (basic)
if ping -c 1 8.8.8.8 > /dev/null 2>&1; then
    success "✅ Internet connectivity: Working"
else
    error "❌ Internet connectivity: Failed"
fi

# 7. DNS Resolution Test
echo ""
log "🔍 DNS Resolution:"

test_dns() {
    local domain=$1
    if nslookup "$domain" > /dev/null 2>&1; then
        success "✅ DNS resolution for $domain: Working"
        resolved_ip=$(nslookup "$domain" | grep -A1 "Name:" | tail -1 | awk '{print $2}' || echo "unknown")
        echo "     Resolved to: $resolved_ip"
    else
        error "❌ DNS resolution for $domain: Failed"
    fi
}

test_dns "locallytrip.com"
test_dns "google.com"

# 8. Check SSL certificates
echo ""
log "🔐 SSL Certificate Status:"

if [[ -f "ssl/cert.pem" ]]; then
    success "✅ SSL certificate file exists"
    
    # Check certificate validity
    if openssl x509 -in ssl/cert.pem -noout -checkend 86400 > /dev/null 2>&1; then
        success "✅ SSL certificate: Valid"
        expiry=$(openssl x509 -in ssl/cert.pem -noout -enddate | cut -d= -f2)
        echo "     Expires: $expiry"
    else
        error "❌ SSL certificate: Invalid or expired"
    fi
    
    # Check certificate details
    subject=$(openssl x509 -in ssl/cert.pem -noout -subject | cut -d= -f2-)
    echo "     Subject: $subject"
else
    error "❌ SSL certificate file missing"
fi

# 9. System resources
echo ""
log "💾 System Resources:"

# Disk usage
disk_usage=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
if [[ $disk_usage -lt 90 ]]; then
    success "✅ Disk usage: ${disk_usage}% (OK)"
else
    error "❌ Disk usage: ${disk_usage}% (Critical)"
fi

# Memory usage
if command -v free &> /dev/null; then
    mem_usage=$(free | grep Mem | awk '{printf "%.0f", $3/$2 * 100.0}')
    if [[ $mem_usage -lt 90 ]]; then
        success "✅ Memory usage: ${mem_usage}% (OK)"
    else
        error "❌ Memory usage: ${mem_usage}% (High)"
    fi
fi

# Load average
load_avg=$(uptime | awk -F'load average:' '{print $2}' | awk '{print $1}' | sed 's/,//')
echo "   Load average: $load_avg"

# 10. Recommendations
echo ""
log "💡 Recommendations:"

if ! netstat -tuln | grep -q ":80 "; then
    error "❌ Port 80 not listening - run emergency recovery"
fi

if ! netstat -tuln | grep -q ":443 "; then
    error "❌ Port 443 not listening - run emergency recovery"
fi

if ! systemctl is-active --quiet docker; then
    error "❌ Docker not running - start Docker service"
fi

if [[ ! -f "ssl/cert.pem" ]]; then
    error "❌ SSL certificate missing - generate certificates"
fi

echo ""
log "🎯 Quick Fix Commands:"
log "   Emergency recovery: ./emergency-recovery.sh"
log "   Check containers: docker compose -f docker-compose.prod.yml ps"
log "   View logs: docker compose -f docker-compose.prod.yml logs -f"
log "   Restart all: docker compose -f docker-compose.prod.yml restart"

if [[ $CAN_MODIFY_FIREWALL == true ]]; then
    echo ""
    log "🔧 Firewall Quick Fix (if needed):"
    echo "   sudo ufw allow 80/tcp"
    echo "   sudo ufw allow 443/tcp"
    echo "   sudo ufw reload"
fi
