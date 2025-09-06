#!/bin/bash

# LocallyTrip Pre-deployment Readiness Checker
# This script validates system requirements before deployment
# Usage: ./check-deployment-readiness.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
CHECKS_PASSED=0
CHECKS_FAILED=0
CHECKS_WARNING=0

# Function to print colored output
print_header() {
    echo -e "${BLUE}================================================${NC}"
    echo -e "${BLUE}🔍 LocallyTrip Deployment Readiness Checker${NC}"
    echo -e "${BLUE}================================================${NC}"
    echo ""
}

print_check() {
    echo -e "${BLUE}[CHECK]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[✓ PASS]${NC} $1"
    ((CHECKS_PASSED++))
}

print_error() {
    echo -e "${RED}[✗ FAIL]${NC} $1"
    ((CHECKS_FAILED++))
}

print_warning() {
    echo -e "${YELLOW}[⚠ WARN]${NC} $1"
    ((CHECKS_WARNING++))
}

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check Docker installation and version
check_docker() {
    print_check "Checking Docker installation..."
    
    if command_exists docker; then
        DOCKER_VERSION=$(docker --version | cut -d' ' -f3 | cut -d',' -f1)
        DOCKER_MAJOR=$(echo $DOCKER_VERSION | cut -d'.' -f1)
        DOCKER_MINOR=$(echo $DOCKER_VERSION | cut -d'.' -f2)
        
        if [ "$DOCKER_MAJOR" -gt 20 ] || ([ "$DOCKER_MAJOR" -eq 20 ] && [ "$DOCKER_MINOR" -ge 10 ]); then
            print_success "Docker $DOCKER_VERSION installed (requirement: 20.10+)"
        else
            print_error "Docker $DOCKER_VERSION is too old (requirement: 20.10+)"
        fi
        
        # Check if Docker daemon is running
        if docker info >/dev/null 2>&1; then
            print_success "Docker daemon is running"
        else
            print_error "Docker daemon is not running or not accessible"
        fi
    else
        print_error "Docker is not installed"
    fi
}

# Check Docker Compose installation and version
check_docker_compose() {
    print_check "Checking Docker Compose installation..."
    
    if command_exists docker && docker compose version >/dev/null 2>&1; then
        COMPOSE_VERSION=$(docker compose version --short 2>/dev/null || docker compose version | grep -o 'v[0-9][0-9.]*' | head -1 | sed 's/v//')
        COMPOSE_MAJOR=$(echo $COMPOSE_VERSION | cut -d'.' -f1)
        
        if [ "$COMPOSE_MAJOR" -ge 2 ]; then
            print_success "Docker Compose $COMPOSE_VERSION installed (requirement: 2.0+)"
        else
            print_error "Docker Compose $COMPOSE_VERSION is too old (requirement: 2.0+)"
        fi
    elif command_exists docker-compose; then
        COMPOSE_VERSION=$(docker-compose --version | cut -d' ' -f4 | cut -d',' -f1)
        print_warning "Using legacy docker-compose $COMPOSE_VERSION (recommend: docker compose v2.0+)"
    else
        print_error "Docker Compose is not installed"
    fi
}

# Check system resources
check_system_resources() {
    print_check "Checking system resources..."
    
    # Check available memory
    if command_exists free; then
        AVAILABLE_RAM=$(free -m | awk 'NR==2{printf "%.0f", $7}')
        TOTAL_RAM=$(free -m | awk 'NR==2{printf "%.0f", $2}')
    elif command_exists vm_stat; then
        # macOS
        PAGE_SIZE=$(vm_stat | grep "page size" | awk '{print $8}')
        FREE_PAGES=$(vm_stat | grep "Pages free" | awk '{print $3}' | sed 's/\.//')
        AVAILABLE_RAM=$((FREE_PAGES * PAGE_SIZE / 1024 / 1024))
        TOTAL_RAM=$(sysctl -n hw.memsize | awk '{print $1/1024/1024}')
    else
        print_warning "Cannot determine memory usage"
        AVAILABLE_RAM=0
        TOTAL_RAM=0
    fi
    
    if [ "$TOTAL_RAM" -ge 4096 ]; then
        print_success "Total RAM: ${TOTAL_RAM}MB (requirement: 4GB+)"
    elif [ "$TOTAL_RAM" -ge 2048 ]; then
        print_warning "Total RAM: ${TOTAL_RAM}MB (recommended: 4GB+, minimum: 2GB)"
    else
        print_error "Total RAM: ${TOTAL_RAM}MB (requirement: minimum 2GB)"
    fi
    
    # Check available disk space
    AVAILABLE_DISK=$(df . | tail -1 | awk '{print $4}')
    AVAILABLE_DISK_GB=$((AVAILABLE_DISK / 1024 / 1024))
    
    if [ "$AVAILABLE_DISK_GB" -ge 20 ]; then
        print_success "Available disk space: ${AVAILABLE_DISK_GB}GB (requirement: 20GB+)"
    elif [ "$AVAILABLE_DISK_GB" -ge 10 ]; then
        print_warning "Available disk space: ${AVAILABLE_DISK_GB}GB (recommended: 20GB+)"
    else
        print_error "Available disk space: ${AVAILABLE_DISK_GB}GB (requirement: minimum 10GB)"
    fi
}

