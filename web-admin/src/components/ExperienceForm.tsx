import React, { useState } from 'react';
import { getExperienceCategoryType } from '../types/experience-categories';

interface ExperienceFormProps {
  hostCategoryId: number;
  onSubmit: (experienceData: any) => void;
}

const ExperienceForm: React.FC<ExperienceFormProps> = ({ hostCategoryId, onSubmit }) => {
  const categoryType = getExperienceCategoryType(hostCategoryId);
  
  const [formData, setFormData] = useState({
    // Common fields
    title: '',
    description: '',
    shortDescription: '',
    experienceTypeId: 1,
    price: 0,
    duration: 4,
    maxGuests: 8,
    minGuests: 1,
    meetingPoint: '',
    endingPoint: '',
    walkingDistanceKm: 0,
    fitnessLevel: 'Easy' as 'Easy' | 'Moderate' | 'Challenging',
    
    // Category-specific data
    hostSpecificData: {},
    deliverables: {},
    equipmentUsed: [] as string[],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleHostDataChange = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      hostSpecificData: { ...prev.hostSpecificData, [key]: value }
    }));
  };

  const handleDeliverablesChange = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      deliverables: { ...prev.deliverables, [key]: value }
    }));
  };

  const handleEquipmentChange = (equipment: string[]) => {
    setFormData(prev => ({ ...prev, equipmentUsed: equipment }));
  };

  const renderLocalGuideFields = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-blue-900">Local Guide Specific Details</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Transportation Included
          </label>
          <select
            onChange={(e) => handleHostDataChange('transportationIncluded', e.target.value === 'true')}
            className="w-full p-2 border rounded-md"
          >
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Vehicle Type
          </label>
          <select
            onChange={(e) => handleHostDataChange('vehicleType', e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="Walking">Walking</option>
            <option value="Motorbike">Motorbike</option>
            <option value="Car">Car</option>
            <option value="Public Transport">Public Transport</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Languages Spoken (comma-separated)
        </label>
        <input
          type="text"
          placeholder="Indonesian, English, Mandarin"
          onChange={(e) => handleHostDataChange('languagesSpoken', e.target.value.split(',').map(s => s.trim()))}
          className="w-full p-2 border rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Specialty Areas (comma-separated)
        </label>
        <input
          type="text"
          placeholder="Food, History, Architecture"
          onChange={(e) => handleHostDataChange('specialtyAreas', e.target.value.split(',').map(s => s.trim()))}
          className="w-full p-2 border rounded-md"
        />
      </div>

      {/* Deliverables */}
      <div className="border-t pt-4">
        <h4 className="font-medium text-gray-900 mb-2">Tour Inclusions</h4>
        <div className="space-y-2">
          {[
            { key: 'guidedTour', label: 'Professional guided tour' },
            { key: 'culturalExplanations', label: 'Cultural explanations' },
            { key: 'localRecommendations', label: 'Local recommendations' },
            { key: 'photoOpportunities', label: 'Photo opportunities' },
            { key: 'hiddenGemAccess', label: 'Access to hidden spots' },
            { key: 'restaurantReservations', label: 'Restaurant reservations' },
          ].map(item => (
            <label key={item.key} className="flex items-center space-x-2">
              <input
                type="checkbox"
                onChange={(e) => handleDeliverablesChange(item.key, e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">{item.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPhotographerFields = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-purple-900">Photography Service Details</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Shooting Style (comma-separated)
          </label>
          <input
            type="text"
            placeholder="Portrait, Lifestyle, Documentary"
            onChange={(e) => handleHostDataChange('shootingStyle', e.target.value.split(',').map(s => s.trim()))}
            className="w-full p-2 border rounded-md"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Editing Style
          </label>
          <select
            onChange={(e) => handleHostDataChange('editingStyle', e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="Natural">Natural</option>
            <option value="Moody">Moody</option>
            <option value="Bright & Airy">Bright & Airy</option>
            <option value="Film-like">Film-like</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Equipment Used (comma-separated)
        </label>
        <input
          type="text"
          placeholder="Canon 5D Mark IV, 50mm f/1.4 lens, Reflector"
          onChange={(e) => handleEquipmentChange(e.target.value.split(',').map(s => s.trim()))}
          className="w-full p-2 border rounded-md"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Raw Photos Count
          </label>
          <input
            type="number"
            onChange={(e) => handleDeliverablesChange('rawPhotosCount', parseInt(e.target.value))}
            className="w-full p-2 border rounded-md"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Edited Photos Count
          </label>
          <input
            type="number"
            onChange={(e) => handleDeliverablesChange('editedPhotosCount', parseInt(e.target.value))}
            className="w-full p-2 border rounded-md"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Delivery Time (Business Days)
        </label>
        <input
          type="number"
          onChange={(e) => handleDeliverablesChange('deliveryTimeBusinessDays', parseInt(e.target.value))}
          className="w-full p-2 border rounded-md"
        />
      </div>

      <div className="space-y-2">
        <h4 className="font-medium text-gray-900">Photo Package Includes</h4>
        {[
          { key: 'includesRetouching', label: 'Professional retouching' },
          { key: 'printRights', label: 'Print rights' },
          { key: 'commercialUse', label: 'Commercial use rights' },
          { key: 'onlineGallery', label: 'Online gallery access' },
        ].map(item => (
          <label key={item.key} className="flex items-center space-x-2">
            <input
              type="checkbox"
              onChange={(e) => handleDeliverablesChange(item.key, e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">{item.label}</span>
          </label>
        ))}
      </div>
    </div>
  );

  const renderTripPlannerFields = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-emerald-900">Trip Planning Service Details</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Consultation Method
          </label>
          <select
            onChange={(e) => handleHostDataChange('consultationMethod', e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="Video Call">Video Call</option>
            <option value="In-person">In-person</option>
            <option value="Chat">Chat</option>
            <option value="Email">Email</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Planning Timeframe
          </label>
          <input
            type="text"
            placeholder="7-14 business days"
            onChange={(e) => handleHostDataChange('planningTimeframe', e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Planning Expertise (comma-separated)
        </label>
        <input
          type="text"
          placeholder="Budget Travel, Adventure, Solo"
          onChange={(e) => handleHostDataChange('planningExpertise', e.target.value.split(',').map(s => s.trim()))}
          className="w-full p-2 border rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Revision Rounds Included
        </label>
        <input
          type="number"
          onChange={(e) => handleHostDataChange('revisionRoundsIncluded', parseInt(e.target.value))}
          className="w-full p-2 border rounded-md"
        />
      </div>

      <div className="space-y-2">
        <h4 className="font-medium text-gray-900">Planning Package Includes</h4>
        {[
          { key: 'pdfItinerary', label: 'Detailed PDF itinerary' },
          { key: 'budgetBreakdown', label: 'Budget breakdown' },
          { key: 'accommodationRecommendations', label: 'Accommodation recommendations' },
          { key: 'transportationPlanning', label: 'Transportation planning' },
          { key: 'emergencyContactsList', label: 'Emergency contacts' },
          { key: 'packingChecklist', label: 'Packing checklist' },
          { key: 'culturalEtiquetteTips', label: 'Cultural etiquette tips' },
        ].map(item => (
          <label key={item.key} className="flex items-center space-x-2">
            <input
              type="checkbox"
              onChange={(e) => handleDeliverablesChange(item.key, e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">{item.label}</span>
          </label>
        ))}
      </div>
    </div>
  );

  const renderComboGuideFields = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-indigo-900">Combo Guide & Photography Details</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Photography Focus (1-10, where 10 is heavy photography focus)
        </label>
        <input
          type="range"
          min="1"
          max="10"
          onChange={(e) => handleHostDataChange('photographyFocus', parseInt(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Include fields from both Local Guide and Photographer */}
      {renderLocalGuideFields()}
      
      <div className="border-t pt-4">
        <h4 className="font-medium text-gray-900 mb-2">Photography Add-on</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Photos Included
            </label>
            <input
              type="number"
              onChange={(e) => handleDeliverablesChange('photosIncluded', parseInt(e.target.value))}
              className="w-full p-2 border rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Delivery Time (Days)
            </label>
            <input
              type="number"
              onChange={(e) => handleDeliverablesChange('deliveryTimeBusinessDays', parseInt(e.target.value))}
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderCategorySpecificFields = () => {
    switch (categoryType) {
      case 'Local Guide':
        return renderLocalGuideFields();
      case 'Photographer':
        return renderPhotographerFields();
      case 'Combo Guide':
        return renderComboGuideFields();
      case 'Trip Planner':
        return renderTripPlannerFields();
      default:
        return null;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-900">
          Create {categoryType} Experience
        </h2>
        <p className="text-gray-600">Fill in the details for your new experience</p>
      </div>

      {/* Common Fields */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Experience Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price (IDR)
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration (hours)
            </label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
        </div>
      </div>

      {/* Category-specific Fields */}
      {renderCategorySpecificFields()}

      <div className="border-t pt-6">
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          Create Experience
        </button>
      </div>
    </form>
  );
};

export default ExperienceForm;
