'use client';

import React from 'react';
import { usePermissions } from '@/hooks/usePermissions';

interface RoleGuardProps {
  roles: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ 
  roles, 
  children, 
  fallback = null 
}) => {
  const { hasAnyRole } = usePermissions();
  
  if (!hasAnyRole(roles)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};

interface PermissionGuardProps {
  permission: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({ 
  permission, 
  children, 
  fallback = null 
}) => {
  const { hasPermission } = usePermissions();
  
  if (!hasPermission(permission)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};

interface AccessDeniedProps {
  message?: string;
}

export const AccessDenied: React.FC<AccessDeniedProps> = ({ 
  message = "You don't have permission to access this area." 
}) => {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
      <div className="text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">Access Denied</h3>
        <p className="mt-1 text-sm text-gray-500">{message}</p>
      </div>
    </div>
  );
};
