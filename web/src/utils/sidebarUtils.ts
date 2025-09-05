/**
 * Utility functions for the dashboard sidebar
 */

// Mock function to get pending bookings count
// TODO: Replace with actual API call
export const getPendingBookingsCount = async (userRole: string): Promise<number> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(userRole === 'host' ? Math.floor(Math.random() * 5) : 0);
    }, 100);
  });
};

// Mock function to get saved experiences count for travellers
// TODO: Replace with actual API call
export const getSavedExperiencesCount = async (): Promise<number> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(Math.floor(Math.random() * 10));
    }, 100);
  });
};

// Mock function to get notification count
// TODO: Replace with actual API call
export const getNotificationCount = async (): Promise<number> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(Math.floor(Math.random() * 3));
    }, 100);
  });
};

// Helper function to determine if a path is active
export const isPathActive = (currentPath: string, targetPath: string): boolean => {
  // Handle dashboard root paths
  if (targetPath === '/dashboard' || targetPath === '/host/dashboard') {
    return currentPath === targetPath;
  }
  
  // For other paths, check if current path starts with target path
  return currentPath.startsWith(targetPath);
};

// Helper function to get menu item color theme
export const getMenuItemColors = (isActive: boolean) => ({
  container: isActive 
    ? 'bg-purple-100 text-purple-700 shadow-sm' 
    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
  icon: isActive 
    ? 'text-purple-600' 
    : 'text-gray-400 group-hover:text-gray-600'
});

// Helper function to truncate text for display
export const truncateText = (text: string, maxLength: number = 30): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
