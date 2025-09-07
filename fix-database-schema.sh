#!/bin/bash

# Fix Database Schema and Seeding Issues
# This script recreates the database with proper schema

set -e

echo "🔧 Fixing LocallyTrip Database Schema Issues..."

# Stop all services
echo "🛑 Stopping all services..."
docker compose -f docker-compose.prod.yml down

# Remove postgres data volume to start fresh
echo "🗑️  Removing existing postgres data..."
docker volume rm locallytrip_postgres_data_prod 2>/dev/null || true

# Remove any orphaned containers
echo "🧹 Cleaning up orphaned containers..."
docker compose -f docker-compose.prod.yml down --remove-orphans

# Start only postgres first to ensure clean initialization
echo "🚀 Starting postgres service..."
docker compose -f docker-compose.prod.yml up postgres -d

# Wait for postgres to be ready
echo "⏳ Waiting for postgres to be ready..."
sleep 30

# Check postgres health
echo "🔍 Checking postgres health..."
docker compose -f docker-compose.prod.yml exec postgres pg_isready -U locallytrip_prod_user -d locallytrip_prod

# Start all services
echo "🚀 Starting all services..."
docker compose -f docker-compose.prod.yml up -d

# Wait for all services to be ready
echo "⏳ Waiting for all services to be ready..."
sleep 60

# Check service status
echo "📊 Checking service status..."
docker compose -f docker-compose.prod.yml ps

# Test database connection
echo "🧪 Testing database connection..."
docker compose -f docker-compose.prod.yml exec postgres psql -U locallytrip_prod_user -d locallytrip_prod -c "SELECT COUNT(*) FROM countries;"

echo "✅ Database fix completed!"
echo ""
echo "📝 Next steps:"
echo "   1. Check logs: docker compose -f docker-compose.prod.yml logs"
echo "   2. Test API: curl http://localhost:3001/health"
echo "   3. Test Frontend: curl http://localhost:3000"
