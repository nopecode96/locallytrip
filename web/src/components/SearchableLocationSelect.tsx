'use client';

import { useState, useEffect, useRef } from 'react';

interface City {
  id: number;
  name: string;
  country: string;
  emoji?: string;
  totalExperiences?: number;
  description?: string;
}

interface SearchableLocationSelectProps {
  value: string;
  onChange: (cityId: string, city?: City) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export default function SearchableLocationSelect({
  value,
  onChange,
  placeholder = "Where is your story from? 🌍",
  className = "",
  disabled = false
}: SearchableLocationSelectProps) {
  const [cities, setCities] = useState<City[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Fetch cities data
  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/cities/?limit=100');
        const data = await response.json();
        if (data.success) {
          const cityData = data.data.map((city: any) => ({
            id: city.id,
            name: city.name,
            country: city.country,
            emoji: city.emoji || '🏙️',
            totalExperiences: city.totalExperiences || 0,
            description: city.description
          }));
          setCities(cityData);
          setFilteredCities(cityData);
        }
      } catch (error) {
        console.error('Error fetching cities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  // Set initial selected city when value changes
  useEffect(() => {
    if (value && cities.length > 0) {
      const city = cities.find(c => c.id.toString() === value);
      if (city) {
        setSelectedCity(city);
        setSearchTerm(city.name);
      }
    } else if (!value) {
      setSelectedCity(null);
      setSearchTerm('');
    }
  }, [value, cities]);

  // Filter cities based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredCities(cities);
      setShowSuggestions(false);
      return;
    }

    const filtered = cities.filter(city =>
      city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.country.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCities(filtered);
    setShowSuggestions(true);
  }, [searchTerm, cities]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setActiveSuggestionIndex(-1);
        // Reset search term to selected city name if no selection
        if (selectedCity) {
          setSearchTerm(selectedCity.name);
        } else {
          setSearchTerm('');
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selectedCity]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    setActiveSuggestionIndex(-1);
    if (term.trim() && !showSuggestions) {
      setShowSuggestions(true);
    }
  };

  const handleCitySelect = (city: City, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    setSelectedCity(city);
    setSearchTerm(city.name);
    setShowSuggestions(false);
    setActiveSuggestionIndex(-1);
    onChange(city.id.toString(), city);
  };

  const handleInputFocus = () => {
    if (!disabled && searchTerm.trim()) {
      setShowSuggestions(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveSuggestionIndex(prev => 
          prev < filteredCities.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveSuggestionIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (activeSuggestionIndex >= 0 && filteredCities[activeSuggestionIndex]) {
          handleCitySelect(filteredCities[activeSuggestionIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setActiveSuggestionIndex(-1);
        if (selectedCity) {
          setSearchTerm(selectedCity.name);
        } else {
          setSearchTerm('');
        }
        break;
    }
  };

  const handleClear = () => {
    setSelectedCity(null);
    setSearchTerm('');
    setShowSuggestions(false);
    setActiveSuggestionIndex(-1);
    onChange('');
    inputRef.current?.focus();
  };

  return (
    <div className={`relative w-full ${className}`}>
      {/* Input Field - Style inspired by homepage SearchAutocomplete */}
      <div className="flex items-center w-full bg-white rounded-full shadow-lg border-2 border-gray-200 focus-within:border-blue-300 focus-within:shadow-xl transition-all duration-200 px-4 py-3">
        <span className="text-gray-400 mr-2">🔍</span>
        <input 
          ref={inputRef}
          type="text" 
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 bg-transparent outline-none border-none text-sm placeholder-gray-400 focus:ring-0 disabled:cursor-not-allowed" 
          autoComplete="off"
        />
        
        {/* Clear button */}
        {selectedCity && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="ml-2 px-2 py-1 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors rounded-full text-xs"
            title="Clear selection"
          >
            ✕
          </button>
        )}
        
        {/* Dropdown indicator */}
        <div className="ml-2 text-gray-400 text-xs">
          {showSuggestions ? '▲' : '▼'}
        </div>
      </div>

      {/* Selected City Display */}
      {selectedCity && (
        <div className="mt-3 flex items-center text-sm text-gray-600 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-3 border border-blue-200">
          <span className="text-xl mr-3">{selectedCity.emoji}</span>
          <div className="flex-1">
            <div className="font-semibold text-blue-700 text-base">{selectedCity.name}</div>
            <div className="text-sm text-blue-600">{selectedCity.country}</div>
            {selectedCity.description && (
              <div className="text-xs text-gray-500 mt-1 line-clamp-1">
                {selectedCity.description}
              </div>
            )}
          </div>
          {selectedCity.totalExperiences && selectedCity.totalExperiences > 0 && (
            <div className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
              {selectedCity.totalExperiences} experiences
            </div>
          )}
        </div>
      )}

      {/* Suggestions Dropdown - Style inspired by homepage */}
      {showSuggestions && (
        <div 
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 max-h-80 overflow-y-auto"
        >
          {loading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500 mx-auto"></div>
              <p className="mt-2 text-sm">Loading locations...</p>
            </div>
          ) : filteredCities.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <span className="text-2xl block mb-2">🔍</span>
              <p className="text-sm">No locations found</p>
              <p className="text-xs text-gray-400 mt-1">
                Try a different search term
              </p>
            </div>
          ) : (
            <div className="py-2">
              {/* Header */}
              {!searchTerm && (
                <div className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100 bg-gray-50 rounded-t-2xl">
                  🌍 Popular Story Locations
                </div>
              )}
              
              {searchTerm && (
                <div className="px-4 py-2 text-xs text-gray-500 bg-blue-50 border-b border-blue-100 rounded-t-2xl">
                  🔍 Search results for "{searchTerm}"
                </div>
              )}
              
              {/* City Options */}
              {filteredCities.map((city, index) => (
                <div
                  key={city.id}
                  onMouseDown={(e) => handleCitySelect(city, e)}
                  className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors duration-150 ${
                    index === activeSuggestionIndex 
                      ? 'bg-purple-50 border-l-4 border-purple-500' 
                      : 'hover:bg-gray-50'
                  } ${index === 0 && !searchTerm ? 'rounded-t-2xl' : ''} ${
                    index === filteredCities.length - 1 ? 'rounded-b-2xl' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">
                      {city.emoji}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{city.name}</div>
                      <div className="text-sm text-gray-500">{city.country}</div>
                      {city.description && (
                        <div className="text-xs text-gray-400 mt-1 max-w-xs truncate">
                          {city.description}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {city.totalExperiences && city.totalExperiences > 0 && (
                    <div className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                      {city.totalExperiences} exp
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
