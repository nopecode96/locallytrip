import React from 'react';
import SimpleImage from './SimpleImage';
import { useRouter } from 'next/navigation';

interface CityCardProps {
  city: {
    id: string;
    name: string;
    country?: string | { name: string }; // Allow both string and object format
    image?: string; // Optional
    totalExperiences?: number; // Optional
    totalOrders?: number; // Optional
    averagePrice?: number; // Optional
    description?: string; // Optional
    popularCategories?: (string | { name: string; [key: string]: any })[]; // Optional
    // Frontend API format
    slug?: string;
    emoji?: string;
    popular?: boolean;
    searchCount?: number;
  };
  className?: string;
}

const CityCard: React.FC<CityCardProps> = ({ city, className = '' }) => {
  const router = useRouter();

  // Handle city click for navigation to explore with city filter
  const handleCityClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    
    // Store city selection in sessionStorage for immediate pickup by explore page
    const cityData = {
      name: city.name,
      slug: city.slug || city.name.toLowerCase().replace(/\s+/g, "-"),
      id: city.id
    };
    
    sessionStorage.setItem("selectedCity", JSON.stringify(cityData));
    
    // Navigate to explore page
    router.push("/explore");
  };

  // Safe fallback values - handle both string and object format for country
  const cityImage = city.image || 'placeholder.jpg';
  const countryName = typeof city.country === 'string' 
    ? city.country 
    : (city.country && typeof city.country === 'object' && city.country.name)
    ? city.country.name
    : 'Unknown';
  const totalExperiences = city.totalExperiences || 0;
  const totalOrders = city.totalOrders || 0;
  const averagePrice = city.averagePrice || 0;
  const popularCategories = city.popularCategories || [];

  return (
    <div onClick={handleCityClick} className="group h-full cursor-pointer">
      <div className="bg-white rounded-3xl border-2 border-blue-100 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden h-full flex flex-col">
        <div className="relative">
          <SimpleImage
            imagePath={cityImage}
            alt={city.name}
            className="w-full h-44 object-cover group-hover:scale-110 transition-transform duration-300"
            category="cities"
            placeholderType="city"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
          <div className="absolute bottom-3 left-3 text-white">
            <h3 className="font-bold text-xl mb-1">{city.name}</h3>
            <p className="text-sm opacity-90">{countryName}</p>
          </div>
          <span className="absolute top-3 right-3 bg-blue-500 text-white text-xs font-bold px-3 py-2 rounded-full shadow-lg">
            🏙️ {totalOrders} trips
          </span>
        </div>
        
        <div className="p-6 flex flex-col flex-grow">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{totalExperiences}</div>
              <div className="text-xs text-gray-500">Experiences</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">
                {averagePrice > 0 
                  ? `IDR ${Math.round(averagePrice).toLocaleString('id-ID')}`
                  : 'TBD'
                }
              </div>
              <div className="text-xs text-gray-500">Avg Price</div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1 mb-4">
            {popularCategories.slice(0, 3).map((category, index) => {
              // Ensure we only render valid strings
              const categoryText = typeof category === 'string' 
                ? category 
                : (category && typeof category === 'object' && category.name && typeof category.name === 'string')
                  ? category.name
                  : 'Category';
              
              return (
                <span key={index} className="bg-purple-100 text-purple-600 text-xs px-2 py-1 rounded-full">
                  {categoryText}
                </span>
              );
            })}
          </div>
          
          {city.description && (
            <div className="mb-4">
              <p className="text-gray-600 text-sm leading-relaxed overflow-hidden" 
                 style={{
                   display: '-webkit-box',
                   WebkitLineClamp: 3,
                   WebkitBoxOrient: 'vertical' as any,
                   textOverflow: 'ellipsis'
                 }}>
                {city.description}
              </p>
            </div>
          )}
          
          <div className="mt-auto">
            <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-4 rounded-full font-semibold text-sm hover:shadow-lg transform hover:scale-105 transition-all duration-200">
              Explore {city.name} ✈️
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CityCard;
