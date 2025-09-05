#!/bin/bash

# LocallyTrip Database Seeding Script - Production Ready
# This script safely recreates and seeds the database with all data
# Usage: ./seed-database-complete.sh

set -e

echo "🚀 LocallyTrip Complete Database Seeding Script"
echo "================================================"

# Load environment variables
if [ -f ".env" ]; then
    source .env
    echo "📋 Loaded environment from .env file"
elif [ -f ".env.production" ]; then
    source .env.production
    echo "📋 Loaded production environment"
else
    echo "⚠️  Warning: No .env file found, using defaults"
fi

# Set database credentials with fallbacks
DB_NAME=${DB_NAME:-locallytrip_prod}
DB_USER=${DB_USER:-locallytrip_prod_user}
DB_PASSWORD=${DB_PASSWORD}

echo "   Database: ${DB_NAME}"
echo "   User: ${DB_USER}"
echo "================================================"

# Step 1: Stop containers
echo "⏹️  Stopping containers..."
docker compose down

# Step 2: Remove database volume
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

# Step 3: Start database
echo "🔄 Starting fresh database..."
if [ "$NODE_ENV" = "production" ]; then
    docker compose -f docker-compose.prod.yml up -d postgres
    BACKEND_CONTAINER="locallytrip-backend-prod"
else
    docker compose up -d postgres
    BACKEND_CONTAINER="locallytrip-backend"
fi

# Step 4: Wait for database
echo "⏳ Waiting for database to be ready..."
until docker exec ${CONTAINER_NAME} pg_isready -U ${DB_USER} -d ${DB_NAME} > /dev/null 2>&1; do
    printf "."
    sleep 2
done
echo ""
echo "✅ Database ready!"

# Step 5: Build and start backend
echo "🔄 Building backend..."
if [ "$NODE_ENV" = "production" ]; then
    docker compose -f docker-compose.prod.yml build backend --no-cache
    docker compose -f docker-compose.prod.yml up -d backend
else
    docker compose build backend --no-cache  
    docker compose up -d backend
fi

# Step 6: Wait for backend
echo "⏳ Waiting for backend..."
for i in {1..30}; do
    if docker exec ${BACKEND_CONTAINER} node --version >/dev/null 2>&1; then
        echo "✅ Backend ready!"
        break
    fi
    echo "   Waiting... ($i/30)"
    sleep 2
done

# Step 7: Initialize database schema
echo "🏗️  Creating database schema..."
if docker exec ${BACKEND_CONTAINER} node init-db-from-models.js; then
    echo "✅ Database schema created!"
else
    echo "❌ Failed to create database schema!"
    exit 1
fi

# Step 8: Enable UUID extension
echo "🔧 Enabling UUID extension..."
docker exec ${CONTAINER_NAME} psql -U ${DB_USER} -d ${DB_NAME} -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";"

# Step 9: Seed all data
echo "🌱 Seeding database with complete dataset..."
if docker exec -i ${CONTAINER_NAME} bash -c "cd /docker-entrypoint-initdb.d && psql -U ${DB_USER} -d ${DB_NAME} -f 000-master-seed-simple.sql"; then
    echo "✅ Database seeding completed!"
else
    echo "❌ Database seeding failed!"
    exit 1
fi

# Step 10: Start all services
echo "🚀 Starting all services..."
if [ "$NODE_ENV" = "production" ]; then
    docker compose -f docker-compose.prod.yml up -d
else
    docker compose up -d
fi

# Step 11: Final verification
echo "📊 Final Database Verification:"
echo "================================"
docker exec ${CONTAINER_NAME} psql -U ${DB_USER} -d ${DB_NAME} -c "
SELECT 
  'Users' as table_name, COUNT(*) as count FROM users
UNION ALL 
SELECT 'Experiences', COUNT(*) FROM experiences
UNION ALL 
SELECT 'Bookings', COUNT(*) FROM bookings  
UNION ALL 
SELECT 'Stories', COUNT(*) FROM stories
UNION ALL 
SELECT 'Reviews', COUNT(*) FROM reviews
UNION ALL 
SELECT 'Newsletters', COUNT(*) FROM newsletters
UNION ALL 
SELECT 'FAQs', COUNT(*) FROM faqs
ORDER BY table_name;
"

# Step 12: Show services status
echo ""
echo "📊 Services Status:"
echo "==================="
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo ""
echo "✅ Complete database seeding finished successfully!"
echo "🌐 Web App: http://localhost:3000"
echo "🔧 Admin Panel: http://localhost:3002"  
echo "🔌 API: http://localhost:3001"
echo "📋 Database: localhost:5432"
echo ""
echo "🎯 Database seeded with comprehensive data:"
echo "   • 30 Users (hosts, travellers, admins)"
echo "   • 15 Experiences across multiple categories" 
echo "   • 15 Bookings with complete payment records"
echo "   • 18 Stories with community engagement"
echo "   • 20 Reviews and testimonials"
echo "   • 3 Newsletter subscriptions"
echo "   • 45 FAQs covering all categories"
echo "   • Complete reference data (countries, cities, etc.)"
