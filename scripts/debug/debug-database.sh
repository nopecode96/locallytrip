#!/bin/bash

# Quick Database Debug Script
# Check database status and recreate if needed

echo "🔍 LocallyTrip Database Debug..."

# Check if postgres container is running
if ! docker compose -f docker-compose.prod.yml ps postgres | grep -q "running"; then
    echo "❌ Postgres container is not running"
    echo "🚀 Starting postgres..."
    docker compose -f docker-compose.prod.yml up postgres -d
    sleep 20
fi

# Check database connection
echo "🧪 Testing database connection..."
if docker compose -f docker-compose.prod.yml exec postgres pg_isready -U locallytrip_prod_user -d locallytrip_prod; then
    echo "✅ Database is accessible"
    
    # Check if tables exist
    echo "🔍 Checking if tables exist..."
    TABLE_COUNT=$(docker compose -f docker-compose.prod.yml exec postgres psql -U locallytrip_prod_user -d locallytrip_prod -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" | tr -d ' ')
    
    if [ "$TABLE_COUNT" -eq 0 ]; then
        echo "❌ No tables found in database"
        echo "🔧 Need to run schema creation"
        
        # Run schema creation manually
        echo "🏗️  Creating schema..."
        docker compose -f docker-compose.prod.yml exec postgres psql -U locallytrip_prod_user -d locallytrip_prod -f /docker-entrypoint-initdb.d/000-create-schema.sql
        
        # Run basic seeding
        echo "📊 Running basic seeding..."
        docker compose -f docker-compose.prod.yml exec postgres psql -U locallytrip_prod_user -d locallytrip_prod -f /docker-entrypoint-initdb.d/001-countries.sql
        docker compose -f docker-compose.prod.yml exec postgres psql -U locallytrip_prod_user -d locallytrip_prod -f /docker-entrypoint-initdb.d/002-cities.sql
        docker compose -f docker-compose.prod.yml exec postgres psql -U locallytrip_prod_user -d locallytrip_prod -f /docker-entrypoint-initdb.d/003-languages.sql
        docker compose -f docker-compose.prod.yml exec postgres psql -U locallytrip_prod_user -d locallytrip_prod -f /docker-entrypoint-initdb.d/004-roles.sql
        
    else
        echo "✅ Found $TABLE_COUNT tables in database"
        
        # Check countries table
        COUNTRY_COUNT=$(docker compose -f docker-compose.prod.yml exec postgres psql -U locallytrip_prod_user -d locallytrip_prod -t -c "SELECT COUNT(*) FROM countries;" | tr -d ' ')
        echo "📊 Countries in database: $COUNTRY_COUNT"
    fi
    
else
    echo "❌ Cannot connect to database"
    echo "🔧 Try: ./fix-database-schema.sh"
fi

echo ""
echo "🏁 Debug completed. Current status:"
docker compose -f docker-compose.prod.yml ps
