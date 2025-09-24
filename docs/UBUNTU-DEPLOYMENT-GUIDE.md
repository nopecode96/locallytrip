# LocallyTrip Ubuntu 24.04 LTS Deployment Guide

## Server Specifications
- **OS**: Ubuntu 24.04 LTS
- **Location**: Singapore (sgp01)
- **Server**: 4 vCPU, 14GB RAM, 40GB SSD
- **IP**: 103.189.234.54
- **Domain**: locallytrip.com

## Prerequisites

### 1. Server Access
- SSH access to Ubuntu server
- Root or sudo privileges
- SSH key authentication setup

### 2. Local Requirements (macOS)
- Docker Desktop installed
- Project cloned and cleaned (362MB)
- Environment files configured (.env.production)

### 3. Domain Configuration
- DNS A record: `locallytrip.com` → `103.189.234.54`
- DNS A record: `admin.locallytrip.com` → `103.189.234.54`
- DNS A record: `api.locallytrip.com` → `103.189.234.54`

## Deployment Process

### Step 1: Pre-deployment Validation (Run from macOS)

```bash
# Validate Ubuntu server readiness
./validate-ubuntu-server.sh

# Check specific components
./validate-ubuntu-server.sh ssh-test
./validate-ubuntu-server.sh specs
./validate-ubuntu-server.sh docker
```

### Step 2: Copy Project to Server

```bash
# Copy project files (excluding git and node_modules)
rsync -avz --exclude='.git' --exclude='node_modules' --exclude='.next' ./ locallytrip@103.189.234.54:/tmp/locallytrip/
```

### Step 3: Deploy on Ubuntu Server

```bash
# SSH to server
ssh locallytrip@103.189.234.54

# Navigate to project directory
cd /tmp/locallytrip

# Run deployment script
sudo ./deploy-ubuntu.sh
```

### Step 4: Monitor Deployment

```bash
# Watch deployment logs
tail -f /var/log/locallytrip-deploy.log

# Check container status
docker ps

# Check application health
curl http://localhost:3001/health
```

## What the Deployment Script Does

### 1. System Preparation
- ✅ Validates Ubuntu 24.04 LTS compatibility
- ✅ Checks system requirements (4GB RAM, 2+ CPU cores, 20GB disk)
- ✅ Installs Docker Engine and Docker Compose V2
- ✅ Configures UFW firewall (ports 22, 80, 443)
- ✅ Optimizes kernel parameters for production

### 2. Application Deployment
- ✅ Creates project directory `/opt/locallytrip`
- ✅ Backs up existing deployment
- ✅ Copies production environment variables
- ✅ Builds Docker images with multi-stage optimization
- ✅ Starts services with production configuration

### 3. Post-deployment Setup
- ✅ Runs comprehensive health checks
- ✅ Sets up monitoring and alerting
- ✅ Configures automatic cleanup tasks
- ✅ Creates log rotation and backup policies

## Ubuntu-Specific Optimizations

### System Performance
```bash
# Kernel parameters optimized for web applications
net.core.somaxconn = 65535
net.ipv4.tcp_max_syn_backlog = 65535
vm.swappiness = 10
fs.file-max = 2097152
```

### Docker Configuration
```json
{
    "log-driver": "json-file",
    "log-opts": {
        "max-size": "10m",
        "max-file": "3"
    },
    "storage-driver": "overlay2"
}
```

### Firewall Rules
```bash
# Allow essential services only
ufw allow ssh
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw allow from 127.0.0.1 to any port 5432  # PostgreSQL localhost only
```

## Service Architecture on Ubuntu

### Production Services (5 containers)
1. **nginx**: Reverse proxy with SSL termination
2. **backend**: Node.js API server (port 3001)
3. **web**: Next.js frontend (port 3000)
4. **web-admin**: Admin dashboard (port 3002)
5. **postgres**: PostgreSQL database (port 5432, localhost only)

