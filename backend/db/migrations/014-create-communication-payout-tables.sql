-- Create Communication and Payout Tables
-- File: 014-create-communication-payout-tables.sql
-- Note: audit_logs, user_sessions, notification_settings already defined in migrations 006-007

\echo '💳 Creating Communication and Payout Tables...'

-- Note: Tables from this migration have been moved to proper migration files:
-- - communication_apps: already exists in 008-create-communication-apps.sql
-- - payout_settings & payout_history: moved to 026-create-payout-tables.sql with correct structure
-- This migration file is kept for historical reference only.

-- Create indexes for payout_settings  
CREATE INDEX IF NOT EXISTS payout_settings_user_id ON payout_settings(user_id);

-- Create indexes for payout_history
CREATE INDEX IF NOT EXISTS payout_history_user_id ON payout_history(user_id);
CREATE INDEX IF NOT EXISTS payout_history_status ON payout_history(status);
CREATE INDEX IF NOT EXISTS payout_history_created_at ON payout_history(created_at);
CREATE INDEX IF NOT EXISTS payout_history_user_bank_account_id ON payout_history(user_bank_account_id);

\echo '✅ Communication and Payout Tables created successfully!'