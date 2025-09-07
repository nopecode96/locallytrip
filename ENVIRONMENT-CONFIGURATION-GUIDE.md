# LocallyTrip Environment Configuration Guide

## 🔧 Masalah yang Sering Terjadi: `process.env.NEXT_PUBLIC_API_URL` Tidak Bekerja di Production

### Root Cause Analysis

1. **Environment File Mismatch**: Production menggunakan `.env.production` tapi docker-compose.prod.yml masih reference ke `.env`
2. **Build-time vs Runtime Variables**: Next.js `NEXT_PUBLIC_*` variables harus tersedia saat build time
3. **Environment Variable Inheritance**: Docker Compose tidak otomatis load environment variables dari file yang benar

### Solusi yang Telah Diimplementasikan

#### 1. Fixed docker-compose.prod.yml
```yaml
# BEFORE (Bermasalah)
env_file:
  - .env

# AFTER (Fixed)
env_file:
  - .env.production
```

#### 2. Deployment Script Baru
Gunakan script `deploy-production.sh` yang:
- Memastikan `.env.production` tersedia
- Copy `.env.production` ke `.env` untuk kompatibilitas
- Verifikasi environment variables sebelum deployment
- Force rebuild containers untuk memastikan env vars terupdate

#### 3. Enhanced Logging
Tambahkan logging di hooks untuk debugging:
```typescript
console.log('🔍 useCitiesData: Using API URL:', apiUrl);
```

## 🚀 Workflow Deployment yang Benar

### Development (Local)
```bash
# Menggunakan .env file
docker compose up --build
```

### Production (Server)
```bash
# 1. Pastikan .env.production ada dan terisi dengan benar
# 2. Gunakan script deployment khusus
./deploy-production.sh

# ATAU manual:
cp .env.production .env
docker compose -f docker-compose.prod.yml up --build -d
```

## 📋 Environment Variables Checklist

### Required Variables di .env.production:
- ✅ `NEXT_PUBLIC_API_URL=https://api.locallytrip.com`
- ✅ `NEXT_PUBLIC_IMAGES=https://api.locallytrip.com/images`
- ✅ `NEXT_PUBLIC_WEBSITE_URL=https://locallytrip.com`
- ✅ `NODE_ENV=production`

### Verification Commands:
```bash
# Check if environment variables are loaded
source .env.production
echo $NEXT_PUBLIC_API_URL

# Check if containers have correct env vars
docker exec locallytrip-web-prod env | grep NEXT_PUBLIC

# Test API connectivity
curl -f http://localhost:3001/health
```

## 🐛 Debugging Environment Issues

### 1. Check Container Environment
```bash
docker exec locallytrip-web-prod env | grep NEXT_PUBLIC
```

### 2. Check Build Logs
```bash
docker compose -f docker-compose.prod.yml logs web
```

### 3. Verify API Connectivity
```bash
# From container
docker exec locallytrip-web-prod curl -f http://backend:3001/health

# From host
curl -f http://localhost:3001/health
```

### 4. Common Issues & Solutions

#### Issue: `process.env.NEXT_PUBLIC_API_URL` returns undefined
**Solution**: Ensure environment variable is available at build time:
```dockerfile
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
```

#### Issue: API calls failing in production
**Solution**: Check CORS configuration and network connectivity:
```javascript
// In backend CORS config
origin: [
  'https://locallytrip.com',
  'https://admin.locallytrip.com',
  'http://localhost:3000',  // For local development
  'http://localhost:3002'   // For local admin
]
```

#### Issue: Environment variables not persisting
**Solution**: Force rebuild containers:
```bash
docker compose -f docker-compose.prod.yml down --rmi all
docker compose -f docker-compose.prod.yml up --build -d
```

## 📝 Best Practices

1. **Always use deployment script** untuk production deployment
2. **Verify environment variables** sebelum deployment
3. **Check service health** setelah deployment
4. **Monitor logs** untuk memastikan tidak ada error
5. **Test API connectivity** dari frontend container

## 🔍 Quick Diagnostic Commands

```bash
# Check all environment files
ls -la .env*

# Compare environment configurations
diff .env .env.production

# Check running containers
docker compose -f docker-compose.prod.yml ps

# Check container logs
docker compose -f docker-compose.prod.yml logs -f web

# Test API from outside
curl -f http://localhost:3001/health

# Test frontend from outside
curl -f http://localhost:3000
```
