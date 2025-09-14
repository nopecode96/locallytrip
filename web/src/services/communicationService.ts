import { 
  CommunicationApp, 
  UserCommunicationContact, 
  FormattedUserContact,
  CreateContactRequest,
  CommunicationAppsResponse,
  UserContactsResponse,
  FormattedContactsResponse,
  ContactResponse
} from '@/types/communication';

const API_BASE_URL = '/api'; // Use frontend API proxy

export class CommunicationService {
  /**
   * Get all active communication apps
   */
  static async getCommunicationApps(): Promise<CommunicationApp[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/communication/apps`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: CommunicationAppsResponse = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch communication apps');
      }
      
      return data.data;
    } catch (error) {
      console.error('Error fetching communication apps:', error);
      throw error;
    }
  }

  /**
   * Get user communication contacts
   */
  static async getUserContacts(
    userId: number, 
    includePrivate: boolean = false
  ): Promise<UserCommunicationContact[]> {
    try {
      const params = new URLSearchParams();
      if (includePrivate) {
        params.append('includePrivate', 'true');
      }
      
      const url = `${API_BASE_URL}/communication/users/${userId}/contacts${params.toString() ? '?' + params.toString() : ''}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: UserContactsResponse = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch user contacts');
      }
      
      return data.data;
    } catch (error) {
      console.error('Error fetching user contacts:', error);
      throw error;
    }
  }

  /**
   * Get formatted user communication contacts with links
   */
  static async getFormattedUserContacts(
    userId: number, 
    includePrivate: boolean = false
  ): Promise<FormattedUserContact[]> {
    try {
      const params = new URLSearchParams();
      if (includePrivate) {
        params.append('includePrivate', 'true');
      }
      
      const url = `${API_BASE_URL}/communication/users/${userId}/contacts/formatted${params.toString() ? '?' + params.toString() : ''}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: FormattedContactsResponse = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch formatted user contacts');
      }
      
      return data.data;
    } catch (error) {
      console.error('Error fetching formatted user contacts:', error);
      throw error;
    }
  }

  /**
   * Add or update user communication contact
   */
  static async addOrUpdateContact(
    userId: number,
    contactData: CreateContactRequest,
    authToken?: string
  ): Promise<UserCommunicationContact> {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (authToken) {
        headers.Authorization = `Bearer ${authToken}`;
      }
      
      const response = await fetch(`${API_BASE_URL}/communication/users/${userId}/contacts`, {
        method: 'POST',
        headers,
        body: JSON.stringify(contactData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ContactResponse = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to add/update contact');
      }
      
      return data.data;
    } catch (error) {
      console.error('Error adding/updating contact:', error);
      throw error;
    }
  }

  /**
   * Delete user communication contact
   */
  static async deleteContact(
    userId: number,
    contactId: number,
    authToken?: string
  ): Promise<void> {
    try {
      const headers: HeadersInit = {};
      
      if (authToken) {
        headers.Authorization = `Bearer ${authToken}`;
      }
      
      const response = await fetch(`${API_BASE_URL}/communication/users/${userId}/contacts/${contactId}`, {
        method: 'DELETE',
        headers,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to delete contact');
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
      throw error;
    }
  }

  /**
   * Generate contact link using app URL pattern
   */
  static generateContactLink(app: CommunicationApp, contactValue: string): string | null {
    if (!app.urlPattern) {
      return null;
    }

    let link = app.urlPattern;
    
    // Replace common placeholders
    link = link.replace('{username}', contactValue);
    link = link.replace('{phone}', contactValue);
    link = link.replace('{lineid}', contactValue);
    link = link.replace('{zaloid}', contactValue);
    link = link.replace('{userid}', contactValue);
    
    return link;
  }

  /**
   * Get communication app icon URL
   */
  static getAppIconUrl(app: CommunicationApp): string {
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    
    if (app.iconUrl) {
      return app.iconUrl.startsWith('http') 
        ? app.iconUrl 
        : `${BACKEND_URL}${app.iconUrl}`;
    }
    
    // Fallback to a default communication icon
    return `${BACKEND_URL}/images/communication-apps/default.png`;
  }

  /**
   * Get popular communication apps (first 5 by sort order)
   */
  static async getPopularApps(): Promise<CommunicationApp[]> {
    const allApps = await this.getCommunicationApps();
    return allApps.slice(0, 5);
  }

  /**
   * Search communication apps by name
   */
  static async searchApps(query: string): Promise<CommunicationApp[]> {
    const allApps = await this.getCommunicationApps();
    return allApps.filter(app => 
      app.name.toLowerCase().includes(query.toLowerCase()) ||
      app.displayName.toLowerCase().includes(query.toLowerCase())
    );
  }

  /**
   * Get host communication contacts after successful booking
   */
  static async getHostContactsForBooking(bookingId: string): Promise<{
    hostName: string;
    hostId: string;
    bookingId: string;
    contacts: FormattedUserContact[];
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/host-contacts`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Booking not found or payment not completed');
        }
        throw new Error('Failed to fetch host contacts');
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch host contacts');
      }
      
      return data.data;
    } catch (error) {
      console.error('Error fetching host contacts for booking:', error);
      throw error;
    }
  }
}
