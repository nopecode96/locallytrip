# LocallyTrip Ubuntu 24.### Basic Production Deployment

```bash
# 1. Connect to Ubuntu server
ssh root@your-server-ip

# 2. Clone repository
sudo git clone https://github.com/nopecode96/locallytrip.git /opt/locallytrip
cd /opt/locallytrip

# 3. Set permissions
sudo chown -R $USER:$USER /opt/locallytrip

# 4. Run deployment (includes SSL setup)
chmod +x deploy-locallytrip.sh
sudo ./deploy-locallytrip.sh production

# 5. Verify SSL certificates
sudo ./deploy-locallytrip.sh production ssl-verify
```

### SSL-Enhanced Deployment (Recommended)

```bash
# Production deployment with automatic SSL setup
sudo ./deploy-locallytrip.sh production --ssl-auto

# Or with custom domain
sudo ./deploy-locallytrip.sh production --ssl-auto --domain=locallytrip.com

# Manual SSL setup (if needed)
sudo ./deploy-locallytrip.sh production --ssl-manual
```t Quick Guide

## Unified Deplo### 2. Production Deployment (Ubuntu 24.04 LTS)
```bash
# Step 1: Copy to Ubuntu server (to temporary location)
rsync -avz --exclude='.git' --exclude='node_modules' ./ user@103.189.234.54:/tmp/locallytrip/

# Step 2: SSH to Ubuntu server
ssh user@103.189.234.54

# Step 3: Navigate to temporary directory
cd /tmp/locallytrip

# Step 4: Deploy to production (will move to /opt/locallytrip)
sudo ./deploy-locallytrip.sh production --platform=ubuntu --verbose

# The script will automatically:
# - Create /opt/locallytrip/ directory
# - Move project files from /tmp/locallytrip to /opt/locallytrip
# - Set up proper permissions and ownership
# - Configure Docker services
# - Start all containers
```

### Alternative: Direct Clone from GitHub
```bash
# SSH to Ubuntu server
ssh user@103.189.234.54

# Clone directly to production directory
sudo mkdir -p /opt
sudo chown $USER:$USER /opt
cd /opt
git clone https://github.com/nopecode96/locallytrip.git

# Deploy
cd locallytrip
sudo ./deploy-locallytrip.sh production --platform=ubuntu --verbose
```

The `deploy-locallytrip.sh` script is specifically optimized for **Ubuntu 24.04 LTS** with comprehensive production features.

## Prerequisites

### Server Requirements
- **OS**: Ubuntu 24.04 LTS (tested and optimized)
- **RAM**: Minimum 8GB (recommended for production)
- **Disk**: Minimum 20GB free space
- **CPU**: 2+ cores recommended
- **Network**: Public IP with open ports 80, 443, 22

### Domain & SSL Requirements
- **Domain**: Valid domain pointing to server IP
  - `locallytrip.com` → Server IP
  - `www.locallytrip.com` → Server IP  
  - `admin.locallytrip.com` → Server IP
- **SSL**: Production requires valid SSL certificates (auto-setup available)

### Access Requirements
- SSH access to Ubuntu server
- sudo privileges
- Internet connectivity for Docker pulls and SSL certificate generation

### Server Directory Structure
The deployment script will automatically create and use these directories on Ubuntu server:

```
/opt/locallytrip/                    # Main project directory (production)
├── backend/                         # Backend API service
├── web/                            # Frontend Next.js app
├── web-admin/                      # Admin dashboard
├── nginx/                          # Nginx configuration
├── ssl/                            # SSL certificates
├── .env.production                 # Production environment
├── docker-compose.prod.yml         # Production compose file
├── deploy-locallytrip.sh          # Deployment script
└── docs/                           # Documentation

/opt/locallytrip-backups/           # Backup directory
├── backup_production_20250924_143022/
├── backup_production_20250923_091245/
└── ...

/opt/locallytrip-staging/           # Staging environment (optional)
└── [same structure as production]

/var/log/locallytrip/               # Application logs
├── deploy-production.log           # Deployment logs
├── app.log                        # Application logs
└── monitor.log                    # Monitoring logs

/tmp/locallytrip/                   # Temporary deployment directory
└── [project files during deployment]
```

### Directory Permissions
```bash
# Project directories (auto-created by script)
sudo chown -R $USER:$USER /opt/locallytrip
sudo chown -R $USER:$USER /opt/locallytrip-backups

# Log directories
sudo chown -R $USER:$USER /var/log/locallytrip
```

