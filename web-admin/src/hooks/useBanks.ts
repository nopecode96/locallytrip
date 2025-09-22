import { useState, useEffect } from 'react';
import { Bank, BankFormData } from '@/types/masterData';

interface UseBanksResult {
  banks: Bank[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  createBank: (data: BankFormData) => Promise<void>;
  updateBank: (id: number, data: Partial<BankFormData>) => Promise<void>;
  deleteBank: (id: number) => Promise<void>;
  toggleStatus: (id: number) => Promise<void>;
}

export const useBanks = (): UseBanksResult => {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBanks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/banks');
      const data = await response.json();
      
      if (data.success) {
        setBanks(data.data);
      } else {
        throw new Error(data.error || 'Failed to fetch banks');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching banks:', err);
    } finally {
      setLoading(false);
    }
  };

  const createBank = async (bankData: BankFormData) => {
    try {
      setError(null);
      
      const response = await fetch('/api/banks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bankData),
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchBanks(); // Refresh the list
      } else {
        throw new Error(data.error || 'Failed to create bank');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const updateBank = async (id: number, bankData: Partial<BankFormData>) => {
    try {
      setError(null);
      
      const response = await fetch(`/api/banks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bankData),
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchBanks(); // Refresh the list
      } else {
        throw new Error(data.error || 'Failed to update bank');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const deleteBank = async (id: number) => {
    try {
      setError(null);
      
      const response = await fetch(`/api/banks/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchBanks(); // Refresh the list
      } else {
        throw new Error(data.error || 'Failed to delete bank');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const toggleStatus = async (id: number) => {
    try {
      setError(null);
      
      const bank = banks.find(b => b.id === id);
      if (!bank) {
        throw new Error('Bank not found');
      }

      await updateBank(id, { is_active: !bank.is_active });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  useEffect(() => {
    fetchBanks();
  }, []);

  return {
    banks,
    loading,
    error,
    refetch: fetchBanks,
    createBank,
    updateBank,
    deleteBank,
    toggleStatus,
  };
};