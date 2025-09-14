-- Bank master data for Indonesia
INSERT INTO banks (bank_code, bank_name, swift_code, is_active, created_at, updated_at) VALUES 
('014', 'Bank Central Asia (BCA)', 'CENAIDJA', true, NOW(), NOW()),
('009', 'Bank Negara Indonesia (BNI)', 'BNINIDJA', true, NOW(), NOW()),
('008', 'Bank Mandiri', 'BMRIIDJA', true, NOW(), NOW()),
('002', 'Bank Rakyat Indonesia (BRI)', 'BRINIDJA', true, NOW(), NOW()),
('451', 'Bank Syariah Indonesia (BSI)', 'BSYOIDJA', true, NOW(), NOW()),
('013', 'Bank Permata', 'BBBAIDJA', true, NOW(), NOW()),
('011', 'Bank Danamon', 'BDINIDJA', true, NOW(), NOW()),
('016', 'Bank Maybank Indonesia', 'MBBEIDJA', true, NOW(), NOW()),
('426', 'Bank Mega', 'MEGAIDJA', true, NOW(), NOW()),
('200', 'Bank Tabungan Negara (BTN)', 'BTANIDJA', true, NOW(), NOW())
ON CONFLICT (bank_code) DO NOTHING;

-- Sample user bank accounts (menggunakan ID user yang baru saja dimasukkan)
INSERT INTO user_bank_accounts (
  user_id, bank_id, account_number, account_holder_name, 
  is_verified, verification_date, is_active, created_at, updated_at
) VALUES 
(1, 1, '1234567890', 'ANDI WIJAYA', true, NOW(), true, NOW(), NOW()),
(2, 2, '0987654321', 'SARI DEWI', true, NOW(), true, NOW(), NOW()),
(3, 3, '1122334455', 'BUDI SANTOSO', true, NOW(), true, NOW(), NOW()),
(4, 1, '5566778899', 'MAYA CHEN', true, NOW(), true, NOW(), NOW()),
(5, 4, '9988776655', 'RAHMAN ALI', true, NOW(), true, NOW(), NOW())
ON CONFLICT (user_id, bank_id, account_number) DO NOTHING;

-- Sample payout settings
INSERT INTO payout_settings (
  user_id, payout_frequency, minimum_payout_amount, auto_payout_enabled,
  is_active, created_at, updated_at
) VALUES 
(1, 'weekly', 100000.00, true, true, NOW(), NOW()),
(2, 'monthly', 500000.00, false, true, NOW(), NOW()),
(3, 'weekly', 250000.00, true, true, NOW(), NOW()),
(4, 'monthly', 300000.00, true, true, NOW(), NOW()),
(5, 'weekly', 150000.00, true, true, NOW(), NOW())
ON CONFLICT (user_id) DO NOTHING;

-- Sample payout history
INSERT INTO payout_histories (
  user_id, user_bank_account_id, amount, status, transaction_reference,
  processed_at, created_at, updated_at
) VALUES 
(1, 1, 150000.00, 'completed', 'PAY-001-20241201', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day', NOW()),
(2, 2, 500000.00, 'completed', 'PAY-002-20241201', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days', NOW()),
(3, 3, 300000.00, 'pending', 'PAY-003-20241201', NULL, NOW(), NOW()),
(4, 4, 200000.00, 'completed', 'PAY-004-20241201', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days', NOW()),
(5, 5, 175000.00, 'processing', 'PAY-005-20241201', NULL, NOW(), NOW())
ON CONFLICT DO NOTHING;
