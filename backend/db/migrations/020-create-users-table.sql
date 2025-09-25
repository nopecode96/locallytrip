-- Create Users Table (MOVED to 019-create-core-system-tables.sql)  
-- File: 020-create-users-table.sql

-- Note: The users table has been moved to migration 019-create-core-system-tables.sql
-- to fix dependency order issues. Users table needs to be created after roles and cities
-- but before other tables that reference it.
