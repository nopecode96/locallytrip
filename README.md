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
└─ Docker Compose ───────────┘
```

## 🚀 Quick Start

### Development Environment
```bash
# Clone the repository
git clone https://github.com/nopecode96/locallytrip.git
cd locallytrip

# Start development environment (interactive menu)
./dev.sh

# Or use individual commands
./scripts/development/start.sh     # Start all services
./scripts/development/status.sh    # Check service status
./scripts/development/logs.sh      # View service logs
./scripts/development/stop.sh      # Stop all services
```

### Access URLs (Development)
- **Frontend**: http://localhost:3000
- **Admin Panel**: http://localhost:3002
- **Backend API**: http://localhost:3001
- **API Health**: http://localhost:3001/health

## 🔧 Environment

Copy `.env.production` to `.env` and configure:
```bash
cp .env.example .env
```
## 🔧 Development Tools

### Database Management
```bash
./scripts/development/reset-database.sh    # Reset & seed database
```

### Docker Commands
```bash
docker compose up --build              # Build and start
docker compose down                     # Stop all services
docker compose logs -f                  # Follow logs
docker compose ps                       # Check status
```

## 📁 Project Structure

```
locallytrip/
├── backend/              # Node.js/Express API
├── web/                  # Next.js Frontend
├── web-admin/            # Next.js Admin Panel
├── mobile/               # Flutter Mobile App
├── postgres-data/        # Database volume
├── scripts/              # Development & deployment scripts
├── docs/                 # Documentation
├── nginx/                # Nginx configuration
└── ssl/                  # SSL certificates
```

## 🌐 Production Deployment

### Quick Deployment
```bash
# Ubuntu server deployment
./scripts/deployment/deploy-ubuntu-server.sh

# SSL setup
./scripts/deployment/setup-ssl.sh
```

For detailed deployment instructions, see [docs/SERVER-DEPLOYMENT-UBUNTU.md](docs/SERVER-DEPLOYMENT-UBUNTU.md)

## 📱 Mobile Development

### Flutter Setup
```bash
cd mobile/
flutter pub get
flutter run
```

### API Configuration
The mobile app connects to:
- **Development**: `http://localhost:3001/api/v1`
- **Production**: `https://api.your-domain.com/api/v1`

## 🔧 Environment Configuration

Copy `.env.example` to `.env` and configure:

```bash
# Database
DB_HOST=postgres
DB_NAME=locallytrip_prod
DB_USER=locallytrip_prod_user
DB_PASSWORD=your-secure-password

# API URLs (Development)
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_IMAGES=http://localhost:3001/images

# Email Service (MailerSend)
MAILERSEND_API_KEY=your-mailersend-api-key
EMAIL_USER=your-smtp-username
EMAIL_PASSWORD=your-smtp-password
```

## 📚 Documentation

- [API Reference](docs/BACKEND-API-REFERENCE.md)
- [Deployment Guide](docs/SERVER-DEPLOYMENT-UBUNTU.md)
- [Environment Setup](docs/ENVIRONMENT-CONFIGURATION-GUIDE.md)
- [SSL Configuration](docs/DEPLOY-SSL-GUIDE.md)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

MIT License - see [LICENSE](LICENSE) file.

---

**LocallyTrip Team** | [GitHub](https://github.com/nopecode96/locallytrip) | [Website](https://locallytrip.com)
