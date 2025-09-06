# LocallyTrip Production Deployment Guide

This guide provides step-by-step instructions for deploying LocallyTrip to a production server.

## 📋 Prerequisites

### Server Requirements
- **OS**: Ubuntu 20.04+ or CentOS 8+ (recommended: Ubuntu 22.04 LTS)
- **RAM**: Minimum 4GB, Recommended 8GB+
- **Storage**: Minimum 20GB SSD, Recommended 50GB+
- **CPU**: 2+ cores recommended
- **Network**: Static IP address with ports 80, 443, and 22 open

### Domain Configuration
Before deployment, ensure your domains are properly configured:
- `locallytrip.com` → Server IP
- `www.locallytrip.com` → Server IP  
- `api.locallytrip.com` → Server IP
- `admin.locallytrip.com` → Server IP

### Required Software
- Docker 20.10+
- Docker Compose 2.0+
- Git
- OpenSSL

## 🚀 Quick Deployment

### 1. Clone Repository
```bash

# Alternative: Using SSH (if SSH key is set up)
# git clone git@github.com:sourcexcode12/locallytrip.git
# cd locallytrip
```

### 2. Configure Environment
```bash
# Copy production environment template
cp .env.production .env

# Edit environment variables
nano .env
```

**Critical Environment Variables:**
```bash
NODE_ENV=production
DOMAIN=locallytrip.com
DB_PASSWORD=your-secure-database-password
JWT_SECRET=your-super-secure-jwt-secret-key
SSL_EMAIL=admin@locallytrip.com

# Production URLs
NEXT_PUBLIC_API_URL=https://api.locallytrip.com
NEXT_PUBLIC_IMAGES=https://api.locallytrip.com/images
NEXT_PUBLIC_WEBSITE_URL=https://locallytrip.com
```

### 3. Setup SSL Certificates
```bash
# For Let's Encrypt certificates (recommended)
./setup-ssl.sh

# Choose option 2 for Let's Encrypt
```

### 4. Pre-deployment Check
```bash
# Verify system readiness
./check-deployment-readiness.sh
```

### 5. Deploy
```bash
# Run complete deployment
./deploy-production-complete.sh
```

## 📁 File Structure

### Production Files Structure
```
├── docker-compose.prod.yml          # Production Docker Compose
├── nginx/
│   ├── nginx-prod-clean.conf        # Production Nginx config
│   └── conf.d/
│       └── default.conf             # Server configurations
├── ssl/
│   ├── cert.pem                     # SSL certificate (generated)
│   └── key.pem                      # SSL private key (generated)
├── check-deployment-readiness.sh    # Pre-deployment checks
├── deploy-production-complete.sh    # Main deployment script
├── setup-ssl.sh                     # SSL setup script
├── seed-database-complete.sh        # Database seeding
├── setup-production-secrets.sh      # Production secrets
└── renew-ssl.sh                     # Certificate renewal
```

## 🔧 Configuration Details

### Docker Compose Production Features
- **Multi-stage builds** for optimized images
- **Health checks** for all services
- **Resource limits** to prevent system overload
- **Persistent volumes** for data safety
- **Restart policies** for high availability
- **Network isolation** for security

### Nginx Configuration Features
- **SSL/TLS termination** with modern security standards
- **Rate limiting** for API protection
- **GZIP compression** for performance
- **Security headers** (HSTS, CSP, etc.)
- **Load balancing** ready for scaling
- **Static file caching** for performance
- **WebSocket support** for Next.js

### Database Configuration
- **Persistent storage** with Docker volumes
- **Automatic initialization** from seed files
- **Connection pooling** for performance
- **Backup-ready** configuration
- **SSL connections** in production

## 🛡️ Security Features

### SSL/TLS Security
- **TLS 1.2/1.3 only**
- **Strong cipher suites**
- **HSTS headers** with preload
- **OCSP stapling**
- **Perfect Forward Secrecy**

### Application Security
- **CSP headers** to prevent XSS
- **Frame protection** against clickjacking
- **CSRF protection** built into Next.js
- **Rate limiting** on API endpoints
- **Authentication** with JWT tokens
- **Environment isolation**

### Network Security
- **Firewall-friendly** (only ports 80, 443, 22)
- **Container network isolation**
- **Reverse proxy** protection
- **Request validation** at Nginx level

## 📊 Monitoring & Maintenance

### Health Checks
- **Application**: `https://locallytrip.com/health`
- **API**: `https://api.locallytrip.com/health`
- **Database**: Docker health checks
- **Nginx**: Configuration validation

