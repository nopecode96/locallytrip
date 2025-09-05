import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState, useMemo } from 'react';

export interface StoriesURLParams {
  search?: string;
  category?: string;
  featured?: string;
  page?: string;
}

export const useStoriesURL = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Memoize current params to prevent unnecessary re-renders
  const currentParams = useMemo((): StoriesURLParams => {
    if (!searchParams) return {};
    
    const params = {
      search: searchParams.get('search') || undefined,
      category: searchParams.get('category') || undefined,
      featured: searchParams.get('featured') || undefined,
      page: searchParams.get('page') || undefined,
    };
    
    return params;
  }, [searchParams]);

  // Log only when params actually change
  useEffect(() => {
  }, [currentParams]);

  // Update URL with new params
  const updateURL = useCallback((params: StoriesURLParams) => {
    if (!searchParams) return;
    
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    
    // Update or remove each parameter
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === '' || value === 'false') {
        current.delete(key);
      } else {
        current.set(key, value);
      }
    });

    // Reset page when filters change (except when page is being explicitly set)
    if (!params.page && (params.search !== undefined || params.category !== undefined || params.featured !== undefined)) {
      current.delete('page');
    }

    const search = current.toString();
    const query = search ? `?${search}` : '';
    
    router.push(`/stories${query}`, { scroll: false });
  }, [router, searchParams]);

  return {
    updateURL,
    currentParams
  };
};
