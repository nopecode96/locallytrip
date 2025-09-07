# 🚨 Fix 503 Errors untuk Next.js Static Files

## 🔍 **Root Cause Analysis**

### ❌ **Masalah yang Ditemukan:**
```
GET https://locallytrip.com/_next/static/chunks/2392-403fa007065b00cb.js 
net::ERR_ABORTED 503 (Service Unavailable)

GET https://locallytrip.com/favicon.svg 404 (Not Found)
```

### 🎯 **Penyebab Masalah:**
1. **Nginx tidak memiliki routing khusus** untuk `/_next/static/` files
2. **Web service tidak healthy** atau tidak responding dengan benar
3. **Favicon dan static assets** tidak ter-route dengan proper
4. **Error handling** tidak memadai untuk upstream failures
5. **Next.js build mode** mungkin tidak optimal untuk production

## ✅ **Solusi yang Diterapkan:**

### **1. Enhanced Nginx Configuration:**

#### **Tambah Routing untuk Static Files:**
```nginx
# Next.js static files
location /_next/static/ {
    proxy_pass http://web_backend;
    expires 1y;
    add_header Cache-Control "public, immutable";
    
    # Error handling for static files
    proxy_next_upstream error timeout invalid_header http_500 http_502 http_503 http_504;
    proxy_next_upstream_tries 2;
    proxy_next_upstream_timeout 5s;
}

# Favicon and other static assets
location ~* \.(ico|svg|png|jpg|jpeg|gif|css|js|woff|woff2|ttf|eot)$ {
    proxy_pass http://web_backend;
    expires 1h;
    add_header Cache-Control "public";
    
    # Error handling for static assets
    proxy_next_upstream error timeout invalid_header http_500 http_502 http_503 http_504;
    proxy_next_upstream_tries 2;
    proxy_next_upstream_timeout 5s;
}
```

#### **Better Error Handling:**
```nginx
# Error handling
error_page 502 503 504 /50x.html;
location = /50x.html {
    return 503 '{"error":"Service temporarily unavailable","message":"Web service is starting or unavailable","timestamp":"$time_iso8601"}';
    add_header Content-Type application/json;
}
```

### **2. Next.js Production Optimization:**

#### **Standalone Output Mode:**
```javascript
// next.config.js
module.exports = {
  output: 'standalone',  // Better for Docker production
  // ... other config
}
```

### **3. Enhanced Health Checks:**

#### **Comprehensive Service Monitoring:**
```bash
# Check web service health
docker compose -f docker-compose.prod.yml exec -T web curl -f http://localhost:3000

# Check nginx configuration
docker compose -f docker-compose.prod.yml exec -T nginx nginx -t
```

### **4. Better Build Process:**

#### **Explicit Environment Variables:**
```bash
# Build with explicit build args
docker compose build \
    --build-arg NEXT_PUBLIC_API_URL="$NEXT_PUBLIC_API_URL" \
    --build-arg NEXT_PUBLIC_IMAGES="$NEXT_PUBLIC_IMAGES" \
    --build-arg NEXT_PUBLIC_WEBSITE_URL="$NEXT_PUBLIC_WEBSITE_URL"
```

## 🚀 **Deploy Fix ke Production:**

### **1. Update dan Deploy:**
```bash
cd ~/locallytrip
git pull origin main
./deploy-and-fix-ssl.sh
```

### **2. Monitor Deploy Process:**
Script akan melakukan:
- ✅ Build web service dengan environment variables yang benar
- ✅ Health check untuk backend, web, dan nginx
- ✅ SSL setup dan configuration
- ✅ Test semua endpoints

### **3. Debug jika Masih Ada Masalah:**
```bash
# Comprehensive debugging
./debug-env.sh

# Check specific services
docker compose -f docker-compose.prod.yml logs web
docker compose -f docker-compose.prod.yml logs nginx
```

## 🧪 **Testing Results:**

### **✅ Expected Results After Fix:**

1. **Next.js Static Files:**
   ```
   ✅ GET https://locallytrip.com/_next/static/chunks/app/layout-xxx.js (200 OK)
   ✅ GET https://locallytrip.com/_next/static/chunks/app/page-xxx.js (200 OK)
   ```

2. **Favicon dan Assets:**
   ```
   ✅ GET https://locallytrip.com/favicon.svg (200 OK)
   ✅ GET https://locallytrip.com/manifest.json (200 OK)
   ```

3. **Images:**
   ```
   ✅ GET https://api.locallytrip.com/images/logo.webp (200 OK)
   ✅ GET https://api.locallytrip.com/images/stories/xxx.jpg (200 OK)
   ```

### **🔍 Browser Network Tab Test:**
- ❌ Tidak ada lagi 503 errors
- ❌ Tidak ada lagi 404 favicon errors
- ✅ Semua static files load dengan benar
- ✅ Website fully functional

## 🛠️ **Troubleshooting Guide:**

### **Jika Masih Ada 503 Errors:**

#### **1. Check Web Service Health:**
```bash
# Check if web container is running
docker compose -f docker-compose.prod.yml ps web

# Check web service logs
docker compose -f docker-compose.prod.yml logs web

# Test internal web service
docker compose -f docker-compose.prod.yml exec web curl -f http://localhost:3000
```

#### **2. Check Nginx Configuration:**
```bash
# Test nginx config
docker compose -f docker-compose.prod.yml exec nginx nginx -t

# Check nginx error logs
docker compose -f docker-compose.prod.yml logs nginx | grep error
```

#### **3. Force Rebuild if Needed:**
```bash
# Complete rebuild
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml build --no-cache web
docker compose -f docker-compose.prod.yml up -d
```

### **Jika Favicon Masih 404:**

#### **1. Check File Exists:**
```bash
# Verify favicon in web container
docker compose -f docker-compose.prod.yml exec web ls -la /app/public/

# Test direct access to favicon
curl -I https://locallytrip.com/favicon.svg
```

#### **2. Check Nginx Static File Routing:**
```bash
# Test static file endpoint
curl -I https://locallytrip.com/manifest.json
```

## 📊 **Monitoring Commands:**

### **Real-time Monitoring:**
```bash
# Watch all logs
docker compose -f docker-compose.prod.yml logs -f

# Watch specific service
docker compose -f docker-compose.prod.yml logs -f web

# Monitor nginx access logs
docker compose -f docker-compose.prod.yml exec nginx tail -f /var/log/nginx/access.log
```

### **Health Check Commands:**
```bash
# Quick status check
docker compose -f docker-compose.prod.yml ps

# Comprehensive debug
./debug-env.sh

# Test endpoints
curl -I https://locallytrip.com/
curl -I https://locallytrip.com/_next/static/
curl -I https://locallytrip.com/favicon.svg
```

## 🎯 **Quick Deploy Command:**

```bash
cd ~/locallytrip && git pull origin main && ./deploy-and-fix-ssl.sh && ./debug-env.sh
```

---

**📋 Expected Timeline:**
- Deploy: ~3-5 minutes
- Service startup: ~1-2 minutes  
- Full functionality: ~5-7 minutes total

**🎯 Success Indicators:**
- ✅ No more 503 errors in browser console
- ✅ All JavaScript files load properly
- ✅ Favicon displays correctly
- ✅ Website fully interactive
