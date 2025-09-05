import React, { useState, useEffect, useRef } from 'react';
import { useCitiesData } from '@/hooks/useCitiesData';

interface SearchLocation {
  id: string;
  name: string;
  type: 'city' | 'country';
  country?: string;
  searchCount?: number;
}

interface SearchAutocompleteProps {
  onSelect?: (location: SearchLocation) => void;
  className?: string;
  placeholder?: string;
}

const SearchAutocomplete: React.FC<SearchAutocompleteProps> = ({ 
  onSelect, 
  className = '',
  placeholder = "Where are you going? ✈️"
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<SearchLocation[]>([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  
  // Use cities data hook
  const { cities, loading, searchCities } = useCitiesData();

  // Extract unique countries from cities data
  const countries = React.useMemo(() => {
    const countrySet = new Set<string>();
    cities.forEach(city => {
      if (city.country && typeof city.country === 'string') {
        countrySet.add(city.country);
      }
    });
    return Array.from(countrySet).map((countryName, index) => ({
      id: `country-${index}`,
      name: countryName
    }));
  }, [cities]);

  // Combine cities and countries for suggestions
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const searchLower = searchTerm.toLowerCase();
    const suggestions: SearchLocation[] = [];

    // Check if search term matches any country
    const matchingCountries = countries.filter((country: any) => 
      country.name.toLowerCase().includes(searchLower)
    );

    if (matchingCountries.length > 0) {
      // If country matches, show all cities in those countries first
      matchingCountries.forEach((country: any) => {
        // Add country itself as option
        suggestions.push({
          id: country.id,
          name: country.name,
          type: 'country'
        });
        
        // Add all cities in this country
        const citiesInCountry = cities.filter(city => 
          city.country && city.country.toLowerCase() === country.name.toLowerCase()
        );
        
        citiesInCountry
          .sort((a, b) => (b.searchCount || 0) - (a.searchCount || 0)) // Sort by popularity
          .slice(0, 6) // Limit cities per country
          .forEach(city => {
            suggestions.push({
              id: String(city.id),
              name: city.name,
              type: 'city',
              country: city.country,
              searchCount: city.searchCount
            });
          });
      });
    } else {
      // If no country matches, search cities directly
      cities
        .filter(city => city.name.toLowerCase().includes(searchLower))
        .slice(0, 6) // Limit to 6 cities
        .forEach(city => {
          suggestions.push({
            id: String(city.id),
            name: city.name,
            type: 'city',
            country: city.country,
            searchCount: city.searchCount
          });
        });

      // Also add any countries that partially match
      countries
        .filter((country: any) => country.name.toLowerCase().includes(searchLower))
        .slice(0, 2) // Limit to 2 countries
        .forEach((country: any) => {
          suggestions.push({
            id: country.id,
            name: country.name,
            type: 'country'
          });
        });
    }

    // Sort suggestions: countries first, then cities by popularity
    suggestions.sort((a, b) => {
      // Countries first
      if (a.type === 'country' && b.type === 'city') return -1;
      if (a.type === 'city' && b.type === 'country') return 1;
      
      // Within same type, exact matches first
      const aExact = a.name.toLowerCase() === searchLower ? 1 : 0;
      const bExact = b.name.toLowerCase() === searchLower ? 1 : 0;
      if (aExact !== bExact) return bExact - aExact;
      
      // Then by search count (for cities)
      const aCount = a.searchCount || 0;
      const bCount = b.searchCount || 0;
      return bCount - aCount;
    });

    setFilteredSuggestions(suggestions.slice(0, 10)); // Max 10 suggestions to accommodate country + cities
    setShowSuggestions(true);
    setActiveSuggestionIndex(-1);
  }, [searchTerm, cities, countries]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSuggestionClick = (suggestion: SearchLocation) => {
    if (suggestion.type === 'country') {
      // If country is clicked, update search term and show cities in that country
      setSearchTerm(suggestion.name);
      // Keep suggestions open to show cities
      const citiesInCountry = cities.filter(city => 
        city.country && city.country.toLowerCase() === suggestion.name.toLowerCase()
      );
      
      const countrySuggestions: SearchLocation[] = [
        // Add the country itself as first option
        suggestion,
        // Add all cities in this country
        ...citiesInCountry
          .sort((a, b) => (b.searchCount || 0) - (a.searchCount || 0))
          .slice(0, 8)
          .map(city => ({
            id: String(city.id),
            name: city.name,
            type: 'city' as const,
            country: city.country,
            searchCount: city.searchCount
          }))
      ];
      
      setFilteredSuggestions(countrySuggestions);
      setShowSuggestions(true);
      setActiveSuggestionIndex(-1);
      return;
    }
    
    // For city selection or final submission
    setSearchTerm(suggestion.name);
    setShowSuggestions(false);
    setActiveSuggestionIndex(-1);
    
    if (onSelect) {
      onSelect(suggestion);
    } else {
      // Default behavior: navigate to explore page with location filter
      if (suggestion.type === 'city') {
        // For cities, set the city filter in sessionStorage and redirect
        const cityData = {
          name: suggestion.name,
          slug: suggestion.name.toLowerCase().replace(/\s+/g, '-'),
          id: suggestion.id
        };
        sessionStorage.setItem("selectedCity", JSON.stringify(cityData));
        window.location.href = '/explore';
      } else {
        // For countries, redirect with search parameter
        window.location.href = `/explore?search=${encodeURIComponent(suggestion.name)}`;
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || filteredSuggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveSuggestionIndex(prev => 
          prev < filteredSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : filteredSuggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (activeSuggestionIndex >= 0) {
          handleSuggestionClick(filteredSuggestions[activeSuggestionIndex]);
        } else if (filteredSuggestions.length > 0) {
          handleSuggestionClick(filteredSuggestions[0]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setActiveSuggestionIndex(-1);
        break;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (activeSuggestionIndex >= 0 && filteredSuggestions[activeSuggestionIndex]) {
      handleSuggestionClick(filteredSuggestions[activeSuggestionIndex]);
      return;
    }
    
    if (filteredSuggestions.length > 0) {
      handleSuggestionClick(filteredSuggestions[0]);
      return;
    }
    
    // If no suggestions but user typed something, proceed with search
    if (searchTerm.trim()) {
      // Redirect to explore page with search term
      window.location.href = `/explore?search=${encodeURIComponent(searchTerm)}`;
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current && !inputRef.current.contains(event.target as Node) &&
        suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setActiveSuggestionIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative w-full ${className}`}>
      <form onSubmit={handleSubmit} className="flex items-center w-full bg-white rounded-full shadow-2xl pl-4 md:pl-6 pr-1 md:pr-2 py-2 md:py-3 border-2 border-yellow-300">
        <input 
          ref={inputRef}
          type="text" 
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => searchTerm && setShowSuggestions(true)}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none border-none text-sm md:text-lg placeholder-gray-400 focus:ring-0" 
          autoComplete="off"
        />
        <button 
          type="submit" 
          aria-label="Search Destination" 
          className="ml-2 px-4 py-2 md:px-8 md:py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-bold text-sm md:text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          Search 🔍
        </button>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div 
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 max-h-80 overflow-y-auto"
        >
          {filteredSuggestions.map((suggestion, index) => (
            <div
              key={`${suggestion.type}-${suggestion.id}`}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors duration-150 ${
                index === activeSuggestionIndex 
                  ? 'bg-purple-50 border-l-4 border-purple-500' 
                  : 'hover:bg-gray-50'
              } ${index === 0 ? 'rounded-t-2xl' : ''} ${
                index === filteredSuggestions.length - 1 ? 'rounded-b-2xl' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  suggestion.type === 'city' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-green-100 text-green-600'
                }`}>
                  {suggestion.type === 'city' ? '🏙️' : '🌍'}
                </div>
                <div>
                  <div className="font-medium text-gray-900 flex items-center space-x-2">
                    <span>{suggestion.name}</span>
                    {suggestion.type === 'country' && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        Click to see cities
                      </span>
                    )}
                  </div>
                  {suggestion.country && suggestion.type === 'city' && (
                    <div className="text-sm text-gray-500">
                      {suggestion.country}
                    </div>
                  )}
                  {suggestion.type === 'country' && (
                    <div className="text-sm text-gray-500">
                      Country • Click to explore cities
                    </div>
                  )}
                </div>
              </div>
              
              {suggestion.searchCount && suggestion.searchCount > 0 && (
                <div className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                  {suggestion.searchCount} searches
                </div>
              )}
            </div>
          ))}
          
          {loading && (
            <div className="px-4 py-3 text-center text-gray-500 text-sm">
              Loading destinations...
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchAutocomplete;
