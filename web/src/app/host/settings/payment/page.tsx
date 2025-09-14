'use client';

import { useState, useEffect } from 'react';
import { CreditCard, Building2, DollarSign, Plus, Edit, Trash2, Check, X, AlertCircle } from 'lucide-react';
import { usePaymentData, type Bank, type UserBankAccount } from '../../../../hooks/usePaymentData';

interface BankAccountFormData {
  bank_id: number;
  account_number: string;
  account_holder_name: string;
  branch_name: string;
  branch_code: string;
  is_primary: boolean;
}

export default function PaymentSettingsPage() {
  const {
    banks,
    bankAccounts,
    payoutSettings,
    loading,
    error,
    setError,
    addBankAccount,
    updateBankAccount,
    deleteBankAccount,
    updatePayoutSettings,
  } = usePaymentData();

  const [message, setMessage] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState<UserBankAccount | null>(null);
  const [formData, setFormData] = useState<BankAccountFormData>({
    bank_id: 0,
    account_number: '',
    account_holder_name: '',
    branch_name: '',
    branch_code: '',
    is_primary: false,
  });

  const [payoutFormData, setPayoutFormData] = useState({
    minimum_payout: '500000',
    payout_frequency: 'weekly',
    auto_payout: true,
    currency: 'IDR',
    tax_rate: '0',
  });

  // Update payout form when data loads
  useEffect(() => {
    if (payoutSettings) {
      setPayoutFormData({
        minimum_payout: payoutSettings.minimum_payout.toString(),
        payout_frequency: payoutSettings.payout_frequency,
        auto_payout: payoutSettings.auto_payout,
        currency: payoutSettings.currency,
        tax_rate: payoutSettings.tax_rate.toString(),
      });
    }
  }, [payoutSettings]);

  const resetForm = () => {
    setFormData({
      bank_id: 0,
      account_number: '',
      account_holder_name: '',
      branch_name: '',
      branch_code: '',
      is_primary: false,
    });
    setEditingAccount(null);
    setShowAddForm(false);
  };

  const handleAddAccount = () => {
    setShowAddForm(true);
    resetForm();
  };

  const handleEditAccount = (account: UserBankAccount) => {
    setEditingAccount(account);
    setFormData({
      bank_id: account.bank_id,
      account_number: account.account_number,
      account_holder_name: account.account_holder_name,
      branch_name: account.branch_name || '',
      branch_code: account.branch_code || '',
      is_primary: account.is_primary,
    });
    setShowAddForm(true);
  };

  const handleSubmitBankAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage('');

    if (!formData.bank_id || !formData.account_number || !formData.account_holder_name) {
      setError('Please fill in all required fields');
      return;
    }

    let result;
    if (editingAccount) {
      result = await updateBankAccount(editingAccount.id, {
        account_number: formData.account_number,
        account_holder_name: formData.account_holder_name,
        branch_name: formData.branch_name,
        branch_code: formData.branch_code,
        is_primary: formData.is_primary,
      });
    } else {
      result = await addBankAccount(formData);
    }

    if (result.success) {
      setMessage(editingAccount ? 'Bank account updated successfully' : 'Bank account added successfully');
      resetForm();
    }
  };

  const handleDeleteAccount = async (accountId: number) => {
    if (window.confirm('Are you sure you want to delete this bank account?')) {
      const result = await deleteBankAccount(accountId);
      if (result.success) {
        setMessage('Bank account deleted successfully');
      }
    }
  };

  const handleUpdatePayoutSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage('');

    const result = await updatePayoutSettings({
      minimum_payout: parseFloat(payoutFormData.minimum_payout),
      payout_frequency: payoutFormData.payout_frequency as 'weekly' | 'biweekly' | 'monthly',
      auto_payout: payoutFormData.auto_payout,
      currency: payoutFormData.currency,
      tax_rate: parseFloat(payoutFormData.tax_rate),
    });

    if (result.success) {
      setMessage('Payout settings updated successfully');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (account: UserBankAccount) => {
    if (account.is_verified) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <Check className="w-3 h-3 mr-1" />
          Verified
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        <AlertCircle className="w-3 h-3 mr-1" />
        Pending Verification
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <span>Host Settings</span>
            <span>/</span>
            <span className="text-purple-600">Payment & Billing</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Payment & Billing</h1>
          <p className="text-gray-600 mt-2">
            Manage your payment methods and payout preferences
          </p>
        </div>

        {/* Success/Error Message */}
        {(message || error) && (
          <div className={`mb-6 p-4 rounded-lg ${
            error 
              ? 'bg-red-100 text-red-800 border border-red-200' 
              : 'bg-green-100 text-green-800 border border-green-200'
          }`}>
            {error || message}
          </div>
        )}

        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <p className="mt-2 text-gray-600">Loading payment data...</p>
          </div>
        )}

        <div className="space-y-8">
          {/* Bank Account Details */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Building2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Bank Account Details</h2>
                    <p className="text-gray-600 mt-1">Manage your bank accounts for receiving payments</p>
                  </div>
                </div>
                <button
                  onClick={handleAddAccount}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Bank Account</span>
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Existing Bank Accounts */}
              {bankAccounts.length > 0 ? (
                <div className="space-y-4 mb-6">
                  {bankAccounts.map((account) => (
                    <div key={account.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-gray-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{account.bank.bank_name}</h3>
                            <p className="text-sm text-gray-600">
                              {account.account_number} • {account.account_holder_name}
                            </p>
                            <div className="flex items-center space-x-3 mt-1">
                              {getStatusBadge(account)}
                              {account.is_primary && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                  Primary
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEditAccount(account)}
                            className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteAccount(account.id)}
                            className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No bank accounts added yet</p>
                  <p className="text-sm text-gray-500">Add a bank account to receive payments</p>
                </div>
              )}

              {/* Add/Edit Bank Account Form */}
              {showAddForm && (
                <form onSubmit={handleSubmitBankAccount} className="space-y-4 border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {editingAccount ? 'Edit Bank Account' : 'Add New Bank Account'}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bank *
                      </label>
                      <select
                        value={formData.bank_id}
                        onChange={(e) => setFormData({ ...formData, bank_id: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                        disabled={!!editingAccount}
                      >
                        <option value={0}>Select Bank</option>
                        {banks.map((bank) => (
                          <option key={bank.id} value={bank.id}>
                            {bank.bank_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Account Number *
                      </label>
                      <input
                        type="text"
                        value={formData.account_number}
                        onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter account number"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Account Holder Name *
                      </label>
                      <input
                        type="text"
                        value={formData.account_holder_name}
                        onChange={(e) => setFormData({ ...formData, account_holder_name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter account holder name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Branch Name
                      </label>
                      <input
                        type="text"
                        value={formData.branch_name}
                        onChange={(e) => setFormData({ ...formData, branch_name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter branch name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Branch Code
                      </label>
                      <input
                        type="text"
                        value={formData.branch_code}
                        onChange={(e) => setFormData({ ...formData, branch_code: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter branch code"
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="is_primary"
                        checked={formData.is_primary}
                        onChange={(e) => setFormData({ ...formData, is_primary: e.target.checked })}
                        className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <label htmlFor="is_primary" className="ml-2 text-sm text-gray-700">
                        Set as primary account
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center space-x-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                    >
                      <Check className="w-4 h-4" />
                      <span>{editingAccount ? 'Update' : 'Add'} Account</span>
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="flex items-center space-x-2 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Payout Settings */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Payout Settings</h2>
                  <p className="text-gray-600 mt-1">Configure your payout preferences and schedule</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <form onSubmit={handleUpdatePayoutSettings} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Payout Amount (IDR)
                    </label>
                    <input
                      type="number"
                      value={payoutFormData.minimum_payout}
                      onChange={(e) => setPayoutFormData({ ...payoutFormData, minimum_payout: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      min="100000"
                      step="50000"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Minimum: IDR 100,000
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payout Frequency
                    </label>
                    <select
                      value={payoutFormData.payout_frequency}
                      onChange={(e) => setPayoutFormData({ ...payoutFormData, payout_frequency: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="weekly">Weekly</option>
                      <option value="biweekly">Bi-weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Currency
                    </label>
                    <select
                      value={payoutFormData.currency}
                      onChange={(e) => setPayoutFormData({ ...payoutFormData, currency: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="IDR">Indonesian Rupiah (IDR)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tax Rate (%)
                    </label>
                    <input
                      type="number"
                      value={payoutFormData.tax_rate}
                      onChange={(e) => setPayoutFormData({ ...payoutFormData, tax_rate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      min="0"
                      max="50"
                      step="0.5"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Applied tax rate for payouts
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="auto_payout"
                    checked={payoutFormData.auto_payout}
                    onChange={(e) => setPayoutFormData({ ...payoutFormData, auto_payout: e.target.checked })}
                    className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <label htmlFor="auto_payout" className="ml-2 text-sm text-gray-700">
                    Enable automatic payouts
                  </label>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                  >
                    <DollarSign className="w-4 h-4" />
                    <span>Update Payout Settings</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
