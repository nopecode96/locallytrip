import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../services/authAPI';

export interface Bank {
  id: number;
  bank_code: string;
  bank_name: string;
  bank_name_short: string;
  swift_code?: string;
  logo_url?: string;
}

export interface UserBankAccount {
  id: number;
  user_id: number;
  bank_id: number;
  account_number: string;
  account_holder_name: string;
  branch_name?: string;
  branch_code?: string;
  is_primary: boolean;
  is_verified: boolean;
  verification_date?: string;
  is_active: boolean;
  bank: Bank;
}

export interface PayoutSettings {
  id: number;
  user_id: number;
  minimum_payout: number;
  payout_frequency: 'weekly' | 'biweekly' | 'monthly';
  auto_payout: boolean;
  currency: string;
  tax_rate: number;
  is_active: boolean;
}

export interface PayoutHistory {
  id: number;
  user_id: number;
  user_bank_account_id: number;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  payout_reference?: string;
  processed_date?: string;
  completed_date?: string;
  failure_reason?: string;
  platform_fee: number;
  tax_amount: number;
  net_amount: number;
  period_start: string;
  period_end: string;
  bankAccount: {
    bank: Bank;
  };
}

export const usePaymentData = () => {
  const { user } = useAuth();
  const [banks, setBanks] = useState<Bank[]>([]);
  const [bankAccounts, setBankAccounts] = useState<UserBankAccount[]>([]);
  const [payoutSettings, setPayoutSettings] = useState<PayoutSettings | null>(null);
  const [payoutHistory, setPayoutHistory] = useState<PayoutHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeaders = () => {
    const token = authAPI.getToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  // Fetch banks
  const fetchBanks = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/payments/banks/', {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.success) {
        setBanks(data.data);
      } else {
        setError(data.message || 'Failed to fetch banks');
      }
    } catch (error) {
      console.error('Error fetching banks:', error);
      setError('Failed to fetch banks');
    } finally {
      setLoading(false);
    }
  };

  // Fetch user bank accounts
  const fetchBankAccounts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/payments/bank-accounts/', {
        headers: getAuthHeaders(),
      });

      const data = await response.json();
      if (data.success) {
        setBankAccounts(data.data);
      } else {
        setError(data.message || 'Failed to fetch bank accounts');
      }
    } catch (error) {
      console.error('Error fetching bank accounts:', error);
      setError('Failed to fetch bank accounts');
    } finally {
      setLoading(false);
    }
  };

  // Add bank account
  const addBankAccount = async (accountData: {
    bank_id: number;
    account_number: string;
    account_holder_name: string;
    branch_name?: string;
    branch_code?: string;
    is_primary?: boolean;
  }) => {
    try {
      setLoading(true);
      const response = await fetch('/api/payments/bank-accounts/', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(accountData),
      });

      const data = await response.json();
      if (data.success) {
        await fetchBankAccounts(); // Refresh list
        return { success: true, data: data.data };
      } else {
        setError(data.message || 'Failed to add bank account');
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error('Error adding bank account:', error);
      setError('Failed to add bank account');
      return { success: false, error: 'Failed to add bank account' };
    } finally {
      setLoading(false);
    }
  };

  // Update bank account
  const updateBankAccount = async (
    accountId: number,
    accountData: {
      account_number?: string;
      account_holder_name?: string;
      branch_name?: string;
      branch_code?: string;
      is_primary?: boolean;
    }
  ) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/payments/bank-accounts/${accountId}/`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(accountData),
      });

      const data = await response.json();
      if (data.success) {
        await fetchBankAccounts(); // Refresh list
        return { success: true, data: data.data };
      } else {
        setError(data.message || 'Failed to update bank account');
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error('Error updating bank account:', error);
      setError('Failed to update bank account');
      return { success: false, error: 'Failed to update bank account' };
    } finally {
      setLoading(false);
    }
  };

  // Delete bank account
  const deleteBankAccount = async (accountId: number) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/payments/bank-accounts/${accountId}/`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      const data = await response.json();
      if (data.success) {
        await fetchBankAccounts(); // Refresh list
        return { success: true };
      } else {
        setError(data.message || 'Failed to delete bank account');
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error('Error deleting bank account:', error);
      setError('Failed to delete bank account');
      return { success: false, error: 'Failed to delete bank account' };
    } finally {
      setLoading(false);
    }
  };

  // Fetch payout settings
  const fetchPayoutSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/payments/payout-settings/', {
        headers: getAuthHeaders(),
      });

      const data = await response.json();
      if (data.success) {
        setPayoutSettings(data.data);
      } else {
        setError(data.message || 'Failed to fetch payout settings');
      }
    } catch (error) {
      console.error('Error fetching payout settings:', error);
      setError('Failed to fetch payout settings');
    } finally {
      setLoading(false);
    }
  };

  // Update payout settings
  const updatePayoutSettings = async (settingsData: {
    minimum_payout?: number;
    payout_frequency?: 'weekly' | 'biweekly' | 'monthly';
    auto_payout?: boolean;
    currency?: string;
    tax_rate?: number;
  }) => {
    try {
      setLoading(true);
      const response = await fetch('/api/payments/payout-settings/', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(settingsData),
      });

      const data = await response.json();
      if (data.success) {
        setPayoutSettings(data.data);
        return { success: true, data: data.data };
      } else {
        setError(data.message || 'Failed to update payout settings');
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error('Error updating payout settings:', error);
      setError('Failed to update payout settings');
      return { success: false, error: 'Failed to update payout settings' };
    } finally {
      setLoading(false);
    }
  };

  // Fetch payout history
  const fetchPayoutHistory = async (params?: { page?: number; limit?: number; status?: string }) => {
    try {
      setLoading(true);
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.append('page', params.page.toString());
      if (params?.limit) searchParams.append('limit', params.limit.toString());
      if (params?.status) searchParams.append('status', params.status);

      const response = await fetch(`/api/payments/payout-history/?${searchParams.toString()}`, {
        headers: getAuthHeaders(),
      });

      const data = await response.json();
      if (data.success) {
        setPayoutHistory(data.data);
        return { success: true, data: data.data, pagination: data.pagination };
      } else {
        setError(data.message || 'Failed to fetch payout history');
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error('Error fetching payout history:', error);
      setError('Failed to fetch payout history');
      return { success: false, error: 'Failed to fetch payout history' };
    } finally {
      setLoading(false);
    }
  };

  // Load initial data when user is available
  useEffect(() => {
    if (user) {
      fetchBanks();
      fetchBankAccounts();
      fetchPayoutSettings();
      fetchPayoutHistory();
    }
  }, [user]);

  return {
    banks,
    bankAccounts,
    payoutSettings,
    payoutHistory,
    loading,
    error,
    setError,
    fetchBanks,
    fetchBankAccounts,
    addBankAccount,
    updateBankAccount,
    deleteBankAccount,
    fetchPayoutSettings,
    updatePayoutSettings,
    fetchPayoutHistory,
  };
};
