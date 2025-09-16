import { useState, useCallback } from 'react';

interface Language {
  id: number;
  name: string;
  code: string;
  nativeName?: string;
}

interface UseLanguagesAutocompleteReturn {
  searchLanguages: (query: string) => Promise<void>;
  getAllLanguages: () => Promise<void>;
  searchResults: Language[];
  allLanguages: Language[];
  searchLoading: boolean;
  allLoading: boolean;
  error: string | null;
}

export const useLanguagesAutocomplete = (): UseLanguagesAutocompleteReturn => {
  const [searchResults, setSearchResults] = useState<Language[]>([]);
  const [allLanguages, setAllLanguages] = useState<Language[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [allLoading, setAllLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchLanguages = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/languages/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      if (data.success) {
        setSearchResults(data.data);
      } else {
        setError(data.message || 'Failed to search languages');
        setSearchResults([]);
      }
    } catch (err) {
      console.error('Error searching languages:', err);
      setError('Failed to search languages');
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  const getAllLanguages = useCallback(async () => {
    setAllLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/languages');
      const data = await response.json();
      
      if (data.success) {
        setAllLanguages(data.data);
      } else {
        setError(data.message || 'Failed to load languages');
      }
    } catch (err) {
      console.error('Error loading languages:', err);
      setError('Failed to load languages');
    } finally {
      setAllLoading(false);
    }
  }, []);

  return {
    searchLanguages,
    getAllLanguages,
    searchResults,
    allLanguages,
    searchLoading,
    allLoading,
    error
  };
};
