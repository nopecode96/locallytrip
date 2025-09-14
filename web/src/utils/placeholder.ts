// Placeholder image utility - Using local placeholder images
import { ImageService } from '@/services/imageService';

export class PlaceholderService {
  // Generate placeholder for experiences based on category
  static getExperiencePlaceholder(category?: string): string {
    return this.getSVGPlaceholder(400, 300, '🎯 Experience', '#fef3c7', '#d97706');
  }

  // Generate placeholder for user/host profile
  static getProfilePlaceholder(name?: string, isCircular: boolean = true): string {
    const initial = name ? name.charAt(0).toUpperCase() : '👤';
    return this.getSVGPlaceholder(200, 200, initial, '#e0e7ff', '#4338ca', isCircular);
  }

  // Generate placeholder for cities
  static getCityPlaceholder(cityName?: string): string {
    return this.getSVGPlaceholder(400, 250, '🏙️ City', '#ecfdf5', '#059669');
  }

  // Generate placeholder for hosts
  static getHostPlaceholder(name?: string): string {
    const initial = name ? name.charAt(0).toUpperCase() : '🏠';
    return this.getSVGPlaceholder(200, 200, initial, '#fef7ff', '#a855f7');
  }

  // Generate placeholder for stories (aspect ratio 16:7 untuk landscape)
  static getStoryPlaceholder(name?: string): string {
    return this.getSVGPlaceholder(640, 280, 'Image', '#f8fafc', '#64748b');
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
    text: string = 'Image',
    bgColor: string = '#f3f4f6',
    textColor: string = '#6b7280',
    isCircular: boolean = false
  ): string {
    // Calculate responsive font size based on dimensions
    const minDimension = Math.min(width, height);
    const fontSize = Math.max(12, Math.min(28, minDimension * 0.12));
    
    let svg;
    
    if (isCircular) {
      // Full circle avatar placeholder
      const radius = minDimension / 2;
      svg = `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="avatarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:${bgColor};stop-opacity:1" />
              <stop offset="100%" style="stop-color:#d1d5db;stop-opacity:1" />
            </linearGradient>
          </defs>
          
          <!-- Full circle background -->
          <circle cx="${width/2}" cy="${height/2}" r="${radius - 2}" fill="url(#avatarGrad)" stroke="#d1d5db" stroke-width="2"/>
          
          <!-- Text centered -->
          <text x="${width/2}" y="${height/2}" 
                dominant-baseline="central" 
                text-anchor="middle" 
                font-family="system-ui, -apple-system, sans-serif" 
                font-size="${fontSize}" 
                font-weight="600" 
                fill="${textColor}">
            ${text}
          </text>
        </svg>
      `;
    } else {
      // Rectangle with circular decoration for regular images
      const circleRadius = Math.min(minDimension * 0.12, 25); // Proportional circle
      const centerX = width / 2;
      const centerY = height / 2;
      const iconY = centerY - fontSize * 0.8; // Circle above text with balanced spacing
      const textY = centerY + fontSize * 0.4; // Text below center with proper spacing
      
      svg = `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="rectGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:${bgColor};stop-opacity:1" />
              <stop offset="100%" style="stop-color:#e5e7eb;stop-opacity:1" />
            </linearGradient>
          </defs>
          
          <!-- Rectangle background -->
          <rect width="100%" height="100%" fill="url(#rectGrad)" rx="8"/>
          
          <!-- Main circle decoration - perfectly centered above text -->
          <circle cx="${centerX}" cy="${iconY}" r="${circleRadius}" fill="${textColor}" opacity="0.15"/>
          
          <!-- Text perfectly centered -->
          <text x="${centerX}" y="${textY}" 
                dominant-baseline="central" 
                text-anchor="middle" 
                font-family="system-ui, -apple-system, sans-serif" 
                font-size="${fontSize}" 
                font-weight="500" 
                fill="${textColor}">
            ${text}
          </text>
        </svg>
      `;
    }
    
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }
}
