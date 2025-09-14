# 🖼️ Fix Image Loading Issues - LocallyTrip

## Masalah yang Telah Diperbaiki

### ❌ **Masalah Sebelumnya:**
```
GET http://localhost:3001/images/placeholder-story.jpg net::ERR_CONNECTION_REFUSED
```

### ✅ **Solusi yang Diterapkan:**
1. **Hapus hardcoded localhost URLs** dari komponen React
2. **Gunakan ImageService** untuk semua image URL generation
3. **Perbaiki environment variable handling** di production
4. **Auto-copy .env.production** ke .env saat deploy

## 🚀 Cara Deploy Fix ini

### 1. Update Kode di Server

```bash
cd ~/locallytrip
git pull origin main
```

### 2. Deploy dengan Script Baru

```bash
# Deploy lengkap dengan SSL fix
./deploy-and-fix-ssl.sh

# ATAU jika hanya ingin redeploy tanpa SSL changes
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml up --build -d
```

### 3. Debug Environment (Optional)

```bash
# Check environment variables dan status
./debug-env.sh
```

## 🔧 Perubahan yang Dibuat

### **1. Component Fixes:**

#### **HomeTravelStoriesSection.tsx:**
```tsx
// ❌ Sebelum (hardcoded)
src={`http://localhost:3001/images/stories/${story.image}`}

// ✅ Sesudah (menggunakan ImageService)
src={ImageService.getImageUrl(story.image, 'stories')}
```

#### **StoryCard.tsx:**
```tsx
// ❌ Sebelum
const imageUrl = story?.image || '/images/stories/placeholder-story.jpg';

// ✅ Sesudah
const imageUrl = ImageService.getImageUrl(story?.image || 'placeholder-story.jpg', 'stories');
```

### **2. ImageService Improvements:**
```typescript
// Prioritas environment variables:
// 1. NEXT_PUBLIC_IMAGES (dari .env)
// 2. https://api.locallytrip.com/images (production fallback)
// 3. http://backend:3001/images (container internal)
```

### **3. Deploy Script Enhancements:**
- ✅ Auto-copy `.env.production` to `.env`
- ✅ Validate environment variables
- ✅ Show environment info during deploy

## 📋 Expected Results

### **✅ Setelah Deploy:**

1. **Images akan load dari URL yang benar:**
   ```
   https://api.locallytrip.com/images/stories/placeholder-story.jpg
   ```

2. **Tidak ada lagi error:**
   ```
   ❌ ERR_CONNECTION_REFUSED localhost:3001
   ```

3. **Environment variables ter-load dengan benar:**
   ```bash
   NEXT_PUBLIC_IMAGES=https://api.locallytrip.com/images
   NEXT_PUBLIC_API_URL=https://api.locallytrip.com
   ```

## 🧪 Testing

### **1. Check Environment Variables:**
```bash
./debug-env.sh
```

### **2. Test Image URLs Manually:**
```bash
# Test production image URL
curl -I https://api.locallytrip.com/images/logo.webp

# Should return 200 OK
```

### **3. Check Browser Network Tab:**
```
✅ Harusnya tidak ada requests ke localhost:3001
✅ Semua images dari https://api.locallytrip.com/images/
```

## 🔍 Troubleshooting

### **Jika Images Masih 404:**

1. **Check backend serving static files:**
   ```bash
   docker compose -f docker-compose.prod.yml logs backend | grep images
   ```

2. **Check nginx proxy:**
   ```bash
   docker compose -f docker-compose.prod.yml logs nginx | grep images
   ```

3. **Verify file exists:**
   ```bash
   ls -la backend/public/images/
   ```

### **Jika Environment Variables Tidak Ter-load:**

1. **Check .env file:**
   ```bash
   cat .env | grep NEXT_PUBLIC
   ```

2. **Check container environment:**
   ```bash
   docker compose -f docker-compose.prod.yml exec web printenv | grep NEXT_PUBLIC
   ```

3. **Force rebuild:**
   ```bash
   docker compose -f docker-compose.prod.yml up --build -d --force-recreate
   ```

## 📁 File Structure

```
backend/public/images/
├── stories/
│   ├── placeholder-story.jpg ✅
│   └── ...
├── users/avatars/
│   ├── placeholder-avatar.jpg ✅
│   └── ...
├── placeholders/
│   ├── placeholder-story.jpg ✅
│   └── ...
└── logo.webp ✅
```

## 🎯 Next Steps

1. **Deploy ke server:**
   ```bash
   cd ~/locallytrip
   git pull origin main
   ./deploy-and-fix-ssl.sh
   ```

2. **Verify di browser:**
   - Buka https://locallytrip.com
   - Check Network tab (F12)
   - Pastikan tidak ada error 404 atau localhost requests

3. **Monitor logs:**
   ```bash
   docker compose -f docker-compose.prod.yml logs -f web
   ```

---

**🎯 Quick Deploy Command:**

```bash
cd ~/locallytrip && git pull origin main && ./deploy-and-fix-ssl.sh
```
