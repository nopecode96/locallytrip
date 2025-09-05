// Server-side backend URL utility for API routes
// Uses INTERNAL_API_URL for Docker container communication (LocallyTrip Guidelines)

export const getServerBackendUrl = (): string => {
  // Use INTERNAL_API_URL untuk container-to-container communication
  const internalUrl = process.env.INTERNAL_API_URL;
  
  if (internalUrl) {
    return internalUrl;
  }
  
  // Fallback ke NEXT_PUBLIC_API_URL jika INTERNAL_API_URL tidak ada
  const publicUrl = process.env.NEXT_PUBLIC_API_URL;
  if (publicUrl) {
    return publicUrl;
  }
  
  // Final fallback untuk development
  const fallbackUrl = process.env.NODE_ENV === 'production' 
    ? 'https://api.locallytrip.com' 
    : 'http://localhost:3001';
    
  return fallbackUrl;
}