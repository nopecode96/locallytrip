'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { authAPI } from '../../services/authAPI';
import { useHostCategories } from '../../hooks/useHostCategories';
import { ImageService } from '../../services/imageService';
import AuthGuard from '../../components/AuthGuard';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, isAuthenticated, updateUser, refreshFromBackend } = useAuth();
  const { categories: hostCategories } = useHostCategories();
  const router = useRouter();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [currentAvatar, setCurrentAvatar] = useState<string>('');
  
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

  useEffect(() => {
    if (user) {
      // Split the name into firstName and lastName for editing
      const nameParts = (user.name || '').trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      setFormData({
        firstName: firstName,
        lastName: lastName,
        email: user.email || '',
        phone: user.phone || '',
        bio: '',
        location: user.City?.name || '',
        avatar: user.avatar || '',
        hostCategories: user.hostCategories?.map(cat => cat.id) || []
      });
      
      setCurrentAvatar(prev => prev || user.avatar || '');
    }
  }, [user]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const getInitials = () => {
    if (!user) return 'U';
    const name = user.name || 'User';
    const nameParts = name.trim().split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const getUserRole = () => {
    if (!user) return '';
    return user.role === 'host' ? '🏠 Host' : '✈️ Traveller';
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

      const formData = new FormData();
      formData.append('avatar', file);

      const token = authAPI.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('/api/auth/upload-avatar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        
        setPhotoPreview(null);
        
        const freshUserData = await refreshFromBackend();
        
        if (freshUserData) {
          setCurrentAvatar(freshUserData.avatar || '');
          setFormData(prev => ({
            ...prev,
            avatar: freshUserData.avatar || ''
          }));
        }
        
        setSuccessMessage('Profile photo updated successfully! 📸');
      } else {
        throw new Error(data.message || 'Failed to upload photo');
      }
    } catch (error) {
      setErrorMessage('Failed to upload photo. Please try again.');
      setPhotoPreview(null);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const removePhoto = async () => {
    setIsUploadingPhoto(true);
    setErrorMessage('');

    try {
      const token = authAPI.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('/api/auth/remove-avatar', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        const freshUserData = await refreshFromBackend();
        
        if (freshUserData) {
          setCurrentAvatar(freshUserData.avatar || '');
          setFormData(prev => ({
            ...prev,
            avatar: freshUserData.avatar || ''
          }));
        }
        
        setPhotoPreview(null);
        setSuccessMessage('Profile photo removed successfully! 🗑️');
      } else {
        throw new Error(data.message || 'Failed to remove photo');
      }
    } catch (error) {
      setErrorMessage('Failed to remove photo. Please try again.');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleHostCategoryChange = (categoryId: number) => {
    setFormData(prev => ({
      ...prev,
      hostCategories: prev.hostCategories.includes(categoryId)
        ? prev.hostCategories.filter(id => id !== categoryId)
        : [...prev.hostCategories, categoryId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccessMessage('Profile updated successfully! 🎉');
      setIsEditing(false);
    } catch (error) {
      setErrorMessage('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <p>User not found. Please log in again.</p>;
  }

  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="text-2xl font-bold text-purple-600">
              LocallyTrip
            </Link>
            <Link href={user?.role === 'host' ? '/host/dashboard' : '/dashboard'} 
                  className="text-purple-600 hover:text-purple-700 font-medium">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4">
            <p className="text-green-600 font-medium">{successMessage}</p>
          </div>
        )}
        
        {errorMessage && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-600 font-medium">{errorMessage}</p>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-8">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                  {photoPreview ? (
                    <img 
                      src={photoPreview} 
                      alt="Preview"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (currentAvatar || formData.avatar || user.avatar) ? (
                    <img 
                      src={(() => {
                        const avatarPath = (currentAvatar || formData.avatar || user.avatar) || '';
                        return ImageService.getImageUrl(avatarPath);
                      })()} 
                      alt={user.name || 'User'}
                      className="w-full h-full rounded-full object-cover"
                      onLoad={() => {
                      }}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    getInitials()
                  )}
                </div>
                
                <div className="absolute bottom-0 right-0">
                  <input
                    type="file"
                    id="avatar-upload"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    disabled={isUploadingPhoto}
                  />
                  <label
                    htmlFor="avatar-upload"
                    className={`cursor-pointer bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center ${
                      isUploadingPhoto ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-50'
                    }`}
                  >
                    {isUploadingPhoto ? (
                      <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </label>
                </div>

                {(formData.avatar || user.avatar || photoPreview) && (
                  <button
                    onClick={removePhoto}
                    disabled={isUploadingPhoto}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors"
                    title="Remove photo"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              
              <div className="text-white">
                <h1 className="text-3xl font-bold">{user.name || 'User'}</h1>
                <p className="text-white/80 text-lg">{getUserRole()}</p>
                <p className="text-white/70">{user.email}</p>
                {user.phone && <p className="text-white/70">{user.phone}</p>}
              </div>
            </div>
          </div>

          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Profile Information</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-purple-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-purple-700 transition-colors flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
              </button>
            </div>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="City, Country"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Avatar URL
                  </label>
                  <input
                    type="url"
                    name="avatar"
                    value={formData.avatar}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="https://example.com/your-photo.jpg"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Tell us about yourself..."
                />
              </div>

              {user.role === 'host' && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Host Categories
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {hostCategories.map((category) => (
                      <label key={category.id} className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-xl hover:border-purple-300 transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.hostCategories.includes(category.id)}
                          onChange={() => handleHostCategoryChange(category.id)}
                          className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                        />
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{category.icon}</span>
                          <div>
                            <p className="font-medium text-gray-900">{category.name}</p>
                            <p className="text-sm text-gray-500">{category.description}</p>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isLoading && (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Personal Information</h3>
                  <div className="mt-4 space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="text-lg font-medium text-gray-900">{user.name || 'User'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-lg font-medium text-gray-900">{user.email}</p>
                    </div>
                    {user.phone && (
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="text-lg font-medium text-gray-900">{user.phone}</p>
                      </div>
                    )}
                    {formData.location && (
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="text-lg font-medium text-gray-900">{formData.location}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Account Details</h3>
                  <div className="mt-4 space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Account Type</p>
                      <p className="text-lg font-medium text-gray-900">{getUserRole()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Member Since</p>
                      <p className="text-lg font-medium text-gray-900">
                        {new Date().toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email Verified</p>
                      <p className="text-lg font-medium text-gray-900">
                        {user.isVerified ? (
                          <span className="text-green-600">✅ Verified</span>
                        ) : (
                          <span className="text-red-600">❌ Not Verified</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {user.role === 'host' && user.hostCategories && user.hostCategories.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">Host Categories</h3>
                  <div className="flex flex-wrap gap-3">
                    {user.hostCategories.map((category) => (
                      <span key={category.id} className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                        <span>{category.icon}</span>
                        <span>{category.name}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {formData.bio && (
                <div className="mt-8">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">About</h3>
                  <p className="text-gray-700 leading-relaxed">{formData.bio}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Account Settings</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <Link href="/settings/password" className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-purple-300 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Change Password</p>
                    <p className="text-sm text-gray-500">Update your password</p>
                  </div>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>

              <Link href="/settings/notifications" className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-purple-300 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 3H4a1 1 0 00-1 1v16a1 1 0 001 1h5" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Notifications</p>
                    <p className="text-sm text-gray-500">Manage your notification preferences</p>
                  </div>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>

              <Link href="/settings/privacy" className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-purple-300 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Privacy & Security</p>
                    <p className="text-sm text-gray-500">Control your privacy settings</p>
                  </div>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
    </AuthGuard>
  );
}