### macOS Development Requirements
- **Bash 4.0+** (install with `brew install bash`)
- **Docker Desktop** running

## Quick Start

### 1. Development Deployment (Local)
```bash
# Test deployment (safe)
./deploy-locallytrip.sh development --dry-run

# Deploy to localhost
./deploy-locallytrip.sh development
```

### 2. Production Deployment (Ubuntu 24.04 LTS)
```bash
# Copy to Ubuntu server
rsync -avz ./ user@103.189.234.54:/opt/locallytrip/

# SSH to Ubuntu server
ssh user@103.189.234.54

# Deploy to production
cd /opt/locallytrip
sudo ./deploy-locallytrip.sh production --platform=ubuntu --verbose
```

## Ubuntu 24.04 LTS Specific Features

### Automatic System Optimization
The script automatically configures Ubuntu 24.04 LTS for production:

#### Kernel Parameters
```bash
# Network performance
net.core.somaxconn = 65535
net.ipv4.tcp_max_syn_backlog = 65535
net.ipv4.tcp_keepalive_time = 600

# Memory management
vm.swappiness = 10
vm.dirty_ratio = 15

# File system
fs.file-max = 2097152
```

#### Docker Daemon Optimization
```json
{
    "log-driver": "json-file",
    "log-opts": {
        "max-size": "10m",
        "max-file": "3"
    },
    "storage-driver": "overlay2",
    "live-restore": true,
    "userland-proxy": false
}
```

#### UFW Firewall Configuration
```bash
# Essential ports only
ufw allow ssh          # Port 22
ufw allow 80/tcp        # HTTP
ufw allow 443/tcp       # HTTPS
ufw allow from 127.0.0.1 to any port 5432  # PostgreSQL localhost only
```

#### System Limits
```bash
# File descriptors
* soft nofile 65535
* hard nofile 65535

# Process limits
* soft nproc 32768
* hard nproc 32768
```

## Command Options

### Environment Selection
```bash
./deploy-locallytrip.sh development    # Local development
./deploy-locallytrip.sh staging        # Staging server
./deploy-locallytrip.sh production     # Production server
```

### Advanced Options
```bash
--platform=ubuntu           # Force Ubuntu platform detection
--force-rebuild             # Rebuild all Docker images
--skip-tests                # Skip health checks
--skip-backup              # Skip backup creation
--verbose                  # Enable detailed logging
--dry-run                  # Preview without executing
--project-dir=/custom/path  # Custom project directory
```

## Environment Configurations

### Development Environment
- **Compose File**: `docker-compose.yml`
- **Environment**: `.env`
- **Services**: postgres, backend, web, web-admin (4 containers)
- **Ports**: 3000 (web), 3001 (api), 3002 (admin), 5432 (db)
- **Domain**: localhost
- **Directory**: Current working directory (macOS/Ubuntu)

### Staging Environment
- **Compose File**: `docker-compose.staging.yml`
- **Environment**: `.env.staging`
- **Services**: postgres, backend, web, web-admin, nginx (5 containers)
- **Ports**: 80 (http), 443 (https), 5432 (db, localhost only)
- **Domain**: staging.locallytrip.com
- **Directory**: `/opt/locallytrip-staging/` (Ubuntu server)

### Production Environment
- **Compose File**: `docker-compose.prod.yml`
- **Environment**: `.env.production`
- **Services**: postgres, backend, web, web-admin, nginx (5 containers)
- **Ports**: 80 (http), 443 (https), 5432 (db, localhost only)
- **Domain**: locallytrip.com
- **Directory**: `/opt/locallytrip/` (Ubuntu server)

## Ubuntu Server Directory Management

### Automatic Directory Creation
The deployment script automatically handles directory creation and permissions:

```bash
# Production directories (auto-created)
/opt/locallytrip/              # Main application
/opt/locallytrip-backups/      # Automated backups
/var/log/locallytrip/          # Application logs
/tmp/locallytrip/              # Temporary deployment

# Staging directories (if using staging)
/opt/locallytrip-staging/      # Staging application
/opt/locallytrip-staging-backups/  # Staging backups
```

