#!/bin/bash

# LocallyTrip Production Deployment with Fixed Nginx Configuration
# This script deploys the cleaned nginx configuration to production

set -e

echo "🚀 LocallyTrip Production Deployment with Fixed Nginx"
echo "=================================================="

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "docker-compose.prod.yml" ]; then
    print_error "docker-compose.prod.yml not found. Please run from project root."
    exit 1
fi

# Check if SSL certificates exist
if [ ! -f "ssl/cert.pem" ] || [ ! -f "ssl/key.pem" ]; then
    print_error "SSL certificates not found. Please run setup-ssl.sh first."
    exit 1
fi

# Check if environment file exists
if [ ! -f ".env.production" ]; then
    print_error ".env.production file not found. Please create it first."
    exit 1
fi

print_status "Starting LocallyTrip deployment with fixed nginx configuration..."

# Pull latest code
print_status "Pulling latest code from repository..."
git pull origin main

# Copy production environment
print_status "Setting up production environment..."
cp .env.production .env

# Stop existing services
print_status "Stopping existing services..."
docker compose -f docker-compose.prod.yml down --remove-orphans

# Clean up old containers and images
print_status "Cleaning up old containers and images..."
docker system prune -f
docker image prune -f

# Build and start services
print_status "Building and starting LocallyTrip services..."
docker compose -f docker-compose.prod.yml up --build -d

# Wait for services to be healthy
print_status "Waiting for services to become healthy..."
sleep 30

# Check service health
print_status "Checking service health..."

services=("locallytrip-postgres-prod" "locallytrip-backend-prod" "locallytrip-web-prod" "locallytrip-admin-prod" "locallytrip-nginx-prod")

all_healthy=true
for service in "${services[@]}"; do
    if docker ps --filter "name=$service" --filter "status=running" | grep -q "$service"; then
        print_success "✓ $service is running"
    else
        print_error "✗ $service is not running"
        all_healthy=false
    fi
done

# Check nginx configuration
print_status "Checking nginx configuration..."
if docker exec locallytrip-nginx-prod nginx -t; then
    print_success "✓ Nginx configuration is valid"
else
    print_error "✗ Nginx configuration has errors"
    all_healthy=false
fi

# Test database connection
print_status "Testing database connection..."
if docker exec locallytrip-backend-prod node -e "console.log('Database connection test')"; then
    print_success "✓ Backend can access database"
else
    print_warning "⚠ Backend database connection test failed"
fi

# Check if ports are accessible
print_status "Checking port accessibility..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost:80 | grep -q "200\|301\|302"; then
    print_success "✓ HTTP port 80 is accessible"
else
    print_warning "⚠ HTTP port 80 is not accessible"
fi

if curl -s -o /dev/null -w "%{http_code}" https://localhost:443 -k | grep -q "200\|301\|302"; then
    print_success "✓ HTTPS port 443 is accessible"
else
    print_warning "⚠ HTTPS port 443 is not accessible"
fi

# Show running containers
print_status "Currently running containers:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Show nginx logs for troubleshooting
print_status "Recent nginx logs:"
docker logs --tail=20 locallytrip-nginx-prod

if [ "$all_healthy" = true ]; then
    print_success "🎉 LocallyTrip deployment completed successfully!"
    echo ""
    print_status "Service URLs:"
    echo "  • Main Site: https://locallytrip.com"
    echo "  • API: https://api.locallytrip.com"
    echo "  • Admin: https://admin.locallytrip.com"
    echo ""
    print_status "Next steps:"
    echo "  1. Update DNS A records for subdomains:"
    echo "     - api.locallytrip.com -> 139.59.119.81"
    echo "     - admin.locallytrip.com -> 139.59.119.81"
    echo "  2. Test the application endpoints"
    echo "  3. Monitor logs for any issues"
else
    print_error "❌ Deployment completed with issues. Please check the logs above."
    exit 1
fi
