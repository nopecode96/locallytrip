'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Check, Mail, MessageSquare, Calendar, Star, Heart, Shield, AlertCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '../../../../contexts/AuthContext';
import { useNotificationSettings } from '../../../../hooks/useNotificationSettings';

interface NotificationRowProps {
  notification: NotificationSetting;
  onUpdate: (id: string, type: 'email' | 'push' | 'sms', value: boolean) => Promise<void>;
  disabled: boolean;
}

function NotificationRow({ notification, onUpdate, disabled }: NotificationRowProps) {
  const Icon = notification.icon;
  
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <Icon className="w-6 h-6 text-gray-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900">{notification.title}</h4>
          <p className="text-sm text-gray-600 mt-1">{notification.description}</p>
          
          <div className="mt-3 grid grid-cols-3 gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={notification.email}
                onChange={(e) => onUpdate(notification.id, 'email', e.target.checked)}
                disabled={disabled}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
              />
              <span className="ml-2 text-sm text-gray-700">Email</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={notification.push}
                onChange={(e) => onUpdate(notification.id, 'push', e.target.checked)}
                disabled={disabled}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
              />
              <span className="ml-2 text-sm text-gray-700">Push</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={notification.sms}
                onChange={(e) => onUpdate(notification.id, 'sms', e.target.checked)}
                disabled={disabled}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
              />
              <span className="ml-2 text-sm text-gray-700">SMS</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  icon: any;
  email: boolean;
  push: boolean;
  sms: boolean;
  category: 'essential' | 'updates' | 'marketing';
}

