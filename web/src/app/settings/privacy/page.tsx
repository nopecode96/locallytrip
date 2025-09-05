'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, ArrowLeft, Eye, EyeOff, Globe, Users, ShieldCheck, Download, Trash2, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

interface PrivacySetting {
  id: string;
  title: string;
  description: string;
  value: 'public' | 'friends' | 'private';
  options: { value: string; label: string; description: string }[];
}

export default function PrivacySettingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [privacySettings, setPrivacySettings] = useState<PrivacySetting[]>([
    {
      id: 'profile_visibility',
      title: 'Profile Visibility',
      description: 'Who can see your profile information',
      value: 'public',
      options: [
        { value: 'public', label: 'Public', description: 'Everyone can see your profile' },
        { value: 'friends', label: 'Travelers Only', description: 'Only other registered travelers can see your profile' },
        { value: 'private', label: 'Private', description: 'Only you can see your profile' }
      ]
    },
    {
      id: 'contact_info',
      title: 'Contact Information',
      description: 'Who can see your email and phone number',
      value: 'friends',
      options: [
        { value: 'public', label: 'Public', description: 'Visible to everyone' },
        { value: 'friends', label: 'Hosts & Confirmed Bookings', description: 'Only hosts you book with can see this' },
        { value: 'private', label: 'Private', description: 'Hidden from everyone' }
      ]
    },
    {
      id: 'booking_history',
      title: 'Booking History',
      description: 'Who can see your past bookings and reviews',
      value: 'friends',
      options: [
        { value: 'public', label: 'Public', description: 'Visible to everyone' },
        { value: 'friends', label: 'Registered Users', description: 'Only logged-in users can see this' },
        { value: 'private', label: 'Private', description: 'Only you can see this' }
      ]
    },
    {
      id: 'location_sharing',
      title: 'Location Sharing',
      description: 'Share your current location for better recommendations',
      value: 'private',
      options: [
        { value: 'public', label: 'Always Share', description: 'Always share your location' },
        { value: 'friends', label: 'When Using App', description: 'Only when actively using the app' },
        { value: 'private', label: 'Never Share', description: 'Never share your location' }
      ]
    }
  ]);

  const [dataSettings, setDataSettings] = useState({
    analytics: true,
    marketing: false,
    personalization: true,
    thirdParty: false
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const updatePrivacySetting = (id: string, value: 'public' | 'friends' | 'private') => {
    setPrivacySettings(prev => 
      prev.map(setting => 
        setting.id === id ? { ...setting, value } : setting
      )
    );
  };

  const updateDataSetting = (key: string, value: boolean) => {
    setDataSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    
    try {
      // In a real app, you would save to backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      setMessage('Privacy settings saved successfully!');
      setMessageType('success');
    } catch (error) {
      setMessage('Failed to save privacy settings. Please try again.');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadData = async () => {
    setIsLoading(true);
    
    try {
      // In a real app, you would generate and download user data
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      setMessage('Your data export has been sent to your email address.');
      setMessageType('success');
    } catch (error) {
      setMessage('Failed to export data. Please try again.');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    
    try {
      // In a real app, you would delete the account
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      setMessage('Account deletion request submitted. You will receive a confirmation email.');
      setMessageType('success');
      setShowDeleteConfirm(false);
    } catch (error) {
      setMessage('Failed to submit deletion request. Please try again.');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link 
                href="/settings"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Settings
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Privacy Settings</h1>
          </div>
          <p className="text-gray-600">
            Control your privacy and data sharing preferences
          </p>
        </div>

        {message && (
          <div className={`p-4 rounded-xl mb-6 ${
            messageType === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5" />
              <span>{message}</span>
            </div>
          </div>
        )}

        {/* Privacy Controls */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-6">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
              <Eye className="w-5 h-5 text-purple-500" />
              <span>Visibility Settings</span>
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Control who can see your information and activity
            </p>
          </div>
          <div className="p-6 space-y-6">
            {privacySettings.map((setting) => (
              <div key={setting.id} className="border border-gray-100 rounded-xl p-4">
                <div className="mb-4">
                  <h3 className="font-medium text-gray-900">{setting.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{setting.description}</p>
                </div>
                <div className="grid gap-3">
                  {setting.options.map((option) => (
                    <label key={option.value} className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name={setting.id}
                        value={option.value}
                        checked={setting.value === option.value}
                        onChange={(e) => updatePrivacySetting(setting.id, e.target.value as any)}
                        className="mt-1 w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">{option.label}</span>
                          {option.value === 'public' && <Globe className="w-4 h-4 text-green-500" />}
                          {option.value === 'friends' && <Users className="w-4 h-4 text-yellow-500" />}
                          {option.value === 'private' && <Lock className="w-4 h-4 text-red-500" />}
                        </div>
                        <p className="text-sm text-gray-600">{option.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Data Usage Settings */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-6">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-blue-500" />
              <span>Data Usage</span>
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Control how your data is used to improve your experience
            </p>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <h4 className="font-medium text-gray-900">Analytics & Performance</h4>
                <p className="text-sm text-gray-600">Help us improve the app with anonymous usage data</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={dataSettings.analytics}
                  onChange={(e) => updateDataSetting('analytics', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <h4 className="font-medium text-gray-900">Marketing Communications</h4>
                <p className="text-sm text-gray-600">Use my data to show relevant offers and promotions</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={dataSettings.marketing}
                  onChange={(e) => updateDataSetting('marketing', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <h4 className="font-medium text-gray-900">Personalization</h4>
                <p className="text-sm text-gray-600">Customize recommendations based on your preferences</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={dataSettings.personalization}
                  onChange={(e) => updateDataSetting('personalization', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <h4 className="font-medium text-gray-900">Third-party Sharing</h4>
                <p className="text-sm text-gray-600">Share anonymized data with trusted partners</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={dataSettings.thirdParty}
                  onChange={(e) => updateDataSetting('thirdParty', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Data Rights */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
              <Download className="w-5 h-5 text-green-500" />
              <span>Data Rights</span>
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Manage your personal data and account
            </p>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
              <div>
                <h4 className="font-medium text-gray-900">Download Your Data</h4>
                <p className="text-sm text-gray-600">Get a copy of all your data in our system</p>
              </div>
              <button
                onClick={handleDownloadData}
                disabled={isLoading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                Download
              </button>
            </div>
            <div className="flex items-center justify-between p-4 border border-red-200 rounded-xl bg-red-50">
              <div>
                <h4 className="font-medium text-red-900">Delete Account</h4>
                <p className="text-sm text-red-700">Permanently delete your account and all data</p>
              </div>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSaveSettings}
            disabled={isLoading}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Saving...</span>
              </div>
            ) : (
              'Save Privacy Settings'
            )}
          </button>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md mx-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Account</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Deleting...' : 'Delete Account'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
