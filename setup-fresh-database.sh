#!/bin/bash

# LocallyTrip Fresh Database Setup Script
# This script sets up a fresh database using the synchronized seed files
# Supports both development and production environments

set -e

# Load environment variables
if [ -f ".env" ]; then
    source .env
    echo "📋 Loaded environment from .env file"
elif [ -f ".env.production" ]; then
    source .env.production
    echo "📋 Loaded production environment from .env.production file"
else
    echo "⚠️  Warning: No .env file found, using default development values"
fi

# Set database credentials (fallback to development if not set)
DB_NAME=${DB_NAME:-locallytrip}
DB_USER=${DB_USER:-locallytrip_user}
DB_PASSWORD=${DB_PASSWORD:-locallytrip_password}

echo "🚀 Starting LocallyTrip Fresh Database Setup..."
echo "   Database: ${DB_NAME}"
echo "   User: ${DB_USER}"
echo "---------------------------------------------"

# Stop all containers
echo "⏹️  Stopping existing containers..."
docker compose down

# Remove old database volume (adjust volume name based on environment)
echo "🗑️  Removing old database volume..."
if [ "$NODE_ENV" = "production" ]; then
    docker volume rm locallytrip_postgres_data_prod 2>/dev/null || echo "Volume doesn't exist, continuing..."
    CONTAINER_NAME="locallytrip-postgres-prod"
    COMPOSE_FILE="docker-compose.prod.yml"
else
    docker volume rm locallytrip_postgres_data 2>/dev/null || echo "Volume doesn't exist, continuing..."
    CONTAINER_NAME="locallytrip-postgres"
    COMPOSE_FILE="docker-compose.yml"
fi

# Start database with fresh data
echo "🔄 Starting fresh database with seed data..."
if [ "$NODE_ENV" = "production" ]; then
    docker compose -f docker-compose.prod.yml up -d postgres
    BACKEND_CONTAINER="locallytrip-backend-prod"
else
    docker compose up -d postgres
    BACKEND_CONTAINER="locallytrip-backend"
fi

# Wait for database to be ready
echo "⏳ Waiting for database to initialize..."
until docker exec ${CONTAINER_NAME} pg_isready -U ${DB_USER} -d ${DB_NAME} > /dev/null 2>&1; do
    printf "."
    sleep 2
done

echo ""
echo "✅ Database is ready!"

# Run database initialization and seeding
echo "🌱 Initializing database schema and seeding data..."
echo "---------------------------------------------"

# Initialize database from models (create tables)
echo "📋 Creating database tables from models..."
echo "🔄 Building backend container with latest code..."
if [ "$NODE_ENV" = "production" ]; then
    # Force rebuild backend container to get latest code
    docker compose -f docker-compose.prod.yml build backend --no-cache
    docker compose -f docker-compose.prod.yml up -d backend
else
    docker compose build backend --no-cache
    docker compose up -d backend
fi

echo "⏳ Waiting for backend to be ready..."
# Wait for backend container to be healthy
for i in {1..30}; do
    if docker exec ${BACKEND_CONTAINER} node --version >/dev/null 2>&1; then
        echo "✅ Backend container is ready!"
        break
    fi
    echo "   Waiting for backend container... ($i/30)"
    sleep 2
done

# Initialize database schema
echo "🏗️ Initializing database schema from Sequelize models..."
if docker exec ${BACKEND_CONTAINER} node init-db-from-models.js; then
    echo "✅ Database initialization script completed!"
    
    # Wait a bit for any final commits to be flushed
    sleep 3
    
    # Verify tables were actually created
    echo "🔍 Verifying tables were created..."
    TABLE_COUNT=$(docker exec ${CONTAINER_NAME} psql -U ${DB_USER} -d ${DB_NAME} -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" | tr -d ' ')
    if [ "$TABLE_COUNT" -gt "0" ]; then
        echo "✅ Database tables verified successfully! ($TABLE_COUNT tables created)"
        docker exec ${CONTAINER_NAME} psql -U ${DB_USER} -d ${DB_NAME} -c "SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;" | head -10
    else
        echo "❌ Tables verification failed! No tables found."
        echo "   Debug info - checking what exists:"
        docker exec ${CONTAINER_NAME} psql -U ${DB_USER} -d ${DB_NAME} -c "\l"
        docker exec ${CONTAINER_NAME} psql -U ${DB_USER} -d ${DB_NAME} -c "\dt"
        exit 1
    fi
else
    echo "❌ Failed to create database tables!"
    echo "   Check backend logs: docker logs ${BACKEND_CONTAINER}"
    exit 1
fi

# Run database seeding after tables are created
echo "🌱 Seeding database with comprehensive demo data..."
echo "  📋 Running master seed script manually..."

if [ -f "backend/db/seed/000-master-seed-simple.sql" ]; then
    echo "  ✅ Executing master seed script with working directory context..."
    # Change to seed directory for relative paths
    docker exec -i ${CONTAINER_NAME} bash -c "cd /docker-entrypoint-initdb.d && psql -U ${DB_USER} -d ${DB_NAME} -f 000-master-seed-simple.sql"
    echo "  📈 Seed execution completed with record counts displayed"
else
    echo "  ❌ Error: 000-master-seed-simple.sql not found!"
    exit 1
fi

echo "🎯 Comprehensive database seeding completed!"

# Start all services
echo "🚀 Starting all services..."
if [ "$NODE_ENV" = "production" ]; then
    docker compose -f docker-compose.prod.yml up -d
else
    docker compose up -d
fi

# Show status
echo "📊 Container Status:"
echo "---------------------------------------------"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo ""
echo "✅ Fresh database setup completed with comprehensive demo data!"
echo "🌐 Web App: http://localhost:3000"
echo "🔧 Admin Panel: http://localhost:3002"  
echo "🔌 API: http://localhost:3001"
echo "📋 Database: localhost:5432"
echo ""
echo "🎯 Database populated with:"
echo "   • 246 Countries & 100+ Cities"
echo "   • 15+ Users across all roles (traveller/host/admin/etc)"
echo "   • 20+ Tour experiences with detailed itineraries"
echo "   • Complete booking & payment records"
echo "   • User stories, reviews & testimonials"
echo "   • FAQs, featured content & platform data"
