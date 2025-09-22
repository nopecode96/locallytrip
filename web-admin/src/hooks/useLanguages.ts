import { useState, useEffect } from 'react';
import { Language, LanguageFormData } from '@/types/masterData';

interface UseLanguagesResult {
  languages: Language[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  createLanguage: (data: LanguageFormData) => Promise<void>;
  updateLanguage: (id: number, data: Partial<LanguageFormData>) => Promise<void>;
  deleteLanguage: (id: number) => Promise<void>;
  toggleStatus: (id: number) => Promise<void>;
}

export const useLanguages = (): UseLanguagesResult => {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLanguages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/languages');
      const data = await response.json();
      
      if (data.success) {
        setLanguages(data.data);
      } else {
        throw new Error(data.error || 'Failed to fetch languages');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching languages:', err);
    } finally {
      setLoading(false);
    }
  };

  const createLanguage = async (languageData: LanguageFormData) => {
    try {
      setError(null);
      
      const response = await fetch('/api/languages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(languageData),
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchLanguages();
      } else {
        throw new Error(data.error || 'Failed to create language');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const updateLanguage = async (id: number, languageData: Partial<LanguageFormData>) => {
    try {
      setError(null);
      
      const response = await fetch(`/api/languages/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(languageData),
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchLanguages();
      } else {
        throw new Error(data.error || 'Failed to update language');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const deleteLanguage = async (id: number) => {
    try {
      setError(null);
      
      const response = await fetch(`/api/languages/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchLanguages();
      } else {
        throw new Error(data.error || 'Failed to delete language');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const toggleStatus = async (id: number) => {
    try {
      setError(null);
      
      const language = languages.find(l => l.id === id);
      if (!language) {
        throw new Error('Language not found');
      }

      await updateLanguage(id, { is_active: !language.is_active });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  useEffect(() => {
    fetchLanguages();
  }, []);

  return {
    languages,
    loading,
    error,
    refetch: fetchLanguages,
    createLanguage,
    updateLanguage,
    deleteLanguage,
    toggleStatus,
  };
};