# Maileroo SMTP Configuration Fix

## Problem Solved
❌ **Previous Error**: 
```
Email service error: A04C0AADFFFF0000:error:0A00010B:SSL routines:ssl3_get_record:wrong version number
```

✅ **After Fix**: 
```
✅ Email service ready
SMTP handshake finished  
Authentication successful
```

## Root Cause Analysis
**Configuration Mismatch between .env and backend service:**

| Component | Before | After |
|-----------|--------|-------|
| **.env** | PORT=587, SECURE=false | PORT=587, SECURE=false ✅ |
| **Backend** | PORT=465, SECURE=true (hardcoded) | Uses env variables ✅ |
| **SSL/TLS** | Version mismatch | Proper STARTTLS support ✅ |

## Technical Fix Applied

### 1. Backend EmailService Updated
**File**: `backend/src/services/emailService.js`

**Before:**
```javascript
port: parseInt(process.env.EMAIL_PORT) || 465,
secure: true, // hardcoded
```

**After:**
```javascript
port: parseInt(process.env.EMAIL_PORT) || 587,
secure: process.env.EMAIL_SECURE === 'true', // from env
tls: {
  ciphers: 'SSLv3', // Support older SSL versions  
  rejectUnauthorized: process.env.EMAIL_REQUIRE_TLS !== 'false'
}
```

### 2. Environment Variables Configuration
**File**: `.env`

```env
EMAIL_SERVICE=maileroo
EMAIL_HOST=smtp.maileroo.com
EMAIL_PORT=587                    # STARTTLS port
EMAIL_SECURE=false               # Use STARTTLS, not direct SSL
EMAIL_TLS=true                   # Enable TLS upgrade
EMAIL_USER=noreply@locallytrip.com
EMAIL_PASSWORD=f25130bd59f1041cb351bd4c
EMAIL_REQUIRE_TLS=true           # Require TLS connection
EMAIL_DEBUG_MODE=true            # Enable SMTP debugging
```

## Maileroo Connection Flow (Fixed)
1. **Connect** to `smtp.maileroo.com:587`
2. **Plain connection** initially (secure=false)
3. **STARTTLS** command to upgrade to encrypted connection
4. **TLS handshake** with proper cipher support
5. **Authentication** with credentials
6. **Ready** to send emails ✅

## Production Deployment Instructions

### Server Commands:
```bash
# Pull latest changes with Maileroo fix
git pull

# Restart backend container to apply fix
docker compose restart backend

# Monitor logs to verify email service
docker compose logs backend | grep -i mail

# Test health endpoint
curl -s https://api.locallytrip.com/health | grep -i email
```

### Production Environment Variables
Ensure production `.env` has:
```env
EMAIL_SERVICE=maileroo
EMAIL_HOST=smtp.maileroo.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_TLS=true
EMAIL_USER=noreply@locallytrip.com
EMAIL_PASSWORD=your-production-password
EMAIL_REQUIRE_TLS=true
EMAIL_DEBUG_MODE=false  # Set false for production
```

## Testing Commands

### Local Testing:
```bash
# Test SMTP connection manually
telnet smtp.maileroo.com 587

# Test backend health with email status
curl http://localhost:3001/health | jq '.email'

# Monitor email service logs
docker compose logs backend -f | grep -E "(Email|SMTP|mail)"
```

### Production Testing:
```bash
# Test email service on production
curl https://api.locallytrip.com/health
```

## Key Learnings
1. **Environment Variable Priority**: Backend must respect env vars over hardcoded values
2. **SSL/TLS Configuration**: Port 587 uses STARTTLS, not direct SSL like port 465
3. **Debug Mode**: Essential for troubleshooting SMTP connection issues
4. **TLS Cipher Support**: Older SSL versions may need specific cipher configuration

## Commits Applied
- `1c2033a` - Fix Maileroo SMTP configuration - Use environment variables for secure/port settings

---
**Status**: ✅ **MAILEROO FIXED & PRODUCTION READY**
**Next Step**: Deploy to production and verify story API functionality
