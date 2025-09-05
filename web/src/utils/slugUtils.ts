/**
 * Utility functions for generating and parsing SEO-friendly slugs
 */

/**
 * Generate a SEO-friendly slug from host name and UUID
 * Format: "hiroshi-tanaka-eb55f23d-5daf-4f47-841d-35456c49f4be"
 */
export function generateHostSlug(name: string, hostId: string): string {
  // Convert name to lowercase and replace spaces/special chars with hyphens
  const nameSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
    
  return `${nameSlug}-${hostId}`;
}

/**
 * Extract UUID from a host slug
 * Supports both formats: 
 * - "eb55f23d-5daf-4f47-841d-35456c49f4be" (old format)
 * - "hiroshi-tanaka-eb55f23d-5daf-4f47-841d-35456c49f4be" (new format)
 */
export function extractHostIdFromSlug(slug: string): string {
  // UUID pattern: 8-4-4-4-12 hexadecimal characters
  const uuidPattern = /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i;
  const match = slug.match(uuidPattern);
  
  if (match) {
    return match[1];
  }
  
  // If no UUID pattern found, assume entire slug is the UUID (backwards compatibility)
  return slug;
}

/**
 * Validate if a string is a valid UUID
 */
export function isValidUUID(str: string): boolean {
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidPattern.test(str);
}

/**
 * Generate city slug from city name
 * Format: "bali", "kuala-lumpur"
 */
export function generateCitySlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Generate experience slug from title and UUID
 * Format: "street-photography-tour-in-tokyo-abc123..."
 */
export function generateExperienceSlug(title: string, experienceId: string): string {
  const titleSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
    
  return `${titleSlug}-${experienceId}`;
}

/**
 * Extract experience ID from slug
 */
export function extractExperienceIdFromSlug(slug: string): string {
  const uuidPattern = /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i;
  const match = slug.match(uuidPattern);
  
  if (match) {
    return match[1];
  }
  
  return slug;
}
