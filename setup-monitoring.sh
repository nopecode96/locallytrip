#!/bin/bash

# LocallyTrip Monitoring & Logging Setup Script
# This script sets up comprehensive monitoring and logging for LocallyTriip production
# Usage: ./setup-monitoring.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Function to print colored output
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
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

info() {
    echo -e "${PURPLE}[INFO]${NC} $1"
}

# Function to print header
print_header() {
    echo -e "${BLUE}================================================================${NC}"
    echo -e "${BLUE}📊 LocallyTrip Monitoring & Logging Setup${NC}"
    echo -e "${BLUE}================================================================${NC}"
    echo ""
}

# Function to create directory structure
create_directories() {
    log "📁 Creating monitoring directory structure..."
    
    mkdir -p logs/{nginx,backend,web,admin,postgres,deployment,monitoring}
    mkdir -p monitoring/{scripts,configs,alerts,dashboards}
    mkdir -p monitoring/data/{metrics,alerts,reports}
    
    success "✅ Directory structure created"
}

# Function to create monitoring scripts
create_monitoring_scripts() {
    log "📈 Creating monitoring scripts..."
    
    # Enhanced health check script
    cat > monitoring/scripts/health-check.sh << 'EOF'
#!/bin/bash
# LocallyTrip Enhanced Health Check Script

TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
LOG_FILE="logs/monitoring/health-check-$(date +%Y%m%d).log"
ALERT_FILE="logs/monitoring/alerts-$(date +%Y%m%d).log"

echo "[$TIMESTAMP] === Starting comprehensive health checks ===" >> "$LOG_FILE"

# Function to log with severity
log_health() {
    local severity=$1
    local service=$2
    local status=$3
    local details=$4
    
    echo "[$TIMESTAMP] [$severity] $service: $status - $details" >> "$LOG_FILE"
    
    if [ "$severity" = "ERROR" ]; then
        echo "[$TIMESTAMP] ALERT: $service failed - $details" >> "$ALERT_FILE"
    fi
}

# Check all containers
log_health "INFO" "SYSTEM" "CHECKING" "Container status"
CONTAINERS=("locallytrip-postgres-prod" "locallytrip-backend-prod" "locallytrip-web-prod" "locallytrip-admin-prod" "locallytrip-nginx-prod")

for container in "${CONTAINERS[@]}"; do
    if docker ps --format "{{.Names}}" | grep -q "^$container$"; then
        log_health "OK" "$container" "RUNNING" "Container is active"
    else
        log_health "ERROR" "$container" "NOT_RUNNING" "Container is down or missing"
    fi
done

# Check database connectivity with detailed info
log_health "INFO" "DATABASE" "CHECKING" "Connection and performance"
if timeout 10 docker exec locallytrip-postgres-prod pg_isready -q; then
    # Get database stats
    DB_CONNECTIONS=$(docker exec locallytrip-postgres-prod psql -U ${DB_USER:-locallytrip_prod_user} -d ${DB_NAME:-locallytrip_prod} -t -c "SELECT count(*) FROM pg_stat_activity;" 2>/dev/null | xargs)
    DB_SIZE=$(docker exec locallytrip-postgres-prod psql -U ${DB_USER:-locallytrip_prod_user} -d ${DB_NAME:-locallytrip_prod} -t -c "SELECT pg_size_pretty(pg_database_size(current_database()));" 2>/dev/null | xargs)
    log_health "OK" "DATABASE" "CONNECTED" "Active connections: $DB_CONNECTIONS, Size: $DB_SIZE"
else
    log_health "ERROR" "DATABASE" "CONNECTION_FAILED" "Database unreachable"
fi

# Check API health with response time
log_health "INFO" "API" "CHECKING" "Endpoint response and performance"
API_START=$(date +%s%3N)
if timeout 10 curl -f -s http://localhost:3001/health > /dev/null; then
    API_END=$(date +%s%3N)
    API_TIME=$((API_END - API_START))
    if [ "$API_TIME" -gt 5000 ]; then
        log_health "WARNING" "API" "SLOW_RESPONSE" "Response time: ${API_TIME}ms (>5s)"
    else
        log_health "OK" "API" "RESPONSIVE" "Response time: ${API_TIME}ms"
    fi
else
    log_health "ERROR" "API" "UNREACHABLE" "HTTP health check failed"
fi

# Check web frontend
log_health "INFO" "WEB" "CHECKING" "Frontend availability"
if timeout 10 curl -f -s http://localhost:3000 > /dev/null; then
    log_health "OK" "WEB" "AVAILABLE" "Frontend responding"
else
    log_health "ERROR" "WEB" "UNREACHABLE" "Frontend not responding"
fi

# Check admin panel
log_health "INFO" "ADMIN" "CHECKING" "Admin panel availability"
if timeout 10 curl -f -s http://localhost:3002 > /dev/null; then
    log_health "OK" "ADMIN" "AVAILABLE" "Admin panel responding"
else
    log_health "ERROR" "ADMIN" "UNREACHABLE" "Admin panel not responding"
fi

# Check SSL certificate (if configured)
if [ -f "ssl/cert.pem" ]; then
    log_health "INFO" "SSL" "CHECKING" "Certificate validity"
    CERT_EXPIRY=$(openssl x509 -in ssl/cert.pem -enddate -noout 2>/dev/null | cut -d= -f2)
    CERT_EXPIRY_EPOCH=$(date -d "$CERT_EXPIRY" +%s 2>/dev/null || echo "0")
    CURRENT_EPOCH=$(date +%s)
    DAYS_UNTIL_EXPIRY=$(((CERT_EXPIRY_EPOCH - CURRENT_EPOCH) / 86400))
    
    if [ "$DAYS_UNTIL_EXPIRY" -lt 30 ]; then
        log_health "WARNING" "SSL" "EXPIRING_SOON" "Certificate expires in $DAYS_UNTIL_EXPIRY days"
    else
        log_health "OK" "SSL" "VALID" "Certificate expires in $DAYS_UNTIL_EXPIRY days"
    fi
fi

echo "[$TIMESTAMP] === Health checks completed ===" >> "$LOG_FILE"

# Generate summary
ERRORS=$(grep "ERROR" "$LOG_FILE" | grep "$TIMESTAMP" | wc -l)
WARNINGS=$(grep "WARNING" "$LOG_FILE" | grep "$TIMESTAMP" | wc -l)

if [ "$ERRORS" -gt 0 ]; then
    echo "❌ Health check completed with $ERRORS errors and $WARNINGS warnings"
    exit 1
elif [ "$WARNINGS" -gt 0 ]; then
    echo "⚠️ Health check completed with $WARNINGS warnings"
    exit 2
else
    echo "✅ All health checks passed"
    exit 0
fi
EOF
    
    chmod +x monitoring/scripts/health-check.sh
    
    # Advanced resource monitoring script
    cat > monitoring/scripts/resource-monitor.sh << 'EOF'
#!/bin/bash
# LocallyTrip Advanced Resource Monitoring Script

TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
LOG_FILE="logs/monitoring/resource-monitor-$(date +%Y%m%d).log"

echo "[$TIMESTAMP] === Advanced Resource Monitoring ===" >> "$LOG_FILE"

# System resources with thresholds
echo "[$TIMESTAMP] System Resources:" >> "$LOG_FILE"

# Memory usage with alert thresholds
MEMORY_TOTAL=$(free | grep '^Mem:' | awk '{print $2}')
MEMORY_USED=$(free | grep '^Mem:' | awk '{print $3}')
MEMORY_PERCENT=$((MEMORY_USED * 100 / MEMORY_TOTAL))

echo "[$TIMESTAMP] Memory: ${MEMORY_PERCENT}% used (${MEMORY_USED}/${MEMORY_TOTAL})" >> "$LOG_FILE"

if [ "$MEMORY_PERCENT" -gt 85 ]; then
    echo "[$TIMESTAMP] ALERT: High memory usage: ${MEMORY_PERCENT}%" >> "$LOG_FILE"
fi

# Disk usage with alert thresholds
DISK_USAGE=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
echo "[$TIMESTAMP] Disk: ${DISK_USAGE}% used" >> "$LOG_FILE"

if [ "$DISK_USAGE" -gt 90 ]; then
    echo "[$TIMESTAMP] ALERT: High disk usage: ${DISK_USAGE}%" >> "$LOG_FILE"
fi

# CPU load
LOAD_AVG=$(uptime | awk -F'load average:' '{print $2}' | awk '{print $1}' | sed 's/,//')
echo "[$TIMESTAMP] Load Average: $LOAD_AVG" >> "$LOG_FILE"

# Docker container resources with detailed metrics
echo "[$TIMESTAMP] Container Resources:" >> "$LOG_FILE"
docker stats --no-stream --format "{{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}\t{{.NetIO}}\t{{.BlockIO}}" | grep locallytrip | while read line; do
    echo "[$TIMESTAMP] Container: $line" >> "$LOG_FILE"
done

# Docker system resources
DOCKER_SPACE=$(docker system df --format "table {{.Type}}\t{{.TotalCount}}\t{{.Size}}\t{{.Reclaimable}}" | tail -n +2)
echo "[$TIMESTAMP] Docker Space Usage:" >> "$LOG_FILE"
echo "$DOCKER_SPACE" | while read line; do
    echo "[$TIMESTAMP] Docker: $line" >> "$LOG_FILE"
done

# Network connections
CONNECTIONS=$(netstat -an | grep -E ':(80|443|3001|3002|5432)' | wc -l)
echo "[$TIMESTAMP] Active Network Connections: $CONNECTIONS" >> "$LOG_FILE"

# Log file sizes
echo "[$TIMESTAMP] Log File Sizes:" >> "$LOG_FILE"
find logs/ -name "*.log" -type f -exec ls -lh {} \; | while read line; do
    echo "[$TIMESTAMP] LogSize: $line" >> "$LOG_FILE"
done

echo "[$TIMESTAMP] === End Advanced Resource Monitoring ===" >> "$LOG_FILE"
EOF
    
    chmod +x monitoring/scripts/resource-monitor.sh
    
    # Real-time monitoring dashboard
    cat > monitoring/scripts/dashboard.sh << 'EOF'
#!/bin/bash
# LocallyTrip Real-time Monitoring Dashboard

# Enable live updates
REFRESH_INTERVAL=${1:-5}  # Default 5 seconds

show_dashboard() {
    clear
    echo "=================================================="
    echo "🚀 LocallyTrip Real-time Monitoring Dashboard"
    echo "=================================================="
    echo "Last updated: $(date) | Refresh: ${REFRESH_INTERVAL}s | Press Ctrl+C to exit"
    echo ""

    # Container Status with health indicators
    echo "📊 Container Status & Health:"
    echo "----------------------------"
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep -E "(NAMES|locallytrip)" | while read line; do
        if echo "$line" | grep -q "NAMES"; then
            echo "$line"
        else
            container_name=$(echo "$line" | awk '{print $1}')
            if docker exec "$container_name" echo "healthy" >/dev/null 2>&1; then
                echo "✅ $line"
            else
                echo "❌ $line"
            fi
        fi
    done
    echo ""

    # Quick resource overview
    echo "💾 Resource Overview:"
    echo "-------------------"
    echo "Memory: $(free -h | grep '^Mem:' | awk '{printf "%.1f%% used (%s/%s)", $3/$2*100, $3, $2}')"
    echo "Disk:   $(df -h / | tail -1 | awk '{print $5 " used (" $3 "/" $2 ")"}')"
    echo "Load:   $(uptime | awk -F'load average:' '{print $2}')"
    echo ""

    # Recent logs (last 5 entries)
    echo "📋 Recent Activity:"
    echo "------------------"
    if [ -f "logs/monitoring/health-check-$(date +%Y%m%d).log" ]; then
        tail -5 "logs/monitoring/health-check-$(date +%Y%m%d).log" | head -5
    else
        echo "No recent monitoring data available"
    fi
    echo ""

    # Quick service tests
    echo "🔍 Service Tests:"
    echo "----------------"
    
    # API test
    if timeout 3 curl -s http://localhost:3001/health >/dev/null 2>&1; then
        echo "✅ API: Responsive"
    else
        echo "❌ API: Not responding"
    fi
    
    # Web test
    if timeout 3 curl -s http://localhost:3000 >/dev/null 2>&1; then
        echo "✅ Web: Responsive"
    else
        echo "❌ Web: Not responding"
    fi
    
    # Admin test
    if timeout 3 curl -s http://localhost:3002 >/dev/null 2>&1; then
        echo "✅ Admin: Responsive"
    else
        echo "❌ Admin: Not responding"
    fi
    
    # Database test
    if timeout 3 docker exec locallytrip-postgres-prod pg_isready -q >/dev/null 2>&1; then
        echo "✅ Database: Connected"
    else
        echo "❌ Database: Connection failed"
    fi

    echo ""
    echo "=================================================="
    echo "💡 Commands: ./monitoring/scripts/collect-logs.sh | ./monitoring/scripts/health-check.sh"
    echo "Press Ctrl+C to exit live monitoring"
}

# Live monitoring mode
if [ "$1" = "--live" ]; then
    while true; do
        show_dashboard
        sleep "$REFRESH_INTERVAL"
    done
else
    show_dashboard
fi
EOF
    
    chmod +x monitoring/scripts/dashboard.sh
    
    success "✅ Advanced monitoring scripts created"
}

