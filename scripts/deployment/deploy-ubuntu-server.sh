#!/bin/bash

# LocallyTrip Ubuntu Server Deployment Script
# Optimized for Ubuntu server with project in /home/locallytrip
# Usage: ./deploy-ubuntu-server.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Deployment configuration
DEPLOYMENT_START_TIME=$(date)
LOG_FILE="deployment-ubuntu-$(date +%Y%m%d-%H%M%S).log"
BACKUP_DIR="/home/locallytrip/backups/backup-$(date +%Y%m%d-%H%M%S)"
PROJECT_DIR="/home/locallytrip/locallytrip"

# Deployment options
SKIP_SSL=false
SKIP_SEED=false
FORCE_SEED=false
CHECK_ONLY=false
INSTALL_DEPS_ONLY=false
UPDATE_ONLY=false
BACKUP_ONLY=false

# Function to print colored output with logging
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$LOG_FILE"
}

info() {
    echo -e "${PURPLE}[INFO]${NC} $1" | tee -a "$LOG_FILE"
}

# Function to print deployment header
print_header() {
    echo -e "${BLUE}================================================================${NC}"
    echo -e "${BLUE}🚀 LocallyTrip Ubuntu Server Deployment${NC}"
    echo -e "${BLUE}================================================================${NC}"
    echo -e "${BLUE}Started: $DEPLOYMENT_START_TIME${NC}"
    echo -e "${BLUE}Project Directory: $PROJECT_DIR${NC}"
    echo -e "${BLUE}Backup Directory: $BACKUP_DIR${NC}"
    echo -e "${BLUE}Log file: $LOG_FILE${NC}"
    echo -e "${BLUE}================================================================${NC}"
    echo ""
}

# Function to check if we're in the right directory
check_directory() {
    log "📁 Verifying deployment directory..."
    
    if [ ! -d "$PROJECT_DIR" ]; then
        error "❌ Project directory $PROJECT_DIR not found"
        error "Please ensure project is cloned to /home/locallytrip/locallytrip"
        exit 1
    fi
    
    cd "$PROJECT_DIR"
    
    if [ ! -f "docker-compose.prod.yml" ]; then
        error "❌ docker-compose.prod.yml not found in $PROJECT_DIR"
        exit 1
    fi
    
    if [ ! -f ".env" ]; then
        error "❌ .env file not found. Please configure environment first"
        exit 1
    fi
    
    success "✅ Project directory verified: $PROJECT_DIR"
}

# Function to check system requirements
check_system_requirements() {
    log "🔍 Checking Ubuntu server requirements..."
    
    # Check OS
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        if [[ "$ID" == "ubuntu" ]]; then
            success "✅ Running on Ubuntu $VERSION"
        else
            warning "⚠️ Not running on Ubuntu (detected: $ID $VERSION)"
        fi
    fi
    
    # Check Docker
    if command -v docker >/dev/null 2>&1; then
        DOCKER_VERSION=$(docker --version | cut -d' ' -f3 | cut -d',' -f1)
        success "✅ Docker $DOCKER_VERSION installed"
        
        # Check if Docker daemon is running
        if docker info >/dev/null 2>&1; then
            success "✅ Docker daemon is running"
        else
            error "❌ Docker daemon is not running"
            log "Starting Docker daemon..."
            sudo systemctl start docker
            sudo systemctl enable docker
        fi
    else
        error "❌ Docker not installed"
        exit 1
    fi
    
    # Check Docker Compose
    if docker compose version >/dev/null 2>&1; then
        COMPOSE_VERSION=$(docker compose version --short 2>/dev/null || echo "unknown")
        success "✅ Docker Compose $COMPOSE_VERSION available"
    else
        error "❌ Docker Compose not available"
        exit 1
    fi
    
    # Check disk space
    AVAILABLE_SPACE=$(df / | tail -1 | awk '{print $4}')
    AVAILABLE_GB=$((AVAILABLE_SPACE / 1024 / 1024))
    if [ "$AVAILABLE_GB" -gt 5 ]; then
        success "✅ Sufficient disk space: ${AVAILABLE_GB}GB available"
    else
        warning "⚠️ Low disk space: ${AVAILABLE_GB}GB available (recommended: >5GB)"
    fi
    
    # Check memory
    TOTAL_MEM=$(free -m | awk 'NR==2{printf "%.0f", $2/1024}')
    if [ "$TOTAL_MEM" -gt 2 ]; then
        success "✅ Sufficient memory: ${TOTAL_MEM}GB total"
    else
        warning "⚠️ Low memory: ${TOTAL_MEM}GB total (recommended: >2GB)"
    fi
}

