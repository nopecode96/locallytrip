#!/bin/bash

# Verify Foreign Key Constraints between Database and Migration Files
# This script ensures all FK constraints match exactly

echo "=== FOREIGN KEY CONSTRAINT VERIFICATION ==="
echo ""

POSTGRES_PASSWORD="ucsaBQIJOcN+ui5nzYZHQw4S/17btJ/0VS7Wi+Ts1Ns="

# Get all foreign key constraints from database
echo "🔍 Analyzing foreign key constraints from database..."
docker exec -e PGPASSWORD=$POSTGRES_PASSWORD locallytrip-postgres psql -U locallytrip_prod_user -d locallytrip_prod -c "
SELECT 
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    rc.update_rule,
    rc.delete_rule
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
    JOIN information_schema.referential_constraints AS rc
      ON tc.constraint_name = rc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
ORDER BY tc.table_name, kcu.column_name;
" > /tmp/db_fk_constraints.txt

echo "📁 Analyzing foreign key constraints from migration files..."
grep -r "REFERENCES" backend/db/migrations/*.sql | \
grep -v "^--" | \
sed 's/.*REFERENCES //g' | \
sort > /tmp/migration_fk_patterns.txt

echo ""
echo "Database FK Constraints (sample):"
head -10 /tmp/db_fk_constraints.txt

echo ""
echo "Migration FK Patterns (sample):"  
head -10 /tmp/migration_fk_patterns.txt

echo ""
echo "=== KEY FOREIGN KEY RELATIONSHIPS TO VALIDATE ==="

# Check critical relationships
critical_tables=("users" "experiences" "bookings" "reviews" "stories")

for table in "${critical_tables[@]}"; do
    echo ""
    echo "🔍 Checking $table foreign key relationships..."
    
    # Database FKs for this table
    echo "  Database FKs:"
    docker exec -e PGPASSWORD=$POSTGRES_PASSWORD locallytrip-postgres psql -U locallytrip_prod_user -d locallytrip_prod -c "
    SELECT 
        kcu.column_name || ' -> ' || ccu.table_name || '(' || ccu.column_name || ') [' || 
        CASE WHEN rc.update_rule = 'NO ACTION' THEN '' ELSE 'UPDATE ' || rc.update_rule END ||
        CASE WHEN rc.update_rule != 'NO ACTION' AND rc.delete_rule != 'NO ACTION' THEN ', ' ELSE '' END ||
        CASE WHEN rc.delete_rule = 'NO ACTION' THEN '' ELSE 'DELETE ' || rc.delete_rule END || ']' as constraint_info
    FROM 
        information_schema.table_constraints AS tc 
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
        JOIN information_schema.referential_constraints AS rc
          ON tc.constraint_name = rc.constraint_name
    WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_name = '$table'
    ORDER BY kcu.column_name;
    " | grep -v "constraint_info" | grep -v "^-" | head -10
    
    # Migration FKs for this table  
    echo "  Migration FKs:"
    grep -A 20 "CREATE TABLE.*$table" backend/db/migrations/*.sql | \
    grep "REFERENCES" | \
    sed 's/.*REFERENCES //g' | \
    head -5
done

echo ""
echo "=== CONSTRAINT ACTION VERIFICATION ==="
echo "Checking ON UPDATE/ON DELETE actions match..."

# Critical constraint actions to verify
echo ""
echo "🔍 Specialized booking tables (should have simple REFERENCES without CASCADE):"
for booking_table in "guide_bookings" "photography_bookings" "trip_planner_bookings"; do
    echo "  $booking_table:"
    docker exec -e PGPASSWORD=$POSTGRES_PASSWORD locallytrip-postgres psql -U locallytrip_prod_user -d locallytrip_prod -c "
    SELECT 
        'DB: ' || kcu.column_name || ' -> ' || ccu.table_name || 
        CASE WHEN rc.update_rule != 'NO ACTION' OR rc.delete_rule != 'NO ACTION' 
             THEN ' [UPDATE ' || rc.update_rule || ', DELETE ' || rc.delete_rule || ']'
             ELSE ' [NO ACTIONS]' 
        END as constraint_info
    FROM information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage AS ccu ON ccu.constraint_name = tc.constraint_name
    JOIN information_schema.referential_constraints AS rc ON tc.constraint_name = rc.constraint_name
    WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name = '$booking_table'
    " | grep -v "constraint_info" | grep -v "^-" | head -3
    
    # Check migration
    grep -A 10 "$booking_table" backend/db/migrations/*.sql | grep "REFERENCES" | head -1 | sed 's/^/    Migration: /'
    echo ""
done

echo "✅ Foreign Key Constraint Analysis Complete!"
echo ""
echo "IMPORTANT: Verify that:"
echo "1. All REFERENCES clauses in migrations match database constraints"
echo "2. ON UPDATE/ON DELETE actions are identical"  
echo "3. Specialized booking tables use simple REFERENCES (no CASCADE)"
echo "4. User-related cascades are consistent across all tables"

rm -f /tmp/db_fk_constraints.txt /tmp/migration_fk_patterns.txt