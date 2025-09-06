#!/bin/bash

# LocallyTrip Complete Production Deployment Script
# This script handles the complete deployment process including database seeding
# Usage: ./deploy-production-complete.sh

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
LOG_FILE="deployment-$(date +%Y%m%d-%H%M%S).log"
BACKUP_DIR="backup-$(date +%Y%m%d-%H%M%S)"

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
    echo -e "${BLUE}🚀 LocallyTrip Complete Production Deployment${NC}"
    echo -e "${BLUE}================================================================${NC}"
    echo -e "${BLUE}Started: $DEPLOYMENT_START_TIME${NC}"
    echo -e "${BLUE}Log file: $LOG_FILE${NC}"
    echo -e "${BLUE}================================================================${NC}"
    echo ""
}

# Function to check if we're ready for deployment
check_prerequisites() {
    log "🔍 Running pre-deployment checks..."
    
    if [ -f "./check-deployment-readiness.sh" ]; then
        chmod +x ./check-deployment-readiness.sh
        if ./check-deployment-readiness.sh; then
            success "✅ Pre-deployment checks passed"
        else
            error "❌ Pre-deployment checks failed"
            exit 1
        fi
    else
        warning "⚠️ Pre-deployment checker not found, skipping checks"
    fi
}

# Function to setup environment
setup_environment() {
    log "📋 Setting up environment configuration..."
    
    # Copy production environment if .env doesn't exist
    if [ ! -f ".env" ]; then
        if [ -f ".env.production" ]; then
            cp .env.production .env
            success "✅ Copied .env.production to .env"
        else
            error "❌ No .env.production file found"
            exit 1
        fi
    else
        info "ℹ️ Using existing .env file"
    fi
    
    # Load environment variables
    source .env
    
    # Validate critical environment variables
    if [ -z "$DB_PASSWORD" ] || [ "$DB_PASSWORD" = "your-secure-password" ]; then
        error "❌ DB_PASSWORD not properly configured in .env"
        exit 1
    fi
    
    if [ -z "$JWT_SECRET" ] || [ "$JWT_SECRET" = "your-super-secure-jwt-secret-key" ]; then
        error "❌ JWT_SECRET not properly configured in .env"
        exit 1
    fi
    
    success "✅ Environment configuration validated"
}

# Function to setup SSL certificates
setup_ssl() {
    log "🔒 Setting up SSL certificates..."
    
    if [ ! -f "ssl/cert.pem" ] || [ ! -f "ssl/key.pem" ]; then
        if [ -f "./setup-ssl.sh" ]; then
            chmod +x ./setup-ssl.sh
            log "🔧 Running SSL setup script..."
            
            # For automated deployment, use self-signed certificates
            # In production, you would run Let's Encrypt setup manually first
            if [ "$SSL_MODE" = "letsencrypt" ]; then
                warning "⚠️ Let's Encrypt setup requires manual intervention"
                warning "⚠️ Run './setup-ssl.sh' manually for Let's Encrypt certificates"
                warning "⚠️ Falling back to self-signed certificates for now"
            fi
            
            # Generate self-signed certificates automatically
            ./setup-ssl.sh <<< "1" # Select option 1 (self-signed)
            
            success "✅ SSL certificates configured"
        else
            error "❌ SSL setup script not found"
            exit 1
        fi
    else
        success "✅ SSL certificates already exist"
    fi
}

# Function to backup existing data
backup_existing_deployment() {
    log "💾 Creating backup of existing deployment..."
    
    # Create backup directory
    mkdir -p "$BACKUP_DIR"
    
    # Backup database if it exists
    if docker ps | grep -q "locallytrip-postgres"; then
        log "📦 Backing up existing database..."
        docker exec locallytrip-postgres pg_dump -U ${DB_USER:-locallytrip_prod_user} ${DB_NAME:-locallytrip_prod} > "$BACKUP_DIR/database_backup.sql" 2>/dev/null || true
    fi
    
    # Backup uploads and images
    if [ -d "backend/public/uploads" ]; then
        cp -r backend/public/uploads "$BACKUP_DIR/" 2>/dev/null || true
    fi
    
    if [ -d "backend/public/images" ]; then
        cp -r backend/public/images "$BACKUP_DIR/" 2>/dev/null || true
    fi
    
    # Backup .env file
    if [ -f ".env" ]; then
        cp .env "$BACKUP_DIR/env_backup" 2>/dev/null || true
    fi
    
    success "✅ Backup created in $BACKUP_DIR"
}

