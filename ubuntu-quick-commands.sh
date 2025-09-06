#!/bin/bash

# LocallyTrip Ubuntu Server Quick Commands
# Collection of useful commands for server maintenance
# Usage: ./ubuntu-quick-commands.sh [command]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

PROJECT_DIR="/home/locallytrip/locallytrip"

# Function to print colored output
log() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Function to show help
show_help() {
    echo -e "${BLUE}LocallyTrip Ubuntu Server Quick Commands${NC}"
    echo ""
    echo -e "${YELLOW}Usage: ./ubuntu-quick-commands.sh [command]${NC}"
    echo ""
    echo -e "${BLUE}Available Commands:${NC}"
    echo ""
    echo -e "${GREEN}System Management:${NC}"
    echo "  status          - Show all service status"
    echo "  logs            - View all service logs"
    echo "  restart         - Restart all services"
    echo "  stop            - Stop all services"
    echo "  start           - Start all services"
    echo "  update          - Update and redeploy application"
    echo ""
    echo -e "${GREEN}Monitoring:${NC}"
    echo "  health          - Run health checks"
    echo "  stats           - Show system statistics"
    echo "  disk            - Show disk usage"
    echo "  memory          - Show memory usage"
    echo "  processes       - Show Docker processes"
    echo ""
    echo -e "${GREEN}Database:${NC}"
    echo "  db-status       - Check database status"
    echo "  db-backup       - Create database backup"
    echo "  db-connect      - Connect to database"
    echo "  db-logs         - Show database logs"
    echo ""
    echo -e "${GREEN}SSL & Security:${NC}"
    echo "  ssl-status      - Check SSL certificate status"
    echo "  ssl-renew       - Renew SSL certificates"
    echo "  firewall        - Show firewall status"
    echo ""
    echo -e "${GREEN}Logs & Debugging:${NC}"
    echo "  logs-nginx      - Show Nginx logs"
    echo "  logs-backend    - Show backend logs"
    echo "  logs-web        - Show web frontend logs"
    echo "  logs-admin      - Show admin dashboard logs"
    echo "  logs-db         - Show database logs"
    echo ""
    echo -e "${GREEN}Maintenance:${NC}"
    echo "  cleanup         - Clean up Docker resources"
    echo "  backup          - Create full backup"
    echo "  test            - Run connectivity tests"
    echo ""
}

# Function to check if in project directory
check_project_dir() {
    if [ ! -d "$PROJECT_DIR" ]; then
        error "Project directory not found: $PROJECT_DIR"
        exit 1
    fi
    cd "$PROJECT_DIR"
}

# Function to show service status
show_status() {
    log "Checking LocallyTrip service status..."
    check_project_dir
    
    echo -e "${BLUE}Docker Containers:${NC}"
    docker compose -f docker-compose.prod.yml ps
    echo ""
    
    echo -e "${BLUE}System Services:${NC}"
    systemctl status docker --no-pager -l
    echo ""
    
    echo -e "${BLUE}Port Usage:${NC}"
    netstat -tlnp | grep -E ':(80|443|3000|3001|3002|5432)'
}

# Function to view logs
view_logs() {
    log "Viewing LocallyTrip service logs..."
    check_project_dir
    
    docker compose -f docker-compose.prod.yml logs --tail=50 -f
}

# Function to restart services
restart_services() {
    log "Restarting LocallyTrip services..."
    check_project_dir
    
    docker compose -f docker-compose.prod.yml restart
    success "Services restarted"
}

# Function to stop services
stop_services() {
    log "Stopping LocallyTrip services..."
    check_project_dir
    
    docker compose -f docker-compose.prod.yml down
    success "Services stopped"
}

# Function to start services
start_services() {
    log "Starting LocallyTrip services..."
    check_project_dir
    
    docker compose -f docker-compose.prod.yml up -d
    success "Services started"
}

# Function to update application
update_application() {
    log "Updating LocallyTrip application..."
    check_project_dir
    
    # Pull latest changes
    git pull origin main
    
    # Redeploy
    ./deploy-ubuntu-server.sh
}

# Function to run health checks
run_health_checks() {
    log "Running LocallyTrip health checks..."
    
    echo -e "${BLUE}Service Health:${NC}"
    
    # Check containers
    if docker ps | grep -q "locallytrip"; then
        success "✅ Containers are running"
    else
        error "❌ No LocallyTrip containers found"
    fi
    
    # Check endpoints
    if curl -f http://localhost:3001/health >/dev/null 2>&1; then
        success "✅ Backend API is healthy"
    else
        error "❌ Backend API is not responding"
    fi
    
    if curl -f http://localhost:3000 >/dev/null 2>&1; then
        success "✅ Frontend is healthy"
    else
        error "❌ Frontend is not responding"
    fi
    
    if curl -k -f https://localhost/health >/dev/null 2>&1; then
        success "✅ Nginx proxy is healthy"
    else
        warning "⚠️ Nginx proxy is not responding"
    fi
    
    # Check database
    check_project_dir
    source .env
    if docker exec locallytrip-postgres-prod pg_isready -U ${DB_USER:-locallytrip_prod_user} -d ${DB_NAME:-locallytrip_prod} >/dev/null 2>&1; then
        success "✅ Database is healthy"
    else
        error "❌ Database is not responding"
    fi
}

