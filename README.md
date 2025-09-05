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
npm run dev      # Start all services
npm run build    # Build containers  
npm run start    # Start (production)
npm run stop     # Stop services
npm run clean    # Clean containers
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

### 📧 Email Configuration

LocallyTrip uses multiple email addresses for different purposes:
- `noreply@locallytrip.com` - System emails & verification
- `marketing@locallytrip.com` - Newsletters & campaigns  
- `booking@locallytrip.com` - Booking confirmations
- `support@locallytrip.com` - Customer support
- `admin@locallytrip.com` - Admin notifications

**Setup Email Service:**
```bash
./setup-email.sh    # Check email configuration
```

See [EMAIL_CONFIGURATION.md](EMAIL_CONFIGURATION.md) for detailed setup instructions.

## 📱 Mobile Development
```bash
cd mobile/
flutter pub get
flutter run
```

## 🗄️ Database
```bash
./run_seeding.sh    # Initialize with sample data
./init-database.sh  # Reset database
```

## 🌐 Production

Production URLs:
- **Website**: https://locallytrip.com
- **Admin**: https://admin.locallytrip.com  
- **API**: https://api.locallytrip.com

## 📝 License

MIT License - see [LICENSE](LICENSE) file.

---

**LocallyTrip Team** | [GitHub](https://github.com/nopecode96/locallytrip) | [Website](https://locallytrip.com)
