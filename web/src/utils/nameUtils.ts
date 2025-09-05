/**
 * Utility functions for handling user names and initials
 */

/**
 * Get initials from a full name
 * @param name - Full name string
 * @returns Initials (max 2 characters)
 */
export const getInitials = (name: string | undefined | null): string => {
  if (!name || typeof name !== 'string') {
    return 'U';
  }
  
  const nameParts = name.trim().split(' ');
  if (nameParts.length >= 2) {
    return `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

/**
 * Split full name into first and last name parts
 * @param fullName - Full name string
 * @returns Object with firstName and lastName
 */
export const splitFullName = (fullName: string | undefined | null): { firstName: string; lastName: string } => {
  if (!fullName || typeof fullName !== 'string') {
    return { firstName: '', lastName: '' };
  }
  
  const nameParts = fullName.trim().split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';
  
  return { firstName, lastName };
};

/**
 * Combine first and last name into full name
 * @param firstName - First name
 * @param lastName - Last name
 * @returns Combined full name
 */
export const combineFullName = (firstName: string, lastName: string): string => {
  return `${firstName.trim()} ${lastName.trim()}`.trim();
};

/**
 * Get display name with fallback
 * @param name - Full name string
 * @param fallback - Fallback text if name is empty
 * @returns Display name or fallback
 */
export const getDisplayName = (name: string | undefined | null, fallback: string = 'User'): string => {
  return name || fallback;
};