export default function NotificationSettingsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { 
    settings, 
    loading: settingsLoading, 
    error, 
    updateSettings, 
    resetSettings,
    refetch 
  } = useNotificationSettings();
  
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [isSaving, setIsSaving] = useState(false);

  // Define notification categories with their metadata
  const notificationMetadata = [
    {
      id: 'booking_confirmations',
      title: 'Booking Confirmations',
      description: 'Get notified when your bookings are confirmed or updated',
      icon: Calendar,
      category: 'essential' as const
    },
    {
      id: 'payment_updates',
      title: 'Payment Updates',
      description: 'Notifications about payments, refunds, and billing',
      icon: Shield,
      category: 'essential' as const
    },
    {
      id: 'messages',
      title: 'Messages',
      description: 'New messages from hosts, travelers, and support',
      icon: MessageSquare,
      category: 'essential' as const
    },
    {
      id: 'reviews',
      title: 'Reviews & Ratings',
      description: 'When someone leaves a review or rating for you',
      icon: Star,
      category: 'updates' as const
    },
    {
      id: 'favorites',
      title: 'Favorites & Wishlist',
      description: 'Updates about your saved experiences and wishlists',
      icon: Heart,
      category: 'updates' as const
    },
    {
      id: 'promotions',
      title: 'Promotions & Deals',
      description: 'Special offers, discounts, and promotional content',
      icon: Bell,
      category: 'marketing' as const
    },
    {
      id: 'newsletter',
      title: 'Newsletter',
      description: 'Weekly newsletter with travel tips and featured experiences',
      icon: Mail,
      category: 'marketing' as const
    }
  ];

  // Convert API settings to component format
  const notifications: NotificationSetting[] = notificationMetadata.map(meta => ({
    ...meta,
    email: settings?.preferences[meta.id as keyof typeof settings.preferences]?.email || false,
    push: settings?.preferences[meta.id as keyof typeof settings.preferences]?.push || false,
    sms: settings?.preferences[meta.id as keyof typeof settings.preferences]?.sms || false,
  }));

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Auto-hide success messages
  useEffect(() => {
    if (message && messageType === 'success') {
      const timer = setTimeout(() => {
        setMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, messageType]);

  const updateNotification = async (id: string, type: 'email' | 'push' | 'sms', value: boolean) => {
    if (!settings) return;

    setIsSaving(true);
    
    // Create the update payload
    const preferences = {
      [id]: {
        ...settings.preferences[id as keyof typeof settings.preferences],
        [type]: value
      }
    };

    const success = await updateSettings(preferences);
    
    if (success) {
      setMessage('Notification preference updated successfully!');
      setMessageType('success');
    } else {
      setMessage('Failed to update notification preference. Please try again.');
      setMessageType('error');
    }
    
    setIsSaving(false);
  };

  const handleResetSettings = async () => {
    if (!confirm('Are you sure you want to reset all notification settings to default values?')) {
      return;
    }

    setIsSaving(true);
    const success = await resetSettings();
    
    if (success) {
      setMessage('Notification settings reset to defaults successfully!');
      setMessageType('success');
    } else {
      setMessage('Failed to reset notification settings. Please try again.');
      setMessageType('error');
    }
    
    setIsSaving(false);
  };

  const getNotificationsByCategory = (category: string) => {
    return notifications.filter(notification => notification.category === category);
  };

  // Loading state
  if (authLoading || settingsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return null;
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center h-16">
              <h1 className="text-xl font-semibold text-gray-900">Notification Settings</h1>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
              <div>
                <h3 className="text-lg font-medium text-red-800">Error Loading Settings</h3>
                <p className="text-red-700 mt-1">{error}</p>
                <button
                  onClick={refetch}
                  className="mt-3 inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success/Error Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${messageType === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            <div className="flex items-center">
              {messageType === 'success' ? (
                <Check className="w-5 h-5 mr-3" />
              ) : (
                <AlertCircle className="w-5 h-5 mr-3" />
              )}
              <span className="font-medium">{message}</span>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Notification Preferences</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Choose how you want to be notified about important updates and activities.
                </p>
                {settings && (
                  <p className="text-xs text-green-600 mt-2">
                    ✅ Loaded from database • Last updated: {new Date(settings.metadata.updatedAt).toLocaleString()}
                  </p>
                )}
              </div>
              <button
                onClick={handleResetSettings}
                disabled={isSaving}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset to Defaults
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Essential Notifications */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-red-600" />
                Essential Notifications
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                These notifications are important for your account security and booking management.
              </p>
              <div className="space-y-4">
                {getNotificationsByCategory('essential').map((notification) => (
                  <NotificationRow
                    key={notification.id}
                    notification={notification}
                    onUpdate={updateNotification}
                    disabled={isSaving}
                  />
                ))}
              </div>
            </div>

            {/* Updates Notifications */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Bell className="w-5 h-5 mr-2 text-blue-600" />
                Updates & Activity
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Stay informed about reviews, favorites, and other activities related to your profile.
              </p>
              <div className="space-y-4">
                {getNotificationsByCategory('updates').map((notification) => (
                  <NotificationRow
                    key={notification.id}
                    notification={notification}
                    onUpdate={updateNotification}
                    disabled={isSaving}
                  />
                ))}
              </div>
            </div>

            {/* Marketing Notifications */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Mail className="w-5 h-5 mr-2 text-green-600" />
                Marketing & Promotions
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Optional notifications about promotions, deals, and our newsletter.
              </p>
              <div className="space-y-4">
                {getNotificationsByCategory('marketing').map((notification) => (
                  <NotificationRow
                    key={notification.id}
                    notification={notification}
                    onUpdate={updateNotification}
                    disabled={isSaving}
                  />
                ))}
              </div>
            </div>

            {/* Global Settings */}
            {settings?.globalSettings && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Global Settings</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.globalSettings.emailEnabled}
                        onChange={(e) => updateSettings({}, { emailEnabled: e.target.checked })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700">Email Notifications</span>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.globalSettings.pushEnabled}
                        onChange={(e) => updateSettings({}, { pushEnabled: e.target.checked })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700">Push Notifications</span>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.globalSettings.smsEnabled}
                        onChange={(e) => updateSettings({}, { smsEnabled: e.target.checked })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700">SMS Notifications</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Changes are saved automatically. You can update your preferences anytime.
          </p>
        </div>
      </div>
    </div>
  );
}