# Check network ports availability
check_ports() {
    print_check "Checking port availability..."
    
    REQUIRED_PORTS=(80 443 5432)
    
    for port in "${REQUIRED_PORTS[@]}"; do
        if command_exists netstat; then
            if netstat -tuln | grep ":$port " >/dev/null 2>&1; then
                print_warning "Port $port is already in use"
            else
                print_success "Port $port is available"
            fi
        elif command_exists lsof; then
            if lsof -i ":$port" >/dev/null 2>&1; then
                print_warning "Port $port is already in use"
            else
                print_success "Port $port is available"
            fi
        else
            print_warning "Cannot check port $port availability (netstat/lsof not found)"
        fi
    done
}

# Check Git installation and repository
check_git() {
    print_check "Checking Git and repository..."
    
    if command_exists git; then
        GIT_VERSION=$(git --version | cut -d' ' -f3)
        print_success "Git $GIT_VERSION installed"
        
        if git rev-parse --git-dir >/dev/null 2>&1; then
            CURRENT_BRANCH=$(git branch --show-current)
            print_success "Git repository detected (branch: $CURRENT_BRANCH)"
            
            # Check if there are uncommitted changes
            if [ -n "$(git status --porcelain)" ]; then
                print_warning "Uncommitted changes detected"
            else
                print_success "Working directory is clean"
            fi
        else
            print_error "Not in a Git repository"
        fi
    else
        print_error "Git is not installed"
    fi
}

# Check environment files
check_environment() {
    print_check "Checking environment configuration..."
    
    if [ -f ".env.production" ]; then
        print_success ".env.production template found"
        
        # Check critical environment variables
        CRITICAL_VARS=("DB_PASSWORD" "JWT_SECRET" "DOMAIN" "SSL_EMAIL")
        
        for var in "${CRITICAL_VARS[@]}"; do
            if grep -q "^${var}=" .env.production; then
                VALUE=$(grep "^${var}=" .env.production | cut -d'=' -f2-)
                if [ -n "$VALUE" ] && [ "$VALUE" != "your-secure-password" ] && [ "$VALUE" != "your-domain.com" ]; then
                    print_success "Environment variable $var is configured"
                else
                    print_warning "Environment variable $var needs to be updated"
                fi
            else
                print_error "Environment variable $var is missing"
            fi
        done
    else
        print_error ".env.production file not found"
    fi
    
    if [ -f ".env" ]; then
        print_info ".env file found (will be used for deployment)"
    else
        print_info ".env file not found (will be created from .env.production)"
    fi
}

# Check required files
check_required_files() {
    print_check "Checking required deployment files..."
    
    REQUIRED_FILES=(
        "docker-compose.prod.yml"
        "nginx/nginx-prod-clean.conf"
        "nginx/conf.d/default.conf"
        "backend/Dockerfile"
        "web/Dockerfile"
        "web-admin/Dockerfile"
        "setup-ssl.sh"
        "seed-database-complete.sh"
    )
    
    for file in "${REQUIRED_FILES[@]}"; do
        if [ -f "$file" ]; then
            print_success "Required file found: $file"
        else
            print_error "Required file missing: $file"
        fi
    done
}

