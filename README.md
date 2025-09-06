# LocallyTrip.com 🌍

> **Travel Discovery Platform** - Connecting travelers with authentic local experiences

[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](https://www.docker.com/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)
[![Flutter](https://img.shields.io/badge/Flutter-3.0+-blue)](https://flutter.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)](https://postgresql.org/)

## 🏗️ Architecture

```
┌─ Web (Next.js) :3000 ──────┐
├─ Admin (Next.js) :3002 ────┤  → Backend API :3001 → PostgreSQL
├─ Mobile (Flutter) ─────────┤
└─ Docker + SSL ─────────────┘
```

## 🚀 Quick Start

### One-Command Setup
```bash
git clone https://github.com/nopecode96/locallytrip.git
cd locallytrip
npm run dev
```

### Commands
```bash
npm run dev      # Start all services (development)
npm run build    # Build containers  
npm run start    # Start containers (production)
npm run stop     # Stop all services
npm run clean    # Clean containers & volumes

# Ubuntu Server Deployment
./setup-ubuntu-server.sh      # Initial server setup (run as root)
./deploy-ubuntu-server.sh      # Deploy to Ubuntu server
./ubuntu-quick-commands.sh     # Server maintenance commands
```

### Access URLs
- **Web**: https://localhost:3000
- **Admin**: https://localhost:3002
- **API**: https://localhost:3001

## 🔧 Environment

Copy `.env.example` to `.env` and configure:
```bash
cp .env.example .env
```

### Required Variables
```bash
# Database
DB_HOST=postgres
DB_NAME=locallytrip
DB_USER=locallytrip_user
DB_PASSWORD=locallytrip_password

# API URLs
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_IMAGES=http://localhost:3001/images

# Email Service (Maileroo)
EMAIL_USER=your-maileroo-username
EMAIL_PASSWORD=your-maileroo-password
```

## 🌐 Ubuntu Server Deployment

For Ubuntu server deployment, use these scripts:

```bash
# 1. Initial server setup (run once, as root)
curl -fsSL https://raw.githubusercontent.com/nopecode96/locallytrip/main/setup-ubuntu-server.sh | bash

# 2. Configure environment (as locallytrip user)
cp .env.ubuntu-server .env
nano .env  # Edit domain, passwords, etc.

# 3. Deploy application
./deploy-ubuntu-server.sh

# 4. Server maintenance commands
./ubuntu-quick-commands.sh status     # Check status
./ubuntu-quick-commands.sh health     # Health check
./ubuntu-quick-commands.sh backup     # Backup database
./ubuntu-quick-commands.sh restart    # Restart services
```

### Production URLs:
- **Website**: https://your-domain.com
- **Admin**: https://admin.your-domain.com  
- **API**: https://api.your-domain.com

### Documentation:
- **Ubuntu Deployment Guide**: [SERVER-DEPLOYMENT-UBUNTU.md](SERVER-DEPLOYMENT-UBUNTU.md)
- **Quick Summary**: [UBUNTU-DEPLOYMENT-SUMMARY.md](UBUNTU-DEPLOYMENT-SUMMARY.md)

## 📱 Mobile Development
```bash
cd mobile/
flutter pub get
flutter run
```

## 🗄️ Database
```bash
./seed-database-complete.sh     # Initialize with complete sample data
```

## 📝 License

MIT License - see [LICENSE](LICENSE) file.

---

**LocallyTrip Team** | [GitHub](https://github.com/nopecode96/locallytrip) | [Website](https://locallytrip.com)