### Resource Limits
```yaml
nginx:     256MB RAM, 0.5 CPU
backend:   1GB RAM, 1.0 CPU  
web:       512MB RAM, 0.5 CPU
web-admin: 512MB RAM, 0.5 CPU
postgres:  1GB RAM, 1.0 CPU
```

## Environment Configuration

### Critical Production Variables
```env
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.locallytrip.com
NEXTAUTH_URL=https://locallytrip.com
CORS_ORIGIN=https://locallytrip.com,https://admin.locallytrip.com,https://api.locallytrip.com
```

### Database Configuration
```env
DB_HOST=postgres
DB_PORT=5432
DB_NAME=locallytrip_prod
DB_USER=locallytrip_prod_user
DB_PASSWORD=ucsaBQIJOcN+ui5nzYZHQw4S/17btJ/0VS7Wi+Ts1Ns=
```

## Monitoring and Maintenance

### Health Monitoring
- Automated health checks every 5 minutes
- Container status monitoring
- Resource usage alerts (disk >85%, memory >90%)
- Optional Telegram notifications

### Log Management
- Application logs: `/var/log/locallytrip/`
- Deployment logs: `/var/log/locallytrip-deploy.log`
- Docker logs: Limited to 10MB, 3 files rotation
- Nginx access logs: `/var/log/nginx/`

### Backup Strategy
- Database backups before each deployment
- Project backups in `/opt/locallytrip-backups/`
- Automatic cleanup (keeps last 5 backups)
- Manual backup: `./deploy-ubuntu.sh backup`

## Troubleshooting

### Common Issues

#### 1. Docker Permission Issues
```bash
# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker
```

#### 2. SSL Certificate Issues
```bash
# Check certificate validity
openssl x509 -in /opt/locallytrip/ssl/cert.pem -text -noout
```

#### 3. Database Connection Issues
```bash
# Check PostgreSQL container
docker logs locallytrip-postgres-prod
docker exec -it locallytrip-postgres-prod psql -U locallytrip_prod_user -d locallytrip_prod
```

#### 4. Memory Issues
```bash
# Check memory usage
free -h
docker stats
```

### Manual Recovery
```bash
# Stop all services
docker compose -f /opt/locallytrip/docker-compose.prod.yml down

# Start specific service
docker compose -f /opt/locallytrip/docker-compose.prod.yml up -d postgres

# View logs
docker logs locallytrip-backend-prod --tail 100
```

## Security Considerations

### Network Security
- UFW firewall with minimal open ports
- PostgreSQL accessible only from localhost
- SSL/TLS encryption for all web traffic
- Docker containers run with security contexts

### Application Security
- Production JWT secrets
- Secure environment variable handling
- Rate limiting and CORS configuration
- Regular security updates via automated deployment

## Performance Expectations

### Server Capacity
- **Concurrent Users**: 500-1000 (estimated)
- **Request Rate**: 100-200 req/sec
- **Database**: 1M+ records supported
- **Storage**: 40GB SSD (expandable)

### Response Times
- **Frontend**: <200ms (cached)
- **API Endpoints**: <500ms
- **Database Queries**: <100ms
- **Image Loading**: <1s (optimized)

## Maintenance Commands

```bash
# Check deployment status
./deploy-ubuntu.sh health

# Create manual backup
./deploy-ubuntu.sh backup

# Clean up system
./deploy-ubuntu.sh cleanup

# View application logs
tail -f /var/log/locallytrip/app.log

# Monitor containers
docker compose -f /opt/locallytrip/docker-compose.prod.yml ps

# Update application (redeploy)
cd /opt/locallytrip && sudo ./deploy-ubuntu.sh
```

## Success Criteria

After successful deployment, you should see:
- ✅ All 5 containers running
- ✅ Website accessible at https://locallytrip.com
- ✅ Admin panel at https://admin.locallytrip.com
- ✅ API health check returns 200 OK
- ✅ Database seeded with sample data
- ✅ SSL certificates working
- ✅ Monitoring and logging active

---

**Note**: This deployment is optimized for Ubuntu 24.04 LTS with the specified server hardware. For different configurations, adjust resource limits and system parameters accordingly.