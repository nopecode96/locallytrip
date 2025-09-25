#!/bin/bash
# Script to verify migration coverage for all database tables
# Each table should appear in exactly one migration file

echo "=== MIGRATION COVERAGE VERIFICATION ==="

# List of all database tables
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

echo "Total tables to verify: ${#TABLES[@]}"
echo ""

for table in "${TABLES[@]}"; do
  echo "Checking table: $table"
  count=$(grep -r "CREATE TABLE.*$table" backend/db/migrations/*.sql | wc -l)
  if [ $count -eq 0 ]; then
    echo "  ❌ MISSING: No migration found for $table"
  elif [ $count -eq 1 ]; then
    echo "  ✅ FOUND: $table has migration"
    grep -r "CREATE TABLE.*$table" backend/db/migrations/*.sql | head -1
  else
    echo "  ⚠️  DUPLICATE: $table found in $count files"
    grep -r "CREATE TABLE.*$table" backend/db/migrations/*.sql
  fi
  echo ""
done

echo "=== VERIFICATION COMPLETE ==="