# 🚀 Production Docker Compose Commands

## **🔍 Problem Identified:**
Server menggunakan `docker-compose.yml` (development mode) yang menjalankan `next dev` instead of `next start`.

## **✅ Solution: Use Production Docker Compose File**

### **📋 Production Server Commands:**

#### **1. Stop Current Development Containers:**
```bash
# Stop containers yang running dengan development config
docker compose down

# Optional: Clean up development containers
docker system prune -f
```

#### **2. Start Production Services:**
```bash
# Use production docker-compose file
docker compose -f docker-compose.prod.yml up -d --build

# Monitor startup (should show production builds)
docker compose -f docker-compose.prod.yml logs web --tail 20
docker compose -f docker-compose.prod.yml logs web-admin --tail 20
```

#### **3. Verify Production Mode:**
```bash
# Check container status
docker compose -f docker-compose.prod.yml ps

# Verify web containers show "npm start" instead of "npm run dev"
docker compose -f docker-compose.prod.yml logs web | grep -E "(npm start|next start)"

# Check health
curl -I http://localhost:3000
curl -I http://localhost:3002
```

#### **4. Test Public Access:**
```bash
# Test main website
curl -I https://locallytrip.com

# Test story API endpoint (original issue)
curl https://locallytrip.com/api/stories/jakarta-street-food/
```

## **🔧 Key Differences:**

### **Development (docker-compose.yml):**
- `target: development`
- `CMD ["npm", "run", "dev"]` - Hot reload enabled
- Volume mounts for code changes
- Development optimizations

### **Production (docker-compose.prod.yml):**
- `target: production`
- `CMD ["npm", "start"]` - Optimized production build
- No volume mounts - static build
- Production optimizations, minification, etc.

## **📱 Expected Production Logs:**

**Before (Development Mode):**
```
> next dev
⚠ You are using a non-standard "NODE_ENV" value
Local: http://localhost:3000
```

**After (Production Mode):**
```
> next start
▲ Next.js 14.2.32
- Local: http://localhost:3000
Ready in Xms
```

## **🚀 All-in-One Production Deployment Script:**

```bash
#!/bin/bash
echo "🚀 Deploying LocallyTrip Production..."

# Pull latest changes
git pull origin main

# Copy production environment
cp .env.production .env

# Stop development containers
docker compose down

# Start production containers
docker compose -f docker-compose.prod.yml up -d --build

# Wait for services
sleep 30

# Verify deployment
echo "📋 Container Status:"
docker compose -f docker-compose.prod.yml ps

echo "🌐 Web Service Check:"
curl -I http://localhost:3000 | head -1

echo "📖 Story API Check:"
curl -s https://locallytrip.com/api/stories/jakarta-street-food/ | head -1

echo "✅ Production deployment complete!"
```

## **💡 Important Notes:**

1. **Always use `-f docker-compose.prod.yml`** untuk production
2. **Environment**: Make sure `.env` contains production values
3. **SSL**: Production needs proper SSL certificates for HTTPS
4. **Monitoring**: Use production compose file untuk semua operations:
   ```bash
   docker compose -f docker-compose.prod.yml logs -f
   docker compose -f docker-compose.prod.yml restart web
   docker compose -f docker-compose.prod.yml down
   ```

---
**Next Step**: Run production deployment commands on server to get optimized Next.js build! 🎯