### Manual Directory Setup (if needed)
```bash
# Create directories manually
sudo mkdir -p /opt/locallytrip
sudo mkdir -p /opt/locallytrip-backups
sudo mkdir -p /var/log/locallytrip

# Set ownership
sudo chown -R $USER:$USER /opt/locallytrip
sudo chown -R $USER:$USER /opt/locallytrip-backups
sudo chown -R $USER:$USER /var/log/locallytrip

# Set permissions
chmod 755 /opt/locallytrip
chmod 755 /opt/locallytrip-backups
chmod 755 /var/log/locallytrip
```

### Directory Structure After Deployment
```
/opt/locallytrip/
├── backend/
│   ├── src/
│   ├── public/images/          # Static images
│   ├── Dockerfile
│   └── package.json
├── web/
│   ├── src/
│   ├── public/
│   ├── Dockerfile
│   └── package.json
├── web-admin/
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── nginx/
│   ├── nginx.conf
│   └── conf.d/
├── ssl/
│   ├── cert.pem
│   └── key.pem
├── docs/
├── .env.production
├── docker-compose.prod.yml
├── deploy-locallytrip.sh      # Main deployment script
├── validate-ubuntu-server.sh  # Validation script
├── monitor-production.sh      # Generated monitoring script
└── deploy-production.log      # Deployment log
```

### Storage Considerations
```bash
# Estimated disk usage per environment:
Production:  ~500MB (app) + ~2GB (Docker images) + logs/backups
Staging:     ~500MB (app) + ~2GB (Docker images) + logs/backups
Development: ~400MB (app) + ~1.5GB (Docker images)

# Backup retention:
- Automatic cleanup keeps last 5 backups
- Database backups included in each backup
- Manual cleanup: ./deploy-locallytrip.sh production cleanup
```

### Automatic Docker Installation
If Docker is not installed, the script will:
1. Add Docker's official GPG key
2. Set up Docker repository for Ubuntu 24.04
3. Install Docker CE with Compose plugin
4. Configure Docker daemon with optimizations
5. Add user to docker group
6. Start and enable Docker service

### Platform Detection
```bash
# The script automatically detects:
- Ubuntu 24.04 LTS (fully supported)
- Ubuntu 20.xx/22.xx (compatible with warnings)
- Generic Linux (fallback mode)
- macOS (development mode)
```

### Memory & Disk Validation
```bash
# Automatic validation based on environment:
Development: 4GB RAM, 10GB disk
Staging:     8GB RAM, 20GB disk  
Production:  8GB RAM, 20GB disk
```

### Health Checks
The script includes Ubuntu-specific health verification:
- Container startup timing (Ubuntu may be slower)
- Service endpoint testing
- Resource usage monitoring
- Integration test suite

## Deployment Process Flow

```
1. Pre-flight Checks
   ├── Platform detection (Ubuntu 24.04 LTS)
   ├── System requirements validation
   ├── Docker installation/verification
   └── Project structure validation

2. Environment Setup
   ├── Environment variables configuration
   ├── Ubuntu system optimization
   ├── Firewall configuration (UFW)
   └── Network setup

3. Docker Build & Deploy
   ├── Build context preparation
   ├── Multi-stage Docker builds
   └── Service orchestration

4. Database Operations
   ├── PostgreSQL startup wait
   ├── Migration execution
   └── Data seeding (development only)

5. Health Verification
   ├── Container health checks
   ├── Service endpoint testing
   └── Integration tests

6. Cleanup & Monitoring
   ├── Resource cleanup
   ├── Monitoring setup
   ├── Backup creation
   └── Deployment report
```

## Troubleshooting Ubuntu 24.04 LTS

### Docker Permission Issues
```bash
# If you get permission denied errors:
sudo usermod -aG docker $USER
newgrp docker
```

### Memory Issues
```bash
# Check system memory:
free -h
docker stats

# If low memory, adjust swappiness:
echo 'vm.swappiness=10' | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

### Firewall Issues
```bash
# Check UFW status:
sudo ufw status verbose

# Reset firewall if needed:
sudo ufw --force reset
./deploy-locallytrip.sh production --platform=ubuntu
```

### Container Startup Issues
```bash
# Check container logs:
docker compose -f docker-compose.prod.yml logs backend

# Restart specific service:
docker compose -f docker-compose.prod.yml restart backend
```

## Monitoring & Maintenance

### Directory Navigation & Management
```bash
# Navigate to production directory
cd /opt/locallytrip

# Navigate to staging directory (if used)
cd /opt/locallytrip-staging

