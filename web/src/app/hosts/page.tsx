'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Star, MapPin, Camera, Calendar, Users, Filter, Crown, Award, X, Search, Globe } from 'lucide-react';
import { SimpleImage } from '@/components/SimpleImage';
import { useHosts, Host } from '@/hooks/useHosts';
import { useHostCategories } from '@/hooks/useHostCategories';
import Footer from '@/components/Footer';

const HostCard = ({ host, isFeatured = false }: { host: Host; isFeatured?: boolean }) => {
  const getSpecialtyIcon = (specialty: string) => {
    switch (specialty.toLowerCase()) {
      case 'photographer':
      case 'photography':
        return <Camera className="w-3 h-3" />;
      case 'tour guide':
      case 'guide':
        return <Users className="w-3 h-3" />;
      case 'trip planner':
      case 'planner':
        return <Calendar className="w-3 h-3" />;
      default:
        return <Star className="w-3 h-3" />;
    }
  };

  const getCategoryBadge = (category: string) => {
    const badges = {
      'Photographer': 'bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 border-pink-200',
      'Tour Guide': 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border-blue-200',
      'Local Guide': 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-200',
      'Trip Planner': 'bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 border-orange-200',
    };
    return badges[category as keyof typeof badges] || 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 border-gray-200';
  };

  return (
    <Link 
      href={`/hosts/${host.slug}`}
      className="group bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:scale-[1.02] hover:-translate-y-3"
    >
      {/* Header Image Section */}
      <div className="relative h-32 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px]"></div>
        </div>
        
        {isFeatured && (
          <div className="absolute top-4 right-4 z-10">
            <div className="bg-white/90 backdrop-blur-sm text-orange-600 px-3 py-1.5 rounded-full text-xs font-bold flex items-center shadow-lg">
              <Crown className="w-3 h-3 mr-1" />
              FEATURED
            </div>
          </div>
        )}

        <div className="absolute -bottom-12 left-6">
          <div className="relative">
            <div className="relative w-24 h-24 rounded-2xl border-4 border-white shadow-xl overflow-hidden group-hover:scale-105 transition-transform duration-300 bg-gradient-to-br from-purple-100 to-pink-100">
              <SimpleImage
                imagePath={host.avatar}
                alt={host.name}
                className="w-full h-full object-cover"
                width={96}
                height={96}
                placeholderType="profile"
                category="users/avatars"
                name={host.name}
              />
            </div>
            
            {host.rating >= 4.8 && (
              <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1.5 shadow-lg">
                <Award className="w-3 h-3 text-white" />
              </div>
            )}
            
            <div className={`absolute -bottom-2 -right-2 px-2 py-1 rounded-lg text-xs font-semibold border-2 border-white shadow-md ${getCategoryBadge(host.category)}`}>
              <div className="flex items-center space-x-1">
                {getSpecialtyIcon(host.category)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-16 pb-6 px-6">
        <div className="mb-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors duration-300 line-clamp-1">
              {host.name}
            </h3>
            <div className="flex items-center bg-yellow-50 px-2.5 py-1 rounded-lg ml-2">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
              <span className="font-semibold text-sm text-gray-900">{host.rating}</span>
              <span className="text-xs text-gray-500 ml-1">({host.reviewCount})</span>
            </div>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-1 text-purple-500" />
            <span>{host.city ? `${host.city.name}, ${host.city.country.name}` : host.location}</span>
          </div>
        </div>

        <p className="text-gray-700 text-sm mb-4 line-clamp-2 leading-relaxed">
          {host.bio}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {host.specialties.slice(0, 1).map((specialty, index) => (
            <span 
              key={index}
              className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 text-xs font-medium rounded-full border border-purple-200"
            >
              {getSpecialtyIcon(specialty)}
              <span className="ml-1">{specialty}</span>
            </span>
          ))}
          
          {host.languages && host.languages.length > 0 && 
            host.languages.slice(0, 2).map((language) => (
              <span 
                key={language.id}
                className="inline-flex items-center px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-200"
                title={`${language.name} (${language.proficiency})`}
              >
                <Globe className="w-3 h-3 mr-1" />
                {language.name}
              </span>
            ))
          }
          
          {(host.specialties.length > 1 || (host.languages && host.languages.length > 2)) && (
            <span className="inline-flex items-center px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
              +{(host.specialties.length - 1) + ((host.languages?.length || 0) - 2)} more
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div>
            <div className="text-purple-600 font-bold text-lg">
              {host.startFromPrice && host.startFromPrice > 0 
                ? `Start From IDR ${host.startFromPrice.toLocaleString('id-ID')}`
                : 'Contact for pricing'
              }
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">
              {host.experienceCount || 0} experience{(host.experienceCount || 0) !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

const FilterSection = ({ 
  selectedCity, 
  selectedCategory, 
  onCityChange, 
  onCategoryChange, 
  cities, 
  onClearFilters,
  totalHosts,
  filteredCount,
  searchName,
  onSearchNameChange,
  categories
}: {
  selectedCity: string;
  selectedCategory: string;
  onCityChange: (city: string) => void;
  onCategoryChange: (category: string) => void;
  cities: Array<{ id: string; name: string; country: { name: string } }>;
  onClearFilters: () => void;
  totalHosts: number;
  filteredCount: number;
  searchName: string;
  onSearchNameChange: (name: string) => void;
  categories: Array<{ id: string; name: string; description?: string; icon?: string; }>;
}) => {
  const [citySearchTerm, setCitySearchTerm] = useState('');
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<number | null>(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCityDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);
  
  // Filter cities based on search term
  const filteredCities = useMemo(() => {
    if (!citySearchTerm) return cities;
    return cities.filter(city => 
      city.name.toLowerCase().includes(citySearchTerm.toLowerCase()) ||
      city.country.name.toLowerCase().includes(citySearchTerm.toLowerCase())
    );
  }, [cities, citySearchTerm]);
  
  const handleCitySelect = (cityName: string) => {
    onCityChange(cityName);
    setCitySearchTerm('');
    setShowCityDropdown(false);
  };
  
  const clearCityFilter = () => {
    onCityChange('');
    setCitySearchTerm('');
    setShowCityDropdown(false);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowCityDropdown(false);
      setCitySearchTerm('');
    }
  };

  // Debounced search input handler
  const handleSearchChange = (value: string) => {
    setCitySearchTerm(value);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = window.setTimeout(() => {
      setShowCityDropdown(true);
    }, 150); // Small delay for better UX
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filter Locals</h3>
        </div>
        <div className="text-sm text-gray-600">
          Showing {filteredCount} of {totalHosts} locals
        </div>
      </div>
      
      {/* Search Bar */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          🔍 Search by Name or Skills
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name, specialties, or bio..."
            value={searchName}
            onChange={(e) => onSearchNameChange(e.target.value)}
            className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
          />
          {searchName && (
            <button
              onClick={() => onSearchNameChange('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="relative" ref={dropdownRef}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            📍 City
          </label>
          {!selectedCity ? (
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search cities..."
                  value={citySearchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onFocus={() => setShowCityDropdown(true)}
                  onKeyDown={handleKeyDown}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
                />
              </div>
              
              {showCityDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredCities.length > 0 ? (
                    <>
                      <button
                        onClick={() => {
                          onCityChange('');
                          setShowCityDropdown(false);
                          setCitySearchTerm('');
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-600 border-b border-gray-100"
                      >
                        All Cities
                      </button>
                      {filteredCities.map((city) => (
                        <button
                          key={city.id}
                          onClick={() => handleCitySelect(city.name)}
                          className="w-full text-left px-4 py-2 hover:bg-purple-50 focus:bg-purple-50 focus:outline-none"
                        >
                          <div className="font-medium text-gray-900">{city.name}</div>
                          <div className="text-sm text-gray-500">{city.country.name}</div>
                        </button>
                      ))}
                    </>
                  ) : (
                    <div className="px-4 py-3 text-gray-500 text-center">
                      No cities found
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between px-4 py-2 bg-purple-50 border border-purple-200 rounded-lg">
              <span className="text-purple-700 font-medium">{selectedCity}</span>
              <button
                onClick={clearCityFilter}
                className="text-purple-500 hover:text-purple-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            💼 Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Clear Filters Button */}
      {(selectedCity || selectedCategory || searchName) && (
        <div className="mt-4 mb-4">
          <button
            onClick={onClearFilters}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center space-x-2"
          >
            <X className="w-4 h-4" />
            <span>Clear All Filters</span>
          </button>
        </div>
      )}
      
      {(selectedCity || selectedCategory || searchName) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {searchName && (
            <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
              🔍 "{searchName}"
              <button
                onClick={() => onSearchNameChange('')}
                className="ml-2 text-green-500 hover:text-green-700"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedCity && (
            <span className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
              📍 {selectedCity}
              <button
                onClick={() => onCityChange('')}
                className="ml-2 text-purple-500 hover:text-purple-700"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedCategory && (
            <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
              💼 {selectedCategory}
              <button
                onClick={() => onCategoryChange('')}
                className="ml-2 text-blue-500 hover:text-blue-700"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default function HostsPage() {
  const { hosts, cities, loading, error } = useHosts();
  const { categories: hostCategories, loading: categoriesLoading } = useHostCategories();
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchName, setSearchName] = useState('');
  const [itemsToShow, setItemsToShow] = useState(9); // Show 9 hosts initially
  const [loadingMore, setLoadingMore] = useState(false);
  
  const ITEMS_PER_LOAD = 6; // Load 6 more each time
  
  const filteredHosts = useMemo(() => {
    return hosts.filter(host => {
      const cityMatch = !selectedCity || 
        (host.city && host.city.name === selectedCity) ||
        host.location.includes(selectedCity);
      
      const categoryMatch = !selectedCategory || host.category === selectedCategory;
      
      const nameMatch = !searchName || 
        host.name.toLowerCase().includes(searchName.toLowerCase()) ||
        host.bio.toLowerCase().includes(searchName.toLowerCase()) ||
        host.specialties.some(specialty => 
          specialty.toLowerCase().includes(searchName.toLowerCase())
        );
      
      return cityMatch && categoryMatch && nameMatch;
    });
  }, [hosts, selectedCity, selectedCategory, searchName]);
  
  // Sort hosts: featured first, then by rating
  const sortedHosts = useMemo(() => {
    return [...filteredHosts].sort((a, b) => {
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return b.rating - a.rating;
    });
  }, [filteredHosts]);

  // Paginated hosts for display
  const displayedHosts = useMemo(() => {
    return sortedHosts.slice(0, itemsToShow);
  }, [sortedHosts, itemsToShow]);

  // Check if there are more hosts to load
  const hasMoreHosts = sortedHosts.length > itemsToShow;

  // Load more function
  const loadMoreHosts = () => {
    setLoadingMore(true);
    
    // Simulate loading delay for better UX
    setTimeout(() => {
      const newItemsCount = itemsToShow + ITEMS_PER_LOAD;
      setItemsToShow(newItemsCount);
      setLoadingMore(false);
      
      // Smooth scroll to the first new item
      setTimeout(() => {
        const gridElement = document.querySelector('.hosts-grid');
        if (gridElement) {
          const cardHeight = 400; // Approximate card height
          const currentItems = itemsToShow;
          const scrollTarget = Math.floor(currentItems / 3) * cardHeight;
          window.scrollTo({
            top: scrollTarget,
            behavior: 'smooth'
          });
        }
      }, 100);
    }, 800); // Small delay to show loading state
  };

  // Reset items to show when filters change
  useEffect(() => {
    setItemsToShow(9);
  }, [selectedCity, selectedCategory, searchName]);
  
  const clearFilters = () => {
    setSelectedCity('');
    setSelectedCategory('');
    setSearchName('');
  };

  if (loading || categoriesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading amazing locals...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading hosts: {error}</p>
          <p className="text-gray-600">Showing cached data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              Meet Your Local Guides ✨
            </h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto leading-relaxed">
              Connect with verified local experts who are passionate about sharing their knowledge, 
              culture, and hidden gems with travelers from around the world.
            </p>
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold">{hosts.length}+</div>
                <div className="text-sm opacity-80">Expert Locals</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{cities.length}+</div>
                <div className="text-sm opacity-80">Cities Covered</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">
                  {hosts.reduce((total, host) => total + (host.experienceCount || 0), 0)}+
                </div>
                <div className="text-sm opacity-80">Experiences</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">4.8</div>
                <div className="text-sm opacity-80">Average Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <FilterSection
          selectedCity={selectedCity}
          selectedCategory={selectedCategory}
          onCityChange={setSelectedCity}
          onCategoryChange={setSelectedCategory}
          cities={cities}
          onClearFilters={clearFilters}
          totalHosts={hosts.length}
          filteredCount={filteredHosts.length}
          searchName={searchName}
          onSearchNameChange={setSearchName}
          categories={hostCategories.map(category => ({
            ...category,
            id: String(category.id)
          }))}
        />

        {sortedHosts.length > 0 ? (
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <Users className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                Discover Amazing Locals
              </h2>
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                {filteredHosts.length} AVAILABLE
              </span>
            </div>
            <div className="hosts-grid grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8 auto-rows-fr"> {/* Added auto-rows-fr dan reduced gap */}
              {displayedHosts.map((host) => (
                <HostCard key={host.id} host={host} isFeatured={host.isFeatured} />
              ))}
            </div>
            
            {/* Load More Button */}
            {hasMoreHosts && (
              <div className="text-center">
                <button
                  onClick={loadMoreHosts}
                  disabled={loadingMore}
                  className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loadingMore ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      <span>Loading More...</span>
                    </>
                  ) : (
                    <>
                      <span>Load More Locals</span>
                      <span className="ml-2 bg-white bg-opacity-20 px-2 py-1 rounded text-xs">
                        +{Math.min(ITEMS_PER_LOAD, sortedHosts.length - itemsToShow)}
                      </span>
                    </>
                  )}
                </button>
                <p className="mt-3 text-sm text-gray-600">
                  Showing {displayedHosts.length} of {sortedHosts.length} locals
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No locals found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters to see more results.</p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Become a Local Guide? 🚀
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Share your passion, connect with travelers, and earn money by hosting unique experiences in your city.
          </p>
          <Link 
            href="/become-host"
            className="inline-flex items-center px-8 py-4 bg-white text-purple-600 font-bold rounded-lg hover:bg-yellow-300 hover:text-purple-700 transition-all duration-200 shadow-lg transform hover:scale-105"
          >
            Start Your Journey Today ✨
          </Link>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
