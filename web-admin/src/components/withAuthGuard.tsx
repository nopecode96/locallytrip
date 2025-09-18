'use client';

import React from 'react';
import AuthGuard from './AuthGuard';

/**
 * Higher-Order Component untuk proteksi halaman berdasarkan role
 */
export const withAuthGuard = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  requiredRoles?: string[],
  fallbackPath?: string
) => {
  const AuthProtectedComponent = (props: P) => {
    return (
      <AuthGuard requiredRoles={requiredRoles} fallbackPath={fallbackPath}>
        <WrappedComponent {...props} />
      </AuthGuard>
    );
  };

  AuthProtectedComponent.displayName = `withAuthGuard(${WrappedComponent.displayName || WrappedComponent.name})`;
  
  return AuthProtectedComponent;
};

/**
 * Role-specific HOCs untuk kemudahan penggunaan
 */
export const withSuperAdminOnly = <P extends object>(component: React.ComponentType<P>) =>
  withAuthGuard(component, ['super_admin']);

export const withAdminOrAbove = <P extends object>(component: React.ComponentType<P>) =>
  withAuthGuard(component, ['super_admin', 'admin']);

export const withFinanceAccess = <P extends object>(component: React.ComponentType<P>) =>
  withAuthGuard(component, ['super_admin', 'admin', 'finance']);

export const withMarketingAccess = <P extends object>(component: React.ComponentType<P>) =>
  withAuthGuard(component, ['super_admin', 'admin', 'marketing']);

export const withModeratorAccess = <P extends object>(component: React.ComponentType<P>) =>
  withAuthGuard(component, ['super_admin', 'admin', 'moderator']);

export const withAnyAdminRole = <P extends object>(component: React.ComponentType<P>) =>
  withAuthGuard(component, ['super_admin', 'admin', 'finance', 'marketing', 'moderator']);

/**
 * Permission checking utilities
 */
export const checkPermission = (userRole: string, requiredRoles: string[]): boolean => {
  return requiredRoles.includes(userRole);
};

export const hasFinanceAccess = (userRole: string): boolean => {
  return ['super_admin', 'admin', 'finance'].includes(userRole);
};

export const hasMarketingAccess = (userRole: string): boolean => {
  return ['super_admin', 'admin', 'marketing'].includes(userRole);
};

export const hasModeratorAccess = (userRole: string): boolean => {
  return ['super_admin', 'admin', 'moderator'].includes(userRole);
};

export const isSuperAdmin = (userRole: string): boolean => {
  return userRole === 'super_admin';
};

export const isAdmin = (userRole: string): boolean => {
  return ['super_admin', 'admin'].includes(userRole);
};
