# 🚀 LocallyTrip Server Deployment Guide

## Fixed Issues ✅

The deployment script has been fixed to resolve:
- `production: unbound variable` error at line 531
- Array parsing compatibility issues
- Shell compatibility for Ubuntu 24.04 LTS

## 🔧 Server-Side Deployment Steps

### **1. Update Server Code**
```bash
# Pull latest fixes from GitHub
cd /opt/locallytrip
git pull origin main

# Verify script is executable  
chmod +x deploy-locallytrip.sh
```

### **2. Deploy Production Environment**
```bash
# Deploy with SSL auto-setup (recommended)
sudo ./deploy-locallytrip.sh production --ssl-auto

# Or deploy without SSL for testing
sudo ./deploy-locallytrip.sh production
```

### **3. Expected Deployment Process**

The script will automatically:

#### Infrastructure Setup
- Install Docker CE + Compose plugin for Ubuntu 24.04 LTS
- Configure UFW firewall (ports 80, 443, 22, 3000-3002)
- Setup system optimization (kernel params, file limits)

#### Database & Environment
- Create PostgreSQL 15 container with persistent volumes
- Copy `.env.example` → `.env.production` with production settings
- Run complete database seeding from `seed-database-complete.sh`

#### LocallyTrip Microservices Build
```
Backend API (port 3001): Node.js/Express + Sequelize ORM
Web Frontend (port 3000): Next.js 14 App Router (traveller interface)  
Web Admin (port 3002): Next.js 14 Admin Dashboard
Database: PostgreSQL 15 with bridge networking
```

#### Production Configuration
- Nginx reverse proxy for all microservices
- SSL certificates with Let's Encrypt (if `--ssl-auto`)
- Health checks for all services

### **4. Access Points After Deployment**

#### Production URLs (with domain):
```
https://yourdomain.com          # Web frontend (traveller-facing)
https://admin.yourdomain.com    # Admin dashboard  
https://api.yourdomain.com      # Backend API
```

#### Development URLs (IP-based):
```
http://server-ip:3000           # Web frontend
http://server-ip:3002           # Admin dashboard
http://server-ip:3001/api/v1    # Backend API endpoints
```

### **5. Monitoring Commands**

```bash
# Check all LocallyTrip services
docker compose -f docker-compose.prod.yml ps

# View service logs
docker logs locallytrip-backend     # Node.js API + Sequelize
docker logs locallytrip-web         # Next.js Frontend  
docker logs locallytrip-web-admin   # Next.js Admin
docker logs locallytrip-db          # PostgreSQL database

# Test API endpoints
curl http://localhost:3001/api/v1/hosts
curl http://localhost:3001/api/v1/experiences

# Database connectivity test
docker exec -it locallytrip-db psql -U locallytrip -d locallytrip_production -c "\dt"
```

### **6. Expected Data Structure**

After seeding, database will contain:
- **Users**: Hosts and travellers with city/country relationships
- **Experiences**: Linked to host_categories and user hosts
- **Stories**: With author relationships to users table
- **Bookings**: Connecting users and experiences
- **Static Images**: Served via ImageService with placeholder fallbacks

### **7. Troubleshooting**

If deployment fails:

```bash
# Check deployment logs
tail -f /opt/locallytrip/deploy-production.log

# Restart services if needed
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml up --build -d

# Reset database if needed
docker compose -f docker-compose.prod.yml down -v
./deploy-locallytrip.sh production --force-rebuild
```

## 🎯 **Key LocallyTrip Architecture Notes**

1. **API Integration**: Frontend uses proxy pattern `/src/app/api/*` → backend
2. **Image Management**: Centralized ImageService routes all images through backend
3. **Database**: Complex Sequelize relationships with proper aliases
4. **Environment**: Production uses optimized Docker networking and resource limits
5. **SSL**: Automatic Let's Encrypt setup with domain validation

## 📋 **Pre-Deployment Checklist**

- [ ] Domain DNS pointing to server IP (for SSL)
- [ ] Firewall allows ports 80, 443, 22
- [ ] Server has minimum 8GB RAM, 20GB disk space
- [ ] Ubuntu 24.04 LTS with updated packages
- [ ] Project cloned to `/opt/locallytrip`

## 🚨 **Important Notes**

- Script automatically handles Docker installation if not present
- All previous containers and data are backed up before deployment
- Database seeding includes complete sample data for testing
- SSL setup requires valid domain name (not IP address)
- Production deployment uses optimized Docker Compose configuration