#!/bin/bash

# Server Infrastructure Emergency Diagnostic
# For ERR_TUNNEL_CONNECTION_FAILED and server unreachable issues

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
    echo -e "${RED}[CRITICAL]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

critical() {
    echo -e "${PURPLE}[EMERGENCY]${NC} $1"
}

log "🆘 LocallyTrip Infrastructure Emergency Diagnostic"
log "================================================="

# Check if we can determine basic system info
log "🖥️ System Status Check:"

# Check if we're on the right server
if [[ -f "/etc/hostname" ]]; then
    hostname_file=$(cat /etc/hostname)
    current_hostname=$(hostname)
    success "✅ Server hostname: $current_hostname"
    if [[ "$hostname_file" != "$current_hostname" ]]; then
        warning "⚠️ Hostname mismatch: file=$hostname_file, current=$current_hostname"
    fi
else
    warning "⚠️ Cannot read hostname file"
fi

# Check uptime
uptime_info=$(uptime)
success "✅ Server uptime: $uptime_info"

# Check if we're the right user
current_user=$(whoami)
if [[ "$current_user" == "locallytrip" ]]; then
    success "✅ Running as correct user: $current_user"
else
    warning "⚠️ Running as: $current_user (expected: locallytrip)"
fi

# Check if in right directory
if [[ -f "docker-compose.prod.yml" ]] && [[ -f "package.json" ]]; then
    success "✅ In LocallyTrip project directory"
else
    error "❌ Not in LocallyTrip project directory!"
    log "Current directory: $(pwd)"
    log "Files present: $(ls -la)"
    exit 1
fi

echo ""
log "🌐 Network Infrastructure Check:"

# Check external IP and connectivity
external_ip=$(curl -s --connect-timeout 10 ifconfig.me 2>/dev/null || echo "FAILED")
if [[ "$external_ip" != "FAILED" ]]; then
    success "✅ External IP: $external_ip"
    success "✅ Internet connectivity: Working"
else
    error "❌ Cannot determine external IP - Internet connectivity issues"
fi

# Check internal network
internal_ip=$(hostname -I | awk '{print $1}' 2>/dev/null || echo "FAILED")
if [[ "$internal_ip" != "FAILED" ]]; then
    success "✅ Internal IP: $internal_ip"
else
    error "❌ Cannot determine internal IP"
fi

# DNS resolution test
if nslookup google.com > /dev/null 2>&1; then
    success "✅ DNS resolution: Working"
else
    error "❌ DNS resolution: Failed"
fi

# Test domain resolution
if nslookup locallytrip.com > /dev/null 2>&1; then
    domain_ip=$(nslookup locallytrip.com | grep -A1 "Name:" | tail -1 | awk '{print $2}' 2>/dev/null || echo "FAILED")
    if [[ "$domain_ip" == "$external_ip" ]]; then
        success "✅ Domain locallytrip.com points to this server ($domain_ip)"
    else
        error "❌ Domain locallytrip.com points to $domain_ip, but server IP is $external_ip"
    fi
else
    error "❌ Cannot resolve locallytrip.com"
fi

echo ""
log "🐳 Docker Infrastructure Check:"

# Check if Docker is installed
if command -v docker &> /dev/null; then
    success "✅ Docker is installed"
    docker_version=$(docker --version)
    log "   Version: $docker_version"
else
    error "❌ Docker is not installed!"
    exit 1
fi

# Check Docker service
if systemctl is-active --quiet docker 2>/dev/null; then
    success "✅ Docker service is running"
else
    error "❌ Docker service is not running"
    log "🔄 Attempting to start Docker service..."
    
    if sudo systemctl start docker 2>/dev/null; then
        sleep 5
        if systemctl is-active --quiet docker; then
            success "✅ Docker service started successfully"
        else
            error "❌ Failed to start Docker service"
        fi
    else
        error "❌ Cannot start Docker service (permission denied)"
    fi
fi

# Check Docker daemon
if docker info > /dev/null 2>&1; then
    success "✅ Docker daemon is responding"
else
    error "❌ Docker daemon is not responding"
fi

echo ""
log "📦 Container Status Check:"

# Check if docker-compose is available
if command -v docker-compose &> /dev/null; then
    success "✅ docker-compose is available"
elif docker compose version > /dev/null 2>&1; then
    success "✅ docker compose (plugin) is available"
else
    error "❌ docker-compose is not available"
fi

# Check containers
if docker compose -f docker-compose.prod.yml ps > /dev/null 2>&1; then
    log "📊 Container Status:"
    docker compose -f docker-compose.prod.yml ps --format "table {{.Service}}\t{{.Status}}\t{{.Ports}}"
    
    # Count containers
    total_services=$(docker compose -f docker-compose.prod.yml config --services | wc -l)
    running_containers=$(docker compose -f docker-compose.prod.yml ps --services --filter "status=running" | wc -l)
    
    log "📈 Container Summary: $running_containers/$total_services running"
    
    if [[ $running_containers -eq 0 ]]; then
        error "❌ NO CONTAINERS RUNNING!"
    elif [[ $running_containers -lt $total_services ]]; then
        warning "⚠️ Some containers are not running"
    else
        success "✅ All containers are running"
    fi
else
    error "❌ Cannot check container status"
fi

echo ""
log "🔌 Port and Service Check:"

# Check critical ports
check_port_binding() {
    local port=$1
    local service_name=$2
    
    if netstat -tuln 2>/dev/null | grep -q ":$port "; then
        success "✅ Port $port ($service_name): Listening"
        
        # Try to identify what's using the port
        if command -v lsof &> /dev/null && [[ $EUID -eq 0 ]]; then
            process=$(lsof -i :$port 2>/dev/null | tail -1 | awk '{print $1}' || echo "unknown")
            log "     Process: $process"
        fi
    else
        error "❌ Port $port ($service_name): NOT listening"
    fi
}