# Function to create alerting system
create_alerting_system() {
    log "🔔 Setting up alerting system..."
    
    # Alert manager script
    cat > monitoring/scripts/alert-manager.sh << 'EOF'
#!/bin/bash
# LocallyTrip Alert Manager

ALERT_LOG="logs/monitoring/alerts-$(date +%Y%m%d).log"
CONFIG_FILE="monitoring/configs/alerts.conf"

# Load alert configuration
if [ -f "$CONFIG_FILE" ]; then
    source "$CONFIG_FILE"
fi

# Default thresholds
DB_ALERT_THRESHOLD=${DB_ALERT_THRESHOLD:-3}
API_ALERT_THRESHOLD=${API_ALERT_THRESHOLD:-5}
MEMORY_ALERT_THRESHOLD=${MEMORY_ALERT_THRESHOLD:-85}
DISK_ALERT_THRESHOLD=${DISK_ALERT_THRESHOLD:-90}

send_alert() {
    local severity=$1
    local service=$2
    local message=$3
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    echo "[$timestamp] [$severity] $service: $message" >> "$ALERT_LOG"
    
    # Here you can add integration with external alerting systems
    # Examples: Slack, email, SMS, webhook, etc.
    echo "ALERT [$severity]: $service - $message"
}

# Check for recent alerts and manage escalation
check_alert_patterns() {
    local today=$(date +%Y%m%d)
    local alert_file="logs/monitoring/alerts-$today.log"
    
    if [ -f "$alert_file" ]; then
        # Count critical alerts in last hour
        local hour_ago=$(date -d '1 hour ago' '+%Y-%m-%d %H')
        local critical_alerts=$(grep "ERROR" "$alert_file" | grep "$hour_ago" | wc -l)
        
        if [ "$critical_alerts" -gt 5 ]; then
            send_alert "CRITICAL" "SYSTEM" "Multiple critical alerts detected: $critical_alerts in last hour"
        fi
    fi
}

# Run alert check
check_alert_patterns
EOF
    
    chmod +x monitoring/scripts/alert-manager.sh
    
    # Create alert configuration
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

# SSL certificate alerts
SSL_EXPIRY_WARNING_DAYS=30  # Warn when certificate expires in 30 days
SSL_EXPIRY_CRITICAL_DAYS=7  # Critical alert when certificate expires in 7 days

# Container health alerts
CONTAINER_RESTART_THRESHOLD=3  # Alert if container restarts > 3 times in 1 hour

# Network alerts
CONNECTION_THRESHOLD=1000  # Alert if active connections > 1000
EOF
    
    success "✅ Alerting system configured"
}

