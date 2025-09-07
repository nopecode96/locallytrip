# LocallyTrip - Panduan Deployment Server Ubuntu

## 🚀 Panduan Lengkap Deployment di Server Ubuntu

### Server Configuration
- **OS**: Ubuntu 20.04+ (Recommended: Ubuntu 22.04 LTS)
- **Folder**: `/home/locallytrip`
- **User**: `locallytrip` (recommended) atau `root`
- **Ports**: 80, 443, 22

---

## 📋 LANGKAH 1: PERSIAPAN SERVER (Manual Setup)

### 1.1 Login dan Update Sistem
```bash
# Login ke server Ubuntu sebagai root
ssh root@your-server-ip

# Update sistem
apt update && apt upgrade -y
```

### 1.2 Install Docker dan Dependencies
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose dan tools
apt install docker-compose-plugin git curl nano wget htop ufw -y

# Start dan enable Docker
systemctl start docker
systemctl enable docker

# Verify installations
docker --version
docker compose version
git --version
```

### 1.3 Setup User LocallyTrip
```bash
# Buat user locallytrip
useradd -m -s /bin/bash locallytrip
usermod -aG docker locallytrip
usermod -aG sudo locallytrip

# Set password
passwd locallytrip
```

### 1.4 Setup Firewall
```bash
# Configure UFW firewall
ufw allow 22/tcp     # SSH
ufw allow 80/tcp     # HTTP
ufw allow 443/tcp    # HTTPS
ufw --force enable
ufw status
```

---

## 📦 LANGKAH 2: CLONE PROJECT

### 2.1 Switch ke User LocallyTrip dan Clone
```bash
# Switch ke user locallytrip
su - locallytrip

# Masuk ke home directory
cd ~  # /home/locallytrip

# Clone project ke subfolder locallytrip
git clone https://github.com/nopecode96/locallytrip.git

# Masuk ke directory project
cd locallytrip

# Verify struktur project dan make executable
ls -la
chmod +x *.sh
```

### 2.2 Set Permissions
```bash
# Set ownership (sudah otomatis karena clone sebagai user locallytrip)
# chmod sudah dilakukan di langkah sebelumnya
ls -la *.sh  # Verify ada 5 essential scripts

# Expected scripts (after cleanup):
# deploy-ubuntu-server.sh       - Main deployment script
# generate-nginx-config.sh      - Nginx configuration generator  
# seed-database-complete.sh     - Database seeding
# setup-ssl.sh                  - SSL certificate management
# ubuntu-quick-commands.sh      - Maintenance & monitoring
```

---

## ⚙️ LANGKAH 3: KONFIGURASI ENVIRONMENT

### 3.1 Setup Environment File
```bash
# Copy template production (manual configuration)
cp .env.production .env

# Edit environment variables
nano .env
```

### 3.2 Konfigurasi Environment Variables Utama
```bash
# ===== PRODUCTION ENVIRONMENT =====
NODE_ENV=production

# ===== DOMAIN CONFIGURATION =====
DOMAIN=your-domain.com
NEXT_PUBLIC_WEBSITE_URL=https://your-domain.com
NEXT_PUBLIC_API_URL=https://api.your-domain.com
NEXT_PUBLIC_ADMIN_URL=https://admin.your-domain.com
NEXT_PUBLIC_IMAGES=https://api.your-domain.com/images

# ===== DATABASE CONFIGURATION =====
DB_HOST=postgres
DB_PORT=5432
DB_NAME=locallytrip_prod
DB_USER=locallytrip_prod_user
DB_PASSWORD=your-super-secure-database-password-here

# ===== JWT CONFIGURATION =====
JWT_SECRET=your-super-secure-jwt-secret-key-minimum-32-characters
JWT_EXPIRES_IN=7d

# ===== EMAIL CONFIGURATION =====
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# ===== SSL CONFIGURATION =====
SSL_EMAIL=admin@your-domain.com
SSL_MODE=letsencrypt

