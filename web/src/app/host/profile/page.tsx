'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useToast } from '../../../contexts/ToastContext';
import { useProfilePage } from '../../../hooks/useProfilePage';
import { useHostCategories } from '../../../hooks/useHostCategories';
import { useCitiesAutocomplete } from '../../../hooks/useCitiesAutocomplete';
import { ImageService } from '../../../services/imageService';
import { SimpleImage } from '../../../components/SimpleImage';
import CommunicationAppsManager from '../../../components/CommunicationAppsManager';
import { useRouter } from 'next/navigation';

export default function HostProfilePage() {
  const { 
    user, 
    loading, 
    error,
    updateProfile,
    uploadAvatar,
    removeAvatar,
    changePassword 
  } = useProfilePage();
  const { showToast } = useToast();
  const { categories: hostCategories, loading: categoriesLoading } = useHostCategories();
  const { cities, loading: citiesLoading, searchCities } = useCitiesAutocomplete();
  const router = useRouter();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [currentAvatar, setCurrentAvatar] = useState<string>('');
  const [avatarKey, setAvatarKey] = useState<number>(Date.now()); // Force re-render key
  
  // Location autocomplete states
  const [locationQuery, setLocationQuery] = useState('');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [selectedCityId, setSelectedCityId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
    location: '',
    avatar: '',
    hostCategories: [] as number[]
  });

  // Update form data when user data loads from API
  useEffect(() => {
    if (user) {
      console.log('🔄 Loading user data from API:', {
        name: user.name,
        email: user.email,
        role: user.role,
        city: user.City?.name,
        hostCategories: user.hostCategories?.map(cat => cat.name),
        avatarUrl: user.avatarUrl
      });
      
      // Split the name into firstName and lastName for editing
      const nameParts = (user.name || '').trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      setFormData({
        firstName: firstName,
        lastName: lastName,
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || '',
        location: user.City?.name || '',
        avatar: user.avatarUrl || user.avatar || '',
        hostCategories: user.hostCategories?.map((cat: any) => cat.id) || []
      });
      
      // Set location query for autocomplete
      if (user.City?.name) {
        setLocationQuery(user.City.name);
        setSelectedCityId(user.cityId ? parseInt(user.cityId.toString()) : null);
      }
      
      setCurrentAvatar(user.avatarUrl || user.avatar || '');
    }
  }, [user]);

  // Handle click outside for location dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.location-autocomplete')) {
        setShowLocationDropdown(false);
      }
    };

    if (showLocationDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLocationDropdown]);

  // Show loading spinner while fetching user data
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <p className="mt-2 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Show error if any from profile loading (not auth related)
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // AuthGuard ensures user exists and is host, but we need basic null check
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No user data available</p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const getInitials = () => {
    if (!user) return 'H';
    const name = user.name || 'Host';
    const nameParts = name.trim().split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Image size must be less than 5MB.');
      return;
    }

    setIsUploadingPhoto(true);
    setErrorMessage('');

    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);

      const result = await uploadAvatar(file);
      
      if (result.success) {
        setPhotoPreview(null);
        // Don't manually set currentAvatar - let the hook refresh user data
        setAvatarKey(Date.now()); // Force re-render of image component
        
        // Reset file input
        const fileInput = document.getElementById('avatar-upload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        
        showToast('📸 Profile photo updated successfully!', 'success');
      } else {
        throw new Error(result.message || 'Failed to upload photo');
      }
    } catch (error) {
      setErrorMessage(`Failed to upload photo: ${error}`);
      setPhotoPreview(null);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const removePhoto = async () => {
    setIsUploadingPhoto(true);
    setErrorMessage('');

    try {
      const result = await removeAvatar();
      
      if (result.success) {
        // Don't manually set currentAvatar - let the hook refresh user data
        setAvatarKey(Date.now()); // Force re-render of image component
        showToast('🗑️ Profile photo removed successfully!', 'success');
      } else {
        throw new Error(result.message || 'Failed to remove photo');
      }
    } catch (error) {
      setErrorMessage(`Failed to remove photo: ${error}`);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim();
      
      const profileData = {
        name: fullName,
        email: formData.email,
        phone: formData.phone,
        bio: formData.bio,
        cityId: selectedCityId,
        hostCategories: formData.hostCategories
      };

      const result = await updateProfile(profileData);
      
      if (result.success) {
        setIsEditing(false);
        showToast('✅ Profile updated successfully!', 'success');
      } else {
        throw new Error(result.message || 'Failed to update profile');
      }
    } catch (error) {
      setErrorMessage(`Failed to update profile: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (currentPassword: string, newPassword: string) => {
    try {
      const result = await changePassword(currentPassword, newPassword);
      
      if (result.success) {
        showToast('🔐 Password changed successfully!', 'success');
        return true;
      } else {
        throw new Error(result.message || 'Failed to change password');
      }
    } catch (error) {
      setErrorMessage(`Failed to change password: ${error}`);
      return false;
    }
  };

  return (
    
      <div className="bg-white min-h-full">
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Host Profile</h1>
            <p className="text-gray-600 mt-2">Manage your profile information and host categories</p>
          </div>

          {/* Verification Alert */}
          {user && !user.isVerified && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Email Verification Required
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>Your account needs email verification to access all host features and accept bookings.</p>
                  </div>
                  <div className="mt-4">
                    <div className="-mx-2 -my-1.5 flex">
                      <button 
                        className="bg-red-50 px-2 py-1.5 rounded-md text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600"
                        onClick={() => {
                          // TODO: Implement resend verification email
                          showToast('📧 Verification email sent! Please check your inbox.', 'info');
                        }}
                      >
                        Resend verification email
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-red-500">⚠️</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{errorMessage}</p>
                </div>
              </div>
            </div>
          )}

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8">
            <div className="flex items-center space-x-6">
              {/* Avatar Section */}
              <div className="relative">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                ) : currentAvatar ? (
                  <SimpleImage
                    key={avatarKey}
                    imagePath={currentAvatar}
                    alt="Profile photo"
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                    placeholderType="profile"
                    name={user.name}
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold text-lg border-4 border-white shadow-lg">
                    {getInitials()}
                  </div>
                )}
                
                {/* Upload/Remove Buttons */}
                <div className="absolute -bottom-1 -right-1">
                  <div className="flex flex-col space-y-1">
                    {/* Upload Button */}
                    <label
                      htmlFor="avatar-upload"
                      className="group bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-full cursor-pointer shadow-lg transition-all transform hover:scale-105"
                      title="Change photo"
                    >
                      {isUploadingPhoto ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                    </label>
                    
                    {/* Remove Button - Only show if there's an avatar */}
                    {currentAvatar && (
                      <button
                        onClick={removePhoto}
                        disabled={isUploadingPhoto}
                        className="group bg-red-600 hover:bg-red-700 text-white p-2.5 rounded-full shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        title="Remove photo"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
                
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  disabled={isUploadingPhoto}
                />
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-white">
                <div className="flex items-center space-x-3">
                  <h2 className="text-2xl font-bold">{user.name || `${formData.firstName} ${formData.lastName}`.trim() || 'Loading...'}</h2>
                  {/* Verification Status */}
                  {user.isVerified ? (
                    <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Verified</span>
                    </span>
                  ) : (
                    <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <span>Not Verified</span>
                    </span>
                  )}
                </div>
                <p className="text-blue-100 mt-1">{user.email}</p>
                <div className="flex items-center flex-wrap gap-2 mt-3">
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                    🏠 Host
                  </span>
                  {user.City && (
                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                      📍 {user.City.name}
                    </span>
                  )}
                  {user.isVerified ? (
                    <span className="bg-green-500/20 border border-green-400/30 px-3 py-1 rounded-full text-sm text-green-100">
                      ✅ Verified
                    </span>
                  ) : (
                    <span className="bg-red-500/20 border border-red-400/30 px-3 py-1 rounded-full text-sm text-red-100">
                      ⚠️ Unverified
                    </span>
                  )}
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    user.isActive 
                      ? 'bg-green-500/20 border border-green-400/30 text-green-100' 
                      : 'bg-gray-500/20 border border-gray-400/30 text-gray-100'
                  }`}>
                    {user.isActive ? '🟢 Active' : '⚫ Inactive'}
                  </span>
                </div>
              </div>

              {/* Edit Button */}
              <div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6">
            {isEditing ? (
              <form onSubmit={(e) => { e.preventDefault(); handleSaveProfile(); }}>
                <div className="space-y-6">
                  {/* Name Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Tell travelers about yourself and your hosting style..."
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <div className="relative location-autocomplete">
                      <input
                        type="text"
                        value={locationQuery}
                        onChange={(e) => {
                          const query = e.target.value;
                          setLocationQuery(query);
                          if (query.length >= 2) {
                            searchCities(query);
                            setShowLocationDropdown(true);
                          } else {
                            setShowLocationDropdown(false);
                          }
                        }}
                        onFocus={() => {
                          if (locationQuery.length >= 2) {
                            setShowLocationDropdown(true);
                          }
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Search for your city..."
                      />
                      
                      {/* Autocomplete Dropdown */}
                      {showLocationDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {citiesLoading ? (
                            <div className="px-4 py-3 text-center text-gray-500">
                              <div className="flex items-center justify-center space-x-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                <span>Searching...</span>
                              </div>
                            </div>
                          ) : cities.length > 0 ? (
                            cities.map((city: any) => (
                              <button
                                key={city.id}
                                type="button"
                                onClick={() => {
                                  const countryName = city.country || 'Unknown';
                                  setLocationQuery(`${city.name}, ${countryName}`);
                                  setSelectedCityId(city.id);
                                  setShowLocationDropdown(false);
                                  setFormData(prev => ({ ...prev, location: `${city.name}, ${countryName}` }));
                                }}
                                className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0"
                              >
                                <div className="flex items-center space-x-2">
                                  <span className="text-gray-900 font-medium">{city.name}</span>
                                  <span className="text-gray-500">{city.country || 'Unknown'}</span>
                                </div>
                              </button>
                            ))
                          ) : locationQuery.length >= 2 ? (
                            <div className="px-4 py-3 text-center text-gray-500">
                              No cities found for "{locationQuery}"
                            </div>
                          ) : null}
                        </div>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Search and select your city to help travelers find you
                    </p>
                  </div>

                  {/* Host Categories */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Host Categories
                    </label>
                    {categoriesLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-2 text-gray-600">Loading categories...</span>
                      </div>
                    ) : hostCategories.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {hostCategories.map((category: any) => {
                          // Map category icons to proper emoji/unicode icons
                          const getIconForCategory = (categoryName: string, fallbackIcon?: string) => {
                            const iconMap: { [key: string]: string } = {
                              'Local Tour Guide': '🗺️',
                              'Photographer': '📸',
                              'Combo (Local Tour Guide + Photographer)': '🗺️📸',
                              'Trip Planner': '🧳',
                              // Fallbacks for partial matches
                              'tour guide': '🗺️',
                              'photographer': '📸',
                              'combo': '🗺️📸',
                              'trip planner': '🧳',
                              'planner': '🧳',
                            };
                            
                            // First try exact match
                            if (iconMap[categoryName]) {
                              return iconMap[categoryName];
                            }
                            
                            // Then try partial match (case insensitive)
                            const lowerCategoryName = categoryName.toLowerCase();
                            for (const [key, icon] of Object.entries(iconMap)) {
                              if (lowerCategoryName.includes(key.toLowerCase()) || 
                                  key.toLowerCase().includes(lowerCategoryName)) {
                                return icon;
                              }
                            }
                            
                            // Use fallback icon if provided and not FontAwesome, otherwise default
                            return fallbackIcon && !fallbackIcon.includes('fa-') ? fallbackIcon : '🎯';
                          };

                          return (
                            <label
                              key={category.id}
                              className={`flex items-center space-x-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                                formData.hostCategories.includes(category.id)
                                  ? 'border-blue-500 bg-blue-50 shadow-md'
                                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={formData.hostCategories.includes(category.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setFormData(prev => ({
                                      ...prev,
                                      hostCategories: [...prev.hostCategories, category.id]
                                    }));
                                  } else {
                                    setFormData(prev => ({
                                      ...prev,
                                      hostCategories: prev.hostCategories.filter(id => id !== category.id)
                                    }));
                                  }
                                }}
                                className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <span className="text-xl">{getIconForCategory(category.name, category.icon)}</span>
                              <span className="text-sm font-medium text-gray-900 flex-1">{category.name}</span>
                            </label>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p>No host categories available.</p>
                        <p className="text-sm">Please contact support if this persists.</p>
                      </div>
                    )}
                  </div>

                  {/* Communication Apps */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Communication Apps
                    </label>
                    <p className="text-sm text-gray-500 mb-4">
                      Add your communication app contacts. These will be shared with travelers after successful booking payment.
                    </p>
                    <CommunicationAppsManager userId={user.id} />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4 pt-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                {/* Basic Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <div className="flex items-center space-x-2">
                        <p className="text-gray-900 font-medium">{user.email}</p>
                        {user.isVerified ? (
                          <span className="inline-flex items-center space-x-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Verified</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <span>Not Verified</span>
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="text-gray-900 font-medium">{user.phone || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Account Status</p>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                          user.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          <div className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                          <span>{user.isActive ? 'Active' : 'Inactive'}</span>
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Member Since</p>
                      <p className="text-gray-900 font-medium">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        }) : 'Unknown'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                {user.bio && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">About</h3>
                    <p className="text-gray-700 leading-relaxed">{user.bio}</p>
                  </div>
                )}

                {/* Verification Notice */}
                {!user.isVerified && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-yellow-800">Account Verification Required</h3>
                        <p className="mt-1 text-sm text-yellow-700">
                          Your email address is not verified yet. Please check your email and click the verification link, or request a new verification email.
                        </p>
                        <div className="mt-3">
                          <button 
                            className="text-sm font-medium text-yellow-800 hover:text-yellow-900 underline"
                            onClick={() => {
                              // TODO: Implement resend verification email
                              showToast('📧 Verification email sent! Please check your inbox.', 'info');
                            }}
                          >
                            Resend verification email
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Host Categories */}
                {user.hostCategories && user.hostCategories.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Host Categories</h3>
                    <div className="flex flex-wrap gap-3">
                      {user.hostCategories.map((category: any) => {
                        // Get proper emoji icon for display
                        const getDisplayIcon = (categoryName: string) => {
                          const iconMap: { [key: string]: string } = {
                            'Local Tour Guide': '🗺️',
                            'Photographer': '📸',
                            'Combo (Local Tour Guide + Photographer)': '🗺️📸',
                            'Trip Planner': '🧳',
                          };
                          return iconMap[categoryName] || '🎯';
                        };

                        return (
                          <span
                            key={category.id}
                            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2"
                          >
                            <span className="text-base">{getDisplayIcon(category.name)}</span>
                            <span>{category.name}</span>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Communication Apps - View Mode */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Communication Apps</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Your communication contacts (visible to travelers after successful booking payment)
                  </p>
                  <CommunicationAppsManager userId={user.id} readOnly={true} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/host/experiences"
            className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🎯</span>
              <div>
                <h3 className="font-semibold text-gray-900">Manage Experiences</h3>
                <p className="text-sm text-gray-600">Create and edit your experiences</p>
              </div>
            </div>
          </Link>

          <Link
            href="/host/bookings"
            className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">📅</span>
              <div>
                <h3 className="font-semibold text-gray-900">View Bookings</h3>
                <p className="text-sm text-gray-600">Manage your bookings</p>
              </div>
            </div>
          </Link>

          <Link
            href="/host/settings"
            className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">⚙️</span>
              <div>
                <h3 className="font-semibold text-gray-900">Settings</h3>
                <p className="text-sm text-gray-600">Account preferences</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
      </div>
    
  );
}
