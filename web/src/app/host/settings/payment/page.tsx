'use client';

import { useState, useEffect } from 'react';
import { CreditCard, Building2, DollarSign, Plus, Edit, Trash2, Check, X, AlertCircle } from 'lucide-react';
import { usePaymentData, type Bank, type UserBankAccount } from '../../../../hooks/usePaymentData';
import { useAuth } from '../../../../contexts/AuthContext';
import { useToast } from '../../../../contexts/ToastContext';

interface BankAccountFormData {
  bank_id: number;
  account_number: string;
  account_holder_name: string;
  branch_name: string;
  branch_code: string;
  is_primary: boolean;
}

export default function PaymentSettingsPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { showToast } = useToast();
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

  // Autocomplete states
  const [bankSearchTerm, setBankSearchTerm] = useState('');
  const [showBankDropdown, setShowBankDropdown] = useState(false);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);

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

  // Filter banks based on search term
  const filteredBanks = banks.filter(bank => 
    bank.bank_name.toLowerCase().includes(bankSearchTerm.toLowerCase()) ||
    bank.bank_code.toLowerCase().includes(bankSearchTerm.toLowerCase()) ||
    (bank.bank_name_short && bank.bank_name_short.toLowerCase().includes(bankSearchTerm.toLowerCase())) ||
    (bank.swift_code && bank.swift_code.toLowerCase().includes(bankSearchTerm.toLowerCase()))
  );

  const handleBankSelect = (bank: Bank) => {
    setSelectedBank(bank);
    setBankSearchTerm(`${bank.bank_name} (${bank.bank_code})`);
    setFormData({ ...formData, bank_id: bank.id });
    setShowBankDropdown(false);
  };

  const handleBankSearchChange = (value: string) => {
    setBankSearchTerm(value);
    setShowBankDropdown(true);
    if (!value) {
      setSelectedBank(null);
      setFormData({ ...formData, bank_id: 0 });
    }
  };

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
    setBankSearchTerm('');
    setSelectedBank(null);
    setShowBankDropdown(false);
  };

  const handleCancelForm = () => {
    resetForm();
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
    
    // Set bank autocomplete for editing
    const selectedBank = banks.find(bank => bank.id === account.bank_id);
    if (selectedBank) {
      setSelectedBank(selectedBank);
      setBankSearchTerm(`${selectedBank.bank_name} (${selectedBank.bank_code})`);
    }
    
    setShowAddForm(true);
  };

  const handleSubmitBankAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

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
      showToast(editingAccount ? 'Bank account updated successfully' : 'Bank account added successfully', 'success');
      handleCancelForm();
    } else {
      showToast(result.error || 'Failed to save bank account', 'error');
    }
  };

  const handleDeleteAccount = async (accountId: number) => {
    if (window.confirm('Are you sure you want to delete this bank account?')) {
      const result = await deleteBankAccount(accountId);
      if (result.success) {
        showToast('Bank account deleted successfully', 'success');
      } else {
        showToast(result.error || 'Failed to delete bank account', 'error');
      }
    }
  };

  const handleUpdatePayoutSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = await updatePayoutSettings({
      minimum_payout: parseFloat(payoutFormData.minimum_payout),
      payout_frequency: payoutFormData.payout_frequency as 'weekly' | 'biweekly' | 'monthly',
      auto_payout: payoutFormData.auto_payout,
      currency: payoutFormData.currency,
      tax_rate: parseFloat(payoutFormData.tax_rate),
    });

    if (result.success) {
      showToast('Payout settings updated successfully', 'success');
    } else {
      showToast(result.error || 'Failed to update payout settings', 'error');
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

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-100 text-red-800 border border-red-200">
            {error}
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
                  disabled={loading}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bank *
                      </label>
                      <input
                        type="text"
                        value={bankSearchTerm}
                        onChange={(e) => handleBankSearchChange(e.target.value)}
                        onFocus={() => setShowBankDropdown(true)}
                        placeholder="Search bank by name, code, or SWIFT code..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                        disabled={!!editingAccount}
                      />
                      
                      {/* Bank Dropdown */}
                      {showBankDropdown && filteredBanks.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {filteredBanks.map((bank) => (
                            <div
                              key={bank.id}
                              onClick={() => handleBankSelect(bank)}
                              className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900">{bank.bank_name}</div>
                                  <div className="text-sm text-gray-500">
                                    {bank.bank_name_short && (
                                      <span className="mr-2">Short: {bank.bank_name_short}</span>
                                    )}
                                  </div>
                                </div>
                                <div className="text-right text-sm">
                                  <div className="font-mono text-gray-700">Code: {bank.bank_code}</div>
                                  {bank.swift_code && (
                                    <div className="font-mono text-gray-500">SWIFT: {bank.swift_code}</div>
                                  )}
                                  {bank.country_code && (
                                    <div className="font-mono text-gray-500">Country: {bank.country_code}</div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Close dropdown when clicking outside */}
                      {showBankDropdown && (
                        <div 
                          className="fixed inset-0 z-5" 
                          onClick={() => setShowBankDropdown(false)}
                        />
                      )}
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
                      onClick={handleCancelForm}
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
        </div>
      </div>
    </div>
  );
}
