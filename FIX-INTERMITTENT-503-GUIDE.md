# 🚨 Fix Intermittent 503 Errors - LocallyTrip

## 🔍 **Diagnosis dari Screenshot:**

### ✅ **Yang Berhasil (200 OK):**
- `2972-80bfda7b315c6a1c.js` - 9.0 kB
- `2135-9a45a486dcfaf176.js` - 5.1 kB  
- `traffic.js` - 2.1 kB
- `icon32.png`, `manifest.json`, `favicon.ico` - All OK

### ❌ **Yang Masih 503:**
- `main-app-180cce987a1fe211.js` - 503
- `2392-403fa007065b00cb.js` - 503
- `page-37163abc34c19309.js` - 503
- `4014-86e9b7c5ab8475cf.js` - 503
- `layout-91c41a2cebfdd8a8.js` - 503

### ❌ **Yang 404:**
- `favicon.svg` - 404

## 🎯 **Root Cause:**

**Masalahnya adalah intermittent 503 errors** - artinya:
1. **Web service kadang responding, kadang tidak**
2. **Nginx upstream tidak ada proper failover**
3. **Service startup race conditions**
4. **Timeout configuration tidak optimal**

## ✅ **Solusi yang Diterapkan:**

### **1. 🔧 Enhanced Nginx Upstream Configuration:**

```nginx
upstream web_backend {
    server web:3000 max_fails=3 fail_timeout=30s;
    keepalive 32;
    keepalive_requests 1000;
    keepalive_timeout 60s;
}
```

**Benefits:**
- ✅ Automatic failover dengan max_fails
- ✅ Better connection pooling
- ✅ Improved keepalive handling

### **2. 🚀 Optimized Proxy Settings:**

```nginx
# Frontend proxy improvements
proxy_connect_timeout 10s;
proxy_send_timeout 60s;  
proxy_read_timeout 60s;
proxy_next_upstream_tries 3;
proxy_next_upstream_timeout 30s;

# Static files optimization
proxy_connect_timeout 5s;
proxy_next_upstream_tries 3;
proxy_next_upstream_timeout 15s;
```

**Benefits:**
- ✅ Faster failure detection
- ✅ Multiple retry attempts
- ✅ Optimized for static vs dynamic content

### **3. 📦 Better Service Dependencies:**

```yaml
nginx:
  depends_on:
    web:
      condition: service_healthy  # Wait for actual health
    backend:
      condition: service_healthy
```

**Benefits:**
- ✅ Nginx starts only after web service is actually healthy
- ✅ Prevents 503 during startup

### **4. 🏗️ Structured Service Startup:**

```bash
# Ordered startup process
1. postgres (database)
2. backend (API)  
3. web + web-admin (frontend)
4. nginx (reverse proxy)
```

## 🚀 **Deploy ke Production:**

### **1. Update dan Deploy:**
```bash
cd ~/locallytrip
git pull origin main
./deploy-and-fix-ssl.sh
```

### **2. Quick Diagnosis (Jika Masih Ada Issue):**
```bash
./quick-diagnose.sh
```

### **3. Monitor Real-time:**
```bash
# Watch all services
docker compose -f docker-compose.prod.yml logs -f

# Focus on problematic service
docker compose -f docker-compose.prod.yml logs -f web nginx
```

## 🧪 **Expected Results:**

### **✅ Setelah Deploy Berhasil:**

1. **All JavaScript Files Load:**
   ```
   ✅ main-app-180cce987a1fe211.js (200 OK)
   ✅ 2392-403fa007065b00cb.js (200 OK)  
   ✅ page-37163abc34c19309.js (200 OK)
   ✅ layout-91c41a2cebfdd8a8.js (200 OK)
   ```

2. **Static Assets Fixed:**
   ```
   ✅ favicon.svg (200 OK)
   ✅ All /_next/static/ files (200 OK)
   ```

3. **Website Performance:**
   ```
   ✅ Fast page loads
   ✅ No loading states stuck
   ✅ All components render properly
   ✅ No browser console errors
   ```

## 🛠️ **Troubleshooting Guide:**

### **Jika Masih Ada 503 Errors:**

#### **1. Run Quick Diagnostics:**
```bash
./quick-diagnose.sh
```

Script akan check:
- ✅ Service health status
- ✅ Container resource usage
- ✅ Specific endpoint testing
- ✅ Nginx configuration validity
- 🔧 Auto-restart unhealthy services

#### **2. Manual Service Health Check:**
```bash
# Check web service internal health
docker compose -f docker-compose.prod.yml exec web curl -f http://localhost:3000

# Check nginx to web connectivity  
curl -k -I https://localhost

# Test specific problematic files
curl -k -I https://localhost/_next/static/chunks/main-app-180cce987a1fe211.js
```

#### **3. Force Service Restart:**
```bash
# Restart just web service
docker compose -f docker-compose.prod.yml restart web

# Wait and test
sleep 10
curl -k -I https://localhost/_next/static/

# Full restart if needed
docker compose -f docker-compose.prod.yml restart
```

#### **4. Check Resource Usage:**
```bash
# Monitor container resources
docker stats --no-stream

# Check if containers are hitting resource limits
docker compose -f docker-compose.prod.yml ps
```

### **Jika favicon.svg Masih 404:**

#### **1. Verify File Exists:**
```bash
# Check in container
docker compose -f docker-compose.prod.yml exec web ls -la /app/public/favicon*

# Check direct access
curl -k -I https://localhost/favicon.ico  # Should work
curl -k -I https://localhost/favicon.svg  # Should work after fix
```

#### **2. Clear Browser Cache:**
- Hard refresh: Ctrl+Shift+R (Windows) atau Cmd+Shift+R (Mac)
- Clear cache untuk domain locallytrip.com

## 📊 **Performance Monitoring:**

### **Real-time Monitoring Commands:**
```bash
# Watch nginx access logs
docker compose -f docker-compose.prod.yml exec nginx tail -f /var/log/nginx/access.log

# Watch for 503 errors specifically
docker compose -f docker-compose.prod.yml logs nginx | grep "503\|502\|504"

# Monitor web service performance
docker compose -f docker-compose.prod.yml exec web curl -w "%{time_total}" http://localhost:3000
```

### **Success Metrics:**
- ✅ **Zero 503 errors** in nginx access logs
- ✅ **All /_next/static/ requests return 200**
- ✅ **favicon.svg returns 200**
- ✅ **Page load time < 3 seconds**
- ✅ **No JavaScript loading errors in browser console**

## 🎯 **Quick Commands:**

### **Deploy & Fix:**
```bash
cd ~/locallytrip && git pull origin main && ./deploy-and-fix-ssl.sh
```

### **Quick Diagnosis:**  
```bash
./quick-diagnose.sh
```

### **Emergency Fix:**
```bash
docker compose -f docker-compose.prod.yml restart web nginx
```

---

**🎯 Expected Timeline:**
- **Deploy**: ~5-7 minutes (structured startup)
- **Service stabilization**: ~2-3 minutes
- **Full functionality**: ~7-10 minutes total

**📈 Success Indicators:**
- ✅ All services show "healthy" in `docker compose ps`
- ✅ Quick diagnostic script shows all green checkmarks
- ✅ Browser Network tab shows no 503 errors
- ✅ Website loads completely without loading states
