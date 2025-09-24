#!/bin/bash

# LocallyTrip Ubuntu Server Pre-deployment Validation
# Run this from your macOS to check Ubuntu server readiness

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Server configuration
SERVER_IP="103.189.234.54"
SERVER_USER="locallytrip"  # Update with your actual username
DOMAIN="locallytrip.com"
SSH_KEY_PATH="$HOME/.ssh/id_rsa"  # Update with your SSH key path

log() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
    exit 1
}

print_header() {
    echo -e "${BLUE}================================================${NC}"
    echo -e "${BLUE} LocallyTrip Ubuntu Server Validation${NC}"
    echo -e "${BLUE} Target: ${SERVER_IP} (Singapore)${NC}"
    echo -e "${BLUE}================================================${NC}"
}

check_ssh_connection() {
    log "Testing SSH connection to Ubuntu server..."
    
    if ssh -o ConnectTimeout=10 -o BatchMode=yes -i "$SSH_KEY_PATH" "$SERVER_USER@$SERVER_IP" exit 2>/dev/null; then
        log "✅ SSH connection successful"
    else
        error "❌ Cannot connect to server via SSH. Check your SSH key and server access."
    fi
}

check_server_specs() {
    log "Checking server specifications..."
    
    local server_info=$(ssh -i "$SSH_KEY_PATH" "$SERVER_USER@$SERVER_IP" "
        echo 'OS:' \$(lsb_release -d 2>/dev/null | cut -f2 || echo 'Unknown')
        echo 'CPU:' \$(nproc) 'cores'
        echo 'RAM:' \$(free -h | awk 'NR==2{print \$2}')
        echo 'Disk:' \$(df -h / | awk 'NR==2{print \$4}') 'available'
        echo 'Uptime:' \$(uptime -p)
    ")
    
    echo -e "${GREEN}Server Specifications:${NC}"
    echo "$server_info"
    
    log "✅ Server specs retrieved"
}

check_docker_installation() {
    log "Checking Docker installation on Ubuntu server..."
    
    local docker_status=$(ssh -i "$SSH_KEY_PATH" "$SERVER_USER@$SERVER_IP" "
        if command -v docker &> /dev/null; then
            echo 'DOCKER_VERSION:' \$(docker --version 2>/dev/null || echo 'Error getting version')
            if docker compose version &> /dev/null 2>&1; then
                echo 'COMPOSE_VERSION:' \$(docker compose version --short 2>/dev/null || echo 'Error getting version')
            else
                echo 'COMPOSE_VERSION: Not installed'
            fi
            if sudo docker info &> /dev/null 2>&1; then
                echo 'DOCKER_STATUS: Running'
            else
                echo 'DOCKER_STATUS: Not running'
            fi
        else
            echo 'DOCKER_VERSION: Not installed'
            echo 'COMPOSE_VERSION: Not installed'
            echo 'DOCKER_STATUS: Not installed'
        fi
    ")
    
    echo -e "${GREEN}Docker Status:${NC}"
    echo "$docker_status"
    
    if echo "$docker_status" | grep -q "Not installed"; then
        warn "Docker not installed - deployment script will install it"
    else
        log "✅ Docker is available on server"
    fi
}

check_firewall_status() {
    log "Checking firewall configuration..."
    
    local firewall_info=$(ssh -i "$SSH_KEY_PATH" "$SERVER_USER@$SERVER_IP" "
        if command -v ufw &> /dev/null; then
            echo 'UFW_STATUS:' \$(sudo ufw status | head -1)
            echo 'HTTP_ALLOWED:' \$(sudo ufw status | grep -q '80/tcp' && echo 'Yes' || echo 'No')
            echo 'HTTPS_ALLOWED:' \$(sudo ufw status | grep -q '443/tcp' && echo 'Yes' || echo 'No')
            echo 'SSH_ALLOWED:' \$(sudo ufw status | grep -q '22/tcp' && echo 'Yes' || echo 'No')
        else
            echo 'UFW_STATUS: Not available'
        fi
    ")
    
    echo -e "${GREEN}Firewall Status:${NC}"
    echo "$firewall_info"
    
    log "✅ Firewall status checked"
}

check_dns_configuration() {
    log "Checking DNS configuration..."
    
    echo -e "${GREEN}DNS Configuration:${NC}"
    echo "Domain: $DOMAIN"
    
    # Check if domain points to server IP
    local domain_ip=$(dig +short "$DOMAIN" 2>/dev/null || echo "Not resolved")
    echo "Domain IP: $domain_ip"
    echo "Server IP: $SERVER_IP"
    
    if [[ "$domain_ip" == "$SERVER_IP" ]]; then
        log "✅ Domain points to correct server IP"
    else
        warn "Domain does not point to server IP - update DNS records"
    fi
    
    # Check subdomain
    local admin_ip=$(dig +short "admin.$DOMAIN" 2>/dev/null || echo "Not resolved")
    echo "Admin subdomain IP: $admin_ip"
    
    if [[ "$admin_ip" == "$SERVER_IP" ]]; then
        log "✅ Admin subdomain configured correctly"
    else
        warn "Admin subdomain not configured - may need DNS update"
    fi
}

check_ssl_certificates() {
    log "Checking SSL certificates..."
    
    if [[ -f "ssl/cert.pem" && -f "ssl/key.pem" ]]; then
        log "✅ SSL certificates found locally"
        
        # Check certificate validity
        local cert_info=$(openssl x509 -in ssl/cert.pem -text -noout 2>/dev/null | grep -E "Subject:|Not After:" || echo "Error reading certificate")
        echo -e "${GREEN}Certificate Info:${NC}"
        echo "$cert_info"
    else
        warn "SSL certificates not found - HTTPS will not work"
    fi
}

test_network_connectivity() {
    log "Testing network connectivity..."
    
    # Test HTTP connectivity
    if curl -s --connect-timeout 10 "http://$SERVER_IP" > /dev/null 2>&1; then
        log "✅ HTTP port 80 is accessible"
    else
        warn "HTTP port 80 not accessible (expected if not deployed yet)"
    fi
    
    # Test HTTPS connectivity  
    if curl -s --connect-timeout 10 "https://$SERVER_IP" > /dev/null 2>&1; then
        log "✅ HTTPS port 443 is accessible"
    else
        warn "HTTPS port 443 not accessible (expected if not deployed yet)"
    fi
}

check_system_resources() {
    log "Checking system resource availability..."
    
    local resource_info=$(ssh -i "$SSH_KEY_PATH" "$SERVER_USER@$SERVER_IP" "
        echo 'CPU_USAGE:' \$(top -bn1 | grep 'Cpu(s)' | awk '{print \$2}' | cut -d'%' -f1)
        echo 'MEMORY_USAGE:' \$(free | awk 'NR==2{printf \"%.1f%%\", \$3/\$2*100}')
        echo 'DISK_USAGE:' \$(df / | awk 'NR==2{print \$5}')
        echo 'LOAD_AVERAGE:' \$(uptime | awk -F'load average:' '{print \$2}')
    ")
    
    echo -e "${GREEN}System Resources:${NC}"
    echo "$resource_info"
    
    log "✅ System resources checked"
}

generate_deployment_command() {
    log "Generating deployment commands..."
    
    echo -e "${BLUE}================================================${NC}"
    echo -e "${BLUE} Ready to Deploy! Use these commands:${NC}"
    echo -e "${BLUE}================================================${NC}"
    echo ""
    echo "1. Copy project to server:"
    echo "   rsync -avz --exclude='.git' --exclude='node_modules' ./ $SERVER_USER@$SERVER_IP:/tmp/locallytrip/"
    echo ""
    echo "2. SSH to server and deploy:"
    echo "   ssh -i $SSH_KEY_PATH $SERVER_USER@$SERVER_IP"
    echo "   cd /tmp/locallytrip"
    echo "   sudo ./deploy-ubuntu.sh"
    echo ""
    echo "3. Monitor deployment:"
    echo "   tail -f /var/log/locallytrip-deploy.log"
    echo ""
    echo "4. Check application status:"
    echo "   docker ps"
    echo "   curl http://localhost:3001/health"
    echo ""
    echo -e "${GREEN}Domain will be available at: https://$DOMAIN${NC}"
    echo -e "${GREEN}Admin panel at: https://admin.$DOMAIN${NC}"
}

main() {
    print_header
    
    log "Starting pre-deployment validation..."
    
    # Check local prerequisites
    if [[ ! -f "$SSH_KEY_PATH" ]]; then
        error "SSH key not found at $SSH_KEY_PATH"
    fi
    
    # Server checks
    check_ssh_connection
    check_server_specs
    check_docker_installation
    check_firewall_status
    check_system_resources
    
    # Network and domain checks
    check_dns_configuration
    check_ssl_certificates
    test_network_connectivity
    
    # Generate deployment commands
    generate_deployment_command
    
    echo -e "${GREEN}================================================${NC}"
    echo -e "${GREEN} ✅ Pre-deployment validation complete!${NC}"
    echo -e "${GREEN} Server is ready for LocallyTrip deployment${NC}"
    echo -e "${GREEN}================================================${NC}"
}

# Handle script arguments
case "${1:-validate}" in
    "validate")
        main
        ;;
    "ssh-test")
        check_ssh_connection
        ;;
    "specs")
        check_server_specs
        ;;
    "docker")
        check_docker_installation
        ;;
    *)
        echo "Usage: $0 [validate|ssh-test|specs|docker]"
        exit 1
        ;;
esac