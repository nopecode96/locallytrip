-- Fix Migration 006: Replace CHECK constraints with ENUM types
-- File: 017-fix-migration-006-enum-types.sql
-- This corrects the audit_logs and user_sessions tables to use ENUM types instead of CHECK constraints

\echo '🔧 Fixing Migration 006: Converting CHECK constraints to ENUM types...'

-- First, drop existing CHECK constraints if they exist
ALTER TABLE IF EXISTS audit_logs DROP CONSTRAINT IF EXISTS audit_logs_action_category_check;
ALTER TABLE IF EXISTS audit_logs DROP CONSTRAINT IF EXISTS audit_logs_status_check;
ALTER TABLE IF EXISTS audit_logs DROP CONSTRAINT IF EXISTS audit_logs_severity_check;
ALTER TABLE IF EXISTS audit_logs DROP CONSTRAINT IF EXISTS audit_logs_source_check;

ALTER TABLE IF EXISTS user_sessions DROP CONSTRAINT IF EXISTS user_sessions_device_type_check;
ALTER TABLE IF EXISTS user_sessions DROP CONSTRAINT IF EXISTS user_sessions_platform_check;

-- Update audit_logs columns to use ENUM types (if table exists and columns are VARCHAR)
DO $$
BEGIN
    -- Check if audit_logs table exists and update column types
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'audit_logs') THEN
        -- Update action_category to ENUM
        IF EXISTS (SELECT FROM information_schema.columns 
                   WHERE table_name = 'audit_logs' AND column_name = 'action_category' 
                   AND data_type = 'character varying') THEN
            ALTER TABLE audit_logs ALTER COLUMN action_category TYPE enum_audit_logs_action_category 
            USING action_category::enum_audit_logs_action_category;
        END IF;
        
        -- Update status to ENUM
        IF EXISTS (SELECT FROM information_schema.columns 
                   WHERE table_name = 'audit_logs' AND column_name = 'status' 
                   AND data_type = 'character varying') THEN
            ALTER TABLE audit_logs ALTER COLUMN status TYPE enum_audit_logs_status 
            USING status::enum_audit_logs_status;
        END IF;
        
        -- Update severity to ENUM
        IF EXISTS (SELECT FROM information_schema.columns 
                   WHERE table_name = 'audit_logs' AND column_name = 'severity' 
                   AND data_type = 'character varying') THEN
            ALTER TABLE audit_logs ALTER COLUMN severity TYPE enum_audit_logs_severity 
            USING severity::enum_audit_logs_severity;
        END IF;
        
        -- Update source to ENUM
        IF EXISTS (SELECT FROM information_schema.columns 
                   WHERE table_name = 'audit_logs' AND column_name = 'source' 
                   AND data_type = 'character varying') THEN
            ALTER TABLE audit_logs ALTER COLUMN source TYPE enum_audit_logs_source 
            USING source::enum_audit_logs_source;
        END IF;
    END IF;
    
    -- Check if user_sessions table exists and update column types
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_sessions') THEN
        -- Update device_type to ENUM
        IF EXISTS (SELECT FROM information_schema.columns 
                   WHERE table_name = 'user_sessions' AND column_name = 'device_type' 
                   AND data_type = 'character varying') THEN
            ALTER TABLE user_sessions ALTER COLUMN device_type TYPE enum_user_sessions_device_type 
            USING device_type::enum_user_sessions_device_type;
        END IF;
        
        -- Update platform to ENUM
        IF EXISTS (SELECT FROM information_schema.columns 
                   WHERE table_name = 'user_sessions' AND column_name = 'platform' 
                   AND data_type = 'character varying') THEN
            ALTER TABLE user_sessions ALTER COLUMN platform TYPE enum_user_sessions_platform 
            USING platform::enum_user_sessions_platform;
        END IF;
    END IF;
    
END $$;

\echo '✅ Migration 006 ENUM fixes applied successfully!'