### Log Locations
- **Nginx logs**: `/var/log/nginx/`
- **Application logs**: Docker logs via `docker logs`
- **Database logs**: PostgreSQL container logs
- **System logs**: `/var/log/`

### Backup Strategy
```bash
# Automatic backup before each deployment (handled by deploy script)
# Manual backup command:
docker exec locallytrip-postgres-prod pg_dump -U $DB_USER -d $DB_NAME | gzip > backup_$(date +%Y%m%d).sql.gz
```

### SSL Certificate Renewal
```bash
# Automatic renewal (add to crontab):
0 2 * * 0 /path/to/locallytrip/renew-ssl.sh

# Manual renewal:
./renew-ssl.sh
```

## 🔄 Deployment Workflow

### Initial Deployment
1. ✅ **Pre-checks**: System requirements, environment config
2. ✅ **SSL Setup**: Generate/install SSL certificates  
3. ✅ **Build**: Docker images with production optimizations
4. ✅ **Database**: Initialize with seed data
5. ✅ **Services**: Start all containers with health checks
6. ✅ **Verification**: End-to-end testing of all endpoints

### Updates/Redeployments
1. **Backup**: Automatic backup of current state
2. **Code Update**: Git pull latest changes
3. **Rebuild**: Fresh container builds
4. **Rolling Update**: Zero-downtime service replacement
5. **Health Check**: Verify all services are working
6. **Rollback**: Automatic if health checks fail

## 🐛 Troubleshooting

### Common Issues

#### SSL Certificate Problems
```bash
# Check certificate validity
openssl x509 -in ssl/cert.pem -text -noout

# Regenerate self-signed certificates
./setup-ssl.sh
# Choose option 1
```

#### Database Connection Issues
```bash
# Check database health
docker exec locallytrip-postgres-prod pg_isready -U $DB_USER -d $DB_NAME

# View database logs
docker logs locallytrip-postgres-prod
```

#### Application Startup Problems
```bash
# Check container status
docker compose -f docker-compose.prod.yml ps

# View application logs
docker logs locallytrip-backend-prod
docker logs locallytrip-web-prod
docker logs locallytrip-admin-prod
```

#### Nginx Configuration Errors
```bash
# Test Nginx configuration
docker exec locallytrip-nginx-prod nginx -t

# Reload Nginx configuration
docker exec locallytrip-nginx-prod nginx -s reload
```

### Performance Optimization

#### Database Optimization
```bash
# Analyze database performance
docker exec -it locallytrip-postgres-prod psql -U $DB_USER -d $DB_NAME
# Run: EXPLAIN ANALYZE SELECT ...
```

#### Application Monitoring
```bash
# Monitor resource usage
docker stats

# Check application metrics
curl -s https://api.locallytrip.com/health | jq
```

## 📞 Support

### Log Collection for Support
```bash
# Collect deployment logs
docker compose -f docker-compose.prod.yml logs > deployment-logs.txt

# Collect individual service logs
docker logs locallytrip-backend-prod > backend-logs.txt
docker logs locallytrip-web-prod > web-logs.txt
docker logs locallytrip-admin-prod > admin-logs.txt
docker logs locallytrip-nginx-prod > nginx-logs.txt
docker logs locallytrip-postgres-prod > postgres-logs.txt
```

### Emergency Procedures

#### Quick Rollback
```bash
# Stop current deployment
docker compose -f docker-compose.prod.yml down

# Restore from backup (if needed)
# Restore database: docker exec -i locallytrip-postgres-prod psql -U $DB_USER -d $DB_NAME < backup.sql

# Restart with previous version
git checkout [previous-commit]
./deploy-production-complete.sh
```

#### Emergency Contacts
- **Repository**: https://github.com/nopecode96/locallytrip
- **Documentation**: This file and inline code comments
- **Backup Location**: Project root backup-YYYYMMDD-HHMMSS directories

---

## ✅ Production Checklist

Before going live, ensure:

- [ ] Domain DNS is properly configured
- [ ] SSL certificates are valid and configured
- [ ] Environment variables are set correctly
- [ ] Database seed data is current
- [ ] All health checks are passing
- [ ] Backups are configured and tested
- [ ] Monitoring is set up
- [ ] Security headers are configured
- [ ] Rate limiting is working
- [ ] Error pages are customized
- [ ] Log rotation is configured
- [ ] SSL certificate renewal is automated

**Your LocallyTrip production deployment is ready! 🚀**
