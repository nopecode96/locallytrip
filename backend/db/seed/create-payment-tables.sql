-- Create payment system tables manually

-- Banks table
CREATE TABLE IF NOT EXISTS banks (
  id SERIAL PRIMARY KEY,
  bank_code VARCHAR(10) UNIQUE NOT NULL,
  bank_name VARCHAR(100) NOT NULL,
  swift_code VARCHAR(11),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User Bank Accounts table
CREATE TABLE IF NOT EXISTS user_bank_accounts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  bank_id INTEGER NOT NULL REFERENCES banks(id) ON DELETE CASCADE,
  account_number VARCHAR(50) NOT NULL,
  account_holder_name VARCHAR(100) NOT NULL,
  is_verified BOOLEAN DEFAULT false,
  verification_date TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, bank_id, account_number)
);

-- Payout Settings table
CREATE TABLE IF NOT EXISTS payout_settings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  payout_frequency VARCHAR(20) DEFAULT 'monthly' CHECK (payout_frequency IN ('daily', 'weekly', 'monthly')),
  minimum_payout_amount DECIMAL(12,2) DEFAULT 50000.00,
  auto_payout_enabled BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Payout History table
CREATE TABLE IF NOT EXISTS payout_histories (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_bank_account_id INTEGER NOT NULL REFERENCES user_bank_accounts(id) ON DELETE CASCADE,
  amount DECIMAL(12,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  transaction_reference VARCHAR(100),
  notes TEXT,
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_bank_accounts_user_id ON user_bank_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_bank_accounts_bank_id ON user_bank_accounts(bank_id);
CREATE INDEX IF NOT EXISTS idx_payout_settings_user_id ON payout_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_payout_histories_user_id ON payout_histories(user_id);
CREATE INDEX IF NOT EXISTS idx_payout_histories_status ON payout_histories(status);
CREATE INDEX IF NOT EXISTS idx_payout_histories_created_at ON payout_histories(created_at);
