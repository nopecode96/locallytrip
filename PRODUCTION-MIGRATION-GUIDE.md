# Production Database Migration Steps

## Server Information
- **Database Host**: postgres (Docker container)
- **Database Name**: locallytrip_prod
- **Database User**: locallytrip_prod_user
- **Container Name**: locallytrip-postgres-prod

## Quick Migration (Automated Script)

### Option A: Run Automated Script
```bash
cd /opt/locallytrip
chmod +x run-production-migration.sh
./run-production-migration.sh
```

The script will automatically:
- Pull latest code from GitHub
- Create database backup
- Run all 4 migration files in sequence
- Verify database structure
- Display success/error status

## Manual Migration Steps (Alternative)

### Step 1: Pull Latest Code
```bash
cd /opt/locallytrip
git pull origin main
```

### Step 2: Backup Current Database (Optional but Recommended)
```bash
docker exec -e PGPASSWORD="ucsaBQIJOcN+ui5nzYZHQw4S/17btJ/0VS7Wi+Ts1Ns=" \
  locallytrip-postgres-prod pg_dump \
  -U locallytrip_prod_user \
  -d locallytrip_prod \
  --clean --if-exists > backup_before_migration_$(date +%Y%m%d_%H%M%S).sql
```

### Step 3: Run Migration 001 - Master Data Tables
```bash
docker exec -e PGPASSWORD="ucsaBQIJOcN+ui5nzYZHQw4S/17btJ/0VS7Wi+Ts1Ns=" \
  locallytrip-postgres-prod psql \
  -U locallytrip_prod_user \
  -d locallytrip_prod \
  -f backend/db/migrations/001-create-master-data-tables.sql
```

### Step 4: Run Migration 002 - User & Auth Tables
```bash
docker exec -e PGPASSWORD="ucsaBQIJOcN+ui5nzYZHQw4S/17btJ/0VS7Wi+Ts1Ns=" \
  locallytrip-postgres-prod psql \
  -U locallytrip_prod_user \
  -d locallytrip_prod \
  -f backend/db/migrations/002-create-user-auth-tables.sql
```

### Step 5: Run Migration 003 - Business Logic Tables
```bash
docker exec -e PGPASSWORD="ucsaBQIJOcN+ui5nzYZHQw4S/17btJ/0VS7Wi+Ts1Ns=" \
  locallytrip-postgres-prod psql \
  -U locallytrip_prod_user \
  -d locallytrip_prod \
  -f backend/db/migrations/003-create-business-logic-tables.sql
```

### Step 6: Run Migration 004 - System & Featured Tables
```bash
docker exec -e PGPASSWORD="ucsaBQIJOcN+ui5nzYZHQw4S/17btJ/0VS7Wi+Ts1Ns=" \
  locallytrip-postgres-prod psql \
  -U locallytrip_prod_user \
  -d locallytrip_prod \
  -f backend/db/migrations/004-create-system-featured-tables.sql
```

### Step 7: Verify Database Structure
```bash
# Check table count (should be 39 tables)
docker exec -e PGPASSWORD="ucsaBQIJOcN+ui5nzYZHQw4S/17btJ/0VS7Wi+Ts1Ns=" \
  locallytrip-postgres-prod psql \
  -U locallytrip_prod_user \
  -d locallytrip_prod \
  -c "SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema = 'public';"

# List all tables
docker exec -e PGPASSWORD="ucsaBQIJOcN+ui5nzYZHQw4S/17btJ/0VS7Wi+Ts1Ns=" \
  locallytrip-postgres-prod psql \
  -U locallytrip_prod_user \
  -d locallytrip_prod \
  -c "\dt"
```

### Step 8: Check for Migration Errors (if any occurred)
```bash
# Check PostgreSQL logs for any errors
docker logs locallytrip-postgres-prod --tail=50
```

## Expected Results
- **39 tables** should be created successfully
- All ENUM types should be created
- All foreign key constraints should be in place
- All indexes should be created for performance

## Notes
- Each migration file includes DROP statements, so it's safe to re-run if needed
- Migration files are designed to be idempotent
- If any step fails, check the error message and re-run that specific migration
- The migrations will recreate the exact structure from development database

## Next Steps After Migration
After successful migration, you can proceed with:
1. Database seeding (master data population)
2. Application restart to use new schema
3. Data validation testing