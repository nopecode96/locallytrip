import { useState, useEffect } from 'react';

interface PriceRangeData {
  minPrice: number;
  maxPrice: number;
  currency: string;
  totalExperiences: number;
}

interface PriceRangeResponse {
  success: boolean;
  data: PriceRangeData;
  message?: string;
}

export const usePriceRange = (currency: string = 'IDR') => {
  const [priceRange, setPriceRange] = useState<PriceRangeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPriceRange = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/experiences/price-range?currency=${currency}`);
        const result: PriceRangeResponse = await response.json();
        
        if (result.success) {
          setPriceRange(result.data);
        } else {
          setError('Failed to fetch price range');
        }
      } catch (err) {
        
        setError('Failed to fetch price range');
      } finally {
        setLoading(false);
      }
    };

    fetchPriceRange();
  }, [currency]);

  return { priceRange, loading, error };
};

// Helper functions for price formatting
export const formatPrice = (price: number, currency: string = 'IDR'): string => {
  if (currency === 'IDR') {
    // Format IDR: 250,000 → Rp 250K, 1,200,000 → Rp 1.2M
    if (price >= 1000000) {
      return `Rp ${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `Rp ${(price / 1000).toFixed(0)}K`;
    } else {
      return `Rp ${price.toLocaleString('id-ID')}`;
    }
  } else {
    // Format USD
    return `$${price}`;
  }
};

export const formatPriceInput = (price: number, currency: string = 'IDR'): string => {
  if (currency === 'IDR') {
    return `Rp ${price.toLocaleString('id-ID')}`;
  } else {
    return `$${price}`;
  }
};
