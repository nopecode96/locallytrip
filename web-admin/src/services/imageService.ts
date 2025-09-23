export class ImageService {
  // Generate backend image URL with category-based path resolution
  static getImageUrl(imagePath: string, category?: string): string {
    if (!imagePath) return '';
    
    // Return absolute URLs as-is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // Get the base URL for images
    let baseUrl = process.env.NEXT_PUBLIC_IMAGES || 'http://localhost:3001/images';
    
    // Additional safety check for client-side
    if (typeof window !== 'undefined' && baseUrl.includes('backend')) {
      baseUrl = baseUrl.replace('backend', 'localhost');
    }
    
    // Category-based path construction
    if (category) {
      // Handle specific categories
      switch (category) {
        case 'users/avatars':
          return `${baseUrl}/users/avatars/${imagePath}`;
        case 'experiences':
          return `${baseUrl}/experiences/${imagePath}`;
        case 'stories':
          return `${baseUrl}/stories/${imagePath}`;
        default:
          return `${baseUrl}/${category}/${imagePath}`;
      }
    }
    
    // Default: direct path
    return `${baseUrl}/${imagePath}`;
  }
}