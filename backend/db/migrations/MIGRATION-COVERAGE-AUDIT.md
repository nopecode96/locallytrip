-- Migration Coverage Audit Report
-- Date: 2025-01-03
-- Purpose: Verify all 39 database tables have proper migration coverage

-- Table Coverage Verification:
-- ✅ = Table found in migration files
-- ❌ = Table missing from migration files

/* Database Tables (39 total):

✅ audit_logs                    -> 025-create-system-audit-tables.sql
✅ banks                        -> 018-create-basic-system-tables.sql
✅ bookings                     -> 021-create-business-logic-tables-part1.sql
✅ cities                       -> 019-create-core-system-tables.sql
✅ combo_bookings               -> 024-create-user-relations-and-booking-tables.sql
✅ communication_apps           -> 008-create-communication-apps.sql
✅ countries                    -> 019-create-core-system-tables.sql
✅ experience_itineraries       -> 023-create-content-management-tables.sql
✅ experience_types             -> 019-create-core-system-tables.sql
✅ experiences                  -> 021-create-business-logic-tables-part1.sql
✅ faqs                         -> 023-create-content-management-tables.sql
✅ featured_cities              -> 025-create-system-audit-tables.sql
✅ featured_experiences         -> 011-create-featured-tables.sql
✅ featured_hosts               -> 011-create-featured-tables.sql
✅ featured_stories             -> 011-create-featured-tables.sql
✅ featured_testimonials        -> 025-create-system-audit-tables.sql
✅ guide_bookings               -> 024-create-user-relations-and-booking-tables.sql
✅ host_categories              -> 019-create-core-system-tables.sql
✅ languages                    -> 019-create-core-system-tables.sql
✅ newsletter_subscriptions     -> 018-create-basic-system-tables.sql
✅ newsletters                  -> 023-create-content-management-tables.sql
✅ notification_settings        -> 007-create-notification-settings.sql
✅ payments                     -> 021-create-business-logic-tables-part1.sql
✅ payout_history               -> 026-create-payout-tables.sql
✅ payout_settings              -> 026-create-payout-tables.sql
✅ photography_bookings         -> 024-create-user-relations-and-booking-tables.sql
✅ reviews                      -> 022-create-business-logic-tables-part2.sql
✅ roles                        -> 019-create-core-system-tables.sql
✅ security_events              -> 025-create-system-audit-tables.sql
✅ stories                      -> 022-create-business-logic-tables-part2.sql
✅ story_comments               -> 022-create-business-logic-tables-part2.sql
✅ story_likes                  -> 022-create-business-logic-tables-part2.sql
✅ trip_planner_bookings        -> 024-create-user-relations-and-booking-tables.sql
✅ user_bank_accounts           -> 018-create-basic-system-tables.sql
✅ user_communication_contacts  -> 018-create-basic-system-tables.sql
✅ user_host_categories         -> 024-create-user-relations-and-booking-tables.sql
✅ user_languages               -> 024-create-user-relations-and-booking-tables.sql
✅ user_sessions                -> 025-create-system-audit-tables.sql
✅ users                        -> 020-create-users-table.sql

*/

-- RESULT: ALL 39 TABLES HAVE PROPER MIGRATION COVERAGE ✅

-- Missing Specialized Booking Tables that should exist:
-- Need to check if these are actually missing or covered elsewhere:
-- - special_bookings
-- - group_bookings
-- - corporate_bookings