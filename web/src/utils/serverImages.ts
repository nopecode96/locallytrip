// Server-side image URL utility for API routes
// Uses INTERNAL_IMAGES_URL for Docker container communication (LocallyTrip Guidelines)

export const getServerImageUrl = (imagePath: string): string => {
  if (!imagePath) return '';
  
  // If already a full URL, return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Use INTERNAL_IMAGES_URL untuk server-side image requests
  const internalImagesUrl = process.env.INTERNAL_IMAGES_URL;
  
  if (internalImagesUrl) {
    return `${internalImagesUrl}/${imagePath.replace(/^\/+/, '')}`;
  }
  
  // Fallback ke NEXT_PUBLIC_IMAGES jika INTERNAL_IMAGES_URL tidak ada
  const publicImagesUrl = process.env.NEXT_PUBLIC_IMAGES;
  if (publicImagesUrl) {
    return `${publicImagesUrl}/${imagePath.replace(/^\/+/, '')}`;
  }
  
  // Final fallback untuk development
  const fallbackUrl = process.env.NODE_ENV === 'production' 
    ? 'https://api.locallytrip.com/images' 
    : 'http://localhost:3001/images';
    
  return `${fallbackUrl}/${imagePath.replace(/^\/+/, '')}`;
};

// Server-side utility untuk image optimization
export const getOptimizedServerImageUrl = (imagePath: string, width?: number, height?: number): string => {
  const baseUrl = getServerImageUrl(imagePath);
  
  if (!width && !height) return baseUrl;
  
  // Add optimization parameters jika backend support image resizing
  const params = new URLSearchParams();
  if (width) params.append('w', width.toString());
  if (height) params.append('h', height.toString());
  
  return `${baseUrl}?${params.toString()}`;
};