# ===== POSTGRES CONFIGURATION =====
POSTGRES_PORT=5432
```

### 3.3 Generate Secure Passwords
```bash
# Generate secure database password
openssl rand -base64 32

# Generate secure JWT secret
openssl rand -base64 64
```

---

## 🔒 LANGKAH 4: SETUP SSL CERTIFICATES

### 4.1 Setup Domain DNS
Sebelum setup SSL, pastikan domain sudah mengarah ke server:
- `your-domain.com` → Server IP
- `www.your-domain.com` → Server IP  
- `api.your-domain.com` → Server IP
- `admin.your-domain.com` → Server IP

### 4.2 Setup SSL Certificates
```bash
# Jalankan script SSL setup
./setup-ssl.sh

# Pilih opsi:
# 1 = Self-signed certificates (untuk testing)
# 2 = Let's Encrypt certificates (untuk production)

# Untuk production, pilih 2 dan ikuti instruksi
```

---

## 🔍 LANGKAH 5: PRE-DEPLOYMENT CHECK

### 5.1 Manual Verification (No automated script needed)
```bash
# Check Docker
docker --version
docker compose version
docker info

# Check files
ls -la ssl/
ls -la .env

# Verify essential scripts present
ls -la *.sh

# Test nginx config (optional)
docker run --rm -v $(pwd)/nginx:/etc/nginx nginx:alpine nginx -t
```

---

## 🚀 LANGKAH 6: DEPLOYMENT

### 6.1 Run Complete Deployment
```bash
# Jalankan deployment lengkap dengan single command
./deploy-ubuntu-server.sh

# Script ini akan:
# - Generate nginx configuration dynamically
# - Setup SSL certificates (Let's Encrypt atau self-signed)
# - Build dan start semua Docker containers
# - Setup database dengan seed data
# - Run health checks dan verification
```

### 6.2 Monitor Deployment Progress
```bash
# Monitor deployment logs
tail -f deployment-*.log

# Check containers status
docker compose -f docker-compose.prod.yml ps

# Check logs individual services
docker logs locallytrip-backend-prod
docker logs locallytrip-web-prod
docker logs locallytrip-admin-prod
docker logs locallytrip-nginx-prod
docker logs locallytrip-postgres-prod
```

---

## ✅ LANGKAH 7: VERIFIKASI DEPLOYMENT

### 7.1 Health Checks
```bash
# Check semua containers running
docker compose -f docker-compose.prod.yml ps

# Test endpoints
curl -k https://localhost/health
curl -k https://localhost/api/v1/health

# Check dari luar server
curl https://your-domain.com/health
curl https://api.your-domain.com/health
```

### 7.2 Test Website
- **Main Website**: https://your-domain.com
- **Admin Dashboard**: https://admin.your-domain.com  
- **API Health**: https://api.your-domain.com/health

### 7.3 Database Verification
```bash
# Connect ke database
docker exec -it locallytrip-postgres-prod psql -U locallytrip_prod_user -d locallytrip_prod

# Check tables
\dt

# Check sample data
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM experiences;
SELECT COUNT(*) FROM cities;

# Exit
\q
```

---

## 📊 LANGKAH 8: MONITORING & MAINTENANCE

### 8.1 Setup Log Monitoring
```bash
# Create log directories
sudo mkdir -p /var/log/locallytrip
sudo chown -R locallytrip:locallytrip /var/log/locallytrip

# Setup log rotation
sudo cp monitoring/configs/logrotate.conf /etc/logrotate.d/locallytrip
```

### 8.2 Setup Cron Jobs  
```bash
# Edit crontab
crontab -e

# Add these lines:
# SSL certificate renewal (every Sunday at 2 AM) - using ubuntu-quick-commands
0 2 * * 0 /home/locallytrip/locallytrip/ubuntu-quick-commands.sh ssl-renew

# Database backup (daily at 3 AM) - using ubuntu-quick-commands
0 3 * * * /home/locallytrip/locallytrip/ubuntu-quick-commands.sh db-backup

