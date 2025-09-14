-- 03-seed-payment-data.sql
-- Seed data untuk Bank master data dan sample payment settings

-- Bank master data (Bank-bank populer di Indonesia)
INSERT INTO banks (bank_code, bank_name, bank_name_short, swift_code, country_code, logo_url, is_active, created_at, updated_at) VALUES
('014', 'Bank Central Asia', 'BCA', 'CENAIDJA', 'ID', '/images/banks/bca.png', true, NOW(), NOW()),
('002', 'Bank Rakyat Indonesia', 'BRI', 'BRINIDJA', 'ID', '/images/banks/bri.png', true, NOW(), NOW()),
('008', 'Bank Mandiri', 'Mandiri', 'BMRIIDJA', 'ID', '/images/banks/mandiri.png', true, NOW(), NOW()),
('009', 'Bank Negara Indonesia', 'BNI', 'BNINIDJA', 'ID', '/images/banks/bni.png', true, NOW(), NOW()),
('013', 'Bank Permata', 'Permata', 'BBBAIDJA', 'ID', '/images/banks/permata.png', true, NOW(), NOW()),
('011', 'Bank Danamon', 'Danamon', 'BDINIDJA', 'ID', '/images/banks/danamon.png', true, NOW(), NOW()),
('016', 'Bank Maybank Indonesia', 'Maybank', 'MBBEIDJA', 'ID', '/images/banks/maybank.png', true, NOW(), NOW()),
('022', 'Bank CIMB Niaga', 'CIMB Niaga', 'BNIAIDJA', 'ID', '/images/banks/cimb.png', true, NOW(), NOW()),
('451', 'Bank BTPN', 'BTPN', 'BTPNIDJA', 'ID', '/images/banks/btpn.png', true, NOW(), NOW()),
('212', 'Bank Woori Saudara', 'Woori Saudara', 'WSIDIDJA', 'ID', '/images/banks/woori.png', true, NOW(), NOW()),
('037', 'Bank Artha Graha Internasional', 'Artha Graha', 'ARTHIDJA', 'ID', '/images/banks/artha.png', true, NOW(), NOW()),
('041', 'Bank Bukopin', 'Bukopin', 'BBUKIDJA', 'ID', '/images/banks/bukopin.png', true, NOW(), NOW()),
('046', 'Bank DBS Indonesia', 'DBS Indonesia', 'DBSSIDJA', 'ID', '/images/banks/dbs.png', true, NOW(), NOW()),
('023', 'Bank UOB Indonesia', 'UOB Indonesia', 'UOVBIDJA', 'ID', '/images/banks/uob.png', true, NOW(), NOW()),
('422', 'Bank BTPN Syariah', 'BTPN Syariah', 'BTPNIDJA', 'ID', '/images/banks/btpn_syariah.png', true, NOW(), NOW())
ON CONFLICT (bank_code) DO NOTHING;

-- Sample User Bank Accounts untuk existing users (dari seed sebelumnya)
-- Asumsi user dengan ID 1-5 sudah ada dari seed sebelumnya

INSERT INTO user_bank_accounts (user_id, bank_id, account_number, account_holder_name, branch_name, branch_code, is_primary, is_verified, verification_date, is_active, created_at, updated_at) VALUES
-- User 1 (Andi Wijaya) - Host
(1, 1, '1234567890', 'Andi Wijaya', 'BCA Senayan', '0340', true, true, NOW() - INTERVAL '7 days', true, NOW(), NOW()),
(1, 2, '0987654321', 'Andi Wijaya', 'BRI Sudirman', '0002', false, false, NULL, true, NOW(), NOW()),

-- User 2 (Sari Dewi) - Host
(2, 3, '5555666677', 'Sari Dewi', 'Mandiri Thamrin', '0010', true, true, NOW() - INTERVAL '5 days', true, NOW(), NOW()),

-- User 3 (Budi Santoso) - Host
(3, 4, '1111222233', 'Budi Santoso', 'BNI Kemang', '0009', true, true, NOW() - INTERVAL '10 days', true, NOW(), NOW()),
(3, 1, '9999888877', 'Budi Santoso', 'BCA Blok M', '0341', false, true, NOW() - INTERVAL '3 days', true, NOW(), NOW()),

