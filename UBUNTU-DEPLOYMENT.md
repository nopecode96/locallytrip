# LocallyTrip Ubuntu Server Deployment Documentation

## Overview
This documentation provides comprehensive guidance for deploying LocallyTrip platform on Ubuntu Server with dynamic domain configuration and proper SSL setup.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Dynamic Configuration](#dynamic-configuration)
4. [Deployment Process](#deployment-process)
5. [SSL/TLS Setup](#ssltls-setup)
6. [Monitoring & Maintenance](#monitoring--maintenance)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

### System Requirements
- **OS**: Ubuntu Server 22.04 LTS or later
- **RAM**: Minimum 4GB (8GB recommended)
- **Storage**: Minimum 20GB free space
- **Network**: Public IP address with domain name
- **User**: Non-root user with sudo privileges

### Domain Setup
1. Purchase and configure domain name
2. Point DNS records to your server IP:
   ```
   A     your-domain.com        → Server_IP
   A     www.your-domain.com    → Server_IP
   CNAME admin.your-domain.com  → your-domain.com
   CNAME api.your-domain.com    → your-domain.com
   ```

### Server Preparation
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y git curl wget ufw

# Configure firewall
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

# Create deployment user
sudo useradd -m -s /bin/bash locallytrip
sudo usermod -aG sudo locallytrip
sudo passwd locallytrip
```

## Quick Start

### 1. Switch to Deployment User
```bash
sudo su - locallytrip
cd ~
```

### 2. Clone Repository
```bash
git clone https://github.com/your-username/locallytrip.git
cd locallytrip
```

### 3. Configure Environment
```bash
# Interactive configuration
./configure-environment.sh

# Or specify domain directly
./configure-environment.sh --domain your-domain.com

# For development without SSL
./configure-environment.sh --domain localhost --no-ssl
```

### 4. Deploy Platform
```bash
./deploy-ubuntu-server.sh
```

### 5. Verify Deployment
```bash
# Check service status
./ubuntu-quick-commands.sh status

# View logs
./ubuntu-quick-commands.sh logs

# Test health endpoints
curl -f http://localhost:3001/health
```

## Dynamic Configuration

### Environment Configuration Script
The `configure-environment.sh` script provides dynamic environment configuration:

```bash
# Available options
./configure-environment.sh --help

# Interactive mode (recommended)
./configure-environment.sh

# Silent mode with defaults
./configure-environment.sh --silent --domain your-domain.com

# Force overwrite existing configuration
./configure-environment.sh --force --domain new-domain.com
```

### Generated Configuration
The script automatically generates:
- **Secure passwords**: Database and authentication secrets
- **Domain configuration**: Dynamic URL generation
- **SSL settings**: Let's Encrypt integration
- **Security headers**: CORS and rate limiting
- **Service configuration**: Port mappings and health checks

### Configuration Variables
Key environment variables generated:

```bash
# Domain Configuration
DOMAIN=your-domain.com
ALT_DOMAINS=www.your-domain.com
NEXT_PUBLIC_WEBSITE_URL=https://your-domain.com
NEXT_PUBLIC_API_URL=https://your-domain.com/api

# Security Configuration
DB_PASSWORD=<generated-32-char-password>
JWT_SECRET=<generated-64-char-secret>
SESSION_SECRET=<generated-32-char-secret>

# SSL Configuration
SSL_ENABLED=true
SSL_EMAIL=admin@your-domain.com
SSL_MODE=letsencrypt
```

## Deployment Process

### Main Deployment Script
The `deploy-ubuntu-server.sh` script handles complete deployment:

1. **System Checks**: Validates prerequisites and dependencies
2. **Docker Installation**: Installs Docker and Docker Compose
3. **Environment Setup**: Creates directories and sets permissions
4. **SSL Configuration**: Generates certificates and nginx config
5. **Service Deployment**: Builds and starts all containers
6. **Health Verification**: Validates service health
7. **Monitoring Setup**: Configures log rotation and backups

### Deployment Stages
```bash
# Stage 1: Prerequisites check
./deploy-ubuntu-server.sh --check-only

# Stage 2: Install dependencies only
./deploy-ubuntu-server.sh --install-deps

# Stage 3: Full deployment
./deploy-ubuntu-server.sh

# Stage 4: Update existing deployment
./deploy-ubuntu-server.sh --update
```

### Service Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Admin Panel   │    │   Backend API   │
│   (Next.js)     │    │   (Next.js)     │    │   (Express)     │
│   Port: 3000    │    │   Port: 3002    │    │   Port: 3001    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Nginx Proxy   │
                    │   Ports: 80/443 │
                    └─────────────────┘
                                 │
                    ┌─────────────────┐
                    │   PostgreSQL    │
                    │   Port: 5432    │
                    └─────────────────┘
```

## SSL/TLS Setup

### Automatic SSL with Let's Encrypt
The deployment includes automated SSL certificate generation:

```bash
# SSL configuration is handled by generate-nginx-config.sh
# Certificates are automatically requested and installed
# Nginx configuration includes SSL security headers
```

### SSL Configuration Features
- **Automatic certificate generation** with Let's Encrypt
- **Self-signed fallback** for development/testing
- **Automatic renewal** via cron job
- **Security headers** (HSTS, CSP, X-Frame-Options)
- **Perfect Forward Secrecy** with modern cipher suites

### Manual SSL Management
```bash
# Check SSL certificate status
./ubuntu-quick-commands.sh ssl-status

# Renew SSL certificates
./ubuntu-quick-commands.sh ssl-renew

# View SSL configuration
./ubuntu-quick-commands.sh ssl-config
```

## Monitoring & Maintenance

### Quick Commands Reference
The `ubuntu-quick-commands.sh` script provides 25+ maintenance commands:

```bash
# Service Management
./ubuntu-quick-commands.sh status        # Service status
./ubuntu-quick-commands.sh restart       # Restart services
./ubuntu-quick-commands.sh stop          # Stop services
./ubuntu-quick-commands.sh start         # Start services

# Monitoring
./ubuntu-quick-commands.sh logs          # View all logs
./ubuntu-quick-commands.sh logs-web      # Frontend logs only
./ubuntu-quick-commands.sh logs-api      # Backend logs only
./ubuntu-quick-commands.sh health        # Health check

# Database Management
./ubuntu-quick-commands.sh db-backup     # Create database backup
./ubuntu-quick-commands.sh db-restore    # Restore from backup
./ubuntu-quick-commands.sh db-shell      # Access database shell

# System Monitoring
./ubuntu-quick-commands.sh disk          # Disk usage
./ubuntu-quick-commands.sh memory        # Memory usage
./ubuntu-quick-commands.sh network       # Network statistics
```

### Log Management
```bash
# Log locations
/home/locallytrip/logs/deployment.log    # Deployment logs
/home/locallytrip/logs/docker.log       # Docker container logs
/var/log/nginx/access.log               # Nginx access logs
/var/log/nginx/error.log                # Nginx error logs

# Log rotation is automatically configured
# Logs are retained for 30 days by default
```

### Backup Strategy
```bash
# Automated backups include:
# - Database dump (PostgreSQL)
# - User uploads directory
# - Environment configuration
# - SSL certificates

# Manual backup
./ubuntu-quick-commands.sh backup-full

# Scheduled backups via crontab
# Daily: 2:00 AM database backup
# Weekly: Sunday 3:00 AM full backup
```

## Troubleshooting

### Common Issues

#### 1. SSL Certificate Issues
```bash
# Problem: Let's Encrypt rate limit exceeded
# Solution: Use staging environment first
SSL_MODE=staging ./deploy-ubuntu-server.sh

# Problem: Domain not resolving
# Solution: Check DNS configuration
dig your-domain.com
nslookup your-domain.com 8.8.8.8
```

#### 2. Docker Container Issues
```bash
# Problem: Container won't start
# Solution: Check logs and resources
./ubuntu-quick-commands.sh logs
docker stats
df -h

# Problem: Port conflicts
# Solution: Check port usage
sudo netstat -tulpn | grep :80
sudo netstat -tulpn | grep :443
```

#### 3. Database Connection Issues
```bash
# Problem: Database connection failed
# Solution: Check database status and credentials
./ubuntu-quick-commands.sh db-status
./ubuntu-quick-commands.sh db-shell

# Problem: Database initialization failed
# Solution: Reset database and reseed
./ubuntu-quick-commands.sh db-reset
./ubuntu-quick-commands.sh db-seed
```

#### 4. Performance Issues
```bash
# Problem: High memory usage
# Solution: Monitor and optimize
./ubuntu-quick-commands.sh memory
docker stats
htop

# Problem: Slow response times
# Solution: Check logs and network
./ubuntu-quick-commands.sh logs-nginx
./ubuntu-quick-commands.sh network
```

### Debug Mode
```bash
# Enable debug logging
export DEBUG=true
./deploy-ubuntu-server.sh

# Verbose Docker Compose output
export COMPOSE_LOG_LEVEL=DEBUG
docker compose -f docker-compose.prod.yml logs -f
```

### Recovery Procedures

#### Service Recovery
```bash
# Complete service restart
./ubuntu-quick-commands.sh restart

# Rebuild containers from scratch
./ubuntu-quick-commands.sh rebuild

# Reset to clean state
./ubuntu-quick-commands.sh reset
```

#### Data Recovery
```bash
# Restore database from backup
./ubuntu-quick-commands.sh db-restore /path/to/backup.sql

# Restore uploads from backup
./ubuntu-quick-commands.sh restore-uploads /path/to/uploads.tar.gz
```

## Production Considerations

### Security Hardening
```bash
# Additional security measures for production:
# 1. Configure fail2ban for intrusion prevention
sudo apt install fail2ban
sudo systemctl enable fail2ban

# 2. Regular security updates
sudo apt update && sudo apt upgrade -y

# 3. Monitor logs for suspicious activity
sudo tail -f /var/log/auth.log
sudo tail -f /var/log/nginx/access.log
```

### Performance Optimization
```bash
# 1. Configure swap for memory management
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# 2. Optimize Docker resources
# Edit docker-compose.prod.yml to set resource limits

# 3. Configure log rotation
sudo logrotate -f /etc/logrotate.conf
```

### Scaling Considerations
- **Horizontal scaling**: Use Docker Swarm or Kubernetes
- **Database scaling**: Consider PostgreSQL read replicas
- **CDN integration**: Use CloudFlare or AWS CloudFront
- **Load balancing**: Configure multiple nginx instances

## Support and Maintenance

### Regular Maintenance Schedule
```bash
# Daily (automated)
# - Database backup
# - Log rotation
# - Health checks

# Weekly (manual)
# - Security updates
# - Performance review
# - Backup verification

# Monthly (manual)
# - SSL certificate renewal check
# - Disk space cleanup
# - Security audit
```

### Getting Help
- **Documentation**: Check this file and inline comments
- **Logs**: Use quick commands to access detailed logs
- **Community**: LocallyTrip GitHub discussions
- **Professional Support**: Contact development team

---

**Last Updated**: $(date)
**Version**: 1.0.0
**Author**: LocallyTrip Development Team
