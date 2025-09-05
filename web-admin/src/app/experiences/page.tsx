'use client';

import React, { useState, useEffect } from 'react';
import ExperienceForm from '../../components/ExperienceForm';
import { Experience, getExperienceCategoryType } from '../../types/experience-categories';

const ExperiencesPage = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedHostCategory, setSelectedHostCategory] = useState<number>(1);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const response = await fetch('/api/experiences');
      if (response.ok) {
        const data = await response.json();
        setExperiences(data.data || []);
      }
    } catch (error) {
      
    } finally {
      setLoading(false);
    }
  };

  const handleCreateExperience = async (experienceData: any) => {
    try {
      const response = await fetch('/api/experiences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(experienceData),
      });

      if (response.ok) {
        await fetchExperiences(); // Refresh the list
        setShowCreateForm(false);
        alert('Experience created successfully!');
      } else {
        alert('Error creating experience');
      }
    } catch (error) {
      
      alert('Error creating experience');
    }
  };

  const handleDeleteExperience = async (id: number) => {
    if (confirm('Are you sure you want to delete this experience?')) {
      try {
        const response = await fetch(`/api/experiences/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await fetchExperiences(); // Refresh the list
          alert('Experience deleted successfully!');
        } else {
          alert('Error deleting experience');
        }
      } catch (error) {
        
        alert('Error deleting experience');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (showCreateForm) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <button
            onClick={() => setShowCreateForm(false)}
            className="text-blue-600 hover:text-blue-800 flex items-center space-x-2"
          >
            <span>← Back to Experiences</span>
          </button>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Host Category
          </label>
          <select
            value={selectedHostCategory}
            onChange={(e) => setSelectedHostCategory(parseInt(e.target.value))}
            className="p-2 border rounded-md"
          >
            <option value={1}>Local Guide</option>
            <option value={2}>Photographer</option>
            <option value={3}>Combo Guide</option>
            <option value={4}>Trip Planner</option>
          </select>
        </div>

        <ExperienceForm
          hostCategoryId={selectedHostCategory}
          onSubmit={handleCreateExperience}
        />
      </div>
    );
  }

  const groupedExperiences = experiences.reduce((acc, experience) => {
    const categoryType = getExperienceCategoryType(experience.categoryId);
    if (!acc[categoryType]) {
      acc[categoryType] = [];
    }
    acc[categoryType].push(experience);
    return acc;
  }, {} as Record<string, Experience[]>);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Experiences Management</h1>
          <p className="text-gray-600">Manage all experiences across different host categories</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          + Create New Experience
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {Object.entries(groupedExperiences).map(([categoryType, categoryExperiences]) => (
          <div key={categoryType} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{categoryType}</h3>
            <p className="text-3xl font-bold text-blue-600">{categoryExperiences.length}</p>
            <p className="text-sm text-gray-500">experiences</p>
          </div>
        ))}
      </div>

      {/* Experiences by Category */}
      <div className="space-y-8">
        {Object.entries(groupedExperiences).map(([categoryType, categoryExperiences]) => (
          <div key={categoryType} className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">{categoryType} Experiences</h2>
              <p className="text-gray-600">{categoryExperiences.length} experiences</p>
            </div>
            
            <div className="p-6">
              {categoryExperiences.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No experiences found in this category</p>
              ) : (
                <div className="grid gap-4">
                  {categoryExperiences.map((experience) => (
                    <div key={experience.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{experience.title}</h3>
                          <p className="text-gray-600 text-sm mb-2">{experience.shortDescription}</p>
                          
                          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                            <span>💰 IDR {experience.price.toLocaleString()}</span>
                            <span>⏱️ {experience.duration} hours</span>
                            <span>👥 {experience.minGuests}-{experience.maxGuests} guests</span>
                            <span>🚶 {experience.walkingDistanceKm}km walk</span>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              experience.fitnessLevel === 'Easy' ? 'bg-green-100 text-green-800' :
                              experience.fitnessLevel === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {experience.fitnessLevel}
                            </span>
                          </div>

                          {/* Category-specific details */}
                          <div className="mt-3 text-sm">
                            {categoryType === 'Local Guide' && (
                              <div className="flex flex-wrap gap-2">
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                  🚗 {(experience.hostSpecificData as any)?.vehicleType || 'Walking'}
                                </span>
                                {(experience.hostSpecificData as any)?.transportationIncluded && (
                                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                                    Transport Included
                                  </span>
                                )}
                              </div>
                            )}
                            
                            {categoryType === 'Photographer' && (
                              <div className="flex flex-wrap gap-2">
                                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                  📸 {(experience.deliverables as any)?.editedPhotosCount || 0} photos
                                </span>
                                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                  📅 {(experience.deliverables as any)?.deliveryTimeBusinessDays || 0} days delivery
                                </span>
                              </div>
                            )}
                            
                            {categoryType === 'Trip Planner' && (
                              <div className="flex flex-wrap gap-2">
                                <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded">
                                  💬 {(experience.hostSpecificData as any)?.consultationMethod || 'Video Call'}
                                </span>
                                <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded">
                                  🔄 {(experience.hostSpecificData as any)?.revisionRoundsIncluded || 0} revisions
                                </span>
                              </div>
                            )}
                            
                            {categoryType === 'Combo Guide' && (
                              <div className="flex flex-wrap gap-2">
                                <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                                  📷 Focus: {(experience.hostSpecificData as any)?.photographyFocus || 5}/10
                                </span>
                                <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                                  📸 {(experience.deliverables as any)?.photosIncluded || 0} photos
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button 
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteExperience(experience.id)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExperiencesPage;