# Function to setup directories
setup_directories() {
    log "📁 Setting up Ubuntu server directories..."
    
    # Create backup directory
    mkdir -p "$BACKUP_DIR"
    mkdir -p "/home/locallytrip/backups"
    mkdir -p "/home/locallytrip/logs"
    
    # Create logs directory structure in project
    mkdir -p "$PROJECT_DIR/logs/nginx"
    mkdir -p "$PROJECT_DIR/logs/backend"
    mkdir -p "$PROJECT_DIR/logs/web"
    mkdir -p "$PROJECT_DIR/logs/admin"
    mkdir -p "$PROJECT_DIR/logs/postgres"
    mkdir -p "$PROJECT_DIR/logs/deployment"
    
    # Set proper permissions
    if [ "$USER" = "locallytrip" ]; then
        sudo chown -R locallytrip:locallytrip /home/locallytrip
    fi
    
    success "✅ Directory structure created"
}

# Function to validate environment configuration
validate_environment() {
    log "🔧 Validating environment configuration..."
    
    # Source environment variables
    source .env
    
    # Check critical variables
    if [ -z "$DB_PASSWORD" ] || [ "$DB_PASSWORD" = "your-secure-password" ]; then
        error "❌ DB_PASSWORD not properly configured in .env"
        exit 1
    fi
    
    if [ -z "$JWT_SECRET" ] || [ "$JWT_SECRET" = "your-super-secure-jwt-secret-key" ]; then
        error "❌ JWT_SECRET not properly configured in .env"
        exit 1
    fi
    
    if [ -z "$DOMAIN" ] || [ "$DOMAIN" = "locallytrip.com" ]; then
        warning "⚠️ DOMAIN still using default value in .env"
    fi
    
    # Check if environment is set to production
    if [ "$NODE_ENV" != "production" ]; then
        warning "⚠️ NODE_ENV is not set to 'production'"
    fi
    
    success "✅ Environment configuration validated"
}

# Function to backup existing deployment
backup_existing_deployment() {
    log "💾 Creating backup of existing deployment..."
    
    # Backup database if it exists
    if docker ps | grep -q "locallytrip-postgres-prod"; then
        log "📦 Backing up existing database..."
        docker exec locallytrip-postgres-prod pg_dump -U ${DB_USER:-locallytrip_prod_user} ${DB_NAME:-locallytrip_prod} > "$BACKUP_DIR/database_backup.sql" 2>/dev/null || true
        if [ -f "$BACKUP_DIR/database_backup.sql" ]; then
            gzip "$BACKUP_DIR/database_backup.sql"
            success "✅ Database backup created"
        fi
    fi
    
    # Backup uploads and images
    if [ -d "backend/public/uploads" ]; then
        cp -r backend/public/uploads "$BACKUP_DIR/" 2>/dev/null || true
        success "✅ Uploads backed up"
    fi
    
    if [ -d "backend/public/images" ]; then
        cp -r backend/public/images "$BACKUP_DIR/" 2>/dev/null || true
        success "✅ Images backed up"
    fi
    
    # Backup .env file
    if [ -f ".env" ]; then
        cp .env "$BACKUP_DIR/env_backup" 2>/dev/null || true
        success "✅ Environment file backed up"
    fi
    
    # Backup SSL certificates
    if [ -d "ssl" ]; then
        cp -r ssl "$BACKUP_DIR/" 2>/dev/null || true
        success "✅ SSL certificates backed up"
    fi
    
    success "✅ Backup completed in $BACKUP_DIR"
}

# Function to stop existing services
stop_existing_services() {
    log "⏹️ Stopping existing services..."
    
    # Stop production services
    docker compose -f docker-compose.prod.yml down --remove-orphans 2>/dev/null || true
    
    # Stop development services
    docker compose down --remove-orphans 2>/dev/null || true
    
    # Clean up any remaining containers
    docker container prune -f 2>/dev/null || true
    
    success "✅ Existing services stopped"
}

