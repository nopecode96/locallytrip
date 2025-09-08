# LocallyTrip CORS & API Architecture Fix Guide

## 🚨 **Critical Issues Identified**

### **Issue 1: Wrong API Call Pattern**
❌ **PROBLEM**: Frontend calling backend directly
```typescript
// WRONG - Direct backend call
const apiUrl = process.env.NEXT_PUBLIC_API_URL; // https://api.locallytrip.com
fetch(`${apiUrl}/cities`)
```

✅ **SOLUTION**: Use Next.js API proxy pattern
```typescript
// CORRECT - API proxy pattern
fetch('/api/cities') // Routes through Next.js API layer
```

### **Issue 2: CORS Configuration Missing**
❌ **PROBLEM**: Backend CORS not configured for production domains
```javascript
// Missing CORS_ORIGIN in .env.production
origin: process.env.CORS_ORIGIN?.split(',') || allowedOrigins
```

✅ **SOLUTION**: Added CORS_ORIGIN to .env.production
```bash
CORS_ORIGIN=https://locallytrip.com,https://admin.locallytrip.com,https://api.locallytrip.com
```

### **Issue 3: 308 Permanent Redirect Loop**
❌ **PROBLEM**: HTTPS redirect logic causing redirect loops
```javascript
// In backend server.js - aggressive redirect
if (req.header('x-forwarded-proto') !== 'https') {
  return res.redirect(`https://${productionHost}${req.url}`);
}
```

## 🏗️ **LocallyTrip Architecture Pattern (CORRECT)**

### **Frontend Data Flow:**
```
Frontend Component
    ↓
Custom Hook (useCitiesData)
    ↓
Next.js API Route (/api/cities)
    ↓
Backend API (via INTERNAL_API_URL)
    ↓
Database
```

### **Key Principles:**
1. **Never call backend directly** from frontend components
2. **Always use /api/* routes** for data fetching
3. **Backend communication happens server-side** via INTERNAL_API_URL
4. **CORS only needed for container-to-container** communication

## 🔧 **Fixes Applied:**

### **1. Fixed useCitiesData.ts**
```typescript
// Before (WRONG)
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const response = await fetch(`${apiUrl}/cities`);

// After (CORRECT)
const response = await fetch('/api/cities');
```

### **2. Added CORS Configuration**
```bash
# .env.production
CORS_ORIGIN=https://locallytrip.com,https://admin.locallytrip.com,https://api.locallytrip.com
```

### **3. Environment Variables Hierarchy**
```bash
# Production containers should use:
NEXT_PUBLIC_API_URL=https://api.locallytrip.com     # For external API calls (if any)
INTERNAL_API_URL=http://backend:3001                # For server-side API calls
CORS_ORIGIN=https://locallytrip.com,...             # For backend CORS
```

## 🚀 **Deployment Instructions**

### **Step 1: Apply Fixes**
```bash
git pull origin main
./fix-cors-api.sh
```

### **Step 2: Verify Configuration**
```bash
# Check environment variables
docker compose -f docker-compose.prod.yml exec web printenv | grep NEXT_PUBLIC
docker compose -f docker-compose.prod.yml exec backend printenv | grep CORS

# Test API proxy
curl http://localhost:3000/api/cities

# Check backend direct
curl http://localhost:3001/cities
```

### **Step 3: Debug if Issues Persist**
```bash
# Check container logs
docker compose -f docker-compose.prod.yml logs web
docker compose -f docker-compose.prod.yml logs backend

# Check network connectivity
docker compose -f docker-compose.prod.yml exec web curl http://backend:3001/health
```

## 🐛 **Troubleshooting Common Issues**

### **CORS Still Failing?**
1. Verify `CORS_ORIGIN` environment variable in backend container
2. Check if backend is receiving requests with correct headers
3. Ensure no aggressive HTTPS redirects

### **API Routes 404?**
1. Verify Next.js API routes exist in `/src/app/api/`
2. Check build process includes API routes
3. Ensure Next.js container is running properly

### **Internal Communication Failing?**
1. Check Docker network connectivity: `docker network ls`
2. Verify service names in docker-compose.prod.yml
3. Test internal communication: `docker exec web curl backend:3001/health`

## 📊 **Expected Results After Fix**

✅ **Frontend Console:**
```
🔍 useCitiesData: Using Next.js API proxy /api/cities
✅ useCitiesData: Successfully fetched X cities
```

✅ **Network Tab:**
```
GET /api/cities → 200 OK
GET /api/experiences/featured → 200 OK
```

✅ **No CORS Errors:** All API calls go through Next.js proxy

✅ **No Direct Backend Calls:** No calls to https://api.locallytrip.com from browser

## 🔒 **Security Benefits**

1. **No direct backend exposure** to client
2. **Server-side API calls** hide internal URLs
3. **Proper CORS boundaries** between services
4. **Request validation** at Next.js API layer
5. **Environment isolation** between containers
