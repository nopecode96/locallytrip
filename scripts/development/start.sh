#!/bin/bash

# LocallyTrip Development Startup Script
# This script starts the full development environment

echo "🚀 Starting LocallyTrip Development Environment..."
echo "=================================================="

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Navigate to project root
cd "$(dirname "$0")/../.."

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker compose down

# Clean up docker system (optional - comment out if you want to keep cache)
# echo "🧹 Cleaning up Docker system..."
# docker system prune -f

# Start services with build
echo "🔨 Building and starting services..."
docker compose up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check service health
echo "🔍 Checking service health..."
echo ""

# Check Database
if docker compose exec postgres pg_isready -U locallytrip_prod_user -d locallytrip_prod >/dev/null 2>&1; then
    echo "✅ Database is ready"
else
    echo "❌ Database is not ready"
fi

# Check Backend
if curl -f http://localhost:3001/health >/dev/null 2>&1; then
    echo "✅ Backend API is ready"
else
    echo "❌ Backend API is not ready"
fi

# Check Frontend
if curl -f http://localhost:3000 >/dev/null 2>&1; then
    echo "✅ Frontend is ready"
else
    echo "❌ Frontend is not ready"
fi

# Check Admin
if curl -f http://localhost:3002 >/dev/null 2>&1; then
    echo "✅ Admin panel is ready"
else
    echo "❌ Admin panel is not ready"
fi

echo ""
echo "🌟 LocallyTrip Development Environment Status"
echo "=============================================="
echo "🌐 Frontend:    http://localhost:3000"
echo "🔧 Admin:       http://localhost:3002"
echo "📡 API:         http://localhost:3001"
echo "🗄️  Database:    localhost:5432"
echo ""
echo "📝 Logs: docker compose logs -f"
echo "🛑 Stop: docker compose down"
echo ""
echo "Happy coding! 🎉"
