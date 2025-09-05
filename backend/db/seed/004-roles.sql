-- Insert Roles
-- This file seeds the roles table

INSERT INTO roles (id, name, description, is_active, permissions, created_at, updated_at) VALUES
-- Web Access Roles (can access main website after login)
(1, 'traveller', 'Regular travellers who book experiences and tours', true, 
 '{"web": ["book_experience", "write_review", "view_profile", "manage_bookings"]}', 
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(2, 'host', 'Local hosts offering travel experiences and tours', true, 
 '{"web": ["create_experience", "manage_bookings", "view_analytics", "manage_profile", "respond_reviews"]}', 
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(3, 'affiliate', 'Affiliate partners promoting LocallyTrip experiences', true, 
 '{"web": ["view_commission", "generate_links", "view_analytics", "manage_profile"]}', 
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Admin Panel Access Roles (can access web admin after login)
(4, 'super_admin', 'Super administrator with full system access', true, 
 '{"admin": ["full_access", "manage_users", "manage_content", "system_settings", "financial_reports"]}', 
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(5, 'admin', 'General administrator managing platform operations', true, 
 '{"admin": ["manage_users", "manage_content", "moderate_reviews", "manage_bookings"]}', 
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(6, 'finance', 'Finance team handling payments and financial operations', true, 
 '{"admin": ["manage_payments", "financial_reports", "manage_payouts", "view_transactions"]}', 
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(7, 'marketing', 'Marketing team managing promotions and content', true, 
 '{"admin": ["manage_promotions", "content_management", "analytics", "manage_featured"]}', 
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(8, 'moderator', 'Content moderators reviewing user content and reports', true, 
 '{"admin": ["moderate_content", "manage_reports", "moderate_reviews", "manage_comments"]}', 
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(9, 'partner', 'Business partners with special admin access', true, 
 '{"admin": ["view_analytics", "manage_partnerships", "view_reports", "partner_dashboard"]}', 
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Reset sequence to continue from the last ID
SELECT setval('roles_id_seq', (SELECT MAX(id) FROM roles));
