-- Simple users seed for payment testing
-- Insert sample users for payment testing

INSERT INTO users (
  name, email, password, role, phone, bio, is_verified, is_active, created_at, updated_at
) VALUES 
(
  'Andi Wijaya', 
  'andi.wijaya@locallytrip.com', 
  '$2b$10$K7L/8qnlMJGV8YJNQJFm.uFsH2RzgJKk6xjHhGzLlYvzrQx8Y5Zfm', -- password: testpassword123
  'host', 
  '+62812345678901', 
  'Professional tour guide in Bali with 5+ years experience. Passionate about sharing Balinese culture.',
  true, 
  true, 
  NOW(), 
  NOW()
),
(
  'Sari Dewi', 
  'sari.dewi@locallytrip.com', 
  '$2b$10$K7L/8qnlMJGV8YJNQJFm.uFsH2RzgJKk6xjHhGzLlYvzrQx8Y5Zfm', -- password: testpassword123
  'host', 
  '+62812345678902', 
  'Yogyakarta photography expert specializing in cultural and heritage shoots.',
  true, 
  true, 
  NOW(), 
  NOW()
),
(
  'Budi Santoso', 
  'budi.santoso@locallytrip.com', 
  '$2b$10$K7L/8qnlMJGV8YJNQJFm.uFsH2RzgJKk6xjHhGzLlYvzrQx8Y5Zfm', -- password: testpassword123
  'host', 
  '+62812345678903', 
  'Jakarta trip planner and local guide, helping visitors discover hidden gems.',
  true, 
  true, 
  NOW(), 
  NOW()
),
(
  'Maya Chen', 
  'maya.chen@locallytrip.com', 
  '$2b$10$K7L/8qnlMJGV8YJNQJFm.uFsH2RzgJKk6xjHhGzLlYvzrQx8Y5Zfm', -- password: testpassword123
  'host', 
  '+62812345678904', 
  'Bandung creative photographer and videographer for special moments.',
  true, 
  true, 
  NOW(), 
  NOW()
),
(
  'Rahman Ali', 
  'rahman.ali@locallytrip.com', 
  '$2b$10$K7L/8qnlMJGV8YJNQJFm.uFsH2RzgJKk6xjHhGzLlYvzrQx8Y5Zfm', -- password: testpassword123
  'host', 
  '+62812345678905', 
  'Surabaya combo host offering photography and tour guide services.',
  true, 
  true, 
  NOW(), 
  NOW()
)
ON CONFLICT (email) DO NOTHING;
