// TypeScript interfaces for category-specific experience data

export interface BaseExperienceData {
  id: number;
  title: string;
  description: string;
  hostId: number;
  categoryId: number; // Host category (1=Local Guide, 2=Photographer, 3=Combo, 4=Trip Planner)
  experienceTypeId: number;
  price: number;
  duration: number;
  maxGuests: number;
  minGuests: number;
}

// Local Guide Specific Data
export interface LocalGuideSpecificData {
  transportationIncluded: boolean;
  vehicleType?: string; // "Walking", "Motorbike", "Car", "Public Transport"
  languagesSpoken: string[];
  specialtyAreas: string[]; // ["Food", "History", "Architecture", "Nightlife"]
  flexibleTiming: boolean;
  groupSizePreference: 'Small' | 'Medium' | 'Large';
}

export interface LocalGuideDeliverables {
  guidedTour: boolean;
  culturalExplanations: boolean;
  localRecommendations: boolean;
  photoOpportunities: boolean;
  hiddenGemAccess: boolean;
  restaurantReservations?: boolean;
}

// Photographer Specific Data
export interface PhotographerSpecificData {
  shootingStyle: string[]; // ["Portrait", "Lifestyle", "Documentary", "Fashion"]
  specialtyTypes: string[]; // ["Pre-wedding", "Family", "Travel", "Event"]
  editingStyle: string; // "Natural", "Moody", "Bright & Airy", "Film-like"
  weatherBackupPlan: boolean;
  assistantIncluded: boolean;
  studioAccess?: boolean;
}

export interface PhotographerDeliverables {
  rawPhotosCount: number;
  editedPhotosCount: number;
  deliveryTimeBusinessDays: number;
  deliveryFormats: string[]; // ["High-res JPEG", "RAW files", "Web-optimized"]
  includesRetouching: boolean;
  printRights: boolean;
  commercialUse: boolean;
  onlineGallery: boolean;
}

// Combo Guide Specific Data (inherits from both)
export interface ComboGuideSpecificData extends LocalGuideSpecificData {
  photographyFocus: number; // 1-10 scale, 1=mostly guide, 10=mostly photography
  equipmentPortability: 'Lightweight' | 'Standard' | 'Professional';
  candidVsPosted: 'Candid' | 'Posed' | 'Mixed';
}

export interface ComboGuideDeliverables extends LocalGuideDeliverables {
  photosIncluded: number;
  editedPhotosIncluded: number;
  deliveryTimeBusinessDays: number;
  actionShots: boolean;
  groupPhotos: boolean;
}

// Trip Planner Specific Data
export interface TripPlannerSpecificData {
  consultationMethod: 'Video Call' | 'In-person' | 'Chat' | 'Email';
  planningExpertise: string[]; // ["Budget Travel", "Luxury", "Adventure", "Family", "Solo"]
  destinationSpecialty: string[]; // ["Southeast Asia", "Indonesia", "Islands", "Cities"]
  planningTimeframe: string; // "7-14 business days"
  revisionRoundsIncluded: number;
  emergencySupport: boolean;
}

export interface TripPlannerDeliverables {
  pdfItinerary: boolean;
  budgetBreakdown: boolean;
  accommodationRecommendations: boolean;
  transportationPlanning: boolean;
  activityBookingAssistance: boolean;
  restaurantReservations: boolean;
  emergencyContactsList: boolean;
  packingChecklist: boolean;
  weatherGuidance: boolean;
  culturalEtiquetteTips: boolean;
}

// Union types for polymorphic data
export type HostSpecificData = 
  | LocalGuideSpecificData 
  | PhotographerSpecificData 
  | ComboGuideSpecificData 
  | TripPlannerSpecificData;

export type ExperienceDeliverables = 
  | LocalGuideDeliverables 
  | PhotographerDeliverables 
  | ComboGuideDeliverables 
  | TripPlannerDeliverables;

// Complete Experience interface
export interface Experience extends BaseExperienceData {
  hostSpecificData?: HostSpecificData;
  deliverables?: ExperienceDeliverables;
  equipmentUsed?: string[];
  endingPoint?: string;
  walkingDistanceKm?: number;
  fitnessLevel?: 'Easy' | 'Moderate' | 'Challenging';
}

// Helper function to determine experience category
export function getExperienceCategoryType(categoryId: number): string {
  switch(categoryId) {
    case 1: return 'Local Guide';
    case 2: return 'Photographer';
    case 3: return 'Combo Guide';
    case 4: return 'Trip Planner';
    default: return 'Unknown';
  }
}
