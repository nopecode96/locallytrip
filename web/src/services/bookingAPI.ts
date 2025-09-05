import { getBackendUrl } from '@/utils/backend';

// API service untuk booking system
const API_BASE_URL = getBackendUrl();

interface BookingData {
  category: 'guide' | 'photographer' | 'tripplanner' | 'combo';
  experience: {
    id: number;
    title: string;
    hostId?: number;
    price: number;
    location: string;
    duration: string;
  };
  contactInfo: {
    fullName: string;
    email: string;
    phone: string;
  };
  bookingDetails: any;
  paymentMethod: string;
}

interface BookingResponse {
  success: boolean;
  message: string;
  data?: {
    booking: {
      id: number;
      bookingReference: string;
      category: string;
      status: string;
      totalPrice: number;
      currency: string;
      experienceTitle: string;
      selectedDate?: string;
      selectedTime?: string;
    };
    categoryDetails?: any;
  };
  error?: string;
}

class BookingAPI {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Create a new booking
  async createBooking(bookingData: BookingData): Promise<BookingResponse> {
    return this.request<BookingResponse>('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  // Get booking by reference number
  async getBookingByReference(reference: string): Promise<BookingResponse> {
    return this.request<BookingResponse>(`/bookings/reference/${reference}`);
  }

  // Update booking status (for hosts/admin)
  async updateBookingStatus(reference: string, status: string, reason?: string): Promise<BookingResponse> {
    return this.request<BookingResponse>(`/bookings/reference/${reference}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, reason }),
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`,
      },
    });
  }

  // Get user bookings
  async getUserBookings(userId: number, filters?: {
    status?: string;
    category?: string;
    page?: number;
    limit?: number;
  }): Promise<BookingResponse> {
    const queryParams = new URLSearchParams();
    if (filters?.status) queryParams.append('status', filters.status);
    if (filters?.category) queryParams.append('category', filters.category);
    if (filters?.page) queryParams.append('page', filters.page.toString());
    if (filters?.limit) queryParams.append('limit', filters.limit.toString());

    const query = queryParams.toString();
    const endpoint = `/bookings/user/${userId}${query ? `?${query}` : ''}`;

    return this.request<BookingResponse>(endpoint, {
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`,
      },
    });
  }

  // Get host bookings (for host dashboard)
  async getHostBookings(hostId: number, filters?: {
    status?: string;
    category?: string;
    page?: number;
    limit?: number;
  }): Promise<BookingResponse> {
    const queryParams = new URLSearchParams();
    if (filters?.status) queryParams.append('status', filters.status);
    if (filters?.category) queryParams.append('category', filters.category);
    if (filters?.page) queryParams.append('page', filters.page.toString());
    if (filters?.limit) queryParams.append('limit', filters.limit.toString());

    const query = queryParams.toString();
    const endpoint = `/bookings/host/${hostId}${query ? `?${query}` : ''}`;

    return this.request<BookingResponse>(endpoint, {
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`,
      },
    });
  }

  // Get booking analytics (for admin)
  async getBookingAnalytics(period: number = 30): Promise<any> {
    return this.request<any>(`/bookings/analytics/overview?period=${period}`, {
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`,
      },
    });
  }

  private getAuthToken(): string {
    // This would get the auth token from localStorage or context
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken') || '';
    }
    return '';
  }

  // Helper method to format currency
  static formatCurrency(amount: number, currency: string = 'IDR'): string {
    if (currency === 'IDR') {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
      }).format(amount);
    }
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  // Helper method to format booking reference for display
  static formatBookingReference(reference: string): string {
    // Format LT2024123456 as LT-2024-123456
    if (reference.length >= 10) {
      return `${reference.slice(0, 2)}-${reference.slice(2, 6)}-${reference.slice(6)}`;
    }
    return reference;
  }

  // Helper method to get status color for UI
  static getStatusColor(status: string): string {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800'
    };
    return statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800';
  }

  // Helper method to get category emoji
  static getCategoryEmoji(category: string): string {
    const categoryEmojis = {
      guide: '🧑‍💼',
      photographer: '📸',
      tripplanner: '📝',
      combo: '🎁'
    };
    return categoryEmojis[category as keyof typeof categoryEmojis] || '✨';
  }
}

// Export singleton instance and class
export const bookingAPI = new BookingAPI();
export { BookingAPI };
export default bookingAPI;

// Export types for use in components
export type { BookingData, BookingResponse };