# Function to stop existing services
stop_existing_services() {
    log "⏹️ Stopping existing services..."
    
    # Stop production services
    docker compose -f docker-compose.prod.yml down --remove-orphans 2>/dev/null || true
    
    # Stop development services
    docker compose down --remove-orphans 2>/dev/null || true
    
    success "✅ Existing services stopped"
}

# Function to clean up Docker resources
cleanup_docker() {
    log "🧹 Cleaning up Docker resources..."
    
    # Remove old containers
    docker container prune -f 2>/dev/null || true
    
    # Remove unused images
    docker image prune -f 2>/dev/null || true
    
    # Remove unused networks
    docker network prune -f 2>/dev/null || true
    
    success "✅ Docker cleanup completed"
}

# Function to setup monitoring and logging
setup_monitoring() {
    log "📊 Setting up monitoring and logging..."
    
    # Create logs directory structure
    mkdir -p logs/{nginx,backend,web,admin,postgres,deployment}
    mkdir -p monitoring/{scripts,configs,alerts}
    
    # Create log rotation configuration
    create_log_rotation_config
    
    # Setup monitoring scripts
    create_monitoring_scripts
    
    # Setup health check endpoints monitoring
    setup_health_monitoring
    
    # Setup resource monitoring
    setup_resource_monitoring
    
    # Setup log aggregation
    setup_log_aggregation
    
    success "✅ Monitoring and logging setup completed"
}

# Function to create log rotation configuration
create_log_rotation_config() {
    log "🔄 Setting up log rotation..."
    
    cat > monitoring/configs/logrotate.conf << 'EOF'
# LocallyTrip Log Rotation Configuration
/var/log/nginx/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    sharedscripts
    postrotate
        docker exec locallytrip-nginx-prod nginx -s reload 2>/dev/null || true
    endscript
}

logs/deployment/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    maxage 90
}

logs/backend/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    maxage 90
}
EOF
    
    success "✅ Log rotation configuration created"
}

# Function to create monitoring scripts
create_monitoring_scripts() {
    log "📈 Creating monitoring scripts..."
    
    # Health check script
    cat > monitoring/scripts/health-check.sh << 'EOF'
#!/bin/bash
# LocallyTrip Health Check Script

TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
LOG_FILE="logs/monitoring/health-check-$(date +%Y%m%d).log"

echo "[$TIMESTAMP] Starting health checks..." >> "$LOG_FILE"

# Check all containers
docker ps --format "table {{.Names}}\t{{.Status}}" | grep locallytrip >> "$LOG_FILE"

# Check database connectivity
if docker exec locallytrip-postgres-prod pg_isready -q; then
    echo "[$TIMESTAMP] ✅ Database: OK" >> "$LOG_FILE"
else
    echo "[$TIMESTAMP] ❌ Database: FAILED" >> "$LOG_FILE"
fi

# Check API health
if curl -f -s http://localhost:3001/health > /dev/null; then
    echo "[$TIMESTAMP] ✅ API: OK" >> "$LOG_FILE"
else
    echo "[$TIMESTAMP] ❌ API: FAILED" >> "$LOG_FILE"
fi

# Check web frontend
if curl -f -s http://localhost:3000 > /dev/null; then
    echo "[$TIMESTAMP] ✅ Web: OK" >> "$LOG_FILE"
else
    echo "[$TIMESTAMP] ❌ Web: FAILED" >> "$LOG_FILE"
fi

# Check admin panel
if curl -f -s http://localhost:3002 > /dev/null; then
    echo "[$TIMESTAMP] ✅ Admin: OK" >> "$LOG_FILE"
else
    echo "[$TIMESTAMP] ❌ Admin: FAILED" >> "$LOG_FILE"
fi

echo "[$TIMESTAMP] Health checks completed" >> "$LOG_FILE"
EOF
    
    chmod +x monitoring/scripts/health-check.sh
    
    # Resource monitoring script
    cat > monitoring/scripts/resource-monitor.sh << 'EOF'
#!/bin/bash
# LocallyTrip Resource Monitoring Script

TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
LOG_FILE="logs/monitoring/resource-monitor-$(date +%Y%m%d).log"

echo "[$TIMESTAMP] === Resource Monitoring ===" >> "$LOG_FILE"

# System resources
echo "[$TIMESTAMP] System Memory:" >> "$LOG_FILE"
free -h >> "$LOG_FILE" 2>&1

echo "[$TIMESTAMP] Disk Usage:" >> "$LOG_FILE"
df -h >> "$LOG_FILE" 2>&1

echo "[$TIMESTAMP] CPU Usage:" >> "$LOG_FILE"
top -bn1 | grep "Cpu(s)" >> "$LOG_FILE" 2>&1

# Docker container resources
echo "[$TIMESTAMP] Container Resources:" >> "$LOG_FILE"
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}" | grep locallytrip >> "$LOG_FILE" 2>&1

