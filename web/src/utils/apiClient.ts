// API Client - menggunakan hanya NEXT_PUBLIC_API_URL
export class ApiClient {
  private static getApiUrl(): string {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  }

  static async fetchWithRetry(endpoint: string, options: RequestInit = {}, maxRetries = 3): Promise<Response> {
    let lastError: Error | null = null;
    const baseUrl = this.getApiUrl();
    const url = `${baseUrl}${endpoint}`;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        
        const response = await fetch(url, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
        });

        if (!response.ok && response.status >= 500 && attempt < maxRetries) {
          throw new Error(`Server error: ${response.status}`);
        }

        return response;
      } catch (error) {
        lastError = error as Error;
        
        if (attempt < maxRetries) {
          // Wait before retry (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }
    
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

  static async put(endpoint: string, data: any, options: RequestInit = {}) {
    return this.fetchWithRetry(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  static async delete(endpoint: string, options: RequestInit = {}) {
    return this.fetchWithRetry(endpoint, { ...options, method: 'DELETE' });
  }
}