-- User 4 (Maya Chen) - Host
(4, 5, '7777888899', 'Maya Chen', 'Permata Kuningan', '0013', true, false, NULL, true, NOW(), NOW()),

-- User 5 (Rahman Ali) - Host
(5, 6, '4444555566', 'Rahman Ali', 'Danamon Menteng', '0011', true, true, NOW() - INTERVAL '1 day', true, NOW(), NOW());

-- Sample Payout Settings untuk hosts
INSERT INTO payout_settings (user_id, minimum_payout, payout_frequency, auto_payout, currency, tax_rate, is_active, created_at, updated_at) VALUES
(1, 500000.00, 'weekly', true, 'IDR', 0.00, true, NOW(), NOW()),
(2, 750000.00, 'biweekly', true, 'IDR', 2.50, true, NOW(), NOW()),
(3, 1000000.00, 'monthly', false, 'IDR', 0.00, true, NOW(), NOW()),
(4, 500000.00, 'weekly', true, 'IDR', 1.00, true, NOW(), NOW()),
(5, 600000.00, 'weekly', true, 'IDR', 0.00, true, NOW(), NOW());

-- Sample Payout History (untuk menunjukkan histori pembayaran)
INSERT INTO payout_history (user_id, user_bank_account_id, amount, currency, status, payout_reference, processed_date, completed_date, platform_fee, tax_amount, net_amount, period_start, period_end, created_at, updated_at) VALUES
-- Payout untuk User 1 (Andi Wijaya)
(1, 1, 1500000.00, 'IDR', 'completed', 'PO-2024-001', NOW() - INTERVAL '7 days', NOW() - INTERVAL '6 days', 150000.00, 0.00, 1350000.00, NOW() - INTERVAL '14 days', NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days', NOW() - INTERVAL '6 days'),
(1, 1, 2200000.00, 'IDR', 'completed', 'PO-2024-002', NOW() - INTERVAL '14 days', NOW() - INTERVAL '13 days', 220000.00, 0.00, 1980000.00, NOW() - INTERVAL '21 days', NOW() - INTERVAL '14 days', NOW() - INTERVAL '14 days', NOW() - INTERVAL '13 days'),
(1, 1, 800000.00, 'IDR', 'processing', 'PO-2024-003', NOW() - INTERVAL '1 day', NULL, 80000.00, 0.00, 720000.00, NOW() - INTERVAL '7 days', NOW(), NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),

-- Payout untuk User 2 (Sari Dewi)
(2, 3, 3500000.00, 'IDR', 'completed', 'PO-2024-004', NOW() - INTERVAL '10 days', NOW() - INTERVAL '9 days', 350000.00, 87500.00, 3062500.00, NOW() - INTERVAL '24 days', NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days', NOW() - INTERVAL '9 days'),
(2, 3, 2800000.00, 'IDR', 'pending', 'PO-2024-005', NULL, NULL, 280000.00, 70000.00, 2450000.00, NOW() - INTERVAL '10 days', NOW(), NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),

-- Payout untuk User 3 (Budi Santoso)
(3, 4, 5200000.00, 'IDR', 'completed', 'PO-2024-006', NOW() - INTERVAL '30 days', NOW() - INTERVAL '28 days', 520000.00, 0.00, 4680000.00, NOW() - INTERVAL '60 days', NOW() - INTERVAL '30 days', NOW() - INTERVAL '30 days', NOW() - INTERVAL '28 days'),

-- Payout untuk User 4 (Maya Chen)
(4, 5, 950000.00, 'IDR', 'failed', 'PO-2024-007', NOW() - INTERVAL '5 days', NULL, 95000.00, 9500.00, 845500.00, NOW() - INTERVAL '12 days', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),

-- Payout untuk User 5 (Rahman Ali)
(5, 6, 1200000.00, 'IDR', 'completed', 'PO-2024-008', NOW() - INTERVAL '3 days', NOW() - INTERVAL '2 days', 120000.00, 0.00, 1080000.00, NOW() - INTERVAL '10 days', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days', NOW() - INTERVAL '2 days');

-- Update some payout history with failure reason
UPDATE payout_history 
SET failure_reason = 'Invalid account number - verification failed'
WHERE status = 'failed' AND id IN (SELECT id FROM payout_history WHERE status = 'failed' LIMIT 1);