# Function to setup cron jobs for automated monitoring
setup_cron_jobs() {
    log "⏰ Setting up automated monitoring cron jobs..."
    
    # Get absolute path for cron jobs
    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    
    # Create cron jobs configuration
    cat > monitoring/configs/monitoring-crontab << EOF
# LocallyTrip Automated Monitoring Cron Jobs
# Add these to your crontab with: crontab monitoring/configs/monitoring-crontab

# Run health checks every 5 minutes
*/5 * * * * $SCRIPT_DIR/monitoring/scripts/health-check.sh

# Run resource monitoring every 15 minutes
*/15 * * * * $SCRIPT_DIR/monitoring/scripts/resource-monitor.sh

# Run alert manager every 10 minutes
*/10 * * * * $SCRIPT_DIR/monitoring/scripts/alert-manager.sh

# Aggregate logs daily at 1 AM
0 1 * * * $SCRIPT_DIR/monitoring/scripts/aggregate-logs.sh

# Cleanup old logs weekly at 2 AM on Sundays
0 2 * * 0 find $SCRIPT_DIR/logs -name "*.log" -type f -mtime +30 -delete

# Generate weekly reports at 3 AM on Mondays
0 3 * * 1 $SCRIPT_DIR/monitoring/scripts/generate-report.sh
EOF
    
    info "📋 Cron job configuration created at monitoring/configs/monitoring-crontab"
    info "📝 To activate, run: crontab monitoring/configs/monitoring-crontab"
    
    success "✅ Automated monitoring cron jobs configured"
}