# Function to clean up Docker resources
cleanup_docker() {
    log "🧹 Cleaning up Docker resources..."
    
    # Remove old containers
    docker container prune -f 2>/dev/null || true
    
    # Remove unused images (keep recent ones)
    docker image prune -f 2>/dev/null || true
    
    # Remove unused networks
    docker network prune -f 2>/dev/null || true
    
    # Remove unused volumes (be careful here)
    docker volume prune -f 2>/dev/null || true
    
    success "✅ Docker cleanup completed"
}

# Function to setup SSL certificates
setup_ssl() {
    # Skip SSL if requested
    if [ "$SKIP_SSL" = true ]; then
        log "🔒 SSL setup skipped (--no-ssl flag)"
        return 0
    fi
    
    log "🔒 Setting up SSL certificates..."
    
    # Generate nginx configuration first
    if [ -f "./generate-nginx-config.sh" ]; then
        log "🔧 Generating nginx configuration for domain: ${DOMAIN:-localhost}"
        ./generate-nginx-config.sh
    fi
    
    if [ ! -f "ssl/cert.pem" ] || [ ! -f "ssl/key.pem" ]; then
        if [ -f "./setup-ssl.sh" ]; then
            chmod +x ./setup-ssl.sh
            log "🔧 Running SSL setup script..."
            
            # Check if we should use Let's Encrypt or self-signed
            if [ "$SSL_MODE" = "letsencrypt" ] && [ ! -z "$DOMAIN" ] && [ "$DOMAIN" != "localhost" ]; then
                info "📋 Setting up Let's Encrypt SSL certificates for $DOMAIN..."
                ./setup-ssl.sh <<< "2" # Select option 2 (Let's Encrypt)
            else
                warning "⚠️ Using self-signed certificates"
                ./setup-ssl.sh <<< "1" # Select option 1 (self-signed)
            fi
            
            success "✅ SSL certificates configured"
        else
            error "❌ SSL setup script not found"
            exit 1
        fi
    else
        success "✅ SSL certificates already exist"
    fi
}

# Function to seed database if needed
seed_database_if_needed() {
    # Skip seeding if requested
    if [ "$SKIP_SEED" = true ]; then
        log "🌱 Database seeding skipped (--no-seed flag)"
        return 0
    fi
    
    log "🌱 Checking if database seeding is needed..."
    
    # Check if tables exist (indicating database is already seeded)
    if [ "$FORCE_SEED" = false ] && docker exec locallytrip-postgres-prod psql -U ${DB_USER:-locallytrip_prod_user} -d ${DB_NAME:-locallytrip_prod} -c "\dt" 2>/dev/null | grep -q "users"; then
        success "✅ Database already seeded"
        return 0
    fi
    
    if [ "$FORCE_SEED" = true ]; then
        log "🌱 Force seeding requested, proceeding with database seeding..."
    else
        log "🌱 Database appears empty, starting seeding process..."
    fi
    
    # Check if seeding script exists
    if [ ! -f "./seed-database-complete.sh" ]; then
        error "❌ Database seeding script not found"
        warning "Please run './seed-database-complete.sh' manually after deployment"
        return 1
    fi
    
    # Make seeding script executable
    chmod +x ./seed-database-complete.sh
    
    # Run database seeding
    log "🌱 Running database seeding (this may take a few minutes)..."
    if ./seed-database-complete.sh; then
        success "✅ Database seeding completed successfully"
    else
        error "❌ Database seeding failed"
        warning "You may need to run './seed-database-complete.sh' manually"
        return 1
    fi
}

# Function to build and start services
build_and_start_services() {
    log "🔨 Building and starting production services..."
    
    # Pull base images to ensure we have latest
    log "📥 Pulling base Docker images..."
    docker compose -f docker-compose.prod.yml pull postgres nginx 2>/dev/null || true
    
    # Build application images
    log "🔨 Building application images..."
    docker compose -f docker-compose.prod.yml build --no-cache
    
    # Start services with nginx configuration override
    log "🚀 Starting production services..."
    if [ -f "docker-compose.nginx.yml" ]; then
        docker compose -f docker-compose.prod.yml -f docker-compose.nginx.yml up -d
    else
        docker compose -f docker-compose.prod.yml up -d
    fi
    
    success "✅ Services built and started"
}