# Check backup directory
ls -la /opt/locallytrip-backups/
du -sh /opt/locallytrip-backups/*

# View application logs
tail -f /var/log/locallytrip/deploy-production.log
tail -f /var/log/locallytrip/app.log
```

### Application Management Commands
```bash
# Check deployment status (from project directory)
cd /opt/locallytrip
./deploy-locallytrip.sh production health

# Create manual backup
./deploy-locallytrip.sh production backup

# Clean up system (removes old backups, cleans Docker)
./deploy-locallytrip.sh production cleanup

# Update application (redeploy from latest code)
cd /opt/locallytrip
git pull origin main
sudo ./deploy-locallytrip.sh production --force-rebuild

# Monitor containers in real-time
docker compose -f docker-compose.prod.yml ps
docker stats
```

### Directory Maintenance
```bash
# Check disk usage
du -sh /opt/locallytrip*
du -sh /var/log/locallytrip

# Manual backup cleanup (keep last 3)
cd /opt/locallytrip-backups
ls -t | tail -n +4 | xargs rm -rf

# Clear old logs (older than 7 days)
find /var/log/locallytrip -name "*.log" -mtime +7 -delete

# Check directory permissions
ls -la /opt/ | grep locallytrip
```

### Generated Scripts & Files
After deployment, the script creates:
- `monitor-production.sh` - System monitoring
- `deployment-report-production-TIMESTAMP.txt` - Deployment summary

### Log Locations
- Application logs: `/var/log/locallytrip/deploy-production.log`
- Application runtime: `/var/log/locallytrip/app.log`
- Docker logs: `docker compose logs`
- System logs: `/var/log/syslog`

### Backup Locations
- Project backups: `/opt/locallytrip-backups/`
- Database backups: Included in project backups
- Configuration backups: `.env*` and `docker-compose*.yml`

## Performance Expectations (Ubuntu 24.04 LTS)

### Server Specs (4 vCPU, 14GB RAM)
- **Concurrent Users**: 1000-2000
- **Request Rate**: 200-500 req/sec
- **Response Time**: <300ms API, <200ms frontend
- **Database**: 5M+ records supported

### Container Resource Usage
```yaml
nginx:     256MB RAM, 0.5 CPU
backend:   1GB RAM, 1.0 CPU
web:       512MB RAM, 0.5 CPU
web-admin: 512MB RAM, 0.5 CPU
postgres:  2GB RAM, 1.0 CPU
```

## Success Indicators

After successful deployment, you should see:
- ✅ All containers running and healthy
- ✅ Website accessible at https://locallytrip.com
- ✅ Admin panel at https://admin.locallytrip.com  
- ✅ API health endpoint responding
- ✅ Database populated with initial data
- ✅ **SSL certificates working (HTTPS green lock)**
- ✅ **HTTP redirect to HTTPS working**
- ✅ Firewall configured properly
- ✅ System optimizations applied

### SSL Verification Commands
```bash
# Check SSL certificate status
sudo ./deploy-locallytrip.sh production ssl-verify

# Test SSL certificate
openssl s_client -connect locallytrip.com:443 -servername locallytrip.com

# Check certificate expiry
curl -vI https://locallytrip.com 2>&1 | grep expire

# Verify auto-renewal
sudo certbot certificates
```

## Quick Reference - Directory Commands

### Essential Directories
```bash
# Application
cd /opt/locallytrip                    # Main production app
cd /opt/locallytrip-staging           # Staging app (if used)

# Logs & Monitoring
tail -f /var/log/locallytrip/deploy-production.log  # Deployment log
tail -f /var/log/locallytrip/app.log               # Application log

# Backups
ls -la /opt/locallytrip-backups/      # List backups
du -sh /opt/locallytrip-backups/*     # Check backup sizes
```

### Daily Operations
```bash
# Check system status
cd /opt/locallytrip && ./deploy-locallytrip.sh production health

# Create backup
cd /opt/locallytrip && ./deploy-locallytrip.sh production backup

# Update and redeploy
cd /opt/locallytrip && git pull && sudo ./deploy-locallytrip.sh production

# Clean up old files
cd /opt/locallytrip && ./deploy-locallytrip.sh production cleanup
```

---

**Note**: This script is specifically tested and optimized for Ubuntu 24.04 LTS. For other Ubuntu versions or Linux distributions, some features may require manual adjustment.