check_port_binding 80 "HTTP"
check_port_binding 443 "HTTPS"
check_port_binding 3001 "Backend API"
check_port_binding 5432 "PostgreSQL"

echo ""
log "🔐 SSL and Web Server Check:"

# Check SSL certificate
if [[ -f "ssl/cert.pem" ]]; then
    success "✅ SSL certificate file exists"
    
    if openssl x509 -in ssl/cert.pem -noout -checkend 86400 > /dev/null 2>&1; then
        success "✅ SSL certificate is valid"
        
        # Check certificate details
        subject=$(openssl x509 -in ssl/cert.pem -noout -subject | cut -d= -f2-)
        expiry=$(openssl x509 -in ssl/cert.pem -noout -enddate | cut -d= -f2)
        log "     Subject: $subject"
        log "     Expires: $expiry"
    else
        error "❌ SSL certificate is invalid or expired"
    fi
else
    error "❌ SSL certificate file missing"
fi

# Test local web server connectivity
log "🧪 Local Web Server Tests:"

# Test HTTP
if curl -s --connect-timeout 5 http://localhost > /dev/null 2>&1; then
    success "✅ Local HTTP (port 80): Responding"
else
    error "❌ Local HTTP (port 80): Not responding"
fi

# Test HTTPS
if curl -k -s --connect-timeout 5 https://localhost > /dev/null 2>&1; then
    success "✅ Local HTTPS (port 443): Responding"
else
    error "❌ Local HTTPS (port 443): Not responding"
fi

# Test backend API
if curl -s --connect-timeout 5 http://localhost:3001/health > /dev/null 2>&1; then
    success "✅ Backend API (port 3001): Responding"
else
    error "❌ Backend API (port 3001): Not responding"
fi

echo ""
log "💾 System Resources Check:"

# Disk space
disk_usage=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
if [[ $disk_usage -lt 85 ]]; then
    success "✅ Disk usage: ${disk_usage}% (Good)"
elif [[ $disk_usage -lt 95 ]]; then
    warning "⚠️ Disk usage: ${disk_usage}% (High)"
else
    error "❌ Disk usage: ${disk_usage}% (Critical)"
fi

# Memory usage
if command -v free &> /dev/null; then
    mem_total=$(free -m | grep Mem | awk '{print $2}')
    mem_used=$(free -m | grep Mem | awk '{print $3}')
    mem_percent=$((mem_used * 100 / mem_total))
    
    if [[ $mem_percent -lt 80 ]]; then
        success "✅ Memory usage: ${mem_percent}% (${mem_used}MB/${mem_total}MB)"
    elif [[ $mem_percent -lt 90 ]]; then
        warning "⚠️ Memory usage: ${mem_percent}% (${mem_used}MB/${mem_total}MB)"
    else
        error "❌ Memory usage: ${mem_percent}% (${mem_used}MB/${mem_total}MB)"
    fi
fi

# Load average
load_avg=$(uptime | awk -F'load average:' '{print $2}' | awk '{print $1}' | sed 's/,//')
log "📊 System load: $load_avg"

echo ""
log "🎯 Problem Analysis:"

# Analyze the situation
problems_found=0

if ! netstat -tuln | grep -q ":80 "; then
    error "🔥 CRITICAL: Port 80 (HTTP) not listening"
    problems_found=$((problems_found + 1))
fi

if ! netstat -tuln | grep -q ":443 "; then
    error "🔥 CRITICAL: Port 443 (HTTPS) not listening"
    problems_found=$((problems_found + 1))
fi

if ! systemctl is-active --quiet docker; then
    error "🔥 CRITICAL: Docker service not running"
    problems_found=$((problems_found + 1))
fi

running_containers=$(docker compose -f docker-compose.prod.yml ps --services --filter "status=running" 2>/dev/null | wc -l)
if [[ $running_containers -eq 0 ]]; then
    error "🔥 CRITICAL: No containers running"
    problems_found=$((problems_found + 1))
fi

echo ""
if [[ $problems_found -eq 0 ]]; then
    success "🎉 No critical infrastructure problems detected"
    log "💡 The issue might be external (DNS, firewall, network routing)"
else
    critical "🚨 Found $problems_found critical infrastructure problems"
    log "💡 Run emergency recovery to fix these issues"
fi

echo ""
log "🛠️ Recommended Actions:"

if [[ $problems_found -gt 0 ]]; then
    log "   🚨 Run: ./emergency-recovery.sh"
    log "   🔄 Or manual: docker compose -f docker-compose.prod.yml up -d"
fi

log "   🔍 Check logs: docker compose -f docker-compose.prod.yml logs -f"
log "   📊 Monitor: watch 'docker compose -f docker-compose.prod.yml ps'"
log "   🧪 Test: curl -k https://localhost"

if [[ "$external_ip" != "FAILED" ]]; then
    log "   🌐 External test: curl -k https://$external_ip"
fi

echo ""
log "📞 Emergency Contact Information:"
log "   🆘 If infrastructure is OK but site still unreachable:"
log "      - Check domain DNS settings"
log "      - Check Alibaba Cloud security groups"
log "      - Check network routing"
log "      - Contact hosting provider"

# Final recommendation
echo ""
if [[ $problems_found -gt 0 ]]; then
    critical "🚨 IMMEDIATE ACTION REQUIRED: Run ./emergency-recovery.sh"
else
    log "💭 Infrastructure appears healthy. Issue may be external."
    log "🔍 Check domain DNS, firewall rules, and network routing."
fi
