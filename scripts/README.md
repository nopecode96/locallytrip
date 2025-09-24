# 🛠️ LocallyTrip Development Scripts

## 📋 **Essential Development Utilities**

### **Database Management**
- **`reset-database.sh`** - Reset development database to clean state
- **`seed-database-complete.sh`** - Populate database with complete sample data

### **Logging & Monitoring**  
- **`logs.sh`** - View application logs with filtering options

---

## 🚀 **Quick Commands**

### **Database Reset & Seed:**
```bash
# Reset database and add sample data
./scripts/development/reset-database.sh
./scripts/development/seed-database-complete.sh
```

### **View Logs:**
```bash
# View all container logs
./scripts/development/logs.sh

# View specific service logs
./scripts/development/logs.sh backend
```

---

## 📝 **Migration from Old Scripts**

**Previous scripts (now removed/replaced):**

### **Deployment Scripts → `deploy-locallytrip.sh`**
- ❌ `scripts/deployment/deploy-production.sh` → ✅ `./deploy-locallytrip.sh production`
- ❌ `scripts/deployment/setup-ssl.sh` → ✅ `./deploy-locallytrip.sh production --ssl-auto`
- ❌ `scripts/deployment/deploy-ubuntu-server.sh` → ✅ `./deploy-locallytrip.sh production --platform=ubuntu`

### **Development Scripts → Direct Commands**
- ❌ `scripts/development/start.sh` → ✅ `docker compose up --build`
- ❌ `scripts/development/stop.sh` → ✅ `docker compose down`
- ❌ `scripts/development/status.sh` → ✅ `docker compose ps`
- ❌ `scripts/development/fast-rebuild.sh` → ✅ `./deploy-locallytrip.sh development --force-rebuild`

---

## 🎯 **Simplified Workflow**

**Development:**
```bash
# Start development
docker compose up --build

# Reset & seed database (if needed)
./scripts/development/reset-database.sh
./scripts/development/seed-database-complete.sh

# View logs
./scripts/development/logs.sh
```

**Production Deployment:**
```bash
# Single command deployment
./deploy-locallytrip.sh production --ssl-auto
```

**Result:** Reduced from 16 scripts to 3 essential development utilities + 2 unified deployment scripts.