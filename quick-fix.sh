#!/bin/bash

# Quick Fix Script - No Environment Dependencies
# Simply rebuild containers and create schema

set -e

echo "🔧 QUICK DATABASE FIX"
echo "===================="

echo ""
echo "🛑 Step 1: Stop containers"
docker compose -f docker-compose.prod.yml down
echo "✅ Stopped"

echo ""
echo "🏗️ Step 2: Rebuild backend (no cache)"
docker compose -f docker-compose.prod.yml build backend --no-cache
echo "✅ Rebuilt"

echo ""
echo "🚀 Step 3: Start containers"
docker compose -f docker-compose.prod.yml up -d postgres
echo "⏳ Waiting for postgres..."
sleep 10

docker compose -f docker-compose.prod.yml up -d backend
echo "⏳ Waiting for backend..."
sleep 15

echo ""
echo "🏗️ Step 4: Create schema"
echo "Running: node init-db-from-models.js"

if docker exec locallytrip-backend-prod node init-db-from-models.js; then
    echo "✅ Schema created!"
    
    # Quick table count
    TABLE_COUNT=$(docker exec locallytrip-postgres-prod psql -U locallytrip_prod_user -d locallytrip_prod -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" | tr -d ' ')
    echo "📊 Tables: $TABLE_COUNT"
    
    if [ "$TABLE_COUNT" -gt "0" ]; then
        echo ""
        echo "🎉 SUCCESS! Ready for seeding:"
        echo "   docker exec locallytrip-postgres-prod psql -U locallytrip_prod_user -d locallytrip_prod -f /docker-entrypoint-initdb.d/000-master-seed-simple.sql"
    fi
else
    echo "❌ Schema creation failed!"
    echo "📋 Logs:"
    docker logs locallytrip-backend-prod | tail -10
fi

echo ""
echo "🏁 Quick fix completed!"
