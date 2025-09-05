import { useState, useEffect } from 'react';

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  emoji?: string;
  description: string;
}

interface CategoriesResponse {
  success: boolean;
  data: Category[];
  message?: string;
}

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const response = await fetch(`${apiUrl}/host-categories`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: CategoriesResponse = await response.json();
        
        if (data.success) {
          setCategories(data.data);
        } else {
          throw new Error(data.message || 'Failed to fetch categories');
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch categories');
        
  // Fallback dihapus, hanya gunakan data dari backend
        setCategories([
          { 
            id: '588dfbca-029e-4646-9b42-f032c38ffabe', 
            name: 'Local Guide', 
            slug: 'tour-guide', 
            icon: '🧑‍💼',
            emoji: '🧑‍💼',
            description: 'Expert local guides'
          },
          { 
            id: '3e38175b-2d40-43c7-8610-874260271217', 
            name: 'Photographer', 
            slug: 'photographer', 
            icon: '📸',
            emoji: '📸',
            description: 'Professional photography services'
          },
          { 
            id: '178a041e-31b8-4e50-9617-a6a6787d8f55', 
            name: 'Trip Planner', 
            slug: 'trip-planner', 
            icon: '📝',
            emoji: '📝',
            description: 'Customized trip planning'
          },
          { 
            id: '4332e567-563c-4277-9db5-bdad07067845', 
            name: 'Combo Tour', 
            slug: 'combo-tour', 
            icon: '🎯',
            emoji: '🎯',
            description: 'Multi-service experiences'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Helper functions
  const getCategoryBySlug = (slug: string) => 
    categories.find(cat => cat.slug === slug);

  const getCategoryById = (id: string) => 
    categories.find(cat => cat.id === id);

  const getCategoryUuidsBySlug = (slugs: string[]) => 
    slugs.map(slug => getCategoryBySlug(slug)?.id).filter(Boolean) as string[];

  const getCategoryUuidsByIdOrSlug = (identifiers: string[]) => 
    identifiers.map(identifier => {
      // First try by slug
      let category = getCategoryBySlug(identifier);
      // If not found, try by ID (for cases where we use ID as fallback)
      if (!category) {
        category = categories.find(cat => cat.id.toString() === identifier);
      }
      // If still not found, try by name-based slug
      if (!category) {
        category = categories.find(cat => 
          cat.name.toLowerCase().replace(/\s+/g, '-') === identifier
        );
      }
      return category?.id;
    }).filter(Boolean) as string[];

  return {
    categories,
    loading,
    error,
    getCategoryBySlug,
    getCategoryById,
    getCategoryUuidsBySlug,
    getCategoryUuidsByIdOrSlug
  };
};
