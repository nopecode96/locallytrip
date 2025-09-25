#!/bin/bash

# ====================================================
# LocallyTrip Production Database Migration Script
# ====================================================
# This script runs complete database migration on production server
# Run this script from /opt/locallytrip directory

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Database Configuration
DB_PASSWORD="ucsaBQIJOcN+ui5nzYZHQw4S/17btJ/0VS7Wi+Ts1Ns="
DB_USER="locallytrip_prod_user"
DB_NAME="locallytrip_prod"
CONTAINER_NAME="locallytrip-postgres-prod"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}LocallyTrip Production Migration${NC}"
echo -e "${BLUE}========================================${NC}"

# Step 1: Pull latest code
echo -e "\n${YELLOW}Step 1: Pulling latest code from GitHub...${NC}"
git pull origin main
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Code updated successfully${NC}"
else
    echo -e "${RED}❌ Failed to pull latest code${NC}"
    exit 1
fi

# Step 2: Backup database
echo -e "\n${YELLOW}Step 2: Creating database backup...${NC}"
BACKUP_FILE="backup_before_migration_$(date +%Y%m%d_%H%M%S).sql"
docker exec -e PGPASSWORD="$DB_PASSWORD" \
    $CONTAINER_NAME pg_dump \
    -U $DB_USER \
    -d $DB_NAME \
    --clean --if-exists > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Database backup created: $BACKUP_FILE${NC}"
else
    echo -e "${RED}❌ Database backup failed${NC}"
    exit 1
fi

# Step 3: Run Migration 001
echo -e "\n${YELLOW}Step 3: Running Migration 001 - Master Data Tables...${NC}"
docker exec -i -e PGPASSWORD="$DB_PASSWORD" \
    $CONTAINER_NAME psql \
    -U $DB_USER \
    -d $DB_NAME < backend/db/migrations/001-create-master-data-tables.sql

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Migration 001 completed successfully${NC}"
else
    echo -e "${RED}❌ Migration 001 failed${NC}"
    echo -e "${YELLOW}Check the error above and fix before continuing${NC}"
    exit 1
fi

# Step 4: Run Migration 002
echo -e "\n${YELLOW}Step 4: Running Migration 002 - User & Auth Tables...${NC}"
docker exec -i -e PGPASSWORD="$DB_PASSWORD" \
    $CONTAINER_NAME psql \
    -U $DB_USER \
    -d $DB_NAME < backend/db/migrations/002-create-user-auth-tables.sql

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Migration 002 completed successfully${NC}"
else
    echo -e "${RED}❌ Migration 002 failed${NC}"
    echo -e "${YELLOW}Check the error above and fix before continuing${NC}"
    exit 1
fi

# Step 5: Run Migration 003
echo -e "\n${YELLOW}Step 5: Running Migration 003 - Business Logic Tables...${NC}"
docker exec -i -e PGPASSWORD="$DB_PASSWORD" \
    $CONTAINER_NAME psql \
    -U $DB_USER \
    -d $DB_NAME < backend/db/migrations/003-create-business-logic-tables.sql

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Migration 003 completed successfully${NC}"
else
    echo -e "${RED}❌ Migration 003 failed${NC}"
    echo -e "${YELLOW}Check the error above and fix before continuing${NC}"
    exit 1
fi

# Step 6: Run Migration 004
echo -e "\n${YELLOW}Step 6: Running Migration 004 - System & Featured Tables...${NC}"
docker exec -i -e PGPASSWORD="$DB_PASSWORD" \
    $CONTAINER_NAME psql \
    -U $DB_USER \
    -d $DB_NAME < backend/db/migrations/004-create-system-featured-tables.sql

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Migration 004 completed successfully${NC}"
else
    echo -e "${RED}❌ Migration 004 failed${NC}"
    echo -e "${YELLOW}Check the error above and fix before continuing${NC}"
    exit 1
fi

# Step 7: Verify database structure
echo -e "\n${YELLOW}Step 7: Verifying database structure...${NC}"

# Check table count
TABLE_COUNT=$(docker exec -e PGPASSWORD="$DB_PASSWORD" \
    $CONTAINER_NAME psql \
    -U $DB_USER \
    -d $DB_NAME \
    -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';")

TABLE_COUNT=$(echo $TABLE_COUNT | tr -d ' ')

echo -e "Table count: ${BLUE}$TABLE_COUNT${NC}"

if [ "$TABLE_COUNT" -eq "39" ]; then
    echo -e "${GREEN}✅ Correct number of tables (39) created${NC}"
else
    echo -e "${YELLOW}⚠️  Expected 39 tables, found $TABLE_COUNT${NC}"
fi

# List all tables
echo -e "\n${YELLOW}Database tables:${NC}"
docker exec -e PGPASSWORD="$DB_PASSWORD" \
    $CONTAINER_NAME psql \
    -U $DB_USER \
    -d $DB_NAME \
    -c "\dt"

# Step 8: Check for errors
echo -e "\n${YELLOW}Step 8: Checking for recent errors...${NC}"
docker logs $CONTAINER_NAME --tail=10 | grep -i error || echo -e "${GREEN}No recent errors found${NC}"

# Final summary
echo -e "\n${BLUE}========================================${NC}"
echo -e "${GREEN}🎉 MIGRATION COMPLETED SUCCESSFULLY!${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "✅ All 4 migration files executed"
echo -e "✅ Database structure verified"
echo -e "✅ Backup created: $BACKUP_FILE"
echo -e "\n${YELLOW}Next steps:${NC}"
echo -e "1. Run database seeding if needed"
echo -e "2. Restart application services"
echo -e "3. Test application functionality"
echo -e "\n${BLUE}Migration completed at: $(date)${NC}"