const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/PaymentController');
const { authenticateToken } = require('../middleware/auth');

// Bank routes (public - for dropdowns)
router.get('/banks', PaymentController.getBanks);

// All other routes require authentication
router.use(authenticateToken);

// User bank account routes
router.get('/bank-accounts', PaymentController.getUserBankAccounts);
router.post('/bank-accounts', PaymentController.addBankAccount);
router.put('/bank-accounts/:id', PaymentController.updateBankAccount);
router.delete('/bank-accounts/:id', PaymentController.deleteBankAccount);

// Payout settings routes
router.get('/payout-settings', PaymentController.getPayoutSettings);
router.put('/payout-settings', PaymentController.updatePayoutSettings);

// Payout history routes
router.get('/payout-history', PaymentController.getPayoutHistory);

module.exports = router;
