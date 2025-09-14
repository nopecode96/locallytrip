'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, X, MapPin, ChevronDown } from 'lucide-react';
import { useStoriesURL } from '@/hooks/useStoriesURL';
import { useCitiesSearch, City } from '@/hooks/useCitiesSearch';

interface StoriesFiltersProps {
  onFiltersChange: (filters: StoriesFilters) => void;
  initialFilters?: StoriesFilters;
}

export interface StoriesFilters {
  search: string;
  cityId: string;
  featured: boolean;
}

const StoriesFilters: React.FC<StoriesFiltersProps> = ({ 
  onFiltersChange, 
  initialFilters = { search: '', cityId: '', featured: false }
}) => {
  const { currentParams, updateURL } = useStoriesURL();
  const { cities, loading: citiesLoading, searchCities } = useCitiesSearch();
  
  // Current active filters
  const [filters, setFilters] = useState<StoriesFilters>(initialFilters);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // City autocomplete states
  const [cityQuery, setCityQuery] = useState('');
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  // Initialize filters from URL on mount
  useEffect(() => {
    const urlFilters: StoriesFilters = {
      search: currentParams.search || '',
      cityId: currentParams.cityId || '',
      featured: currentParams.featured === 'true'
    };
    setFilters(urlFilters);
    onFiltersChange(urlFilters);
    
    // If there's a cityId in URL, load the city data
    if (urlFilters.cityId) {
      loadCityFromId(urlFilters.cityId);
    }
  }, []); // Remove dependencies to prevent infinite loop

  // Load city data from cityId
  const loadCityFromId = async (cityId: string) => {
    try {
      const response = await fetch(`/api/cities/${cityId}/`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          const cityData = {
            id: data.data.id,
            name: data.data.name,
            country: data.data.country || 'Unknown',
            displayName: `${data.data.name}${data.data.country ? `, ${data.data.country}` : ''}`
          };
          setSelectedCity(cityData);
          setCityQuery(cityData.displayName);
        }
      }
    } catch (error) {
      console.error('Error loading city:', error);
    }
  };

  // Handle search input with debounce
  const handleSearchChange = (searchTerm: string) => {
    const updatedFilters = { ...filters, search: searchTerm };
    setFilters(updatedFilters);
    
    // Update URL immediately for visual feedback
    updateURL({
      search: searchTerm || undefined,
      cityId: updatedFilters.cityId || undefined,
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
      cityId: updatedFilters.cityId || undefined,
      featured: updatedFilters.featured ? 'true' : undefined
    });
    
    onFiltersChange(updatedFilters);
  };

  // Handle search updates with debounce
  const updateSearch = useCallback((searchTerm: string) => {
    updateFilters({ search: searchTerm });
  }, [updateFilters]);

  // Handle city search
  const handleCitySearch = useCallback(async (query: string) => {
    setCityQuery(query);
    if (query.length >= 2) {
      setShowCityDropdown(true);
      await searchCities(query);
    } else {
      setShowCityDropdown(false);
    }
    
    // Clear selected city if user is typing new query
    if (selectedCity && query !== selectedCity.displayName) {
      setSelectedCity(null);
      updateFilters({ cityId: '' });
    }
  }, [searchCities, selectedCity, updateFilters]);

  // Handle city selection
  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
    setCityQuery(city.displayName);
    setShowCityDropdown(false);
    updateFilters({ cityId: city.id.toString() });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowCityDropdown(false);
    };
    
    if (showCityDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showCityDropdown]);

  // Clear city selection
  const clearCitySelection = () => {
    setSelectedCity(null);
    setCityQuery('');
    setShowCityDropdown(false);
    updateFilters({ cityId: '' });
  };

  const resetFilters = () => {
    const clearedFilters = { search: '', cityId: '', featured: false };
    setFilters(clearedFilters);
    setSelectedCity(null);
    setCityQuery('');
    setShowCityDropdown(false);
    
    // Clear URL parameters
    updateURL({
      search: undefined,
      cityId: undefined,
      featured: undefined
    });
    
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = filters.search || filters.cityId || filters.featured;

  return (
    <div className="bg-white/80 backdrop-blur-lg border border-white/20 rounded-3xl shadow-xl relative z-10">
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

            {/* City Filter - Autocomplete Style */}
            <div className="min-w-60 relative" onClick={(e) => e.stopPropagation()}>
              <div className="relative group">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-pink-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search city... 🌍"
                  value={cityQuery}
                  onChange={(e) => handleCitySearch(e.target.value)}
                  onFocus={() => cityQuery.length >= 2 && setShowCityDropdown(true)}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full pl-12 pr-10 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:ring-0 focus:border-pink-400 focus:bg-white transition-all duration-300 placeholder-gray-400"
                />
                {selectedCity && (
                  <button
                    onClick={clearCitySelection}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <ChevronDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 transition-transform ${showCityDropdown ? 'rotate-180' : ''}`} />
              </div>
              
              {/* City Dropdown */}
              {showCityDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-2xl shadow-xl z-[9999] max-h-60 overflow-y-auto">
                  {citiesLoading ? (
                    <div className="p-4 text-center text-gray-500">
                      <div className="animate-spin w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full mx-auto"></div>
                      <span className="mt-2 block">Searching cities...</span>
                    </div>
                  ) : cities.length > 0 ? (
                    cities.map((city) => (
                      <button
                        key={city.id}
                        onClick={() => handleCitySelect(city)}
                        className="w-full text-left px-4 py-3 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-200 border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-pink-500" />
                          <span className="font-medium text-gray-900">{city.name}</span>
                          <span className="text-gray-500 text-sm">{city.country}</span>
                        </div>
                      </button>
                    ))
                  ) : cityQuery.length >= 2 ? (
                    <div className="p-4 text-center text-gray-500">
                      <MapPin className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      <span>No cities found 🏙️</span>
                    </div>
                  ) : null}
                </div>
              )}
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
              Filters {hasActiveFilters && `(${[filters.search, filters.cityId].filter(Boolean).length})`}
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
              {/* City Filter */}
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <label className="block text-sm font-bold text-gray-700 mb-2">City Location 🌍</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search city..."
                    value={cityQuery}
                    onChange={(e) => handleCitySearch(e.target.value)}
                    onFocus={() => cityQuery.length >= 2 && setShowCityDropdown(true)}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full pl-11 pr-10 py-3 bg-white border-2 border-gray-200 rounded-2xl focus:ring-0 focus:border-pink-400 transition-all duration-300"
                  />
                  {selectedCity && (
                    <button
                      onClick={clearCitySelection}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                {/* Mobile City Dropdown */}
                {showCityDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-2xl shadow-xl z-[9999] max-h-48 overflow-y-auto">
                    {citiesLoading ? (
                      <div className="p-4 text-center text-gray-500">
                        <div className="animate-spin w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full mx-auto"></div>
                        <span className="mt-2 block text-sm">Searching...</span>
                      </div>
                    ) : cities.length > 0 ? (
                      cities.map((city) => (
                        <button
                          key={city.id}
                          onClick={() => handleCitySelect(city)}
                          className="w-full text-left px-4 py-3 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-200 border-b border-gray-100 last:border-b-0"
                        >
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-pink-500" />
                            <span className="font-medium text-gray-900 text-sm">{city.name}</span>
                            <span className="text-gray-500 text-xs">{city.country}</span>
                          </div>
                        </button>
                      ))
                    ) : cityQuery.length >= 2 ? (
                      <div className="p-4 text-center text-gray-500">
                        <MapPin className="w-6 h-6 mx-auto mb-2 text-gray-300" />
                        <span className="text-sm">No cities found</span>
                      </div>
                    ) : null}
                  </div>
                )}
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
            {filters.cityId && selectedCity && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium">
                🌍 {selectedCity.name}, {selectedCity.country}
                <button
                  onClick={() => clearCitySelection()}
                  className="ml-1 hover:text-pink-900"
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
