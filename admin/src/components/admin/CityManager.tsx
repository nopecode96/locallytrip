import React, { useState } from 'react';
import ContentSection from './ContentSection';

const CityManager = () => {
  const [cities, setCities] = useState<string[]>([]);
  const [newCity, setNewCity] = useState('');

  const handleAddCity = () => {
    if (newCity && !cities.includes(newCity)) {
      setCities([...cities, newCity]);
      setNewCity('');
    }
  };

  const handleRemoveCity = (cityToRemove: string) => {
    setCities(cities.filter(city => city !== cityToRemove));
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Manage Favorite Cities</h2>
      <ContentSection>
        <div className="mb-4">
          <input
            type="text"
            value={newCity}
            onChange={(e) => setNewCity(e.target.value)}
            placeholder="Add a new city"
            className="border p-2 rounded"
          />
          <button onClick={handleAddCity} className="ml-2 bg-blue-500 text-white p-2 rounded">
            Add City
          </button>
        </div>
        <ul>
          {cities.map((city, index) => (
            <li key={index} className="flex justify-between items-center mb-2">
              <span>{city}</span>
              <button onClick={() => handleRemoveCity(city)} className="text-red-500">
                Remove
              </button>
            </li>
          ))}
        </ul>
      </ContentSection>
    </div>
  );
};

export default CityManager;