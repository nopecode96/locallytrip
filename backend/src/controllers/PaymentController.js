const { 
  Bank, 
  UserBankAccount, 
  PayoutSettings, 
  PayoutHistory,
  User 
} = require('../models');
const { Op } = require('sequelize');

class PaymentController {
  
  // Get all active banks
  static async getBanks(req, res) {
    try {
      const banks = await Bank.findAll({
        where: { is_active: true },
        order: [['bank_name', 'ASC']],
        attributes: ['id', 'bank_code', 'bank_name', 'swift_code']
      });

      res.json({
        success: true,
        data: banks,
        message: 'Banks retrieved successfully'
      });
    } catch (error) {
      console.error('Error fetching banks:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch banks',
        error: error.message
      });
    }
  }

  // Get user's bank accounts
  static async getUserBankAccounts(req, res) {
    try {
      const userId = req.user.id;

      const bankAccounts = await UserBankAccount.findAll({
        where: { 
          user_id: userId,
          is_active: true 
        },
        include: [{
          model: Bank,
          as: 'bank',
          attributes: ['id', 'bank_name', 'swift_code']
        }],
        order: [['is_primary', 'DESC'], ['created_at', 'ASC']]
      });

      res.json({
        success: true,
        data: bankAccounts,
        message: 'Bank accounts retrieved successfully'
      });
    } catch (error) {
      console.error('Error fetching user bank accounts:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch bank accounts',
        error: error.message
      });
    }
  }

  // Add new bank account
  static async addBankAccount(req, res) {
    try {
      const userId = req.user.id;
      const { bank_id, account_number, account_holder_name, branch_name, branch_code, is_primary } = req.body;

      // Validate required fields
      if (!bank_id || !account_number || !account_holder_name) {
        return res.status(400).json({
          success: false,
          message: 'Bank ID, account number, and account holder name are required'
        });
      }

      // Check if bank exists
      const bank = await Bank.findByPk(bank_id);
      if (!bank) {
        return res.status(404).json({
          success: false,
          message: 'Bank not found'
        });
      }

      // Check for duplicate account
      const existingAccount = await UserBankAccount.findOne({
        where: {
          user_id: userId,
          bank_id,
          account_number,
          is_active: true
        }
      });

      if (existingAccount) {
        return res.status(400).json({
          success: false,
          message: 'This bank account is already registered'
        });
      }

      // If setting as primary, unset other primary accounts
      if (is_primary) {
        await UserBankAccount.update(
          { is_primary: false },
          { 
            where: { 
              user_id: userId,
              is_active: true 
            } 
          }
        );
      }

      // Create new bank account
      const newBankAccount = await UserBankAccount.create({
        user_id: userId,
        bank_id,
        account_number,
        account_holder_name,
        branch_name,
        branch_code,
        is_primary: is_primary || false
      });

      // Fetch the created account with bank details
      const bankAccount = await UserBankAccount.findByPk(newBankAccount.id, {
        include: [{
          model: Bank,
          as: 'bank',
          attributes: ['id', 'bank_name', 'bank_name_short', 'logo_url', 'swift_code']
        }]
      });

      res.status(201).json({
        success: true,
        data: bankAccount,
        message: 'Bank account added successfully'
      });
    } catch (error) {
      console.error('Error adding bank account:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to add bank account',
        error: error.message
      });
    }
  }

  // Update bank account
  static async updateBankAccount(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const { account_number, account_holder_name, branch_name, branch_code, is_primary } = req.body;

      const bankAccount = await UserBankAccount.findOne({
        where: { 
          id,
          user_id: userId,
          is_active: true 
        }
      });

      if (!bankAccount) {
        return res.status(404).json({
          success: false,
          message: 'Bank account not found'
        });
      }

      // If setting as primary, unset other primary accounts
      if (is_primary && !bankAccount.is_primary) {
        await UserBankAccount.update(
          { is_primary: false },
          { 
            where: { 
              user_id: userId,
              is_active: true,
              id: { [Op.ne]: id }
            } 
          }
        );
      }

      // Update bank account
      await bankAccount.update({
        account_number: account_number || bankAccount.account_number,
        account_holder_name: account_holder_name || bankAccount.account_holder_name,
        branch_name: branch_name || bankAccount.branch_name,
        branch_code: branch_code || bankAccount.branch_code,
        is_primary: is_primary !== undefined ? is_primary : bankAccount.is_primary
      });

      // Fetch updated account with bank details
      const updatedBankAccount = await UserBankAccount.findByPk(id, {
        include: [{
          model: Bank,
          as: 'bank',
          attributes: ['id', 'bank_name', 'bank_name_short', 'logo_url', 'swift_code']
        }]
      });

      res.json({
        success: true,
        data: updatedBankAccount,
        message: 'Bank account updated successfully'
      });
    } catch (error) {
      console.error('Error updating bank account:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update bank account',
        error: error.message
      });
    }
  }

  // Delete bank account (soft delete)
  static async deleteBankAccount(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const bankAccount = await UserBankAccount.findOne({
        where: { 
          id,
          user_id: userId,
          is_active: true 
        }
      });

      if (!bankAccount) {
        return res.status(404).json({
          success: false,
          message: 'Bank account not found'
        });
      }

      // Soft delete
      await bankAccount.update({ is_active: false });

      res.json({
        success: true,
        message: 'Bank account deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting bank account:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete bank account',
        error: error.message
      });
    }
  }

  // Get payout settings
  static async getPayoutSettings(req, res) {
    try {
      const userId = req.user.id;

      let payoutSettings = await PayoutSettings.findOne({
        where: { user_id: userId }
      });

      // Create default settings if none exist
      if (!payoutSettings) {
        payoutSettings = await PayoutSettings.create({
          user_id: userId,
          minimum_payout: 500000.00,
          payout_frequency: 'weekly',
          auto_payout: true,
          currency: 'IDR'
        });
      }

      res.json({
        success: true,
        data: payoutSettings,
        message: 'Payout settings retrieved successfully'
      });
    } catch (error) {
      console.error('Error fetching payout settings:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch payout settings',
        error: error.message
      });
    }
  }

  // Update payout settings
  static async updatePayoutSettings(req, res) {
    try {
      const userId = req.user.id;
      const { minimum_payout, payout_frequency, auto_payout, currency, tax_rate } = req.body;

      let payoutSettings = await PayoutSettings.findOne({
        where: { user_id: userId }
      });

      if (!payoutSettings) {
        // Create new settings
        payoutSettings = await PayoutSettings.create({
          user_id: userId,
          minimum_payout: minimum_payout || 500000.00,
          payout_frequency: payout_frequency || 'weekly',
          auto_payout: auto_payout !== undefined ? auto_payout : true,
          currency: currency || 'IDR',
          tax_rate: tax_rate || 0.00
        });
      } else {
        // Update existing settings
        await payoutSettings.update({
          minimum_payout: minimum_payout || payoutSettings.minimum_payout,
          payout_frequency: payout_frequency || payoutSettings.payout_frequency,
          auto_payout: auto_payout !== undefined ? auto_payout : payoutSettings.auto_payout,
          currency: currency || payoutSettings.currency,
          tax_rate: tax_rate !== undefined ? tax_rate : payoutSettings.tax_rate
        });
      }

      res.json({
        success: true,
        data: payoutSettings,
        message: 'Payout settings updated successfully'
      });
    } catch (error) {
      console.error('Error updating payout settings:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update payout settings',
        error: error.message
      });
    }
  }

  // Get payout history
  static async getPayoutHistory(req, res) {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 10, status } = req.query;
      const offset = (page - 1) * limit;

      const whereClause = { user_id: userId };
      if (status) {
        whereClause.status = status;
      }

      const { count, rows: payoutHistory } = await PayoutHistory.findAndCountAll({
        where: whereClause,
        include: [{
          model: UserBankAccount,
          as: 'bankAccount',
          include: [{
            model: Bank,
            as: 'bank',
            attributes: ['bank_name', 'bank_name_short', 'logo_url']
          }]
        }],
        order: [['created_at', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      const totalPages = Math.ceil(count / limit);

      res.json({
        success: true,
        data: payoutHistory,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: count,
          itemsPerPage: parseInt(limit)
        },
        message: 'Payout history retrieved successfully'
      });
    } catch (error) {
      console.error('Error fetching payout history:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch payout history',
        error: error.message
      });
    }
  }
}

module.exports = PaymentController;
