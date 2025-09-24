# Docker Environment Configuration Guide

## Overview
LocallyTrip runs entirely in Docker containers with automatic environment variable injection and internal service discovery.

## Container Architecture
- **postgres**: PostgreSQL database (port 5432)
- **backend**: Node.js API server (port 3001)  
- **web**: Next.js frontend (port 3000)
- **web-admin**: Next.js admin dashboard (port 3002)

## Environment Variables in Docker

### Automatic Injection
All environment variables are automatically injected from `.env` file into containers via:
- `env_file: - .env` in docker-compose.yml
- `environment:` section for container-specific vars

### Key Variables for Images & APIs:

#### Browser Access (Client-side):
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001      # Browser → Backend API
NEXT_PUBLIC_IMAGES=http://localhost:3001/images # Browser → Backend Images
NEXT_PUBLIC_WEBSITE_URL=http://localhost:3000   # Browser → Web App
```

#### Internal Container Communication (Server-side):
```bash
INTERNAL_API_URL=http://backend:3001            # Container → Backend API
INTERNAL_IMAGES_URL=http://backend:3001/images  # Container → Backend Images
```

## How It Works

### 1. Client-side (Browser)
- Uses `NEXT_PUBLIC_*` variables
- Access via `localhost:PORT` because containers expose ports to host
- Example: `http://localhost:3001/images/photo.jpg`

### 2. Server-side (Inside Containers)
- Uses `INTERNAL_*` variables or direct service names
- Access via container names: `backend`, `web`, `postgres`
- Example: `http://backend:3001/images/photo.jpg`

### 3. Image Service Logic
```typescript
// Client-side (browser)
if (typeof window !== 'undefined') {
  baseUrl = process.env.NEXT_PUBLIC_IMAGES; // http://localhost:3001/images
}
// Server-side (container)
else {
  baseUrl = process.env.INTERNAL_IMAGES_URL; // http://backend:3001/images
}
```

## Development Workflow

### Starting Services
```bash
docker compose up --build
```

### Accessing Services
- **Web App**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3002  
- **Backend API**: http://localhost:3001
- **Database**: localhost:5432

### Environment Variables
1. Copy `.env.example` to `.env`
2. Modify values if needed
3. Restart containers: `docker compose restart`

## Production Deployment

For production, update `.env` with production URLs:
```bash
NEXT_PUBLIC_API_URL=https://api.locallytrip.com
NEXT_PUBLIC_IMAGES=https://api.locallytrip.com/images
INTERNAL_API_URL=http://backend:3001  # Still internal
```

## Troubleshooting

### Common Issues:
1. **Images not loading**: Check `NEXT_PUBLIC_IMAGES` in `.env`
2. **API calls failing**: Check `NEXT_PUBLIC_API_URL` in `.env`
3. **Container communication**: Use service names (`backend`) not `localhost`

### Debug Commands:
```bash
# Check container logs
docker logs locallytrip-backend
docker logs locallytrip-web

# Check environment variables inside container
docker exec locallytrip-web env | grep NEXT_PUBLIC

# Restart specific service
docker compose restart web
```

## Key Files:
- `docker-compose.yml`: Container orchestration
- `.env`: Environment variables
- `web/src/services/imageService.ts`: Smart URL handling
- `web/src/utils/backend.ts`: API URL utilities