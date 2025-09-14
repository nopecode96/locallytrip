'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import UserDropdown from './UserDropdown';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();

  // Enhanced isActive function with trailing slash handling
  const isActive = (path: string) => {
    // Normalize paths by removing trailing slashes for comparison
    const normalizedPathname = pathname.replace(/\/$/, '') || '/';
    const normalizedPath = path.replace(/\/$/, '') || '/';
    
    // Exact match
    if (normalizedPathname === normalizedPath) {
      return true;
    }
    
    // For root path, only match exactly
    if (normalizedPath === '/') {
      return normalizedPathname === '/';
    }
    
    // For other paths, check if current path starts with the nav path
    return normalizedPathname.startsWith(normalizedPath);
  };

  return (
    <nav className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 shadow-lg sticky top-0 z-50 pointer-events-auto" suppressHydrationWarning>
      <div className="container mx-auto flex justify-between items-center px-6 py-4 pointer-events-auto" suppressHydrationWarning>
        <div className="flex items-center justify-start space-x-2 pointer-events-auto" suppressHydrationWarning>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white hover:text-yellow-300 focus:outline-none transition-colors duration-200 relative z-50 pointer-events-auto" 
            aria-label="Toggle navigation" 
            aria-expanded={isMenuOpen}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity duration-200">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-1.5 shadow-lg">
              <img 
                src={`${process.env.NEXT_PUBLIC_IMAGES || 'http://localhost:3001/images'}/logo.webp`}
                alt="LocallyTrip Logo" 
                className="h-8 w-auto object-contain"
              />
            </div>
          
          </Link>
        </div>
        <div className="hidden md:flex space-x-1 pointer-events-auto" suppressHydrationWarning>
          <Link 
            href="/" 
            className={`px-4 py-2 font-medium rounded-full transition-all duration-200 pointer-events-auto ${
              isActive('/') 
                ? 'text-purple-700 bg-white shadow-lg transform scale-105 ring-2 ring-white/50 font-bold' 
                : 'text-white hover:text-yellow-300 hover:bg-white/20'
            }`}
          >
            Home
          </Link>
          <Link 
            href="/hosts" 
            className={`px-4 py-2 font-medium rounded-full transition-all duration-200 pointer-events-auto ${
              isActive('/hosts') 
                ? 'text-purple-700 bg-white shadow-lg transform scale-105 ring-2 ring-white/50 font-bold' 
                : 'text-white hover:text-yellow-300 hover:bg-white/20'
            }`}
          >
            Locals
          </Link>
          <Link 
            href="/explore" 
            className={`px-4 py-2 font-medium rounded-full transition-all duration-200 pointer-events-auto ${
              isActive('/explore') 
                ? 'text-purple-700 bg-white shadow-lg transform scale-105 ring-2 ring-white/50 font-bold' 
                : 'text-white hover:text-yellow-300 hover:bg-white/20'
            }`}
          >
            Explore
          </Link>
          <Link 
            href="/stories" 
            className={`px-4 py-2 font-medium rounded-full transition-all duration-200 pointer-events-auto ${
              isActive('/stories') 
                ? 'text-purple-700 bg-white shadow-lg transform scale-105 ring-2 ring-white/50 font-bold' 
                : 'text-white hover:text-yellow-300 hover:bg-white/20'
            }`}
          >
            Travel Stories
          </Link>
          <Link 
            href="/vibes" 
            className={`px-4 py-2 font-medium rounded-full transition-all duration-200 pointer-events-auto ${
              isActive('/vibes') 
                ? 'text-purple-700 bg-white shadow-lg transform scale-105 ring-2 ring-white/50 font-bold' 
                : 'text-white hover:text-yellow-300 hover:bg-white/20'
            }`}
          >
            Vibes
          </Link>
        </div>
        
        {/* Authentication Section */}
        <div className="flex items-center space-x-4">
          {isAuthenticated && user ? (
            <UserDropdown user={user} onLogout={logout} />
          ) : (
            <>
              <Link 
                href="/login" 
                className="px-4 py-2 text-white font-semibold hover:text-yellow-300 hover:bg-white/20 rounded-full transition-all duration-200"
              >
                Login
              </Link>
              <Link 
                href="/register" 
                className="px-6 py-2 bg-white text-purple-600 rounded-full font-bold shadow-lg hover:bg-yellow-300 hover:text-purple-700 hover:shadow-xl transform hover:-translate-y-0.5 hover:scale-105 transition-all duration-200"
              >
                Register ✨
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed top-16 left-0 w-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 px-6 py-6 shadow-2xl z-[9999] border-t border-white/20">
          <ul className="flex flex-col space-y-2">
            <li>
              <Link 
                href="/" 
                className={`block px-4 py-3 font-medium rounded-full transition-all duration-200 ${
                  isActive('/') 
                    ? 'text-purple-700 bg-white shadow-lg ring-2 ring-white/50 font-bold' 
                    : 'text-white hover:text-yellow-300 hover:bg-white/20'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                href="/hosts" 
                className={`block px-4 py-3 font-medium rounded-full transition-all duration-200 ${
                  isActive('/hosts') 
                    ? 'text-purple-700 bg-white shadow-lg ring-2 ring-white/50 font-bold' 
                    : 'text-white hover:text-yellow-300 hover:bg-white/20'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Locals
              </Link>
            </li>
            <li>
              <Link 
                href="/explore" 
                className={`block px-4 py-3 font-medium rounded-full transition-all duration-200 ${
                  isActive('/explore') 
                    ? 'text-purple-700 bg-white shadow-lg ring-2 ring-white/50 font-bold' 
                    : 'text-white hover:text-yellow-300 hover:bg-white/20'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Explore
              </Link>
            </li>
            <li>
              <Link 
                href="/stories" 
                className={`block px-4 py-3 font-medium rounded-full transition-all duration-200 ${
                  isActive('/stories') 
                    ? 'text-purple-700 bg-white shadow-lg ring-2 ring-white/50 font-bold' 
                    : 'text-white hover:text-yellow-300 hover:bg-white/20'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Travel Stories
              </Link>
            </li>
            <li>
              <Link 
                href="/vibes" 
                className={`block px-4 py-3 font-medium rounded-full transition-all duration-200 ${
                  isActive('/vibes') 
                    ? 'text-purple-700 bg-white shadow-lg ring-2 ring-white/50 font-bold' 
                    : 'text-white hover:text-yellow-300 hover:bg-white/20'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Vibes
              </Link>
            </li>
          </ul>
          
          {/* Mobile Authentication */}
          <div className="mt-6 pt-6 border-t border-white/20">
            {isAuthenticated && user ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-white/20 rounded-xl">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                    {user.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      (() => {
                        const name = user.name || 'User';
                        const nameParts = name.trim().split(' ');
                        if (nameParts.length >= 2) {
                          return `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`.toUpperCase();
                        }
                        return name.slice(0, 2).toUpperCase();
                      })()
                    )}
                  </div>
                  <div>
                    <p className="text-white font-semibold">{user.name || 'User'}</p>
                    <p className="text-white/80 text-sm">{user.role === 'host' ? '🏠 Host' : '✈️ Traveller'}</p>
                  </div>
                </div>
                
                <Link
                  href={user.role === 'host' ? '/host/dashboard' : '/traveller/dashboard'}
                  className="block w-full px-4 py-3 bg-white text-purple-600 rounded-full font-semibold text-center hover:bg-yellow-300 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full px-4 py-3 bg-white/20 text-white rounded-full font-semibold text-center hover:bg-red-500 transition-colors duration-200"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <Link 
                  href="/login" 
                  className="block w-full px-4 py-3 bg-white/20 text-white rounded-full font-semibold text-center hover:bg-white/30 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className="block w-full px-4 py-3 bg-white text-purple-600 rounded-full font-bold text-center hover:bg-yellow-300 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register ✨
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