# Function to show system stats
show_stats() {
    log "System Statistics"
    
    echo -e "${BLUE}CPU Usage:${NC}"
    top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print 100 - $1"%"}'
    echo ""
    
    echo -e "${BLUE}Memory Usage:${NC}"
    free -h
    echo ""
    
    echo -e "${BLUE}Disk Usage:${NC}"
    df -h /
    echo ""
    
    echo -e "${BLUE}Docker Stats:${NC}"
    docker stats --no-stream
}

# Function to show disk usage
show_disk() {
    log "Disk Usage Information"
    
    echo -e "${BLUE}Overall Disk Usage:${NC}"
    df -h
    echo ""
    
    echo -e "${BLUE}LocallyTrip Directory Usage:${NC}"
    du -sh /home/locallytrip/* 2>/dev/null || true
    echo ""
    
    echo -e "${BLUE}Docker Space Usage:${NC}"
    docker system df
}

# Function to show memory usage
show_memory() {
    log "Memory Usage Information"
    
    echo -e "${BLUE}System Memory:${NC}"
    free -h
    echo ""
    
    echo -e "${BLUE}Process Memory Usage:${NC}"
    ps aux --sort=-%mem | head -10
    echo ""
    
    echo -e "${BLUE}Docker Container Memory:${NC}"
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}"
}

# Function to show Docker processes
show_processes() {
    log "Docker Processes"
    
    echo -e "${BLUE}All Docker Containers:${NC}"
    docker ps -a
    echo ""
    
    echo -e "${BLUE}LocallyTrip Containers:${NC}"
    docker ps --filter "name=locallytrip"
    echo ""
    
    echo -e "${BLUE}Docker Networks:${NC}"
    docker network ls
}

# Function to check database status
check_db_status() {
    log "Database Status Check"
    check_project_dir
    source .env
    
    echo -e "${BLUE}Database Container:${NC}"
    docker ps --filter "name=locallytrip-postgres-prod"
    echo ""
    
    echo -e "${BLUE}Database Connectivity:${NC}"
    if docker exec locallytrip-postgres-prod pg_isready -U ${DB_USER:-locallytrip_prod_user} -d ${DB_NAME:-locallytrip_prod}; then
        success "✅ Database is ready"
    else
        error "❌ Database is not ready"
    fi
    
    echo -e "${BLUE}Database Size:${NC}"
    docker exec locallytrip-postgres-prod psql -U ${DB_USER:-locallytrip_prod_user} -d ${DB_NAME:-locallytrip_prod} -c "SELECT pg_size_pretty(pg_database_size('${DB_NAME:-locallytrip_prod}'));" 2>/dev/null || true
}

# Function to backup database
backup_database() {
    log "Creating database backup..."
    check_project_dir
    source .env
    
    BACKUP_DIR="/home/locallytrip/backups"
    BACKUP_FILE="$BACKUP_DIR/db_backup_$(date +%Y%m%d_%H%M%S).sql.gz"
    
    mkdir -p "$BACKUP_DIR"
    
    docker exec locallytrip-postgres-prod pg_dump -U ${DB_USER:-locallytrip_prod_user} ${DB_NAME:-locallytrip_prod} | gzip > "$BACKUP_FILE"
    
    success "Database backup created: $BACKUP_FILE"
    ls -lh "$BACKUP_FILE"
}

# Function to connect to database
connect_database() {
    log "Connecting to database..."
    check_project_dir
    source .env
    
    docker exec -it locallytrip-postgres-prod psql -U ${DB_USER:-locallytrip_prod_user} -d ${DB_NAME:-locallytrip_prod}
}

# Function to show database logs
show_db_logs() {
    log "Database Logs"
    
    docker logs locallytrip-postgres-prod --tail=50
}

# Function to check SSL status
check_ssl_status() {
    log "SSL Certificate Status"
    
    if [ -f "$PROJECT_DIR/ssl/cert.pem" ]; then
        echo -e "${BLUE}Certificate Details:${NC}"
        openssl x509 -in "$PROJECT_DIR/ssl/cert.pem" -text -noout | grep -E "(Subject|Issuer|Not Before|Not After)"
        echo ""
        
        echo -e "${BLUE}Certificate Expiry:${NC}"
        openssl x509 -in "$PROJECT_DIR/ssl/cert.pem" -enddate -noout
    else
        error "SSL certificate not found"
    fi
}

# Function to renew SSL certificates
renew_ssl() {
    log "Renewing SSL certificates..."
    check_project_dir
    
    if [ -f "./renew-ssl.sh" ]; then
        ./renew-ssl.sh
    else
        warning "SSL renewal script not found"
    fi
}

# Function to show firewall status
show_firewall() {
    log "Firewall Status"
    
    echo -e "${BLUE}UFW Status:${NC}"
    sudo ufw status verbose
    echo ""
    
    echo -e "${BLUE}Active Connections:${NC}"
    netstat -tuln
}

# Function to show specific service logs
show_nginx_logs() {
    docker logs locallytrip-nginx-prod --tail=50
}

show_backend_logs() {
    docker logs locallytrip-backend-prod --tail=50
}

show_web_logs() {
    docker logs locallytrip-web-prod --tail=50
}

show_admin_logs() {
    docker logs locallytrip-admin-prod --tail=50
}

# Function to cleanup Docker resources
cleanup_docker() {
    log "Cleaning up Docker resources..."
    
    echo -e "${BLUE}Removing unused containers:${NC}"
    docker container prune -f
    
    echo -e "${BLUE}Removing unused images:${NC}"
    docker image prune -f
    
    echo -e "${BLUE}Removing unused networks:${NC}"
    docker network prune -f
    
    echo -e "${BLUE}Removing unused volumes:${NC}"
    docker volume prune -f
    
    success "Docker cleanup completed"
}

# Function to create full backup
create_full_backup() {
    log "Creating full backup..."
    
    BACKUP_DIR="/home/locallytrip/backups/full_backup_$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$BACKUP_DIR"
    
    # Backup database
    backup_database
    
    # Backup application files
    if [ -d "$PROJECT_DIR" ]; then
        cp -r "$PROJECT_DIR" "$BACKUP_DIR/"
        success "Application files backed up"
    fi
    
    # Backup uploads and images
    if [ -d "$PROJECT_DIR/backend/public/uploads" ]; then
        cp -r "$PROJECT_DIR/backend/public/uploads" "$BACKUP_DIR/"
    fi
    
    success "Full backup created in: $BACKUP_DIR"
}

# Function to run connectivity tests
run_connectivity_tests() {
    log "Running connectivity tests..."
    
    echo -e "${BLUE}Testing local endpoints:${NC}"
    
    # Test backend
    if curl -f http://localhost:3001/health >/dev/null 2>&1; then
        success "✅ Backend (port 3001) - OK"
    else
        error "❌ Backend (port 3001) - FAIL"
    fi
    
    # Test frontend
    if curl -f http://localhost:3000 >/dev/null 2>&1; then
        success "✅ Frontend (port 3000) - OK"
    else
        error "❌ Frontend (port 3000) - FAIL"
    fi
    
    # Test admin
    if curl -f http://localhost:3002 >/dev/null 2>&1; then
        success "✅ Admin (port 3002) - OK"
    else
        error "❌ Admin (port 3002) - FAIL"
    fi
    
    # Test Nginx HTTP
    if curl -f http://localhost >/dev/null 2>&1; then
        success "✅ Nginx HTTP (port 80) - OK"
    else
        error "❌ Nginx HTTP (port 80) - FAIL"
    fi
    
    # Test Nginx HTTPS
    if curl -k -f https://localhost >/dev/null 2>&1; then
        success "✅ Nginx HTTPS (port 443) - OK"
    else
        error "❌ Nginx HTTPS (port 443) - FAIL"
    fi
}

# Main function
main() {
    case "${1:-help}" in
        "status")
            show_status
            ;;
        "logs")
            view_logs
            ;;
        "restart")
            restart_services
            ;;
        "stop")
            stop_services
            ;;
        "start")
            start_services
            ;;
        "update")
            update_application
            ;;
        "health")
            run_health_checks
            ;;
        "stats")
            show_stats
            ;;
        "disk")
            show_disk
            ;;
        "memory")
            show_memory
            ;;
        "processes")
            show_processes
            ;;
        "db-status")
            check_db_status
            ;;
        "db-backup")
            backup_database
            ;;
        "db-connect")
            connect_database
            ;;
        "db-logs")
            show_db_logs
            ;;
        "ssl-status")
            check_ssl_status
            ;;
        "ssl-renew")
            renew_ssl
            ;;
        "firewall")
            show_firewall
            ;;
        "logs-nginx")
            show_nginx_logs
            ;;
        "logs-backend")
            show_backend_logs
            ;;
        "logs-web")
            show_web_logs
            ;;
        "logs-admin")
            show_admin_logs
            ;;
        "logs-db")
            show_db_logs
            ;;
        "cleanup")
            cleanup_docker
            ;;
        "backup")
            create_full_backup
            ;;
        "test")
            run_connectivity_tests
            ;;
        "help"|*)
            show_help
            ;;
    esac
}

# Run main function with all arguments
main "$@"
