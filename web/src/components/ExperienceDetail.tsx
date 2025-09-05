import React from 'react';
import { Experience, getExperienceCategoryType, HostSpecificData, ExperienceDeliverables } from '../types/experience-categories';

interface ExperienceDetailProps {
  experience: Experience;
}

const ExperienceDetail: React.FC<ExperienceDetailProps> = ({ experience }) => {
  const categoryType = getExperienceCategoryType(experience.categoryId);

  const renderLocalGuideInfo = (data: any, deliverables: any) => (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">🗺️ Guide Information</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="font-medium">Transportation:</span>
            <span className="ml-2">{data.transportationIncluded ? '✅ Included' : '❌ Not included'}</span>
          </div>
          <div>
            <span className="font-medium">Vehicle Type:</span>
            <span className="ml-2">{data.vehicleType}</span>
          </div>
          <div>
            <span className="font-medium">Languages:</span>
            <span className="ml-2">{data.languagesSpoken?.join(', ')}</span>
          </div>
          <div>
            <span className="font-medium">Specialty Areas:</span>
            <span className="ml-2">{data.specialtyAreas?.join(', ')}</span>
          </div>
        </div>
      </div>
      
      {experience.walkingDistanceKm && (
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>👟 Walking Distance:</span>
          <span>{experience.walkingDistanceKm} km</span>
        </div>
      )}

      <div className="bg-green-50 p-4 rounded-lg">
        <h4 className="font-semibold text-green-900 mb-2">✅ What's Included</h4>
        <ul className="text-sm space-y-1">
          {deliverables.guidedTour && <li>• Professional local guide</li>}
          {deliverables.culturalExplanations && <li>• Cultural stories & explanations</li>}
          {deliverables.localRecommendations && <li>• Local restaurant recommendations</li>}
          {deliverables.photoOpportunities && <li>• Photo opportunities at scenic spots</li>}
          {deliverables.hiddenGemAccess && <li>• Access to hidden local spots</li>}
        </ul>
      </div>
    </div>
  );

  const renderPhotographerInfo = (data: any, deliverables: any) => (
    <div className="space-y-4">
      <div className="bg-purple-50 p-4 rounded-lg">
        <h3 className="font-semibold text-purple-900 mb-2">📸 Photography Service</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="font-medium">Style:</span>
            <span className="ml-2">{data.shootingStyle?.join(', ')}</span>
          </div>
          <div>
            <span className="font-medium">Editing Style:</span>
            <span className="ml-2">{data.editingStyle}</span>
          </div>
          <div>
            <span className="font-medium">Weather Backup:</span>
            <span className="ml-2">{data.weatherBackupPlan ? '✅ Available' : '❌ No backup'}</span>
          </div>
          <div>
            <span className="font-medium">Assistant:</span>
            <span className="ml-2">{data.assistantIncluded ? '✅ Included' : '❌ Solo photographer'}</span>
          </div>
        </div>
      </div>

      {experience.equipmentUsed && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">🎥 Equipment Used</h4>
          <div className="flex flex-wrap gap-2">
            {experience.equipmentUsed.map((equipment, index) => (
              <span key={index} className="bg-gray-200 px-2 py-1 rounded text-sm">
                {equipment}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="bg-pink-50 p-4 rounded-lg">
        <h4 className="font-semibold text-pink-900 mb-2">📦 Photo Deliverables</h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="font-medium">Edited Photos:</span>
            <span className="ml-2">{deliverables.editedPhotosCount} photos</span>
          </div>
          <div>
            <span className="font-medium">Raw Photos:</span>
            <span className="ml-2">{deliverables.rawPhotosCount} photos</span>
          </div>
          <div>
            <span className="font-medium">Delivery Time:</span>
            <span className="ml-2">{deliverables.deliveryTimeBusinessDays} business days</span>
          </div>
          <div>
            <span className="font-medium">Print Rights:</span>
            <span className="ml-2">{deliverables.printRights ? '✅ Included' : '❌ Not included'}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderComboGuideInfo = (data: any, deliverables: any) => (
    <div className="space-y-4">
      <div className="bg-indigo-50 p-4 rounded-lg">
        <h3 className="font-semibold text-indigo-900 mb-2">🎯 Combo Guide & Photography</h3>
        <div className="mb-3">
          <div className="flex items-center justify-between text-sm">
            <span>Guide Focus</span>
            <span>Photography Focus</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-indigo-600 h-2.5 rounded-full" 
              style={{ width: `${data.photographyFocus * 10}%` }}
            ></div>
          </div>
          <div className="text-center text-xs text-gray-600 mt-1">
            {data.photographyFocus}/10 Photography Focus
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="font-medium">Equipment:</span>
            <span className="ml-2">{data.equipmentPortability}</span>
          </div>
          <div>
            <span className="font-medium">Photo Style:</span>
            <span className="ml-2">{data.candidVsPosted}</span>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 p-4 rounded-lg">
        <h4 className="font-semibold text-amber-900 mb-2">📸 Photos + Tour Included</h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="font-medium">Photos Included:</span>
            <span className="ml-2">{deliverables.photosIncluded} photos</span>
          </div>
          <div>
            <span className="font-medium">Edited Photos:</span>
            <span className="ml-2">{deliverables.editedPhotosIncluded} photos</span>
          </div>
          <div>
            <span className="font-medium">Action Shots:</span>
            <span className="ml-2">{deliverables.actionShots ? '✅ Included' : '❌ Not included'}</span>
          </div>
          <div>
            <span className="font-medium">Group Photos:</span>
            <span className="ml-2">{deliverables.groupPhotos ? '✅ Included' : '❌ Not included'}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTripPlannerInfo = (data: any, deliverables: any) => (
    <div className="space-y-4">
      <div className="bg-emerald-50 p-4 rounded-lg">
        <h3 className="font-semibold text-emerald-900 mb-2">✈️ Trip Planning Service</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="font-medium">Consultation:</span>
            <span className="ml-2">{data.consultationMethod}</span>
          </div>
          <div>
            <span className="font-medium">Delivery Time:</span>
            <span className="ml-2">{data.planningTimeframe}</span>
          </div>
          <div>
            <span className="font-medium">Revisions:</span>
            <span className="ml-2">{data.revisionRoundsIncluded} rounds included</span>
          </div>
          <div>
            <span className="font-medium">Emergency Support:</span>
            <span className="ml-2">{data.emergencySupport ? '✅ Available' : '❌ Planning only'}</span>
          </div>
        </div>
        
        <div className="mt-3">
          <div className="font-medium text-sm mb-1">Expertise Areas:</div>
          <div className="flex flex-wrap gap-1">
            {data.planningExpertise?.map((expertise: string, index: number) => (
              <span key={index} className="bg-emerald-200 text-emerald-800 px-2 py-1 rounded text-xs">
                {expertise}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-teal-50 p-4 rounded-lg">
        <h4 className="font-semibold text-teal-900 mb-2">📋 What You'll Receive</h4>
        <ul className="text-sm space-y-1">
          {deliverables.pdfItinerary && <li>• 📄 Detailed PDF itinerary</li>}
          {deliverables.budgetBreakdown && <li>• 💰 Complete budget breakdown</li>}
          {deliverables.accommodationRecommendations && <li>• 🏨 Accommodation recommendations</li>}
          {deliverables.transportationPlanning && <li>• 🚗 Transportation planning</li>}
          {deliverables.emergencyContactsList && <li>• 📞 Emergency contacts list</li>}
          {deliverables.packingChecklist && <li>• 🎒 Packing checklist</li>}
          {deliverables.culturalEtiquetteTips && <li>• 🤝 Cultural etiquette tips</li>}
        </ul>
      </div>
    </div>
  );

  const renderCategorySpecificInfo = () => {
    const hostData = experience.hostSpecificData;
    const deliverables = experience.deliverables;

    if (!hostData || !deliverables) {
      return <div className="text-gray-500">No category-specific information available</div>;
    }

    switch (categoryType) {
      case 'Local Guide':
        return renderLocalGuideInfo(hostData, deliverables);
      case 'Photographer':
        return renderPhotographerInfo(hostData, deliverables);
      case 'Combo Guide':
        return renderComboGuideInfo(hostData, deliverables);
      case 'Trip Planner':
        return renderTripPlannerInfo(hostData, deliverables);
      default:
        return <div className="text-gray-500">Unknown category type</div>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {categoryType}
          </span>
          {experience.fitnessLevel && (
            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
              Fitness: {experience.fitnessLevel}
            </span>
          )}
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{experience.title}</h1>
        <p className="text-gray-600 text-lg">{experience.description}</p>
      </div>

      {/* Category-specific content */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Experience Details</h2>
        {renderCategorySpecificInfo()}
      </div>

      {/* Common info */}
      <div className="border-t pt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-900">Duration:</span>
            <div>{experience.duration} hours</div>
          </div>
          <div>
            <span className="font-medium text-gray-900">Group Size:</span>
            <div>{experience.minGuests}-{experience.maxGuests} people</div>
          </div>
          <div>
            <span className="font-medium text-gray-900">Price:</span>
            <div>Rp {experience.price.toLocaleString()}</div>
          </div>
          <div>
            <span className="font-medium text-gray-900">Difficulty:</span>
            <div>{experience.fitnessLevel || 'Not specified'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceDetail;
