-- Create Basic System Tables (Missing from migrations)
-- File: 018-create-basic-system-tables.sql
-- Tables that exist in database but missing from migration files

\echo '🏦 Creating Missing Basic System Tables...'

-- Create banks table (exact structure from database)
CREATE TABLE IF NOT EXISTS banks (
    id SERIAL PRIMARY KEY,
    bank_code VARCHAR(10) NOT NULL UNIQUE,
    bank_name VARCHAR(100) NOT NULL,
    bank_name_short VARCHAR(50),
    swift_code VARCHAR(11),
    country_code VARCHAR(2) DEFAULT 'ID',
    logo_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create user_bank_accounts table (exact structure from database)
CREATE TABLE IF NOT EXISTS user_bank_accounts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    bank_id INTEGER NOT NULL REFERENCES banks(id) ON UPDATE CASCADE,
    account_number VARCHAR(50) NOT NULL,
    account_holder_name VARCHAR(100) NOT NULL,
    branch_name VARCHAR(100),
    branch_code VARCHAR(20),
    is_primary BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_date TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create user_communication_contacts table (exact structure from database)
CREATE TABLE IF NOT EXISTS user_communication_contacts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL,
    communication_app_id INTEGER REFERENCES communication_apps(id) ON UPDATE CASCADE ON DELETE SET NULL,
    contact_value VARCHAR(255) NOT NULL,
    is_preferred BOOLEAN DEFAULT FALSE,
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create newsletter_subscriptions table (exact structure from database)
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    user_id INTEGER REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL,
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    unsubscribed_at TIMESTAMP
);

-- Create indexes for banks
CREATE UNIQUE INDEX IF NOT EXISTS banks_bank_code_key ON banks(bank_code);

-- Create indexes for user_bank_accounts
CREATE UNIQUE INDEX IF NOT EXISTS user_bank_accounts_user_id_bank_id_account_number 
    ON user_bank_accounts(user_id, bank_id, account_number);
CREATE INDEX IF NOT EXISTS user_bank_accounts_user_id ON user_bank_accounts(user_id);
CREATE INDEX IF NOT EXISTS user_bank_accounts_bank_id ON user_bank_accounts(bank_id);

-- Create indexes for user_communication_contacts
CREATE INDEX IF NOT EXISTS user_communication_contacts_user_id ON user_communication_contacts(user_id);
CREATE INDEX IF NOT EXISTS user_communication_contacts_communication_app_id ON user_communication_contacts(communication_app_id);
CREATE UNIQUE INDEX IF NOT EXISTS user_communication_contacts_user_id_communication_app_id 
    ON user_communication_contacts(user_id, communication_app_id);

-- Create indexes for newsletter_subscriptions
CREATE UNIQUE INDEX IF NOT EXISTS newsletter_subscriptions_email_key ON newsletter_subscriptions(email);
CREATE INDEX IF NOT EXISTS newsletter_subscriptions_is_active ON newsletter_subscriptions(is_active);

\echo '✅ Missing Basic System Tables created successfully!'