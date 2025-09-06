# 🚀 LocallyTrip Production Deployment Guide

## 📋 **SERVER DEPLOYMENT CHECKLIST**

Setelah project cleanup selesai dan di-push ke GitHub, berikut langkah-langkah lengkap untuk deployment di server production:

---

## 🛠️ **STEP 1: SERVER PREPARATION**

### **1.1 Login ke Server**
```bash
# SSH ke Alibaba Cloud Simple Application Server
ssh root@your-server-ip

# Atau jika menggunakan key
ssh -i your-key.pem root@your-server-ip
```

### **1.2 Update System**
```bash
# Update package list
apt update && apt upgrade -y

# Install required packages
apt install -y git curl wget vim htop
```

### **1.3 Install Docker & Docker Compose**
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Start and enable Docker
systemctl start docker
systemctl enable docker

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version
```

---

## 📦 **STEP 2: PROJECT CLONE & SETUP**

### **2.1 Clone Repository**
```bash
# Navigate to deployment directory
cd /opt

# Clone repository
git clone https://github.com/nopecode96/locallytrip.git
cd locallytrip

# Verify files
ls -la *.sh
```

### **2.2 Make Scripts Executable**
```bash
# Make all shell scripts executable
chmod +x *.sh

# Verify permissions
ls -la *.sh
```

---

## 🔧 **STEP 3: ENVIRONMENT CONFIGURATION**

### **3.1 Check Deployment Readiness**
```bash
# Run pre-deployment checks
./check-deployment-readiness.sh
```

### **3.2 Setup Production Secrets** 
```bash
# Configure production environment variables
./setup-production-secrets.sh

# This will create:
# - .env.production (main environment file)
# - backend/.env (backend-specific variables)
# - web/.env.local (frontend environment)
# - web-admin/.env.local (admin environment)
```

### **3.3 Verify Environment Files**
```bash
# Check created environment files
ls -la .env*
ls -la backend/.env*
ls -la web/.env*
ls -la web-admin/.env*
```

---

## 🔒 **STEP 4: SSL CERTIFICATE SETUP**

### **4.1 Domain Configuration**
```bash
# Update DNS records to point to your server IP
# A record: your-domain.com -> server-ip
# A record: www.your-domain.com -> server-ip
# A record: admin.your-domain.com -> server-ip
# A record: api.your-domain.com -> server-ip
```

### **4.2 Setup SSL Certificate**
```bash
# For Let's Encrypt (recommended for production)
./setup-ssl.sh

# Or for self-signed certificate (development/testing)
./setup-ssl.sh --self-signed
```

---

## 🚀 **STEP 5: PRODUCTION DEPLOYMENT**

### **5.1 Complete Production Deployment**
```bash
# This script will:
# - Validate environment
# - Build and start all services
# - Setup database with complete seeding
# - Configure monitoring and logging
# - Verify all services are running
# - Generate deployment report

./deploy-production-complete.sh
```

### **5.2 Monitor Deployment Progress**
```bash
# The deployment script will show real-time progress
# Watch for these key steps:
# ✅ Pre-flight checks passed
# ✅ Environment variables validated
# ✅ SSL certificates configured
# ✅ Database backup created
# ✅ Services built and started
# ✅ Database seeded successfully
# ✅ Monitoring system active
# ✅ Health checks passed
# ✅ Deployment verification complete
```

---

## 📊 **STEP 6: POST-DEPLOYMENT VERIFICATION**

### **6.1 Service Status Check**
```bash
# Check all services are running
docker-compose -f docker-compose.prod.yml ps

# Check service logs
docker-compose -f docker-compose.prod.yml logs --tail=50
```

### **6.2 Health Check URLs**
```bash
# API Health Check
curl https://api.your-domain.com/health

# Web Frontend
curl https://your-domain.com

# Admin Panel
curl https://admin.your-domain.com

# Database Connection Test
curl https://api.your-domain.com/api/v1/health/db
```

### **6.3 Test Key Functionality**
```bash
# Test API endpoints
curl https://api.your-domain.com/api/v1/hosts
curl https://api.your-domain.com/api/v1/experiences
curl https://api.your-domain.com/api/v1/stories

