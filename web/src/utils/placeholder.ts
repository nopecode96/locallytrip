// Placeholder image utility - Using local placeholder images
import { ImageService } from '@/services/imageService';

export class PlaceholderService {
  // Generate placeholder for experiences based on category
  static getExperiencePlaceholder(category?: string): string {
    // Use local placeholder instead of external service
    return ImageService.getImageUrl('default-experience.jpg', 'placeholders');
  }

  // Generate placeholder for user/host profile
  static getProfilePlaceholder(name?: string): string {
    // Use local avatar placeholder
    return ImageService.getImageUrl('default-avatar.jpg', 'placeholders');
  }

  // Generate placeholder for cities
  static getCityPlaceholder(cityName?: string): string {
    // Use general placeholder for cities
    return ImageService.getImageUrl('placeholder.jpg', 'placeholders');
  }

  // Generate placeholder for hosts
  static getHostPlaceholder(name?: string): string {
    return ImageService.getImageUrl('default-host.jpg', 'placeholders');
  }

  // Generate placeholder for stories  
  static getStoryPlaceholder(name?: string): string {
    return ImageService.getImageUrl('default-story.jpg', 'placeholders');
  }

  // Generate colored placeholder with text (fallback to local)
  static getColoredPlaceholder(
    text: string, 
    width: number = 800, 
    height: number = 600,
    bgColor: string = '6B7280',
    textColor: string = 'FFFFFF'
  ): string {
    // Fallback to general placeholder instead of external service
    return ImageService.getImageUrl('placeholder.jpg', 'placeholders');
  }

  // Generate SVG placeholder (for immediate rendering)
  static getSVGPlaceholder(
    width: number = 800,
    height: number = 600,
    text: string = 'Loading...',
    bgColor: string = '#f3f4f6',
    textColor: string = '#6b7280'
  ): string {
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="${bgColor}"/>
        <circle cx="${width/2}" cy="${height/2 - 30}" r="40" fill="${textColor}" opacity="0.2"/>
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" 
              font-family="system-ui, sans-serif" font-size="24" font-weight="600" fill="${textColor}">
          ${text}
        </text>
      </svg>
    `;
    
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }
}
