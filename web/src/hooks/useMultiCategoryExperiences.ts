import { useState, useEffect } from 'react';
import { experienceAPI, Experience, ExperienceFilters, ExperiencesResponse } from '@/services/experienceAPI';

interface MultiCategoryFilters extends Omit<ExperienceFilters, 'category'> {
  categories?: string[];
  minRating?: number;
}

export const useMultiCategoryExperiences = (filters: MultiCategoryFilters = {}) => {
  const [data, setData] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0,
    currentPage: 1,
    hasNext: false,
    hasPrev: false,
  });

  const fetchMultiCategoryExperiences = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Add a small delay to prevent rapid API calls
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const { categories, ...baseFilters } = filters;
      
      if (!categories || categories.length === 0) {
        // No categories selected, fetch all experiences
        const response = await experienceAPI.getAllExperiences(baseFilters);
        
        if (response.success) {
          let filteredExperiences = response.data.experiences;
          
          // Apply rating filter if specified
          if (filters.minRating) {
            filteredExperiences = filteredExperiences.filter(exp => 
              exp.rating && exp.rating >= filters.minRating!
            );
          }
          
          setData(filteredExperiences);
          setPagination({
            ...response.data.pagination,
            total: filteredExperiences.length
          });
        } else {
          setData([]);
          setPagination({
            total: 0,
            pages: 0,
            currentPage: 1,
            hasNext: false,
            hasPrev: false,
          });
        }
        return;
      }

      if (categories.length === 1) {
        // Single category, use normal API call
        const response = await experienceAPI.getAllExperiences({
          ...baseFilters,
          category: categories[0]
        });
        
        if (response.success) {
          let filteredExperiences = response.data.experiences;
          
          // Apply rating filter if specified
          if (filters.minRating) {
            filteredExperiences = filteredExperiences.filter(exp => 
              exp.rating && exp.rating >= filters.minRating!
            );
          }
          
          setData(filteredExperiences);
          setPagination({
            ...response.data.pagination,
            total: filteredExperiences.length
          });
        } else {
          setData([]);
          setPagination({
            total: 0,
            pages: 0,
            currentPage: 1,
            hasNext: false,
            hasPrev: false,
          });
        }
        return;
      }

      // Multiple categories - make multiple API calls and combine results
      const promises = categories.map(category => 
        experienceAPI.getAllExperiences({
          ...baseFilters,
          category,
          limit: Math.ceil((baseFilters.limit || 12) / categories.length) // Distribute limit across categories
        })
      );

      const responses = await Promise.all(promises);
      const allExperiences: Experience[] = [];
      const seenIds = new Set<string>();

      // Combine and deduplicate results
      responses.forEach(response => {
        if (response.success) {
          response.data.experiences.forEach(exp => {
            if (!seenIds.has(exp.id)) {
              // Apply rating filter if specified
              if (!filters.minRating || (exp.rating && exp.rating >= filters.minRating)) {
                seenIds.add(exp.id);
                allExperiences.push(exp);
              }
            }
          });
        }
      });

      // Sort by rating/featured status
      allExperiences.sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return (b.rating || 0) - (a.rating || 0);
      });

      // Apply limit
      const limitedExperiences = allExperiences.slice(0, baseFilters.limit || 12);
      
      setData(limitedExperiences);
      setPagination({
        total: allExperiences.length,
        pages: Math.ceil(allExperiences.length / (baseFilters.limit || 12)),
        currentPage: baseFilters.page || 1,
        hasNext: allExperiences.length > (baseFilters.limit || 12),
        hasPrev: (baseFilters.page || 1) > 1,
      });

    } catch (err) {
      setData([]);
      setPagination({
        total: 0,
        pages: 0,
        currentPage: 1,
        hasNext: false,
        hasPrev: false,
      });
      
      if (err instanceof Error && !err.message.includes('404')) {
        setError('Unable to load experiences. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMultiCategoryExperiences();
  }, [JSON.stringify(filters)]);

  return {
    experiences: data,
    loading,
    error,
    pagination,
    refetch: fetchMultiCategoryExperiences,
  };
};
