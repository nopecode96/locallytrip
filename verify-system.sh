#!/bin/bash

# Complete System Verification Script
# Check containers, database, and schema

set -e

echo "🔍 COMPLETE SYSTEM VERIFICATION"
echo "==============================="

# Load environment safely (optional for verification)
if [ -f .env ]; then
    set -a
    source .env 2>/dev/null || true
    set +a
fi

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 System Status Check${NC}"
echo "-------------------"

# Check if containers are running
echo -e "${YELLOW}1. Container Status:${NC}"
if docker compose -f docker-compose.prod.yml ps | grep -q "Up"; then
    echo -e "   ${GREEN}✅ Containers are running${NC}"
else
    echo -e "   ${RED}❌ Containers not running${NC}"
    echo "   Run: docker compose -f docker-compose.prod.yml up -d"
fi

echo ""
echo -e "${YELLOW}2. Backend Container Code Check:${NC}"
if docker exec locallytrip-backend-prod test -f /app/init-db-from-models.js; then
    echo -e "   ${GREEN}✅ init-db-from-models.js exists${NC}"
    echo "   📁 First 3 lines:"
    docker exec locallytrip-backend-prod head -3 /app/init-db-from-models.js | sed 's/^/   /'
else
    echo -e "   ${RED}❌ init-db-from-models.js not found${NC}"
fi

echo ""
echo -e "${YELLOW}3. Database Connection:${NC}"
if docker exec locallytrip-postgres-prod pg_isready -U locallytrip_prod_user -d locallytrip_prod > /dev/null 2>&1; then
    echo -e "   ${GREEN}✅ Database connection OK${NC}"
else
    echo -e "   ${RED}❌ Database connection failed${NC}"
fi

echo ""
echo -e "${YELLOW}4. Database Schema:${NC}"
TABLE_COUNT=$(docker exec locallytrip-postgres-prod psql -U locallytrip_prod_user -d locallytrip_prod -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" 2>/dev/null | tr -d ' ' || echo "0")

if [ "$TABLE_COUNT" -gt "0" ]; then
    echo -e "   ${GREEN}✅ Tables found: $TABLE_COUNT${NC}"
    echo "   📋 Sample tables:"
    docker exec locallytrip-postgres-prod psql -U locallytrip_prod_user -d locallytrip_prod -c "SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename LIMIT 5;" 2>/dev/null | grep -E '^\s+\w+' | head -5 | sed 's/^/   /'
else
    echo -e "   ${RED}❌ No tables found${NC}"
    echo "   🛠️  Need to run schema creation"
fi

echo ""
echo -e "${YELLOW}5. Seeding Data Status:${NC}"
if [ "$TABLE_COUNT" -gt "0" ]; then
    # Check if tables have data
    USER_COUNT=$(docker exec locallytrip-postgres-prod psql -U locallytrip_prod_user -d locallytrip_prod -t -c "SELECT COUNT(*) FROM users;" 2>/dev/null | tr -d ' ' || echo "0")
    
    if [ "$USER_COUNT" -gt "0" ]; then
        echo -e "   ${GREEN}✅ Data found - Users: $USER_COUNT${NC}"
        
        # Check other key tables
        CITY_COUNT=$(docker exec locallytrip-postgres-prod psql -U locallytrip_prod_user -d locallytrip_prod -t -c "SELECT COUNT(*) FROM cities;" 2>/dev/null | tr -d ' ' || echo "0")
        EXP_COUNT=$(docker exec locallytrip-postgres-prod psql -U locallytrip_prod_user -d locallytrip_prod -t -c "SELECT COUNT(*) FROM experiences;" 2>/dev/null | tr -d ' ' || echo "0")
        
        echo -e "   📊 Cities: $CITY_COUNT, Experiences: $EXP_COUNT"
    else
        echo -e "   ${YELLOW}⚠️  Tables exist but no data${NC}"
        echo "   🛠️  Need to run seeding"
    fi
else
    echo -e "   ${RED}❌ Cannot check data - no tables${NC}"
fi

echo ""
echo -e "${BLUE}🎯 RECOMMENDED ACTIONS${NC}"
echo "====================="

if [ "$TABLE_COUNT" -eq "0" ]; then
    echo -e "1. ${YELLOW}Run schema creation:${NC}"
    echo "   ./fix-container.sh"
elif [ "${USER_COUNT:-0}" -eq "0" ]; then
    echo -e "1. ${YELLOW}Run database seeding:${NC}"
    echo "   docker exec locallytrip-postgres-prod psql -U locallytrip_prod_user -d locallytrip_prod -f /docker-entrypoint-initdb.d/000-master-seed-simple.sql"
else
    echo -e "${GREEN}🎉 System looks good! All components working.${NC}"
    echo ""
    echo -e "${BLUE}💻 Access URLs:${NC}"
    echo "   Web: http://your-server-ip:3000"
    echo "   Admin: http://your-server-ip:3002" 
    echo "   API: http://your-server-ip:3001"
fi

echo ""
echo -e "${BLUE}📋 Quick Commands:${NC}"
echo "   Rebuild containers: ./fix-container.sh"
echo "   Check logs: docker logs locallytrip-backend-prod"
echo "   Run seeding: docker exec locallytrip-postgres-prod psql -U locallytrip_prod_user -d locallytrip_prod -f /docker-entrypoint-initdb.d/000-master-seed-simple.sql"
echo "   Verify tables: docker exec locallytrip-postgres-prod psql -U locallytrip_prod_user -d locallytrip_prod -c '\\dt'"
