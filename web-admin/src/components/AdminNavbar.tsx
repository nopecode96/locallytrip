'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdminAuth } from '../contexts/AdminContext';
import { getFilteredNavbar } from '../config/navbar';
import { NavbarItem } from '../types/admin';
import IconRenderer from './IconRenderer';

interface AdminNavbarProps {
  className?: string;
}

const AdminNavbar: React.FC<AdminNavbarProps> = ({ className = '' }) => {
  const { user, logout } = useAdminAuth();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  if (!user) {
    return null;
  }

  const navbarItems = getFilteredNavbar(user.role);

  // Helper function for checking active route
  const checkActiveRoute = (href: string, currentPath: string) => {
    if (!href || href === '') return false;
    // For most routes, use exact match only
    return currentPath === href;
  };

  // Auto-expand parent menu when child is active
  useEffect(() => {
    const findActiveParents = (items: NavbarItem[]): string[] => {
      const activeParents: string[] = [];
      
      for (const item of items) {
        if (item.children) {
          // Check if any child is active
          const hasActiveChild = item.children.some(child => checkActiveRoute(child.href, pathname));
          if (hasActiveChild) {
            activeParents.push(item.id);
          }
        }
      }
      
      return activeParents;
    };

    const activeParents = findActiveParents(navbarItems);
    
    // Only update if there are active parents
    if (activeParents.length > 0) {
      setExpandedItems(prev => {
        const newSet = new Set(activeParents);
        // Check if the sets are actually different
        if (prev.size !== newSet.size || !Array.from(newSet).every(id => prev.has(id))) {
          return newSet;
        }
        return prev; // Return previous state if no change needed
      });
    }
  }, [pathname]); // Only depend on pathname

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const isActiveRoute = (href: string) => {
    return checkActiveRoute(href, pathname);
  };

  const hasActiveChild = (item: NavbarItem): boolean => {
    if (!item.children) return false;
    return item.children.some(child => isActiveRoute(child.href));
  };

  const renderNavItem = (item: NavbarItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);
    const isActive = checkActiveRoute(item.href, pathname);
    const hasActiveChildItem = hasActiveChild(item);

    // Determine if this item should be styled as active
    const shouldStyleAsActive = isActive || (hasChildren && hasActiveChildItem);

    return (
      <div key={item.id} className="mb-1">
        <div
          className={`
            flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer 
            transition-all duration-200 ease-in-out
            ${level > 0 ? 'ml-6 text-sm' : 'text-base'}
            ${shouldStyleAsActive
              ? level > 0
                ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-400 shadow-sm font-semibold' 
                : 'bg-blue-100 text-blue-800 border-l-4 border-blue-500 shadow-md'
              : level > 0
                ? 'text-gray-600 hover:bg-gray-50 hover:text-gray-800 hover:shadow-sm'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:shadow-md hover:scale-[1.02]'
            }
            ${hasChildren && !shouldStyleAsActive ? 'hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100' : ''}
          `}
          onClick={() => {
            if (hasChildren) {
              toggleExpanded(item.id);
            }
          }}
        >
          <Link 
            href={item.href}
            className={`
              flex items-center flex-1 transition-all duration-150
              ${shouldStyleAsActive ? 'font-semibold' : 'font-medium hover:font-semibold'}
            `}
            onClick={(e: React.MouseEvent) => {
              if (hasChildren) {
                e.preventDefault();
              }
              setIsMobileMenuOpen(false);
            }}
          >
            <IconRenderer 
              iconName={item.icon} 
              className={`
                mr-3 transition-all duration-150
                ${shouldStyleAsActive ? 'scale-110' : 'hover:scale-105'}
              `} 
              size={level > 0 ? 16 : 18} 
            />
            <span className="font-medium">{item.label}</span>
            {item.badge && (
              <span className={`
                ml-2 px-2 py-1 text-xs rounded-full transition-all duration-150
                ${shouldStyleAsActive 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'bg-red-500 text-white hover:bg-red-600 hover:shadow-md'
                }
              `}>
                {item.badge}
              </span>
            )}
          </Link>
          {hasChildren && (
            <span className={`
              transform transition-all duration-200 text-lg
              ${isExpanded ? 'rotate-90 text-blue-600' : shouldStyleAsActive ? 'text-blue-500' : 'text-gray-400 hover:text-gray-600'}
            `}>
              ➤
            </span>
          )}
        </div>
        
        {hasChildren && (
          <div className={`
            overflow-hidden transition-all duration-300 ease-in-out
            ${isExpanded ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'}
          `}>
            <div className="space-y-1">
              {item.children?.map(child => renderNavItem(child, level + 1))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className={`hidden lg:flex lg:flex-col w-80 bg-white shadow-xl border-r border-gray-200 ${className}`}>
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold text-lg">LT</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">LocallyTrip</h1>
              <p className="text-sm text-gray-500">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
              <span className="text-gray-600 font-semibold">{user.name.charAt(0)}</span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-800">{user.name}</p>
              <p className="text-sm text-gray-500 capitalize">{user.role.replace('_', ' ')}</p>
            </div>
            <button
              onClick={logout}
              className={`
                text-red-500 hover:text-red-700 text-sm font-medium
                transition-all duration-200 hover:bg-red-50 px-3 py-1 rounded-md
                hover:shadow-sm active:scale-95
              `}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {navbarItems.map(item => renderNavItem(item))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-500 text-center">
            LocallyTrip Admin v1.0
          </p>
        </div>
      </nav>

      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-md border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-2">
              <span className="text-white font-bold text-sm">LT</span>
            </div>
            <h1 className="text-lg font-bold text-gray-800">LocallyTrip Admin</h1>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`
              text-gray-600 hover:text-gray-800 transition-all duration-200
              hover:bg-gray-100 p-2 rounded-md hover:shadow-sm active:scale-95
            `}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="bg-white w-80 h-full overflow-y-auto" onClick={e => e.stopPropagation()}>
            {/* Mobile Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-2">
                    <span className="text-white font-bold text-sm">LT</span>
                  </div>
                  <h1 className="text-lg font-bold text-gray-800">LocallyTrip</h1>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    text-gray-600 hover:text-gray-800 transition-all duration-200
                    hover:bg-gray-100 p-2 rounded-md hover:shadow-sm active:scale-95
                  `}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Mobile User Info */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                    <span className="text-gray-600 font-semibold">{user.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{user.name}</p>
                    <p className="text-sm text-gray-500 capitalize">{user.role.replace('_', ' ')}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className={`
                    text-red-500 hover:text-red-700 text-sm font-medium
                    transition-all duration-200 hover:bg-red-50 px-3 py-1 rounded-md
                    hover:shadow-sm active:scale-95
                  `}
                >
                  Logout
                </button>
              </div>
            </div>

            {/* Mobile Navigation */}
            <div className="p-4">
              {navbarItems.map(item => renderNavItem(item))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminNavbar;