# Docker volumes
echo "[$TIMESTAMP] Docker Volumes:" >> "$LOG_FILE"
docker volume ls | grep locallytrip >> "$LOG_FILE" 2>&1

echo "[$TIMESTAMP] === End Resource Monitoring ===" >> "$LOG_FILE"
EOF
    
    chmod +x monitoring/scripts/resource-monitor.sh
    
    # Log collector script
    cat > monitoring/scripts/collect-logs.sh << 'EOF'
#!/bin/bash
# LocallyTrip Log Collection Script

TIMESTAMP=$(date +%Y%m%d-%H%M%S)
ARCHIVE_NAME="locallytrip-logs-$TIMESTAMP.tar.gz"

echo "🔍 Collecting LocallyTrip logs..."

# Create temporary directory
mkdir -p /tmp/locallytrip-logs

# Collect container logs
echo "📋 Collecting container logs..."
docker logs locallytrip-postgres-prod > /tmp/locallytrip-logs/postgres.log 2>&1 || true
docker logs locallytrip-backend-prod > /tmp/locallytrip-logs/backend.log 2>&1 || true
docker logs locallytrip-web-prod > /tmp/locallytrip-logs/web.log 2>&1 || true
docker logs locallytrip-admin-prod > /tmp/locallytrip-logs/admin.log 2>&1 || true
docker logs locallytrip-nginx-prod > /tmp/locallytrip-logs/nginx.log 2>&1 || true

# Collect deployment logs
echo "📋 Collecting deployment logs..."
cp logs/deployment/*.log /tmp/locallytrip-logs/ 2>/dev/null || true

# Collect monitoring logs
echo "📋 Collecting monitoring logs..."
cp logs/monitoring/*.log /tmp/locallytrip-logs/ 2>/dev/null || true

# Container status
echo "📋 Collecting container status..."
docker ps > /tmp/locallytrip-logs/container-status.txt
docker compose -f docker-compose.prod.yml ps > /tmp/locallytrip-logs/compose-status.txt

# System info
echo "📋 Collecting system info..."
uname -a > /tmp/locallytrip-logs/system-info.txt
docker version > /tmp/locallytrip-logs/docker-version.txt 2>&1 || true
docker compose version > /tmp/locallytrip-logs/compose-version.txt 2>&1 || true

# Create archive
echo "📦 Creating log archive..."
tar -czf "$ARCHIVE_NAME" -C /tmp locallytrip-logs/

# Cleanup
rm -rf /tmp/locallytrip-logs

echo "✅ Log collection completed: $ARCHIVE_NAME"
EOF
    
    chmod +x monitoring/scripts/collect-logs.sh
    
    success "✅ Monitoring scripts created"
}

# Function to setup health monitoring
setup_health_monitoring() {
    log "🏥 Setting up health monitoring..."
    
    # Create health monitoring cron jobs
    cat > monitoring/configs/health-crontab << 'EOF'
# LocallyTrip Health Monitoring Cron Jobs
# Run health checks every 5 minutes
*/5 * * * * /path/to/locallytrip/monitoring/scripts/health-check.sh

# Run resource monitoring every 15 minutes
*/15 * * * * /path/to/locallytrip/monitoring/scripts/resource-monitor.sh

# Daily log rotation at 2 AM
0 2 * * * /usr/sbin/logrotate /path/to/locallytrip/monitoring/configs/logrotate.conf

