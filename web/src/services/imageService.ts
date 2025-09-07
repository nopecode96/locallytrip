import { getBackendUrl, getImageBaseUrl } from '@/utils/backend';

export class ImageService {
  // Generate backend image URL with category-based path resolution
  static getImageUrl(imagePath: string, category?: string): string {
    if (!imagePath) return '';
    
    // Return absolute URLs as-is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // Get the base URL for images - prioritize environment variables
    let baseUrl = process.env.NEXT_PUBLIC_IMAGES;
    
    // Fallback chain for different environments
    if (!baseUrl) {
      if (typeof window !== 'undefined') {
        // Client-side: check window object or use production URL as fallback
        baseUrl = 'https://api.locallytrip.com/images';
      } else {
        // Server-side: use internal container URL or localhost
        baseUrl = process.env.INTERNAL_IMAGES_URL || 'http://backend:3001/images';
      }
    }
    
    // Additional safety check for client-side
    if (typeof window !== 'undefined' && baseUrl.includes('backend')) {
      baseUrl = baseUrl.replace('backend', 'localhost');
    }
    
    // Handle different input formats
    
    // Clean the path to prevent duplication
    let cleanPath = imagePath;
    
    // Remove leading slashes
    cleanPath = cleanPath.replace(/^\/+/, '');
    
    // Remove /images/ prefix if present (to prevent duplication)
    if (cleanPath.startsWith('images/')) {
      cleanPath = cleanPath.substring(7); // Remove 'images/'
    }
    
    // Generate final URL with category if provided
    let fullUrl: string;
    if (category && !cleanPath.includes('/')) {
      // If category provided and filename doesn't already have path, add category folder
      fullUrl = `${baseUrl}/${category}/${cleanPath}`;
    } else {
      // Use filename as-is (may already contain folder structure)
      fullUrl = `${baseUrl}/${cleanPath}`;
    }
    
    return fullUrl;
  }
  
  // Category-specific helper methods for better type safety
  static getUserAvatar(filename: string): string {
    return this.getImageUrl(filename, 'users/avatars');
  }
  
  static getExperienceImage(filename: string): string {
    const result = this.getImageUrl(filename, 'experiences');
    
    return result;
  }
  
  static getStoryImage(filename: string): string {
    return this.getImageUrl(filename, 'stories');
  }
  
  static getCityImage(filename: string): string {
    return this.getImageUrl(filename, 'cities');
  }
  
  static getHostImage(filename: string): string {
    return this.getImageUrl(filename, 'hosts');
  }

  // Upload single image
  static async uploadImage(file: File, type: string, token: string): Promise<{success: boolean, data?: any, message?: string}> {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${getBackendUrl()}/images/upload/single/${type}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();
      return result;
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Upload failed'
      };
    }
  }

  // Upload multiple images
  static async uploadMultipleImages(files: FileList, token: string): Promise<{success: boolean, data?: any, message?: string}> {
    try {
      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append('images', file);
      });

      const response = await fetch(`${getBackendUrl()}/images/upload/multiple/experience`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();
      return result;
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Upload failed'
      };
    }
  }

  // Delete image
  static async deleteImage(filename: string, token: string): Promise<{success: boolean, message?: string}> {
    try {
      const response = await fetch(`${getBackendUrl()}/images/delete/${filename}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      return result;
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Delete failed'
      };
    }
  }
}

export default ImageService;
