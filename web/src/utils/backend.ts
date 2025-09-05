// Backend URL utility with environment variables
// Uses NEXT_PUBLIC_API_URL and NEXT_PUBLIC_IMAGES from environment

// Get Backend API URL from environment
export const getBackendUrl = (): string => {
  // Try multiple sources for environment variables
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 
                 (typeof window !== 'undefined' && (window as any).__NEXT_DATA__?.env?.NEXT_PUBLIC_API_URL) ||
                 'http://localhost:3001';
  
  if (!process.env.NEXT_PUBLIC_API_URL) {
  }
  
  return apiUrl;
};

// Get Image Base URL from environment
export const getImageBaseUrl = (): string => {
  // Try multiple sources for environment variables
  const imageUrl = process.env.NEXT_PUBLIC_IMAGES ||
                   (typeof window !== 'undefined' && (window as any).__NEXT_DATA__?.env?.NEXT_PUBLIC_IMAGES) ||
                   'http://localhost:3001/images';
  
  if (!process.env.NEXT_PUBLIC_IMAGES) {
  }
  return imageUrl;
};

// Get Website Base URL from environment
export const getWebsiteBaseUrl = (): string => {
  const websiteUrl = process.env.NEXT_PUBLIC_WEBSITE_URL;
  
  if (!websiteUrl) {
    // Fallback for development
    return 'http://localhost:3000';
  }
  
  return websiteUrl;
};