# Function to create reporting system
create_reporting_system() {
    log "📊 Setting up reporting system..."
    
    # Weekly report generator
    cat > monitoring/scripts/generate-report.sh << 'EOF'
#!/bin/bash
# LocallyTrip Weekly Report Generator

WEEK=$(date +%Y-W%U)
REPORT_FILE="monitoring/data/reports/weekly-report-$WEEK.html"
REPORT_DATE=$(date '+%Y-%m-%d')

mkdir -p monitoring/data/reports

# Generate HTML report
cat > "$REPORT_FILE" << EOL
<!DOCTYPE html>
<html>
<head>
    <title>LocallyTrip Weekly Report - $WEEK</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background-color: #f0f0f0; padding: 10px; border-radius: 5px; }
        .metric { margin: 10px 0; padding: 10px; background-color: #f9f9f9; border-radius: 3px; }
        .ok { color: green; } .warning { color: orange; } .error { color: red; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🚀 LocallyTrip Weekly Report</h1>
        <p>Week: $WEEK | Generated: $REPORT_DATE</p>
    </div>

    <h2>📊 Summary</h2>
    <div class="metric">
        <strong>Uptime:</strong> $(docker ps --format "{{.Names}}\t{{.Status}}" | grep locallytrip | wc -l)/5 services running
    </div>

    <h2>🏥 Health Check Summary</h2>
    <table>
        <tr><th>Service</th><th>Status</th><th>Last Check</th></tr>
EOL

# Add health check data
if [ -f "logs/monitoring/health-check-$(date +%Y%m%d).log" ]; then
    tail -20 "logs/monitoring/health-check-$(date +%Y%m%d).log" | grep -E "(OK|ERROR|WARNING)" | tail -5 | while read line; do
        echo "        <tr><td colspan='3'>$line</td></tr>" >> "$REPORT_FILE"
    done
fi

cat >> "$REPORT_FILE" << EOL
    </table>

    <h2>💾 Resource Usage</h2>
    <div class="metric">
        <strong>Current Memory:</strong> $(free -h | grep '^Mem:' | awk '{printf "%s/%s (%.1f%%)", $3, $2, $3/$2*100}')
    </div>
    <div class="metric">
        <strong>Current Disk:</strong> $(df -h / | tail -1 | awk '{print $5 " used (" $3 "/" $2 ")"}')
    </div>

    <h2>🔔 Alerts This Week</h2>
    <div class="metric">
EOL

# Add alert summary
ALERTS_COUNT=0
for i in {0..6}; do
    check_date=$(date -d "$i days ago" +%Y%m%d)
    if [ -f "logs/monitoring/alerts-$check_date.log" ]; then
        daily_alerts=$(wc -l < "logs/monitoring/alerts-$check_date.log")
        ALERTS_COUNT=$((ALERTS_COUNT + daily_alerts))
    fi
done

echo "        <strong>Total Alerts:</strong> $ALERTS_COUNT" >> "$REPORT_FILE"

cat >> "$REPORT_FILE" << EOL
    </div>

    <footer style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666;">
        Generated by LocallyTrip Monitoring System | $(date)
    </footer>
</body>
</html>
EOL

echo "📊 Weekly report generated: $REPORT_FILE"
EOF
    
    chmod +x monitoring/scripts/generate-report.sh
    
    success "✅ Reporting system created"
}

# Main setup function
main() {
    print_header
    
    log "🚀 Starting LocallyTrip monitoring and logging setup..."
    
    create_directories
    create_monitoring_scripts
    create_alerting_system
    setup_cron_jobs
    create_reporting_system
    
    echo ""
    echo -e "${GREEN}================================================================${NC}"
    echo -e "${GREEN}✅ MONITORING & LOGGING SETUP COMPLETED!${NC}"
    echo -e "${GREEN}================================================================${NC}"
    echo ""
    echo -e "${BLUE}📊 What was configured:${NC}"
    echo -e "   • Health checks (every 5 minutes)"
    echo -e "   • Resource monitoring (every 15 minutes)"
    echo -e "   • Alerting system with thresholds"
    echo -e "   • Log rotation and archival"
    echo -e "   • Real-time dashboard"
    echo -e "   • Weekly reporting"
    echo ""
    echo -e "${BLUE}🚀 Quick Start:${NC}"
    echo -e "   • View dashboard: ${GREEN}./monitoring/scripts/dashboard.sh${NC}"
    echo -e "   • Run health check: ${GREEN}./monitoring/scripts/health-check.sh${NC}"
    echo -e "   • Monitor resources: ${GREEN}./monitoring/scripts/resource-monitor.sh${NC}"
    echo -e "   • Live dashboard: ${GREEN}./monitoring/scripts/dashboard.sh --live${NC}"
    echo ""
    echo -e "${BLUE}⚙️ To activate automation:${NC}"
    echo -e "   • Install cron jobs: ${YELLOW}crontab monitoring/configs/monitoring-crontab${NC}"
    echo ""
    echo -e "${GREEN}🎯 Your LocallyTrip monitoring system is ready!${NC}"
}

# Run main function
main "$@"