# Function to wait for services to be ready
wait_for_services() {
    log "⏳ Waiting for services to be ready..."
    
    # Wait for database
    log "🗄️ Waiting for database..."
    for i in {1..30}; do
        if docker exec locallytrip-postgres-prod pg_isready -U ${DB_USER:-locallytrip_prod_user} -d ${DB_NAME:-locallytrip_prod} >/dev/null 2>&1; then
            success "✅ Database is ready"
            break
        fi
        sleep 2
        echo -n "."
    done
    
    # Seed database if requested or if fresh installation
    seed_database_if_needed
    
    # Wait for backend
    log "🔧 Waiting for backend API..."
    for i in {1..30}; do
        if curl -f http://localhost:3001/health >/dev/null 2>&1; then
            success "✅ Backend API is ready"
            break
        fi
        sleep 2
        echo -n "."
    done
    
    # Wait for frontend
    log "🌐 Waiting for frontend..."
    for i in {1..30}; do
        if curl -f http://localhost:3000 >/dev/null 2>&1; then
            success "✅ Frontend is ready"
            break
        fi
        sleep 2
        echo -n "."
    done
    
    # Wait for nginx
    log "🔀 Waiting for nginx..."
    for i in {1..30}; do
        if curl -k -f https://localhost/health >/dev/null 2>&1; then
            success "✅ Nginx is ready"
            break
        fi
        sleep 2
        echo -n "."
    done
}

# Function to run health checks
run_health_checks() {
    log "🔍 Running comprehensive health checks..."
    
    # Check container status
    log "📊 Checking container status..."
    CONTAINERS_STATUS=$(docker compose -f docker-compose.prod.yml ps --format "table {{.Name}}\t{{.Status}}")
    echo "$CONTAINERS_STATUS"
    
    # Check if all containers are running
    if docker compose -f docker-compose.prod.yml ps | grep -q "Exit"; then
        error "❌ Some containers have exited"
        docker compose -f docker-compose.prod.yml logs
        exit 1
    fi
    
    # Test endpoints
    log "🌐 Testing endpoints..."
    
    # Test local endpoints
    if curl -f http://localhost:3001/health >/dev/null 2>&1; then
        success "✅ Backend health check passed"
    else
        error "❌ Backend health check failed"
    fi
    
    if curl -f http://localhost:3000 >/dev/null 2>&1; then
        success "✅ Frontend health check passed"
    else
        error "❌ Frontend health check failed"
    fi
    
    if curl -k -f https://localhost/health >/dev/null 2>&1; then
        success "✅ Nginx SSL health check passed"
    else
        warning "⚠️ Nginx SSL health check failed (may be normal for self-signed certs)"
    fi
    
    # Database connectivity test
    if docker exec locallytrip-postgres-prod psql -U ${DB_USER:-locallytrip_prod_user} -d ${DB_NAME:-locallytrip_prod} -c "SELECT 1;" >/dev/null 2>&1; then
        success "✅ Database connectivity test passed"
    else
        error "❌ Database connectivity test failed"
    fi
}

