// Host Category Types
export type HostCategoryType = 'Local Guide' | 'Photographer' | 'Combo Guide' | 'Trip Planner';

// Category-specific data interfaces
export interface LocalGuideSpecificData {
  transportationIncluded: boolean;
  vehicleType: 'Walking' | 'Motorbike' | 'Car' | 'Public Transport';
  languagesSpoken: string[];
  specialtyAreas: string[];
}

export interface PhotographerSpecificData {
  shootingStyle: string[];
  editingStyle: 'Natural' | 'Moody' | 'Bright & Airy' | 'Film-like';
}

export interface ComboGuideSpecificData extends LocalGuideSpecificData {
  photographyFocus: number; // 1-10 scale
}

export interface TripPlannerSpecificData {
  consultationMethod: 'Video Call' | 'In-person' | 'Chat' | 'Email';
  planningTimeframe: string;
  planningExpertise: string[];
  revisionRoundsIncluded: number;
}

export type HostSpecificData = 
  | LocalGuideSpecificData 
  | PhotographerSpecificData 
  | ComboGuideSpecificData 
  | TripPlannerSpecificData;

// Deliverables interfaces
export interface LocalGuideDeliverables {
  guidedTour: boolean;
  culturalExplanations: boolean;
  localRecommendations: boolean;
  photoOpportunities: boolean;
  hiddenGemAccess: boolean;
  restaurantReservations: boolean;
}

export interface PhotographerDeliverables {
  rawPhotosCount: number;
  editedPhotosCount: number;
  includesRetouching: boolean;
  printRights: boolean;
  commercialUse: boolean;
  onlineGallery: boolean;
  deliveryTimeBusinessDays: number;
}

export interface ComboGuideDeliverables extends LocalGuideDeliverables {
  photosIncluded: number;
  deliveryTimeBusinessDays: number;
}

export interface TripPlannerDeliverables {
  pdfItinerary: boolean;
  budgetBreakdown: boolean;
  accommodationRecommendations: boolean;
  transportationPlanning: boolean;
  emergencyContactsList: boolean;
  packingChecklist: boolean;
  culturalEtiquetteTips: boolean;
}

export type ExperienceDeliverables = 
  | LocalGuideDeliverables 
  | PhotographerDeliverables 
  | ComboGuideDeliverables 
  | TripPlannerDeliverables;

// Main Experience interface with category-specific fields
export interface Experience {
  id: number;
  title: string;
  description: string;
  shortDescription?: string;
  hostId: number;
  categoryId: number;
  experienceTypeId: number;
  price: number;
  duration: number;
  maxGuests: number;
  minGuests: number;
  meetingPoint: string;
  endingPoint?: string;
  walkingDistanceKm?: number;
  fitnessLevel: 'Easy' | 'Moderate' | 'Challenging';
  isActive: boolean;
  
  // Polymorphic fields
  hostSpecificData: HostSpecificData;
  deliverables: ExperienceDeliverables;
  equipmentUsed: string[];
  
  // Relationships
  host?: any;
  category?: any;
  experienceType?: any;
}

// Helper function to get category type from ID
export const getExperienceCategoryType = (categoryId: number): HostCategoryType => {
  const categoryMap: Record<number, HostCategoryType> = {
    1: 'Local Guide',
    2: 'Photographer', 
    3: 'Combo Guide',
    4: 'Trip Planner'
  };
  
  return categoryMap[categoryId] || 'Local Guide';
};

// Experience Type interface
export interface ExperienceType {
  id: number;
  name: string;
  description: string;
  categoryId: number;
  iconName: string;
}

// Helper to get experience types by category
export const getExperienceTypesByCategory = (categoryId: number): ExperienceType[] => {
  const experienceTypes: Record<number, ExperienceType[]> = {
    1: [ // Local Guide
      { id: 1, name: 'Hidden Gems Tour', description: 'Discover secret local spots', categoryId: 1, iconName: 'map' },
      { id: 2, name: 'Food Hunt Adventure', description: 'Culinary exploration tour', categoryId: 1, iconName: 'utensils' },
      { id: 3, name: 'Cultural Immersion', description: 'Deep dive into local culture', categoryId: 1, iconName: 'users' },
      { id: 4, name: 'Historical Walking Tour', description: 'Explore historical landmarks', categoryId: 1, iconName: 'landmark' },
      { id: 5, name: 'Local Market Experience', description: 'Traditional market exploration', categoryId: 1, iconName: 'shopping-bag' }
    ],
    2: [ // Photographer
      { id: 6, name: 'Pre-Wedding Shoot', description: 'Romantic couple photography', categoryId: 2, iconName: 'heart' },
      { id: 7, name: 'Portrait Session', description: 'Professional portrait photography', categoryId: 2, iconName: 'user' },
      { id: 8, name: 'Family Photo Shoot', description: 'Family photography session', categoryId: 2, iconName: 'users' },
      { id: 9, name: 'Instagram Photo Tour', description: 'Social media ready photos', categoryId: 2, iconName: 'instagram' },
      { id: 10, name: 'Fashion Photography', description: 'Style and fashion shoots', categoryId: 2, iconName: 'camera' }
    ],
    3: [ // Combo Guide
      { id: 11, name: 'Photo Walking Tour', description: 'Guided tour with photography', categoryId: 3, iconName: 'camera' },
      { id: 12, name: 'Sunset Photo Experience', description: 'Golden hour tour and photos', categoryId: 3, iconName: 'sun' },
      { id: 13, name: 'Cultural Photo Story', description: 'Document cultural experiences', categoryId: 3, iconName: 'book-open' },
      { id: 14, name: 'Adventure Photo Trek', description: 'Adventure activities with photos', categoryId: 3, iconName: 'mountain' },
      { id: 15, name: 'City Highlights Photo Tour', description: 'City tour with photo stops', categoryId: 3, iconName: 'building' }
    ],
    4: [ // Trip Planner
      { id: 16, name: 'Custom Itinerary Planning', description: 'Personalized trip planning', categoryId: 4, iconName: 'calendar' },
      { id: 17, name: 'Budget Travel Planning', description: 'Cost-effective trip planning', categoryId: 4, iconName: 'dollar-sign' },
      { id: 18, name: 'Luxury Travel Planning', description: 'High-end travel experiences', categoryId: 4, iconName: 'star' },
      { id: 19, name: 'Adventure Trip Planning', description: 'Outdoor adventure planning', categoryId: 4, iconName: 'compass' },
      { id: 20, name: 'Solo Travel Planning', description: 'Solo traveler itinerary', categoryId: 4, iconName: 'user-check' }
    ]
  };
  
  return experienceTypes[categoryId] || [];
};