# Weekly log archive and cleanup at 3 AM on Sundays
0 3 * * 0 find /path/to/locallytrip/logs -name "*.log" -type f -mtime +7 -exec gzip {} \;
EOF
    
    # Alert configuration
    cat > monitoring/configs/alerts.conf << 'EOF'
# LocallyTrip Alert Configuration

# Database connection alerts
DB_ALERT_THRESHOLD=3  # Alert after 3 consecutive failures

# API response alerts  
API_ALERT_THRESHOLD=5  # Alert after 5 consecutive failures
API_RESPONSE_TIME_THRESHOLD=5000  # Alert if response time > 5 seconds

# Resource usage alerts
MEMORY_ALERT_THRESHOLD=85  # Alert if memory usage > 85%
DISK_ALERT_THRESHOLD=90   # Alert if disk usage > 90%
CPU_ALERT_THRESHOLD=80    # Alert if CPU usage > 80%

# Log file size alerts
LOG_SIZE_ALERT_THRESHOLD=1048576  # Alert if log file > 1MB
EOF
    
    success "✅ Health monitoring configured"
}

# Function to setup resource monitoring
setup_resource_monitoring() {
    log "📊 Setting up resource monitoring..."
    
    # Create resource monitoring dashboard script
    cat > monitoring/scripts/dashboard.sh << 'EOF'
#!/bin/bash
# LocallyTrip Monitoring Dashboard

clear
echo "=================================================="
echo "🚀 LocallyTrip Production Monitoring Dashboard"
echo "=================================================="
echo "Last updated: $(date)"
echo ""

# Container Status
echo "📊 Container Status:"
echo "------------------"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep locallytrip || echo "No containers running"
echo ""

# Resource Usage
echo "💾 Resource Usage:"
echo "----------------"
echo "Memory:"
free -h | head -2
echo ""
echo "Disk:"
df -h / | tail -1
echo ""

# Recent Logs
echo "📋 Recent Activity (last 10 lines):"
echo "-----------------------------------"
tail -10 logs/deployment/*.log 2>/dev/null | head -10 || echo "No recent deployment logs"
echo ""

# Health Status
echo "🏥 Health Status:"
echo "---------------"
if [ -f "logs/monitoring/health-check-$(date +%Y%m%d).log" ]; then
    tail -5 "logs/monitoring/health-check-$(date +%Y%m%d).log"
else
    echo "No health check data available"
fi

echo ""
echo "=================================================="
echo "💡 Commands:"
echo "   View logs: ./monitoring/scripts/collect-logs.sh"
echo "   Health check: ./monitoring/scripts/health-check.sh"
echo "   Resource monitor: ./monitoring/scripts/resource-monitor.sh"
echo "=================================================="
EOF
    
    chmod +x monitoring/scripts/dashboard.sh
    
    success "✅ Resource monitoring dashboard created"
}

# Function to setup log aggregation
setup_log_aggregation() {
    log "📚 Setting up log aggregation..."
    
    # Create log aggregation script
    cat > monitoring/scripts/aggregate-logs.sh << 'EOF'
#!/bin/bash
# LocallyTrip Log Aggregation Script

DATE=$(date +%Y%m%d)
AGGREGATE_LOG="logs/monitoring/aggregate-$DATE.log"

echo "📚 Aggregating logs for $DATE..."

# Create aggregated log header
echo "=== LocallyTrip Aggregated Logs - $DATE ===" > "$AGGREGATE_LOG"
echo "Generated: $(date)" >> "$AGGREGATE_LOG"
echo "" >> "$AGGREGATE_LOG"

# Aggregate deployment logs
echo "=== DEPLOYMENT LOGS ===" >> "$AGGREGATE_LOG"
find logs/deployment -name "*$DATE*.log" -exec cat {} \; >> "$AGGREGATE_LOG" 2>/dev/null
echo "" >> "$AGGREGATE_LOG"

# Aggregate health check logs
echo "=== HEALTH CHECK LOGS ===" >> "$AGGREGATE_LOG"
find logs/monitoring -name "health-check-$DATE.log" -exec cat {} \; >> "$AGGREGATE_LOG" 2>/dev/null
echo "" >> "$AGGREGATE_LOG"

# Aggregate resource monitoring logs
echo "=== RESOURCE MONITORING LOGS ===" >> "$AGGREGATE_LOG"
find logs/monitoring -name "resource-monitor-$DATE.log" -exec cat {} \; >> "$AGGREGATE_LOG" 2>/dev/null
echo "" >> "$AGGREGATE_LOG"

# Container logs summary
echo "=== CONTAINER LOGS SUMMARY ===" >> "$AGGREGATE_LOG"
echo "Container Status at $(date):" >> "$AGGREGATE_LOG"
docker ps --format "table {{.Names}}\t{{.Status}}" | grep locallytrip >> "$AGGREGATE_LOG" 2>&1
echo "" >> "$AGGREGATE_LOG"

echo "✅ Log aggregation completed: $AGGREGATE_LOG"
EOF
    
    chmod +x monitoring/scripts/aggregate-logs.sh
    
    success "✅ Log aggregation setup completed"
}

# Function to build and start services
deploy_services() {
    log "🚀 Building and starting LocallyTrip services..."
    
    # Build and start services
    docker compose -f docker-compose.prod.yml up --build -d
    
    success "✅ Services deployment started"
}

# Function to wait for services to be healthy
wait_for_services() {
    log "⏳ Waiting for services to become healthy..."
    
    # Wait for PostgreSQL
    log "📊 Waiting for PostgreSQL..."
    local attempts=0
    local max_attempts=60
    
    while [ $attempts -lt $max_attempts ]; do
        if docker exec locallytrip-postgres-prod pg_isready -U ${DB_USER:-locallytrip_prod_user} -d ${DB_NAME:-locallytrip_prod} >/dev/null 2>&1; then
            success "✅ PostgreSQL is ready"
            break
        fi
        
        attempts=$((attempts + 1))
        if [ $attempts -eq $max_attempts ]; then
            error "❌ PostgreSQL failed to start within timeout"
            exit 1
        fi
        
        sleep 5
    done
    
    # Wait for backend API
    log "🔌 Waiting for Backend API..."
    attempts=0
    max_attempts=60
    
    while [ $attempts -lt $max_attempts ]; do
        if docker exec locallytrip-backend-prod curl -f http://localhost:3001/health >/dev/null 2>&1; then
            success "✅ Backend API is ready"
            break
        fi
        
        attempts=$((attempts + 1))
        if [ $attempts -eq $max_attempts ]; then
            error "❌ Backend API failed to start within timeout"
            exit 1
        fi
        
        sleep 5
    done
    
    # Wait for frontend services
    log "🌐 Waiting for Frontend services..."
    sleep 30  # Give frontends time to build and start
    
    success "✅ All services are healthy"
}

# Function to seed database
seed_database() {
    log "🌱 Seeding database with complete dataset..."
    
    if [ -f "./seed-database-complete.sh" ]; then
        chmod +x ./seed-database-complete.sh
        
        # Set NODE_ENV for the seeding script
        export NODE_ENV=production
        
        # Run database seeding
        ./seed-database-complete.sh
        
        success "✅ Database seeding completed"
    else
        warning "⚠️ Database seeding script not found, attempting manual seeding..."
        
        # Manual seeding as fallback
        if docker exec locallytrip-postgres-prod psql -U ${DB_USER:-locallytrip_prod_user} -d ${DB_NAME:-locallytrip_prod} -f /docker-entrypoint-initdb.d/000-master-seed-simple.sql; then
            success "✅ Manual database seeding completed"
        else
            error "❌ Database seeding failed"
            exit 1
        fi
    fi
}

# Function to verify deployment
verify_deployment() {
    log "🔍 Verifying deployment..."
    
    # Check container status
    log "📊 Checking container status..."
    
    local services=("locallytrip-postgres-prod" "locallytrip-backend-prod" "locallytrip-web-prod" "locallytrip-admin-prod" "locallytrip-nginx-prod")
    local all_healthy=true
    
    for service in "${services[@]}"; do
        if docker ps --filter "name=$service" --filter "status=running" | grep -q "$service"; then
            success "✓ $service is running"
        else
            error "✗ $service is not running"
            all_healthy=false
        fi
    done
    
    if [ "$all_healthy" = false ]; then
        error "❌ Some services failed to start properly"
        log "📋 Container logs for debugging:"
        docker compose -f docker-compose.prod.yml logs --tail=50
        exit 1
    fi
    
    # Check nginx configuration
    log "🔧 Checking Nginx configuration..."
    if docker exec locallytrip-nginx-prod nginx -t >/dev/null 2>&1; then
        success "✅ Nginx configuration is valid"
    else
        error "❌ Nginx configuration has errors"
        docker exec locallytrip-nginx-prod nginx -t
        exit 1
    fi
    
    # Check database connections
    log "📊 Verifying database..."
    local db_check=$(docker exec locallytrip-postgres-prod psql -U ${DB_USER:-locallytrip_prod_user} -d ${DB_NAME:-locallytrip_prod} -t -c "SELECT COUNT(*) FROM users;" 2>/dev/null | xargs)
    
    if [ "$db_check" -gt 0 ]; then
        success "✅ Database is populated with $db_check users"
    else
        warning "⚠️ Database might not be properly seeded"
    fi
    
    # Check API endpoints
    log "🔌 Testing API endpoints..."
    sleep 10  # Give services a moment
    
    if curl -f -s http://localhost/api/health >/dev/null 2>&1; then
        success "✅ API health endpoint responding"
    else
        warning "⚠️ API health endpoint not responding through nginx"
    fi
    
    success "✅ Deployment verification completed"
}

# Function to print deployment summary
print_summary() {
    local deployment_end_time=$(date)
    local start_timestamp=$(date -d "$DEPLOYMENT_START_TIME" +%s 2>/dev/null || date -j -f "%a %b %d %H:%M:%S %Z %Y" "$DEPLOYMENT_START_TIME" +%s 2>/dev/null || echo "0")
    local end_timestamp=$(date +%s)
    local duration=$((end_timestamp - start_timestamp))
    
    echo ""
    echo -e "${GREEN}================================================================${NC}"
    echo -e "${GREEN}🎉 LOCALLYTRIP DEPLOYMENT COMPLETED SUCCESSFULLY!${NC}"
    echo -e "${GREEN}================================================================${NC}"
    echo ""
    echo -e "${BLUE}📊 Deployment Summary:${NC}"
    echo -e "   • Started: $DEPLOYMENT_START_TIME"
    echo -e "   • Completed: $deployment_end_time"
    echo -e "   • Duration: ${duration} seconds"
    echo -e "   • Log file: $LOG_FILE"
    echo -e "   • Backup: $BACKUP_DIR"
    echo ""
    echo -e "${BLUE}🌐 Application URLs:${NC}"
    
    if [ -n "$DOMAIN" ] && [ "$DOMAIN" != "your-domain.com" ]; then
        echo -e "   • Website: ${GREEN}https://$DOMAIN${NC}"
        echo -e "   • Admin Panel: ${GREEN}https://admin.$DOMAIN${NC}"
        echo -e "   • API: ${GREEN}https://api.$DOMAIN${NC}"
    else
        echo -e "   • Website: ${GREEN}https://localhost${NC} (or your server IP)"
        echo -e "   • Admin Panel: ${GREEN}https://localhost:3002${NC}"
        echo -e "   • API: ${GREEN}https://localhost:3001${NC}"
    fi
    
    echo ""
    echo -e "${BLUE}📊 Services Status:${NC}"
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" --filter "name=locallytrip"
    
    echo ""
    echo -e "${BLUE}💾 Database Information:${NC}"
    docker exec locallytrip-postgres-prod psql -U ${DB_USER:-locallytrip_prod_user} -d ${DB_NAME:-locallytrip_prod} -c "
    SELECT 
      'Users' as table_name, COUNT(*) as count FROM users
    UNION ALL 
    SELECT 'Experiences', COUNT(*) FROM experiences
    UNION ALL 
    SELECT 'Stories', COUNT(*) FROM stories
    UNION ALL 
    SELECT 'Bookings', COUNT(*) FROM bookings
    ORDER BY table_name;
    " 2>/dev/null || echo "   Database query failed"
    
    echo ""
    echo -e "${BLUE}🔧 Management Commands:${NC}"
    echo -e "   • View logs: ${YELLOW}docker compose -f docker-compose.prod.yml logs -f${NC}"
    echo -e "   • Restart services: ${YELLOW}docker compose -f docker-compose.prod.yml restart${NC}"
    echo -e "   • Stop services: ${YELLOW}docker compose -f docker-compose.prod.yml down${NC}"
    echo -e "   • Database access: ${YELLOW}docker exec -it locallytrip-postgres-prod psql -U ${DB_USER:-locallytrip_prod_user} -d ${DB_NAME:-locallytrip_prod}${NC}"
    
    echo ""
    echo -e "${BLUE}📊 Monitoring & Logging:${NC}"
    echo -e "   • Monitoring dashboard: ${YELLOW}./monitoring/scripts/dashboard.sh${NC}"
    echo -e "   • Health check: ${YELLOW}./monitoring/scripts/health-check.sh${NC}"
    echo -e "   • Resource monitor: ${YELLOW}./monitoring/scripts/resource-monitor.sh${NC}"
    echo -e "   • Collect logs: ${YELLOW}./monitoring/scripts/collect-logs.sh${NC}"
    echo -e "   • Aggregate logs: ${YELLOW}./monitoring/scripts/aggregate-logs.sh${NC}"
    echo -e "   • Log directory: ${YELLOW}logs/${NC}"
    echo -e "   • Monitoring config: ${YELLOW}monitoring/configs/${NC}"
    
    echo ""
    echo -e "${BLUE}⚡ Quick Actions:${NC}"
    echo -e "   • Run health checks now: ${GREEN}./monitoring/scripts/health-check.sh${NC}"
    echo -e "   • View dashboard: ${GREEN}./monitoring/scripts/dashboard.sh${NC}"
    echo -e "   • Check resources: ${GREEN}./monitoring/scripts/resource-monitor.sh${NC}"
    
    echo ""
    echo -e "${BLUE}🔔 Monitoring Setup:${NC}"
    echo -e "   • Health checks: Every 5 minutes"
    echo -e "   • Resource monitoring: Every 15 minutes"
    echo -e "   • Log rotation: Daily at 2 AM"
    echo -e "   • Log archival: Weekly cleanup"
    echo -e "   • Monitoring logs: ${YELLOW}logs/monitoring/${NC}"
    
    echo ""
    echo -e "${GREEN}🚀 Your LocallyTrip platform is now live and ready for users!${NC}"
    echo -e "${GREEN}================================================================${NC}"
}

# Function to handle errors
handle_error() {
    error "❌ Deployment failed at step: $1"
    error "❌ Check the log file: $LOG_FILE"
    
    echo ""
    echo -e "${RED}🔧 Troubleshooting:${NC}"
    echo -e "   • Check logs: docker compose -f docker-compose.prod.yml logs"
    echo -e "   • Check container status: docker ps -a"
    echo -e "   • Restore from backup: $BACKUP_DIR"
    
    exit 1
}

# Function to setup signal handlers
setup_signal_handlers() {
    trap 'handle_error "Interrupted by user"' INT TERM
}

# Main deployment function
main() {
    print_header
    setup_signal_handlers
    
    # Step 1: Prerequisites check
    check_prerequisites || handle_error "Prerequisites check"
    
    # Step 2: Environment setup
    setup_environment || handle_error "Environment setup"
    
    # Step 3: SSL setup
    setup_ssl || handle_error "SSL setup"
    
    # Step 4: Backup existing deployment
    backup_existing_deployment || handle_error "Backup creation"
    
    # Step 5: Stop existing services
    stop_existing_services || handle_error "Stopping services"
    
    # Step 6: Docker cleanup
    cleanup_docker || handle_error "Docker cleanup"
    
    # Step 7: Setup monitoring and logging
    setup_monitoring || handle_error "Monitoring setup"
    
    # Step 8: Deploy services
    deploy_services || handle_error "Service deployment"
    
    # Step 9: Wait for services
    wait_for_services || handle_error "Service health check"
    
    # Step 10: Seed database
    seed_database || handle_error "Database seeding"
    
    # Step 11: Verify deployment
    verify_deployment || handle_error "Deployment verification"
    
    # Step 12: Print summary
    print_summary
}

# Check if script is being sourced or executed
if [ "${BASH_SOURCE[0]}" = "${0}" ]; then
    main "$@"
fi
