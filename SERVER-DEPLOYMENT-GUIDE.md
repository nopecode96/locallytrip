# 🚀 Server Deployment Guide - Share Modal Update

## Overview
Panduan step-by-step untuk deploy update terbaru yang mencakup:
- Social Media Share Modal dengan logo resmi
- React-icons package dependency
- Enhanced story detail functionality

---

## 📋 Pre-Deployment Checklist

### 1. Backup Current System (Recommended)
```bash
# Backup database
sudo docker exec locallytrip-postgres pg_dump -U postgres -d locallytrip > backup_$(date +%Y%m%d_%H%M%S).sql

# Backup current docker images (optional)
sudo docker save locallytrip-web:latest > web_backup.tar
sudo docker save locallytrip-backend:latest > backend_backup.tar
```

---

## 🔄 Step-by-Step Deployment Process

### Step 1: Navigate to Project Directory
```bash
cd /path/to/your/locallytrip
# Example: cd /opt/locallytrip or cd ~/locallytrip
```

### Step 2: Stop Current Services
```bash
sudo docker compose down
```

### Step 3: Pull Latest Changes
```bash
git pull origin main
```
**Expected output:**
```
remote: Enumerating objects: 19, done.
Receiving objects: 100% (11/11), 6.04 KiB | 6.04 MiB/s, done.
Resolving deltas: 100% (8/8), done.
Updating c5ec975..06ffb29
Fast-forward
 STORY-SHARE-MODAL-IMPLEMENTATION.md | 178 +++++++++++++++++++
 web/package.json                    |   3 +-
 web/src/app/globals.css             |  32 +++-
 web/src/components/ShareModal.tsx   | 232 +++++++++++++++++++++++++
 web/src/components/StoryDetail.tsx  |  11 +-
 5 files changed, 451 insertions(+), 5 deletions(-)
```

### Step 4: Rebuild and Start Services
```bash
# Rebuild containers with latest changes
sudo docker compose up --build -d

# Alternative: Force rebuild if needed
sudo docker compose build --no-cache
sudo docker compose up -d
```

### Step 5: Verify Services are Running
```bash
# Check all containers are running
sudo docker ps

# Expected output should show all containers as "Up"
# locallytrip-web, locallytrip-backend, locallytrip-admin, locallytrip-postgres
```

### Step 6: Check Logs for Any Issues
```bash
# Check web container logs (most important for this update)
sudo docker logs locallytrip-web --tail 20

# Look for successful compilation:
# "✓ Compiled (XXX modules)"
# "✓ Ready in X.Xs"

# Check backend logs
sudo docker logs locallytrip-backend --tail 10

# Check admin logs
sudo docker logs locallytrip-admin --tail 10
```

---

## 🧪 Testing the Update

### Test 1: Access Website
```bash
# Test main website
curl -I http://localhost:3000
# Expected: HTTP/1.1 200 OK

# Or open in browser:
# http://your-server-ip:3000
```

### Test 2: Test Story Share Modal
1. Navigate to any story page: `http://your-server-ip:3000/stories/jakarta-street-food/`
2. Look for "Share Story ✨" button
3. Click the button - modal should appear with social media icons
4. Test a few share buttons (they should open new tabs or copy to clipboard)
5. Close modal by clicking X or outside area

### Test 3: Check New Package Installation
```bash
# Verify react-icons is installed in container
sudo docker exec locallytrip-web npm list react-icons
# Expected: react-icons@X.X.X
```

---

## 🔧 Troubleshooting Common Issues

### Issue 1: "Module not found: react-icons"
**Solution:**
```bash
# Install react-icons in the running container
sudo docker exec locallytrip-web npm install react-icons

# Or rebuild container completely
sudo docker compose build --no-cache web
sudo docker compose up -d
```

### Issue 2: Share Modal Not Appearing
**Solution:**
```bash
# Check console errors in browser
# Check if StoryDetail component is loading properly
sudo docker logs locallytrip-web --tail 50 | grep -i error
```

