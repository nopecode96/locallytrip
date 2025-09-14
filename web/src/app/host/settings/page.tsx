'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, Key, Bell, Lock, User, ChevronRight, Settings, CreditCard, Globe } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

const settingsItems = [
  {
    title: 'Host Profile',
    description: 'Update your host profile and information',
    icon: User,
    href: '/host/profile',
    color: 'from-green-500 to-emerald-500'
  },
  {
    title: 'Account Settings',
    description: 'Manage your basic account information',
    icon: Settings,
    href: '/host/settings/account',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    title: 'Change Password',
    description: 'Update your password and security settings',
    icon: Key,
    href: '/host/settings/password',
    color: 'from-red-500 to-pink-500'
  },
  {
    title: 'Notifications',
    description: 'Manage your notification preferences',
    icon: Bell,
    href: '/host/settings/notifications',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    title: 'Privacy Settings',
    description: 'Control your privacy and data sharing',
    icon: Lock,
    href: '/host/settings/privacy',
    color: 'from-purple-500 to-indigo-500'
  },
  {
    title: 'Payment & Billing',
    description: 'Manage payment methods and earnings',
    icon: CreditCard,
    href: '/host/settings/payment',
    color: 'from-emerald-500 to-teal-500'
  },
  {
    title: 'Language & Region',
    description: 'Configure language and regional preferences',
    icon: Globe,
    href: '/host/settings/language',
    color: 'from-cyan-500 to-blue-500'
  },
  {
    title: 'Security & Login',
    description: 'Manage account security and active sessions',
    icon: Shield,
    href: '/host/settings/security',
    color: 'from-gray-500 to-slate-500'
  }
];

export default function HostSettingsPage() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Host Settings</h1>
          </div>
          <p className="text-gray-600">
            Manage your host account settings and preferences
          </p>
        </div>

        {/* User Info Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xl font-bold">
                  {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900">
                {user.name || user.email}
              </h3>
              <p className="text-gray-600">{user.email}</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  user.role === 'host' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {user.role === 'host' ? '🏠 Host' : '✈️ Traveller'}
                </span>
                <span className="text-green-600 text-sm">● Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {settingsItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className={`p-3 bg-gradient-to-r ${item.color} rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 text-sm mt-1">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </div>
                <div className={`h-1 bg-gradient-to-r ${item.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}></div>
              </Link>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link
              href="/host/profile"
              className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <User className="w-5 h-5" />
              <span>Edit Profile</span>
            </Link>
            <Link
              href="/host/settings/password"
              className="flex items-center justify-center space-x-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-3 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <Shield className="w-5 h-5" />
              <span>Security Check</span>
            </Link>
          </div>
        </div>

        {/* Support Section */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Need Help?</h3>
            <p className="text-gray-600 mb-4">
              Our support team is here to help you with any questions or issues.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/support"
                className="inline-flex items-center justify-center px-4 py-2 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-colors border border-blue-200"
              >
                Contact Support
              </Link>
              <Link
                href="/help"
                className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                Help Center
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  );
}
