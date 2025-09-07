# 🚀 Panduan Deploy dan Fix SSL LocallyTrip

## Quick Deploy & SSL Fix

Setelah melakukan perubahan di local dan push ke repository, jalankan perintah berikut di server production:

### 1. Update Kode dari Repository

```bash
cd ~/locallytrip
git pull origin main
```

### 2. Deploy dan Fix SSL Sekaligus (Recommended)

```bash
# Deploy ulang dan auto-fix SSL
./deploy-and-fix-ssl.sh
```

### 3. Atau Fix SSL Saja (jika service sudah running)

```bash
# Hanya fix SSL tanpa redeploy
./deploy-and-fix-ssl.sh --ssl-only
```

## Apa yang Akan Terjadi?

### Script `deploy-and-fix-ssl.sh` akan:

1. **Stop services** yang sedang berjalan
2. **Clean up** container dan images lama
3. **Build dan start** semua services dengan configuration terbaru
4. **Auto-detect** apakah domain sudah pointing ke server
5. **Mencoba Let's Encrypt** terlebih dahulu untuk certificate trusted
6. **Fallback ke self-signed** jika Let's Encrypt gagal
7. **Test HTTPS** dan HTTP redirect
8. **Show status** dan informasi berguna

### Script `setup-ssl.sh --auto-fix` akan:

1. **Check domain DNS** apakah pointing ke server IP
2. **Install certbot** jika belum ada
3. **Generate temporary certificates** untuk nginx start
4. **Request Let's Encrypt certificate** via webroot validation
5. **Copy certificates** ke ssl/ directory
6. **Restart services** dengan certificate baru
7. **Fallback gracefully** jika ada masalah

## Hasil yang Diharapkan

### ✅ Jika Berhasil dengan Let's Encrypt:
```bash
curl https://locallytrip.com
# Akan berhasil tanpa SSL error
```

### ⚠️ Jika Menggunakan Self-Signed:
```bash
curl -k https://locallytrip.com
# Berhasil dengan -k flag (skip SSL verification)

curl https://locallytrip.com
# SSL error (normal untuk self-signed)
```

## Troubleshooting

### Jika Deploy Gagal:

```bash
# Check logs
docker compose -f docker-compose.prod.yml logs -f nginx
docker compose -f docker-compose.prod.yml logs -f backend

# Manual restart
docker compose -f docker-compose.prod.yml restart

# Force rebuild
docker compose -f docker-compose.prod.yml up --build -d --force-recreate
```

### Jika SSL Masih Bermasalah:

```bash
# Run setup SSL manual
chmod +x setup-ssl.sh
./setup-ssl.sh

# Pilih option 4 untuk auto-fix
# Atau option 2 untuk Let's Encrypt manual
```

### Check Certificate Status:

```bash
# Lihat certificate info
openssl x509 -in ssl/cert.pem -text -noout | head -20

# Test SSL connection
openssl s_client -connect locallytrip.com:443 -servername locallytrip.com
```

## Environment Variables Required

Pastikan `.env` file di server memiliki:

```bash
SSL_EMAIL=your-email@example.com
DOMAIN=locallytrip.com
DB_NAME=locallytrip
DB_USER=locallytrip
DB_PASSWORD=your-secure-password
JWT_SECRET=your-jwt-secret
```

## Let's Encrypt Requirements

Untuk mendapatkan trusted SSL certificate dari Let's Encrypt:

1. **Domain harus pointing ke server IP**
2. **Port 80 dan 443 harus terbuka**
3. **Tidak ada service lain yang menggunakan port tersebut**
4. **Server harus bisa diakses dari internet**

Jika requirements di atas tidak terpenuhi, script akan automatically menggunakan self-signed certificate.

## Commands Berguna

```bash
# Quick status check
docker compose -f docker-compose.prod.yml ps

# Restart specific service
docker compose -f docker-compose.prod.yml restart nginx

# View real-time logs
docker compose -f docker-compose.prod.yml logs -f

# SSL-only fix
./deploy-and-fix-ssl.sh --ssl-only

# Force redeploy everything
./deploy-and-fix-ssl.sh

# Manual SSL setup
./setup-ssl.sh --auto-fix
```

---

**🎯 Sekarang jalankan di server production:**

```bash
cd ~/locallytrip
git pull origin main
./deploy-and-fix-ssl.sh
```