# Check SSL certificates (if they exist)
check_ssl() {
    print_check "Checking SSL certificates..."
    
    if [ -d "ssl" ]; then
        if [ -f "ssl/cert.pem" ] && [ -f "ssl/key.pem" ]; then
            print_success "SSL certificates found"
            
            # Check certificate validity
            if openssl x509 -in ssl/cert.pem -text -noout >/dev/null 2>&1; then
                CERT_EXPIRY=$(openssl x509 -in ssl/cert.pem -enddate -noout | cut -d= -f2)
                print_success "SSL certificate is valid (expires: $CERT_EXPIRY)"
            else
                print_error "SSL certificate is invalid"
            fi
        else
            print_warning "SSL certificates not found (will be generated during deployment)"
        fi
    else
        print_info "SSL directory not found (will be created during deployment)"
    fi
}

# Check domain resolution (if domain is configured)
check_domain() {
    print_check "Checking domain configuration..."
    
    if [ -f ".env.production" ]; then
        DOMAIN=$(grep "^DOMAIN=" .env.production | cut -d'=' -f2 | tr -d '"' | tr -d "'")
        
        if [ -n "$DOMAIN" ] && [ "$DOMAIN" != "your-domain.com" ] && [ "$DOMAIN" != "locallytrip.com" ]; then
            if command_exists dig; then
                if dig +short "$DOMAIN" >/dev/null 2>&1; then
                    IP=$(dig +short "$DOMAIN" | tail -1)
                    print_success "Domain $DOMAIN resolves to $IP"
                else
                    print_warning "Domain $DOMAIN does not resolve"
                fi
            elif command_exists nslookup; then
                if nslookup "$DOMAIN" >/dev/null 2>&1; then
                    print_success "Domain $DOMAIN resolves"
                else
                    print_warning "Domain $DOMAIN does not resolve"
                fi
            else
                print_info "Cannot check domain resolution (dig/nslookup not found)"
            fi
        else
            print_info "Domain not configured or using default value"
        fi
    fi
}

# Summary function
print_summary() {
    echo ""
    echo -e "${BLUE}================================================${NC}"
    echo -e "${BLUE}📊 DEPLOYMENT READINESS SUMMARY${NC}"
    echo -e "${BLUE}================================================${NC}"
    echo ""
    
    echo -e "✅ Checks Passed: ${GREEN}$CHECKS_PASSED${NC}"
    echo -e "⚠️  Warnings: ${YELLOW}$CHECKS_WARNING${NC}"
    echo -e "❌ Checks Failed: ${RED}$CHECKS_FAILED${NC}"
    echo ""
    
    TOTAL_CHECKS=$((CHECKS_PASSED + CHECKS_FAILED + CHECKS_WARNING))
    SCORE=$((CHECKS_PASSED * 100 / TOTAL_CHECKS))
    
    if [ "$CHECKS_FAILED" -eq 0 ]; then
        if [ "$CHECKS_WARNING" -eq 0 ]; then
            echo -e "${GREEN}🎉 READY FOR DEPLOYMENT!${NC}"
            echo -e "Score: ${GREEN}${SCORE}%${NC} - All systems go!"
        else
            echo -e "${YELLOW}⚠️  READY WITH WARNINGS${NC}"
            echo -e "Score: ${YELLOW}${SCORE}%${NC} - Deployment possible but review warnings"
        fi
        echo ""
        echo -e "${GREEN}Next step:${NC} Run ./deploy-production-complete.sh"
    else
        echo -e "${RED}❌ NOT READY FOR DEPLOYMENT${NC}"
        echo -e "Score: ${RED}${SCORE}%${NC} - Please fix failed checks before deploying"
        echo ""
        echo -e "${RED}Required actions:${NC}"
        echo "1. Fix all failed checks above"
        echo "2. Re-run this script to verify"
        echo "3. Then run ./deploy-production-complete.sh"
    fi
    
    echo ""
    echo -e "${BLUE}================================================${NC}"
}

# Main execution
main() {
    print_header
    
    check_docker
    check_docker_compose
    check_system_resources
    check_ports
    check_git
    check_environment
    check_required_files
    check_ssl
    check_domain
    
    print_summary
    
    # Exit with error code if there are failed checks
    if [ "$CHECKS_FAILED" -gt 0 ]; then
        exit 1
    else
        exit 0
    fi
}

# Run main function
main "$@"
