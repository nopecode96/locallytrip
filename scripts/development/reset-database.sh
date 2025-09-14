#!/bin/bash

# LocallyTrip Database Reset and Seed Script
# This script resets the database and populates it with sample data

echo "🗄️  LocallyTrip Database Reset & Seed"
echo "====================================="

# Navigate to project root
cd "$(dirname "$0")/../.."

# Warning message
echo "⚠️  WARNING: This will reset all database data!"
echo ""
read -p "Are you sure you want to continue? (y/N): " confirm

if [[ $confirm != [yY] && $confirm != [yY][eE][sS] ]]; then
    echo "❌ Operation cancelled."
    exit 0
fi

echo ""
echo "🔄 Resetting database..."

# Stop services
echo "🛑 Stopping services..."
docker compose down

# Remove database volume
echo "🗑️  Removing database volume..."
docker volume rm locallytrip_postgres_data 2>/dev/null || true

# Start only database first
echo "🗄️  Starting database..."
docker compose up -d postgres

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Check if database is ready
max_attempts=30
attempt=1
while [ $attempt -le $max_attempts ]; do
    if docker compose exec postgres pg_isready -U locallytrip_prod_user -d locallytrip_prod >/dev/null 2>&1; then
        echo "✅ Database is ready!"
        break
    fi
    echo "⏳ Attempt $attempt/$max_attempts - waiting for database..."
    sleep 2
    ((attempt++))
done

if [ $attempt -gt $max_attempts ]; then
    echo "❌ Database failed to start. Please check logs: docker compose logs postgres"
    exit 1
fi

# Start backend to initialize schema
echo "🔨 Starting backend to initialize schema..."
docker compose up -d backend

# Wait for backend to be ready
echo "⏳ Waiting for backend to initialize..."
sleep 15

# Check backend health
max_attempts=20
attempt=1
while [ $attempt -le $max_attempts ]; do
    if curl -f http://localhost:3001/health >/dev/null 2>&1; then
        echo "✅ Backend is ready!"
        break
    fi
    echo "⏳ Attempt $attempt/$max_attempts - waiting for backend..."
    sleep 3
    ((attempt++))
done

# Run database seeding
echo "🌱 Seeding database with sample data..."
if [ -f "./backend/db/seed/01-seed-basic-data.sql" ]; then
    docker compose exec postgres psql -U locallytrip_prod_user -d locallytrip_prod -f /docker-entrypoint-initdb.d/01-seed-basic-data.sql
    echo "✅ Basic data seeded"
fi

if [ -f "./backend/db/seed/02-seed-complex-data.sql" ]; then
    docker compose exec postgres psql -U locallytrip_prod_user -d locallytrip_prod -f /docker-entrypoint-initdb.d/02-seed-complex-data.sql
    echo "✅ Complex data seeded"
fi

# Start all services
echo "🚀 Starting all services..."
docker compose up -d

echo ""
echo "✅ Database reset and seeding completed!"
echo ""
echo "🌐 Frontend:    http://localhost:3000"
echo "🔧 Admin:       http://localhost:3002"
echo "📡 API:         http://localhost:3001"
echo ""
echo "📝 Check status: ./scripts/development/status.sh"
