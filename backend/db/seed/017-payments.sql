-- Insert Payments
-- This file seeds the payments table

INSERT INTO payments (id, booking_id, user_id, amount, currency, payment_method, status, payment_reference, payment_date, created_at, updated_at) VALUES
(1, 1, 1, 750000.00, 'IDR', 'credit_card', 'completed', 'TXN_001_CC_2024', '2024-01-15 09:30:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 2, 2, 1200000.00, 'IDR', 'bank_transfer', 'completed', 'TXN_002_BT_2024', '2024-01-20 14:15:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 3, 3, 2500000.00, 'IDR', 'ewallet', 'completed', 'TXN_003_EW_2024', '2024-02-05 11:45:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 4, 4, 500000.00, 'IDR', 'credit_card', 'completed', 'TXN_004_CC_2024', '2024-02-10 16:20:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, 5, 5, 1800000.00, 'IDR', 'bank_transfer', 'completed', 'TXN_005_BT_2024', '2024-02-25 10:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(6, 6, 1, 3000000.00, 'IDR', 'credit_card', 'completed', 'TXN_006_CC_2024', '2024-03-01 13:30:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(7, 7, 2, 800000.00, 'IDR', 'ewallet', 'completed', 'TXN_007_EW_2024', '2024-03-10 15:45:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(8, 8, 3, 1500000.00, 'IDR', 'bank_transfer', 'completed', 'TXN_008_BT_2024', '2024-03-15 09:15:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(9, 9, 4, 2200000.00, 'IDR', 'credit_card', 'pending', 'TXN_009_CC_2024', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10, 10, 5, 1000000.00, 'IDR', 'ewallet', 'completed', 'TXN_010_EW_2024', '2024-04-05 12:20:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);