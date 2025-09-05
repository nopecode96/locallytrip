'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { useStoriesURL } from '@/hooks/useStoriesURL';

interface StoriesFiltersProps {
  onFiltersChange: (filters: StoriesFilters) => void;
  initialFilters?: StoriesFilters;
}

export interface StoriesFilters {
  search: string;
  category: string;
  featured: boolean;
}

const STORY_CATEGORIES = [
  'Adventure',
  'Culture', 
  'Food',
  'Nature',
  'City',
  'Beach',
  'Mountain',
  'Historical',
  'Budget Travel',
  'Luxury Travel',
  'Solo Travel',
  'Family Travel'
];

const StoriesFilters: React.FC<StoriesFiltersProps> = ({ 
  onFiltersChange, 
  initialFilters = { search: '', category: '', featured: false }
}) => {
  const { currentParams, updateURL } = useStoriesURL();
  
  // Current active filters
  const [filters, setFilters] = useState<StoriesFilters>(initialFilters);
  
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Initialize filters from URL on mount
  useEffect(() => {
    const urlFilters: StoriesFilters = {
      search: currentParams.search || '',
      category: currentParams.category || '',
      featured: currentParams.featured === 'true'
    };
    setFilters(urlFilters);
    onFiltersChange(urlFilters);
  }, []); // Remove dependencies to prevent infinite loop

  // Handle search input with debounce
  const handleSearchChange = (searchTerm: string) => {
    const updatedFilters = { ...filters, search: searchTerm };
    setFilters(updatedFilters);
    
    // Update URL immediately for visual feedback
    updateURL({
      search: searchTerm || undefined,
      category: updatedFilters.category || undefined,
      featured: updatedFilters.featured ? 'true' : undefined
    });
    
    // Call parent immediately
    onFiltersChange(updatedFilters);
  };

  const updateFilters = (newFilters: Partial<StoriesFilters>) => {
    if (newFilters.search !== undefined) {
      handleSearchChange(newFilters.search);
      return;
    }
    
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    
    // Update URL immediately for non-search filters
    updateURL({
      search: updatedFilters.search || undefined,
      category: updatedFilters.category || undefined,
      featured: updatedFilters.featured ? 'true' : undefined
    });
    
    onFiltersChange(updatedFilters);
  };

  // Handle search updates with debounce
  const updateSearch = useCallback((searchTerm: string) => {
    updateFilters({ search: searchTerm });
  }, [updateFilters]);

  const resetFilters = () => {
    const clearedFilters = { search: '', category: '', featured: false };
    setFilters(clearedFilters);
    
    // Clear URL parameters
    updateURL({
      search: undefined,
      category: undefined,
      featured: undefined
    });
    
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = filters.search || filters.category || filters.featured;

  return (
    <div className="bg-white/80 backdrop-blur-lg border border-white/20 rounded-3xl shadow-xl">
      <div className="p-6">
        {/* Desktop Filters - GenZ Style */}
        <div className="hidden lg:block">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Search with emoji */}
            <div className="flex-1 min-w-64">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-purple-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search for epic stories... 🔍"
                  value={filters.search}
                  onChange={(e) => updateSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:ring-0 focus:border-purple-400 focus:bg-white transition-all duration-300 placeholder-gray-400"
                />
              </div>
            </div>

            {/* Category Filter - Pill Style */}
            <div className="min-w-48">
              <select
                value={filters.category}
                onChange={(e) => updateFilters({ category: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:ring-0 focus:border-pink-400 focus:bg-white transition-all duration-300 cursor-pointer"
              >
                <option value="">All Vibes ✨</option>
                {STORY_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category} {category === 'Adventure' ? '🏔️' : category === 'Food' ? '🍜' : category === 'Beach' ? '🏖️' : category === 'City' ? '🏙️' : '✈️'}
                  </option>
                ))}
              </select>
            </div>

            {/* Featured Toggle - Switch Style */}
            <div className="flex items-center">
              <label className="flex items-center cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={filters.featured}
                    onChange={(e) => updateFilters({ featured: e.target.checked })}
                    className="sr-only"
                  />
                  <div className={`w-14 h-7 rounded-full transition-all duration-300 ${filters.featured ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gray-300'}`}>
                    <div className={`w-5 h-5 bg-white rounded-full shadow-lg transform transition-all duration-300 ${filters.featured ? 'translate-x-8' : 'translate-x-1'} mt-1`}>
                    </div>
                  </div>
                </div>
                <span className="ml-3 font-semibold text-gray-700 group-hover:text-purple-600 transition-colors">
                  🔥 Hot Stories Only
                </span>
              </label>
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-2xl hover:bg-red-200 transition-all duration-300 font-medium"
              >
                <X className="w-4 h-4" />
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Mobile Filters Button */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Stories ✨
            </h3>
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-2 border-purple-200 rounded-2xl hover:from-purple-200 hover:to-pink-200 transition-all duration-300 font-semibold"
            >
              <Filter className="w-4 h-4" />
              Filters {hasActiveFilters && `(${[filters.search, filters.category, filters.featured].filter(Boolean).length})`}
            </button>
          </div>

          {/* Mobile Search Always Visible */}
          <div className="mb-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-purple-500 transition-colors" />
              <input
                type="text"
                placeholder="Search epic stories... 🔍"
                value={filters.search}
                onChange={(e) => updateSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:ring-0 focus:border-purple-400 focus:bg-white transition-all duration-300 placeholder-gray-400"
              />
            </div>
          </div>

          {/* Mobile Filter Panel */}
          {showMobileFilters && (
            <div className="space-y-4 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-100 animate-fadeIn">
              {/* Category */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Category Vibes</label>
                <select
                  value={filters.category}
                  onChange={(e) => updateFilters({ category: e.target.value })}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-2xl focus:ring-0 focus:border-pink-400 transition-all duration-300"
                >
                  <option value="">All Vibes ✨</option>
                  {STORY_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category} {category === 'Adventure' ? '🏔️' : category === 'Food' ? '🍜' : category === 'Beach' ? '🏖️' : category === 'City' ? '🏙️' : '✈️'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Featured Toggle */}
              <div>
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={filters.featured}
                      onChange={(e) => updateFilters({ featured: e.target.checked })}
                      className="sr-only"
                    />
                    <div className={`w-14 h-7 rounded-full transition-all duration-300 ${filters.featured ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gray-300'}`}>
                      <div className={`w-5 h-5 bg-white rounded-full shadow-lg transform transition-all duration-300 ${filters.featured ? 'translate-x-8' : 'translate-x-1'} mt-1`}>
                      </div>
                    </div>
                  </div>
                  <span className="ml-3 font-semibold text-gray-700">
                    🔥 Hot Stories Only
                  </span>
                </label>
              </div>

              {/* Clear Button */}
              {hasActiveFilters && (
                <button
                  onClick={() => {
                    resetFilters();
                    setShowMobileFilters(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-100 text-red-600 rounded-2xl hover:bg-red-200 transition-all duration-300 font-semibold"
                >
                  <X className="w-4 h-4" />
                  Clear All Filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Active Filters Pills */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
            {filters.search && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                🔍 "{filters.search}"
                <button
                  onClick={() => updateFilters({ search: '' })}
                  className="ml-1 hover:text-purple-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.category && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium">
                ✨ {filters.category}
                <button
                  onClick={() => updateFilters({ category: '' })}
                  className="ml-1 hover:text-pink-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.featured && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                🔥 Featured
                <button
                  onClick={() => updateFilters({ featured: false })}
                  className="ml-1 hover:text-orange-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StoriesFilters;
