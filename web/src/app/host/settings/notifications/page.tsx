'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bell, ArrowLeft, Check, Mail, MessageSquare, Calendar, Star, Heart, Shield } from 'lucide-react';
import { useAuth } from '../../../../contexts/AuthContext';

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
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const [notifications, setNotifications] = useState<NotificationSetting[]>([
    {
      id: 'booking_confirmations',
      title: 'Booking Confirmations',
      description: 'Get notified when your bookings are confirmed or updated',
      icon: Calendar,
      email: true,
      push: true,
      sms: true,
      category: 'essential'
    },
    {
      id: 'payment_updates',
      title: 'Payment Updates',
      description: 'Notifications about payments, refunds, and billing',
      icon: Shield,
      email: true,
      push: true,
      sms: false,
      category: 'essential'
    },
    {
      id: 'messages',
      title: 'Messages',
      description: 'New messages from hosts, travelers, and support',
      icon: MessageSquare,
      email: true,
      push: true,
      sms: false,
      category: 'essential'
    },
    {
      id: 'reviews',
      title: 'Reviews & Ratings',
      description: 'When someone leaves a review or rating for you',
      icon: Star,
      email: true,
      push: true,
      sms: false,
      category: 'updates'
    },
    {
      id: 'favorites',
      title: 'Favorites & Wishlist',
      description: 'Updates about your saved experiences and wishlists',
      icon: Heart,
      email: false,
      push: true,
      sms: false,
      category: 'updates'
    },
    {
      id: 'promotions',
      title: 'Promotions & Deals',
      description: 'Special offers, discounts, and promotional content',
      icon: Bell,
      email: false,
      push: false,
      sms: false,
      category: 'marketing'
    },
    {
      id: 'newsletter',
      title: 'Newsletter',
      description: 'Weekly newsletter with travel tips and featured experiences',
      icon: Mail,
      email: false,
      push: false,
      sms: false,
      category: 'marketing'
    }
  ]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const updateNotification = (id: string, type: 'email' | 'push' | 'sms', value: boolean) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, [type]: value }
          : notification
      )
    );
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    
    try {
      // In a real app, you would save to backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      setMessage('Notification preferences saved successfully!');
      setMessageType('success');
    } catch (error) {
      setMessage('Failed to save notification preferences. Please try again.');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const getNotificationsByCategory = (category: string) => {
    return notifications.filter(notification => notification.category === category);
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
                href="/host/settings"
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
            <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Notification Preferences</h1>
          </div>
          <p className="text-gray-600">
            Choose how and when you want to receive notifications
          </p>
        </div>

        {message && (
          <div className={`p-4 rounded-xl mb-6 ${
            messageType === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            <div className="flex items-center space-x-2">
              <Check className="w-5 h-5" />
              <span>{message}</span>
            </div>
          </div>
        )}

        {/* Essential Notifications */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-6">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
              <Shield className="w-5 h-5 text-red-500" />
              <span>Essential Notifications</span>
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Important updates you need to know about (cannot be turned off)
            </p>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left">
                    <th className="text-sm font-medium text-gray-600 pb-4">Notification</th>
                    <th className="text-sm font-medium text-gray-600 pb-4 text-center w-20">Email</th>
                    <th className="text-sm font-medium text-gray-600 pb-4 text-center w-20">Push</th>
                    <th className="text-sm font-medium text-gray-600 pb-4 text-center w-20">SMS</th>
                  </tr>
                </thead>
                <tbody className="space-y-4">
                  {getNotificationsByCategory('essential').map((notification, index) => {
                    const IconComponent = notification.icon;
                    return (
                      <tr key={notification.id} className={index > 0 ? 'border-t border-gray-100' : ''}>
                        <td className="py-4">
                          <div className="flex items-start space-x-3">
                            <div className="p-2 bg-red-100 rounded-lg">
                              <IconComponent className="w-4 h-4 text-red-600" />
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">{notification.title}</h3>
                              <p className="text-sm text-gray-600">{notification.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 text-center">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notification.email}
                              onChange={(e) => updateNotification(notification.id, 'email', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </td>
                        <td className="py-4 text-center">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notification.push}
                              onChange={(e) => updateNotification(notification.id, 'push', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </td>
                        <td className="py-4 text-center">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notification.sms}
                              onChange={(e) => updateNotification(notification.id, 'sms', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* General Updates */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-6">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
              <Bell className="w-5 h-5 text-blue-500" />
              <span>General Updates</span>
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Stay informed about your activity and interactions
            </p>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left">
                    <th className="text-sm font-medium text-gray-600 pb-4">Notification</th>
                    <th className="text-sm font-medium text-gray-600 pb-4 text-center w-20">Email</th>
                    <th className="text-sm font-medium text-gray-600 pb-4 text-center w-20">Push</th>
                    <th className="text-sm font-medium text-gray-600 pb-4 text-center w-20">SMS</th>
                  </tr>
                </thead>
                <tbody className="space-y-4">
                  {getNotificationsByCategory('updates').map((notification, index) => {
                    const IconComponent = notification.icon;
                    return (
                      <tr key={notification.id} className={index > 0 ? 'border-t border-gray-100' : ''}>
                        <td className="py-4">
                          <div className="flex items-start space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <IconComponent className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">{notification.title}</h3>
                              <p className="text-sm text-gray-600">{notification.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 text-center">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notification.email}
                              onChange={(e) => updateNotification(notification.id, 'email', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </td>
                        <td className="py-4 text-center">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notification.push}
                              onChange={(e) => updateNotification(notification.id, 'push', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </td>
                        <td className="py-4 text-center">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notification.sms}
                              onChange={(e) => updateNotification(notification.id, 'sms', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Marketing Communications */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
              <Mail className="w-5 h-5 text-purple-500" />
              <span>Marketing Communications</span>
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Promotional content, deals, and newsletters
            </p>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left">
                    <th className="text-sm font-medium text-gray-600 pb-4">Notification</th>
                    <th className="text-sm font-medium text-gray-600 pb-4 text-center w-20">Email</th>
                    <th className="text-sm font-medium text-gray-600 pb-4 text-center w-20">Push</th>
                    <th className="text-sm font-medium text-gray-600 pb-4 text-center w-20">SMS</th>
                  </tr>
                </thead>
                <tbody className="space-y-4">
                  {getNotificationsByCategory('marketing').map((notification, index) => {
                    const IconComponent = notification.icon;
                    return (
                      <tr key={notification.id} className={index > 0 ? 'border-t border-gray-100' : ''}>
                        <td className="py-4">
                          <div className="flex items-start space-x-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                              <IconComponent className="w-4 h-4 text-purple-600" />
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">{notification.title}</h3>
                              <p className="text-sm text-gray-600">{notification.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 text-center">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notification.email}
                              onChange={(e) => updateNotification(notification.id, 'email', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </td>
                        <td className="py-4 text-center">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notification.push}
                              onChange={(e) => updateNotification(notification.id, 'push', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </td>
                        <td className="py-4 text-center">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notification.sms}
                              onChange={(e) => updateNotification(notification.id, 'sms', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSaveSettings}
            disabled={isLoading}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Saving...</span>
              </div>
            ) : (
              'Save Preferences'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
