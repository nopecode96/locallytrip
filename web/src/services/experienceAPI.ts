// API service untuk experiences
export interface Experience {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  currency: string;
  duration: number;
  maxGuests: number;
  minGuests?: number;
  minAge?: number;
  difficulty: string;
  fitnessLevel?: string;
  walkingDistance?: number;
  equipmentUsed?: string[];
  hostSpecificData?: any;
  deliverables?: any;
  status: string;
  isActive: boolean;
  isFeatured: boolean;
  rating?: number;
  totalReviews: number;
  viewCount: number;
  bookingCount: number;
  coverImage?: string;
  images?: string[];
  included?: string[];
  excluded?: string[];
  requirements?: string[];
  cancellationPolicy?: string;
  meetingPoint?: string;
  latitude?: number;
  longitude?: number;
  hostName?: string; // Added for simplified host display
  host?: {
    id: number;
    name: string;
    avatarUrl?: string;
    avatar?: string;  // Added for transformed API response
    bio?: string;
    rating?: number;
    totalReviews?: number;
    languages?: Array<{
      id: number;
      name: string;
      code: string;
    }>;
    hostCategories?: Array<{
      id: number;
      name: string;
      icon: string;
      description: string;
    }>;
  };
  city: {
    id: string;
    name: string;
    slug: string;
    country?: {
      id: string;
      name: string;
      code: string;
    };
  };
  category: {
    id: number;
    name: string;
    slug: string;
    icon: string;
    description: string;
  };
  experienceType?: {
    id: number;
    name: string;
    description: string;
  };
  itinerary?: Array<{
    id: string | number;
    title: string;
    description: string;
    durationMinutes: number;
    stepNumber: number;
    location?: string;
  }>;
  reviews?: Array<{
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    reviewer: {
      id: string;
      firstName: string;
      lastName: string;
      avatar: string;
    };
  }>;
}

export interface ExperiencesResponse {
  success: boolean;
  data: {
    experiences: Experience[];
    pagination: {
      total: number;
      pages: number;
      currentPage: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
  message?: string;
}

export interface ExperienceFilters {
  page?: number;
  limit?: number;
  category?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  currency?: string;
  sortBy?: 'createdAt' | 'price' | 'rating' | 'title' | 'viewCount' | 'bookingCount';
  sortOrder?: 'ASC' | 'DESC';
}

class ExperienceAPI {
  private baseURL: string;

  constructor() {
    this.baseURL = '/api'; // Use frontend API proxy
  }

  async getAllExperiences(filters: ExperienceFilters = {}): Promise<ExperiencesResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });

      const url = `${this.baseURL}/experiences${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }

  async getExperienceById(id: string): Promise<{ success: boolean; data: Experience; message?: string }> {
    try {
      const response = await fetch(`${this.baseURL}/experiences/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }

  async getExperienceBySlug(slug: string): Promise<{ success: boolean; data: Experience; message?: string }> {
    try {
      const response = await fetch(`${this.baseURL}/experiences/slug/${slug}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }

  async getFeaturedExperiences(limit: number = 6): Promise<ExperiencesResponse> {
    try {
      const url = `${this.baseURL}/experiences/featured?limit=${limit}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }

  async getPopularExperiences(limit: number = 8): Promise<ExperiencesResponse> {
    return this.getAllExperiences({
      limit,
      sortBy: 'viewCount',
      sortOrder: 'DESC'
    });
  }
}

export const experienceAPI = new ExperienceAPI();
export default experienceAPI;