# Test frontend pages
curl -I https://your-domain.com
curl -I https://your-domain.com/hosts
curl -I https://your-domain.com/experiences

# Test admin panel
curl -I https://admin.your-domain.com
curl -I https://admin.your-domain.com/dashboard
```

---

## 📈 **STEP 7: MONITORING SETUP**

### **7.1 Access Monitoring Dashboard**
```bash
# Monitoring dashboard URL
https://your-domain.com/monitoring

# Or access via server
curl http://localhost:8080/monitoring
```

### **7.2 Check Monitoring Services**
```bash
# View monitoring logs
tail -f /opt/locallytrip/monitoring/logs/health.log
tail -f /opt/locallytrip/monitoring/logs/resource.log
tail -f /opt/locallytrip/monitoring/logs/alerts.log

# Check monitoring cron jobs
crontab -l
```

### **7.3 Setup Email Alerts (Optional)**
```bash
# Edit monitoring configuration
vim /opt/locallytrip/monitoring/config/alerts.conf

# Update email settings and restart monitoring
./setup-monitoring.sh --restart
```

---

## 🔧 **STEP 8: MAINTENANCE COMMANDS**

### **8.1 Regular Operations**
```bash
# View all services status
npm run status

# Restart specific service
docker-compose -f docker-compose.prod.yml restart web

# View real-time logs
npm run logs

# Backup database
npm run backup

# Renew SSL certificates
./renew-ssl.sh
```

### **8.2 Troubleshooting**
```bash
# Check system resources
htop
df -h

# Check Docker status
docker system df
docker system prune -f

# Restart all services
npm run restart

# Full system restart
npm run deploy
```

---

## 📋 **STEP 9: SERVICE URLS**

### **Production URLs:**
- **Main Website**: https://your-domain.com
- **Admin Panel**: https://admin.your-domain.com  
- **API Endpoint**: https://api.your-domain.com
- **Monitoring**: https://your-domain.com/monitoring
- **API Documentation**: https://api.your-domain.com/docs

### **Port Mapping:**
- **Web Frontend**: 3000 → 443 (HTTPS)
- **Admin Panel**: 3002 → 443 (HTTPS)
- **Backend API**: 3001 → 443 (HTTPS)
- **PostgreSQL**: 5432 (internal)
- **Nginx**: 80 → 443 (redirect)

---

## ⚡ **QUICK DEPLOYMENT SUMMARY**

### **For Fresh Server:**
```bash
# 1. Clone and setup
git clone https://github.com/nopecode96/locallytrip.git && cd locallytrip

# 2. Make executable
chmod +x *.sh

# 3. Check readiness
./check-deployment-readiness.sh

# 4. Setup secrets
./setup-production-secrets.sh

# 5. Setup SSL
./setup-ssl.sh

# 6. Deploy everything
./deploy-production-complete.sh
```

### **For Updates:**
```bash
# Pull latest changes
git pull origin main

# Re-deploy
npm run deploy
```

---

## 🆘 **SUPPORT & TROUBLESHOOTING**

### **Common Issues:**
1. **Port conflicts** → Check `./check-deployment-readiness.sh`
2. **SSL issues** → Re-run `./setup-ssl.sh`
3. **Database connection** → Check `docker-compose logs postgres`
4. **Service not starting** → Check `docker-compose logs [service-name]`

### **Get Help:**
```bash
# Deployment script help
./deploy-production-complete.sh --help

# Check logs
npm run logs

# System status
npm run status

# Emergency restart
npm run restart
```

---

## ✅ **DEPLOYMENT SUCCESS INDICATORS**

Your deployment is successful when:
- ✅ All services show "healthy" status
- ✅ All URLs respond correctly
- ✅ Database is populated with seed data
- ✅ SSL certificates are valid
- ✅ Monitoring system is active
- ✅ No error logs in services
- ✅ API endpoints return expected data

**🎉 Congratulations! LocallyTrip is now live in production!**
