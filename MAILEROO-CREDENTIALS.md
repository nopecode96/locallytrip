# Maileroo Email Credentials - LocallyTrip Production

## 📧 **Email Accounts & Credentials**

### **Primary SMTP Account (used in .env):**
- **Username**: `noreply@locallytrip.com`
- **Password**: `f25130bd59f1041cb351bd4c`

### **All Available Email Accounts:**

| Email Address | Password | Purpose |
|---------------|----------|---------|
| `noreply@locallytrip.com` | `f25130bd59f1041cb351bd4c` | System emails, verification |
| `marketing@locallytrip.com` | `30bc39efe00a7af1a672d758` | Marketing campaigns |
| `admin@locallytrip.com` | `7816d640b7979a48a7bb8759` | Admin notifications |
| `support@locallytrip.com` | `32aeb0ef97a967c59a6ff4f0` | Customer support |
| `booking@locallytrip.com` | `80f3b76527d3fbafd32ddeb9` | Booking confirmations |
| `hello@locallytrip.com` | `d37b57867a2016c993b9c5da` | General contact |

## 🔑 **API Configuration**

### **Maileroo API Key:**
```bash
MAILEROO_API_KEY=21813567890e9532d3ae718b28930b6066a75abe3da7bbf34d66474595be38bb
```

### **SMTP Configuration:**
```bash
EMAIL_HOST=smtp.maileroo.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_TLS=true
EMAIL_USER=noreply@locallytrip.com
EMAIL_PASSWORD=f25130bd59f1041cb351bd4c
```

## 📝 **Usage in Application**

The application automatically uses different email addresses for different purposes:

- **Registration/Verification**: `noreply@locallytrip.com`
- **Marketing Campaigns**: `marketing@locallytrip.com`  
- **Admin Notifications**: `admin@locallytrip.com`
- **Customer Support**: `support@locallytrip.com`
- **Booking Confirmations**: `booking@locallytrip.com`
- **General Contact**: `hello@locallytrip.com`

## 🛡️ **Security Note**

⚠️ **IMPORTANT**: This file contains sensitive credentials. 
- **DO NOT** commit this file to version control
- **DO NOT** share these credentials publicly
- Keep this information secure and accessible only to authorized personnel

---
**Generated**: September 2, 2025
**For**: LocallyTrip Production Deployment
