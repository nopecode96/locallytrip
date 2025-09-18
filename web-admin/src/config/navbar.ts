import { NavbarItem, AdminUser } from '../types/admin';

// Navbar configuration with role-based access
export const navbarConfig: NavbarItem[] = [
  // Host Dashboard Section
  {
    id: 'host-dashboard',
    label: 'Host Dashboard',
    icon: 'home',
    href: '/host-dashboard',
    roles: ['host']
  },
  {
    id: 'host-bookings',
    label: 'My Bookings',
    icon: 'calendar',
    href: '/host-bookings',
    roles: ['host']
  },
  {
    id: 'host-earnings',
    label: 'Earnings',
    icon: 'dollar-sign',
    href: '/host-earnings',
    roles: ['host']
  },
  {
    id: 'host-reviews',
    label: 'Reviews',
    icon: 'star',
    href: '/host-reviews',
    roles: ['host']
  },

  // Admin Dashboard Section  
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'bar-chart',
    href: '/dashboard',
    roles: ['super_admin', 'admin', 'moderator', 'finance', 'marketing']
  },

  // USER MANAGEMENT - Super Admin only
  {
    id: 'users',
    label: 'User Management',
    icon: 'users',
    href: '/users',
    roles: ['super_admin'],
    children: [
      {
        id: 'users-list',
        label: 'All Users',
        icon: 'user',
        href: '/users',
        roles: ['super_admin']
      },
      {
        id: 'users-create',
        label: 'Create User',
        icon: 'user-plus',
        href: '/users/create',
        roles: ['super_admin']
      },
      {
        id: 'users-roles',
        label: 'Manage Roles',
        icon: 'shield',
        href: '/users/roles',
        roles: ['super_admin']
      }
    ]
  },

  // STORIES MANAGEMENT - Admin, Super Admin, Moderator
  {
    id: 'stories',
    label: 'Stories Management',
    icon: 'book-open',
    href: '/stories',
    roles: ['super_admin', 'admin', 'moderator'],
    children: [
      {
        id: 'stories-list',
        label: 'All Stories',
        icon: '📚',
        href: '/stories',
        roles: ['super_admin', 'admin', 'moderator']
      },
      {
        id: 'stories-comments',
        label: 'Comments',
        icon: 'message-square',
        href: '/stories/comments',
        roles: ['super_admin', 'admin', 'moderator']
      },
      {
        id: 'stories-moderation',
        label: 'Content Moderation',
        icon: 'search',
        href: '/stories/moderation',
        roles: ['super_admin', 'admin', 'moderator']
      }
    ]
  },

  // BOOKINGS & PAYMENTS - Admin, Super Admin, Finance
  {
    id: 'bookings',
    label: 'Bookings & Payments',
    icon: 'credit-card',
    href: '/bookings',
    roles: ['super_admin', 'admin', 'finance'],
    children: [
      {
        id: 'bookings-list',
        label: 'All Bookings',
        icon: 'calendar',
        href: '/bookings',
        roles: ['super_admin', 'admin', 'finance']
      },
      {
        id: 'payments-list',
        label: 'Payments',
        icon: 'dollar-sign',
        href: '/payments',
        roles: ['super_admin', 'admin', 'finance']
      },
      {
        id: 'financial-reports',
        label: 'Financial Reports',
        icon: 'trending-up',
        href: '/reports/financial',
        roles: ['super_admin', 'admin', 'finance']
      }
    ]
  },

  // EXPERIENCES MANAGEMENT - Admin, Super Admin, Host
    {
      id: 'experiences-section',
      label: 'Experiences Management',
      icon: 'map-pin',
      href: '/experiences',
      roles: ['super_admin', 'admin', 'moderator', 'marketing', 'host'],
      children: [
        {
          id: 'experiences-list',
          label: 'All Experiences',
          icon: 'list',
          href: '/experiences',
          roles: ['super_admin', 'admin', 'moderator', 'marketing']
        },
        {
          id: 'my-experiences',
          label: 'My Experiences',
          icon: 'user',
          href: '/my-experiences',
          roles: ['host']
        },
        {
          id: 'experiences-create',
          label: 'Create Experience',
          icon: 'plus',
          href: '/experiences/create',
          roles: ['super_admin', 'admin', 'marketing', 'host']
        },
        {
          id: 'experiences-categories',
          label: 'Categories',
          icon: 'tag',
          href: '/experiences/categories',
          roles: ['super_admin', 'admin', 'marketing']
        }
      ]
    },  // CONTENT MANAGEMENT - Admin, Super Admin, Marketing (featured content)
  {
    id: 'content',
    label: 'Content Management',
    icon: '📝',
    href: '/content',
    roles: ['super_admin', 'admin', 'marketing'],
    children: [
      {
        id: 'featured-hosts',
        label: 'Featured Hosts',
        icon: '🌟',
        href: '/content/featured-hosts',
        roles: ['super_admin', 'admin', 'marketing']
      },
      {
        id: 'testimonials',
        label: 'Testimonials',
        icon: '💭',
        href: '/content/testimonials',
        roles: ['super_admin', 'admin', 'marketing']
      },
      {
        id: 'faqs',
        label: 'FAQs',
        icon: '❓',
        href: '/content/faqs',
        roles: ['super_admin', 'admin']
      }
    ]
  },

  // LOCATION MANAGEMENT - Admin, Super Admin
  {
    id: 'locations',
    label: 'Locations',
    icon: '🌍',
    href: '/locations',
    roles: ['super_admin', 'admin'],
    children: [
      {
        id: 'countries',
        label: 'Countries',
        icon: '🏳️',
        href: '/locations/countries',
        roles: ['super_admin', 'admin']
      },
      {
        id: 'cities',
        label: 'Cities',
        icon: '🏙️',
        href: '/locations/cities',
        roles: ['super_admin', 'admin']
      }
    ]
  },

  // MARKETING TOOLS - Super Admin, Marketing
  {
    id: 'marketing',
    label: 'Marketing Tools',
    icon: '📢',
    href: '/marketing',
    roles: ['super_admin', 'marketing'],
    children: [
      {
        id: 'campaigns',
        label: 'Campaigns',
        icon: '🎯',
        href: '/marketing/campaigns',
        roles: ['super_admin', 'marketing']
      },
      {
        id: 'notifications',
        label: 'Notifications',
        icon: '🔔',
        href: '/marketing/notifications',
        roles: ['super_admin', 'marketing']
      },
      {
        id: 'partnerships',
        label: 'Partnerships',
        icon: '🤝',
        href: '/marketing/partnerships',
        roles: ['super_admin', 'marketing']
      },
      {
        id: 'analytics',
        label: 'Marketing Analytics',
        icon: '📊',
        href: '/marketing/analytics',
        roles: ['super_admin', 'marketing']
      }
    ]
  },

  // SYSTEM SETTINGS - Super Admin only
  {
    id: 'settings',
    label: 'System Settings',
    icon: '⚙️',
    href: '/settings',
    roles: ['super_admin'],
    children: [
      {
        id: 'general-settings',
        label: 'General Settings',
        icon: '🔧',
        href: '/settings/general',
        roles: ['super_admin']
      },
      {
        id: 'email-settings',
        label: 'Email Settings',
        icon: '📧',
        href: '/settings/email',
        roles: ['super_admin']
      },
      {
        id: 'system-logs',
        label: 'System Logs',
        icon: '📋',
        href: '/settings/logs',
        roles: ['super_admin']
      }
    ]
  }
];

// Helper function to filter navbar items based on user role
export const getFilteredNavbar = (userRole: AdminUser['role']): NavbarItem[] => {
  return navbarConfig.filter(item => {
    // Check if user has access to main item
    if (!item.roles.includes(userRole)) {
      return false;
    }
    
    // Filter children if they exist
    if (item.children) {
      item.children = item.children.filter(child => 
        child.roles.includes(userRole)
      );
    }
    
    return true;
  });
};

// Helper function to check if user has access to specific route
export const hasAccessToRoute = (route: string, userRole: AdminUser['role']): boolean => {
  const allItems = getAllNavbarItems(navbarConfig);
  const targetItem = allItems.find(item => item.href === route);
  return targetItem ? targetItem.roles.includes(userRole) : false;
};

// Helper function to flatten navbar items (including children)
const getAllNavbarItems = (items: NavbarItem[]): NavbarItem[] => {
  let allItems: NavbarItem[] = [];
  
  items.forEach(item => {
    allItems.push(item);
    if (item.children) {
      allItems = allItems.concat(item.children);
    }
  });
  
  return allItems;
};
