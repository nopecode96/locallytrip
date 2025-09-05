#!/bin/bash

# Manual Rebuild & Schema Creation Script
# For fixing container cache issues

set -e

echo "🔧 Manual Container Rebuild & Schema Creation"
echo "============================================="

# Load environment
if [ -f .env ]; then
    set -a  # automatically export all variables
    source .env
    set +a  # stop auto-export
    echo "📋 Environment loaded from .env"
else
    echo "❌ .env file not found!"
    exit 1
fi

echo ""
echo "🛑 Step 1: Stop all containers"
echo "-------------------------------"
docker compose -f docker-compose.prod.yml down
echo "✅ Containers stopped"

echo ""
echo "🏗️ Step 2: Rebuild backend with latest code"
echo "-------------------------------------------"
echo "🔄 Building backend container (no cache)..."
docker compose -f docker-compose.prod.yml build backend --no-cache
echo "✅ Backend container rebuilt"

echo ""
echo "🚀 Step 3: Start containers"
echo "----------------------------"
docker compose -f docker-compose.prod.yml up -d postgres
echo "⏳ Waiting for postgres to be ready..."
sleep 10

docker compose -f docker-compose.prod.yml up -d backend
echo "⏳ Waiting for backend to be ready..."
sleep 15

echo "✅ Containers started"

echo ""
echo "🔍 Step 4: Verify backend container has latest code"
echo "--------------------------------------------------"
echo "📁 Checking file in container:"
docker exec locallytrip-backend-prod head -5 /app/init-db-from-models.js
echo ""

echo "🏗️ Step 5: Create database schema"
echo "---------------------------------"
if docker exec locallytrip-backend-prod node init-db-from-models.js; then
    echo "✅ Schema creation completed!"
    
    # Verify tables
    TABLE_COUNT=$(docker exec locallytrip-postgres-prod psql -U locallytrip_prod_user -d locallytrip_prod -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" | tr -d ' ')
    echo "📊 Tables created: $TABLE_COUNT"
    
    if [ "$TABLE_COUNT" -gt "0" ]; then
        echo "🎉 SUCCESS! Database schema created successfully!"
        echo "📋 Tables:"
        docker exec locallytrip-postgres-prod psql -U locallytrip_prod_user -d locallytrip_prod -c "SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename LIMIT 10;"
        
        echo ""
        echo "🌱 Next step: Run seeding"
        echo "------------------------"
        echo "   docker exec locallytrip-postgres-prod psql -U locallytrip_prod_user -d locallytrip_prod -f /docker-entrypoint-initdb.d/000-master-seed-simple.sql"
    else
        echo "❌ No tables found after schema creation"
    fi
else
    echo "❌ Schema creation failed"
    echo "📋 Backend logs:"
    docker logs locallytrip-backend-prod | tail -20
fi

echo ""
echo "🎯 Manual rebuild completed!"
