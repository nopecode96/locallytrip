#!/bin/bash

# Direct Database Schema Creation Script
# This bypasses the setup script and creates tables directly

set -e

echo "🚀 Direct Database Schema Creation"
echo "================================="

# Load environment
if [ -f .env ]; then
    export $(cat .env | grep -v '#' | xargs)
    echo "📋 Environment loaded from .env"
else
    echo "❌ .env file not found!"
    exit 1
fi

# Set variables
CONTAINER_NAME="locallytrip-postgres-prod"
BACKEND_CONTAINER="locallytrip-backend-prod"
DB_NAME="locallytrip_prod"
DB_USER="locallytrip_prod_user"

echo "🗄️ Database: $DB_NAME"
echo "👤 User: $DB_USER"
echo "🐳 Containers: $CONTAINER_NAME, $BACKEND_CONTAINER"
echo ""

# Check if containers are running
if ! docker ps -q -f name=$CONTAINER_NAME | grep -q .; then
    echo "❌ Postgres container not running. Start it first:"
    echo "   docker compose -f docker-compose.prod.yml up -d postgres"
    exit 1
fi

if ! docker ps -q -f name=$BACKEND_CONTAINER | grep -q .; then
    echo "❌ Backend container not running. Start it first:"
    echo "   docker compose -f docker-compose.prod.yml up -d backend"
    exit 1
fi

echo "✅ Containers are running"
echo ""

# Method 1: Try init script
echo "🔧 Method 1: Running init-db-from-models.js"
echo "-------------------------------------------"
if docker exec $BACKEND_CONTAINER node init-db-from-models.js; then
    echo "✅ Init script completed"
else
    echo "❌ Init script failed"
fi

echo ""

# Method 2: Manual verification
echo "🔍 Method 2: Manual verification"  
echo "--------------------------------"
TABLE_COUNT=$(docker exec $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" | tr -d ' ' 2>/dev/null || echo "0")
echo "📊 Tables found: $TABLE_COUNT"

if [ "$TABLE_COUNT" -gt "0" ]; then
    echo "✅ Tables exist! Showing first 10:"
    docker exec $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME -c "SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename LIMIT 10;"
else
    echo "❌ No tables found"
fi

echo ""

# Method 3: Direct SQL creation (fallback)
echo "🛠️  Method 3: Direct SQL table creation"
echo "--------------------------------------"

if [ "$TABLE_COUNT" -eq "0" ]; then
    echo "Creating basic tables manually..."
    
    # Create a few essential tables manually to test
    docker exec $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME -c "
    CREATE TABLE IF NOT EXISTS countries (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        code VARCHAR(10) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS cities (
        id SERIAL PRIMARY KEY, 
        name VARCHAR(255) NOT NULL,
        country_id INTEGER REFERENCES countries(id),
        latitude DECIMAL(10,8),
        longitude DECIMAL(11,8),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    "
    
    if [ $? -eq 0 ]; then
        echo "✅ Manual table creation successful"
        # Verify
        NEW_COUNT=$(docker exec $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" | tr -d ' ')
        echo "📊 Tables after manual creation: $NEW_COUNT"
    else
        echo "❌ Manual table creation failed"
    fi
else
    echo "⏭️  Skipping manual creation - tables already exist"
fi

echo ""
echo "🎯 Direct schema creation completed!"
echo "   Next step: Run seeding with ./setup-fresh-database.sh or manually"
