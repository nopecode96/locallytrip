'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useToast } from '../../../contexts/ToastContext';
import { useProfilePage } from '../../../hooks/useProfilePage';
import { SimpleImage } from '../../../components/SimpleImage';
import { useRouter } from 'next/navigation';

export default function TravellerProfilePage() {
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
  const router = useRouter();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [currentAvatar, setCurrentAvatar] = useState<string>('');
  const [avatarKey, setAvatarKey] = useState<number>(Date.now());
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
    location: '',
    avatar: '',
  });

  // Redirect if not traveller
  useEffect(() => {
    if (!loading && user && user.role === 'host') {
      router.push('/host/profile');
      return;
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
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
      });
      
      setCurrentAvatar(prev => prev || user.avatarUrl || user.avatar || '');
    }
  }, [user]);

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Show error if any
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

  // Redirect if host (after loading)
  if (!user || user.role === 'host') {
    return null; // Will redirect in useEffect
  }

  const getInitials = () => {
    if (!user) return 'T';
    const name = user.name || 'Traveller';
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
        setCurrentAvatar(user?.avatarUrl || '');
        setAvatarKey(Date.now());
        
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
        setCurrentAvatar('');
        setAvatarKey(Date.now());
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link 
                href="/traveller/dashboard" 
                className="text-gray-600 hover:text-gray-900 flex items-center"
              >
                <span className="mr-2">←</span>
                Back to Dashboard
              </Link>
              <div className="h-6 border-l border-gray-300"></div>
              <h1 className="text-xl font-semibold text-gray-900">Traveller Profile</h1>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">✈️ Traveller Account</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
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
          <div className="bg-gradient-to-r from-green-600 to-blue-600 px-6 py-8">
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
                <div className="absolute -bottom-2 -right-2 flex space-x-1">
                  <label
                    htmlFor="avatar-upload"
                    className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-full cursor-pointer shadow-lg transition-colors"
                    title="Upload photo"
                  >
                    {isUploadingPhoto ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <span className="text-sm">📷</span>
                    )}
                  </label>
                  {currentAvatar && (
                    <button
                      onClick={removePhoto}
                      disabled={isUploadingPhoto}
                      className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-lg transition-colors disabled:opacity-50"
                      title="Remove photo"
                    >
                      <span className="text-sm">🗑️</span>
                    </button>
                  )}
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
                <h2 className="text-2xl font-bold">{user.name || 'Traveller Name'}</h2>
                <p className="text-green-100 mt-1">{user.email}</p>
                <div className="flex items-center space-x-4 mt-3">
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                    ✈️ Traveller
                  </span>
                  {user.City && (
                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                      📍 {user.City.name}
                    </span>
                  )}
                </div>
              </div>

              {/* Edit Button */}
              <div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-white text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      About Me
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Tell us about yourself, your travel interests, and what you're looking for..."
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4 pt-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                      <p className="text-gray-900 font-medium">{user.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="text-gray-900 font-medium">{user.phone || 'Not provided'}</p>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                {user.bio && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">About Me</h3>
                    <p className="text-gray-700 leading-relaxed">{user.bio}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/traveller/bookings"
            className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">📅</span>
              <div>
                <h3 className="font-semibold text-gray-900">My Bookings</h3>
                <p className="text-sm text-gray-600">View your trip bookings</p>
              </div>
            </div>
          </Link>

          <Link
            href="/explore"
            className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🌍</span>
              <div>
                <h3 className="font-semibold text-gray-900">Explore</h3>
                <p className="text-sm text-gray-600">Discover new experiences</p>
              </div>
            </div>
          </Link>

          <Link
            href="/traveller/settings"
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
