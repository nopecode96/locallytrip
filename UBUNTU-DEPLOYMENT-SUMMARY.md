# LocallyTrip - Ringkasan Deployment Ubuntu Server

## 📋 File yang Telah Dibuat untuk Ubuntu Server

### 1. **SERVER-DEPLOYMENT-UBUNTU.md**
Panduan lengkap deployment di Ubuntu server dengan folder `/home/locallytrip`

### 2. **setup-ubuntu-server.sh** 
Script setup awal server Ubuntu (install Docker, create user, firewall, clone project)

### 3. **deploy-ubuntu-server.sh**
Script deployment utama yang disesuaikan untuk Ubuntu server

### 4. **ubuntu-quick-commands.sh**
Script maintenance dengan berbagai command untuk monitoring dan troubleshooting

### 5. **.env.ubuntu-server**
Template environment variables yang disesuaikan untuk server Ubuntu

---

## 🚀 Langkah-Langkah di Server Ubuntu

### LANGKAH 1: Setup Awal Server
```bash
# Login sebagai root
ssh root@your-server-ip

# Download dan jalankan setup script
curl -fsSL https://raw.githubusercontent.com/nopecode96/locallytrip/main/setup-ubuntu-server.sh | bash

# Atau manual:
wget https://raw.githubusercontent.com/nopecode96/locallytrip/main/setup-ubuntu-server.sh
chmod +x setup-ubuntu-server.sh
./setup-ubuntu-server.sh
```

### LANGKAH 2: Switch ke User LocallyTrip
```bash
# Switch ke user locallytrip
sudo su - locallytrip
cd /home/locallytrip/locallytrip
```

### LANGKAH 3: Konfigurasi Environment
```bash
# Copy template environment
cp .env.ubuntu-server .env

# Edit konfigurasi
nano .env

# Wajib diubah:
# - DOMAIN=your-domain.com
# - DB_PASSWORD=secure-password
# - JWT_SECRET=secure-jwt-secret
# - EMAIL_USER & EMAIL_PASSWORD
# - SSL_EMAIL=admin@your-domain.com
```

### LANGKAH 4: Generate Secure Values
```bash
# Generate database password
openssl rand -base64 32

# Generate JWT secret
openssl rand -base64 64

# Generate session secret
openssl rand -base64 32
```

### LANGKAH 5: Deployment
```bash
# Pre-deployment check
./check-deployment-readiness.sh

# Run deployment
./deploy-ubuntu-server.sh
```

### LANGKAH 6: Verifikasi
```bash
# Check status
./ubuntu-quick-commands.sh status

# Run health checks
./ubuntu-quick-commands.sh health

# Test connectivity
./ubuntu-quick-commands.sh test
```

---

## 🔧 Perintah Maintenance Berguna

```bash
# Monitoring
./ubuntu-quick-commands.sh status      # Status semua service
./ubuntu-quick-commands.sh stats       # System statistics
./ubuntu-quick-commands.sh logs        # View all logs

# Database
./ubuntu-quick-commands.sh db-status   # Database status
./ubuntu-quick-commands.sh db-backup   # Backup database
./ubuntu-quick-commands.sh db-connect  # Connect to database

# Service Management
./ubuntu-quick-commands.sh restart     # Restart all services
./ubuntu-quick-commands.sh stop        # Stop all services
./ubuntu-quick-commands.sh start       # Start all services

# SSL & Security
./ubuntu-quick-commands.sh ssl-status  # Check SSL certificates
./ubuntu-quick-commands.sh ssl-renew   # Renew SSL certificates
./ubuntu-quick-commands.sh firewall    # Firewall status

# Maintenance
./ubuntu-quick-commands.sh cleanup     # Clean Docker resources
./ubuntu-quick-commands.sh backup      # Full backup
./ubuntu-quick-commands.sh update      # Update and redeploy
```

---

## 📁 Struktur Folder di Server

```
/home/locallytrip/
├── locallytrip/              # Project utama
│   ├── backend/
│   ├── web/
│   ├── web-admin/
│   ├── mobile/
│   ├── nginx/
│   ├── ssl/
│   ├── .env                  # Environment configuration
│   ├── docker-compose.prod.yml
│   ├── deploy-ubuntu-server.sh
│   ├── ubuntu-quick-commands.sh
│   └── setup-ubuntu-server.sh
├── backups/                  # Backup files
└── logs/                     # Application logs
```

---

## 🌐 URL Akses Setelah Deployment

- **Main Website**: https://your-domain.com
- **Admin Dashboard**: https://admin.your-domain.com
- **API Health**: https://api.your-domain.com/health
- **Local Access**: https://server-ip

---

## ⚠️ Hal Penting yang Harus Diperhatikan

### 1. **Domain DNS Configuration**
Pastikan domain sudah mengarah ke server IP:
- your-domain.com → Server IP
- www.your-domain.com → Server IP  
- api.your-domain.com → Server IP
- admin.your-domain.com → Server IP

### 2. **Firewall Ports**
Pastikan port terbuka:
- 22 (SSH)
- 80 (HTTP)
- 443 (HTTPS)

### 3. **Environment Variables**
Wajib diubah dari default:
- `DB_PASSWORD`
- `JWT_SECRET`
- `DOMAIN`
- `EMAIL_USER` & `EMAIL_PASSWORD`
- `SSL_EMAIL`

### 4. **SSL Certificates**
- Untuk production: gunakan Let's Encrypt
- Untuk testing: gunakan self-signed
- Auto-renewal dengan cron job

### 5. **Backup Strategy**
- Database backup harian (otomatis)
- Full backup manual sebelum update
- Backup disimpan di `/home/locallytrip/backups/`

---

## 🔄 Update Process

```bash
# Pull latest changes
cd /home/locallytrip/locallytrip
git pull origin main

# Redeploy
./deploy-ubuntu-server.sh

# Atau menggunakan quick command
./ubuntu-quick-commands.sh update
```

---

## 🆘 Troubleshooting

### Container Tidak Start
```bash
./ubuntu-quick-commands.sh logs
docker compose -f docker-compose.prod.yml ps
```

### Database Issues
```bash
./ubuntu-quick-commands.sh db-status
./ubuntu-quick-commands.sh db-logs
```

### SSL Problems
```bash
./ubuntu-quick-commands.sh ssl-status
./setup-ssl.sh
```

### Performance Issues
```bash
./ubuntu-quick-commands.sh stats
./ubuntu-quick-commands.sh memory
./ubuntu-quick-commands.sh disk
```

---

## ✅ Deployment Checklist

- [ ] Server Ubuntu setup completed
- [ ] User `locallytrip` created
- [ ] Docker & Docker Compose installed
- [ ] Project cloned to `/home/locallytrip/locallytrip`
- [ ] Environment variables configured
- [ ] Domain DNS pointing to server
- [ ] Firewall configured (ports 22, 80, 443)
- [ ] SSL certificates generated
- [ ] All services running and healthy
- [ ] Health checks passing
- [ ] Backup system configured
- [ ] Monitoring scripts available

**🎉 LocallyTrip siap digunakan di production!**
