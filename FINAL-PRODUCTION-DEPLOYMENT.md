# 🚀 Final Production Deployment Instructions

## ✅ **Issue Resolved: Port 2525 Working!**

**Problem**: Port 587 blocked by production server  
**Solution**: Use Maileroo port 2525 (tested working)

```bash
# Test result on production server:
telnet smtp.maileroo.com 2525
# ✅ Connected to smtp.maileroo.com
# ✅ 220 Erb SMTPd ready
```

## 📋 **Final Deployment Steps**

### 1. Pull Latest Changes
```bash
cd /home/locallytrip
git pull origin main
```

### 2. Update Environment Configuration
```bash
# Copy production environment with working port 2525
cp .env.production .env

# Verify email port configuration
grep EMAIL_PORT .env
# Should show: EMAIL_PORT=2525
```

### 3. Deploy Services
```bash
# Stop and rebuild all services
docker compose down
docker compose up --build -d

# Monitor backend startup
docker compose logs -f backend | head -30
```

### 4. Verify Email Service Working
```bash
# Should see in logs:
# ✅ Email service ready (instead of timeout/error)
# ✅ SERVER SUCCESSFULLY STARTED
# ✅ Database connection established successfully
```

### 5. Test All Endpoints
```bash
# Backend health (should show email: true)
curl http://localhost:3001/health

# Story API (original issue)
curl http://localhost:3001/stories/slug/jakarta-street-food

# Public API test
curl https://locallytrip.com/api/stories/jakarta-street-food/
```

## 🔧 **Working Configuration Summary**

### Email Service Settings:
```env
EMAIL_SERVICE=maileroo
EMAIL_HOST=smtp.maileroo.com
EMAIL_PORT=2525              # ✅ WORKING PORT
EMAIL_SECURE=false
EMAIL_TLS=true
EMAIL_USER=noreply@locallytrip.com
EMAIL_PASSWORD=f25130bd59f1041cb351bd4c
```

### Backend Improvements:
- ✅ Non-blocking email service (won't stop server if email fails)
- ✅ 5-second timeout for email verification
- ✅ Production-safe error handling
- ✅ Proper Docker health check with `BACKEND_HOST=0.0.0.0`

## 📊 **Expected Results**

### Backend Logs:
```
✅ Email service ready
✅ SERVER SUCCESSFULLY STARTED ✅
🔗 LocallyTrip Backend API running on 0.0.0.0:3001
✅ Database connection established successfully
✅ Server is ready to accept connections!
```

### Health Check Response:
```json
{
  "status": "healthy",
  "email": true,
  "database": "connected",
  "uptime": 120.5
}
```

### Story API Response:
```json
{
  "success": true,
  "data": {
    "id": 2,
    "slug": "jakarta-street-food",
    "title": "Jakarta Street Food",
    ...
  }
}
```

## 🎯 **Success Verification Checklist**

- [ ] `git pull` completed successfully
- [ ] `.env` file contains `EMAIL_PORT=2525`
- [ ] All Docker containers running (healthy status)
- [ ] Backend logs show "✅ Email service ready" 
- [ ] Health endpoint returns `"email": true`
- [ ] Story API endpoint working
- [ ] Public website accessible at https://locallytrip.com

## 🔄 **Rollback Plan** (if needed)

If any issues occur:
```bash
# Quick rollback
docker compose down
docker compose up backend -d --no-deps

# Check status
docker compose ps
docker compose logs backend --tail 20
```

---
**Status**: 🎯 **READY FOR FINAL DEPLOYMENT**  
**Email Service**: ✅ **FIXED with Port 2525**  
**Story API**: ✅ **READY TO WORK**
