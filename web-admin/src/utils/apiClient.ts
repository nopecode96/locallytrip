// API Client for web-admin using only NEXT_PUBLIC_API_URL
import { adminDeviceDetection } from './deviceDetection';

export class ApiClient {
  private static baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  static async fetchWithRetry(endpoint: string, options: RequestInit = {}, maxRetries = 3): Promise<Response> {
    let lastError: Error | null = null;
    const url = `${this.baseUrl}${endpoint}`;
    
    // Get admin device headers for comprehensive audit trail
    const deviceHeaders = adminDeviceDetection.getAdminDeviceHeaders();
      
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        
        
        const response = await fetch(url, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...deviceHeaders, // Add admin device detection headers
            ...options.headers,
          },
          // Add timeout
          signal: AbortSignal.timeout(10000) // 10 second timeout
        });
        
        if (response.ok) {
          
          return response;
        }
        
        
        
      } catch (error) {
        lastError = error as Error;
        
        
        // Wait before retry (exponential backoff)
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }
    
    // All attempts failed
    throw new Error(`API call failed after ${maxRetries} attempts. Last error: ${lastError?.message}`);
  }

  static async get(endpoint: string, options: RequestInit = {}) {
    return this.fetchWithRetry(endpoint, { ...options, method: 'GET' });
  }

  static async post(endpoint: string, data: any, options: RequestInit = {}) {
    return this.fetchWithRetry(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}