# System health check (every 30 minutes) - using ubuntu-quick-commands
*/30 * * * * /home/locallytrip/locallytrip/ubuntu-quick-commands.sh health
```

### 8.3 Database Backup (Using ubuntu-quick-commands)
```bash
# Manual database backup
./ubuntu-quick-commands.sh db-backup

# Check backup status
./ubuntu-quick-commands.sh backup

# All backup functionality is integrated in ubuntu-quick-commands.sh
# No need for separate backup scripts
```

---

## 🔧 TROUBLESHOOTING

### Common Issues & Solutions

#### 1. Container Tidak Start
```bash
# Check logs
docker compose -f docker-compose.prod.yml logs [service-name]

# Restart specific service
docker compose -f docker-compose.prod.yml restart [service-name]

# Rebuild dan restart
docker compose -f docker-compose.prod.yml up --build -d [service-name]
```

#### 2. Database Connection Error
```bash
# Check postgres container
docker exec locallytrip-postgres-prod pg_isready -U locallytrip_prod_user -d locallytrip_prod

# Check connection dari backend
docker exec locallytrip-backend-prod npm run db:test
```

#### 3. SSL Certificate Issues
```bash
# Check certificate
openssl x509 -in ssl/cert.pem -text -noout

# Regenerate certificates
./setup-ssl.sh
```

#### 4. Nginx Configuration Error
```bash
# Test nginx config
docker exec locallytrip-nginx-prod nginx -t

# Reload nginx
docker exec locallytrip-nginx-prod nginx -s reload
```

---

## 🔄 UPDATE & MAINTENANCE

### Update Application
```bash
# Pull latest changes
git pull origin main

# Redeploy with single command
./deploy-ubuntu-server.sh
```

### Emergency Rollback
```bash
# Stop current deployment
docker compose -f docker-compose.prod.yml down

# Checkout previous version
git log --oneline -10  # See recent commits
git checkout [previous-commit-hash]

# Redeploy with rollback version
./deploy-ubuntu-server.sh
```

---

## 📁 STRUKTUR FOLDER FINAL

```
/home/locallytrip/
├── locallytrip/
│   ├── backend/
│   ├── web/
│   ├── web-admin/
│   ├── mobile/
│   ├── nginx/
│   ├── ssl/
│   │   ├── cert.pem
│   │   └── key.pem
│   ├── postgres-data/
│   ├── .env
│   ├── docker-compose.prod.yml
│   └── deployment scripts:
│       ├── deploy-ubuntu-server.sh      # Main deployment
│       ├── generate-nginx-config.sh     # Nginx configuration  
│       ├── seed-database-complete.sh    # Database seeding
│       ├── setup-ssl.sh                 # SSL management
│       └── ubuntu-quick-commands.sh     # Maintenance & monitoring
├── backups/
└── logs/
```

---

## ✅ DEPLOYMENT CHECKLIST

- [ ] Server Ubuntu updated dan configured
- [ ] Docker dan Docker Compose installed  
- [ ] User locallytrip created dan configured
- [ ] Firewall configured (ports 22, 80, 443)
- [ ] Project cloned ke `/home/locallytrip/locallytrip`
- [ ] Environment variables configured di `.env`
- [ ] Domain DNS configured dan pointing ke server
- [ ] SSL certificates generated/installed
- [ ] Pre-deployment checks passed
- [ ] Full deployment completed successfully
- [ ] All health checks passing
- [ ] Website accessible dari internet
- [ ] Database seeded dengan sample data
- [ ] Backup system configured
- [ ] Monitoring dan log rotation setup
- [ ] Cron jobs untuk maintenance setup

**🎉 LocallyTrip production deployment di Ubuntu server berhasil!**

---

**Kontak & Support:**
- Repository: https://github.com/nopecode96/locallytrip
- Backup Location: `/home/locallytrip/backups/`
- Logs: `docker logs [container-name]`
