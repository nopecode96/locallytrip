# LocallyTrip Ubuntu 24.04 LTS Deployment Quick Guide

## Unified Deployment Script

The `deploy-locallytrip.sh` script is specifically optimized for **Ubuntu 24.04 LTS** with comprehensive production features.

## Prerequisites

### Ubuntu 24.04 LTS Server Requirements
- **Bash 4.0+** (pre-installed on Ubuntu 24.04)
- **4GB+ RAM** (script validates automatically)
- **10GB+ disk space** (script validates automatically)
- **sudo privileges** for system optimizations

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

### Production Environment
- **Compose File**: `docker-compose.prod.yml`
- **Environment**: `.env.production`
- **Services**: postgres, backend, web, web-admin, nginx (5 containers)
- **Ports**: 80 (http), 443 (https), 5432 (db, localhost only)
- **Domain**: locallytrip.com

## Ubuntu 24.04 LTS Compatibility Features

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

### Generated Scripts
After deployment, the script creates:
- `monitor-production.sh` - System monitoring
- `deployment-report-production-TIMESTAMP.txt` - Deployment summary

### Log Locations
- Application logs: `/opt/locallytrip/deploy-production.log`
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
- ✅ SSL certificates working
- ✅ Firewall configured properly
- ✅ System optimizations applied

---

**Note**: This script is specifically tested and optimized for Ubuntu 24.04 LTS. For other Ubuntu versions or Linux distributions, some features may require manual adjustment.