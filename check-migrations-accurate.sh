#!/bin/bash
# More accurate migration coverage verification
# This script checks for exact table name matches only

echo "=== ACCURATE MIGRATION COVERAGE VERIFICATION ==="

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

MISSING_COUNT=0
DUPLICATE_COUNT=0
FOUND_COUNT=0

for table in "${TABLES[@]}"; do
  echo "Checking table: $table"
  
  # Use more precise pattern matching
  pattern="CREATE TABLE[[:space:]]+(IF NOT EXISTS[[:space:]]+)?$table[[:space:]]*\("
  count=$(grep -rE "$pattern" backend/db/migrations/*.sql | wc -l)
  
  if [ $count -eq 0 ]; then
    echo "  ❌ MISSING: No migration found for $table"
    ((MISSING_COUNT++))
  elif [ $count -eq 1 ]; then
    echo "  ✅ FOUND: $table has migration"
    grep -rE "$pattern" backend/db/migrations/*.sql | head -1
    ((FOUND_COUNT++))
  else
    echo "  ⚠️  DUPLICATE: $table found in $count files"
    grep -rE "$pattern" backend/db/migrations/*.sql
    ((DUPLICATE_COUNT++))
  fi
  echo ""
done

echo "=== SUMMARY ==="
echo "✅ Found: $FOUND_COUNT tables"
echo "❌ Missing: $MISSING_COUNT tables"
echo "⚠️  Duplicated: $DUPLICATE_COUNT tables"
echo "Total verified: $(($FOUND_COUNT + $MISSING_COUNT + $DUPLICATE_COUNT)) / ${#TABLES[@]}"

if [ $MISSING_COUNT -eq 0 ] && [ $DUPLICATE_COUNT -eq 0 ]; then
  echo ""
  echo "🎉 ALL TABLES HAVE PROPER MIGRATION COVERAGE!"
else
  echo ""
  echo "⚠️  Issues found. Please fix missing/duplicate tables before deployment."
fi