### Issue 3: CSS Animations Not Working
**Solution:**
```bash
# Restart web container to reload CSS
sudo docker restart locallytrip-web
```

### Issue 4: Permission Issues
**Solution:**
```bash
# Fix permissions if needed
sudo chown -R $USER:$USER /path/to/locallytrip
```

---

## 📊 Health Check Commands

### Quick Health Check
```bash
# All-in-one health check
echo "=== Container Status ===" && \
sudo docker ps --format "table {{.Names}}\t{{.Status}}" && \
echo -e "\n=== Web Service ===" && \
curl -s -I http://localhost:3000 | head -1 && \
echo -e "\n=== API Service ===" && \
curl -s -I http://localhost:3001/health | head -1 2>/dev/null || echo "API endpoint check failed" && \
echo -e "\n=== Share Modal Test ===" && \
curl -s "http://localhost:3000/stories/jakarta-street-food/" | grep -q "Share Story" && echo "✅ Share button found" || echo "❌ Share button not found"
```

### Detailed Component Check
```bash
# Check if new components exist
sudo docker exec locallytrip-web ls -la /app/src/components/ | grep ShareModal
# Expected: ShareModal.tsx should be listed

# Check package.json for react-icons
sudo docker exec locallytrip-web cat /app/package.json | grep react-icons
# Expected: "react-icons": "^X.X.X"
```

---

## 🎯 Expected Results After Deployment

### ✅ Success Indicators:
- [ ] All containers running (4/4)
- [ ] Website loads without errors
- [ ] Story pages show "Share Story ✨" button
- [ ] Share modal opens with social media logos (not emojis)
- [ ] Share buttons are functional (open links or copy text)
- [ ] Modal has smooth animations
- [ ] No console errors in browser

### 📱 New Features Available:
- Social media sharing with authentic brand logos
- 10+ platforms supported with proper branding
- Copy-to-clipboard for platforms without direct sharing
- Smooth fade-in and scale-up animations
- Mobile-optimized responsive design
- Gen Z-friendly interface with gradient buttons

---

## 🛡️ Security & Performance Notes

### Performance:
- **React-icons bundle size**: ~2MB additional (acceptable for UI enhancement)
- **Loading time impact**: Minimal, icons are SVG-based
- **Memory usage**: Negligible increase

### Security:
- **External links**: All social media links open in new tabs with `rel="noopener noreferrer"`
- **XSS protection**: URL encoding used for all dynamic content
- **CORS**: No additional CORS changes needed

---

## 📞 Support & Rollback

### If Something Goes Wrong:
```bash
# Quick rollback to previous commit
git log --oneline -5  # Find previous commit hash
git checkout [previous-commit-hash]
sudo docker compose down
sudo docker compose up --build -d

# Or restore from backup
sudo docker compose down
sudo docker load < web_backup.tar
sudo docker compose up -d
```

### Support Contacts:
- Check logs first: `sudo docker logs locallytrip-web --tail 50`
- Review this documentation
- Test in localhost first before server deployment

---

## 🎉 Post-Deployment Verification

After successful deployment, verify these features work:

1. **Story sharing works**: Test on `/stories/jakarta-street-food/`
2. **Icons are visible**: Should see Instagram, TikTok, etc. logos (not emojis)
3. **Copy functionality**: Test copy-to-clipboard buttons
4. **Direct sharing**: Test platforms like Facebook, Twitter that open new tabs
5. **Mobile responsiveness**: Test on mobile devices
6. **Animation smoothness**: Modal should fade in/scale up nicely

---

## 📈 Monitoring Commands (Optional)

```bash
# Monitor container resources
sudo docker stats

# Monitor logs in real-time
sudo docker logs locallytrip-web -f

# Check disk space
df -h
```

---

**🚀 Ready for deployment! Follow the steps above in order, and your share modal will be live with authentic social media icons!**
