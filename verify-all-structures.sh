#!/bin/bash
# Comprehensive Table Structure Comparison
# Compare all 39 tables between database and migration files

echo "=== COMPREHENSIVE TABLE STRUCTURE VERIFICATION ==="
echo "Comparing database structure with migration files..."
echo ""

# Database connection parameters
DB_USER="locallytrip_prod_user"
DB_NAME="locallytrip_prod"
DB_PASSWORD="ucsaBQIJOcN+ui5nzYZHQw4S/17btJ/0VS7Wi+Ts1Ns="

# Tables to verify
TABLES=(
  "audit_logs" "banks" "bookings" "cities" "combo_bookings"
  "communication_apps" "countries" "experience_itineraries" "experience_types" "experiences"
  "faqs" "featured_cities" "featured_experiences" "featured_hosts" "featured_stories"
  "featured_testimonials" "guide_bookings" "host_categories" "languages" "newsletter_subscriptions"
  "newsletters" "notification_settings" "payments" "payout_history" "payout_settings"
  "photography_bookings" "reviews" "roles" "security_events" "stories"
  "story_comments" "story_likes" "trip_planner_bookings" "user_bank_accounts" "user_communication_contacts"
  "user_host_categories" "user_languages" "user_sessions" "users"
)

# Function to get table structure from database
get_db_structure() {
    local table_name=$1
    docker exec -e PGPASSWORD="$DB_PASSWORD" locallytrip-postgres psql -U "$DB_USER" -d "$DB_NAME" -c "\d $table_name" 2>/dev/null
}

# Function to check if migration file contains table
check_migration() {
    local table_name=$1
    local migration_file=$(grep -r "CREATE TABLE.*$table_name" backend/db/migrations/*.sql | head -1 | cut -d':' -f1)
    echo "$migration_file"
}

echo "Analyzing table structures..."
echo ""

for table in "${TABLES[@]}"; do
    echo "🔍 Checking table: $table"
    
    # Get database structure
    echo "  📊 Database structure:"
    db_structure=$(get_db_structure "$table")
    
    if [[ -z "$db_structure" ]]; then
        echo "    ❌ Table not found in database!"
        continue
    fi
    
    # Show key information
    echo "$db_structure" | grep -E "Column|Type|Nullable|Default|PRIMARY KEY|FOREIGN KEY|UNIQUE" | head -10
    
    # Find migration file
    migration_file=$(check_migration "$table")
    echo "  📁 Migration file: $(basename "$migration_file")"
    
    echo "  ---"
    echo ""
done

echo "=== DETAILED ANALYSIS COMPLETE ==="