'use client';

import { useAdminAuth } from '@/contexts/AdminContext';

export const usePermissions = () => {
  const { user } = useAdminAuth();

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    
    // Role-based permissions mapping
    const rolePermissions: Record<string, string[]> = {
      super_admin: ['*'], // Super admin has all permissions
      admin: ['manage_users', 'manage_stories', 'manage_experiences', 'manage_bookings', 'view_analytics'],
      moderator: ['manage_stories', 'moderate_content'],
      finance: ['manage_bookings', 'manage_payments', 'view_financial_reports'],
      marketing: ['manage_campaigns', 'view_analytics', 'manage_promotions']
    };
    
    const userPermissions = rolePermissions[user.role] || [];
    return userPermissions.includes('*') || userPermissions.includes(permission);
  };

  const hasRole = (role: string): boolean => {
    if (!user) return false;
    return user.role === role;
  };

  const hasAnyRole = (roles: string[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  const getRoleDisplayName = (): string => {
    if (!user) return '';
    
    const roleNames: Record<string, string> = {
      super_admin: 'Super Administrator',
      admin: 'Administrator',
      finance: 'Finance Manager',
      marketing: 'Marketing Manager',
      moderator: 'Content Moderator'
    };
    
    return roleNames[user.role] || user.role;
  };

  const getRoleColor = (): string => {
    if (!user) return 'gray';
    
    const roleColors: Record<string, string> = {
      super_admin: 'red',
      admin: 'blue',
      finance: 'green',
      marketing: 'purple',
      moderator: 'orange'
    };
    
    return roleColors[user.role] || 'gray';
  };

  return {
    hasPermission,
    hasRole,
    hasAnyRole,
    getRoleDisplayName,
    getRoleColor,
    user,
  };
};
