# 🚨 EMERGENCY RECOVERY - LocallyTrip Server Down

## 🔍 **Problem: "ERR_CONNECTION_REFUSED"**

**Status dari screenshot menunjukkan:**
- ❌ **"This site can't be reached"**
- ❌ **"locallytrip.com refused to connect"**
- ❌ **ERR_CONNECTION_REFUSED**

**Ini berarti server benar-benar tidak bisa diakses** - bukan masalah 503 lagi, tapi server down total.

## 🚨 **IMMEDIATE ACTIONS - Run These on Server:**

### **1. Connect to Server via SSH:**
```bash
# Connect to your production server
ssh locallytrip@your-server-ip

# Navigate to project directory
cd ~/locallytrip
```

### **2. Update Code:**
```bash
# Get latest fixes
git pull origin main
```

### **3. Quick Health Check:**
```bash
# Comprehensive server diagnostics
./check-server-health.sh
```

### **4. Emergency Recovery:**
```bash
# Complete server recovery (run this if health check shows problems)
./emergency-recovery.sh
```

## 🔧 **What Emergency Recovery Does:**

### **Step-by-Step Recovery Process:**

1. **🔍 System Diagnostics:**
   - Check disk space and memory
   - Verify Docker service status
   - Check port availability (80, 443, 3001, 5432)
   - SSL certificate verification

2. **🛑 Clean Shutdown:**
   - Stop all containers gracefully
   - Clean up hanging processes
   - Remove orphaned containers

3. **📋 Environment Setup:**
   - Create `.env` from `.env.production` if missing
   - Verify configuration files

4. **🚀 Structured Startup:**
   ```bash
   # Order of startup:
   1. PostgreSQL Database (port 5432)
   2. Backend API (port 3001) 
   3. Web Services (port 3000)
   4. Nginx Reverse Proxy (ports 80, 443)
   ```

5. **🔐 SSL Emergency Fix:**
   - Generate emergency SSL certificate if missing
   - Configure nginx with proper SSL

6. **🧪 Verification Tests:**
   - Test internal connectivity
   - Verify all services health
   - Check external accessibility

## 📊 **Expected Recovery Timeline:**

| Phase | Duration | Status Check |
|-------|----------|--------------|
| Diagnostics | 1-2 min | `./check-server-health.sh` |
| Clean Shutdown | 30 sec | All containers stopped |
| Database Start | 30 sec | PostgreSQL healthy |
| Backend Start | 60 sec | API responding |
| Web Services | 90 sec | Frontend responding |
| Nginx Start | 30 sec | Reverse proxy working |
| **Total** | **~5 min** | Site accessible |

## 🧪 **Manual Verification After Recovery:**

### **1. Check Container Status:**
```bash
docker compose -f docker-compose.prod.yml ps
```

**Expected Output:**
```
NAME                     STATUS       PORTS
locallytrip-postgres     Up (healthy) 5432/tcp
locallytrip-backend      Up (healthy) 3001/tcp
locallytrip-web          Up (healthy) 3000/tcp
locallytrip-nginx        Up           80/tcp, 443/tcp
```

### **2. Test Connectivity:**
```bash
# Internal tests
curl -k https://localhost
curl http://localhost

# Specific endpoints
curl -k https://localhost/health
curl -k https://localhost/_next/static/
```

### **3. Check Logs:**
```bash
# Monitor all services
docker compose -f docker-compose.prod.yml logs -f

# Check specific service
docker compose -f docker-compose.prod.yml logs nginx
docker compose -f docker-compose.prod.yml logs web
```

## 🔥 **Common Issues and Quick Fixes:**

### **Issue 1: Docker Service Down**
```bash
# Check Docker status
systemctl status docker

# Start Docker if needed
sudo systemctl start docker
sudo systemctl enable docker
```

### **Issue 2: Firewall Blocking Ports**
```bash
# Check firewall
sudo ufw status

# Allow web ports
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw reload
```

### **Issue 3: SSL Certificate Problems**
```bash
# Check certificate
openssl x509 -in ssl/cert.pem -noout -text

# Generate emergency certificate
mkdir -p ssl
openssl req -x509 -newkey rsa:2048 -nodes -days 30 \
    -keyout ssl/key.pem -out ssl/cert.pem \
    -subj "/C=ID/ST=Jakarta/L=Jakarta/O=LocallyTrip/CN=locallytrip.com"
```

### **Issue 4: Database Connection Problems**
```bash
# Check database
docker compose -f docker-compose.prod.yml exec postgres pg_isready -U locallytrip_prod_user

# Restart database if needed
docker compose -f docker-compose.prod.yml restart postgres
```

### **Issue 5: Out of Disk Space**
```bash
# Check disk usage
df -h

# Clean Docker if needed
docker system prune -a
docker volume prune
```

## 🎯 **Manual Recovery Steps (If Scripts Fail):**

### **1. Nuclear Option - Complete Restart:**
```bash
# Stop everything
docker compose -f docker-compose.prod.yml down --volumes --remove-orphans

# Clean everything
docker system prune -a -f
docker volume prune -f

# Rebuild from scratch
docker compose -f docker-compose.prod.yml build --no-cache
docker compose -f docker-compose.prod.yml up -d
```

### **2. Service-by-Service Restart:**
```bash
# Start in order
docker compose -f docker-compose.prod.yml up -d postgres
sleep 30

docker compose -f docker-compose.prod.yml up -d backend  
sleep 30

docker compose -f docker-compose.prod.yml up -d web web-admin
sleep 30

docker compose -f docker-compose.prod.yml up -d nginx
```

## 📞 **Emergency Checklist:**

- [ ] SSH connection to server successful
- [ ] Git pull completed
- [ ] `./check-server-health.sh` run
- [ ] `./emergency-recovery.sh` run  
- [ ] All containers showing "Up" status
- [ ] Internal HTTPS test successful
- [ ] External site accessible
- [ ] No errors in container logs

## 🆘 **If Still Not Working:**

### **Check External Factors:**

1. **DNS Issues:**
   ```bash
   nslookup locallytrip.com
   # Should resolve to your server IP
   ```

2. **Server Provider Issues:**
   - Check Alibaba Cloud console
   - Verify server is running
   - Check network security groups

3. **Domain/CDN Issues:**
   - Check domain registrar settings
   - Verify DNS propagation

4. **ISP/Location Issues:**
   - Test from different location
   - Check if it's region-specific blocking

---

## 🚀 **Quick Recovery Commands:**

```bash
# Complete emergency recovery sequence
cd ~/locallytrip
git pull origin main
./check-server-health.sh
./emergency-recovery.sh

# If still issues - nuclear option
docker compose -f docker-compose.prod.yml down --volumes --remove-orphans
docker system prune -a -f
docker compose -f docker-compose.prod.yml up --build -d
```

**🎯 Run emergency recovery now and report back the results!**
