-- Migration: Create payout system tables
-- Date: 2025-01-03
-- Purpose: Create payout_settings and payout_history tables

-- Create payout_settings table (exact structure from database)
CREATE TABLE IF NOT EXISTS payout_settings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    minimum_payout NUMERIC(10,2) DEFAULT 500000 NOT NULL,
    payout_frequency enum_payout_settings_payout_frequency DEFAULT 'weekly' NOT NULL,
    auto_payout BOOLEAN DEFAULT TRUE,
    currency CHARACTER VARYING(3) DEFAULT 'IDR' NOT NULL,
    tax_rate NUMERIC(5,2) DEFAULT 0 NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE(user_id)
);

-- Create payout_history table (exact structure from database)
CREATE TABLE IF NOT EXISTS payout_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    user_bank_account_id INTEGER NOT NULL REFERENCES user_bank_accounts(id) ON UPDATE CASCADE,
    amount NUMERIC(12,2) NOT NULL,
    currency CHARACTER VARYING(3) DEFAULT 'IDR' NOT NULL,
    status enum_payout_history_status DEFAULT 'pending' NOT NULL,
    payout_reference CHARACTER VARYING(100) UNIQUE,
    processed_date TIMESTAMP WITH TIME ZONE,
    completed_date TIMESTAMP WITH TIME ZONE,
    failure_reason TEXT,
    platform_fee NUMERIC(10,2) DEFAULT 0 NOT NULL,
    tax_amount NUMERIC(10,2) DEFAULT 0 NOT NULL,
    net_amount NUMERIC(12,2) NOT NULL,
    period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);