# Function to show deployment summary
show_deployment_summary() {
    echo ""
    echo -e "${GREEN}================================================================${NC}"
    echo -e "${GREEN}🎉 LocallyTrip Ubuntu Deployment Completed Successfully!${NC}"
    echo -e "${GREEN}================================================================${NC}"
    echo ""
    echo -e "${BLUE}📊 Deployment Summary:${NC}"
    echo -e "${BLUE}├─ Started:${NC} $DEPLOYMENT_START_TIME"
    echo -e "${BLUE}├─ Completed:${NC} $(date)"
    echo -e "${BLUE}├─ Project Directory:${NC} $PROJECT_DIR"
    echo -e "${BLUE}├─ Backup Directory:${NC} $BACKUP_DIR"
    echo -e "${BLUE}└─ Log File:${NC} $LOG_FILE"
    echo ""
    echo -e "${BLUE}🌐 Access URLs:${NC}"
    echo -e "${BLUE}├─ Main Website:${NC} https://localhost (or https://$DOMAIN)"
    echo -e "${BLUE}├─ Admin Dashboard:${NC} https://localhost/admin (or https://admin.$DOMAIN)"
    echo -e "${BLUE}├─ API Health:${NC} https://localhost/api/v1/health"
    echo -e "${BLUE}└─ Backend Direct:${NC} http://localhost:3001/health"
    echo ""
    echo -e "${BLUE}🐳 Docker Commands:${NC}"
    echo -e "${BLUE}├─ View Status:${NC} docker compose -f docker-compose.prod.yml ps"
    echo -e "${BLUE}├─ View Logs:${NC} docker compose -f docker-compose.prod.yml logs"
    echo -e "${BLUE}├─ Restart Service:${NC} docker compose -f docker-compose.prod.yml restart [service]"
    echo -e "${BLUE}└─ Stop All:${NC} docker compose -f docker-compose.prod.yml down"
    echo ""
    echo -e "${BLUE}📋 Next Steps:${NC}"
    echo -e "${BLUE}├─ Configure domain DNS to point to this server${NC}"
    echo -e "${BLUE}├─ Update firewall rules if needed (ports 80, 443, 22)${NC}"
    echo -e "${BLUE}├─ Setup SSL certificate renewal (crontab)${NC}"
    echo -e "${BLUE}├─ Configure backup schedule${NC}"
    echo -e "${BLUE}└─ Setup monitoring and alerting${NC}"
    echo ""
    echo -e "${GREEN}🚀 Your LocallyTrip application is now running in production mode!${NC}"
    echo ""
}

# Function to show help
show_help() {
    cat << EOF
Ubuntu Server Deployment Script for LocallyTrip

USAGE:
    $0 [OPTIONS]

OPTIONS:
    -h, --help         Show this help message
    --check-only       Only run prerequisites check
    --install-deps     Only install dependencies
    --no-ssl          Skip SSL configuration
    --no-seed         Skip database seeding
    --force-seed      Force database reseeding even if data exists
    --update          Update existing deployment
    --backup-only     Only create backup, don't deploy

EXAMPLES:
    $0                     # Full deployment with SSL and seeding
    $0 --check-only        # Check prerequisites only
    $0 --no-ssl            # Deploy without SSL (development)
    $0 --force-seed        # Deploy and force database reseeding
    $0 --update            # Update existing deployment

DESCRIPTION:
    This script deploys the LocallyTrip platform on Ubuntu Server with:
    - Docker container orchestration
    - SSL certificate management
    - Database seeding with sample data
    - Nginx reverse proxy configuration
    - Health checks and monitoring setup

EOF
}

# Function to parse command line arguments
parse_arguments() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_help
                exit 0
                ;;
            --check-only)
                CHECK_ONLY=true
                shift
                ;;
            --install-deps)
                INSTALL_DEPS_ONLY=true
                shift
                ;;
            --no-ssl)
                SKIP_SSL=true
                shift
                ;;
            --no-seed)
                SKIP_SEED=true
                shift
                ;;
            --force-seed)
                FORCE_SEED=true
                shift
                ;;
            --update)
                UPDATE_ONLY=true
                shift
                ;;
            --backup-only)
                BACKUP_ONLY=true
                shift
                ;;
            *)
                error "❌ Unknown option: $1"
                show_help
                exit 1
                ;;
        esac
    done
}

# Main deployment function
main() {
    # Parse command line arguments
    parse_arguments "$@"
    
    print_header
    
    # Handle different execution modes
    if [ "$CHECK_ONLY" = true ]; then
        log "🔍 Running prerequisites check only..."
        check_directory
        check_system_requirements
        validate_environment
        success "✅ Prerequisites check completed"
        return 0
    fi
    
    if [ "$BACKUP_ONLY" = true ]; then
        log "💾 Running backup only..."
        check_directory
        validate_environment
        backup_existing_deployment
        success "✅ Backup completed"
        return 0
    fi
    
    # Run deployment steps
    check_directory
    check_system_requirements
    setup_directories
    validate_environment
    
    if [ "$UPDATE_ONLY" = false ]; then
        backup_existing_deployment
    fi
    
    stop_existing_services
    cleanup_docker
    setup_ssl
    build_and_start_services
    wait_for_services
    run_health_checks
    
    # Show completion summary
    show_deployment_summary
}

# Handle script interruption
trap 'error "❌ Deployment interrupted"; exit 1' INT TERM

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    warning "⚠️ Running as root. Consider using user 'locallytrip' for better security."
fi

# Run main deployment
main "$@"
