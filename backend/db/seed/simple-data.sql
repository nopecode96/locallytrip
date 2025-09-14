-- Simple data seed for payment testing

-- Insert basic roles first
INSERT INTO roles (name, description, created_at, updated_at) VALUES 
('traveller', 'Regular traveller user', NOW(), NOW()),
('host', 'Experience host user', NOW(), NOW()),
('admin', 'Administrator user', NOW(), NOW())
ON CONFLICT (name) DO NOTHING;

-- Insert sample users
INSERT INTO users (
  name, email, password_hash, role_id, phone, bio, is_verified, is_active, created_at, updated_at
) VALUES 
(
  'Andi Wijaya', 
  'andi.wijaya@locallytrip.com', 
  '$2b$10$K7L/8qnlMJGV8YJNQJFm.uFsH2RzgJKk6xjHhGzLlYvzrQx8Y5Zfm', -- password: testpassword123
  2, -- host role
  '+62812345678901', 
  'Professional tour guide in Bali with 5+ years experience.',
  true, 
  true, 
  NOW(), 
  NOW()
),
(
  'Sari Dewi', 
  'sari.dewi@locallytrip.com', 
  '$2b$10$K7L/8qnlMJGV8YJNQJFm.uFsH2RzgJKk6xjHhGzLlYvzrQx8Y5Zfm',
  2, -- host role
  '+62812345678902', 
  'Yogyakarta photography expert specializing in cultural shots.',
  true, 
  true, 
  NOW(), 
  NOW()
),
(
  'Budi Santoso', 
  'budi.santoso@locallytrip.com', 
  '$2b$10$K7L/8qnlMJGV8YJNQJFm.uFsH2RzgJKk6xjHhGzLlYvzrQx8Y5Zfm',
  2, -- host role
  '+62812345678903', 
  'Jakarta trip planner and local guide.',
  true, 
  true, 
  NOW(), 
  NOW()
),
(
  'Maya Chen', 
  'maya.chen@locallytrip.com', 
  '$2b$10$K7L/8qnlMJGV8YJNQJFm.uFsH2RzgJKk6xjHhGzLlYvzrQx8Y5Zfm',
  2, -- host role
  '+62812345678904', 
  'Bandung creative photographer and videographer.',
  true, 
  true, 
  NOW(), 
  NOW()
),
(
  'Rahman Ali', 
  'rahman.ali@locallytrip.com', 
  '$2b$10$K7L/8qnlMJGV8YJNQJFm.uFsH2RzgJKk6xjHhGzLlYvzrQx8Y5Zfm',
  2, -- host role
  '+62812345678905', 
  'Surabaya combo host offering multiple services.',
  true, 
  true, 
  NOW(), 
  NOW()
)
ON CONFLICT (email) DO NOTHING;
