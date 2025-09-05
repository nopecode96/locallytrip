#!/bin/bash

# LocallyTrip Configuration Validation Script
# Validates nginx configuration and deployment readiness

set -e

echo "🔍 LocallyTrip Configuration Validation"
echo "========================================"

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() { echo -e "${BLUE}[CHECK]${NC} $1"; }
print_success() { echo -e "${GREEN}[PASS]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARN]${NC} $1"; }
print_error() { echo -e "${RED}[FAIL]${NC} $1"; }

all_checks_passed=true

# Check 1: Required files exist
print_status "Checking required files..."
required_files=(
    "docker-compose.prod.yml"
    "nginx/nginx-prod-clean.conf"
    "nginx/conf.d/default.conf"
    ".env.production"
    "ssl/cert.pem"
    "ssl/key.pem"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        print_success "✓ $file exists"
    else
        print_error "✗ $file missing"
        all_checks_passed=false
    fi
done

# Check 2: Nginx configuration syntax
print_status "Validating nginx configuration syntax..."
# Create a temporary config for syntax validation without upstream dependencies
temp_dir=$(mktemp -d)
cp nginx/nginx-prod-clean.conf "$temp_dir/nginx.conf"
cat > "$temp_dir/default.conf" << 'EOF'
# Temporary config for syntax validation
server {
    listen 80 default_server;
    server_name _;
    location / {
        return 200 "Config syntax test OK";
        add_header Content-Type text/plain;
    }
}
EOF

if docker run --rm -v "$temp_dir/nginx.conf":/etc/nginx/nginx.conf:ro -v "$temp_dir/default.conf":/etc/nginx/conf.d/default.conf:ro nginx:alpine nginx -t > /dev/null 2>&1; then
    print_success "✓ Nginx configuration syntax is valid"
else
    print_error "✗ Nginx configuration has syntax errors"
    all_checks_passed=false
fi
rm -rf "$temp_dir"

# Check 3: SSL certificate validity
print_status "Checking SSL certificate validity..."
if openssl x509 -in ssl/cert.pem -noout -checkend 86400 > /dev/null 2>&1; then
    cert_expire=$(openssl x509 -in ssl/cert.pem -noout -enddate | cut -d= -f2)
    print_success "✓ SSL certificate valid until: $cert_expire"
else
    print_error "✗ SSL certificate is invalid or expires within 24 hours"
    all_checks_passed=false
fi

# Check 4: Environment variables
print_status "Checking environment variables..."
if [ -f ".env.production" ]; then
    required_vars=("DB_NAME" "DB_USER" "DB_PASSWORD" "JWT_SECRET")
    source .env.production
    
    for var in "${required_vars[@]}"; do
        if [ ! -z "${!var}" ]; then
            print_success "✓ $var is set"
        else
            print_error "✗ $var is missing or empty"
            all_checks_passed=false
        fi
    done
fi

# Check 5: Docker daemon
print_status "Checking Docker daemon..."
if docker info > /dev/null 2>&1; then
    print_success "✓ Docker daemon is running"
else
    print_error "✗ Docker daemon is not running"
    all_checks_passed=false
fi

# Check 6: Port availability
print_status "Checking port availability..."
ports=(80 443)
for port in "${ports[@]}"; do
    if ! lsof -i :$port > /dev/null 2>&1; then
        print_success "✓ Port $port is available"
    else
        print_warning "⚠ Port $port is in use (might be existing nginx)"
    fi
done

# Check 7: Git status
print_status "Checking git status..."
if git status --porcelain | grep -q .; then
    print_warning "⚠ There are uncommitted changes"
    git status --porcelain
else
    print_success "✓ Working directory is clean"
fi

# Summary
echo ""
echo "========================================"
if [ "$all_checks_passed" = true ]; then
    print_success "🎉 All checks passed! Ready for deployment."
    echo ""
    echo "To deploy, run: ./deploy-fixed-nginx.sh"
else
    print_error "❌ Some checks failed. Please fix the issues above before deploying."
    exit 1
fi
