'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useMultiCategoryExperiences } from '@/hooks/useMultiCategoryExperiences';
import { useCategories } from '@/hooks/useCategories';
import { useCitiesData } from '@/hooks/useCitiesData';
import { usePriceRange, formatPrice, formatPriceInput } from '@/hooks/usePriceRange';
import { Experience } from '@/services/experienceAPI';
import { ImageService } from '@/services/imageService';
import ExperienceCard from '@/components/ExperienceCard';
import ExperienceSkeleton from '@/components/ExperienceSkeleton';

const DEBUG = false;
const debugLog = (message: string, ...data: any[]) => {
  if (DEBUG) {
  }
};

const ExplorePage: React.FC = () => {
  // Currency preference - could be from user settings or location
  const [currency, setCurrency] = useState<'IDR' | 'USD'>('IDR');
  
  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState(100); // Will be updated from API data

  // Build filters for API
  const [baseFilters, setBaseFilters] = useState<{
    categories?: string[];
    city?: string;
    maxPrice?: number;
    minRating?: number;
    currency?: string;
  }>({});

  // Separate pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Combine base filters with pagination for API
  const filters = {
    ...baseFilters,
    page: currentPage,
    limit: 12
  };

  // Use multi-category API hook
  const { experiences, loading, error, pagination } = useMultiCategoryExperiences(filters);

  // 🚀 NEW: Get dynamic price range from database
  const { priceRange: dbPriceRange, loading: priceLoading } = usePriceRange(currency);

  // Simple debug for pagination

  // 🚀 REAL-TIME API DATA - No more static mappings!
  const { categories, loading: categoriesLoading, getCategoryUuidsByIdOrSlug } = useCategories();
  const { cities, loading: citiesLoading, getCityUuidFromSearch } = useCitiesData();

  // 🔄 DEBUG: Log popular cities data
  useEffect(() => {
    if (!citiesLoading && cities.length > 0) {
    }
  }, [cities, citiesLoading]);

  // 🎯 Handle navigation from homepage service category buttons
  useEffect(() => {
    // Check if there's a selected category from service navigation
    const selectedCategoryData = sessionStorage.getItem("selectedCategory");
    
    if (selectedCategoryData) {
      try {
        const categoryData = JSON.parse(selectedCategoryData);
        
        // Validate that the category slug exists in our service types
        const categorySlugMapping: { [key: string]: string } = {
          'photography': 'photography',
          'tour-guide': 'tour-guide', 
          'combo-tour': 'combo-tour',
          'trip-planner': 'trip-planner'
        };
        
        const mappedSlug = categorySlugMapping[categoryData.slug] || categoryData.slug;
        
        // Set selected services immediately for UI feedback
        setSelectedServices([mappedSlug]);
        
        // Clean up sessionStorage after use
        sessionStorage.removeItem("selectedCategory");
        
      } catch (error) {
      }
    }
  }, []); // Run only on mount - sessionStorage is available immediately

  // 🏙️ Handle navigation from experience detail breadcrumb city click
  useEffect(() => {
    // Check if there's a selected city from breadcrumb navigation
    const selectedCityData = sessionStorage.getItem("selectedCity");
    
    if (selectedCityData) {
      try {
        const cityData = JSON.parse(selectedCityData);
        
        // Set search location to the city name for immediate UI feedback
        setSearchLocation(cityData.name);
        
        // Clean up sessionStorage after use
        sessionStorage.removeItem("selectedCity");
        
      } catch (error) {
      }
    }
  }, []); // Run only on mount

  // Get service types from API data only - NO STATIC FALLBACK
  const serviceTypes = categories.map(cat => ({
    id: cat.slug || cat.id.toString() || cat.name.toLowerCase().replace(/\s+/g, '-'),
    label: cat.name,
    emoji: cat.emoji || '🎯',
    uuid: cat.id
  }));

  // Get category mapping from API data only - NO STATIC FALLBACK
  const categoryMapping: { [key: string]: string } = categories.reduce((acc, cat) => {
    const key = cat.slug || cat.id.toString() || cat.name.toLowerCase().replace(/\s+/g, '-');
    acc[key] = cat.id;
    return acc;
  }, {} as { [key: string]: string });

  // 🔄 Dynamic city mapping from API (replaces static cityMapping)  
  const cityMapping: { [key: string]: string } = cities.reduce((acc, city) => {
    if (city.slug) {
      acc[city.slug] = city.id.toString();
    }
    return acc;
  }, {} as { [key: string]: string });

  // 🔄 Dynamic city display names from API (replaces static cityDisplayNames)
  const cityDisplayNames: { [key: string]: string } = cities.reduce((acc, city) => {
    if (city.slug) {
      acc[city.slug] = city.name;
    }
    return acc;
  }, {} as { [key: string]: string });

  // 🎯 Handle city selection from popular cities
  const handleCitySelect = (citySlug: string, cityName: string) => {
    setSearchLocation(cityName); // Set display name for input
    // The useEffect will automatically handle the filtering with citySlug
  };

  // Handle pagination separately to avoid conflicts with filter updates
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // Track previous filter values to avoid unnecessary resets
  const previousFiltersRef = useRef<{ 
    searchLocation: string; 
    selectedServices: string[]; 
    selectedRating: number; 
    priceRange: number; 
  }>({ searchLocation: '', selectedServices: [], selectedRating: 0, priceRange: 100 });

  // Update API filters when filter states change (real-time)
  // Reset to page 1 when filters change, but preserve page for pagination
  useEffect(() => {
    const previousFilters = previousFiltersRef.current;
    const filtersChanged = (
      searchLocation !== previousFilters.searchLocation ||
      JSON.stringify(selectedServices) !== JSON.stringify(previousFilters.selectedServices) ||
      selectedRating !== previousFilters.selectedRating ||
      priceRange !== previousFilters.priceRange
    );

    if (!filtersChanged) return; // Don't run if only pagination changed

    // Add small delay to avoid rapid API calls
    const timeoutId = setTimeout(() => {
      const newFilters: {
        categories?: string[];
        city?: string;
        maxPrice?: number;
        minRating?: number;
        currency?: string;
      } = {};

      // Update previous filters
      previousFiltersRef.current = { searchLocation, selectedServices, selectedRating, priceRange };

      // Use real-time filters
      const activeLocation = searchLocation;
      const activeServices = selectedServices;
      const activeRating = selectedRating;
      const activePrice = priceRange;

      if (activeLocation && activeLocation.trim()) {
        // 🚀 Use dynamic city search from API instead of static mapping
        const cityUuid = getCityUuidFromSearch(activeLocation);

        if (cityUuid) {
          newFilters.city = cityUuid;
        } else {
          // Skip invalid city searches to avoid 500 errors
          setBaseFilters({});
          return;
        }
      }

      if (activeServices.length > 0) {
        // Use dynamic API mapping if available, otherwise use static fallback
        let categoryUuids: string[] = [];

        if (categories.length > 0) {
          // Use dynamic category mapping from API only - NO FALLBACK
          categoryUuids = getCategoryUuidsByIdOrSlug(activeServices);
        }

        if (categoryUuids.length > 0) {
          newFilters.categories = categoryUuids;
        }
      }

      // 🚀 NEW: Dynamic price filtering based on database range
      if (dbPriceRange && activePrice < 100) {
        // Convert slider percentage to actual price
        const maxPrice = dbPriceRange.minPrice + 
          ((dbPriceRange.maxPrice - dbPriceRange.minPrice) * (activePrice / 100));
        newFilters.maxPrice = Math.round(maxPrice);
        newFilters.currency = currency; // Add currency filter to match price range
      } else if (dbPriceRange) {
        // Even if no price limit, filter by currency
        newFilters.currency = currency;
      }

      if (activeRating > 0) {
        newFilters.minRating = activeRating; // Filter by minimum rating
      }

      setBaseFilters(newFilters);
      
      // Reset pagination to page 1 when filters change
      if (currentPage !== 1) {
        setCurrentPage(1);
      }
    }, 300); // Reduced delay for better responsiveness

    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchLocation, selectedServices, selectedRating, priceRange, getCityUuidFromSearch, getCategoryUuidsByIdOrSlug, categories.length, dbPriceRange]); // Added dbPriceRange dependency

  // 🚀 Initialize price range from database data
  useEffect(() => {
    if (dbPriceRange && priceRange === 100) {
      // Set default to show full range (100%)
      setPriceRange(100);
    }
  }, [dbPriceRange]);

  // Show loading if categories or cities are still loading
  const isDataLoading = categoriesLoading || citiesLoading;

  const handleServiceChange = (service: string, checked: boolean) => {
    if (checked) {
      setSelectedServices(prev => prev.includes(service) ? prev : [...prev, service]);
    } else {
      setSelectedServices(prev => prev.filter(s => s !== service));
    }
  };

  // Remove applyFilters function - no longer needed for real-time filtering

  const clearFilters = () => {
    setSelectedRating(0);
    setSearchLocation('');
    setSelectedServices([]);
    setPriceRange(100);
    // Reset pagination is handled by filter useEffect
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-yellow-50">
      {/* Hero Section - GenZ Design - Shorter */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 pt-4 pb-8">
          {/* Animated Background */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-10 left-10 w-24 h-24 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute top-20 right-20 w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-20 animate-bounce delay-300"></div>
            <div className="absolute bottom-10 left-1/4 w-28 h-28 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-20 animate-pulse delay-700"></div>
          </div>

          <div className="relative bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20">
            {/* Glassmorphism overlay */}
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
            
            {/* Content */}
            <div className="relative z-10 px-6 py-8 md:py-12 text-center">
              {/* Floating emojis */}
              <div className="absolute top-4 left-4 text-3xl animate-bounce">🌟</div>
              <div className="absolute top-6 right-6 text-2xl animate-pulse delay-500">✨</div>
              <div className="absolute bottom-4 left-6 text-2xl animate-bounce delay-1000">🎯</div>
              <div className="absolute bottom-6 right-4 text-3xl animate-pulse delay-300">💫</div>
              
              {/* Main content */}
              <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-3 tracking-tight">
                    find your
                    <span className="block bg-gradient-to-r from-yellow-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent animate-pulse">
                      main character
                    </span>
                    <span className="block text-white/90">moment ✨</span>
                  </h1>
                </div>
                
                <div className="space-y-3 mb-6">
                  <p className="text-lg md:text-xl text-white/90 font-medium">
                    no cap, these experiences hit different 💯
                  </p>
                  <p className="text-base text-white/80 max-w-2xl mx-auto leading-relaxed">
                    local hosts creating experiences that are actually fire 🔥 
                    from photographers who know the spots 📸 to guides who have the tea ☕
                  </p>
                </div>

              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400"></div>
            <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-pink-400 to-blue-400"></div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6 py-8">
        {/* Mobile Filter Toggle */}
        <div className="md:hidden flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            vibe check 🎛️
          </h2>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:shadow-lg transition-all duration-200"
          >
            {showFilters ? '✨ hide filters' : '🔍 show filters'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className={`md:col-span-1 ${showFilters ? 'block' : 'hidden md:block'}`}>
            <div className="bg-white rounded-3xl shadow-xl p-6 border-2 border-pink-100 sticky top-6">
              <h3 className="text-lg font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                find your vibe 🎯
              </h3>

              {/* Location Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">📍 where to?</label>
                <input
                  type="text"
                  placeholder={citiesLoading ? "Loading cities..." : "Search cities..."}
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  disabled={citiesLoading}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all duration-200 hover:border-pink-300 disabled:opacity-50"
                />
                
                {/* Popular Destinations */}
                <div className="mt-3">
                  <div className="text-xs font-medium text-gray-600 mb-2 flex items-center gap-1">
                    ⭐ Popular destinations
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {citiesLoading ? (
                      <div className="text-xs text-gray-500">Loading popular cities...</div>
                    ) : (
                      cities.map((city) => (
                        city.slug ? (
                          <button
                            key={city.id}
                            onClick={() => handleCitySelect(city.slug!, city.name)}
                            className="text-xs bg-gray-100 hover:bg-purple-100 text-gray-600 hover:text-purple-600 px-3 py-2 rounded-full transition-colors flex items-center gap-1 font-medium border-2 border-transparent hover:border-purple-200"
                          >
                            {city.emoji} {city.name}
                          </button>
                        ) : null
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Service Types */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  ✨ what's the mood? 
                  {selectedServices.length > 0 && (
                    <span className="ml-2 bg-purple-100 text-purple-600 px-2 py-1 rounded-full text-xs font-medium">
                      {selectedServices.length} selected
                    </span>
                  )}
                </label>
                {categoriesLoading ? (
                  <div className="text-sm text-gray-500">Loading service types...</div>
                ) : (
                  <div className="space-y-2">
                    {serviceTypes.map((service) => (
                      <label key={service.id} className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                        <input
                          type="checkbox"
                          checked={selectedServices.includes(service.id)}
                          onChange={(e) => handleServiceChange(service.id, e.target.checked)}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="ml-3 text-sm text-gray-700 flex items-center">
                          <span className="mr-2">{service.emoji}</span>
                          {service.label}
                          {selectedServices.includes(service.id) && (
                            <span className="ml-2 text-purple-500">✓</span>
                          )}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
                {selectedServices.length > 0 && (
                  <div className="mt-3 p-2 bg-purple-50 rounded-lg">
                    <p className="text-xs text-purple-600">
                      💡 Tip: Select multiple vibes to see more experiences!
                    </p>
                  </div>
                )}
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  ⭐ quality check
                  {selectedRating > 0 && (
                    <span className="ml-2 bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full text-xs font-medium">
                      {selectedRating}★+ only
                    </span>
                  )}
                </label>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map((rating) => (
                    <label key={rating} className={`flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors ${selectedRating === rating ? 'bg-yellow-50 border border-yellow-200' : ''}`}>
                      <input
                        type="radio"
                        name="rating"
                        value={rating}
                        checked={selectedRating === rating}
                        onChange={(e) => setSelectedRating(parseInt(e.target.value))}
                        className="text-yellow-500 focus:ring-yellow-500"
                      />
                      <span className="ml-3 text-sm text-gray-700 flex items-center">
                        <span className="mr-2">{'⭐'.repeat(rating)}{'⚪'.repeat(5-rating)}</span>
                        <span>{rating}+ stars & up</span>
                        {selectedRating === rating && (
                          <span className="ml-2 text-yellow-500">✓</span>
                        )}
                      </span>
                    </label>
                  ))}
                  <label key={0} className={`flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors ${selectedRating === 0 ? 'bg-gray-50 border border-gray-200' : ''}`}>
                    <input
                      type="radio"
                      name="rating"
                      value={0}
                      checked={selectedRating === 0}
                      onChange={(e) => setSelectedRating(parseInt(e.target.value))}
                      className="text-purple-600 focus:ring-purple-500"
                    />
                    <span className="ml-3 text-sm text-gray-700 flex items-center">
                      <span className="mr-2">🤷‍♀️</span>
                      <span>any vibe is good</span>
                      {selectedRating === 0 && (
                        <span className="ml-2 text-purple-500">✓</span>
                      )}
                    </span>
                  </label>
                </div>
                {selectedRating > 0 && (
                  <div className="mt-3 p-2 bg-yellow-50 rounded-lg">
                    <p className="text-xs text-yellow-600">
                      ⭐ Showing only {selectedRating}+ star experiences for top quality
                    </p>
                  </div>
                )}
              </div>

              {/* Currency Toggle */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  💱 Currency
                </label>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setCurrency('IDR')}
                    className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                      currency === 'IDR'
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'text-gray-600 hover:text-purple-600'
                    }`}
                  >
                    🇮🇩 IDR
                  </button>
                  <button
                    onClick={() => setCurrency('USD')}
                    className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                      currency === 'USD'
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'text-gray-600 hover:text-purple-600'
                    }`}
                  >
                    🇺🇸 USD
                  </button>
                </div>
              </div>

              {/* Price Range - Dynamic from Database */}
              <div className="mb-6">
                {priceLoading ? (
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-32 mb-3"></div>
                    <div className="h-3 bg-gray-200 rounded-lg mb-2"></div>
                    <div className="flex justify-between">
                      <div className="h-3 bg-gray-200 rounded w-12"></div>
                      <div className="h-3 bg-gray-200 rounded w-12"></div>
                    </div>
                  </div>
                ) : dbPriceRange ? (
                  <>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      💸 budget check: {formatPriceInput(
                        Math.round(dbPriceRange.minPrice + 
                          ((dbPriceRange.maxPrice - dbPriceRange.minPrice) * (priceRange / 100))
                        ), currency
                      )}
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={priceRange}
                      onChange={(e) => setPriceRange(parseInt(e.target.value))}
                      className="w-full h-3 bg-gradient-to-r from-green-200 to-pink-200 rounded-lg appearance-none cursor-pointer slider hover:opacity-80 transition-opacity"
                      style={{
                        background: `linear-gradient(to right, #10b981 0%, #10b981 ${priceRange}%, #fce7f3 ${priceRange}%, #fce7f3 100%)`
                      }}
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>{formatPrice(dbPriceRange.minPrice, currency)}</span>
                      <span>{formatPrice(dbPriceRange.maxPrice, currency)}</span>
                    </div>
                  </>
                ) : (
                  <div className="text-gray-500 text-sm">Price range loading...</div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {/* Clear Filters Button - Full Width */}
                <button
                  onClick={clearFilters}
                  className="w-full bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 py-3 rounded-2xl hover:from-purple-100 hover:to-pink-100 hover:text-purple-600 transition-all duration-200 font-medium border-2 border-transparent hover:border-purple-200"
                >
                  🔄 Reset Filters
                </button>
              </div>
            </div>
          </div>

          {/* Experiences Grid */}
          <div className="md:col-span-3">
            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {(loading || isDataLoading) ? 'Loading...' : (
                  selectedServices.length > 1 
                    ? `${experiences.length} Mixed Vibe Experiences Found`
                    : `${experiences.length} Experiences Found`
                )}
              </h2>
              <div className="text-sm text-gray-500">
                {pagination && `Page ${pagination.currentPage} of ${pagination.pages}`}
                {selectedServices.length > 1 && !isDataLoading && (
                  <div className="text-xs text-purple-500 mt-1">
                    🎭 Showing {selectedServices
                      .map(s => serviceTypes.find(st => st.id === s)?.emoji)
                      .filter(emoji => emoji) // Filter out undefined values
                      .join('')} vibes
                  </div>
                )}
                {selectedRating > 0 && (
                  <div className="text-xs text-yellow-500 mt-1">
                    ⭐ {selectedRating}+ star quality only
                  </div>
                )}
                {isDataLoading && (
                  <div className="text-xs text-blue-500 mt-1">
                    🔄 Loading fresh data from API...
                  </div>
                )}
              </div>
            </div>

            {/* Loading State */}
            {(loading || isDataLoading) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 auto-rows-fr">
                <ExperienceSkeleton count={9} />
              </div>
            )}

            {/* Error State - Only show for real errors, not during loading */}
            {error && !loading && !isDataLoading && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No results found</h3>
                <p className="text-gray-500 mb-6">
                  {searchLocation ? `No experiences found in "${searchLocation}"` : 'Try adjusting your search or filters'}
                </p>
                <button 
                  onClick={clearFilters}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transition-all"
                >
                  🔄 Clear Filters
                </button>
              </div>
            )}

            {/* Experiences Grid */}
            {!loading && !error && !isDataLoading && experiences.length > 0 && (
              <div id="experiences-grid" className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 auto-rows-fr">
                {experiences.map((experience) => (
                  <ExperienceCard 
                    key={experience.id} 
                    experience={experience}
                    className="h-full"
                  />
                ))}
              </div>
            )}



            {/* Empty State */}
            {!loading && !error && !isDataLoading && experiences.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No experiences found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters to see more results.</p>
                <button 
                  onClick={clearFilters}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transition-all"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {!loading && !error && !isDataLoading && pagination && pagination.pages > 1 && (
              <div className="flex justify-center mt-12">
                <div className="flex items-center gap-2">
                  {pagination.hasPrev && (
                    <button
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-2xl hover:bg-gray-50 transition-colors"
                    >
                      ← Previous
                    </button>
                  )}
                  
                  <span className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-medium">
                    Page {pagination.currentPage} of {pagination.pages}
                  </span>
                  
                  {pagination.hasNext && (
                    <button
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-2xl hover:bg-gray-50 transition-colors"
                    >
                      Next →
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;
