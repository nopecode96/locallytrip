'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { User } from '../services/authAPI';
import { SimpleImage } from './SimpleImage';
import { getInitials, getDisplayName } from '../utils/nameUtils';

interface UserDropdownProps {
  user: User;
  onLogout: () => void;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getUserRole = () => {
    return user.role === 'host' ? '🏠 Host' : '✈️ Traveller';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* User Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-all duration-200 group"
      >
        <div className="relative">
          {/* Avatar */}
          <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
            {user.avatar ? (
              <SimpleImage 
                imagePath={user.avatar}
                alt={getDisplayName(user.name)}
                className="w-full h-full rounded-full object-cover"
                width={32}
                height={32}
                placeholderType="profile"
                category="users/avatars"
                name={getDisplayName(user.name)}
              />
            ) : (
              getInitials(user.name)
            )}
          </div>
          
          {/* Online indicator */}
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
        </div>
        
        {/* Dropdown arrow */}
        <svg 
          className={`w-4 h-4 text-white transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden z-50">
          {/* User Info Header */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 text-white">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {user.avatar ? (
                  <SimpleImage 
                    imagePath={user.avatar}
                    alt={getDisplayName(user.name)}
                    className="w-full h-full rounded-full object-cover"
                    width={48}
                    height={48}
                    placeholderType="profile"
                    category="users/avatars"
                    name={getDisplayName(user.name)}
                  />
                ) : (
                  getInitials(user.name)
                )}
              </div>
              <div>
                <p className="font-bold text-lg">{getDisplayName(user.name)}</p>
                <p className="text-white/80 text-sm">{getUserRole()}</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-2">
            {/* Dashboard Link */}
            <Link
              href={user.role === 'host' ? '/host/dashboard' : '/traveller/dashboard'}
              className="flex items-center space-x-3 p-3 rounded-xl hover:bg-purple-50 transition-colors duration-200 group"
              onClick={() => setIsOpen(false)}
            >
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors duration-200">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </div>
              <span className="font-medium text-gray-700">Dashboard</span>
            </Link>

            {/* Profile Link */}
            <Link
              href={user.role === 'host' ? '/host/profile' : '/traveller/profile'}
              className="flex items-center space-x-3 p-3 rounded-xl hover:bg-green-50 transition-colors duration-200 group"
              onClick={() => setIsOpen(false)}
            >
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors duration-200">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="font-medium text-gray-700">Profile</span>
            </Link>

            {/* Bookings Link */}
            <Link
              href={user.role === 'host' ? '/host/bookings' : '/traveller/bookings'}
              className="flex items-center space-x-3 p-3 rounded-xl hover:bg-blue-50 transition-colors duration-200 group"
              onClick={() => setIsOpen(false)}
            >
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-200">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="font-medium text-gray-700">
                {user.role === 'host' ? 'Reservations' : 'My Trips'}
              </span>
            </Link>

            {/* Settings Link */}
            <Link
              href={user.role === 'host' ? '/host/settings' : '/settings'}
              className="flex items-center space-x-3 p-3 rounded-xl hover:bg-orange-50 transition-colors duration-200 group"
              onClick={() => setIsOpen(false)}
            >
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors duration-200">
                <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span className="font-medium text-gray-700">Settings</span>
            </Link>

            {/* Divider */}
            <div className="border-t border-gray-200 my-2"></div>

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-red-50 transition-colors duration-200 group"
            >
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors duration-200">
                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013 3v1" />
                </svg>
              </div>
              <span className="font-medium text-red-600">Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
