'use client';

import { useState } from 'react';
import { Globe, Clock } from 'lucide-react';

export default function LanguageSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [settings, setSettings] = useState({
    language: 'en',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    timezone: 'Asia/Jakarta',
    currency: 'IDR',
    numberFormat: 'id-ID'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // TODO: Implement API call to update language settings
      console.log('Updating language settings:', settings);
      setTimeout(() => {
        setMessage('Language and region settings updated successfully');
        setLoading(false);
      }, 1000);
    } catch (error) {
      setMessage('Failed to update language settings');
      console.error('Update error:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <span>Host Settings</span>
            <span>/</span>
            <span className="text-purple-600">Language & Region</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Language & Region</h1>
          <p className="text-gray-600 mt-2">
            Configure your language, timezone, and regional preferences
          </p>
        </div>

        {/* Success/Error Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('success') 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {message}
          </div>
        )}

        <div className="space-y-8">
          {/* Language & Localization */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Globe className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Language & Localization</h2>
                  <p className="text-gray-600 mt-1">Choose your preferred language and locale settings</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Language */}
                <div>
                  <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
                    Interface Language
                  </label>
                  <select
                    id="language"
                    name="language"
                    value={settings.language}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="en">English</option>
                    <option value="id">Bahasa Indonesia</option>
                    <option value="zh">中文 (Chinese)</option>
                    <option value="ja">日本語 (Japanese)</option>
                    <option value="ko">한국어 (Korean)</option>
                    <option value="th">ไทย (Thai)</option>
                    <option value="vi">Tiếng Việt (Vietnamese)</option>
                  </select>
                  <p className="text-sm text-gray-500 mt-1">
                    This affects the language of the interface and emails you receive
                  </p>
                </div>

                {/* Currency */}
                <div>
                  <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Currency
                  </label>
                  <select
                    id="currency"
                    name="currency"
                    value={settings.currency}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="IDR">Indonesian Rupiah (IDR)</option>
                    <option value="USD">US Dollar (USD)</option>
                    <option value="EUR">Euro (EUR)</option>
                    <option value="GBP">British Pound (GBP)</option>
                    <option value="SGD">Singapore Dollar (SGD)</option>
                    <option value="MYR">Malaysian Ringgit (MYR)</option>
                    <option value="THB">Thai Baht (THB)</option>
                    <option value="VND">Vietnamese Dong (VND)</option>
                  </select>
                </div>
              </div>

              {/* Number Format */}
              <div>
                <label htmlFor="numberFormat" className="block text-sm font-medium text-gray-700 mb-2">
                  Number Format
                </label>
                <select
                  id="numberFormat"
                  name="numberFormat"
                  value={settings.numberFormat}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="id-ID">Indonesian (1.234.567,89)</option>
                  <option value="en-US">US (1,234,567.89)</option>
                  <option value="en-GB">UK (1,234,567.89)</option>
                  <option value="de-DE">German (1.234.567,89)</option>
                  <option value="fr-FR">French (1 234 567,89)</option>
                </select>
              </div>
            </form>
          </div>

          {/* Time & Date Settings */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Time & Date Settings</h2>
                  <p className="text-gray-600 mt-1">Configure how dates and times are displayed</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Timezone */}
                <div>
                  <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-2">
                    Timezone
                  </label>
                  <select
                    id="timezone"
                    name="timezone"
                    value={settings.timezone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="Asia/Jakarta">Asia/Jakarta (WIB) GMT+7</option>
                    <option value="Asia/Makassar">Asia/Makassar (WITA) GMT+8</option>
                    <option value="Asia/Jayapura">Asia/Jayapura (WIT) GMT+9</option>
                    <option value="Asia/Singapore">Asia/Singapore (SGT) GMT+8</option>
                    <option value="Asia/Bangkok">Asia/Bangkok (ICT) GMT+7</option>
                    <option value="Asia/Kuala_Lumpur">Asia/Kuala_Lumpur (MYT) GMT+8</option>
                    <option value="Asia/Manila">Asia/Manila (PHT) GMT+8</option>
                    <option value="Asia/Tokyo">Asia/Tokyo (JST) GMT+9</option>
                    <option value="Asia/Seoul">Asia/Seoul (KST) GMT+9</option>
                    <option value="Australia/Sydney">Australia/Sydney (AEST) GMT+10</option>
                    <option value="UTC">UTC GMT+0</option>
                    <option value="America/New_York">America/New_York (EST) GMT-5</option>
                    <option value="Europe/London">Europe/London (GMT) GMT+0</option>
                  </select>
                </div>

                {/* Time Format */}
                <div>
                  <label htmlFor="timeFormat" className="block text-sm font-medium text-gray-700 mb-2">
                    Time Format
                  </label>
                  <select
                    id="timeFormat"
                    name="timeFormat"
                    value={settings.timeFormat}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="12h">12-hour (2:30 PM)</option>
                    <option value="24h">24-hour (14:30)</option>
                  </select>
                </div>
              </div>

              {/* Date Format */}
              <div>
                <label htmlFor="dateFormat" className="block text-sm font-medium text-gray-700 mb-2">
                  Date Format
                </label>
                <select
                  id="dateFormat"
                  name="dateFormat"
                  value={settings.dateFormat}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY (31/12/2024)</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY (12/31/2024)</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD (2024-12-31)</option>
                  <option value="DD-MM-YYYY">DD-MM-YYYY (31-12-2024)</option>
                  <option value="MMM DD, YYYY">MMM DD, YYYY (Dec 31, 2024)</option>
                </select>
              </div>

              {/* Preview */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Preview</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>Current time: <span className="font-medium">
                    {settings.timeFormat === '12h' ? '2:30 PM' : '14:30'}
                  </span></p>
                  <p>Today's date: <span className="font-medium">
                    {settings.dateFormat === 'DD/MM/YYYY' && '31/12/2024'}
                    {settings.dateFormat === 'MM/DD/YYYY' && '12/31/2024'}
                    {settings.dateFormat === 'YYYY-MM-DD' && '2024-12-31'}
                    {settings.dateFormat === 'DD-MM-YYYY' && '31-12-2024'}
                    {settings.dateFormat === 'MMM DD, YYYY' && 'Dec 31, 2024'}
                  </span></p>
                  <p>Number: <span className="font-medium">
                    {settings.numberFormat === 'id-ID' && '1.234.567,89'}
                    {settings.numberFormat === 'en-US' && '1,234,567.89'}
                    {settings.numberFormat === 'en-GB' && '1,234,567.89'}
                    {settings.numberFormat === 'de-DE' && '1.234.567,89'}
                    {settings.numberFormat === 'fr-FR' && '1 234 567,89'}
                  </span></p>
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
