'use client';

import { useState, useEffect } from 'react';

export interface Experience {
  id: number;
  title: string;
  description: string;
  shortDescription?: string;
  categoryId: number;
  experienceTypeId?: number;
  cityId: number;
  pricePerPackage: number;
  duration: number;
  maxGuests: number;
  minGuests: number;
  currency: string;
  meetingPoint: string;
  endingPoint?: string;
  difficulty: string;
  fitnessLevel: string;
  walkingDistance?: number;
  hostSpecificData?: any;
  includedItems?: string[];
  excludedItems?: string[];
  deliverables?: string[];
  equipmentUsed?: string[];
  itinerary?: any[];
  images?: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
  host?: {
    id: number;
    name: string;
    avatarUrl?: string;
  };
  city?: {
    id: number;
    name: string;
    country?: {
      id: number;
      name: string;
      code: string;
    };
  };
  category?: {
    id: number;
    name: string;
    icon: string;
  };
}

export const useExperience = (experienceId: string) => {
  const [data, setData] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!experienceId) {
      setLoading(false);
      return;
    }

    const fetchExperience = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/experiences/${experienceId}`);
        const result = await response.json();

        if (result.success) {
          setData(result.data);
        } else {
          setError(result.message || 'Failed to fetch experience');
        }
      } catch (err) {
        console.error('Error fetching experience:', err);
        setError('Failed to fetch experience');
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, [experienceId]);

  return { data, loading, error, refetch: () => {
    if (experienceId) {
      const fetchExperience = async () => {
        try {
          setLoading(true);
          setError(null);

          const response = await fetch(`/api/experiences/${experienceId}`);
          const result = await response.json();

          if (result.success) {
            setData(result.data);
          } else {
            setError(result.message || 'Failed to fetch experience');
          }
        } catch (err) {
          console.error('Error fetching experience:', err);
          setError('Failed to fetch experience');
        } finally {
          setLoading(false);
        }
      };

      fetchExperience();
    }
  }};
};
