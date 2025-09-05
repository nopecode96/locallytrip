// Newsletter API Service
// Handles all newsletter-related API calls

export interface NewsletterSubscription {
  email: string;
  name?: string;
  frequency?: 'weekly' | 'monthly' | 'bi-weekly';
  categories?: string[];
  source?: 'homepage' | 'register' | 'story_detail' | 'experience_detail' | 'manual';
}

export interface NewsletterPreferences {
  weeklyNewsletter?: boolean;
  newExperiences?: boolean;
  featuredStories?: boolean;
  specialOffers?: boolean;
}

export interface NewsletterStats {
  totalSubscriptions: number;
  activeSubscriptions: number;
  verifiedSubscriptions: number;
  userSubscriptions: number;
  guestSubscriptions: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

class NewsletterAPI {
  // Use Next.js API proxy instead of direct backend calls
  constructor() {
    // Empty constructor - we'll use relative paths to Next.js API routes
  }

  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      // Use Next.js API proxy routes instead of direct backend calls
      const response = await fetch(`/api${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('API Response Error:', {
          status: response.status,
          statusText: response.statusText,
          data
        });
        
        // Provide more specific error messages for validation failures
        if (response.status === 400 && data.errors) {
          const errorMessages = data.errors.map((error: any) => error.msg).join(', ');
          throw new Error(`Validation failed: ${errorMessages}`);
        }
        
        throw new Error(`HTTP error! status: ${response.status} - ${data.message || data.error || 'Unknown error'}`);
      }

      return data;
    } catch (error) {
      console.error('Newsletter API error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  private getAuthHeaders(): HeadersInit {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // Public methods
  /**
   * Subscribe to newsletter (guest or user)
   */
  async subscribe(data: NewsletterSubscription): Promise<ApiResponse<{ requiresVerification: boolean }>> {
    
    return this.makeRequest('/newsletter/subscribe', {
      method: 'POST',
      headers: {
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });
  }

  /**
   * Verify newsletter subscription via token
   */
  async verifySubscription(token: string): Promise<ApiResponse> {
    return this.makeRequest(`/newsletter/verify/${token}`, {
      method: 'GET',
    });
  }

  /**
   * Unsubscribe from newsletter via token
   */
  async unsubscribe(token: string): Promise<ApiResponse> {
    return this.makeRequest(`/newsletter/unsubscribe/${token}`, {
      method: 'GET',
    });
  }

  // Authenticated user methods
  /**
   * Get user's newsletter subscription status
   */
  async getUserSubscription(): Promise<ApiResponse<{
    isSubscribed: boolean;
    preferences: NewsletterPreferences;
    subscribedAt?: string;
  }>> {
    return this.makeRequest('/newsletter/subscription', {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
  }

  /**
   * Update user's newsletter preferences
   */
  async updatePreferences(data: {
    preferences?: NewsletterPreferences;
    isSubscribed?: boolean;
  }): Promise<ApiResponse> {
    return this.makeRequest('/newsletter/preferences', {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
  }

  // Admin methods
  /**
   * Get newsletter statistics (admin only)
   */
  async getStats(): Promise<ApiResponse<NewsletterStats>> {
    return this.makeRequest('/newsletter/stats', {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
  }

  /**
   * Get all newsletter subscriptions (admin only)
   */
  async getAllSubscriptions(params?: {
    page?: number;
    limit?: number;
    verified?: boolean;
    subscribed?: boolean;
  }): Promise<ApiResponse<{
    subscriptions: any[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    
    const queryString = queryParams.toString();
    const endpoint = `/newsletter/subscriptions${queryString ? `?${queryString}` : ''}`;
    
    return this.makeRequest(endpoint, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
  }
}

// Export singleton instance
export const newsletterAPI = new NewsletterAPI();

// Export individual methods for convenience
export const {
  subscribe: subscribeToNewsletter,
  verifySubscription: verifyNewsletterSubscription,
  unsubscribe: unsubscribeFromNewsletter,
  getUserSubscription,
  updatePreferences: updateNewsletterPreferences,
  getStats: getNewsletterStats,
  getAllSubscriptions: getAllNewsletterSubscriptions,
} = newsletterAPI;
