# LocallyTrip Backend API Reference

## Important Notes for Development

### Backend URL Structure
**PENTING**: Backend API LocallyTrip **TIDAK menggunakan** prefix `/api` atau `/api/v1/` 

#### ❌ SALAH:
```
http://localhost:3001/api/stories/slug/jakarta-street-food
http://localhost:3001/api/v1/stories/slug/jakarta-street-food
```

#### ✅ BENAR:
```
http://localhost:3001/stories/slug/jakarta-street-food
http://localhost:3001/hosts/host-1
http://localhost:3001/experiences/1
```

### Frontend API Routes Configuration
Frontend Next.js API routes di `/src/app/api/*` sudah dikonfigurasi dengan benar:
- Menggunakan `getServerBackendUrl()` utility
- Menggunakan `INTERNAL_API_URL` untuk container-to-container communication
- Fallback ke `NEXT_PUBLIC_API_URL` untuk development

### Environment Variables untuk Backend Communication
```env
# Internal container communication (Docker)
INTERNAL_API_URL=http://backend:3001

# External/browser communication
NEXT_PUBLIC_API_URL=http://localhost:3001

# Backend host binding
BACKEND_HOST=0.0.0.0
BACKEND_PORT=3001
```

### Health Check Configuration
Docker health check menggunakan `0.0.0.0` untuk internal container binding:
```yaml
healthcheck:
  test: ["CMD-SHELL", "curl -f http://0.0.0.0:${BACKEND_PORT:-3001}/health || exit 1"]
```

### Key Endpoints (Tanpa /api prefix!)
- Stories by slug: `/stories/slug/{slug}`
- All stories: `/stories`
- Host details: `/hosts/{hostId}`
- Experience details: `/experiences/{experienceId}`
- Health check: `/health`

### Production Deployment Notes
✅ Fix yang sudah diterapkan (commit 0ab15d4):
1. Frontend story API route menggunakan `getServerBackendUrl()`
2. Docker health check menggunakan `0.0.0.0` binding
3. Environment variable `BACKEND_HOST=0.0.0.0` ditambahkan
4. Production docker-compose.prod.yml juga diupdate

### Testing Commands
```bash
# Test backend directly (tanpa /api prefix)
curl -s http://localhost:3001/stories/slug/jakarta-street-food

# Test frontend API route (dengan trailing slash untuk menghindari redirect)
curl -s "http://localhost:3000/api/stories/jakarta-street-food/"

# Health check
curl -s http://localhost:3001/health
```

### Remember for Future Development
1. **Backend endpoints**: Langsung tanpa `/api` prefix
2. **Frontend API routes**: Proxy ke backend dengan `getServerBackendUrl()`
3. **Docker health check**: Gunakan `0.0.0.0` bukan `localhost`
4. **Environment variables**: `INTERNAL_API_URL` untuk container communication
5. **Next.js trailing slash**: API routes memerlukan trailing slash untuk menghindari 308 redirect

---
**Catatan**: Dokumentasi ini dibuat setelah fixing production story API issue di commit 0ab15d4
